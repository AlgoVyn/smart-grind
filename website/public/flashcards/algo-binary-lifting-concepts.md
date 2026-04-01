## Binary Lifting: Core Concepts

What is binary lifting, how does it enable fast ancestor queries, and what problems does it solve?

<!-- front -->

---

### Fundamental Definition

Binary Lifting is a **dynamic programming technique** that preprocesses a tree to answer ancestor queries in **O(log n)** time.

**Key idea:** Precompute `up[v][i]` = the 2^i-th ancestor of node v

```
up[v][0] = parent of v (2^0 = 1st ancestor)
up[v][1] = grandparent of v (2^1 = 2nd ancestor)  
up[v][2] = 4th ancestor of v (2^2 = 4th ancestor)
...
up[v][k] = 2^k-th ancestor of v
```

---

### Preprocessing Recurrence

```
up[v][i] = up[ up[v][i-1] ][i-1]
           └─┬─┘         └┬┘
         2^(i-1)th    2^(i-1)th
         ancestor    ancestor of that

Result: 2^(i-1) + 2^(i-1) = 2^i ancestors up
```

**Complexity:** O(n log n) preprocessing, O(1) per query table access, O(log n) query computation

---

### Problems Solved

| Problem | Binary Lifting Solution |
|---------|------------------------|
| **K-th ancestor** | Jump in powers of 2 |
| **LCA (Lowest Common Ancestor)** | Lift both nodes to same depth, then binary search |
| **Tree distance** | depth[u] + depth[v] - 2×depth[lca] |
| **Path queries** | Precompute aggregate values (min, max, sum) |
| **Jump pointers** | Dynamic connectivity with union-find |

---

### Comparison to Alternatives

| Approach | Preprocess | Query | Space | Use When |
|----------|-----------|-------|-------|----------|
| **Binary Lifting** | O(n log n) | O(log n) | O(n log n) | General purpose |
| **Euler Tour + RMQ** | O(n) | O(1) | O(n) | Static tree, many queries |
| **Heavy-Light Decomposition** | O(n) | O(log² n) | O(n) | Path queries, updates |
| **Link-Cut Tree** | O(1) | O(log n) | O(n) | Dynamic trees |

---

### When to Use

| ✅ Use Binary Lifting | ❌ Don't Use |
|----------------------|--------------|
| Static tree, many LCA queries | Tree changes frequently |
| Need k-th ancestor | Already using HLD for path queries |
| Simple implementation needed | Need O(1) LCA query (use Euler+RMQ) |
| Competitive programming | Very large memory constraints |

<!-- back -->
