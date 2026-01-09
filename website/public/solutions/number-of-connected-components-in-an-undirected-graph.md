# Number Of Connected Components In An Undirected Graph

## Problem Description

Given an undirected graph with `n` nodes labeled from `0` to `n-1`, and a list of edges where each edge is a pair `[u, v]` representing an undirected edge between nodes `u` and `v`, return the number of connected components in the graph.

A connected component is a set of nodes where each pair of nodes is connected by a path, and no node in the set is connected to any node outside the set.

---

## Examples

### Example 1

**Input:**
```python
n = 5, edges = [[0, 1], [1, 2], [3, 4]]
```

**Output:**
```python
2
```

**Explanation:**
There are two connected components: [0, 1, 2] and [3, 4].

### Example 2

**Input:**
```python
n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]
```

**Output:**
```python
1
```

**Explanation:**
All nodes are connected in a single component.

---

## Constraints

- `1 <= n <= 200`
- `0 <= edges.length <= n * (n - 1) / 2`
- `edges[i].length == 2`
- `0 <= u, v < n`
- `u != v`

---

## Solution

```python
from typing import List

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        rank = [0] * n
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                if rank[px] > rank[py]:
                    parent[py] = px
                elif rank[px] < rank[py]:
                    parent[px] = py
                else:
                    parent[py] = px
                    rank[px] += 1
        
        for u, v in edges:
            union(u, v)
        
        return sum(1 for i in range(n) if parent[i] == i)
```

---

## Explanation

To find the number of connected components in an undirected graph, we use the Union-Find (Disjoint Set Union) data structure.

### Algorithm Steps

1. Initialize parent array where each node is its own parent, and rank array for union by rank.

2. Define find function with path compression to get the root of a node.

3. Define union function to merge two components by rank.

4. Iterate through each edge and union the two nodes.

5. Count the number of nodes where `parent[i] == i`, which are the roots of components.

---

## Complexity Analysis

- **Time Complexity:** O(n + e * α(n)), where α is the inverse Ackermann function (nearly constant), making it almost linear.
- **Space Complexity:** O(n) for parent and rank arrays.
