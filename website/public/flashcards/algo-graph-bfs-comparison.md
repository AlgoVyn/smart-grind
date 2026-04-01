## Graph BFS: Comparison with Alternatives

How does BFS compare to DFS, Dijkstra, and other graph algorithms?

<!-- front -->

---

### BFS vs DFS for Graph Traversal

| Scenario | BFS | DFS |
|----------|-----|-----|
| **Shortest path (unweighted)** | ✓ Optimal | ✗ Not guaranteed |
| **Memory usage** | O(V) - queue | O(h) - recursion stack |
| **Finding any path** | Slower | May be faster |
| **Complete traversal** | Same | Same |
| **Cycle detection** | Works | Works |
| **Topological sort** | Kahn's algorithm | Post-order DFS |

```python
# BFS for shortest path
def bfs_shortest(graph, start, end):
    queue = deque([(start, 0)])
    visited = {start}
    
    while queue:
        node, dist = queue.popleft()
        if node == end:
            return dist
        for nxt in graph[node]:
            if nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, dist + 1))
    return -1

# DFS - not for shortest path
def dfs_path(graph, start, end, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    if start == end:
        return [start]
    for nxt in graph[start]:
        if nxt not in visited:
            path = dfs_path(graph, nxt, end, visited)
            if path:
                return [start] + path
    return None
```

---

### BFS vs Dijkstra

| Aspect | BFS | Dijkstra |
|--------|-----|----------|
| **Graph type** | Unweighted | Weighted (non-negative) |
| **Time** | O(V + E) | O((V + E) log V) |
| **Implementation** | Queue | Priority queue |
| **Correctness** | Optimal for unweighted | Optimal for weighted |

```python
# BFS - only for unweighted
def bfs(graph, start):
    dist = {start: 0}
    queue = deque([start])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                queue.append(v)
    return dist

# Dijkstra - weighted graphs
import heapq
def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist
```

---

### When to Use Each Algorithm

| Problem | Best Algorithm | Why |
|---------|----------------|-----|
| **Unweighted shortest path** | BFS | O(V + E), simple |
| **Weighted shortest path** | Dijkstra | Handles weights |
| **Negative weights** | Bellman-Ford | Handles negatives |
| **All-pairs shortest** | Floyd-Warshall | Dense graphs |
| **Bipartite check** | BFS or DFS | Either works |
| **Connected components** | BFS or DFS | Either works |
| **Level-order traversal** | BFS | Natural fit |

---

### Bidirectional BFS vs Regular BFS

```python
# Regular BFS: explores all nodes up to distance d
def regular_bvs(nodes_at_distance_d):
    return sum(nodes_at_distance_d[i] for i in range(d + 1))

# Bidirectional BFS: meets in the middle
def bidirectional_complexity(nodes_at_distance_d):
    # Each side explores up to d/2
    return 2 * sum(nodes_at_distance_d[i] for i in range(d // 2 + 1))

# Speedup factor can be exponential in branching factor
```

| Graph Type | Regular BFS | Bidirectional BFS | Speedup |
|------------|-------------|-------------------|---------|
| **Grid (b=4)** | O(r²) | O(r) | ~r |
| **Tree (b=10)** | O(b^d) | O(b^(d/2)) | ~b^(d/2) |
| **Social network** | O(million) | O(thousand) | ~1000x |

<!-- back -->
