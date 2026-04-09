## Binary Search - Two Sorted Arrays: Comparison

When should you use the binary search approach versus merging for k-th element?

<!-- front -->

---

### Binary Search vs Merge Approach

| Aspect | Binary Search | Merge (K-th) | Full Merge |
|--------|---------------|--------------|------------|
| **Time** | O(log(min(m,n))) | O(k) | O(m + n) |
| **Space** | O(1) | O(1) | O(m + n) |
| **Median case** | O(log(min(m,n))) | O(m + n) in worst case | O(m + n) |
| **Small k** | Overhead | Efficient | Wasteful |
| **Code complexity** | Higher | Lower | Medium |

**Winner**: Binary search for median, merge approach if k is small and known

---

### When to Use Each Approach

**Binary Search Partition**:
- Finding median
- Large arrays
- Guaranteed O(log) time needed
- Implementing optimized solution

**Merge Until K**:
- k is very small (e.g., k=3)
- Simplicity is preferred
- Both arrays are similar size

**Full Merge**:
- Need all merged elements anyway
- Memory not constrained
- One-time operation

---

### Comparison with Other Median Finding

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Binary Search Partition** | O(log(min(m,n))) | O(1) | Two sorted arrays |
| **Quick Select** | O(m + n) avg | O(1) | Unsorted arrays |
| **Heap (K-way)** | O(k log m) | O(m) | Multiple sorted arrays |
| **Full Sort** | O((m+n) log(m+n)) | O(m+n) | Unsorted, simple |

---

### Decision Tree

```
Find k-th/median in two sorted arrays?
├── Yes → Finding median?
│   ├── Yes → BINARY SEARCH PARTITION
│   └── No → k is very small?
│       ├── Yes → MERGE UNTIL K
│       └── No → BINARY SEARCH PARTITION
└── No → Arrays unsorted?
    ├── Yes → QUICK SELECT
    └── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Binary Search Wins | Merge Approach Wins |
|-------------|-------------------|---------------------|
| Large arrays | ✓ | - |
| Median finding | ✓ | - |
| Small k (k < log n) | - | ✓ |
| Code simplicity | - | ✓ |
| Multiple queries | ✓ | - |

<!-- back -->
