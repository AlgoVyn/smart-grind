# Search in Rotated Sorted Array II

## Problem Description

There is an integer array `nums` sorted in non-decreasing order (not necessarily with distinct values). Before being passed to your function, `nums` is rotated at an unknown pivot index `k` (`0 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed).

For example, `[0,1,2,4,4,4,5,6,6,7]` might be rotated at pivot index 5 and become `[4,5,6,6,7,0,1,2,4,4]`.

Given the array `nums` after the rotation and an integer `target`, return `true` if target is in `nums`, or `false` if it is not in `nums`.

**LeetCode Link:** [Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/)

---

## Examples

**Example 1:**
- Input: `nums = [2,5,6,0,0,1,2], target = 0`
- Output: `true`

**Example 2:**
- Input: `nums = [2,5,6,0,0,1,2], target = 3`
- Output: `false`

---

## Constraints

- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is guaranteed to be rotated at some pivot
- `-10^4 <= target <= 10^4`

---

## Pattern: Modified Binary Search

This problem uses **Binary Search** with duplicate handling. When nums[left] == nums[mid], increment left to skip duplicates.

### Core Concept

- **Binary Search**: Efficient O(log n) search in sorted arrays
- **Rotation Handling**: Determine which half is sorted
- **Duplicate Handling**: When nums[left] == nums[mid], we can't determine which half is sorted, so we skip the duplicate by incrementing left

---

## Intuition

The key insight for this problem is understanding how to handle duplicates in a rotated sorted array:

1. **Standard Rotated Array**: In a rotated sorted array without duplicates, we can always determine which half is sorted by comparing `nums[left]` with `nums[mid]`.

2. **The Duplicate Problem**: When `nums[left] == nums[mid]`, we lose this ability because:
   - If the array was `[1, 2, 3, 4, 5]` rotated by 2: `[3, 4, 5, 1, 2]`
   - At mid index 2 (value 5), `nums[left]=3, nums[mid]=5`
   - We can tell left half `[3,4,5]` is sorted
   
   But with duplicates: `[1, 1, 1, 1, 2]` rotated by 2: `[1, 2, 1, 1, 1]`
   - At mid index 2 (value 1), `nums[left]=1, nums[mid]=1`
   - We CAN'T tell which half is sorted!

3. **The Solution**: When `nums[left] == nums[mid]`, increment `left` to skip duplicates. This degrades to O(n) in worst case but maintains O(log n) average case.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Modified Binary Search** - Optimal solution
2. **Linear Scan** - Brute force approach
3. **Two-Pass (Find Pivot + Binary Search)** - Two-step approach

---

## Approach 1: Modified Binary Search (Optimal)

### Algorithm Steps

1. Initialize left = 0, right = len(nums) - 1
2. While left <= right:
   a. Calculate mid = (left + right) // 2
   b. If nums[mid] == target, return True
   c. If nums[left] == nums[mid], increment left (can't determine which half is sorted)
   d. Otherwise, check which half is sorted:
      - If nums[left] <= nums[mid]: left half is sorted
        - Check if target is in range [nums[left], nums[mid])
        - If yes, right = mid - 1; else left = mid + 1
      - Else: right half is sorted
        - Check if target is in range (nums[mid], nums[right]]
        - If yes, left = mid + 1; else right = mid - 1
3. Return False

### Why It Works

The algorithm works by exploiting the sorted property of the array. Even though it's rotated, at least one half of the array (from left to mid or from mid to right) is always sorted. We can determine which half is sorted by comparing nums[left] and nums[mid]. When they are equal, we can't determine, so we skip the duplicate by incrementing left.

### Code Implementation

````carousel
```python
from typing import List

def search(nums: List[int], target: int) -> bool:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return True

        # Handle duplicates: if we can't determine which half is sorted, skip the duplicate
        if nums[left] == nums[mid]:
            left += 1
            continue

        # Check if left half is sorted
        if nums[left] <= nums[mid]:
            # Target in left sorted half
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return False
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    bool search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return true;
            }
            
            // Handle duplicates: can't determine which half is sorted
            if (nums[left] == nums[mid]) {
                left++;
                continue;
            }
            
            // Check which half is sorted
            if (nums[left] < nums[mid]) {
                // Left half is sorted
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                // Right half is sorted
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return true;
            }
            
            // Handle duplicates
            if (nums[left] == nums[mid]) {
                left++;
                continue;
            }
            
            // Check which half is sorted
            if (nums[left] < nums[mid]) {
                // Left half is sorted
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                // Right half is sorted
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {boolean}
 */
var search = function(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return true;
        }
        
        // Handle duplicates
        if (nums[left] === nums[mid]) {
            left++;
            continue;
        }
        
        // Check which half is sorted
        if (nums[left] < nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) average, O(n) worst case with many duplicates |
| **Space** | O(1), constant extra space |

---

## Approach 2: Linear Scan (Brute Force)

### Algorithm Steps

1. Iterate through each element in the array
2. Return True if any element equals target
3. Return False if not found

### Why It Works

A simple brute force approach that works for all cases, including when duplicates make binary search inefficient.

### Code Implementation

````carousel
```python
from typing import List

def search(nums: List[int], target: int) -> bool:
    """Linear scan - O(n) time, O(1) space"""
    for num in nums:
        if num == target:
            return True
    return False
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    bool search(vector<int>& nums, int target) {
        for (int num : nums) {
            if (num == target) return true;
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean search(int[] nums, int target) {
        for (int num : nums) {
            if (num == target) return true;
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
var search = function(nums, target) {
    for (const num of nums) {
        if (num === target) return true;
    }
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Approach 3: Two-Pass (Find Pivot + Binary Search)

### Algorithm Steps

1. **Find Pivot**: Find the index where the rotation happens (smallest element)
2. **Binary Search**: Use binary search on the appropriate half

### Why It Works

By finding the pivot (rotation point), we can convert the problem into two regular binary searches on sorted arrays.

### Code Implementation

````carousel
```python
from typing import List

def search(nums: List[int], target: int) -> bool:
    if not nums:
        return False
    
    # Find the pivot (minimum element)
    def find_pivot():
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return left
    
    pivot = find_pivot()
    
    # Binary search in the appropriate half
    def binary_search(left, right):
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return True
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return False
    
    # Determine which half to search
    if pivot == 0:
        return binary_search(0, len(nums) - 1)
    elif target >= nums[0]:
        return binary_search(0, pivot - 1)
    else:
        return binary_search(pivot, len(nums) - 1)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int findPivot(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
    
    bool binarySearch(vector<int>& nums, int target, int left, int right) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return true;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
    
    bool search(vector<int>& nums, int target) {
        if (nums.empty()) return false;
        
        int pivot = findPivot(nums);
        
        if (pivot == 0) {
            return binarySearch(nums, target, 0, nums.size() - 1);
        }
        
        if (target >= nums[0]) {
            return binarySearch(nums, target, 0, pivot - 1);
        } else {
            return binarySearch(nums, target, pivot, nums.size() - 1);
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    private int findPivot(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
    
    private boolean binarySearch(int[] nums, int target, int left, int right) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return true;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
    
    public boolean search(int[] nums, int target) {
        if (nums.length == 0) return false;
        
        int pivot = findPivot(nums);
        
        if (pivot == 0) {
            return binarySearch(nums, target, 0, nums.length - 1);
        }
        
        if (target >= nums[0]) {
            return binarySearch(nums, target, 0, pivot - 1);
        } else {
            return binarySearch(nums, target, pivot, nums.length - 1);
        }
    }
}
```

<!-- slide -->
```javascript
var search = function(nums, target) {
    if (nums.length === 0) return false;
    
    const findPivot = () => {
        let left = 0, right = nums.length - 1;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };
    
    const binarySearch = (left, right) => {
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (nums[mid] === target) return true;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    };
    
    const pivot = findPivot();
    
    if (pivot === 0) {
        return binarySearch(0, nums.length - 1);
    }
    
    if (target >= nums[0]) {
        return binarySearch(0, pivot - 1);
    } else {
        return binarySearch(pivot, nums.length - 1);
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) average, O(n) worst case with duplicates |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Modified Binary Search | Linear Scan | Two-Pass |
|--------|------------------------|-------------|----------|
| **Time Complexity** | O(log n) avg, O(n) worst | O(n) | O(log n) avg, O(n) worst |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Moderate | Simple | Complex |
| **LeetCode Optimal** | ✅ | ❌ (too slow) | ✅ |
| **Difficulty** | Medium | Easy | Medium |

**Best Approach:** Use Approach 1 (Modified Binary Search) for the optimal solution.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search in Rotated Sorted Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Same problem without duplicates |
| Find Minimum in Rotated Sorted Array | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Find pivot element |
| Find Minimum in Rotated Sorted Array II | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) | Find min with duplicates |

---

## Video Tutorial Links

1. **[NeetCode - Search in Rotated Sorted Array II](https://www.youtube.com/watch?v=6-3XGVNuV68)** - Clear explanation
2. **[Search in Rotated Sorted Array II - LeetCode 81](https://www.youtube.com/watch?v=pOnIGY5qZlc)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: Would duplicates affect the runtime complexity?

**Answer:** Yes, duplicates can cause O(n) worst-case time complexity. When nums[left] == nums[mid] == nums[right], we can't determine which half is sorted, so we must increment left (or decrement right) by one, which in the worst case (e.g., all equal elements) becomes a linear scan.

---

### Q2: How would you modify the solution to find the first occurrence of target?

**Answer:** Instead of returning immediately when nums[mid] == target, continue searching in the left half to find the first occurrence. Use a while loop to keep moving left when we find a match.

---

### Q3: Can you solve this without handling duplicates specially?

**Answer:** Yes, you can always use linear scan (Approach 2), but it loses the O(log n) benefit. The two-pass approach also works but is more complex.

---

## Common Pitfalls

### 1. Not Handling Duplicates
**Issue**: Using standard binary search without duplicate handling fails for arrays like [1,1,1,1,1].

**Solution**: Add the check `if nums[left] == nums[mid]: left += 1`

### 2. Incorrect Range Checking
**Issue**: Using `<=` vs `<` incorrectly when checking if target is in range.

**Solution**: Remember to use `<=` when the boundary elements are included: `nums[left] <= target < nums[mid]`

### 3. Infinite Loop
**Issue**: Not updating left or right properly causing infinite loop.

**Solution**: Always update pointers: `left = mid + 1` or `right = mid - 1`, never just `left = mid` or `right = mid`

### 4. Integer Overflow
**Issue**: Using `(left + right) / 2` can overflow for large arrays.

**Solution**: Use `left + (right - left) / 2` instead.

---

## Summary

The **Search in Rotated Sorted Array II** problem extends the classic binary search to handle:
- **Rotation**: Array is rotated at an unknown pivot
- **Duplicates**: Equal elements that make it impossible to determine which half is sorted

Key takeaways:
1. Compare nums[left] with nums[mid] to determine which half is sorted
2. When nums[left] == nums[mid], increment left to skip duplicates
3. Check if target is in the sorted half's range before deciding which half to search
4. Worst case degrades to O(n) with many duplicates, but average remains O(log n)

This problem is essential for understanding modified binary search and handling edge cases with duplicates.

---

### Pattern Summary

This problem exemplifies the **Modified Binary Search** pattern, characterized by:
- Using binary search on sorted or partially sorted arrays
- Handling edge cases (duplicates, rotation)
- Determining search space based on comparisons
- Time complexity: O(log n) average, O(n) worst case

For more details on this pattern, see the **[Binary Search Pattern](/patterns/binary-search)**.
