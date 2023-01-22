import { prisma, Prisma } from '@citybiker/db'

function generateQuery(
  where: string,
  input: number,
  month?: number
): Prisma.JourneyAggregateArgs {
  const whereQuery = month
    ? {
        [where]: input,
        departure: {
          gte: new Date(`2021-${month}-01`),
          lt: new Date(`2021-${month + 1}-01`)
        }
      }
    : {
        [where]: input
      }

  return {
    where: whereQuery,
    _avg: {
      coveredDistance: true
    }
  }
}
export async function stationQuery(input: number, month?: number) {
  const departureQuery = generateQuery('departureStationId', input, month)
  const returnQuery = generateQuery('returnStationId', input, month)

  const avgDepartureStatsP = prisma.journey.aggregate(departureQuery)
  const avgReturnStatsP = prisma.journey.aggregate(returnQuery)

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
