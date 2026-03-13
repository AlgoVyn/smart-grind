# Target Sum

## Problem Description

You are given an integer array `nums` and an integer `target`.

You can place a `+` or `-` sign in front of each integer in the array to build an expression. You want to build an expression that has an effect equal to `target`.

Return the number of different expressions that you can build that evaluate to `target`.

**Link to problem:** [Target Sum - LeetCode 494](https://leetcode.com/problems/target-sum/)

## Constraints
- `1 <= nums.length <= 20`
- `0 <= nums[i] <= 1000`
- `0 <= target <= 1000`

---

## Pattern: DFS + Memoization / DP Subset Sum

This problem is a classic example of the **DFS + Memoization** or **DP Subset Sum** pattern. The key insight is to transform the problem into a subset sum problem.

### Core Concept

The fundamental idea is:
- **Expression Split**: Split array into two groups - positive and negative
- **Sum Equation**: sum(pos) - sum(neg) = target
- **Transformation**: sum(pos) = (target + sum(neg) + sum(pos)) / 2
- **Subset Sum**: Find subsets that sum to (target + sum(nums)) / 2

---

## Examples

### Example

**Input:**
```
nums = [1,1,1,1,1], target = 3
```

**Output:**
```
5
```

**Explanation:** There are 5 ways to assign symbols:
-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3

### Example 2

**Input:**
```
nums = [1], target = 1
```

**Output:**
```
1
```

---

## Intuition

The key insight is to transform the problem:

1. Let P be elements with + sign, N be elements with - sign
2. sum(P) - sum(N) = target
3. sum(P) + sum(N) = sum(nums)
4. Adding: 2 * sum(P) = target + sum(nums)
5. sum(P) = (target + sum(nums)) / 2

We need to find subsets that sum to (target + sum(nums)) / 2.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **DFS with Memoization** - O(n * sum) time, O(n * sum) space
2. **DP - Subset Sum** - O(n * sum) time, O(n * sum) space
3. **Optimized 1D DP** - O(n * sum) time, O(sum) space

---

## Approach 1: DFS with Memoization (Optimal)

This is an intuitive approach using recursion with memoization.

### Algorithm Steps

1. Define recursive function that takes index and current sum
2. Base case: if index == len(nums), return 1 if sum == target
3. Memoize results to avoid recomputation
4. Return count of (+ nums[index]) + count of (- nums[index])

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        """
        Solve using DFS with memoization.
        
        Args:
            nums: Array of integers
            target: Target sum
            
        Returns:
            Number of expressions
        """
        from functools import lru_cache
        
        @lru_cache(maxsize=None)
        def dfs(i, cur):
            if i == len(nums):
                return 1 if cur == target else 0
            
            # Add nums[i]
            add = dfs(i + 1, cur + nums[i])
            # Subtract nums[i]
            subtract = dfs(i + 1, cur - nums[i])
            
            return add + subtract
        
        return dfs(0, 0)
```

<!-- slide -->
```cpp
class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        /**
         * Solve using DFS with memoization.
         */
        int n = nums.size();
        unordered_map<int, unordered_map<int, int>> memo;
        
        function<int(int, int)> dfs = [&](int i, int cur) -> int {
            if (i == n) {
                return cur == target ? 1 : 0;
            }
            if (memo[i].count(cur)) {
                return memo[i][cur];
            }
            
            int add = dfs(i + 1, cur + nums[i]);
            int subtract = dfs(i + 1, cur - nums[i]);
            
            return memo[i][cur] = add + subtract;
        };
        
        return dfs(0, 0);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        /**
         * Solve using DFS with memoization.
         */
        Map<Integer, Map<Integer, Integer>> memo = new HashMap<>();
        return dfs(nums, target, 0, 0, memo);
    }
    
    private int dfs(int[] nums, int target, int i, int cur, 
                    Map<Integer, Map<Integer, Integer>> memo) {
        if (i == nums.length) {
            return cur == target ? 1 : 0;
        }
        
        if (memo.containsKey(i) && memo.get(i).containsKey(cur)) {
            return memo.get(i).get(cur);
        }
        
        int add = dfs(nums, target, i + 1, cur + nums[i], memo);
        int subtract = dfs(nums, target, i + 1, cur - nums[i], memo);
        
        memo.computeIfAbsent(i, k -> new HashMap<>()).put(cur, add + subtract);
        return add + subtract;
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve using DFS with memoization.
 * 
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
    const memo = {};
    
    const dfs = (i, cur) => {
        const key = `${i},${cur}`;
        if (key in memo) return memo[key];
        
        if (i === nums.length) {
            return cur === target ? 1 : 0;
        }
        
        const add = dfs(i + 1, cur + nums[i]);
        const subtract = dfs(i + 1, cur - nums[i]);
        
        memo[key] = add + subtract;
        return memo[key];
    };
    
    return dfs(0, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * S) where S is the range of possible sums |
| **Space** | O(n * S) for memo |

---

## Approach 2: DP - Subset Sum

Transform to subset sum problem.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findTargetSumWays_dp(self, nums: List[int], target: int) -> int:
        """
        Solve using DP - subset sum transformation.
        """
        total = sum(nums)
        if abs(target) > total:
            return 0
        
        # Check if (target + total) is even
        if (target + total) % 2 != 0:
            return 0
        
        S = (target + total) // 2
        
        # DP: number of ways to sum to S
        dp = [0] * (S + 1)
        dp[0] = 1
        
        for num in nums:
            for i in range(S, num - 1, -1):
                dp[i] += dp[i - num]
        
        return dp[S]
```

<!-- slide -->
```cpp
class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (abs(target) > total || (target + total) % 2) return 0;
        
        int S = (target + total) / 2;
        vector<int> dp(S + 1, 0);
        dp[0] = 1;
        
        for (int num : nums) {
            for (int i = S; i >= num; i--) {
                dp[i] += dp[i - num];
            }
        }
        
        return dp[S];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int total = Arrays.stream(nums).sum();
        if (Math.abs(target) > total || (target + total) % 2 != 0) return 0;
        
        int S = (target + total) / 2;
        int[] dp = new int[S + 1];
        dp[0] = 1;
        
        for (int num : nums) {
            for (int i = S; i >= num; i--) {
                dp[i] += dp[i - num];
            }
        }
        
        return dp[S];
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve using DP - subset sum transformation.
 * 
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (Math.abs(target) > total || (target + total) % 2 !== 0) return 0;
    
    const S = (target + total) / 2;
    const dp = new Array(S + 1).fill(0);
    dp[0] = 1;
    
    for (const num of nums) {
        for (let i = S; i >= num; i--) {
            dp[i] += dp[i - num];
        }
    }
    
    return dp[S];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * S) |
| **Space** | O(S) |

---

## Comparison of Approaches

| Aspect | DFS + Memo | DP Subset Sum |
|--------|-------------|---------------|
| **Time Complexity** | O(n * S) | O(n * S) |
| **Space Complexity** | O(n * S) | O(S) |
| **Implementation** | Intuitive | Requires transformation |

**Best Approach:** Both are optimal; DFS is more intuitive, DP is more space-efficient.

---

## Why Transformation Works

The key insight is:
1. sum(P) - sum(N) = target
2. sum(P) + sum(N) = sum(nums)
3. Solving: sum(P) = (target + sum(nums)) / 2

This converts to a classic subset sum problem.

---

## Related Problems

| Problem | LeetCode Link |
|---------|---------------|
| Partition Equal Subset Sum | [Link](https://leetcode.com/problems/partition-equal-subset-sum/) |
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Target Sum](https://www.youtube.com/watch?v=g0npya6FzKE)** - Clear explanation with DFS approach
2. **[Target Sum - LeetCode 494](https://www.youtube.com/watch?v=aqJ1ZtVG4Ms)** - Detailed walkthrough
3. **[Back to Back SWE - Target Sum](https://www.youtube.com/watch?v=nG2q8r4XjLw)** - Comprehensive explanation

---

## Follow-up Questions

### Q1: Why is the time complexity O(n * sum)?

**Answer:** Each element can form different sum values, and we explore all possibilities.

### Q2: What if target is 0?

**Answer:** The algorithm works the same way. 0 can be achieved by having equal + and - sums.

---

## Common Pitfalls

### 1. Negative Target
**Issue**: Not handling negative target values.

**Solution:** The subset sum transformation works with negative targets as well since we use absolute value.

### 2. Odd Sum
**Issue:** Not checking if (target + total) is even.

**Solution:** If (target + total) is odd, return 0 as no valid subset exists.

### 3. Large Target
**Issue:** Target greater than total sum.

**Solution:** If abs(target) > total, return 0 as it's impossible to achieve.

### 4. Zero Values in Array
**Issue:** Not handling zeros correctly in the array.

**Solution:** The DP approach naturally handles zeros - they can be included or excluded without changing the sum.

---

## Summary

The **Target Sum** problem demonstrates the **DFS + Memoization** and **DP Subset Sum** patterns:
- Transform to subset sum: sum(P) = (target + total) / 2
- Use DFS with memoization or DP table
- O(n * S) time complexity where S is the target sum

The key insight is converting the expression problem into a subset selection problem by understanding that sum(P) - sum(N) = target.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/target-sum/discuss/)
- [Subset Sum - GeeksforGeeks](https://www.geeksforgeeks.org/subset-sum-problem-dynamic-programming/)
