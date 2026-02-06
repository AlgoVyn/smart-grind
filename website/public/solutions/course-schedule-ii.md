# Course Schedule II

## Problem Statement

There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`.

For example, the pair `[0, 1]` indicates that to take course `0`, you have to first take course `1`.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses (due to a cycle in prerequisites), return an empty array.

---

### Input Format

- `int numCourses`: The number of courses.
- `vector<vector<int>> prerequisites`: A list of prerequisite pairs.

### Output Format

- `vector<int>`: A valid ordering of courses, or an empty vector if impossible.

### Constraints

- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= numCourses * (numCourses - 1)`
- `prerequisites[i].length == 2`
- `0 <= a_i, b_i < numCourses`
- `a_i != b_i`
- All the pairs `[a_i, b_i]` are **distinct**.

---

## Examples

### Example 1

**Input:**
```python
numCourses = 2
prerequisites = [[1, 0]]
```

**Output:**
```
[0, 1]
```

**Explanation:** There are 2 courses. To take course 1, you must finish course 0 first. One valid order is `[0, 1]`.

---

### Example 2

**Input:**
```python
numCourses = 4
prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
```

**Output:**
```
[0, 1, 2, 3] or [0, 2, 1, 3]
```

**Explanation:** Course 0 has no prerequisites. Courses 1 and 2 depend on 0. Course 3 depends on both 1 and 2. A cycle would make it impossible, but here it's acyclic.

---

### Example 3

**Input:**
```python
numCourses = 1
prerequisites = []
```

**Output:**
```
[0]
```

**Explanation:** A single course with no prerequisites.

---

### Example 4 (Impossible Case)

**Input:**
```python
numCourses = 2
prerequisites = [[0, 1], [1, 0]]
```

**Output:**
```
[]
```

**Explanation:** Cycle between 0 and 1 prevents completion.

---

## Intuition

This problem models course prerequisites as a **directed graph**, where:

- Each course is a node (`0` to `numCourses - 1`)
- An edge `b_i → a_i` means "take `b_i` before `a_i`" (`b_i` is a prerequisite for `a_i`)

The task is to find a **topological order** of the graph nodes, which is a linear ordering where for every directed edge `u → v`, `u` comes before `v`. If the graph has a **cycle**, no topological order exists (impossible to finish all courses), so return an empty array.

### Key Insights

1. **Detect cycles** in the directed graph
2. **Compute a valid topological sort** if acyclic
3. **Multiple orders may exist**; return any valid one

This is a classic **topological sorting** problem, solvable via graph traversal techniques like BFS or DFS, with cycle detection built-in.

---

## Multiple Approaches with Code

We'll cover two standard approaches:

1. **BFS (Kahn's Algorithm)**: Uses indegrees (number of incoming edges) to process nodes with no prerequisites first
2. **DFS with Cycle Detection**: Recursively visits nodes, tracking visit states to detect cycles, and builds the order in post-order

---

### Approach 1: BFS (Kahn's Algorithm)

#### Algorithm Steps

1. **Build the graph** as an adjacency list: `graph[course] = [dependents]`
2. **Compute indegrees** for each course (number of prerequisites)
3. **Initialize a queue** with all courses having indegree 0 (no prerequisites)
4. **Process the queue**: For each course, add it to the result order, and decrease indegrees of its dependents
5. If a dependent's indegree reaches 0, add it to the queue
6. If all courses are processed (`result.size() == numCourses`), return the order; else, cycle exists, return `[]`

#### Code Implementation

````carousel
```python
from collections import defaultdict, deque
from typing import List

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
        
        for (auto& prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph[b].push_back(a);  // b -> a
            indegree[a]++;
        }
        
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        vector<int> order;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            order.push_back(course);
            
            for (int dependent : graph[course]) {
                indegree[dependent]--;
                if (indegree[dependent] == 0) {
                    q.push(dependent);
                }
            }
        }
        
        return order.size() == numCourses ? order : vector<int>();
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
        
        for (int[] prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph.computeIfAbsent(b, k -> new ArrayList<>()).add(a);
            indegree[a]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.offer(i);
            }
        }
        
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int course = q.poll();
            order.add(course);
            
            for (int dependent : graph.getOrDefault(course, new ArrayList<>())) {
                indegree[dependent]--;
                if (indegree[dependent] == 0) {
                    q.offer(dependent);
                }
            }
        }
        
        return order.size() == numCourses ? order.stream().mapToInt(i -> i).toArray() : new int[0];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findOrder = function(numCourses, prerequisites) {
    const graph = new Map();
    const indegree = new Array(numCourses).fill(0);
    
    for (const [a, b] of prerequisites) {
        if (!graph.has(b)) {
            graph.set(b, []);
        }
        graph.get(b).push(a);
        indegree[a]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const order = [];
    while (queue.length > 0) {
        const course = queue.shift();
        order.push(course);
        
        const dependents = graph.get(course) || [];
        for (const dependent of dependents) {
            indegree[dependent]--;
            if (indegree[dependent] === 0) {
                queue.push(dependent);
            }
        }
    }
    
    return order.length === numCourses ? order : [];
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E), where V = numCourses (vertices), E = prerequisites.length (edges). Each node and edge is processed once. |
| **Space** | O(V + E), for graph adjacency list, indegree array, and queue. |

---

### Approach 2: DFS with Cycle Detection

#### Algorithm Steps

1. **Build the graph** as adjacency list: `graph[course] = [dependents]`
2. **Use a visit array** with 3 states:
   - `0` = unvisited
   - `1` = visiting (currently in recursion stack)
   - `2` = visited (fully processed)
3. **For each course**, perform DFS:
   - If visiting (`state == 1`), **cycle detected**
   - If visited (`state == 2`), skip
   - Mark as visiting, recurse on dependents, then mark as visited and add to order (post-order)
4. **Reverse the order** at the end (since post-order adds nodes in reverse topological order)
5. If cycle found or not all visited, return `[]`

#### Code Implementation

````carousel
```python
from collections import defaultdict
from typing import List

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

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        unordered_map<int, vector<int>> graph;
        for (auto& prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph[b].push_back(a);  // b -> a
        }
        
        vector<int> visit(numCourses, 0);  // 0: unvisited, 1: visiting, 2: visited
        vector<int> order;
        bool cycle = false;
        
        function<void(int)> dfs = [&](int course) {
            if (cycle) return;
            if (visit[course] == 1) {
                cycle = true;
                return;
            }
            if (visit[course] == 2) {
                return;
            }
            
            visit[course] = 1;
            for (int dependent : graph[course]) {
                dfs(dependent);
            }
            visit[course] = 2;
            order.push_back(course);
        };
        
        for (int i = 0; i < numCourses; i++) {
            dfs(i);
            if (cycle) return {};
        }
        
        reverse(order.begin(), order.end());
        return order;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private boolean cycle;
    private Map<Integer, List<Integer>> graph;
    private int[] visit;
    private List<Integer> order;
    
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        graph = new HashMap<>();
        for (int[] prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph.computeIfAbsent(b, k -> new ArrayList<>()).add(a);
        }
        
        visit = new int[numCourses];  // 0: unvisited, 1: visiting, 2: visited
        order = new ArrayList<>();
        cycle = false;
        
        for (int i = 0; i < numCourses; i++) {
            dfs(i);
            if (cycle) {
                return new int[0];
            }
        }
        
        Collections.reverse(order);
        return order.stream().mapToInt(i -> i).toArray();
    }
    
    private void dfs(int course) {
        if (cycle) return;
        if (visit[course] == 1) {
            cycle = true;
            return;
        }
        if (visit[course] == 2) {
            return;
        }
        
        visit[course] = 1;
        for (int dependent : graph.getOrDefault(course, new ArrayList<>())) {
            dfs(dependent);
        }
        visit[course] = 2;
        order.add(course);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findOrder = function(numCourses, prerequisites) {
    const graph = new Map();
    for (const [a, b] of prerequisites) {
        if (!graph.has(b)) {
            graph.set(b, []);
        }
        graph.get(b).push(a);
    }
    
    const visit = new Array(numCourses).fill(0);  // 0: unvisited, 1: visiting, 2: visited
    const order = [];
    let cycle = false;
    
    const dfs = (course) => {
        if (cycle) return;
        if (visit[course] === 1) {
            cycle = true;
            return;
        }
        if (visit[course] === 2) {
            return;
        }
        
        visit[course] = 1;
        const dependents = graph.get(course) || [];
        for (const dependent of dependents) {
            dfs(dependent);
        }
        visit[course] = 2;
        order.push(course);
    };
    
    for (let i = 0; i < numCourses; i++) {
        dfs(i);
        if (cycle) {
            return [];
        }
    }
    
    return order.reverse();
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E), each node and edge visited once |
| **Space** | O(V + E), for graph adjacency list and recursion stack (worst-case O(V)) |

---

### Comparison of Approaches

| Aspect | BFS (Kahn's) | DFS |
|--------|--------------|-----|
| **Approach** | Iterative | Recursive |
| **Cycle Detection** | Implicit (if nodes remain unprocessed) | Explicit (via visit states) |
| **Memory** | Queue + adjacency list | Recursion stack + adjacency list |
| **Use Case** | Better for large graphs (no recursion depth limits) | Simpler cycle detection logic |
| **Order** | Natural topological order | Requires reverse at end |

Both are optimal with O(V + E) time complexity. Choose based on preference and constraints (recursion depth limits favor BFS).

---

## Related Problems

Based on similar themes (topological sort, cycle detection in directed graphs):

- **[LeetCode 207: Course Schedule](https://leetcode.com/problems/course-schedule/)** - Just check if possible, no order needed (cycle detection only, precursor to this problem)
- **[LeetCode 269: Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)** - Topological sort on characters from word orders
- **[LeetCode 444: Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/)** - Verify if a sequence is a unique topological order
- **[LeetCode 1462: Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)** - Queries on prerequisite chains
- **[LeetCode 1857: Largest Color Value in a Directed Graph](https://leetcode.com/problems/largest-color-value-in-a-directed-graph/)** - Topological sort with DP
- **[LeetCode 1494: Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii/)** - Min semesters with parallel courses, bitmask DP variant

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Course Schedule II - Topological Sort - Leetcode 210 (NeetCode)](https://www.youtube.com/watch?v=Akt3glAwyfY) - Detailed drawing and code explanation
- [LeetCode 210: Course Schedule II | Topological Sort & Kahn's Algorithm Explained](https://www.youtube.com/watch?v=SSJRZV9qa4M) - Focus on Kahn's algorithm
- [Course Schedule II (Topological Sort) - Leetcode 210 - Graphs (Python)](https://www.youtube.com/watch?v=2cpihwDznaw) - Python implementation with graphs
- [COURSE SCHEDULE II | LEETCODE # 210 | PYTHON TOPOLOGICAL SORT SOLUTION](https://www.youtube.com/watch?v=6vaSka3rwDQ) - Walkthrough with timestamps
- [You're Overthinking Course Schedule II (LeetCode 210)](https://www.youtube.com/watch?v=aF-8Ja-r84o) - DFS focus with cycle detection tips

---

## Followup Questions

### Q1: What if we want to find all possible valid orderings (not just one)?

**Answer:** You would need to use backtracking to explore all topological sorts. After building the graph, recursively try all nodes with indegree 0 at each step, decrement indegrees accordingly, and collect all valid sequences. This has exponential time complexity O(k × V!) where k is the average branching factor.

---

### Q2: How would you modify Kahn's algorithm to prioritize courses with more dependents first?

**Answer:** Use a max-heap (priority queue) instead of a regular queue. At each step, select the node with the highest number of dependents (outdegree) among those with indegree 0. This ensures courses that unlock more other courses are taken earlier.

---

### Q3: How do you detect if there are multiple valid orderings?

**Answer:** In Kahn's algorithm, if at any point the queue has more than one node with indegree 0, multiple valid orderings exist. In DFS, you can track if there are multiple choices at any point during traversal. For a definitive check, count the number of valid topological sorts using DP with bitmasking (only feasible for small graphs).

---

### Q4: What is the difference between topological sort and DFS finish times?

**Answer:** DFS finish times (post-order) naturally give nodes in reverse topological order. When you perform DFS and record nodes as you backtrack (finish time), then reverse that list, you get a valid topological sort. Kahn's algorithm produces topological order directly without needing reversal.

---

### Q5: How would you solve this problem if courses could be taken in parallel (multiple at once)?

**Answer:** Use Kahn's algorithm with a priority queue. At each semester/step, take all courses with indegree 0 (in parallel). Count semesters until all courses are completed. This is the approach used in "Parallel Courses" problems.

---

### Q6: How do you handle the case where the graph is disconnected?

**Answer:** Both BFS and DFS naturally handle disconnected graphs. In BFS, initialize the queue with ALL nodes having indegree 0 (from different components). In DFS, iterate through all nodes and start DFS from any unvisited node. The resulting order will include courses from all components.

---

### Q7: What are the key differences between Kahn's algorithm and DFS-based topological sort in terms of implementation complexity?

**Answer:** Kahn's algorithm is iterative with explicit cycle detection (if order.length < numCourses). DFS-based approach has more complex state management (3 states) but often produces more intuitive code for those familiar with recursion. Kahn's requires building indegree array; DFS requires visit state array. Both are relatively simple to implement correctly.

---

### Q8: How would you verify that a given ordering is valid without recomputing from scratch?

**Answer:** For each course (except the first) in the ordering, check that all its prerequisites appear earlier in the list. You can precompute the index of each course in the ordering, then for each edge `b → a`, verify `index[b] < index[a]`. This verification is O(E).

---

### Q9: What happens if there are duplicate edges in the prerequisites input?

**Answer:** According to constraints, all prerequisite pairs are distinct. If duplicates existed, you'd need to handle them (e.g., by using a set or ignoring duplicates when building the graph). Unchecked duplicates would incorrectly inflate indegrees and break the algorithm.

---

### Q10: How would you modify the solution to return courses in reverse order (post-order instead of topological)?

**Answer:** In Kahn's algorithm, you would prepend to the result list instead of appending, or simply reverse the final result. In DFS, you already have post-order in the `order` list before reversal, so you can return it directly without reversing. This gives a valid order where prerequisites come after dependent courses.
