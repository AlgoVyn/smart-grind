## Array - Cyclic Sort: Framework

What is the complete code template for cyclic sort?

<!-- front -->

---

### Framework 1: Cyclic Sort Template

```
┌─────────────────────────────────────────────────────┐
│  CYCLIC SORT - TEMPLATE                              │
├─────────────────────────────────────────────────────┤
│  1. Initialize i = 0                                 │
│  2. While i < n:                                     │
│     a. correct_index = nums[i] - 1  (for range 1..n)│
│        OR correct_index = nums[i]   (for range 0..n-1)│
│     b. If nums[i] != nums[correct_index]:           │
│        - Swap nums[i] with nums[correct_index]      │
│        - (Don't increment i, check swapped element) │
│     c. Else:                                        │
│        - i += 1  (element in correct place)         │
│  3. Array is sorted                                  │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Basic Cyclic Sort

```python
def cyclic_sort(nums):
    """Sort array where nums[i] should be at index nums[i] - 1."""
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1  # For range [1..n]
        
        # If not at correct position and valid
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return nums
```

---

### Implementation: Find First Missing Positive

```python
def first_missing_positive(nums):
    """Find smallest missing positive integer."""
    n = len(nums)
    i = 0
    
    while i < n:
        # Place nums[i] at index nums[i] - 1 if possible
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first index where element != index + 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1
```

---

### Implementation: Find All Duplicates

```python
def find_duplicates(nums):
    """Find all duplicate numbers (each appears once or twice)."""
    result = []
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Elements not at correct index are duplicates
    for i in range(n):
        if nums[i] != i + 1:
            result.append(nums[i])
    
    return result
```

---

### Key Pattern Elements

| Element | Purpose | Note |
|---------|---------|------|
| `correct_idx` | Where element should be | `nums[i] - 1` for 1-based |
| Swap loop | Place element correctly | Don't advance if swapped |
| Range check | Skip invalid values | Negative or > n |
| Final scan | Find mismatches | Missing/duplicate identified |

<!-- back -->
