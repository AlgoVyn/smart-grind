## Two Pointers - In-Place Array Modification: Forms

What are the different variations of in-place array modification?

<!-- front -->

---

### Form 1: Remove Element

```python
def remove_element(nums, val):
    write = 0
    for read in range(len(nums)):
        if nums[read] != val:
            nums[write] = nums[read]
            write += 1
    return write
```

---

### Form 2: Remove Duplicates (Sorted Array)

```python
def remove_duplicates(nums):
    """Remove duplicates so each appears at most once."""
    if len(nums) <= 1:
        return len(nums)
    
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    
    return write
```

**Key**: Compare with previous element, not target value

---

### Form 3: Remove Duplicates (At Most Twice)

```python
def remove_duplicates_twice(nums):
    """Allow at most 2 occurrences of each element."""
    if len(nums) <= 2:
        return len(nums)
    
    write = 2
    for read in range(2, len(nums)):
        # Compare with element two positions back
        if nums[read] != nums[write - 2]:
            nums[write] = nums[read]
            write += 1
    
    return write
```

---

### Form 4: Move Zeroes

```python
def move_zeroes(nums):
    write = 0
    
    # Move non-zero forward
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    
    # Fill rest with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1
```

---

### Form 5: Merge Sorted Arrays (In-Place from End)

```python
def merge(nums1, m, nums2, n):
    """Merge nums2 into nums1 in-place."""
    # Start from end
    p1, p2, p = m - 1, n - 1, m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
```

**Pattern**: Three pointers - two read, one write from end

---

### Form Comparison

| Form | Condition | Direction | Special |
|------|-----------|-----------|---------|
| Remove Element | != val | Forward | Return new length |
| Remove Duplicates | != prev | Forward | Sorted only |
| Move Zeroes | != 0 | Forward + fill | Two phases |
| Merge Sorted | Compare values | Backward | Three pointers |
| Sort Colors | 3-way partition | Forward + swap | Dutch flag |

<!-- back -->
