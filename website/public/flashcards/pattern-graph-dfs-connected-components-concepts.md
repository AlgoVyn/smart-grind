## Graph DFS - Connected Components: Core Concepts

What are the fundamental principles of DFS connected components?

<!-- front -->

---

### Core Concept

**Each DFS from an unvisited node explores one connected component completely before moving to the next.**

**Key difference from BFS:**
- BFS explores level by level (iterative)
- DFS explores as deep as possible (recursive)
- Both count components the same way

---

### The Pattern

```
1. For each node:
   If not visited:
      count++
      DFS(node) to mark all connected

2. DFS marks all reachable nodes
   from starting point as visited
```

---

### When DFS Preferred

- **Simpler code**: Recursive is cleaner
- **Stack not a concern**: Shallow graphs
- **All paths needed**: Easier to track
- **Backtracking required**: Natural fit

### When BFS Preferred

- **Deep graphs**: Avoid stack overflow
- **Shortest path**: BFS finds it
- **Level-order matters**: Process by distance

---

### Complexity

| Aspect | DFS | BFS |
|--------|-----|-----|
| Time | O(V+E) | O(V+E) |
| Space | O(depth) | O(width) |
| Recursion risk | Yes | No |

<!-- back -->
