# Prim's Algorithm

## Category
Graphs

## Description
Find minimum spanning tree by growing tree from a starting vertex.

## Algorithm Explanation
Prim's algorithm finds the Minimum Spanning Tree (MST) of a weighted undirected graph. An MST connects all vertices with the minimum total edge weight, without forming cycles.

**Greedy Approach:**
1. **Start from any vertex**: Begin with an arbitrary starting vertex
2. **Maintain a set of included vertices**: Track which vertices are already in MST
3. **Select minimum weight edge**: At each step, pick the edge with minimum weight that connects a vertex in the MST to a vertex outside it
4. **Repeat**: Continue until all vertices are included

**Implementation using Min-Heap:**
- Use a priority queue (min-heap) to efficiently get the minimum weight edge
- For each vertex added to MST, push all its adjacent edges into the heap
- Skip edges that lead to already-visited vertices

**Why greedy works:**
- The cut property: For any cut of the graph, the minimum weight edge crossing that cut is in some MST
- By always picking the minimum edge crossing the cut (visited vs unvisited), we build a valid MST

**Time Complexity:**
- With adjacency list + min-heap: O(E log V)
- With Fibonacci heap: O(E + V log V)

**Space Complexity:** O(V + E) for storing graph and visited set

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

## Implementation

```python
import heapq
from collections import defaultdict

def prim_mst(n, edges):
    """
    Find MST using Prim's algorithm with min-heap.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of edges as [u, v, weight]
    
    Returns:
        Total weight of MST, or -1 if graph is disconnected
    
    Time: O(E log V)
    Space: O(V + E)
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    # Min-heap: (weight, destination_vertex)
    min_heap = [(0, 0)]  # Start from vertex 0
    visited = [False] * n
    total_weight = 0
    edges_in_mst = 0
    
    while min_heap and edges_in_mst < n:
        weight, u = heapq.heappop(min_heap)
        
        # Skip if already visited
        if visited[u]:
            continue
        
        # Include this vertex
        visited[u] = True
        total_weight += weight
        edges_in_mst += 1
        
        # Add all adjacent edges to heap
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v))
    
    # Check if all vertices were reached
    if edges_in_mst == n:
        return total_weight
    return -1  # Graph is disconnected


# Return MST edges as well
def prim_mst_edges(n, edges):
    """Return MST with actual edges included."""
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    min_heap = [(0, 0, -1)]  # (weight, vertex, parent)
    visited = [False] * n
    mst_edges = []
    total_weight = 0
    
    while min_heap:
        weight, u, parent = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
        
        visited[u] = True
        total_weight += weight
        
        if parent != -1:
            mst_edges.append((parent, u, weight))
        
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v, u))
    
    if len(mst_edges) == n - 1:
        return total_weight, mst_edges
    return -1, []
```

```javascript
function primMST(n, edges) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
        graph[u].push([v, w]);
        graph[v].push([u, w]);
    }
    
    const visited = new Array(n).fill(false);
    const minHeap = [[0, 0, -1]]; // [weight, vertex, parent]
    let totalWeight = 0;
    let edgesInMST = 0;
    
    while (minHeap.length > 0 && edgesInMST < n) {
        const [weight, u, parent] = minHeap.pop();
        
        if (visited[u]) continue;
        visited[u] = true;
        totalWeight += weight;
        edgesInMST++;
        
        for (const [v, w] of graph[u]) {
            if (!visited[v]) {
                minHeap.push([w, v, u]);
            }
        }
        
        // Min-heap property
        minHeap.sort((a, b) => b[0] - a[0]);
    }
    
    return edgesInMST === n ? totalWeight : -1;
}
```

---

## Example

**Input:**
```
n = 4
edges = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]
```

**Output:**
```
19
```

**Explanation:**
- Start at 0: add edge (0,3) weight 5
- From 0,3: add edge (3,2) weight 4 (now 0-3-2)
- From 0,3,2: add edge (0,1) weight 10 (skip 1-3 weight 15)
- Total: 5 + 4 + 10 = 19

**MST Edges:**
```
(0, 3, 5), (2, 3, 4), (0, 1, 10)
```

**Input - Disconnected graph:**
```
n = 3
edges = [[0, 1, 1], [2, 1, 1]]
```

**Output:**
```
-1
```

**Explanation:** Graph is disconnected (vertex 0 can't reach vertex 2)

**Input:**
```
n = 5
edges = [[0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], [1, 4, 5], [2, 4, 7], [3, 4, 9]]
```

**Output:**
```
16
```

**Explanation:** MST edges: (0,1)=2, (1,2)=3, (1,4)=5, (0,3)=6

---

## Time Complexity
**O(E log V)**

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
