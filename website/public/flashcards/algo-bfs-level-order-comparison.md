## BFS Level Order: Comparison Guide

How does BFS compare to other search and traversal algorithms?

<!-- front -->

---

### Traversal Algorithm Comparison

| Algorithm | Order | Memory | Shortest Path | Use For |
|-----------|-------|--------|---------------|---------|
| **BFS** | Level by level | O(width) | Yes (unweighted) | Shortest paths, levels |
| **DFS (iterative)** | Depth-first | O(depth) | No | Topological sort, connectivity |
| **DFS (recursive)** | Depth-first | O(depth) | No | Tree problems, simplicity |
| **IDDFS** | Level then depth | O(depth) | Yes | Memory constrained |
| **Dijkstra** | By distance | O(V) | Yes (weighted) | Weighted shortest path |
| **A*** | Heuristic guided | O(V) | Yes (heuristic) | Large graphs with goal |

---

### BFS vs DFS for Trees

| Scenario | BFS | DFS |
|----------|-----|-----|
| **Find height** | Natural level count | Track depth parameter |
| **Find node by depth** | Direct | With depth limit |
| **Serialize tree** | Level order | Pre/in/post order |
| **Memory usage** | O(max width) | O(height) |
| **Balanced tree** | Efficient | Efficient |
| **Skewed tree** | 2 nodes in queue | O(n) recursion stack |

**Rule:** Prefer BFS for level-based properties, DFS for path-based properties.

---

### BFS vs Dijkstra

| Aspect | BFS | Dijkstra |
|--------|-----|----------|
| **Edge weights** | All equal (or 0/1 with 0-1 BFS) | Any non-negative |
| **Data structure** | Queue (FIFO) | Priority queue |
| **Time** | O(V+E) | O((V+E) log V) |
| **Use when** | Unweighted graph | Weighted graph |

**Key insight:** BFS is Dijkstra with uniform edge weights.

---

### When to Use Each Search

| Problem | Algorithm |
|---------|-----------|
| Shortest path, unweighted | BFS |
| Shortest path, weighted positive | Dijkstra |
| Shortest path, weighted negative | Bellman-Ford |
| All-pairs shortest paths | Floyd-Warshall / Johnson's |
| Find any path | DFS |
| Find minimum operations | BFS |
| Game playing, adversarial | Minimax / Alpha-Beta |
| Heuristic pathfinding | A* |
| Topological ordering | DFS |

---

### Complexity Summary

| Graph | BFS Time | BFS Space | Notes |
|-------|----------|-----------|-------|
| **Tree** | O(n) | O(w) where w = max width | Perfect binary: w = n/2 |
| **Linked list** | O(n) | O(1) | Just 1 node at a time |
| **Dense graph** | O(V²) | O(V) | Complete graph |
| **Sparse graph** | O(V+E) | O(V) | Most practical cases |
| **Grid (r×c)** | O(rc) | O(min(r,c)) | BFS on 2D array |

<!-- back -->
