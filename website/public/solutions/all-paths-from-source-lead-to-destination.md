# All Paths From Source Lead To Destination

## LeetCode Link

[All Paths From Source Lead to Destination - LeetCode](https://leetcode.com/problems/all-paths-from-source-lead-to-destination/)

---

## Problem Description

Given a directed acyclic graph (DAG) with `n` nodes labeled from `0` to `n-1`, determine if all paths starting from the `source` node lead to the `destination` node. A path is considered valid if it ends at the destination node and does not contain any cycles.

Return `true` if all paths from the source lead to the destination, otherwise return `false`.

---

## Examples

**Example 1:**

**Input:**
```python
n = 4, edges = [[0,1],[0,2],[0,3]], source = 0, destination = 3
```

**Output:**
```python
True
```

**Explanation:** All paths from node 0 lead to node 3 (0->1->3, 0->2->3, 0->3).

**Example 2:**

**Input:**
```python
n = 3, edges = [[0,1],[0,2]], source = 0, destination = 2
```

**Output:**
```python
True
```

**Example 3:**

**Input:**
```python
n = 4, edges = [[0,1],[0,3],[1,2],[2,1]], source = 0, destination = 3
```

**Output:**
```python
False
```

**Explanation:** There's a cycle (1->2->1), which means not all paths lead to destination.

---

## Constraints

- `1 <= n <= 10^5`
- `0 <= edges.length <= min(n * (n - 1) / 2)`
- `0 <= source, destination < n`
- No repeated edges
- The graph is a DAG

---

## Intuition

The key insight is that we need to verify two things:
1. There are no cycles in any path from source
2. Every valid path ends at the destination

**Key observations:**
1. Use DFS with three-state visited array to detect cycles
2. A node with no outgoing edges MUST be the destination
3. Use memoization to avoid recomputing valid paths from the same node
4. If any path leads to a dead-end (node with no outgoing edges) that's not destination, return false

**Why DFS works:** DFS explores all paths from a node. By tracking the "visiting" state, we can detect cycles. By checking leaf nodes (no outgoing edges), we ensure they reach the destination.

---

## Pattern: Graph - All Paths (Backtracking)

This problem demonstrates the **Backtracking** pattern for finding all paths in a graph with cycle detection.

### Core Concept

- **Three-state visited**: Track not visited, visiting, and visited states
- **Cycle detection**: Detect cycles using visiting state
- **Memoization**: Cache results for already validated nodes
- **Leaf node validation**: Nodes with no neighbors must be destination

### When to Use This Pattern

This pattern is applicable when:
1. Checking if all paths from a source lead to a destination
2. Detecting cycles in directed graphs
3. Validating graph traversal with memoization

### Related Patterns

| Pattern | Description |
|---------|-------------|
| DFS Traversal | Basic depth-first search |
| Cycle Detection | Detecting cycles in graphs |
| Graph Valid Tree | Checking if graph is a tree |

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with Three-State Visited** - Optimal solution
2. **Topological Sort** - Alternative approach

---

## Approach 1: DFS with Three-State Visited (Optimal)

### Algorithm Steps

1. **Build adjacency list**: Convert edges to graph representation
2. **Initialize visited array**: Three states: 0 (unvisited), 1 (visiting), 2 (visited)
3. **DFS traversal**: 
   - If node is visiting → cycle detected → return False
   - If node is visited → return True (already validated)
   - If node has no outgoing edges → must equal destination
4. **Mark as visiting**: Set state to 1 before exploring
5. **Explore neighbors**: Recursively check all neighbors
6. **Mark as visited**: Set state to 2 after successful validation

### Why It Works

The three-state system handles both cycle detection and memoization:
- State 1 (visiting) catches cycles: if we visit a node that's currently in the recursion stack
- State 2 (visited) caches results: we don't need to revalidate paths from this node
- Leaf node check ensures dead-ends only occur at destination

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def leadsToDestination(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        """
        Check if all paths from source lead to destination.
        
        Args:
            n: Number of nodes
            edges: List of directed edges
            source: Starting node
            destination: Target node
            
        Returns:
            True if all paths lead to destination
        """
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
        
        # Three states: 0 = not visited, 1 = visiting, 2 = visited
        visited = [0] * n
        
        def dfs(node: int) -> bool:
            # Cycle detected - node is currently being visited
            if visited[node] == 1:
                return False
            
            # Already validated - return cached result
            if visited[node] == 2:
                return True
            
            # Leaf node - must be destination
            if not graph[node]:
                return node == destination
            
            # Mark as visiting
            visited[node] = 1
            
            # Explore all neighbors
            for neighbor in graph[node]:
                if not dfs(neighbor):
                    return False
            
            # Mark as visited (validated)
            visited[node] = 2
            return True
        
        return dfs(source)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    bool leadsToDestination(int n, vector<vector<int>>& edges, int source, int destination) {
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (auto& edge : edges) {
            graph[edge[0]].push_back(edge[1]);
        }
        
        // Three states: 0 = not visited, 1 = visiting, 2 = visited
        vector<int> visited(n, 0);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            // Cycle detected
            if (visited[node] == 1) return false;
            
            // Already validated
            if (visited[node] == 2) return true;
            
            // Leaf node check
            if (graph[node].empty()) return node == destination;
            
            // Mark as visiting
            visited[node] = 1;
            
            // Explore neighbors
            for (int neighbor : graph[node]) {
                if (!dfs(neighbor)) return false;
            }
            
            // Mark as visited
            visited[node] = 2;
            return true;
        };
        
        return dfs(source);
    }
};
```

<!-- slide -->
```java
class Solution {
    private int[] visited;  // 0 = unvisited, 1 = visiting, 2 = visited
    private List<List<Integer>> graph;
    
    private boolean dfs(int node) {
        // Cycle detected
        if (visited[node] == 1) return false;
        
        // Already validated
        if (visited[node] == 2) return true;
        
        // Leaf node must be destination
        if (graph.get(node).isEmpty()) {
            return node == 0;  // destination
        }
        
        // Mark as visiting
        visited[node] = 1;
        
        // Explore neighbors
        for (int neighbor : graph.get(node)) {
            if (!dfs(neighbor)) return false;
        }
        
        // Mark as visited
        visited[node] = 2;
        return true;
    }
    
    public boolean leadsToDestination(int n, int[][] edges, int source, int destination) {
        // Build adjacency list
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
        }
        
        visited = new int[n];
        return dfs(source) && source == destination;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} source
 * @param {number} destination
 * @return {boolean}
 */
var leadsToDestination = function(n, edges, source, destination) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
    }
    
    // Three states: 0 = unvisited, 1 = visiting, 2 = visited
    const visited = new Array(n).fill(0);
    
    function dfs(node) {
        // Cycle detected
        if (visited[node] === 1) return false;
        
        // Already validated
        if (visited[node] === 2) return true;
        
        // Leaf node must be destination
        if (graph[node].length === 0) {
            return node === destination;
        }
        
        // Mark as visiting
        visited[node] = 1;
        
        // Explore neighbors
        for (const neighbor of graph[node]) {
            if (!dfs(neighbor)) return false;
        }
        
        // Mark as visited
        visited[node] = 2;
        return true;
    }
    
    return dfs(source);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N + E) - each node and edge visited at most once |
| **Space** | O(N + E) - graph + visited array + recursion stack |

---

## Approach 2: Topological Sort

### Algorithm Steps

1. **Build graph and in-degree**: Create adjacency list and track in-degrees
2. **Find source candidates**: Nodes with in-degree 0 (excluding source)
3. **Run Kahn's algorithm**: Process nodes in topological order
4. **Check for cycles**: If not all nodes processed → cycle exists
5. **Verify destination**: Ensure destination is never processed as dead-end

### Why It Works

In a valid DAG where all paths lead to destination:
- Topological sort should process all nodes
- Destination should be a sink (no outgoing edges)
- Any cycle would prevent all paths from reaching destination

### Code Implementation

````carousel
```python
from typing import List
from collections import deque, defaultdict

class Solution:
    def leadsToDestination(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        # Build graph and in-degree
        graph = defaultdict(list)
        in_degree = [0] * n
        
        for u, v in edges:
            graph[u].append(v)
            in_degree[v] += 1
        
        # Destination must not have outgoing edges
        if graph[destination]:
            return False
        
        # Topological sort using BFS
        queue = deque([source])
        processed = 0
        
        while queue:
            node = queue.popleft()
            processed += 1
            
            # If node has no outgoing edges and is not destination
            if not graph[node] and node != destination:
                return False
            
            for neighbor in graph[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        # If not all nodes processed, there's a cycle
        return processed == n
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool leadsToDestination(int n, vector<vector<int>>& edges, int source, int destination) {
        vector<vector<int>> graph(n);
        vector<int> inDegree(n, 0);
        
        for (auto& edge : edges) {
            graph[edge[0]].push_back(edge[1]);
            inDegree[edge[1]]++;
        }
        
        // Destination must be sink
        if (!graph[destination].empty()) return false;
        
        queue<int> q;
        q.push(source);
        int processed = 0;
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            processed++;
            
            if (graph[node].empty() && node != destination) return false;
            
            for (int neighbor : graph[node]) {
                if (--inDegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        return processed == n;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean leadsToDestination(int n, int[][] edges, int source, int destination) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[n];
        
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
            inDegree[edge[1]]++;
        }
        
        if (!graph.get(destination).isEmpty()) return false;
        
        Queue<Integer> q = new LinkedList<>();
        q.add(source);
        int processed = 0;
        
        while (!q.isEmpty()) {
            int node = q.poll();
            processed++;
            
            if (graph.get(node).isEmpty() && node != destination) return false;
            
            for (int neighbor : graph.get(node)) {
                if (--inDegree[neighbor] == 0) {
                    q.add(neighbor);
                }
            }
        }
        
        return processed == n;
    }
}
```

<!-- slide -->
```javascript
var leadsToDestination = function(n, edges, source, destination) {
    const graph = Array.from({ length: n }, () => []);
    const inDegree = new Array(n).fill(0);
    
    for (const [u, v] of edges) {
        graph[u].push(v);
        inDegree[v]++;
    }
    
    if (graph[destination].length > 0) return false;
    
    const q = [source];
    let processed = 0;
    
    while (q.length > 0) {
        const node = q.shift();
        processed++;
        
        if (graph[node].length === 0 && node !== destination) return false;
        
        for (const neighbor of graph[node]) {
            if (--inDegree[neighbor] === 0) {
                q.push(neighbor);
            }
        }
    }
    
    return processed === n;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N + E) - topological sort |
| **Space** | O(N + E) - graph and structures |

---

## Comparison of Approaches

| Aspect | DFS + States | Topological Sort |
|--------|--------------|------------------|
| **Time Complexity** | O(N + E) | O(N + E) |
| **Space Complexity** | O(N + E) | O(N + E) |
| **Implementation** | More intuitive | More complex |
| **Cycle Detection** | Direct | Implicit |

**Best Approach:** Use Approach 1 (DFS with three-state) for clarity and direct cycle detection.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Facebook, Microsoft
- **Difficulty**: Medium-Hard
- **Concepts Tested**: Graph traversal, Cycle detection, DFS, Memoization

### Learning Outcomes

1. **Three-state visited**: Master cycle detection with states
2. **Memoization**: Learn to cache results for optimization
3. **Graph validation**: Understand DAG properties

---

## Related Problems

Based on similar themes (graph traversal, cycle detection):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Cycle detection in DAG |
| Find Eventual Safe States | [Link](https://leetcode.com/problems/find-eventual-safe-states/) | Find safe nodes |
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Detect cycle in tree |
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Check if graph is tree |

### Pattern Reference

For more detailed explanations, see:
- **[Graph DFS Pattern](/patterns/graph-dfs)**
- **[Cycle Detection](/patterns/detect-cycle)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

### Recommended Tutorials

1. **[All Paths Lead to Destination - LeetCode 1059](https://www.youtube.com/watch?v=V2GazH4q6ZU)** - Detailed explanation
2. **[Cycle Detection in Directed Graphs](https://www.youtube.com/watch?v=0LjV5iV-5qw)** - Understanding cycle detection
3. **[DFS Graph Traversal](https://www.youtube.com/watch?v=PyY9tRIy6Bk)** - DFS fundamentals

---

## Follow-up Questions

### Q1: How would you return all valid paths?

**Answer:** Modify DFS to collect paths instead of boolean. Store path at each step and backtrack.

### Q2: How would you handle undirected graphs?

**Answer:** Need to track parent to avoid immediate back-edge. Use visited set instead of three-state.

### Q3: What if the graph is not a DAG?

**Answer:** The cycle detection already handles this. Any cycle causes return False.

### Q4: How would you optimize for very deep graphs?

**Answer:** Use iterative DFS with explicit stack to avoid recursion depth issues.

---

## Common Pitfalls

### 1. Not Detecting Cycles
**Issue:** Not properly handling the visiting state.

**Solution:** Use three states: 0 (unvisited), 1 (visiting), 2 (visited). Return False if visiting again.

### 2. Not Handling Dead Ends
**Issue:** Nodes with no outgoing edges that aren't destination.

**Solution:** Check if node has no neighbors: return node == destination.

### 3. Wrong Base Case
**Issue:** Not checking if source equals destination initially.

**Solution:** The DFS handles this naturally - if source has no outgoing edges, it must equal destination.

### 4. Not Memoizing Results
**Issue:** Recomputing valid paths for same node.

**Solution:** Mark node as visited (state 2) after processing to cache results.

---

## Summary

The **All Paths From Source Lead To Destination** problem demonstrates the **DFS with cycle detection** pattern:

- **Three-state visited**: Track not visited, visiting, and visited states
- **Cycle detection**: Detect cycles using visiting state
- **Memoization**: Cache results for already validated nodes
- **Time complexity**: O(N + E) - optimal graph traversal

Key insights:
1. Use three-state visited array to detect cycles during DFS
2. If node is currently being visited (visiting), there's a cycle
3. If node has no outgoing edges, it must be the destination
4. Memoize results to avoid recomputation

This pattern extends to:
- Graph cycle detection
- Path validation problems
- Dependency resolution
