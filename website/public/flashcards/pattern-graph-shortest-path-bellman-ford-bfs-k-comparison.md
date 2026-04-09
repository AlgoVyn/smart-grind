## Graph - Shortest Path (Bellman-Ford / BFS with K stops): Comparison

When should you use different shortest path algorithms?

<!-- front -->

---

### Algorithm Selection Decision Tree

```
Start
  │
  ├── Graph has negative edge weights?
  │     │
  │     ├── YES ──→ Need to detect negative cycles?
  │     │               │
  │     │               ├── YES ──→ Bellman-Ford
  │     │               │
  │     │               └── NO ──→ SPFA (faster average case)
  │     │
  │     └── NO ──→ Need shortest path with limited edges/stops?
  │                     │
  │                     ├── YES ──→ BFS with K stops
  │                     │
  │                     └── NO ──→ Dijkstra (fastest: O(E log V))
  │
  └── Need all-pairs shortest paths?
        │
        ├── Graph small (V <= 500)? ──→ Floyd-Warshall
        │
        └── Run Dijkstra/Bellman-Ford from each node
```

---

### Bellman-Ford vs Dijkstra vs Floyd-Warshall

| Aspect | Bellman-Ford | Dijkstra | Floyd-Warshall |
|--------|--------------|----------|----------------|
| **Time** | O(V × E) | O(E log V) | O(V³) |
| **Space** | O(V) | O(V) | O(V²) |
| **Negative weights** | Yes | No | Yes |
| **Negative cycles** | Detects | Fails | Detects |
| **Single source** | Yes | Yes | All pairs |
| **Best for** | Sparse, negatives | Non-negatives, large | Small, all-pairs |

**Winner for negatives**: Bellman-Ford  
**Winner for speed (non-negatives)**: Dijkstra  
**Winner for all-pairs (small V)**: Floyd-Warshall

---

### Bellman-Ford vs BFS with K Stops

| Aspect | Bellman-Ford | BFS with K Stops |
|--------|--------------|------------------|
| **Constraint** | None | At most K edges |
| **Time** | O(V × E) | O(V × K) |
| **Space** | O(V) | O(V) |
| **Negative weights** | Yes | Only if non-negative prices |
| **Cycle handling** | Detects negative cycles | Limited by K, cycles OK |
| **Use case** | General shortest path | Flight routing, limited hops |

**Winner for general**: Bellman-Ford  
**Winner for flight problems**: BFS with K stops

---

### When to Use Each Approach

#### Bellman-Ford - Use When:
- Graph may have negative edge weights
- Need to detect negative weight cycles
- Running single-source shortest path
- Dijkstra cannot be used (negatives present)

#### BFS with K Stops - Use When:
- Problem explicitly limits number of stops/edges
- Solving flight routing problems
- Costs are non-negative (typical for prices)
- K is small relative to V

#### Floyd-Warshall - Use When:
- Need all-pairs shortest paths
- Graph is small (V ≤ 500)
- Graph is dense (many edges)
- Multiple queries on same graph

---

### Summary Table: Choose Your Approach

| Situation | Best Approach | Time | Why |
|-----------|---------------|------|-----|
| Standard shortest path (no negatives) | Dijkstra + heap | O(E log V) | Fastest |
| Negative weights present | Bellman-Ford | O(V × E) | Correct with negatives |
| Need negative cycle detection | Bellman-Ford | O(V × E) | Built-in detection |
| Limited stops (flight routing) | BFS with K stops | O(V × K) | Natural constraint fit |
| All-pairs, small graph | Floyd-Warshall | O(V³) | Simple, one run |
| All-pairs, large sparse graph | Run Dijkstra × V | O(V E log V) | More efficient |
| Average case optimization | SPFA | O(E) avg | Faster in practice |

<!-- back -->