# Min Cost to Connect All Points

## Problem Description

You are given an array `points` representing integer coordinates of points on a 2D plane, where `points[i] = [x_i, y_i]`.

The **cost** of connecting two points `[x_i, y_i]` and `[x_j, y_j]` is the **Manhattan distance** between them:

```
cost = |x_i - x_j| + |y_i - y_j|
```

Return the **minimum cost** to make all points connected, where all points are connected if there is **exactly one simple path** between any two points.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `points = [[0,0],[2,2],[3,10],[5,2],[7,0]]` | `20` |

**Explanation:** Connect points using the Minimum Spanning Tree (MST) to achieve minimum cost of 20.

**Example 2:**

| Input | Output |
|-------|--------|
| `points = [[3,12],[-2,5],[-4,1]]` | `18` |

## Constraints

- `1 <= points.length <= 1000`
- `-10^6 <= x_i, y_i <= 10^6`
- All pairs `(x_i, y_i)` are distinct

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
        heap = [(0, 0)]  # (cost, point_index)
        total_cost = 0
        edges_used = 0
        
        while edges_used < n:
            cost, u = heapq.heappop(heap)
            
            if visited[u]:
                continue
            
            visited[u] = True
            total_cost += cost
            edges_used += 1
            
            # Add edges from u to all unvisited points
            for v in range(n):
                if not visited[v]:
                    dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                    heapq.heappush(heap, (dist, v))
        
        return total_cost
```

## Explanation

This problem is solved using **Prim's Algorithm** to construct the Minimum Spanning Tree (MST):

1. **Initialize**:
   - `visited` array to track connected points
   - Min-heap for edges `(cost, point)` starting with point 0
   - `total_cost = 0`, `edges_used = 0`

2. **Main loop** (until all points are connected):
   - Extract the edge with the smallest cost from the heap
   - If the target point is unvisited:
     - Mark it as visited
     - Add the cost to `total_cost`
     - Increment `edges_used`
     - Add all edges from this point to unvisited points to the heap

3. Return `total_cost`, which is the minimum cost to connect all points.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n^2 log n)` — up to `n^2` edges, each heap operation is `O(log n)` |
| Space | `O(n^2)` — heap stores edges (can be optimized to `O(n)`) |
