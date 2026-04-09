## Minimum Spanning Tree (Kruskal/Prim/DSU/Heap): Tactics

What are the advanced techniques for MST problems?

<!-- front -->

---

### Tactic 1: Virtual Node (Super Node)

When there's a "well" or external connection point, add a virtual node.

```python
def min_cost_with_well(n, wells, pipes):
    """
    Optimize water distribution: build wells OR connect pipes.
    Strategy: Add virtual node 0 where edges (0, i, wells[i]) 
    represent building a well at house i.
    """
    # Original edges: pipes between houses
    edges = pipes  # [(u, v, cost), ...]
    
    # Add virtual edges: building wells
    for i in range(n):
        edges.append((0, i + 1, wells[i]))
    
    # Run Kruskal/Prim on n+1 nodes
    return kruskal_mst(n + 1, edges)[0]
```

**When to use:**
- "Build wells OR connect pipes"
- "Build power stations OR connect wires"
- Multiple connection options from outside

---

### Tactic 2: Maximum Spanning Tree

Same algorithm, sort in descending order or use max-heap.

```python
def max_spanning_tree(n, edges):
    """
    Maximum ST: Sort edges descending instead of ascending.
    """
    # Sort in REVERSE order for maximum
    edges.sort(key=lambda x: x[2], reverse=True)
    
    uf = UnionFind(n)
    mst = []
    total = 0
    
    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
            if len(mst) == n - 1:
                break
    
    return total, mst

# For Prim's with max heap (Python uses min, so negate)
max_heap = [(-weight, node, parent)]
```

---

### Tactic 3: Handling Disconnected Graphs

Kruskal naturally produces a forest; Prim needs modification.

```python
def mst_forest_kruskal(n, edges):
    """
    For disconnected graphs, returns forest (MST of each component).
    Kruskal naturally handles this.
    """
    edges.sort(key=lambda x: x[2])
    uf = UnionFind(n)
    mst = []
    total = 0
    
    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
    
    # Returns forest if graph disconnected
    return total, mst

def mst_forest_prim(n, graph):
    """
    Prim for disconnected: Run from each unvisited node.
    """
    visited = [False] * n
    total = 0
    
    for start in range(n):
        if visited[start]:
            continue
        
        # Run Prim from this unvisited node
        heap = [(0, start, -1)]
        while heap:
            w, u, p = heapq.heappop(heap)
            if visited[u]:
                continue
            visited[u] = True
            total += w
            for v, ew in graph[u]:
                if not visited[v]:
                    heapq.heappush(heap, (ew, v, u))
    
    return total
```

---

### Tactic 4: Critical and Pseudo-Critical Edges

Identify edges that must/may be in some MST.

```python
def find_critical_pseudo_critical_edges(n, edges):
    """
    Critical: Edge in ALL MSTs. Removing it increases total weight.
    Pseudo-critical: Edge in SOME MST but not all.
    """
    # Get weight of any MST
    base_mst_weight, _ = kruskal_mst(n, edges)
    
    critical = []
    pseudo_critical = []
    
    for i, (u, v, w) in enumerate(edges):
        # Test without this edge
        edges_without = edges[:i] + edges[i+1:]
        mst_without, _ = kruskal_mst(n, edges_without)
        
        if len(mst_without) < n - 1 or mst_without > base_mst_weight:
            # Must use this edge
            critical.append(i)
        else:
            # Test with this edge (force include)
            # Add edge first, run MST on rest
            uf = UnionFind(n)
            uf.union(u, v)
            forced_weight = w
            for eu, ev, ew in edges:
                if uf.union(eu, ev):
                    forced_weight += ew
            
            if forced_weight == base_mst_weight:
                pseudo_critical.append(i)
    
    return [critical, pseudo_critical]
```

---

### Tactic 5: Second Best MST

Find the MST with second smallest total weight.

```python
def second_best_mst(n, edges):
    """
    Second best MST: For each edge in MST, remove it and 
    find minimum replacement that reconnects.
    """
    # Get original MST
    mst_weight, mst_edges = kruskal_mst(n, edges)
    
    # Convert to adjacency list for quick edge lookup
    mst_set = set((min(u,v), max(u,v)) for u, v, w in mst_edges)
    
    second_best = float('inf')
    
    for u, v, w in mst_edges:
        # Try MST without this edge
        edges_without = [(a, b, c) for a, b, c in edges 
                        if not (min(a,b) == min(u,v) and max(a,b) == max(u,v))]
        
        new_weight, new_mst = kruskal_mst(n, edges_without)
        if len(new_mst) == n - 1:  # Still connected
            second_best = min(second_best, new_weight)
    
    return second_best
```

---

### Tactic 6: Common Pitfalls & Fixes

| Pitfall | Issue | Solution |
|---------|-------|----------|
| Not sorting edges in Kruskal | Wrong MST | Always sort by weight |
| Missing path compression | O(log n) instead of O(α(n)) | Add `parent[x] = find(parent[x])` |
| Marking visited in Prim too late | Duplicate edges in heap | Check `if visited[node]: continue` after pop |
| Wrong DSU initialization | Index errors | `parent = list(range(n))` |
| Forgetting 0-index vs 1-index | Wrong node mapping | Be consistent, convert if needed |
| Not checking MST completeness | Wrong answer for disconnected | Verify `len(mst) == n - 1` |
| Using Prim without checking connectivity | Infinite loop | Check if heap empties early |

---

### Tactic 7: Kruskal with Edge Filtering

Pre-filter edges for specific constraints.

```python
def constrained_mst(n, edges, max_edge_weight):
    """
    MST with constraint: only edges with weight <= max allowed.
    """
    # Filter edges first
    valid_edges = [(u, v, w) for u, v, w in edges if w <= max_edge_weight]
    
    # Run Kruskal on filtered edges
    return kruskal_mst(n, valid_edges)

def kruskal_with_existing(n, edges, existing_edges):
    """
    MST where some edges are already built (must include).
    """
    uf = UnionFind(n)
    mst = []
    total = 0
    
    # First, union all existing edges
    for u, v in existing_edges:
        if uf.union(u, v):
            mst.append((u, v, 0))  # Already built, cost 0
    
    # Then run Kruskal on remaining edges
    edges.sort(key=lambda x: x[2])
    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
    
    return total, mst
```

<!-- back -->
