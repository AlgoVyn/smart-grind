# Game of Life

## Problem Description

According to Wikipedia's article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."
The board is made up of an m x n grid of cells, where each cell has an initial state: live (represented by a 1) or dead (represented by a 0). Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):

1. Any live cell with fewer than two live neighbors dies as if caused by under-population.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if by over-population.
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

The next state of the board is determined by applying the above rules simultaneously to every cell in the current state of the m x n grid board. In this process, births and deaths occur simultaneously.
Given the current state of the board, update the board to reflect its next state.
Note that you do not need to return anything.

---

## Examples

**Example 1:**

**Input:**
```python
board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
```

**Output:**
```python
[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
```

**Example 2:**

**Input:**
```python
board = [[1,1],[1,0]]
```

**Output:
```python
[[1,1],[1,1]]
```

---

## Constraints

- m == board.length
- n == board[i].length
- 1 <= m, n <= 25
- board[i][j] is 0 or 1.

**Follow up:**
Could you solve it in-place? Remember that the board needs to be updated simultaneously: You cannot update some cells first and then use their updated values to update other cells.
In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches upon the border of the array (i.e., live cells reach the border). How would you address these problems?

---

## Pattern:

This problem follows the **In-Place State Encoding** pattern, commonly used in cellular automaton problems and matrix transformation challenges where you need to update all cells simultaneously.

### Core Concept

- Use **intermediate states** to encode both original and new states
- Process all cells in two passes: encode → decode
- First pass: apply rules and encode new state without losing original information
- Second pass: decode intermediate states to final states

### When to Use This Pattern

This pattern is applicable when:
1. Need to update a grid/matrix **simultaneously** based on neighbor states
2. In-place modification is required (O(1) space)
3. Original state information is needed for computing neighbor states
4. Cellular automaton or similar simulation problems

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Copy + Update | Create a copy of the matrix, O(m×n) space |
| Bit Manipulation | Use second bit to store next state (more elegant) |
| BFS/DFS Traversal | For connected component problems |

---

## Intuition

The key insight is that all cells must be updated **simultaneously** based on their original states. This means we cannot update cells one by one and use the new values for neighboring cells.

To solve this in-place, we use **state encoding**:
- **State 0**: Originally dead, stays dead
- **State 1**: Originally alive, stays alive  
- **State 2**: Originally alive, dies (1 → 2)
- **State 3**: Originally dead, becomes alive (0 → 3)

By using these intermediate states, we can track both the original and new states without extra space.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **In-Place State Encoding (Optimal)** - O(m×n) time, O(1) space
2. **Copy Board Approach** - O(m×n) time, O(m×n) space
3. **Bit Manipulation** - O(m×n) time, O(1) space using bit operations

---

## Approach 1: In-Place State Encoding (Optimal)

This is the most efficient approach that modifies the board in-place using intermediate states.

### Algorithm Steps

1. Define neighbor directions (8 directions)
2. For each cell, count live neighbors using original state
3. Apply rules using intermediate states:
   - Live cell dying → state 2
   - Dead cell becoming live → state 3
4. Second pass: decode intermediate states to final states

### Why It Works

By using intermediate states (2 for dying, 3 for becoming alive), we preserve the original information while encoding the new state. This allows all cells to be processed simultaneously.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        Uses in-place state encoding to achieve O(1) space.
        
        State encoding:
        - 0: dead -> dead
        - 1: alive -> alive
        - 2: alive -> dead (was 1, becomes 0)
        - 3: dead -> alive (was 0, becomes 1)
        """
        if not board or not board[0]:
            return
            
        m, n = len(board), len(board[0])
        
        def count_live_neighbors(i: int, j: int) -> int:
            """Count live neighbors (considering states 1 and 2 as live)."""
            count = 0
            for di in [-1, 0, 1]:
                for dj in [-1, 0, 1]:
                    if di == 0 and dj == 0:
                        continue
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n:
                        # State 1 (alive) or 2 (was alive, will die) count as live
                        if board[ni][nj] == 1 or board[ni][nj] == 2:
                            count += 1
            return count
        
        # First pass: apply rules and encode new states
        for i in range(m):
            for j in range(n):
                live_neighbors = count_live_neighbors(i, j)
                
                if board[i][j] == 1:  # Currently alive
                    if live_neighbors < 2 or live_neighbors > 3:
                        board[i][j] = 2  # Will die
                    # else: stays 1 (alive)
                else:  # Currently dead (0)
                    if live_neighbors == 3:
                        board[i][j] = 3  # Will become alive
        
        # Second pass: decode intermediate states
        for i in range(m):
            for j in range(n):
                if board[i][j] == 2:
                    board[i][j] = 0
                elif board[i][j] == 3:
                    board[i][j] = 1
```

<!-- slide -->
```cpp
class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        if (board.empty() || board[0].empty()) return;
        
        int m = board.size(), n = board[0].size();
        int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        auto countLive = [&](int i, int j) {
            int count = 0;
            for (auto& d : dirs) {
                int ni = i + d[0], nj = j + d[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    if (board[ni][nj] == 1 || board[ni][nj] == 2)
                        count++;
                }
            }
            return count;
        };
        
        // First pass: encode states
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = countLive(i, j);
                if (board[i][j] == 1) {
                    if (live < 2 || live > 3) board[i][j] = 2;
                } else {
                    if (live == 3) board[i][j] = 3;
                }
            }
        }
        
        // Second pass: decode
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 2) board[i][j] = 0;
                else if (board[i][j] == 3) board[i][j] = 1;
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void gameOfLife(int[][] board) {
        if (board == null || board.length == 0 || board[0].length == 0) return;
        
        int m = board.length, n = board[0].length;
        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        // First pass: encode new states
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = countLive(board, i, j, m, n, dirs);
                
                if (board[i][j] == 1) {
                    if (live < 2 || live > 3) board[i][j] = 2; // dies
                } else {
                    if (live == 3) board[i][j] = 3; // becomes alive
                }
            }
        }
        
        // Second pass: decode
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 2) board[i][j] = 0;
                else if (board[i][j] == 3) board[i][j] = 1;
            }
        }
    }
    
    private int countLive(int[][] board, int i, int j, int m, int n, int[][] dirs) {
        int count = 0;
        for (int[] d : dirs) {
            int ni = i + d[0], nj = j + d[1];
            if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                if (board[ni][nj] == 1 || board[ni][nj] == 2) count++;
            }
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var gameOfLife = function(board) {
    if (!board || board.length === 0 || board[0].length === 0) return;
    
    const m = board.length, n = board[0].length;
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    const countLive = (i, j) => {
        let count = 0;
        for (const [di, dj] of dirs) {
            const ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                if (board[ni][nj] === 1 || board[ni][nj] === 2) count++;
            }
        }
        return count;
    };
    
    // First pass: encode states
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const live = countLive(i, j);
            if (board[i][j] === 1) {
                if (live < 2 || live > 3) board[i][j] = 2;
            } else {
                if (live === 3) board[i][j] = 3;
            }
        }
    }
    
    // Second pass: decode
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 2) board[i][j] = 0;
            else if (board[i][j] === 3) board[i][j] = 1;
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Two passes over the board |
| **Space** | O(1) - In-place modification, no extra space |

---

## Approach 2: Copy Board Approach

Create a separate board to store the next state, then copy it back. Simpler but uses more space.

### Algorithm Steps

1. Create a copy of the board
2. For each cell in original board, count live neighbors from copy
3. Apply rules and write to original board
4. No need for second pass

### Code Implementation

````carousel
```python
from typing import List
import copy

class Solution:
    def gameOfLife_copy(self, board: List[List[int]]) -> None:
        """Copy board approach - simpler but O(m*n) space."""
        if not board:
            return
            
        m, n = len(board), len(board[0])
        # Create a copy of the board
        copy_board = [row[:] for row in board]
        
        # Directions for 8 neighbors
        dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
        
        for i in range(m):
            for j in range(n):
                # Count live neighbors from COPY
                live = 0
                for di, dj in dirs:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n:
                        live += copy_board[ni][nj]
                
                # Apply rules
                if copy_board[i][j] == 1:
                    if live < 2 or live > 3:
                        board[i][j] = 0
                else:
                    if live == 3:
                        board[i][j] = 1
```

<!-- slide -->
```cpp
class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        if (board.empty()) return;
        
        int m = board.size(), n = board[0].size();
        vector<vector<int>> copy = board;
        
        int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = 0;
                for (auto& d : dirs) {
                    int ni = i + d[0], nj = j + d[1];
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                        live += copy[ni][nj];
                }
                
                if (copy[i][j] == 1) {
                    if (live < 2 || live > 3) board[i][j] = 0;
                } else {
                    if (live == 3) board[i][j] = 1;
                }
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void gameOfLife(int[][] board) {
        if (board == null || board.length == 0) return;
        
        int m = board.length, n = board[0].length;
        int[][] copy = new int[m][n];
        for (int i = 0; i < m; i++)
            System.arraycopy(board[i], 0, copy[i], 0, n);
        
        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = 0;
                for (int[] d : dirs) {
                    int ni = i + d[0], nj = j + d[1];
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                        live += copy[ni][nj];
                }
                
                if (copy[i][j] == 1) {
                    if (live < 2 || live > 3) board[i][j] = 0;
                } else {
                    if (live == 3) board[i][j] = 1;
                }
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} board
 */
var gameOfLife = function(board) {
    if (!board || board.length === 0) return;
    
    const m = board.length, n = board[0].length;
    const copy = board.map(row => [...row]);
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let live = 0;
            for (const [di, dj] of dirs) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                    live += copy[ni][nj];
            }
            
            if (copy[i][j] === 1) {
                if (live < 2 || live > 3) board[i][j] = 0;
            } else {
                if (live === 3) board[i][j] = 1;
            }
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Single pass |
| **Space** | O(m × n) - Copy of the board |

---

## Approach 3: Bit Manipulation

Use the second bit to store the next state while preserving the first bit for the current state.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def gameOfLife_bits(self, board: List[List[int]]) -> None:
        """Bit manipulation approach - uses second bit for new state."""
        if not board:
            return
            
        m, n = len(board), len(board[0])
        dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
        
        for i in range(m):
            for j in range(n):
                live = 0
                for di, dj in dirs:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n:
                        # Count live from original state (first bit)
                        live += board[ni][nj] & 1
                
                # Apply rules and set second bit
                if (board[i][j] & 1) == 1:  # Currently alive
                    if live == 2 or live == 3:
                        board[i][j] |= 2  # Set second bit to 1 (stays alive)
                else:  # Currently dead
                    if live == 3:
                        board[i][j] |= 2  # Set second bit to 1 (becomes alive)
        
        # Shift right to get final state
        for i in range(m):
            for j in range(n):
                board[i][j] >>= 1
```

<!-- slide -->
```cpp
class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        if (board.empty()) return;
        
        int m = board.size(), n = board[0].size();
        int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = 0;
                for (auto& d : dirs) {
                    int ni = i + d[0], nj = j + d[1];
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                        live += board[ni][nj] & 1;
                }
                
                if ((board[i][j] & 1) == 1) {
                    if (live == 2 || live == 3) board[i][j] |= 2;
                } else {
                    if (live == 3) board[i][j] |= 2;
                }
            }
        }
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                board[i][j] >>= 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public void gameOfLife(int[][] board) {
        if (board == null || board.length == 0) return;
        
        int m = board.length, n = board[0].length;
        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = 0;
                for (int[] d : dirs) {
                    int ni = i + d[0], nj = j + d[1];
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                        live += board[ni][nj] & 1;
                }
                
                if ((board[i][j] & 1) == 1) {
                    if (live == 2 || live == 3) board[i][j] |= 2;
                } else {
                    if (live == 3) board[i][j] |= 2;
                }
            }
        }
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                board[i][j] >>= 1;
    }
}
```

<!-- slide -->
```javascript
var gameOfLife = function(board) {
    if (!board || board.length === 0) return;
    
    const m = board.length, n = board[0].length;
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let live = 0;
            for (const [di, dj] of dirs) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                    live += board[ni][nj] & 1;
            }
            
            if ((board[i][j] & 1) === 1) {
                if (live === 2 || live === 3) board[i][j] |= 2;
            } else {
                if (live === 3) board[i][j] |= 2;
            }
        }
    }
    
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            board[i][j] >>= 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Single pass |
| **Space** | O(1) - In-place using bit operations |

---

## Comparison of Approaches

| Aspect | State Encoding | Copy Board | Bit Manipulation |
|--------|---------------|------------|-----------------|
| **Time Complexity** | O(m × n) | O(m × n) | O(m × n) |
| **Space Complexity** | O(1) | O(m × n) | O(1) |
| **Implementation** | Moderate | Simple | Complex |
| **Readability** | Good | Best | Moderate |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |

---

## Related Problems

Based on similar themes (matrix traversal, simulation, cellular automata):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | DFS/BFS on grid similar to cellular automaton |
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Grid traversal with neighbor checking |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Set Matrix Zeroes | [Link](https://leetcode.com/problems/set-matrix-zeroes/) | In-place matrix modification |
| Spiral Matrix | [Link](https://leetcode.com/problems/spiral-matrix/) | Matrix traversal patterns |
| Game of Life II | [Link](https://leetcode.com/problems/game-of-life-ii/) | Extended version with probabilities |

### Pattern Reference

For more detailed explanations of matrix traversal patterns, see:
- **[Matrix Traversal Patterns](/patterns/matrix-traversal)**
- **[DFS - Grid Patterns](/patterns/dfs-grid)**
- **[BFS - Grid Patterns](/patterns/bfs-grid)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### NeetCode Solutions

- [Game of Life - NeetCode](https://www.youtube.com/watch?v=ea9QFyWKHzM) - Clear explanation with visual examples
- [Game of Life - In-Place Solution](https://www.youtube.com/watch?v=prM1UVP1mvU) - Detailed walkthrough

### Other Tutorials

- [Back to Back SWE - Game of Life](https://www.youtube.com/watch?v=7QbUXk4rB9U) - Comprehensive explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=3BucH7KrmgE) - Official problem solution
- [Approach Explanation](https://www.youtube.com/watch?v=JJN4DkM4vjw) - Understanding the in-place technique

---

## Follow-up Questions

### Q1: How would you handle an infinite board?

**Answer:** Use a hash set to store only live cells. For each live cell, compute its neighbors and apply rules. This automatically handles the "infinite" nature since only active cells are tracked. Clean up dead cells periodically.

---

### Q2: What if you needed to compute multiple generations at once?

**Answer:** You could run the simulation iteratively. For k generations, apply the in-place algorithm k times. Alternatively, use the bit manipulation approach with more bits to store multiple future states.

---

### Q3: How would you optimize for sparse boards (few live cells)?

**Answer:** Use a hash set to track only live cells and their neighbors. This reduces the time complexity from O(m×n) to O(k) where k is the number of relevant cells, which is much faster for sparse boards.

---

### Q4: How would you parallelize this computation?

**Answer:** The challenge is that all cells update simultaneously. You can parallelize by:
1. Dividing the board into chunks
2. Each thread processes its chunk and reads from the original state
3. Use synchronization to ensure all threads complete before copying results

---

### Q5: Can you solve it using BFS instead of the neighbor-counting approach?

**Answer:** BFS isn't ideal here since we need to count neighbors for every cell simultaneously. The neighbor-counting approach is more natural. However, you could use BFS to find connected components if you needed to analyze patterns.

---

### Q6: How would you modify the solution for a 3D grid (3D Game of Life)?

**Answer:** Extend the directions array from 8 neighbors to 26 neighbors (3×3×3 - 1). Apply the same rules but now each cell has 26 neighbors instead of 8. The complexity remains O(m×n×p).

---

### Q7: What edge cases should you test?

**Answer:**
- Empty board
- Single cell board
- All cells dead
- All cells alive
- Checkerboard pattern
- Single row/column
- Corner and edge cells

---

### Q8: How would you verify the solution is correct?

**Answer:** Test with known patterns:
- Still lifes (block, beehive)
- Oscillators (blinker, toad, beacon)
- Spaceships (glider)
- Compare results against a known correct implementation

---

## Common Pitfalls

### 1. Not Updating Cells Simultaneously
**Issue**: Updating cells one by one and using new values for neighbors.

**Solution**: Use state encoding (2 for dying, 3 for becoming alive) to preserve original state.

### 2. Counting Neighbors Incorrectly
**Issue**: Forgetting to count intermediate states (1 and 2 both count as live).

**Solution**: Count both state 1 (alive) and state 2 (was alive, will die) as live neighbors.

### 3. Missing Second Pass
**Issue**: Forgetting to decode intermediate states after first pass.

**Solution**: Always do a second pass to convert states 2→0 and 3→1.

### 4. Not Handling Edge Cases
**Issue**: Not considering boundary cells properly.

**Solution**: Ensure all 8 neighbor checks handle array bounds correctly.

### 5. Confusing State Encoding Values
**Issue**: Using wrong values for intermediate states.

**Solution**: Remember: 0=dead, 1=alive, 2=alive→dead, 3=dead→alive.

---

## Summary

The **Game of Life** problem demonstrates the power of in-place state encoding:

- **State encoding approach**: Optimal with O(m×n) time and O(1) space
- **Copy approach**: Simple but uses O(m×n) space
- **Bit manipulation**: Advanced technique using second bit

The key insight is using intermediate states (2, 3) to encode the new state while preserving the original information. This allows simultaneous updates without extra space.

This problem is excellent for understanding matrix manipulation, neighbor counting, and in-place algorithm design.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/game-of-life/discuss/) - Community solutions
- [Conway's Game of Life - Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) - Original concept
- [Matrix Traversal Patterns](/patterns/matrix-traversal) - Comprehensive pattern guide
