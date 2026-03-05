# DP - 1D Array Fibonacci

## Problem Description

The **DP - 1D Array (Fibonacci Style)** pattern is used to solve problems where each state depends only on previous states in a linear manner, similar to how Fibonacci numbers depend on their two preceding values. This pattern is efficient for problems with overlapping subproblems and optimal substructure.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Single integer n or array representing state |
| **Output** | Optimal value for state n |
| **Key Insight** | Each state depends on 1 or more previous states |
| **Time Complexity** | O(n) for single pass, O(n × k) for k dependencies |
| **Space Complexity** | O(1) with space optimization, O(n) without |

### When to Use

- **Linear state transitions**: Problems where f(n) depends on f(n-1), f(n-2), etc.
- **Counting problems**: Number of ways to reach n (climbing stairs, decode ways)
- **Optimization problems**: Max/min value at each step (house robber, max subarray)
- **Sequence generation**: Computing values in a sequence iteratively
- **Problems with limited lookback**: State only depends on recent previous states

---

## Intuition

### Core Insight

The key insight behind Fibonacci-style DP is that **we can build the solution iteratively from the base cases**:

1. **Fibonacci relation**: F(n) = F(n-1) + F(n-2)
2. **Base cases**: F(0) = 0, F(1) = 1 (or problem-specific)
3. **Iterative computation**: Start from base cases, build up to n
4. **Space optimization**: Only need to keep track of the last k values, not the entire array

### The "Aha!" Moments

1. **Why not use recursion?** Recursion leads to exponential time due to repeated calculations (f(5) calls f(3) twice). DP stores results to avoid recomputation.

2. **Why is O(1) space possible?** When computing F(n), we only need F(n-1) and F(n-2). We don't need to store F(0) through F(n-3), so just use variables instead of an array.

3. **How to identify these problems?** Look for "number of ways to...", "maximum value at step n...", or any problem where the current state depends on a fixed number of previous states.

### State Transition Visualization

Computing Fibonacci numbers:
```
F(0) = 0  (base)
F(1) = 1  (base)
F(2) = F(1) + F(0) = 1 + 0 = 1
F(3) = F(2) + F(1) = 1 + 1 = 2
F(4) = F(3) + F(2) = 2 + 1 = 3
F(5) = F(4) + F(3) = 3 + 2 = 5
```

---

## Solution Approaches

### Approach 1: Fibonacci with Space Optimization ⭐

The standard approach using O(1) space by tracking only the last two values.

#### Algorithm

1. **Handle base cases**: Return directly for n = 0 or n = 1
2. **Initialize variables**: `prev2 = F(0)`, `prev1 = F(1)`
3. **Iterate from 2 to n**:
   - `current = prev1 + prev2`
   - `prev2 = prev1`
   - `prev1 = current`
4. **Return prev1** (which holds F(n))

#### Implementation

````carousel
```python
def fibonacci(n: int) -> int:
    """
    Calculate nth Fibonacci number with O(1) space.
    
    Args:
        n: Index in Fibonacci sequence
        
    Returns:
        The nth Fibonacci number
    """
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    prev2 = 0  # F(i-2)
    prev1 = 1  # F(i-1)
    
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


def climbing_stairs(n: int) -> int:
    """
    Number of distinct ways to climb n stairs (1 or 2 steps at a time).
    This is essentially Fibonacci shifted by 1.
    """
    if n <= 2:
        return n
    
    prev2 = 1  # 1 way to climb 1 stair
    prev1 = 2  # 2 ways to climb 2 stairs
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


def house_robber(nums: list) -> int:
    """
    Maximum amount of money that can be robbed without alerting police.
    Cannot rob adjacent houses.
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = 0  # Max money up to house i-2
    prev1 = nums[0]  # Max money up to house i-1
    
    for i in range(1, len(nums)):
        # Either rob current house + prev2, or skip and keep prev1
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
    
    int climbStairs(int n) {
        if (n <= 2) return n;
        
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
    
    int rob(vector<int>& nums) {
        if (nums.empty()) return 0;
        if (nums.size() == 1) return nums[0];
        
        int prev2 = 0, prev1 = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            int current = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
    
    public int climbStairs(int n) {
        if (n <= 2) return n;
        
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
    
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];
        
        int prev2 = 0, prev1 = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            int current = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
};

/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if (n <= 2) return n;
    
    let prev2 = 1, prev1 = 2;
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
};

/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = 0, prev1 = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass from 2 to n |
| **Space** | O(1) - only storing two previous values |

---

### Approach 2: Full Array DP (When Path Reconstruction Needed)

When you need to reconstruct the solution path, use a full array.

#### Algorithm

1. **Initialize DP array** of size n+1
2. **Set base cases** in dp[0], dp[1]
3. **Fill array iteratively**: dp[i] depends on dp[i-1], dp[i-2], etc.
4. **Return dp[n]**
5. **Backtrack if needed** to reconstruct the path

#### Implementation

````carousel
```python
def fibonacci_array(n: int) -> int:
    """
    Full array approach - useful when you need all values or path reconstruction.
    """
    if n == 0:
        return 0
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]


def climbing_stairs_with_path(n: int):
    """
    Returns both count and one possible path.
    """
    if n <= 2:
        return n, [1] * n if n > 0 else []
    
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    # Backtrack to find a path
    path = []
    remaining = n
    while remaining > 0:
        if remaining >= 2 and dp[remaining - 2] > 0:
            path.append(2)
            remaining -= 2
        else:
            path.append(1)
            remaining -= 1
    
    return dp[n], path


def house_robber_with_houses(nums: list):
    """
    Returns max money and which houses to rob.
    """
    if not nums:
        return 0, []
    
    n = len(nums)
    dp = [0] * (n + 1)
    dp[1] = nums[0]
    
    for i in range(2, n + 1):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])
    
    # Backtrack to find which houses
    houses = []
    i = n
    while i >= 1:
        if dp[i] == dp[i - 1]:
            i -= 1  # Didn't rob house i
        else:
            houses.append(i - 1)  # Robbed house i-1 (0-indexed)
            i -= 2
    
    return dp[n], houses[::-1]
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class SolutionArray {
public:
    int fib(int n) {
        if (n == 0) return 0;
        
        vector<int> dp(n + 1, 0);
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
    
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        
        vector<int> dp(n + 1, 0);
        dp[1] = nums[0];
        
        for (int i = 2; i <= n; i++) {
            dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1]);
        }
        
        return dp[n];
    }
    
    vector<int> getRobbedHouses(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return {};
        
        vector<int> dp(n + 1, 0);
        dp[1] = nums[0];
        
        for (int i = 2; i <= n; i++) {
            dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1]);
        }
        
        // Backtrack
        vector<int> houses;
        int i = n;
        while (i >= 1) {
            if (i >= 2 && dp[i] == dp[i - 2] + nums[i - 1]) {
                houses.push_back(i - 1);
                i -= 2;
            } else {
                i -= 1;
            }
        }
        reverse(houses.begin(), houses.end());
        return houses;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class SolutionArray {
    public int fib(int n) {
        if (n == 0) return 0;
        
        int[] dp = new int[n + 1];
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
    
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        
        int[] dp = new int[n + 1];
        dp[1] = nums[0];
        
        for (int i = 2; i <= n; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
        }
        return dp[n];
    }
    
    public List<Integer> getRobbedHouses(int[] nums) {
        int n = nums.length;
        List<Integer> houses = new ArrayList<>();
        if (n == 0) return houses;
        
        int[] dp = new int[n + 1];
        dp[1] = nums[0];
        
        for (int i = 2; i <= n; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
        }
        
        // Backtrack
        int i = n;
        while (i >= 1) {
            if (i >= 2 && dp[i] == dp[i - 2] + nums[i - 1]) {
                houses.add(i - 1);
                i -= 2;
            } else {
                i--;
            }
        }
        Collections.reverse(houses);
        return houses;
    }
}
```

<!-- slide -->
```javascript
var fibArray = function(n) {
    if (n === 0) return 0;
    
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
};

var robArray = function(nums) {
    const n = nums.length;
    if (n === 0) return 0;
    
    const dp = new Array(n + 1).fill(0);
    dp[1] = nums[0];
    
    for (let i = 2; i <= n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
    }
    return dp[n];
};

var getRobbedHouses = function(nums) {
    const n = nums.length;
    if (n === 0) return [];
    
    const dp = new Array(n + 1).fill(0);
    dp[1] = nums[0];
    
    for (let i = 2; i <= n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
    }
    
    // Backtrack
    const houses = [];
    let i = n;
    while (i >= 1) {
        if (i >= 2 && dp[i] === dp[i - 2] + nums[i - 1]) {
            houses.push(i - 1);
            i -= 2;
        } else {
            i--;
        }
    }
    return houses.reverse();
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Space Optimized** | O(n) | O(1) | **General use** - when only final value needed |
| **Full Array** | O(n) | O(n) | Path reconstruction, debugging, multiple queries |

**Where:**
- `n` = input size (number of steps/houses/etc.)

**Time Breakdown:**
- Single pass through all states: O(n)
- Each state computation: O(1)
- Total: O(n)

**Space Breakdown:**
- Space optimized: O(1) for two variables
- Full array: O(n) for DP array

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Fibonacci Number** | [Link](https://leetcode.com/problems/fibonacci-number/) | Classic Fibonacci |
| **Climbing Stairs** | [Link](https://leetcode.com/problems/climbing-stairs/) | Count ways to climb n stairs |
| **Min Cost Climbing Stairs** | [Link](https://leetcode.com/problems/min-cost-climbing-stairs/) | Minimum cost to reach top |
| **N-th Tribonacci Number** | [Link](https://leetcode.com/problems/n-th-tribonacci-number/) | F(n) = F(n-1) + F(n-2) + F(n-3) |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **House Robber** | [Link](https://leetcode.com/problems/house-robber/) | Max money without adjacent houses |
| **Delete and Earn** | [Link](https://leetcode.com/problems/delete-and-earn/) | Similar to House Robber |
| **Paint House** | [Link](https://leetcode.com/problems/paint-house/) | Min cost to paint houses |
| **Domino and Tromino Tiling** | [Link](https://leetcode.com/problems/domino-and-tromino-tiling/) | Count ways to tile board |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **House Robber II** | [Link](https://leetcode.com/problems/house-robber-ii/) | Circular arrangement |
| **Flip String to Monotone Increasing** | [Link](https://leetcode.com/problems/flip-string-to-monotone-increasing/) | State transition DP |

---

## Video Tutorial Links

1. [NeetCode - Climbing Stairs](https://www.youtube.com/watch?v=Y0lT9Fck7qI) - Fibonacci-style DP explained
2. [House Robber - NeetCode](https://www.youtube.com/watch?v=73r3KWiEvyk) - State transition pattern
3. [Fibonacci Number - Explained](https://www.youtube.com/watch?v=OQ5jsbhAv_M) - Multiple approaches
4. [DP Patterns - YK](https://www.youtube.com/watch?v=UP3dKjW8LTE) - General DP patterns

---

## Summary

### Key Takeaways

1. **Fibonacci-style DP is linear** - Each state depends on a fixed number of previous states
2. **Space can be optimized** - Often O(1) space is sufficient (only need last k values)
3. **Start with base cases** - Define f(0), f(1) clearly before building iteratively
4. **Look for the pattern** - "Number of ways" or "max at step n" often indicates this pattern
5. **Backtracking requires full array** - Use O(n) space when path reconstruction is needed

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Not defining base cases correctly** | Always handle n = 0, n = 1 explicitly |
| **Using recursion without memoization** | Results in exponential time; use iterative DP or memoization |
| **Off-by-one errors** | Carefully check loop bounds (range(2, n+1)) |
| **Forgetting space optimization** | Use O(1) space when only final value is needed |
| **Wrong state transition** | Verify dp[i] formula matches the problem constraints |

### Follow-up Questions

**Q1: How do you handle problems where each state depends on more than 2 previous states?**

Extend the pattern! For Tribonacci (3 dependencies), track 3 variables: prev3, prev2, prev1. The pattern generalizes to any fixed number of dependencies.

**Q2: What if the state transition is not linear?**

If dp[i] depends on all previous states (dp[0] through dp[i-1]), it might be a different pattern. Check if you can optimize or if it's a different DP approach.

**Q3: How do you handle House Robber II (circular arrangement)?**

Break into two linear problems: max(rob houses 0 to n-2, rob houses 1 to n-1). This handles the circular constraint by excluding one end in each case.

**Q4: Can you use matrix exponentiation for Fibonacci?**

Yes! Using matrix exponentiation, you can compute F(n) in O(log n) time. The transformation matrix is [[1,1],[1,0]] and you compute it to the power n.

---

## Pattern Source

For more dynamic programming patterns, see:
- **[DP - 1D Array Knapsack](/patterns/dp-1d-array-0-1-knapsack-subset-sum)**
- **[DP - 1D Array Coin Change](/patterns/dp-1d-array-coin-change-unbounded-knapsack)**
- **[DP - 2D Array Edit Distance](/patterns/dp-2d-array-edit-distance-levenshtein-distance)**
- **[DP - Stock Problems](/patterns/dp-stock-problems)**

---

## Additional Resources

- [LeetCode Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)
- [LeetCode Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
- [GeeksforGeeks Fibonacci DP](https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/)
- [Dynamic Programming Patterns](https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns)
