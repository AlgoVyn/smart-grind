# Maximum Sum of Distinct Subarrays With Length K

## Problem Description

You are given an integer array `nums` and an integer `k`. Find the maximum subarray sum of all the subarrays of `nums` that meet the following conditions:

1. The length of the subarray is `k`
2. All the elements of the subarray are distinct

Return the maximum subarray sum of all the subarrays that meet the conditions. If no subarray meets the conditions, return `0`.

A subarray is a contiguous non-empty sequence of elements within an array.

**Link to problem:** [Maximum Sum of Distinct Subarrays With Length K - LeetCode 2552](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/)

## Constraints
- `1 <= k <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`

---

## Pattern: Sliding Window with Hash Set

This problem is a classic example of the **Sliding Window** pattern with additional tracking for distinct elements.

### Core Concept

- **Sliding Window**: Maintain a window of size k
- **Hash Set**: Track elements in current window for O(1) lookups
- **Sum Tracking**: Track sum of current window

---

## Examples

### Example

**Input:** nums = [1,5,4,2,9,9,9], k = 3

**Output:** 15

**Explanation:**
- [1,5,4] sum = 10, all distinct ✓
- [5,4,2] sum = 11, all distinct ✓
- [4,2,9] sum = 15, all distinct ✓
- [2,9,9] has duplicate 9 ✗
- [9,9,9] has duplicates ✗

Maximum sum = 15

### Example 2

**Input:** nums = [4,4,4], k = 3

**Output:** 0

**Explanation:** No valid subarray of length 3 with all distinct elements.

---

## Intuition

The key insight is to use sliding window:

1. **Initialize**: Create first window of size k
2. **Validate**: Check if all elements are distinct
3. **Slide**: Move window one step at a time
4. **Track**: Maintain set and sum for O(1) operations

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window with Set (Optimal)** - O(n) time, O(k) space
2. **Brute Force** - O(n²) time, O(1) space

---

## Approach 1: Sliding Window with Set (Optimal)

This is the most efficient approach.

### Algorithm Steps

1. Create set and calculate initial window sum
2. If all distinct, update max_sum
3. Slide window:
   - Remove left element from set and sum
   - Add right element to set and sum
   - If duplicate, shrink from left until distinct
4. Return max_sum

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def maximumSubarraySum(self, nums: List[int], k: int) -> int:
        """
        Find maximum sum of distinct subarray of length k.
        
        Args:
            nums: Input array
            k: Length of subarray
            
        Returns:
            Maximum sum or 0 if none valid
        """
        n = len(nums)
        if n < k:
            return 0
        
        window = set()
        current_sum = 0
        max_sum = 0
        
        for i in range(n):
            # Add current element
            while nums[i] in window:
                # Remove from left until distinct
                left = nums[i - len(window)]
                window.remove(left)
                current_sum -= left
            
            window.add(nums[i])
            current_sum += nums[i]
            
            # Check if window size is k
            if len(window) == k:
                max_sum = max(max_sum, current_sum)
                
                # Slide: remove leftmost element
                left = nums[i - k + 1]
                window.remove(left)
                current_sum -= left
        
        return max_sum
```

<!-- slide -->
```cpp
class Solution {
public:
    long long maximumSubarraySum(vector<int>& nums, int k) {
        int n = nums.size();
        if (n < k) return 0;
        
        unordered_set<int> window;
        long long currentSum = 0;
        long long maxSum = 0;
        
        for (int i = 0; i < n; i++) {
            // Add current element
            while (window.count(nums[i])) {
                int left = nums[i - window.size()];
                window.erase(left);
                currentSum -= left;
            }
            
            window.insert(nums[i]);
            currentSum += nums[i];
            
            // Check window size
            if (window.size() == k) {
                maxSum = max(maxSum, currentSum);
                
                // Slide
                int left = nums[i - k + 1];
                window.erase(left);
                currentSum -= left;
            }
        }
        
        return maxSum;
    }
};
```

<!-- slide -->
```java
class Solution {
    public long maximumSubarraySum(int[] nums, int k) {
        int n = nums.length;
        if (n < k) return 0;
        
        Set<Integer> window = new HashSet<>();
        long currentSum = 0;
        long maxSum = 0;
        
        for (int i = 0; i < n; i++) {
            // Add current element
            while (window.contains(nums[i])) {
                int left = nums[i - window.size()];
                window.remove(left);
                currentSum -= left;
            }
            
            window.add(nums[i]);
            currentSum += nums[i];
            
            // Check window size
            if (window.size() == k) {
                maxSum = Math.max(maxSum, currentSum);
                
                // Slide
                int left = nums[i - k + 1];
                window.remove(left);
                currentSum -= left;
            }
        }
        
        return maxSum;
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
var maximumSubarraySum = function(nums, k) {
    const n = nums.length;
    if (n < k) return 0;
    
    const window = new Set();
    let currentSum = 0;
    let maxSum = 0;
    
    for (let i = 0; i < n; i++) {
        // Add current element
        while (window.has(nums[i])) {
            const left = nums[i - window.size];
            window.delete(left);
            currentSum -= left;
        }
        
        window.add(nums[i]);
        currentSum += nums[i];
        
        // Check window size
        if (window.size === k) {
            maxSum = Math.max(maxSum, currentSum);
            
            // Slide
            const left = nums[i - k + 1];
            window.delete(left);
            currentSum -= left;
        }
    }
    
    return maxSum;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each element added and removed at most once |
| **Space** | O(k) - set stores at most k elements |

---

## Approach 2: Alternative Implementation

Using dictionary for count tracking.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumSubarraySum_v2(self, nums: List[int], k: int) -> int:
        """
        Using dictionary for frequency tracking.
        """
        n = len(nums)
        if n < k:
            return 0
        
        freq = {}
        current_sum = 0
        max_sum = 0
        
        for i in range(k):
            freq[nums[i]] = freq.get(nums[i], 0) + 1
            current_sum += nums[i]
        
        if len(freq) == k:
            max_sum = current_sum
        
        for i in range(k, n):
            # Remove leftmost
            left = nums[i - k]
            freq[left] -= 1
            if freq[left] == 0:
                del freq[left]
            current_sum -= left
            
            # Add rightmost
            right = nums[i]
            freq[right] = freq.get(right, 0) + 1
            current_sum += right
            
            if len(freq) == k:
                max_sum = max(max_sum, current_sum)
        
        return max_sum
```

<!-- slide -->
```cpp
class Solution {
public:
    long long maximumSubarraySumV2(vector<int>& nums, int k) {
        int n = nums.size();
        if (n < k) return 0;
        
        unordered_map<int, int> freq;
        long long currentSum = 0;
        long long maxSum = 0;
        
        for (int i = 0; i < k; i++) {
            freq[nums[i]]++;
            currentSum += nums[i];
        }
        
        if (freq.size() == k) maxSum = currentSum;
        
        for (int i = k; i < n; i++) {
            // Remove leftmost
            int left = nums[i - k];
            freq[left]--;
            if (freq[left] == 0) freq.erase(left);
            currentSum -= left;
            
            // Add rightmost
            int right = nums[i];
            freq[right]++;
            currentSum += right;
            
            if (freq.size() == k) {
                maxSum = max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
};
```

<!-- slide -->
```java
class Solution {
    public long maximumSubarraySumV2(int[] nums, int k) {
        int n = nums.length;
        if (n < k) return 0;
        
        Map<Integer, Integer> freq = new HashMap<>();
        long currentSum = 0;
        long maxSum = 0;
        
        for (int i = 0; i < k; i++) {
            freq.put(nums[i], freq.getOrDefault(nums[i], 0) + 1);
            currentSum += nums[i];
        }
        
        if (freq.size() == k) maxSum = currentSum;
        
        for (int i = k; i < n; i++) {
            int left = nums[i - k];
            freq.put(left, freq.get(left) - 1);
            if (freq.get(left) == 0) freq.remove(left);
            currentSum -= left;
            
            int right = nums[i];
            freq.put(right, freq.getOrDefault(right, 0) + 1);
            currentSum += right;
            
            if (freq.size() == k) {
                maxSum = Math.max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
}
```

<!-- slide -->
```javascript
var maximumSubarraySum = function(nums, k) {
    const n = nums.length;
    if (n < k) return 0;
    
    const freq = {};
    let currentSum = 0;
    let maxSum = 0;
    
    for (let i = 0; i < k; i++) {
        freq[nums[i]] = (freq[nums[i]] || 0) + 1;
        currentSum += nums[i];
    }
    
    if (Object.keys(freq).length === k) maxSum = currentSum;
    
    for (let i = k; i < n; i++) {
        const left = nums[i - k];
        freq[left]--;
        if (freq[left] === 0) delete freq[left];
        currentSum -= left;
        
        const right = nums[i];
        freq[right] = (freq[right] || 0) + 1;
        currentSum += right;
        
        if (Object.keys(freq).length === k) {
            maxSum = Math.max(maxSum, currentSum);
        }
    }
    
    return maxSum;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(k) |

---

## Comparison of Approaches

| Aspect | Sliding Window | Dictionary |
|--------|---------------|------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(k) | O(k) |
| **Implementation** | Moderate | Simple |

Both approaches are equally efficient. Choose based on preference.

---

## Why Sliding Window Works

The sliding window approach works because:

1. **Efficient Tracking**: Set/dict provides O(1) duplicate detection
2. **Single Pass**: Each element is processed at most twice
3. **Window Size Fixed**: Easy to maintain exactly k elements

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Average Subarray | [Link](https://leetcode.com/problems/maximum-average-subarray-i/) | Fixed window |
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Sliding window |
| Count Number of Nice Subarrays | [Link](https://leetcode.com/problems/count-number-of-nice-subarrays/) | Similar pattern |

### Pattern Reference

For more detailed explanations of the Sliding Window pattern, see:
- **[Sliding Window Pattern](/patterns/sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sliding Window Technique

- [NeetCode - Maximum Sum of Distinct Subarrays](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Sliding Window Pattern](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding sliding windows
- [LeetCode Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official explanation

### Related Concepts

- [Hash Set Operations](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Set usage
- [Two Pointers](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Related technique

---

## Follow-up Questions

### Q1: How do you handle duplicates in sliding window?

**Answer:** When a duplicate is encountered, shrink from the left until the duplicate is removed.

---

### Q2: Why use set instead of frequency map?

**Answer:** Set is simpler when we only need to track presence/absence. Frequency map is useful when you need counts.

---

### Q3: What if k = 1?

**Answer:** Return the maximum element in the array. Any single element is trivially distinct.

---

### Q4: How would you modify for minimum sum?

**Answer:** Change max to min in the comparison. Track minimum valid sum.

---

### Q5: What edge cases should be tested?

**Answer:**
- k = 1
- k = n
- All elements same
- All elements distinct
- Array with negatives

---

## Common Pitfalls

### Common Mistakes to Avoid

1. **Not removing leftmost element correctly**: When sliding the window, remove the element that's leaving the window

2. **Duplicate handling**: Ensure you're tracking distinct elements properly within each window

3. **Window size management**: The window size should be exactly k, not larger or smaller

4. **Index calculations**: Be careful with array indices to avoid out-of-bounds errors

---

## Summary

The **Maximum Sum of Distinct Subarrays With Length K** problem demonstrates **Sliding Window**:
- Maintain window of size k with distinct elements
- Track sum efficiently
- O(n) time, O(k) space

### Pattern Summary

This problem exemplifies the **Sliding Window** pattern, which is characterized by:
- Maintaining a window with specific properties
- Efficient element tracking with hash structures
- Single pass through data

For more details on this pattern, see the **[Sliding Window Pattern](/patterns/sliding-window)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/discuss/) - Community solutions
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Detailed explanation
- [Hash Set](https://www.geeksforgeeks.org/hash-set-in-java/) - Set operations
- [Pattern: Sliding Window](/patterns/sliding-window) - Comprehensive pattern guide
