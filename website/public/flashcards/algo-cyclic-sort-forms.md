## Cyclic Sort: Problem Forms

What are the variations and applications of cyclic sort?

<!-- front -->

---

### Find First Missing Positive

```python
def first_missing_positive(nums: list) -> int:
    """
    Find smallest missing positive integer (LeetCode 41)
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i] - 1
        # Place nums[i] at index nums[i]-1 if valid
        if (0 < nums[i] <= n and 
            nums[i] != nums[correct_idx]):
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first index where nums[i] != i+1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1
```

---

### Find K Missing Numbers

```python
def find_k_missing(nums: list, k: int) -> list:
    """
    Find k missing numbers in range [1, n+k] from array of size n
    """
    n = len(nums)
    i = 0
    
    # Cyclic sort
    while i < n:
        correct_idx = nums[i] - 1
        if 0 < nums[i] <= n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Collect missing numbers
    missing = []
    extra = []
    
    for i in range(n):
        if nums[i] != i + 1:
            missing.append(i + 1)
            extra.append(nums[i])
    
    # May need to extend beyond n
    i = 1
    while len(missing) < k:
        candidate = n + i
        if candidate not in extra:
            missing.append(candidate)
        i += 1
    
    return missing[:k]
```

---

### Find Smallest Duplicate

```python
def find_duplicate(nums: list) -> int:
    """
    Find the duplicate number (values in [1, n], one duplicate)
    """
    n = len(nums) - 1  # n+1 elements, values in [1, n]
    i = 0
    
    while i <= n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            if i != correct_idx:  # Duplicate found
                return nums[i]
            i += 1
    
    return -1
```

---

### Find Corrupt Pair (Duplicate + Missing)

```python
def find_corrupt_pair(nums: list) -> tuple:
    """
    Find duplicate and missing number
    Returns: (duplicate, missing)
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    for i in range(n):
        if nums[i] != i + 1:
            return (nums[i], i + 1)
    
    return (-1, -1)
```

---

### Sort with Negative Numbers

```python
def cyclic_sort_with_negatives(nums: list) -> None:
    """
    Sort array with values in range [-k, k]
    Offset to make 0-indexed
    """
    n = len(nums)
    offset = n + 1  # Ensure positive indices
    
    # Temporarily shift values
    for i in range(n):
        nums[i] += offset
    
    i = 0
    while i < n:
        correct_idx = nums[i] - offset - 1  # Adjust for 1-indexing
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Restore original values
    for i in range(n):
        nums[i] -= offset
```

<!-- back -->
