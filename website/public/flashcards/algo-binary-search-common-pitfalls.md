## Binary Search: Common Pitfalls & Edge Cases

**Question:** What are the most common mistakes in binary search implementations?

<!-- front -->

---

## Answer: Understand the Boundaries

### Classic Template (Left <= Right)
```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:  # <= not <
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # +1 not mid
        else:
            right = mid - 1  # -1 not mid
    
    return -1
```

### Visual: Search Space Reduction
```
Array: [1, 3, 5, 7, 9, 11, 13]
Target: 7

Step 1: left=0, right=6, mid=3, nums[3]=7 → FOUND!

Array: [1, 3, 5, 7, 9, 11, 13]
Target: 6

Step 1: left=0, right=6, mid=3, nums[3]=7 > 6 → right=2
Step 2: left=0, right=2, mid=1, nums[1]=3 < 6 → left=2
Step 3: left=2, right=2, mid=2, nums[2]=5 < 6 → left=3
Step 4: left=3 > right=2 → NOT FOUND
```

### ⚠️ Critical Pitfalls

#### 1. Off-by-One Errors

| Condition | When to Use | Example |
|-----------|-------------|---------|
| `left <= right` | Search exact match | Find element |
| `left < right` | Finding boundary | Lower bound |
| `left + 1 < right` | Two-element case | Find peak |

#### 2. Integer Overflow
```python
# BAD: can overflow for large values
mid = (left + right) // 2

# GOOD: safe for all values
mid = left + (right - left) // 2

# Alternative: use unsigned right shift
mid = (left + right) >> 1
```

#### 3. Wrong Update Direction
```python
# Finding target: go opposite direction
if nums[mid] < target:
    left = mid + 1   # Target is bigger, go right
else:
    right = mid - 1  # Target is smaller, go left
```

#### 4. Missing +1 / -1
```python
# Without +1 can cause infinite loop!
# When left = right = mid, and condition is true:
left = mid   # WRONG - stuck in loop!
left = mid + 1  # CORRECT
```

### Edge Cases to Handle

#### Empty Array
```python
if not nums:
    return -1
```

#### Single Element
```python
if len(nums) == 1:
    return 0 if nums[0] == target else -1
```

#### Target Smaller Than All / Larger Than All
```python
# Algorithm handles these automatically with boundary checks
```

#### Duplicate Elements
```python
# Find first occurrence
while left < right:
    mid = (left + right) // 2
    if nums[mid] < target:
        left = mid + 1
    else:
        right = mid
# left is first occurrence
```

### ⚠️ Common Bugs Checklist

| Bug | Symptom | Fix |
|-----|---------|-----|
| Infinite loop | Never terminates | Use `<=` or add `+1`/`-1` |
| Overflow | Wrong mid calculation | Use `left + (right-left)//2` |
| Missing boundary check | IndexError | Check empty array first |
| Wrong comparison | Wrong result | `<` vs `<=` matters |
| Wrong sort order | Infinite loop | Ensure array is sorted |

### Template Variations

#### Find Left Boundary
```python
def left_bound(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return left  # or right + 1
```

#### Find Right Boundary
```python
def right_bound(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] <= target:
            left = mid + 1
        else:
            right = mid - 1
    
    return right  # or left - 1
```

### When Binary Search Doesn't Work
- **Unsorted arrays** - must sort first
- **Rotated arrays** - need modified algorithm
- **Duplicates with unknown pattern** - may need linear search

<!-- back -->
