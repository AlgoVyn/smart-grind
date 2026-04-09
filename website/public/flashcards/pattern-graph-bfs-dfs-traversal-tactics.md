## Graph - BFS/DFS Traversal: Tactics

What are the advanced techniques for graph traversal?

<!-- front -->

---

### Tactic 1: Bidirectional BFS

```python
def bidirectional_bfs(graph, start, end):
    """BFS from both start and end for faster path finding."""
    if start == end:
        return [start]
    
    # Two frontiers
    frontier_start = {start}
    frontier_end = {end}
    
    # Parents for path reconstruction
    parent_start = {start: None}
    parent_end = {end: None}
    
    while frontier_start and frontier_end:
        # Expand smaller frontier
        if len(frontier_start) > len(frontier_end):
            frontier_start, frontier_end = frontier_end, frontier_start
            parent_start, parent_end = parent_end, parent_start
        
        next_frontier = set()
        
        for node in frontier_start:
            for neighbor in graph[node]:
                if neighbor in parent_start:
                    continue
                
                parent_start[neighbor] = node
                
                # Check if frontiers meet
                if neighbor in frontier_end or neighbor in parent_end:
                    # Found intersection, reconstruct path
                    return reconstruct_path(parent_start, parent_end, neighbor)
                
                next_frontier.add(neighbor)
        
        frontier_start = next_frontier
    
    return None  # No path
```

---

### Tactic 2: Handling Cycles

```python
def dfs_detect_cycle_directed(graph, n):
    """Detect cycle in directed graph using DFS states."""
    # 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * n
    
    def dfs(node):
        if state[node] == 1:  # Currently in recursion stack → cycle
            return True
        if state[node] == 2:  # Already processed
            return False
        
        state[node] = 1  # Mark as visiting
        
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        
        state[node] = 2  # Mark as visited
        return False
    
    for i in range(n):
        if state[i] == 0:
            if dfs(i):
                return True
    
    return False
```

---

### Tactic 3: Topological Sort (DFS)

```python
def topological_sort_dfs(graph, n):
    """Topological sort using DFS."""
    visited = [False] * n
    stack = []  # Will store nodes in reverse topological order
    
    def dfs(node):
        visited[node] = True
        
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
        
        stack.append(node)  # Add after all children processed
    
    for i in range(n):
        if not visited[i]:
            dfs(i)
    
    return stack[::-1]  # Reverse for correct order
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not marking visited** | Infinite loops | Mark before adding to queue/stack |
| **Marking too late** | Re-processing | Mark immediately upon discovery |
| **Wrong data structure** | Inefficient ops | Use deque for BFS, list for DFS stack |
| **Memory with large graphs** | Stack overflow | Use iterative DFS for deep graphs |
| **Directed vs undirected** | Wrong cycle check | Adjust algorithm for graph type |

---

### Tactic 5: Multi-Source BFS

```python
def multi_source_bfs(graph, sources):
    """BFS starting from multiple sources simultaneously."""
    from collections import deque
    
    queue = deque()
    visited = set()
    
    # Initialize all sources
    for source in sources:
        queue.append((source, 0))  # (node, distance)
        visited.add(source)
    
    results = {}
    
    while queue:
        node, dist = queue.popleft()
        results[node] = dist
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return results
```

<!-- back -->
