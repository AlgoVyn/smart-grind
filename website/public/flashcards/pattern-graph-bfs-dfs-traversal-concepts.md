## Graph - BFS/DFS Traversal: Core Concepts

What are the fundamental principles of graph traversal using BFS and DFS?

<!-- front -->

---

### Core Concept

Use **BFS with a queue for level-by-level exploration** or **DFS with a stack/recursion for deep exploration** to visit all nodes in a graph.

**Key insight**: Both traversals visit all reachable nodes, but in different orders - BFS by distance from start, DFS by depth.

---

### The Pattern

```
Graph:
    1 --- 2
    |     |
    3 --- 4

BFS starting from 1:
  Queue: [1], visited: {1}
  Dequeue 1, enqueue neighbors: [2, 3]
  Dequeue 2, enqueue unvisited: [3, 4]
  Dequeue 3, no new neighbors
  Dequeue 4, no new neighbors
  Result: [1, 2, 3, 4] (by distance from 1)

DFS starting from 1 (recursive):
  Visit 1, mark visited
  Recurse on neighbor 2:
    Visit 2, mark visited
    Recurse on neighbor 4:
      Visit 4, mark visited
      Recurse on neighbor 3:
        Visit 3, mark visited
  Result: [1, 2, 4, 3] (depth-first)
```

---

### Traversal Comparison

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Data Structure** | Queue | Stack (or recursion) |
| **Order** | By distance from start | By depth |
| **Shortest path** | Finds in unweighted graphs | No |
| **Space** | O(w) - max width | O(h) - max depth |
| **Cycle detection** | Yes | Yes |

---

### Common Applications

| Problem Type | Use BFS/DFS | Example |
|--------------|-------------|---------|
| Connected Components | Both | Number of Islands |
| Cycle Detection | Both | Detect Cycle |
| Path Existence | Both | Path Between Nodes |
| Shortest Path (unweighted) | BFS | Shortest Path |
| Topological Sort | DFS | Course Schedule |
| Maze Solving | BFS | Shortest exit |
| Clone Graph | Both | Deep Copy |

---

### Complexity

| Aspect | BFS | DFS |
|--------|-----|-----|
| Time | O(V + E) | O(V + E) |
| Space | O(V) | O(V) |
| Adjacency list | O(V + E) | O(V + E) |
| Adjacency matrix | O(V²) | O(V²) |

<!-- back -->
