## Title: LCA Framework

What is the standard framework for LCA problems?

<!-- front -->

---

### Binary Lifting Framework
```
PREPROCESS(tree, root):
  1. DFS from root to compute depth[v]
  2. up[v][0] = parent[v]
  3. For j = 1 to LOG-1:
       up[v][j] = up[up[v][j-1]][j-1]
  
  Time: O(n log n)
  Space: O(n log n)

QUERY(u, v):
  1. Ensure depth[u] >= depth[v] (swap if needed)
  2. Lift u up by (depth[u] - depth[v]) using binary lifting
  3. If u == v: return u
  4. For j = LOG-1 down to 0:
       If up[u][j] != up[v][j]:
         u = up[u][j]
         v = up[v][j]
  5. Return parent[u] (= parent[v])
  
  Time: O(log n)
```

---

### Framework Components
| Component | Purpose |
|-----------|---------|
| depth[] | Distance from root |
| up[v][j] | 2^j-th ancestor of v |
| LOG | ⌈log₂(n)⌉, max jump size |

### Alternative: Euler Tour + Segment Tree
```
1. DFS, record Euler tour (enter/exit each node)
2. First occurrence of each node in tour
3. RMQ on depths over tour segment between nodes
4. LCA = node with min depth in range
```

---

### Variations
| Problem | Modification |
|-----------|--------------|
| Weighted edges | Store edge weights, sum in query |
| K-th ancestor | Jump exactly k steps |
| Max edge on path | Store max per jump |
| Distance | Use depth + edge weights |

<!-- back -->
