## DP - 1D Array (Kadane's Algorithm): Tactics

What are the advanced techniques and variations for Kadane's Algorithm?

<!-- front -->

---

### Tactic 1: Maximum Product Subarray

```python
def max_product_subarray(nums):
    """
    Track BOTH max and min because:
    negative * negative = positive
    LeetCode 152
    """
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        # Negative number swaps max and min
        if num < 0:
            max_prod, min_prod = min_prod, max_prod
        
        # Extend or restart for both
        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        
        result = max(result, max_prod)
    
    return result

# Trace: [2, 3, -2, 4]
# i=0: max=2, min=2, result=2
# i=1: max=6, min=3, result=6  (2*3 vs 3)
# i=2: swap, max=6, min=-12, result=6  (-2 vs -2*3)
# i=3: max=4, min=-48, result=6  (4 vs 6*-12)
```

---

### Tactic 2: Kadane's for Stock Problems

```python
def max_profit_single_transaction(prices):
    """
    LeetCode 121 - Best Time to Buy/Sell Stock
    Convert to max subarray on price differences
    """
    if len(prices) < 2:
        return 0
    
    # Kadane's on daily price changes
    max_current = max_global = 0
    
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i-1]
        max_current = max(0, max_current + diff)
        max_global = max(max_global, max_current)
    
    return max_global

# Alternative: Track min price seen so far
def max_profit_min_price(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit
```

---

### Tactic 3: Handling All-Edge Cases

```python
def kadane_robust(nums):
    """
    Handle all edge cases properly
    """
    # Empty array
    if not nums:
        return 0
    
    # Single element
    if len(nums) == 1:
        return nums[0]
    
    # All negative - Kadane still works!
    max_current = max_global = nums[0]
    
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)
    
    return max_global

# For problems requiring at least one element:
def kadane_at_least_one(nums):
    """Guaranteed non-empty input"""
    max_current = max_global = nums[0]
    
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)
    
    return max_global
```

---

### Tactic 4: 2D Extension (Maximum Sum Rectangle)

```python
def max_sum_rectangle(matrix):
    """
    LeetCode 363/85 - Maximum Sum Rectangle
    Compress rows and apply Kadane's
    """
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    max_sum = float('-inf')
    
    for left in range(cols):
        # Running sum for each row between left and right
        temp = [0] * rows
        
        for right in range(left, cols):
            # Add column 'right' to temp
            for i in range(rows):
                temp[i] += matrix[i][right]
            
            # Kadane's on temp (1D array)
            max_sum = max(max_sum, kadane(temp))
    
    return max_sum

def kadane(arr):
    max_current = max_global = arr[0]
    for num in arr[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)
    return max_global
```

---

### Tactic 5: Two-Pass for Circular with Constraints

```python
def max_subarray_circular_constrained(nums, k):
    """
    Maximum circular subarray with length constraint
    Uses deque for sliding window minimum
    """
    from collections import deque
    
    n = len(nums)
    # Concatenate for circular handling
    prefix = [0] * (2 * n + 1)
    
    for i in range(2 * n):
        prefix[i + 1] = prefix[i] + nums[i % n]
    
    # Monotonic deque: find min prefix in window
    max_sum = float('-inf')
    dq = deque()  # Store indices
    
    for i in range(1, 2 * n + 1):
        # Remove elements out of window (can't exceed length k)
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # Update max using min prefix in valid range
        if dq:
            max_sum = max(max_sum, prefix[i] - prefix[dq[0]])
        
        # Maintain monotonic increasing deque
        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()
        
        dq.append(i)
    
    return max_sum
```

---

### Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Initialize with 0 | Fails for all-negative | Use `nums[0]` |
| Not checking empty | Runtime error | `if not nums: return 0` |
| Confuse subarray/subsequence | Wrong answer | Subarray = contiguous |
| Circular without check | Returns total-min for all-neg | `if max_kadane < 0: return max_kadane` |
| Product without min tracking | Miss negative*negative | Track both max and min |
| Integer overflow (product) | Large numbers overflow | Use `float` or check bounds |

<!-- back -->
