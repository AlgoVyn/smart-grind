# Partition Equal Subset Sum

## Problem Description

Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.

## Examples

### Example

**Input:** `nums = [1,5,11,5]`  
**Output:** `true`

**Explanation:** The array can be partitioned as `[1, 5, 5]` and `[11]`.

### Example 2

**Input:** `nums = [1,2,3,5]`  
**Output:** `false`

**Explanation:** The array cannot be partitioned into equal sum subsets.

## Constraints

- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 100`

---

## Intuition

This problem is a classic example of the **0/1 Knapsack - Subset Sum** pattern. The pattern involves determining if a subset of elements can sum to a target value.

### Core Concept

The fundamental idea is:
- **Target Calculation**: If we can find a subset that sums to half the total, the rest will also sum to half
- **Subset Sum DP**: Use dynamic programming to track which sums are achievable
- **Space Optimization**: Iterate backwards to use 1D array instead of 2D

---

## Pattern: 0/1 Knapsack - Subset Sum

The key insight is:
1. If total sum is odd, it's impossible to split into two equal parts
2. If we can find a subset that sums to total/2, the remaining elements will also sum to total/2
3. This reduces to the classic "subset sum" problem

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **1D DP Array (Optimal)** - O(n*sum) time, O(sum) space
2. **2D DP Table** - O(n*sum) time, O(n*sum) space

---

## Approach 1: 1D DP Array (Optimal)

This is the most space-efficient approach using a 1D DP array.

### Algorithm Steps

1. Calculate total sum of array
2. If sum is odd, return false
3. Set target = sum / 2
4. Create DP array where dp[j] indicates if sum j can be achieved
5. For each number, update dp from back to front
6. Return dp[target]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        """
        Check if array can be partitioned into equal sum subsets.
        
        Args:
            nums: List of positive integers
            
        Returns:
            True if partition is possible, False otherwise
        """
        total = sum(nums)
        
        # If total is odd, can't split into equal parts
        if total % 2 != 0:
            return False
        
        target = total // 2
        
        # dp[j] = True if sum j can be achieved
        dp = [False] * (target + 1)
        dp[0] = True  # Sum of 0 is always achievable (empty subset)
        
        for num in nums:
            # Iterate backwards to avoid using same element twice
            for j in range(target, num - 1, -1):
                dp[j] = dp[j] or dp[j - num]
        
        return dp[target]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    /**
     * Check if array can be partitioned into equal sum subsets.
     */
    bool canPartition(vector<int>& nums) {
        int total = 0;
        for (int num : nums) {
            total += num;
        }
        
        // If total is odd, can't split into equal parts
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        
        // dp[j] = true if sum j can be achieved
        vector<bool> dp(target + 1, false);
        dp[0] = true;  // Sum of 0 is always achievable
        
        for (int num : nums) {
            // Iterate backwards to avoid using same element twice
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        
        return dp[target];
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int num : nums) {
            total += num;
        }
        
        // If total is odd, can't split into equal parts
        if (total % 2 != 0) {
            return false;
        }
        
        int target = total / 2;
        
        // dp[j] = true if sum j can be achieved
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;  // Sum of 0 is always achievable
        
        for (int num : nums) {
            // Iterate backwards to avoid using same element twice
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        
        return dp[target];
    }
}
```

<!-- slide -->
```javascript
/**
 * Check if array can be partitioned into equal sum subsets.
 * 
 * @param {number[]} nums - List of positive integers
 * @return {boolean} - True if partition is possible
 */
var canPartition = function(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    // If total is odd, can't split into equal parts
    if (total % 2 !== 0) {
        return false;
    }
    
    const target = total / 2;
    
    // dp[j] = true if sum j can be achieved
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;  // Sum of 0 is always achievable
    
    for (const num of nums) {
        // Iterate backwards to avoid using same element twice
        for (let j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    
    return dp[target];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * sum) - n elements, each processing up to sum |
| **Space** | O(sum) - DP array of size sum/2 + 1 |

---

## Approach 2: 2D DP Table

This approach uses a 2D DP table for clarity, showing the full subset sum table.

### Algorithm Steps

1. Calculate total sum and target
2. Create 2D DP table where dp[i][j] = if subset of first i elements can sum to j
3. Initialize first row (j=0) to true
4. For each element and each possible sum, update the table
5. Return dp[n][target]

### Code Implementation

````carousel
```python
class Solution:
    def canPartition_2d(self, nums: List[int]) -> bool:
        """
        2D DP approach for clarity.
        """
        total = sum(nums)
        if total % 2 != 0:
            return False
        
        target = total // 2
        n = len(nums)
        
        # dp[i][j] = if subset of first i elements can sum to j
        dp = [[False] * (target + 1) for _ in range(n + 1)]
        
        # Sum of 0 is always achievable
        for i in range(n + 1):
            dp[i][0] = True
        
        for i in range(1, n + 1):
            for j in range(1, target + 1):
                # Don't include nums[i-1]
                dp[i][j] = dp[i-1][j]
                # Include nums[i-1] if possible
                if j >= nums[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j - nums[i-1]]
        
        return dp[n][target]
```

<!-- slide -->
```cpp
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = 0;
        for (int num : nums) total += num;
        
        if (total % 2 != 0) return false;
        
        int target = total / 2;
        int n = nums.size();
        
        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
        
        for (int i = 0; i <= n; i++) {
            dp[i][0] = true;
        }
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {
                dp[i][j] = dp[i-1][j];
                if (j >= nums[i-1]) {
                    dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
                }
            }
        }
        
        return dp[n][target];
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int num : nums) total += num;
        
        if (total % 2 != 0) return false;
        
        int target = total / 2;
        int n = nums.length;
        
        boolean[][] dp = new boolean[n + 1][target + 1];
        
        for (int i = 0; i <= n; i++) {
            dp[i][0] = true;
        }
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {
                dp[i][j] = dp[i-1][j];
                if (j >= nums[i-1]) {
                    dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
                }
            }
        }
        
        return dp[n][target];
    }
}
```

<!-- slide -->
```javascript
var canPartition = function(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    
    const target = total / 2;
    const n = nums.length;
    
    const dp = Array.from({ length: n + 1 }, () => 
        Array(target + 1).fill(false)
    );
    
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= target; j++) {
            dp[i][j] = dp[i-1][j];
            if (j >= nums[i-1]) {
                dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
            }
        }
    }
    
    return dp[n][target];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * sum) |
| **Space** | O(n * sum) |

---

## Comparison of Approaches

| Aspect | 1D DP Array | 2D DP Table |
|--------|-------------|-------------|
| **Time Complexity** | O(n * sum) | O(n * sum) |
| **Space Complexity** | O(sum) | O(n * sum) |
| **Implementation** | Simple | Clear |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

**Best Approach:** The 1D DP array approach (Approach 1) is optimal with O(sum) space complexity.

---

## Why DP is Optimal for This Problem

The DP approach is optimal because:

1. **Complete Search**: Tries all possible subsets
2. **Optimal Substructure**: If subset sums to target, solution exists
3. **No Better Alternative**: This is essentially the subset sum problem which is NP-complete
4. **Space Efficient**: 1D array achieves O(sum) space

The key insight is that iterating backwards allows us to use a 1D array instead of 2D - each element is used at most once.

---

## Related Problems

Based on similar themes (subset sum, knapsack):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Partition Equal Subset Sum | [Link](https://leetcode.com/problems/partition-equal-subset-sum/) | This problem |
| Subset Sum | [Link](https://leetcode.com/problems/subset-sum-equal-target/) | Find subset summing to target |
| Minimum Subset Sum Difference | [Link](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/) | Minimize difference |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Difficulty | [Link](https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/) | Job scheduling |
| Target Sum | [Link](https://leetcode.com/problems/target-sum/) | +/- signs to reach target |

### Pattern Reference

For more detailed explanations of the 0/1 Knapsack pattern, see:
- **[0/1 Knapsack Pattern](/patterns/knapsack)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

### DP Approach

- [NeetCode - Partition Equal Subset Sum](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Clear explanation
- [Subset Sum DP](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Official solution

### Related Concepts

- [0/1 Knapsack](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Classic knapsack
- [Dynamic Programming](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - DP fundamentals

---

## Follow-up Questions

### Q1: How would you find the actual subsets?

**Answer:** Store predecessor information in the DP table to backtrack and find which elements form the subset.

---

### Q2: What if numbers can be negative?

**Answer:** The problem becomes much harder. You'd need to handle negative numbers by adjusting the target range, which complicates the DP significantly.

---

### Q3: Can you solve it using recursion with memoization?

**Answer:** Yes, you can use recursion with a memo set, but it would have the same time complexity and potentially more overhead.

---

### Q4: How would you handle large sums?

**Answer:** For very large sums, consider using a bitset instead of boolean array. Each bit represents whether a sum is achievable.

---

### Q5: What's the difference between this and the subset sum problem?

**Answer:** This is exactly the subset sum problem with the constraint that we need sum = total/2. If we can achieve that, the answer is true.

---

### Q6: How would you extend to find minimum difference between two partitions?

**Answer:** After filling DP table, find the largest j <= target that is achievable. The minimum difference is total - 2*j.

---

### Q7: What edge cases should be tested?

**Answer:**
- Single element array
- All equal elements
- Two elements with equal sum
- Odd total sum
- Even total but no valid partition

---

## Common Pitfalls

### 1. Sum Overflow
**Issue**: Not handling large sums properly.

**Solution**: Use integer types that can handle the sum (max is 200*100 = 20000).

### 2. Backwards Iteration
**Issue**: Iterating forward causes elements to be used multiple times.

**Solution**: Always iterate j from target down to num.

### 3. Early Return
**Issue**: Not checking odd sum first.

**Solution**: Return false immediately if total is odd.

---

## Summary

The **Partition Equal Subset Sum** problem demonstrates the power of dynamic programming for subset sum problems:

- **1D DP**: Optimal with O(n*sum) time and O(sum) space
- **2D DP**: Clear but uses more space

The key insight is reducing the problem to finding a subset that sums to half the total.

### Pattern Summary

This problem exemplifies the **0/1 Knapsack - Subset Sum** pattern:
- Subset sum determination
- Backward iteration for space optimization
- NP-complete problem solved with pseudo-polynomial DP

---

## Additional Resources

- [LeetCode Discussion](https://leetcode.com/problems/partition-equal-subset-sum/discuss/)
- [Subset Sum - GeeksforGeeks](https://www.geeksforgeeks.org/subset-sum-problem-dp-22/)
- [Knapsack - Wikipedia](https://en.wikipedia.org/wiki/Knapsack_problem)
