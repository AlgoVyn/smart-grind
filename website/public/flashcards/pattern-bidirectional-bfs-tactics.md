## Graph - Bidirectional BFS: Tactics

What are the advanced techniques for bidirectional BFS?

<!-- front -->

---

### Tactic 1: Frontier Size Balancing

Always expand the smaller frontier for efficiency:

```python
def bidirectional_bfs_balanced(graph, start, end):
    if start == end:
        return [start]
    
    frontiers = [set([start]), set([end])]
    parents = [{start: None}, {end: None}]
    
    while frontiers[0] and frontiers[1]:
        # CRITICAL: Expand smaller frontier
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
            parents.reverse()
        
        next_level = set()
        for node in frontiers[0]:
            for neighbor in graph[node]:
                if neighbor in parents[0]:
                    continue
                
                if neighbor in frontiers[1]:
                    return reconstruct_path(neighbor, parents)
                
                parents[0][neighbor] = node
                next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return None
```

**Why**: Prevents one side from exploding

---

### Tactic 2: Early Exit Optimization

Check for intersection during expansion, not after:

```python
def bidirectional_bfs_early_exit(graph, start, end):
    frontiers = [set([start]), set([end])]
    visited = [{start}, {end}]
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller
        idx = 0 if len(frontiers[0]) <= len(frontiers[1]) else 1
        other = 1 - idx
        
        next_level = set()
        for node in frontiers[idx]:
            for neighbor in graph[node]:
                if neighbor in visited[idx]:
                    continue
                
                # EARLY CHECK: Is neighbor in other frontier?
                if neighbor in visited[other]:
                    # Found meeting point!
                    return build_path(node, neighbor, visited)
                
                visited[idx].add(neighbor)
                next_level.add(neighbor)
        
        frontiers[idx] = next_level
    
    return None
```

---

### Tactic 3: Word Ladder Specific

```python
def ladder_length(begin_word, end_word, word_list):
    """Optimized for word transformation."""
    if end_word not in word_list:
        return 0
    
    word_set = set(word_list)
    frontiers = [set([begin_word]), set([end_word])]
    length = 1
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller frontier
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers[0], frontiers[1] = frontiers[1], frontiers[0]
        
        next_frontier = set()
        for word in frontiers[0]:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + c + word[i+1:]
                    
                    if next_word in frontiers[1]:
                        return length + 1
                    
                    if next_word in word_set:
                        word_set.remove(next_word)  # Mark visited
                        next_frontier.add(next_word)
        
        frontiers[0] = next_frontier
        length += 1
    
    return 0
```

---

### Tactic 4: Path Reconstruction

```python
def reconstruct_path(meeting_node, parents_start, parents_end):
    """Build complete path from start to end."""
    # Path from start to meeting
    path_from_start = []
    node = meeting_node
    while node is not None:
        path_from_start.append(node)
        node = parents_start.get(node)
    path_from_start.reverse()
    
    # Path from meeting to end
    path_to_end = []
    node = parents_end.get(meeting_node)
    while node is not None:
        path_to_end.append(node)
        node = parents_end.get(node)
    
    return path_from_start + path_to_end
```

---

### Tactic 5: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not swapping frontiers | Uneven expansion | Always expand smaller |
| Wrong visited check | Infinite loops | Check before adding |
| Missing parent tracking | Can't reconstruct | Record parents for both sides |
| Single frontier expansion | Loses bidirectional benefit | Expand both alternately |
| Wrong termination | Missed solutions | Check intersection each expansion |

---

### Tactic 6: Meet-in-the-Middle for Shortest Path

```python
def shortest_path_meet_in_middle(graph, start, end):
    """Generic meet-in-the-middle for unweighted graphs."""
    if start == end:
        return 0
    
    # BFS from both sides
    queue_start = deque([(start, 0)])
    queue_end = deque([(end, 0)])
    
    visited_start = {start: 0}
    visited_end = {end: 0}
    
    while queue_start and queue_end:
        # Expand from start
        if len(queue_start) <= len(queue_end):
            node, dist = queue_start.popleft()
            for neighbor in graph[node]:
                if neighbor in visited_end:
                    return dist + 1 + visited_end[neighbor]
                if neighbor not in visited_start:
                    visited_start[neighbor] = dist + 1
                    queue_start.append((neighbor, dist + 1))
        else:
            # Expand from end (similar)
            pass
    
    return -1
```

<!-- back -->
