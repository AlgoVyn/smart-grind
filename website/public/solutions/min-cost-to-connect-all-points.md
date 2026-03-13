# Min Cost to Connect All Points

## Problem Description

You are given an array `points` representing integer coordinates of points on a 2D plane, where `points[i] = [x_i, y_i]`.

The **cost** of connecting two points `[x_i, y_i]` and `[x_j, y_j]` is the **Manhattan distance** between them:

```python
cost = |x_i - x_j| + |y_i - y_j|
```

Return the **minimum cost** to make all points connected, where all points are connected if there is **exactly one simple path** between any two points.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `points = [[0,0],[2,2],[3,10],[5,2],[7,0]]` | `20` |

**Explanation:** Connect points using the Minimum Spanning Tree (MST) to achieve minimum cost of 20.

### Example 2

| Input | Output |
|-------|--------|
| `points = [[3,12],[-2,5],[-4,1]]` | `18` |

---

## Constraints

- `1 <= points.length <= 1000`
- `-10^6 <= x_i, y_i <= 10^6`
- All pairs `(x_i, y_i)` are distinct

---

## Pattern: Prim's Algorithm (MST)

This problem uses **Prim's Algorithm** to find the Minimum Spanning Tree (MST). Starting from an arbitrary point, we continuously add the cheapest edge that connects an unvisited point to the visited set. The key insight is that the Manhattan distance creates a complete graph where MST gives the minimum cost to connect all points.

---

## Intuition

The key insight for this problem is understanding how to connect all points with minimum cost:

### Key Observations

1. **Complete Graph**: Every pair of points can be connected, forming a complete graph with n(n-1)/2 edges.

2. **Spanning Tree**: We need to find a spanning tree (n-1 edges) that connects all points.

3. **Minimum Spanning Tree (MST)**: The minimum cost spanning tree gives us the optimal solution.

4. **Prim's Algorithm**: Greedily adds the cheapest edge that connects a new point to our growing tree.

### Why Prim's Works

- Prim's algorithm is a greedy algorithm for MST
- At each step, it adds the minimum weight edge that connects a vertex in the tree to a vertex outside
- This greedy choice leads to the globally optimal solution (cut property)

### Algorithm Overview

1. Start from any point (point 0)
2. Maintain a min-heap of edges from visited to unvisited points
3. Repeatedly add the cheapest edge that connects a new point
4. Continue until all points are connected

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Prim's Algorithm (Heap-based)** - Optimal solution
2. **Kruskal's Algorithm** - Alternative approach

---

## Approach 1: Prim's Algorithm (Heap-based) (Optimal)

### Algorithm Steps

1. Handle single point edge case
2. Use min-heap to store (cost, point) pairs
3. Start from point 0
4. Extract cheapest edge, add point if not visited
5. Add all edges from new point to unvisited points
6. Continue until all points connected

### Why It Works

Prim's algorithm guarantees finding the minimum spanning tree because of the cut property - the minimum weight edge crossing any cut always belongs to some MST.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        """
        Find minimum cost to connect all points.
        
        Uses Prim's algorithm with min-heap.
        
        Args:
            points: List of [x, y] coordinates
            
        Returns:
            Minimum cost to connect all points
        """
        n = len(points)
        
        # Edge case: single point
        if n == 1:
            return 0
        
        # Track visited points
        visited = [False] * n
        
        # Min-heap: (cost, point_index)
        heap = [(0, 0)]
        
        total_cost = 0
        edges_used = 0
        
        while edges_used < n:
            cost, u = heapq.heappop(heap)
            
            # Skip if already visited
            if visited[u]:
                continue
            
            # Add this point to MST
            visited[u] = True
            total_cost += cost
            edges_used += 1
            
            # Add edges from u to all unvisited points
            for v in range(n):
                if not visited[v]:
                    # Manhattan distance
                    dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                    heapq.heappush(heap, (dist, v))
        
        return total_cost
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        
        if (n == 1) return 0;
        
        vector<bool> visited(n, false);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        
        pq.push({0, 0});
        
        int totalCost = 0;
        int edgesUsed = 0;
        
        while (edgesUsed < n) {
            auto [cost, u] = pq.top();
            pq.pop();
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalCost += cost;
            edgesUsed++;
            
            for (int v = 0; v < n; v++) {
                if (!visited[v]) {
                    int dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1]);
                    pq.push({dist, v});
                }
            }
        }
        
        return totalCost;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        
        if (n == 1) return 0;
        
        boolean[] visited = new boolean[n];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        
        pq.add(new int[]{0, 0});
        
        int totalCost = 0;
        int edgesUsed = 0;
        
        while (edgesUsed < n) {
            int[] current = pq.poll();
            int cost = current[0];
            int u = current[1];
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalCost += cost;
            edgesUsed++;
            
            for (int v = 0; v < n; v++) {
                if (!visited[v]) {
                    int dist = Math.abs(points[u][0] - points[v][0]) + 
                               Math.abs(points[u][1] - points[v][1]);
                    pq.add(new int[]{dist, v});
                }
            }
        }
        
        return totalCost;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} points
 * @return {number}
 */
var minCostConnectPoints = function(points) {
    const n = points.length;
    
    if (n === 1) return 0;
    
    const visited = new Array(n).fill(false);
    const pq = [[0, 0]];
    
    let totalCost = 0;
    let edgesUsed = 0;
    
    while (edgesUsed < n) {
        const [cost, u] = pq.shift();
        
        if (visited[u]) continue;
        
        visited[u] = true;
        totalCost += cost;
        edgesUsed++;
        
        for (let v = 0; v < n; v++) {
            if (!visited[v]) {
                const dist = Math.abs(points[u][0] - points[v][0]) + 
                            Math.abs(points[u][1] - points[v][1]);
                pq.push([dist, v]);
                pq.sort((a, b) => a[0] - b[0]);
            }
        }
    }
    
    return totalCost;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) — up to n² edges, heap operations are O(log n) |
| **Space** | O(n) — heap stores edges, can be optimized |

---

## Approach 2: Kruskal's Algorithm (Alternative)

### Algorithm Steps

1. Generate all possible edges (n choose 2)
2. Sort edges by weight
3. Use Union-Find to add edges that don't create cycles
4. Stop when n-1 edges are added

### Why It Works

Kruskal's is another greedy algorithm for MST that works by sorting all edges and adding them if they don't create a cycle.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        """Alternative: Kruskal's algorithm."""
        n = len(points)
        if n == 1:
            return 0
        
        # Generate all edges
        edges = []
        for i in range(n):
            for j in range(i + 1, n):
                dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
                edges.append((dist, i, j))
        
        # Sort edges by weight
        edges.sort()
        
        # Union-Find
        parent = list(range(n))
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
                return True
            return False
        
        total_cost = 0
        edges_used = 0
        
        for cost, i, j in edges:
            if union(i, j):
                total_cost += cost
                edges_used += 1
                if edges_used == n - 1:
                    break
        
        return total_cost
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        if (n == 1) return 0;
        
        // Generate all edges
        vector<tuple<int, int, int>> edges;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]);
                edges.emplace_back(dist, i, j);
            }
        }
        
        sort(edges.begin(), edges.end());
        
        // Union-Find
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        
        function<int(int)> find = [&](int x) {
            return parent[x] == x ? x : parent[x] = find(parent[x]);
        };
        
        int totalCost = 0, edgesUsed = 0;
        for (auto& [dist, i, j] : edges) {
            int pi = find(i), pj = find(j);
            if (pi != pj) {
                parent[pi] = pj;
                totalCost += dist;
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }
        
        return totalCost;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        if (n == 1) return 0;
        
        // Generate all edges
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = Math.abs(points[i][0] - points[j][0]) + 
                           Math.abs(points[i][1] - points[j][1]);
                edges.add(new int[]{dist, i, j});
            }
        }
        
        edges.sort(Comparator.comparingInt(a -> a[0]));
        
        // Union-Find
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        
        int totalCost = 0, edgesUsed = 0;
        
        for (int[] edge : edges) {
            int pi = find(parent, edge[1]);
            int pj = find(parent, edge[2]);
            if (pi != pj) {
                parent[pi] = pj;
                totalCost += edge[0];
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }
        
        return totalCost;
    }
    
    private int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }
}
```

<!-- slide -->
```javascript
var minCostConnectPoints = function(points) {
    const n = points.length;
    if (n === 1) return 0;
    
    // Generate all edges
    const edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dist = Math.abs(points[i][0] - points[j][0]) + 
                        Math.abs(points[i][1] - points[j][1]);
            edges.push([dist, i, j]);
        }
    }
    
    edges.sort((a, b) => a[0] - b[0]);
    
    // Union-Find
    const parent = Array.from({ length: n }, (_, i) => i);
    
    const find = (x) => {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    };
    
    let totalCost = 0, edgesUsed = 0;
    
    for (const [dist, i, j] of edges) {
        const pi = find(i), pj = find(j);
        if (pi !== pj) {
            parent[pi] = pj;
            totalCost += dist;
            edgesUsed++;
            if (edgesUsed === n - 1) break;
        }
    }
    
    return totalCost;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) — sorting n² edges |
| **Space** | O(n²) for edges list |

---

## Comparison of Approaches

| Aspect | Prim's (Heap) | Kruskal's |
|--------|---------------|-----------|
| **Time Complexity** | O(n² log n) | O(n² log n) |
| **Space Complexity** | O(n) | O(n²) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Use either approach. Prim's is more space-efficient for dense graphs.

---

## Related Problems

Based on similar themes (MST, graph connectivity):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Spanning Tree | [Link](https://leetcode.com/problems/minimum-cost-to-connect-all-points/) | This problem |
| Number of Operations | [Link](https://leetcode.com/problems/minimum-number-of-operations-to-connect-all-points/) | Similar concept |
| City With Smallest Number | [Link](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors/) | Graph connectivity |

### Pattern Reference

For more detailed explanations, see:
- **[MST Pattern](/patterns/minimum-spanning-tree)**
- **[Graph Traversal](/patterns/graph-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Min Cost Connect Points - LeetCode 1584](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Prim's Algorithm](https://www.youtube.com/watch?v=example)** - MST algorithm
3. **[Kruskal's Algorithm](https://www.youtube.com/watch=example)** - Alternative MST

### Related Concepts

- **[Minimum Spanning Tree](https://www.youtube.com/watch=example)** - Theory
- **[Union-Find](https://www.youtube.com/watch=example)** - Data structure

---

## Follow-up Questions

### Q1: How would you optimize Prim's to avoid O(n²) edges in heap?

**Answer:** Use O(n) version of Prim's that tracks minimum distance to each unvisited node.

---

### Q2: What if edges had weights different from Manhattan distance?

**Answer:** The algorithm remains the same - MST works for any edge weights.

---

### Q3: Can you use BFS instead of Prim's?

**Answer:** No, BFS doesn't help find minimum spanning tree. Prim's or Kruskal's are needed.

---

### Q4: How would you find which edges are in the MST?

**Answer:** Track the edges added during the algorithm (store the from-to pairs).

---

### Q5: What if points were in higher dimensions?

**Answer:** The algorithm works for any dimension - just change the distance calculation.

---

## Common Pitfalls

### 1. Single Point
**Issue**: Not handling n == 1.

**Solution**: Return 0 if only one point.

### 2. Duplicate Edges
**Issue**: Same point pushed multiple times to heap.

**Solution**: Check visited[u] before processing.

### 3. Manhattan vs Euclidean
**Issue**: Using wrong distance formula.

**Solution**: Use Manhattan: |x1-x2| + |y1-y2|.

### 4. Time Complexity
**Issue**: O(n² log n) is slow for n up to 1000 but acceptable.

**Solution**: Can optimize to O(n²) with array-based Prim's.

### 5. Heap Size
**Issue**: Heap grows to O(n²).

**Solution**: Acceptable for n ≤ 1000.

---

## Summary

The **Min Cost to Connect All Points** problem demonstrates the classic **Minimum Spanning Tree** problem using Prim's or Kruskal's algorithm. The key insight is that Manhattan distance creates a complete graph where MST gives the optimal solution.

Key takeaways:
1. This is a Minimum Spanning Tree problem
2. Prim's algorithm greedily adds cheapest edge
3. Manhattan distance: |x1-x2| + |y1-y2|
4. O(n² log n) works for n ≤ 1000

This problem is essential for understanding MST algorithms and their applications.

### Pattern Summary

This problem exemplifies the **MST** pattern, characterized by:
- Finding minimum cost to connect all nodes
- Greedy algorithms (Prim's/Kruskal's)
- Graph with weighted edges
- O(n² log n) complexity

For more details on this pattern and its variations, see the **[MST Pattern](/patterns/minimum-spanning-tree)**.

---

## Additional Resources

- [LeetCode Problem 1584](https://leetcode.com/problems/min-cost-to-connect-all-points/) - Official problem page
- [Prim's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/prims-algorithm/) - Detailed explanation
- [Kruskal's Algorithm](https://www.geeksforgeeks.org/kruskals-algorithm/) - Alternative approach
- [Pattern: MST](/patterns/minimum-spanning-tree) - Comprehensive pattern guide
