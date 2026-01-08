# Longest Cycle In A Graph

## Problem Description
[Link to problem](https://leetcode.com/problems/longest-cycle-in-a-graph/)

You are given a directed graph of n nodes numbered from 0 to n - 1, where each node has at most one outgoing edge.
The graph is represented with a given 0-indexed array edges of size n, indicating that there is a directed edge from node i to node edges[i]. If there is no outgoing edge from node i, then edges[i] == -1.
Return the length of the longest cycle in the graph. If no cycle exists, return -1.
A cycle is a path that starts and ends at the same node.
 
Example 1:


Input: edges = [3,3,4,2,3]
Output: 3
Explanation: The longest cycle in the graph is the cycle: 2 -> 4 -> 3 -> 2.
The length of this cycle is 3, so 3 is returned.

Example 2:


Input: edges = [2,-1,3,1]
Output: -1
Explanation: There are no cycles in this graph.

 
Constraints:

n == edges.length
2 <= n <= 105
-1 <= edges[i] < n
edges[i] != i


## Solution

```python
from typing import List

class Solution:
    def longestCycle(self, edges: List[int]) -> int:
        n = len(edges)
        state = [0] * n  # 0: not visited, 1: visiting, 2: visited
        step = [-1] * n
        max_len = -1
        
        def dfs(node, curr_step):
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

## Explanation
We perform DFS on each unvisited node. Use state to track visiting status and step to record the step when first visited.

When we encounter a node that is already visiting (state 1), we calculate the cycle length using the step difference.

Update the maximum cycle length.

Time complexity: O(n), as each node and edge is visited once.
Space complexity: O(n), for state and step arrays, and recursion stack.
