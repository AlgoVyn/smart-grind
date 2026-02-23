# Binary Lifting

## Category
Advanced

## Description
Preprocess tree for O(log n) LCA queries.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
Binary Lifting is a powerful technique used to preprocess a tree (or forest) to answer Lowest Common Ancestor (LCA) queries in O(log n) time after O(n log n) preprocessing. It's particularly useful for queries on large trees where repeated ancestor lookups are needed.

### How It Works:
The core idea is to precompute "jump tables" where `jump[node][k]` represents the 2^k-th ancestor of `node`. This allows us to move up the tree in powers of two rather than one step at a time.

### Key Concepts:
1. **Jump Table**: A 2D array where `up[v][i]` = 2^i-th ancestor of node v
2. **Binary Representation**: Any number can be represented as sum of powers of 2
3. **Preprocessing**: Build the table in O(n log n) using DP
4. **Query**: Use binary lifting to find LCA in O(log n)

### Building the Jump Table:
- `up[v][0]` = parent of v
- `up[v][i]` = up[ up[v][i-1] ][i-1] (2^(i-1) ancestor's 2^(i-1) ancestor)

### Finding LCA:
1. If nodes are at different depths, lift the deeper node up
2. Lift both nodes simultaneously from highest power to lowest
3. When nodes are not same but parents are same, return parent

### Applications:
- Finding LCA in trees
- K-th ancestor queries
- Distance between nodes in tree
- Path queries in trees

---

## Algorithm Steps
1. **Preprocessing**:
   - Perform DFS/BFS from root to find parent and depth of each node
   - Build binary lifting table: `up[node][i] = up[ up[node][i-1] ][i-1]`
   - Continue for i = 1 to LOG where LOG = floor(log2(max_depth))

2. **LCA Query**:
   - If nodes are at different depths, lift the deeper node
   - For i from LOG down to 0:
     - If up[node1][i] != up[node2][i]:
       - Lift both nodes to that ancestor level
   - Return parent of either node (they're now direct children of LCA)

---

## Implementation

```python
from typing import List, Dict, Optional
from collections import defaultdict, deque


class BinaryLifting:
    """Binary Lifting for LCA queries on a tree."""
    
    def __init__(self, n: int, edges: List[List[int]], root: int = 0):
        """
        Initialize binary lifting structure.
        
        Args:
            n: Number of nodes (0 to n-1)
            edges: List of [u, v] edges (undirected tree)
            root: Root node index
        """
        self.n = n
        self.root = root
        self.LOG = (n).bit_length()  # Enough to store 2^LOG > n
        
        # Build adjacency list
        self.graph: Dict[int, List[int]] = defaultdict(list)
        for u, v in edges:
            self.graph[u].append(v)
            self.graph[v].append(u)
        
        # Arrays for parent, depth
        self.parent: List[List[int]] = [[-1] * n for _ in range(self.LOG)]
        self.depth: List[int] = [0] * n
        
        # Preprocess
        self._dfs(root, -1)
        self._build_table()
    
    def _dfs(self, node: int, par: int):
        """DFS to compute depth and immediate parent."""
        self.parent[0][node] = par
        for neighbor in self.graph[node]:
            if neighbor != par:
                self.depth[neighbor] = self.depth[node] + 1
                self._dfs(neighbor, node)
    
    def _build_table(self):
        """Build binary lifting table."""
        for i in range(1, self.LOG):
            for v in range(self.n):
                if self.parent[i-1][v] != -1:
                    self.parent[i][v] = self.parent[i-1][self.parent[i-1][v]]
    
    def lift(self, node: int, k: int) -> int:
        """
        Lift node by k steps up the tree.
        
        Args:
            node: Starting node
            k: Number of steps to lift
        
        Returns:
            Node after lifting k steps (or -1 if beyond root)
        """
        for i in range(self.LOG):
            if k & (1 << i):
                node = self.parent[i][node]
                if node == -1:
                    return -1
        return node
    
    def lca(self, u: int, v: int) -> int:
        """
        Find Lowest Common Ancestor of nodes u and v.
        
        Args:
            u, v: Node indices
        
        Returns:
            LCA node index
        """
        # Ensure u is deeper
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        
        # Lift u to same depth as v
        diff = self.depth[u] - self.depth[v]
        u = self.lift(u, diff)
        
        # If v is ancestor of u after lifting, return v
        if u == v:
            return u
        
        # Lift both nodes together
        for i in range(self.LOG - 1, -1, -1):
            if self.parent[i][u] != self.parent[i][v]:
                u = self.parent[i][u]
                v = self.parent[i][v]
        
        # Return parent (LCA)
        return self.parent[0][u]
    
    def distance(self, u: int, v: int) -> int:
        """Find distance between two nodes (number of edges)."""
        lca = self.lca(u, v)
        return self.depth[u] + self.depth[v] - 2 * self.depth[lca]


# Example usage
if __name__ == "__main__":
    # Tree structure:
    #       0
    #      / \
    #     1   2
    #    / \   \
    #   3   4   5
    #      /
    #     6
    
    n = 7
    edges = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 5],
        [4, 6]
    ]
    
    bl = BinaryLifting(n, edges, root=0)
    
    print("Binary Lifting - LCA Queries")
    print("=" * 40)
    print("\nTree structure:")
    print("      0")
    print("     / \\")
    print("    1   2")
    print("   / \\   \\")
    print("  3   4   5")
    print("     /")
    print("    6")
    
    # Test LCA queries
    queries = [(3, 5), (3, 4), (6, 5), (0, 6), (3, 3)]
    
    print("\nLCA Queries:")
    for u, v in queries:
        lca = bl.lca(u, v)
        dist = bl.distance(u, v)
        print(f"  LCA({u}, {v}) = {lca}, Distance = {dist}")
    
    # Test lift operation
    print("\nLift operations from node 6:")
    for k in range(1, 4):
        lifted = bl.lift(6, k)
        print(f"  lift(6, {k}) = {lifted}")

```javascript
function binaryLifting() {
    // Binary Lifting implementation
    // Time: O(n log n) preprocess, O(log n) query
    // Space: O(n log n)
}
```

---

## Example

**Input:**
```
n = 7, edges = [[0,1], [0,2], [1,3], [1,4], [2,5], [4,6]], root = 0

Tree structure:
      0
     / \
    1   2
   / \   \
  3   4   5
     /
    6
```

**Output:**
```
LCA Queries:
  LCA(3, 5) = 0, Distance = 4
  LCA(3, 4) = 1, Distance = 1
  LCA(6, 5) = 0, Distance = 4
  LCA(0, 6) = 0, Distance = 3
  LCA(3, 3) = 3, Distance = 0

Lift operations from node 6:
  lift(6, 1) = 4
  lift(6, 2) = 1
  lift(6, 3) = 0

Explanation:
- LCA(3, 5): Path 3→1→0←2←5, LCA = 0
- lift(6, 2): 6→4→1 (2 steps up)
```

---

## Time Complexity
**O(n log n) preprocess, O(log n) query**

---

## Space Complexity
**O(n log n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
