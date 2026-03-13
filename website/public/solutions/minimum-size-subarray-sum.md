# Minimum Size Subarray Sum

## Problem Description

Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.

This is a classic sliding window problem that requires finding the shortest contiguous subarray with a given sum.

**Link to problem:** [Minimum Size Subarray Sum - LeetCode 209](https://leetcode.com/problems/minimum-size-subarray-sum/)

## Examples

**Example 1:**

Input:
```python
target = 7, nums = [2, 3, 1, 2, 4, 3]
```

Output:
```python
2
```

Explanation:
The subarray `[4, 3]` has the minimal length under the problem constraint.
- Sum = 4 + 3 = 7 ≥ target = 7
- Length = 2

**Example 2:**

Input:
```python
target = 4, nums = [1, 4, 4]
```

Output:
```python
1
```

Explanation:
The subarray `[4]` has length 1 and sum = 4 ≥ target = 4.

**Example 3:**

Input:
```python
target = 11, nums = [1, 1, 1, 1, 1, 1, 1, 1]
```

Output:
```python
0
```

Explanation:
No subarray has sum ≥ 11, so return 0.

---

## Constraints

- `1 <= target <= 10^9`
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^4`

**Follow-up:** If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).

---

## Pattern: Sliding Window

This problem is a classic example of the **Sliding Window** pattern. The pattern involves maintaining a window that expands and contracts based on certain conditions.

### Core Concept

The fundamental idea is using two pointers to maintain a window:
- **Expand Right**: Add elements to the window
- **Contract Left**: Remove elements when condition is met
- **Track Minimum**: Record the minimum window size that satisfies the condition

---

## Intuition

The key insight for this problem is understanding how sliding windows work:

1. **Positive Integers Only**: Since all numbers are positive, increasing the window always increases the sum
2. **Expand and Contract**: Grow the window until sum ≥ target, then shrink from the left
3. **Never Shrink Prematurely**: Once sum ≥ target, try shrinking while maintaining the condition
4. **Track Best**: Keep track of the minimum length that satisfies the condition

### Why Sliding Window?

- **O(n) Solution**: Each element is added and removed at most once
- **Efficient**: No need to check all possible subarrays
- **Simple**: Straightforward two-pointer implementation

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Sliding Window (Optimal)** - O(n) time, O(1) space
2. **Binary Search with Prefix Sum** - O(n log n) time, O(n) space
3. **Brute Force** - O(n²) time, O(1) space

---

## Approach 1: Sliding Window (Optimal)

This is the optimal O(n) solution using two pointers.

### Algorithm Steps

1. **Initialize Pointers**: Set `left = 0`, `current_sum = 0`, `min_length = infinity`
2. **Expand Right**: Iterate `right` from 0 to n-1, adding `nums[right]` to sum
3. **Contract Left**: While `current_sum >= target`:
   - Update `min_length = min(min_length, right - left + 1)`
   - Subtract `nums[left]` from sum
   - Increment `left`
4. **Return**: `min_length` if found, else 0

### Why It Works

The sliding window works because:
- All numbers are positive, so adding elements increases the sum
- We can safely shrink the window from the left when sum ≥ target
- Each element is processed at most twice (once when added, once when removed)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        """
        Find minimal length subarray with sum >= target using sliding window.
        
        Args:
            target: The target sum
            nums: Array of positive integers
            
        Returns:
            Minimal length of subarray with sum >= target, or 0 if none exists
        """
        n = len(nums)
        min_length = float('inf')
        current_sum = 0
        left = 0
        
        for right in range(n):
            # Expand: add current element to sum
            current_sum += nums[right]
            
            # Contract: shrink window from left while sum >= target
            while current_sum >= target:
                # Update minimum length
                min_length = min(min_length, right - left + 1)
                
                # Shrink window
                current_sum -= nums[left]
                left += 1
        
        return min_length if min_length != float('inf') else 0
```

<!-- slide -->
```cpp
#include <vector>
#include <limits>
using namespace std;

class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        /**
         * Find minimal length subarray with sum >= target using sliding window.
         * 
         * @param target: The target sum
         * @param nums: Array of positive integers
         * @return: Minimal length of subarray with sum >= target, or 0
         */
        int n = nums.size();
        int min_length = numeric_limits<int>::max();
        int current_sum = 0;
        int left = 0;
        
        for (int right = 0; right < n; right++) {
            // Expand: add current element to sum
            current_sum += nums[right];
            
            // Contract: shrink window from left while sum >= target
            while (current_sum >= target) {
                // Update minimum length
                min_length = min(min_length, right - left + 1);
                
                // Shrink window
                current_sum -= nums[left];
                left++;
            }
        }
        
        return min_length == numeric_limits<int>::max() ? 0 : min_length;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        /**
         * Find minimal length subarray with sum >= target using sliding window.
         * 
         * @param target: The target sum
         * @param nums: Array of positive integers
         * @return: Minimal length of subarray with sum >= target, or 0
         */
        int n = nums.length;
        int minLength = Integer.MAX_VALUE;
        int currentSum = 0;
        int left = 0;
        
        for (int right = 0; right < n; right++) {
            // Expand: add current element to sum
            currentSum += nums[right];
            
            // Contract: shrink window from left while sum >= target
            while (currentSum >= target) {
                // Update minimum length
                minLength = Math.min(minLength, right - left + 1);
                
                // Shrink window
                currentSum -= nums[left];
                left++;
            }
        }
        
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimal length subarray with sum >= target using sliding window.
 * 
 * @param {number} target - The target sum
 * @param {number[]} nums - Array of positive integers
 * @return {number} - Minimal length of subarray with sum >= target, or 0
 */
var minSubArrayLen = function(target, nums) {
    const n = nums.length;
    let minLength = Infinity;
    let currentSum = 0;
    let left = 0;
    
    for (let right = 0; right < n; right++) {
        // Expand: add current element to sum
        currentSum += nums[right];
        
        // Contract: shrink window from left while sum >= target
        while (currentSum >= target) {
            // Update minimum length
            minLength = Math.min(minLength, right - left + 1);
            
            // Shrink window
            currentSum -= nums[left];
            left++;
        }
    }
    
    return minLength === Infinity ? 0 : minLength;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each element is added and removed at most once |
| **Space** | O(1) - only a few variables used |

---

## Approach 2: Binary Search with Prefix Sum

This approach achieves O(n log n) time complexity using prefix sums and binary search.

### Algorithm Steps

1. **Compute Prefix Sum**: Create prefix sum array where `prefix[i]` = sum of first i elements
2. **Binary Search**: For each starting index, binary search for the smallest end index where sum ≥ target
3. **Track Minimum**: Keep track of the minimum length found

### Why It Works

- Prefix sums allow O(1) subarray sum calculation
- Binary search finds the minimum end index efficiently
- Works because the prefix sum array is sorted (monotonically increasing)

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def minSubArrayLen_binary(self, target: int, nums: List[int]) -> int:
        """
        Find minimal length using prefix sum and binary search.
        Time: O(n log n), Space: O(n)
        """
        n = len(nums)
        
        # Build prefix sum array (1-indexed for convenience)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        min_length = float('inf')
        
        # For each starting point, find smallest ending point
        for i in range(n):
            # Need to find smallest j where prefix[j] - prefix[i] >= target
            # prefix[j] >= target + prefix[i]
            target_sum = target + prefix[i]
            j = bisect.bisect_left(prefix, target_sum, i + 1)
            
            if j <= n:
                min_length = min(min_length, j - i)
        
        return min_length if min_length != float('inf') else 0
```

<!-- slide -->
```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        
        // Build prefix sum
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int min_length = INT_MAX;
        
        for (int i = 0; i < n; i++) {
            int target_sum = target + prefix[i];
            // Binary search for target_sum
            int left = i + 1, right = n;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (prefix[mid] < target_sum) left = mid + 1;
                else right = mid;
            }
            if (prefix[left] >= target_sum) {
                min_length = min(min_length, left - i);
            }
        }
        
        return min_length == INT_MAX ? 0 : min_length;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        
        // Build prefix sum
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int minLength = Integer.MAX_VALUE;
        
        for (int i = 0; i < n; i++) {
            int targetSum = target + prefix[i];
            // Binary search
            int left = i + 1, right = n;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (prefix[mid] < targetSum) left = mid + 1;
                else right = mid;
            }
            if (prefix[left] >= targetSum) {
                minLength = Math.min(minLength, left - i);
            }
        }
        
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
}
```

<!-- slide -->
```javascript
var minSubArrayLen = function(target, nums) {
    const n = nums.length;
    
    // Build prefix sum
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    let minLength = Infinity;
    
    for (let i = 0; i < n; i++) {
        const targetSum = target + prefix[i];
        
        // Binary search for targetSum in prefix
        let left = i + 1, right = n;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (prefix[mid] < targetSum) left = mid + 1;
            else right = mid;
        }
        if (prefix[left] >= targetSum) {
            minLength = Math.min(minLength, left - i);
        }
    }
    
    return minLength === Infinity ? 0 : minLength;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - binary search for each starting point |
| **Space** | O(n) - prefix sum array |

---

## Approach 3: Brute Force (For Comparison)

This approach checks all possible subarrays but is not optimal.

### Algorithm Steps

1. For each starting index
2. For each ending index
3. Calculate sum and check if ≥ target
4. Track minimum length

### Code Implementation

````carousel
```python
class Solution:
    def minSubArrayLen_brute(self, target: int, nums: List[int]) -> int:
        """Brute force approach - O(n²)"""
        n = len(nums)
        min_length = float('inf')
        
        for i in range(n):
            current_sum = 0
            for j in range(i, n):
                current_sum += nums[j]
                if current_sum >= target:
                    min_length = min(min_length, j - i + 1)
                    break  # Found shortest for this i
        
        return min_length if min_length != float('inf') else 0
```

<!-- slide -->
```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int min_length = INT_MAX;
        
        for (int i = 0; i < n; i++) {
            int current_sum = 0;
            for (int j = i; j < n; j++) {
                current_sum += nums[j];
                if (current_sum >= target) {
                    min_length = min(min_length, j - i + 1);
                    break;
                }
            }
        }
        
        return min_length == INT_MAX ? 0 : min_length;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        int minLength = Integer.MAX_VALUE;
        
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                if (currentSum >= target) {
                    minLength = Math.min(minLength, j - i + 1);
                    break;
                }
            }
        }
        
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
}
```

<!-- slide -->
```javascript
var minSubArrayLen = function(target, nums) {
    const n = nums.length;
    let minLength = Infinity;
    
    for (let i = 0; i < n; i++) {
        let currentSum = 0;
        for (let j = i; j < n; j++) {
            currentSum += nums[j];
            if (currentSum >= target) {
                minLength = Math.min(minLength, j - i + 1);
                break;
            }
        }
    }
    
    return minLength === Infinity ? 0 : minLength;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - check all subarrays |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Sliding Window | Binary Search | Brute Force |
|--------|---------------|---------------|-------------|
| **Time** | O(n) | O(n log n) | O(n²) |
| **Space** | O(1) | O(n) | O(1) |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | General use | Follow-up | Never recommended |

**Best Approach:** Sliding window is optimal with O(n) time and O(1) space.

---

## Why Sliding Window is Optimal for This Problem

The sliding window approach is optimal because:

1. **Single Pass**: Each element is visited at most twice (once entering, once leaving the window)
2. **Constant Space**: Only a few integer variables needed
3. **No Redundant Work**: We never check the same subarray twice
4. **Positive Numbers**: The constraint that all numbers are positive makes sliding window work

---

## Related Problems

Based on similar themes (sliding window, subarray sum):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Average Subarray I | [Link](https://leetcode.com/problems/maximum-average-subarray-i/) | Find max average subarray |
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Find max sum subarray |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Window Substring | [Link](https://leetcode.com/problems/minimum-window-substring/) | Minimum window containing all characters |
| Longest Substring Without Repeating Characters | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Longest unique char substring |
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Maximum in each window |
| Maximum Sum of Distinct Subarrays With Length K | [Link](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/) | K-length distinct subarrays |

### Pattern Reference

For more detailed explanations of the Sliding Window pattern and its variations, see:
- **[Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sliding Window Technique

- [NeetCode - Minimum Size Subarray Sum](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Sliding Window Explained](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Complete tutorial
- [Two Pointer Technique](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Related technique

### Binary Search Approach

- [Prefix Sum + Binary Search](https://www.youtube.com/watch?v=qZ19postX1vQ) - O(n log n) solution
- [Binary Search Patterns](https://www.youtube.com/watch?v=qZ19postX1vQ) - Various patterns

---

## Follow-up Questions

### Q1: How would you handle negative numbers in the array?

**Answer:** With negative numbers, the sliding window approach doesn't work because adding elements might decrease the sum. You'd need to use a different approach like prefix sums with a hash map to track minimum subarray lengths.

---

### Q2: How would you find the starting and ending indices of the minimal subarray?

**Answer:** Track the left and right pointers that achieve the minimum length. When updating min_length, also store the current left and right values.

---

### Q3: How would you modify for maximum sum less than or equal to target?

**Answer:** The problem becomes finding the largest subarray with sum ≤ target. You'd use a similar sliding window but shrink when sum > target, and track maximum length instead of minimum.

---

### Q4: What if you need all minimal-length subarrays?

**Answer:** Store all (left, right) pairs that achieve the minimum length in a list, rather than just tracking one pair.

---

### Q5: How would you handle very large arrays (10^7 elements)?

**Answer:** The O(n) sliding window solution is already optimal. For memory constraints, process the array in chunks or use a streaming approach.

---

### Q6: What edge cases should be tested?

**Answer:**
- target = 1 with single element array
- target > sum of all elements
- All elements equal to target
- First element already satisfies condition
- Entire array satisfies condition

---

### Q7: Can you use prefix sums with a balanced BST for better complexity?

**Answer:** Using a BST (like TreeMap in Java) gives O(n log n) time but could handle both positive and negative numbers. However, the sliding window solution is simpler and optimal for positive numbers.

---

## Common Pitfalls

### 1. Not Using Infinite Value
**Issue:** Not initializing min_length to infinity.

**Solution:** Use a large value like `float('inf')` or `Integer.MAX_VALUE`.

### 2. Returning Wrong Value for No Solution
**Issue:** Returning infinity instead of 0 when no subarray found.

**Solution:** Check if min_length is still infinity and return 0.

### 3. Off-by-One Errors
**Issue:** Incorrect window size calculation (right - left + 1 vs right - left).

**Solution:** Trace through with small examples to verify.

### 4. Not Shrinking Window Enough
**Issue:** Only shrinking once instead of while loop.

**Solution:** Use a while loop to shrink as much as possible.

---

## Summary

The **Minimum Size Subarray Sum** problem demonstrates the power of sliding window:

- **Sliding Window**: O(n) time, O(1) space - optimal
- **Binary Search**: O(n log n) time, O(n) space
- **Brute Force**: O(n²) time, O(1) space

The key insight is leveraging the positive number constraint to efficiently expand and contract the window. This problem is an excellent demonstration of when sliding window is the appropriate technique.

### Pattern Summary

This problem exemplifies the **Sliding Window - Variable Size** pattern, which is characterized by:
- Two pointers defining a window
- Expanding right pointer
- Contracting left pointer when condition is met
- Tracking optimal window size

For more details on this pattern and its variations, see the **[Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-size-subarray-sum/discuss/) - Community solutions
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Detailed explanation
- [Prefix Sum - Wikipedia](https://en.wikipedia.org/wiki/Prefix_sum) - Learn about prefix sums
- [Pattern: Sliding Window](/patterns/sliding-window-variable-size-condition-based) - Comprehensive pattern guide
