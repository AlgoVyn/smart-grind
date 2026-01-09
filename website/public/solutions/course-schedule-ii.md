# Course Schedule II

## Problem Description
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.

## Examples

**Example 1:**

**Input:**
```python
numCourses = 2, prerequisites = [[1,0]]
```

**Output:**
```python
[0,1]
```

**Explanation:** There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].

**Example 2:**

**Input:**
```python
numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
```

**Output:**
```python
[0,2,1,3]
```

**Explanation:** There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.
So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].

**Example 3:**

**Input:**
```python
numCourses = 1, prerequisites = []
```

**Output:**
```python
[0]
```

## Constraints

- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= numCourses * (numCourses - 1)`
- `prerequisites[i].length == 2`
- `0 <= ai, bi < numCourses`
- `ai != bi`
- All the pairs [ai, bi] are distinct.

## Solution

```python
from typing import List
from collections import deque, defaultdict

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = defaultdict(list)
        indegree = [0] * numCourses
        
        for a, b in prerequisites:
            graph[b].append(a)
            indegree[a] += 1
        
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        order = []
        
        while queue:
            course = queue.popleft()
            order.append(course)
            for nei in graph[course]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)
        
        return order if len(order) == numCourses else []
```

## Explanation
This problem requires finding a valid order to take courses given prerequisites, which is a topological sort. If there's a cycle, it's impossible.

1. Build a graph where an edge b -> a means b is a prerequisite for a, and compute indegrees for each course.
2. Use a queue to process courses with indegree 0 (no prerequisites).
3. For each processed course, reduce the indegree of its neighbors (courses that depend on it). If a neighbor's indegree becomes 0, add it to the queue.
4. Collect the order of processed courses. If all courses are processed, return the order; otherwise, return an empty list indicating a cycle.

## Time Complexity
**O(V + E)**, where V is numCourses and E is the number of prerequisites.

## Space Complexity
**O(V + E)**, for the graph and indegree array.
