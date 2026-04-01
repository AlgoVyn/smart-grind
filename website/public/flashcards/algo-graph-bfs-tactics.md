## Graph BFS: Tactics & Applications

What tactical patterns leverage BFS for problem solving?

<!-- front -->

---

### Tactic 1: Shortest Path in Unweighted Graph

```python
def shortest_path_unweighted(graph, start, targets):
    """
    Find shortest distance from start to all targets
    """
    from collections import deque
    
    queue = deque([start])
    dist = {start: 0}
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)
                
                if neighbor in targets:
                    # Early exit if all targets found
                    targets.remove(neighbor)
                    if not targets:
                        return dist
    
    return dist
```

---

### Tactic 2: Word Ladder / String Transformation

```python
def word_ladder(beginWord, endWord, wordList):
    """
    Find shortest transformation sequence
    Each step changes one letter
    """
    from collections import deque
    
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0
    
    queue = deque([(beginWord, 1)])
    
    while queue:
        word, steps = queue.popleft()
        
        if word == endWord:
            return steps
        
        # Generate all one-letter transformations
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                
                if next_word in wordSet:
                    wordSet.remove(next_word)  # Mark visited
                    queue.append((next_word, steps + 1))
    
    return 0
```

---

### Tactic 3: Bipartite Graph Check

```python
def is_bipartite(graph):
    """
    Check if graph is 2-colorable using BFS
    """
    from collections import deque
    
    n = len(graph)
    color = [-1] * n  # -1 = uncolored, 0/1 = colors
    
    for start in range(n):
        if color[start] != -1:
            continue
        
        queue = deque([start])
        color[start] = 0
        
        while queue:
            node = queue.popleft()
            
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False  # Same color adjacent
    
    return True
```

---

### Tactic 4: Minimum Knight Moves

```python
def min_knight_moves(x, y):
    """
    Minimum moves for knight to reach (x, y) from (0, 0)
    Use BFS with symmetry optimization
    """
    from collections import deque
    
    # Symmetry: only consider first quadrant
    x, y = abs(x), abs(y)
    if x < y:
        x, y = y, x
    
    # Special case: symmetric position needs 4 moves
    if x == 1 and y == 0:
        return 3
    if x == 2 and y == 2:
        return 4
    
    moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]
    
    visited = set([(0, 0)])
    queue = deque([(0, 0, 0)])
    
    while queue:
        cx, cy, steps = queue.popleft()
        
        if cx == x and cy == y:
            return steps
        
        for dx, dy in moves:
            nx, ny = cx + dx, cy + dy
            
            # Pruning: don't explore too far
            if (nx, ny) not in visited and -2 <= nx <= x + 2 and -2 <= ny <= y + 2:
                visited.add((nx, ny))
                queue.append((nx, ny, steps + 1))
    
    return -1
```

---

### Tactic 5: Sliding Puzzle / 8-Puzzle Solver

```python
def sliding_puzzle_solver(board):
    """
    Solve 2x3 sliding puzzle using BFS
    State space: 6! = 720 states
    """
    from collections import deque
    
    target = (1, 2, 3, 4, 5, 0)  # Flattened target
    
    # Convert board to tuple (hashable)
    start = tuple(board[i][j] for i in range(2) for j in range(3))
    
    if start == target:
        return 0
    
    # Precompute neighbors for each position
    neighbors = {
        0: [1, 3],
        1: [0, 2, 4],
        2: [1, 5],
        3: [0, 4],
        4: [1, 3, 5],
        5: [2, 4]
    }
    
    visited = {start}
    queue = deque([(start, start.index(0), 0)])
    
    while queue:
        state, zero_pos, moves = queue.popleft()
        
        for next_pos in neighbors[zero_pos]:
            # Swap zero with neighbor
            state_list = list(state)
            state_list[zero_pos], state_list[next_pos] = state_list[next_pos], state_list[zero_pos]
            next_state = tuple(state_list)
            
            if next_state == target:
                return moves + 1
            
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, next_pos, moves + 1))
    
    return -1
```

<!-- back -->
