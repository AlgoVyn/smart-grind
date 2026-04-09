## Two Pointers - In-Place Array Modification: Tactics

What are the advanced techniques for in-place array modification?

<!-- front -->

---

### Tactic 1: Two-Pointer Direction

| Direction | Use Case | Example |
|-----------|----------|---------|
| Forward | Remove, filter | Remove element |
| Backward | Merge, overwrite | Merge sorted arrays |
| Both ends | Partition | Sort colors, quicksort |

**Forward example**: Keep certain elements
**Backward example**: When we need the end space available

---

### Tactic 2: Dutch National Flag Pattern

**Problem**: Sort array of 0s, 1s, 2s (or three categories)

```python
def sort_colors(nums):
    left, curr, right = 0, 0, len(nums) - 1
    
    while curr <= right:
        if nums[curr] == 0:
            # Swap to left section
            nums[left], nums[curr] = nums[curr], nums[left]
            left += 1
            curr += 1
        elif nums[curr] == 2:
            # Swap to right section
            nums[curr], nums[right] = nums[right], nums[curr]
            right -= 1
            # Don't advance curr, check swapped element
        else:
            # Already in middle section
            curr += 1
```

**Three zones**: [0s...left), [left...curr), [curr...right], (right...2s]

---

### Tactic 3: Squaring Sorted Array

```python
def sorted_squares(nums):
    """Return sorted squares of sorted array (may have negatives)."""
    n = len(nums)
    result = [0] * n
    left, right = 0, n - 1
    pos = n - 1  # Fill from end
    
    while left <= right:
        left_sq = nums[left] ** 2
        right_sq = nums[right] ** 2
        
        if left_sq > right_sq:
            result[pos] = left_sq
            left += 1
        else:
            result[pos] = right_sq
            right -= 1
        pos -= 1
    
    return result
```

**Key**: Larger squares come from ends, fill result from end

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Incrementing both pointers** | Skipping elements | Only write increments conditionally |
| **Not returning length** | Lost information | Return write position |
| **Modifying while iterating** | Index confusion | Clear read/write separation |
| **Array index out of bounds** | Wrong loop condition | Check bounds in while |
| **Wrong comparison** | Keeping wrong elements | Check condition carefully |

---

### Tactic 5: Quick Select Pattern

```python
def partition(nums, left, right, pivot_index):
    """Lomuto partition scheme."""
    pivot = nums[pivot_index]
    # Move pivot to end
    nums[pivot_index], nums[right] = nums[right], nums[pivot_index]
    
    store_index = left
    for i in range(left, right):
        if nums[i] < pivot:
            nums[store_index], nums[i] = nums[i], nums[store_index]
            store_index += 1
    
    # Move pivot to final place
    nums[right], nums[store_index] = nums[store_index], nums[right]
    return store_index
```

---

### Tactic 6: In-Place String Operations

```python
def reverse_words(s):
    """Reverse words in string in-place."""
    chars = list(s)
    
    # Reverse entire string
    _reverse(chars, 0, len(chars) - 1)
    
    # Reverse each word
    start = 0
    for i in range(len(chars) + 1):
        if i == len(chars) or chars[i] == ' ':
            _reverse(chars, start, i - 1)
            start = i + 1
    
    return ''.join(chars)

def _reverse(chars, left, right):
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
```

<!-- back -->
