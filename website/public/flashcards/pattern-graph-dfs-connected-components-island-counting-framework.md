## Graph DFS - Connected Components / Island Counting: Framework

What is the complete code template for counting connected components/islands?

<!-- front -->

---

### Framework Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  DFS CONNECTED COMPONENTS / ISLAND COUNTING - TEMPLATE              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. INITIALIZE                                                        │
│     - visited set/array OR modify grid in-place                       │
│     - count = 0                                                       │
│                                                                     │
│  2. ITERATE through all nodes/cells:                                  │
│     For each node/cell (i, j):                                       │
│        If not visited AND is valid (land/node):                      │
│           count += 1                                                 │
│           DFS(i, j) to mark entire component as visited              │
│                                                                     │
│  3. DFS(node/cell):                                                   │
│     Mark as visited                                                  │
│     For each neighbor:                                               │
│        If valid AND not visited:                                     │
│           DFS(neighbor)                                              │
│                                                                     │
│  4. RETURN count                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Graph Connected Components

```python
def count_connected_components(n: int, edges: list[list[int]]) -> int:
    """
    Count connected components in undirected graph.
    Time: O(V + E), Space: O(V)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = [False] * n
    
    def dfs(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
    
    components = 0
    for i in range(n):
        if not visited[i]:
            dfs(i)
            components += 1
    
    return components
```

---

### Implementation: Island Counting (Grid)

```python
def num_islands(grid: list[list[str]]) -> int:
    """
    Count islands in 2D grid (in-place marking).
    Time: O(m × n), Space: O(1) extra
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        # Base case: out of bounds or water
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            grid[r][c] != '1'):
            return
        
        grid[r][c] = '0'  # Mark as visited (sink the island)
        
        # Explore 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                islands += 1
    
    return islands
```

---

### Key Framework Elements

| Component | Graph Version | Grid Version |
|-----------|---------------|--------------|
| **Input** | `n` nodes, `edges` list | `m × n` grid |
| **Build** | Adjacency list | Direct grid access |
| **Traversal** | Neighbors from graph | 4-directional (up/down/left/right) |
| **Marking** | `visited` array | In-place (`'1'` → `'0'`) or visited set |
| **Complexity** | Time: O(V + E), Space: O(V) | Time: O(m × n), Space: O(1) extra |

<!-- back -->
