# Max Consecutive Ones III

## Problem Description

Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`'s in the array if you can flip at most `k` `0`'s.

**Link to problem:** [Max Consecutive Ones III - LeetCode 1004](https://leetcode.com/problems/max-consecutive-ones-iii/)

---

## Pattern: Sliding Window - Variable Size

This problem demonstrates the **Sliding Window - Variable Size** pattern. We maintain a window with at most k zeros.

### Core Concept

The fundamental idea is using a sliding window:
- Expand the window to include more elements
- Contract when we have more than k zeros
- Track the maximum window size

---

## Examples

### Example

**Input:**
```
nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
```

**Output:**
```
6
```

**Explanation:** Flip the two zeros to get 6 consecutive ones.

### Example 2

**Input:**
```
nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3
```

**Output:**
```
10
```

---

## Constraints

- `1 <= nums.length <= 10^5`
- `nums[i]` is either 0 or 1.
- `0 <= k <= nums.length`

---

## Intuition

The key insight is treating this as finding the longest subarray with at most k zeros:
- Use two pointers (sliding window)
- Count zeros in current window
- Expand: move right pointer
- Contract: when zeros > k, move left pointer

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window** - O(n) time (Optimal)
2. **Prefix Sum + Binary Search** - Alternative O(n log n) approach

---

## Approach 1: Sliding Window (Optimal)

### Algorithm Steps

1. Use two pointers: left and right
2. Count zeros in current window
3. Expand right, include more elements
4. If zeros > k, shrink from left
5. Track maximum window size

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        left = 0
        zero_count = 0
        max_length = 0
        
        for right in range(len(nums)):
            # Expand window
            if nums[right] == 0:
                zero_count += 1
            
            # Contract window if we have too many zeros
            while zero_count > k:
                if nums[left] == 0:
                    zero_count -= 1
                left += 1
            
            # Update maximum
            max_length = max(max_length, right - left + 1)
        
        return max_length
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int left = 0;
        int zeroCount = 0;
        int maxLength = 0;
        
        for (int right = 0; right < nums.size(); right++) {
            if (nums[right] == 0) zeroCount++;
            
            while (zeroCount > k) {
                if (nums[left] == 0) zeroCount--;
                left++;
            }
            
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0;
        int zeroCount = 0;
        int maxLength = 0;
        
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeroCount++;
            
            while (zeroCount > k) {
                if (nums[left] == 0) zeroCount--;
                left++;
            }
            
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
}
```

<!-- slide -->
```javascript
var longestOnes = function(nums, k) {
    let left = 0;
    let zeroCount = 0;
    let maxLength = 0;
    
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeroCount++;
        
        while (zeroCount > k) {
            if (nums[left] === 0) zeroCount--;
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element visited at most twice |
| **Space** | O(1) |

---

## Approach 2: Prefix Sum + Binary Search (Alternative)

### Algorithm Steps

1. Create prefix sum array tracking number of zeros up to each position
2. For each starting position i, use binary search to find farthest position j where zeros ≤ k
3. Maximum window size = j - i + 1

### Why It Works

The prefix sum allows us to quickly calculate zeros in any range. Binary search finds the farthest position with ≤ k zeros.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def maxConsecutive OnesIII(self, nums: List[int], k: int) -> int:
        """
        Find maximum consecutive 1s after flipping at most k zeros.
        
        Args:
            nums: Binary array
            k: Maximum number of flips allowed
            
        Returns:
            Maximum length of subarray with all 1s
        """
        n = len(nums)
        
        # Create prefix sum of zeros
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + (1 - nums[i])
        
        result = 0
        
        # For each starting position, find farthest valid ending
        for i in range(n):
            # Binary search for farthest position with ≤ k zeros
            target = prefix[i] + k
            j = bisect.bisect_right(prefix, target) - 1
            result = max(result, j - i + 1)
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxConsecutiveOnesIII(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Prefix sum of zeros
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + (1 - nums[i]);
        }
        
        int result = 0;
        
        for (int i = 0; i < n; i++) {
            int target = prefix[i] + k;
            // Binary search for farthest position
            int j = upper_bound(prefix.begin(), prefix.end(), target) - prefix.begin() - 1;
            result = max(result, j - i + 1);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxConsecutiveOnesIII(int[] nums, int k) {
        int n = nums.length;
        
        // Prefix sum of zeros
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + (1 - nums[i]);
        }
        
        int result = 0;
        
        for (int i = 0; i < n; i++) {
            int target = prefix[i] + k;
            // Binary search for farthest position
            int j = binarySearch(prefix, target);
            result = Math.max(result, j - i + 1);
        }
        
        return result;
    }
    
    private int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (arr[mid] <= target) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        return left;
    }
}
```

<!-- slide -->
```javascript
var maxConsecutiveOnesIII = function(nums, k) {
    const n = nums.length;
    
    // Prefix sum of zeros
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + (1 - nums[i]);
    }
    
    let result = 0;
    
    for (let i = 0; i < n; i++) {
        const target = prefix[i] + k;
        // Binary search for farthest position
        let j = binarySearch(prefix, target);
        result = Math.max(result, j - i + 1);
    }
    
    return result;
};

function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        const mid = Math.ceil((left + right) / 2);
        if (arr[mid] <= target) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    return left;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Binary search for each position |
| **Space** | O(n) - Prefix sum array |

---

## Related Problems

Based on similar themes (sliding window, binary arrays):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Max Consecutive Ones | [Link](https://leetcode.com/problems/max-consecutive-ones/) | No flips allowed |
| Longest Repeating Character Replacement | [Link](https://leetcode.com/problems/longest-repeating-character-replacement/) | Similar sliding window |

---

## Comparison with Similar Problems

| Problem | Link | Description |
|---------|------|-------------|
| Max Consecutive Ones | [Link](https://leetcode.com/problems/max-consecutive-ones/) | No flips allowed |
| Longest Repeating Character Replacement | [Link](https://leetcode.com/problems/longest-repeating-character-replacement/) | Similar but for any character |

---

## Video Tutorial Links

- [NeetCode - Max Consecutive Ones III](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation

---

## Summary

The **Max Consecutive Ones III** problem demonstrates sliding window:
- Maintain window with at most k zeros
- Expand right, contract left when needed
- O(n) time, O(1) space

---

## Follow-up Questions

### Q1: What if we could flip both 0s and 1s?

**Answer:** This would become a different problem like "Longest Repeating Character Replacement" where you can flip any character to make all characters in the window the same.

### Q2: How would you handle an empty array?

**Answer:** Return 0 as there are no consecutive ones possible.

### Q3: What if k equals the array length?

**Answer:** Return n (the entire array can be flipped to all 1s).

---

## Common Pitfalls

### 1. Sliding Window Boundaries
**Issue**: Not handling the window boundaries correctly.

**Solution**: Use `while zero_count > k` to shrink the window until valid.

### 2. Index Calculation
**Issue**: Using wrong indices when calculating window size.

**Solution**: Window size is `right - left + 1`.

### 3. k Value
**Issue**: Not handling k = 0 case.

**Solution**: The algorithm works for k = 0, returning the count of existing consecutive ones.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/max-consecutive-ones-iii/discuss/) - Community solutions
