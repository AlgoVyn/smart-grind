# Find Critical And Pseudo Critical Edges In Minimum Spanning Tree

## Problem Description

Given a weighted undirected connected graph with n vertices numbered from 0 to n - 1, and an array edges where edges[i] = [ai, bi, weighti] represents a bidirectional and weighted edge between nodes ai and bi. A minimum spanning tree (MST) is a subset of the graph's edges that connects all vertices without cycles and with the minimum possible total edge weight.

Find all the critical and pseudo-critical edges in the given graph's minimum spanning tree (MST). An MST edge whose deletion from the graph would cause the MST weight to increase is called a critical edge. On the other hand, a pseudo-critical edge is that which can appear in some MSTs but not all.

Note that you can return the indices of the edges in any order.

**LeetCode Link:** [Find Critical And Pseudo Critical Edges In Minimum Spanning Tree - LeetCode 1489](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/)

---

## Examples

### Example 1

**Input:**
```python
n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
```

**Output:**
```python
[[0,1],[2,3,4,5]]
```

**Explanation:**
The figure above describes the graph.
The following figure shows all the possible MSTs:

Notice that the two edges 0 and 1 appear in all MSTs, therefore they are critical edges, so we return them in the first list of the output.
The edges 2, 3, 4, and 5 are only part of some MSTs, therefore they are considered pseudo-critical edges. We add them to the second list of the output.

---

### Example 2

**Input:**
```python
n = 4, edges = [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]
```

**Output:**
```python
[[],[0,1,2,3]]
```

**Explanation:**
We can observe that since all 4 edges have equal weight, choosing any 3 edges from the given 4 will yield an MST. Therefore all 4 edges are pseudo-critical.

---

## Constraints

- `2 <= n <= 100`
- `1 <= edges.length <= min(200, n * (n - 1) / 2)`
- `edges[i].length == 3`
- `0 <= ai < bi < n`
- `1 <= weighti <= 1000`
- All pairs (ai, bi) are distinct.

---

## Pattern: Kruskal's Algorithm with Edge Classification

This problem uses **Kruskal's MST algorithm** with **Union-Find** to identify critical and pseudo-critical edges. The key is to compute the baseline MST weight, then test each edge by either excluding it (for critical) or forcing it (for pseudo-critical).

---

## Intuition

The problem requires classifying each edge in a graph based on its importance to the Minimum Spanning Tree (MST).

### Key Observations

1. **Critical Edges**: Edges that MUST be in ALL MSTs. If we remove them, the MST weight increases.

2. **Pseudo-Critical Edges**: Edges that CAN be in SOME MSTs but not all. They can replace other edges of equal weight without increasing total weight.

3. **Testing Strategy**:
   - First, compute the baseline MST weight using Kruskal's algorithm
   - For each edge in the MST: exclude it and recompute MST weight. If weight increases → critical
   - For each edge NOT in the MST: force it to be included and recompute. If weight stays same → pseudo-critical

4. **Union-Find Efficiency**: Use Union-Find for cycle detection during Kruskal's algorithm.

### Algorithm Overview

1. Compute baseline MST weight W using Kruskal's algorithm
2. For each edge in MST:
   - Exclude it and compute MST weight
   - If weight > W: it's critical
3. For each edge not in MST:
   - Force include it and compute MST weight
   - If weight == W: it's pseudo-critical
4. Return both lists

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kruskal's with Edge Classification** - Optimal solution
2. **Prim's Algorithm Variant** - Alternative approach

---

## Approach 1: Kruskal's with Edge Classification (Optimal)

### Algorithm Steps

1. **Union-Find Setup**: Create Union-Find with path compression and union by rank
2. **Kruskal Function**: Helper function that computes MST weight with optional edge exclusion/inclusion
3. **Baseline MST**: Compute initial MST weight and track which edges are used
4. **Classify Edges**: Test each edge as described above
5. **Return Results**: Return critical and pseudo-critical edge lists

### Why It Works

Kruskal's algorithm always produces a minimum spanning tree by selecting edges in increasing weight order and adding them if they don't create a cycle. By testing each edge:
- Excluding an edge from MST that increases weight proves it's necessary (critical)
- Including an edge not in MST that doesn't increase weight proves it's replaceable (pseudo-critical)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        """
        Find critical and pseudo-critical edges in MST using Kruskal's algorithm.
        
        Time Complexity: O(E² α(N)) where E is edges, N is vertices
        Space Complexity: O(N + E) for Union-Find and edge storage
        
        Args:
            n: Number of vertices
            edges: List of edges [u, v, weight]
            
        Returns:
            [critical_edges, pseudo_critical_edges]
        """
        class UnionFind:
            def __init__(self, size):
                self.parent = list(range(size))
                self.rank = [0] * size
                self.count = size
            
            def find(self, x):
                if self.parent[x] != x:
                    self.parent[x] = self.find(self.parent[x])
                return self.parent[x]
            
            def union(self, x, y):
                px, py = self.find(x), self.find(y)
                if px == py:
                    return False
                if self.rank[px] < self.rank[py]:
                    self.parent[px] = py
                elif self.rank[px] > self.rank[py]:
                    self.parent[py] = px
                else:
                    self.parent[py] = px
                    self.rank[px] += 1
                self.count -= 1
                return True
        
        def kruskal(excluded=None, forced=None):
            """Run Kruskal's algorithm with optional edge exclusion/inclusion."""
            uf = UnionFind(n)
            weight = 0
            used = set()
            
            # Force include an edge if specified
            if forced is not None:
                u, v, w = edges[forced]
                if uf.union(u, v):
                    weight += w
                    used.add(forced)
                else:
                    # Forced edge creates a cycle - invalid
                    return float('inf'), set()
            
            # Process all edges
            for i, (u, v, w) in enumerate(edges):
                if i == excluded or i == forced:
                    continue
                if uf.union(u, v):
                    weight += w
                    used.add(i)
            
            # Check if we formed a spanning tree
            if uf.count == 1:
                return weight, used
            return float('inf'), set()
        
        # Step 1: Compute baseline MST
        W, mst = kruskal()
        
        # Step 2: Classify each edge
        critical = []
        pseudo = []
        
        for i in range(len(edges)):
            if i in mst:
                # Edge is in MST - test if it's critical
                w2, _ = kruskal(excluded=i)
                if w2 > W:
                    critical.append(i)
            else:
                # Edge is not in MST - test if it's pseudo-critical
                w2, _ = kruskal(forced=i)
                if w2 == W:
                    pseudo.append(i)
        
        return [critical, pseudo]
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class UnionFind {
public:
    vector<int> parent, rank;
    int count;
    
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else {
            parent[py] = px;
            rank[px]++;
        }
        count--;
        return true;
    }
};

class Solution {
public:
    vector<vector<int>> findCriticalAndPseudoCriticalEdges(int n, vector<vector<int>>& edges) {
        auto kruskal = [&](int excluded, int forced) -> pair<int, vector<int>> {
            UnionFind uf(n);
            int weight = 0;
            vector<int> used;
            
            // Force include edge if specified
            if (forced != -1) {
                int u = edges[forced][0], v = edges[forced][1], w = edges[forced][2];
                if (!uf.unite(u, v)) return {INT_MAX, {}};
                weight += w;
                used.push_back(forced);
            }
            
            // Process all edges
            for (int i = 0; i < edges.size(); i++) {
                if (i == excluded || i == forced) continue;
                int u = edges[i][0], v = edges[i][1], w = edges[i][2];
                if (uf.unite(u, v)) {
                    weight += w;
                    used.push_back(i);
                }
            }
            
            if (uf.count == 1) return {weight, used};
            return {INT_MAX, {}};
        };
        
        // Compute baseline MST
        auto [W, mst_set] = kruskal(-1, -1);
        vector<int> mst(mst_set.begin(), mst_set.end());
        vector<bool> inMST(edges.size(), false);
        for (int idx : mst) inMST[idx] = true;
        
        // Classify edges
        vector<int> critical, pseudo;
        
        for (int i = 0; i < edges.size(); i++) {
            if (inMST[i]) {
                auto [w2, _] = kruskal(i, -1);
                if (w2 > W) critical.push_back(i);
            } else {
                auto [w2, _] = kruskal(-1, i);
                if (w2 == W) pseudo.push_back(i);
            }
        }
        
        return {critical, pseudo};
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    class UnionFind {
        int[] parent, rank;
        int count;
        
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            count = n;
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        
        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        }
        
        boolean unite(int x, int y) {
            int px = find(x), py = find(y);
            if (px == py) return false;
            if (rank[px] < rank[py]) parent[px] = py;
            else if (rank[px] > rank[py]) parent[py] = px;
            else {
                parent[py] = px;
                rank[px]++;
            }
            count--;
            return true;
        }
    }
    
    public List<List<Integer>> findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
        int E = edges.length;
        
        // Helper function using Kruskal's
        int[][] kruskal = (int excluded, int forced) -> {
            UnionFind uf = new UnionFind(n);
            int weight = 0;
            List<Integer> used = new ArrayList<>();
            
            // Force include if specified
            if (forced != -1) {
                int u = edges[forced][0], v = edges[forced][1], w = edges[forced][2];
                if (!uf.unite(u, v)) return new int[]{Integer.MAX_VALUE, -1};
                weight += w;
                used.add(forced);
            }
            
            // Process all edges
            for (int i = 0; i < E; i++) {
                if (i == excluded || i == forced) continue;
                int u = edges[i][0], v = edges[i][1], w = edges[i][2];
                if (uf.unite(u, v)) {
                    weight += w;
                    used.add(i);
                }
            }
            
            if (uf.count == 1) return new int[]{weight, 0};
            return new int[]{Integer.MAX_VALUE, -1};
        };
        
        // Compute baseline MST
        int[] baseline = kruskal.apply(-1, -1);
        int W = baseline[0];
        
        // Get MST edges
        Set<Integer> mstSet = new HashSet<>();
        // ... (would need to track used edges)
        
        // Classify
        List<Integer> critical = new ArrayList<>();
        List<Integer> pseudo = new ArrayList<>();
        
        for (int i = 0; i < E; i++) {
            // Test each edge...
            // Implementation similar to above
        }
        
        return List.of(critical, pseudo);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[][]}
 */
var findCriticalAndPseudoCriticalEdges = function(n, edges) {
    class UnionFind {
        constructor(n) {
            this.parent = Array.from({length: n}, (_, i) => i);
            this.rank = new Array(n).fill(0);
            this.count = n;
        }
        
        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }
        
        unite(x, y) {
            const px = this.find(x), py = this.find(y);
            if (px === py) return false;
            if (this.rank[px] < this.rank[py]) {
                this.parent[px] = py;
            } else if (this.rank[px] > this.rank[py]) {
                this.parent[py] = px;
            } else {
                this.parent[py] = px;
                this.rank[px]++;
            }
            this.count--;
            return true;
        }
    }
    
    const kruskal = (excluded, forced) => {
        const uf = new UnionFind(n);
        let weight = 0;
        const used = new Set();
        
        if (forced !== null) {
            const [u, v, w] = edges[forced];
            if (!uf.unite(u, v)) return [Infinity, new Set()];
            weight += w;
            used.add(forced);
        }
        
        for (let i = 0; i < edges.length; i++) {
            if (i === excluded || i === forced) continue;
            const [u, v, w] = edges[i];
            if (uf.unite(u, v)) {
                weight += w;
                used.add(i);
            }
        }
        
        if (uf.count === 1) return [weight, used];
        return [Infinity, new Set()];
    };
    
    // Baseline MST
    const [W, mst] = kruskal(null, null);
    
    // Classify edges
    const critical = [], pseudo = [];
    
    for (let i = 0; i < edges.length; i++) {
        if (mst.has(i)) {
            const [w2, _] = kruskal(i, null);
            if (w2 > W) critical.push(i);
        } else {
            const [w2, _] = kruskal(null, i);
            if (w2 === W) pseudo.push(i);
        }
    }
    
    return [critical, pseudo];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E² × α(N)) where E is edges (≤ 200), N is vertices (≤ 100), α is inverse Ackermann function |
| **Space** | O(N + E) for Union-Find and edge storage |

---

## Approach 2: Prim's Algorithm Variant

### Algorithm Steps

1. Use Prim's algorithm to build MST
2. Track which edges are chosen
3. Test edge importance using similar logic

### Why It Works

Prim's algorithm builds MST by starting from a vertex and repeatedly adding the minimum weight edge that connects to an unvisited vertex. This also allows edge classification.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        """Prim's algorithm variant approach."""
        
        def prim(exclude=-1, force=-1):
            visited = [False] * n
            min_heap = [(0, -1, -1)]  # (weight, from, edge_idx)
            total_weight = 0
            used_edges = set()
            
            # Force include edge
            if force != -1:
                u, v, w = edges[force]
                visited[u] = visited[v] = True
                total_weight = w
                used_edges.add(force)
                for node in [u, v]:
                    for i, (a, b, wt) in enumerate(edges):
                        if i == exclude or i == force: continue
                        if a == node or b == node:
                            other = a if b == node else b
                            if not visited[other]:
                                heapq.heappush(min_heap, (wt, node, i))
            
            while min_heap and sum(visited) < n:
                w, from_node, edge_idx = heapq.heappop(min_heap)
                # Find unvisited vertex
                next_node = None
                if from_node != -1:
                    u, v = edges[edge_idx][:2]
                    next_node = v if visited[u] else u
                
                if next_node is None or visited[next_node]:
                    continue
                    
                visited[next_node] = True
                total_weight += w
                used_edges.add(edge_idx)
                
                # Add edges from new node
                for i, (a, b, wt) in enumerate(edges):
                    if i == exclude or i == force: continue
                    if (a == next_node and not visited[b]) or (b == next_node and not visited[a]):
                        heapq.heappush(min_heap, (wt, next_node, i))
            
            return (total_weight, used_edges) if sum(visited) == n else (float('inf'), set())
        
        W, mst = prim()
        
        critical = []
        pseudo = []
        
        for i in range(len(edges)):
            if i in mst:
                w2, _ = prim(exclude=i)
                if w2 > W:
                    critical.append(i)
            else:
                w2, _ = prim(force=i)
                if w2 == W:
                    pseudo.append(i)
        
        return [critical, pseudo]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E × (E + N) × log E) |
| **Space** | O(E + N) |

---

## Comparison of Approaches

| Aspect | Kruskal's | Prim's Variant |
|--------|-----------|----------------|
| **Time Complexity** | O(E² α(N)) | O(E × (E+N) × log E) |
| **Space Complexity** | O(N + E) | O(E + N) |
| **Implementation** | Moderate | Complex |
| **LeetCode Optimal** | ✅ | ❌ |

**Best Approach:** Use Approach 1 (Kruskal's) for the optimal solution.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Meta
- **Difficulty**: Hard
- **Concepts Tested**: MST, Kruskal's Algorithm, Union-Find, Edge Classification

### Learning Outcomes

1. **MST Deep Understanding**: Understanding the nuances of MST edge importance
2. **Algorithm Testing**: Learning to test edge criticality systematically
3. **Graph Algorithms**: Mastery of Kruskal's algorithm
4. **Optimization**: Efficient edge classification

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Min Cost to Connect All Points | [Link](https://leetcode.com/problems/min-cost-to-connect-all-points/) | MST application |
| Number of Operations to Make Network Connected | [Link](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Graph connectivity |
| Reachable Nodes In Subdivided Graph | [Link](https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/) | MST variant |

### Pattern Reference

For more detailed explanations of the MST pattern, see:
- **[Kruskal's Algorithm](/algorithms/kruskals)**
- **[Prim's Algorithm](/algorithms/prims)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Critical and Pseudo-Critical Edges](https://www.youtube.com/watch?v=v3F2)** - Clear explanation
2. **[Kruskal's Algorithm Tutorial](https://www.youtube.com/watch?v=7)** - Understanding MST

### Related Concepts

- **[Union-Find Data Structure](https://www.youtube.com/watch?v=0)** - Cycle detection
- **[MST Properties](https://www.youtube.com/watch?v=)** - Edge importance

---

## Follow-up Questions

### Q1: How would you modify the solution for directed graphs?

**Answer:** For directed graphs, this becomes finding strongly connected components or using algorithms like Chu-Liu/Edmonds for directed MST. The classification approach would be different.

---

### Q2: What if you needed to find the k-th most critical edge?

**Answer:** Sort edges by their criticality (weight increase when removed) and select the k-th. You can compute this by testing all edges.

---

### Q3: How would you handle edges with equal weights differently?

**Answer:** Equal weights lead to multiple valid MSTs. Our algorithm handles this naturally - edges with equal weights that can be swapped are classified as pseudo-critical.

---

### Q4: Can you find all edges that are never in any MST?

**Answer:** These are edges that, when forced, always create cycles or increase the total weight beyond the MST weight. They would not be classified as critical or pseudo-critical.

---

### Q5: How would you optimize the solution for very large graphs?

**Answer:** Use more efficient data structures, pre-sort edges once, and potentially use parallel processing for edge testing. The core algorithm is already near-optimal.

---

## Common Pitfalls

### 1. Not Handling Edge Weights
**Issue**: The graph may have edges with equal weights, leading to multiple valid MSTs.

**Solution**: The algorithm naturally handles this - pseudo-critical edges capture replaceable edges with equal weights.

### 2. Wrong Classification Logic
**Issue**: Critical edges are those IN the MST that increase weight when excluded. Pseudo-critical edges are those NOT in MST but can be included without increasing weight.

**Solution**: Follow the exact classification logic: exclude for critical, force include for pseudo-critical.

### 3. Cycle Detection in Forced Inclusion
**Issue**: If forcing an edge creates a cycle, return infinity weight.

**Solution**: Check if the edge creates a cycle using Union-Find before adding to weight.

### 4. Edge Indexing
**Issue**: Remember that edges are identified by their original index in the input array.

**Solution**: Track edge indices throughout the algorithm, not just endpoints.

---

## Summary

The **Find Critical And Pseudo Critical Edges** problem demonstrates advanced MST concepts:

- **Kruskal's Algorithm**: Building MST by sorting edges and using Union-Find
- **Edge Classification**: Systematically testing each edge's importance
- **Cycle Detection**: Using Union-Find for efficient cycle checking

Key takeaways:
1. Compute baseline MST weight first
2. Test edges by exclusion (critical) or inclusion (pseudo-critical)
3. Compare new weight to baseline for classification
4. Use Union-Find with path compression for efficiency

This problem is essential for understanding MST edge properties and is a classic graph algorithm problem.

### Pattern Summary

This problem exemplifies the **MST Edge Classification** pattern, characterized by:
- Using Kruskal's algorithm as foundation
- Systematically testing edge importance
- Comparing alternative MST configurations

For more details on MST algorithms, see:
- **[Kruskal's Algorithm](/algorithms/kruskals)**
- **[Prim's Algorithm](/algorithms/prims)**

---

## Additional Resources

- [LeetCode Problem 1489](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/) - Official problem page
- [Kruskal's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kruskals-algo-minimum-spanning-tree/) - Detailed explanation
- [Union-Find - Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) - Data structure reference
- [Pattern: MST](/algorithms/kruskals) - Comprehensive guide
