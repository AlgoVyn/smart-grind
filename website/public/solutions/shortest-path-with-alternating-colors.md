# Shortest Path With Alternating Colors

## Problem Description
You are given an integer n, the number of nodes in a directed graph where the nodes are labeled from 0 to n - 1. Each edge is red or blue in this graph, and there could be self-edges and parallel edges.
You are given two arrays redEdges and blueEdges where:

redEdges[i] = [ai, bi] indicates that there is a directed red edge from node ai to node bi in the graph, and
blueEdges[j] = [uj, vj] indicates that there is a directed blue edge from node uj to node vj in the graph.

Return an array answer of length n, where each answer[x] is the length of the shortest path from node 0 to node x such that the edge colors alternate along the path, or -1 if such a path does not exist.
 
Example 1:

Input: n = 3, redEdges = [[0,1],[1,2]], blueEdges = []
Output: [0,1,-1]

Example 2:

Input: n = 3, redEdges = [[0,1]], blueEdges = [[2,1]]
Output: [0,1,-1]

 
Constraints:

1 <= n <= 100
0 <= redEdges.length, blueEdges.length <= 400
redEdges[i].length == blueEdges[j].length == 2
0 <= ai, bi, uj, vj < n
## Solution

```python
from typing import List
from collections import deque

class Solution:
    def shortestAlternatingPaths(self, n: int, redEdges: List[List[int]], blueEdges: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(n)]
        for u, v in redEdges:
            graph[u].append((v, 0))  # 0 for red
        for u, v in blueEdges:
            graph[u].append((v, 1))  # 1 for blue
        
        dist = [-1] * n
        dist[0] = 0
        queue = deque([(0, -1)])  # node, last color (-1 for start)
        visited = set()
        visited.add((0, -1))
        
        while queue:
            node, last_color = queue.popleft()
            for nei, color in graph[node]:
                if color != last_color and (nei, color) not in visited:
                    visited.add((nei, color))
                    if dist[nei] == -1:
                        dist[nei] = dist[node] + 1
                    queue.append((nei, color))
        
        return dist
```

## Explanation
Build a graph where each edge has a color (0 red, 1 blue). Use BFS with state (node, last_color) to ensure alternating colors. Track visited as (node, color) to avoid cycles with same color. Update distance when first reaching a node. Start with last_color -1 for node 0.

**Time Complexity:** O(n + e), where e is number of edges, as each node-color pair is visited once.

**Space Complexity:** O(n + e), for graph and visited set.
