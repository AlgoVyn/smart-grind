## Dijkstra's Algorithm: Core Concepts

What is Dijkstra's algorithm and when does it guarantee optimal shortest paths?

<!-- front -->

---

### Fundamental Principle

Dijkstra's algorithm finds **single-source shortest paths** in a weighted graph with **non-negative edge weights**.

**Key insight:** Process nodes in order of increasing distance from source. Once a node is processed, its shortest distance is final.

---

### Greedy Property

| Step | Action |
|------|--------|
| **Initialize** | dist[source] = 0, others = ∞ |
| **Select** | Pick unvisited node with minimum distance |
| **Relax** | Update distances to neighbors |
| **Repeat** | Until all reachable nodes processed |

**Greedy choice is optimal:** Non-negative weights ensure no future path can improve selected node's distance.

---

### When It Fails

| Condition | Why Fails | Solution |
|-----------|-----------|----------|
| **Negative edges** | Greedy choice not optimal | Use Bellman-Ford |
| **Negative cycles** | Undefined shortest path | Bellman-Ford to detect |

```
Example where Dijkstra fails with negative edge:
  A --2--> B --(-5)--> C --3--> D
  |_________________10_____________|
  
Dijkstra picks C at distance 2+(-5)=-3, but then
finds A->D direct at 10, misses A->B->C->D at 0
```

---

### Complexity

| Implementation | Time | Space | Best For |
|--------------|------|-------|----------|
| **Array** | O(V²) | O(V) | Dense graphs |
| **Binary heap** | O((V+E) log V) | O(V) | General case |
| **Fibonacci heap** | O(V log V + E) | O(V) | Theoretical |
| **Dial's (bucket)** | O(V + E + C) | O(V+C) | Small integer weights |

---

### Applications

| Use Case | How Dijkstra Helps |
|----------|-------------------|
| **Network routing** | Shortest path in IP networks |
| **Map navigation** | GPS shortest/fastest route |
| **Game AI** | Pathfinding for NPCs |
| **Circuit design** | Delay minimization |
| **Resource allocation** | Minimum cost flow |

<!-- back -->
