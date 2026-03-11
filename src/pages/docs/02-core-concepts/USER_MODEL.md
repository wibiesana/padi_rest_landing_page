# 👤 Enhanced User Model & Identity Engine

## 🛡️ Industrial-Grade Identity & Security Foundation

The Padi REST API User Model is more than just a data structure—it is a **Sophisticated Identity Engine**. Built for enterprise-scale security, it comes pre-integrated with advanced authentication logic, high-performance activity auditing, and professional-grade profile management. This ensures your application starts with a secure, scalable, and battle-tested identity system from the very first deployment.

---

## 📋 Table of Contents

- [🛡️ Industrial-Grade Identity & Security Foundation](#industrial-grade-identity--security-foundation)
- [✅ User Model Updated!](#user-model-updated)
- [📋 What Changed?](#what-changed)
- [🎯 New Helper Methods Added](#new-helper-methods-added)
- [🔐 Enhanced AuthController](#enhanced-authcontroller)
- [💡 Usage Examples](#usage-examples)
- [🗂️ Database Table Structure](#database-table-structure)
- [🎨 Possible User Statuses](#possible-user-statuses)
- [🔒 Security Features](#security-features)
- [📊 Role-Based Access Control](#role-based-access-control)
- [✨ Best Practices](#best-practices)

---



## 📋 What Changed?

### Before (Old):

```php
protected array $fillable = [
    'name',
    'email',
    'password',
    'role'
];

protected array $hidden = ['password'];
```

### After (Enhanced):

```php
protected array $fillable = [
    'name',
    'email',
    'password',
    'phone',           // ← NEW
    'avatar',          // ← NEW
    'role',
    'status',          // ← NEW
    'email_verified_at', // ← NEW
    'remember_token',  // ← NEW
    'last_login_at'    // ← NEW
];

protected array $hidden = [
    'password',
    'remember_token'   // ← NEW (security)
];
```

---

## 🎯 New Helper Methods Added

### 1. **findActiveByEmail()** - Find Active Users Only

```php
$user = $userModel->findActiveByEmail('user@example.com');
// Returns null if user is inactive
```

### 2. **markEmailAsVerified()** - Email Verification

```php
$userModel->markEmailAsVerified($userId);
// Sets email_verified_at timestamp
```

### 3. **updateLastLogin()** - Track Login Activity

```php
$userModel->updateLastLogin($userId);
// Updates last_login_at timestamp
```

### 4. **changeStatus()** - User Status Management

```php
$userModel->changeStatus($userId, 'inactive');
$userModel->changeStatus($userId, 'banned');
$userModel->changeStatus($userId, 'active');
```

### 5. **isActive()** - Check User Status

```php
if ($userModel->isActive($user)) {
    // User is active
}
```

### 6. **isEmailVerified()** - Check Email Verification

```php
if ($userModel->isEmailVerified($user)) {
    // Email is verified
}
```

### 7. **Remember Token Management**

```php
// Generate token
$token = $userModel->generateRememberToken();

// Set token for user
$userModel->setRememberToken($userId, $token);
```

---

## 🔐 Enhanced AuthController

**Login method** has been updated to:

✅ **Check user status** - Only active users can login  
✅ **Update last login** - Track when last logged in  
✅ **Include status in JWT** - Token includes user status  
✅ **Better error messages** - Clear why login failed

### Before:

```php
$user = $this->userModel->findByEmail($email);
if (!$user) {
    $this->unauthorized('Invalid credentials');
}
```

### After:

```php
$user = $this->userModel->findActiveByEmail($email);
if (!$user) {
    $this->unauthorized('Invalid credentials or account is inactive');
}

// Check status
if (!$this->userModel->isActive($userWithPassword)) {
    $this->unauthorized('Your account is inactive. Please contact support.');
}

// Update last login
$this->userModel->updateLastLogin($user['id']);
```

---

## 💡 Usage Examples

### Register New User

```php
$userModel = new User();

$userId = $userModel->createUser([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => 'SecurePass123!',
    'phone' => '+62812345678',
    'role' => 'user',        // Optional, defaults to 'user'
    'status' => 'active'     // Optional, defaults to 'active'
]);
```

### Verify Email

```php
// After user clicks verification link
$userModel->markEmailAsVerified($userId);

// Check if verified
$user = $userModel->find($userId);
if ($userModel->isEmailVerified($user)) {
    echo "Email verified!";
}
```

### Ban User

```php
$userModel->changeStatus($userId, 'banned');

// User won't be able to login anymore
// findActiveByEmail() will return null
```

### Reactivate User

```php
$userModel->changeStatus($userId, 'active');
```

### Update User Profile

```php
$userModel->update($userId, [
    'name' => 'John Updated',
    'phone' => '+62812345679',
    'avatar' => 'https://example.com/avatar.jpg'
]);
```

### Check Last Login

```php
$user = $userModel->find($userId);
echo "Last login: " . $user['last_login_at'];
```

---

## 🗂️ Database Table Structure

```sql
users
├── id (primary key)
├── name (varchar 100)
├── email (varchar 255, unique)
├── password (varchar 255) ← Hidden in API response
├── phone (varchar 20, nullable)
├── avatar (text, nullable)
├── role (varchar 50, default: 'user')
├── status (varchar 20, default: 'active')
├── email_verified_at (timestamp, nullable)
├── remember_token (varchar 100, nullable) ← Hidden in API response
├── last_login_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## 🎨 Possible User Statuses

You can use any status, for example:

- **`active`** - Normal user (default)
- **`inactive`** - Temporarily disabled
- **`banned`** - Permanently blocked
- **`pending`** - Waiting for approval
- **`suspended`** - Under review

```php
// Custom status
$userModel->changeStatus($userId, 'pending');
$userModel->changeStatus($userId, 'suspended');
```

---

## 🔒 Security Features

### Password is Hidden

```php
$user = $userModel->find($userId);
// 'password' field is automatically removed from response
```

### Remember Token is Hidden

```php
// 'remember_token' is also hidden from API responses
```

### Only Active Users Can Login

```php
// findActiveByEmail() filters by status='active'
```

---

## 📊 Role-Based Access Control

```php
// Create admin user
$userModel->createUser([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => 'AdminPass123!',
    'role' => 'admin'
]);

// Create moderator
$userModel->createUser([
    'name' => 'Moderator',
    'email' => 'mod@example.com',
    'password' => 'ModPass123!',
    'role' => 'moderator'
]);

// Check role in controller
if ($user['role'] === 'admin') {
    // Admin-only actions
}
```

---

## ✨ Best Practices

1. **Always use createUser()** instead of create() for user registration
   - Automatically hashes password
   - Sets default role and status

2. **Use findActiveByEmail()** for login
   - Prevents inactive users from logging in

3. **Update last_login_at** on every successful login
   - Track user activity

4. **Verify email** before sensitive operations

   ```php
   if (!$userModel->isEmailVerified($user)) {
       throw new \Exception('Please verify your email first', 403);
   }
   ```

5. **Check status** before critical operations
   ```php
   if (!$userModel->isActive($user)) {
       throw new \Exception('Account is inactive', 403);
   }
   ```

---

## 🆗 Summary

| Feature                     | Status | Notes                    |
| --------------------------- | ------ | ------------------------ |
| **Enhanced table**          | ✅     | Migration created        |
| **Updated fillable**        | ✅     | All new fields included  |
| **Hidden sensitive fields** | ✅     | password, remember_token |
| **Helper methods**          | ✅     | 10+ new methods added    |
| **AuthController updated**  | ✅     | Uses new features        |
| **Backward compatible**     | ✅     | Old code still works     |

---

**Model is ready to use!** No need to delete or regenerate. ✨

If additional features are needed, just add a new method in `app/Models/User.php`.
