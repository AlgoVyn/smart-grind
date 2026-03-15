## Binary Lifting - Kth Ancestor

**Question:** How does binary lifting achieve O(log n) query time?

<!-- front -->

---

## Binary Lifting

### The Idea
Precompute 2^j ancestors for each node. Any number can be represented in binary!

### Building Table
```python
def build_ancestors(root, parent):
    LOG = 17  # For n up to 10^5
    up = [[-1] * (n + 1) for _ in range(LOG)]
    
    # up[0][v] = immediate parent
    for v in parent:
        up[0][v] = parent[v]
    
    # Build table
    for j in range(1, LOG):
        for v in range(1, n + 1):
            if up[j-1][v] != -1:
                up[j][v] = up[j-1][up[j-1][v]]
    
    return up
```

### Finding Kth Ancestor
```python
def kth_ancestor(v, k, up):
    for j in range(LOG):
        if k & (1 << j):
            v = up[j][v]
            if v == -1:
                break
    return v
```

### Example
```
Find 13th ancestor of node 20:
13 = 1101 in binary = 8 + 4 + 1

Jump 8: up[3][20] = ancestor 8 steps up
Jump 4: up[2][...] = ancestor 4 steps up  
Jump 1: up[0][...] = ancestor 1 step up
```

### LCA Using Binary Lifting
```python
def lca(u, v, up, depth):
    # Lift u and v to same depth
    if depth[u] < depth[v]:
        u, v = v, u
    
    diff = depth[u] - depth[v]
    for j in range(LOG):
        if diff & (1 << j):
            u = up[j][u]
    
    if u == v:
        return u
    
    # Lift both up
    for j in range(LOG-1, -1, -1):
        if up[j][u] != up[j][v]:
            u = up[j][u]
            v = up[j][v]
    
    return up[0][u]
```

### Complexity
- Preprocess: O(n log n)
- Query: O(log n)

<!-- back -->
