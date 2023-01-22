import { z } from 'zod'
import { Prisma, prisma } from '@citybiker/db'
import { createTRPCRouter, publicProcedure } from '../trpc'

const zodInput = z.object({
  take: z.number().min(1).max(50).default(10),
  cursor: z.string().nullable().optional()
})

export async function getJourneysWithCursor(input: {
  cursor?: z.infer<typeof zodInput>['cursor']
  take: number
}) {
  const query: Prisma.JourneyFindManyArgs = {
    skip: 1,
    take: input.take,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: { id: 'desc' }
  }

  return await prisma.journey.findMany(query)
}

export const journeyRouter = createTRPCRouter({
  getAll: publicProcedure.input(zodInput).query(async ({ ctx, input }) => {
    return getJourneysWithCursor(input)
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.station.findFirst({ where: { id: input } })
  })
})
