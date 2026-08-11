# 🚀 Background Jobs & Queue

## 🏎️ Distributable Workload Orchestration

Unlock the full potential of asynchronous execution. Padi REST API’s Queue system is a **High-Throughput Task Orchestrator** designed to offload heavy operations and keep your API response times ultra-fast. From background email delivery to massive data processing, our distributed workload engine ensures your application remains responsive and scalable under any load.

---

## 📋 Table of Contents

- [🏎️ Distributable Workload Orchestration](#distributable-workload-orchestration)
- [📖 Overview](#overview)
- [🛠️ Defining a Job](#defining-a-job)
- [📤 Pushing onto Queue](#pushing-onto-queue)
- [🏃 Running the Worker](#running-the-worker)
- [⚙️ Configuration](#configuration)
- [⭐ Best Practices](#best-practices)

---


## 📖 Overview

By default, the framework uses a **Database-backed Queue**. This means jobs are stored in a `jobs` table and processed sequentially by a background worker script.

---

## 🛠️ Defining a Job

A Job is a simple PHP class located in the `app/Jobs` directory. It must implement a `handle(array $data)` method.

```php
namespace App\Jobs;

use Wibiesana\Padi\Core\Logger;

class ProcessImageJob
{
    /**
     * Handle the job processing.
     *
     * @param array $data Data passed when the job was pushed.
     */
    public function handle(array $data): void
    {
        $imageUrl = $data['url'];
        $size = $data['size'];

        Logger::info("Processing image: {$imageUrl} to size {$size}");

        // ... perform heavy logic here ...
    }
}
```

---

## 📍 Pushing onto Queue

You can push a job from anywhere in your application (typically from a Controller).

### 1. Simple Push

```php
use Wibiesana\Padi\Core\Queue;
use App\Jobs\ProcessImageJob;

Queue::push(ProcessImageJob::class, [
    'url' => 'https://example.com/image.jpg',
    'size' => 'thumb'
]);
```

### 2. Delayed Job

If you want the job to run after a certain delay (in seconds):

```php
// Run after 5 minutes (300 seconds)
Queue::push(ProcessImageJob::class, ['id' => 123], 'default', 300);
```

---

## 🏃 Running the Worker

To process the queued jobs, you must execute the worker script via the command-line interface.

### 1. Manual Execution (CLI)
Run the script from your project root directory:

```bash
# Process jobs on the default queue
php padi queue:work default
```

---

## ⏰ Startup & Production Daemon Configuration

In production, you want the queue worker to run continuously in the background, start automatically on server boot, and automatically restart if it crashes. Here is how to configure it:

### A. Linux Systemd Service (Recommended)
Create a new service configuration file at `/etc/systemd/system/padi-worker.service`:

```ini
[Unit]
Description=Padi Queue Worker Daemon
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/my-padi-app
ExecStart=/usr/bin/php padi queue:work default
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Reload systemd and enable the service on startup:
```bash
sudo systemctl daemon-reload
sudo systemctl enable padi-worker.service
sudo systemctl start padi-worker.service
```

### B. Docker Compose Setup
If deploying via Docker, run the worker as a separate service container:

```yaml
services:
  # Main REST API container
  api:
    build: .
    # ... other config ...

  # Queue Worker container
  queue-worker:
    build: .
    command: php padi queue:work default
    restart: always
    depends_on:
      - db
```

### D. Shared Hosting (cPanel Cron Job)
For shared hosting environments where continuous background daemons are not allowed, configure a cPanel Cron Job to run every minute with `--once` or `--stop-when-empty`:

```bash
* * * * * cd /home/username/public_html && php padi queue:work default --once > /dev/null 2>&1
```

- `--once`: Process 1 available job and terminate cleanly.
- `--stop-when-empty`: Process all pending jobs sequentially until queue is 0, then terminate.

#### ⚡ Handling Large Queues (High Volume Jobs)
- **VPS / Docker**: Use `php padi queue:work` (long-running daemon with Supervisor/Docker).
- **Shared Hosting**: Use `php padi queue:work --stop-when-empty` via cPanel Cron Job. This processes all pending jobs in a single run instead of just 1 job per minute.

---

## ⚙️ Configuration

You can configure queue behavior in your `.env` file.

```env
# Maximum number of retries before a job is considered failed and deleted
QUEUE_MAX_ATTEMPTS=3

# Default queue name
QUEUE_NAME=default

# Seconds to sleep between job polls (default: 3, supports decimal/float values, e.g. 0.5)
QUEUE_SLEEP=3
```

> **v2.0.2 Improvements**: Table initialization is cached (no repeated `CREATE TABLE IF NOT EXISTS` per push), multi-DB DDL support (MySQL, PostgreSQL, SQLite), and transaction rollback safety in error handler.

---

## 💡 Best Practices

1.  **Keep it Stateless**: High-volume jobs should be independent and not rely on global session state.
2.  **Retry logic**: The framework automatically retries failed jobs up to `QUEUE_MAX_ATTEMPTS`. Make sure your jobs are **idempotent** (safe to run multiple times).
3.  **Atomic Data**: Pass only the necessary data (like an ID) to the job, and fetch the latest model state inside the `handle` method.
4.  **Logging**: Use `Core\Logger` inside your jobs to track processing progress and debug failures.

---
