# Climbing Stairs

## Problem Description

You are climbing a staircase. It takes **n steps** to reach the top.

Each time you can either climb **1 step** or **2 steps** at a time.

In how many **distinct ways** can you climb to the top?

This is a classic dynamic programming problem that asks for the number of possible combinations of 1-step and 2-step moves that sum up to exactly n steps.

---

## Examples

### Example 1

**Input:**
```python
n = 2
```

**Output:**
```python
2
```

**Explanation:** There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

---

### Example 2

**Input:**
```python
n = 3
```

**Output:**
```python
3
```

**Explanation:** There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

---

### Example 3

**Input:**
```python
n = 5
```

**Output:**
```python
8
```

**Explanation:** There are eight ways to climb to the top.
1. 1+1+1+1+1
2. 1+1+1+2
3. 1+1+2+1
4. 1+2+1+1
5. 2+1+1+1
6. 1+2+2
7. 2+1+2
8. 2+2+1

---

## Constraints

- `1 <= n <= 45`

---

## Intuition

The problem follows the **Fibonacci sequence** pattern. To reach step `n`, you must have come from either:
- Step `n-1` (taking a final 1-step move)
- Step `n-2` (taking a final 2-step move)

Therefore:
```
ways(n) = ways(n-1) + ways(n-2)
```

This is exactly the Fibonacci recurrence relation, with the base cases:
- `ways(1) = 1` (only one way: [1])
- `ways(2) = 2` (two ways: [1,1] or [2])

---

## Multiple Approaches

### Approach 1: Recursive (Naive)

**Idea:** Directly implement the recurrence relation.

**Code:**
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        return self.climbStairs(n - 1) + self.climbStairs(n - 2)
```

**Time Complexity:** O(2^n) - Exponential due to repeated calculations  
**Space Complexity:** O(n) - Call stack depth  
**Problem:** Very slow for n > 40 due to overlapping subproblems

---

### Approach 2: Memoization (Top-Down DP)

**Idea:** Store previously calculated results to avoid redundant calculations.

**Code:**
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        memo = {}
        
        def dp(i):
            if i <= 2:
                return i
            if i not in memo:
                memo[i] = dp(i - 1) + dp(i - 2)
            return memo[i]
        
        return dp(n)
```

**Time Complexity:** O(n) - Each subproblem computed once  
**Space Complexity:** O(n) - Memoization dictionary + call stack

---

### Approach 3: Tabulation (Bottom-Up DP)

**Idea:** Build the solution iteratively from bottom up.

**Code:**
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        dp = [0] * (n + 1)
        dp[1] = 1
        dp[2] = 2
        for i in range(3, n + 1):
            dp[i] = dp[i - 1] + dp[i - 2]
        return dp[n]
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n) - Array of size n

---

### Approach 4: Space-Optimized DP (Best)

**Idea:** Only need the last two values, not the entire array.

**Code:**
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2  # a = ways(n-2), b = ways(n-1)
        for _ in range(3, n + 1):
            a, b = b, a + b  # b becomes ways(n), a becomes old b
        return b
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1) - Only two variables

---

### Approach 5: Matrix Exponentiation (Advanced)

**Idea:** Use fast doubling to compute Fibonacci in O(log n).

**Code:**
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        def matrix_power(matrix, power):
            result = [[1, 0], [0, 1]]
            while power:
                if power % 2:
                    result = multiply(result, matrix)
                matrix = multiply(matrix, matrix)
                power //= 2
            return result
        
        def multiply(A, B):
            return [
                [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
                [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
            ]
        
        if n <= 2:
            return n
        # [F(n+1), F(n)] = [[1,1],[1,0]]^n * [F(1), F(0)]
        # ways(n) = F(n+1) where F is Fibonacci
        power_matrix = [[1, 1], [1, 0]]
        result = matrix_power(power_matrix, n)
        return result[0][1]  # F(n)
```

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

---

## Time/Space Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive | O(2^n) | O(n) | Too slow, not practical |
| Memoization | O(n) | O(n) | Good but uses extra space |
| Tabulation | O(n) | O(n) | Clean but not optimal |
| Space-Optimized | O(n) | O(1) | **Recommended** |
| Matrix Exponentiation | O(log n) | O(1) | Overkill for this problem |

---

## Related Problems

| Problem | Description | Link |
|---------|-------------|------|
| **Min Cost Climbing Stairs** | Find minimum cost to reach top | [LC 746](https://leetcode.com/problems/min-cost-climbing-stairs/) / [Solution](./min-cost-climbing-stairs.md) |
| **Fibonacci Number** | Compute nth Fibonacci number | [LC 509](https://leetcode.com/problems/fibonacci-number/) |
| **Decode Ways** | Similar recurrence, different context | [LC 91](https://leetcode.com/problems/decode-ways/) / [Solution](./decode-ways.md) |
| **House Robber** | Don't rob two adjacent houses | [LC 198](https://leetcode.com/problems/house-robber/) / [Solution](./house-robber.md) |
| **Climbing Stairs with Variable Steps** | Can climb 1, 2, or 3 steps | Variation: extend recurrence to `ways(n) = ways(n-1) + ways(n-2) + ways(n-3)` |
| **N-th Tribonacci Number** | Similar pattern with three terms | [LC 1137](https://leetcode.com/problems/n-th-tribonacci-number/) |

---

## Video Tutorials

1. [NeetCode - Climbing Stairs](https://www.youtube.com/watch?v=mLfjzbeNP8c)
2. [Back-to-Back SWE - Climbing Stairs](https://www.youtube.com/watch?v=uHAT0w0j5B0)
3. [Derrick G. - Dynamic Programming](https://www.youtube.com/watch?v=vYquum9I1y4)

---

## Follow-up Questions

1. **What if you can climb 1, 2, or 3 steps at a time?**  
   The recurrence becomes: `ways(n) = ways(n-1) + ways(n-2) + ways(n-3)`

2. **How would you minimize the cost to climb?**  
   See "Min Cost Climbing Stairs" (LC 746)

3. **What if you can't climb two 2-steps in a row?**  
   Add state tracking: `dp[i][0]` = ways to reach i with last step 1, `dp[i][1]` = ways with last step 2

4. **How would you count ways with step constraints?**  
   Use matrix exponentiation for O(log n) solution

5. **Can you solve this with BFS/DFS?**  
   Yes, but it would be less efficient than DP

---

## Summary

The Climbing Stairs problem is a foundational dynamic programming problem that demonstrates:
- **Optimal substructure**: Problem can be broken into smaller subproblems
- **Overlapping subproblems**: Same subproblems are solved multiple times
- **Space optimization**: Only need to track the last two states

The space-optimized DP solution is the best balance of simplicity and efficiency for this problem.

