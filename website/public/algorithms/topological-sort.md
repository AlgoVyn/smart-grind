# Topological Sort

## Category
Graphs

## Description

Topological Sort is an algorithm that orders vertices of a Directed Acyclic Graph (DAG) such that for every directed edge u→v, vertex u comes before vertex v in the ordering. This is essential for solving problems involving dependency resolution, task scheduling, and build systems where certain tasks must be completed before others can begin.

The algorithm guarantees a valid linear ordering of vertices that respects all dependency constraints. If a cycle exists in the graph, topological sort is impossible, and the algorithm can detect this.

---

## Concepts

The Topological Sort algorithm is built on several fundamental concepts that make it powerful for dependency resolution problems.

### 1. Directed Acyclic Graphs (DAGs)

Topological sort only works on DAGs:

| Property | Description |
|----------|-------------|
| **Directed** | Edges have direction (u → v) |
| **Acyclic** | No cycles exist in the graph |
| **At Least One Source** | Always has at least one vertex with in-degree 0 |
| **Partial Order** | Defines a valid ordering respecting dependencies |

### 2. In-Degree Concept

The number of incoming edges to a vertex:

| In-Degree | Meaning | Action in Kahn's Algorithm |
|-----------|---------|---------------------------|
| **0** | No dependencies | Can be processed immediately |
| **> 0** | Has dependencies | Must wait until dependencies resolved |
| **Becomes 0** | All dependencies resolved | Add to processing queue |

### 3. Ordering Properties

| Property | Description |
|----------|-------------|
| **Not Unique** | Multiple valid topological orders may exist |
| **Source First** | Vertices with in-degree 0 appear early |
| **Sink Last** | Vertices with out-degree 0 appear late |
| **Dependency Respect** | If u → v, then u always comes before v |

### 4. Cycle Detection

A key property of topological sort:

| Scenario | Result |
|----------|--------|
| **Valid DAG** | Returns valid topological order |
| **Contains Cycle** | Cannot produce complete ordering |
| **Kahn's Algorithm** | If processed vertices < total, cycle exists |
| **DFS Approach** | Detects back edge during traversal |

---

## Frameworks

Structured approaches for solving topological sort problems.

### Framework 1: Kahn's Algorithm (BFS-based) Template

```
┌─────────────────────────────────────────────────────┐
│  KAHN'S ALGORITHM FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Build adjacency list from edges                 │
│  2. Calculate in-degree for each vertex             │
│  3. Initialize queue with all in-degree 0 vertices  │
│  4. While queue not empty:                          │
│     a. Dequeue vertex                               │
│     b. Add to result                                │
│     c. For each neighbor:                           │
│        - Decrement in-degree                        │
│        - If in-degree becomes 0: enqueue              │
│  5. If result length < total vertices:            │
│     - Cycle detected!                               │
│  6. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: General topological sort, explicit cycle detection, easier to understand.

### Framework 2: DFS-based Template

```
┌─────────────────────────────────────────────────────┐
│  DFS-BASED TOPOLOGICAL SORT FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Build adjacency list from edges                 │
│  2. Initialize visited state array (0/1/2)        │
│  3. For each unvisited vertex:                    │
│     a. Mark as visiting (state = 1)               │
│     b. Recursively visit all neighbors              │
│     c. If neighbor is visiting: CYCLE!              │
│     d. Mark as done (state = 2)                     │
│     e. Add to result                                │
│  4. Reverse result for correct order                │
│  5. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When DFS is already being used, recursive preference.

### Framework 3: Lexicographical Order Template

```
┌─────────────────────────────────────────────────────┐
│  LEXICOGRAPHICAL TOPOLOGICAL SORT FRAMEWORK         │
├─────────────────────────────────────────────────────┤
│  1. Same as Kahn's but use min-heap/priority queue  │
│  2. Always pick smallest available vertex         │
│  3. This produces lexicographically smallest order │
│  4. Time: O((V+E) log V) due to heap operations     │
└─────────────────────────────────────────────────────┘
```

**When to use**: When a specific deterministic order is required.

---

## Forms

Different manifestations of the topological sort pattern.

### Form 1: Standard Topological Sort

Basic ordering of all vertices in a DAG.

| Aspect | Description |
|--------|-------------|
| **Input** | DAG as edge list or adjacency list |
| **Output** | List of vertices in valid order |
| **Use Case** | General dependency resolution |

### Form 2: Cycle Detection Only

Use topological sort just to check for cycles.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | If processed vertices < total, cycle exists |
| **Output** | Boolean (has cycle or not) |
| **Optimization** | Can terminate early on cycle detection |

### Form 3: Parallel Task Scheduling

Determine minimum time/semesters for all tasks.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Process all available tasks in parallel |
| **Output** | Number of rounds/semesters needed |
| **Use Case** | Course scheduling, project planning |

### Form 4: All Topological Orders

Generate all valid topological orderings.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Use backtracking at each decision point |
| **Complexity** | O(V! × E) worst case |
| **Use Case** | Testing, enumeration problems |

### Form 5: Longest Path in DAG

Find longest path using topological order.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Process vertices in topo order, relax edges |
| **Output** | Longest path distances |
| **Use Case** | Critical path analysis |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Kahn's Algorithm with Cycle Detection

Explicit cycle detection while building order:

```python
def topological_sort_kahn(n, edges):
    """
    Kahn's algorithm with clear cycle detection.
    """
    # Build graph and in-degree
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Start with all sources (in-degree 0)
    from collections import deque
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Cycle detection
    if len(result) != n:
        return []  # Cycle exists
    
    return result
```

### Tactic 2: Lexicographically Smallest Order

Use priority queue for deterministic ordering:

```python
import heapq

def topological_sort_lexicographical(n, edges):
    """
    Produce lexicographically smallest topological order.
    """
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Use min-heap instead of queue
    heap = [i for i in range(n) if in_degree[i] == 0]
    heapq.heapify(heap)
    result = []
    
    while heap:
        vertex = heapq.heappop(heap)
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                heapq.heappush(heap, neighbor)
    
    return result if len(result) == n else []
```

### Tactic 3: Parallel Processing Rounds

Count rounds/semesters for parallel execution:

```python
def parallel_courses_semesters(n, edges):
    """
    Find minimum number of semesters to complete all courses.
    """
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Track which semester each course is taken
    semester = [0] * n
    queue = deque()
    
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
            semester[i] = 1
    
    max_semester = 0
    courses_taken = 0
    
    while queue:
        vertex = queue.popleft()
        courses_taken += 1
        max_semester = max(max_semester, semester[vertex])
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                semester[neighbor] = semester[vertex] + 1
    
    if courses_taken != n:
        return -1  # Cycle exists
    
    return max_semester
```

### Tactic 4: Longest Path in DAG

Use topological order to find longest path:

```python
def longest_path_dag(n, edges):
    """
    Find longest path in DAG using topological sort.
    """
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Topological sort
    topo_order = topological_sort_kahn(n, edges)
    if not topo_order:  # Cycle exists
        return []
    
    # Initialize distances
    dist = [0] * n
    
    # Relax edges in topological order
    for u in topo_order:
        for v in graph[u]:
            if dist[v] < dist[u] + 1:
                dist[v] = dist[u] + 1
    
    return dist
```

### Tactic 5: Alien Dictionary (Building Graph from Words)

Construct graph from sorted word list:

```python
def alien_dictionary(words):
    """
    Determine character order from sorted alien dictionary.
    """
    # Build graph from consecutive words
    chars = set(''.join(words))
    graph = {c: [] for c in chars}
    in_degree = {c: 0 for c in chars}
    
    for i in range(len(words) - 1):
        word1, word2 = words[i], words[i + 1]
        min_len = min(len(word1), len(word2))
        
        # Find first differing character
        for j in range(min_len):
            if word1[j] != word2[j]:
                graph[word1[j]].append(word2[j])
                in_degree[word2[j]] += 1
                break
        else:
            # word2 is prefix of word1 - invalid!
            if len(word1) > len(word2):
                return ""
    
    # Topological sort
    from collections import deque
    queue = deque([c for c in chars if in_degree[c] == 0])
    result = []
    
    while queue:
        char = queue.popleft()
        result.append(char)
        
        for neighbor in graph[char]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return ''.join(result) if len(result) == len(chars) else ""
```

---

## Python Templates

### Template 1: Kahn's Algorithm (BFS-based)

```python
from typing import List
from collections import deque

def topological_sort_kahn(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using Kahn's algorithm (BFS-based).
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        Topological ordering of vertices, or empty list if cycle exists
    """
    # Step 1: Build graph and in-degree array
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Step 2: Initialize queue with all vertices having in-degree 0
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    
    # Step 3: Process vertices
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        # Step 4: Reduce in-degree of neighbors
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Step 5: Check for cycle - if we couldn't process all vertices
    if len(result) != n:
        return []  # Cycle detected - no valid topological order
    
    return result
```

### Template 2: DFS-based Topological Sort

```python
def topological_sort_dfs(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using DFS.
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        Topological ordering of vertices, or empty list if cycle exists
    """
    # Build graph
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    # visited: 0 = unvisited, 1 = in progress (visiting), 2 = done
    visited = [0] * n
    result = []
    
    def dfs(vertex: int) -> bool:
        """Returns False if cycle detected, True otherwise."""
        visited[vertex] = 1  # Mark as visiting
        
        for neighbor in graph[vertex]:
            if visited[neighbor] == 1:  # Back edge found - cycle!
                return False
            if visited[neighbor] == 0:  # Unvisited
                if not dfs(neighbor):
                    return False
        
        visited[vertex] = 2  # Mark as done
        result.append(vertex)  # Add to result after all neighbors
        return True
    
    # Process all vertices
    for v in range(n):
        if visited[v] == 0:
            if not dfs(v):
                return []  # Cycle detected
    
    return result[::-1]  # Reverse for correct topological order
```

### Template 3: Course Schedule (Cycle Detection)

```python
def can_finish_courses(num_courses: int, prerequisites: List[List[int]]) -> bool:
    """
    Determine if all courses can be finished (no cycles in prerequisite graph).
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        num_courses: Total number of courses
        prerequisites: List of [course, prerequisite] pairs
    
    Returns:
        True if all courses can be finished, False otherwise
    """
    # Build graph
    graph = [[] for _ in range(num_courses)]
    in_degree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    # Kahn's algorithm
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    processed = 0
    
    while queue:
        vertex = queue.popleft()
        processed += 1
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return processed == num_courses
```

### Template 4: Course Schedule II (Return Ordering)

```python
def find_course_order(num_courses: int, prerequisites: List[List[int]]) -> List[int]:
    """
    Return a valid ordering of courses to finish all courses.
    
    Time: O(V + E)
    Space: O(V)
    
    Returns:
        Valid ordering, or empty list if impossible
    """
    # Build graph
    graph = [[] for _ in range(num_courses)]
    in_degree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    # Kahn's algorithm
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == num_courses else []
```

### Template 5: Minimum Semesters (Parallel Courses)

```python
def minimum_semesters(n: int, relations: List[List[int]]) -> int:
    """
    Find minimum number of semesters needed to complete all courses.
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        n: Number of courses
        relations: List of [prerequisite, course] pairs
    
    Returns:
        Minimum semesters, or -1 if impossible
    """
    # Build graph
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for prereq, course in relations:
        graph[prereq - 1].append(course - 1)  # Convert to 0-indexed
        in_degree[course - 1] += 1
    
    # Track which semester each course is taken
    semester = [0] * n
    queue = deque()
    
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
            semester[i] = 1
    
    max_semester = 0
    courses_taken = 0
    
    while queue:
        vertex = queue.popleft()
        courses_taken += 1
        max_semester = max(max_semester, semester[vertex])
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                semester[neighbor] = semester[vertex] + 1
    
    if courses_taken != n:
        return -1  # Cycle exists
    
    return max_semester
```

### Template 6: Longest Path in DAG

```python
def longest_path_in_dag(n: int, edges: List[List[int]]) -> int:
    """
    Find length of longest path in DAG.
    
    Time: O(V + E)
    Space: O(V)
    
    Returns:
        Length of longest path
    """
    # Build graph and reverse graph
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Topological sort
    topo_order = topological_sort_kahn(n, edges)
    if not topo_order:
        return -1  # Cycle
    
    # DP: longest path ending at each vertex
    longest = [0] * n
    max_length = 0
    
    for u in topo_order:
        for v in graph[u]:
            if longest[v] < longest[u] + 1:
                longest[v] = longest[u] + 1
                max_length = max(max_length, longest[v])
    
    return max_length
```

---

## When to Use

Use the Topological Sort algorithm when you need to solve problems involving:

- **Dependency Resolution**: When tasks have prerequisites (course scheduling, package installation)
- **Build Systems**: Determining the order of compilation for source files
- **Task Scheduling**: When activities must be performed in a specific order
- **Course Prerequisites**: Determining valid course sequences
- **Project Planning**: Resolving task dependencies in project management
- **Detecting Cycles**: Determining if a valid ordering is possible

### Comparison: Kahn's Algorithm vs DFS-based

| Algorithm | Approach | Cycle Detection | Best For |
|-----------|----------|-----------------|----------|
| **Kahn's (BFS)** | Remove sources iteratively | If result < V, cycle exists | General use, explicit cycle detection |
| **DFS-based** | Post-order DFS | Back edge detection | When DFS already in use |

### When to Choose Kahn's Algorithm vs DFS-based

- **Choose Kahn's Algorithm (BFS)** when:
  - You need to detect cycles easily
  - You want an intuitive level-by-level understanding
  - You're more comfortable with iterative approaches
  - You need to easily find the "starting points" (zero in-degree nodes)

- **Choose DFS-based Topological Sort** when:
  - You're already doing DFS for other purposes
  - You prefer recursive approaches
  - You want to find strongly connected components (can combine with Kosaraju's)
  - Memory stack depth is not a concern

---

## Algorithm Explanation

### Core Concept

The key insight behind Topological Sort is that in a DAG, there must always be at least one vertex with in-degree 0 (no dependencies). By repeatedly removing vertices with in-degree 0 and updating their neighbors' in-degrees, we can produce a valid ordering. If we can't process all vertices, a cycle exists.

### How It Works

#### Kahn's Algorithm (BFS-based):
1. **Calculate in-degree**: Count incoming edges for each vertex
2. **Initialize queue**: Add all vertices with in-degree 0 to the queue
3. **Process vertices**: While queue is not empty:
   - Dequeue vertex, add to result
   - For each neighbor, decrease its in-degree by 1
   - If neighbor's in-degree becomes 0, add to queue
4. **Check for cycle**: If processed vertices < total vertices, cycle exists

#### DFS-based Approach:
1. **Perform DFS**: Visit all unvisited vertices
2. **Record completion**: Add vertex to result AFTER exploring all neighbors
3. **Reverse result**: The final order is the reverse of completion times

### Visual Representation

For a graph with vertices {0, 1, 2, 3, 4} and edges:
- 1 → 0 (1 must come before 0)
- 0 → 4 (0 must come before 4)
- 1 → 4 (1 must come before 4)
- 2 → 3 (2 must come before 3)

```
Initial state:              After processing 1:
    1 → 0 → 4                   [1]    0 → 4
    |    ↗                         ↗
    ↓                           ↓
    1 → 4                   [1]    [0]

    2 → 3                   [1, 2] [0] → 3
```

Final topological order: [1, 2, 0, 3, 4]

### Why It Works

- **DAG Property**: A DAG always has at least one source (vertex with in-degree 0)
- **Induction**: If we process all sources first, the remaining graph is still a DAG
- **Cycle Detection**: If a cycle exists, no vertex in the cycle will ever reach in-degree 0

### Limitations

| Limitation | Description | Mitigation |
|------------|-------------|------------|
| **Only works on DAGs** | Cycles make topological sort impossible | Detect cycles first, report error |
| **Not unique** | Multiple valid topological orders may exist | Use priority queue for deterministic order |
| **No weight consideration** | Doesn't account for edge weights or priorities | Use different algorithm for weighted scheduling |

---

## Practice Problems

### Problem 1: Course Schedule

**Problem:** [LeetCode 207 - Course Schedule](https://leetcode.com/problems/course-schedule/)

**Description:** There are `numCourses` courses labeled from 0 to `numCourses - 1`. Some courses may have prerequisites. Given the total number of courses and a list of prerequisite pairs, determine if it is possible to finish all courses.

**How to Apply:**
- Build a graph where each course points to its dependents
- Use Kahn's algorithm or DFS to detect cycles
- If cycle exists → impossible to complete; otherwise → possible

**Key Insight:** Cycle in prerequisite graph = circular dependencies = impossible to satisfy.

---

### Problem 2: Course Schedule II

**Problem:** [LeetCode 210 - Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

**Description:** Find one valid order of course scheduling. Return an empty array if impossible.

**How to Apply:**
- Use Kahn's algorithm to produce actual ordering
- Return the result if all vertices processed, otherwise return empty
- Handle edge cases (no prerequisites, cycle)

**Key Insight:** This is a direct application of topological sort with actual ordering required.

---

### Problem 3: Alien Dictionary

**Problem:** [LeetCode 269 - Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)

**Description:** Given a sorted dictionary of an alien language, determine the order of characters.

**How to Apply:**
- Build graph from consecutive words by finding first differing character
- Use topological sort to find character ordering
- Handle edge cases (invalid ordering, cycle detection)
- Compare word lengths for prefix validation

**Key Insight:** The sorted order of words reveals character ordering constraints.

---

### Problem 4: Parallel Courses

**Problem:** [LeetCode 1136 - Parallel Courses](https://leetcode.com/problems/parallel-courses/)

**Description:** Given courses and their dependencies, find the minimum number of semesters needed to complete all courses.

**How to Apply:**
- Modify Kahn's algorithm to process all zero in-degree nodes in parallel
- Each "level" represents one semester
- Track semester number for each course
- Return maximum semester number

**Key Insight:** Courses with no remaining prerequisites can be taken in the same semester.

---

### Problem 5: Minimum Height Trees

**Problem:** [LeetCode 310 - Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)

**Description:** For a tree (undirected graph without cycles), find all root nodes that produce minimum height trees.

**How to Apply:**
- This is essentially topological sort on undirected graph
- Repeatedly remove leaf nodes (in-degree = 1) from the tree
- The remaining 1-2 nodes are the roots of minimum height trees
- Use layer-by-layer removal similar to Kahn's algorithm

**Key Insight:** Leaves are the farthest from center; removing them layer by layer finds the center.

---

## Video Tutorial Links

### Fundamentals

- [Topological Sort - Introduction (Take U Forward)](https://www.youtube.com/watch?v=73r3KXMx5lk) - Comprehensive introduction to topological sort
- [Kahn's Algorithm (BFS)](https://www.youtube.com/watch?v=q1fp8zaB2wA) - Detailed explanation with examples
- [DFS-based Topological Sort](https://www.youtube.com/watch?v=3j-4LPuR1Ts) - DFS approach explained

### Practical Applications

- [Course Schedule Problem](https://www.youtube.com/watch?v=qe_pT4wkqOM) - LeetCode 207 solution
- [Alien Dictionary](https://www.youtube.com/watch?v=1wuNBS0N2bU) - Real-world application
- [Parallel Courses](https://www.youtube.com/watch?v=k1lK8dairmI) - Extended problem variant

### Advanced Topics

- [All Topological Orders](https://www.youtube.com/watch?v=5_Q6QYgy2Rg) - Generating all valid orders
- [Topological Sort vs DFS](https://www.youtube.com/watch?v=A0Z0L-1lEE0) - Comparison and trade-offs

---

## Follow-up Questions

### Q1: What is the difference between Kahn's algorithm and DFS-based topological sort?

**Answer:** Both achieve the same result but with different approaches:
- **Kahn's Algorithm**: Uses BFS with a queue. Iteratively removes vertices with in-degree 0. More intuitive for cycle detection (if result < V, cycle exists).
- **DFS-based**: Uses depth-first search. Adds vertex to result after exploring all neighbors, then reverses. More natural when DFS is already being used.

### Q2: How do you detect a cycle in a directed graph?

**Answer:** There are several methods:
1. **Kahn's Algorithm**: If processed vertices < total vertices, cycle exists
2. **DFS-based**: If we encounter a vertex currently "visiting" (in recursion stack), it's a back edge → cycle
3. **Union-Find**: For each edge, union the two vertices; if they already belong to same set → cycle

### Q3: Can topological sort handle disconnected graphs?

**Answer:** Yes, both algorithms handle disconnected components naturally:
- Kahn's algorithm starts with ALL zero in-degree vertices in queue
- DFS-based iterates through all vertices, starting new DFS for unvisited ones
- The result will contain all vertices in topological order

### Q4: How do you find the lexicographically smallest topological order?

**Answer:** Use a priority queue (min-heap) instead of a regular queue:
- Always pop the smallest available vertex (in-degree = 0)
- This guarantees the lexicographically smallest valid ordering
- Time complexity increases slightly due to heap operations: O((V+E) log V)

### Q5: What is the time complexity to find ALL topological orders?

**Answer:** O(V! × E) in the worst case:
- There can be up to V! valid topological orders
- Each generation takes O(V + E) time
- This is exponential and impractical for large V
- Use only when explicitly required (small graphs)

---

## Summary

Topological Sort is an essential algorithm for solving **dependency-related problems** in directed acyclic graphs. Key takeaways:

### Core Concepts
- **Linear time**: O(V + E) time complexity makes it efficient
- **Two main approaches**: Kahn's algorithm (BFS) and DFS-based
- **Cycle detection**: Both methods naturally detect cycles
- **Multiple valid orders**: Any order satisfying all constraints is valid

### When to Use
- ✅ Course scheduling and prerequisites
- ✅ Build systems and dependency resolution
- ✅ Task scheduling with dependencies
- ✅ Detecting cycles in directed graphs
- ❌ Undirected graphs (use different approach)
- ❌ Graphs with cycles (impossible to sort)

### Complexity Summary

| Approach | Time | Space | Cycle Detection |
|----------|------|-------|-----------------|
| Kahn's | O(V + E) | O(V) | len(result) < V |
| DFS-based | O(V + E) | O(V) | Back edge found |

### Implementation Tips
1. Kahn's algorithm is more intuitive for beginners
2. DFS-based integrates well with other DFS problems
3. Always check for cycles (return empty list/error)
4. Use priority queue for deterministic ordering
5. Process all zero in-degree nodes in parallel for minimum time problems

This algorithm is fundamental for competitive programming and technical interviews, especially in problems involving ordering, scheduling, and dependency resolution.
