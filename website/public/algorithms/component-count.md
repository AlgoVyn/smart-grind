# Component Count

## Category
Graphs

## Description

Given an undirected graph, count the number of connected components. A connected component is a subgraph in which any two vertices are connected to each other by paths. This fundamental graph operation is used in network analysis, clustering, and preprocessing for other graph algorithms.

---

## Concepts

### 1. Approaches

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| DFS/BFS | O(V+E) | O(V) | Static graph |
| Union-Find | O(V+E·α) | O(V) | Dynamic edges |
| Kosaraju | O(V+E) | O(V) | Directed SCCs |

### 2. Connected Components

A connected component is a maximal connected subgraph.

### 3. Strongly Connected Components

For directed graphs, use Kosaraju's or Tarjan's algorithm.

---

## Frameworks

### Framework 1: DFS Count

```
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT COUNT - DFS                                        │
├─────────────────────────────────────────────────────────────┤
│  1. Build adjacency list                                       │
│  2. Initialize visited array                                   │
│  3. components = 0                                             │
│  4. For each unvisited node:                                   │
│     a) components += 1                                         │
│     b) DFS to mark all reachable nodes                       │
│  5. Return components                                          │
└─────────────────────────────────────────────────────────────┘
```

### Framework 2: Union-Find

```
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT COUNT - UNION-FIND                                │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize Union-Find with n nodes                        │
│  2. For each edge (u, v):                                     │
│     a) Union(u, v)                                            │
│  3. Return number of distinct parents                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: DFS/BFS Count

Standard traversal counting.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) |
| **Method** | Traversal |

### Form 2: Union-Find

Dynamic connectivity approach.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E × α(V)) |
| **Space** | O(V) |
| **Best** | Dynamic graphs |

---

## Tactics

### Tactic 1: DFS Count

```python
from collections import defaultdict

def count_components_dfs(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = [False] * n
    components = 0
    
    def dfs(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
    
    for i in range(n):
        if not visited[i]:
            components += 1
            dfs(i)
    
    return components
```

### Tactic 2: Union-Find

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px != py:
            self.parent[px] = py
            self.count -= 1

def count_components_uf(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.count
```

---

## Python Templates

### Template 1: DFS Count

```python
def count_components_dfs(n, edges):
    """Count connected components using DFS."""
    from collections import defaultdict
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = [False] * n
    components = 0
    
    def dfs(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
    
    for i in range(n):
        if not visited[i]:
            components += 1
            dfs(i)
    
    return components
```

### Template 2: Union-Find

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px != py:
            self.parent[px] = py
            self.count -= 1

def count_components_uf(n, edges):
    """Count using Union-Find."""
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.count
```

---

## Practice Problems

### Problem 1: Number of Provinces
**Problem:** [LeetCode 547](https://leetcode.com/problems/number-of-provinces/)

### Problem 2: Count Unreachable Pairs
**Problem:** [LeetCode 2316](https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph/)

---

## Summary

Component counting:
- DFS/BFS for simple counting
- Union-Find for dynamic graphs
- Kosaraju/Tarjan for directed SCCs
- O(V + E) time complexity
