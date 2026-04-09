## Bridges & Articulation Points (Tarjan's) - Concepts

What are the fundamental principles behind Tarjan's algorithm for bridges and articulation points?

<!-- front -->

---

### Core Concepts

| Concept | Definition | Role in Algorithm |
|---------|------------|-------------------|
| **Discovery Time** | Order in which DFS visits nodes | `disc[u]` - identifies when node was found |
| **Low-link Value** | Earliest discovery time reachable from node | `low[u]` - tracks alternate paths via back edges |
| **Tree Edge** | Edge to unvisited node | Forms DFS tree structure |
| **Back Edge** | Edge to visited ancestor (not parent) | Creates cycles, reduces low-link values |

---

### The "Aha!" Moments

**Why does `low[v] > disc[u]` indicate a bridge?**

If the lowest node reachable from v (through any path) is still discovered *after* u, then removing edge (u,v) disconnects v's entire subtree. There is no alternate path back to u or its ancestors.

```
    u --- v    Bridge if v cannot reach back to u or above
    |     |
    a     b    (no back edge from v's side to u's side)
```

**Why must the root have 2+ children to be an articulation point?**

If the root has only one child, removing the root doesn't disconnect the graph - the single child subtree contains all other nodes. With 2+ children, removing root disconnects those subtrees from each other.

**Why `>=` for AP but `>` for bridge?**

- Bridge (`>`): v cannot reach u at all - edge is the only connection
- AP (`>=`): v can reach u but not above u - removing u still disconnects

---

### Conditions Summary

| Component | Condition | Meaning |
|-----------|-----------|---------|
| **Bridge** | `low[v] > disc[u]` | v's subtree has no back edge to u or ancestors |
| **Articulation Point (non-root)** | `low[v] >= disc[u]` | v's subtree has no back edge above u |
| **Articulation Point (root)** | `children_count > 1` | Root has multiple DFS tree children |

---

### Back Edges and Cycles

Back edges are edges to already-visited ancestors (not the parent). They:
- Indicate cycles in the graph
- Reduce low-link values (provide alternate paths)
- Never be bridges (part of a cycle)

```
    0 --- 1
    |   / |
    |  /  |   Edge (1,2) is a back edge (to ancestor 0)
    2 --- 3   This creates cycle 0-1-2, so (0,1) is NOT a bridge
```

---

### Complexity

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| Time | O(V + E) | Single DFS pass visits all vertices and edges |
| Space | O(V) | Discovery, low-link, and parent arrays |

<!-- back -->
