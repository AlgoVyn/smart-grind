## Graph - Union Find (DSU): Core Concepts

What are the fundamental principles of the Union-Find (Disjoint Set Union) data structure?

<!-- front -->

---

### Core Concept

Use **a parent array with path compression and union by rank/size** to efficiently manage connected components and answer connectivity queries.

**Key insight**: Nearly constant time (inverse Ackermann) operations for union and find.

---

### The Pattern

```
Initial: Each element is its own set
[0, 1, 2, 3, 4, 5]
 ↓  ↓  ↓  ↓  ↓  ↓
 0  1  2  3  4  5

Union(0, 1):
  Find(0) = 0, Find(1) = 1
  Make 1's parent = 0
[0, 0, 2, 3, 4, 5]
 ↓  ↓  ↓  ↓  ↓  ↓
 0  1  2  3  4  5

Union(1, 2):
  Find(1) = 0 (path: 1→0), Find(2) = 2
  Make 2's parent = 0
[0, 0, 0, 3, 4, 5]
 ↓  ↓  ↓  ↓  ↓  ↓
 0  1  2  3  4  5

Find(2): Path 2→0, returns 0
  (With path compression: make 2's parent = 0 directly)

Result: {0,1,2}, {3}, {4}, {5} are the connected components
```

---

### Core Operations

| Operation | Action | Time Complexity |
|-----------|--------|-----------------|
| **Find(x)** | Find root of x with path compression | O(α(n)) ≈ O(1) |
| **Union(x,y)** | Connect sets of x and y | O(α(n)) ≈ O(1) |
| **Connected(x,y)** | Check if x and y in same set | O(α(n)) ≈ O(1) |

**α(n) = inverse Ackermann function, effectively < 5 for all practical n**

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Connected Components | Find groups | Number of Provinces |
| Cycle Detection | Detect cycles in undirected graph | Redundant Connection |
| Kruskal's MST | Minimum spanning tree | Minimum Cost to Connect Points |
| Equation Validation | Check if equations possible | Evaluate Division |
| Region Merging | Image processing, grids | Number of Islands II |
| Bipartite Check | Check if graph is bipartite | Possible Bipartition |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Find | O(α(n)) | Inverse Ackermann, effectively constant |
| Union | O(α(n)) | Amortized |
| Build | O(n) | Initialize n sets |
| Space | O(n) | Parent and rank arrays |

<!-- back -->
