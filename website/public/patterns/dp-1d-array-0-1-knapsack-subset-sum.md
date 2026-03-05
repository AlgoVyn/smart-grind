# DP - 1D Array (0/1 Knapsack Subset Sum Style)

## Problem Description

The DP - 1D Array (0/1 Knapsack Subset Sum Style) pattern solves problems where items can be selected at most once (0/1 property) to achieve a target sum or maximize value within constraints. This pattern is essential for subset selection problems, partition problems, and classic knapsack variations where each item has a binary choice: include or exclude.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × target), where n is number of items, target is sum/capacity |
| Space Complexity | O(target), for the DP array |
| Input | Array of items (values/weights) and a target/capacity constraint |
| Output | Boolean (achievable), integer (max value), or count (number of ways) |
| Approach | Bottom-up with backward iteration to prevent item reuse |

### When to Use

- **Subset Sum problems**: Check if any subset sums to a target value
- **Partition problems**: Divide array into subsets with equal sums
- **0/1 Knapsack**: Maximize value without exceeding weight capacity
- **Target sum problems**: Count ways to assign +/- to reach a target
n- **Problems with binary choices**: Include or exclude each item exactly once

## Intuition

The key insight is that for 0/1 knapsack problems, iterating backward through the DP array prevents using the same item multiple times (which would make it unbounded knapsack).

The "aha!" moments:

1. **Backward iteration**: By iterating from target down to item value, we ensure each item is only used once
2. **State representation**: dp[i] represents whether sum i is achievable (boolean) or the max value for capacity i
3. **Transition**: dp[i] = dp[i] OR dp[i - num] for subset sum, or max(dp[i], dp[i - weight] + value) for knapsack
4. **Base case**: dp[0] = True (empty subset sums to 0) or dp[0] = 0 (zero capacity gives zero value)
5. **Space optimization**: We only need a 1D array because each state only depends on previous states

## Solution Approaches

### Approach 1: Subset Sum (Boolean DP) ✅ Recommended

Determine if any subset of nums sums to target.

#### Algorithm

1. Initialize dp array of size (target + 1) with False
2. Set dp[0] = True (base case: empty subset)
3. For each number in nums:
   - Iterate i from target down to num:
     - dp[i] = dp[i] OR dp[i - num]
4. Return dp[target]

#### Implementation

````carousel
```python
def can_partition_subset_sum(nums, target):
    """
    Check if any subset sums to target.
    LeetCode 416 - Partition Equal Subset Sum variant
    
    Time: O(n * target), Space: O(target)
    """
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: empty subset sums to 0
    
    for num in nums:
        # Iterate backward to prevent reuse
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]
    
    return dp[target]

def can_partition_equal_subset(nums):
    """
    LeetCode 416 - Partition Equal Subset Sum
    Check if array can be partitioned into two subsets with equal sum.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    return can_partition_subset_sum(nums, total // 2)
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = 0;
        for (int num : nums) total += num;
        
        if (total % 2 != 0) return false;
        
        int target = total / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        
        for (int num : nums) {
            // Iterate backward to prevent reuse
            for (int i = target; i >= num; i--) {
                dp[i] = dp[i] || dp[i - num];
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
        for (int num : nums) total += num;
        
        if (total % 2 != 0) return false;
        
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        
        for (int num : nums) {
            // Iterate backward to prevent reuse
            for (int i = target; i >= num; i--) {
                dp[i] = dp[i] || dp[i - num];
            }
        }
        
        return dp[target];
    }
}
```
<!-- slide -->
```javascript
function canPartition(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (total % 2 !== 0) return false;
    
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        // Iterate backward to prevent reuse
        for (let i = target; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
        }
    }
    
    return dp[target];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × target) |
| Space | O(target) |

### Approach 2: 0/1 Knapsack (Maximization)

Maximize value without exceeding weight capacity.

#### Algorithm

1. Initialize dp array of size (capacity + 1) with 0
2. For each item (value, weight):
   - Iterate w from capacity down to weight:
     - dp[w] = max(dp[w], dp[w - weight] + value)
3. Return dp[capacity]

#### Implementation

````carousel
```python
def knapsack_01(values, weights, capacity):
    """
    0/1 Knapsack: Maximize value without exceeding capacity.
    Each item can be used at most once.
    
    Time: O(n * capacity), Space: O(capacity)
    """
    dp = [0] * (capacity + 1)
    
    for i in range(len(values)):
        # Iterate backward to prevent reuse
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]

# Example: values = [60, 100, 120], weights = [10, 20, 30], capacity = 50
# Result: 220 (items 2 and 3: 100 + 120)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int knapsack01(vector<int>& values, vector<int>& weights, int capacity) {
        vector<int> dp(capacity + 1, 0);
        
        for (int i = 0; i < values.size(); i++) {
            // Iterate backward to prevent reuse
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        
        return dp[capacity];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int knapsack01(int[] values, int[] weights, int capacity) {
        int[] dp = new int[capacity + 1];
        
        for (int i = 0; i < values.length; i++) {
            // Iterate backward to prevent reuse
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        
        return dp[capacity];
    }
}
```
<!-- slide -->
```javascript
function knapsack01(values, weights, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < values.length; i++) {
        // Iterate backward to prevent reuse
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × capacity) |
| Space | O(capacity) |

### Approach 3: Count Number of Subsets

Count the number of subsets that sum to target.

#### Implementation

````carousel
```python
def count_subsets_with_sum(nums, target):
    """
    Count number of subsets that sum to target.
    LeetCode 494 - Target Sum variant
    
    Time: O(n * target), Space: O(target)
    """
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make sum 0: empty subset
    
    for num in nums:
        # Iterate backward to prevent reuse
        for i in range(target, num - 1, -1):
            dp[i] += dp[i - num]
    
    return dp[target]

def find_target_sum_ways(nums, target):
    """
    LeetCode 494 - Target Sum
    Count ways to assign + or - to each number to reach target.
    
    Transform: (sum of positives) - (sum of negatives) = target
    Let P = positives, N = negatives
    P - N = target, P + N = total
    2P = target + total, so P = (target + total) / 2
    """
    total = sum(nums)
    if abs(target) > total or (target + total) % 2 != 0:
        return 0
    return count_subsets_with_sum(nums, (target + total) // 2)
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int total = 0;
        for (int num : nums) total += num;
        
        if (abs(target) > total || (target + total) % 2 != 0)
            return 0;
        
        int sum = (target + total) / 2;
        vector<int> dp(sum + 1, 0);
        dp[0] = 1;
        
        for (int num : nums) {
            for (int i = sum; i >= num; i--) {
                dp[i] += dp[i - num];
            }
        }
        
        return dp[sum];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int num : nums) total += num;
        
        if (Math.abs(target) > total || (target + total) % 2 != 0)
            return 0;
        
        int sum = (target + total) / 2;
        int[] dp = new int[sum + 1];
        dp[0] = 1;
        
        for (int num : nums) {
            for (int i = sum; i >= num; i--) {
                dp[i] += dp[i - num];
            }
        }
        
        return dp[sum];
    }
}
```
<!-- slide -->
```javascript
function findTargetSumWays(nums, target) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (Math.abs(target) > total || (target + total) % 2 !== 0)
        return 0;
    
    const sum = (target + total) / 2;
    const dp = new Array(sum + 1).fill(0);
    dp[0] = 1;
    
    for (const num of nums) {
        for (let i = sum; i >= num; i--) {
            dp[i] += dp[i - num];
        }
    }
    
    return dp[sum];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × target) |
| Space | O(target) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Subset Sum (Boolean) | O(n × target) | O(target) | Check if sum is achievable |
| 0/1 Knapsack | O(n × capacity) | O(capacity) | Maximize value with weight limit |
| Count Subsets | O(n × target) | O(target) | Count ways to achieve sum |
| 2D DP (Full Table) | O(n × target) | O(n × target) | When you need to reconstruct solution |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | 416 | Medium | Check if array can be split into equal sum subsets |
| [Target Sum](https://leetcode.com/problems/target-sum/) | 494 | Medium | Count ways to assign +/- to reach target |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/) | 1049 | Medium | Minimize stone weight after smashing |
| [Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/) | 474 | Medium | Maximize strings with limited 0s and 1s |
| [0/1 Knapsack](https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/) | - | Medium | Classic knapsack problem |
| [Minimum Subset Sum Difference](https://www.geeksforgeeks.org/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum/) | - | Medium | Minimize difference between two subsets |
| [Count Subsets with Sum K](https://www.geeksforgeeks.org/count-of-subsets-with-sum-equal-to-k/) | - | Medium | Count subsets with given sum |

## Video Tutorial Links

1. **[NeetCode - 0/1 Knapsack](https://www.youtube.com/watch?v=GqOmJHQZixw)** - Comprehensive knapsack explanation
2. **[Back To Back SWE - Subset Sum](https://www.youtube.com/watch?v=s6FhG--P7z0)** - Dynamic programming approach
3. **[Kevin Naughton Jr. - Partition Equal Subset Sum](https://www.youtube.com/watch?v=IsvocB5BJhw)** - Step-by-step walkthrough
4. **[Abdul Bari - 0/1 Knapsack](https://www.youtube.com/watch?v=mGfK-j9gAQA)** - Detailed algorithm explanation
5. **[Techdose - Target Sum](https://www.youtube.com/watch?v=hqGa65Rp5LQ)** - Pattern and variations

## Summary

### Key Takeaways

- **Backward iteration is crucial**: Always iterate from target/capacity down to item value to prevent reusing items
- **dp[0] base case**: Empty subset always sums to 0, so dp[0] = True for boolean, dp[0] = 0 for value, dp[0] = 1 for count
- **Space optimization**: 1D array is sufficient; we don't need the full 2D table for most problems
- **Transform target sum**: Problems with +/- can be transformed into subset sum using: P = (target + total) / 2
- **Pattern recognition**: Look for "select items", "at most once", "target sum", "partition" keywords

### Common Pitfalls

- **Forward iteration**: Causes items to be reused (becomes unbounded knapsack)
- **Missing base case**: Forgetting to set dp[0] leads to all False/0 results
- **Integer overflow**: Count problems may overflow; use appropriate data types
- **Off-by-one errors**: Ensure loops go down to num (inclusive), not num - 1
- **Not checking target validity**: For target sum, check if (target + total) is even before dividing
- **Confusing subset sum with combination sum**: 0/1 selection vs unlimited selection

### Follow-up Questions

1. **How would you reconstruct the actual subset?**
   - Use a 2D DP table and backtrack from dp[n][target]

2. **What if items have both value and weight?**
   - Use the knapsack approach: dp[w] = max(dp[w], dp[w - weight] + value)

3. **Can you optimize space further?**
   - No, O(target) is optimal for 1D; but we can use bitsets for boolean cases

4. **How to handle negative numbers?**
   - Offset the DP array or use a different approach

## Pattern Source

[0/1 Knapsack Subset Sum Pattern](patterns/dp-1d-array-0-1-knapsack-subset-sum.md)
