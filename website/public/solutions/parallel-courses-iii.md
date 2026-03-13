# 

## Pattern: Graph / Topological Sort with DP

Parallel Courses III

## Problem Description

You are given an integer `n`, which indicates that there are `n` courses labeled from `1` to `n`. You are also given a 2D integer array `relations` where `relations[j] = [prevCoursej, nextCoursej]` denotes that course `prevCoursej` has to be completed before course `nextCoursej` (prerequisite relationship).

Furthermore, you are given a 0-indexed integer array `time` where `time[i]` denotes how many months it takes to complete the `(i+1)`th course.

You must find the minimum number of months needed to complete all the courses following these rules:

- You may start taking a course at any time if the prerequisites are met.
- Any number of courses can be taken at the same time.

Return the minimum number of months needed to complete all the courses. Note: The test cases are generated such that it is possible to complete every course (i.e., the graph is a directed acyclic graph).

## Examples

### Example

**Input:** `n = 3`, `relations = [[1,3],[2,3]]`, `time = [3,2,5]`  
**Output:** `8`

**Explanation:** The figure above represents the given graph and the time required to complete each course.
- We start course 1 and course 2 simultaneously at month 0.
- Course 1 takes 3 months and course 2 takes 2 months to complete respectively.
- Thus, the earliest time we can start course 3 is at month 3, and the total time required is 3 + 5 = 8 months.

### Example 2

**Input:** `n = 5`, `relations = [[1,5],[2,5],[3,5],[3,4],[4,5]]`, `time = [1,2,3,4,5]`  
**Output:** `12`

**Explanation:** The figure above represents the given graph and the time required to complete each course.
- You can start courses 1, 2, and 3 at month 0.
- You can complete them after 1, 2, and 3 months respectively.
- Course 4 can be taken only after course 3 is completed, i.e., after 3 months. It is completed after 3 + 4 = 7 months.
- Course 5 can be taken only after courses 1, 2, 3, and 4 have been completed, i.e., after max(1,2,3,7) = 7 months.
- Thus, the minimum time needed to complete all the courses is 7 + 5 = 12 months.

## Constraints

- `1 <= n <= 5 * 10^4`
- `0 <= relations.length <= min(n * (n - 1) / 2, 5 * 10^4)`
- `relations[j].length == 2`
- `1 <= prevCoursej, nextCoursej <= n`
- `prevCoursej != nextCoursej`
- All the pairs `[prevCoursej, nextCoursej]` are unique.
- `time.length == n`
- `1 <= time[i] <= 10^4`
- The given graph is a directed acyclic graph.

---

## Intuition

This problem is about finding the minimum time to complete all courses with prerequisites. The key insight is that:

1. This is a **DAG (Directed Acyclic Graph)** problem - courses with prerequisites form a directed graph with no cycles.
2. We need to find the longest path in this DAG, where each node has a weight (time).
3. Multiple courses can be taken simultaneously, so we only care about the critical path (the longest sequence of dependent courses).
4. We can use **topological sort** with **dynamic programming** to track the maximum time needed to reach each course.

The answer is the maximum time among all courses, which represents the total time needed when we account for all prerequisites.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Topological Sort with DP** - Optimal O(n + e) time, O(n + e) space
2. **DFS with Memoization** - Recursive approach
3. **Kahn's Algorithm BFS** - Alternative topological sort implementation

---

## Approach 1: Topological Sort with DP (Optimal)

This approach uses Kahn's algorithm (BFS-based topological sort) along with DP to track the maximum completion time for each course.

### Algorithm Steps

1. Build an adjacency list representation of the graph
2. Calculate in-degree for each node
3. Initialize a queue with all nodes having in-degree 0
4. Use a `max_time` array to track the earliest completion time for each course
5. Process nodes in topological order:
   - For each course, update its dependent courses' max_time
   - When a course's in-degree becomes 0, add it to the queue
6. Return the maximum value in `max_time`

### Why It Works

The topological sort ensures we process courses in the correct prerequisite order. The DP aspect tracks the longest path to each course, considering all possible prerequisite chains. Since multiple courses can run in parallel, the total time is determined by the longest chain (critical path).

### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def minimumTime(self, n: int, relations: List[List[int]], time: List[int]) -> int:
        """
        Find minimum time to complete all courses using topological sort with DP.
        
        Args:
            n: Number of courses
            relations: List of [prevCourse, nextCourse] pairs
            time: Time required for each course (0-indexed)
            
        Returns:
            Minimum months needed to complete all courses
        """
        graph = [[] for _ in range(n)]
        indegree = [0] * n
        
        # Build graph and calculate indegrees
        for u, v in relations:
            graph[u - 1].append(v - 1)  # Convert to 0-indexed
            indegree[v - 1] += 1
        
        # Initialize queue with courses having no prerequisites
        q = deque()
        max_time = [0] * n
        for i in range(n):
            if indegree[i] == 0:
                q.append(i)
                max_time[i] = time[i]  # Starting time is just the course time
        
        # Process courses in topological order
        while q:
            u = q.popleft()
            for v in graph[u]:
                # Update max time to complete course v
                # It's the max of current max_time[v] and (time to complete u + time for v)
                max_time[v] = max(max_time[v], max_time[u] + time[v])
                indegree[v] -= 1
                if indegree[v] == 0:
                    q.append(v)
        
        return max(max_time)
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int minimumTime(int n, vector<vector<int>>& relations, vector<int>& time) {
        // Build adjacency list and indegree array
        vector<vector<int>> graph(n);
        vector<int> indegree(n, 0);
        
        for (const auto& rel : relations) {
            int u = rel[0] - 1;  // Convert to 0-indexed
            int v = rel[1] - 1;
            graph[u].push_back(v);
            indegree[v]++;
        }
        
        // Queue for topological sort
        queue<int> q;
        vector<int> maxTime(n, 0);
        
        // Initialize with courses having no prerequisites
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                q.push(i);
                maxTime[i] = time[i];
            }
        }
        
        // Process courses in topological order
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            
            for (int v : graph[u]) {
                maxTime[v] = max(maxTime[v], maxTime[u] + time[v]);
                indegree[v]--;
                if (indegree[v] == 0) {
                    q.push(v);
                }
            }
        }
        
        // Return maximum completion time
        int result = 0;
        for (int t : maxTime) {
            result = max(result, t);
        }
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumTime(int n, int[][] relations, int[] time) {
        // Build adjacency list and indegree array
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        int[] indegree = new int[n];
        
        for (int[] rel : relations) {
            int u = rel[0] - 1;  // Convert to 0-indexed
            int v = rel[1] - 1;
            graph.get(u).add(v);
            indegree[v]++;
        }
        
        // Queue for topological sort
        Queue<Integer> q = new LinkedList<>();
        int[] maxTime = new int[n];
        
        // Initialize with courses having no prerequisites
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                q.offer(i);
                maxTime[i] = time[i];
            }
        }
        
        // Process courses in topological order
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : graph.get(u)) {
                maxTime[v] = Math.max(maxTime[v], maxTime[u] + time[v]);
                indegree[v]--;
                if (indegree[v] == 0) {
                    q.offer(v);
                }
            }
        }
        
        // Return maximum completion time
        int result = 0;
        for (int t : maxTime) {
            result = Math.max(result, t);
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} relations
 * @param {number[]} time
 * @return {number}
 */
var minimumTime = function(n, relations, time) {
    // Build adjacency list and indegree array
    const graph = Array.from({ length: n }, () => []);
    const indegree = new Array(n).fill(0);
    
    for (const [u, v] of relations) {
        graph[u - 1].push(v - 1);  // Convert to 0-indexed
        indegree[v - 1]++;
    }
    
    // Queue for topological sort
    const q = [];
    const maxTime = new Array(n).fill(0);
    
    // Initialize with courses having no prerequisites
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) {
            q.push(i);
            maxTime[i] = time[i];
        }
    }
    
    // Process courses in topological order
    let head = 0;
    while (head < q.length) {
        const u = q[head++];
        for (const v of graph[u]) {
            maxTime[v] = Math.max(maxTime[v], maxTime[u] + time[v]);
            indegree[v]--;
            if (indegree[v] === 0) {
                q.push(v);
            }
        }
    }
    
    // Return maximum completion time
    return Math.max(...maxTime);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e), where e is number of relations - each node and edge is processed once |
| **Space** | O(n + e) for graph, indegree array, queue, and max_time array |

---

## Approach 2: DFS with Memoization

This approach uses depth-first search with memoization to compute the longest path to each course.

### Algorithm Steps

1. Build adjacency list (reversed - from course to its prerequisites)
2. Use DFS with memoization to compute the maximum time for each course
3. For each course, recursively compute the maximum time considering all prerequisites
4. Return the maximum among all courses

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumTime(self, n: int, relations: List[List[int]], time: List[int]) -> int:
        # Build reversed graph: course -> list of prerequisites
        graph = [[] for _ in range(n)]
        for u, v in relations:
            graph[v - 1].append(u - 1)  # reversed: v depends on u
        
        memo = {}
        
        def dfs(course: int) -> int:
            """Returns max time to complete this course"""
            if course in memo:
                return memo[course]
            
            if not graph[course]:
                # No prerequisites, just this course's time
                memo[course] = time[course]
                return time[course]
            
            # Max time is this course's time + max of all prerequisites
            max_prereq_time = 0
            for prereq in graph[course]:
                max_prereq_time = max(max_prereq_time, dfs(prereq))
            
            memo[course] = time[course] + max_prereq_time
            return memo[course]
        
        result = 0
        for i in range(n):
            result = max(result, dfs(i))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    vector<vector<int>> graph;
    vector<int> time;
    vector<int> memo;
    
    int dfs(int course) {
        if (memo[course] != -1) return memo[course];
        
        if (graph[course].empty()) {
            memo[course] = time[course];
            return time[course];
        }
        
        int maxPrereqTime = 0;
        for (int prereq : graph[course]) {
            maxPrereqTime = max(maxPrereqTime, dfs(prereq));
        }
        
        memo[course] = time[course] + maxPrereqTime;
        return memo[course];
    }
    
public:
    int minimumTime(int n, vector<vector<int>>& relations, vector<int>& time) {
        this->time = time;
        
        // Build reversed graph
        graph.assign(n, {});
        for (const auto& rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            graph[v].push_back(u);  // v depends on u
        }
        
        memo.assign(n, -1);
        int result = 0;
        for (int i = 0; i < n; i++) {
            result = max(result, dfs(i));
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private int[] time;
    private int[] memo;
    
    private int dfs(int course) {
        if (memo[course] != -1) return memo[course];
        
        if (graph.get(course).isEmpty()) {
            memo[course] = time[course];
            return time[course];
        }
        
        int maxPrereqTime = 0;
        for (int prereq : graph.get(course)) {
            maxPrereqTime = Math.max(maxPrereqTime, dfs(prereq));
        }
        
        memo[course] = time[course] + maxPrereqTime;
        return memo[course];
    }
    
    public int minimumTime(int n, int[][] relations, int[] time) {
        this.time = time;
        
        // Build reversed graph
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            graph.get(v).add(u);  // v depends on u
        }
        
        memo = new int[n];
        Arrays.fill(memo, -1);
        
        int result = 0;
        for (int i = 0; i < n; i++) {
            result = Math.max(result, dfs(i));
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} relations
 * @param {number[]} time
 * @return {number}
 */
var minimumTime = function(n, relations, time) {
    // Build reversed graph
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of relations) {
        graph[v - 1].push(u - 1);  // v depends on u
    }
    
    const memo = new Array(n).fill(-1);
    
    const dfs = (course) => {
        if (memo[course] !== -1) return memo[course];
        
        if (graph[course].length === 0) {
            memo[course] = time[course];
            return time[course];
        }
        
        let maxPrereqTime = 0;
        for (const prereq of graph[course]) {
            maxPrereqTime = Math.max(maxPrereqTime, dfs(prereq));
        }
        
        memo[course] = time[course] + maxPrereqTime;
        return memo[course];
    };
    
    let result = 0;
    for (let i = 0; i < n; i++) {
        result = Math.max(result, dfs(i));
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) - each node is computed once, each edge is traversed once |
| **Space** | O(n + e) for graph and memoization cache + O(n) recursion stack |

---

## Approach 3: BFS with Level Order Processing

This approach processes courses in levels, where each level represents courses that can be taken in parallel at that time.

### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def minimumTime(self, n: int, relations: List[List[int]], time: List[int]) -> int:
        # Build graph and track dependencies
        graph = [[] for _ in range(n)]
        deps = [0] * n  # number of prerequisites for each course
        
        for u, v in relations:
            graph[u - 1].append(v - 1)
            deps[v - 1] += 1
        
        # Track when each course can be completed
        completion_time = [0] * n
        
        # Process by levels
        current_level = deque([i for i in range(n) if deps[i] == 0])
        max_month = 0
        
        while current_level:
            next_level = deque()
            
            for course in current_level:
                # This course can be completed at this time
                complete_at = completion_time[course] + time[course]
                max_month = max(max_month, complete_at)
                
                # Update dependent courses
                for next_course in graph[course]:
                    # Course can start after this course completes
                    completion_time[next_course] = max(
                        completion_time[next_course], 
                        complete_at
                    )
                    deps[next_course] -= 1
                    if deps[next_course] == 0:
                        next_level.append(next_course)
            
            current_level = next_level
        
        return max_month
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int minimumTime(int n, vector<vector<int>>& relations, vector<int>& time) {
        vector<vector<int>> graph(n);
        vector<int> deps(n, 0);
        
        for (const auto& rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            graph[u].push_back(v);
            deps[v]++;
        }
        
        vector<int> completionTime(n, 0);
        queue<int> currentLevel;
        for (int i = 0; i < n; i++) {
            if (deps[i] == 0) currentLevel.push(i);
        }
        
        int maxMonth = 0;
        
        while (!currentLevel.empty()) {
            queue<int> nextLevel;
            
            while (!currentLevel.empty()) {
                int course = currentLevel.front();
                currentLevel.pop();
                
                int completeAt = completionTime[course] + time[course];
                maxMonth = max(maxMonth, completeAt);
                
                for (int nextCourse : graph[course]) {
                    completionTime[nextCourse] = max(completionTime[nextCourse], completeAt);
                    deps[nextCourse]--;
                    if (deps[nextCourse] == 0) {
                        nextLevel.push(nextCourse);
                    }
                }
            }
            
            currentLevel = nextLevel;
        }
        
        return maxMonth;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumTime(int n, int[][] relations, int[] time) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        int[] deps = new int[n];
        
        for (int[] rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            graph.get(u).add(v);
            deps[v]++;
        }
        
        int[] completionTime = new int[n];
        Queue<Integer> currentLevel = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (deps[i] == 0) currentLevel.offer(i);
        }
        
        int maxMonth = 0;
        
        while (!currentLevel.isEmpty()) {
            Queue<Integer> nextLevel = new LinkedList<>();
            
            while (!currentLevel.isEmpty()) {
                int course = currentLevel.poll();
                int completeAt = completionTime[course] + time[course];
                maxMonth = Math.max(maxMonth, completeAt);
                
                for (int nextCourse : graph.get(course)) {
                    completionTime[nextCourse] = Math.max(completionTime[nextCourse], completeAt);
                    deps[nextCourse]--;
                    if (deps[nextCourse] == 0) {
                        nextLevel.offer(nextCourse);
                    }
                }
            }
            
            currentLevel = nextLevel;
        }
        
        return maxMonth;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} relations
 * @param {number[]} time
 * @return {number}
 */
var minimumTime = function(n, relations, time) {
    const graph = Array.from({ length: n }, () => []);
    const deps = new Array(n).fill(0);
    
    for (const [u, v] of relations) {
        graph[u - 1].push(v - 1);
        deps[v - 1]++;
    }
    
    const completionTime = new Array(n).fill(0);
    let currentLevel = [];
    
    for (let i = 0; i < n; i++) {
        if (deps[i] === 0) currentLevel.push(i);
    }
    
    let maxMonth = 0;
    
    while (currentLevel.length > 0) {
        const nextLevel = [];
        
        for (const course of currentLevel) {
            const completeAt = completionTime[course] + time[course];
            maxMonth = Math.max(maxMonth, completeAt);
            
            for (const nextCourse of graph[course]) {
                completionTime[nextCourse] = Math.max(completionTime[nextCourse], completeAt);
                deps[nextCourse]--;
                if (deps[nextCourse] === 0) {
                    nextLevel.push(nextCourse);
                }
            }
        }
        
        currentLevel = nextLevel;
    }
    
    return maxMonth;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + e) - each node and edge processed once |
| **Space** | O(n + e) for graph and auxiliary arrays |

---

## Comparison of Approaches

| Aspect | Topo Sort + DP | DFS + Memo | BFS Level Order |
|--------|---------------|------------|----------------|
| **Time Complexity** | O(n + e) | O(n + e) | O(n + e) |
| **Space Complexity** | O(n + e) | O(n + e) | O(n + e) |
| **Implementation** | Iterative | Recursive | Iterative |
| **Cache-friendly** | Yes | Moderate | Yes |
| **Best For** | Large graphs | Smaller graphs | Understanding parallelism |

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Frequently asked in technical interviews
- **Companies**: Amazon, Google, Meta, Microsoft
- **Difficulty**: Medium to Hard
- **Concepts**: Graph theory, DP, Topological sort

### Key Learnings
1. **DAG longest path**: Understanding how to find the longest path in a DAG
2. **Topological sort**: Essential for processing dependencies correctly
3. **Parallel processing**: Understanding how parallel tasks affect total time
4. **Critical path**: The path that determines minimum completion time

---

## Related Problems

### Same Pattern (DAG + DP)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Parallel Courses III | [Link](https://leetcode.com/problems/parallel-courses-iii/) | Hard | This problem |
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Medium | Detect cycle in DAG |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Medium | Find valid ordering |
| Minimum Time to Finish All Tasks | [Link](https://leetcode.com/problems/minimum-time-to-finish-all-tasks/) | Hard | Similar DAG problem |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Longest Path in DAG | [Link](https://practice.geeksforgeeks.org/problems/longest-path-in-a-dag) | Medium | Topological sort |
| Team Selection | [Link](https://leetcode.com/problems/team-selection/) | Medium | BFS on DAG |
| Find Safe States | [Link](https://leetcode.com/problems/find-safe-states-in-a-tour/) | Medium | Topological sort |

---

## Video Tutorial Links

### Topological Sort and DP

1. **[Parallel Courses III - NeetCode](https://www.youtube.com/watch?v=vAPb76WQuxw)** - Clear explanation with visual examples
2. **[LeetCode 2054 - Parallel Courses III](https://www.youtube.com/watch?v=TwI1qaVC-6k)** - Detailed walkthrough
3. **[Topological Sort Explained](https://www.youtube.com/watch?v=5w0os24c5VQ)** - Understanding topological sort
4. **[DAG Longest Path](https://www.youtube.com/watch?v=TvzOzDCrLLM)** - Finding longest path in DAG

### Related Concepts

- **[Kahn's Algorithm](https://www.youtube.com/watch?v=YG1FxOd-3vQ)** - BFS topological sort
- **[DFS Topological Sort](https://www.youtube.com/watch?v=9E8k6f2qT_s)** - DFS-based approach

---

## Follow-up Questions

### Q1: How would you modify the solution to track which courses are taken in each month?

**Answer:** Maintain a list of courses for each month. When a course's completion time is computed, add it to the corresponding month list. This gives you a schedule showing which courses are completed in each time period.

---

### Q2: What if you have a limit on the number of courses that can be taken simultaneously?

**Answer:** This becomes a more complex scheduling problem. You would need to use a priority queue to select which courses to take when there are more available courses than the limit. The courses with the most dependents or longest chains should be prioritized.

---

### Q3: How would you handle the case where courses can be retaken if failed?

**Answer:** Add a retry parameter to each course's time. If a course can be retaken, add the retry time to the total. The longest path would then include potential retry times, making the solution more complex as you'd need to consider probabilistic outcomes.

---

### Q4: Can you solve this using dynamic programming without topological sort?

**Answer:** Yes, you can use DFS with memoization (Approach 2). The key is to process courses in reverse dependency order, computing the longest path to each course by recursively considering all prerequisites.

---

### Q5: How would you modify the solution to return the actual course schedule?

**Answer:** Instead of just tracking the completion time, also track which prerequisite leads to the maximum time. Maintain a `parent` array that stores the predecessor that gives the longest path. Backtrack from the course with maximum time to construct the schedule.

---

### Q6: What is the difference between this problem and finding the critical path in project management?

**Answer:** This problem is essentially finding the critical path in a project network where each task (course) has a duration. The critical path determines the minimum project completion time. The difference is that in project management, you might also have resource constraints.

---

### Q7: How would you optimize the solution for very large graphs with millions of edges?

**Answer:** Use adjacency lists instead of matrices, process edges in chunks to improve cache locality, and consider parallel processing for independent subgraphs. The current O(n + e) solution is already optimal in terms of algorithmic complexity.

---

### Q8: What edge cases should you test?

**Answer:**
- Single course with no prerequisites
- Linear chain of courses (each depends on previous)
- Multiple independent branches (parallel courses)
- Course with many prerequisites
- Empty relations array
- Maximum constraints (n = 50000, e = 50000)

---

### Q9: How would you verify the correctness of your solution?

**Answer:** 
- Test with known examples
- Verify that all courses are processed (no cycles)
- Check that the answer equals the longest path in the DAG
- Test edge cases like single course, no dependencies
- Compare with brute force for small graphs

---

### Q10: How does this relate to the "parallel tasks" scheduling problem?

**Answer:** This is exactly the parallel tasks scheduling problem where tasks have dependencies. The solution finds the minimum makespan (total completion time) when tasks can run in parallel subject to precedence constraints. This is a classic problem in operations research.

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue**: Forgetting to convert between 1-indexed (input) and 0-indexed (array) coordinates.

**Solution**: Always convert course numbers to 0-indexed when storing in arrays.

### 2. Not Tracking Maximum Time Correctly
**Issue**: Using just `time[u]` instead of `max_time[u] + time[v]`.

**Solution**: The completion time for a course depends on the longest prerequisite chain, not just immediate prerequisites.

### 3. Missing Edge Cases
**Issue**: Not handling courses with no prerequisites.

**Solution**: Initialize `max_time` for courses with indegree 0 to their own `time` value.

### 4. Not Using All Prerequisites
**Issue**: Only considering the latest prerequisite, not all of them.

**Solution**: Use `max(max_time[v], max_time[u] + time[v])` to consider all prerequisite chains.

---

## Summary

The **Parallel Courses III** problem demonstrates the power of combining **topological sort** with **dynamic programming** to solve dependency-based scheduling problems:

- **Topological Sort**: Ensures we process courses in the correct prerequisite order
- **DP**: Tracks the longest path (maximum time) to each course
- **Key Insight**: The answer is the longest path in the DAG where node weights represent course duration

This pattern is essential for solving similar problems involving:
- Project scheduling
- Task dependencies
- Build systems
- Course planning

Understanding this approach is crucial for interview success and real-world scheduling problems.
