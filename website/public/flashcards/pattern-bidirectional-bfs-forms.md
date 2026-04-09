## Graph - Bidirectional BFS: Forms

What are the different variations of bidirectional BFS?

<!-- front -->

---

### Form 1: Standard Bidirectional BFS

```python
def bidirectional_bfs(graph, start, end):
    """Find shortest path between start and end."""
    if start == end:
        return [start]
    
    frontiers = [set([start]), set([end])]
    parents = [{start: None}, {end: None}]
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller frontier
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
            parents.reverse()
        
        next_level = set()
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in parents[0]:
                    continue
                
                if neighbor in frontiers[1]:
                    return reconstruct_path(neighbor, parents)
                
                parents[0][neighbor] = node
                next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return None
```

---

### Form 2: Distance Only (No Path)

```python
def bidirectional_bfs_distance(graph, start, end):
    """Return shortest distance only."""
    if start == end:
        return 0
    
    frontiers = [set([start]), set([end])]
    visited = [{start}, {end}]
    distance = 0
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers[0], frontiers[1] = frontiers[1], frontiers[0]
            visited[0], visited[1] = visited[1], visited[0]
        
        next_level = set()
        for node in frontiers[0]:
            for neighbor in graph[node]:
                if neighbor in visited[1]:
                    return distance + 1
                if neighbor not in visited[0]:
                    visited[0].add(neighbor)
                    next_level.add(neighbor)
        
        frontiers[0] = next_level
        distance += 1
    
    return -1
```

**Simpler**: No parent tracking needed

---

### Form 3: Word Ladder Style

```python
def word_ladder_bidirectional(begin, end, word_list):
    """Optimized for word transformations."""
    word_set = set(word_list)
    if end not in word_set:
        return 0
    
    frontiers = [set([begin]), set([end])]
    length = 1
    
    while frontiers[0] and frontiers[1]:
        # Always expand smaller
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers[0], frontiers[1] = frontiers[1], frontiers[0]
        
        next_level = set()
        for word in frontiers[0]:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]
                    
                    if new_word in frontiers[1]:
                        return length + 1
                    
                    if new_word in word_set:
                        word_set.remove(new_word)
                        next_level.add(new_word)
        
        frontiers[0] = next_level
        length += 1
    
    return 0
```

---

### Form 4: Multi-End BFS

```python
def multi_end_bfs(graph, start, targets):
    """Find closest target from start."""
    target_set = set(targets)
    
    if start in target_set:
        return start, 0
    
    queue = deque([(start, 0)])
    visited = {start}
    
    while queue:
        node, dist = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor in target_set:
                return neighbor, dist + 1
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return None, -1
```

---

### Form Comparison

| Form | Output | Use Case |
|------|--------|----------|
| Standard | Path | Need full path |
| Distance only | Integer | Just need length |
| Word ladder | Integer | String transformations |
| Multi-end | Target + dist | Any of multiple targets |

<!-- back -->
