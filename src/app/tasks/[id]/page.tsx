import { TRPCError } from "@trpc/server"
import { notFound } from "next/navigation"
import { TaskForm } from "@/components/tasks/task-form"
import { appRouter } from "@/server/routers"

interface EditTaskPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params

  try {
    const task = await appRouter.createCaller({}).task.getById({ id })

    return <TaskForm task={task} />
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound()
    }

    throw error
  }
}
