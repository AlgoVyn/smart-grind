# Binary Search - Find First/Last Occurrence

## Overview

Finding the first or last occurrence of a target value in a sorted array is one of the most fundamental and frequently asked problems in technical interviews. This pattern leverages the power of binary search to achieve O(log n) time complexity, even when dealing with duplicate elements.

The key challenge is that standard binary search returns **any** matching position, but we need the **extreme** positions (leftmost for first occurrence, rightmost for last occurrence). This requires a modified binary search approach that continues searching even after finding a match.

---

## Problem Description

Given a sorted array of integers `nums` in non-decreasing order, find the starting and ending position of a given `target` value. If `target` is not found in the array, return `[-1, -1]`.

You must write an algorithm with O(log n) runtime complexity.

**LeetCode Problem:** [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

---

## Examples

### Example 1
**Input:** `nums = [5,7,7,8,8,10], target = 8`  
**Output:** `[3,4]`  
**Explanation:** The target 8 is found at indices 3 and 4.

### Example 2
**Input:** `nums = [5,7,7,8,8,10], target = 6`  
**Output:** `[-1,-1]`  
**Explanation:** 6 is not found in the array.

### Example 3
**Input:** `nums = [], target = 0`  
**Output:** `[-1,-1]`  
**Explanation:** Empty array, target not found.

### Example 4
**Input:** `nums = [1,2,3,4,5], target = 5`  
**Output:** `[4,4]`  
**Explanation:** Single occurrence at index 4.

### Example 5
**Input:** `nums = [1,2,2,2,3,4,5], target = 2`  
**Output:** `[1,3]`  
**Explanation:** Target 2 appears at indices 1, 2, and 3.

### Example 6
**Input:** `nums = [2,2,2,2,2], target = 2`  
**Output:** `[0,4]`  
**Explanation:** All elements are the target.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `0 ≤ nums.length ≤ 10^5` | Array size can be zero |
| `-10^9 ≤ nums[i] ≤ 10^9` | Integer range |
| `nums` is sorted | Non-decreasing order |
| `-10^9 ≤ target ≤ 10^9` | Target value range |

---

## Intuition

The key insight is recognizing that we need to find **boundary positions** where the target element starts and ends in the sorted array. Since the array is sorted, all occurrences of the target will be contiguous.

For O(log n) complexity, we use a modified binary search that:

1. **For First Occurrence**: When `nums[mid] >= target`, we update our answer and continue searching in the left half to find an earlier occurrence.

2. **For Last Occurrence**: When `nums[mid] <= target`, we update our answer and continue searching in the right half to find a later occurrence.

This approach ensures we find the exact boundaries without scanning the entire array.

---

## Approach 1: Two Binary Searches (Optimal) ⭐

This is the most efficient and commonly used approach. We perform two separate binary searches: one to find the first occurrence and another to find the last occurrence.

### Algorithm

1. Use binary search to find the first (leftmost) occurrence of target
2. Use binary search to find the last (rightmost) occurrence of target
3. Return `[-1, -1]` if target is not found

### Code

````carousel
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
            List containing [first_position, last_position] or [-1, -1]
        """
        def find_first_occurrence() -> int:
            """Find the leftmost index where target appears."""
            low, high = 0, len(nums) - 1
            first = -1
            
            while low <= high:
                mid = low + (high - low) // 2
                
                if nums[mid] >= target:
                    if nums[mid] == target:
                        first = mid
                    high = mid - 1
                else:
                    low = mid + 1
            
            return first
        
        def find_last_occurrence() -> int:
            """Find the rightmost index where target appears."""
            low, high = 0, len(nums) - 1
            last = -1
            
            while low <= high:
                mid = low + (high - low) // 2
                
                if nums[mid] <= target:
                    if nums[mid] == target:
                        last = mid
                    low = mid + 1
                else:
                    high = mid - 1
            
            return last
        
        if not nums:
            return [-1, -1]
        
        first = find_first_occurrence()
        if first == -1:
            return [-1, -1]
        
        last = find_last_occurrence()
        return [first, last]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        vector<int> result = {-1, -1};
        if (nums.empty()) return result;
        
        // Find first occurrence
        int low = 0, high = nums.size() - 1;
        int first = -1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] >= target) {
                if (nums[mid] == target) first = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        if (first == -1) return result;
        
        // Find last occurrence
        low = 0;
        high = nums.size() - 1;
        int last = -1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] <= target) {
                if (nums[mid] == target) last = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return {first, last};
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] result = {-1, -1};
        if (nums.length == 0) return result;
        
        // Find first occurrence
        int low = 0, high = nums.length - 1;
        int first = -1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] >= target) {
                if (nums[mid] == target) first = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        if (first == -1) return result;
        
        // Find last occurrence
        low = 0;
        high = nums.length - 1;
        int last = -1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] <= target) {
                if (nums[mid] == target) last = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        result[0] = first;
        result[1] = last;
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const result = [-1, -1];
    if (nums.length === 0) return result;
    
    // Find first occurrence
    let low = 0, high = nums.length - 1;
    let first = -1;
    
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (nums[mid] >= target) {
            if (nums[mid] === target) first = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    
    if (first === -1) return result;
    
    // Find last occurrence
    low = 0;
    high = nums.length - 1;
    let last = -1;
    
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (nums[mid] <= target) {
            if (nums[mid] === target) last = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    
    return [first, last];
};
```
````

### Time Complexity
**O(log n)** - Two binary searches, each O(log n)

### Space Complexity
**O(1)** - Constant extra space

---

## Approach 2: Built-in Functions (Pythonic)

This approach leverages Python's built-in `bisect` module, which provides efficient binary search implementations.

### Algorithm

1. Use `bisect_left()` to find the first position where target could be inserted
2. Use `bisect_right()` to find the position after the last occurrence
3. Return positions if target actually exists

### Code

````carousel
```python
from typing import List
import bisect

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        Pythonic solution using bisect module.
        bisect_left: first position where target could be inserted
        bisect_right: position after the last occurrence
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
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        vector<int> result = {-1, -1};
        if (nums.empty()) return result;
        
        // Find first occurrence using lower_bound
        auto lower = lower_bound(nums.begin(), nums.end(), target);
        if (lower == nums.end() || *lower != target) return result;
        result[0] = lower - nums.begin();
        
        // Find last occurrence using upper_bound
        auto upper = upper_bound(nums.begin(), nums.end(), target);
        result[1] = upper - nums.begin() - 1;
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] result = {-1, -1};
        if (nums.length == 0) return result;
        
        // Find first occurrence using binarySearch for range
        int first = Arrays.binarySearch(nums, target);
        if (first < 0) return result;
        
        // Find the actual first occurrence
        while (first > 0 && nums[first - 1] == target) {
            first--;
        }
        
        // Find the actual last occurrence
        int last = first;
        while (last < nums.length - 1 && nums[last + 1] == target) {
            last++;
        }
        
        result[0] = first;
        result[1] = last;
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const result = [-1, -1];
    if (nums.length === 0) return result;
    
    // Custom binary search for first occurrence
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    const first = low;
    
    // Check if target exists
    if (first >= nums.length || nums[first] !== target) {
        return result;
    }
    
    // Custom binary search for last occurrence
    low = 0;
    high = nums.length - 1;
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (nums[mid] <= target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    const last = high;
    
    return [first, last];
};
```
````

### Time Complexity
**O(log n)** - bisect operations are binary searches

### Space Complexity
**O(1)** - No extra space used

---

## Approach 3: Single Binary Search with Tracking

This approach uses a single binary search pass while tracking potential first and last positions. Less efficient but demonstrates the concept clearly.

### Algorithm

1. Perform binary search while tracking potential first and last positions
2. When target is found, record the position and continue searching both directions
3. Update first and last positions as we find more occurrences

### Code

````carousel
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
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
                while temp_left >= 0 and nums[temp_left] == target:
                    first = temp_left
                    temp_left -= 1
                
                # Search right for last occurrence
                temp_right = mid + 1
                while temp_right < len(nums) and nums[temp_right] == target:
                    last = temp_right
                    temp_right += 1
                
                break
        
        return [first, last]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        vector<int> result = {-1, -1};
        if (nums.empty()) return result;
        
        int left = 0, right = nums.size() - 1;
        int first = -1, last = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                // Found target
                first = mid;
                last = mid;
                
                // Search left
                int temp = mid - 1;
                while (temp >= 0 && nums[temp] == target) {
                    first = temp;
                    temp--;
                }
                
                // Search right
                temp = mid + 1;
                while (temp < nums.size() && nums[temp] == target) {
                    last = temp;
                    temp++;
                }
                
                break;
            }
        }
        
        result[0] = first;
        result[1] = last;
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] result = {-1, -1};
        if (nums.length == 0) return result;
        
        int left = 0, right = nums.length - 1;
        int first = -1, last = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                // Found target
                first = mid;
                last = mid;
                
                // Search left
                int temp = mid - 1;
                while (temp >= 0 && nums[temp] == target) {
                    first = temp;
                    temp--;
                }
                
                // Search right
                temp = mid + 1;
                while (temp < nums.length && nums[temp] == target) {
                    last = temp;
                    temp++;
                }
                
                break;
            }
        }
        
        result[0] = first;
        result[1] = last;
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const result = [-1, -1];
    if (nums.length === 0) return result;
    
    let left = 0, right = nums.length - 1;
    let first = -1, last = -1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        } else {
            // Found target
            first = mid;
            last = mid;
            
            // Search left
            let temp = mid - 1;
            while (temp >= 0 && nums[temp] === target) {
                first = temp;
                temp--;
            }
            
            // Search right
            temp = mid + 1;
            while (temp < nums.length && nums[temp] === target) {
                last = temp;
                temp++;
            }
            
            break;
        }
    }
    
    return [first, last];
};
```
````

### Time Complexity
**O(log n + k)** where k is the number of occurrences

### Space Complexity
**O(1)** - Constant extra space

**Note:** This approach is less efficient when there are many duplicates. Approach 1 is preferred.

---

## Step-by-Step Example

Let's trace through `nums = [5,7,7,8,8,10], target = 8`:

### First Occurrence Search

| Step | low | high | mid | nums[mid] | Action | first |
|------|-----|------|-----|-----------|--------|-------|
| 1 | 0 | 5 | 3 | 8 >= 8, nums[3] == 8 | first = 3, high = 2 | 3 |
| 2 | 0 | 2 | 1 | 7 < 8 | low = 2 | 3 |
| 3 | 2 | 2 | 2 | 7 < 8 | low = 3 | 3 |

**Result: first = 3** ✓

### Last Occurrence Search

| Step | low | high | mid | nums[mid] | Action | last |
|------|-----|------|-----|-----------|--------|------|
| 1 | 0 | 5 | 3 | 8 <= 8, nums[3] == 8 | last = 3, low = 4 | 3 |
| 2 | 4 | 5 | 4 | 8 <= 8, nums[4] == 8 | last = 4, low = 5 | 4 |
| 3 | 5 | 5 | 5 | 10 > 8 | high = 4 | 4 |

**Result: last = 4** ✓

**Final Answer: [3, 4]** ✓

---

## Key Patterns and Insights

### Pattern 1: Binary Search for First Position

When searching for the first occurrence:
- If `nums[mid] < target`: search right (`low = mid + 1`)
- If `nums[mid] >= target`: update answer and search left (`high = mid - 1`)

### Pattern 2: Binary Search for Last Position

When searching for the last occurrence:
- If `nums[mid] > target`: search left (`high = mid - 1`)
- If `nums[mid] <= target`: update answer and search right (`low = mid + 1`)

### Pattern 3: Common Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Empty array | Return `[-1, -1]` |
| Single element | Check if it equals target |
| All duplicates | first = 0, last = n-1 |
| Target smaller than all | Return `[-1, -1]` |
| Target larger than all | Return `[-1, -1]` |

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Two Binary Searches | O(log n) | O(1) | **Optimal** - preferred solution |
| Single BS with Linear Scan | O(log n + k) | O(1) | Less efficient with many duplicates |
| Built-in Functions | O(log n) | O(1) | Clean, Pythonic solution |

---

## Related LeetCode Problems

| Problem | Difficulty | Description | Link |
|---------|------------|-------------|------|
| Find First and Last Position of Element in Sorted Array | Medium | Find first and last position of target | [Link](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| Search Insert Position | Easy | Find where to insert target | [Link](https://leetcode.com/problems/search-insert-position/) |
| Find Smallest Letter Greater Than Target | Easy | Find next greater element | [Link](https://leetcode.com/problems/find-smallest-letter-greater-than-target/) |
| Count of Range Sum | Hard | Count range sum within range | [Link](https://leetcode.com/problems/count-of-range-sum/) |
| First Bad Version | Easy | Find first bad version | [Link](https://leetcode.com/problems/first-bad-version/) |
| Find Peak Element | Medium | Find any peak element | [Link](https://leetcode.com/problems/find-peak-element/) |
| Search in Rotated Sorted Array | Medium | Find element in rotated array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| Search a 2D Matrix | Medium | Search in 2D sorted matrix | [Link](https://leetcode.com/problems/search-a-2d-matrix/) |
| Find Median of Two Sorted Arrays | Hard | Find median of two arrays | [Link](https://leetcode.com/problems/median-of-two-sorted-arrays/) |

---

## Video Tutorials

| Tutorial | Platform | Link |
|----------|----------|------|
| NeetCode - Find First and Last Position | YouTube | [Watch](https://www.youtube.com/watch?v=4sQL7R5E5sM) |
| Back to Back SWE - First and Last Position | YouTube | [Watch](https://www.youtube.com/watch?v=OEaJ4Dx4KcI) |
| LeetCode Official Solution | YouTube | [Watch](https://www.youtube.com/watch?v=OEaJ4Dx4KcI) |
| Abdul Bari - Binary Search Variations | YouTube | [Watch](https://www.youtube.com/watch?v=j5uXy3PI0yM) |
| Binary Search Masterclass | YouTube | [Watch](https://www.youtube.com/watch?v=WjJdaDXN5Jw) |
| First and Last Position Explained | YouTube | [Watch](https://www.youtube.com/watch?v=n9A7G9J1Z5I) |

---

## Follow-up Questions

### 1. How would you count the number of occurrences of target?
**Answer:** `count = last_position - first_position + 1`

### 2. What if you need to find all occurrences in O(log n + k) time?
**Answer:** Use binary search to find first position, then scan forward k times to get all occurrences.

### 3. How would you handle a rotated sorted array?
**Answer:** Modify binary search to handle rotation point by checking which half is sorted.

### 4. What if duplicates can exist in a rotated array?
**Answer:** More complex, need to skip duplicates carefully and handle edge cases.

### 5. How would you find the first element greater than target?
**Answer:** Similar to first occurrence, but use `>` instead of `>=` in the condition.

### 6. What if you need to find the k-th occurrence of target?
**Answer:** `position = first_position + k - 1` if it exists within bounds.

### 7. How would you modify the solution for a 2D sorted matrix?
**Answer:** Use binary search on rows and columns, or use divide and conquer approach.

---

## Common Mistakes to Avoid

1. **Not handling empty arrays** - Always check for `len(nums) == 0` or `nums.length == 0`
2. **Infinite loops** - Ensure pointers are updated correctly (avoid `low = mid` or `high = mid`)
3. **Integer overflow** - Use `mid = low + (high - low) // 2` instead of `(low + high) // 2`
4. **Off-by-one errors** - Be careful with `<=` vs `<` and `+1` vs `-1`
5. **Not checking if target exists** - Verify first position contains target before searching for last
6. **Confusing first and last search logic** - First searches left when found, last searches right
7. **Returning wrong values when target not found** - Should return `[-1, -1]`, not `[0, -1]`

---

## References

- [LeetCode 34 - Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- Binary Search Algorithm: Classic algorithm for sorted arrays
- bisect Module: Python's built-in binary search utilities
- Two Pointers Pattern: Related technique for array problems
