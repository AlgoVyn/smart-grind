## Binary Search - Median of Two Arrays: Framework

What is the complete code template for finding median across two sorted arrays?

<!-- front -->

---

### Framework 1: Binary Search for Median

```
┌─────────────────────────────────────────────────────┐
│  MEDIAN OF TWO SORTED ARRAYS - TEMPLATE                │
├─────────────────────────────────────────────────────┤
│  Key: Virtual partition without merging                │
│                                                        │
│  1. Ensure nums1 is smaller array (swap if needed)   │
│     m, n = len(nums1), len(nums2)                     │
│     half = (m + n + 1) // 2  # elements in left part  │
│                                                        │
│  2. Binary search on nums1 (smaller):                 │
│     left, right = 0, m                                  │
│     while left <= right:                              │
│        i = (left + right) // 2  # partition nums1    │
│        j = half - i       # partition nums2            │
│                                                        │
│        nums1_left = nums1[i-1] if i > 0 else -inf    │
│        nums1_right = nums1[i] if i < m else +inf      │
│        nums2_left = nums2[j-1] if j > 0 else -inf    │
│        nums2_right = nums2[j] if j < n else +inf    │
│                                                        │
│        If nums1_left <= nums2_right and nums2_left <= nums1_right:
│           # Correct partition found                   │
│           If (m+n) odd: return max(nums1_left, nums2_left)│
│           Else: return (max(lefts) + min(rights)) / 2  │
│        Elif nums1_left > nums2_right:                 │
│           Move left: right = i - 1                  │
│        Else:                                          │
│           Move right: left = i + 1                    │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def find_median_sorted_arrays(nums1, nums2):
    """
    Find median of two sorted arrays.
    LeetCode 4
    Time: O(log(min(m,n))), Space: O(1)
    """
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    half = (m + n + 1) // 2
    
    while left <= right:
        i = (left + right) // 2
        j = half - i
        
        nums1_left = float('-inf') if i == 0 else nums1[i-1]
        nums1_right = float('inf') if i == m else nums1[i]
        nums2_left = float('-inf') if j == 0 else nums2[j-1]
        nums2_right = float('inf') if j == n else nums2[j]
        
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            # Correct partition
            if (m + n) % 2 == 1:
                return max(nums1_left, nums2_left)
            return (max(nums1_left, nums2_left) + 
                    min(nums1_right, nums2_right)) / 2
        
        elif nums1_left > nums2_right:
            right = i - 1
        else:
            left = i + 1
```

---

### Key Pattern Elements

| Variable | Meaning |
|----------|---------|
| `i` | Partition index in nums1 |
| `j` | Partition index in nums2 (derived: `half - i`) |
| `numsX_left` | Max of left partition (or -inf) |
| `numsX_right` | Min of right partition (or +inf) |

<!-- back -->
