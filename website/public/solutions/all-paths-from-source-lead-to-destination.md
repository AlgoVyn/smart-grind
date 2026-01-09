# All Paths From Source Lead To Destination

## Problem Description

Given a directed acyclic graph (DAG) with `n` nodes labeled from `0` to `n-1`, determine if all paths starting from the `source` node lead to the `destination` node. A path is considered valid if it ends at the destination node and does not contain any cycles.

Return `true` if all paths from the source lead to the destination, otherwise return `false`.

---

## Solution

```python
from typing import List

class Solution:
    def leadsToDestination(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
        
        visited = [0] * n  # 0: not visited, 1: visiting, 2: visited
        
        def dfs(node):
            if visited[node] == 1:
                return False  # cycle detected
            if visited[node] == 2:
                return True
            if not graph[node]:
                return node == destination
            
            visited[node] = 1
            for nei in graph[node]:
                if not dfs(nei):
                    return False
            visited[node] = 2
            return True
        
        return dfs(source)
```

---

## Explanation

This problem requires checking if all paths starting from the source node in a directed graph eventually lead to the destination node, with no cycles present.

We build an adjacency list from the edges. Then, perform a DFS traversal starting from the source, using a visited array with three states: `0` (not visited), `1` (visiting), and `2` (visited). This helps detect cycles and memoize results.

In the DFS function:
- If the node is currently being visited (state 1), there's a cycle, return False.
- If already visited (state 2), return True (assuming it was valid).
- If the node has no outgoing edges, check if it's the destination.
- Otherwise, mark as visiting, recurse on neighbors, and if any neighbor path fails, return False.
- After processing all neighbors, mark as visited and return True.

The DFS ensures all paths from source are explored, and any invalid path (cycle or dead end not at destination) causes the function to return False.

**Time Complexity:** O(N + E), where N is the number of nodes and E is the number of edges, as each node and edge is visited at most once.

**Space Complexity:** O(N) for the graph, visited array, and recursion stack.
