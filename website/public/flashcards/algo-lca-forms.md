## Title: LCA Forms

What are the different forms and variations of LCA problems?

<!-- front -->

---

### LCA Variants

| Variant | Description | Approach |
|---------|-------------|----------|
| Standard LCA | Deepest common ancestor | Binary lifting |
| Weighted LCA | With edge weights | Store weights in up table |
| K-th ancestor | Node k steps above | Binary lifting (decompose k) |
| LCA with RMQ | Using segment tree | Euler tour + sparse table |
| Offline LCA | All queries known | Tarjan's union-find |
| Dynamic LCA | Tree changes | Link-cut trees |

### K-th Ancestor
```python
def kth_ancestor(v, k, up):
    """Jump k steps up from v"""
    LOG = len(up[0])
    for j in range(LOG):
        if k & (1 << j):
            v = up[v][j]
            if v == -1:
                break
    return v
```

---

### Max Edge Query
```python
def preprocess_max_edge(n, adj, root):
    LOG = 20
    up = [[-1] * LOG for _ in range(n)]
    max_edge = [[0] * LOG for _ in range(n)]
    depth = [0] * n
    
    def dfs(v, p):
        for u, w in adj[v]:  # (neighbor, weight)
            if u != p:
                depth[u] = depth[v] + 1
                up[u][0] = v
                max_edge[u][0] = w
                for j in range(1, LOG):
                    up[u][j] = up[up[u][j-1]][j-1]
                    max_edge[u][j] = max(max_edge[u][j-1], 
                                         max_edge[up[u][j-1]][j-1])
                dfs(u, v)
    
    dfs(root, -1)
    return up, max_edge, depth
```

---

### Distance Between Nodes
```python
def distance(u, v, up, depth, max_edge=None):
    l = lca(u, v, up, depth)
    if max_edge:
        return query_max_on_path(u, v)  # Implement with lifting
    return depth[u] + depth[v] - 2 * depth[l]
```

<!-- back -->
