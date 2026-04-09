## Binary Search - On Sorted Array/List: Tactics

What are the advanced techniques and edge cases for binary search on sorted arrays?

<!-- front -->

---

### Tactic 1: Prevent Integer Overflow

**Problem**: `(low + high) // 2` can overflow with large indices

**Solution**: Use `low + (high - low) // 2`

```python
# Wrong (can overflow)
mid = (low + high) // 2

# Correct (safe)
mid = low + (high - low) // 2
```

---

### Tactic 2: Finding First Occurrence (Lower Bound)

When duplicates exist, find the **first** occurrence:

```python
def find_first(nums, target):
    low, high = 0, len(nums) - 1
    answer = -1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] >= target:
            if nums[mid] == target:
                answer = mid  # Save position, keep searching left
            high = mid - 1
        else:
            low = mid + 1
    
    return answer
```

---

### Tactic 3: Finding Last Occurrence (Upper Bound - 1)

Find the **last** occurrence of target:

```python
def find_last(nums, target):
    low, high = 0, len(nums) - 1
    answer = -1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] <= target:
            if nums[mid] == target:
                answer = mid  # Save position, keep searching right
            low = mid + 1
        else:
            high = mid - 1
    
    return answer
```

---

### Tactic 4: Count Occurrences

Use lower bound and upper bound together:

```python
def count_occurrences(nums, target):
    """Count how many times target appears."""
    first = lower_bound(nums, target)
    last = upper_bound(nums, target) - 1
    
    if first <= last and nums[first] == target:
        return last - first + 1
    return 0

# Or simply:
count = upper_bound(nums, target) - lower_bound(nums, target)
```

---

### Tactic 5: Search Insert Position

Return index where target should be inserted:

```python
def search_insert(nums, target):
    """Return index to insert target while maintaining sorted order."""
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return low  # This is the insertion position!
```

---

### Tactic 6: Common Pitfalls

| Pitfall | Issue | Solution |
|---------|-------|----------|
| **Off-by-one** | Wrong loop condition | Use `<=` for inclusive search |
| **Infinite loop** | Not updating pointers correctly | Always move `mid + 1` or `mid - 1` |
| **Wrong direction** | Confusing < and > | Remember: `< target` means search right |
| **Empty array** | Not handling edge case | Check `if not nums: return -1` |
| **Single element** | Array of length 1 | Ensure bounds are correct |

---

### Tactic 7: Recursive Implementation

More elegant but uses O(log n) stack space:

```python
def binary_search_recursive(nums, target):
    def helper(low, high):
        if low > high:
            return -1
        
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            return helper(mid + 1, high)
        else:
            return helper(low, mid - 1)
    
    return helper(0, len(nums) - 1)
```

<!-- back -->
