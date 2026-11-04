# Task Manager

A task management application built with Next.js 15, React 19, TypeScript, and tRPC. It provides task creation, editing, deletion, and listing with in-memory data storage.

## Features

- List tasks with server-side rendering (SSR).
- Create new tasks.
- Edit existing tasks.
- Delete tasks with confirmation.
- Validate task data on both the client and server.
- Display loading, success, and error feedback.
- Type-safe API procedures with tRPC.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- tRPC 11
- TanStack React Query
- Zod
- Tailwind CSS 4
- Lucide React

## Requirements

- Node.js 20.9 or later.
- npm.

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Build the application for production. |
| `npm run start` | Start the production server. |

## API

The application uses tRPC with the `/api/trpc` HTTP endpoint.

| Procedure | Type | Description |
|---|---|---|
| `task.list` | Query | Retrieve all tasks. |
| `task.getById` | Query | Retrieve a task by ID. |
| `task.create` | Mutation | Create a task. |
| `task.update` | Mutation | Update an existing task. |
| `task.delete` | Mutation | Delete a task. |

## Data Storage

Tasks are stored in memory within the Node.js process. Data is not persisted and will be lost when the server restarts.

This approach meets the scope of the challenge but is not intended for production use or multi-instance deployments.