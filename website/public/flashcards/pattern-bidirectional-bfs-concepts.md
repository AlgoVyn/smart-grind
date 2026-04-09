## Graph - Bidirectional BFS: Core Concepts

What are the fundamental principles of bidirectional BFS?

<!-- front -->

---

### Core Concept

**Search from both source and target simultaneously - they meet in the middle, dramatically reducing search space.**

The key insight: Two searches expanding from opposite ends will intersect much faster than one search traversing the entire path.

**Search space comparison:**
```
Standard BFS from S to T:
S → ● → ● → ● → ● → ● → T
   b^1  b^2  b^3  b^4  b^5  b^6
   Total: b^6 nodes explored

Bidirectional BFS:
S → ● → ● → ○ ← ● ← ● ← T
   b^1  b^2  b^3
   b^3  b^2  b^1
   Total: 2 × b^3 nodes explored

Where b = branching factor, d = path length
```

---

### The Pattern

```
Initialize:
  Start side: {S}, parents_S = {S: None}
  End side:   {T}, parents_T = {T: None}

Expand:
  While both sides have nodes:
    Pick smaller side to expand
    For each node at current frontier:
      Generate neighbors
      If neighbor in OTHER side:
        FOUND! Return reconstructed path
      Add to next frontier
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Word ladder | Transformations | LeetCode 127 |
| Gene mutation | Shortest mutation | LeetCode 433 |
| Game solving | State transitions | 8-puzzle, chess |
| Social networks | Connection paths | Degrees of separation |
| Route finding | Navigation | GPS path finding |

---

### Complexity

| Aspect | Standard BFS | Bidirectional |
|--------|--------------|---------------|
| Time | O(b^d) | O(b^(d/2)) |
| Space | O(b^d) | O(b^(d/2)) |

---

### Critical Optimization

```python
# ALWAYS expand the smaller frontier
if len(frontiers[0]) > len(frontiers[1]):
    frontiers.reverse()
    parents.reverse()

Why? Maintains balance and prevents one side
dominating the search space.
```

<!-- back -->
