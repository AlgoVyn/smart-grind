## Graph BFS - Connected Components / Island Counting: Comparison

When should you use BFS vs DFS vs Union-Find for connected components?

<!-- front -->

---

### BFS vs DFS vs Union-Find

| Aspect | BFS | DFS (Recursive) | DFS (Iterative) | Union-Find |
|--------|-----|-----------------|-----------------|------------|
| **Code complexity** | Moderate | Simplest | Moderate | Simple |
| **Stack overflow** | No | Yes (risk) | No | No |
| **Shortest path** | Yes | No | No | No |
| **Space** | O(width) | O(depth) | O(depth) | O(V) |
| **Time** | O(V+E) | O(V+E) | O(V+E) | O(V + E·α(V)) |
| **Level-order** | Yes | No | No | No |

**Winner**: BFS for safety + shortest path, Union-Find for pure counting, DFS for simplicity

---

### When to Use Each Approach

**BFS - Use when:**
- Shortest path in unweighted graph needed
- Level-order traversal required
- Stack overflow is a concern (deep graphs)
- Grid problems with large dimensions
- Iterative solution preferred

**DFS Recursive - Use when:**
- Code simplicity matters
- Graph depth is manageable
- Path finding (not just counting)
- Quick interview solution acceptable

**DFS Iterative - Use when:**
- Stack overflow risk but DFS logic preferred
- Explicit stack control needed
- Combining DFS with other operations

**Union-Find - Use when:**
- Pure component counting (no traversal needed)
- Dynamic connectivity (adding edges over time)
- Very large sparse graphs
- Don't need component details

---

### Grid BFS vs Graph BFS

| Aspect | Grid BFS | Graph BFS |
|--------|----------|-----------|
| **Input** | 2D array | Adjacency list/matrix |
| **Node** | (row, col) tuple | Integer or object |
| **Neighbors** | 4 directions | graph[node] list |
| **Visited** | In-place marking or 2D array | Set or boolean array |
| **Complexity** | O(rows × cols) | O(V + E) |
| **Space** | O(min(rows, cols)) | O(V) |

**Key difference:** Grids have implicit adjacency, graphs have explicit adjacency.

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Interview coding | Recursive DFS | Fastest to write |
| Interview follow-up | BFS | Shows deeper knowledge |
| Production code | BFS | No stack overflow risk |
| Very large grid | BFS or Iterative DFS | Recursion limit |
| Shortest path needed | BFS | Unweighted shortest path |
| Component details needed | BFS or DFS | Track during traversal |
| Dynamic connectivity | Union-Find | O(α(n)) per operation |
| Huge graph, memory limited | Union-Find | Path compression saves space |

---

### Space Complexity Comparison

**For Grid (m × n):**
| Approach | Space | Worst Case |
|----------|-------|------------|
| BFS queue | O(min(m, n)) | Snake pattern fills queue |
| DFS recursion | O(m × n) | Long path through grid |
| DFS stack | O(m × n) | Same as recursion |
| Visited array | O(m × n) | 2D boolean array |
| In-place marking | O(1) | Modify input grid |

**For Graph (V vertices, E edges):**
| Approach | Space | Worst Case |
|----------|-------|------------|
| BFS queue | O(V) | Star graph (all at one level) |
| DFS recursion | O(V) | Long path/chain |
| Visited set | O(V) | All nodes visited |
| Union-Find | O(V) | Parent + rank arrays |

---

### Hybrid Approaches

**BFS + Union-Find for Making a Large Island:**
```python
def largest_island_with_one_flip(grid):
    """
    Find largest island if we can flip one 0 to 1.
    Uses both BFS (labeling) and Union-Find logic.
    """
    rows, cols = len(grid), len(grid[0])
    island_id = 2
    island_sizes = {}
    
    # Step 1: BFS to label islands and compute sizes
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                size = bfs_label(grid, i, j, island_id)
                island_sizes[island_id] = size
                island_id += 1
    
    # Step 2: Check each 0's neighbors
    max_size = max(island_sizes.values()) if island_sizes else 0
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 0:
                neighbor_ids = set()
                for dr, dc in directions:
                    ni, nj = i + dr, j + dc
                    if 0 <= ni < rows and 0 <= nj < cols and grid[ni][nj] > 1:
                        neighbor_ids.add(grid[ni][nj])
                
                # Calculate merged size
                merged = 1  # The flipped cell
                for nid in neighbor_ids:
                    merged += island_sizes[nid]
                max_size = max(max_size, merged)
    
    return max_size
```

<!-- back -->
