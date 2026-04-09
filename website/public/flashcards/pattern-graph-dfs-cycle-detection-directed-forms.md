## Graph DFS - Cycle Detection (Directed): Forms

What are the different variations of cycle detection problems?

<!-- front -->

---

### Form 1: Basic Cycle Detection (Boolean)

Simply return True/False if cycle exists.

```python
def has_cycle(graph: List[List[int]]) -> bool:
    """
    LeetCode 207 variation: Return True if cycle exists.
    """
    n = len(graph)
    visit = [0] * n
    
    def dfs(node: int) -> bool:
        if visit[node] == 1:
            return True
        if visit[node] == 2:
            return False
        
        visit[node] = 1
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        visit[node] = 2
        return False
    
    for node in range(n):
        if visit[node] == 0 and dfs(node):
            return True
    return False

# Usage: graph = [[1], [2], [0]]  # 0→1→2→0 cycle
```

---

### Form 2: Course Schedule (Can Finish)

Determine if all courses can be completed (no circular prerequisites).

```python
def can_finish(num_courses: int, prerequisites: List[List[int]]) -> bool:
    """
    LeetCode 207: Course Schedule
    prerequisites[i] = [course, prereq] means prereq → course
    """
    # Build graph: prereq -> list of courses that need it
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    visit = [0] * num_courses
    
    def dfs(course: int) -> bool:
        if visit[course] == 1:  # Currently taking - cycle!
            return False
        if visit[course] == 2:  # Already completed
            return True
        
        visit[course] = 1  # Mark as taking
        for next_course in graph[course]:
            if not dfs(next_course):
                return False
        visit[course] = 2  # Mark as completed
        return True
    
    for course in range(num_courses):
        if visit[course] == 0:
            if not dfs(course):
                return False
    return True

# Note: True means NO cycle (can finish all courses)
```

---

### Form 3: Find Eventual Safe States

Find all nodes that are not part of any cycle.

```python
def eventual_safe_nodes(graph: List[List[int]]) -> List[int]:
    """
    LeetCode 802: Find Eventual Safe States
    Safe node = not in any cycle, all paths lead to terminal node.
    """
    n = len(graph)
    visit = [0] * n  # 0=unvisited, 1=visiting, 2=safe, 3=unsafe
    
    def dfs(node: int) -> bool:
        if visit[node] == 1:  # In cycle
            visit[node] = 3
            return False
        if visit[node] in (2, 3):  # Already determined
            return visit[node] == 2
        
        visit[node] = 1
        for neighbor in graph[node]:
            if not dfs(neighbor):
                visit[node] = 3  # Mark unsafe
                return False
        
        visit[node] = 2  # Mark safe
        return True
    
    for node in range(n):
        if visit[node] == 0:
            dfs(node)
    
    # Return all safe nodes (state 2)
    return [i for i in range(n) if visit[i] == 2]
```

---

### Form 4: Course Schedule II (Return Valid Order)

Return topological order or empty list if cycle exists.

```python
def find_order(num_courses: int, prerequisites: List[List[int]]) -> List[int]:
    """
    LeetCode 210: Course Schedule II
    Return valid ordering to finish all courses, or [] if impossible.
    Uses Kahn's algorithm (BFS).
    """
    from collections import deque
    
    graph = [[] for _ in range(num_courses)]
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
    
    # If cycle exists, not all courses will be processed
    return result if len(result) == num_courses else []
```

---

### Form 5: Alien Dictionary (Topological Sort with Constraints)

Derive character order from sorted words (cycle = invalid input).

```python
def alien_order(words: List[str]) -> str:
    """
    LeetCode 269: Alien Dictionary
    Return lexicographical order of characters, or "" if invalid.
    """
    from collections import deque
    
    # Build graph from adjacent word comparisons
    graph = {c: [] for word in words for c in word}
    indegree = {c: 0 for c in graph}
    
    for i in range(len(words) - 1):
        word1, word2 = words[i], words[i + 1]
        min_len = min(len(word1), len(word2))
        
        # Check for invalid: prefix case ("abc" before "ab")
        if len(word1) > len(word2) and word1[:min_len] == word2[:min_len]:
            return ""
        
        for j in range(min_len):
            if word1[j] != word2[j]:
                graph[word1[j]].append(word2[j])
                indegree[word2[j]] += 1
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
    
    # If cycle exists, result won't include all characters
    return "".join(result) if len(result) == len(graph) else ""
```

---

### Form 6: Sort Items by Dependencies (Multi-Level)

Sort items with group and item-level dependencies.

```python
def sort_items(n: int, m: int, group: List[int], 
               before_items: List[List[int]]) -> List[int]:
    """
    LeetCode 1203: Sort Items by Groups Respecting Dependencies
    Two-level topological sort: groups first, then items within groups.
    """
    from collections import deque
    
    # Assign standalone items to their own groups
    group_id = m
    for i in range(n):
        if group[i] == -1:
            group[i] = group_id
            group_id += 1
    
    # Build item graph and group graph
    item_graph = [[] for _ in range(n)]
    item_indegree = [0] * n
    group_graph = [[] for _ in range(group_id)]
    group_indegree = [0] * group_id
    
    for cur in range(n):
        for pre in before_items[cur]:
            item_graph[pre].append(cur)
            item_indegree[cur] += 1
            
            if group[cur] != group[pre]:
                group_graph[group[pre]].append(group[cur])
                group_indegree[group[cur]] += 1
    
    def topo_sort(graph, indegree, nodes):
        """Helper: return topological order or empty list if cycle."""
        queue = deque([n for n in nodes if indegree[n] == 0])
        result = []
        
        while queue:
            node = queue.popleft()
            result.append(node)
            for neighbor in graph[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        
        return result if len(result) == len(nodes) else []
    
    # Topological sort on groups
    group_order = topo_sort(group_graph, group_indegree, list(range(group_id)))
    if not group_order:
        return []
    
    # Topological sort on items
    item_order = topo_sort(item_graph, item_indegree, list(range(n)))
    if not item_order:
        return []
    
    # Group items by their group
    items_by_group = [[] for _ in range(group_id)]
    for item in item_order:
        items_by_group[group[item]].append(item)
    
    # Concatenate in group order
    result = []
    for g in group_order:
        result.extend(items_by_group[g])
    
    return result
```

---

### Form Comparison Summary

| Form | Problem | Key Twist | Output |
|------|---------|-----------|--------|
| **Basic** | Generic cycle check | None | Boolean |
| **Course Schedule** | Can finish courses? | prereq → course mapping | Boolean (no cycle = True) |
| **Safe States** | Nodes not in cycles | 4-state tracking | List of safe nodes |
| **Course Order** | Valid ordering | Kahn's algorithm | Ordered list or [] |
| **Alien Dict** | Character order | Build graph from words | String order or "" |
| **Multi-Level** | Group + item deps | Two-level topological sort | Ordered list or [] |

---

### State Tracking Variations by Form

| Form | States | State Meanings |
|------|--------|----------------|
| Basic | 3 | 0=unvisited, 1=visiting, 2=visited |
| Course Schedule | 3 | Same as basic |
| Safe States | 4 | 0=unvisited, 1=visiting, 2=safe, 3=unsafe |
| Course Order | Kahn's | Indegree count (0 = ready to process) |
| Alien Dict | Kahn's | Indegree per character |
| Multi-Level | Kahn's × 2 | Group indegree + item indegree |

<!-- back -->
