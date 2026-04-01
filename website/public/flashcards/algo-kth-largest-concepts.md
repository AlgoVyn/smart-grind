## Title: Kth Largest Element

What are the approaches for finding the kth largest element in an array?

<!-- front -->

---

### Problem
Given array A of n elements, find the kth largest (or smallest) element.

### Approaches Overview
| Method | Time | Space | Notes |
|--------|------|-------|-------|
| Sort | O(n log n) | O(1) or O(n) | Simple, modifies array |
| Min-Heap | O(n log k) | O(k) | Good for streaming |
| Max-Heap | O(n + k log n) | O(n) | Build heap, pop k |
| Quickselect | O(n) avg, O(n²) worst | O(1) | In-place, fastest avg |
| Median-of-Medians | O(n) worst | O(1) | Deterministic |

### Quickselect (Hoare's Selection)
```python
import random

def quickselect(nums, k):
    """Find kth smallest (0-indexed)"""
    if len(nums) == 1:
        return nums[0]
    
    pivot = random.choice(nums)
    lows = [x for x in nums if x < pivot]
    highs = [x for x in nums if x > pivot]
    pivots = [x for x in nums if x == pivot]
    
    if k < len(lows):
        return quickselect(lows, k)
    elif k < len(lows) + len(pivots):
        return pivots[0]
    else:
        return quickselect(highs, k - len(lows) - len(pivots))
```

---

### In-Place Quickselect
```python
def quickselect_inplace(nums, k):
    def partition(left, right, pivot_idx):
        pivot = nums[pivot_idx]
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        store_idx = left
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    def select(left, right, k):
        if left == right:
            return nums[left]
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        if k == pivot_idx:
            return nums[k]
        elif k < pivot_idx:
            return select(left, pivot_idx - 1, k)
        else:
            return select(pivot_idx + 1, right, k)
    
    return select(0, len(nums) - 1, k)
```

---

### Complexity Analysis
| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Sorting | O(n log n) | O(n log n) | O(n log n) | O(1)-O(n) |
| Heap | O(n log k) | O(n log k) | O(n log k) | O(k) |
| Quickselect | O(n) | O(n) | O(n²) | O(1) |
| Median-of-Medians | O(n) | O(n) | O(n) | O(1) |

<!-- back -->
