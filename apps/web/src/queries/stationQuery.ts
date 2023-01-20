import { prisma } from '@citybiker/db'

export async function stationQuery(input: number) {
  const avgDepartureStatsP = prisma.journey.aggregate({
    where: {
      departureStationId: input
    },
    _avg: {
      coveredDistance: true
    }
  })

  const avgReturnStatsP = prisma.journey.aggregate({
    where: {
      returnStationId: input
    },
    _avg: {
      coveredDistance: true
    }
  })

  const countsP = prisma.station.findFirst({
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

  const [avgDepartureStats, avgReturnStats, counts] = await Promise.all([
    avgDepartureStatsP,
    avgReturnStatsP,
    countsP
  ])

  return { counts, avgReturnStats, avgDepartureStats }
}
