# Number Of Ways To Arrive At Destination

## Problem Description

You are in a city that consists of n intersections numbered from 0 to n - 1 with bi-directional roads between some intersections. The inputs are generated such that you can reach any intersection from any other intersection and that there is at most one road between any two intersections.

You are given an integer n and a 2D integer array roads where `roads[i] = [ui, vi, timei]` means that there is a road between intersections `ui` and `vi` that takes `timei` minutes to travel.

You want to know in how many ways you can travel from intersection 0 to intersection n - 1 in the shortest amount of time.

Return the number of ways you can arrive at your destination in the shortest amount of time. Since the answer may be large, return it modulo 10^9 + 7.

**Link to problem:** [Number of Ways to Arrive at Destination - LeetCode 1976](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/)

## Constraints
- `1 <= n <= 200`
- `n - 1 <= roads.length <= n * (n - 1) / 2`
- `roads[i].length == 3`
- `0 <= ui, vi <= n - 1`
- `1 <= timei <= 10^9`
- `ui != vi`
- There is at most one road connecting any two intersections.
- You can reach any intersection from any other intersection.

---

## Pattern: Dijkstra with Path Counting

This problem combines **Dijkstra's Algorithm** with path counting to find the number of shortest paths.

### Core Concept

- **Dijkstra**: Find shortest distance from source to all nodes
- **Path Counting**: Track number of ways to achieve each shortest distance
- **Modulo**: Use modulo 10^9 + 7 for large answers

---

## Examples

### Example

**Input:**
```
n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]
```

**Output:**
```
4
```

**Explanation:** Shortest time = 7 minutes. Four ways: 0→6, 0→4→6, 0→1→2→5→6, 0→1→3→5→6

---

## Intuition

The key insight behind this problem lies in combining two powerful concepts: **Dijkstra's Algorithm** for finding shortest paths and **dynamic programming** for counting those paths.

### How Dijkstra Finds Shortest Paths

Dijkstra's Algorithm works by exploring nodes in order of their distance from the source. It maintains a priority queue of nodes to visit, always processing the node with the smallest known distance first. When we visit a node, we check all its neighbors and potentially update their distances if we found a shorter path.

The magic happens because:
- Once a node is popped from the priority queue with distance `d`, we know `d` is the **shortest possible distance** to that node
- No future path through any other node can be shorter (since all other nodes have distance ≥ d)

### How Path Counting Works Alongside Dijkstra

The clever part is that we can count shortest paths **during** the Dijkstra execution without any extra passes:

1. **Initialize**: Start with `ways[0] = 1` (there's exactly one way to be at the source)

2. **When we find a SHORTER path** (`new_dist < dist[v]`):
   - We update `dist[v]` to the new shorter distance
   - We set `ways[v] = ways[u]` — all shortest paths to `v` now go through `u`
   
3. **When we find an EQUAL shortest path** (`new_dist == dist[v]`):
   - We add to the count: `ways[v] = ways[v] + ways[u]`
   - This means we've found **another** way to reach `v` with the same shortest distance

### Why We Add Ways When Distances Are Equal

Consider this scenario: Node `v` can be reached from both `u1` and `u2` with the same distance:

```
Source → u1 → v (distance: 10)
Source → u2 → v (distance: 10)
```

When we process `u1` first and find the path to `v`, we set `ways[v] = ways[u1]`. Later, when we process `u2` and discover `v` at the same distance, we add `ways[u2]` to `ways[v]`. This correctly counts **both** shortest paths.

The key insight is: **we only count paths that achieve the shortest distance**. Any path longer than the shortest is discarded because it would require updating `dist[v]` to a larger value, which we skip.

This is more efficient than:
- First running Dijkstra to find the shortest distance
- Then running a second algorithm to count paths of that exact length

By combining both in one pass, we get O((V+E) log V) instead of two separate passes.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dijkstra with Path Counting (Optimal)** - O((V+E) log V)
2. **Modified Bellman-Ford** - O(V × E) - Alternative approach

---

## Approach 1: Dijkstra with Path Counting (Optimal)

This is the most efficient approach combining Dijkstra's algorithm with dynamic programming for path counting.

### Why It Works

Dijkstra's algorithm finds the shortest path to each node. While running Dijkstra, we can simultaneously count how many shortest paths reach each node. When we find a shorter path, we update both distance and count. When we find an equal path, we add to the count.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def countPaths(self, n: int, roads: List[List[int]]) -> int:
        MOD = 10**9 + 7
        
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v, t in roads:
            graph[u].append((v, t))
            graph[v].append((u, t))
        
        # Dijkstra with path counting
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
                new_dist = d + t
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    ways[v] = ways[u]
                    heapq.heappush(pq, (new_dist, v))
                elif new_dist == dist[v]:
                    ways[v] = (ways[v] + ways[u]) % MOD
        
        return ways[n - 1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int countPaths(int n, vector<vector<int>>& roads) {
        const long MOD = 1e9 + 7;
        
        // Build graph
        vector<vector<pair<int,int>>> graph(n);
        for (auto& r : roads) {
            graph[r[0]].push_back({r[1], r[2]});
            graph[r[1]].push_back({r[0], r[2]});
        }
        
        vector<long> dist(n, LLONG_MAX);
        vector<int> ways(n, 0);
        dist[0] = 0;
        ways[0] = 1;
        
        priority_queue<pair<long,int>, vector<pair<long,int>>, greater<pair<long,int>>> pq;
        pq.push({0, 0});
        
        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (d != dist[u]) continue;
            
            for (auto [v, t] : graph[u]) {
                long nd = d + t;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    ways[v] = ways[u];
                    pq.push({nd, v});
                } else if (nd == dist[v]) {
                    ways[v] = (ways[v] + ways[u]) % MOD;
                }
            }
        }
        
        return ways[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countPaths(int n, int[][] roads) {
        final long MOD = 1_000_000_007L;
        
        // Build graph
        List<Long[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
        for (int[] r : roads) {
            graph[r[0]].add(new Long[]{(long)r[1], (long)r[2]});
            graph[r[1]].add(new Long[]{(long)r[0], (long)r[2]});
        }
        
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        int[] ways = new int[n];
        dist[0] = 0;
        ways[0] = 1;
        
        PriorityQueue<Long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new Long[]{0L, 0L});
        
        while (!pq.isEmpty()) {
            Long[] cur = pq.poll();
            long d = cur[0];
            int u = cur[1].intValue();
            if (d != dist[u]) continue;
            
            for (Long[] edge : graph[u]) {
                int v = edge[0].intValue();
                long t = edge[1];
                long nd = d + t;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    ways[v] = ways[u];
                    pq.add(new Long[]{nd, (long)v});
                } else if (nd == dist[v]) {
                    ways[v] = (int) ((ways[v] + ways[u]) % MOD);
                }
            }
        }
        
        return ways[n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */
var countPaths = function(n, roads) {
    const MOD = 1e9 + 7;
    
    // Build graph
    const graph = Array.from({length: n}, () => []);
    for (const [u, v, t] of roads) {
        graph[u].push([v, t]);
        graph[v].push([u, t]);
    }
    
    const dist = Array(n).fill(Infinity);
    const ways = Array(n).fill(0);
    dist[0] = 0;
    ways[0] = 1;
    
    const pq = [[0, 0]];
    
    while (pq.length) {
        const [d, u] = pq.shift();
        if (d !== dist[u]) continue;
        
        for (const [v, t] of graph[u]) {
            const nd = d + t;
            if (nd < dist[v]) {
                dist[v] = nd;
                ways[v] = ways[u];
                pq.push([nd, v]);
            } else if (nd === dist[v]) {
                ways[v] = (ways[v] + ways[u]) % MOD;
            }
        }
    }
    
    return ways[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((V + E) log V) |
| **Space** | O(V + E) |

---

## Approach 2: Modified Bellman-Ford

### Algorithm Steps

1. Initialize distance array to infinity and ways to 0
2. Relax all edges V-1 times (V is number of vertices)
3. Track number of ways during relaxation
4. Return ways[n-1]

### Why It Works

Bellman-Ford algorithm can also be adapted to count shortest paths. After finding shortest distances, we can count paths by considering all edges and checking if they contribute to shortest paths.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countPaths_bellman(self, n: int, roads: List[List[int]]) -> int:
        MOD = 10**9 + 7
        
        # Initialize
        dist = [float('inf')] * n
        ways = [0] * n
        dist[0] = 0
        ways[0] = 1
        
        # Bellman-Ford: relax edges n-1 times
        for _ in range(n - 1):
            for u, v, t in roads:
                # Check if u can update v
                if dist[u] != float('inf'):
                    nd = dist[u] + t
                    if nd < dist[v]:
                        dist[v] = nd
                        ways[v] = ways[u]
                    elif nd == dist[v]:
                        ways[v] = (ways[v] + ways[u]) % MOD
                
                # Check if v can update u
                if dist[v] != float('inf'):
                    nd = dist[v] + t
                    if nd < dist[u]:
                        dist[u] = nd
                        ways[u] = ways[v]
                    elif nd == dist[u]:
                        ways[u] = (ways[u] + ways[v]) % MOD
        
        return ways[n - 1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int countPaths(int n, vector<vector<int>>& roads) {
        const long MOD = 1e9 + 7;
        
        vector<long> dist(n, LLONG_MAX);
        vector<int> ways(n, 0);
        dist[0] = 0;
        ways[0] = 1;
        
        // Bellman-Ford
        for (int i = 0; i < n - 1; i++) {
            for (auto& r : roads) {
                int u = r[0], v = r[1], t = r[2];
                
                if (dist[u] != LLONG_MAX) {
                    long nd = dist[u] + t;
                    if (nd < dist[v]) {
                        dist[v] = nd;
                        ways[v] = ways[u];
                    } else if (nd == dist[v]) {
                        ways[v] = (ways[v] + ways[u]) % MOD;
                    }
                }
                
                if (dist[v] != LLONG_MAX) {
                    long nd = dist[v] + t;
                    if (nd < dist[u]) {
                        dist[u] = nd;
                        ways[u] = ways[v];
                    } else if (nd == dist[u]) {
                        ways[u] = (ways[u] + ways[v]) % MOD;
                    }
                }
            }
        }
        
        return ways[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countPathsBellman(int n, int[][] roads) {
        final long MOD = 1_000_000_007L;
        
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        int[] ways = new int[n];
        dist[0] = 0;
        ways[0] = 1;
        
        for (int i = 0; i < n - 1; i++) {
            for (int[] r : roads) {
                int u = r[0], v = r[1], t = r[2];
                
                if (dist[u] != Long.MAX_VALUE) {
                    long nd = dist[u] + t;
                    if (nd < dist[v]) {
                        dist[v] = nd;
                        ways[v] = ways[u];
                    } else if (nd == dist[v]) {
                        ways[v] = (int) ((ways[v] + ways[u]) % MOD);
                    }
                }
                
                if (dist[v] != Long.MAX_VALUE) {
                    long nd = dist[v] + t;
                    if (nd < dist[u]) {
                        dist[u] = nd;
                        ways[u] = ways[v];
                    } else if (nd == dist[u]) {
                        ways[u] = (int) ((ways[u] + ways[v]) % MOD);
                    }
                }
            }
        }
        
        return ways[n-1];
    }
}
```

<!-- slide -->
```javascript
var countPathsBellman = function(n, roads) {
    const MOD = 1e9 + 7;
    
    const dist = Array(n).fill(Infinity);
    const ways = Array(n).fill(0);
    dist[0] = 0;
    ways[0] = 1;
    
    // Bellman-Ford
    for (let i = 0; i < n - 1; i++) {
        for (const [u, v, t] of roads) {
            if (dist[u] !== Infinity) {
                const nd = dist[u] + t;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    ways[v] = ways[u];
                } else if (nd === dist[v]) {
                    ways[v] = (ways[v] + ways[u]) % MOD;
                }
            }
            
            if (dist[v] !== Infinity) {
                const nd = dist[v] + t;
                if (nd < dist[u]) {
                    dist[u] = nd;
                    ways[u] = ways[v];
                } else if (nd === dist[u]) {
                    ways[u] = (ways[u] + ways[v]) % MOD;
                }
            }
        }
    }
    
    return ways[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V × E) |
| **Space** | O(V) |

---

## Comparison of Approaches

| Aspect | Dijkstra + Counting | Bellman-Ford |
|--------|-------------------|--------------|
| **Time Complexity** | O((V+E) log V) | O(V × E) |
| **Space Complexity** | O(V + E) | O(V) |
| **Best For** | Sparse graphs | Dense graphs |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

**Best Approach:** Use Approach 1 (Dijkstra with Path Counting) for optimal performance.

---

## Related Problems

### Similar Graph Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Ways to Arrive at Destination | [Link](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/) | This problem |
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS shortest path |
| Path With Maximum Probability | [Link](https://leetcode.com/problems/path-with-maximum-probability/) | Dijkstra variation |
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Standard Dijkstra |

### Pattern Reference

| Pattern | Description |
|---------|-------------|
| Dijkstra | Shortest path with positive weights |
| Bellman-Ford | Shortest path (handles negative weights) |
| BFS | Unweighted shortest path |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Number of Ways to Arrive at Destination](https://www.youtube.com/watch?v=7X8sD6y8zWw)** - Clear explanation with visual examples
2. **[Dijkstra's Algorithm](https://www.youtube.com/watch?v=5Linky5D3-GU)** - Understanding shortest path algorithms
3. **[Counting Shortest Paths](https://www.youtube.com/watch?v=6xLSN1F1C88)** - Path counting techniques

---

## Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def countPaths(self, n: int, roads: List[List[int]]) -> int:
        MOD = 10**9 + 7
        
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v, t in roads:
            graph[u].append((v, t))
            graph[v].append((u, t))
        
        # Dijkstra with path counting
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
                new_dist = d + t
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    ways[v] = ways[u]
                    heapq.heappush(pq, (new_dist, v))
                elif new_dist == dist[v]:
                    ways[v] = (ways[v] + ways[u]) % MOD
        
        return ways[n - 1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int countPaths(int n, vector<vector<int>>& roads) {
        const long MOD = 1e9 + 7;
        
        // Build graph
        vector<vector<pair<int,int>>> graph(n);
        for (auto& r : roads) {
            graph[r[0]].push_back({r[1], r[2]});
            graph[r[1]].push_back({r[0], r[2]});
        }
        
        vector<long> dist(n, LLONG_MAX);
        vector<int> ways(n, 0);
        dist[0] = 0;
        ways[0] = 1;
        
        priority_queue<pair<long,int>, vector<pair<long,int>>, greater<pair<long,int>>> pq;
        pq.push({0, 0});
        
        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (d != dist[u]) continue;
            
            for (auto [v, t] : graph[u]) {
                long nd = d + t;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    ways[v] = ways[u];
                    pq.push({nd, v});
                } else if (nd == dist[v]) {
                    ways[v] = (ways[v] + ways[u]) % MOD;
                }
            }
        }
        
        return ways[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countPaths(int n, int[][] roads) {
        final long MOD = 1_000_000_007L;
        
        // Build graph
        List<long[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
        for (int[] r : roads) {
            graph[r[0]].add(new long[]{r[1], r[2]});
            graph[r[1]].add(new long[]{r[0], r[2]});
        }
        
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        int[] ways = new int[n];
        dist[0] = 0;
        ways[0] = 1;
        
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0, 0});
        
        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long d = cur[0];
            int u = (int) cur[1];
            if (d != dist[u]) continue;
            
            for (long[] edge : graph[u]) {
                int v = (int) edge[0];
                long t = edge[1];
                long nd = d + t;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    ways[v] = ways[u];
                    pq.add(new long[]{nd, v});
                } else if (nd == dist[v]) {
                    ways[v] = (int) ((ways[v] + ways[u]) % MOD);
                }
            }
        }
        
        return ways[n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */
var countPaths = function(n, roads) {
    const MOD = 1e9 + 7;
    
    // Build graph
    const graph = Array.from({length: n}, () => []);
    for (const [u, v, t] of roads) {
        graph[u].push([v, t]);
        graph[v].push([u, t]);
    }
    
    const dist = Array(n).fill(Infinity);
    const ways = Array(n).fill(0);
    dist[0] = 0;
    ways[0] = 1;
    
    const pq = [[0, 0]];
    
    while (pq.length) {
        const [d, u] = pq.shift();
        if (d !== dist[u]) continue;
        
        for (const [v, t] of graph[u]) {
            const nd = d + t;
            if (nd < dist[v]) {
                dist[v] = nd;
                ways[v] = ways[u];
                pq.push([nd, v]);
            } else if (nd === dist[v]) {
                ways[v] = (ways[v] + ways[u]) % MOD;
            }
        }
    }
    
    return ways[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((V + E) log V) |
| **Space** | O(V + E) |

---

## Follow-up Questions

### Q1: How does this differ from counting all paths?

**Answer:** We only count paths with the minimum total time. Dijkstra naturally finds shortest paths, and we only add ways when we find equal shortest distances.

---

### Q2: What if there are multiple shortest paths with the same distance?

**Answer:** The algorithm handles this by adding ways[v] = (ways[v] + ways[u]) % MOD whenever we find new_dist == dist[v].

---

### Q3: How would you reconstruct one shortest path?

**Answer:** Maintain a parent array. When updating dist[v], set parent[v] = u. Backtrack from destination to reconstruct the path.

---

### Q4: What if edge weights can be zero?

**Answer:** Dijkstra still works with zero weights, but we need to be careful about infinite loops. The algorithm naturally handles this since we're using a priority queue.

---

### Q5: How would you find all shortest paths?

**Answer:** Instead of just tracking parent, track all parents (list). Then use DFS/BFS to enumerate all paths from source to destination.

---

### Q6: What edge cases should be tested?

**Answer:**
- Single node (n=1): ways[0] = 1
- Direct edge from 0 to n-1
- Multiple equal shortest paths
- Large weights (up to 10^9)
- Graph with cycles

---

## Common Pitfalls

### 1. Modulo Arithmetic
**Issue**: Not applying modulo during addition.

**Solution**: Always use `ways[v] = (ways[v] + ways[u]) % MOD` when adding paths.

### 2. Priority Queue Type
**Issue**: Using wrong type in priority queue causing comparison issues.

**Solution**: Use tuple (distance, node) and heapq in Python.

### 3. Early Termination
**Issue**: Stopping when destination is popped first time.

**Solution**: Don't stop early - there might be multiple paths with the same shortest distance discovered later. Process entire graph.

### 4. Distance Array Initialization
**Issue**: Not initializing distance to infinity.

**Solution**: Use `float('inf')` or `LLONG_MAX` for proper comparison.

### 5. Graph Building
**Issue**: Forgetting to add both directions for undirected roads.

**Solution**: Add edges for both directions: graph[u].append((v, t)) and graph[v].append((u, t)).

---

## Summary

The **Number of Ways to Arrive at Destination** demonstrates **Dijkstra with Path Counting**:
- Track shortest distances and number of ways
- When finding equal shortest path, add ways
- O((V+E) log V) time complexity
