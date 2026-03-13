# Maximal Square

## Problem Description

Given an `m x n` binary matrix filled with `0`'s and `1`'s, find the largest square containing only `1`'s and return its area.

**Link to problem:** [Maximal Square - LeetCode 221](https://leetcode.com/problems/maximal-square/)

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
4
```

**Explanation:** The largest square has side length 2, so area is 4.

### Example 2

**Input:**
```python
matrix = [["0", "1"], ["1", "0"]]
```

**Output:**
```python
1
```

### Example 3

**Input:**
```python
matrix = [["0"]]
```

**Output:**
```python
0
```

---

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 300`
- `matrix[i][j]` is `'0'` or `'1'`

---

## Pattern:

Matrix Dynamic Programming (2D State)

This problem uses the **Matrix DP** pattern where each cell represents a property of a submatrix. The key insight is that a square ending at (i,j) depends on three neighbors: above, left, and diagonal. The minimum of these three determines the largest possible square.

## Common Pitfalls

- **Confusing row/column indices**: dp[i][j] represents cell at row i, column j.
- **Not handling first row/column**: First row and column can only form 1x1 squares.
- **Using wrong neighbors**: Must use dp[i-1][j], dp[i][j-1], AND dp[i-1][j-1].
- **Space optimization mistakes**: When using 1D array, remember to save the previous value before overwriting.

---

## Intuition

The key insight is that a cell at position `(i, j)` can be the bottom-right corner of a square if and only if:
1. The cell itself contains `'1'`
2. The cell above `(i-1, j)` is part of a square
3. The cell to the left `(i, j-1)` is part of a square
4. The cell at the diagonal `(i-1, j-1)` is part of a square

### Recurrence Relation

Let `dp[i][j]` be the side length of the largest square ending at position `(i, j)`.

```
dp[i][j] = 0 if matrix[i][j] == '0'
dp[i][j] = 1 if i == 0 or j == 0 (first row or column)
dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 otherwise
```

This comes from the fact that if we want a square of side `s` at `(i, j)`, we need squares of side `s-1` at the three neighboring positions.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Dynamic Programming (2D)** - Classic O(mn) solution with O(mn) space
2. **Dynamic Programming (1D)** - Optimized O(mn) with O(n) space
3. **Brute Force with Optimization** - Check each cell as potential top-left corner

---

## Approach 1: Dynamic Programming (2D) - Classic

This is the standard DP approach where we maintain a 2D table.

### Algorithm Steps

1. Create a `dp` table of same dimensions as the matrix
2. Initialize `max_side` to 0
3. For each cell `(i, j)`:
   - If `matrix[i][j] == '1'`:
     - If it's in the first row or column, `dp[i][j] = 1`
     - Otherwise, `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`
   - Update `max_side` with `dp[i][j]`
4. Return `max_side * max_side`

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        dp = [[0] * n for _ in range(m)]
        max_side = 0
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == '1':
                    if i == 0 or j == 0:
                        dp[i][j] = 1
                    else:
                        dp[i][j] = min(
                            dp[i - 1][j],      # cell above
                            dp[i][j - 1],      # cell to the left
                            dp[i - 1][j - 1]   # diagonal cell
                        ) + 1
                    max_side = max(max_side, dp[i][j])
        
        return max_side * max_side
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        
        int m = matrix.size(), n = matrix[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        int max_side = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = min({
                            dp[i-1][j],
                            dp[i][j-1],
                            dp[i-1][j-1]
                        }) + 1;
                    }
                    max_side = max(max_side, dp[i][j]);
                }
            }
        }
        
        return max_side * max_side;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        
        int m = matrix.length, n = matrix[0].length;
        int[][] dp = new int[m][n];
        int maxSide = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = Math.min(
                            Math.min(dp[i-1][j], dp[i][j-1]),
                            dp[i-1][j-1]
                        ) + 1;
                    }
                    maxSide = Math.max(maxSide, dp[i][j]);
                }
            }
        }
        
        return maxSide * maxSide;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));
    let maxSide = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === '1') {
                if (i === 0 || j === 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = Math.min(
                        dp[i-1][j],
                        dp[i][j-1],
                        dp[i-1][j-1]
                    ) + 1;
                }
                maxSide = Math.max(maxSide, dp[i][j]);
            }
        }
    }
    
    return maxSide * maxSide;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(m × n)` - Each cell is processed once |
| **Space** | `O(m × n)` - For the dp table |

---

## Approach 2: Dynamic Programming (1D) - Space Optimized

We can reduce space to O(n) by only keeping track of the previous row.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        # Use 1D array, but need to track previous value
        dp = [0] * n
        max_side = 0
        prev = 0  # Represents dp[i-1][j-1]
        
        for i in range(m):
            for j in range(n):
                temp = dp[j]  # This is dp[i-1][j] after update
                if matrix[i][j] == '1':
                    if i == 0 or j == 0:
                        dp[j] = 1
                    else:
                        dp[j] = min(dp[j], dp[j-1], prev) + 1
                    max_side = max(max_side, dp[j])
                else:
                    dp[j] = 0
                prev = temp
        
        return max_side * max_side
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        
        int m = matrix.size(), n = matrix[0].size();
        vector<int> dp(n, 0);
        int max_side = 0, prev = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int temp = dp[j];
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[j] = 1;
                    } else {
                        dp[j] = min({dp[j], dp[j-1], prev}) + 1;
                    }
                    max_side = max(max_side, dp[j]);
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        
        return max_side * max_side;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        
        int m = matrix.length, n = matrix[0].length;
        int[] dp = new int[n];
        int maxSide = 0, prev = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int temp = dp[j];
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[j] = 1;
                    } else {
                        dp[j] = Math.min(Math.min(dp[j], dp[j-1]), prev) + 1;
                    }
                    maxSide = Math.max(maxSide, dp[j]);
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        
        return maxSide * maxSide;
    }
}
```
<!-- slide -->
```javascript
var maximalSquare = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    const dp = new Array(n).fill(0);
    let maxSide = 0, prev = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const temp = dp[j];
            if (matrix[i][j] === '1') {
                if (i === 0 || j === 0) {
                    dp[j] = 1;
                } else {
                    dp[j] = Math.min(dp[j], dp[j-1], prev) + 1;
                }
                maxSide = Math.max(maxSide, dp[j]);
            } else {
                dp[j] = 0;
            }
            prev = temp;
        }
    }
    
    return maxSide * maxSide;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(m × n)` - Each cell is processed once |
| **Space** | `O(n)` - Only one row of dp needed |

---

## Approach 3: Brute Force with Top-Left Corner Checking

For each cell, treat it as the potential top-left corner and expand to find the largest square.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        max_side = 0
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == '1':
                    # Try to expand square
                    current_side = 1
                    while (i + current_side < m and 
                           j + current_side < n and
                           self._is_valid_square(matrix, i, j, current_side)):
                        current_side += 1
                    max_side = max(max_side, current_side)
        
        return max_side * max_side
    
    def _is_valid_square(self, matrix: List[List[str]], 
                         row: int, col: int, side: int) -> bool:
        # Check if all cells in the square are '1'
        for i in range(row, row + side):
            for j in range(col, col + side):
                if matrix[i][j] != '1':
                    return False
        return True
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        
        int m = matrix.size(), n = matrix[0].size();
        int max_side = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    int current_side = 1;
                    while (i + current_side < m && 
                           j + current_side < n &&
                           isValidSquare(matrix, i, j, current_side)) {
                        current_side++;
                    }
                    max_side = max(max_side, current_side);
                }
            }
        }
        
        return max_side * max_side;
    }
    
private:
    bool isValidSquare(const vector<vector<char>>& matrix, 
                       int row, int col, int side) {
        for (int i = row; i < row + side; i++) {
            for (int j = col; j < col + side; j++) {
                if (matrix[i][j] != '1') return false;
            }
        }
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        
        int m = matrix.length, n = matrix[0].length;
        int maxSide = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    int currentSide = 1;
                    while (i + currentSide < m && 
                           j + currentSide < n &&
                           isValidSquare(matrix, i, j, currentSide)) {
                        currentSide++;
                    }
                    maxSide = Math.max(maxSide, currentSide);
                }
            }
        }
        
        return maxSide * maxSide;
    }
    
    private boolean isValidSquare(char[][] matrix, int row, int col, int side) {
        for (int i = row; i < row + side; i++) {
            for (int j = col; j < col + side; j++) {
                if (matrix[i][j] != '1') return false;
            }
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
var maximalSquare = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    let maxSide = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === '1') {
                let currentSide = 1;
                while (i + currentSide < m && 
                       j + currentSide < n &&
                       isValidSquare(matrix, i, j, currentSide)) {
                    currentSide++;
                }
                maxSide = Math.max(maxSide, currentSide);
            }
        }
    }
    
    return maxSide * maxSide;
};

function isValidSquare(matrix, row, col, side) {
    for (let i = row; i < row + side; i++) {
        for (let j = col; j < col + side; j++) {
            if (matrix[i][j] !== '1') return false;
        }
    }
    return true;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(m × n × min(m,n))` - For each cell, potentially expand to min(m,n) |
| **Space** | `O(1)` - No extra space |

---

## Comparison of Approaches

| Aspect | DP 2D | DP 1D | Brute Force |
|--------|-------|-------|--------------|
| **Time Complexity** | O(mn) | O(mn) | O(mn × min(m,n)) |
| **Space Complexity** | O(mn) | O(n) | O(1) |
| **Implementation** | Simple | Moderate | Simple |
| **Recommended** | ✅ Good | ✅ Best | ❌ Slow |

**Best Approach:** The 1D DP approach is optimal with O(mn) time and O(n) space.

---

## Related Problems

### Matrix DP Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Maximal Rectangle | [LeetCode 85](https://leetcode.com/problems/maximal-rectangle/) | Hard |
| Largest 1-Bordered Square | [LeetCode 1139](https://leetcode.com/problems/largest-1-bordered-square/) | Medium |
| Matrix Cells in Distance Order | [LeetCode 1030](https://leetcode.com/problems/matrix-cells-in-distance-order/) | Easy |

### Square/Rectangle Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Count Square Submatices | [LeetCode 1277](https://leetcode.com/problems/count-square-submatrices-with-all-ones/) | Medium |
| Total Matrix | [LeetCode 1504](https://leetcode.com/problems/count-submatrices-with-all-ones/) | Medium |

---

## Video Tutorial Links

### Dynamic Programming

- [Maximal Square - NeetCode](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [DP for Matrix Problems](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - General DP techniques
- [LeetCode Official Solution](https://www.youtube.com/watch?v=1L2OiLDbJ6E) - Official walkthrough

### Related Problems

- [Maximal Rectangle](https://www.youtube.com/watch?v=2SVLYRj2I-A) - Extension to rectangles
- [Count Square Submatrices](https://www.youtube.com/watch?v=7j9lq2eMgvc) - Similar DP approach

---

## Follow-up Questions

### Q1: How would you modify to find the maximal rectangle instead of square?

**Answer:** Instead of tracking the minimum of three neighbors, you'd need to track the height of consecutive 1's above and use a stack to find the largest rectangle in each row. This is the classic "Maximal Rectangle" problem (LeetCode 85).

---

### Q2: Can you also output the position of the maximal square?

**Answer:** Yes, you can track the position when updating `max_side`. Store the bottom-right position `(i, j)` when a new maximum is found, then compute the top-left as `(i - max_side + 1, j - max_side + 1)`.

---

### Q3: What is the space complexity of the optimal solution?

**Answer:** The optimal solution uses O(n) space where n is the number of columns. This is achieved by using a 1D DP array and keeping track of the previous value.

---

### Q4: How would you handle input as integer matrix instead of strings?

**Answer:** Simply replace `matrix[i][j] == '1'` with `matrix[i][j] == 1` or `matrix[i][j] != 0`.

---

### Q5: Can this be solved using binary search on the answer?

**Answer:** Yes! You can binary search on the side length. For each candidate side length s, check if there's an s×s square of all 1's. This gives O(mn log(min(m,n))) time.

---

### Q6: What if you need to find the sum of all maximal squares?

**Answer:** After computing the DP table, sum up `dp[i][j]^2` for all cells. This gives the total area of all maximal squares (where each cell represents the largest square ending at that cell).

---

### Q7: How would you handle the case where the matrix is updated frequently?

**Answer:** This becomes a more complex problem requiring advanced data structures like segment trees or 2D BIT (Fenwick Tree) to handle updates efficiently.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty matrix
- Single cell matrix (0 and 1)
- All zeros
- All ones
- Matrix with only one row or column
- Large matrix (300×300)
- Alternating pattern (checkerboard)

---

## Summary

The **Maximal Square** problem demonstrates the power of dynamic programming on matrices:

- **2D DP**: Classic solution tracking largest square at each cell
- **Space Optimization**: Reduce to 1D array
- **Recurrence**: `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`

Key takeaways:
1. Each cell depends on three neighbors (above, left, diagonal)
2. The minimal value represents the bottleneck for square formation
3. Space can be optimized from O(mn) to O(n)
4. The solution scales well to the maximum constraints (300×300)

This pattern appears in many matrix-related DP problems.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximal-square/discuss/) - Community solutions
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - DP fundamentals
- [Matrix DP Patterns](https://leetcode.com/explore/interview/card/top-interview-questions-hard/) - Interview patterns
