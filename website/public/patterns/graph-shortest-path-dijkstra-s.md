# Graph - Shortest Path (Dijkstra's Algorithm)

## Problem Description

Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue (min-heap) to always expand the node with the smallest known distance, guaranteeing optimal paths through the greedy choice property.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O((V + E) log V) with binary heap |
| Space Complexity | O(V) for distances and priority queue |
| Input | Weighted graph with non-negative weights |
| Output | Shortest distances from source to all nodes |
| Approach | Greedy with priority queue |

### When to Use

- Find shortest paths in graphs with non-negative weights
- Calculate minimum cost paths in networks
- Solve routing and navigation problems
- Find paths with minimum total weight
- Network delay and signal propagation problems
- When edge weights represent costs, distances, or times

## Intuition

The key insight is the greedy choice property: the shortest path to the closest unvisited node is finalized and will never change.

The "aha!" moments:

1. **Greedy choice**: Always process the closest unvisited node first
2. **Relaxation**: Update distances through better paths when found
3. **Priority queue**: Efficiently get the minimum distance node
4. **Optimal substructure**: Shortest path to a node contains shortest paths to intermediates
5. **Non-negative constraint**: Required for greedy choice to be correct

## Solution Approaches

### Approach 1: Standard Dijkstra with Priority Queue ✅ Recommended

#### Algorithm

1. Initialize distances array with infinity, except source = 0
2. Initialize priority queue with (0, source)
3. While queue not empty:
   - Pop node with minimum distance
   - If current distance > recorded distance, skip (outdated entry)
   - For each neighbor: calculate new distance = current + edge weight
   - If new distance < recorded distance, update and push to queue
4. Return distances array

#### Implementation

````carousel
```python
import heapq

def dijkstra(n: int, edges: list[list[int]], source: int) -> list[int]:
    """
    Dijkstra's algorithm for shortest paths.
    Time: O((V + E) log V), Space: O(V)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    # Initialize distances
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, source)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        # Skip if we found a better path already
        if d > dist[node]:
            continue
        
        # Explore neighbors
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return dist


def dijkstra_with_path(n, edges, source, target):
    """Returns shortest path from source to target."""
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    parent = [-1] * n
    dist[source] = 0
    
    pq = [(0, source)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        if d > dist[node]:
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                parent[neighbor] = node
                heapq.heappush(pq, (new_dist, neighbor))
    
    # Reconstruct path
    if dist[target] == float('inf'):
        return None, -1
    
    path = []
    curr = target
    while curr != -1:
        path.append(curr)
        curr = parent[curr]
    
    return path[::-1], dist[target]


def network_delay_time(times, n, k):
    """
    LeetCode 743 - Network Delay Time
    Time for all nodes to receive signal from node k.
    """
    graph = [[] for _ in range(n + 1)]
    for u, v, w in times:
        graph[u].append((v, w))
    
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        if d > dist[node]:
            continue
        
        for neighbor, w in graph[node]:
            new_dist = d + w
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    max_dist = max(dist[1:])  # Skip index 0 (nodes are 1-indexed)
    return max_dist if max_dist != float('inf') else -1
```
<!-- slide -->
```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int, int>>> graph(n + 1);
        for (const auto& t : times) {
            graph[t[0]].push_back({t[1], t[2]});
        }
        
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;
        
        // Min-heap: {distance, node}
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
        pq.push({0, k});
        
        while (!pq.empty()) {
            auto [d, node] = pq.top();
            pq.pop();
            
            if (d > dist[node]) continue;
            
            for (auto& [neighbor, w] : graph[node]) {
                int newDist = d + w;
                if (newDist < dist[neighbor]) {
                    dist[neighbor] = newDist;
                    pq.push({newDist, neighbor});
                }
            }
        }
        
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            maxDist = max(maxDist, dist[i]);
        }
        return maxDist == INT_MAX ? -1 : maxDist;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<int[]>[] graph = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) graph[i] = new ArrayList<>();
        for (int[] t : times) {
            graph[t[0]].add(new int[]{t[1], t[2]});
        }
        
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        
        // Min-heap: [distance, node]
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, k});
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], node = curr[1];
            
            if (d > dist[node]) continue;
            
            for (int[] edge : graph[node]) {
                int neighbor = edge[0], w = edge[1];
                int newDist = d + w;
                if (newDist < dist[neighbor]) {
                    dist[neighbor] = newDist;
                    pq.offer(new int[]{newDist, neighbor});
                }
            }
        }
        
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            maxDist = Math.max(maxDist, dist[i]);
        }
        return maxDist == Integer.MAX_VALUE ? -1 : maxDist;
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
function networkDelayTime(times, n, k) {
    const graph = Array.from({length: n + 1}, () => []);
    for (const [u, v, w] of times) {
        graph[u].push([v, w]);
    }
    
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    
    // Min-heap: [distance, node]
    const pq = [[0, k]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);  // Simple sort for min-heap
        const [d, node] = pq.shift();
        
        if (d > dist[node]) continue;
        
        for (const [neighbor, w] of graph[node]) {
            const newDist = d + w;
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                pq.push([newDist, neighbor]);
            }
        }
    }
    
    let maxDist = 0;
    for (let i = 1; i <= n; i++) {
        maxDist = Math.max(maxDist, dist[i]);
    }
    return maxDist === Infinity ? -1 : maxDist;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O((V + E) log V) - Each node pushed/popped from heap |
| Space | O(V) - Distances array and priority queue |

### Approach 2: Dijkstra with Set (Optimized for Dense Graphs)

For dense graphs, using an ordered set can be more efficient.

#### Implementation

````carousel
```python
import sortedcontainers

def dijkstra_set(n, edges, source):
    """
    Dijkstra using sorted set (for dense graphs).
    Time: O(V^2) worst case, but O(E + V log V) average
    """
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Sorted set of (distance, node)
    s = sortedcontainers.SortedSet()
    s.add((0, source))
    
    while s:
        d, node = s.pop(0)
        
        for neighbor, w in graph[node]:
            new_dist = d + w
            if new_dist < dist[neighbor]:
                # Remove old entry if exists
                if dist[neighbor] != float('inf'):
                    s.discard((dist[neighbor], neighbor))
                dist[neighbor] = new_dist
                s.add((new_dist, neighbor))
    
    return dist
```
<!-- slide -->
```cpp
// For C++, std::set can be used similarly
class Solution {
public:
    vector<int> dijkstraSet(int n, vector<vector<int>>& edges, int source) {
        vector<vector<pair<int, int>>> graph(n);
        for (auto& e : edges) {
            graph[e[0]].push_back({e[1], e[2]});
        }
        
        vector<int> dist(n, INT_MAX);
        dist[source] = 0;
        
        set<pair<int, int>> s;  // {distance, node}
        s.insert({0, source});
        
        while (!s.empty()) {
            auto it = s.begin();
            int d = it->first;
            int node = it->second;
            s.erase(it);
            
            for (auto& [neighbor, w] : graph[node]) {
                int newDist = d + w;
                if (newDist < dist[neighbor]) {
                    s.erase({dist[neighbor], neighbor});
                    dist[neighbor] = newDist;
                    s.insert({newDist, neighbor});
                }
            }
        }
        
        return dist;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] dijkstraSet(int n, int[][] edges, int source) {
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
        for (int[] e : edges) {
            graph[e[0]].add(new int[]{e[1], e[2]});
        }
        
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        
        TreeSet<int[]> set = new TreeSet<>((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        set.add(new int[]{0, source});
        
        while (!set.isEmpty()) {
            int[] curr = set.pollFirst();
            int d = curr[0], node = curr[1];
            
            for (int[] edge : graph[node]) {
                int neighbor = edge[0], w = edge[1];
                int newDist = d + w;
                if (newDist < dist[neighbor]) {
                    set.remove(new int[]{dist[neighbor], neighbor});
                    dist[neighbor] = newDist;
                    set.add(new int[]{newDist, neighbor});
                }
            }
        }
        
        return dist;
    }
}
```
<!-- slide -->
```javascript
// JavaScript implementation with simple approach
function dijkstraSet(n, edges, source) {
    const graph = Array.from({length: n}, () => []);
    for (const [u, v, w] of edges) {
        graph[u].push([v, w]);
    }
    
    const dist = new Array(n).fill(Infinity);
    dist[source] = 0;
    
    const set = new Set();
    set.add([0, source]);
    const arr = [[0, source]];
    
    while (arr.length > 0) {
        arr.sort((a, b) => a[0] - b[0]);
        const [d, node] = arr.shift();
        
        for (const [neighbor, w] of graph[node]) {
            const newDist = d + w;
            if (newDist < dist[neighbor]) {
                // Remove old entry
                const idx = arr.findIndex(x => x[1] === neighbor);
                if (idx !== -1) arr.splice(idx, 1);
                
                dist[neighbor] = newDist;
                arr.push([newDist, neighbor]);
            }
        }
    }
    
    return dist;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(E log V) average, O(V^2) worst for dense graphs |
| Space | O(V) - Distances and set |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard (Heap) | O((V + E) log V) | O(V) | **Recommended** - Most cases |
| Set-based | O(E log V) | O(V) | Dense graphs, frequent updates |
| Array-based | O(V^2) | O(V) | Very dense graphs, small V |
| Bellman-Ford | O(V × E) | O(V) | Negative weights |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Network Delay Time](https://leetcode.com/problems/network-delay-time/) | 743 | Medium | Time for all nodes to receive signal |
| [Path with Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) | 1631 | Medium | Minimize maximum edge weight |
| [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | 787 | Medium | With stop constraint |
| [Minimum Path Cost in a Hidden Grid](https://leetcode.com/problems/minimum-path-cost-in-a-hidden-grid/) | 1810 | Medium | Interactive Dijkstra |
| [The Maze II](https://leetcode.com/problems/the-maze-ii/) | 505 | Medium | Ball rolling until hit wall |
| [Find the City With Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) | 1334 | Medium | All pairs variant |
| [Minimum Weighted Subgraph With Required Paths](https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/) | 2203 | Hard | Multiple paths |

## Video Tutorial Links

1. **[NeetCode - Network Delay Time](https://www.youtube.com/watch?v=5eIK3zUdYmE)** - Dijkstra explanation
2. **[William Fiset - Dijkstra's Algorithm](https://www.youtube.com/watch?v=pSqmAO-m7Lk)** - Visual explanation
3. **[Abdul Bari - Dijkstra](https://www.youtube.com/watch?v=XB4MIexjvY0)** - Step by step walkthrough
4. **[Tushar Roy - Dijkstra](https://www.youtube.com/watch?v=0nVYi3f9ZQ)** - With priority queue

## Summary

### Key Takeaways

- **Greedy choice**: Always process closest unvisited node
- **Relaxation**: Update distances when better path found
- **Priority queue**: Efficiently get minimum distance node
- **Skip outdated**: Check if popped distance matches current best
- **Non-negative only**: Algorithm fails with negative weights

### Common Pitfalls

- Using with negative weights (use Bellman-Ford instead)
- Not skipping outdated entries in priority queue
- Forgetting to initialize distances to infinity
- Not handling disconnected graphs (distances remain infinity)
- Using wrong comparison for heap ordering
- Modifying distances without updating the heap

### Follow-up Questions

1. **How to get the actual shortest path, not just distance?**
   - Track parent array during relaxation

2. **What if we need shortest paths between all pairs?**
   - Run Dijkstra from each node or use Floyd-Warshall

3. **How to optimize for a single target?**
   - Stop early when target is popped from heap

4. **Can Dijkstra work with negative weights?**
   - No, greedy choice property is violated

## Pattern Source

[Graph - Shortest Path (Dijkstra's Algorithm)](patterns/graph-shortest-path-dijkstra-s.md)
