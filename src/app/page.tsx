import Link from "next/link"
import { Plus } from "lucide-react"
import { TaskList } from "@/components/tasks/task-list"
import { appRouter } from "@/server/routers"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // The query runs on the server before the page is rendered.
  const initialTasks = await appRouter.createCaller({}).task.list()

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">PERSONAL ORGANIZATION</p>
          <h1>My Tasks</h1>
          <p className="page-description">
            Organize your activities in one place.
          </p>
        </div>

        <Link className="button button-primary" href="/tasks/new">
          <Plus size={18} />
          New Task
        </Link>
      </header>

      <TaskList initialTasks={initialTasks} />
    </main>
  )
}
