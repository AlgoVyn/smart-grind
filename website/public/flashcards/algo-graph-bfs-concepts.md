## Graph BFS: Core Concepts

What is Breadth-First Search (BFS) and when should it be used?

<!-- front -->

---

### Fundamental Definition

**BFS** explores a graph layer by layer, visiting all neighbors at current depth before moving deeper.

| Aspect | Value |
|--------|-------|
| **Time** | O(V + E) |
| **Space** | O(V) for queue and visited |
| **Guarantee** | Shortest path in unweighted graphs |
| **Order** | Level-order traversal |

---

### BFS Structure

```
Queue: [start] → [A, B] → [B, C, D] → [C, D, E]

       0: S
      / \
     1: A   B
        |  / \
       2: C  D
          |
         3: E

Order visited: S, A, B, C, D, E
```

**Key property:** First time we reach a node is via shortest path.

---

### When to Use BFS

| Problem Type | BFS Application |
|--------------|-----------------|
| **Shortest path (unweighted)** | Optimal - finds min edges |
| **Level-order traversal** | Tree/graph levels |
| **Connected components** | Explore each component |
| **Bipartite check** | 2-coloring with BFS |
| **Topological sort** | Kahn's algorithm (indegree BFS) |
| **Word ladder** | Transformations as edges |

---

### BFS vs DFS Trade-offs

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Shortest path** | ✓ Yes (unweighted) | ✗ No |
| **Memory** | O(V) - can be large | O(h) - recursion stack |
| **Implementation** | Queue, iterative | Stack or recursion |
| **Complete graph** | Better | OK |
| **Deep solutions** | Explores all shallower first | May find deep quickly |

<!-- back -->
