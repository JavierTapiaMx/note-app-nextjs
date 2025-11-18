# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A note-taking application built with Next.js 16 (App Router), Drizzle ORM, MySQL, TypeScript, and TanStack Query (React Query). Uses the Repository pattern for data access and server-side API routes for backend functionality.

## Development Commands

```bash
# Start development server on http://localhost:3000
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Database Setup

1. Create a `.env.local` file with your MySQL connection string:

   ```
   DATABASE_URL="mysql://user:password@host:port/database"
   ```

2. Generate and run migrations:

   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

3. Push schema directly to database (development):
   ```bash
   npx drizzle-kit push
   ```

## Architecture

### Data Flow Pattern

The app follows a layered architecture with clear separation of concerns:

**Client → Service → API Route → Repository → Database**

1. **Client Layer** ([hooks/](hooks/))
   - React components use custom hooks (e.g., `useNotes`) for data fetching
   - Hooks wrap TanStack Query for caching, background refetching, and request deduplication
   - Never call API routes or repositories directly from components

2. **Service Layer** ([services/](services/))
   - `apiClient.ts`: Generic HTTP client built on Axios for API communication
   - `noteService.ts`: Specific service instances configured for each resource
   - All client-side HTTP requests go through this layer

3. **API Routes** ([app/api/](app/api/))
   - Next.js App Router API endpoints (`route.ts` files)
   - Handle HTTP request/response, validation (using Zod schemas), and error handling
   - Call repository methods for database operations
   - Return JSON responses with appropriate status codes

4. **Repository Layer** ([services/noteRepository.ts](services/noteRepository.ts))
   - `NoteRepository` class encapsulates all database operations
   - Uses Drizzle ORM for type-safe SQL queries
   - Single source of truth for data access logic
   - Exported as singleton instance (`noteRepository`)

5. **Database Layer** ([db/](db/))
   - `schema.ts`: Drizzle schema definitions (single source of truth for database structure)
   - `drizzle.ts`: Database connection and Drizzle instance initialization
   - Uses MySQL with connection pooling

### Key Architectural Decisions

- **Repository Pattern**: All database logic lives in repository classes, not in API routes
- **Schema Duplication**: Zod validation schemas in API routes are separate from Drizzle schemas (by design for different purposes)
- **Type Safety**: TypeScript interfaces ([types/Note.ts](types/Note.ts)) shared between client and server
- **State Management**: TanStack Query handles all server state (no Redux/Zustand needed for API data)
- **Singleton Pattern**: Repository instances are exported as singletons to share database connections

## Project Structure

```
app/
├── api/                    # API routes (server-side)
│   └── notes/
│       ├── route.ts        # GET /api/notes, POST /api/notes
│       ├── [id]/route.ts   # GET/PATCH/DELETE /api/notes/:id
│       └── schema.ts       # Zod validation schemas
├── notes/                  # Pages
└── layout.tsx              # Root layout with providers

components/                 # React components
├── Notes/                  # Note-specific components
└── ui/                     # Reusable UI components (shadcn/ui)

hooks/                      # Custom React hooks
└── useNotes.ts            # TanStack Query hook for notes

services/
├── apiClient.ts           # Generic HTTP client
├── noteService.ts         # Notes API service instance
└── noteRepository.ts      # Database repository (server-side)

db/
├── schema.ts              # Drizzle ORM schema definitions
└── drizzle.ts             # Database connection

drizzle/                   # Migration files (auto-generated)

types/
└── Note.ts                # Shared TypeScript types

providers/
└── reactQueryProvider.tsx # TanStack Query setup
```

## Important Conventions

### API Routes

- Return proper HTTP status codes (200, 201, 400, 404, 500)
- Use Zod for request validation; return validation errors as `{ errors: [...] }`
- Always use try-catch for error handling
- Call repository methods instead of writing SQL directly

### Repository Methods

- All database operations go through repository classes
- Methods return domain objects (not database rows)
- Handle not-found cases by returning `null`
- Use Drizzle ORM query builder (not raw SQL)

### Client-Side Data Fetching

- Always use custom hooks that wrap TanStack Query
- Never call `fetch()` or `axios` directly from components
- Configure caching strategy in the hook (staleTime, gcTime, retry)

### Database Schema Changes

1. Update `db/schema.ts` with Drizzle schema
2. Run `npx drizzle-kit generate` to create migration
3. Run `npx drizzle-kit migrate` to apply migration
4. Update TypeScript types in `types/` if needed
5. Update Zod schemas in API routes if validation changes

## Path Aliases

Uses `@/*` for absolute imports from project root:

```typescript
import { noteRepository } from "@/services/noteRepository";
import Note from "@/types/Note";
```

## Styling

- TailwindCSS v4 with PostCSS plugin
- shadcn/ui components in [components/ui/](components/ui/)
- Component configuration in [components.json](components.json)
- Geist fonts (Sans and Mono) for typography
