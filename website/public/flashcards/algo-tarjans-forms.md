## Title: Tarjan's Algorithm - Forms

What are the different manifestations of the Tarjan's pattern?

<!-- front -->

---

### Form 1: Recursive Implementation

Standard recursive DFS approach. Clean and intuitive but may hit recursion depth limits on very large graphs.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) for recursion + O(V) for data |
| **Pros** | Clean, easy to understand |
| **Cons** | Recursion depth limit on deep graphs |

---

### Form 2: Iterative Implementation

Uses explicit stack to avoid recursion depth issues.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) for explicit stack |
| **Pros** | Handles deep graphs, no recursion limit |
| **Cons** | More complex to implement |

---

### Form 3: Kosaraju's Algorithm (Alternative)

Two-pass approach using graph reversal.

| Aspect | Tarjan's | Kosaraju's |
|--------|----------|------------|
| **Passes** | 1 | 2 |
| **Graph Storage** | Original only | Original + reversed |
| **Implementation** | Slightly complex | Simpler |
| **Space** | Less (no reverse graph) | More (stores reverse) |

---

### Form 4: Finding Single SCC

```python
def find_scc_containing(graph, target):
    """Find only the SCC containing a specific vertex."""
    sccs = tarjan_scc(graph)
    for scc in sccs:
        if target in scc:
            return scc
    return None
```

---

### Form 5: Cycle Detection

```python
def has_cycle(graph):
    """Check if directed graph has any cycle."""
    sccs = tarjan_scc(graph)
    return any(len(scc) > 1 for scc in sccs)
```

<!-- back -->
