## BFS for Shortest Path in Unweighted Graph

**Question:** Why does BFS guarantee the shortest path in an unweighted graph?

<!-- front -->

---

## BFS Shortest Path

### Why BFS Works
BFS explores nodes **level by level**. All nodes at distance `d` are visited before any node at distance `d+1`.

### Algorithm
```python
from collections import deque

def shortest_path(graph, start, end):
    if start == end:
        return 0
    
    visited = set([start])
    queue = deque([(start, 0)])
    
    while queue:
        node, dist = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor == end:
                return dist + 1
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return -1  # No path exists
```

### Key Property
```
Level 0: start
Level 1: neighbors of start
Level 2: neighbors of neighbors
...

First time we reach target → shortest path!
```

### Time & Space
- **Time:** O(V + E)
- **Space:** O(V)

### ⚠️ Important
- Must mark visited **when adding to queue** (not when popping)
- This prevents revisiting nodes already in queue

<!-- back -->
