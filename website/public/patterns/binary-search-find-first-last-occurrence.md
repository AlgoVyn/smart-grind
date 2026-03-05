# Binary Search - Find First/Last Occurrence

## Problem Description

The Binary Search - Find First/Last Occurrence pattern is used to locate the starting and ending positions of a target value in a sorted array that may contain duplicates. While standard binary search returns any matching position, this pattern finds the extreme positions (leftmost for first occurrence, rightmost for last occurrence) in O(log n) time complexity.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(log n) - Two binary searches, each O(log n) |
| Space Complexity | O(1) - Constant extra space |
| Input | Sorted array of integers in non-decreasing order |
| Output | Range [first_position, last_position] or [-1, -1] if not found |
| Approach | Modified binary search that continues after finding a match |

### When to Use

- Finding the starting and ending position of a target in a sorted array with duplicates
- Counting the number of occurrences of a target value
- Problems requiring boundary positions where elements start or end
- Finding insertion positions while maintaining sorted order
- Problems involving range queries on sorted data

## Intuition

The key insight is that we need to find **boundary positions** where the target element starts and ends in the sorted array. Since the array is sorted, all occurrences of the target will be contiguous.

The "aha!" moments:
1. **For First Occurrence**: When `nums[mid] >= target`, update answer and continue searching left to find an earlier occurrence
2. **For Last Occurrence**: When `nums[mid] <= target`, update answer and continue searching right to find a later occurrence
3. **Two Binary Searches**: We need separate searches for first and last positions
4. **Early Termination**: If first occurrence not found, no need to search for last
5. **Edge Cases**: Empty arrays, single elements, and targets outside range need careful handling

## Solution Approaches

### Approach 1: Two Binary Searches (Optimal) ✅ Recommended

#### Algorithm
1. Check if array is empty, return [-1, -1] if so
2. **Find First Occurrence**: Use binary search where when `nums[mid] >= target`, record position and search left half
3. **Find Last Occurrence**: Use binary search where when `nums[mid] <= target`, record position and search right half
4. If first occurrence not found, return [-1, -1]
5. Return [first, last] as the result

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        Find the first and last position of target in sorted array.
        LeetCode 34 - Find First and Last Position of Element in Sorted Array
        
        Time: O(log n), Space: O(1)
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

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - Two binary searches, each O(log n) |
| Space | O(1) - Constant extra space |

### Approach 2: Built-in Functions (Pythonic)

This approach leverages built-in binary search functions available in most languages.

#### Algorithm
1. Use lower_bound/bisect_left to find the first position where target could be inserted
2. Use upper_bound/bisect_right to find the position after the last occurrence
3. Verify target actually exists at the found position
4. Return positions or [-1, -1]

#### Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        Pythonic solution using bisect module.
        LeetCode 34 - Find First and Last Position
        
        Time: O(log n), Space: O(1)
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
        
        // Find first occurrence
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

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - Built-in binary search operations |
| Space | O(1) - No extra space used |

### Approach 3: Single Binary Search with Linear Scan

This approach uses a single binary search pass but with linear scan when target is found. Less efficient but demonstrates the concept.

#### Algorithm
1. Perform binary search for target
2. When found, scan left to find first occurrence
3. Scan right to find last occurrence
4. Return the range

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        Find first and last position using single binary search with linear scan.
        LeetCode 34 - Less efficient but demonstrates concept
        
        Time: O(log n + k) where k is number of occurrences
        Space: O(1)
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

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n + k) where k is the number of occurrences |
| Space | O(1) - Constant extra space |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Two Binary Searches | O(log n) | O(1) | **Recommended** - Optimal and clean |
| Built-in Functions | O(log n) | O(1) | When available, quick implementation |
| Single BS with Linear | O(log n + k) | O(1) | Less efficient with many duplicates |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | 34 | Medium | Find first and last position of target |
| [Search Insert Position](https://leetcode.com/problems/search-insert-position/) | 35 | Easy | Find where to insert target |
| [Find Smallest Letter Greater Than Target](https://leetcode.com/problems/find-smallest-letter-greater-than-target/) | 744 | Easy | Find next greater element |
| [First Bad Version](https://leetcode.com/problems/first-bad-version/) | 278 | Easy | Find first bad version |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element/) | 162 | Medium | Find any peak element |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | 33 | Medium | Find element in rotated array |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | 74 | Medium | Search in 2D sorted matrix |
| [Find Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | 4 | Hard | Find median of two arrays |

## Video Tutorial Links

1. **[NeetCode - Find First and Last Position](https://www.youtube.com/watch?v=4sQL7R5E5sM)** - Binary search explanation
2. **[Back to Back SWE - First and Last Position](https://www.youtube.com/watch?v=OEaJ4Dx4KcI)** - Detailed walkthrough
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=OEaJ4Dx4KcI)** - Clean implementation
4. **[Abdul Bari - Binary Search Variations](https://www.youtube.com/watch?v=j5uXy3PI0yM)** - Pattern explanation
5. **[Binary Search Masterclass](https://www.youtube.com/watch?v=WjJdaDXN5Jw)** - Comprehensive tutorial

## Summary

### Key Takeaways
- **Two binary searches** is the optimal approach: O(log n) time, O(1) space
- **First occurrence search**: When `nums[mid] >= target`, search left half
- **Last occurrence search**: When `nums[mid] <= target`, search right half
- **Count occurrences**: `count = last_position - first_position + 1`
- **Edge cases**: Handle empty arrays and targets not in array

### Common Pitfalls
- Not handling empty arrays - Always check for empty input first
- Integer overflow - Use `mid = low + (high - low) // 2` instead of `(low + high) // 2`
- Off-by-one errors - Be careful with `<=` vs `<` in loop conditions
- Not checking if target exists - Verify first position before searching for last
- Returning wrong values - Should return [-1, -1], not [0, -1] when not found

### Follow-up Questions
1. **How would you count the number of occurrences of target?**
   - Answer: `count = last_position - first_position + 1`

2. **What if you need to find all occurrences in O(log n + k) time?**
   - Answer: Use binary search to find first position, then scan forward k times

3. **How would you handle a rotated sorted array?**
   - Answer: Modify binary search to handle rotation point by checking which half is sorted

4. **What if duplicates can exist in a rotated array?**
   - Answer: More complex, need to skip duplicates carefully and handle edge cases

5. **How would you find the first element greater than target?**
   - Answer: Similar to first occurrence, but use `>` instead of `>=` in the condition

## Pattern Source

[Find First/Last Occurrence Pattern](patterns/binary-search-find-first-last-occurrence.md)
