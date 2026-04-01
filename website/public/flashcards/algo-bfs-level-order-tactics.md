## BFS Level Order: Tactics & Tricks

What are the essential tactics for optimizing BFS and solving level-order problems efficiently?

<!-- front -->

---

### Tactic 1: Visited Set Optimization

| Data Structure | Use When | Speed |
|----------------|----------|-------|
| **Python set** | Hashable nodes, general case | O(1) |
| **Boolean array** | Integer IDs 0..N-1 | O(1), cache-friendly |
| **Bitset** | Small N (<64 or <10000) | Very fast, compact |
| **Modify input** | Grid problems, allowed | O(1), no extra space |

**In-place grid marking:**
```python
def bfs_inplace(grid, start):
    rows, cols = len(grid), len(grid[0])
    grid[start[0]][start[1]] = '#'  # Mark as visited
    
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        for nr, nc in neighbors(r, c):
            if grid[nr][nc] != '#':
                grid[nr][nc] = '#'  # Mark visited
                queue.append((nr, nc))
```

---

### Tactic 2: Early Termination

Stop as soon as goal is found:

```python
def bfs_shortest_path(graph, start, goal):
    if start == goal:
        return 0  # Early check
    
    visited = {start}
    queue = deque([(start, 0)])
    
    while queue:
        node, dist = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor == goal:
                return dist + 1  # Early exit
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return -1
```

---

### Tactic 3: Level Size Tracking

Process by levels for special requirements:

```python
levels_processed = 0
while queue:
    level_size = len(queue)
    
    # Do something at each level
    print(f"Processing level {levels_processed}")
    
    for _ in range(level_size):
        node = queue.popleft()
        # ... process node
    
    levels_processed += 1
```

**Applications:**
- Add level separator in output
- Track minimum time/rounds
- Apply level-based operations

---

### Tactic 4: Multi-Source Initialization

```python
# Multiple starting points
def multi_source_bfs(grid, sources):
    queue = deque()
    for r, c in sources:
        queue.append((r, c, 0))  # (row, col, distance)
        visited.add((r, c))
    
    max_dist = 0
    while queue:
        r, c, d = queue.popleft()
        max_dist = max(max_dist, d)
        
        for nr, nc in neighbors(r, c):
            if (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, d + 1))
    
    return max_dist  # Time for all sources to meet/spread
```

---

### Tactic 5: BFS on Implicit Graphs

When graph is too large to build explicitly:

```python
def bfs_implicit(start_state, is_goal, get_neighbors):
    """
    States generated on-the-fly
    """
    visited = {start_state}
    queue = deque([(start_state, 0)])
    
    while queue:
        state, dist = queue.popleft()
        
        if is_goal(state):
            return dist
        
        for next_state in get_neighbors(state):
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, dist + 1))
    
    return -1

# Use for: word ladder, sliding puzzle, chess problems
```

**Key:** `get_neighbors` generates valid next states dynamically.

<!-- back -->
