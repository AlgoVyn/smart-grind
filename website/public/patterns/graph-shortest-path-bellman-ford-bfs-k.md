# Graph - Shortest Path (Bellman-Ford / BFS+K)

## Overview

This pattern covers two related shortest path algorithms: Bellman-Ford for graphs with negative weights, and BFS with constraints (like at most K stops). Bellman-Ford can detect negative cycles, while BFS+K limits the number of edges in the path.

Use this pattern when you need to:
- Handle graphs with negative edge weights
- Detect negative weight cycles
- Find shortest paths with limited stops/edges
- Solve problems with cost constraints

Benefits include:
- Handles negative weights (Bellman-Ford)
- Can detect negative cycles
- BFS+K provides exact stop limits
- More flexible than Dijkstra for certain constraints

## Key Concepts

- **Bellman-Ford**: Relax all edges V-1 times, detect negative cycles
- **BFS+K**: Use BFS with distance/stops tracking
- **Relaxation**: Update distances through all possible paths
- **Negative Cycles**: If distances improve after V-1 iterations
- **Stop Constraints**: Track number of edges used

## Template

```python
# Bellman-Ford Algorithm
def bellman_ford(graph, start, n):
    # graph: list of (u, v, weight) edges
    distances = [float('inf')] * n
    distances[start] = 0
    
    # Relax all edges V-1 times
    for _ in range(n - 1):
        for u, v, weight in graph:
            if distances[u] != float('inf') and distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
    
    # Check for negative cycles
    for u, v, weight in graph:
        if distances[u] != float('inf') and distances[u] + weight < distances[v]:
            return None  # Negative cycle detected
    
    return distances

# BFS with at most K stops
from collections import deque

def find_cheapest_price(n, flights, src, dst, k):
    # flights: list of [from, to, price]
    # Create adjacency list
    graph = [[] for _ in range(n)]
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # Distance array: (cost, stops)
    distances = [[float('inf'), k+1] for _ in range(n)]
    distances[src] = [0, 0]
    
    # Queue: (node, cost, stops)
    queue = deque([(src, 0, 0)])
    
    while queue:
        node, cost, stops = queue.popleft()
        
        if stops > k:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            new_stops = stops + 1
            
            # Update if better cost with <= k stops
            if new_stops <= k + 1 and new_cost < distances[neighbor][0]:
                distances[neighbor] = [new_cost, new_stops]
                queue.append((neighbor, new_cost, new_stops))
    
    return distances[dst][0] if distances[dst][0] != float('inf') else -1

# Alternative BFS+K with priority (Dijkstra-like but with stops)
import heapq

def cheapest_with_stops(graph, src, dst, k):
    # graph: adj list [(neighbor, price), ...]
    # Use priority queue: (cost, stops, node)
    pq = [(0, 0, src)]  # cost, stops, node
    min_cost = [[float('inf')] * (k + 2) for _ in range(len(graph))]
    min_cost[src][0] = 0
    
    while pq:
        cost, stops, node = heapq.heappop(pq)
        
        if node == dst:
            return cost
        
        if stops > k or cost > min_cost[node][stops]:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            new_stops = stops + 1
            
            if new_stops <= k + 1 and new_cost < min_cost[neighbor][new_stops]:
                min_cost[neighbor][new_stops] = new_cost
                heapq.heappush(pq, (new_cost, new_stops, neighbor))
    
    return -1
```

## Example Problems

1. **Cheapest Flights Within K Stops (LeetCode 787)**: Find cheapest flight with at most K stops.
2. **Network Delay Time (LeetCode 743)**: With possible negative weights (though usually positive).
3. **Path with Maximum Probability (LeetCode 1514)**: Can be adapted for negative log probabilities.

## Time and Space Complexity

- **Bellman-Ford**: O(V * E) time, O(V) space.
- **BFS+K**: O(V * K) or O(E * K) depending on implementation.

## Common Pitfalls

- Bellman-Ford requires V-1 iterations, not less
- Not detecting negative cycles properly
- In BFS+K, confusing stops with edges (stops = edges - 1)
- Using Dijkstra when negative weights exist
- Forgetting to check stop limits in BFS variants