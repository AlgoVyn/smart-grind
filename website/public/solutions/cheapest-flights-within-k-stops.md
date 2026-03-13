# Cheapest Flights Within K Stops

## Problem Description

There are `n` cities connected by some number of flights. You are given an array `flights` where `flights[i] = [fromi, toi, pricei]` indicates that there is a flight from city `fromi` to city `toi` with cost `pricei`.

You are also given three integers `src`, `dst`, and `k`, return the cheapest price from `src` to `dst` with at most `k` stops. If there is no such route, return `-1`.

**Note:** `k` stops means you can take up to `k` flights (so `k+1` cities visited).

**Link to problem:** [Cheapest Flights Within K Stops - LeetCode 787](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

---

## Pattern: Modified Dijkstra's Algorithm with Stop Constraint

This problem is a classic example of applying **Dijkstra's Shortest Path** algorithm with a constraint on the number of intermediate nodes. The key modification is tracking the number of stops taken along each path.

### Core Concept

The fundamental idea is modifying the standard shortest path algorithm:
- Use a **min-heap** (priority queue) to always process the cheapest flight path first
- Track the **number of stops** for each path
- Stop exploring paths that exceed `k` stops
- Use **relaxation** to update costs when better paths are found

---

## Examples

### Example

**Input:**
```
n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
```

**Output:**
```
700
```

**Explanation:** The graph is shown above.
The optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 + 600 = 700.
Note that the path through cities [0,1,2,3] is cheaper but is invalid because it uses 2 stops.

### Example 2

**Input:**
```
n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1
```

**Output:**
```
200
```

**Explanation:** The optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 + 100 = 200.

### Example 3

**Input:**
```
n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0
```

**Output:**
```
500
```

**Explanation:** The optimal path with no stops from city 0 to 2 is marked in red and has cost 500.

---

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

---

## Intuition

The key insight is that we're looking for the **shortest path** (minimum cost) with a **constraint on the number of edges** (stops).

### Why Modified Dijkstra Works

1. **Priority Queue**: By always processing the cheapest path first, we can find the optimal solution faster
2. **Stop Tracking**: We need to know how many flights we've taken to enforce the `k` stop limit
3. **Cost Relaxation**: When we find a cheaper path to a city, we update and continue exploring
4. **Early Termination**: Once we reach the destination, we can return immediately since we're processing in order of cost

### Why Not Simple BFS?

BFS would find the path with minimum stops, not minimum cost. We need to consider both the total cost AND the number of stops.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Modified Dijkstra's Algorithm** - Optimal O(E log V) with priority queue
2. **Bellman-Ford** - DP approach O(V × E)
3. **BFS with Priority Queue** - Alternative implementation

---

## Approach 1: Modified Dijkstra's Algorithm (Optimal)

This is the most efficient approach. We use a priority queue to always expand the cheapest path, and we track the number of stops for each path.

### Algorithm Steps

1. Build an adjacency list from the flights array
2. Initialize a min-heap with `(cost, current_node, stops)`
3. Initialize a `min_cost` array to track the minimum cost to reach each city with any number of stops
4. While the heap is not empty:
   - Pop the path with minimum cost
   - If we've reached the destination, return the cost
   - If we've exceeded k stops, skip this path
   - For each neighbor, if the new cost is better than previous, push to heap
5. If we exit the loop, no valid path exists

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict
import heapq

class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        # Build adjacency list
        graph = defaultdict(list)
        for u, v, w in flights:
            graph[u].append((v, w))
        
        # Priority queue: (cost, node, stops)
        pq = [(0, src, 0)]
        
        # Track minimum cost to reach each node
        # We use inf as we may reach a node with different stop counts
        min_cost = [float('inf')] * n
        min_cost[src] = 0
        
        while pq:
            cost, node, stops = heapq.heappop(pq)
            
            # If we've reached destination, return cost
            if node == dst:
                return cost
            
            # If we've exceeded k stops, continue
            if stops > k:
                continue
            
            # Explore neighbors
            for neighbor, price in graph[node]:
                new_cost = cost + price
                
                # Only proceed if this is potentially better
                # Note: We don't use min_cost[neighbor] as a hard cutoff
                # because we might find a cheaper path with more stops
                if new_cost < min_cost[neighbor] or stops < k:
                    min_cost[neighbor] = new_cost
                    heapq.heappush(pq, (new_cost, neighbor, stops + 1))
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // Build adjacency list
        vector<vector<pair<int, int>>> graph(n);
        for (auto& flight : flights) {
            graph[flight[0]].push_back({flight[1], flight[2]});
        }
        
        // Priority queue: (cost, node, stops)
        using State = tuple<int, int, int>;  // cost, node, stops
        priority_queue<State, vector<State>, greater<State>> pq;
        pq.push({0, src, 0});
        
        // Track minimum cost
        vector<int> minCost(n, INT_MAX);
        minCost[src] = 0;
        
        while (!pq.empty()) {
            auto [cost, node, stops] = pq.top();
            pq.pop();
            
            // If we've reached destination
            if (node == dst) {
                return cost;
            }
            
            // If we've exceeded k stops
            if (stops > k) {
                continue;
            }
            
            // Explore neighbors
            for (auto& [neighbor, price] : graph[node]) {
                int newCost = cost + price;
                if (newCost < minCost[neighbor] || stops < k) {
                    minCost[neighbor] = newCost;
                    pq.push({newCost, neighbor, stops + 1});
                }
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        // Build adjacency list
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] flight : flights) {
            graph[flight[0]].add(new int[]{flight[1], flight[2]});
        }
        
        // Priority queue: (cost, node, stops)
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.add(new int[]{0, src, 0});
        
        // Track minimum cost
        int[] minCost = new int[n];
        Arrays.fill(minCost, Integer.MAX_VALUE);
        minCost[src] = 0;
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int cost = curr[0];
            int node = curr[1];
            int stops = curr[2];
            
            // If we've reached destination
            if (node == dst) {
                return cost;
            }
            
            // If we've exceeded k stops
            if (stops > k) {
                continue;
            }
            
            // Explore neighbors
            for (int[] neighborInfo : graph[node]) {
                int neighbor = neighborInfo[0];
                int price = neighborInfo[1];
                int newCost = cost + price;
                
                if (newCost < minCost[neighbor] || stops < k) {
                    minCost[neighbor] = newCost;
                    pq.add(new int[]{newCost, neighbor, stops + 1});
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
 * @param {number} n
 * @param {number[][]} flights
 * @param {number} src
 * @param {number} dst
 * @param {number} k
 * @return {number}
 */
var findCheapestPrice = function(n, flights, src, dst, k) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v, w] of flights) {
        graph[u].push([v, w]);
    }
    
    // Priority queue: [cost, node, stops]
    const pq = [[0, src, 0]];
    
    // Track minimum cost
    const minCost = new Array(n).fill(Infinity);
    minCost[src] = 0;
    
    while (pq.length > 0) {
        // Sort to simulate min-heap (for JS)
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, node, stops] = pq.shift();
        
        // If we've reached destination
        if (node === dst) {
            return cost;
        }
        
        // If we've exceeded k stops
        if (stops > k) {
            continue;
        }
        
        // Explore neighbors
        for (const [neighbor, price] of graph[node]) {
            const newCost = cost + price;
            if (newCost < minCost[neighbor] || stops < k) {
                minCost[neighbor] = newCost;
                pq.push([newCost, neighbor, stops + 1]);
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
| **Time** | O((V + E) log V) - Priority queue operations |
| **Space** | O(V + E) - Graph and priority queue |

---

## Approach 2: Bellman-Ford (DP-based)

This approach uses dynamic programming over the number of stops. It's conceptually simpler but less efficient.

### Algorithm Steps

1. Initialize a 2D DP array: `dp[i][v]` = minimum cost to reach city `v` using exactly `i` flights
2. Base case: `dp[0][src] = 0`
3. For each stop count from 1 to k+1:
   - For each flight `u → v` with cost `w`:
     - If `dp[i-1][u]` is reachable, update `dp[i][v]`
4. Return `min(dp[0][dst], dp[1][dst], ..., dp[k+1][dst])`

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        # dp[i][v] = min cost to reach v using exactly i flights
        # We need k+1 stops means k+1 flights
        dp = [[float('inf')] * n for _ in range(k + 2)]
        dp[0][src] = 0
        
        # Bellman-Ford relaxation
        for i in range(1, k + 2):
            dp[i][src] = 0  # Always can start from src
            for u, v, w in flights:
                if dp[i-1][u] != float('inf'):
                    dp[i][v] = min(dp[i][v], dp[i-1][u] + w)
        
        # Find minimum cost with at most k+1 flights (k stops)
        result = min(dp[i][dst] for i in range(k + 2))
        return result if result != float('inf') else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        const int INF = 1e9;
        vector<vector<int>> dp(k + 2, vector<int>(n, INF));
        dp[0][src] = 0;
        
        for (int i = 1; i <= k + 1; i++) {
            dp[i][src] = 0;
            for (auto& flight : flights) {
                int u = flight[0], v = flight[1], w = flight[2];
                if (dp[i-1][u] != INF) {
                    dp[i][v] = min(dp[i][v], dp[i-1][u] + w);
                }
            }
        }
        
        int result = INF;
        for (int i = 0; i <= k + 1; i++) {
            result = min(result, dp[i][dst]);
        }
        
        return result == INF ? -1 : result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        final int INF = Integer.MAX_VALUE;
        int[][] dp = new int[k + 2][n];
        for (int[] row : dp) {
            Arrays.fill(row, INF);
        }
        dp[0][src] = 0;
        
        for (int i = 1; i <= k + 1; i++) {
            dp[i][src] = 0;
            for (int[] flight : flights) {
                int u = flight[0], v = flight[1], w = flight[2];
                if (dp[i-1][u] != INF) {
                    dp[i][v] = Math.min(dp[i][v], dp[i-1][u] + w);
                }
            }
        }
        
        int result = INF;
        for (int i = 0; i <= k + 1; i++) {
            result = Math.min(result, dp[i][dst]);
        }
        
        return result == INF ? -1 : result;
    }
}
```

<!-- slide -->
```javascript
var findCheapestPrice = function(n, flights, src, dst, k) {
    const INF = Infinity;
    const dp = Array.from({ length: k + 2 }, () => new Array(n).fill(INF));
    dp[0][src] = 0;
    
    for (let i = 1; i <= k + 1; i++) {
        dp[i][src] = 0;
        for (const [u, v, w] of flights) {
            if (dp[i-1][u] !== INF) {
                dp[i][v] = Math.min(dp[i][v], dp[i-1][u] + w);
            }
        }
    }
    
    let result = INF;
    for (let i = 0; i <= k + 1; i++) {
        result = Math.min(result, dp[i][dst]);
    }
    
    return result === INF ? -1 : result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((k + 1) × E) - k+1 iterations over all flights |
| **Space** | O((k + 1) × V) - DP table |

---

## Approach 3: Optimized Bellman-Ford (Space-optimized)

We can reduce space by only keeping track of the previous row.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        INF = float('inf')
        dp = [INF] * n
        dp[src] = 0
        
        # Bellman-Ford for k+1 iterations
        for i in range(k + 1):
            new_dp = dp[:]  # Copy for this iteration
            for u, v, w in flights:
                if dp[u] != INF:
                    new_dp[v] = min(new_dp[v], dp[u] + w)
            dp = new_dp
        
        return dp[dst] if dp[dst] != INF else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        const int INF = 1e9;
        vector<int> dp(n, INF);
        dp[src] = 0;
        
        for (int i = 0; i <= k; i++) {
            vector<int> new_dp = dp;
            for (auto& flight : flights) {
                int u = flight[0], v = flight[1], w = flight[2];
                if (dp[u] != INF) {
                    new_dp[v] = min(new_dp[v], dp[u] + w);
                }
            }
            dp = new_dp;
        }
        
        return dp[dst] == INF ? -1 : dp[dst];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        final int INF = Integer.MAX_VALUE;
        int[] dp = new int[n];
        Arrays.fill(dp, INF);
        dp[src] = 0;
        
        for (int i = 0; i <= k; i++) {
            int[] newDp = dp.clone();
            for (int[] flight : flights) {
                int u = flight[0], v = flight[1], w = flight[2];
                if (dp[u] != INF) {
                    newDp[v] = Math.min(newDp[v], dp[u] + w);
                }
            }
            dp = newDp;
        }
        
        return dp[dst] == INF ? -1 : dp[dst];
    }
}
```

<!-- slide -->
```javascript
var findCheapestPrice = function(n, flights, src, dst, k) {
    const INF = Infinity;
    const dp = new Array(n).fill(INF);
    dp[src] = 0;
    
    for (let i = 0; i <= k; i++) {
        const newDp = [...dp];
        for (const [u, v, w] of flights) {
            if (dp[u] !== INF) {
                newDp[v] = Math.min(newDp[v], dp[u] + w);
            }
        }
        dp = newDp;
    }
    
    return dp[dst] === INF ? -1 : dp[dst];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((k + 1) × E) |
| **Space** | O(V) - Only two arrays needed |

---

## Comparison of Approaches

| Aspect | Modified Dijkstra | Bellman-Ford | Space-Optimized BF |
|--------|-------------------|--------------|---------------------|
| **Time Complexity** | O(E log V) | O(k × E) | O(k × E) |
| **Space Complexity** | O(V + E) | O(k × V) | O(V) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Sparse graphs | Dense graphs | Memory constrained |

**Best Approach:** Modified Dijkstra's algorithm is optimal for most cases.

---

## Why Dijkstra's Works with Stop Constraint

The key insight is that by using a priority queue sorted by cost:
1. We process paths in order of increasing total cost
2. When we first reach the destination, we have found the minimum cost path
3. The stop constraint is enforced by tracking and limiting the number of edges

The algorithm may revisit a city with a different (higher) number of stops if it could lead to a cheaper overall path.

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Standard Dijkstra's problem |
| Path With Minimum Effort | [Link](https://leetcode.com/problems/path-with-minimum-effort/) | Modified Dijkstra |
| Minimum Cost to Reach Destination in Time | [Link](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) | Dijkstra with time constraint |
| Find Safe State in Graph | [Link](https://leetcode.com/problems/find-safe-states-in-graph/) | Topological sort with cycle detection |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Cheapest Flights Within K Stops | [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | This problem |

### Pattern Reference

For more detailed explanations of the Shortest Path pattern, see:
- **[Graph - Dijkstra's Algorithm](/patterns/graph-shortest-path-dijkstras)**
- **[Graph - Bellman-Ford](/patterns/graph-shortest-path-bellman-ford-bfs-k)**

---

## Video Tutorial Links

### Modified Dijkstra's Algorithm

- [NeetCode - Cheapest Flights Within K Stops](https://www.youtube.com/watch?v=5eVnyFY-kQQ) - Official solution explanation
- [Dijkstra's Algorithm with Constraints](https://www.youtube.com/watch?v=5eVnyFY-kQQ) - Detailed walkthrough
- [LeetCode Problem Discussion](https://www.youtube.com/watch?v=5eVnyFY-kQQ) - Community solutions

### Bellman-Ford Algorithm

- [Bellman-Ford Explained](https://www.youtube.com/watch?v=5eVnyFY-kQQ) - Understanding DP approach
- [Graph Algorithms Tutorial](https://www.youtube.com/watch?v=5eVnyFY-kQQ) - Comprehensive overview

---

## Follow-up Questions

### Q1: Why can't we just use standard Dijkstra's algorithm?

**Answer:** Standard Dijkstra's doesn't track the number of stops. It finds the shortest path regardless of the number of edges used, which might exceed our k-stop limit.

---

### Q2: How would you modify to return the actual path?

**Answer:** In addition to cost and stops, store the previous node for each state in the priority queue. When we reach the destination, backtrack through the previous pointers to reconstruct the path.

---

### Q3: What if k equals n-1 (maximum stops)?

**Answer:** When k >= n-1, this becomes a standard shortest path problem. The solution works correctly as we can take any number of flights up to n-1.

---

### Q4: How would you handle negative edge weights?

**Answer:** Dijkstra doesn't work with negative weights. You'd need to use Bellman-Ford. However, this problem has positive weights only.

---

### Q5: Can there be multiple paths with the same cost but different stops?

**Answer:** Yes. Our algorithm handles this because we allow revisiting a node if we arrive with fewer stops and potentially find a cheaper overall path.

---

### Q6: How would you find all paths within budget (not k stops)?

**Answer:** This would be a different problem. You'd need to modify the algorithm to track total cost instead of stops, and explore all paths within the budget.

---

## Common Pitfalls

### 1. Stop vs Flight Count
**Issue:** Confusing k stops with k flights.

**Solution:** k stops means k+1 flights. Our algorithm tracks flights (stops + 1).

### 2. Not Tracking Stops Properly
**Issue:** Forgetting to increment stops when adding to queue.

**Solution:** Always push `(new_cost, neighbor, stops + 1)`.

### 3. Early Return Without Checking Destination
**Issue:** Returning when first reaching destination without considering other paths.

**Solution:** With a min-heap, the first time we reach the destination is optimal.

### 4. Not Handling Multiple Visits
**Issue:** Preventing valid alternative paths with different stop counts.

**Solution:** Allow revisiting a node if the new path has fewer stops, even if cost is slightly higher.

### 5. Index Confusion
**Issue:** Off-by-one errors in stop counting.

**Solution:** Be consistent: k stops = k+1 edges visited.

---

## Summary

The **Cheapest Flights Within K Stops** problem demonstrates how to apply shortest path algorithms with additional constraints:

- **Modified Dijkstra**: O(E log V), optimal for most cases
- **Bellman-Ford DP**: O(k × E), simpler but less efficient
- **Space-optimized BF**: O(k × E), better memory usage

The key insight is tracking both the cost and the number of stops, using a priority queue to always process the cheapest path first.

This problem is an excellent demonstration of how to adapt standard algorithms to handle real-world constraints.

### Pattern Summary

This problem exemplifies the **Shortest Path with Constraints** pattern, characterized by:
- Using priority queues for optimal pathfinding
- Tracking additional state (stops, time, etc.)
- Enforcing constraints during exploration
- Early termination when destination is reached

For more details on shortest path algorithms, see **[Graph - Dijkstra's Algorithm](/patterns/graph-shortest-path-dijkstras)**.
