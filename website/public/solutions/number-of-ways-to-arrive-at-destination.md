# Number Of Ways To Arrive At Destination

## Problem Description
You are in a city that consists of n intersections numbered from 0 to n - 1 with bi-directional roads between some intersections. The inputs are generated such that you can reach any intersection from any other intersection and that there is at most one road between any two intersections.
You are given an integer n and a 2D integer array roads where roads[i] = [ui, vi, timei] means that there is a road between intersections ui and vi that takes timei minutes to travel. You want to know in how many ways you can travel from intersection 0 to intersection n - 1 in the shortest amount of time.
Return the number of ways you can arrive at your destination in the shortest amount of time. Since the answer may be large, return it modulo 109 + 7.
 
Example 1:
Input: n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]
Output: 4
Explanation: The shortest amount of time it takes to go from intersection 0 to intersection 6 is 7 minutes.
The four ways to get there in 7 minutes are:
- 0 ➝ 6
- 0 ➝ 4 ➝ 6
- 0 ➝ 1 ➝ 2 ➝ 5 ➝ 6
- 0 ➝ 1 ➝ 3 ➝ 5 ➝ 6

Example 2:

Input: n = 2, roads = [[1,0,10]]
Output: 1
Explanation: There is only one way to go from intersection 0 to intersection 1, and it takes 10 minutes.

 
Constraints:

1 <= n <= 200
n - 1 <= roads.length <= n * (n - 1) / 2
roads[i].length == 3
0 <= ui, vi <= n - 1
1 <= timei <= 109
ui != vi
There is at most one road connecting any two intersections.
You can reach any intersection from any other intersection.
## Solution

```python
import heapq

class Solution:
    def countPaths(self, n: int, roads: List[List[int]]) -> int:
        MOD = 10**9 + 7
        graph = [[] for _ in range(n)]
        for u, v, t in roads:
            graph[u].append((v, t))
            graph[v].append((u, t))
        
        dist = [float('inf')] * n
        ways = [0] * n
        dist[0] = 0
        ways[0] = 1
        pq = [(0, 0)]  # (distance, node)
        
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, t in graph[u]:
                if dist[v] > d + t:
                    dist[v] = d + t
                    ways[v] = ways[u]
                    heapq.heappush(pq, (dist[v], v))
                elif dist[v] == d + t:
                    ways[v] = (ways[v] + ways[u]) % MOD
        
        return ways[n - 1]
```

## Explanation
We need to find the number of ways to reach node n-1 from node 0 in the shortest time. We use Dijkstra's algorithm modified to count ways.

Step-by-step approach:
1. Build an adjacency list from the roads.
2. Initialize distance array to infinity, ways array to 0, set dist[0] = 0, ways[0] = 1.
3. Use a priority queue for Dijkstra, starting with (0, 0).
4. While the queue is not empty:
   - Pop the node with smallest distance.
   - For each neighbor, if a shorter path is found, update distance and set ways to current node's ways.
   - If the distance is equal, add the current node's ways to the neighbor's ways (modulo 10^9+7).
5. Return ways[n-1].

Time Complexity: O((V + E) log V), where V is n, E is number of roads, due to priority queue operations.
Space Complexity: O(V + E) for graph, dist, ways, and priority queue.
