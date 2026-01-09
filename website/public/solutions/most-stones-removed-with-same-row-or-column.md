# Most Stones Removed With Same Row Or Column

## Problem Description

On a 2D plane, we place `n` stones at some integer coordinate points. Each coordinate point may have at most one stone.

A stone can be removed if it shares either the same row or the same column as another stone that has not been removed.

Given an array `stones` of length `n` where `stones[i] = [xi, yi]` represents the location of the `i-th` stone, return the largest possible number of stones that can be removed.

---

## Examples

### Example 1

**Input:**
```python
stones = [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]]
```

**Output:**
```python
5
```

**Explanation:**
One way to remove 5 stones is:

1. Remove stone `[2, 2]` because it shares the same row as `[2, 1]`
2. Remove stone `[2, 1]` because it shares the same column as `[0, 1]`
3. Remove stone `[1, 2]` because it shares the same row as `[1, 0]`
4. Remove stone `[1, 0]` because it shares the same column with `[0, 0]`
5. Remove stone `[0, 1]` because it shares the same row with `[0, 0]`

Stone `[0, 0]` cannot be removed since it does not share a row/column with another stone.

### Example 2

**Input:**
```python
stones = [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]
```

**Output:**
```python
3
```

**Explanation:**
One way to make 3 moves:

1. Remove stone `[2, 2]` because it shares the same row as `[2, 0]`
2. Remove stone `[2, 0]` because it shares the same column with `[0, 0]`
3. Remove stone `[0, 2]` because it shares the same row with `[0, 0]`

Stones `[0, 0]` and `[1, 1]` cannot be removed.

### Example 3

**Input:**
```python
stones = [[0, 0]]
```

**Output:**
```python
0
```

**Explanation:**
`[0, 0]` is the only stone on the plane, so you cannot remove it.

---

## Constraints

- `1 <= stones.length <= 1000`
- `0 <= xi, yi <= 10^4`
- No two stones are at the same coordinate point

---

## Solution

```python
from typing import List

class UnionFind:
    def __init__(self, size: int):
        self.parent = list(range(size))
        self.rank = [0] * size
    
    def find(self, x: int) -> int:
        """Find the root of x with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        """Union two sets by rank."""
        px, py = self.find(x), self.find(y)
        if px != py:
            if self.rank[px] < self.rank[py]:
                self.parent[px] = py
            elif self.rank[px] > self.rank[py]:
                self.parent[py] = px
            else:
                self.parent[py] = px
                self.rank[px] += 1

class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        """
        Find maximum stones that can be removed using Union-Find.
        
        Model as graph where stones are nodes, edges between stones
        in the same row or column.
        """
        n = len(stones)
        uf = UnionFind(n)
        row_map = {}
        col_map = {}
        
        # Union stones that share row or column
        for i, (x, y) in enumerate(stones):
            if x in row_map:
                uf.union(i, row_map[x])
            else:
                row_map[x] = i
            if y in col_map:
                uf.union(i, col_map[y])
            else:
                col_map[y] = i
        
        # Count connected components
        components = set()
        for i in range(n):
            components.add(uf.find(i))
        
        # Maximum removable = total stones - connected components
        return n - len(components)
```

---

## Explanation

This problem involves removing stones that share the same row or column with at least one other stone.

### Algorithm Steps

1. **Model as graph**: Stones are nodes, edges connect stones in the same row or column.

2. **Union-Find**: Connect stones that share row or column.

3. **Count components**: The number of stones that can be removed is:
   - `total stones - connected components`
   - Each component can leave one stone (the "representative")

---

## Complexity Analysis

- **Time Complexity:** O(n α(n)), where n is the number of stones
- **Space Complexity:** O(n), for the union-find structure
