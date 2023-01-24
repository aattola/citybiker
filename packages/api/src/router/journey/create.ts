import { PrismaClient } from '@citybiker/db'
import { journeyParser } from '@citybiker/db/src/parsers'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const journeyCreateParser = journeyParser.omit({
  returnStationName: true,
  departureStationName: true
})

type Journey = z.infer<typeof journeyCreateParser>
export async function createJourney(prisma: PrismaClient, journey: Journey) {
  if (journey.departure.getUTCSeconds() > journey.return.getUTCSeconds())
    throw new TRPCError({
      code: 'PARSE_ERROR',
      message: 'departure > return'
    })

  const departureStation = await prisma.station.findFirst({
    where: { id: journey.departureStationId }
  })

  if (!departureStation)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'departureStationId not found'
    })

  const returnStationName = await prisma.station.findFirst({
    where: { id: journey.returnStationId }
  })

  if (!returnStationName)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'returnStationId not found'
    })

  return prisma.journey.create({
    data: {
      ...journey,
      returnStationName: returnStationName.finName,
      departureStationName: departureStation.finName
    }
  })
}
