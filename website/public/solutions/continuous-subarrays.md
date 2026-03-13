# Continuous Subarrays

## Problem Description

You are given a 0-indexed integer array nums. A subarray of nums is called continuous if:

Let i, i + 1, ..., j be the indices in the subarray. Then, for each pair of indices i <= i1, i2 <= j, 0 <= |nums[i1] - nums[i2]| <= 2.

Return the total number of continuous subarrays.

A subarray is a contiguous non-empty sequence of elements within an array.

**Link to problem:** [Continuous Subarrays - LeetCode 2762](https://leetcode.com/problems/continuous-subarrays/)

## Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`

---

## Pattern: Sliding Window with Monotonic Deques

This problem uses the **Sliding Window** pattern with **Monotonic Deques** to efficiently maintain the maximum and minimum elements in the current window. This is a classic technique for solving problems that require tracking min/max in a sliding window.

### Core Concept

The key insight is:
- A subarray is "continuous" if max - min <= 2
- We can use a sliding window that expands to the right
- When max - min > 2, we shrink from the left
- We use monotonic deques to track max and min in O(1) time

---

## Examples

### Example

**Input:**
```
nums = [5,4,2,4]
```

**Output:**
```
8
```

**Explanation:**
- Continuous subarray of size 1: [5], [4], [2], [4]
- Continuous subarray of size 2: [5,4], [4,2], [2,4]
- Continuous subarray of size 3: [4,2,4]
- There are no subarrays of size 4
- Total continuous subarrays = 4 + 3 + 1 = 8

### Example 2

**Input:**
```
nums = [1,2,3]
```

**Output:**
```
6
```

**Explanation:**
- Continuous subarray of size 1: [1], [2], [3]
- Continuous subarray of size 2: [1,2], [2,3]
- Continuous subarray of size 3: [1,2,3]
- Total continuous subarrays = 3 + 2 + 1 = 6

### Example 3

**Input:**
```
nums = [10,10,10,10,10]
```

**Output:**
```
15
```

**Explanation:** Since all elements are equal, max - min = 0 for all subarrays. Total = 5 + 4 + 3 + 2 + 1 = 15

---

## Intuition

The key insight is:

1. **Sliding Window**: We maintain a window where max - min <= 2
2. **Expand Right**: For each new element, try to expand the window
3. **Shrink Left**: If max - min > 2, shrink from the left until valid again
4. **Count Subarrays**: All subarrays ending at position `right` from `left` to `right` are valid

### Why Monotonic Deques?

Monotonic deques allow us to:
- Get max/min in O(1) time
- Add new elements in O(1) time
- Remove old elements in O(1) time

The deque maintains elements in sorted order (ascending for min, descending for max), so the front always contains the current max/min.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window with Monotonic Deques (Optimal)** - O(n) time, O(n) space
2. **Brute Force with Prefix Max/Min** - O(n²) time - Not recommended

---

## Approach 1: Sliding Window with Monotonic Deques (Optimal)

This is the standard solution using monotonic deques to track max and min.

### Algorithm Steps

1. Initialize `left = 0`, `result = 0`
2. Create two deques: `max_deque` (decreasing) and `min_deque` (increasing)
3. For each `right` from 0 to n-1:
   - Add `right` to `max_deque` (maintain decreasing order)
   - Add `right` to `min_deque` (maintain increasing order)
   - While max - min > 2:
     - Increment `left`
     - Remove indices < left from deques
   - Add `right - left + 1` to result (all valid subarrays ending at right)
4. Return result

### Why It Works

The sliding window technique ensures we consider each element exactly once. By maintaining the window where max - min <= 2, we can count all valid subarrays ending at each position.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def continuousSubarrays(self, nums: List[int]) -> int:
        """
        Count continuous subarrays using sliding window with monotonic deques.
        
        Args:
            nums: List of integers
            
        Returns:
            Number of continuous subarrays
        """
        n = len(nums)
        left = 0
        result = 0
        
        # Deque to track maximum (decreasing order)
        max_deque = deque()
        # Deque to track minimum (increasing order)
        min_deque = deque()
        
        for right in range(n):
            # Maintain max_deque: decreasing order
            while max_deque and nums[max_deque[-1]] <= nums[right]:
                max_deque.pop()
            max_deque.append(right)
            
            # Maintain min_deque: increasing order
            while min_deque and nums[min_deque[-1]] >= nums[right]:
                min_deque.pop()
            min_deque.append(right)
            
            # Shrink window if max - min > 2
            while nums[max_deque[0]] - nums[min_deque[0]] > 2:
                left += 1
                # Remove elements out of window
                if max_deque[0] < left:
                    max_deque.popleft()
                if min_deque[0] < left:
                    min_deque.popleft()
            
            # All subarrays ending at right from left to right are valid
            result += right - left + 1
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>

class Solution {
public:
    /**
     * Count continuous subarrays using sliding window with monotonic deques.
     * 
     * @param nums List of integers
     * @return Number of continuous subarrays
     */
    int continuousSubarrays(vector<int>& nums) {
        int n = nums.size();
        int left = 0;
        long long result = 0;
        
        // Deque to track maximum (decreasing order)
        deque<int> maxDeque;
        // Deque to track minimum (increasing order)
        deque<int> minDeque;
        
        for (int right = 0; right < n; right++) {
            // Maintain maxDeque: decreasing order
            while (!maxDeque.empty() && nums[maxDeque.back()] <= nums[right]) {
                maxDeque.pop_back();
            }
            maxDeque.push_back(right);
            
            // Maintain minDeque: increasing order
            while (!minDeque.empty() && nums[minDeque.back()] >= nums[right]) {
                minDeque.pop_back();
            }
            minDeque.push_back(right);
            
            // Shrink window if max - min > 2
            while (nums[maxDeque.front()] - nums[minDeque.front()] > 2) {
                left++;
                // Remove elements out of window
                if (maxDeque.front() < left) {
                    maxDeque.pop_front();
                }
                if (minDeque.front() < left) {
                    minDeque.pop_front();
                }
            }
            
            // All subarrays ending at right from left to right are valid
            result += right - left + 1;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.Deque;
import java.util.LinkedList;

class Solution {
    /**
     * Count continuous subarrays using sliding window with monotonic deques.
     * 
     * @param nums List of integers
     * @return Number of continuous subarrays
     */
    public long continuousSubarrays(int[] nums) {
        int n = nums.length;
        int left = 0;
        long result = 0;
        
        // Deque to track maximum (decreasing order)
        Deque<Integer> maxDeque = new LinkedList<>();
        // Deque to track minimum (increasing order)
        Deque<Integer> minDeque = new LinkedList<>();
        
        for (int right = 0; right < n; right++) {
            // Maintain maxDeque: decreasing order
            while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {
                maxDeque.pollLast();
            }
            maxDeque.addLast(right);
            
            // Maintain minDeque: increasing order
            while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {
                minDeque.pollLast();
            }
            minDeque.addLast(right);
            
            // Shrink window if max - min > 2
            while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > 2) {
                left++;
                // Remove elements out of window
                if (maxDeque.peekFirst() < left) {
                    maxDeque.pollFirst();
                }
                if (minDeque.peekFirst() < left) {
                    minDeque.pollFirst();
                }
            }
            
            // All subarrays ending at right from left to right are valid
            result += right - left + 1;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Count continuous subarrays using sliding window with monotonic deques.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Number of continuous subarrays
 */
var continuousSubarrays = function(nums) {
    const n = nums.length;
    let left = 0;
    let result = 0;
    
    // Deque to track maximum (decreasing order)
    const maxDeque = [];
    // Deque to track minimum (increasing order)
    const minDeque = [];
    
    for (let right = 0; right < n; right++) {
        // Maintain maxDeque: decreasing order
        while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
            maxDeque.pop();
        }
        maxDeque.push(right);
        
        // Maintain minDeque: increasing order
        while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
            minDeque.pop();
        }
        minDeque.push(right);
        
        // Shrink window if max - min > 2
        while (nums[maxDeque[0]] - nums[minDeque[0]] > 2) {
            left++;
            // Remove elements out of window
            if (maxDeque[0] < left) {
                maxDeque.shift();
            }
            if (minDeque[0] < left) {
                minDeque.shift();
            }
        }
        
        // All subarrays ending at right from left to right are valid
        result += right - left + 1;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is added and removed from deques at most once |
| **Space** | O(n) - Worst case for deques (but often less in practice) |

---

## Approach 2: Brute Force with Prefix Max/Min

This approach computes prefix max/min for each position. Not recommended for large inputs.

### Algorithm Steps

1. For each starting position i:
   - Track current max and min
   - For each ending position j >= i:
     - Update current max and min
     - If max - min > 2, break
     - Otherwise, increment count

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def continuousSubarrays_bruteforce(self, nums: List[int]) -> int:
        """
        Brute force approach - not recommended.
        """
        n = len(nums)
        count = 0
        
        for i in range(n):
            current_max = nums[i]
            current_min = nums[i]
            for j in range(i, n):
                current_max = max(current_max, nums[j])
                current_min = min(current_min, nums[j])
                if current_max - current_min > 2:
                    break
                count += 1
        
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    long long continuousSubarrays(vector<int>& nums) {
        int n = nums.size();
        long long count = 0;
        
        for (int i = 0; i < n; i++) {
            int currentMax = nums[i];
            int currentMin = nums[i];
            for (int j = i; j < n; j++) {
                currentMax = max(currentMax, nums[j]);
                currentMin = min(currentMin, nums[j]);
                if (currentMax - currentMin > 2) {
                    break;
                }
                count++;
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public long continuousSubarrays(int[] nums) {
        int n = nums.length;
        long count = 0;
        
        for (int i = 0; i < n; i++) {
            int currentMax = nums[i];
            int currentMin = nums[i];
            for (int j = i; j < n; j++) {
                currentMax = Math.max(currentMax, nums[j]);
                currentMin = Math.min(currentMin, nums[j]);
                if (currentMax - currentMin > 2) {
                    break;
                }
                count++;
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force approach - not recommended.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Number of continuous subarrays
 */
var continuousSubarrays = function(nums) {
    const n = nums.length;
    let count = 0;
    
    for (let i = 0; i < n; i++) {
        let currentMax = nums[i];
        let currentMin = nums[i];
        for (let j = i; j < n; j++) {
            currentMax = Math.max(currentMax, nums[j]);
            currentMin = Math.min(currentMin, nums[j]);
            if (currentMax - currentMin > 2) {
                break;
            }
            count++;
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Try all possible subarrays |
| **Space** | O(1) - Only uses constant space |

---

## Comparison of Approaches

| Aspect | Sliding Window + Deques | Brute Force |
|--------|------------------------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(1) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | All inputs | Not recommended |

**Best Approach:** The sliding window approach with monotonic deques is optimal.

---

## Why Monotonic Deques?

### For Max Deque (Decreasing)
- Elements are stored in decreasing order of their values
- Front always contains the maximum element
- When a new element arrives, we remove all smaller elements from the back

### For Min Deque (Increasing)
- Elements are stored in increasing order of their values
- Front always contains the minimum element
- When a new element arrives, we remove all larger elements from the back

This ensures O(1) access to max/min and O(1) insertion/deletion.

---

## Related Problems

Based on similar themes (sliding window, monotonic deques):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Find max in each sliding window |
| Minimum Number of Subarrays With Bounded Maximum | [Link](https://leetcode.com/problems/minimum-number-of-subarrays-with-bounded-maximum/) | Similar bounded subarray problem |
| Longest Subarray With Maximum Bitwise AND | [Link](https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and/) | Related subarray problem |

### Pattern Reference

For more detailed explanations of the Sliding Window pattern, see:
- **[Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based)**
- **[Sliding Window - Fixed Size](/patterns/sliding-window-fixed-size-subarray-calculation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sliding Window with Deques

- [NeetCode - Continuous Subarrays](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Sliding Window Maximum](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Related problem
- [Monotonic Deques Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding monotonic deques

### Related Concepts

- [Sliding Window Technique](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding sliding window
- [Monotonic Stack/Deque](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Monotonic data structures

---

## Follow-up Questions

### Q1: Can you solve it in O(1) space?

**Answer:** The deques can potentially grow to O(n) in the worst case. However, we can achieve O(1) space by using balanced BSTs or segment trees, though they have higher constant factors.

---

### Q2: How would you modify this for a different threshold (not 2)?

**Answer:** Simply replace the hardcoded value 2 with a variable `k`. The algorithm remains the same: while max - min > k, shrink the window.

---

### Q3: What is the maximum size of the window?

**Answer:** In the worst case (all elements equal), the window can grow to n. In the best case (alternating max/min difference > 2), the window size is always 1.

---

### Q4: How would you track the actual subarrays?

**Answer:** Instead of just counting, store the (left, right) pairs. For each position `right`, store all `left` values from the current left to right.

---

### Q5: What is the relationship to the "minimum number of subarrays with bounded maximum" problem?

**Answer:** That problem is essentially the inverse: given a maximum value constraint, count subarrays. The sliding window approach is similar but with different termination conditions.

---

### Q6: Can you use two pointers without deques?

**Answer:** You could, but finding max/min in each window would be O(n), making the overall complexity O(n²). The deques provide O(1) max/min access.

---

### Q7: How does this relate to the "fixed size sliding window" problems?

**Answer:** This is a variable-size sliding window where the size is determined by the constraint (max - min <= 2). Fixed-size windows have a predetermined size, while here the size is dynamic.

---

### Q8: What edge cases should be tested?

**Answer:**
- Single element array (should return 1)
- All equal elements
- Strictly increasing/decreasing array
- Array with alternating high and low values
- Array with values differing by exactly 2

---

## Common Pitfalls

### 1. Not Removing Outdated Elements
**Issue:** Not removing indices from deques when they fall outside the window.

**Solution:** Always check if deque[0] < left and remove if true.

### 2. Wrong Order of Operations
**Issue:** Adding element before checking removal condition.

**Solution:** Always add new element to deques first, then shrink window.

### 3. Off-by-One Errors
**Issue:** Wrong calculation for number of subarrays.

**Solution:** Remember: all subarrays ending at right from left to right are valid, count = right - left + 1.

### 4. Using Wrong Comparison Operators
**Issue:** Using >= instead of > for max - min check.

**Solution:** The constraint is max - min > 2 means NOT continuous, so we shrink while this is true.

### 5. Integer Overflow
**Issue:** Result can be large (up to n*(n+1)/2 ≈ 5×10^9 for n=10^5).

**Solution:** Use 64-bit integer (long long in C++, long in Java, Python handles it automatically).

---

## Summary

The **Continuous Subarrays** problem demonstrates the sliding window technique with monotonic deques:

- **Optimal Solution**: O(n) time with monotonic deques
- **Key Insight**: Maintain window where max - min <= 2
- **Data Structures**: Two deques for tracking max and min

The key insight is using monotonic deques to efficiently track max and min in a sliding window. Each element is added and removed at most once, giving O(n) time complexity.

### Pattern Summary

This problem exemplifies the **Sliding Window with Monotonic Deques** pattern, which is characterized by:
- Variable-size sliding window
- O(1) max/min access with deques
- O(n) time complexity
- Counting subarrays with constraints

For more details on this pattern and its variations, see:
- **[Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/continuous-subarrays/discuss/) - Community solutions
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Understanding sliding window
- [Monotonic Deque - GeeksforGeeks](https://www.geeksforgeeks.org/deque/set-3-monotonic-deque/) - Monotonic deque operations
- [Pattern: Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based) - Related pattern guide
