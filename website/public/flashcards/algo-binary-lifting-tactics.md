## Binary Lifting: Tactics & Tricks

What are the essential tactics for implementing efficient binary lifting and optimizing LCA queries?

<!-- front -->

---

### Tactic 1: Memory Optimization

| Approach | Space | When to Use |
|----------|-------|-------------|
| **Full table** | O(n log n) | General case, n ≤ 10^5 |
| **Sparse table** | O(n log n) | Static queries |
| **Euler tour + RMQ** | O(n) | Many queries, static tree |
| **Parent only** | O(n) | Single ancestor queries |

**Compress when memory constrained:**
```python
# Use array.array instead of list of lists
import array
up = [array.array('i', [-1] * LOG) for _ in range(n)]

# Or use numpy for large trees
import numpy as np
up = np.full((n, LOG), -1, dtype=np.int32)
```

---

### Tactic 2: Fast LCA Computation

```python
def lca_optimized(u, v, up, depth, LOG):
    if depth[u] < depth[v]:
        u, v = v, u
    
    # Lift u using bit manipulation
    diff = depth[u] - depth[v]
    bit = 0
    while diff:
        if diff & 1:
            u = up[u][bit]
        diff >>= 1
        bit += 1
    
    if u == v:
        return u
    
    # Find highest bit where ancestors differ
    for i in range(LOG - 1, -1, -1):
        if up[u][i] != up[v][i]:
            u = up[u][i]
            v = up[v][i]
    
    return up[u][0]
```

---

### Tactic 3: Preprocessing with BFS/DFS

Iterative DFS to avoid recursion limit:

```python
def preprocess_iterative(tree, root, n):
    LOG = (n).bit_length()
    up = [[-1] * LOG for _ in range(n)]
    depth = [0] * n
    
    # Iterative DFS with explicit stack
    stack = [(root, -1, 0)]  # (node, parent, state)
    # state: 0 = first visit, 1 = children processed
    
    while stack:
        v, p, state = stack.pop()
        if state == 0:
            up[v][0] = p
            stack.append((v, p, 1))
            for u in tree[v]:
                if u != p:
                    depth[u] = depth[v] + 1
                    stack.append((u, v, 0))
    
    # Fill rest of table
    for j in range(1, LOG):
        for v in range(n):
            if up[v][j-1] != -1:
                up[v][j] = up[up[v][j-1]][j-1]
    
    return up, depth, LOG
```

---

### Tactic 4: Online Binary Lifting

When tree grows dynamically:

```python
def add_node(parent, up, LOG):
    """Add new leaf to existing tree"""
    v = len(up)
    up.append([-1] * LOG)
    up[v][0] = parent
    
    for j in range(1, LOG):
        if up[v][j-1] != -1:
            up[v][j] = up[up[v][j-1]][j-1]
    
    return v

# Requires knowing max nodes in advance to allocate LOG
```

---

### Tactic 5: Combining with Other Structures

| Combination | Use Case | Benefit |
|-------------|----------|---------|
| **Binary Lifting + Euler Tour** | LCA queries | O(1) query after O(n) prep |
| **Binary Lifting + Fenwick Tree** | Path sum queries | O(log² n) updates/queries |
| **Binary Lifting + Segment Tree** | Path min/max | O(log² n) queries |
| **Binary Lifting + HLD** | Heavy path optimization | Best of both worlds |

**Euler Tour + RMQ for O(1) LCA:**
```python
# 1. Do Euler tour, record first occurrence of each node
# 2. Build sparse table on depth array
# 3. LCA = RMQ on range between first occurrences
# Complexity: O(n) prep, O(1) query
```

<!-- back -->
