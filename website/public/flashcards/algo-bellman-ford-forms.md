## Bellman-Ford: Problem Forms

What are the different problem forms and variations of shortest path problems that Bellman-Ford solves?

<!-- front -->

---

### Standard Shortest Path

**Input:** Directed weighted graph, single source  
**Output:** Shortest distances from source to all vertices

```python
# Standard form
dist = bellman_ford(V, E, source)
# dist[v] = shortest distance from source to v
```

---

### Negative Cycle Detection

| Variant | Approach | Output |
|---------|----------|--------|
| **Any negative cycle** | Run full algorithm | Boolean |
| **Reachable negative cycle** | From specific source | Boolean + affected nodes |
| **Find the cycle** | Track predecessors | List of vertices in cycle |

```python
def find_negative_cycle(vertices, edges, source):
    dist, pred = initialize(vertices, source)
    
    # Relax V-1 times
    for _ in range(len(vertices) - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                pred[v] = u
    
    # Find a vertex that can still be relaxed
    cycle_start = None
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            cycle_start = v
            break
    
    if cycle_start:
        # Trace back V times to enter the cycle
        for _ in range(len(vertices)):
            cycle_start = pred[cycle_start]
        
        # Collect cycle
        cycle = [cycle_start]
        node = pred[cycle_start]
        while node != cycle_start:
            cycle.append(node)
            node = pred[node]
        return cycle[::-1]
    
    return None
```

---

### System of Difference Constraints

**Form:** Find values for variables satisfying: `x_j - x_i ≤ c_k`

**Reduction to Bellman-Ford:**
```
Constraint x_j - x_i ≤ c  →  Edge i → j with weight c
Add source vertex s with edges s → i (weight 0) for all i

Solution exists ⟺ No negative cycles in constraint graph
```

**Example:**
```
x2 - x1 ≤ 3    →  edge (1, 2, 3)
x3 - x2 ≤ -2   →  edge (2, 3, -2)
x1 - x3 ≤ 1    →  edge (3, 1, 1)

Run Bellman-Ford from node 0 (connected to all)
dist[i] = valid solution for x_i
```

---

### Arbitrage Detection

**Form:** Find currency exchange cycle with product > 1

**Transformation:**
```python
# Exchange rate r: 1 unit of A → r units of B
# Want: r1 × r2 × ... × rn > 1
# Take log: log(r1) + log(r2) + ... + log(rn) > 0
# Negate: -log(r1) - log(r2) - ... - log(rn) < 0

# Create edge weights: w = -log(exchange_rate)
# Negative cycle = arbitrage opportunity

def detect_arbitrage(currencies, rates):
    edges = []
    for (a, b), rate in rates.items():
        edges.append((a, b, -math.log(rate)))
    
    try:
        bellman_ford(currencies, edges, currencies[0])
        return False  # No arbitrage
    except ValueError:
        return True   # Arbitrage exists
```

---

### Other Applications

| Problem | Reduction to Bellman-Ford |
|---------|----------------------------|
| **Shortest path with constraints** | Add state for constraint |
| **Minimum mean cycle** | Binary search + cycle detection |
| **Vertex potentials** | For Johnson's algorithm reweighting |
| **Network reliability** | Log probabilities as weights |
| **Temporal networks** | Time-dependent edges |

<!-- back -->
