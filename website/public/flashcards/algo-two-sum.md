## Two Sum

**Question:** Find two numbers that add to target?

<!-- front -->

---

## Answer: Hash Map

### Solution
```python
def twoSum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []
```

### Visual: Hash Map
```
nums = [2, 7, 11, 15], target = 9

i=0, num=2, complement=7
        7 not in seen
        seen = {2: 0}

i=1, num=7, complement=2  
        2 in seen! → return [0, 1]
```

### ⚠️ Tricky Parts

#### 1. Why Store Index, Not Just Value?
```python
# Need to return indices, not just values
# seen stores: value → index

# Can't just store indices because:
# nums = [3, 3], target = 6
# Need two different indices
```

#### 2. Order Matters
```python
# Solution finds pair where second appears AFTER first
# This is fine for "any order" problems
# For sorted array, might need two pointers
```

#### 3. Sorted Array Variant
```python
def twoSumSorted(nums, target):
    left, right = 0, len(nums) - 1
    
    while left < right:
        current = nums[left] + nums[right]
        
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    
    return []
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Hash Map | O(n) | O(n) |
| Two Pointers | O(n log n) | O(1) |
| Brute Force | O(n²) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong complement | target - num |
| Not storing index | seen[num] = i |
| Returning value | Return indices |

<!-- back -->
