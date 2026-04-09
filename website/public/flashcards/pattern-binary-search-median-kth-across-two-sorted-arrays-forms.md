## Binary Search - Median/Kth Across Two Sorted Arrays: Problem Forms

What are the common variations and problem forms for median/kth element across two sorted arrays?

<!-- front -->

---

### Form 1: Median of Two Sorted Arrays (Classic)

**Problem**: Find median of two sorted arrays.

```python
# Input: nums1 = [1,3], nums2 = [2]
# Output: 2.0
# Explanation: merged = [1,2,3], median = 2

# Input: nums1 = [1,2], nums2 = [3,4]  
# Output: 2.5
# Explanation: merged = [1,2,3,4], median = (2+3)/2 = 2.5

def find_median_sorted_arrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2
    
    left, right = 0, m
    while left <= right:
        i = (left + right) // 2
        j = half - i
        
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < m else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < n else float('inf')
        
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 1:
                return max(left1, left2)
            return (max(left1, left2) + min(right1, right2)) / 2
        elif left1 > right2:
            right = i - 1
        else:
            left = i + 1
```

**LeetCode**: 4 - Median of Two Sorted Arrays (Hard)

---

### Form 2: Kth Smallest Element

**Problem**: Find kth smallest element in two sorted arrays.

```python
# Input: nums1 = [1,3,5], nums2 = [2,4,6], k = 4
# Output: 4
# Explanation: merged = [1,2,3,4,5,6], 4th smallest = 4

def find_kth_smallest(nums1, nums2, k):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    low = max(0, k - len(nums2))
    high = min(k, len(nums1))
    
    while low <= high:
        i = (low + high) // 2
        j = k - i
        
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < len(nums1) else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < len(nums2) else float('inf')
        
        if left1 <= right2 and left2 <= right1:
            return max(left1, left2)
        elif left1 > right2:
            high = i - 1
        else:
            low = i + 1
```

**Variation**: Return kth largest by computing `(m+n-k+1)`th smallest

---

### Form 3: Kth Element with One Array Exhausted

**Problem**: Handle when all elements from one array are smaller/larger.

```python
# Input: nums1 = [1,2,3], nums2 = [4,5,6,7,8], k = 2
# Output: 2 (just from nums1, no binary search needed)

# Input: nums1 = [1,2], nums2 = [3,4,5,6,7], k = 6
# Output: 6 (from nums2[3])

def find_kth_with_exhaustion(nums1, nums2, k):
    """
    Optimized: if k is small and fits in one array, 
    no need for complex binary search.
    """
    if k <= len(nums1) and nums1[k-1] <= nums2[0]:
        # All k elements from nums1
        return nums1[k-1]
    if k > len(nums1) and k - len(nums1) <= len(nums2):
        # Some from nums1, rest from nums2
        remaining = k - len(nums1)
        if remaining > 0 and nums1[-1] <= nums2[remaining-1]:
            return nums2[remaining-1]
    # Fall back to binary search
    return find_kth_smallest(nums1, nums2, k)
```

---

### Form 4: Median with Empty Array

**Problem**: One or both arrays may be empty.

```python
# Input: nums1 = [], nums2 = [1]
# Output: 1.0

# Input: nums1 = [], nums2 = [1,2,3,4]
# Output: 2.5

def median_with_empty(nums1, nums2):
    if not nums1 and not nums2:
        raise ValueError("Both arrays empty")
    if not nums1:
        return median_single(nums2)
    if not nums2:
        return median_single(nums1)
    return find_median_sorted_arrays(nums1, nums2)

def median_single(nums):
    n = len(nums)
    if n % 2 == 1:
        return float(nums[n // 2])
    return (nums[n // 2 - 1] + nums[n // 2]) / 2.0
```

---

### Form 5: Kth Smallest in K Sorted Arrays

**Problem**: Extend to k sorted arrays (generalization).

```python
# Input: arrays = [[1,5,9], [2,6,10], [3,7,11]], k = 5
# Output: 5
# Explanation: merged = [1,2,3,5,6,7,9,10,11], 5th = 5

def kth_in_k_arrays(arrays, k):
    """
    Using min-heap approach for k arrays.
    Time: O(k log k) to initialize, O((m+n) log k) total
    """
    import heapq
    
    min_heap = []
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(min_heap, (arr[0], i, 0))
    
    count = 0
    while min_heap:
        val, arr_idx, elem_idx = heapq.heappop(min_heap)
        count += 1
        if count == k:
            return val
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, arr_idx, elem_idx + 1))
    
    raise ValueError("k larger than total elements")
```

**Related**: LeetCode 378 - Kth Smallest Element in a Sorted Matrix

---

### Form Variations Summary

| Form | Input | Output | Key Modification |
|------|-------|--------|------------------|
| **Median (Classic)** | Two arrays | Float | `half = (m+n+1)//2` |
| **Kth Smallest** | Two arrays, k | Integer | `k` instead of `half` |
| **Kth Largest** | Two arrays, k | Integer | `(m+n-k+1)`th smallest |
| **With Empty** | May have empty | Float/Int | Handle single array case |
| **K Arrays** | k arrays, k | Integer | Min-heap or D&C |
| **First Array Exhausted** | Very unbalanced | Integer | Early termination |

---

### Related Problems

| Problem | LeetCode | Difficulty | Form Type |
|---------|----------|------------|-----------|
| Median of Two Sorted Arrays | 4 | Hard | Median (Classic) |
| Kth Smallest in Sorted Matrix | 378 | Medium | K Arrays |
| Find K Pairs with Smallest Sums | 373 | Medium | Kth from Two |
| Kth Largest Element in Array | 215 | Medium | Kth Largest |
| Kth Smallest in BST | 230 | Medium | Kth (Tree) |
| Median from Data Stream | 295 | Hard | Dynamic Median |

<!-- back -->
