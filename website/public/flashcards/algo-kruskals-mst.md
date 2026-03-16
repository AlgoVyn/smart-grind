## Kruskal's Minimum Spanning Tree

**Question:** How do you find MST using Kruskal's algorithm?

<!-- front -->

---

## Answer: Union-Find + Sort Edges

### Solution
```python
def kruskal(num_nodes, edges):
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])
    
    parent = list(range(num_nodes))
    rank = [0] * num_nodes
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])  # Path compression
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        
        # Union by rank
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True
    
    mst = []
    for u, v, w in edges:
        if union(u, v):
            mst.append((u, v, w))
            if len(mst) == num_nodes - 1:
                break
    
    return mst
```

### Visual: MST Building
```
Graph:
  1
 / \
2---3

Edges: (1,2,10), (2,3,15), (1,3,20)

Sort: (1,2,10) → (2,3,15) → (1,3,20)

Step 1: Add (1,2,10)
        Sets: {1,2}, {3}
Step 2: Add (2,3,15) 
        Sets: {1,2,3} ← Already connected? No!
Result: [(1,2,10), (2,3,15)]
Total weight: 25
```

### ⚠️ Tricky Parts

#### 1. Why Sort Edges?
```python
# Kruskal's is greedy
# Always pick smallest edge that doesn't create cycle
# Sort ensures we process in order of weight
```

#### 2. Cycle Detection with Union-Find
```python
# If find(u) == find(v):
#   u and v already in same set → adding creates cycle
# If find(u) != find(v):
#   Different sets → can add edge safely

# Path compression speeds up future finds
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]
```

#### 3. Why num_nodes - 1 Edges?
```python
# MST of n nodes has exactly n-1 edges
# If we have n-1 edges and no cycle → must be spanning
# Can stop early when len(mst) == num_nodes - 1
```

### Time & Space Complexity

| Step | Time | Space |
|------|------|-------|
| Sort edges | O(E log E) | O(E) |
| Union-Find | O(E α(V)) ≈ O(E) | O(V) |
| Total | O(E log E) | O(V + E) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting to sort | Always sort by weight |
| Not checking cycle | Use union-find |
| Wrong edge count | Stop at V-1 edges |

<!-- back -->
