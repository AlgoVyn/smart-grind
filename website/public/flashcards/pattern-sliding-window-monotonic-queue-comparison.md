## Sliding Window - Monotonic Queue: Comparison

When should you use monotonic queue versus other range query approaches?

<!-- front -->

---

### Monotonic Queue vs Segment Tree

| Aspect | Monotonic Queue | Segment Tree |
|--------|-----------------|--------------|
| **Time** | O(n) | O(n log n) |
| **Query time** | O(1) amortized | O(log n) |
| **Build time** | O(n) | O(n) |
| **Space** | O(k) | O(n) |
| **Update** | N/A (offline) | O(log n) |
| **Window size** | Fixed | Arbitrary |

**Winner**: Monotonic queue for fixed-size sliding windows

---

### Monotonic Queue vs Sparse Table

| Aspect | Monotonic Queue | Sparse Table |
|--------|-----------------|--------------|
| **Query** | O(1) amortized | O(1) |
| **Preprocess** | O(n) | O(n log n) |
| **Space** | O(k) | O(n log n) |
| **Static/Dynamic** | Dynamic | Static only |

**Winner**: Sparse Table for static array multiple queries, Monotonic Queue for streaming

---

### When to Use Monotonic Queue

**Use when:**
- Fixed-size sliding window
- Need max/min in every window
- Streaming/online data
- O(n) required, not O(n log n)

**Don't use when:**
- Window size varies
- Need other aggregations (sum, product)
- Static array with arbitrary range queries
- Need to modify array elements

---

### Comparison with Other Window Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Monotonic Queue** | O(n) | O(k) | Window max/min |
| **Fixed Window + Heap** | O(n log k) | O(k) | Window max with updates |
| **Prefix Sum** | O(1) query | O(n) | Range sum queries |
| **Segment Tree** | O(log n) | O(n) | Arbitrary ranges |

---

### Decision Tree

```
Need max/min in every window?
├── Yes → Window size fixed?
│   ├── Yes → MONOTONIC QUEUE
│   └── No → Window varies?
│       ├── Yes → HEAP + HASH
│       └── No → SEGMENT TREE
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Monotonic Queue Wins | Segment Tree Wins |
|-------------|---------------------|-------------------|
| Fixed window efficiency | ✓ | - |
| Arbitrary range queries | - | ✓ |
| Space efficiency | ✓ | - |
| Element updates | - | ✓ |
| Implementation simplicity | ✓ | - |

<!-- back -->
