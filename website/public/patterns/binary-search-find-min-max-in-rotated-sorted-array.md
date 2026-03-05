# Binary Search - Find Min/Max in Rotated Sorted Array

## Problem Description

The Binary Search - Find Min/Max in Rotated Sorted Array pattern is designed to find the minimum or maximum element in a rotated sorted array. A **rotated sorted array** is one that was originally sorted in ascending order but has been rotated (shifted) at some pivot point. For example, `[1,2,3,4,5]` rotated at index 3 becomes `[4,5,1,2,3]`.

This pattern is crucial for problems involving cyclic or rotated data structures. It leverages binary search to efficiently locate the pivot point or the min/max element in **O(log n)** time.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(log n) - Binary search on rotated array |
| Space Complexity | O(1) - Constant extra space |
| Input | Rotated sorted array of distinct integers |
| Output | Minimum or maximum element value |
| Approach | Modified binary search comparing mid with boundary elements |

### When to Use

- Finding minimum/maximum in a rotated sorted array
- Determining the rotation count (pivot index) of a sorted array
- Searching for elements in rotated sorted arrays
- Problems involving circular buffers or cyclic data structures
- Finding pivot points where array properties change

## Intuition

The key insight behind finding the minimum/maximum in a rotated sorted array lies in understanding the **rotation property**.

The "aha!" moments:
1. **Two Sorted Subarrays**: A rotated array consists of two sorted subarrays joined at the pivot
2. **Minimum at Pivot**: The minimum element is always at the pivot index where rotation occurred
3. **Maximum Before Pivot**: The maximum element is always right before the minimum element
4. **One Half Always Sorted**: At any point during binary search, one half of the array is always sorted
5. **Comparison Strategy**: Compare `nums[mid]` with `nums[right]` to determine which half contains the minimum

## Solution Approaches

### Approach 1: Find Minimum - Compare with Right (Optimal) ✅ Recommended

#### Algorithm
1. Initialize `left = 0` and `right = n - 1`
2. While `left < right`:
   - Compute `mid = left + (right - left) // 2`
   - If `nums[mid] > nums[right]`: The minimum is in the right half, set `left = mid + 1`
   - Otherwise: The minimum is at `mid` or in the left half, set `right = mid`
3. When `left == right`, we've found the minimum at `nums[left]`

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        """
        Finds the minimum element in a rotated sorted array.
        LeetCode 153 - Find Minimum in Rotated Sorted Array
        
        Time: O(log n), Space: O(1)
        """
        if not nums:
            raise ValueError("Array cannot be empty")
        
        left, right = 0, len(nums) - 1
        
        # Binary search for minimum
        while left < right:
            mid = left + (right - left) // 2
            
            # If mid element is greater than right, min is in right half
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                # Min is in left half or at mid
                right = mid
        
        return nums[left]
```
<!-- slide -->
```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        if (nums.empty()) {
            throw runtime_error("Array cannot be empty");
        }
        
        int left = 0, right = nums.size() - 1;
        
        // Binary search for minimum
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If mid element is greater than right, min is in right half
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                // Min is in left half or at mid
                right = mid;
            }
        }
        
        return nums[left];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findMin(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        
        int left = 0, right = nums.length - 1;
        
        // Binary search for minimum
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If mid element is greater than right, min is in right half
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                // Min is in left half or at mid
                right = mid;
            }
        }
        
        return nums[left];
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    if (!nums || nums.length === 0) {
        throw new Error("Array cannot be empty");
    }
    
    let left = 0, right = nums.length - 1;
    
    // Binary search for minimum
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        // If mid element is greater than right, min is in right half
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            // Min is in left half or at mid
            right = mid;
        }
    }
    
    return nums[left];
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - Binary search halves the search space each iteration |
| Space | O(1) - Only uses a few variables |

### Approach 2: Find Minimum - Compare with Left

#### Algorithm
1. Initialize `left = 0` and `right = n - 1`
2. While `left < right`:
   - Compute `mid = left + (right - left) // 2`
   - If `nums[mid] < nums[left]`: The minimum is in the left half, set `right = mid`
   - Otherwise: The minimum is in the right half, set `left = mid + 1`
3. Return `nums[left]`

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        """
        Finds the minimum element using left comparison.
        LeetCode 153 - Alternative approach
        
        Time: O(log n), Space: O(1)
        """
        if not nums:
            raise ValueError("Array cannot be empty")
        
        left, right = 0, len(nums) - 1
        
        # Binary search for minimum using left comparison
        while left < right:
            mid = left + (right - left) // 2
            
            # If mid element is less than left, min is in left half
            if nums[mid] < nums[left]:
                right = mid
            else:
                # Min is in right half (mid+1 to right)
                left = mid + 1
        
        return nums[left]
```
<!-- slide -->
```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        if (nums.empty()) {
            throw runtime_error("Array cannot be empty");
        }
        
        int left = 0, right = nums.size() - 1;
        
        // Binary search for minimum using left comparison
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If mid element is less than left, min is in left half
            if (nums[mid] < nums[left]) {
                right = mid;
            } else {
                // Min is in right half (mid+1 to right)
                left = mid + 1;
            }
        }
        
        return nums[left];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findMin(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        
        int left = 0, right = nums.length - 1;
        
        // Binary search for minimum using left comparison
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If mid element is less than left, min is in left half
            if (nums[mid] < nums[left]) {
                right = mid;
            } else {
                // Min is in right half (mid+1 to right)
                left = mid + 1;
            }
        }
        
        return nums[left];
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    if (!nums || nums.length === 0) {
        throw new Error("Array cannot be empty");
    }
    
    let left = 0, right = nums.length - 1;
    
    // Binary search for minimum using left comparison
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        // If mid element is less than left, min is in left half
        if (nums[mid] < nums[left]) {
            right = mid;
        } else {
            // Min is in right half (mid+1 to right)
            left = mid + 1;
        }
    }
    
    return nums[left];
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - Binary search halves the search space |
| Space | O(1) - Constant extra space |

### Approach 3: Find Maximum

#### Algorithm
1. Find the minimum element index using the standard algorithm
2. The maximum element is at `(min_idx - 1 + n) % n` to handle wraparound
3. Return `nums[max_idx]`

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def findMax(self, nums: List[int]) -> int:
        """
        Finds the maximum element in a rotated sorted array.
        Maximum is always at index (min_index - 1)
        
        Time: O(log n), Space: O(1)
        """
        if not nums:
            raise ValueError("Array cannot be empty")
        
        # Find the minimum first
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = left + (right - left) // 2
            
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        
        # Maximum is at (minimum_index - 1) % n
        max_idx = (left - 1) % len(nums)
        return nums[max_idx]
```
<!-- slide -->
```cpp
class Solution {
public:
    int findMax(vector<int>& nums) {
        if (nums.empty()) {
            throw runtime_error("Array cannot be empty");
        }
        
        // Find the minimum first
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // Maximum is at (minimum_index - 1) % n
        int maxIdx = (left - 1 + nums.size()) % nums.size();
        return nums[maxIdx];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findMax(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        
        // Find the minimum first
        int left = 0, right = nums.length - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // Maximum is at (minimum_index - 1) % n
        int maxIdx = (left - 1 + nums.length) % nums.length;
        return nums[maxIdx];
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMax = function(nums) {
    if (!nums || nums.length === 0) {
        throw new Error("Array cannot be empty");
    }
    
    // Find the minimum first
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    // Maximum is at (minimum_index - 1) % n
    const maxIdx = (left - 1 + nums.length) % nums.length;
    return nums[maxIdx];
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - One binary search to find minimum |
| Space | O(1) - Constant extra space |

### Approach 4: Find Both Min and Max in One Pass

#### Algorithm
1. Use binary search to find the minimum element index
2. Calculate maximum index as `(min_idx - 1 + n) % n`
3. Return both values

#### Implementation

````carousel
```python
from typing import List, Tuple

class Solution:
    def findMinMax(self, nums: List[int]) -> Tuple[int, int]:
        """
        Finds both minimum and maximum elements in a rotated sorted array.
        
        Time: O(log n), Space: O(1)
        """
        if not nums:
            raise ValueError("Array cannot be empty")
        
        if len(nums) == 1:
            return nums[0], nums[0]
        
        left, right = 0, len(nums) - 1
        
        # Binary search to find minimum
        while left < right:
            mid = left + (right - left) // 2
            
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        
        min_val = nums[left]
        max_val = nums[(left - 1) % len(nums)]
        
        return min_val, max_val
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> findMinMax(vector<int>& nums) {
        if (nums.empty()) {
            throw runtime_error("Array cannot be empty");
        }
        
        if (nums.size() == 1) {
            return {nums[0], nums[0]};
        }
        
        int left = 0, right = nums.size() - 1;
        
        // Binary search to find minimum
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        int minVal = nums[left];
        int maxVal = nums[(left - 1 + nums.size()) % nums.size()];
        
        return {minVal, maxVal};
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] findMinMax(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        
        if (nums.length == 1) {
            return new int[]{nums[0], nums[0]};
        }
        
        int left = 0, right = nums.length - 1;
        
        // Binary search to find minimum
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        int minVal = nums[left];
        int maxVal = nums[(left - 1 + nums.length) % nums.length];
        
        return new int[]{minVal, maxVal};
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findMinMax = function(nums) {
    if (!nums || nums.length === 0) {
        throw new Error("Array cannot be empty");
    }
    
    if (nums.length === 1) {
        return [nums[0], nums[0]];
    }
    
    let left = 0, right = nums.length - 1;
    
    // Binary search to find minimum
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    const minVal = nums[left];
    const maxVal = nums[(left - 1 + nums.length) % nums.length];
    
    return [minVal, maxVal];
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - Single binary search to find minimum |
| Space | O(1) - Constant extra space |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Find Min (Compare with Right) | O(log n) | O(1) | **Recommended** - Most robust approach |
| Find Min (Compare with Left) | O(log n) | O(1) | Alternative, symmetric logic |
| Find Max | O(log n) | O(1) | When only maximum is needed |
| Find Both Min/Max | O(log n) | O(1) | When both values are needed |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | 153 | Medium | Find minimum element |
| [Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) | 154 | Hard | Find minimum with duplicates |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | 33 | Medium | Search for a target |
| [Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) | 81 | Medium | Search with duplicates |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element/) | 162 | Medium | Find a local maximum |
| [Find in Mountain Array](https://leetcode.com/problems/find-in-mountain-array/) | 1095 | Hard | Search in mountain array |
| [Single Element in Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/) | 540 | Medium | Find unique element |

## Video Tutorial Links

1. **[NeetCode - Find Minimum in Rotated Sorted Array](https://www.youtube.com/watch?v=nhBVL61_M1Q)** - Clear explanation
2. **[Fraz - Find Minimum in Rotated Sorted Array](https://www.youtube.com/watch?v=nhBVL61_M1Q)** - Step-by-step walkthrough
3. **[Binary Search on Rotated Array](https://www.youtube.com/watch?v=5qGrJ3A4pus)** - Detailed explanation
4. **[Abdul Bari - Rotated Array Search](https://www.youtube.com/watch?v=vGDrW9J7f7A)** - Algorithm fundamentals
5. **[Two Methods to Solve](https://www.youtube.com/watch?v=u4n7y4Z-e1Q)** - Different approaches

## Summary

### Key Takeaways
- **Compare with right** approach is most robust: check `nums[mid] > nums[right]`
- **Minimum is at pivot**: The rotation point contains the minimum element
- **Maximum before minimum**: The element right before the pivot is the maximum
- **One half always sorted**: This property enables binary search
- **Rotation count**: The minimum's index equals how many times array was rotated

### Common Pitfalls
- Empty array handling - Always check before processing
- Single element array - Both min and max are the same element
- Non-rotated array - Algorithm correctly handles already sorted arrays
- Duplicate elements - Standard approach degrades to O(n), need modified version
- Integer overflow - Use `left + (right - left) // 2` instead of `(left + right) // 2`
- Off-by-one errors - Be careful with `left = mid + 1` vs `right = mid`

### Follow-up Questions
1. **How would you find the rotation count?**
   - Answer: The rotation count equals the index of the minimum element

2. **What if the array can contain duplicates?**
   - Answer: When `nums[mid] == nums[right]`, shrink `right` by 1. Degrades to O(n) worst case

3. **How would you adapt this to find the K-th smallest element?**
   - Answer: Use modified binary search with a counting function

4. **Can you find both min and max in less than 2n comparisons?**
   - Answer: Yes! This approach finds both in O(log n)

5. **What if the array is rotated right instead of left?**
   - Answer: The approach remains the same, just different rotation interpretation

## Pattern Source

[Find Min/Max in Rotated Sorted Array Pattern](patterns/binary-search-find-min-max-in-rotated-sorted-array.md)
