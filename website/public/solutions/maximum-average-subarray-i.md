# Maximum Average Subarray I

## Problem Description

You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value.

Any answer with a calculation error less than `10^-5` will be accepted.

**Link to problem:** [Maximum Average Subarray I - LeetCode 643](https://leetcode.com/problems/maximum-average-subarray-i/)

---

## Examples

### Example

| Input | Output |
|-------|--------|
| `nums = [1, 12, -5, -6, 50, 3]`<br>`k = 4` | `12.75000` |

**Explanation:** Maximum average is `(12 + (-5) + (-6) + 50) / 4 = 51 / 4 = 12.75`

### Example 2

| Input | Output |
|-------|--------|
| `nums = [5]`<br>`k = 1` | `5.00000` |

---

## Constraints

- `n == nums.length`
- `1 <= k <= n <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Pattern: Sliding Window

This problem demonstrates the **Sliding Window** pattern, which is used to find the sum or average of a fixed-size subarray in O(n) time.

### Core Concept

1. Compute sum of first k elements
2. Slide window by removing leftmost and adding next element
3. Track maximum sum during traversal

---

## Intuition

### Why Sliding Window Works

- For subarrays of fixed length k, consecutive sums differ by only two elements
- Instead of recomputing sum from scratch O(k), update in O(1)
- This reduces total time from O(nk) to O(n)

### Visual Example

```
nums = [1, 12, -5, -6, 50, 3], k = 4

Window positions:
[1, 12, -5, -6] → sum = 2
[12, -5, -6, 50] → sum = 51  ← max
[-5, -6, 50, 3] → sum = 42

Maximum sum = 51
Maximum average = 51 / 4 = 12.75
```

---

## Multiple Approaches with Code

## Approach 1: Sliding Window (Optimal)

This is the standard O(n) solution using a sliding window.

````carousel
```python
from typing import List

class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> float:
        """
        Find maximum average using sliding window.
        
        Args:
            nums: Input array
            k: Window size
            
        Returns:
            Maximum average of any subarray of length k
        """
        # Calculate sum of first k elements
        current_sum = sum(nums[:k])
        max_sum = current_sum
        
        # Slide the window
        for i in range(k, len(nums)):
            # Add new element, remove element leaving window
            current_sum += nums[i] - nums[i - k]
            max_sum = max(max_sum, current_sum)
        
        return max_sum / k
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        // Calculate sum of first k elements
        double current_sum = 0;
        for (int i = 0; i < k; i++) {
            current_sum += nums[i];
        }
        double max_sum = current_sum;
        
        // Slide the window
        for (int i = k; i < nums.size(); i++) {
            current_sum += nums[i] - nums[i - k];
            max_sum = max(max_sum, current_sum);
        }
        
        return max_sum / k;
    }
};
```
<!-- slide -->
```java
class Solution {
    public double findMaxAverage(int[] nums, int k) {
        // Calculate sum of first k elements
        double current_sum = 0;
        for (int i = 0; i < k; i++) {
            current_sum += nums[i];
        }
        double max_sum = current_sum;
        
        // Slide the window
        for (int i = k; i < nums.length; i++) {
            current_sum += nums[i] - nums[i - k];
            max_sum = Math.max(max_sum, current_sum);
        }
        
        return max_sum / k;
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
var findMaxAverage = function(nums, k) {
    // Calculate sum of first k elements
    let current_sum = 0;
    for (let i = 0; i < k; i++) {
        current_sum += nums[i];
    }
    let max_sum = current_sum;
    
    // Slide the window
    for (let i = k; i < nums.length; i++) {
        current_sum += nums[i] - nums[i - k];
        max_sum = Math.max(max_sum, current_sum);
    }
    
    return max_sum / k;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass through array |
| **Space** | O(1) - only a few variables |

---

## Approach 2: Prefix Sum

Using prefix sum array to compute any subarray sum in O(1).

````carousel
```python
from typing import List

class Solution:
    def findMaxAverage_prefix(self, nums: List[int], k: int) -> float:
        """
        Find maximum average using prefix sums.
        """
        n = len(nums)
        
        # Build prefix sum array
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        max_avg = float('-inf')
        
        # Check all windows
        for i in range(n - k + 1):
            window_sum = prefix[i + k] - prefix[i]
            max_avg = max(max_avg, window_sum)
        
        return max_avg / k
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Build prefix sum array
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        double max_avg = INT_MIN;
        
        // Check all windows
        for (int i = 0; i <= n - k; i++) {
            int window_sum = prefix[i + k] - prefix[i];
            max_avg = max(max_avg, (double)window_sum);
        }
        
        return max_avg / k;
    }
};
```
<!-- slide -->
```java
class Solution {
    public double findMaxAverage(int[] nums, int k) {
        int n = nums.length;
        
        // Build prefix sum array
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        double max_avg = Integer.MIN_VALUE;
        
        // Check all windows
        for (int i = 0; i <= n - k; i++) {
            int window_sum = prefix[i + k] - prefix[i];
            max_avg = Math.max(max_avg, (double)window_sum);
        }
        
        return max_avg / k;
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
var findMaxAverage = function(nums, k) {
    const n = nums.length;
    
    // Build prefix sum array
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    let max_avg = -Infinity;
    
    // Check all windows
    for (let i = 0; i <= n - k; i++) {
        const window_sum = prefix[i + k] - prefix[i];
        max_avg = Math.max(max_avg, window_sum);
    }
    
    return max_avg / k;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - two passes |
| **Space** | O(n) - prefix array |

---

## Approach 3: Brute Force (Inefficient)

Compute sum for each window from scratch.

````carousel
```python
from typing import List

class Solution:
    def findMaxAverage_brute(self, nums: List[int], k: int) -> float:
        """
        Brute force - O(n*k).
        """
        max_avg = float('-inf')
        
        for i in range(len(nums) - k + 1):
            window_sum = sum(nums[i:i + k])
            max_avg = max(max_avg, window_sum)
        
        return max_avg / k
```
<!-- slide -->
```cpp
class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        double max_avg = INT_MIN;
        
        for (int i = 0; i <= nums.size() - k; i++) {
            int window_sum = 0;
            for (int j = i; j < i + k; j++) {
                window_sum += nums[j];
            }
            max_avg = max(max_avg, (double)window_sum);
        }
        
        return max_avg / k;
    }
};
```
<!-- slide -->
```java
class Solution {
    public double findMaxAverage(int[] nums, int k) {
        double max_avg = Integer.MIN_VALUE;
        
        for (int i = 0; i <= nums.length - k; i++) {
            int window_sum = 0;
            for (int j = i; j < i + k; j++) {
                window_sum += nums[j];
            }
            max_avg = Math.max(max_avg, (double)window_sum);
        }
        
        return max_avg / k;
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
var findMaxAverage = function(nums, k) {
    let max_avg = -Infinity;
    
    for (let i = 0; i <= nums.length - k; i++) {
        let window_sum = 0;
        for (let j = i; j < i + k; j++) {
            window_sum += nums[j];
        }
        max_avg = Math.max(max_avg, window_sum);
    }
    
    return max_avg / k;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n*k) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Sliding Window** | O(n) | O(1) | Best, most efficient |
| **Prefix Sum** | O(n) | O(n) | Good for multiple queries |
| **Brute Force** | O(n*k) | O(1) | Too slow for large n |

**Best Approach:** Sliding Window (Approach 1) is optimal with O(n) time and O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Apple
- **Difficulty**: Easy
- **Concepts**: Sliding window, array manipulation

### Key Insights

1. Fixed-size window sum can be updated in O(1)
2. Avoid recomputing sum for each window
3. Track max while sliding

---

## Related Problems

### Same Pattern (Sliding Window)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Maximum Sum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Medium |
| Minimum Size Subarray | [Link](https://leetcode.com/problems/minimum-size-subarray-sum/) | Medium |
| Longest Substring | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Max Consecutive Ones | [Link](https://leetcode.com/problems/max-consecutive-ones/) | Easy | Sliding window |
| Average of Subarray | [Link](https://leetcode.com/problems/maximum-average-subarray/) | Medium | Fixed window |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Maximum Average Subarray](https://www.youtube.com/watch?v=g0R0c8XaPw8)** - Clear explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=g0R0c8XaPw8)** - Official walkthrough

### Additional Resources

- **[Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/)** - Comprehensive guide

---

## Follow-up Questions

### Q1: How would you handle k = 1?

**Answer:** Return the maximum element. The sliding window still works - it just means we're taking max of individual elements.

---

### Q2: What if k equals n?

**Answer:** Return the average of all elements. Only one window exists.

---

### Q3: Can negative numbers affect the solution?

**Answer:** The algorithm handles negative numbers correctly. The sliding window still computes the sum correctly regardless of sign.

---

### Q4: How would you find the minimum average instead?

**Answer:** Replace `max` with `min` in the algorithm. Everything else stays the same.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single element (k = 1)
- All positive numbers
- All negative numbers
- Mixed positive and negative
- k equals array length

---

## Common Pitfalls

### 1. Not Handling k = n
**Issue:** When k equals n, the loop doesn't run correctly.

**Solution:** The algorithm naturally handles this case - the initial sum is the only window.

### 2. Integer Division
**Issue:** Using integer division in Python 2 or other languages.

**Solution:** Use float division `/` not integer division `//` for Python, cast to double in Java.

### 3. Off-by-One Errors
**Issue:** Wrong loop bounds.

**Solution:** Use `range(k, len(nums))` for sliding - we start comparing from index k.

---

## Summary

The **Maximum Average Subarray I** problem demonstrates:

- **Sliding Window**: O(n) solution for fixed-size subarray
- **Efficient Updates**: Adding new, removing old in O(1)
- **Pattern Recognition**: Common in array problems

Key takeaways:
1. Compute initial sum of first k elements
2. Slide window, update sum in O(1)
3. Track maximum throughout
4. Return max_sum / k

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-average-subarray-i/discuss/)
- [Pattern: Sliding Window](/patterns/sliding-window)
