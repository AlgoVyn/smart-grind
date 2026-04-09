## DP - 1D Array (Kadane's Algorithm): Forms & Variations

What are the different forms and variations of Kadane's Algorithm problems?

<!-- front -->

---

### Form 1: Standard Maximum Subarray

```python
def max_subarray_standard(nums):
    """
    LeetCode 53 - Maximum Subarray
    Classic form: Find max sum contiguous subarray
    """
    max_current = max_global = nums[0]
    
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)
    
    return max_global

# Example: [-2,1,-3,4,-1,2,1,-5,4]
# Output: 6 ([4,-1,2,1])
```

---

### Form 2: Minimum Subarray

```python
def min_subarray(nums):
    """
    Find minimum sum contiguous subarray
    Flip max to min
    """
    min_current = min_global = nums[0]
    
    for num in nums[1:]:
        min_current = min(num, min_current + num)
        min_global = min(min_global, min_current)
    
    return min_global

# Used in circular max subarray:
# max_circular = total_sum - min_subarray
```

---

### Form 3: Circular Maximum Subarray

```python
def max_subarray_circular(nums):
    """
    LeetCode 918 - Maximum Sum Circular Subarray
    Subarray can wrap from end to beginning
    """
    # Case 1: Non-circular (standard Kadane)
    def kadane_max(arr):
        max_cur = max_glob = arr[0]
        for num in arr[1:]:
            max_cur = max(num, max_cur + num)
            max_glob = max(max_glob, max_cur)
        return max_glob
    
    # Case 2: Circular = total - min_subarray
    def kadane_min(arr):
        min_cur = min_glob = arr[0]
        for num in arr[1:]:
            min_cur = min(num, min_cur + num)
            min_glob = min(min_glob, min_cur)
        return min_glob
    
    max_k = kadane_max(nums)
    min_k = kadane_min(nums)
    total = sum(nums)
    
    # Edge: all negative
    if max_k < 0:
        return max_k
    
    return max(max_k, total - min_k)

# Example: [5,-3,5]
# Non-circular max: 5
# Circular max: 5-3+5 = 7 (wraps around)
```

---

### Form 4: Maximum Product Subarray

```python
def max_product_subarray(nums):
    """
    LeetCode 152 - Maximum Product Subarray
    Track both max and min (negative flips)
    """
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        if num < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        result = max(result, max_prod)
    
    return result

# Example: [2,3,-2,4]
# Output: 6 ([2,3])
# Example: [-2,0,-1]
# Output: 0 ([0])
```

---

### Form 5: Maximum Absolute Sum Subarray

```python
def max_absolute_sum(nums):
    """
    LeetCode 1749 - Maximum Absolute Sum of Any Subarray
    Track both max and min, return max(|max|, |min|)
    """
    max_current = min_current = 0
    max_global = min_global = 0
    
    for num in nums:
        max_current = max(num, max_current + num)
        min_current = min(num, min_current + num)
        
        max_global = max(max_global, max_current)
        min_global = min(min_global, min_current)
    
    return max(max_global, abs(min_global))

# Or simply:
def max_absolute_sum_v2(nums):
    max_sum = min_sum = 0
    max_current = min_current = 0
    
    for num in nums:
        max_current = max(0, max_current + num)
        min_current = min(0, min_current + num)
        max_sum = max(max_sum, max_current)
        min_sum = min(min_sum, min_current)
    
    return max(max_sum, -min_sum)
```

---

### Form 6: Stock Profit (Kadane's on Differences)

```python
def max_profit_kadane(prices):
    """
    LeetCode 121 - Best Time to Buy/Sell Stock
    Kadane's on price differences
    """
    max_current = max_global = 0
    
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i-1]
        max_current = max(0, max_current + diff)
        max_global = max(max_global, max_current)
    
    return max_global

# Equivalent formulation:
def max_profit_min(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit
```

---

### Form 7: Maximum Sum with One Operation

```python
def max_sum_after_one_operation(nums):
    """
    LeetCode 1746 - Maximum Subarray Sum After One Operation
    Can square one element
    """
    n = len(nums)
    
    # dp_no_op[i] = max sum ending at i, no operation used
    # dp_with_op[i] = max sum ending at i, operation used
    
    no_op = nums[0]
    with_op = nums[0] * nums[0]
    max_sum = max(no_op, with_op)
    
    for i in range(1, n):
        # Don't use operation at i
        new_no_op = max(nums[i], no_op + nums[i])
        
        # Use operation at i OR already used before
        new_with_op = max(
            nums[i] * nums[i],           # Use op at i, start fresh
            with_op + nums[i],            # Already used, extend
            no_op + nums[i] * nums[i]      # Use op at i, extend prev
        )
        
        no_op, with_op = new_no_op, new_with_op
        max_sum = max(max_sum, no_op, with_op)
    
    return max_sum
```

---

### Form 8: Two Non-Overlapping Subarrays

```python
def max_two_non_overlapping(nums, firstLen, secondLen):
    """
    LeetCode 1031 - Maximum Sum of Two Non-Overlapping Subarrays
    Precompute max subarrays ending/starting at each position
    """
    n = len(nums)
    prefix = [0] * (n + 1)
    
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    # max_left[i] = max subarray of length firstLen in [0..i]
    # max_right[i] = max subarray of length secondLen in [i..n-1]
    
    def max_subarray_len(length):
        # Returns array: max_sub[i] = max sum of 'length' consecutive ending at/before i
        res = [0] * n
        max_sum = float('-inf')
        
        for i in range(length - 1, n):
            cur_sum = prefix[i + 1] - prefix[i + 1 - length]
            max_sum = max(max_sum, cur_sum)
            res[i] = max_sum
        
        return res
    
    # Left to right max for firstLen
    left_max = [0] * n
    max_sum = float('-inf')
    for i in range(firstLen - 1, n):
        cur = prefix[i + 1] - prefix[i + 1 - firstLen]
        max_sum = max(max_sum, cur)
        left_max[i] = max_sum
    
    # Right to left max for secondLen  
    right_max = [0] * n
    max_sum = float('-inf')
    for i in range(n - secondLen, -1, -1):
        cur = prefix[i + secondLen] - prefix[i]
        max_sum = max(max_sum, cur)
        right_max[i] = max_sum
    
    # Try all splits: first on left, second on right
    result = float('-inf')
    for i in range(firstLen - 1, n - secondLen):
        result = max(result, left_max[i] + right_max[i + 1])
    
    # Try: second on left, first on right
    # Reset left/right with swapped lengths
    # ... similar logic
    
    return result
```

---

### Form Comparison

| Form | Variation | Key Twist | Extra State |
|------|-----------|-----------|-------------|
| Standard | None | Basic extend/restart | 2 vars |
| Minimum | Flip min/max | Find min sum | 2 vars |
| Circular | Wrap-around | total - min_subarray | 2 Kadane runs |
| Product | Multiplication | Track max+min | 2 vars (swap) |
| Absolute | Max and min | max(|max|, |min|) | 4 vars |
| Stock | Differences | Kadane on diffs | 2 vars |
| One Op | Modification | With/without op state | 2 DP states |
| Two Subarrays | Non-overlapping | Precompute left/right | O(n) space |

<!-- back -->
