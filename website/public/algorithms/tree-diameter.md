# Tree Diameter

## Category
Trees

## Description

The Tree Diameter is the longest path between any two nodes in a tree. Unlike in general graphs where the longest path problem is NP-hard, trees have a special structure that allows us to find the diameter in linear O(n) time using a clever two-pass approach.

The key insight is that in any tree, one endpoint of the diameter must be the farthest node from any arbitrary starting node. This property enables an elegant algorithm: start from any node, find the farthest node A, then find the farthest node from A - the distance between these two nodes is the diameter. This works for any tree structure including binary trees, n-ary trees, and general undirected trees.

---

## Concepts

The tree diameter algorithm relies on fundamental properties of trees and graph traversal.

### 1. Tree Properties

| Property | Description |
|----------|-------------|
| **Acyclic** | No cycles, exactly one path between any two nodes |
| **Connected** | All nodes reachable from any other node |
| **n-1 edges** | A tree with n nodes has exactly n-1 edges |
| **Unique path** | Exactly one simple path between any two nodes |

### 2. The Farthest Node Property

The crucial insight for the diameter algorithm:

```
Theorem: In any tree, pick any node X and find the farthest node A from X.
         Then A must be one endpoint of the diameter.

Proof sketch: 
- Let P be the diameter path with endpoints U and V
- From any node X, the farthest node must be either U or V
- If we find farthest from X (call it A), then A is either U or V
- Therefore, farthest from A gives us the other diameter endpoint
```

### 3. BFS vs DFS for Distance

Both BFS and DFS can compute distances in unweighted trees:

| Method | Approach | Best For |
|--------|----------|----------|
| **BFS** | Level-by-level traversal | Unweighted trees, iterative |
| **DFS** | Recursive height tracking | When you also need subtree info |

### 4. Height vs Diameter

| Concept | Definition | Computation |
|---------|------------|-------------|
| **Height** | Max distance from node to any leaf | DFS returning max depth |
| **Diameter** | Max distance between any two nodes | Two BFS passes or DFS tracking |

---

## Frameworks

Structured approaches for finding tree diameter.

### Framework 1: Two BFS/DFS Passes

```
┌─────────────────────────────────────────────────────────────┐
│  TWO-PASS DIAMETER ALGORITHM                                │
├─────────────────────────────────────────────────────────────┤
│  Input: edges (list of [u, v] pairs)                        │
│  Output: diameter (length of longest path)                  │
│                                                              │
│  1. Build adjacency list from edges                         │
│  2. First traversal:                                        │
│     a. Start from any node (typically 0)                   │
│     b. Find farthest node A using BFS/DFS                  │
│     c. Track distances during traversal                    │
│  3. Second traversal:                                       │
│     a. Start from node A                                   │
│     b. Find farthest node B using BFS/DFS                  │
│     c. Distance from A to B = diameter                   │
│  4. Return distance(A, B)                                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard approach, works for all tree types.

### Framework 2: One-Pass DFS with Height Tracking

```
┌─────────────────────────────────────────────────────────────┐
│  SINGLE DFS DIAMETER ALGORITHM                              │
├─────────────────────────────────────────────────────────────┤
│  Input: edges, tree structure                               │
│  Output: diameter                                           │
│                                                              │
│  1. Build adjacency list                                    │
│  2. Initialize global diameter = 0                          │
│  3. DFS(node, parent):                                      │
│     a. Initialize max1 = max2 = 0 (two largest heights)     │
│     b. For each child (not parent):                        │
│        - height = DFS(child, node)                         │
│        - Update max1, max2 if height larger                 │
│     c. diameter = max(diameter, max1 + max2)               │
│     d. Return max1 + 1 (height of this node)               │
│  4. Call DFS(0, -1)                                         │
│  5. Return diameter                                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need both diameter and height information.

### Framework 3: Finding the Actual Path

```
┌─────────────────────────────────────────────────────────────┐
│  DIAMETER PATH RECONSTRUCTION                               │
├─────────────────────────────────────────────────────────────┤
│  1. Find endpoint A using first BFS                        │
│  2. Second BFS from A:                                     │
│     a. Track parent pointers for each node                 │
│     b. Find farthest node B                                │
│  3. Backtrack from B using parent pointers:               │
│     a. Start at B                                          │
│     b. While node != A:                                    │
│        - Add node to path                                  │
│        - node = parent[node]                              │
│     c. Add A to path                                       │
│     d. Reverse path to get A → B                           │
│  4. Return path list                                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need the actual nodes in the diameter path.

---

## Forms

Different manifestations of the tree diameter problem.

### Form 1: General N-ary Tree

Standard tree with arbitrary number of children per node.

| Aspect | Details |
|--------|---------|
| **Input** | List of edges [[u, v], [u, w], ...] |
| **Structure** | Undirected, connected, acyclic |
| **Algorithm** | Two BFS passes or one DFS |
| **Complexity** | O(n) time, O(n) space |

### Form 2: Binary Tree

Each node has at most 2 children (left and right).

| Modification | Track left and right heights separately |
|--------------|----------------------------------------|
| **LeetCode** | Problem 543 - Diameter of Binary Tree |
| **Key difference** | Path may or may not pass through root |

### Form 3: Weighted Tree

Edges have weights (distances).

| Modification | Track cumulative weights instead of edge counts |
|--------------|------------------------------------------------|
| **Algorithm** | Dijkstra from A, then Dijkstra from B, or weighted DFS |
| **Complexity** | O(n) for trees (no need for full Dijkstra) |

### Form 4: Tree Center

Find the center(s) of the tree - middle of diameter.

| Approach | Find diameter path, take middle node(s) |
|----------|-----------------------------------------|
| **Center count** | 1 (odd diameter) or 2 (even diameter) |
| **Application** | Minimum height trees, facility location |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: BFS with Distance Tracking

Standard BFS that returns farthest node and distances:

```python
from collections import deque, defaultdict

def bfs_farthest(graph, start):
    """
    Find farthest node from start and return distances.
    
    Returns: (farthest_node, distance_dict)
    """
    dist = {start: 0}
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)
    
    farthest = max(dist, key=dist.get)
    return farthest, dist
```

**Why it works**: BFS explores nodes in increasing distance order.

### Tactic 2: Iterative vs Recursive DFS

Two approaches for DFS-based diameter:

```python
# Iterative DFS (avoids recursion limit)
def dfs_iterative(graph, start):
    """Iterative DFS with explicit stack."""
    stack = [(start, -1, 0)]  # (node, parent, depth)
    dist = {}
    
    while stack:
        node, parent, depth = stack.pop()
        dist[node] = depth
        
        for neighbor in graph[node]:
            if neighbor != parent:
                stack.append((neighbor, node, depth + 1))
    
    farthest = max(dist, key=dist.get)
    return farthest, dist

# For deep trees, iterative avoids stack overflow
```

**When to use**: Deep trees where recursion might hit stack limit.

### Tactic 3: Edge List to Adjacency List

Convert edge list representation:

```python
def build_graph(edges):
    """Build adjacency list from edge list."""
    n = len(edges) + 1  # Tree has n-1 edges
    graph = defaultdict(list)
    
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    return graph
```

**Optimization**: Tree with n nodes has exactly n-1 edges.

### Tactic 4: Path Reconstruction with Parent Tracking

Track path during second BFS:

```python
def find_diameter_path(edges):
    """Find the actual path that forms the diameter."""
    graph = build_graph(edges)
    
    # First BFS
    node_a, _ = bfs_farthest(graph, 0)
    
    # Second BFS with parent tracking
    parent = {node_a: None}
    dist = {node_a: 0}
    queue = deque([node_a])
    node_b = node_a
    
    while queue:
        node = queue.popleft()
        node_b = node  # Last processed is farthest
        
        for neighbor in graph[node]:
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                parent[neighbor] = node
                queue.append(neighbor)
    
    # Reconstruct path from B to A
    path = []
    node = node_b
    while node is not None:
        path.append(node)
        node = parent[node]
    
    return path[::-1]  # Reverse to get A to B
```

**Use case**: When you need the actual nodes, not just distance.

---

## Python Templates

### Template 1: Standard Two BFS Passes

```python
from collections import deque, defaultdict
from typing import List


def tree_diameter(edges: List[List[int]]) -> int:
    """
    Find tree diameter using two BFS passes.
    
    Args:
        edges: List of [u, v] pairs representing tree edges
    
    Returns:
        Length of the diameter (number of edges in longest path)
    
    Time: O(n)
    Space: O(n)
    """
    if not edges:
        return 0
    
    # Build adjacency list
    n = len(edges) + 1
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    def bfs(start: int) -> tuple:
        """Return (farthest_node, distance_dict)."""
        dist = {start: 0}
        queue = deque([start])
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in dist:
                    dist[neighbor] = dist[node] + 1
                    queue.append(neighbor)
        
        farthest = max(dist, key=dist.get)
        return farthest, dist
    
    # First BFS: find one endpoint of diameter
    node_a, _ = bfs(0)
    
    # Second BFS: find other endpoint and get diameter
    node_b, dist = bfs(node_a)
    
    return dist[node_b]
```

### Template 2: DFS Height Tracking (One Pass)

```python
from collections import defaultdict
from typing import List


def tree_diameter_dfs(edges: List[List[int]]) -> int:
    """
    Find diameter using single DFS pass.
    Tracks two largest heights at each node.
    
    Time: O(n)
    Space: O(n) for recursion stack
    """
    if not edges:
        return 0
    
    n = len(edges) + 1
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    diameter = 0
    
    def dfs(node: int, parent: int) -> int:
        """Return max height from this node, update global diameter."""
        nonlocal diameter
        
        max1 = max2 = 0  # Two largest heights from this node
        
        for neighbor in graph[node]:
            if neighbor != parent:
                height = dfs(neighbor, node)
                if height > max1:
                    max2 = max1
                    max1 = height
                elif height > max2:
                    max2 = height
        
        # Path through this node = sum of two largest heights
        diameter = max(diameter, max1 + max2)
        
        # Return height from this node
        return max1 + 1
    
    dfs(0, -1)
    return diameter
```

### Template 3: Binary Tree Diameter

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def diameter_of_binary_tree(root: TreeNode) -> int:
    """
    LeetCode 543: Diameter of Binary Tree
    
    Returns the length of the diameter (number of edges).
    The diameter may or may not pass through the root.
    
    Time: O(n)
    Space: O(h) where h is tree height
    """
    diameter = 0
    
    def height(node: TreeNode) -> int:
        """Return height and update diameter."""
        nonlocal diameter
        
        if not node:
            return 0
        
        left_height = height(node.left)
        right_height = height(node.right)
        
        # Path through this node
        diameter = max(diameter, left_height + right_height)
        
        # Return height of this node
        return max(left_height, right_height) + 1
    
    height(root)
    return diameter
```

### Template 4: Tree Diameter with Path

```python
from collections import deque, defaultdict
from typing import List, Tuple


def tree_diameter_with_path(edges: List[List[int]]) -> Tuple[int, List[int]]:
    """
    Find both the diameter length and the actual path.
    
    Returns:
        (diameter_length, path_nodes)
    
    Time: O(n)
    Space: O(n)
    """
    if not edges:
        return 0, []
    
    n = len(edges) + 1
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    def bfs_with_parent(start: int) -> Tuple[int, dict, dict]:
        """Return (farthest_node, distance_dict, parent_dict)."""
        dist = {start: 0}
        parent = {start: None}
        queue = deque([start])
        
        farthest = start
        while queue:
            node = queue.popleft()
            farthest = node
            
            for neighbor in graph[node]:
                if neighbor not in dist:
                    dist[neighbor] = dist[node] + 1
                    parent[neighbor] = node
                    queue.append(neighbor)
        
        return farthest, dist, parent
    
    # First BFS to find one endpoint
    node_a, _, _ = bfs_with_parent(0)
    
    # Second BFS to find other endpoint and parents
    node_b, dist, parent = bfs_with_parent(node_a)
    
    # Reconstruct path
    path = []
    node = node_b
    while node is not None:
        path.append(node)
        node = parent[node]
    
    return dist[node_b], path[::-1]
```

### Template 5: Weighted Tree Diameter

```python
from collections import defaultdict
from typing import List, Tuple


def weighted_tree_diameter(edges: List[List[int]], 
                          weights: List[int]) -> int:
    """
    Find diameter in weighted tree.
    
    Args:
        edges: List of [u, v] pairs
        weights: Weight for each edge (corresponds to edges list)
    
    Returns:
        Total weight of diameter path
    
    Time: O(n)
    Space: O(n)
    """
    if not edges:
        return 0
    
    n = len(edges) + 1
    graph = defaultdict(list)
    
    for i, (u, v) in enumerate(edges):
        w = weights[i]
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    diameter = 0
    
    def dfs(node: int, parent: int) -> int:
        """Return max weighted distance to leaf."""
        nonlocal diameter
        
        max1 = max2 = 0  # Two largest weighted heights
        
        for neighbor, weight in graph[node]:
            if neighbor != parent:
                dist = dfs(neighbor, node) + weight
                if dist > max1:
                    max2 = max1
                    max1 = dist
                elif dist > max2:
                    max2 = dist
        
        diameter = max(diameter, max1 + max2)
        return max1
    
    dfs(0, -1)
    return diameter
```

### Template 6: Find Tree Center(s)

```python
from collections import deque, defaultdict
from typing import List


def find_tree_centers(edges: List[List[int]]) -> List[int]:
    """
    Find center(s) of tree - middle node(s) of diameter.
    Returns 1 center for odd diameter, 2 for even.
    
    Time: O(n)
    Space: O(n)
    """
    if not edges:
        return [0]
    
    # Get diameter path first
    _, path = tree_diameter_with_path(edges)
    
    n = len(path)
    if n % 2 == 1:
        # Odd length: single center
        return [path[n // 2]]
    else:
        # Even length: two centers
        return [path[n // 2 - 1], path[n // 2]]
```

---

## When to Use

Use the Tree Diameter algorithm when you need to solve problems involving:

- **Longest path in tree**: The classic diameter problem
- **Tree center problems**: Finding the center(s) of a tree
- **Facility location**: Placing a facility to minimize maximum distance
- **Tree height variations**: When tree structure is unrooted
- **Eccentricity**: Maximum distance from a node to any other node
- **Tree radius**: Minimum eccentricity among all nodes

### Comparison with Alternatives

| Problem | Approach | Time | Space |
|---------|----------|------|-------|
| **Tree Diameter** | Two BFS/DFS | O(n) | O(n) |
| **Longest Path in General Graph** | NP-Hard | O(2^n) | O(n) |
| **Weighted Diameter** | Weighted DFS/BFS | O(n) | O(n) |
| **All-Pairs Longest Paths** | BFS from each node | O(n^2) | O(n^2) |

### When to Choose Different Approaches

- **Choose Two BFS** when:
  - You only need the diameter length
  - Iterative approach preferred (no recursion stack)
  - Working with very deep trees

- **Choose Single DFS** when:
  - You need additional tree information (heights)
  - Working with rooted trees
  - Memory is constrained (no queue needed)

- **Choose Weighted DFS** when:
  - Edges have different weights
  - Distance is not just edge count

---

## Algorithm Explanation

### Core Concept

The Tree Diameter algorithm exploits a special property of trees: from any starting node, one of the diameter endpoints must be the farthest node. This allows us to find both endpoints with just two traversals instead of checking all pairs.

**Key Terminology**:
- **Tree**: Connected, acyclic undirected graph
- **Diameter**: Longest path between any two nodes (measured in edges or weight)
- **Eccentricity**: Maximum distance from a node to any other node
- **Center**: Node(s) with minimum eccentricity (middle of diameter)

### How It Works

#### The Two-Pass Approach

**Step 1**: Start from any node (let's call it S)
- Perform BFS/DFS to find the farthest node from S (call it A)
- **Proof**: A must be one endpoint of the diameter

**Step 2**: Start from node A
- Perform BFS/DFS to find the farthest node from A (call it B)
- The distance from A to B is the diameter

**Why it works**: 
- In a tree, there's exactly one path between any two nodes
- From any starting point, at least one diameter endpoint is farthest
- By finding farthest from the first endpoint, we get the full diameter

#### Single DFS Alternative

The DFS approach works by:
1. Computing the height of each subtree
2. Tracking the two largest heights through each node
3. The sum of these two heights is a candidate diameter
4. Global maximum across all nodes is the answer

### Visual Walkthrough

**Example Tree**:
```
    0
    |
    1
   / \
  2   3
     / \
    4   5
```

**Two BFS Passes**:
```
Pass 1: Start from 0
0 → 1 (dist 1)
1 → 2 (dist 2), 3 (dist 2)
3 → 4 (dist 3), 5 (dist 3)
Farthest from 0: 4 or 5 (distance 3)
Let's say A = 4

Pass 2: Start from 4
4 → 3 (dist 1)
3 → 1 (dist 2), 5 (dist 2)
1 → 0 (dist 3), 2 (dist 3)
5 → (no new nodes)
Farthest from 4: 0 or 2 (distance 3)
Let's say B = 2

Diameter = distance(4, 2) = 3 edges
Path: 4 → 3 → 1 → 2
```

### Why O(n) is Optimal

Any algorithm must examine all edges to ensure it finds the longest path. Since a tree has exactly n-1 edges, O(n) is optimal.

### Limitations

- **Only for trees**: General graph longest path is NP-hard
- **Single connected component**: For forests, find diameter of each tree
- **Unweighted assumption**: For weighted trees, use weighted traversal
- **No negative weights**: Standard approach assumes non-negative edge weights

---

## Practice Problems

### Problem 1: Tree Diameter

**Problem:** [LeetCode 1245 - Tree Diameter](https://leetcode.com/problems/tree-diameter/)

**Description:** Given an undirected tree with n nodes labeled 0 to n-1, and a list of edges, return the diameter of the tree. The diameter is the number of edges in the longest path between any two nodes.

**How to Apply:**
- Build adjacency list from edge list
- Two BFS/DFS passes to find diameter
- Return edge count (distance)

---

### Problem 2: Diameter of Binary Tree

**Problem:** [LeetCode 543 - Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)

**Description:** Given the root of a binary tree, return the length of the diameter. The diameter is the longest path between any two nodes, which may or may not pass through the root.

**How to Apply:**
- Use single DFS tracking heights
- At each node, diameter candidate = left_height + right_height
- Return max diameter found

---

### Problem 3: Longest Path With Different Adjacent Characters

**Problem:** [LeetCode 2246 - Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters/)

**Description:** You are given a tree with n nodes, and a string s representing characters on each node. Return the longest path such that no two adjacent nodes have the same character.

**How to Apply:**
- Tree diameter concept with character constraint
- DFS tracking only valid paths (different characters)
- Similar height tracking but with filtering

---

### Problem 4: Minimum Height Trees

**Problem:** [LeetCode 310 - Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)

**Description:** Find all the roots of minimum height trees. A tree can be rooted at any node - find which roots give minimum height.

**How to Apply:**
- Centers of tree are the roots of minimum height trees
- Find diameter, then take middle node(s)
- Or use leaf-peeling (topological) approach

---

### Problem 5: Find Closest Node to Given Two Nodes

**Problem:** [LeetCode 2359 - Find Closest Node to Given Two Nodes](https://leetcode.com/problems/find-closest-node-to-given-two-nodes/)

**Description:** Given a directed graph (edges[i] is the destination from node i), find the node that can reach both node1 and node2 with minimum maximum distance.

**How to Apply:**
- Tree-like structure analysis
- Distance computation from multiple sources
- Minimax optimization

---

## Video Tutorial Links

### Fundamentals

- [Tree Diameter - William Fiset](https://www.youtube.com/watch?v=2rlJSWpDg1Q) - Algorithm explanation with visualizations
- [Tree Diameter Algorithm - Take U Forward](https://www.youtube.com/watch?v=8rhC) - Two-pass approach
- [Graph Theory - Tree Diameter](https://www.youtube.com/watch?v=12lLMq1Q1yc) - Competitive programming

### Problem Solutions

- [LeetCode 543 - Diameter of Binary Tree](https://www.youtube.com/watch?v=bkxqA8Rr) - Binary tree specific
- [LeetCode 1245 - Tree Diameter](https://www.youtube.com/watch?v=1KxD5D2J6uk) - General tree implementation
- [Minimum Height Trees Solution](https://www.youtube.com/watch?v=pUtx2R28n) - Tree center application

### Advanced Topics

- [Tree DP Patterns](https://www.youtube.com/watch?v=FAfRh6yy) - Dynamic programming on trees
- [Longest Path in Tree](https://www.youtube.com/watch?v=7zH8) - Various tree path problems

---

## Follow-up Questions

### Q1: How do you find the actual nodes in the diameter path?

**Answer:** During the second BFS/DFS, track parent pointers for each node. After finding the farthest node B, backtrack using parent pointers from B to A. Reverse this list to get the path from A to B.

---

### Q2: Does this work for weighted trees?

**Answer:** Yes, but use DFS that accumulates weights or use weighted BFS (0-1 BFS or Dijkstra if needed). The two-pass property still holds: farthest in terms of weighted distance from any node reaches a diameter endpoint.

---

### Q3: What about trees with negative edge weights?

**Answer:** The standard approach assumes non-negative weights. With negative weights, the "farthest" concept breaks down because going around a cycle (if it existed) could give infinite negative distance. Trees don't have cycles, but negative weights still complicate the farthest-node property.

---

### Q4: Can you find the diameter in O(n) without BFS/DFS twice?

**Answer:** Yes, using the single DFS approach that tracks two largest heights at each node. This also runs in O(n) and uses only one traversal, but requires recursion or an explicit stack to track heights bottom-up.

---

### Q5: How do you handle forests (disconnected trees)?

**Answer:** Find the diameter of each connected component separately, then take the maximum. Use visited set to track which nodes have been processed, and run the diameter algorithm on each unvisited component.

---

## Summary

The Tree Diameter algorithm finds the longest path in a tree in optimal O(n) time using a clever two-pass traversal approach. The key insight is that from any starting node, one diameter endpoint is always the farthest node.

**Key Takeaways**:

1. **Two BFS/DFS Passes**: Start anywhere → find farthest A → find farthest from A = diameter
2. **Linear Time**: O(n) is optimal - must examine all n-1 edges
3. **Tree Property**: Works because trees have unique paths between nodes
4. **Alternative Approaches**: Single DFS with height tracking also works in O(n)
5. **Applications**: Tree centers, facility location, eccentricity calculations

**When to Use**:
- Finding longest path in unweighted or weighted trees
- Finding tree center(s) for minimum height rooting
- Any tree problem requiring diameter information

**Important Distinctions**:
- Binary tree diameter vs general tree diameter
- Unweighted vs weighted edges
- Finding length vs finding actual path nodes

This algorithm is fundamental for tree problems and frequently appears in competitive programming and technical interviews.
