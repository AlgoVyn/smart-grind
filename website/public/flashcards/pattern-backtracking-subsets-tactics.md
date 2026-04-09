## Backtracking - Subsets: Tactics

What are the advanced techniques for generating subsets?

<!-- front -->

---

### Tactic 1: Bit Manipulation

```python
def subsets_bitmask(nums):
    """Generate subsets using bit masks."""
    n = len(nums)
    result = []
    
    # Each number from 0 to 2^n - 1 represents a subset
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            # If bit i is set, include nums[i]
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

**Key**: Integer from 0 to 2^n-1, each bit represents include/exclude for one element.

---

### Tactic 2: Subset Sum with Pruning

```python
def subset_sum(nums, target):
    """Find all subsets that sum to target."""
    nums.sort()  # Sort for pruning
    result = []
    
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(current[:])
            return
        
        if current_sum > target:  # Pruning
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current, current_sum + nums[i])
            current.pop()
    
    backtrack(0, [], 0)
    return result
```

---

### Tactic 3: Size-K Subsets

```python
def subsets_of_size_k(nums, k):
    """Generate all subsets of exactly size k."""
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        # Pruning: not enough elements left
        if len(current) + (len(nums) - start) < k:
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not copying list | Reference issues | Use `current[:]` not `current` |
| Wrong start index | Duplicate elements | Use `i + 1` not `start + 1` |
| Missing backtrack | Wrong state | Always `current.pop()` after recurse |
| Duplicate subsets | Duplicates in input | Sort and skip `if i > start` |
| Stack overflow | Too deep recursion | Iterative for very large n |

---

### Tactic 5: Lexicographic Order

```python
def subsets_lexicographic(nums):
    """Generate subsets in lexicographic order."""
    nums.sort()
    result = []
    n = len(nums)
    
    def backtrack(start, current):
        result.append(current[:])
        
        for i in range(start, n):
            # Choose nums[i]
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Tactic 6: Space-Optimized Iterative

```python
def subsets_space_optimized(nums):
    """Build subsets iteratively with minimal space."""
    result = [[]]
    
    for num in nums:
        # For each existing subset, create new subset with num
        for i in range(len(result)):
            new_subset = result[i] + [num]
            result.append(new_subset)
    
    return result
```

**Note**: This uses more memory during construction but is very clean.

<!-- back -->
