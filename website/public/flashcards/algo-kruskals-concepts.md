## Title: Kruskal's Algorithm

What is Kruskal's algorithm and what problem does it solve?

<!-- front -->

---

### Definition
Greedy algorithm to find Minimum Spanning Tree (MST) of a weighted undirected graph. Builds MST by adding edges in order of increasing weight, skipping those that form cycles.

### Core Insight
The minimum weight edge across any cut belongs to some MST. By always adding the cheapest available edge that doesn't create a cycle, we build an MST.

### Algorithm Steps
```
1. Sort all edges by weight (ascending)
2. Initialize Union-Find (DSU) with n components
3. For each edge (u, v, w):
   If find(u) != find(v):
     Add edge to MST
     Union(u, v)
   Stop when n-1 edges added
```

---

### Implementation
```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskal(n, edges):  # edges = [(w, u, v), ...]
    edges.sort()  # sort by weight
    dsu = DSU(n)
    mst_weight = 0
    mst_edges = []
    
    for w, u, v in edges:
        if dsu.union(u, v):
            mst_weight += w
            mst_edges.append((u, v, w))
            if len(mst_edges) == n - 1:
                break
    
    return mst_weight, mst_edges
```

---

### Complexity
| Aspect | Value |
|--------|-------|
| Sorting | O(E log E) |
| DSU ops | O(α(V)) per op ≈ O(1) |
| Total | O(E log E) |
| Space | O(V + E) |

<!-- back -->
