## Bridges & Articulation Points (Tarjan's) - Comparison

When should you use different approaches for finding bridges and articulation points?

<!-- front -->

---

### Recursive vs Iterative DFS

| Aspect | Recursive DFS | Iterative DFS |
|--------|---------------|---------------|
| **Code Clarity** | Clean and intuitive | More complex |
| **Stack Depth** | Limited by system | Controlled explicitly |
| **Performance** | Same O(V+E) | Same O(V+E) |
| **Best For** | General use, learning | Very deep graphs |
| **Risk** | Stack overflow on deep graphs | None |

**Winner**: Recursive for most cases, iterative for production with unknown graph depth

---

### Bridge Detection Alternatives

| Algorithm | Time | Space | Graph Type | Pros/Cons |
|-----------|------|-------|------------|-----------|
| **Tarjan's (DFS)** | O(V+E) | O(V) | Undirected | Single pass, efficient |
| **Naive (Edge Removal)** | O(E×(V+E)) | O(V+E) | Any | Try removing each edge, very slow |
| **Union-Find** | O(E × α(V)) | O(V) | Undirected | Good for dynamic graphs |
| **Fleury's** | O(E²) | O(V+E) | Any | For Eulerian paths, not efficient |

**Winner**: Tarjan's for static graphs, Union-Find for dynamic edge additions/removals

---

### Tarjan's vs Kosaraju's

| Aspect | Tarjan's (Low-Link) | Kosaraju's (SCC) |
|--------|---------------------|------------------|
| **Use Case** | Bridges, APs in undirected | SCCs in directed |
| **Passes** | 1 DFS | 2 DFS |
| **Graph Type** | Undirected | Directed |
| **Space** | O(V) | O(V+E) |

Note: Different algorithms for different problems. Don't confuse Tarjan's low-link (undirected) with Tarjan's SCC (directed).

---

### When to Use Each Approach

**Use Tarjan's Low-Link when:**
- Finding bridges in undirected graphs
- Finding articulation points
- Analyzing network reliability
- O(V+E) time is required

**Use Alternative when:**
- Graph is directed → Use Tarjan's SCC or Kosaraju's
- Graph changes dynamically → Union-Find
- Only need simple connectivity → BFS/DFS

---

### Comparison Summary

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Learning | Recursive Tarjan's | Clear, matches theory |
| Production (unknown depth) | Iterative Tarjan's | No stack overflow risk |
| Dynamic graph | Union-Find | Handles changes efficiently |
| Directed graph bridges | Convert to line graph + SCCs | Different problem entirely |
| Just counting components | Simple DFS | Simpler, no low-link needed |

<!-- back -->
