# Maximum Beauty of an Array After Applying Operation

## Problem Description

You are given a 0-indexed array `nums` and a non-negative integer `k`.

In one operation, you can:
1. Choose an index `i` that hasn't been chosen before from `[0, nums.length - 1]`
2. Replace `nums[i]` with any integer from `[nums[i] - k, nums[i] + k]`

The **beauty** of the array is the length of the longest subsequence consisting of equal elements.

Return the maximum possible beauty of the array after applying the operation any number of times. Each index can be used in at most one operation.

A **subsequence** is an array generated from the original array by deleting some elements (possibly none) without changing the order of the remaining elements.

---

## Examples

### Example 1

**Input:**
```python
nums = [4, 6, 1, 2], k = 2
```

**Output:**
```python
3
```

**Explanation:**
- Replace `nums[1]` (6) with 4 → `[4, 4, 1, 2]`
- Replace `nums[3]` (2) with 4 → `[4, 4, 1, 4]`

The beauty is 3 (elements at indices 0, 1, and 3 are all 4).

### Example 2

**Input:**
```python
nums = [1, 1, 1, 1], k = 10
```

**Output:**
```python
4
```

**Explanation:** All elements are already equal, so no operations are needed.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `0 <= nums[i], k <= 10^5`

---

## Pattern: Two Pointer Sliding Window

This problem uses the **Sliding Window** pattern with two pointers after sorting. The key insight is that after sorting, elements that can be made equal form a contiguous window where the difference between max and min is at most 2*k.

---

## Intuition

The key insight for this problem is understanding the range of values each element can be transformed into:

### Key Observations

1. **Transformation Range**: Each element `x` can become any value in `[x-k, x+k]`

2. **Feasibility Condition**: For multiple elements to become equal to some value `T`:
   - For each element `x`, we need `T ∈ [x-k, x+k]`
   - This means `x-k ≤ T ≤ x+k` for all elements
   - Therefore, `max(x) - min(x) ≤ 2k`

3. **Sorting Magic**: After sorting, elements that can be made equal form a **contiguous subarray**

4. **Sliding Window**: Find the longest contiguous subarray where `max - min ≤ 2k`

### Why Sorting Works

Consider elements at positions i and j in sorted array where i < j:
- If `nums[j] - nums[i] ≤ 2k`, there exists a value T that both can become
- We can choose T = nums[i] + k (or any value in the overlap)
- All elements between i and j also satisfy the condition (sorted property)

### Algorithm Overview

1. **Sort the array**: Enables contiguous window property
2. **Two-pointer window**: Expand right pointer, shrink left when condition fails
3. **Track maximum**: Update max_beauty with window size

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointer Sliding Window** - Optimal solution
2. **Binary Search + Prefix** - Alternative approach

---

## Approach 1: Two Pointer Sliding Window (Optimal)

### Algorithm Steps

1. Sort the input array
2. Initialize two pointers: left = 0, max_beauty = 0
3. For each right pointer position:
   - While the window is invalid (`nums[right] - nums[left] > 2*k`), move left pointer
   - Update max_beauty with current window size
4. Return max_beauty

### Why It Works

After sorting, elements that can be made equal to some target T form a contiguous subarray where the difference between the maximum and minimum is at most 2k. The sliding window efficiently finds the largest such window.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumBeauty(self, nums: List[int], k: int) -> int:
        """
        Find maximum beauty after applying operation.
        
        Uses two-pointer sliding window after sorting.
        
        Args:
            nums: Input array
            k: Operation parameter
            
        Returns:
            Maximum possible beauty
        """
        # Step 1: Sort the array
        nums.sort()
        
        # Step 2: Sliding window
        left = 0
        max_beauty = 0
        
        for right in range(len(nums)):
            # Shrink window if elements can't be made equal
            while nums[right] - nums[left] > 2 * k:
                left += 1
            
            # Update maximum beauty
            max_beauty = max(max_beauty, right - left + 1)
        
        return max_beauty
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximumBeauty(vector<int>& nums, int k) {
        // Step 1: Sort the array
        sort(nums.begin(), nums.end());
        
        // Step 2: Sliding window
        int left = 0;
        int maxBeauty = 0;
        
        for (int right = 0; right < nums.size(); right++) {
            // Shrink window if elements can't be made equal
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }
            
            // Update maximum beauty
            maxBeauty = max(maxBeauty, right - left + 1);
        }
        
        return maxBeauty;
    }
};
```

<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int maximumBeauty(int[] nums, int k) {
        // Step 1: Sort the array
        Arrays.sort(nums);
        
        // Step 2: Sliding window
        int left = 0;
        int maxBeauty = 0;
        
        for (int right = 0; right < nums.length; right++) {
            // Shrink window if elements can't be made equal
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }
            
            // Update maximum beauty
            maxBeauty = Math.max(maxBeauty, right - left + 1);
        }
        
        return maxBeauty;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maximumBeauty = function(nums, k) {
    // Step 1: Sort the array
    nums.sort((a, b) => a - b);
    
    // Step 2: Sliding window
    let left = 0;
    let maxBeauty = 0;
    
    for (let right = 0; right < nums.length; right++) {
        // Shrink window if elements can't be made equal
        while (nums[right] - nums[left] > 2 * k) {
            left++;
        }
        
        // Update maximum beauty
        maxBeauty = Math.max(maxBeauty, right - left + 1);
    }
    
    return maxBeauty;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) — Sorting dominates; sliding window is O(n) |
| **Space** | O(1) — In-place sorting |

---

## Approach 2: Binary Search + Prefix (Alternative)

### Algorithm Steps

1. Sort the array
2. Use binary search on window size
3. For each mid, check if any window of that size satisfies the condition
4. Binary search finds the maximum valid size

### Why It Works

This approach verifies the feasibility of each window size using binary search. For each candidate size, we check if there's a contiguous subarray where the difference between max and min is at most 2k.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumBeauty(self, nums: List[int], k: int) -> int:
        """Alternative: Binary search approach."""
        nums.sort()
        n = len(nums)
        
        def can_form(size):
            if size == 0:
                return True
            for i in range(n - size + 1):
                if nums[i + size - 1] - nums[i] <= 2 * k:
                    return True
            return False
        
        # Binary search for maximum size
        left, right = 0, n
        while left < right:
            mid = (left + right + 1) // 2
            if can_form(mid):
                left = mid
            else:
                right = mid - 1
        
        return left
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximumBeauty(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        
        auto canForm = [&](int size) {
            if (size == 0) return true;
            for (int i = 0; i + size <= n; i++) {
                if (nums[i + size - 1] - nums[i] <= 2 * k) {
                    return true;
                }
            }
            return false;
        };
        
        int left = 0, right = n;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (canForm(mid)) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }
};
```

<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int maximumBeauty(int[] nums, int k) {
        Arrays.sort(nums);
        int n = nums.length;
        
        java.util.function.IntPredicate canForm = size -> {
            if (size == 0) return true;
            for (int i = 0; i + size <= n; i++) {
                if (nums[i + size - 1] - nums[i] <= 2 * k) {
                    return true;
                }
            }
            return false;
        };
        
        int left = 0, right = n;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (canForm.test(mid)) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }
}
```

<!-- slide -->
```javascript
var maximumBeauty = function(nums, k) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    
    const canForm = (size) => {
        if (size === 0) return true;
        for (let i = 0; i + size <= n; i++) {
            if (nums[i + size - 1] - nums[i] <= 2 * k) {
                return true;
            }
        }
        return false;
    };
    
    let left = 0, right = n;
    while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        if (canForm(mid)) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) — Binary search with O(n) check |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Two Pointer | Binary Search |
|--------|-------------|---------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Medium |

**Best Approach:** Use Approach 1 (Two Pointer) - it's more intuitive and efficient.

---

## Related Problems

Based on similar themes (sliding window, transformation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Nice Subarray | [Link](https://leetcode.com/problems/longest-nice-subarray/) | Sliding window with bitwise |
| Smallest Range Covering Elements | [Link](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) | Similar range concept |
| Maximum Consecutive Ones | [Link](https://leetcode.com/problems/maximum-consecutive-ones-iii/) | Sliding window variant |
| Longest Subarray with Ones After Replacement | [Link](https://leetcode.com/problems/longest-subarray-with-ones-after-replacement/) | Window with limit |

### Pattern Reference

For more detailed explanations of the sliding window pattern, see:
- **[Sliding Window Pattern](/patterns/sliding-window)**
- **[Two Pointers Pattern](/patterns/two-pointers)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximum Beauty - LeetCode 2779](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Sliding Window Technique](https://www.youtube.com/watch?v=example)** - Understanding the pattern
3. **[Two Pointers Approach](https://www.youtube.com/watch?v=example)** - Detailed walkthrough

### Related Concepts

- **[Sorting for Range Problems](https://www.youtube.com/watch?v=example)** - Why sorting helps
- **[Window Shrinking](https://www.youtube.com/watch?v=example)** - Efficient window management

---

## Follow-up Questions

### Q1: How would you modify the solution to handle the problem where we must use exactly k operations?

**Answer:** The problem already allows "any number of times" including zero. If we required exactly k operations, we'd need to track the number of elements modified and ensure we use all k operations.

---

### Q2: What if we could choose any target value, not constrained by the operation range?

**Answer:** If there's no constraint (k = infinity), we could make all elements equal to any value, so the answer would be the entire array length.

---

### Q3: How would you modify for a circular array?

**Answer:** For a circular version, you'd need to consider windows that wrap around. A common technique is to duplicate the array or use modular arithmetic with the sorted approach.

---

### Q4: Can you solve this without sorting (in O(n) time)?

**Answer:** Without sorting, the problem becomes much harder because elements that can be equal are no longer contiguous. You'd need advanced data structures like segment trees or balanced BSTs, making it O(n log n).

---

### Q5: What if we wanted the actual subsequence that achieves maximum beauty?

**Answer:** Track the indices along with the window. When updating max_beauty, also store the left and right indices that achieve it. Then reconstruct the subsequence.

---

## Common Pitfalls

### 1. Wrong Window Condition
**Issue**: Using `> k` instead of `> 2*k`.

**Solution**: Remember the condition is `nums[right] - nums[left] > 2 * k` because each element can change by k in either direction.

### 2. Not Sorting First
**Issue**: Trying to use sliding window on unsorted array.

**Solution**: Always sort first - the contiguous property only holds after sorting.

### 3. k = 0 Edge Case
**Issue**: Not handling k = 0 correctly.

**Solution**: The algorithm works correctly for k = 0 since only equal elements (difference 0) can be in the window.

### 4. Window Size Calculation
**Issue**: Off-by-one errors in window size.

**Solution**: Window size is `right - left + 1` (inclusive range).

### 5. Empty Array
**Issue**: Not handling empty array.

**Solution**: With constraints `n >= 1`, this isn't an issue, but always good to verify.

---

## Summary

The **Maximum Beauty of an Array After Applying Operation** problem demonstrates how **sorting enables sliding window** solutions for range-based problems. The key insight is that elements that can be transformed to a common value form a contiguous subarray when sorted.

Key takeaways:
1. After sorting, elements that can be made equal have `max - min ≤ 2k`
2. Use two-pointer sliding window to find longest such subarray
3. Time complexity is O(n log n) dominated by sorting
4. Space is O(1) with in-place sorting

This problem is essential for understanding how sorting transforms problems and enables efficient window-based solutions.

### Pattern Summary

This problem exemplifies the **Sliding Window with Sorting** pattern, characterized by:
- Sorting to enable contiguous property
- Two pointers for O(n) window traversal
- Range-based feasibility condition
- O(n log n) overall time complexity

For more details on this pattern and its variations, see the **[Sliding Window Pattern](/patterns/sliding-window)**.

---

## Additional Resources

- [LeetCode Problem 2779](https://leetcode.com/problems/maximum-beauty-of-an-array-after-applying-operation/) - Official problem page
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Detailed explanation
- [Two Pointers Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - Related technique
- [Pattern: Sliding Window](/patterns/sliding-window) - Comprehensive pattern guide
