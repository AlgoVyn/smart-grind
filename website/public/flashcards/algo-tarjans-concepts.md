## Title: Tarjan's Algorithm - Core Concepts

What is Tarjan's Algorithm and how does it work?

<!-- front -->

---

### Definition
An algorithm (1972) that finds all Strongly Connected Components (SCCs) in a directed graph in O(V + E) time using a single DFS traversal.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) |
| **Key Concept** | Low-link value |
| **Advantage** | Single pass vs Kosaraju's two passes |

---

### Strongly Connected Components

An SCC is a maximal subgraph where every vertex is reachable from every other vertex.

| Property | Description |
|----------|-------------|
| **Maximal** | Cannot add any more vertices and maintain the property |
| **Reachability** | For all u, v in SCC: u → v path exists |
| **Condensation** | Contracting SCCs creates a DAG |

---

### Discovery Time vs Low-Link Value

| Value | Definition | Purpose |
|-------|------------|---------|
| **disc[v]** | When vertex v was first discovered in DFS | Tracks visitation order |
| **low[v]** | Minimum discovery time reachable from v's subtree | Identifies SCC roots |

**Key Property:** When `disc[v] == low[v]`, vertex `v` is the root of an SCC.

---

### Edge Types

| Edge Type | Description | Effect on low[] |
|-----------|-------------|-----------------|
| **Tree Edge** | First visit to unvisited vertex | Updates via recursion |
| **Back Edge** | Edge to ancestor on DFS stack | `low[v] = min(low[v], disc[w])` |
| **Cross Edge** | Edge to completed SCC | Ignored (not on stack) |

<!-- back -->
