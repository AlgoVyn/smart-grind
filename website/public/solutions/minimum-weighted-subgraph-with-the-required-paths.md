# Minimum Weighted Subgraph With The Required Paths

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/)

You are given an integer n denoting the number of nodes of a weighted directed graph. The nodes are numbered from 0 to n - 1.
You are also given a 2D integer array edges where edges[i] = [fromi, toi, weighti] denotes that there exists a directed edge from fromi to toi with weight weighti.
Lastly, you are given three distinct integers src1, src2, and dest denoting three distinct nodes of the graph.
Return the minimum weight of a subgraph of the graph such that it is possible to reach dest from both src1 and src2 via a set of edges of this subgraph. In case such a subgraph does not exist, return -1.
A subgraph is a graph whose vertices and edges are subsets of the original graph. The weight of a subgraph is the sum of weights of its constituent edges.
 
Example 1:


Input: n = 6, edges = [[0,2,2],[0,5,6],[1,0,3],[1,4,5],[2,1,1],[2,3,3],[2,3,4],[3,4,2],[4,5,1]], src1 = 0, src2 = 1, dest = 5
Output: 9
Explanation:
The above figure represents the input graph.
The blue edges represent one of the subgraphs that yield the optimal answer.
Note that the subgraph [[1,0,3],[0,5,6]] also yields the optimal answer. It is not possible to get a subgraph with less weight satisfying all the constraints.

Example 2:


Input: n = 3, edges = [[0,1,1],[2,1,1]], src1 = 0, src2 = 1, dest = 2
Output: -1
Explanation:
The above figure represents the input graph.
It can be seen that there does not exist any path from node 1 to node 2, hence there are no subgraphs satisfying all the constraints.

 
Constraints:

3 <= n <= 105
0 <= edges.length <= 105
edges[i].length == 3
0 <= fromi, toi, src1, src2, dest <= n - 1
fromi != toi
src1, src2, and dest are pairwise distinct.
1 <= weight[i] <= 105


## Solution

```python
import heapq
from typing import List

class Solution:
    def minimumWeight(self, n: int, edges: List[List[int]], src1: int, src2: int, dest: int) -> int:
        def dijkstra(graph, start):
            dist = [float('inf')] * n
            dist[start] = 0
            pq = [(0, start)]
            while pq:
                d, u = heapq.heappop(pq)
                if d > dist[u]: continue
                for v, w in graph[u]:
                    if dist[v] > dist[u] + w:
                        dist[v] = dist[u] + w
                        heapq.heappush(pq, (dist[v], v))
            return dist

        graph = [[] for _ in range(n)]
        rev_graph = [[] for _ in range(n)]
        for u, v, w in edges:
            graph[u].append((v, w))
            rev_graph[v].append((u, w))

        dist1 = dijkstra(graph, src1)
        dist2 = dijkstra(graph, src2)
        dist_dest = dijkstra(rev_graph, dest)

        ans = float('inf')
        for x in range(n):
            if dist1[x] != float('inf') and dist2[x] != float('inf') and dist_dest[x] != float('inf'):
                ans = min(ans, dist1[x] + dist2[x] + dist_dest[x])
        return ans if ans != float('inf') else -1
```

## Explanation
This problem requires finding the minimum weight subgraph that allows paths from src1 and src2 to dest.

Compute shortest distances from src1 to all nodes, src2 to all nodes, and dest to all nodes (using reversed edges).

For each possible meeting node x, calculate the total weight as dist_src1[x] + dist_src2[x] + dist_dest[x].

The minimum among these is the answer, as it represents the cost of paths from src1 to x, src2 to x, and x to dest.

If no such x exists, return -1.

**Time Complexity:** O((V + E) log V), due to three Dijkstra runs.
**Space Complexity:** O(V + E), for graphs and distance arrays.
