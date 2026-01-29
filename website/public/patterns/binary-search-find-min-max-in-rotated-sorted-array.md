# Binary Search - Find Min/Max in Rotated Sorted Array

## Overview

This binary search variant is designed to find the minimum or maximum element in a rotated sorted array. A **rotated sorted array** is one that was originally sorted in ascending order but has been rotated (shifted) at some pivot point. For example, `[1,2,3,4,5]` rotated at index 3 becomes `[4,5,1,2,3]`.

This pattern is crucial for problems involving cyclic or rotated data structures. It leverages binary search to efficiently locate the pivot point or the min/max element in **O(log n)** time, making it ideal for scenarios where the array is large and rotation is unknown.

---

## Problem Description

### Find Minimum in Rotated Sorted Array

Given a **0-indexed** integer array `nums` that was sorted in ascending order, is rotated at an unknown pivot, and contains **distinct** elements, find and return the minimum element.

> **Requirement:** You must write an algorithm that runs in `O(log n)` time.

### Find Maximum in Rotated Sorted Array

Similarly, you can find the maximum element. The maximum element is always at the position right before the minimum element (the pivot point).

### Examples

**Example 1 (Minimum):**
| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [4,5,6,7,0,1,2]` | `0` | `0` is the minimum element |

**Example 2 (Minimum):**
| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [11,13,15,17]` | `11` | Array is not rotated, first element is minimum |

**Example 3 (Maximum):**
| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [4,5,6,7,0,1,2]` | `7` | `7` is the maximum element |

### Constraints

| Constraint | Description |
|------------|-------------|
| Array length | `1 <= nums.length <= 10^4` |
| Value range | `-2^31 <= nums[i] <= 2^31 - 1` |
| Element uniqueness | All elements are distinct (for standard version) |

---

## Intuition

The key insight behind finding the minimum/maximum in a rotated sorted array lies in understanding the **rotation property**:

### Key Properties

1. **Two Sorted Subarrays**: A rotated array consists of two sorted subarrays joined at the pivot
   - Left subarray: `[nums[0], nums[1], ..., nums[pivot-1]]`
   - Right subarray: `[nums[pivot], nums[pivot+1], ..., nums[n-1]]`

2. **Minimum Element Location**: The minimum element is always at the **pivot index** where the rotation occurred

3. **Maximum Element Location**: The maximum element is always **right before** the minimum element (at index `pivot - 1`, or `n-1` if pivot is 0)

4. **Sorted Half Property**: At any point during binary search, **one half of the array is always sorted**

### The Binary Search Insight

When comparing `nums[mid]` with `nums[right]` (or `nums[left]`):

- If `nums[mid] > nums[right]`: The minimum must be in the right half (because the rotation point is there)
- If `nums[mid] <= nums[right]`: The minimum could be at `mid` or in the left half

This allows us to eliminate half the search space at each iteration!

---

## Multiple Approaches

### Approach 1: Find Minimum - Compare with Right (Recommended)

**Idea:** Use binary search comparing mid with right element to determine which half contains the minimum.

**Why it works:** The comparison with `nums[right]` is safe because the right element is always in the sorted right subarray (or is the minimum itself).

````carousel
```python
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        """
        Finds the minimum element in a rotated sorted array.
        
        Args:
            nums: A rotated sorted list of distinct integers.
            
        Returns:
            The minimum element in the array.
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

**Explanation:**
- Initialize `left = 0` and `right = n - 1`
- While `left < right`:
  - Compute `mid = left + (right - left) // 2`
  - If `nums[mid] > nums[right]`: The minimum is in the right half, set `left = mid + 1`
  - Otherwise: The minimum is at `mid` or in the left half, set `right = mid`
- When `left == right`, we've found the minimum

---

### Approach 2: Find Minimum - Compare with Left

**Idea:** Use binary search comparing mid with left element to determine which half contains the minimum.

**Why it works:** The comparison with `nums[left]` is also valid since the left element is always in the sorted left subarray.

````carousel
```python
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        """
        Finds the minimum element using left comparison.
        
        Args:
            nums: A rotated sorted list of distinct integers.
            
        Returns:
            The minimum element in the array.
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

**Explanation:**
- The logic is symmetric to Approach 1
- If `nums[mid] < nums[left]`, the rotation point is in the left half
- Otherwise, the minimum is in the right half

---

### Approach 3: Find Maximum

**Idea:** The maximum element is always at the index right before the minimum element.

**Why it works:** In a strictly increasing rotated array, the maximum element precedes the minimum element at the pivot boundary.

````carousel
```python
from typing import List

class Solution:
    def findMax(self, nums: List[int]) -> int:
        """
        Finds the maximum element in a rotated sorted array.
        
        Args:
            nums: A rotated sorted list of distinct integers.
            
        Returns:
            The maximum element in the array.
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

**Explanation:**
- First find the minimum element index using the standard algorithm
- The maximum element is at `(min_idx - 1 + n) % n` to handle wraparound

---

### Approach 4: Find Both Min and Max in One Pass

**Idea:** Find both minimum and maximum elements in a single pass through the array.

**Why it works:** We can adapt the binary search to track both boundaries efficiently.

````carousel
```python
from typing import List, Tuple

class Solution:
    def findMinMax(self, nums: List[int]) -> Tuple[int, int]:
        """
        Finds both minimum and maximum elements in a rotated sorted array.
        
        Args:
            nums: A rotated sorted list of distinct integers.
            
        Returns:
            A tuple (minimum, maximum) of the array.
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

**Explanation:**
- Find the minimum using binary search
- The maximum is at the index immediately before the minimum
- Returns both values in a single pass

---

### Approach 5: Linear Scan (Brute Force)

**Idea:** Simply iterate through the array to find the minimum/maximum.

**When to use:** When duplicates are allowed (degrades to O(n) for duplicates).

````carousel
```python
from typing import List, Tuple

class Solution:
    def findMin_linear(self, nums: List[int]) -> int:
        """
        Finds minimum using linear scan (O(n)).
        """
        if not nums:
            raise ValueError("Array cannot be empty")
        
        min_val = nums[0]
        for num in nums:
            if num < min_val:
                min_val = num
        return min_val
    
    def findMax_linear(self, nums: List[int]) -> int:
        """
        Finds maximum using linear scan (O(n)).
        """
        if not nums:
            raise ValueError("Array cannot be empty")
        
        max_val = nums[0]
        for num in nums:
            if num > max_val:
                max_val = num
        return max_val
```
<!-- slide -->
```java
class Solution {
    public int findMin_linear(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        
        int minVal = nums[0];
        for (int num : nums) {
            if (num < minVal) {
                minVal = num;
            }
        }
        return minVal;
    }
    
    public int findMax_linear(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        
        int maxVal = nums[0];
        for (int num : nums) {
            if (num > maxVal) {
                maxVal = num;
            }
        }
        return maxVal;
    }
}
```
<!-- slide -->
```cpp
class Solution {
public:
    int findMin_linear(vector<int>& nums) {
        if (nums.empty()) {
            throw runtime_error("Array cannot be empty");
        }
        
        int minVal = nums[0];
        for (int num : nums) {
            if (num < minVal) {
                minVal = num;
            }
        }
        return minVal;
    }
    
    int findMax_linear(vector<int>& nums) {
        if (nums.empty()) {
            throw runtime_error("Array cannot be empty");
        }
        
        int maxVal = nums[0];
        for (int num : nums) {
            if (num > maxVal) {
                maxVal = num;
            }
        }
        return maxVal;
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin_linear = function(nums) {
    if (!nums || nums.length === 0) {
        throw new Error("Array cannot be empty");
    }
    
    let minVal = nums[0];
    for (const num of nums) {
        if (num < minVal) {
            minVal = num;
        }
    }
    return minVal;
};

/**
 * @param {number[]} nums
 * @return {number}
 */
var findMax_linear = function(nums) {
    if (!nums || nums.length === 0) {
        throw new Error("Array cannot be empty");
    }
    
    let maxVal = nums[0];
    for (const num of nums) {
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
};
```
````

**Explanation:**
- Simple iteration through all elements
- O(n) time complexity, not optimal but works
- Useful when duplicates are present

---

## Time/Space Complexity Summary

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Find Min (Compare with Right) | O(log n) | O(1) | Recommended, most efficient |
| Find Min (Compare with Left) | O(log n) | O(1) | Symmetric approach |
| Find Max | O(log n) | O(1) | Based on min position |
| Find Both Min/Max | O(log n) | O(1) | Single pass to find both |
| Linear Scan | O(n) | O(1) | Simple but too slow for large arrays |

---

## Detailed Complexity Analysis

### Why O(log n) for Binary Search?

In binary search, we start with a search range of n elements:
- After 1 comparison: n/2 elements remain
- After 2 comparisons: n/4 elements remain
- After k comparisons: n/2^k elements remain

The search continues until the range is empty or the minimum is found, i.e., n/2^k < 1, which means k > log₂(n).

Thus, the number of comparisons is **O(log n)**.

### Why O(n) for Linear Scan?

The linear scan visits each element exactly once, resulting in O(n) time complexity.

### Space Complexity Analysis

- **Binary search approaches**: O(1) - only uses a few variables (left, right, mid)
- **Linear scan**: O(1) - no additional space used

---

## Common Pitfalls and Edge Cases

### 1. Empty Array
Always check for empty input to avoid index errors.

```python
if not nums:
    raise ValueError("Array cannot be empty")
```

### 2. Single Element Array
A single element array is trivially both min and max.

```python
if len(nums) == 1:
    return nums[0], nums[0]
```

### 3. Non-Rotated Array
The algorithm correctly handles non-rotated arrays (already sorted).

### 4. Fully Rotated Array
When rotated n times (or 0 times), the first element is the minimum.

### 5. Duplicate Elements
The standard approach **does not work** with duplicates. When `nums[mid] == nums[right]`, we cannot determine which half contains the minimum. This degrades to O(n) in the worst case.

### 6. Integer Overflow
Use `left + (right - left) // 2` instead of `(left + right) // 2` to prevent integer overflow in some languages.

### 7. Off-by-One Errors
Be careful with pointer updates:
- `left = mid + 1` when min is in right half
- `right = mid` when min could be at mid

---

## Template Code

### Basic Template (Find Minimum)

```python
def find_min(nums):
    if not nums:
        return None
    
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return nums[left]
```

### Generic Template (Min/Max/Both)

```python
from typing import List, Optional, Tuple

def find_extremes(
    nums: List[int],
    find_min: bool = True,
    find_max: bool = True
) -> Tuple[Optional[int], Optional[int]]:
    """
    Find min/max in rotated sorted array.
    
    Args:
        nums: Input array
        find_min: Whether to find minimum
        find_max: Whether to find maximum
        
    Returns:
        Tuple of (min_val, max_val), None if not requested
    """
    if not nums:
        return None, None
    
    if len(nums) == 1:
        val = nums[0]
        return (val, val) if find_min and find_max else \
               (val, None) if find_min else (None, val)
    
    left, right = 0, len(nums) - 1
    
    # Find minimum
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    min_val = nums[left] if find_min else None
    max_val = nums[(left - 1) % len(nums)] if find_max else None
    
    return min_val, max_val
```

---

## Related Problems

| Problem | Description | Difficulty | Link |
|---------|-------------|------------|------|
| **Find Minimum in Rotated Sorted Array** | Find minimum element | Medium | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| **Find Minimum in Rotated Sorted Array II** | Find minimum with duplicates | Hard | [LC 154](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) |
| **Search in Rotated Sorted Array** | Search for a target | Medium | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| **Search in Rotated Sorted Array II** | Search with duplicates | Medium | [LC 81](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) |
| **Find Rotation Count** | Count how many times rotated | Medium | [LC 189](https://leetcode.com/problems/rotate-array/) |
| **Find Peak Element** | Find a local maximum | Medium | [LC 162](https://leetcode.com/problems/find-peak-element/) |
| **Find in Mountain Array** | Search in mountain array | Medium | [LC 1095](https://leetcode.com/problems/find-in-mountain-array/) |
| **Single Element in Sorted Array** | Find unique element | Medium | [LC 540](https://leetcode.com/problems/single-element-in-a-sorted-array/) |

---

## Video Tutorials

1. [NeetCode - Find Minimum in Rotated Sorted Array](https://www.youtube.com/watch?v=nhBVL61_M1Q)
2. [Fraz - Find Minimum in Rotated Sorted Array](https://www.youtube.com/watch?v=nhBVL61_M1Q)
3. [Binary Search on Rotated Array - Detailed Explanation](https://www.youtube.com/watch?v=5qGrJ3A4pus)
4. [Abdul Bari - Rotated Array Search](https://www.youtube.com/watch?v=vGDrW9J7f7A)
5. [Two Methods to Solve - LeetCode Discuss](https://www.youtube.com/watch?v=u4n7y4Z-e1Q)

---

## Follow-up Questions

### 1. How would you find the rotation count (how many times the array was rotated)?

**Answer:** The rotation count equals the index of the minimum element. After finding the pivot (minimum element's index), return that index as the rotation count.

```python
rotation_count = left  # Where left is the index of minimum
```

### 2. What if the array can contain duplicates?

**Answer:** When duplicates are present, the standard approach may fail because `nums[mid] == nums[right]` doesn't tell us which half contains the minimum. In this case, we need to handle duplicates by incrementing `left` when `nums[left] == nums[mid] == nums[right]`. However, this degrades to O(n) in the worst case.

```python
while left < right:
    mid = left + (right - left) // 2
    if nums[mid] > nums[right]:
        left = mid + 1
    elif nums[mid] < nums[right]:
        right = mid
    else:
        right -= 1  # Cannot determine, shrink from right
```

### 3. How would you adapt this to find the K-th smallest element?

**Answer:** You can use a modified binary search with a counting function to find elements ≤ mid, then narrow the search range based on the count.

### 4. Can you find both min and max in less than 2n comparisons?

**Answer:** Yes! You can find both in approximately 1.5n comparisons by processing elements in pairs:
- Compare elements in pairs
- Track min of pairs and max of pairs
- This reduces comparisons from 2n to about 1.5n

### 5. How would you handle a circular array (buffer)?

**Answer:** The approach is identical! A circular buffer is essentially a rotated sorted array. The minimum element is where the "wrap-around" occurs.

### 6. What if the array is rotated right instead of left?

**Answer:** The approach remains the same. A right rotation can be treated as a left rotation by `n - k` positions. The minimum element is still at the pivot point.

### 7. How would you find the median of the rotated array?

**Answer:** Once you find the pivot, you can calculate the "virtual index" of each element and use it to perform binary search for the median.

### 8. What's the difference between comparing with left vs right?

**Answer:**
- **Compare with right**: Safer because `nums[right]` is always in the sorted right subarray
- **Compare with left**: Also valid, symmetric logic
- Both achieve O(log n) with O(1) space

### 9. How would you find all local minima/maxima?

**Answer:** Use binary search to find one local extremum, then check neighbors. You can adapt the search to find all extrema by scanning adjacent elements.

### 10. How would you test edge cases for this problem?

**Answer:** Test with:
- Empty array (if allowed)
- Single element
- No rotation (already sorted)
- Fully rotated
- All elements same (if duplicates allowed)
- Target at beginning/end
- Negative numbers
- Large numbers (near integer limits)

---

## Summary

The **Find Min/Max in Rotated Sorted Array** pattern demonstrates the power of modified binary search:

### Key Insights

1. **Rotated Array Property**: A rotated array consists of two sorted subarrays joined at a pivot
2. **Binary Search Adaptation**: By comparing with boundary elements, we can determine which half contains the minimum
3. **O(log n) Efficiency**: The search space is halved at each iteration

### Algorithm Selection

| Scenario | Recommended Approach |
|----------|---------------------|
| Find minimum only | Approach 1 (Compare with Right) |
| Find maximum only | Approach 3 (Based on min position) |
| Find both | Approach 4 (Single pass) |
| Duplicates present | Approach 5 (Linear scan) or modified binary search |

### Best Practices

- Always handle edge cases (empty array, single element)
- Use `left + (right - left) // 2` to prevent overflow
- Prefer comparing with `nums[right]` for robustness
- The minimum's index equals the rotation count

This pattern is fundamental and appears in many variations. Mastery of this pattern will help you solve related problems efficiently.

---

## LeetCode Link

[Find Minimum in Rotated Sorted Array - LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

[Find Minimum in Rotated Sorted Array II - LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/)
