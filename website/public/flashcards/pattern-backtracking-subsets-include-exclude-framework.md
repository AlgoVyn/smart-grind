## Backtracking - Subsets Include/Exclude: Framework

What is the complete code template for generating subsets using the binary include/exclude approach?

<!-- front -->

---

### Framework: Binary Decision Backtracking

```
┌─────────────────────────────────────────────────────┐
│  SUBSETS (INCLUDE/EXCLUDE) - TEMPLATE                  │
├─────────────────────────────────────────────────────┤
│  Key Insight: Each element has 2 choices - include     │
│  or exclude. Total subsets = 2^n (including empty)   │
│                                                        │
│  1. Define backtrack(start, current_subset):          │
│     a. If start == len(nums):                         │
│        - Add copy of current to results                │
│        - Return                                        │
│                                                        │
│     b. Decision 1: EXCLUDE nums[start]                │
│        - backtrack(start + 1, current)                │
│                                                        │
│     c. Decision 2: INCLUDE nums[start]                │
│        - current.append(nums[start])                   │
│        - backtrack(start + 1, current)                │
│        - current.pop()  (backtrack - essential!)      │
│                                                        │
│  2. Start with backtrack(0, [])                       │
│  3. Return results                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def subsets(nums):
    """
    Generate all subsets using include/exclude decisions.
    LeetCode 78 - Subsets
    Time: O(2^n × n), Space: O(n) for recursion stack
    """
    def backtrack(start, current):
        # Base case: all elements processed
        if start == len(nums):
            result.append(current[:])  # Must add COPY
            return
        
        # Decision 1: Exclude current element
        backtrack(start + 1, current)
        
        # Decision 2: Include current element
        current.append(nums[start])
        backtrack(start + 1, current)
        current.pop()  # Backtrack to clean state
    
    result = []
    backtrack(0, [])
    return result
```

---

### Decision Tree Visualization

```
nums = [1, 2, 3]

                    start=0, []
                   /           \
            Exclude 1           Include 1
           start=1, []        start=1, [1]
          /        \          /           \
    Exclude 2   Include 2   Exclude 2    Include 2
   start=2 []  start=2 [2]  start=2 [1] start=2 [1,2]
       ...         ...         ...          ...

Leaves at start=3: [], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]
```

---

### Key Framework Elements

| Element | Purpose | Critical Rule |
|---------|---------|---------------|
| `start` index | Tracks current element | Increment by 1 each level |
| Exclude branch | Explore without element | Call first (or second, be consistent) |
| Include branch | Explore with element | Append → recurse → pop |
| Base case | All elements processed | `start == len(nums)` |
| `current[:]` | Save copy | Without copy, all refs point to same list |
| Backtrack pop | Clean state for siblings | Essential after include recursion |

<!-- back -->
