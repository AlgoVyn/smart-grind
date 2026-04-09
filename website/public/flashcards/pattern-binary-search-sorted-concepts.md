## Binary Search - On Sorted Array: Core Concepts

What are the fundamental principles of binary search on sorted arrays?

<!-- front -->

---

### Core Concept

Use **divide and conquer to repeatedly halve the search space** by comparing the target with the middle element.

**Key insight**: Sorted array allows O(log n) search by eliminating half the elements each iteration.

---

### The Pattern

```
Search for 7 in [1, 2, 3, 4, 5, 6, 7, 8, 9]

Step 1: left=0, right=8, mid=4, arr[4]=5
        7 > 5 → search right half
        left = mid + 1 = 5

Step 2: left=5, right=8, mid=6, arr[6]=7
        7 == 7 → FOUND! ✓

Only 2 iterations instead of 7 (linear search)
```

---

### Algorithm Invariants

| Invariant | Meaning |
|-----------|---------|
| `left` | First possible valid index |
| `right` | Last possible valid index |
| `mid` | Candidate position |
| Loop condition | `left <= right` (inclusive) or `left < right` (exclusive) |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Element Search | Find target index | Classic Binary Search |
| Lower Bound | First >= target | Lower Bound |
| Upper Bound | First > target | Upper Bound |
| Insert Position | Where to insert | Search Insert Position |
| Peak Element | Local maximum | Find Peak Element |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log n) | Halves each iteration |
| Space | O(1) | Iterative |
| Space (recursive) | O(log n) | Call stack |
| Comparisons | log₂(n) | ~20 for 1M elements |

<!-- back -->
