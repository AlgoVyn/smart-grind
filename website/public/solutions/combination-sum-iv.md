# Combination Sum IV

## Problem Description

Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to target.
The test cases are generated so that the answer can fit in a 32-bit integer.

**Link to problem:** [Combination Sum IV - LeetCode 377](https://leetcode.com/problems/combination-sum-iv/)

---

## Pattern: Dynamic Programming - Target Sum

This problem demonstrates the **DP - Target Sum** pattern. It's similar to the "Climbing Stairs" problem but with multiple step sizes.

### Core Concept

The fundamental idea is building from smaller targets:
- `dp[i]` = number of ways to sum to target i
- `dp[i] = sum(dp[i - num])` for each num in nums where i >= num
- Order matters, so we count all permutations

---

## Examples

### Example

**Input:**
```
nums = [1,2,3], target = 4
```

**Output:**
```
7
```

**Explanation:** The possible combination ways are:
- (1, 1, 1, 1)
- (1, 1, 2)
- (1, 2, 1)
- (1, 3)
- (2, 1, 1)
- (2, 2)
- (3, 1)

Note that different sequences are counted as different combinations.

### Example 2

**Input:**
```
nums = [9], target = 3
```

**Output:**
```
0
```

---

## Constraints

- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 1000`
- All the elements of nums are unique.
- `1 <= target <= 1000`

---

## Intuition

The key insight is treating this like "climbing stairs" where you can take 1, 2, or 3 steps at a time:
- For target i, we can reach it by adding any num to target i - num
- We iterate targets from 0 to target, and for each target, try all nums

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DP - Bottom Up (Optimal)** - O(target * len(nums)) time
2. **Memoization (Recursive)** - O(target * len(nums)) time

---

## Approach 1: DP - Bottom Up (Optimal)

### Algorithm Steps

1. Create dp array of size target + 1
2. dp[0] = 1 (one way to sum to 0 - empty combination)
3. For each i from 1 to target:
   - For each num in nums:
     - If i >= num, dp[i] += dp[i - num]
4. Return dp[target]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        """
        Find number of combinations that sum to target.
        
        Args:
            nums: List of distinct integers
            target: Target sum
            
        Returns:
            Number of valid combinations
        """
        dp = [0] * (target + 1)
        dp[0] = 1
        
        for i in range(1, target + 1):
            for num in nums:
                if i >= num:
                    dp[i] += dp[i - num]
        
        return dp[target]
```

<!-- slide -->
```cpp
class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        vector<int> dp(target + 1, 0);
        dp[0] = 1;
        
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (i >= num) {
                    dp[i] += dp[i - num];
                }
            }
        }
        
        return dp[target];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int combinationSum4(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;
        
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (i >= num) {
                    dp[i] += dp[i - num];
                }
            }
        }
        
        return dp[target];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var combinationSum4 = function(nums, target) {
    const dp = new Array(target + 1).fill(0);
    dp[0] = 1;
    
    for (let i = 1; i <= target; i++) {
        for (const num of nums) {
            if (i >= num) {
                dp[i] += dp[i - num];
            }
        }
    }
    
    return dp[target];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(target * len(nums)) |
| **Space** | O(target) |

---

## Approach 2: Memoization (Recursive)

### Code Implementation

````carousel
```python
from typing import List
from functools import lru_cache

class Solution:
    def combinationSum4_memo(self, nums: List[int], target: int) -> int:
        """
        Find combinations using memoization.
        """
        @lru_cache(maxsize=None)
        def dfs(remaining):
            if remaining == 0:
                return 1
            if remaining < 0:
                return 0
            
            count = 0
            for num in nums:
                count += dfs(remaining - num)
            return count
        
        return dfs(target)
```

<!-- slide -->
```cpp
class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        unordered_map<int, int> memo;
        
        function<int(int)> dfs = [&](int remaining) -> int {
            if (remaining == 0) return 1;
            if (remaining < 0) return 0;
            if (memo.count(remaining)) return memo[remaining];
            
            int count = 0;
            for (int num : nums) {
                count += dfs(remaining - num);
            }
            
            return memo[remaining] = count;
        };
        
        return dfs(target);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int combinationSum4(int[] nums, int target) {
        Map<Integer, Integer> memo = new HashMap<>();
        return dfs(nums, target, memo);
    }
    
    private int dfs(int[] nums, int remaining, Map<Integer, Integer> memo) {
        if (remaining == 0) return 1;
        if (remaining < 0) return 0;
        if (memo.containsKey(remaining)) return memo.get(remaining);
        
        int count = 0;
        for (int num : nums) {
            count += dfs(nums, remaining - num, memo);
        }
        
        memo.put(remaining, count);
        return count;
    }
}
```

<!-- slide -->
```javascript
var combinationSum4 = function(nums, target) {
    const memo = {};
    
    const dfs = (remaining) => {
        if (remaining === 0) return 1;
        if (remaining < 0) return 0;
        if (memo[remaining] !== undefined) return memo[remaining];
        
        let count = 0;
        for (const num of nums) {
            count += dfs(remaining - num);
        }
        
        memo[remaining] = count;
        return count;
    };
    
    return dfs(target);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(target * len(nums)) |
| **Space** | O(target) |

---

## Comparison of Approaches

| Aspect | DP Bottom Up | Memoization |
|--------|---------------|-------------|
| **Time** | O(target * n) | O(target * n) |
| **Space** | O(target) | O(target) |
| **Implementation** | Iterative | Recursive |

Both approaches have the same time complexity. The bottom-up DP is generally preferred.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Similar DP with fixed steps |
| Coin Change | [Link](https://leetcode.com/problems/coin-change/) | Minimum coins (order doesn't matter) |
| Perfect Squares | [Link](https://leetcode.com/problems/perfect-squares/) | Similar target sum |

---

## Video Tutorial Links

- [NeetCode - Combination Sum IV](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [DP Pattern Explained](https://www.youtube.com/watch?v=7C_f7fD2p14) - Understanding dynamic programming

---

## Follow-up Questions

### Q1: Why do we iterate targets from 1 to target instead of nums?

**Answer:** We need to build up from smaller targets to larger ones. For each target i, we need dp[i-num] to already be computed.

### Q2: What if nums contains 0?

**Answer:** This would cause infinite loops. Problem constraints state nums[i] >= 1, so no need to handle 0.

### Q3: How would you handle very large targets?

**Answer:** Use memoization with pruning, or consider if there's a mathematical formula for the specific nums.

---

## Common Pitfalls

### 1. Integer Overflow
**Issue**: Not handling large answer values.
**Solution**: Use long type in languages like Java, or let Python's big integers handle it.

### 2. Order vs Combination
**Issue**: Confusing combinations (order doesn't matter) with permutations (order matters).
**Solution**: This problem counts permutations, so iterate targets from small to large.

### 3. Empty dp Array
**Issue**: Not initializing dp[0] = 1.
**Solution**: dp[0] = 1 represents one way to reach target 0 (empty combination).

### 4. Target Zero
**Issue**: Not handling target = 0 correctly.
**Solution**: Return 1 (one empty combination) when target is 0.

---

## Summary

The **Combination Sum IV** problem demonstrates **Dynamic Programming - Target Sum**:
- Similar to "Climbing Stairs" but with arbitrary "steps"
- dp[i] = sum of dp[i - num] for all valid nums
- Order matters, so we count all valid permutations
- O(target * n) time and O(target) space

This problem is excellent for understanding how to extend simple DP problems to more complex scenarios.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/combination-sum-iv/discuss/)
- [DP Pattern - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/)
