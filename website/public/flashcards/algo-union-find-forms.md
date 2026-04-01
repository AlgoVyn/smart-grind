## Title: Union-Find - Problem Forms

What are the standard problem forms that use Union-Find?

<!-- front -->

---

### Form 1: Connected Components

**Pattern:** Count or track merging of components as edges added

```python
def count_components(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.count

# Variation: Largest component
def largest_component(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return max(uf.size)
```

| Problem | Query Type |
|---------|------------|
| Number of provinces | Count components |
| Largest component | Track max size |
| Friend circles | Same as components |

---

### Form 2: Cycle Detection

**Pattern:** Detect if adding an edge creates a cycle

```python
def find_redundant_connection(edges):
    n = len(edges)
    uf = UnionFind(n + 1)
    
    for u, v in edges:
        if uf.connected(u, v):
            return [u, v]  # This edge creates cycle
        uf.union(u, v)
    return []

# In undirected graph: tree has exactly n-1 edges
# Adding any edge to tree creates exactly one cycle
```

| Indicator | Meaning |
|-----------|---------|
| `connected(u,v)` before union | Edge (u,v) creates cycle |
| `uf.count == 1` after all unions | Graph is connected |
| `uf.count > 1` after all unions | Graph has multiple components |

---

### Form 3: Kruskal's MST

**Pattern:** Sort edges by weight, add if no cycle formed

```python
def kruskal_mst(n, edges):
    """
    edges: (weight, u, v) list
    Returns total weight of MST
    """
    edges.sort()  # Sort by weight
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for w, u, v in edges:
        if uf.union(u, v):  # Only if no cycle
            mst_weight += w
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return mst_weight if edges_used == n - 1 else -1
```

**Key Insight:** MST has exactly n-1 edges, greedily pick smallest that connects different components.

---

### Form 4: Grid/2D Connectivity

**Pattern:** Connect adjacent cells and track regions

```python
def num_islands2(m, n, positions):
    """Dynamic island count as land added"""
    uf = UnionFind(m * n)
    grid = [[0] * n for _ in range(m)]
    islands = 0
    result = []
    
    for r, c in positions:
        if grid[r][c] == 1:
            result.append(islands)
            continue
        
        grid[r][c] = 1
        islands += 1
        
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc]:
                if uf.union(r * n + c, nr * n + nc):
                    islands -= 1
        
        result.append(islands)
    
    return result
```

| Grid Problem | UF Approach |
|--------------|-------------|
| Number of islands | Count components |
| Surrounded regions | Connect border to dummy node |
| Swim in rising water | Binary search + UF |

---

### Form 5: Equation Validation

**Pattern:** Union equal variables, check inequality constraints

```python
def equations_possible(equations):
    """
    equations: ["a==b", "b!=c", ...]
    Returns True if no contradiction
    """
    # First pass: union all equalities
    uf = UnionFind(26)
    for eq in equations:
        if eq[1] == '=':
            a, b = ord(eq[0]) - ord('a'), ord(eq[3]) - ord('a')
            uf.union(a, b)
    
    # Second pass: check inequalities
    for eq in equations:
        if eq[1] == '!':
            a, b = ord(eq[0]) - ord('a'), ord(eq[3]) - ord('a')
            if uf.connected(a, b):
                return False
    
    return True
```

<!-- back -->
