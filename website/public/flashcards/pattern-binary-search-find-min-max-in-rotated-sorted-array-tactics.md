## Binary Search - Find Min/Max in Rotated Sorted Array: Tactics

What are the advanced techniques and edge cases for finding min/max in rotated sorted arrays?

<!-- front -->

---

### Tactic 1: Compare with Right vs Compare with Left

**Compare with Right (Recommended)**
```python
if nums[mid] > nums[right]:
    left = mid + 1      # Min in right half
else:
    right = mid         # Min at mid or left
```
- More robust and intuitive
- Handles edge cases better
- Standard approach for LeetCode 153

**Compare with Left (Alternative)**
```python
if nums[mid] < nums[left]:
    right = mid         # Min in left half
else:
    left = mid + 1      # Min in right half
```
- Symmetric logic
- Slightly different boundary handling

---

### Tactic 2: Handling Duplicates (LeetCode 154)

**Problem**: `[1, 1, 1, 1]` - can't determine which half contains min

**Solution**: Shrink boundary when ambiguous

```python
def findMinWithDuplicates(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        elif nums[mid] < nums[right]:
            right = mid
        else:
            # nums[mid] == nums[right], ambiguous
            # Shrink right boundary
            right -= 1
    
    return nums[left]
```

**Complexity**: O(n) worst case with many duplicates

---

### Tactic 3: Finding Rotation Count

The rotation count equals the **index of the minimum element**:

```python
def findRotationCount(nums):
    """
    Returns how many times array was rotated.
    Example: [3,4,5,1,2] was rotated 3 times from [1,2,3,4,5]
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return left  # This is the rotation count
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Using `<=` in loop** | May cause infinite loop | Use `left < right` for min search |
| **Integer overflow** | `(left + right) // 2` | Use `left + (right - left) // 2` |
| **Single element** | Edge case | Returns that element correctly |
| **Non-rotated array** | Already sorted | Works correctly (returns first element) |
| **Empty array** | Crash | Check `if not nums` before processing |
| **Wrong comparison** | `nums[mid] > nums[left]` | Use `nums[mid] > nums[right]` |
| **Off-by-one for max** | Wrong max index | Use `(min_idx - 1 + n) % n` |

---

### Tactic 5: Finding Both Min and Max in O(log n)

```python
def findBothMinMax(nums):
    """
    Finds both min and max in O(log n) time.
    Key insight: Max is always right before min in rotated array.
    """
    if len(nums) == 1:
        return nums[0], nums[0]
    
    # Single binary search to find min
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    min_val = nums[left]
    max_val = nums[(left - 1) % len(nums)]
    
    return min_val, max_val
```

**Optimization**: One binary search gives both values!

---

### Tactic 6: Two-Step Search (Search After Finding Pivot)

Alternative approach for searching in rotated array:

```python
def searchRotated(nums, target):
    # Step 1: Find pivot (minimum index)
    pivot = findMinIndex(nums)
    
    # Step 2: Decide which half to search
    if target >= nums[pivot] and target <= nums[-1]:
        # Target in right sorted half
        return binary_search(nums, target, pivot, len(nums) - 1)
    else:
        # Target in left sorted half
        return binary_search(nums, target, 0, pivot - 1)
```

**Trade-off**: Two O(log n) passes vs one modified pass

<!-- back -->
