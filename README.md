# ProductPilot

ProductPilot is a full-stack product inventory management application for managing product categories, product records, CSV product imports, and downloadable product reports.

The project is organized as a pnpm monorepo with an Angular client and an Express API. The backend uses Prisma with PostgreSQL, Zod validation, cookie-based JWT authentication, and a layered route -> controller -> service -> repository structure.

## Project Overview

ProductPilot helps teams maintain a structured product catalog without manually editing database rows or spreadsheets. Users can register, sign in, create categories, create products, search and sort the catalog, import products from CSV, and download an Excel report.

At a high level:

- `apps/client` contains the Angular application, feature routes, pages, shared UI components, typed API clients, and signal-based stores.
- `apps/server` contains the Express API, authentication middleware, validation middleware, Prisma schema, migrations, domain modules, CSV import, and Excel report generation.
- `packages` is included in the workspace configuration but does not currently contain source code.

```mermaid
flowchart LR
  Browser[Angular Client] -->|HTTP with credentials| API[Express API]
  API --> Auth[Auth Middleware]
  Auth --> Controllers[Controllers]
  Controllers --> Services[Services]
  Services --> Repositories[Repositories]
  Repositories --> Prisma[Prisma Client]
  Prisma --> Postgres[(PostgreSQL)]
```

## Features

### Authentication

- User registration with email and password.
- Login with email and password.
- Password hashing with `bcrypt`.
- JWT creation with `jsonwebtoken`.
- JWT stored in an `httpOnly` `accessToken` cookie.
- Current-user lookup through `/api/v1/auth/me`.
- Logout by clearing the `accessToken` cookie.
- Angular dashboard shell verifies the session on load and redirects to `/login` when `/me` fails.

### Dashboard

- Authenticated dashboard layout under `/dashboard`.
- Side navigation to categories, products, upload, and reports.
- Dashboard defaults to `/dashboard/categories`.

### Categories

- List categories ordered by newest first.
- Create categories.
- Edit categories.
- Delete categories.
- Duplicate category protection.
- Server-side category name validation with Zod.
- Client-side category form validation with Angular reactive forms.

### Products

- List products with category details.
- Create products.
- Edit products.
- Delete products.
- Search by product name or category name.
- Pagination with `page` and `limit`.
- Price sorting with `asc` and `desc`.
- Category existence checks before create/update.
- Client-side product form with category dropdown loaded from the category API.

### Bulk Upload

- CSV upload endpoint at `/api/v1/products/bulk-upload`.
- Client-side `.csv` file extension check and 5 MB limit.
- Server-side CSV file filtering and 10 MB Multer limit.
- CSV parsing with `csv-parser`.
- Category name mapping from CSV rows to existing database categories.
- Bulk insert through Prisma `createMany`.
- Per-row skipped-record reporting for missing names, invalid prices, and unknown categories.
- Temporary uploaded CSV deletion after processing completes.

### Reports

- Product Excel export through `/api/v1/products/report`.
- Report generation with `exceljs`.
- Downloaded worksheet includes ID, product name, category, price, image URL, and created date.
- Worksheet includes styled headers, frozen header row, autofilter, currency formatting, and date formatting.
- Angular report page downloads the blob as `products-{YYYY-MM-DD}.xlsx`.

### Settings

No settings module or settings route is currently implemented.

## Tech Stack

Versions are read from the checked-in `package.json` files.

| Area | Technology |
| --- | --- |
| Package manager | `pnpm@10.15.0` |
| Workspace | pnpm workspaces |
| Frontend framework | Angular `^22.0.0` / Angular CLI `^22.0.8` |
| Frontend UI | Angular Material `^22.0.6`, Angular CDK `^22.0.6` |
| Frontend state | Angular signals and computed signals |
| Frontend forms | Angular reactive forms |
| Frontend HTTP | Angular `HttpClient` with credentials interceptor |
| Backend framework | Express `^5.2.1` |
| Backend runtime tooling | TypeScript `~6.0.3`, `tsx` `^4.23.1` |
| ORM | Prisma `^7.9.0`, `@prisma/client` `^7.9.0` |
| Database | PostgreSQL, with local Docker Compose using `postgres:16` |
| Validation | Zod `^4.4.3` |
| Authentication | `bcrypt` `^6.0.0`, `jsonwebtoken` `^9.0.3`, `cookie-parser` `^1.4.7` |
| Uploads | Multer `^2.2.0` |
| CSV parsing | `csv-parser` `^3.2.1` |
| Report generation | ExcelJS `^4.4.0` |
| Testing | Client: Vitest `^4.0.8`, jsdom `^28.0.0`; server tests are not implemented |

## Architecture

### Frontend Architecture

The Angular app uses standalone components and lazy-loaded route groups.

- `app.routes.ts` redirects `/` to `/login`, mounts auth routes, mounts dashboard routes, and redirects unknown routes to `/login`.
- `dashboard.routes.ts` defines the authenticated dashboard shell and lazy-loads feature routes.
- Feature services wrap API calls with typed response contracts.
- Feature stores use Angular signals to keep local UI state such as loading, pagination, search, sorting, and in-memory lists.
- Shared components provide reusable page headers, search input, and confirmation dialogs.
- The auth HTTP interceptor sets `withCredentials: true` on every request so the browser includes the JWT cookie.

### Backend Architecture

The backend separates HTTP concerns from business logic and persistence.

- Routes define URLs, middleware, file upload handlers, and request validation.
- Controllers parse route/query parameters and shape HTTP responses.
- Services enforce business rules such as duplicate checks, category existence checks, authentication rules, and import validation.
- Repositories contain Prisma queries.
- Middleware handles auth, request body validation, CSV upload filtering, and centralized error responses.

```mermaid
flowchart TD
  Route[Express Route] --> Middleware[Auth / Upload / Validation Middleware]
  Middleware --> Controller[Controller]
  Controller --> Service[Service]
  Service --> Repository[Repository]
  Repository --> Prisma[Prisma Client]
  Prisma --> DB[(PostgreSQL)]
  Service --> AppError[AppError for domain failures]
  AppError --> ErrorHandler[errorHandler Middleware]
```

### Component Communication

Angular pages call feature services for API work and update feature stores after successful responses. Dialog components return created or updated records through `MatDialogRef.close(...)`, and parent pages update the signal stores immediately.

### Request Flow

```mermaid
sequenceDiagram
  participant Component as Angular Component
  participant Service as Angular Service
  participant Http as HttpClient
  participant Route as Express Route
  participant Controller as Controller
  participant Domain as Service Layer
  participant Repo as Repository
  participant Prisma as Prisma
  participant DB as PostgreSQL

  Component->>Service: call feature method
  Service->>Http: HTTP request with credentials
  Http->>Route: /api/v1/*
  Route->>Controller: after middleware
  Controller->>Domain: invoke business operation
  Domain->>Repo: request persistence operation
  Repo->>Prisma: Prisma query
  Prisma->>DB: SQL
  DB-->>Prisma: rows
  Prisma-->>Repo: result
  Repo-->>Domain: result
  Domain-->>Controller: data or AppError
  Controller-->>Component: JSON response
```

The architecture is maintainable because UI state, API access, HTTP handling, business rules, and database access are kept in separate layers. New modules can follow the existing route/controller/service/repository pattern without changing the rest of the system.

## Folder Structure

```text
ProductPilot/
  apps/
    client/
      src/
        app/
          core/
            interceptors/
          features/
            auth/
            categories/
            products/
            reports/
            upload/
          layout/
            auth-layout/
            dashboard/
          shared/
            components/
            types/
        environments/
      angular.json
      package.json
    server/
      prisma/
        migrations/
        schema.prisma
      src/
        config/
        middleware/
        modules/
          auth/
          category/
          product/
        routes/
        utils/
      docker-compose.yml
      package.json
  packages/
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
```

| Path | Responsibility |
| --- | --- |
| `apps/client/src/app/features/auth` | Login, registration, auth API service, and auth signal store |
| `apps/client/src/app/features/categories` | Category page, dialogs, API service, and category store |
| `apps/client/src/app/features/products` | Product page, product form, API service, pagination/search/sort store |
| `apps/client/src/app/features/upload` | CSV upload page and upload API service |
| `apps/client/src/app/features/reports` | Product report download page and report API service |
| `apps/client/src/app/shared` | Shared UI components and TypeScript API types |
| `apps/server/src/modules/auth` | Auth routes, schemas, controller, service, repository |
| `apps/server/src/modules/category` | Category CRUD routes, schemas, controller, service, repository |
| `apps/server/src/modules/product` | Product CRUD, listing, CSV import, and Excel report code |
| `apps/server/src/middleware` | Auth, validation, upload, and error middleware |
| `apps/server/prisma` | Prisma schema, Prisma config, and migrations |

## Installation

### Prerequisites

- Node.js compatible with Angular 22 and TypeScript 6.
- pnpm `10.15.0`.
- PostgreSQL, or Docker for the included PostgreSQL Compose service.

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create `apps/server/.env` with the required values:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/productpilot"
JWT_SECRET="replace-with-a-strong-secret"
NODE_ENV=development
CLIENT_URL="http://localhost:4200"
```

The Angular client currently reads the API base URL from `apps/client/src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

### Database Setup

From `apps/server`, start the local PostgreSQL container:

```bash
docker compose up -d
```

Run Prisma migrations from `apps/server`:

```bash
pnpm prisma migrate dev
```

If Prisma Client generation is needed:

```bash
pnpm prisma generate
```

### Run Backend

```bash
pnpm --filter server dev
```

The API listens on `PORT`, defaulting to `5000`.

### Run Frontend

```bash
pnpm --filter client dev
```

The Angular app runs on the Angular dev server, typically `http://localhost:4200`.

### Run Both Apps

From the repository root:

```bash
pnpm dev
```

This runs `pnpm -r --parallel dev`.

### Production Build

```bash
pnpm build
```

The root build runs `pnpm -r build`, which builds the Angular client and compiles the TypeScript server.

## Environment Variables

| Variable | Required | Default | Used by | Description |
| --- | --- | --- | --- | --- |
| `PORT` | No | `5000` | Server | HTTP port for the Express app |
| `DATABASE_URL` | Yes | None | Prisma/server | PostgreSQL connection URL |
| `JWT_SECRET` | Yes | None | Server | Secret used to sign and verify JWT access tokens |
| `NODE_ENV` | No | `development` | Server | Enables secure cookies when set to `production` |
| `CLIENT_URL` | No | `http://localhost:4200` | Server | CORS origin allowed to send credentialed requests |

## API Documentation

All API routes are mounted under `/api/v1`. Category and product routes require authentication. `/auth/me` and `/auth/logout` also require authentication.

### Authentication Endpoints

| Method | Route | Auth | Description | Body | Success Response | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Register a user and set `accessToken` cookie | `{ "email": "user@example.com", "password": "secret123" }` | `{ success, message, data: { id, email } }` | `201`, `400`, `409`, `500` |
| `POST` | `/auth/login` | No | Login and set `accessToken` cookie | `{ "email": "user@example.com", "password": "secret123" }` | `{ success, message, data: { id, email } }` | `200`, `400`, `401`, `500` |
| `GET` | `/auth/me` | Yes | Return current authenticated user | None | `{ success, data: { id, email } }` | `200`, `401`, `404`, `500` |
| `POST` | `/auth/logout` | Yes | Clear the access token cookie | `{}` | `{ success, message }` | `200`, `401`, `500` |

### Category Endpoints

| Method | Route | Auth | Description | Body | Success Response | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/categories` | Yes | List all categories ordered by creation date descending | None | `{ success, data: Category[] }` | `200`, `401`, `500` |
| `GET` | `/categories/:id` | Yes | Get one category by numeric ID | None | `{ success, data: Category }` | `200`, `401`, `404`, `500` |
| `POST` | `/categories` | Yes | Create a category | `{ "name": "Electronics" }` | `{ success, message, data: Category }` | `201`, `400`, `401`, `409`, `500` |
| `PUT` | `/categories/:id` | Yes | Update a category | `{ "name": "Accessories" }` | `{ success, message, data: Category }` | `200`, `400`, `401`, `404`, `409`, `500` |
| `DELETE` | `/categories/:id` | Yes | Delete a category | None | `{ success, message }` | `200`, `401`, `404`, `500` |

### Product Endpoints

| Method | Route | Auth | Description | Body / Query | Success Response | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/products` | Yes | List products with pagination, search, and price sorting | Query: `page`, `limit`, `search`, `sort=asc\|desc` | `{ success, products, pagination }` | `200`, `401`, `500` |
| `GET` | `/products/:id` | Yes | Get one product by numeric ID | None | `{ success, data: Product }` | `200`, `401`, `404`, `500` |
| `POST` | `/products` | Yes | Create a product | `{ "name": "Keyboard", "price": 1999, "image": null, "categoryId": 1 }` | `{ success, message, data: Product }` | `201`, `400`, `401`, `404`, `500` |
| `PUT` | `/products/:id` | Yes | Update a product | `{ "name": "Keyboard", "price": 1999, "image": null, "categoryId": 1 }` | `{ success, message, data: Product }` | `200`, `400`, `401`, `404`, `500` |
| `DELETE` | `/products/:id` | Yes | Delete a product | None | `{ success, message }` | `200`, `401`, `404`, `500` |
| `POST` | `/products/bulk-upload` | Yes | Upload a CSV file | Multipart form field `file` | `{ success, message, imported, skipped, errors }` | `200`, `400`, `401`, `500` |
| `GET` | `/products/report` | Yes | Download product Excel report | None | `products.xlsx` binary workbook | `200`, `401`, `500` |

The product create/update routes include `upload.single("image")` middleware, but the current Angular product form sends JSON with an `image` string or `null`, not a file upload. The server validator expects JSON-compatible `name`, `price`, `image`, and `categoryId` values.

### Bulk CSV Format

The CSV parser expects these column names:

```csv
name,price,category,image
Laptop,75000,Electronics,https://example.com/laptop.png
```

`image` is optional. `category` must match an existing category name, case-insensitively.

## Database Schema

### User

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Int` | Primary key, autoincrement |
| `uuid` | `String` | Unique, generated UUID |
| `email` | `String` | Unique |
| `password` | `String` | Bcrypt hash |
| `createdAt` | `DateTime` | Defaults to current timestamp |
| `updatedAt` | `DateTime` | Updated automatically |

### Category

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Int` | Primary key, autoincrement |
| `uuid` | `String` | Unique, generated UUID |
| `name` | `String` | Unique, indexed |
| `products` | `Product[]` | One-to-many relationship |
| `createdAt` | `DateTime` | Defaults to current timestamp |
| `updatedAt` | `DateTime` | Updated automatically |

### Product

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Int` | Primary key, autoincrement |
| `uuid` | `String` | Unique, generated UUID |
| `name` | `String` | Indexed |
| `image` | `String?` | Optional image URL/string |
| `price` | `Decimal(10, 2)` | Product price |
| `categoryId` | `Int` | Foreign key to `Category.id`, indexed |
| `category` | `Category` | Required relation |
| `createdAt` | `DateTime` | Defaults to current timestamp |
| `updatedAt` | `DateTime` | Updated automatically |

## Authentication

Authentication is implemented with signed JWTs stored in cookies.

1. Register or login validates the body with Zod.
2. Passwords are hashed with `bcrypt.hash(password, 10)` during registration.
3. Login compares passwords with `bcrypt.compare`.
4. The server signs a JWT containing `userId` and `email` with `JWT_SECRET`.
5. The token expires in `1D`.
6. Controllers set the token as an `httpOnly` cookie named `accessToken`.
7. In production, cookies are marked `secure`; `sameSite` is set to `lax`.
8. The Angular interceptor sends credentials with every HTTP request.
9. Protected API routes read `req.cookies.accessToken`, verify it, and attach the payload to `req.user`.

There is no role-based authorization or route guard currently implemented on the Angular router. The dashboard shell performs a `/me` check and redirects to login on failure.

## Product Module

The product module supports CRUD, listing, search, sorting, pagination, CSV import, and report export.

- Product validation requires `name`, positive numeric `price`, positive integer `categoryId`, and optional nullable `image`.
- Product create/update checks that the referenced category exists.
- Product list accepts `page`, `limit`, `search`, and `sort`.
- Search matches product names or category names with case-insensitive contains queries.
- Sorting is by `price`.
- Pagination returns `page`, `limit`, `total`, and `totalPages`.
- Product repository responses include the related category.

## Category Module

The category module supports CRUD for category records.

- Category names are trimmed and validated on the server.
- Names must be 3 to 100 characters on the server.
- Category names are unique at the database level.
- Create and update guard against duplicate names before writing.
- Categories are returned newest first.
- Products reference categories through `Product.categoryId`.

## Bulk Upload

Bulk upload accepts a CSV file through multipart form data.

1. Angular validates file extension and size before upload.
2. The server stores the upload temporarily in `uploads/`.
3. Multer allows CSV MIME types or `.csv` filenames and caps files at 10 MB.
4. Existing categories are loaded and mapped by lowercase category name.
5. Each CSV row is validated for name, numeric price, and known category.
6. Valid rows are transformed into Prisma product create data.
7. Invalid rows are added to the `errors` array with a row number and reason.
8. Valid products are inserted using `createMany({ skipDuplicates: true })`.
9. The temporary CSV file is deleted after processing.

Performance considerations already present include streaming CSV parsing and bulk database insertion. The current implementation accumulates valid rows in memory before insertion, so extremely large CSV files would need chunked insertion to scale further.

## Reports

Product reports are generated on demand from all products in the database.

- `GET /api/v1/products/report` creates an Excel workbook with `exceljs`.
- Products are loaded with their category relationship.
- The worksheet includes styled headers, autofilter, frozen header row, price formatting, and date formatting.
- The server streams the workbook to the response as an `.xlsx` attachment.
- The Angular report page receives the response as a blob and triggers a browser download.

## Design Decisions

- Layer separation keeps controllers thin and places business rules in services.
- Repositories isolate Prisma calls, which keeps persistence details out of controllers and services.
- Zod schemas provide consistent request-body validation at API boundaries.
- Angular signals provide lightweight feature-local state without adding another state-management dependency.
- Angular Material supplies dialogs, form fields, buttons, icons, toolbar, sidenav, and navigation list UI.
- Prisma provides typed database access and protects normal query paths from SQL injection.
- Cookie-based JWT auth keeps tokens out of browser JavaScript-accessible storage because `httpOnly` cookies are used.

## Error Handling

Backend domain failures use `AppError` with explicit status codes and messages. The centralized `errorHandler` middleware returns `{ success: false, message }` for `AppError` instances and a generic 500 response for unexpected errors.

Validation middleware returns status `400` with field-level Zod issue details:

```json
{
  "success": false,
  "errors": [
    {
      "field": "name",
      "message": "Category name must be at least 3 characters"
    }
  ]
}
```

The Angular client currently logs many API errors with `console.error`. The upload page displays upload-specific error messages to the user.

## Security

Implemented security features:

- Password hashing with bcrypt.
- JWT verification for protected API routes.
- `httpOnly` auth cookie.
- `secure` cookie flag in production.
- Credentialed CORS restricted to `CLIENT_URL`.
- Zod validation for JSON request bodies.
- Prisma query API usage for database access.
- CSV upload file type filtering and file size limits.

Not currently implemented:

- CSRF protection.
- Rate limiting.
- Role-based authorization.
- Angular router guards.
- Centralized frontend error display for all modules.

## Performance

Implemented optimizations:

- Product pagination using `skip` and `take`.
- Product count and list queries execute in parallel with `Promise.all`.
- Indexed `Category.name`, `Product.categoryId`, and `Product.name` fields.
- Streaming CSV parsing.
- Bulk product insertion with Prisma `createMany`.
- Async report generation and streaming workbook write to the response.

Potential future scaling work includes chunked CSV inserts, report background jobs for large catalogs, and stricter pagination limits.

## Testing

The client includes Angular spec files:

- `apps/client/src/app/app.spec.ts`
- `apps/client/src/app/features/auth/auth.spec.ts`
- `apps/client/src/app/layout/auth-layout/auth-layout.spec.ts`

The client test command is:

```bash
pnpm --filter client test
```

The server test command is still a placeholder and exits with an error:

```bash
pnpm --filter server test
```

Recommended testing strategy:

- Add server unit tests for services, especially auth, category duplicate handling, product validation, bulk upload row handling, and report generation.
- Add API integration tests for each Express route using a test database.
- Add frontend component tests for product/category dialogs and upload/report pages.
- Add end-to-end tests for register/login, category CRUD, product CRUD, CSV upload, and report download.

## Future Improvements

- Add Angular route guards for authenticated dashboard routes.
- Add centralized frontend error handling and user-facing notifications.
- Add CSRF protection for cookie-authenticated requests.
- Add server-side tests and route integration tests.
- Add chunked CSV processing for very large imports.
- Add configurable upload directory management and startup checks.
- Add production environment files or deployment documentation.
- Add role-based authorization if the product needs admin/member separation.
- Add OpenAPI generation or an API schema for external consumers.

## Screenshots

Screenshots are not currently committed to the repository. Suggested placeholders:

### Login

Add screenshot: `docs/screenshots/login.png`

### Dashboard

Add screenshot: `docs/screenshots/dashboard.png`

### Categories

Add screenshot: `docs/screenshots/categories.png`

### Products

Add screenshot: `docs/screenshots/products.png`

### Bulk Upload

Add screenshot: `docs/screenshots/bulk-upload.png`

### Reports

Add screenshot: `docs/screenshots/reports.png`

## Author

ProductPilot is maintained by the repository owner.

