# Bi-Directional BFS

## Category
Graphs & Shortest Path

## Description

Bi-Directional BFS is a powerful graph search algorithm that finds the shortest path between two nodes by simultaneously searching from both the source and target, meeting in the middle. This approach reduces the search space from O(b^d) to O(b^(d/2)), where b is the branching factor and d is the path length, providing exponential speedup over standard BFS.

The algorithm is particularly effective for unweighted graphs where the source and target are both known, such as word ladder problems, sliding puzzles, and game state searches. By expanding two wavefronts instead of one, bi-directional BFS dramatically reduces memory usage and runtime for finding shortest paths.

---

## Concepts

The bi-directional BFS is built on several fundamental concepts that enable its efficiency.

### 1. Search Space Reduction

Standard BFS explores b^d nodes in the worst case. Bi-directional BFS explores from both ends:

| Approach | Nodes Explored | Improvement |
|----------|----------------|-------------|
| **Standard BFS** | b^d | Baseline |
| **Bi-Directional** | 2 × b^(d/2) | Exponential speedup |
| **Ratio** | 2 / b^(d/2) | Dramatic for large d |

Example: b=10, d=6
- Standard: 10^6 = 1,000,000 nodes
- Bi-Dir: 2 × 10^3 = 2,000 nodes
- **500× speedup!**

### 2. Frontier Management

Two frontiers are maintained and expanded alternately:

```
Frontier A (from source):        Frontier B (from target):
Level 0: [S]                      Level 0: [T]
Level 1: neighbors of S           Level 1: neighbors of T
Level 2: ...                      Level 2: ...
```

Key Insight: Always expand the smaller frontier first for balanced search.

### 3. Meeting Detection

The algorithm terminates when frontiers intersect:

| Condition | Action |
|-----------|--------|
| **No intersection** | Continue expanding |
| **Node in both frontiers** | Path found! |
| **One frontier empty** | No path exists |

### 4. Path Reconstruction

When frontiers meet, combine paths:

```
Path = path_from_source[meeting_node] + reverse(path_from_target[meeting_node])
```

---

## Frameworks

Structured approaches for implementing bi-directional BFS.

### Framework 1: Standard Bi-Directional BFS

```
┌─────────────────────────────────────────────────────────────┐
│  BI-DIRECTIONAL BFS FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Input: start node, end node, neighbors function            │
│  Output: shortest distance, or -1 if no path                 │
│                                                              │
│  1. Initialize:                                             │
│     - If start == end: return 0                             │
│     - begin_queue = [start], begin_visited = {start: 0}     │
│     - end_queue = [end], end_visited = {end: 0}             │
│                                                              │
│  2. While both queues not empty:                            │
│     a) Expand the smaller frontier:                        │
│        - If len(begin_queue) > len(end_queue):             │
│            swap(begin_queue, end_queue)                     │
│            swap(begin_visited, end_visited)                 │
│                                                              │
│     b) Expand one level from chosen frontier:              │
│        - For each node in current level:                    │
│            - For each neighbor:                             │
│                - If in other_visited:                       │
│                    return distance                          │
│                - If not in current_visited:                   │
│                    add to queue and visited                  │
│                                                              │
│  3. If loop completes: return -1 (no path)                 │
└─────────────────────────────────────────────────────────────┘
```

### Framework 2: Set-Based Bi-Directional BFS

```
┌─────────────────────────────────────────────────────────────┐
│  SET-BASED BI-DIRECTIONAL BFS                                │
├─────────────────────────────────────────────────────────────┤
│  Optimized for faster "in visited" checks using hash sets     │
│                                                              │
│  1. Initialize:                                             │
│     - begin_set = {start}, end_set = {end}                  │
│     - begin_dist = {start: 0}, end_dist = {end: 0}          │
│     - visited = set()                                       │
│                                                              │
│  2. While both sets not empty:                             │
│     a) Expand smaller set                                   │
│     b) Generate next_level set from current                 │
│     c) Check intersection with other set                    │
│     d) If intersection: return distance                     │
│                                                              │
│  3. This version is often faster in practice                 │
└─────────────────────────────────────────────────────────────┘
```

### Framework 3: Algorithm Selection

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING SHORTEST PATH ALGORITHM                            │
├─────────────────────────────────────────────────────────────┤
│  Use Bi-Directional BFS when:                              │
│    ✓ Source and target are both known                       │
│    ✓ Graph is unweighted (or uniform weights)               │
│    ✓ Graph is large and path length can be long             │
│    ✓ Memory for two frontiers is available                    │
│                                                              │
│  Use Standard BFS when:                                     │
│    ✓ Only source is known, need distances to all nodes      │
│    ✓ Graph is small                                         │
│    ✓ Multiple targets from single source                      │
│                                                              │
│  Use Dijkstra when:                                        │
│    ✓ Edge weights are non-uniform                           │
│                                                              │
│  Use A* when:                                              │
│    ✓ Good heuristic available                               │
│    ✓ Single source, single target                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Standard Distance-Only

Find shortest distance without tracking path.

| Aspect | Details |
|--------|---------|
| **Output** | Integer distance |
| **Time** | O(b^(d/2)) |
| **Space** | O(b^(d/2)) |
| **Use Case** | Word ladder, connectivity check |

### Form 2: With Path Reconstruction

Track parent pointers to reconstruct path.

| Extension | Store parent for each node in both directions |
|-----------|---------------------------------------------|
| **Output** | List of nodes forming path |
| **Space** | 2× for parent storage |

### Form 3: Multi-Goal Bi-Directional

Multiple sources or targets.

| Approach | Run from each source to each target |
|----------|------------------------------------|
| **Complexity** | Higher, but still better than standard |
| **Use Case** | Multiple queries optimization |

---

## Tactics

### Tactic 1: Standard Implementation

```python
from collections import deque

def bidirectional_bfs(begin, end, get_neighbors):
    if begin == end:
        return 0
    
    begin_queue = deque([begin])
    end_queue = deque([end])
    begin_dist = {begin: 0}
    end_dist = {end: 0}
    
    while begin_queue and end_queue:
        if len(begin_queue) > len(end_queue):
            begin_queue, end_queue = end_queue, begin_queue
            begin_dist, end_dist = end_dist, begin_dist
        
        for _ in range(len(begin_queue)):
            current = begin_queue.popleft()
            for neighbor in get_neighbors(current):
                if neighbor in begin_dist:
                    continue
                if neighbor in end_dist:
                    return begin_dist[current] + 1 + end_dist[neighbor]
                begin_dist[neighbor] = begin_dist[current] + 1
                begin_queue.append(neighbor)
    
    return -1
```

### Tactic 2: Word Ladder Implementation

```python
def ladder_length(begin_word, end_word, word_list):
    word_set = set(word_list)
    if end_word not in word_set:
        return 0
    
    begin_set, end_set = {begin_word}, {end_word}
    length = 1
    
    while begin_set and end_set:
        if len(begin_set) > len(end_set):
            begin_set, end_set = end_set, begin_set
        
        next_set = set()
        for word in begin_set:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    if c == word[i]:
                        continue
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in end_set:
                        return length + 1
                    if new_word in word_set:
                        next_set.add(new_word)
        
        begin_set = next_set
        length += 1
    
    return 0
```

### Tactic 3: Sliding Puzzle

```python
def sliding_puzzle(board):
    start = tuple(sum(board, []))
    target = (1, 2, 3, 4, 5, 0)
    
    if start == target:
        return 0
    
    neighbors = {
        0: [1, 3], 1: [0, 2, 4], 2: [1, 5],
        3: [0, 4], 4: [1, 3, 5], 5: [2, 4]
    }
    
    def get_neighbors(state):
        zero_pos = state.index(0)
        for new_pos in neighbors[zero_pos]:
            new_state = list(state)
            new_state[zero_pos], new_state[new_pos] = new_state[new_pos], new_state[zero_pos]
            yield tuple(new_state)
    
    begin_front, end_front = {start}, {target}
    visited = {start, target}
    moves = 0
    
    while begin_front and end_front:
        if len(begin_front) > len(end_front):
            begin_front, end_front = end_front, begin_front
        
        next_front = set()
        for state in begin_front:
            for next_state in get_neighbors(state):
                if next_state in end_front:
                    return moves + 1
                if next_state not in visited:
                    visited.add(next_state)
                    next_front.add(next_state)
        
        begin_front = next_front
        moves += 1
    
    return -1
```

---

## Python Templates

### Template 1: Standard Bi-Directional BFS

```python
from collections import deque
from typing import Callable, Dict

def bidirectional_bfs(begin, end, get_neighbors: Callable) -> int:
    """
    Standard bi-directional BFS for shortest path.
    
    Time: O(b^(d/2)) where b=branching factor, d=distance
    Space: O(b^(d/2))
    """
    if begin == end:
        return 0
    
    begin_queue, end_queue = deque([begin]), deque([end])
    begin_dist: Dict = {begin: 0}
    end_dist: Dict = {end: 0}
    
    while begin_queue and end_queue:
        if len(begin_queue) > len(end_queue):
            begin_queue, end_queue = end_queue, begin_queue
            begin_dist, end_dist = end_dist, begin_dist
        
        for _ in range(len(begin_queue)):
            current = begin_queue.popleft()
            for neighbor in get_neighbors(current):
                if neighbor in begin_dist:
                    continue
                if neighbor in end_dist:
                    return begin_dist[current] + 1 + end_dist[neighbor]
                begin_dist[neighbor] = begin_dist[current] + 1
                begin_queue.append(neighbor)
    
    return -1
```

### Template 2: Set-Based Bi-Directional BFS

```python
def bidirectional_bfs_set(begin, end, get_neighbors: Callable) -> int:
    if begin == end:
        return 0
    
    begin_set, end_set = {begin}, {end}
    visited = {begin, end}
    distance = 0
    
    while begin_set and end_set:
        if len(begin_set) > len(end_set):
            begin_set, end_set = end_set, begin_set
        
        next_set = set()
        for node in begin_set:
            for neighbor in get_neighbors(node):
                if neighbor in end_set:
                    return distance + 1
                if neighbor not in visited:
                    visited.add(neighbor)
                    next_set.add(neighbor)
        
        begin_set = next_set
        distance += 1
    
    return -1
```

### Template 3: Word Ladder Solver

```python
def ladder_length(begin_word: str, end_word: str, word_list: list) -> int:
    word_set = set(word_list)
    if end_word not in word_set:
        return 0
    if begin_word == end_word:
        return 1
    
    def get_neighbors(word):
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                if c != word[i]:
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in word_set:
                        yield new_word
    
    return bidirectional_bfs_set(begin_word, end_word, get_neighbors) + 1
```

---

## When to Use

Use Bi-Directional BFS when:
- Both source and target are known
- Graph is unweighted
- Path length can be long
- Exponential speedup is needed

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| Bi-Directional BFS | O(b^(d/2)) | O(b^(d/2)) | Known source and target |
| Standard BFS | O(b^d) | O(b^d) | Single source, multiple targets |
| Dijkstra | O(E + V log V) | O(V) | Weighted graphs |

---

## Algorithm Explanation

### Core Concept

Bi-Directional BFS simultaneously searches from both the source and target. The two frontiers each only need to explore half the path length, reducing the search space exponentially.

### How It Works

1. Initialize two frontiers from source and target
2. Alternately expand the smaller frontier
3. Check for intersection at each step
4. Return combined distance when frontiers meet

### Visual Example

```
Forward from "hit":         Backward from "cog":
Level 0: [hit]              Level 0: [cog]
Level 1: [hot]              Level 1: [dog, log]

Continue:
Forward Level 2: [dot, lot] from "hot"
Meeting found at dot/log!
```

---

## Practice Problems

### Problem 1: Word Ladder
**Problem:** [LeetCode 127 - Word Ladder](https://leetcode.com/problems/word-ladder/)

### Problem 2: Sliding Puzzle
**Problem:** [LeetCode 773 - Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle/)

### Problem 3: Open the Lock
**Problem:** [LeetCode 752 - Open the Lock](https://leetcode.com/problems/open-the-lock/)

---

## Follow-up Questions

### Q1: What is the speedup over standard BFS?
**Answer:** Exponential - O(b^(d/2)) vs O(b^d). For b=2, d=10: 64 vs 1024 nodes (16× faster).

### Q2: When can't we use bi-directional BFS?
**Answer:** When target is unknown, graph is weighted with varying weights, or backward search is not possible.

### Q3: Does it always find the shortest path?
**Answer:** Yes, when both searches meet, the combined path is guaranteed shortest for unweighted graphs.

---

## Summary

Bi-Directional BFS provides exponential speedup by searching from both ends:
- Reduces search space from O(b^d) to O(b^(d/2))
- Expand smaller frontier first
- Check for intersection at each step
- Ideal for word ladders and state space search
