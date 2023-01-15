import { createTRPCRouter } from './trpc'
import { stationRouter } from './router/station'
import { journeyRouter } from './router/journey'

export const appRouter = createTRPCRouter({
  station: stationRouter,
  journey: journeyRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
