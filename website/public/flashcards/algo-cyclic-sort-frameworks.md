## Cyclic Sort: Algorithm Framework

What is the complete cyclic sort implementation and its variations?

<!-- front -->

---

### Standard Cyclic Sort (1 to n)

```python
def cyclic_sort(nums: list) -> None:
    """
    Sort array where values are in range [1, n]
    Time: O(n), Space: O(1)
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1  # Value x belongs at index x-1
        
        # If not at correct position, swap
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
```

---

### Cyclic Sort with Duplicates

```python
def cyclic_sort_duplicates(nums: list) -> None:
    """
    Handle duplicates by skipping already-correct positions
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1
        
        # Skip if: out of range, already correct, or duplicate at target
        if (correct_idx < 0 or correct_idx >= n or 
            nums[i] == nums[correct_idx]):
            i += 1
        else:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
```

---

### Find Missing Number Pattern

```python
def find_missing_number(nums: list) -> int:
    """
    Find missing number in [1, n] where one number is missing
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first index where value != index + 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1  # All present, missing is n+1
```

---

### Find All Duplicates

```python
def find_duplicates(nums: list) -> list:
    """
    Find all duplicates in array where values in [1, n]
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Duplicates are at wrong positions
    duplicates = []
    for i in range(n):
        if nums[i] != i + 1:
            duplicates.append(nums[i])
    
    return duplicates
```

---

### Generic Range Cyclic Sort

```python
def cyclic_sort_range(nums: list, low: int, high: int) -> None:
    """
    Sort array where values are in range [low, high]
    """
    n = len(nums)
    i = 0
    
    while i < n:
        # Map value to 0-indexed position
        correct_idx = nums[i] - low
        
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
```

<!-- back -->
