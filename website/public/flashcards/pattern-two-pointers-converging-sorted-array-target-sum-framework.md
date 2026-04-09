## Two Pointers - Converging (Sorted Array Target Sum): Framework

What is the complete code template for converging two-pointer solutions on sorted arrays?

<!-- front -->

---

### Framework: Basic Converging Two Pointers

```
┌─────────────────────────────────────────────────────┐
│  CONVERGING TWO POINTERS - TARGET SUM                │
├─────────────────────────────────────────────────────┤
│  1. Initialize: left = 0, right = len(arr) - 1     │
│  2. While left < right:                              │
│     a. Calculate current_sum = arr[left] + arr[right]│
│     b. If current_sum == target:                     │
│          Return [left, right] (or 1-based indices)  │
│     c. If current_sum < target:                      │
│          Move left right: left += 1                  │
│     d. If current_sum > target:                      │
│          Move right left: right -= 1                 │
│  3. Return empty (no solution)                       │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    """
    Find two numbers in sorted array that add up to target.
    Returns 1-based indices (LeetCode standard).
    
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-based
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []
```

---

### Framework: Find All Unique Pairs

```python
def find_all_pairs(numbers: list[int], target: int) -> list[list[int]]:
    """Find ALL unique pairs that sum to target."""
    left, right = 0, len(numbers) - 1
    result = []
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            result.append([left, right])
            # Skip duplicates
            left_val, right_val = numbers[left], numbers[right]
            while left < right and numbers[left] == left_val:
                left += 1
            while left < right and numbers[right] == right_val:
                right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```

---

### Quick Reference

| Scenario | Movement Rule |
|----------|---------------|
| Sum < Target | `left++` (need larger sum) |
| Sum > Target | `right--` (need smaller sum) |
| Sum == Target | Found! Return indices |
| Sorted? | **REQUIRED** - Pattern only works on sorted arrays |

<!-- back -->
