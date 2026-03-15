## Dijkstra with Negative Edges

**Questions:**
1. Why does Dijkstra fail with negative weights?
2. Provide a concrete counter-example.

<!-- front -->

---

## Dijkstra & Negative Weights

### Why It Fails
Dijkstra **greedily marks nodes as "done"** once visited. A later negative edge could provide a shorter path to an already-visited node.

### 🔴 Counter-Example
```
Graph:
  A --5--> B
  |        ^
  2        |
  +--4--> C

Edges:
  A → B: weight 5
  A → C: weight 2
  C → B: weight -4
```

### Dijkstra's Execution
```
Step 1: Visit A
  dist[B] = 5, dist[C] = 2
  
Step 2: Visit C (closest, mark DONE)
  No outgoing edges processed
  
Step 3: Visit B via A
  dist[B] = 5 (WRONG!)
```

### ❌ Actual Shortest Path
```
A → C → B = 2 + (-4) = -2
```

### ✅ Solution
Use **Bellman-Ford** algorithm for graphs with negative edges:
- Relaxes all edges V-1 times
- Can also detect negative cycles

<!-- back -->
