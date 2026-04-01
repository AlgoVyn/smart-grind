# Kruskal's Algorithm

## Category
Graphs

## Description

Kruskal's Algorithm finds the Minimum Spanning Tree (MST) of a weighted undirected graph using a greedy approach. It sorts edges by weight and uses Union-Find (Disjoint Set Union) to avoid cycles, making it efficient for sparse graphs.

The algorithm processes edges in order of increasing weight, adding an edge to the MST if it doesn't create a cycle. This edge-centric approach makes Kruskal's particularly intuitive and easier to implement than alternative MST algorithms, while maintaining optimal time complexity through efficient cycle detection using the Union-Find data structure.

---

## Concepts

Kruskal's algorithm relies on several fundamental concepts that ensure both correctness and efficiency.

### 1. The Cut Property

The theoretical foundation guaranteeing that the greedy approach produces an optimal MST:

| Property | Description |
|----------|-------------|
| **Cut** | Partition of vertices into two disjoint sets |
| **Crossing Edge** | Edge connecting vertices from different sets |
| **Minimum Edge** | The minimum weight crossing edge belongs to some MST |

### 2. Union-Find (Disjoint Set Union)

Efficient data structure for tracking connected components:

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **find(x)** | O(α(n)) ≈ O(1) | Find root of set containing x |
| **union(x, y)** | O(α(n)) ≈ O(1) | Merge sets containing x and y |
| **connected(x, y)** | O(α(n)) ≈ O(1) | Check if x and y are in same set |

**Optimizations:**
- **Path Compression**: Flattens tree structure during find
- **Union by Rank**: Attaches smaller tree under larger tree

### 3. Greedy Edge Selection

At each step, select the minimum weight edge that doesn't create a cycle:

```
Edges sorted by weight: (1), (2), (3), (4), (5)...
1. Pick edge (1), add to MST
2. Pick edge (2), add to MST
3. Pick edge (3), check: does it create cycle?
   - If yes: skip
   - If no: add to MST
4. Continue until |V| - 1 edges selected
```

### 4. Cycle Detection

Union-Find naturally detects cycles:

| Scenario | Action |
|----------|--------|
| find(u) == find(v) | Edge creates cycle, skip it |
| find(u) != find(v) | No cycle, add edge and union sets |

---

## Frameworks

Structured approaches for solving Kruskal's algorithm problems.

### Framework 1: Standard Kruskal's MST

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD KRUSKAL'S ALGORITHM FRAMEWORK                     │
├─────────────────────────────────────────────────────────────┤
│  1. Parse input: identify vertices and edges               │
│  2. Sort all edges by weight in ascending order            │
│  3. Initialize Union-Find with n vertices                   │
│  4. Initialize: mst_weight = 0, edges_used = 0              │
│  5. For each edge (weight, u, v) in sorted order:         │
│     a. If union(u, v) returns True (merged):               │
│        - Add weight to mst_weight                         │
│        - Increment edges_used                              │
│        - If edges_used == n - 1: break (MST complete)     │
│     b. If union returns False (already connected):        │
│        - Skip edge (would create cycle)                   │
│  6. If edges_used == n - 1: return mst_weight             │
│     Else: return -1 (graph is disconnected)               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard MST problems with edge list input.

### Framework 2: Kruskal's with Edge Tracking

```
┌─────────────────────────────────────────────────────────────┐
│  KRUSKAL'S WITH EDGE TRACKING FRAMEWORK                     │
├─────────────────────────────────────────────────────────────┤
│  1. Same setup as standard Kruskal's                       │
│  2. Maintain list: mst_edges = []                           │
│  3. When union(u, v) succeeds:                              │
│     - Append (u, v, weight) to mst_edges                   │
│  4. Return both total weight and edge list                  │
│  5. Useful for reconstructing the actual MST structure      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need to know which edges form the MST.

### Framework 3: Maximum Spanning Tree

```
┌─────────────────────────────────────────────────────────────┐
│  MAXIMUM SPANNING TREE FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  1. Sort edges in DESCENDING order (highest weight first) │
│  2. Apply standard Kruskal's algorithm                     │
│  3. Returns spanning tree with MAXIMUM total weight         │
│  4. Applications:                                           │
│     - Maximum capacity paths                                │
│     - Bottleneck optimization                              │
│     - Finding "strongest" network connections            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need the maximum weight spanning tree instead of minimum.

---

## Forms

Different manifestations of Kruskal's algorithm.

### Form 1: Standard MST

Basic minimum spanning tree construction.

| Aspect | Details |
|--------|---------|
| **Goal** | Minimize total edge weight |
| **Sorting** | Ascending by weight |
| **Output** | MST weight or edge list |
| **Complexity** | O(E log E) |

### Form 2: Maximum Spanning Tree

Finds the spanning tree with maximum total weight.

| Modification | Sort edges in descending order |
|--------------|--------------------------------|
| **Use Case** | Maximum capacity network design |
| **Example** | Finding most reliable communication paths |

### Form 3: Minimum Spanning Forest

For disconnected graphs, find MST for each component.

| Approach | Run Kruskal's without stopping at n-1 edges |
|----------|---------------------------------------------|
| **Output** | Multiple spanning trees (forest) |
| **Use Case** | Clustering, connected component analysis |

### Form 4: Constrained MST

When some edges must be included or excluded.

| Constraint | Approach |
|------------|----------|
| **Required edges** | Union their vertices first, then run Kruskal's |
| **Forbidden edges** | Filter out before sorting |
| **Specific vertices** | Must-include edges can be added first |

### Form 5: Second Best MST

Find the second minimum spanning tree (different from MST).

| Approach | Try removing each MST edge and finding replacement |
|----------|---------------------------------------------------|
| **Complexity** | O(E × α(V)) per candidate |
| **Use Case** | Redundant network design |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Union-Find Path Compression

Essential optimization for near-constant time operations:

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        """Find with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Compress path
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        # Attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True
```

**Why it matters**: Reduces amortized time from O(log n) to O(α(n)) ≈ O(1).

### Tactic 2: Edge Sorting Optimization

For integer weights, use counting sort for O(E) sorting:

```python
def kruskal_counting_sort(n, edges, max_weight):
    """Use counting sort when weights are small integers."""
    # Bucket edges by weight
    buckets = [[] for _ in range(max_weight + 1)]
    for w, u, v in edges:
        buckets[w].append((u, v))
    
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    # Process buckets in order
    for weight in range(max_weight + 1):
        for u, v in buckets[weight]:
            if uf.union(u, v):
                mst_weight += weight
                edges_used += 1
                if edges_used == n - 1:
                    return mst_weight
    
    return -1 if edges_used != n - 1 else mst_weight
```

**When to use**: When edge weights are small integers (e.g., 1 to 1000).

### Tactic 3: Handling Parallel Edges

When multiple edges exist between same vertices, keep only minimum:

```python
def preprocess_edges(edges):
    """Keep only minimum weight edge between each pair."""
    min_edge = {}
    for w, u, v in edges:
        key = (min(u, v), max(u, v))
        if key not in min_edge or w < min_edge[key][0]:
            min_edge[key] = (w, u, v)
    return list(min_edge.values())
```

**When to use**: Input contains multiple edges between same vertices.

### Tactic 4: Early Termination

Stop as soon as MST is complete:

```python
def kruskal_early_stop(n, edges):
    """Stop when n-1 edges are added."""
    edges.sort()  # Sort by weight
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            if edges_used == n - 1:  # Early termination
                return mst_weight
    
    return -1  # Graph disconnected
```

**Benefit**: Can stop after processing only a fraction of edges in dense graphs.

### Tactic 5: Component Size Tracking

Track component sizes for additional insights:

```python
class UnionFindWithSize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n  # Number of components
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        # Union by size
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.components -= 1
        return True
```

**Use case**: When you need to know component sizes or count of components.

---

## Python Templates

### Template 1: Union-Find Data Structure

```python
from typing import List


class UnionFind:
    """
    Union-Find (Disjoint Set Union) with path compression and union by rank.
    
    Time: O(α(n)) ≈ O(1) amortized per operation
    Space: O(n)
    """
    
    def __init__(self, n: int):
        """Initialize n separate sets."""
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        """
        Find root of the set containing x with path compression.
        """
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """
        Unite the sets containing x and y.
        Returns True if merged, False if already in same set.
        """
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return False
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True
    
    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)
```

### Template 2: Standard Kruskal's MST

```python
def kruskal_mst_weight(n: int, edges: List[tuple]) -> int:
    """
    Find the total weight of Minimum Spanning Tree.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of tuples (weight, u, v)
    
    Returns:
        Total weight of MST, or -1 if graph is disconnected
    
    Time: O(E log E)
    Space: O(V)
    """
    if n <= 0:
        return 0
    
    # Sort edges by weight
    edges.sort(key=lambda x: x[0])
    
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            
            if edges_used == n - 1:
                break
    
    return mst_weight if edges_used == n - 1 else -1
```

### Template 3: Kruskal's with Edge Tracking

```python
def kruskal_mst_edges(n: int, edges: List[tuple]) -> tuple:
    """
    Find MST edges using Kruskal's algorithm.
    
    Returns:
        Tuple of (total_weight, list_of_edges) or (-1, []) if disconnected
    """
    if n <= 0:
        return 0, []
    
    edges.sort(key=lambda x: x[0])
    
    uf = UnionFind(n)
    mst_edges = []
    total_weight = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            total_weight += weight
            
            if len(mst_edges) == n - 1:
                break
    
    return (total_weight, mst_edges) if len(mst_edges) == n - 1 else (-1, [])
```

### Template 4: Maximum Spanning Tree

```python
def maximum_spanning_tree(n: int, edges: List[tuple]) -> int:
    """
    Find Maximum Spanning Tree.
    Sorts in descending order instead of ascending.
    """
    if n <= 0:
        return 0
    
    # Sort in descending order
    edges.sort(key=lambda x: -x[0])
    
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            
            if edges_used == n - 1:
                break
    
    return mst_weight if edges_used == n - 1 else -1
```

### Template 5: Minimum Spanning Forest

```python
def kruskal_mst_forest(n: int, edges: List[tuple]) -> List[dict]:
    """
    Find minimum spanning forest for disconnected graph.
    Returns a list of MSTs, one for each connected component.
    """
    edges.sort(key=lambda x: x[0])
    uf = UnionFind(n)
    mst_edges = []
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
    
    # Group edges by component using find operation
    components = {}
    for u, v, w in mst_edges:
        root = uf.find(u)
        if root not in components:
            components[root] = {'edges': [], 'weight': 0}
        components[root]['edges'].append((u, v, w))
        components[root]['weight'] += w
    
    # Add isolated vertices as single-node components
    for i in range(n):
        root = uf.find(i)
        if root not in components:
            components[root] = {'edges': [], 'weight': 0}
    
    return list(components.values())
```

### Template 6: Kruskal with Required/Forbidden Edges

```python
def kruskal_with_constraints(n: int, edges: List[tuple], 
                              required_edges: List[tuple],
                              forbidden_edges: List[tuple]) -> int:
    """
    Kruskal with required and forbidden edges.
    
    Args:
        required_edges: List of (weight, u, v) edges that must be included
        forbidden_edges: List of (u, v) edges that cannot be used
    """
    # Create set of forbidden edges
    forbidden_set = set((min(u, v), max(u, v)) for u, v in forbidden_edges)
    
    # Filter out forbidden edges
    filtered_edges = [(w, u, v) for w, u, v in edges 
                      if (min(u, v), max(u, v)) not in forbidden_set]
    
    # Initialize Union-Find
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    # First, add required edges
    for weight, u, v in required_edges:
        if not uf.union(u, v):
            return -1  # Required edges form a cycle - invalid
        mst_weight += weight
        edges_used += 1
    
    # Then, add remaining edges using standard Kruskal
    filtered_edges.sort(key=lambda x: x[0])
    for weight, u, v in filtered_edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return mst_weight if edges_used == n - 1 else -1
```

### Template 7: Second Best MST

```python
def second_best_mst(n: int, edges: List[tuple]) -> int:
    """
    Find second minimum spanning tree.
    
    Approach:
    1. Find MST and store its edges
    2. For each MST edge, find the minimum edge that can replace it
    3. Return the minimum among all candidates
    """
    # Sort edges
    sorted_edges = sorted(edges, key=lambda x: x[0])
    
    # Find MST
    uf = UnionFind(n)
    mst_edges = []
    non_mst_edges = []
    mst_weight = 0
    
    for weight, u, v in sorted_edges:
        if uf.union(u, v):
            mst_edges.append((weight, u, v))
            mst_weight += weight
        else:
            non_mst_edges.append((weight, u, v))
    
    # If no MST exists or only one possible MST
    if len(mst_edges) != n - 1:
        return -1
    
    second_best = float('inf')
    
    # Try removing each MST edge and find replacement
    for skip_idx in range(len(mst_edges)):
        uf = UnionFind(n)
        temp_weight = 0
        edges_used = 0
        
        # Add all MST edges except skip_idx
        for i, (w, u, v) in enumerate(mst_edges):
            if i != skip_idx and uf.union(u, v):
                temp_weight += w
                edges_used += 1
        
        # Find the smallest non-MST edge that connects components
        for w, u, v in non_mst_edges:
            if uf.union(u, v):
                temp_weight += w
                edges_used += 1
                break
        
        if edges_used == n - 1 and temp_weight > mst_weight:
            second_best = min(second_best, temp_weight)
    
    return second_best if second_best != float('inf') else -1
```

---

## When to Use

Use Kruskal's Algorithm when you need to solve problems involving:

- **Minimum Spanning Tree (MST)**: Finding the minimum weight tree that connects all vertices
- **Network Design**: Designing cost-effective networks (roads, cables, flights)
- **Clustering**: Grouping related elements with minimum connection cost
- **Cycle Detection**: Efficiently detecting cycles while building trees
- **Greedy Optimization**: Problems where locally optimal choices lead to global optimum

### Comparison with Alternatives

| Algorithm | Time Complexity | Best For | Limitations |
|-----------|----------------|----------|-------------|
| **Kruskal's** | O(E log E) | Sparse graphs, few edges | Requires sorting, extra memory for DSU |
| **Prim's** | O(E + V log V) | Dense graphs | Needs adjacency list/matrix |
| **Borůvka's** | O(E log V) | Very large graphs, parallel | More complex implementation |

### When to Choose Kruskal's vs Prim's

- **Choose Kruskal's** when:
  - Graph is sparse (E ≈ V)
  - Edges are already given or easy to sort
  - You need to find MST weight only
  - Implementation simplicity matters

- **Choose Prim's** when:
  - Graph is dense (E ≈ V²)
  - Graph is given as adjacency matrix
  - You need to track the actual MST edges during construction

---

## Algorithm Explanation

### Core Concept

Kruskal's Algorithm is a greedy algorithm that builds the Minimum Spanning Tree by iteratively adding the cheapest edge that doesn't create a cycle. The key insight is that the **Cut Property** guarantees the greedy approach works: for any partition of vertices, the minimum weight edge crossing that cut belongs to some MST.

### How It Works

1. **Sort Edges**: Arrange all edges in non-decreasing order by weight
2. **Initialize DSU**: Create a Union-Find structure where each vertex is its own component
3. **Iterate Through Edges**: For each edge (u, v) in sorted order:
   - If u and v are in different components, unite them and add edge to MST
   - If they're already connected, skip this edge (it would create a cycle)
4. **Stop Condition**: Continue until MST has V-1 edges (or all edges processed)

### Union-Find (Disjoint Set Union) Operations

The Union-Find data structure provides two critical operations:

- **`find(x)`**: Returns the root/representative of the set containing x
  - Uses **path compression** for nearly O(1) amortized time
  
- **`union(x, y)`**: Merges the sets containing x and y
  - Uses **union by rank** to keep trees balanced
  - Returns true if merge happened, false if already in same set

### Why Greedy Works (Cut Property Proof)

The correctness of Kruskal's algorithm relies on the **Cut Property**:

> For any cut (partition) of the graph's vertices, the minimum weight edge crossing that cut belongs to at least one Minimum Spanning Tree.

**Proof sketch**: Suppose we have an MST T. Consider any cut. If the minimum edge crossing the cut is not in T, add it to T - this creates a cycle. Remove the heaviest edge in that cycle crossing the same cut - the result is still a spanning tree with no greater weight. Thus, the minimum edge can be in an MST.

### Visual Representation

For a graph with vertices {0, 1, 2, 3} and edges:
```
Edges sorted by weight:
(1, 0-1), (2, 1-2), (3, 0-2), (4, 2-3)

Step 1: Start with 4 isolated vertices
        0    1    2    3

Step 2: Add edge (0-1) weight 1
        0--1   2    3

Step 3: Add edge (1-2) weight 2
        0--1--2   3

Step 4: Skip edge (0-2) weight 3 (would create cycle!)

Step 5: Add edge (2-3) weight 4
        0--1--2--3
        
MST Weight: 1 + 2 + 4 = 7
```

### Limitations

- **Only works for undirected graphs**: Directed MST requires different algorithms
- **Requires connected graph**: Returns error or special value for disconnected graphs
- **Edge sorting overhead**: O(E log E) dominates for very dense graphs
- **Memory for Union-Find**: Requires O(V) additional space

---

## Practice Problems

### Problem 1: Minimum Cost to Connect All Points

**Problem:** [LeetCode 1584 - Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**Description:** You are given an array of points. Find the minimum cost to make all points connected where the cost between two points is the Manhattan distance.

**How to Apply Kruskal's:**
- Generate all O(V²) edges with Manhattan distance as weight
- Use Kruskal's algorithm to find MST weight
- Efficient for sparse graphs; for dense, consider Prim's instead

---

### Problem 2: Number of Operations to Make Network Connected

**Problem:** [LeetCode 1319 - Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)

**Description:** There are `n` computers numbered from `0` to `n-1`. Given the connections, return the minimum number of operations needed to make the network connected.

**How to Apply Kruskal's/Union-Find:**
- Use Union-Find to count connected components
- If components > 1, need at least components-1 moves
- Verify if enough edges exist (edges must be >= n-1)

---

### Problem 3: Critical and Pseudo-Critical Edges in MST

**Problem:** [LeetCode 1489 - Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/)

**Description:** Given a weighted undirected graph, find edges that are critical (must be in MST) and pseudo-critical (can be in MST but not required).

**How to Apply Kruskal's:**
- First compute MST weight
- For each edge, test by:
  - Including it first (must-be-in test)
  - Excluding it (cannot-be-in test)
- Compare results to identify edge types

---

### Problem 4: Graph Connectivity with Threshold

**Problem:** [LeetCode 1627 - Graph Connectivity With Threshold](https://leetcode.com/problems/graph-connectivity-with-threshold/)

**Description:** Given `n` nodes, a threshold `t`, and a list of queries, determine if two nodes are connected when only edges between nodes with a common divisor greater than the threshold are considered.

**How to Apply Kruskal's/Union-Find:**
- Use Union-Find to build connectivity
- For each possible divisor d > threshold, connect all multiples of d
- This efficiently groups nodes that share common factors
- Answer queries by checking if nodes are in the same component

---

### Problem 5: Connecting Cities With Minimum Cost

**Problem:** [LeetCode 1135 - Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)

**Description:** Connect N cities with minimum cost using Kruskal's or Prim's.

**How to Apply Kruskal's:**
- Direct application of MST
- Build edges from input connections
- Return -1 if not all cities can be connected

---

## Video Tutorial Links

### Fundamentals

- [Kruskal's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=DMxHDXxXJcw) - Comprehensive introduction
- [Kruskal's Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=71UQJmN2k5I) - Detailed explanation with visualizations
- [Union-Find Data Structure (NeetCode)](https://www.youtube.com/watch?v=0jNmHPfAypU) - DSU implementation

### Advanced Topics

- [Kruskal vs Prim's Algorithm](https://www.youtube.com/watch?v=ZseH0Ng98cM) - Comparison and when to use which
- [Minimum Spanning Tree - All Variations](https://www.youtube.com/watch?v=EjVH8jS6TjE) - Comprehensive MST coverage
- [Second Best MST](https://www.youtube.com/watch?v=0695tG1h9dU) - Advanced variation

---

## Follow-up Questions

### Q1: What is the difference between Kruskal's and Prim's algorithms?

**Answer:** Both find MST but with different approaches:
- **Kruskal's**: Edge-centric, greedy on edges sorted by weight, uses Union-Find
- **Prim's**: Vertex-centric, grows tree from a starting vertex, uses priority queue
- **Choice**: Kruskal better for sparse graphs, Prim better for dense graphs

### Q2: Why does Kruskal's algorithm work?

**Answer:** It relies on the **Cut Property**: for any partition of vertices into two sets, the minimum weight edge crossing that cut belongs to some MST. By always picking the minimum weight edge that doesn't create a cycle, we're essentially making locally optimal choices that lead to a globally optimal solution.

### Q3: Can Kruskal's algorithm handle directed graphs?

**Answer:** No, Kruskal's is specifically for **undirected** graphs. For directed graphs:
- **Minimum arborescence/spanning arborescence**: Use Chu-Liu/Edmonds algorithm
- **Directed MST**: Different problem entirely

### Q4: What is the time complexity of Union-Find with path compression?

**Answer:** With both path compression and union by rank:
- **Amortized time**: O(α(n)) where α is the inverse Ackermann function
- **Practical time**: α(n) < 5 for all realistic n, so effectively O(1)

### Q5: How do you handle disconnected graphs with Kruskal's?

**Answer:**
1. **Detect disconnection**: After processing all edges, check if MST has V-1 edges
2. **Return error**: Return -1, null, or throw exception
3. **MST Forest**: For each component, compute separate MST (variation)

---

## Summary

Kruskal's Algorithm is a classic greedy algorithm for finding the Minimum Spanning Tree in a weighted undirected graph. Key takeaways:

- **Greedy approach**: Always pick the cheapest edge that doesn't create a cycle
- **Union-Find**: Efficiently detects cycles and manages components
- **Time complexity**: O(E log E) dominated by edge sorting
- **Space complexity**: O(V + E) for edge storage and DSU

When to use:
- Finding MST for sparse graphs
- When edges are given directly (not as adjacency matrix)
- Network design and clustering problems
- Not for dense graphs (use Prim's instead)
- Not for directed graphs (use Chu-Liu/Edmonds)

This algorithm is fundamental in graph theory and competitive programming, essential for solving problems involving network optimization, clustering, and cycle detection.
