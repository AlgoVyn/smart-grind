# Number of Connected Components in an Undirected Graph

## Problem Description

Given an undirected graph with `n` nodes labeled from `0` to `n-1`, and a list of edges where each edge is a pair `[u, v]` representing an undirected edge between nodes `u` and `v`, return the number of connected components in the graph.

A connected component is a set of nodes where each pair of nodes is connected by a path, and no node in the set is connected to any node outside the set.

**Link to problem:** [Number of Connected Components in an Undirected Graph - LeetCode 323](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

---

## Pattern: Union-Find (Disjoint Set Union)

This problem is a classic example of the **Union-Find** data structure pattern. It can also be solved using DFS/BFS for graph traversal.

### Core Concept

The fundamental idea is:
- Use Union-Find to group nodes that are connected
- Each edge unions two nodes
- Count the number of unique roots at the end
- Or alternatively, use DFS/BFS to find connected components through traversal

---

## Examples

### Example

**Input:**
```
n = 5, edges = [[0, 1], [1, 2], [3, 4]]
```

**Output:**
```
2
```

**Explanation:** 
- Component 1: nodes 0, 1, 2 (connected through edges 0-1 and 1-2)
- Component 2: nodes 3, 4 (connected through edge 3-4)

### Example 2

**Input:**
```
n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]
```

**Output:**
```
1
```

**Explanation:** All 5 nodes are connected in a single component.

### Example 3

**Input:**
```
n = 4, edges = []
```

**Output:**
```
4
```

**Explanation:** No edges, each node is its own component.

---

## Constraints

- `1 <= n <= 200`
- `0 <= edges.length <= n * (n - 1) / 2`
- `edges[i].length == 2`
- `0 <= u, v < n`
- `u != v`

---

## Intuition

The key insight is that we need to find how many groups of connected nodes exist. Union-Find provides an elegant solution: we process each edge and union the connected nodes. At the end, the number of distinct roots equals the number of connected components.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find (DSU)** - O(n + e × α(n)) time (Optimal)
2. **DFS/BFS Traversal** - O(n + e) time

---

## Approach 1: Union-Find (Optimal)

### Algorithm Steps

1. Initialize parent array where each node is its own parent
2. Initialize rank array for union by rank (optional for optimization)
3. For each edge (u, v):
   - Union nodes u and v
4. Count nodes where parent[i] == i (these are the roots)
5. Return the count

### Why It Works

Union-Find efficiently tracks connected components through:
- **Find**: Locate the root of a node (with path compression)
- **Union**: Merge two components (by rank/size)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        """
        Count connected components using Union-Find.
        
        Args:
            n: Number of nodes
            edges: List of edges [u, v]
            
        Returns:
            Number of connected components
        """
        parent = list(range(n))
        rank = [0] * n
        
        def find(x: int) -> int:
            """Find root with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x: int, y: int) -> None:
            """Union by rank."""
            px, py = find(x), find(y)
            if px == py:
                return
            if rank[px] > rank[py]:
                parent[py] = px
            elif rank[px] < rank[py]:
                parent[px] = py
            else:
                parent[py] = px
                rank[px] += 1
        
        # Process all edges
        for u, v in edges:
            union(u, v)
        
        # Count unique roots
        return sum(1 for i in range(n) if parent[i] == i)
```

<!-- slide -->
```cpp
class Solution {
public:
    int countComponents(int n, vector<pair<int, int>>& edges) {
        /**
         * Count connected components using Union-Find.
         * 
         * Args:
         *     n: Number of nodes
         *     edges: List of edges [u, v]
         * 
         * Returns:
         *     Number of connected components
         */
        vector<int> parent(n);
        vector<int> rank(n, 0);
        
        iota(parent.begin(), parent.end(), 0);
        
        function<int(int)> find = [&](int x) -> int {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        };
        
        auto unionSets = [&](int x, int y) {
            int px = find(x), py = find(y);
            if (px == py) return;
            if (rank[px] > rank[py]) {
                parent[py] = px;
            } else if (rank[px] < rank[py]) {
                parent[px] = py;
            } else {
                parent[py] = px;
                rank[px]++;
            }
        };
        
        for (auto& e : edges) {
            unionSets(e.first, e.second);
        }
        
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == i) count++;
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countComponents(int n, int[][] edges) {
        /**
         * Count connected components using Union-Find.
         * 
         * Args:
         *     n: Number of nodes
         *     edges: List of edges [u, v]
         * 
         * Returns:
         *     Number of connected components
         */
        int[] parent = new int[n];
        int[] rank = new int[n];
        
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        
        for (int[] edge : edges) {
            union(edge[0], edge[1], parent, rank);
        }
        
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (find(i, parent) == i) count++;
        }
        
        return count;
    }
    
    private int find(int x, int[] parent) {
        if (parent[x] != x) {
            parent[x] = find(parent[x], parent);
        }
        return parent[x];
    }
    
    private void union(int x, int y, int[] parent, int[] rank) {
        int px = find(x, parent);
        int py = find(y, parent);
        if (px == py) return;
        
        if (rank[px] > rank[py]) {
            parent[py] = px;
        } else if (rank[px] < rank[py]) {
            parent[px] = py;
        } else {
            parent[py] = px;
            rank[px]++;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Count connected components using Union-Find.
 * 
 * @param {number} n - Number of nodes
 * @param {number[][]} edges - List of edges [u, v]
 * @return {number} - Number of connected components
 */
var countComponents = function(n, edges) {
    const parent = Array.from({length: n}, (_, i) => i);
    const rank = new Array(n).fill(0);
    
    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };
    
    const union = (x, y) => {
        const px = find(x);
        const py = find(y);
        if (px === py) return;
        
        if (rank[px] > rank[py]) {
            parent[py] = px;
        } else if (rank[px] < rank[py]) {
            parent[px] = py;
        } else {
            parent[py] = px;
            rank[px]++;
        }
    };
    
    for (const [u, v] of edges) {
        union(u, v);
    }
    
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (parent[i] === i) count++;
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e × α(n)) - α(n) is inverse Ackermann, nearly constant |
| **Space** | O(n) - parent and rank arrays |

---

## Approach 2: DFS/BFS Traversal

### Algorithm Steps

1. Build adjacency list from edges
2. Initialize visited array
3. For each unvisited node:
   - Run DFS/BFS to mark all reachable nodes
   - Increment component count
4. Return component count

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def countComponents_dfs(self, n: int, edges: List[List[int]]) -> int:
        """
        Count connected components using DFS.
        """
        # Build adjacency list
        graph = defaultdict(list)
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        visited = set()
        count = 0
        
        def dfs(node):
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    dfs(neighbor)
        
        for i in range(n):
            if i not in visited:
                dfs(i)
                count += 1
        
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    int countComponents(int n, vector<pair<int, int>>& edges) {
        vector<vector<int>> graph(n);
        for (auto& e : edges) {
            graph[e.first].push_back(e.second);
            graph[e.second].push_back(e.first);
        }
        
        vector<bool> visited(n, false);
        int count = 0;
        
        function<void(int)> dfs = [&](int node) {
            visited[node] = true;
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    dfs(neighbor);
                }
            }
        };
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i);
                count++;
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countComponents(int n, int[][] edges) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
            graph.get(edge[1]).add(edge[0]);
        }
        
        boolean[] visited = new boolean[n];
        int count = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, graph, visited);
                count++;
            }
        }
        
        return count;
    }
    
    private void dfs(int node, List<List<Integer>> graph, boolean[] visited) {
        visited[node] = true;
        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                dfs(neighbor, graph, visited);
            }
        }
    }
}
```

<!-- slide -->
```javascript
var countComponents = function(n, edges) {
    const graph = Array.from({length: n}, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Array(n).fill(false);
    let count = 0;
    
    const dfs = (node) => {
        visited[node] = true;
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    };
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            count++;
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) - Visit each node and edge once |
| **Space** | O(n + e) - Adjacency list and visited array |

---

## Comparison of Approaches

| Aspect | Union-Find | DFS/BFS |
|--------|------------|---------|
| **Time** | O(n + e × α(n)) | O(n + e) |
| **Space** | O(n) | O(n + e) |
| **Implementation** | More complex | Simpler |
| **Best For** | Dynamic connectivity | Static graphs |

Both approaches are optimal. Union-Find is slightly better for sparse graphs.

---

## Related Problems

Based on similar themes (graph connectivity, Union-Find):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Similar connected components |
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Check if graph is a tree |
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Union-Find application |
| Critical Connections | [Link](https://leetcode.com/problems/critical-connections-in-a-network/) | Find bridges |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Union-Find

- [NeetCode - Number of Connected Components](https://www.youtube.com/watch?v=7H5k2qw5Pk0) - Clear explanation
- [Union-Find Data Structure](https://www.youtube.com/watch?v=0x9n2ntfJZ0) - Complete guide
- [Path Compression](https://www.youtube.com/watch?v=ID00PxR9HzE) - Optimization explained

### DFS/BFS

- [Graph Traversal](https://www.youtube.com/watch?v=pcKY4hjDrxk) - DFS and BFS explained
- [Connected Components](https://www.youtube.com/watch?v=CMaR1L1X0bU) - Finding components

---

## Follow-up Questions

### Q1: What is the difference between Union-Find and DFS for this problem?

**Answer:** Both solve the problem correctly. Union-Find is better for dynamic connectivity (many union operations), while DFS/BFS is more intuitive and simpler to implement.

---

### Q2: Why is Union-Find's time complexity nearly O(n + e)?

**Answer:** The inverse Ackermann function α(n) is extremely slow-growing. For any practical n, α(n) ≤ 4, making Union-Find essentially O(n + e).

---

### Q3: What is path compression?

**Answer:** Path compression is an optimization where during find(), we make every node on the path point directly to the root. This flattens the tree structure and speeds up future operations.

---

### Q4: What is union by rank?

**Answer:** Union by rank attaches the smaller tree under the root of the larger tree. This keeps the tree balanced and ensures O(log n) find time in the worst case.

---

### Q5: How would you modify for a directed graph?

**Answer:** For directed graphs, you need Strongly Connected Components (SCC) using Kosaraju's or Tarjan's algorithm. Union-Find doesn't work for directed graphs.

---

### Q6: Can you solve this without building an adjacency list?

**Answer:** Yes, with Union-Find you don't need an adjacency list. You just process edges directly, which is more memory efficient for sparse graphs.

---

### Q7: What edge cases should be tested?

**Answer:**
- No edges (each node is a component)
- All nodes connected (one component)
- Disconnected graph with multiple components
- Self-loops (should be handled)
- Duplicate edges (Union-Find handles gracefully)

---

## Common Pitfalls

### 1. Forgetting to Initialize Parent Array
**Issue:** Not setting parent[i] = i initially.

**Solution:** Each node starts as its own parent: `parent = list(range(n))`

### 2. Not Checking if Nodes are Already Connected
**Issue:** Union may be called on already connected nodes.

**Solution:** The find() call handles this; union should check if roots are different.

### 3. Using Wrong Data Structure for Adjacency List
**Issue:** Using incorrect container for building graph.

**Solution:** Use defaultdict(list) in Python, vector<vector<int>> in C++.

---

## Summary

The **Number of Connected Components** problem demonstrates:

- **Union-Find Data Structure**: Efficient disjoint set operations
- **Path Compression**: Optimization for find()
- **Union by Rank**: Balancing technique for unions
- **Time Complexity**: O(n + e × α(n)) ≈ O(n + e)
- **Space Complexity**: O(n)

This problem is fundamental for understanding graph connectivity and the powerful Union-Find data structure.

For more details on this pattern, see the **[Union-Find](/algorithms/graph/union-find)**.
