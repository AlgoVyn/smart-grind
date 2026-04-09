## Binary Search - Find Min/Max in Rotated Sorted Array: Problem Forms

What are the common variations and problem forms for min/max in rotated sorted arrays?

<!-- front -->

---

### Form 1: Find Minimum Element (Classic)

**Problem**: Return the minimum element value.

```python
# Input: [3, 4, 5, 1, 2]
# Output: 1
# Input: [4, 5, 6, 7, 0, 1, 2]
# Output: 0

def findMin(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]
```

**LeetCode**: 153 - Find Minimum in Rotated Sorted Array

---

### Form 2: Find Minimum with Duplicates

**Problem**: Array may contain duplicate values.

```python
# Input: [1, 3, 3, 3]
# Output: 1
# Input: [3, 3, 1, 3]
# Output: 1

def findMinWithDuplicates(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        elif nums[mid] < nums[right]:
            right = mid
        else:
            # Ambiguous - shrink
            right -= 1
    
    return nums[left]
```

**LeetCode**: 154 - Find Minimum in Rotated Sorted Array II

**Note**: Degrades to O(n) worst case with many duplicates

---

### Form 3: Find Maximum Element

**Problem**: Return the maximum element value.

```python
# Input: [3, 4, 5, 1, 2]
# Output: 5
# Input: [4, 5, 6, 7, 0, 1, 2]
# Output: 7

def findMax(nums):
    # Find minimum index first
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    # Maximum is right before minimum
    max_idx = (left - 1) % len(nums)
    return nums[max_idx]
```

**Key Insight**: Max is always at `(min_idx - 1 + n) % n`

---

### Form 4: Find Rotation Count (Pivot Index)

**Problem**: Determine how many positions the array was rotated.

```python
# Input: [3, 4, 5, 1, 2]  (originally [1, 2, 3, 4, 5])
# Output: 3  (rotated 3 times)

# Input: [1, 2, 3, 4, 5]  (not rotated)
# Output: 0

def findRotationCount(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return left  # Index of minimum = rotation count
```

**LeetCode**: Related to 153 (rotation count is min index)

---

### Form 5: Search in Rotated Sorted Array

**Problem**: Find target value in rotated sorted array.

```python
# Input: [4, 5, 6, 7, 0, 1, 2], target = 0
# Output: 4 (index of target)
# Input: [4, 5, 6, 7, 0, 1, 2], target = 3
# Output: -1 (not found)

def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Check which half is sorted
        if nums[left] <= nums[mid]:  # Left half sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

**LeetCode**: 33 - Search in Rotated Sorted Array

---

### Form Variations Summary

| Form | Return Type | Key Modification |
|------|-------------|------------------|
| Find Minimum | `int` (value) | Standard algorithm |
| Find Minimum with Duplicates | `int` (value) | Shrink when `nums[mid] == nums[right]` |
| Find Maximum | `int` (value) | `(min_idx - 1) % n` |
| Rotation Count | `int` (index) | Return index instead of value |
| Search Target | `int` (index or -1) | Check sorted half, then search |
| Find Both Min/Max | `Tuple[int, int]` | One search, compute both |

---

### Related Problems

| Problem | LeetCode # | Description |
|---------|------------|-------------|
| Search in Rotated Sorted Array II | 81 | With duplicates |
| Find Peak Element | 162 | Find local maximum |
| Find in Mountain Array | 1095 | Search in bitonic array |

<!-- back -->
