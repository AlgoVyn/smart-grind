## Graph - Shortest Path Dijkstra: Tactics

What are the advanced techniques and variations for Dijkstra's algorithm?

<!-- front -->

---

### Tactic 1: Early Termination for Single Target

Stop when the target node is popped from the priority queue (not when pushed).

```python
def dijkstra_early_termination(n, edges, source, target):
    """Stop early when target is reached."""
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    dist[source] = 0
    pq = [(0, source)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        # Early termination: target reached with optimal distance
        if node == target:
            return d
        
        if d > dist[node]:
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return -1  # Target unreachable
```

**Why it works:** When a node is popped from the min-heap, its distance is finalized.

---

### Tactic 2: Dijkstra with Set (For Dense Graphs)

Use a sorted set to efficiently update distances in dense graphs.

```python
import sortedcontainers

def dijkstra_set(n, edges, source):
    """Dijkstra using sorted set for dense graphs."""
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Sorted set allows O(log V) removal of old entries
    s = sortedcontainers.SortedSet()
    s.add((0, source))
    
    while s:
        d, node = s.pop(0)
        
        for neighbor, w in graph[node]:
            new_dist = d + w
            if new_dist < dist[neighbor]:
                # Remove old entry if exists
                if dist[neighbor] != float('inf'):
                    s.discard((dist[neighbor], neighbor))
                dist[neighbor] = new_dist
                s.add((new_dist, neighbor))
    
    return dist
```

**When to use:** Dense graphs with frequent distance updates.

---

### Tactic 3: Modified Dijkstra for Path with Minimum Effort

For problems minimizing the maximum edge weight along the path.

```python
import heapq

def minimum_effort_path(heights):
    """
    LeetCode 1631: Path With Minimum Effort
    Minimize the maximum absolute difference between consecutive cells.
    """
    rows, cols = len(heights), len(heights[0])
    
    # dist[r][c] = minimum effort to reach (r, c)
    dist = [[float('inf')] * cols for _ in range(rows)]
    dist[0][0] = 0
    
    # Priority queue: (effort, row, col)
    pq = [(0, 0, 0)]
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while pq:
        effort, r, c = heapq.heappop(pq)
        
        if r == rows - 1 and c == cols - 1:
            return effort
        
        if effort > dist[r][c]:
            continue
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                # New effort is max of current effort and edge weight
                new_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))
                if new_effort < dist[nr][nc]:
                    dist[nr][nc] = new_effort
                    heapq.heappush(pq, (new_effort, nr, nc))
    
    return -1
```

**Key insight:** The "distance" is the maximum edge weight encountered on the path.

---

### Tactic 4: Dijkstra with State (K Stops)

For problems with additional constraints like maximum stops.

```python
def find_cheapest_price(n, flights, src, dst, k):
    """
    LeetCode 787: Cheapest Flights Within K Stops
    Find cheapest price from src to dst with at most k stops.
    """
    graph = [[] for _ in range(n)]
    for u, v, w in flights:
        graph[u].append((v, w))
    
    # Priority queue: (cost, node, stops)
    pq = [(0, src, 0)]
    
    # Track best cost for each (node, stops) state
    # dist[node] = minimum cost to reach node with ≤ k stops
    
    while pq:
        cost, node, stops = heapq.heappop(pq)
        
        if node == dst:
            return cost
        
        if stops > k:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            heapq.heappush(pq, (new_cost, neighbor, stops + 1))
    
    return -1
```

**Key insight:** State includes stops, allowing constraint enforcement.

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not skipping outdated entries** | Reprocessing nodes, TLE | Check `if d > dist[node]: continue` |
| **Using with negative weights** | Wrong answer | Use Bellman-Ford instead |
| **Forgetting infinity initialization** | Wrong distances | Set `dist[i] = float('inf')` |
| **Not handling disconnected nodes** | Runtime error | Check `dist[target] == inf` |
| **Wrong heap ordering** | Wrong node popped | Use min-heap, not max-heap |
| **Early exit on push** | Non-optimal result | Exit on pop, not push |

---

### Tactic 6: Multi-Source Dijkstra

Find shortest paths from multiple sources simultaneously.

```python
def multi_source_dijkstra(n, edges, sources):
    """Find shortest distance from any source to all nodes."""
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    pq = []
    
    # Initialize all sources with distance 0
    for src in sources:
        dist[src] = 0
        heapq.heappush(pq, (0, src))
    
    while pq:
        d, node = heapq.heappop(pq)
        
        if d > dist[node]:
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return dist
```

**Use case:** Find closest facility (hospital, store) from any location.

<!-- back -->
