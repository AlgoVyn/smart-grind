# Longest Subarray of 1's After Deleting One Element

## Problem Description
Given a binary array `nums`, you should delete one element from it. Return the size of the longest non-empty subarray containing only 1's in the resulting array. If there is no such subarray, return 0.

This is **LeetCode Problem #1493** and is classified as a Medium difficulty problem. It tests your ability to work with sliding window techniques to find optimal subarray solutions.

### Detailed Problem Statement
- The array consists of only 0s and 1s
- You must delete exactly one element (can be 0 or 1)
- Find the longest consecutive sequence of 1s after deletion
- If all elements are 0s, return 0
- If all elements are 1s, return n-1 (since you must delete one element)

### Key Constraints
| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 10^5` | Array size |
| `nums[i] is either 0 or 1` | Binary elements |

---

## Examples

### Example 1:
```
Input: nums = [1,1,0,1]
Output: 3
Explanation: After deleting the 0 at index 2, the array becomes [1,1,1], which has length 3.
```

### Example 2:
```
Input: nums = [0,1,1,1,0,1,1,0,1]
Output: 5
Explanation: After deleting the 0 at index 4, the array becomes [0,1,1,1,1,1,0,1], with the longest subarray of 1s being length 5.
```

### Example 3:
```
Input: nums = [1,1,1]
Output: 2
Explanation: You must delete one element, so the longest subarray is 2.
```

### Example 4:
```
Input: nums = [1,1,0,0,1,1,1,0,1]
Output: 4
Explanation: Delete the 0 at index 3 to get a subarray of length 4.
```

### Example 5:
```
Input: nums = [0,0,0]
Output: 0
Explanation: No subarrays of 1s possible.
```

---

## Intuition
The problem can be efficiently solved using a **sliding window approach** that tracks:
- The number of 0s encountered in the current window
- The maximum length of valid subarrays (with at most one 0 to delete)

Key insight: We can have at most one 0 in our window, because we can delete it to form a valid subarray of 1s.

---

## Solution Approaches

### Approach 1: Sliding Window (Optimal) ✅ Recommended
This approach uses a sliding window with two pointers to track the longest valid subarray.

```python
from typing import List

class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        left = 0
        zero_count = 0
        max_length = 0
        
        for right in range(len(nums)):
            # Count zeros in current window
            if nums[right] == 0:
                zero_count += 1
            
            # If more than one zero, move left pointer
            while zero_count > 1:
                if nums[left] == 0:
                    zero_count -= 1
                left += 1
            
            # Calculate current window length (subtract 1 to account for deletion)
            current_length = right - left + 1 - 1
            max_length = max(max_length, current_length)
        
        return max_length
```

#### How It Works
1. **Initialization**: Start with left pointer at 0, zero count at 0, and max length at 0
2. **Expand Window**: Move right pointer to include new elements
3. **Count Zeros**: Increment zero count if encountered
4. **Shrink Window**: If zeros > 1, move left pointer to reduce zeros to 1
5. **Calculate Length**: Subtract 1 to account for the required deletion
6. **Update Max Length**: Keep track of the maximum valid length

---

### Approach 2: Dynamic Programming
This approach uses dynamic programming to track consecutive 1s before and after each position.

```python
from typing import List

class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        n = len(nums)
        left = [0] * n
        right = [0] * n
        
        # Calculate left consecutive 1s
        for i in range(1, n):
            if nums[i-1] == 1:
                left[i] = left[i-1] + 1
        
        # Calculate right consecutive 1s
        for i in range(n-2, -1, -1):
            if nums[i+1] == 1:
                right[i] = right[i+1] + 1
        
        max_length = 0
        for i in range(n):
            max_length = max(max_length, left[i] + right[i])
        
        return max_length
```

#### How It Works
1. **Left Array**: For each position, stores number of consecutive 1s to the left
2. **Right Array**: For each position, stores number of consecutive 1s to the right  
3. **Calculate Maximum**: For each position, sum left and right (this represents deleting this position)
4. **Result**: The maximum sum is the answer

---

## Complexity Analysis

### Comparison of Approaches
| Approach | Time Complexity | Space Complexity | Status |
|----------|-----------------|------------------|--------|
| **Sliding Window** | O(n) | O(1) | ✅ **Optimal** |
| **Dynamic Programming** | O(n) | O(n) | ❌ Not optimal for space |

### Sliding Window Complexity
- **Time**: O(n) - Each element is processed at most twice (once by right, once by left)
- **Space**: O(1) - Constant extra space

### Dynamic Programming Complexity
- **Time**: O(n) - Three passes through the array
- **Space**: O(n) - Two additional arrays of size n

---

## Edge Cases and Common Pitfalls

### Edge Cases
1. **All 1s Array**: `[1,1,1]` returns 2 (must delete one element)
2. **All 0s Array**: `[0,0,0]` returns 0
3. **Single Element Array**: `[1]` or `[0]` returns 0
4. **Two Element Arrays**: 
   - `[1,1]` returns 1
   - `[1,0]` returns 1
5. **Alternating 0s and 1s**: `[1,0,1,0,1]` returns 2

### Common Mistakes
1. **Forgetting to subtract 1** from the window length
2. **Not handling the case where all elements are 1s**
3. **Overlapping windows with multiple zeros**
4. **Incorrectly initializing pointers or counters**

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Google, Facebook
- **Difficulty**: Medium, tests sliding window techniques
- **Variations**: Similar to problems like "Max Consecutive Ones III"

### Learning Outcomes
1. **Sliding Window Mastery**: Practice with variable-size window problems
2. **Edge Case Handling**: Learn to handle boundary conditions
3. **Problem Transformation**: Convert problem into finding window with at most one 0
4. **Optimal Space Solutions**: Compare O(1) and O(n) space approaches

---

## Related Problems

### Same Pattern (Sliding Window)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Max Consecutive Ones III](/solutions/max-consecutive-ones-iii.md) | 1004 | Medium | Flip up to K 0s |
| [Longest Substring Without Repeating Characters](/solutions/longest-substring-without-repeating-characters.md) | 3 | Medium | Sliding window for unique chars |
| [Minimum Size Subarray Sum](/solutions/minimum-size-subarray-sum.md) | 209 | Medium | Fixed condition sliding window |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Longest Subarray of 1's](/solutions/find-the-length-of-the-longest-subarray-of-1's.md) | 1004 variation | - | No deletion allowed |
| [Find Pivot Index](/solutions/find-pivot-index.md) | 724 | Easy | Prefix sum technique |

---

## Video Tutorial Links

### Recommended Tutorials
1. **[Longest Subarray of 1's After Deleting One Element - NeetCode](https://www.youtube.com/watch?v=9UOMZSL0JTg)**
   - Clear sliding window explanation
   - Step-by-step walkthrough
   - Edge case coverage

2. **[LeetCode 1493 - Longest Subarray After Deleting One Element](https://www.youtube.com/watch?v=QpJh4Gj7Z8Q)**
   - Multiple approaches discussed
   - Time and space complexity analysis
   - Code implementation in Python

3. **[Sliding Window Technique Explained](https://www.youtube.com/watch?v=MK-NZ4hN7rs)**
   - General sliding window concepts
   - Applicable to various problems
   - Beginner-friendly

### Additional Resources
- **[Sliding Window Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/)** - Comprehensive guide
- **[LeetCode Discuss](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level
1. **What's the time and space complexity of the sliding window approach?**
   - Time: O(n), Space: O(1)

2. **Why do we subtract 1 from the window length?**
   - Because we must delete exactly one element

3. **What if the array contains no zeros?**
   - Return n-1, since we have to delete one element

### Intermediate Level
4. **How would you modify the solution to allow deleting up to K elements?**
   - Change the condition from `zero_count > 1` to `zero_count > K`

5. **How would you handle arrays with other characters besides 0s and 1s?**
   - Modify the zero count to track invalid characters

6. **Can this be solved with a prefix sum approach?**
   - Yes, by converting the array to prefix sums and using binary search

### Advanced Level
7. **How would you find the actual subarray instead of just the length?**
   - Track the left and right pointers when maximum length is updated

8. **What if we need to delete up to K elements where K can be large?**
   - For very large K, a binary search approach might be better

9. **How does this problem relate to maximum subarray problems?**
   - It's a variation where we allow one deletion, similar to some DP problems

### Practical Implementation Questions
10. **How would you test this solution?**
    - Test all edge cases, varying array sizes, and combinations

11. **What if the input is given as a stream instead of an array?**
    - Modify to use a deque to track the window

12. **How would you optimize for very large inputs?**
    - The sliding window approach is already optimal, but you could use faster IO methods

---

## Summary
The **Longest Subarray of 1's After Deleting One Element** problem is a classic sliding window problem that requires:

1. **Tracking Zero Count**: In each window, maintain at most one zero
2. **Sliding Window Technique**: Efficiently expand and shrink the window
3. **Edge Case Handling**: Account for all-1s and all-0s scenarios
4. **Optimal Space**: Achieve O(1) space with sliding window approach

The sliding window approach is the most efficient solution with O(n) time and O(1) space complexity, making it ideal for large input sizes up to 10^5 elements.
