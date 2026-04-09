## Graph DFS - Connected Components / Island Counting: Forms

What are the different variations of connected components and island counting problems?

<!-- front -->

---

### Form 1: Basic Island Counting (Number of Islands)

Count total islands in a binary grid.

```python
def num_islands(grid):
    """LeetCode 200: Number of Islands"""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    
    return count
```

---

### Form 2: Max Area of Island

Find the size of the largest island.

```python
def max_area_of_island(grid):
    """LeetCode 695: Max Area of Island"""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return 0
        
        grid[r][c] = '0'
        return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                max_area = max(max_area, dfs(r, c))
    
    return max_area
```

---

### Form 3: Number of Provinces (Graph)

Count connected components in an adjacency matrix.

```python
def find_circle_num(is_connected):
    """LeetCode 547: Number of Provinces"""
    n = len(is_connected)
    visited = [False] * n
    provinces = 0
    
    def dfs(city):
        for neighbor in range(n):
            if is_connected[city][neighbor] == 1 and not visited[neighbor]:
                visited[neighbor] = True
                dfs(neighbor)
    
    for i in range(n):
        if not visited[i]:
            visited[i] = True
            dfs(i)
            provinces += 1
    
    return provinces
```

---

### Form 4: Surrounded Regions

Capture regions surrounded by 'X' (flip 'O' to 'X').

```python
def solve(board):
    """LeetCode 130: Surrounded Regions"""
    if not board or not board[0]:
        return
    
    m, n = len(board), len(board[0])
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != 'O':
            return
        board[r][c] = 'T'  # Temporarily mark border-connected
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    # Mark border-connected 'O's
    for i in range(m):
        dfs(i, 0)
        dfs(i, n-1)
    for j in range(n):
        dfs(0, j)
        dfs(m-1, j)
    
    # Flip remaining O's (surrounded) and restore T's
    for i in range(m):
        for j in range(n):
            if board[i][j] == 'O':
                board[i][j] = 'X'
            elif board[i][j] == 'T':
                board[i][j] = 'O'
```

---

### Form 5: Island Perimeter

Calculate the perimeter of a single island.

```python
def island_perimeter(grid):
    """LeetCode 463: Island Perimeter"""
    rows, cols = len(grid), len(grid[0])
    perimeter = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                # Each land cell contributes 4
                perimeter += 4
                # Subtract 2 for each adjacent land (shared edge)
                if r > 0 and grid[r-1][c] == 1:
                    perimeter -= 2
                if c > 0 and grid[r][c-1] == 1:
                    perimeter -= 2
    
    return perimeter
```

---

### Form 6: Count Sub Islands

Count islands in grid2 that are fully contained in grid1.

```python
def count_sub_islands(grid1, grid2):
    """LeetCode 1905: Count Sub Islands"""
    rows, cols = len(grid1), len(grid1[0])
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid2[r][c] == 0:
            return True
        
        grid2[r][c] = 0  # Mark visited
        
        # Check if this cell is land in grid1
        is_sub = grid1[r][c] == 1
        
        # All connected cells must also be sub-island
        is_sub &= dfs(r+1, c)
        is_sub &= dfs(r-1, c)
        is_sub &= dfs(r, c+1)
        is_sub &= dfs(r, c-1)
        
        return is_sub
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid2[r][c] == 1:
                if dfs(r, c):
                    count += 1
    
    return count
```

---

### Form Comparison Summary

| Form | Problem | Key Twist | Output |
|------|---------|-----------|--------|
| **Basic Count** | Number of Islands | None | Integer count |
| **Max Area** | Max Area of Island | Return area, not count | Max area |
| **Graph Matrix** | Number of Provinces | Adjacency matrix | Component count |
| **Surrounded** | Surrounded Regions | Border-connected check | Modified grid |
| **Perimeter** | Island Perimeter | Count edges, not cells | Perimeter value |
| **Sub Islands** | Count Sub Islands | Check containment in another grid | Sub-island count |

<!-- back -->
