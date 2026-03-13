# Spiral Matrix IV

## Problem Description

You are given two integers `m` and `n`, which represent the dimensions of a matrix.
You are also given the head of a linked list of integers.
Generate an `m x n` matrix that contains the integers in the linked list presented in spiral order (clockwise), starting from the top-left of the matrix. If there are remaining empty spaces, fill them with `-1`.
Return the generated matrix.

**Link to problem:** [Spiral Matrix IV - LeetCode 2326](https://leetcode.com/problems/spiral-matrix-iv/)

## Examples

**Example 1:**
```
Input: m = 3, n = 5, head = [3,0,2,6,8,1,7,9,4,2,5,5,0]
Output: [[3,0,2,6,8],[5,0,-1,-1,1],[5,2,4,9,7]]
```

**Example 2:**
```
Input: m = 1, n = 4, head = [0,1,2]
Output: [[0,1,2,-1]]
```

## Constraints

- `1 <= m, n <= 10^5`
- `1 <= m * n <= 10^5`
- The number of nodes in the list is in the range `[1, m * n]`.
- `0 <= Node.val <= 1000`

---

## Pattern: Spiral Matrix Traversal

This problem combines two data structures - linked lists and matrices - and requires generating a matrix in spiral order. The pattern involves traversing boundaries of a matrix in a clockwise direction.

### Core Concept

The fundamental idea is to maintain **four boundaries** (top, bottom, left, right) and traverse each boundary in order:
- **Top row**: left → right, then top++
- **Right column**: top → bottom, then right--
- **Bottom row**: right → left (if top <= bottom), then bottom--
- **Left column**: bottom → top (if left <= right), then left++

---

## Examples

### Example

**Input:**
```
m = 3, n = 5, head = [3,0,2,6,8,1,7,9,4,2,5,5,0]
```

**Output:**
```
[[3,0,2,6,8],[5,0,-1,-1,1],[5,2,4,9,7]]
```

**Explanation:**
- Spiral order: 3, 0, 2, 6, 8, 1, 7, 9, 4, 2, 5 (11 elements)
- Remaining cells filled with -1

### Example 2

**Input:**
```
m = 1, n = 4, head = [0,1,2]
```

**Output:**
```
[[0,1,2,-1]]
```

**Explanation:**
- Spiral order: 0, 1, 2
- One cell left empty, filled with -1

---

## Intuition

The key insight is to use four pointers to track the boundaries of the unprocessed matrix:

1. **Top boundary**: First row to process
2. **Bottom boundary**: Last row to process
3. **Left boundary**: First column to process
4. **Right boundary**: Last column to process

After completing each boundary traversal, we shrink the corresponding boundary. We continue until all cells are processed or the linked list is exhausted.

### Why Four Boundaries?

Using four boundaries allows us to:
- Process the matrix in concentric layers
- Avoid visited arrays (boundaries act as visited markers)
- Handle rectangular matrices (not just square)
- Fill remaining cells with -1 when linked list is exhausted

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Boundary Method (Optimal)** - O(m*n) time, O(m*n) space
2. **Direction Array Method** - O(m*n) time, O(m*n) space
3. **Layer-by-Layer Method** - O(m*n) time, O(m*n) space

---

## Approach 1: Boundary Method (Optimal)

This is the most intuitive and commonly used approach.

### Algorithm Steps

1. Initialize an m x n matrix filled with -1
2. Set boundaries: top=0, bottom=m-1, left=0, right=n-1
3. While top <= bottom and left <= right and linked list has nodes:
   - Fill top row from left to right, increment top
   - Fill right column from top to bottom, decrement right
   - If top <= bottom, fill bottom row from right to left, decrement bottom
   - If left <= right, fill left column from bottom to top, increment left
4. For each cell, if linked list has a node, assign its value and move to next
5. Return the matrix

### Why It Works

The boundary method works because:
- Each iteration processes one complete "layer" of the spiral
- After processing each direction, we shrink the corresponding boundary
- When boundaries cross, we've processed all valid cells
- The -1 initialization handles remaining cells automatically

### Code Implementation

````carousel
```python
from typing import List, Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def spiralMatrix(self, m: int, n: int, head: Optional[ListNode]) -> List[List[int]]:
        """
        Generate spiral matrix from linked list using boundary method.
        
        Args:
            m: Number of rows
            n: Number of columns
            head: Head of linked list
            
        Returns:
            m x n matrix in spiral order
        """
        # Initialize matrix with -1
        matrix = [[-1] * n for _ in range(m)]
        
        if not head:
            return matrix
        
        curr = head
        top, bottom = 0, m - 1
        left, right = 0, n - 1
        
        while top <= bottom and left <= right and curr:
            # Fill top row (left to right)
            for j in range(left, right + 1):
                if curr:
                    matrix[top][j] = curr.val
                    curr = curr.next
            top += 1
            
            # Fill right column (top to bottom)
            for i in range(top, bottom + 1):
                if curr:
                    matrix[i][right] = curr.val
                    curr = curr.next
            right -= 1
            
            # Fill bottom row (right to left)
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    if curr:
                        matrix[bottom][j] = curr.val
                        curr = curr.next
                bottom -= 1
            
            # Fill left column (bottom to top)
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    if curr:
                        matrix[i][left] = curr.val
                        curr = curr.next
                left += 1
        
        return matrix
```

<!-- slide -->
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */

class Solution {
public:
    /**
     * Generate spiral matrix from linked list using boundary method.
     *
     * @param m: Number of rows
     * @param n: Number of columns
     * @param head: Head of linked list
     * @return: m x n matrix in spiral order
     */
    vector<vector<int>> spiralMatrix(int m, int n, ListNode* head) {
        // Initialize matrix with -1
        vector<vector<int>> matrix(m, vector<int>(n, -1));
        
        if (!head) return matrix;
        
        ListNode* curr = head;
        int top = 0, bottom = m - 1;
        int left = 0, right = n - 1;
        
        while (top <= bottom && left <= right && curr) {
            // Fill top row (left to right)
            for (int j = left; j <= right; j++) {
                if (curr) {
                    matrix[top][j] = curr->val;
                    curr = curr->next;
                }
            }
            top++;
            
            // Fill right column (top to bottom)
            for (int i = top; i <= bottom; i++) {
                if (curr) {
                    matrix[i][right] = curr->val;
                    curr = curr->next;
                }
            }
            right--;
            
            // Fill bottom row (right to left)
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    if (curr) {
                        matrix[bottom][j] = curr->val;
                        curr = curr->next;
                    }
                }
                bottom--;
            }
            
            // Fill left column (bottom to top)
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    if (curr) {
                        matrix[i][left] = curr->val;
                        curr = curr->next;
                    }
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
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

class Solution {
    /**
     * Generate spiral matrix from linked list using boundary method.
     *
     * @param m: Number of rows
     * @param n: Number of columns
     * @param head: Head of linked list
     * @return: m x n matrix in spiral order
     */
    public int[][] spiralMatrix(int m, int n, ListNode head) {
        // Initialize matrix with -1
        int[][] matrix = new int[m][n];
        for (int[] row : matrix) {
            Arrays.fill(row, -1);
        }
        
        if (head == null) return matrix;
        
        ListNode curr = head;
        int top = 0, bottom = m - 1;
        int left = 0, right = n - 1;
        
        while (top <= bottom && left <= right && curr != null) {
            // Fill top row (left to right)
            for (int j = left; j <= right; j++) {
                if (curr != null) {
                    matrix[top][j] = curr.val;
                    curr = curr.next;
                }
            }
            top++;
            
            // Fill right column (top to bottom)
            for (int i = top; i <= bottom; i++) {
                if (curr != null) {
                    matrix[i][right] = curr.val;
                    curr = curr.next;
                }
            }
            right--;
            
            // Fill bottom row (right to left)
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    if (curr != null) {
                        matrix[bottom][j] = curr.val;
                        curr = curr.next;
                    }
                }
                bottom--;
            }
            
            // Fill left column (bottom to top)
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    if (curr != null) {
                        matrix[i][left] = curr.val;
                        curr = curr.next;
                    }
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
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * Generate spiral matrix from linked list using boundary method.
 * 
 * @param {number} m - Number of rows
 * @param {number} n - Number of columns
 * @param {ListNode} head - Head of linked list
 * @return {number[][]} - m x n matrix in spiral order
 */
var spiralMatrix = function(m, n, head) {
    // Initialize matrix with -1
    const matrix = Array.from({ length: m }, () => Array(n).fill(-1));
    
    if (!head) return matrix;
    
    let curr = head;
    let top = 0, bottom = m - 1;
    let left = 0, right = n - 1;
    
    while (top <= bottom && left <= right && curr) {
        // Fill top row (left to right)
        for (let j = left; j <= right; j++) {
            if (curr) {
                matrix[top][j] = curr.val;
                curr = curr.next;
            }
        }
        top++;
        
        // Fill right column (top to bottom)
        for (let i = top; i <= bottom; i++) {
            if (curr) {
                matrix[i][right] = curr.val;
                curr = curr.next;
            }
        }
        right--;
        
        // Fill bottom row (right to left)
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                if (curr) {
                    matrix[bottom][j] = curr.val;
                    curr = curr.next;
                }
            }
            bottom--;
        }
        
        // Fill left column (bottom to top)
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                if (curr) {
                    matrix[i][left] = curr.val;
                    curr = curr.next;
                }
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
| **Time** | O(m * n) - Each cell visited at most once |
| **Space** | O(m * n) - For the output matrix |

---

## Approach 2: Direction Array Method

This approach uses a direction array to simplify the spiral traversal logic.

### Algorithm Steps

1. Initialize m x n matrix with -1
2. Use directions array: [(0,1), (1,0), (0,-1), (-1,0)] for right, down, left, up
3. Track current position and direction index
4. When hitting a boundary or visited cell, change direction
5. Continue until linked list is exhausted

### Why It Works

The direction array method is equivalent to the boundary method but uses a different mechanism to detect when to change direction.

### Code Implementation

````carousel
```python
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def spiralMatrix_direction(self, m: int, n: int, head: Optional[ListNode]) -> List[List[int]]:
        """
        Generate spiral matrix using direction array method.
        """
        matrix = [[-1] * n for _ in range(m)]
        
        if not head:
            return matrix
        
        curr = head
        row, col = 0, 0
        # Directions: right, down, left, up
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        dir_idx = 0
        
        while curr:
            matrix[row][col] = curr.val
            curr = curr.next
            
            # Calculate next position
            next_row = row + directions[dir_idx][0]
            next_col = col + directions[dir_idx][1]
            
            # Check if next position is valid
            if (next_row < 0 or next_row >= m or 
                next_col < 0 or next_col >= n or 
                matrix[next_row][next_col] != -1):
                # Change direction
                dir_idx = (dir_idx + 1) % 4
                next_row = row + directions[dir_idx][0]
                next_col = col + directions[dir_idx][1]
            
            row, col = next_row, next_col
        
        return matrix
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> spiralMatrix(int m, int n, ListNode* head) {
        vector<vector<int>> matrix(m, vector<int>(n, -1));
        
        if (!head) return matrix;
        
        ListNode* curr = head;
        int row = 0, col = 0;
        // Directions: right, down, left, up
        vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int dirIdx = 0;
        
        while (curr) {
            matrix[row][col] = curr->val;
            curr = curr->next;
            
            // Calculate next position
            int nextRow = row + directions[dirIdx].first;
            int nextCol = col + directions[dirIdx].second;
            
            // Check if next position is valid
            if (nextRow < 0 || nextRow >= m || 
                nextCol < 0 || nextCol >= n || 
                matrix[nextRow][nextCol] != -1) {
                // Change direction
                dirIdx = (dirIdx + 1) % 4;
                nextRow = row + directions[dirIdx].first;
                nextCol = col + directions[dirIdx].second;
            }
            
            row = nextRow;
            col = nextCol;
        }
        
        return matrix;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] spiralMatrix(int m, int n, ListNode head) {
        int[][] matrix = new int[m][n];
        for (int[] row : matrix) {
            Arrays.fill(row, -1);
        }
        
        if (head == null) return matrix;
        
        ListNode curr = head;
        int row = 0, col = 0;
        // Directions: right, down, left, up
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int dirIdx = 0;
        
        while (curr != null) {
            matrix[row][col] = curr.val;
            curr = curr.next;
            
            // Calculate next position
            int nextRow = row + directions[dirIdx][0];
            int nextCol = col + directions[dirIdx][1];
            
            // Check if next position is valid
            if (nextRow < 0 || nextRow >= m || 
                nextCol < 0 || nextCol >= n || 
                matrix[nextRow][nextCol] != -1) {
                // Change direction
                dirIdx = (dirIdx + 1) % 4;
                nextRow = row + directions[dirIdx][0];
                nextCol = col + directions[dirIdx][1];
            }
            
            row = nextRow;
            col = nextCol;
        }
        
        return matrix;
    }
}
```

<!-- slide -->
```javascript
var spiralMatrix = function(m, n, head) {
    const matrix = Array.from({ length: m }, () => Array(n).fill(-1));
    
    if (!head) return matrix;
    
    let curr = head;
    let row = 0, col = 0;
    // Directions: right, down, left, up
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let dirIdx = 0;
    
    while (curr) {
        matrix[row][col] = curr.val;
        curr = curr.next;
        
        // Calculate next position
        let nextRow = row + directions[dirIdx][0];
        let nextCol = col + directions[dirIdx][1];
        
        // Check if next position is valid
        if (nextRow < 0 || nextRow >= m || 
            nextCol < 0 || nextCol >= n || 
            matrix[nextRow][nextCol] !== -1) {
            // Change direction
            dirIdx = (dirIdx + 1) % 4;
            nextRow = row + directions[dirIdx][0];
            nextCol = col + directions[dirIdx][1];
        }
        
        row = nextRow;
        col = nextCol;
    }
    
    return matrix;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each cell visited at most once |
| **Space** | O(m * n) - For the output matrix |

---

## Approach 3: Layer-by-Layer Method

This approach explicitly processes each layer of the spiral.

### Algorithm Steps

1. Calculate the number of layers (min(m, n) / 2)
2. For each layer from 0 to layer_count:
   - Process top row, right column, bottom row, left column
   - Handle odd dimensions (center row/column may exist)
3. Fill with linked list values, leave rest as -1

### Code Implementation

````carousel
```python
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def spiralMatrix_layer(self, m: int, n: int, head: Optional[ListNode]) -> List[List[int]]:
        """
        Generate spiral matrix using layer-by-layer method.
        """
        matrix = [[-1] * n for _ in range(m)]
        
        if not head:
            return matrix
        
        curr = head
        layer = 0
        
        while curr:
            # Top row (left to right)
            for j in range(layer, n - layer):
                if curr:
                    matrix[layer][j] = curr.val
                    curr = curr.next
            
            # Right column (top to bottom)
            for i in range(layer + 1, m - layer):
                if curr:
                    matrix[i][n - layer - 1] = curr.val
                    curr = curr.next
            
            # Bottom row (right to left)
            if layer < m - layer - 1:
                for j in range(n - layer - 2, layer - 1, -1):
                    if curr:
                        matrix[m - layer - 1][j] = curr.val
                        curr = curr.next
            
            # Left column (bottom to top)
            if layer < n - layer - 1:
                for i in range(m - layer - 2, layer, -1):
                    if curr:
                        matrix[i][layer] = curr.val
                        curr = curr.next
            
            layer += 1
        
        return matrix
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> spiralMatrix(int m, int n, ListNode* head) {
        vector<vector<int>> matrix(m, vector<int>(n, -1));
        
        if (!head) return matrix;
        
        ListNode* curr = head;
        int layer = 0;
        
        while (curr) {
            // Top row (left to right)
            for (int j = layer; j < n - layer; j++) {
                if (curr) {
                    matrix[layer][j] = curr->val;
                    curr = curr->next;
                }
            }
            
            // Right column (top to bottom)
            for (int i = layer + 1; i < m - layer; i++) {
                if (curr) {
                    matrix[i][n - layer - 1] = curr->val;
                    curr = curr->next;
                }
            }
            
            // Bottom row (right to left)
            if (layer < m - layer - 1) {
                for (int j = n - layer - 2; j >= layer; j--) {
                    if (curr) {
                        matrix[m - layer - 1][j] = curr->val;
                        curr = curr->next;
                    }
                }
            }
            
            // Left column (bottom to top)
            if (layer < n - layer - 1) {
                for (int i = m - layer - 2; i > layer; i--) {
                    if (curr) {
                        matrix[i][layer] = curr->val;
                        curr = curr->next;
                    }
                }
            }
            
            layer++;
        }
        
        return matrix;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] spiralMatrix(int m, int n, ListNode head) {
        int[][] matrix = new int[m][n];
        for (int[] row : matrix) {
            Arrays.fill(row, -1);
        }
        
        if (head == null) return matrix;
        
        ListNode curr = head;
        int layer = 0;
        
        while (curr != null) {
            // Top row (left to right)
            for (int j = layer; j < n - layer; j++) {
                if (curr != null) {
                    matrix[layer][j] = curr.val;
                    curr = curr.next;
                }
            }
            
            // Right column (top to bottom)
            for (int i = layer + 1; i < m - layer; i++) {
                if (curr != null) {
                    matrix[i][n - layer - 1] = curr.val;
                    curr = curr.next;
                }
            }
            
            // Bottom row (right to left)
            if (layer < m - layer - 1) {
                for (int j = n - layer - 2; j >= layer; j--) {
                    if (curr != null) {
                        matrix[m - layer - 1][j] = curr.val;
                        curr = curr.next;
                    }
                }
            }
            
            // Left column (bottom to top)
            if (layer < n - layer - 1) {
                for (int i = m - layer - 2; i > layer; i--) {
                    if (curr != null) {
                        matrix[i][layer] = curr.val;
                        curr = curr.next;
                    }
                }
            }
            
            layer++;
        }
        
        return matrix;
    }
}
```

<!-- slide -->
```javascript
var spiralMatrix = function(m, n, head) {
    const matrix = Array.from({ length: m }, () => Array(n).fill(-1));
    
    if (!head) return matrix;
    
    let curr = head;
    let layer = 0;
    
    while (curr) {
        // Top row (left to right)
        for (let j = layer; j < n - layer; j++) {
            if (curr) {
                matrix[layer][j] = curr.val;
                curr = curr.next;
            }
        }
        
        // Right column (top to bottom)
        for (let i = layer + 1; i < m - layer; i++) {
            if (curr) {
                matrix[i][n - layer - 1] = curr.val;
                curr = curr.next;
            }
        }
        
        // Bottom row (right to left)
        if (layer < m - layer - 1) {
            for (let j = n - layer - 2; j >= layer; j--) {
                if (curr) {
                    matrix[m - layer - 1][j] = curr.val;
                    curr = curr.next;
                }
            }
        }
        
        // Left column (bottom to top)
        if (layer < n - layer - 1) {
            for (let i = m - layer - 2; i > layer; i--) {
                if (curr) {
                    matrix[i][layer] = curr.val;
                    curr = curr.next;
                }
            }
        }
        
        layer++;
    }
    
    return matrix;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each cell visited at most once |
| **Space** | O(m * n) - For the output matrix |

---

## Comparison of Approaches

| Aspect | Boundary Method | Direction Array | Layer-by-Layer |
|--------|-----------------|-----------------|----------------|
| **Time Complexity** | O(m*n) | O(m*n) | O(m*n) |
| **Space Complexity** | O(m*n) | O(m*n) | O(m*n) |
| **Implementation** | Moderate | Moderate | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Readability** | High | Moderate | High |

**Best Approach:** Any of the three approaches works well. The boundary method is often preferred for its clarity.

---

## Why Boundary Method is Optimal

The boundary method is optimal because:

1. **Single Pass**: Each cell is visited at most once
2. **Clear Logic**: Four boundaries are intuitive to understand
3. **Handles All Cases**: Works for any m x n combination
4. **Efficient**: No redundant checks or calculations
5. **Easy to Debug**: Clear separation of each direction

The key insight is that spiral traversal naturally divides into four directions, and using boundaries avoids the need for visited arrays or complex state management.

---

## Related Problems

Based on similar themes (spiral traversal, matrix generation):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Spiral Matrix | [Link](https://leetcode.com/problems/spiral-matrix/) | Generate spiral from array |
| Spiral Matrix II | [Link](https://leetcode.com/problems/spiral-matrix-ii/) | Generate spiral matrix 1 to n² |
| Diagonal Traverse | [Link](https://leetcode.com/problems/diagonal-traverse/) | Diagonal matrix traversal |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Set Matrix Zeroes | [Link](https://leetcode.com/problems/set-matrix-zeroes/) | Matrix manipulation |
| Rotate Image | [Link](https://leetcode.com/problems/rotate-image/) | In-place matrix rotation |
| Zigzag Conversion | [Link](https://leetcode.com/problems/zigzag-conversion/) | String to matrix |

### Pattern Reference

For more detailed explanations of matrix traversal patterns, see:
- **[Matrix Traversal Patterns](/patterns/matrix-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Spiral Matrix Techniques

- [NeetCode - Spiral Matrix IV](https://www.youtube.com/watch?v=W-4HJqE7y1U) - Clear explanation with visual examples
- [Spiral Matrix Explanation](https://www.youtube.com/watch?v=4B0r8RdPGsQ) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=v1J3m8dV44I) - Official problem solution
- [Boundary Method Tutorial](https://www.youtube.com/watch?v=xFJvdB4VdwM) - Understanding boundary approach

### Related Concepts

- [Linked List to Array Conversion](https://www.youtube.com/watch?v=Q9uZgY-NIzo) - Converting linked list to array
- [Matrix Traversal Patterns](https://www.youtube.com/watch?v=4b9rWkedMdw) - Common matrix patterns

---

## Follow-up Questions

### Q1: Can you generate the spiral in counter-clockwise order?

**Answer:** Yes! Simply reverse the order of direction processing:
- Left column first (bottom to top)
- Then bottom row (right to left)
- Then right column (top to bottom)
- Then top row (left to right)

---

### Q2: How would you handle a singly linked list vs doubly linked list?

**Answer:** The solution works for both singly and doubly linked lists since we only traverse forward. For doubly linked lists, you could potentially start from either end, but the problem specifies a singly linked list.

---

### Q3: What if the linked list has more nodes than matrix cells?

**Answer:** The problem states the number of nodes is in the range [1, m * n], so this won't happen. If it could, we'd stop filling once the matrix is full.

---

### Q4: How would you modify to fill in anti-clockwise (counter-clockwise) spiral?

**Answer:** Change the traversal order:
1. Left column (bottom to top)
2. Bottom row (right to left)
3. Right column (top to bottom)
4. Top row (left to right)

This creates a counter-clockwise spiral starting from top-left.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single row matrix (m=1)
- Single column matrix (n=1)
- Square matrix (m=n)
- Rectangular matrix (m≠n)
- Minimum size (m=1, n=1)
- Linked list exactly fills matrix
- Linked list shorter than matrix cells

---

### Q6: How would you extend this to 3D spiral traversal?

**Answer:** For a 3D array (m x n x p), you'd need to maintain 6 boundaries (top, bottom, left, right, front, back) and process in a more complex order, visiting each "shell" of the 3D volume.

---

### Q7: Can you do this without creating the entire matrix first?

**Answer:** Not really, since you need to return the complete matrix. However, you could use a sparse matrix representation if m*n is very large but most cells are -1.

---

### Q8: How would you handle different starting positions (not top-left)?

**Answer:** Modify the initial values of top, bottom, left, right:
- For center start: Calculate center based on m and n
- For top-right start: Start at (0, n-1) and reverse the direction order

---

## Common Pitfalls

### 1. Not Checking Boundary Conditions
**Issue**: Forgetting to check if top <= bottom before processing bottom row.

**Solution**: Always check boundary conditions before processing each direction.

### 2. Off-by-One Errors
**Issue**: Using wrong range in loops (e.g., using < instead of <=).

**Solution**: Be careful with inclusive/exclusive boundaries.

### 3. Forgetting to Update Pointers
**Issue**: Not incrementing/decrementing boundaries after each direction.

**Solution**: Always update boundaries in the correct order.

### 4. Not Handling Empty Linked List
**Issue**: Not initializing matrix with -1 before processing.

**Solution**: Initialize matrix with -1 at the start.

### 5. Wrong Loop Direction for Bottom/Left
**Issue**: Using forward loops for bottom row or left column.

**Solution**: Use reverse ranges: range(right, left-1, -1) and range(bottom, top-1, -1).

---

## Summary

The **Spiral Matrix IV** problem demonstrates the **Spiral Matrix Traversal** pattern:

- **Boundary method**: Optimal with O(m*n) time and O(m*n) space
- **Four directions**: Right, down, left, up in clockwise order
- **Four boundaries**: top, bottom, left, right shrink after each layer
- **Handles all cases**: Works for any m x n combination

The key insight is using four boundaries to track the unprocessed matrix region and processing each direction systematically. This creates a natural spiral pattern.

This problem is an excellent demonstration of combining two data structures (linked list and matrix) and systematic boundary management.

### Pattern Summary

This problem exemplifies the **Spiral Matrix Traversal** pattern, which is characterized by:
- Maintaining four boundaries
- Processing in four directions
- Shrinking boundaries after each layer
- Handling rectangular matrices

For more details on this pattern and its variations, see the **[Matrix Traversal Patterns](/patterns/matrix-traversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/spiral-matrix-iv/discuss/) - Community solutions and explanations
- [Spiral Matrix - GeeksforGeeks](https://www.geeksforgeeks.org/print-matrix-in-spiral-form/) - Detailed explanation
- [Matrix Traversal - Wikipedia](https://en.wikipedia.org/wiki/Matrix_(mathematics)) - Matrix concepts
- [Pattern: Matrix Traversal](/patterns/matrix-traversal) - Comprehensive pattern guide
