# Optimize Water Distribution In A Village

## Problem Description
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

Step-by-step approach:
1. Create edges list with well costs from virtual node 0 to each house, and pipe costs.
2. Sort all edges by cost.
3. Use Union-Find to add edges without forming cycles, accumulating the cost.
4. Return the total cost.

Time Complexity: O((n + e) log (n + e)), where e is number of pipes, due to sorting and Union-Find.
Space Complexity: O(n + e) for edges and parent array.
