# 🚀 High-Performance Pagination & Frontend Orchestration

## 🏗️ Enterprise-Grade Data Flow

Padi REST API handles massive datasets with surgical precision. Our pagination engine isn't just about splitting results; it's about providing your **Fat Frontend** with all the metadata required to build sophisticated, lightning-fast UI components with zero extra logic on the client side.

---

## 📋 Table of Contents

- [🏗️ Enterprise-Grade Data Flow](#enterprise-grade-data-flow)
- [💎 The Standardized Response](#the-standardized-response)
- [📦 Meta-Data Intelligence](#meta-data-intelligence)
- [🎨 Frontend Implementation (Vue, React, Hooks)](#frontend-implementation)
- [🏎️ Performance Benchmarks](#performance-benchmarks)

---


## 💎 The Standardized Response

Every paginated request returns a structured "Contract" that both your backend and frontend understand implicitly.

**Request:** `GET /v1/products?page=2&per_page=15`

```json
{
  "success": true,
  "data": [ ... 15 items ... ],
  "meta": {
    "total": 450,
    "per_page": 15,
    "current_page": 2,
    "last_page": 30,
    "from": 16,
    "to": 30
  }
}
```

---

## 📦 Meta-Data Intelligence

Padi's `meta` object is designed to satisfy the requirements of modern UI data-tables (like Quasar `q-table` or Vuetify `v-data-table`) out of the box:

- **`total`**: Perfect for calculating total pages and showing "Total Records: 450".
- **`from` / `to`**: Essential for displaying "Showing 16 to 30 of 450 entries" without manual calculation.
- **`last_page`**: Direct input for your pagination component's `max` attribute.

---

## 🎨 Frontend Implementation

### Vue 3 + Pinia
In a **Fat Frontend** architecture, your Pinia store handles the orchestration. Padi makes this effortless:

```javascript
// stores/productStore.js
export const useProductStore = defineStore('products', {
  state: () => ({
    items: [],
    pagination: {},
    loading: false
  }),
  actions: {
    async fetchPage(page = 1) {
      this.loading = true;
      const { data, meta } = await api.get(`/products?page=${page}`);
      this.items = data;
      this.pagination = meta; // Directly sync meta
      this.loading = false;
    }
  }
});
```

### React + Hooks
For React applications, you can use a simple hook or `useEffect` to manage the state:

```javascript
const [products, setProducts] = useState([]);
const [pagination, setPagination] = useState({});

const fetchProducts = async (page = 1) => {
  const response = await api.get(`/products?page=${page}`);
  setProducts(response.data);
  setPagination(response.meta); // Sync metadata for UI
};
```

---

## 🏎️ Performance Benchmarks

Our pagination is optimized for **Large-Scale Data**:

- **Lazy Execution**: Database records are only fetched *after* the total count is calculated.
- **Memory Efficiency**: Padi uses zero-buffer streams to handle results, ensuring stability even under heavy concurrent loads.
- **Worker Mode Ready**: Optimized for FrankenPHP, enabling sub-millisecond metadata generation.

---

**Next:** [Frontend Integration Guide →](FRONTEND_INTEGRATION.md)
