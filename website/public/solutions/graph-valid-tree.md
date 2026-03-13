# Graph Valid Tree

## Problem Description

Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if the edges form a valid tree.

A tree is a connected graph with no cycles and has exactly n-1 edges.

## Examples

**Example 1:**

- **Input:** `n = 5`, `edges = [[0,1],[0,2],[0,3],[1,4]]`
- **Output:** `true`

**Explanation:** The graph is connected and has no cycles.

**Example 2:**

- **Input:** `n = 5`, `edges = [[0,1],[1,2],[2,3],[1,3]]`
- **Output:** `false`

**Explanation:** There is a cycle in the graph.

## Constraints

- `1 <= n <= 10^4`
- `0 <= edges.length <= 10^4`
- `edges[i].length == 2`
- `0 <= ui, vi < n`
- No self-loops or multiple edges

---


## Pattern:

This problem follows the **Graph - Cycle Detection + Connectivity** pattern.

### Core Concept

- **Cycle Detection**: Graph with cycle is not a tree
- **Connected**: All nodes must be connected
- **Union-Find**: Or use DFS to check both conditions

### When to Use This Pattern

This pattern is applicable when:
1. Valid tree checking
2. Graph connectivity
3. Cycle detection in undirected graph

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Union-Find | Data structure |
| DFS | Traversal |

---


## Intuition

A valid tree must satisfy two conditions:

1. **Connected**: All nodes must be reachable from any other node
2. **Acyclic**: There must be no cycles in the graph
3. **Edge Count**: A tree with n nodes must have exactly n-1 edges

If we have n nodes and n-1 edges with no cycles, the graph is automatically connected.

Key observations:
- If edges ≠ n-1 → Not a tree (either disconnected or has cycles)
- If we can detect a cycle during union → Not a tree
- If all unions succeed and we have n-1 edges → It's a tree

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Union-Find (Disjoint Set Union)** - Optimal O(n) time
2. **DFS Cycle Detection** - O(n) time with recursion
3. **BFS Cycle Detection** - O(n) time using queue

---

## Approach 1: Union-Find with Path Compression (Optimal)

This is the most efficient approach using Union-Find to detect cycles.

### Algorithm Steps

1. Check if edge count equals n-1 (necessary condition)
2. Initialize each node as its own parent
3. For each edge (u, v):
   - Find the root of u and v
   - If roots are same → cycle detected → return false
   - Otherwise, union them
4. If all edges processed without cycle → return true

### Why It Works

Union-Find efficiently tracks connected components. If we try to union two nodes already in the same component, a cycle exists. Path compression and union by rank optimize the operations.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        """
        Determine if the given edges form a valid tree using Union-Find.
        
        Args:
            n: Number of nodes (0 to n-1)
            edges: List of undirected edges
            
        Returns:
            True if edges form a valid tree, False otherwise
        """
        # A tree with n nodes must have exactly n-1 edges
        if len(edges) != n - 1:
            return False
        
        # Union-Find with path compression
        parent = list(range(n))
        
        def find(x: int) -> int:
            """Find root with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x: int, y: int) -> bool:
            """
            Union two sets. Returns False if they're already connected (cycle).
            """
            px, py = find(x), find(y)
            if px == py:
                return False  # Cycle detected
            parent[px] = py
            return True
        
        # Process all edges
        for u, v in edges:
            if not union(u, v):
                return False  # Cycle detected
        
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        // A tree with n nodes must have exactly n-1 edges
        if (edges.size() != n - 1) return false;
        
        // Union-Find with path compression
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        
        function<int(int)> find = [&](int x) -> int {
            if (parent[x] != x)
                parent[x] = find(parent[x]);
            return parent[x];
        };
        
        auto unite = [&](int x, int y) -> bool {
            int px = find(x), py = find(y);
            if (px == py) return false;
            parent[px] = py;
            return true;
        };
        
        for (const auto& edge : edges) {
            if (!unite(edge[0], edge[1]))
                return false;
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int[] parent;
    
    public boolean validTree(int n, int[][] edges) {
        // A tree with n nodes must have exactly n-1 edges
        if (edges.length != n - 1) return false;
        
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        
        for (int[] edge : edges) {
            if (!union(edge[0], edge[1]))
                return false;
        }
        
        return true;
    }
    
    private int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    private boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        parent[px] = py;
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var validTree = function(n, edges) {
    // A tree with n nodes must have exactly n-1 edges
    if (edges.length !== n - 1) return false;
    
    const parent = Array.from({ length: n }, (_, i) => i);
    
    const find = (x) => {
        if (parent[x] !== x)
            parent[x] = find(parent[x]);
        return parent[x];
    };
    
    const union = (x, y) => {
        const px = find(x), py = find(y);
        if (px === py) return false;
        parent[px] = py;
        return true;
    };
    
    for (const [u, v] of edges) {
        if (!union(u, v)) return false;
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × α(n)) ≈ O(n) - α is inverse Ackermann, practically constant |
| **Space** | O(n) - Parent array |

---

## Approach 2: DFS Cycle Detection

Use DFS to detect cycles while building the graph.

### Algorithm Steps

1. Check if edge count equals n-1
2. Build adjacency list
3. Use DFS from node 0, tracking visited nodes
4. If we encounter a visited node that's not the parent → cycle
5. After DFS, check if all nodes were visited (connected)

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def validTree_dfs(self, n: int, edges: List[List[int]]) -> bool:
        """DFS approach to detect cycles."""
        if len(edges) != n - 1:
            return False
        
        # Build adjacency list
        graph = defaultdict(list)
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        visited = set()
        
        def dfs(node: int, parent: int) -> bool:
            """Returns False if cycle is detected."""
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor == parent:
                    continue
                if neighbor in visited:
                    return False  # Cycle detected
                if not dfs(neighbor, node):
                    return False
            return True
        
        # Start DFS from node 0
        if not dfs(0, -1):
            return False
        
        # Check if all nodes are connected
        return len(visited) == n
```

<!-- slide -->
```cpp
class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if (edges.size() != n - 1) return false;
        
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (const auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        vector<bool> visited(n, false);
        
        function<bool(int, int)> dfs = [&](int node, int parent) -> bool {
            visited[node] = true;
            for (int neighbor : graph[node]) {
                if (neighbor == parent) continue;
                if (visited[neighbor]) return false;
                if (!dfs(neighbor, node)) return false;
            }
            return true;
        };
        
        if (!dfs(0, -1)) return false;
        
        // Check connectivity
        for (bool v : visited)
            if (!v) return false;
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    private List<List<Integer>> graph;
    private boolean[] visited;
    
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        
        visited = new boolean[n];
        
        if (!dfs(0, -1)) return false;
        
        // Check connectivity
        for (boolean v : visited)
            if (!v) return false;
        
        return true;
    }
    
    private boolean dfs(int node, int parent) {
        visited[node] = true;
        for (int neighbor : graph.get(node)) {
            if (neighbor == parent) continue;
            if (visited[neighbor]) return false;
            if (!dfs(neighbor, node)) return false;
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var validTree = function(n, edges) {
    if (edges.length !== n - 1) return false;
    
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Set();
    
    const dfs = (node, parent) => {
        visited.add(node);
        for (const neighbor of graph[node]) {
            if (neighbor === parent) continue;
            if (visited.has(neighbor)) return false;
            if (!dfs(neighbor, node)) return false;
        }
        return true;
    };
    
    if (!dfs(0, -1)) return false;
    
    return visited.size === n;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node and edge visited once |
| **Space** | O(n) - Adjacency list and visited set |

---

## Approach 3: BFS Cycle Detection

Use BFS with a queue to detect cycles and check connectivity.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def validTree_bfs(self, n: int, edges: List[List[int]]) -> bool:
        """BFS approach to detect cycles."""
        if len(edges) != n - 1:
            return False
        
        # Build adjacency list
        graph = defaultdict(list)
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        visited = set()
        queue = deque([0])
        visited.add(0)
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor in visited:
                    if neighbor != node:  # Skip self-loop check
                        continue
                if neighbor in visited:
                    return False  # Cycle detected
                visited.add(neighbor)
                queue.append(neighbor)
        
        return len(visited) == n
```

<!-- slide -->
```cpp
class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if (edges.size() != n - 1) return false;
        
        vector<vector<int>> graph(n);
        for (const auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        vector<bool> visited(n, false);
        queue<int> q;
        q.push(0);
        visited[0] = true;
        
        while (!q.empty()) {
            int node = q.front(); q.pop();
            for (int neighbor : graph[node]) {
                if (visited[neighbor]) continue;
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
        
        // Check connectivity - all nodes should be visited
        for (bool v : visited)
            if (!v) return false;
        
        // Edge count check ensures no cycle
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();
        q.offer(0);
        visited[0] = true;
        
        while (!q.isEmpty()) {
            int node = q.poll();
            for (int neighbor : graph.get(node)) {
                if (visited[neighbor]) continue;
                visited[neighbor] = true;
                q.offer(neighbor);
            }
        }
        
        for (boolean v : visited)
            if (!v) return false;
        
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var validTree = function(n, edges) {
    if (edges.length !== n - 1) return false;
    
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Set();
    const queue = [0];
    visited.add(0);
    
    while (queue.length) {
        const node = queue.shift();
        for (const neighbor of graph[node]) {
            if (visited.has(neighbor)) continue;
            visited.add(neighbor);
            queue.push(neighbor);
        }
    }
    
    return visited.size === n;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node and edge visited once |
| **Space** | O(n) - Adjacency list and queue |

---

## Comparison of Approaches

| Aspect | Union-Find | DFS | BFS |
|--------|------------|-----|-----|
| **Time Complexity** | O(n × α(n)) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(n) |
| **Implementation** | Moderate | Simple | Simple |
| **Detects Cycle** | Yes (during union) | Yes (during traversal) | Indirectly |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |

**Best Approach:** Union-Find is optimal for this problem due to its elegant cycle detection during union operations.

---

## Related Problems

Based on similar themes (graph validation, Union-Find, cycle detection):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Using DFS/BFS for connected components |
| Find the Town Judge | [Link](https://leetcode.com/problems/find-the-town-judge/) | Graph connectivity problem |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Union-Find for cycle detection |
| Clone Graph | [Link](https://leetcode.com/problems/clone-graph/) | Graph traversal |
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Cycle detection in directed graph |
| Accounts Merge | [Link](https://leetcode.com/problems/accounts-merge/) | Union-Find application |

### Pattern Reference

For more detailed explanations of Union-Find and graph algorithms, see:
- **[Union-Find Pattern](/patterns/union-find)**
- **[Graph Traversal - DFS](/patterns/graph-dfs)**
- **[Graph Traversal - BFS](/patterns/graph-bfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### NeetCode Solutions

- [Graph Valid Tree - NeetCode](https://www.youtube.com/watch?v=0nT7T6PPEuo) - Clear explanation with visual examples
- [Union-Find Solution](https://www.youtube.com/watch?v=LFU58I4GrQw) - Detailed walkthrough

### Other Tutorials

- [Back to Back SWE - Graph Valid Tree](https://www.youtube.com/watch?v=IV9K4d96y90) - Comprehensive explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=Y1lC3k9py18) - Official problem solution
- [DFS Approach Explanation](https://www.youtube.com/watch?v=9X1J7g0bZvw) - DFS cycle detection

---

## Follow-up Questions

### Q1: How would you modify the solution to handle directed edges?

**Answer:** For directed graphs, you'd need to use topological sort or DFS with three states (unvisited, visiting, visited) to detect cycles. The simple edge count check wouldn't apply since directed trees have different properties.

---

### Q2: What if the input graph could have multiple connected components?

**Answer:** The edge count check (n-1) already catches disconnected graphs since disconnected graphs would require fewer edges to not have cycles. Alternatively, after processing all edges, check that all nodes have the same root in Union-Find.

---

### Q3: How would you find which edge(s) cause the graph to not be a tree?

**Answer:** With Union-Find, the edge that first causes a cycle detection is the problematic edge. Store it when the union operation returns false. For disconnected graphs, run find on all nodes - nodes with different roots indicate which components are disconnected.

---

### Q4: How would you handle the case with isolated nodes (no edges)?

**Answer:** An empty edge list forms a tree only when n=1. For n>1 with empty edges, return false because the graph is disconnected. The edge count check handles this: 0 != n-1 when n>1.

---

### Q5: Can you solve it without the edge count check (n-1)?

**Answer:** Yes! After processing all edges:
- If cycle detected → return false
- If after Union-Find, all nodes don't have the same parent → disconnected → return false
- Otherwise → return true

The edge count check is an optimization but not required.

---

### Q6: How would you modify the solution to find the minimum edges to make it a tree?

**Answer:** 
1. Use Union-Find to find connected components
2. Count distinct components (k)
3. Answer is k-1 edges needed to connect them (minimum spanning tree approach)

---

### Q7: What data structure optimizations can improve Union-Find?

**Answer:**
- **Path Compression**: Make every node point directly to root
- **Union by Rank**: Always attach smaller tree under larger tree
- Both make operations practically O(1) amortized

---

### Q8: How would you handle very large n (e.g., 10^9) with sparse edges?

**Answer:** Union-Find works well since we only store parent for nodes that appear in edges. However, adjacency list approaches would need modification. Use hash maps instead of arrays for parent storage.

---

## Common Pitfalls

### 1. Not Checking Edge Count First
**Issue**: Skipping the n-1 edge check can lead to false positives.

**Solution**: Always check `len(edges) != n - 1` first - a tree must have exactly n-1 edges.

### 2. Missing Connectivity Check
**Issue**: Only checking for cycles, not connectivity.

**Solution**: After Union-Find, ensure all nodes have the same root (or visited all n nodes).

### 3. Not Handling Empty Graph
**Issue**: Forgetting that n=1 with no edges is a valid tree.

**Solution**: Edge case: `n=1` with `len(edges)=0` should return True.

### 4. Path Compression Errors
**Issue**: Incorrectly implementing find with path compression.

**Solution**: Use `parent[x] = find(parent[x])` for proper compression.

### 5. Union by Rank Mistakes
**Issue**: Not using union by rank, leading to performance issues.

**Solution**: Track tree depth and always attach smaller tree under larger one.

---

## Summary

The **Graph Valid Tree** problem demonstrates powerful graph algorithms:

- **Union-Find approach**: Optimal O(n) with cycle detection during union
- **DFS approach**: Intuitive traversal with cycle detection
- **BFS approach**: Level-order traversal for connectivity check

Key insights:
1. A valid tree must have exactly n-1 edges
2. Cycle detection ensures acyclic property
3. Connectivity check ensures all nodes are reachable

This problem is excellent for understanding Union-Find, graph traversal, and cycle detection in undirected graphs.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/graph-valid-tree/discuss/) - Community solutions
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/union-find/) - Detailed explanation
- [Cycle Detection in Graphs](/patterns/detect-cycle) - Comprehensive guide
