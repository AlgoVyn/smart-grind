## Title: Tarjan's Algorithm - Tactics

What are specific techniques for using Tarjan's Algorithm?

<!-- front -->

---

### Tactic 1: Cycle Detection Using SCCs

```python
def has_cycle(graph):
    """Check if directed graph has any cycle."""
    sccs = tarjan_scc(graph)
    return any(len(scc) > 1 for scc in sccs)
```

---

### Tactic 2: Longest Cycle Detection

```python
def longest_cycle_length(graph):
    """Find length of longest cycle in graph."""
    sccs = tarjan_scc(graph)
    max_cycle = 0
    for scc in sccs:
        if len(scc) > 1:
            max_cycle = max(max_cycle, len(scc))
    return max_cycle if max_cycle > 0 else -1
```

---

### Tactic 3: Dependency Resolution

```python
def find_circular_dependencies(dependencies):
    """
    Find circular dependencies in a dependency graph.
    Returns list of SCCs with size > 1 (cycles).
    """
    graph = build_graph(dependencies)
    sccs = tarjan_scc(graph)
    return [scc for scc in sccs if len(scc) > 1]
```

---

### Tactic 4: Condensation Graph

```python
def build_condensation_graph(n, edges):
    """Build condensation graph (DAG of SCCs)."""
    sccs, comp_id = tarjan_scc_with_ids(n, edges)
    num_sccs = len(sccs)
    
    # Build edges between components
    cond_edges = set()
    for u, v in edges:
        cu, cv = comp_id[u], comp_id[v]
        if cu != cv:
            cond_edges.add((cu, cv))
    
    return list(cond_edges), sccs, comp_id
```

---

### Tactic 5: Comparison with Alternatives

| Algorithm | Time | Space | Passes | Use Case |
|-----------|------|-------|--------|----------|
| **Tarjan's** | O(V+E) | O(V) | 1 | Single-pass efficiency |
| **Kosaraju's** | O(V+E) | O(V+E) | 2 | Simpler implementation |
| **Path-based** | O(V+E) | O(V) | 1 | In-place, no recursion |
| **Union-Find** | O(V+E) | O(V) | 1 | Undirected graphs only |

**Choose Tarjan's when:** Memory efficiency is important, single-pass traversal needed, building condensation graph.

<!-- back -->
