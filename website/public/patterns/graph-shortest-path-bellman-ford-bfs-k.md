# Graph - Shortest Path (Bellman-Ford / BFS with K stops)

## Problem Description

This pattern covers shortest path algorithms for graphs with specific constraints. Bellman-Ford handles graphs with negative edge weights and can detect negative cycles. BFS with K stops (or edges limit) is used when the path must use at most K edges, common in flight routing problems with stop constraints.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(V × E) for Bellman-Ford, O(V × K) for BFS+K |
| Space Complexity | O(V) for distances array |
| Input | Weighted graph, may have negative weights |
| Output | Shortest path distance or actual path |
| Approach | Dynamic relaxation with constraints |

### When to Use

- Handle graphs with negative edge weights
- Detect negative weight cycles
- Find shortest paths with limited stops/edges
- Solve flight routing with stop constraints
- Problems with cost constraints on path length
- When Dijkstra fails due to negative weights

## Intuition

The key insight is to iteratively relax edges, gradually finding shorter paths until no more improvements can be made.

The "aha!" moments:

1. **Relaxation**: If going through an intermediate node gives a shorter path, update the distance
2. **V-1 iterations**: After V-1 relaxations, shortest paths are found (if no negative cycles)
3. **Negative cycle check**: If distances improve after V-1 iterations, negative cycle exists
4. **K constraint**: Track number of stops/edges used alongside distance
5. **Early termination**: Can stop early if no updates in an iteration

## Solution Approaches

### Approach 1: Bellman-Ford Algorithm ✅ Recommended

#### Algorithm

1. Initialize distances array with infinity, except source = 0
2. Relax all edges V-1 times:
   - For each edge (u, v, weight):
     - If dist[u] + weight < dist[v], update dist[v]
3. Check for negative cycles:
   - For each edge (u, v, weight):
     - If dist[u] + weight < dist[v], negative cycle exists
4. Return distances or None if negative cycle

#### Implementation

````carousel
```python
def bellman_ford(n: int, edges: list[list[int]], source: int) -> list[int]:
    """
    Bellman-Ford algorithm for shortest paths with possible negative weights.
    Time: O(V * E), Space: O(V)
    """
    # Initialize distances
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Relax edges V-1 times
    for _ in range(n - 1):
        updated = False
        for u, v, weight in edges:
            if dist[u] != float('inf') and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                updated = True
        if not updated:  # Early termination
            break
    
    # Check for negative cycles
    for u, v, weight in edges:
        if dist[u] != float('inf') and dist[u] + weight < dist[v]:
            return None  # Negative cycle detected
    
    return dist


def find_shortest_path_with_negative_weights(n, edges, source, target):
    """
    Returns shortest path from source to target, or None if negative cycle.
    """
    dist = [float('inf')] * n
    parent = [-1] * n
    dist[source] = 0
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, weight in edges:
            if dist[u] != float('inf') and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                parent[v] = u
    
    # Check for negative cycle
    for u, v, weight in edges:
        if dist[u] != float('inf') and dist[u] + weight < dist[v]:
            return None
    
    # Reconstruct path
    if dist[target] == float('inf'):
        return None
    
    path = []
    curr = target
    while curr != -1:
        path.append(curr)
        curr = parent[curr]
    return path[::-1], dist[target]
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> bellmanFord(int n, vector<vector<int>>& edges, int source) {
        vector<int> dist(n, INT_MAX);
        dist[source] = 0;
        
        // Relax edges V-1 times
        for (int i = 0; i < n - 1; i++) {
            bool updated = false;
            for (const auto& e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
            if (!updated) break;
        }
        
        // Check for negative cycles
        for (const auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                return {};  // Negative cycle
            }
        }
        
        return dist;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] bellmanFord(int n, int[][] edges, int source) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        
        // Relax edges V-1 times
        for (int i = 0; i < n - 1; i++) {
            boolean updated = false;
            for (int[] e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
            if (!updated) break;
        }
        
        // Check for negative cycles
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                return new int[0];  // Negative cycle
            }
        }
        
        return dist;
    }
}
```
<!-- slide -->
```javascript
/**
 * Bellman-Ford algorithm
 * @param {number} n
 * @param {number[][]} edges - [u, v, weight]
 * @param {number} source
 * @return {number[]}
 */
function bellmanFord(n, edges, source) {
    const dist = new Array(n).fill(Infinity);
    dist[source] = 0;
    
    // Relax edges V-1 times
    for (let i = 0; i < n - 1; i++) {
        let updated = false;
        for (const [u, v, w] of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }
        if (!updated) break;
    }
    
    // Check for negative cycles
    for (const [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            return null;  // Negative cycle
        }
    }
    
    return dist;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V × E) - V iterations over E edges |
| Space | O(V) - Distance array |

### Approach 2: BFS with K Stops (Limited Edges)

#### Algorithm

1. Build adjacency list from edge list
2. Use BFS with queue entries: (node, cost, stops)
3. Track best distance for each (node, stops) pair
4. Process queue:
   - If stops > K, skip
   - If current cost > best known, skip
   - For each neighbor, add to queue with updated cost and stops+1
5. Return minimum cost to destination

#### Implementation

````carousel
```python
from collections import deque, defaultdict

def find_cheapest_price(n: int, flights: list[list[int]], 
                         src: int, dst: int, k: int) -> int:
    """
    Find cheapest flight with at most K stops.
    LeetCode 787 - Cheapest Flights Within K Stops
    Time: O(V * K), Space: O(V * K)
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # BFS: (cost, node, stops)
    queue = deque([(0, src, 0)])
    
    # Track minimum cost to reach each node with specific stops
    min_cost = [[float('inf')] * (k + 2) for _ in range(n)]
    min_cost[src][0] = 0
    
    while queue:
        cost, node, stops = queue.popleft()
        
        if stops > k:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            new_stops = stops + 1
            
            # Only proceed if we found a better cost
            if new_stops <= k + 1 and new_cost < min_cost[neighbor][new_stops]:
                min_cost[neighbor][new_stops] = new_cost
                queue.append((new_cost, neighbor, new_stops))
    
    result = min(min_cost[dst])
    return result if result != float('inf') else -1


# Optimized version using single distance array with stops constraint
def find_cheapest_price_optimized(n, flights, src, dst, k):
    """Optimized version with early termination."""
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # dist[node] = minimum cost to reach node
    dist = [float('inf')] * n
    dist[src] = 0
    
    # BFS level by level (each level = one more stop)
    queue = deque([src])
    stops = 0
    
    while queue and stops <= k:
        level_size = len(queue)
        # Create copy of current distances
        new_dist = dist[:]
        
        for _ in range(level_size):
            node = queue.popleft()
            
            for neighbor, price in graph[node]:
                new_cost = dist[node] + price
                if new_cost < new_dist[neighbor]:
                    new_dist[neighbor] = new_cost
                    queue.append(neighbor)
        
        dist = new_dist
        stops += 1
    
    return dist[dst] if dist[dst] != float('inf') else -1
```
<!-- slide -->
```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<vector<pair<int, int>>> graph(n);
        for (const auto& f : flights) {
            graph[f[0]].push_back({f[1], f[2]});
        }
        
        // BFS: {cost, node, stops}
        queue<tuple<int, int, int>> q;
        q.push({0, src, 0});
        
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;
        
        while (!q.empty()) {
            auto [cost, node, stops] = q.front();
            q.pop();
            
            if (stops > k) continue;
            
            for (auto& [neighbor, price] : graph[node]) {
                int newCost = cost + price;
                if (newCost < dist[neighbor]) {
                    dist[neighbor] = newCost;
                    q.push({newCost, neighbor, stops + 1});
                }
            }
        }
        
        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
        for (int[] f : flights) {
            graph[f[0]].add(new int[]{f[1], f[2]});
        }
        
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{0, src, 0});  // cost, node, stops
        
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int cost = curr[0], node = curr[1], stops = curr[2];
            
            if (stops > k) continue;
            
            for (int[] edge : graph[node]) {
                int neighbor = edge[0], price = edge[1];
                int newCost = cost + price;
                if (newCost < dist[neighbor]) {
                    dist[neighbor] = newCost;
                    q.offer(new int[]{newCost, neighbor, stops + 1});
                }
            }
        }
        
        return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
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
function findCheapestPrice(n, flights, src, dst, k) {
    const graph = Array.from({length: n}, () => []);
    for (const [u, v, price] of flights) {
        graph[u].push([v, price]);
    }
    
    const queue = [[0, src, 0]];  // cost, node, stops
    const dist = new Array(n).fill(Infinity);
    dist[src] = 0;
    
    while (queue.length > 0) {
        const [cost, node, stops] = queue.shift();
        
        if (stops > k) continue;
        
        for (const [neighbor, price] of graph[node]) {
            const newCost = cost + price;
            if (newCost < dist[neighbor]) {
                dist[neighbor] = newCost;
                queue.push([newCost, neighbor, stops + 1]);
            }
        }
    }
    
    return dist[dst] === Infinity ? -1 : dist[dst];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V × K) - Each node can be visited with up to K different stop counts |
| Space | O(V × K) or O(V) depending on optimization |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Bellman-Ford | O(V × E) | O(V) | **Recommended** - Negative weights, no cycle |
| BFS with K stops | O(V × K) | O(V) | **Recommended** - Limited stops constraint |
| Dijkstra | O(E log V) | O(V) | Non-negative weights only |
| SPFA | O(E) average | O(V) | When Bellman-Ford is too slow |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | 787 | Medium | BFS with K stops limit |
| [Network Delay Time](https://leetcode.com/problems/network-delay-time/) | 743 | Medium | Single source shortest path |
| [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/) | 1514 | Medium | Shortest path variant |
| [Find the City With Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) | 1334 | Medium | All pairs shortest path |
| [Minimum Cost to Reach Destination in Time](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) | 1928 | Hard | Constrained shortest path |
| [Minimum Weighted Subgraph With Required Paths](https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/) | 2203 | Hard | Multiple path constraints |

## Video Tutorial Links

1. **[NeetCode - Cheapest Flights Within K Stops](https://www.youtube.com/watch?v=5eIK3zUdYmE)** - BFS approach
2. **[William Fiset - Bellman-Ford](https://www.youtube.com/watch?v=obWXjtg0L64)** - Algorithm explanation
3. **[Abdul Bari - Bellman-Ford](https://www.youtube.com/watch?v=FtN3BYH2Zes)** - Step by step
4. **[Tushar Roy - Bellman-Ford](https://www.youtube.com/watch?v=KudAWAMiQog)** - With negative cycle detection

## Summary

### Key Takeaways

- **Bellman-Ford**: Use when negative weights possible, detects negative cycles
- **K stops constraint**: Track stops alongside distance in BFS
- **Relaxation**: Core operation - update if better path found
- **V-1 iterations**: Guarantees shortest paths without negative cycles
- **Early termination**: Stop if no updates in an iteration

### Common Pitfalls

- Using Bellman-Ford with only V-2 iterations (need V-1)
- Not checking for negative cycles after main algorithm
- In BFS+K, confusing stops with edges (stops = edges - 1)
- Using Dijkstra when negative weights exist
- Forgetting to initialize distances to infinity
- Not handling disconnected nodes (dist remains infinity)

### Follow-up Questions

1. **How to detect which nodes are part of negative cycles?**
   - Run extra iteration, nodes that update are in/point to negative cycles

2. **Can we optimize Bellman-Ford further?**
   - SPFA (Shortest Path Faster Algorithm) for average case O(E)

3. **What if we need the actual path, not just distance?**
   - Track parent array during relaxation

4. **How to handle multiple queries on same graph?**
   - Use Floyd-Warshall for all-pairs shortest paths

## Pattern Source

[Graph - Shortest Path (Bellman-Ford / BFS with K stops)](patterns/graph-shortest-path-bellman-ford-bfs-k.md)
