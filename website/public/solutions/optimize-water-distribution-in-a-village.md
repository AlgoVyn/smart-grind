# Optimize Water Distribution In A Village

## Problem Description

There are `n` houses in a village. Some houses have wells, and some houses have pipes connecting them to the water distribution system. We need to supply water to all houses with minimum cost.

Each house can be connected either to its own well (with a certain cost) or to another house that has water (via pipes). We need to find the minimum total cost to supply water to all houses.

## Examples

### Example

**Input:** `n = 3`, `wells = [1,2,2]`, `pipes = [[1,2,1],[2,3,1]]`  
**Output:** `3`

**Explanation:** 
- Connect house 1 to its well (cost 1)
- Connect house 2 to house 1 via pipe (cost 1)
- Connect house 3 to house 2 via pipe (cost 1)
- Total cost = 3

## Constraints

- `1 <= n <= 10^4`
- `wells.length == n`
- `1 <= wells[i] <= 10^6`
- `1 <= pipes.length <= 10^4`
- `1 <= pipes[i][0], pipes[i][1] <= n`
- `1 <= pipes[i][2] <= 10^6`

---

## Pattern: Minimum Spanning Tree (MST) - Kruskal's Algorithm

This problem is a classic example of the **Minimum Spanning Tree (MST)** pattern. The problem can be modeled as finding the minimum cost to connect all houses to a water source.

### Core Concept

- **Virtual Well Node**: Add a virtual node (node 0) connected to all houses with edge weight equal to building a well
- **MST Problem**: Find the minimum spanning tree connecting all houses
- **Kruskal's Algorithm**: Greedy approach to find MST by sorting edges and using Union-Find

---

## Intuition

The key insight for this problem is transforming it into a graph problem:

1. **Well as Virtual Node**: Building a well for house i is equivalent to connecting to a virtual well node (node 0) with edge weight wells[i]
2. **Pipes as Edges**: Each pipe connects two houses with a given cost
3. **MST**: Find minimum spanning tree to connect all houses (plus virtual node)

### Why MST Works

- We need to supply water to ALL houses
- Each house needs exactly one connection to the water source
- The minimum cost to connect all nodes is exactly the MST
- Kruskal's algorithm finds this efficiently

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Kruskal's Algorithm** - Standard MST approach with Union-Find
2. **Prim's Algorithm** - Alternative MST approach using priority queue
3. **Optimized Kruskal's** - Early termination when all houses connected

---

## Approach 1: Kruskal's Algorithm (Recommended)

### Algorithm Steps

1. Create a list of all edges:
   - For each house i, add edge (wells[i], 0, i) - virtual well connection
   - For each pipe [u, v, cost], add edge (cost, u, v)
2. Sort all edges by cost (ascending)
3. Initialize Union-Find for n+1 nodes (0 to n)
4. Iterate through sorted edges:
   - If u and v are not connected, union them and add cost to total
   - Stop when all n houses are connected
5. Return total cost

### Why It Works

Kruskal's algorithm always produces a minimum spanning tree. By treating building a well as connecting to a virtual node, we include both options (well or pipe) in our MST calculation.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minCostToSupplyWater(self, n: int, wells: List[int], pipes: List[List[int]]) -> int:
        """
        Find minimum cost to supply water using Kruskal's Algorithm.
        
        Args:
            n: Number of houses
            wells: Cost to build a well for each house (1-indexed)
            pipes: List of [house1, house2, cost] pipes
            
        Returns:
            Minimum total cost to supply water to all houses
        """
        # Create edges list: (cost, u, v)
        # Add virtual well edges (from node 0 to each house)
        edges = []
        for i, cost in enumerate(wells):
            edges.append((cost, 0, i + 1))  # Using 1-indexed houses
        
        # Add pipe edges
        for u, v, cost in pipes:
            edges.append((cost, u, v))
        
        # Sort edges by cost
        edges.sort()
        
        # Union-Find data structure
        parent = list(range(n + 1))
        
        def find(x: int) -> int:
            """Find root with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x: int, y: int) -> bool:
            """Union two sets. Returns True if merged."""
            px, py = find(x), find(y)
            if px == py:
                return False
            parent[py] = px
            return True
        
        total_cost = 0
        edges_used = 0
        
        for cost, u, v in edges:
            if union(u, v):
                total_cost += cost
                edges_used += 1
                # Stop when all n houses are connected
                if edges_used == n:
                    break
        
        return total_cost
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    vector<int> parent;
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        parent[py] = px;
        return true;
    }
    
public:
    int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
        // Create edges list
        vector<tuple<int, int, int>> edges;
        
        // Add virtual well edges
        for (int i = 0; i < wells.size(); i++) {
            edges.emplace_back(wells[i], 0, i + 1);
        }
        
        // Add pipe edges
        for (const auto& pipe : pipes) {
            edges.emplace_back(pipe[2], pipe[0], pipe[1]);
        }
        
        // Sort edges by cost
        sort(edges.begin(), edges.end());
        
        // Initialize Union-Find
        parent.resize(n + 1);
        iota(parent.begin(), parent.end(), 0);
        
        int total_cost = 0;
        int edges_used = 0;
        
        for (const auto& [cost, u, v] : edges) {
            if (unite(u, v)) {
                total_cost += cost;
                edges_used++;
                if (edges_used == n) break;
            }
        }
        
        return total_cost;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private int[] parent;
    
    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    private boolean unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        parent[py] = px;
        return true;
    }
    
    public int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
        // Create edges list
        List<int[]> edges = new ArrayList<>();
        
        // Add virtual well edges
        for (int i = 0; i < wells.length; i++) {
            edges.add(new int[]{wells[i], 0, i + 1});
        }
        
        // Add pipe edges
        for (int[] pipe : pipes) {
            edges.add(new int[]{pipe[2], pipe[0], pipe[1]});
        }
        
        // Sort edges by cost
        edges.sort(Comparator.comparingInt(e -> e[0]));
        
        // Initialize Union-Find
        parent = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
        }
        
        int totalCost = 0;
        int edgesUsed = 0;
        
        for (int[] edge : edges) {
            int cost = edge[0];
            int u = edge[1];
            int v = edge[2];
            
            if (unite(u, v)) {
                totalCost += cost;
                edgesUsed++;
                if (edgesUsed == n) break;
            }
        }
        
        return totalCost;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[]} wells
 * @param {number[][]} pipes
 * @return {number}
 */
var minCostToSupplyWater = function(n, wells, pipes) {
    // Create edges list
    const edges = [];
    
    // Add virtual well edges
    for (let i = 0; i < wells.length; i++) {
        edges.push([wells[i], 0, i + 1]);
    }
    
    // Add pipe edges
    for (const [u, v, cost] of pipes) {
        edges.push([cost, u, v]);
    }
    
    // Sort edges by cost
    edges.sort((a, b) => a[0] - b[0]);
    
    // Union-Find
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    function unite(x, y) {
        const px = find(x), py = find(y);
        if (px === py) return false;
        parent[py] = px;
        return true;
    }
    
    let totalCost = 0;
    let edgesUsed = 0;
    
    for (const [cost, u, v] of edges) {
        if (unite(u, v)) {
            totalCost += cost;
            edgesUsed++;
            if (edgesUsed === n) break;
        }
    }
    
    return totalCost;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((n + m) log(n + m)) - Sorting edges, where m = number of pipes |
| **Space** | O(n + m) - For edges list and Union-Find |

---

## Approach 2: Prim's Algorithm

### Algorithm Steps

1. Build adjacency list from pipes and add virtual well connections
2. Use a min-heap (priority queue) for efficient edge selection
3. Start from any house and repeatedly add the minimum cost edge to an unvisited node
4. Continue until all houses are connected
5. Return total cost

### Why It Works

Prim's algorithm is another greedy algorithm that builds the MST by starting from a node and repeatedly adding the minimum cost edge that connects a new node to the growing tree.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def minCostToSupplyWater(self, n: int, wells: List[int], pipes: List[List[int]]) -> int:
        """Find minimum cost using Prim's Algorithm."""
        # Build adjacency list
        graph = {i: [] for i in range(1, n + 1)}
        
        # Add virtual well connections (as edges from virtual node 0)
        for i, cost in enumerate(wells):
            graph[0].append((cost, 0, i + 1))
        
        # Add pipe edges (bidirectional)
        for u, v, cost in pipes:
            graph[u].append((cost, u, v))
            graph[v].append((cost, v, u))
        
        # Prim's algorithm
        visited = set()
        min_heap = [(0, 0, 0)]  # (cost, from, to)
        total_cost = 0
        
        while min_heap and len(visited) < n + 1:
            cost, _, node = heapq.heappop(min_heap)
            
            if node in visited:
                continue
            
            visited.add(node)
            total_cost += cost
            
            for edge_cost, u, v in graph[node]:
                if v not in visited:
                    heapq.heappush(min_heap, (edge_cost, node, v))
        
        # Subtract the initial 0 cost edge we started with
        return total_cost
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
        // Build adjacency list
        vector<vector<pair<int, int>>> graph(n + 1);
        
        // Add virtual well connections
        for (int i = 0; i < wells.size(); i++) {
            graph[0].push_back({wells[i], i + 1});
            graph[i + 1].push_back({wells[i], 0});
        }
        
        // Add pipe edges
        for (const auto& pipe : pipes) {
            int u = pipe[0], v = pipe[1], cost = pipe[2];
            graph[u].push_back({cost, v});
            graph[v].push_back({cost, u});
        }
        
        // Prim's algorithm
        vector<bool> visited(n + 1, false);
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> pq;
        pq.emplace(0, 0, 0);
        
        int total_cost = 0;
        
        while (!pq.empty() && visited.size() < n + 1) {
            auto [cost, from, to] = pq.top();
            pq.pop();
            
            if (visited[to]) continue;
            
            visited[to] = true;
            total_cost += cost;
            
            for (auto [edge_cost, neighbor] : graph[to]) {
                if (!visited[neighbor]) {
                    pq.emplace(edge_cost, to, neighbor);
                }
            }
        }
        
        return total_cost;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
        // Build adjacency list
        List<int[]>[] graph = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }
        
        // Add virtual well connections
        for (int i = 1; i <= n; i++) {
            graph[0].add(new int[]{wells[i - 1], i});
            graph[i].add(new int[]{wells[i - 1], 0});
        }
        
        // Add pipe edges
        for (int[] pipe : pipes) {
            int u = pipe[0], v = pipe[1], cost = pipe[2];
            graph[u].add(new int[]{cost, v});
            graph[v].add(new int[]{cost, u});
        }
        
        // Prim's algorithm
        boolean[] visited = new boolean[n + 1];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, 0, 0});
        
        int totalCost = 0;
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int cost = curr[0], to = curr[2];
            
            if (visited[to]) continue;
            
            visited[to] = true;
            totalCost += cost;
            
            for (int[] edge : graph[to]) {
                if (!visited[edge[1]]) {
                    pq.add(new int[]{edge[0], to, edge[1]});
                }
            }
        }
        
        return totalCost;
    }
}
```

<!-- slide -->
```javascript
var minCostToSupplyWater = function(n, wells, pipes) {
    // Build adjacency list
    const graph = Array.from({ length: n + 1 }, () => []);
    
    // Add virtual well connections
    for (let i = 1; i <= n; i++) {
        graph[0].push([wells[i - 1], i]);
        graph[i].push([wells[i - 1], 0]);
    }
    
    // Add pipe edges
    for (const [u, v, cost] of pipes) {
        graph[u].push([cost, v]);
        graph[v].push([cost, u]);
    }
    
    // Prim's algorithm
    const visited = new Set();
    const pq = [[0, 0, 0]];  // (cost, from, to)
    let totalCost = 0;
    
    while (pq.length > 0 && visited.size < n + 1) {
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, , to] = pq.shift();
        
        if (visited.has(to)) continue;
        
        visited.add(to);
        totalCost += cost;
        
        for (const [edgeCost, neighbor] of graph[to]) {
            if (!visited.has(neighbor)) {
                pq.push([edgeCost, to, neighbor]);
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
| **Time** | O((n + m) log n) - Priority queue operations |
| **Space** | O(n + m) - For graph and visited set |

---

## Approach 3: Optimized Kruskal's with Early Termination

### Algorithm Steps

1. Similar to Approach 1, but with optimizations:
   - Use a more efficient edge representation
   - Early termination when all houses connected
   - Avoid adding unnecessary edges

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minCostToSupplyWater(self, n: int, wells: List[int], pipes: List[List[int]]) -> int:
        """Optimized Kruskal's with early termination."""
        
        # Union-Find with rank optimization
        parent = list(range(n + 1))
        rank = [0] * (n + 1)
        
        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]  # Path halving
                x = parent[x]
            return x
        
        def union(x: int, y: int) -> bool:
            px, py = find(x), find(y)
            if px == py:
                return False
            if rank[px] < rank[py]:
                px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]:
                rank[px] += 1
            return True
        
        # Build and sort edges
        edges = [(wells[i], 0, i + 1) for i in range(n)]
        edges.extend((cost, u, v) for u, v, cost in pipes)
        edges.sort()
        
        # Kruskal's with early termination
        total = 0
        connected = 0
        
        for cost, u, v in edges:
            if union(u, v):
                total += cost
                connected += 1
                if connected == n:
                    break
        
        return total
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

class Solution {
public:
    int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
        vector<int> parent(n + 1);
        vector<int> rank(n + 1, 0);
        iota(parent.begin(), parent.end(), 0);
        
        auto find = [&](int x, auto&& self) -> int {
            while (parent[x] != x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        
        auto unite = [&](int x, int y) -> bool {
            int px = find(x, find), py = find(y, find);
            if (px == py) return false;
            if (rank[px] < rank[py]) swap(px, py);
            parent[py] = px;
            if (rank[px] == rank[py]) rank[px]++;
            return true;
        };
        
        vector<tuple<int, int, int>> edges;
        for (int i = 0; i < n; i++) 
            edges.emplace_back(wells[i], 0, i + 1);
        for (const auto& p : pipes) 
            edges.emplace_back(p[2], p[0], p[1]);
        sort(edges.begin(), edges.end());
        
        int total = 0, connected = 0;
        for (const auto& [cost, u, v] : edges) {
            if (unite(u, v)) {
                total += cost;
                if (++connected == n) break;
            }
        }
        return total;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
        int[] parent = new int[n + 1];
        int[] rank = new int[n + 1];
        for (int i = 0; i <= n; i++) parent[i] = i;
        
        java.util.function.IntUnaryOperator find = x -> {
            while (parent[x] != x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        
        java.util.function.BiFunction<Integer, Integer, Boolean> unite = (x, y) -> {
            int px = find.applyAsInt(x);
            int py = find.applyAsInt(y);
            if (px == py) return false;
            if (rank[px] < rank[py]) {
                int temp = px; px = py; py = temp;
            }
            parent[py] = px;
            if (rank[px] == rank[py]) rank[px]++;
            return true;
        };
        
        java.util.List<int[]> edges = new java.util.ArrayList<>();
        for (int i = 0; i < n; i++) 
            edges.add(new int[]{wells[i], 0, i + 1});
        for (int[] p : pipes) 
            edges.add(new int[]{p[2], p[0], p[1]});
        edges.sort(java.util.Comparator.comparingInt(e -> e[0]));
        
        int total = 0, connected = 0;
        for (int[] e : edges) {
            if (unite.apply(e[1], e[2])) {
                total += e[0];
                if (++connected == n) break;
            }
        }
        return total;
    }
}
```

<!-- slide -->
```javascript
var minCostToSupplyWater = function(n, wells, pipes) {
    // Union-Find with path compression and union by rank
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const rank = new Array(n + 1).fill(0);
    
    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };
    
    const unite = (x, y) => {
        const px = find(x), py = find(y);
        if (px === py) return false;
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    };
    
    // Build and sort edges
    const edges = wells.map((cost, i) => [cost, 0, i + 1]);
    for (const [u, v, cost] of pipes) edges.push([cost, u, v]);
    edges.sort((a, b) => a[0] - b[0]);
    
    // Kruskal's with early termination
    let total = 0, connected = 0;
    for (const [cost, u, v] of edges) {
        if (unite(u, v)) {
            total += cost;
            if (++connected === n) break;
        }
    }
    
    return total;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((n + m) log(n + m)) |
| **Space** | O(n + m) |

---

## Comparison of Approaches

| Aspect | Kruskal's | Prim's | Optimized Kruskal's |
|--------|-----------|--------|---------------------|
| **Time Complexity** | O((n+m) log(n+m)) | O((n+m) log n) | O((n+m) log(n+m)) |
| **Space Complexity** | O(n+m) | O(n+m) | O(n+m) |
| **Implementation** | Simple | Moderate | Simple |
| **Best For** | Sparse graphs | Dense graphs | Most cases |

**Best Approach:** Kruskal's Algorithm (Approach 1) is recommended for its simplicity and effectiveness.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple
- **Difficulty**: Hard
- **Concepts Tested**: MST, Graph Algorithms, Union-Find, Greedy

### Learning Outcomes

1. **Graph Modeling**: Transform real-world problems into graph problems
2. **MST Understanding**: Learn minimum spanning tree algorithms
3. **Greedy Approach**: Understand greedy algorithm correctness
4. **Union-Find**: Master the Disjoint Set Union data structure

---

## Related Problems

Based on similar themes (MST, Graph, Union-Find):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Check if connected graph |
| Number of Operations | [Link](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Similar connectivity |
| Min Cost to Connect All Points | [Link](https://leetcode.com/problems/min-cost-to-connect-all-points/) | MST on points |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Cost to Build Town | [Link](https://leetcode.com/problems/minimum-cost-to-build-town/) | Similar MST problem |
| Critical Connections | [Link](https://leetcode.com/problems/critical-connections-in-a-network/) | Bridge finding |

### Pattern Reference

For more detailed explanations of the MST pattern, see:
- **[Minimum Spanning Tree Pattern](/patterns/mst)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Water Distribution](https://www.youtube.com/watch?v=6B3J5hT72Mc)** - Clear explanation with examples
2. **[Water Distribution - LeetCode 1168](https://www.youtube.com/watch?v=5Wa5-zXyK3k)** - Detailed walkthrough
3. **[Kruskal's Algorithm Explained](https://www.youtube.com/watch?v=5Wa5-zXyK3k)** - MST algorithm
4. **[Prim's Algorithm](https://www.youtube.com/watch?v=ZtZaR7EcI5Y)** - Alternative MST approach

### Related Concepts

- **[Minimum Spanning Tree](https://www.youtube.com/watch?v=5Wa5-zXyK3k)** - MST fundamentals
- **[Union-Find](https://www.youtube.com/watch?v=0jNmHPfA_yE)** - DSU data structure

---

## Follow-up Questions

### Q1: What is the time complexity?

**Answer:** The time complexity is O((n + m) log(n + m)) where n is the number of houses and m is the number of pipes. This is dominated by sorting the edges.

---

### Q2: Why add a virtual well node?

**Answer:** The virtual well node (node 0) allows us to model building a well as connecting to this node. This unifies both options (build well vs. use pipe) into a single MST problem.

---

### Q3: Can you solve without the virtual node?

**Answer:** Yes, you could run MST starting from each house with a well and take the minimum, but this would be less efficient. The virtual node approach elegantly handles all cases in one run.

---

### Q4: What if some houses already have wells?

**Answer:** The wells array already represents which houses have wells and their costs. If a house has no well, it would need to connect via pipes. The solution handles this naturally.

---

### Q5: How does Kruskal's guarantee optimality?

**Answer:** Kruskal's algorithm is a greedy algorithm that always picks the minimum weight edge that doesn't create a cycle. This is proven to produce the minimum spanning tree.

---

### Q6: What is the difference between Kruskal's and Prim's?

**Answer:** Kruskal's starts with individual nodes and merges them. Prim's starts from a node and grows the tree. Both produce the same MST but with different data structures.

---

### Q7: When should you use Prim's over Kruskal's?

**Answer:** Prim's is better for dense graphs (many edges) because it doesn't need to sort all edges. Kruskal's is better for sparse graphs.

---

### Q8: What edge cases should be tested?

**Answer:**
- All houses already have wells (no pipes needed)
- All houses connected by cheap pipes (no wells needed)
- Mix of wells and pipes
- Single house
- Empty pipes list

---

## Common Pitfalls

### 1. 1-indexing vs 0-indexing
**Issue**: Confusing between 0-indexed arrays and 1-indexed house numbers.

**Solution**: Always adjust for the virtual node (0) and house indices (1 to n).

### 2. Not Handling Empty Pipes
**Issue**: Assuming pipes always exist.

**Solution**: The algorithm handles empty pipes naturally - all wells will be built.

### 3. Integer Overflow
**Answer**: For large costs (up to 10^6) and many edges, use long (64-bit) to avoid overflow.

### 4. Early Termination Timing
**Issue**: Stopping too early or too late.

**Solution**: Stop when exactly n edges have been added (connecting n+1 nodes including virtual well).

---

## Summary

The **Optimize Water Distribution in a Village** problem demonstrates:

- **Graph Modeling**: Transform infrastructure problem into MST
- **Virtual Node**: Elegant trick to handle multiple options
- **Kruskal's Algorithm**: Greedy MST solution with Union-Find
- **Prim's Algorithm**: Alternative MST approach

Key takeaways:
1. Add virtual node 0 connected to each house with well cost
2. Use Kruskal's algorithm to find MST
3. Stop when all n houses are connected
4. Time complexity is O((n+m) log(n+m))

This problem is excellent for understanding MST and its applications in real-world infrastructure planning.

### Pattern Summary

This problem exemplifies the **Minimum Spanning Tree (MST)** pattern, characterized by:
- Finding minimum cost to connect all nodes
- Greedy approach (Kruskal's or Prim's)
- Union-Find for cycle detection
- Virtual node for multiple source handling

For more details on this pattern and its variations, see the **[Minimum Spanning Tree Pattern](/patterns/mst)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/optimize-water-distribution-in-a-village/discuss/) - Community solutions
- [Kruskal's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kruskals-algorithm-spanning-tree/) - MST explanation
- [Prim's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/prims-mst-greedy-algo-4/) - Alternative MST
- [Pattern: MST](/patterns/mst) - Comprehensive pattern guide
