# Note App - Next.js

A full-stack note-taking application built with Next.js 15, featuring a clean layered architecture, comprehensive testing, and a modern tech stack.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- ✅ Create, read, update, and delete notes
- ✅ Real-time form validation with error messages
- ✅ Responsive design with TailwindCSS v4
- ✅ Loading states and optimistic updates
- ✅ Toast notifications for user feedback
- ✅ Type-safe database operations with Drizzle ORM
- ✅ Comprehensive unit and integration tests
- ✅ Clean architecture with Repository pattern

## 🛠 Tech Stack

### Core

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **MySQL** - Database
- **Drizzle ORM 0.44** - Type-safe database operations

### UI & Styling

- **TailwindCSS v4** - Utility-first CSS
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### State Management & Forms

- **TanStack Query 5** - Server state management
- **React Hook Form 7** - Form handling
- **Zod 3** - Schema validation

### Testing

- **Vitest 4** - Unit and integration testing
- **Testing Library** - React component testing
- **jsdom** - DOM environment for tests

## 🏗 Architecture

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Client Components               │
│  (React components with hooks)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Custom Hooks                    │
│  (TanStack Query wrappers)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Service Layer                   │
│  (HTTP client - Axios)                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         API Routes                      │
│  (Next.js App Router)                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Repository Layer                │
│  (Database operations)                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database (MySQL)                │
└─────────────────────────────────────────┘
```

### Key Design Patterns

- **Repository Pattern**: All database logic encapsulated in repository classes
- **Service Layer**: HTTP communication abstracted through service classes
- **Custom Hooks**: React Query hooks for data fetching and mutations
- **Schema Validation**: Shared Zod schemas for consistent validation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8 or higher ([Install](https://pnpm.io/installation))
- **Docker**: Latest version ([Download](https://www.docker.com/products/docker-desktop/)) - **Recommended**
- **MySQL**: v8 or higher ([Download](https://dev.mysql.com/downloads/)) - Only needed for local development without Docker

## 🚀 Installation & Setup

### Option 1: Using Docker (Recommended)

The easiest way to get started is using Docker, which handles all setup automatically.

```bash
# 1. Clone the repository
git clone <repository-url>
cd note-app-nextjs

# 2. Start everything (MySQL + Next.js app)
pnpm docker:up

# That's it! The app is now running at http://localhost:3000
```

**What Docker does automatically:**

- ✅ Sets up MySQL 8.0 database
- ✅ Creates the `NoteApp` database
- ✅ Waits for MySQL to be ready
- ✅ Runs database migrations automatically
- ✅ Starts the Next.js application

**Docker Commands:**

```bash
pnpm docker:up       # Start services in background
pnpm docker:down     # Stop services
pnpm docker:logs     # View logs
pnpm docker:restart  # Restart services
pnpm docker:clean    # Stop and remove all data
pnpm docker:dev      # Start with logs visible
```

### Option 2: Local Development (Without Docker)

If you prefer to run MySQL locally:

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd note-app-nextjs
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Set Up MySQL Database

**Option A: Using MySQL CLI**

```bash
# Log into MySQL
mysql -u root -p

# Create database
CREATE DATABASE NoteApp;

# Exit MySQL
exit;
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new schema named `NoteApp`

#### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
DATABASE_URL="mysql://username:password@localhost:3306/NoteApp"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Replace:

- `username` with your MySQL username (default: `root`)
- `password` with your MySQL password
- `localhost:3306` with your MySQL host and port

**Example:**

```bash
DATABASE_URL="mysql://root:p4ssw0rd@localhost:3306/NoteApp"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

#### 5. Run Database Migrations

Generate and run migrations to create the database schema:

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate
```

**Alternative (Development):**

```bash
# Push schema directly without migrations
npx drizzle-kit push
```

#### 6. Verify Database Setup

Check that the `notes` table was created:

```bash
mysql -u root -p NoteApp -e "SHOW TABLES;"
```

You should see:

```
+-----------------------+
| Tables_in_NoteApp     |
+-----------------------+
| notes                 |
+-----------------------+
```

## 🏃 Running the Application

### Option 1: Using Docker (Recommended)

Docker provides an isolated environment with MySQL pre-configured:

```bash
# Build and start all services (MySQL + Next.js app)
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Clean up (remove volumes and data)
pnpm docker:clean
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**What Docker does automatically:**

- ✅ Sets up MySQL 8.0 database
- ✅ Creates the `NoteApp` database
- ✅ Waits for MySQL to be ready
- ✅ Runs database migrations automatically via `drizzle-kit push`
- ✅ Starts the Next.js application

**All Docker Commands:**

```bash
pnpm docker:build    # Build Docker images
pnpm docker:up       # Start in detached mode
pnpm docker:dev      # Start with logs visible
pnpm docker:down     # Stop containers
pnpm docker:restart  # Restart containers
pnpm docker:logs     # View logs
pnpm docker:clean    # Remove everything including data
```

### Option 2: Local Development (Without Docker)

#### Development Mode

Start the development server with hot reload:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### Production Build

Build and run the production version:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Other Commands

```bash
# Run linter
pnpm lint

# Format code with prettier
pnpm format
```

## 🧪 Testing

The project includes comprehensive unit and integration tests using Vitest.

### Test Overview

- **Unit Tests**: 60+ test cases for validation schemas
- **Integration Tests**: 40 test cases for API-to-database flow
- **Total**: 100+ test cases

### Running Tests

#### Run All Tests

```bash
pnpm test
```

#### Run Unit Tests Only

Tests validation schemas and business logic:

```bash
pnpm test:unit
```

**What's tested:**

- Title validation (min/max length, required)
- Content validation (min length, required)
- Schema variants (create, update, partial)
- Edge cases and error messages

#### Run Integration Tests Only

Tests complete API-to-database flow:

```bash
pnpm test:integration
```

**What's tested:**

- POST /api/notes (create note)
- PATCH /api/notes/:id (update note)
- GET /api/notes/:id (get single note)
- Database persistence
- Error handling
- Data consistency

#### Watch Mode

Run tests in watch mode for development:

```bash
pnpm test:watch
```

#### Test UI

Launch interactive test UI:

```bash
pnpm test:ui
```

#### Test Coverage

Generate code coverage report:

```bash
pnpm test:coverage
```

Coverage report will be available in `coverage/index.html`

### Test Configuration

Integration tests run against your actual database with safety measures:

- ✅ All test data uses `[TEST]` prefix
- ✅ Automatic cleanup after each test
- ✅ Tests run sequentially to prevent conflicts

### Manual Cleanup (if needed)

If tests fail and leave data behind:

```sql
DELETE FROM notes WHERE title LIKE '[TEST]%';
```

## 📁 Project Structure

```
note-app-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (server-side)
│   │   └── notes/
│   │       ├── route.ts          # GET /api/notes, POST /api/notes
│   │       ├── [id]/route.ts     # GET/PATCH/DELETE /api/notes/:id
│   │       └── schema.ts         # Zod validation schemas
│   ├── notes/                    # Note pages
│   │   ├── page.tsx              # List all notes
│   │   ├── new/page.tsx          # Create new note
│   │   └── [id]/edit/page.tsx   # Edit note
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── NavBar.tsx                # Navigation bar
│   ├── Notes/                    # Note-specific components
│   │   ├── NoteCard.tsx          # Note display card
│   │   ├── NoteForm.tsx          # Create/edit form
│   │   ├── NotesList.tsx         # Notes list container
│   │   ├── DeleteNoteButton.tsx  # Delete with confirmation
│   │   ├── NotesLoading.tsx      # Loading skeleton
│   │   ├── NotesEmpty.tsx        # Empty state
│   │   └── NotesError.tsx        # Error state
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       └── ... (more UI components)
│
├── hooks/                        # Custom React hooks
│   ├── useNotes.ts               # Fetch all notes
│   ├── useNote.ts                # Fetch single note
│   ├── useCreateNote.ts          # Create note mutation
│   ├── useUpdateNote.ts          # Update note mutation
│   └── useDeleteNote.ts          # Delete note mutation
│
├── services/                     # Service layer
│   ├── apiClient.ts              # HTTP client (Axios)
│   ├── noteService.ts            # Notes API service
│   └── noteRepository.ts         # Database repository
│
├── db/                           # Database configuration
│   ├── schema.ts                 # Drizzle schema definitions
│   └── drizzle.ts                # Database connection
│
├── lib/                          # Utility functions
│   ├── utils.ts                  # Helper functions
│   └── validations/              # Shared validation schemas
│       ├── noteValidation.ts     # Note validation rules
│       └── noteValidation.test.ts # Validation tests
│
├── tests/                        # Test files
│   ├── setup.ts                  # Test setup
│   ├── helpers/                  # Test utilities
│   │   ├── testData.ts           # Test data generators
│   │   └── dbCleanup.ts          # Database cleanup
│   ├── integration/              # Integration tests
│   │   ├── setup.ts              # Integration test setup
│   │   └── api/notes/            # API endpoint tests
│   │       ├── create.test.ts    # Create note tests
│   │       ├── update.test.ts    # Update note tests
│   │       └── get-single.test.ts # Get note tests
│   └── README.md                 # Testing guide
│
├── types/                        # TypeScript types
│   └── Note.ts                   # Note type definitions
│
├── providers/                    # React providers
│   ├── reactQueryProvider.tsx    # TanStack Query provider
│   └── toastProvider.tsx         # Toast notifications provider
│
├── drizzle/                      # Migration files (auto-generated)
├── Dockerfile                    # Docker configuration for Next.js app
├── docker-compose.yml            # Docker services orchestration
├── docker-entrypoint.sh          # Container startup script
├── .dockerignore                 # Docker build exclusions
├── .env.local                    # Environment variables (create this)
├── vitest.config.ts              # Vitest configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── next.config.ts                # Next.js configuration
├── drizzle.config.ts             # Drizzle Kit configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Get All Notes

```http
GET /api/notes
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "title": "My Note",
    "content": "Note content here",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Note

```http
GET /api/notes/:id
```

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "My Note",
  "content": "Note content here",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Note not found"
}
```

#### Create Note

```http
POST /api/notes
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the note content"
}
```

**Validation Rules:**

- `title`: Required, 1-255 characters
- `content`: Required, minimum 1 character

**Response (201 Created):**

```json
{
  "id": 1,
  "title": "My New Note",
  "content": "This is the note content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (400 Bad Request):**

```json
{
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

#### Update Note

```http
PATCH /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Note:** Both fields are optional for partial updates

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Note not found"
}
```

#### Delete Note

```http
DELETE /api/notes/:id
```

**Response (204 No Content):**

```
(empty body)
```

**Response (404 Not Found):**

```json
{
  "error": "Note not found"
}
```

## 💻 Development Guide

### Adding New Features

#### 1. Database Schema Changes

1. Update [`db/schema.ts`](db/schema.ts)
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate`
4. Update TypeScript types in [`types/`](types/)

#### 2. Adding New Endpoints

1. Create route file in [`app/api/`](app/api/)
2. Add Zod validation schema
3. Create repository methods in [`services/`](services/)
4. Create custom hooks in [`hooks/`](hooks/)
5. Update components to use new hooks

#### 3. Adding Tests

**Unit Tests:**

```typescript
// lib/validations/myFeature.test.ts
import { describe, it, expect } from "vitest";
import { mySchema } from "./myFeature";

describe("My Feature Validation", () => {
  it("should validate correctly", () => {
    const result = mySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

**Integration Tests:**

```typescript
// tests/integration/api/myFeature/create.test.ts
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/myFeature/route";

describe("POST /api/myFeature", () => {
  it("should create resource", async () => {
    // Test implementation
  });
});
```

### Code Style Guidelines

- Use **arrow functions** for new functions (as per project conventions)
- Don't add unnecessary comments - prefer well-named methods
- Comments should explain "why", not "what"
- Use descriptive variable names for complex conditions
- Follow existing patterns in the codebase

### Database Operations

Always use the repository layer:

```typescript
// ✅ Good
const notes = await noteRepository.findAll();

// ❌ Bad - Don't query database directly
const notes = await db.select().from(notesTable);
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `DATABASE_URL environment variable is not defined`

**Solution:**

1. Ensure [`.env.local`](.env.local) file exists in project root
2. Check that `DATABASE_URL` is correctly formatted
3. Restart the development server

**Error:** `connect ECONNREFUSED`

**Solution:**

1. Verify MySQL is running: `mysql -u root -p`
2. Check MySQL port (default: 3306)
3. Verify credentials in [`.env.local`](.env.local)

### Migration Issues

**Error:** `Table 'notes' already exists`

**Solution:**

```bash
# Drop and recreate the database
mysql -u root -p -e "DROP DATABASE NoteApp; CREATE DATABASE NoteApp;"

# Re-run migrations
pnpm db:migrate
```

### Test Issues

**Error:** Tests fail with database errors

**Solution:**

1. Ensure MySQL is running
2. Verify [`.env.local`](.env.local) contains correct `DATABASE_URL`
3. Clean up test data: `DELETE FROM notes WHERE title LIKE '[TEST]%';`

**Tests running slowly:**

Integration tests run sequentially by design for database safety. To speed up:

```bash
# Run only unit tests during development
pnpm test:unit
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use a different port
PORT=3001 pnpm dev
```

### Docker Issues

**Error:** Docker build fails or containers won't start

**Solution:**

1. Ensure Docker Desktop is running
2. Check Docker logs: `pnpm docker:logs`
3. Clean up and rebuild:

```bash
pnpm docker:clean
pnpm docker:build
pnpm docker:up
```

**Error:** Cannot connect to database in Docker

**Solution:**

1. Check MySQL container health: `docker ps`
2. Wait for MySQL to be healthy (health check may take 10-20 seconds)
3. View MySQL logs: `docker logs note-app-mysql`
4. Restart containers: `pnpm docker:restart`

**Error:** Port 3000 or 3306 already in use

**Solution:**

```bash
# Stop conflicting containers
docker stop $(docker ps -q)

# Or stop specific services
pnpm docker:down

# Check what's using the ports
netstat -ano | findstr :3000  # Windows
netstat -ano | findstr :3306  # Windows
lsof -i :3000  # macOS/Linux
lsof -i :3306  # macOS/Linux
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Open a Pull Request

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the [troubleshooting guide](#troubleshooting)

## 🎯 Next Steps

After setup, you can:

1. ✅ Explore the application at [http://localhost:3000](http://localhost:3000)
2. ✅ Create your first note
3. ✅ Run the test suite: `pnpm test`
4. ✅ Review the code architecture
5. ✅ Start building new features!

---

**Built with ❤️ using Next.js, TypeScript, and MySQL**
