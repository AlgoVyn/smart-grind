# Minimum Weighted Subgraph With The Required Paths

## Problem Description

You are given an integer `n` denoting the number of nodes of a weighted directed graph. The nodes are numbered from `0` to `n - 1`.

You are also given a 2D integer array `edges` where `edges[i] = [fromi, toi, weighti]` denotes that there exists a directed edge from `fromi` to `toi` with weight `weighti`.

Lastly, you are given three distinct integers `src1`, `src2`, and `dest` denoting three distinct nodes of the graph.

Return the minimum weight of a subgraph of the graph such that it is possible to reach `dest` from both `src1` and `src2` via a set of edges of this subgraph. In case such a subgraph does not exist, return `-1`.

A subgraph is a graph whose vertices and edges are subsets of the original graph. The weight of a subgraph is the sum of weights of its constituent edges.

---

## Examples

### Example 1

**Input:**
```python
n = 6
edges = [[0, 2, 2], [0, 5, 6], [1, 0, 3], [1, 4, 5], [2, 1, 1], [2, 3, 3], [2, 3, 4], [3, 4, 2], [4, 5, 1]]
src1 = 0, src2 = 1, dest = 5
```

**Output:**
```python
9
```

**Explanation:**
The above figure represents the input graph. The blue edges represent one of the subgraphs that yield the optimal answer.

### Example 2

**Input:**
```python
n = 3
edges = [[0, 1, 1], [2, 1, 1]]
src1 = 0, src2 = 1, dest = 2
```

**Output:**
```python
-1
```

**Explanation:**
It can be seen that there does not exist any path from node 1 to node 2, hence there are no subgraphs satisfying all the constraints.

---

## Constraints

- `3 <= n <= 10^5`
- `0 <= edges.length <= 10^5`
- `edges[i].length == 3`
- `0 <= fromi, toi, src1, src2, dest <= n - 1`
- `fromi != toi`
- `src1`, `src2`, and `dest` are pairwise distinct
- `1 <= weight[i] <= 10^5`

---

## Solution

```python
import heapq
from typing import List

class Solution:
    def minimumWeight(self, n: int, edges: List[List[int]], src1: int, src2: int, dest: int) -> int:
        """
        Find minimum weight subgraph using three Dijkstra runs.
        
        Compute shortest paths from src1, src2 to all nodes,
        and from dest to all nodes (using reversed graph).
        """
        def dijkstra(graph, start):
            """Run Dijkstra's algorithm from a start node."""
            dist = [float('inf')] * n
            dist[start] = 0
            pq = [(0, start)]
            
            while pq:
                d, u = heapq.heappop(pq)
                if d > dist[u]:
                    continue
                for v, w in graph[u]:
                    if dist[v] > dist[u] + w:
                        dist[v] = dist[u] + w
                        heapq.heappush(pq, (dist[v], v))
            return dist
        
        # Build forward and reverse graphs
        graph = [[] for _ in range(n)]
        rev_graph = [[] for _ in range(n)]
        for u, v, w in edges:
            graph[u].append((v, w))
            rev_graph[v].append((u, w))
        
        # Run Dijkstra from src1, src2, and dest
        dist1 = dijkstra(graph, src1)
        dist2 = dijkstra(graph, src2)
        dist_dest = dijkstra(rev_graph, dest)
        
        # Find minimum total weight at any meeting node
        ans = float('inf')
        for x in range(n):
            if dist1[x] != float('inf') and dist2[x] != float('inf') and dist_dest[x] != float('inf'):
                ans = min(ans, dist1[x] + dist2[x] + dist_dest[x])
        
        return ans if ans != float('inf') else -1
```

---

## Explanation

This problem requires finding the minimum weight subgraph that allows paths from `src1` and `src2` to `dest`.

### Algorithm Steps

1. **Shortest paths**: Compute shortest distances from:
   - `src1` to all nodes
   - `src2` to all nodes
   - `dest` to all nodes (using reversed edges)

2. **Meeting node**: For each possible meeting node `x`:
   - Total weight = `dist_src1[x] + dist_src2[x] + dist_dest[x]`

3. **Return minimum**: The minimum among these is the answer (if all paths exist).

---

## Complexity Analysis

- **Time Complexity:** O((V + E) log V), due to three Dijkstra runs
- **Space Complexity:** O(V + E), for graphs and distance arrays
