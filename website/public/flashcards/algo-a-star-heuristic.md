## A* Search - Admissible Heuristic

**Question:** What makes a heuristic admissible and why is it critical for A*?

<!-- front -->

---

## A* Algorithm

### The Formula
```
f(n) = g(n) + h(n)
```

- `g(n)` = cost from start to current node
- `h(n)` = estimated cost from current node to goal
- `f(n)` = estimated total cost through node n

### Admissible Heuristic
**Definition:** `h(n)` never overestimates the true cost to reach the goal.

```
h(n) ≤ actual_cost(n, goal)
```

### Why Admissibility Matters
- If h is **admissible**: A* finds **optimal** solution
- If h is **not admissible**: May find suboptimal path

### Implementation
```python
import heapq

def a_star(graph, start, goal, h):
    # h is heuristic function
    f_score = {start: h(start, goal)}
    g_score = {start: 0}
    came_from = {}
    open_set = [(f_score[start], start)]
    
    while open_set:
        _, current = heapq.heappop(open_set)
        
        if current == goal:
            return reconstruct_path(came_from, current)
        
        for neighbor, cost in graph[current]:
            tentative_g = g_score[current] + cost
            
            if tentative_g < g_score.get(neighbor, float("inf")):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + h(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))
    
    return None
```

### 💡 Common Heuristics
- Manhattan distance (grid)
- Euclidean distance
- Straight-line distance

<!-- back -->
