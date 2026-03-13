# Maximal Rectangle

## Problem Description

Given an `rows x cols` binary matrix filled with `0`'s and `1`'s, find the largest rectangle containing only `1`'s and return its area.

---

## Examples

### Example

**Input:**
```python
matrix = [
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"]
]
```

**Output:**
```python
6
```

**Explanation:** The maximal rectangle contains 6 cells of `1`'s.

### Example 2

**Input:**
```python
matrix = [["0"]]
```

**Output:**
```python
0
```

### Example 3

**Input:**
```python
matrix = [["1"]]
```

**Output:**
```python
1
```

---

## Constraints

- `rows == matrix.length`
- `cols == matrix[i].length`
- `1 <= rows, cols <= 200`
- `matrix[i][j]` is `'0'` or `'1'`

---

## LeetCode Link

[LeetCode Problem 85: Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/)

---

## Pattern: Matrix as Histogram

This problem follows the **Matrix as Histogram** pattern, reducing 2D problems to 1D histogram problems.

### Core Concept

- **Histogram Representation**: Each row builds on the previous - heights[j] = consecutive 1's above
- **Row-by-Row Processing**: For each row, treat it as base of histogram
- **Apply Histogram Algorithm**: Use monotonic stack to find largest rectangle
- **Reset on 0**: When cell is '0', reset height to 0

### When to Use This Pattern

This pattern is applicable when:
1. Finding maximum rectangle/square in binary matrix
2. Problems reducible to "largest rectangle in histogram"
3. 2D DP optimization with column-wise accumulation

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Brute Force | O(n³) - check all pairs of rows |
| DP Direct | Compute left/right/boundary arrays |

---

## Intuition

The key insight is **reducing 2D problem to 1D**. Treat each row as the base of a histogram and apply the "largest rectangle in histogram" algorithm.

### Key Observations

1. **Histogram Representation**: Each row builds on the previous - heights[j] = consecutive 1's above current cell
2. **Row-by-Row Processing**: For each row, treat it as base of histogram
3. **Apply Histogram Algorithm**: Use monotonic stack to find largest rectangle
4. **Reset on 0**: When cell is '0', reset height to 0

### Why This Works

Any rectangle of 1's in the matrix will have a bottom row. When we process that bottom row, the heights array will represent the full height of the rectangle, allowing the histogram algorithm to find it.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Dynamic Programming with Stack** - Standard solution
2. **Brute Force** - For understanding (O(n³))

---

## Approach 1: Dynamic Programming with Stack (Optimal)

### Algorithm Steps

1. Initialize heights array with zeros
2. For each row:
   - Update heights based on current row ('1' increments, '0' resets)
   - Apply "largest rectangle in histogram" using monotonic stack
   - Track maximum area
3. Return maximum area

### Why It Works

The heights array accumulates consecutive 1's vertically. When we apply the histogram algorithm, it considers all possible rectangles ending at the current row.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        """
        Find largest rectangle of 1's in binary matrix.
        
        Args:
            matrix: Binary matrix of 0's and 1's
            
        Returns:
            Area of largest rectangle containing only 1's
        """
        if not matrix or not matrix[0]:
            return 0
        
        rows, cols = len(matrix), len(matrix[0])
        heights = [0] * cols
        max_area = 0
        
        def largestRectangleArea(heights: List[int]) -> int:
            """Find largest rectangle in histogram."""
            stack = [-1]
            max_a = 0
            
            for i in range(len(heights)):
                while stack[-1] != -1 and heights[stack[-1]] >= heights[i]:
                    h = heights[stack.pop()]
                    w = i - stack[-1] - 1
                    max_a = max(max_a, h * w)
                stack.append(i)
            
            while stack[-1] != -1:
                h = heights[stack.pop()]
                w = len(heights) - stack[-1] - 1
                max_a = max(max_a, h * w)
            
            return max_a
        
        for i in range(rows):
            for j in range(cols):
                if matrix[i][j] == '1':
                    heights[j] += 1
                else:
                    heights[j] = 0
            
            max_area = max(max_area, largestRectangleArea(heights))
        
        return max_area
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    int maximalRectangle(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        
        int rows = matrix.size(), cols = matrix[0].size();
        vector<int> heights(cols, 0);
        int maxArea = 0;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] == '1') heights[j]++;
                else heights[j] = 0;
            }
            maxArea = max(maxArea, largestRectangleArea(heights));
        }
        
        return maxArea;
    }
    
private:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        st.push(-1);
        int maxArea = 0;
        
        for (int i = 0; i < heights.size(); i++) {
            while (st.top() != -1 && heights[st.top()] >= heights[i]) {
                int h = heights[st.top()];
                st.pop();
                int w = i - st.top() - 1;
                maxArea = max(maxArea, h * w);
            }
            st.push(i);
        }
        
        while (st.top() != -1) {
            int h = heights[st.top()];
            st.pop();
            int w = heights.size() - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        
        return maxArea;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix == null || matrix.length == 0) return 0;
        
        int rows = matrix.length, cols = matrix[0].length;
        int[] heights = new int[cols];
        int maxArea = 0;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] == '1') heights[j]++;
                else heights[j] = 0;
            }
            maxArea = Math.max(maxArea, largestRectangleArea(heights));
        }
        
        return maxArea;
    }
    
    private int largestRectangleArea(int[] heights) {
        Stack<Integer> st = new Stack<>();
        st.push(-1);
        int maxArea = 0;
        
        for (int i = 0; i < heights.length; i++) {
            while (st.peek() != -1 && heights[st.peek()] >= heights[i]) {
                int h = heights[st.pop()];
                int w = i - st.peek() - 1;
                maxArea = Math.max(maxArea, h * w);
            }
            st.push(i);
        }
        
        while (st.peek() != -1) {
            int h = heights[st.pop()];
            int w = heights.length - st.peek() - 1;
            maxArea = Math.max(maxArea, h * w);
        }
        
        return maxArea;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalRectangle = function(matrix) {
    if (!matrix || matrix.length === 0) return 0;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0);
    let maxArea = 0;
    
    const largestRectangleArea = (heights) => {
        const stack = [-1];
        let maxA = 0;
        
        for (let i = 0; i < heights.length; i++) {
            while (stack[stack.length - 1] !== -1 && heights[stack[stack.length - 1]] >= heights[i]) {
                const h = heights[stack.pop()];
                const w = i - stack[stack.length - 1] - 1;
                maxA = Math.max(maxA, h * w);
            }
            stack.push(i);
        }
        
        while (stack[stack.length - 1] !== -1) {
            const h = heights[stack.pop()];
            const w = heights.length - stack[stack.length - 1] - 1;
            maxA = Math.max(maxA, h * w);
        }
        
        return maxA;
    };
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') heights[j]++;
            else heights[j] = 0;
        }
        maxArea = Math.max(maxArea, largestRectangleArea(heights));
    }
    
    return maxArea;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(rows × cols) - Each cell processed constant times |
| **Space** | O(cols) - For heights array and stack |

---

## Approach 2: Brute Force

### Algorithm Steps

1. For each pair of rows, calculate the sum of 1's in each column
2. Apply histogram algorithm to find largest rectangle
3. Track maximum area

### Why It Works

This approach directly explores all possible rectangle heights but is less efficient.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        
        rows, cols = len(matrix), len(matrix[0])
        max_area = 0
        
        for top in range(rows):
            heights = [0] * cols
            for bottom in range(top, rows):
                for c in range(cols):
                    if matrix[bottom][c] == '1':
                        heights[c] += 1
                    else:
                        heights[c] = 0
                max_area = max(max_area, self.largestRectangleArea(heights))
        
        return max_area
    
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = [-1]
        max_a = 0
        for i in range(len(heights)):
            while stack[-1] != -1 and heights[stack[-1]] >= heights[i]:
                h = heights[stack.pop()]
                w = i - stack[-1] - 1
                max_a = max(max_a, h * w)
            stack.append(i)
        while stack[-1] != -1:
            h = heights[stack.pop()]
            w = len(heights) - stack[-1] - 1
            max_a = max(max_a, h * w)
        return max_a
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(rows² × cols) - Much slower |
| **Space** | O(cols) |

---

## Comparison of Approaches

| Aspect | Stack + DP | Brute Force |
|--------|------------|--------------|
| **Time Complexity** | O(rows × cols) | O(rows² × cols) |
| **Space Complexity** | O(cols) | O(cols) |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Dynamic Programming, Stack, Matrix Manipulation

### Learning Outcomes

1. **Problem Reduction**: Transform 2D to 1D problem
2. **Histogram Algorithm**: Master largest rectangle in histogram
3. **Stack Applications**: Understand monotonic stack usage

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Largest Rectangle in Histogram | [Link](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 1D version |
| Maximal Square | [Link](https://leetcode.com/problems/maximal-square/) | Square version |

---

## Video Tutorial Links

1. **[NeetCode - Maximal Rectangle](https://www.youtube.com/watch?v=AZ4c8)** - Clear explanation
2. **[Maximal Rectangle - LeetCode 85](https://www.youtube.com/watch?v=AZ4c8)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you find the largest square instead of rectangle?

**Answer:** Use DP where dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1.

---

### Q2: Can you solve this using dynamic programming directly?

**Answer:** Yes, you can compute left/right/boundary arrays for each cell, but the histogram approach is cleaner.

---

### Q3: How would you handle non-binary matrices?

**Answer:** The problem is only defined for binary matrices; for other values, you'd need different approaches.

---

## Common Pitfalls

1. **Not resetting heights**: When a '0' is encountered, set heights[j] = 0 (not decrement).
2. **Using >= vs >**: Use >= when popping to handle equal heights correctly.
3. **Sentinel value**: The stack should be initialized with -1 to handle edge cases.
4. **Off-by-one in width**: Width calculation should use `i - stack[-1] - 1`.

---

## Summary

The **Maximal Rectangle** problem demonstrates **Matrix as Histogram** pattern:

- **Approach**: Convert each row to histogram heights, apply largest rectangle in histogram
- **Time**: O(rows × cols)
- **Space**: O(cols)

Key insight: Reduce 2D problem to 1D histogram problem for each row.

### Pattern Summary

This problem exemplifies the **Matrix as Histogram** pattern, characterized by:
- Reducing 2D problem to 1D
- Using histogram algorithm
- Monotonic stack for optimization

---

## Additional Resources

- [LeetCode Problem 85](https://leetcode.com/problems/maximal-rectangle/) - Official problem page
- [Largest Rectangle in Histogram](/patterns/dp-largest-rectangle-histogram) - Related problem
