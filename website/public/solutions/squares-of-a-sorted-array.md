# Squares of a Sorted Array

## Problem Description

Given a sorted array `nums` in non-decreasing order, return an array of the squares of each number, also sorted in non-decreasing order.

**Follow-up:** Solve in O(n) time using a two-pointer approach.

**Link to problem:** [Squares of a Sorted Array - LeetCode 977](https://leetcode.com/problems/squares-of-a-sorted-array/)

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `nums = [-4,-1,0,3,10]` | `[0,1,9,16,100]` |

**Explanation:** After squaring: [16,1,0,9,100], then sorted: [0,1,9,16,100]

**Example 2:**

| Input | Output |
|-------|--------|
| `nums = [-7,-3,2,3,11]` | `[4,9,9,49,121]` |

**Explanation:** After squaring: [49,9,4,9,121], then sorted: [4,9,9,49,121]

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 10^4` | Array length |
| `-10^4 <= nums[i] <= 10^4` | Element value |

---

## Pattern: Two Pointers - Sorted Array Squares

This problem demonstrates the **Two Pointers** pattern on a sorted array where negative numbers create squares in descending order. The key insight is that the largest magnitudes are at the edges of the array.

### Core Concept

1. In a sorted array with negatives, the squares create a "V" shape
2. Largest squares are at either end (most negative or most positive)
3. Use two pointers from both ends, fill result from back to front

---

## Intuition

### Why Two Pointers Works

For array `[-4, -1, 0, 3, 10]`:
- Negative part: [-4, -1, 0] → squares: [16, 1, 0] (descending)
- Positive part: [0, 3, 10] → squares: [0, 9, 100] (ascending)

The largest squares are at the extremes:
- `|-4| = 4` → `4² = 16` (largest)
- `|10| = 10` → `10² = 100` (largest after 16)

By comparing absolute values from both ends, we can build the result in descending order, then reverse it.

---

## Multiple Approaches with Code

## Approach 1: Two Pointers from Both Ends (Optimal)

This approach compares absolute values from both ends and fills the result array from the back.

````carousel
```python
from typing import List

class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        """
        Sort squares using two pointers from both ends.
        
        Args:
            nums: Sorted array in non-decreasing order
            
        Returns:
            Array of squares sorted in non-decreasing order
        """
        n = len(nums)
        result = [0] * n
        
        left, right = 0, n - 1
        position = n - 1  # Fill from the end
        
        while left <= right:
            if abs(nums[left]) > abs(nums[right]):
                result[position] = nums[left] ** 2
                left += 1
            else:
                result[position] = nums[right] ** 2
                right -= 1
            position -= 1
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n);
        
        int left = 0, right = n - 1;
        int position = n - 1;  // Fill from the end
        
        while (left <= right) {
            if (abs(nums[left]) > abs(nums[right])) {
                result[position] = nums[left] * nums[left];
                left++;
            } else {
                result[position] = nums[right] * nums[right];
                right--;
            }
            position--;
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        
        int left = 0, right = n - 1;
        int position = n - 1;  // Fill from the end
        
        while (left <= right) {
            if (Math.abs(nums[left]) > Math.abs(nums[right])) {
                result[position] = nums[left] * nums[left];
                left++;
            } else {
                result[position] = nums[right] * nums[right];
                right--;
            }
            position--;
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {
    const n = nums.length;
    const result = new Array(n);
    
    let left = 0, right = n - 1;
    let position = n - 1;  // Fill from the end
    
    while (left <= right) {
        if (Math.abs(nums[left]) > Math.abs(nums[right])) {
            result[position] = nums[left] ** 2;
            left++;
        } else {
            result[position] = nums[right] ** 2;
            right--;
        }
        position--;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass through array |
| **Space** | O(n) - output array |

---

## Approach 2: Using List/Array and Sorting

Simple approach: square everything, then sort.

````carousel
```python
from typing import List

class Solution:
    def sortedSquares_simple(self, nums: List[int]) -> List[int]:
        """
        Simple approach: square and sort.
        
        Args:
            nums: Sorted array
            
        Returns:
            Sorted squares
        """
        return sorted(x * x for x in nums)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        // Square each element
        for (int& num : nums) {
            num = num * num;
        }
        // Sort the result
        sort(nums.begin(), nums.end());
        return nums;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        
        // Square each element
        for (int i = 0; i < n; i++) {
            nums[i] = nums[i] * nums[i];
        }
        
        // Sort the result
        java.util.Arrays.sort(nums);
        
        return nums;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {
    // Square each element
    for (let i = 0; i < nums.length; i++) {
        nums[i] = nums[i] ** 2;
    }
    // Sort the result
    nums.sort((a, b) => a - b);
    return nums;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n log n) - due to sorting |
| **Space** | O(n) - can be O(1) if sorting in-place |

---

## Approach 3: Two Pointers - Positive/Negative Split

Split the array into negative and positive parts, then merge.

````carousel
```python
from typing import List

class Solution:
    def sortedSquares_merge(self, nums: List[int]) -> List[int]:
        """
        Split into negative and positive, then merge squares.
        
        Args:
            nums: Sorted array
            
        Returns:
            Sorted squares
        """
        n = len(nums)
        
        # Find the position where negatives end
        neg_idx = -1
        for i in range(n):
            if nums[i] < 0:
                neg_idx = i
            else:
                break
        
        result = []
        left, right = neg_idx, neg_idx + 1
        
        # Merge like merge sort
        while left >= 0 or right < n:
            if left < 0:
                result.append(nums[right] ** 2)
                right += 1
            elif right >= n:
                result.append(nums[left] ** 2)
                left -= 1
            elif nums[left] ** 2 <= nums[right] ** 2:
                result.append(nums[left] ** 2)
                left -= 1
            else:
                result.append(nums[right] ** 2)
                right += 1
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int n = nums.size();
        
        // Find where negative part ends
        int neg_idx = -1;
        for (int i = 0; i < n; i++) {
            if (nums[i] < 0) {
                neg_idx = i;
            } else {
                break;
            }
        }
        
        vector<int> result;
        int left = neg_idx, right = neg_idx + 1;
        
        // Merge like merge sort
        while (left >= 0 || right < n) {
            if (left < 0) {
                result.push_back(nums[right] * nums[right]);
                right++;
            } else if (right >= n) {
                result.push_back(nums[left] * nums[left]);
                left--;
            } else if (nums[left] * nums[left] <= nums[right] * nums[right]) {
                result.push_back(nums[left] * nums[left]);
                left--;
            } else {
                result.push_back(nums[right] * nums[right]);
                right++;
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        
        // Find where negative part ends
        int neg_idx = -1;
        for (int i = 0; i < n; i++) {
            if (nums[i] < 0) {
                neg_idx = i;
            } else {
                break;
            }
        }
        
        int[] result = new int[n];
        int idx = 0;
        int left = neg_idx, right = neg_idx + 1;
        
        // Merge like merge sort
        while (left >= 0 || right < n) {
            if (left < 0) {
                result[idx++] = nums[right] * nums[right];
                right++;
            } else if (right >= n) {
                result[idx++] = nums[left] * nums[left];
                left--;
            } else if (nums[left] * nums[left] <= nums[right] * nums[right]) {
                result[idx++] = nums[left] * nums[left];
                left--;
            } else {
                result[idx++] = nums[right] * nums[right];
                right++;
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {
    const n = nums.length;
    
    // Find where negative part ends
    let neg_idx = -1;
    for (let i = 0; i < n; i++) {
        if (nums[i] < 0) {
            neg_idx = i;
        } else {
            break;
        }
    }
    
    const result = [];
    let left = neg_idx, right = neg_idx + 1;
    
    // Merge like merge sort
    while (left >= 0 || right < n) {
        if (left < 0) {
            result.push(nums[right] ** 2);
            right++;
        } else if (right >= n) {
            result.push(nums[left] ** 2);
            left--;
        } else if (nums[left] ** 2 <= nums[right] ** 2) {
            result.push(nums[left] ** 2);
            left--;
        } else {
            result.push(nums[right] ** 2);
            right++;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - linear merge |
| **Space** | O(n) - result array |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Two Pointers (Both Ends)** | O(n) | O(n) | Best, most elegant |
| **Square + Sort** | O(n log n) | O(n) | Simple but slower |
| **Split + Merge** | O(n) | O(n) | More complex |

**Best Approach:** Two Pointers from Both Ends (Approach 1) is optimal and most commonly used.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Apple, Microsoft
- **Difficulty**: Easy
- **Concepts**: Two pointers, sorted arrays, merging

### Key Insights

1. Largest magnitudes are at array edges
2. Compare absolute values, fill from back
3. O(n) solution uses two pointers

---

## Related Problems

### Same Pattern (Two Pointers)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Merge Sorted Array | [Link](https://leetcode.com/problems/merge-sorted-array/) | Easy |
| Sorted Array LeetCode | [Link](https://leetcode.com/problems/array-sorted/) | Easy |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Find K Closest Elements | [Link](https://leetcode.com/problems/find-k-closest-elements/) | Medium | Binary search |
| Minimum Absolute Difference | [Link](https://leetcode.com/problems/minimum-absolute-difference/) | Easy | Sorting |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Squares of a Sorted Array](https://www.youtube.com/watch?v=4R3Kj0C1BPM)** - Clear explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=4R3Kj0C1BPM)** - Official walkthrough

### Additional Resources

- **[Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/)** - Comprehensive guide

---

## Follow-up Questions

### Q1: Can you do this without extra space?

**Answer:** The output array is required, so O(n) space for result is unavoidable. However, the algorithm itself only uses O(1) extra space.

---

### Q2: What if the input is not sorted?

**Answer:** The problem guarantees a sorted input. For unsorted input, you'd need to sort first (O(n log n)) or use a different approach.

---

### Q3: How would you handle very large numbers?

**Answer:** Use long type in Java, long long in C++, or BigInt in JavaScript to prevent overflow when squaring large numbers near the limits.

---

### Q4: What if you need the result in descending order?

**Answer:** Simply reverse the result array, or change the fill direction from position 0 to n-1.

---

### Q5: What's the key intuition for the two-pointer approach?

**Answer:** The key insight is that in a sorted array with negatives and positives, the largest absolute values are always at the edges. By comparing from both ends, we always pick the larger one and fill from the back.

---

## Common Pitfalls

### 1. Not Filling from Back
**Issue:** Trying to fill from the front.

**Solution:** Since we're comparing from both ends, the largest squares appear first, so we fill from the end of the result array.

### 2. Wrong Comparison
**Issue:** Comparing actual values instead of absolute values.

**Solution:** Use `abs(nums[left]) > abs(nums[right])` to compare magnitudes.

### 3. Off-by-One
**Issue:** Using `<` instead of `<=` in the while condition.

**Solution:** Use `<=` to handle the case when left and right point to the same element (middle element in odd-length array).

---

## Summary

The **Squares of a Sorted Array** problem demonstrates:

- **Two Pointers**: Efficient O(n) solution for sorted arrays
- **Absolute Values**: Compare magnitudes, not values
- **Fill from Back**: Build result in descending order

Key takeaways:
1. Largest squares are at array edges in sorted arrays
2. Compare absolute values from both ends
3. Fill result from back to front
4. O(n) time complexity with two pointers

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/squares-of-a-sorted-array/discuss/)
- [Pattern: Two Pointers](/patterns/two-pointers)
