import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { stationParser } from '@citybiker/db/src/parsers'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { createStation } from './station/create'
import { searchStations } from './station/search'
import { getMapPoints } from './station/getMapPoints'
import { getJourneyWithFilter } from './station/getJourneyWithFilter'
import { getTopStations } from './station/getTopStations'
import { getStationsWithCursor } from './station/getWithCursor'

const getAllInput = z.object({
  take: z.number().min(1).max(100).default(10),
  cursor: z.number().optional().nullable()
})

export const byIdFilteredByMonthInput = z.object({
  id: z.number(),
  month: z.number().min(5).max(7) // dataset is only available for May, June and July 2021
})

const createInput = stationParser.omit({
  id: true,
  sweName: true,
  sweAddress: true,
  sweCity: true
})

export const stationRouter = createTRPCRouter({
  create: publicProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      return await createStation(ctx.prisma, input)
    }),

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await searchStations(ctx.prisma, input)
  }),

  getAll: publicProcedure.input(getAllInput).query(async ({ ctx, input }) => {
    return await getStationsWithCursor(ctx.prisma, input)
  }),

  getAllMapPoints: publicProcedure.query(async ({ ctx }) => {
    return await getMapPoints(ctx.prisma)
  }),

  byIdFilteredByMonth: publicProcedure
    .input(byIdFilteredByMonthInput)
    .query(async ({ ctx, input }) => {
      return await getJourneyWithFilter(ctx.prisma, input)
    }),

  getTopById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const topStations = await getTopStations(ctx.prisma, input)

      if (
        topStations.endingAt.length === 0 ||
        topStations.startingFrom.length === 0
      )
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Station(s) not found',
          cause: 'Bad id?'
        })

      return topStations
    }),

  byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const station = await ctx.prisma.station.findFirst({
      where: { id: input }
    })

    if (station === null)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Station not found',
        cause: 'Wrong ID'
      })

    return {
      ...station
    }
  })
})
