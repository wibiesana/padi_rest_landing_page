# 📚 API Reference

---

## 📋 Table of Contents

- [Standard Response Format](#standard-response-format)
- [🔑 Message Codes](#message-codes)
- [HTTP Status Codes](#http-status-codes)
- [Authentication Endpoints](#authentication-endpoints)
- [CRUD Endpoints](#crud-endpoints)
- [Validation Rules](#validation-rules)
- [Rate Limiting](#rate-limiting)
- [cURL Examples](#curl-examples)

---


## Standard Response Format

All API responses follow a consistent JSON structure, including a `message_code` for programmatic error handling.

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "message_code": "SUCCESS",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "message_code": "ERROR_CODE",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

---

## 🔑 Message Codes

| Code                    | HTTP Status | Description                                     |
| :---------------------- | :---------- | :---------------------------------------------- |
| `SUCCESS`               | 200         | Request successful                              |
| `CREATED`               | 201         | Resource created successfully                   |
| `NO_CONTENT`            | 204         | Request successful, no content to return        |
| `VALIDATION_FAILED`     | 422         | Request validation failed                       |
| `BAD_REQUEST`           | 400         | Invalid request format or parameters            |
| `UNAUTHORIZED`          | 401         | Authentication required                         |
| `INVALID_CREDENTIALS`   | 401         | Login failed - wrong username/email or password |
| `NO_TOKEN_PROVIDED`     | 401         | No authentication token provided                |
| `INVALID_TOKEN`         | 401         | Invalid or expired token                        |
| `FORBIDDEN`             | 403         | Access denied - insufficient permissions        |
| `NOT_FOUND`             | 404         | Resource not found                              |
| `ROUTE_NOT_FOUND`       | 404         | API endpoint not found                          |
| `RATE_LIMIT_EXCEEDED`   | 429         | Too many requests                               |
| `INTERNAL_SERVER_ERROR` | 500         | Server-side error                               |

---

## HTTP Status Codes

| Code    | Status                | Usage                              |
| ------- | --------------------- | ---------------------------------- |
| **200** | OK                    | Successful GET, PUT, DELETE        |
| **201** | Created               | Successful POST (resource created) |
| **400** | Bad Request           | Invalid request format             |
| **401** | Unauthorized          | Missing or invalid authentication  |
| **403** | Forbidden             | Authenticated but not authorized   |
| **404** | Not Found             | Resource not found                 |
| **422** | Unprocessable Entity  | Validation errors                  |
| **429** | Too Many Requests     | Rate limit exceeded                |
| **500** | Internal Server Error | Server error                       |

---

## Authentication Endpoints

### Register New User

**Endpoint:** `POST /auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "message_code": "CREATED",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2026-02-09 09:50:00"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "username": "john@example.com",
  "password": "SecurePass123!",
  "remember_me": true
}
```

**Parameters:**

- `username` (required): Email or username
- `password` (required): User password
- `remember_me` (optional): Set to `true` or `1` for extended session (365 days). Default session is 1 hour.

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "message_code": "SUCCESS",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

### Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Response (200):**

```json
{
  "success": true,
  "message_code": "SUCCESS",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2026-02-09 09:50:00"
  }
}
```

### Logout

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "message_code": "SUCCESS"
}
```

---

## CRUD Endpoints

All auto-generated resources follow this pattern.

### List All Resources

**Endpoint:** `GET /resources`

**Query Parameters:**

- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 20)
- `search` (string): Search keyword
- `sort` (string): Column to sort by (e.g., `id`, `name`)
- `order` (string): `asc` or `desc`

**Example:**

```
GET /products?page=1&per_page=20&search=laptop&sort=price&order=desc
```

**Response (200):**

```json
{
  "success": true,
  "message_code": "SUCCESS",
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 99.99,
      "created_at": "2026-02-09 09:50:00"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}
```

### Get Single Resource

**Endpoint:** `GET /resources/{id}`

**Response (200):**

```json
{
  "success": true,
  "message_code": "SUCCESS",
  "data": {
    "id": 1,
    "name": "Product 1",
    "price": 99.99,
    "created_at": "2026-02-09 09:50:00"
  }
}
```

---

## Validation Rules

| Rule                       | Description                                                     |
| :------------------------- | :-------------------------------------------------------------- |
| `required`                 | Field must be present and not empty                             |
| `sometimes`                | Field is validated only if it is present in the input           |
| `required_if:field,val`    | Field is required if another field equals a specific value       |
| `required_with:fields`     | Field is required if any of the specified fields are present    |
| `required_without:fields`  | Field is required if any of the specified fields are absent     |
| `string`                   | Must be a valid string                                          |
| `numeric`                  | Must be a numeric value                                         |
| `integer`                  | Must be an integer value                                        |
| `boolean`                  | Must be a boolean value (true, false, 0, 1, "0", "1")           |
| `array`                    | Must be an array                                                |
| `json`                     | Must be a valid JSON string                                     |
| `email`                    | Must be a valid email format                                    |
| `url`                      | Must be a valid URL                                             |
| `uuid`                     | Must be a valid UUID                                            |
| `date`                     | Must be a valid date                                            |
| `date_format:format`       | Must match a specific date format (e.g., `Y-m-d H:i:s`)         |
| `before:date`              | Must be a date before a given date                              |
| `after:date`               | Must be a date after a given date                               |
| `min:n`                    | Minimum length (strings/arrays) or numeric value                |
| `max:n`                    | Maximum length (strings/arrays) or numeric value                |
| `between:min,max`          | Value/length must be between min and max                        |
| `size:n`                   | Value/length must be exactly n                                  |
| `in:values`                | Must be one of the comma-separated values                       |
| `not_in:values`            | Must not be one of the comma-separated values                   |
| `unique:table,column`      | Must be unique in the database                                  |
| `exists:table,column`      | Must exist in the database                                      |
| `confirmed`                | Must match a confirmation field (e.g., `password_confirmation`)  |
| `alpha`                    | Must contain only alphabetic characters                         |
| `alpha_dash`               | Must contain only letters, numbers, dashes, and underscores      |
| `alphanumeric`             | Must contain only letters and numbers                           |
| `regex:pattern`            | Must match the regular expression pattern                       |
| `nullable`                 | Field is allowed to be null                                     |

---

## Rate Limiting

### Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1707480850
```

### Exceeded Response (429)

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "message_code": "RATE_LIMIT_EXCEEDED"
}
```

---

## cURL Examples

### Register

```bash
curl -X POST http://localhost:8085/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!"
  }'
```

---

**Next Steps:**

- [Frontend Integration](../03-advanced/FRONTEND_INTEGRATION.md)
- [API Collection Guide](../03-advanced/API_COLLECTION_GUIDE.md)
