## Floyd-Warshall: Comparison with Alternatives

How does Floyd-Warshall compare to Dijkstra and Bellman-Ford for shortest paths?

<!-- front -->

---

### All-Pairs Shortest Path: Floyd vs V×Dijkstra vs Johnson's

| Algorithm | Time | Space | Negative Edges | Sparse Graphs |
|-----------|------|-------|----------------|---------------|
| **Floyd-Warshall** | O(V³) | O(V²) | ✓ | O(V³) wasteful |
| **V × Dijkstra** | O(V·(E+V)log V) | O(V²) | ✗ | ✓ Efficient |
| **Johnson's** | O(V·E·log V) | O(V²) | ✓ | ✓ Best for sparse |

```python
# Decision tree
def choose_all_pairs_algorithm(V, E, has_negative):
    if has_negative:
        if E < V * V / 10:  # Sparse
            return "Johnson's algorithm"
        else:
            return "Floyd-Warshall"
    else:  # No negative edges
        if E < V * V / 5:
            return "V × Dijkstra (with heap)"
        else:
            return "Floyd-Warshall (simpler code)"
```

---

### Single Source: When Floyd is Overkill

| Scenario | Best Algorithm | Why |
|----------|----------------|-----|
| **No negatives** | Dijkstra | O((V+E)log V) |
| **Negative edges** | Bellman-Ford | O(V·E), detects cycles |
| **DAG** | Topological + DP | O(V+E) |
| **Need all pairs anyway** | Floyd-Warshall | Reuse computation |

```python
def single_source_shortest(V, edges, source):
    """
    Floyd is wasteful for single source
    """
    # WRONG: Using Floyd
    dist = floyd_warshall(V, edges)
    return dist[source]
    # Time: O(V³) for single row!
    
    # CORRECT: Dijkstra or Bellman-Ford
    return dijkstra(V, edges, source)
    # Time: O((V+E)log V)
```

---

### Johnson's Algorithm for Sparse Graphs

```python
def johnson(V, edges):
    """
    All-pairs for sparse graphs with negative edges
    1. Add dummy source, run Bellman-Ford for potentials
    2. Reweight edges to be non-negative
    3. Run Dijkstra from each node
    Time: O(V·E·log V) - better than O(V³) when E << V²
    """
    # Step 1: Bellman-Ford from new source
    # h[v] = shortest distance from source to v
    
    # Step 2: Reweight
    # new_weight(u,v) = old_weight(u,v) + h[u] - h[v] >= 0
    
    # Step 3: V × Dijkstra
    # dist[u][v] = dijkstra_result - h[u] + h[v]
    
    pass
```

**Winner when:** E = O(V) and graph is large.

---

### Space-Time Trade-offs

| Optimization | Space | Time | Use When |
|--------------|-------|------|----------|
| **Full matrix** | O(V²) | O(V³) | General case |
| **Bitset reachability** | O(V²/64) | O(V³/64) | Boolean only |
| **Single row reuse** | O(V) | O(V³) | Memory constrained |
| **Johnson's** | O(V²) | O(V·E·log V) | Sparse |

```python
# Bitset optimization for reachability
def transitive_closure_fast(n, edges):
    reach = [0] * n
    for i in range(n):
        reach[i] = 1 << i
    for u, v in edges:
        reach[u] |= 1 << v
    
    for k in range(n):
        mask = 1 << k
        for i in range(n):
            if reach[i] & mask:
                reach[i] |= reach[k]
    
    return reach
```

<!-- back -->
