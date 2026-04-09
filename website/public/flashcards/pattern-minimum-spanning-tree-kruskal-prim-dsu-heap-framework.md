## Minimum Spanning Tree (Kruskal/Prim/DSU/Heap): Framework

What is the complete code template for MST algorithms?

<!-- front -->

---

### Framework: MST Algorithms

```
┌─────────────────────────────────────────────────────────────────────┐
│  MINIMUM SPANNING TREE - TEMPLATE                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. KRUSKAL'S ALGORITHM (Union-Find):                               │
│                                                                     │
│     a. Sort all edges by weight: edges.sort(key=lambda x: x[2])      │
│     b. Initialize UnionFind(n)                                       │
│     c. For each edge (u, v, w):                                      │
│        - If find(u) != find(v):                                     │
│          * union(u, v)                                             │
│          * add w to total                                            │
│          * add edge to MST                                         │
│        - Stop when |MST| = V - 1                                   │
│                                                                     │
│  2. PRIM'S ALGORITHM (Min-Heap):                                    │
│                                                                     │
│     a. Initialize: visited = [False] * n                           │
│     b. min_heap = [(0, 0, -1)]  # (weight, node, parent)           │
│     c. While heap not empty and MST incomplete:                     │
│        - Pop minimum edge                                            │
│        - If node not visited:                                        │
│          * Mark visited                                              │
│          * Add weight to total                                       │
│          * Add all edges to heap                                     │
│                                                                     │
│  3. STOP when |MST| = V - 1 edges                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Kruskal's Algorithm

```python
from typing import List, Tuple

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskal_mst(n: int, edges: List[Tuple[int, int, int]]) -> Tuple[int, List[Tuple[int, int, int]]]:
    """
    Kruskal's MST: O(E log E) time, O(V) space for DSU.
    Best for: Sparse graphs (E ≈ V)
    """
    edges.sort(key=lambda x: x[2])  # Sort by weight
    
    uf = UnionFind(n)
    mst = []
    total_weight = 0
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
            if len(mst) == n - 1:
                break
    
    return total_weight, mst
```

---

### Implementation: Prim's Algorithm (Heap)

```python
import heapq
from typing import List, Tuple

def prim_mst(n: int, graph: List[List[Tuple[int, int]]]) -> Tuple[int, List[Tuple[int, int, int]]]:
    """
    Prim's MST with heap: O(E log V) time, O(V) space.
    Best for: Sparse graphs with adjacency list.
    """
    visited = [False] * n
    min_heap = [(0, 0, -1)]  # (weight, node, parent)
    mst = []
    total_weight = 0
    
    while min_heap and len(mst) < n:
        weight, node, parent = heapq.heappop(min_heap)
        
        if visited[node]:
            continue
        
        visited[node] = True
        total_weight += weight
        
        if parent != -1:
            mst.append((parent, node, weight))
        
        for neighbor, edge_weight in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(min_heap, (edge_weight, neighbor, node))
    
    return total_weight, mst
```

---

### Implementation: Prim's Algorithm (Dense Graph)

```python
def prim_mst_dense(n: int, adj_matrix: List[List[int]]) -> int:
    """
    Prim's MST for dense graphs: O(V²) time, O(V) space.
    Best for: Dense graphs (E ≈ V²).
    """
    visited = [False] * n
    min_edge = [float('inf')] * n
    min_edge[0] = 0
    total_weight = 0
    
    for _ in range(n):
        # Find minimum edge to unvisited node
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or min_edge[i] < min_edge[u]):
                u = i
        
        if min_edge[u] == float('inf'):
            break  # Graph not connected
        
        visited[u] = True
        total_weight += min_edge[u]
        
        # Update min edges
        for v in range(n):
            if not visited[v] and adj_matrix[u][v] > 0:
                min_edge[v] = min(min_edge[v], adj_matrix[u][v])
    
    return total_weight
```

---

### Key Framework Elements

| Element | Kruskal | Prim (Heap) | Prim (Array) |
|---------|---------|-------------|--------------|
| Data structure | Union-Find | Min-heap | Array |
| Sorting | O(E log E) | None | None |
| Find min edge | Iterate sorted | Heap pop | Linear scan |
| Cycle check | Union-Find | Visited array | Visited array |
| Best for | E ≈ V | E ≈ V log V | E ≈ V² |

---

### Complexity Summary

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| Kruskal's | O(E log E) | O(V) | Sparse graphs |
| Prim's (Heap) | O(E log V) | O(V) | Sparse graphs |
| Prim's (Array) | O(V²) | O(V) | Dense graphs |

<!-- back -->
