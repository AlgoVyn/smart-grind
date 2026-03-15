## Two Pointers: Common Variations

**Question:** How do you handle different two-pointer scenarios correctly?

<!-- front -->

---

## Answer: Know Your Direction

### Variation 1: Opposite Direction (Converging)
```python
# Search in sorted array
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    
    while left < right:
        current = nums[left] + nums[right]
        
        if current == target:
            return [left, right]
        elif current < target:
            left += 1   # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return [-1, -1]
```

### Variation 2: Same Direction (Sliding Window)
```python
# Find max sum of k elements
def max_sum_k(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

### Variation 3: Fast-Slow (Linked List)
```python
# Detect cycle
def has_cycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

### Visual: Three Variations

```
1. OPPOSITE (Converging):     2. SAME (Sliding):       3. FAST-SLOW:
                               
  [1,2,3,4,5,6,7,8]            [1,2,3,4,5,6]           1→2→3→4→5
  ↑                 ↑           ↑           ↑            ↑     ↑
  L                 R           L           R            S     F
  
  Move toward each other        Move together           Different speeds
```

### When to Use Which

| Scenario | Variation | Example |
|----------|-----------|---------|
| Sorted array search | Opposite | Two sum, 3 sum |
| Subarray problems | Same | Max subarray sum |
| Cycle detection | Fast-Slow | Linked list cycle |
| Remove duplicates | Same | In-place dedup |

### ⚠️ Tricky Parts

#### 1. Off-by-One Errors
```python
# WRONG - infinite loop when left == right
while left <= right:  # Should be < for converging!
    ...

# CORRECT
while left < right:  # Stop when they meet/cross
    ...
```

#### 2. Wrong Direction
```python
# Finding pair with sum < target
# WRONG - should increase sum when too small
if current < target:
    right -= 1  # This DECREASES sum!

# CORRECT
if current < target:
    left += 1   # This INCREASES sum
```

#### 3. Not Handling All Cases
```python
# WRONG - misses when left == right
while left < right:
    ...

# Need to check what happens at equality
# For sorted array: left == right means one element left
# Can't form pair, so < is correct
```

#### 4. Modifying While Iterating
```python
# For removing duplicates in-place
def remove_duplicates(nums):
    if not nums:
        return 0
    
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    
    return slow + 1

# Don't modify array while both pointers moving!
```

### Common Mistakes Summary

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using `<=` instead of `<` | Infinite loop | Use strict inequality |
| Wrong direction | Wrong answer | Understand sum direction |
| Not handling empty | IndexError | Check length first |
| Modifying while iterating | Data corruption | Use separate pointers |
| Fast/slow not starting together | Misses edge case | Both start at head |

### Edge Cases to Handle

```python
def two_sum_sorted(nums, target):
    # Empty array
    if not nums:
        return [-1, -1]
    
    # Single element
    if len(nums) == 1:
        return [0, 0] if nums[0] * 2 == target else [-1, -1]
    
    # Two elements
    if len(nums) == 2:
        if nums[0] + nums[1] == target:
            return [0, 1]
        return [-1, -1]
    
    # Normal case
    left, right = 0, len(nums) - 1
    while left < right:
        ...
```

### Complexity Analysis

| Variation | Time | Space |
|-----------|------|-------|
| Opposite | O(n) | O(1) |
| Same (Sliding Window) | O(n) | O(1) |
| Fast-Slow | O(n) | O(1) |

<!-- back -->
