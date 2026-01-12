# Bidirectional BFS (BFS optimization for known source & target)

## Overview

Bidirectional BFS performs breadth-first search from both the source and target nodes simultaneously, meeting in the middle. This optimization reduces the search space significantly compared to unidirectional BFS, especially in large graphs where the shortest path is relatively short.

Use this pattern when you need to:
- Find shortest paths in unweighted graphs
- Optimize search when both source and target are known
- Solve puzzles or games with known start and end states
- Reduce time complexity for large state spaces

Benefits include:
- Can be faster than unidirectional BFS
- Finds shortest path in unweighted graphs
- Reduces memory usage in some cases
- Particularly effective for large graphs

## Key Concepts

- **Dual Search**: BFS from source and target simultaneously
- **Meeting Point**: When frontiers intersect
- **Level Tracking**: Track distance from both ends
- **Intersection Check**: Check if node visited from both sides
- **Path Reconstruction**: Combine paths from both searches

## Template

```python
from collections import deque

def bidirectional_bfs(graph, start, target):
    if start == target:
        return [start]
    
    # Forward search from start
    forward_queue = deque([start])
    forward_visited = {start: None}  # node: parent
    
    # Backward search from target
    backward_queue = deque([target])
    backward_visited = {target: None}  # node: parent
    
    while forward_queue and backward_queue:
        # Forward BFS step
        if forward_queue:
            current = forward_queue.popleft()
            for neighbor in graph[current]:
                if neighbor not in forward_visited:
                    forward_visited[neighbor] = current
                    forward_queue.append(neighbor)
                    
                    # Check if meeting point
                    if neighbor in backward_visited:
                        return reconstruct_path(forward_visited, backward_visited, neighbor)
        
        # Backward BFS step
        if backward_queue:
            current = backward_queue.popleft()
            for neighbor in graph[current]:
                if neighbor not in backward_visited:
                    backward_visited[neighbor] = current
                    backward_queue.append(neighbor)
                    
                    # Check if meeting point
                    if neighbor in forward_visited:
                        return reconstruct_path(forward_visited, backward_visited, neighbor)
    
    return None  # No path found

def reconstruct_path(forward_visited, backward_visited, meeting_point):
    # Path from start to meeting point
    path = []
    current = meeting_point
    while current is not None:
        path.append(current)
        current = forward_visited[current]
    path.reverse()
    
    # Path from meeting point to target
    current = backward_visited[meeting_point]
    while current is not None:
        path.append(current)
        current = backward_visited[current]
    
    return path

# For state-based problems (like puzzles)
def bidirectional_bfs_states(start, target, get_neighbors, is_valid_state=None):
    if start == target:
        return [start]
    
    forward_queue = deque([start])
    forward_visited = {start: None}
    
    backward_queue = deque([target])
    backward_visited = {target: None}
    
    while forward_queue and backward_queue:
        # Forward
        for _ in range(len(forward_queue)):
            current = forward_queue.popleft()
            for neighbor in get_neighbors(current):
                if is_valid_state and not is_valid_state(neighbor):
                    continue
                if neighbor not in forward_visited:
                    forward_visited[neighbor] = current
                    forward_queue.append(neighbor)
                    if neighbor in backward_visited:
                        return reconstruct_path(forward_visited, backward_visited, neighbor)
        
        # Backward
        for _ in range(len(backward_queue)):
            current = backward_queue.popleft()
            for neighbor in get_neighbors(current):
                if is_valid_state and not is_valid_state(neighbor):
                    continue
                if neighbor not in backward_visited:
                    backward_visited[neighbor] = current
                    backward_queue.append(neighbor)
                    if neighbor in forward_visited:
                        return reconstruct_path(forward_visited, backward_visited, neighbor)
    
    return None
```

## Example Problems

1. **Word Ladder (LeetCode 127)**: Transform one word to another by changing one letter at a time.
2. **Minimum Moves to Reach Target with Rotations (LeetCode 1210)**: Snake movement puzzle.
3. **Open the Lock (LeetCode 752)**: Find minimum turns to open combination lock.

## Time and Space Complexity

- **Time Complexity**: O(b^{d/2}) where b is branching factor, d is depth (vs O(b^d) for unidirectional).
- **Space Complexity**: O(b^{d/2}) for the queues and visited sets.

## Common Pitfalls

- Not checking for intersection at each step
- Incorrect path reconstruction
- Forgetting to handle case where start == target
- Using bidirectional when graph is very sparse or dense
- Not implementing state validation for complex problems