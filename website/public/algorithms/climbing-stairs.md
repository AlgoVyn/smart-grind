# Climbing Stairs

## Category
Dynamic Programming

## Description
Count ways to climb n stairs taking 1 or 2 steps at a time.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Climbing Stairs problem is a classic dynamic programming problem that models a Fibonacci-like sequence. The key insight is that to reach step n, you can either:

1. Take 1 step from step (n-1), or
2. Take 2 steps from step (n-2)

This creates the recurrence relation: `ways(n) = ways(n-1) + ways(n-2)`

**Approaches:**
1. **Bottom-up DP**: Build up from base cases iteratively
2. **Memoization**: Recursive with caching
3. **Optimized Space**: Only keep track of the last two values

The solution is essentially the Fibonacci sequence where:
- ways(1) = 1 (one way: take 1 step)
- ways(2) = 2 (two ways: 1+1 or 2)
- ways(3) = 3 (ways(2) + ways(1) = 2 + 1)
- ways(4) = 5 (ways(3) + ways(2) = 3 + 2)

This pattern appears in many problems including house robber and unique binary search paths.

---

## Implementation

```python
def climb_stairs(n):
    """
    Count distinct ways to reach the top of a staircase.
    You can climb 1 or 2 steps at a time.
    
    Args:
        n: Number of stairs
        
    Returns:
        Number of distinct ways to reach the top
        
    Time: O(n)
    Space: O(1)
    """
    if n <= 2:
        return n
    
    # Only need to track previous two values
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


# Alternative: Recursive with memoization
from functools import lru_cache

def climb_stairs_memo(n):
    """Recursive solution with memoization."""
    @lru_cache(maxsize=None)
    def helper(n):
        if n <= 2:
            return n
        return helper(n - 1) + helper(n - 2)
    
    return helper(n)


# Alternative: Dynamic programming with array
def climb_stairs_dp(n):
    """DP solution using array - useful for modification."""
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]
```

```javascript
function climbingStairs() {
    // Climbing Stairs implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
n = 5
```

**Output:**
```
8
```

**Explanation:**
There are 8 ways to climb 5 stairs:
- 1+1+1+1+1
- 1+1+1+2
- 1+1+2+1
- 1+2+1+1
- 2+1+1+1
- 2+2+1
- 2+1+2
- 1+2+2

**Verification:**
- n=1 → 1 way (1)
- n=2 → 2 ways (1+1, 2)
- n=3 → 3 ways (1+1+1, 1+2, 2+1)
- n=4 → 5 ways
- n=5 → 8 ways (Fibonacci sequence)

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
