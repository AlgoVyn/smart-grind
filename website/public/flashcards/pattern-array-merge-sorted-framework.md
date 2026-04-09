## Array - Merge Sorted In-Place: Framework

What is the complete code template for merging sorted arrays in-place?

<!-- front -->

---

### Framework 1: Merge from End

```
┌─────────────────────────────────────────────────────┐
│  MERGE SORTED ARRAY - FROM END TEMPLATE                │
│  Key: Start from end to avoid overwriting elements     │
│                                                        │
│  1. i = m - 1 (last valid in nums1)                  │
│     j = n - 1 (last in nums2)                          │
│     k = m + n - 1 (last position)                      │
│                                                        │
│  2. While i >= 0 and j >= 0:                          │
│     If nums1[i] > nums2[j]:                           │
│        nums1[k] = nums1[i]                              │
│        i--                                             │
│     Else:                                              │
│        nums1[k] = nums2[j]                              │
│        j--                                             │
│     k--                                                │
│                                                        │
│  3. While j >= 0:  (copy remaining from nums2)       │
│     nums1[k] = nums2[j]                                 │
│     j--, k--                                           │
│                                                        │
│  Note: No need to copy remaining from nums1           │
│        (already in place)                              │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def merge(nums1, m, nums2, n):
    """
    Merge nums2 into nums1 in-place.
    LeetCode 88
    Time: O(m+n), Space: O(1)
    """
    i, j, k = m - 1, n - 1, m + n - 1
    
    # Merge while both have elements
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    # Copy remaining from nums2
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1
```

---

### Key Pattern Elements

| Pointer | Purpose | Initial Value |
|---------|---------|---------------|
| `i` | nums1 position | `m - 1` |
| `j` | nums2 position | `n - 1` |
| `k` | Write position | `m + n - 1` |

**Why from end?**
- If we start from beginning, we'd overwrite elements in nums1 before processing them
- Starting from end uses empty space safely

<!-- back -->
