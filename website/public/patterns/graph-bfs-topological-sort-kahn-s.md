# Graph BFS - Topological Sort (Kahn's Algorithm)

## Problem Description

Kahn's algorithm uses Breadth-First Search (BFS) to perform topological sorting on a Directed Acyclic Graph (DAG). Topological sort orders nodes such that for every directed edge `u → v`, node `u` comes before node `v` in the ordering. This is essential for dependency resolution and scheduling problems where certain tasks must be completed before others can begin.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(V + E) where V is vertices, E is edges |
| Space Complexity | O(V + E) for graph storage and queue |
| Input | Directed Acyclic Graph (DAG) |
| Output | Valid topological ordering of nodes |
| Approach | BFS using indegree array |

### When to Use

- Order tasks with dependencies (scheduling)
- Schedule courses with prerequisites
- Resolve build dependencies (compilation order)
- Detect cycles in directed graphs
- Process nodes in dependency order
- Find valid ordering for prerequisites

## Intuition

The core idea behind Kahn's algorithm is to start with nodes that have no dependencies and progressively remove them from the graph, freeing up new nodes.

The "aha!" moments:

1. **Start independent**: Nodes with indegree 0 (no prerequisites) can be processed first
2. **Remove dependencies**: When a node is processed, decrement indegrees of its neighbors
3. **New sources emerge**: As dependencies are satisfied, new nodes become eligible
4. **Cycle detection**: If result length < total nodes, a cycle exists
5. **Multiple valid orders**: Any node with indegree 0 can be chosen at each step

## Solution Approaches

### Approach 1: Kahn's Algorithm (BFS) ✅ Recommended

#### Algorithm

1. Build adjacency list representation of the graph
2. Compute indegree for each node (count of incoming edges)
3. Initialize queue with all nodes having indegree 0
4. While queue is not empty:
   - Dequeue a node and add to result
   - For each neighbor, decrement its indegree
   - If neighbor's indegree becomes 0, enqueue it
5. If result length equals total nodes, return result; else cycle exists

#### Implementation

````carousel
```python
from collections import deque, defaultdict
from typing import List

def topological_sort_kahn(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """
    Kahn's Algorithm for Topological Sort using BFS.
    LeetCode 210 - Course Schedule II
    Time: O(V + E), Space: O(V + E)
    """
    # Build adjacency list and compute indegrees
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:  # u -> v (u must come before v)
        graph[u].append(v)
        indegree[v] += 1
    
    # Initialize queue with nodes having indegree 0
    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        # Decrease indegree of all neighbors
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check if cycle exists
    return result if len(result) == num_nodes else []


def find_order(num_courses: int, prerequisites: List[List[int]]) -> List[int]:
    """
    Course Schedule II - Return valid ordering of courses.
    prerequisites[i] = [a, b] means b -> a (b before a)
    """
    graph = defaultdict(list)
    indegree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        indegree[course] += 1
    
    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    result = []
    
    while queue:
        course = queue.popleft()
        result.append(course)
        
        for next_course in graph[course]:
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)
    
    return result if len(result) == num_courses else []


# Alternative: Using max heap for lexicographically smallest order
import heapq

def topological_sort_lexicographical(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """Return lexicographically smallest topological ordering."""
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    # Use min-heap instead of queue
    heap = [i for i in range(num_nodes) if indegree[i] == 0]
    heapq.heapify(heap)
    result = []
    
    while heap:
        node = heapq.heappop(heap)
        result.append(node)
        
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                heapq.heappush(heap, neighbor)
    
    return result if len(result) == num_nodes else []
```
<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        unordered_map<int, vector<int>> graph;
        vector<int> indegree(numCourses, 0);
        
        // Build graph: prereq -> course
        for (const auto& p : prerequisites) {
            int course = p[0], prereq = p[1];
            graph[prereq].push_back(course);
            indegree[course]++;
        }
        
        // Initialize queue with courses having no prerequisites
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        vector<int> result;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            result.push_back(course);
            
            for (int next : graph[course]) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                }
            }
        }
        
        return result.size() == numCourses ? result : vector<int>{};
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        int[] indegree = new int[numCourses];
        
        // Build graph: prereq -> course
        for (int[] p : prerequisites) {
            int course = p[0], prereq = p[1];
            graph.computeIfAbsent(prereq, k -> new ArrayList<>()).add(course);
            indegree[course]++;
        }
        
        // Initialize queue with courses having no prerequisites
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }
        
        int[] result = new int[numCourses];
        int index = 0;
        
        while (!queue.isEmpty()) {
            int course = queue.poll();
            result[index++] = course;
            
            for (int next : graph.getOrDefault(course, new ArrayList<>())) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }
        
        return index == numCourses ? result : new int[0];
    }
}
```
<!-- slide -->
```javascript
/**
 * Course Schedule II using Kahn's Algorithm
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
function findOrder(numCourses, prerequisites) {
    const graph = new Map();
    const indegree = new Array(numCourses).fill(0);
    
    // Build graph: prereq -> course
    for (const [course, prereq] of prerequisites) {
        if (!graph.has(prereq)) {
            graph.set(prereq, []);
        }
        graph.get(prereq).push(course);
        indegree[course]++;
    }
    
    // Initialize queue with courses having no prerequisites
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result = [];
    
    while (queue.length > 0) {
        const course = queue.shift();
        result.push(course);
        
        const neighbors = graph.get(course) || [];
        for (const next of neighbors) {
            indegree[next]--;
            if (indegree[next] === 0) {
                queue.push(next);
            }
        }
    }
    
    return result.length === numCourses ? result : [];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V + E) - Each vertex and edge processed once |
| Space | O(V + E) - Graph, indegree array, queue |

### Approach 2: DFS-based Topological Sort

#### Algorithm

1. Build adjacency list
2. Use three states: 0 = unvisited, 1 = visiting, 2 = visited
3. Perform DFS from each unvisited node
4. If we encounter a node in "visiting" state, cycle detected
5. Add node to order after processing all neighbors (post-order)
6. Reverse the order to get topological sort

#### Implementation

````carousel
```python
from collections import defaultdict
from typing import List

def topological_sort_dfs(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """
    DFS-based Topological Sort with Cycle Detection.
    Time: O(V + E), Space: O(V + E)
    """
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    
    # 0 = unvisited, 1 = visiting, 2 = visited
    visit = [0] * num_nodes
    order = []
    has_cycle = [False]
    
    def dfs(node: int) -> bool:
        if has_cycle[0]:
            return False
        if visit[node] == 1:
            has_cycle[0] = True  # Cycle detected
            return False
        if visit[node] == 2:
            return True
        
        visit[node] = 1  # Mark as visiting
        
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        
        visit[node] = 2  # Mark as visited
        order.append(node)  # Post-order
        return True
    
    for i in range(num_nodes):
        if visit[i] == 0:
            if not dfs(i):
                return []
    
    # Reverse to get topological order
    return order[::-1]
```
<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <functional>
using namespace std;

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        unordered_map<int, vector<int>> graph;
        for (const auto& p : prerequisites) {
            graph[p[1]].push_back(p[0]);
        }
        
        vector<int> visit(numCourses, 0);  // 0, 1, 2
        vector<int> order;
        bool hasCycle = false;
        
        function<void(int)> dfs = [&](int node) {
            if (hasCycle) return;
            if (visit[node] == 1) {
                hasCycle = true;
                return;
            }
            if (visit[node] == 2) return;
            
            visit[node] = 1;
            for (int neighbor : graph[node]) {
                dfs(neighbor);
            }
            visit[node] = 2;
            order.push_back(node);
        };
        
        for (int i = 0; i < numCourses && !hasCycle; i++) {
            if (visit[i] == 0) {
                dfs(i);
            }
        }
        
        if (hasCycle) return {};
        reverse(order.begin(), order.end());
        return order;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private boolean hasCycle = false;
    
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        for (int[] p : prerequisites) {
            graph.computeIfAbsent(p[1], k -> new ArrayList<>()).add(p[0]);
        }
        
        int[] visit = new int[numCourses];  // 0, 1, 2
        List<Integer> order = new ArrayList<>();
        
        for (int i = 0; i < numCourses && !hasCycle; i++) {
            if (visit[i] == 0) {
                dfs(i, graph, visit, order);
            }
        }
        
        if (hasCycle) return new int[0];
        
        Collections.reverse(order);
        int[] result = new int[order.size()];
        for (int i = 0; i < order.size(); i++) {
            result[i] = order.get(i);
        }
        return result;
    }
    
    private void dfs(int node, Map<Integer, List<Integer>> graph, 
                     int[] visit, List<Integer> order) {
        if (hasCycle) return;
        if (visit[node] == 1) {
            hasCycle = true;
            return;
        }
        if (visit[node] == 2) return;
        
        visit[node] = 1;
        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            dfs(neighbor, graph, visit, order);
        }
        visit[node] = 2;
        order.add(node);
    }
}
```
<!-- slide -->
```javascript
/**
 * DFS-based Topological Sort
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
function findOrder(numCourses, prerequisites) {
    const graph = new Map();
    for (const [course, prereq] of prerequisites) {
        if (!graph.has(prereq)) {
            graph.set(prereq, []);
        }
        graph.get(prereq).push(course);
    }
    
    const visit = new Array(numCourses).fill(0);  // 0, 1, 2
    const order = [];
    let hasCycle = false;
    
    function dfs(node) {
        if (hasCycle) return;
        if (visit[node] === 1) {
            hasCycle = true;
            return;
        }
        if (visit[node] === 2) return;
        
        visit[node] = 1;
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            dfs(neighbor);
        }
        visit[node] = 2;
        order.push(node);
    }
    
    for (let i = 0; i < numCourses && !hasCycle; i++) {
        if (visit[i] === 0) {
            dfs(i);
        }
    }
    
    return hasCycle ? [] : order.reverse();
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V + E) - Each vertex and edge visited once |
| Space | O(V + E) - Graph, visit array, recursion stack |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Kahn's Algorithm (BFS) | O(V + E) | O(V + E) | **Recommended** - Iterative, no recursion depth issues |
| DFS-based | O(V + E) | O(V + E) | When recursion depth not a concern |
| With Priority Queue | O(V log V + E) | O(V + E) | Lexicographical ordering needed |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Course Schedule](https://leetcode.com/problems/course-schedule/) | 207 | Medium | Check if course scheduling is possible |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | 210 | Medium | Return valid ordering of courses |
| [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) | 269 | Hard | Derive alien alphabet order |
| [Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/) | 444 | Medium | Verify unique topological order |
| [Parallel Courses](https://leetcode.com/problems/parallel-courses/) | 1136 | Medium | Check if all courses can be completed |
| [Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/) | 1462 | Medium | Queries on prerequisite chains |
| [Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii/) | 2050 | Hard | Minimum time with durations |
| [Find All Possible Recipes](https://leetcode.com/problems/find-all-possible-recipes/) | 2115 | Medium | Recipe dependencies |

## Video Tutorial Links

1. **[NeetCode - Course Schedule II](https://www.youtube.com/watch?v=Akt3glAwyfY)** - Kahn's algorithm explanation
2. **[Kahn's Algorithm - GeeksforGeeks](https://www.youtube.com/watch?v=nN-gl_2MbqU)** - Comprehensive explanation
3. **[Abdul Bari - Topological Sort](https://www.youtube.com/watch?v=IAv-35daKuA)** - DFS and Kahn's approaches
4. **[Back To Back SWE - Alien Dictionary](https://www.youtube.com/watch?v=6kTZYvNioNk)** - Application of topological sort
5. **[Tushar Roy - Topological Sorting](https://www.youtube.com/watch?v=7CTpoVNIc8o)** - Visual explanation

## Summary

### Key Takeaways

- **Kahn's algorithm**: Use indegree array and queue for iterative approach
- **DFS approach**: Post-order traversal, reverse at end
- **Cycle detection**: If result length < total nodes, cycle exists
- **Multiple valid orders**: Any valid topological order is acceptable
- **BFS vs DFS**: BFS avoids recursion depth issues

### Common Pitfalls

- Incorrect indegree calculation (counting outgoing instead of incoming)
- Missing cycle detection check
- Wrong node indexing (0-based vs 1-based)
- Not including isolated nodes in initialization
- Modifying indegrees incorrectly (decrement after processing, not before)
- Forgetting to reverse DFS result

### Follow-up Questions

1. **How to handle disconnected graphs?**
   - Both approaches naturally handle disconnected graphs

2. **What if we need lexicographically smallest order?**
   - Use a min-heap (priority queue) instead of regular queue

3. **How to detect multiple valid orderings?**
   - If queue has more than one element at any step, multiple orders exist

4. **How to schedule courses in parallel?**
   - Group by levels (all nodes with indegree 0 at same time)

## Pattern Source

[Graph BFS - Topological Sort (Kahn's Algorithm)](patterns/graph-bfs-topological-sort-kahn-s.md)
