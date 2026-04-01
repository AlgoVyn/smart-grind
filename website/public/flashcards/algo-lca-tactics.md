## Title: LCA Tactics

What are the key implementation tactics for LCA?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| Iterative DFS | Avoid recursion limit |
| 0-indexed nodes | Consistent with code |
| Precompute LOG | Constant factor |
| Sparse table for RMQ | O(1) queries after O(n log n) |

### Euler Tour + RMQ
```python
def euler_tour_lca(n, adj, root=0):
    tour = []
    first = [-1] * n
    depth = [0] * n
    
    def dfs(v, p):
        first[v] = len(tour)
        tour.append(v)
        for u in adj[v]:
            if u != p:
                depth[u] = depth[v] + 1
                dfs(u, v)
                tour.append(v)
    
    dfs(root, -1)
    
    # Build sparse table for RMQ on depth[tour[i]]
    # Query: min depth in range [first[u], first[v]]
    return tour, first, depth
```

---

### Tarjan's Offline Algorithm
```python
def tarjan_lca(n, adj, queries, root=0):
    """O(n + q) with union-find"""
    dsu = DSU(n)
    ancestor = [0] * n
    visited = [False] * n
    answer = {}
    
    def dfs(v):
        ancestor[dsu.find(v)] = v
        for u in adj[v]:
            if not visited[u]:
                dfs(u)
                dsu.union(v, u)
                ancestor[dsu.find(v)] = v
        visited[v] = True
        for u in queries[v]:  # All queries (v, u)
            if visited[u]:
                answer[(v, u)] = ancestor[dsu.find(u)]
    
    dfs(root)
    return answer
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| Wrong root | Wrong depths | Always use same root |
| 1-indexed confusion | Off by one | Be consistent |
| Recursion limit | Stack overflow | Set limit or use iterative |
| Up table -1 handling | Invalid access | Check up[v][j-1] != -1 |
| Query order | Wrong LCA | Ensure proper depth comparison |

<!-- back -->
