## BFS Level Order: Algorithm Framework

What are the implementation patterns for BFS level order traversal in trees and graphs?

<!-- front -->

---

### Binary Tree Level Order

```python
from collections import deque

def level_order_tree(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

---

### Key Components

| Component | Purpose |
|-----------|---------|
| **Queue** | Holds nodes to visit |
| **Level size** | Number of nodes in current level |
| **Inner loop** | Process entire level before next |
| **Visited set** | Prevent revisiting (graphs only) |

---

### Graph BFS Template

```python
def bfs_graph(graph, start):
    """
    graph: dict[node] -> list[neighbors]
    Returns: (distances, parents)
    """
    visited = {start}
    queue = deque([start])
    dist = {start: 0}
    parent = {start: None}
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                dist[neighbor] = dist[node] + 1
                parent[neighbor] = node
                queue.append(neighbor)
    
    return dist, parent

# Path reconstruction
def get_path(parent, target):
    path = []
    while target is not None:
        path.append(target)
        target = parent[target]
    return path[::-1]
```

---

### Multi-Source BFS

Start from multiple sources simultaneously:

```python
def multi_source_bfs(graph, sources):
    """
    Find shortest distance from any source
    """
    visited = set(sources)
    queue = deque([(s, 0) for s in sources])
    dist = {s: 0 for s in sources}
    
    while queue:
        node, d = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                dist[neighbor] = d + 1
                queue.append((neighbor, d + 1))
    
    return dist
```

**Use case:** Fill regions, spread from multiple origins

---

### 0-1 BFS (Deque Optimization)

For graphs with edge weights 0 or 1:

```python
from collections import deque

def bfs_01(graph, start):
    """
    graph[node] = list of (neighbor, weight) where weight in {0, 1}
    """
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    dq = deque([start])
    
    while dq:
        node = dq.popleft()
        
        for neighbor, weight in graph[node]:
            new_dist = dist[node] + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                if weight == 0:
                    dq.appendleft(neighbor)  # Same level
                else:
                    dq.append(neighbor)       # Next level
    
    return dist

# Complexity: O(V+E) - faster than Dijkstra for 0-1 weights
```

<!-- back -->
