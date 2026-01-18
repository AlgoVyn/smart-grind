# DP - 1D Array (Fibonacci Style)

## Overview

The DP - 1D Array (Fibonacci Style) pattern is used to solve problems where each state depends only on previous states in a linear manner, similar to how Fibonacci numbers depend on their two preceding values. This pattern is efficient for problems with overlapping subproblems and optimal substructure.

## Key Concepts

- **Fibonacci-like State Transition**: Each state depends on 1 or more previous states.
- **Iterative Approach**: Build solutions from base cases up to the desired state.
- **Space Optimization**: Use variables to track previous states instead of a full array.
- **Base Cases**: Define initial values for small inputs.

## Template

```python
def fibonacci_style(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    prev_prev = 0
    prev = 1
    
    for i in range(2, n + 1):
        current = prev + prev_prev
        prev_prev = prev
        prev = current
    
    return prev
```

## Example Problems

1. **Climbing Stairs (LeetCode 70)**: Find number of ways to climb n stairs.
2. **Fibonacci Number (LeetCode 509)**: Calculate nth Fibonacci number.
3. **House Robber (LeetCode 198)**: Max amount of money that can be robbed.
4. **Min Cost Climbing Stairs (LeetCode 746)**: Minimum cost to climb stairs.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the input size (number of states to compute).
- **Space Complexity**: O(1) with space optimization, O(n) without.

## Common Pitfalls

- **Not defining base cases correctly**: Leads to incorrect results or errors.
- **Using recursion without memoization**: Causes exponential time complexity.
- **Forgetting to update previous states**: Failing to update pointers correctly in iterative approach.
- **Incorrect loop bounds**: Forgetting to include all states up to n.
- **Overcomplicating with extra space**: Using an array when variables are sufficient.
