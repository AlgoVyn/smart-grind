# Bidirectional BFS (BFS optimization for known source & target)

## Overview

The Bidirectional BFS pattern is used to find the shortest path between a known source and target in an unweighted graph more efficiently than standard BFS. By expanding from both the source and target simultaneously, it reduces the search space significantly.

## Key Concepts

- **Two Search Frontiers**: Maintain two sets of visited nodes: one from source, one from target.
- **Level-wise Expansion**: Expand nodes level by level from both directions.
- **Check for Intersection**: Stop when a node is visited by both frontiers.
- **Early Termination**: Can find shortest path much faster than standard BFS.

## Template

```python
from collections import deque

def bidirectional_bfs(graph, start, end):
    if start == end:
        return [start]
    
    # Frontiers: set of nodes visited from start and end
    frontiers = [set([start]), set([end])]
    # Parents: maps node to parent for path reconstruction
    parents = [{start: None}, {end: None}]
    
    while frontiers[0] and frontiers[1]:
        # Always expand the smaller frontier for efficiency
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
            parents.reverse()
        
        next_level = set()
        
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in frontiers[1]:  # Found intersection
                    path1 = []
                    current = node
                    while current:
                        path1.append(current)
                        current = parents[0][current]
                    path1.reverse()
                    path2 = []
                    current = neighbor
                    while current:
                        path2.append(current)
                        current = parents[1][current]
                    return path1 + path2
                if neighbor not in parents[0]:
                    parents[0][neighbor] = node
                    next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return None  # No path exists
```

## Example Problems

1. **Word Ladder (LeetCode 127)**: Find shortest transformation sequence between words.
2. **Minimum Genetic Mutation (LeetCode 433)**: Similar to word ladder.
3. **Shortest Path in Unweighted Graph**: Optimized shortest path search.

## Time and Space Complexity

- **Time Complexity**: O(b^(d/2)), where b is the branching factor and d is the shortest path length (vs O(b^d) for standard BFS).
- **Space Complexity**: O(b^(d/2)), storing visited nodes from both directions.

## Common Pitfalls

- **Not expanding the smaller frontier first**: Reduces efficiency.
- **Forgetting to check for intersection when adding neighbors**: Can miss the shortest path.
- **Incorrect path reconstruction**: Failing to reverse paths correctly.
- **Not handling start == end case**: Misses trivial solution.
- **Failing to handle disconnected graphs**: Returning None when no path exists.
