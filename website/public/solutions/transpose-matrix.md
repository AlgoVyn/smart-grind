# Transpose Matrix

## Problem Description

Given a 2D integer array `matrix`, return the transpose of `matrix`.

The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.

**Link to problem:** [Transpose Matrix - LeetCode 867](https://leetcode.com/problems/transpose-matrix/)

**Example 1:**

Input: `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
Output: `[[1,4,7],[2,5,8],[3,6,9]]`

**Example 2:**

Input: `matrix = [[1,2,3],[4,5,6]]`
Output: `[[1,4],[2,5],[3,6]]`

---

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 1000`
- `1 <= m * n <= 10^5`
- `-10^9 <= matrix[i][j] <= 10^9`

---

## Pattern: Matrix Transposition

This problem demonstrates the fundamental operation of matrix transposition - swapping rows and columns. The pattern is essential in linear algebra and various computational applications.

### Core Concept

The transpose of a matrix is obtained by:
- **Swapping rows and columns**: Element at position (i, j) moves to position (j, i)
- **Maintaining dimensions**: An m×n matrix becomes n×m after transpose

---

## Examples

### Example

**Input:**
```
matrix = [[1,2,3],
          [4,5,6],
          [7,8,9]]
```

**Output:**
```
[[1,4,7],
 [2,5,8],
 [3,6,9]]
```

**Explanation:**
- Element at (0,1)=2 moves to (1,0)=2
- Element at (0,2)=3 moves to (2,0)=3
- Element at (1,2)=6 moves to (2,1)=6
- And so on...

### Example 2

**Input:**
```
matrix = [[1,2,3],
          [4,5,6]]
```

**Output:**
```
[[1,4],
 [2,5],
 [3,6]]
```

**Explanation:**
- Original: 2 rows, 3 columns
- Transposed: 3 rows, 2 columns

---

## Intuition

The key insight is straightforward:

1. **Element mapping**: The element at row `i`, column `j` in the original matrix goes to row `j`, column `i` in the transposed matrix
2. **Dimension swap**: The dimensions flip from m×n to n×m
3. **Main diagonal**: Elements on the main diagonal (i==j) stay in place

### Why It Works

Matrix transposition is a fundamental mathematical operation. By simply iterating through the matrix and placing each element at its transposed position, we get the correct result.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Python Zip Method (Optimal in Python)** - O(m*n) time
2. **Explicit Loop Method** - O(m*n) time, O(1) extra space concept
3. **Nested List Comprehension** - O(m*n) time

---

## Approach 1: Python Zip Method (Optimal)

This is the most Pythonic approach using built-in functions.

### Algorithm Steps

1. Use Python's `zip` function with `*` operator to unpack rows
2. `zip(*matrix)` groups elements by column position
3. Convert each tuple to a list
4. Convert the result to a list of lists

### Why It Works

The `*` operator unpacks the matrix rows as separate arguments to zip. Zip then pairs up elements from the same column position across all rows, effectively transposing the matrix.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        """
        Transpose matrix using Python's zip function.
        
        Args:
            matrix: m x n matrix
            
        Returns:
            Transposed n x m matrix
        """
        # zip(*matrix) groups elements by column
        # Convert tuples to lists
        return [list(row) for row in zip(*matrix)]
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Transpose matrix using nested loops.
     *
     * @param matrix: m x n matrix
     * @return: Transposed n x m matrix
     */
    vector<vector<int>> transpose(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        
        // Create transposed matrix with swapped dimensions
        vector<vector<int>> result(n, vector<int>(m));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Transpose matrix.
     *
     * @param matrix: m x n matrix
     * @return: Transposed n x m matrix
     */
    public int[][] transpose(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        
        // Create transposed matrix with swapped dimensions
        int[][] result = new int[n][m];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Transpose matrix.
 * 
 * @param {number[][]} matrix - m x n matrix
 * @return {number[][]} - Transposed n x m matrix
 */
var transpose = function(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    
    // Create transposed matrix with swapped dimensions
    const result = Array.from({ length: n }, () => Array(m));
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each element is visited once |
| **Space** | O(m * n) - For the output matrix |

---

## Approach 2: Explicit Loop Method

This approach uses explicit nested loops for clarity.

### Algorithm Steps

1. Determine dimensions m (rows) and n (columns)
2. Create result matrix with dimensions n x m
3. For each element at (i, j), place it at (j, i) in result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def transpose_explicit(self, matrix: List[List[int]]) -> List[List[int]]:
        """
        Transpose matrix using explicit loops.
        """
        m = len(matrix)
        n = len(matrix[0])
        
        # Create result with swapped dimensions
        result = [[0] * m for _ in range(n)]
        
        for i in range(m):
            for j in range(n):
                result[j][i] = matrix[i][j]
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> transpose(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        
        vector<vector<int>> result(n, vector<int>(m));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] transpose(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        
        int[][] result = new int[n][m];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var transpose = function(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    
    const result = Array.from({ length: n }, () => new Array(m));
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each element is visited once |
| **Space** | O(m * n) - For the output matrix |

---

## Approach 3: Nested List Comprehension

Python-specific approach using list comprehension.

### Algorithm Steps

1. Use nested list comprehension
2. Outer comprehension iterates over columns (becoming rows)
3. Inner comprehension extracts elements from each row at specific column

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def transpose_comprehension(self, matrix: List[List[int]]) -> List[List[int]]:
        """
        Transpose using nested list comprehension.
        """
        m = len(matrix[0])
        return [[matrix[i][j] for i in range(len(matrix))] for j in range(m)]
```

<!-- slide -->
```cpp
class Solution {
public:
    // Same as Approach 2, using explicit loops
    vector<vector<int>> transpose(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        
        vector<vector<int>> result(n, vector<int>(m));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    // Same as Approach 2
    public int[][] transpose(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        
        int[][] result = new int[n][m];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var transpose = function(matrix) {
    // Using map for list comprehension-like behavior
    return matrix[0].map((_, j) => matrix.map(row => row[j]));
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each element is visited once |
| **Space** | O(m * n) - For the output matrix |

---

## Comparison of Approaches

| Aspect | Zip Method | Explicit Loop | List Comprehension |
|--------|------------|---------------|-------------------|
| **Time Complexity** | O(m*n) | O(m*n) | O(m*n) |
| **Space Complexity** | O(m*n) | O(m*n) | O(m*n) |
| **Implementation** | Simple | Clear | Pythonic |
| **Readability** | High | High | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |

**Best Approach:** Any approach works. The Python zip method is most Pythonic, while explicit loops work in all languages.

---

## Why Matrix Transposition Works

The transposition operation works because:

1. **Element Mapping**: Each element (i,j) maps to (j,i)
2. **Symmetry**: The main diagonal elements stay in place
3. **Dimension Swap**: Rows become columns and vice versa
4. **Mathematical Property**: (A^T)^T = A (double transpose returns original)

---

## Related Problems

Based on similar themes (matrix operations):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reshape the Matrix | [Link](https://leetcode.com/problems/reshape-the-matrix/) | Matrix reshaping |
| Flipping an Image | [Link](https://leetcode.com/problems/flipping-an-image/) | Matrix manipulation |
| Set Matrix Zeroes | [Link](https://leetcode.com/problems/set-matrix-zeroes/) | In-place matrix |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Rotate Image | [Link](https://leetcode.com/problems/rotate-image/) | 90-degree rotation |
| Spiral Matrix | [Link](https://leetcode.com/problems/spiral-matrix/) | Spiral traversal |
| Diagonal Traverse | [Link](https://leetcode.com/problems/diagonal-traverse/) | Diagonal traversal |

### Pattern Reference

For more detailed explanations of matrix operations, see:
- **[Matrix Operations Patterns](/patterns/matrix-operations)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Matrix Transposition

- [NeetCode - Transpose Matrix](https://www.youtube.com/watch?v=A95C_m8m50M) - Clear explanation
- [Transpose Matrix Explanation](https://www.youtube.com/watch?v=HFj9uzbR2kQ) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=SSutrh_rJ6c) - Official solution

### Related Concepts

- [Matrix Operations](https://www.youtube.com/watch?v=Ip3cT2t3P8M) - Matrix fundamentals
- [Zip Function in Python](https://www.youtube.com/watch?v=9o9d433LezQ) - Python zip explained

---

## Follow-up Questions

### Q1: Can you transpose in-place for square matrices?

**Answer:** Yes! For a square matrix (m == n), you can transpose in-place by swapping elements across the diagonal. For each element above the diagonal at position (i,j), swap with (j,i).

---

### Q2: How would you handle very large matrices efficiently?

**Answer:** The current approach is already O(m*n) which is optimal. For very large matrices, consider streaming or block-based processing if memory is constrained.

---

### Q3: What's the difference between transpose and reverse rows/columns?

**Answer:**
- Transpose: (i,j) → (j,i), swaps rows and columns
- Reverse rows: Row i becomes row (m-1-i)
- Reverse columns: Column j becomes column (n-1-j)

---

### Q4: How would you extend this to 3D tensors?

**Answer:** For 3D tensors, you can specify which axes to swap. For example, for shape (a,b,c), transposing axes (0,2,1) gives shape (c,b,a).

---

### Q5: What are practical applications of matrix transpose?

**Answer:**
- Linear algebra computations
- Neural network operations
- Database table operations
- Image processing
- Graph adjacency matrices

---

### Q6: How would you verify the transpose is correct?

**Answer:** Verify that result[j][i] == matrix[i][j] for all valid i,j. Also verify dimensions are swapped correctly.

---

### Q7: Can you do this without creating a new matrix?

**Answer:** Only for square matrices. For rectangular matrices, you cannot transpose in-place because dimensions change.

---

### Q8: What's the time complexity lower bound?

**Answer:** O(m*n) because every element must be read and written. This is optimal.

---

## Common Pitfalls

### 1. Wrong Dimensions
**Issue:** Forgetting that dimensions swap after transpose.

**Solution:** Result has dimensions n×m, not m×n.

### 2. Index Confusion
**Issue:** Using wrong indices for result matrix.

**Solution:** Remember result[j][i] = matrix[i][j].

### 3. Non-rectangular Input
**Issue:** Not handling rows of different lengths (though problem guarantees uniform dimensions).

**Solution:** The problem guarantees valid input, but add checks for robustness.

### 4. In-place on Rectangular
**Issue:** Trying to transpose rectangular matrix in-place.

**Solution:** Cannot be done - need new matrix for different dimensions.

---

## Summary

The **Transpose Matrix** problem demonstrates fundamental **matrix operations**:

- **Simple swap**: Element (i,j) → (j,i)
- **Dimension change**: m×n → n×m
- **Efficient**: O(m*n) time complexity
- **Pythonic**: zip function simplifies implementation

The key insight is that matrix transposition is a simple element remapping that swaps row and column indices. It's a fundamental operation used in many mathematical and computational applications.

This problem is an excellent demonstration of how straightforward matrix operations can be implemented efficiently.

### Pattern Summary

This problem exemplifies the **Matrix Operation** pattern, which is characterized by:
- Simple index transformations
- Dimension manipulation
- Efficient element access
- Linear algebra applications

For more details on this pattern and its variations, see the **[Matrix Operations Patterns](/patterns/matrix-operations)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/transpose-matrix/discuss/) - Community solutions
- [Matrix Transpose - Wikipedia](https://en.wikipedia.org/wiki/Transpose) - Theoretical background
- [Matrix Operations - Khan Academy](https://www.khanacademy.org/math/linear-algebra/matrix-transformations) - Learn matrices
- [Pattern: Matrix Operations](/patterns/matrix-operations) - Comprehensive pattern guide
