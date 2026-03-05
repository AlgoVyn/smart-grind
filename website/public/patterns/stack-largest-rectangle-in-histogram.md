# Stack - Largest Rectangle in Histogram

## Problem Description

The Largest Rectangle in Histogram pattern uses a monotonic stack to find the largest rectangular area in a histogram in linear time. Given an array of bar heights, find the maximum area rectangle that can be formed.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass with stack operations |
| Space Complexity | O(n) - for the monotonic stack |
| Input | Array of integers representing bar heights |
| Output | Maximum rectangular area (integer) |
| Approach | Monotonic increasing stack with area calculation on pop |

### When to Use

- Finding maximum rectangular area in bar charts
- Computing largest rectangles in binary matrices (2D extension)
- Problems involving area calculations with height constraints
- Problems requiring finding next smaller element to left/right
- Maximum area problems with height-width relationships

## Intuition

The key insight is that **the limiting height for any rectangle is the minimum bar within its width**.

The "aha!" moments:

1. **Monotonic stack**: Maintain increasing heights to know when a bar "ends"
2. **Area on pop**: When a smaller bar is found, calculate area for popped bar
3. **Width calculation**: Width extends from previous smaller to current position
4. **Sentinel value**: Add 0 at end to flush remaining stack elements
5. **Each bar processed once**: Push and pop at most once each

## Solution Approaches

### Approach 1: Monotonic Stack with Sentinel ✅ Recommended

#### Algorithm

1. Initialize empty stack and max_area = 0
2. Append 0 to heights (sentinel to flush stack)
3. For each bar at index i:
   - While stack not empty AND current height < height at stack top:
     - Pop height and calculate area
     - Width = i if stack empty, else i - stack_top - 1
     - Update max_area
   - Push current index
4. Return max_area

#### Implementation

````carousel
```python
def largest_rectangle_area(heights: list[int]) -> int:
    """
    Find largest rectangle area in histogram.
    LeetCode 84 - Largest Rectangle in Histogram
    Time: O(n), Space: O(n)
    """
    stack = []  # Stack of indices with increasing heights
    max_area = 0
    
    # Add sentinel value to handle remaining bars
    heights = heights + [0]
    
    for i, h in enumerate(heights):
        # Pop while current height is smaller than stack top
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            # Calculate width
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```
<!-- slide -->
```cpp
#include <vector>
#include <stack>
#include <algorithm>

int largestRectangleArea(std::vector<int>& heights) {
    // Find largest rectangle area in histogram.
    // Time: O(n), Space: O(n)
    std::stack<int> stack;
    int maxArea = 0;
    
    // Add sentinel value
    heights.push_back(0);
    
    for (int i = 0; i < heights.size(); i++) {
        while (!stack.empty() && heights[stack.top()] > heights[i]) {
            int height = heights[stack.top()];
            stack.pop();
            int width = stack.empty() ? i : i - stack.top() - 1;
            maxArea = std::max(maxArea, height * width);
        }
        stack.push(i);
    }
    
    heights.pop_back();  // Restore original
    return maxArea;
}
```
<!-- slide -->
```java
import java.util.Stack;

public int largestRectangleArea(int[] heights) {
    // Find largest rectangle area in histogram.
    // Time: O(n), Space: O(n)
    Stack<Integer> stack = new Stack<>();
    int maxArea = 0;
    
    for (int i = 0; i <= heights.length; i++) {
        int h = (i == heights.length) ? 0 : heights[i];
        
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    
    return maxArea;
}
```
<!-- slide -->
```javascript
function largestRectangleArea(heights) {
    // Find largest rectangle area in histogram.
    // Time: O(n), Space: O(n)
    const stack = [];
    let maxArea = 0;
    
    // Add sentinel value
    heights.push(0);
    
    for (let i = 0; i < heights.length; i++) {
        while (stack.length > 0 && heights[stack[stack.length - 1]] > heights[i]) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    
    heights.pop();  // Restore original
    return maxArea;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - each element pushed and popped at most once |
| Space | O(n) - stack size |

### Approach 2: Two-Pass with Next Smaller Element

Precompute next smaller to left and right for each bar, then calculate areas.

#### Implementation

````carousel
```python
def largest_rectangle_area_nse(heights: list[int]) -> int:
    """
    Find largest area using next smaller element arrays.
    Time: O(n), Space: O(n)
    """
    n = len(heights)
    left = [-1] * n   # Index of next smaller to left
    right = [n] * n   # Index of next smaller to right
    
    # Find next smaller to left
    stack = []
    for i in range(n):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        left[i] = stack[-1] if stack else -1
        stack.append(i)
    
    # Find next smaller to right
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        right[i] = stack[-1] if stack else n
        stack.append(i)
    
    # Calculate max area
    max_area = 0
    for i in range(n):
        width = right[i] - left[i] - 1
        max_area = max(max_area, heights[i] * width)
    
    return max_area
```
<!-- slide -->
```cpp
int largestRectangleAreaNSE(std::vector<int>& heights) {
    // Using next smaller element arrays.
    int n = heights.size();
    std::vector<int> left(n, -1), right(n, n);
    std::stack<int> stack;
    
    // Next smaller to left
    for (int i = 0; i < n; i++) {
        while (!stack.empty() && heights[stack.top()] >= heights[i])
            stack.pop();
        left[i] = stack.empty() ? -1 : stack.top();
        stack.push(i);
    }
    
    // Clear stack
    while (!stack.empty()) stack.pop();
    
    // Next smaller to right
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.empty() && heights[stack.top()] >= heights[i])
            stack.pop();
        right[i] = stack.empty() ? n : stack.top();
        stack.pop();
        stack.push(i);
    }
    
    int maxArea = 0;
    for (int i = 0; i < n; i++) {
        int width = right[i] - left[i] - 1;
        maxArea = std::max(maxArea, heights[i] * width);
    }
    
    return maxArea;
}
```
<!-- slide -->
```java
public int largestRectangleAreaNSE(int[] heights) {
    // Using next smaller element arrays.
    int n = heights.length;
    int[] left = new int[n];
    int[] right = new int[n];
    Arrays.fill(left, -1);
    Arrays.fill(right, n);
    
    Stack<Integer> stack = new Stack<>();
    
    // Next smaller to left
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && heights[stack.peek()] >= heights[i])
            stack.pop();
        left[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(i);
    }
    
    stack.clear();
    
    // Next smaller to right
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && heights[stack.peek()] >= heights[i])
            stack.pop();
        right[i] = stack.isEmpty() ? n : stack.peek();
        stack.push(i);
    }
    
    int maxArea = 0;
    for (int i = 0; i < n; i++) {
        int width = right[i] - left[i] - 1;
        maxArea = Math.max(maxArea, heights[i] * width);
    }
    
    return maxArea;
}
```
<!-- slide -->
```javascript
function largestRectangleAreaNSE(heights) {
    // Using next smaller element arrays.
    const n = heights.length;
    const left = new Array(n).fill(-1);
    const right = new Array(n).fill(n);
    const stack = [];
    
    // Next smaller to left
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i])
            stack.pop();
        left[i] = stack.length === 0 ? -1 : stack[stack.length - 1];
        stack.push(i);
    }
    
    stack.length = 0;
    
    // Next smaller to right
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i])
            stack.pop();
        right[i] = stack.length === 0 ? n : stack[stack.length - 1];
        stack.push(i);
    }
    
    let maxArea = 0;
    for (let i = 0; i < n; i++) {
        const width = right[i] - left[i] - 1;
        maxArea = Math.max(maxArea, heights[i] * width);
    }
    
    return maxArea;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - two passes through the array |
| Space | O(n) - for NSE arrays and stack |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Monotonic Stack | O(n) | O(n) | **Recommended** - elegant single pass |
| Two-Pass NSE | O(n) | O(n) | When you need NSE for other purposes |
| Brute Force | O(n²) | O(1) | Never - for understanding only |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 84 | Hard | Core problem |
| [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) | 85 | Hard | 2D extension |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | 695 | Medium | Related area problem |
| [Largest Plus Sign](https://leetcode.com/problems/largest-plus-sign/) | 764 | Medium | Grid-based area |
| [Largest Submatrix](https://leetcode.com/problems/largest-submatrix-with-rearrangements/) | 1727 | Medium | Matrix rearrangement |

## Video Tutorial Links

1. **[NeetCode - Largest Rectangle](https://www.youtube.com/watch?v=zx5Sw9130L0)** - Monotonic stack explanation
2. **[Back To Back SWE - Histogram](https://www.youtube.com/watch?v=zx5Sw9130L0)** - Detailed walkthrough
3. **[Kevin Naughton Jr. - LeetCode 84](https://www.youtube.com/watch?v=zx5Sw9130L0)** - Clean implementation
4. **[Nick White - Maximal Rectangle](https://www.youtube.com/watch?v=zx5Sw9130L0)** - 2D extension
5. **[Techdose - Monotonic Stack](https://www.youtube.com/watch?v=zx5Sw9130L0)** - Pattern overview

## Summary

### Key Takeaways

- **Monotonic increasing stack** tracks bars with increasing heights
- **Calculate area on pop**: When a smaller bar comes, pop and compute area
- **Width formula**: `i - stack[-1] - 1` when stack not empty, else `i`
- **Sentinel value**: Add 0 at end to flush remaining bars
- **2D extension**: Convert each row to histogram and apply same algorithm

### Common Pitfalls

1. Forgetting to add the sentinel value (0) at the end
2. Incorrect width calculation (off-by-one errors)
3. Using `>=` vs `>` incorrectly (affects width calculation)
4. Not handling the case when stack becomes empty
5. Modifying input array permanently (use copy if needed)

### Follow-up Questions

1. **How do you find the maximal rectangle in a binary matrix?**
   - Build histogram for each row, apply this algorithm for each

2. **Can you solve this in O(n) without modifying the input?**
   - Yes, use the two-pass NSE approach

3. **How do you handle very large histograms?**
   - Algorithm is already O(n), should handle millions of bars

4. **What if you need to return the actual rectangle coordinates?**
   - Track height, left, and right boundaries during calculation

5. **How would you solve this with a segment tree?**
   - Query minimum in range, then divide and conquer (O(n log n))

## Pattern Source

[Largest Rectangle in Histogram Pattern](patterns/stack-largest-rectangle-in-histogram.md)
