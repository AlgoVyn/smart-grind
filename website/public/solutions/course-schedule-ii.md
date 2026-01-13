## Course Schedule II

### Problem Statement

There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`.  

- For example, the pair `[0, 1]` indicates that to take course 0, you have to first take course 1.  

Return *the ordering of courses you should take to finish all courses*. If there are many valid answers, return **any** of them. If it is impossible to finish all courses (due to a cycle in prerequisites), return an **empty array**.  

**Input Format:**  
- `int numCourses`: The number of courses.  
- `vector<vector<int>> prerequisites`: A list of prerequisite pairs.  

**Output Format:**  
- `vector<int>`: A valid ordering of courses, or an empty vector if impossible.  

**Constraints:**  
- `1 <= numCourses <= 2000`  
- `0 <= prerequisites.length <= numCourses * (numCourses - 1)`  
- `prerequisites[i].length == 2`  
- `0 <= a_i, b_i < numCourses`  
- `a_i != b_i`  
- All the pairs `[a_i, b_i]` are **distinct**.  

### Examples

**Example 1:**  
Input: `numCourses = 2`, `prerequisites = [[1,0]]`  
Output: `[0,1]`  
Explanation: There are 2 courses. To take course 1, you must finish course 0. One valid order is [0,1].  

**Example 2:**  
Input: `numCourses = 4`, `prerequisites = [[1,0],[2,0],[3,1],[3,2]]`  
Output: `[0,1,2,3]` or `[0,2,1,3]` (any valid topological order)  
Explanation: Course 0 has no prerequisites. Courses 1 and 2 depend on 0. Course 3 depends on both 1 and 2. A cycle would make it impossible, but here it's acyclic.  

**Example 3:**  
Input: `numCourses = 1`, `prerequisites = []`  
Output: `[0]`  
Explanation: A single course with no prerequisites.  

**Example 4 (Impossible Case):**  
Input: `numCourses = 2`, `prerequisites = [[0,1],[1,0]]`  
Output: `[]`  
Explanation: Cycle between 0 and 1 prevents completion.  

### Intuition

This problem models course prerequisites as a **directed graph**, where:  
- Each course is a node (0 to numCourses-1).  
- An edge `b_i -> a_i` means "take b_i before a_i" (b_i is a prerequisite for a_i).  

The task is to find a **topological order** of the graph nodes, which is a linear ordering where for every directed edge u -> v, u comes before v. If the graph has a **cycle**, no topological order exists (impossible to finish all courses), so return an empty array.  

Key Insight:  
- Detect cycles in the directed graph.  
- If acyclic, compute a valid topological sort.  
- Multiple orders may exist; return any.  

This is a classic **topological sorting** problem, solvable via graph traversal techniques like BFS or DFS, with cycle detection built-in.  

### Multiple Approaches with Code

We'll cover two standard approaches:  
1. **BFS (Kahn's Algorithm)**: Uses indegrees (number of incoming edges) to process nodes with no prerequisites first.  
2. **DFS with Cycle Detection**: Recursively visits nodes, tracking visit states to detect cycles, and builds the order in post-order.  

Both are implemented in Python (common for LeetCode), but can be adapted to C++/Java.  

#### Approach 1: BFS (Kahn's Algorithm)

**Steps:**  
1. Build the graph as an adjacency list: `graph[course] = [dependents]`.  
2. Compute indegrees for each course (number of prerequisites).  
3. Initialize a queue with all courses having indegree 0 (no prerequisites).  
4. Process the queue: For each course, add it to the result order, and decrease indegrees of its dependents.  
5. If a dependent's indegree reaches 0, add it to the queue.  
6. If all courses are processed (result size == numCourses), return the order; else, cycle exists, return [].  

**Code (Python):**  
```python
from collections import defaultdict, deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        # Build graph and indegrees
        graph = defaultdict(list)
        indegree = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)  # b -> a (b before a)
            indegree[a] += 1
        
        # Queue for courses with no prerequisites
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        order = []
        
        while queue:
            course = queue.popleft()
            order.append(course)
            for dependent in graph[course]:
                indegree[dependent] -= 1
                if indegree[dependent] == 0:
                    queue.append(dependent)
        
        return order if len(order) == numCourses else []
```

**Time Complexity:** O(numCourses + prerequisites.length) = O(V + E), where V = vertices (courses), E = edges (prerequisites). Each node and edge is processed once.  
**Space Complexity:** O(V + E), for graph and indegree array.  

#### Approach 2: DFS with Cycle Detection

**Steps:**  
1. Build the graph as adjacency list: `graph[course] = [dependents]`.  
2. Use a visit array with 3 states: 0 (unvisited), 1 (visiting/recursion stack), 2 (visited).  
3. For each course, perform DFS:  
   - If visiting (state 1), cycle detected.  
   - If visited (state 2), skip.  
   - Mark as visiting, recurse on dependents, then mark as visited and add to order (post-order).  
4. Reverse the order at the end (since post-order adds in reverse topological order).  
5. If cycle found or not all visited, return [].  

**Code (Python):**  
```python
from collections import defaultdict

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = defaultdict(list)
        for a, b in prerequisites:
            graph[b].append(a)  # b -> a
        
        visit = [0] * numCourses  # 0: unvisited, 1: visiting, 2: visited
        order = []
        cycle = False
        
        def dfs(course):
            nonlocal cycle
            if cycle:
                return
            if visit[course] == 1:
                cycle = True
                return
            if visit[course] == 2:
                return
            visit[course] = 1
            for dependent in graph[course]:
                dfs(dependent)
            visit[course] = 2
            order.append(course)
        
        for i in range(numCourses):
            dfs(i)
            if cycle:
                return []
        
        return order[::-1]  # Reverse to get topological order
```

**Time Complexity:** O(V + E), each node and edge visited once.  
**Space Complexity:** O(V + E), for graph and recursion stack (worst-case O(V)).  

**Comparison of Approaches:**  
- BFS is iterative, good for large graphs (avoids recursion depth issues).  
- DFS is recursive, simpler for cycle detection in some cases.  
- Both are optimal; choose based on preference. BFS often feels more intuitive for ordering.  

### Related Problems

Based on similar themes (topological sort, cycle detection in directed graphs):  
- [LeetCode 207: Course Schedule](https://leetcode.com/problems/course-schedule/) (just check if possible, no order needed). (Cycle detection only, precursor to this problem).  
- [LeetCode 269: Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) (Topological sort on characters from word orders).  
- [LeetCode 444: Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/) (Verify if a sequence is a unique topological order).  
- [LeetCode 1462: Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/) (Queries on prerequisite chains).  
- [LeetCode 1857: Largest Color Value in a Directed Graph](https://leetcode.com/problems/largest-color-value-in-a-directed-graph/) (Topological sort with DP).  
- [LeetCode 1494: Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii/) (Min semesters with parallel courses, bitmask DP variant).  

### Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:  
- [Course Schedule II - Topological Sort - Leetcode 210 (NeetCode)](https://www.youtube.com/watch?v=Akt3glAwyfY) – Detailed drawing and code explanation.  
- [LeetCode 210: Course Schedule II | Topological Sort & Kahn's Algorithm Explained](https://www.youtube.com/watch?v=SSJRZV9qa4M) – Focus on Kahn's algorithm.  
- [Course Schedule II (Topological Sort) - Leetcode 210 - Graphs (Python)](https://www.youtube.com/watch?v=2cpihwDznaw) – Python implementation with graphs.  
- [COURSE SCHEDULE II | LEETCODE # 210 | PYTHON TOPOLOGICAL SORT SOLUTION](https://www.youtube.com/watch?v=6vaSka3rwDQ) – Walkthrough with timestamps.  
- [You're Overthinking Course Schedule II (LeetCode 210)](https://www.youtube.com/watch?v=aF-8Ja-r84o) – DFS focus with cycle detection tips.