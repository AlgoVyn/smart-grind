## Binary Lifting: Algorithm Framework

What is the complete binary lifting implementation, and how do you handle LCA and k-th ancestor queries?

<!-- front -->

---

### Preprocessing Template

```python
def preprocess_lifting(tree, root, n):
    """
    tree: adjacency list (undirected)
    Returns: up table, depth array
    """
    LOG = (n).bit_length()  # ⌈log₂(n)⌉
    
    up = [[-1] * LOG for _ in range(n)]
    depth = [0] * n
    
    # DFS to fill up[v][0] (direct parent) and depths
    stack = [(root, -1)]
    while stack:
        v, p = stack.pop()
        up[v][0] = p
        
        for u in tree[v]:
            if u != p:
                depth[u] = depth[v] + 1
                stack.append((u, v))
    
    # Fill jump table
    for j in range(1, LOG):
        for v in range(n):
            if up[v][j-1] != -1:
                up[v][j] = up[up[v][j-1]][j-1]
    
    return up, depth, LOG
```

---

### K-th Ancestor Query

```python
def kth_ancestor(v, k, up, LOG):
    """
    Find k-th ancestor of node v
    k: number of steps up (k >= 0)
    Returns: node index or -1 if beyond root
    """
    for i in range(LOG):
        if k & (1 << i):  # If i-th bit of k is set
            v = up[v][i]
            if v == -1:
                return -1
    return v
```

**Key insight:** Decompose k into powers of 2, jump each power.

---

### LCA Query

```python
def lca(u, v, up, depth, LOG):
    """Find lowest common ancestor of u and v"""
    # Ensure u is deeper
    if depth[u] < depth[v]:
        u, v = v, u
    
    # Lift u up to same depth as v
    diff = depth[u] - depth[v]
    u = kth_ancestor(u, diff, up, LOG)
    
    if u == v:
        return u
    
    # Lift both together
    for i in range(LOG - 1, -1, -1):
        if up[u][i] != up[v][i]:
            u = up[u][i]
            v = up[v][i]
    
    # Now u and v are children of LCA
    return up[u][0]
```

---

### Tree Distance Query

```python
def tree_distance(u, v, up, depth, LOG):
    """Distance in edges between u and v"""
    ancestor = lca(u, v, up, depth, LOG)
    return depth[u] + depth[v] - 2 * depth[ancestor]
```

---

### Path Aggregate Queries

Extend table to store aggregates:

```python
# Min/max/sum on path from node to root
def preprocess_with_min(tree, root, n, values):
    LOG = (n).bit_length()
    up = [[-1] * LOG for _ in range(n)]
    min_up = [[float('inf')] * LOG for _ in range(n)]
    depth = [0] * n
    
    # DFS to set up[v][0] and min_up[v][0]
    # ... DFS code ...
    min_up[v][0] = values[up[v][0]] if up[v][0] != -1 else float('inf')
    
    # Fill tables
    for j in range(1, LOG):
        for v in range(n):
            if up[v][j-1] != -1:
                up[v][j] = up[up[v][j-1]][j-1]
                min_up[v][j] = min(min_up[v][j-1], 
                                   min_up[up[v][j-1]][j-1])
    
    return up, min_up, depth, LOG

def query_min_to_root(v, k, min_up, LOG):
    """Min value on path from v up k steps"""
    result = float('inf')
    for i in range(LOG):
        if k & (1 << i):
            result = min(result, min_up[v][i])
            v = up[v][i]
    return result
```

<!-- back -->
