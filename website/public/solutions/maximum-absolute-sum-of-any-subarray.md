# Maximum Absolute Sum of Any Subarray

## Problem Description

You are given an integer array `nums`. The **absolute sum** of a subarray `[nums[l], nums[l+1], ..., nums[r]]` is `abs(nums[l] + nums[l+1] + ... + nums[r])`.

Return the maximum absolute sum of any (possibly empty) subarray of `nums`.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, -3, 2, 3, -4]
```

**Output:**
```python
5
```

**Explanation:** The subarray `[2, 3]` has sum `5`, and `abs(5) = 5`.

### Example 2

**Input:**
```python
nums = [2, -5, 1, -4, 3, -2]
```

**Output:**
```python
8
```

**Explanation:** The subarray `[-5, 1, -4]` has sum `-8`, and `abs(-8) = 8`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Pattern: Kadane's Algorithm (Dual Variant)

This problem uses the **Kadane's Algorithm** pattern with two variants running simultaneously - one for maximum subarray sum and one for minimum subarray sum. The answer is the maximum of both absolute values.

---

## Intuition

The key insight for this problem is understanding that the maximum absolute sum must come from either:

1. **The maximum positive sum** - We want the largest positive sum (handled by standard Kadane's algorithm)
2. **The most negative sum** - We want the most negative sum (absolute value gives us a large positive number)

Since we don't know in advance whether the answer comes from a positive-sum or negative-sum subarray, we compute both simultaneously.

### Key Observations

- The absolute value of any sum is maximized when the sum itself is either maximized (large positive) or minimized (large negative)
- A subarray with maximum positive sum and a subarray with maximum negative sum are both candidates
- The absolute sum is symmetric: `abs(max_sum) >= abs(min_sum)` for some subarray
- We need both the largest positive sum AND the smallest (most negative) sum

### Algorithm Overview

1. **Track two running sums**: 
   - `current_max` for maximum subarray sum ending at current position
   - `current_min` for minimum subarray sum ending at current position

2. **Track two global results**:
   - `max_sum` - largest sum seen so far
   - `min_sum` - smallest (most negative) sum seen so far

3. **For each element**: Update both current sums and global results
4. **Return**: `max(max_sum, abs(min_sum))`

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dual Kadane's Algorithm** - Optimal solution
2. **Prefix Sum + Tracking** - Alternative approach

---

## Approach 1: Dual Kadane's Algorithm (Optimal)

### Algorithm Steps

1. Initialize running sums and global results to start fresh
2. For each number in the array:
   - Update `current_max` as max of (current number, current max + current number)
   - Update `max_sum` as max of (current max sum, current max)
   - Update `current_min` as min of (current number, current min + current number)
   - Update `min_sum` as min of (current min sum, current min)
3. Return the maximum of max_sum and absolute value of min_sum

### Why It Works

This approach works because:
- Kadane's algorithm finds the maximum subarray sum in O(n)
- Running it twice (for max and min) gives us both extremes
- The maximum absolute sum must be one of these two values

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxAbsoluteSum(self, nums: List[int]) -> int:
        """
        Find the maximum absolute sum of any subarray.
        
        Uses dual Kadane's algorithm to track both maximum
        and minimum subarray sums simultaneously.
        
        Args:
            nums: List of integers
            
        Returns:
            Maximum absolute sum of any subarray
        """
        max_sum = float('-inf')  # Maximum subarray sum
        min_sum = float('inf')   # Minimum (most negative) subarray sum
        current_max = 0          # Running max sum
        current_min = 0          # Running min sum
        
        for num in nums:
            # Update running maximum sum
            current_max = max(num, current_max + num)
            max_sum = max(max_sum, current_max)
            
            # Update running minimum sum
            current_min = min(num, current_min + num)
            min_sum = min(min_sum, current_min)
        
        # Return maximum of positive sum or absolute of negative sum
        return max(max_sum, -min_sum)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxAbsoluteSum(vector<int>& nums) {
        int maxSum = INT_MIN;    // Maximum subarray sum
        int minSum = INT_MAX;    // Minimum subarray sum
        int currentMax = 0;      // Running max sum
        int currentMin = 0;      // Running min sum
        
        for (int num : nums) {
            // Update running maximum sum
            currentMax = max(num, currentMax + num);
            maxSum = max(maxSum, currentMax);
            
            // Update running minimum sum
            currentMin = min(num, currentMin + num);
            minSum = min(minSum, currentMin);
        }
        
        // Return maximum of positive sum or absolute of negative sum
        return max(maxSum, -minSum);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxAbsoluteSum(int[] nums) {
        int maxSum = Integer.MIN_VALUE;  // Maximum subarray sum
        int minSum = Integer.MAX_VALUE;  // Minimum subarray sum
        int currentMax = 0;              // Running max sum
        int currentMin = 0;              // Running min sum
        
        for (int num : nums) {
            // Update running maximum sum
            currentMax = Math.max(num, currentMax + num);
            maxSum = Math.max(maxSum, currentMax);
            
            // Update running minimum sum
            currentMin = Math.min(num, currentMin + num);
            minSum = Math.min(minSum, currentMin);
        }
        
        // Return maximum of positive sum or absolute of negative sum
        return Math.max(maxSum, -minSum);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxAbsoluteSum = function(nums) {
    let maxSum = -Infinity;  // Maximum subarray sum
    let minSum = Infinity;   // Minimum subarray sum
    let currentMax = 0;     // Running max sum
    let currentMin = 0;     // Running min sum
    
    for (const num of nums) {
        // Update running maximum sum
        currentMax = Math.max(num, currentMax + num);
        maxSum = Math.max(maxSum, currentMax);
        
        // Update running minimum sum
        currentMin = Math.min(num, currentMin + num);
        minSum = Math.min(minSum, currentMin);
    }
    
    // Return maximum of positive sum or absolute of negative sum
    return Math.max(maxSum, -minSum);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — Single pass through the array |
| **Space** | O(1) — Only a few variables used |

---

## Approach 2: Prefix Sum + Tracking (Alternative)

### Algorithm Steps

1. Compute prefix sums for all positions
2. Track the maximum and minimum prefix sum seen so far
3. For each position, calculate the difference between current prefix and historical min/max
4. Return the maximum absolute difference

### Why It Works

The sum of any subarray [l, r] = prefix[r] - prefix[l-1]. The maximum absolute sum is the maximum difference between any two prefix sums - either max - min or we can use the current value itself.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxAbsoluteSum(self, nums: List[int]) -> int:
        """Alternative: Prefix sum approach."""
        prefix = 0
        max_prefix = float('-inf')
        min_prefix = float('inf')
        max_val = 0  # Track single element max
        
        for num in nums:
            prefix += num
            max_prefix = max(max_prefix, prefix)
            min_prefix = min(min_prefix, prefix)
            max_val = max(max_val, abs(num))
        
        return max(max_prefix - min_prefix, max_val)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxAbsoluteSum(vector<int>& nums) {
        int prefix = 0;
        int maxPrefix = INT_MIN;
        int minPrefix = INT_MAX;
        int maxVal = 0;
        
        for (int num : nums) {
            prefix += num;
            maxPrefix = max(maxPrefix, prefix);
            minPrefix = min(minPrefix, prefix);
            maxVal = max(maxVal, abs(num));
        }
        
        return max(maxPrefix - minPrefix, maxVal);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxAbsoluteSum(int[] nums) {
        int prefix = 0;
        int maxPrefix = Integer.MIN_VALUE;
        int minPrefix = Integer.MAX_VALUE;
        int maxVal = 0;
        
        for (int num : nums) {
            prefix += num;
            maxPrefix = Math.max(maxPrefix, prefix);
            minPrefix = Math.min(minPrefix, prefix);
            maxVal = Math.max(maxVal, Math.abs(num));
        }
        
        return Math.max(maxPrefix - minPrefix, maxVal);
    }
}
```

<!-- slide -->
```javascript
var maxAbsoluteSum = function(nums) {
    let prefix = 0;
    let maxPrefix = -Infinity;
    let minPrefix = Infinity;
    let maxVal = 0;
    
    for (const num of nums) {
        prefix += num;
        maxPrefix = Math.max(maxPrefix, prefix);
        minPrefix = Math.min(minPrefix, prefix);
        maxVal = Math.max(maxVal, Math.abs(num));
    }
    
    return Math.max(maxPrefix - minPrefix, maxVal);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — Single pass |
| **Space** | O(1) — No extra space needed |

---

## Comparison of Approaches

| Aspect | Dual Kadane | Prefix Sum + Tracking |
|--------|-------------|----------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Use Approach 1 (Dual Kadane) - it's more intuitive and directly follows the problem's structure.

---

## Related Problems

Based on similar themes (Kadane's algorithm, subarray sums):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Classic Kadane's problem |
| Maximum Sum Circular Subarray | [Link](https://leetcode.com/problems/maximum-sum-circular-subarray/) | Kadane with wraparound |
| Subarray Sum Equals K | [Link](https://leetcode.com/problems/subarray-sum-equals-k/) | Prefix sum approach |
| Minimum Subarray Sum | [Link](https://leetcode.com/problems/minimum-subarray-sum/) | Minimum subarray sum |
| Maximum Subarray Sum After One Operation | [Link](https://leetcode.com/problems/maximum-subarray-sum-after-one-operation/) | Modified Kadane |

### Pattern Reference

For more detailed explanations of the Kadane's algorithm pattern, see:
- **[Kadane's Algorithm Pattern](/patterns/kadane-algorithm)**
- **[Sliding Window Pattern](/patterns/sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximum Absolute Sum - LeetCode 1749](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Kadane's Algorithm Explained](https://www.youtube.com/watch?v=example)** - Understanding the algorithm
3. **[Dual Kadane's Technique](https://www.youtube.com/watch?v=example)** - Both max and min

### Related Concepts

- **[Kadane's Algorithm](https://www.youtube.com/watch?v=example)** - Classic maximum subarray
- **[Prefix Sum](https://www.youtube.com/watch?v.example)** - Alternative approach

---

## Follow-up Questions

### Q1: How would you modify the solution to return the actual subarray that gives the maximum absolute sum?

**Answer:** You'd need to track the start and end indices along with the sums. Store the indices when updating max_sum or min_sum, then return the corresponding subarray.

---

### Q2: What if you needed the maximum absolute sum of a subarray of length at least k?

**Answer:** Modify Kadane's algorithm to only consider subarrays of length >= k. You can use a sliding window approach or maintain a queue of the minimum prefix sum in the last k-1 positions.

---

### Q3: Can you solve this problem using divide and conquer?

**Answer:** Yes, you can use a divide-and-conquer approach similar to maximum subarray, but you need to track both maximum and minimum sums in each segment and combine them properly.

---

### Q4: How would you handle this if the array was circular (wrapping around)?

**Answer:** For a circular array, you'd need to consider both:
1. Non-wrapping subarrays (standard Kadane)
2. Wrapping subarrays (use total sum - minimum subarray sum)

The answer is max(standard_max, abs(total_sum - min_subarray_sum)).

---

### Q5: What if nums could be very large (e.g., up to 10^9)?

**Answer:** The algorithm still works since we're just comparing integers. The only concern would be integer overflow in languages like C++/Java, which you'd handle by using larger data types (long long in C++, long in Java).

---

## Common Pitfalls

### 1. Not Handling Empty Subarray
**Issue**: The problem allows empty subarray but we need to ensure we return 0 in that case.

**Solution**: The algorithm naturally handles this since max_sum starts negative and min_sum starts positive.

### 2. Confusing Current and Global Tracking
**Issue**: Need separate variables for running sum (current) and global maximum/minimum.

**Solution**: Use distinct variables: `current_max`/`current_min` for running sums and `max_sum`/`min_sum` for global results.

### 3. Initial Values
**Issue**: Using incorrect initial values can cause wrong results.

**Solution**: Use `float('-inf')` for max and `float('inf')` for min to handle negative numbers correctly. In C++, use `INT_MIN` and `INT_MAX`.

### 4. Return Value
**Issue**: Forgetting to take absolute value of min_sum.

**Solution**: Return `max(max_sum, -min_sum)` - the negative of min_sum gives us its absolute value.

### 5. Single Element Array
**Issue**: Not handling arrays of length 1 correctly.

**Solution**: The algorithm works for length 1 since the first element updates both max and min.

---

## Summary

The **Maximum Absolute Sum of Any Subarray** problem demonstrates an elegant application of **Kadane's Algorithm** run twice - once for maximum and once for minimum. The key insight is that the maximum absolute sum must come from either the maximum positive sum or the most negative sum (whose absolute value is large).

Key takeaways:
1. Run Kadane's algorithm twice: once maximizing, once minimizing
2. Track both running sums and global results separately
3. Return max(max_sum, -min_sum)
4. Achieves O(n) time with O(1) space

This problem is essential for understanding how to adapt classic algorithms to handle both positive and negative extremes simultaneously.

### Pattern Summary

This problem exemplifies the **Dual Kadane's Algorithm** pattern, characterized by:
- Running two variants of an algorithm simultaneously
- Tracking both maximum and minimum values
- Combining results at the end
- O(n) time with O(1) space

For more details on this pattern and its variations, see the **[Kadane's Algorithm Pattern](/patterns/kadane-algorithm)**.

---

## Additional Resources

- [LeetCode Problem 1749](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) - Official problem page
- [Kadane's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kadanes-algorithm/) - Detailed explanation
- [Maximum Subarray - Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem) - Theory and history
- [Pattern: Kadane's Algorithm](/patterns/kadane-algorithm) - Comprehensive pattern guide
