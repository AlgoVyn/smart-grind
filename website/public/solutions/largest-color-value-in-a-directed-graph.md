# Largest Color Value In A Directed Graph

## Problem Description
[Link to problem](https://leetcode.com/problems/largest-color-value-in-a-directed-graph/)

There is a directed graph of n colored nodes and m edges. The nodes are numbered from 0 to n - 1.
You are given a string colors where colors[i] is a lowercase English letter representing the color of the ith node in this graph (0-indexed). You are also given a 2D array edges where edges[j] = [aj, bj] indicates that there is a directed edge from node aj to node bj.
A valid path in the graph is a sequence of nodes x1 -> x2 -> x3 -> ... -> xk such that there is a directed edge from xi to xi+1 for every 1 <= i < k. The color value of the path is the number of nodes that are colored the most frequently occurring color along that path.
Return the largest color value of any valid path in the given graph, or -1 if the graph contains a cycle.
 
Example 1:


Input: colors = "abaca", edges = [[0,1],[0,2],[2,3],[3,4]]
Output: 3
Explanation: The path 0 -> 2 -> 3 -> 4 contains 3 nodes that are colored "a" (red in the above image).

Example 2:


Input: colors = "a", edges = [[0,0]]
Output: -1
Explanation: There is a cycle from 0 to 0.

 
Constraints:

n == colors.length
m == edges.length
1 <= n <= 105
0 <= m <= 105
colors consists of lowercase English letters.
0 <= aj, bj < n


## Solution

```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def largestPathValue(self, colors: str, edges: List[List[int]]) -> int:
        n = len(colors)
        graph = defaultdict(list)
        indegree = [0] * n
        for a, b in edges:
            graph[a].append(b)
            indegree[b] += 1
        
        q = deque([i for i in range(n) if indegree[i] == 0])
        
        # dp[i][c] = max count of color c in paths ending at i
        dp = [[0] * 26 for _ in range(n)]
        for i in range(n):
            c = ord(colors[i]) - ord('a')
            dp[i][c] = 1
        
        visited = 0
        while q:
            curr = q.popleft()
            visited += 1
            for nei in graph[curr]:
                # update dp[nei] from curr
                c_nei = ord(colors[nei]) - ord('a')
                for c in range(26):
                    dp[nei][c] = max(dp[nei][c], dp[curr][c] + (1 if c == c_nei else 0))
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    q.append(nei)
        
        if visited < n:
            return -1
        
        ans = 0
        for i in range(n):
            for c in range(26):
                ans = max(ans, dp[i][c])
        return ans
```

## Explanation
We use topological sort to process nodes in order. If there's a cycle (visited < n), return -1.

We maintain a DP table where dp[i][c] is the maximum count of color c in any path ending at node i.

Initialize dp[i][colors[i]] = 1.

For each edge curr -> nei, update dp[nei][c] = max(dp[nei][c], dp[curr][c] + (1 if c == colors[nei] else 0)) for all c.

After processing, the maximum value in dp is the answer.

Time complexity: O(n + m), since each edge and node is processed once, with 26 colors.
Space complexity: O(n), for dp and graph.
