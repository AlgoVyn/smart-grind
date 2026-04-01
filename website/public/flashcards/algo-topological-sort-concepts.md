## Title: Topological Sort - Core Concepts

What is Topological Sort and when should it be used?

<!-- front -->

---

### Definition
An algorithm that orders vertices of a Directed Acyclic Graph (DAG) such that for every directed edge u→v, vertex u comes before vertex v in the ordering.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) |
| **Input** | DAG only (cycle detection included) |
| **Output** | Linear ordering respecting dependencies |

---

### Directed Acyclic Graphs (DAGs)

Topological sort only works on DAGs:

| Property | Description |
|----------|-------------|
| **Directed** | Edges have direction (u → v) |
| **Acyclic** | No cycles exist in the graph |
| **At Least One Source** | Always has at least one vertex with in-degree 0 |
| **Partial Order** | Defines a valid ordering respecting dependencies |

---

### In-Degree Concept

The number of incoming edges to a vertex:

| In-Degree | Meaning | Action in Kahn's Algorithm |
|-----------|---------|---------------------------|
| **0** | No dependencies | Can be processed immediately |
| **> 0** | Has dependencies | Must wait until dependencies resolved |
| **Becomes 0** | All dependencies resolved | Add to processing queue |

---

### Ordering Properties

| Property | Description |
|----------|-------------|
| **Not Unique** | Multiple valid topological orders may exist |
| **Source First** | Vertices with in-degree 0 appear early |
| **Sink Last** | Vertices with out-degree 0 appear late |
| **Dependency Respect** | If u → v, then u always comes before v |

---

### Cycle Detection

| Scenario | Result |
|----------|--------|
| **Valid DAG** | Returns valid topological order |
| **Contains Cycle** | Cannot produce complete ordering |
| **Kahn's Algorithm** | If processed vertices < total, cycle exists |
| **DFS Approach** | Detects back edge during traversal |

<!-- back -->
