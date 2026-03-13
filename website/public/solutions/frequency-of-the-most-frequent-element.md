# Frequency Of The Most Frequent Element

## Problem Description

The frequency of an element is the number of times it occurs in an array.
You are given an integer array nums and an integer k. In one operation, you can choose an index of nums and increment the element at that index by 1.
Return the maximum possible frequency of an element after performing at most k operations.

**LeetCode Link:** [Frequency of the Most Frequent Element - LeetCode 1838](https://leetcode.com/problems/frequency-of-the-most-frequent-element/)

---

## Examples

### Example 1:

**Input:** nums = [1,2,4], k = 5

**Output:** 3

**Explanation:** Increment the first element three times and the second element two times to make nums = [4,4,4]. 4 has a frequency of 3.

### Example 2:

**Input:** nums = [1,4,8,13], k = 5

**Output:** 2

**Explanation:** There are multiple optimal solutions:
- Increment the first element three times to make nums = [4,4,8,13]. 4 has a frequency of 2.
- Increment the second element four times to make nums = [1,8,8,13]. 8 has a frequency of 2.
- Increment the third element five times to make nums = [1,4,13,13]. 13 has a frequency of 2.

### Example 3:

**Input:** nums = [3,9,6], k = 2

**Output:** 1

---

## Constraints

- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^5
- 1 <= k <= 10^5

---

## Pattern: Sliding Window with Prefix Sum

This problem uses the **Sliding Window** pattern with prefix sum for efficient range calculations. The window expands to include more elements and shrinks when the cost to make all elements equal exceeds k operations.

### Core Concept

- **Sort First**: Sorting allows us to consider contiguous elements that can be made equal
- **Target = Rightmost**: To maximize frequency, always try to raise smaller elements to match the largest in window
- **Cost Formula**: Cost = `count × target - sum(target and below)`
- **Window Shrinks When Needed**: If cost > k, move left pointer to reduce window

### When to Use This Pattern

This pattern is applicable when:
1. Finding maximum subarray with constraint
2. Problems involving making elements equal with limited operations
3. Array problems with sorted input

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Two Pointers | Similar technique |
| Prefix Sum | For efficient range calculations |
| Sliding Window | Core technique |

### Pattern Summary

This problem exemplifies **Sliding Window with Cost Calculation**, characterized by:
- Sorting first for contiguous optimal subarray
- Using prefix sum for O(1) range sum
- Cost-based window adjustment

---

## Intuition

The key insight is using a **sliding window** after sorting. To maximize frequency, we should make elements equal to the largest element in our window.

### Key Observations

1. **Sort First**: Sorting allows us to consider contiguous elements that can be made equal
2. **Target = Rightmost**: To maximize frequency, always try to raise smaller elements to match the largest in window
3. **Cost Formula**: Cost = `count × target - sum(target and below)`
4. **Window Shrinks When Needed**: If cost > k, move left pointer to reduce window

### Why Sliding Window Works

After sorting, any optimal solution consists of a contiguous subarray that we raise to match its maximum. We slide through the array, maintaining a window where the cost to raise all elements to the rightmost element is ≤ k.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window with Prefix Sum** - Using prefix sum for O(1) range calculation
2. **Sliding Window without Prefix Sum** - Simplified version

---

## Approach 1: Sliding Window with Prefix Sum (Optimal)

### Algorithm Steps

1. Sort the array
2. Build prefix sum array for O(1) range sum calculation
3. Use sliding window:
   - For each right pointer, calculate cost to raise all elements in [left, right] to nums[right]
   - Cost = (right - left + 1) * nums[right] - sum(left to right)
   - If cost > k, move left pointer
   - Track maximum window size

### Why It Works

The prefix sum allows O(1) calculation of the sum of any subarray. By computing the cost in O(1), we achieve O(n) sliding window after O(n log n) sorting.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int) -> int:
        """
        Find maximum frequency using sliding window with prefix sum.
        
        Args:
            nums: Input array
            k: Maximum number of operations allowed
            
        Returns:
            Maximum possible frequency
        """
        # Sort the array
        nums.sort()
        
        # Build prefix sum
        prefix = [0]
        for num in nums:
            prefix.append(prefix[-1] + num)
        
        left = 0
        max_freq = 1
        
        for right in range(len(nums)):
            # Calculate cost to make all elements in [left, right] equal to nums[right]
            # Cost = (count) * target - sum
            count = right - left + 1
            target = nums[right]
            current_sum = prefix[right + 1] - prefix[left]
            cost = count * target - current_sum
            
            # Shrink window if cost exceeds k
            while cost > k and left <= right:
                left += 1
                count = right - left + 1
                current_sum = prefix[right + 1] - prefix[left]
                cost = count * target - current_sum
            
            # Update maximum frequency
            max_freq = max(max_freq, right - left + 1)
        
        return max_freq
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxFrequency(vector<int>& nums, long long k) {
        // Sort the array
        sort(nums.begin(), nums.end());
        
        // Build prefix sum
        vector<long long> prefix(nums.size() + 1, 0);
        for (int i = 0; i < nums.size(); i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int left = 0;
        int maxFreq = 1;
        
        for (int right = 0; right < nums.size(); right++) {
            // Calculate cost
            long long count = right - left + 1;
            long long target = nums[right];
            long long currentSum = prefix[right + 1] - prefix[left];
            long long cost = count * target - currentSum;
            
            // Shrink window if cost exceeds k
            while (cost > k && left <= right) {
                left++;
                count = right - left + 1;
                currentSum = prefix[right + 1] - prefix[left];
                cost = count * target - currentSum;
            }
            
            // Update maximum
            maxFreq = max(maxFreq, right - left + 1);
        }
        
        return maxFreq;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxFrequency(int[] nums, long k) {
        // Sort the array
        Arrays.sort(nums);
        
        // Build prefix sum
        long[] prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int left = 0;
        int maxFreq = 1;
        
        for (int right = 0; right < nums.length; right++) {
            // Calculate cost
            long count = right - left + 1;
            long target = nums[right];
            long currentSum = prefix[right + 1] - prefix[left];
            long cost = count * target - currentSum;
            
            // Shrink window if cost exceeds k
            while (cost > k && left <= right) {
                left++;
                count = right - left + 1;
                currentSum = prefix[right + 1] - prefix[left];
                cost = count * target - currentSum;
            }
            
            // Update maximum
            maxFreq = Math.max(maxFreq, right - left + 1);
        }
        
        return maxFreq;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxFrequency = function(nums, k) {
    // Sort the array
    nums.sort((a, b) => a - b);
    
    // Build prefix sum
    const prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    let left = 0;
    let maxFreq = 1;
    
    for (let right = 0; right < nums.length; right++) {
        // Calculate cost
        const count = right - left + 1;
        const target = nums[right];
        const currentSum = prefix[right + 1] - prefix[left];
        let cost = count * target - currentSum;
        
        // Shrink window if cost exceeds k
        while (cost > k && left <= right) {
            left++;
            const newCount = right - left + 1;
            const newSum = prefix[right + 1] - prefix[left];
            cost = newCount * target - newSum;
        }
        
        // Update maximum
        maxFreq = Math.max(maxFreq, right - left + 1);
    }
    
    return maxFreq;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) for sorting + O(n) for sliding window |
| **Space** | O(n) for prefix sum |

---

## Approach 2: Sliding Window without Prefix Sum

### Algorithm Steps

1. Sort the array
2. Use two pointers without prefix sum
3. For each right pointer, calculate cost incrementally as we move left

### Why It Works

This approach avoids storing the prefix sum array by calculating the cost incrementally. However, it has similar time complexity.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int) -> int:
        """Simplified sliding window without prefix sum."""
        nums.sort()
        
        left = 0
        max_freq = 1
        total_increase = 0
        
        for right in range(1, len(nums)):
            # Calculate the increase needed to match nums[right]
            diff = nums[right] - nums[right - 1]
            total_increase += diff * (right - left)
            
            # Shrink window if needed
            while total_increase > k:
                total_increase -= (nums[right] - nums[left])
                left += 1
            
            max_freq = max(max_freq, right - left + 1)
        
        return max_freq
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxFrequency(vector<int>& nums, long long k) {
        sort(nums.begin(), nums.end());
        
        int left = 0;
        int maxFreq = 1;
        long long totalIncrease = 0;
        
        for (int right = 1; right < nums.size(); right++) {
            long long diff = nums[right] - nums[right - 1];
            totalIncrease += diff * (right - left);
            
            while (totalIncrease > k) {
                totalIncrease -= (nums[right] - nums[left]);
                left++;
            }
            
            maxFreq = max(maxFreq, right - left + 1);
        }
        
        return maxFreq;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxFrequency(int[] nums, long k) {
        Arrays.sort(nums);
        
        int left = 0;
        int maxFreq = 1;
        long totalIncrease = 0;
        
        for (int right = 1; right < nums.length; right++) {
            long diff = nums[right] - nums[right - 1];
            totalIncrease += diff * (right - left);
            
            while (totalIncrease > k) {
                totalIncrease -= (nums[right] - nums[left]);
                left++;
            }
            
            maxFreq = Math.max(maxFreq, right - left + 1);
        }
        
        return maxFreq;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxFrequency = function(nums, k) {
    nums.sort((a, b) => a - b);
    
    let left = 0;
    let maxFreq = 1;
    let totalIncrease = 0;
    
    for (let right = 1; right < nums.length; right++) {
        const diff = nums[right] - nums[right - 1];
        totalIncrease += diff * (right - left);
        
        while (totalIncrease > k) {
            totalIncrease -= (nums[right] - nums[left]);
            left++;
        }
        
        maxFreq = Math.max(maxFreq, right - left + 1);
    }
    
    return maxFreq;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Prefix Sum | Without Prefix Sum |
|--------|------------|-------------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Clearer | More complex |
| **Recommended** | ✅ | For space constraints |

**Best Approach:** Use Approach 1 (Prefix Sum) for clarity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Sliding Window, Prefix Sum, Array Manipulation

### Learning Outcomes

1. **Sliding Window**: Master the two-pointer sliding window technique
2. **Cost Calculation**: Learn to compute transformation costs efficiently
3. **Prefix Sum**: Understand prefix sum for O(1) range queries

---

## Related Problems

Based on similar themes (Sliding Window):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Number of Points | [Link](https://leetcode.com/problems/maximum-number-of-points-with-cost/) | Similar cost calculation |
| Longest Subarray | [Link](https://leetcode.com/problems/longest-subarray-with-ones-after-replacement/) | Sliding window |
| Min Size Subarray Sum | [Link](https://leetcode.com/problems/minimum-size-subarray-sum/) | Sliding window variant |

### Pattern Reference

For more detailed explanations, see:
- **[Sliding Window](/patterns/sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Max Frequency](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Sliding Window Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Window technique
3. **[Prefix Sum](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Prefix sum explanation

---

## Follow-up Questions

### Q1: How would you modify if you could also decrement elements?

**Answer:** This becomes a different problem. You would need to find a target value that minimizes operations on both sides.

---

### Q2: What if k is very large (unlimited)?

**Answer:** If k >= max(nums) - min(nums), all elements can be made equal to max, so answer = n.

---

### Q3: Can you solve this without sorting?

**Answer:** Sorting is essential because the optimal solution requires contiguous elements after transformation.

---

## Common Pitfalls

### 1. Cost calculation errors
**Issue:** The cost formula `(right - left + 1) * nums[right] - (prefix[right + 1] - prefix[left])` must be correct.

**Solution:** Double-check the formula and test with examples.

### 2. Not sorting first
**Issue:** The array must be sorted for this approach to work.

**Solution:** Always sort first.

### 3. Off-by-one in prefix sum
**Issue:** Remember prefix array has n+1 elements.

**Solution:** Use prefix[right+1] - prefix[left] for inclusive range.

### 4. Empty window handling
**Issue:** Ensure left doesn't exceed right when calculating cost.

**Solution:** Initialize left = 0 and ensure window is valid.

---

## Summary

The **Frequency of the Most Frequent Element** problem demonstrates **Sliding Window with Prefix Sum**:

- **Approach**: Sort + Sliding Window
- **Target**: Always raise elements to match rightmost (largest) in window
- **Time**: O(n log n) for sorting, O(n) for window
- **Space**: O(n) for prefix sum

Key insight: The optimal subarray is always contiguous after sorting, and we use prefix sum to quickly calculate the cost.

### Pattern Summary

This problem exemplifies **Sliding Window with Cost Calculation**, characterized by:
- Sorting first for contiguous optimal subarray
- Using prefix sum for O(1) range sum
- Cost-based window adjustment
- Two-pointer technique

For more details on this pattern, see the **[Sliding Window](/patterns/sliding-window)** pattern.

---

## Additional Resources

- [LeetCode Problem 1838](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) - Official problem page
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Window technique
- [Prefix Sum - Wikipedia](https://en.wikipedia.org/wiki/Prefix_sum) - Prefix sum theory
- [Pattern: Sliding Window](/patterns/sliding-window) - Comprehensive pattern guide
