## Graph - Shortest Path (Bellman-Ford / BFS with K stops): Framework

What is the complete code template for Bellman-Ford and BFS with K stops?

<!-- front -->

---

### Framework 1: Bellman-Ford Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  BELLMAN-FORD ALGORITHM - TEMPLATE                         │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: dist[node] = ∞ for all, dist[source] = 0     │
│  2. Relax edges V-1 times:                                   │
│     for i in range(V - 1):                                  │
│         updated = false                                      │
│         for each edge (u, v, weight):                        │
│             if dist[u] + weight < dist[v]:                  │
│                 dist[v] = dist[u] + weight                 │
│                 updated = true                               │
│         if not updated: break  // Early termination          │
│  3. Check for negative cycles:                              │
│     for each edge (u, v, weight):                            │
│         if dist[u] + weight < dist[v]:                      │
│             return None  // Negative cycle detected         │
│  4. Return dist array                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Bellman-Ford

```python
def bellman_ford(n: int, edges: list[list[int]], source: int) -> list[int]:
    """
    Bellman-Ford: O(V * E) time, O(V) space
    Returns distances or None if negative cycle exists
    """
    # Initialize distances
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Relax edges V-1 times
    for _ in range(n - 1):
        updated = False
        for u, v, weight in edges:
            if dist[u] != float('inf') and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                updated = True
        if not updated:  # Early termination
            break
    
    # Check for negative cycles
    for u, v, weight in edges:
        if dist[u] != float('inf') and dist[u] + weight < dist[v]:
            return None  # Negative cycle detected
    
    return dist
```

---

### Framework 2: BFS with K Stops (Limited Edges)

```
┌─────────────────────────────────────────────────────────────┐
│  BFS WITH K STOPS - TEMPLATE                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Build adjacency list from edge list                      │
│  2. Initialize queue: [(cost, node, stops)]                  │
│  3. Initialize dist array with ∞                             │
│  4. While queue not empty:                                   │
│     a. (cost, node, stops) = queue.popleft()                │
│     b. If stops > K: continue                                │
│     c. For each (neighbor, price) of node:                │
│        - new_cost = cost + price                           │
│        - new_stops = stops + 1                              │
│        - If new_cost < dist[neighbor]:                      │
│           * dist[neighbor] = new_cost                       │
│           * queue.append((new_cost, neighbor, new_stops))   │
│  5. Return dist[destination]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: BFS with K Stops

```python
from collections import deque, defaultdict

def find_cheapest_price(n: int, flights: list[list[int]], 
                         src: int, dst: int, k: int) -> int:
    """
    Find cheapest flight with at most K stops.
    Time: O(V * K), Space: O(V)
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # BFS: (cost, node, stops)
    queue = deque([(0, src, 0)])
    dist = [float('inf')] * n
    dist[src] = 0
    
    while queue:
        cost, node, stops = queue.popleft()
        
        if stops > k:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            new_stops = stops + 1
            
            if new_stops <= k + 1 and new_cost < dist[neighbor]:
                dist[neighbor] = new_cost
                queue.append((new_cost, neighbor, new_stops))
    
    return dist[dst] if dist[dst] != float('inf') else -1
```

---

### Key Pattern Elements

| Element | Bellman-Ford | BFS with K Stops |
|---------|--------------|------------------|
| Queue | None (edge iteration) | Queue with (cost, node, stops) |
| Iterations | V-1 times over all edges | Level by level (stops) |
| Early Exit | No updates in iteration | Stops > K |
| Cycle Detection | Yes (V-th iteration) | Not needed (K limits) |
| State Tracking | Distance only | (distance, stops) |

<!-- back -->