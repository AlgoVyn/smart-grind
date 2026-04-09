## Two Pointers - In-place Array Modification: Framework

What is the complete code template for two pointers in-place array modification?

<!-- front -->

---

### Framework: Read/Write Pointer Template

```
┌─────────────────────────────────────────────────────────────────┐
│  TWO POINTERS - IN-PLACE MODIFICATION TEMPLATE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Core Pointers:                                                    │
│  ┌──────────────┐                                                 │
│  │ READ (fast)  │  → Scans entire array, examines each element  │
│  │ WRITE (slow) │  → Tracks position for valid elements          │
│  └──────────────┘                                                 │
│                                                                   │
│  1. Initialize write = 0                                          │
│                                                                   │
│  2. For each element with read pointer:                          │
│     - Check if element meets condition                             │
│     - If valid: nums[write] = nums[read], write++                  │
│     - read always increments                                       │
│                                                                   │
│  3. Return write (new length of valid elements)                   │
│                                                                   │
│  Key: Write pointer never exceeds read pointer                    │
│       → No data loss from overwriting                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard Overwrite Approach

```python
def two_pointers_inplace(nums, condition):
    """
    Two Pointers - In-place Array Modification template.
    
    Args:
        nums: List of elements to modify in-place
        condition: Function that returns True if element should be kept
        
    Returns:
        The new length of the modified array
    """
    write = 0  # Write pointer for valid elements
    
    for read in range(len(nums)):  # Read pointer scans array
        if condition(nums[read]):
            nums[write] = nums[read]  # Place valid element
            write += 1  # Move write pointer
    
    return write  # New length of array
```

---

### Implementation: Two Pointers with Swap (Partitioning)

```python
def two_pointers_swap(nums, condition):
    """
    Two Pointers with swapping for partitioning.
    Useful when order doesn't need to be preserved.
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        # Skip valid elements on the left
        while left <= right and condition(nums[left]):
            left += 1
        
        # Skip invalid elements on the right
        while left <= right and not condition(nums[right]):
            right -= 1
        
        # Swap if pointers haven't crossed
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    return left  # Partition point
```

---

### Key Framework Elements

| Element | Purpose | Initial Value |
|---------|---------|---------------|
| `read` | Scan all elements | `0` or loop variable |
| `write` | Position for valid elements | `0` |
| `left` | Left boundary for swap | `0` |
| `right` | Right boundary for swap | `len(nums) - 1` |

---

### Decision Tree: Which Pattern?

```
Problem requires in-place modification?
├── Need to preserve relative order?
│   └── Use Fast/Slow (overwrite)
│   └── Return new length k
│   └── O(n) time, O(1) space
│
├── Order doesn't matter?
│   └── Use Two Pointers with Swap
│   └── Partition array in-place
│   └── O(n) time, O(1) space
│
├── Three distinct values to sort?
│   └── Use Dutch National Flag (3 pointers)
│   └── low, mid, high pointers
│   └── O(n) time, O(1) space
│
└── Minimize write operations?
    └── Replace with last element
    └── Doesn't preserve order
    └── O(n) time, O(1) space
```

<!-- back -->
