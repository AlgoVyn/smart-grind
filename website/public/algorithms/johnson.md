# Johnson's Algorithm (All-Pairs Shortest Path)

## Category
Graphs

## Description

Johnson's Algorithm finds shortest paths between all pairs of vertices in a weighted directed graph. It handles negative edge weights (but not negative cycles) and runs in O(V² log V + VE) time, making it significantly faster than Floyd-Warshall for sparse graphs.

The algorithm works in two phases: first, it uses Bellman-Ford to compute a potential function that reweights all edges to be non-negative while preserving shortest paths; second, it runs Dijkstra's algorithm from each vertex on the reweighted graph. This clever combination allows Johnson's algorithm to handle negative weights while maintaining the efficiency benefits of Dijkstra's algorithm.

---

## Concepts

Johnson's algorithm relies on several fundamental concepts that make it both correct and efficient.

### 1. The Reweighting Principle

Transforming edge weights to be non-negative while preserving shortest paths:

| Concept | Description |
|---------|-------------|
| **Potential Function** | h(v) = shortest distance from new source to v |
| **New Weight** | w'(u,v) = w(u,v) + h(u) - h(v) ≥ 0 |
| **Path Preservation** | Adding constants telescopes for any path |

### 2. Why Reweighting Works

For any path from s to t with edges e₁, e₂, ..., eₖ:
```
Original: w(e₁) + w(e₂) + ... + w(eₖ)
Reweighted: w'(e₁) + w'(e₂) + ... + w'(eₖ)
          = [w(e₁) + h(s) - h(v₁)] + [w(e₂) + h(v₁) - h(v₂)] + ...
          = w(original) + h(s) - h(t)
```

The h(s) - h(t) is constant for all paths from s to t, so shortest paths are preserved!

### 3. Algorithm Components

| Component | Purpose | Time Complexity |
|-----------|---------|-----------------|
| **Bellman-Ford** | Detect negative cycles, compute h(v) | O(VE) |
| **Reweighting** | Make all edge weights non-negative | O(E) |
| **Dijkstra × V** | Find shortest paths from each vertex | O(V × (E log V)) |
| **Convert Back** | Restore original distances | O(V²) |

### 4. Comparison with Alternatives

| Algorithm | Time | Space | Handles Negatives | Best For |
|-----------|------|-------|-------------------|----------|
| **Floyd-Warshall** | O(V³) | O(V²) | Yes | Dense graphs |
| **Johnson's** | O(V² log V + VE) | O(V²) | Yes (no cycles) | Sparse graphs |
| **V × Dijkstra** | O(V × (E log V)) | O(V²) | No | Sparse, non-negative |
| **V × Bellman-Ford** | O(V²E) | O(V²) | Yes | Very small graphs |

---

## Frameworks

Structured approaches for implementing Johnson's algorithm.

### Framework 1: Standard Johnson's Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  JOHNSON'S ALGORITHM FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  Input: n vertices, list of edges (u, v, weight)             │
│  Output: n × n distance matrix, or None if negative cycle    │
│                                                                │
│  Step 1: Add new vertex s connected to all with 0 weight   │
│  Step 2: Run Bellman-Ford from s to get h[v] for all v      │
│          - If negative cycle detected, return None           │
│  Step 3: Reweight all edges: w'(u,v) = w(u,v) + h(u) - h(v)│
│  Step 4: Build adjacency list with new weights                │
│  Step 5: Run Dijkstra from each vertex u (0 to n-1):       │
│          - Get distances d'(u,v) in reweighted graph        │
│          - Convert back: d(u,v) = d'(u,v) - h(u) + h(v)      │
│  Step 6: Return n × n distance matrix                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard all-pairs shortest path on sparse graphs with possible negative weights.

### Framework 2: Johnson's with Edge List Output

```
┌─────────────────────────────────────────────────────────────┐
│  JOHNSON'S WITH PATH RECONSTRUCTION                         │
├─────────────────────────────────────────────────────────────┤
│  Same as standard, plus:                                      │
│                                                                │
│  During Dijkstra:                                              │
│  - Maintain parent pointers                                    │
│  - Store predecessor for each vertex                          │
│                                                                │
│  After Dijkstra completes:                                     │
│  - Build path by following parent pointers                    │
│  - Store paths in addition to distances                       │
│                                                                │
│  Output: distance matrix and predecessor matrix               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need to reconstruct actual shortest paths, not just distances.

### Framework 3: Algorithm Selection Decision

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING ALL-PAIRS SHORTEST PATH ALGORITHM                   │
├─────────────────────────────────────────────────────────────┤
│  Use Floyd-Warshall when:                                    │
│    ✓ Graph is dense (E ≈ V²)                                 │
│    ✓ Simple implementation preferred                        │
│    ✓ Negative weights with negative cycles possible          │
│                                                                │
│  Use Johnson's when:                                         │
│    ✓ Graph is sparse (E << V²)                               │
│    ✓ Negative weights but no negative cycles                │
│    ✓ Need better asymptotic complexity                      │
│                                                                │
│  Use V × Dijkstra when:                                      │
│    ✓ All edge weights are non-negative                        │
│    ✓ Graph is sparse                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Decision making for selecting the right algorithm.

---

## Forms

Different manifestations of Johnson's algorithm pattern.

### Form 1: Standard All-Pairs Shortest Path

Basic distance matrix computation.

| Aspect | Details |
|--------|---------|
| **Goal** | Compute shortest distance between every pair |
| **Output** | n × n distance matrix |
| **Infinity** | Use float('inf') or large constant for unreachable |
| **Complexity** | O(V² log V + VE) |

### Form 2: Path Reconstruction

Track actual shortest paths.

| Modification | Store predecessor during Dijkstra |
|--------------|-------------------------------------|
| **Data Structure** | n × n predecessor matrix |
| **Path Building** | Follow predecessors from target to source |
| **Use Case** | Navigation, routing, path planning |

### Form 3: Detecting Negative Cycles

Johnson's can detect negative cycles.

| Aspect | Details |
|--------|---------|
| **Detection** | Bellman-Ford phase |
| **Output** | Return None/special value if negative cycle exists |
| **Post-processing** | No shortest paths exist if negative cycle reachable |

### Form 4: Single-Source Variant

If only need paths from one source.

| Aspect | Details |
|--------|---------|
| **Optimization** | Run Dijkstra only once from source |
| **Alternative** | Just use Bellman-Ford (if negatives) or Dijkstra |
| **Use Case** | One-to-all shortest paths |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Efficient Bellman-Ford Implementation

Early termination when no updates:

```python
def bellman_ford(n, edges, source):
    """
    Bellman-Ford with early termination.
    Returns distances and negative cycle flag.
    """
    dist = [float('inf')] * (n + 1)
    dist[source] = 0
    
    # Relax edges n times
    for i in range(n):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        
        # Early termination
        if not updated:
            break
    
    # Check for negative cycle
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            has_negative_cycle = True
            break
    
    return dist, has_negative_cycle
```

### Tactic 2: Dijkstra with Priority Queue

Efficient Dijkstra implementation:

```python
import heapq

def dijkstra(start, adj, n):
    """
    Dijkstra using heap for O(E log V).
    """
    dist = [float('inf')] * n
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    
    return dist
```

### Tactic 3: Path Reconstruction

Tracking and rebuilding paths:

```python
def dijkstra_with_path(start, adj, n):
    """
    Dijkstra with predecessor tracking.
    """
    dist = [float('inf')] * n
    parent = [-1] * n
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                heapq.heappush(pq, (dist[v], v))
    
    return dist, parent

def get_path(parent, start, end):
    """Reconstruct path from parent array."""
    if parent[end] == -1 and end != start:
        return []  # No path
    
    path = []
    cur = end
    while cur != -1:
        path.append(cur)
        cur = parent[cur]
    
    return path[::-1]
```

### Tactic 4: Handling Disconnected Graphs

Properly handle unreachable vertices:

```python
def johnson_with_disconnected(n, edges):
    """
    Johnson's that handles disconnected components.
    """
    # ... Bellman-Ford ...
    
    result = []
    for u in range(n):
        dist_from_u = dijkstra(u, adj, n)
        # Convert back
        row = []
        for v in range(n):
            if dist_from_u[v] == float('inf'):
                row.append(float('inf'))  # Unreachable
            else:
                row.append(dist_from_u[v] - h[u] + h[v])
        result.append(row)
    
    return result
```

### Tactic 5: Integer Overflow Prevention

Use appropriate data types for large distances:

```python
def johnson_safe(n, edges):
    """
    Johnson's with overflow protection.
    """
    # Use large constant instead of inf for integer arithmetic
    INF = 10**18
    
    # Bellman-Ford with large constant
    h = [INF] * (n + 1)
    h[n] = 0  # New source
    
    # ... rest of algorithm ...
    
    # Check overflow in final distances
    for u in range(n):
        for v in range(n):
            if result[u][v] > INF // 2:
                result[u][v] = -1  # Mark as unreachable
    
    return result
```

---

## Python Templates

### Template 1: Johnson's Algorithm - Complete Implementation

```python
import heapq
from typing import List, Tuple, Optional

def johnson_algorithm(n: int, edges: List[Tuple[int, int, int]]) -> Optional[List[List[float]]]:
    """
    Johnson's Algorithm for all-pairs shortest path.
    
    Args:
        n: number of vertices (0 to n-1)
        edges: list of (u, v, w) - directed edge u->v with weight w
    
    Returns:
        n x n matrix of shortest distances, or None if negative cycle
        
    Time: O(V² log V + VE)
    Space: O(V²)
    """
    # Step 1 & 2: Add new vertex, run Bellman-Ford
    dist_bellman = [float('inf')] * (n + 1)
    dist_bellman[n] = 0  # New source vertex
    
    # Add edges from new vertex to all others
    all_edges = edges + [(n, i, 0) for i in range(n)]
    
    # Bellman-Ford
    for _ in range(n):
        updated = False
        for u, v, w in all_edges:
            if dist_bellman[u] + w < dist_bellman[v]:
                dist_bellman[v] = dist_bellman[u] + w
                updated = True
        if not updated:
            break
    
    # Check for negative cycles
    for u, v, w in all_edges:
        if dist_bellman[u] + w < dist_bellman[v]:
            return None  # Negative cycle detected
    
    # h[v] = shortest distance from new source to v
    h = dist_bellman[:-1]
    
    # Step 3: Reweight edges
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        new_w = w + h[u] - h[v]
        adj[u].append((v, new_w))
    
    # Step 4 & 5: Dijkstra from each vertex
    def dijkstra(start: int) -> List[float]:
        dist = [float('inf')] * n
        dist[start] = 0
        pq = [(0, start)]
        
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    heapq.heappush(pq, (dist[v], v))
        return dist
    
    # Step 6: Build result and convert back
    result = []
    for u in range(n):
        dist_from_u = dijkstra(u)
        row = []
        for v in range(n):
            if dist_from_u[v] == float('inf'):
                row.append(float('inf'))
            else:
                row.append(dist_from_u[v] - h[u] + h[v])
        result.append(row)
    
    return result
```

### Template 2: Bellman-Ford with Negative Cycle Detection

```python
def bellman_ford(n: int, edges: List[Tuple[int, int, int]], source: int) -> Tuple[List[float], bool]:
    """
    Bellman-Ford algorithm with negative cycle detection.
    
    Args:
        n: number of vertices
        edges: list of (u, v, weight)
        source: source vertex
    
    Returns:
        (distances, has_negative_cycle)
        
    Time: O(VE)
    Space: O(V)
    """
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Relax edges n-1 times
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break
    
    # Check for negative cycles
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return dist, True
    
    return dist, False
```

### Template 3: Dijkstra's Algorithm (Standard)

```python
import heapq
from typing import List, Tuple

def dijkstra(n: int, adj: List[List[Tuple[int, int]]], source: int) -> List[float]:
    """
    Dijkstra's algorithm for single-source shortest path.
    
    Args:
        n: number of vertices
        adj: adjacency list where adj[u] = list of (v, weight)
        source: source vertex
    
    Returns:
        List of shortest distances from source to all vertices
        
    Time: O(E log V)
    Space: O(V)
    """
    dist = [float('inf')] * n
    dist[source] = 0
    pq = [(0, source)]  # (distance, vertex)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # Skip if we've already found better path
        if d > dist[u]:
            continue
        
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    
    return dist
```

### Template 4: Floyd-Warshall (Alternative for Dense Graphs)

```python
def floyd_warshall(n: int, edges: List[Tuple[int, int, int]]) -> List[List[float]]:
    """
    Floyd-Warshall for all-pairs shortest path.
    Simpler but O(V³) - use for dense graphs.
    
    Args:
        n: number of vertices
        edges: list of (u, v, weight)
    
    Returns:
        n x n distance matrix
        
    Time: O(V³)
    Space: O(V²)
    """
    # Initialize distance matrix
    dist = [[float('inf')] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
    
    # Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist
```

### Template 5: Johnson's with Path Reconstruction

```python
import heapq
from typing import List, Tuple, Optional

def johnson_with_paths(n: int, edges: List[Tuple[int, int, int]]) -> Optional[Tuple[List[List[float]], List[List[int]]]]:
    """
    Johnson's algorithm with path reconstruction.
    
    Returns:
        (distance_matrix, predecessor_matrix) or None if negative cycle
    """
    # Bellman-Ford phase
    dist_bellman = [float('inf')] * (n + 1)
    dist_bellman[n] = 0
    all_edges = edges + [(n, i, 0) for i in range(n)]
    
    for _ in range(n):
        for u, v, w in all_edges:
            if dist_bellman[u] + w < dist_bellman[v]:
                dist_bellman[v] = dist_bellman[u] + w
    
    for u, v, w in all_edges:
        if dist_bellman[u] + w < dist_bellman[v]:
            return None
    
    h = dist_bellman[:-1]
    
    # Build reweighted adjacency
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        new_w = w + h[u] - h[v]
        adj[u].append((v, new_w))
    
    # Dijkstra with predecessor tracking
    dist_matrix = [[float('inf')] * n for _ in range(n)]
    pred_matrix = [[-1] * n for _ in range(n)]
    
    for src in range(n):
        dist_matrix[src][src] = 0
        pq = [(0, src)]
        
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist_matrix[src][u]:
                continue
            
            for v, w in adj[u]:
                if dist_matrix[src][u] + w < dist_matrix[src][v]:
                    dist_matrix[src][v] = dist_matrix[src][u] + w
                    pred_matrix[src][v] = u
                    heapq.heappush(pq, (dist_matrix[src][v], v))
    
    # Convert back distances
    for u in range(n):
        for v in range(n):
            if dist_matrix[u][v] != float('inf'):
                dist_matrix[u][v] = dist_matrix[u][v] - h[u] + h[v]
    
    return dist_matrix, pred_matrix

def get_path(pred_matrix: List[List[int]], src: int, dst: int) -> List[int]:
    """Reconstruct path from predecessor matrix."""
    if pred_matrix[src][dst] == -1:
        return [] if src != dst else [src]
    
    path = []
    cur = dst
    while cur != -1:
        path.append(cur)
        cur = pred_matrix[src][cur]
    
    return path[::-1]
```

### Template 6: All-Pairs Shortest Path - Algorithm Selector

```python
def all_pairs_shortest_path(n: int, edges: List[Tuple[int, int, int]], 
                            use_johnson: bool = True) -> Optional[List[List[float]]]:
    """
    Select and run appropriate all-pairs shortest path algorithm.
    
    Args:
        n: number of vertices
        edges: list of (u, v, weight)
        use_johnson: if True and graph is sparse, use Johnson's
    
    Returns:
        Distance matrix or None if negative cycle
    """
    m = len(edges)
    
    # Check for negative weights
    has_negative = any(w < 0 for _, _, w in edges)
    
    if has_negative:
        # Must use Floyd-Warshall or Johnson's
        if use_johnson and m < n * n // 4:  # Sparse
            return johnson_algorithm(n, edges)
        else:
            return floyd_warshall(n, edges)
    else:
        # No negative weights - could use V × Dijkstra
        # But we'll use Johnson's (which becomes V × Dijkstra without reweighting needed)
        # Or Floyd-Warshall for simplicity
        if n <= 200:  # Small enough for Floyd-Warshall
            return floyd_warshall(n, edges)
        else:
            # Build adjacency and run V × Dijkstra
            adj = [[] for _ in range(n)]
            for u, v, w in edges:
                adj[u].append((v, w))
            
            result = []
            for src in range(n):
                result.append(dijkstra(n, adj, src))
            return result
```

---

## When to Use

Use Johnson's Algorithm when you need to solve problems involving:

- **All-Pairs Shortest Path**: Computing shortest paths between every pair of vertices
- **Sparse Graphs**: Graphs where E << V² (fewer edges than complete graph)
- **Negative Weights**: Graphs with negative edge weights (but no negative cycles)
- **Dense Alternative**: When Floyd-Warshall's O(V³) is too slow
- **Network Analysis**: Analyzing connectivity and distances in networks

### Comparison with Alternatives

| Algorithm | Time | Space | Handles Negatives | Best For |
|-----------|------|-------|-------------------|----------|
| **Floyd-Warshall** | O(V³) | O(V²) | Yes | Dense graphs, simplicity |
| **Johnson's** | O(V² log V + VE) | O(V²) | Yes (no cycles) | Sparse graphs with negatives |
| **V × Dijkstra** | O(V × (E log V)) | O(V²) | No | Sparse, non-negative weights |
| **V × Bellman-Ford** | O(V²E) | O(V²) | Yes | Very small graphs |

### When to Choose Johnson's vs Other Approaches

- **Choose Johnson's** when:
  - Graph is sparse (E << V²)
  - Need all-pairs shortest paths
  - Graph has negative weights but no negative cycles
  - Floyd-Warshall would be too slow

- **Choose Floyd-Warshall** when:
  - Graph is dense (E ≈ V²)
  - Prefer simpler implementation
  - V is small (V ≤ 200)
  - Don't want to implement Dijkstra

- **Choose V × Dijkstra** when:
  - All edge weights are non-negative
  - Graph is sparse
  - Have a reliable Dijkstra implementation

---

## Algorithm Explanation

### Core Concept

Johnson's Algorithm combines the strengths of Bellman-Ford (handles negative weights) and Dijkstra (efficient for non-negative weights). The key insight is that we can reweight edges to make them all non-negative while preserving shortest paths, then run Dijkstra efficiently.

### How It Works

#### Step 1: Add New Source

Add a new vertex s connected to all other vertices with 0-weight edges.

```
Original graph:     With new source:
    A ---5---> B       s --0--> A
    |          ^       s --0--> B
    2          |       s --0--> C
    v          |       s --0--> D
    C ---3----> D
```

#### Step 2: Bellman-Ford

Run Bellman-Ford from s to compute h(v) for all v:

```
h(v) = shortest distance from s to v
```

This detects negative cycles (if any relaxation possible in Vth iteration).

#### Step 3: Reweight

Compute new weights: w'(u,v) = w(u,v) + h(u) - h(v)

```
Example: edge A→B with weight 5
h(A) = 0, h(B) = 5
w'(A,B) = 5 + 0 - 5 = 0 (non-negative!)
```

#### Step 4: Dijkstra × V

Run Dijkstra from each vertex on the reweighted graph.

#### Step 5: Convert Back

Original distance = reweighted distance - h(source) + h(target)

### Visual Walkthrough

**Example Graph:**
```
Vertices: 0, 1, 2
Edges: (0→1, -2), (1→2, -1), (0→2, 3)
```

**Step 1-2: Bellman-Ford from new source:**
```
h[0] = 0, h[1] = -2, h[2] = -3
```

**Step 3: Reweight edges:**
```
0→1: -2 + 0 - (-2) = 0
1→2: -1 + (-2) - (-3) = 0
0→2: 3 + 0 - (-3) = 6
```

**Step 4: Dijkstra from each vertex:**
```
From 0: [0, 0, 0]  (reweighted)
From 1: [inf, 0, 0]
From 2: [inf, inf, 0]
```

**Step 5: Convert back:**
```
Distance 0→2 = 0 - h[0] + h[2] = 0 - 0 + (-3) = -3 ✓
```

### Why Johnson's is Efficient

- **Sparse graph advantage**: Dijkstra is O(E log V), so V × Dijkstra = O(VE log V)
- **Beats Floyd-Warshall**: O(V³) vs O(VE log V) when E << V²
- **Handles negatives**: Bellman-Ford preprocessing allows Dijkstra to work

### Limitations

- **Negative cycles**: Cannot compute shortest paths if negative cycles exist
- **Complexity**: More complex to implement than Floyd-Warshall
- **Memory**: Needs O(V²) for distance matrix plus O(V + E) for adjacency lists

---

## Practice Problems

### Problem 1: Find the City With Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Given n cities connected by weighted edges and a distance threshold, find the city that can reach the fewest other cities within the threshold distance.

**How to Apply Johnson's:**
- Compute all-pairs shortest paths using Johnson's algorithm
- For each city, count how many other cities are within threshold distance
- Return the city with minimum count (largest index on tie)

---

### Problem 2: Network Delay Time (Single Source)

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** Given a network of nodes and travel times, find the time for a signal to reach all nodes from a starting node.

**How to Apply:**
- This is single-source, so use Dijkstra directly (not full Johnson's)
- But understanding Johnson's helps recognize this as shortest path problem

---

### Problem 3: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** Find the cheapest price from source to destination with at most K stops.

**How to Apply:**
- Modified Bellman-Ford with at most K+1 edge relaxations
- Related to shortest path with constraints

---

## Video Tutorial Links

### Fundamentals

- [Johnson's Algorithm - William Fiset](https://www.youtube.com/watch?v=2E7MmKv0Y24) - Comprehensive explanation
- [All-Pairs Shortest Path - MIT OCW](https://www.youtube.com/watch?v=oS9y9xRs8xY) - Theoretical foundation

### Implementation

- [Johnson's Algorithm Implementation - Algorithms](https://www.youtube.com/watch?v=1Z7ofKd8n1s) - Code walkthrough
- [Graph Algorithms - Take U Forward](https://www.youtube.com/watch?v=KudAWCFp4QY) - Competitive programming perspective

---

## Follow-up Questions

### Q1: What is the difference between Johnson's and Floyd-Warshall?

**Answer:** Both solve all-pairs shortest path:
- **Johnson's**: O(V² log V + VE), better for sparse graphs, uses Bellman-Ford + Dijkstra
- **Floyd-Warshall**: O(V³), simpler implementation, better for dense graphs
- Johnson's can handle negative weights (no cycles), Floyd-Warshall handles all negatives

---

### Q2: Why does the reweighting preserve shortest paths?

**Answer:** For any path from s to t, the reweighted path length is:
```
Σ w'(u,v) = Σ [w(u,v) + h(u) - h(v)] = Σ w(u,v) + h(s) - h(t)
```
The h(s) - h(t) is constant for all paths from s to t, so the shortest path in original graph is also shortest in reweighted graph.

---

### Q3: Can Johnson's algorithm detect negative cycles?

**Answer:** Yes! During the Bellman-Ford phase (Step 2), we run V iterations. If any distance can still be relaxed in the Vth iteration, a negative cycle exists. In this case, shortest paths are undefined (can always make path shorter by looping), so Johnson's returns an error.

---

### Q4: When should I use V × Dijkstra instead of Johnson's?

**Answer:** If all edge weights are already non-negative, you don't need Bellman-Ford preprocessing. Just run Dijkstra from each vertex directly. This gives O(V × (E log V)) without the O(VE) Bellman-Ford overhead.

---

### Q5: How do I handle disconnected graphs with Johnson's?

**Answer:** Dijkstra naturally handles unreachable vertices (distance stays infinity). The distance conversion formula works correctly: infinity minus h(u) plus h(v) is still infinity (or a very large number). Just check for infinity in the final result.

---

## Summary

Johnson's Algorithm is an efficient solution for the all-pairs shortest path problem on sparse graphs with potentially negative edge weights. The key takeaways are:

1. **Two-phase approach**: Bellman-Ford for reweighting, then Dijkstra from each vertex
2. **Preserves shortest paths**: The reweighting transformation maintains path ordering
3. **Efficient for sparse graphs**: O(V² log V + VE) beats Floyd-Warshall when E << V²
4. **Handles negatives**: Can process negative weights (but not negative cycles)
5. **More complex**: Requires implementing both Bellman-Ford and Dijkstra

**When to Use Johnson's**:
- Sparse directed graphs
- Need all-pairs shortest paths
- Graph has negative weights (but no negative cycles)
- Floyd-Warshall would be too slow

**Key Formulas**:
- Reweighting: w'(u,v) = w(u,v) + h(u) - h(v)
- Convert back: d(u,v) = d'(u,v) - h(u) + h(v)

This algorithm is essential for competitive programmers and anyone working with graph algorithms on large, sparse networks.
