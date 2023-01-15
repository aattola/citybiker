import { z } from 'zod'
import { Prisma } from '@citybiker/db'
import { createTRPCRouter, publicProcedure } from '../trpc'

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

      const stations = await ctx.prisma.station.findMany(query)

      return stations
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

    return ctx.prisma.station.findFirst({
      where: { id: input },
      include: {
        _count: {
          select: {
            startedJourneys: true,
            endedJourneys: true
          }
        }
      }
    })
  })
})
