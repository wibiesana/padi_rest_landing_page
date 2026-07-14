# 🌐 Frontend Integration Guide

## 🚀 Seamless Universal Connectivity

**Zero-Configuration Compatibility:** Padi REST API is engineered for seamless integration with any modern stack. Whether you're building with **Vue, React, Angular, Next.js, or Vanilla JavaScript**, our standardized JSON-JWT architecture ensures your frontend speaks fluently with your backend with zero friction.

---

## 📋 Table of Contents

- [🚀 Seamless Universal Connectivity](#seamless-universal-connectivity)
- [Overview](#overview)
- [Vue.js Integration](#vuejs-integration)
- [React Integration](#react-integration)
- [Angular Integration](#angular-integration)
- [Next.js Integration](#nextjs-integration)
- [Vanilla JavaScript](#vanilla-javascript)
- [⚡ Real-time Pub/Sub Integration (Mercure SSE)](#-real-time-pubsub-integration-mercure-sse)
- [CORS Configuration](#cors-configuration)

---

## Overview

This Padi REST API framework is compatible with **all frontend frameworks** as it uses standard REST API with JSON responses and JWT authentication.

**What you need to do:**

1. Configure environment variables (API URL)
2. Setup HTTP client (axios, fetch, etc.)
3. Add JWT token to Authorization header
4. Handle responses

---

## Vue.js Integration

### Setup (Vue 3 + Vite/Vue CLI)

#### 1. Install Dependencies

```bash
npm install axios
```

#### 2. Environment Configuration

**`.env.development`:**

```env
VITE_API_URL=http://localhost:8085
# Or for Vue CLI:
VUE_APP_API_URL=http://localhost:8085
```

**`.env.production`:**

```env
VITE_API_URL=https://api.yourdomain.com
VUE_APP_API_URL=https://api.yourdomain.com
```

#### 3. Create API Service

**`src/services/api.js`:**

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || process.env.VUE_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response.data.data || response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

#### 4. Usage in Components

**Composition API:**

```vue
<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";

const products = ref([]);
const loading = ref(false);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await api.get("/products");
    products.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProducts);
</script>
```

**Options API:**

```vue
<script>
import api from "@/services/api";

export default {
  data() {
    return {
      products: [],
      loading: false,
    };
  },

  async mounted() {
    await this.fetchProducts();
  },

  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await api.get("/products");
        this.products = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

---

## React Integration

### Setup (React 18 + Vite/CRA)

#### 1. Install Dependencies

```bash
npm install axios
```

#### 2. Environment Configuration

**`.env.development`:**

```env
VITE_API_URL=http://localhost:8085
# Or for CRA:
REACT_APP_API_URL=http://localhost:8085
```

#### 3. Create API Service

**`src/services/api.js`:**

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data.data || response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

#### 4. Usage in Components

**Functional Component with Hooks:**

```javascript
import { useState, useEffect } from "react";
import api from "./services/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get("/products");
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
```

---

## Angular Integration

### Setup (Angular 15+)

#### 1. Environment Configuration

**`src/environments/environment.ts`:**

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8085",
};
```

**`src/environments/environment.prod.ts`:**

```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.yourdomain.com",
};
```

#### 2. Create API Service

**`src/app/services/api.service.ts`:**

```typescript
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<any>(`${this.apiUrl}${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => response.data || response),
        catchError(this.handleError),
      );
  }

  // ... other methods (post, put, delete)

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return throwError(() => new Error(error.message));
  }
}
```

---

## Next.js Integration

### Setup (Next.js 14+)

#### 1. Environment Configuration

**`.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8085
```

#### 2. Create API Service

**`lib/api.js`:**

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        throw new Error(data.message || "API Error");
      }

      return data.data || data;
    } catch (error) {
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }
  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

export default new ApiService();
```

---

## Vanilla JavaScript

### Pure JavaScript (No Framework)

#### 1. Create API Service (See lib/api.js above)

#### 2. Usage Example

```html
<script src="js/api.js"></script>
<script>
  async function loadProducts() {
    try {
      const response = await api.get("/products");
      const products = response.data;
      // Render components
    } catch (error) {
      console.error(error);
    }
  }
  document.addEventListener("DOMContentLoaded", loadProducts);
</script>
```

---

## ⚡ Real-time Pub/Sub Integration (Mercure SSE)

Padi REST API features native support for real-time Server-Sent Events (SSE) via the built-in Mercure Hub (**exclusive to FrankenPHP environments**). When Mercure is enabled, login and registration responses include a `realtime` payload containing the Hub URL and a temporary subscriber JWT token.

### JavaScript Client Subscription (Basic)

Here is a basic example of how to connect to the Mercure Hub and listen for real-time updates in your frontend using native `EventSource`:

```javascript
// 1. Get the hub URL and subscriber token from your Auth response
const { hub_url, token } = authResponse.realtime; 

// 2. Build the subscription URL with the target topic(s)
const url = new URL(hub_url);
url.searchParams.append('topic', 'http://localhost:8085/api/v1/products'); // Target topic

// Note: For private topics, pass the JWT token to authorize the subscription
url.searchParams.append('authorization', `Bearer ${token}`); 

// 3. Establish the connection
const eventSource = new EventSource(url);

// 4. Listen for real-time events
eventSource.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  console.log('Received real-time update:', payload);
};

eventSource.onerror = (error) => {
  console.error('SSE Connection failed:', error);
};
```

### Vue 3 Implementation (Composition API)

A complete Vue 3 component showcasing state synchronization and connection cleanup on unmount:

```vue
<template>
  <div class="product-catalog">
    <h3>Live Product Catalog</h3>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EventSourcePolyfill } from 'event-source-polyfill';

const products = ref([]);
let eventSource = null;

// Fetch initial data
const fetchProducts = async () => {
  const response = await fetch('http://localhost:8085/api/v1/products');
  const result = await response.json();
  products.value = result.data || result;
};

onMounted(async () => {
  await fetchProducts();

  // Retrieve Realtime details from auth storage
  const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
  if (!authData.realtime) return;

  const { hub_url, token } = authData.realtime;
  const url = new URL(hub_url);
  url.searchParams.append('topic', 'http://localhost:8085/api/v1/products');

  // Establish SSE Connection with JWT Auth Header Polyfill
  eventSource = new EventSourcePolyfill(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Handle incoming real-time notifications
  eventSource.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    const { event: eventType, data } = payload;

    if (eventType === 'product_created') {
      products.value.push(data);
    } else if (eventType === 'product_updated') {
      const index = products.value.findIndex(p => p.id === data.id);
      if (index !== -1) products.value[index] = data;
    } else if (eventType === 'product_deleted') {
      products.value = products.value.filter(p => p.id !== data.id);
    }
  };

  eventSource.onerror = (err) => {
    console.error('Real-time connection error:', err);
  };
});

onUnmounted(() => {
  // Prevent memory leaks by closing connection
  if (eventSource) {
    eventSource.close();
  }
});
</script>
```

### React Implementation (Hooks)

A complete React component showcasing state synchronization and connection cleanup inside `useEffect`:

```jsx
import React, { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

export function LiveProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1. Fetch initial products list
    fetch('http://localhost:8085/api/v1/products')
      .then(res => res.json())
      .then(result => setProducts(result.data || result));

    // 2. Establish Real-time Connection
    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    if (!authData.realtime) return;

    const { hub_url, token } = authData.realtime;
    const url = new URL(hub_url);
    url.searchParams.append('topic', 'http://localhost:8085/api/v1/products');

    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const { event: eventType, data } = payload;

      setProducts((prevProducts) => {
        if (eventType === 'product_created') {
          return [...prevProducts, data];
        }
        if (eventType === 'product_updated') {
          return prevProducts.map(p => p.id === data.id ? data : p);
        }
        if (eventType === 'product_deleted') {
          return prevProducts.filter(p => p.id !== data.id);
        }
        return prevProducts;
      });
    };

    eventSource.onerror = (err) => {
      console.error('Real-time connection error:', err);
    };

    // 3. Clean up subscription on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="product-catalog">
      <h3>Live Product Catalog</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## CORS Configuration

By default, the API allowed all origins in development mode. In production, you must whitelist your domains in the `.env` file.

**`.env`:**

```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

[⬅️ Back to Docs Index](INDEX.md)
