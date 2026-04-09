## Two Pointers - In-place Array Modification: Forms

What are the different variations of two pointers in-place modification?

<!-- front -->

---

### Form 1: Remove Element (Standard)

```python
def remove_element(nums, val):
    """
    Remove all instances of val in-place.
    Return new length.
    """
    write = 0
    
    for read in range(len(nums)):
        if nums[read] != val:
            nums[write] = nums[read]
            write += 1
    
    return write

# Example: nums = [3,2,2,3], val = 3
# Result: nums = [2,2,_,_], return 2
```

---

### Form 2: Remove Duplicates (Sorted Array)

```python
def remove_duplicates(nums):
    """
    Remove duplicates so each element appears once.
    """
    if len(nums) <= 1:
        return len(nums)
    
    write = 1  # Keep first element
    
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    
    return write

# Example: nums = [1,1,2,2,3]
# Result: nums = [1,2,3,_,_], return 3
```

---

### Form 3: Move Zeroes

```python
def move_zeroes(nums):
    """
    Move all zeros to the end while maintaining relative order.
    """
    write = 0
    
    # Move non-zero elements forward
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    
    # Fill remaining with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1

# Example: nums = [0,1,0,3,12]
# Result: nums = [1,3,12,0,0]
```

---

### Form 4: Partition with Swap

```python
def partition_array(nums, pivot):
    """
    Partition array: elements < pivot on left, >= on right.
    Order not preserved.
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        while left <= right and nums[left] < pivot:
            left += 1
        while left <= right and nums[right] >= pivot:
            right -= 1
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    return left  # Partition point

# Example: nums = [3,1,4,1,5,9], pivot = 4
# Result: nums = [3,1,1,4,5,9], return 3
```

---

### Form Comparison

| Form | Preserves Order | Operation | Time | Space |
|------|-----------------|-----------|------|-------|
| Remove Element | Yes | Overwrite | O(n) | O(1) |
| Remove Duplicates | Yes | Overwrite | O(n) | O(1) |
| Move Zeroes | Yes | Overwrite + Fill | O(n) | O(1) |
| Partition (Swap) | No | Swap | O(n) | O(1) |

<!-- back -->
