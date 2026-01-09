# Parallel Courses

## Problem Description
## Solution

```python
from collections import deque

class Solution:
    def minimumSemesters(self, n: int, relations: List[List[int]]) -> int:
        graph = [[] for _ in range(n)]
        indegree = [0] * n
        for u, v in relations:
            graph[u - 1].append(v - 1)
            indegree[v - 1] += 1
        
        q = deque()
        for i in range(n):
            if indegree[i] == 0:
                q.append(i)
        
        semesters = 0
        taken = 0
        while q:
            size = len(q)
            semesters += 1
            for _ in range(size):
                u = q.popleft()
                taken += 1
                for v in graph[u]:
                    indegree[v] -= 1
                    if indegree[v] == 0:
                        q.append(v)
        
        return semesters if taken == n else -1
```

## Explanation
To find the minimum number of semesters to complete all courses, perform topological sort using BFS, counting the levels (semesters).

Step-by-step approach:
1. Build graph and indegree from relations.
2. Enqueue courses with indegree 0.
3. While queue is not empty, increment semester, process all in current level, decrease indegree of neighbors, enqueue if 0.
4. If all courses taken, return semesters, else -1 (cycle).

Time Complexity: O(n + e), where e is relations.
Space Complexity: O(n + e).
