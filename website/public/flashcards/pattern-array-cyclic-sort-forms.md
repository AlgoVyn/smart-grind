## Array - Cyclic Sort: Forms

What are the different variations of cyclic sort?

<!-- front -->

---

### Form 1: Standard Cyclic Sort

```python
def cyclic_sort(nums):
    """Sort numbers in range [1, n]."""
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if 0 <= correct < len(nums) and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    return nums
```

---

### Form 2: Find Missing Number

```python
def find_missing(nums):
    """Find missing in [0, n]."""
    i = 0
    while i < len(nums):
        correct = nums[i]
        if 0 <= correct < len(nums) and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    for i in range(len(nums)):
        if nums[i] != i:
            return i
    return len(nums)
```

---

### Form 3: Find All Missing

```python
def find_all_missing(nums):
    """Find all missing in [1, n]."""
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if 0 <= correct < len(nums) and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    return [i + 1 for i in range(len(nums)) if nums[i] != i + 1]
```

---

### Form Comparison

| Form | Output | Use Case |
|------|--------|----------|
| Standard | Sorted array | Sort [1,n] range |
| Missing | Single int | Find gap |
| All Missing | List | Find all gaps |

<!-- back -->
