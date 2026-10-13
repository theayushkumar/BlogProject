# The Daily Edit

A full-stack article blog with a public Angular site and an admin area backed by a Spring Boot REST API, MySQL, and JWT authentication.

## Requirements

- Java 17 or newer
- Maven 3.9+
- Node.js 20+
- A running MySQL-compatible database (WAMP / MySQL or MariaDB is supported)

## Create the database in WAMP/phpMyAdmin

1. Start WAMP and make sure its MySQL or MariaDB service is running.
2. Open `http://localhost/phpmyadmin`.
3. Select the **Import** tab.
4. Choose `backend/src/main/resources/db/schema.sql` and click **Import** (or paste that file's SQL into the phpMyAdmin **SQL** tab and run it).
5. Confirm phpMyAdmin shows the `blogdb` database and its `articles` and `users` tables.

The default backend connection matches a standard local WAMP installation: host `localhost`, port `3306`, database `blogdb`, username `root`, and an empty password. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` in the API terminal if your WAMP MySQL settings differ. If WAMP uses a port other than `3306`, use its actual MySQL port for `DB_PORT`.

> A root account with no password is a common WAMP local default, not a safe production configuration. For production, create a restricted database user and set its credentials in the environment.

## Start the API

Install Java 17+ and Maven 3.9+ first. In a PowerShell terminal, from the project root, set the admin sign-in and JWT signing secret, then start Spring Boot:

```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "choose-a-strong-password"
Set-Location .\backend
mvn spring-boot:run
```

The API is available at `http://localhost:8080`. On first startup, the application creates a row in `users` from `ADMIN_USERNAME` and `ADMIN_PASSWORD`, assigns it the `ADMIN` role, and stores a BCrypt hash of its password. The role is stored in the `role` column; the raw password is never written to the database. The username and initial password must be supplied through environment variables, not phpMyAdmin. Use a password with at least 12 characters. If that administrator row already exists, startup preserves its stored password and role. Keep the same `JWT_SECRET` while tokens are in use. Do not use development credentials or commit secrets in production.

## Start the Angular app

In another terminal, from the project root:

```powershell
Set-Location .\frontend
npm start
```

Open `http://localhost:4200`. The Angular development server proxies `/api` requests to `http://localhost:8080`.

You can now open the public blog at `http://localhost:4200` and sign in to the admin section at `http://localhost:4200/admin/login` with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values set in the API terminal.

## Features and API

- Public home page lists articles by publication date; each article has a dedicated page.
- Admin sign-in returns a signed, expiring JWT.
- Authenticated admins can create, edit, and delete articles from the dashboard.
- Article title, content, and publication date are validated by both client and server.
- Public API: `GET /api/articles`, `GET /api/articles/{id}`
- Admin API: `POST /api/auth/login`, `POST /api/articles`, `PUT /api/articles/{id}`, `DELETE /api/articles/{id}`. Send admin requests with `Authorization: Bearer <token>`.
- The API permits browser requests from the Angular development origin `http://localhost:4200`; adjust the CORS origin before deploying the frontend elsewhere.
- Docker is optional. `docker compose up -d mysql` is an alternative to WAMP; when using Docker, set `DB_USERNAME=blog_app` and `DB_PASSWORD=bloglocal` in the API terminal to match `docker-compose.yml`.

## Build

```powershell
Set-Location .\frontend
npm run build
```

```powershell
Set-Location ..\backend
mvn test
```
