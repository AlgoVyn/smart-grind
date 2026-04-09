## Graph DFS - Connected Components: Forms

What are the different variations of DFS connected components?

<!-- front -->

---

### Form 1: Recursive Island Count

```python
def num_islands_dfs(grid):
    """DFS island counting."""
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)
    return count
```

---

### Form 2: Iterative DFS

```python
def num_islands_iterative(grid):
    """Iterative DFS with stack."""
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    count = 0
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                stack = [(i, j)]
                grid[i][j] = '0'
                while stack:
                    r, c = stack.pop()
                    for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            stack.append((nr, nc))
    return count
```

---

### Form 3: Graph Components

```python
def count_components_dfs(n, edges):
    """DFS for graph components."""
    from collections import defaultdict
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    
    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    
    count = 0
    for i in range(n):
        if i not in visited:
            count += 1
            dfs(i)
    return count
```

---

### Form Comparison

| Form | Implementation | Risk | Use When |
|------|----------------|------|----------|
| Recursive | Clean | Stack overflow | Standard |
| Iterative | Stack | None | Large inputs |
| Graph | Adjacency list | Recursion | General graphs |

<!-- back -->
