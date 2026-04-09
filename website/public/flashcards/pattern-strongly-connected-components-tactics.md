## Strongly Connected Components: Tactics

What are the advanced techniques for SCCs?

<!-- front -->

---

### Tactic 1: Tarjan's Algorithm (Single Pass)

```python
def tarjan_scc(n, edges):
    """Find SCCs with Tarjan's algorithm."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    index = 0
    stack = []
    on_stack = [False] * n
    indices = [-1] * n
    low_link = [0] * n
    sccs = []
    
    def strongconnect(v):
        nonlocal index
        indices[v] = low_link[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if indices[w] == -1:
                strongconnect(w)
                low_link[v] = min(low_link[v], low_link[w])
            elif on_stack[w]:
                low_link[v] = min(low_link[v], indices[w])
        
        # Start a new SCC
        if low_link[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)
    
    return sccs
```

---

### Tactic 2: Condensation Graph

```python
def build_condensation(n, edges, sccs):
    """Build DAG of SCCs."""
    # Map node to SCC id
    node_to_scc = {}
    for i, scc in enumerate(sccs):
        for node in scc:
            node_to_scc[node] = i
    
    # Build edges between SCCs
    num_sccs = len(sccs)
    dag = [set() for _ in range(num_sccs)]
    
    for u, v in edges:
        scc_u = node_to_scc[u]
        scc_v = node_to_scc[v]
        if scc_u != scc_v:
            dag[scc_u].add(scc_v)
    
    return dag
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong finish order | Wrong SCCs | Append after DFS, reverse for step 2 |
| Not reversing | Wrong components | Must reverse graph |
| Stack overflow | Deep recursion | Use iterative if needed |
| Wrong base case | Missing nodes | Check all unvisited |

---

### Tactic 4: 2-SAT Problem

```python
def solve_2sat(n, clauses):
    """
    Solve 2-SAT using SCCs.
    For each variable x, create nodes x and not-x.
    Implication graph: (a or b) → (not-a → b) and (not-b → a)
    Satisfiable iff no x and not-x in same SCC.
    """
    # Build implication graph with 2*n nodes
    # Find SCCs
    # Check satisfiability
    # Extract solution (topological order)
```

<!-- back -->
