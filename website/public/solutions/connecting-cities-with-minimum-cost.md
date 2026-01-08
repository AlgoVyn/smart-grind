# Connecting Cities With Minimum Cost

## Problem Description
[Link to problem](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)

## Solution
```python
from typing import List

class Solution:
    def minimumCost(self, n: int, connections: List[List[int]]) -> int:
        connections.sort(key=lambda x: x[2])
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
This solution uses Kruskal's algorithm for Minimum Spanning Tree. Sort connections by cost. Use union-find to add edges without cycles, accumulating cost. If we connect all cities (n-1 edges), return cost; else -1.

Time Complexity: O(E log E), where E is the number of connections, due to sorting.

Space Complexity: O(n), for the parent array.
