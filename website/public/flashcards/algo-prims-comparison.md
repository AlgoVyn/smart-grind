## Prim's Algorithm: Comparison

How do Prim's and Kruskal's algorithms compare for MST?

<!-- front -->

---

### Prim's vs Kruskal's

| Aspect | Prim's | Kruskal's |
|--------|--------|-----------|
| Strategy | Grow from node | Add global min edges |
| Data structure | Heap / Array | Union-Find |
| Time (sparse) | O(E log V) | O(E log E) |
| Time (dense) | O(V²) | O(E log E) or O(E α(V)) |
| Space | O(V) | O(V) |
| Better for | Dense graphs | Sparse graphs |

---

### When to Use Each

| Scenario | Algorithm | Why |
|----------|-----------|-----|
| Dense graph (E > V²/log V) | Prim's array | O(V²) beats O(E log V) |
| Sparse graph | Either | Both O(E log V) |
| Pre-sorted edges | Kruskal's | O(E α(V)) |
| Online/dynamic | Prim's | Easier to adapt |
| Need to stop early | Prim's | Natural with heap |

---

### Implementation Comparison

```python
# Prim's - priority queue based
def mst_prims(graph, n):
    visited = [False] * n
    heap = [(0, 0)]
    total = 0
    while heap:
        w, v = heapq.heappop(heap)
        if visited[v]: continue
        visited[v] = True
        total += w
        for u, wt in graph[v]:
            if not visited[u]:
                heapq.heappush(heap, (wt, u))
    return total

# Kruskal's - sort + union-find
def mst_kruskal(edges, n):
    edges.sort()  # Sort by weight
    uf = UnionFind(n)
    total = 0
    for w, u, v in edges:
        if uf.union(u, v):
            total += w
    return total
```

---

### Heap Choice for Prim's

| Heap Type | push | pop | decrease-key | Use When |
|-----------|------|-----|--------------|----------|
| Binary | O(log V) | O(log V) | O(log V) | General |
| Fibonacci | O(1) | O(log V) | O(1) | Theory |
| Binomial | O(1) | O(log V) | O(log V) | Rare |

**Note**: Python's heapq doesn't support decrease-key efficiently; we push duplicates and skip visited.

---

### Time Complexity Summary

| Algorithm | Dense | Sparse |
|-----------|-------|--------|
| Prim (array) | O(V²) | O(V²) |
| Prim (heap) | O(V² log V) | O(E log V) |
| Kruskal | O(E log E) | O(E log E) |
| Kruskal + UF | O(E α(V)) | O(E α(V)) |

**Recommendation**: Use Prim's with array for dense, Kruskal for sparse unless edges pre-sorted.

<!-- back -->
