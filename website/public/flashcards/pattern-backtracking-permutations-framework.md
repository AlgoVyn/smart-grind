## Backtracking - Permutations: Framework

What is the complete code template for backtracking permutations?

<!-- front -->

---

### Framework 1: Backtracking Template

```
┌─────────────────────────────────────────────────────┐
│  BACKTRACKING - PERMUTATIONS TEMPLATE                  │
├─────────────────────────────────────────────────────┤
│  result = []                                          │
│                                                      │
│  def backtrack(path, choices, used):                 │
│    1. If path is complete:                           │
│       - Add copy to result                           │
│       - Return                                       │
│                                                      │
│    2. For each choice in choices:                   │
│       a. If used[choice]: continue (skip)            │
│       b. Make choice:                               │
│          - Add to path                               │
│          - Mark as used                              │
│       c. Explore: backtrack(path, choices, used)   │
│       d. Unchoose (backtrack):                      │
│          - Remove from path                          │
│          - Mark as unused                            │
│                                                      │
│  3. Call backtrack([], choices, used)                │
│  4. Return result                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Basic Permutations

```python
def permute(nums):
    """Generate all permutations of nums."""
    result = []
    n = len(nums)
    
    def backtrack(path, used):
        # Base case: complete permutation
        if len(path) == n:
            result.append(path[:])  # Add copy
            return
        
        # Try each number
        for i in range(n):
            if used[i]:
                continue
            
            # Make choice
            used[i] = True
            path.append(nums[i])
            
            # Explore
            backtrack(path, used)
            
            # Unchoose
            path.pop()
            used[i] = False
    
    backtrack([], [False] * n)
    return result
```

---

### Implementation: Permutations II (with duplicates)

```python
def permute_unique(nums):
    """Generate all unique permutations (handles duplicates)."""
    result = []
    nums.sort()  # Sort to group duplicates
    n = len(nums)
    used = [False] * n
    
    def backtrack(path):
        if len(path) == n:
            result.append(path[:])
            return
        
        for i in range(n):
            if used[i]:
                continue
            
            # Skip duplicate: if same as previous and previous not used
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            
            used[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            used[i] = False
    
    backtrack([])
    return result
```

---

### Key Pattern Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `path` | Current partial solution | `[1, 2]` |
| `used` | Track which elements are in path | `[T, T, F]` |
| `path[:]` | Add copy (not reference) | Prevents mutation |
| Base case | When to stop and record | `len(path) == n` |

<!-- back -->
