## A* Search: Algorithm Framework

What is the complete A* implementation structure, and how do you handle the open/closed set efficiently?

<!-- front -->

---

### Algorithm Template

```python
import heapq

def astar(graph, start, goal, heuristic):
    """
    graph: dict of node -> [(neighbor, cost)]
    heuristic: function(node) -> estimated cost to goal
    """
    # Priority queue: (f_score, g_score, node, path)
    open_set = [(heuristic(start), 0, start, [start])]
    closed_set = set()
    
    # Track best g_score seen for each node
    g_scores = {start: 0}
    
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        
        if current == goal:
            return path, g  # Found optimal path
        
        if current in closed_set:
            continue  # Skip if already processed with better g
        
        closed_set.add(current)
        
        for neighbor, cost in graph[current]:
            new_g = g + cost
            
            if neighbor in closed_set:
                continue
            
            if neighbor not in g_scores or new_g < g_scores[neighbor]:
                g_scores[neighbor] = new_g
                f = new_g + heuristic(neighbor)
                heapq.heappush(open_set, (f, new_g, neighbor, path + [neighbor]))
    
    return None, float('inf')  # No path found
```

---

### Open vs Closed Set

| Set | Purpose | Implementation |
|-----|---------|----------------|
| **Open Set** | Nodes to explore, sorted by f | Min-heap priority queue |
| **Closed Set** | Nodes already processed | Hash set (or boolean array) |
| **G-Score Map** | Best known cost to each node | Dictionary (or array) |

**Optimization:** Use array if node IDs are dense (0..N-1)

---

### State Tracking Structures

```python
# Compact representation for grid-based A*
# Use 2D arrays instead of dicts for speed

g_score = [[inf] * cols for _ in range(rows)]
f_score = [[inf] * cols for _ in range(rows)]
visited = [[False] * cols for _ in range(rows)]
parent = [[None] * cols for _ in range(rows)]  # For path reconstruction

# Encode (row, col) as single int for heap: id = r * cols + c
```

---

### Edge Cases

| Case | Handling |
|------|----------|
| No path exists | Return None/empty, algorithm exhausts open set |
| Start == goal | Return immediately with cost 0 |
| Inadmissible heuristic | May find suboptimal path (worse than true optimal) |
| Negative edge weights | Not supported (use Bellman-Ford) |
| Tie-breaking | Use h(n) or insertion order when f values equal |

---

### Path Reconstruction

```python
# If not storing full path in heap (memory optimization)
def reconstruct_path(parent_map, start, goal):
    path = []
    current = goal
    while current != start:
        path.append(current)
        current = parent_map[current]
        if current is None:
            return None  # No valid path
    path.append(start)
    return path[::-1]
```

**Memory vs Speed tradeoff:** Store full path in heap (fast, memory-heavy) vs parent pointers (slower, memory-light)

<!-- back -->
