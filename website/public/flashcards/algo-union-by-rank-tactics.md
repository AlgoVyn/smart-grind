## Title: Union Find (Union by Rank) - Tactics

What are specific techniques for using Union-Find?

<!-- front -->

---

### Tactic 1: Counting Connected Components

```python
def count_components(n, edges):
    """Count number of connected components in undirected graph."""
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.get_num_components()
```

---

### Tactic 2: Detecting Cycles in Undirected Graphs

```python
def has_cycle(n, edges):
    """Detect if undirected graph contains a cycle."""
    uf = UnionFind(n)
    for u, v in edges:
        if uf.connected(u, v):
            return True  # Cycle detected
        uf.union(u, v)
    return False
```

---

### Tactic 3: Kruskal's MST with Union-Find

```python
def kruskal_mst(n, edges):
    """
    Find minimum spanning tree using Kruskal's algorithm.
    edges: (weight, u, v) tuples
    Returns: Total weight of MST
    """
    edges.sort()  # Sorts by first element (weight)
    
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for weight, u, v in edges:
        if not uf.connected(u, v):
            uf.union(u, v)
            mst_weight += weight
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return mst_weight if edges_used == n - 1 else -1
```

---

### Tactic 4: Iterative Find (Avoid Recursion Limit)

```python
def find_iterative(self, x):
    """Iterative find with path compression."""
    # Find root
    root = x
    while self.parent[root] != root:
        root = self.parent[root]
    
    # Compress path
    while self.parent[x] != root:
        next_parent = self.parent[x]
        self.parent[x] = root
        x = next_parent
    
    return root
```

---

### Tactic 5: Comparison with Alternatives

| Data Structure | Find | Union | Space | Best Use Case |
|----------------|------|-------|-------|---------------|
| **Union-Find (Optimized)** | O(α(n)) | O(α(n)) | O(n) | Dynamic connectivity, many queries |
| **Adjacency List + DFS** | O(V+E) | N/A | O(V+E) | Static connectivity, one-time query |
| **Adjacency Matrix** | O(V²) | O(1) | O(V²) | Dense graphs, small V |
| **Disjoint Set (Naive)** | O(n) | O(n) | O(n) | Never use in practice |

**Choose Union-Find when:**
- Many union and find operations
- Graph is dynamic
- Track connected components efficiently
- Memory is a concern

<!-- back -->
