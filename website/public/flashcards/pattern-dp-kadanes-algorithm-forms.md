## DP - Kadane's Algorithm: Forms

What are the different variations of Kadane's algorithm?

<!-- front -->

---

### Form 1: Classic Maximum Subarray

```python
def max_subarray(nums):
    """Classic Kadane's algorithm."""
    if not nums:
        return 0
    
    current_max = global_max = nums[0]
    
    for num in nums[1:]:
        current_max = max(num, current_max + num)
        global_max = max(global_max, current_max)
    
    return global_max
```

---

### Form 2: Maximum Subarray with Indices

```python
def max_subarray_indices(nums):
    """Return sum and subarray indices."""
    if not nums:
        return 0, -1, -1
    
    current_max = global_max = nums[0]
    start = end = temp_start = 0
    
    for i in range(1, len(nums)):
        if nums[i] > current_max + nums[i]:
            current_max = nums[i]
            temp_start = i
        else:
            current_max += nums[i]
        
        if current_max > global_max:
            global_max = current_max
            start = temp_start
            end = i
    
    return global_max, start, end
```

---

### Form 3: Minimum Subarray

```python
def min_subarray(nums):
    """Find minimum sum subarray."""
    if not nums:
        return 0
    
    current_min = global_min = nums[0]
    
    for num in nums[1:]:
        current_min = min(num, current_min + num)
        global_min = min(global_min, current_min)
    
    return global_min
```

---

### Form 4: Circular Maximum Subarray

```python
def max_subarray_circular(nums):
    """Maximum subarray in circular array."""
    n = len(nums)
    
    # Standard max subarray
    max_linear = max_subarray(nums)
    
    # Total sum
    total = sum(nums)
    
    # Min subarray (for circular case)
    min_sub = min_subarray(nums)
    
    # Edge case: all negative
    if total == min_sub:
        return max_linear
    
    # Circular: total - min_subarray
    return max(max_linear, total - min_sub)
```

---

### Form 5: Maximum Product Subarray

```python
def max_product_subarray(nums):
    """Find subarray with maximum product."""
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        # Track both max and min (negatives flip)
        choices = [num, max_prod * num, min_prod * num]
        max_prod = max(choices)
        min_prod = min(choices)
        result = max(result, max_prod)
    
    return result
```

---

### Form Comparison

| Form | Problem | Key Modification |
|------|---------|-------------------|
| Classic | Max sum | Standard greedy |
| With indices | Max sum + location | Track start/end |
| Minimum | Min sum | Use `min` instead |
| Circular | Wrap-around array | Compare linear vs circular |
| Product | Max product | Track both max and min |

<!-- back -->
