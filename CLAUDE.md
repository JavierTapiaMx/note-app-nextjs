# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack note-taking application built with Next.js 16 (App Router), Drizzle ORM, MySQL, TypeScript, and TanStack Query (React Query). Features a clean layered architecture with the Repository pattern for data access, React Hook Form for form handling, and shadcn/ui components for a polished UI. Includes create, read, update, and delete functionality with real-time notifications, loading states, and accessibility features.

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
├── api/                           # API routes (server-side)
│   └── notes/
│       ├── route.ts               # GET /api/notes, POST /api/notes
│       ├── [id]/route.ts          # GET/PATCH/DELETE /api/notes/:id
│       └── schema.ts              # Zod validation schemas
├── notes/                         # Note pages
│   ├── page.tsx                   # List all notes view
│   ├── new/page.tsx               # Create new note page
│   └── [id]/edit/page.tsx         # Edit note page
├── layout.tsx                     # Root layout with providers
├── page.tsx                       # Home page
├── globals.css                    # Global styles, TailwindCSS config, theme variables
└── favicon.ico

components/                        # React components
├── NavBar.tsx                     # Top navigation with active link tracking
├── Notes/                         # Note-specific components
│   ├── NoteCard.tsx               # Individual note display card
│   ├── NoteForm.tsx               # Reusable form for create/edit (React Hook Form)
│   ├── DeleteNoteButton.tsx       # Delete button with confirmation dialog
│   ├── NotesList.tsx              # Container for list of NoteCards
│   ├── NotesLoading.tsx           # Loading skeleton display
│   ├── NotesEmpty.tsx             # Empty state display
│   └── NotesError.tsx             # Error state display
└── ui/                            # Reusable UI components (shadcn/ui)
    ├── button.tsx                 # Button with variants
    ├── card.tsx                   # Card layout components
    ├── form.tsx                   # React Hook Form integration
    ├── input.tsx                  # Text input field
    ├── label.tsx                  # Form label
    ├── textarea.tsx               # Multi-line text input
    ├── tooltip.tsx                # Tooltip component
    ├── skeleton.tsx               # Loading placeholder
    ├── spinner.tsx                # Animated loading spinner
    └── sonner.tsx                 # Toast notification component

hooks/                             # Custom React hooks (TanStack Query wrappers)
├── useNotes.ts                    # Fetch all notes with caching
├── useNote.ts                     # Fetch single note by ID
├── useCreateNote.ts               # Create note mutation
├── useUpdateNote.ts               # Update note mutation
└── useDeleteNote.ts               # Delete note mutation

services/
├── apiClient.ts                   # Generic HTTP client (Axios)
├── noteService.ts                 # Notes API service instance
└── noteRepository.ts              # Database repository (server-side)

db/
├── schema.ts                      # Drizzle ORM schema definitions
└── drizzle.ts                     # Database connection with pooling

drizzle/                           # Migration files (auto-generated)

types/
└── Note.ts                        # Shared TypeScript types

providers/
├── reactQueryProvider.tsx         # TanStack Query setup with devtools
└── toastProvider.tsx              # Sonner Toaster provider

lib/
└── utils.ts                       # Utility functions (cn for class merging)
```

## Important Conventions

### API Routes

- Return proper HTTP status codes (200, 201, 204, 400, 404, 500)
- Use Zod for request validation; return validation errors as `{ errors: [...] }`
- Always use try-catch for error handling
- Call repository methods instead of writing SQL directly
- Status codes: 201 for create, 204 for delete, 400 for validation errors, 404 for not found, 500 for server errors

### Repository Methods

- All database operations go through repository classes
- Methods return domain objects (not database rows)
- Handle not-found cases by returning `null`
- Use Drizzle ORM query builder (not raw SQL)
- Available methods: `findAll()`, `findById()`, `create()`, `update()`, `delete()`, `exists()`

### Client-Side Data Fetching

- Always use custom hooks that wrap TanStack Query
- Never call `fetch()` or `axios` directly from components
- Configure caching strategy in the hook (staleTime, gcTime, retry)
- Current caching config: `staleTime: 5 minutes`, `gcTime: 10 minutes`, `retry: 3`
- Query invalidation on mutations for automatic data syncing

### Form Handling

- Use React Hook Form with Zod validation
- Leverage the `form.tsx` component from shadcn/ui for consistent form UI
- Client-side validation matches server-side Zod schemas
- Display validation errors inline with form fields

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
- Theme support with CSS variables for light/dark modes
- Utility function `cn()` in [lib/utils.ts](lib/utils.ts) for merging Tailwind classes

## UI Components

### shadcn/ui Components Available

- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card**: Layout components with Header, Title, Description, Content, Footer, Action
- **Form**: React Hook Form integration with Field, Label, Control, Description, Message
- **Input**: Text input field
- **Textarea**: Multi-line text input
- **Label**: Form label
- **Tooltip**: Radix UI tooltip wrapper
- **Skeleton**: Loading placeholder
- **Spinner**: Animated loading indicator
- **Sonner**: Toast notification system with theme support

### Notifications

- Uses Sonner for toast notifications
- Configured in [providers/toastProvider.tsx](providers/toastProvider.tsx)
- Success and error notifications on CRUD operations

## Technologies

### Core Stack

- **Next.js**: 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5
- **Database**: MySQL with Drizzle ORM 0.44.7
- **State Management**: TanStack Query 5.90.10

### UI & Styling

- **TailwindCSS**: v4
- **shadcn/ui**: Component library built on Radix UI
- **Lucide React**: Icon library (0.554.0)
- **Sonner**: Toast notifications (2.0.7)
- **next-themes**: Theme management (0.4.6)

### Forms & Validation

- **React Hook Form**: 7.66.1
- **Zod**: 4.1.12
- **@hookform/resolvers**: 5.2.2

### HTTP Client

- **Axios**: 1.13.2 with custom error handling

## Developer notes

- For any code recommendations, always use the best practices
- Anything that is unclear, point it out and bring back all of your concerns around this project
- According to the best practices, when creating/updating new functions, use arrow functions when recommended
- Don’t add unnecessary comments — prefer well-named methods to comments
- When if conditions have multiple statements, compose descriptive variables instead of inline conditions
- Comments should explain "why", not "what"
