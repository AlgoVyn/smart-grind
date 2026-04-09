## Graph - Shortest Path Dijkstra: Comparison

How does Dijkstra's algorithm compare to other shortest path algorithms?

<!-- front -->

---

### Dijkstra vs BFS (Unweighted Graphs)

| Aspect | BFS | Dijkstra |
|--------|-----|----------|
| **Input** | Unweighted graph (all edges = 1) | Weighted graph (non-negative) |
| **Data structure** | Queue (FIFO) | Priority queue (min-heap) |
| **Time complexity** | O(V + E) | O((V + E) log V) |
| **Space complexity** | O(V) | O(V) |
| **When to use** | Equal edge weights | Different edge weights |
| **Result** | Shortest path in edges | Shortest path in total weight |

```
BFS on weighted graph gives wrong answer:

   A ───[1]───► B ───[1]───► C
   │                         ▲
   └────────[3]──────────────┘

BFS path: A → B → C (2 edges)
Actual shortest: A → C (weight 3, vs BFS path weight 2)

Wait, that's correct... but consider:
   A ───[10]───► B ───[10]───► C
   │                          ▲
   └─────────[15]─────────────┘

BFS would pick A → C (1 edge) but weight is 15
Dijkstra correctly picks A → B → C with weight 20
```

**Rule:** Use BFS for unweighted, Dijkstra for weighted with non-negative weights.

---

### Dijkstra vs Bellman-Ford

| Aspect | Dijkstra | Bellman-Ford |
|--------|----------|--------------|
| **Edge weights** | Non-negative only | Can handle negative weights |
| **Time complexity** | O((V + E) log V) | O(V × E) |
| **Detects negative cycles** | No | Yes |
| **Space complexity** | O(V) | O(V) |
| **Implementation** | Priority queue | Simple relaxation V-1 times |
| **When to use** | Non-negative weights | Negative weights present |

```
Dijkstra fails with negative weights:

   A ───[5]───► B ───[-10]───► C
       ╲                      ▲
        ╰───────[100]─────────┘

Dijkstra's greedy choice:
1. Pop A (dist=0), update B=5, C=100
2. Pop B (dist=5), update C=5+(-10)=-5
3. Wait, C was already 100, now we update to -5
4. But A was already finalized!

Problem: If C had an edge back to A with weight 0:
   C → A with weight 0, then A's distance could be improved to -5
   But A is already finalized!

Bellman-Ford handles this by doing V-1 rounds of relaxation.
```

**Rule:** Negative weights → Bellman-Ford. Non-negative → Dijkstra (faster).

---

### Dijkstra vs Floyd-Warshall (All-Pairs)

| Aspect | Dijkstra | Floyd-Warshall |
|--------|----------|----------------|
| **Problem** | Single-source shortest path | All-pairs shortest path |
| **Time complexity** | O((V + E) log V) per run | O(V³) |
| **Multiple sources** | Run V times: O(V(V+E) log V) | One run: O(V³) |
| **Space complexity** | O(V) | O(V²) |
| **Implementation** | Priority queue | Triple nested loops |
| **Negative weights** | No | Can handle (no negative cycles) |

```
When to use which:

Single source:
  - Sparse graph: Dijkstra O((V+E) log V)
  - Dense graph: Dijkstra O(V² log V) or array-based O(V²)

All pairs:
  - Sparse graph: Run Dijkstra V times = O(V(V+E) log V)
  - Dense graph: Floyd-Warshall O(V³) beats V × Dijkstra

Example: V=100, E=500 (sparse)
  - Dijkstra × V = 100 × 600 × log(100) ≈ 400,000
  - Floyd-Warshall = 100³ = 1,000,000
  → Dijkstra wins

Example: V=100, E=5000 (dense)
  - Dijkstra × V = 100 × 5100 × log(100) ≈ 3,400,000
  - Floyd-Warshall = 1,000,000
  → Floyd-Warshall wins
```

**Rule:** Sparse graph + single source → Dijkstra. Dense graph + all pairs → Floyd-Warshall.

---

### Algorithm Selection Decision Tree

```
Shortest Path Algorithm Selection:

                    ┌─────────────────┐
                    │ Need shortest   │
                    │ path?           │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    ┌─────────┐        ┌──────────┐       ┌──────────┐
    │Weighted?│        │  Unweighted  │    │All pairs?│
    └────┬────┘        └─────┬────┘      └────┬────┘
         │                   │                 │
    ┌────┴────┐              │            ┌───┴────┐
    ▼         ▼              ▼            ▼        ▼
┌───────┐ ┌───────┐    ┌─────────┐  ┌────────┐ ┌────────┐
│Neg    │ │Non-neg│    │   BFS   │  │ Sparse │ │ Dense  │
│weights?│ │weights│    │  O(V+E) │  │ graph  │ │ graph  │
└───┬───┘ └───┬───┘    └─────────┘  └───┬────┘ └───┬────┘
    │         │                          │          │
    ▼         ▼                          ▼          ▼
┌─────────┐ ┌─────────┐           ┌──────────┐ ┌──────────┐
│Bellman- │ │ Dijkstra│           │Dijkstra  │ │ Floyd-   │
│Ford     │ │ O((V+E) │           │× V times │ │ Warshall │
│O(VE)   │ │  log V) │           │          │ │ O(V³)   │
└─────────┘ └─────────┘           └──────────┘ └──────────┘
```

---

### Summary Table

| Algorithm | Time | Space | Weights | Use Case |
|-----------|------|-------|---------|----------|
| **BFS** | O(V + E) | O(V) | Unweighted | Shortest path in unweighted graph |
| **Dijkstra (Heap)** | O((V + E) log V) | O(V) | Non-negative | Weighted graph, single source |
| **Dijkstra (Array)** | O(V²) | O(V) | Non-negative | Dense weighted graph |
| **Bellman-Ford** | O(V × E) | O(V) | Any (no neg cycle) | Negative weights, detect cycles |
| **Floyd-Warshall** | O(V³) | O(V²) | Any (no neg cycle) | All-pairs shortest paths |
| **SPFA** | O(E) avg, O(VE) worst | O(V) | Any | Bellman-Ford optimization |

<!-- back -->
