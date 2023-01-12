import { createTRPCRouter } from './trpc'
import { postRouter } from './router/post'
import { stationRouter } from './router/station'

export const appRouter = createTRPCRouter({
  post: postRouter,
  station: stationRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
