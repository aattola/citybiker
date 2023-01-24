import { z } from 'zod'
import { Prisma, prisma, Journey } from '@citybiker/db'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { createJourney, journeyCreateParser } from './journey/create'

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
  create: publicProcedure
    .input(journeyCreateParser)
    .mutation(async ({ ctx, input }) => {
      return await createJourney(ctx.prisma, input)
    }),

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const rawSearch = await ctx.prisma.journey.aggregateRaw({
      pipeline: [
        {
          $search: {
            index: 'journeyIndex',
            text: {
              query: input,
              path: ['returnStationName', 'departStationName', '_id']
            }
          }
        },
        {
          $limit: 10
        }
      ]
    })

    return rawSearch as unknown as Journey[]
  }),

  getAll: publicProcedure.input(zodInput).query(async ({ input }) => {
    return getJourneysWithCursor(input)
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.station.findFirst({ where: { id: input } })
  })
})
