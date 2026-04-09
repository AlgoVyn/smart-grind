## Graph - Shortest Path (Bellman-Ford / BFS with K stops): Core Concepts

What are the fundamental concepts behind Bellman-Ford and BFS with K stops?

<!-- front -->

---

### The Core Insight

**Relaxation is the key operation**: If going through an intermediate node gives a shorter path, update the distance.

```
Before relaxation:
    A ----(5)----> C
    |
    └─(2)─> B ─(1)─> C
    
dist[A] = 0, dist[B] = 2, dist[C] = 5

After relaxing edge (B,C):
    A -> B -> C = 2 + 1 = 3 < 5
    
dist[C] = 3  ✓ Updated!
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **V-1 iterations** | After V-1 relaxations, shortest paths are found | Longest simple path has V-1 edges |
| **Negative cycle check** | If distances improve after V-1 iterations, negative cycle exists | Guarantees correctness detection |
| **Early termination** | Stop if no updates in an iteration | Optimization for already-optimal cases |
| **K constraint** | Track stops alongside distance | Handles limited-edge constraints |
| **BFS level = stops** | Each BFS level represents one more stop | Natural fit for flight routing problems |

---

### Why V-1 Iterations?

**Simple paths have at most V-1 edges**: A path with V edges must contain a cycle. Without negative cycles, cycles don't improve shortest paths.

```
Graph with 4 vertices:

Iteration 1: Find all paths with 1 edge
  A→B, A→C, B→D
  
Iteration 2: Find all paths with 2 edges  
  A→B→D, A→C→D
  
Iteration 3: Find all paths with 3 edges
  A→B→C→D (longest simple path)
  
After 3 = V-1 iterations, all shortest paths found!
```

---

### Negative Cycle Detection

**The extra V-th iteration check**: If any distance can still be improved after V-1 iterations, a negative cycle exists and is reachable.

```
Graph with negative cycle:
    A --(1)--> B --(1)--> C
    ↑           (-3)      |
    └---------------------┘
    
Iteration 1: A=0, B=1, C=2
Iteration 2: A=0, B=1, C=-1  (improved via cycle)
Iteration 3: A=0, B=1, C=-2  (still improving!)
...continues forever - negative cycle detected!
```

---

### When to Use Each Algorithm

| Scenario | Algorithm | Why |
|----------|-----------|-----|
| Negative weights possible | Bellman-Ford | Dijkstra fails with negatives |
| Need to detect negative cycles | Bellman-Ford | Built-in detection |
| Limited stops/edges (K constraint) | BFS with K | Natural fit for constraint |
| Flight routing problems | BFS with K | "Stops" maps directly to edges |
| Non-negative weights | Dijkstra | O(E log V) is faster |

---

### Time/Space Complexity

| Aspect | Bellman-Ford | BFS with K Stops |
|--------|--------------|------------------|
| **Time** | O(V × E) | O(V × K) |
| **Why** | V iterations × E edges | Each node visited with K stop states |
| **Space** | O(V) | O(V) or O(V × K) |
| **Why** | Distance array | Distance + optional stop tracking |

<!-- back -->