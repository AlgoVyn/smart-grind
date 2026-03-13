# Spiral Matrix II

## Problem Description

Given a positive integer `n`, generate an `n x n` matrix filled with elements from `1` to `n²` in spiral order (clockwise, starting from top-left).

**Link to problem:** [Spiral Matrix II - LeetCode 59](https://leetcode.com/problems/spiral-matrix-ii/)

## Constraints
- `1 <= n <= 20`
- The matrix is always square (n x n)

---

## Pattern: Matrix Spiral Traversal

This problem is a classic example of the **Matrix Spiral Traversal** pattern. The pattern involves traversing a matrix in a spiral order by maintaining boundaries and shrinking them after each direction is completed.

### Core Concept

The fundamental idea is to use four boundaries:
- **Top boundary**: The first row being filled
- **Bottom boundary**: The last row being filled
- **Left boundary**: The first column being filled
- **Right boundary**: The last column being filled

After completing each direction (top row, right column, bottom row, left column), we shrink the respective boundary to continue the spiral inward.

---

## Examples

### Example

**Input:**
```
n = 3
```

**Output:**
```
[[1,2,3],[8,9,4],[7,6,5]]
```

**Explanation:** The matrix is filled in spiral order:
- Row 0: 1, 2, 3 (left to right)
- Column 2: 4 (top to bottom)
- Row 2: 5, 6, 7 (right to left)
- Column 0: 8 (bottom to top)
- Center: 9

### Example 2

**Input:**
```
n = 1
```

**Output:**
```
[[1]]
```

**Explanation:** A 1x1 matrix contains only the number 1.

### Example 3

**Input:**
```
n = 4
```

**Output:**
```
[[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]]
```

---

## Intuition

The key insight for solving this problem is recognizing that we can treat the matrix as a series of layers. Each layer consists of four sides:
1. Top row (left to right)
2. Right column (top to bottom)
3. Bottom row (right to left, only if there's still a bottom row)
4. Left column (bottom to top, only if there's still a left column)

After completing each layer, we shrink the boundaries (top++, bottom--, left++, right--) and continue until all cells are filled.

### Why Four Boundaries Work

By maintaining four boundaries, we can ensure we:
- Don't visit the same cell twice
- Handle edge cases like single row or column
- Fill all cells in exactly n² iterations

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Boundary Method (Optimal)** - O(n²) time, straightforward implementation
2. **Direction Array Method** - Using direction vectors for cleaner code

---

## Approach 1: Boundary Method (Optimal)

This approach uses four variables to track the current boundaries and fills the matrix layer by layer.

### Algorithm Steps

1. Initialize an n×n matrix with zeros
2. Set `top = 0`, `bottom = n-1`, `left = 0`, `right = n-1`
3. Initialize `num = 1` to start filling from 1
4. While `num <= n*n`:
   - Fill top row from left to right, then increment top
   - Fill right column from top to bottom, then decrement right
   - If top <= bottom, fill bottom row from right to left, then decrement bottom
   - If left <= right, fill left column from bottom to top, then increment left
5. Return the filled matrix

### Why It Works

Each iteration fills exactly one "layer" of the spiral:
- The top row is always complete
- The right column is always complete
- The bottom row might be skipped if we've already filled it
- The left column might be skipped if we've already filled it

This ensures we visit each cell exactly once.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def generateMatrix(self, n: int) -> List[List[int]]:
        """
        Generate an n x n matrix in spiral order.
        
        Args:
            n: Size of the matrix (n x n)
            
        Returns:
            Matrix filled with 1 to n² in spiral order
        """
        if n == 0:
            return []
        
        # Initialize matrix with zeros
        matrix = [[0] * n for _ in range(n)]
        
        num = 1
        top, bottom = 0, n - 1
        left, right = 0, n - 1
        
        while num <= n * n:
            # Fill top row (left → right)
            for i in range(left, right + 1):
                matrix[top][i] = num
                num += 1
            top += 1
            
            # Fill right column (top → bottom)
            for i in range(top, bottom + 1):
                matrix[i][right] = num
                num += 1
            right -= 1
            
            # Fill bottom row (right → left)
            if top <= bottom:
                for i in range(right, left - 1, -1):
                    matrix[bottom][i] = num
                    num += 1
                bottom -= 1
            
            # Fill left column (bottom → top)
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    matrix[i][left] = num
                    num += 1
                left += 1
        
        return matrix
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        /**
         * Generate an n x n matrix in spiral order.
         * 
         * Args:
         *     n: Size of the matrix (n x n)
         * 
         * Returns:
         *     Matrix filled with 1 to n² in spiral order
         */
        if (n == 0) {
            return {};
        }
        
        vector<vector<int>> matrix(n, vector<int>(n, 0));
        
        int num = 1;
        int top = 0, bottom = n - 1;
        int left = 0, right = n - 1;
        
        while (num <= n * n) {
            // Fill top row (left → right)
            for (int i = left; i <= right; i++) {
                matrix[top][i] = num++;
            }
            top++;
            
            // Fill right column (top → bottom)
            for (int i = top; i <= bottom; i++) {
                matrix[i][right] = num++;
            }
            right--;
            
            // Fill bottom row (right → left)
            if (top <= bottom) {
                for (int i = right; i >= left; i--) {
                    matrix[bottom][i] = num++;
                }
                bottom--;
            }
            
            // Fill left column (bottom → top)
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    matrix[i][left] = num++;
                }
                left++;
            }
        }
        
        return matrix;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] generateMatrix(int n) {
        /**
         * Generate an n x n matrix in spiral order.
         * 
         * Args:
         *     n: Size of the matrix (n x n)
         * 
         * Returns:
         *     Matrix filled with 1 to n² in spiral order
         */
        if (n == 0) {
            return new int[0][0];
        }
        
        int[][] matrix = new int[n][n];
        
        int num = 1;
        int top = 0, bottom = n - 1;
        int left = 0, right = n - 1;
        
        while (num <= n * n) {
            // Fill top row (left → right)
            for (int i = left; i <= right; i++) {
                matrix[top][i] = num++;
            }
            top++;
            
            // Fill right column (top → bottom)
            for (int i = top; i <= bottom; i++) {
                matrix[i][right] = num++;
            }
            right--;
            
            // Fill bottom row (right → left)
            if (top <= bottom) {
                for (int i = right; i >= left; i--) {
                    matrix[bottom][i] = num++;
                }
                bottom--;
            }
            
            // Fill left column (bottom → top)
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    matrix[i][left] = num++;
                }
                left++;
            }
        }
        
        return matrix;
    }
}
```

<!-- slide -->
```javascript
/**
 * Generate an n x n matrix in spiral order.
 * 
 * @param {number} n - Size of the matrix (n x n)
 * @return {number[][]} - Matrix filled with 1 to n² in spiral order
 */
var generateMatrix = function(n) {
    if (n === 0) {
        return [];
    }
    
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    
    let num = 1;
    let top = 0, bottom = n - 1;
    let left = 0, right = n - 1;
    
    while (num <= n * n) {
        // Fill top row (left → right)
        for (let i = left; i <= right; i++) {
            matrix[top][i] = num++;
        }
        top++;
        
        // Fill right column (top → bottom)
        for (let i = top; i <= bottom; i++) {
            matrix[i][right] = num++;
        }
        right--;
        
        // Fill bottom row (right → left)
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                matrix[bottom][i] = num++;
            }
            bottom--;
        }
        
        // Fill left column (bottom → top)
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                matrix[i][left] = num++;
            }
            left++;
        }
    }
    
    return matrix;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Each cell is visited exactly once |
| **Space** | O(n²) - Output matrix stores n² elements |

---

## Approach 2: Direction Array Method

This approach uses direction arrays to make the code more concise and easier to understand.

### Algorithm Steps

1. Initialize an n×n matrix with zeros
2. Define direction arrays: `[[0,1], [1,0], [0,-1], [-1,0]]` (right, down, left, up)
3. Use variables `row = 0`, `col = 0`, `direction = 0`
4. For each number from 1 to n²:
   - Place the number in current cell
   - Calculate next position based on current direction
   - If next position is out of bounds or already filled, change direction
5. Continue until all cells are filled

### Code Implementation

````carousel
```python
class Solution:
    def generateMatrix_directions(self, n: int) -> List[List[int]]:
        """
        Generate an n x n matrix using direction arrays.
        
        Args:
            n: Size of the matrix (n x n)
            
        Returns:
            Matrix filled with 1 to n² in spiral order
        """
        matrix = [[0] * n for _ in range(n)]
        
        # Direction vectors: right, down, left, up
        directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
        
        row, col = 0, 0
        direction = 0
        
        for num in range(1, n * n + 1):
            matrix[row][col] = num
            
            # Calculate next position
            next_row = row + directions[direction][0]
            next_col = col + directions[direction][1]
            
            # Check if we need to change direction
            if (next_row < 0 or next_row >= n or 
                next_col < 0 or next_col >= n or 
                matrix[next_row][next_col] != 0):
                direction = (direction + 1) % 4
            
            row += directions[direction][0]
            col += directions[direction][1]
        
        return matrix
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> matrix(n, vector<int>(n, 0));
        
        // Direction vectors: right, down, left, up
        vector<vector<int>> dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        int row = 0, col = 0, direction = 0;
        
        for (int num = 1; num <= n * n; num++) {
            matrix[row][col] = num;
            
            int nextRow = row + dirs[direction][0];
            int nextCol = col + dirs[direction][1];
            
            if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n || matrix[nextRow][nextCol] != 0) {
                direction = (direction + 1) % 4;
            }
            
            row += dirs[direction][0];
            col += dirs[direction][1];
        }
        
        return matrix;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] generateMatrixDirections(int n) {
        int[][] matrix = new int[n][n];
        
        // Direction vectors: right, down, left, up
        int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        int row = 0, col = 0, direction = 0;
        
        for (int num = 1; num <= n * n; num++) {
            matrix[row][col] = num;
            
            int nextRow = row + dirs[direction][0];
            int nextCol = col + dirs[direction][1];
            
            if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n || matrix[nextRow][nextCol] != 0) {
                direction = (direction + 1) % 4;
            }
            
            row += dirs[direction][0];
            col += dirs[direction][1];
        }
        
        return matrix;
    }
}
```

<!-- slide -->
```javascript
var generateMatrixDirections = function(n) {
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    
    // Direction vectors: right, down, left, up
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    let row = 0, col = 0, direction = 0;
    
    for (let num = 1; num <= n * n; num++) {
        matrix[row][col] = num;
        
        const nextRow = row + dirs[direction][0];
        const nextCol = col + dirs[direction][1];
        
        if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n || matrix[nextRow][nextCol] !== 0) {
            direction = (direction + 1) % 4;
        }
        
        row += dirs[direction][0];
        col += dirs[direction][1];
    }
    
    return matrix;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Each cell is visited exactly once |
| **Space** | O(n²) - Output matrix stores n² elements |

---

## Comparison of Approaches

| Aspect | Boundary Method | Direction Array |
|--------|----------------|-----------------|
| **Time Complexity** | O(n²) | O(n²) |
| **Space Complexity** | O(n²) | O(n²) |
| **Code Clarity** | More explicit | More compact |
| **Easy to Debug** | Yes | Moderate |
| **Recommended** | ✅ Yes | For understanding |

**Best Approach:** The Boundary Method (Approach 1) is recommended for its clarity and ease of debugging.

---

## Why Boundary Method is Optimal for This Problem

The boundary method is the optimal solution because:

1. **Predictable Flow**: Each boundary is clearly defined and modified
2. **Easy to Understand**: The four-step process mirrors how we'd draw a spiral by hand
3. **No Edge Cases Missed**: The boundary checks ensure we don't go out of bounds
4. **Constant Direction Changes**: Direction always changes in the same order (right → down → left → up)
5. **Efficient**: Each cell is visited exactly once

---

## Related Problems

Based on similar themes (matrix traversal, spiral patterns):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Spiral Matrix | [Link](https://leetcode.com/problems/spiral-matrix/) | Read elements in spiral order |
| Diagonal Traverse | [Link](https://leetcode.com/problems/diagonal-traverse/) | Traverse matrix diagonally |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Spiral Matrix III | [Link](https://leetcode.com/problems/spiral-matrix-iii/) | Generate coordinates in spiral |
| Rotate Image | [Link](https://leetcode.com/problems/rotate-image/) | Rotate matrix 90 degrees |

### Pattern Reference

For more detailed explanations of the Matrix Spiral Traversal pattern, see:
- **[Matrix Traversal Patterns](/patterns/matrix-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Boundary Method

- [NeetCode - Spiral Matrix II](https://www.youtube.com/watch?v=1ZGxGkF6K8E) - Clear explanation with visual examples
- [Spiral Matrix II - Complete Guide](https://www.youtube.com/watch?v=SpjHJa-ojxU) - Step-by-step solution

### Related Concepts

- [Matrix Traversal Fundamentals](https://www.youtube.com/watch?v=BdQ2vf69Fec) - Understanding matrix traversal
- [2D Array Patterns](https://www.youtube.com/watch?v=5Z4C3G3B6cE) - Common 2D array patterns

---

## Follow-up Questions

### Q1: How would you modify the solution to generate a matrix in counter-clockwise order?

**Answer:** Reverse the order of filling: left column first, then bottom row, then right column, then top row. Alternatively, reverse the direction array order.

---

### Q2: Can you generate the matrix starting from a different corner (e.g., top-right)?

**Answer:** Yes, adjust the initial position and direction order. For top-right start, begin at `(0, n-1)` and change direction order to down → left → up → right.

---

### Q3: How would you modify to handle non-square matrices (m x n)?

**Answer:** The algorithm works with minor modifications. Replace `n` with `rows` and `cols` separately, and adjust boundary checks to use the appropriate dimension for each direction.

---

### Q4: What if you need to fill in a non-sequential pattern (e.g., primes, Fibonacci)?

**Answer:** Replace the `num++` logic with a function call that generates the next value in your desired sequence.

---

### Q5: How would you handle the case where n = 0?

**Answer:** Return an empty matrix. The boundary method naturally handles this case by checking `n == 0` at the start.

---

### Q6: Can you solve this recursively?

**Answer:** Yes, but it's less intuitive. Each recursive call fills one layer and calls itself with adjusted boundaries (top+1, bottom-1, left+1, right-1).

---

### Q7: What are the edge cases to test?

**Answer:**
- n = 1 (single element)
- n = 2 (smallest square)
- Even n (complete layers)
- Odd n (center element)

---

### Q8: How does this problem relate to real-world applications?

**Answer:** Spiral traversal is used in image processing (spiral scanning), snail mail sorting, and certain types of data compression algorithms.

---

## Common Pitfalls

### 1. Boundary Management
**Issue**: Forgetting to update boundaries after each direction, causing infinite loops or missed cells.

**Solution**: Always increment/decrement the appropriate boundary after completing each side.

### 2. Off-by-One Errors
**Issue**: Using `<` instead of `<=` in loop conditions, or vice versa.

**Solution**: Carefully check loop bounds. Remember: `range(left, right + 1)` includes `right`.

### 3. Skipping Directions
**Issue**: Not checking if `top <= bottom` before filling bottom row, causing duplicate filling.

**Solution**: Always add conditional checks before filling bottom row and left column.

### 4. Matrix Initialization
**Issue**: Forgetting to initialize the matrix with zeros, leading to incorrect values.

**Solution**: Initialize with `[[0] * n for _ in range(n)]` in Python or equivalent in other languages.

### 5. Single Row/Column Handling
**Issue**: Not handling the case where n = 1 correctly.

**Solution**: Add a special check for `n == 0` or ensure boundary conditions handle single-element matrices.

---

## Summary

The **Spiral Matrix II** problem demonstrates the power of boundary-based traversal:

- **Boundary Method**: Optimal with O(n²) time, intuitive four-step process
- **Direction Array**: Alternative approach, more compact code
- **Key Insight**: Treat the matrix as layers and fill each layer completely

The key insight is using four boundaries to track the current layer. Each iteration fills one complete layer (top row, right column, bottom row, left column), then shrinks the boundaries to move inward.

This problem is an excellent demonstration of how understanding the geometric nature of a problem can lead to a simple and elegant solution.

### Pattern Summary

This problem exemplifies the **Matrix Spiral Traversal** pattern, which is characterized by:
- Using boundary variables to track current layer
- Filling in four directions in sequence
- Shrinking boundaries after each complete layer
- Handling edge cases with conditional checks

For more details on this pattern and its variations, see the **[Matrix Traversal Patterns](/patterns/matrix-traversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/spiral-matrix-ii/discuss/) - Community solutions and explanations
- [Matrix Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/print-matrix-spiral/) - Detailed explanation
- [2D Arrays in Python](https://docs.python.org/3/tutorial/datastructures.html#nested-list-comprehensions) - Python list comprehension for matrices
- [Spira Matrix Algorithms](https://en.wikipedia.org/wiki/Spiral_matrix) - Mathematical properties of spiral matrices
