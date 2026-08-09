# CHANGE LOG

## v2.1.5 (2026-08-09)

### ⚡ Realtime Service FrankenPHP Worker Mode Optimization & Robustness

- **In-Memory Publisher JWT Caching**: Implemented static `$jwtCache` in `Realtime.php` to prevent CPU-intensive HMAC SHA-256 regeneration on every `publish()` call during long-running worker processes.
- **Worker Process Memory Leak Fix**: Ensured `curl_close()` is always executed to release cURL handles immediately.
- **Persistent Connections & Optimized Defaults**: Added `Connection: keep-alive` HTTP headers and `curl_setopt_array()` for faster execution. Standardized connection and request timeouts (500ms / 1000ms).
- **Batch Realtime Publishing**: Introduced `Realtime::publishBatch(array $events)` to allow publishing multiple SSE events in a single loop efficiently.
- **Enhanced Security & Validation**: Enforced strict `MERCURE_ENABLED` boolean check, strict `JSON_THROW_ON_ERROR` handling, `iat` & `exp` claims on Publisher JWTs, and environment-aware SSL verification.

### 📚 Documentation Enhancements

- **ActiveRecord CRUD Guide Improvements**: Enhanced Create, Update, and Delete documentation in `ACTIVE_RECORD.md` with beginner-friendly, real-world controller examples and input validation (`$this->validate()`).
- **Response Engine Documentation**: Expanded `RESPONSE_STRUCTURE.md` with complete controller methods and matching HTTP JSON payloads (including Single Item, Paginated, Collection, Custom Array Return `return [...]`, and API Resource Transformers).

### 🧹 Template Migration Cleanup & Setup Wizard Alignment

- **Removal of Default Example Migrations**: Removed legacy example migrations (`posts`, `tags`, `post_tags`, `comments`) from `padi_template/database/migrations/` to streamline starter migrations (`users` and `password_resets` only).
- **Setup Wizard Streamlining**: Updated interactive setup wizard migration options in `scripts/init.php` to align with base migrations.

## v2.1.4 (2026-08-09)

### 🛡️ Production Debug Exposure Prevention

- **Strict Environment Debug Guarding**: Enforced dual condition (`APP_ENV === 'development'` AND `APP_DEBUG === 'true'`) across framework core classes (`Router.php`, `Controller.php`, `Database.php`, `Auth.php`, `Validator.php`). Prevents internal debug payloads (`file`, `line`, `trace`) from being exposed in error responses when running in production, even if `APP_DEBUG=true` remains in environment settings.

### 🐛 ModelQuery & ActiveRecord Return Type Fix

- **Strict `ModelQuery` Return Type on `ActiveRecord::find()`**: Fixed static analyzer / IDE error ("Undefined method 'with'") when chaining `$query->with()`. Split `ActiveRecord::find()` to exclusively return `ModelQuery` for fluent query building, and introduced `ActiveRecord::findByPk()` specifically for primary key lookups. Updated `findOne()` to utilize `findByPk()` internally.

## v2.1.3 (2026-07-23)

### ⚡ FrankenPHP Console Commands (Worker & Standard Mode)

- **Native FrankenPHP Console Integration**: Added direct CLI support to run FrankenPHP in both Standard and Worker modes via `php padi`:
  - `php padi serve:frankenphp` / `php padi frankenphp`: Launches FrankenPHP server in Standard Mode.
  - `php padi serve:worker` / `php padi frankenphp:worker`: Launches FrankenPHP server in Worker Mode (`public/index.php`).
  - Added CLI flags for `php padi serve`: `--frankenphp` / `--driver=frankenphp` (Standard Mode), `--worker` / `--mode=worker` (Worker Mode), `--workers=<N>` (Worker count), and `--config=<path>` (Caddyfile path).
  - Added intelligent biner resolution (`findFrankenphpBinary`) to detect local `frankenphp` / `frankenphp.exe` in project root or system `PATH` with clear user guidance if missing.

### 🔗 Automatic Relation Sorting in CRUD Generator

- **Auto Relational Sorting**: Enhanced CRUD generator (`php padi generate:crud`) to automatically generate relational sorting logic in controllers. When foreign key relations are present, passing `sort_by={relation_name}` (e.g. `sort_by=subject`) automatically joins the referenced table and orders results by the target display column (e.g. `subject.name`), without requiring manual controller modifications or duplicate SQL joins.

### 🐞 Double Slash Route Matching Fix

- **Double Slash (`//`) URL Normalization**: Fixed route dispatch failure ("Route not found" / `ROUTE_NOT_FOUND`) when accessing URLs containing double slashes (e.g. `http://domain.com//auth/login`) on VPS and FrankenPHP. PHP's native `parse_url()` misinterprets leading double slashes as a scheme-relative authority/host, stripping the first path segment. Normalized `REQUEST_URI` handling in `Request.php` and `Application.php` to collapse leading and consecutive slashes for path matching while preserving query string parameters.

## v2.1.2 (2026-07-20)

### 🐞 Bug Fixes & Validation Hardening

- **Dynamic Number Validation Fix**: Fixed validation rules (`min`, `max`, `between`, `size`) in `Validator.php` which incorrectly cast string identifiers consisting entirely of digits (e.g. `nip`, `nik`, `nuptk`) to numeric types. These identifiers are now evaluated by string length unless they are explicitly declared as `numeric` or `integer`.
- **User Model Audit Field Fix**: Fixed `User` model timestamp/audit field saving by changing `$timestampFormat` to `'unix'` to match the database column data type (`int(11)`) and ensuring `parent::beforeSave($data, $insert)` is called in `User::beforeSave()`. This resolves the `SQLSTATE[HY000]: General error: 1364 Field 'created_at' doesn't have a default value` error when creating new users/teachers.

## v2.1.1 (2026-07-16)

### ⚡ Queue Performance & Sub-Second Polling

- **Sub-Second Queue Polling**: Updated `Queue::work()` to parse `QUEUE_SLEEP` as a float/decimal value and use `usleep()` for sub-second values (e.g., `0.5`). This allows background jobs to execute almost instantly without high CPU overhead or waiting 3 seconds.
- **Improved Queue Documentation**: Added description to `.env.example`, `CONFIGURATION.md`, and `QUEUE.md` explaining support for decimal/float queue sleep seconds.

### ⚙️ DevOps & Configuration Hardening

- **Caddyfile Path Verification & Flexibility**: Verified and aligned Caddyfile configuration paths (`Caddyfile.standard` and `Caddyfile.worker`) with the Docker/FrankenPHP working directory structure, adding customizable environment variable overrides (e.g., `PUBLIC_ROOT`, `WORKER_INDEX_PATH`, and `MERCURE_DB_PATH`).
- **Mercure Routing Isolation**: Added route match rules (`@notMercure` and `not path /.well-known/mercure*`) to ensure the built-in Mercure SSE hub endpoints are bypassed by the PHP/FrankenPHP handler.

### 🐞 Bug Fixes & Database Compatibility

- **SQLite Database Path Auto-Resolution**: Enhanced SQLite connection logic in `config/database.php` to automatically detect absolute vs relative paths, resolving relative database paths from the project root while retaining support for `:memory:` mode.
- **Driver-Independent Migrations**: Hardened the `002_create_password_resets_table.php` migration by detecting the active database driver (`sqlite`, `pgsql`, or `mysql`/`mariadb`) and executing compatible schema and index statements for each specific driver.

## v2.1.0 (2026-07-15)

### 🐞 Bug Fixes & Refactoring

- **Database & PHP 8.4+ Compatibility**:
  - Replaced deprecated `PDO::MYSQL_ATTR_FOUND_ROWS` with `Pdo\Mysql::ATTR_FOUND_ROWS` in `DatabaseManager` to support PHP 8.4+.
  - Removed deprecated `curl_close()` call in `Realtime` since cURL uses `CurlHandle` objects starting from PHP 8.0.
- **Authentication & Registration**:
  - Added strict `required` validation for `username` and `password` fields in `AuthController::register()`.
  - Replaced manual password confirmation matching checks with the framework's native `confirmed` validation rule.
  - Resolved status check inconsistency in `User::findActiveByEmail` and `User::findActiveByUsername` models to correctly support both numeric (`1`) and string (`'active'`) values.
- **User Management**:
  - Corrected validation type error on `email_verified_at` field from `'email'` to `'nullable|date'` in `UserController::store()` and `UserController::update()`.
- **Worker Mode & Process Resiliency (FrankenPHP)**:
  - Fixed request failure crash vulnerability by catching all `\Throwable` instances instead of just `\Exception` in `Router::dispatch()`.
  - Hardened exception handling in `Application::handleException()` to hide internal error traces and debug messages on production environments for 5xx status codes.
  - Guarded `ActiveRecord::create()` against parsing issues when dealing with composite primary keys by only mapping `lastInsertId` if the primary key is a string.
- **Middleware & Cache Performance**:
  - Refactored `RateLimitMiddleware.php` to leverage the core unified `Cache` component, eliminating potential file I/O race conditions under concurrency and utilizing Redis when available.
  - Enhanced `Validator`'s `min` and `max` constraints to properly check numerical values (numerical comparisons) and array sizes (counts) in addition to character lengths.
  - Added `JSON_THROW_ON_ERROR` to `Response::json()` output formatting logic with try-catch fallback handling to prevent silent serialization failures.
  - Cleaned up duplicate docblocks on relation-loading methods inside the `ActiveRecord` class.

### ⚡ Native Real-time Pub/Sub Capabilities (FrankenPHP Mercure)

Introduced native support for pushing real-time messages to connected clients using the built-in Mercure SSE Hub inside FrankenPHP.

- **`Realtime` Core Service (`padi_core`)**:
  - Added a new light-weight, zero-dependency `Wibiesana\Padi\Core\Realtime` service class.
  - Implements `Realtime::publish()` for pushing JSON payloads to Mercure topics via fast non-blocking cURL.
  - Implements `Realtime::generateSubscriberJwt()` for creating secure subscriber JWT tokens dynamically.
  - **Fast Fail-Fast Timeout**: Switched to sub-second millisecond-level timeouts (`200ms`) for internal loopback connections to ensure server speed is never compromised under heavy loads.
- **Background Queue Integration**:
  - Introduced `BroadcastRealtimeJob` to offload HTTP Mercure publishing tasks to background queue workers, ensuring zero latency impact.
- **Global Toggle (`.env`)**:
  - Introduced `MERCURE_ENABLED` flag to toggle the real-time server-sent events at runtime with zero overhead when disabled.
- **Autentikasi Integration**:
  - Automatically attaches `realtime` parameters (hub url and JWT token) to login and register responses only if `MERCURE_ENABLED=true` AND `MERCURE_HUB_URL` is set.
- **Code Generator Integration**:
  - Adds interactive CLI questions and `--realtime` flag to `generate:crud` and `generate:crud-all` commands.
  - **Queue-by-default Hooks**: Automatically writes background-ready `afterSave` and `afterDelete` hooks calling `Queue::push(BroadcastRealtimeJob::class, ...)` into concrete models when enabled.
  - **Synchronous Fallback**: Introduced `--realtime-sync` option/prompt to generate direct `Realtime::publish` synchronous calls if a background queue is not desired.
  - **Dynamic Route Grouping**: Refactored the route builder to dynamically split endpoints into public and protected routing groups.
  - **Strict Default Protection**: Changed the default behavior when `--protected` is omitted so that all CRUD routes (`index`, `all`, `show`, `store`, `update`, `destroy`) require authentication by default. Developers can pass `--protected=none` to keep routes public, or specify exact actions.

### 🛡️ Boilerplate Robustness & Mail Upgrades

- **Safe Mail Queue Job**: Wrapped `Email::send()` inside `SendEmailJob` in a try-catch block to prevent registration flow crashes if PHPMailer or mail server configuration is missing.
- **Configurable Welcome Email**: Welcome email queueing is now completely optional and configurable via the `SEND_WELCOME_EMAIL` env variable, dynamically adjusting the registration response messages.
- **Caddyfile Deletion Notes**: Added clear comment markers in `Caddyfile.standard` and `Caddyfile.worker` to allow developers to cleanly remove unused Mercure server configurations.
- **API Client Collections Cleanup**: Added a dedicated `examples_api_collection.json` containing test requests for `ExampleRBACController` and `ExampleRealtimeController`, removed the redundant `passwordreset_api_collection.json` file, and integrated all collection details directly into the central docs directory.

## v2.0.13 (2026-07-13)

### 🛡️ Validator Upgrades: 14 New REST-oriented Validation Rules

Expanded the validation engine to support complex REST scenarios with conditional, format-specific, and size-based checks.

- **New Validation Rules**:
  - **Presence & Conditional**: `sometimes` (skip if absent), `required_if:field,value`, `required_with:fields`, `required_without:fields`.
  - **Types & Formats**: `string`, `json`, `uuid`, `boolean`, `date_format:format`, `before:date`, `after:date`.
  - **Size & Sets**: `between:min,max` (string length/numeric value/array count), `size:value`, `not_in:values`, `alpha_dash`.
- **Worker-Safe Cache Isolation**: Added `LOCK_EX` on rate-limiter file updates and `array_values()` to prevent sparse array representation in storage cache under concurrent server environments.

### ⚙️ Code Generator: Smarter Validation Rules & Partial Update Support

Upgraded `Generator.php` to leverage the new rules and handle updates properly:

- **Partial Updates Support (`sometimes`)**: Concrete models generated now use `sometimes` rule instead of `required` during `update()` calls, preventing errors on partial PUT/PATCH API requests.
- **Smarter Type Mapping**:
  - `tinyint(1)` database columns are now automatically mapped to `boolean` rule.
  - `text`/`longtext` columns map to `string` rule without maximum length limit constraint.
  - `date` and `datetime/timestamp` columns are mapped to `date_format:Y-m-d` and `date_format:Y-m-d H:i:s` respectively.
  - Generates semantic `url`, `uuid` and `email` checks based on database column names.
- **Auditing exclusion**: `created_by` and `updated_by` are now excluded from generated rules since they are automatically populated by the framework.

### 📦 Boilerplate Template Alignments

- **`PasswordReset` model**: Added missing model implementation required by `PasswordResetController`.
- **`SendEmailJob` cleanup**: Removed simulated `sleep(2)` blocking statement.
- **`SiteController`**: Streamlined methods to return clean arrays instead of redundant manual `Response` objects.

### 🚀 Feature: `joinWith()` for SQL JOIN Queries

Added `joinWith()` method to `ModelQuery`, enabling SQL JOIN-based queries across related models. Unlike `with()` (which uses separate queries for eager loading), `joinWith()` generates SQL JOINs in the main query — allowing you to filter, sort, group, and aggregate across related tables in a single query.

- **`ModelQuery::joinWith()`**: Automatically resolves model relation definitions into SQL `LEFT JOIN` clauses.
  - Automatically aliases joined tables to their relation names if no manual alias is specified to prevent name resolution issues.
  - Supports simple relations: `->joinWith(['customer'])`
  - Supports aliases: `->joinWith(['customer c'])`
  - Supports nested relations: `->joinWith(['orderItems.product p'])`
  - Supports `belongsToMany` (double JOIN through pivot table)
  - Configurable JOIN type (`LEFT JOIN`, `INNER JOIN`, `RIGHT JOIN`)
- **`Query::having()` & `andHaving()` / `orHaving()` — Chainable HAVING**:
  - Support for multiple having clauses in string or array format (e.g. `->having(['>', 'COUNT(id)', 5])->andHaving(...)`).
- **`Query::addGroupBy()`**: Appends columns to the GROUP BY clause without replacing existing ones.
- **`Query::indexBy()`**: Indexes query results by a specified column name (string) or dynamic callback (callable).
- **`Query::union()`**: Combines multiple query results using SQL `UNION`/`UNION ALL` (with auto-renaming parameter logic to prevent placeholder collisions).
- **`ActiveRecord::findAll()` & `ActiveRecord::deleteAll()`**: Mass retrieval and mass deletion based on conditions or lists of primary keys (flat array of IDs).
- **`ModelQuery::batch()` & `ModelQuery::each()`**: Memory-efficient batch iteration using PHP Generators (perfect for large datasets).
- **`ModelQuery::asArray()`**: No-op method for transition/compatibility with other ORMs.
- **`ActiveRecord::getRelationConfig()`**: Public accessor for relation definitions, used internally by `joinWith()`.
- **`ActiveRecord::getPrimaryKeyName()`**: Public accessor for primary key column name(s).

### ⚡ Performance & Dependency Optimization

Comprehensive optimizations to reduce per-request resource usage, minimize external dependencies, and ensure the framework runs as lightweight as possible.

- **Dependencies — Ultra-Lightweight Core Refactoring**:
  - Reduced mandatory dependencies from 4 packages down to just 1 (`firebase/php-jwt`).
  - Saves **~6.3 MB+** from the vendor directory.
  - **`Logger`**: Removed `monolog/monolog` (saving ~3 MB). Rewrote `Logger.php` using native PHP file operations with concurrent-safe file locking (`LOCK_EX`) and automatic 14-day daily rotation.
  - **`Cache`**: Moved `predis/predis` to `suggest` (saving ~2.5 MB). Added support for PHP extension `ext-redis` (C extension, faster) and fallback to file cache if no Redis driver is installed.
  - **`Email`**: Moved `phpmailer/phpmailer` to `suggest` (saving ~800 KB). Added structural verification using `class_exists` to throw informative errors when sending mail if not installed.

- **`Response::sendHeaders()` — Remove Duplicate Security Headers**:
  - Removed `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` headers that were already sent by `Application::sendSecurityHeaders()`.
  - Saves 2 `header()` system calls per response.

- **`Env::get()` — Cache `getenv()` Results**:
  - When `getenv()` finds a system environment variable, the result is now cached into `$_ENV` so subsequent lookups for the same key use fast O(1) array access instead of repeated system calls.

- **`Router` — Method-Indexed Route Dispatch**:
  - Routes are now indexed by HTTP method (`$routes['GET'][]`, `$routes['POST'][]`, etc.) instead of a flat array.
  - Dispatch only iterates routes matching the current method, significantly reducing iterations (e.g., from 60 total routes down to ~10 per request).
  - `addRoute()` stores routes under `$routes[$method][]` and removes the `method` field from each route entry.
  - `middleware()` chaining updated to use `$lastMethod` tracking for the new structure.
  - `dispatch()` uses `$this->routes[$method] ?? []` for direct lookup.

- **`Cache` — Static Miss Sentinel**:
  - Replaced `new \stdClass()` created on every `get()`, `has()`, and `remember()` call with a single static sentinel instance reused via `self::miss()`.
  - Eliminates 1 object allocation per cache call on a hot path.

- **`Application::handleCors()` — Production Early Return**:
  - In production mode, requests without an `Origin` header (the majority of API calls from backend/mobile clients) now return immediately without sending `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.
  - Saves 2 unnecessary `header()` calls on non-CORS requests.

- **`Request::parseHeaders()` — Optimized String Operations**:
  - Replaced the `str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', ...))))` chain with `strtr()` + `ucwords`, which is more efficient.
  - `strtr()` with single-char translation is faster and produces fewer intermediate string allocations.

- **`DatabaseManager::createMySQLConnection()` — Consolidated SET SESSION Queries**:
  - Combined 3 separate `SET SESSION` statements (`sql_mode`, `wait_timeout`, `interactive_timeout`) into a single `exec()` call using multi-statement syntax.
  - Reduces 3 database round-trips to 1 per new connection, especially impactful on shared hosting (non-worker mode) where connections are created per request.

### 📊 Resource Savings Summary

| Metric                                                | Before | After |
| ----------------------------------------------------- | ------ | ----- |
| `header()` calls per response (production, no origin) | 9      | 5     |
| DB queries per new MySQL connection                   | 3      | 1     |
| Route iterations per dispatch (60 routes)             | ~60    | ~10   |
| Object allocations per cache call                     | 1      | 0     |
| `getenv()` system calls (repeated key)                | N      | 1     |

## v2.0.12 (2026-07-04)

### 🛡️ Memory Leak Fixes — Standard & FrankenPHP Worker Mode

- **`Database::logQuery()` — Bounded Query Log**:
  - Added `$maxQueryLog = 100` cap on `self::$queries[]` to prevent unbounded array growth when `APP_DEBUG=true` in long-lived PHP-FPM or FrankenPHP worker processes.
  - Added `$maxQueryParams = 20` cap on stored params per query to prevent large payloads (e.g. bulk inserts) from inflating the in-memory debug log.

- **`ActiveRecord::$columnsCache` — TTL-Based Invalidation**:
  - Replaced forever-cached column metadata with a configurable TTL (default: 3600s via `COLUMNS_CACHE_TTL` env).
  - Cache now auto-refreshes after `ALTER TABLE` operations without requiring a worker restart.
  - Added `$columnsCacheTtl[]` timestamp array to track per-table cache age.
  - `clearColumnsCache()` now also resets the TTL timestamps array.

- **`ActiveRecord::clearWith()` — Explicit Relation State Reset**:
  - Added `clearWith(): self` method to allow safe resetting of eager-load relations on a reused model instance, preventing unintentional relation accumulation.

- **`Cache::setMemory()` — Memory Usage Guard**:
  - Added `memory_get_usage()` check against `$maxMemoryBytes` (configurable via `CACHE_L1_MAX_MEMORY_MB` env, default: 64 MB).
  - L1 memory cache is force-cleared when PHP process memory exceeds the configured limit, preventing value-heavy entries from exhausting worker process memory.
  - `init()` now loads `CACHE_L1_MAX_MEMORY_MB` from env and converts it to bytes.

- **`Application::registerErrorHandlers()` — WeakReference Exception Handler**:
  - Changed `set_exception_handler([$this, 'handleException'])` to use a `WeakReference::create($this)` static closure.
  - Prevents the global exception handler registry from holding a strong reference to the `Application` instance, allowing proper GC in test environments and multi-instance setups.

- **`Application::run()` — Periodic GC in Worker Loop**:
  - Added `gc_collect_cycles()` call every `GC_INTERVAL` requests (configurable via env, default: 50) in the FrankenPHP worker loop.
  - Cleans up circular references from controllers and middleware objects between worker restart cycles, reducing baseline memory growth.

- **`Queue::work()` — Worker Restart & Periodic GC**:
  - Added `$gcInterval` (env: `QUEUE_GC_INTERVAL`, default: 100) — calls `gc_collect_cycles()` every N processed jobs.
  - Added `$maxJobs` (env: `QUEUE_MAX_JOBS`, default: 1000) — worker exits cleanly after N jobs so the process supervisor can restart with a fresh memory state.
  - Added `unset($instance)` after each job's `handle()` call to release job object and any resources it holds immediately after processing.

- **`DatabaseManager::createConnection()` — Error History Cap**:
  - Applied the same `$maxErrorHistory` cap to connection errors pushed in `createConnection()`.
  - Previously, only `logError()` had this cap; repeated DB-down scenarios could cause `$databaseErrors[]` to grow unboundedly.

### 🆕 New Environment Variables

| Variable                 | Default | Description                                                          |
| ------------------------ | ------- | -------------------------------------------------------------------- |
| `GC_INTERVAL`            | `50`    | Run `gc_collect_cycles()` every N requests in FrankenPHP worker      |
| `COLUMNS_CACHE_TTL`      | `3600`  | TTL (seconds) for ActiveRecord column metadata cache; `0` = forever  |
| `CACHE_L1_MAX_MEMORY_MB` | `64`    | Max PHP memory (MB) before L1 cache is force-cleared; `0` = disabled |
| `QUEUE_GC_INTERVAL`      | `100`   | Run `gc_collect_cycles()` every N queue jobs                         |
| `QUEUE_MAX_JOBS`         | `1000`  | Queue worker exits after N jobs for memory hygiene                   |

### 🌐 File Upload: Portable URL & Auto Path Auto-Detection

- **`File::url()` — Server-Portable URLs**:
  - Rewrote `File::url()` to auto-detect the base URL from the live HTTP request (`scheme + HTTP_HOST`) instead of hardcoding `APP_URL`.
  - Resolution order: `APP_URL` env (if set to a non-localhost domain) → current HTTP request → `http://localhost` fallback.
  - Upload file URLs now work correctly across any server (dev → staging → production) without modifying `.env`.
  - Supports reverse proxy scheme detection via `HTTP_X_FORWARDED_PROTO` and `HTTP_X_FORWARDED_SSL` headers.

- **`File::urlOrNull()` — Nullable Column Safety**:
  - Added `urlOrNull(?string $path): ?string` — returns `null` for empty/null paths instead of generating a broken URL. Ideal for optional file columns in database models.

- **`File::isAbsoluteUrl()` — Legacy Data Guard**:
  - Added `isAbsoluteUrl(string $path): bool` to detect if a stored value is already a full URL (http/https). Used internally in `url()` to safely handle legacy data that was mistakenly stored as absolute URLs.

- **`config/app.php` — Smarter APP_URL Auto-Detect**:
  - Extended auto-detection to also override `APP_URL` when it contains a localhost/127.0.0.1 placeholder (not just when empty).
  - Propagates the detected URL to `$_ENV['APP_URL']` and `putenv()` so `Env::get('APP_URL')` returns the correct value across all classes in the same request.

- **`.env.example` — APP_URL Default Changed to Empty**:
  - `APP_URL` now defaults to empty string (auto-detect mode) instead of `http://localhost:8085`.
  - Added comprehensive inline documentation explaining auto-detect vs. explicit override use cases.

### 🚀 Core: Support Both FrankenPHP Worker & Non-Worker Modes

- **Worker Mode Detection Hardening**:
  - Upgraded worker mode detection (`$isWorkerMode`) to check both `function_exists('frankenphp_handle_request')` and the presence of `$_SERVER['FRANKENPHP_WORKER']`.
  - Prevents the application from running in worker mode loops when deployed in FrankenPHP standard/non-worker environments (where `frankenphp_handle_request` is compiled but worker mode is disabled).
- **Graceful Response Termination**:
  - Restructured `Response::terminate()` to check `$_SERVER['FRANKENPHP_WORKER']` before throwing `TerminateException`.
  - Automatically falls back to standard `exit` termination in non-worker environments for native request resolution.
- **Worker-Optimized Persistent Connections**:
  - Configured `DatabaseManager` to only enable persistent database connections (`PDO::ATTR_PERSISTENT`) when `$_SERVER['FRANKENPHP_WORKER']` is explicitly set to ensure stable connection reuse.

## v2.0.11 (2026-05-26)

### ⚡ ActiveRecord & Query: Flexible Eager Loading & Static Helpers

- **Variadic Eager Loading (`with()`)**:
  - Upgraded both `ActiveRecord->with()` and `ModelQuery->with()` to accept variadic parameters, arrays, and strings.
  - Supports versatile usage: `->with('author', 'comments')`, `->with(['author', 'comments'])`, `->with('author,comments')`.
  - Added support for colon-separated specific column selection syntax (e.g. `->with('author:id,name')`), safely protecting it from comma splitting logic.
- **New `findOne()` Helper**:
  - Added `ActiveRecord::findOne($id, $columns)` as a static convenience alias for `find()`.
  - Enables clean model retrieval: `User::findOne(5)`.
  - Refactored `ActiveRecord::findOrFail()` to internally delegate to `findOne()`.

### 🏗️ Generator: Variadic Controller Templates

- **Centralized Eager Loading unpacking**:
  - Updated generated Controller templates to unpack the relation config array when querying models (e.g., `->with(...$this->withRelations)`).
  - Aligns the standard generated REST endpoints with the new variadic pattern in `ActiveRecord` and `ModelQuery`.

## v2.0.10 (2026-05-09)

### ⚡ ActiveRecord & Query: Fluent ModelQuery Builder

- **Fluent ModelQuery Integration**:
  - Introduced `ModelQuery` class bridging raw SQL `Query` builder with `ActiveRecord`.
  - Enabled fluent query builder syntax: `Model::find()->with('passengerShip')->orderBy('id DESC')->limit(5000)->all()`.
  - Added support for eager loading (`->with()`), automatic model lifecycle hooks (`afterLoad()`), and field hiding (`$hidden`) when querying via `ModelQuery`.
  - Upgraded `ModelQuery->paginate()` to return a standard API meta envelope (`['data' => ..., 'meta' => [...]]`) fully compatible with `Resource::collection()`.
  - Added `findByPk($id)` and `findOrFailByPk($id)` helper methods to `ModelQuery`.
- **Clean Architecture Generator Templates**:
  - Replaced redundant search methods in Base Models with a clean static `search($keyword)` query builder helper.
  - Standardized Base Controller templates to define `$withRelations` properties for centralized eager loading management.
  - Added dynamic pagination and customizable `limit` payload parameters (default 1000, max 5000) on `/all` endpoints.
  - Refactored `Generator` codebase for strict DRY compliance by centralizing relationship naming logic (`getRelationName()`), removing dead methods/variables, and eliminating redundant schema lookups.
- **Legacy Deprecations**:
  - Marked `findQuery()` and `findBuilder()` as deprecated in favor of the cleaner static `::find()` syntax.

### 📬 Queue & Notification: Robust Async Email Dispatch (`SendEmailJob`)

- **Flexible Payload Handling**:
  - Updated `SendEmailJob` to accept both `email` and `to` payload keys (`$data['email'] ?? $data['to']`), ensuring robust compatibility with various queue dispatchers.
- **Enhanced Monitoring & Logging**:
  - Added strict recipient validation and comprehensive lifecycle logging (`Logger::info`/`error`) for background worker visibility.

### 🏗️ Generator: Smart Relationship Naming

- **Duplicate Method Fix**:
  - Resolved "Fatal Error: Cannot redeclare method" caused by naming collisions when a table has multiple relationships to the same target table (e.g., two foreign keys to the same table).
  - Previously, the generator would create duplicate method names (like `ferryroute()`) for each relationship.
- **New Naming Convention**:
  - Modified the Generator to automatically append the column name to the relationship method name (e.g., `ferryschedulesByoperator()`).
  - Ensures unique method names and prevents collisions in generated Base Models.

## v2.0.9 (2026-04-29)

### 🛠️ Console: Cross-Platform Hardening & FFI Fix

- **FFI & Interactive Input Robustness**:
  - Fixed "Undefined method `_getch`" by adding explicit `extension_loaded('ffi')` and `instanceof \FFI` checks.
  - Added try-catch guards around dynamic FFI calls to handle runtime binding failures gracefully.
  - Added IDE suppression annotations and type-hints to resolve static analysis warnings for `_getch()`.
- **Shared Hosting Compatibility**:
  - Implemented `functionAvailable()` to check `disable_functions` before calling `shell_exec()` or `passthru()`.
  - Prevents fatal errors on restricted environments (Shared Hosting) by providing clear error messages instead of crashing.
- **FrankenPHP & Worker Mode Safety**:
  - Replaced `exit(0)` with `return` in `interactiveChoice()` to prevent killing the entire worker process on cancellation.
  - Added `isCli()` and `stdinAvailable()` checks to ensure interactive menus only trigger in valid terminal environments.
  - Hardened terminal state cleanup to prevent leaking `stty` settings between persistent requests.
- **Environment Detection Helpers**:
  - Added `isCli()`, `functionAvailable()`, and `stdinAvailable()` internal helpers for more reliable cross-platform logic.

### 🛡️ Database & ORM: SQL Injection Hardening

- **ActiveRecord Security Patch**:
  - Implemented `sanitizeOrderBy()` to validate sort parameters against a strict regex allowlist.
  - Prevents SQL injection via unsanitized `ORDER BY` strings in `all()` and `paginate()` methods.
- **Query Builder Hardening**:
  - Added `sanitizeIdentifier()` and `sanitizeOrderBySegment()` guard methods to `Query` class.
  - Hardened `ORDER BY`, `GROUP BY`, and aggregate functions (`count`, `sum`, `avg`, `min`, `max`) against malicious column/segment injection.
  - Standardized identifier validation for table and column names (`table.column` format).

## v2.0.8 (2026-04-03)

### ⚡ Cache: DRY Refactor (~45% Code Reduction)

- **Unified Redis Operations — `redisOp()`**:
  - Extracted 8 identical `try/catch + error_log` blocks into a single `redisOp(callable $fn, string $op, mixed $fallback)` helper.
  - All Redis operations (`get`, `set`, `delete`, `deleteMany`, `has`, `clear`, `increment`) now delegate to this single method.
- **Unified Redis Bootstrap — `tryRedis()`**:
  - Extracted the duplicated "try Redis operation, fall back to file on failure" pattern into `tryRedis()`. Used by both `initRedis()` and `ensureRedis()` reconnect logic.
- **Unified L1 Memory Read — `getFromMemory()`**:
  - Extracted the repeated L1 check (isset → expiry check → unset on expired) from `get()`, `has()`, and internal lookups into a single `getFromMemory(string $key, mixed $miss)` method.
  - Uses a sentinel object to distinguish "cached null" from "cache miss".
- **Unified File Helpers — `fileRead()` / `fileWrite()`**:
  - Extracted file-based read (exists → read → json_decode → expiry check → L1 promote) into `fileRead()`.
  - Extracted atomic write (mkdir → tmp file → LOCK_EX → rename) into `fileWrite()`.
- **Unified Directory Walk — `walkCacheFiles()`**:
  - Replaced two nearly identical recursive `scandir` methods (`clearDirectory` and `cleanupDirectory`) with a single `walkCacheFiles(string $dir, ?callable $visitor)` using the visitor pattern.
  - `clear()` passes `@unlink(...)` (first-class callable syntax).
  - `cleanup()` passes a closure with `filemtime` pre-filter + expiry logic.

### 🏗️ Cache: PHP 8.4+ Modernization

- **Typed Class Constant**: `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` extracted to `private const int JSON_FLAGS`.
- **`match` Expression**: Driver initialization uses `match` instead of `if/else`.
- **First-Class Callable Syntax**: `clear()` uses `@unlink(...)` as a callable, eliminating an anonymous function wrapper.
- **`stdClass` Sentinel Objects**: Replaced magic string sentinels (`"\x00__CACHE_MISS__\x00"`) with `new \stdClass()` — guaranteed uniqueness without fragile string conventions.

### 📊 Impact

- **656 → ~350 lines** (~45% reduction) with identical public API and behavior.
- Zero breaking changes — all public methods retain the same signatures and semantics.
- FrankenPHP worker-mode safety and shared hosting compatibility fully preserved.

### 🎯 Console: Interactive Arrow-Key Menu

- **`Console::interactiveChoice()`**:
  - New public static method providing interactive menu selection with ↑/↓ arrow-key navigation, replacing the old number-only input for `choice()` prompts.
  - Highlighted selection with cyan-background indicator (`→`) and dimmed unselected items for clear visual feedback.
  - Supports **Enter** to confirm, **number keys** to jump directly, and **q/ESC** to cancel.
- **Cross-Platform Key Reading**:
  - **Windows**: Uses `PowerShell [Console]::ReadKey()` to capture single keystrokes without echo.
  - **Unix/Mac**: Uses `stty -icanon -echo` raw mode with `fread(STDIN)` to detect arrow-key escape sequences (`ESC[A`/`ESC[B`).
- **Graceful Fallback**:
  - Automatically falls back to classic number-input mode if the terminal does not support raw mode (e.g., piped input, non-TTY environments).
- **Setup Wizard Updated**:
  - `init.php` now delegates all `choice()` calls to `Console::interactiveChoice()` when the framework autoload is available.

## v2.0.7 (2026-03-14)

### 🌐 APP_URL Auto-Detection

- **Auto-Detect from Request**:
  - When `APP_URL` is left empty in `.env`, the framework now automatically detects the application URL from the incoming HTTP request (`$_SERVER['HTTP_HOST']`, scheme detection via `HTTPS`/`X-Forwarded-Proto`).
  - The detected value is written back to `$_ENV` and `putenv()` so all core classes (`File.php`, `Generator.php`) that call `Env::get('APP_URL')` directly also receive the correct auto-detected value.
  - Falls back to `http://localhost` in CLI context (e.g., `padi serve`, queue workers).
  - Supports reverse proxy setups (Nginx, Cloudflare) via `HTTP_X_FORWARDED_PROTO` header detection.
- **📋 Upgrade from previous version**:
  - This feature requires a template file update. Copy `config/app.php` from the [padi_template](https://github.com/wibiesana/padi_rest_api) repository into your project's `config/` directory, replacing the existing file.

### ⚡ Controller: Performance & DRY Refactor

- **Cached Debug Flag**:
  - `APP_DEBUG` environment lookup is now performed **once** during construction and stored in a `private readonly bool $isDebug` property.
  - Eliminates repeated `Env::get()` calls on every error response within the same request.
- **Unified `error()` Method**:
  - Introduced a single `error(string $message, int $code, string $messageCode, ?Throwable $exception)` method as the central path for all error responses (database, auth, business logic).
  - `databaseError()` now delegates to `error()` in a single line, removing ~20 lines of duplicated formatting logic.
  - Debug info (exception details, database errors) is only appended when `APP_DEBUG=true`.
- **Centralized `assertUser()` Guard**:
  - New `private assertUser(): object` method centralizes the null-check for `$request->user`.
  - `requireRole()`, `requireAnyRole()`, and `requireAdminOrOwner()` now call `assertUser()` first, properly returning **HTTP 401** when no user is authenticated (previously only returned 403).
  - Eliminates duplicated `$this->request->user !== null` checks across 5 methods.
- **`requireAdminOrOwner()` Optimized**:
  - Previously called `isAdmin()` → `hasRole()` + `isOwner()` (3 method calls, 2 null-checks).
  - Now performs inline comparison from `assertUser()` result (1 method call, 1 null-check).

### 🔐 Controller: Security Fixes

- **Proper 401 vs 403 Separation**:
  - `requireRole()`, `requireAnyRole()`, and `requireAdminOrOwner()` now throw **401 Unauthorized** when no user is attached to the request, and **403 Forbidden** only when the role check fails. Previously all cases returned 403.
- **`\InvalidArgumentException` for Empty Rules**:
  - `validate()` now throws `\InvalidArgumentException` instead of generic `\Exception(500)` when rules are empty. This is a developer error, not a runtime API error.

### 🏗️ Controller: Worker & Hosting Compatibility

- **`readonly` Property**:
  - Debug flag uses PHP 8.4+ `readonly` modifier, making it immutable after construction. Prevents accidental mutation across FrankenPHP worker iterations.
- **Zero Static State**:
  - Controller remains fully stateless with fresh instances per request. No static properties that could leak between worker iterations.
- **No External Dependencies**:
  - Pure PHP implementation, fully compatible with shared hosting environments.

### 🐛 Bug Fixes & Improvements

- **Auth Core: `userId()` TypeError Fixed**:
  - Fixed a `TypeError` in `Auth::userId()` by ensuring the method correctly returns `null` when a user ID is missing from the token payload, instead of failing on type casting.
- **Auth Template: Enhanced Registration & Login**:
  - Added strict password complexity validation (uppercase, lowercase, number, and special character) to the registration process.
  - Improved `remember_me` detection to support various input formats (boolean, string "true", "1", etc.).
  - Standardized token payload across `register`, `login`, and `refresh` methods to include `status` and ensure consistent user data returning.
  - Added `HTTP 201 Created` status explicitly for successful user registration.

## v2.0.6 (2026-03-09)

### ⚡ Cache: Two-Tier Architecture Rewrite

- **L1 In-Memory Cache Layer**:
  - Added a bounded in-memory array cache as L1, sitting in front of Redis/File (L2).
  - L1 survives across FrankenPHP worker iterations for zero-cost repeated lookups.
  - Configurable max entries via `CACHE_L1_MAX` env variable (default: 1000).
  - Bulk eviction (oldest 25%) when limit is exceeded to prevent unbounded memory growth.
- **Redis Auto-Reconnect (Worker Mode)**:
  - New `ensureRedisConnection()` method detects dead Redis connections and transparently reconnects via disconnect → connect → ping.
  - Falls back to file driver if reconnect fails, preventing total cache failure in worker processes.
- **File Cache Subdirectory Bucketing**:
  - Cache files are now distributed across 256 subdirectories using 2-char hash prefix (e.g., `storage/cache/ab/abcdef...cache`).
  - Prevents filesystem performance degradation with 10k+ cache files on ext4/NTFS.
- **`has()` Optimization**:
  - Redis: now uses native `EXISTS` command instead of full `get()` + JSON decode.
  - L1 memory check as fast path before any L2 lookup.
- **`remember()` Null-Safe**:
  - Uses sentinel value to distinguish "not cached" from "cached null", preventing infinite callback re-execution when the callback legitimately returns null.
- **`get()` Default Value**:
  - Added `$default` parameter (`Cache::get($key, $default)`) instead of always returning null on miss.
- **`set()` TTL=0 Support**:
  - `ttl=0` now means "cache forever" (no expiry) instead of being treated as the default TTL.

### 🆕 Cache: New Methods

- **`deleteMany(array $keys)`**: Bulk delete with single Redis `DEL` command. Avoids N+1 delete calls.
- **`increment(string $key, int $step)`**: Atomic increment via Redis `INCRBY`. File-based read-modify-write fallback.
- **`decrement(string $key, int $step)`**: Delegates to `increment()` with negative step.
- **`clearMemory()`**: Clear only L1 in-memory cache without invalidating L2. Useful for forcing re-read after known data changes.
- **`getMemorySize()`**: Returns current L1 entry count for monitoring/debugging.
- **`reset()`**: API consistency method for `Application::cleanupRequest()` integration. Intentionally no-op since cache state is designed to persist across worker iterations.

### 🏗️ Cache: Cleanup Optimization

- **`filemtime()` Pre-Filter**:
  - `cleanup()` now skips files modified more recently than the default TTL without reading their contents, significantly reducing I/O on large cache directories.
- **Recursive Subdirectory Cleanup**:
  - Updated to traverse the new bucket subdirectories and remove empty bucket dirs after cleanup.

### 🔐 Cache: Redis 6+ ACL Support

- **`REDIS_USERNAME` Environment Variable**:
  - Added support for Redis 6+ ACL authentication (`AUTH username password`).
  - When both `REDIS_USERNAME` and `REDIS_PASSWORD` are set, Predis uses ACL-based `AUTH`.
  - Backward compatible: if `REDIS_USERNAME` is empty, only password-based `AUTH` is used (classic Redis < 6 behavior).

### ⚠️ Breaking Change

- **File cache path structure changed**: Files now stored in `storage/cache/{bucket}/hash.cache` instead of `storage/cache/hash.cache`. Run `Cache::clear()` once after deploying to clean up orphaned flat-directory files.

## v2.0.5 (2026-03-04)

### 🔍 Code Generator: Runtime Global Search

- **Dynamic Search conditions**:
  - The generated Base Model now uses a dynamic `foreach ($this->fillable)` loop at runtime for global searching.
  - This ensures that any changes to the `$fillable` array in the `extend/` (Concrete) Model are automatically reflected in the search logic without needing to re-generate the base code.
- **`buildSearchConditions()` Method**:
  - Introduced a new `protected` method in the Base Model template to centralize search logic.
  - This method combines the dynamic fillable fields with hardcoded related table display columns (joins) detected during generation.
  - Developers can now easily override this method in the `extend/` directory to implement complex custom search logic while keeping the controller clean.
- **Enhanced Search Coverage**:
  - Switched from a keyword-based text column filter to a true **Global Search** that covers all fillable fields by default.

### ⚡ Auth: Performance & Compatibility

- **Per-Request JWT Decode Cache**:
  - `verifyToken()` now caches the decoded result per-request. Calling both `Auth::userId()` and `Auth::user()` in the same request no longer decodes the JWT twice.
- **Per-Request Token Extraction Cache**:
  - `extractToken()` caches the raw bearer token after the first header lookup, eliminating repeated `$_SERVER` reads within the same request.
- **`userId()` Deduplication**:
  - `userId()` now delegates to `user()` instead of duplicating the extract → verify flow. Zero overhead thanks to the per-request cache.
- **`JWT::$leeway` Set Once**:
  - Moved `JWT::$leeway = 60` from `verifyToken()` (called per-request) to `init()` (called once per process lifetime).
- **Weak Secrets as `const`**:
  - Changed the weak secrets array from a local variable to `private const WEAK_SECRETS`, avoiding array re-allocation.
- **Shared Hosting: `getallheaders()` Fallback**:
  - `extractToken()` now falls back to `getallheaders()` when `$_SERVER['HTTP_AUTHORIZATION']` and `REDIRECT_HTTP_AUTHORIZATION` are both empty. This handles Apache `mod_php` and certain shared hosting environments that strip the `Authorization` header from `$_SERVER`.
- **Worker Mode: `Auth::reset()`**:
  - Added `reset()` method to clear per-request statics (decoded cache, token cache, extraction flag). Called in `Application::cleanupRequest()` to prevent token/user data from leaking between FrankenPHP worker requests.

### 🐛 Bug Fix: FrankenPHP Worker Mode

- **`frankenphp_handle_request()` Callable Argument**:
  - Fixed `ArgumentCountError` where `frankenphp_handle_request()` was called without arguments. The FrankenPHP API requires exactly **1 argument**: a callable that contains the request handling logic.
  - Moved `handleRequest()` and `cleanupRequest()` **inside** the closure passed to `frankenphp_handle_request()`, ensuring PHP superglobals (`$_SERVER`, `$_GET`, etc.) are correctly populated by FrankenPHP before request processing begins.
  - Added `catch (\Throwable)` inside the closure so exceptions are handled within the proper request context where the response can still be sent to the client.

## v2.0.4 (2026-03-02)

### 🔴 Critical Bug Fix

- **Query Builder: Unified Condition Format**:
  - Fixed a bug in `whereIn()`, `whereNotIn()`, and `whereBetween()` where the internal parameter order was `[operator, column, value]` but the parser expected `[column, operator, value]`.
  - **Unified `parseCondition`**: ALL operators (`LIKE`, `NOT LIKE`, `IN`, `NOT IN`, `BETWEEN`, `NOT BETWEEN`, `>`, `<`, etc.) now use the canonical `[column, operator, value]` format.
  - **Backward Compatible**: Legacy `[operator, column, value]` format (used by LIKE in older generated code) is automatically detected and still works.
  - **`whereNotBetween()`**: Now uses the parser's `[column, 'NOT BETWEEN', [start, end]]` format instead of manually building raw SQL.
  - **NULL Handling**: `[column, '=', null]` → `IS NULL`, `[column, '!=', null]` → `IS NOT NULL`.
  - **Generator Updated**: Code generated by `padi generate:crud` now uses the new canonical format.

### 🌍 Documentation Language Update

- **Full English Translation**:
  - Translated all remaining Indonesian documentation to English for a unified, global developer experience.
  - Files translated:
    - `04-deployment/MODE_SWITCHING.md`
    - `04-deployment/DOCKER.md`
    - `04-deployment/README.md`
    - `03-advanced/PAGINATION.md`
    - `03-advanced/ERROR_HANDLING.md`
    - `03-advanced/API_COLLECTION_GUIDE.md`
    - `02-core-concepts/CODE_GENERATOR.md`
    - `02-core-concepts/CLI_INTERFACE.md`

## v2.0.3 (2026-02-28)

### 🔴 Critical Bug Fix

- **Health Check: Connection Not Reconnected**:
  - Fixed a critical bug where `healthCheckConnections()` would disconnect a stale database connection but **not reconnect** it. This caused subsequent requests in worker mode to fail with "MySQL server has gone away" errors. The health check now forces an immediate reconnect after disconnecting a stale connection and resets the `Database` singleton to prevent stale PDO references.

### 🏗️ FrankenPHP Worker Mode Improvements

- **Database Singleton Reset**:
  - Added `Database::resetInstance()` method to clear the singleton when connections are recycled. Called automatically in `cleanupRequest()` and after health check reconnection to prevent stale PDO references persisting across worker iterations.
- **Column Cache Lifecycle**:
  - Added `ActiveRecord::clearColumnsCache()` to manage memory during worker lifetime. Called during graceful worker restart (`$count >= MAX_REQUESTS`) to release accumulated column metadata.
- **Query Builder State Safety**:
  - Added `Query::reset()` method to clear all query builder state for safe reuse in long-lived processes.
  - Fixed `Query::paginate()` to **restore** `limit` and `offset` state after execution, preventing state leakage when the query builder is reused.
- **Error History Cap**:
  - `DatabaseManager::logError()` now caps the error history array at 50 entries per-request to prevent unbounded memory growth if many errors occur within a single request cycle.

### 🌐 Shared Hosting Optimizations

- **MySQL/MariaDB Session Timeout**:
  - `createMySQLConnection()` now sets `SESSION wait_timeout` and `SESSION interactive_timeout` based on the `wait_timeout` config key (default: 28800s). This prevents premature connection closure on shared hosting environments that default to very low timeout values (60-300s).
- **Connection Limit Protection**:
  - Added max connection limit check in `DatabaseManager::connection()`. Throws `PDOException` when the configured `max_connections` limit (default: 10) is reached, preventing shared hosting connection exhaustion. Configurable via `config/database.php`.
- **Batch Insert Chunking**:
  - `ActiveRecord::batchInsert()` now accepts a `$chunkSize` parameter (default: 500) and automatically splits large datasets into smaller INSERT statements. This prevents exceeding the `max_allowed_packet` limit (typically 1MB-16MB on shared hosting).

### 🔍 Query Builder Enhancements (v2.0.3)

- **`whereRaw($expression, $params)`**: New method for complex WHERE conditions that require raw SQL (subqueries, `CASE WHEN`, etc.). Parameters are still safely bound via PDO.
- **`exists()` Optimization**: Rewritten to use `SELECT 1 LIMIT 1` instead of `one()` which fetched the entire row with all columns. Significantly reduces data transfer for existence checks.
- **Version**: Query Builder version constant updated to `2.0.3`.

### 🗃️ ActiveRecord Enhancements (v2.0.3)

- **`findOrFail($id)`**: New convenience method that throws a 404 exception if the record is not found, eliminating repetitive null-check boilerplate in controllers.
- **`count($conditions)`**: New dedicated count method for quick record counting with optional WHERE conditions, without needing the full Query Builder.
- **`upsert($data, $updateColumns)`**: New atomic INSERT ... ON DUPLICATE KEY UPDATE for MariaDB/MySQL. Useful for sync operations and bulk data imports.

### 📊 DatabaseManager Monitoring (v2.0.3)

- **`isConnected($name)`**: Check if a specific connection is active and responds to a `SELECT 1` ping. Returns boolean.
- **`getConnectionCount()`**: Returns the number of active database connections. Useful for monitoring connection usage on limited shared hosting.
- **`getStatus()`**: Returns a comprehensive status array with active connection count, per-connection health status (`healthy`/`stale`), and error count. Ideal for health check endpoints.

### 🐋 Docker & Infrastructure

- **Docker Compose Stack Decoupling**:
  - Renamed all containers, networks, and volumes across `docker-compose.yml`, `docker-compose.standard.yml`, `docker-compose.worker.yml`, and `docker-compose.nginx.yml` to be unique (prefixes: `padi_dev_`, `padi_std_`, `padi_wrk_`, `padi_ngx_`).
  - This allows all deployment modes to run simultaneously on the same host without naming conflicts.
- **Port Mapping Isolation**:
  - Assigned unique host ports for each environment: Development (8085), Standard (8086), Worker (8087), and Nginx (8088/8443).
- **Environment Fixes**:
  - Fixed duplicate `JWT_SECRET` key in `docker-compose.worker.yml`.
  - Standardized `REDIS_HOST` configuration across all compose files to point to their respective environment-specific Redis containers.
- **Route Management Refactor**:
  - Relocated `routes` directory to `app/Routes` for better structure within the application bundle. All core systems (Application, Generator) now point to `/app/Routes/api.php`.

---

## 📋 Table of Contents

- [v2.0.11 (2026-05-26)](#v2011-2026-05-26)
- [v2.0.10 (2026-05-09)](#v2010-2026-05-09)
- [v2.0.9 (2026-04-29)](#v209-2026-04-29)
- [v2.0.8 (2026-04-03)](#v208-2026-04-03)
- [v2.0.7 (2026-03-14)](#v207-2026-03-14)
- [v2.0.6 (2026-03-09)](#v206-2026-03-09)
- [v2.0.5 (2026-03-04)](#v205-2026-03-04)
- [v2.0.4 (2026-03-02)](#v204-2026-03-02)
- [v2.0.3 (2026-02-28)](#v203-2026-02-28)
- [v2.0.2 (2026-02-26)](#v202-2026-02-26)
- [v2.0.1 (2026-02-23)](#v201-2026-02-23)
- [v2.0.0 (2026-02-22)](#v200-2026-02-22)
- [v1.0.4 (2026-02-20)](#v104-2026-02-20)
- [v1.0.3 (2026-02-17)](#v103-2026-02-17)
- [v1.0.2 (2026-02-17)](#v102-2026-02-17)
- [v1.0.1 (2026-02-17)](#v101-2026-02-17)
- [v1.0.0](#v100)

---

## v2.0.2 (2026-02-26)

### 🔴 Critical Security Fixes

- **Cache: PHP Object Injection Prevention**:
  - Replaced `unserialize()` with `json_encode()`/`json_decode()` for file cache storage. Using `unserialize()` on untrusted data enables PHP Object Injection attacks that can lead to remote code execution.
- **Query Builder: SQL Injection via LIMIT/OFFSET**:
  - `LIMIT` and `OFFSET` values are now bound as `PDO::PARAM_INT` parameters instead of being directly interpolated into the SQL string. This prevents potential SQL injection through manipulated limit/offset values.
- **File Upload: Path Traversal Prevention**:
  - Added `sanitizePath()` method with null byte injection protection, directory traversal component removal (`..`), and `realpath()` verification on delete operations.
  - Added dangerous file extension blacklist (`.php`, `.phar`, `.exe`, `.sh`, etc.) to block remote code execution via uploads.
  - Added MIME type verification using `finfo` as defense-in-depth against file disguise attacks.
- **Response: Header Injection Prevention**:
  - Download filenames are now sanitized to prevent HTTP header injection via `\r\n` characters.
  - Redirect URLs are validated to prevent open redirect attacks.
- **Env: Operator Precedence Bug Fix**:
  - Fixed critical bug in `Env::get()` where the `?:` operator was used instead of explicit `false` check. `getenv()` returns `false` (not empty string) when a variable is not found, causing `?:` to also swallow legitimate empty string values.

### ⚡ Performance Optimizations

- **Response: GZip Compression Rewrite**:
  - Replaced `ob_start('ob_gzhandler')` with manual `gzencode()`. The `ob_gzhandler` approach creates output buffer leaks in FrankenPHP worker mode since buffers persist between request iterations.
  - `JSON_PRETTY_PRINT` is now only applied in development mode, saving ~30% bandwidth in production.
  - Compression is automatically skipped for small payloads (< 1KB) where the overhead outweighs the benefit.
- **Request: Single Input Read**:
  - `php://input` is now read exactly **once** and cached internally. Previously, `raw()` would re-read the input stream, which returns empty on the second read.
  - `input()` method now performs direct key lookup instead of creating a merged array on every call.
- **Auth: JWT Verification Optimization**:
  - Pre-creates `Firebase\JWT\Key` object once and caches it (eliminated per-verification instantiation).
  - Added quick JWT format validation (`substr_count('.') !== 2`) before expensive `JWT::decode()`.
  - `Auth::userId()` and `Auth::user()` no longer create a new `Request()` instance (which re-reads `php://input`). Now accepts optional `$request` parameter or reads directly from `$_SERVER`.
- **DatabaseManager: Connection Optimizations**:
  - MySQL/MariaDB: `STRICT_TRANS_TABLES` SQL mode enabled for data integrity.
  - MySQL/MariaDB: `MYSQL_ATTR_FOUND_ROWS` enabled for accurate affected-row counts.
  - SQLite: WAL journal mode, 20MB cache, and `NORMAL` synchronous mode for ~5x faster writes.
  - Default connection timeout set to 5 seconds to prevent hanging on unresponsive databases.
- **Query Builder: Proper PDO Type Binding**:
  - New `bindAndExecute()` method uses proper PDO parameter types: `PARAM_INT` for integers, `PARAM_BOOL` for booleans, `PARAM_NULL` for null values.
- **Cache: Faster Hashing & Atomic Writes**:
  - File cache keys now use `xxh3` hash (10x faster than `md5`, non-crypto use is safe for cache keys).
  - Atomic file writes via temp file + `rename()` prevent partial/corrupted reads under concurrent access.
- **Queue: Cached Table Init**:
  - `CREATE TABLE IF NOT EXISTS` is now cached with a static flag, preventing redundant DDL queries on every `push()` call.
  - Added MySQL index `idx_queue_available(queue, available_at, reserved_at)` for fast job lookup.
- **Router: Modern PHP Constructs**:
  - `isCollection()` now uses PHP 8.1+ `array_is_list()` (faster than manual key checking).
  - Response format routing uses `match` expression instead of `switch`.

### 🏗️ FrankenPHP Worker Mode Fixes

- **Application: Per-Request Cleanup**:
  - New `cleanupRequest()` method flushes all output buffers and clears superglobals (`$_GET`, `$_POST`, `$_FILES`, `$_COOKIE`) between worker iterations to prevent state bleed.
  - `gc_collect_cycles()` called before graceful worker restart to free circular references.
- **Response: Output Buffer Leak Fix**:
  - Replaced `ob_gzhandler` (which creates persistent output buffers across worker iterations) with explicit `gzencode()`.
- **Auth: Input Stream Fix**:
  - `Auth::userId()` no longer creates `new Request()` which would re-read the already-consumed `php://input` stream. Falls back to `$_SERVER['HTTP_AUTHORIZATION']` or `$_SERVER['REDIRECT_HTTP_AUTHORIZATION']` directly.

### 🛡️ Security Headers

- **New Default Headers** (set per request in `Application.php`):
  - `X-Frame-Options: DENY` — Prevents clickjacking.
  - `X-Content-Type-Options: nosniff` — Prevents MIME sniffing.
  - `X-XSS-Protection: 0` — Disabled (modern browsers use CSP instead; old value `1; mode=block` can introduce vulnerabilities).
  - `Referrer-Policy: strict-origin-when-cross-origin` — Controls referrer information leakage.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` — Restricts browser feature access.
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` — HSTS (production HTTPS only).
  - `Access-Control-Max-Age: 86400` — Preflight cache for 24 hours (reduces OPTIONS requests).
  - `Vary: Origin` — Proper CORS response caching.

### 📦 New Features & Improvements

- **Validator**: Added `array`, `regex`, and `nullable` validation rules. String length checks now use `mb_strlen()` for Unicode support.
- **Logger**: Added `critical()` log level method.
- **File**: New `sanitizePath()` for path sanitization. Cryptographically secure filenames via `random_bytes(16)`.
- **Controller**: `isOwner()` now uses strict integer comparison with type cast to prevent type juggling bypass.
- **Response**: Added HTTP status codes: 301, 304, 405, 409, 429, 502, 503.
- **Router**: `getStatusCodeName()` made `public static` for reuse from Controller. Added codes: 405, 409, 429, 502, 503.
- **Queue**: Multi-database DDL support (PostgreSQL, SQLite, MySQL). Transaction rollback safety in error handler.
- **Email**: Added recipient email validation, config file existence check, UTF-8 charset, SMTP timeout setting.
- **Resource**: Proper `mixed` type hints and static arrow functions for collection mapping.
- **All Files**: Added `declare(strict_types=1)` across all core classes.

### 🔧 Directory Permission Hardening

- Changed default directory creation permissions from `0777` to `0750` across all core classes:
  - `Cache.php` — `storage/cache/`
  - `Logger.php` — `storage/logs/`
  - `File.php` — `uploads/`
  - `DatabaseManager.php` — SQLite database directory

---

## v2.0.1 (2026-02-23)

### New Console CLI (Padi CLI)

- **Introduction of `padi` CLI**:
  - Created a new command-line interface inspired by `artisan` and `yii`.
  - Added entry point executable `padi` in the project root.
- **Built-in Commands**:
  - `serve`: Start the PHP development server with host/port options.
  - `init` (alias `setup`): Launch the interactive setup wizard for new projects.
  - `make:controller`: Generate new controllers.
  - `make:model`: Generate models from database tables.
  - `make:migration`: Generate new migration files with timestamps.
  - `migrate`, `migrate:rollback`, `migrate:status`: Manage database migrations.
  - `generate:crud` (alias `g`): Generate complete CRUD scaffolding for a single table.
  - `generate:crud-all` (alias `ga`): Bulk generate CRUD for all tables in the database with auto-routing.
- **Improved Batch Scripts**: Replaced legacy `init_app.bat` and `init_server.bat` with native `padi` CLI commands for better consistency and error handling.
- **Core Architecture Refactoring**:
  - Refactored `public/index.php` into a dedicated `Wibiesana\Padi\Core\Application` class.
  - Slimmed down the entry point to a minimal bootstrap script.
  - Improved separation of concerns and maintainability for the core request lifecycle.

### Performance & Stability

- **High-Performance Query Builder**:
  - Optimized `Query::buildWhere()` loop logic.
  - Reduced complexity from O(N²) to O(N) by eliminating redundant `array_keys()` and `array_search()` calls during condition parsing.
- **FrankenPHP Worker Mode Support**:
  - **Memory Leak Protection**: Automatic reset of static states (Query logs, database errors, and query counters) at the beginning of every request dispatch to ensure stability in long-running worker processes.
  - **Graceful Termination**: Implemented `TerminateException` for clean control flow exit when sending JSON/Redirect responses, preventing unwanted execution of remaining controller logic in worker mode.

### Documentation Enhancements

- **Reorganized Documentation**:
  - Updated all documentation files to reflect the new versioning.
  - Added CLI documentation to `CODE_GENERATOR.md`.

## v2.0.0 (2026-02-22)

### Namespace Refactoring

- **Core Namespace Consolidation**:
  - Standardized all core framework classes under the `Wibiesana\Padi\Core` namespace.
  - Updated all internal references, scripts, and templates to reflect the new namespace structure.
  - This change improves package organization and prevents naming collisions.

### Authentication & Security

- **Secure Password Reset**:
  - Implemented `PasswordResetController` and `PasswordReset` model for a robust recovery flow.
  - Decoupled recovery logic from `AuthController` for better modularity.
  - Added support for token-based password updates with security expiration checks.

### Generator Enhancements

- **Inverse Relation Detection**:
  - Implemented automatic detection of `hasMany` and `hasOne` relationships.
  - The generator now scans all tables to identify foreign keys pointing back to the model being generated.
  - **Smart Selection**: Automatically decides between `hasOne` (if unique index exists) and `hasMany` (if not).
  - **Automatic Pluralization**: Generates logical method names (e.g., `user->posts()`) automatically.
- **Code Cleanup**:
  - Removed unused variables and dead code from `Generator.php` for better performance and maintainability.

### Core & Server Optimizations

- **Database Connection Reliability**:
  - Implemented automatic "Keep-Alive" health checks in `index.php`.
  - The framework now detects dead connections (e.g., "MySQL server has gone away") and automatically reconnects, which is essential for **FrankenPHP Worker Mode** and long-running processes.
- **Improved Routing & Hosting**:
  - Enhanced URI normalization in `public/index.php` to better support shared hosting environments and sub-directory deployments.
  - Better handling of `REQUEST_URI` when the script path is included in the URL.
- **Project Structure Refactoring**:
  - Relocated the `config/` directory from `app/config/` to the project root for better accessibility and standardization across the framework.
  - Updated `Core\Auth`, `Core\DatabaseManager`, `Core\Email`, and `Core\Logger` to support the new configuration path.

### Generator Improvements

- **Query Builder Integration**:
  - Refactored `padi_core/Generator.php` to utilize the `Core\Query` builder for all generated search methods.
  - Replaced raw SQL concatenation with the fluent API for improved security and database engine abstraction.

---

## v1.0.4 (2026-02-20)

### Query Builder Enhancements

- **PostgreSQL Case-Insensitivity**:
  - Implemented automatic `ILIKE` conversion for PostgreSQL.
  - Added `autoIlike(bool)` method to toggle this behavior.
- **Aggregate Methods**:
  - Added dedicated methods for common aggregations: `sum()`, `avg()`, `min()`, and `max()`.
- **Ordering Improvements**:
  - Added `addOrderBy()` for building complex sort criteria incrementally.
- **New Helper Methods**:
  - Added specific WHERE helpers: `whereIn`, `whereNotIn`, `whereBetween`, `whereNotBetween`, `whereNull`, `whereNotNull`.
  - Added `paginate($perPage, $page)` for easy pagination.
  - Added `rawSql()` for debugging generated SQL.

---

## v1.0.3 (2026-02-17)

### Performance & Serving

- **FrankenPHP Worker Mode**:
  - Added native support for FrankenPHP worker mode in `index.php` for massive performance gains.
  - Implemented automatic state resetting (`Database` & `DatabaseManager`) between requests in persistent worker loops.
- **Request Lifecycle Optimizations**:
  - Integrated CORS and Preflight (`OPTIONS`) handling directly into the entry point.
  - Enhanced global exception handling to provide structured JSON responses for all uncaught errors and PDO exceptions.

### Environment & Configuration

- **Debug Enforcement**:
  - Strictly enforced `app_debug` logic based on `APP_ENV`: forced `off` in production and `on` (by default) in development.
  - Fixed `.env` parsing issue where boolean strings were not correctly evaluated.
- **PHP 8.4 Support**:
  - Updated minimum PHP requirement to `v8.4` in `composer.json`.
- **Debugging Enhancements**:
  - Added `debug_log` global helper for streamlined error logging.
  - Integrated server environment dumping for improved development diagnostics.

## v1.0.2 (2026-02-17)

### Package & Dependency Management

- **Packagist Integration**:
  - Official registration of `padi-template` on Packagist as `wibiesana/padi-rest-api`.
  - Migrated core functionality to external dependency `wibiesana/padi-core` (v1.0.2+).
  - Removed local `core/` directory; framework core is now managed via Composer.

## v1.0.1 (2026-02-17)

### Core Framework Updates

- **PHP Compatibility**:
  - Fixed "Implicitly nullable parameter" deprecation warnings for PHP 8.1+.
  - Updated `core/Cache.php`, `core/Controller.php`, and `core/ActiveRecord.php` with explicit nullable type hints.
- **Generator Improvements**:
  - Added support for sorting in generated `searchPaginate` methods.
  - Set default pagination size to 25 items.
  - Fixed `primaryKey` type hint to support composite keys (`string|array`).
- **ActiveRecord enhancements**:
  - Refined `searchPaginate` with improved SQL join logic and table aliasing.
  - Enhanced relationship eager loading (`loadRelations`).
- **Database & Routing**:
  - Improved multi-database connection management in `DatabaseManager`.
  - Added URI normalization to filter redundant slashes in request paths.
- **Audit System**:
  - Integrated semi-automatic audit fields (`created_at`, `updated_at`, etc.) directly into `ActiveRecord`.

## v1.0.0

- Initial release of Padi REST API Framework.
- Core features: ActiveRecord, Fluent Query Builder, Autoloading, JWT Auth.
