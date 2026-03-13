# House Robber

## Problem Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

**Link to problem:** [House Robber - LeetCode 198](https://leetcode.com/problems/house-robber/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `nums = [1,2,3,1]` | `4` |

**Explanation:** Rob house 1 (money = 1) and house 3 (money = 3). Total = `1 + 3 = 4`.

### Example 2

| Input | Output |
|-------|--------|
| `nums = [2,7,9,3,1]` | `12` |

**Explanation:** Rob house 1 (money = 2), house 3 (money = 9), and house 5 (money = 1). Total = `2 + 9 + 1 = 12`.

---

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 400`

---

## Pattern: Dynamic Programming - 1D Array

This problem follows the **Dynamic Programming - Linear/1D** pattern, similar to Fibonacci.

---

## Intuition

The key insight for this problem is understanding the optimal substructure:

> At each house, you have two choices: either rob it (add its value to the max from 2 houses ago) or skip it (keep the max from the previous house).

### Key Observations

1. **Optimal Substructure**: The maximum rob amount up to house i depends on:
   - Maximum rob amount up to house i-1 (skip current)
   - Maximum rob amount up to house i-2 plus current house value (rob current)

2. **State Transition**: 
   - `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

3. **Space Optimization**: We only need the previous two values, not the entire array.

4. **Base Cases**:
   - dp[0] = nums[0] (only one house, rob it)
   - dp[1] = max(nums[0], nums[1]) (two houses, rob the richer one)

### Algorithm Overview

1. Initialize two variables: prev2 (2 houses ago) and prev1 (1 house ago)
2. Iterate through each house
3. Calculate current max: max(prev1, prev2 + num)
4. Update prev2 = prev1, prev1 = current
5. Return prev1

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Space-Optimized DP** - Optimal solution (O(n) time, O(1) space)
2. **Standard DP** - Using array (O(n) time, O(n) space)
3. **Recursive with Memoization** - Top-down approach (O(n) time, O(n) space)

---

## Approach 1: Space-Optimized DP (Optimal) ⭐

### Algorithm Steps

1. Initialize `prev2 = 0` and `prev1 = 0`
2. For each house value `num`:
   - Calculate `current = max(prev1, prev2 + num)`
   - Update `prev2 = prev1` and `prev1 = current`
3. Return `prev1`

### Why It Works

This works because we only need to track the maximum amount we can rob up to the previous two houses. The recurrence relation guarantees optimal solution.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        Calculate maximum money robbed without alerting police.
        
        Uses space-optimized dynamic programming.
        
        Args:
            nums: List of money in each house
            
        Returns:
            Maximum amount that can be robbed
        """
        prev2, prev1 = 0, 0
        
        for num in nums:
            # Current max: either skip current or rob current
            current = max(prev1, prev2 + num)
            prev2 = prev1
            prev1 = current
        
        return prev1
```

<!-- slide -->
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        
        for (int num : nums) {
            int current = max(prev1, prev2 + num);
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
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        
        for (int num : nums) {
            int current = Math.max(prev1, prev2 + num);
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
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    let prev2 = 0, prev1 = 0;
    
    for (const num of nums) {
        const current = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through the array |
| **Space** | O(1) - only two variables used |

---

## Approach 2: Standard DP with Array

### Algorithm Steps

1. Create dp array of size n
2. Set dp[0] = nums[0]
3. If n > 1, set dp[1] = max(nums[0], nums[1])
4. For i from 2 to n-1:
   - dp[i] = max(dp[i-1], dp[i-2] + nums[i])
5. Return dp[n-1]

### Why It Works

The standard DP approach builds the solution bottom-up, storing all intermediate results in an array.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        Using standard DP with array.
        """
        n = len(nums)
        if n == 0:
            return 0
        if n == 1:
            return nums[0]
        
        dp = [0] * n
        dp[0] = nums[0]
        dp[1] = max(nums[0], nums[1])
        
        for i in range(2, n):
            dp[i] = max(dp[i-1], dp[i-2] + nums[i])
        
        return dp[n-1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        
        vector<int> dp(n);
        dp[0] = nums[0];
        dp[1] = max(nums[0], nums[1]);
        
        for (int i = 2; i < n; i++) {
            dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
        }
        
        return dp[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        
        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        
        for (int i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
        }
        
        return dp[n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length;
    if (n === 0) return 0;
    if (n === 1) return nums[0];
    
    const dp = new Array(n);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    
    return dp[n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through the array |
| **Space** | O(n) - dp array |

---

## Approach 3: Recursive with Memoization

### Algorithm Steps

1. Create a memoization array
2. Define recursive function rob(i):
   - If i < 0, return 0
   - If i == 0, return nums[0]
   - If memo[i] is computed, return it
   - Otherwise: memo[i] = max(rob(i-1), rob(i-2) + nums[i])
3. Call rob(n-1) and return result

### Why It Works

Top-down DP with memoization ensures each subproblem is solved only once.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        Using recursion with memoization.
        """
        n = len(nums)
        if n == 0:
            return 0
        
        memo = [-1] * n
        
        def rob_helper(i: int) -> int:
            if i < 0:
                return 0
            if i == 0:
                return nums[0]
            if memo[i] != -1:
                return memo[i]
            
            memo[i] = max(rob_helper(i-1), rob_helper(i-2) + nums[i])
            return memo[i]
        
        return rob_helper(n-1)
```

<!-- slide -->
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        vector<int> memo(n, -1);
        
        function<int(int)> rob_helper = [&](int i) -> int {
            if (i < 0) return 0;
            if (i == 0) return nums[0];
            if (memo[i] != -1) return memo[i];
            
            memo[i] = max(rob_helper(i-1), rob_helper(i-2) + nums[i]);
            return memo[i];
        };
        
        return rob_helper(n-1);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        int[] memo = new int[n];
        Arrays.fill(memo, -1);
        
        return robHelper(nums, n - 1, memo);
    }
    
    private int robHelper(int[] nums, int i, int[] memo) {
        if (i < 0) return 0;
        if (i == 0) return nums[0];
        if (memo[i] != -1) return memo[i];
        
        memo[i] = Math.max(robHelper(nums, i - 1, memo), 
                          robHelper(nums, i - 2, memo) + nums[i]);
        return memo[i];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length;
    const memo = new Array(n).fill(-1);
    
    const robHelper = (i) => {
        if (i < 0) return 0;
        if (i === 0) return nums[0];
        if (memo[i] !== -1) return memo[i];
        
        memo[i] = Math.max(robHelper(i - 1), robHelper(i - 2) + nums[i]);
        return memo[i];
    };
    
    return robHelper(n - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each subproblem solved once |
| **Space** | O(n) - memo array + recursion stack |

---

## Comparison of Approaches

| Aspect | Space-Optimized | Standard DP | Recursive Memo |
|--------|----------------|-------------|----------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(n) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |
| **Difficulty** | Easy | Easy | Easy |

**Best Approach:** Use Approach 1 (Space-Optimized DP) for the optimal O(1) space solution.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Amazon, LinkedIn, Google, Microsoft
- **Difficulty**: Easy
- **Concepts Tested**: Dynamic Programming, optimization, state transitions

### Learning Outcomes

1. **DP Fundamentals**: Master the DP approach for linear problems
2. **Space Optimization**: Learn to reduce space from O(n) to O(1)
3. **State Transitions**: Understand how to define and optimize recurrences

---

## Related Problems

Based on similar themes (dynamic programming, house robber variations):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| House Robber II | [Link](https://leetcode.com/problems/house-robber-ii/) | Circular street |
| House Robber III | [Link](https://leetcode.com/problems/house-robber-iii/) | Binary tree |
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Similar DP |
| Delete and Earn | [Link](https://leetcode.com/problems/delete-and-earn/) | Similar transformation |

### Pattern Reference

For more detailed explanations of the DP pattern, see:
- **[DP 1D Array Pattern](/patterns/dp-1d-array-fibonacci)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - House Robber](https://www.youtube.com/watch?v=73r3KWiEvyk)** - Clear explanation with visual examples
2. **[House Robber - LeetCode 198](https://www.youtube.com/watch?v=GrMBfJNk_NY)** - Detailed walkthrough
3. **[Dynamic Programming Explained](https://www.youtube.com/watch?v=OQ5jsbhAv_M)** - Understanding DP

### Related Concepts

- **[Fibonacci Sequence](https://www.youtube.com/watch?v=0E4kQ3HJ6yM)** - Related mathematical pattern
- **[Space Optimization in DP](https://www.youtube.com/watch?v=8yL6K1poyEA)** - Reducing space complexity

---

## Follow-up Questions

### Q1: How would you modify the solution for a circular street (first and last houses adjacent)?

**Answer:** For House Robber II, handle the last house separately. You can either skip the first or last house, so take max of rob(nums[0:n-1]) and rob(nums[1:n]).

---

### Q2: What if houses were in a binary tree structure (House Robber III)?

**Answer:** Use tree DP. For each node, calculate two states: max when robbing this node (plus children of children) and max when not robbing (plus max of children).

---

### Q3: How would you reconstruct which houses were robbed?

**Answer:** Instead of just storing max value, store the decisions. Or run the DP forward and backtrack using the recurrence relation.

---

### Q4: What if each house had a weight (cost to rob) and you had a max weight capacity?

**Answer:** This becomes the classic 0/1 Knapsack problem. Use 2D DP: dp[i][w] = max value with first i items and weight limit w.

---

### Q5: How does this relate to the Fibonacci sequence?

**Answer:** The recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]) is exactly the Fibonacci recurrence with an optional nums[i]. When nums[i] = 1, it becomes classic Fibonacci.

---

## Common Pitfalls

### 1. Not Handling Empty House
**Issue:** Accessing nums[0] when array is empty causes error.

**Solution:** Add check for empty array at start.

### 2. Wrong Initialization
**Issue:** Using wrong base cases for dp[0] and dp[1].

**Solution:** dp[0] = nums[0], dp[1] = max(nums[0], nums[1]).

### 3. Overflow for Large Sums
**Issue:** Sum can exceed 32-bit integer for large inputs.

**Solution:** Use long data type or mod if needed.

### 4. Wrong Variable Order
**Issue:** Updating variables in wrong order causing data loss.

**Solution:** Always update prev2 before prev1, or use a temporary variable.

### 5. Index Out of Bounds
**Issue:** Not handling n == 1 case in standard DP.

**Solution:** Add special handling for edge cases.

---

## Summary

The **House Robber** problem demonstrates **Dynamic Programming** with space optimization. The key insight is the recurrence relation: at each house, you either skip it or rob it, leading to the optimal substructure.

### Key Takeaways

1. **DP Recurrence**: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
2. **Space Optimization**: Only need previous two values
3. **Base Cases**: Handle n == 0, n == 1 explicitly
4. **Time Complexity**: O(n) - single pass

### Pattern Summary

This problem exemplifies the **DP 1D Array** pattern, characterized by:
- Linear state transitions
- Dependencies on previous states
- Space optimization opportunities

For more details on this pattern, see the **[DP 1D Array Pattern](/patterns/dp-1d-array-fibonacci)**.

---

## Additional Resources

- [LeetCode Problem 198](https://leetcode.com/problems/house-robber/) - Official problem page
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - Detailed DP explanation
- [Fibonacci Number - Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number) - Mathematical background
- [Pattern: DP 1D Array](/patterns/dp-1d-array-fibonacci) - Comprehensive pattern guide
