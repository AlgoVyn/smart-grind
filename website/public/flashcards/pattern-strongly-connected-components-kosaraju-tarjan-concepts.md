## Strongly Connected Components (Kosaraju/Tarjan): Core Concepts

What are the fundamental principles of Strongly Connected Components?

<!-- front -->

---

### Core Concept

**A Strongly Connected Component (SCC) is a maximal subgraph where every pair of vertices is mutually reachable.**

For any two nodes `u` and `v` in an SCC:
- Path exists from `u` to `v` ✓
- Path exists from `v` to `u` ✓

Think of it as a "mutual reachability club" - if A can reach B, and B can reach A, they belong to the same SCC.

---

### Key Terminology

| Term | Definition |
|------|------------|
| **Reachability** | Path exists from node u to node v |
| **Strongly Connected** | Every pair has mutual reachability |
| **Maximal** | Cannot add more nodes without breaking strong connectivity |
| **Condensation Graph** | SCCs contracted into single nodes (always a DAG) |
| **Finish Time** | When DFS finishes processing a node |
| **Low-link Value** | Smallest finish time reachable from a node |

---

### The Condensation Graph

```
Original Graph:          Condensation Graph:
    A → B → C → A              ┌─────┐
    ↓   ↓                      │SCC1 │
    D   E         ───►         └──┬──┘
    ↓   ↑                         │
    F ←─┘                      ┌──┴──┐
                               │SCC2 │
                               └─────┘
    
    SCCs: {A,B,C}, {D,E,F}     Always a DAG!
```

**Why it matters:** The condensation graph simplifies problems by collapsing cycles into single nodes.

---

### When to Use SCC Algorithms

| Problem Type | Use SCC When |
|--------------|--------------|
| **Cycle detection** | Find cycles (SCCs of size > 1) |
| **Dependency analysis** | Mutual dependencies form cycles |
| **Graph simplification** | Contract cycles into single nodes |
| **Reachability queries** | Check if nodes can reach each other |
| **Web page ranking** | PageRank-style algorithms |

---

### Complexity

| Algorithm | Time | Space |
|-----------|------|-------|
| Kosaraju | O(V + E) | O(V + E) |
| Tarjan | O(V + E) | O(V) |

Both are optimal - each vertex and edge processed exactly once.

<!-- back -->
