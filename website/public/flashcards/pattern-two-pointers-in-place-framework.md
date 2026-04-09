## Two Pointers - In-Place Array Modification: Framework

What is the complete code template for in-place array modification?

<!-- front -->

---

### Framework 1: Remove Element Template

```
┌─────────────────────────────────────────────────────┐
│  IN-PLACE REMOVE - TEMPLATE                          │
├─────────────────────────────────────────────────────┤
│  1. Initialize write = 0                           │
│  2. For read from 0 to n-1:                         │
│     a. If arr[read] != target:                      │
│        - arr[write] = arr[read]                   │
│        - write += 1                                │
│  3. Return write (new length)                       │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def remove_element(nums, val):
    """Remove all instances of val in-place, return new length."""
    write = 0
    
    for read in range(len(nums)):
        if nums[read] != val:
            nums[write] = nums[read]
            write += 1
    
    return write
```

---

### Framework 2: Move Zeroes Template

```python
def move_zeroes(nums):
    """Move all zeros to end while maintaining relative order."""
    write = 0
    
    # First pass: move non-zero elements forward
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    
    # Second pass: fill remaining with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1
```

---

### Framework 3: Sort Colors (Dutch National Flag)

```python
def sort_colors(nums):
    """Sort array of 0s, 1s, and 2s in-place."""
    left, curr, right = 0, 0, len(nums) - 1
    
    while curr <= right:
        if nums[curr] == 0:
            nums[left], nums[curr] = nums[curr], nums[left]
            left += 1
            curr += 1
        elif nums[curr] == 2:
            nums[curr], nums[right] = nums[right], nums[curr]
            right -= 1
            # Don't increment curr, need to check swapped element
        else:  # nums[curr] == 1
            curr += 1
```

---

### Key Pattern Elements

| Element | Purpose | Variation |
|---------|---------|-----------|
| read pointer | Scan array | For loop or while |
| write pointer | Track valid position | Increment conditionally |
| Condition | Decide what to keep | Based on value |
| Overwrite | Replace in-place | nums[write] = nums[read] |

<!-- back -->
