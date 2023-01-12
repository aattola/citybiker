import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const stationRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.station.findMany()
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.station.findFirst({ where: { id: input } })
  })
})
