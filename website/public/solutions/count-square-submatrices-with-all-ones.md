# Count Square Submatrices With All Ones

## Problem Description

Given a m * n matrix of ones and zeros, return how many square submatrices have all ones.

A square submatrix is a rectangular submatrix with equal number of rows and columns. A submatrix is a 2D grid of cells. A submatrix is a contiguous block of cells defined by row and column ranges.

**LeetCode Link:** [Count Square Submatrices with All Ones - LeetCode 1277](https://leetcode.com/problems/count-square-submatrices-with-all-ones/)

---

## Examples

### Example 1:

**Input:**
```python
matrix =
[
  [0,1,1,1],
  [1,1,1,1],
  [0,1,1,1]
]
```

**Output:**
```python
15
```

**Explanation:**
There are 10 squares of side 1.
There are 4 squares of side 2.
There is  1 square of side 3.
Total number of squares = 10 + 4 + 1 = 15.

### Example 2:

**Input:**
```python
matrix =
[
  [1,0,1],
  [1,1,0],
  [1,1,0]
]
```

**Output:**
```python
7
```

**Explanation:**
There are 6 squares of side 1.
There is 1 square of side 2.
Total number of squares = 6 + 1 = 7.

---

## Constraints

- `1 <= arr.length <= 300`
- `1 <= arr[0].length <= 300`
- `0 <= arr[i][j] <= 1`

---

## Pattern: Dynamic Programming - 2D Matrix

This problem follows the **Dynamic Programming - 2D Matrix** pattern, specifically counting submatrices with specific properties.

### Core Concept

- **DP on submatrices**: dp[i][j] represents largest square ending at (i,j)
- **Three-direction DP**: Use min of top, left, and top-left neighbors
- **Cumulative counting**: Sum all dp values to count all squares

### When to Use This Pattern

This pattern is applicable when:
1. Counting square/rectangular submatrices with all 1s
2. Problems involving largest square in 2D matrix
3. Grid DP where current state depends on three neighbors

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Maximal Square | Find largest square of 1s |
| Rectangle Count | Count all rectangular submatrices |
| 2D Prefix Sum | Precompute sum for submatrix queries |

### Pattern Summary

This problem exemplifies **2D Matrix DP for Square Counting**, characterized by:
- dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
- First row/column cells form only 1x1 squares
- Total count is sum of all dp values

---

## Intuition

The key insight for this problem is understanding that any square ending at position (i, j) depends on three neighbors:
1. The cell directly above: (i-1, j)
2. The cell directly to the left: (i, j-1)
3. The cell diagonally above-left: (i-1, j-1)

For a square of size k to exist at position (i, j), we need all three neighbors to form squares of at least size k-1. Therefore, the largest square ending at (i, j) is limited by the smallest of these three neighbors.

### Key Observations

1. **Base Case**: Any cell with value 1 in the first row or first column can only form a 1×1 square.

2. **Recurrence Relation**: For cell (i, j) with value 1:
   - dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
   - This gives us the size of the largest square ending at (i, j)

3. **Counting All Squares**: The number of squares ending at position (i, j) equals dp[i][j]. This is because:
   - A 1×1 square always ends at (i, j) if matrix[i][j] == 1
   - A 2×2 square ends at (i, j) only if dp[i][j] >= 2
   - A k×k square ends at (i, j) only if dp[i][j] >= k

4. **Total Count**: Sum up all dp[i][j] values to get the total number of squares.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Dynamic Programming (Optimal)** - O(m×n) time, O(m×n) space
2. **Space-Optimized DP** - O(m×n) time, O(n) space
3. **Brute Force** - O((m×n)²) time for understanding

---

## Approach 1: Dynamic Programming (Optimal)

### Algorithm Steps

1. Create a 2D DP array with same dimensions as the matrix
2. Initialize count = 0
3. Iterate through each cell (i, j):
   - If matrix[i][j] == 1:
     - If i == 0 or j == 0: dp[i][j] = 1
     - Else: dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
   - Add dp[i][j] to count
4. Return count

### Why It Works

The DP approach works because each cell computes the largest square that can end at that cell. By summing all these values, we count all possible squares of all sizes. The recurrence relation ensures we only count valid squares where all cells are 1.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countSquares(self, matrix: List[List[int]]) -> int:
        """
        Count square submatrices with all ones using DP.
        
        Args:
            matrix: 2D binary matrix
            
        Returns:
            Number of square submatrices with all ones
        """
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        dp = [[0] * n for _ in range(m)]
        count = 0
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 1:
                    if i == 0 or j == 0:
                        dp[i][j] = 1
                    else:
                        dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                    count += dp[i][j]
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int countSquares(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return 0;
        }
        
        int m = matrix.size();
        int n = matrix[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
                    }
                    count += dp[i][j];
                }
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countSquares(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        
        int m = matrix.length;
        int n = matrix[0].length;
        int[][] dp = new int[m][n];
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]) + 1;
                    }
                    count += dp[i][j];
                }
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var countSquares = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));
    let count = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 1) {
                if (i === 0 || j === 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
                }
                count += dp[i][j];
            }
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visit each cell once |
| **Space** | O(m × n) - for the DP table |

---

## Approach 2: Space-Optimized DP

### Algorithm Steps

1. Use a 1D DP array of size n (number of columns)
2. Iterate through each row:
   - Keep track of previous diagonal value (top-left)
   - Update dp[j] using: new_dp[j] = (matrix[i][j] == 1) ? min(dp[j], dp[j-1], prev) + 1 : 0
   - Update prev to old dp[j] value
3. Sum all dp values to get total count

### Why It Works

Since dp[i][j] only depends on three values from the current row and previous row, we can optimize space by only keeping track of the previous row's values and the current row's left neighbor.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countSquares(self, matrix: List[List[int]]) -> int:
        """Space-optimized DP solution."""
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        dp = [0] * n
        count = 0
        
        for i in range(m):
            prev = 0  # dp[i-1][j-1]
            for j in range(n):
                temp = dp[j]
                if matrix[i][j] == 1:
                    if i == 0 or j == 0:
                        dp[j] = 1
                    else:
                        dp[j] = min(dp[j], dp[j-1], prev) + 1
                    count += dp[j]
                else:
                    dp[j] = 0
                prev = temp
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int countSquares(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return 0;
        }
        
        int m = matrix.size();
        int n = matrix[0].size();
        vector<int> dp(n, 0);
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            int prev = 0;
            for (int j = 0; j < n; j++) {
                int temp = dp[j];
                if (matrix[i][j] == 1) {
                    if (i == 0 || j == 0) {
                        dp[j] = 1;
                    } else {
                        dp[j] = min({dp[j], dp[j-1], prev}) + 1;
                    }
                    count += dp[j];
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countSquares(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        
        int m = matrix.length;
        int n = matrix[0].length;
        int[] dp = new int[n];
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            int prev = 0;
            for (int j = 0; j < n; j++) {
                int temp = dp[j];
                if (matrix[i][j] == 1) {
                    if (i == 0 || j == 0) {
                        dp[j] = 1;
                    } else {
                        dp[j] = Math.min(Math.min(dp[j], dp[j-1]), prev) + 1;
                    }
                    count += dp[j];
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var countSquares = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    const dp = new Array(n).fill(0);
    let count = 0;
    
    for (let i = 0; i < m; i++) {
        let prev = 0;
        for (let j = 0; j < n; j++) {
            const temp = dp[j];
            if (matrix[i][j] === 1) {
                if (i === 0 || j === 0) {
                    dp[j] = 1;
                } else {
                    dp[j] = Math.min(dp[j], dp[j-1], prev) + 1;
                }
                count += dp[j];
            } else {
                dp[j] = 0;
            }
            prev = temp;
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visit each cell once |
| **Space** | O(n) - only store one row of DP values |

---

## Approach 3: Brute Force (For Understanding)

### Algorithm Steps

1. For each cell (i, j), try to expand a square as large as possible
2. For each possible size k, check if all k×k cells starting from (i, j) are 1
3. Count all valid squares

### Why It Works

This is the most straightforward approach - simply try all possible squares and check if they're valid. It helps understand the problem but is too slow for large inputs.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countSquares(self, matrix: List[List[int]]) -> int:
        """Brute force approach - for understanding only."""
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        count = 0
        
        def is_valid(i: int, j: int, size: int) -> bool:
            """Check if square of given size starting at (i,j) is valid."""
            for row in range(i, i + size):
                for col in range(j, j + size):
                    if matrix[row][col] == 0:
                        return False
            return True
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 1:
                    # Try all possible sizes
                    max_size = min(m - i, n - j)
                    for size in range(1, max_size + 1):
                        if is_valid(i, j, size):
                            count += 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int countSquares(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return 0;
        }
        
        int m = matrix.size();
        int n = matrix[0].size();
        int count = 0;
        
        auto isValid = [&](int i, int j, int size) {
            for (int row = i; row < i + size; row++) {
                for (int col = j; col < j + size; col++) {
                    if (matrix[row][col] == 0) return false;
                }
            }
            return true;
        };
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    int maxSize = min(m - i, n - j);
                    for (int size = 1; size <= maxSize; size++) {
                        if (isValid(i, j, size)) {
                            count++;
                        }
                    }
                }
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countSquares(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        
        int m = matrix.length;
        int n = matrix[0].length;
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    int maxSize = Math.min(m - i, n - j);
                    for (int size = 1; size <= maxSize; size++) {
                        if (isValid(matrix, i, j, size)) {
                            count++;
                        }
                    }
                }
            }
        }
        
        return count;
    }
    
    private boolean isValid(int[][] matrix, int i, int j, int size) {
        for (int row = i; row < i + size; row++) {
            for (int col = j; col < j + size; col++) {
                if (matrix[row][col] == 0) return false;
            }
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var countSquares = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    let count = 0;
    
    const isValid = (i, j, size) => {
        for (let row = i; row < i + size; row++) {
            for (let col = j; col < j + size; col++) {
                if (matrix[row][col] === 0) return false;
            }
        }
        return true;
    };
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 1) {
                const maxSize = Math.min(m - i, n - j);
                for (let size = 1; size <= maxSize; size++) {
                    if (isValid(i, j, size)) {
                        count++;
                    }
                }
            }
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × min(m,n)) - for each cell, check all possible sizes |
| **Space** | O(1) - no extra space |

---

## Comparison of Approaches

| Aspect | DP (Optimal) | Space-Optimized | Brute Force |
|--------|--------------|-----------------|-------------|
| **Time Complexity** | O(m × n) | O(m × n) | O(m × n × min(m,n)) |
| **Space Complexity** | O(m × n) | O(n) | O(1) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ | ❌ |
| **Recommended** | ✅ (default) | ✅ (memory-constrained) | ❌ (understanding only) |

**Best Approach:** Use Approach 1 (DP) as the default solution. Use Approach 2 if memory is a concern.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Google, Facebook
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, Matrix Traversal, Space Optimization

### Learning Outcomes

1. **2D DP Mastery**: Learn to apply DP on matrices with multiple dependencies
2. **Space Optimization**: Understand how to reduce space complexity
3. **Square Counting**: Master the technique of counting substructures
4. **Prefix Thinking**: Learn to build solutions from smaller subproblems

---

## Related Problems

Based on similar themes (DP on matrices, submatrix counting):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximal Square | [Link](https://leetcode.com/problems/maximal-square/) | Find largest square of 1s |
| Count Total Rectangles | [Link](https://leetcode.com/problems/count-submatrices-with-all-ones/) | Count all rectangular submatrices |
| Number of Submatrices That Sum To Target | [Link](https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/) | DP with prefix sums |

### Pattern Reference

For more detailed explanations of the Dynamic Programming pattern, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Count Square Submatrices with All Ones](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation with visual examples
2. **[Count Square Submatrices - LeetCode 1277](https://www.youtube.com/watch?v=9XB5M7YzG9Q)** - Detailed walkthrough
3. **[2D DP Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding matrix DP

---

## Follow-up Questions

### Q1: How would you modify the solution to count only squares of size >= k?

**Answer:** After computing dp[i][j], instead of adding dp[i][j] to count, add max(0, dp[i][j] - k + 1). This counts squares of size >= k ending at each position.

---

### Q2: Can you count rectangles (not just squares) using a similar approach?

**Answer:** Yes, but it's more complex. You'd need to count all possible rectangles by considering all pairs of rows and using prefix sums to quickly check if a rectangle is valid. The complexity would be O(m² × n) or O(m × n²).

---

### Q3: How would you handle a matrix with values > 1 (e.g., weights)?

**Answer:** The problem changes significantly. You'd need to define what makes a "square" valid with weighted values - perhaps requiring all values to be positive, or meeting a threshold sum.

---

### Q4: What's the maximum number of squares in an m×n matrix?

**Answer:** The maximum occurs in a matrix of all 1s. The count is: Σ(k=1 to min(m,n)) (m-k+1)(n-k+1) = O(m×n×min(m,n))

---

## Common Pitfalls

### 1. Incorrect neighbor combination
**Issue:** Using only one or two neighbors instead of all three gives wrong largest square size.

**Solution:** Always use min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for correct square detection.

### 2. Forgetting first row/column handling
**Issue:** Cells in first row or column can't form squares larger than 1x1.

**Solution:** Check if i == 0 or j == 0 and set dp[i][j] = 1 for cells with value 1.

### 3. Not counting all squares
**Issue:** Just finding largest square misses smaller squares at each position.

**Solution:** Add dp[i][j] to total count at each cell to count all squares ending there.

### 4. Modifying input matrix
**Issue:** Some solutions modify the input matrix, which may not be allowed.

**Solution:** Use separate dp array or modify only if allowed.

### 5. Wrong space optimization
**Issue:** Attempting to use 1D DP incorrectly loses necessary information.

**Solution:** Use 2D DP for this problem; 1D DP version requires careful handling.

---

## Summary

The **Count Square Submatrices with All Ones** problem demonstrates the power of dynamic programming on 2D matrices. Key takeaways:

1. Use dp[i][j] to represent the largest square ending at position (i, j)
2. Recurrence: dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
3. First row/column cells can only form 1×1 squares
4. Total count is sum of all dp values
5. Space can be optimized from O(m×n) to O(n)

This problem is essential for understanding how to apply DP to matrix-based problems and forms the foundation for more complex submatrix counting problems.

### Pattern Summary

This problem exemplifies the **2D Matrix DP** pattern, characterized by:
- Using a 2D DP table to store intermediate results
- Building solutions from smaller subproblems
- Counting all valid substructures by summing DP values
- Dependencies on multiple neighboring cells

For more details on this pattern and its variations, see the **[Dynamic Programming Pattern](/patterns/dynamic-programming)**.

---

## Additional Resources

- [LeetCode Problem 1277](https://leetcode.com/problems/count-square-submatrices-with-all-ones/) - Official problem page
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - Detailed DP explanation
- [Maximal Square - Similar Problem](https://leetcode.com/problems/maximal-square/) - Related problem
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
