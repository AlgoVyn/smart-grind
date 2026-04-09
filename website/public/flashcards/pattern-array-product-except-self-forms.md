## Array - Product Except Self: Forms

What are the different variations of product except self?

<!-- front -->

---

### Form 1: Standard (Two Arrays)

```python
def product_except_self_standard(nums):
    """Standard approach with prefix and suffix arrays."""
    n = len(nums)
    prefix = [1] * n
    suffix = [1] * n
    
    for i in range(1, n):
        prefix[i] = prefix[i - 1] * nums[i - 1]
    
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i + 1] * nums[i + 1]
    
    return [prefix[i] * suffix[i] for i in range(n)]
```

**Space**: O(n), **Time**: O(n)

---

### Form 2: Space Optimized

```python
def product_except_self_optimized(nums):
    """O(1) extra space using output array."""
    n = len(nums)
    result = [1] * n
    
    # Left products in result
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]
    
    # Multiply right products
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    
    return result
```

**Space**: O(1) extra, **Time**: O(n)

---

### Form 3: With Zero Handling

```python
def product_except_self_zeros(nums):
    """Explicit handling of zeros."""
    n = len(nums)
    zero_count = sum(1 for x in nums if x == 0)
    
    if zero_count >= 2:
        return [0] * n
    
    if zero_count == 1:
        zero_idx = nums.index(0)
        product = 1
        for i, x in enumerate(nums):
            if i != zero_idx:
                product *= x
        result = [0] * n
        result[zero_idx] = product
        return result
    
    # No zeros
    return product_except_self_optimized(nums)
```

**Handles**: Edge cases with zeros

---

### Form 4: With Indices

```python
def product_except_self_with_indices(nums, exclude_idx):
    """Product except specific index."""
    n = len(nums)
    
    # Build prefix up to exclude_idx
    prefix = 1
    for i in range(exclude_idx):
        prefix *= nums[i]
    
    # Build suffix after exclude_idx
    suffix = 1
    for i in range(exclude_idx + 1, n):
        suffix *= nums[i]
    
    return prefix * suffix
```

**Use**: Single query variant

---

### Form Comparison

| Form | Space | Time | Best For |
|------|-------|------|----------|
| Standard | O(n) | O(n) | Learning, clarity |
| Optimized | O(1) | O(n) | **Production, interviews** |
| With zeros | O(1) | O(n) | Edge case handling |
| Single index | O(1) | O(n) | One-time queries |

<!-- back -->
