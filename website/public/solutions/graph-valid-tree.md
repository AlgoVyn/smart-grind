# Graph Valid Tree

## Problem Description
[Link to problem](https://leetcode.com/problems/graph-valid-tree/)

## Solution

```python
from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        parent = list(range(n))
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        def union(x, y):
            px, py = find(x), find(y)
            if px == py:
                return False
            parent[px] = py
            return True
        for a, b in edges:
            if not union(a, b):
                return False
        return True
```

## Explanation
This problem checks if a graph with n nodes and given edges is a valid tree (connected and acyclic).

A tree has exactly n-1 edges.

Use Union-Find: initialize each node as its own parent.

For each edge, find parents; if same, cycle; else union.

If all unions succeed and edge count correct, it's a tree.

**Time Complexity:** O(n), with path compression.

**Space Complexity:** O(n) for parent array.
