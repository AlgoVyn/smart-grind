## Title: LCA - Lowest Common Ancestor

What is the Lowest Common Ancestor (LCA) problem and how is it solved?

<!-- front -->

---

### Definition
The LCA of two nodes u and v in a tree is the deepest node that is an ancestor of both u and v. A node is considered an ancestor of itself.

### Applications
- Finding distance between nodes: dist(u,v) = depth[u] + depth[v] - 2*depth[lca]
- Tree path queries
- RMQ (Range Minimum Query) reductions
- Network routing

### Approaches
| Method | Preprocess | Query | Space |
|--------|-----------|-------|-------|
| Brute force | O(1) | O(n) | O(1) |
| Binary Lifting | O(n log n) | O(log n) | O(n log n) |
| Euler Tour + RMQ | O(n) | O(1) | O(n) |
| Tarjan's (offline) | O(n α(n)) | O(α(n)) | O(n) |

---

### Binary Lifting Method
```python
def preprocess_lca(n, adj, root=0):
    LOG = 20  # for n <= 10^6
    up = [[-1] * LOG for _ in range(n)]  # up[v][j] = 2^j-th ancestor
    depth = [0] * n
    
    def dfs(v, p):
        up[v][0] = p
        for j in range(1, LOG):
            if up[v][j-1] != -1:
                up[v][j] = up[up[v][j-1]][j-1]
        for u in adj[v]:
            if u != p:
                depth[u] = depth[v] + 1
                dfs(u, v)
    
    dfs(root, -1)
    return up, depth

def lca(u, v, up, depth):
    if depth[u] < depth[v]:
        u, v = v, u
    
    # Lift u up to depth of v
    LOG = len(up[0])
    for j in range(LOG-1, -1, -1):
        if depth[u] - (1 << j) >= depth[v]:
            u = up[u][j]
    
    if u == v:
        return u
    
    # Lift both together
    for j in range(LOG-1, -1, -1):
        if up[u][j] != up[v][j]:
            u = up[u][j]
            v = up[v][j]
    
    return up[u][0]
```

---

### Complexity
| Operation | Time | Space |
|-----------|------|-------|
| Preprocessing | O(n log n) | O(n log n) |
| Each LCA query | O(log n) | O(1) |

<!-- back -->
