# Network Delay Time

## Problem Description

[LeetCode Link](https://leetcode.com/problems/network-delay-time/)

You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges `times[i] = (ui, vi, wi)`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.

We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.

This is **LeetCode Problem #743** and is classified as a Medium difficulty problem. It tests your ability to apply shortest path algorithms to real-world routing problems.

---

## Pattern: Dijkstra's Algorithm

This problem uses **Dijkstra's shortest path algorithm** with a priority queue (min-heap). The key is to find the maximum of all shortest path times from source node k to all other nodes. If any node is unreachable, return -1.

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

**Explanation:**
- Signal starts at node 2
- Time 1: Signal reaches node 1 (via edge 2→1)
- Time 1: Signal reaches node 3 (via edge 2→3)
- Time 2: Signal reaches node 4 (via edge 3→4)
- Maximum time = 2

### Example 2

**Input:**
```python
times = [[1,2,1]], n = 2, k = 1
```

**Output:**
```python
1
```

**Explanation:** Signal reaches node 2 in 1 time unit.

### Example 3

**Input:**
```python
times = [[1,2,1]], n = 2, k = 2
```

**Output:**
```python
-1
```

**Explanation:** Node 2 has no outgoing edges, so node 1 cannot receive the signal.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= k <= n <= 100` | Number of nodes and source node |
| `1 <= times.length <= 6000` | Number of edges |
| `times[i].length == 3` | Each edge has source, target, weight |
| `1 <= ui, vi <= n` | Node indices |
| `ui != vi` | No self-loops |
| `0 <= wi <= 100` | Edge weights (non-negative) |
| All `(ui, vi)` pairs unique | No parallel edges |

---

## Intuition

The key insight for this problem is understanding that we need to find the **maximum** of all **shortest path** times from the source node k to every other node.

### Key Observations

1. **Shortest Path First**: We need the minimum time to reach each node, which is exactly what Dijkstra's algorithm computes.

2. **Maximum of Shortest Paths**: Once we have the shortest path to each node, the answer is the maximum among all these shortest paths.

3. **Unreachable Detection**: If any node's shortest path is still infinity (unreachable), we return -1.

4. **Why Dijkstra Works**: All edge weights are non-negative (wi >= 0), which is the exact condition for Dijkstra's algorithm to work correctly.

### Algorithm Overview

1. Build an adjacency list from the input edges
2. Initialize distances to infinity, except source node k (distance 0)
3. Use a min-heap to process nodes in order of increasing distance
4. For each node, relax all outgoing edges
5. After processing, find the maximum distance
6. Return -1 if any node is unreachable, otherwise return the maximum

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dijkstra's Algorithm with Min-Heap** - Optimal solution
2. **Bellman-Ford Algorithm** - Alternative approach (less optimal)

---

## Approach 1: Dijkstra's Algorithm with Min-Heap (Optimal)

### Why It Works

Dijkstra's algorithm works by maintaining a priority queue of nodes to visit, ordered by their current known distance from the source. At each step, we visit the node with the smallest distance, and if we've found a shorter path to any of its neighbors, we update them. This greedy approach ensures we find the shortest path to all reachable nodes.

### Code Implementation

````carousel
```python
import heapq
from typing import List
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        """
        Find the minimum time for signal to reach all nodes using Dijkstra's algorithm.
        
        Args:
            times: List of directed edges [source, target, weight]
            n: Number of nodes (1-indexed)
            k: Source node for signal
            
        Returns:
            Maximum time to reach all nodes, or -1 if impossible
        """
        # Build adjacency list
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))
        
        # Initialize distances to infinity
        dist = {i: float('inf') for i in range(1, n + 1)}
        dist[k] = 0
        
        # Min-heap: (distance, node)
        pq = [(0, k)]
        
        while pq:
            d, u = heapq.heappop(pq)
            
            # Skip if we've already found a shorter path
            if d > dist[u]:
                continue
            
            # Explore neighbors
            for v, w in graph[u]:
                new_dist = dist[u] + w
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    heapq.heappush(pq, (new_dist, v))
        
        # Find maximum distance
        max_dist = max(dist.values())
        
        # Return -1 if any node is unreachable
        return max_dist if max_dist != float('inf') else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <unordered_map>
#include <climits>
using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Build adjacency list
        unordered_map<int, vector<pair<int, int>>> graph;
        for (const auto& edge : times) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph[u].push_back({v, w});
        }
        
        // Initialize distances to infinity
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;
        
        // Min-heap: (distance, node)
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        pq.push({0, k});
        
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            
            // Skip if we've already found a shorter path
            if (d > dist[u]) continue;
            
            // Explore neighbors
            if (graph.find(u) != graph.end()) {
                for (const auto& [v, w] : graph[u]) {
                    int new_dist = dist[u] + w;
                    if (new_dist < dist[v]) {
                        dist[v] = new_dist;
                        pq.push({new_dist, v});
                    }
                }
            }
        }
        
        // Find maximum distance
        int max_dist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INT_MAX) return -1;
            max_dist = max(max_dist, dist[i]);
        }
        
        return max_dist;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Build adjacency list
        Map<Integer, List<int[]>> graph = new HashMap<>();
        for (int[] edge : times) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph.computeIfAbsent(u, key -> new ArrayList<>()).add(new int[]{v, w});
        }
        
        // Initialize distances to infinity
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        
        // Min-heap: (distance, node)
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, k});
        
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int d = current[0];
            int u = current[1];
            
            // Skip if we've already found a shorter path
            if (d > dist[u]) continue;
            
            // Explore neighbors
            if (graph.containsKey(u)) {
                for (int[] neighbor : graph.get(u)) {
                    int v = neighbor[0];
                    int w = neighbor[1];
                    int newDist = dist[u] + w;
                    if (newDist < dist[v]) {
                        dist[v] = newDist;
                        pq.add(new int[]{newDist, v});
                    }
                }
            }
        }
        
        // Find maximum distance
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            maxDist = Math.max(maxDist, dist[i]);
        }
        
        return maxDist;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function(times, n, k) {
    // Build adjacency list
    const graph = new Map();
    for (const [u, v, w] of times) {
        if (!graph.has(u)) graph.set(u, []);
        graph.get(u).push([v, w]);
    }
    
    // Initialize distances to infinity
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    
    // Min-heap: [distance, node]
    const pq = [[0, k]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();
        
        // Skip if we've already found a shorter path
        if (d > dist[u]) continue;
        
        // Explore neighbors
        if (graph.has(u)) {
            for (const [v, w] of graph.get(u)) {
                const newDist = dist[u] + w;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    pq.push([newDist, v]);
                }
            }
        }
    }
    
    // Find maximum distance
    let maxDist = 0;
    for (let i = 1; i <= n; i++) {
        if (dist[i] === Infinity) return -1;
        maxDist = Math.max(maxDist, dist[i]);
    }
    
    return maxDist;
};
```
````

### Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | O((V + E) log V) - due to priority queue operations |
| Space | O(V + E) - for graph and distance arrays |

---

## Approach 2: Bellman-Ford Algorithm

### Why It Works

Bellman-Ford is an alternative algorithm that computes shortest paths by iteratively relaxing all edges V-1 times. While less efficient than Dijkstra for this problem, it can handle negative edge weights (though this problem doesn't have them).

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        """
        Find minimum time using Bellman-Ford algorithm.
        
        Time Complexity: O(VE)
        Space Complexity: O(V)
        """
        # Initialize distances to infinity
        dist = [float('inf')] * (n + 1)
        dist[k] = 0
        
        # Relax all edges V-1 times
        for _ in range(n - 1):
            updated = False
            for u, v, w in times:
                if dist[u] != float('inf') and dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    updated = True
            # Early termination if no updates
            if not updated:
                break
        
        # Find maximum distance
        max_dist = max(dist[1:])
        
        return max_dist if max_dist != float('inf') else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Initialize distances to infinity
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < n - 1; i++) {
            bool updated = false;
            for (const auto& edge : times) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
            if (!updated) break;
        }
        
        // Find maximum distance
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INT_MAX) return -1;
            maxDist = max(maxDist, dist[i]);
        }
        
        return maxDist;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Initialize distances to infinity
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < n - 1; i++) {
            boolean updated = false;
            for (int[] edge : times) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
            if (!updated) break;
        }
        
        // Find maximum distance
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            maxDist = Math.max(maxDist, dist[i]);
        }
        
        return maxDist;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function(times, n, k) {
    // Initialize distances to infinity
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    
    // Relax all edges V-1 times
    for (let i = 0; i < n - 1; i++) {
        let updated = false;
        for (const [u, v, w] of times) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }
        if (!updated) break;
    }
    
    // Find maximum distance
    let maxDist = 0;
    for (let i = 1; i <= n; i++) {
        if (dist[i] === Infinity) return -1;
        maxDist = Math.max(maxDist, dist[i]);
    }
    
    return maxDist;
};
```
````

### Complexity Analysis

| Metric | Dijkstra | Bellman-Ford |
|--------|----------|--------------|
| Time | O((V+E) log V) | O(VE) |
| Space | O(V + E) | O(V) |
| Recommended | ✅ Yes | ❌ No |

---

## Common Pitfalls

1. **Not checking visited/distance**: Skip processing if current distance > stored distance (stale entry in heap).
2. **Graph is 1-indexed**: Input nodes are 1-indexed but arrays are 0-indexed; adjust accordingly.
3. **Return -1 for unreachable**: Check if max distance is still infinity after algorithm completes.
4. **Zero-weight edges**: The problem allows wi = 0, which Dijkstra's handles correctly with the distance check.
5. **Initial distance**: Initialize all distances to infinity, set source k to 0.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Google, Facebook
- **Difficulty**: Medium
- **Concepts Tested**: Graph algorithms, shortest path, priority queues

### Learning Outcomes

1. **Dijkstra's Algorithm**: Master the classic shortest path algorithm
2. **Priority Queue Usage**: Learn efficient implementation with heaps
3. **Graph Representation**: Understand adjacency lists vs matrices
4. **Time Complexity Analysis**: Compare different algorithm approaches

---

## Related Problems

### Same Pattern (Shortest Path)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Shortest Path in Binary Matrix](/solutions/shortest-path-in-binary-matrix.md) | 1293 | Medium | Grid shortest path |
| [Path With Minimum Effort](/solutions/path-with-minimum-effort.md) | 1631 | Medium | Binary search + BFS |
| [Cheapest Flights Within K Stops](/solutions/cheapest-flights-within-k-stops.md) | 787 | Medium | K-stop flights |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Clone Graph](/solutions/clone-graph.md) | 133 | Medium | Graph traversal |
| [Number of Connected Components](/solutions/number-of-connected-components-in-an-undirected-graph.md) | 323 | Medium | Union-Find |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Network Delay Time - NeetCode](https://www.youtube.com/watch?v=)** - Clear explanation
2. **[Dijkstra's Algorithm Explained](https://www.youtube.com/watch?v=)** - Visual walkthrough
3. **[Graph Algorithms Tutorial](https://www.youtube.com/watch?v=)** - Comprehensive guide

---

## Follow-up Questions

### Q1: How would you modify the solution to return the path taken?

**Answer:** Maintain a parent array that tracks the previous node for each node in the shortest path. When we update dist[v], set parent[v] = u.

### Q2: What if some edges have negative weights?

**Answer:** Dijkstra's doesn't work with negative weights. You'd need to use Bellman-Ford, which handles negative weights (but not negative cycles).

### Q3: How would you find which nodes are unreachable?

**Answer:** After running the algorithm, check which nodes still have dist[node] == infinity. These are unreachable from the source.

### Q4: How would you handle multiple source nodes?

**Answer:** Create a super-source node that connects to all sources with 0-weight edges, then run Dijkstra from the super-source.

---

## Summary

The **Network Delay Time** problem is a classic application of Dijkstra's algorithm:

- **Build graph**: Create adjacency list from edges
- **Initialize**: Set source distance to 0, others to infinity
- **Process**: Use min-heap to always process closest unvisited node
- **Relax**: Update neighbors if shorter path found
- **Result**: Maximum of all shortest paths, or -1 if unreachable

Key takeaways:
1. Dijkstra's algorithm with min-heap is optimal for this problem
2. All edge weights are non-negative, so greedy approach works
3. The answer is the maximum among shortest paths to all nodes
4. Return -1 if any node remains unreachable

This problem is essential for understanding shortest path algorithms and their real-world applications in network routing.
