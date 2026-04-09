## Union-Find (Disjoint Set Union - DSU): Comparison

When should you use Union-Find vs BFS vs DFS for connectivity problems?

<!-- front -->

---

### Union-Find vs BFS vs DFS

| Aspect | Union-Find | BFS | DFS (Recursive) | DFS (Iterative) |
|--------|------------|-----|-----------------|-----------------|
| **Code complexity** | Simple class | Moderate | Simplest | Moderate |
| **Time per operation** | O(α(n)) ≈ O(1) | O(V+E) total | O(V+E) total | O(V+E) total |
| **Dynamic updates** | ✓ Native support | ✗ Requires re-traversal | ✗ Requires re-traversal | ✗ Requires re-traversal |
| **Cycle detection** | O(α(n)) per edge | O(V+E) full scan | O(V+E) full scan | O(V+E) full scan |
| **Path finding** | ✗ No path info | ✓ Full path | ✓ Full path | ✓ Full path |
| **Shortest path** | ✗ No | ✓ Unweighted | ✗ No | ✗ No |
| **Stack overflow** | No | No | Yes (risk) | No |
| **Component details** | Root only | Full traversal | Full traversal | Full traversal |
| **Space** | O(V) | O(V) | O(V) stack | O(V) |

**Winner:** Union-Find for dynamic connectivity, BFS for shortest path, DFS for simplicity

---

### When to Use Each Approach

**Union-Find - Use when:**
- Dynamic connectivity (edges added over time)
- Pure component counting (no traversal needed)
- Cycle detection in undirected graphs
- Building MST (Kruskal's algorithm)
- Incremental connectivity queries
- Very large sparse graphs

**BFS - Use when:**
- Shortest path in unweighted graph needed
- Level-order traversal required
- Need component details (all nodes in component)
- Stack overflow is a concern (deep graphs)
- Grid problems requiring traversal

**DFS Recursive - Use when:**
- Code simplicity matters
- Graph depth is manageable
- Path finding (not just counting)
- Quick interview solution acceptable

**DFS Iterative - Use when:**
- Stack overflow risk but DFS logic preferred
- Explicit stack control needed

---

### Connectivity Problem Type Matrix

| Problem Type | Union-Find | BFS | DFS |
|--------------|------------|-----|-----|
| Count components | ✓ Best | ✓ Good | ✓ Good |
| Cycle detection | ✓ Best | ✓ Good | ✓ Good |
| Check if connected | ✓ Best | ✓ Good | ✓ Good |
| Find all nodes in component | ✗ Poor | ✓ Best | ✓ Good |
| Shortest path | ✗ No | ✓ Best | ✗ No |
| Dynamic edge addition | ✓ Best | ✗ Poor | ✗ Poor |
| Path reconstruction | ✗ No | ✓ Best | ✓ Good |
| MST construction | ✓ Best | ✗ No | ✗ No |
| Equation validation | ✓ Best | ✗ No | ✗ No |

---

### Union-Find vs BFS: Counting Islands

**BFS Approach:**
```python
def num_islands_bfs(grid):
    """Time: O(rows × cols), Space: O(min(rows, cols))"""
    count = 0
    for each cell:
        if land and not visited:
            count += 1
            bfs(cell)  # Mark all connected as visited
    return count
```

**Union-Find Approach:**
```python
def num_islands_uf(grid):
    """Time: O(rows × cols × α(n)), Space: O(rows × cols)"""
    uf = UnionFind(rows * cols)
    
    for each land cell:
        for right, down neighbors:
            if neighbor is land:
                uf.union(current, neighbor)
    
    return count of unique roots among land cells
```

| Factor | BFS | Union-Find |
|--------|-----|------------|
| Time | O(V) | O(V × α(V)) ≈ O(V) |
| Space | O(min(rows, cols)) | O(V) |
| Grid modification | Yes (marks visited) | No (pure computation) |
| Code length | Medium | Short (with UF class) |
| Parallelizable | Harder | Easier |

**Recommendation:** BFS for grids (better space), Union-Find for dynamic graphs

---

### Cycle Detection Comparison

**Union-Find (Undirected):**
```python
def has_cycle_uf(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        if uf.connected(u, v):
            return True  # Cycle!
        uf.union(u, v)
    return False
```
- Time: O(E × α(V))
- Works only for undirected graphs

**BFS/DFS (Undirected):**
```python
def has_cycle_bfs(graph):
    visited = set()
    for start in graph:
        if start not in visited:
            if bfs_check_cycle(start, visited):
                return True
    return False
```
- Time: O(V + E)
- Requires full traversal

**DFS (Directed - with state tracking):**
```python
def has_cycle_dfs_directed(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    state = [WHITE] * len(graph)
    # GRAY = currently in recursion stack
```

| Graph Type | Best Algorithm |
|------------|----------------|
| Undirected, edges given | Union-Find |
| Undirected, adjacency list | BFS/DFS |
| Directed | DFS with 3-color |

---

### MST Construction: Kruskal's vs Prim's

| Aspect | Kruskal's (Union-Find) | Prim's (Priority Queue) |
|--------|------------------------|------------------------|
| Data structure | Union-Find + sorted edges | Min-heap + visited set |
| Time | O(E log E) | O(E log V) |
| Space | O(V) for UF | O(V) for heap |
| Best for | Sparse graphs | Dense graphs |
| Implementation | Simpler | More complex |

**Kruskal's with Union-Find:**
```python
def kruskals_mst(n, edges):
    edges.sort()  # O(E log E)
    uf = UnionFind(n)
    mst = []
    for w, u, v in edges:
        if not uf.connected(u, v):  # O(α(V))
            uf.union(u, v)
            mst.append((u, v, w))
    return mst
```

**When to use Kruskal's:** Sparse graphs, edges already sorted, simpler code preferred

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Dynamic connectivity queries | Union-Find | O(α(n)) per query |
| MST construction | Union-Find (Kruskal) | Simple, efficient for sparse |
| Shortest path unweighted | BFS | Natural fit |
| Component size tracking | Union-Find with size[] | O(1) size query |
| Path reconstruction | BFS/DFS | Store parent pointers |
| Very large graph, limited memory | Union-Find | O(V) space only |
| Graph traversal needed | BFS/DFS | Visit all nodes |
| Interview quick solve | DFS recursive | Fastest to write |
| Production code | BFS or Union-Find | No recursion risk |

<!-- back -->
