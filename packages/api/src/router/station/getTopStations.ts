import { PrismaClient } from '@citybiker/db'
import { generateQuey, top5List } from './departureQueries'

export async function getTopStations(prisma: PrismaClient, id: number) {
  const departureQuery = generateQuey('departureStationId', id)
  const returnQuery = generateQuey('returnStationId', id)

  const departureRawAggregation = prisma.journey.aggregateRaw(departureQuery)
  const returnRawAggregation = prisma.journey.aggregateRaw(returnQuery)

  const promises = await Promise.all([
    departureRawAggregation,
    returnRawAggregation
  ])

  return {
    startingFrom: promises[0] as unknown as top5List,
    endingAt: promises[1] as unknown as top5List
  }
}
