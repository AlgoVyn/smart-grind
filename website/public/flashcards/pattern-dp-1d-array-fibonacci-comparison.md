## DP - 1D Array Fibonacci: Comparison

When should you use different approaches for Fibonacci-style DP problems?

<!-- front -->

---

### Space Optimized vs Full Array

| Aspect | Space Optimized O(1) | Full Array O(n) |
|--------|---------------------|-----------------|
| **Space** | O(1) - 2-3 variables | O(n) - full DP table |
| **Time** | O(n) | O(n) |
| **Final value only** | ✅ Perfect | Works but wasteful |
| **Path reconstruction** | ❌ Impossible | ✅ Required |
| **Debugging** | ❌ Hard | ✅ Can print full table |
| **Multiple queries** | Recompute each | ✅ Store and reuse |
| **Pattern analysis** | ❌ Limited | ✅ See all values |

**Rule of thumb:** Use O(1) space unless you need path reconstruction.

---

### Iterative vs Memoization

| Aspect | Iterative (Bottom-Up) | Memoization (Top-Down) |
|--------|----------------------|------------------------|
| **Approach** | Build from base cases | Recursive with cache |
| **Stack space** | O(1) | O(n) recursion |
| **Code clarity** | Slightly more verbose | Natural for some problems |
| **Early termination** | Harder | Easier (return on find) |
| **State pruning** | Computes all states | Can skip unnecessary states |
| **Base case handling** | Explicit at start | Implicit in recursion |

**Winner:** Iterative for Fibonacci-style (cleaner, no stack risk).

---

### Fibonacci vs Knapsack Patterns

| Feature | Fibonacci-Style | 0/1 Knapsack |
|---------|-----------------|--------------|
| **Dependencies** | Fixed k previous states | All previous states |
| **Space** | O(1) possible | O(n) or O(capacity) |
| **State definition** | dp[i] = value at i | dp[i] = max value with weight i |
| **Transition** | Simple: dp[i-1], dp[i-2] | Choice: include/exclude item |
| **Optimization** | Linear scan | Often needs 2D or reverse iteration |
| **Examples** | Climbing stairs, House Robber | Subset sum, Coin change |

**Key difference:** Fibonacci-style has bounded lookback; Knapsack may depend on all prior states.

---

### When to Use What Pattern

```
Problem type?
├── Counting ways to reach n?
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
└── Circular arrangement?
    └── Break into two linear problems
    └── Examples: House Robber II
```

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|----- |
| Just need final value | Space optimized | O(1) | Cleanest, fastest |
| Need path/reconstruction | Full array | O(n) | Enables backtracking |
| Very large n (Fibonacci) | Matrix exponentiation | O(1) | O(log n) time |
| Multiple test cases | Precompute once | O(max_n) | Reuse results |
| Debugging/learning | Full array with prints | O(n) | Visualize progression |

---

### Common Pitfalls Comparison

| Pitfall | Naive Recursion | Memoization | Iterative | Space Opt |
|---------|-----------------|-------------|-----------|-----------|
| Time limit | ❌ O(2^n) | ✅ O(n) | ✅ O(n) | ✅ O(n) |
| Stack overflow | ❌ Depth n | ❌ Depth n | ✅ None | ✅ None |
| Off-by-one errors | Moderate | Moderate | Common | Common |
| Base case bugs | Common | Common | Rare | Rare |
| Space efficiency | ❌ O(n) stack | ❌ O(n) | O(n) | ✅ O(1) |

<!-- back -->
