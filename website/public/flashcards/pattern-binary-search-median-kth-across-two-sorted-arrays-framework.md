## Binary Search - Median/Kth Across Two Sorted Arrays: Framework

What is the complete code template for finding the median of two sorted arrays using binary search?

<!-- front -->

---

### Framework: Virtual Partition Binary Search

```
┌─────────────────────────────────────────────────────────────┐
│  MEDIAN OF TWO SORTED ARRAYS - TEMPLATE                      │
├─────────────────────────────────────────────────────────────┤
│  Key: Binary search on smaller array with virtual partition │
│                                                              │
│  STEP 1: Ensure nums1 is smaller (swap if needed)          │
│  STEP 2: Calculate half = (m + n + 1) // 2                   │
│  STEP 3: Binary search on nums1 [0, m]:                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ i = partition in nums1, j = half - i in nums2       │    │
│  │                                                     │    │
│  │ left1  = nums1[i-1] if i>0 else -∞                  │    │
│  │ right1 = nums1[i]   if i<m else +∞                  │    │
│  │ left2  = nums2[j-1] if j>0 else -∞                  │    │
│  │ right2 = nums2[j]   if j<n else +∞                  │    │
│  │                                                     │    │
│  │ VALID PARTITION: left1 ≤ right2 AND left2 ≤ right1  │    │
│  │                                                     │    │
│  │ If valid:                                           │    │
│  │   Odd:  return max(left1, left2)                    │    │
│  │   Even: return (max(left1, left2) + min(right1, right2)) / 2│
│  │                                                     │    │
│  │ If left1 > right2:  i too big, move left            │    │
│  │ If left2 > right1:  i too small, move right         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def find_median_sorted_arrays(nums1, nums2):
    """
    Find median of two sorted arrays using binary search.
    LeetCode 4 - Median of Two Sorted Arrays
    Time: O(log min(m,n)), Space: O(1)
    """
    # Always binary search on smaller array
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    total = m + n
    half = (total + 1) // 2  # Elements in left partition
    
    left, right = 0, m
    
    while left <= right:
        i = (left + right) // 2  # Partition in nums1
        j = half - i             # Partition in nums2 (determined)
        
        # Boundary values with infinity
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < m else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < n else float('inf')
        
        # Check partition validity
        if left1 <= right2 and left2 <= right1:
            # Correct partition found
            if total % 2 == 1:
                return max(left1, left2)
            else:
                return (max(left1, left2) + min(right1, right2)) / 2
        elif left1 > right2:
            right = i - 1  # i is too big
        else:
            left = i + 1   # i is too small
```

---

### Key Pattern Elements

| Element | Purpose | Value/Condition |
|---------|---------|-----------------|
| `half = (m+n+1)//2` | Balance left partition | Left has equal or one more element |
| `j = half - i` | Derive nums2 partition | Ensures left partition has `half` elements |
| `-∞ / +∞` | Handle edge cases | Out-of-bounds array access |
| `left1 ≤ right2` | Partition condition | All left elements ≤ all right elements |
| `max(left1, left2)` | Median (odd) | Largest element in left partition |
| Binary search on smaller | Efficiency | Guarantees O(log min(m,n)) |

<!-- back -->
