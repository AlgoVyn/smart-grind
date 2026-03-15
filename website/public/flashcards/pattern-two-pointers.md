## Two Pointers Pattern

**Question:** When should you use the Two Pointers technique?

<!-- front -->

---

## Answer: Opposite or Same Direction

### When to Use
- Sorted array/string manipulation
- Finding pairs with certain sum
- Partitioning arrays

### Types

#### 1. Opposite Direction
```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr = arr[left] + arr[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
```

#### 2. Same Direction (Sliding Window)
```python
def min_subarray_len(target, nums):
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return min_len if min_len != float('inf') else 0
```

### Key Characteristics
| Feature | Value |
|---------|-------|
| Time | O(n) or O(n²) for pairs |
| Space | O(1) |
| Data Structure | Sorted input often needed |

### Common Problems
- Two Sum (sorted)
- 3 Sum
- 4 Sum
- Remove duplicates
- Partition array

<!-- back -->
