## Graph DFS - Connected Components / Island Counting: Core Concepts

What are the fundamental concepts behind connected components and island counting?

<!-- front -->

---

### The Core Insight

**Every unvisited land cell = New island/component**

The key realization is that connected components are disjoint sets. Once you start DFS from any unvisited node/land cell, you will discover ALL nodes connected to it (the entire component). Marking them as visited ensures you won't count the same component again.

```
Initial Grid:          After DFS at (0,0):
1 1 0 0 0              0 0 0 0 0
1 1 0 0 0              0 0 0 0 0
0 0 1 0 0      →       0 0 1 0 0
0 0 0 1 1              0 0 0 1 1

Island #1 (sunk)       Islands #2 and #3 remain
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Start fresh** | Each unvisited node starts a new component | Ensures we count ALL components |
| **Flood fill** | DFS explores all reachable nodes | Captures the entire connected region |
| **Mark as visited** | Track visited to avoid double counting | Prevents infinite loops and overcounting |
| **Iterate all** | Check every node/cell | Handles disconnected graphs; no component missed |
| **Boundary check** | In grids, validate bounds first | Prevents index out of bounds errors |

---

### Connected Component Definition

A **connected component** is a subgraph where:
1. Every pair of vertices is connected by a path
2. No vertex in the component connects to vertices outside it
3. Components are disjoint (no overlap)

```
Graph with 3 components:
    1 --- 2      3 --- 4      5
    |     |                    
    6 --- 7      8
    
Component 1: {1, 2, 6, 7}
Component 2: {3, 4, 8}
Component 3: {5}
```

---

### Island vs Connected Component

| Aspect | Island (Grid) | Connected Component (Graph) |
|--------|---------------|----------------------------|
| **Domain** | 2D grid with land/water | Abstract graph with nodes/edges |
| **Adjacency** | 4-directional (up/down/left/right) | Defined by edges |
| **Land** | Cell with value '1' | Node in the graph |
| **Water** | Cell with value '0' | No direct analogy |
| **Core idea** | Same: group of connected '1's | Same: group of connected nodes |

---

### Why DFS Works

**Depth-First Search** is ideal because:

1. **Explores fully**: Visits every node in the component before returning
2. **Natural marking**: Recursion stack naturally tracks current path
3. **Simple code**: Clean recursive implementation
4. **Flood fill**: Sinks/isolates the entire island in one call

```
DFS from (1,1) explores:
    (1,1) → (1,2) → (2,2)
      ↓
    (2,1)
    
All marked visited → One island counted
```

---

### Time/Space Complexity Breakdown

| Aspect | Graph | Grid |
|--------|-------|------|
| **Time** | O(V + E) | O(m × n) |
| **Why** | Visit each vertex once, each edge once | Visit each cell once |
| **Space** | O(V) | O(m × n) or O(1) |
| **Why** | Visited array + recursion stack | Visited set OR modify in-place |

<!-- back -->
