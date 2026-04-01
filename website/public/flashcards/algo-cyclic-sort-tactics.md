## Cyclic Sort: Tactics & Tricks

What are the essential tactics for applying cyclic sort effectively?

<!-- front -->

---

### Tactic 1: While Loop Not For Loop

```python
def cyclic_sort_correct(nums):
    """
    Use while loop because after swap, 
    current position may still have wrong element
    """
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
            # Don't increment i! Check new nums[i]
        else:
            i += 1

# WRONG - for loop:
for i in range(len(nums)):  # Skips after swap!
    correct = nums[i] - 1
    if nums[i] != nums[correct]:
        nums[i], nums[correct] = nums[correct], nums[i]
```

---

### Tactic 2: Early Exit Conditions

```python
def cyclic_sort_optimized(nums):
    i = 0
    n = len(nums)
    
    while i < n:
        correct = nums[i] - 1
        
        # Multiple exit conditions
        if correct < 0 or correct >= n:  # Out of range
            i += 1
        elif nums[i] == nums[correct]:  # Duplicate or already correct
            i += 1
        else:
            nums[i], nums[correct] = nums[correct], nums[i]
```

---

### Tactic 3: Use for Missing Number Problems

```python
def find_missing_or_duplicate(nums):
    """
    Template for missing/duplicate problems
    """
    # Step 1: Cyclic sort
    i = 0
    while i < len(nums):
        j = nums[i] - 1
        if 0 <= j < len(nums) and nums[i] != nums[j]:
            nums[i], nums[j] = nums[j], nums[i]
        else:
            i += 1
    
    # Step 2: Scan for anomaly
    for i in range(len(nums)):
        if nums[i] != i + 1:
            # Found either duplicate (nums[i]) or missing (i+1)
            return i + 1, nums[i]
    
    return len(nums) + 1, None
```

---

### Tactic 4: Floyd's Alternative for Single Duplicate

```python
def find_duplicate_floyd(nums):
    """
    When you can't modify array, use Floyd's cycle detection
    """
    # Treat array as linked list: node i points to nums[i]
    slow = nums[0]
    fast = nums[nums[0]]
    
    # Find cycle
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Find cycle start (duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow

# Use when: can't modify input, only one duplicate
```

---

### Tactic 5: Handle Floats or Large Ranges

```python
def cyclic_sort_extended(nums, value_to_index):
    """
    Generic cyclic sort with custom mapping
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct = value_to_index(nums[i])
        
        if correct != i and 0 <= correct < n:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1

# Example: custom range mapping
def custom_map(val):
    # Map arbitrary values to indices
    # e.g., values [100, 101, 102] → indices [0, 1, 2]
    return val - 100
```

<!-- back -->
