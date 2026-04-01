# Binary Lifting

## Category
Advanced

## Description

Binary Lifting is a powerful optimization technique used to preprocess a tree (or forest) to answer **Lowest Common Ancestor (LCA)** queries in **O(log n)** time after **O(n log n)** preprocessing. It's particularly essential for solving problems on large trees where repeated ancestor lookups, path queries, or distance calculations are needed. The technique leverages the binary representation of numbers to "jump" up the tree in powers of two, making ancestor queries extremely efficient.

This pattern is fundamental in competitive programming and technical interviews for solving a wide range of tree-related problems. The core insight is that any integer can be represented as a sum of powers of 2, so instead of moving up one parent at a time (O(k)), we can "jump" up by larger powers using a precomputed table, transforming O(k) complexity to O(log k).

---

## Concepts

The Binary Lifting technique is built on several fundamental concepts that make it powerful for solving tree problems.

### 1. Binary Representation of Jumps

Any integer `k` can be represented as a sum of powers of 2. For example:
- 13 in binary = 1101 (8 + 4 + 1)
- To move up 13 steps: jump 8 → 4 → 1 = 3 jumps instead of 13

| Jump Size | Binary Bit | 2^i Value |
|-----------|------------|-----------|
| 1 | 2^0 | 1 |
| 2 | 2^1 | 2 |
| 4 | 2^2 | 4 |
| 8 | 2^3 | 8 |
| 16 | 2^4 | 16 |

### 2. Jump Table (up table)

The core data structure stores ancestors at power-of-2 distances:

| Node | up[node][0] (2^0) | up[node][1] (2^1) | up[node][2] (2^2) |
|------|-------------------|-------------------|-------------------|
| 6 | 4 (parent) | 1 (grandparent) | 0 (great-grandparent) |
| 5 | 2 (parent) | 0 (grandparent) | -1 |
| 3 | 1 (parent) | 0 (grandparent) | -1 |

### 3. Depth Alignment

Before finding LCA, nodes must be at the same depth:

- Calculate depth difference: `diff = depth[u] - depth[v]`
- Lift deeper node up by `diff` using binary decomposition
- After alignment, both nodes are at the same level

### 4. Simultaneous Lifting

Once at the same depth, lift both nodes together:

- From highest power to lowest (LOG down to 0)
- If `up[u][i] != up[v][i]`, lift both by 2^i
- Continue until direct children of LCA
- Return parent of either node

---

## Frameworks

Structured approaches for solving binary lifting problems.

### Framework 1: Standard Binary Lifting Template

```
┌─────────────────────────────────────────────────────┐
│  BINARY LIFTING FRAMEWORK                             │
├─────────────────────────────────────────────────────┤
│  1. DFS/BFS from root to compute:                   │
│     - depth[v] for each node                        │
│     - up[v][0] = immediate parent                   │
│  2. Build jump table:                               │
│     for i from 1 to LOG-1:                          │
│       up[v][i] = up[ up[v][i-1] ][i-1]              │
│  3. For LCA query:                                  │
│     a. Ensure u is deeper, lift to depth of v       │
│     b. If u == v, return v (ancestor found)         │
│     c. Lift both from high to low while ancestors differ│
│     d. Return parent of u (or v)                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard LCA queries on static trees.

### Framework 2: K-th Ancestor Query Template

```
┌─────────────────────────────────────────────────────┐
│  K-TH ANCESTOR QUERY FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  1. Binary decompose k:                             │
│     for each bit i in k:                            │
│       if bit i is set:                              │
│         node = up[i][node]                          │
│  2. Return node (or -1 if beyond root)            │
│                                                     │
│  Time: O(log k) where k <= n                       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding k-th ancestor without path reconstruction.

### Framework 3: Path Operations Template

```
┌─────────────────────────────────────────────────────┐
│  PATH OPERATIONS FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Find LCA of u and v                             │
│  2. Path from u to v = u→...→lca + reversed(v→...→lca)│
│  3. Distance = depth[u] + depth[v] - 2*depth[lca]   │
│                                                     │
│  Extensions:                                        │
│  - Path sum: Accumulate values along path           │
│  - Path max/min: Use segment tree or sparse table   │
│  - Path update: Requires heavy-light decomposition  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Path queries and distance calculations.

---

## Forms

Different manifestations of the binary lifting pattern.

### Form 1: Standard LCA Binary Lifting

Most common form for ancestor queries on trees.

| Feature | Implementation |
|---------|----------------|
| Build Time | O(n log n) |
| Query Time | O(log n) |
| Space | O(n log n) |
| Updates | Not supported |

### Form 2: Binary Lifting with Path Queries

Extended version for path-related operations.

| Operation | Approach | Time |
|-----------|----------|------|
| Path sum | Precompute prefix sums from root | O(log n) per query |
| Path max | Sparse table on tree + LCA | O(log n) or O(1) |
| Node value query | Store values, query during lift | O(log n) |

### Form 3: Forest Binary Lifting

For multiple disconnected trees:

```
Approach:
1. Assign a root to each tree in the forest
2. Run preprocessing from each root
3. For queries, ensure nodes are in same tree
4. Option: Add super-root connecting all trees
```

**Use case**: Dynamic connectivity, multiple tree queries.

### Form 4: Functional Graph Binary Lifting

For graphs where each node has exactly one outgoing edge:

```
Key insight: Functional graphs are collections of trees 
pointing towards cycles

Applications:
- Finding cycle entry points
- K-th successor in functional graph
- Detecting cycles with binary lifting
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Computing LOG Value

```python
def compute_log(n: int) -> int:
    """Compute LOG = floor(log2(n)) + 1"""
    LOG = 0
    while (1 << LOG) <= n:
        LOG += 1
    return LOG

# Alternative using bit_length
LOG = (n).bit_length()  # Python-specific
```

### Tactic 2: Lift Operation

```python
def lift_node(self, node: int, k: int) -> int:
    """Lift node by k steps up the tree."""
    for i in range(self.LOG):
        if k & (1 << i):  # If bit i is set
            node = self.up[i][node]
            if node == -1:
                return -1
    return node
```

### Tactic 3: Distance Calculation

```python
def get_distance(self, u: int, v: int) -> int:
    """Calculate number of edges between u and v."""
    lca = self.lca(u, v)
    return self.depth[u] + self.depth[v] - 2 * self.depth[lca]
```

### Tactic 4: Ancestor Check

```python
def is_ancestor(self, u: int, v: int) -> bool:
    """Check if u is an ancestor of v."""
    lca = self.lca(u, v)
    return lca == u
```

### Tactic 5: Finding Path Nodes

```python
def get_path_nodes(self, u: int, v: int) -> list[int]:
    """Get all nodes on path from u to v (inclusive)."""
    lca = self.lca(u, v)
    
    # Path from u to LCA
    path_u = []
    node = u
    while node != lca:
        path_u.append(node)
        node = self.up[0][node]
    path_u.append(lca)
    
    # Path from v to LCA (reversed)
    path_v = []
    node = v
    while node != lca:
        path_v.append(node)
        node = self.up[0][node]
    
    return path_u + path_v[::-1]
```

### Tactic 6: Combining with Sparse Table

For O(1) path maximum/minimum queries:

```python
# Build sparse table on Euler tour
euler = []  # Euler tour of tree
first = {}  # First occurrence of each node

# Then use RMQ on euler array with first[u], first[v]
# to answer queries in O(1)
```

---

## Python Templates

### Template 1: Complete Binary Lifting Class

```python
from collections import defaultdict, deque
from typing import List

class BinaryLifting:
    """
    Binary Lifting for LCA queries on a tree.
    
    Time: O(n log n) preprocessing, O(log n) per query
    Space: O(n log n)
    """
    
    def __init__(self, n: int, edges: List[List[int]], root: int = 0):
        self.n = n
        self.root = root
        self.LOG = (n).bit_length()
        
        # Build adjacency list
        self.graph = defaultdict(list)
        for u, v in edges:
            self.graph[u].append(v)
            self.graph[v].append(u)
        
        # up[i][v] = 2^i-th ancestor of v
        self.up = [[-1] * n for _ in range(self.LOG)]
        self.depth = [0] * n
        
        # Preprocess
        self._bfs(root, -1)
        self._build_table()
    
    def _bfs(self, start: int, parent: int):
        """BFS to compute depth and immediate parent."""
        queue = deque([(start, parent)])
        self.depth[start] = 0
        self.up[0][start] = parent
        
        while queue:
            node, par = queue.popleft()
            for neighbor in self.graph[node]:
                if neighbor != par:
                    self.depth[neighbor] = self.depth[node] + 1
                    self.up[0][neighbor] = node
                    queue.append((neighbor, node))
    
    def _build_table(self):
        """Build binary lifting table using DP."""
        for i in range(1, self.LOG):
            for v in range(self.n):
                if self.up[i-1][v] != -1:
                    self.up[i][v] = self.up[i-1][self.up[i-1][v]]
    
    def lift(self, node: int, k: int) -> int:
        """Lift node by k steps up the tree."""
        for i in range(self.LOG):
            if k & (1 << i):
                node = self.up[i][node]
                if node == -1:
                    return -1
        return node
    
    def kth_ancestor(self, node: int, k: int) -> int:
        """Find the k-th ancestor of a node."""
        if k == 0:
            return node
        return self.lift(node, k)
    
    def lca(self, u: int, v: int) -> int:
        """Find Lowest Common Ancestor of nodes u and v."""
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        
        # Lift u to same depth as v
        diff = self.depth[u] - self.depth[v]
        u = self.lift(u, diff)
        
        if u == v:
            return v
        
        # Lift both nodes together
        for i in range(self.LOG - 1, -1, -1):
            if self.up[i][u] != self.up[i][v]:
                u = self.up[i][u]
                v = self.up[i][v]
        
        return self.up[0][u]
    
    def distance(self, u: int, v: int) -> int:
        """Find distance between two nodes (number of edges)."""
        ancestor = self.lca(u, v)
        return self.depth[u] + self.depth[v] - 2 * self.depth[ancestor]
```

### Template 2: K-th Ancestor (LeetCode 1483)

```python
class TreeAncestor:
    """
    LeetCode 1483: Kth Ancestor of a Tree Node
    
    Time: O(n log n) preprocessing, O(log k) per query
    Space: O(n log n)
    """
    
    def __init__(self, n: int, parent: List[int]):
        self.LOG = 20  # Enough for n <= 10^5
        # up[i][v] = 2^i-th ancestor of v
        self.up = [[-1] * n for _ in range(self.LOG)]
        
        # Base case: 2^0 = 1st ancestor
        for v in range(n):
            self.up[0][v] = parent[v]
        
        # Build table
        for i in range(1, self.LOG):
            for v in range(n):
                if self.up[i-1][v] != -1:
                    self.up[i][v] = self.up[i-1][self.up[i-1][v]]
    
    def getKthAncestor(self, node: int, k: int) -> int:
        """Return k-th ancestor of node, or -1 if doesn't exist."""
        for i in range(self.LOG):
            if k & (1 << i):
                node = self.up[i][node]
                if node == -1:
                    return -1
        return node
```

### Template 3: LCA with Path Sum

```python
class BinaryLiftingWithSum:
    """
    Binary Lifting with path sum queries.
    
    Time: O(n log n) preprocessing, O(log n) per query
    """
    
    def __init__(self, n: int, edges: List[List[int]], values: List[int], root: int = 0):
        self.n = n
        self.LOG = (n).bit_length()
        self.values = values
        
        # Graph
        self.graph = defaultdict(list)
        for u, v in edges:
            self.graph[u].append(v)
            self.graph[v].append(u)
        
        # Binary lifting table
        self.up = [[-1] * n for _ in range(self.LOG)]
        self.depth = [0] * n
        # Prefix sum from root to each node
        self.prefix_sum = [0] * n
        
        self._dfs(root, -1, 0, values[root])
        self._build_table()
    
    def _dfs(self, node: int, parent: int, depth: int, current_sum: int):
        self.depth[node] = depth
        self.up[0][node] = parent
        self.prefix_sum[node] = current_sum
        
        for neighbor in self.graph[node]:
            if neighbor != parent:
                self._dfs(neighbor, node, depth + 1, current_sum + self.values[neighbor])
    
    def _build_table(self):
        for i in range(1, self.LOG):
            for v in range(self.n):
                if self.up[i-1][v] != -1:
                    self.up[i][v] = self.up[i-1][self.up[i-1][v]]
    
    def lca(self, u: int, v: int) -> int:
        """Find LCA of u and v."""
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        
        diff = self.depth[u] - self.depth[v]
        for i in range(self.LOG - 1, -1, -1):
            if diff >= (1 << i):
                u = self.up[i][u]
                diff -= (1 << i)
        
        if u == v:
            return u
        
        for i in range(self.LOG - 1, -1, -1):
            if self.up[i][u] != self.up[i][v]:
                u = self.up[i][u]
                v = self.up[i][v]
        
        return self.up[0][u]
    
    def path_sum(self, u: int, v: int) -> int:
        """Calculate sum of values on path from u to v."""
        ancestor = self.lca(u, v)
        # Sum from root to u + root to v - 2*root to lca + value[lca]
        return (self.prefix_sum[u] + self.prefix_sum[v] 
                - 2 * self.prefix_sum[ancestor] + self.values[ancestor])
```

### Template 4: Binary Lifting on Array (Functional Graph)

```python
def binary_lifting_array(arr: List[int], queries: List[tuple]) -> List[int]:
    """
    Binary lifting on functional graph (array where each node points to one other).
    
    arr[i] = next node from i
    
    Time: O(n log n + q log k) where q = queries, k = steps
    """
    n = len(arr)
    LOG = 20  # Enough for most constraints
    
    # up[i][v] = node reached after 2^i steps from v
    up = [[0] * n for _ in range(LOG)]
    
    # Base case
    for v in range(n):
        up[0][v] = arr[v]
    
    # Build table
    for i in range(1, LOG):
        for v in range(n):
            up[i][v] = up[i-1][up[i-1][v]]
    
    def get_kth_successor(node: int, k: int) -> int:
        """Get node reached after k steps."""
        for i in range(LOG):
            if k & (1 << i):
                node = up[i][node]
        return node
    
    results = []
    for node, k in queries:
        results.append(get_kth_successor(node, k))
    
    return results
```

### Template 5: Lowest Common Ancestor (Basic)

```python
class LCA:
    """
    Simplified LCA implementation.
    
    Time: O(n log n) preprocessing, O(log n) per query
    Space: O(n log n)
    """
    
    def __init__(self, n: int, edges: List[List[int]], root: int = 0):
        self.n = n
        self.LOG = max(1, (n).bit_length())
        
        self.graph = [[] for _ in range(n)]
        for u, v in edges:
            self.graph[u].append(v)
            self.graph[v].append(u)
        
        self.up = [[-1] * n for _ in range(self.LOG)]
        self.depth = [0] * n
        
        self._dfs(root, -1)
        
        for i in range(1, self.LOG):
            for v in range(n):
                if self.up[i-1][v] != -1:
                    self.up[i][v] = self.up[i-1][self.up[i-1][v]]
    
    def _dfs(self, u: int, p: int):
        self.up[0][u] = p
        for v in self.graph[u]:
            if v != p:
                self.depth[v] = self.depth[u] + 1
                self._dfs(v, u)
    
    def query(self, u: int, v: int) -> int:
        """Find LCA of u and v."""
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        
        # Bring u up
        for i in range(self.LOG - 1, -1, -1):
            if self.depth[u] - (1 << i) >= self.depth[v]:
                u = self.up[i][u]
        
        if u == v:
            return u
        
        for i in range(self.LOG - 1, -1, -1):
            if self.up[i][u] != self.up[i][v]:
                u = self.up[i][u]
                v = self.up[i][v]
        
        return self.up[0][u]
```

---

## When to Use

Use the Binary Lifting algorithm when you need to solve problems involving:

- **Tree Ancestor Queries**: Finding the k-th ancestor or all ancestors of a node
- **LCA Queries**: Finding the lowest common ancestor of two nodes efficiently
- **Path Operations**: Computing distances or performing operations along paths in trees
- **Multiple Queries**: When you have many queries (Q) on a tree where Q × n would be too slow
- **Functional Graphs**: Each node has exactly one outgoing edge

### Comparison with Alternatives

| Data Structure | Build Time | LCA Query | K-th Ancestor | Supports Updates |
|----------------|------------|-----------|----------------|-------------------|
| **Binary Lifting** | O(n log n) | O(log n) | O(log n) | ❌ No |
| Naive (parent traversal) | O(1) | O(n) | O(n) | ✅ Yes |
| Euler Tour + RMQ | O(n) | O(1) | O(n) | ❌ No |
| Heavy-Light Decomposition | O(n) | O(log n) | O(log n) | ✅ Yes |

### When to Choose Binary Lifting vs Other Methods

- **Choose Binary Lifting** when:
  - You need to answer many LCA or k-th ancestor queries
  - The tree is static (doesn't change between queries)
  - You need additional operations like distance between nodes
  - Simpler implementation is preferred over HLD

- **Choose Euler Tour + RMQ** when:
  - You need absolute fastest LCA queries (O(1) after O(n) build)
  - The tree is completely static
  - You're comfortable with slightly more complex implementation

- **Choose Naive Approach** when:
  - You only have a few queries (less than ~100)
  - The tree is small
  - Simplicity is more important than efficiency

---

## Algorithm Explanation

### Core Concept

The key insight behind Binary Lifting is that any integer `k` can be represented as a sum of powers of 2. Instead of moving up one parent at a time (O(k)), we can "jump" up by larger powers of two using a precomputed table. This transforms O(k) time complexity to O(log k).

For example, to move up 13 steps from a node:
- 13 in binary = 1101 (8 + 4 + 1)
- We jump: 8 steps → 4 steps → 1 step = 3 jumps instead of 13

### How It Works

#### Preprocessing Phase:
- `up[v][i]` = 2^i-th ancestor of node v
- Build using dynamic programming: `up[v][i] = up[ up[v][i-1] ][i-1]`
- This means the 2^i ancestor is the 2^(i-1) ancestor of the 2^(i-1) ancestor

#### LCA Query Phase:
1. **Align depths**: If nodes are at different depths, lift the deeper node up
2. **Simultaneous lifting**: From highest power to lowest, lift both nodes if their ancestors differ
3. **Return parent**: When nodes are direct children of LCA, return the parent

### Visual Representation

For a tree with root 0:
```
        0          ← Level 0 (root)
       / \
      1   2        ← Level 1
     / \   \
    3   4   5      ← Level 2
       /
      6            ← Level 3
```

Binary lifting table for node 6 (LOG = 2 for this tree):
- `up[6][0]` = parent = 4 (2^0 = 1)
- `up[6][1]` = grandparent = 1 (2^1 = 2)
- `up[6][2]` = great-grandparent = 0 (2^2 = 4, if tree were deeper)

To find LCA(3, 5):
1. Depth(3) = 2, Depth(5) = 2 (already equal)
2. From i = LOG down to 0:
   - Check if up[3][i] != up[5][i]
   - For i = 1: up[3][1] = 0, up[5][1] = 0 → equal, skip
3. Return parent[0][3] = 1 → LCA = 0 ✓

### Why It Works

- **Binary decomposition**: Any number k can be represented as sum of powers of 2
- **Precomputation**: All 2^i ancestors are precomputed, so each jump is O(1)
- **Total jumps**: At most log₂(n) jumps per query
- **Optimality**: This is essentially the optimal approach for static trees

### Limitations

- **Static tree only**: The tree structure cannot change between queries
- **Space complexity**: O(n log n) space for the jump table
- **Preprocessing required**: Need O(n log n) time before answering queries
- **Single root**: Works best with rooted trees; forest requires additional handling

---

## Practice Problems

### Problem 1: K-th Ancestor of a Tree Node

**Problem:** [LeetCode 1483 - Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/)

**Description:** Design a data structure to find the k-th ancestor of a given node in a tree. The k-th ancestor of a tree node is the k-th node in the path from that node to the root.

**How to Apply Binary Lifting:**
- Build `up` table where `up[i][node]` is the 2^i-th ancestor of node
- For k-th ancestor query, binary decompose k and jump accordingly
- Each query takes O(log k) time after O(n log n) preprocessing

---

### Problem 2: Lowest Common Ancestor of a Binary Tree

**Problem:** [LeetCode 236 - Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

**Description:** Given a binary tree (not BST), find the lowest common ancestor (LCA) of two given nodes in the tree.

**How to Apply Binary Lifting:**
- Preprocess the tree with binary lifting (O(n log n))
- Answer each LCA query in O(log n)
- This is more efficient than the naive O(n) approach when multiple queries exist

---

### Problem 3: Sum of Distances in Tree

**Problem:** [LeetCode 834 - Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)

**Description:** Given a tree with n nodes (0-indexed), find the sum of distances from node 0 to all other nodes.

**How to Apply Binary Lifting:**
- Use binary lifting to find LCA in O(log n)
- Distance formula: depth[u] + depth[v] - 2 * depth[lca]
- Efficient for computing all pair distances

---

### Problem 4: Lowest Common Ancestor of a Binary Tree IV

**Problem:** [LeetCode 1676 - Lowest Common Ancestor of a Binary Tree IV](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/)

**Description:** Find the LCA of nodes in a binary tree when multiple nodes are given at once.

**How to Apply Binary Lifting:**
- Preprocess tree with binary lifting
- For each query, find LCA of all nodes in O(k log n) where k is number of nodes
- More efficient than pairwise LCA for multiple nodes

---

### Problem 5: Tree Queries

**Problem:** [LeetCode 2458 - Height of Binary Tree After Subtree Removal Queries](https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries/)

**Description:** You are given the root of a binary tree with n nodes. Each node is assigned a unique value from 1 to n. You are also given an array queries of size m. For each query, remove the subtree rooted at the node with value queries[i] and calculate the height of the resulting tree.

**How to Apply Binary Lifting:**
- Use binary lifting to efficiently compute heights and ancestors
- Preprocess node depths and heights for quick query responses

---

## Video Tutorial Links

### Fundamentals

- [Binary Lifting - Introduction (Take U Forward)](https://www.youtube.com/watch?v=Un0JDLV3qG4) - Comprehensive introduction to binary lifting
- [Binary Lifting Implementation (WilliamFiset)](https://www.youtube.com/watch?v=L2O0RAna7P4) - Detailed explanation with code
- [LCA using Binary Lifting (NeetCode)](https://www.youtube.com/watch?v=s_3P2j3UcO4) - Practical implementation guide

### Advanced Topics

- [K-th Ancestor Problem](https://www.youtube.com/watch?v=dRMx4DdGf50) - K-th ancestor queries
- [Distance in Tree using Binary Lifting](https://www.youtube.com/watch?v=MO55_r7nbbM) - Computing distances
- [Binary Lifting vs Euler Tour](https://www.youtube.com/watch?v=HhaGkHDsP9k) - Comparing LCA approaches

---

## Follow-up Questions

### Q1: What is the difference between Binary Lifting and Euler Tour + RMQ for LCA?

**Answer:** 
- **Binary Lifting**: O(n log n) preprocessing, O(log n) query, O(n log n) space
- **Euler Tour + RMQ**: O(n) preprocessing, O(1) query, O(n) space
- Binary lifting is simpler to implement and allows k-th ancestor queries
- Euler tour is faster but requires additional data structure (sparse table or segment tree for RMQ)

### Q2: Can Binary Lifting handle trees with multiple roots (forest)?

**Answer:** Yes, but with modifications:
1. Run preprocessing from each root in the forest
2. Mark nodes that are roots with parent = -1
3. Ensure queries only between nodes in the same tree
4. Alternative: Add a super-root connecting all forest roots

### Q3: How do you handle updates in a tree with Binary Lifting?

**Answer:** Binary Lifting **does not support efficient updates**. Options:
1. **Rebuild entire structure**: O(n log n) per update - not practical
2. **Use Link-Cut Tree**: For dynamic trees with path queries
3. **Use Heavy-Light Decomposition**: For trees that change infrequently
4. **Binary Lifting + Fenwick**: For point updates on node values

### Q4: What is the maximum tree size Binary Lifting can handle?

**Answer:** With O(n log n) space:
- **Memory**: ~100MB → ~10^7 elements (depending on LOG)
- **Time**: Build takes O(n log n) → practical up to ~10^5-10^6 nodes
- For larger trees, consider Euler tour or external memory approaches

### Q5: How does Binary Lifting compare to DFS for single LCA queries?

**Answer:**
- **Single query**: DFS is O(n), Binary Lifting is O(log n) but needs O(n log n) preprocessing
- **Multiple queries**: Binary Lifting wins when Q × log n < n × Q (i.e., more than ~log n queries)
- **Practical threshold**: Binary Lifting becomes worth it with ~10+ queries on the same tree

---

## Summary

Binary Lifting is an essential technique for solving **tree-related queries efficiently**. Key takeaways:

- **Preprocessing investment**: O(n log n) build time enables O(log n) queries
- **Versatile operations**: Supports LCA, k-th ancestor, distance, and path queries
- **Space tradeoff**: Uses O(n log n) space for fast query performance
- **Static trees only**: Doesn't support dynamic tree modifications

When to use:
- ✅ Multiple LCA/ancestor queries on the same tree
- ✅ Path operations (distance, sum along paths)
- ✅ K-th ancestor queries
- ❌ When tree changes frequently (use Link-Cut Tree or HLD)
- ❌ Single queries on small trees (simple DFS is enough)

This technique is fundamental in competitive programming and technical interviews, especially for problems involving tree traversals, ancestor queries, and path operations. Combined with other tree algorithms, it enables efficient solutions to complex tree problems.
