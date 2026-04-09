## Strongly Connected Components (Kosaraju/Tarjan): Forms

What are the different variations of SCC algorithms?

<!-- front -->

---

### Form 1: Kosaraju's Algorithm (Recursive)

```python
def kosaraju_scc(graph):
    """Kosaraju's algorithm - two-pass DFS."""
    # First DFS: get finish times
    visited = set()
    stack = []
    
    def dfs1(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs1(neighbor)
        stack.append(node)
    
    for node in graph:
        if node not in visited:
            dfs1(node)
    
    # Reverse graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Second DFS on reversed graph
    visited.clear()
    sccs = []
    
    def dfs2(node, comp):
        visited.add(node)
        comp.append(node)
        for neighbor in reversed_graph.get(node, []):
            if neighbor not in visited:
                dfs2(neighbor, comp)
    
    while stack:
        node = stack.pop()
        if node not in visited:
            comp = []
            dfs2(node, comp)
            sccs.append(comp)
    
    return sccs
```

---

### Form 2: Kosaraju's Algorithm (Iterative)

```python
def kosaraju_iterative(graph):
    """Iterative Kosaraju to avoid recursion limits."""
    visited = set()
    finish_stack = []
    
    # Iterative first DFS
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
    
    # Build reversed graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Iterative second DFS
    visited.clear()
    sccs = []
    
    while finish_stack:
        node = finish_stack.pop()
        if node in visited:
            continue
        
        component = []
        dfs_stack = [node]
        visited.add(node)
        
        while dfs_stack:
            curr = dfs_stack.pop()
            component.append(curr)
            for neighbor in reversed_graph.get(curr, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    dfs_stack.append(neighbor)
        
        sccs.append(component)
    
    return sccs
```

---

### Form 3: Tarjan's Algorithm (Recursive)

```python
def tarjan_scc(graph):
    """Tarjan's algorithm - single-pass DFS with low-link."""
    index = 0
    indices = {}
    lowlink = {}
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
                strongconnect(neighbor)
                lowlink[node] = min(lowlink[node], lowlink[neighbor])
            elif neighbor in on_stack:
                lowlink[node] = min(lowlink[node], indices[neighbor])
        
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

### Form 4: Tarjan's Algorithm (Iterative)

```python
def tarjan_iterative(graph):
    """Iterative Tarjan for large graphs."""
    index = 0
    indices = {}
    lowlink = {}
    on_stack = set()
    stack = []
    sccs = []
    
    for start in graph:
        if start in indices:
            continue
        
        # (node, child_idx, state) - state 0=enter, 1=exit
        work_stack = [(start, 0, 0)]
        
        while work_stack:
            node, child_idx, state = work_stack.pop()
            
            if state == 0:  # Entering node
                if node in indices:
                    continue
                
                indices[node] = lowlink[node] = index
                index += 1
                stack.append(node)
                on_stack.add(node)
                
                # Push exit marker
                work_stack.append((node, 0, 1))
                
                # Push children (reverse order for correct processing)
                neighbors = graph.get(node, [])
                for i in range(len(neighbors) - 1, -1, -1):
                    neighbor = neighbors[i]
                    if neighbor not in indices:
                        work_stack.append((neighbor, 0, 0))
                    elif neighbor in on_stack:
                        lowlink[node] = min(lowlink[node], indices[neighbor])
            
            else:  # Exiting node - process children results
                neighbors = graph.get(node, [])
                for neighbor in neighbors:
                    if neighbor in indices and indices[neighbor] > indices[node]:
                        # This was a tree edge, update lowlink
                        lowlink[node] = min(lowlink[node], lowlink[neighbor])
                
                # Check if root of SCC
                if lowlink[node] == indices[node]:
                    component = []
                    while True:
                        n = stack.pop()
                        on_stack.remove(n)
                        component.append(n)
                        if n == node:
                            break
                    sccs.append(component)
    
    return sccs
```

---

### Form Comparison

| Form | Passes | Memory | Use When |
|------|--------|--------|----------|
| Kosaraju Recursive | 2 | O(V+E) | Standard, easy to understand |
| Kosaraju Iterative | 2 | O(V+E) | Large graphs, recursion limits |
| Tarjan Recursive | 1 | O(V) | Most efficient, preferred |
| Tarjan Iterative | 1 | O(V) | Large graphs, production code |

**Default choice:** Tarjan recursive for interviews, Tarjan iterative for production.

<!-- back -->
