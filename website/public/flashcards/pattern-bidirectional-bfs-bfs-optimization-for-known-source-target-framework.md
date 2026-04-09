## Graph - Bidirectional BFS: Framework

What is the complete code template for bidirectional BFS?

<!-- front -->

---

### Core Algorithm Framework

```
┌─────────────────────────────────────────────────────────┐
│  BIDIRECTIONAL BFS - TEMPLATE                              │
├─────────────────────────────────────────────────────────┤
│  1. Handle start == end (trivial case)                    │
│  2. Initialize frontiers: set[start], set[end]            │
│  3. Initialize parents: {start: None}, {end: None}        │
│  4. While both frontiers non-empty:                       │
│     a. Expand smaller frontier (optimization)             │
│     b. For each node in current frontier:                 │
│        - Generate all neighbors                           │
│        - If neighbor in other frontier: FOUND             │
│        - If neighbor not visited: add to next level        │
│  5. Reconstruct path from both parent maps                │
│  6. Return None if no intersection found                  │
└─────────────────────────────────────────────────────────┘
```

---

### Standard Implementation

```python
def bidirectional_bfs(graph, start, end):
    """
    Find shortest path between start and end.
    Time: O(b^(d/2)), Space: O(b^(d/2))
    """
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
                if neighbor in frontiers[1]:  # Intersection found
                    return reconstruct_path(node, neighbor, parents)
                
                if neighbor not in parents[0]:
                    parents[0][neighbor] = node
                    next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return None  # No path exists
```

---

### Word Ladder Framework

```python
def bidirectional_bfs_word_ladder(beginWord, endWord, wordList):
    """LeetCode 127 - Word Ladder template."""
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0
    
    frontiers = [set([beginWord]), set([endWord])]
    distance = 1
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller frontier
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
                        wordSet.remove(next_word)
                        next_level.add(next_word)
        
        frontiers[0] = next_level
        distance += 1
    
    return 0
```

---

### Key Pattern Elements

| Element | Purpose | Implementation |
|---------|---------|----------------|
| **Two Frontiers** | Search from both ends | `set[start]`, `set[end]` |
| **Smaller First** | Optimization | `if len(f1) > len(f2): swap` |
| **Parent Maps** | Path reconstruction | `dict[node] = parent` |
| **Intersection Check** | Stop condition | `if neighbor in other_frontier` |
| **Level-by-Level** | Track distance | `next_level` set |

<!-- back -->
