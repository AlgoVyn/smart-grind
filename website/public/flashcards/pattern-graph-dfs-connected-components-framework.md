## Graph DFS - Connected Components: Framework

What is the complete code template for DFS connected components?

<!-- front -->

---

### Framework 1: DFS Island Counting

```
┌─────────────────────────────────────────────────────┐
│  DFS CONNECTED COMPONENTS - TEMPLATE                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize visited set or modify grid in-place    │
│     count = 0                                          │
│                                                        │
│  2. For each cell/node:                              │
│     If not visited and is land/node:                 │
│        count += 1                                      │
│        DFS to mark all connected as visited           │
│                                                        │
│  3. DFS(cell/node):                                   │
│     Mark as visited                                   │
│     For each neighbor:                                │
│        If not visited and valid:                      │
│           DFS(neighbor)                               │
│                                                        │
│  4. Return count                                       │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Island Count (DFS)

```python
def num_islands_dfs(grid):
    """
    Count islands using DFS.
    LeetCode 200
    Time: O(m×n), Space: O(m×n) recursion
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == '0':
            return
        grid[r][c] = '0'  # Mark as visited
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)
    
    return count
```

---

### Key Pattern Elements

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Implementation** | Recursive | Iterative |
| **Space** | O(depth) stack | O(width) queue |
| **Stack overflow risk** | Yes (deep) | No |
| **Code length** | Shorter | Longer |

**Winner**: DFS for cleaner code, BFS for deep graphs

<!-- back -->
