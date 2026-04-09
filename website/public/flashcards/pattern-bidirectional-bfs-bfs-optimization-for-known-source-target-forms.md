## Graph - Bidirectional BFS: Forms

What are the different variations of bidirectional BFS?

<!-- front -->

---

### Form 1: Distance Only (No Path)

```python
def bidirectional_bfs_distance(graph, start, end):
    """Return shortest distance only - no path reconstruction."""
    if start == end:
        return 0
    
    frontiers = [set([start]), set([end])]
    distance = 0
    
    while frontiers[0] and frontiers[1]:
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
        
        next_level = set()
        
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in frontiers[1]:
                    return distance + 1
                if neighbor not in frontiers[0]:
                    next_level.add(neighbor)
        
        frontiers[0] = next_level
        distance += 1
    
    return -1  # No path
```

**Use when**: Only need distance, not the actual path.

---

### Form 2: Full Path Reconstruction

```python
def bidirectional_bfs_with_path(graph, start, end):
    """Return the complete shortest path."""
    if start == end:
        return [start]
    
    # Track parents from both sides
    parents_start = {start: None}
    parents_end = {end: None}
    frontiers = [set([start]), set([end])]
    
    while frontiers[0] and frontiers[1]:
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers[0], frontiers[1] = frontiers[1], frontiers[0]
            parents_start, parents_end = parents_end, parents_start
        
        next_level = set()
        
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in frontiers[1]:  # Found!
                    # Reconstruct path
                    path_start = []
                    cur = node
                    while cur:
                        path_start.append(cur)
                        cur = parents_start[cur]
                    path_start.reverse()
                    
                    path_end = []
                    cur = neighbor
                    while cur:
                        path_end.append(cur)
                        cur = parents_end[cur]
                    
                    return path_start + path_end
                
                if neighbor not in parents_start:
                    parents_start[neighbor] = node
                    next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return []
```

**Use when**: Need to return the actual path taken.

---

### Form 3: Word Ladder (Implicit Graph)

```python
def word_ladder(beginWord, endWord, wordList):
    """Word transformation with implicit neighbor generation."""
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0
    
    frontiers = [set([beginWord]), set([endWord])]
    distance = 1
    
    while frontiers[0] and frontiers[1]:
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
        
        next_level = set()
        
        for word in frontiers[0]:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + c + word[i+1:]
                    if next_word in frontiers[1]:
                        return distance + 1
                    if next_word in wordSet:
                        wordSet.remove(next_word)  # Mark visited
                        next_level.add(next_word)
        
        frontiers[0] = next_level
        distance += 1
    
    return 0
```

**Use when**: Neighbors are generated on-the-fly (no explicit graph).

---

### Form 4: All Shortest Paths

```python
def bidirectional_bfs_all_paths(graph, start, end):
    """Find all shortest paths between start and end."""
    if start == end:
        return [[start]]
    
    # Track all parents for each node
    parents_start = {start: [None]}
    parents_end = {end: [None]}
    frontiers = [set([start]), set([end])]
    
    meet_nodes = []
    distance = float('inf')
    
    # First pass: find meeting point and distance
    dist = 0
    while frontiers[0] and frontiers[1] and not meet_nodes:
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
            parents_start, parents_end = parents_end, parents_start
        
        next_level = set()
        
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in frontiers[1]:
                    meet_nodes.append((node, neighbor))
                    distance = dist + 1
                if neighbor not in parents_start:
                    parents_start[neighbor] = [node]
                    next_level.add(neighbor)
                elif neighbor in next_level:
                    parents_start[neighbor].append(node)
        
        frontiers[0] = next_level
        dist += 1
    
    # Second pass: reconstruct all paths using DFS
    # ... (path reconstruction with multiple parents)
```

**Use when**: Need to find all shortest paths, not just one.

---

### Form Comparison

| Form | Use Case | Output | Space |
|------|----------|--------|-------|
| **Distance Only** | Just need length | Integer | O(b^(d/2)) |
| **Path Reconstruction** | Need actual path | List of nodes | O(b^(d/2) * d) |
| **Implicit Graph** | Word/genetic transformations | Integer/List | O(b^(d/2)) |
| **All Paths** | Multiple shortest paths | List of lists | Higher |

<!-- back -->
