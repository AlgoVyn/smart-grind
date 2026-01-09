# Graph Valid Tree

## Problem Description

Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if the edges form a valid tree.

A tree is a connected graph with no cycles and has exactly n-1 edges.

### Examples

**Example 1:**

- **Input:** `n = 5`, `edges = [[0,1],[0,2],[0,3],[1,4]]`
- **Output:** `true`

**Example 2:**

- **Input:** `n = 5`, `edges = [[0,1],[1,2],[2,3],[1,3]]`
- **Output:** `false`

### Constraints

- `1 <= n <= 10^4`
- `0 <= edges.length <= 10^4`
- `edges[i].length == 2`
- `0 <= ui, vi < n`
- No self-loops or multiple edges

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
