## Title: Tarjan's Algorithm - Comparison

How does Tarjan's compare to other SCC algorithms?

<!-- front -->

---

### Comparison Table

| Algorithm | Time | Space | Passes | Graph Storage | Use Case |
|-----------|------|-------|--------|---------------|----------|
| **Tarjan's** | O(V+E) | O(V) | 1 | Original only | Single-pass efficiency |
| **Kosaraju's** | O(V+E) | O(V+E) | 2 | Original + reversed | Simpler implementation |
| **Path-based** | O(V+E) | O(V) | 1 | Original only | In-place, no recursion |
| **Union-Find** | O(V+E) | O(V) | 1 | Original only | Undirected graphs |

---

### When to Choose Each

**Choose Tarjan's when:**
- Memory efficiency is important
- You want single-pass traversal
- Building condensation graph
- Competitive programming

**Choose Kosaraju's when:**
- Simpler code is preferred
- Graph reversal is already available
- Teaching/learning SCCs

**Choose Path-based when:**
- Recursion depth is a concern
- You need in-place processing

**Choose Union-Find when:**
- Graph is undirected
- Only need connected components

---

### Key Differences

| Aspect | Tarjan's | Kosaraju's |
|--------|----------|------------|
| **Memory** | Lower (no reverse graph) | Higher (stores reverse) |
| **Complexity** | Slightly more complex | Simpler to understand |
| **Stack Usage** | One stack for DFS | Two passes, explicit ordering |
| **Low-link** | Requires tracking | Not needed |

**Key Insight:** Tarjan's is preferred for competitive programming due to single-pass efficiency and lower memory.

<!-- back -->
