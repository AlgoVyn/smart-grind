# Find Critical And Pseudo Critical Edges In Minimum Spanning Tree

## Problem Description

Given a weighted undirected connected graph with n vertices numbered from 0 to n - 1, and an array edges where edges[i] = [ai, bi, weighti] represents a bidirectional and weighted edge between nodes ai and bi. A minimum spanning tree (MST) is a subset of the graph's edges that connects all vertices without cycles and with the minimum possible total edge weight.
Find all the critical and pseudo-critical edges in the given graph's minimum spanning tree (MST). An MST edge whose deletion from the graph would cause the MST weight to increase is called a critical edge. On the other hand, a pseudo-critical edge is that which can appear in some MSTs but not all.
Note that you can return the indices of the edges in any order.

---

## Constraints

- 2 <= n <= 100
- 1 <= edges.length <= min(200, n * (n - 1) / 2)
- edges[i].length == 3
- 0 <= ai < bi < n
- 1 <= weighti <= 1000
- All pairs (ai, bi) are distinct.

---

## Example 1

**Input:**
```python
n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
```

**Output:**
```python
[[0,1],[2,3,4,5]]
```

**Explanation:**
The figure above describes the graph.
The following figure shows all the possible MSTs:

Notice that the two edges 0 and 1 appear in all MSTs, therefore they are critical edges, so we return them in the first list of the output.
The edges 2, 3, 4, and 5 are only part of some MSTs, therefore they are considered pseudo-critical edges. We add them to the second list of the output.

---

## Example 2

**Input:**
```python
n = 4, edges = [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]
```

**Output:**
```python
[[],[0,1,2,3]]
```

**Explanation:**
We can observe that since all 4 edges have equal weight, choosing any 3 edges from the given 4 will yield an MST. Therefore all 4 edges are pseudo-critical.

---

## Solution

```python
from typing import List

class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        class UnionFind:
            def __init__(self, size):
                self.parent = list(range(size))
                self.rank = [0] * size
                self.count = size
            
            def find(self, x):
                if self.parent[x] != x:
                    self.parent[x] = self.find(self.parent[x])
                return self.parent[x]
            
            def union(self, x, y):
                px, py = self.find(x), self.find(y)
                if px == py:
                    return False
                if self.rank[px] < self.rank[py]:
                    self.parent[px] = py
                elif self.rank[px] > self.rank[py]:
                    self.parent[py] = px
                else:
                    self.parent[py] = px
                    self.rank[px] += 1
                self.count -= 1
                return True
        
        def kruskal(excluded=None, forced=None):
            uf = UnionFind(n)
            weight = 0
            used = set()
            if forced is not None:
                u, v, w = edges[forced]
                if uf.union(u, v):
                    weight += w
                    used.add(forced)
                else:
                    return float('inf'), set()
            for i, (u, v, w) in enumerate(edges):
                if i == excluded or i == forced:
                    continue
                if uf.union(u, v):
                    weight += w
                    used.add(i)
            if uf.count == 1:
                return weight, used
            return float('inf'), set()
        
        W, mst = kruskal()
        critical = []
        pseudo = []
        for i in range(len(edges)):
            if i in mst:
                w2, _ = kruskal(excluded=i)
                if w2 > W:
                    critical.append(i)
            else:
                w2, _ = kruskal(forced=i)
                if w2 == W:
                    pseudo.append(i)
        return [critical, pseudo]
```

---

## Explanation

This problem requires identifying critical and pseudo-critical edges in the Minimum Spanning Tree (MST) of a graph.

### Step-by-Step Explanation:

1. **Compute the MST:**
   - Use Kruskal's algorithm to find the MST weight W and the set of edges in the MST.

2. **Identify critical edges:**
   - For each edge in the MST, compute the MST weight of the graph excluding that edge.
   - If the new weight is greater than W, the edge is critical (removing it increases the total weight).

3. **Identify pseudo-critical edges:**
   - For each edge not in the MST, compute the MST weight of the graph forcing inclusion of that edge.
   - If the new weight equals W, the edge is pseudo-critical (it can be included in some MST without increasing the weight).

4. **Union-Find for efficiency:**
   - Use Union-Find with path compression and union by rank to efficiently manage connectivity during Kruskal's algorithm.

### Time Complexity:

O(E^2 α(N)), where E is the number of edges (up to 200), N is the number of vertices (up to 100), and α is the inverse Ackermann function (nearly constant). Since E is small, this is efficient.

### Space Complexity:

O(N + E), for the Union-Find structure and edge storage.
