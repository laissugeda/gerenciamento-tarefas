import Link from "next/link"

export default function NotFound() {
  return (
    <main className="page-shell empty-state">
      <h1>Task not found</h1>
      <p>The task you tried to access does not exist or has been deleted.</p>
      <Link className="button button-primary" href="/">
        Back to tasks
      </Link>
    </main>
  )
}
