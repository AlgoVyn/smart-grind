# Longest Continuous Subarray With Absolute Diff Less Than Or Equal To Limit

## Problem Description

Given an array of integers `nums` and an integer `limit`, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to `limit`.

---

## Examples

### Example

**Input:** `nums = [8,2,4,7]`, `limit = 4`

**Output:** `2`

**Explanation:**
- `[8]` with maximum absolute diff `|8-8| = 0 <= 4`.
- `[8,2]` with maximum absolute diff `|8-2| = 6 > 4`.
- `[8,2,4]` with maximum absolute diff `|8-2| = 6 > 4`.
- `[8,2,4,7]` with maximum absolute diff `|8-2| = 6 > 4`.
- `[2]` with maximum absolute diff `|2-2| = 0 <= 4`.
- `[2,4]` with maximum absolute diff `|2-4| = 2 <= 4`.
- `[2,4,7]` with maximum absolute diff `|2-7| = 5 > 4`.
- `[4]` with maximum absolute diff `|4-4| = 0 <= 4`.
- `[4,7]` with maximum absolute diff `|4-7| = 3 <= 4`.
- `[7]` with maximum absolute diff `|7-7| = 0 <= 4`.

Therefore, the size of the longest subarray is `2`.

### Example 2

**Input:** `nums = [10,1,2,4,7,2]`, `limit = 5`

**Output:** `4`

**Explanation:** The subarray `[2,4,7,2]` is the longest since the maximum absolute diff is `|2-7| = 5 <= 5`.

### Example 3

**Input:** `nums = [4,2,2,2,4,4,2,2]`, `limit = 0`

**Output:** `3`

**Explanation:** The longest subarray with all equal elements is `[2,2,2]` with length `3`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`
- `0 <= limit <= 10^9`

---

## LeetCode Link

[LeetCode Problem 1438: Longest Continuous Subarray With Absolute Diff Less Than Or Equal To Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)

---

## Pattern: Sliding Window with Monotonic Deques

This problem follows the **Sliding Window with Monotonic Deques** pattern, used for efficiently tracking min/max in a sliding window.

### Core Concept

- **Monotonic Deques**: Maintain elements in sorted order within the window
- **MaxDeque (decreasing)**: Front always has the maximum element
- **MinDeque (increasing)**: Front always has the minimum element
- **Window Shrinks When**: max - min > limit

### When to Use This Pattern

This pattern is applicable when:
1. Finding subarray with constraints on min/max
2. Sliding window problems requiring extremes
3. Problems with absolute difference limits

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Balanced Tree (TreeMap) | O(n log n) - maintain sorted order |
| Brute Force | O(n²) - check all subarrays |

---

## Intuition

The key insight is using **two monotonic deques** within a sliding window - one for max, one for min. This gives O(1) access to window's max and min.

### Key Observations

1. **Monotonic Deques**: Maintain elements in sorted order within the window
2. **MaxDeque (decreasing)**: Front always has the maximum element
3. **MinDeque (increasing)**: Front always has the minimum element
4. **Window Shrinks When**: max - min > limit

### Why Two Deques

Regular deques would require O(n) to find max/min. Monotonic deques maintain sorted order in O(1) for inserts/removals while giving O(1) access to extremes.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Monotonic Deques** - Optimal O(n) solution
2. **Balanced Tree** - Alternative using TreeMap

---

## Approach 1: Monotonic Deques (Optimal)

### Algorithm Steps

1. Use two deques: one for max, one for min
2. Maintain a sliding window [left, right]
3. For each new element:
   - Add to max deque (maintain decreasing order)
   - Add to min deque (maintain increasing order)
   - Shrink window while max - min > limit
   - Update maximum length

### Why It Works

Monotonic deques maintain sorted order with O(1) insertion and removal. This gives us O(1) access to current max and min, enabling O(n) total solution.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        """
        Find longest subarray with absolute diff <= limit.
        
        Args:
            nums: List of integers
            limit: Maximum allowed absolute difference
            
        Returns:
            Length of longest valid subarray
        """
        max_d = deque()  # Decreasing - front is max
        min_d = deque()  # Increasing - front is min
        left = 0
        max_len = 0
        
        for right in range(len(nums)):
            # Add to max deque (decreasing)
            while max_d and nums[max_d[-1]] <= nums[right]:
                max_d.pop()
            max_d.append(right)
            
            # Add to min deque (increasing)
            while min_d and nums[min_d[-1]] >= nums[right]:
                min_d.pop()
            min_d.append(right)
            
            # Shrink window while invalid
            while nums[max_d[0]] - nums[min_d[0]] > limit:
                # Move left pointer, remove stale elements
                if max_d[0] == left:
                    max_d.popleft()
                if min_d[0] == left:
                    min_d.popleft()
                left += 1
            
            # Update maximum length
            max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    int longestSubarray(vector<int>& nums, int limit) {
        deque<int> maxD, minD;
        int left = 0, maxLen = 0;
        
        for (int right = 0; right < nums.size(); right++) {
            // Add to max deque (decreasing)
            while (!maxD.empty() && nums[maxD.back()] <= nums[right]) {
                maxD.pop_back();
            }
            maxD.push_back(right);
            
            // Add to min deque (increasing)
            while (!minD.empty() && nums[minD.back()] >= nums[right]) {
                minD.pop_back();
            }
            minD.push_back(right);
            
            // Shrink window while invalid
            while (nums[maxD.front()] - nums[minD.front()] > limit) {
                if (maxD.front() == left) maxD.pop_front();
                if (minD.front() == left) minD.pop_front();
                left++;
            }
            
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int longestSubarray(int[] nums, int limit) {
        Deque<Integer> maxD = new ArrayDeque<>();
        Deque<Integer> minD = new ArrayDeque<>();
        int left = 0, maxLen = 0;
        
        for (int right = 0; right < nums.length; right++) {
            // Add to max deque (decreasing)
            while (!maxD.isEmpty() && nums[maxD.peekLast()] <= nums[right]) {
                maxD.pollLast();
            }
            maxD.offerLast(right);
            
            // Add to min deque (increasing)
            while (!minD.isEmpty() && nums[minD.peekLast()] >= nums[right]) {
                minD.pollLast();
            }
            minD.offerLast(right);
            
            // Shrink window while invalid
            while (nums[maxD.peekFirst()] - nums[minD.peekFirst()] > limit) {
                if (maxD.peekFirst() == left) maxD.pollFirst();
                if (minD.peekFirst() == left) minD.pollFirst();
                left++;
            }
            
            maxLen = Math.max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} limit
 * @return {number}
 */
var longestSubarray = function(nums, limit) {
    const maxD = [];  // Decreasing - front is max
    const minD = [];  // Increasing - front is min
    let left = 0;
    let maxLen = 0;
    
    for (let right = 0; right < nums.length; right++) {
        // Add to max deque (decreasing)
        while (maxD.length && nums[maxD[maxD.length - 1]] <= nums[right]) {
            maxD.pop();
        }
        maxD.push(right);
        
        // Add to min deque (increasing)
        while (minD.length && nums[minD[minD.length - 1]] >= nums[right]) {
            minD.pop();
        }
        minD.push(right);
        
        // Shrink window while invalid
        while (nums[maxD[0]] - nums[minD[0]] > limit) {
            if (maxD[0] === left) maxD.shift();
            if (minD[0] === left) minD.shift();
            left++;
        }
        
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element added/removed at most once |
| **Space** | O(n) - Worst case for deques |

---

## Approach 2: Balanced Tree (TreeMap)

### Algorithm Steps

1. Use a TreeMap to maintain elements in sorted order
2. Slide window and check if max - min <= limit
3. Use O(log n) operations for insert/delete

### Why It Works

TreeMap maintains elements in sorted order and provides O(log n) access to smallest and largest elements.

### Code Implementation

````carousel
```python
from typing import List
from sortedcontainers import SortedDict

class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        """
        Alternative using SortedDict.
        """
        from sortedcontainers import SortedDict
        
        window = SortedDict()
        left = 0
        max_len = 0
        
        for right in range(len(nums)):
            window[nums[right]] = window.get(nums[right], 0) + 1
            
            while window.peekitem(-1)[0] - window.peekitem(0)[0] > limit:
                window[nums[left]] -= 1
                if window[nums[left]] == 0:
                    del window[nums[left]]
                left += 1
            
            max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
// C++ using multimap
#include <map>
class Solution {
public:
    int longestSubarray(vector<int>& nums, int limit) {
        map<int, int> count;
        int left = 0, maxLen = 0;
        
        for (int right = 0; right < nums.size(); right++) {
            count[nums[right]]++;
            
            while (count.rbegin()->first - count.begin()->first > limit) {
                count[nums[left]]--;
                if (count[nums[left]] == 0) count.erase(nums[left]);
                left++;
            }
            
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
// Java using TreeMap
import java.util.*;

class Solution {
    public int longestSubarray(int[] nums, int limit) {
        TreeMap<Integer, Integer> count = new TreeMap<>();
        int left = 0, maxLen = 0;
        
        for (int right = 0; right < nums.length; right++) {
            count.put(nums[right], count.getOrDefault(nums[right], 0) + 1);
            
            while (count.lastKey() - count.firstKey() > limit) {
                count.put(nums[left], count.get(nums[left]) - 1);
                if (count.get(nums[left]) == 0) count.remove(nums[left]);
                left++;
            }
            
            maxLen = Math.max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
// JavaScript using Map (manual sorted)
var longestSubarray = function(nums, limit) {
    const count = new Map();
    let left = 0;
    let maxLen = 0;
    
    const getMin = () => Math.min(...count.keys());
    const getMax = () => Math.max(...count.keys());
    
    for (let right = 0; right < nums.length; right++) {
        count.set(nums[right], (count.get(nums[right]) || 0) + 1);
        
        while (getMax() - getMin() > limit) {
            const newVal = count.get(nums[left]) - 1;
            if (newVal === 0) count.delete(nums[left]);
            else count.set(nums[left], newVal);
            left++;
        }
        
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - TreeMap operations |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Monotonic Deques | TreeMap |
|--------|------------------|---------|
| **Time Complexity** | O(n) | O(n log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Sliding Window, Monotonic Deques

### Learning Outcomes

1. **Monotonic Deques**: Master this advanced data structure
2. **Sliding Window**: Perfect sliding window practice
3. **O(n) Optimization**: Achieve linear time with deques

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Similar deque usage |
| Minimum Size Subarray Sum | [Link](https://leetcode.com/problems/minimum-size-subarray-sum/) | Sliding window |

---

## Video Tutorial Links

1. **[NeetCode - Longest Continuous Subarray](https://www.youtube.com/watch?v=yT8J4)** - Clear explanation
2. **[Longest Subarray - LeetCode 1438](https://www.youtube.com/watch?v=yT8J4)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you handle returning the actual subarray?

**Answer:** Track the left and right indices when updating maxLen.

---

### Q2: What if limit is very large?

**Answer:** The algorithm naturally handles any limit - if limit >= max - min of entire array, the entire array is valid.

---

### Q3: Can you solve this with fixed-size sliding window?

**Answer:** No, the window size varies based on the constraint.

---

## Common Pitfalls

1. **Deque order confusion**: Max deque is decreasing (front = max), min deque is increasing (front = min).
2. **Removing from wrong end**: When adding new elements, pop from the back if the new element is larger/smaller.
3. **Stale elements in deques**: When moving left pointer, check if the front element equals left before removing.
4. **Using <= vs <**: Use <= for max deque and >= for min deque when popping to handle duplicates correctly.

---

## Summary

The **Longest Continuous Subarray** problem demonstrates **Sliding Window with Monotonic Deques**:

- **Approach**: Two deques - one for max, one for min
- **Time**: O(n) - each element added/removed at most once
- **Space**: O(n) worst case for deques

Key insight: Monotonic deques maintain sorted order in O(1), giving O(1) max/min access within sliding window.

### Pattern Summary

This problem exemplifies the **Sliding Window with Monotonic Deques** pattern, characterized by:
- Maintaining sorted order in O(1)
- O(1) access to window extremes
- Efficient window shrinkage

---

## Additional Resources

- [LeetCode Problem 1438](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/) - Official problem page
- [Monotonic Queue - GeeksforGeeks](https://www.geeksforgeeks.org/monotonic-queue/) - Detailed explanation
