# Prim's Algorithm

## Category
Graphs

## Description

Prim's algorithm finds the **Minimum Spanning Tree (MST)** of a weighted undirected graph. A spanning tree connects all vertices without forming cycles, and the MST is the spanning tree with the minimum total edge weight. This is a classic **greedy algorithm** that builds the MST incrementally by always selecting the minimum weight edge that connects the tree to a new vertex.

The algorithm starts from an arbitrary vertex and grows the MST one edge at a time, always choosing the cheapest edge that connects a vertex in the tree to a vertex outside the tree. This local optimal choice leads to a globally optimal solution, making Prim's algorithm a fundamental tool in network design and optimization problems.

---

## Concepts

The Prim's algorithm is built on several fundamental concepts that ensure its correctness and efficiency.

### 1. The Cut Property

The theoretical foundation of Prim's algorithm is the **Cut Property**: For any cut (partition) of the graph's vertices into two sets, the minimum weight edge crossing that cut belongs to some Minimum Spanning Tree.

| Property | Description |
|----------|-------------|
| **Cut** | Partition of vertices into two disjoint sets |
| **Crossing Edge** | Edge with one endpoint in each set |
| **Minimum Crossing Edge** | Must be in some MST |

### 2. Greedy Choice

At each step, Prim's algorithm makes a locally optimal choice:
- From all edges connecting the visited set to unvisited vertices
- Select the one with minimum weight
- This greedy choice never needs to be reconsidered

### 3. Priority Queue (Min-Heap)

Efficient implementation uses a min-heap to track candidate edges:

| Operation | Time Complexity | Purpose |
|-----------|----------------|---------|
| Insert | O(log V) | Add new candidate edges |
| Extract-Min | O(log V) | Get minimum weight edge |
| Total | O(E log V) | Process all edges |

### 4. Visited Set

Tracks which vertices are already in the MST:
- Prevents cycles (never add edge to already visited vertex)
- Ensures we process exactly V-1 edges for V vertices
- Can use boolean array for O(1) lookup

---

## Frameworks

Structured approaches for solving Prim's algorithm problems.

### Framework 1: Standard Prim's with Min-Heap (Sparse Graphs)

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD PRIM'S ALGORITHM FRAMEWORK                         │
├─────────────────────────────────────────────────────────────┤
│  1. Build adjacency list from edge list                    │
│  2. Initialize:                                            │
│     - min_heap = [(0, start_vertex, -1)]                  │
│     - visited = [False] * n                               │
│     - total_weight = 0                                     │
│     - edges_used = 0                                       │
│  3. While heap not empty and edges_used < n:               │
│     a. Pop (weight, vertex, parent) from heap             │
│     b. If vertex already visited: continue                │
│     c. Mark vertex as visited                             │
│     d. Add weight to total_weight                         │
│     e. Increment edges_used                               │
│     f. For each neighbor of vertex:                       │
│        - If not visited: push (edge_weight, neighbor, vertex)│
│  4. If edges_used == n: return total_weight               │
│     Else: return -1 (graph disconnected)                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Sparse graphs (E ≈ V), adjacency list representation.

### Framework 2: Dense Graph Prim's (Adjacency Matrix)

```
┌─────────────────────────────────────────────────────────────┐
│  DENSE GRAPH PRIM'S ALGORITHM FRAMEWORK                    │
├─────────────────────────────────────────────────────────────┤
│  1. Use adjacency matrix for O(1) edge lookup              │
│  2. Initialize:                                            │
│     - dist = [infinity] * n  // Min edge weight to MST    │
│     - visited = [False] * n                               │
│     - dist[start] = 0                                      │
│  3. Repeat n times:                                        │
│     a. Find unvisited vertex with minimum dist              │
│     b. If no such vertex: return -1 (disconnected)        │
│     c. Mark vertex as visited                             │
│     d. Add dist[vertex] to total weight                   │
│     e. For each unvisited neighbor:                       │
│        - Update dist[neighbor] = min(dist[neighbor], edge_weight)│
│  4. Return total weight                                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Dense graphs (E ≈ V²), adjacency matrix representation. Time: O(V²).

### Framework 3: Prim's with Edge Tracking

```
┌─────────────────────────────────────────────────────────────┐
│  PRIM'S WITH EDGE TRACKING FRAMEWORK                       │
├─────────────────────────────────────────────────────────────┤
│  1. Similar to standard Prim's, but track actual edges     │
│  2. Modify heap to store: (weight, vertex, parent)        │
│  3. When adding vertex to MST:                             │
│     - If parent != -1: record edge (parent, vertex, weight)│
│  4. Return both total weight and list of MST edges         │
│  5. Useful for reconstructing the actual MST structure      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need to know which edges form the MST, not just the weight.

---

## Forms

Different manifestations of Prim's algorithm.

### Form 1: Standard MST (Minimum Weight)

Basic form that finds the minimum total weight to connect all vertices.

| Aspect | Details |
|--------|---------|
| **Goal** | Minimize total edge weight |
| **Output** | Total weight or list of edges |
| **Complexity** | O(E log V) with heap, O(V²) with matrix |

### Form 2: Maximum Spanning Tree

Same algorithm but finds maximum weight spanning tree.

| Modification | Use max-heap instead of min-heap |
|--------------|----------------------------------|
| **Use Case** | Maximum capacity paths |
| **Application** | Network design with capacity constraints |

### Form 3: MST with Virtual Node

Add a virtual source node connected to all real nodes.

```
Virtual Source (S)
    |
    |--(cost 0)--> Node 1
    |--(cost 5)--> Node 2
    |--(cost 3)--> Node 3
```

**Use case**: Problems like "optimize water distribution" where each node can be connected to a source with some cost.

### Form 4: Partial MST / Steiner Tree Variant

When you only need to connect a subset of vertices (Steiner tree approximation).

| Approach | Run Prim's starting from any required vertex |
|----------|---------------------------------------------|
| **Complexity** | Same as standard MST |
| **Note** | This gives an approximation, not optimal Steiner tree |

### Form 5: MST with Constrained Edges

When some edges must be included or excluded.

| Constraint | Approach |
|------------|----------|
| **Must include** | Add these edges first, then run Prim's |
| **Must exclude** | Remove from consideration before running |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Choosing Between Heap and Matrix Implementation

```python
def prim(n, edges, is_dense=False):
    """
    Auto-select implementation based on graph density.
    """
    if is_dense or len(edges) > n * (n - 1) // 4:
        # Dense graph: use matrix implementation O(V²)
        return prim_dense(n, edges)
    else:
        # Sparse graph: use heap implementation O(E log V)
        return prim_sparse(n, edges)
```

**When to use**: When graph density is unknown or varies.

### Tactic 2: Early Termination

If you only need to connect to a specific target:

```python
def prim_until_target(n, edges, start, target):
    """Run Prim's until target is reached, not all vertices."""
    # ... standard Prim's setup ...
    
    while min_heap:
        weight, u, parent = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
        
        visited[u] = True
        
        # Early termination
        if u == target:
            return total_weight + weight
        
        total_weight += weight
        # ... add neighbors ...
```

**When to use**: When you only need path to one specific vertex.

### Tactic 3: Handling Disconnected Graphs

Detect and handle disconnected components:

```python
def prim_with_component_detection(n, edges):
    """Find MST for each connected component."""
    graph = build_adjacency_list(n, edges)
    visited = [False] * n
    msts = []
    
    for start in range(n):
        if not visited[start]:
            # Run Prim's from this unvisited vertex
            mst_weight = prim_from_source(graph, visited, start)
            if mst_weight >= 0:
                msts.append((start, mst_weight))
    
    return msts  # List of (root, weight) for each component
```

**When to use**: When graph might be disconnected and you need MST for each component.

### Tactic 4: Using Edge List Output

Track edges for path reconstruction:

```python
def prim_with_edges(n, edges):
    """Return both weight and edge list."""
    graph = build_adjacency_list(n, edges)
    min_heap = [(0, 0, -1)]  # (weight, vertex, parent)
    visited = [False] * n
    mst_edges = []
    total_weight = 0
    
    while min_heap:
        weight, u, parent = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
        
        visited[u] = True
        total_weight += weight
        
        if parent != -1:
            mst_edges.append((parent, u, weight))
        
        # Add neighbors...
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v, u))
    
    return total_weight, mst_edges
```

**When to use**: When you need to know the structure of the MST.

### Tactic 5: Parallel Edge Handling

When multiple edges exist between same vertices:

```python
def build_adjacency_list_min_edges(n, edges):
    """Keep only minimum weight edge between each pair."""
    from collections import defaultdict
    
    min_edge = {}
    for u, v, w in edges:
        key = (min(u, v), max(u, v))
        if key not in min_edge or w < min_edge[key]:
            min_edge[key] = w
    
    graph = defaultdict(list)
    for (u, v), w in min_edge.items():
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    return graph
```

**When to use**: When input may contain multiple edges between same vertices.

---

## Python Templates

### Template 1: Standard Prim's Algorithm (Min-Heap)

```python
import heapq
from collections import defaultdict
from typing import List, Tuple, Optional

def prim_mst(n: int, edges: List[List[int]]) -> int:
    """
    Find MST using Prim's algorithm with min-heap.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of edges as [u, v, weight]
    
    Returns:
        Total weight of MST, or -1 if graph is disconnected
    
    Time: O(E log V)
    Space: O(V + E)
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    if not graph:
        return 0  # Single vertex with no edges
    
    # Min-heap: (weight, destination_vertex, parent_vertex)
    min_heap = [(0, 0, -1)]  # Start from vertex 0
    visited = [False] * n
    total_weight = 0
    edges_in_mst = 0
    
    while min_heap and edges_in_mst < n:
        weight, u, parent = heapq.heappop(min_heap)
        
        # Skip if already visited
        if visited[u]:
            continue
        
        # Include this vertex
        visited[u] = True
        total_weight += weight
        edges_in_mst += 1
        
        # Add all adjacent edges to heap
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v, u))
    
    # Check if all vertices were reached
    if edges_in_mst == n:
        return total_weight
    return -1  # Graph is disconnected
```

### Template 2: Prim's Algorithm with Edge Tracking

```python
def prim_mst_edges(n: int, edges: List[List[int]]) -> Tuple[int, List[List[int]]]:
    """
    Return MST with actual edges included.
    
    Args:
        n: Number of vertices
        edges: List of edges as [u, v, weight]
    
    Returns:
        Tuple of (total_weight, list_of_mst_edges)
    """
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    min_heap = [(0, 0, -1)]  # (weight, vertex, parent)
    visited = [False] * n
    mst_edges = []
    total_weight = 0
    edges_count = 0
    
    while min_heap and edges_count < n:
        weight, u, parent = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
        
        visited[u] = True
        total_weight += weight
        edges_count += 1
        
        if parent != -1:
            mst_edges.append([parent, u, weight])
        
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v, u))
    
    if edges_count == n:
        return total_weight, mst_edges
    return -1, []
```

### Template 3: Dense Graph Prim's (Adjacency Matrix)

```python
def prim_dense(n: int, graph: List[List[int]]) -> int:
    """
    Prim's algorithm using adjacency matrix.
    Better for dense graphs where E ≈ V^2.
    
    Time: O(V^2)
    Space: O(V)
    """
    dist = [float('inf')] * n
    visited = [False] * n
    dist[0] = 0
    total_weight = 0
    
    for _ in range(n):
        # Find minimum distance vertex not yet visited
        u = -1
        min_dist = float('inf')
        for v in range(n):
            if not visited[v] and dist[v] < min_dist:
                min_dist = dist[v]
                u = v
        
        if u == -1:  # Graph is disconnected
            return -1
        
        visited[u] = True
        total_weight += min_dist
        
        # Update distances
        for v in range(n):
            if not visited[v] and graph[u][v] < dist[v]:
                dist[v] = graph[u][v]
    
    return total_weight
```

### Template 4: Maximum Spanning Tree

```python
def prim_max_st(n: int, edges: List[List[int]]) -> int:
    """
    Find Maximum Spanning Tree using Prim's.
    Uses max-heap (negate weights for min-heap simulation).
    """
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    # Use negative weights for max-heap simulation
    max_heap = [(0, 0)]  # (-weight, vertex)
    visited = [False] * n
    total_weight = 0
    edges_used = 0
    
    while max_heap and edges_used < n:
        neg_weight, u = heapq.heappop(max_heap)
        weight = -neg_weight
        
        if visited[u]:
            continue
        
        visited[u] = True
        total_weight += weight
        edges_used += 1
        
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(max_heap, (-w, v))
    
    return total_weight if edges_used == n else -1
```

### Template 5: Prim's with Virtual Node

```python
def prim_with_virtual_node(n: int, edges: List[List[int]], 
                           node_costs: List[int]) -> int:
    """
    MST with virtual source node.
    Used when each node can be connected to a central source with some cost.
    
    Args:
        n: Number of real nodes
        edges: List of edges between real nodes [u, v, weight]
        node_costs: Cost to connect each node to virtual source
    
    Returns:
        Minimum cost to connect all nodes (including virtual connections)
    """
    # Add edges from virtual node (n) to all real nodes
    all_edges = edges.copy()
    for i, cost in enumerate(node_costs):
        all_edges.append([n, i, cost])
    
    # Run standard Prim's on n+1 nodes
    return prim_mst(n + 1, all_edges)
```

### Template 6: MST with Component Detection

```python
def prim_all_components(n: int, edges: List[List[int]]) -> List[Tuple[int, int]]:
    """
    Find MST for each connected component.
    
    Returns:
        List of (root_vertex, mst_weight) for each component
    """
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    visited = [False] * n
    components = []
    
    def prim_from(start):
        """Run Prim's from a starting vertex."""
        if not graph[start]:
            return 0  # Isolated vertex
        
        min_heap = [(0, start, -1)]
        weight = 0
        count = 0
        
        while min_heap:
            w, u, p = heapq.heappop(min_heap)
            if visited[u]:
                continue
            visited[u] = True
            weight += w
            count += 1
            
            for v, edge_w in graph[u]:
                if not visited[v]:
                    heapq.heappush(min_heap, (edge_w, v, u))
        
        return weight
    
    for i in range(n):
        if not visited[i]:
            w = prim_from(i)
            components.append((i, w))
    
    return components
```

### Template 7: Second Best MST

```python
def second_best_mst(n: int, edges: List[List[int]]) -> int:
    """
    Find second best (second minimum) spanning tree.
    
    Approach:
    1. Find MST
    2. For each edge not in MST, try adding it (creates cycle)
    3. Remove the maximum edge in that cycle that's in MST
    4. Track minimum among all such candidates
    """
    # Get MST edges
    mst_weight, mst_edges = prim_mst_edges(n, edges)
    mst_edge_set = set()
    for u, v, w in mst_edges:
        mst_edge_set.add((min(u, v), max(u, v)))
    
    # Build adjacency list for MST (for cycle detection)
    mst_graph = defaultdict(list)
    for u, v, w in mst_edges:
        mst_graph[u].append((v, w))
        mst_graph[v].append((u, w))
    
    # Find max edge between any two vertices in MST (using LCA or simple BFS for small n)
    def get_max_edge_path(start, end):
        """Find maximum edge on path from start to end in MST."""
        visited = [False] * n
        max_edge = 0
        
        def dfs(u, target, curr_max):
            if u == target:
                return curr_max
            visited[u] = True
            for v, w in mst_graph[u]:
                if not visited[v]:
                    result = dfs(v, target, max(curr_max, w))
                    if result >= 0:
                        return result
            return -1
        
        return dfs(start, end, 0)
    
    second_best = float('inf')
    
    # Try adding each non-MST edge
    for u, v, w in edges:
        key = (min(u, v), max(u, v))
        if key not in mst_edge_set:
            max_in_path = get_max_edge_path(u, v)
            if max_in_path > 0:
                candidate = mst_weight + w - max_in_path
                second_best = min(second_best, candidate)
    
    return second_best if second_best != float('inf') else -1
```

---

## When to Use

Use Prim's algorithm when you need to solve problems involving:

- **Network Design**: Building cost-effective networks (roads, railways, telecommunications)
- **Clustering**: Grouping data points based on distance
- **Image Segmentation**: Segmenting images based on pixel similarities
- **Approximation Algorithms**: Used as a component in NP-hard problem approximations
- **Any MST-related problem**: When you need to find minimum spanning tree

### Comparison with Alternatives

| Algorithm | Time Complexity | Use Case |
|-----------|----------------|----------|
| **Prim's (Heap)** | O(E log V) | Most common MST algorithm |
| **Prim's (Fibonacci)** | O(E + V log V) | Optimal but complex to implement |
| **Kruskal's** | O(E log V) | Best for sparse graphs |
| **Borůvka's** | O(E log V) | Parallel/foreign-born algorithms |

### When to Choose Prim's vs Kruskal's

- **Choose Prim's** when:
  - The graph is dense (E ≈ V²)
  - You have a starting point requirement
  - You're working with adjacency list representation
  - Graph is given as adjacency matrix

- **Choose Kruskal's** when:
  - The graph is sparse (E ≈ V)
  - Edges are already sorted or can be sorted easily
  - You want simpler implementation
  - You only need the total weight, not the edge structure

---

## Algorithm Explanation

### Core Concept

The key insight behind Prim's algorithm is the **Cut Property**: For any cut of the graph (a partition of vertices into two sets), the minimum weight edge crossing that cut is in some MST. By repeatedly applying this property—always picking the minimum weight edge that connects the visited vertices to unvisited vertices—we guarantee finding the optimal MST.

### How It Works

#### Initialization:
1. Start from an arbitrary vertex (usually vertex 0)
2. Mark it as part of the MST
3. Add all edges from this vertex to a priority queue (min-heap)

#### Growth Phase:
1. Extract the minimum weight edge from the priority queue
2. If the destination vertex is already visited, skip it
3. Otherwise, add the vertex and edge to the MST
4. Add all edges from this new vertex to unvisited vertices into the queue
5. Repeat until all vertices are included

#### Termination:
- The algorithm stops when all V vertices are in the MST
- If the priority queue becomes empty before reaching all vertices, the graph is disconnected (no MST exists)

### Visual Representation

For a graph with vertices {0, 1, 2, 3} and edges:
```
0 --(10)--> 1
0 --(6)--> 2
0 --(5)--> 3
1 --(15)--> 3
2 --(4)--> 3
```

```
Step 1: Start at vertex 0
        MST: {0}, Queue: [(10,1), (6,2), (5,3)]

Step 2: Pick edge (5,3) - add vertex 3
        MST: {0,3}, Queue: [(10,1), (6,2), (15,3)]

Step 3: Pick edge (4,3) - add vertex 2  
        MST: {0,3,2}, Queue: [(10,1), (15,3)]

Step 4: Pick edge (10,1) - add vertex 1
        MST: {0,3,2,1}, Queue: [(15,3)]

Total weight: 5 + 4 + 10 = 19
```

### Why Greedy Works

The greedy approach is valid due to the **Cut Property**:
- At each step, we have a "cut" separating visited vertices from unvisited ones
- The minimum edge crossing this cut MUST be in the MST
- By always picking this minimum edge, we never make a suboptimal choice
- This local optimal choice leads to global optimal (MST)

### Limitations

- **Only works for undirected graphs**: For directed minimum spanning arborescents, use Chu–Liu/Edmonds algorithm
- **Requires connected graph**: Disconnected graphs don't have an MST
- **Only considers edge weights**: All edges must have comparable weights

---

## Practice Problems

### Problem 1: Minimum Cost to Connect All Points

**Problem:** [LeetCode 1584 - Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**Description:** You are given an array `points` representing integer coordinates. Return the minimum total length to connect all points.

**How to Apply Prim's:**
- Build complete graph where weight = Manhattan distance
- Use Prim's algorithm to find MST
- Works because distance satisfies triangle inequality

---

### Problem 2: Number of Operations to Make Network Connected

**Problem:** [LeetCode 1319 - Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)

**Description:** Make all computers connected with minimum operations.

**How to Apply Prim's:**
- This uses Union-Find (related graph concept)
- Find number of connected components
- Minimum moves = components - 1

---

### Problem 3: Find the City With the Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Find city with fewest reachable cities within distance threshold.

**How to Apply Prim's:**
- Use modified MST or Dijkstra variants
- Find all pairs within threshold
- Count reachable nodes

---

### Problem 4: Optimize Water Distribution

**Problem:** [LeetCode 1168 - Optimize Water Distribution in a Village](https://leetcode.com/problems/optimize-water-distribution-in-a-village/)

**Description:** Build water pipes to supply water to all houses with minimum cost.

**How to Apply Prim's:**
- Add virtual source (water warehouse) with edge weights = house cost
- Find MST including virtual source
- Classic "MST with virtual node" pattern

---

### Problem 5: Connecting Cities With Minimum Cost

**Problem:** [LeetCode 1135 - Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)

**Description:** Connect N cities with minimum cost using Kruskal's or Prim's.

**How to Apply Prim's:**
- Direct application of MST
- Build edges from input connections
- Return -1 if not all cities can be connected

---

## Video Tutorial Links

### Fundamentals

- [Prim's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=msttfZySq7w) - Comprehensive introduction
- [Prim's Algorithm Visualization (WilliamFiset)](https://www.youtube.com/watch?v=Maa_DZVE1j0) - Detailed visualization
- [MST - Prim & Kruskal (NeetCode)](https://www.youtube.com/watch?v=4f1E4y0I7-0) - Compare both algorithms

### Advanced Topics

- [Fibonacci Heap Prim's](https://www.youtube.com/watch?v=puX76-r9tD0) - Optimal implementation
- [Prim's vs Kruskal's](https://www.youtube.com/watch?v=71cU2L4Z7i4) - When to use which
- [Network Design Applications](https://www.youtube.com/watch?v=x6CBn2zOzT0) - Real-world applications

---

## Follow-up Questions

### Q1: What is the difference between Prim's and Kruskal's algorithms?

**Answer:** Both find MST but with different approaches:
- **Kruskal's**: Sort all edges, add smallest that doesn't form cycle (uses Union-Find)
- **Prim's**: Grow tree from a starting vertex using cut property
- **Complexity**: Both O(E log V) typically; Prim's better for dense graphs, Kruskal's for sparse

### Q2: Can Prim's algorithm handle negative edge weights?

**Answer:** Yes! Prim's works correctly with negative weights as long as:
- No negative cycles exist (otherwise MST is undefined)
- The algorithm naturally handles negatives since we always pick minimum

### Q3: What happens if the graph is disconnected?

**Answer:** Prim's algorithm will:
- Process all reachable vertices
- Eventually exhaust the heap without reaching all vertices
- Return -1 or indicate no complete MST exists
- This is correct: disconnected graphs have no spanning tree

### Q4: How does Prim's compare to Dijkstra's?

**Answer:** They look similar but have key differences:
- **Dijkstra**: Minimizes distance from source to each vertex
- **Prim**: Minimizes edge weight connecting to MST
- Both use greedy + priority queue approach
- Different relaxation: Dijkstra updates dist[v] = min(dist[v], dist[u] + weight)

### Q5: When should you use the dense graph version of Prim's?

**Answer:** Use O(V²) matrix version when:
- Graph is dense (E ≈ V²)
- Memory for adjacency list is a concern
- Simpler implementation is preferred
- Graph is small enough that O(V²) is acceptable

---

## Summary

Prim's algorithm is a fundamental **greedy algorithm** for finding the **Minimum Spanning Tree** in weighted undirected graphs. Key takeaways:

- **Greedy approach**: Always pick minimum weight edge crossing the cut
- **Time complexity**: O(E log V) with heap, O(V²) with matrix
- **Space complexity**: O(V + E)
- **Works for**: Connected undirected graphs with weighted edges
- **Applications**: Network design, clustering, image segmentation

When to use:
- Finding MST in undirected weighted graphs
- Network optimization problems
- When you need a starting point/root
- Dense graphs (use Prim's over Kruskal's)

When not to use:
- Directed graphs (use Chu-Liu/Edmonds)
- Disconnected graphs (no MST exists)
- Very sparse graphs with sorted edges (Kruskal's may be simpler)

This algorithm is essential for competitive programming and technical interviews, especially in graph-related optimization problems.
