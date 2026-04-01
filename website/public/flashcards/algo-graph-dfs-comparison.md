## Graph DFS: Comparison with Alternatives

How does DFS compare to BFS and other graph algorithms?

<!-- front -->

---

### DFS vs BFS Comparison

| Use Case | DFS | BFS |
|----------|-----|-----|
| **Shortest path (unweighted)** | ✗ No | ✓ Yes |
| **Memory usage** | O(h) - stack | O(w) - queue |
| **Topological sort** | ✓ Natural | Kahn's algo |
| **Cycle detection** | ✓ Back edges | Also works |
| **Level-order** | Inefficient | ✓ Natural |
| **Deep solutions** | ✓ Finds fast | Explores all |
| **Complete solutions** | Good | Memory heavy |

```python
# Memory comparison
def dfs_memory(graph, start):
    # Stack depth = height of tree/h longest path
    # Worst case: O(V) for linear chain
    pass

def bfs_memory(graph, start):
    # Queue size = width of frontier
    # Can be O(V) for dense level
    pass
```

---

### When to Use DFS vs BFS

| Problem Type | Preferred | Why |
|--------------|-----------|-----|
| **Topological sort** | DFS post-order | Natural handling |
| **SCC (Kosaraju)** | DFS | Finishing times |
| **Cycle detection** | Either | DFS colors elegant |
| **Shortest path** | BFS | Correctness guarantee |
| **Bipartite check** | Either | Same complexity |
| **Web crawling** | BFS | Breadth important |
| **Maze solving** | DFS | Any path suffices |
| **Game tree** | DFS with pruning | Depth matters |

---

### DFS vs Union-Find for Connectivity

| Aspect | DFS/BFS | Union-Find |
|--------|---------|------------|
| **Dynamic connectivity** | Recompute | ✓ Handles online |
| **Static connectivity** | O(V+E) | O(α(V)) per op |
| **Memory** | O(V) | O(V) |
| **Counting components** | One traversal | After all unions |

```python
# DFS for static connectivity
def count_components_dfs(graph):
    visited = [False] * len(graph)
    count = 0
    
    for i in range(len(graph)):
        if not visited[i]:
            dfs(graph, i, visited)
            count += 1
    
    return count

# Union-Find for dynamic connectivity
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        self.parent[self.find(x)] = self.find(y)
```

---

### DFS vs Dynamic Programming on DAGs

| Approach | Time | Space | Use When |
|----------|------|-------|----------|
| **DFS + Memo** | O(V+E) | O(V) | Tree/DAG, recursive natural |
| **Topological + DP** | O(V+E) | O(V) | DAG, need specific order |
| **Bottom-up DP** | O(V+E) | O(V) | Known structure |

```python
# DFS with memoization
def dfs_memo(graph, node, memo):
    if node in memo:
        return memo[node]
    
    result = 1  # Base
    for neighbor in graph[node]:
        result += dfs_memo(graph, neighbor, memo)
    
    memo[node] = result
    return result

# Topological sort + DP
def topo_dp(graph):
    topo_order = topological_sort(graph)
    dp = [0] * len(graph)
    
    for node in topo_order:
        dp[node] = 1  # Base
        for neighbor in graph[node]:
            dp[neighbor] = max(dp[neighbor], dp[node] + 1)
    
    return dp
```

**Rule:** DFS + memo for path-based problems, topological for global optimization.

<!-- back -->
