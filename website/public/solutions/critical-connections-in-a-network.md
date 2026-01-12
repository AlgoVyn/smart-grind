# Critical Connections In A Network

## Problem Description
There are n servers numbered from 0 to n - 1 connected by undirected server-to-server connections forming a network where connections[i] = [ai, bi] represents a connection between servers ai and bi. Any server can reach other servers directly or indirectly through the network.
A critical connection is a connection that, if removed, will make some servers unable to reach some other server.
Return all critical connections in the network in any order.
 
**Example 1:**
**Input:**
```python
n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
```
**Output:**
```python
[[1,3]]
```
**Explanation:** [[3,1]] is also accepted.

**Example 2:**
**Input:**
```python
n = 2, connections = [[0,1]]
```
**Output:**
```python
[[0,1]]
```

 
Constraints:

2 <= n <= 105
n - 1 <= connections.length <= 105
0 <= ai, bi <= n - 1
ai != bi
There are no repeated connections.

---

## Solution

```python
from typing import List
from collections import defaultdict

class Solution:
    def criticalConnections(self, n: int, connections: List[List[int]]) -> List[List[int]]:
        graph = defaultdict(list)
        for a, b in connections:
            graph[a].append(b)
            graph[b].append(a)
        
        disc = [-1] * n
        low = [-1] * n
        parent = [-1] * n
        time = 0
        bridges = []
        
        def dfs(curr):
            nonlocal time
            disc[curr] = low[curr] = time
            time += 1
            for nei in graph[curr]:
                if disc[nei] == -1:
                    parent[nei] = curr
                    dfs(nei)
                    low[curr] = min(low[curr], low[nei])
                    if low[nei] > disc[curr]:
                        bridges.append([curr, nei])
                elif nei != parent[curr]:
                    low[curr] = min(low[curr], disc[nei])
        
        for i in range(n):
            if disc[i] == -1:
                dfs(i)
        
        return bridges
```

---

## Explanation
Critical connections (bridges) are edges whose removal increases the number of connected components. Use Tarjan's algorithm with DFS.

1. Build the undirected graph.
2. Use DFS with discovery time (disc) and low value (lowest discovery time reachable).
3. For each edge curr -> nei, if low[nei] > disc[curr], it's a bridge.
4. Collect all such edges.

---

## Time Complexity
**O(V + E)**, where V is n and E is connections.

---

## Space Complexity
**O(V + E)**, for graph and arrays.
