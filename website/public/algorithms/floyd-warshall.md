# Floyd-Warshall Algorithm

## Category
Graphs

## Description

The Floyd-Warshall algorithm is a fundamental **all-pairs shortest path** algorithm that finds the shortest paths between **all pairs of vertices** in a weighted graph. It uses dynamic programming to systematically consider each vertex as a potential intermediate point in paths, making it incredibly powerful for solving graph distance problems.

Unlike Dijkstra's algorithm (which finds shortest paths from a single source) or Bellman-Ford (which handles negative weights for single-source), Floyd-Warshall computes shortest paths between **every pair of vertices** in a single pass. This makes it ideal when you need to answer multiple distance queries between any two nodes.

**Key Characteristics:**
- Works with both positive and negative edge weights
- Detects negative weight cycles
- Computes all-pairs shortest paths in O(V³) time
- Space-efficient with O(V²) storage

---

## Concepts

The Floyd-Warshall algorithm is built on several fundamental concepts that enable its elegant dynamic programming approach.

### 1. Dynamic Programming Principle

The algorithm builds up solutions using previously computed shorter paths:

| State | Meaning |
|-------|---------|
| **dist[i][j][k]** | Shortest path from i to j using intermediate vertices from {0, 1, ..., k-1} |
| **dist[i][j][0]** | Direct edge weight (or infinity if no edge) |
| **dist[i][j][k+1]** | Min of using or not using vertex k as intermediate |

### 2. Recurrence Relation

The core recurrence considers whether vertex k improves the path:

```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

| Case | Meaning |
|------|---------|
| Keep dist[i][j] | Current shortest path doesn't use k as intermediate |
| Use dist[i][k] + dist[k][j] | Path through k is shorter |

### 3. Space Optimization

The algorithm uses only O(V²) space by updating in place:

| Version | Space | Approach |
|---------|-------|----------|
| Naive 3D | O(V³) | Store dist[i][j][k] for all k |
| Optimized 2D | O(V²) | Update dist[i][j] in place |

### 4. Path Reconstruction

Track the actual path using a parent/successor matrix:

```
When updating dist[i][j] through k:
    parent[i][j] = parent[k][j]
    
Path reconstruction:
    Follow parent pointers from source to destination
```

---

## Frameworks

Structured approaches for solving Floyd-Warshall problems.

### Framework 1: Standard Floyd-Warshall (All-Pairs Shortest Path)

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD FLOYD-WARSHALL FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize distance matrix:                            │
│     a. dist[i][i] = 0 for all i                             │
│     b. dist[i][j] = weight(i,j) if edge exists            │
│     c. dist[i][j] = infinity otherwise                    │
│  2. Initialize parent matrix (for path reconstruction):   │
│     a. parent[i][j] = i if edge (i,j) exists              │
│     b. parent[i][j] = null otherwise                     │
│  3. For each intermediate vertex k from 0 to n-1:           │
│     a. For each source vertex i from 0 to n-1:            │
│        - Skip if dist[i][k] is infinity                     │
│     b. For each destination vertex j from 0 to n-1:        │
│        - Skip if dist[k][j] is infinity                    │
│        - If dist[i][k] + dist[k][j] < dist[i][j]:         │
│          * dist[i][j] = dist[i][k] + dist[k][j]            │
│          * parent[i][j] = parent[k][j]                     │
│  4. Check for negative cycles:                             │
│     a. If any dist[i][i] < 0: negative cycle exists        │
│  5. Return distance matrix                                 │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard all-pairs shortest path problems.

### Framework 2: Floyd-Warshall for Transitive Closure

```
┌─────────────────────────────────────────────────────────────┐
│  TRANSITIVE CLOSURE FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  1. Instead of distances, store boolean reachability:      │
│     a. reach[i][j] = True if edge (i,j) exists            │
│     b. reach[i][i] = True for all i                         │
│  2. Update rule (logical OR instead of min):               │
│     a. reach[i][j] = reach[i][j] OR (reach[i][k] AND reach[k][j])│
│  3. Result: reach[i][j] tells if j is reachable from i     │
│  4. Applications:                                           │
│     - Graph reachability                                    │
│     - Strongly connected components                       │
│     - Partial order relationships                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Reachability problems, not shortest distances.

### Framework 3: Successor Matrix for Path Reconstruction

```
┌─────────────────────────────────────────────────────────────┐
│  SUCCESSOR MATRIX FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Maintain succ[i][j] = next vertex after i in shortest │
│     path from i to j                                        │
│  2. Initialization:                                        │
│     a. succ[i][j] = j if edge (i,j) exists               │
│     b. succ[i][j] = null otherwise                         │
│  3. Update: When going through k is better                 │
│     a. succ[i][j] = succ[i][k]                            │
│  4. Path reconstruction:                                   │
│     a. Start at source u                                   │
│     b. While u != target: u = succ[u][target]             │
│     c. Add u to path                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need to reconstruct actual paths efficiently.

---

## Forms

Different manifestations of the Floyd-Warshall algorithm.

### Form 1: Standard All-Pairs Shortest Path

Basic form that finds shortest paths between all pairs.

| Aspect | Details |
|--------|---------|
| **Goal** | Shortest distances between all pairs |
| **Output** | Distance matrix (n × n) |
| **Time** | O(V³) |
| **Space** | O(V²) |

### Form 2: Transitive Closure (Reachability)

Determines if a path exists between any two vertices.

| Modification | Use boolean matrix, logical OR operation |
|--------------|-------------------------------------------|
| **Output** | Boolean reachability matrix |
| **Use Case** | Checking connectivity, partial orders |

### Form 3: Shortest Path with Path Reconstruction

Tracks actual paths using parent or successor matrix.

| Modification | Maintain parent/successor matrix |
|--------------|----------------------------------|
| **Extra Space** | O(V²) for parent matrix |
| **Use Case** | Need to output actual shortest paths |

### Form 4: Graph Center and Radius

Find the "center" of the graph.

| Metric | Definition |
|--------|------------|
| **Eccentricity** | Maximum distance from vertex to any other |
| **Graph Radius** | Minimum eccentricity among all vertices |
| **Graph Center** | Vertex with minimum eccentricity |
| **Graph Diameter** | Maximum eccentricity (longest shortest path) |

### Form 5: All-Pairs Negative Cycle Detection

Detects negative cycles affecting paths between pairs.

| Check | After algorithm, check if dist[i][i] < 0 for any i |
|-------|-----------------------------------------------------|
| **Meaning** | Negative cycle exists affecting vertex i |
| **Propagation** | If dist[i][i] < 0, all paths through i are undefined |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Termination on Negative Cycle

Check for negative cycles during execution:

```python
def floyd_warshall_with_early_check(n, edges):
    # Initialize
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w
    
    # Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
        
        # Early check: if any diagonal is negative, abort
        if any(dist[i][i] < 0 for i in range(n)):
            return None  # Negative cycle detected
    
    return dist
```

**When to use**: When you want to abort early if negative cycles exist.

### Tactic 2: Space Optimization with Two Arrays

For constrained memory, use bit manipulation or sparse storage:

```python
# Standard: O(V²) space
dist = [[inf] * n for _ in range(n)]

# Optimization: If graph is sparse, use adjacency list + hash map
# But then you lose the O(1) lookup benefits of Floyd-Warshall
```

**When to use**: When memory is extremely constrained (rare for Floyd-Warshall).

### Tactic 3: Path Reconstruction Optimization

Efficient path reconstruction using successor matrix:

```python
def reconstruct_path_succ(succ, u, v):
    """Reconstruct path using successor matrix."""
    if succ[u][v] is None:
        return []  # No path
    
    path = [u]
    while u != v:
        u = succ[u][v]
        path.append(u)
    return path
```

**When to use**: When you need to reconstruct paths frequently.

### Tactic 4: Graph Center and Radius Calculation

Find the graph center after running Floyd-Warshall:

```python
def find_graph_center(dist):
    """
    Find the center of a graph.
    Center = vertex with minimum eccentricity.
    """
    n = len(dist)
    min_ecc = float('inf')
    center = -1
    
    for i in range(n):
        # Calculate eccentricity of vertex i
        ecc = max(dist[i][j] for j in range(n) if dist[i][j] != float('inf'))
        if ecc < min_ecc:
            min_ecc = ecc
            center = i
    
    return center, min_ecc  # center vertex and graph radius


def find_graph_diameter(dist):
    """
    Find the diameter of a graph.
    Diameter = longest shortest path.
    """
    n = len(dist)
    diameter = 0
    
    for i in range(n):
        for j in range(n):
            if dist[i][j] != float('inf'):
                diameter = max(diameter, dist[i][j])
    
    return diameter
```

**When to use**: Network analysis, facility location problems.

### Tactic 5: Handling Unreachable Pairs

Check for and handle unreachable vertex pairs:

```python
def count_reachable_pairs(dist):
    """Count number of reachable vertex pairs."""
    n = len(dist)
    count = 0
    
    for i in range(n):
        for j in range(n):
            if i != j and dist[i][j] != float('inf'):
                count += 1
    
    return count


def find_unreachable_pairs(dist):
    """Find pairs of vertices with no path between them."""
    n = len(dist)
    unreachable = []
    
    for i in range(n):
        for j in range(i + 1, n):
            if dist[i][j] == float('inf'):
                unreachable.append((i, j))
    
    return unreachable
```

**When to use**: Connectivity analysis, checking if graph is strongly connected.

---

## Python Templates

### Template 1: Standard Floyd-Warshall (All-Pairs Shortest Path)

```python
def floyd_warshall(n, edges, directed=False):
    """
    Floyd-Warshall All-Pairs Shortest Path Algorithm.
    
    Time Complexity: O(V³)
    Space Complexity: O(V²)
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of (u, v, weight) tuples
        directed: If True, graph is directed; if False, undirected
    
    Returns:
        2D matrix where dist[i][j] = shortest distance from i to j
    """
    INF = float('inf')
    
    # Step 1: Initialize distance matrix
    dist = [[INF] * n for _ in range(n)]
    
    # Distance to self is 0
    for i in range(n):
        dist[i][i] = 0
    
    # Step 2: Set direct edge weights
    for u, v, w in edges:
        if w < dist[u][v]:  # Take minimum if multiple edges
            dist[u][v] = w
        if not directed:
            dist[v][u] = w
    
    # Step 3: Floyd-Warshall - consider each vertex as intermediate
    for k in range(n):
        for i in range(n):
            # Early termination: skip if i->k is unreachable
            if dist[i][k] == INF:
                continue
            for j in range(n):
                # Early termination: skip if k->j is unreachable
                if dist[k][j] == INF:
                    continue
                # Update if path through k is shorter
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist


def detect_negative_cycle(n, edges, directed=False):
    """
    Detect if graph contains a negative cycle using Floyd-Warshall.
    
    Returns:
        True if negative cycle exists, False otherwise
    """
    dist = floyd_warshall(n, edges, directed)
    
    # Check for negative cycles
    for i in range(n):
        if dist[i][i] < 0:
            return True
    
    return False
```

### Template 2: Floyd-Warshall with Path Reconstruction

```python
def floyd_warshall_with_path(n, edges, directed=False):
    """
    Floyd-Warshall with path reconstruction.
    
    Returns:
        Tuple of (distance matrix, parent matrix)
    """
    INF = float('inf')
    
    # Initialize
    dist = [[INF] * n for _ in range(n)]
    parent = [[-1] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = w
        parent[u][v] = u
        if not directed:
            dist[v][u] = w
            parent[v][u] = v
    
    # Floyd-Warshall with path tracking
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    new_dist = dist[i][k] + dist[k][j]
                    if new_dist < dist[i][j]:
                        dist[i][j] = new_dist
                        parent[i][j] = parent[k][j]
    
    return dist, parent


def get_path(parent, u, v):
    """
    Reconstruct shortest path from u to v using parent matrix.
    
    Args:
        parent: Parent matrix from Floyd-Warshall
        u: Source vertex
        v: Destination vertex
    
    Returns:
        List of vertices in shortest path from u to v
    """
    if parent[u][v] == -1:
        return []  # No path exists
    
    path = []
    current = v
    while current != -1:
        path.append(current)
        if current == u:
            break
        current = parent[u][current] if current == v else parent[current][v]
    
    if path[-1] != u:
        return []  # No complete path
    
    path.reverse()
    return path
```

### Template 3: Transitive Closure (Reachability)

```python
def transitive_closure(n, edges, directed=False):
    """
    Compute transitive closure using Floyd-Warshall.
    
    Returns:
        2D matrix where reach[i][j] = True if j is reachable from i
    """
    reach = [[False] * n for _ in range(n)]
    
    # Initialize
    for i in range(n):
        reach[i][i] = True
    
    for u, v, _ in edges:
        reach[u][v] = True
        if not directed:
            reach[v][u] = True
    
    # Floyd-Warshall for reachability
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if reach[i][k] and reach[k][j]:
                    reach[i][j] = True
    
    return reach


def is_strongly_connected(n, edges):
    """Check if directed graph is strongly connected."""
    reach = transitive_closure(n, edges, directed=True)
    
    # Check if all pairs are reachable in both directions
    for i in range(n):
        for j in range(n):
            if not (reach[i][j] and reach[j][i]):
                return False
    return True
```

### Template 4: Graph Center and Radius

```python
def graph_center(dist):
    """
    Find the center of a graph.
    Center = vertex with minimum eccentricity.
    
    Returns:
        Tuple of (center_vertex, radius)
    """
    n = len(dist)
    min_ecc = float('inf')
    center = -1
    
    for i in range(n):
        # Calculate eccentricity of vertex i
        max_dist = 0
        for j in range(n):
            if dist[i][j] != float('inf'):
                max_dist = max(max_dist, dist[i][j])
        
        if max_dist < min_ecc:
            min_ecc = max_dist
            center = i
    
    return center, min_ecc


def graph_diameter(dist):
    """
    Find the diameter of a graph.
    Diameter = longest shortest path.
    """
    n = len(dist)
    diameter = 0
    
    for i in range(n):
        for j in range(n):
            if dist[i][j] != float('inf'):
                diameter = max(diameter, dist[i][j])
    
    return diameter


def find_cities_within_threshold(dist, threshold):
    """
    Find all cities reachable within a given distance threshold.
    
    Returns:
        List of lists: result[i] = list of cities reachable from i within threshold
    """
    n = len(dist)
    result = []
    
    for i in range(n):
        reachable = []
        for j in range(n):
            if i != j and dist[i][j] <= threshold:
                reachable.append(j)
        result.append(reachable)
    
    return result
```

### Template 5: Shortest Path with Node Constraints

```python
def floyd_warshall_avoid_node(n, edges, forbidden_node):
    """
    Find all-pairs shortest paths that avoid a specific node.
    
    Args:
        forbidden_node: Node that cannot be used in paths
    """
    INF = float('inf')
    
    # Initialize
    dist = [[INF] * n for _ in range(n)]
    
    for i in range(n):
        if i != forbidden_node:
            dist[i][i] = 0
    
    for u, v, w in edges:
        if u != forbidden_node and v != forbidden_node:
            dist[u][v] = min(dist[u][v], w)
    
    # Floyd-Warshall, skipping forbidden node
    for k in range(n):
        if k == forbidden_node:
            continue
        for i in range(n):
            if i == forbidden_node or dist[i][k] == INF:
                continue
            for j in range(n):
                if j == forbidden_node or dist[k][j] == INF:
                    continue
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist
```

### Template 6: Successor Matrix for Fast Path Reconstruction

```python
def floyd_warshall_with_successor(n, edges):
    """
    Floyd-Warshall with successor matrix for efficient path reconstruction.
    
    Returns:
        Tuple of (distance matrix, successor matrix)
    """
    INF = float('inf')
    
    dist = [[INF] * n for _ in range(n)]
    succ = [[None] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = w
        succ[u][v] = v
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    new_dist = dist[i][k] + dist[k][j]
                    if new_dist < dist[i][j]:
                        dist[i][j] = new_dist
                        succ[i][j] = succ[i][k]
    
    return dist, succ


def reconstruct_path_fast(succ, u, v):
    """Reconstruct path using successor matrix (O(length) time)."""
    if succ[u][v] is None:
        return []
    
    path = [u]
    while u != v:
        u = succ[u][v]
        path.append(u)
    return path
```

### Template 7: Minimum Maximum Edge Weight Path (Minimax)

```python
def minimax_floyd_warshall(n, edges):
    """
    Find path that minimizes the maximum edge weight.
    Useful for finding paths with minimum bottleneck.
    """
    INF = float('inf')
    
    # dist[i][j] = minimum possible maximum edge weight on path from i to j
    dist = [[INF] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
    
    # Modified Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                # Minimize the maximum edge on the path
                bottleneck = max(dist[i][k], dist[k][j])
                if bottleneck < dist[i][j]:
                    dist[i][j] = bottleneck
    
    return dist
```

---

## When to Use

Use the Floyd-Warshall algorithm when you need to solve problems involving:

- **All-Pairs Shortest Paths**: When you need distances between every pair of vertices
- **Negative Edge Weights**: When the graph may contain negative-weight edges (but no negative cycles)
- **Transitive Closure**: When you need to determine if a path exists between any two vertices
- **Graph Center**: Finding the vertex that minimizes the maximum distance to any other vertex
- **Reachability Queries**: Determining which vertices are reachable from others

### Comparison with Alternatives

| Algorithm | Time Complexity | Space | Use Case |
|-----------|----------------|-------|----------|
| **Floyd-Warshall** | O(V³) | O(V²) | All-pairs shortest paths, small-medium graphs |
| **Dijkstra (×V)** | O(V²) or O(E log V) | O(V) | Single-source queries, sparse graphs |
| **Bellman-Ford (×V)** | O(V×E) | O(V) | Negative weights, single-source |
| **Johnson's Algorithm** | O(V² log V + VE) | O(V²) | Sparse graphs with negative weights |

### When to Choose Floyd-Warshall vs Dijkstra

- **Choose Floyd-Warshall** when:
  - You need shortest paths between ALL pairs of vertices
  - The graph is dense (E ≈ V²)
  - You have negative edge weights
  - Multiple queries will be made after preprocessing

- **Choose Dijkstra** when:
  - You only need paths from a single source
  - The graph is sparse (E << V²)
  - All edge weights are non-negative
  - Memory is constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind Floyd-Warshall is elegant in its simplicity: **any shortest path from vertex i to vertex j can be expressed as a path through some intermediate vertex k**. By systematically considering each vertex as a potential intermediate point, we can build up the shortest paths between all pairs.

The dynamic programming recurrence is:
```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

This means: "The shortest path from i to j is either the previously known path, or a path that goes through vertex k."

### Why It Works

The algorithm builds on the principle of **optimal substructure**: the shortest path between any two vertices can be constructed from shortest paths between intermediate vertices. This is a hallmark of dynamic programming.

**Proof Sketch:**
1. Base case: Without any intermediate vertices, the shortest path is the direct edge (or infinity if no edge exists)
2. Inductive step: When considering vertex k as an intermediate, either:
   - The optimal path doesn't use k: dist[i][j] stays the same
   - The optimal path uses k: It's dist[i][k] + dist[k][j], both of which were computed in earlier iterations
3. After considering all vertices as potential intermediates, we have the true shortest paths

### Visual Representation

Consider a graph with 4 vertices:
```
     5
   0 --- 1
   |     |
  7     3
   |     |
   2 --- 3
      2
```

**Initial distance matrix (direct edges only):**
```
     0    1    2    3
0 [  0,   5,   7,  ∞  ]
1 [  5,   0,   3,   3  ]
2 [  7,   3,   0,   2  ]
3 [  ∞,   3,   2,   0  ]
```

**After considering vertex 0 as intermediate:**
- dist[1][2] = min(3, 5+7) = 3
- dist[2][1] = min(3, 7+5) = 3
- dist[1][3] = min(3, 5+∞) = 3
- dist[2][0] = min(7, 3+5) = 7

**After considering vertex 1 as intermediate:**
- dist[0][2] = min(7, 5+3) = 6 ✓ (0→1→2 is shorter)
- dist[0][3] = min(∞, 5+3) = 8 ✓ (0→1→3 is shorter)

**Final distance matrix:**
```
     0    1    2    3
0 [  0,   5,   6,   8  ]
1 [  5,   0,   3,   3  ]
2 [  6,   3,   0,   2  ]
3 [  8,   3,   2,   0  ]
```

### Limitations

- **Time Complexity**: O(V³) makes it impractical for very large graphs (V > 5000)
- **Space**: O(V²) for the distance matrix
- **Negative Cycles**: While it can detect negative cycles, paths through negative cycles are undefined (can become arbitrarily small)

---

## Practice Problems

### Problem 1: Find the City With the Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** There are n cities numbered from 0 to n-1. Given the array edges where edges[i] = [fromi, toi, weighti] represents a bidirectional and weighted edge between cities fromi and toi, find the city with the smallest number of cities that are reachable through some path and whose distance is at most distanceThreshold.

**How to Apply Floyd-Warshall:**
- Use Floyd-Warshall to compute all-pairs shortest paths
- For each city, count how many other cities are reachable within the threshold distance
- Select the city with minimum such count

---

### Problem 2: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** Given a network of n nodes labeled 1 to n, and a list of directed edges with travel times, find the minimum time it takes for the signal to reach all nodes.

**How to Apply Floyd-Warshall:**
- Build the distance matrix with all edges
- Run Floyd-Warshall to compute all-pairs shortest paths
- Find the maximum distance from the source to any reachable node

---

### Problem 3: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are n cities connected by flights. Each flight has a price. Find the cheapest price from source to destination with at most K stops.

**How to Apply Floyd-Warshall:**
- While Floyd-Warshall computes shortest paths without stops limit
- For K-stop variant, use dynamic programming or modified Bellman-Ford
- Floyd-Warshall variant can track number of edges used

---

### Problem 4: Minimum Cost to Convert String I

**Problem:** [LeetCode 2976 - Minimum Cost to Convert String I](https://leetcode.com/problems/minimum-cost-to-convert-string-i/)

**Description:** You are given two strings source and target, and an original array of character conversions. Return the minimum cost to convert source to target.

**How to Apply Floyd-Warshall:**
- Model as graph where characters are vertices
- Use Floyd-Warshall to find all-pairs shortest paths between characters
- Sum up costs for each character conversion needed

---

### Problem 5: Design Graph With Shortest Path Calculator

**Problem:** [LeetCode 2642 - Design Graph With Shortest Path Calculator](https://leetcode.com/problems/design-graph-with-shortest-path-calculator/)

**Description:** There is a weighted directed graph with n nodes labeled from 0 to n - 1. Implement the Graph class to calculate shortest paths.

**How to Apply Floyd-Warshall:**
- Use Floyd-Warshall to precompute all-pairs shortest paths
- Update the distance matrix when edges are added
- Query shortest path in O(1) after precomputation

---

## Video Tutorial Links

### Fundamentals

- [Floyd-Warshall Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=1E5s7f1jH3w) - Comprehensive introduction
- [Floyd-Warshall Implementation (WilliamFiset)](https://www.youtube.com/watch?v=oL1s8oKQ0p8) - Detailed implementation guide
- [All-Pairs Shortest Path (NeetCode)](https://www.youtube.com/watch?v=6qM7t_2X9cM) - Practical problem-solving approach

### Advanced Topics

- [Negative Edge Weights and Cycle Detection](https://www.youtube.com/watch?v=9E2L4t_ZEwU) - Handling negative weights
- [Path Reconstruction](https://www.youtube.com/watch?v=L1L8q7z1s3g) - Building actual paths
- [Johnson's Algorithm](https://www.youtube.com/watch?v=c8-2qKh7a9U) - Hybrid approach for sparse graphs
- [Transitive Closure](https://www.youtube.com/watch?v=6X7f8sK5vYs) - Reachability problems

---

## Follow-up Questions

### Q1: How does Floyd-Warshall handle negative edge weights?

**Answer:** Floyd-Warshall correctly handles negative edge weights as long as there are no negative cycles. The algorithm works by repeatedly improving path estimates, which naturally handles negative weights. However, if a negative cycle exists (a cycle whose total weight is negative), the shortest path is undefined because you can loop infinitely to get arbitrarily small distances. The algorithm can detect this by checking if any dist[i][i] becomes negative after running.

### Q2: What is the difference between Floyd-Warshall and Dijkstra's algorithm?

**Answer:** Key differences:
- **Scope**: Floyd-Warshall computes ALL pairs; Dijkstra computes from ONE source
- **Time**: Floyd-Warshall is O(V³); Dijkstra is O(E log V) per source
- **Weights**: Both handle positive weights; Floyd-Warshall also handles negative weights
- **Use case**: Use Floyd-Warshall when you need many source-destination pairs; use Dijkstra for single-source queries

### Q3: Can Floyd-Warshall be parallelized?

**Answer:** Yes! The algorithm has good parallelism potential:
- The inner loop over j can be parallelized for each (i, k) pair
- GPU implementations can process the entire k-th iteration in parallel
- OpenMP and CUDA can significantly speed up the computation
- However, data dependencies between k-iterations prevent full parallelization

### Q4: How do you reconstruct the actual path in Floyd-Warshall?

**Answer:** Use a parent/next matrix:
1. Initialize parent[u][v] = u when there's a direct edge
2. When updating dist[i][j] through k, set parent[i][j] = parent[k][j]
3. To reconstruct path from u to v: follow parent pointers from u to v

### Q5: When should you use Johnson's algorithm instead of Floyd-Warshall?

**Answer:** Use Johnson's algorithm when:
- The graph is sparse (E << V²)
- You have negative weights but no negative cycles
- You need single-source shortest paths from multiple sources

Johnson's algorithm: O(VE + V² log V) vs Floyd-Warshall: O(V³)
- For dense graphs: Floyd-Warshall is better
- For sparse graphs: Johnson's algorithm is better

---

## Summary

The Floyd-Warshall algorithm is a fundamental tool for solving **all-pairs shortest path** problems in graphs. Key takeaways:

- **Complete solution**: Computes shortest paths between ALL pairs of vertices
- **Negative weights**: Handles negative edge weights (detects negative cycles)
- **Dynamic programming**: Elegant O(V³) solution using the principle of considering intermediate vertices
- **Path reconstruction**: Can reconstruct actual paths using a parent matrix

When to use:
- All-pairs shortest paths needed
- Graph is dense (E ≈ V²)
- Negative edge weights present
- Multiple distance queries required
- Not for: Graph is very large (V > 5000) - use Dijkstra instead
- Not for: Only single-source needed - use Dijkstra/Bellman-Ford

This algorithm is essential for competitive programming and technical interviews, especially in problems involving network routing, graph distance queries, and reachability analysis.
