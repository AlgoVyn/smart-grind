## Graph DFS: Frameworks

What are the standard DFS implementations and patterns?

<!-- front -->

---

### Standard Recursive DFS

```python
def dfs_recursive(graph, start):
    """
    Standard recursive DFS
    """
    visited = set()
    result = []
    
    def dfs(node):
        visited.add(node)
        result.append(node)  # Pre-order
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
        
        # result.append(node)  # Post-order here
    
    dfs(start)
    return result
```

---

### Iterative DFS Framework

```python
def dfs_iterative(graph, start):
    """
    Iterative DFS using explicit stack
    """
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to stack (reverse for consistent order)
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result
```

---

### DFS with Cycle Detection (3-color)

```python
def has_cycle_dfs(graph):
    """
    Detect cycle using 3-color state
    """
    n = len(graph)
    WHITE, GRAY, BLACK = 0, 1, 2
    state = [WHITE] * n
    
    def dfs(node):
        state[node] = GRAY  # Entering
        
        for neighbor in graph[node]:
            if state[neighbor] == GRAY:
                return True  # Back edge = cycle
            if state[neighbor] == WHITE:
                if dfs(neighbor):
                    return True
        
        state[node] = BLACK  # Leaving
        return False
    
    for node in range(n):
        if state[node] == WHITE:
            if dfs(node):
                return True
    
    return False
```

---

### Topological Sort (DFS)

```python
def topological_sort_dfs(graph):
    """
    Topological sort using DFS post-order
    """
    n = len(graph)
    visited = [False] * n
    stack = []  # Result stack (reverse of post-order)
    
    def dfs(node):
        visited[node] = True
        
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
        
        stack.append(node)  # Add after visiting all children
    
    for node in range(n):
        if not visited[node]:
            dfs(node)
    
    return stack[::-1]  # Reverse to get topological order

# Alternative: Kahn's BFS algorithm for comparison
def topological_sort_bfs(graph, indegree):
    from collections import deque
    queue = deque([i for i, d in enumerate(indegree) if d == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == len(graph) else []
```

---

### Strongly Connected Components (Kosaraju)

```python
def kosaraju_scc(graph):
    """
    Find strongly connected components
    """
    n = len(graph)
    visited = [False] * n
    order = []
    
    # First DFS: get finishing order
    def dfs1(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs1(neighbor)
        order.append(node)
    
    for i in range(n):
        if not visited[i]:
            dfs1(i)
    
    # Build reverse graph
    reverse = [[] for _ in range(n)]
    for u in range(n):
        for v in graph[u]:
            reverse[v].append(u)
    
    # Second DFS on reverse in reverse order
    visited = [False] * n
    components = []
    
    def dfs2(node, component):
        visited[node] = True
        component.append(node)
        for neighbor in reverse[node]:
            if not visited[neighbor]:
                dfs2(neighbor, component)
    
    for node in reversed(order):
        if not visited[node]:
            component = []
            dfs2(node, component)
            components.append(component)
    
    return components
```

<!-- back -->
