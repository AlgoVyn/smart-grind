# Bridge Finding (Cut Edges)

## Category
Graphs

## Description

A bridge (or cut edge) is an edge whose removal increases the number of connected components. Finding bridges identifies critical connections in networks such as roads, computers, and power grids. The algorithm uses DFS with discovery times and low values to identify these critical edges.

---

## Concepts

### 1. Discovery Time and Low Value

| Value | Meaning |
|-------|---------|
| disc[u] | Discovery time of node u during DFS |
| low[u] | Lowest discovery time reachable from u |

### 2. Bridge Condition

Edge (u,v) is a bridge if: `low[v] > disc[u]`

This means v cannot reach back to u or any ancestor of u through any path except the direct edge.

### 3. DFS Tree

During DFS, edges are classified as:
- Tree edges: discover new nodes
- Back edges: connect to ancestors

---

## Frameworks

### Framework 1: Standard Bridge Finding

```
┌─────────────────────────────────────────────────────────────┐
│  BRIDGE FINDING - TARJAN ALGORITHM                           │
├─────────────────────────────────────────────────────────────┤
│  1. Run DFS from each unvisited node                         │
│                                                              │
│  2. During DFS at node u:                                    │
│     a) Set disc[u] = low[u] = time++                         │
│     b) For each neighbor v:                                 │
│        - If v is unvisited:                                  │
│            * DFS(v)                                           │
│            * low[u] = min(low[u], low[v])                   │
│            * If low[v] > disc[u]: (u,v) is bridge           │
│        - Else if v is not parent:                           │
│            * low[u] = min(low[u], disc[v])                  │
│                                                              │
│  3. Return all bridges found                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Standard Bridge Finding

Find all bridges in undirected graph.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V + E) |
| **Method** | DFS with low values |

### Form 2: Multigraph Support

Handle multiple edges between same vertices.

| Aspect | Details |
|--------|---------|
| **Method** | Track edge IDs |
| **Use** | Skip the edge we came from |

---

## Tactics

### Tactic 1: Standard Bridge Finding

```python
def find_bridges(n, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    bridges = []
    visited = [False] * n
    disc = [0] * n
    low = [0] * n
    parent = [-1] * n
    time = [0]
    
    def dfs(u):
        visited[u] = True
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph[u]:
            if not visited[v]:
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])
                
                if low[v] > disc[u]:
                    bridges.append([u, v])
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])
    
    for i in range(n):
        if not visited[i]:
            dfs(i)
    
    return bridges
```

---

## Python Templates

### Template 1: Standard Bridge Finding

```python
def find_bridges(n, edges):
    """
    Find all bridges in undirected graph.
    
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    bridges = []
    visited = [False] * n
    disc = [0] * n
    low = [0] * n
    parent = [-1] * n
    time = [0]
    
    def dfs(u):
        visited[u] = True
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph[u]:
            if not visited[v]:
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])
                
                if low[v] > disc[u]:
                    bridges.append([u, v])
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])
    
    for i in range(n):
        if not visited[i]:
            dfs(i)
    
    return bridges
```

---

## Practice Problems

### Problem 1: Critical Connections
**Problem:** [LeetCode 1192](https://leetcode.com/problems/critical-connections-in-a-network/)

---

## Summary

Bridge finding:
- Use DFS with discovery times
- Bridge if low[v] > disc[u]
- O(V + E) time complexity
- For undirected graphs only
