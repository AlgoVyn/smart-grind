## Minimum Spanning Tree (Kruskal/Prim/DSU/Heap): Comparison

When should you use Kruskal vs Prim's algorithm?

<!-- front -->

---

### Kruskal vs Prim: The Big Picture

| Aspect | Kruskal's | Prim's (Heap) | Prim's (Array) |
|--------|-----------|---------------|----------------|
| **Core idea** | Add edges in order | Grow tree from node | Grow tree from node |
| **Data structure** | Union-Find + sorted edges | Min-heap + visited | Array + visited |
| **Cycle detection** | Union-Find (find/union) | Visited set | Visited set |
| **Time complexity** | O(E log E) | O(E log V) | O(V²) |
| **Space complexity** | O(V) for DSU | O(V) for heap | O(V) for arrays |
| **Best for** | Sparse graphs (E ≈ V) | Sparse with adjacency list | Dense graphs (E ≈ V²) |
| **Preprocessing** | Sort all edges | None | None |
| **Implementation** | Simpler | Moderate | Simple |

**Winner**: Kruskal for edge lists, Prim for adjacency lists, Prim-Array for dense matrices

---

### When to Use Each Algorithm

**Kruskal - Use when:**
- Graph given as edge list
- E is much smaller than V² (sparse)
- Code simplicity is priority
- Need to naturally handle disconnected graphs (forest)
- Already need to sort edges for other reasons

**Prim (Heap) - Use when:**
- Graph given as adjacency list
- E is O(V log V) or less
- Dense adjacency matrix but converting to list
- Building MST incrementally (online algorithm)

**Prim (Array) - Use when:**
- Graph is dense (E ≈ V²)
- Given adjacency matrix
- V is small (V < 1000)
- No heap implementation available

---

### Complexity Breakdown by Graph Type

**Sparse Graph (E = O(V)):**
| Algorithm | Time | Space | Winner? |
|-----------|------|-------|---------|
| Kruskal | O(V log V) | O(V) | ✓ Fast, simple |
| Prim (Heap) | O(V log V) | O(V) | ✓ Comparable |
| Prim (Array) | O(V²) | O(V) | ✗ Slower |

**Dense Graph (E = O(V²)):**
| Algorithm | Time | Space | Winner? |
|-----------|------|-------|---------|
| Kruskal | O(V² log V) | O(V) | ✗ Sorting dominates |
| Prim (Heap) | O(V² log V) | O(V) | ✗ Same issue |
| Prim (Array) | O(V²) | O(V) | ✓ Linear scan wins |

**Ultra-Sparse (E = O(V), already sorted):**
| Algorithm | Time | Space | Winner? |
|-----------|------|-------|---------|
| Kruskal | O(V α(V)) ≈ O(V) | O(V) | ✓✓ Clear winner |
| Prim (Heap) | O(V log V) | O(V) | Good |

---

### Input Format Impact

| Input Format | Best Algorithm | Why |
|--------------|----------------|-----|
| `List[(u, v, w)]` edge list | Kruskal | Direct use |
| `List[List[(v, w)]]` adjacency list | Prim (Heap) | Natural fit |
| `List[List[int]]` adjacency matrix | Prim (Array) | O(1) lookup |
| `points: List[(x, y)]` coordinates | Kruskal or Prim | Build edges first |

**Building edges from points:**
```python
# For n points, build all n(n-1)/2 edges
edges = []
for i in range(n):
    for j in range(i + 1, n):
        dist = manhattan(points[i], points[j])
        edges.append((i, j, dist))

# Then Kruskal: O(n² log n²) = O(n² log n)
# Or use Prim with lazy edge generation: O(n² log n)
```

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Interview, edge list given | Kruskal | Fastest to write |
| Interview, adjacency list | Prim (Heap) | Direct implementation |
| Interview, dense matrix | Prim (Array) | Avoid O(V² log V) sorting |
| Production, sparse graph | Either | Both are efficient |
| Production, dense graph | Prim (Array) | Best asymptotic complexity |
| Dynamic connectivity | Union-Find alone | Don't need full MST |
| Streaming edges | Kruskal + Union-Find | Process as they arrive |
| Very large V (10^5+) | Prim (Heap) | Better cache performance |

---

### Code Complexity Comparison

**Kruskal (lines of code):**
```python
# ~15 lines core logic
edges.sort(key=lambda x: x[2])
uf = UnionFind(n)
mst = []
for u, v, w in edges:
    if uf.union(u, v):
        mst.append((u, v, w))
        if len(mst) == n - 1:
            break
```

**Prim with Heap:**
```python
# ~20 lines core logic
visited = [False] * n
heap = [(0, 0, -1)]
mst = []
while heap and len(mst) < n:
    w, u, p = heapq.heappop(heap)
    if visited[u]: continue
    visited[u] = True
    if p != -1: mst.append((p, u, w))
    for v, ew in graph[u]:
        if not visited[v]:
            heapq.heappush(heap, (ew, v, u))
```

**Verdict**: Kruskal slightly simpler, especially with pre-built Union-Find.

---

### Special Cases Comparison

| Special Case | Kruskal | Prim |
|--------------|---------|------|
| Disconnected graph | Returns forest naturally | Needs restart per component |
| Pre-sorted edges | O(E α(V)) - excellent | No advantage |
| Online (edges arrive) | Can process incrementally | Must have all edges upfront |
| Existing MST edges | Easy to force include | More complex |
| Maximum ST | Reverse sort | Use max-heap |
| Constrained edges | Filter before sort | Filter during execution |

<!-- back -->
