# A* Search

## Category
Graphs

## Description
Heuristic-based pathfinding algorithm combining Dijkstra with greedy best-first.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- graphs related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
A* (A-Star) is a heuristic-based pathfinding algorithm that combines the benefits of Dijkstra's algorithm with greedy best-first search. It finds the shortest path between nodes in a weighted graph by maintaining a priority queue of nodes to explore, ordered by their f(n) cost.

The key insight of A* is the cost function f(n) = g(n) + h(n), where:
- **g(n)**: The actual cost from the start node to node n (known distance)
- **h(n)**: The heuristic estimated cost from node n to the goal (estimated distance)
- **f(n)**: The estimated total cost through node n

### How It Works:
1. **Open Set**: A priority queue (min-heap) containing nodes to be evaluated, prioritized by f(n)
2. **Closed Set**: A set of nodes that have already been evaluated
3. **Parent Pointers**: Store where we came from to reconstruct the path
4. **Heuristic Function**: Must be admissible (never overestimates the true cost) for optimal results

### Key Properties:
- **Admissible Heuristic**: Never overestimates - satisfies h(n) ≤ actual cost to goal
- **Consistent/Monotonic**: For any node n, h(n) ≤ cost(n to neighbor) + h(neighbor)
- **Optimality**: If h is admissible, A* finds the optimal path
- **Completeness**: Will find a solution if one exists

### Common Heuristics:
- Manhattan distance (for grid with 4-directional movement)
- Euclidean distance (for continuous space)
- Diagonal distance (for 8-directional grid movement)

---

## Algorithm Steps
1. Initialize open set with start node, closed set as empty
2. Set g(start) = 0, f(start) = h(start)
3. While open set is not empty:
   - Pop node with lowest f(n) from open set
   - If node is goal, reconstruct and return path
   - Add node to closed set
   - For each neighbor:
     - If in closed set, skip
     - Calculate tentative g = g(current) + edge weight
     - If not in open set or new g < g(neighbor):
       - Update neighbor's g, f, and parent
       - Add to open set if not present
4. Return empty if no path found

---

## Implementation

```python
import heapq
from typing import List, Tuple, Optional, Dict, Set

class Node:
    """Represents a node in the grid for A* pathfinding."""
    def __init__(self, position: Tuple[int, int], parent: Optional['Node'] = None):
        self.position = position
        self.parent = parent
        self.g: float = 0  # Cost from start to this node
        self.h: float = 0  # Heuristic cost from this node to goal
        self.f: float = 0  # Total cost: g + h
    
    def __lt__(self, other: 'Node') -> bool:
        """Comparison for heapq - lower f value has higher priority."""
        return self.f < other.f
    
    def __eq__(self, other: 'Node') -> bool:
        """Two nodes are equal if they have the same position."""
        return self.position == other.position
    
    def __hash__(self) -> int:
        """Hash function for set membership."""
        return hash(self.position)


def heuristic(a: Tuple[int, int], b: Tuple[int, int]) -> float:
    """
    Calculate Manhattan distance heuristic between two points.
    This is admissible for 4-directional grid movement.
    """
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def a_star(grid: List[List[int]], start: Tuple[int, int], goal: Tuple[int, int]) -> Optional[List[Tuple[int, int]]]:
    """
    A* pathfinding algorithm implementation.
    
    Args:
        grid: 2D grid where 0 = walkable, 1 = obstacle
        start: Starting position as (row, col)
        goal: Goal position as (row, col)
    
    Returns:
        List of positions forming the path, or None if no path exists
    """
    rows, cols = len(grid), len(grid[0])
    
    # Validate start and goal positions
    if not (0 <= start[0] < rows and 0 <= start[1] < cols):
        return None
    if not (0 <= goal[0] < rows and 0 <= goal[1] < cols):
        return None
    if grid[start[0]][start[1]] == 1 or grid[goal[0]][goal[1]] == 1:
        return None
    
    # 4-directional movement (up, down, left, right)
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Initialize open and closed sets
    open_set: List[Node] = []
    closed_set: Set[Tuple[int, int]] = set()
    
    # Create start node
    start_node = Node(start)
    start_node.h = heuristic(start, goal)
    start_node.f = start_node.g + start_node.h
    heapq.heappush(open_set, start_node)
    
    # Track nodes by position for quick lookup
    open_dict: Dict[Tuple[int, int], Node] = {start: start_node}
    
    while open_set:
        # Get node with lowest f score
        current_node = heapq.heappop(open_set)
        current_pos = current_node.position
        
        # Remove from open_dict
        if current_pos in open_dict:
            del open_dict[current_pos]
        
        # Check if we reached the goal
        if current_pos == goal:
            # Reconstruct path
            path = []
            node = current_node
            while node:
                path.append(node.position)
                node = node.parent
            return path[::-1]  # Reverse to get path from start to goal
        
        # Add current to closed set
        closed_set.add(current_pos)
        
        # Explore neighbors
        for direction in directions:
            new_pos = (current_pos[0] + direction[0], current_pos[1] + direction[1])
            
            # Check bounds
            if not (0 <= new_pos[0] < rows and 0 <= new_pos[1] < cols):
                continue
            
            # Check if obstacle or already visited
            if grid[new_pos[0]][new_pos[1]] == 1 or new_pos in closed_set:
                continue
            
            # Calculate new g score
            new_g = current_node.g + 1  # Assuming uniform cost
            
            # Check if this is a better path to this neighbor
            if new_pos not in open_dict:
                # Create new node
                neighbor_node = Node(new_pos, current_node)
                neighbor_node.g = new_g
                neighbor_node.h = heuristic(new_pos, goal)
                neighbor_node.f = neighbor_node.g + neighbor_node.h
                heapq.heappush(open_set, neighbor_node)
                open_dict[new_pos] = neighbor_node
            elif new_g < open_dict[new_pos].g:
                # Update existing node
                neighbor_node = open_dict[new_pos]
                neighbor_node.g = new_g
                neighbor_node.f = neighbor_node.g + neighbor_node.h
                neighbor_node.parent = current_node
    
    # No path found
    return None


# Example usage
if __name__ == "__main__":
    # 0 = walkable, 1 = obstacle
    grid = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
    
    start = (0, 0)
    goal = (4, 4)
    
    path = a_star(grid, start, goal)
    
    print("Grid:")
    for row in grid:
        print(row)
    print(f"\nStart: {start}, Goal: {goal}")
    print(f"Path found: {path}")

```javascript
function aStar() {
    // A* Search implementation
    // Time: O(b^d) where b is branching, d is depth
    // Space: O(b^d)
}
```

---

## Example

**Input:**
```
Grid (0 = walkable, 1 = obstacle):
[[0, 0, 0, 0, 0],
 [0, 1, 1, 1, 0],
 [0, 0, 0, 1, 0],
 [0, 1, 0, 0, 0],
 [0, 0, 0, 0, 0]]
Start: (0, 0)
Goal: (4, 4)
```

**Output:**
```
Path found: [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4), (1, 4), (2, 4), (3, 4), (4, 4)]

Visual representation:
S → → → → ↓
  █ █ █ ↓
        ↓
  █     ↓
        ↓ → → → G
```

---

## Time Complexity
**O(b^d) where b is branching, d is depth**

---

## Space Complexity
**O(b^d)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
