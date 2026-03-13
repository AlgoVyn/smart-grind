# Binary Search

## Problem Description

Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with O(log n) runtime complexity.

**Note:** This is LeetCode Problem 704. You can find the original problem [here](https://leetcode.com/problems/binary-search/).

---

## Examples

### Example

**Input:**
```python
nums = [-1,0,3,5,9,12], target = 9
```

**Output:**
```python
4
```

**Explanation:** 9 exists in nums and its index is 4.

### Example 2

**Input:**
```python
nums = [-1,0,3,5,9,12], target = 2
```

**Output:**
```python
-1
```

**Explanation:** 2 does not exist in nums so return -1.

---

## Constraints

- `1 <= nums.length <= 10^4`
- `-10^4 < nums[i], target < 10^4`
- All the integers in `nums` are unique.
- `nums` is sorted in ascending order.

---

## Pattern: Binary Search (Divide and Conquer)

This problem is a classic example of **Binary Search** - the **Divide and Conquer** pattern. The key insight is to repeatedly divide the search space in half.

### Core Concept

- **Halving**: Each comparison eliminates half of remaining elements
- **Sorted Array**: Works only on sorted arrays
- **O(log n)**: Exponentially faster than linear search
- **Two Implementations**: Iterative and recursive

---

## Intuition

The key insight for binary search is understanding how to efficiently find an element in a sorted array.

### Key Observations

1. **Sorted Property**: Since array is sorted, we can determine which half contains target

2. **Divide and Conquer**: Each step eliminates half of the remaining elements

3. **Middle Element**: The key is comparing target with middle element

4. **Pointer Movement**: If target > middle, search right; else search left

5. **Termination**: When left > right, element not found

### Algorithm Overview

1. Initialize left = 0, right = n-1
2. While left <= right:
   - Calculate mid = left + (right - left) // 2
   - If nums[mid] == target: return mid
   - If nums[mid] < target: left = mid + 1
   - If nums[mid] > target: right = mid - 1
3. Return -1 (not found)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Iterative Binary Search** - Standard approach
2. **Recursive Binary Search** - Alternative approach

---

## Approach 1: Iterative Binary Search (Optimal)

### Algorithm Steps

1. Set left = 0, right = len(nums) - 1
2. While left <= right:
   - Calculate mid to avoid overflow
   - Compare nums[mid] with target
   - Adjust left or right pointers
3. Return -1 if not found

### Why It Works

The iterative approach works because:
- Each iteration halves the search space
- Using mid + 1 and mid - 1 ensures we don't revisit elements
- The loop condition ensures we check all possible positions
- Using left + (right - left) // 2 prevents integer overflow

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        """
        Binary search using iterative approach.
        
        Args:
            nums: Sorted list of integers
            target: Value to search for
            
        Returns:
            Index of target if found, -1 otherwise
        """
        left, right = 0, len(nums) - 1
        
        while left <= right:
            # Calculate mid to prevent overflow
            mid = left + (right - left) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        
        while (left <= right) {
            // Calculate mid to prevent overflow
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        
        while (left <= right) {
            // Calculate mid to prevent overflow
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        // Calculate mid to prevent overflow
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - halving search space each iteration |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Recursive Binary Search

### Algorithm Steps

1. Define recursive function with left, right parameters
2. Base case: if left > right, return -1
3. Calculate mid
4. Compare and recursively call with updated bounds

### Why It Works

The recursive approach works because:
- Same logic as iterative, just implemented recursively
- Each recursive call works on half the search space
- Base case handles not found scenario

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        """Binary search using recursion."""
        
        def binary_search(left, right):
            # Base case: not found
            if left > right:
                return -1
            
            mid = left + (right - left) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                return binary_search(mid + 1, right)
            else:
                return binary_search(left, mid - 1)
        
        return binary_search(0, len(nums) - 1)
```

<!-- slide -->
```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        return binarySearch(nums, target, 0, nums.size() - 1);
    }
    
private:
    int binarySearch(vector<int>& nums, int target, int left, int right) {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) return binarySearch(nums, target, mid + 1, right);
        return binarySearch(nums, target, left, mid - 1);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int search(int[] nums, int target) {
        return binarySearch(nums, target, 0, nums.length - 1);
    }
    
    private int binarySearch(int[] nums, int target, int left, int right) {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) return binarySearch(nums, target, mid + 1, right);
        return binarySearch(nums, target, left, mid - 1);
    }
}
```

<!-- slide -->
```javascript
var search = function(nums, target) {
    function binarySearch(left, right) {
        if (left > right) return -1;
        
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) return binarySearch(mid + 1, right);
        return binarySearch(left, mid - 1);
    }
    
    return binarySearch(0, nums.length - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - halving search space each call |
| **Space** | O(log n) - recursion stack |

---

## Comparison of Approaches

| Aspect | Iterative | Recursive |
|--------|-----------|------------|
| **Time Complexity** | O(log n) | O(log n) |
| **Space Complexity** | O(1) | O(log n) |
| **Implementation** | Simpler | More intuitive |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Use Approach 1 (Iterative) for O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Fundamental and commonly asked
- **Companies**: Google, Facebook, Microsoft, Amazon
- **Difficulty**: Easy
- **Concepts Tested**: Binary Search, Divide and Conquer, Search Algorithms

### Learning Outcomes

1. **Binary Search Mastery**: Core algorithm for sorted data
2. **Divide and Conquer**: Halving technique
3. **Overflow Prevention**: Using left + (right - left) / 2
4. **Boundary Conditions**: Proper handling of left/right pointers

---

## Related Problems

Based on similar themes (binary search, search):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Find insertion point |
| Search in Rotated Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Rotated array search |
| Find First and Last Position | [Link](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | First/last occurrence |
| Search a 2D Matrix | [Link](https://leetcode.com/problems/search-a-2d-matrix/) | 2D matrix search |

### Pattern Reference

For more detailed explanations of binary search, see:
- **[Binary Search Pattern](/patterns/binary-search)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Binary Search](https://www.youtube.com/watch?v=7V7X8aD2k5E)** - Clear explanation
2. **[Binary Search - LeetCode 704](https://www.youtube.com/watch?v=3-q1M7YqBqA)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you find the first occurrence of the target?

**Answer:** Continue searching left even after finding the target using `right = mid - 1`. Track the last found position.

### Q2: How would you implement binary search recursively?

**Answer:** Base case checks if `left > right` (not found). Recursively call with updated bounds. Note: uses O(log n) stack space.

### Q3: What if the array is rotated (like in search in rotated sorted array)?

**Answer:** Determine which half is sorted at each step, then decide which half to search based on target's relationship with boundaries.

### Q4: How would you find the square root using binary search?

**Answer:** Binary search between 0 and x. Find largest mid where mid*mid <= x.

### Q5: How would you search in a 2D matrix where rows and columns are sorted?

**Answer:** Start from top-right or bottom-left corner. Eliminate entire row or column in each step.

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue:** Using `left < right` instead of `left <= right`.

**Solution:** Use `<=` when you want to check boundary element.

### 2. Integer Overflow
**Issue:** Using `(left + right) // 2` can overflow.

**Solution:** Use `left + (right - left) // 2`.

### 3. Incorrect Pointer Update
**Issue:** Using `mid` instead of `mid + 1` or `mid - 1`.

**Solution:** Always move past mid: `left = mid + 1` or `right = mid - 1`.

### 4. Not Handling Missing Target
**Issue:** Forgetting to return -1 when target not found.

**Solution:** Loop exits when left > right, then return -1.

### 5. Wrong Comparison Direction
**Issue:** Confusing which direction to search.

**Solution:** If target > mid, search right (left = mid + 1).

---

## Summary

The **Binary Search** problem demonstrates the **Divide and Conquer** pattern:

- **Halving**: Each comparison eliminates half
- **Sorted Array**: Works on sorted data only
- **Time complexity**: O(log n) - optimal
- **Space complexity**: O(1) for iterative

Key takeaways:
1. Use `left + (right - left) // 2` to prevent overflow
2. Use `<=` in loop condition for inclusive bounds
3. Update pointers with `mid + 1` and `mid - 1`
4. Return -1 when left > right

This pattern extends to:
- Finding insertion position
- Searching rotated arrays
- Finding first/last occurrence
- Binary search on answer

---

## Additional Resources

- [LeetCode Problem 704](https://leetcode.com/problems/binary-search/) - Official problem page
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
