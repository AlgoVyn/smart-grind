## Binary Search: Finding Boundaries

**Question:** How do you find first occurrence vs last occurrence?

<!-- front -->

---

## Binary Search Boundaries

### Finding First Occurrence (Lower Bound)
```python
def first_occurrence(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid - 1
            if nums[mid] == target:
                result = mid  # Potential answer
        else:
            left = mid + 1
    
    return result
```

### Finding Last Occurrence (Upper Bound)
```python
def last_occurrence(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] <= target:
            left = mid + 1
            if nums[mid] == target:
                result = mid  # Potential answer
        else:
            right = mid - 1
    
    return result
```

### 💡 Key Pattern
| Search Type | Condition | Move When Found |
|-------------|-----------|----------------|
| **First** | `nums[mid] >= target` | Go left (`right = mid - 1`) |
| **Last** | `nums[mid] <= target` | Go right (`left = mid + 1`) |

<!-- back -->
