# DP - Catalan Numbers

## Overview

This pattern is used for counting problems that follow the Catalan number sequence, like valid parentheses or binary trees. It's for combinatorial counting with recursive structures. Benefits include direct computation using DP.

## Key Concepts

- C_n = (1/(n+1)) * (2n choose n)
- dp[n] = sum dp[i] * dp[n-1-i] for i in 0 to n-1
- Represents number of valid sequences.

## Template

```python
def catalan(n):
    if n <= 1:
        return 1
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    return dp[n]
```

## Example Problems

1. Generate Parentheses: Number of valid parenthesis combinations.
2. Unique Binary Search Trees: Number of unique BSTs.
3. Catalan Number: Direct computation.

## Time and Space Complexity

- Time: O(n^2)
- Space: O(n)

## Common Pitfalls

- Off-by-one in loops.
- Forgetting base cases.
- Not recognizing Catalan patterns.