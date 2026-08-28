# 🔍 Query Builder Documentation

## ⚡ High-Performance SQL Orchestration

The `Wibiesana\Padi\Core\Query` class is an **Industrial-Grade Data Engine** designed for maximum speed and security. It enables you to construct complex SQL queries with surgical precision through a fluent, readable interface—protecting you from injection while maintaining the flexibility of raw SQL.

---

## 📋 Table of Contents

- [⚡ High-Performance SQL Orchestration](#high-performance-sql-orchestration)
- [🚀 Getting Started](#getting-started)
- [🛠️ Query Methods](#query-methods)
- [🏃 Query Execution](#query-execution)
- [💡 Real-World Examples](#real-world-examples)
- [🔒 Security](#security)
- [🌐 Worker Mode Notes (v2.0.3)](#worker-mode-notes-v203)
- [🔎 Smart Filtering (`filterWhere`)](#smart-filtering-filterwhere)
- [🔍 Subquery Existence (`whereExists`)](#subquery-existence-whereexists)

---

## 🚀 Getting Started

You can use the Query Builder through ActiveRecord or directly as a standalone query builder.

### 1. Through ActiveRecord (Recommended)

This method returns a `ModelQuery` instance which automatically sets the table name and database connection based on the ActiveRecord definition, and ensures results are processed through model lifecycle hooks and eager loading.

```php
use App\Models\Post;

// Using static find() method
$query = Post::find();
```

### 2. Standalone Usage

Use this if you want to query a table that does not have a Model.

```php
use Wibiesana\Padi\Core\Query;

$query = Query::find()->from('some_table_name');
```

---

## 🧩 Progressive Query Building

Padi's Query Builder is designed for fluent method chaining. Below is a step-by-step demonstration showing how a raw SQL query pipeline is constructed progressively from ground up:

#### 1. Initialize & Set Target Table (`find()`, `from()`)
Start the builder and bind the target database table:
```php
$query = Query::find()->from('orders');
```

#### 2. Specify Select Columns (`select()`)
Continuing from step 1, define specific columns to retrieve instead of `*`:
```php
$query = Query::find()
    ->from('orders')
    ->select(['id', 'customer_id', 'total_amount', 'status', 'created_at']);
```

#### 3. Apply Base Filter (`where()`)
Continuing from step 2, attach the initial filtering clause:
```php
$query = Query::find()
    ->from('orders')
    ->select(['id', 'customer_id', 'total_amount', 'status', 'created_at'])
    ->where(['status' => 'completed']);
```

#### 4. Add Range Filter (`whereBetween()`)
Continuing from step 3, filter records created within a specific date range:
```php
$query = Query::find()
    ->from('orders')
    ->select(['id', 'customer_id', 'total_amount', 'status', 'created_at'])
    ->where(['status' => 'completed'])
    ->whereBetween('created_at', '2026-01-01', '2026-12-31');
```

#### 5. Add Value Filter with Operator (`andWhere()`)
Continuing from step 4, chain additional filter conditions using operator comparison:
```php
$query = Query::find()
    ->from('orders')
    ->select(['id', 'customer_id', 'total_amount', 'status', 'created_at'])
    ->where(['status' => 'completed'])
    ->whereBetween('created_at', '2026-01-01', '2026-12-31')
    ->andWhere(['total_amount', '>=', 100.00]);
```

#### 6. Add Table Join (`leftJoin()`)
Continuing from step 5, join a related table to access external columns:
```php
$query = Query::find()
    ->from('orders')
    ->select(['orders.id', 'orders.total_amount', 'customers.name as customer_name'])
    ->leftJoin('customers', 'orders.customer_id = customers.id')
    ->where(['orders.status' => 'completed'])
    ->whereBetween('orders.created_at', '2026-01-01', '2026-12-31')
    ->andWhere(['orders.total_amount', '>=', 100.00]);
```

#### 7. Add Sorting & Pagination Limit (`orderBy()`, `limit()`)
Continuing from step 6, apply ordering and restrict the result count:
```php
$query = Query::find()
    ->from('orders')
    ->select(['orders.id', 'orders.total_amount', 'customers.name as customer_name'])
    ->leftJoin('customers', 'orders.customer_id = customers.id')
    ->where(['orders.status' => 'completed'])
    ->whereBetween('orders.created_at', '2026-01-01', '2026-12-31')
    ->andWhere(['orders.total_amount', '>=', 100.00])
    ->orderBy('orders.total_amount DESC')
    ->limit(10);
```

#### 8. Execute Terminal Methods

Once the pipeline is composed, invoke one of the terminal execution methods:

```php
// A. Execute & fetch all matching rows (array of associative arrays)
$orders = Query::find()
    ->from('orders')
    ->select(['orders.id', 'orders.total_amount', 'customers.name as customer_name'])
    ->leftJoin('customers', 'orders.customer_id = customers.id')
    ->where(['orders.status' => 'completed'])
    ->whereBetween('orders.created_at', '2026-01-01', '2026-12-31')
    ->andWhere(['orders.total_amount', '>=', 100.00])
    ->orderBy('orders.total_amount DESC')
    ->limit(10)
    ->all();

// B. Fetch single row (associative array or null)
$firstOrder = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->orderBy('id ASC')
    ->one();

// C. Fetch aggregated count
$totalCompleted = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->count();

// D. Fetch paginated result set with metadata
$paginatedOrders = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->orderBy('id DESC')
    ->paginate(page: 1, perPage: 20);
```


---

## 🛠️ Query Methods Reference

Below is a detailed breakdown of all builder methods. Each method demonstrates how it appends to a continuous query pipeline:

### `select($columns)` & `addSelect($columns)`

Specifies columns to retrieve (defaults to `*`), or appends columns to an existing query.

```php
// Step 1: Base select
$query = Query::find()->from('orders')->select(['id', 'order_number']);

// Step 2: Dynamically add more columns later in the code
$query->addSelect(['total_amount', 'status']);
```

### `distinct()`

Adds the `DISTINCT` keyword to suppress duplicate rows.

```php
$query = Query::find()
    ->from('orders')
    ->select(['status'])
    ->distinct();
```

### `from($table)`

Specifies the target table name.

```php
$query = Query::find()->from('orders');
```

### `where($condition, $params = [])`

Adds the initial WHERE clause. Supports key-value pairs, operator syntax `[col, op, val]`, `LIKE`, `IN`, `BETWEEN`, and `NULL`.

```php
// Step 1: Base table selection
$query = Query::find()->from('orders');

// Step 2: Apply primary status condition
$query->where(['status' => 'completed']);

// Step 3: Add operator comparison
$query->andWhere(['total_amount', '>=', 100.00]);
```

### `andWhere()` & `orWhere()`

Chains additional filtering conditions using SQL `AND` or `OR`.

```php
$query = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->andWhere(['total_amount', '>=', 100.00])
    ->orWhere(['is_priority' => 1]);
```

### Quick Where Helpers (`whereIn`, `whereBetween`, `whereNull`, etc.)

Expressive shortcuts for standard SQL conditional filters:

```php
$query = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->whereIn('payment_method', ['credit_card', 'bank_transfer'])  // WHERE payment_method IN (...)
    ->whereNotIn('flag', ['cancelled', 'refunded'])                // WHERE flag NOT IN (...)
    ->whereBetween('created_at', '2026-01-01', '2026-12-31')      // WHERE created_at BETWEEN ... AND ...
    ->whereNotBetween('total_amount', 0, 10)                        // WHERE total_amount NOT BETWEEN ...
    ->whereNull('deleted_at')                                      // WHERE deleted_at IS NULL
    ->whereNotNull('shipped_at');                                  // WHERE shipped_at IS NOT NULL
```

### `whereRaw($expression, $params)` (v2.0.3)

Injects custom raw SQL WHERE conditions safely using bound parameters to prevent SQL injection:

```php
$query = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->whereRaw('DATEDIFF(NOW(), created_at) <= :days', [':days' => 30]);
```

### `filterWhere()`, `andFilterWhere()`, `orFilterWhere()` (v2.1.11)

Same as `where()` / `andWhere()` / `orWhere()` but **automatically skip conditions where value is `null`, `''`, or `[]`**.

The ideal pattern for optional REST API filter parameters — no more manual `if ($value)` guards.

```php
// ❌ Before: verbose manual null-checks
$query = Query::find()->from('violations');
if ($search) $query->andWhere(['note', 'LIKE', $search]);
if ($status) $query->andWhere(['status' => $status]);
if ($typeId) $query->andWhere(['violation_type_id' => $typeId]);

// ✅ After: declarative, all in one chain
$result = Query::find()
    ->from('violations')
    ->andFilterWhere(['note', 'LIKE', $search])          // skipped if null/''
    ->andFilterWhere(['status' => $status])              // skipped if null/''
    ->andFilterWhere(['violation_type_id' => $typeId])   // skipped if null/''
    ->paginate($perPage, $page);
```

**Supported condition formats:**

```php
// Hash format — per-key filtering
->filterWhere(['status' => $status, 'type_id' => $typeId]);
// → builds WHERE only for non-null/non-empty values

// Operator format — entire condition skipped if value is empty
->andFilterWhere(['name', 'LIKE', $search]);
->andFilterWhere(['ids', 'IN', $idList]);  // skipped if $idList = []

// OR group — sub-conditions pruned recursively; entire group removed if all empty
->filterWhere(['OR',
    ['name', 'LIKE', $keyword],
    ['code', 'LIKE', $keyword],
]);
```

### `whereExists($subquery)` and `whereNotExists($subquery)` (v2.1.11)

Checks whether a subquery returns any rows. More efficient than `WHERE id IN (SELECT ...)` for large datasets because the database **stops at the first matching row**.

Available in 6 variants: `whereExists`, `whereNotExists`, `andWhereExists`, `andWhereNotExists`, `orWhereExists`, `orWhereNotExists`.

```php
use Wibiesana\Padi\Core\Query;

// Students who have at least one violation:
$students = Query::find()
    ->from('students')
    ->whereExists(
        (new Query())->from('violations')->where('violations.student_id = students.id')
    )
    ->all();
// SQL: SELECT * FROM students
//      WHERE EXISTS (SELECT 1 FROM violations WHERE violations.student_id = students.id)

// Students with NO violations:
$cleanStudents = Query::find()
    ->from('students')
    ->whereNotExists(
        (new Query())->from('violations')->where('violations.student_id = students.id')
    )
    ->paginate(25, $page);
// SQL: WHERE NOT EXISTS (SELECT 1 FROM violations WHERE ...)

// Combine with other conditions:
$result = Query::find()
    ->from('students')
    ->where(['class' => '10A'])
    ->andWhereExists(
        (new Query())->from('violations')
                     ->where('violations.student_id = students.id')
                     ->andWhere(['violations.type_id' => 1])
    )
    ->orderBy('name ASC')
    ->all();
// SQL: WHERE class = '10A'
//      AND EXISTS (SELECT 1 FROM violations WHERE student_id = students.id AND type_id = 1)
```

> [!TIP]
> **`EXISTS` vs `IN`**: Use `EXISTS` when checking relationship existence (e.g. "has at least one order"). Use `IN` when you need to match against a small fixed list of values.

**When used via `Model::find()`**, all 6 EXISTS methods are inherited automatically:

```php
use App\Models\Student;

// Via ModelQuery — with eager loading, pagination, hidden fields, afterLoad hooks:
$result = Student::find()
    ->with('class', 'violations')
    ->whereExists(
        (new Query())->from('violations')->where('violations.student_id = students.id')
    )
    ->paginate(25, $page);
```

### `OR LIKE` & `AND LIKE` Multi-Column Search Shorthand (v2.1.11)

Search for a single keyword across multiple columns simultaneously without manually writing nested `OR` conditions:

```php
// Search keyword across name, email, and phone:
$query->where(['OR LIKE', ['name', 'email', 'phone'], $search]);
// SQL: WHERE (name LIKE '%search%' OR email LIKE '%search%' OR phone LIKE '%search%')

// When combined with filterWhere(), automatically skips if $search is null or '':
$query->andFilterWhere(['OR LIKE', ['title', 'content', 'author_name'], $keyword]);

// Supports negation and AND grouping:
$query->where(['AND LIKE', ['first_name', 'last_name'], 'john']);
$query->where(['OR NOT LIKE', ['sku', 'barcode'], 'TMP-']);
```

### `whereNot()`, `andWhereNot()`, `orWhereNot()` & `['NOT', [...]]` (v2.1.11)

Negate entire condition blocks or hash arrays with clean syntax:

```php
// Shorthand helpers:
$query->whereNot(['status' => 'banned']);
// SQL: WHERE NOT (status = 'banned')

$query->where(['role' => 'editor'])
      ->andWhereNot(['id' => [1, 2, 3]])
      ->orWhereNot(['is_verified' => 1]);

// Array syntax:
$query->where(['NOT', ['status' => ['suspended', 'deleted']]]);
// SQL: WHERE NOT (status IN ('suspended', 'deleted'))
```

### Row Locking: `forUpdate()` & `forShare()` (v2.1.11)

Pessimistic concurrency control for critical transactions (e.g. e-commerce checkout, wallet balance, inventory deduction):

```php
use App\Models\Wallet;
use Wibiesana\Padi\Core\Database;

// Exclusive lock: prevents concurrent transactions from modifying or locking selected rows
Database::transaction(function() use ($userId, $transferAmount) {
    $wallet = Wallet::find()
        ->where(['user_id' => $userId])
        ->forUpdate()
        ->one();

    if ($wallet['balance'] < $transferAmount) {
        throw new \Exception("Insufficient balance", 400);
    }

    Wallet::update($wallet['id'], [
        'balance' => $wallet['balance'] - $transferAmount
    ]);
});
// SQL: SELECT * FROM wallets WHERE user_id = ? FOR UPDATE

// Shared lock: allows reads by others, but prevents writes/deletes
$product = Product::find()->where(['id' => 5])->forShare()->one();

// Custom lock clause:
$orders = Order::find()->where(['status' => 'pending'])->lock('LOCK IN SHARE MODE')->all();
```

### Table Joins (`leftJoin`, `rightJoin`, `innerJoin`, `join`)

Connects external database tables using explicit JOIN clauses:

```php
$query = Query::find()
    ->from('orders')
    ->select(['orders.id', 'orders.total_amount', 'c.name as customer_name', 'p.status as payment_status'])
    ->leftJoin('customers c', 'orders.customer_id = c.id')
    ->innerJoin('payments p', 'orders.id = p.order_id')
    ->rightJoin('shipping_addresses s', 'orders.shipping_id = s.id')
    ->where(['orders.status' => 'completed']);
```

### `orderBy($columns)` & `addOrderBy($columns)`

Specifies and appends sorting columns.

```php
$query = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->orderBy('created_at DESC')
    ->addOrderBy('total_amount DESC');
```

### `groupBy($columns)` & `addGroupBy($columns)`

Applies aggregation grouping across table columns:

```php
$query = Query::find()
    ->from('orders')
    ->select(['customer_id', 'status', 'COUNT(id) as total_orders', 'SUM(total_amount) as total_revenue'])
    ->groupBy('customer_id')
    ->addGroupBy('status');
```

### `having($condition)`, `andHaving()`, `orHaving()` (v2.0.13)

Filters aggregated group results using SQL `HAVING` clauses:

```php
$query = Query::find()
    ->from('orders')
    ->select(['customer_id', 'COUNT(id) as total_orders', 'SUM(total_amount) as total_spent'])
    ->groupBy('customer_id')
    ->having(['>', 'COUNT(id)', 3])
    ->andHaving('SUM(total_amount) >= :min_spent', [':min_spent' => 500])
    ->orHaving(['>', 'MAX(total_amount)', 1000]);
```

### `limit($limit)` & `offset($offset)`

Restricts total rows returned and sets row offset for custom pagination:

```php
$query = Query::find()
    ->from('orders')
    ->where(['status' => 'completed'])
    ->orderBy('id DESC')
    ->limit(10)
    ->offset(20);
```


### `autoIlike(bool $value)`

Enables or disables automatic `ILIKE` conversion for PostgreSQL. Enabled by default.

```php
// Use Case-Sensitive 'LIKE' on PostgreSQL
$query->autoIlike(false)
      ->where(['like', 'name', 'Laptop']);
```

### `indexBy($column)` (v2.0.13)

Indexes the array of query results by the values of a specified column.

```php
$users = Query::find()->from('users')->indexBy('email')->all();
// Result:
// [
//   'john@example.com' => ['id' => 1, 'name' => 'John', 'email' => 'john@example.com'],
//   'jane@example.com' => ['id' => 2, 'name' => 'Jane', 'email' => 'jane@example.com'],
// ]
```

### `union($query, $all = false)` (v2.0.13)

Combines the results of multiple query builders using SQL `UNION` or `UNION ALL`. Parameters of the subqueries are automatically rewritten internally to prevent name collisions.

```php
$query1 = Query::find()->from('users')->select('id, name')->where(['role' => 'admin']);
$query2 = Query::find()->from('users')->select('id, name')->where(['role' => 'manager']);

// Perform UNION ALL
$allStaff = $query1->union($query2, true)->all();
```

---

### `paginate($perPage, $page)`

Easily paginate results. Returns an array with metadata.

```php
$result = $query->paginate(20, 1);
// Returns:
// [
//    'data' => [...],
//    'total' => 150,
//    'per_page' => 20,
//    'current_page' => 1,
//    'last_page' => 8
// ]
```

### `rawSql()`

Returns the generated SQL with parameters interpolated. Useful for debugging.

```php
echo $query->where(['id' => 1])->rawSql();
// SELECT * FROM users WHERE id = '1'
```

### `reset()` (v2.0.3)

Resets all query builder state for safe reuse. Important in FrankenPHP worker mode where objects may persist across requests.

```php
$query = Query::find()->from('users');
$active = $query->where(['status' => 'active'])->all();

// Reset and reuse the same builder
$banned = $query->reset()->from('users')->where(['status' => 'banned'])->all();
```

---

## 🏃 Query Execution

After building the query, use the following methods to retrieve the results:

| Method            | Description                                                               |
| :---------------- | :------------------------------------------------------------------------ |
| `all()`           | Retrieves all rows (array of associative arrays).                         |
| `one()`           | Retrieves the first row or `null`.                                        |
| `scalar()`        | Retrieves the first column value from the first row (suitable for COUNT). |
| `column()`        | Retrieves all values from the first column as a one-dimensional array.    |
| `count($q = '*')` | Counts the number of rows.                                                |
| `sum($column)`    | Calculates the sum of a column.                                           |
| `avg($column)`    | Calculates the average of a column.                                       |
| `min($column)`    | Finds the minimum value of a column.                                      |
| `max($column)`    | Finds the maximum value of a column.                                      |
| `exists()`        | Checks if any record matches the criteria (optimized: SELECT 1, v2.0.3)   |

---

## 💡 Real-World Examples

### Search with Complex Filtering

```php
$posts = Post::find()
    ->select(['posts.*', 'users.username as author'])
    ->leftJoin('users', 'users.id = posts.user_id')
    ->where(['status' => 'published'])
    ->andWhere(['like', 'title', 'announcement'])
    ->orderBy('published_at DESC')
    ->limit(5)
    ->all();
```

### Duplicate Check

```php
$exists = Post::find()
    ->where(['slug' => 'this-post-title'])
    ->exists();

if ($exists) {
    // Return error or change slug
}
```

### Counting Totals by Category

```php
$total = Post::find()
    ->where(['category_id' => 5])
    ->count();
```

### REST API Search + Filter Endpoint (Recommended Pattern)

Combining `filterWhere()` with `search()` for a fully-featured `GET /resources?search=&status=&type=` endpoint:

```php
public function index()
{
    $page    = (int)$this->request->query('page', 1);
    $perPage = (int)$this->request->query('per_page', 25);
    $keyword = $this->request->query('search');     // null if not sent
    $status  = $this->request->query('status');     // null if not sent
    $typeId  = $this->request->query('type_id');    // null if not sent

    // Branch: full-text search OR standard query
    $query = $keyword
        ? Violation::search($keyword)    // searches across all fillable columns
        : Violation::find();

    return $query
        ->with('student', 'violationType', 'createdBy')
        ->andFilterWhere(['status' => $status])             // skipped if null
        ->andFilterWhere(['violation_type_id' => $typeId])  // skipped if null
        ->paginate($perPage, $page);
    // If nothing is filtered → returns all with pagination
    // If only status=1 → WHERE status = 1
    // If search + type → WHERE (OR LIKE on all fillable) AND type_id = ?
}
```

### Report: Records With Related Rows (`whereExists`)

```php
// Show only products that have at least one active order:
$products = Query::find()
    ->from('products')
    ->select(['products.*'])
    ->whereExists(
        (new Query())
            ->from('order_items')
            ->leftJoin('orders', 'orders.id = order_items.order_id')
            ->where('order_items.product_id = products.id')
            ->andWhere(['orders.status' => 'completed'])
    )
    ->orderBy('products.name ASC')
    ->all();
// SQL:
// SELECT products.* FROM products
// WHERE EXISTS (
//   SELECT 1 FROM order_items
//   LEFT JOIN orders ON orders.id = order_items.order_id
//   WHERE order_items.product_id = products.id
//     AND orders.status = 'completed'
// )
// ORDER BY products.name ASC
```

---

## 🔒 Security

The Query Builder automatically uses **PDO Prepared Statements** for all values entered through `where()`, `andWhere()`, `orWhere()`, and `having()` methods. This ensures your application is safe from **SQL Injection** attacks.

### LIMIT/OFFSET Safety (v2.0.2)

As of v2.0.2, `LIMIT` and `OFFSET` values are also **bound as `PDO::PARAM_INT`** parameters instead of being interpolated into the SQL string. This prevents potential SQL injection through manipulated pagination values.

### PDO Type Binding (v2.0.2)

All bound parameters use proper PDO types:

| PHP Type | PDO Type          |
| -------- | ----------------- |
| `int`    | `PDO::PARAM_INT`  |
| `bool`   | `PDO::PARAM_BOOL` |
| `null`   | `PDO::PARAM_NULL` |
| `string` | `PDO::PARAM_STR`  |

```php
// All values are properly typed and bound:
$query->where(['status' => 'active'])  // STR
      ->andWhere(['>', 'views', 100])  // INT
      ->whereNull('deleted_at')        // NULL
      ->limit(10)                      // PARAM_INT (not interpolated)
      ->offset(20)                     // PARAM_INT (not interpolated)
      ->all();
```

### DML Operations (INSERT / UPDATE / DELETE)

The Query Builder also supports DML (Data Manipulation Language) operations:

```php
// INSERT
$id = Query::find()->from('products')->insert([
    'name' => 'New Product',
    'price' => 29.99
]);

// UPDATE with conditions
$affected = Query::find()->from('products')
    ->where(['status' => 'draft'])
    ->update(['status' => 'published']);

// DELETE with conditions
$deleted = Query::find()->from('products')
    ->where(['status' => 'expired'])
    ->delete();
```

---

## 🌐 Worker Mode Notes (v2.0.3)

### State Safety

- **`paginate()`** now preserves `limit`/`offset` state after execution, allowing safe reuse of the query builder.
- **`count()`**, **`sum()`**, **`avg()`**, **`min()`**, **`max()`** all save and restore the `select` state internally.
- **`exists()`** uses `SELECT 1 LIMIT 1` for minimal data transfer and state preservation.
- Use **`reset()`** to fully clear query builder state when reusing a builder across different queries.

---
