## Title: Union-Find - Tactics

What are practical tactics for using Union-Find in problem solving?

<!-- front -->

---

### Tactic 1: Dummy Node for Boundary

**Pattern:** Connect all boundary elements to a virtual node

```python
def solve_surrounded_regions(board):
    """Flip 'O' surrounded by 'X', keep 'O' on border"""
    if not board:
        return
    
    m, n = len(board), len(board[0])
    # Create dummy node at index m*n
    DUMMY = m * n
    uf = UnionFind(m * n + 1)
    
    # Connect all border 'O' to dummy
    for r in range(m):
        for c in [0, n-1]:
            if board[r][c] == 'O':
                uf.union(r * n + c, DUMMY)
    
    for c in range(n):
        for r in [0, m-1]:
            if board[r][c] == 'O':
                uf.union(r * n + c, DUMMY)
    
    # Connect adjacent 'O's
    for r in range(1, m-1):
        for c in range(1, n-1):
            if board[r][c] == 'O':
                for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                    if board[r+dr][c+dc] == 'O':
                        uf.union(r*n+c, (r+dr)*n+(c+dc))
    
    # Flip 'O' not connected to dummy
    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O' and not uf.connected(r*n+c, DUMMY):
                board[r][c] = 'X'
```

**Use when:** Need to distinguish "connected to boundary" vs "internal".

---

### Tactic 2: Offline Processing / Reverse Thinking

**Pattern:** Process operations in reverse for deletion problems

```python
def hit_bricks(grid, hits):
    """Count bricks that fall after each hit (reverse: add back)"""
    m, n = len(grid), len(grid[0])
    
    # Mark hits
    for r, c in hits:
        if grid[r][c] == 1:
            grid[r][c] = 2  # Mark as hit
    
    # Connect remaining bricks to top (row 0)
    DUMMY = m * n
    uf = UnionFind(m * n + 1)
    
    for c in range(n):
        if grid[0][c] == 1:
            uf.union(c, DUMMY)
    
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                for dr, dc in [(-1,0), (0,-1)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                        uf.union(r*n+c, nr*n+nc)
    
    # Process hits in reverse (adding back)
    result = []
    for r, c in reversed(hits):
        if grid[r][c] != 2:  # Was already empty
            result.append(0)
            continue
        
        # Count bricks connected to top before adding
        before = uf.get_size(DUMMY)
        
        # Add brick back
        grid[r][c] = 1
        if r == 0:
            uf.union(r*n+c, DUMMY)
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                uf.union(r*n+c, nr*n+nc)
        
        after = uf.get_size(DUMMY)
        result.append(max(0, after - before - 1))  # Exclude new brick
    
    return result[::-1]
```

---

### Tactic 3: Binary Search + Union-Find

**Pattern:** Find minimum threshold for connectivity

```python
def swim_in_water(grid):
    """Minimum time to reach bottom-right from top-left"""
    n = len(grid)
    
    # Binary search on time t
    lo, hi = 0, n * n - 1
    answer = hi
    
    while lo <= hi:
        mid = (lo + hi) // 2
        if can_reach(grid, mid):
            answer = mid
            hi = mid - 1
        else:
            lo = mid + 1
    
    return answer

def can_reach(grid, t):
    """Check if can reach bottom-right at time t using UF"""
    n = len(grid)
    uf = UnionFind(n * n)
    
    for r in range(n):
        for c in range(n):
            if grid[r][c] <= t:
                for dr, dc in [(0,1), (1,0)]:
                    nr, nc = r + dr, c + dc
                    if nr < n and nc < n and grid[nr][nc] <= t:
                        uf.union(r*n+c, nr*n+nc)
    
    return uf.connected(0, n*n-1)
```

---

### Tactic 4: Component Property Tracking

**Pattern:** Track additional data per component

```python
class UnionFindWithMinEdge(UnionFind):
    def __init__(self, n, edges):
        super().__init__(n)
        self.min_edge = [float('inf')] * n
        self.edge_list = [[] for _ in range(n)]
    
    def union(self, x, y, weight):
        px, py = self.find(x), self.find(y)
        if px == py:
            # Same component: track min edge in cycle
            self.min_edge[px] = min(self.min_edge[px], weight)
            return False
        
        # Merge: combine edge lists and update min
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        
        self.parent[py] = px
        self.min_edge[px] = min(self.min_edge[px], self.min_edge[py], weight)
        self.edge_list[px].extend(self.edge_list[py])
        self.edge_list[py] = []
        return True
```

---

### Tactic 5: Lazy Union-Find / Weighted Union

**Pattern:** Defer unions or use weighted union for specific ordering

```python
class WeightedUnionFind(UnionFind):
    """Union with priority on specific criteria"""
    
    def union_with_constraint(self, x, y, constraint):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        # Weighted union: prefer larger component
        if self.size[px] < self.size[py]:
            px, py = py, px
        
        # Check constraint before unioning
        if not constraint(px, py):
            return False
        
        self.parent[py] = px
        self.size[px] += self.size[py]
        return True

# Use case: Union only if ratio constraint satisfied
# e.g., for problems requiring balanced merges
```

<!-- back -->
