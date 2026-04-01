## Title: Topological Sort - Tactics

What are specific techniques for topological sorting?

<!-- front -->

---

### Tactic 1: Kahn's Algorithm with Cycle Detection

```python
def topological_sort_kahn(n, edges):
    """Kahn's algorithm with clear cycle detection."""
    from collections import deque
    
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
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

---

### Tactic 2: Lexicographically Smallest Order

```python
import heapq

def topological_sort_lexicographical(n, edges):
    """Produce lexicographically smallest topological order."""
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
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

---

### Tactic 3: Parallel Processing Rounds

```python
def parallel_courses_semesters(n, edges):
    """Find minimum number of semesters to complete all courses."""
    from collections import deque
    
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
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
    
    return max_semester if courses_taken == n else -1
```

---

### Tactic 4: Alien Dictionary (Building Graph from Words)

```python
def alien_dictionary(words):
    """Determine character order from sorted alien dictionary."""
    chars = set(''.join(words))
    graph = {c: [] for c in chars}
    in_degree = {c: 0 for c in chars}
    
    for i in range(len(words) - 1):
        word1, word2 = words[i], words[i + 1]
        min_len = min(len(word1), len(word2))
        
        for j in range(min_len):
            if word1[j] != word2[j]:
                graph[word1[j]].append(word2[j])
                in_degree[word2[j]] += 1
                break
        else:
            if len(word1) > len(word2):
                return ""  # Invalid!
    
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

### Tactic 5: Comparison: Kahn's vs DFS

| Algorithm | Approach | Cycle Detection | Best For |
|-----------|----------|-----------------|----------|
| **Kahn's (BFS)** | Remove sources iteratively | If result < V, cycle exists | General use, explicit detection |
| **DFS-based** | Post-order DFS | Back edge detection | When DFS already in use |

**Choose Kahn's when:** You need easy cycle detection, intuitive level-by-level understanding.
**Choose DFS when:** You're already doing DFS, prefer recursive approaches.

<!-- back -->
