## Strongly Connected Components (Kosaraju/Tarjan): Framework

What is the complete code template for finding Strongly Connected Components?

<!-- front -->

---

### Framework 1: Kosaraju's Algorithm

```
┌────────────────────────────────────────────────────────────┐
│  KOSARAJU'S ALGORITHM - TWO-PASS DFS TEMPLATE                 │
├────────────────────────────────────────────────────────────┤
│  1. First DFS Pass (on original graph):                       │
│     - Track finish times by pushing nodes to stack            │
│     - Process all nodes, mark visited                          │
│                                                                │
│  2. Reverse the graph:                                         │
│     - Flip all edge directions                                 │
│                                                                │
│  3. Second DFS Pass (on reversed graph):                       │
│     - Process nodes in reverse finish order (pop from stack)  │
│     - Each DFS tree = one SCC                                  │
│                                                                │
│  Key insight: Source SCC in original = sink SCC in reversed   │
└────────────────────────────────────────────────────────────┘
```

---

### Framework 2: Tarjan's Algorithm

```
┌────────────────────────────────────────────────────────────┐
│  TARJAN'S ALGORITHM - SINGLE-PASS DFS TEMPLATE                │
├────────────────────────────────────────────────────────────┤
│  1. Initialize for each node:                                 │
│     - index (discovery time)                                 │
│     - lowlink (smallest reachable discovery time)             │
│     - stack to track current path                            │
│                                                                │
│  2. DFS traversal:                                            │
│     - Set index = lowlink = current counter                  │
│     - Push to stack, mark on_stack                            │
│     - For each neighbor:                                       │
│       * Unvisited: recurse, update lowlink                   │
│       * On stack: lowlink = min(lowlink, neighbor.index)     │
│                                                                │
│  3. When lowlink == index:                                    │
│     - Pop from stack until current node = one SCC            │
│                                                                │
│  Key insight: lowlink == index means root of SCC             │
└────────────────────────────────────────────────────────────┘
```

---

### Implementation: Kosaraju's Algorithm

```python
def kosaraju_scc(graph):
    """Find SCCs using Kosaraju's algorithm."""
    # Step 1: First DFS for finish times
    visited = set()
    stack = []
    
    def dfs1(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs1(neighbor)
        stack.append(node)  # Push after processing all neighbors
    
    for node in graph:
        if node not in visited:
            dfs1(node)
    
    # Step 2: Reverse the graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Step 3: Second DFS on reversed graph
    visited.clear()
    sccs = []
    
    def dfs2(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in reversed_graph.get(node, []):
            if neighbor not in visited:
                dfs2(neighbor, component)
    
    while stack:
        node = stack.pop()
        if node not in visited:
            component = []
            dfs2(node, component)
            sccs.append(component)
    
    return sccs
```

---

### Implementation: Tarjan's Algorithm

```python
def tarjan_scc(graph):
    """Find SCCs using Tarjan's algorithm."""
    index = 0
    indices = {}  # Discovery time
    lowlink = {}   # Lowest reachable discovery time
    on_stack = set()
    stack = []
    sccs = []
    
    def strongconnect(node):
        nonlocal index
        indices[node] = lowlink[node] = index
        index += 1
        stack.append(node)
        on_stack.add(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in indices:
                # Unvisited neighbor
                strongconnect(neighbor)
                lowlink[node] = min(lowlink[node], lowlink[neighbor])
            elif neighbor in on_stack:
                # Back edge to current SCC
                lowlink[node] = min(lowlink[node], indices[neighbor])
        
        # Root of SCC found
        if lowlink[node] == indices[node]:
            component = []
            while True:
                n = stack.pop()
                on_stack.remove(n)
                component.append(n)
                if n == node:
                    break
            sccs.append(component)
    
    for node in graph:
        if node not in indices:
            strongconnect(node)
    
    return sccs
```

---

### Key Pattern Elements

| Aspect | Kosaraju | Tarjan |
|--------|----------|--------|
| **Passes** | Two DFS | One DFS |
| **Graph reversal** | Required | Not needed |
| **Memory** | O(V+E) for reversed graph | O(V) for stack |
| **Concept** | Simpler | More elegant |
| **Complexity** | O(V + E) | O(V + E) |

**Winner**: Tarjan for efficiency, Kosaraju for clarity

<!-- back -->
