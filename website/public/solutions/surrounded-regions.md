# Surrounded Regions

## Problem Description

Given an `m x n` board containing characters `'X'` and `'O'`, capture all regions that are **surrounded by 'X'**. A region is captured by flipping all 'O's in it to 'X's.

### Key Definitions:

- **Region**: A group of connected 'O' cells connected 4-directionally (horizontal or vertical).
- **Surrounded**: A region is surrounded if it is completely enclosed by 'X' cells and none of its cells are on the border of the board.

A region is **NOT** surrounded if any cell in the region touches the border of the board.

---

## Examples

### Example 1

**Input:**
```python
board = [
    ["X", "X", "X", "X"],
    ["X", "O", "O", "X"],
    ["X", "X", "O", "X"],
    ["X", "O", "X", "X"]
]
```

**Output:**
```python
[
    ["X", "X", "X", "X"],
    ["X", "X", "X", "X"],
    ["X", "X", "X", "X"],
    ["X", "O", "X", "X"]
]
```

**Explanation:**
- The two 'O's in the middle form a region that is completely surrounded by 'X's, so they are flipped to 'X'.
- The 'O' at position (3, 1) is NOT flipped because it touches the bottom border of the board.

### Example 2

**Input:**
```python
board = [["X"]]
```

**Output:**
```python
[["X"]]
```

**Explanation:** Single cell board with 'X' remains unchanged.

### Example 3

**Input:**
```python
board = [
    ["O", "O"],
    ["O", "O"]
]
```

**Output:**
```python
[
    ["O", "O"],
    ["O", "O"]
]
```

**Explanation:** All 'O's touch the border, so none are flipped.

### Example 4

**Input:**
```python
board = [
    ["X", "X", "X", "X"],
    ["X", "O", "O", "X"],
    ["X", "X", "X", "X"],
    ["X", "O", "X", "X"]
]
```

**Output:**
```python
[
    ["X", "X", "X", "X"],
    ["X", "X", "X", "X"],
    ["X", "X", "X", "X"],
    ["X", "O", "X", "X"]
]
```

**Explanation:** Only the center 'O's are flipped. The bottom-left 'O' touches the border and is not flipped.

---

## Constraints

- `m == board.length`
- `n == board[i].length`
- `1 <= m, n <= 200`
- `board[i][j]` is either `'X'` or `'O'`

---

## Solution 1: Depth-First Search (DFS)

### Intuition

Instead of trying to identify which 'O's should be flipped (all 'O's not connected to the border), we can use a **reverse thinking approach**:

1. Mark all 'O's that are connected to the border as "safe" (they won't be flipped).
2. Any 'O' that is not marked as safe is surrounded and should be flipped to 'X'.

### Algorithm

1. Create a DFS helper function that marks safe 'O's by changing them to a temporary marker (e.g., 'T').
2. Start DFS from all border cells that contain 'O'.
3. After marking all safe 'O's, iterate through the entire board:
   - If a cell is 'O', it means it's surrounded → flip to 'X'.
   - If a cell is 'T', it was marked as safe → flip back to 'O'.

### Code

```python
from typing import List

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        if not board or not board[0]:
            return
        
        m, n = len(board), len(board[0])
        
        def dfs(i: int, j: int) -> None:
            """Mark 'O' cells as 'T' if connected to border."""
            if i < 0 or i >= m or j < 0 or j >= n:
                return
            if board[i][j] != 'O':
                return
            
            board[i][j] = 'T'  # Temporarily mark as safe
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        
        # Step 1: Mark all border-connected 'O's as safe ('T')
        for i in range(m):
            if board[i][0] == 'O':
                dfs(i, 0)
            if board[i][n - 1] == 'O':
                dfs(i, n - 1)
        
        for j in range(n):
            if board[0][j] == 'O':
                dfs(0, j)
            if board[m - 1][j] == 'O':
                dfs(m - 1, j)
        
        # Step 2: Flip 'O' to 'X' and 'T' back to 'O'
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    board[i][j] = 'X'
                elif board[i][j] == 'T':
                    board[i][j] = 'O'
```

### Step-by-Step Walkthrough (Example 1)

```
Initial Board:        After DFS (marking):   Final Result:
X X X X               X X X X               X X X X
X O O X        →      X T T X        →      X X X X
X X O X               X X T X               X X X X
X O X X               X T X X               X O X X
```

1. **DFS from border 'O's**: Start DFS from (1,1), (1,2), (2,2) that are connected to each other, and from (3,1).
2. **Mark safe cells**: The inner 'O's (1,1), (1,2), (2,2) are marked as 'T'. The border 'O' (3,1) is also marked as 'T'.
3. **Flip**: All remaining 'O's are flipped to 'X'. All 'T's are flipped back to 'O'.

### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(m × n) | Each cell is visited at most once during DFS |
| **Space** | O(m × n) | Worst-case recursion stack when grid is filled with 'O's |

---

## Solution 2: Breadth-First Search (BFS)

### Intuition

Same as DFS, but use BFS with a queue instead of recursion. This avoids potential stack overflow for very large grids.

### Algorithm

1. Use a queue to perform BFS starting from all border 'O' cells.
2. Mark visited safe 'O's as 'T'.
3. Flip 'O' to 'X' and 'T' to 'O' in the final pass.

### Code

```python
from typing import List
from collections import deque

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        if not board or not board[0]:
            return
        
        m, n = len(board), len(board[0])
        queue = deque()
        
        # Step 1: Add all border 'O's to queue
        for i in range(m):
            if board[i][0] == 'O':
                queue.append((i, 0))
            if board[i][n - 1] == 'O':
                queue.append((i, n - 1))
        
        for j in range(n):
            if board[0][j] == 'O':
                queue.append((0, j))
            if board[m - 1][j] == 'O':
                queue.append((m - 1, j))
        
        # Step 2: BFS to mark safe 'O's as 'T'
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            i, j = queue.popleft()
            if 0 <= i < m and 0 <= j < n and board[i][j] == 'O':
                board[i][j] = 'T'
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n and board[ni][nj] == 'O':
                        queue.append((ni, nj))
        
        # Step 3: Flip 'O' to 'X' and 'T' to 'O'
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    board[i][j] = 'X'
                elif board[i][j] == 'T':
                    board[i][j] = 'O'
```

### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(m × n) | Each cell is visited at most once during BFS |
| **Space** | O(m × n) | Queue can contain up to all cells in worst case |

---

## Solution 3: Union-Find (Disjoint Set Union)

### Intuition

Use Union-Find to group all 'O' cells and track which groups are connected to the border. Groups not connected to the border are surrounded.

### Algorithm

1. Create a Union-Find data structure for all cells.
2. Iterate through the grid and union adjacent 'O' cells.
3. Track which component is connected to the border.
4. For each 'O' cell, check if its component is connected to the border. If not, flip to 'X'.

### Code

```python
from typing import List

class UnionFind:
    def __init__(self, size: int):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.border = [False] * size  # Track if component touches border
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        # Merge border status
        self.border[px] = self.border[px] or self.border[py]
    
    def mark_border(self, x: int) -> None:
        self.border[self.find(x)] = True
    
    def is_border(self, x: int) -> bool:
        return self.border[self.find(x)]


class Solution:
    def solve(self, board: List[List[str]]) -> None:
        if not board or not board[0]:
            return
        
        m, n = len(board), len(board[0])
        uf = UnionFind(m * n)
        
        def get_index(i: int, j: int) -> int:
            return i * n + j
        
        # Step 1: Union adjacent 'O's and mark border components
        for i in range(m):
            for j in range(n):
                if board[i][j] != 'O':
                    continue
                
                idx = get_index(i, j)
                
                # Mark if on border
                if i == 0 or i == m - 1 or j == 0 or j == n - 1:
                    uf.mark_border(idx)
                
                # Union with neighbors
                if i > 0 and board[i - 1][j] == 'O':
                    uf.union(idx, get_index(i - 1, j))
                if i < m - 1 and board[i + 1][j] == 'O':
                    uf.union(idx, get_index(i + 1, j))
                if j > 0 and board[i][j - 1] == 'O':
                    uf.union(idx, get_index(i, j - 1))
                if j < n - 1 and board[i][j + 1] == 'O':
                    uf.union(idx, get_index(i, j + 1))
        
        # Step 2: Flip non-border 'O's to 'X'
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    idx = get_index(i, j)
                    if not uf.is_border(idx):
                        board[i][j] = 'X'
```

### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(m × n × α(m×n)) | α is the inverse Ackermann function (practically constant) |
| **Space** | O(m × n) | Union-Find arrays for all cells |

---

## Solution 4: Iterative DFS (Stack-based)

### Intuition

Same as recursive DFS but using an explicit stack to avoid recursion limits.

### Code

```python
from typing import List

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        if not board or not board[0]:
            return
        
        m, n = len(board), len(board[0])
        
        def mark_safe(start_i: int, start_j: int) -> None:
            """Iterative DFS using stack."""
            stack = [(start_i, start_j)]
            while stack:
                i, j = stack.pop()
                if i < 0 or i >= m or j < 0 or j >= n:
                    continue
                if board[i][j] != 'O':
                    continue
                
                board[i][j] = 'T'
                stack.append((i + 1, j))
                stack.append((i - 1, j))
                stack.append((i, j + 1))
                stack.append((i, j - 1))
        
        # Mark border-connected 'O's
        for i in range(m):
            if board[i][0] == 'O':
                mark_safe(i, 0)
            if board[i][n - 1] == 'O':
                mark_safe(i, n - 1)
        
        for j in range(n):
            if board[0][j] == 'O':
                mark_safe(0, j)
            if board[m - 1][j] == 'O':
                mark_safe(m - 1, j)
        
        # Flip 'O' to 'X' and 'T' to 'O'
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    board[i][j] = 'X'
                elif board[i][j] == 'T':
                    board[i][j] = 'O'
```

### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(m × n) | Each cell is visited at most once |
| **Space** | O(m × n) | Stack can contain up to all cells in worst case |

---

## Approach Comparison

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **DFS (Recursive)** | O(m×n) | O(m×n) | Simple, elegant | Stack overflow for large grids |
| **BFS** | O(m×n) | O(m×n) | No recursion limit | More memory for queue |
| **Union-Find** | O(m×n×α(n)) | O(m×n) | Good for connectivity queries | More complex implementation |
| **Iterative DFS** | O(m×n) | O(m×n) | No recursion limit | Uses explicit stack |

---

## Summary

The most common and recommended approach is **DFS (Solution 1)** because:
- It's intuitive and easy to understand
- The implementation is clean and concise
- It works well for grid sizes up to 200×200 (the constraint limit)

For very large grids or when recursion is not allowed, use **BFS (Solution 2)** or **Iterative DFS (Solution 4)**.

---

## Related Problems

1. **[Number of Islands](https://leetcode.com/problems/number-of-islands/)** - Count connected components of '1's
2. **[Number of Closed Islands](https://leetcode.com/problems/number-of-closed-islands/)** - Count islands not connected to the border
3. **[Max Area of Island](https://leetcode.com/problems/max-area-of-island/)** - Find the largest island
4. **[Flood Fill](https://leetcode.com/problems/flood-fill/)** - Paint connected cells with a new color
5. **[Island Perimeter](https://leetcode.com/problems/island-perimeter/)** - Calculate perimeter of an island

---

## Video Tutorials

1. **[Surrounded Regions - LeetCode 130 - Full Explanation](https://www.youtube.com/watch?v=R4Nh-1ntWqw)** - NeetCode
2. **[Surrounded Regions Solution](https://www.youtube.com/watch?v=9zO75c9wB84)** - Back to Back SWE
3. **[DFS Solution](https://www.youtube.com/watch?v=HY4pRrIlL6U)** - Generic DFS pattern explanation

---

## Pattern Recognition

This problem demonstrates the **"Border-Connected" pattern**:

> When you need to identify regions that are NOT connected to the border, flip the problem: mark all border-connected cells as safe, then anything remaining is not safe.

This pattern is useful for:
- Counting closed islands
- Finding enclosed regions
- Identifying interior vs. exterior components

