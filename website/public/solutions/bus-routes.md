# Bus Routes

## Problem Description

You are given an array `routes` representing bus routes where `routes[i]` is a bus route that the `i`th bus repeats forever.

For example, if `routes[0] = [1, 5, 7]`, this means that the 0th bus travels in the sequence `1 -> 5 -> 7 -> 1 -> 5 -> 7 -> 1 -> ...` forever.

You will start at the bus stop `source` (You are not on any bus initially), and you want to go to the bus stop `target`. You can travel between bus stops by buses only.
Return the least number of buses you must take to travel from `source` to `target`. Return `-1` if it is not possible.

## Examples

**Example 1:**

**Input:**
```python
routes = [[1,2,7],[3,6,7]], source = 1, target = 6
```

**Output:**
```python
2
```

**Explanation:** The best strategy is take the first bus to the bus stop 7, then take the second bus to the bus stop 6.

**Example 2:**

**Input:**
```python
routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
```

**Output:**
```python
-1
```

## Constraints

- `1 <= routes.length <= 500`
- `1 <= routes[i].length <= 105`
- All the values of `routes[i]` are unique.
- `sum(routes[i].length) <= 105`
- `0 <= routes[i][j] < 106`
- `0 <= source, target < 106`

## Solution

```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def numBusesToDestination(self, routes: List[List[int]], source: int, target: int) -> int:
        if source == target:
            return 0
        stop_to_buses = defaultdict(list)
        for i, route in enumerate(routes):
            for stop in route:
                stop_to_buses[stop].append(i)
        graph = defaultdict(list)
        for buses in stop_to_buses.values():
            for i in range(len(buses)):
                for j in range(i + 1, len(buses)):
                    graph[buses[i]].append(buses[j])
                    graph[buses[j]].append(buses[i])
        queue = deque()
        visited = set()
        for bus in stop_to_buses[source]:
            queue.append((bus, 1))
            visited.add(bus)
        while queue:
            bus, buses_taken = queue.popleft()
            for nei in graph[bus]:
                if nei not in visited:
                    if target in routes[nei]:
                        return buses_taken + 1
                    visited.add(nei)
                    queue.append((nei, buses_taken + 1))
        return -1
```

## Explanation

This solution models the problem as a graph where bus routes are nodes, and edges exist between routes that share a stop. We use BFS to find the shortest path from any bus containing the source to any bus containing the target. First, map stops to buses. Then, build the graph by connecting buses that share stops. Perform BFS starting from buses at the source, tracking the number of buses taken. If we reach a bus containing the target, return the count.

## Time Complexity
**O(n * m + b^2)**, where n is the number of stops, m is the average route length, and b is the number of buses, due to graph construction and BFS.

## Space Complexity
**O(n + b^2)**, for the mappings and graph.
