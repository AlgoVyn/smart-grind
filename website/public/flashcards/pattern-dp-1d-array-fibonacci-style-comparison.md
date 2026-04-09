## DP - 1D Array (Fibonacci Style): Comparison

How do different approaches and patterns compare for Fibonacci-style DP?

<!-- front -->

---

### Approach Comparison

| Aspect | Top-down Memoization | Bottom-up Tabulation | Space-Optimized |
|--------|---------------------|---------------------|---------------|
| **Time** | O(n) | O(n) | O(n) |
| **Space** | O(n) array + O(n) stack | O(n) array | O(1) variables |
| **Code Clarity** | Natural recursion | Iterative, explicit | Cleanest |
| **Stack Risk** | Yes (depth n) | No | No |
| **Cache Efficiency** | Good | Excellent | Excellent |
| **Early Termination** | Easy | Harder | Harder |
| **Best For** | Understanding, irregular deps | Standard problems | Production code |

**Recommendation:** Use space-optimized for final submissions unless path reconstruction needed.

---

### Space Optimized vs Full Array

| Feature | O(1) Space | O(n) Array |
|---------|-----------|------------|
| **Final value only** | ✅ Perfect | Works but wasteful |
| **Path reconstruction** | ❌ Impossible | ✅ Required |
| **Debugging/Tracing** | ❌ Hard | ✅ Print full table |
| **Multiple queries** | Recompute | ✅ Cache and reuse |
| **Pattern analysis** | ❌ Limited | ✅ See all values |

**Rule:** Use O(1) unless you need the full array for path reconstruction or debugging.

---

### Fibonacci-Style vs Other DP Patterns

| Feature | Fibonacci-Style | 0/1 Knapsack | LIS (Longest Inc Subseq) |
|---------|-----------------|--------------|--------------------------|
| **Dependencies** | Fixed k states (1-2) | All previous states | All previous states |
| **Space possible** | O(1) | O(n) or O(capacity) | O(n) required |
| **State definition** | dp[i] = value at i | dp[i] = max value weight i | dp[i] = LIS ending at i |
| **Transition** | Simple linear | Include/exclude choice | Max over all j < i |
| **Scan direction** | Left to right | Left to right or reverse | Left to right |
| **Examples** | Climbing stairs, House Robber | Subset sum, Coin change | Patience sorting variant |

**Key difference:** Fibonacci-style has bounded lookback (constant k); other patterns may need all prior states.

---

### When to Use What Pattern

```
Problem asks for:
├── Count ways to reach position n?
│   └── dp[i] = sum(dp[i-k] for k in allowed_steps)
│   └── Examples: Climbing stairs, Decode ways
│
├── Max/min with adjacency constraint?
│   └── dp[i] = max(dp[i-1], dp[i-2] + value[i])
│   └── Examples: House Robber, Delete and Earn
│
├── Simple linear recurrence?
│   └── dp[i] = f(dp[i-1], dp[i-2])
│   └── Examples: Fibonacci, Tribonacci
│
├── Cost optimization per step?
│   └── dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
│   └── Examples: Min cost climbing stairs
│
├── Circular/arrangement constraint?
│   └── Break into two linear subproblems
│   └── Examples: House Robber II
│
└── Multiple dimensions needed?
    └── Consider 2D DP pattern
    └── Examples: Unique paths, Edit distance
```

---

### Decision Matrix for Implementation

| Situation | Approach | Space |
|-----------|----------|-------|
| Just need final answer | Space optimized | O(1) |
| Need path/reconstruction | Full array | O(n) |
| Very large n (Fibonacci) | Matrix exponentiation | O(1) |
| Multiple test cases | Precompute once | O(max_n) |
| Debugging/learning | Full array + prints | O(n) |
| Recursive nature clearer | Top-down memoization | O(n) |

<!-- back -->
