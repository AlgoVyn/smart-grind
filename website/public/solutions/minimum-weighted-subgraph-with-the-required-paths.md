# Minimum Weighted Subgraph With The Required Paths

## Problem Description

You are given an integer `n` denoting the number of nodes of a weighted directed graph. The nodes are numbered from `0` to `n - 1`.

You are also given a 2D integer array `edges` where `edges[i] = [fromi, toi, weighti]` denotes that there exists a directed edge from `fromi` to `toi` with weight `weighti`.

Lastly, you are given three distinct integers `src1`, `src2`, and `dest` denoting three distinct nodes of the graph.

Return the minimum weight of a subgraph of the graph such that it is possible to reach `dest` from both `src1` and `src2` via a set of edges of this subgraph. In case such a subgraph does not exist, return `-1`.

**Link to problem:** [Minimum Weighted Subgraph with the Required Paths - LeetCode 2203](https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/)

## Constraints
- `3 <= n <= 10^5`
- `0 <= edges.length <= 10^5`
- `edges[i].length == 3`
- `0 <= fromi, toi, src1, src2, dest <= n - 1`
- `fromi != toi`
- `src1`, `src2`, and `dest` are pairwise distinct
- `1 <= weight[i] <= 10^5`

---

## Pattern: Dijkstra's Algorithm - Multiple Sources

This problem demonstrates using **Dijkstra's Algorithm from Multiple Sources** to find minimum weight paths.

### Core Concept

- **Three Dijkstra Runs**: From src1, src2, and from dest (reversed graph)
- **Meeting Point**: Find node x that minimizes dist1[x] + dist2[x] + distDest[x]
- **Graph Reversal**: For paths TO dest, reverse all edges

---

## Examples

### Example

**Input:**
```
n = 6
edges = [[0, 2, 2], [0, 5, 6], [1, 0, 3], [1, 4, 5], [2, 1, 1], [2, 3, 3], [2, 3, 4], [3, 4, 2], [4, 5, 1]]
src1 = 0, src2 = 1, dest = 5
```

**Output:**
```
9
```

### Example 2

**Input:**
```
n = 3
edges = [[0, 1, 1], [2, 1, 1]]
src1 = 0, src2 = 1, dest = 2
```

**Output:**
```
-1
```

---

## Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def minimumWeight(self, n: int, edges: List[List[int]], src1: int, src2: int, dest: int) -> int:
        """
        Find minimum weight subgraph using three Dijkstra runs.
        
        Args:
            n: Number of nodes
            edges: List of directed edges with weights
            src1: First source node
            src2: Second source node  
            dest: Destination node
            
        Returns:
            Minimum weight, or -1 if impossible
        """
        def dijkstra(graph, start):
            """Run Dijkstra's algorithm from start node."""
            dist = [float('inf')] * n
            dist[start] = 0
            pq = [(0, start)]
            
            while pq:
                d, u = heapq.heappop(pq)
                if d > dist[u]:
                    continue
                for v, w in graph[u]:
                    if dist[v] > dist[u] + w:
                        dist[v] = dist[u] + w
                        heapq.heappush(pq, (dist[v], v))
            return dist
        
        # Build forward and reverse graphs
        graph = [[] for _ in range(n)]
        rev_graph = [[] for _ in range(n)]
        for u, v, w in edges:
            graph[u].append((v, w))
            rev_graph[v].append((u, w))
        
        # Run Dijkstra from all three sources
        dist1 = dijkstra(graph, src1)
        dist2 = dijkstra(graph, src2)
        dist_dest = dijkstra(rev_graph, dest)  # Reversed for paths TO dest
        
        # Find minimum at meeting node
        ans = float('inf')
        for x in range(n):
            if dist1[x] != float('inf') and dist2[x] != float('inf') and dist_dest[x] != float('inf'):
                ans = min(ans, dist1[x] + dist2[x] + dist_dest[x])
        
        return ans if ans != float('inf') else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    long long minimumWeight(int n, vector<vector<int>>& edges, int src1, int src2, int dest) {
        // Build graphs
        vector<vector<pair<int,int>>> graph(n), rev_graph(n);
        for (auto& e : edges) {
            graph[e[0]].push_back({e[1], e[2]});
            rev_graph[e[1]].push_back({e[0], e[2]});
        }
        
        auto dijkstra = [&](int src, auto& g) {
            vector<long long> dist(n, LLONG_MAX);
            priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<pair<long long,int>>> pq;
            dist[src] = 0;
            pq.push({0, src});
            
            while (!pq.empty()) {
                auto [d, u] = pq.top(); pq.pop();
                if (d > dist[u]) continue;
                for (auto [v, w] : g[u]) {
                    if (dist[v] > dist[u] + w) {
                        dist[v] = dist[u] + w;
                        pq.push({dist[v], v});
                    }
                }
            }
            return dist;
        };
        
        auto d1 = dijkstra(src1, graph);
        auto d2 = dijkstra(src2, graph);
        auto dd = dijkstra(dest, rev_graph);
        
        long long ans = LLONG_MAX;
        for (int i = 0; i < n; i++) {
            if (d1[i] != LLONG_MAX && d2[i] != LLONG_MAX && dd[i] != LLONG_MAX) {
                ans = min(ans, d1[i] + d2[i] + dd[i]);
            }
        }
        
        return ans == LLONG_MAX ? -1 : ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public long minimumWeight(int n, int[][] edges, int src1, int src2, int dest) {
        // Build graphs
        List<long[]>[] graph = new ArrayList[n];
        List<long[]>[] revGraph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
            revGraph[i] = new ArrayList<>();
        }
        for (int[] e : edges) {
            graph[e[0]].add(new long[]{e[1], e[2]});
            revGraph[e[1]].add(new long[]{e[0], e[2]});
        }
        
        long[] d1 = dijkstra(n, src1, graph);
        long[] d2 = dijkstra(n, src2, graph);
        long[] dd = dijkstra(n, dest, revGraph);
        
        long ans = Long.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            if (d1[i] != Long.MAX_VALUE && d2[i] != Long.MAX_VALUE && dd[i] != Long.MAX_VALUE) {
                ans = Math.min(ans, d1[i] + d2[i] + dd[i]);
            }
        }
        
        return ans == Long.MAX_VALUE ? -1 : ans;
    }
    
    private long[] dijkstra(int n, int src, List<long[]>[] graph) {
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0, src});
        
        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long d = cur[0];
            int u = (int) cur[1];
            if (d > dist[u]) continue;
            for (long[] edge : graph[u]) {
                int v = (int) edge[0];
                long w = edge[1];
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    pq.add(new long[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} src1
 * @param {number} src2
 * @param {number} dest
 * @return {number}
 */
var minimumWeight = function(n, edges, src1, src2, dest) {
    // Build graphs
    const graph = Array.from({length: n}, () => []);
    const revGraph = Array.from({length: n}, () => []);
    for (const [u, v, w] of edges) {
        graph[u].push([v, w]);
        revGraph[v].push([u, w]);
    }
    
    const dijkstra = (start, g) => {
        const dist = Array(n).fill(Infinity);
        dist[start] = 0;
        const pq = [[0, start]];
        
        while (pq.length) {
            const [d, u] = pq.shift();
            if (d > dist[u]) continue;
            for (const [v, w] of g[u]) {
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    pq.push([dist[v], v]);
                }
            }
        }
        return dist;
    };
    
    const d1 = dijkstra(src1, graph);
    const d2 = dijkstra(src2, graph);
    const dd = dijkstra(dest, revGraph);
    
    let ans = Infinity;
    for (let i = 0; i < n; i++) {
        if (d1[i] !== Infinity && d2[i] !== Infinity && dd[i] !== Infinity) {
            ans = Math.min(ans, d1[i] + d2[i] + dd[i]);
        }
    }
    
    return ans === Infinity ? -1 : ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((V + E) log V) - three Dijkstra runs |
| **Space** | O(V + E) - graph storage |

---

## Intuition

The key insight for this problem is understanding that we need to find a subgraph where there exist paths from both `src1` and `src2` to `dest`. The total weight of this subgraph is the sum of all edges in the paths from `src1` to the meeting point, from `src2` to the meeting point, and from the meeting point to `dest`.

### Key Observations

1. **Meeting Point Concept**: Any valid subgraph must have a "meeting point" x where:
   - There is a path from src1 to x
   - There is a path from src2 to x
   - There is a path from x to dest

2. **Total Weight Formula**: For any meeting point x, the total weight is:
   `dist1[x] + dist2[x] + distDest[x]`
   
   where dist1 is distance from src1, dist2 from src2, and distDest from x to dest.

3. **Reverse Graph Trick**: Dijkstra finds paths FROM a source. To find paths TO dest, reverse all edges and run Dijkstra from dest.

4. **Why Three Dijkstras?** We need:
   - Shortest paths from src1 to all nodes
   - Shortest paths from src2 to all nodes  
   - Shortest paths TO dest from all nodes (reverse graph)

### Algorithm Overview

1. Build both forward and reversed adjacency lists
2. Run Dijkstra from src1, src2, and dest (on reversed graph)
3. For each node x, check if all three distances are finite
4. Find minimum of dist1[x] + dist2[x] + distDest[x]
5. Return -1 if no valid meeting point exists

---

## Multiple Approaches with Code

## Approach 1: Three Dijkstra Runs (Optimal) ⭐

This is the optimal solution using three separate Dijkstra runs.

#### Algorithm

1. **Build Graphs**: Create forward and reversed adjacency lists
2. **Run Dijkstra**: Execute from src1, src2, and dest (reversed)
3. **Find Minimum**: Iterate all nodes to find minimum sum

---

## Approach 2: Optimized Single-Pass with Early Termination

This approach adds optimizations to stop Dijkstra when meeting point is found.

#### Algorithm

1. Similar to Approach 1 but with early termination
2. Stop Dijkstra runs when all needed nodes are processed

---

## Comparison of Approaches

| Aspect | Three Dijkstra | Early Termination |
|--------|-----------------|-------------------|
| **Time** | O((V+E) log V) | O((V+E) log V) |
| **Space** | O(V + E) | O(V + E) |
| **Implementation** | Simpler | More complex |
| **Best For** | Most cases | Large sparse graphs |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[LeetCode 2203 - Minimum Weighted Subgraph](https://www.youtube.com/watch?v=XXXX)** - Official solution explanation
2. **[Multiple Source Dijkstra](https://www.youtube.com/watch?v=XXXX)** - Understanding multi-source shortest paths
3. **[Dijkstra's Algorithm](https://www.youtube.com/watch?v=5_2R-3O7G7U)** - Comprehensive Dijkstra tutorial

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Path Sum | [Link](https://leetcode.com/problems/minimum-path-sum/) | Single source-dest |
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS for shortest path |

---

## Follow-up Questions

### Q1: Why reverse the graph for dest?

**Answer:** Dijkstra finds paths FROM a source. To find paths TO dest, we reverse edges and find paths FROM dest in the reversed graph.

---

### Q2: What if no path exists?

**Answer:** Return -1 if any distance remains infinity.

---

## Common Pitfalls

### 1. Using Wrong Graph for dest
A critical mistake is running Dijkstra on the original graph for dest instead of the reversed graph. Remember: dest needs paths TO it, not FROM it.

### 2. Integer Overflow
With weights up to 10^5 and up to 10^5 nodes, sum can exceed 2^31. Use long (64-bit) for distances.

### 3. Not Checking for Unreachable Nodes
Always check if distances are infinity before using them in calculations. If any source can't reach a node, skip it.

### 4. Incorrect Meeting Point Selection
The meeting point x must be reachable from both src1 AND src2 AND can reach dest. Don't just pick minimum sum without checking reachability.

### 5. Multiple Dijkstra Runs Performance
Running three separate Dijkstra is necessary but make sure to use efficient implementations. Consider early termination optimizations.

---

## Summary

The **Minimum Weighted Subgraph** problem demonstrates **Multiple Source Dijkstra**:
- Run Dijkstra from src1, src2, and dest (reversed)
- Find meeting point minimizing total path weight
- O((V+E) log V) time complexity
