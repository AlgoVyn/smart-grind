## Graph BFS - Topological Sort (Kahn's Algorithm): Framework

What is the complete code template for Kahn's topological sort?

<!-- front -->

---

### Framework: Kahn's Algorithm Template

```
┌─────────────────────────────────────────────────────────────────────┐
│  KAHN'S ALGORITHM - TOPOLOGICAL SORT TEMPLATE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Build graph:                                                     │
│     - adjacency list: graph[u] = [v1, v2, ...]                    │
│     - indegree array: count of incoming edges per node              │
│                                                                     │
│  2. Initialize queue:                                               │
│     - enqueue all nodes with indegree == 0                          │
│                                                                     │
│  3. Process queue:                                                  │
│     - while queue not empty:                                         │
│       - node = dequeue()                                             │
│       - add to result                                                │
│       - for each neighbor:                                          │
│         - indegree[neighbor]--                                       │
│         - if indegree[neighbor] == 0: enqueue(neighbor)             │
│                                                                     │
│  4. Check for cycle:                                                │
│     - if len(result) < total_nodes: cycle exists                    │
│     - else: return result as valid topological order                │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Basic Kahn's Algorithm

```python
from collections import deque, defaultdict
from typing import List

def topological_sort_kahn(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """
    Kahn's Algorithm for Topological Sort using BFS.
    Time: O(V + E), Space: O(V + E)
    edges[i] = [u, v] means u -> v (u before v)
    """
    # Build adjacency list and compute indegrees
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
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
```

---

### Implementation: Course Schedule II

```python
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
```

---

### Key Framework Elements

| Element | Purpose | Pattern |
|---------|---------|---------|
| `indegree` array | Count incoming edges | Identifies nodes ready to process |
| Queue | BFS traversal | Process nodes with no remaining dependencies |
| `indegree[v]--` | Remove dependency | Decrement when prerequisite satisfied |
| Cycle check | `len(result) < n` | Detects cycles in directed graph |
| Result list | Topological order | Valid ordering of all nodes |

---

### Complexity Summary

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| Time | O(V + E) | Visit all vertices and edges once |
| Space | O(V + E) | Graph storage, indegree array, queue |

<!-- back -->
