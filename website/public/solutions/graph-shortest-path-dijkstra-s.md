# Graph - Shortest Path (Dijkstra's Algorithm)

## Overview

Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue to always expand the node with the smallest known distance, guaranteeing optimal paths.

Use this pattern when you need to:
- Find shortest paths in graphs with non-negative weights
- Calculate minimum cost paths in networks
- Solve routing problems
- Find paths with minimum total weight

Benefits include:
- Optimal for non-negative weight graphs
- Can compute paths to all nodes efficiently
- Greedy approach with priority queue optimization
- Works on both directed and undirected graphs

## Key Concepts

- **Priority Queue**: Always process node with smallest distance
- **Distance Array**: Track minimum distance to each node
- **Relaxation**: Update distances through better paths
- **Non-negative Weights**: Required for correctness
- **Greedy Choice**: Shortest path to current node is finalized

## Template

```python
import heapq

def dijkstra(graph, start, n):
    # graph: adjacency list with weights [(neighbor, weight), ...]
    # Initialize distances
    distances = [float('inf')] * n
    distances[start] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    
    while pq:
        current_dist, node = heapq.heappop(pq)
        
        # Skip if we found a better path already
        if current_dist > distances[node]:
            continue
        
        # Explore neighbors
        for neighbor, weight in graph[node]:
            distance = current_dist + weight
            
            # Relaxation: update if better path found
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances

# To get actual path, track predecessors
def dijkstra_with_path(graph, start, n):
    distances = [float('inf')] * n
    distances[start] = 0
    predecessors = [-1] * n
    
    pq = [(0, start)]
    
    while pq:
        current_dist, node = heapq.heappop(pq)
        
        if current_dist > distances[node]:
            continue
        
        for neighbor, weight in graph[node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                predecessors[neighbor] = node
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, predecessors

def reconstruct_path(predecessors, target):
    path = []
    current = target
    while current != -1:
        path.append(current)
        current = predecessors[current]
    return path[::-1] if path[0] == 0 else []
```

## Example Problems

1. **Network Delay Time (LeetCode 743)**: Find how long it takes for all nodes to receive a signal.
2. **Path with Minimum Effort (LeetCode 1631)**: Find path with minimum maximum edge weight.
3. **Cheapest Flights Within K Stops (LeetCode 787)**: Find cheapest flight route with at most K stops.

## Time and Space Complexity

- **Time Complexity**: O((V + E) log V) with binary heap priority queue.
- **Space Complexity**: O(V) for distances and priority queue.

## Common Pitfalls

- Using with negative weights (use Bellman-Ford instead)
- Not skipping outdated entries in priority queue
- Incorrect graph representation (ensure weights are included)
- Forgetting to initialize distances to infinity
- Not handling disconnected graphs (distances remain infinity)