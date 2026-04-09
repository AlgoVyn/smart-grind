## Binary Search - Median/Kth Across Two Sorted Arrays: Comparison

How do different approaches for finding median/kth across two sorted arrays compare?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Implementation | Best For |
|----------|------|-------|----------------|----------|
| **Binary Search (Partition)** | O(log min(m,n)) | O(1) | Complex | **Interviews, optimization** |
| **Two Pointers** | O(m+n) | O(1) | Moderate | Understanding, simple cases |
| **Full Merge** | O(m+n) | O(m+n) | Simple | Clarity, small arrays |
| **Heap (K-way)** | O((m+n) log k) | O(k) | Moderate | k sorted arrays |
| **Recursive Kth** | O(log(m+n)) | O(log(m+n)) | Complex | Educational |

**Winner for 2 arrays**: Binary Search Partition (optimal time & space)

---

### Detailed Comparison

```
Scenario: nums1 = [1,2], nums2 = [3,4] (find median)

Binary Search Partition:
┌─────────────────────────────────────────────────────┐
│ m=2, n=2, half=2                                    │
│ Binary search on nums1 [0,2]:                       │
│   i=1, j=1: left1=1, right1=2, left2=3, right2=4    │
│   Check: 1≤4 ✓, 3≤2? ✗ → move right                 │
│   i=2, j=0: left1=2, right1=∞, left2=-∞, right2=3   │
│   Check: 2≤3 ✓, -∞≤∞ ✓ → valid!                     │
│ Median (even): (max(2,-∞) + min(∞,3))/2 = (2+3)/2   │
│ = 2.5                                               │
│ Time: O(log 2) = O(1)                              │
└─────────────────────────────────────────────────────┘

Two Pointers:
┌─────────────────────────────────────────────────────┐
│ Iterate until reaching middle:                      │
│ 1 (nums1), 2 (nums1), 3 (nums2), 4 (nums2)         │
│ Stop at 2nd and 3rd elements for median           │
│ Median: (2+3)/2 = 2.5                               │
│ Time: O(2+2) = O(4) iterations                     │
└─────────────────────────────────────────────────────┘

Full Merge:
┌─────────────────────────────────────────────────────┐
│ merged = [1,2,3,4]                                 │
│ median = (merged[1] + merged[2]) / 2 = 2.5         │
│ Time: O(4), Space: O(4)                            │
└─────────────────────────────────────────────────────┘
```

---

### When to Use Each Approach

| Situation | Recommendation | Why |
|-----------|---------------|-----|
| **Coding interview (optimal)** | Binary Search | Expected optimal solution |
| **Coding interview (quick)** | Two Pointers | Easier to implement correctly |
| **Very large arrays** | Binary Search | O(log n) vs O(n) significant |
| **Understanding the problem** | Full Merge | Most intuitive |
| **k sorted arrays (k>2)** | Min-Heap | Scales better |
| **Production code** | Binary Search | Best performance guarantee |
| **Multiple queries** | Preprocessing | Depends on query pattern |

---

### Complexity Scaling

```
Small arrays (m,n < 100):
┌─────────────────────────────────────────────────────┐
│ Binary Search: ~6-7 operations                      │
│ Two Pointers: ~100 operations                     │
│ Difference negligible in practice                 │
│ → Either approach acceptable                      │
└─────────────────────────────────────────────────────┘

Large arrays (m,n = 10^6):
┌─────────────────────────────────────────────────────┐
│ Binary Search: ~20 operations                      │
│ Two Pointers: ~2×10^6 operations                  │
│ Binary search is 100,000× faster!                  │
│ → Binary search essential                         │
└─────────────────────────────────────────────────────┘

Very unbalanced (m=10, n=10^6):
┌─────────────────────────────────────────────────────┐
│ Binary Search: ~4 operations (on smaller)          │
│ Two Pointers: ~10^6 operations                    │
│ Binary search on smaller array shines!            │
└─────────────────────────────────────────────────────┘
```

---

### Trade-off Summary

| Factor | Binary Search | Two Pointers | Full Merge |
|--------|---------------|--------------|------------|
| **Time (best)** | ✓✓✓ | ✗ | ✗ |
| **Time (worst)** | ✓✓✓ | ✗✗ | ✗✗ |
| **Space** | ✓✓✓ | ✓✓✓ | ✗ |
| **Implementation** | ✗ | ✓✓ | ✓✓✓ |
| **Debuggability** | ✗ | ✓✓ | ✓✓✓ |
| **Extensibility** | ✓✓ | ✓ | ✗ |

<!-- back -->
