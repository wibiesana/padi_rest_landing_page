# ⚙️ Configuration Guide

## ⚙️ Precision-Tuned Control Center

Master your application's environment with our **Industrial-Grade Configuration Engine**. Padi REST API utilizes a sophisticated `.env` architecture that allows you to pivot between development agility and production-grade security with a single line of code. From surgical database tuning to high-security JWT orchestration, our configuration layer ensures your infrastructure is always optimized for maximum performance and architectural integrity.

---

## 📋 Table of Contents

- [⚙️ Precision-Tuned Control Center](#precision-tuned-control-center)

- [Environment Variables (.env)](#environment-variables-env)
- [Development Configuration](#development-configuration)
- [Production Configuration](#production-configuration)
- [Configuration Sections](#configuration-sections)
- [Generate Strong JWT Secret](#generate-strong-jwt-secret)
- [Environment-Specific Best Practices](#environment-specific-best-practices)
- [Configuration Validation](#configuration-validation)
- [Next Steps](#next-steps)

---


## Environment Variables (.env)

The `.env` file contains all configuration settings for your application.

---

## Development Configuration

### Complete Development .env

```env
# Application
APP_NAME="Padi REST API"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8085

# Debug Options
DEBUG_SHOW_QUERIES=true
ENABLE_COMPRESSION=true

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rest_api_db
DB_USER=root
DB_PASS=your_password

# Security
JWT_SECRET=<your-64-char-random-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRY=3600

# CORS (leave empty for development = allow all)
CORS_ALLOWED_ORIGINS=

# Rate Limiting
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW=60
```

### Development Settings Explained

| Variable               | Value         | Description                        |
| ---------------------- | ------------- | ---------------------------------- |
| `APP_ENV`              | `development` | Enables detailed error messages    |
| `APP_DEBUG`            | `true`        | Shows stack traces and debug info  |
| `DEBUG_SHOW_QUERIES`   | `true`        | Logs SQL queries in response       |
| `CORS_ALLOWED_ORIGINS` | _(empty)_     | Allows all origins (for local dev) |

---

## Production Configuration

### Complete Production .env

```env
# Application
APP_NAME="Padi REST API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

# Debug Options
DEBUG_SHOW_QUERIES=false
ENABLE_COMPRESSION=true

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rest_api_db
DB_USER=api_user
DB_PASS=strong_random_password_here

# Security
JWT_SECRET=<different-secret-for-production>
JWT_ALGORITHM=HS256
JWT_EXPIRY=3600

# CORS (specify exact domains)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW=60
```

### Production Settings Explained

| Variable               | Value            | Description                      |
| ---------------------- | ---------------- | -------------------------------- |
| `APP_ENV`              | `production`     | Disables detailed error messages |
| `APP_DEBUG`            | `false`          | Hides stack traces from users    |
| `DEBUG_SHOW_QUERIES`   | `false`          | Prevents query exposure          |
| `CORS_ALLOWED_ORIGINS` | Specific domains | Restricts API access             |

---

## Configuration Sections

### 1. Application Settings

```env
APP_NAME="Padi REST API"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8085
```

- **APP_NAME**: Application name (used in responses)
- **APP_ENV**: Environment (`development` or `production`)
- **APP_DEBUG**: Enable/disable debug mode
- **APP_URL**: Base URL of your API

### 2. Debug Options

```env
DEBUG_SHOW_QUERIES=true
ENABLE_COMPRESSION=true
```

- **DEBUG_SHOW_QUERIES**: Show SQL queries in API responses
- **ENABLE_COMPRESSION**: Enable Gzip compression

### 3. Database Configuration

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rest_api_db
DB_USER=root
DB_PASS=your_password
```

- **DB_HOST**: Database server hostname
- **DB_PORT**: Database port (3306 for MySQL)
- **DB_NAME**: Database name
- **DB_USER**: Database username
- **DB_PASS**: Database password

### 4. JWT Security

```env
JWT_SECRET=<your-64-char-random-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRY=3600
```

- **JWT_SECRET**: Secret key for JWT signing (64 characters)
- **JWT_ALGORITHM**: Signing algorithm (HS256 recommended)
- **JWT_EXPIRY**: Token expiry time in seconds (3600 = 1 hour)

### 5. CORS Configuration

```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

- **Empty**: Allow all origins (development only)
- **Comma-separated**: Specific allowed origins (production)

### 6. Rate Limiting

```env
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW=60
```

- **RATE_LIMIT_MAX**: Maximum requests allowed
- **RATE_LIMIT_WINDOW**: Time window in seconds

---

## 📖 Complete `.env` Reference Table

Here is the complete reference table for all available environment variables in your `.env` file:

### 1. Application & Debugging
| Variable | Default | Description |
|---|---|---|
| `APP_VERSION` | `1.0.0` | Target version of the application. |
| `APP_NAME` | `"Padi REST API Framework"` | Name of the API, used in headers and templates. |
| `APP_ENV` | `development` | Environment mode (`development` or `production`). |
| `APP_DEBUG` | `true` | Toggles detailed stack traces and debugging information. |
| `APP_URL` | _(auto)_ | Explicit base URL. Leave empty to auto-detect from requests. |
| `RESPONSE_FORMAT` | `full` | Format style: `full` (standard), `simple` (flat), or `raw`. |
| `ENABLE_COMPRESSION` | `true` | Enable gzip compression on HTTP responses. |
| `DEBUG_SHOW_QUERIES` | `true` | Appends SQL execution queries list in API response payload. |
| `DEBUG_SHOW_ALL_DB_ERRORS` | `false` | Expose raw database connection errors in response. |

### 2. Database Connections
| Variable | Default | Description |
|---|---|---|
| `DB_CONNECTION` | `mysql` | Target driver: `mysql`, `pgsql`, `sqlite`, or `mariadb`. |
| `DB_HOST` | `localhost` | Hostname of database server. |
| `DB_PORT` | `3306` | Port number of database server. |
| `DB_DATABASE` | `rest_api_db` | Name of the database schema. |
| `DB_USERNAME` | `root` | Database username. |
| `DB_PASSWORD` | _(empty)_ | Database password. |
| `DB_CHARSET` | `utf8mb4` | Connection charset. |
| `DB_COLLATION` | `utf8mb4_unicode_ci`| Connection collation. |

### 3. JWT Security & CORS
| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | _(required)_ | HS256 secret key. Must be a strong 32+ character random hash. |
| `JWT_ALGORITHM` | `HS256` | JWT signing method: `HS256`, `HS384`, or `HS512`. |
| `JWT_EXPIRY` | `3600` | Token validity time in seconds. |
| `CORS_ALLOWED_ORIGINS` | `*` | Allowed client domains (comma-separated). |
| `RATE_LIMIT_MAX` | `60` | Max requests allowed per window. |
| `RATE_LIMIT_WINDOW` | `60` | Rate limiter window in seconds. |

### 4. Mail Settings & Queue Tasks
| Variable | Default | Description |
|---|---|---|
| `MAIL_DRIVER` | `smtp` | Mailer method: `smtp` or `mail`. |
| `MAIL_HOST` | `smtp.mailtrap.io`| SMTP Server hostname. |
| `MAIL_PORT` | `2525` | SMTP Server port. |
| `MAIL_USERNAME` | _(empty)_ | SMTP Server username. |
| `MAIL_PASSWORD` | _(empty)_ | SMTP Server password. |
| `MAIL_ENCRYPTION` | `tls` | SMTP security protocol (`tls` or `ssl`). |
| `MAIL_FROM_ADDRESS` | `noreply@...` | Email sender address. |
| `MAIL_FROM_NAME` | `"${APP_NAME}"`| Email sender display name. |
| `SEND_WELCOME_EMAIL` | `false` | Toggle automated welcome emails during registration. |

### 5. Caching & Redis Config
| Variable | Default | Description |
|---|---|---|
| `CACHE_DRIVER` | `file` | Cache driver: `file` or `redis`. |
| `CACHE_L1_MAX` | `1000` | Max entries to hold in memory. |
| `CACHE_L1_MAX_MEMORY_MB`| `64` | Max RAM usage for L1 cache. |
| `REDIS_HOST` | `127.0.0.1` | Redis server hostname. |
| `REDIS_PORT` | `6379` | Redis server port. |
| `REDIS_PASSWORD` | _(empty)_ | Redis server password. |
| `REDIS_PREFIX` | `padi:` | Prefix key name for Redis cache. |

### 6. Queue Processing
| Variable | Default | Description |
|---|---|---|
| `QUEUE_DRIVER` | `sync` | Queue driver: `sync` (instant), `database`, or `redis`. |
| `QUEUE_MAX_ATTEMPTS` | `3` | Maximum task retry limit before marking as failed. |
| `QUEUE_SLEEP` | `3` | Worker sleep time in seconds when queue is empty. |
| `QUEUE_GC_INTERVAL` | `100` | Garbage collection trigger interval (job counts). |
| `QUEUE_MAX_JOBS` | `1000` | Maximum jobs worker processes before restarting. |

### 7. FrankenPHP Workers
| Variable | Default | Description |
|---|---|---|
| `MAX_REQUESTS` | `500` | Restart worker process after N requests to clear leaks. |
| `GC_INTERVAL` | `50` | Call garbage collector cycle every N requests. |
| `COLUMNS_CACHE_TTL` | `3600` | Column metadata cache timeout (seconds) for performance. |

### 8. Real-time Broadcasting (Mercure)
| Variable | Default | Description |
|---|---|---|
| `MERCURE_ENABLED` | `false` | Enable or disable SSE broadcasting. |
| `MERCURE_HUB_URL` | _(empty)_ | Internal Mercure publishing endpoint (PHP curl client). |
| `MERCURE_PUBLIC_HUB_URL`| _(empty)_ | External client connect endpoint. |
| `MERCURE_PUBLISHER_JWT_KEY`| _(empty)_| Publisher secret JWT signing key. |
| `MERCURE_SUBSCRIBER_JWT_KEY`| _(empty)_| Subscriber secret JWT verification key. |

---

## Generate Strong JWT Secret

### Method 1: PHP Command

```bash
php -r "echo bin2hex(random_bytes(32));"
```

### Method 2: OpenSSL

```bash
openssl rand -hex 32
```

### Method 3: Online Generator

Use a secure random string generator (64 characters minimum)

**⚠️ Important:**

- Never use the same secret in development and production
- Never commit `.env` to version control
- Store production secrets securely

---

## Environment-Specific Best Practices

### Development

✅ **DO:**

- Use `APP_DEBUG=true` for detailed errors
- Leave `CORS_ALLOWED_ORIGINS` empty
- Use `DEBUG_SHOW_QUERIES=true` for debugging

❌ **DON'T:**

- Use production database
- Use production JWT secret
- Commit `.env` file

### Production

✅ **DO:**

- Set `APP_ENV=production`
- Set `APP_DEBUG=false`
- Specify exact CORS origins
- Use strong database password
- Generate new JWT secret

❌ **DON'T:**

- Enable debug mode
- Allow all CORS origins
- Use weak passwords
- Expose SQL queries

---

## Configuration Validation

### Check Current Configuration

```bash
# View current environment
php -r "echo getenv('APP_ENV');"

# Test database connection
php scripts/test_db.php
```

### Common Configuration Issues

| Issue                      | Solution                                    |
| -------------------------- | ------------------------------------------- |
| Database connection failed | Check DB credentials in `.env`              |
| JWT token invalid          | Verify JWT_SECRET is set                    |
| CORS errors                | Add frontend domain to CORS_ALLOWED_ORIGINS |
| Rate limit too strict      | Increase RATE_LIMIT_MAX                     |

---

## Next Steps

1. **First Steps** - See [FIRST_STEPS.md](FIRST_STEPS.md)
2. **Database Setup** - See [../02-core-concepts/DATABASE.md](../02-core-concepts/DATABASE.md)
3. **Security Best Practices** - See [../03-advanced/SECURITY.md](../03-advanced/SECURITY.md)

---

**Previous:** [← Installation Guide](INSTALLATION.md) | **Next:** [First Steps →](FIRST_STEPS.md)
