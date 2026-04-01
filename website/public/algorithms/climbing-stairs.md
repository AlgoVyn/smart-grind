# Climbing Stairs

## Category
Dynamic Programming

## Description

The Climbing Stairs problem is a classic dynamic programming problem that asks: "In how many distinct ways can you climb to the top of a staircase with n steps, if each time you can climb either 1 or 2 steps?" This problem serves as an excellent introduction to dynamic programming and demonstrates the Fibonacci pattern that appears in many optimization problems.

The key insight is that to reach step `n`, you can only come from step `n-1` (by taking a single step) or step `n-2` (by taking a double step). This creates the recurrence relation `ways(n) = ways(n-1) + ways(n-2)`, which is exactly the Fibonacci sequence. This pattern demonstrates optimal substructure and overlapping subproblems, core concepts in dynamic programming.

---

## Concepts

The Climbing Stairs technique is built on several fundamental concepts that make it powerful for solving path-counting and sequence problems.

### 1. Recurrence Relation

The fundamental pattern behind climbing stairs:

| Step | Ways to Reach | Breakdown |
|------|---------------|-----------|
| 1 | 1 | [1] |
| 2 | 2 | [1,1], [2] |
| 3 | 3 | [1,1,1], [1,2], [2,1] |
| 4 | 5 | From step 3 (3 ways) + From step 2 (2 ways) |
| 5 | 8 | From step 4 (5 ways) + From step 3 (3 ways) |

Pattern: `ways(n) = ways(n-1) + ways(n-2)` (Fibonacci)

### 2. Optimal Substructure

The solution for n depends on solutions for smaller problems:

```
ways(5) depends on:
├── ways(4): All ways to reach step 4, then take 1 step
└── ways(3): All ways to reach step 3, then take 2 steps
```

This structure allows building solutions incrementally.

### 3. Overlapping Subproblems

The same subproblems are computed multiple times in naive recursion:

```
ways(5) uses ways(4) and ways(3)
ways(4) uses ways(3) and ways(2)
       ↑
    ways(3) computed twice!
```

DP eliminates this redundancy.

### 4. Space Optimization Principle

Since we only need the last two values, we can reduce space:

| Approach | Space | Values Stored |
|----------|-------|---------------|
| Full DP Array | O(n) | dp[0], dp[1], ..., dp[n] |
| Space Optimized | O(1) | prev2, prev1 (rolling) |

---

## Frameworks

Structured approaches for solving Climbing Stairs problems.

### Framework 1: Space-Optimized Template

```
┌─────────────────────────────────────────────────────┐
│  SPACE-OPTIMIZED FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Handle base cases:                               │
│     - n <= 2: return n                              │
│                                                      │
│  2. Initialize rolling variables:                  │
│     prev2 = 1   (ways to reach step 1)              │
│     prev1 = 2   (ways to reach step 2)              │
│                                                      │
│  3. Iterate from step 3 to n:                       │
│     current = prev1 + prev2                         │
│     prev2 = prev1                                   │
│     prev1 = current                                 │
│                                                      │
│  4. Return prev1                                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Production code, large n values, when only final count is needed.

### Framework 2: DP Array Template

```
┌─────────────────────────────────────────────────────┐
│  DP ARRAY FRAMEWORK                                 │
├─────────────────────────────────────────────────────┤
│  1. Create dp array of size n+1                     │
│  2. dp[0] = 1  (one way to stay at ground)        │
│  3. dp[1] = 1  (one way: single step)              │
│  4. For i from 2 to n:                             │
│     dp[i] = dp[i-1] + dp[i-2]                      │
│  5. Return dp[n]                                     │
│                                                      │
│  Benefit: Can reconstruct actual paths               │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need all intermediate values or path reconstruction.

### Framework 3: Generalized Steps Template

```
┌─────────────────────────────────────────────────────┐
│  GENERALIZED STEPS FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  For steps {1, 2, ..., k}:                          │
│                                                      │
│  1. Initialize k variables for base cases          │
│  2. For i from k+1 to n:                           │
│     current = sum of last k values                 │
│     Shift window: drop oldest, add current          │
│  3. Return final value                               │
│                                                      │
│  Example: steps {1,2,3} → Tribonacci pattern        │
└─────────────────────────────────────────────────────┘
```

**When to use**: When allowed steps are not just 1 and 2.

---

## Forms

Different manifestations of the Climbing Stairs pattern.

### Form 1: Classic (Steps 1 or 2)

Standard Fibonacci pattern:

| n | Ways | Formula |
|---|------|---------|
| 1 | 1 | F(2) |
| 2 | 2 | F(3) |
| 3 | 3 | F(4) |
| 4 | 5 | F(5) |
| 5 | 8 | F(6) |

### Form 2: Generalized Steps

Can take 1, 2, or 3 steps at a time:

```
ways(n) = ways(n-1) + ways(n-2) + ways(n-3)

n=1: 1
n=2: 2  ([1,1], [2])
n=3: 4  ([1,1,1], [1,2], [2,1], [3])
n=4: 7  (sum of ways(3)+ways(2)+ways(1) = 4+2+1)
```

This is the Tribonacci sequence.

### Form 3: Variable Step Costs

Each step has a cost, find minimum cost to reach top:

```
MinCost[i] = cost[i] + min(MinCost[i-1], MinCost[i-2])
```

**Example**: LeetCode 746 - Min Cost Climbing Stairs

### Form 4: Forbidden Steps

Some steps are broken/unsafe:

```
If step i is broken:
    ways[i] = 0
Else:
    ways[i] = ways[i-1] + ways[i-2]
```

### Form 5: Decode Ways (String Variant)

Count ways to decode digit string (similar DP structure):

```
dp[i] = dp[i-1] (if s[i] is valid) + dp[i-2] (if s[i-2:i] is valid)
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Matrix Exponentiation for O(log n)

For extremely large n (n > 10^6):

```python
def matrix_mult(A, B, mod):
    """Multiply two 2x2 matrices."""
    return [[(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % mod,
             (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % mod],
            [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % mod,
             (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % mod]]

def matrix_pow(M, n, mod):
    """Calculate matrix M raised to power n."""
    if n == 1:
        return M
    if n % 2 == 0:
        half = matrix_pow(M, n // 2, mod)
        return matrix_mult(half, half, mod)
    else:
        return matrix_mult(M, matrix_pow(M, n - 1, mod), mod)

def climb_stairs_log_n(n, mod=10**9+7):
    """O(log n) solution using matrix exponentiation."""
    if n <= 2:
        return n
    
    # Transformation matrix for Fibonacci
    M = [[1, 1], [1, 0]]
    result = matrix_pow(M, n, mod)
    
    # F(n+1) is at position [0][0]
    return result[0][0]
```

### Tactic 2: Pisano Period for Modulo

Fibonacci numbers modulo m are periodic:

```python
def pisano_period(m):
    """Find the Pisano period for modulo m."""
    prev, curr = 0, 1
    for i in range(m * m):
        prev, curr = curr, (prev + curr) % m
        if prev == 0 and curr == 1:
            return i + 1

def fib_mod(n, m):
    """F(n) mod m using Pisano period."""
    period = pisano_period(m)
    n = n % period
    
    # Compute F(n) normally
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, (prev + curr) % m
    return curr
```

### Tactic 3: Binet's Formula (Closed Form)

Direct computation using golden ratio:

```python
import math

def fib_binet(n):
    """
    F(n) using Binet's formula.
    Limitations: Floating point precision for n > 70.
    """
    sqrt5 = math.sqrt(5)
    phi = (1 + sqrt5) / 2  # Golden ratio
    
    return round(phi**n / sqrt5)

# For climbing stairs: ways(n) = F(n+1)
def climb_stairs_binet(n):
    return fib_binet(n + 1)
```

**Warning**: Use only for small n or when approximation is acceptable.

### Tactic 4: Fast Doubling Method

Recursive formulas for F(2n) and F(2n+1):

```python
def fib_fast_doubling(n, mod=None):
    """
    Returns (F(n), F(n+1)) using fast doubling.
    Time: O(log n)
    """
    if n == 0:
        return (0, 1)
    
    # Recursively find F(n//2) and F(n//2 + 1)
    a, b = fib_fast_doubling(n >> 1, mod)
    
    # F(2k) = F(k) * [2*F(k+1) - F(k)]
    # F(2k+1) = F(k+1)^2 + F(k)^2
    c = a * ((b << 1) - a)
    d = a * a + b * b
    
    if mod:
        c %= mod
        d %= mod
    
    if n & 1:  # n is odd
        return (d, c + d)
    else:
        return (c, d)

def climb_stairs_fast(n, mod=None):
    """Ways(n) = F(n+1)"""
    return fib_fast_doubling(n + 1, mod)[0]
```

### Tactic 5: Rolling Array for k-Steps

General pattern for arbitrary step sizes:

```python
def climb_stairs_k_steps(n, allowed_steps):
    """
    Count ways with arbitrary step sizes.
    allowed_steps: list of step sizes (e.g., [1, 2, 3])
    """
    max_step = max(allowed_steps)
    
    # Use a deque to maintain rolling window
    from collections import deque
    dp = deque([0] * max_step, maxlen=max_step)
    
    # Initialize base cases
    dp[0] = 1  # One way to be at step 0
    
    for i in range(1, n + 1):
        # Sum ways from all valid previous steps
        ways = 0
        for step in allowed_steps:
            if i - step >= 0:
                ways += dp[(i - step) % max_step]
        
        dp.append(ways)
    
    return dp[-1]
```

---

## Python Templates

### Template 1: Space-Optimized Classic

```python
def climb_stairs(n: int) -> int:
    """
    Template 1: Space-optimized solution (1 or 2 steps).
    Time: O(n), Space: O(1)
    """
    if n <= 2:
        return n
    
    # Only need previous two values
    prev2, prev1 = 1, 2
    
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

### Template 2: With Modulo (Large Numbers)

```python
def climb_stairs_mod(n: int, mod: int = 10**9 + 7) -> int:
    """
    Template 2: With modulo for competitive programming.
    Time: O(n), Space: O(1)
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for _ in range(3, n + 1):
        current = (prev1 + prev2) % mod
        prev2 = prev1
        prev1 = current
    
    return prev1
```

### Template 3: Memoization (Top-Down)

```python
from functools import lru_cache

def climb_stairs_memo(n: int) -> int:
    """
    Template 3: Recursive with memoization.
    Time: O(n), Space: O(n)
    """
    @lru_cache(maxsize=None)
    def helper(i):
        if i <= 2:
            return i
        return helper(i - 1) + helper(i - 2)
    
    return helper(n)
```

### Template 4: Generalized Steps (1, 2, or 3)

```python
def climb_stairs_three(n: int) -> int:
    """
    Template 4: Can take 1, 2, or 3 steps.
    Time: O(n), Space: O(1)
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    if n == 2:
        return 2  # [1,1], [2]
    if n == 3:
        return 4  # [1,1,1], [1,2], [2,1], [3]
    
    prev3, prev2, prev1 = 1, 2, 4
    
    for _ in range(4, n + 1):
        current = prev1 + prev2 + prev3
        prev3, prev2, prev1 = prev2, prev1, current
    
    return prev1
```

### Template 5: Min Cost Climbing Stairs

```python
def min_cost_climbing_stairs(cost: list[int]) -> int:
    """
    Template 5: Variable costs per step.
    Find minimum cost to reach the top.
    Time: O(n), Space: O(1)
    """
    n = len(cost)
    if n <= 1:
        return 0
    
    # Min cost to reach step i
    prev2 = cost[0]  # Step 0
    prev1 = cost[1]  # Step 1
    
    for i in range(2, n):
        current = cost[i] + min(prev1, prev2)
        prev2, prev1 = prev1, current
    
    # Can finish from either of the last two steps
    return min(prev1, prev2)
```

### Template 6: Decode Ways (String Variant)

```python
def num_decodings(s: str) -> int:
    """
    Template 6: Decode digit string (similar DP pattern).
    '1'-'9' map to 'A'-'I', '10'-'26' map to 'J'-'Z'.
    Time: O(n), Space: O(1)
    """
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    # dp[i] = ways to decode s[:i]
    prev2, prev1 = 1, 1  # Empty string and first char
    
    for i in range(1, n):
        current = 0
        
        # Single digit decode (if s[i] != '0')
        if s[i] != '0':
            current += prev1
        
        # Two digit decode (if '10' <= s[i-1:i+1] <= '26')
        two_digit = int(s[i-1:i+1])
        if 10 <= two_digit <= 26:
            current += prev2
        
        prev2, prev1 = prev1, current
    
    return prev1
```

---

## When to Use

Use the Climbing Stairs algorithm when you need to solve problems involving:

- **Counting distinct ways** to reach a target with constrained moves
- **Fibonacci-like sequences** where each state depends on previous states
- **Path counting problems** with step constraints
- **Dynamic programming** with overlapping subproblems
- **Optimization problems** that build upon smaller subproblems

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Recursion** | O(2ⁿ) | O(n) stack | Understanding the problem (not for large n) |
| **Memoization (Top-down)** | O(n) | O(n) | When n is moderate and clarity matters |
| **Tabulation (Bottom-up)** | O(n) | O(n) | When you need the full DP table for variations |
| **Space-Optimized** | O(n) | O(1) | Production code, large n values |
| **Matrix Exponentiation** | O(log n) | O(1) | Extremely large n (n > 10⁶) |
| **Binet's Formula** | O(1) | O(1) | Mathematical approximation (rounding issues) |

### When to Choose Each Approach

- **Choose Space-Optimized DP** when:
  - You only need the final count
  - Memory is constrained
  - This is the most common interview solution

- **Choose Memoization** when:
  - The recurrence relation is complex
  - You want to avoid thinking about iteration order
  - You need to solve only specific subproblems

- **Choose Matrix Exponentiation** when:
  - n is extremely large (10⁹+)
  - You need the result modulo some number
  - This is advanced competitive programming

---

## Algorithm Explanation

### Core Concept

The key insight is that to reach step `n`, you can only come from:
1. **Step n-1** (by taking a single step)
2. **Step n-2** (by taking a double step)

This creates the recurrence relation:
```
ways(n) = ways(n-1) + ways(n-2)
```

This is exactly the **Fibonacci sequence** shifted by one position:
- ways(1) = 1 (only: [1])
- ways(2) = 2 ([1,1] or [2])
- ways(3) = 3 ([1,1,1], [1,2], [2,1])
- ways(4) = 5 ([1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2])

### Why It Works

The solution leverages **optimal substructure**: the number of ways to reach step n depends only on the number of ways to reach steps n-1 and n-2. It also exhibits **overlapping subproblems**: calculating ways(5) requires ways(4) and ways(3), and calculating ways(4) also requires ways(3) - the subproblems overlap.

### How It Works

#### Space-Optimized Approach:

1. **Handle base cases**: If n ≤ 2, return n directly
2. **Initialize two variables**: `prev2 = 1` (ways to reach step 1), `prev1 = 2` (ways to reach step 2)
3. **Iterate from 3 to n**:
   - Calculate current = prev1 + prev2
   - Update prev2 = prev1
   - Update prev1 = current
4. **Return prev1** as the result

#### DP Array Approach:

1. **Create dp array** of size n+1
2. **Set base cases**: dp[1] = 1, dp[2] = 2
3. **Fill array iteratively**: For i from 3 to n, dp[i] = dp[i-1] + dp[i-2]
4. **Return dp[n]**

### Visual Representation

For n = 4 stairs:

```
Step 0: 1 way (starting point)
Step 1: 1 way (0→1)
Step 2: 2 ways (0→1→2, 0→2)
Step 3: 3 ways (from step 1: 2 ways, from step 2: 1 way)
Step 4: 5 ways (from step 2: 2 ways, from step 3: 3 ways)

Tree representation for n=3:
        0
       / \
      1   2
     / \   \
    2   3   3
   /
  3
```

### Why This Works

Each step's solution builds upon previous solutions. By storing intermediate results, we avoid recalculating the same subproblems exponentially many times.

### Limitations

- **Integer overflow**: For large n, results exceed 64-bit integers (use modulo)
- **Linear time for DP**: O(n) may be too slow for n > 10⁹ (use matrix exponentiation)
- **Only works for additive patterns**: Different step rules need different approaches

---

## Practice Problems

### Problem 1: House Robber

**Problem:** [LeetCode 198 - House Robber](https://leetcode.com/problems/house-robber/)

**Description:** You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses are broken into on the same night.

**How to Apply Climbing Stairs Pattern:**
- This is a variation where you choose the maximum instead of sum
- dp[i] = max(dp[i-1], dp[i-2] + nums[i])
- Same DP structure, different recurrence relation

---

### Problem 2: Min Cost Climbing Stairs

**Problem:** [LeetCode 746 - Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)

**Description:** You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index 0, or the step with index 1. Return the minimum cost to reach the top of the floor.

**How to Apply Climbing Stairs Pattern:**
- Direct variation: find minimum cost instead of counting ways
- dp[i] = cost[i] + min(dp[i-1], dp[i-2])
- Same step constraints, optimization objective

---

### Problem 3: N-th Tribonacci Number

**Problem:** [LeetCode 1137 - N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)

**Description:** The Tribonacci sequence Tn is defined as follows: T0 = 0, T1 = 1, T2 = 1, and Tn+3 = Tn + Tn+1 + Tn+2 for n >= 0. Given n, return the value of Tn.

**How to Apply Climbing Stairs Pattern:**
- Direct extension to three previous states
- Same space optimization technique applies
- Use three variables instead of two

---

### Problem 4: Decode Ways

**Problem:** [LeetCode 91 - Decode Ways](https://leetcode.com/problems/decode-ways/)

**Description:** A message containing letters from A-Z can be encoded into numbers using the mapping: 'A' -> "1", 'B' -> "2", ..., 'Z' -> "26". Given a string s containing only digits, return the number of ways to decode it.

**How to Apply Climbing Stairs Pattern:**
- Each position depends on single digit (1 way) or double digit (if valid, 1 way)
- dp[i] = dp[i-1] (if s[i] valid) + dp[i-2] (if s[i-1:i+1] valid)
- Classic DP with multiple transition conditions

---

### Problem 5: Unique Paths

**Problem:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Description:** There is a robot on an m x n grid. The robot is initially located at the top-left corner and tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. How many possible unique paths are there?

**How to Apply Climbing Stairs Pattern:**
- 2D version of climbing stairs
- dp[i][j] = dp[i-1][j] + dp[i][j-1] (from top + from left)
- Same principle extended to two dimensions

---

## Video Tutorial Links

### Fundamentals

- [Climbing Stairs - Dynamic Programming (NeetCode)](https://www.youtube.com/watch?v=Y0lT9Fck7qI) - Clear explanation of the DP approach
- [Fibonacci & Climbing Stairs (Take U Forward)](https://www.youtube.com/watch?v=mLfjzJs_n8M) - Comprehensive breakdown with multiple approaches
- [Climbing Stairs Solution (Nick White)](https://www.youtube.com/watch?v=5o-kdjv7FD0) - Step-by-step walkthrough

### Advanced Topics

- [Matrix Exponentiation for Fibonacci](https://www.youtube.com/watch?v=nN6x1Q14x5c) - O(log n) solution technique
- [Dynamic Programming Patterns](https://www.youtube.com/watch?v=aPQY__2H3tE) - Recognizing DP problems
- [Space Optimization in DP](https://www.youtube.com/watch?v=3B8RJvGiowk) - Reducing space complexity

---

## Follow-up Questions

### Q1: Can we solve this problem in O(log n) time?

**Answer:** Yes, using **matrix exponentiation** or **fast doubling** for Fibonacci numbers:

```
| F(n+1)  F(n)   |   | 1  1 |^n
| F(n)    F(n-1) | = | 1  0 |
```

Matrix exponentiation using binary exponentiation gives O(log n) time. This is useful when n is extremely large (10⁹+).

### Q2: What if we can take 1, 2, or k steps at a time?

**Answer:** The recurrence becomes:
```
ways(n) = ways(n-1) + ways(n-2) + ... + ways(n-k)
```

With base cases:
- ways(0) = 1 (one way to stay at ground)
- ways(i) = sum of ways(j) for all valid j < i

Time complexity: O(n × k), space: O(k) with sliding window optimization.

### Q3: How do we handle very large n (n > 10⁶) with modulo?

**Answer:** For very large n with modulo m:
1. **Matrix Exponentiation**: O(log n) time, works for any size
2. **Pisano Period**: Fibonacci numbers modulo m are periodic with period ≤ 6m
3. **Fast Doubling**: Recursive formula for F(2n) and F(2n+1)

```python
def fib_mod(n, mod):
    if n == 0: return 0
    def helper(k):
        if k == 0: return (0, 1)
        a, b = helper(k >> 1)
        c = (a * ((b << 1) - a)) % mod
        d = (a * a + b * b) % mod
        if k & 1: return (d, (c + d) % mod)
        return (c, d)
    return helper(n)[0]
```

### Q4: What's the closed-form formula (Binet's formula)?

**Answer:** The nth Fibonacci number can be computed directly:
```
F(n) = (φⁿ - ψⁿ) / √5

where:
φ = (1 + √5) / 2 ≈ 1.618 (golden ratio)
ψ = (1 - √5) / 2 ≈ -0.618
```

For large n, round to nearest integer: `F(n) = round(φⁿ / √5)`

**Limitations**: Floating point precision issues for n > 70. Use DP for exact answers.

### Q5: How does this relate to other DP problems?

**Answer:** Climbing Stairs demonstrates key DP concepts applicable to many problems:

| Problem | Relation to Climbing Stairs |
|---------|---------------------------|
| **House Robber** | Max instead of sum, skip adjacent |
| **Coin Change** | Unbounded knapsack, minimum coins |
| **Word Break** | Can we reach the end with valid words |
| **Longest Increasing Subsequence** | Build on smaller valid sequences |
| **Edit Distance** | 2D DP, multiple transition choices |

All share: **optimal substructure** + **overlapping subproblems**.

---

## Summary

The **Climbing Stairs** problem is a fundamental dynamic programming problem that introduces the Fibonacci pattern and serves as a gateway to more complex DP problems. Key takeaways:

- **Recurrence Relation**: `ways(n) = ways(n-1) + ways(n-2)`
- **Base Cases**: ways(1) = 1, ways(2) = 2
- **Space Optimization**: Only need last two values (O(1) space)
- **Time Complexity**: O(n) with simple iteration, O(log n) with matrix exponentiation
- **Pattern Recognition**: Watch for counting problems with step constraints

### When to Apply:
- ✅ Counting distinct paths/ways to reach a target
- ✅ Problems with fixed step sizes
- ✅ Sequential decision-making with constraints
- ✅ Problems exhibiting Fibonacci-like growth

### Common Pitfalls:
- ❌ Using naive recursion (exponential time)
- ❌ Off-by-one errors in base cases
- ❌ Integer overflow (use modulo for large n)
- ❌ Not recognizing the Fibonacci pattern

This pattern appears frequently in interviews and competitive programming. Mastering it provides a solid foundation for tackling more advanced dynamic programming problems.
