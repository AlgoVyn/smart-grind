## Dutch National Flag: Problem Forms

What are the variations and extensions of the Dutch National Flag algorithm?

<!-- front -->

---

### Sort by Parity

```python
def sort_by_parity(nums: list) -> None:
    """
    Even numbers first, then odd numbers
    """
    even_ptr, odd_ptr = 0, len(nums) - 1
    
    while even_ptr < odd_ptr:
        if nums[even_ptr] % 2 == 0:
            even_ptr += 1
        else:
            nums[even_ptr], nums[odd_ptr] = nums[odd_ptr], nums[even_ptr]
            odd_ptr -= 1
```

---

### Partition by Range

```python
def partition_by_range(nums: list, low_bound: int, high_bound: int) -> tuple:
    """
    Partition into < low_bound, [low_bound, high_bound], > high_bound
    """
    lt, i, gt = 0, 0, len(nums) - 1
    
    while i <= gt:
        if nums[i] < low_bound:
            nums[lt], nums[i] = nums[i], nums[lt]
            lt += 1
            i += 1
        elif nums[i] > high_bound:
            nums[i], nums[gt] = nums[gt], nums[i]
            gt -= 1
        else:
            i += 1
    
    return lt, gt
```

---

### Move Zeros (LeetCode 283)

```python
def move_zeros(nums: list) -> None:
    """
    Move all 0s to end while maintaining relative order of non-zero elements
    Variation of 2-way partition
    """
    non_zero = 0
    
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[non_zero], nums[i] = nums[i], nums[non_zero]
            non_zero += 1
```

---

### Wiggle Sort

```python
def wiggle_sort(nums: list) -> None:
    """
    Rearrange: nums[0] < nums[1] > nums[2] < nums[3]...
    """
    n = len(nums)
    
    # Median of 3 for each position
    for i in range(0, n - 1, 2):
        # Ensure nums[i] < nums[i+1]
        if nums[i] > nums[i + 1]:
            nums[i], nums[i + 1] = nums[i + 1], nums[i]
        
        # If there's a next pair, ensure nums[i+1] > nums[i+2]
        if i + 2 < n and nums[i + 1] < nums[i + 2]:
            nums[i + 1], nums[i + 2] = nums[i + 2], nums[i + 1]
```

---

### Sort by Absolute Value

```python
def sort_by_absolute(nums: list) -> None:
    """
    Group negative and positive, then sort each
    """
    # Three-way: negative, zero, positive
    neg, i, pos = 0, 0, len(nums) - 1
    
    while i <= pos:
        if nums[i] < 0:
            nums[neg], nums[i] = nums[i], nums[neg]
            neg += 1
            i += 1
        elif nums[i] > 0:
            nums[i], nums[pos] = nums[pos], nums[i]
            pos -= 1
        else:
            i += 1
    
    # Now negatives in [0, neg), zeros in [neg, i), positives in [i, n)
```

<!-- back -->
