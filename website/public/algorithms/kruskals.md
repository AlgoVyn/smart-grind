# Kruskal's Algorithm

## Category
Graphs

## Description
Find minimum spanning tree by sorting edges and using union-find.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- graphs related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

Kruskal's Algorithm finds the Minimum Spanning Tree (MST) of a weighted undirected graph. A spanning tree connects all vertices with minimum total edge weight.

**Key Idea:** Greedily add edges in increasing order of weight, skipping edges that would create a cycle.

**Why Greedy Works:**
- Adding the smallest edge that doesn't create a cycle is always safe
- This is proven by the cut property: for any cut in the graph, the minimum weight edge crossing the cut belongs to some MST

**Algorithm Steps:**
1. Sort all edges by weight (ascending)
2. Initialize Union-Find (Disjoint Set Union) data structure
3. For each edge in sorted order:
   - If vertices are in different components (no cycle), add edge to MST
   - Otherwise, skip (it would create a cycle)
4. Stop when MST has V-1 edges (V = number of vertices)

**Union-Find Operations:**
- `find(x)`: Find root/leader of the set containing x
- `union(x, y)`: Merge sets containing x and y
- Path compression and union by rank optimize to nearly O(1)

**Time Complexity:** O(E log E) or O(E log V)
**Space Complexity:** O(V) for Union-Find

---

## Implementation

```python
class UnionFind:
    """Union-Find (Disjoint Set Union) with path compression and union by rank."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return False  # Already in same set
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True


def kruskal_mst(n, edges):
    """
    Find Minimum Spanning Tree using Kruskal's algorithm.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of tuples (weight, u, v)
        
    Returns:
        Total weight of MST, or -1 if graph is disconnected
        
    Time: O(E log E)
    Space: O(V)
    """
    # Sort edges by weight
    edges.sort()
    
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            
            # MST is complete
            if edges_used == n - 1:
                break
    
    # Check if graph is connected
    if edges_used != n - 1:
        return -1  # Graph is disconnected
    
    return mst_weight


def kruskal_mst_edges(n, edges):
    """Return the actual edges in the MST."""
    edges.sort()
    uf = UnionFind(n)
    mst_edges = []
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            if len(mst_edges) == n - 1:
                break
    
    return mst_edges if len(mst_edges) == n - 1 else None
```

```javascript
function kruskals() {
    // Kruskal's Algorithm implementation
    // Time: O(E log E)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
n = 4
edges = [(1, 0, 1), (3, 0, 2), (2, 1, 2), (4, 2, 3)]
```

**Output:**
```
MST Weight: 6
MST Edges: [(0, 1, 1), (1, 2, 2), (2, 3, 4)]
```

**Explanation:**
- Vertices: 0, 1, 2, 3
- Edges sorted by weight: (1,0,1), (2,1,2), (3,0,2), (4,2,3)
- Pick (0,1) weight 1: union(0,1) - add to MST
- Pick (1,2) weight 2: union(1,2) - add to MST (0,1,2 connected)
- Pick (0,2) weight 3: find(0) = find(2) - skip (would create cycle)
- Pick (2,3) weight 4: union(2,3) - add to MST (all 4 vertices connected)

Total weight: 1 + 2 + 4 = 6

**Additional Example:**
```
n = 3
edges = [(1, 0, 1), (2, 1, 2), (3, 0, 2)]
Output: 3
MST: [(0, 1, 1), (1, 2, 2)]
```

---

## Time Complexity
**O(E log E)**

---

## Space Complexity
**O(V)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
