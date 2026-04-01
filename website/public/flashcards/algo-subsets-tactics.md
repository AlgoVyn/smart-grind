## Title: Subsets (Backtracking) - Tactics

What are specific techniques for subset problems?

<!-- front -->

---

### Tactic 1: Handling Duplicates (Cascading)

```python
def subsets_with_duplicates(nums):
    """Generate unique subsets from array with duplicates."""
    nums.sort()  # Essential: group duplicates together
    result = []
    
    def backtrack(start, path):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

---

### Tactic 2: Subset Sum with Pruning

```python
def subset_sum(nums, target):
    """Find all subsets that sum to target with pruning."""
    result = []
    nums.sort()  # Sort for pruning
    
    def backtrack(start, path, current_sum):
        if current_sum == target:
            result.append(path[:])
            return
        
        for i in range(start, len(nums)):
            # Pruning: would exceed target
            if current_sum + nums[i] > target:
                break
            
            path.append(nums[i])
            backtrack(i + 1, path, current_sum + nums[i])
            path.pop()
    
    backtrack(0, [], 0)
    return result
```

---

### Tactic 3: Iterative Cascade

```python
def subsets_iterative_cascade(nums):
    """Build subsets incrementally."""
    result = [[]]
    
    for num in nums:
        # Create new subsets by adding num to all existing
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result
```

---

### Tactic 4: Meet-in-the-Middle for Large n

```python
def subset_sum_meet_middle(nums, target):
    """Check if any subset sums to target."""
    n = len(nums)
    mid = n // 2
    
    # Generate all subset sums for both halves
    def get_subset_sums(arr):
        sums = [0]
        for num in arr:
            sums += [s + num for s in sums]
        return sums
    
    left_sums = get_subset_sums(nums[:mid])
    right_sums = set(get_subset_sums(nums[mid:]))
    
    for s in left_sums:
        if target - s in right_sums:
            return True
    return False
```

---

### Tactic 5: Comparison with Related Patterns

| Pattern | Output | When to Use |
|---------|--------|-------------|
| **Subsets** | All possible groupings of any size | Binary decisions, all combinations |
| **Combinations** | Groups of exactly size k | Order doesn't matter, fixed size |
| **Permutations** | All arrangements | Order matters within group |

**Key:** Subsets includes all sizes 0 to n; combinations is size k; permutations considers order.

<!-- back -->
