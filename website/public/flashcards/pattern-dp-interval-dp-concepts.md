## DP - Interval DP: Core Concepts

What is Interval DP and what are the key concepts?

<!-- front -->

---

### Fundamental Definition

**Interval DP** is a dynamic programming technique for solving problems involving intervals, ranges, or contiguous segments.

| Characteristic | Description |
|----------------|-------------|
| **State** | `dp[i][j]` = optimal value for interval [i, j] |
| **Time** | O(n³) typically, O(n²) with optimizations |
| **Space** | O(n²) for the DP table |
| **Input** | Array/string representing a sequence |
| **Output** | Optimal value for the entire interval [0, n-1] |

---

### Key Concepts

**1. Optimal Substructure**
```
Optimal solution for [i, j] can be built from
optimal solutions of smaller intervals [i, k] and [k+1, j].

┌─────────────────────────┐
│     [i, j]              │
│  ┌───────┐ ┌───────┐   │
│  │[i, k] │ │[k+1,j]│   │
│  └───────┘ └───────┘   │
└─────────────────────────┘
```

**2. Process by Length**
```
Smaller intervals must be solved before larger ones:

length = 1: [0,0], [1,1], [2,2], [3,3]  (base cases)
length = 2: [0,1], [1,2], [2,3]
length = 3: [0,2], [1,3]
length = 4: [0,3]  ← final answer
```

**3. The "Last Operation" Insight**
```
Instead of thinking "what happens first?",
think "what happens LAST in the interval?"

Example - Burst Balloons:
- If k is the LAST balloon burst in [i,j],
- Then [i,k-1] and [k+1,j] are already empty
- Coins = left_boundary * k * right_boundary
```

---

### When to Use Interval DP

| Problem Type | Example |
|--------------|---------|
| Burst Balloons | Maximize coins by bursting balloons |
| Matrix Chain Multiplication | Optimal parenthesization |
| Palindrome Partitioning | Minimum cuts for palindromes |
| Remove Boxes | Remove colored boxes for max points |
| Strange Printer | Print string with minimum turns |
| Merge Stones | Minimum cost to merge piles |
| Optimal BST | Tree DP on intervals |

---

### Recurrence Pattern

```
General form:

dp[i][j] = min/max over all k of:
    combine(dp[i][k], dp[k+1][j], cost_at_k)

Where k is the split point in [i, j)
```

### Complexity Analysis

| Aspect | Standard | Optimized |
|--------|----------|-----------|
| Time | O(n³) | O(n²) (with Knuth/Monge) |
| Space | O(n²) | O(n²) or O(n) |

<!-- back -->
