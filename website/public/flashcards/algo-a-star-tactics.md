## A* Search: Tactics & Tricks

What are the essential tactics for implementing efficient A* search and designing effective heuristics?

<!-- front -->

---

### Tactic 1: Heuristic Scaling (Weighted A*)

Trade optimality for speed:

```python
def weighted_heuristic(node, goal, epsilon=1.5):
    """
    epsilon > 1: Faster, suboptimal (bounded by epsilon * optimal)
    epsilon = 1: Standard A* (optimal)
    epsilon < 1: Slower, may still be optimal if over-estimates
    """
    return epsilon * manhattan_distance(node, goal)
```

**Properties:**
- Path cost ≤ epsilon × optimal cost
- Fewer nodes expanded with higher epsilon
- Useful in real-time systems

---

### Tactic 2: Tight Heuristic Design

| Heuristic Quality | Nodes Expanded | Performance |
|-------------------|----------------|-------------|
| h(n) = 0 | All | Dijkstra (slowest) |
| Loose upper bound | Many | Slow |
| Perfect oracle | Direct path | Instant (impossible) |
| Admissible & tight | Minimal | Best practical |

**Techniques to tighten heuristics:**
- Pattern databases (precomputed subproblems)
- Relax fewer constraints
- Landmark-based heuristics

---

### Tactic 3: Memory Optimization

When memory is constrained, use **IDA*** (Iterative Deepening A*):

```python
def ida_star(root, heuristic):
    threshold = heuristic(root)
    while True:
        result = search(root, 0, threshold, heuristic)
        if result == "FOUND":
            return path
        if result == float('inf'):
            return None  # No solution
        threshold = result  # Next f-limit

def search(node, g, threshold, h):
    f = g + h(node)
    if f > threshold:
        return f
    if is_goal(node):
        return "FOUND"
    min_threshold = float('inf')
    for child in expand(node):
        result = search(child, g + cost, threshold, h)
        if result == "FOUND":
            return "FOUND"
        if result < min_threshold:
            min_threshold = result
    return min_threshold
```

**Memory:** O(depth) vs O(nodes) for standard A*

---

### Tactic 4: Grid Optimizations

```python
# 1. Precompute heuristic table for static goals
# 2. Use bit-packed arrays for visited flags
# 3. Early exit on first goal reached (if multiple)
# 4. Jump Point Search for uniform grids

# Jump Point Search - skip empty corridors
# Reduces nodes from O(n²) to O(n) on open grids
```

---

### Tactic 5: Debugging Heuristics

**Verify admissibility:**
```python
def check_admissible(heuristic, graph, goal):
    # For all nodes, h(n) ≤ true_distance(n, goal)
    true_dist = dijkstra_all(graph, goal)  # Run Dijkstra from goal
    for node in graph:
        if heuristic(node, goal) > true_dist[node]:
            print(f"Inadmissible at {node}")
            return False
    return True
```

**Consistency check:**
```python
# h(u) ≤ c(u,v) + h(v) for all edges (u,v)
```

<!-- back -->
