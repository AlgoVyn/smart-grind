# Dijkstra's Algorithm

## Category
Graphs

## Description

Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It is a fundamental greedy algorithm that uses a priority queue (min-heap) to always process the vertex with the smallest known distance first.

This algorithm is the backbone of many navigation systems, network routing protocols, and pathfinding applications. It elegantly combines the greedy approach with relaxation to efficiently compute shortest paths, making it essential for competitive programming and technical interviews involving graph problems.

---

## Concepts

The Dijkstra's algorithm is built on several fundamental concepts that make it powerful for solving shortest path problems.

### 1. Greedy Selection

At each step, Dijkstra's selects the unvisited vertex with the smallest known distance:

```
Key Property: Once a vertex is extracted from the priority queue,
its shortest distance is FINAL and cannot be improved.

Why? All edge weights are non-negative, so any alternative path
would have to go through a vertex with distance >= current.
```

### 2. Relaxation

The process of updating shortest distances:

```
For each neighbor v of current vertex u:
    new_distance = dist[u] + weight(u, v)
    if new_distance < dist[v]:
        dist[v] = new_distance  # Relaxation
        update priority queue
```

### 3. Priority Queue Operations

| Operation | Time | Description |
|-----------|------|-------------|
| **Extract Min** | O(log V) | Remove vertex with minimum distance |
| **Decrease Key** | O(log V) | Update distance of a vertex |
| **Insert** | O(log V) | Add new vertex to queue |

### 4. Distance State

Track shortest known distance to each vertex:

| State | Initial Value | Final Value |
|-------|---------------|---------------|
| **Source** | 0 | 0 (unchanged) |
| **Reachable** | ∞ | Shortest path distance |
| **Unreachable** | ∞ | ∞ (remains infinity) |

---

## Frameworks

Structured approaches for solving shortest path problems.

### Framework 1: Standard Dijkstra's

```
┌─────────────────────────────────────────────────────┐
│  STANDARD DIJKSTRA'S FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize:                                      │
│     - dist[source] = 0                               │
│     - dist[v] = ∞ for all other vertices             │
│     - priority_queue = [(0, source)]                 │
│     - visited = empty set                            │
│  2. While queue not empty:                           │
│     a. Extract (d, u) with minimum d                 │
│     b. If u in visited: continue                     │
│     c. Mark u as visited                             │
│     d. For each neighbor v of u:                     │
│        - new_dist = d + weight(u, v)                 │
│        - If new_dist < dist[v]:                      │
│          * dist[v] = new_dist                        │
│          * push (new_dist, v) to queue               │
│  3. Return dist array                                │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard shortest path from single source to all vertices.

### Framework 2: Dijkstra's with Path Reconstruction

```
┌─────────────────────────────────────────────────────┐
│  DIJKSTRA'S WITH PATH FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  1. Initialize distances and parent array:           │
│     - dist[source] = 0, parent[source] = null      │
│     - dist[v] = ∞, parent[v] = undefined             │
│     - priority_queue = [(0, source)]               │
│  2. While queue not empty:                           │
│     a. Extract (d, u) with minimum d                 │
│     b. If d > dist[u]: continue (stale entry)       │
│     c. For each neighbor v of u:                     │
│        - new_dist = d + weight(u, v)                 │
│        - If new_dist < dist[v]:                      │
│          * dist[v] = new_dist                        │
│          * parent[v] = u                             │
│          * push (new_dist, v) to queue               │
│  3. To reconstruct path from source to v:            │
│     - Follow parent pointers from v to source        │
│     - Reverse the path                               │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need the actual shortest path, not just distances.

### Framework 3: Early Termination Dijkstra's

```
┌─────────────────────────────────────────────────────┐
│  EARLY TERMINATION DIJKSTRA'S FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Initialize as standard Dijkstra's              │
│  2. While queue not empty:                           │
│     a. Extract (d, u) with minimum d                 │
│     b. If u == target: return dist[target]          │
│        (Early exit - found shortest to target)       │
│     c. Process neighbors as usual                    │
│  3. Return dist[target] or ∞ if unreachable          │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you only need the path to a specific target, not all vertices.

---

## Forms

Different manifestations of Dijkstra's algorithm.

### Form 1: Standard Implementation

Basic Dijkstra's with priority queue.

| Aspect | Details |
|--------|---------|
| Time | O((V + E) log V) |
| Space | O(V) |
| Use Case | General shortest path |

### Form 2: Dense Graph Optimization

For dense graphs (E ≈ V²), use array instead of heap:

| Aspect | Details |
|--------|---------|
| Time | O(V²) |
| Space | O(V) |
| Use Case | Dense graphs where E = O(V²) |

### Form 3: 0-1 BFS (Special Case)

When all edge weights are 0 or 1, use deque:

| Aspect | Details |
|--------|---------|
| Time | O(V + E) |
| Space | O(V) |
| Use Case | Graphs with only 0/1 edge weights |

### Form 4: Multi-Source Dijkstra's

Run from multiple sources simultaneously:

```
Initialize: Push all sources with distance 0
Result: For each vertex, find nearest source and distance
Use Case: Voronoi diagrams, nearest facility queries
```

### Form 5: Bidirectional Dijkstra's

Run from both source and target:

```
Run forward from source, backward from target
Stop when searches meet
Result: Often faster for single-pair shortest path
Use Case: Route finding in large graphs
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Stale Entry Handling

Multiple entries for same vertex in priority queue:

```python
def dijkstra_handle_stale(graph, source):
    """Handle stale entries in priority queue."""
    import heapq
    
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    heap = [(0, source)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        # Skip if we've already found a better path
        if d > dist[u]:
            continue  # Stale entry - skip
        
        for v, weight in graph[u]:
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))
    
    return dist
```

### Tactic 2: Path Reconstruction

Track parents to reconstruct shortest path:

```python
def dijkstra_with_path(graph, source, target):
    """Dijkstra's with path reconstruction."""
    import heapq
    
    dist = {v: float('inf') for v in graph}
    parent = {v: None for v in graph}
    dist[source] = 0
    
    heap = [(0, source)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        if u == target:
            break  # Found shortest path to target
        
        if d > dist[u]:
            continue
        
        for v, weight in graph[u]:
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                parent[v] = u
                heapq.heappush(heap, (new_dist, v))
    
    # Reconstruct path
    if dist[target] == float('inf'):
        return None  # No path
    
    path = []
    curr = target
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    path.reverse()
    
    return path, dist[target]
```

### Tactic 3: 0-1 BFS Optimization

Use deque for graphs with only 0/1 weights:

```python
from collections import deque

def zero_one_bfs(graph, source):
    """BFS for graphs with 0/1 edge weights."""
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    dq = deque([source])
    
    while dq:
        u = dq.popleft()
        
        for v, weight in graph[u]:
            if weight not in (0, 1):
                raise ValueError("Only 0/1 weights allowed")
            
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                if weight == 0:
                    dq.appendleft(v)  # Priority for 0-weight edges
                else:
                    dq.append(v)
    
    return dist
```

### Tactic 4: Early Termination

Stop when target is reached:

```python
def dijkstra_early_termination(graph, source, target):
    """Stop early when target is reached."""
    import heapq
    
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    heap = [(0, source)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        if u == target:
            return d  # Found shortest path to target
        
        if d > dist[u]:
            continue
        
        for v, weight in graph[u]:
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))
    
    return float('inf')  # Target unreachable
```

### Tactic 5: Handling Large Graphs

Memory-efficient implementation:

```python
def dijkstra_memory_efficient(graph, source, max_vertices):
    """Memory-efficient for large graphs."""
    import heapq
    
    # Use arrays instead of dicts for contiguous vertex IDs
    dist = [float('inf')] * max_vertices
    visited = [False] * max_vertices
    dist[source] = 0
    
    heap = [(0, source)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        if visited[u]:
            continue
        visited[u] = True
        
        for v, weight in graph[u]:
            if not visited[v] and d + weight < dist[v]:
                dist[v] = d + weight
                heapq.heappush(heap, (dist[v], v))
    
    return dist
```

---

## Python Templates

### Template 1: Standard Dijkstra's

```python
import heapq
from typing import Dict, List, Tuple

def dijkstra(graph: Dict[int, List[Tuple[int, int]]], source: int) -> Dict[int, float]:
    """
    Standard Dijkstra's shortest path algorithm.
    
    Args:
        graph: Adjacency list {vertex: [(neighbor, weight), ...]}
        source: Starting vertex
    
    Returns:
        Dictionary mapping each vertex to its shortest distance from source
    
    Time: O((V + E) log V), Space: O(V)
    """
    # Initialize distances
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    
    # Min-heap: (distance, vertex)
    heap = [(0, source)]
    visited = set()
    
    while heap:
        d, u = heapq.heappop(heap)
        
        # Skip if already processed
        if u in visited:
            continue
        visited.add(u)
        
        # Skip stale entries
        if d > dist[u]:
            continue
        
        # Relax neighbors
        for v, weight in graph.get(u, []):
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))
    
    return dist
```

### Template 2: Dijkstra's with Path Reconstruction

```python
import heapq
from typing import Dict, List, Tuple, Optional

def dijkstra_with_path(graph: Dict[int, List[Tuple[int, int]]], 
                       source: int, 
                       target: Optional[int] = None) -> Tuple[Dict[int, float], Dict[int, Optional[int]]]:
    """
    Dijkstra's with path reconstruction.
    
    Returns:
        Tuple of (distances, parent_map)
    """
    dist = {v: float('inf') for v in graph}
    parent = {v: None for v in graph}
    dist[source] = 0
    
    heap = [(0, source)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        # Early termination if target reached
        if target is not None and u == target:
            break
        
        if d > dist[u]:
            continue
        
        for v, weight in graph.get(u, []):
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                parent[v] = u
                heapq.heappush(heap, (new_dist, v))
    
    return dist, parent


def reconstruct_path(parent: Dict[int, Optional[int]], 
                     source: int, 
                     target: int) -> List[int]:
    """Reconstruct path from source to target."""
    if parent[target] is None and target != source:
        return []  # No path
    
    path = []
    curr = target
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    
    path.reverse()
    return path if path[0] == source else []
```

### Template 3: 0-1 BFS

```python
from collections import deque
from typing import Dict, List, Tuple

def zero_one_bfs(graph: Dict[int, List[Tuple[int, int]]], source: int) -> Dict[int, float]:
    """
    0-1 BFS for graphs with edge weights 0 or 1.
    Faster than Dijkstra's for this special case.
    
    Time: O(V + E), Space: O(V)
    """
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    dq = deque([source])
    
    while dq:
        u = dq.popleft()
        
        for v, weight in graph.get(u, []):
            if weight not in (0, 1):
                raise ValueError("Only 0/1 weights allowed")
            
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                if weight == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    
    return dist
```

### Template 4: Multi-Source Dijkstra's

```python
import heapq
from typing import Dict, List, Tuple, Set

def multi_source_dijkstra(graph: Dict[int, List[Tuple[int, int]]], 
                          sources: Set[int]) -> Tuple[Dict[int, float], Dict[int, int]]:
    """
    Multi-source Dijkstra's - find nearest source for each vertex.
    
    Returns:
        Tuple of (distances, nearest_source)
    """
    dist = {v: float('inf') for v in graph}
    nearest = {v: None for v in graph}
    
    heap = []
    for s in sources:
        dist[s] = 0
        nearest[s] = s
        heapq.heappush(heap, (0, s))
    
    while heap:
        d, u = heapq.heappop(heap)
        
        if d > dist[u]:
            continue
        
        for v, weight in graph.get(u, []):
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                nearest[v] = nearest[u]
                heapq.heappush(heap, (new_dist, v))
    
    return dist, nearest
```

### Template 5: Dijkstra's with Limited Hops

```python
import heapq
from typing import Dict, List, Tuple

def dijkstra_with_hops(graph: Dict[int, List[Tuple[int, int]]], 
                       source: int, 
                       max_hops: int) -> Dict[int, float]:
    """
    Dijkstra's with constraint on number of edges (hops).
    Useful for problems like "cheapest flights within K stops".
    
    State: (cost, node, hops_used)
    """
    # dist[node][hops] = minimum cost
    from collections import defaultdict
    dist = defaultdict(lambda: defaultdict(lambda: float('inf')))
    dist[source][0] = 0
    
    heap = [(0, source, 0)]  # (cost, node, hops)
    
    while heap:
        cost, u, hops = heapq.heappop(heap)
        
        if hops > max_hops:
            continue
        
        if cost > dist[u][hops]:
            continue
        
        for v, weight in graph.get(u, []):
            new_cost = cost + weight
            new_hops = hops + 1
            
            if new_hops <= max_hops and new_cost < dist[v][new_hops]:
                dist[v][new_hops] = new_cost
                heapq.heappush(heap, (new_cost, v, new_hops))
    
    # Return minimum cost across all valid hop counts
    result = {}
    for v in graph:
        result[v] = min(dist[v].values()) if dist[v] else float('inf')
    return result
```

### Template 6: Dense Graph Dijkstra's (O(V²))

```python
def dijkstra_dense(graph: List[List[int]], source: int) -> List[float]:
    """
    Dijkstra's for dense graph using array (adjacency matrix).
    graph[i][j] = weight, or 0 if no edge.
    
    Time: O(V²), Space: O(V)
    """
    n = len(graph)
    dist = [float('inf')] * n
    visited = [False] * n
    dist[source] = 0
    
    for _ in range(n):
        # Find unvisited vertex with minimum distance
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or dist[i] < dist[u]):
                u = i
        
        if dist[u] == float('inf'):
            break
        
        visited[u] = True
        
        # Update distances to neighbors
        for v in range(n):
            if graph[u][v] != 0 and not visited[v]:
                new_dist = dist[u] + graph[u][v]
                if new_dist < dist[v]:
                    dist[v] = new_dist
    
    return dist
```

---

## When to Use

Use Dijkstra's algorithm when you need to solve problems involving:

- **Shortest Path in Weighted Graphs**: Finding the minimum cost path between nodes
- **Non-Negative Weights**: When all edge weights are ≥ 0
- **Single Source Shortest Path**: Finding distances from one source to all other nodes
- **Navigation Systems**: GPS, maps, and route planning
- **Network Routing**: Finding optimal routes in computer networks

### Comparison with Alternatives

| Algorithm | Time Complexity | Edge Weight Constraint | Use Case |
|-----------|----------------|------------------------|----------|
| **Dijkstra's** | O((V + E) log V) | Non-negative only | Single-source, general graphs |
| **Bellman-Ford** | O(V × E) | All weights | Negative weights, negative cycles |
| **Floyd-Warshall** | O(V³) | All weights | All-pairs shortest path |
| **BFS** | O(V + E) | Unit weights | Unweighted graphs |
| **0-1 BFS** | O(V + E) | 0/1 weights only | Special case optimization |
| **A* Search** | O(E) avg | Non-negative | Heuristic-guided, single target |

### When to Choose Dijkstra's vs Other Algorithms

- **Choose Dijkstra's** when:
  - Edge weights are non-negative
  - You need single-source shortest paths
  - You want O((V + E) log V) performance
  - Graph is sparse to moderately dense

- **Choose Bellman-Ford** when:
  - Graph may have negative edge weights
  - You need to detect negative weight cycles
  - Graph is small or you need to handle all weight types

- **Choose Floyd-Warshall** when:
  - You need all-pairs shortest paths
  - Graph is small (V ≤ 500)
  - Multiple queries for different source-destination pairs

- **Choose BFS** when:
  - All edge weights are equal (unweighted graph)
  - You only care about number of edges, not total weight

---

## Algorithm Explanation

### Core Concept

Dijkstra's algorithm works on the principle of **greedy selection** and **relaxation**. At each step, it selects the unvisited vertex with the smallest known distance from the source, then attempts to find shorter paths to its neighbors through relaxation.

**Relaxation**: For each neighbor of the current vertex, check if going through the current vertex gives a shorter path than currently known. If so, update the distance.

### How It Works

#### Initialization Phase:
1. Set distance to source = 0, all other vertices = infinity (∞)
2. Create a min-heap (priority queue) containing (distance, vertex) pairs
3. Mark all vertices as unvisited

#### Main Algorithm Loop:
1. **Extract Minimum**: Remove vertex with smallest distance from heap
2. **Skip Check**: If already visited or stale entry, skip
3. **Mark Visited**: Mark current vertex as processed
4. **Relaxation**: For each neighbor of current vertex:
   - Calculate new distance = current_distance + edge_weight
   - If new distance < known distance, update and add to heap
5. Repeat until heap is empty

#### Why the Greedy Approach Works

Once we extract a vertex with the minimum distance from the priority queue, that distance is **final** because:
- All edge weights are non-negative
- Any alternative path must go through an unvisited vertex
- All unvisited vertices have distance ≥ current distance (by heap property)
- Therefore, no alternative path can be shorter

### Visual Representation

```
Graph:                    Step-by-step distances from source 0:
     4                      
    / \                    Step 0: dist[0]=0, others=∞
   0---1                   
    \ /                    Step 1: Extract 0, relax neighbors
     2                     → dist[1]=4, dist[2]=1
      \                    
       3                   Step 2: Extract 2 (dist=1), relax
                           → dist[1]=3 (improved via 0→2→1)
                           → dist[3]=9
                            
                           Step 3: Extract 1 (dist=3), relax
                           → dist[3]=8 (improved via 0→2→1→3?)
                            
                           Step 4: Extract 3 (dist=8), done
                           
Final distances: {0: 0, 1: 3, 2: 1, 3: 8}
```

### Why It Works

1. **Greedy choice property**: Picking the vertex with minimum distance is always optimal
2. **Optimal substructure**: Shortest path to a vertex contains shortest paths to intermediate vertices
3. **Non-negative weights guarantee**: Ensures we never need to revisit a "finalized" vertex

### Limitations

- **Does NOT work with negative edge weights**: Can produce incorrect results
- **Does NOT detect negative cycles**: Unlike Bellman-Ford
- **Memory overhead**: Priority queue requires O(V) space
- **Slower than BFS for unweighted graphs**: O((V + E) log V) vs O(V + E)

---

## Practice Problems

### Problem 1: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** You are given a network of `n` nodes labeled 1 to `n`. There are also `times` edges `[u, v, w]` representing a signal traveling from node `u` to node `v` in `w` time units. Find the minimum time for the signal to reach all nodes from a given source node `k`.

**How to Apply Dijkstra's:**
- Build adjacency list from times array
- Run Dijkstra from source node k
- Return maximum distance among all reachable nodes
- If any node unreachable, return -1

---

### Problem 2: Path With Minimum Effort

**Problem:** [LeetCode 1631 - Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)

**Description:** You are given a 2D array `heights` of size `rows x columns`, where `heights[row][col]` represents the height of cell `(row, col)`. Find a path from top-left to bottom-right that minimizes the maximum absolute difference in heights between consecutive cells.

**How to Apply Dijkstra's:**
- Treat each cell as a vertex
- Edge weight = max absolute difference between cells
- Use modified Dijkstra to track maximum edge weight along path
- Find path with minimum maximum effort

---

### Problem 3: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are `n` cities connected by flights. The flight `flights[i] = [from, to, price]` indicates a flight from city `from` to city `to` with cost `price`. Find the cheapest price to travel from city `src` to city `dst` with at most `k` stops.

**How to Apply Dijkstra's:**
- Modified state: (cost, city, stops_used)
- Track both cost and number of stops
- Only expand if stops_used <= k
- Use priority queue ordered by cost

---

### Problem 4: Find the City With Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Given `n` cities and edges representing bidirectional roads with distances, find the city with the smallest number of cities reachable within distance `threshold`. If multiple such cities exist, return the city with the greatest number.

**How to Apply Dijkstra's:**
- Run Dijkstra from each city to find all shortest paths
- Count reachable cities within threshold for each source
- Track city with minimum count (or maximum number if tied)

---

### Problem 5: Minimum Cost to Reach Destination in Time

**Problem:** [LeetCode 1928 - Minimum Cost to Reach Destination in Time](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/)

**Description:** There is a country of `n` cities numbered from 0 to `n - 1` where all cities are connected by bi-directional roads. The roads are represented as a 2D integer array `edges` where `edges[i] = [x, y, time]` denotes a road between cities `x` and `y` that takes `time` minutes to travel. Each city has a passing fee represented by `passingFees`. Find the minimum cost to reach destination before maxTime.

**How to Apply Dijkstra's:**
- State: (total_cost, current_city, time_spent)
- Modified relaxation considering both cost and time constraints
- Optimize for minimum cost while respecting time limit

---

## Video Tutorial Links

### Fundamentals

- [Dijkstra's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=IBMf3qJlzYw) - Comprehensive introduction
- [Dijkstra's Algorithm Implementation (WilliamFiset)](https://www.youtube.com/watch?v=gQa-h9c1tCQ) - Detailed explanation with visualizations
- [Dijkstra's Algorithm (NeetCode)](https://www.youtube.com/watch?v=EFg3uE6xPLc) - Practical implementation guide

### Advanced Topics

- [0-1 BFS](https://www.youtube.com/watch?v=AMapQ67j8FQ) - Special case optimization
- [Bidirectional Dijkstra](https://www.youtube.com/watch?v=CglxBhWzK6k) - Two-way search optimization
- [Dijkstra vs Bellman-Ford](https://www.youtube.com/watch?v=04F4yDhI3C4) - Algorithm comparison

---

## Follow-up Questions

### Q1: Why doesn't Dijkstra's algorithm work with negative edge weights?

**Answer:** Dijkstra's greedy approach relies on the assumption that once we extract a vertex with minimum distance, that distance is final. With negative edge weights, a shorter path could be discovered later by going through a vertex with currently larger distance. The algorithm would incorrectly finalize distances too early. For example, if A→B has cost 5 and A→C→B has cost 3+1=4 but C is processed after B, we miss the shorter path.

### Q2: How would you modify Dijkstra to handle negative weights?

**Answer:** You cannot directly modify Dijkstra for negative weights. Use Bellman-Ford instead, which:
- Iterates V-1 times relaxing all edges
- Can detect negative cycles (if distances keep improving after V-1 iterations)
- Has higher time complexity O(V × E) but handles all weights

### Q3: What's the difference between Dijkstra and BFS?

**Answer:**
- **BFS**: Uses a regular queue, processes nodes level by level
  - Works on unweighted graphs (all edges equal)
  - Finds shortest path in terms of number of edges
  - Time: O(V + E)

- **Dijkstra**: Uses a priority queue (min-heap), processes by distance
  - Works on weighted graphs with non-negative weights
  - Finds shortest path in terms of total weight
  - Time: O((V + E) log V)

### Q4: Can Dijkstra be used for all-pairs shortest path?

**Answer:** Yes, by running Dijkstra from each vertex:
- Time: O(V × (V + E) log V) = O(V² log V + VE log V)
- For sparse graphs (E ≈ V), this is O(V² log V)
- Floyd-Warshall is O(V³) and better for dense small graphs
- Johnson's algorithm combines both for sparse graphs with negative weights

### Q5: How does A* differ from Dijkstra?

**Answer:** A* uses a heuristic to guide the search:
- Dijkstra's priority: actual distance from source
- A* priority: actual distance + heuristic estimate to target
- A* is faster for single-target queries when a good heuristic exists
- A* requires admissible heuristic (never overestimates) for correctness
- Dijkstra explores uniformly; A* focuses toward the target

---

## Summary

Dijkstra's algorithm is a fundamental graph algorithm for finding shortest paths in weighted graphs with non-negative edge weights. Key takeaways:

- **Greedy + Relaxation**: Always process closest vertex first, update neighbors
- **Time Complexity**: O((V + E) log V) with binary heap
- **Space Complexity**: O(V) for distances and priority queue
- **Limitation**: Only works with non-negative weights (use Bellman-Ford otherwise)

When to use:
- ✅ Finding shortest path in weighted graphs with non-negative weights
- ✅ GPS and navigation systems
- ✅ Network routing protocols
- ✅ Any single-source shortest path problem
- ❌ Graphs with negative edge weights (use Bellman-Ford)
- ❌ Unweighted graphs (BFS is simpler and faster)

This algorithm is essential for competitive programming and technical interviews, especially in problems involving route planning, network optimization, and pathfinding.
