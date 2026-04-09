## DP - Interval DP: Comparison

When should you use different approaches for Interval DP problems?

<!-- front -->

---

### Bottom-Up vs Memoization

| Aspect | Bottom-Up (Iterative) | Memoization (Top-Down) |
|--------|----------------------|------------------------|
| **Approach** | Build from small intervals | Recursive with cache |
| **Stack space** | O(1) | O(n) recursion depth |
| **Code clarity** | More verbose | Natural for some problems |
| **State pruning** | Computes all states | Can skip unnecessary states |
| **Initialization** | Explicit base cases | Implicit in recursion |
| **Iteration order** | Must be correct | Handled by recursion |

**Winner:** Bottom-up for most interval DP (predictable, no stack risk).

---

### Standard vs Optimized Interval DP

| Aspect | Standard O(n³) | Optimized O(n²) |
|--------|----------------|-----------------|
| **When applicable** | General problems | Knuth's optimization, Monge property |
| **Examples** | Burst Balloons, Matrix Chain | Optimal BST, some merge problems |
| **Split point search** | Try all k | Restricted search range |
| **Precomputation** | Not needed | Often requires monotonicity |

**When O(n²) is possible:**
- Quadrangle inequality (Knuth's optimization)
- Monge array property
- Four-point conditions

---

### Interval DP vs Other DP Patterns

| Feature | Interval DP | 1D Linear DP | 2D Grid DP |
|---------|-------------|--------------|------------|
| **State** | `dp[i][j]` for interval | `dp[i]` for position | `dp[i][j]` for cell |
| **Dependencies** | All subintervals [i,k], [k+1,j] | Previous 1-2 states | Top, left, diagonal |
| **Time** | O(n³) typically | O(n) | O(n×m) |
| **Space** | O(n²) | O(1) or O(n) | O(n×m) or O(m) |
| **Problems** | Balloons, partitioning | Fibonacci, knapsack | Paths, edit distance |

---

### Open vs Closed Intervals

| Notation | Meaning | Example |
|----------|---------|---------|
| **[i, j]** | Closed - includes both ends | `dp[i][j]`, k in range(i, j+1) |
| **[i, j)** | Half-open - i inclusive, j exclusive | `dp[i][j]`, k in range(i, j) |
| **(i, j)** | Open - excludes both ends | Burst Balloons with virtual boundaries |

**Recommendation:** Be consistent. Closed [i,j] is most common for interval DP.

---

### Decision Tree

```
Problem involves intervals/ranges?
├── Yes
│   ├── Can be split at partition points?
│   │   ├── Yes → Standard Interval DP O(n³)
│   │   └── No → Check other patterns
│   ├── Has quadrangle inequality?
│   │   ├── Yes → Knuth's optimization O(n²)
│   │   └── No → Standard O(n³)
│   ├── Need path reconstruction?
│   │   ├── Yes → Store choice array
│   │   └── No → Standard DP
│   └── Circular array?
│       ├── Yes → Try all starting points
│       └── No → Standard linear
└── No → Consider other DP patterns
```

---

### Comparison: Related Problems

| Problem | Pattern | Time | Key Difference |
|---------|---------|------|----------------|
| Burst Balloons | Last operation | O(n³) | What bursts last |
| Matrix Chain | Partition | O(n³) | Optimal parenthesization |
| Palindrome II | Precompute + DP | O(n²) | Precompute palindromes |
| Merge Stones | Interval + cost | O(n³) | Merge adjacent piles |
| Remove Boxes | Interval + groups | O(n⁴) | Track consecutive colors |
| Strange Printer | Greedy + DP | O(n³) | Print same character runs |

---

### Pitfalls Comparison

| Pitfall | Naive | Memoization | Bottom-Up |
|---------|-------|-------------|-----------|
| Time limit | ❌ Exponential | ✅ O(n³) | ✅ O(n³) |
| Stack overflow | ❌ | ❌ Depth n | ✅ None |
| Wrong iteration order | N/A | Handled | ⚠️ Common bug |
| Off-by-one | Moderate | Moderate | Common |
| Space efficiency | ❌ | O(n²) + stack | ✅ O(n²) |

<!-- back -->
