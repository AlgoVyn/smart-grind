## Maximum Product Subarray

**Question:** Maximum product of contiguous subarray?

<!-- front -->

---

## Answer: Track Both Min and Max

### Solution
```python
def maxProduct(nums):
    if not nums:
        return 0
    
    max_prod = nums[0]
    min_prod = nums[0]
    result = nums[0]
    
    for i in range(1, len(nums)):
        # Must track both because negative * negative = positive
        if nums[i] < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(nums[i], max_prod * nums[i])
        min_prod = min(nums[i], min_prod * nums[i])
        
        result = max(result, max_prod)
    
    return result
```

### Visual: Tracking Both
```
nums = [2, 3, -2, 4]

i=1: nums[1]=3
     max_prod = max(3, 2*3) = 6
     min_prod = min(3, 2*3) = 3
     result = 6

i=2: nums[2]=-2 (< 0, swap)
     max_prod, min_prod = 3, 6
     max_prod = max(-2, 3*-2) = -2
     min_prod = min(-2, 6*-2) = -12
     result = max(6, -2) = 6

i=3: nums[3]=4
     max_prod = max(4, -2*4) = 4
     min_prod = min(4, -12*4) = -48
     result = max(6, 4) = 6

Answer: 6
```

### ⚠️ Tricky Parts

#### 1. Why Track Minimum?
```python
# Negative * Negative = Positive
# Need to know minimum because:
# If current is negative
# And min is negative
# Their product could be max

# Example: [-1, 8, -2]
# At 8: max=8, min=-8
# At -2: max = max(-2, 8*-2) = -2
#        min = min(-2, -8*-2) = -16

# But answer should be 16 (8 * -2)!
```

#### 2. Why Swap on Negative?
```python
# When nums[i] < 0:
# - Previous max becomes new min
# - Previous min becomes new max

# This is because we're about to multiply by negative
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Track min/max | O(n) | O(1) |
| Brute Force | O(n²) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Only tracking max | Track both min and max |
| Not swapping | Swap on negative number |
| Wrong initialization | Start with first element |

<!-- back -->
