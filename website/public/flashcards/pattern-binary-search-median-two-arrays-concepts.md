## Binary Search - Median of Two Arrays: Core Concepts

What are the fundamental principles of finding median across two arrays?

<!-- front -->

---

### Core Concept

**Find a virtual partition that divides both arrays such that all elements in the left half are ≤ all elements in the right half, without actually merging them.**

**Partition Visualization:**
```
nums1: [1, 3, 8]  (partition at i=1)
             ↑
        left | right
        [1,3] | [8]

nums2: [2, 4, 5, 6, 7]  (partition at j=2, since half=4, j=4-1=3?)
               ↑
          left | right
         [2,4,5] | [6,7]

Combined left: [1,3,2,4,5]  (sorted: [1,2,3,4,5])
Combined right: [8,6,7]   (sorted: [6,7,8])

Check: max(left) = 5, min(right) = 6
5 ≤ 6 ✓ Valid partition!

Median = (5 + 6) / 2 = 5.5
```

---

### The Pattern

```
1. Partition the smaller array at position i
2. Calculate j = half - i for the other array
3. Check boundary conditions:
   - nums1_left ≤ nums2_right
   - nums2_left ≤ nums1_right
4. If valid: compute median
5. If not: binary search to adjust partition
```

---

### Complexity

| Aspect | Complexity | Why |
|--------|-----------|-----|
| Time | O(log(min(m,n))) | Binary search on smaller |
| Space | O(1) | Constant variables |
| Better than merge | Yes | O(m+n) is slower |

---

### Key Insight

**We don't need to merge the arrays.** We just need to find the right partition point where the combined left half has the correct number of elements.

<!-- back -->
