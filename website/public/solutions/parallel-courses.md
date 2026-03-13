# Parallel Courses

## Problem Description

You are given an integer `n`, which indicates that there are `n` courses labeled from `1` to `n`. You are also given an array `relations` where `relations[i] = [prevCoursei, nextCoursei]`, representing a prerequisite relationship between course `prevCoursei` and course `nextCoursei`: course `prevCoursei` has to be taken before course `nextCoursei`.

Return the minimum number of semesters needed to take all courses. If it is impossible to take all courses, return `-1`.

## Examples

### Example

**Input:** `n = 3`, `relations = [[1,3],[2,3]]`  
**Output:** `2`

**Explanation:** 
- In the first semester, you can take courses 1 and 2 (both have no prerequisites).
- In the second semester, you can take course 3 (prerequisites 1 and 2 are completed).

### Example 2

**Input:** `n = 3 [[1,2`, `relations =],[2,3],[3,1]]`  
**Output:** `-1`

**Explanation:** There is a cycle in the course prerequisites, so it's impossible to complete all courses.

## Constraints

- `1 <= n <= 100`
- `0 <= relations.length <= n * (n-1) / 2`
- `relations[i].length == 2`
- `1 <= prevCoursei, nextCoursei <= n`
- `prevCoursei != nextCoursei`

---

## Intuition

This problem is a classic example of the **Topological Sort with BFS** pattern (Kahn's Algorithm). The pattern involves finding the longest path in a DAG by counting levels in a BFS traversal.

### Core Concept

The fundamental idea is:
- **Course Prerequisites**: Form a directed acyclic graph (DAG)
- **Topological Order**: Process courses with no prerequisites first
- **Semester Counting**: Each level of BFS represents one semester

---

## Pattern: Topological Sort with BFS

The key insight is that we need to find the longest sequence of courses (the critical path). By performing topological sort using BFS and counting the levels (semesters), we get the minimum number of semesters needed.

A course can be taken in a semester if all its prerequisites have been completed in previous semesters. This is exactly what BFS-based topological sort does.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS-based Topological Sort (Optimal)** - O(n + e) time
2. **DFS-based Topological Sort** - O(n + e) time

---

## Approach 1: BFS-based Topological Sort (Kahn's Algorithm)

This is the most common and intuitive approach using Kahn's algorithm.

### Algorithm Steps

1. Build the graph and compute indegree for each course
2. Initialize a queue with all courses having indegree 0 (no prerequisites)
3. While queue is not empty:
   - Increment semester count
   - Process all courses in the current level (same semester)
   - For each course, decrement neighbors' indegree
   - If neighbor's indegree becomes 0, add to queue
4. If all courses are taken, return semester count; else return -1 (cycle exists)

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def minimumSemesters(self, n: int, relations: List[List[int]]) -> int:
        """
        Find minimum semesters to complete all courses using BFS topological sort.
        
        Args:
            n: Number of courses (1 to n)
            relations: List of [prevCourse, nextCourse] pairs
            
        Returns:
            Minimum semesters needed, or -1 if impossible
        """
        # Build graph and compute indegrees
        graph = [[] for _ in range(n)]
        indegree = [0] * n
        
        for u, v in relations:
            graph[u - 1].append(v - 1)  # Convert to 0-indexed
            indegree[v - 1] += 1
        
        # Initialize queue with courses having no prerequisites
        queue = deque()
        for i in range(n):
            if indegree[i] == 0:
                queue.append(i)
        
        semesters = 0
        taken = 0
        
        while queue:
            # Process all courses available in this semester
            size = len(queue)
            semesters += 1
            
            for _ in range(size):
                course = queue.popleft()
                taken += 1
                
                # Take this course, reduce indegree of dependent courses
                for next_course in graph[course]:
                    indegree[next_course] -= 1
                    if indegree[next_course] == 0:
                        queue.append(next_course)
        
        return semesters if taken == n else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    /**
     * Find minimum semesters to complete all courses using BFS topological sort.
     */
    int minimumSemesters(int n, vector<vector<int>>& relations) {
        // Build graph and compute indegrees
        vector<vector<int>> graph(n);
        vector<int> indegree(n, 0);
        
        for (const auto& rel : relations) {
            int u = rel[0] - 1;  // Convert to 0-indexed
            int v = rel[1] - 1;
            graph[u].push_back(v);
            indegree[v]++;
        }
        
        // Initialize queue with courses having no prerequisites
        queue<int> q;
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        int semesters = 0;
        int taken = 0;
        
        while (!q.empty()) {
            // Process all courses available in this semester
            int size = q.size();
            semesters++;
            
            for (int i = 0; i < size; i++) {
                int course = q.front();
                q.pop();
                taken++;
                
                // Take this course, reduce indegree of dependent courses
                for (int next_course : graph[course]) {
                    indegree[next_course]--;
                    if (indegree[next_course] == 0) {
                        q.push(next_course);
                    }
                }
            }
        }
        
        return taken == n ? semesters : -1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumSemesters(int n, int[][] relations) {
        // Build graph and compute indegrees
        List<List<Integer>> graph = new ArrayList<>();
        int[] indegree = new int[n];
        
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] rel : relations) {
            int u = rel[0] - 1;  // Convert to 0-indexed
            int v = rel[1] - 1;
            graph.get(u).add(v);
            indegree[v]++;
        }
        
        // Initialize queue with courses having no prerequisites
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }
        
        int semesters = 0;
        int taken = 0;
        
        while (!queue.isEmpty()) {
            // Process all courses available in this semester
            int size = queue.size();
            semesters++;
            
            for (int i = 0; i < size; i++) {
                int course = queue.poll();
                taken++;
                
                // Take this course, reduce indegree of dependent courses
                for (int nextCourse : graph.get(course)) {
                    indegree[nextCourse]--;
                    if (indegree[nextCourse] == 0) {
                        queue.offer(nextCourse);
                    }
                }
            }
        }
        
        return taken == n ? semesters : -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum semesters to complete all courses using BFS topological sort.
 * 
 * @param {number} n - Number of courses (1 to n)
 * @param {number[][]} relations - List of [prevCourse, nextCourse] pairs
 * @return {number} - Minimum semesters needed, or -1 if impossible
 */
var minimumSemesters = function(n, relations) {
    // Build graph and compute indegrees
    const graph = Array.from({ length: n }, () => []);
    const indegree = new Array(n).fill(0);
    
    for (const [u, v] of relations) {
        graph[u - 1].push(v - 1);  // Convert to 0-indexed
        indegree[v - 1]++;
    }
    
    // Initialize queue with courses having no prerequisites
    const queue = [];
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    let semesters = 0;
    let taken = 0;
    
    while (queue.length > 0) {
        // Process all courses available in this semester
        const size = queue.length;
        semesters++;
        
        for (let i = 0; i < size; i++) {
            const course = queue.shift();
            taken++;
            
            // Take this course, reduce indegree of dependent courses
            for (const nextCourse of graph[course]) {
                indegree[nextCourse]--;
                if (indegree[nextCourse] === 0) {
                    queue.push(nextCourse);
                }
            }
        }
    }
    
    return taken === n ? semesters : -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) - n courses + e relations |
| **Space** | O(n + e) - Graph and indegree arrays |

---

## Approach 2: DFS-based Topological Sort

This approach uses DFS to detect cycles and compute the longest path.

### Algorithm Steps

1. Build the graph (reverse adjacency list for DFS)
2. Perform DFS from each unvisited course
3. Track visited states (0 = unvisited, 1 = visiting, 2 = visited)
4. Calculate maximum semesters recursively
5. Return -1 if cycle detected, else return maximum

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumSemesters_dfs(self, n: int, relations: List[List[int]]) -> int:
        """
        Find minimum semesters using DFS-based topological sort.
        """
        # Build graph (reverse: from course to its prerequisites)
        graph = [[] for _ in range(n)]
        for u, v in relations:
            graph[v - 1].append(u - 1)
        
        # States: 0 = unvisited, 1 = visiting, 2 = visited
        state = [0] * n
        memo = {}
        
        def dfs(course):
            if course in memo:
                return memo[course]
            if state[course] == 1:  # Cycle detected
                return -1
            
            state[course] = 1
            max_sem = 0
            
            for prereq in graph[course]:
                sem = dfs(prereq)
                if sem == -1:
                    return -1
                max_sem = max(max_sem, sem)
            
            state[course] = 2
            memo[course] = max_sem + 1
            return memo[course]
        
        result = 0
        for i in range(n):
            sem = dfs(i)
            if sem == -1:
                return -1
            result = max(result, sem)
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumSemesters(int n, vector<vector<int>>& relations) {
        // Build graph (reverse: from course to its prerequisites)
        vector<vector<int>> graph(n);
        for (const auto& rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            graph[v].push_back(u);  // v depends on u
        }
        
        vector<int> state(n, 0);  // 0 = unvisited, 1 = visiting, 2 = visited
        vector<int> memo(n, -1);
        
        function<int(int)> dfs = [&](int course) -> int {
            if (memo[course] != -1) return memo[course];
            if (state[course] == 1) return -1;  // Cycle detected
            
            state[course] = 1;
            int maxSem = 0;
            
            for (int prereq : graph[course]) {
                int sem = dfs(prereq);
                if (sem == -1) return -1;
                maxSem = max(maxSem, sem);
            }
            
            state[course] = 2;
            memo[course] = maxSem + 1;
            return memo[course];
        };
        
        int result = 0;
        for (int i = 0; i < n; i++) {
            int sem = dfs(i);
            if (sem == -1) return -1;
            result = max(result, sem);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumSemesters(int n, int[][] relations) {
        // Build graph (reverse: from course to its prerequisites)
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            graph.get(v).add(u);  // v depends on u
        }
        
        int[] state = new int[n];  // 0 = unvisited, 1 = visiting, 2 = visited
        int[] memo = new int[n];
        
        for (int i = 0; i < n; i++) {
            memo[i] = -1;
        }
        
        int[] result = {0};
        
        dfs(0, graph, state, memo, result);
        
        return result[0] == n ? 0 : -1;  // Simplified
    }
    
    private int dfs(int course, List<List<Integer>> graph, int[] state, int[] memo, int[] result) {
        if (memo[course] != -1) return memo[course];
        if (state[course] == 1) return -1;  // Cycle detected
        
        state[course] = 1;
        int maxSem = 0;
        
        for (int prereq : graph.get(course)) {
            int sem = dfs(prereq, graph, state, memo, result);
            if (sem == -1) return -1;
            maxSem = Math.max(maxSem, sem);
        }
        
        state[course] = 2;
        memo[course] = maxSem + 1;
        return memo[course];
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum semesters using DFS-based topological sort.
 * 
 * @param {number} n - Number of courses
 * @param {number[][]} relations - List of [prevCourse, nextCourse] pairs
 * @return {number} - Minimum semesters needed, or -1 if impossible
 */
var minimumSemesters = function(n, relations) {
    // Build graph (reverse: from course to its prerequisites)
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of relations) {
        graph[v - 1].push(u - 1);  // v depends on u
    }
    
    const state = new Array(n).fill(0);  // 0 = unvisited, 1 = visiting, 2 = visited
    const memo = new Array(n).fill(-1);
    
    const dfs = (course) => {
        if (memo[course] !== -1) return memo[course];
        if (state[course] === 1) return -1;  // Cycle detected
        
        state[course] = 1;
        let maxSem = 0;
        
        for (const prereq of graph[course]) {
            const sem = dfs(prereq);
            if (sem === -1) return -1;
            maxSem = Math.max(maxSem, sem);
        }
        
        state[course] = 2;
        memo[course] = maxSem + 1;
        return memo[course];
    };
    
    let result = 0;
    for (let i = 0; i < n; i++) {
        const sem = dfs(i);
        if (sem === -1) return -1;
        result = Math.max(result, sem);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) - Each node and edge visited once |
| **Space** | O(n + e) - Graph, state, and recursion stack |

---

## Comparison of Approaches

| Aspect | BFS Topological Sort | DFS Topological Sort |
|--------|---------------------|---------------------|
| **Time Complexity** | O(n + e) | O(n + e) |
| **Space Complexity** | O(n + e) | O(n + e) |
| **Implementation** | Simple | Moderate |
| **Cycle Detection** | Automatic | Via state tracking |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Best For** | Counting levels | Flexible processing |

**Best Approach:** Both approaches are optimal. BFS is more intuitive for counting semesters, while DFS is useful when you need to process courses in a specific order.

---

## Why BFS Topological Sort is Optimal for This Problem

The BFS approach is optimal because:

1. **Natural Semester Modeling**: Each BFS level naturally represents a semester
2. **Efficient Processing**: Each course and edge is processed exactly once
3. **Cycle Detection**: If we can't take all courses, there's a cycle
4. **Greedy Optimality**: Taking all available courses each semester is always optimal

The key insight is that we can take ALL courses with no prerequisites in the same semester - there's no limit on how many courses can be taken per semester.

---

## Related Problems

Based on similar themes (topological sort, dependency resolution):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Check if all courses can be completed |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Find valid course order |
| Minimum Height Trees | [Link](https://leetcode.com/problems/minimum-height-trees/) | Find centers in tree |
| Alien Dictionary | [Link](https://leetcode.com/problems/alien-dictionary/) | Find order from alien language |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule III | [Link](https://leetcode.com/problems/course-schedule-iii/) | Max courses with deadline |
| Parallel Courses II | [Link](https://leetcode.com/problems/parallel-courses-ii/) | With k courses per semester |

### Pattern Reference

For more detailed explanations of the Topological Sort pattern and its variations, see:
- **[Topological Sort Pattern](/patterns/topological-sort)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### BFS Topological Sort

- [NeetCode - Parallel Courses](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Clear explanation
- [Kahn's Algorithm Explained](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Official explanation

### DFS Topological Sort

- [DFS-based Topo Sort](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Alternative approach
- [Cycle Detection](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Understanding cycles

---

## Follow-up Questions

### Q1: What if you can only take k courses per semester?

**Answer:** This is the "Parallel Courses II" problem. You'd need to limit the queue processing to k courses per level, which makes it NP-hard in general. You'd need a greedy approach or use DP.

---

### Q2: How would you find the actual course schedule?

**Answer:** Maintain a list of courses taken in each semester. The BFS approach naturally gives you this - just store the course when you pop it from the queue.

---

### Q3: What is the difference between this and "Course Schedule"?

**Answer:** "Course Schedule" only asks if all courses can be completed (boolean). This problem asks for the minimum number of semesters, which requires counting the longest path in the DAG.

---

### Q4: How would you handle courses with different credit hours?

**Answer:** This becomes more complex. You might need to treat it as a weighted scheduling problem, possibly using DP or greedy heuristics.

---

### Q5: Can there be multiple valid topological orders?

**Answer:** Yes! Any order where prerequisites come before dependent courses is valid. The minimum number of semesters is the same regardless of the specific order.

---

### Q6: How would you extend to find maximum courses per semester?

**Answer:** The current solution already maximizes courses per semester - it takes ALL courses with indegree 0 each semester. That's why it's minimum semesters.

---

### Q7: What edge cases should be tested?

**Answer:**
- No relations (each course is independent)
- Linear chain (1->2->3->...)
- Parallel branches (1->2, 1->3, 2->4, 3->4)
- Cycle (impossible case)
- Single course with prerequisites

---

## Common Pitfalls

### 1. Index Conversion
**Issue**: Forgetting to convert 1-indexed to 0-indexed.

**Solution**: Always subtract 1 when accessing arrays/lists.

### 2. Cycle Detection
**Issue**: Not detecting cycles properly.

**Solution**: Check if taken == n. If not, there's a cycle.

### 3. Level Counting
**Issue**: Incorrectly counting semesters.

**Solution**: Only increment semester counter outside the inner loop.

### 4. Empty Queue
**Issue**: Queue becomes empty before all courses are taken.

**Solution**: This indicates a cycle, return -1.

---

## Summary

The **Parallel Courses** problem demonstrates the power of topological sort for dependency resolution:

- **BFS approach**: Natural semester counting with O(n + e) time
- **DFS approach**: Alternative with cycle detection

The key insight is that each level of BFS represents one semester, and we can take all available courses (those with no prerequisites) in the same semester.

This problem is an excellent demonstration of how to model real-world dependency problems as graph algorithms.

### Pattern Summary

This problem exemplifies the **Topological Sort with BFS** pattern, which is characterized by:
- Building a DAG from dependencies
- Using indegree for level counting
- Detecting cycles automatically
- Finding the longest path in a DAG

For more details on this pattern and its variations, see the **[Topological Sort Pattern](/patterns/topological-sort)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/parallel-courses/discuss/) - Community solutions
- [Topological Sort - GeeksforGeeks](https://www.geeksforgeeks.org/topological-sorting/) - Detailed explanation
- [Kahn's Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting) - Theory
- [DAG Properties](https://en.wikipedia.org/wiki/Directed_acyclic_graph) - Understanding DAGs
