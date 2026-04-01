## Title: Kruskal's Forms

What are the different forms and applications of Kruskal's algorithm?

<!-- front -->

---

### MST Variants

| Variant | Modification | Use Case |
|---------|--------------|----------|
| Minimum ST | Sort ascending | Standard MST |
| Maximum ST | Sort descending | Maximize total |
| Minimum Product | Log weights, sum | Probability chains |
| MST with constraints | Skip forbidden | Restricted edges |

### Second Best MST
```python
def second_best_mst(n, edges):
    # 1. Find MST
    mst_weight, mst_edges, mst_set = kruskal(n, edges)
    
    # 2. Try removing each MST edge
    best = float('inf')
    for skip_edge in mst_edges:
        weight = kruskal_without(n, edges, skip_edge)
        if weight < best:
            best = weight
    
    return best
```

---

### DSU Variants
| DSU Type | Feature | Use |
|----------|---------|-----|
| Basic | Union + Find | Standard |
| Rollback | Undo unions | Backtracking |
| Persistent | History access | Time queries |
| Weighted | Edge weights | Max edge in path |

### Related Problems
```
Borůvka's algorithm: Parallel edge selection
Prim's algorithm: Grow from single vertex
Reverse-delete: Remove heaviest non-bridge edges
```

---

### Application: Minimum Spanning Forest
```python
def kruskal_forest(n, edges, k):  # k components
    edges.sort()
    dsu = DSU(n)
    mst_weight = 0
    edges_used = 0
    
    for w, u, v in edges:
        if dsu.find(u) != dsu.find(v):
            dsu.union(u, v)
            mst_weight += w
            edges_used += 1
            if edges_used == n - k:  # k components
                break
    
    return mst_weight
```

<!-- back -->
