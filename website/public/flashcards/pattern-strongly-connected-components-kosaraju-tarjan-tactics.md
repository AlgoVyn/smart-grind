## Strongly Connected Components (Kosaraju/Tarjan): Tactics

What are the advanced techniques for Strongly Connected Components?

<!-- front -->

---

### Tactic 1: Cycle Detection via SCC

```python
def has_cycle_directed(graph):
    """Detect if directed graph has any cycle using SCC."""
    sccs = tarjan_scc(graph)  # or kosaraju_scc
    
    # SCC with size > 1 contains a cycle
    for scc in sccs:
        if len(scc) > 1:
            return True
        # Check for self-loop
        node = scc[0]
        if node in graph.get(node, []):
            return True
    return False
```

**Key insight:** Any SCC with size > 1 (or self-loop) contains a cycle.

---

### Tactic 2: Find Longest Cycle

```python
def longest_cycle(graph):
    """Find the longest cycle using SCC sizes."""
    sccs = tarjan_scc(graph)
    max_cycle = 0
    
    for scc in sccs:
        if len(scc) > 1:
            max_cycle = max(max_cycle, len(scc))
        elif len(scc) == 1:
            node = scc[0]
            if node in graph.get(node, []):  # Self-loop
                max_cycle = max(max_cycle, 1)
    
    return max_cycle if max_cycle > 0 else -1
```

LeetCode 2360: Longest Cycle in a Graph

---

### Tactic 3: Check if Two Nodes Are in Same SCC

```python
def same_scc(graph, u, v):
    """Check if two nodes are in the same strongly connected component."""
    for scc in tarjan_scc(graph):
        if u in scc and v in scc:
            return True
    return False

# Optimized: Use component ID mapping
def build_scc_ids(graph):
    """Build node -> SCC ID mapping."""
    sccs = tarjan_scc(graph)
    node_to_scc = {}
    for i, scc in enumerate(sccs):
        for node in scc:
            node_to_scc[node] = i
    return node_to_scc

def same_scc_fast(node_to_scc, u, v):
    """O(1) check with precomputed mapping."""
    return node_to_scc.get(u) == node_to_scc.get(v)
```

---

### Tactic 4: Build Condensation DAG

```python
def build_condensation_graph(graph):
    """Build condensation graph (DAG of SCCs)."""
    # Find SCCs
    sccs = tarjan_scc(graph)
    
    # Map node to its SCC ID
    node_to_scc = {}
    for i, scc in enumerate(sccs):
        for node in scc:
            node_to_scc[node] = i
    
    # Build edges between SCCs
    n_sccs = len(sccs)
    dag = [set() for _ in range(n_sccs)]
    
    for node in graph:
        for neighbor in graph[node]:
            scc_u = node_to_scc[node]
            scc_v = node_to_scc[neighbor]
            if scc_u != scc_v:
                dag[scc_u].add(scc_v)
    
    return dag, node_to_scc, sccs

# Use case: Topological sort on DAG for dependency resolution
```

---

### Tactic 5: Find Source SCCs (No Incoming Edges)

```python
def find_source_sccs(graph):
    """Find SCCs with no incoming edges from other SCCs."""
    dag, node_to_scc, sccs = build_condensation_graph(graph)
    n = len(sccs)
    
    # Count incoming edges to each SCC
    in_degree = [0] * n
    for u in range(n):
        for v in dag[u]:
            in_degree[v] += 1
    
    # Source SCCs have in_degree = 0
    sources = [i for i in range(n) if in_degree[i] == 0]
    return [sccs[i] for i in sources]
```

LeetCode 1557: Minimum Number of Vertices to Reach All Nodes

---

### Tactic 6: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| **Graph reversal errors** | Wrong edge direction in Kosaraju | Double-check: reversed[neighbor].append(node) |
| **Low-link calculation** | Using lowlink instead of indices | Use `indices[neighbor]` for on-stack nodes |
| **Stack management** | Not tracking on-stack status | Use `on_stack` set or array |
| **Finish time order** | Wrong order in Kosaraju's second pass | Process in reverse finish time (pop from stack) |
| **Disconnected components** | Missing unvisited nodes | Iterate through ALL nodes, not just first |
| **Recursion depth** | Stack overflow on large graphs | Use iterative versions |
| **Self-loops** | Single-node cycles | Check if node points to itself |
| **Empty graph** | Edge case | Return empty list for empty graph |

---

### Tactic 7: Iterative Versions for Large Graphs

```python
def kosaraju_iterative(graph):
    """Iterative Kosaraju to avoid recursion limits."""
    # Use explicit stack: (node, next_child_index)
    visited = set()
    finish_stack = []
    
    for start in graph:
        if start in visited:
            continue
        
        dfs_stack = [(start, 0)]
        while dfs_stack:
            node, idx = dfs_stack[-1]
            
            if node not in visited:
                visited.add(node)
            
            neighbors = graph.get(node, [])
            if idx < len(neighbors):
                neighbor = neighbors[idx]
                dfs_stack[-1] = (node, idx + 1)
                if neighbor not in visited:
                    dfs_stack.append((neighbor, 0))
            else:
                dfs_stack.pop()
                finish_stack.append(node)
    
    # ... continue with reversed graph processing
```

<!-- back -->
