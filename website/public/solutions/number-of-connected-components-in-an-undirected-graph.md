# Number Of Connected Components In An Undirected Graph

## Problem Description
[Link to problem](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

## Solution

```python
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        rank = [0] * n
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                if rank[px] > rank[py]:
                    parent[py] = px
                elif rank[px] < rank[py]:
                    parent[px] = py
                else:
                    parent[py] = px
                    rank[px] += 1
        
        for u, v in edges:
            union(u, v)
        
        return sum(1 for i in range(n) if parent[i] == i)
```

## Explanation
To find the number of connected components in an undirected graph, we use the Union-Find (Disjoint Set Union) data structure.

Step-by-step approach:
1. Initialize parent array where each node is its own parent, and rank array for union by rank.
2. Define find function with path compression to get the root of a node.
3. Define union function to merge two components by rank.
4. Iterate through each edge and union the two nodes.
5. Count the number of nodes where parent[i] == i, which are the roots of components.

Time Complexity: O(n + e * α(n)), where α is the inverse Ackermann function (nearly constant), making it almost linear.
Space Complexity: O(n) for parent and rank arrays.
