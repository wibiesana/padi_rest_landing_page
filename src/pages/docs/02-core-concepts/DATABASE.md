# 🗄️ Database Orchestration & Transactions

## 🏗️ Industrial-Grade Persistence & Atomic Integrity

Master the heart of your application with Padi REST API’s **Unified Database Engine**. This guide combines our powerful **Multi-Database Orchestration** with a **Battle-Tested Transaction Layer**, ensuring your data remains consistent, scalable, and atomic across MySQL, MariaDB, PostgreSQL, and SQLite. Whether you are running complex multi-engine queries or high-security financial transactions, our architecture guarantees absolute precision and zero-friction data flow.

---

## 📋 Table of Contents

- [🏗️ Industrial-Grade Persistence & Atomic Integrity](#industrial-grade-persistence--atomic-integrity)
- [⚙️ Multi-Database Configuration](#multi-database-configuration)
- [🛡️ Transaction Management](#transaction-management)
    - [Automatic Transactions (Recommended)](#automatic-transactions-recommended)
    - [Manual Transactions](#manual-transactions)
    - [Cross-Database Transactions](#cross-database-transactions)
- [📝 Implementation Patterns](#implementation-patterns)
- [🎯 Available API Endpoints](#available-api-endpoints)
- [🔍 Supported Drivers](#supported-drivers)
- [✨ Architectural Benefits](#architectural-benefits)

---

## ⚙️ Multi-Database Configuration

### 1. Environment Orchestration (.env)

Configure multiple high-performance engines simultaneously within your environment layer:

```bash
# Primary Transactional Database (MySQL/MariaDB)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=padi_main_db
DB_USERNAME=root
DB_PASSWORD=

# High-Performance Analytical Engine (PostgreSQL)
PGSQL_HOST=localhost
PGSQL_DATABASE=analytics_db
PGSQL_USERNAME=postgres
PGSQL_PASSWORD=

# Ultra-Lightweight local Storage (SQLite)
SQLITE_DATABASE=database/storage.sqlite
```

### 2. Model Persistence Layer

Specify the connection directly within your extending models:

```php
namespace App\Models;
use Wibiesana\Padi\Core\ActiveRecord;

class Analytics extends ActiveRecord
{
    protected string $table = 'user_events';
    protected ?string $connection = 'pgsql'; // Routed to PostgreSQL
}
```

---

## 🛡️ Transaction Management

Ensure **Absolute Atomicity** for your critical operations. If any step fails, the entire sequence is reverted.

### Automatic Transactions (Recommended)

The safest implementation. The framework handles `commit` and `rollback` orchestration automatically based on your execution logic.

```php
use Core\Database;

try {
    $result = Database::transaction(function() {
        // Step 1: Create Order
        $order = new Order();
        $orderId = $order->create(['total' => 150000]);

        // Step 2: Deduct Stock
        $stock = new Stock();
        $stock->decrement($productId, 1);

        return $orderId;
    });
} catch (\Throwable $e) {
    // System automatically rolls back if any exception is caught here
    Logger::error("Transaction Failed: " . $e->getMessage());
}
```

### Manual Transactions

Use for surgical control over the transaction lifecycle:

```php
use Core\Database;

Database::beginTransaction();

try {
    // Custom logic...
    if ($inventoryShortage) {
        Database::rollback();
        return;
    }

    Database::commit();
} catch (\Exception $e) {
    Database::rollback();
    throw $e;
}
```

### Cross-Database Transactions

Seamlessly manage atomicity across different database engines:

```php
use Core\Database;

// Transaction on Analytical PostgreSQL
Database::transaction(function() {
    // High-performance log update
}, 'pgsql');

// Manual Control on SQLite Cache
Database::beginTransaction('sqlite');
Database::commit('sqlite');
```

---

## 📝 Implementation Patterns

### 🔄 Multi-Engine Synchronization

Example of saving a product to the main DB and logging analytics to a separate engine:

```php
public function store()
{
    try {
        Database::beginTransaction('mysql');
        Database::beginTransaction('pgsql');

        $id = (new Product())->create($data);
        (new Analytics())->log('product_created', ['id' => $id]);

        Database::commit('mysql');
        Database::commit('pgsql');
        
        return $this->created(['id' => $id]);
    } catch (\Exception $e) {
        Database::rollback('mysql');
        Database::rollback('pgsql');
        throw $e;
    }
}
```

---

## 🎯 Available API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/multi-db/info` | GET | Connection health & status monitor |
| `/multi-db/dashboard` | GET | Aggregated data from multiple engines |
| `/multi-db/track` | POST | Cross-database atomic logging |

---

## 🔍 Supported Drivers

- ✅ **MySQL / MariaDB** - Industrial-standard transactional storage.
- ✅ **PostgreSQL** - Advanced indexing & complex analytical querying.
- ✅ **SQLite** - Optimized for caching and zero-latency local storage.

---

## ✨ Architectural Benefits

1. **Separation of Concerns**: Isolate transactional data from audit logs and analytics.
2. **Deterministic Integrity**: Ensure multi-step operations never leave a partial state.
3. **Engine Optimization**: Use the right database for the right job—no compromises.
4. **Resiliency**: Built-in protection against data corruption during system failures.

---

**Next Steps:** [Learn Query Optimization →](QUERY_BUILDER.md) | [Explore API Resources →](RESOURCES.md)
