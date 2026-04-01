## Binary Lifting: Comparison Guide

How does binary lifting compare to other tree query techniques?

<!-- front -->

---

### LCA Algorithm Comparison

| Algorithm | Preprocess | Query | Space | Notes |
|-----------|-----------|-------|-------|-------|
| **Binary Lifting** | O(n log n) | O(log n) | O(n log n) | Simple, flexible |
| **Euler Tour + RMQ** | O(n) | O(1) | O(n) | Best for static trees |
| **Heavy-Light** | O(n) | O(log² n) | O(n) | Path queries, updates |
| **Tarjan's Offline** | O(n α(n)) | O(1) amortized | O(n) | All queries at end |
| **Link-Cut Tree** | O(1) | O(log n) | O(n) | Dynamic trees |
| **Binary Lifting + SegTree** | O(n log n) | O(log² n) | O(n log n) | Path aggregates |

---

### Binary Lifting vs Euler Tour + RMQ

| Aspect | Binary Lifting | Euler+RMQ |
|--------|----------------|-----------|
| **Preprocessing** | O(n log n) | O(n) |
| **Query time** | O(log n) | O(1) |
| **Space** | O(n log n) | O(n) |
| **Path aggregates** | Easy to extend | Requires separate structure |
| **Dynamic updates** | Hard | Very hard |
| **Code complexity** | Medium | Higher |

**Recommendation:**
- Many LCA only queries → Euler+RMQ
- Need k-th ancestor or path aggregates → Binary Lifting

---

### Binary Lifting vs Heavy-Light Decomposition

| Aspect | Binary Lifting | HLD |
|--------|----------------|-----|
| **LCA query** | O(log n) | O(log n) |
| **Path query** | Need extension | Native O(log² n) |
| **Subtree query** | Need Euler tour | Native with segment tree |
| **Updates** | Point updates possible | Full path/subtree updates |
| **Implementation** | Simpler | More complex |

**Best practice:** Use HLD for complex path operations, binary lifting for ancestor-only queries.

---

### When to Use Each Technique

| Requirement | Recommended Approach |
|-------------|----------------------|
| Only LCA, many queries | Euler Tour + RMQ |
| LCA + k-th ancestor | Binary Lifting |
| Path sum/min/max | Heavy-Light Decomposition |
| Path with updates | HLD with segment tree |
| Dynamic tree (link/cut) | Link-Cut Tree |
| Functional graph queries | Binary Lifting |
| Simple implementation needed | Binary Lifting |

---

### Complexity Trade-offs

```
n = 10^5, q = 10^5 queries

Binary Lifting:
  Preprocess: 10^5 × 17 ≈ 1.7×10^6 operations
  Queries: 10^5 × 17 ≈ 1.7×10^6 operations

Euler+RMQ:
  Preprocess: 2×10^5 operations
  Queries: 10^5 × 1 = 10^5 operations

For q >> n, Euler+RMQ wins significantly.
For q ≈ n, both are acceptable.
```

<!-- back -->
