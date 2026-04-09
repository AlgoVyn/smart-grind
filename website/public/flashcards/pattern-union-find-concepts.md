## Graph - Union-Find (DSU): Core Concepts

What are the fundamental principles of Union-Find?

<!-- front -->

---

### Core Concept

**Union-Find maintains a partition of elements into disjoint sets, supporting fast union and find operations using tree representation with path compression and union by rank.**

**Tree Representation:**
```
Before union:          After union(1, 4):
  0    3               0    3
  |                   / \
  1                   1   4
  |                       |
  2                       2
      
  4                      
  |
  5
```

---

### The Pattern

```
Two Key Optimizations:

1. PATH COMPRESSION:
   During find(x), make all nodes on path point directly to root.
   
   Before:           After find(5):
   1                 1
   |                /|\
   2               2 3 5
   |                   
   3                  
   |
   5

2. UNION BY RANK:
   Always attach shorter tree to taller tree.
   If equal height, increment rank of new root.
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Connected components | Track connectivity | Number of provinces |
| Cycle detection | Detect cycles in undirected graph | Graph valid tree |
| Kruskal's MST | Minimum spanning tree | Network connections |
| Equations possible | Check equation satisfiability | Evaluate division |
| Regions cut | Count regions after cuts | Number of islands II |

---

### Complexity

| Operation | Without optimization | With optimization |
|-----------|----------------------|-------------------|
| Find | O(n) worst | O(α(n)) ≈ O(1) |
| Union | O(n) worst | O(α(n)) ≈ O(1) |
| Connected | O(n) worst | O(α(n)) ≈ O(1) |

**α(n)**: Inverse Ackermann function, grows extremely slowly (< 5 for all practical n)

---

### Why Path Compression Works

```python
def find(self, x):
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])  # Key line!
    return self.parent[x]

# First call finds root normally
# Subsequent calls are O(1) because parent[x] points directly to root

# Visual:
Before multiple finds:    After:
    0                       0
    |                      /|\
    1                     1 2 3
    |
    2
    |
    3
```

<!-- back -->
