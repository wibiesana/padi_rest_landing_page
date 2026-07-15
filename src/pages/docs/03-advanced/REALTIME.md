# ⚡ Real-time Pub/Sub (Mercure Hub)

Padi REST API Framework features native support for real-time pub/sub messaging using the built-in **Mercure Hub** inside FrankenPHP.

> [!WARNING]
> **FrankenPHP Exclusive Feature**  
> Real-time capabilities (Mercure) are **only supported when running under FrankenPHP** (both Standard and Worker modes). This features relies on the built-in Mercure module compiled into FrankenPHP's web server, and is **not compatible** with traditional web servers like Apache, Nginx, or standard PHP-FPM setups.

By using **Server-Sent Events (SSE)**, you can push notifications, messages, and state updates from your PHP backend directly to web/mobile clients instantly and securely, with **zero external server dependencies** (no Pusher, socket.io, or complex WebSocket daemons required).

> [!TIP]
> **Complete Example Application**  
> We have provided a fully-functional real-time sample project (integrated with a frontend chat and notification UI) in this repository: [wibiesana/padi-rest-realtime-example](https://github.com/wibiesana/padi-rest-realtime-example).

---

## 📋 Table of Contents

- [⚙️ Configuration](#configuration)
- [📡 Publishing Events](#publishing-events)
  - [1. Controller-based (Explicit)](#1-controller-based-explicit)
  - [2. ORM Hooks (Automatic)](#2-orm-hooks-automatic)
- [💻 Client-side Integration (JavaScript)](#client-side-integration-javascript)
- [🛡️ Security \& Private Topics](#security--private-topics)
- [📖 Complete End-to-End Example (Live Books Sync)](#-complete-end-to-end-example-live-books-sync)

---

## ⚙️ Configuration

### 1. Enable in `.env`

To enable real-time messaging, configure the Mercure settings in your `.env` file:

```env
# Enable real-time broadcasting
MERCURE_ENABLED=true

# Hub URL for publishing events (internal URL used by PHP)
MERCURE_HUB_URL="http://localhost:8085/.well-known/mercure"

# Public Hub URL for clients to connect (external URL)
MERCURE_PUBLIC_HUB_URL="http://localhost:8085/.well-known/mercure"

# Publisher JWT secret key (must match Caddyfile publisher_jwt)
MERCURE_PUBLISHER_JWT_KEY="padi_mercure_publisher_secret_key_change_me_in_prod"

# Subscriber JWT secret key (must match Caddyfile subscriber_jwt)
MERCURE_SUBSCRIBER_JWT_KEY="padi_mercure_subscriber_secret_key_change_me_in_prod"
```

### 2. Verify Caddyfile

Ensure the Mercure module is configured in your Caddyfile (both `Caddyfile.worker` and `Caddyfile.standard` have this enabled by default in v2.1.0):

```caddyfile
# Global block
{
    frankenphp
    order mercure after encode
}

# Site block
:8085 {
    root * /app/public

    # Enable Mercure Hub
    mercure {
        publisher_jwt "padi_mercure_publisher_secret_key_change_me_in_prod"
        subscriber_jwt "padi_mercure_subscriber_secret_key_change_me_in_prod"
        anonymous
    }

    php_server
}
```

---

## ⚡ CLI Code Generator Integration

Padi's powerful Auto CRUD generator fully supports real-time pub/sub. When generating a new CRUD resource or bulk generating all tables, the CLI will ask whether you want to enable Mercure real-time hooks:

```bash
# Generate CRUD for a single table with interactive prompts
php padi generate:crud posts

# Or explicitly pass the --realtime flag (non-interactive friendly)
php padi generate:crud posts --realtime
```

If enabled, the generator automatically injects the necessary imports and the `afterSave` and `afterDelete` hooks inside the newly generated concrete model.

---

## 📡 Publishing Events

You can trigger real-time updates from either your controllers or your ActiveRecord models.

### 1. Controller-based (Explicit)

Use this pattern to broadcast updates from specific API actions:

```php
use Wibiesana\Padi\Core\Realtime;

public function create()
{
    $post = $this->model->create($this->request->all());

    // Broadcast real-time update to 'new-posts' channel
    Realtime::publish('new-posts', [
        'event' => 'post_created',
        'post' => $post
    ]);

    return $post;
}
```

### 2. ORM Hooks (Automatic)

Use ActiveRecord lifecycle hooks to automatically broadcast updates when data changes in the database.

#### Option A: Direct / Synchronous (Simple Setup)

Ideal for small apps or environments where a background queue worker is not configured.

```php
namespace App\Models;

use Wibiesana\Padi\Core\ActiveRecord;
use Wibiesana\Padi\Core\Realtime;

class Notification extends ActiveRecord
{
    protected string $table = 'notifications';

    // Automatically trigger real-time notification after saving (create/update)
    protected function afterSave(bool $insert, array $data): void
    {
        $event = $insert ? 'notification_created' : 'notification_updated';

        Realtime::publish(
            'user-notifications-' . $this->user_id, // Target topic
            [
                'event' => $event,
                'data' => $this->toArray()
            ],
            true // Private topic
        );
    }

    // Automatically trigger real-time notification after deleting
    protected function afterDelete(int|string|array $id): void
    {
        Realtime::publish(
            'user-notifications-' . $this->user_id, // Target topic
            [
                'event' => 'notification_deleted',
                'id' => $id
            ],
            true // Private topic
        );
    }
}
```

#### Option B: Queue-based / Asynchronous (High-Performance Production)

Recommended for high-traffic environments to prevent blocking main HTTP threads during broadcasts.

```php
namespace App\Models;

use App\Jobs\BroadcastRealtimeJob;
use Wibiesana\Padi\Core\ActiveRecord;
use Wibiesana\Padi\Core\Queue;

class Notification extends ActiveRecord
{
    protected string $table = 'notifications';

    // Automatically trigger real-time notification after saving via Queue
    protected function afterSave(bool $insert, array $data): void
    {
        $event = $insert ? 'notification_created' : 'notification_updated';

        Queue::push(BroadcastRealtimeJob::class, [
            'topic' => 'user-notifications-' . $this->user_id,
            'data' => [
                'event' => $event,
                'data'  => $this->toArray()
            ],
            'private' => true // Private topic
        ]);
    }

    // Automatically trigger real-time notification after deleting via Queue
    protected function afterDelete(int|string|array $id): void
    {
        Queue::push(BroadcastRealtimeJob::class, [
            'topic' => 'user-notifications-' . $this->user_id,
            'data' => [
                'event' => 'notification_deleted',
                'id'    => $id
            ],
            'private' => true // Private topic
        ]);
    }
}
```

### 3. Queue-based Broadcasting (High-Performance Production)

For high-traffic production environments, calling `Realtime::publish()` directly in the HTTP request thread can block PHP workers. Instead, push broadcasting tasks to the background queue using Padi's built-in Queue system and the pre-built `BroadcastRealtimeJob`:

```php
use App\Jobs\BroadcastRealtimeJob;
use Wibiesana\Padi\Core\Queue;

// Inside your Controller or Model:
Queue::push(BroadcastRealtimeJob::class, [
    'topic'   => 'new-posts',
    'data'    => [
        'event' => 'post_created',
        'post'  => $post
    ],
    'private' => false, // optional
    'targets' => []      // optional
]);
```

This delegates the cURL request to background queue workers, ensuring zero impact on user request latencies under high load.

---

## 🕹️ Demo Controller & API Examples (`ExampleRealtimeController.php`)

Padi's boilerplate template includes a fully-functional `ExampleRealtimeController.php` located at `app/Controllers/ExampleRealtimeController.php` to showcase various broadcasting and token generation scenarios.

Here is how each endpoint is designed and how to interact with it:

### 1. Public Chat Broadcast (`POST /api/realtime/chat`)

Broadcast a public message to all clients listening to the `public-chat` topic.

- **Controller Implementation:**

  ```php
  $success = Realtime::publish('public-chat', [
      'username' => $this->request->get('username', 'Anonymous'),
      'message' => $this->request->get('message'),
      'sent_at' => date('Y-m-d H:i:s')
  ]);
  ```

- **API Request (JSON):**
  ```json
  {
    "username": "JohnDoe",
    "message": "Hello world!"
  }
  ```

### 2. Private User Notifications (`POST /api/realtime/notify`)

Send a private notification targeting a specific user topic `user-notifications-{user_id}`.

- **Controller Implementation:**

  ```php
  $success = Realtime::publish('user-notifications-' . $userId, [
      'title' => 'Personal Notification',
      'message' => $message,
      'timestamp' => time()
  ], true); // The third argument 'true' enforces a private topic
  ```

- **API Request (JSON):**
  ```json
  {
    "user_id": 5,
    "message": "You have a new friend request!"
  }
  ```

### 3. Authorized Group Alerts (`POST /api/realtime/alert`)

Publish a system warning message that only reaches subscribers authorized with specific target groups (e.g. `admin` or `moderators`).

- **Controller Implementation:**

  ```php
  $this->requireRole('admin');

  $success = Realtime::publish('system-alerts', [
      'alert_level' => 'WARNING',
      'message' => $message,
      'sent_at' => date('Y-m-d H:i:s')
  ], true, ['admin', 'moderators']); // Authorized groups allowed to receive this update
  ```

### 4. Dynamic Subscriber Token Request (`POST /api/realtime/token`)

Request a custom subscriber JWT token containing specific topic claims dynamically after validating the authenticated user permissions.

- **Controller Implementation:**
  ```php
  public function getCustomSubscribeToken()
  {
      $this->requireAuth();
      $topics = $this->request->get('topics');

      // Ensure users can only subscribe to their own notification topics
      foreach ($topics as $topic) {
          if (str_starts_with($topic, 'user-notifications-') && $topic !== 'user-notifications-' . $this->request->user->user_id) {
              throw new \Exception("Unauthorized to subscribe to topic: {$topic}", 403);
          }
      }

      return [
          'token' => Realtime::generateSubscriberJwt($topics),
          'hub_url' => Realtime::getHubUrl(),
          'topics' => $topics
      ];
  }
  ```

---

## 💻 Client-side Integration (JavaScript)

Since Mercure is built on standard **Server-Sent Events (SSE)**, subscribing in modern web browsers is straightforward using the native `EventSource` API.

```javascript
// 1. Specify the hub URL and add target topic
const hubUrl = new URL('http://localhost:8085/.well-known/mercure')
hubUrl.searchParams.append('topic', 'new-posts')

// 2. Initialize connection
const eventSource = new EventSource(hubUrl)

// 3. Listen for incoming messages
eventSource.onmessage = (event) => {
  const payload = JSON.parse(event.data)
  console.log('Realtime Update:', payload)
}

eventSource.onerror = (err) => {
  console.error('SSE Connection failed:', err)
}
```

---

## 🛡️ Security & Private Topics

For private channels (e.g. user-specific notifications, chat rooms), you must authorize the subscribers.

### 1. Active Token via Auth API

When a user logs in or registers—provided `MERCURE_ENABLED=true` is set and `MERCURE_HUB_URL` is configured in your `.env`—Padi automatically attaches a secure subscriber JWT token (with authorization to read `'user-notifications-{userId}'`) to the response payload:

```json
{
  "user": { "id": 1, "username": "al" },
  "token": "eyJhbG...",
  "realtime": {
    "hub_url": "http://localhost:8085/.well-known/mercure",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Listening to Private Topics with JWT

To listen to a private channel, the client must pass the JWT token inside the `Authorization` header. Since standard `EventSource` does not support custom headers natively, you can use the official `@mercure-component/handshake` package or pass it as a query parameter or cookie:

```javascript
// Pass the JWT subscriber token as cookie or utilize a wrapper library
import { EventSourcePolyfill } from 'event-source-polyfill'

const hubUrl = new URL('http://localhost:8085/.well-known/mercure')
hubUrl.searchParams.append('topic', 'user-notifications-1')

const eventSource = new EventSourcePolyfill(hubUrl, {
  headers: {
    Authorization: 'Bearer ' + realtimeToken, // token returned from login API
  },
})

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Secure Notification:', data)
}
```

---

## 🌐 JS Framework Integration (Vue 3 \& React)

Here are complete examples of how to connect, listen, and safely clean up real-time Mercure updates inside modern frontend frameworks.

### 1. Vue 3 (Composition API)

```vue
<template>
  <div class="notifications-list">
    <h3>Live Notifications</h3>
    <div v-for="notif in notifications" :key="notif.id" class="notif-card">
      {{ notif.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'

const notifications = ref([])
let eventSource = null

onMounted(() => {
  // Fetch Padi auth response containing Mercure credentials
  const authData = JSON.parse(localStorage.getItem('auth_data') || '{}')
  if (!authData.realtime) return

  const hubUrl = new URL(authData.realtime.hub_url)
  hubUrl.searchParams.append('topic', 'user-notifications-' + authData.user.id)

  eventSource = new EventSourcePolyfill(hubUrl, {
    headers: {
      Authorization: 'Bearer ' + authData.realtime.token,
    },
  })

  eventSource.onmessage = (event) => {
    const payload = JSON.parse(event.data)
    notifications.value.unshift(payload)
  }
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>
```

### 2. React (Hooks)

```jsx
import React, { useEffect, useState } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'

export function Notifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}')
    if (!authData.realtime) return

    const hubUrl = new URL(authData.realtime.hub_url)
    hubUrl.searchParams.append('topic', `user-notifications-${authData.user.id}`)

    const eventSource = new EventSourcePolyfill(hubUrl, {
      headers: {
        Authorization: `Bearer ${authData.realtime.token}`,
      },
    })

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data)
      setNotifications((prev) => [payload, ...prev])
    }

    // Close connection on component unmount
    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h3>Live Notifications</h3>
      {notifications.map((n, i) => (
        <p key={i}>{n.message}</p>
      ))}
    </div>
  )
}
```

---

## 📖 Complete End-to-End Example (Live Books Sync)

Here is a full real-world scenario of implementing real-time syncing for a `Book` resource.

### Step 1: Prepare Database & Model

Create the table and define the ActiveRecord model with automatic background broadcasting:

```php
namespace App\Models;

use Wibiesana\Padi\Core\ActiveRecord;
use Wibiesana\Padi\Core\Queue;
use App\Jobs\BroadcastRealtimeJob;

class Book extends ActiveRecord
{
    protected string $table = 'books';
    protected array $fillable = ['title', 'author', 'price'];

    // Automatically push a broadcast job to background workers on save
    protected function afterSave(bool $insert, array $data): void
    {
        $event = $insert ? 'book_created' : 'book_updated';
        Queue::push(BroadcastRealtimeJob::class, [
            'topic'   => 'http://localhost:8085/api/v1/books',
            'private' => false,
            'data'    => [
                'event' => $event,
                'data'  => $this->toArray()
            ]
        ]);
    }

    // Automatically push a delete broadcast job
    protected function afterDelete(int|string|array $id): void
    {
        Queue::push(BroadcastRealtimeJob::class, [
            'topic'   => 'http://localhost:8085/api/v1/books',
            'private' => false,
            'data'    => [
                'event' => 'book_deleted',
                'id'    => $id
            ]
        ]);
    }
}
```

### Step 2: Establish the Client Connection (HTML/JS)

Listen for updates in vanilla HTML/JavaScript:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Real-time Book Tracker</title>
  </head>
  <body>
    <h1>Real-time Book Catalog</h1>
    <ul id="book-list"></ul>

    <script>
      const bookList = document.getElementById('book-list')

      // 1. Establish SSE Connection (pointed to Mercure Hub)
      const hubUrl = new URL('http://localhost:8085/.well-known/mercure')
      hubUrl.searchParams.append('topic', 'http://localhost:8085/api/v1/books')
      const eventSource = new EventSource(hubUrl)

      // 2. Listen to updates
      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data)
        console.log('Real-time event:', payload)

        if (payload.event === 'book_created') {
          const li = document.createElement('li')
          li.id = `book-${payload.data.id}`
          li.textContent = `${payload.data.title} by ${payload.data.author}`
          bookList.appendChild(li)
        } else if (payload.event === 'book_updated') {
          const li = document.getElementById(`book-${payload.data.id}`)
          if (li) {
            li.textContent = `${payload.data.title} by ${payload.data.author} (Updated)`
          }
        } else if (payload.event === 'book_deleted') {
          const li = document.getElementById(`book-${payload.id}`)
          if (li) li.remove()
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE Error occurred:', error)
      }
    </script>
  </body>
</html>
```
