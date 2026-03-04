# Climbing Stairs

## Category
Dynamic Programming

## Description

The **Climbing Stairs** problem is a classic dynamic programming problem that asks: "In how many distinct ways can you climb to the top of a staircase with n steps, if each time you can climb either 1 or 2 steps?" This problem serves as an excellent introduction to dynamic programming and demonstrates the Fibonacci pattern that appears in many optimization problems.

---

## When to Use

Use this algorithm when you need to solve problems involving:

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

---

## Algorithm Steps

### Space-Optimized Approach (Recommended)

1. **Handle base cases**: If n ≤ 2, return n directly
2. **Initialize two variables**: `prev2 = 1` (ways to reach step 1), `prev1 = 2` (ways to reach step 2)
3. **Iterate from 3 to n**:
   - Calculate current = prev1 + prev2
   - Update prev2 = prev1
   - Update prev1 = current
4. **Return prev1** as the result

### DP Array Approach (Useful for Variations)

1. **Create dp array** of size n+1
2. **Set base cases**: dp[1] = 1, dp[2] = 2
3. **Fill array iteratively**: For i from 3 to n, dp[i] = dp[i-1] + dp[i-2]
4. **Return dp[n]**

### Memoization Approach

1. **Define recursive function** f(n):
   - If n ≤ 2, return n
   - If already computed, return cached value
   - Compute f(n-1) + f(n-2), cache and return
2. **Call f(n)** and return result

---

## Implementation

### Space-Optimized Solution (Recommended)

````carousel
```python
def climb_stairs(n: int) -> int:
    """
    Count distinct ways to climb n stairs (1 or 2 steps at a time).
    Space-optimized dynamic programming solution.
    
    Args:
        n: Number of stairs to climb
        
    Returns:
        Number of distinct ways to reach the top
        
    Time: O(n)
    Space: O(1)
    """
    if n <= 2:
        return n
    
    # Only need to track previous two values
    prev2, prev1 = 1, 2
    
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


# With modulo (for large numbers)
def climb_stairs_mod(n: int, mod: int = 10**9 + 7) -> int:
    """
    Count ways with modulo to prevent overflow.
    Essential for competitive programming with large n.
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for _ in range(3, n + 1):
        current = (prev1 + prev2) % mod
        prev2 = prev1
        prev1 = current
    
    return prev1


# Example usage
if __name__ == "__main__":
    test_cases = [1, 2, 3, 4, 5, 10, 20]
    
    print("Climbing Stairs Results:")
    print("-" * 30)
    for n in test_cases:
        result = climb_stairs(n)
        print(f"n = {n:2d}: {result} ways")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Count distinct ways to climb n stairs (1 or 2 steps at a time).
 * Space-optimized dynamic programming solution.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int climbStairs(int n) {
    if (n <= 2) {
        return n;
    }
    
    // Only need to track previous two values
    long long prev2 = 1;  // Ways to reach step 1
    long long prev1 = 2;  // Ways to reach step 2
    
    for (int i = 3; i <= n; i++) {
        long long current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return static_cast<int>(prev1);
}

/**
 * Count ways with modulo to prevent overflow.
 */
int climbStairsMod(int n, int mod = 1000000007) {
    if (n <= 2) {
        return n;
    }
    
    long long prev2 = 1;
    long long prev1 = 2;
    
    for (int i = 3; i <= n; i++) {
        long long current = (prev1 + prev2) % mod;
        prev2 = prev1;
        prev1 = current;
    }
    
    return static_cast<int>(prev1);
}

/**
 * DP array approach - useful when you need all intermediate values.
 */
int climbStairsDP(int n) {
    if (n <= 2) {
        return n;
    }
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

int main() {
    vector<int> testCases = {1, 2, 3, 4, 5, 10, 20};
    
    cout << "Climbing Stairs Results:" << endl;
    cout << "------------------------------" << endl;
    
    for (int n : testCases) {
        int result = climbStairs(n);
        cout << "n = " << n << ": " << result << " ways" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Count distinct ways to climb n stairs (1 or 2 steps at a time).
 * Space-optimized dynamic programming solution.
 * 
 * Time: O(n)
 * Space: O(1)
 */
public class ClimbingStairs {
    
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }
        
        // Only need to track previous two values
        int prev2 = 1;  // Ways to reach step 1
        int prev1 = 2;  // Ways to reach step 2
        
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    /**
     * Count ways with modulo to prevent overflow.
     */
    public int climbStairsMod(int n, int mod) {
        if (n <= 2) {
            return n;
        }
        
        long prev2 = 1;
        long prev1 = 2;
        
        for (int i = 3; i <= n; i++) {
            long current = (prev1 + prev2) % mod;
            prev2 = prev1;
            prev1 = current;
        }
        
        return (int) prev1;
    }
    
    /**
     * DP array approach - useful when you need all intermediate values.
     */
    public int climbStairsDP(int n) {
        if (n <= 2) {
            return n;
        }
        
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
    
    /**
     * Memoization approach using recursion.
     */
    public int climbStairsMemo(int n) {
        int[] memo = new int[n + 1];
        return helper(n, memo);
    }
    
    private int helper(int n, int[] memo) {
        if (n <= 2) {
            return n;
        }
        if (memo[n] != 0) {
            return memo[n];
        }
        memo[n] = helper(n - 1, memo) + helper(n - 2, memo);
        return memo[n];
    }
    
    public static void main(String[] args) {
        ClimbingStairs solution = new ClimbingStairs();
        int[] testCases = {1, 2, 3, 4, 5, 10, 20};
        
        System.out.println("Climbing Stairs Results:");
        System.out.println("------------------------------");
        
        for (int n : testCases) {
            int result = solution.climbStairs(n);
            System.out.printf("n = %2d: %d ways%n", n, result);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Count distinct ways to climb n stairs (1 or 2 steps at a time).
 * Space-optimized dynamic programming solution.
 * 
 * Time: O(n)
 * Space: O(1)
 */
function climbStairs(n) {
    if (n <= 2) {
        return n;
    }
    
    // Only need to track previous two values
    let prev2 = 1;  // Ways to reach step 1
    let prev1 = 2;  // Ways to reach step 2
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

/**
 * Count ways with modulo to prevent overflow.
 */
function climbStairsMod(n, mod = 1000000007) {
    if (n <= 2) {
        return n;
    }
    
    let prev2 = 1;
    let prev1 = 2;
    
    for (let i = 3; i <= n; i++) {
        const current = (prev1 + prev2) % mod;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

/**
 * DP array approach - useful when you need all intermediate values.
 */
function climbStairsDP(n) {
    if (n <= 2) {
        return n;
    }
    
    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

/**
 * Memoization approach using recursion.
 */
function climbStairsMemo(n, memo = {}) {
    if (n <= 2) {
        return n;
    }
    if (memo[n] !== undefined) {
        return memo[n];
    }
    memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
    return memo[n];
}

// Example usage
const testCases = [1, 2, 3, 4, 5, 10, 20];

console.log("Climbing Stairs Results:");
console.log("-".repeat(30));

testCases.forEach(n => {
    const result = climbStairs(n);
    console.log(`n = ${n.toString().padStart(2)}: ${result} ways`);
});
```
````

---

## Time Complexity Analysis

| Approach | Time Complexity | Description |
|----------|----------------|-------------|
| **Naive Recursion** | O(2ⁿ) | Exponential - recalculates same subproblems |
| **Memoization** | O(n) | Each subproblem computed once |
| **Tabulation (DP)** | O(n) | Single pass through array |
| **Space-Optimized** | O(n) | Same iterations, less space |
| **Matrix Exponentiation** | O(log n) | Uses fast power algorithm |

### Detailed Breakdown

- **Single loop iteration**: We perform exactly n-2 iterations (for n > 2)
- **Constant time operations**: Each iteration does O(1) work (addition, assignment)
- **Total**: O(n) time complexity
- **Space-optimized version**: O(1) extra space (just two variables)
- **DP array version**: O(n) space for the array

---

## Space Complexity Analysis

| Approach | Space Complexity | Description |
|----------|------------------|-------------|
| **Naive Recursion** | O(n) | Recursion stack depth |
| **Memoization** | O(n) | Cache array + recursion stack |
| **Tabulation (DP)** | O(n) | DP array storage |
| **Space-Optimized** | O(1) | Only two variables needed |
| **Matrix Exponentiation** | O(1) | Constant extra space |

### Space Optimization Insight

Since `ways(n)` only depends on `ways(n-1)` and `ways(n-2)`, we don't need to store the entire array. Two variables are sufficient, reducing space from O(n) to O(1).

---

## Common Variations

### 1. Generalized Steps (1, 2, or 3 steps)

When you can take 1, 2, or 3 steps at a time:

````carousel
```python
def climb_stairs_three_steps(n: int) -> int:
    """
    Count ways when you can take 1, 2, or 3 steps.
    Recurrence: ways(n) = ways(n-1) + ways(n-2) + ways(n-3)
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
        prev3 = prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

<!-- slide -->
```cpp
int climbStairsThreeSteps(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    if (n == 2) return 2;
    if (n == 3) return 4;
    
    long long prev3 = 1, prev2 = 2, prev1 = 4;
    
    for (int i = 4; i <= n; i++) {
        long long current = prev1 + prev2 + prev3;
        prev3 = prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return static_cast<int>(prev1);
}
```

<!-- slide -->
```java
public int climbStairsThreeSteps(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    if (n == 2) return 2;
    if (n == 3) return 4;
    
    int prev3 = 1, prev2 = 2, prev1 = 4;
    
    for (int i = 4; i <= n; i++) {
        int current = prev1 + prev2 + prev3;
        prev3 = prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

<!-- slide -->
```javascript
function climbStairsThreeSteps(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (n === 3) return 4;
    
    let prev3 = 1, prev2 = 2, prev1 = 4;
    
    for (let i = 4; i <= n; i++) {
        const current = prev1 + prev2 + prev3;
        prev3 = prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```
````

### 2. Variable Step Costs

When each step has a different cost, find minimum cost to reach the top:

````carousel
```python
def min_cost_climbing_stairs(cost: list[int]) -> int:
    """
    Find minimum cost to reach the top where cost[i] is the cost of step i.
    You can start from step 0 or 1, and pay cost to step on it.
    """
    n = len(cost)
    if n <= 1:
        return 0
    
    # dp[i] = min cost to reach step i
    prev2 = cost[0]  # Cost to be on step 0
    prev1 = cost[1]  # Cost to be on step 1
    
    for i in range(2, n):
        current = cost[i] + min(prev1, prev2)
        prev2 = prev1
        prev1 = current
    
    # Can finish from either of the last two steps without paying
    return min(prev1, prev2)
```

<!-- slide -->
```cpp
int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    if (n <= 1) return 0;
    
    int prev2 = cost[0];
    int prev1 = cost[1];
    
    for (int i = 2; i < n; i++) {
        int current = cost[i] + min(prev1, prev2);
        prev2 = prev1;
        prev1 = current;
    }
    
    return min(prev1, prev2);
}
```

<!-- slide -->
```java
public int minCostClimbingStairs(int[] cost) {
    int n = cost.length;
    if (n <= 1) return 0;
    
    int prev2 = cost[0];
    int prev1 = cost[1];
    
    for (int i = 2; i < n; i++) {
        int current = cost[i] + Math.min(prev1, prev2);
        prev2 = prev1;
        prev1 = current;
    }
    
    return Math.min(prev1, prev2);
}
```

<!-- slide -->
```javascript
function minCostClimbingStairs(cost) {
    const n = cost.length;
    if (n <= 1) return 0;
    
    let prev2 = cost[0];
    let prev1 = cost[1];
    
    for (let i = 2; i < n; i++) {
        const current = cost[i] + Math.min(prev1, prev2);
        prev2 = prev1;
        prev1 = current;
    }
    
    return Math.min(prev1, prev2);
}
```
````

### 3. Count Ways with Forbidden Steps

When certain steps are broken/unsafe:

````carousel
```python
def climb_stairs_with_forbidden(n: int, broken: set[int]) -> int:
    """
    Count ways when some steps are broken (cannot step on them).
    """
    if n in broken or n <= 0:
        return 0
    if n == 1:
        return 0 if 1 in broken else 1
    
    # Use DP array since we need to check forbidden steps
    dp = [0] * (n + 1)
    dp[0] = 1  # One way to be at ground level
    
    for i in range(1, n + 1):
        if i in broken:
            dp[i] = 0
        else:
            dp[i] = dp[i - 1]
            if i >= 2:
                dp[i] += dp[i - 2]
    
    return dp[n]
```

<!-- slide -->
```cpp
int climbStairsWithForbidden(int n, vector<bool>& broken) {
    if (n <= 0 || broken[n]) return 0;
    
    vector<long long> dp(n + 1, 0);
    dp[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        if (broken[i]) {
            dp[i] = 0;
        } else {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
        }
    }
    
    return static_cast<int>(dp[n]);
}
```

<!-- slide -->
```java
public int climbStairsWithForbidden(int n, boolean[] broken) {
    if (n <= 0 || broken[n]) return 0;
    
    long[] dp = new long[n + 1];
    dp[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        if (broken[i]) {
            dp[i] = 0;
        } else {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
        }
    }
    
    return (int) dp[n];
}
```

<!-- slide -->
```javascript
function climbStairsWithForbidden(n, broken) {
    if (n <= 0 || broken.has(n)) return 0;
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    
    for (let i = 1; i <= n; i++) {
        if (broken.has(i)) {
            dp[i] = 0;
        } else {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
        }
    }
    
    return dp[n];
}
```
````

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

### Problem 3: Tribonacci Sequence

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
    # Use fast doubling method
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

---

## Related Algorithms

- [House Robber](./house-robber.md) - Maximum sum with constraints
- [Coin Change](./coin-change.md) - Minimum coins for amount
- [Unique Paths](./unique-paths.md) - 2D grid path counting
- [Fibonacci Number](./fibonacci-number.md) - The underlying sequence
- [Decode Ways](./decode-ways.md) - String decoding with DP
