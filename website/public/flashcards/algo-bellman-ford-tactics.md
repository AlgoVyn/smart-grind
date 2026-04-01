## Bellman-Ford: Tactics & Tricks

What are the essential tactics for optimizing Bellman-Ford and handling edge cases?

<!-- front -->

---

### Tactic 1: Early Termination

Stop if no distances change in an iteration:

```python
for i in range(n - 1):
    updated = False
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            updated = True
    
    if not updated:
        break  # Optimal distances found
```

**Performance:** Often terminates in << V-1 iterations on random graphs.

---

### Tactic 2: Yen's Optimizations

Two improvements for sparse graphs:

**Optimization 1: Partition edges**
```python
# Split edges into:
# - B[i]: edges (u,v) where dist[u] changed in iteration i-1
# Only relax edges in B[i] in iteration i
```

**Optimization 2: Threshold heuristic**
```python
# Don't update if improvement is smaller than threshold
# Trade optimality for speed (approximate)
```

---

### Tactic 3: Shortest Path Faster Algorithm (SPFA)

Use queue instead of iterating all edges:

```python
# Only process vertices whose distance changed
# Adjacency list representation
# Average case much faster than O(VE)

# Worst case: Still O(VE), can be worse with bad input
# Defense: Limit number of times a vertex enters queue
```

**SPFA Heuristics:**
- **SLF (Small Label First):** Add to front if smaller distance
- **LLL (Large Label Last):** Remove large distances from front

---

### Tactic 4: Negative Cycle Optimization

If only need detection, not full solution:

```python
def has_negative_cycle(edges, n):
    """Detect only, don't compute all distances"""
    dist = [0] * n  # Initialize all to 0 (allows any start)
    
    for i in range(n):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
                if i == n - 1:
                    return True
    
    return False
```

---

### Tactic 5: Johnson's Algorithm Component

Use Bellman-Ford to reweight edges for Dijkstra:

```python
def johnson(vertices, edges):
    """All-pairs shortest paths with potential negative edges"""
    # Step 1: Add dummy source, run Bellman-Ford
    dummy_edges = edges + [(0, v, 0) for v in vertices]
    h, _ = bellman_ford([0] + vertices, dummy_edges, 0)
    
    # Step 2: Reweight edges: w'(u,v) = w(u,v) + h[u] - h[v]
    new_edges = []
    for u, v, w in edges:
        new_edges.append((u, v, w + h[u] - h[v]))
    
    # Step 3: Run Dijkstra from each vertex
    all_pairs = {}
    for u in vertices:
        dist = dijkstra(vertices, new_edges, u)
        # Unweight: d[u][v] = dist[v] - h[u] + h[v]
        all_pairs[u] = {v: dist[v] - h[u] + h[v] for v in vertices}
    
    return all_pairs

# Complexity: O(VE + V(V+E) log V) = faster than Floyd-Warshall for sparse graphs
```

<!-- back -->
