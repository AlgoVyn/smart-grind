# Minimum Spanning Tree (Kruskal / Prim / DSU + heap)

## Overview

A Minimum Spanning Tree (MST) connects all vertices in a weighted undirected graph with minimum total edge weight and no cycles. Kruskal's algorithm sorts edges and adds them if they don't form cycles. Prim's algorithm grows the tree from a starting vertex using a priority queue.

Use this pattern when you need to:
- Connect all nodes with minimum total cost
- Find optimal network designs
- Solve clustering or grouping problems
- Minimize connection costs in graphs

Benefits include:
- Guarantees minimum total weight
- No cycles in the result
- Efficient algorithms for different graph types
- Applicable to network design problems

## Key Concepts

- **Kruskal**: Sort edges, add if no cycle (using DSU)
- **Prim**: Start from node, add cheapest edge to tree
- **MST Properties**: Connects all nodes, minimum weight, acyclic
- **Cycle Prevention**: DSU for Kruskal, visited set for Prim
- **Greedy Choice**: Always add minimum available edge

## Template

```python
# Kruskal's Algorithm with DSU
class UnionFind:
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            if self.rank[root_x] > self.rank[root_y]:
                self.parent[root_y] = root_x
            elif self.rank[root_x] < self.rank[root_y]:
                self.parent[root_x] = root_y
            else:
                self.parent[root_y] = root_x
                self.rank[root_x] += 1
            return True
        return False

def kruskal_mst(edges, n):
    # edges: list of (weight, u, v)
    edges.sort()  # Sort by weight
    uf = UnionFind(n)
    mst = []
    total_weight = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
    
    return mst, total_weight

# Prim's Algorithm with Priority Queue
import heapq

def prim_mst(graph, n, start=0):
    # graph: adj list [(neighbor, weight), ...]
    visited = [False] * n
    min_heap = [(0, start, -1)]  # (weight, node, parent)
    mst = []
    total_weight = 0
    
    while min_heap:
        weight, node, parent = heapq.heappop(min_heap)
        
        if visited[node]:
            continue
        
        visited[node] = True
        total_weight += weight
        
        if parent != -1:
            mst.append((parent, node, weight))
        
        # Add neighbors to heap
        for neighbor, edge_weight in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(min_heap, (edge_weight, neighbor, node))
    
    return mst, total_weight

# Alternative Prim with dense graph optimization
def prim_dense(graph, n):
    # For dense graphs, use array instead of heap
    visited = [False] * n
    min_edge = [float('inf')] * n
    min_edge[0] = 0
    mst = []
    total_weight = 0
    
    for _ in range(n):
        # Find unvisited node with minimum edge
        min_val = float('inf')
        u = -1
        for i in range(n):
            if not visited[i] and min_edge[i] < min_val:
                min_val = min_edge[i]
                u = i
        
        if u == -1:
            break
        
        visited[u] = True
        total_weight += min_val
        
        # Update neighbors
        for v in range(n):
            if graph[u][v] != 0 and not visited[v] and graph[u][v] < min_edge[v]:
                min_edge[v] = graph[u][v]
                # Track parent for MST edges
    
    return total_weight
```

## Example Problems

1. **Min Cost to Connect All Points (LeetCode 1584)**: Connect points with minimum cost.
2. **Connecting Cities With Minimum Cost (LeetCode 1135)**: Similar to MST.
3. **Optimize Water Distribution (LeetCode 1168)**: Minimum cost to supply water.

## Time and Space Complexity

- **Kruskal**: O(E log E) for sorting, O(E α(V)) for DSU.
- **Prim**: O((V + E) log V) with binary heap.
- **Space**: O(V + E) for graph storage.

## Common Pitfalls

- In Kruskal, not sorting edges first
- Forgetting to check for cycles in Kruskal
- In Prim, not marking nodes as visited when dequeued
- Assuming graphs are connected (MST may not exist)
- Using wrong graph representation (adj matrix vs list)