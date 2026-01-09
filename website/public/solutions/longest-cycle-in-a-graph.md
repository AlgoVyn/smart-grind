# Longest Cycle In A Graph

## Problem Description

You are given a directed graph of `n` nodes numbered from `0` to `n - 1`, where each node has at most one outgoing edge. The graph is represented with a given 0-indexed array `edges` of size `n`, indicating that there is a directed edge from node `i` to node `edges[i]`. If there is no outgoing edge from node `i`, then `edges[i] == -1`.

Return the length of the longest cycle in the graph. If no cycle exists, return `-1`.

A **cycle** is a path that starts and ends at the same node.

---

## Examples

### Example 1

**Input:**
```python
edges = [3, 3, 4, 2, 3]
```

**Output:**
```
3
```

**Explanation:** The longest cycle in the graph is `2 → 4 → 3 → 2`. The length of this cycle is `3`.

### Example 2

**Input:**
```python
edges = [2, -1, 3, 1]
```

**Output:**
```
-1
```

**Explanation:** There are no cycles in this graph.

---

## Constraints

- `n == edges.length`
- `2 <= n <= 10^5`
- `-1 <= edges[i] < n`
- `edges[i] != i`

---

## Solution

```python
from typing import List

class Solution:
    def longestCycle(self, edges: List[int]) -> int:
        n = len(edges)
        state = [0] * n  # 0: not visited, 1: visiting, 2: visited
        step = [-1] * n
        max_len = -1
        
        def dfs(node: int, curr_step: int) -> None:
            nonlocal max_len
            state[node] = 1
            step[node] = curr_step
            nei = edges[node]
            if nei != -1:
                if state[nei] == 0:
                    dfs(nei, curr_step + 1)
                elif state[nei] == 1:
                    cycle_len = curr_step - step[nei] + 1
                    max_len = max(max_len, cycle_len)
            state[node] = 2
        
        for i in range(n):
            if state[i] == 0:
                dfs(i, 0)
        
        return max_len
```

---

## Explanation

We perform DFS on each unvisited node while tracking:

- **`state`**: Visit status (`0` = unvisited, `1` = visiting, `2` = visited)
- **`step`**: The step when a node was first visited

### Key Insight

When we encounter a node that is currently being visited (`state[nei] == 1`), we've found a cycle. The cycle length is calculated as:

```
cycle_len = current_step - step[neighbor] + 1
```

### Algorithm

1. Initialize `state` and `step` arrays for all nodes
2. For each unvisited node, start DFS:
   - Mark node as visiting and record the step
   - Recursively visit the neighbor if unvisited
   - If neighbor is visiting, calculate cycle length and update `max_len`
   - Mark node as visited after exploring
3. Return the maximum cycle length found

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each node and edge is visited exactly once |
| **Space** | `O(n)` — For `state`, `step` arrays and recursion stack |
