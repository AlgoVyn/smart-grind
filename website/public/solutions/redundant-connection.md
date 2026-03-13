# Redundant Connection

## Problem Description

You are given a graph with `n` nodes labeled from 1 to n. This graph is a tree (connected and acyclic) with n edges. One edge is extra.

Return the edge that can be removed to make the graph a tree.

**Link to problem:** [Redundant Connection - LeetCode 684](https://leetcode.com/problems/redundant-connection/)

## Constraints
- `2 <= n <= 1000`
- `edges[i].length == 2`
- `1 <= ui, vi <= n`
- The graph has exactly n nodes and n edges
- It's guaranteed that the input represents a connected graph with one extra edge

---

## Pattern: Union Find (Disjoint Set)

This problem is a classic example of the **Union Find (Disjoint Set Union)** pattern. The pattern efficiently tracks connected components and detects cycles in an undirected graph.

### Core Concept

- **Union-Find**: A data structure that tracks connected components
- **Cycle Detection**: When an edge connects two nodes that are already in the same component, a cycle is created
- **Return Last Edge in Cycle**: Since edges are given in order, return the last edge that forms a cycle

---

## Examples

### Example

**Input:**
```
edges = [[1,2], [1,3], [2,3]]
```

**Output:**
```
[2, 3]
```

**Explanation:**
- Adding edge [1,2]: nodes 1 and 2 are connected
- Adding edge [1,3]: nodes 1 and 3 are connected
- Adding edge [2,3]: nodes 2 and 3 are already connected (path: 2→1→3), so this creates a cycle
- Return [2,3] as it's the edge that can be removed to make the graph a tree

### Example 2

**Input:**
```
edges = [[1,2], [2,3], [3,4], [1,4], [1,5]]
```

**Output:**
```
[1, 4]
```

**Explanation:**
- The graph has a cycle: 1→2→3→4→1
- Edge [1,4] completes this cycle and is the last edge in the cycle
- Removing [1,4] breaks the cycle and makes the graph a tree

### Example 3

**Input:**
```
edges = [[1,2], [2,3], [3,1]]
```

**Output:**
```
[3, 1]
```

**Explanation:**
- Adding edges [1,2] and [2,3] creates a path: 1→2→3
- Adding edge [3,1] creates a cycle: 1→2→3→1
- Return [3,1] as it's the last edge added that creates the cycle

---

## Intuition

The key insight is understanding what makes a graph a tree:

1. **Tree Property**: A tree with n nodes has exactly n-1 edges and is connected
2. **Extra Edge**: Our input has n edges, so there's exactly one extra edge
3. **Cycle Detection**: The extra edge must be part of a cycle
4. **Order Matters**: Since edges are given in order, the last edge that forms a cycle is the answer

### Why Union-Find?

Union-Find provides an efficient way to:
- **Track components**: Quickly determine which nodes are connected
- **Detect cycles**: When trying to union two nodes that are already connected, we find a cycle
- **Path compression**: Optimize find operations for near O(1) performance

### Alternative Approaches

1. **DFS/BFS**: Perform graph traversal to detect cycles
2. **Union-Find**: More efficient for this specific problem

The Union-Find approach is preferred because it naturally handles the "last edge in cycle" requirement and has nearly O(n) time complexity.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find (Optimal)** - O(n * α(n)) time, O(n) space
2. **DFS Cycle Detection** - O(n) time, O(n) space

---

## Approach 1: Union-Find (Optimal)

This is the most efficient approach. We process edges in order and use Union-Find to detect which edge creates a cycle.

### Algorithm Steps

1. Initialize Union-Find with n nodes (1-indexed)
2. For each edge [u, v] in order:
   - If find(u) == find(v): These nodes are already connected, so this edge creates a cycle. Return it.
   - Otherwise: Union the two components
3. If no cycle found, return empty array (shouldn't happen with valid input)

### Why It Works

Union-Find tracks connected components efficiently. When we try to union two nodes that are already in the same component, it means adding this edge would create a cycle. Since we process edges in order, the first edge that would create a cycle (which is also the last in the cycle) is our answer.

### Code Implementation

````carousel
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.rank = [0] * (n + 1)
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        uf = UnionFind(len(edges))
        
        for edge in edges:
            if not uf.union(edge[0], edge[1]):
                return edge
        
        return []
```

<!-- slide -->
```cpp
class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) {
        parent.resize(n + 1);
        rank.resize(n + 1, 0);
        for (int i = 1; i <= n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        x = find(x);
        y = find(y);
        if (x == y) return false;
        if (rank[x] < rank[y]) swap(x, y);
        parent[y] = x;
        if (rank[x] == rank[y]) rank[x]++;
        return true;
    }
};

class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        UnionFind uf(edges.size());
        for (auto& edge : edges) {
            if (!uf.unite(edge[0], edge[1])) {
                return edge;
            }
        }
        return {};
    }
};
```

<!-- slide -->
```java
class UnionFind {
    int[] parent, rank;
    UnionFind(int n) {
        parent = new int[n + 1];
        rank = new int[n + 1];
        for (int i = 1; i <= n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    boolean union(int x, int y) {
        x = find(x);
        y = find(y);
        if (x == y) return false;
        if (rank[x] < rank[y]) {
            int temp = x; x = y; y = temp;
        }
        parent[y] = x;
        if (rank[x] == rank[y]) rank[x]++;
        return true;
    }
}

class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        UnionFind uf = new UnionFind(edges.length);
        for (int[] edge : edges) {
            if (!uf.union(edge[0], edge[1])) {
                return edge;
            }
        }
        return new int[]{};
    }
}
```

<!-- slide -->
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n + 1}, (_, i) => i);
        this.rank = new Array(n + 1).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        x = this.find(x);
        y = this.find(y);
        if (x === y) return false;
        
        if (this.rank[x] < this.rank[y]) {
            [x, y] = [y, x];
        }
        this.parent[y] = x;
        if (this.rank[x] === this.rank[y]) this.rank[x]++;
        return true;
    }
}

var findRedundantConnection = function(edges) {
    const uf = new UnionFind(edges.length);
    for (const edge of edges) {
        if (!uf.union(edge[0], edge[1])) {
            return edge;
        }
    }
    return [];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * α(n)) - nearly O(n), where α is the inverse Ackermann function |
| **Space** | O(n) - for parent and rank arrays |

---

## Approach 2: DFS Cycle Detection

This approach uses depth-first search to detect cycles in the graph.

### Algorithm Steps

1. Build adjacency list from edges
2. Perform DFS from each unvisited node
3. During DFS, track visited nodes and parent
4. If we encounter a visited node (not parent), we found a cycle
5. Track the edge that completes the cycle

### Why It Works

DFS explores all paths from a node. If we reach a node that's already in the current DFS stack (not the immediate parent), we've found a cycle. The edge that led to this visited node is part of the cycle.

### Code Implementation

````carousel
```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        graph = [[] for _ in range(n + 1)]
        
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        visited = [False] * (n + 1)
        parent = [-1] * (n + 1)
        cycle_edge = []
        
        def dfs(node, par):
            nonlocal cycle_edge
            visited[node] = True
            parent[node] = par
            
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    if dfs(neighbor, node):
                        return True
                elif neighbor != par:
                    # Found cycle - find the edge
                    cycle_edge = [node, neighbor]
                    return True
            
            return False
        
        dfs(1, -1)
        
        # Find the last edge that forms the cycle
        for edge in reversed(edges):
            if set(edge) == set(cycle_edge):
                return edge
        
        return []
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        vector<vector<int>> graph(n + 1);
        
        for (auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        vector<int> parent(n + 1, -1);
        vector<bool> visited(n + 1, false);
        vector<int> cycleEdge;
        
        function<bool(int, int)> dfs = [&](int node, int par) -> bool {
            visited[node] = true;
            parent[node] = par;
            
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    if (dfs(neighbor, node)) return true;
                } else if (neighbor != par) {
                    cycleEdge = {node, neighbor};
                    return true;
                }
            }
            return false;
        };
        
        dfs(1, -1);
        
        for (int i = n - 1; i >= 0; i--) {
            if ((edges[i][0] == cycleEdge[0] && edges[i][1] == cycleEdge[1]) ||
                (edges[i][0] == cycleEdge[1] && edges[i][1] == cycleEdge[0])) {
                return edges[i];
            }
        }
        return {};
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        List<Integer>[] graph = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }
        
        for (int[] e : edges) {
            graph[e[0]].add(e[1]);
            graph[e[1]].add(e[0]);
        }
        
        int[] parent = new int[n + 1];
        boolean[] visited = new boolean[n + 1];
        int[] cycleEdge = new int[2];
        
        dfs(1, -1, graph, parent, visited, cycleEdge);
        
        for (int i = n - 1; i >= 0; i--) {
            if ((edges[i][0] == cycleEdge[0] && edges[i][1] == cycleEdge[1]) ||
                (edges[i][0] == cycleEdge[1] && edges[i][1] == cycleEdge[0])) {
                return edges[i];
            }
        }
        return new int[]{};
    }
    
    private boolean dfs(int node, int par, List<Integer>[] graph, 
                        int[] parent, boolean[] visited, int[] cycleEdge) {
        visited[node] = true;
        parent[node] = par;
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                if (dfs(neighbor, node, graph, parent, visited, cycleEdge)) {
                    return true;
                }
            } else if (neighbor != par) {
                cycleEdge[0] = node;
                cycleEdge[1] = neighbor;
                return true;
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
var findRedundantConnection = function(edges) {
    const n = edges.length;
    const graph = Array.from({length: n + 1}, () => []);
    
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Array(n + 1).fill(false);
    const parent = new Array(n + 1).fill(-1);
    let cycleEdge = [];
    
    function dfs(node, par) {
        visited[node] = true;
        parent[node] = par;
        
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                if (dfs(neighbor, node)) return true;
            } else if (neighbor !== par) {
                cycleEdge = [node, neighbor];
                return true;
            }
        }
        return false;
    }
    
    dfs(1, -1);
    
    for (let i = n - 1; i >= 0; i--) {
        if ((edges[i][0] === cycleEdge[0] && edges[i][1] === cycleEdge[1]) ||
            (edges[i][0] === cycleEdge[1] && edges[i][1] === cycleEdge[0])) {
            return edges[i];
        }
    }
    return [];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node and edge visited once |
| **Space** | O(n) - for adjacency list, visited array, recursion stack |

---

## Comparison of Approaches

| Aspect | Union-Find | DFS |
|--------|------------|-----|
| **Time Complexity** | O(n * α(n)) ≈ O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Moderate |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Cycle detection in undirected graphs | General graph traversal |

**Best Approach:** Union-Find is optimal for this problem due to its simplicity and near-linear time complexity.

---

## Why Union-Find is Optimal for This Problem

1. **Natural Cycle Detection**: When find(u) == find(v), we know u and v are already connected
2. **Order Preservation**: Processing edges in order naturally handles "last edge in cycle"
3. **Path Compression**: Makes find operations nearly O(1)
4. **Union by Rank**: Balances tree height for optimal performance
5. **Simplicity**: Straightforward implementation with clear logic

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Redundant Connection II | [Link](https://leetcode.com/problems/redundant-connection-ii/) | Directed graph version with root |
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Check if graph is a valid tree |
| Number of Connected Components | [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Count connected components |
| Critical Connections in a Network | [Link](https://leetcode.com/problems/critical-connections-in-a-network/) | Find bridges in graph |

### Pattern Reference

For more detailed explanations of the Union Find pattern, see:
- **[Union Find Pattern](/patterns/union-find)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Union-Find Approach

- [NeetCode - Redundant Connection](https://www.youtube.com/watch?v=AFbVJOyN9mQ) - Clear explanation with visual examples
- [Back to Back SWE - Redundant Connection](https://www.youtube.com/watch?v=n_t0a_8HlnY) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=v3hQ7F8mRMc) - Official problem solution

### Graph Theory Basics

- [Union Find Data Structure Explained](https://www.youtube.com/watch?v=0jNmHPfA_yE) - Understanding Union-Find
- [Detecting Cycles in Graphs](https://www.youtube.com/watch?v=m7fcA2CGTNE) - Cycle detection techniques

---

## Follow-up Questions

### Q1: Why return the last edge in the cycle?

**Answer:** The problem states that the graph has exactly one extra edge, and edges are given in order. The last edge that creates a cycle is the answer because removing any earlier edge in the cycle would still leave the later edges creating a cycle. By removing the last edge, we break all cycles and get a valid tree.

---

### Q2: Can you solve it using DFS instead of Union-Find?

**Answer:** Yes! You can use DFS to detect cycles. Build an adjacency list, perform DFS from each node, and if you encounter a visited node (not the immediate parent), you've found a cycle. Then find the edge in the cycle that appears last in the input. However, Union-Find is more efficient and cleaner for this problem.

---

### Q3: What is the difference between Redundant Connection and Redundant Connection II?

**Answer:** 
- **Redundant Connection (684)**: Undirected graph with one extra edge
- **Redundant Connection II (685)**: Directed graph that may have a root, more complex

In the directed version, there can be multiple problematic edges, and you need to consider root nodes.

---

### Q4: How would you handle multiple redundant edges?

**Answer:** If there are multiple redundant edges, Union-Find would return the first one found. To find specific edges to remove (not just one), you'd need to track all cycles and find a minimal set of edges to remove to break all cycles. This becomes a more complex graph problem.

---

### Q5: What edge cases should be tested?

**Answer:**
- Linear chain (no cycle): [[1,2], [2,3], [3,4]] - should handle gracefully
- Cycle at the beginning: [[1,2], [2,3], [3,1]]
- Cycle at the end: [[1,2], [2,3], [3,4], [4,1]]
- Multiple possible answers: return the last one
- Self-loops: not in constraints but would be caught

---

### Q6: How does path compression improve performance?

**Answer:** Path compression flattens the tree structure by making each node point directly to the root during find operations. This reduces future find operations from O(tree height) to nearly O(1). Combined with union by rank, the amortized time complexity becomes O(α(n)), where α is the inverse Ackermann function - practically constant.

---

### Q7: Can this problem be solved without extra space?

**Answer:** The Union-Find approach requires O(n) space for parent and rank arrays. For O(1) extra space, you'd need to modify the input (like using negative parent values in-place), which is generally not recommended. The O(n) space is acceptable given the constraints (n <= 1000).

---

## Common Pitfalls

### 1. 1-Based vs 0-Based Indexing
**Issue:** Nodes are labeled from 1 to n, but arrays are 0-indexed.

**Solution:** Initialize Union-Find with n+1 elements and ignore index 0, or subtract 1 from all node values.

### 2. Returning Wrong Edge in Cycle
**Issue:** Returning the first edge in cycle instead of last.

**Solution:** Process edges in order; the first edge that creates a cycle is returned, which is also the last edge in that cycle.

### 3. Not Handling All Components
**Issue:** Graph might have multiple connected components initially.

**Solution:** Union-Find handles this naturally; we start with n separate components and union as we add edges.

### 4. Forgetting to Check Both Directions
**Issue:** In undirected graphs, edges [1,2] and [2,1] are the same.

**Solution:** Union-Find naturally handles this since find(1) == find(2) checks connectivity regardless of direction.

### 5. Not Using Path Compression
**Issue:** Without path compression, performance degrades to O(n²) in worst case.

**Solution:** Always implement find with path compression: `parent[x] = find(parent[x])`

---

## Summary

The **Redundant Connection** problem demonstrates the power of Union-Find data structure for cycle detection in undirected graphs:

- **Union-Find approach**: O(n * α(n)) time, O(n) space - optimal solution
- **DFS approach**: O(n) time, O(n) space - alternative solution

The key insight is that when an edge connects two nodes that are already in the same component, adding this edge creates a cycle. Since edges are given in order, the first such edge (which is also the last in the cycle) is the answer.

This problem is an excellent demonstration of how the Union-Find pattern efficiently solves connectivity problems.

### Pattern Summary

This problem exemplifies the **Union Find** pattern, characterized by:
- Tracking connected components
- Detecting cycles in undirected graphs
- Path compression for near-constant time operations
- Union by rank for balanced tree structures

For more details on this pattern and its variations, see the **[Union Find Pattern](/patterns/union-find)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/redundant-connection/discuss/) - Community solutions
- [Union-Find Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/union-find-algorithm/) - Detailed explanation
- [Cycle Detection in Undirected Graphs](https://www.geeksforgeeks.org/detect-cycle-in-an-undirected-graph/) - Graph theory basics
- [Disjoint Set Data Structure](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) - Wikipedia
