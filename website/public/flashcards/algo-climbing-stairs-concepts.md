## Climbing Stairs: Core Concepts

What is the climbing stairs problem and how does it model dynamic programming?

<!-- front -->

---

### Problem Definition

You are climbing a staircase with `n` steps. Each time you can climb either **1 or 2 steps**. How many distinct ways can you climb to the top?

**Example:** n = 3
- Ways: [1,1,1], [1,2], [2,1] → **3 ways**

---

### Mathematical Structure

This is the **Fibonacci sequence** in disguise:

```
f(n) = f(n-1) + f(n-2)

Where:
- f(n-1): ways ending with a single step
- f(n-2): ways ending with a double step

Base cases:
- f(0) = 1 (one way to stay at ground)
- f(1) = 1 (only one single step)
- f(2) = 2 (1+1 or 2)
```

---

### Dynamic Programming Pattern

| Aspect | Property |
|--------|----------|
| **Optimal substructure** | Solution uses optimal solutions to subproblems |
| **Overlapping subproblems** | f(n-1) needed for both f(n) and f(n+1) |
| **State** | Single integer: current step |
| **Transition** | dp[i] = dp[i-1] + dp[i-2] |

---

### Closed-Form Solution (Binet's Formula)

```
f(n) = (φⁿ - ψⁿ) / √5

Where:
- φ = (1 + √5) / 2 ≈ 1.618 (golden ratio)
- ψ = (1 - √5) / 2 ≈ -0.618
```

```python
def fib_binet(n):
    sqrt5 = 5 ** 0.5
    phi = (1 + sqrt5) / 2
    return round(phi ** n / sqrt5)
```

**Limitation:** Floating point precision issues for large n.

---

### Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Naive recursion | O(2ⁿ) | O(n) stack | Exponential, TLE |
| Memoization | O(n) | O(n) | Top-down DP |
| Tabulation | O(n) | O(n) | Bottom-up DP |
| Space optimized | O(n) | O(1) | Keep only last 2 |
| Matrix exponentiation | O(log n) | O(1) | Fast for very large n |
| Closed form | O(1) | O(1) | Precision limits |

<!-- back -->
