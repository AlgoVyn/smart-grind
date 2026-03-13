# Bus Routes

## Problem Description

[LeetCode Link: Bus Routes](https://leetcode.com/problems/bus-routes/)

You are given an array `routes` representing bus routes where `routes[i]` is a bus route that the `i`th bus repeats forever.

For example, if `routes[0] = [1, 5, 7]`, this means that the 0th bus travels in the sequence `1 -> 5 -> 7 -> 1 -> 5 -> 7 -> 1 -> ...` forever.

You will start at the bus stop `source` (You are not on any bus initially), and you want to go to the bus stop `target`. You can travel between bus stops by buses only.
Return the least number of buses you must take to travel from `source` to `target`. Return `-1` if it is not possible.

---

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

---

## Constraints

- `1 <= routes.length <= 500`
- `1 <= routes[i].length <= 105`
- All the values of `routes[i]` are unique.
- `sum(routes[i].length) <= 105`
- `0 <= routes[i][j] < 106`
- `0 <= source, target < 106`

---

## Intuition

The key insight for this problem is understanding that we need to find the **minimum number of buses (transfers)** to go from source to target. This is a classic shortest path problem on a transformed graph:

### Key Insight: Graph Transformation

1. **Original View**: Bus stops are nodes, and you can travel between stops on the same bus route
2. **Transformed View**: Bus routes are nodes, and edges exist between routes that share at least one stop
3. **Why Transform**: Finding minimum buses = finding shortest path in route-graph

### Algorithm Overview

1. **Stop-to-Bus Mapping**: For each stop, find all buses that visit it
2. **Graph Building**: Connect buses that share common stops
3. **BFS**: Find shortest path from any source bus to any target bus

### Example Walkthrough

For `routes = [[1,2,7],[3,6,7]], source = 1, target = 6`:
- Stop 1 → buses: [0]
- Stop 7 → buses: [0, 1]
- Stop 6 → buses: [1]
- Graph: bus 0 connects to bus 1 (via stop 7)
- BFS: start from bus 0 → reach bus 1 (target bus)
- Result: 2 buses

---

## Solution Approaches

## Approach 1: Graph Building + BFS (Optimal)

### Algorithm Steps

1. Build stop-to-buses mapping
2. Build bus-to-bus graph where edges exist between routes sharing stops
3. Use BFS starting from all buses at source stop
4. Track number of buses taken, return when target reached

### Why It Works

By transforming the problem into a graph where nodes are bus routes and edges represent transfers, BFS naturally finds the minimum number of buses needed.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def numBusesToDestination(self, routes: List[List[int]], source: int, target: int) -> int:
        if source == target:
            return 0
        
        # Step 1: Build stop-to-buses mapping
        stop_to_buses = defaultdict(list)
        for i, route in enumerate(routes):
            for stop in route:
                stop_to_buses[stop].append(i)
        
        # Step 2: Build bus-to-bus graph
        graph = defaultdict(list)
        for buses in stop_to_buses.values():
            for i in range(len(buses)):
                for j in range(i + 1, len(buses)):
                    graph[buses[i]].append(buses[j])
                    graph[buses[j]].append(buses[i])
        
        # Step 3: BFS from source buses
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

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {
        if (source == target) return 0;
        
        // Build stop-to-buses mapping
        unordered_map<int, vector<int>> stopToBuses;
        for (int i = 0; i < routes.size(); i++) {
            for (int stop : routes[i]) {
                stopToBuses[stop].push_back(i);
            }
        }
        
        // Build bus-to-bus graph
        unordered_map<int, vector<int>> graph;
        for (auto& [stop, buses] : stopToBuses) {
            for (int i = 0; i < buses.size(); i++) {
                for (int j = i + 1; j < buses.size(); j++) {
                    graph[buses[i]].push_back(buses[j]);
                    graph[buses[j]].push_back(buses[i]);
                }
            }
        }
        
        // BFS
        queue<pair<int, int>> q;
        unordered_set<int> visited;
        for (int bus : stopToBuses[source]) {
            q.push({bus, 1});
            visited.insert(bus);
        }
        
        while (!q.empty()) {
            auto [bus, count] = q.front();
            q.pop();
            for (int nei : graph[bus]) {
                if (visited.find(nei) == visited.end()) {
                    // Check if target is in this route
                    for (int stop : routes[nei]) {
                        if (stop == target) return count + 1;
                    }
                    visited.insert(nei);
                    q.push({nei, count + 1});
                }
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        if (source == target) return 0;
        
        // Build stop-to-buses mapping
        Map<Integer, List<Integer>> stopToBuses = new HashMap<>();
        for (int i = 0; i < routes.length; i++) {
            for (int stop : routes[i]) {
                stopToBuses.computeIfAbsent(stop, k -> new ArrayList<>()).add(i);
            }
        }
        
        // Build bus-to-bus graph
        Map<Integer, List<Integer>> graph = new HashMap<>();
        for (List<Integer> buses : stopToBuses.values()) {
            for (int i = 0; i < buses.size(); i++) {
                for (int j = i + 1; j < buses.size(); j++) {
                    graph.computeIfAbsent(buses.get(i), k -> new ArrayList<>()).add(buses.get(j));
                    graph.computeIfAbsent(buses.get(j), k -> new ArrayList<>()).add(buses.get(i));
                }
            }
        }
        
        // BFS
        Queue<Pair<Integer, Integer>> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        for (int bus : stopToBuses.getOrDefault(source, new ArrayList<>())) {
            queue.offer(new Pair<>(bus, 1));
            visited.add(bus);
        }
        
        while (!queue.isEmpty()) {
            Pair<Integer, Integer> pair = queue.poll();
            int bus = pair.getKey();
            int count = pair.getValue();
            for (int nei : graph.getOrDefault(bus, new ArrayList<>())) {
                if (!visited.contains(nei)) {
                    // Check if target is in this route
                    for (int stop : routes[nei]) {
                        if (stop == target) return count + 1;
                    }
                    visited.add(nei);
                    queue.offer(new Pair<>(nei, count + 1));
                }
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} routes
 * @param {number} source
 * @param {number} target
 * @return {number}
 */
var numBusesToDestination = function(routes, source, target) {
    if (source === target) return 0;
    
    // Build stop-to-buses mapping
    const stopToBuses = new Map();
    routes.forEach((route, busIdx) => {
        route.forEach(stop => {
            if (!stopToBuses.has(stop)) {
                stopToBuses.set(stop, []);
            }
            stopToBuses.get(stop).push(busIdx);
        });
    });
    
    // Build bus-to-bus graph
    const graph = new Map();
    stopToBuses.forEach(buses => {
        for (let i = 0; i < buses.length; i++) {
            for (let j = i + 1; j < buses.length; j++) {
                if (!graph.has(buses[i])) graph.set(buses[i], []);
                if (!graph.has(buses[j])) graph.set(buses[j], []);
                graph.get(buses[i]).push(buses[j]);
                graph.get(buses[j]).push(buses[i]);
            }
        }
    });
    
    // BFS
    const queue = [];
    const visited = new Set();
    (stopToBuses.get(source) || []).forEach(bus => {
        queue.push([bus, 1]);
        visited.add(bus);
    });
    
    while (queue.length > 0) {
        const [bus, count] = queue.shift();
        for (const nei of (graph.get(bus) || [])) {
            if (!visited.has(nei)) {
                if (routes[nei].includes(target)) return count + 1;
                visited.add(nei);
                queue.push([nei, count + 1]);
            }
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * m + b²) where n=stops, m=avg route length, b=buses |
| **Space** | O(n + b²) for mappings and graph |

---

## Approach 2: BFS Without Pre-built Graph

### Algorithm Steps

1. Build stop-to-buses mapping
2. BFS directly using the mapping (no explicit graph)
3. At each step, find all buses that can be reached from current bus's stops

### Why It Works

Instead of pre-building the full graph, we dynamically find neighboring buses during BFS traversal using the stop-to-buses mapping.

### Code Implementation

````carousel
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
        
        visited_bus = set()
        visited_stop = set()
        queue = deque()
        
        for bus in stop_to_buses[source]:
            queue.append((bus, 1))
            visited_bus.add(bus)
        
        while queue:
            bus, count = queue.popleft()
            for stop in routes[bus]:
                if stop == target:
                    return count
                if stop not in visited_stop:
                    visited_stop.add(stop)
                    for next_bus in stop_to_buses[stop]:
                        if next_bus not in visited_bus:
                            visited_bus.add(next_bus)
                            queue.append((next_bus, count + 1))
        
        return -1
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {
        if (source == target) return 0;
        
        unordered_map<int, vector<int>> stopToBuses;
        for (int i = 0; i < routes.size(); i++) {
            for (int stop : routes[i]) {
                stopToBuses[stop].push_back(i);
            }
        }
        
        queue<pair<int, int>> q;
        unordered_set<int> visitedBus, visitedStop;
        
        for (int bus : stopToBuses[source]) {
            q.push({bus, 1});
            visitedBus.insert(bus);
        }
        
        while (!q.empty()) {
            auto [bus, count] = q.front();
            q.pop();
            for (int stop : routes[bus]) {
                if (stop == target) return count;
                if (!visitedStop.count(stop)) {
                    visitedStop.insert(stop);
                    for (int nextBus : stopToBuses[stop]) {
                        if (!visitedBus.count(nextBus)) {
                            visitedBus.insert(nextBus);
                            q.push({nextBus, count + 1});
                        }
                    }
                }
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        if (source == target) return 0;
        
        Map<Integer, List<Integer>> stopToBuses = new HashMap<>();
        for (int i = 0; i < routes.length; i++) {
            for (int stop : routes[i]) {
                stopToBuses.computeIfAbsent(stop, k -> new ArrayList<>()).add(i);
            }
        }
        
        Queue<Pair<Integer, Integer>> queue = new LinkedList<>();
        Set<Integer> visitedBus = new HashSet<>();
        Set<Integer> visitedStop = new HashSet<>();
        
        for (int bus : stopToBuses.getOrDefault(source, new ArrayList<>())) {
            queue.offer(new Pair<>(bus, 1));
            visitedBus.add(bus);
        }
        
        while (!queue.isEmpty()) {
            Pair<Integer, Integer> pair = queue.poll();
            int bus = pair.getKey();
            int count = pair.getValue();
            for (int stop : routes[bus]) {
                if (stop == target) return count;
                if (!visitedStop.contains(stop)) {
                    visitedStop.add(stop);
                    for (int nextBus : stopToBuses.getOrDefault(stop, new ArrayList<>())) {
                        if (!visitedBus.contains(nextBus)) {
                            visitedBus.add(nextBus);
                            queue.offer(new Pair<>(nextBus, count + 1));
                        }
                    }
                }
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
var numBusesToDestination = function(routes, source, target) {
    if (source === target) return 0;
    
    const stopToBuses = new Map();
    routes.forEach((route, busIdx) => {
        route.forEach(stop => {
            if (!stopToBuses.has(stop)) {
                stopToBuses.set(stop, []);
            }
            stopToBuses.get(stop).push(busIdx);
        });
    });
    
    const queue = [];
    const visitedBus = new Set();
    const visitedStop = new Set();
    
    (stopToBuses.get(source) || []).forEach(bus => {
        queue.push([bus, 1]);
        visitedBus.add(bus);
    });
    
    while (queue.length > 0) {
        const [bus, count] = queue.shift();
        for (const stop of routes[bus]) {
            if (stop === target) return count;
            if (!visitedStop.has(stop)) {
                visitedStop.add(stop);
                for (const nextBus of (stopToBuses.get(stop) || [])) {
                    if (!visitedBus.has(nextBus)) {
                        visitedBus.add(nextBus);
                        queue.push([nextBus, count + 1]);
                    }
                }
            }
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * m) where n=stops, m=avg route length |
| **Space** | O(n + b) for mappings |

---

## Comparison of Approaches

| Aspect | Graph + BFS | BFS Without Graph |
|--------|-------------|-------------------|
| **Time Complexity** | O(n*m + b²) | O(n*m) |
| **Space Complexity** | O(n + b²) | O(n + b) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Approach 2 is more space-efficient for sparse graphs.

---

## Related Problems

Based on similar themes (graph transformation, BFS):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Number of Hops | [Link](https://leetcode.com/problems/minimum-number-of-hops/) | Similar graph traversal |
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Shortest path in graph |
| Cheapest Flights Within K Stops | [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | BFS with constraints |
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS shortest path |

---

---

## Pattern: Graph Transformation

This problem follows the **Graph Transformation** pattern, which involves converting one representation of a graph problem to another to enable efficient solution finding.

### Core Concept

The Bus Routes problem demonstrates the **Graph Transformation** pattern where we convert the problem's natural representation (bus stops) into a graph representation (bus routes as nodes) that enables efficient shortest path finding:

1. **Node Transformation**: Treat each bus route as a node instead of each stop
2. **Edge Construction**: Routes that share any stop become connected nodes
3. **BFS for Shortest Path**: Minimum buses = shortest path in transformed graph

### When to Use This Pattern

This pattern applies when:
- Problem involves finding minimum "hops" or "transfers" between entities
- Multiple entities (buses, flights, friends) share common connections (stops, airports, friends)
- Direct representation is inefficient; transforming to meta-graph helps
- Need to find minimum number of intermediate entities to reach destination

### Alternative Patterns

| Alternative Pattern | Use Case |
|---------------------|----------|
| **Multi-source BFS** | When starting from multiple entry points simultaneously |
| **Dijkstra's Algorithm** | When edges have weights (e.g., time, cost) |
| **Union-Find** | When only need to check connectivity, not shortest path |

---

## Explanation

This solution models the problem as a graph where bus routes are nodes, and edges exist between routes that share a stop. We use BFS to find the shortest path from any bus containing the source to any bus containing the target. First, map stops to buses. Then, build the graph by connecting buses that share stops. Perform BFS starting from buses at the source, tracking the number of buses taken. If we reach a bus containing the target, return the count.

---

## Time Complexity
**O(n * m + b^2)**, where n is the number of stops, m is the average route length, and b is the number of buses, due to graph construction and BFS.

---

## Space Complexity
**O(n + b^2)**, for the mappings and graph.

---

## Summary

The **Bus Routes** problem demonstrates the **graph transformation** pattern:

- **Graph transformation**: Convert bus routes into a graph of routes that share stops
- **BFS for shortest path**: Find minimum buses needed using breadth-first search
- **Stop-to-bus mapping**: Build adjacency between routes via shared stops
- **Time complexity**: O(n * m + b²) - due to graph construction

Key insights:
1. Model routes as nodes, not stops
2. Two routes are connected if they share any stop
3. BFS finds minimum buses (shortest path in route graph)
4. Start BFS from all buses that contain the source stop

This pattern extends to:
- Minimum transportation transfers
- Connection problems in networks
- Multi-hop routing problems

---

## Common Pitfalls

### 1. Building Full Graph Incorrectly
**Issue:** Not properly connecting routes that share stops.

**Solution:** Use stop-to-bus mapping, then connect all buses that visit each stop.

### 2. Not Starting from All Source Buses
**Issue:** Starting BFS from only one bus at source.

**Solution:** Initialize queue with ALL buses that contain the source stop.

### 3. Not Checking Target in Route
**Issue:** Not properly detecting when we've reached a bus going to target.

**Solution:** Check if target is in the current route before adding to queue.

### 4. High Space Complexity
**Issue:** Building full bus-to-bus graph can be expensive.

**Solution:** On-the-fly graph building during BFS using stop-to-bus mapping.

---

## Follow-up Questions

### Q1: How would you optimize space complexity?

**Answer:** Instead of prebuilding the full graph, use stop-to-bus mapping during BFS to find neighboring buses dynamically.

### Q2: How would you return the actual bus route sequence?

**Answer:** Keep track of parent pointers during BFS to reconstruct the path. Store (bus, parent) in the queue.

### Q3: How would you handle time schedules?

**Answer:** Add time dimension to the graph. Nodes become (bus, time) pairs, edges represent waiting and traveling.

### Q4: What if buses have limited capacity?

**Answer:** This becomes a flow problem. Use max-flow algorithm or add capacity constraints to BFS.

### Q5: How would you handle circular routes efficiently?

**Answer:** The problem already models circular routes. The key is treating routes as nodes, not individual stops.

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Bus Routes - LeetCode 815](https://www.youtube.com/watch?v=vhW07mXq0N8)** - NeetCode explanation
2. **[Graph Transformation BFS](https://www.youtube.com/watch?v=RKSPhR4nOkg)** - Back to Back SWE
3. **[Minimum Bus Transfers](https://www.youtube.com/watch?v=4DGEwcTaE3A)** - Tutorial Cup

### Related Concepts

- **[BFS Fundamentals](https://www.youtube.com/watch?v=oDqjPvD1-jE)** - Breadth-first search
- **[Graph Transformation](https://www.youtube.com/watch?v=vsZ7NC1p-pQ)** - Problem-solving technique
