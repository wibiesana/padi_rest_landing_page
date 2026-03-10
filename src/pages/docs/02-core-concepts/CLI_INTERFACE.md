# 🛠️ Padi Console CLI & Code Generator

---

## 📖 Overview

**Padi CLI** is the central control engine for your application. It replaces disparate scripts with a single, consistent, and powerful interface. Built on a modern **Console Core** system, it automates the entire lifecycle of your API—from database migrations to the **Industrial-Grade Code Generation** of Models, Controllers, Resources, and **Standard API IDE Collections**.

The Code Generator follows a strict **Separation of Concerns** architecture (Base vs. Concrete patterns), ensuring your custom business logic remains intact even as your database schema evolves.

---

## 🚀 Basic Usage

Run the main command from your terminal in the root of your project:

```bash
php padi <command> [arguments] [options]
```

To see the complete list of available commands and global options, use:

```bash
php padi help
```

---

## 🛠️ Command Reference

### 📂 Application Management (App)

| Command          | Description                                                      |
| :--------------- | :--------------------------------------------------------------- |
| `php padi init`  | Runs the interactive Setup Wizard (configures .env, DB, & Keys). |
| `php padi serve` | Starts the local development server (Default port: 8085).        |

### 🔨 Scaffolding (Make)

Used to quickly create new boilerplate files without full CRUD automation.

| Command           | Example                             | Output                                                  |
| :---------------- | :---------------------------------- | :------------------------------------------------------ |
| `make:controller` | `php padi make:controller Product`  | Creates a controller in `app/Controllers/`.             |
| `make:model`      | `php padi make:model products`      | Creates an ActiveRecord model in `app/Models/`.         |
| `make:migration`  | `php padi make:migration add_stock` | Creates a new migration file in `database/migrations/`. |

### 🗄️ Database Migrations (Migrate)

| Command                     | Description                                      |
| :-------------------------- | :----------------------------------------------- |
| `php padi migrate`          | Runs all pending migrations.                     |
| `php padi migrate:status`   | Shows the status of executed/pending migrations. |
| `php padi migrate:rollback` | Rolls back the last batch of migrations.         |

### ⚡ Industrial CRUD Generator (Generate)

The heart of the framework. It transforms database tables into fully working API modules.

| Command                               | Description                                                        |
| :------------------------------------ | :----------------------------------------------------------------- |
| `php padi generate:crud <table_name>` | Generates Model, Controller, Resource, Routes, & API Collection.   |
| `php padi generate:crud-all`          | Generates complete CRUD for **all** tables in the database (Bulk). |

---

## ⚙️ Options & Flags

| Flag          | Usage           | Description                                                         |
| :------------ | :-------------- | :------------------------------------------------------------------ |
| `--write`     | `generate:crud` | **Mandatory** to actually write files to disk (prevents accidents). |
| `--overwrite` | `generate:crud` | Overwrites existing **Base** files (use after schema changes).      |
| `--force`     | `generate:crud` | Forces regeneration on protected tables (e.g., `users`).            |
| `--protected` | `all` / `none`  | Automatically applies `Auth` middleware to generated routes.        |
| `--tables`    | `users,posts`   | Specific tables for migration execution.                            |
| `--step`      | `int`           | Number of steps for migration rollback.                             |
| `--port`      | `int`           | Custom port for the `serve` command.                                |

---

## 🏗️ Architecture: Base vs. Concrete

Padi uses a dual-layer pattern to protect your code:

1.  **Base Files (`app/*/Base/`)**: These are auto-managed. They contain schema mappings and standard logic. **NEVER edit these files** as they are overwritten during regeneration.
2.  **Concrete Files**: These inherit from Base files. They are created once and **never overwritten**. This is where you write your custom queries and business logic.

---

## � What Gets Generated?

When you run `php padi generate:crud products --write`, the following is created:

1.  **ActiveRecord Models**: Mapping columns, validation rules, and relationship detection.
2.  **REST Controllers**: Standardized `index`, `show`, `store`, `update`, and `destroy` logic.
3.  **API Resources**: A transformation layer for clean JSON output (filters fields, formats dates).
4.  **Automatic Routing**: Routes are appended to `routes/api.php` with optional protection.
5.  **API Collection**: A ready-to-import JSON file compatible with most API IDEs (Postman, Insomnia, Hoppscotch) with sample request bodies.

### 🧠 Smart Relationship Detection

The generator automatically detects foreign keys and writes relationship methods:

- **`belongsTo`**: Detected from `*_id` columns.
- **`hasMany`**: Detected from non-unique foreign keys in other tables pointing back.
- **`hasOne`**: Detected from unique foreign keys in other tables.

---

## 📮 API Collection & Client Integration

### Generated Endpoints

| Method | Endpoint             | Description      |
| :----- | :------------------- | :--------------- |
| GET    | `/products`          | List (Paginated) |
| GET    | `/products?search=x` | Search Keywords  |
| GET    | `/products/{id}`     | Get Single       |
| POST   | `/products`          | Create           |
| PUT    | `/products/{id}`     | Update           |
| DELETE | `/products/{id}`     | Delete           |

### API IDE Integration (Postman, Insomnia, etc.)

1.  **Import**: Drag the `.json` file from `api_collection/` into your preferred API client (Postman, Insomnia, Hoppscotch).
2.  **Environment**: Set `base_url` (default: `http://localhost:8085`).
3.  **Auth**: If protected, use the `Auth/Login` request to get a token and set it as an environment variable (usually `{{token}}`).

---

## � Best Practices

- **Dry Run First**: Run `generate:crud` without `--write` to preview changes.
- **Regenerate Often**: After a `ALTER TABLE`, run the generator with `--overwrite` to sync your **Base** models.
- **Custom Logic**: Always add custom methods in the concrete classes, never the base classes.
- **Meaningful Tables**: Use plural table names (e.g., `products`) for better English-standard pluralization in code.

---

## 🔍 Troubleshooting

| Issue               | Solution                                     |
| :------------------ | :------------------------------------------- |
| Files not created   | Ensure you added the `--write` flag.         |
| Base files outdated | Use `--overwrite` to refresh schema mapping. |
| "Table not found"   | Check your `.env` database connection.       |
| Permission denied   | Ensure `app/` and `storage/` are writable.   |
