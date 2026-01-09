# Connecting Cities With Minimum Cost

## Problem Description

> Given n cities and a list of connections between them with associated costs, find the minimum cost to connect all cities. If it's not possible, return -1.

## Solution

```python
from typing import List

class Solution:
    def minimumCost(self, n: int, connections: List[List[int]]) -> int:
        """
        Find the minimum cost to connect all cities.

        Args:
            n: Number of cities (1-indexed)
            connections: List of [city1, city2, cost] connections

        Returns:
            Minimum cost to connect all cities, or -1 if not possible
        """
        # Sort connections by cost (Kruskal's algorithm)
        connections.sort(key=lambda x: x[2])

        # Initialize Union-Find data structure
        parent = list(range(n + 1))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
                return True
            return False

        # Build Minimum Spanning Tree
        cost = 0
        edges = 0
        for u, v, w in connections:
            if union(u, v):
                cost += w
                edges += 1
                if edges == n - 1:
                    return cost

        return -1
```

## Explanation

### Algorithm: Kruskal's Algorithm

This solution uses Kruskal's algorithm to find the Minimum Spanning Tree (MST):

1. **Sort Edges**: Sort all connections by cost in ascending order.
2. **Union-Find**: Use the Union-Find (Disjoint Set Union) data structure to detect cycles.
3. **Build MST**: Iterate through sorted edges, adding them if they connect two previously disconnected components.
4. **Check Completion**: If we've added n-1 edges, we have a valid spanning tree.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | **O(E log E)** |
| Space | **O(n)** |

- **Time**: O(E log E) due to sorting, where E is the number of connections
- **Space**: O(n) for the parent array
