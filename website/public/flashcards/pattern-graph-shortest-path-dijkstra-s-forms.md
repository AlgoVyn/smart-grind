## Graph - Shortest Path Dijkstra: Problem Forms

What are the common variations and problem types for Dijkstra's algorithm?

<!-- front -->

---

### Form 1: Network Delay Time

**Classic Dijkstra: Time for signal to reach all nodes**

```python
def network_delay_time(times, n, k):
    """
    LeetCode 743: Network Delay Time
    Return time for all nodes to receive signal from node k.
    """
    graph = [[] for _ in range(n + 1)]
    for u, v, w in times:
        graph[u].append((v, w))
    
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist[node]:
            continue
        for neighbor, w in graph[node]:
            new_dist = d + w
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    max_dist = max(dist[1:])
    return max_dist if max_dist != float('inf') else -1
```

**Key variation:** Return max distance instead of distance array.

---

### Form 2: Path with Minimum Effort

**Modified Dijkstra: Minimize maximum edge weight**

```python
def minimum_effort_path(heights):
    """
    LeetCode 1631: Path With Minimum Effort
    Minimize the maximum absolute difference between cells.
    """
    rows, cols = len(heights), len(heights[0])
    dist = [[float('inf')] * cols for _ in range(rows)]
    dist[0][0] = 0
    pq = [(0, 0, 0)]  # (effort, row, col)
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
                new_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))
                if new_effort < dist[nr][nc]:
                    dist[nr][nc] = new_effort
                    heapq.heappush(pq, (new_effort, nr, nc))
```

**Key variation:** Distance is max edge weight on path, not sum.

---

### Form 3: Cheapest Flights Within K Stops

**Constrained Dijkstra: Maximum stops limit**

```python
def find_cheapest_price(n, flights, src, dst, k):
    """
    LeetCode 787: Cheapest Flights Within K Stops
    Find cheapest price with at most k stops.
    """
    graph = [[] for _ in range(n)]
    for u, v, w in flights:
        graph[u].append((v, w))
    
    # (cost, node, stops)
    pq = [(0, src, 0)]
    
    while pq:
        cost, node, stops = heapq.heappop(pq)
        if node == dst:
            return cost
        if stops > k:
            continue
        for neighbor, price in graph[node]:
            heapq.heappush(pq, (cost + price, neighbor, stops + 1))
    
    return -1
```

**Key variation:** State includes stops constraint.

---

### Form 4: The Maze II

**Dijkstra on implicit graph: Ball rolls until hit wall**

```python
def shortest_distance(maze, start, destination):
    """
    LeetCode 505: The Maze II
    Ball rolls until hitting a wall. Find shortest distance.
    """
    rows, cols = len(maze), len(maze[0])
    dist = [[float('inf')] * cols for _ in range(rows)]
    dist[start[0]][start[1]] = 0
    pq = [(0, start[0], start[1])]
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while pq:
        d, r, c = heapq.heappop(pq)
        if [r, c] == destination:
            return d
        if d > dist[r][c]:
            continue
        for dr, dc in directions:
            nr, nc = r, c
            steps = 0
            # Roll until hitting wall
            while 0 <= nr + dr < rows and 0 <= nc + dc < cols and maze[nr + dr][nc + dc] == 0:
                nr += dr
                nc += dc
                steps += 1
            if d + steps < dist[nr][nc]:
                dist[nr][nc] = d + steps
                heapq.heappush(pq, (d + steps, nr, nc))
    
    return -1
```

**Key variation:** Neighbors found by rolling, not single-step.

---

### Form 5: Find the City With Smallest Number of Neighbors

**All-pairs via Dijkstra: Run from each node**

```python
def find_the_city(n, edges, distance_threshold):
    """
    LeetCode 1334: Find City With Smallest Number of Neighbors
    Run Dijkstra from each node to count reachable cities.
    """
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    def dijkstra(src):
        dist = [float('inf')] * n
        dist[src] = 0
        pq = [(0, src)]
        while pq:
            d, node = heapq.heappop(pq)
            if d > dist[node]:
                continue
            for neighbor, w in graph[node]:
                new_dist = d + w
                if new_dist < dist[neighbor]:
                    dist[neighbor] = new_dist
                    heapq.heappush(pq, (new_dist, neighbor))
        return dist
    
    min_neighbors = float('inf')
    result_city = -1
    
    for city in range(n):
        dist = dijkstra(city)
        count = sum(1 for d in dist if d <= distance_threshold and d > 0)
        if count <= min_neighbors:
            min_neighbors = count
            result_city = city
    
    return result_city
```

**Key variation:** Run Dijkstra from each node (all-pairs variant).

---

### Form 6: Minimum Weighted Subgraph With Required Paths

**Multi-source Dijkstra: Multiple path constraints**

```python
def minimum_weight(n, edges, src1, src2, dest):
    """
    LeetCode 2203: Minimum Weighted Subgraph With Required Paths
    Find minimum weight subgraph with paths from src1→dest and src2→dest.
    """
    # Build forward and reverse graphs
    graph = [[] for _ in range(n)]
    rev_graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
        rev_graph[v].append((u, w))
    
    def dijkstra(g, src):
        dist = [float('inf')] * n
        dist[src] = 0
        pq = [(0, src)]
        while pq:
            d, node = heapq.heappop(pq)
            if d > dist[node]:
                continue
            for neighbor, w in g[node]:
                new_dist = d + w
                if new_dist < dist[neighbor]:
                    dist[neighbor] = new_dist
                    heapq.heappush(pq, (new_dist, neighbor))
        return dist
    
    # Run Dijkstra from src1, src2, and dest (on reverse graph)
    dist1 = dijkstra(graph, src1)
    dist2 = dijkstra(graph, src2)
    dist_dest = dijkstra(rev_graph, dest)
    
    # Find best meeting point
    ans = float('inf')
    for i in range(n):
        if dist1[i] != float('inf') and dist2[i] != float('inf') and dist_dest[i] != float('inf'):
            ans = min(ans, dist1[i] + dist2[i] + dist_dest[i])
    
    return ans if ans != float('inf') else -1
```

**Key variation:** Multiple Dijkstra runs from different sources + reverse graph.

---

### Problem Identification Guide

| Problem Pattern | Key Characteristics | Solution Form |
|-----------------|---------------------|---------------|
| "Network delay" | Signal propagation | Standard Dijkstra, return max |
| "Minimum effort" | Minimize max edge | Modified distance metric |
| "Within K stops" | Path constraint | State-based Dijkstra |
| "Maze with rolling ball" | Implicit neighbors | Roll until wall |
| "City with fewest neighbors" | All-pairs counting | Run Dijkstra from each node |
| "Required paths" | Multiple sources | Multi-source + reverse graph |
| "Shortest path" + weighted | Edge weights | Standard Dijkstra |
| "Cheapest flight" | Cost optimization | Dijkstra with constraints |

<!-- back -->
