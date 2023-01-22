import { z } from 'zod'
import { Prisma } from '@citybiker/db'
import { TRPCError } from '@trpc/server'
import { stationQuery } from '@citybiker/web/src/queries/stationQuery'
import { createTRPCRouter, publicProcedure } from '../trpc'

type top5List = { _id: number; count: number; name: [string] }[]

function generateQuey(
  where: string,
  input: number,
  month?: {
    gteDate: Date
    ltDate: Date
  }
) {
  const whereInvert =
    where === 'departureStationId' ? 'returnStationId' : 'departureStationId'

  const whereInvertName =
    where === 'departureStationId'
      ? 'returnStationName'
      : 'departureStationName'

  const whereMonth = month
    ? {
        [where]: input,
        $expr: {
          $gte: [
            '$departure',
            {
              $dateFromString: {
                dateString: month.gteDate.toISOString()
              }
            }
          ]
        },
        // PROFESSIONAL RULE BREAKING AHEAD!! mongodb queries are weird
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore, eslint-disable-next-line no-dupe-keys
        // eslint-disable-next-line no-dupe-keys
        $expr: {
          $lt: [
            '$departure',
            {
              $dateFromString: {
                dateString: '2021-06-01T05:00:00.000Z'
              }
            }
          ]
        }
      }
    : { [where]: input }

  return {
    pipeline: [
      {
        $match: whereMonth
      },
      {
        $group: {
          _id: `$${whereInvert}`,
          name: {
            $addToSet: `$${whereInvertName}`
          },
          count: {
            $count: {}
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 5
      }
    ]
  }
}

type JourneySearchResult = {
  id: string
  finName: string
  finAddress: string
}

export const stationRouter = createTRPCRouter({
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const rawSearch = await ctx.prisma.station.aggregateRaw({
      pipeline: [
        {
          $search: {
            index: 'stationIndex',
            autocomplete: {
              query: input,
              path: 'finName',
              fuzzy: {},
              tokenOrder: 'any'
            }
          }
        },
        {
          $limit: 10
        }
      ]
    })

    return rawSearch as unknown as JourneySearchResult[]
  }),

  getAll: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).max(100).default(10),
        cursor: z.number().optional().nullable()
      })
    )
    .query(async ({ ctx, input }) => {
      const query: Prisma.StationFindManyArgs = {
        skip: 1,
        take: 100,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { id: 'desc' }
      }

      return await ctx.prisma.station.findMany(query)
    }),

  getAllMapPoints: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.station.findMany({
      select: {
        x: true,
        y: true,
        id: true,
        finName: true,
        sweName: true
      }
    })
  }),

  byIdFilteredByMonth: publicProcedure
    .input(
      z.object({
        id: z.number(),
        month: z.number().min(5).max(7) // dataset is only available for May, June and July 2021
      })
    )
    .query(async ({ ctx, input }) => {
      const gteDate = new Date(`2021-${input.month}-01`)
      const ltDate = new Date(`2021-${input.month + 1}-01`)

      const stationsdeparture = ctx.prisma.journey.findMany({
        where: {
          departureStationId: input.id,
          departure: {
            gte: gteDate,
            lt: ltDate
          }
        }
      })

      const stationsarrival = ctx.prisma.journey.findMany({
        where: {
          returnStationId: input.id,
          return: {
            gte: gteDate,
            lt: ltDate
          }
        }
      })

      const departureQuery = generateQuey('departureStationId', input.id, {
        gteDate,
        ltDate
      })
      const returnQuery = generateQuey('returnStationId', input.id, {
        gteDate,
        ltDate
      })

      const departureRawAggregation =
        ctx.prisma.journey.aggregateRaw(departureQuery)
      const returnRawAggregation = ctx.prisma.journey.aggregateRaw(returnQuery)

      const promises = await Promise.all([
        departureRawAggregation,
        returnRawAggregation
      ])

      const tr = await Promise.all([stationsdeparture, stationsarrival])

      const infoQuery = await stationQuery(input.id, input.month)

      return {
        starting: tr[0].length,
        ending: tr[1].length,
        month: gteDate.getMonth() + 1,
        monthName: gteDate.toLocaleString('en-US', { month: 'long' }),
        startingFrom: promises[0] as unknown as top5List,
        endingAt: promises[1] as unknown as top5List,
        avgDepartureStats: infoQuery.avgDepartureStats,
        avgReturnStats: infoQuery.avgReturnStats
      }
    }),

  getTopById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const departureQuery = generateQuey('departureStationId', input)
      const returnQuery = generateQuey('returnStationId', input)

      const departureRawAggregation =
        ctx.prisma.journey.aggregateRaw(departureQuery)
      const returnRawAggregation = ctx.prisma.journey.aggregateRaw(returnQuery)

      const promises = await Promise.all([
        departureRawAggregation,
        returnRawAggregation
      ])

      return {
        startingFrom: promises[0] as unknown as top5List,
        endingAt: promises[1] as unknown as top5List
      }
    }),

  byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const station = await ctx.prisma.station.findFirst({
      where: { id: input }
    })

    if (station === null)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Station not found',
        cause: 'Wrong ID'
      })

    return {
      ...station
    }
  })
})
