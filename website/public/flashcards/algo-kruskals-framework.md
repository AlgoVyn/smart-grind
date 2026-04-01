## Title: Kruskal's Framework

What is the standard framework for applying Kruskal's MST algorithm?

<!-- front -->

---

### MST Framework
```
KRUSKAL_MST(G = (V, E)):
  // Phase 1: Preparation
  edges = sorted(E) by weight ascending
  dsu = new DSU(|V|)
  mst = empty set
  
  // Phase 2: Greedy construction
  for each (u, v, w) in edges:
    if dsu.find(u) != dsu.find(v):
      mst.add((u, v, w))
      dsu.union(u, v)
      if |mst| == |V| - 1: break
  
  // Phase 3: Result
  if |mst| == |V| - 1:
    return (sum of weights, mst edges)
  else:
    return "No MST (disconnected graph)"
```

---

### Key Components
| Component | Purpose |
|-----------|---------|
| Edge sorting | Process in optimal order |
| Union-Find | O(α(n)) connectivity checks |
| Cycle detection | find(u) == find(v) means cycle |
| Early termination | Stop at |V|-1 edges |

### When Applicable
| Scenario | Use Kruskal? |
|----------|--------------|
| Sparse graph (E ≈ V) | Yes - fast with sorting |
| Dense graph (E ≈ V²) | Prim better |
| Edge list given | Yes - already sorted? |
| Adjacency matrix | Prim better |
| Need max ST | Sort descending |

---

### Variations
| Problem | Modification |
|-----------|--------------|
| Maximum ST | Sort descending |
| Second MST | Try each MST edge, find next best |
| MST uniqueness | Check equal-weight edges |
| Minimum bottleneck | Same as MST property |

<!-- back -->
