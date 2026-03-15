## Graph Traversal: Common Mistakes

**Question:** What are the most common errors in graph traversal implementations?

<!-- front -->

---

## Answer: Track Visited, Handle Multiple Components

### BFS Template (Queue)
```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### DFS Template (Recursive)
```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    if start in visited:
        return
    
    visited.add(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

### ⚠️ Common Mistakes

#### 1. Forgetting to Mark Visited
```python
# WRONG - causes infinite loop for cycles!
def bfs_wrong(graph, start):
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            queue.append(neighbor)  # No visited check!

# CORRECT
def bfs_correct(graph, start):
    visited = set([start])
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

#### 2. Wrong Graph Representation
```python
# Adjacency List (most common)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

# Wrong: treating dict as list
for node in graph:  # Iterates keys, not edges!
    ...

# Correct: iterate neighbors
for neighbor in graph[node]:
    ...
```

#### 3. Not Handling Disconnected Graphs
```python
# WRONG - misses disconnected components
def dfs_wrong(graph, start):
    visited = set()
    dfs_util(graph, start, visited)
    return visited

# CORRECT - check all nodes
def dfs_all(graph):
    visited = set()
    
    for node in graph:  # Check ALL nodes!
        if node not in visited:
            dfs_util(graph, node, visited)
    
    return visited
```

#### 4. Stack Overflow with Recursion
```python
# WRONG - deep graphs cause overflow
def dfs_recursive(graph, node, visited):
    visited.add(node)
    
    for neighbor in graph[node]:
        dfs_recursive(graph, neighbor, visited)  # Too deep!

# Use iterative for deep graphs
def dfs_iterative(graph, start):
    visited = set([start])
    stack = [start]
    
    while stack:
        node = stack.pop()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
```

### Graph Representations Comparison

| Representation | Use Case | Pros | Cons |
|----------------|----------|------|------|
| Adjacency List | Sparse graphs | Memory efficient | Edge lookup O(V) |
| Adjacency Matrix | Dense graphs | Edge lookup O(1) | Memory O(V²) |
| Edge List | Few edges | Simple | Hard to traverse |

### Edge Cases

#### Empty Graph
```python
if not graph:
    return []
```

#### Single Node
```python
# BFS and DFS handle this naturally
# Just return [start]
```

#### Graph with Cycles
```python
# MUST use visited set!
# Without visited: infinite loop

# With visited:
visited = set()
# When visiting node, mark as visited BEFORE recursing
```

#### Multiple Sources
```python
# Start BFS from multiple nodes
queue = deque(all_start_nodes)
for node in all_start_nodes:
    visited.add(node)
```

### When to Use BFS vs DFS

| Use Case | Recommendation |
|----------|----------------|
| Shortest path (unweighted) | BFS |
| Path existence | Either |
| Cycle detection | DFS |
| Topological sort | DFS or Kahn's |
| Connected components | DFS or BFS |
| Deep trees | BFS (avoid recursion) |

### Complexity

| Operation | BFS | DFS |
|-----------|-----|-----|
| Time | O(V + E) | O(V + E) |
| Space | O(V) | O(V) |

### ⚠️ Common Patterns Checklist

| Issue | Symptom | Fix |
|-------|---------|-----|
| No visited set | Infinite loop | Add visited tracking |
| Marking too late | Revisit nodes | Mark when adding to queue/stack |
| Not checking all nodes | Missing components | Loop through all nodes |
| Wrong neighbor iteration | Missing edges | Use correct graph structure |
| Recursion depth | Stack overflow | Use iterative version |

<!-- back -->
