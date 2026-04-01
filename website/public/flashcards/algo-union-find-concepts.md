## Title: Union-Find - Core Concepts

What is Union-Find (Disjoint Set Union) and when should it be used?

<!-- front -->

---

### Definition

Union-Find is a data structure that tracks a partition of elements into disjoint (non-overlapping) sets with near-constant time union and find operations.

| Operation | Without UF | With UF |
|-----------|------------|---------|
| **Check if connected** | O(n) graph traversal | O(α(n)) ~ O(1) |
| **Connect two sets** | O(n) | O(α(n)) ~ O(1) |
| **Count components** | O(n) | O(1) with tracking |

---

### Core Operations

```
Find(x): Determine which set contains x
         Returns representative (root) of the set

Union(x, y): Merge sets containing x and y
              Only if they are in different sets

Connected(x, y): Check if x and y are in same set
                   = Find(x) == Find(y)
```

### Inverse Ackermann Complexity

| n | α(n) |
|---|------|
| n < 2^16 | ≤ 4 |
| n < 2^512 | ≤ 5 |
| Universe | ≤ 6 |

---

### Key Properties

| Property | Description |
|----------|-------------|
| **Transitivity** | If A~B and B~C, then A~C |
| **Reflexive** | x is always connected to itself |
| **Symmetric** | If x~y, then y~x |
| **Partition** | Every element in exactly one set |

---

### Classic Applications

| Problem | Union-Find Use |
|---------|----------------|
| **Connected components** | Track merging of components |
| **Cycle detection** | Adding edge within same set creates cycle |
| **MST (Kruskal's)** | Add edges, skip if creates cycle |
| **Percolation** | Check if top connected to bottom |
| **Dynamic connectivity** | Online edge addition queries |
| **Equations satisfiability** | Union equal vars, check inequality conflicts |

---

### Implementation Pattern

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of components
    
    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        # Union by rank
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.count -= 1
        return True
```

<!-- back -->
