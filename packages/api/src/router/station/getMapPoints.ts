import { PrismaClient } from '@citybiker/db'

export async function getMapPoints(prisma: PrismaClient) {
  return prisma.station.findMany({
    select: {
      x: true,
      y: true,
      id: true,
      finName: true,
      sweName: true
    }
  })
}
