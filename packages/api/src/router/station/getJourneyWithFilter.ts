import { PrismaClient } from '@citybiker/db'
import { stationQuery } from '@citybiker/web/src/queries/stationQuery'
import { generateQuey, top5List } from './departureQueries'

export async function getJourneyWithFilter(
  prisma: PrismaClient,
  input: {
    month: number
    id: number
  }
) {
  const gteDate = new Date(`2021-${input.month}-01`)
  const ltDate = new Date(`2021-${input.month + 1}-01`)

  const stationsdeparture = prisma.journey.findMany({
    where: {
      departureStationId: input.id,
      departure: {
        gte: gteDate,
        lt: ltDate
      }
    }
  })

  const stationsarrival = prisma.journey.findMany({
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

  const departureRawAggregation = prisma.journey.aggregateRaw(departureQuery)
  const returnRawAggregation = prisma.journey.aggregateRaw(returnQuery)

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
}
