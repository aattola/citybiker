import { z } from 'zod'
import { PrismaClient, Prisma } from '@citybiker/db'

export const getAllInput = z.object({
  take: z.number().min(1).max(50).default(10),
  cursor: z.string().nullable().optional()
})

export async function getJourneysWithCursor(
  prisma: PrismaClient,
  input: {
    cursor?: z.infer<typeof getAllInput>['cursor']
    take: number
  }
) {
  const query: Prisma.JourneyFindManyArgs = {
    skip: 1,
    take: input.take,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: { id: 'desc' }
  }

  return prisma.journey.findMany(query)
}
