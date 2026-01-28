# Search Insert Position

## Problem Description

Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted to maintain the sorted order.

You must write an algorithm that runs in `O(log n)` time complexity.

### Examples

**Example 1:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,3,5,6]`, `target = 5` | `2` | Target found at index 2 |

**Example 2:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,3,5,6]`, `target = 2` | `1` | Target would be inserted at index 1 |

**Example 3:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,3,5,6]`, `target = 7` | `4` | Target would be inserted at index 4 (end of array) |

**Example 4:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,3,5,6]`, `target = 0` | `0` | Target would be inserted at index 0 (beginning of array) |

### Constraints

| Constraint | Description |
|------------|-------------|
| Array length | `1 <= nums.length <= 10^4` |
| Value range | `-10^4 <= nums[i] <= 10^4` |
| Array type | Sorted in non-decreasing order |
| Element type | Distinct integers |

---

## Approach 1: Standard Binary Search

The standard binary search approach works by maintaining a search space and narrowing it down by half in each iteration.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        while left <= right:
            mid = (left + right) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return left
```
<!-- slide -->
```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }
}
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
};
```
````

### Explanation

1. **Initialize** pointers `left = 0` and `right = len(nums) - 1`
2. **While** `left <= right`:
   - Compute `mid = (left + right) // 2`
   - If `nums[mid] == target`: Return `mid` immediately
   - If `nums[mid] < target`: Search right half by setting `left = mid + 1`
   - If `nums[mid] > target`: Search left half by setting `right = mid - 1`
3. **Return** `left` — When the loop exits, `left` is the insertion position

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(log n)` — Binary search on the array |
| **Space** | `O(1)` — Constant extra space |

---

## Approach 2: Lower Bound Binary Search

This approach directly finds the lower bound (first position where element >= target) using an exclusive right bound.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums)
        
        while left < right:
            mid = (left + right) // 2
            
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        
        return left
```
<!-- slide -->
```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0;
        int right = nums.length;
        
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
}
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size();
        
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
};
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let left = 0;
    let right = nums.length;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
};
```
````

### Explanation

**Key difference:** This approach uses `right = len(nums)` (exclusive) and maintains the invariant that the target is always in `[left, right)`. When the loop exits, `left == right` which is the insertion position.

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(log n)` — Binary search on the array |
| **Space** | `O(1)` — Constant extra space |

---

## Approach 3: Linear Search (Brute Force)

While not optimal, this approach is straightforward and works for small arrays.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        for i, num in enumerate(nums):
            if num >= target:
                return i
        return len(nums)
```
<!-- slide -->
```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= target) {
                return i;
            }
        }
        return nums.length;
    }
}
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] >= target) {
                return i;
            }
        }
        return nums.size();
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] >= target) {
            return i;
        }
    }
    return nums.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Single pass through the array |
| **Space** | `O(1)` — Constant extra space |

---

## Intuition

The problem leverages the **sorted** property of the array. In a sorted array:
- If `nums[mid] < target`, the target (if it exists) must be in the right half
- If `nums[mid] > target`, the target (if it exists) must be in the left half
- If `nums[mid] == target`, we've found the answer

The magic happens when the target is not found. As we eliminate halves of the array, `left` will eventually point to the smallest index where `nums[left] >= target`. This is precisely where the target should be inserted to maintain sorted order.

**Visual Example:**
```
nums = [1, 3, 5, 6], target = 2

Step 1: left=0, right=3, mid=1, nums[1]=3 > 2 → right=0
Step 2: left=0, right=0, mid=0, nums[0]=1 < 2 → left=1
Loop exits, return left=1 ✓
```

---

## Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Standard Binary Search | `O(log n)` | `O(1)` | Most intuitive approach |
| Lower Bound Binary Search | `O(log n)` | `O(1)` | Elegant, uses exclusive right bound |
| Linear Search | `O(n)` | `O(1)` | Simple but not optimal for large arrays |

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [First Bad Version](https://leetcode.com/problems/first-bad-version/) | Easy | Find first version where product goes bad using binary search |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | Search in a rotated sorted array |
| [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | Medium | Find all occurrences of a target |
| [Binary Search](https://leetcode.com/problems/binary-search/) | Easy | Basic binary search implementation |

---

## Video Tutorials

- [Binary Search - Search Insert Position (LeetCode)](https://www.youtube.com/watch?v=KA5j6S6Gtos) - NeetCode
- [Search Insert Position - LeetCode 35 - Full Solution](https://www.youtube.com/watch?v=0AObExs5Ww0) - DataDaft
- [Binary Search Explained - Search Insert Position](https://www.youtube.com/watch?v=V0tBdbJ_9tQ) - Kevin Naughton Jr.

---

## Follow-up Questions

**Q: What if the array contains duplicates?**

**A:** If duplicates exist, binary search may return any index where the target appears. To find the first or last occurrence, you would need to modify the algorithm to continue searching in the appropriate direction after finding a match.

**Q: How would you handle integer overflow when calculating mid?**

**A:** Use the formula `mid = left + (right - left) // 2` instead of `(left + right) // 2`. This prevents overflow when `left + right` exceeds the maximum integer value.

**Q: What if we need to find the upper bound (first element > target) instead?**

**A:** Modify the condition to `if nums[mid] <= target: left = mid + 1`. This finds the insertion position for the first element greater than the target.

**Q: Can we solve this without binary search?**

**A:** Yes, using linear search as shown in Approach 3. However, this has O(n) time complexity, which is not optimal for large arrays.

**Q: What happens if the target is smaller than all elements?**

**A:** The binary search will eventually set `right = -1` and `left = 0`, returning 0 as the insertion position.

---

## Summary

The Search Insert Position problem is a classic binary search application. The key insight is that when the target is not found, the binary search naturally terminates at the insertion position. Both binary search approaches achieve `O(log n)` time and `O(1)` space complexity, making them optimal for this problem.
