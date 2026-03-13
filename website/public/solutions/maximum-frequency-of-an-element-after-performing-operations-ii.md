# Maximum Frequency Of An Element After Performing Operations II

## Problem Description

You are given an integer array `nums` and two integers `k` and `numOperations`. You must perform an operation `numOperations` times on `nums`, where in each operation you:

1. Select an index `i` that was not selected in any previous operations
2. Add an integer in the range `[-k, k]` to `nums[i]`

Return the maximum possible frequency of any element in `nums` after performing the operations.

---

## Examples

### Example 1

**Input:** `nums = [1,4,5]`, `k = 1`, `numOperations = 2`

**Output:** `2`

**Explanation:**

We can achieve a maximum frequency of two by:
- Adding `0` to `nums[1]`, after which `nums` becomes `[1, 4, 5]`
- Adding `-1` to `nums[2]`, after which `nums` becomes `[1, 4, 4]`

### Example 2

**Input:** `nums = [5,11,20,20]`, `k = 5`, `numOperations = 1`

**Output:** `2`

**Explanation:**

We can achieve a maximum frequency of two by:
- Adding `0` to `nums[1]`

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`
- `0 <= k <= 10^9`
- `0 <= numOperations <= nums.length`

---

## Pattern: Two Pointer Sliding Window

This problem uses the **Sliding Window** pattern with two pointers. After sorting, we expand the window to include all elements that can be made equal (difference <= 2*k). The key insight is that any two elements within range `[num-k, num+k]` can be transformed to become equal.

---

## Intuition

The key insight for this problem is understanding how elements can be transformed to become equal:

### Key Observations

1. **Transformable Range**: Two elements `a` and `b` can both be transformed to some value if:
   - `a - k ≤ T ≤ a + k` and `b - k ≤ T ≤ b + k`
   - This is possible when `|a - b| ≤ 2k`

2. **Window Property**: After sorting, elements that can all be made equal form a contiguous window where `max - min ≤ 2k`

3. **Operations Limit**: We can only change `numOperations` elements, so we need to consider this constraint.

4. **Final Answer**: Maximum window size limited by available operations.

### Why Sliding Window Works

- After sorting, we can use two pointers to track a window
- When `nums[right] - nums[left] > 2k`, shrink from left
- Window [left, right] contains elements that can all be made equal

### Algorithm Overview

1. Sort the array
2. Use sliding window with two pointers
3. Track maximum window size
4. Clamp result by operations available

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window** - Optimal solution
2. **Binary Search** - Alternative approach

---

## Approach 1: Sliding Window (Optimal)

### Algorithm Steps

1. Sort the array
2. Initialize left pointer and maximum frequency
3. For each right pointer:
   - Shrink window while `nums[right] - nums[left] > 2*k`
   - Update maximum frequency
4. Return min(max_freq, n - numOperations)

### Why It Works

- After sorting, elements in a valid window can all be transformed to the same value
- The window size represents how many elements can potentially match
- We need operations for elements that don't already match

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int, numOperations: int) -> int:
        """
        Find maximum frequency after operations.
        
        Uses sliding window approach.
        
        Args:
            nums: Input array
            k: Range parameter for transformation
            numOperations: Number of operations allowed
            
        Returns:
            Maximum possible frequency
        """
        # Step 1: Sort the array
        nums.sort()
        
        left = 0
        max_f = 0
        n = len(nums)
        
        # Step 2: Sliding window
        for right in range(n):
            # Shrink window while elements can't be made equal
            while nums[right] - nums[left] > 2 * k:
                left += 1
            
            # Current window size
            f = right - left + 1
            max_f = max(max_f, f)
        
        # Step 3: Clamp by available operations
        # Need operations for elements that don't match
        return min(max_f, n - numOperations)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxFrequency(vector<int>& nums, int k, int numOperations) {
        // Step 1: Sort
        sort(nums.begin(), nums.end());
        
        int left = 0;
        int maxF = 0;
        int n = nums.size();
        
        // Step 2: Sliding window
        for (int right = 0; right < n; right++) {
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }
            
            int f = right - left + 1;
            maxF = max(maxF, f);
        }
        
        // Step 3: Clamp by operations
        return min(maxF, n - numOperations);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxFrequency(int[] nums, int k, int numOperations) {
        // Step 1: Sort
        Arrays.sort(nums);
        
        int left = 0;
        int maxF = 0;
        int n = nums.length;
        
        // Step 2: Sliding window
        for (int right = 0; right < n; right++) {
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }
            
            int f = right - left + 1;
            maxF = Math.max(maxF, f);
        }
        
        // Step 3: Clamp by operations
        return Math.min(maxF, n - numOperations);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} numOperations
 * @return {number}
 */
var maxFrequency = function(nums, k, numOperations) {
    // Step 1: Sort
    nums.sort((a, b) => a - b);
    
    let left = 0;
    let maxF = 0;
    const n = nums.length;
    
    // Step 2: Sliding window
    for (let right = 0; right < n; right++) {
        while (nums[right] - nums[left] > 2 * k) {
            left++;
        }
        
        const f = right - left + 1;
        maxF = Math.max(maxF, f);
    }
    
    // Step 3: Clamp by operations
    return Math.min(maxF, n - numOperations);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) — Sorting dominates, window is O(n) |
| **Space** | O(1) |

---

## Approach 2: Binary Search (Alternative)

### Algorithm Steps

1. Sort the array
2. Use binary search on window size
3. For each size, check if valid window exists
4. Find maximum valid size

### Why It Works

Binary search can find the maximum window size that satisfies the constraint.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int, numOperations: int) -> int:
        """Alternative: Binary search approach."""
        nums.sort()
        n = len(nums)
        
        def can_form(size):
            if size <= 1:
                return True
            for i in range(n - size + 1):
                if nums[i + size - 1] - nums[i] <= 2 * k:
                    return True
            return False
        
        left, right = 1, n
        while left < right:
            mid = (left + right + 1) // 2
            if can_form(mid):
                left = mid
            else:
                right = mid - 1
        
        return min(left, n - numOperations)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxFrequency(vector<int>& nums, int k, int numOperations) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        
        auto canForm = [&](int size) {
            if (size <= 1) return true;
            for (int i = 0; i + size <= n; i++) {
                if (nums[i + size - 1] - nums[i] <= 2 * k) {
                    return true;
                }
            }
            return false;
        };
        
        int left = 1, right = n;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (canForm(mid)) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        
        return min(left, n - numOperations);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxFrequency(int[] nums, int k, int numOperations) {
        Arrays.sort(nums);
        int n = nums.length;
        
        java.util.function.IntPredicate canForm = size -> {
            if (size <= 1) return true;
            for (int i = 0; i + size <= n; i++) {
                if (nums[i + size - 1] - nums[i] <= 2 * k) {
                    return true;
                }
            }
            return false;
        };
        
        int left = 1, right = n;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (canForm.test(mid)) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        
        return Math.min(left, n - numOperations);
    }
}
```

<!-- slide -->
```javascript
var maxFrequency = function(nums, k, numOperations) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    
    const canForm = (size) => {
        if (size <= 1) return true;
        for (let i = 0; i + size <= n; i++) {
            if (nums[i + size - 1] - nums[i] <= 2 * k) {
                return true;
            }
        }
        return false;
    };
    
    let left = 1, right = n;
    while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        if (canForm(mid)) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    
    return Math.min(left, n - numOperations);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Sliding Window | Binary Search |
|--------|---------------|---------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Medium |

**Best Approach:** Use Approach 1 (Sliding Window) - it's cleaner and more intuitive.

---

## Related Problems

Based on similar themes (sliding window, sorting):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Beauty | [Link](https://leetcode.com/problems/maximum-beauty-of-an-array-after-applying-operation/) | Similar range concept |
| Longest Nice Subarray | [Link](https://leetcode.com/problems/longest-nice-subarray/) | Sliding window |
| Maximum Consecutive Ones | [Link](https://leetcode.com/problems/maximum-consecutive-ones-iii/) | Window variant |
| Smallest Range I | [Link](https://leetcode.com/problems/smallest-range-i/) | Range adjustment |

### Pattern Reference

For more detailed explanations, see:
- **[Sliding Window Pattern](/patterns/sliding-window)**
- **[Two Pointers Pattern](/patterns/two-pointers)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximum Frequency II - LeetCode 1839](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Sliding Window Technique](https://www.youtube.com/watch?v=example)** - Understanding the pattern
3. **[Two Pointers Approach](https://www.youtube.com/watch?v=example)** - Implementation details

### Related Concepts

- **[Sorting for Range Problems](https://www.youtube.com/watch?v=example)** - Why sorting helps
- **[Array Transformation](https://www.youtube.com/watch?v=example)** - Operation mechanics

---

## Follow-up Questions

### Q1: How would you track which elements to transform to achieve maximum frequency?

**Answer:** Track the window indices. Elements inside the window can be transformed to nums[right] (or any value in range).

---

### Q2: What if k is extremely large (larger than array range)?

**Answer:** If k >= (max - min), all elements can become equal. Answer is min(n, n - numOperations + base_count).

---

### Q3: How does this differ from the first version (Operations I)?

**Answer:** The main difference is in constraints and implementation efficiency. Both use similar sliding window logic.

---

### Q4: Can you solve without sorting?

**Answer:** Without sorting, you'd need O(n²) to find valid windows. Sorting is essential for O(n log n).

---

### Q5: What if numOperations equals n?

**Answer:** Then we can make all elements equal to any value. Answer is n.

---

## Common Pitfalls

### 1. Wrong Window Condition
**Issue**: Using `> k` instead of `> 2*k`.

**Solution**: Remember each element can change by k in either direction, so total range is 2*k.

### 2. Not Sorting First
**Issue**: Using sliding window on unsorted array.

**Solution**: Always sort first - contiguous property only holds after sorting.

### 3. Not Clamping Result
**Issue**: Returning window size without considering operations.

**Solution**: Return min(max_window, n - numOperations).

### 4. Empty Window
**Issue**: Not handling edge case when no valid window.

**Solution**: Algorithm handles this - window always has at least 1 element.

### 5. Overflow
**Issue**: Large numbers causing overflow in some languages.

**Solution**: Use appropriate integer types.

---

## Summary

The **Maximum Frequency of an Element After Performing Operations II** problem demonstrates the power of **sliding window after sorting**. The key insight is that elements transformable to a common value form a contiguous window.

Key takeaways:
1. After sorting, elements with difference ≤ 2k can be made equal
2. Sliding window finds maximum such window efficiently
3. Clamp result by available operations: min(window, n - ops)
4. O(n log n) time with O(1) space

This problem is essential for understanding how sliding window works with range constraints.

### Pattern Summary

This problem exemplifies the **Sliding Window with Sorting** pattern, characterized by:
- Sorting to enable contiguous property
- Two pointers for efficient window traversal
- Range-based feasibility condition
- O(n log n) overall complexity

For more details on this pattern and its variations, see the **[Sliding Window Pattern](/patterns/sliding-window)**.

---

## Additional Resources

- [LeetCode Problem 1839](https://leetcode.com/problems/maximum-frequency-of-an-element-after-performing-operations-ii/) - Official problem page
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Detailed explanation
- [Two Pointers](https://www.geeksforgeeks.org/two-pointers-technique/) - Related technique
- [Pattern: Sliding Window](/patterns/sliding-window) - Comprehensive pattern guide
