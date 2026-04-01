## A* Search: Core Concepts

What is A* search, how does it differ from Dijkstra's algorithm, and what makes it optimal?

<!-- front -->

---

### Fundamental Definition

A* (A-star) is an **informed search algorithm** that finds the shortest path from start to goal using both:
- **g(n):** Actual cost from start to node n
- **h(n):** Heuristic estimate from n to goal

**Evaluation function:**
```
f(n) = g(n) + h(n)
     ↓      ↓
   known  estimated
   cost   future cost
```

---

### Key Properties

| Property | Requirement | Result |
|----------|-------------|--------|
| **Admissible** | h(n) ≤ true cost to goal | A* finds optimal path |
| **Consistent** | h(n) ≤ c(n,n') + h(n') | Guarantees no reopening |
| **Monotonic** | Same as consistent | f-value never decreases |

**Consistency implies admissibility (but not vice versa)**

---

### A* vs Dijkstra

| Aspect | Dijkstra | A* |
|--------|----------|-----|
| **Search type** | Uninformed | Informed |
| **Priority key** | g(n) only | g(n) + h(n) |
| **Nodes explored** | All nodes in increasing distance | Goal-directed subset |
| **Optimality** | Always optimal | Optimal if h admissible |
| **Speed** | O((V+E) log V) | Often much faster with good h |

---

### When to Use

| ✅ Use A* | ❌ Don't Use A* |
|-----------|-----------------|
| Large graph with clear goal | No heuristic available |
| Pathfinding (games, maps) | Memory-constrained (use IDA*) |
| Multiple query scenarios | Need all-pairs shortest paths |
| Heuristic is cheap to compute | Adversarial search (use minimax) |

---

### Common Heuristics

| Domain | Heuristic | Admissible? |
|--------|-----------|-------------|
| **Grid (4-way)** | Manhattan distance | Yes |
| **Grid (8-way)** | Chebyshev distance | Yes |
| **Grid (any angle)** | Euclidean distance | Yes |
| **Sliding puzzle** | Misplaced tiles | Yes |
| **Sliding puzzle** | Manhattan distance | Yes |
| **Route planning** | Great-circle distance | Yes |

<!-- back -->
