## A* Search: Comparison Guide

How does A* compare to other pathfinding and search algorithms?

<!-- front -->

---

### Search Algorithm Comparison

| Algorithm | Info | Optimality | Space | Time | Best For |
|-----------|------|------------|-------|------|----------|
| **BFS** | Uninformed | Optimal (unweighted) | O(b^d) | O(b^d) | Small graphs, unweighted |
| **Dijkstra** | Uninformed | Optimal | O(V) | O(E log V) | Weighted, single-source |
| **A*** | Informed | Optimal (admissible h) | O(V) | O(E log V)* | Large graphs with heuristic |
| **IDA*** | Informed | Optimal | O(d) | O(b^d) | Memory constrained |
| **Greedy Best-First** | Informed | Not optimal | O(V) | O(E log V) | Fast, approximate |
| **Bellman-Ford** | Uninformed | Optimal (neg weights) | O(V) | O(VE) | Negative edges |

*b = branching factor, d = depth, *heuristic-dependent

---

### A* vs Greedy Best-First

| Aspect | Greedy Best-First | A* |
|--------|-------------------|-----|
| **Priority** | h(n) only | g(n) + h(n) |
| **Optimality** | ❌ Not optimal | ✅ Optimal (with admissible h) |
| **Speed** | Very fast | Moderate |
| **Completeness** | Complete in finite space | Complete |

**Greedy trap:** Can get stuck in local minima or wander indefinitely

---

### A* vs Dijkstra in Practice

```
Scenario: 1000×1000 grid, uniform cost, start to goal

Dijkstra:    Explores ~500,000 nodes (radiating circle)
A* (Manhattan): Explores ~5,000 nodes (narrow cone toward goal)
A* (ε=2):    Explores ~1,000 nodes (suboptimal but fast)
```

**When no heuristic:** Dijkstra = A* with h(n) = 0

---

### Variants Comparison

| Variant | Trade-off | Use Case |
|-----------|-----------|----------|
| **Standard A*** | Balanced | General purpose |
| **Weighted A*** | Speed > optimality | Real-time systems |
| **ARA*** | Anytime quality | Time-bounded planning |
| **D* Lite** | Dynamic replanning | Robotics, changing maps |
| **Fringe Search** | Memory efficient | Very large graphs |
| **Theta*** | Any-angle paths | Robotics with smooth motion |

---

### Choosing the Right Algorithm

| Requirement | Algorithm |
|-------------|-----------|
| Fast, optimal, heuristic available | A* |
| Memory constrained | IDA* or Fringe Search |
| Map changes frequently | D* Lite or LPA* |
| Need approximate fast result | Weighted A* or Greedy BFS |
| No heuristic / all directions equal | Dijkstra |
| Multiple goals, one source | Dijkstra |
| Negative edge weights | Bellman-Ford |
| Two-way search faster | Bidirectional A* |

<!-- back -->
