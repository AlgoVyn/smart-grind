# Parallel Courses

## Problem Description

You are given an integer `n`, which indicates that there are `n` courses labeled from `1` to `n`. You are also given an array `relations` where `relations[i] = [prevCoursei, nextCoursei]`, representing a prerequisite relationship between course `prevCoursei` and course `nextCoursei`: course `prevCoursei` has to be taken before course `nextCoursei`.

Return the minimum number of semesters needed to take all courses. If it is impossible to take all courses, return `-1`.

### Example 1

**Input:** `n = 3`, `relations = [[1,3],[2,3]]`  
**Output:** `2`

**Explanation:** 
- In the first semester, you can take courses 1 and 2 (both have no prerequisites).
- In the second semester, you can take course 3 (prerequisites 1 and 2 are completed).

### Example 2

**Input:** `n = 3`, `relations = [[1,2],[2,3],[3,1]]`  
**Output:** `-1`

**Explanation:** There is a cycle in the course prerequisites, so it's impossible to complete all courses.

### Constraints

- `1 <= n <= 100`
- `0 <= relations.length <= n * (n-1) / 2`
- `relations[i].length == 2`
- `1 <= prevCoursei, nextCoursei <= n`
- `prevCoursei != nextCoursei`

---

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

---

## Explanation

To find the minimum number of semesters to complete all courses, perform topological sort using BFS, counting the levels (semesters).

### Step-by-step Approach

1. Build graph and indegree from relations.
2. Enqueue courses with indegree 0.
3. While queue is not empty, increment semester, process all in current level, decrease indegree of neighbors, enqueue if 0.
4. If all courses taken, return semesters, else -1 (cycle).

### Complexity Analysis

- **Time Complexity:** O(n + e), where e is relations.
- **Space Complexity:** O(n + e).
