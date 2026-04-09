## Array - Cyclic Sort: Tactics

What are the advanced techniques for cyclic sort?

<!-- front -->

---

### Tactic 1: Find Missing Number

```python
def find_missing(nums):
    """Find missing number in range [0, n]."""
    i = 0
    n = len(nums)
    
    while i < n:
        correct = nums[i]
        if 0 <= correct < n and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    for i in range(n):
        if nums[i] != i:
            return i
    return n
```

---

### Tactic 2: Find Duplicate Number

```python
def find_duplicate(nums):
    """Find duplicate number in range [1, n]."""
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    for i in range(len(nums)):
        if nums[i] != i + 1:
            return nums[i]
```

---

### Tactic 3: Find All Duplicates

```python
def find_all_duplicates(nums):
    """Find all duplicates in range [1, n]."""
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    return [nums[i] for i in range(len(nums)) if nums[i] != i + 1]
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not checking bounds | Index error | Check 0 <= correct < n |
| Wrong correct index | Wrong position | correct = nums[i] - 1 for 1-indexed |
| Incrementing after swap | Miss elements | Don't increment i after swap |
| Swapping equal values | Infinite loop | Check nums[i] != nums[correct] |

<!-- back -->
