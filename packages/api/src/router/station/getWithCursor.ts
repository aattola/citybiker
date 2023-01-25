import { PrismaClient, Prisma } from '@citybiker/db'

export async function getStationsWithCursor(
  prisma: PrismaClient,
  input: {
    cursor?: number | null
    take: number
  }
) {
  const query: Prisma.StationFindManyArgs = {
    skip: 1,
    take: input.take,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: { id: 'desc' }
  }

  return await prisma.station.findMany(query)
}
