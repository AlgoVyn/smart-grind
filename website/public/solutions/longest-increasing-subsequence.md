# Longest Increasing Subsequence

## Problem Description

Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

---

## Examples

### Example 1

**Input:** `nums = [10,9,2,5,3,7,101,18]`

**Output:** `4`

**Explanation:** The longest increasing subsequence is `[2,3,7,101]`, therefore the length is `4`.

### Example 2

**Input:** `nums = [0,1,0,3,2,3]`

**Output:** `4`

**Explanation:** The longest increasing subsequence is `[0,1,2,3]`, length is `4`.

### Example 3

**Input:** `nums = [7,7,7,7,7,7,7]`

**Output:** `1`

**Explanation:** All elements are equal, so the longest increasing subsequence has length `1`.

---

## Constraints

- `1 <= nums.length <= 2500`
- `-10^4 <= nums[i] <= 10^4`

---

## LeetCode Link

[LeetCode Problem 300: Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

---

## Pattern: Binary Search on Tails (Patience Sorting)

This problem follows the **Binary Search on Tails** pattern, also known as Patience Sorting.

### Core Concept

- **Tail Array**: Store smallest tail element for each subsequence length
- **Monotonic Property**: tails array is always sorted in increasing order
- **Binary Search**: Find position to insert/replace in O(log n)

### When to Use This Pattern

This pattern is applicable when:
1. Finding length of longest increasing subsequence
2. Optimization from O(n²) DP to O(n log n)
3. Problems requiring patience sorting technique

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Dynamic Programming | O(n²) - simpler but slower |
| Segment Tree | For range queries |

---

## Intuition

The key insight is understanding how to efficiently track the longest increasing subsequence:

> The optimal approach uses a "tails" array where each element represents the smallest tail for subsequences of different lengths.

### Key Observations

1. **Binary Search Optimization**: We don't need to examine every subsequence - we can use binary search to find where each element belongs.

2. **Tail Array**: The `tails[i]` array stores the smallest tail element of all increasing subsequences with length `i+1`.

3. **Monotonic Property**: The `tails` array is always sorted in increasing order.

4. **Two Approaches**:
   - DP: O(n²) - simpler to understand
   - Binary Search: O(n log n) - optimal solution

### Why Binary Search Works

For each element in nums:
- If it's larger than all elements in tails, append it (we found a longer subsequence)
- Otherwise, find the first element in tails that is >= num and replace it

This maintains the smallest possible tail for each length, allowing for longer future subsequences.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Binary Search (Patience Sorting)** - Optimal O(n log n)
2. **Dynamic Programming** - Standard O(n²) approach

---

## Approach 1: Binary Search (Optimal)

### Algorithm Steps

1. Initialize an empty `tails` array
2. For each number in nums:
   - Use binary search to find the position where to insert/replace
   - If position equals tails length, append (new longer subsequence)
   - Otherwise, replace the element at that position
3. Return the length of tails

### Why It Works

The tails array maintains the smallest possible tail for each subsequence length. This greedy approach ensures we always have the best chance of extending subsequences in the future.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        """
        Find the length of longest increasing subsequence using binary search.
        
        Args:
            nums: List of integers
            
        Returns:
            Length of the longest increasing subsequence
        """
        tails = []
        
        for num in nums:
            # Binary search to find the position
            left, right = 0, len(tails)
            while left < right:
                mid = (left + right) // 2
                if tails[mid] < num:
                    left = mid + 1
                else:
                    right = mid
            
            # If left equals tails length, append (new longer subsequence)
            if left == len(tails):
                tails.append(num)
            else:
                tails[left] = num
        
        return len(tails)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        
        for (int num : nums) {
            // Binary search to find the position
            int left = 0, right = tails.size();
            while (left < right) {
                int mid = (left + right) / 2;
                if (tails[mid] < num) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            
            // If left equals tails length, append
            if (left == tails.size()) {
                tails.push_back(num);
            } else {
                tails[left] = num;
            }
        }
        
        return tails.size();
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        
        for (int num : nums) {
            // Binary search to find the position
            int left = 0, right = tails.size();
            while (left < right) {
                int mid = (left + right) / 2;
                if (tails.get(mid) < num) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            
            // If left equals tails size, append
            if (left == tails.size()) {
                tails.add(num);
            } else {
                tails.set(left, num);
            }
        }
        
        return tails.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    const tails = [];
    
    for (const num of nums) {
        // Binary search to find the position
        let left = 0, right = tails.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // If left equals tails length, append
        if (left === tails.length) {
            tails.push(num);
        } else {
            tails[left] = num;
        }
    }
    
    return tails.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Binary search for each element |
| **Space** | O(n) - For the tails array |

---

## Approach 2: Dynamic Programming

### Algorithm Steps

1. Create a dp array where dp[i] represents the length of LIS ending at index i
2. Initialize dp[i] = 1 for all i (each element is a subsequence of length 1)
3. For each element i, check all previous elements j:
   - If nums[i] > nums[j], dp[i] = max(dp[i], dp[j] + 1)
4. Return max(dp)

### Why It Works

The DP approach builds solutions from smaller subproblems. For each element, we find the longest subsequence that can be extended by the current element.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        """
        Find LIS using dynamic programming O(n²).
        """
        if not nums:
            return 0
        
        n = len(nums)
        dp = [1] * n  # dp[i] = LIS ending at index i
        
        for i in range(1, n):
            for j in range(i):
                if nums[i] > nums[j]:
                    dp[i] = max(dp[i], dp[j] + 1)
        
        return max(dp)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int n = nums.size();
        vector<int> dp(n, 1);
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
        }
        
        return *max_element(dp.begin(), dp.end());
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
        }
        
        int maxLen = 0;
        for (int len : dp) {
            maxLen = Math.max(maxLen, len);
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
var lengthOfLIS = function(nums) {
    if (nums.length === 0) return 0;
    
    const n = nums.length;
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Double loop |
| **Space** | O(n) - For dp array |

---

## Comparison of Approaches

| Aspect | Binary Search | Dynamic Programming |
|--------|---------------|-------------------|
| **Time Complexity** | O(n log n) | O(n²) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |

**Best Approach:** Binary Search is the optimal solution for this problem.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, Binary Search, patience sorting

### Learning Outcomes

1. **Binary Search on Arrays**: Learn to apply binary search in non-traditional ways
2. **DP Optimization**: Understand how to optimize O(n²) to O(n log n)
3. **Patience Sorting**: Learn the algorithm used in card games

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Increasing Subsequence II | [Link](https://leetcode.com/problems/longest-increasing-subsequence-ii/) | DP with bounded values |
| Number of Longest Increasing Subsequence | [Link](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) | Count all LIS |
| Longest Bitonic Subsequence | [Link](https://leetcode.com/problems/longest-bitonic-subsequence/) | Increase then decrease |

### Pattern Reference

For more detailed explanations of the LIS pattern, see:
- **[Longest Increasing Subsequence Pattern](/patterns/dp-longest-increasing-subsequence-lis)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Longest Increasing Subsequence](https://www.youtube.com/watch?v=5vRni7UdS5w)** - Clear explanation with visual examples
2. **[LIS - LeetCode 300](https://www.youtube.com/watch?v=5vRni7UdS5w)** - Detailed walkthrough
3. **[Patience Sorting Algorithm](https://www.youtube.com/watch?v=9K3sU '-0uBbk)** - Understanding the algorithm

---

## Follow-up Questions

### Q1: How would you reconstruct the actual subsequence (not just length)?

**Answer:** Maintain a predecessor array that tracks where each element came from. Also need to track the index of the smallest tail for each length.

---

### Q2: How would you find the longest non-decreasing subsequence (allow equal elements)?

**Answer:** Change the comparison from `<` to `<=` in the binary search. This becomes the "upper bound" instead of "lower bound".

---

### Q3: Can you solve this in O(n²) with O(1) space?

**Answer:** The DP approach already uses O(n) space. You can't reduce space below O(n) for this problem because you need to track information for each position.

---

### Q4: What's the difference between LIS and patience sorting?

**Answer:** Patience sorting IS the binary search solution to LIS. It's called patience sorting because it mimics how cards are sorted in the patience (solitaire) card game.

---

## Common Pitfalls

### 1. Wrong Binary Search
**Issue**: Using upper_bound instead of lower_bound for strictly increasing.

**Solution**: Use lower_bound (first element >= num) for strictly increasing.

### 2. Not Building Sequence
**Issue**: Only getting length, not the actual sequence.

**Solution**: Track predecessors to reconstruct the actual subsequence.

### 3. Time Complexity
**Issue**: Using O(n²) DP when O(n log n) possible.

**Solution**: Use binary search optimization for large inputs.

### 4. Edge Cases
**Issue**: Not handling empty array or single element.

**Solution**: Return 0 for empty, 1 for single element.

---

## Summary

The **Longest Increasing Subsequence** problem demonstrates the **Binary Search + DP** pattern for finding optimal subsequence length.

### Key Takeaways

1. **Binary Search**: Use binary search on tails array for O(n log n)
2. **Tail Array**: Maintain smallest tail for each subsequence length
3. **Greedy**: Always keep the smallest possible tail for future extensions
4. **Optimization**: Reduce O(n²) to O(n log n)

### Pattern Summary

This problem exemplifies the **Binary Search on Derived Array** pattern, characterized by:
- Transforming the problem to search on an auxiliary array
- Maintaining monotonic properties for binary search
- Greedy optimization for subsequence problems

For more details on this pattern, see the **[DP - LIS Pattern](/patterns/dp-longest-increasing-subsequence-lis)**.

---

## Additional Resources

- [LeetCode Problem 300](https://leetcode.com/problems/longest-increasing-subsequence/) - Official problem page
- [Patience Sorting - Wikipedia](https://en.wikipedia.org/wiki/Patience_sorting) - Algorithm background
- [Pattern: DP - LIS](/patterns/dp-longest-increasing-subsequence-lis) - Comprehensive pattern guide
