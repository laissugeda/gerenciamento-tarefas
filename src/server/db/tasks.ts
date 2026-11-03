import { randomUUID } from "node:crypto"
import type { Task } from "@/types/task"

interface TaskInput {
  title: string
  description?: string
}

interface UpdateTaskInput extends TaskInput {
  id: string
}

// Keeps the same list during hot reload in the development environment.
const globalForTasks = globalThis as typeof globalThis & {
  taskStore?: Task[]
}

const tasks = (globalForTasks.taskStore ??= [])

export const taskRepository = {
  findAll(): Task[] {
    return [...tasks].sort(
      (firstTask, secondTask) =>
        new Date(secondTask.createdAt).getTime() -
        new Date(firstTask.createdAt).getTime(),
    )
  },

  findById(id: string): Task | undefined {
    return tasks.find((task) => task.id === id)
  },

  create(input: TaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description?.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    tasks.push(task)

    return task
  },

  update(input: UpdateTaskInput): Task | undefined {
    const taskIndex = tasks.findIndex((task) => task.id === input.id)

    if (taskIndex === -1) {
      return undefined
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      title: input.title,
      description: input.description?.trim() || undefined,
    }

    tasks[taskIndex] = updatedTask

    return updatedTask
  },

  delete(id: string): boolean {
    const taskIndex = tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return false
    }

    tasks.splice(taskIndex, 1)

    return true
  },
}
