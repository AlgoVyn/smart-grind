## Graph - Bidirectional BFS: Framework

What is the complete code template for bidirectional BFS from source and target?

<!-- front -->

---

### Framework 1: Bidirectional BFS Template

```
┌─────────────────────────────────────────────────────┐
│  BIDIRECTIONAL BFS - TEMPLATE                          │
├─────────────────────────────────────────────────────┤
│  1. Initialize two frontiers:                          │
│     - frontier_start: set with start node              │
│     - frontier_end: set with end node                  │
│                                                        │
│  2. Initialize parent maps:                           │
│     - parents_start: {start: None}                     │
│     - parents_end: {end: None}                         │
│                                                        │
│  3. While both frontiers not empty:                    │
│     a. Expand smaller frontier for efficiency          │
│     b. For each node in frontier:                      │
│        - Get all valid neighbors                       │
│        - If neighbor in other frontier:                │
│            PATH FOUND! Reconstruct and return           │
│        - Add neighbor to next_level                    │
│        - Record parent relationship                      │
│     c. Update frontier = next_level                    │
│                                                        │
│  4. If no intersection: return None (no path)         │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Bidirectional BFS

```python
from collections import deque

def bidirectional_bfs(graph, start, end):
    """
    Find shortest path using bidirectional BFS.
    Time: O(b^(d/2)), Space: O(b^(d/2))
    """
    if start == end:
        return [start]
    
    # Frontiers: current level of nodes from each side
    frontiers = [set([start]), set([end])]
    # Parents for path reconstruction
    parents = [{start: None}, {end: None}]
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller frontier for efficiency
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
            parents.reverse()
        
        next_level = set()
        
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in parents[0]:
                    continue  # Already visited from this side
                
                # Check if neighbor is in other frontier
                if neighbor in frontiers[1]:
                    return reconstruct_path(neighbor, parents)
                
                parents[0][neighbor] = node
                next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return None  # No path found

def reconstruct_path(meeting_node, parents):
    """Reconstruct path from start to end through meeting node."""
    # Path from start to meeting node
    path_start = []
    node = meeting_node
    while node is not None:
        path_start.append(node)
        node = parents[0][node]
    path_start.reverse()
    
    # Path from meeting node to end
    path_end = []
    node = parents[1][meeting_node]
    while node is not None:
        path_end.append(node)
        node = parents[1][node]
    
    return path_start + path_end
```

---

### Key Insight

```
Standard BFS: O(b^d) - explores from one end
Bidirectional: O(2 × b^(d/2)) = O(b^(d/2)) - meets in middle

Example with b=10, d=6:
Standard: 10^6 = 1,000,000 nodes
Bidirectional: 2 × 10^3 = 2,000 nodes
500x faster!
```

---

### Key Pattern Elements

| Element | Purpose | Optimization |
|---------|---------|--------------|
| `frontiers[0]` | Nodes from start | Set for O(1) lookup |
| `frontiers[1]` | Nodes from end | Set for O(1) lookup |
| `parents` | Path reconstruction | Track where we came from |
| Smaller first | Efficiency | Reduces exploration |
| Intersection check | Early termination | Stop when paths meet |

<!-- back -->
