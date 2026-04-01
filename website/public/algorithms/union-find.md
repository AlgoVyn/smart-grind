# Union-Find (Disjoint Set Union)

## Category
Graphs

## Description

Union-Find (also known as **Disjoint Set Union** or **DSU**) is a fundamental data structure that efficiently tracks a partition of elements into disjoint sets. It supports two primary operations—**find** (determine which set an element belongs to) and **union** (merge two sets)—in near-constant amortized time when properly optimized.

This data structure is essential for solving problems involving connectivity, grouping, and dynamic set membership. It forms the backbone of many graph algorithms and is a critical tool in competitive programming and technical interviews.

---

## Concepts

The Union-Find data structure is built on several fundamental concepts that make it powerful for solving connectivity problems.

### 1. Parent Pointer Array

Each element points to its parent in the tree:

| Index | 0 | 1 | 2 | 3 | 4 |
|-------|---|---|---|---|---|
| **Parent** | 0 | 0 | 2 | 2 | 4 |
| **Meaning** | Self (root) | Child of 0 | Self (root) | Child of 2 | Self (root) |

Sets: {0, 1}, {2, 3}, {4}

### 2. Union by Rank/Size

When merging sets, attach smaller tree under larger tree:

```
Union by Rank (tree height):
- Always attach shorter tree under taller tree
- Only increase rank when merging trees of equal rank

Union by Size (component count):
- Always attach smaller component to larger
- Update size of new root
```

### 3. Path Compression

Flatten the tree during find operations:

```
Before:  4 -> 3 -> 2 -> 1 -> 0 (root)
After find(4):  4 -> 0, 3 -> 0, 2 -> 0, 1 -> 0

All nodes now point directly to root!
```

### 4. Inverse Ackermann Function

The amortized complexity O(α(n)) where α is the inverse Ackermann function:

| n | α(n) |
|---|------|
| n ≤ 2 | 1 |
| n ≤ 4 | 2 |
| n ≤ 16 | 3 |
| n ≤ 65536 | 4 |
| n ≤ 2^65536 | 5 |

For all practical purposes, α(n) ≤ 5, making operations effectively constant time.

---

## Frameworks

Structured approaches for solving Union-Find problems.

### Framework 1: Standard Union-Find with Optimizations

```
┌─────────────────────────────────────────────────────┐
│  STANDARD UNION-FIND FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  INITIALIZATION:                                     │
│    1. parent[i] = i for all i (each is its own set)│
│    2. rank[i] = 0 for all i                         │
│    3. size[i] = 1 for all i (optional)             │
│                                                      │
│  FIND(x): // with path compression                  │
│    1. If parent[x] != x:                             │
│       parent[x] = find(parent[x])                  │
│    2. Return parent[x]                               │
│                                                      │
│  UNION(x, y): // with union by rank                 │
│    1. rootX = find(x), rootY = find(y)             │
│    2. If rootX == rootY: return (already connected) │
│    3. If rank[rootX] < rank[rootY]:                │
│       parent[rootX] = rootY                          │
│    4. Else if rank[rootX] > rank[rootY]:            │
│       parent[rootY] = rootX                          │
│    5. Else:                                          │
│       parent[rootY] = rootX                          │
│       rank[rootX] += 1                               │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard connectivity problems with dynamic unions and finds.

### Framework 2: Cycle Detection in Undirected Graphs

```
┌─────────────────────────────────────────────────────┐
│  CYCLE DETECTION FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Initialize Union-Find with n elements            │
│  2. For each edge (u, v) in graph:                 │
│     a. If find(u) == find(v):                      │
│        → Edge creates a cycle!                     │
│        → Return True or count cycle                │
│     b. Else:                                         │
│        → union(u, v)                               │
│  3. If no cycles found, return False                 │
│                                                      │
│  Time: O(E × α(V))                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Detecting cycles in undirected graphs, Kruskal's MST validation.

### Framework 3: Counting Connected Components

```
┌─────────────────────────────────────────────────────┐
│  CONNECTED COMPONENTS FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Initialize Union-Find with n elements            │
│  2. For each edge (u, v):                            │
│     → union(u, v)                                    │
│  3. Count unique roots:                              │
│     → Count distinct find(i) for all i               │
│  4. Return count                                     │
│                                                      │
│  Alternative: Track count during union operations    │
│  - Decrement count each time union merges sets       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding number of provinces, islands, or connected components.

---

## Forms

Different manifestations of the Union-Find pattern.

### Form 1: Basic Union-Find (Path Compression Only)

Simplest form with just path compression optimization.

| Feature | Implementation | Complexity |
|---------|---------------|------------|
| **Find** | Recursive with path compression | O(log n) amortized |
| **Union** | Attach root to root | O(log n) amortized |
| **Space** | Parent array only | O(n) |

### Form 2: Union-Find with Rank

Uses tree height for union decisions.

| Feature | Implementation | Complexity |
|---------|---------------|------------|
| **Rank** | Upper bound on tree height | O(α(n)) amortized |
| **Union** | Attach shorter to taller | Keeps trees balanced |
| **Space** | Parent + rank arrays | O(n) |

### Form 3: Union-Find with Size

Uses component size for union decisions.

| Feature | Implementation | Complexity |
|---------|---------------|------------|
| **Size** | Number of elements in component | O(α(n)) amortized |
| **Union** | Attach smaller to larger | Minimizes tree depth |
| **Query** | Can get component size instantly | O(α(n)) |

### Form 4: Union-Find with Additional Data

Track extra information per component.

```python
class UnionFindAdvanced:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.min_val = list(range(n))  # Minimum value in component
        self.max_val = list(range(n))  # Maximum value in component
        self.count = [1] * n           # Component size
```

### Form 5: Weighted Union-Find (with Parity/Info)

Track relationship to parent (for bipartite checks, etc.):

```
weight[x]: information about relationship from x to parent[x]
Example: weight[x] = 0 if same group, 1 if different group
Use: Bipartite checking, equation satisfiability
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Iterative Path Compression

Iterative version to avoid recursion limits:

```python
def find_iterative(self, x: int) -> int:
    """Find root with iterative path compression."""
    root = x
    # Find the root
    while self.parent[root] != root:
        root = self.parent[root]
    
    # Compress path: point all nodes directly to root
    while self.parent[x] != root:
        next_x = self.parent[x]
        self.parent[x] = root
        x = next_x
    
    return root
```

### Tactic 2: Union by Size with Size Tracking

Track component sizes for efficient queries:

```python
class UnionFindWithSize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n  # Number of components
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        # Union by size: smaller into larger
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1
        return True
    
    def get_component_size(self, x):
        return self.size[self.find(x)]
```

### Tactic 3: Path Halving (Alternative Compression)

Make every other node point to its grandparent:

```python
def find_halving(self, x: int) -> int:
    """Path halving - point every other node to grandparent."""
    while self.parent[x] != x:
        self.parent[x] = self.parent[self.parent[x]]
        x = self.parent[x]
    return x
```

### Tactic 4: Get All Groups/Components

Enumerate all connected components:

```python
def get_all_groups(self) -> dict:
    """Get all groups as a dictionary mapping root to members."""
    groups = {}
    for i in range(len(self.parent)):
        root = self.find(i)
        if root not in groups:
            groups[root] = []
        groups[root].append(i)
    return groups

def get_group_count(self) -> int:
    """Get number of distinct groups."""
    return len(set(self.find(i) for i in range(len(self.parent))))
```

### Tactic 5: Weighted Union-Find for Bipartite Check

Check if graph is bipartite using Union-Find with parity:

```python
class UnionFindBipartite:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.parity = [0] * n  # 0 = same color, 1 = different
    
    def find(self, x):
        if self.parent[x] != x:
            root = self.find(self.parent[x])
            self.parity[x] ^= self.parity[self.parent[x]]
            self.parent[x] = root
        return self.parent[x]
    
    def union(self, x, y):
        """Union x and y with constraint that they have different colors."""
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            # Check if x and y already have different colors
            return self.parity[x] != self.parity[y]
        
        # Attach root_y under root_x
        # Ensure x and y have different colors
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
            x, y = y, x
        
        self.parent[root_y] = root_x
        self.parity[root_y] = self.parity[x] ^ self.parity[y] ^ 1
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True
```

---

## Python Templates

### Template 1: Standard Union-Find with Rank and Path Compression

```python
class UnionFind:
    """
    Union-Find (Disjoint Set Union) with path compression 
    and union by rank.
    
    Time Complexities:
        - find: O(α(n)) amortized
        - union: O(α(n)) amortized
        - connected: O(α(n)) amortized
    
    Space Complexity: O(n)
    """
    
    def __init__(self, n: int):
        """
        Initialize n isolated sets.
        
        Args:
            n: Number of elements (0 to n-1)
        """
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        """
        Find the root/representative of the set containing x.
        Uses path compression for optimization.
        
        Time: O(α(n)) amortized
        """
        if self.parent[x] != x:
            # Path compression: make x point directly to root
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """
        Merge the sets containing x and y.
        Returns True if merged, False if already in same set.
        
        Time: O(α(n)) amortized
        """
        root_x = self.find(x)
        root_y = self.find(y)
        
        # Already in the same set
        if root_x == root_y:
            return False
        
        # Union by rank: attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            # Same rank, choose one as root and increment rank
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True
    
    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)
```

### Template 2: Union-Find with Component Size Tracking

```python
class UnionFindWithSize:
    """
    Union-Find with size tracking for each component.
    """
    
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n  # Number of components
    
    def find(self, x: int) -> int:
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """Union by size. Returns True if merged."""
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        # Union by size: smaller into larger
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1
        return True
    
    def get_component_size(self, x: int) -> int:
        """Get size of component containing x."""
        return self.size[self.find(x)]
    
    def get_num_components(self) -> int:
        """Get number of connected components."""
        return self.count
```

### Template 3: Cycle Detection in Undirected Graph

```python
def count_cycles(n: int, edges: list[list[int]]) -> int:
    """
    Detect number of cycles in an undirected graph.
    
    Args:
        n: Number of nodes (0 to n-1)
        edges: List of edges as [u, v] pairs
    
    Returns:
        Number of cycles detected
    
    Time: O(E × α(V))
    Space: O(V)
    """
    uf = UnionFind(n)
    cycles = 0
    
    for u, v in edges:
        if uf.connected(u, v):
            # Edge creates a cycle
            cycles += 1
        else:
            uf.union(u, v)
    
    return cycles


def has_cycle(n: int, edges: list[list[int]]) -> bool:
    """Check if undirected graph has any cycle."""
    uf = UnionFind(n)
    
    for u, v in edges:
        if uf.connected(u, v):
            return True
        uf.union(u, v)
    
    return False
```

### Template 4: Number of Provinces (Connected Components)

```python
def num_provinces(is_connected: list[list[int]]) -> int:
    """
    LeetCode 547: Number of Provinces
    
    Args:
        is_connected: N x N matrix where is_connected[i][j] = 1 if connected
    
    Returns:
        Number of provinces (connected components)
    """
    n = len(is_connected)
    if n == 0:
        return 0
    
    uf = UnionFindWithSize(n)
    
    # Union all connected cities
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    return uf.get_num_components()
```

### Template 5: Valid Graph Tree Check

```python
def valid_tree(n: int, edges: list[list[int]]) -> bool:
    """
    Check if edges form a valid tree.
    Valid tree has exactly n-1 edges and no cycles.
    
    Time: O(E × α(V))
    Space: O(V)
    """
    if len(edges) != n - 1:
        return False
    
    uf = UnionFind(n)
    
    for u, v in edges:
        if uf.connected(u, v):
            return False  # Cycle detected
        uf.union(u, v)
    
    return True
```

### Template 6: Iterative Union-Find (Avoid Recursion)

```python
class UnionFindIterative:
    """Union-Find with iterative find for large inputs."""
    
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        """Iterative find with path compression."""
        # Find root
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        
        # Compress path
        while self.parent[x] != root:
            next_x = self.parent[x]
            self.parent[x] = root
            x = next_x
        
        return root
    
    def union(self, x: int, y: int) -> bool:
        """Union by rank."""
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True
```

---

## When to Use

Use the Union-Find algorithm when you need to solve problems involving:

- **Dynamic Connectivity**: Tracking which elements are connected as edges are added
- **Cycle Detection**: Detecting cycles in undirected graphs efficiently
- **Grouping/Clustering**: Merging elements into connected components
- **Set Partitioning**: Maintaining disjoint sets with efficient merges and queries

### Comparison with Alternatives

| Data Structure | Find | Union | Cycle Detection | Dynamic Graph |
|----------------|------|-------|-----------------|---------------|
| **Union-Find** | O(α(n)) | O(α(n)) | O(V + E) | ✅ Yes |
| **DFS/BFS** | O(V + E) | N/A | O(V + E) | ❌ No |
| **Adjacency Matrix** | O(V) | N/A | O(V²) | ❌ No |

### When to Choose Union-Find vs DFS/BFS

- **Choose Union-Find** when:
  - You need to process edges incrementally
  - You frequently need to check connectivity between arbitrary pairs
  - You're building the graph dynamically
  - You need near-constant time connectivity queries

- **Choose DFS/BFS** when:
  - You need to traverse the entire graph
  - You need path information (not just connectivity)
  - The graph is static (built all at once)
  - You need to find all connected components at once

---

## Algorithm Explanation

### Core Concept

The key insight behind Union-Find is maintaining a **forest** (collection of trees) where each tree represents a set. Each element points to its parent, and the root of each tree serves as the representative of that set. By applying two critical optimizations—**path compression** and **union by rank**—we achieve amortized O(α(n)) time per operation, where α(n) is the inverse Ackermann function (practically constant for all realistic inputs).

### How It Works

#### Data Structure:
- **`parent[i]`**: The parent of element `i`. The root has `parent[i] = i`
- **`rank[i]`**: An upper bound on the height of the tree rooted at `i` (used for union by rank)

#### Find Operation with Path Compression:
1. Start at element `x`
2. If `x` is not its own parent, recursively find the root
3. Set `x`'s parent directly to the root (path compression)
4. Return the root

#### Union Operation with Rank:
1. Find the roots of both elements
2. If roots are the same, elements are already in the same set
3. Attach the smaller tree under the larger tree (rank-based union)
4. If ranks are equal, choose one as parent and increment its rank

### Visual Representation

```
Initial State (5 isolated elements):     After union(0,1), union(2,3), union(0,2):

        0                                       0
        |                                       | \
        1                                       1   2
                                                |   |
        2        →    union operations    →      3   4
        |
        3      
        
        4
                                                (0 is root of {0,1,2,3})
                                                (4 is separate)

With Path Compression (find(3)):
        0          ← All nodes point directly to root
       /|\
      1 2 3
```

### Why These Optimizations Matter

| Optimization | Without | With |
|--------------|---------|------|
| **No optimization** | O(n) per operation | - |
| **Path compression only** | O(log n) amortized | - |
| **Union by rank only** | O(log n) amortized | - |
| **Both optimizations** | O(α(n)) amortized | **Inverse Ackermann ≈ constant** |

The inverse Ackermann function α(n) grows so slowly that for n ≤ 10^200, α(n) ≤ 5. In practice, operations are effectively constant time.

### Limitations

- **No path retrieval**: Only tells you if elements are connected, not the path
- **No edge weights**: Cannot handle weighted unions directly
- **No directed cycle detection**: Only works for undirected cycles
- **Static element count**: Adding vertices after initialization requires rebuilding

---

## Practice Problems

### Problem 1: Number of Provinces

**Problem:** [LeetCode 547 - Number of Provinces](https://leetcode.com/problems/number-of-provinces/)

**Description:** You are given an `n × n` matrix `isConnected` where `isConnected[i][j] = 1` if the `i-th` city and the `j-th` city are directly connected, and `0` otherwise. Find the number of provinces (connected components).

**How to Apply Union-Find:**
- Initialize Union-Find with n elements (cities)
- For each pair (i, j) where `isConnected[i][j] = 1`, union the cities
- The answer is the number of distinct groups

---

### Problem 2: Graph Valid Tree

**Problem:** [LeetCode 261 - Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)

**Description:** Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if these edges form a valid tree.

**How to Apply Union-Find:**
- A valid tree has exactly n-1 edges and no cycles
- Process each edge: if it creates a cycle, return false
- After processing all edges, check that exactly one group remains

---

### Problem 3: Number of Connected Components in an Undirected Graph

**Problem:** [LeetCode 323 - Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

**Description:** Given n nodes and a list of undirected edges, find the number of connected components.

**How to Apply Union-Find:**
- Initialize Union-Find with n nodes
- Process all edges and union connected nodes
- The answer is the number of distinct roots

---

### Problem 4: Most Stones Removed with Same Row or Column

**Problem:** [LeetCode 947 - Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/)

**Description:** On a 2D plane, we place n stones. A stone can be removed if it shares either the same row or the same column with another stone. Return the maximum number of stones that can be removed.

**How to Apply Union-Find:**
- Union all stones that share a row or column
- The answer is: total stones - number of connected components

---

### Problem 5: Satisfiability of Equality Equations

**Problem:** [LeetCode 990 - Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)

**Description:** Given an array of strings equations where equations[i] is "a == b" or "a != b", determine if it's possible to assign values to variables such that all equations are satisfied.

**How to Apply Union-Find:**
- First, process all "==" equations and union the variables
- Then, process all "!=" equations and check if any pair is in the same set (contradiction)

---

### Problem 6: Redundant Connection

**Problem:** [LeetCode 684 - Redundant Connection](https://leetcode.com/problems/redundant-connection/)

**Description:** In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with N nodes and one additional edge added. Find and remove the redundant edge.

**How to Apply Union-Find:**
- Process edges one by one
- The edge that connects two already-connected nodes is the redundant one

---

## Video Tutorial Links

### Fundamentals

- [Union-Find Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=0jNmHPfAypE) - Complete introduction to Union-Find
- [Disjoint Set Union (Take U Forward)](https://www.youtube.com/watch?v=aBxjDBC4Mvo) - Detailed explanation with implementations
- [Union-Find Pattern (NeetCode)](https://www.youtube.com/watch?v=ymJpUSiZkS4) - Problem-solving pattern

### Advanced Topics

- [Kruskal's Algorithm with Union-Find](https://www.youtube.com/watch?v=4p5JfQdX3Ww) - MST using DSU
- [Path Compression Optimization](https://www.youtube.com/watch?v=W7UtMTV8Tq0) - Deep dive into optimizations
- [Union-Find vs DFS](https://www.youtube.com/watch?v=CB5CpXDQ7hU) - When to use which approach

---

## Follow-up Questions

### Q1: What is the difference between union by rank and union by size?

**Answer:** Both achieve similar performance goals, but:
- **Union by rank**: Uses tree height as the decision factor
- **Union by size**: Uses component size as the decision factor

In practice, they perform almost identically. Some implementations prefer size because it naturally supports the `componentSize()` operation without additional tracking.

---

### Q2: Can Union-Find handle dynamic element addition?

**Answer:** Yes, but with caveats:
- You can create a new Union-Find with increased capacity
- Or use a hashmap-based implementation for sparse element IDs
- The key challenge is maintaining the inverse Ackermann bound with dynamic resizing

---

### Q3: Why is path compression alone not enough?

**Answer:** Path compression only optimizes the find operation. Without union by rank, trees can still become unbalanced (linear chains) during union operations. Both optimizations are needed to achieve O(α(n)) performance.

---

### Q4: How does Union-Find compare to DFS for finding connected components?

**Answer:**
- **Union-Find**: O(V + E × α(V)) - better for incremental edge processing
- **DFS**: O(V + E) - better when all edges are known upfront

Union-Find is preferred when:
- Edges are added dynamically
- You need to frequently check connectivity between arbitrary pairs

DFS is preferred when:
- The entire graph is available at once
- You need to traverse the entire graph anyway

---

### Q5: What are the limitations of Union-Find?

**Answer:**
- **No path retrieval**: Only tells you if elements are connected, not the path
- **No edge weights**: Cannot handle weighted unions directly
- **No direct cycle detection for directed graphs**: Only works for undirected cycles
- **Static structure**: Adding vertices after initialization requires rebuilding

---

## Summary

Union-Find (Disjoint Set Union) is an elegant and efficient data structure for managing dynamic connectivity. Key takeaways:

- **Near-constant time operations**: With path compression and union by rank, find and union operations run in O(α(n)) amortized time
- **Simple implementation**: Core logic is just a few lines of code
- **Versatile applications**: Essential for cycle detection, connected components, Kruskal's MST, and many graph problems
- **Space efficient**: Only O(n) space required

When to use:
- ✅ Dynamic connectivity problems
- ✅ Incremental edge processing
- ✅ Frequent connectivity queries
- ✅ Cycle detection in undirected graphs
- ❌ When you need path information (use BFS/DFS)
- ❌ When you need directed cycle detection (use DFS)
- ❌ When you need edge weights (use Prim's or Kruskal's with alternatives)

This data structure is a cornerstone of competitive programming and is frequently asked in technical interviews. Mastering Union-Find will significantly improve your ability to solve graph connectivity problems efficiently.
