## DP - 1D Array (Fibonacci Style): Core Concepts

What are the fundamental concepts and mathematical properties of Fibonacci-style DP?

<!-- front -->

---

### Mathematical Foundation

The Fibonacci sequence exemplifies the pattern:
```
F(n) = F(n-1) + F(n-2)
F(0) = 0, F(1) = 1

Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
```

**Closed Form (Binet's Formula):**
```
F(n) = (φ^n - ψ^n) / √5

Where:
- φ = (1 + √5) / 2 ≈ 1.618 (golden ratio)
- ψ = (1 - √5) / 2 ≈ -0.618
```

---

### DP Properties

| Property | Description | In Fibonacci-Style |
|----------|-------------|-------------------|
| **Optimal Substructure** | Optimal solution contains optimal subsolutions | F(n) uses optimal F(n-1), F(n-2) |
| **Overlapping Subproblems** | Same subproblems solved multiple times | F(3) needed for F(4) and F(5) |
| **Memoization Benefit** | Cache results to avoid recomputation | O(2^n) → O(n) time |
| **Linear State Space** | States form a sequence | dp[0], dp[1], dp[2]... |

---

### State Dependency Patterns

**Two-state dependency (Classic):**
```
dp[i] = dp[i-1] + dp[i-2]           # Fibonacci, Climbing Stairs
dp[i] = max(dp[i-1], dp[i-2] + val) # House Robber
```

**One-state dependency:**
```
dp[i] = dp[i-1] + arr[i]            # Running sum
dp[i] = max(dp[i-1], arr[i])        # Max so far
```

**Multiple-state dependency:**
```
dp[i] = dp[i-1] + dp[i-2] + dp[i-3] # Tribonacci
```

---

### Time Complexity Transformation

| Approach | Time Complexity | Space | Use Case |
|----------|-----------------|-------|----------|
| Naive recursion | O(2^n) | O(n) stack | Never use |
| Top-down memoization | O(n) | O(n) | Understanding, irregular deps |
| Bottom-up tabulation | O(n) | O(n) | Standard implementation |
| Space-optimized | O(n) | O(1) | Production, large n |
| Matrix exponentiation | O(log n) | O(1) | Very large n (Fibonacci) |

**Key Insight:** DP transforms exponential-time recursive solutions into linear-time iterative solutions.

---

### State Definition Guidelines

**Ask these questions:**
1. What does each state represent?
2. What is the recurrence relation?
3. What are the base cases?
4. What is the final answer (usually dp[n] or dp[n-1])?

**Common State Definitions:**
- `dp[i]` = number of ways to reach position i
- `dp[i]` = maximum value achievable at position i
- `dp[i]` = minimum cost to reach position i
- `dp[i]` = true/false if position i is reachable

<!-- back -->
