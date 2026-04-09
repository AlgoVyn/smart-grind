## Array - Product Except Self: Tactics

What are the advanced techniques for product except self?

<!-- front -->

---

### Tactic 1: Single Pass Optimization

```python
def product_except_self_single_pass(nums):
    """Build result in one pass from both ends."""
    n = len(nums)
    result = [1] * n
    
    # First pass: left products
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]
    
    # Second pass: multiply right products
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    
    return result
```

**Key**: Combine in result array, use scalar for right product

---

### Tactic 2: Handling Zeros

```python
def product_except_self_with_zeros(nums):
    """Explicit zero handling."""
    n = len(nums)
    zero_count = nums.count(0)
    
    if zero_count > 1:
        return [0] * n  # All products are 0
    
    if zero_count == 1:
        total_product = 1
        zero_index = nums.index(0)
        for i, num in enumerate(nums):
            if i != zero_index:
                total_product *= num
        result = [0] * n
        result[zero_index] = total_product
        return result
    
    # No zeros - use standard approach
    return product_except_self(nums)
```

---

### Tactic 3: Logarithm Alternative (Not Recommended)

```python
import math

def product_except_self_log(nums):
    """Using logarithms - for understanding only!"""
    n = len(nums)
    log_sum = sum(math.log(abs(x)) for x in nums if x != 0)
    
    result = []
    for num in nums:
        if num == 0:
            result.append(0)  # Can't use log
        else:
            result.append(int(round(math.exp(log_sum - math.log(abs(num))))))
    
    return result
```

**⚠️ Warning**: Floating point issues, doesn't handle zeros well

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Using division | Fails on zeros | Use prefix/suffix |
| Integer overflow | Large products | Use appropriate types |
| Wrong initialization | First/last element wrong | Start prefix/suffix with 1 |
| Off-by-one in loops | Missing elements | Check loop ranges |
| Modifying input | Side effects | Copy array if needed |

---

### Tactic 5: Modulo Version

```python
def product_except_self_modulo(nums, mod):
    """Product with modulo for large numbers."""
    n = len(nums)
    prefix = [1] * n
    suffix = [1] * n
    
    for i in range(1, n):
        prefix[i] = (prefix[i - 1] * nums[i - 1]) % mod
    
    for i in range(n - 2, -1, -1):
        suffix[i] = (suffix[i + 1] * nums[i + 1]) % mod
    
    return [(prefix[i] * suffix[i]) % mod for i in range(n)]
```

---

### Tactic 6: Space Optimized with Output Array

```python
def product_except_self_optimized(nums):
    """O(1) extra space using output array."""
    n = len(nums)
    result = [1] * n
    
    # Build left products in result
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]
    
    # Multiply with right products
    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]
    
    return result
```

**Key trick**: Result array doesn't count as extra space

<!-- back -->
