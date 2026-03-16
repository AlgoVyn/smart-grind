## Graph Cycle Detection: DFS vs Union-Find

**Question:** How do you detect cycles in directed and undirected graphs?

<!-- front -->

---

## Answer: Different Approaches for Different Graphs

### Directed Graph: DFS with Recursion Stack
```python
def hasCycle(n, edges):
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    visited = [0] * n  # 0=unvisited, 1=visiting, 2=done
    
    def dfs(node):
        if visited[node] == 1:  # Currently in recursion stack
            return True
        if visited[node] == 2:  # Already processed
            return False
        
        visited[node] = 1  # Mark as visiting
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        visited[node] = 2  # Mark as done
        return False
    
    for i in range(n):
        if not visited[i]:
            if dfs(i):
                return True
    return False
```

### Undirected Graph: Union-Find
```python
def hasCycle(n, edges):
    parent = list(range(n))
    rank = [0] * n
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return True  # Cycle detected!
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return False
    
    for u, v in edges:
        if union(u, v):
            return True
    return False
```

### Visual: Cycle Types
```
Directed Cycle:        Undirected Cycle:
                      
1 → 2                  1 ─ 2
↓   ↓                  │   │
3 ← 4                  3 ─ 4

Cycle: 1→2→4→3→1      Cycle: 1-2-4-3-1
```

### ⚠️ Tricky Parts

#### 1. Three States for Directed DFS
```python
# WRONG - only two states
visited = [False] * n  # Can't distinguish!

# CORRECT - three states
visited = [0] * n  # 0=unvisited, 1=visiting, 2=done

# If we see a node in "visiting" state during DFS → cycle!
```

#### 2. Undirected: Check Both Directions
```python
# For undirected, edge (u,v) = (v,u)
# Must handle both directions

# In Union-Find: if u and v already in same set → cycle
# In DFS: need to pass parent to avoid going back
def dfs(node, parent):
    for neighbor in graph[node]:
        if neighbor == parent:
            continue
        if dfs(neighbor, node):
            return True
```

#### 3. Graph Representation
```python
# Edges can be given as:
# - Edge list: [[u,v], [u,v], ...]
# - Adjacency list: [[v1,v2], [v3], ...]
# - Adjacency matrix

# Always convert to what you need!
```

### Comparison

| Aspect | Directed | Undirected |
|--------|----------|------------|
| Method | DFS + 3 states | Union-Find |
| Time | O(V+E) | O(E × α(V)) |
| Space | O(V) | O(V) |

### Cycle Detection in Different Contexts

| Problem | Method | Key Insight |
|---------|--------|--------------|
| Course Schedule | DFS | Detect cycle in prerequisites |
| Friend Circles | Union-Find | Connected components |
| Detect cycle before adding edge | Union-Find | Check before union |

### Topological Sort with Cycle Detection
```python
def canFinish(n, prerequisites):
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in prerequisites:  # u depends on v
        graph[v].append(u)
        in_degree[u] += 1
    
    # Kahn's algorithm - if can't process all → cycle exists
    queue = [i for i in range(n) if in_degree[i] == 0]
    count = 0
    
    while queue:
        node = queue.pop(0)
        count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return count == n  # False if cycle exists
```

<!-- back -->
