import { PrismaClient } from '@citybiker/db'
import { stationParser } from '@citybiker/db/src/parsers'
import { z } from 'zod'

const parser = stationParser.omit({
  id: true,
  sweName: true,
  sweAddress: true,
  sweCity: true
})

type Station = z.infer<typeof parser>
export async function createStation(prisma: PrismaClient, station: Station) {
  // if id collision this will fail (id is unique)

  return prisma.station.create({
    data: {
      ...station,
      sweName: '',
      sweAddress: '',
      sweCity: '',
      id: Math.floor(Math.random() * 10000)
    }
  })
}
