## Sliding Window - Monotonic Queue for Max/Min: Comparison

When should you use monotonic queue versus other approaches?

<!-- front -->

---

### Monotonic Queue vs Priority Queue (Heap)

| Aspect | Monotonic Queue | Priority Queue |
|--------|-----------------|----------------|
| **Time per window** | O(1) amortized | O(log k) |
| **Total time** | O(n) | O(n log k) |
| **Space** | O(k) | O(k) |
| **Lazy deletion** | No (eager) | Yes (needs hash for removal) |
| **Implementation** | Moderate | Simple |
| **Variable window** | Hard | Easy |

**Winner**: Monotonic queue for fixed windows; Heap for variable windows

---

### Monotonic Queue vs Segment Tree

| Aspect | Monotonic Queue | Segment Tree |
|--------|-----------------|--------------|
| **Query time** | O(1) amortized | O(log n) |
| **Preprocessing** | O(n) | O(n) |
| **Space** | O(k) | O(n) |
| **Window flexibility** | Fixed size only | Arbitrary ranges |
| **Updates** | Not supported | O(log n) per update |
| **Static/Dynamic** | Streaming/online | Static (or with updates) |

**Winner**: Monotonic queue for fixed sliding windows; Segment tree for arbitrary range queries or dynamic arrays

---

### Monotonic Queue vs Sparse Table

| Aspect | Monotonic Queue | Sparse Table |
|--------|-----------------|--------------|
| **Query** | O(1) amortized | O(1) |
| **Preprocess** | O(n) | O(n log n) |
| **Space** | O(k) | O(n log n) |
| **Static/Dynamic** | Dynamic (streaming) | Static only |
| **Window size** | Fixed | Arbitrary |

**Winner**: Sparse Table for static array with many arbitrary queries; Monotonic Queue for streaming/fixed window

---

### Monotonic Queue vs Brute Force

| Aspect | Monotonic Queue | Brute Force |
|--------|-----------------|-------------|
| **Time** | O(n) | O(n × k) |
| **Space** | O(k) | O(1) |
| **Practical for** | All cases | Only tiny inputs |

**Winner**: Monotonic queue always wins except for k=1 or very small arrays

---

### Complete Comparison Table

| Approach | Time | Space | Best For | Avoid When |
|----------|------|-------|----------|------------|
| **Monotonic Queue** | O(n) | O(k) | Fixed window max/min | Variable window, updates needed |
| **Heap + Hash** | O(n log k) | O(k) | Variable window size | Fixed window (overkill) |
| **Segment Tree** | O(n log n) | O(n) | Arbitrary ranges, updates | Simple sliding window |
| **Sparse Table** | O(n log n) prep, O(1) query | O(n log n) | Many static queries | Streaming/dynamic data |
| **Ordered Set (TreeSet)** | O(n log k) | O(k) | Need ordered window elements | Just need max/min |
| **Deque (naive)** | O(n × k) | O(k) | Never | Always use monotonic |

---

### Decision Tree

```
Need max/min in sliding window?
├── Yes → Window size fixed?
│   ├── Yes → Data streaming/online?
│   │   ├── Yes → MONOTONIC QUEUE
│   │   └── No → Multiple queries on static array?
│   │       ├── Yes → SPARSE TABLE
│   │       └── No → MONOTONIC QUEUE
│   └── No → Window size varies?
│       ├── Yes → HEAP + HASH (lazy deletion)
│       └── No → SEGMENT TREE or ORDERED SET
└── No → Different pattern entirely
```

---

### Key Trade-offs

| Consideration | Monotonic Queue Wins | Alternative Wins |
|-------------|---------------------|------------------|
| Fixed window efficiency | ✓ | - |
| Variable window support | - | Heap ✓ |
| Space efficiency | ✓ | - |
| Element updates | - | Segment Tree ✓ |
| Implementation simplicity | Moderate | Heap is simpler |
| Arbitrary range queries | - | Segment Tree ✓ |
| Multiple static queries | - | Sparse Table ✓ |

---

### When to Use Monotonic Queue

**Use when:**
- Fixed-size sliding window
- Need max/min in every window position
- Streaming/online data processing
- O(n) time is required (not O(n log n))
- No element updates needed

**Don't use when:**
- Window size varies dynamically
- Need to support element updates
- Need arbitrary range queries (not just sliding)
- Need other aggregations (sum, product, median)
- Static array with many random queries

<!-- back -->
