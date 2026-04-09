## Graph BFS - Topological Sort (Kahn's Algorithm): Forms

What are the different variations of topological sort problems?

<!-- front -->

---

### Form 1: Basic Topological Sort

Return valid ordering of nodes.

```python
from collections import deque, defaultdict
from typing import List

def topological_sort(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """Standard Kahn's algorithm - return valid order or empty if cycle."""
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == num_nodes else []
```

**LeetCode:** 210 - Course Schedule II

---

### Form 2: Cycle Detection Only

Check if valid ordering exists (return boolean).

```python
def can_finish(num_courses: int, prerequisites: List[List[int]]) -> bool:
    """
    Course Schedule I - Check if all courses can be completed.
    Returns True if no cycle, False otherwise.
    """
    graph = defaultdict(list)
    indegree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        indegree[course] += 1
    
    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    processed = 0
    
    while queue:
        course = queue.popleft()
        processed += 1
        
        for next_course in graph[course]:
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)
    
    return processed == num_courses
```

**LeetCode:** 207 - Course Schedule

---

### Form 3: Lexicographical Smallest Order

Return smallest valid ordering (use min-heap).

```python
import heapq

def smallest_order(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """Return lexicographically smallest topological order."""
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    # Min-heap for lexicographical order
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

**Use when:** Problem asks for "smallest" or "lexicographically" first valid order.

---

### Form 4: Minimum Time/Parallel Scheduling

Find minimum time with level-order processing.

```python
def minimum_time(n: int, relations: List[List[int]], time: List[int]) -> int:
    """
    Parallel Courses III - Minimum time to complete all courses.
    Each course takes 'time[i]' months.
    """
    graph = defaultdict(list)
    indegree = [0] * n
    
    for prev, next_course in relations:
        graph[prev - 1].append(next_course - 1)  # Convert to 0-based
        indegree[next_course - 1] += 1
    
    # Track max time to reach each course
    max_time = [0] * n
    queue = deque()
    
    for i in range(n):
        if indegree[i] == 0:
            queue.append(i)
            max_time[i] = time[i]  # Start with course duration
    
    while queue:
        course = queue.popleft()
        
        for next_course in graph[course]:
            # Update max time considering all prerequisites
            max_time[next_course] = max(max_time[next_course],
                                        max_time[course] + time[next_course])
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)
    
    return max(max_time)
```

**LeetCode:** 2050 - Parallel Courses III

---

### Form 5: Alien Dictionary Character Order

Derive alphabet order from sorted words.

```python
def alien_order(words: List[str]) -> str:
    """
    Alien Dictionary - Derive character ordering.
    """
    # Build character set
    chars = set()
    for word in words:
        chars.update(word)
    
    graph = defaultdict(set)
    indegree = {c: 0 for c in chars}
    
    # Build edges from adjacent words
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        
        # Invalid: prefix comes after longer word
        if w1[:min_len] == w2[:min_len] and len(w1) > len(w2):
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

**LeetCode:** 269 - Alien Dictionary

---

### Form 6: Recipe Ingredient Order

Find all recipes that can be made from available supplies.

```python
def find_all_recipes(recipes: List[str], ingredients: List[List[str]], 
                     supplies: List[str]) -> List[str]:
    """
    Find All Possible Recipes from Given Supplies.
    """
    # Build graph: ingredient -> recipes that need it
    graph = defaultdict(list)
    indegree = {}
    
    for i, recipe in enumerate(recipes):
        indegree[recipe] = len(ingredients[i])
        for ing in ingredients[i]:
            graph[ing].append(recipe)
    
    # Start with supplies
    queue = deque(supplies)
    available = set(supplies)
    result = []
    
    while queue:
        item = queue.popleft()
        
        for recipe in graph[item]:
            indegree[recipe] -= 1
            if indegree[recipe] == 0:
                result.append(recipe)
                queue.append(recipe)
    
    return result
```

**LeetCode:** 2115 - Find All Possible Recipes from Given Supplies

---

### Form Comparison

| Form | Input | Output | Key Pattern |
|------|-------|--------|-------------|
| Basic | Nodes + edges | Ordering list | Standard Kahn's |
| Cycle check | Prerequisites | Boolean | Count processed nodes |
| Lexicographical | Nodes + edges | Smallest order | Use min-heap |
| Parallel time | Prerequisites + durations | Min time | Track max time per level |
| Alien dict | Sorted words | Character string | Build char graph |
| Recipes | Recipes + ingredients | Possible recipes | Multi-source from supplies |

---

### Form 7: Sequence Reconstruction Verification

Verify if sequence is uniquely reconstructible.

```python
def sequence_reconstruction(nums: List[int], sequences: List[List[int]]) -> bool:
    """
    Verify if nums is the only valid sequence from subsequences.
    """
    n = len(nums)
    graph = defaultdict(list)
    indegree = [0] * (n + 1)
    
    # Build graph from subsequences
    for seq in sequences:
        for i in range(len(seq) - 1):
            graph[seq[i]].append(seq[i + 1])
            indegree[seq[i + 1]] += 1
    
    # Check uniqueness: at each step, exactly one choice
    queue = deque([i for i in range(1, n + 1) if indegree[i] == 0])
    result = []
    
    while queue:
        if len(queue) > 1:
            return False  # Multiple valid orders
        
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return len(result) == n and result == nums
```

**LeetCode:** 444 - Sequence Reconstruction

<!-- back -->
