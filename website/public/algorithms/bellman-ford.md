# Bellman-Ford Algorithm

## Category
Graphs

## Description

The Bellman-Ford algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph. Unlike Dijkstra's algorithm, Bellman-Ford can handle graphs with **negative edge weights** and can detect **negative cycles**. This makes it essential for problems where edge weights may be negative, such as in currency arbitrage detection, network routing, and certain optimization problems.

The algorithm works by repeatedly relaxing all edges, gradually finding shorter paths using more edges. After V-1 iterations (where V is the number of vertices), all shortest paths are found. One additional iteration detects if any negative cycles exist in the graph.

---

## Concepts

The Bellman-Ford algorithm is built on several fundamental concepts that make it powerful for solving shortest path problems.

### 1. Edge Relaxation

The core operation that improves path estimates:

```
If dist[u] + weight(u,v) < dist[v]:
    dist[v] = dist[u] + weight(u,v)
```

| Concept | Description |
|---------|-------------|
| **Relaxation** | Updating a distance estimate when a shorter path is found |
| **Property** | After relaxation, dist[v] is the weight of the shortest path found so far |

### 2. V-1 Iterations Principle

In a graph without negative cycles, the shortest path uses at most V-1 edges:

| Iteration | Finds Paths Using |
|-----------|-------------------|
| 1 | Direct edges only |
| 2 | Paths with up to 2 edges |
| k | Paths with up to k edges |
| V-1 | All possible shortest paths |

### 3. Negative Cycle Detection

After V-1 iterations, one more pass detects negative cycles:

| Check | Meaning |
|-------|---------|
| Can still relax an edge | Negative cycle exists |
| No relaxation possible | No negative cycles, distances are final |

### 4. Path Reconstruction

Track parent pointers to reconstruct actual shortest paths:

```
When relaxing edge (u, v):
    if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        parent[v] = u  # Track path
```

---

## Frameworks

Structured approaches for solving Bellman-Ford problems.

### Framework 1: Standard Bellman-Ford (Single-Source)

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD BELLMAN-FORD FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize distances:                                   │
│     - dist[source] = 0                                      │
│     - dist[others] = infinity                                 │
│  2. Repeat V-1 times:                                       │
│     a. For each edge (u, v, weight):                       │
│        - If dist[u] + weight < dist[v]:                    │
│          * dist[v] = dist[u] + weight                      │
│          * parent[v] = u (for path reconstruction)          │
│  3. Check for negative cycles:                              │
│     a. For each edge (u, v, weight):                       │
│        - If dist[u] + weight < dist[v]:                    │
│          * Negative cycle detected!                        │
│          * Return error or handle appropriately              │
│  4. Return distances and parent array                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard single-source shortest path with possible negative weights.

### Framework 2: Bellman-Ford with K Stops Limit

```
┌─────────────────────────────────────────────────────────────┐
│  K-STOPS LIMITED BELLMAN-FORD FRAMEWORK                     │
├─────────────────────────────────────────────────────────────┤
│  1. Similar to standard Bellman-Ford                        │
│  2. Run exactly K+1 iterations instead of V-1              │
│     - K stops = K+1 edges                                   │
│  3. Use separate distance array for each iteration          │
│     - Prevents using more than k edges                      │
│  4. dist[i][v] = shortest distance to v using at most i edges│
│  5. Space optimization: use two 1D arrays instead of 2D   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Problems like "cheapest flights with at most K stops".

### Framework 3: Distributed Bellman-Ford (Distance Vector)

```
┌─────────────────────────────────────────────────────────────┐
│  DISTRIBUTED BELLMAN-FORD FRAMEWORK                         │
├─────────────────────────────────────────────────────────────┤
│  1. Each node maintains distance vector to all destinations │
│  2. Nodes periodically exchange distance vectors with neighbors│
│  3. Each node updates its table:                           │
│     - If neighbor has shorter path to destination:        │
│       * Update: my_dist = neighbor_dist + link_cost       │
│  4. Converges when no more updates occur                   │
│  5. Used in routing protocols like RIP                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Network routing protocols, distributed systems.

---

## Forms

Different manifestations of the Bellman-Ford algorithm.

### Form 1: Standard Single-Source Shortest Path

Basic form that finds shortest paths from one source to all vertices.

| Aspect | Details |
|--------|---------|
| **Goal** | Shortest paths from source |
| **Handles** | Negative weights, detects negative cycles |
| **Time** | O(V × E) |
| **Space** | O(V) |

### Form 2: Shortest Path with Path Reconstruction

Tracks actual paths, not just distances.

| Modification | Maintain parent array |
|--------------|----------------------|
| **Update** | parent[v] = u when relaxing edge (u,v) |
| **Reconstruction** | Follow parent pointers from target to source |
| **Use Case** | Need to know the actual path taken |

### Form 3: K-Stop Constrained Shortest Path

Limits number of edges in path.

| Modification | Run only K+1 iterations |
|--------------|-------------------------|
| **Use Case** | "At most K stops" problems |
| **Complexity** | O(K × E) |

### Form 4: Negative Cycle Detection Only

Only checks if negative cycle exists.

| Modification | Stop after detecting any relaxable edge |
|--------------|------------------------------------------|
| **Output** | Boolean (has/doesn't have negative cycle) |
| **Use Case** | Currency arbitrage, feasibility checking |

### Form 5: All-Pairs Shortest Path (Multiple Sources)

Run Bellman-Ford from each vertex.

| Approach | Run Bellman-Ford V times |
|----------|--------------------------|
| **Time** | O(V² × E) |
| **Alternative** | Use Floyd-Warshall: O(V³) |
| **Use Case** | When some vertices have negative edges |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Termination

If no relaxations occur in an iteration, stop early:

```python
def bellman_ford_early_stop(vertices, edges, source):
    dist = [float('inf')] * vertices
    dist[source] = 0
    
    for i in range(vertices - 1):
        relaxed = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                relaxed = True
        
        if not relaxed:  # Early termination
            break
    
    return dist
```

**When to use**: Graphs where distances converge quickly.

### Tactic 2: SPFA Optimization (Shortest Path Faster Algorithm)

Uses queue to only process vertices that changed:

```python
from collections import deque

def spfa(vertices, edges, source):
    """Optimized Bellman-Ford for sparse graphs."""
    dist = [float('inf')] * vertices
    in_queue = [False] * vertices
    count = [0] * vertices  # Relaxation count for negative cycle
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    # Build adjacency list
    adj = [[] for _ in range(vertices)]
    for u, v, w in edges:
        adj[u].append((v, w))
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] = count[u] + 1
                
                # Negative cycle detection
                if count[v] >= vertices:
                    return None  # Negative cycle exists
                
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist
```

**When to use**: Sparse graphs, often faster in practice.

### Tactic 3: Path Reconstruction

Reconstruct actual shortest path:

```python
def reconstruct_path(parent, source, target):
    """Reconstruct path from source to target."""
    if parent[target] == -1 and target != source:
        return []  # No path
    
    path = []
    current = target
    while current != -1:
        path.append(current)
        current = parent[current]
    
    path.reverse()
    return path if path[0] == source else []
```

**When to use**: When you need the actual path, not just distance.

### Tactic 4: Finding Negative Cycle Vertices

Identify which vertices are affected by negative cycle:

```python
def find_negative_cycle_vertices(vertices, edges, source):
    """Find vertices on negative cycles."""
    dist = [float('inf')] * vertices
    parent = [-1] * vertices
    dist[source] = 0
    
    # V relaxations
    for _ in range(vertices):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
    
    # Find vertices on negative cycle
    in_cycle = [False] * vertices
    for v in range(vertices):
        if parent[v] != -1:
            current = v
            for _ in range(vertices):
                current = parent[current]
                if current == -1:
                    break
            if current != -1:
                in_cycle[current] = True
    
    return [i for i, x in enumerate(in_cycle) if x]
```

**When to use**: Need to identify which vertices are affected by negative cycles.

### Tactic 5: Currency Arbitrage Detection

Detect arbitrage opportunities using negative cycles:

```python
import math

def detect_arbitrage(currencies, rates):
    """
    Detect currency arbitrage using Bellman-Ford.
    
    Args:
        currencies: List of currency names
        rates: List of (i, j, rate) tuples
    """
    n = len(currencies)
    # Convert rates to weights: weight = -log(rate)
    edges = []
    for i, j, rate in rates:
        weight = -math.log(rate)
        edges.append((i, j, weight))
    
    # Bellman-Ford to detect negative cycle
    dist = [float('inf')] * n
    dist[0] = 0
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return True  # Arbitrage exists!
    
    return False
```

**When to use**: Currency exchange, detecting profitable cycles.

---

## Python Templates

### Template 1: Standard Bellman-Ford (Single-Source)

```python
from typing import List, Tuple, Optional

def bellman_ford(vertices: int, edges: List[Tuple[int, int, int]], 
                  source: int) -> Tuple[List[Optional[int]], bool]:
    """
    Bellman-Ford algorithm to find shortest paths from source to all vertices.
    
    Args:
        vertices: Number of vertices (0 to vertices-1)
        edges: List of tuples (u, v, w) representing edge from u to v with weight w
        source: Source vertex
    
    Returns:
        Tuple of (distances, has_negative_cycle)
        - distances: List where distances[i] is the shortest distance from source to i
                      None if vertex is unreachable
        - has_negative_cycle: True if a negative cycle is detected
    """
    # Initialize distances
    dist = [float('inf')] * vertices
    dist[source] = 0
    
    # Relax all edges V-1 times
    for _ in range(vertices - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycles
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            has_negative_cycle = True
            break
    
    # Convert infinity to None for unreachable vertices
    dist = [None if d == float('inf') else d for d in dist]
    
    return dist, has_negative_cycle
```

### Template 2: Bellman-Ford with Path Reconstruction

```python
def bellman_ford_with_path(vertices: int, edges: List[Tuple[int, int, int]], 
                            source: int) -> Tuple[List[Optional[int]], 
                                                    List[Optional[int]], bool]:
    """
    Bellman-Ford with path reconstruction.
    
    Returns:
        - distances: Shortest distances from source
        - parent: Parent vertex for path reconstruction (-1 if unreachable or source)
        - has_negative_cycle: Whether negative cycle exists
    """
    dist = [float('inf')] * vertices
    parent = [-1] * vertices
    dist[source] = 0
    
    # V-1 relaxations
    for _ in range(vertices - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
    
    # Negative cycle check
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            has_negative_cycle = True
            break
    
    # Convert to None for unreachable
    dist = [None if d == float('inf') else d for d in dist]
    
    return dist, parent, has_negative_cycle


def reconstruct_path(parent: List[int], source: int, target: int) -> List[int]:
    """Reconstruct path from source to target using parent array."""
    if parent[target] == -1 and target != source:
        return []  # No path exists
    
    path = []
    current = target
    while current != -1:
        path.append(current)
        current = parent[current]
    
    path.reverse()
    return path if path[0] == source else []
```

### Template 3: SPFA (Shortest Path Faster Algorithm)

```python
from collections import deque

def spfa(vertices: int, edges: List[Tuple[int, int, int]], 
         source: int) -> Tuple[List[Optional[int]], bool]:
    """
    SPFA - Shortest Path Faster Algorithm.
    Often faster than standard Bellman-Ford for sparse graphs.
    
    Args:
        vertices: Number of vertices
        edges: List of (u, v, w) tuples
        source: Source vertex
    
    Returns:
        Tuple of (distances, has_negative_cycle)
    """
    dist = [float('inf')] * vertices
    in_queue = [False] * vertices
    count = [0] * vertices  # Relaxation count for negative cycle detection
    dist[source] = 0
    
    # Build adjacency list
    adj = [[] for _ in range(vertices)]
    for u, v, w in edges:
        adj[u].append((v, w))
    
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in adj[u]:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] = count[u] + 1
                
                # Negative cycle detection
                if count[v] >= vertices:
                    return [None] * vertices, True
                
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    dist = [None if d == float('inf') else d for d in dist]
    return dist, False
```

### Template 4: Bellman-Ford with K Stops Limit

```python
def bellman_ford_k_stops(vertices: int, edges: List[Tuple[int, int, int]],
                         source: int, target: int, k: int) -> int:
    """
    Find shortest path from source to target with at most k stops.
    
    Args:
        k: Maximum number of stops (edges - 1)
    
    Returns:
        Minimum cost, or -1 if no path exists
    """
    # dist[i] = shortest distance using at most i edges
    dist = [float('inf')] * vertices
    dist[source] = 0
    
    # Run k+1 iterations (k stops = k+1 edges max)
    for _ in range(k + 1):
        # Use copy to avoid using updates from current iteration
        temp = dist.copy()
        
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < temp[v]:
                temp[v] = dist[u] + w
        
        dist = temp
    
    return dist[target] if dist[target] != float('inf') else -1
```

### Template 5: Negative Cycle Detection

```python
def has_negative_cycle(vertices: int, edges: List[Tuple[int, int, int]]) -> bool:
    """
    Check if graph contains a negative cycle.
    
    Returns:
        True if negative cycle exists, False otherwise
    """
    # Add dummy source connected to all vertices
    dist = [0] * vertices  # Initialize all to 0 (allows detecting any cycle)
    
    # Relax V-1 times
    for _ in range(vertices - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycles
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            return True
    
    return False


def find_negative_cycle_vertices(vertices: int, edges: List[Tuple[int, int, int]],
                                  source: int) -> List[int]:
    """Find vertices affected by negative cycle."""
    dist = [float('inf')] * vertices
    parent = [-1] * vertices
    dist[source] = 0
    
    # V relaxations
    for _ in range(vertices):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
    
    # Find vertices on negative cycle
    in_cycle = [False] * vertices
    for v in range(vertices):
        if parent[v] != -1:
            current = v
            for _ in range(vertices):
                current = parent[current]
                if current == -1:
                    break
            if current != -1:
                in_cycle[current] = True
    
    return [i for i, x in enumerate(in_cycle) if x]
```

### Template 6: Currency Arbitrage Detection

```python
import math

def detect_arbitrage(currencies: List[str], 
                     rates: List[Tuple[int, int, float]]) -> bool:
    """
    Detect currency arbitrage opportunity.
    
    Args:
        currencies: List of currency names
        rates: List of (i, j, rate) where rate is exchange rate from currency i to j
    
    Returns:
        True if arbitrage opportunity exists
    """
    n = len(currencies)
    # Convert rates to weights: weight = -log(rate)
    edges = []
    for i, j, rate in rates:
        weight = -math.log(rate)
        edges.append((i, j, weight))
    
    # Bellman-Ford to detect negative cycle
    dist = [float('inf')] * n
    dist[0] = 0
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return True
    
    return False
```

### Template 7: Longest Path in DAG (using modified Bellman-Ford)

```python
def longest_path_dag(vertices: int, edges: List[Tuple[int, int, int]],
                     source: int) -> List[int]:
    """
    Find longest paths in a DAG using modified Bellman-Ford.
    Negate weights and find shortest paths.
    
    Note: Only works for DAGs. For general graphs, longest path is NP-hard.
    """
    # Negate all weights
    neg_edges = [(u, v, -w) for u, v, w in edges]
    
    dist, has_neg_cycle = bellman_ford(vertices, neg_edges, source)
    
    # Check for positive cycle in original graph (negative in negated)
    if has_neg_cycle:
        return []  # Positive cycle exists, longest path undefined
    
    # Convert back to positive distances
    return [-d if d is not None else None for d in dist]
```

---

## When to Use

Use the Bellman-Ford algorithm when you need to solve problems involving:

- **Negative Edge Weights**: When the graph contains edges with negative weights
- **Negative Cycle Detection**: When you need to detect if a negative cycle exists in the graph
- **Single-Source Shortest Path**: When finding shortest paths from one source to all other vertices
- **Constraint Problems**: When problems can be modeled as shortest path with potential negative cycles

### Comparison with Alternatives

| Algorithm | Handles Negative Weights | Detects Negative Cycles | Time Complexity | Best For |
|-----------|-------------------------|------------------------|-----------------|----------|
| **Bellman-Ford** | Yes | Yes | O(V × E) | Graphs with negative weights |
| **Dijkstra's** | No | No | O((V + E) log V) | Dense graphs with positive weights |
| **Floyd-Warshall** | Yes | Yes | O(V³) | All-pairs shortest path |
| **SPFA** | Yes | Yes | O(V × E) average | Sparse graphs, often faster in practice |

### When to Choose Bellman-Ford vs Dijkstra

- **Choose Bellman-Ford** when:
  - Graph has negative edge weights
  - You need to detect negative cycles
  - You're unsure if all weights are non-negative
  
- **Choose Dijkstra's** when:
  - All edge weights are guaranteed non-negative
  - You need faster execution (uses priority queue)
  - Graph is large and sparse

---

## Algorithm Explanation

### Core Concept

The key insight behind Bellman-Ford is that in a graph without negative cycles, the shortest path between any two vertices contains at most **V-1 edges** (where V is the number of vertices). By repeatedly relaxing all edges, we progressively find shorter paths using more edges.

### How It Works

#### Initialization:
1. Set the distance to the source vertex as 0
2. Set all other vertices' distances to infinity (∞)

#### Relaxation Process:
1. **Repeat V-1 times**: For every edge (u, v) with weight w:
    - If `dist[u] + w < dist[v]`, then update `dist[v] = dist[u] + w`
2. This ensures we find shortest paths using paths of increasing length

#### Negative Cycle Detection:
- After V-1 iterations, perform one more pass
- If any edge can still be relaxed, a negative cycle exists
- The algorithm can traverse the cycle infinitely to get arbitrarily short paths

### Visual Representation

```
Graph with 5 vertices:
        
        4          2
    0 --------> 1 --------> 3
    |           |
    |           | -3
    v           v
    2           4
    |           |
    +-----------+

Iteration 0: dist = [0, ∞, ∞, ∞, ∞]
Iteration 1: dist = [0, 4, 2, ∞, ∞]
             (relax 0→1, 0→2, then 1→2, 1→4 with -3)
Iteration 2: dist = [0, 4, 2, 6, 1]
             (relax 2→3, 3→4, 1→3)
Final:       [0, 4, 2, 5, 1]
```

### Why V-1 Iterations?

In a graph without negative cycles:
- The shortest path between any two vertices uses at most V-1 edges
- Each iteration of relaxation finds shortest paths using at most one more edge
- After V-1 iterations, all shortest paths (of length ≤ V-1 edges) are found
- Any remaining relaxable edges indicate a negative cycle

### Limitations

- **Time Complexity**: O(V × E) - slower than Dijkstra for sparse graphs
- **Negative Cycles**: Can cause the algorithm to not terminate (hence the detection step)
- **Not for All-Pairs**: For all-pairs, Floyd-Warshall may be more efficient

---

## Practice Problems

### Problem 1: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** Given a network of n nodes labeled 1 to n, and a list of directed edges (u, v, w) representing a signal traveling from u to v taking w time, find the minimum time for the signal to reach all nodes.

**How to Apply Bellman-Ford:**
- Use Bellman-Ford starting from node k (the source)
- The answer is the maximum distance to any reachable node
- If any node is unreachable, return -1

---

### Problem 2: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are n cities connected by flights. Each flight has a price. Find the cheapest price from src to dst with at most k stops.

**How to Apply Bellman-Ford:**
- Run Bellman-Ford for exactly k+1 iterations (k stops = k+1 edges)
- This is a constrained version of Bellman-Ford
- Track prices at each iteration

---

### Problem 3: Find the City With the Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** There are n cities numbered from 0 to n-1. Given the array edges where edges[i] = [fromi, toi, weighti] represents a bidirectional and weighted edge between cities fromi and toi, find the city with the smallest number of cities that are reachable through some path and whose distance is at most distanceThreshold.

**How to Apply Bellman-Ford:**
- Run Bellman-Ford from each city as source (or use Floyd-Warshall for all-pairs)
- Count reachable cities within the threshold distance for each source
- Return the city with the smallest such count

---

### Problem 4: Minimum Cost to Convert String I

**Problem:** [LeetCode 2976 - Minimum Cost to Convert String I](https://leetcode.com/problems/minimum-cost-to-convert-string-i/)

**Description:** You are given two strings source and target, and an array of character conversion costs. Return the minimum cost to convert source to target.

**How to Apply Bellman-Ford:**
- Model as graph where characters are vertices
- Use Floyd-Warshall or Bellman-Ford to find all-pairs shortest paths
- Sum up costs for each character conversion needed

---

### Problem 5: Design Graph With Shortest Path Calculator

**Problem:** [LeetCode 2642 - Design Graph With Shortest Path Calculator](https://leetcode.com/problems/design-graph-with-shortest-path-calculator/)

**Description:** Design a class to calculate shortest path in a weighted directed graph with positive weights.

**How to Apply Bellman-Ford:**
- Can use Bellman-Ford for shortest path queries
- Alternative: Dijkstra's for better performance with positive weights
- Handle edge additions that might create negative cycles

---

## Video Tutorial Links

### Fundamentals

- [Bellman-Ford Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=9trI0mriUyI) - Comprehensive introduction
- [Bellman-Ford Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=M1Fy86AuwBs) - Detailed explanation with visualizations
- [Negative Cycle Detection (NeetCode)](https://www.youtube.com/watch?v=Tkpp2C3v3gU) - Practical implementation guide

### Advanced Topics

- [SPFA Optimization](https://www.youtube.com/watch?v=Kkmv2e30HWs) - Faster algorithm for sparse graphs
- [Currency Arbitrage Detection](https://www.youtube.com/watch?v=5uyJb2j3G7U) - Real-world application
- [K-Stop Constraint Problems](https://www.youtube.com/watch?v=2kmB6M3BzsQ) - Modified Bellman-Ford

### Problem-Specific

- [Cheapest Flights Within K Stops - LeetCode 787](https://www.youtube.com/watch?v=4wg3Q9bU5xg) - K-stop constraint
- [Network Delay Time - LeetCode 743](https://www.youtube.com/watch?v=e1FZ8x5h7jU) - Basic shortest path

---

## Follow-up Questions

### Q1: What is the time complexity of Bellman-Ford?

**Answer:** Bellman-Ford has O(V × E) time complexity:
- V-1 iterations over all edges: O(V × E)
- One additional pass for negative cycle detection: O(E)
- Total: O(V × E)

For dense graphs where E ≈ V², this becomes O(V³). For sparse graphs where E ≈ V, this is O(V²).

### Q2: How does Bellman-Ford handle negative cycles?

**Answer:** After V-1 iterations, if we can still relax any edge, a negative cycle exists:
1. The algorithm performs one extra iteration to check
2. If any distance can be reduced, there's a negative cycle
3. Vertices affected by the cycle will have their distances continue decreasing
4. The algorithm typically returns a flag indicating negative cycle detection

### Q3: Can Bellman-Ford be used for all-pairs shortest path?

**Answer:** Yes, but it's not efficient:
- Run Bellman-Ford from each vertex: O(V² × E)
- For dense graphs: O(V⁴)
- Better alternatives: Floyd-Warshall (O(V³)) or Johnson's Algorithm (O(V² log V + VE))

### Q4: What is the difference between Bellman-Ford and Dijkstra's?

**Answer:** Key differences:
| Aspect | Bellman-Ford | Dijkstra's |
|--------|--------------|------------|
| Handles negative weights | Yes | No |
| Detects negative cycles | Yes | No |
| Time complexity | O(VE) | O(E + V log V) |
| Data structure | None/Queue | Priority queue |
| Use case | Negative weights, cycle detection | Positive weights only |

### Q5: What is the SPFA algorithm?

**Answer:** Shortest Path Faster Algorithm (SPFA) is an optimization of Bellman-Ford:
- Uses a queue to only process vertices that were actually relaxed
- Often much faster in practice for sparse graphs
- Average case: O(E), worst case: O(VE)
- Can detect negative cycles using a visit count array

---

## Summary

The Bellman-Ford algorithm is a versatile **single-source shortest path** algorithm that handles **negative edge weights** and detects **negative cycles**. Key takeaways:

- **Handles negatives**: Works with graphs containing negative edge weights
- **Cycle detection**: Can detect negative weight cycles
- **Time complexity**: O(V × E)
- **Space complexity**: O(V)
- **Dynamic programming**: Based on iterative relaxation over all edges

When to use:
- Graphs with negative edge weights
- Need to detect negative cycles
- Single-source shortest path problems
- Not for: Large sparse graphs with only positive weights (use Dijkstra's instead)
- Not for: All-pairs shortest path (use Floyd-Warshall instead)

This algorithm is essential for competitive programming and technical interviews, particularly in problems involving weighted graphs with potential negative edges, network routing, and arbitrage detection.
