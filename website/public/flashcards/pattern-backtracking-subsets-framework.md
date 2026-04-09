## Backtracking - Subsets: Framework

What is the complete code template for generating all subsets using include/exclude?

<!-- front -->

---

### Framework 1: Include/Exclude Backtracking

```
┌─────────────────────────────────────────────────────┐
│  SUBSETS (INCLUDE/EXCLUDE) - TEMPLATE                  │
├─────────────────────────────────────────────────────┤
│  Key Insight: Each element has 2 choices - include     │
│  or exclude. Total subsets = 2^n (including empty)    │
│                                                        │
│  1. Define backtrack(start, current_subset):          │
│     a. If start == len(nums):                         │
│        - Add copy of current to results                 │
│        - Return                                        │
│                                                        │
│     b. Decision 1: EXCLUDE nums[start]                │
│        - backtrack(start + 1, current)                │
│                                                        │
│     c. Decision 2: INCLUDE nums[start]                │
│        - current.append(nums[start])                   │
│        - backtrack(start + 1, current)                │
│        - current.pop()  (backtrack)                   │
│                                                        │
│  2. Start with backtrack(0, [])                        │
│  3. Return results                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: All Subsets

```python
def subsets(nums):
    """
    Generate all possible subsets using include/exclude.
    LeetCode 78 - Subsets
    Time: O(2^n × n), Space: O(n) recursion
    """
    def backtrack(start, current):
        # Base case: processed all elements
        if start == len(nums):
            result.append(current[:])  # Add copy
            return
        
        # Decision 1: Exclude nums[start]
        backtrack(start + 1, current)
        
        # Decision 2: Include nums[start]
        current.append(nums[start])
        backtrack(start + 1, current)
        current.pop()  # Backtrack
    
    result = []
    backtrack(0, [])
    return result
```

---

### Implementation: Subsets with Duplicates

```python
def subsets_with_dup(nums):
    """
    Generate subsets with duplicate handling.
    LeetCode 90 - Subsets II
    """
    nums.sort()  # Group duplicates together
    
    def backtrack(start, current):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    result = []
    backtrack(0, [])
    return result
```

---

### Framework 2: Cascading (Iterative)

```python
def subsets_iterative(nums):
    """Iterative approach - build subsets incrementally."""
    result = [[]]
    
    for num in nums:
        # Add num to all existing subsets
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result
```

---

### Key Pattern Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| `start` | Current position | Controls recursion depth |
| `current` | Building subset | O(n) max size |
| `result.append(current[:])` | Save copy | O(n) per subset |
| Backtrack order | Exclude first, then include | Standard pattern |
| Duplicate skip | `if i > start and nums[i] == nums[i-1]` | Avoid duplicates |

<!-- back -->
