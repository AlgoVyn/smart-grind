## DP - Kadane's Algorithm: Tactics

What are the advanced techniques for Kadane's algorithm?

<!-- front -->

---

### Tactic 1: Track Start/End Indices

```python
def kadane_with_indices(nums):
    """Find max subarray sum with its indices."""
    if not nums:
        return 0, -1, -1
    
    max_current = max_global = nums[0]
    current_start = 0
    best_start = best_end = 0
    
    for i in range(1, len(nums)):
        # Decision: start fresh or extend
        if nums[i] > max_current + nums[i]:
            max_current = nums[i]
            current_start = i
        else:
            max_current += nums[i]
        
        # Update global best
        if max_current > max_global:
            max_global = max_current
            best_start = current_start
            best_end = i
    
    return max_global, best_start, best_end
```

---

### Tactic 2: Circular Array (Max Subarray Sum Circular)

```python
def max_subarray_circular(nums):
    """Find max subarray sum in circular array."""
    n = len(nums)
    
    # Case 1: Non-circular (standard Kadane)
    max_linear = kadane(nums)
    
    # Case 2: Circular (wraps around)
    # Total - min_subarray = max_circular
    total = sum(nums)
    min_subarray = kadane_min(nums)
    
    # Edge case: all negative numbers
    if total == min_subarray:
        return max_linear
    
    return max(max_linear, total - min_subarray)

def kadane_min(nums):
    """Find minimum subarray sum."""
    min_current = min_global = nums[0]
    for num in nums[1:]:
        min_current = min(num, min_current + num)
        min_global = min(min_global, min_current)
    return min_global
```

---

### Tactic 3: K-Constrained Maximum Sum

```python
def max_sum_with_k_elements(nums, k):
    """Maximum sum of exactly k consecutive elements."""
    n = len(nums)
    if n < k:
        return 0
    
    # Sum of first k elements
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide window
    for i in range(k, n):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong initialization | Off-by-one | Start with first element, loop from second |
| Using `>=` vs `>` | Tie-breaking | Use `>` for strict max, affects indices |
| Empty array handling | Crash | Check `if not nums` first |
| All negative numbers | Returns 0 | Initialize with first element, not 0 |
| Integer overflow | Wrong result | Use appropriate data types |

---

### Tactic 5: Maximum Product Subarray

```python
def max_product_subarray(nums):
    """Find maximum product subarray."""
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        # Need both max and min because negatives flip
        choices = [num, max_prod * num, min_prod * num]
        max_prod = max(choices)
        min_prod = min(choices)
        
        result = max(result, max_prod)
    
    return result
```

**Key**: Track both max and min (negative × negative = positive)

---

### Tactic 6: Divide and Conquer Alternative

```python
def max_subarray_divide_conquer(nums):
    """O(n log n) alternative for understanding."""
    def helper(left, right):
        if left == right:
            return nums[left]
        
        mid = (left + right) // 2
        
        # Max in left half, right half, or crossing the middle
        left_max = helper(left, mid)
        right_max = helper(mid + 1, right)
        cross_max = max_crossing(left, mid, right)
        
        return max(left_max, right_max, cross_max)
    
    def max_crossing(left, mid, right):
        # Max sum starting from mid going left
        left_sum = float('-inf')
        current = 0
        for i in range(mid, left - 1, -1):
            current += nums[i]
            left_sum = max(left_sum, current)
        
        # Max sum starting from mid+1 going right
        right_sum = float('-inf')
        current = 0
        for i in range(mid + 1, right + 1):
            current += nums[i]
            right_sum = max(right_sum, current)
        
        return left_sum + right_sum
    
    return helper(0, len(nums) - 1)
```

<!-- back -->
