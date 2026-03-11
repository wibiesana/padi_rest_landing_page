# 🤖 Worker Scripts & Background Process Management

## ⚙️ Precision-Engineered Automation

Efficiency is the heartbeat of a modern API. Padi REST API provides a suite of **Industrial-Grade Worker Scripts** designed to handle everything from high-speed HTTP request orchestration to asynchronous background task processing. By segregating transactional logic from background operations, our worker architecture ensures your application remains responsive, scalable, and optimized for high-performance deployment environments.

---

## 📋 Table of Contents

- [⚙️ Precision-Engineered Automation](#precision-engineered-automation)
- [📁 File Structure](#file-structure)
- [🔄 Queue Worker: The Background Architect](#queue-worker-the-background-architect)
    - [1. Defining a Job](#1-defining-a-job)
    - [2. Dispatching a Job](#2-dispatching-a-job)
    - [3. Running the Worker](#3-running-the-worker)
- [🚀 FrankenPHP Worker: High-Performance Unified Entry](#frankenphp-worker-high-performance-unified-entry)
- [🎯 Quick Commands](#quick-commands)
- [🔄 Migration Notes](#migration-notes)

---

## 📁 File Structure

This project utilizes specialized scripts to maintain architectural purity between synchronous and asynchronous tasks:

| Script | Location | Purpose | Environment |
| :--- | :--- | :--- | :--- |
| **Queue Worker** | `scripts/queue-worker.php` | Processes background jobs (Email, Analytics, etc.) | All |
| **Unified Entry** | `public/index.php` | Unified entry point for both Standard and **Worker Mode** | All |

---

## 🔄 Queue Worker: The Background Architect

The Queue Worker is a database-backed job processor that ensures heavy tasks don't block your user's experience.

### 1. Defining a Job

Create a job class in `app/Jobs/`. Any class with a `handle()` method can be a job.

```php
namespace App\Jobs;

use Wibiesana\Padi\Core\Email;

class SendWelcomeEmail
{
    /**
     * The handle method is called by the queue worker.
     * All dependencies should be handled inside this method.
     */
    public function handle(array $data): void
    {
        $email = $data['email'];
        $name = $data['name'];

        Email::send($email, "Welcome to Padi!", "Hello $name, welcome aboard!");
    }
}
```

### 2. Dispatching a Job

Use the `Queue::push()` method from anywhere in your application (Controllers, Models, or even other Jobs).

```php
use Wibiesana\Padi\Core\Queue;
use App\Jobs\SendWelcomeEmail;

// Immediate dispatch
Queue::push(SendWelcomeEmail::class, [
    'email' => 'user@example.com',
    'name' => 'John Doe'
]);

// Delayed dispatch (e.g., send in 5 minutes)
Queue::push(SendWelcomeEmail::class, $data, 'default', 300);
```

### 3. Running the Worker

In production, use a process manager like **Supervisor** or a Docker container to keep the worker running.

```bash
# Process the default queue
php scripts/queue-worker.php

# Process a specific high-priority queue
php scripts/queue-worker.php high-priority
```

---

## 🎯 Practical Queue Examples & Execution

You can organize your background tasks into specialized "channels" or queues to optimize resource allocation. Here are common industrial patterns for naming and running your workers:

| Queue Name | Purpose | Dispatch Example | Start Command |
| :--- | :--- | :--- | :--- |
| **`default`** | General purpose tasks | `Queue::push(Job::class, $data)` | `php scripts/queue-worker.php` |
| **`emails`** | Transactional & marketing mail | `Queue::push(Job::class, $data, 'emails')` | `php scripts/queue-worker.php emails` |
| **`reports`** | Heavy PDF/Excel generation | `Queue::push(Job::class, $data, 'reports')` | `php scripts/queue-worker.php reports` |
| **`notifications`** | Push notifications & webhooks | `Queue::push(Job::class, $data, 'notifications')` | `php scripts/queue-worker.php notifications` |
| **`sync`** | Third-party data synchronization | `Queue::push(Job::class, $data, 'sync')` | `php scripts/queue-worker.php sync` |

### 💡 Pro-Tip: Sequential vs Parallel Processing

- **Sequential**: Running one command `php scripts/queue-worker.php` will process jobs one-by-one inside that single process.
- **Parallel**: To process reports and emails simultaneously, simply open two terminal windows (or Docker containers) and run their respective commands. Each worker operates independently on its assigned channel.

---

## 🚀 FrankenPHP Worker: High-Performance Unified Entry

The Padi REST API utilizes a **Unified Entry Architecture**. Unlike many frameworks that require separate scripts for standard and worker modes, our `public/index.php` is designed to automatically detect its environment and switch its execution engine accordingly.

### How it Works

When FrankenPHP starts in worker mode, it executes `public/index.php` once. The `Application` core detects the worker environment and initiates a high-performance, resident-memory loop:

```php
// Inside public/index.php
$app = new Application(PADI_ROOT);
$app->run(); // Automatically detects Standard vs Worker mode
```

### Advantages of Unified Entry

1. **Architectural Simplicity**: No redundant scripts to maintain.
2. **Seamless Switching**: Switch between Apache/Nginx and FrankenPHP without changing a single line of code.
3. **State Integrity**: The framework handles per-request cleanup (`$_GET`, `$_POST`, etc.) automatically within the worker loop.

---

## 🎯 Quick Commands

### 🔄 Queue Management

| Command | Description |
| :--- | :--- |
| `php scripts/queue-worker.php` | Start worker on default queue |
| `php scripts/queue-worker.php email` | Start worker on 'email' queue |

### 🚀 Production Server (FrankenPHP)

| Command | Description |
| :--- | :--- |
| `frankenphp run --config Caddyfile.worker` | Start server in Worker Mode |
| `docker compose restart padi_worker` | Refresh worker memory after code change |

---

## 🔄 Migration Notes

For users upgrading from a legacy Padi architectural version:

- `scripts/worker.php` → **`scripts/queue-worker.php`** (Renamed for clarity)
- `public/worker.php` → **`public/index.php`** (Merged into unified entry point)

---

**Next Steps:** [Learn Deployment Strategies →](../04-deployment/PRODUCTION.md) | [Security Best Practices →](../03-advanced/SECURITY.md)
