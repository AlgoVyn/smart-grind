# Surrounded Regions

## Problem Description

Given an m x n board containing `'X'` and `'O'` (or `'1'` and `'0'` in some variations), capture all regions surrounded by `'X'`. A region is captured by flipping all `'O'`s into `'X'`s in that region. A region is considered "surrounded" if it is completely enclosed by `'X'`s on all four sides - meaning none of the `'O'`s in the region are on the border of the board.

### Key Insight

The key observation is that any `'O'` on the border of the board cannot be surrounded (since it's already on the edge). Therefore, if an `'O'` is connected (via adjacent `'O'`s) to a border `'O'`, it is also not surrounded. The strategy is to:

1. Identify all `'O'`s that are connected to the border
2. Mark them as "safe" (not to be flipped)
3. Flip all remaining `'O'`s (those not connected to the border) to `'X'`

---

## Examples

### Example 1

**Input:** 
```
board = [
    ["X", "X", "X", "X"],
    ["X", "O", "O", "X"],
    ["X", "X", "O", "X"],
    ["X", "O", "X", "X"]
]
```

**Output:**
```
[
    ["X", "X", "X", "X"],
    ["X", "X", "X", "X"],
    ["X", "X", "X", "X"],
    ["X", "O", "X", "X"]
]
```

**Explanation:**
- The `'O'` at position (3, 1) is on the border, so it remains unchanged.
- The region of `'O'`s at positions (1, 1), (1, 2), and (2, 2) is completely surrounded by `'X'`s and gets flipped to `'X'`.

### Example 2

**Input:**
```
board = [
    ["X", "O", "X", "O", "X", "O"],
    ["O", "X", "O", "X", "O", "X"],
    ["X", "O", "X", "O", "X", "O"],
    ["O", "X", "O", "X", "O", "X"]
]
```

**Output:**
```
[
    ["X", "O", "X", "O", "X", "O"],
    ["O", "X", "X", "X", "O", "X"],
    ["X", "O", "X", "O", "X", "O"],
    ["O", "X", "O", "X", "O", "X"]
]
```

**Explanation:**
- Only the interior `'O'`s that form enclosed regions are flipped.
- Border `'O'`s and those connected to them remain unchanged.

### Example 3

**Input:**
```
board = [
    ["X", "X", "X"],
    ["X", "O", "X"],
    ["X", "X", "X"]
]
```

**Output:**
```
[
    ["X", "X", "X"],
    ["X", "X", "X"],
    ["X", "X", "X"]
]
```

**Explanation:**
- The single `'O'` at the center is completely surrounded and gets flipped to `'X'`.

---

## Constraints

- `m == board.length`
- `n == board[i].length`
- `1 <= m, n <= 200`
- `board[i][j]` is either `'X'` or `'O'`

---

## Intuition

The problem can be approached using graph traversal techniques (DFS/BFS) on the grid:

1. **Border Observation**: Any `'O'` on the border cannot be captured because it's already on the edge of the board.

2. **Connected Components**: The `'O'`s form connected components where connectivity is defined by 4-directional adjacency (up, down, left, right).

3. **Mark and Sweep Strategy**:
   - First, identify all border `'O'`s and perform a BFS/DFS from each to mark all connected `'O'`s as "safe"
   - Then, iterate through the entire board and flip any unmarked `'O'` to `'X'`

This approach is more efficient than checking each `'O'` individually to see if it's surrounded.

---

## Approach 1: BFS from Border

### Algorithm

1. **Initialize a queue** for BFS traversal.
2. **Identify border `'O'`s**: Add all `'O'`s on the first row, last row, first column, and last column to the queue.
3. **Mark visited cells**: Use a `visited` matrix or modify the board in-place (e.g., change `'O'` to `'E'` for "escaped").
4. **BFS traversal**: For each cell popped from the queue:
   - Mark it as visited/escaped
   - Add all adjacent `'O'`s (that haven't been visited) to the queue
5. **Final sweep**: Iterate through the entire board:
   - If a cell is `'O'` (not escaped), flip it to `'X'`
   - If a cell is `'E'` (escaped), flip it back to `'O'`

### Code

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        if not board or not board[0]:
            return
        
        m, n = len(board), len(board[0])
        queue = deque()
        
        # Add all border 'O's to the queue
        for i in range(m):
            for j in range(n):
                if i == 0 or i == m - 1 or j == 0 or j == n - 1:
                    if board[i][j] == 'O':
                        queue.append((i, j))
        
        # BFS to mark all 'O's connected to border
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            i, j = queue.popleft()
            board[i][j] = 'E'  # Mark as escaped
            
            for di, dj in directions:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and board[ni][nj] == 'O':
                    queue.append((ni, nj))
                    board[ni][nj] = 'E'  # Mark immediately to avoid duplicates
        
        # Final sweep: flip 'O' to 'X', 'E' back to 'O'
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    board[i][j] = 'X'
                elif board[i][j] == 'E':
                    board[i][j] = 'O'
```
<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    void solve(vector<vector<char>>& board) {
        if (board.empty() || board[0].empty()) return;
        
        int m = board.size(), n = board[0].size();
        queue<pair<int, int>> q;
        
        // Add all border 'O's to the queue
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 || i == m - 1 || j == 0 || j == n - 1) {
                    if (board[i][j] == 'O') {
                        q.push({i, j});
                    }
                }
            }
        }
        
        // BFS to mark all 'O's connected to border
        vector<int> dirs = {1, 0, -1, 0, 1};
        while (!q.empty()) {
            auto [i, j] = q.front();
            q.pop();
            board[i][j] = 'E';  // Mark as escaped
            
            for (int d = 0; d < 4; d++) {
                int ni = i + dirs[d], nj = j + dirs[d + 1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] == 'O') {
                    q.push({ni, nj});
                    board[ni][nj] = 'E';
                }
            }
        }
        
        // Final sweep
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == 'E') board[i][j] = 'O';
            }
        }
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public void solve(char[][] board) {
        if (board == null || board.length == 0 || board[0].length == 0) return;
        
        int m = board.length, n = board[0].length;
        Queue<int[]> q = new LinkedList<>();
        
        // Add all border 'O's to the queue
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 || i == m - 1 || j == 0 || j == n - 1) {
                    if (board[i][j] == 'O') {
                        q.offer(new int[]{i, j});
                    }
                }
            }
        }
        
        // BFS to mark all 'O's connected to border
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int i = cell[0], j = cell[1];
            board[i][j] = 'E';  // Mark as escaped
            
            for (int[] dir : dirs) {
                int ni = i + dir[0], nj = j + dir[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] == 'O') {
                    q.offer(new int[]{ni, nj});
                    board[ni][nj] = 'E';
                }
            }
        }
        
        // Final sweep
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == 'E') board[i][j] = 'O';
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function(board) {
    if (!board || !board.length || !board[0].length) return;
    
    const m = board.length, n = board[0].length;
    const q = [];
    let front = 0;
    
    // Add all border 'O's to the queue
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 || i === m - 1 || j === 0 || j === n - 1) {
                if (board[i][j] === 'O') {
                    q.push([i, j]);
                }
            }
        }
    }
    
    // BFS to mark all 'O's connected to border
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (front < q.length) {
        const [i, j] = q[front++];
        board[i][j] = 'E';  // Mark as escaped
        
        for (const [di, dj] of dirs) {
            const ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] === 'O') {
                q.push([ni, nj]);
                board[ni][nj] = 'E';
            }
        }
    }
    
    // Final sweep
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 'O') board[i][j] = 'X';
            else if (board[i][j] === 'E') board[i][j] = 'O';
        }
    }
};
```
````

---

## Approach 2: DFS from Border (Recursive)

### Algorithm

1. **Identify border `'O'`s**: Similar to BFS, find all `'O'`s on the border.
2. **DFS traversal**: For each border `'O'`, perform DFS recursively to mark all connected `'O'`s as "safe".
3. **Final sweep**: Same as BFS - flip remaining `'O'`s to `'X'` and restore "safe" cells.

### Code

````carousel
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
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != 'O':
                return
            board[i][j] = 'E'  # Mark as escaped
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        
        # Start DFS from all border 'O's
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
        
        # Final sweep
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    board[i][j] = 'X'
                elif board[i][j] == 'E':
                    board[i][j] = 'O'
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
private:
    void dfs(vector<vector<char>>& board, int i, int j) {
        int m = board.size(), n = board[0].size();
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != 'O') return;
        board[i][j] = 'E';  // Mark as escaped
        dfs(board, i + 1, j);
        dfs(board, i - 1, j);
        dfs(board, i, j + 1);
        dfs(board, i, j - 1);
    }
    
public:
    void solve(vector<vector<char>>& board) {
        if (board.empty() || board[0].empty()) return;
        
        int m = board.size(), n = board[0].size();
        
        // Start DFS from all border 'O's
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') dfs(board, i, 0);
            if (board[i][n - 1] == 'O') dfs(board, i, n - 1);
        }
        
        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') dfs(board, 0, j);
            if (board[m - 1][j] == 'O') dfs(board, m - 1, j);
        }
        
        // Final sweep
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == 'E') board[i][j] = 'O';
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    private void dfs(char[][] board, int i, int j) {
        int m = board.length, n = board[0].length;
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != 'O') return;
        board[i][j] = 'E';  // Mark as escaped
        dfs(board, i + 1, j);
        dfs(board, i - 1, j);
        dfs(board, i, j + 1);
        dfs(board, i, j - 1);
    }
    
    public void solve(char[][] board) {
        if (board == null || board.length == 0 || board[0].length == 0) return;
        
        int m = board.length, n = board[0].length;
        
        // Start DFS from all border 'O's
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') dfs(board, i, 0);
            if (board[i][n - 1] == 'O') dfs(board, i, n - 1);
        }
        
        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') dfs(board, 0, j);
            if (board[m - 1][j] == 'O') dfs(board, m - 1, j);
        }
        
        // Final sweep
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == 'E') board[i][j] = 'O';
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function(board) {
    if (!board || !board.length || !board[0].length) return;
    
    const m = board.length, n = board[0].length;
    
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== 'O') return;
        board[i][j] = 'E';  // Mark as escaped
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    };
    
    // Start DFS from all border 'O's
    for (let i = 0; i < m; i++) {
        if (board[i][0] === 'O') dfs(i, 0);
        if (board[i][n - 1] === 'O') dfs(i, n - 1);
    }
    
    for (let j = 0; j < n; j++) {
        if (board[0][j] === 'O') dfs(0, j);
        if (board[m - 1][j] === 'O') dfs(m - 1, j);
    }
    
    // Final sweep
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 'O') board[i][j] = 'X';
            else if (board[i][j] === 'E') board[i][j] = 'O';
        }
    }
};
```
````

---

## Approach 3: Union-Find (Disjoint Set Union)

### Algorithm

1. **Create Union-Find structure**: Each cell is a node in the DSU.
2. **Add dummy border node**: Create a special "dummy" node representing the border.
3. **Union border `'O'`s**: Union all border `'O'`s with the dummy node.
4. **Union interior `'O'`s**: For each interior `'O'`, union it with adjacent `'O'`s.
5. **Check connectivity**: After processing, if an `'O'` is not connected to the dummy node, it should be flipped to `'X'`.

### Code

````carousel
```python
from typing import List

class UnionFind:
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        if not board or not board[0]:
            return
        
        m, n = len(board), len(board[0])
        uf = UnionFind(m * n + 1)  # +1 for dummy border node
        dummy = m * n  # Index for dummy node
        
        def get_index(i, j):
            return i * n + j
        
        # Union all border 'O's with dummy
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    if i == 0 or i == m - 1 or j == 0 or j == n - 1:
                        uf.union(get_index(i, j), dummy)
                    # Union with adjacent 'O's
                    if i > 0 and board[i - 1][j] == 'O':
                        uf.union(get_index(i, j), get_index(i - 1, j))
                    if j > 0 and board[i][j - 1] == 'O':
                        uf.union(get_index(i, j), get_index(i, j - 1))
        
        # Flip 'O's not connected to dummy
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O' and uf.find(get_index(i, j)) != uf.find(dummy):
                    board[i][j] = 'X'
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int size) : parent(size), rank(size, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
    }
};

class Solution {
public:
    void solve(vector<vector<char>>& board) {
        if (board.empty() || board[0].empty()) return;
        
        int m = board.size(), n = board[0].size();
        UnionFind uf(m * n + 1);
        int dummy = m * n;
        
        auto idx = [n](int i, int j) { return i * n + j; };
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] != 'O') continue;
                
                if (i == 0 || i == m - 1 || j == 0 || j == n - 1) {
                    uf.unite(idx(i, j), dummy);
                }
                if (i > 0 && board[i - 1][j] == 'O') {
                    uf.unite(idx(i, j), idx(i - 1, j));
                }
                if (j > 0 && board[i][j - 1] == 'O') {
                    uf.unite(idx(i, j), idx(i, j - 1));
                }
            }
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O' && uf.find(idx(i, j)) != uf.find(dummy)) {
                    board[i][j] = 'X';
                }
            }
        }
    }
};
```
<!-- slide -->
```java
class UnionFind {
    int[] parent, rank;
    
    UnionFind(int size) {
        parent = new int[size];
        rank = new int[size];
        for (int i = 0; i < size; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) {
            int temp = px;
            px = py;
            py = temp;
        }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
    }
}

class Solution {
    public void solve(char[][] board) {
        if (board == null || board.length == 0 || board[0].length == 0) return;
        
        int m = board.length, n = board[0].length;
        UnionFind uf = new UnionFind(m * n + 1);
        int dummy = m * n;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] != 'O') continue;
                
                int idx = i * n + j;
                if (i == 0 || i == m - 1 || j == 0 || j == n - 1) {
                    uf.union(idx, dummy);
                }
                if (i > 0 && board[i - 1][j] == 'O') {
                    uf.union(idx, (i - 1) * n + j);
                }
                if (j > 0 && board[i][j - 1] == 'O') {
                    uf.union(idx, i * n + (j - 1));
                }
            }
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O' && uf.find(i * n + j) != uf.find(dummy)) {
                    board[i][j] = 'X';
                }
            }
        }
    }
}
```
<!-- slide -->
```javascript
class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = new Array(size).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const px = this.find(x), py = this.find(y);
        if (px === py) return;
        if (this.rank[px] < this.rank[py]) {
            this.parent[px] = py;
        } else if (this.rank[px] > this.rank[py]) {
            this.parent[py] = px;
        } else {
            this.parent[py] = px;
            this.rank[px]++;
        }
    }
}

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function(board) {
    if (!board || !board.length || !board[0].length) return;
    
    const m = board.length, n = board[0].length;
    const uf = new UnionFind(m * n + 1);
    const dummy = m * n;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] !== 'O') continue;
            
            const idx = i * n + j;
            if (i === 0 || i === m - 1 || j === 0 || j === n - 1) {
                uf.union(idx, dummy);
            }
            if (i > 0 && board[i - 1][j] === 'O') {
                uf.union(idx, (i - 1) * n + j);
            }
            if (j > 0 && board[i][j - 1] === 'O') {
                uf.union(idx, i * n + (j - 1));
            }
        }
    }
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 'O' && uf.find(i * n + j) !== uf.find(dummy)) {
                board[i][j] = 'X';
            }
        }
    }
};
```
````

---

## Complexity Analysis

### Approach 1: BFS from Border

| Complexity | Analysis |
|------------|----------|
| **Time** | O(m × n) - Each cell is visited at most once during BFS, and the final sweep visits all cells |
| **Space** | O(m × n) - Queue can contain up to all cells in worst case (when all cells are 'O') |

### Approach 2: DFS from Border

| Complexity | Analysis |
|------------|----------|
| **Time** | O(m × n) - Each cell is visited at most once during DFS |
| **Space** | O(m × n) - Recursion stack can contain up to all cells in worst case (when all cells are 'O') |

### Approach 3: Union-Find

| Complexity | Analysis |
|------------|----------|
| **Time** | O(m × n × α(m × n)) - Almost linear due to amortized constant-time operations in Union-Find |
| **Space** | O(m × n) - Union-Find arrays store parent and rank for each cell |

### Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **BFS** | No recursion depth issues, iterative | Uses queue with O(m × n) space |
| **DFS (Recursive)** | Simple, elegant | Stack overflow risk for large grids |
| **Union-Find** | Good for multiple queries, efficient | More complex implementation |

---

## Related Problems

| Problem | Difficulty | Similarity |
|---------|------------|------------|
| [Number of Islands](/solutions/number-of-islands.md) | Medium | Island counting via DFS/BFS |
| [Number of Enclaves](/solutions/number-of-enclaves.md) | Medium | Count cells not connected to border |
| [Rotting Oranges](/solutions/rotting-oranges.md) | Medium | BFS on grid, similar traversal pattern |
| [Flood Fill](/solutions/flood-fill.md) | Easy | DFS/BFS on grid for region modification |
| [Pacific Atlantic Water Flow](/solutions/pacific-atlantic-water-flow.md) | Medium | Multiple source BFS from borders |

---

## Video Tutorials

1. **[NeetCode - Surrounded Regions](https://www.youtube.com/watch?v=cbDph9k44KY)** - Clear explanation with BFS approach
2. **[Back to Back SWE - Surrounded Regions](https://www.youtube.com/watch?v=H2-fuO8LhL4)** - Detailed DFS solution walkthrough
3. **[Fraz - LeetCode 130](https://www.youtube.com/watch?v=hmm8jklzNm0)** - Comprehensive explanation of multiple approaches

---

## Follow-up Questions

### Q1: How would you modify the solution if diagonal connections also count as connected?

**Answer:** Change the directions array to include 8 directions instead of 4: `[(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]`. This would mean cells connected diagonally to the border would also be considered "safe" from being captured.

### Q2: What if the grid contains multiple character types (e.g., 'X', 'O', 'A')?

**Answer:** The algorithm would need to be extended to handle multiple character types. One approach is to treat 'A' as another "safe" character that should not be flipped, or implement a more general solution that only flips cells of a specified target character.

### Q3: How would you count the number of regions that get captured?

**Answer:** Before performing the final sweep (flipping 'O' to 'X'), count the number of connected components of 'O' that are not connected to the border. Each such component represents one captured region. You can use Union-Find or run BFS/DFS on the remaining 'O's after marking border-connected ones.

### Q4: Can this problem be solved without modifying the board in-place?

**Answer:** Yes, you can use a separate `visited` matrix to track which cells are connected to the border instead of modifying the board in-place. After marking all border-connected cells, iterate through the original board to determine which cells should be flipped.

### Q5: What is the minimum number of moves to capture a specific region?

**Answer:** This becomes a different problem - finding the minimum path between the region and the border. You could use BFS from all border cells simultaneously (multi-source BFS) to find the shortest distance to any cell, then calculate the minimum for cells in the target region.
