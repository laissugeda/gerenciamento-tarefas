import { createTRPCRouter } from "@/server/trpc"
import { taskRouter } from "./task-router"

export const appRouter = createTRPCRouter({
  task: taskRouter,
})

export type AppRouter = typeof appRouter
