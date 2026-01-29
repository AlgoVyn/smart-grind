# Find First and Last Position of Element in Sorted Array

## Problem Description

Given an integer array `nums` which is sorted in non-decreasing order, return the starting and ending position of a given `target` value. If `target` is not found in the array, return `[-1, -1]`.

You must write an algorithm with **O(log n)** runtime complexity.

### Examples

**Example 1:**
```python
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```

**Explanation:**
The target value 8 appears at indices 3 and 4 in the array.

**Example 2:**
```python
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```

**Explanation:**
The target value 6 does not exist in the array.

**Example 3:**
```python
Input: nums = [], target = 0
Output: [-1,-1]
```

**Explanation:**
An empty array cannot contain any target value.

### Constraints

- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `nums` is sorted in non-decreasing order.
- `-10^9 <= target <= 10^9`

---

## Intuition

The key insight for this problem is that we need to find both the **first occurrence** (leftmost) and **last occurrence** (rightmost) of the target value in a sorted array. Since the array is sorted, we can leverage binary search to achieve O(log n) time complexity.

### Key Observations

1. **Sorted Array Property**: In a sorted array, all occurrences of a value appear contiguously.

2. **First Occurrence**: To find the first occurrence, we need to find the leftmost position where `nums[pos] >= target`. If `nums[pos] == target`, that's our first occurrence.

3. **Last Occurrence**: To find the last occurrence, we need to find the rightmost position where `nums[pos] <= target`. If `nums[pos] == target`, that's our last occurrence.

4. **Binary Search Variants**: We need two different binary search implementations:
   - **Lower bound**: Finds first index where `nums[i] >= target`
   - **Upper bound**: Finds first index where `nums[i] > target`

5. **Monotonicity**: The array's sorted nature ensures that once we find a position where the condition flips, all subsequent positions will maintain that property.

---

## Solution Approaches

### Approach 1: Binary Search for First and Last Position (Optimal)

This is the most efficient approach that uses two separate binary searches to find the leftmost and rightmost positions of the target.

#### Algorithm

1. **Find leftmost (first) position**:
   - Initialize `left = 0`, `right = len(nums) - 1`
   - While `left <= right`:
     - Compute `mid = left + (right - left) // 2`
     - If `nums[mid] < target`: `left = mid + 1`
     - Else: `right = mid - 1`
   - After loop, `left` is the first position where `nums[left] >= target`
   - Check if `left` is within bounds and `nums[left] == target`

2. **Find rightmost (last) position**:
   - Initialize `left = 0`, `right = len(nums) - 1`
   - While `left <= right`:
     - Compute `mid = left + (right - left) // 2`
     - If `nums[mid] > target`: `right = mid - 1`
     - Else: `left = mid + 1`
   - After loop, `right` is the last position where `nums[right] <= target`
   - Check if `right` is within bounds and `nums[right] == target`

3. Return `[left, right]` if found, else `[-1, -1]`

#### Code

````carousel
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def find_left(nums: List[int], target: int) -> int:
            """Find the leftmost (first) occurrence of target"""
            left, right = 0, len(nums) - 1
            left_bound = -1
            
            while left <= right:
                mid = left + (right - left) // 2
                if nums[mid] >= target:
                    left_bound = mid
                    right = mid - 1
                else:
                    left = mid + 1
            
            return left_bound
        
        def find_right(nums: List[int], target: int) -> int:
            """Find the rightmost (last) occurrence of target"""
            left, right = 0, len(nums) - 1
            right_bound = -1
            
            while left <= right:
                mid = left + (right - left) // 2
                if nums[mid] <= target:
                    right_bound = mid
                    left = mid + 1
                else:
                    right = mid - 1
            
            return right_bound
        
        if not nums:
            return [-1, -1]
        
        left = find_left(nums, target)
        right = find_right(nums, target)
        
        # Validate both bounds
        if left == -1 or right == -1 or left > right:
            return [-1, -1]
        
        return [left, right]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        auto find_left = [&](vector<int>& nums, int target) -> int {
            int left = 0, right = nums.size() - 1;
            int left_bound = -1;
            
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] >= target) {
                    left_bound = mid;
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
            return left_bound;
        };
        
        auto find_right = [&](vector<int>& nums, int target) -> int {
            int left = 0, right = nums.size() - 1;
            int right_bound = -1;
            
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] <= target) {
                    right_bound = mid;
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            return right_bound;
        };
        
        if (nums.empty()) return {-1, -1};
        
        int left = find_left(nums, target);
        int right = find_right(nums, target);
        
        if (left == -1 || right == -1 || left > right) return {-1, -1};
        
        return {left, right};
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] searchRange(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return new int[]{-1, -1};
        }
        
        int left = findLeft(nums, target);
        int right = findRight(nums, target);
        
        if (left == -1 || right == -1 || left > right) {
            return new int[]{-1, -1};
        }
        
        return new int[]{left, right};
    }
    
    private int findLeft(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        int left_bound = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                left_bound = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return left_bound;
    }
    
    private int findRight(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        int right_bound = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) {
                right_bound = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return right_bound;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const findLeft = (nums, target) => {
        let left = 0, right = nums.length - 1;
        let left_bound = -1;
        
        while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (nums[mid] >= target) {
                left_bound = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return left_bound;
    };
    
    const findRight = (nums, target) => {
        let left = 0, right = nums.length - 1;
        let right_bound = -1;
        
        while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (nums[mid] <= target) {
                right_bound = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return right_bound;
    };
    
    if (!nums || nums.length === 0) {
        return [-1, -1];
    }
    
    const left = findLeft(nums, target);
    const right = findRight(nums, target);
    
    if (left === -1 || right === -1 || left > right) {
        return [-1, -1];
    }
    
    return [left, right];
};
```
````

#### Step-by-Step Example

For `nums = [5,7,7,8,8,10]` and `target = 8`:

**Finding leftmost position:**
- Initial: `left = 0`, `right = 5`, `left_bound = -1`
- Iteration 1: `mid = 2`, `nums[2] = 7 < 8` → `left = 3`, `left_bound = -1`
- Iteration 2: `mid = 4`, `nums[4] = 8 >= 8` → `left_bound = 4`, `right = 3`
- Loop ends, `left = 3`, `left_bound = 4` → But we need to return the smallest valid index
- Correction: After loop, `left` points to the first index where `nums[left] >= target`
- Final left = 3 (correct)

**Finding rightmost position:**
- Initial: `left = 0`, `right = 5`, `right_bound = -1`
- Iteration 1: `mid = 2`, `nums[2] = 7 <= 8` → `right_bound = 2`, `left = 3`
- Iteration 2: `mid = 4`, `nums[4] = 8 <= 8` → `right_bound = 4`, `left = 5`
- Iteration 3: `mid = 5`, `nums[5] = 10 > 8` → `right = 4`
- Loop ends, `right = 4` (correct)

**Result:** `[3, 4]`

### Approach 2: Binary Search with Lower and Upper Bound

This approach uses the classic lower bound and upper bound binary search patterns to find the first and last positions.

#### Algorithm

1. **Lower bound**: Find first index where `nums[i] >= target`
   - This is the potential start of the range

2. **Upper bound**: Find first index where `nums[i] > target`
   - This is one past the end of the range

3. **Calculate positions**:
   - First position = lower_bound index
   - Last position = upper_bound index - 1
   - If first position is out of bounds or doesn't contain target, return `[-1, -1]`

#### Code

````carousel
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lower_bound(nums: List[int], target: int) -> int:
            """Find first index where nums[i] >= target"""
            left, right = 0, len(nums)
            
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid
            
            return left
        
        def upper_bound(nums: List[int], target: int) -> int:
            """Find first index where nums[i] > target"""
            left, right = 0, len(nums)
            
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid
            
            return left
        
        if not nums:
            return [-1, -1]
        
        left = lower_bound(nums, target)
        right = upper_bound(nums, target)
        
        # Check if target exists in the array
        if left == right or left >= len(nums) or nums[left] != target:
            return [-1, -1]
        
        return [left, right - 1]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        auto lower_bound = [&](vector<int>& nums, int target) -> int {
            int left = 0, right = nums.size();
            
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        };
        
        auto upper_bound = [&](vector<int>& nums, int target) -> int {
            int left = 0, right = nums.size();
            
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] <= target) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        };
        
        if (nums.empty()) return {-1, -1};
        
        int left = lower_bound(nums, target);
        int right = upper_bound(nums, target);
        
        if (left == right || left >= nums.size() || nums[left] != target) {
            return {-1, -1};
        }
        
        return {left, right - 1};
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] searchRange(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return new int[]{-1, -1};
        }
        
        int left = lowerBound(nums, target);
        int right = upperBound(nums, target);
        
        if (left == right || left >= nums.length || nums[left] != target) {
            return new int[]{-1, -1};
        }
        
        return new int[]{left, right - 1};
    }
    
    private int lowerBound(int[] nums, int target) {
        int left = 0, right = nums.length;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
    
    private int upperBound(int[] nums, int target) {
        int left = 0, right = nums.length;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
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
    const lowerBound = (nums, target) => {
        let left = 0, right = nums.length;
        
        while (left < right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };
    
    const upperBound = (nums, target) => {
        let left = 0, right = nums.length;
        
        while (left < right) {
            const mid = Math.floor(left + (right - left) / 2);
            if (nums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };
    
    if (!nums || nums.length === 0) {
        return [-1, -1];
    }
    
    const left = lowerBound(nums, target);
    const right = upperBound(nums, target);
    
    if (left === right || left >= nums.length || nums[left] !== target) {
        return [-1, -1];
    }
    
    return [left, right - 1];
};
```
````

### Approach 3: Single Binary Search with Range Expansion

This approach finds one occurrence of the target and then expands left and right to find the boundaries.

#### Algorithm

1. Use standard binary search to find any occurrence of target
2. If found, expand leftwards to find the first occurrence
3. Expand rightwards to find the last occurrence
4. If not found, return `[-1, -1]`

#### Code

````carousel
```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        if not nums:
            return [-1, -1]
        
        # Standard binary search to find any occurrence
        left, right = 0, len(nums) - 1
        found = -1
        
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                found = mid
                break
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        # Target not found
        if found == -1:
            return [-1, -1]
        
        # Expand left to find first occurrence
        left = found
        while left > 0 and nums[left - 1] == target:
            left -= 1
        
        # Expand right to find last occurrence
        right = found
        while right < len(nums) - 1 and nums[right + 1] == target:
            right += 1
        
        return [left, right]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        if (nums.empty()) return {-1, -1};
        
        // Standard binary search to find any occurrence
        int left = 0, right = nums.size() - 1;
        int found = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                found = mid;
                break;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        // Target not found
        if (found == -1) return {-1, -1};
        
        // Expand left to find first occurrence
        left = found;
        while (left > 0 && nums[left - 1] == target) {
            left--;
        }
        
        // Expand right to find last occurrence
        right = found;
        while (right < nums.size() - 1 && nums[right + 1] == target) {
            right++;
        }
        
        return {left, right};
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] searchRange(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return new int[]{-1, -1};
        }
        
        // Standard binary search to find any occurrence
        int left = 0, right = nums.length - 1;
        int found = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                found = mid;
                break;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        // Target not found
        if (found == -1) {
            return new int[]{-1, -1};
        }
        
        // Expand left to find first occurrence
        left = found;
        while (left > 0 && nums[left - 1] == target) {
            left--;
        }
        
        // Expand right to find last occurrence
        right = found;
        while (right < nums.length - 1 && nums[right + 1] == target) {
            right++;
        }
        
        return new int[]{left, right};
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
    if (!nums || nums.length === 0) {
        return [-1, -1];
    }
    
    // Standard binary search to find any occurrence
    let left = 0, right = nums.length - 1;
    let found = -1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) {
            found = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    // Target not found
    if (found === -1) {
        return [-1, -1];
    }
    
    // Expand left to find first occurrence
    left = found;
    while (left > 0 && nums[left - 1] === target) {
        left--;
    }
    
    // Expand right to find last occurrence
    right = found;
    while (right < nums.length - 1 && nums[right + 1] === target) {
        right++;
    }
    
    return [left, right];
};
```
````

---

## Time and Space Complexity Analysis

### Approach 1: Binary Search for First and Last Position
- **Time Complexity**: O(log n)
  - Two separate binary searches, each O(log n)
  - Total: 2 × O(log n) = O(log n)
- **Space Complexity**: O(1)
  - Only uses a constant number of variables
  - No additional data structures

### Approach 2: Binary Search with Lower and Upper Bound
- **Time Complexity**: O(log n)
  - Lower bound: O(log n)
  - Upper bound: O(log n)
  - Total: O(log n)
- **Space Complexity**: O(1)
  - Only uses a constant number of variables

### Approach 3: Single Binary Search with Range Expansion
- **Time Complexity**: O(log n + k) where k is the number of occurrences
  - Binary search: O(log n)
  - Left expansion: O(k_left) where k_left is the distance to first occurrence
  - Right expansion: O(k_right) where k_right is the distance to last occurrence
  - In worst case (all elements are target): O(n)
- **Space Complexity**: O(1)
  - Only uses a constant number of variables

### Comparison
| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Binary Search (First/Last) | O(log n) | O(1) | ✅ Optimal, most clear |
| Lower/Upper Bound | O(log n) | O(1) | ✅ Clean, mathematical |
| Single Search + Expand | O(log n + k) | O(1) | ⚠️ Worst case O(n) |

---

## Related Problems

1. **[First Bad Version](https://leetcode.com/problems/first-bad-version/)**
   - Find the first version where something changed, similar first occurrence pattern

2. **[Search Insert Position](https://leetcode.com/problems/search-insert-position/)**
   - Find where an element should be inserted in a sorted array

3. **[Find Peak Element](https://leetcode.com/problems/find-peak-element/)**
   - Find any peak element using binary search

4. **[Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)**
   - Search in a rotated sorted array

5. **[Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)**
   - Count numbers in range using similar binary search techniques

6. **[Find Kth Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)**
   - Uses binary search on answer space

---

## Video Tutorial Links

1. **[Find First and Last Position of Element in Sorted Array - LeetCode 34](https://www.youtube.com/watch?v=4sQL7R5F1gY)** by Nick White
2. **[Binary Search: Find First and Last Position](https://www.youtube.com/watch?v=OE7wU2B0ZQQ)** by Back to Back SWE
3. **[Lower Bound and Upper Bound in Binary Search](https://www.youtube.com/watch?v=3K88B3X5-nQ)** by CodeWithMosh
4. **[LeetCode 34 Solution with Explanation](https://www.youtube.com/watch?v=16F6A6_2uOo)** by NeetCode

---

## Follow-up Questions

1. **How would you modify the solution to find all occurrences of all target values?**
   - **Answer:** Use a single pass through the array with a modified binary search that collects all indices where the target appears. Alternatively, you can find the first and last occurrence for each unique target value and store all indices in a list.

2. **What if the array contains duplicates and you need to find the first occurrence of the smallest duplicate?**
   - **Answer:** First, find all unique values in the array. Then find the minimum value that appears more than once. Use the standard first/last occurrence binary search to get the range for that value.

3. **How would you implement this without using binary search?**
   - **Answer:** Use linear search to scan through the array and record the first and last occurrence of the target. This would be O(n) time complexity, which doesn't meet the O(log n) requirement.

4. **What if you need to find the first occurrence of the ceiling of the target (smallest value >= target)?**
   - **Answer:** This is exactly what the lower bound binary search does. Use the first approach's `find_left` function, which returns the first index where `nums[i] >= target`.

5. **How would you handle very large arrays (e.g., 10^10 elements) that don't fit in memory?**
   - **Answer:** The binary search algorithm itself doesn't need to store the entire array. You would need a storage system that supports range queries (like a database or distributed file system) and can retrieve elements by index. The algorithm would make O(log n) remote calls.

6. **Can you implement this using recursion instead of iteration?**
   - **Answer:** Yes, both binary search approaches can be implemented recursively. However, this would use O(log n) stack space instead of O(1), which could be a concern for very large arrays.

7. **What if the array is sorted in decreasing order?**
   - **Answer:** You would need to modify the binary search conditions. For decreasing order, when looking for the first occurrence, you'd check `nums[mid] <= target` to move left, and `nums[mid] > target` to move right. The logic would be reversed.

8. **How would you find the total count of occurrences efficiently?**
   - **Answer:** Use the first approach to find the first and last occurrence. The count is simply `last - first + 1`. This is O(log n) time complexity.

---

## Summary

The **Find First and Last Position of Element in Sorted Array** problem is a classic application of binary search. The key insights are:

1. **Two Binary Searches**: We need two separate binary searches to find the leftmost and rightmost positions of the target.

2. **Lower/Upper Bound Pattern**: The most elegant solution uses the lower bound and upper bound binary search patterns.

3. **O(log n) Time Complexity**: Both optimal approaches achieve the required O(log n) time complexity.

4. **O(1) Space Complexity**: Neither approach requires additional data structures beyond a few variables.

The first approach (Binary Search for First and Last Position) is recommended because:
- It directly computes both boundaries
- It's easy to understand and implement
- It handles edge cases well (empty array, target not found)

Understanding this pattern is crucial for solving many similar problems involving searching in sorted arrays with specific boundary conditions.
