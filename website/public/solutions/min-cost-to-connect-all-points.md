# Min Cost To Connect All Points

## Problem Description
You are given an array points representing integer coordinates of some points on a 2D-plane, where points[i] = [xi, yi].
The cost of connecting two points [xi, yi] and [xj, yj] is the manhattan distance between them: |xi - xj| + |yi - yj|, where |val| denotes the absolute value of val.
Return the minimum cost to make all points connected. All points are connected if there is exactly one simple path between any two points.
 
Example 1:
Input: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
Output: 20
Explanation: 

We can connect the points as shown above to get the minimum cost of 20.
Notice that there is a unique path between every pair of points.

Example 2:

Input: points = [[3,12],[-2,5],[-4,1]]
Output: 18

 
Constraints:

1 <= points.length <= 1000
-106 <= xi, yi <= 106
All pairs (xi, yi) are distinct.
## Solution

```python
from typing import List
import heapq

class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        if n == 1:
            return 0
        visited = [False] * n
        heap = [(0, 0)]  # (cost, point)
        total_cost = 0
        edges_used = 0
        while edges_used < n:
            cost, u = heapq.heappop(heap)
            if visited[u]:
                continue
            visited[u] = True
            total_cost += cost
            edges_used += 1
            for v in range(n):
                if not visited[v]:
                    dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                    heapq.heappush(heap, (dist, v))
        return total_cost
```

## Explanation
This problem is solved using Prim's algorithm to construct the Minimum Spanning Tree (MST) for the points, where edges are weighted by Manhattan distance.

1. Initialize a visited array to track connected points, a min-heap for edges (cost, point), and start with point 0 with cost 0.
2. While not all points are connected, extract the edge with the smallest cost from the heap.
3. If the target point is not visited, mark it visited, add the cost to total, and add all edges from this point to unvisited points to the heap.
4. Continue until all points are connected.
5. The total cost accumulated is the minimum cost to connect all points.

Time complexity: O(n^2 log n), where n is the number of points, due to heap operations for up to n^2 edges.
Space complexity: O(n^2), for the heap storing edges.
