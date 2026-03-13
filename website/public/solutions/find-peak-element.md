# Find Peak Element

## Problem Description

## Pattern: Binary Search - Peak Finding

This problem demonstrates the **Binary Search** pattern for finding a peak element.

A **peak element** is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element and return its index. If the array contains multiple peaks, return the index of any peak.

You may imagine that `nums[-1] = nums[n] = -∞`. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.

> **Requirement:** You must write an algorithm that runs in `O(log n)` time.

## Examples

**Example 1:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,2,3,1]` | `2` | `3` is a peak element at index 2 |

**Example 2:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,2,1,3,5,6,4]` | `5` | Valid answers: index 1 (value 2) or index 5 (value 6) |

## Constraints

| Constraint | Description |
|------------|-------------|
| Array length | `1 <= nums.length <= 1000` |
| Value range | `-2^31 <= nums[i] <= 2^31 - 1` |
| Adjacent elements | `nums[i] != nums[i + 1]` for all valid `i` |

---

## Intuition

The key insight is that we can use **binary search** to find a peak in O(log n) time because:

1. **Guaranteed peak exists**: With `nums[-1] = nums[n] = -∞`, there must be at least one peak
2. **Monotonic behavior**: The constraint `nums[i] != nums[i+1]` ensures strict monotonicity between any two points
3. **Directional search**: If `nums[mid] < nums[mid+1]`, the peak must be to the right (increasing slope)
4. **Binary search efficiency**: We can eliminate half the search space in each iteration

### Why Binary Search Works:

```
Array: [1, 2, 1, 3, 5, 6, 4]
        ↑           ↑
       left        right

At mid = 3: nums[3] = 3, nums[4] = 5
Since 3 < 5 (increasing), peak must be on the RIGHT side
```

The array must have at least one "hill" because:
- Start from left: if first element is not greater than -∞, array must rise
- End at right: if last element is not greater than -∞, array must fall
- Somewhere in between: there must be a peak!

---

## Solution Approaches

## Approach 1: Binary Search (Optimal)

The classic O(log n) solution using binary search on the answer space.

````carousel
```python
from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = (left + right) // 2
            
            # Compare mid with its right neighbor
            if nums[mid] < nums[mid + 1]:
                # Peak is in the right half
                left = mid + 1
            else:
                # Peak is in the left half (including mid)
                right = mid
        
        return left
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int left = 0;
        int right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // Compare mid with its right neighbor
            if (nums[mid] < nums[mid + 1]) {
                // Peak is in the right half
                left = mid + 1;
            } else {
                // Peak is in the left half (including mid)
                right = mid;
            }
        }
        
        return left;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findPeakElement(int[] nums) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // Compare mid with its right neighbor
            if (nums[mid] < nums[mid + 1]) {
                // Peak is in the right half
                left = mid + 1;
            } else {
                // Peak is in the left half (including mid)
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
 * @return {number}
 */
var findPeakElement = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Compare mid with its right neighbor
        if (nums[mid] < nums[mid + 1]) {
            // Peak is in the right half
            left = mid + 1;
        } else {
            // Peak is in the left half (including mid)
            right = mid;
        }
    }
    
    return left;
};
```
````

## Approach 2: Linear Scan (Simple but O(n))

A simple linear scan approach - not O(log n) but easy to understand.

````carousel
```python
from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        n = len(nums)
        
        # Check first element
        if n == 1 or nums[0] > nums[1]:
            return 0
        
        # Check last element
        if nums[n-1] > nums[n-2]:
            return n - 1
        
        # Check middle elements
        for i in range(1, n - 1):
            if nums[i] > nums[i-1] and nums[i] > nums[i+1]:
                return i
        
        return -1  # Should never reach here
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int n = nums.size();
        
        // Check first element
        if (n == 1 || nums[0] > nums[1]) {
            return 0;
        }
        
        // Check last element
        if (nums[n-1] > nums[n-2]) {
            return n - 1;
        }
        
        // Check middle elements
        for (int i = 1; i < n - 1; i++) {
            if (nums[i] > nums[i-1] && nums[i] > nums[i+1]) {
                return i;
            }
        }
        
        return -1;  // Should never reach here
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findPeakElement(int[] nums) {
        int n = nums.length;
        
        // Check first element
        if (n == 1 || nums[0] > nums[1]) {
            return 0;
        }
        
        // Check last element
        if (nums[n-1] > nums[n-2]) {
            return n - 1;
        }
        
        // Check middle elements
        for (int i = 1; i < n - 1; i++) {
            if (nums[i] > nums[i-1] && nums[i] > nums[i+1]) {
                return i;
            }
        }
        
        return -1;  // Should never reach here
    }
}
```
<!-- slide -->
```javascript
var findPeakElement = function(nums) {
    const n = nums.length;
    
    // Check first element
    if (n === 1 || nums[0] > nums[1]) {
        return 0;
    }
    
    // Check last element
    if (nums[n - 1] > nums[n - 2]) {
        return n - 1;
    }
    
    // Check middle elements
    for (let i = 1; i < n - 1; i++) {
        if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
            return i;
        }
    }
    
    return -1;  // Should never reach here
};
```
````

## Approach 3: Recursive Binary Search

A recursive implementation of the binary search approach.

````carousel
```python
from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        def binary_search(left: int, right: int) -> int:
            if left == right:
                return left
            
            mid = (left + right) // 2
            
            if nums[mid] < nums[mid + 1]:
                return binary_search(mid + 1, right)
            else:
                return binary_search(left, mid)
        
        return binary_search(0, len(nums) - 1)
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        return binarySearch(0, nums.size() - 1, nums);
    }
    
private:
    int binarySearch(int left, int right, const vector<int>& nums) {
        if (left == right) {
            return left;
        }
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] < nums[mid + 1]) {
            return binarySearch(mid + 1, right, nums);
        } else {
            return binarySearch(left, mid, nums);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findPeakElement(int[] nums) {
        return binarySearch(0, nums.length - 1, nums);
    }
    
    private int binarySearch(int left, int right, int[] nums) {
        if (left == right) {
            return left;
        }
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] < nums[mid + 1]) {
            return binarySearch(mid + 1, right, nums);
        } else {
            return binarySearch(left, mid, nums);
        }
    }
}
```
<!-- slide -->
```javascript
var findPeakElement = function(nums) {
    const binarySearch = (left, right) => {
        if (left === right) {
            return left;
        }
        
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] < nums[mid + 1]) {
            return binarySearch(mid + 1, right);
        } else {
            return binarySearch(left, mid);
        }
    };
    
    return binarySearch(0, nums.length - 1);
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| **Binary Search** | O(log n) | O(1) | Optimal solution |
| **Linear Scan** | O(n) | O(1) | Simple but not O(log n) |
| **Recursive BS** | O(log n) | O(log n) | Uses recursion stack |

### Why Binary Search is Optimal:

1. **Logarithmic time**: Eliminates half the search space each iteration
2. **Constant space**: Only uses a few pointers
3. **No extra memory**: Doesn't create new arrays
4. **Fits requirement**: Meets the O(log n) time constraint

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Single element**: `nums = [1]` → Answer: 0
2. **Two elements**: `nums = [1, 2]` → Answer: 1 (second is peak)
3. **Two elements descending**: `nums = [2, 1]` → Answer: 0 (first is peak)
4. **Strictly increasing**: `nums = [1, 2, 3]` → Answer: 2 (last is peak)
5. **Strictly decreasing**: `nums = [3, 2, 1]` → Answer: 0 (first is peak)

### Common Mistakes

1. **Using left <= right**: Should be left < right to avoid infinite loop
2. **Comparing with left neighbor**: Always compare with right neighbor
3. **Forgetting boundary cases**: Check first and last elements
4. **Integer overflow**: Use `left + (right - left) / 2` instead of `(left + right) / 2`

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Medium (Easy for linear, Medium for binary search)
- **Classic problem**: One of the most fundamental binary search variants

### Learning Outcomes

1. **Binary search mastery**: Understanding when and how to apply binary search
2. **Monotonicity exploitation**: Using sorted properties for efficient search
3. **Edge case handling**: Managing boundary conditions carefully
4. **Proof of correctness**: Understanding why the algorithm works

---

## Related Problems

### Same Pattern (Binary Search Variants)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find Peak Element](https://leetcode.com/problems/find-peak-element/) | 162 | Medium | This problem |
| [Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | 852 | Medium | Mountain array variant |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | 153 | Medium | Binary search in rotated array |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | 33 | Medium | Binary search variant |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Related Technique |
|---------|------------|------------|-------------------|
| [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | 34 | Medium | Binary search |
| [Search Insert Position](https://leetcode.com/problems/search-insert-position/) | 35 | Easy | Binary search |
| [Sqrt(x)](https://leetcode.com/problems/sqrtx/) | 69 | Easy | Binary search |
| [Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/) | 374 | Easy | Binary search |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Find Peak Element - NeetCode](https://www.youtube.com/watch?v=NRGw6L3gq0w)**
   - Excellent explanation of the binary search approach
   - Visual step-by-step walkthrough

2. **[LeetCode 162 - Find Peak Element](https://www.youtube.com/watch?v=cf3KhkNJg2M)**
   - Clear and concise explanation
   - Multiple approaches covered

3. **[Binary Search Masterclass](https://www.youtube.com/watch?v=MoqU2q2D2J8)**
   - Comprehensive binary search tutorial
   - Common patterns and pitfalls

4. **[Blind 75 - Binary Search](https://www.youtube.com/watch?v=txXjT3K0t0Q)**
   - Interview-focused approach
   - Related problems

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity?**
   - Time: O(log n), Space: O(1) iterative / O(log n) recursive

2. **Why do we compare with the right neighbor instead of left?**
   - Either works, but comparing with right avoids boundary issues at index 0

3. **What if nums[i] == nums[i+1] was allowed?**
   - Problem guarantees nums[i] != nums[i+1] for strict monotonicity

### Intermediate Level

4. **How would you find ALL peak elements?**
   - Modify to collect all indices where nums[i] > nums[i-1] and nums[i] > nums[i+1]

5. **Can you solve this with a modified binary search that finds the leftmost peak?**
   - Yes, modify the condition to include mid when going left

### Advanced Level

6. **How would you adapt this to find peak in a 2D matrix?**
   - Use binary search on rows, find max in column, then decide which half

7. **What if the constraint was removed and duplicates were allowed?**
   - Would need to check multiple neighbors and potentially use different strategy

---

## Common Pitfalls

### 1. Using Left <= Right Condition
**Issue**: Using `left <= right` can cause infinite loops or incorrect results.

**Solution**: Use `left < right` to ensure proper termination.

### 2. Comparing with Wrong Neighbor
**Issue**: Comparing with left neighbor can cause boundary issues at index 0.

**Solution**: Compare with right neighbor (mid and mid+1) to avoid boundary issues.

### 3. Integer Overflow in Mid Calculation
**Issue**: Using `(left + right) / 2` can cause overflow for large numbers.

**Solution**: Use `left + (right - left) / 2` to prevent overflow.

### 4. Not Handling Single Element Array
**Issue**: Forgetting edge case when array has only one element.

**Solution**: The algorithm naturally handles this, but test cases should include single element.

### 5. Confusing Peak with Maximum
**Issue**: Thinking peak must be the global maximum.

**Solution**: A peak is only required to be greater than its immediate neighbors.

---

## Summary

The **Find Peak Element** problem is a classic binary search application. Key insights:

1. **Binary search works**: Because the array has guaranteed peak(s) due to boundary conditions
2. **Slope direction**: If nums[mid] < nums[mid+1], peak is to the right; otherwise to the left
3. **O(log n) requirement**: Met by binary search, not linear scan
4. **Simple logic**: Compare with right neighbor to determine search direction

This problem is essential for:
- Understanding when binary search applies
- Learning about monotonic properties
- Practicing edge case handling

---

## LeetCode Problems for Practice

- [Find Peak Element](https://leetcode.com/problems/find-peak-element/)
- [Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/)
- [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
- [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
