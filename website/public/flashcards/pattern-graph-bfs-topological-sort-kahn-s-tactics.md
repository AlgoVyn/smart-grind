## Graph BFS - Topological Sort (Kahn's Algorithm): Tactics

What are the advanced techniques for Kahn's algorithm?

<!-- front -->

---

### Tactic 1: Lexicographical Smallest Order

Use min-heap instead of queue for deterministic ordering.

```python
import heapq
from collections import defaultdict

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

**Complexity:** Time O(V log V + E) due to heap operations

---

### Tactic 2: Check for Multiple Valid Orderings

If queue has more than one element at any step, multiple valid orders exist.

```python
def has_multiple_orderings(num_nodes: int, edges: List[List[int]]) -> bool:
    """Check if multiple valid topological orderings exist."""
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    
    while queue:
        if len(queue) > 1:
            return True  # Multiple choices = multiple orderings
        
        node = queue.popleft()
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return False
```

---

### Tactic 3: Parallel Course Scheduling (Level-Order)

Group courses by levels to find minimum semesters/time.

```python
def minimum_semesters(num_courses: int, prerequisites: List[List[int]]) -> int:
    """Find minimum number of semesters to complete all courses."""
    graph = defaultdict(list)
    indegree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        indegree[course] += 1
    
    # Current level courses
    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    semesters = 0
    courses_taken = 0
    
    while queue:
        # All courses in queue can be taken this semester
        semesters += 1
        next_queue = deque()
        
        while queue:
            course = queue.popleft()
            courses_taken += 1
            
            for next_course in graph[course]:
                indegree[next_course] -= 1
                if indegree[next_course] == 0:
                    next_queue.append(next_course)
        
        queue = next_queue
    
    return semesters if courses_taken == num_courses else -1
```

---

### Tactic 4: Find All Prerequisites (Reachability)

Build transitive closure to answer prerequisite queries.

```python
def check_prerequisites(num_courses: int, prerequisites: List[List[int]], 
                       queries: List[List[int]]) -> List[bool]:
    """
    Answer queries: is course u a prerequisite for course v?
    LeetCode 1462 - Course Schedule IV
    """
    # Build graph and get topological order
    graph = defaultdict(list)
    indegree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        indegree[course] += 1
    
    # Kahn's algorithm with prerequisite tracking
    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    
    # prereq_set[i] = all prerequisites of course i
    prereq_set = [set() for _ in range(num_courses)]
    
    while queue:
        course = queue.popleft()
        
        for next_course in graph[course]:
            # Add current course and all its prereqs
            prereq_set[next_course].add(course)
            prereq_set[next_course].update(prereq_set[course])
            
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)
    
    # Answer queries
    return [u in prereq_set[v] for u, v in queries]
```

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Solution |
|---------|-------|----------|
| Wrong indegree direction | Counting outgoing edges | Count incoming edges only |
| Missing cycle check | Return incomplete result | Always check `len(result) == n` |
| 0-based vs 1-based indexing | Wrong array size | Match node indexing to problem |
| Not including isolated nodes | Missing nodes in result | Initialize with all indegree-0 nodes |
| Modifying wrong indegree | Decrementing source | Decrement neighbors, not source |
| Using list as queue | O(n) pop(0) | Use `collections.deque` |
| Wrong edge direction | Reversed dependencies | Verify u -> v means u before v |

---

### Tactic 6: Alien Dictionary Character Ordering

Build character order from sorted words.

```python
def alien_order(words: List[str]) -> str:
    """
    Derive alien alphabet order from sorted words.
    LeetCode 269 - Alien Dictionary
    """
    # Build graph of characters
    graph = defaultdict(set)
    indegree = {c: 0 for word in words for c in word}
    
    # Compare adjacent words to find edges
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        
        # Check for invalid case: "abc" before "ab"
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    indegree[w2[j]] += 1
                break
    
    # Kahn's algorithm
    queue = deque([c for c in indegree if indegree[c] == 0])
    result = []
    
    while queue:
        char = queue.popleft()
        result.append(char)
        
        for neighbor in graph[char]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return "".join(result) if len(result) == len(indegree) else ""
```

<!-- back -->
