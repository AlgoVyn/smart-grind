# Set Matrix Zeroes

## Problem Description

Given an `m x n` matrix. If an element is **0**, its entire row and column must be set to **0**.

You must modify the matrix in-place.

---

## Examples

**Example 1:**
```python
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
```

**Example 2:**
```python
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

---

## Constraints

- `m == matrix.length`
- `n == matrix[0].length`
- `1 <= m, n <= 200`
- `-2^31 <= matrix[i][j] <= 2^31 - 1`

---

## Intuition

The key insight is to mark which rows and columns contain zeros, then zero them out in a second pass. The challenge is doing this **in-place** without using O(m+n) extra space for tracking rows and columns.

We can use the **first row and first column** of the matrix itself as markers to track which rows and columns need to be zeroed. However, we need to handle the first row and first column separately since they overlap.

---

## Approach 1: Brute Force with Extra Space (O(m+n) space)

### Algorithm
1. Create two arrays: `rows` and `cols` of size m and n respectively
2. First pass: mark which rows and columns contain zeros
3. Second pass: zero out all cells based on the marked rows and columns

### Code

````carousel
```python
from typing import List

class Solution:
    def setZeroes_bruteforce(self, matrix: List[List[int]]) -> None:
        if not matrix or not matrix[0]:
            return
        
        m, n = len(matrix), len(matrix[0])
        rows = [False] * m
        cols = [False] * n
        
        # Mark rows and columns that need to be zeroed
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 0:
                    rows[i] = True
                    cols[j] = True
        
        # Zero out rows
        for i in range(m):
            if rows[i]:
                for j in range(n):
                    matrix[i][j] = 0
        
        # Zero out columns
        for j in range(n):
            if cols[j]:
                for i in range(m):
                    matrix[i][j] = 0
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    void setZeroes_bruteforce(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        vector<bool> rows(m, false);
        vector<bool> cols(n, false);
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    rows[i] = true;
                    cols[j] = true;
                }
            }
        }
        
        for (int i = 0; i < m; i++) {
            if (rows[i]) {
                for (int j = 0; j < n; j++) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        for (int j = 0; j < n; j++) {
            if (cols[j]) {
                for (int i = 0; i < m; i++) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public void setZeroes_bruteforce(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        boolean[] rows = new boolean[m];
        boolean[] cols = new boolean[n];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    rows[i] = true;
                    cols[j] = true;
                }
            }
        }
        
        for (int i = 0; i < m; i++) {
            if (rows[i]) {
                for (int j = 0; j < n; j++) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        for (int j = 0; j < n; j++) {
            if (cols[j]) {
                for (int i = 0; i < m; i++) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {void}
 */
var setZeroes_bruteforce = function(matrix) {
    if (!matrix || !matrix[0]) return;
    
    const m = matrix.length;
    const n = matrix[0].length;
    const rows = new Array(m).fill(false);
    const cols = new Array(n).fill(false);
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                rows[i] = true;
                cols[j] = true;
            }
        }
    }
    
    for (let i = 0; i < m; i++) {
        if (rows[i]) {
            for (let j = 0; j < n; j++) {
                matrix[i][j] = 0;
            }
        }
    }
    
    for (let j = 0; j < n; j++) {
        if (cols[j]) {
            for (let i = 0; i < m; i++) {
                matrix[i][j] = 0;
            }
        }
    }
};
```
````

### Time Complexity
**O(m × n)** - We traverse the matrix multiple times

### Space Complexity
**O(m + n)** - Extra space for row and column markers

---

## Approach 2: In-Place Marking (O(1) space) ⭐

### Algorithm
1. Use two variables `firstRowZero` and `firstColZero` to track if first row/column needs zeroing
2. Use the first row and first column (excluding corners) to mark which other rows/cols need zeroing
3. Zero out cells based on marks
4. Handle first row and first column separately at the end

### Code

````carousel
```python
from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
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
        
        # Mark zeros in first row and column
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        
        # Zero out cells based on marks
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        
        # Zero out first row if needed
        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0
        
        # Zero out first column if needed
        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        bool first_row_zero = false;
        bool first_col_zero = false;
        
        // Check if first row has any zero
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) {
                first_row_zero = true;
                break;
            }
        }
        
        // Check if first column has any zero
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) {
                first_col_zero = true;
                break;
            }
        }
        
        // Mark zeros in first row and column
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        // Zero out cells based on marks
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // Zero out first row if needed
        if (first_row_zero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }
        
        // Zero out first column if needed
        if (first_col_zero) {
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
        
        // Mark zeros in first row and column
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        // Zero out cells based on marks
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // Zero out first row if needed
        if (firstRowZero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }
        
        // Zero out first column if needed
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
/**
 * @param {number[][]} matrix
 * @return {void}
 */
var setZeroes = function(matrix) {
    if (!matrix || !matrix[0]) return;
    
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
    
    // Mark zeros in first row and column
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // Zero out cells based on marks
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    // Zero out first row if needed
    if (firstRowZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
    
    // Zero out first column if needed
    if (firstColZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
};
```
````

### Time Complexity
**O(m × n)** - We traverse the matrix multiple times

### Space Complexity
**O(1)** - Only using constant extra space for booleans

---

## Approach 3: Using Sentinel Values

### Algorithm
Instead of using extra space, we can temporarily use special sentinel values (like a very large number) to mark cells that need to be zeroed. However, this approach has limitations with integer overflow and requires careful handling.

### Code

````carousel
```python
from typing import List

class Solution:
    def setZeroes_sentinel(self, matrix: List[List[int]]) -> None:
        if not matrix or not matrix[0]:
            return
        
        m, n = len(matrix), len(matrix[0])
        # Use first cell as marker for first row
        first_row_has_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_has_zero = any(matrix[i][0] == 0 for i in range(m))
        
        # Use first row and column to mark zeros
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        
        # Zero out marked cells
        for i in range(1, m):
            if matrix[i][0] == 0:
                for j in range(1, n):
                    matrix[i][j] = 0
        
        for j in range(1, n):
            if matrix[0][j] == 0:
                for i in range(1, m):
                    matrix[i][j] = 0
        
        # Handle first row and column
        if first_row_has_zero:
            for j in range(n):
                matrix[0][j] = 0
        
        if first_col_has_zero:
            for i in range(m):
                matrix[i][0] = 0
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    void setZeroes_sentinel(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        bool first_row_has_zero = false;
        bool first_col_has_zero = false;
        
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) {
                first_row_has_zero = true;
                break;
            }
        }
        
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) {
                first_col_has_zero = true;
                break;
            }
        }
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        for (int i = 1; i < m; i++) {
            if (matrix[i][0] == 0) {
                for (int j = 1; j < n; j++) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        for (int j = 1; j < n; j++) {
            if (matrix[0][j] == 0) {
                for (int i = 1; i < m; i++) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        if (first_row_has_zero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }
        
        if (first_col_has_zero) {
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
    public void setZeroes_sentinel(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        boolean firstRowHasZero = false;
        boolean firstColHasZero = false;
        
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) {
                firstRowHasZero = true;
                break;
            }
        }
        
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) {
                firstColHasZero = true;
                break;
            }
        }
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        for (int i = 1; i < m; i++) {
            if (matrix[i][0] == 0) {
                for (int j = 1; j < n; j++) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        for (int j = 1; j < n; j++) {
            if (matrix[0][j] == 0) {
                for (int i = 1; i < m; i++) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        if (firstRowHasZero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }
        
        if (firstColHasZero) {
            for (int i = 0; i < m; i++) {
                matrix[i][0] = 0;
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {void}
 */
var setZeroes_sentinel = function(matrix) {
    if (!matrix || !matrix[0]) return;
    
    const m = matrix.length;
    const n = matrix[0].length;
    let firstRowHasZero = false;
    let firstColHasZero = false;
    
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            firstRowHasZero = true;
            break;
        }
    }
    
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            firstColHasZero = true;
            break;
        }
    }
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    for (let i = 1; i < m; i++) {
        if (matrix[i][0] === 0) {
            for (let j = 1; j < n; j++) {
                matrix[i][j] = 0;
            }
        }
    }
    
    for (let j = 1; j < n; j++) {
        if (matrix[0][j] === 0) {
            for (let i = 1; i < m; i++) {
                matrix[i][j] = 0;
            }
        }
    }
    
    if (firstRowHasZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
    
    if (firstColHasZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
};
```
````

### Time Complexity
**O(m × n)** - Multiple passes through the matrix

### Space Complexity
**O(1)** - Only constant extra space

---

## Step-by-Step Example

Let's trace through `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]`:

**Step 1: Check first row and column**
- `first_row_zero = True` (cell [0,0] is 0)
- `first_col_zero = False` (no zeros in first column except [0,0])

**Step 2: Mark zeros in first row/column**
- Cell [0,1] = 1, [0,2] = 2, [0,3] = 0 → mark [1,3] and [2,3] with 0
- Cell [1,0] = 3, [1,1] = 4, [1,2] = 5, [1,3] = 2
- Cell [2,0] = 1, [2,1] = 3, [2,2] = 1, [2,3] = 5

After marking:
```
[0, 1, 2, 0]
[3, 4, 5, 0]
[1, 3, 1, 0]
```

**Step 3: Zero out based on marks**
- Cell [1,3] = 0 → zero out row 1: [3, 4, 5, 0] → [0, 0, 0, 0]
- Cell [2,3] = 0 → zero out row 2: [1, 3, 1, 0] → [0, 0, 0, 0]
- Check column marks: column 0 and 3 need zeroing

After zeroing:
```
[0, 0, 0, 0]
[0, 4, 5, 0]
[0, 3, 1, 0]
```

**Step 4: Zero out first row and column**
- First row has zero → zero entire first row
- First column has zero → zero entire first column

Final result:
```
[0, 0, 0, 0]
[0, 4, 5, 0]
[0, 3, 1, 0]
```

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Brute Force | O(m × n) | O(m + n) | Simple, easy to understand |
| In-Place Marking | O(m × n) | O(1) | **Optimal** - no extra space |
| Sentinel Values | O(m × n) | O(1) | Risky with integer overflow |

---

## Related Problems

1. **[Game of Life](game-of-life.md)** - Similar in-place matrix transformation
2. **[Rotate Image](array-matrix-in-place-rotation.md)** - In-place matrix rotation
3. **[Spiral Matrix](array-matrix-spiral-traversal.md)** - Matrix traversal patterns
4. **[Diagonal Traverse](diagonal-traverse.md)** - Matrix diagonal traversal

---

## Video Tutorials

- [NeetCode - Set Matrix Zeroes](https://www.youtube.com/watch?v=NbgJUTO2_5w)
- [Back to Back SWE - Set Matrix Zeroes](https://www.youtube.com/watch?v=pKO2kblduQQ)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=pKO2kblduQQ)
- [Take U Forward - Set Matrix Zeroes](https://www.youtube.com/watch?v=M65xBewcqcI)

---

## Follow-up Questions

1. **What if you need to do this in a single pass?** - Can you combine marking and zeroing in one pass? (Answer: No, because you might overwrite marks needed for other cells)

2. **How would you handle very large matrices efficiently?** - Consider the two-pass approach as the optimal balance between time and space

3. **What if the matrix contains special values like `null` or `NaN`?** - Need to handle edge cases and use a different sentinel value

4. **Can you parallelize this operation?** - Yes, row and column zeroing can be done in parallel since they're independent operations

5. **How would you modify the solution for a sparse matrix?** - Use a hash set to track only rows and columns that need zeroing

6. **What if you need to revert the changes?** - Keep a backup of which rows/columns were marked, or make two passes (first record, second modify)

7. **How would you handle this problem for a 3D matrix?** - Extend the approach to use the first "slice" as markers for the remaining 3D space

---

## Common Mistakes to Avoid

1. **Forgetting to handle first row/column separately** - This leads to incorrect zeroing of the markers themselves
2. **Overwriting markers before using them** - Process must be: mark → zero → handle first row/column
3. **Not checking for zeros in first row/column initially** - Critical for preserving this information
4. **Index out of bounds** - Remember to start marking from (1,1), not (0,0)

---

## References

- [LeetCode 73 - Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/)
- In-place matrix manipulation techniques
- Space optimization patterns for matrix problems

