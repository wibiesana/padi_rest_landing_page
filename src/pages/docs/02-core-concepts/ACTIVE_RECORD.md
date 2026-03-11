# 🗃️ ActiveRecord Guide

## 💎 The Heart of Data Persistence

The `ActiveRecord` class is the **Industrial-Grade Backbone** of the Padi REST API. More than just an ORM, it is a high-performance engine that automates complex database orchestrations, relationships, and auditing—allowing you to interact with your data through a clean, fluent, and professional interface.

---

## 📋 Table of Contents

- [💎 The Heart of Data Persistence](#the-heart-of-data-persistence)
- [Core Concepts](#core-concepts)
- [Basic CRUD](#basic-crud)
- [Pagination](#pagination)
- [Advanced Operations](#advanced-operations)
- [Relationships & Eager Loading](#relationships-eager-loading)
- [Automatic Relationship Detection](#automatic-relationship-detection)
- [Model Security (Hidden Fields)](#model-security-hidden-fields)
- [Automatic Auditing](#automatic-auditing)
- [Default Ordering](#default-ordering)
- [Lifecycle Hooks (Yii Style)](#lifecycle-hooks)
- [Database Connection Switching](#database-connection-switching)
- [Worker Mode & Shared Hosting (v2.0.3)](#worker-mode-shared-hosting-v203)

---


## 🛠️ Core Concepts

### Model Definition

Every model in the system should extend `Wibiesana\Padi\Core\ActiveRecord`. The framework follows a **Base vs. Concrete** architecture:

1. **Base Models (`app/Models/Base/`)**: Auto-managed and overwritten during regeneration. They contain schema mappings and relationship detection logic.
2. **Concrete Models (`app/Models/`)**: Inherit from Base models. They are created once and never overwritten, making them the safe place for your custom logic.


```php
namespace App\Models;

use Wibiesana\Padi\Core\ActiveRecord;

class Product extends ActiveRecord
{
    protected string $table = 'products';
    protected string|array $primaryKey = 'id';
    protected array $fillable = ['name', 'price', 'description'];
    protected array $hidden = ['deleted_at'];
}
```

---

## 📦 Basic CRUD

### Retrieving Data

```php
// Find by ID
$product = (new Product())->find(1);

// Get all records
$all = (new Product())->all();

// Filtered results
$active = (new Product())->where(['status' => 'active']);

// Find or throw 404 (v2.0.3)
$product = (new Product())->findOrFail(1);

// Count records (v2.0.3)
$total = (new Product())->count();
$activeCount = (new Product())->count(['status' => 'active']);

// Global Search (v2.0.3+)
// Automatically searches through all $fillable fields
$results = (new Product())->searchPaginate($keyword);
```

### Writing Data

```php
// Create
$id = (new Product())->create([
    'name' => 'Premium Coffee',
    'price' => 15.00
]);

// Update
(new Product())->update($id, ['price' => 14.50]);

// Delete
(new Product())->delete($id);
```

---

## 📄 Pagination

The `paginate()` method automatically handles offset calculations, record counting, and returns a structured metadata object compatible with most frontend tables.

```php
// Get page from request, default to 1
$page = (int)$this->request->query('page', 1);
$perPage = (int)$this->request->query('per_page', 15);

// 1. Simple pagination
$results = (new Product())->paginate($page, $perPage);

// 2. Pagination with conditions and custom ordering
$results = (new Product())->paginate(
    $page,
    $perPage,
    ['status' => 'active'],
    'created_at DESC'
);
```

### Response Structure

The framework returns a standardized object:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 50,
    "per_page": 15,
    "current_page": 1,
    "last_page": 4,
    "from": 1,
    "to": 15
  }
}
```

---

## 🚀 Advanced Operations

### Batch Operations

Perform high-performance bulk inserts or updates.

```php
// Batch Insert
(new Product())->batchInsert([
    ['name' => 'Item A', 'price' => 10],
    ['name' => 'Item B', 'price' => 20],
]);

// Batch Insert with custom chunk size (v2.0.3)
// Automatically splits into multiple INSERT statements
// to respect max_allowed_packet limit on shared hosting
(new Product())->batchInsert($thousandItems, chunkSize: 200);

// Update All matching conditions
$affectedRows = (new Product())->updateAll(
    ['status' => 'discontinued'],
    ['stock' => 0]
);

// Upsert - Insert or Update on duplicate key (v2.0.3, MariaDB/MySQL)
(new Product())->upsert(
    ['sku' => 'PRD-001', 'name' => 'Coffee', 'price' => 15.00],
    ['name', 'price'] // columns to update on duplicate
);
```

### Composite Primary Keys

The framework supports composite keys for complex database schemas.

```php
protected string|array $primaryKey = ['user_id', 'role_id'];

// Finding a record with composite keys
$record = $model->find(['user_id' => 1, 'role_id' => 2]);
// Or using underscore notation
$record = $model->find("1_2");
```

### Raw Queries

When the builder isn't enough, execute raw SQL safely.

```php
$results = $model->query("SELECT * FROM products WHERE price > ?", [100]);
```

---

## 🔗 Relationships & Eager Loading

### Defining Relations

```php
class Category extends ActiveRecord {
    public function products() {
        return $this->hasMany(Product::class, 'category_id');
    }
}

class Product extends ActiveRecord {
    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function userProfile() {
        return $this->hasOne(UserProfile::class, 'user_id');
    }

    public function tags() {
        return $this->belongsToMany(
            Tag::class,
            'product_tags', // Pivot table
            'product_id',   // Foreign key for this model
            'tag_id'        // Foreign key for related model
        );
    }
}
```

### 🧠 Automatic Relationship Detection

When using the [Padi CLI Generator](CLI_INTERFACE.md), relationships are automatically detected and written into the **Base Model**:

- **`belongsTo`**: Detected from **Database Foreign Keys** (mapping columns like `category_id` to their respective tables).
- **`hasMany`**: Detected when another table has a foreign key pointing to this table (and it's not unique).
- **`hasOne`**: Detected when another table has a **Unique** foreign key pointing to this table.
- **`belongsToMany`**: Detected from pivot tables (tables containing exactly two foreign keys connecting two models).
- **Naming**: The generator automatically pluralizes names for `hasMany` and `belongsToMany` (e.g., `user->posts()`, `product->tags()`) and keeps them singular for `hasOne`.

#### Example Generated Output:

```php
// app/Models/Base/User.php
abstract class User extends ActiveRecord {
    // 1. hasMany (Detected from posts.user_id)
    public function posts() {
        return $this->hasMany(Post::class, 'user_id');
    }

    // 2. hasOne (Detected from profiles.user_id + UNIQUE index)
    public function profile() {
        return $this->hasOne(Profile::class, 'user_id');
    }

    // 3. belongsToMany (Detected from user_roles pivot table)
    public function roles() {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }
}

// app/Models/Base/Post.php
abstract class Post extends ActiveRecord {
    // 4. belongsTo (Detected from post's own user_id foreign key)
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
```

### Eager Loading (N+1 Solution)

Use `with()` to load relationships efficiently.

```php
// 1. Basic eager loading
$users = (new User())->with('posts')->all();

// 2. Multiple relations
$users = (new User())->with(['posts', 'profile', 'roles'])->all();

// 3. Nested eager loading (dot notation)
$users = (new User())->with('posts.tags')->all();

// 4. Specific columns (colon notation)
$users = (new User())->with('profile:user_id,bio,avatar')->all();
```

---

## 🔒 Model Security (Hidden Fields)

Prevent sensitive data from leaking into your API responses by defining the `$hidden` property. These fields are automatically removed during `find()`, `all()`, `where()`, and `paginate()`.

```php
class User extends ActiveRecord {
    protected array $hidden = [
        'password',
        'remember_token',
        'api_key'
    ];
}
```

---

## 🛡️ Automatic Auditing

Enabled by default (`$useAudit = true`), the framework automatically populates audit fields.

| Field        | Description                                    |
| :----------- | :--------------------------------------------- |
| `created_at` | Timestamp when record is created.              |
| `updated_at` | Timestamp when record is modified.             |
| `created_by` | User ID from `Auth::userId()` on creation.     |
| `updated_by` | User ID from `Auth::userId()` on modification. |

### Configuration

```php
class MyModel extends ActiveRecord {
    protected bool $useAudit = true;
    protected string $timestampFormat = 'unix'; // or 'datetime'

    // Custom field mapping
    protected array $auditFields = [
        'created_at' => 'created_on',
        'created_by' => 'author_id'
    ];
}
```

---

## 🔢 Default Ordering

You can define a global default order for your model so you don't have to specify it in every query.

```php
class Product extends ActiveRecord {
    // Automatically applies "ORDER BY sort_order ASC" to all queries
    protected ?string $defaultOrder = 'sort_order ASC';
}
```

---

## 🔄 Lifecycle Hooks

Inspired by **Yii Framework**, these hooks allow you to intercept data at various stages.

| Hook           | Execution Time            | Purpose                                     |
| :------------- | :------------------------ | :------------------------------------------ |
| `afterLoad`    | After fetching from DB    | Data transformation (e.g. JSON to Array).   |
| `beforeSave`   | Before INSERT/UPDATE      | Validation, hashing, calculations.          |
| `afterSave`    | After successful save     | Logging, emails, secondary updates.         |
| `beforeDelete` | Before record deletion    | Dependency checks, blocking system records. |
| `afterDelete`  | After successful deletion | File cleanup, log archival.                 |

### Example: Password Hashing

```php
protected function beforeSave(array &$data, bool $insert): bool
{
    if (isset($data['password'])) {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
    }
    return true; // Return false to abort save
}
```

### Example: Post-Load Processing

```php
public function afterLoad(array &$items): void
{
    foreach ($items as &$item) {
        $item['full_url'] = "https://cdn.com/" . $item['path'];
    }
}
```

---

## 🌐 Database Connection Switching

Support for multi-database architectures.

```php
class ExternalModel extends ActiveRecord {
    // Uses the 'pgsql' connection defined in config/database.php
    protected ?string $connection = 'pgsql';
}
```

---

## 🌐 Worker Mode & Shared Hosting (v2.0.3)

### Column Cache Management

In FrankenPHP worker mode, ActiveRecord caches table column metadata in a static array for performance. The cache persists across requests but is automatically cleared during graceful worker restart.

```php
// Manual cache clear (rarely needed)
ActiveRecord::clearColumnsCache();
```

### Batch Insert Chunking

Shared hosting often has low `max_allowed_packet` limits. The `batchInsert()` method automatically chunks large datasets to avoid exceeding these limits.

```php
// Default chunk size: 500 rows per INSERT
(new Product())->batchInsert($largeDataset);

// Custom chunk size for constrained environments
(new Product())->batchInsert($largeDataset, chunkSize: 100);
```

### Upsert (INSERT ON DUPLICATE KEY UPDATE)

Atomic insert-or-update for MariaDB/MySQL:

```php
// Insert new record, or update 'name' and 'price' if duplicate key
(new Product())->upsert(
    ['sku' => 'PRD-001', 'name' => 'Premium Coffee', 'price' => 15.00],
    ['name', 'price'] // columns to update on conflict
);

// Update ALL columns on conflict (omit second parameter)
(new Product())->upsert(['sku' => 'PRD-001', 'name' => 'Coffee', 'price' => 14.50]);
```

---

## 💡 Best Practices

1. **Use findQuery()**: For complex chaining, use `$model->findQuery()` which returns a `Query` builder instance.
2. **Use findOrFail()**: In controllers, prefer `findOrFail()` over `find()` + manual null check for cleaner code.
3. **Hide Sensitive Data**: Always add `password`, `token`, etc. to the `$hidden` array.
4. **Reference in beforeSave**: The `$data` parameter is passed by reference (`&$data`). Use it to modify values before they hit the database.
5. **Fail Fast**: Return `false` in `beforeDelete` if a record has active dependencies to maintain data integrity.
6. **Use upsert() for sync**: When importing or syncing data, prefer `upsert()` over separate find-then-update logic.

---
