# 🤖 Worker Scripts & Background Process Management

## ⚙️ Precision-Engineered Automation

Efficiency is the heartbeat of a modern API. Padi REST API provides a suite of **Industrial-Grade Worker Scripts** designed to handle everything from high-speed HTTP request orchestration to asynchronous background task processing. By segregating transactional logic from background operations, our worker architecture ensures your application remains responsive, scalable, and optimized for high-performance deployment environments.

---

## 📋 Table of Contents

- [⚙️ Precision-Engineered Automation](#precision-engineered-automation)
- [📁 File Structure](#file-structure)
- [🔄 Queue Worker: The Background Architect](#queue-worker-the-background-architect)
    - [🛠️ 1. Defining a Job](#1-defining-a-job)
    - [📤 2. Dispatching a Job](#2-dispatching-a-job)
    - [🏃 3. Running the Worker](#3-running-the-worker)
- [🚀 FrankenPHP Worker: High-Performance Unified Entry](#frankenphp-worker-high-performance-unified-entry)
- [🎯 Quick Commands](#quick-commands)
- [🔄 Migration Notes](#migration-notes)

---

## 📁 File Structure

This project utilizes specialized scripts to maintain architectural purity between synchronous and asynchronous tasks:

| Script | Location | Purpose | Environment |
| :--- | :--- | :--- | :--- |
| **Queue Worker** | `php padi queue:work` | Processes background jobs (Email, Analytics, etc.) | All |
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

### 3. Running the Worker: VPS vs Shared Hosting

Padi REST API supports flexible deployment strategies for both full root access servers (VPS) and resource-constrained environments (Shared Hosting).

#### 🖥️ A. VPS & Cloud Servers (Daemon Mode)

On a VPS, Docker, or Dedicated Server, run the worker as a continuous background process using **Systemd**, **Supervisor**, or **Docker Compose**:

**1. Linux Systemd Service (`/etc/systemd/system/padi-worker.service`):**
```ini
[Unit]
Description=Padi REST API Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/my-api
ExecStart=/usr/bin/php padi queue:work
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**2. Supervisor Configuration (`/etc/supervisor/conf.d/padi-worker.conf`):**
```ini
[program:padi-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/my-api/padi queue:work
autostart=true
autorestart=true
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/my-api/storage/logs/worker.log
```

---

#### 🌐 B. Shared Hosting / cPanel (Cron Job Mode)

Shared hosting environments generally disallow 24/7 background daemons and enforce process execution time limits. Use the `--once` or `--stop-when-empty` flags combined with cPanel **Cron Jobs**:

**cPanel Cron Job Command (Run every minute):**
```bash
* * * * * cd /home/username/public_html && /usr/local/bin/php padi queue:work --once > /dev/null 2>&1
```

**Key Flags for Shared Hosting:**
- `--once`: Processes a single available job from the queue and immediately terminates. Prevents memory leaks and timeout errors on low-spec hosting.
- `--stop-when-empty`: Processes all currently queued jobs sequentially, then exits as soon as the queue becomes empty.

#### ⚡ Decision Guide: Handling Large Queues (High Volume Jobs)

When processing a large queue of background tasks (e.g., hundreds or thousands of emails/notifications):

| Environment | Recommended Command | Why? |
| :--- | :--- | :--- |
| **VPS / Docker** | `php padi queue:work` *(Standard Daemon)* | Resident in memory 24/7. Maximum speed with parallel worker processes (`numprocs=4`). |
| **Shared Hosting** | `php padi queue:work --stop-when-empty` | Processes all pending jobs in batch until queue hits `0`, then exits. Avoids processing only 1 job per minute (which `--once` would do). |

> 💡 **Shared Hosting Pro Tip**: If your hosting provider imposes a strict PHP execution timeout (e.g., 300 seconds), `--stop-when-empty` will process as many jobs as possible before timing out, and the next minute's cron job will automatically pick up right where it left off!

---

## 🎯 Practical Queue Examples & Execution

You can organize your background tasks into specialized "channels" or queues to optimize resource allocation. Here are common industrial patterns for naming and running your workers:

| Queue Name | Purpose | Dispatch Example | Start Command |
| :--- | :--- | :--- | :--- |
| **`default`** | General purpose tasks | `Queue::push(Job::class, $data)` | `php padi queue:work` |
| **`emails`** | Transactional & marketing mail | `Queue::push(Job::class, $data, 'emails')` | `php padi queue:work emails` |
| **`reports`** | Heavy PDF/Excel generation | `Queue::push(Job::class, $data, 'reports')` | `php padi queue:work reports` |
| **`notifications`** | Push notifications & webhooks | `Queue::push(Job::class, $data, 'notifications')` | `php padi queue:work notifications` |
| **`sync`** | Third-party data synchronization | `Queue::push(Job::class, $data, 'sync')` | `php padi queue:work sync` |

### 💡 Pro-Tip: Sequential vs Parallel Processing

- **Sequential**: Running one command `php padi queue:work` will process jobs one-by-one inside that single process.
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
| `php padi queue:work` | Start worker on default queue |
| `php padi queue:work email` | Start worker on 'email' queue |
| `php padi queue:work --once` | Run once for Shared Hosting Cron Jobs |

### 🚀 Production Server (FrankenPHP)

| Command | Description |
| :--- | :--- |
| `php padi serve:worker` | Start server in **Worker Mode** via Padi CLI |
| `php padi serve:frankenphp` | Start server in **Standard Mode** via Padi CLI |
| `frankenphp run --config Caddyfile.worker` | Start server in Worker Mode via Caddyfile |
| `docker compose restart padi_worker` | Refresh worker memory after code change |

---

## 🔄 Migration Notes

For users upgrading from a legacy Padi architectural version:

- `scripts/queue-worker.php` → **`php padi queue:work`** (Integrated into core CLI)
- `public/worker.php` → **`public/index.php`** (Merged into unified entry point)

---

**Next Steps:** [Learn Deployment Strategies →](../04-deployment/PRODUCTION.md) | [Security Best Practices →](../03-advanced/SECURITY.md)
