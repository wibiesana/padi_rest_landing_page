# ⚡ Real-time Pub/Sub (Mercure Hub)

Padi REST API Framework features native support for real-time pub/sub messaging using the built-in **Mercure Hub** inside FrankenPHP.

By using **Server-Sent Events (SSE)**, you can push notifications, messages, and state updates from your PHP backend directly to web/mobile clients instantly and securely, with **zero external server dependencies** (no Pusher, socket.io, or complex WebSocket daemons required).

---

## 📋 Table of Contents

- [⚙️ Configuration](#configuration)
- [📡 Publishing Events](#publishing-events)
  - [1. Controller-based (Explicit)](#1-controller-based-explicit)
  - [2. ORM Hooks (Automatic)](#2-orm-hooks-automatic)
- [💻 Client-side Integration (JavaScript)](#client-side-integration-javascript)
- [🛡️ Security \& Private Topics](#security--private-topics)

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
Use ActiveRecord lifecycle hooks to automatically broadcast updates when data changes in the database:

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

---

## 💻 Client-side Integration (JavaScript)

Since Mercure is built on standard **Server-Sent Events (SSE)**, subscribing in modern web browsers is straightforward using the native `EventSource` API.

```javascript
// 1. Specify the hub URL and add target topic
const hubUrl = new URL('http://localhost:8085/.well-known/mercure');
hubUrl.searchParams.append('topic', 'new-posts');

// 2. Initialize connection
const eventSource = new EventSource(hubUrl);

// 3. Listen for incoming messages
eventSource.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    console.log('Realtime Update:', payload);
};

eventSource.onerror = (err) => {
    console.error('SSE Connection failed:', err);
};
```

---

## 🛡️ Security & Private Topics

For private channels (e.g. user-specific notifications, chat rooms), you must authorize the subscribers.

### 1. Active Token via Auth API
When a user logs in or registers, Padi automatically attaches a secure subscriber JWT token (with authorization to read `'user-notifications-{userId}'`) to the response payload:

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
import { EventSourcePolyfill } from 'event-source-polyfill';

const hubUrl = new URL('http://localhost:8085/.well-known/mercure');
hubUrl.searchParams.append('topic', 'user-notifications-1');

const eventSource = new EventSourcePolyfill(hubUrl, {
  headers: {
    'Authorization': 'Bearer ' + realtimeToken // token returned from login API
  }
});

eventSource.onmessage = event => {
  const data = JSON.parse(event.data);
  console.log('Secure Notification:', data);
};
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
      'Authorization': 'Bearer ' + authData.realtime.token
    }
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
import React, { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

export function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    if (!authData.realtime) return;

    const hubUrl = new URL(authData.realtime.hub_url);
    hubUrl.searchParams.append('topic', `user-notifications-${authData.user.id}`);

    const eventSource = new EventSourcePolyfill(hubUrl, {
      headers: {
        'Authorization': `Bearer ${authData.realtime.token}`
      }
    });

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setNotifications((prev) => [payload, ...prev]);
    };

    // Close connection on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h3>Live Notifications</h3>
      {notifications.map((n, i) => (
        <p key={i}>{n.message}</p>
      ))}
    </div>
  );
}
```
