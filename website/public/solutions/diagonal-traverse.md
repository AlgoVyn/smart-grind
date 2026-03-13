# Diagonal Traverse

## LeetCode Link

[Diagonal Traverse - LeetCode](https://leetcode.com/problems/diagonal-traverse/)

---

## Problem Description

Given an m x n matrix `mat`, return an array of all the elements of the array in a diagonal order.

---

## Intuition

The key insight is understanding how diagonals work in a matrix:
1. Elements on the same diagonal have the same sum of row and column indices (i + j)
2. Diagonals alternate in direction:
   - Even-indexed diagonals (0, 2, 4...) are traversed from bottom to top
   - Odd-indexed diagonals (1, 3, 5...) are traversed from top to bottom

**Key observations:**
1. The number of diagonals is m + n - 1
2. We can group elements by their diagonal (i + j)
3. For each diagonal, reverse based on whether it's odd or even
4. Direction flips because we start from top-right and bottom-left edges alternately

---

## Examples

**Example 1:**

**Input:**
```python
mat = [[1,2,3],[4,5,6],[7,8,9]]
```

**Output:**
```python
[1,2,4,7,5,3,6,8,9]
```

**Example 2:**

**Input:**
```python
mat = [[1,2],[3,4]]
```

**Output:**
```python
[1,2,3,4]
```

---

## Constraints

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 10^4`
- `1 <= m * n <= 10^4`
- `-10^5 <= mat[i][j] <= 10^5`

---

## Pattern:

This problem follows the **Matrix Traversal** pattern with diagonal ordering.

### Core Concept

- **Diagonal Grouping**: Elements on the same diagonal have the same sum of row and column indices (i + j)
- **Direction Alternation**: Even-indexed diagonals (0, 2, 4...) are traversed from bottom to top, odd-indexed diagonals (1, 3, 5...) are traversed from top to bottom
- **Index Mapping**: The diagonal index = i + j, where i is row and j is column

### When to Use This Pattern

This pattern is applicable when:
1. Problems requiring traversal along diagonals in a matrix
2. Problems where elements can be grouped by sum of indices
3. Problems with alternating direction traversal based on parity

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Diagonal Grouping** - Optimal solution
2. **Direction-Based Traversal** - Alternative method

---

## Approach 1: Diagonal Grouping (Optimal)

### Algorithm Steps

1. **Create diagonal buckets**: Create m+n-1 lists to hold elements by diagonal
2. **Group by diagonal**: For each element, add to bucket at index (i + j)
3. **Process diagonals**: For each diagonal, reverse odd-indexed diagonals
4. **Build result**: Concatenate all diagonal lists

### Why It Works

By grouping elements by their diagonal index, we process all elements on each diagonal together. Then we simply alternate the direction based on whether the diagonal index is odd or even.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        """
        Traverse matrix in diagonal order.
        
        Args:
            mat: Input matrix
            
        Returns:
            Diagonal traversal result
        """
        if not mat or not mat[0]:
            return []
        
        m, n = len(mat), len(mat[0])
        
        # Create diagonal buckets
        diagonals = [[] for _ in range(m + n - 1)]
        
        # Group elements by diagonal
        for i in range(m):
            for j in range(n):
                diagonals[i + j].append(mat[i][j])
        
        # Build result with direction alternation
        result = []
        for k in range(len(diagonals)):
            if k % 2 == 0:
                # Even diagonal: reverse (bottom to top)
                result.extend(diagonals[k][::-1])
            else:
                # Odd diagonal: normal order (top to bottom)
                result.extend(diagonals[k])
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> findDiagonalOrder(vector<vector<int>>& mat) {
        if (mat.empty() || mat[0].empty()) return {};
        
        int m = mat.size(), n = mat[0].size();
        
        // Create diagonal buckets
        vector<vector<int>> diagonals(m + n - 1);
        
        // Group elements by diagonal
        for (int i =0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                diagonals[i + j].push_back(mat[i][j]);
            }
        }
        
        // Build result with direction alternation
        vector<int> result;
        for (int k = 0; k < diagonals.size(); k++) {
            if (k % 2 == 0) {
                // Even: reverse
                for (int i = diagonals[k].size() - 1; i >= 0; i--) {
                    result.push_back(diagonals[k][i]);
                }
            } else {
                // Odd: normal
                for (int num : diagonals[k]) {
                    result.push_back(num);
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] findDiagonalOrder(int[][] mat) {
        if (mat == null || mat.length == 0 || mat[0].length == 0) {
            return new int[0];
        }
        
        int m = mat.length;
        int n = mat[0].length;
        
        // Create diagonal buckets
        List<List<Integer>> diagonals = new ArrayList<>();
        for (int i = 0; i < m + n - 1; i++) {
            diagonals.add(new ArrayList<>());
        }
        
        // Group elements by diagonal
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                diagonals.get(i + j).add(mat[i][j]);
            }
        }
        
        // Build result
        int[] result = new int[m * n];
        int idx = 0;
        for (int k = 0; k < diagonals.size(); k++) {
            if (k % 2 == 0) {
                // Even: reverse
                List<Integer> diag = diagonals.get(k);
                for (int i = diag.size() - 1; i >= 0; i--) {
                    result[idx++] = diag.get(i);
                }
            } else {
                // Odd: normal
                for (int num : diagonals.get(k)) {
                    result[idx++] = num;
                }
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} mat
 * @return {number[]}
 */
var findDiagonalOrder = function(mat) {
    if (!mat || mat.length === 0 || mat[0].length === 0) return [];
    
    const m = mat.length;
    const n = mat[0].length;
    
    // Create diagonal buckets
    const diagonals = Array.from({ length: m + n - 1 }, () => []);
    
    // Group elements by diagonal
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            diagonals[i + j].push(mat[i][j]);
        }
    }
    
    // Build result with direction alternation
    const result = [];
    for (let k = 0; k < diagonals.length; k++) {
        if (k % 2 === 0) {
            // Even: reverse (bottom to top)
            result.push(...diagonals[k].reverse());
        } else {
            // Odd: normal (top to bottom)
            result.push(...diagonals[k]);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visiting each element once |
| **Space** | O(m × n) - storing all elements in diagonals |

---

## Approach 2: Direction-Based Traversal

### Algorithm Steps

1. **Initialize position**: Start at (0, 0), moving up-right
2. **Process current element**: Add to result
3. **Calculate next position**: Based on current direction and boundaries
4. **Toggle direction**: When hitting boundary, switch direction
5. **Repeat**: Until all elements are processed

### Why It Works

This simulates the actual traversal:
- Start from top-left going up-right
- When hitting top or right boundary, bounce and go down-left
- This naturally creates the diagonal pattern

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        """
        Traverse using direction-based approach.
        """
        if not mat or not mat[0]:
            return []
        
        m, n = len(mat), len(mat[0])
        result = []
        
        # Start at (0, 0), direction = up-right
        row, col = 0, 0
        direction = -1  # -1: up-right, 1: down-left
        
        for _ in range(m * n):
            result.append(mat[row][col])
            
            # Calculate next position
            next_row = row + direction
            next_col = col - direction
            
            # Check boundaries and toggle direction
            if next_row < 0 or next_row >= m or next_col < 0 or next_col >= n:
                # Toggle direction
                direction *= -1
                
                # Calculate new position after bounce
                if next_row < 0:
                    next_row = row + 1
                    next_col = col + 1
                elif next_row >= m:
                    next_row = row + 1
                    next_col = col + 1
                elif next_col < 0:
                    next_row = row + 1
                    next_col = col + 1
                elif next_col >= n:
                    next_row = row + 1
                    next_col = col + 1
            
            row, col = next_row, next_col
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> findDiagonalOrder(vector<vector<int>>& mat) {
        if (mat.empty() || mat[0].empty()) return {};
        
        int m = mat.size(), n = mat[0].size();
        vector<int> result;
        result.reserve(m * n);
        
        int row = 0, col = 0;
        int direction = -1;  // -1: up-right, 1: down-left
        
        for (int i = 0; i < m * n; i++) {
            result.push_back(mat[row][col]);
            
            int nextRow = row + direction;
            int nextCol = col - direction;
            
            if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n) {
                direction *= -1;
                
                if (nextRow < 0 && nextCol >= 0 && nextCol < n) {
                    nextCol = col + 1;
                    nextRow = row;
                } else if (nextCol < 0 && nextRow >= 0 && nextRow < m) {
                    nextRow = row + 1;
                    nextCol = col;
                } else if (nextRow >= m) {
                    nextRow = row + 1;
                    nextCol = col;
                } else if (nextCol >= n) {
                    nextRow = row;
                    nextCol = col + 1;
                }
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
class Solution {
    public int[] findDiagonalOrder(int[][] mat) {
        if (mat == null || mat.length == 0 || mat[0].length == 0) {
            return new int[0];
        }
        
        int m = mat.length;
        int n = mat[0].length;
        int[] result = new int[m * n];
        
        int row = 0, col = 0;
        int direction = -1;
        
        for (int i = 0; i < m * n; i++) {
            result[i] = mat[row][col];
            
            int nextRow = row + direction;
            int nextCol = col - direction;
            
            if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n) {
                direction *= -1;
                
                if (nextRow < 0 && nextCol >= 0) {
                    nextRow = row;
                    nextCol = col + 1;
                } else if (nextCol < 0 && nextRow >= 0) {
                    nextRow = row + 1;
                    nextCol = col;
                } else if (nextRow >= m) {
                    nextRow = row + 1;
                    nextCol = col;
                } else if (nextCol >= n) {
                    nextRow = row;
                    nextCol = col + 1;
                }
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
var findDiagonalOrder = function(mat) {
    if (!mat || mat.length === 0 || mat[0].length === 0) return [];
    
    const m = mat.length;
    const n = mat[0].length;
    const result = [];
    
    let row = 0, col = 0;
    let direction = -1;
    
    for (let i = 0; i < m * n; i++) {
        result.push(mat[row][col]);
        
        let nextRow = row + direction;
        let nextCol = col - direction;
        
        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n) {
            direction *= -1;
            
            if (nextRow < 0) {
                nextRow = row;
                nextCol = col + 1;
            } else if (nextCol < 0) {
                nextRow = row + 1;
                nextCol = col;
            } else if (nextRow >= m) {
                nextRow = row + 1;
                nextCol = col;
            } else if (nextCol >= n) {
                nextRow = row;
                nextCol = col + 1;
            }
        }
        
        row = nextRow;
        col = nextCol;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visiting each element once |
| **Space** | O(1) - only tracking position |

---

## Comparison of Approaches

| Aspect | Diagonal Grouping | Direction-Based |
|--------|-------------------|-----------------|
| **Time Complexity** | O(m × n) | O(m × n) |
| **Space Complexity** | O(m × n) | O(1) |
| **Implementation** | Simpler | More complex boundary logic |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Diagonal Grouping) for clarity and simplicity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Facebook, Microsoft, Bloomberg
- **Difficulty**: Medium
- **Concepts Tested**: Matrix traversal, Index manipulation, Pattern recognition

### Learning Outcomes

1. **Index manipulation**: Understanding diagonal relationships
2. **Direction alternation**: Managing boundary conditions
3. **Grouping**: Organizing data by derived keys

---

## Related Problems

Based on similar themes (matrix traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Spiral Matrix | [Link](https://leetcode.com/problems/spiral-matrix/) | Traverse in spiral order |
| Rotate Image | [Link](https://leetcode.com/problems/rotate-image/) | Rotate matrix in-place |
| Transpose Matrix | [Link](https://leetcode.com/problems/transpose-matrix/) | Transpose operation |
| Set Matrix Zeroes | [Link](https://leetcode.com/problems/set-matrix-zeroes/) | Mark rows/columns |

### Pattern Reference

For more detailed explanations, see:
- **[Matrix Traversal](/patterns/matrix-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

### Recommended Tutorials

1. **[NeetCode - Diagonal Traverse](https://www.youtube.com/watch?v=0iB4LOjEM4Q)** - Clear explanation
2. **[Diagonal Traverse - LeetCode 498](https://www.youtube.com/watch?v=4u7-LbHh6dI)** - Detailed walkthrough
3. **[Matrix Traversal Patterns](https://www.youtube.com/watch?v=1KdX4oO4Gdo)** - Common patterns

---

## Follow-up Questions

### Q1: How would you modify for anti-diagonal traversal?

**Answer:** Swap the roles of row and column. Instead of i+j, use i-j or track differently.

### Q2: What if you need to traverse in reverse diagonal order?

**Answer:** Process diagonals in reverse order or reverse the final result array.

### Q3: How would you handle non-square matrices?

**Answer:** The solution already handles m × n matrices. The diagonal count remains m + n - 1.

### Q4: Can you solve without extra space?

**Answer:** Yes, use the direction-based approach (Approach 2) which uses O(1) space.

---

## Common Pitfalls

### 1. Incorrect Direction for Even/Odd Diagonals
**Issue:** Not reversing the correct diagonals leads to wrong output order.

**Solution:** Remember that even-indexed diagonals (sum % 2 == 0) need reversal, while odd-indexed diagonals don't.

### 2. Empty Matrix Handling
**Issue:** Not checking for empty matrix leads to IndexError.

**Solution:** Always check if matrix is empty or has empty rows before processing.

### 3. Off-by-One Errors in Diagonal Count
**Issue:** Incorrect number of diagonals causes missing elements.

**Solution:** The number of diagonals is m + n - 1, not m + n.

### 4. In-Place vs New List Reversal
**Issue:** Reversing the original diagonal list affects subsequent operations.

**Solution:** Use slice reversal `[::-1]` which creates a new list, or explicitly create a new reversed list.

---

## Summary

The **Diagonal Traverse** problem demonstrates the **Matrix Traversal** pattern:

- **Diagonal grouping**: Elements with same i+j belong to same diagonal
- **Direction alternation**: Even/odd diagonals go opposite directions
- **Time complexity**: O(m × n) - optimal for visiting all elements

Key insights:
1. Group elements by diagonal index (i + j)
2. Reverse even-indexed diagonals for bottom-to-top traversal
3. Process odd-indexed diagonals normally for top-to-bottom
4. Use either grouping or direction-based approach

This pattern extends to:
- Spiral matrix problems
- Boundary traversal problems
- Any matrix indexing challenges
