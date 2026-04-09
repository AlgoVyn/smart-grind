## Binary Search - Rotated Array: Forms

What are the different variations of binary search on rotated arrays?

<!-- front -->

---

### Form 1: Search Target

```python
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

---

### Form 2: Find Minimum

```python
def find_min(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return nums[left]
```

---

### Form 3: Search with Duplicates

```python
def search_with_duplicates(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return True
        
        # Can't determine which half is sorted
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return False
```

---

### Form 4: Find Rotation Count

```python
def rotation_count(nums):
    """Find how many times array was rotated."""
    n = len(nums)
    left, right = 0, n - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return left  # Index of minimum = rotation count
```

---

### Form Comparison

| Form | Comparison Target | Returns |
|------|-------------------|---------|
| Search | target | Index or -1 |
| Minimum | nums[right] | Minimum value |
| With Duplicates | Handle dups | Boolean |
| Rotation Count | nums[right] | Pivot index |

<!-- back -->
