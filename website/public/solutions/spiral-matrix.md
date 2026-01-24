# Spiral Matrix

## Problem Description

Given an m x n matrix, return all elements of the matrix in spiral order.

Spiral order means starting from the top-left corner and moving in a clockwise direction:
1. Move right across the top row
2. Move down the right column
3. Move left across the bottom row
4. Move up the left column
5. Repeat for the remaining inner matrix

**LeetCode Problem Number:** 54

---

## Examples

### Example 1:

**Input:**
```
matrix = [[1,2,3],[4,5,6],[7,8,9]]
```

**Visual Representation:**
```
1 →  2 →  3
          ↓
4    5    6
↑          ↓
7 ←  8 ←  9
```

**Output:**
```
[1,2,3,6,9,8,7,4,5]
```

**Explanation:** Starting from (0,0), we traverse right to (0,2), down to (2,2), left to (2,0), up to (1,0), then right to (1,1), capturing all 9 elements in spiral order.

---

### Example 2:

**Input:**
```
matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
```

**Visual Representation:**
```
1 →  2 →  3 →  4
                  ↓
5    6    7    8  ↓
↑                  ↓
9 ← 10 ← 11 ← 12 ←
```

**Output:**
```
[1,2,3,4,8,12,11,10,9,5,6,7]
```

**Explanation:** For a 3x4 matrix, we traverse the outer layer (1,2,3,4,8,12,11,10,9,5) and then the inner layer (6,7).

---

### Example 3:

**Input:**
```
matrix = [[1,2],[3,4]]
```

**Output:**
```
[1,2,4,3]
```

**Explanation:** A 2x2 matrix traversed in spiral order: right across top, down right column, left across bottom, up to complete.

---

### Example 4:

**Input:**
```
matrix = [[7],[9],[6]]
```

**Output:**
```
[7,9,6]
```

**Explanation:** A single-column matrix is traversed from top to bottom.

---

### Example 5:

**Input:**
```
matrix = [[1,2,3,4,5,6],[7,8,9,10,11,12],[13,14,15,16,17,18],[19,20,21,22,23,24]]
```

**Output:**
```
[1,2,3,4,5,6,12,18,24,23,22,21,20,19,7,13,14,15,16,17,11,10,9,8]
```

**Explanation:** A 4x6 matrix traversed in spiral order.

---

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 20`
- `-100 <= matrix[i][j] <= 100`

---

## Follow up

Can you do this in O(1) extra space (not counting the output list)?

---

## Intuition

The spiral traversal follows a predictable pattern where we process the matrix layer by layer. Each layer consists of four sides that we traverse in order: top (left to right), right (top to bottom), bottom (right to left), and left (bottom to top).

### Key Observations

1. **Layer-by-Layer Processing**: The matrix can be divided into concentric rectangular layers
2. **Four Directions**: Each layer requires traversing in four directions: right → down → left → up
3. **Boundary Tracking**: We maintain four boundaries: top, bottom, left, and right
4. **Termination Condition**: The process continues until all elements are visited or boundaries cross

### Why This Works

By tracking boundaries and systematically moving along each edge of the current rectangle, we ensure every element is visited exactly once in the correct spiral order. After completing one layer, we shrink the boundaries and continue with the next inner layer.

---

## Approach 1: Boundary Tracking (Optimal) ⭐

### Algorithm
1. Initialize four boundaries: top = 0, bottom = m-1, left = 0, right = n-1
2. Create an empty result list
3. While top <= bottom and left <= right:
   - Traverse from left to right along the top boundary, then increment top
   - Traverse from top to bottom along the right boundary, then decrement right
   - If top <= bottom, traverse from right to left along the bottom boundary, then decrement bottom
   - If left <= right, traverse from bottom to top along the left boundary, then increment left
4. Return the result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        """
        Spiral matrix traversal using boundary tracking.
        Time: O(m*n) - Each element visited exactly once
        Space: O(1) - Only uses boundary variables
        """
        if not matrix or not matrix[0]:
            return []
        
        m, n = len(matrix), len(matrix[0])
        top, bottom = 0, m - 1
        left, right = 0, n - 1
        result = []
        
        while top <= bottom and left <= right:
            # Traverse right along top row
            for j in range(left, right + 1):
                result.append(matrix[top][j])
            top += 1
            
            # Traverse down along right column
            for i in range(top, bottom + 1):
                result.append(matrix[i][right])
            right -= 1
            
            # Check if there's still a row to traverse
            if top <= bottom:
                # Traverse left along bottom row
                for j in range(right, left - 1, -1):
                    result.append(matrix[bottom][j])
                bottom -= 1
            
            # Check if there's still a column to traverse
            if left <= right:
                # Traverse up along left column
                for i in range(bottom, top - 1, -1):
                    result.append(matrix[i][left])
                left += 1
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return {};
        }
        
        int m = matrix.size();
        int n = matrix[0].size();
        int top = 0, bottom = m - 1;
        int left = 0, right = n - 1;
        vector<int> result;
        
        while (top <= bottom && left <= right) {
            // Traverse right along top row
            for (int j = left; j <= right; j++) {
                result.push_back(matrix[top][j]);
            }
            top++;
            
            // Traverse down along right column
            for (int i = top; i <= bottom; i++) {
                result.push_back(matrix[i][right]);
            }
            right--;
            
            // Check if there's still a row to traverse
            if (top <= bottom) {
                // Traverse left along bottom row
                for (int j = right; j >= left; j--) {
                    result.push_back(matrix[bottom][j]);
                }
                bottom--;
            }
            
            // Check if there's still a column to traverse
            if (left <= right) {
                // Traverse up along left column
                for (int i = bottom; i >= top; i--) {
                    result.push_back(matrix[i][left]);
                }
                left++;
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return new ArrayList<>();
        }
        
        int m = matrix.length;
        int n = matrix[0].length;
        int top = 0, bottom = m - 1;
        int left = 0, right = n - 1;
        List<Integer> result = new ArrayList<>();
        
        while (top <= bottom && left <= right) {
            // Traverse right along top row
            for (int j = left; j <= right; j++) {
                result.add(matrix[top][j]);
            }
            top++;
            
            // Traverse down along right column
            for (int i = top; i <= bottom; i++) {
                result.add(matrix[i][right]);
            }
            right--;
            
            // Check if there's still a row to traverse
            if (top <= bottom) {
                // Traverse left along bottom row
                for (int j = right; j >= left; j--) {
                    result.add(matrix[bottom][j]);
                }
                bottom--;
            }
            
            // Check if there's still a column to traverse
            if (left <= right) {
                // Traverse up along left column
                for (int i = bottom; i >= top; i--) {
                    result.add(matrix[i][left]);
                }
                left++;
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    let top = 0, bottom = m - 1;
    let left = 0, right = n - 1;
    const result = [];
    
    while (top <= bottom && left <= right) {
        // Traverse right along top row
        for (let j = left; j <= right; j++) {
            result.push(matrix[top][j]);
        }
        top++;
        
        // Traverse down along right column
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        // Check if there's still a row to traverse
        if (top <= bottom) {
            // Traverse left along bottom row
            for (let j = right; j >= left; j--) {
                result.push(matrix[bottom][j]);
            }
            bottom--;
        }
        
        // Check if there's still a column to traverse
        if (left <= right) {
            // Traverse up along left column
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
};
```
````

### Step-by-Step Execution (Example: [[1,2,3],[4,5,6],[7,8,9]])

```
Initial: top=0, bottom=2, left=0, right=2, result=[]

Iteration 1:
- Traverse right: 1, 2, 3 → result=[1,2,3], top=1
- Traverse down: 6, 9 → result=[1,2,3,6,9], right=1
- Traverse left: 8, 7 → result=[1,2,3,6,9,8,7], bottom=1
- Traverse up: 4 → result=[1,2,3,6,9,8,7,4], left=1

Iteration 2:
- Traverse right: 5 → result=[1,2,3,6,9,8,7,4,5], top=2
- Traverse down: (none, top > bottom)
- Traverse left: (none)
- Traverse up: (none)

Done! Result = [1,2,3,6,9,8,7,4,5]
```

### Complexity Analysis
- **Time Complexity:** O(m × n) - Each element is visited exactly once
- **Space Complexity:** O(1) - Only uses boundary variables (excluding output list)

---

## Approach 2: Direction Vector Simulation

### Algorithm
This approach simulates movement by maintaining a current position and direction. We change direction when we hit a boundary or an already-visited cell.

1. Initialize position at (0,0) and direction to right
2. Define four direction vectors: right (0,1), down (1,0), left (0,-1), up (-1,0)
3. Create a visited matrix to track visited cells
4. For each of the m*n elements:
   - Add current cell value to result
   - Mark current cell as visited
   - Calculate next position based on current direction
   - If next position is out of bounds or already visited, change direction
   - Move to next position
5. Return result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        """
        Spiral matrix traversal using direction vector simulation.
        Time: O(m*n) - Each element visited exactly once
        Space: O(m*n) - For the visited matrix
        """
        if not matrix or not matrix[0]:
            return []
        
        m, n = len(matrix), len(matrix[0])
        visited = [[False] * n for _ in range(m)]
        result = []
        
        # Direction vectors: right, down, left, up
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        dir_idx = 0  # Start moving right
        
        row, col = 0, 0
        for _ in range(m * n):
            result.append(matrix[row][col])
            visited[row][col] = True
            
            next_row = row + directions[dir_idx][0]
            next_col = col + directions[dir_idx][1]
            
            # Check if next position is valid
            if (next_row < 0 or next_row >= m or next_col < 0 or next_col >= n or 
                visited[next_row][next_col]):
                dir_idx = (dir_idx + 1) % 4  # Change direction
                next_row = row + directions[dir_idx][0]
                next_col = col + directions[dir_idx][1]
            
            row, col = next_row, next_col
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return {};
        }
        
        int m = matrix.size();
        int n = matrix[0].size();
        vector<vector<bool>> visited(m, vector<bool>(n, false));
        vector<int> result;
        
        // Direction vectors: right, down, left, up
        vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int dir = 0; // Start moving right
        
        int row = 0, col = 0;
        for (int i = 0; i < m * n; i++) {
            result.push_back(matrix[row][col]);
            visited[row][col] = true;
            
            int nextRow = row + directions[dir].first;
            int nextCol = col + directions[dir].second;
            
            // Check if next position is valid
            if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n || 
                visited[nextRow][nextCol]) {
                dir = (dir + 1) % 4; // Change direction (right -> down -> left -> up)
                nextRow = row + directions[dir].first;
                nextCol = col + directions[dir].second;
            }
            
            row = nextRow;
            col = nextCol;
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return new ArrayList<>();
        }
        
        int m = matrix.length;
        int n = matrix[0].length;
        boolean[][] visited = new boolean[m][n];
        List<Integer> result = new ArrayList<>();
        
        // Direction vectors: right, down, left, up
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int dir = 0; // Start moving right
        
        int row = 0, col = 0;
        for (int i = 0; i < m * n; i++) {
            result.add(matrix[row][col]);
            visited[row][col] = true;
            
            int nextRow = row + directions[dir][0];
            int nextCol = col + directions[dir][1];
            
            // Check if next position is valid
            if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n || 
                visited[nextRow][nextCol]) {
                dir = (dir + 1) % 4; // Change direction
                nextRow = row + directions[dir][0];
                nextCol = col + directions[dir][1];
            }
            
            row = nextRow;
            col = nextCol;
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    const result = [];
    
    // Direction vectors: right, down, left, up
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let dir = 0; // Start moving right
    
    let row = 0, col = 0;
    for (let i = 0; i < m * n; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;
        
        let nextRow = row + directions[dir][0];
        let nextCol = col + directions[dir][1];
        
        // Check if next position is valid
        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n || 
            visited[nextRow][nextCol]) {
            dir = (dir + 1) % 4; // Change direction
            nextRow = row + directions[dir][0];
            nextCol = col + directions[dir][1];
        }
        
        row = nextRow;
        col = nextCol;
    }
    
    return result;
};
```
````

### Step-by-Step Execution (Example: [[1,2,3],[4,5,6],[7,8,9]])

```
Initial: row=0, col=0, dir=0 (right), visited=[[F,F,F],[F,F,F],[F,F,F]]

Step 1: Visit (0,0)=1, next=(0,1) valid
Step 2: Visit (0,1)=2, next=(0,2) valid
Step 3: Visit (0,2)=3, next=(0,3) invalid → change dir to down, next=(1,2)
Step 4: Visit (1,2)=6, next=(2,2) valid
Step 5: Visit (2,2)=9, next=(3,2) invalid → change dir to left, next=(2,1)
Step 6: Visit (2,1)=8, next=(2,0) valid
Step 7: Visit (2,0)=7, next=(2,-1) invalid → change dir to up, next=(1,0)
Step 8: Visit (1,0)=4, next=(0,0) visited → change dir to right, next=(1,1)
Step 9: Visit (1,1)=5, next=(1,2) visited → change dir to down, next=(2,1) visited
        All cells visited, done!

Result = [1,2,3,6,9,8,7,4,5]
```

### Complexity Analysis
- **Time Complexity:** O(m × n) - Each element is visited exactly once
- **Space Complexity:** O(m × n) - For the visited matrix

---

## Approach 3: Recursive Layer-by-Layer

### Algorithm
A recursive approach where each function call processes one layer of the matrix.

1. Base case: If top > bottom or left > right, return empty result
2. Process the top row (left to right)
3. Process the right column (top+1 to bottom)
4. If there's a bottom row remaining, process it (right-1 to left)
5. If there's a left column remaining, process it (bottom-1 to top+1)
6. Recursively process the inner layer (top+1, bottom-1, left+1, right-1)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        """
        Spiral matrix traversal using recursive layer-by-layer approach.
        Time: O(m*n) - Each element visited exactly once
        Space: O(min(m,n)) - For recursion stack in worst case
        """
        if not matrix or not matrix[0]:
            return []
        
        result = []
        
        def spiralHelper(top: int, bottom: int, left: int, right: int) -> None:
            if top > bottom or left > right:
                return
            
            # Traverse top row
            for j in range(left, right + 1):
                result.append(matrix[top][j])
            top += 1
            
            # Traverse right column
            for i in range(top, bottom + 1):
                result.append(matrix[i][right])
            right -= 1
            
            # Traverse bottom row (if exists)
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    result.append(matrix[bottom][j])
                bottom -= 1
            
            # Traverse left column (if exists)
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    result.append(matrix[i][left])
                left += 1
            
            # Recursively process inner layer
            spiralHelper(top, bottom, left, right)
        
        spiralHelper(0, len(matrix) - 1, 0, len(matrix[0]) - 1)
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
private:
    void spiralHelper(const vector<vector<int>>& matrix, int top, int bottom, 
                      int left, int right, vector<int>& result) {
        if (top > bottom || left > right) {
            return;
        }
        
        // Traverse top row
        for (int j = left; j <= right; j++) {
            result.push_back(matrix[top][j]);
        }
        top++;
        
        // Traverse right column
        for (int i = top; i <= bottom; i++) {
            result.push_back(matrix[i][right]);
        }
        right--;
        
        // Traverse bottom row (if exists)
        if (top <= bottom) {
            for (int j = right; j >= left; j--) {
                result.push_back(matrix[bottom][j]);
            }
            bottom--;
        }
        
        // Traverse left column (if exists)
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                result.push_back(matrix[i][left]);
            }
            left++;
        }
        
        // Recursively process inner layer
        spiralHelper(matrix, top, bottom, left, right, result);
    }
    
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return {};
        }
        
        vector<int> result;
        spiralHelper(matrix, 0, matrix.size() - 1, 0, matrix[0].size() - 1, result);
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private void spiralHelper(int[][] matrix, int top, int bottom, int left, int right, 
                             List<Integer> result) {
        if (top > bottom || left > right) {
            return;
        }
        
        // Traverse top row
        for (int j = left; j <= right; j++) {
            result.add(matrix[top][j]);
        }
        top++;
        
        // Traverse right column
        for (int i = top; i <= bottom; i++) {
            result.add(matrix[i][right]);
        }
        right--;
        
        // Traverse bottom row (if exists)
        if (top <= bottom) {
            for (int j = right; j >= left; j--) {
                result.add(matrix[bottom][j]);
            }
            bottom--;
        }
        
        // Traverse left column (if exists)
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                result.add(matrix[i][left]);
            }
            left++;
        }
        
        // Recursively process inner layer
        spiralHelper(matrix, top, bottom, left, right, result);
    }
    
    public List<Integer> spiralOrder(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        spiralHelper(matrix, 0, matrix.length - 1, 0, matrix[0].length - 1, result);
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }
    
    const result = [];
    
    function spiralHelper(top, bottom, left, right) {
        if (top > bottom || left > right) {
            return;
        }
        
        // Traverse top row
        for (let j = left; j <= right; j++) {
            result.push(matrix[top][j]);
        }
        top++;
        
        // Traverse right column
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        // Traverse bottom row (if exists)
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                result.push(matrix[bottom][j]);
            }
            bottom--;
        }
        
        // Traverse left column (if exists)
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
        
        // Recursively process inner layer
        spiralHelper(top, bottom, left, right);
    }
    
    spiralHelper(0, matrix.length - 1, 0, matrix[0].length - 1);
    return result;
};
```
````

### Complexity Analysis
- **Time Complexity:** O(m × n) - Each element is visited exactly once
- **Space Complexity:** O(m × n) - For recursion stack in worst case (when matrix is 1 row or 1 column)

---

## Comparison of Approaches

| Approach | Time | Space | Languages | Pros | Cons |
|----------|------|-------|-----------|------|------|
| Boundary Tracking | O(m×n) | O(1) | Python, C++, Java, JavaScript | **Optimal**, simple, no extra memory | None significant |
| Direction Vector | O(m×n) | O(m×n) | Python, C++, Java, JavaScript | Clear direction simulation | Uses visited matrix |
| Recursive | O(m×n) | O(min(m,n)) | Python, C++, Java, JavaScript | Elegant, follows natural layer structure | Stack overflow risk for large inputs |

---

## Related Problems

| # | Problem | Difficulty | Description |
|---|---------|------------|-------------|
| 1 | [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/) | Medium | Generate matrix filled with 1 to n² in spiral order |
| 2 | [Spiral Matrix III](https://leetcode.com/problems/spiral-matrix-iii/) | Medium | Generate coordinates in spiral order from a starting point |
| 3 | [Diagonal Traverse](diagonal-traverse.md) | Medium | Traverse matrix in diagonal order |
| 4 | [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) | Medium | Use spiral-like boundary marking |
| 5 | [Rotate Image](https://leetcode.com/problems/rotate-image/) | Medium | Rotate matrix 90 degrees clockwise |
| 6 | [Transpose Matrix](https://leetcode.com/problems/transpose-matrix/) | Easy | Matrix transposition operation |
| 7 | [Find All Groups of Farmland](https://leetcode.com/problems/find-all-groups-of-farmland/) | Medium | Spiral-like traversal for finding rectangular regions |
| 8 | [Number of Islands](https://leetcode.com/problems/number-of-islands/) | Medium | Grid traversal patterns |
| 9 | [Flood Fill](https://leetcode.com/problems/flood-fill/) | Easy | Grid traversal with direction changes |
| 10 | [Sparse Matrix Multiplication](https://leetcode.com/problems/sparse-matrix-multiplication/) | Medium | Matrix operations with boundary conditions |

---

## Video Tutorials

1. **[Spiral Matrix - LeetCode 54](https://www.youtube.com/watch?v=BnM1f0j1nXc)** - NeetCode
2. **[Spiral Matrix Solution](https://www.youtube.com/watch?v=6ZnyEcbg5Kg)** - Back to Back SWE
3. **[Matrix Spiral Traversal](https://www.youtube.com/watch?v=X6y6i7jd7D8)** - Eric Programming
4. **[Spiral Matrix - Complete Explanation](https://www.youtube.com/watch?v=1ZGJ0OJ6kgY)** - Nick White

---

## Follow-up Questions

### 1. How would you modify the solution for counter-clockwise (anticlockwise) spiral order?
Answer: Simply reverse the direction order: top → left → bottom → right instead of top → right → bottom → left.

---

### 2. Can you achieve O(1) extra space for spiral traversal?
Answer: Yes, the boundary tracking approach already uses O(1) extra space (only 4 boundary variables). The output list doesn't count toward auxiliary space.

---

### 3. How would you handle a very large matrix (e.g., 10^5 x 10^5)?
Answer: For such large matrices, consider streaming the output (yielding values one at a time) rather than storing all results in memory. Also, boundary tracking would still work efficiently.

---

### 4. How would you generate a matrix in spiral order (Spiral Matrix II)?
Answer: Start at position (0,0) with value 1, use direction vectors [0,1], [1,0], [0,-1], [-1,0], change direction on boundary or visited cell, increment value at each step until n².

---

### 5. What if the matrix is sparse (mostly zeros)?
Answer: The standard approach still works efficiently since we traverse each cell exactly once. No optimization needed as boundary checking already handles sparse cases well.

---

### 6. How would you parallelize spiral traversal?
Answer: Each layer can theoretically be processed independently after the previous layer completes, but the sequential dependency between layers limits practical parallelization benefits.

---

### 7. How would you handle spiral traversal starting from the center outward?
Answer: Find the center index, start there, then traverse outward in spiral order. For even dimensions, start from one of the two center cells.

---

### 8. What if you need to collect coordinates instead of values?
Answer: Instead of appending matrix[row][col], append [row, col] to the result. This works with all three approaches.

---

### 9. How would you adapt the solution for a 3D matrix?
Answer: The concept extends but becomes more complex. You would need 6 directions and 6 boundaries per dimension, or use recursive layering.

---

### 10. How would you detect if a spiral path exists between two points?
Answer: Use BFS/DFS with spiral-like direction ordering, tracking visited cells and boundaries. The boundary tracking can help determine valid movement regions.

---

## Common Mistakes to Avoid

1. **Missing boundary checks**: Forgetting to check `top <= bottom` before traversing the bottom row can cause duplicate or incorrect elements in non-square matrices.

2. **Incorrect loop direction**: When traversing left and up, remember to use `>=` comparison and decrement (not increment).

3. **Boundary update timing**: Update boundaries AFTER processing each edge, not before, to avoid skipping elements.

4. **Empty matrix handling**: Always check for empty matrix at the beginning to avoid index out of bounds errors.

5. **Off-by-one errors**: Be careful with range boundaries (inclusive vs. exclusive) in for loops.

6. **Single row/column edge cases**: These special cases require extra attention as some traversals may be skipped.

7. **Not checking visited cells (in direction vector approach)**: Using a visited matrix or checking boundaries is essential to avoid infinite loops.

---

## References

- [LeetCode 54 - Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)
- [Spiral Traversal Pattern - Educative](https://www.educative.io/page/5682209837483520/39370003)
- [Matrix Rotation Patterns - Interview Cake](https://www.interviewcake.com/concept/java/matrix)