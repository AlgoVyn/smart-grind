# Number Of Provinces

## Problem Description

There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.

A province is a group of directly or indirectly connected cities and no other cities outside of the group.

You are given an n x n matrix `isConnected` where `isConnected[i][j] = 1` if the ith city and the jth city are directly connected, and `isConnected[i][j] = 0` otherwise.

Return the total number of provinces.

## Examples

### Example 1

**Input:**
```python
isConnected = [[1,1,0],[1,1,0],[0,0,1]]
```

**Output:**
```python
2
```

### Example 2

**Input:**
```python
isConnected = [[1,0,0],[0,1,0],[0,0,1]]
```

**Output:**
```python
3
```

## Constraints

- `1 <= n <= 200`
- `n == isConnected.length`
- `n == isConnected[i].length`
- `isConnected[i][j]` is 1 or 0.
- `isConnected[i][i] == 1`
- `isConnected[i][j] == isConnected[j][i]`

## Solution

```python
from typing import List

class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        parent = list(range(n))
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[py] = px
        
        for i in range(n):
            for j in range(i + 1, n):
                if isConnected[i][j] == 1:
                    union(i, j)
        
        return sum(1 for i in range(n) if parent[i] == i)
```

## Explanation

Provinces are groups of directly or indirectly connected cities. We use Union-Find to group connected cities.

### Algorithm Steps

1. Initialize parent array for Union-Find.

2. Define find with path compression and union.

3. Iterate through the upper triangle of the matrix; if cities i and j are connected, union them.

4. Count the number of unique parents (roots).

## Complexity Analysis

- **Time Complexity:** O(n² * α(n)), where α is nearly constant, due to iterating the matrix.
- **Space Complexity:** O(n) for the parent array.
