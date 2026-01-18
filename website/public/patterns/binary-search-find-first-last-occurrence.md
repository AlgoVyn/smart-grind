# Find First and Last Position of Element in Sorted Array

## Problem Description

Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.

If `target` is not found in the array, return `[-1, -1]`.

You must write an algorithm with O(log n) runtime complexity.

This is one of the most classic binary search problems that tests your ability to handle duplicates and find boundary positions efficiently. The challenge lies in modifying the standard binary search to continue searching even after finding a match, ensuring we find the extreme positions.

---

## Examples

**Example 1:**
```python
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
Explanation: The target 8 is found at indices 3 and 4
```

**Example 2:**
```python
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
Explanation: 6 is not found in the array
```

**Example 3:**
```python
Input: nums = [], target = 0
Output: [-1,-1]
Explanation: Empty array, target not found
```

**Example 4:**
```python
Input: nums = [1,2,3,4,5], target = 5
Output: [4,4]
Explanation: Single occurrence at index 4
```

**Example 5:**
```python
Input: nums = [1,2,2,2,3,4,5], target = 2
Output: [1,3]
Explanation: Target 2 appears at indices 1, 2, and 3
```

**Example 6:**
```python
Input: nums = [2,2,2,2,2], target = 2
Output: [0,4]
Explanation: All elements are the target
```

---

## Constraints

- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `nums` is sorted in non-decreasing order (ascending order)
- `-10^9 <= target <= 10^9`

---

## Intuition

The key insight to solve this problem efficiently is to recognize that we need to find the **boundary positions** where the target element starts and ends in the sorted array. Since the array is sorted, all occurrences of the target will be contiguous.

The challenge is that standard binary search returns any matching position, but we need the **first** (leftmost) and **last** (rightmost) positions. To achieve this with O(log n) complexity, we use a modified binary search that:

1. **For First Occurrence**: When we find the target, we continue searching in the **left half** to see if there's an earlier occurrence
2. **For Last Occurrence**: When we find the target, we continue searching in the **right half** to see if there's a later occurrence

This approach ensures we find the exact boundaries without scanning the entire array.

---

## Approach 1: Two Binary Searches (Optimal) ⭐

### Algorithm
1. Use binary search to find the first (leftmost) occurrence of target
2. Use binary search to find the last (rightmost) occurrence of target
3. Return [-1, -1] if target is not found (first occurrence returns -1)

### Code
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        Find the first and last position of target in sorted array.
        
        Args:
            nums: Sorted list of integers
            target: Target value to find
            
        Returns:
            List containing [first_position, last_position] or [-1, -1] if not found
        """
        def find_first_occurrence():
            """Find the leftmost index where target appears."""
            low, high = 0, len(nums) - 1
            first = -1
            
            while low <= high:
                mid = low + (high - low) // 2
                
                if nums[mid] >= target:
                    # When nums[mid] >= target, target could be at mid or left
                    # We update first and continue searching left
                    if nums[mid] == target:
                        first = mid
                    high = mid - 1
                else:
                    # nums[mid] < target, search right
                    low = mid + 1
            
            return first
        
        def find_last_occurrence():
            """Find the rightmost index where target appears."""
            low, high = 0, len(nums) - 1
            last = -1
            
            while low <= high:
                mid = low + (high - low) // 2
                
                if nums[mid] <= target:
                    # When nums[mid] <= target, target could be at mid or right
                    # We update last and continue searching right
                    if nums[mid] == target:
                        last = mid
                    low = mid + 1
                else:
                    # nums[mid] > target, search left
                    high = mid - 1
            
            return last
        
        if not nums:
            return [-1, -1]
        
        first = find_first_occurrence()
        # If first is -1, target doesn't exist, return early
        if first == -1:
            return [-1, -1]
        
        last = find_last_occurrence()
        return [first, last]
```

### Time Complexity
**O(log n)** - Two binary searches, each O(log n), combined still O(log n)

### Space Complexity
**O(1)** - Constant extra space, only using a few variables

---

## Approach 2: Single Binary Search with Result Tracking

### Algorithm
1. Perform binary search while tracking potential first and last positions
2. When target is found, record the position and continue searching both directions
3. Update first and last positions as we find more occurrences

### Code
```python
from typing import List

class Solution:
    def searchRange_single_bs(self, nums: List[int], target: int) -> List[int]:
        """
        Find first and last position using a single binary search pass.
        Less efficient but demonstrates the concept clearly.
        """
        if not nums:
            return [-1, -1]
            
        left, right = 0, len(nums) - 1
        first, last = -1, -1
        
        while left <= right:
            mid = left + (right - left) // 2
            
            if nums[mid] < target:
                left = mid + 1
            elif nums[mid] > target:
                right = mid - 1
            else:
                # Found target, record position and search both directions
                first = mid
                last = mid
                
                # Search left for first occurrence
                temp_left = mid - 1
                while temp_left >= left and nums[temp_left] == target:
                    first = temp_left
                    temp_left -= 1
                
                # Search right for last occurrence
                temp_right = mid + 1
                while temp_right <= right and nums[temp_right] == target:
                    last = temp_right
                    temp_right += 1
                
                break
        
        return [first, last]
```

### Time Complexity
**O(log n + k)** where k is the number of occurrences (linear scan from found position)

### Space Complexity
**O(1)** - Constant extra space

**Note**: This approach is less efficient when there are many duplicates. Approach 1 is preferred.

---

## Approach 3: Built-in Functions (Pythonic)

### Algorithm
1. Use Python's built-in `bisect_left` to find the first occurrence
2. Use Python's built-in `bisect_right` to find the position after the last occurrence
3. Return positions if they are valid and contain the target

### Code
```python
from typing import List
import bisect

class Solution:
    def searchRange_bisect(self, nums: List[int], target: int) -> List[int]:
        """
        Pythonic solution using bisect module.
        bisect_left returns the first position where target could be inserted
        bisect_right returns the position after the last occurrence
        """
        if not nums:
            return [-1, -1]
        
        left = bisect.bisect_left(nums, target)
        right = bisect.bisect_right(nums, target)
        
        # Check if target actually exists
        if left == right or left >= len(nums) or nums[left] != target:
            return [-1, -1]
        
        return [left, right - 1]
```

### Time Complexity
**O(log n)** - bisect operations are binary searches

### Space Complexity
**O(1)** - No extra space used

---

## Step-by-Step Example

Let's trace through `nums = [5,7,7,8,8,10], target = 8`:

**First Occurrence Search:**
```
Step 1: low=0, high=5, mid=3
        nums[3] = 8 >= target (8), nums[3] == target
        first = 3, high = 2

Step 2: low=0, high=2, mid=1
        nums[1] = 7 < target (8)
        low = 2

Step 3: low=2, high=2, mid=2
        nums[2] = 7 < target (8)
        low = 3

Loop exits, first = 3 ✓
```

**Last Occurrence Search:**
```
Step 1: low=0, high=5, mid=3
        nums[3] = 8 <= target (8), nums[3] == target
        last = 3, low = 4

Step 2: low=4, high=5, mid=4
        nums[4] = 8 <= target (8), nums[4] == target
        last = 4, low = 5

Step 3: low=5, high=5, mid=5
        nums[5] = 10 > target (8)
        high = 4

Loop exits, last = 4 ✓
```

**Result: [3, 4]** ✓

---

## Key Patterns and Insights

### Pattern 1: Binary Search for First Position
When searching for the first occurrence:
- If `nums[mid] < target`: search right (low = mid + 1)
- If `nums[mid] >= target`: update answer and search left (high = mid - 1)

### Pattern 2: Binary Search for Last Position
When searching for the last occurrence:
- If `nums[mid] > target`: search left (high = mid - 1)
- If `nums[mid] <= target`: update answer and search right (low = mid + 1)

### Pattern 3: Handling Edge Cases
- Empty array: return [-1, -1]
- Single element: check if it equals target
- All duplicates: first = 0, last = n-1
- Target smaller than all: return [-1, -1]
- Target larger than all: return [-1, -1]

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Two Binary Searches | O(log n) | O(1) | **Optimal** - preferred solution |
| Single BS with Linear Scan | O(log n + k) | O(1) | Less efficient with many duplicates |
| Built-in bisect | O(log n) | O(1) | Clean, Pythonic solution |

---

## Related Problems

1. **[Binary Search](binary-search.md)** - Basic binary search for single occurrence
2. **[Search in Rotated Sorted Array](binary-search-find-min-max-in-rotated-sorted-array.md)** - Find element in rotated sorted array
3. **[Count of Target in Sorted Array](arrays-hashing.md)** - Count occurrences using first/last positions
4. **[Find Smallest Letter Greater Than Target](binary-search-on-sorted-array-list.md)** - Find next greater element
5. **[Search Insert Position](binary-search-on-sorted-array-list.md)** - Find where to insert target
6. **[Median of Two Sorted Arrays](binary-search-median-kth-across-two-sorted-arrays.md)** - Advanced binary search on two arrays

---

## Video Tutorials

- [NeetCode - Find First and Last Position](https://www.youtube.com/watch?v=4sQL7R5E5sM)
- [Back to Back SWE - First and Last Position](https://www.youtube.com/watch?v=OEaJ4Dx4KcI)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=OEaJ4Dx4KcI)
- [Abdul Bari - Binary Search Variations](https://www.youtube.com/watch?v=j5uXy3PI0yM)

---

## Follow-up Questions

1. **How would you count the number of occurrences of target?** 
   - Answer: `count = last_position - first_position + 1`

2. **What if you need to find all occurrences in O(log n + k) time?**
   - Answer: Use binary search to find first, then scan forward k times

3. **How would you handle a rotated sorted array?**
   - Answer: Modify binary search to handle rotation point

4. **What if duplicates can exist in a rotated array?**
   - Answer: More complex, need to skip duplicates carefully

5. **How would you find the first element greater than target?**
   - Answer: Similar to first occurrence, but use `>` instead of `>=`

6. **What if you need to find the k-th occurrence of target?**
   - Answer: `position = first_position + k - 1` if it exists

7. **How would you modify the solution for a 2D sorted matrix?**
   - Answer: Binary search on rows and columns, or use divide and conquer

---

## Common Mistakes to Avoid

1. **Not handling empty arrays** - Always check for `len(nums) == 0`
2. **Infinite loops** - Ensure pointers are updated correctly (avoid `low = mid` or `high = mid`)
3. **Integer overflow** - Use `mid = low + (high - low) // 2` instead of `(low + high) // 2`
4. **Off-by-one errors** - Be careful with `<=` vs `<` and `+1` vs `-1`
5. **Not checking if target exists** - Verify first position contains target before searching for last
6. **Confusing first and last search logic** - First searches left when found, last searches right
7. **Returning wrong values when target not found** - Should return [-1, -1], not [0, -1]

---

## References

- [LeetCode 34 - Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- Binary Search Algorithm: Classic algorithm for sorted arrays
- bisect Module: Python's built-in binary search utilities
- Two Pointers Pattern: Related technique for array problems

