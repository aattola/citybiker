import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { createJourney, journeyCreateParser } from './journey/create'
import { searchJourney } from './journey/search'
import { getAllInput, getJourneysWithCursor } from './journey/getWithCursor'

export const journeyRouter = createTRPCRouter({
  create: publicProcedure
    .input(journeyCreateParser)
    .mutation(async ({ ctx, input }) => {
      return await createJourney(ctx.prisma, input)
    }),

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return searchJourney(ctx.prisma, input)
  }),

  getAll: publicProcedure.input(getAllInput).query(async ({ ctx, input }) => {
    return getJourneysWithCursor(ctx.prisma, input)
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.station.findFirst({ where: { id: input } })
  })
})
