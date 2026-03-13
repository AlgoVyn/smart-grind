# Delete and Earn

## Problem Description

Given an integer array `nums`, you may perform the following operation any number of times:
- Choose an element `x` from `nums` and delete it to earn points equal to `x`.
- After deletion, you must also delete every element equal to `x` and every element equal to `x - 1` and `x + 1`.

Return the maximum points you can earn by applying the operation any number of times.

**Link to problem:** [Delete and Earn - LeetCode 740](https://leetcode.com/problems/delete-and-earn/)

## Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^4`

---

## Pattern: Dynamic Programming - House Robber

This problem is a classic example of the **Dynamic Programming - House Robber** pattern. It's essentially the House Robber problem with a transformed input.

### Core Concept

The fundamental idea is:
- **Transformation**: Convert the array to a frequency-based array where index i represents total points from all occurrences of value i
- **Choice**: For each value i, either take it (and skip i-1) or skip it (and take i-1)
- **DP**: Similar to house robber on consecutive houses

---

## Examples

### Example

**Input:**
```
nums = [3,4,2]
```

**Output:**
```
6
```

**Explanation:** 
- Delete 4 to earn 4, then delete 3 and 2 are unavailable
- Or delete 3 to earn 3, then delete 4 is unavailable
- Best: Delete 4 (4) and 2 (2) = 6

### Example 2

**Input:**
```
nums = [2,2,3,3,3,4]
```

**Output:**
```
9
```

**Explanation:** Delete all 3's to earn 9, delete 2 and 4 are unavailable.

---

## Intuition

The key insight is to transform the problem:

1. Create a `points` array where `points[i] = i * count(i)` (value times its frequency)
2. This becomes the House Robber problem on consecutive houses
3. For each i, you can either take `points[i]` (skip i-1) or skip i (take i-1)

### Why House Robber?

- Values are consecutive integers (1 to max)
- Taking value i means you can't take i-1 or i+1
- This is exactly the same constraint as robbing houses where houses are values

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **DP with Points Array** - O(n + max(nums)) time, O(max(nums)) space
2. **Space Optimized DP** - O(n + max(nums)) time, O(1) space
3. **Hash Map Based DP** - For sparse arrays

---

## Approach 1: DP with Points Array (Optimal)

This is the most common and efficient approach.

### Algorithm Steps

1. Find max value in nums
2. Create points array of size max+1
3. For each num in nums, add num to points[num]
4. Apply House Robber DP:
   - dp[i] = max(dp[i-1], dp[i-2] + points[i])
5. Return dp[max]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        """
        Solve using House Robber DP pattern.
        
        Args:
            nums: List of integers
            
        Returns:
            Maximum points earned
        """
        if not nums:
            return 0
        
        max_val = max(nums)
        points = [0] * (max_val + 1)
        
        for num in nums:
            points[num] += num
        
        # House Robber DP
        prev, curr = 0, 0
        for i in range(max_val + 1):
            prev, curr = curr, max(curr, prev + points[i])
        
        return curr
```

<!-- slide -->
```cpp
class Solution {
public:
    int deleteAndEarn(vector<int>& nums) {
        /**
         * Solve using House Robber DP pattern.
         * 
         * Args:
         *     nums: List of integers
         * 
         * Returns:
         *     Maximum points earned
         */
        if (nums.empty()) return 0;
        
        int maxVal = *max_element(nums.begin(), nums.end());
        vector<int> points(maxVal + 1, 0);
        
        for (int num : nums) {
            points[num] += num;
        }
        
        int prev = 0, curr = 0;
        for (int i = 0; i <= maxVal; i++) {
            int newCurr = max(curr, prev + points[i]);
            prev = curr;
            curr = newCurr;
        }
        
        return curr;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int deleteAndEarn(int[] nums) {
        /**
         * Solve using House Robber DP pattern.
         * 
         * Args:
         *     nums: List of integers
         * 
         * Returns:
         *     Maximum points earned
         */
        if (nums.length == 0) return 0;
        
        int maxVal = Arrays.stream(nums).max().getAsInt();
        int[] points = new int[maxVal + 1];
        
        for (int num : nums) {
            points[num] += num;
        }
        
        int prev = 0, curr = 0;
        for (int i = 0; i <= maxVal; i++) {
            int newCurr = Math.max(curr, prev + points[i]);
            prev = curr;
            curr = newCurr;
        }
        
        return curr;
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve using House Robber DP pattern.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Maximum points earned
 */
var deleteAndEarn = function(nums) {
    if (nums.length === 0) return 0;
    
    const maxVal = Math.max(...nums);
    const points = new Array(maxVal + 1).fill(0);
    
    for (const num of nums) {
        points[num] += num;
    }
    
    let prev = 0, curr = 0;
    for (let i = 0; i <= maxVal; i++) {
        const newCurr = Math.max(curr, prev + points[i]);
        prev = curr;
        curr = newCurr;
    }
    
    return curr;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + max(nums)) - counting + DP |
| **Space** | O(max(nums)) - for points array |

---

## Approach 2: Space Optimized DP

Same approach with explicit dp array for clarity.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def deleteAndEarn_dp(self, nums: List[int]) -> int:
        """
        DP with explicit array.
        """
        if not nums:
            return 0
        
        max_val = max(nums)
        points = [0] * (max_val + 1)
        
        for num in nums:
            points[num] += num
        
        n = len(points)
        if n == 1:
            return points[0]
        
        dp = [0] * n
        dp[0] = points[0]
        dp[1] = max(points[0], points[1])
        
        for i in range(2, n):
            dp[i] = max(dp[i-1], dp[i-2] + points[i])
        
        return dp[-1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int deleteAndEarn(vector<int>& nums) {
        int maxVal = *max_element(nums.begin(), nums.end());
        vector<int> points(maxVal + 1, 0);
        
        for (int num : nums) points[num] += num;
        
        int n = maxVal + 1;
        if (n == 1) return points[0];
        
        vector<int> dp(n);
        dp[0] = points[0];
        dp[1] = max(points[0], points[1]);
        
        for (int i = 2; i < n; i++) {
            dp[i] = max(dp[i-1], dp[i-2] + points[i]);
        }
        
        return dp[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int deleteAndEarn(int[] nums) {
        int maxVal = Arrays.stream(nums).max().getAsInt();
        int[] points = new int[maxVal + 1];
        
        for (int num : nums) points[num] += num;
        
        int n = maxVal + 1;
        if (n == 1) return points[0];
        
        int[] dp = new int[n];
        dp[0] = points[0];
        dp[1] = Math.max(points[0], points[1]);
        
        for (int i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i-1], dp[i-2] + points[i]);
        }
        
        return dp[n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * DP with explicit array.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Maximum points earned
 */
var deleteAndEarn = function(nums) {
    const maxVal = Math.max(...nums);
    const points = new Array(maxVal + 1).fill(0);
    
    for (const num of nums) {
        points[num] += num;
    }
    
    const n = points.length;
    if (n === 1) return points[0];
    
    const dp = new Array(n);
    dp[0] = points[0];
    dp[1] = Math.max(points[0], points[1]);
    
    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + points[i]);
    }
    
    return dp[n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + max(nums)) |
| **Space** | O(max(nums)) |

---

## Approach 3: Hash Map Based DP

For very sparse arrays, use hash map.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def deleteAndEarn_hash(self, nums: List[int]) -> int:
        """
        Using hash map for sparse arrays.
        """
        from collections import Counter
        
        points = Counter(nums)
        max_val = max(points.keys()) if points else 0
        
        @functools.lru_cache(maxsize=None)
        def solve(x):
            if x > max_val:
                return 0
            if x not in points:
                return solve(x + 1)
            
            earn = points[x]
            skip = solve(x + 1)
            take = earn + solve(x + 2)
            return max(skip, take)
        
        return solve(min(points.keys()))
```

<!-- slide -->
```cpp
class Solution {
public:
    int deleteAndEarn(vector<int>& nums) {
        unordered_map<int, int> points;
        for (int num : nums) points[num] += num;
        
        int maxVal = points.empty() ? 0 : max_element(points.begin(), points.end(), 
            [](auto& a, auto& b){return a.first < b.first;})->first;
        
        unordered_map<int, int> memo;
        function<int(int)> solve = [&](int x) -> int {
            if (x > maxVal) return 0;
            if (!points.count(x)) return solve(x + 1);
            if (memo.count(x)) return memo[x];
            
            int earn = points[x];
            int result = max(solve(x + 1), earn + solve(x + 2));
            memo[x] = result;
            return result;
        };
        
        return solve(points.empty() ? 0 : min_element(points.begin(), points.end(),
            [](auto& a, auto& b){return a.first < b.first;})->first);
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<Integer, Integer> points = new HashMap<>();
    private Map<Integer, Integer> memo = new HashMap<>();
    
    public int deleteAndEarn(int[] nums) {
        for (int num : nums) {
            points.put(num, points.getOrDefault(num, 0) + num);
        }
        
        int minKey = points.keySet().stream().min(Integer::compareTo).orElse(0);
        return solve(minKey);
    }
    
    private int solve(int x) {
        if (!points.containsKey(x)) {
            int next = x + 1;
            if (!points.containsKey(next)) return 0;
            return solve(next);
        }
        if (memo.containsKey(x)) return memo.get(x);
        
        int earn = points.get(x);
        int result = Math.max(solve(x + 1), earn + solve(x + 2));
        memo.put(x, result);
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Using hash map for sparse arrays.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Maximum points earned
 */
var deleteAndEarn = function(nums) {
    const points = {};
    for (const num of nums) {
        points[num] = (points[num] || 0) + num;
    }
    
    const memo = {};
    const maxVal = Math.max(...Object.keys(points).map(Number));
    
    const solve = (x) => {
        if (x > maxVal) return 0;
        if (!points[x]) return solve(x + 1);
        if (memo[x] !== undefined) return memo[x];
        
        const earn = points[x];
        const result = Math.max(solve(x + 1), earn + solve(x + 2));
        memo[x] = result;
        return result;
    };
    
    const minVal = Math.min(...Object.keys(points).map(Number));
    return solve(minVal);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + k) where k is unique values |
| **Space** | O(k) |

---

## Comparison of Approaches

| Aspect | Points Array | Space Optimized | Hash Map |
|--------|-------------|-----------------|----------|
| **Time Complexity** | O(n + max) | O(n + max) | O(n + k) |
| **Space Complexity** | O(max) | O(max) | O(k) |
| **Implementation** | Simple | Simple | Moderate |
| **Best For** | Dense values | Dense values | Sparse arrays |

**Best Approach:** Points array (Approach 1) is optimal for most cases.

---

## Why House Robber Works

The transformation is key:
1. Converting to points array: index i → total points from value i
2. Taking index i means you can't take i-1 (deleted automatically)
3. This is exactly the House Robber problem
4. DP: dp[i] = max(dp[i-1], dp[i-2] + points[i])

---

## Related Problems

Based on similar themes (DP, House Robber pattern):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | Original problem |
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | DP basics |
| House Robber II | [Link](https://leetcode.com/problems/house-robber-ii/) | Circular houses |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Paint House | [Link](https://leetcode.com/problems/paint-house/) | Multi-choice DP |
| Coin Change | [Link](https://leetcode.com/problems/coin-change/) | Unbounded knapsack |
| Number of Ways to Stay in the Same Place | [Link](https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps/) | Path counting |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Paint House III | [Link](https://leetcode.com/problems/paint-house-iii/) | Complex DP |

### Pattern Reference

For more detailed explanations, see:
- **[Dynamic Programming - House Robber Pattern](/patterns/house-robber)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

- [NeetCode - Delete and Earn](https://www.youtube.com/watch?v=0IAP6fD三四G) - Explanation
- [House Robber Pattern](https://www.youtube.com/watch?v=73r3KXMx5bk) - Pattern explanation
- [LeetCode Official](https://www.youtube.com/watch?v=2NJ4I6x9Qqw) - Official solution

---

## Follow-up Questions

### Q1: How is this related to House Robber?

**Answer:** After transforming to a points array where index i represents total points from value i, it's exactly the same as House Robber. Taking points[i] means you can't take points[i-1].

### Q2: What if nums contains 0?

**Answer:** Include index 0 in the points array. Taking 0 doesn't give points but prevents taking 1.

### Q3: Can you solve it without extra space?

**Answer:** Not really, because we need the points array to aggregate frequencies. However, we only need O(1) extra space beyond the points array.

---

## Common Pitfalls

1. **Not handling max value**: Ensure points array covers all values
2. **Overflow**: Use appropriate integer types
3. **Empty array**: Handle edge case

---

## Summary

**Delete and Earn** is House Robber in disguise:
- Transform array to points by frequency
- Apply DP: dp[i] = max(dp[i-1], dp[i-2] + points[i])
- Time: O(n + max), Space: O(max)
