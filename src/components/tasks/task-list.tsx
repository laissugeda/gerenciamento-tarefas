"use client"

import Link from "next/link"
import { useState } from "react"
import { CalendarDays, Pencil, Trash2 } from "lucide-react"
import type { Task } from "@/types/task"
import { trpc } from "@/trpc/provider"

interface TaskListProps {
  initialTasks: Task[]
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [feedback, setFeedback] = useState("")
  const utils = trpc.useUtils()

  const tasksQuery = trpc.task.list.useQuery(undefined, {
    initialData: initialTasks,
  })

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: async () => {
      setFeedback("Task deleted successfully.")
      await utils.task.list.invalidate()
    },
    onError: (error) => {
      setFeedback(error.message || "Unable to delete the task.")
    },
  })

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    )

    if (confirmed) {
      setFeedback("")
      deleteMutation.mutate({ id })
    }
  }

  if (tasksQuery.isError && !tasksQuery.data) {
    return (
      <p className="feedback feedback-error" role="alert">
        Unable to load tasks. {tasksQuery.error.message}
      </p>
    )
  }

  const tasks = tasksQuery.data ?? []

  return (
    <section aria-label="Task list">
      {feedback && (
        <p className="feedback" role="status">
          {feedback}
        </p>
      )}

      {deleteMutation.isPending && (
        <p className="helper-text">Deleting task...</p>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <CalendarDays size={26} />
          </div>
          <h2>No tasks here yet</h2>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-content">
                <h2>{task.title}</h2>
                {task.description ? (
                  <p className="task-description">{task.description}</p>
                ) : (
                  <p className="task-description muted">No description.</p>
                )}
                <p className="task-date">
                  <CalendarDays size={14} />
                  Created on {formatDate(task.createdAt)}
                </p>
              </div>

              <div className="task-actions">
                <Link
                  className="icon-button"
                  href={`/tasks/${task.id}`}
                  aria-label={`Edit ${task.title}`}
                  title="Edit task"
                >
                  <Pencil size={17} />
                </Link>
                <button
                  className="icon-button icon-button-danger"
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteMutation.isPending}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
