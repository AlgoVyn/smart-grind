# Array/Matrix - Set Matrix Zeroes (In-place Marking)

## Problem Description

The Array/Matrix - Set Matrix Zeroes pattern is used to set entire rows and columns to zero in a matrix if any element in that row or column is zero. This is done efficiently using in-place marking to avoid using extra space proportional to the matrix size. This pattern is essential for matrix manipulation problems with strict space constraints.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(m × n) where m, n are matrix dimensions |
| Space Complexity | O(1) - uses matrix itself for marking |
| Input | m x n integer matrix |
| Output | Modified matrix with appropriate rows/columns zeroed |
| In-place | Yes - modifies input matrix directly |

### When to Use
- When you need to zero out rows and columns based on cell values
- Problems with O(1) extra space constraint
- Matrix marking problems where initial state affects final state
- When you need to track multiple dimensions of information without extra data structures
- Grid-based marking problems (e.g., battleship sinking, island marking)

## Intuition

The key insight is that we can use the first row and first column of the matrix itself as "marker" storage instead of using separate arrays. This reduces space from O(m+n) to O(1).

The "aha!" moments:
1. **Use matrix[0][j]** to mark if column j should be zeroed
2. **Use matrix[i][0]** to mark if row i should be zeroed
3. **Use two boolean variables** to track if the first row and first column themselves need zeroing
4. **Two-pass approach**: First pass to mark, second pass to apply

## Solution Approaches

### Approach 1: In-Place Marking with First Row/Column (Optimal) ✅ Recommended

#### Algorithm
1. Check if first row has any zero → set `first_row_zero` flag
2. Check if first column has any zero → set `first_col_zero` flag
3. Use first row and column to mark zeros: for each cell (i,j) with value 0, set `matrix[i][0] = 0` and `matrix[0][j] = 0`
4. Iterate through matrix (excluding first row/column) and zero cells based on markers
5. Finally, zero first row and/or column if their flags were set

#### Implementation

````carousel
```python
def set_zeroes(matrix):
    """
    Set matrix zeroes using in-place marking.
    LeetCode 73 - Set Matrix Zeroes
    
    Time: O(m*n), Space: O(1)
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    first_row_zero = False
    first_col_zero = False
    
    # Check if first row has any zero
    for j in range(n):
        if matrix[0][j] == 0:
            first_row_zero = True
            break
    
    # Check if first column has any zero
    for i in range(m):
        if matrix[i][0] == 0:
            first_col_zero = True
            break
    
    # Use first row and column as markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0  # Mark row
                matrix[0][j] = 0  # Mark column
    
    # Zero cells based on markers (excluding first row/column)
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Zero first row if needed
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    # Zero first column if needed
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    void setZeroes(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return;
        
        int m = matrix.size();
        int n = matrix[0].size();
        bool firstRowZero = false;
        bool firstColZero = false;
        
        // Check if first row has any zero
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) {
                firstRowZero = true;
                break;
            }
        }
        
        // Check if first column has any zero
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) {
                firstColZero = true;
                break;
            }
        }
        
        // Use first row and column as markers
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        // Zero cells based on markers
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // Zero first row if needed
        if (firstRowZero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }
        
        // Zero first column if needed
        if (firstColZero) {
            for (int i = 0; i < m; i++) {
                matrix[i][0] = 0;
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void setZeroes(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return;
        }
        
        int m = matrix.length;
        int n = matrix[0].length;
        boolean firstRowZero = false;
        boolean firstColZero = false;
        
        // Check if first row has any zero
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) {
                firstRowZero = true;
                break;
            }
        }
        
        // Check if first column has any zero
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) {
                firstColZero = true;
                break;
            }
        }
        
        // Use first row and column as markers
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        // Zero cells based on markers
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // Zero first row if needed
        if (firstRowZero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }
        
        // Zero first column if needed
        if (firstColZero) {
            for (int i = 0; i < m; i++) {
                matrix[i][0] = 0;
            }
        }
    }
}
```
<!-- slide -->
```javascript
function setZeroes(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    let firstRowZero = false;
    let firstColZero = false;
    
    // Check if first row has any zero
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            firstRowZero = true;
            break;
        }
    }
    
    // Check if first column has any zero
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            firstColZero = true;
            break;
        }
    }
    
    // Use first row and column as markers
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // Zero cells based on markers
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    // Zero first row if needed
    if (firstRowZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
    
    // Zero first column if needed
    if (firstColZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) - three passes through matrix |
| Space | O(1) - only using two boolean variables |

### Approach 2: Using Extra Arrays (Simpler but O(m+n) Space)

This approach uses two arrays to track which rows and columns should be zeroed. It's simpler to understand but doesn't meet strict O(1) space constraints.

#### Implementation

````carousel
```python
def set_zeroes_extra_space(matrix):
    """
    Set matrix zeroes using O(m+n) extra space.
    Simpler but not optimal for space.
    
    Time: O(m*n), Space: O(m+n)
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    rows = [False] * m  # Track rows to zero
    cols = [False] * n  # Track columns to zero
    
    # Mark rows and columns
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows[i] = True
                cols[j] = True
    
    # Zero marked rows and columns
    for i in range(m):
        for j in range(n):
            if rows[i] or cols[j]:
                matrix[i][j] = 0
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    void setZeroes(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return;
        
        int m = matrix.size();
        int n = matrix[0].size();
        std::vector<bool> rows(m, false);
        std::vector<bool> cols(n, false);
        
        // Mark rows and columns
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    rows[i] = true;
                    cols[j] = true;
                }
            }
        }
        
        // Zero marked rows and columns
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (rows[i] || cols[j]) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void setZeroes(int[][] matrix) {
        if (matrix == null || matrix.length == 0) return;
        
        int m = matrix.length;
        int n = matrix[0].length;
        boolean[] rows = new boolean[m];
        boolean[] cols = new boolean[n];
        
        // Mark rows and columns
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    rows[i] = true;
                    cols[j] = true;
                }
            }
        }
        
        // Zero marked rows and columns
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (rows[i] || cols[j]) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
}
```
<!-- slide -->
```javascript
function setZeroes(matrix) {
    if (!matrix || matrix.length === 0) return;
    
    const m = matrix.length;
    const n = matrix[0].length;
    const rows = new Array(m).fill(false);
    const cols = new Array(n).fill(false);
    
    // Mark rows and columns
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                rows[i] = true;
                cols[j] = true;
            }
        }
    }
    
    // Zero marked rows and columns
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (rows[i] || cols[j]) {
                matrix[i][j] = 0;
            }
        }
    }
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) |
| Space | O(m + n) for tracking arrays |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| In-Place Marking | O(m×n) | O(1) | **Recommended** - meets strict constraints |
| Extra Arrays | O(m×n) | O(m+n) | When space is not a constraint |
| Set Tracking | O(m×n) | O(k) | When only k cells are zero |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) | 73 | Medium | Set entire row and column to zero |
| [Game of Life](https://leetcode.com/problems/game-of-life/) | 289 | Medium | In-place state transition using encoding |
| [Bomb Enemy](https://leetcode.com/problems/bomb-enemy/) | 361 | Medium | Max enemies killed by placing bomb |
| [Lonely Pixel I](https://leetcode.com/problems/lonely-pixel-i/) | 531 | Medium | Find black lonely pixels |
| [Number of Islands](https://leetcode.com/problems/number-of-islands/) | 200 | Medium | Count islands using DFS/BFS |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) | 130 | Medium | Flip surrounded regions |

## Video Tutorial Links

1. **[NeetCode - Set Matrix Zeroes](https://www.youtube.com/watch?v=T41rL0L3Pnw)** - In-place marking explanation
2. **[Back To Back SWE - Set Matrix Zeroes](https://www.youtube.com/watch?v=zgaPFv5j2Og)** - Two approaches explained
3. **[Kevin Naughton Jr. - Set Matrix Zeroes](https://www.youtube.com/watch?v=zgaPFv5j2Og)** - Step-by-step walkthrough
4. **[Nick White - LeetCode 73](https://www.youtube.com/watch?v=zgaPFv5j2Og)** - Detailed solution
5. **[Techdose - Set Matrix Zeroes](https://www.youtube.com/watch?v=zgaPFv5j2Og)** - Multiple approaches

## Summary

### Key Takeaways
- **In-place marking** achieves O(1) space by using the first row and column as markers
- **Two boolean flags** track whether the first row/column themselves need zeroing
- **Two-pass approach**: First pass marks, second pass applies
- **When to apply**: Any matrix problem requiring row/column operations with space constraints

### Common Pitfalls
- Forgetting to mark the first row and column separately before using them as markers
- Overwriting the first row/column markers early (before using them for marking)
- Not handling the first row and column separately at the end
- Incorrectly resetting first row/column - they must be zeroed at the end if needed

### Follow-up Questions
1. **What if we couldn't modify the input matrix at all?**
   - Create a copy of the matrix, or use O(m+n) space for tracking

2. **How would you solve this if the matrix was extremely large (billions of rows)?**
   - Use external sorting or distributed processing; can't fit in memory

3. **What if we only needed to know which rows/columns would be zeroed without actually doing it?**
   - Just perform the marking phase and return the marker arrays

4. **How would you extend this to 3D matrices?**
   - Use first plane for marking, with additional flags for each dimension

## Pattern Source

[Set Matrix Zeroes Pattern](patterns/array-matrix-set-matrix-zeroes-in-place-marking.md)
