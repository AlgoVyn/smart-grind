## Binary Search - Rotated Array: Tactics

What are the advanced techniques for binary search on rotated arrays?

<!-- front -->

---

### Tactic 1: Handling Duplicates

**Problem**: `[1, 1, 1, 1, 1]` - can't determine which half is sorted

**Solution**: Shrink boundaries when all three are equal

```python
def search_rotated_duplicates(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return True
        
        # Ambiguous case - shrink
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:  # Left sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return False
```

**Complexity**: O(n) worst case with duplicates

---

### Tactic 2: Finding Peak in Mountain Array

```python
def peak_index_mountain_array(arr):
    """Find peak in [inc...dec] array."""
    left, right = 0, len(arr) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] < arr[mid + 1]:
            # Still ascending
            left = mid + 1
        else:
            # At or past peak
            right = mid
    
    return left
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Using <= vs <** | Infinite loop | Use `left < right` for min, `left <= right` for search |
| **Wrong sorted check** | Off-by-one in comparison | `nums[left] <= nums[mid]` for left sorted |
| **Boundary errors** | Missing target | Include/exclude mid correctly |
| **Duplicate handling** | Infinite loop or wrong answer | Shrink when ambiguous |
| **Single element** | Edge case | Works with proper conditions |

---

### Tactic 4: Find in Sorted but Unknown Length

```python
def search_unknown_length(reader, target):
    """Search in array with unknown length using exponential search."""
    # Find upper bound exponentially
    right = 1
    while reader.get(right) < target:
        right *= 2
    
    # Binary search in [right//2, right]
    left = right // 2
    
    while left <= right:
        mid = left + (right - left) // 2
        val = reader.get(mid)
        
        if val == target:
            return mid
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

---

### Tactic 5: Two-Step Search Strategy

**Alternative approach**: Find pivot first, then normal binary search

```python
def search_two_step(nums, target):
    # Step 1: Find pivot (minimum index)
    pivot = find_pivot(nums)
    
    # Step 2: Determine which half to search
    if target >= nums[pivot] and target <= nums[-1]:
        # In right half (including pivot)
        return binary_search(nums, target, pivot, len(nums) - 1)
    else:
        # In left half
        return binary_search(nums, target, 0, pivot - 1)
```

**Trade-off**: Two O(log n) passes vs single modified binary search

<!-- back -->
