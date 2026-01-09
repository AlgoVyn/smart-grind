# Largest Color Value In A Directed Graph

## Problem Description

There is a directed graph of `n` colored nodes and `m` edges.

You are given:
- `colors`: A string where `colors[i]` is the lowercase letter representing the color of node `i` (0-indexed)
- `edges`: A 2D array where `edges[j] = [aj, bj]` represents a directed edge from `aj` to `bj`

A **valid path** is a sequence of nodes `x1 → x2 → x3 → ... → xk` where each consecutive pair has a directed edge.

The **color value** of a path is the count of the most frequently occurring color along that path.

Return the **largest color value** of any valid path, or **`-1`** if the graph contains a cycle.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `colors = "abaca", edges = [[0,1],[0,2],[2,3],[3,4]]` | `3` |

**Explanation:** The path `0 → 2 → 3 → 4` contains 3 nodes with color 'a'.

### Example 2

| Input | Output |
|-------|--------|
| `colors = "a", edges = [[0,0]]` | `-1` |

**Explanation:** There's a cycle from node 0 to itself.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ n ≤ 10^5` | Number of nodes |
| `0 ≤ m ≤ 10^5` | Number of edges |
| `colors` | Lowercase English letters |
| `0 ≤ aj, bj < n` | Valid node indices |

---

## Solution

```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def largestPathValue(self, colors: str, edges: List[List[int]]) -> int:
        n = len(colors)
        graph = defaultdict(list)
        indegree = [0] * n
        
        # Build graph and compute indegrees
        for a, b in edges:
            graph[a].append(b)
            indegree[b] += 1
        
        # Start with nodes having no incoming edges
        q = deque([i for i in range(n) if indegree[i] == 0])
        
        # dp[i][c] = max count of color c in any path ending at node i
        dp = [[0] * 26 for _ in range(n)]
        for i in range(n):
            color_idx = ord(colors[i]) - ord('a')
            dp[i][color_idx] = 1
        
        visited = 0
        while q:
            curr = q.popleft()
            visited += 1
            
            for nei in graph[curr]:
                color_nei = ord(colors[nei]) - ord('a')
                # Update dp for neighbor from current node
                for c in range(26):
                    dp[nei][c] = max(dp[nei][c], dp[curr][c] + (1 if c == color_nei else 0))
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    q.append(nei)
        
        # Check for cycle
        if visited < n:
            return -1
        
        # Find maximum color value across all nodes
        ans = 0
        for i in range(n):
            for c in range(26):
                ans = max(ans, dp[i][c])
        return ans
```

---

## Explanation

We use **topological sort (Kahn's algorithm)** combined with **dynamic programming**:

### Key Insight

`dp[i][c]` represents the maximum count of color `c` in any path ending at node `i`.

### Algorithm Steps

1. **Build graph:** Create adjacency list and compute indegrees
2. **Initialize:** Set `dp[i][colors[i]] = 1` for each node
3. **Topological sort:** Process nodes in topological order (no cycles)
4. **DP update:** For each edge `curr → nei`:
   - For each color `c`: `dp[nei][c] = max(dp[nei][c], dp[curr][c] + (c == colors[nei]))`
5. **Cycle detection:** If `visited < n`, there's a cycle → return `-1`
6. **Result:** Maximum value in dp table

---

## Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | `O(n + m + 26n)` ≈ `O(n + m)` | Each edge/node processed once, 26 colors |
| **Space** | `O(n + m)` | Graph, dp table, indegree array |

---

## Follow-up Challenge

Can you optimize the inner loop to avoid checking all 26 colors?

**Hint:** Use prefix sums or maintain only non-zero color counts per node.
