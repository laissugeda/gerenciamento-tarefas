"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Task } from "@/types/task"
import { trpc } from "@/trpc/provider"

interface TaskFormProps {
  task?: Task
}

export function TaskForm({ task }: TaskFormProps) {
  const router = useRouter()
  const utils = trpc.useUtils()

  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [validationError, setValidationError] = useState("")
  const [invalidField, setInvalidField] = useState<
    "title" | "description" | null
  >(null)
  const [requestError, setRequestError] = useState("")

  async function handleMutationSuccess() {
    await utils.task.list.invalidate()
    router.push("/")
    router.refresh()
  }

  const createMutation = trpc.task.create.useMutation({
    onSuccess: handleMutationSuccess,
    onError: (error) => {
      setRequestError(error.message)
    },
  })

  const updateMutation = trpc.task.update.useMutation({
    onSuccess: handleMutationSuccess,
    onError: (error) => {
      setRequestError(error.message)
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setValidationError("")
    setInvalidField(null)
    setRequestError("")

    const normalizedTitle = title.trim()

    if (!normalizedTitle) {
      setValidationError("Title is required.")
      setInvalidField("title")
      return
    }

    if (normalizedTitle.length > 120) {
      setValidationError("Title must be at most 120 characters long.")
      setInvalidField("title")
      return
    }

    const normalizedDescription = description.trim() || undefined

    if (normalizedDescription && normalizedDescription.length > 500) {
      setValidationError("Description must be at most 500 characters long.")
      setInvalidField("description")
      return
    }

    if (task) {
      updateMutation.mutate({
        id: task.id,
        title: normalizedTitle,
        description: normalizedDescription,
      })
      return
    }

    createMutation.mutate({
      title: normalizedTitle,
      description: normalizedDescription,
    })
  }

  return (
    <main className="page-shell form-shell">
      <Link className="back-link" href="/">
        <ArrowLeft size={17} />
        Back to tasks
      </Link>

      <div className="form-heading">
        <p className="eyebrow">{task ? "EDIT TASK" : "NEW TASK"}</p>
        <h1>{task ? "Edit task" : "Create task"}</h1>
        <p className="page-description">
          {task
            ? "Update your task information."
            : "Fill in the fields to add a new task."}
        </p>
      </div>

      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">
            Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="E.g., Finish report"
            maxLength={120}
            required
            aria-invalid={invalidField === "title"}
            aria-describedby={
              invalidField === "title" ? "form-error" : undefined
            }
          />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add details (optional)"
            rows={5}
            maxLength={500}
            aria-invalid={invalidField === "description"}
            aria-describedby={
              invalidField === "description" ? "form-error" : undefined
            }
          />
          <span className="field-hint">
            {description.length}/500 characters
          </span>
        </div>

        {validationError && (
          <p className="feedback feedback-error" id="form-error" role="alert">
            {validationError}
          </p>
        )}

        {requestError && (
          <p className="feedback feedback-error" role="alert">
            {requestError}
          </p>
        )}

        <div className="form-actions">
          <Link className="button button-secondary" href="/">
            Cancel
          </Link>
          <button
            className="button button-primary"
            type="submit"
            disabled={isPending}
          >
            <Save size={17} />
            {isPending ? "Saving..." : "Save task"}
          </button>
        </div>
      </form>
    </main>
  )
}
