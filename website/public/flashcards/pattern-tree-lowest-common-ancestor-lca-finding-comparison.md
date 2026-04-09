## LCA Finding: Comparison

When should you use different LCA approaches?

<!-- front -->

---

### Approach Comparison Table

| Approach | Preprocessing | Query Time | Space | Best For |
|----------|---------------|------------|-------|----------|
| Recursive DFS | None | O(n) | O(h) | Single query, interviews |
| Parent Pointers | None | O(n) | O(n) | Iterative preference |
| BST Optimization | None | O(h) | O(h) | BST only |
| Euler Tour + RMQ | O(n) | O(1) | O(n) | Multiple queries |
| Binary Lifting | O(n log n) | O(log n) | O(n log n) | Many queries, dynamic |

**Where:** n = nodes, h = tree height

---

### When to Use Each

**Recursive DFS:**
- Standard interview solution
- Single or few queries
- Clean, readable code
- Tree fits in memory

**Parent Pointers:**
- Want iterative approach
- Need to trace ancestors frequently
- Avoid recursion stack limits

**BST Optimization:**
- Guaranteed BST structure
- O(h) time is critical
- Simple, elegant solution

**Euler Tour + RMQ:**
- Many LCA queries on static tree
- O(1) query time needed
- Can afford O(n) preprocessing

**Binary Lifting:**
- Many queries
- Need k-th ancestor too
- Accept O(log n) per query

---

### Decision Tree

```
Tree type?
├── Binary Search Tree
│   └── Use BST Optimization (O(h) time)
│
└── General Binary Tree
    └── Query frequency?
        ├── Single query
        │   └── Use Recursive DFS (simplest)
        │
        ├── Few queries (< 10)
        │   └── Use Recursive DFS for each
        │
        └── Many queries (≥ 10)
            └── Preprocessing ok?
                ├── Yes, O(n) space ok
                │   └── Use Euler Tour + RMQ (O(1) query)
                │
                └── Limited space or dynamic tree
                    └── Use Binary Lifting (O(log n) query)
```

---

### Trade-off Summary

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Recursive DFS | Standard, expected |
| Single query | Recursive DFS | No overhead |
| Static tree, many queries | Euler + RMQ | Fastest queries |
| Dynamic tree | Binary Lifting | Handles updates |
| BST guaranteed | BST Optimization | Optimal O(h) |

<!-- back -->
