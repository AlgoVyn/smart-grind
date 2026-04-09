## Union-Find (Disjoint Set Union - DSU): Tactics

What are practical tactics for using Union-Find in problem solving?

<!-- front -->

---

### Tactic 1: Dummy Node for Boundary Connectivity

**Pattern:** Connect all boundary elements to a virtual node to distinguish "connected to boundary" vs "internal".

```python
def solve_surrounded_regions(board):
    """Flip 'O' surrounded by 'X', keep 'O' on border."""
    if not board:
        return
    
    m, n = len(board), len(board[0])
    DUMMY = m * n  # Virtual node index
    uf = UnionFind(m * n + 1)
    
    # Connect all border 'O' to dummy node
    for r in range(m):
        for c in [0, n-1]:  # Left and right borders
            if board[r][c] == 'O':
                uf.union(r * n + c, DUMMY)
    
    for c in range(n):
        for r in [0, m-1]:  # Top and bottom borders
            if board[r][c] == 'O':
                uf.union(r * n + c, DUMMY)
    
    # Connect adjacent 'O's
    for r in range(1, m-1):
        for c in range(1, n-1):
            if board[r][c] == 'O':
                for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                    if board[r+dr][c+dc] == 'O':
                        uf.union(r*n+c, (r+dr)*n+(c+dc))
    
    # Flip 'O' not connected to dummy (surrounded regions)
    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O' and not uf.connected(r*n+c, DUMMY):
                board[r][c] = 'X'
```

**Use when:** Need to mark regions based on boundary connectivity.

---

### Tactic 2: 2D Grid to 1D Index Conversion

**Pattern:** Convert (row, col) to single index: `index = row * cols + col`

```python
def num_islands_uf(grid):
    """Count islands using Union-Find."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    
    # Union adjacent land cells
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                # Convert to 1D index
                idx = r * cols + c
                
                # Check right and down neighbors only (avoid duplicate unions)
                for dr, dc in [(0, 1), (1, 0)]:
                    nr, nc = r + dr, c + dc
                    if nr < rows and nc < cols and grid[nr][nc] == '1':
                        nidx = nr * cols + nc
                        uf.union(idx, nidx)
    
    # Count unique roots for all land cells
    roots = set()
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                roots.add(uf.find(r * cols + c))
    
    return len(roots)
```

**Key points:**
- Use only right/down neighbors to avoid processing each edge twice
- Index formula: `row * num_cols + col`
- Inverse: `row = index // cols`, `col = index % cols`

---

### Tactic 3: Reverse/Offline Processing

**Pattern:** Process operations in reverse for deletion problems (easier to add than remove).

```python
def hit_bricks(grid, hits):
    """Bricks Falling When Hit - process hits in reverse."""
    m, n = len(grid), len(grid[0])
    DUMMY = m * n
    
    # Mark all hit positions
    for r, c in hits:
        if grid[r][c] == 1:
            grid[r][c] = 2  # Mark as "will be hit"
    
    # Initialize UF with remaining bricks
    uf = UnionFind(m * n + 1)
    
    # Connect top row bricks to dummy
    for c in range(n):
        if grid[0][c] == 1:
            uf.union(c, DUMMY)
    
    # Union remaining adjacent bricks
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                for dr, dc in [(-1,0), (0,-1)]:  # Up and left (avoid dup)
                    nr, nc = r + dr, c + dc
                    if nr >= 0 and nc >= 0 and grid[nr][nc] == 1:
                        uf.union(r*n+c, nr*n+nc)
    
    # Process hits in reverse (adding bricks back)
    result = []
    for r, c in reversed(hits):
        if grid[r][c] != 2:  # Was already empty
            result.append(0)
            continue
        
        before = uf.get_size(DUMMY)  # Bricks connected to top
        
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

### Tactic 4: Union-Find with Component Size Tracking

**Pattern:** Track additional data like component size for size-based queries.

```python
class UnionFindWithSize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n
        self.max_size = 1  # Track largest component
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Attach smaller to larger
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.max_size = max(self.max_size, self.size[root_x])
        self.count -= 1
        return True
    
    def get_component_size(self, x):
        return self.size[self.find(x)]
    
    def get_max_component_size(self):
        return self.max_size


# Use case: Largest component after each union
largest_component_after_merge(n, edges):
    uf = UnionFindWithSize(n)
    result = []
    for u, v in edges:
        uf.union(u, v)
        result.append(uf.get_max_component_size())
    return result
```

---

### Tactic 5: Mapping Non-Integer Elements to Indices

**Pattern:** Use hash map to map arbitrary elements (strings, coordinates) to integer indices.

```python
def accounts_merge(accounts):
    """Merge accounts by common emails using Union-Find."""
    email_to_id = {}
    email_to_name = {}
    
    # Assign ID to each unique email
    id_counter = 0
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            email_to_name[email] = name
            if email not in email_to_id:
                email_to_id[email] = id_counter
                id_counter += 1
    
    # Union all emails in the same account
    uf = UnionFind(id_counter)
    for account in accounts:
        first_email = account[1]
        for email in account[2:]:
            uf.union(email_to_id[first_email], email_to_id[email])
    
    # Group by root
    from collections import defaultdict
    root_to_emails = defaultdict(list)
    for email, id in email_to_id.items():
        root = uf.find(id)
        root_to_emails[root].append(email)
    
    # Format result
    result = []
    for emails in root_to_emails.values():
        name = email_to_name[emails[0]]
        result.append([name] + sorted(emails))
    
    return result
```

**Use when:** Elements are strings, tuples, or other non-integer types.

---

### Tactic 6: Kruskal's MST with Union-Find

**Pattern:** Sort edges by weight, use Union-Find to build MST greedily.

```python
def kruskals_mst(n, edges):
    """
    Find Minimum Spanning Tree using Kruskal's algorithm.
    edges: [(weight, u, v), ...]
    """
    # Sort edges by weight
    edges.sort()  # Sorts by weight (first element)
    
    uf = UnionFind(n)
    mst_weight = 0
    mst_edges = []
    
    for weight, u, v in edges:
        if not uf.connected(u, v):  # No cycle formed
            uf.union(u, v)
            mst_weight += weight
            mst_edges.append((u, v))
            
            if len(mst_edges) == n - 1:  # MST complete
                break
    
    return mst_weight, mst_edges
```

**Key insight:** Union-Find efficiently checks for cycles when adding edges.

---

### Tactic 7: Union-Find with Rollback (for Backtracking)

**Pattern:** Save state before union to support undo operations.

```python
class UnionFindWithRollback:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.changes = []  # Stack of changes for rollback
    
    def find(self, x):
        if self.parent[x] != x:
            return self.find(self.parent[x])  # No compression (for rollback)
        return x
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            self.changes.append(None)  # Mark: no change
            return False
        
        # Ensure root_x has higher rank
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        
        # Save change for rollback
        self.changes.append((root_y, self.parent[root_y], root_x, self.rank[root_x]))
        
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True
    
    def rollback(self):
        change = self.changes.pop()
        if change is None:
            return
        
        root_y, old_parent, root_x, old_rank = change
        self.parent[root_y] = old_parent
        self.rank[root_x] = old_rank
```

**Use when:** Need to explore different union sequences (e.g., in backtracking).

<!-- back -->
