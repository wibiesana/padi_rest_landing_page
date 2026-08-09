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

### Retrieving Data (Progressive Query Building)

Padi ActiveRecord utilizes the `ModelQuery` builder which inherits all raw `Query` builder capabilities. Below is a comprehensive step-by-step example showing how a query pipeline is constructed progressively from basic building blocks to a fully composed query using every query method:

#### 1. Initialize Builder (`find()`)
Start the fluent query builder (table is automatically bound from the Model):
```php
$query = Product::find();
```

#### 2. Select Specific Columns (`select()`)
Continuing from `find()`, choose specific columns instead of retrieving `*`:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id']);
```

#### 3. Apply Initial Filter (`where()`)
Continuing from `select()`, append basic equality filtering criteria:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id'])
    ->where(['status' => 'active']);
```

#### 4. Add AND Condition with Operator (`andWhere()`)
Continuing from `where()`, chain an additional AND condition using operator syntax:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id'])
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0]);
```

#### 5. Add Alternative Condition (`orWhere()`)
Continuing from `andWhere()`, add an OR condition for featured items:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id'])
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->orWhere(['is_featured' => 1]);
```

#### 6. Add Range Filter (`whereBetween()`)
Continuing from `orWhere()`, restrict prices within a minimum and maximum range:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id'])
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->orWhere(['is_featured' => 1])
    ->whereBetween('price', 10.00, 500.00);
```

#### 7. Add Set Filter (`whereIn()`)
Continuing from `whereBetween()`, filter by a list of allowed category IDs:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id'])
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->orWhere(['is_featured' => 1])
    ->whereBetween('price', 10.00, 500.00)
    ->whereIn('category_id', [1, 3, 5, 8]);
```

#### 8. Add Null Checks (`whereNull()` / `whereNotNull()`)
Continuing from `whereIn()`, ensure non-deleted and verified items:
```php
$query = Product::find()
    ->select(['id', 'name', 'slug', 'price', 'status', 'category_id'])
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->orWhere(['is_featured' => 1])
    ->whereBetween('price', 10.00, 500.00)
    ->whereIn('category_id', [1, 3, 5, 8])
    ->whereNull('deleted_at');
```

#### 9. Add SQL Table Joins (`joinWith()`)
Continuing from `whereNull()`, perform SQL JOINs via relationship mappings:
```php
$query = Product::find()
    ->select(['products.*', 'c.name as category_name'])
    ->joinWith('category c')
    ->where(['products.status' => 'active'])
    ->andWhere(['products.stock', '>', 0])
    ->whereBetween('products.price', 10.00, 500.00)
    ->whereIn('products.category_id', [1, 3, 5, 8])
    ->whereNull('products.deleted_at');
```

#### 10. Add Sorting (`orderBy()`) & Limit (`limit()`)
Continuing from `joinWith()`, specify sorting criteria and limit result size:
```php
$query = Product::find()
    ->select(['products.*', 'c.name as category_name'])
    ->joinWith('category c')
    ->where(['products.status' => 'active'])
    ->andWhere(['products.stock', '>', 0])
    ->whereBetween('products.price', 10.00, 500.00)
    ->whereIn('products.category_id', [1, 3, 5, 8])
    ->whereNull('products.deleted_at')
    ->orderBy('products.price DESC')
    ->limit(10);
```

#### 11. Add Relationship Eager Loading (`with()`)
Continuing from `limit()`, eagerly load related data objects to prevent N+1 queries:
```php
$query = Product::find()
    ->select(['products.*', 'c.name as category_name'])
    ->joinWith('category c')
    ->where(['products.status' => 'active'])
    ->andWhere(['products.stock', '>', 0])
    ->whereBetween('products.price', 10.00, 500.00)
    ->whereIn('products.category_id', [1, 3, 5, 8])
    ->whereNull('products.deleted_at')
    ->orderBy('products.price DESC')
    ->limit(10)
    ->with('category', 'tags');
```

#### 12. Execute Terminal Methods

Once the complete query pipeline is composed, invoke one of the terminal methods:

```php
// A. Fetch all matching records (array of associative arrays)
$products = Product::find()
    ->select(['products.*'])
    ->where(['products.status' => 'active'])
    ->andWhere(['products.stock', '>', 0])
    ->whereBetween('products.price', 10.00, 500.00)
    ->whereIn('products.category_id', [1, 3, 5, 8])
    ->whereNull('products.deleted_at')
    ->orderBy('products.price DESC')
    ->limit(10)
    ->with('category', 'tags')
    ->all();

// B. Fetch single row (associative array or null)
$product = Product::find()
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->whereBetween('price', 10.00, 500.00)
    ->with('category', 'tags')
    ->one();

// C. Count total records matching criteria
$totalActive = Product::find()
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->whereBetween('price', 10.00, 500.00)
    ->count();

// D. Fetch paginated result set with metadata
$paginated = Product::find()
    ->where(['status' => 'active'])
    ->andWhere(['stock', '>', 0])
    ->whereBetween('price', 10.00, 500.00)
    ->orderBy('price DESC')
    ->with('category', 'tags')
    ->paginate(page: 1, perPage: 15);
```


---

### Quick Helpers (By Primary Key / Direct Static Call)

In addition to the fluent builder pattern above, Padi ActiveRecord provides concise static helper methods:

```php
// Find a single record by primary key
$product = Product::findOne(1);

// Find a single record by primary key or automatically throw HTTP 404 Exception if not found
$product = Product::findOrFail(1);

// Find multiple records by primary keys or short condition array
$products = Product::findAll([1, 2, 3]);
$activeProducts = Product::findAll(['status' => 'active']);

// Global Search (automatically searches across $fillable columns and joined display fields)
$searchResults = Product::search($keyword)->paginate(1, 25);
```



> [!NOTE]
> ### 💡 `findOrFail()` vs `findOrFailByPk()`
> While both helpers search for a single record by primary key and automatically throw an HTTP 404 Exception if the record doesn't exist, they are designed for different calling styles:
> 
> * **`Product::findOrFail($id)`** (Static Helper): Called statically directly on the Model class. It is simple and concise, but **cannot be chained** with relationship eager loading.
>   ```php
>   $product = Product::findOrFail(5);
>   ```
> * **`Product::find()->findOrFailByPk($id)`** (Builder Helper): Called on the fluent `ModelQuery` builder returned by `find()`. It is perfect when you need to **eager load relations** or apply other custom scopes before fetching the record.
>   ```php
>   $product = Product::find()->with('category', 'tags')->findOrFailByPk(5);
>   ```

### ✍️ Writing Data (Create, Update, Delete)

Below is a step-by-step guide and clear real-world examples for **Create**, **Update**, and **Delete** operations in Padi Framework Controllers & Models. The framework features **Automatic Response Formatting**, meaning you can directly `return` models, arrays, or scalars without manually calling response helpers.

> [!NOTE]
> For complete details on response structure options, manual HTTP headers, API Resources, or custom status formatting, see the [Response Structure Guide](./RESPONSE_STRUCTURE.md).

#### 1. ➕ Create (Inserting New Records)

To create a new record, validate incoming data using `$this->validate()` before calling `create()`. Set the HTTP status code (e.g. `201 Created`) via `$this->response->status(201)` and directly `return` the created model.

**Controller Example (`ProductController.php`):**

```php
use App\Models\Product;
use Wibiesana\Padi\Core\Controller;

class ProductController extends Controller
{
    public function store()
    {
        // 1. Validate incoming request data
        $validated = $this->validate([
            'name'        => 'required|string|max:100|unique:products,name',
            'price'       => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status'      => 'string|in:active,inactive',
        ]);

        // 2. Insert into database using validated data
        // Note: create() returns the newly created primary key ID (int|string), not the model object
        $productId = (new Product())->create($validated);

        // 3. Fetch the full record with database-generated fields (id, timestamps, default values)
        $product = Product::findOne($productId);

        // 4. Set optional HTTP Status Code 201 Created
        $this->response->status(201);

        // 5. Return the new model directly (Framework auto-formats to standard JSON)
        return $product;
    }
}
```

---

#### 2. ✏️ Update (Modifying Records)

To update a record, verify its existence using `Product::findOrFail($id)`, validate the input, invoke `update()`, and return the updated model directly.

**Controller Example (`ProductController.php`):**

```php
public function update($id)
{
    // 1. Ensure the record exists (throws 404 if missing)
    Product::findOrFail($id);

    // 2. Validate input payload (ignore unique constraint check for current record ID)
    $validated = $this->validate([
        'name'  => 'string|max:100|unique:products,name,' . $id,
        'price' => 'numeric|min:0',
    ]);

    // 3. Execute update operation
    (new Product())->update($id, $validated);

    // 4. Return updated record directly
    return Product::findOne($id);
}
```

---

#### 3. 🗑️ Delete (Removing Records)

You can remove a single record by primary key or perform bulk deletions based on custom filter criteria.

**A. Delete a Single Record (By ID):**

```php
public function destroy($id)
{
    // 1. Ensure the record exists
    Product::findOrFail($id);

    // 2. Delete the record
    (new Product())->delete($id);

    // 3. Return response array directly
    return [
        'message' => 'Product deleted successfully'
    ];
}
```

**B. Delete Multiple Records (Bulk Delete):**

```php
// Delete all products with 'discontinued' status
$deletedRows = Product::deleteAll(['status' => 'discontinued']);

// Delete products matching an array of IDs [1, 2, 3]
$deletedRows = Product::deleteAll(['id' => [1, 2, 3]]);
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

// Memory-Efficient Batch Retrieval (v2.0.13)
// Useful for processing huge datasets without running out of RAM
foreach (Product::find()->where(['status' => 'active'])->batch(100) as $products) {
    // Yields array of 100 products per iteration
    foreach ($products as $product) {
        // ...
    }
}

// Memory-Efficient Each Retrieval (v2.0.13)
// Iterates through records one by one while chunking fetches in the background
foreach (Product::find()->each(100) as $product) {
    // Yields single product array
}
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
$users = User::find()->with('posts')->all();

// 2. Multiple relations
$users = User::find()->with(['posts', 'profile', 'roles'])->all();

// 3. Nested eager loading (dot notation)
$users = User::find()->with('posts.tags')->all();

// 4. Specific columns (colon notation)
$users = User::find()->with('profile:user_id,bio,avatar')->all();

// 5. Variadic calling style (v2.0.11)
$users = User::find()->with('posts', 'profile', 'roles')->all();
```

### ⚡ Complicated Real-World Eager Loading & Query Chaining

Here is an advanced real-world orchestration combining complex filters, custom selects, sorting, and nested eager loading with column constraints:

```php
$query = Post::find()
    // 1. Select specific columns from the primary table
    ->select(['id', 'title', 'slug', 'user_id', 'status', 'published_at'])
    
    // 2. Perform variadic eager loading with nested relations & specific column restrictions
    ->with(
        'comments.author:id,username,avatar',  // Nested + specific columns
        'user:id,name,email',                   // Simple + specific columns
        'tags'                                  // Full relation
    )
    
    // 3. Apply complex operators & multiple filtering criteria
    ->where(['status' => 'published'])
    ->andWhere(['views', '>=', 150])
    ->whereIn('category_id', [1, 3, 5])
    
    // 4. Sort the result set
    ->orderBy('published_at DESC');

// Then, execute the query using one of these terminal methods:

// A) Paginate the results (returns formatted pagination metadata + data array)
$paginated = $query->paginate(page: 1, perPage: 25);

// B) Get all matching records (returns array of record arrays)
$posts = $query->all();

// C) Get the first matching record (returns a single record array or null)
$post = $query->one();
```

This single fluent pipeline runs high-performance queries, executes the minimum required queries for relationship binding, respects the `$hidden` model configuration, and triggers lifecycle `afterLoad()` hooks automatically.

### 🔗 SQL JOINs via Relations (`joinWith()`)

While `with()` executes separate queries for relationship loading (eager loading), `joinWith()` adds actual **SQL JOIN clauses** into your main query. This allows you to perform operations like filtering, sorting, grouping, or aggregates based on columns inside the related tables.

```php
// 1. Join with relation using alias and nested paths (v2.0.13)
$orders = Order::find()
    ->select([
        'order.*',
        'customer.name as customer_name',
        'COUNT(order_item.id) as total_items'
    ])
    ->joinWith([
        'customer c',           // LEFT JOIN customers c ON ...
        'orderItems oi',        // LEFT JOIN order_items oi ON ...
        'orderItems.product p'  // LEFT JOIN products p ON ... (nested)
    ])
    ->where(['order.status' => 'completed'])
    ->andWhere(['p.category_id' => [1, 2, 3]])
    ->groupBy(['order.id', 'customer.name'])
    ->having(['>', 'COUNT(order_item.id)', 5])
    ->all();
```

* **Default JOIN type** is `LEFT JOIN`. You can change it by passing the second parameter:
  ```php
  $products = Product::find()->joinWith('category', 'INNER JOIN')->all();
  ```
* **Eager Loading compatibility**: `joinWith()` does NOT automatically assign relation records to rows. To load data models into relations (e.g. `$row['category']`), combine it with `with()` or use specific `select()` mapping.

### 🗃️ Compatibility Methods (`asArray()`)

For ease of transition from other PHP ORMs, `asArray()` is provided. Since Padi ActiveRecord always returns records as plain associative arrays, this method acts as a fluent **no-op**:

```php
$products = Product::find()->asArray()->all();
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

1. **Use Fluent ModelQuery**: For complex chaining, use static `Model::find()` which returns a `ModelQuery` builder instance bridging raw SQL queries with ActiveRecord models.
2. **Use findOrFail()**: In controllers, prefer `findOrFail()` over `find()` + manual null check for cleaner code.
3. **Hide Sensitive Data**: Always add `password`, `token`, etc. to the `$hidden` array.
4. **Reference in beforeSave**: The `$data` parameter is passed by reference (`&$data`). Use it to modify values before they hit the database.
5. **Fail Fast**: Return `false` in `beforeDelete` if a record has active dependencies to maintain data integrity.
6. **Use upsert() for sync**: When importing or syncing data, prefer `upsert()` over separate find-then-update logic.

---
