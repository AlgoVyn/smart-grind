# Min Cost Climbing Stairs

## Problem Description

You are given an integer array `cost` where `cost[i]` is the cost of the ith step on a staircase. Once you pay the cost, you can either climb one or two steps.

You can either start from the step with index 0, or the step with index 1.

Return the minimum cost to reach the top of the floor (past the last step). The top of the floor is the index after the last element.

**Link to problem:** [Min Cost Climbing Stairs - LeetCode 746](https://leetcode.com/problems/min-cost-climbing-stairs/)

---

## Pattern: Dynamic Programming - 1D

This problem demonstrates the **DP - 1D Array** pattern (Fibonacci-style). The key is using the optimal substructure of the problem.

### Core Concept

The fundamental idea is building from base cases:
- `dp[i]` = minimum cost to reach step i
- `dp[i] = cost[i] + min(dp[i-1], dp[i-2])`
- Start from either step 0 or 1

---

## Examples

### Example

**Input:**
```
cost = [10, 15, 20]
```

**Output:**
```
15
```

**Explanation:** Start from index 1 (cost 15), then jump to the top (total cost = 15).

### Example 2

**Input:**
```
cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
```

**Output:**
```
6
```

**Explanation:** Path: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> top = 6

---

## Constraints

- `2 <= cost.length <= 1000`
- `0 <= cost[i] <= 999`

---

## Intuition

The key insight is that each step's minimum cost depends only on the previous two steps. This is the classic Fibonacci pattern.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DP Array** - O(n) time, O(n) space
2. **Space Optimized** - O(n) time, O(1) space

---

## Approach 1: DP Array

### Algorithm Steps

1. Create dp array of size n+1
2. Base cases: dp[0] = cost[0], dp[1] = cost[1]
3. Fill dp[i] = cost[i] + min(dp[i-1], dp[i-2])
4. Return min(dp[n-1], dp[n-2])

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        
        # dp[i] = minimum cost to reach step i
        dp = [0] * n
        
        # Base cases
        dp[0] = cost[0]
        dp[1] = cost[1]
        
        # Fill dp table
        for i in range(2, n):
            dp[i] = cost[i] + min(dp[i - 1], dp[i - 2])
        
        # Return minimum to reach past the last step
        return min(dp[n - 1], dp[n - 2])
```

<!-- slide -->
```cpp
class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int n = cost.size();
        vector<int> dp(n);
        
        dp[0] = cost[0];
        dp[1] = cost[1];
        
        for (int i = 2; i < n; i++) {
            dp[i] = cost[i] + min(dp[i - 1], dp[i - 2]);
        }
        
        return min(dp[n - 1], dp[n - 2]);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int n = cost.length;
        int[] dp = new int[n];
        
        dp[0] = cost[0];
        dp[1] = cost[1];
        
        for (int i = 2; i < n; i++) {
            dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
        }
        
        return Math.min(dp[n - 1], dp[n - 2]);
    }
}
```

<!-- slide -->
```javascript
var minCostClimbingStairs = function(cost) {
    const n = cost.length;
    const dp = new Array(n);
    
    dp[0] = cost[0];
    dp[1] = cost[1];
    
    for (let i = 2; i < n; i++) {
        dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
    }
    
    return Math.min(dp[n - 1], dp[n - 2]);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Approach 2: Space Optimized

### Code Implementation

````carousel
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        
        # Only need to track previous two values
        prev2 = cost[0]
        prev1 = cost[1]
        
        for i in range(2, n):
            curr = cost[i] + min(prev1, prev2)
            prev2 = prev1
            prev1 = curr
        
        return min(prev1, prev2)
```

<!-- slide -->
```cpp
class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int n = cost.size();
        int prev2 = cost[0];
        int prev1 = cost[1];
        
        for (int i = 2; i < n; i++) {
            int curr = cost[i] + min(prev1, prev2);
            prev2 = prev1;
            prev1 = curr;
        }
        
        return min(prev1, prev2);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int n = cost.length;
        int prev2 = cost[0];
        int prev1 = cost[1];
        
        for (int i = 2; i < n; i++) {
            int curr = cost[i] + Math.min(prev1, prev2);
            prev2 = prev1;
            prev1 = curr;
        }
        
        return Math.min(prev1, prev2);
    }
}
```

<!-- slide -->
```javascript
var minCostClimbingStairs = function(cost) {
    const n = cost.length;
    let prev2 = cost[0];
    let prev1 = cost[1];
    
    for (let i = 2; i < n; i++) {
        const curr = cost[i] + Math.min(prev1, prev2);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return Math.min(prev1, prev2);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | DP Array | Space Optimized |
|--------|----------|-----------------|
| **Time** | O(n) | O(n) |
| **Space** | O(n) | O(1) |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Without costs |
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | Similar DP |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dynamic Programming

- [NeetCode - Min Cost Climbing Stairs](https://www.youtube.com/watch?v=5xM48W6yG-sE) - Clear explanation with visual examples
- [DP Pattern Explained](https://www.youtube.com/watch?v=7C_f7fD2p14) - Understanding dynamic programming
- [Space Optimization](https://www.youtube.com/watch?v=8jP8CCrj8cI) - How to optimize space

---

## Follow-up Questions

### Q1: Can we solve this with recursion?

**Answer:** Yes, but it would have O(2^n) time complexity due to overlapping subproblems. Dynamic programming with memoization or bottom-up approach is essential.

---

### Q2: Why is the answer min(dp[n-1], dp[n-2]) and not dp[n]?

**Answer:** Because we can start from either stair 0 or stair 1 without paying their costs. We reach the "top" by taking either the last step from stair n-1 or from stair n-2.

---

### Q3: What if we had to pay cost to start?

**Answer:** If we had to pay cost to start, we would initialize dp[0] = cost[0] and dp[1] = cost[1] + min(dp[0], 0), but the current problem allows starting without paying.

---

### Q4: How does space optimization work?

**Answer:** We only need the previous two values at any point, so we can replace the dp array with two variables, reducing space from O(n) to O(1).

---

## Common Pitfalls

### 1. Base Case
**Issue**: Not handling the last step correctly.

**Solution**: Return min(dp[n-1], dp[n-2]) since we can reach top from either of the last two steps.

### 2. Cost Array vs DP Array
**Issue**: Confusing cost and dp arrays.

**Solution**: dp[i] includes cost[i] plus minimum of previous two. We pay to step on a stair.

### 3. Off-by-One
**Issue**: Wrong index for reaching top.

**Solution**: Top is index n (past last element). We don't pay cost for reaching top.

### 4. Negative Costs
**Issue**: Not handling negative costs.

**Solution:** Problem states costs are non-negative, so no issue.
---

## Summary

The **Min Cost Climbing Stairs** problem demonstrates the **Dynamic Programming** pattern with optimal substructure. Key takeaways:

1. **DP Relationship**: `dp[i] = cost[i] + min(dp[i-1], dp[i-2])` - each step's cost depends on previous two steps

2. **Starting Position**: You can start from either step 0 or 1 without paying their costs

3. **Space Optimization**: Since `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`, we can reduce space from O(n) to O(1)

4. **Return Value**: Return `min(dp[n-1], dp[n-2])` since we can reach top from either of the last two steps

This problem is a variation of the classic Climbing Stairs problem with the added complexity of costs. The optimal substructure allows for efficient dynamic programming solutions.

### Pattern Summary

This problem exemplifies the **1D Dynamic Programming** pattern, characterized by:
- Linear state progression
- Optimal substructure
- Constant-time state transitions
- Space optimization possibilities

For more details on dynamic programming patterns, see the **[Dynamic Programming](/algorithms/dynamic-programming)** section.
