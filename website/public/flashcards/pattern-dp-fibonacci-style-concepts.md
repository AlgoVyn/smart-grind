## DP - Fibonacci Style (1D Array): Core Concepts

What are the fundamental principles of 1D dynamic programming with Fibonacci-style recurrence?

<!-- front -->

---

### Core Concept

Use **a 1D array to store solutions to subproblems**, building up from base cases using the recurrence relation.

**Key insight**: Problems where the solution at `i` depends only on previous values (usually `i-1`, `i-2`, etc.) can be solved with O(n) space (or O(1) with optimization).

---

### The Pattern

```
Classic Fibonacci: F(n) = F(n-1) + F(n-2)

Recursive (inefficient):
  F(5) = F(4) + F(3)
       = (F(3) + F(2)) + (F(2) + F(1))
       = ... exponential tree

DP (bottom-up):
  dp[0] = 0, dp[1] = 1
  
  i=2: dp[2] = dp[1] + dp[0] = 1 + 0 = 1
  i=3: dp[3] = dp[2] + dp[1] = 1 + 1 = 2
  i=4: dp[4] = dp[3] + dp[2] = 2 + 1 = 3
  i=5: dp[5] = dp[4] + dp[3] = 3 + 2 = 5
  
Result: dp[5] = 5 ✓

Time: O(n), Space: O(n) → can be optimized to O(1)
```

---

### Common DP Problems

| Problem | Recurrence | Space |
|-----------|------------|-------|
| **Fibonacci** | dp[i] = dp[i-1] + dp[i-2] | O(1) |
| **Climbing Stairs** | dp[i] = dp[i-1] + dp[i-2] | O(1) |
| **House Robber** | dp[i] = max(dp[i-1], dp[i-2] + nums[i]) | O(1) |
| **Min Cost Climbing** | dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]) | O(1) |
| **Maximum Subarray (Kadane)** | dp[i] = max(nums[i], dp[i-1] + nums[i]) | O(1) |

---

### Space Optimization

| Version | Space | When to use |
|---------|-------|-------------|
| Full array | O(n) | Need to reconstruct path/solution |
| Rolling variables | O(1) | Only need final result |

```python
# O(1) space Fibonacci
def fib_optimized(n):
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1  # dp[i-2], dp[i-1]
    
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

---

### Complexity

| Aspect | Standard | Optimized |
|--------|----------|-----------|
| Time | O(n) | O(n) |
| Space | O(n) | O(1) |
| Recursion | O(2^n) without memo | - |

<!-- back -->
