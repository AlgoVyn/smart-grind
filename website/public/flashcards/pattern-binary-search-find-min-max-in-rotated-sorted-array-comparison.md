## Binary Search - Find Min/Max in Rotated Sorted Array: Comparison

How do the different approaches for finding min/max in rotated sorted arrays compare?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **Compare with Right** | O(log n) | O(1) | Most robust, clean logic | None significant |
| **Compare with Left** | O(log n) | O(1) | Symmetric, intuitive | Slightly more edge cases |
| **Linear Scan** | O(n) | O(1) | Simple, handles duplicates | Not optimal |
| **Two-Step (Find Pivot + Search)** | O(log n) | O(1) | Modular, reusable | Two passes needed |

---

### Comparison by Scenario

```
Scenario 1: Standard rotated array
┌─────────────────────────────────────────────────────────┐
│ Array: [4, 5, 6, 7, 0, 1, 2]                           │
│                                                         │
│ Compare with Right:  O(log n) ≈ 3 iterations      ✓✓   │
│ Compare with Left:   O(log n) ≈ 3 iterations       ✓✓   │
│ Linear Scan:         O(n) = 7 iterations          ✗    │
└─────────────────────────────────────────────────────────┘

Scenario 2: Not rotated (already sorted)
┌─────────────────────────────────────────────────────────┐
│ Array: [1, 2, 3, 4, 5]                                  │
│                                                         │
│ Compare with Right:  O(log n) - returns first elem ✓✓   │
│ Compare with Left:   O(log n) - works correctly     ✓✓   │
│ Linear Scan:         O(n) - unnecessary work        ✗    │
└─────────────────────────────────────────────────────────┘

Scenario 3: Array with duplicates
┌─────────────────────────────────────────────────────────┐
│ Array: [1, 1, 1, 0, 1] or [1, 0, 1, 1, 1]               │
│                                                         │
│ Standard BS:         May fail or infinite loop      ✗    │
│ Modified (shrink):   O(n) worst case                △    │
│ Linear Scan:         O(n), guaranteed correct       △    │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation Comparison

```python
# Compare with Right (Recommended)
def findMin_right(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:    # Key comparison
            left = mid + 1
        else:
            right = mid
    return nums[left]


# Compare with Left (Alternative)
def findMin_left(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < nums[left]:     # Key comparison
            right = mid
        else:
            left = mid + 1
    return nums[left]


# Linear Scan (Naive)
def findMin_linear(nums):
    return min(nums)  # O(n) - not optimal
```

---

### When to Use Each

| Situation | Recommendation |
|-----------|---------------|
| Standard problem (no duplicates) | **Compare with Right** |
| Want symmetric logic | Compare with Left |
| Array has duplicates | Modified with shrinking, or linear scan |
| Need both min and max | Compare with Right (single pass) |
| Also need to search elements | Two-Step approach (find pivot first) |
| Coding interview | Compare with Right (shows understanding) |
| Production code | Compare with Right (clean, efficient) |

---

### Key Insight

**Why Compare with Right Wins:**

```
Array: [3, 4, 5, 1, 2]

Compare mid with right:
- nums[mid]=5, nums[right]=2
- 5 > 2 → clear signal that pivot is to the right

Compare mid with left:
- nums[mid]=5, nums[left]=3  
- 5 > 3 → could mean we're in left sorted portion
  OR array is not rotated
- Less definitive signal
```

The right-side comparison gives a clearer signal about where the pivot lies.

<!-- back -->
