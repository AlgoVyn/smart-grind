# Find Eventual Safe States

## Problem Description
There is a directed graph of n nodes with each node labeled from 0 to n - 1. The graph is represented by a 0-indexed 2D integer array graph where graph[i] is an integer array of nodes adjacent to node i, meaning there is an edge from node i to each node in graph[i].
A node is a terminal node if there are no outgoing edges. A node is a safe node if every possible path starting from that node leads to a terminal node (or another safe node).
Return an array containing all the safe nodes of the graph. The answer should be sorted in ascending order.
 
Example 1:
Input: graph = [[1,2],[2,3],[5],[0],[5],[],[]]
Output: [2,4,5,6]
Explanation: The given graph is shown above.
Nodes 5 and 6 are terminal nodes as there are no outgoing edges from either of them.
Every path starting at nodes 2, 4, 5, and 6 all lead to either node 5 or 6.
Example 2:

Input: graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]
Output: [4]
Explanation:
Only node 4 is a terminal node, and every path starting at node 4 leads to node 4.

 
Constraints:

n == graph.length
1 <= n <= 104
0 <= graph[i].length <= n
0 <= graph[i][j] <= n - 1
graph[i] is sorted in a strictly increasing order.
The graph may contain self-loops.
The number of edges in the graph will be in the range [1, 4 * 104].
## Solution

```python
from typing import List

class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        state = [0] * n  # 0: not visited, 1: visiting, 2: safe
        
        def dfs(node):
            if state[node] == 1:
                return False  # cycle detected
            if state[node] == 2:
                return True  # already determined safe
            state[node] = 1  # mark as visiting
            for nei in graph[node]:
                if not dfs(nei):
                    return False
            state[node] = 2  # mark as safe
            return True
        
        result = []
        for i in range(n):
            if dfs(i):
                result.append(i)
        return result
```

## Explanation
This problem involves finding nodes in a directed graph from which all paths lead to terminal nodes (nodes with no outgoing edges).

1. **DFS with state tracking:**
   - Use a state array: 0 (not visited), 1 (visiting), 2 (safe).
   - For each node, perform DFS:
     - If visiting (state 1), there's a cycle, not safe.
     - If safe (state 2), it's safe.
     - Mark as visiting, recurse on neighbors.
     - If all neighbors are safe, mark as safe.

2. **Collect safe nodes:**
   - Iterate through all nodes and collect those that are safe after DFS.

3. **Cycle detection:**
   - The visiting state prevents revisiting nodes in the current path, detecting cycles.

**Time Complexity:** O(N + E), where N is the number of nodes and E is the number of edges, as each node and edge is processed once.

**Space Complexity:** O(N), for the state array and recursion stack.
