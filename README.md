# ProductPilot

A full-stack inventory management system built with Angular, Node.js, Express, Prisma, and PostgreSQL.

## Features

- Authentication with JWT
- Category Management (CRUD)
- Product Management (CRUD)
- Search by product/category
- Server-side pagination
- Price sorting
- Bulk CSV upload
- Excel report generation

## Tech Stack

### Frontend

- Angular
- Angular Material
- Signals
- RxJS

### Backend

- Node.js
- Express
- Prisma
- PostgreSQL
- Zod

## Getting Started

```bash
pnpm install
```

Backend

```bash
cd apps/server
pnpm dev
```

Frontend

```bash
cd apps/client
pnpm dev
```

## Running Tests

The project includes a small, meaningful unit test suite for the core assessment scenarios.

Run all tests from the repository root:

```bash
pnpm test
```

Run tests for one app:

```bash
pnpm --filter client test
pnpm --filter server test
```

### Frontend Test Coverage

- AuthService login success, login failure, and register success
- Category store add, update, and delete state changes
- Product store add, update, delete, search, sort, and pagination state changes
- Product form validation and submit payload behavior

### Backend Test Coverage

- Auth password hashing, login JWT cookie response, and invalid credentials
- Category service create, duplicate validation, and delete
- Product service create, update, delete, search, pagination, and price sorting behavior
- Bulk CSV upload successful import, skipped invalid category, skipped invalid price, and upload summary
- Excel report workbook generation, expected headers, and product rows

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
```

## Project Structure

```text
apps/
├── client
└── server
```

The frontend uses a feature-based architecture with reusable shared components.

The backend follows a layered architecture:

```text
Routes
→ Controllers
→ Services
→ Repositories
→ Prisma
→ PostgreSQL
```

## API Modules

- Authentication
- Categories
- Products
- Bulk Upload
- Reports

A Postman collection is included for testing all endpoints.


## Future Improvements

- Image uploads
- Role-based access
- Dashboard analytics
- Docker support
