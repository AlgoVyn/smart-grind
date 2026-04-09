## Binary Search - Two Sorted Arrays: Framework

What is the complete code template for finding k-th element in two sorted arrays?

<!-- front -->

---

### Framework 1: Find K-th Element Template

```
┌─────────────────────────────────────────────────────┐
│  K-TH ELEMENT IN TWO SORTED ARRAYS - TEMPLATE        │
├─────────────────────────────────────────────────────┤
│  1. Ensure A is the smaller array (binary search on it) │
│  2. Binary search on partition point i in A:      │
│     - low = 0, high = len(A)                       │
│     - i = partition in A, j = k - i in B           │
│                                                      │
│  3. Check partition validity:                       │
│     - A[i-1] <= B[j] (or i==0)                     │
│     - B[j-1] <= A[i] (or j==0)                     │
│                                                      │
│  4. If valid: return max(A[i-1], B[j-1])           │
│     If A[i-1] > B[j]: move left (high = i - 1)     │
│     If B[j-1] > A[i]: move right (low = i + 1)     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def find_kth(A, B, k):
    """Find k-th smallest element in union of two sorted arrays."""
    # Ensure A is the smaller array
    if len(A) > len(B):
        A, B = B, A
    
    m, n = len(A), len(B)
    
    # Binary search on A
    left, right = 0, m
    
    while left <= right:
        i = (left + right) // 2  # Partition A
        j = k - i                   # Partition B
        
        # Handle edge cases
        A_left = A[i - 1] if i > 0 else float('-inf')
        A_right = A[i] if i < m else float('inf')
        B_left = B[j - 1] if j > 0 else float('-inf')
        B_right = B[j] if j < n else float('inf')
        
        # Check if we found the correct partition
        if A_left <= B_right and B_left <= A_right:
            # Found k-th element
            return max(A_left, B_left)
        elif A_left > B_right:
            # Too far in A, move left
            right = i - 1
        else:
            # Too little from A, move right
            left = i + 1
    
    return -1  # Should never reach here
```

---

### Framework 2: Find Median

```python
def find_median_sorted_arrays(nums1, nums2):
    """Find median of two sorted arrays."""
    total = len(nums1) + len(nums2)
    
    if total % 2 == 1:
        # Odd - single median
        return find_kth(nums1, nums2, total // 2 + 1)
    else:
        # Even - average of two middle
        left = find_kth(nums1, nums2, total // 2)
        right = find_kth(nums1, nums2, total // 2 + 1)
        return (left + right) / 2
```

---

### Key Pattern Elements

| Element | Formula | Purpose |
|---------|---------|---------|
| i + j = k | Partition constraint | Ensure k elements on left |
| max(left) | max(A[i-1], B[j-1]) | K-th element value |
| Edge cases | inf/-inf | Handle empty partitions |
| Binary search | on smaller array | O(log(min(m,n))) |

<!-- back -->
