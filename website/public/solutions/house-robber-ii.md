# House Robber II

## Problem Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses are arranged in a **circle**, meaning the first house is the neighbor of the last one.

Adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array `nums` representing the amount of money in each house, return the maximum amount of money you can rob tonight without alerting the police.

**LeetCode Link:** [House Robber II - LeetCode](https://leetcode.com/problems/house-robber-ii/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `nums = [2,3,2]` | `3` |

**Explanation:** You cannot rob house 1 (money = 2) and then rob house 3 (money = 2) because they are adjacent in the circular arrangement.

### Example 2

| Input | Output |
|-------|--------|
| `nums = [1,2,3,1]` | `4` |

**Explanation:** Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount = `1 + 3 = 4`.

### Example 3

| Input | Output |
|-------|--------|
| `nums = [1,2,3]` | `3` |

---

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 1000`

---

## Pattern: Dynamic Programming with Circular Array Handling

This problem extends the classic House Robber problem to a circular arrangement. The key insight is that the circular constraint means you cannot rob both the first and last houses simultaneously, reducing the problem to two linear cases.

### Core Concept

- **Circular Constraint**: First and last houses cannot both be robbed
- **Reduce to Linear**: Solve two linear subproblems
- **DP Optimization**: Use O(1) space with two variables

### When to Use This Pattern

This pattern is applicable when:
1. Problems with circular/cyclic constraints
2. Optimization problems with dependencies
3. Cases where boundary conditions create special subproblems

---

## Intuition

The key insight for this problem is that the circular arrangement creates a simple constraint: **you cannot rob both the first and last houses**.

### Key Observations

1. **Two Exclusive Cases**: Since first and last are adjacent in a circle, we have two choices:
   - Exclude the first house: rob houses 1 to n-1
   - Exclude the last house: rob houses 0 to n-2
   - Take the maximum of both

2. **Linear House Robber**: The base problem (linear arrangement) is well-known:
   - At each house, choose: rob it (skip previous) or don't rob it (take previous max)
   - DP[i] = max(DP[i-1], DP[i-2] + nums[i])

3. **Edge Cases**:
   - 1 house: just rob that one
   - 2 houses: rob the one with more money
   - 3+ houses: apply the two-case approach

### Algorithm Overview

1. Handle edge cases (0, 1, or 2 houses)
2. Solve linear problem for nums[0:n-1] (exclude last)
3. Solve linear problem for nums[1:n] (exclude first)
4. Return maximum of both results

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Linear Passes** - Standard solution
2. **Optimized DP** - More explicit DP with comments

---

## Approach 1: Two Linear Passes (Standard)

### Algorithm Steps

1. If array is empty, return 0
2. If array has 1 element, return that element
3. If array has 2 elements, return max of both
4. For 3+ elements:
   - Calculate max for houses 0 to n-2 (exclude last)
   - Calculate max for houses 1 to n-1 (exclude first)
   - Return maximum of both

### Why It Works

This approach works because:
- In a circle, the first and last houses are adjacent
- Therefore, we must exclude one of them from consideration
- By solving the linear problem twice (once excluding each boundary), we cover all possibilities

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        Calculate maximum money that can be robbed from circular houses.
        
        Args:
            nums: Array of money in each house
            
        Returns:
            Maximum amount that can be robbed
        """
        if not nums:
            return 0
        
        n = len(nums)
        
        # Edge cases
        if n == 1:
            return nums[0]
        
        if n == 2:
            return max(nums[0], nums[1])
        
        def rob_linear(start: int, end: int) -> int:
            """
            Solve the linear house robber problem for houses from start to end (inclusive).
            """
            prev, curr = 0, 0
            
            for i in range(start, end + 1):
                # Option 1: Don't rob current house (take previous max)
                # Option 2: Rob current house (add current to max from 2 houses back)
                prev, curr = curr, max(curr, prev + nums[i])
            
            return curr
        
        # Case 1: Exclude last house (rob 0 to n-2)
        # Case 2: Exclude first house (rob 1 to n-1)
        return max(rob_linear(0, n - 2), rob_linear(1, n - 1))
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);
        
        auto robLinear = [&](int start, int end) {
            int prev = 0, curr = 0;
            for (int i = start; i <= end; i++) {
                int temp = max(curr, prev + nums[i]);
                prev = curr;
                curr = temp;
            }
            return curr;
        };
        
        // Case 1: Exclude last house
        // Case 2: Exclude first house
        return max(robLinear(0, n - 2), robLinear(1, n - 1));
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
        if (n == 2) return Math.max(nums[0], nums[1]);
        
        // Case 1: Exclude last house (rob 0 to n-2)
        // Case 2: Exclude first house (rob 1 to n-1)
        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
    }
    
    private int robLinear(int[] nums, int start, int end) {
        int prev = 0, curr = 0;
        for (int i = start; i <= end; i++) {
            int temp = Math.max(curr, prev + nums[i]);
            prev = curr;
            curr = temp;
        }
        return curr;
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
    if (n === 2) return Math.max(nums[0], nums[1]);
    
    const robLinear = (start, end) => {
        let prev = 0, curr = 0;
        for (let i = start; i <= end; i++) {
            const temp = Math.max(curr, prev + nums[i]);
            prev = curr;
            curr = temp;
        }
        return curr;
    };
    
    // Case 1: Exclude last house
    // Case 2: Exclude first house
    return Math.max(robLinear(0, n - 2), robLinear(1, n - 1));
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - two linear passes through the array |
| **Space** | O(1) - only two variables for DP |

---

## Approach 2: Explicit DP Table

### Algorithm Steps

1. Use explicit DP array for clarity
2. dp[i] = max amount that can be robbed up to house i
3. Same logic as approach 1, just more verbose

### Why It Works

Same as approach 1, just with explicit DP table instead of optimized variables.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        Using explicit DP table.
        """
        if not nums:
            return 0
        
        n = len(nums)
        
        if n == 1:
            return nums[0]
        
        if n == 2:
            return max(nums[0], nums[1])
        
        # Create DP table for case excluding last house
        dp1 = [0] * (n - 1)
        for i in range(n - 1):
            dp1[i] = max((dp1[i - 1] if i > 1 else 0), 
                        (dp1[i - 2] if i > 0 else 0) + nums[i])
        
        # Create DP table for case excluding first house
        dp2 = [0] * (n - 1)
        for i in range(1, n):
            idx = i - 1
            dp2[idx] = max((dp2[idx - 1] if idx > 1 else 0),
                           (dp2[idx - 2] if idx > 0 else 0) + nums[i])
        
        return max(dp1[-1], dp2[-1])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);
        
        // Case 1: Exclude last house
        vector<int> dp1(n - 1, 0);
        dp1[0] = nums[0];
        dp1[1] = max(nums[0], nums[1]);
        for (int i = 2; i < n - 1; i++) {
            dp1[i] = max(dp1[i - 1], dp1[i - 2] + nums[i]);
        }
        
        // Case 2: Exclude first house
        vector<int> dp2(n - 1, 0);
        dp2[0] = nums[1];
        dp2[1] = max(nums[1], nums[2]);
        for (int i = 3; i < n; i++) {
            dp2[i - 1] = max(dp2[i - 2], dp2[i - 3] + nums[i]);
        }
        
        return max(dp1[n - 2], dp2[n - 2]);
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
        if (n == 2) return Math.max(nums[0], nums[1]);
        
        // Case 1: Exclude last house
        int[] dp1 = new int[n - 1];
        dp1[0] = nums[0];
        dp1[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < n - 1; i++) {
            dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);
        }
        
        // Case 2: Exclude first house
        int[] dp2 = new int[n - 1];
        dp2[0] = nums[1];
        dp2[1] = Math.max(nums[1], nums[2]);
        for (int i = 3; i < n; i++) {
            dp2[i - 1] = Math.max(dp2[i - 2], dp2[i - 3] + nums[i]);
        }
        
        return Math.max(dp1[n - 2], dp2[n - 2]);
    }
}
```

<!-- slide -->
```javascript
var rob = function(nums) {
    const n = nums.length;
    if (n === 0) return 0;
    if (n === 1) return nums[0];
    if (n === 2) return Math.max(nums[0], nums[1]);
    
    // Case 1: Exclude last house
    const dp1 = new Array(n - 1).fill(0);
    dp1[0] = nums[0];
    dp1[1] = Math.max(nums[0], nums[1]);
    for (let i = 2; i < n - 1; i++) {
        dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);
    }
    
    // Case 2: Exclude first house
    const dp2 = new Array(n - 1).fill(0);
    dp2[0] = nums[1];
    dp2[1] = Math.max(nums[1], nums[2]);
    for (let i = 3; i < n; i++) {
        dp2[i - 1] = Math.max(dp2[i - 2], dp2[i - 3] + nums[i]);
    }
    
    return Math.max(dp1[n - 2], dp2[n - 2]);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - two linear passes |
| **Space** | O(n) - DP arrays |

---

## Comparison of Approaches

| Aspect | Two Variables | DP Table |
|--------|--------------|----------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Optimized | More explicit |
| **Readability** | Compact | Clear |

**Best Approach:** Use Approach 1 (Two Variables) for O(1) space optimization.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in interviews
- **Companies**: Amazon, Microsoft, Google
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, Circular constraints, Optimization

### Learning Outcomes

1. **DP Optimization**: Learn to reduce space from O(n) to O(1)
2. **Circular Handling**: Master handling circular/cyclic constraints
3. **Problem Reduction**: Learn to reduce complex problems to simpler ones

---

## Related Problems

Based on similar themes (dynamic programming, house robber):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | Linear version |
| House Robber III | [Link](https://leetcode.com/problems/house-robber-iii/) | Tree version |
| Paint House | [Link](https://leetcode.com/problems/paint-house/) | Similar DP |

### Pattern Reference

For more detailed explanations of Dynamic Programming, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[House Robber II - NeetCode](https://www.youtube.com/watch?v=r1P8oje7P88)** - Clear explanation
2. **[LeetCode 213 - House Robber II](https://www.youtube.com/watch?v=1wS96ylm4u0)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you extend this to houses arranged in a 2D grid (like a circle of circles)?

**Answer:** You'd need to apply the same circular logic in two dimensions, reducing to multiple linear cases. The complexity would increase significantly.

---

### Q2: What if you could rob at most k houses in a row (not just 1)?

**Answer:** You'd generalize the DP to maintain k previous states: dp[i] = max(dp[i-1], dp[i-2] + nums[i], ..., dp[i-k] + nums[i]).

---

### Q3: How would you modify the solution to also return which houses were robbed?

**Answer:** You'd need to track the decision at each step, similar to standard backtracking in DP problems.

---

### Q4: Can this be solved using recursion with memoization?

**Answer:** Yes, you could use recursion with memoization, but it would be less efficient due to function call overhead. The iterative approach is preferred.

---

## Common Pitfalls

### 1. Forgetting Edge Cases
**Issue**: Single house or empty array must return the correct value.

**Solution**: Add explicit checks at the beginning.

### 2. Not Handling n=2 Case Correctly
**Issue**: With only two houses, you can only rob one, so return the maximum of both.

**Solution**: Add explicit check for n == 2.

### 3. Confusing Indices
**Issue**: When slicing arrays, ensure the logic handles all possible lengths.

**Solution**: Use careful boundary indices (0 to n-2, and 1 to n-1).

### 4. Using Extra Space Unnecessarily
**Issue**: The problem can be solved in O(1) space using two variables.

**Solution**: Use two variables instead of DP array.

---

## Summary

The **House Robber II** problem demonstrates dynamic programming with circular constraints:

Key takeaways:
1. The circular constraint means you cannot rob both first and last houses
2. Reduce to two linear subproblems
3. Apply the classic House Robber DP to each subproblem
4. Take the maximum of both results
5. Optimize to O(1) space using two variables

This problem is essential for understanding how to handle circular constraints in DP problems.

### Pattern Summary

This problem exemplifies the **Dynamic Programming with Circular Handling** pattern, characterized by:
- Identifying boundary constraints that create special cases
- Reducing circular problems to linear subproblems
- Combining results from multiple cases
- Optimizing space from O(n) to O(1)

For more details on Dynamic Programming, see the **[Dynamic Programming Pattern](/patterns/dynamic-programming)**.

---

## Additional Resources

- [LeetCode Problem 213](https://leetcode.com/problems/house-robber-ii/) - Official problem page
- [House Robber - GeeksforGeeks](https://www.geeksforgeeks.org/maximum-sum-non-adjacent-elements/) - Related problem
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
