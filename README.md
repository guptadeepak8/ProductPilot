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

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
```

## Project Structure

```
apps/
 ├── client
 └── server
```

The frontend uses a feature-based architecture with reusable shared components.

The backend follows a layered architecture:

```
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

## Screenshots

- Login
- Categories
- Products
- Bulk Upload
- Reports

## Future Improvements

- Image uploads
- Role-based access
- Dashboard analytics
- Docker support