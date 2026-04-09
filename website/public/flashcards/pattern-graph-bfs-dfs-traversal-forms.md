## Graph - BFS/DFS Traversal: Forms

What are the different variations of graph traversal?

<!-- front -->

---

### Form 1: Find All Paths

```python
def find_all_paths(graph, start, end):
    """Find all paths from start to end."""
    all_paths = []
    
    def dfs(current, path, visited):
        if current == end:
            all_paths.append(path[:])
            return
        
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                path.append(neighbor)
                dfs(neighbor, path, visited)
                path.pop()
                visited.remove(neighbor)
    
    dfs(start, [start], {start})
    return all_paths
```

---

### Form 2: Shortest Path (BFS)

```python
def shortest_path(graph, start, end):
    """Find shortest path in unweighted graph."""
    if start == end:
        return [start]
    
    visited = {start: None}  # node -> parent
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited[neighbor] = node
                queue.append(neighbor)
                
                if neighbor == end:
                    # Reconstruct path
                    path = []
                    current = end
                    while current is not None:
                        path.append(current)
                        current = visited[current]
                    return path[::-1]
    
    return None  # No path
```

---

### Form 3: Connected Components

```python
def find_connected_components(graph, n):
    """Find all connected components."""
    visited = set()
    components = []
    
    for i in range(n):
        if i not in visited:
            component = []
            stack = [i]
            
            while stack:
                node = stack.pop()
                if node not in visited:
                    visited.add(node)
                    component.append(node)
                    for neighbor in graph[node]:
                        if neighbor not in visited:
                            stack.append(neighbor)
            
            components.append(component)
    
    return components
```

---

### Form 4: Detect Cycle (Undirected)

```python
def has_cycle_undirected(graph, n):
    """Detect cycle in undirected graph."""
    visited = [False] * n
    
    def dfs(node, parent):
        visited[node] = True
        
        for neighbor in graph[node]:
            if not visited[neighbor]:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                # Visited and not parent → cycle
                return True
        
        return False
    
    for i in range(n):
        if not visited[i]:
            if dfs(i, -1):
                return True
    
    return False
```

---

### Form Comparison

| Form | Algorithm | Output | Use Case |
|------|-----------|--------|----------|
| All Paths | DFS | List of paths | Enumerate possibilities |
| Shortest | BFS | Single path | Unweighted shortest |
| Components | DFS/BFS | List of groups | Cluster analysis |
| Cycle Detect | DFS | Boolean | Validation |

<!-- back -->
