## BFS Level Order: Core Concepts

What is BFS level order traversal, how does it differ from DFS, and what problems does it solve?

<!-- front -->

---

### Fundamental Definition

BFS (Breadth-First Search) explores nodes **level by level**, visiting all nodes at distance k before any at distance k+1.

**Key properties:**
- Shortest path in unweighted graphs
- Level order reveals distance from source
- Queue-based: FIFO ordering

```
Level 0: S
Level 1: A, B, C
Level 2: D, E, F
Level 3: G (goal)
```

---

### BFS vs DFS

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Data structure** | Queue | Stack (or recursion) |
| **Order** | Level by level | Deep first, then backtrack |
| **Shortest path** | Yes (unweighted) | No |
| **Memory** | O(width) | O(depth) |
| **Complete** | Yes (finite graph) | Yes (finite, no infinite loops) |
| **Use for** | Shortest paths, level properties | Topological sort, cycles |

---

### Level Order Structure

```python
def bfs_level_order(graph, start):
    visited = {start}
    queue = deque([(start, 0)])  # (node, level)
    levels = defaultdict(list)
    
    while queue:
        node, level = queue.popleft()
        levels[level].append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, level + 1))
    
    return levels  # levels[0], levels[1], ...
```

---

### Applications

| Problem | How BFS Helps |
|---------|---------------|
| **Shortest path** | First visit = shortest distance |
| **Level order tree print** | Process nodes by depth |
| **Minimum steps** | Each edge = one step |
| **Bipartite check** | Alternate colors per level |
| **Word ladder** | Transformations as edges |
| **Rotting oranges** | Time steps = levels |

---

### When to Use

| ✅ Use BFS | ❌ Don't Use BFS |
|-----------|------------------|
| Shortest path in unweighted graph | Weighted graph (use Dijkstra) |
| Find minimum operations | Need all paths |
| Explore by distance from source | Memory is severely constrained |
| Level-based processing | Deep trees (stack overflow risk in recursive DFS) |

<!-- back -->
