## Title: Two Pointers - Tactics

What are specific techniques for two-pointer problems?

<!-- front -->

---

### Tactic 1: Skipping Duplicates

For problems requiring unique solutions, skip duplicate values:

```python
def two_sum_no_duplicates(arr, target):
    """Find unique pairs that sum to target."""
    arr.sort()
    result = []
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            result.append([arr[left], arr[right]])
            # Skip duplicates
            while left < right and arr[left] == arr[left + 1]:
                left += 1
            while left < right and arr[right] == arr[right - 1]:
                right -= 1
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```

---

### Tactic 2: Floyd's Cycle Detection

```python
def detect_cycle(head):
    """Detect cycle using Floyd's Tortoise and Hare."""
    if not head or not head.next:
        return None
    
    slow = fast = head
    
    # Phase 1: Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # Cycle start node
```

---

### Tactic 3: In-Place Array Modification

```python
def move_zeroes(nums):
    """Move all zeroes to end while maintaining relative order."""
    writer = 0
    
    # First pass: move non-zero elements to front
    for reader in range(len(nums)):
        if nums[reader] != 0:
            nums[writer] = nums[reader]
            writer += 1
    
    # Second pass: fill remaining with zeroes
    while writer < len(nums):
        nums[writer] = 0
        writer += 1
```

---

### Tactic 4: Trapping Rain Water

```python
def trap(height):
    """Calculate water trapped after raining."""
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water
```

---

### Tactic 5: Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Two Pointers** | O(n) | O(1) | Sorted arrays, pair finding, in-place modification |
| **Hash Table** | O(n) avg | O(n) | Unsorted data, need O(1) lookups |
| **Brute Force** | O(n²) | O(1) | Small inputs, simple verification |
| **Sliding Window** | O(n) | O(k) | Variable-size subarray problems |

**Choose Two Pointers when:** Array is sorted or can be sorted, need O(1) space, problem involves pairs or ranges.

<!-- back -->
