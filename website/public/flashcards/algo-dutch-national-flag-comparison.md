## Dutch National Flag: Comparison Guide

How does the Dutch National Flag algorithm compare to other sorting and partitioning approaches?

<!-- front -->

---

### Sorting Small Integer Ranges

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| **Dutch National Flag** | O(n) | O(1) | 2-3 distinct values |
| **Counting Sort** | O(n + k) | O(k) | k distinct values, k << n |
| **Radix Sort** | O(d × (n + k)) | O(n + k) | Fixed-width integers |
| **Quicksort (standard)** | O(n log n) | O(log n) | General purpose |
| **Quicksort (3-way)** | O(n) for dups | O(log n) | Many duplicates |

---

### Partition Strategies

| Strategy | Comparisons | Swaps | Use Case |
|----------|-------------|-------|----------|
| **Lomuto** | n | ≤ n | Simple, educational |
| **Hoare** | n | ≤ n/2 | Efficient, fewer swaps |
| **3-way (DNF)** | n | ≤ n | Many equal elements |
| **Dual-pivot** | n | ≤ n | General optimization |

---

### When to Use DNF

```
Sorting array with:
  ├─ Only 0s, 1s, 2s? → Classic DNF
  ├─ Few distinct values? → Extended DNF or counting
  ├─ Many duplicates? → 3-way quicksort
  └─ General integers? → Standard quicksort/mergesort

Partitioning problems:
  ├─ < pivot, = pivot, > pivot? → DNF partition
  ├─ Two groups only? → Two-way partition
  └─ Need stable partition? → Use extra space
```

---

### Related Patterns

| Pattern | Relation to DNF |
|---------|-----------------|
| **Two pointers** | DNF extends to three pointers |
| **Quickselect** | Uses DNF for 3-way partition |
| **Quicksort** | 3-way variant uses DNF |
| **Bucket sort** | DNF is special case with 3 buckets |
| **Rainbow sort** | k-way extension of DNF |

---

### Complexity Trade-offs

| Scenario | Algorithm | Why |
|----------|-----------|-----|
| 3 colors, in-place required | DNF | O(n) time, O(1) space |
| k colors, in-place not required | Counting sort | O(n + k), simple |
| Stable sort needed | Merge sort | O(n log n), stable |
| Real numbers | Quicksort | O(n log n) expected |

<!-- back -->
