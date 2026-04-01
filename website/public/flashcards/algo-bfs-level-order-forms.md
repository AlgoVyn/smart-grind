## BFS Level Order: Problem Forms

What are the common problem forms that use BFS level order traversal?

<!-- front -->

---

### Tree Level Order Variants

| Variant | Modification | Output |
|---------|--------------|--------|
| **Standard** | By level | [[1], [2,3], [4,5,6]] |
| **Bottom-up** | Reverse result | [[4,5,6], [2,3], [1]] |
| **Zigzag** | Alternate direction | [[1], [3,2], [4,5,6]] |
| **Right side view** | Last of each level | [1,3,6] |
| **Average of levels** | Mean per level | [1.0, 2.5, 5.0] |
| **Connect siblings** | next pointer | Linked levels |

**Zigzag implementation:**
```python
# Use deque, appendleft for even levels
# Or reverse every other level
result = []
left_to_right = True
for level in levels:
    if not left_to_right:
        level.reverse()
    result.append(level)
    left_to_right = not left_to_right
```

---

### Grid/2D BFS

**Shortest path in grid:**
```python
def grid_bfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    directions = [(0,1), (1,0), (0,-1), (-1,0)]
    
    queue = deque([(start[0], start[1], 0)])
    visited = {start}
    
    while queue:
        r, c, dist = queue.popleft()
        
        if (r, c) == end:
            return dist
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                grid[nr][nc] != '#' and (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    
    return -1  # No path
```

---

### Bidirectional BFS

Search from both start and goal:

```python
def bidirectional_bfs(graph, start, goal):
    if start == goal:
        return 0
    
    # Two queues, two visited sets
    queue1, queue2 = deque([start]), deque([goal])
    visited1, visited2 = {start: 0}, {goal: 0}
    
    while queue1 and queue2:
        # Expand smaller frontier
        if len(queue1) > len(queue2):
            queue1, queue2 = queue2, queue1
            visited1, visited2 = visited2, visited1
        
        for _ in range(len(queue1)):
            node = queue1.popleft()
            dist = visited1[node]
            
            for neighbor in graph[node]:
                if neighbor in visited2:
                    return dist + 1 + visited2[neighbor]
                if neighbor not in visited1:
                    visited1[neighbor] = dist + 1
                    queue1.append(neighbor)
    
    return -1

# Complexity: O(b^(d/2)) vs O(b^d) for standard BFS
```

---

### State-Space BFS

For problems requiring state transformation:

| Problem | State | Transitions |
|---------|-------|-------------|
| **Word ladder** | Current word | Change one letter |
| **Sliding puzzle** | Tile configuration | Move blank |
| **Water jugs** | (jug1, jug2) | Pour, fill, empty |
| **Lock puzzle** | Dial positions | Rotate dials |

**Key pattern:** State → BFS → shortest transformation sequence

---

### BFS with Weights/Delays

| Variant | Technique | Complexity |
|---------|-----------|------------|
| **0-1 weights** | Deque (0=front, 1=back) | O(V+E) |
| **Small integer weights** | Dial's algorithm | O(V+E+C) |
| **Time-dependent** | Priority queue (Dijkstra) | O(E log V) |
| **K-step jump** | Level-based with jump handling | O(V+E) |

<!-- back -->
