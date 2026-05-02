# Bipartite Check (Graph Coloring)

## Category
Graphs

## Description

A graph is bipartite if we can split its nodes into two disjoint sets such that every edge connects nodes from different sets (no edges within the same set). This is equivalent to checking if the graph is 2-colorable using BFS or DFS.

Bipartite graphs are important for scheduling problems, matching problems, and conflict resolution. They can be recognized by the absence of odd-length cycles.

---

## Concepts

### 1. 2-Coloring

Each node is assigned one of two colors:

| Color | Meaning |
|-------|---------|
| 0 | Set A |
| 1 | Set B |
| -1 | Uncolored |

### 2. Bipartite Condition

A graph is bipartite if and only if it contains no odd-length cycles.

### 3. BFS Coloring Process

1. Start with uncolored node, assign color 0
2. Assign opposite color to all neighbors
3. If neighbor already has same color, not bipartite

### 4. Union-Find Alternative

Can also use Union-Find with virtual nodes for negation.

---

## Frameworks

### Framework 1: BFS Coloring

```
┌─────────────────────────────────────────────────────────────┐
│  BFS BIPARTITE CHECK                                         │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize color array with -1 (uncolored)             │
│                                                              │
│  2. For each uncolored node:                                 │
│     a) Start BFS with color 0                                 │
│     b) For each neighbor:                                     │
│        - If uncolored: assign opposite color                 │
│        - If same color: return False (not bipartite)        │
│                                                              │
│  3. Return True if all nodes colored without conflict       │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Standard Bipartite Check

Check if graph can be 2-colored.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) |
| **Method** | BFS or DFS |

### Form 2: With Actual Coloring

Return the actual coloring assignment.

| Output | color array with 0s and 1s |
|--------|---------------------------|
| **Use** | Partition into two sets |

---

## Tactics

### Tactic 1: BFS Coloring

```python
from collections import deque

def is_bipartite(graph):
    n = len(graph)
    color = [-1] * n
    
    for start in range(n):
        if color[start] != -1:
            continue
        
        queue = deque([start])
        color[start] = 0
        
        while queue:
            node = queue.popleft()
            
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
    
    return True
```

### Tactic 2: DFS Coloring

```python
def is_bipartite_dfs(graph):
    n = len(graph)
    color = [-1] * n
    
    def dfs(node, c):
        color[node] = c
        for neighbor in graph[node]:
            if color[neighbor] == -1:
                if not dfs(neighbor, 1 - c):
                    return False
            elif color[neighbor] == c:
                return False
        return True
    
    for i in range(n):
        if color[i] == -1:
            if not dfs(i, 0):
                return False
    return True
```

### Tactic 3: Union-Find Approach

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        self.parent[self.find(x)] = self.find(y)

def is_bipartite_uf(graph):
    n = len(graph)
    uf = UnionFind(2 * n)
    
    for i in range(n):
        for j in graph[i]:
            if uf.find(i) == uf.find(j):
                return False
            uf.union(i, j + n)
            uf.union(j, i + n)
    
    return True
```

---

## Python Templates

### Template 1: BFS Coloring

```python
from collections import deque

def is_bipartite(graph):
    """
    Check if graph is bipartite using BFS.
    
    Time: O(V + E)
    Space: O(V)
    """
    n = len(graph)
    color = [-1] * n
    
    for start in range(n):
        if color[start] != -1:
            continue
        
        queue = deque([start])
        color[start] = 0
        
        while queue:
            node = queue.popleft()
            
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
    
    return True
```

### Template 2: DFS Coloring

```python
def is_bipartite_dfs(graph):
    """
    Check if graph is bipartite using DFS.
    """
    n = len(graph)
    color = [-1] * n
    
    def dfs(node, c):
        color[node] = c
        for neighbor in graph[node]:
            if color[neighbor] == -1:
                if not dfs(neighbor, 1 - c):
                    return False
            elif color[neighbor] == c:
                return False
        return True
    
    for i in range(n):
        if color[i] == -1:
            if not dfs(i, 0):
                return False
    return True
```

---

## When to Use

Use Bipartite Check when:
- Need to partition nodes into two groups
- Check for odd-length cycles
- Scheduling with two resources
- Bipartite matching prerequisite

---

## Practice Problems

### Problem 1: Is Graph Bipartite?
**Problem:** [LeetCode 785](https://leetcode.com/problems/is-graph-bipartite/)

### Problem 2: Possible Bipartition
**Problem:** [LeetCode 886](https://leetcode.com/problems/possible-bipartition/)

---

## Summary

Bipartite check:
- 2-color graph using BFS/DFS
- Odd cycle = not bipartite
- Check all components
- O(V + E) time complexity
- Applications in scheduling and matching
