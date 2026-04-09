## Advanced - Topological Sort (Kahn's): Framework

What is the complete code template for Kahn's topological sort algorithm?

<!-- front -->

---

### Framework 1: Kahn's Algorithm Template

```
┌─────────────────────────────────────────────────────┐
│  KAHN'S TOPOLOGICAL SORT - TEMPLATE                    │
├─────────────────────────────────────────────────────┤
│  1. Build adjacency list and in-degree array         │
│     For each edge u → v:                             │
│       - Add v to adj[u]                              │
│       - in_degree[v]++                               │
│                                                      │
│  2. Initialize queue with all in-degree 0 nodes     │
│                                                      │
│  3. While queue not empty:                          │
│     a. node = dequeue()                              │
│     b. Add to result                                 │
│     c. For each neighbor:                           │
│        - Decrement in_degree[neighbor]               │
│        - If in_degree[neighbor] == 0:                │
│            enqueue(neighbor)                         │
│                                                      │
│  4. If len(result) == num_nodes: valid sort         │
│     Else: cycle exists                              │
│                                                      │
│  5. Return result                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Kahn's Algorithm

```python
from collections import deque, defaultdict

def topological_sort(num_nodes, edges):
    """
    Kahn's algorithm for topological sort.
    Returns sorted order or empty list if cycle exists.
    """
    # Build graph and in-degrees
    graph = defaultdict(list)
    in_degree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Start with zero in-degree nodes
    queue = deque()
    for i in range(num_nodes):
        if in_degree[i] == 0:
            queue.append(i)
    
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        # Reduce in-degree of neighbors
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != num_nodes:
        return []  # Cycle exists
    
    return result
```

---

### Implementation: Course Schedule

```python
def can_finish(num_courses, prerequisites):
    """Check if all courses can be completed."""
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    count = 0
    
    while queue:
        course = queue.popleft()
        count += 1
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return count == num_courses
```

---

### Key Pattern Elements

| Element | Purpose | When Updated |
|---------|---------|--------------|
| `in_degree` | Track prerequisites | Initially and when processing |
| `queue` | Ready-to-process nodes | When in-degree becomes 0 |
| `result` | Topological order | Append as nodes processed |
| Cycle check | `len(result) != n` | Graph has cycle |

<!-- back -->
