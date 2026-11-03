import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { taskRepository } from "@/server/db/tasks"
import { createTRPCRouter, publicProcedure } from "@/server/trpc"

const taskFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title must contain at most 120 characters."),
  description: z
    .string()
    .trim()
    .max(500, "Description must contain at most 500 characters.")
    .optional(),
})

export const taskRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return taskRepository.findAll()
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => {
      const task = taskRepository.findById(input.id)

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        })
      }

      return task
    }),

  create: publicProcedure.input(taskFieldsSchema).mutation(({ input }) => {
    return taskRepository.create(input)
  }),

  update: publicProcedure
    .input(
      taskFieldsSchema.extend({
        id: z.string().uuid(),
      }),
    )
    .mutation(({ input }) => {
      const task = taskRepository.update(input)

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        })
      }

      return task
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => {
      const deleted = taskRepository.delete(input.id)

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        })
      }

      return { success: true }
    }),
})
