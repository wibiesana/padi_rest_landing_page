# 🚀 Setup Methods - The Padi Console

## 🤖 Adaptive Deployment & Orchestration

Tailor your environment with the **Padi Intelligence Hub**. Whether you prefer our sophisticated, interactive CLI wizard or a surgical manual configuration, Padi REST API provides the most flexible and professional setup experience in the PHP ecosystem. Build your infrastructure on a foundation that adapts to your workflow, not the other way around.

---

## 📋 Table of Contents

- [🤖 Adaptive Deployment & Orchestration](#adaptive-deployment-orchestration)

- [✨ The Padi Console (The Ultimate CLI Hub)](#the-padi-console-the-ultimate-cli-hub)
- [🎨 The Unified Command (Universal Method)](#the-unified-command-universal-method)
- [📊 Comparison](#comparison)
- [🛠️ Manual Setup](#manual-setup)
- [✅ Recommended Workflow](#recommended-workflow)
- [📝 Summary](#summary)

---

## ✨ **The Padi Console (The Ultimate CLI Hub)**

We provide a unified entry point called **Padi Console** (`php padi`) - a professional command-line interface inspired by **Laravel Artisan** and **Yii2 console**!

## 🎨 The Unified Command (Universal Method)

### Usage:

```bash
php padi init
```

### Features:

✅ **Interactive wizard** with professional colored output  
✅ **True Cross-Platform** - Works identically on Windows, Linux, and macOS  
✅ **Zero Extra Dependencies** - Uses the same PHP engine that runs your API  
✅ **Robust Logic** - Powered by modern PHP try-catch error handling  
✅ **Developer Friendly** - Inspired by the best CLI tools in the PHP ecosystem (Artisan & Yii)



### Screenshot:

```
╔════════════════════════════════════════════════════════════════╗
║             Padi REST API Framework - Setup Wizard             ║
║                        Version: 2.x.x                             ║
║                    Powered by Padi Console                     ║
╚════════════════════════════════════════════════════════════════╝

ℹ [1/7] Checking environment file...
✓ .env file created from .env.example

[2/7] Select Database Driver
------------------------------------------------------------
  → 1. MySQL (Default)
    2. MariaDB
    3. PostgreSQL
    4. SQLite
------------------------------------------------------------
Enter your choice [1]:
```

### What It Does:

1. **Checks prerequisites**
   - Validates `.env.example` exists
   - Ensures PHP is available

2. **Creates/updates .env**
   - Prompts for overwrite if exists
   - Safe file operations

3. **Database configuration**
   - Interactive prompts for credentials
   - Validates choices
   - Updates `.env` automatically

4. **Tests database connection**
   - Validates credentials before proceeding
   - Shows detailed error messages if connection fails
   - Provides troubleshooting tips
   - Option to continue or abort setup

5. **JWT secret generation**
   - Secure random key (64 characters)
   - Automatic save to `.env`

6. **Migrations with error handling**
   - Base tables (users, password_resets) or full examples
   - Clear progress feedback
   - Detailed error messages if migration fails
   - Troubleshooting suggestions
   - Option to continue or abort on failure

7. **CRUD generation with validation**
   - All tables or selective generation
   - Driver-specific generation
   - Per-table error tracking
   - Success/failure summary
   - Protected tables auto-skipped (users, password_resets, migrations)

### Error Handling:

✅ **Database Connection Errors**

```
✗ Database connection failed!
✗ Error: SQLSTATE[HY000] [1045] Access denied for user...

⚠ Common issues:
  • Check database credentials in .env file
  • Ensure database server is running
  • Verify database exists (for MySQL/PostgreSQL)
  • Check if port is correct

Continue anyway? (y/n) [n]:
```

✅ **Migration Errors**

```
✗ Command failed with code 1: php scripts/migrate.php migrate
✗ Error details:
  Table 'users' already exists

⚠ Troubleshooting:
  • Ensure database connection is working
  • Check if migration files exist in database/migrations/

> **Note:** For a full list of commands, simply run `php padi`.
  • Review error messages above

Continue to next step? (y/n) [y]:
```

✅ **CRUD Generation Errors**

```
✗ CRUD generation failed!
⚠ Troubleshooting:
  • Ensure database tables exist (run migrations first)
  • Check if generate.php script exists
  • Review error messages above
```

---

---

## 📊 Comparison

### Startup Process:

**PHP CLI (`init.php`):**

```bash
$ php padi init
╔════════════════════════════════════════╗
║    Setup Wizard Started                ║
╚════════════════════════════════════════╝
ℹ Checking prerequisites...
✓ All checks passed
```

### Professional CLI Experience

### Error Messages:

**Padi Console:**

```bash
$ php padi init
✗ Setup failed: .env.example not found!
  Please ensure .env.example exists in the project root.
  Current directory: C:\xampp\htdocs\project
```

### User Experience:

**PHP CLI:**

- ✅ Colored output (green ✓, red ✗, yellow ⚠)
- ✅ Clear progress indicators
- ✅ Helpful error messages
- ✅ Default values shown
- ✅ Confirmation prompts

- ✅ **Artisan & Yii Inspired** - A familiar and professional tool for PHP developers

---

## 🛠️ Manual Setup

In scenarios where you cannot use the CLI, you can setup manually:

### Step 1: Create .env

```bash
cp .env.example .env
# or
copy .env.example .env
```

### Step 2: Edit .env

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=rest_api_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=<run: php -r "echo bin2hex(random_bytes(32));">
```

---

## ✅ Recommended Workflow

### For All Users:

```bash
# 1. Install dependencies
composer install

# 2. Run Padi Console Setup (RECOMMENDED!)
php padi init

# 3. Start server
php -S localhost:8085 -t public
```

---

---

## 📝 Summary

| Question            | Answer                                     |
| ------------------- | ------------------------------------------ |
| **Recommended Way** | `php padi init`                            |
| **Why this way?**   | Universal, stable, and highly professional |
| **Manual setup?**   | Available as fallback                      |
| **Inspiration**     | Artisan & Yii2 Console                     |

---

**Happy Setup! 🚀**
