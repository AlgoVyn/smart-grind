# Lowest Common Ancestor

## Category
Trees & BSTs

## Description

The Lowest Common Ancestor (LCA) of two nodes in a binary tree is the deepest node that has both nodes as descendants (where a node is also a descendant of itself). This is a fundamental problem in tree data structures with applications in path finding, tree traversals, and hierarchical relationship queries.

The LCA problem appears frequently in technical interviews and competitive programming, with multiple solution approaches offering different time-space tradeoffs depending on the specific constraints and use case.

---

## Concepts

The LCA algorithm is built on several fundamental concepts that enable efficient ancestor queries.

### 1. Ancestor-Descendant Relationship

Understanding tree hierarchy:

| Relationship | Definition | Example |
|--------------|------------|---------|
| **Ancestor** | Node on path from root to target | In path 3→5→2, nodes 3 and 5 are ancestors of 2 |
| **Descendant** | Node in subtree of target | In subtree rooted at 5, nodes 2, 4, 7 are descendants |
| **Self-ancestor** | A node is its own ancestor | LCA can be one of the query nodes |
| **Common ancestor** | Ancestor of both nodes | Root is always a common ancestor |

### 2. Path Intersection

The LCA is where paths from root diverge:

```
Path to node A: Root → ... → LCA → ... → A
Path to node B: Root → ... → LCA → ... → B
                     ↑
                  Paths share ancestors here
                  LCA is deepest shared node
```

### 3. Tree Properties for Optimization

| Tree Type | Property | LCA Optimization |
|-----------|----------|------------------|
| **Binary Tree** | Each node has ≤ 2 children | Standard recursion |
| **BST** | Left < Node < Right | O(h) traversal using values |
| **N-ary Tree** | Arbitrary children | Check all children |
| **Parent pointers** | Node has parent reference | O(h) with hash set |

### 4. Binary Lifting Concept

Precompute 2^k ancestors for O(log n) queries:

```
up[node][k] = 2^k-th ancestor of node

To find LCA:
1. Lift deeper node to same depth
2. Lift both together until just before LCA
3. Return parent
```

---

## Frameworks

Structured approaches for solving LCA problems.

### Framework 1: Recursive LCA Template

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE LCA FRAMEWORK (Most Common)              │
├─────────────────────────────────────────────────────┤
│  1. Base case: If root is null or equals p or q:   │
│     - Return root                                  │
│  2. Recurse left: Find LCA in left subtree         │
│     - left = lca(root.left, p, q)                  │
│  3. Recurse right: Find LCA in right subtree      │
│     - right = lca(root.right, p, q)               │
│  4. Combine results:                                │
│     - If left AND right both non-null:             │
│       → Current root is LCA (p, q in different     │
│         subtrees)                                  │
│     - Else: Return whichever is non-null            │
│       (LCA found in one subtree)                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Single query, simple implementation, clean code preferred.

### Framework 2: BST LCA Template

```
┌─────────────────────────────────────────────────────┐
│  BST LCA FRAMEWORK (O(h) time)                     │
├─────────────────────────────────────────────────────┤
│  1. Start at root                                   │
│  2. While root is not null:                         │
│     a. If both p, q < root.val:                    │
│        - LCA is in left subtree                    │
│        - root = root.left                          │
│     b. Else if both p, q > root.val:               │
│        - LCA is in right subtree                   │
│        - root = root.right                         │
│     c. Else:                                        │
│        - Found split point (or root equals p or q) │
│        - Return root (this is LCA)                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: BST structure known, O(h) performance needed.

### Framework 3: Binary Lifting Template (Multiple Queries)

```
┌─────────────────────────────────────────────────────┐
│  BINARY LIFTING LCA FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  PREPROCESSING (O(n log n)):                       │
│  1. DFS to assign depth to each node               │
│  2. Build up[node][k] table:                       │
│     - up[node][0] = parent (2^0 = 1 ancestor)    │
│     - up[node][k] = up[up[node][k-1]][k-1]          │
│                                                     │
│  QUERY (O(log n)):                                  │
│  1. If depths differ, lift deeper node up         │
│  2. If nodes now equal, return that node           │
│  3. Lift both nodes together from highest k down  │
│  4. When up[u][k] != up[v][k], lift both          │
│  5. Return parent of either node                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Multiple LCA queries on same tree.

---

## Forms

Different manifestations of the LCA pattern.

### Form 1: Standard Binary Tree LCA

Recursive approach for general binary trees:

| Case | Condition | Result |
|------|-----------|--------|
| Base case 1 | root is None | Return None |
| Base case 2 | root is p or q | Return root (found one) |
| Both found | left and right non-None | root is LCA |
| One found | Only left or only right non-None | Return that one |
| Neither | Both None | Return None |

### Form 2: BST LCA

Leverage BST ordering property:

```
For BST LCA:
- If p.val < root.val AND q.val < root.val:
    → LCA is in left subtree
- If p.val > root.val AND q.val > root.val:
    → LCA is in right subtree
- Else:
    → Current root is LCA (nodes on different sides)
```

Time: O(h), Space: O(1) iterative.

### Form 3: Parent Pointer LCA

When nodes have parent references:

```python
def lca_with_parent(p, q):
    ancestors = set()
    while p:
        ancestors.add(p)
        p = p.parent
    while q:
        if q in ancestors:
            return q
        q = q.parent
    return None
```

Time: O(h), Space: O(h).

### Form 4: Path Comparison LCA

Store paths and compare:

```python
def lca_path(root, p, q):
    path_p = find_path(root, p)  # List from root to p
    path_q = find_path(root, q)  # List from root to q
    
    # Find last common node
    lca = None
    for a, b in zip(path_p, path_q):
        if a == b:
            lca = a
        else:
            break
    return lca
```

Time: O(n), Space: O(h).

### Form 5: N-ary Tree LCA

For trees with arbitrary children:

```python
def lca_nary(root, p, q):
    if not root or root == p or root == q:
        return root
    
    found = []
    for child in root.children:
        result = lca_nary(child, p, q)
        if result:
            found.append(result)
    
    if len(found) == 2:
        return root  # p and q in different subtrees
    return found[0] if found else None
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Handle Single Node LCA

Node can be LCA with itself:

```python
def lowest_common_ancestor(root, p, q):
    """Handle case where p is ancestor of q or vice versa."""
    if not root or root == p or root == q:
        return root
    # ... rest of logic
```

### Tactic 2: BST Iterative Optimization

Avoid recursion for BST:

```python
def lca_bst_iterative(root, p, q):
    """O(h) time, O(1) space for BST."""
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None
```

### Tactic 3: Distance Between Nodes

Use LCA to compute distance:

```python
def distance_between_nodes(root, p, q):
    """Distance = depth(p) + depth(q) - 2*depth(lca)."""
    lca = lowest_common_ancestor(root, p, q)
    
    def depth(node, target, d):
        if not node:
            return -1
        if node == target:
            return d
        left = depth(node.left, target, d + 1)
        if left != -1:
            return left
        return depth(node.right, target, d + 1)
    
    d_p = depth(lca, p, 0)
    d_q = depth(lca, q, 0)
    return d_p + d_q
```

### Tactic 4: K-th Ancestor Using Binary Lifting

Extend binary lifting for ancestor queries:

```python
def kth_ancestor(node, k, up, LOG):
    """Find k-th ancestor using binary lifting table."""
    current = node
    for i in range(LOG):
        if k & (1 << i):
            if up[current][i] == -1:
                return -1
            current = up[current][i]
    return current
```

### Tactic 5: LCA for Binary Lifting Construction

Build the binary lifting table:

```python
def build_binary_lifting(root, n):
    """Build up table for binary lifting LCA."""
    LOG = (n).bit_length()
    
    # Node to ID mapping
    node_id = {}
    depth = [0] * n
    up = [[-1] * LOG for _ in range(n)]
    
    def dfs(node, d, parent_id):
        if not node:
            return
        
        node_id[node] = len(node_id)
        id = node_id[node]
        depth[id] = d
        up[id][0] = parent_id
        
        for k in range(1, LOG):
            if up[id][k-1] != -1:
                up[id][k] = up[up[id][k-1]][k-1]
        
        dfs(node.left, d + 1, id)
        dfs(node.right, d + 1, id)
    
    dfs(root, 0, -1)
    return up, depth, node_id
```

### Tactic 6: Euler Tour + RMQ for O(1) LCA

For static trees with many queries:

```python
# Build Euler tour (DFS visiting order)
# First occurrence of each node in tour
# Use Sparse Table or Segment Tree for RMQ
# LCA = RMQ over range between first occurrences
```

---

## Python Templates

### Template 1: Recursive LCA (Binary Tree)

```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root: Optional[TreeNode], 
                         p: TreeNode, 
                         q: TreeNode) -> Optional[TreeNode]:
    """
    Template 1: Recursive LCA for binary tree.
    Time: O(n), Space: O(h) - recursion stack depth
    """
    # Base case: reached null or found one of the nodes
    if not root or root == p or root == q:
        return root
    
    # Recurse on left and right subtrees
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    # If both sides return non-null, current is LCA
    if left and right:
        return root
    
    # Return whichever is non-null (or None)
    return left or right
```

### Template 2: BST LCA (Iterative)

```python
def lowest_common_ancestor_bst(root: Optional[TreeNode], 
                               p: TreeNode, 
                               q: TreeNode) -> Optional[TreeNode]:
    """
    Template 2: LCA in Binary Search Tree using BST property.
    Time: O(h), Space: O(1)
    """
    if not root or not p or not q:
        return None
    
    current = root
    
    while current:
        if p.val < current.val and q.val < current.val:
            # Both in left subtree
            current = current.left
        elif p.val > current.val and q.val > current.val:
            # Both in right subtree
            current = current.right
        else:
            # Nodes on different sides - this is LCA
            return current
    
    return None
```

### Template 3: Parent Pointer LCA

```python
def lowest_common_ancestor_parent(p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
    """
    Template 3: LCA assuming nodes have parent pointers.
    Time: O(h), Space: O(h)
    """
    ancestors = set()
    
    # Collect all ancestors of p
    while p:
        ancestors.add(p)
        p = p.parent
    
    # Find first ancestor of q that's also in p's ancestors
    while q:
        if q in ancestors:
            return q
        q = q.parent
    
    return None
```

### Template 4: Path Comparison LCA

```python
from typing import List

def lowest_common_ancestor_path(root: TreeNode, 
                                  p: TreeNode, 
                                  q: TreeNode) -> Optional[TreeNode]:
    """
    Template 4: LCA using path comparison.
    Time: O(n), Space: O(h)
    """
    def find_path(root: TreeNode, target: TreeNode, path: List[TreeNode]) -> bool:
        if not root:
            return False
        
        path.append(root)
        
        if root == target:
            return True
        
        if find_path(root.left, target, path) or find_path(root.right, target, path):
            return True
        
        path.pop()
        return False
    
    path_p, path_q = [], []
    
    find_path(root, p, path_p)
    find_path(root, q, path_q)
    
    # Find last common node in both paths
    lca = None
    for i in range(min(len(path_p), len(path_q))):
        if path_p[i] == path_q[i]:
            lca = path_p[i]
        else:
            break
    
    return lca
```

### Template 5: Binary Lifting LCA (Multiple Queries)

```python
class BinaryLiftingLCA:
    """
    Template 5: LCA with O(n log n) preprocessing and O(log n) per query.
    """
    
    def __init__(self, root: TreeNode):
        self.n = self._count_nodes(root)
        self.LOG = (self.n).bit_length()
        
        # Depth of each node
        self.depth = {}
        
        # Binary lifting table: up[node][k] = 2^k ancestor
        self.up = {}
        
        # Node ID mapping
        self.node_to_id = {}
        self._assign_ids(root)
        self._dfs(root, 0, None)
    
    def _count_nodes(self, root: TreeNode) -> int:
        if not root:
            return 0
        return 1 + self._count_nodes(root.left) + self._count_nodes(root.right)
    
    def _assign_ids(self, node: TreeNode):
        if not node:
            return
        self.node_to_id[node] = len(self.node_to_id)
        self._assign_ids(node.left)
        self._assign_ids(node.right)
    
    def _dfs(self, node: TreeNode, d: int, parent: Optional[TreeNode]):
        if not node:
            return
        
        node_id = self.node_to_id[node]
        self.depth[node_id] = d
        
        parent_id = self.node_to_id.get(parent, -1) if parent else -1
        
        if node_id not in self.up:
            self.up[node_id] = [-1] * self.LOG
        self.up[node_id][0] = parent_id
        
        for k in range(1, self.LOG):
            if self.up[node_id][k-1] != -1:
                self.up[node_id][k] = self.up[self.up[node_id][k-1]][k-1]
        
        self._dfs(node.left, d + 1, node)
        self._dfs(node.right, d + 1, node)
    
    def lca(self, u: TreeNode, v: TreeNode) -> TreeNode:
        """Find LCA of nodes u and v in O(log n)."""
        u_id = self.node_to_id[u]
        v_id = self.node_to_id[v]
        
        # Ensure u is deeper
        if self.depth[u_id] < self.depth[v_id]:
            u_id, v_id = v_id, u_id
        
        # Lift u to depth of v
        diff = self.depth[u_id] - self.depth[v_id]
        for k in range(self.LOG):
            if diff & (1 << k):
                u_id = self.up[u_id][k]
        
        if u_id == v_id:
            # Find node by ID
            for node, node_id in self.node_to_id.items():
                if node_id == u_id:
                    return node
        
        # Lift both nodes together
        for k in range(self.LOG - 1, -1, -1):
            if self.up[u_id][k] != self.up[v_id][k]:
                u_id = self.up[u_id][k]
                v_id = self.up[v_id][k]
        
        # Find parent by ID
        parent_id = self.up[u_id][0]
        for node, node_id in self.node_to_id.items():
            if node_id == parent_id:
                return node
        
        return None
```

---

## When to Use

Use the Lowest Common Ancestor algorithm when you need to solve problems involving:

- **Tree Ancestor Queries**: Finding the common parent of two nodes in a hierarchy
- **Path-Related Problems**: When paths from root to nodes need to be compared
- **Hierarchical Relationships**: Managing parent-child or ancestor-descendant relationships
- **Binary Search Trees**: Leveraging BST properties for efficient lookups
- **Graph Relationships**: Finding nearest common ancestor in any tree structure

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Naive Recursion** | O(n) | O(h) | Simple cases, small trees |
| **Path Comparison** | O(n) | O(h) | When parent pointers unavailable |
| **Parent + HashSet** | O(h) | O(h) | When parent pointers exist |
| **Binary Lifting** | O(n log n) build, O(log n) query | O(n log n) | Multiple LCA queries |
| **BST Optimization** | O(h) | O(1) | Binary Search Trees only |
| **Euler Tour + RMQ** | O(n) build, O(1) query | O(n) | Many queries, static tree |

### When to Choose Each Approach

- **Choose Naive Recursion** when:
  - Tree is small and simple
  - Only single LCA query needed
  - Code simplicity is preferred

- **Choose Binary Lifting** when:
  - Multiple LCA queries on same tree
  - Preprocessing time is acceptable
  - Need O(log n) per query

- **Choose BST Optimization** when:
  - Working with Binary Search Tree
  - Need O(h) time complexity
  - Can leverage ordered property

- **Choose Euler Tour + RMQ** when:
  - Many LCA queries needed
  - Tree structure is static
  - Need O(1) query time

---

## Algorithm Explanation

### Core Concept

The key insight behind finding the Lowest Common Ancestor is understanding that the LCA is the point where the paths from the root to each target node diverge. Before this point, both nodes share the same ancestors; after this point, they are in different subtrees.

**Key Insight:** If we traverse from both nodes upward, they will first meet at their lowest common ancestor. This is because:
- Each node is its own ancestor
- Moving upward from any node eventually reaches the root
- The first common node encountered is the deepest (lowest) one

### How It Works

#### Recursive Approach:
1. Start at the root
2. If current node is null, one of targets, or equals either target → return current
3. Recurse on left subtree to find LCA of targets
4. Recurse on right subtree to find LCA of targets
5. If both left and right return non-null, current node is LCA
6. Otherwise, return whichever is non-null

#### Path Comparison Approach:
1. Find path from root to first node
2. Find path from root to second node
3. Compare paths to find the last common node

#### Binary Lifting Approach:
1. Precompute 2^k ancestors for each node
2. Lift both nodes to same depth
3. Lift both nodes together until they meet
4. The meeting point is the LCA

### Visual Representation

For the tree:
```
        3
       / \
      5   1
     / \/ \
    6  2 0  8
      / \
     7   4
```

Finding LCA of nodes 5 and 1:
- Path to 5: 3 → 5
- Path to 1: 3 → 1
- Common ancestors: {3}
- LCA = 3

Finding LCA of nodes 5 and 4:
- Path to 5: 3 → 5
- Path to 4: 3 → 5 → 2 → 4
- Common ancestors: {3, 5}
- LCA = 5 (lowest/deepest)

### Why the Recursive Approach Works

The recursive solution leverages the tree structure:
- If both p and q are in the left subtree, the left recursion returns their LCA
- If both are in the right subtree, the right recursion returns their LCA
- If they're in different subtrees, the current node is where paths diverge → LCA
- If current node is one of the targets, it's an ancestor of the other → LCA

### Special Case - Binary Search Trees

For BSTs, we can use the ordering property:
- If both p and q are less than current, LCA is in left subtree
- If both p and q are greater than current, LCA is in right subtree
- Otherwise, current is the LCA (p and q are on different sides)

### Limitations

- **Recursive depth**: May hit stack overflow for very deep trees
- **Preprocessing cost**: Binary lifting requires O(n log n) setup
- **Node identity**: Solutions assume we can compare node objects directly
- **Tree structure**: Assumes valid tree structure (no cycles)

---

## Practice Problems

### Problem 1: Lowest Common Ancestor of a Binary Tree

**Problem:** [LeetCode 236 - Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

**Description:** Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

**How to Apply LCA:**
- Use recursive approach: check if nodes are in left/right subtrees
- If both subtrees return non-null, current is LCA
- Otherwise return non-null result

---

### Problem 2: Lowest Common Ancestor of a Binary Search Tree

**Problem:** [LeetCode 235 - Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

**Description:** Given a binary search tree (BST), find the LCA of two given nodes.

**How to Apply LCA:**
- Leverage BST property: left < root < right
- If both values < root, go left
- If both values > root, go right
- Else current is LCA

---

### Problem 3: Smallest Subtree with all the Deepest Nodes

**Problem:** [LeetCode 865 - Smallest Subtree with all the Deepest Nodes](https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/)

**Description:** Given the root of a binary tree, return the smallest subtree that contains all the deepest nodes.

**How to Apply LCA:**
- Find all deepest nodes (maximum depth leaves)
- If only one, return it
- Otherwise, LCA of all deepest nodes is the answer

---

### Problem 4: Lowest Common Ancestor of Deepest Leaves

**Problem:** [LeetCode 1123 - Lowest Common Ancestor of Deepest Leaves](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/)

**Description:** Find the LCA of all deepest leaves in a binary tree.

**How to Apply LCA:**
- Compute depth of each subtree
- If left and right have same depth, current is LCA
- Otherwise recurse into deeper subtree

---

### Problem 5: K-th Ancestor of a Tree Node

**Problem:** [LeetCode 1483 - K-th Ancestor of a Tree Node](https://leetcode.com/problems/k-th-ancestor-of-a-tree-node/)

**Description:** You are given a tree with n nodes numbered from 0 to n-1. Implement the function getKthAncestor.

**How to Apply LCA:**
- Use binary lifting technique
- Preprocess 2^k ancestors for each node
- Answer queries in O(log n) by combining powers of 2

---

## Video Tutorial Links

### Fundamentals

- [Lowest Common Ancestor (Take U Forward)](https://www.youtube.com/watch?v=8QfReJz5W0E) - Comprehensive explanation
- [LCA in Binary Tree](https://www.youtube.com/watch?v=13m9ZCB8gjw) - Recursive approach
- [LCA in BST](https://www.youtube.com/watch?v=kulWKd3BUZM) - BST optimization

### Advanced Techniques

- [Binary Lifting for LCA](https://www.youtube.com/watch?v=qqPD3xorTJI) - Multiple query optimization
- [LCA using Euler Tour and RMQ](https://www.youtube.com/watch?v=9V7UOXhwsP0) - Advanced technique
- [K-th Ancestor using Binary Lifting](https://www.youtube.com/watch?v=dE1B2tX0Z1Q) - Extension technique

### Problem Solutions

- [LCA LeetCode Solutions (NeetCode)](https://www.youtube.com/watch?v=1K-JSeq-5xs) - Practical problem solving
- [Tree Ancestor Problems](https://www.youtube.com/watch?v=2gA3Ezm3POk) - Common patterns

---

## Follow-up Questions

### Q1: What is the difference between LCA approaches for single query vs multiple queries?

**Answer:** 
- **Single query**: Recursive approach is simplest (O(n) time, O(h) space)
- **Multiple queries**: Binary lifting is better (O(n log n) preprocessing, O(log n) per query)
- **Many queries on static tree**: Euler Tour + RMQ (O(n) preprocessing, O(1) per query)

Choose based on query frequency and tree mutability.

---

### Q2: How do you handle LCA when nodes might not exist in the tree?

**Answer:** Add validation before LCA computation:
```python
def lca_with_validation(root, p, q):
    # First check if both nodes exist
    def exists(node, target):
        if not node:
            return False
        return node == target or exists(node.left, target) or exists(node.right, target)
    
    if not exists(root, p) or not exists(root, q):
        return None
    
    return lowest_common_ancestor(root, p, q)
```

---

### Q3: Can you find LCA without parent pointers in O(1) space?

**Answer:** Yes, using the recursive approach with tail recursion optimization (though Python doesn't optimize tail recursion). The Morris traversal approach can also be adapted but is complex. For practical purposes, O(h) space is generally acceptable.

---

### Q4: How does LCA help in finding distance between two nodes?

**Answer:** Distance can be computed using depths:
```
distance(u, v) = depth(u) + depth(v) - 2*depth(LCA(u, v))
```

The LCA is the meeting point, so paths from u to LCA and v to LCA don't overlap except at LCA.

---

### Q5: What's the difference between recursive and iterative LCA for BST?

**Answer:** 
- **Recursive**: O(h) time, O(h) stack space, cleaner code
- **Iterative**: O(h) time, O(1) space, no recursion overhead

For BSTs, both are straightforward. Choose iterative when stack depth is a concern or for production code requiring guaranteed O(1) space.

---

## Summary

The Lowest Common Ancestor problem is a fundamental tree algorithm with multiple solution approaches. Key takeaways:

- **Recursive approach**: Simple and intuitive, O(n) time, O(h) space
- **BST optimization**: O(h) time, O(1) space using BST property
- **Binary lifting**: O(n log n) preprocessing, O(log n) query - best for multiple queries
- **Parent pointers**: O(h) time, O(h) space - when nodes have parent refs
- **Path comparison**: O(n) time, O(h) space - works without parent refs

When to use:
- ✅ Ancestor queries in trees
- ✅ Path-related problems
- ✅ Distance between nodes
- ✅ Hierarchical relationship queries

When NOT to use:
- ❌ Graphs with cycles (not trees)
- ❌ When only ancestor/descendant check needed (use simpler checks)

This algorithm is essential for competitive programming and technical interviews, appearing frequently in tree-related problems.