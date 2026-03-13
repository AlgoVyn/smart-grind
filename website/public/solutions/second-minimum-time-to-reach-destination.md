# Second Minimum Time to Reach Destination

## Problem Description

A city is represented as a bi-directional connected graph with `n` vertices where each vertex is labeled from `1` to `n` (inclusive). The edges in the graph are represented as a 2D integer array `edges`, where each `edges[i] = [ui, vi]` denotes a bi-directional edge between vertex `ui` and vertex `vi`. Every vertex pair is connected by at most one edge, and no vertex has an edge to itself. The time taken to traverse any edge is `time` minutes.

Each vertex has a traffic signal which changes its color from green to red and vice versa every `change` minutes. All signals change at the same time. You can enter a vertex at any time, but can leave a vertex only when the signal is green. You cannot wait at a vertex if the signal is green.

The second minimum value is defined as the smallest value strictly larger than the minimum value. For example, the second minimum value of `[2, 3, 4]` is `3`, and the second minimum value of `[2, 2, 4]` is `4`.

Given `n`, `edges`, `time`, and `change`, return the second minimum time it will take to go from vertex `1` to vertex `n`.

### Notes

- You can go through any vertex any number of times, including `1` and `n`.
- You can assume that when the journey starts, all signals have just turned green.

**LeetCode Link:** [Second Minimum Time to Reach Destination](https://leetcode.com/problems/second-minimum-time-to-reach-destination/)

---

## Examples

**Example 1:**
- Input: `n = 5, edges = [[1,2],[1,3],[1,4],[3,4],[4,5]], time = 3, change = 5`
- Output: `13`

Explanation:
The minimum time path is `1 -> 4 -> 5` with time = 6 minutes.
- Start at 1, time elapsed = 0
- 1 -> 4: 3 minutes, time elapsed = 3
- 4 -> 5: 3 minutes, time elapsed = 6

The second minimum time path is `1 -> 3 -> 4 -> 5` with waiting:
- Start at 1, time elapsed = 0
- 1 -> 3: 3 minutes, time elapsed = 3
- 3 -> 4: 3 minutes, time elapsed = 6
- Wait at 4 for 4 minutes, time elapsed = 10
- 4 -> 5: 3 minutes, time elapsed = 13

**Example 2:**
- Input: `n = 2, edges = [[1,2]], time = 3, change = 2`
- Output: `11`

Explanation:
The minimum time path is `1 -> 2` with time = 3 minutes.
The second minimum time path is `1 -> 2 -> 1 -> 2` with time = 11 minutes.

---

## Constraints

- `2 <= n <= 10^4`
- `n - 1 <= edges.length <= min(2 * 10^4, n * (n - 1) / 2)`
- `edges[i].length == 2`
- `1 <= ui, vi <= n`
- `ui != vi`
- There are no duplicate edges
- Each vertex can be reached directly or indirectly from every other vertex
- `1 <= time, change <= 10^3`

---

## Pattern: Modified Dijkstra's Algorithm

This problem uses **Dijkstra's Algorithm** with state tracking. Track first and second minimum times per node using dist[node][0] and dist[node][1].

### Core Concept

- **Modified Dijkstra**: Track two minimum distances per node
- **Traffic Signals**: Calculate wait time based on signal state
- **Second Minimum**: Must be strictly larger than minimum

---

## Intuition

The key insight for this problem is understanding how to find the second shortest path in a weighted graph with time-dependent constraints:

1. **Modified Dijkstra**:
   - Standard Dijkstra finds shortest path
   - We need second shortest (strictly larger than shortest)
   - Track both first and second minimum times per node

2. **Traffic Signal Logic**:
   - Green when (time // change) % 2 == 0
   - Red when (time // change) % 2 == 1
   - Wait time = (cycle + 1) * change - current_time when red

3. **Why This Works**:
   - Dijkstra explores paths in order of increasing time
   - When we find a path to destination, it's the shortest
   - The next path that reaches destination (different from shortest) is the second shortest
   - We must track both to ensure we find the true second minimum

4. **State Tracking**:
   - dist[node][0] = first minimum time
   - dist[node][1] = second minimum time (strictly greater)
   - Only update if new time < first or (first < new time < second)

---

## Multiple Approaches with Code

We'll cover one main approach:

1. **Modified Dijkstra** - Optimal solution

---

## Approach 1: Modified Dijkstra's Algorithm (Optimal)

### Algorithm Steps

1. **Build Graph**: Create adjacency list from edges
2. **Initialize**: Set dist[1][0] = 0, rest = infinity
3. **Priority Queue**: Push (time, node) starting with (0, 1)
4. **Process**: While queue not empty:
   - Pop smallest (time, node)
   - Skip if time > dist[node][1] (not useful)
   - Calculate wait if signal is red
   - For each neighbor:
     - Compute new arrival time
     - Update first or second minimum if applicable
     - Push to queue
5. **Return**: dist[n][1]

### Why It Works

The algorithm explores paths in order of increasing time, similar to Dijkstra. By tracking both first and second minimum times, we can identify the second shortest path when it reaches the destination. The traffic signal logic is incorporated by calculating wait times.

### Code Implementation

````carousel
```python
from typing import List
import heapq

def secondMinimum(n: int, edges: List[List[int]], time: int, change: int) -> int:
    # Build adjacency list
    graph = [[] for _ in range(n + 1)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    # dist[i][0] = first min time, dist[i][1] = second min time
    dist = [[float('inf')] * 2 for _ in range(n + 1)]
    dist[1][0] = 0
    
    # Priority queue: (time, node)
    pq = [(0, 1)]
    
    while pq:
        t, u = heapq.heappop(pq)
        
        # Skip if not useful
        if t > dist[u][1]:
            continue
        
        # Calculate wait time if signal is red
        cycle = t // change
        if cycle % 2 == 1:  # Red signal
            wait = (cycle + 1) * change - t
            t += wait
        
        # Traverse to neighbors
        for v in graph[u]:
            new_t = t + time
            
            # Update distances
            if new_t < dist[v][0]:
                dist[v][1] = dist[v][0]
                dist[v][0] = new_t
                heapq.heappush(pq, (new_t, v))
            elif dist[v][0] < new_t < dist[v][1]:
                dist[v][1] = new_t
                heapq.heappush(pq, (new_t, v))
    
    return dist[n][1]
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <limits>
using namespace std;

class Solution {
public:
    int secondMinimum(int n, vector<vector<int>>& edges, int time, int change) {
        // Build adjacency list
        vector<vector<int>> graph(n + 1);
        for (auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        // dist[i][0] = first min, dist[i][1] = second min
        const int INF = numeric_limits<int>::max();
        vector<array<int, 2>> dist(n + 1, {INF, INF});
        dist[1][0] = 0;
        
        // Priority queue: (time, node)
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        pq.push({0, 1});
        
        while (!pq.empty()) {
            auto [t, u] = pq.top();
            pq.pop();
            
            if (t > dist[u][1]) continue;
            
            // Calculate wait if signal is red
            int cycle = t / change;
            if (cycle % 2 == 1) {
                int wait = (cycle + 1) * change - t;
                t += wait;
            }
            
            // Traverse neighbors
            for (int v : graph[u]) {
                int new_t = t + time;
                
                if (new_t < dist[v][0]) {
                    dist[v][1] = dist[v][0];
                    dist[v][0] = new_t;
                    pq.push({new_t, v});
                } else if (dist[v][0] < new_t && new_t < dist[v][1]) {
                    dist[v][1] = new_t;
                    pq.push({new_t, v});
                }
            }
        }
        
        return dist[n][1];
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int secondMinimum(int n, int[][] edges, int time, int change) {
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        
        // dist[i][0] = first min, dist[i][1] = second min
        final int INF = Integer.MAX_VALUE;
        int[][] dist = new int[n + 1][2];
        for (int i = 1; i <= n; i++) {
            dist[i][0] = INF;
            dist[i][1] = INF;
        }
        dist[1][0] = 0;
        
        // Priority queue
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, 1});
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int t = curr[0], u = curr[1];
            
            if (t > dist[u][1]) continue;
            
            // Calculate wait if red
            int cycle = t / change;
            if (cycle % 2 == 1) {
                int wait = (cycle + 1) * change - t;
                t += wait;
            }
            
            // Traverse neighbors
            for (int v : graph.get(u)) {
                int new_t = t + time;
                
                if (new_t < dist[v][0]) {
                    dist[v][1] = dist[v][0];
                    dist[v][0] = new_t;
                    pq.add(new int[]{new_t, v});
                } else if (dist[v][0] < new_t && new_t < dist[v][1]) {
                    dist[v][1] = new_t;
                    pq.add(new int[]{new_t, v});
                }
            }
        }
        
        return dist[n][1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} time
 * @param {number} change
 * @return {number}
 */
var secondMinimum = function(n, edges, time, change) {
    // Build adjacency list
    const graph = Array.from({ length: n + 1 }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    // dist[i][0] = first min, dist[i][1] = second min
    const INF = Infinity;
    const dist = Array.from({ length: n + 1 }, () => [INF, INF]);
    dist[1][0] = 0;
    
    // Priority queue
    const pq = [[0, 1]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [t, u] = pq.shift();
        
        if (t > dist[u][1]) continue;
        
        // Calculate wait if red
        const cycle = Math.floor(t / change);
        let currTime = t;
        if (cycle % 2 === 1) {
            const wait = (cycle + 1) * change - t;
            currTime += wait;
        }
        
        // Traverse neighbors
        for (const v of graph[u]) {
            const new_t = currTime + time;
            
            if (new_t < dist[v][0]) {
                dist[v][1] = dist[v][0];
                dist[v][0] = new_t;
                pq.push([new_t, v]);
            } else if (dist[v][0] < new_t && new_t < dist[v][1]) {
                dist[v][1] = new_t;
                pq.push([new_t, v]);
            }
        }
    }
    
    return dist[n][1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((V + E) log V) where V is vertices, E is edges |
| **Space** | O(V + E) for graph and distance tracking |

---

## Approach 2: BFS with Path Tracking

### Algorithm Steps

1. Use BFS instead of Dijkstra (all edges have same weight = time)
2. Track both first and second minimum distances
3. Same traffic signal logic for waiting

### Why It Works

Since all edges have the same weight, BFS can be used instead of Dijkstra. However, we need modified BFS to track two distances per node.

### Code Implementation

`````carousel
```python
# Alternative using BFS (all edges same weight)
# Similar logic with queue instead of priority queue
```
``"

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((V + E) log V) where V is vertices, E is edges |
| **Space** | O(V + E) for graph and distance tracking |

---

## Comparison of Approaches

| Aspect | Modified Dijkstra |
|--------|-------------------|
| **Time Complexity** | O((V + E) log V) |
| **Space Complexity** | O(V + E) |
| **Implementation** | Moderate |
| **LeetCode Optimal** | ✅ |
| **Difficulty** | Hard |

**Best Approach:** Use the modified Dijkstra's algorithm as shown.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS shortest path |
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Dijkstra's algorithm |
| Path With Maximum Minimum Value | [Link](https://leetcode.com/problems/path-with-maximum-minimum-value/) | Path optimization |

---

## Video Tutorial Links

1. **[NeetCode - Second Minimum Time](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Dijkstra's Algorithm](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding Dijkstra

---

## Follow-up Questions

### Q1: How would you handle if we could wait at vertices?

**Answer:** Allow waiting by adding extra time at any vertex. This would require tracking waiting states as well.

---

### Q2: What if there are multiple edges between vertices?

**Answer:** The problem states there's at most one edge between any pair, but if there were multiple, we'd need to process all of them.

---

### Q3: Can you solve this without Dijkstra?

**Answer:** You could try BFS with path tracking, but it would be less efficient. Dijkstra with priority queue is optimal for weighted graphs.

---

## Common Pitfalls

### 1. Signal Timing
**Issue**: Not correctly calculating when signal is red.

**Solution**: Signal is red when (time // change) % 2 == 1.

### 2. Wait Calculation
**Issue**: Incorrect formula for wait time.

**Solution**: wait = (cycle + 1) * change - current_time

### 3. Second Minimum Condition
**Issue**: Using >= instead of > for second minimum.

**Solution**: Second minimum must be STRICTLY greater than first.

### 4. Queue Processing
**Issue**: Not skipping times larger than second minimum.

**Solution**: Continue if time > dist[node][1].

---

## Summary

The **Second Minimum Time to Reach Destination** problem demonstrates:
- **Modified Dijkstra's**: Tracking two shortest paths
- **Time-dependent constraints**: Traffic signals affect travel time
- **State tracking**: First and second minimum per node

Key takeaways:
1. Use modified Dijkstra to track two minimum distances
2. Calculate wait time when signal is red
3. Second minimum must be strictly greater than first
4. Use priority queue for efficient path exploration

This problem is essential for understanding path finding with constraints.

---

### Pattern Summary

This problem exemplifies the **Modified Dijkstra** pattern, characterized by:
- Tracking multiple shortest paths
- Handling time-dependent edge weights
- Using priority queue for exploration
- State tracking for second minimum

For more details on this pattern, see the **[Graph Shortest Path Pattern](/patterns/shortest-path)**.
