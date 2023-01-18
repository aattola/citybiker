import { z } from 'zod'
import { Prisma } from '@citybiker/db'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'

type top5List = { _id: number; count: number; name: [string] }[]

function generateQuey(where: string, input: number) {
  return {
    pipeline: [
      {
        $match: {
          [where]: input
        }
      },
      {
        $group: {
          _id: '$returnStationId',
          name: {
            $addToSet: '$returnStationName'
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

export const stationRouter = createTRPCRouter({
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

      const tr = await Promise.all([stationsdeparture, stationsarrival])

      return {
        starting: tr[0].length,
        ending: tr[1].length,
        month: gteDate.getMonth() + 1,
        monthName: gteDate.toLocaleString('en-US', { month: 'long' })
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

  getStatsById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.station.findFirst({
        where: { id: input },
        include: {
          _count: {
            select: {
              endedJourneys: true,
              startedJourneys: true
            }
          }
        }
      })
    }),

  byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    // The average distance of a journey starting from the station

    // const avgDepartureStatsPromise = ctx.prisma.journey.aggregate({
    //   where: {
    //     departureStationId: input
    //   },
    //   _avg: {
    //     coveredDistance: true,
    //     duration: true
    //   }
    // })

    // Top 5 most popular return stations for journeys starting from the station with prisma

    /**
     * Top 5 most popular return stations for journeys starting from the station with
     *
     * Ottaa lähtöasema (departureStationId) on input
     * katsoa kaikki journeyt jossa departureStationId = input
     * Laskea nämä kaikki yhteen groupBy returnStationId
     * Laskea monta kertaa per yksi tapahtuma
     * Ja palauttaa tämä sorted by descenfing order
     *
     */

    // const topReturnStationsSQL = await ctx.prisma.$queryRaw`
    //   SELECT
    //     returnStationId,
    //     COUNT(returnStationId) AS count
    //   FROM Journey
    //   WHERE departureStationId = ${input}
    //   GROUP BY departureStationId
    //   ORDER BY count DESC
    //   LIMIT 5
    //   `

    // const top5Departure = await ctx.prisma.journey.groupBy({
    //   where: {
    //     departureStationId: input
    //   },
    //   by: ['returnStationId']
    // })

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
