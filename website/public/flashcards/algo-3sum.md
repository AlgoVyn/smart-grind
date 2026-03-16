## 3Sum

**Question:** Find all unique triplets that sum to zero?

<!-- front -->

---

## Answer: Sort + Two Pointers

### Solution
```python
def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Two pointers for remaining two
        left = i + 1
        right = n - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            
            elif total < 0:
                left += 1
            else:
                right -= 1
    
    return result
```

### Visual: 3Sum Process
```
Sorted: [-4, -1, -1, 0, 1, 2]

i = 0: -4
  left = 1, right = 5
  -4 + (-1) + 2 = -3 < 0 → left++
  
i = 1: -1
  left = 2, right = 5
  -1 + (-1) + 2 = 0 → found! → [-1, -1, 2]
  
  Move both pointers, skip duplicates
```

### ⚠️ Tricky Parts

#### 1. Why Sort First?
```python
# Enables two-pointer technique
# Easy to skip duplicates
# Helps early termination
```

#### 2. Duplicate Skipping
```python
# Three places need duplicate checks:
# 1. nums[i] - skip same first element
# 2. nums[left] - skip same second
# 3. nums[right] - skip same third

# Always check after finding valid triplet
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Sort + Two Pointers | O(n²) | O(log n) for sort |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| No sorting | Sort input first |
| Missing duplicate checks | Skip duplicates at all levels |
| Not handling all cases | Move pointers correctly |

<!-- back -->
