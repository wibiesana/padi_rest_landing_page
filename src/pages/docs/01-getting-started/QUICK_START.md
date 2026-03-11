# 🚀 Quick Start - Run This!

## ⚡ Speed to Market: Zero to API in Seconds

Experience the ultimate developer fast-track. Padi REST API is engineered for **Instant Productivity**, allowing you to go from a clean slate to a fully-functional, secure, and industrial-grade REST API in less than 60 seconds. Our intelligent setup wizard handles the heavy lifting, so you can focus on building the features that matter.

---

## 📋 Table of Contents

- [⚡ Speed to Market: Zero to API in Seconds](#speed-to-market-zero-to-api-in-seconds)

- [📝 Prerequisites](#prerequisites)
- [Automated Setup](#automated-setup)
- [What You Get](#what-you-get)
- [Database Support](#database-support)
- [Commands](#commands)
- [Next Steps](#next-steps)

---

## 📝 Prerequisites

- **PHP 8.4+**
- **Extensions:** `pdo`, `mbstring`, `openssl`, `zlib`, `json`
- **Database:** MySQL/MariaDB/PostgreSQL/SQLite

---




## Automated Setup

Run this command to create a new project:

```bash
composer create-project wibiesana/padi-rest-api my-app
cd my-app
```

Then initialize your project using the **Padi Console**:

```bash
php padi init
```

The script will guide you through:

1. ✅ **Setup .env file**
2. ✅ **Choose database** (MySQL/MariaDB/PostgreSQL/SQLite)
3. ✅ **Configure database** (host, port, username, password)
4. ✅ **Generate JWT Secret** (secure 64-char hex)
5. ✅ **Run migrations** (base only or with examples)
6. ✅ **Generate CRUD** (optional)

---

## What You Get

### Base Migration:

- ✅ **users** table - Enhanced with role, status, email verification, etc.

### Example Migrations (Optional):

- ✅ **posts** table - Blog posts with foreign key to users
- ✅ **tags** table - For categorization
- ✅ **post_tags** table - Many-to-Many relationship
- ✅ **comments** table - Nested comments support

---

## Database Support

- ✅ **MySQL**
- ✅ **MariaDB**
- ✅ **PostgreSQL**
- ✅ **SQLite**

---

## Commands

### Migration

```bash
# Run all migrations
php padi migrate

# Check status
php padi migrate:status

# Rollback
php padi migrate:rollback
```

### Generate CRUD

```bash
# Generate for one table
php padi make:controller UserController
php padi make:model User users

# Complete CRUD scaffolding
php padi generate:crud users
php padi ga
```

### Start Server

```bash
php padi serve
```

Visit: `http://localhost:8085`

---

## Next Steps

1. Run `php padi init`
2. Follow the interactive prompts
3. Start server with `php padi serve`
4. Test your API endpoints

---

**Next Steps:** Run `php padi init` and follow the prompts.
