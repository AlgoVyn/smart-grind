# Largest Rectangle In Histogram

## Problem Description

Given an array of integers `heights` representing the histogram's bar height where the **width of each bar is 1**, return the area of the **largest rectangle** in the histogram.

**LeetCode Link:** [Largest Rectangle in Histogram - LeetCode 84](https://leetcode.com/problems/largest-rectangle-in-histogram/)

---

## Examples

### Example 1

**Input:**
```python
heights = [2,1,5,6,2,3]
```

**Output:**
```python
10
```

**Explanation:** The largest rectangle is formed by bars with heights 5 and 6, spanning indices 2-3. Area = 2 * 5 = 10.

### Example 2

**Input:**
```python
heights = [2,4]
```

**Output:**
```python
4
```

---

## Constraints

- `1 <= heights.length <= 10^5`
- `0 <= heights[i] <= 10^4`

---

## Pattern: Monotonic Stack (Increasing Stack)

This problem uses the **Monotonic Stack** pattern where we maintain a stack of indices with increasing heights. When we encounter a bar shorter than the stack top, we pop and calculate the area with the popped bar as the shortest bar in the rectangle.

---

## Intuition

The key insight is using a **monotonic (increasing) stack** to efficiently find the largest rectangle. Instead of checking all possible rectangles O(n²), we use the stack to process each bar once.

### Key Observations

1. **Bar as Smallest Height**: When a bar is popped from the stack, it becomes the height of the largest rectangle where it is the shortest bar.

2. **Width Calculation**: The width extends from the previous smaller bar to the current bar index.

3. **Sentinel Trick**: Adding a height of 0 at the end flushes all remaining bars from the stack.

### Why Monotonic Stack Works

The stack maintains bars in increasing height order. When we encounter a shorter bar:
- All taller bars in the stack have found their largest width (bounded by current bar)
- We can calculate their area immediately

This ensures each bar is pushed and popped exactly once → O(n) time.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Monotonic Stack (Optimal)** - O(n) time
2. **Divide and Conquer** - O(n log n) - alternative

---

## Approach 1: Monotonic Stack (Optimal)

### Algorithm Steps

1. Use a stack to store indices of bars in increasing height order
2. Iterate through bars + sentinel (height 0)
3. While stack not empty and current height < stack top height:
   - Pop and calculate area with popped bar as height
   - Width = current index - stack top index - 1
4. Push current index to stack
5. Return max area

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        """
        Find largest rectangle in histogram using monotonic stack.
        
        Args:
            heights: List of bar heights
            
        Returns:
            Maximum rectangle area
        """
        stack = []
        max_area = 0
        
        # Iterate through all bars plus sentinel
        for i in range(len(heights) + 1):
            # Current height (0 for sentinel)
            curr_height = heights[i] if i < len(heights) else 0
            
            # While current bar is shorter than stack top
            while stack and curr_height < heights[stack[-1]]:
                h = heights[stack.pop()]
                # Width: from previous smaller to current position
                w = i - (stack[-1] if stack else -1) - 1
                max_area = max(max_area, h * w)
            
            stack.append(i)
        
        return max_area
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0;
        
        for (int i = 0; i <= heights.size(); i++) {
            int currHeight = (i == heights.size()) ? 0 : heights[i];
            
            while (!st.empty() && currHeight < heights[st.top()]) {
                int h = heights[st.top()];
                st.pop();
                int w = i - (st.empty() ? -1 : st.top()) - 1;
                maxArea = max(maxArea, h * w);
            }
            
            st.push(i);
        }
        
        return maxArea;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int largestRectangleArea(int[] heights) {
        Stack<Integer> stack = new Stack<>();
        int maxArea = 0;
        
        for (int i = 0; i <= heights.length; i++) {
            int currHeight = (i == heights.length) ? 0 : heights[i];
            
            while (!stack.isEmpty() && currHeight < heights[stack.peek()]) {
                int h = heights[stack.pop()];
                int w = i - (stack.isEmpty() ? -1 : stack.peek()) - 1;
                maxArea = Math.max(maxArea, h * w);
            }
            
            stack.push(i);
        }
        
        return maxArea;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
    const stack = [];
    let maxArea = 0;
    
    for (let i = 0; i <= heights.length; i++) {
        const currHeight = i === heights.length ? 0 : heights[i];
        
        while (stack.length > 0 && currHeight < heights[stack[stack.length - 1]]) {
            const h = heights[stack.pop()];
            const w = i - (stack.length === 0 ? -1 : stack[stack.length - 1]) - 1;
            maxArea = Math.max(maxArea, h * w);
        }
        
        stack.push(i);
    }
    
    return maxArea;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each bar pushed and popped once |
| **Space** | O(n) - worst case stack size |

---

## Approach 2: Divide and Conquer

### Algorithm Steps

1. Find the bar with minimum height in the range
2. Calculate area: min_height * width
3. Recursively solve for left and right subarrays
4. Return maximum of three areas

### Why It Works

The largest rectangle must either:
- Span the entire range (min_height * width)
- Be entirely in the left portion
- Be entirely in the right portion

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        return self.divide_conquer(heights, 0, len(heights) - 1)
    
    def divide_conquer(self, heights: List[int], left: int, right: int) -> int:
        if left > right:
            return 0
        
        # Find minimum height index
        min_idx = left
        for i in range(left, right + 1):
            if heights[i] < heights[min_idx]:
                min_idx = i
        
        # Area with min height spanning range
        area = heights[min_idx] * (right - left + 1)
        
        # Recursively solve left and right
        left_area = self.divide_conquer(heights, left, min_idx - 1)
        right_area = self.divide_conquer(heights, min_idx + 1, right)
        
        return max(area, left_area, right_area)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        return divideConquer(heights, 0, heights.size() - 1);
    }
    
private:
    int divideConquer(vector<int>& heights, int left, int right) {
        if (left > right) return 0;
        
        int minIdx = left;
        for (int i = left; i <= right; i++) {
            if (heights[i] < heights[minIdx]) {
                minIdx = i;
            }
        }
        
        int area = heights[minIdx] * (right - left + 1);
        int leftArea = divideConquer(heights, left, minIdx - 1);
        int rightArea = divideConquer(heights, minIdx + 1, right);
        
        return max({area, leftArea, rightArea});
    }
};
```

<!-- slide -->
```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        return divideConquer(heights, 0, heights.length - 1);
    }
    
    private int divideConquer(int[] heights, int left, int right) {
        if (left > right) return 0;
        
        int minIdx = left;
        for (int i = left; i <= right; i++) {
            if (heights[i] < heights[minIdx]) {
                minIdx = i;
            }
        }
        
        int area = heights[minIdx] * (right - left + 1);
        int leftArea = divideConquer(heights, left, minIdx - 1);
        int rightArea = divideConquer(heights, minIdx + 1, right);
        
        return Math.max(area, Math.max(leftArea, rightArea));
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
    function divideConquer(left, right) {
        if (left > right) return 0;
        
        let minIdx = left;
        for (let i = left; i <= right; i++) {
            if (heights[i] < heights[minIdx]) {
                minIdx = i;
            }
        }
        
        const area = heights[minIdx] * (right - left + 1);
        const leftArea = divideConquer(left, minIdx - 1);
        const rightArea = divideConquer(minIdx + 1, right);
        
        return Math.max(area, leftArea, rightArea);
    }
    
    return divideConquer(0, heights.length - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) average, O(n²) worst case |
| **Space** | O(n) recursion stack |

---

## Comparison of Approaches

| Aspect | Monotonic Stack | Divide and Conquer |
|--------|-----------------|-------------------|
| **Time Complexity** | O(n) | O(n log n) avg |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |
| **Recommended** | ✅ Best | For understanding |

**Best Approach:** Use Approach 1 (Monotonic Stack) for optimal O(n) solution.

---

## Common Pitfalls

### 1. Using >= vs > in Condition
**Issue**: Using `>` instead of `>=` in the condition.

**Solution**: Use `>=` to handle equal heights correctly.

### 2. Off-by-one in Width
**Issue**: Incorrect width calculation.

**Solution**: Width should be `i - stack[-1] - 1` when popping.

### 3. Sentinel Value
**Issue**: Not adding sentinel to flush remaining bars.

**Solution**: Add height 0 at the end to process all bars.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Monotonic stack, array manipulation

### Learning Outcomes

1. **Monotonic Stack**: Master this important pattern
2. **Stack Applications**: Understand stack beyond basic problems
3. **O(n) Thinking**: Learn to achieve linear time solutions

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximal Rectangle | [Link](https://leetcode.com/problems/maximal-rectangle/) | 2D version |
| Trapping Rain Water | [Link](https://leetcode.com/problems/trapping-rain-water/) | Similar stack usage |
| Online Stock Span | [Link](https://leetcode.com/problems/online-stock-span/) | Monotonic stack |

---

## Video Tutorial Links

1. **[NeetCode - Largest Rectangle in Histogram](https://www.youtube.com/watch?v=zbM48kC5F1s)** - Clear explanation
2. **[Monotonic Stack Pattern](https://www.youtube.com/watch?v=1VvkIB3zjQY)** - Understanding monotonic stacks

---

## Follow-up Questions

### Q1: How would you modify to return the actual rectangle coordinates?

**Answer**: Track the indices when calculating max area, not just the area value.

### Q2: What if bars could have negative heights?

**Answer**: The problem assumes non-negative heights. Negative would require significant modifications.

### Q3: How does this relate to the Maximal Rectangle problem?

**Answer**: Maximal Rectangle applies this algorithm to each row of a 2D matrix.

---

## Summary

The **Largest Rectangle in Histogram** problem demonstrates the **Monotonic Stack** pattern:

Key takeaways:
1. Use monotonic increasing stack to find largest rectangle for each bar
2. When a bar is popped, it becomes the height of the largest rectangle where it's the shortest
3. Add sentinel (height 0) at the end to flush all bars
4. Time complexity is O(n) - each bar pushed and popped once

This problem is essential for understanding the monotonic stack pattern and achieving O(n) solutions for array problems.
