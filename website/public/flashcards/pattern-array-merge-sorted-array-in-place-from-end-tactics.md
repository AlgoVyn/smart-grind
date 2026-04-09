## Array - Merge Sorted Array (In-place from End): Tactics

What are the advanced techniques and variations for merging sorted arrays?

<!-- front -->

---

### Tactic 1: Handling Edge Cases

```python
def merge_handle_edge_cases(nums1, m, nums2, n):
    """Robust merge with explicit edge case handling."""
    # Edge: nums2 is empty
    if n == 0:
        return  # nums1 already correct
    
    # Edge: nums1 has no valid elements
    if m == 0:
        nums1[:n] = nums2[:n]  # Copy all of nums2
        return
    
    # Standard three-pointer merge
    i, j, k = m - 1, n - 1, m + n - 1
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k], i = nums1[i], i - 1
        else:
            nums1[k], j = nums2[j], j - 1
        k -= 1
    
    # Copy any remaining from nums2
    while j >= 0:
        nums1[k], j, k = nums2[j], j - 1, k - 1
```

---

### Tactic 2: Descending Order Merge

```python
def merge_descending(nums1, m, nums2, n):
    """Merge where arrays are sorted in descending order."""
    i, j, k = m - 1, n - 1, m + n - 1
    
    while i >= 0 and j >= 0:
        # Pick SMALLER element (reversed comparison)
        if nums1[i] < nums2[j]:  # Changed: < instead of >
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1
```

---

### Tactic 3: Merge with Duplicates Removed

```python
def merge_unique(nums1, m, nums2, n):
    """Merge keeping only unique elements."""
    i, j, k = m - 1, n - 1, m + n - 1
    
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            # Skip duplicates from nums1
            if k == m + n - 1 or nums1[i] != nums1[k + 1]:
                nums1[k] = nums1[i]
                k -= 1
            i -= 1
        else:
            # Skip duplicates from nums2
            if k == m + n - 1 or nums2[j] != nums1[k + 1]:
                nums1[k] = nums2[j]
                k -= 1
            j -= 1
    
    # Handle remainders with dedup
    while i >= 0:
        if k == m + n - 1 or nums1[i] != nums1[k + 1]:
            nums1[k] = nums1[i]
            k -= 1
        i -= 1
    
    while j >= 0:
        if k == m + n - 1 or nums2[j] != nums1[k + 1]:
            nums1[k] = nums2[j]
            k -= 1
        j -= 1
    
    # Shift result to front if needed
    # (result starts at k+1, need to shift left)
```

---

### Tactic 4: Using Built-in (Interview Quick Solution)

```python
def merge_builtin(nums1, m, nums2, n):
    """Quick solution using built-in sort - not optimal but works."""
    # Copy nums2 into the empty space
    nums1[m:m+n] = nums2[:n]
    # Sort in-place
    nums1.sort()  # O((m+n) log(m+n)) time
```

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Merging from start | Overwrites unprocessed nums1 elements | Always merge from end |
| Forgetting nums2 remainder | Unmerged nums2 elements lost | Add `while j >= 0` loop |
| Copying nums1 remainder | Unnecessary work, may overwrite | Skip - nums1 already in place |
| Wrong k initialization | k = m - 1 or k = n - 1 | k = m + n - 1 |
| Off-by-one in loops | Using `> 0` instead of `>= 0` | Use `>= 0` to include index 0 |
| Empty array handling | Crash on index access | Check m=0 or n=0 first |

---

### Tactic 6: One-Liner Variations (Python)

```python
def merge_compact(nums1, m, nums2, n):
    """Compact Python version."""
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        nums1[k] = nums1[i] if i >= 0 and nums1[i] > nums2[j] else nums2[j]
        i, j, k = i - (nums1[k] == nums1[i] and i >= 0), j - 1, k - 1
```

<!-- back -->
