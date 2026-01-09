# Network Delay Time

## Problem Description

You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges `times[i] = (ui, vi, wi)`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.

We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.

---

## Examples

### Example 1

**Input:**
```python
times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
```

**Output:**
```python
2
```

### Example 2

**Input:**
```python
times = [[1,2,1]], n = 2, k = 1
```

**Output:**
```python
1
```

### Example 3

**Input:**
```python
times = [[1,2,1]], n = 2, k = 2
```

**Output:**
```python
-1
```

---

## Constraints

- `1 <= k <= n <= 100`
- `1 <= times.length <= 6000`
- `times[i].length == 3`
- `1 <= ui, vi <= n`
- `ui != vi`
- `0 <= wi <= 100`
- All the pairs `(ui, vi)` are unique. (i.e., no multiple edges.)

---

## Solution

```python
import heapq
from typing import List
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))
        dist = {i: float('inf') for i in range(1, n + 1)}
        dist[k] = 0
        pq = [(0, k)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in graph[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    heapq.heappush(pq, (dist[v], v))
        max_dist = max(dist.values())
        return max_dist if max_dist != float('inf') else -1
```

---

## Explanation

This problem requires finding the time for a signal to reach all nodes from a starting node k.

Use Dijkstra's algorithm to compute the shortest time to each node.

The network delay time is the maximum of these shortest times.

If any node is unreachable, return -1.

---

## Complexity Analysis

- **Time Complexity:** O((V + E) log V), where V is nodes, E is edges, due to priority queue.
- **Space Complexity:** O(V + E), for the graph and distance array.
