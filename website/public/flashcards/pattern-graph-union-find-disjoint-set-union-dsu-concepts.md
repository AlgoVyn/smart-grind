## Union-Find (Disjoint Set Union - DSU): Core Concepts

What are the fundamental concepts behind Union-Find?

<!-- front -->

---

### Core Principle

**Each set is represented as a tree, with the root as the set's representative.**

```
Set Representation as Trees:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Set A: {0,1,2,3}          Set B: {4,5,6}             │
│                                                         │
│       0 (root)                  4 (root)                │
│      / |                      /   |                     │
│     1  2─3                   5    6                     │
│                                                         │
│   parent[0]=0  parent[4]=4                            │
│   parent[1]=0  parent[2]=0                            │
│   parent[3]=2  parent[5]=4                            │
│                parent[6]=4                            │
│                                                         │
│   Two trees = Two disjoint sets                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### The "Aha!" Moments

**Why does this work?**

1. **Tree representation** - Each set is a tree with root as representative; parent pointers form the tree structure
2. **Path compression** - During find, flatten the tree by making nodes point directly to root
3. **Union by rank/size** - Always attach smaller tree to larger tree to keep trees balanced
4. **Amortized O(1)** - With both optimizations, operations are effectively constant time
5. **Inverse Ackermann** - α(n) < 5 for all practical n (n < 2^65536)

**Path Compression Visualization:**
```
Before find(5):              After find(5):
      0 (root)                     0 (root)
     / | \                        / | \ | \
    1  2  3                      1  2  3  4  5
       |                          
       4                          
       |                          
       5                          

find(5) path: 5→4→2→0
After: parent[5]=0, parent[4]=0  (path compressed)
```

---

### Path Compression: The Critical Optimization

**What it does:** During `find(x)`, update parent of every node on the path to point directly to root.

```python
def find(self, x):
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])  # ← Recursively compress
    return self.parent[x]
```

**Why it matters:**
- Without: Tree can become skewed, find is O(n) worst case
- With: Effectively flattens tree to height 1 after first traversal
- Result: Amortized O(α(n)) time per operation

**Without vs With Path Compression:**

| Scenario | Without | With |
|----------|---------|------|
| Skewed tree depth | O(n) | Becomes O(1) after find |
| Repeated finds | O(n) each | O(1) after first |
| Long chain penalty | Every operation | One-time cost |

---

### Union by Rank vs Union by Size

**Union by Rank:**
- `rank` = upper bound on tree height
- Attach lower rank tree to higher rank tree
- Only increment rank when merging equal ranks

**Union by Size:**
- `size` = actual number of nodes in tree
- Attach smaller tree to larger tree
- More intuitive for component size queries

```
Union by Rank Example:
Rank 0: 0    Rank 0: 1    After union(0,1):
                           Rank 1: 0
                                      |
                                     1

Union by Size Example:
Size 1: 0    Size 1: 1    After union(0,1):
                           Size 2: 0
                                      |
                                     1
```

---

### When to Use Union-Find

| Signal | Pattern |
|--------|---------|
| "Number of provinces/regions" | Count connected components |
| "Redundant connection" | Cycle detection in undirected graph |
| "Accounts merge" | Group by equivalence relation |
| "Stones removed" | Connected components in grid |
| "Valid tree" | Check n-1 edges + fully connected |
| "Equations possible" | Check consistency of equality constraints |
| Dynamic connectivity | Edges added incrementally |

**Union-Find vs BFS/DFS:**
| Aspect | Union-Find | BFS/DFS |
|--------|------------|---------|
| Code complexity | Simple class | Traversal logic |
| Cycle detection | O(α(n)) per edge | O(V+E) full scan |
| Dynamic updates | Natural fit | Requires re-traversal |
| Component details | Root only | Full traversal |
| Path finding | No | Yes |

---

### Cycle Detection with Union-Find

**Key insight:** If two nodes are already connected, adding an edge between them creates a cycle.

```python
def detect_cycle(edges):
    """Returns True if adding this edge creates a cycle."""
    for u, v in edges:
        if uf.connected(u, v):  # Already connected?
            return True  # This edge creates a cycle!
        uf.union(u, v)
    return False
```

**Visualization:**
```
Edges: [0-1], [1-2], [0-2]  ← 3rd edge creates cycle

Step 1: union(0,1)    Step 2: union(1,2)    Step 3: connected(0,2)?
       0───1                0───1               0───1
                            └───┘                ╲  ╱
                            2                      2
                                                  
                        All connected!        Yes! → Cycle detected
```

---

### Time & Space Complexity

**Time Complexity:**
| Operation | Without optimizations | With path compression | With both optimizations |
|-----------|----------------------|------------------------|------------------------|
| `find()` | O(n) | O(log n) | O(α(n)) |
| `union()` | O(n) | O(log n) | O(α(n)) |
| `connected()` | O(n) | O(log n) | O(α(n)) |

**Space Complexity:** O(n) for parent and rank/size arrays

**Inverse Ackermann Function α(n):**
- Grows incredibly slowly
- α(n) < 5 for all n < 2^65536
- Effectively constant for all practical purposes

<!-- back -->
