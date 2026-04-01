## Graph DFS: Core Concepts

What is Depth-First Search (DFS) and when should it be used?

<!-- front -->

---

### Fundamental Definition

**DFS** explores a graph by going as deep as possible before backtracking.

| Aspect | Value |
|--------|-------|
| **Time** | O(V + E) |
| **Space** | O(h) recursion stack, O(V) visited |
| **Exploration** | Deep-first, backtracking |
| **Path guarantee** | Finds a path, not necessarily shortest |

---

### DFS Structure

```
Stack/recursion: [A] → [A,B] → [A,B,D] → [A,B] → [A,B,E] → [A] → [A,C]

Graph:      DFS Order: A, B, D, E, C
    A
   / \
  B   C
 / \
D   E

Pre-order:  A, B, D, E, C
Post-order: D, E, B, C, A
In-order:   (for BST only)
```

---

### DFS Applications

| Problem | DFS Use |
|---------|---------|
| **Topological sort** | Post-order on DAG |
| **Cycle detection** | Back edge detection |
| **Connected components** | Explore each component |
| **Strongly connected** | Kosaraju's/Trajan's algorithm |
| **Maze solving** | Find any path |
| **Backtracking** | Explore all possibilities |

---

### DFS States (for cycle detection)

```
0 = unvisited (white)
1 = visiting (gray) - in current recursion stack
2 = visited (black) - fully processed

Cycle exists if we encounter a node in state 1
```

---

### DFS vs BFS

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Space** | O(h) | O(w) |
| **Shortest path** | ✗ No | ✓ Yes (unweighted) |
| **Complete solutions** | Good with backtracking | Memory intensive |
| **Deep solutions** | Finds quickly | Explores all shallower |
| **Recursion** | Natural | Iterative (queue) |

<!-- back -->
