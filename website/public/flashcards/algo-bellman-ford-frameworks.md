## Bellman-Ford: Algorithm Framework

What is the complete Bellman-Ford implementation, and how do you implement negative cycle detection?

<!-- front -->

---

### Algorithm Template

```python
def bellman_ford(vertices, edges, source):
    """
    vertices: list or count of vertices
    edges: list of (u, v, weight) tuples
    source: starting vertex
    
    Returns: (distances, predecessors) or raises error if negative cycle
    """
    n = len(vertices) if isinstance(vertices, list) else vertices
    
    # Initialize
    dist = {v: float('inf') for v in vertices}
    pred = {v: None for v in vertices}
    dist[source] = 0
    
    # Relax edges V-1 times
    for i in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                pred[v] = u
                updated = True
        
        if not updated:
            break  # Early termination optimization
    
    # Check for negative cycles
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            raise ValueError("Negative cycle detected")
    
    return dist, pred
```

---

### Structure Components

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| **Distance array** | Best known distance from source | Dict or array, init ∞ |
| **Predecessor array** | Track path reconstruction | Updated on each relax |
| **Edge list** | All edges for iteration | List of (u,v,w) tuples |
| **Relaxation loop** | V-1 iterations | Early exit if no updates |
| **Cycle check** | Final verification | One more pass over edges |

---

### Path Reconstruction

```python
def get_path(pred, source, target):
    """Reconstruct path from source to target"""
    if pred[target] is None and target != source:
        return None  # No path
    
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = pred[current]
        if len(path) > len(pred):  # Safety check
            return None  # Negative cycle in path
    
    return path[::-1]
```

---

### Edge Cases

| Case | Handling |
|------|----------|
| Disconnected nodes | Distance stays ∞ |
| Source unreachable to negative cycle | Algorithm succeeds for reachable |
| Self-loop negative | Detected as negative cycle |
| Zero-weight cycles | No problem (not negative) |
| Multiple edges between nodes | All considered separately |

---

### SPFA Optimization

Queue-based variant often faster in practice:

```python
from collections import deque

def spfa(vertices, edges, source):
    """Shortest Path Faster Algorithm"""
    n = len(vertices)
    dist = {v: float('inf') for v in vertices}
    in_queue = {v: False for v in vertices}
    count = {v: 0 for v in vertices}  # Relax count for cycle detection
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    # Build adjacency list
    adj = {v: [] for v in vertices}
    for u, v, w in edges:
        adj[u].append((v, w))
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
                    count[v] += 1
                    if count[v] >= n:
                        raise ValueError("Negative cycle")
    
    return dist
```

<!-- back -->
