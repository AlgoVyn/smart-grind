# Maximum Sum Circular Subarray

## Pattern:

Kadane's Algorithm (Modified)

This problem uses a **modified Kadane's Algorithm** to handle the circular aspect. There are two cases:
1. **Non-wrapping subarray**: Standard Kadane's algorithm
2. **Wrapping subarray**: Total sum - minimum subarray sum (the part to exclude)

## Common Pitfalls

- **Forgetting the all-negative edge case**: When all elements are negative, `total - min_kadane = 0`, which is invalid. Must return `max_kadane` (the largest negative number).
- **Confusing the formula**: Maximum wrapping sum = `total - minimum subarray sum`, not `total + minimum subarray sum`.
- **Single element array**: Must handle n=1 separately to avoid incorrect results.
- **Integer overflow**: Use appropriate types for large sums (up to 3×10^4 × 3×10^4).

---

## Problem Description

Given a circular integer array `nums` of length `n`, return the maximum possible sum of a non-empty subarray of `nums`.

A circular array means the end of the array connects to the beginning Formally, the of the array. next element of `nums[i]` is `nums[(i + 1) % n]` and the previous element of `nums[i]` is `nums[(i - 1 + n) % n]`.

A subarray may only include each element of the fixed buffer `nums` at most once. Formally, for a subarray `nums[i], nums[i + 1], ..., nums[j]`, there does not exist `i <= k1, k2 <= j` with `k1 % n == k2 % n`.

## Examples

### Example

**Input:** `nums = [1,-2,3,-2]`

**Output:** `3`

**Explanation:** Subarray `[3]` has maximum sum `3`.

### Example 2

**Input:** `nums = [5,-3,5]`

**Output:** `10`

**Explanation:** Subarray `[5,5]` has maximum sum `5 + 5 = 10`.

### Example 3

**Input:** `nums = [-3,-2,-3]`

**Output:** `-2`

**Explanation:** Subarray `[-2]` has maximum sum `-2`.

## Constraints

- `n == nums.length`
- `1 <= n <= 3 * 10^4`
- `-3 * 10^4 <= nums[i] <= 3 * 10^4`

---

## Intuition

The key insight is that there are two cases for the maximum subarray sum in a circular array:

### Case 1: Non-wrapping subarray

The maximum subarray doesn't wrap around the end. This is the standard Kadane's algorithm case.

### Case 2: Wrapping subarray

The maximum subarray wraps around, meaning it consists of:
1. A suffix of the array (ending at the last element)
2. A prefix of the array (starting at the first element)

To find this, we can find the **minimum subarray sum** (which represents the part we should exclude), then:
- Maximum wrapping sum = Total sum - Minimum subarray sum

### Edge Case: All negative numbers

If all numbers are negative, the minimum subarray sum would be the total sum, making `total - min = 0`. But we should return the largest negative number (Kadane's result), not 0.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Kadane's Algorithm with Modification** - Optimal O(n) solution
2. **Prefix-Suffix Approach** - Alternative O(n) solution
3. **Brute Force with Optimization** - O(n²) but educational

---

## Approach 1: Kadane's Algorithm with Modification (Optimal)

This is the classic solution using Kadane's algorithm twice - once for maximum, once for minimum.

### Algorithm Steps

1. Compute `max_kadane` = maximum subarray sum using Kadane's algorithm
2. Compute `total` = sum of all elements
3. Compute `min_kadane` = minimum subarray sum using Kadane on negated array
4. Compute `max_wrap` = total - min_kadane
5. Handle edge case: if max_wrap == 0 (all negative), return max_kadane
6. Return max(max_kadane, max_wrap)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        def kadane(arr: List[int]) -> int:
            """Standard Kadane's algorithm for max subarray sum"""
            max_sum = float('-inf')
            current = 0
            for num in arr:
                current = max(num, current + num)
                max_sum = max(max_sum, current)
            return max_sum
        
        total = sum(nums)
        max_kadane = kadane(nums)
        
        # Minimum subarray sum (using Kadane on negated array)
        min_kadane = kadane([-x for x in nums])
        
        # Maximum wrapping subarray
        max_wrap = total + min_kadane
        
        # Handle all-negative case
        if max_wrap == 0:
            return max_kadane
        
        return max(max_kadane, max_wrap)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        auto kadane = [&](const vector<int>& arr) -> int {
            int maxSum = INT_MIN;
            int current = 0;
            for (int num : arr) {
                current = max(num, current + num);
                maxSum = max(maxSum, current);
            }
            return maxSum;
        };
        
        int total = 0;
        for (int num : nums) total += num;
        
        int maxKadane = kadane(nums);
        
        // Minimum subarray sum
        vector<int> negated(nums.size());
        for (size_t i = 0; i < nums.size(); i++) {
            negated[i] = -nums[i];
        }
        int minKadane = kadane(negated);
        
        int maxWrap = total + minKadane;
        
        // All negative case
        if (maxWrap == 0) {
            return maxKadane;
        }
        
        return max(maxKadane, maxWrap);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int total = 0;
        int maxKadane = Integer.MIN_VALUE;
        int currentMax = 0;
        
        int minKadane = Integer.MAX_VALUE;
        int currentMin = 0;
        
        for (int num : nums) {
            total += num;
            
            // Max subarray (Kadane)
            currentMax = Math.max(num, currentMax + num);
            maxKadane = Math.max(maxKadane, currentMax);
            
            // Min subarray (Kadane on negated)
            currentMin = Math.min(num, currentMin + num);
            minKadane = Math.min(minKadane, currentMin);
        }
        
        int maxWrap = total - minKadane;
        
        // All negative case
        if (maxWrap == 0) {
            return maxKadane;
        }
        
        return Math.max(maxKadane, maxWrap);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubarraySumCircular = function(nums) {
    let total = 0;
    let maxKadane = -Infinity;
    let currentMax = 0;
    
    let minKadane = Infinity;
    let currentMin = 0;
    
    for (const num of nums) {
        total += num;
        
        // Max subarray (Kadane)
        currentMax = Math.max(num, currentMax + num);
        maxKadane = Math.max(maxKadane, currentMax);
        
        // Min subarray (Kadane on negated)
        currentMin = Math.min(num, currentMin + num);
        minKadane = Math.min(minKadane, currentMin);
    }
    
    const maxWrap = total - minKadane;
    
    // All negative case
    if (maxWrap === 0) {
        return maxKadane;
    }
    
    return Math.max(maxKadane, maxWrap);
};
```
````

### Step-by-Step Example

For `nums = [5, -3, 5]`:

- total = 5 + (-3) + 5 = 7
- max_kadane = 5 + (-3) + 5 = 7 (non-wrapping case finds [5, -3, 5])
- min_kadane = -3 (minimum subarray is [-3])
- max_wrap = 7 - (-3) = 10 (wrapping case finds [5] + [5] = 10)
- Return max(7, 10) = 10 ✓

For `nums = [-3, -2, -3]`:

- total = -8
- max_kadane = -2 (maximum is just [-2])
- min_kadane = -8 (minimum is the whole array)
- max_wrap = -8 - (-8) = 0 (but this is invalid!)
- Since max_wrap == 0, return max_kadane = -2 ✓

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` - Single pass for both max and min |
| **Space** | `O(1)` - Only a few variables |

---

## Approach 2: Prefix-Suffix Approach

An alternative approach that tracks maximum prefix and suffix sums.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        n = len(nums)
        
        # Edge case: single element
        if n == 1:
            return nums[0]
        
        # Compute prefix sums
        prefix_sum = [0] * (n + 1)
        for i in range(n):
            prefix_sum[i + 1] = prefix_sum[i] + nums[i]
        
        # Total sum
        total = prefix_sum[n]
        
        # Max subarray using Kadane (non-wrapping)
        max_kadane = float('-inf')
        current = 0
        for num in nums:
            current = max(num, current + num)
            max_kadane = max(max_kadane, current)
        
        # For wrapping case: find max prefix + max suffix
        # max suffix = max(prefix_sum[n] - prefix_sum[i]) for i in [0, n-1]
        # max prefix = max(prefix_sum[i]) for i in [1, n-1]
        
        max_prefix = max(prefix_sum[1:n])  # Max prefix (excluding full array)
        max_suffix = max(prefix_sum[n] - prefix_sum[i] for i in range(1, n))
        
        max_wrap = max_prefix + max_suffix
        
        # Handle all negative
        if max_wrap == 0:
            return max_kadane
        
        return max(max_kadane, max_wrap)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        
        int total = 0;
        int maxKadane = INT_MIN;
        int currentMax = 0;
        
        int minKadane = INT_MAX;
        int currentMin = 0;
        
        for (int num : nums) {
            total += num;
            
            currentMax = max(num, currentMax + num);
            maxKadane = max(maxKadane, currentMax);
            
            currentMin = min(num, currentMin + num);
            minKadane = min(minKadane, currentMin);
        }
        
        int maxWrap = total - minKadane;
        
        if (maxWrap == 0) return maxKadane;
        
        return max(maxKadane, maxWrap);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        
        int total = nums[0];
        int maxKadane = nums[0];
        int currentMax = nums[0];
        
        int minKadane = nums[0];
        int currentMin = nums[0];
        
        for (int i = 1; i < n; i++) {
            int num = nums[i];
            total += num;
            
            currentMax = Math.max(num, currentMax + num);
            maxKadane = Math.max(maxKadane, currentMax);
            
            currentMin = Math.min(num, currentMin + num);
            minKadane = Math.min(minKadane, currentMin);
        }
        
        int maxWrap = total - minKadane;
        
        if (maxWrap == 0) return maxKadane;
        
        return Math.max(maxKadane, maxWrap);
    }
}
```
<!-- slide -->
```javascript
var maxSubarraySumCircular = function(nums) {
    const n = nums.length;
    if (n === 1) return nums[0];
    
    let total = nums[0];
    let maxKadane = nums[0];
    let currentMax = nums[0];
    
    let minKadane = nums[0];
    let currentMin = nums[0];
    
    for (let i = 1; i < n; i++) {
        const num = nums[i];
        total += num;
        
        currentMax = Math.max(num, currentMax + num);
        maxKadane = Math.max(maxKadane, currentMax);
        
        currentMin = Math.min(num, currentMin + num);
        minKadane = Math.min(minKadane, currentMin);
    }
    
    const maxWrap = total - minKadane;
    
    if (maxWrap === 0) return maxKadane;
    
    return Math.max(maxKadane, maxWrap);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` - Single pass |
| **Space** | `O(1)` - Constant extra space |

---

## Approach 3: Brute Force with Optimization

Try all possible starting points, but optimized with prefix sums.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 1:
            return nums[0]
        
        # Build extended array for easy wrapping access
        # We'll consider subarrays that can wrap
        # For each possible start, try lengths from 1 to n-1
        
        # Compute prefix sums on extended array
        extended = nums + nums[:-1]  # Length 2n-1
        prefix = [0] * (len(extended) + 1)
        for i, val in enumerate(extended):
            prefix[i + 1] = prefix[i] + val
        
        max_sum = float('-inf')
        
        # For each starting point in original array
        for start in range(n):
            # Try all possible lengths (1 to n-1)
            # Use binary search or linear scan for max in range
            # But this is O(n²) - not optimal
            pass
        
        # This approach is O(n²) - not recommended for large inputs
        # Included for educational purposes only
        return 0  # Placeholder - use Approach 1 instead
```

**Note:** This brute force approach is O(n²) and not recommended. It's included only for educational purposes. Use Approach 1 for production code.
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n²)` - Too slow for n = 30,000 |
| **Space** | `O(n)` - For extended array |

---

## Comparison of Approaches

| Aspect | Kadane Modified | Prefix-Suffix | Brute Force |
|--------|----------------|---------------|-------------|
| **Time Complexity** | O(n) | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Implementation** | Simple | Moderate | Simple |
| **Recommended** | ✅ Best | ✅ Good | ❌ No |

**Best Approach:** The modified Kadane's algorithm is the standard and optimal solution.

---

## Related Problems

### Kadane's Algorithm Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Maximum Subarray | [LeetCode 53](https://leetcode.com/problems/maximum-subarray/) | Medium |
| Maximum Subarray Sum with One Deletion | [LeetCode 1186](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/) | Medium |
| Maximum Sum Circular Subarray | [LeetCode 918](https://leetcode.com/problems/maximum-sum-circular-subarray/) | Medium |

### Circular Array Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Circular Array Loop | [LeetCode 457](https://leetcode.com/problems/circular-array-loop/) | Medium |
| Rotate Array | [LeetCode 189](https://leetcode.com/problems/rotate-array/) | Medium |

---

## Video Tutorial Links

### Kadane's Algorithm

- [Maximum Sum Circular Subarray - NeetCode](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Kadane's Algorithm - William Lin](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - Comprehensive tutorial
- [LeetCode Official Solution](https://www.youtube.com/watch?v=1L2OiLDbJ6E) - Official walkthrough

### Related Problems

- [Maximum Subarray (Kadane)](https://www.youtube.com/watch?v=hmV1s1q5k9I) - Foundation for this problem
- [Circular Array Problems](https://www.youtube.com/watch?v=7j9lq2eMgvc) - Common patterns

---

## Follow-up Questions

### Q1: How does this differ from the standard Maximum Subarray problem?

**Answer:** The standard problem (LeetCode 53) doesn't allow wrapping. This problem adds the circular aspect, allowing subarrays that wrap around the end to the beginning.

---

### Q2: Why do we need to handle the all-negative case separately?

**Answer:** When all elements are negative, `total - min_kadane = total - total = 0`, which is incorrect (0 is not a valid subarray sum since we need non-empty). We return `max_kadane` which gives the largest (least negative) element.

---

### Q3: Can you solve this using divide and conquer?

**Answer:** Yes, you can use a modified divide-and-conquer approach where you split the array into two halves and consider three cases: max in left half, max in right half, and max that wraps across the boundary. This gives O(n log n) time.

---

### Q4: What is the space complexity of the optimal solution?

**Answer:** O(1). We only use a constant number of variables regardless of input size.

---

### Q5: How would you modify to find the minimum circular subarray sum?

**Answer:** Simply swap the roles: find the minimum subarray sum using Kadane, and the maximum wrapping minimum would be `total - max_kadane`. Handle the all-positive case similarly.

---

### Q6: Can this be extended to find the subarray indices?

**Answer:** Yes, you can track the start and end indices during Kadane's algorithm. For the wrapping case, find where the minimum subarray is and use everything except that portion.

---

### Q7: How would you handle 2D circular arrays?

**Answer:** For 2D, you'd need to extend to circular convolution or use 2D Kadane variants. This becomes significantly more complex and is beyond the scope of this problem.

---

### Q8: What edge cases should be tested?

**Answer:**
- Single element array
- All positive numbers
- All negative numbers
- Mixed positive and negative
- Two elements
- Large array (30,000 elements)
- Maximum absolute values (30,000)

---

## Summary

The **Maximum Sum Circular Subarray** problem demonstrates the power of **Kadane's Algorithm** with a clever modification:

- **Two Cases**: Non-wrapping (standard Kadane) and wrapping (total - min subarray)
- **Edge Case**: Handle all-negative arrays separately
- **Time**: O(n) - single pass
- **Space**: O(1) - constant extra space

Key takeaways:
1. The maximum wrapping subarray = total - minimum subarray
2. Kadane's algorithm finds both max and min subarrays efficiently
3. The all-negative edge case is crucial
4. This pattern extends to other circular array problems

This is a classic problem that shows how a simple algorithm can be modified to handle additional constraints.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-sum-circular-subarray/discuss/) - Community solutions
- [Kadane's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kadanes-algorithm/) - Comprehensive guide
- [Circular Arrays - CP Algorithms](https://cp-algorithms.com/) - Additional patterns
