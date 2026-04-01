## Title: Union Find (Union by Rank) - Comparison

How does Union-Find compare to other connectivity data structures?

<!-- front -->

---

### Comparison Table

| Data Structure | Find | Union | Space | Best Use Case |
|----------------|------|-------|-------|---------------|
| **Union-Find (Optimized)** | O(α(n)) ≈ O(1) | O(α(n)) ≈ O(1) | O(n) | Dynamic connectivity, many queries |
| **Adjacency List + DFS** | O(V+E) | N/A | O(V+E) | Static connectivity, one-time query |
| **Adjacency Matrix** | O(V²) | O(1) | O(V²) | Dense graphs, small V |
| **Disjoint Set (Naive)** | O(n) | O(n) | O(n) | Never use in practice |

---

### When to Choose Each

**Choose Union-Find when:**
- You have many union and find operations
- The graph is dynamic (edges added over time)
- You need to track connected components efficiently
- Memory is a concern (O(n) vs O(V²))

**Choose DFS/BFS when:**
- You only need to query connectivity once
- The graph is completely built before queries
- You need to find the actual path between nodes
- Edge deletions are required

---

### Optimizations Impact

| Optimization | Complexity | Description |
|--------------|------------|-------------|
| No optimization | O(n) | Simple tree, linear time |
| Path compression only | O(log* n) | Iterated logarithm, very slow growth |
| Union by rank only | O(log n) | Balanced trees |
| Both optimizations | O(α(n)) | Inverse Ackermann, practically constant |

**Key Insight:** The inverse Ackermann function α(n) is so small that for all practical n, operations are effectively O(1).

---

### Limitations of Union-Find

| Limitation | Description | Solution |
|------------|-------------|----------|
| **No edge deletion** | Standard Union-Find doesn't support removing edges efficiently | Use Link-Cut trees or rebuild |
| **No path queries** | Cannot retrieve the actual path between nodes, only connectivity | Use BFS/DFS for paths |
| **Undirected graphs only** | Designed for undirected graphs | Use Tarjan's for directed SCCs |
| **Offline processing** | Some variants require all edges upfront | Use dynamic connectivity algorithms |

<!-- back -->
