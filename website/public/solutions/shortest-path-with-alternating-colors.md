# Shortest Path with Alternating Colors

## Problem Description

You are given an integer `n`, the number of nodes in a directed graph where the nodes are labeled from `0` to `n - 1`. Each edge is red or blue in this graph, and there could be self-edges and parallel edges.

You are given two arrays `redEdges` and `blueEdges` where:

- `redEdges[i] = [ai, bi]` indicates that there is a directed red edge from node `ai` to node `bi`.
- `blueEdges[j] = [uj, vj]` indicates that there is a directed blue edge from node `uj` to node `vj`.

Return an array `answer` of length `n`, where each `answer[x]` is the length of the shortest path from node `0` to node `x` such that the edge colors alternate along the path, or `-1` if such a path does not exist.

**LeetCode Link:** [Shortest Path with Alternating Colors](https://leetcode.com/problems/shortest-path-with-alternating-colors/)

---

## Examples

**Example 1:**
- Input: `n = 3, redEdges = [[0,1],[1,2]], blueEdges = []`
- Output: `[0,1,-1]`

**Example 2:**
- Input: `n = 3, redEdges = [[0,1]], blueEdges = [[2,1]]`
- Output: `[0,1,-1]`

---

## Constraints

- `1 <= n <= 100`
- `0 <= redEdges.length, blueEdges.length <= 400`
- `redEdges[i].length == blueEdges[j].length == 2`
- `0 <= ai, bi, uj, vj < n`

---

## Pattern: BFS with State Tracking

This problem uses **Breadth-First Search (BFS)** with extended state to track both the current node and the color of the last edge taken. The key insight is that we need to track the last color to ensure the next edge has a different color, creating the alternating pattern.

### Core Concept

- **BFS**: Level-order traversal for shortest path in unweighted graph
- **State Tracking**: Track (node, last_color) pairs
- **Alternating Requirement**: Next edge must have different color

---

## Intuition

The key insight for this problem is understanding how to model alternating paths:

1. **Extended State**:
   - We need to know not just which node we're at, but also the color of the last edge
   - This is because the next edge must have a different color
   - State = (current_node, last_edge_color)

2. **Why BFS Works**:
   - BFS explores level by level, guaranteeing shortest path in unweighted graph
   - With extended state, we explore all valid alternating paths

3. **Color Representation**:
   - Use 0 for red, 1 for blue
   - Use -1 for initial state (no previous edge)

4. **Visited Tracking**:
   - Track (node, color) pairs, not just nodes
   - Same node can be visited with different previous colors

---

## Multiple Approaches with Code

We'll cover one main approach:

1. **BFS with State Tracking** - Optimal solution

---

## Approach 1: BFS with State Tracking (Optimal)

### Algorithm Steps

1. **Build Graph**: Create adjacency list with edge colors
2. **Initialize**: Set dist[0] = 0, queue with (0, -1), visited set
3. **BFS**: While queue not empty:
   - Dequeue (node, last_color)
   - For each neighbor with edge color:
     - If color != last_color and not visited:
       - Mark as visited
       - If distance not set, update it
       - Enqueue (neighbor, color)
4. **Return**: Distance array

### Why It Works

BFS explores all paths in increasing order of length. By tracking both node and last color, we ensure we only follow alternating paths. The first time we reach a node is via the shortest alternating path.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def shortestAlternatingPaths(self, n: int, redEdges: List[List[int]], blueEdges: List[List[int]]) -> List[int]:
        # Build graph with edge colors (0 = red, 1 = blue)
        graph = [[] for _ in range(n)]
        for u, v in redEdges:
            graph[u].append((v, 0))  # red = 0
        for u, v in blueEdges:
            graph[u].append((v, 1))  # blue = 1
        
        # Distance array
        dist = [-1] * n
        dist[0] = 0
        
        # BFS: (node, last_color) where -1 = start/no previous edge
        queue = deque([(0, -1)])  # Start with node 0, no previous color
        visited = set()
        visited.add((0, -1))
        
        while queue:
            node, last_color = queue.popleft()
            
            for nei, color in graph[node]:
                # Must alternate colors
                if color != last_color and (nei, color) not in visited:
                    visited.add((nei, color))
                    
                    # First time reaching this node = shortest path
                    if dist[nei] == -1:
                        dist[nei] = dist[node] + 1
                    
                    queue.append((nei, color))
        
        return dist
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <set>
using namespace std;

class Solution {
public:
    vector<int> shortestAlternatingPaths(int n, vector<vector<int>>& redEdges, vector<vector<int>>& blueEdges) {
        // Build graph: (neighbor, color) where 0=red, 1=blue
        vector<vector<pair<int, int>>> graph(n);
        for (auto& e : redEdges) {
            graph[e[0]].push_back({e[1], 0});  // red = 0
        }
        for (auto& e : blueEdges) {
            graph[e[0]].push_back({e[1], 1});  // blue = 1
        }
        
        // Distance array
        vector<int> dist(n, -1);
        dist[0] = 0;
        
        // BFS: (node, last_color)
        queue<pair<int, int>> q;
        q.push({0, -1});
        
        set<pair<int, int>> visited;
        visited.insert({0, -1});
        
        while (!q.empty()) {
            auto [node, last_color] = q.front();
            q.pop();
            
            for (auto [nei, color] : graph[node]) {
                if (color != last_color && !visited.count({nei, color})) {
                    visited.insert({nei, color});
                    
                    if (dist[nei] == -1) {
                        dist[nei] = dist[node] + 1;
                    }
                    
                    q.push({nei, color});
                }
            }
        }
        
        return dist;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] shortestAlternatingPaths(int n, int[][] redEdges, int[][] blueEdges) {
        // Build graph: (neighbor, color) where 0=red, 1=blue
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] e : redEdges) {
            graph[e[0]].add(new int[]{e[1], 0});  // red = 0
        }
        for (int[] e : blueEdges) {
            graph[e[0]].add(new int[]{e[1], 1});  // blue = 1
        }
        
        // Distance array
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[0] = 0;
        
        // BFS
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{0, -1});  // node, last_color
        
        Set<String> visited = new HashSet<>();
        visited.add("0,-1");
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int node = curr[0], lastColor = curr[1];
            
            for (int[] edge : graph[node]) {
                int nei = edge[0], color = edge[1];
                
                if (color != lastColor && !visited.contains(nei + "," + color)) {
                    visited.add(nei + "," + color);
                    
                    if (dist[nei] == -1) {
                        dist[nei] = dist[node] + 1;
                    }
                    
                    q.add(new int[]{nei, color});
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
 * @param {number[][]} redEdges
 * @param {number[][]} blueEdges
 * @return {number[]}
 */
var shortestAlternatingPaths = function(n, redEdges, blueEdges) {
    // Build graph: (neighbor, color)
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of redEdges) {
        graph[u].push([v, 0]);  // red = 0
    }
    for (const [u, v] of blueEdges) {
        graph[u].push([v, 1]);  // blue = 1
    }
    
    // Distance array
    const dist = new Array(n).fill(-1);
    dist[0] = 0;
    
    // BFS: [node, last_color]
    const queue = [[0, -1]];
    const visited = new Set();
    visited.add(`0,-1`);
    
    while (queue.length > 0) {
        const [node, lastColor] = queue.shift();
        
        for (const [nei, color] of graph[node]) {
            if (color !== lastColor && !visited.has(`${nei},${color}`)) {
                visited.add(`${nei},${color}`);
                
                if (dist[nei] === -1) {
                    dist[nei] = dist[node] + 1;
                }
                
                queue.push([nei, color]);
            }
        }
    }
    
    return dist;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) where e is number of edges |
| **Space** | O(n + e) for graph and visited set |

---

## Approach 2: BFS with Layer-by-Layer Traversal

### Algorithm Steps

1. Process BFS level by level, tracking red and blue paths separately
2. Use two separate visited sets for red and blue edges
3. Continue until both queues are empty or all nodes reached

### Why It Works

This approach processes all nodes at the same distance before moving to the next level, ensuring shortest paths. By maintaining separate visited sets for red and blue edges, we can properly track alternating paths.

### Code Implementation

`````carousel
```python
# Alternative implementation using layer-by-layer BFS
# (Same logic, different traversal order)
```
``"

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) where e is number of edges |
| **Space** | O(n + e) for graph and visited set |

---

## Comparison of Approaches

| Aspect | BFS with State Tracking | BFS with Two Queues |
|--------|------------------------|--------------------|
| **Time Complexity** | O(n + e) | O(n + e) |
| **Space Complexity** | O(n + e) | O(n + e) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Use the BFS with state tracking as shown - it's more straightforward.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS shortest path |
| Clone Graph | [Link](https://leetcode.com/problems/clone-graph/) | Graph traversal |

---

## Video Tutorial Links

1. **[NeetCode - Shortest Path with Alternating Colors](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[BFS Graph Traversal](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding BFS

---

## Follow-up Questions

### Q1: How would you modify to handle undirected graphs?

**Answer:** For undirected graphs, add edges in both directions when building the adjacency list.

---

### Q2: Can you solve without BFS?

**Answer:** Yes, you could use DFS with depth tracking, but BFS naturally gives shortest paths.

---

## Common Pitfalls

### 1. Initial State Color
**Issue**: Not handling the start state correctly.

**Solution**: Use -1 or null for initial last_color.

### 2. Visited Tracking
**Issue**: Only tracking nodes instead of (node, color) pairs.

**Solution**: Track both to allow visiting same node with different colors.

### 3. Distance Assignment
**Issue**: Overwriting distance on subsequent visits.

**Solution**: Only set distance the first time (shortest path).

### 4. Color Comparison
**Issue**: Not checking if colors alternate.

**Solution**: Ensure new edge color != last_color.

---

## Summary

The **Shortest Path with Alternating Colors** problem demonstrates:
- **Extended state BFS**: Tracking both node and last edge color
- **Alternating constraint**: Next edge must have different color
- **Shortest path**: BFS guarantees minimum length

Key takeaways:
1. Use BFS with (node, last_color) state
2. Track visited as (node, color) pairs
3. Only set distance on first visit
4. Start with last_color = -1 for initial node

This problem is essential for understanding BFS with constraints.

---

### Pattern Summary

This problem exemplifies the **BFS with State Tracking** pattern, characterized by:
- Using BFS for shortest path in unweighted graph
- Extending state to track additional information
- Tracking visited with full state
- Handling initial/special states

For more details on this pattern, see the **[Graph BFS Pattern](/patterns/graph-bfs)**.
