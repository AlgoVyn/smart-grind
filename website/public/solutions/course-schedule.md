## Course Schedule

### Problem Statement

There are `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you **must** take course `b_i` first if you want to take course `a_i`.

- For example, the pair `[0, 1]` indicates that to take course `0` you have to first take course `1`.

Return `true` if you can finish all courses. Otherwise, return `false` (i.e., if there is a cycle in the prerequisites that prevents completion).

**Input Format:**
- `int numCourses`
- `int[][] prerequisites` (list of pairs)

**Output Format:**
- `boolean`

**Constraints:**
- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= 5000`
- `prerequisites[i].length == 2`
- `0 <= a_i, b_i < numCourses`
- All the pairs `prerequisites[i]` are **unique**.

(Note: Some sources mention higher limits like `numCourses <= 10^5`, but the standard LeetCode constraint is up to 2000 for this problem.)

### Examples

**Example 1:**  
Input: `numCourses = 2`, `prerequisites = [[1,0]]`  
Output: `true`  
Explanation: There are 2 courses. To take course 1, you must finish course 0 first. So, take course 0 then course 1. This is possible.

**Example 2:**  
Input: `numCourses = 2`, `prerequisites = [[1,0],[0,1]]`  
Output: `false`  
Explanation: To take course 1, you need course 0; to take course 0, you need course 1. This forms a cycle, so it's impossible.

**Example 3:**  
Input: `numCourses = 1`, `prerequisites = []`  
Output: `true`  
Explanation: No prerequisites, so the single course can be taken.

### Intuition

This problem can be modeled as a directed graph where each course is a node, and each prerequisite pair `[a, b]` represents a directed edge from `b` to `a` (meaning `b` must be completed before `a`). The question is whether this graph has a cycle. If there's a cycle, it's impossible to finish all courses because it creates a circular dependency. If acyclic, a valid order exists (topological order).

Detecting cycles in a directed graph is key. We can use either Depth-First Search (DFS) to check for back edges or Breadth-First Search (BFS) via topological sorting (Kahn's algorithm), where we count incoming edges (indegrees) and process nodes with zero indegree.

### Multiple Approaches with Code

I'll provide two standard approaches in Python: DFS-based cycle detection and BFS-based topological sort. Both are efficient and commonly used in interviews.

#### Approach 1: DFS (Cycle Detection)
- Build an adjacency list for the graph.
- Use DFS to traverse the graph, tracking visit states: unvisited (0), visiting (1), visited (2).
- If we encounter a node that's being visited (state 1), there's a cycle.
- If we finish processing a node without cycles, mark it visited (2).

Code:
```python
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Build adjacency list
        graph = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            graph[b].append(a)  # b -> a
        
        # Visit states: 0 = unvisited, 1 = visiting, 2 = visited
        visit = [0] * numCourses
        
        def dfs(node: int) -> bool:
            if visit[node] == 1:
                return False  # Cycle detected
            if visit[node] == 2:
                return True  # Already processed
            
            visit[node] = 1  # Mark as visiting
            for neighbor in graph[node]:
                if not dfs(neighbor):
                    return False
            visit[node] = 2  # Mark as visited
            return True
        
        # Check all components
        for i in range(numCourses):
            if not dfs(i):
                return False
        return True
```

#### Approach 2: BFS (Kahn's Algorithm for Topological Sort)
- Build adjacency list and compute indegrees (incoming edges) for each node.
- Use a queue to process nodes with indegree 0 (no prerequisites).
- As we process a node, reduce indegrees of its neighbors.
- If we process all nodes, no cycle; else, cycle exists.

Code:
```python
from typing import List
from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Build adjacency list and indegrees
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)  # b -> a
            indegree[a] += 1
        
        # Queue for nodes with indegree 0
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        processed = 0
        
        while queue:
            node = queue.popleft()
            processed += 1
            for neighbor in graph[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        
        return processed == numCourses
```

### Time/Space Complexity Analysis

For both approaches:
- **Time Complexity:** O(n + m), where n = `numCourses`, m = `prerequisites.length`. We visit each node and edge once.
- **Space Complexity:** O(n + m), for the graph adjacency list, visit arrays/indegrees, and recursion stack (DFS) or queue (BFS). The recursion depth in DFS is O(n) in the worst case (skewed graph).

DFS may have slightly higher space due to recursion stack, but both are acceptable under constraints.

### Related Problems
- [LeetCode 210: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) - Returns the order of courses (topological sort) if possible.
- [LeetCode 269: Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) - Topological sort on characters with word prerequisites.
- [LeetCode 310: Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/) - Uses topological sort ideas for trees.
- General: Any problem involving cycle detection in directed graphs or task scheduling with dependencies.

### Video Tutorial Links
Here are some helpful video explanations:
- [NeetCode: Course Schedule - Graph Adjacency List - Leetcode 207](https://www.youtube.com/watch?v=EgI5nU9etnU) - Visual drawing and coding walkthrough.
- [Joma Tech: Course Schedule (Leetcode 207) | LeetCode Tutorial](https://www.youtube.com/watch?v=0STFfIMah0g) - Clear explanation for beginners.
- [Leetcode 207 - Course Schedule (JAVA, Solution Explain!)](https://www.youtube.com/watch?v=mB3PGwnpM1k) - Java-focused but concepts apply.
- [Course Schedule (LeetCode 207) | Interview Essential | BFS, Queue, Cycle in a directed graph](https://www.youtube.com/watch?v=Oa4Srx9mDqs) - BFS emphasis.
- [Course Schedule || Leetcode 207 || 1 Variant that Big Tech Asks](https://www.youtube.com/watch?v=9lJZt_UXyGw) - Includes variants asked in interviews.
