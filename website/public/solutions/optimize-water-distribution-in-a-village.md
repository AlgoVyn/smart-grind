# Optimize Water Distribution In A Village

## Problem Description

There are `n` houses in a village. Some houses have wells, and some houses have pipes connecting them to the water distribution system. We need to supply water to all houses with minimum cost.

Each house can be connected either to its own well (with a certain cost) or to another house that has water (via pipes). We need to find the minimum total cost to supply water to all houses.

### Example

**Input:** `n = 3`, `wells = [1,2,2]`, `pipes = [[1,2,1],[2,3,1]]`  
**Output:** `3`

**Explanation:** 
- Connect house 1 to its well (cost 1)
- Connect house 2 to house 1 via pipe (cost 1)
- Connect house 3 to house 2 via pipe (cost 1)
- Total cost = 3

### Constraints

- `1 <= n <= 10^4`
- `wells.length == n`
- `1 <= wells[i] <= 10^6`
- `1 <= pipes.length <= 10^4`
- `1 <= pipes[i][0], pipes[i][1] <= n`
- `1 <= pipes[i][2] <= 10^6`

## Solution

```python
class Solution:
    def minCostToSupplyWater(self, n: int, wells: List[int], pipes: List[List[int]]) -> int:
        edges = []
        for i, cost in enumerate(wells):
            edges.append((cost, 0, i + 1))  # virtual node 0 to house i+1
        for u, v, cost in pipes:
            edges.append((cost, u, v))
        edges.sort()
        
        parent = list(range(n + 1))
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[py] = px
                return True
            return False
        
        total = 0
        for cost, u, v in edges:
            if union(u, v):
                total += cost
        return total
```

## Explanation

To minimize the cost of supplying water, we model it as a graph where houses are nodes, and we add a virtual node connected to all houses with well costs. We then use Kruskal's algorithm to find the MST.

### Step-by-step Approach

1. Create edges list with well costs from virtual node 0 to each house, and pipe costs.
2. Sort all edges by cost.
3. Use Union-Find to add edges without forming cycles, accumulating the cost.
4. Return the total cost.

### Complexity Analysis

- **Time Complexity:** O((n + e) log (n + e)), where e is number of pipes, due to sorting and Union-Find.
- **Space Complexity:** O(n + e) for edges and parent array.
