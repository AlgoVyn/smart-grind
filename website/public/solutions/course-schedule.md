# Course Schedule

## Problem Description
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.

---

## Examples

**Example 1:**

**Input:**
```python
numCourses = 2, prerequisites = [[1,0]]
```

**Output:**
```python
true
```

**Explanation:** There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.

**Example 2:**

**Input:**
```python
numCourses = 2, prerequisites = [[1,0],[0,1]]
```

**Output:**
```python
false
```

**Explanation:** There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.

---

## Constraints

- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= 5000`
- `prerequisites[i].length == 2`
- `0 <= ai, bi < numCourses`
- All the pairs prerequisites[i] are unique.

---

## Solution

```python
from typing import List
from collections import deque, defaultdict

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = defaultdict(list)
        indegree = [0] * numCourses
        
        for a, b in prerequisites:
            graph[b].append(a)
            indegree[a] += 1
        
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        count = 0
        
        while queue:
            course = queue.popleft()
            count += 1
            for nei in graph[course]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)
        
        return count == numCourses
```

---

## Explanation
This is a cycle detection problem in a directed graph. Use topological sort with Kahn's algorithm.

1. Build the graph where b -> a (b is prerequisite for a), and compute indegrees.
2. Start with courses having indegree 0 (no prerequisites).
3. Process each course, reduce indegree of dependents, and enqueue if indegree becomes 0.
4. If all courses are processed (count == numCourses), no cycle; otherwise, cycle exists.

---

## Time Complexity
**O(V + E)**, where V is numCourses and E is prerequisites.

---

## Space Complexity
**O(V + E)**, for graph and indegree.
