## Number of Islands

**Question:** Count islands in 2D grid (4-directional)?

<!-- front -->

---

## Answer: DFS/BFS Flood Fill

### Solution: DFS
```python
def numIslands(grid):
    if not grid:
        return 0
    
    count = 0
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        # Bounds and visited check
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] == '0':
            return
        
        # Mark as visited
        grid[r][c] = '0'
        
        # Visit all 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    
    return count
```

### Solution: BFS
```python
from collections import deque

def numIslandsBFS(grid):
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                grid[r][c] = '0'
                
                queue = deque([(r, c)])
                while queue:
                    cr, cc = queue.popleft()
                    for dr, dc in directions:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < rows and 0 <= nc < cols:
                            if grid[nr][nc] == '1':
                                grid[nr][nc] = '0'
                                queue.append((nr, nc))
    
    return count
```

### Visual: Flood Fill
```
Grid:
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1

Step 1: (0,0) → mark connected '1's → island 1
Step 2: (2,2) → mark connected '1's → island 2  
Step 3: (3,3) → mark connected '1's → island 3

Count = 3
```

### ⚠️ Tricky Parts

#### 1. Marking Visited
```python
# Must mark as '0' during traversal
# Don't just skip - would double count

# Modifies grid in-place
# Works because we only need to count once
```

#### 2. Why Not Keep Separate Visited
```python
# Can use visited set
# But modifying grid is simpler and O(1)

# BFS needs explicit queue
# DFS can use recursion (watch stack depth)
```

#### 3. Union-Find Approach
```python
class UnionFind:
    def __init__(self, grid):
        self.rows = len(grid)
        self.cols = len(grid[0])
        self.parent = [-1] * (self.rows * self.cols)
        
        for r in range(self.rows):
            for c in range(self.cols):
                if grid[r][c] == '1':
                    idx = r * self.cols + c
                    self.parent[idx] = idx
    
    def find(self, i):
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
    
    def union(self, i, j):
        root_i, root_j = self.find(i), self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j
            return True
        return False

def numIslandsUF(grid):
    if not grid:
        return 0
    
    uf = UnionFind(grid)
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    
    for r in range(uf.rows):
        for c in range(uf.cols):
            if grid[r][c] == '1':
                idx = r * uf.cols + c
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < uf.rows and 0 <= nc < uf.cols:
                        if grid[nr][nc] == '1':
                            uf.union(idx, nr * uf.cols + nc)
    
    # Count unique roots
    roots = set()
    for r in range(uf.rows):
        for c in range(uf.cols):
            if grid[r][c] == '1':
                roots.add(uf.find(r * uf.cols + c))
    
    return len(roots)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS | O(m×n) | O(m×n) worst |
| BFS | O(m×n) | O(min(m,n)) |
| Union-Find | O(m×n × α) | O(m×n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not marking visited | Set to '0' in traversal |
| Wrong bounds | Check before accessing |
| Missing directions | Use all 4 directions |

<!-- back -->
