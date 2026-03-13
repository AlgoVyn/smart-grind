# Maximum Width Ramp

## Problem Description

A ramp in an integer array `nums` is a pair `(i, j)` for which `i < j` and `nums[i] <= nums[j]`. The width of such a ramp is `j - i`.

Given an integer array `nums`, return the maximum width of a ramp in `nums`. If there is no ramp in `nums`, return `0`.

**Link to problem:** [Maximum Width Ramp - LeetCode 962](https://leetcode.com/problems/maximum-width-ramp/)

---

## Pattern: Sorting + Traversal

This problem demonstrates the **Sort by Value, Track Min Index** pattern. We sort indices by their corresponding values and track the minimum index seen so far.

### Core Concept

The fundamental idea is:
- Sort indices by their corresponding values (ascending)
- While iterating through sorted indices, track the minimum index seen so far
- For each index i in sorted order, the current width = i - min_index
- The maximum of these widths is our answer

---

## Examples

### Example

**Input:**
```
nums = [6,0,8,2,1,5]
```

**Output:**
```
4
```

**Explanation:** The maximum width ramp is achieved at (i, j) = (1, 5):
- nums[1] = 0
- nums[5] = 5
- width = 5 - 1 = 4

### Example 2

**Input:**
```
nums = [9,8,1,0,1,9,4,0,4,1]
```

**Output:**
```
7
```

**Explanation:** The maximum width ramp is achieved at (i, j) = (2, 9):
- nums[2] = 1
- nums[9] = 1
- width = 9 - 2 = 7

### Example 3

**Input:**
```
nums = [1,2,3,4]
```

**Output:**
```
3
```

**Explanation:** Maximum ramp from index 0 to 3.

---

## Constraints

- `2 <= nums.length <= 5 * 10^4`
- `0 <= nums[i] <= 5 * 10^4`

---

## Intuition

The key insight is that by sorting indices by their values, we ensure that when we see a larger value, any smaller value we've seen before can form a valid ramp with it. We just need to track the minimum index among all previously seen (smaller) values.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sort + Single Pass** - O(n log n) time (Optimal)
2. **Monotonic Stack** - O(n) time, O(n) space

---

## Approach 1: Sort + Single Pass (Optimal)

### Algorithm Steps

1. Create an array of indices: [0, 1, 2, ..., n-1]
2. Sort indices based on nums[i] values
3. Initialize min_index = n (large value)
4. Iterate through sorted indices:
   - Update min_index = min(min_index, current_index)
   - Calculate width = current_index - min_index
   - Update answer with maximum width
5. Return answer

### Why It Works

When we process indices in increasing order of their values, any previous index has a value ≤ current value. Since we also track the minimum index, each current index can form a ramp with the smallest index seen so far, giving us the maximum possible width for that index.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxWidthRamp(self, nums: List[int]) -> int:
        """
        Find maximum width ramp using sorting.
        
        Args:
            nums: Array of integers
            
        Returns:
            Maximum width of a ramp
        """
        n = len(nums)
        # Sort indices by value
        indices = sorted(range(n), key=lambda i: nums[i])
        
        max_width = 0
        min_index = n
        
        for i in indices:
            # Update minimum index seen so far
            min_index = min(min_index, i)
            # Calculate width with current index
            max_width = max(max_width, i - min_index)
        
        return max_width
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxWidthRamp(vector<int>& nums) {
        /**
         * Find maximum width ramp using sorting.
         * 
         * Args:
         *     nums: Array of integers
         * 
         * Returns:
         *     Maximum width of a ramp
         */
        int n = nums.size();
        vector<int> indices(n);
        iota(indices.begin(), indices.end(), 0);
        
        sort(indices.begin(), indices.end(), 
             [&](int a, int b) { return nums[a] < nums[b]; });
        
        int max_width = 0;
        int min_index = n;
        
        for (int i : indices) {
            min_index = min(min_index, i);
            max_width = max(max_width, i - min_index);
        }
        
        return max_width;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxWidthRamp(int[] nums) {
        /**
         * Find maximum width ramp using sorting.
         * 
         * Args:
         *     nums: Array of integers
         * 
         * Returns:
         *     Maximum width of a ramp
         */
        int n = nums.length;
        Integer[] indices = new Integer[n];
        for (int i = 0; i < n; i++) {
            indices[i] = i;
        }
        
        Arrays.sort(indices, (a, b) -> nums[a] - nums[b]);
        
        int maxWidth = 0;
        int minIndex = n;
        
        for (int i : indices) {
            minIndex = Math.min(minIndex, i);
            maxWidth = Math.max(maxWidth, i - minIndex);
        }
        
        return maxWidth;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum width ramp using sorting.
 * 
 * @param {number[]} nums - Array of integers
 * @return {number} - Maximum width of a ramp
 */
var maxWidthRamp = function(nums) {
    const n = nums.length;
    const indices = Array.from({length: n}, (_, i) => i);
    
    indices.sort((a, b) => nums[a] - nums[b]);
    
    let maxWidth = 0;
    let minIndex = n;
    
    for (const i of indices) {
        minIndex = Math.min(minIndex, i);
        maxWidth = Math.max(maxWidth, i - minIndex);
    }
    
    return maxWidth;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Sorting dominates |
| **Space** | O(n) - For indices array |

---

## Approach 2: Monotonic Stack

### Algorithm Steps

1. Build a monotonic decreasing stack of indices
2. Traverse from right to left
3. For each index, pop while current value >= nums[stack.top()]
4. Calculate width and update answer
5. Return answer

### Why It Works

The stack stores candidate indices that could form the start of a ramp. By traversing from right to left and popping when we find larger/equal values, we ensure we find the widest ramp for each ending position.

### Code Implementation

````carousel
```python
class Solution:
    def maxWidthRamp_stack(self, nums: List[int]) -> int:
        """
        Find maximum width ramp using monotonic stack.
        """
        n = len(nums)
        stack = []
        
        # Build monotonic decreasing stack
        for i in range(n):
            if not stack or nums[i] < nums[stack[-1]]:
                stack.append(i)
        
        # Traverse from right to left
        max_width = 0
        for j in range(n - 1, -1, -1):
            while stack and nums[j] >= nums[stack[-1]]:
                i = stack.pop()
                max_width = max(max_width, j - i)
        
        return max_width
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxWidthRamp(vector<int>& nums) {
        int n = nums.size();
        vector<int> stack;
        
        for (int i = 0; i < n; i++) {
            if (stack.empty() || nums[i] < nums[stack.back()]) {
                stack.push_back(i);
            }
        }
        
        int maxWidth = 0;
        for (int j = n - 1; j >= 0; j--) {
            while (!stack.empty() && nums[j] >= nums[stack.back()]) {
                int i = stack.back();
                stack.pop_back();
                maxWidth = max(maxWidth, j - i);
            }
        }
        
        return maxWidth;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxWidthRamp(int[] nums) {
        int n = nums.length;
        Stack<Integer> stack = new Stack<>();
        
        for (int i = 0; i < n; i++) {
            if (stack.isEmpty() || nums[i] < nums[stack.peek()]) {
                stack.push(i);
            }
        }
        
        int maxWidth = 0;
        for (int j = n - 1; j >= 0; j--) {
            while (!stack.isEmpty() && nums[j] >= nums[stack.peek()]) {
                int i = stack.pop();
                maxWidth = Math.max(maxWidth, j - i);
            }
        }
        
        return maxWidth;
    }
}
```

<!-- slide -->
```javascript
var maxWidthRamp = function(nums) {
    const stack = [];
    
    for (let i = 0; i < nums.length; i++) {
        if (stack.length === 0 || nums[i] < nums[stack[stack.length - 1]]) {
            stack.push(i);
        }
    }
    
    let maxWidth = 0;
    for (let j = nums.length - 1; j >= 0; j--) {
        while (stack.length > 0 && nums[j] >= nums[stack[stack.length - 1]]) {
            const i = stack.pop();
            maxWidth = Math.max(maxWidth, j - i);
        }
    }
    
    return maxWidth;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each index pushed and popped at most once |
| **Space** | O(n) - Stack can hold up to n indices |

---

## Comparison of Approaches

| Aspect | Sort + Single Pass | Monotonic Stack |
|--------|-------------------|-----------------|
| **Time** | O(n log n) | O(n) |
| **Space** | O(n) | O(n) |
| **Implementation** | Simpler | More complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

Both approaches are accepted. The sort-based approach is simpler and usually sufficient.

---

## Related Problems

Based on similar themes (sorting indices, monotonic structures):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Max Increase to Keep City Skyline | [Link](https://leetcode.com/problems/max-increase-to-keep-city-skyline/) | Similar sorting |
| Monotonic Array | [Link](https://leetcode.com/problems/monotonic-array/) | Monotonic check |
| Next Greater Element I | [Link](https://leetcode.com/problems/next-greater-element-i/) | Monotonic stack |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sorting Approach

- [NeetCode - Maximum Width Ramp](https://www.youtube.com/watch?v=0X2-6VMAqFw) - Clear explanation
- [Sort by Value Technique](https://www.youtube.com/watch?v=Hiz8Z7XHr_s) - Understanding the pattern

### Monotonic Stack

- [Monotonic Stack Pattern](https://www.youtube.com/watch?v=1s0kXw6l4fU) - Comprehensive guide
- [Stack Problems](https://www.youtube.com/watch?v=9K2Jkus0784) - Similar problems

---

## Follow-up Questions

### Q1: Why sort by value instead of iterating from left to right?

**Answer:** Sorting by value ensures that when we process an element, all previously processed elements have values ≤ current value, guaranteeing a valid ramp. We then only need to track the minimum index.

---

### Q2: Can we solve it in O(n) without extra space?

**Answer:** No, the best time complexity is O(n log n) with O(1) extra space, or O(n) with O(n) space using monotonic stack. The sorting is necessary to ensure the ramp validity.

---

### Q3: How does this relate to the "Maximum Distance Between Ascending Elements"?

**Answer:** They are essentially the same problem. A ramp requires nums[i] ≤ nums[j], which means j is the position of an element greater than or equal to nums[i].

---

### Q4: What if we need the actual pair (i, j) instead of just the width?

**Answer:** Track the index when updating max_width. Store (i, j) instead of just the width.

---

### Q5: How would you handle strict inequality (nums[i] < nums[j])?

**Answer:** Simply change nums[j] >= nums[stack[-1]] to nums[j] > nums[stack[-1]] in the monotonic stack approach, or nums[a] < nums[b] in the sorting comparison.

---

### Q6: What edge cases should be tested?

**Answer:**
- Decreasing array (no ramp, answer = 0)
- Increasing array (full width)
- Array with all same values (full width)
- Single peak in middle
- Multiple equal values scattered

---

### Q7: Why is the stack approach O(n)?

**Answer:** Each index is pushed onto the stack exactly once and popped at most once. The nested while loop doesn't cause nested iterations across all elements.

---

## Common Pitfalls

### 1. Sorting Indices Instead of Values
**Issue:** Sorting the array instead of indices.

**Solution:** Create indices array first, then sort based on values: `sorted(range(n), key=lambda i: nums[i])`

### 2. Not Tracking Minimum Index
**Issue:** Not maintaining min_index while iterating.

**Solution:** Update min_index before calculating width.

### 3. Wrong Inequality Direction
**Issue:** Using > instead of >= when checking ramp condition.

**Solution:** Remember ramp allows equal values: nums[i] <= nums[j]

---

## Summary

The **Maximum Width Ramp** problem demonstrates:

- **Sort by Value Pattern**: Sort indices based on values to process in increasing order
- **Track Minimum Index**: Maintain minimum index seen so far
- **Time Complexity**: O(n log n) with sorting, O(n) with monotonic stack
- **Space Complexity**: O(n)

This problem is an excellent example of how sorting can transform a seemingly complex problem into a simple linear scan.

For more details on this pattern, see the **[Sort by Value](/algorithms/sorting/sort-by-value)**.
