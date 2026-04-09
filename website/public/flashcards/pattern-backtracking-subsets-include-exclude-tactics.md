## Backtracking - Subsets Include/Exclude: Tactics

What are the advanced techniques and optimizations for the include/exclude pattern?

<!-- front -->

---

### Tactic 1: Subset Sum with Pruning

```python
def subset_sum(nums, target):
    """Find subsets that sum to target with early termination."""
    nums.sort()  # Sort for pruning
    result = []
    
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(current[:])
            return
        if current_sum > target:  # Pruning - only works with positive nums!
            return
        if start == len(nums):
            return
        
        # Exclude
        backtrack(start + 1, current, current_sum)
        
        # Include
        current.append(nums[start])
        backtrack(start + 1, current, current_sum + nums[start])
        current.pop()
    
    backtrack(0, [], 0)
    return result
```

**Key**: Pruning with `current_sum > target` requires all positive numbers.

---

### Tactic 2: Count Subsets Without Storing

```python
def count_subsets(nums, target):
    """Count only - O(1) space for results."""
    count = 0
    
    def backtrack(start, current_sum):
        nonlocal count
        if current_sum == target:
            count += 1
            return
        if start == len(nums):
            return
        
        backtrack(start + 1, current_sum)  # Exclude
        backtrack(start + 1, current_sum + nums[start])  # Include
    
    backtrack(0, 0)
    return count
```

---

### Tactic 3: Memoization for Target Sum

```python
from functools import lru_cache

def count_subsets_with_sum(nums, target):
    """Memoized version - faster for repeated states."""
    
    @lru_cache(maxsize=None)
    def dp(index, remaining):
        if remaining == 0:
            return 1
        if index >= len(nums) or remaining < 0:
            return 0
        
        # Exclude + Include (memoized)
        return dp(index + 1, remaining) + dp(index + 1, remaining - nums[index])
    
    return dp(0, target)
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Solution |
|---------|-------|----------|
| No copy | `result.append(current)` - all refs same | `result.append(current[:])` |
| Missing pop | Include affects exclude branch | Always pop after include recurse |
| Wrong base case | Checking at wrong level | Base case after processing ALL elements |
| Include before exclude | Wrong order causes issues | Either order works, but be consistent |
| Stack overflow | Large n (n > 30) | Use iterative/bitmask approach |

---

### Tactic 5: Bitmask Alternative (No Recursion)

```python
def subsets_bitmask(nums):
    """Generate subsets without recursion - O(1) auxiliary space."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):  # 0 to 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

**Use when**: Stack overflow risk, or when iterative preferred.

<!-- back -->
