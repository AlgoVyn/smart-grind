## Dijkstra's Algorithm: Tactics & Tricks

What are the essential tactics for optimizing Dijkstra's algorithm?

<!-- front -->

---

### Tactic 1: Lazy Deletion

```python
def dijkstra_lazy(graph, source):
    """
    Don't decrease-key, just add new entry
    Skip stale entries when popped
    """
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    
    pq = [(0, source)]
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # This is the lazy deletion check
        if d != dist[u]:
            continue  # Stale entry, skip
        
        for v, w in graph[u]:
            new_dist = d + w
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
    
    return dist

# Python's heapq doesn't support decrease-key
# Lazy deletion is simpler and often faster
```

---

### Tactic 2: Early Exit

```python
def dijkstra_early_exit(graph, source, target):
    """
    Stop when target reached (not all nodes)
    """
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    
    pq = [(0, source)]
    
    while pq:
        d, u = heapq.heappop(pq)
        
        if u == target:
            return d  # Found shortest path to target
        
        if d > dist[u]:
            continue
        
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    
    return -1  # Target unreachable
```

---

### Tactic 3: Bidirectional Search

```python
def bidirectional_dijkstra(graph, source, target):
    """
    Search from both ends simultaneously
    Often 2x faster
    """
    if source == target:
        return 0
    
    # Forward and backward distances
    dist_f = {source: 0}
    dist_b = {target: 0}
    
    pq_f = [(0, source)]
    pq_b = [(0, target)]
    
    best = float('inf')
    
    while pq_f or pq_b:
        # Alternate or pick smaller frontier
        if pq_f and (not pq_b or pq_f[0][0] <= pq_b[0][0]):
            best = expand_frontier(pq_f, dist_f, dist_b, best, graph)
        else:
            best = expand_frontier(pq_b, dist_b, dist_f, best, reverse_graph)
        
        if best != float('inf'):
            return best
    
    return -1

def expand_frontier(pq, dist, other_dist, best, graph):
    d, u = heapq.heappop(pq)
    
    if u in other_dist:
        best = min(best, dist[u] + other_dist[u])
    
    if d > dist.get(u, float('inf')):
        return best
    
    for v, w in graph[u]:
        new_dist = d + w
        if new_dist < dist.get(v, float('inf')):
            dist[v] = new_dist
            heapq.heappush(pq, (new_dist, v))
    
    return best
```

---

### Tactic 4: Dial's Implementation (Small Integers)

```python
def dial_dijkstra(graph, source, max_weight):
    """
    O(V + E + C) where C = max distance
    Use bucket queue for integer weights
    """
    max_dist = max_weight * len(graph)
    buckets = [[] for _ in range(max_dist + 1)]
    
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    buckets[0].append(source)
    
    curr_dist = 0
    
    while curr_dist <= max_dist:
        while buckets[curr_dist]:
            u = buckets[curr_dist].pop()
            
            if dist[u] < curr_dist:
                continue
            
            for v, w in graph[u]:
                new_dist = curr_dist + w
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    buckets[new_dist].append(v)
        
        curr_dist += 1
    
    return dist
```

---

### Tactic 5: A* Heuristic Design

```python
def design_heuristic():
    """
    Heuristic requirements:
    1. Admissible: h(n) ≤ actual cost to goal
    2. Consistent: h(n) ≤ c(n,n') + h(n')
    
    Common heuristics:
    """
    # Grid with 4-directional movement
    def manhattan(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
    
    # Grid with 8-directional movement
    def chebyshev(a, b):
        return max(abs(a[0] - b[0]), abs(a[1] - b[1]))
    
    # Geographical coordinates
    def euclidean(a, b):
        return ((a[0]-b[0])**2 + (a[1]-b[1])**2) ** 0.5
    
    # No heuristic (Dijkstra)
    def zero_heuristic(a, b):
        return 0
```

<!-- back -->
