## Backtracking - Combination Sum: Framework

What is the complete code template for combination sum backtracking?

<!-- front -->

---

### Framework 1: Combination Sum Template

```
┌─────────────────────────────────────────────────────┐
│  COMBINATION SUM - BACKTRACKING TEMPLATE             │
├─────────────────────────────────────────────────────┤
│  result = []                                          │
│                                                      │
│  def backtrack(start_index, path, remaining):        │
│    1. If remaining == 0:                             │
│       - Add path copy to result                      │
│       - Return                                       │
│                                                      │
│    2. If remaining < 0:                              │
│       - Return (overshot)                            │
│                                                      │
│    3. For i from start_index to len(candidates)-1:  │
│       a. Add candidates[i] to path                   │
│       b. backtrack(i, path, remaining - candidates[i])│
│          - i for reuse, i+1 for no reuse             │
│       c. Remove from path (backtrack)                │
│                                                      │
│  4. Call backtrack(0, [], target)                    │
│  5. Return result                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Combination Sum (Unbounded)

```python
def combination_sum(candidates, target):
    """Find all combinations that sum to target (can reuse)."""
    result = []
    
    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # i (not i+1) allows reuse
            backtrack(i, path, remaining - candidates[i])
            path.pop()
    
    backtrack(0, [], target)
    return result
```

---

### Implementation: Combination Sum II (Bounded)

```python
def combination_sum2(candidates, target):
    """Each number used at most once."""
    candidates.sort()  # Sort to handle duplicates
    result = []
    
    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            if candidates[i] > remaining:
                break  # Too big, stop
            
            path.append(candidates[i])
            backtrack(i + 1, path, remaining - candidates[i])  # i+1 for no reuse
            path.pop()
    
    backtrack(0, [], target)
    return result
```

---

### Key Pattern Elements

| Element | Purpose | Variation |
|---------|---------|-----------|
| `start_index` | Avoid duplicates | Controls reuse |
| `i` in recursion | Allow reuse | Unbounded |
| `i+1` in recursion | No reuse | Bounded |
| Sorting | Handle duplicates | Required for II |

<!-- back -->
