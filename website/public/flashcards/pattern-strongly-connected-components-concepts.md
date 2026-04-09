## Strongly Connected Components: Core Concepts

What are the fundamental principles of SCCs?

<!-- front -->

---

### Core Concept

**A Strongly Connected Component is a maximal subgraph where every node is reachable from every other node. Condense SCCs to single nodes to get a DAG.**

**Example:**
```
A → B → C → A (cycle)
B → D

SCCs: {A,B,C}, {D}
Condensed graph:
{A,B,C} → {D}
(This is a DAG)
```

---

### The Pattern (Kosaraju)

```
Key insight: If you reverse a graph, SCCs stay the same but connections between them reverse.

Algorithm:
1. DFS on original, record finish times
2. Reverse all edges
3. DFS in reverse finish time order
   Each tree in DFS forest = one SCC

Why it works:
- Source SCC in original → sink SCC in reversed
- Processing in reverse finish order ensures we start with sink SCCs
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Cycle detection | Find cycles | SCC size > 1 |
| Dependency | Mutual deps | Package managers |
| Web analysis | Page clusters | PageRank |
| Graph simplification | To DAG | Workflow |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(V+E) | Two DFS passes |
| Space | O(V+E) | Graph + reverse |
| Algorithms | Kosaraju, Tarjan | Both O(V+E) |

<!-- back -->
