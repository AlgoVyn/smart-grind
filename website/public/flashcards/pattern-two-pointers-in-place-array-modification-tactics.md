## Two Pointers - In-place Array Modification: Tactics

What are the advanced techniques for two pointers in-place modification?

<!-- front -->

---

### Tactic 1: Allow k Duplicates

```python
def remove_duplicates_k(nums, k):
    """
    Keep at most k duplicates of each element.
    LeetCode 80: Remove Duplicates II (k=2).
    """
    if len(nums) <= k:
        return len(nums)
    
    write = k  # Start after allowing k duplicates
    
    for read in range(k, len(nums)):
        # Compare with element k positions back
        if nums[read] != nums[write - k]:
            nums[write] = nums[read]
            write += 1
    
    return write
```

---

### Tactic 2: Dutch National Flag (3 Pointers)

```python
def sort_colors(nums):
    """
    Sort 0s, 1s, 2s in-place.
    Three-way partitioning with low, mid, high pointers.
    """
    low, mid = 0, 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    
    return nums
```

---

### Tactic 3: Remove with Minimal Writes

```python
def remove_element_minimal_writes(nums, val):
    """
    Remove element by replacing with last element.
    Minimizes write operations but doesn't preserve order.
    """
    n = len(nums)
    write = 0
    
    while write < n:
        if nums[write] == val:
            nums[write] = nums[n - 1]
            n -= 1
        else:
            write += 1
    
    return n
```

---

### Tactic 4: Merge Sorted Arrays (Backward)

```python
def merge(nums1, m, nums2, n):
    """
    Merge nums2 into nums1 in-place.
    Fill from the end to avoid overwriting.
    """
    p1, p2 = m - 1, n - 1
    p = m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
```

---

### Tactic 5: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Off-by-one | Wrong initial write position | Start at 0, or 1 if keeping first element |
| Pointer confusion | Mixing read/write logic | Clear naming: `read` scans, `write` places |
| Return wrong value | Returning array not length | Return `write` pointer value |
| Not handling all duplicates | Missing edge cases | Check condition carefully |

<!-- back -->
