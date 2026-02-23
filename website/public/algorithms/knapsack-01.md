# 0/1 Knapsack

## Category
Dynamic Programming

## Description
Maximize value with weight constraint. Each item can be taken at most once.

---

## Algorithm Explanation
The 0/1 Knapsack is a classic dynamic programming problem where we have items with weights and values, and we need to maximize the total value while keeping the total weight within a given capacity. Each item can only be taken once (0 or 1).

### Key Concepts:
- **Dynamic Programming**: Break down the problem into smaller subproblems
- **Choice**: For each item, we either take it or don't (binary choice)
- **Optimal Substructure**: The optimal solution can be built from optimal solutions of subproblems

### How It Works:
1. Create a 2D DP table where dp[i][w] represents the maximum value using first i items with capacity w
2. For each item, decide: include it (if weight fits) or exclude it
3. Take the maximum of including or excluding the current item
4. The answer is dp[n][W] where n is number of items and W is capacity

### Space Optimization:
We can use a 1D DP array by iterating capacity in reverse order (to avoid using the same item twice).

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

## Implementation

```python
from typing import List

def knapsack(values: List[int], weights: List[int], capacity: int) -> int:
    """
    0/1 Knapsack - maximize value with weight constraint.
    
    Args:
        values: List of values for each item
        weights: List of weights for each item
        capacity: Maximum weight capacity of knapsack
    
    Returns:
        Maximum value that can be achieved
    """
    n = len(values)
    
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't include item i-1
            dp[i][w] = dp[i - 1][w]
            
            # Include item i-1 if it fits
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
    
    return dp[n][capacity]


def knapsack_space_optimized(values: List[int], weights: List[int], capacity: int) -> int:
    """
    Space-optimized 0/1 Knapsack using 1D DP array.
    """
    n = len(values)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # Iterate backwards to avoid using same item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]


# Example usage
if __name__ == "__main__":
    values = [60, 100, 120]
    weights = [10, 20, 30]
    capacity = 50
    
    result = knapsack(values, weights, capacity)
    print(f"Items: {list(zip(values, weights))}")
    print(f"Knapsack capacity: {capacity}")
    print(f"Maximum value: {result}")
    
    # Space-optimized version
    result_opt = knapsack_space_optimized(values, weights, capacity)
    print(f"Space-optimized result: {result_opt}")
```

```javascript
function knapsack-01() {
    // 0/1 Knapsack implementation
    // Time: O(n * W)
    // Space: O(n * W)
}
```

---

## Example

**Input:**
```
values = [60, 100, 120]
weights = [10, 20, 30]
capacity = 50
```

**Output:**
```
Items: [(60, 10), (100, 20), (120, 30)]
Knapsack capacity: 50
Maximum value: 220
```

**Explanation:**
- Item 1: value=60, weight=10
- Item 2: value=100, weight=20
- Item 3: value=120, weight=30

Optimal selection: Items 2 and 3 (weights 20+30=50, values 100+120=220)

---

## Time Complexity
**O(n * W)**

---

## Space Complexity
**O(n * W)**

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
