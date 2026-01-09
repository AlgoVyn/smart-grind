# Detonate The Maximum Bombs

## Problem Description
You are given a list of bombs. The range of a bomb is defined as the area where its effect can be felt. This area is in the shape of a circle with the center as the location of the bomb.
The bombs are represented by a 0-indexed 2D integer array bombs where bombs[i] = [xi, yi, ri]. xi and yi denote the X-coordinate and Y-coordinate of the location of the ith bomb, whereas ri denotes the radius of its range.
You may choose to detonate a single bomb. When a bomb is detonated, it will detonate all bombs that lie in its range. These bombs will further detonate the bombs that lie in their ranges.
Given the list of bombs, return the maximum number of bombs that can be detonated if you are allowed to detonate only one bomb.

---

## Examples

**Example 1:**

**Input:**
```python
bombs = [[2,1,3],[6,1,4]]
```

**Output:**
```python
2
```

**Explanation:**
The above figure shows the positions and ranges of the 2 bombs.
If we detonate the left bomb, the right bomb will not be affected.
But if we detonate the right bomb, both bombs will be detonated.
So the maximum bombs that can be detonated is max(1, 2) = 2.

**Example 2:**

**Input:**
```python
bombs = [[1,1,5],[10,10,5]]
```

**Output:**
```python
1
```

**Explanation:**
Detonating either bomb will not detonate the other bomb, so the maximum number of bombs that can be detonated is 1.

**Example 3:**

**Input:**
```python
bombs = [[1,2,3],[2,3,1],[3,4,2],[4,5,3],[5,6,4]]
```

**Output:**
```python
5
```

**Explanation:**
The best bomb to detonate is bomb 0 because:
- Bomb 0 detonates bombs 1 and 2. The red circle denotes the range of bomb 0.
- Bomb 2 detonates bomb 3. The blue circle denotes the range of bomb 2.
- Bomb 3 detonates bomb 4. The green circle denotes the range of bomb 3.
Thus all 5 bombs are detonated.

---

## Constraints

- `1 <= bombs.length <= 100`
- `bombs[i].length == 3`
- `1 <= xi, yi, ri <= 10^5`

---

## Solution

```python
from typing import List
from collections import defaultdict

class Solution:
    def maximumDetonation(self, bombs: List[List[int]]) -> int:
        n = len(bombs)
        graph = defaultdict(list)
        for i in range(n):
            for j in range(n):
                if i != j:
                    x1, y1, r1 = bombs[i]
                    x2, y2, r2 = bombs[j]
                    if (x1 - x2) ** 2 + (y1 - y2) ** 2 <= r1 ** 2:
                        graph[i].append(j)

        def dfs(node, visited):
            visited.add(node)
            count = 1
            for nei in graph[node]:
                if nei not in visited:
                    count += dfs(nei, visited)
            return count

        max_detonated = 0
        for i in range(n):
            visited = set()
            max_detonated = max(max_detonated, dfs(i, visited))
        return max_detonated
```

---

## Explanation
The solution models the problem as a graph where each bomb is a node, and there's a directed edge from bomb i to bomb j if bomb j is within the range of bomb i.

We build the graph by checking for each pair if the Euclidean distance is <= radius.

Then, for each starting bomb, perform DFS to count the number of reachable bombs, and take the maximum.

**Time Complexity:** O(n^2) for building graph, O(n^2) for DFS in worst case.

**Space Complexity:** O(n^2) for graph.
