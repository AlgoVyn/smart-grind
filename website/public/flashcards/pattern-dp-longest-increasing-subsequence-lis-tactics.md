## DP - Longest Increasing Subsequence (LIS): Tactics

What are the key implementation tactics for LIS?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| `bisect_left` for strict | Correctly handles strictly increasing |
| `bisect_right` for non-decreasing | Allows equal elements |
| Negate values | Convert LIS to LDS (decreasing) |
| Reverse array | Convert LIS from left to LIS from right |
| Coordinate compression | Handle large value ranges efficiently |
| Track parent pointers | Enable actual subsequence reconstruction |

---

### Tactic 1: LIS to LDS (Longest Decreasing Subsequence)

```python
# Method 1: Negate all values
nums = [5, 4, 3, 2, 1]
negated = [-x for x in nums]  # [-5, -4, -3, -2, -1]
lds_length = length_of_lis(negated)  # Returns 5

# Method 2: Reverse comparison operator
for j in range(i):
    if nums[j] > nums[i]:  # Changed < to >
        dp[i] = max(dp[i], dp[j] + 1)
```

---

### Tactic 2: Full Reconstruction with O(n log n)

```python
def lis_reconstruct(nums):
    """Returns the actual LIS sequence using O(n log n) approach."""
    if not nums:
        return []
    
    n = len(nums)
    tails = []  # (value, original_index)
    parent = [-1] * n  # parent[i] = predecessor index
    tail_indices = []  # indices of elements in tails
    
    for i, num in enumerate(nums):
        # Binary search on values in tails
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo + hi) // 2
            if tails[mid][0] < num:
                lo = mid + 1
            else:
                hi = mid
        
        # Set parent if extending
        if lo > 0:
            parent[i] = tail_indices[lo - 1]
        
        # Update tails
        if lo == len(tails):
            tails.append((num, i))
            tail_indices.append(i)
        else:
            tails[lo] = (num, i)
            tail_indices[lo] = i
    
    # Reconstruct from last element
    result = []
    idx = tail_indices[-1]
    while idx != -1:
        result.append(nums[idx])
        idx = parent[idx]
    
    return result[::-1]
```

---

### Tactic 3: Binary Search Functions

```python
import bisect

# Python bisect module reference
tails = [2, 5, 7, 10]

bisect.bisect_left(tails, 6)   # Returns 2 (first position >= 6)
bisect.bisect_right(tails, 5)  # Returns 2 (first position > 5)

# Custom binary search (for languages without bisect)
def lower_bound(arr, target):
    """Find first index where arr[idx] >= target"""
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

---

### Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Wrong binary search function | `bisect_left` vs `bisect_right` | Match strict vs non-strict requirement |
| Thinking tails is the LIS | tails array != actual subsequence | Track parent pointers for reconstruction |
| Empty array | Runtime error | Return 0 or [] early |
| Single element | Edge case | Handle n=1 (answer is 1) |
| All decreasing | Returns 1 | Correct - each element is LIS of length 1 |
| Integer overflow | Large DP values | Use appropriate data types |

---

### Testing Checklist

```python
def test_lis():
    # Basic case
    assert length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) == 4
    
    # Empty array
    assert length_of_lis([]) == 0
    
    # Single element
    assert length_of_lis([5]) == 1
    
    # All same elements (strict)
    assert length_of_lis([1, 1, 1, 1]) == 1
    
    # Strictly decreasing
    assert length_of_lis([5, 4, 3, 2, 1]) == 1
    
    # Strictly increasing
    assert length_of_lis([1, 2, 3, 4, 5]) == 5
    
    # Duplicates with valid subsequence
    assert length_of_lis([1, 3, 2, 3, 4]) == 4  # 1, 2, 3, 4
```

<!-- back -->
