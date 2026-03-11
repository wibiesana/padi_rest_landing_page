# 🧪 API Testing Guide

## 🕵️ Strategic API Validation

Master your API with **Industrial-Grade Testing Workflows**. Padi REST API is designed for total observability and effortless validation. Whether you are performing surgical strikes with cURL, utilizing full-featured API Orchestration tools, or integrating via JavaScript, our framework ensures a consistent, predictable, and professional testing experience for developers across the stack.

---

## 📋 Table of Contents

- [🕵️ Strategic API Validation](#strategic-api-validation)
- [Using cURL](#using-curl)
- [Using API Clients (Postman, Insomnia, etc.)](#using-api-clients-postman-insomnia-etc)
- [Using JavaScript (Fetch API)](#using-javascript-fetch-api)
- [Response Codes](#response-codes)

---



## Using cURL

### 1. Health Check

```bash
curl http://localhost:8085/
```

### 2. Register User

```bash
curl -X POST http://localhost:8085/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
```

### 3. Login

```bash
curl -X POST http://localhost:8085/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password\"}"
```

The response will contain a token:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### 4. Get All Users (Protected)

```bash
curl -X GET http://localhost:8085/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get All Products

```bash
curl http://localhost:8085/products
```

### 6. Search & Sort Products

```bash
curl "http://localhost:8085/products?search=laptop&order_by=price&direction=desc"
```

### 7. Create Product (Protected)

```bash
curl -X POST http://localhost:8085/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"name\":\"New Laptop\",\"description\":\"Gaming laptop\",\"price\":20000000,\"stock\":5,\"category\":\"Electronics\"}"
```

### 8. Update Product (Protected)

```bash
curl -X PUT http://localhost:8085/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"name\":\"Updated Laptop\",\"price\":18085000}"
```

### 9. Update Stock (Protected)

```bash
curl -X PATCH http://localhost:8085/products/1/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"quantity\":10}"
```

### 10. Delete Product (Protected)

```bash
curl -X DELETE http://localhost:8085/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using API Clients (Postman, Insomnia, etc.)

1. Import collection file (e.g., `api_collection/auth_api_collection.json`) into your preferred API client.
2. Set the `base_url` variable to `http://localhost:8085`.
3. Login to retrieve the token.
4. Copy the token into the `token` variable.
5. Test all endpoints.

## Using JavaScript (Fetch API)

```javascript
// Login
fetch('http://localhost:8085/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password',
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    const token = data.data.token

    // Get products with token
    return fetch('http://localhost:8085/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  })
  .then((res) => res.json())
  .then((data) => console.log(data))
```

## Response Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error
