## Title: Subsets (Backtracking) - Frameworks

What are the structured approaches for solving subset problems?

<!-- front -->

---

### Framework 1: Backtracking Subset Template

```
┌─────────────────────────────────────────────────────────────┐
│  BACKTRACKING SUBSET FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  1. Define backtrack(start, path):                          │
│                                                              │
│     - Add path to result (every node is a valid subset)      │
│                                                              │
│     - For i from start to n-1:                              │
│         path.append(nums[i])    # Include                   │
│         backtrack(i + 1, path)  # Recurse                   │
│         path.pop()              # Exclude (backtrack)       │
│                                                              │
│  2. Initialize: result = [], call backtrack(0, [])          │
│                                                              │
│  3. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** General subset generation, most intuitive approach.

---

### Framework 2: Bit Manipulation Template

```
┌─────────────────────────────────────────────────────────────┐
│  BIT MANIPULATION SUBSET FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  1. Calculate total = 2^n (1 << n)                           │
│                                                              │
│  2. For mask from 0 to total - 1:                           │
│       subset = []                                            │
│       For i from 0 to n-1:                                   │
│         If mask & (1 << i):   # Check if bit i is set       │
│           subset.append(nums[i])                            │
│       result.append(subset)                                  │
│                                                              │
│  3. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** When you need exact control over subset ordering.

---

### Framework 3: Iterative Building Template

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATIVE SUBSET FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: result = [[]]   # Start with empty set       │
│                                                              │
│  2. For each num in nums:                                    │
│       current_size = len(result)                            │
│       For i from 0 to current_size - 1:                     │
│         new_subset = result[i] + [num]                      │
│         result.append(new_subset)                           │
│                                                              │
│  3. Return result                                            │
│                                                              │
│  Key insight: Each element doubles the result size          │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Simple implementation, good for understanding.

<!-- back -->
