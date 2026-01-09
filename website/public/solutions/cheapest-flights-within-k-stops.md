# Cheapest Flights Within K Stops

## Problem Description
There are n cities connected by some number of flights. You are given an array flights where flights[i] = [fromi, toi, pricei] indicates that there is a flight from city fromi to city toi with cost pricei.
You are also given three integers src, dst, and k, return the cheapest price from src to dst with at most k stops. If there is no such route, return -1.

## Examples

**Example 1:**

**Input:**
```
n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
```

**Output:**
```
700
```

**Explanation:**
The graph is shown above.
The optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 + 600 = 700.
Note that the path through cities [0,1,2,3] is cheaper but is invalid because it uses 2 stops.

**Example 2:**

**Input:**
```
n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1
```

**Output:**
```
200
```

**Explanation:**
The graph is shown above.
The optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 + 100 = 200.

**Example 3:**

**Input:**
```
n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0
```

**Output:**
```
500
```

**Explanation:**
The graph is shown above.
The optimal path with no stops from city 0 to 2 is marked in red and has cost 500.

## Constraints

- `2 <= n <= 100`
- `0 <= flights.length <= (n * (n - 1) / 2)`
- `flights[i].length == 3`
- `0 <= fromi, toi < n`
- `fromi != toi`
- `1 <= pricei <= 10^4`
- There will not be any multiple flights between two cities.
- `0 <= src, dst, k < n`
- `src != dst`

## Solution

```python
from typing import List
from collections import defaultdict
import heapq

class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        graph = defaultdict(list)
        for u, v, w in flights:
            graph[u].append((v, w))
        pq = [(0, src, 0)]  # cost, node, stops
        min_cost = [float('inf')] * n
        min_cost[src] = 0
        while pq:
            cost, node, stops = heapq.heappop(pq)
            if node == dst:
                return cost
            if stops > k:
                continue
            for nei, w in graph[node]:
                new_cost = cost + w
                if new_cost < min_cost[nei]:
                    min_cost[nei] = new_cost
                    heapq.heappush(pq, (new_cost, nei, stops + 1))
        return -1
```

## Explanation
This solution uses Dijkstra's algorithm with a priority queue, modified to track the number of stops. We maintain a graph and use a min-heap for the cheapest cost. We also keep track of the minimum cost to each node and skip if stops exceed k. If we reach the destination, return the cost; otherwise, -1.

## Time Complexity
**O((V + E) log V)**, where V is the number of cities and E is the number of flights, due to priority queue operations.

## Space Complexity
**O(V + E)**, for the graph and priority queue.
