## Graph DFS - Connected Components / Island Counting: Comparison

When should you use different approaches for connected components/island counting?

<!-- front -->

---

### DFS vs BFS: Trade-off Analysis

| Aspect | Recursive DFS | Iterative DFS | BFS |
|--------|---------------|---------------|-----|
| **Code Clarity** | Cleanest | Moderate | Moderate |
| **Space** | O(depth) stack | O(depth) explicit stack | O(width) queue |
| **Stack Overflow Risk** | Yes (recursion limit) | No | No |
| **Implementation** | Simple recursion | Manual stack management | Queue required |
| **Best For** | Interviews, small-medium grids | Large grids | Shortest path needed |

**Winner for Interviews**: Recursive DFS (standard, readable)
**Winner for Production**: BFS (safer, no stack overflow)

---

### When to Use Each Approach

#### Recursive DFS - Use When:
- Standard interview setting
- Grid/graph is reasonably sized (< 10^5 nodes)
- Clean, concise code is priority
- No risk of hitting recursion depth limit

#### Iterative DFS - Use When:
- Very large grids (10^5+ cells)
- Recursion stack would overflow
- You need explicit control over traversal
- Call stack depth is limited

#### BFS - Use When:
- Need shortest path within component
- Grid is extremely deep (tall and narrow)
- Level-order traversal is needed
- Stack overflow is a concern

---

### Visited Tracking: Comparison

| Method | Space | Modifies Input | Use Case |
|--------|-------|----------------|----------|
| **Separate visited set/array** | O(V) or O(m×n) | No | Cannot modify input, need original |
| **In-place grid marking** | O(1) extra | Yes | Space constrained, input disposable |
| **Hash set for sparse** | O(K) where K=land cells | No | Sparse grids, unknown bounds |

**Interview Default**: In-place marking (cleaner, space-efficient)
**Production Default**: Separate visited (no side effects)

---

### Direction Count: 4 vs 8

| Connectivity | Directions | Typical Use Case |
|--------------|------------|------------------|
| **4-directional** | Up, Down, Left, Right | Standard island problems |
| **8-directional** | + Diagonals | Image processing, blob detection |

```python
# 4 directions (standard)
directions_4 = [(-1,0), (1,0), (0,-1), (0,1)]

# 8 directions (diagonal connectivity)
directions_8 = [(-1,-1), (-1,0), (-1,1),
                ( 0,-1),        ( 0,1),
                ( 1,-1), ( 1,0), ( 1,1)]
```

---

### Algorithm Selection Decision Tree

```
Start
  │
  ├── Graph with edges list? ──→ Build adjacency list → DFS from each unvisited
  │
  ├── 2D Grid problem?
  │     │
  │     ├── Can modify input? ──→ In-place DFS (O(1) space)
  │     │
  │     ├── Cannot modify? ──→ Separate visited set
  │     │
  │     ├── Shortest path needed? ──→ BFS
  │     │
  │     ├── Very large grid? ──→ Iterative DFS or BFS
  │     │
  │     └── Default ──→ Recursive DFS
  │
  └── Default ──→ Recursive DFS with visited tracking
```

---

### Summary Table: Choose Your Approach

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Standard interview | Recursive DFS + in-place | Clean, efficient |
| Cannot modify input | Recursive DFS + visited set | No side effects |
| Huge grid (10^6+ cells) | Iterative DFS or BFS | No stack overflow |
| Need shortest path | BFS | Level-order guarantees shortest |
| Sparse graph | Hash set visited | Memory efficient |
| Dense graph | Array visited | Fast lookup |

<!-- back -->
