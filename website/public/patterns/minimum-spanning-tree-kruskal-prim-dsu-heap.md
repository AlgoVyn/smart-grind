# Graph - Minimum Spanning Tree

## Problem Description

The **Minimum Spanning Tree (MST)** pattern is used to connect all vertices in a weighted undirected graph with the minimum total edge weight and no cycles. A **Spanning Tree** connects all vertices; a **Minimum Spanning Tree** has the smallest possible total weight. Kruskal's and Prim's algorithms are the two primary approaches for finding MSTs.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Weighted undirected graph |
| **Output** | MST edges and total weight |
| **Key Insight** | Greedy selection of minimum weight edges while avoiding cycles |
| **Time Complexity** | O(E log E) for Kruskal, O(E log V) for Prim |
| **Space Complexity** | O(V + E) for graph storage |

### When to Use

- **Network design**: Connecting computers, cities, or facilities with minimum cost
- **Clustering algorithms**: Hierarchical clustering uses MST concepts
- **Approximation algorithms**: TSP approximation using MST
- **Image segmentation**: Computer vision applications
- **Protocol design**: Network routing protocols (e.g., MSTP)

---

## Intuition

### Core Insight

The key insight behind MST algorithms is the **Cut Property**: 
> For any cut of the graph, the minimum weight edge crossing the cut belongs to some MST.

This property guarantees that greedy selection of minimum edges works:

1. **Kruskal's**: Sort all edges, add if no cycle forms (using Union-Find)
2. **Prim's**: Grow tree from start node, always add minimum edge to the tree
3. **Both are greedy** - make locally optimal choices that lead to global optimum

### The "Aha!" Moments

1. **Why does greedy work for MST?** The Cut Property ensures that picking the minimum edge never prevents us from finding the optimal solution. If a minimum edge doesn't create a cycle, it must be part of some MST.

2. **Kruskal vs Prim - when to use which?**
   - **Kruskal**: Better for sparse graphs (E ≈ V), simpler to implement
   - **Prim**: Better for dense graphs (E ≈ V²), doesn't require sorting all edges

3. **Why Union-Find for Kruskal?** We need to efficiently check if adding an edge creates a cycle. Union-Find tracks connected components, so we check if two vertices are already in the same set.

### MST Construction Visualization

```
Graph:        MST (Kruskal):
A --4-- B     A --1-- C
|      /|\    |      /
1    2 5 8    B --2-/
|   /   |     
C --3-- D     Total: 1 + 1 + 2 = 4
    7   6

Kruskal steps:
1. Sort edges: (A,C,1), (A,B,4), (B,C,2), (C,D,3), (B,D,5), ...
2. Add (A,C,1) - no cycle ✓
3. Add (B,C,2) - no cycle ✓  
4. Add (C,D,3) - no cycle ✓
5. Skip (A,B,4) - would create cycle A-C-B-A
```

---

## Solution Approaches

### Approach 1: Kruskal's Algorithm (Union-Find) ⭐

Sort edges by weight and add them if they don't form a cycle.

#### Algorithm

1. **Sort all edges** by weight in ascending order
2. **Initialize Union-Find** with each vertex as separate component
3. **Iterate through sorted edges**:
   - For edge (u, v, weight):
     - If `find(u) != find(v)`:  // No cycle
       - Add edge to MST
       - `union(u, v)`
       - Add weight to total
4. **Stop when MST has V-1 edges** (or process all edges)

#### Implementation

````carousel
```python
from typing import List, Tuple

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False  # Already connected
        
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True


def kruskal_mst(n: int, edges: List[Tuple[int, int, int]]) -> Tuple[int, List[Tuple[int, int, int]]]:
    """
    Kruskal's algorithm for MST.
    
    Args:
        n: Number of vertices
        edges: List of (u, v, weight) edges
        
    Returns:
        (total_weight, mst_edges)
    """
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])
    
    uf = UnionFind(n)
    mst = []
    total_weight = 0
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
            
            if len(mst) == n - 1:  # MST complete
                break
    
    return total_weight, mst


def kruskal_mst_components(n: int, edges: List[Tuple[int, int, int]]) -> Tuple[int, List[Tuple[int, int, int]]]:
    """
    Kruskal's for potentially disconnected graph.
    Returns forest (MST of each component).
    """
    edges.sort(key=lambda x: x[2])
    
    uf = UnionFind(n)
    mst = []
    total_weight = 0
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
    
    return total_weight, mst
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};

class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<tuple<int, int, int>> edges; // (weight, u, v)
        
        // Build all edges with Manhattan distance
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = abs(points[i][0] - points[j][0]) + 
                          abs(points[i][1] - points[j][1]);
                edges.push_back({dist, i, j});
            }
        }
        
        // Kruskal's algorithm
        sort(edges.begin(), edges.end());
        UnionFind uf(n);
        int totalCost = 0;
        int edgesUsed = 0;
        
        for (auto& [dist, u, v] : edges) {
            if (uf.unite(u, v)) {
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

class UnionFind {
    private int[] parent;
    private int[] rank;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        if (rank[px] < rank[py]) {
            int temp = px;
            px = py;
            py = temp;
        }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
}

class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        List<int[]> edges = new ArrayList<>(); // [weight, u, v]
        
        // Build edges
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = Math.abs(points[i][0] - points[j][0]) + 
                          Math.abs(points[i][1] - points[j][1]);
                edges.add(new int[]{dist, i, j});
            }
        }
        
        // Kruskal's
        Collections.sort(edges, (a, b) -> a[0] - b[0]);
        UnionFind uf = new UnionFind(n);
        int totalCost = 0;
        int edgesUsed = 0;
        
        for (int[] edge : edges) {
            if (uf.unite(edge[1], edge[2])) {
                totalCost += edge[0];
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }
        
        return totalCost;
    }
}
```

<!-- slide -->
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    unite(x, y) {
        let px = this.find(x), py = this.find(y);
        if (px === py) return false;
        
        if (this.rank[px] < this.rank[py]) {
            [px, py] = [py, px];
        }
        this.parent[py] = px;
        if (this.rank[px] === this.rank[py]) this.rank[px]++;
        return true;
    }
}

/**
 * @param {number[][]} points
 * @return {number}
 */
var minCostConnectPoints = function(points) {
    const n = points.length;
    const edges = [];
    
    // Build edges with Manhattan distance
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dist = Math.abs(points[i][0] - points[j][0]) + 
                        Math.abs(points[i][1] - points[j][1]);
            edges.push([dist, i, j]);
        }
    }
    
    // Kruskal's
    edges.sort((a, b) => a[0] - b[0]);
    const uf = new UnionFind(n);
    let totalCost = 0;
    let edgesUsed = 0;
    
    for (const [dist, u, v] of edges) {
        if (uf.unite(u, v)) {
            totalCost += dist;
            edgesUsed++;
            if (edgesUsed === n - 1) break;
        }
    }
    
    return totalCost;
};
```
````

---

### Approach 2: Prim's Algorithm

Grow MST from a starting node, always adding the minimum edge connecting to the tree.

#### Algorithm

1. **Initialize**: Start from arbitrary node, mark as visited
2. **Use min-heap** (priority queue) of edges from visited set
3. **While MST incomplete**:
   - Extract minimum weight edge from heap
   - If it connects to unvisited node:
     - Add to MST
     - Mark node as visited
     - Add all its edges to heap
4. **Return MST**

#### Implementation

````carousel
```python
import heapq
from typing import List, Tuple

def prim_mst(n: int, graph: List[List[Tuple[int, int]]]) -> Tuple[int, List[Tuple[int, int, int]]]:
    """
    Prim's algorithm using min-heap.
    
    Args:
        n: Number of vertices
        graph: Adjacency list with (neighbor, weight)
        
    Returns:
        (total_weight, mst_edges)
    """
    visited = [False] * n
    min_heap = [(0, 0, -1)]  # (weight, node, parent)
    mst = []
    total_weight = 0
    
    while min_heap and len(mst) < n:
        weight, node, parent = heapq.heappop(min_heap)
        
        if visited[node]:
            continue
        
        visited[node] = True
        total_weight += weight
        
        if parent != -1:
            mst.append((parent, node, weight))
        
        # Add all edges from current node
        for neighbor, edge_weight in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(min_heap, (edge_weight, neighbor, node))
    
    return total_weight, mst


def prim_mst_dense(n: int, adj_matrix: List[List[int]]) -> int:
    """
    Prim's for dense graphs using array instead of heap.
    Time: O(V^2), better when E ≈ V^2.
    """
    visited = [False] * n
    min_edge = [float('inf')] * n
    min_edge[0] = 0
    total_weight = 0
    
    for _ in range(n):
        # Find minimum edge to unvisited node
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or min_edge[i] < min_edge[u]):
                u = i
        
        if min_edge[u] == float('inf'):
            break  # Graph not connected
        
        visited[u] = True
        total_weight += min_edge[u]
        
        # Update min edges
        for v in range(n):
            if not visited[v] and adj_matrix[u][v] > 0:
                min_edge[v] = min(min_edge[v], adj_matrix[u][v])
    
    return total_weight
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <tuple>
using namespace std;

class SolutionPrim {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<bool> visited(n, false);
        
        // Min heap: (distance, point_index)
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
        pq.push({0, 0});
        
        int totalCost = 0;
        int edgesUsed = 0;
        
        while (edgesUsed < n) {
            auto [dist, u] = pq.top();
            pq.pop();
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalCost += dist;
            edgesUsed++;
            
            // Add all unvisited neighbors
            for (int v = 0; v < n; v++) {
                if (!visited[v]) {
                    int newDist = abs(points[u][0] - points[v][0]) + 
                                 abs(points[u][1] - points[v][1]);
                    pq.push({newDist, v});
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

class SolutionPrim {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        boolean[] visited = new boolean[n];
        
        // Min heap: [distance, point_index]
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, 0});
        
        int totalCost = 0;
        int edgesUsed = 0;
        
        while (edgesUsed < n) {
            int[] curr = pq.poll();
            int dist = curr[0];
            int u = curr[1];
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalCost += dist;
            edgesUsed++;
            
            // Add neighbors
            for (int v = 0; v < n; v++) {
                if (!visited[v]) {
                    int newDist = Math.abs(points[u][0] - points[v][0]) + 
                                 Math.abs(points[u][1] - points[v][1]);
                    pq.offer(new int[]{newDist, v});
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
var minCostConnectPointsPrim = function(points) {
    const n = points.length;
    const visited = new Array(n).fill(false);
    
    // Min heap: [distance, point_index]
    const pq = [[0, 0]];
    
    let totalCost = 0;
    let edgesUsed = 0;
    
    while (edgesUsed < n) {
        // Find minimum (simple extraction, use proper heap for efficiency)
        pq.sort((a, b) => a[0] - b[0]);
        const [dist, u] = pq.shift();
        
        if (visited[u]) continue;
        
        visited[u] = true;
        totalCost += dist;
        edgesUsed++;
        
        // Add neighbors
        for (let v = 0; v < n; v++) {
            if (!visited[v]) {
                const newDist = Math.abs(points[u][0] - points[v][0]) + 
                               Math.abs(points[u][1] - points[v][1]);
                pq.push([newDist, v]);
            }
        }
    }
    
    return totalCost;
};
```
````

---

## Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|------------------|----------|
| **Kruskal's** | O(E log E) | O(V) for DSU | Sparse graphs (E ≈ V) |
| **Prim's (Heap)** | O(E log V) | O(V) | Sparse graphs with adjacency list |
| **Prim's (Array)** | O(V²) | O(V) | Dense graphs (E ≈ V²) |

**Where:**
- `V` = number of vertices
- `E` = number of edges

**Time Breakdown:**
- **Kruskal**: Sorting edges O(E log E) + DSU operations O(E α(V))
- **Prim**: Each node extracted once O(V log V) + edge relaxations O(E log V)

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Min Cost to Connect All Points** | [Link](https://leetcode.com/problems/min-cost-to-connect-all-points/) | MST with Manhattan distance |
| **Connecting Cities With Minimum Cost** | [Link](https://leetcode.com/problems/connecting-cities-with-minimum-cost/) | Classic MST |
| **Optimize Water Distribution** | [Link](https://leetcode.com/problems/optimize-water-distribution-in-a-village/) | MST with virtual node |
| **Find Critical and Pseudo-Critical Edges** | [Link](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/) | Edge analysis in MST |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Number of Islands II** | [Link](https://leetcode.com/problems/number-of-islands-ii/) | Dynamic connectivity |
| **Cheapest Flights Within K Stops** | [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Modified shortest path |

---

## Video Tutorial Links

1. [Kruskal's Algorithm - WilliamFiset](https://www.youtube.com/watch?v=JZBQLXgSGfs) - Visual explanation with Union-Find
2. [Prim's Algorithm - WilliamFiset](https://www.youtube.com/watch?v=cplfcGZmX7I) - Growing MST approach
3. [Minimum Spanning Tree - Abdul Bari](https://www.youtube.com/watch?v=4ZlRH0eK-qQ) - Comprehensive comparison
4. [MST Problems - NeetCode](https://www.youtube.com/watch?v=Po8zK8sI5n8) - Problem-solving approach

---

## Summary

### Key Takeaways

1. **Cut Property guarantees greedy works** - Minimum edge crossing any cut is in some MST
2. **Kruskal: Sort edges, add if no cycle** - Use Union-Find for cycle detection
3. **Prim: Grow tree from start** - Use min-heap for efficient edge selection
4. **Both produce same total weight** - But may produce different trees
5. **Choose based on graph density** - Kruskal for sparse, Prim for dense

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Not sorting edges in Kruskal** | Always sort by weight before processing |
| **Missing path compression** | Improves Union-Find from O(log n) to O(α(n)) |
| **Wrong heap operations in Prim** | Mark visited when adding to MST, not when pushing to heap |
| **Assuming connected graph** | Handle disconnected graphs appropriately |
| **Forgetting MST has V-1 edges** | Stop early when MST is complete |

### Follow-up Questions

**Q1: How do you find the second best MST?**

For each edge in the MST, try removing it and finding the minimum replacement edge that reconnects the two components. The best of these is the second best MST.

**Q2: What if edge weights can be negative?**

Both Kruskal's and Prim's work with negative weights. Just be careful with comparisons in Prim's (min-heap still works).

**Q3: How do you find MST in a directed graph?**

Directed MST is the Arborescence problem, solved by Chu-Liu/Edmonds algorithm, not Kruskal or Prim.

**Q4: What's the maximum spanning tree?**

Same algorithms, but sort edges in descending order (Kruskal) or use max-heap (Prim).

---

## Pattern Source

For more graph pattern implementations, see:
- **[Graph - Union Find (DSU)](/patterns/graph-union-find-disjoint-set-union-dsu)**
- **[Graph - Shortest Path Dijkstra's](/patterns/graph-shortest-path-dijkstra-s)**
- **[Graph - Bridges & Articulation Points](/patterns/bridges-articulation-points-tarjan-low-link)**
- **[Heap - Scheduling](/patterns/heap-scheduling-minimum-cost-greedy-with-priority-queue)**

---

## Additional Resources

- [LeetCode Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
- [GeeksforGeeks MST](https://www.geeksforgeeks.org/minimum-spanning-tree-mst/)
- [Wikipedia - Minimum Spanning Tree](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
- [Prim's vs Kruskal's](https://www.geeksforgeeks.org/difference-between-prims-and-kruskals-algorithm-for-mst/)
