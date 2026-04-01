## A* Search: Problem Forms

What are the different problem forms and variations of A* search across various domains?

<!-- front -->

---

### Standard Shortest Path

**Input:** Graph with weighted edges, start, goal  
**Output:** Shortest path and its cost

```python
# Standard form - grid pathfinding
def heuristic_grid(a, b):
    # Manhattan distance for 4-directional movement
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def heuristic_euclidean(a, b):
    # Euclidean for any-angle movement
    return ((a[0]-b[0])**2 + (a[1]-b[1])**2) ** 0.5
```

---

### Grid-Based Variants

| Movement | Heuristic | Cost Model |
|----------|-----------|------------|
| **4-way** | Manhattan | Uniform |
| **8-way** | Chebyshev | Diagonal = √2 or 1.4 |
| **Any-angle** | Euclidean | Variable terrain costs |
| **Weighted** | Scaled heuristic | Different terrain types |

**Chebyshev distance:**
```python
def chebyshev(a, b):
    return max(abs(a[0]-b[0]), abs(a[1]-b[1]))
```

---

### Multi-Goal A*

Search for nearest of multiple goals:

```python
# Approach 1: Virtual goal with h = min(heuristic to any goal)
def multi_goal_heuristic(node, goals):
    return min(manhattan(node, g) for g in goals)

# Approach 2: Run A* from goals backward (if many queries)
# Precompute distance from all cells to all goals
```

---

### Incremental / Dynamic A*

When graph changes during search:

| Algorithm | Use Case | Complexity |
|-----------|----------|------------|
| **D* Lite** | Moving target/robot | Replan efficiently |
| **LPA*** | Edge costs change | Update only affected nodes |
| **ARA*** | Anytime A* | Trade off time vs quality |

**Key idea:** Reuse previous search results, only update changed regions

---

### Specialized Domains

| Domain | State Space | Heuristic |
|--------|-------------|-----------|
| **Sliding Puzzle** | Tile configurations | Manhattan distance of tiles |
| **Rubik's Cube** | Cube states | Pattern database |
| **Chess/Checkers** | Board positions | Material + position evaluation |
| **Route Planning** | Road network | Geographic distance |
| **Protein Folding** | Conformations | Energy estimates |
| **Planning** | World states | Relaxed problem solution |

<!-- back -->
