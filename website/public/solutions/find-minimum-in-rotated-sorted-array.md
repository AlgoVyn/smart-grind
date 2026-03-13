# Find Minimum in Rotated Sorted Array

## Problem Description

Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. For example, the array `nums = [0,1,2,4,5,6,7]` might become:

- `[4,5,6,7,0,1,2]` if it was rotated 4 times.
- `[0,1,2,4,5,6,7]` if it was rotated 7 times.

Notice that rotating an array `[a[0], a[1], a[2], ..., a[n-1]]` 1 time results in the array `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`.

Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.

**Link to problem:** [Find Minimum in Rotated Sorted Array - LeetCode 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

---

## Pattern: Binary Search - Rotated Array

This problem demonstrates applying binary search to find the pivot point in a rotated sorted array.

### Core Concept

In a rotated sorted array, the minimum element is located at the pivot point where the rotation occurred. The key observations are:
- One half of the array is always sorted
- The minimum element is always less than the element at the right boundary
- Binary search can efficiently find the pivot point

---

## Examples

### Example

**Input:**
```
nums = [3,4,5,1,2]
```

**Output:**
```
1
```

**Explanation:** The original array was [1,2,3,4,5] rotated 3 times.

### Example 2

**Input:**
```
nums = [4,5,6,7,0,1,2]
```

**Output:**
```
0
```

**Explanation:** The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.

### Example 3

**Input:**
```
nums = [11,13,15,17]
```

**Output:**
```
11
```

**Explanation:** The original array was [11,13,15,17] and it was not rotated (or rotated n times).

### Example 4 (Edge Case)

**Input:**
```
nums = [1]
```

**Output:**
```
1
```

---

## Constraints

- `n == nums.length`
- `1 <= n <= 5000`
- `-5000 <= nums[i] <= 5000`
- All the integers of `nums` are unique.
- `nums` is sorted and rotated between 1 and `n` times.

---

## Intuition

The key insight is that in a rotated sorted array:
1. At least one half of the array is always sorted
2. The minimum element is the only place where the order "breaks" - it's smaller than both its neighbors
3. If `nums[mid] > nums[right]`, the minimum must be in the right half (including mid+1)
4. Otherwise, the minimum is in the left half (including mid)

This allows us to use binary search to find the pivot point efficiently.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(log n) time, O(1) space
2. **Modified Binary Search with Left Boundary** - O(log n) time, O(1) space

---

## Approach 1: Binary Search with Right Boundary (Optimal)

This is the optimal approach that achieves O(log n) time complexity. We use the fact that in a sorted (but rotated) array, if the middle element is greater than the rightmost element, the minimum must be to the right of mid.

### Algorithm Steps

1. Initialize `left = 0` and `right = len(nums) - 1`
2. While `left < right`:
   - Calculate `mid = (left + right) // 2`
   - If `nums[mid] > nums[right]`, minimum is in right half: `left = mid + 1`
   - Otherwise, minimum is in left half (including mid): `right = mid`
3. When loop exits, `left == right`, which points to the minimum element
4. Return `nums[left]`

### Why It Works

The key insight is comparing `nums[mid]` with `nums[right]`:
- If `nums[mid] > nums[right]`, the rotation point (minimum) must be to the right of mid
- Otherwise, the minimum is at mid or to the left of mid

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        """
        Find the minimum element in a rotated sorted array.
        
        Args:
            nums: A rotated sorted array of unique integers
            
        Returns:
            The minimum element in the array
        """
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = (left + right) // 2
            # If mid element is greater than right element,
            # minimum is in the right half
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                # Minimum is in left half (including mid)
                right = mid
        
        return nums[left]
```

<!-- slide -->
```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        /**
         * Find the minimum element in a rotated sorted array.
         * 
         * @param nums - A rotated sorted array of unique integers
         * @return The minimum element in the array
         */
        int left = 0;
        int right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If mid element is greater than right element,
            // minimum is in the right half
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                // Minimum is in left half (including mid)
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
        /**
         * Find the minimum element in a rotated sorted array.
         * 
         * @param nums - A rotated sorted array of unique integers
         * @return The minimum element in the array
         */
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If mid element is greater than right element,
            // minimum is in the right half
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                // Minimum is in left half (including mid)
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
 * Find the minimum element in a rotated sorted array.
 * 
 * @param {number[]} nums - A rotated sorted array of unique integers
 * @return {number} - The minimum element in the array
 */
var findMin = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // If mid element is greater than right element,
        // minimum is in the right half
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Each iteration halves the search space |
| **Space** | O(1) - Only uses a few variables |

---

## Approach 2: Binary Search with Left Boundary

This approach uses a similar logic but compares with the left boundary instead. It's equally valid and sometimes easier to understand.

### Algorithm Steps

1. Initialize `left = 0` and `right = len(nums) - 1`
2. While `left < right`:
   - Calculate `mid = (left + right) // 2`
   - If `nums[mid] > nums[left]`, minimum is in right half: `left = mid + 1`
   - Otherwise, minimum is in left half: `right = mid`
3. Return `nums[left]`

### Why It Works

Similar to Approach 1, but using the left boundary for comparison. If the left half is sorted (nums[mid] > nums[left]), the minimum must be in the right half.

### Code Implementation

````carousel
```python
class Solution:
    def findMin_left(self, nums: List[int]) -> int:
        """
        Find minimum using left boundary comparison.
        
        Args:
            nums: A rotated sorted array of unique integers
            
        Returns:
            The minimum element in the array
        """
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = (left + right) // 2
            # If left half is sorted, minimum is in right half
            if nums[mid] > nums[left]:
                left = mid + 1
            else:
                # Minimum is in left half (including mid)
                right = mid
        
        return nums[left]
```

<!-- slide -->
```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        /**
         * Find minimum using left boundary comparison.
         * 
         * @param nums - A rotated sorted array of unique integers
         * @return The minimum element in the array
         */
        int left = 0;
        int right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If left half is sorted, minimum is in right half
            if (nums[mid] > nums[left]) {
                left = mid + 1;
            } else {
                // Minimum is in left half (including mid)
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
    public int findMinLeft(int[] nums) {
        /**
         * Find minimum using left boundary comparison.
         * 
         * @param nums - A rotated sorted array of unique integers
         * @return The minimum element         */
        int in the array
 left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // If left half is sorted, minimum is in right half
            if (nums[mid] > nums[left]) {
                left = mid + 1;
            } else {
                // Minimum is in left half (including mid)
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
 * Find minimum using left boundary comparison.
 * 
 * @param {number[]} nums - A rotated sorted array of unique integers
 * @return {number} - The minimum element in the array
 */
var findMinLeft = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // If left half is sorted, minimum is in right half
        if (nums[mid] > nums[left]) {
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Each iteration halves the search space |
| **Space** | O(1) - Only uses a few variables |

---

## Comparison of Approaches

| Aspect | Right Boundary | Left Boundary |
|--------|-----------------|----------------|
| **Time Complexity** | O(log n) | O(log n) |
| **Space Complexity** | O(1) | O(1) |
| **Comparison** | nums[mid] vs nums[right] | nums[mid] vs nums[left] |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

**Best Approach:** Both approaches are optimal with O(log n) time and O(1) space. The right boundary approach is slightly more commonly used.

---

## Why Binary Search Works for This Problem

Binary search is the optimal approach for this problem because:

1. **Sorted Property**: The array is sorted (before rotation), which is the key property binary search exploits
2. **Rotated Once**: The rotation creates a "break point" (pivot) where the sorted order is disrupted
3. **Predictable Halving**: At each step, we can determine which half contains the minimum element
4. **O(log n) Requirement**: Binary search naturally achieves logarithmic time complexity

The crucial insight is that at least one half of the array is always sorted, allowing us to make the binary decision at each step.

---

## Related Problems

Based on similar themes (binary search, rotated arrays, finding pivot elements):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find Minimum in Rotated Sorted Array II | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) | Allows duplicates in the rotated array |
| Binary Search | [Link](https://leetcode.com/problems/binary-search/) | Standard binary search |
| Peak Index in a Mountain Array | [Link](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Find peak in mountain array |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search in Rotated Sorted Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Search for a target in rotated array |
| Search in Rotated Sorted Array II | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) | Search with duplicates allowed |
| Find Peak Element | [Link](https://leetcode.com/problems/find-peak-element/) | Find any peak element |

### Pattern Reference

For more detailed explanations of the binary search pattern and its variations, see:
- **[Binary Search Pattern](/patterns/binary-search)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search on Rotated Arrays

- [NeetCode - Find Minimum in Rotated Sorted Array](https://www.youtube.com/watch?v=2rdmD4ObFE8) - Clear explanation with visual examples
- [Back to Back SWE - Find Minimum in Rotated Sorted Array](https://www.youtube.com/watch?v=4底部qGYc) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0kD0rF16S88) - Official problem solution

### Related Concepts

- [Binary Search Complete Guide](https://www.youtube.com/watch?v=Mo9n3j5xTPA) - Understanding binary search
- [Understanding Rotated Arrays](https://www.youtube.com/watch?v=1i2T7w0qY3E) - How rotation affects sorted arrays

---

## Follow-up Questions

### Q1: How would you handle duplicates in the array?

**Answer:** With duplicates, the problem becomes harder because `nums[mid] == nums[right]` no longer tells us which side the minimum is on. You would need to increment/decrement the boundaries by 1 when there's no distinction, leading to O(n) worst-case time complexity. See "Find Minimum in Rotated Sorted Array II".

---

### Q2: What if the array is not rotated (i.e., it's already sorted)?

**Answer:** The algorithm still works correctly! If the array is not rotated, `nums[mid] > nums[right]` will always be false (since the array is sorted), so we'll keep moving `right = mid` until `left == right`, which will point to index 0 (the minimum element).

---

### Q3: How would you modify the solution to find the maximum element instead?

**Answer:** Simply reverse the comparison logic. If `nums[mid] < nums[right]`, the maximum is in the right half; otherwise, it's in the left half. Alternatively, you can find the minimum first and then the maximum is at `(minIndex + n - 1) % n`.

---

### Q4: Can you solve this without binary search?

**Answer:** Yes, you could use a linear scan to find the minimum in O(n) time by tracking the minimum value while iterating. However, this doesn't meet the O(log n) requirement and is less efficient.

---

### Q5: How do you know which boundary (left or right) to use for comparison?

**Answer:** Both work! The key is consistency. Using the right boundary is more common because:
- It directly relates to the pivot point (minimum)
- It handles the edge case of non-rotated arrays more naturally
- It's the approach used in the official LeetCode solution

---

### Q6: What happens if the array has only one element?

**Answer:** The algorithm works correctly. The while loop condition `left < right` will be false immediately (since left == right == 0), and we return `nums[0]`.

---

### Q7: How would you find both the minimum and maximum in a rotated sorted array in one pass?

**Answer:** You can use a modified binary search that tracks both boundaries. At each step, compare with both left and right to determine which half contains the minimum/maximum. Alternatively, find the minimum (pivot) and the maximum will be at the other end of the array.

---

### Q8: What edge cases should be tested?

**Answer:**
- Array with single element
- Array with two elements
- Non-rotated array (already sorted)
- Array rotated n times (same as non-rotated)
- Array rotated once
- Array with negative numbers
- Array with all same elements (if duplicates allowed)

---

## Common Pitfalls

### 1. Infinite Loop
**Issue:** Using `while left <= right` instead of `while left < right` can cause an infinite loop when left and right converge.

**Solution:** Use `while left < right` and return `nums[left]` after the loop.

### 2. Wrong Comparison
**Issue:** Comparing `nums[mid]` with `nums[left]` instead of `nums[right]` might give wrong results in some cases.

**Solution:** Be consistent with the boundary you choose. The right boundary approach is recommended.

### 3. Off-by-One Errors
**Issue:** Using `mid + 1` or `mid - 1` incorrectly can skip the minimum element.

**Solution:** Carefully trace through edge cases like arrays with 2 elements.

### 4. Not Handling Non-Rotated Arrays
**Issue:** Some implementations fail when the array is not rotated.

**Solution:** The correct algorithm handles both rotated and non-rotated arrays naturally.

---

## Summary

The **Find Minimum in Rotated Sorted Array** problem demonstrates the power of binary search on modified sorted arrays:

- **Binary Search**: Optimal with O(log n) time and O(1) space
- **Key Insight**: At least one half is always sorted, allowing us to determine which half contains the minimum
- **Two Approaches**: Using left or right boundary for comparison

The crucial insight is comparing `nums[mid]` with the boundary to determine which half contains the minimum element. This problem is an excellent demonstration of adapting binary search to non-standard scenarios.

### Pattern Summary

This problem exemplifies the **Binary Search - Rotated Array** pattern, which is characterized by:
- Exploiting the sorted property of the array
- Using boundary comparisons to determine which half contains the target
- Achieving O(log n) time complexity
- Handling edge cases like non-rotated arrays

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/discuss/) - Community solutions and explanations
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Rotated Sorted Array - GeeksforGeeks](https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/) - Understanding rotated arrays
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
