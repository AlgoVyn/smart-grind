# Minimum Height Trees

## Problem Description

A tree is an undirected graph in which any two vertices are connected by exactly one path. In other words, any connected graph without simple cycles is a tree.

Given a tree of `n` nodes labelled from `0` to `n - 1`, and an array of `n - 1` edges where `edges[i] = [ai, bi]` indicates that there is an undirected edge between the two nodes `ai` and `bi` in the tree, you can choose any node of the tree as the root. When you select a node `x` as the root, the result tree has height `h`. Among all possible rooted trees, those with minimum height (i.e., min(h)) are called minimum height trees (MHTs).

Return a list of all MHTs' root labels. You can return the answer in any order.

The height of a rooted tree is the number of edges on the longest downward path between the root and a leaf.

---

## Examples

### Example 1

**Input:**
```python
n = 4, edges = [[1, 0], [1, 2], [1, 3]]
```

**Output:**
```python
[1]
```

**Explanation:**
As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT.

### Example 2

**Input:**
```python
n = 6, edges = [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]
```

**Output:**
```python
[3, 4]
```

---

## Constraints

- `1 <= n <= 2 * 10^4`
- `edges.length == n - 1`
- `0 <= ai, bi < n`
- `ai != bi`
- All the pairs `(ai, bi)` are distinct
- The given input is guaranteed to be a tree and there will be no repeated edges

---

## Solution

```python
from typing import List

class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        """
        Find the minimum height trees by iteratively removing leaves.
        
        The roots of MHTs are at the center(s) of the tree.
        """
        if n == 1:
            return [0]
        
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        # Find initial leaves (nodes with degree 1)
        leaves = [i for i in range(n) if len(graph[i]) == 1]
        remaining = n
        
        # Iteratively remove leaves until 1 or 2 nodes remain
        while remaining > 2:
            new_leaves = []
            for leaf in leaves:
                # Remove leaf from its neighbor's adjacency list
                for nei in graph[leaf]:
                    graph[nei].remove(leaf)
                    if len(graph[nei]) == 1:
                        new_leaves.append(nei)
            remaining -= len(leaves)
            leaves = new_leaves
        
        return leaves
```

---

## Explanation

The minimum height trees have their roots at the center(s) of the tree. We find the centers by iteratively removing leaves until 1 or 2 nodes remain.

1. **Build adjacency list**: Create a graph representation from the edges.

2. **Identify initial leaves**: Find all nodes with degree 1.

3. **Iterative leaf removal**: While more than 2 nodes remain:
   - Remove current leaves and update degrees
   - Collect new leaves (nodes that become degree 1)

4. **Return remaining nodes**: The remaining nodes (1 or 2) are the roots of MHTs.

---

## Complexity Analysis

- **Time Complexity:** O(n), as each node and edge is processed a constant number of times
- **Space Complexity:** O(n), for the graph and queue
