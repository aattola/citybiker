import { createTRPCRouter } from './trpc'
import { postRouter } from './router/post'
import { stationRouter } from './router/station'
import { journeyRouter } from './router/journey'

export const appRouter = createTRPCRouter({
  post: postRouter,
  station: stationRouter,
  journey: journeyRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
