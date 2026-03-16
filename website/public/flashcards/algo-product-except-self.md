## Product of Array Except Self

**Question:** Find product of all elements except self without division?

<!-- front -->

---

## Answer: Prefix + Suffix Products

### Solution
```python
def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n
    
    # Prefix products
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Suffix products
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result
```

### Visual: Prefix × Suffix
```
Input: [1, 2, 3, 4]

Prefix: [1, 1, 2, 6]
        result[i] = product of all left elements

Suffix: [24, 12, 4, 1]  
        multiply product of all right elements

Final:  [24, 12, 8, 6]
        1×24, 1×12, 2×4, 6×1
```

### ⚠️ Tricky Parts

#### 1. Two-Pass Approach
```python
# Pass 1: prefix products
# result[i] = product of all elements to the left

# Pass 2: suffix products  
# multiply result[i] by product of all elements to right

# Avoids division entirely
```

#### 2. Why Initialize with 1?
```python
# First element has no left elements → product = 1
# Last element has no right elements → product = 1

# Start with 1, multiply as we go
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Prefix-Suffix | O(n) | O(1)* |

*Excluding output array

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using division | Use prefix-suffix approach |
| Not resetting suffix | Start suffix from end |
| Wrong initialization | Start with 1s |

<!-- back -->
