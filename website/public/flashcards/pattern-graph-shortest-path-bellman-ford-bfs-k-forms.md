## Graph - Shortest Path (Bellman-Ford / BFS with K stops): Forms

What are the different variations of shortest path with negative weights and K constraints?

<!-- front -->

---

### Form 1: Basic Bellman-Ford (Single Source)

Find shortest distances from source to all nodes.

```python
def bellman_ford_basic(n, edges, source):
    """Basic Bellman-Ford: return distances or None if negative cycle."""
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None
    
    return dist
```

**Example**: Network Delay Time (LeetCode 743)

---

### Form 2: Cheapest Flights Within K Stops

Find cheapest price from source to destination with at most K stops.

```python
from collections import deque, defaultdict

def find_cheapest_price(n, flights, src, dst, k):
    """LeetCode 787 - BFS with K stops constraint."""
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # Queue: (cost, node, stops)
    queue = deque([(0, src, 0)])
    min_cost = [float('inf')] * n
    min_cost[src] = 0
    
    while queue:
        cost, node, stops = queue.popleft()
        
        if stops > k:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            if new_cost < min_cost[neighbor]:
                min_cost[neighbor] = new_cost
                queue.append((new_cost, neighbor, stops + 1))
    
    return min_cost[dst] if min_cost[dst] != float('inf') else -1
```

**Key**: Stops limit maps to BFS levels

---

### Form 3: Path with Maximum Probability

Find path with maximum success probability (log transform to shortest path).

```python
import heapq
from collections import defaultdict

def max_probability(n, edges, succ_prob, start, end):
    """LeetCode 1514 - Use max-heap with log probabilities."""
    graph = defaultdict(list)
    for (u, v), p in zip(edges, succ_prob):
        graph[u].append((v, p))
        graph[v].append((u, p))
    
    # Max probability = shortest path with -log(p) weights
    # Use max-heap directly with negated probabilities
    dist = [0.0] * n
    dist[start] = 1.0
    pq = [(-1.0, start)]  # Max-heap using negative
    
    while pq:
        prob, node = heapq.heappop(pq)
        prob = -prob
        
        if node == end:
            return prob
        
        if prob < dist[node]:
            continue
        
        for neighbor, edge_prob in graph[node]:
            new_prob = prob * edge_prob
            if new_prob > dist[neighbor]:
                dist[neighbor] = new_prob
                heapq.heappush(pq, (-new_prob, neighbor))
    
    return 0.0
```

**Key**: Multiply probabilities instead of adding weights

---

### Form 4: Minimum Cost to Reach Destination in Time

Find minimum cost path within time constraint (2D DP state).

```python
def min_cost_to_destination(n, highways, maxTime):
    """LeetCode 1928 - Cost and time as constraints."""
    from collections import defaultdict
    import heapq
    
    graph = defaultdict(list)
    for u, v, time, cost in highways:
        graph[u].append((v, time, cost))
        graph[v].append((u, time, cost))
    
    # State: (total_time, node) -> min_cost
    # Use Dijkstra-like with time as distance, track min cost
    dist = [[float('inf')] * n for _ in range(maxTime + 1)]
    dist[0][0] = 0
    pq = [(0, 0, 0)]  # (cost, time, node)
    
    while pq:
        cost, time, node = heapq.heappop(pq)
        
        if node == n - 1:
            return cost
        
        if cost > dist[time][node]:
            continue
        
        for neighbor, travel_time, travel_cost in graph[node]:
            new_time = time + travel_time
            new_cost = cost + travel_cost
            
            if new_time <= maxTime and new_cost < dist[new_time][neighbor]:
                dist[new_time][neighbor] = new_cost
                heapq.heappush(pq, (new_cost, new_time, neighbor))
    
    return -1
```

**Key**: 2D state (time, node) instead of just node

---

### Form 5: Find the City With Smallest Number of Neighbors

Find city with minimum reachable cities within distance threshold.

```python
def find_the_city(n, edges, distance_threshold):
    """LeetCode 1334 - All-pairs shortest path variant."""
    # Floyd-Warshall for all-pairs
    dist = [[float('inf')] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
        dist[v][u] = min(dist[v][u], w)
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    # Find city with minimum reachable cities
    min_reachable = n
    result = -1
    
    for i in range(n):
        reachable = sum(1 for j in range(n) 
                       if i != j and dist[i][j] <= distance_threshold)
        if reachable <= min_reachable:
            min_reachable = reachable
            result = i
    
    return result
```

**Key**: Use all-pairs shortest path, then analyze reachability

---

### Form 6: Shortest Path with Alternating Colors

Find shortest path with edge color constraints.

```python
from collections import deque, defaultdict

def shortest_alternating_paths(n, red_edges, blue_edges):
    """LeetCode 1129 - Track color of last edge taken."""
    red = defaultdict(list)
    blue = defaultdict(list)
    
    for u, v in red_edges:
        red[u].append(v)
    for u, v in blue_edges:
        blue[u].append(v)
    
    # State: (node, last_color) where 0=red, 1=blue, -1=none
    dist = [[-1, -1] for _ in range(n)]
    dist[0] = [0, 0]  # Start with either color (0 distance)
    
    queue = deque([(0, 0), (0, 1)])  # (node, last_color)
    
    while queue:
        node, color = queue.popleft()
        
        # Next edge must be opposite color
        next_color = 1 - color
        next_graph = red if next_color == 0 else blue
        
        for neighbor in next_graph[node]:
            if dist[neighbor][next_color] == -1:
                dist[neighbor][next_color] = dist[node][color] + 1
                queue.append((neighbor, next_color))
    
    # Return min distance considering either ending color
    return [max(d) if min(d) == -1 else min(d) if max(d) == -1 
            else min(d) for d in dist]
```

**Key**: State includes edge color constraint

---

### Form Comparison

| Form | Key Constraint | Algorithm | State Extension |
|------|----------------|-----------|-----------------|
| Basic shortest path | None | Bellman-Ford | Node only |
| K stops limit | Max K edges | BFS | (node, stops) |
| Max probability | Multiply weights | Modified Dijkstra | Probability instead of sum |
| Time + cost | Two constraints | 2D Dijkstra | (node, time) |
| Threshold reachability | Distance limit | Floyd-Warshall | All-pairs analysis |
| Alternating colors | Edge color | BFS with state | (node, last_color) |

<!-- back -->