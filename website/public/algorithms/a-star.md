# A* Search Algorithm

## Category
Graphs

## Description

A* (A-Star) is a **heuristic-based pathfinding algorithm** that finds the shortest path between nodes in a weighted graph. It combines the guaranteed optimality of Dijkstra's algorithm with the efficiency of greedy best-first search by using a heuristic function to guide the search toward the goal.

The algorithm works by evaluating nodes using the cost function **f(n) = g(n) + h(n)**, where g(n) is the actual cost from the start to node n, and h(n) is the heuristic estimate from n to the goal. This balance allows A* to efficiently explore the most promising paths first while still guaranteeing optimality when using an admissible heuristic. A* is fundamental in game development, robotics, GPS navigation, and any application requiring efficient pathfinding.

---

## Concepts

The A* algorithm is built on several fundamental concepts that make it powerful for pathfinding.

### 1. Cost Functions

| Function | Description | Role |
|----------|-------------|------|
| **g(n)** | Actual cost from start to node n | Ensures optimality |
| **h(n)** | Heuristic estimate from n to goal | Guides search efficiently |
| **f(n)** | Total cost: f(n) = g(n) + h(n) | Evaluation priority |

### 2. Heuristic Properties

| Property | Definition | Guarantee |
|----------|------------|-----------|
| **Admissible** | h(n) ≤ actual_cost(n, goal) | Optimal path found |
| **Consistent** | h(n) ≤ cost(n→n') + h(n') | No re-exploration needed |
| **Informative** | h(n) close to actual cost | Faster search |

### 3. Common Heuristics

| Heuristic | Formula | Best For |
|-----------|---------|----------|
| **Manhattan** | \|x₁-x₂\| + \|y₁-y₂\| | 4-directional grid movement |
| **Euclidean** | √((x₁-x₂)² + (y₁-y₂)²) | Continuous space, any direction |
| **Diagonal/Chebyshev** | max(\|x₁-x₂\|, \|y₁-y₂\|) | 8-directional grid movement |
| **Octile** | max(dx, dy) + (√2-1)*min(dx, dy) | 8-directional with diagonal cost |

### 4. Priority Queue Operations

The open set (frontier) is managed as a priority queue ordered by f(n):

- **Push**: Add new node with its f value
- **Pop**: Remove node with lowest f value (most promising)
- **Update**: If better path found to existing node, update g, f, and parent

---

## Frameworks

Structured approaches for solving pathfinding problems with A*.

### Framework 1: Grid-Based A* Template

```
┌─────────────────────────────────────────────────────┐
│  GRID-BASED A* FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Initialize:                                     │
│     - Create Node for start position                │
│     - g(start) = 0, h(start) = heuristic(start, goal)│
│     - Add start to open set (priority queue)        │
│                                                     │
│  2. While open set not empty:                       │
│     a. current = node with lowest f in open set   │
│     b. If current is goal: reconstruct and return │
│     c. Move current to closed set (visited)       │
│     d. For each neighbor of current:              │
│        - Skip if obstacle or in closed set        │
│        - tentative_g = current.g + movement_cost    │
│        - If neighbor not in open set OR           │
│          tentative_g < neighbor.g:                │
│          * neighbor.g = tentative_g               │
│          * neighbor.h = heuristic(neighbor, goal) │
│          * neighbor.f = neighbor.g + neighbor.h   │
│          * neighbor.parent = current              │
│          * Add/update neighbor in open set       │
│                                                     │
│  3. If open set empty: return no path found        │
└─────────────────────────────────────────────────────┘
```

**When to use**: 2D grid pathfinding, games, robotics.

### Framework 2: Graph-Based A* Template

```
┌─────────────────────────────────────────────────────┐
│  GRAPH-BASED A* FRAMEWORK                           │
├─────────────────────────────────────────────────────┤
│  1. Setup:                                          │
│     - Graph: node → [(neighbor, edge_cost), ...]   │
│     - Heuristic function h(node, goal)             │
│     - Priority queue for open set                   │
│                                                     │
│  2. Main loop:                                      │
│     - Pop minimum f node from open set            │
│     - If goal: reconstruct path using parent map  │
│     - For each (neighbor, cost) of current:       │
│       - new_g = current.g + edge_cost             │
│       - If new_g < g.get(neighbor, ∞):            │
│         * Update g[neighbor] = new_g                │
│         * Update parent[neighbor] = current         │
│         * Add/Update neighbor in open set         │
│                                                     │
│  3. Termination: Return path or failure             │
└─────────────────────────────────────────────────────┘
```

**When to use**: General weighted graphs, road networks, abstract graphs.

### Framework 3: IDA* (Memory-Efficient) Template

```
┌─────────────────────────────────────────────────────┐
│  IDA* FRAMEWORK (Iterative Deepening A*)            │
├─────────────────────────────────────────────────────┤
│  1. Initialize threshold = heuristic(start, goal)   │
│                                                     │
│  2. Loop:                                            │
│     a. result = search(start, 0, threshold)         │
│     b. If result found: return path                 │
│     c. If threshold = ∞: return no path             │
│     d. Update threshold to next minimum f         │
│                                                     │
│  3. Recursive search(node, g, threshold):           │
│     a. f = g + heuristic(node, goal)                │
│     b. If f > threshold: return f (new bound)       │
│     c. If node is goal: return path                 │
│     d. min_next = ∞                                 │
│     e. For each neighbor:                           │
│        - result = search(neighbor, g+cost, bound)   │
│        - If result is path: return path             │
│        - min_next = min(min_next, result)           │
│     f. Return min_next                              │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments, very large graphs.

---

## Forms

Different manifestations of the A* pattern.

### Form 1: Standard A* (Optimal Path)

Standard implementation with admissible heuristic for guaranteed optimality.

| Characteristic | Implementation |
|----------------|----------------|
| Heuristic | Admissible (never overestimates) |
| Optimality | Guaranteed |
| Memory Usage | O(b^d) - stores all explored nodes |
| Speed | Moderate - balances exploration |

### Form 2: Weighted A* (Faster, Suboptimal)

Uses weighted heuristic: f(n) = g(n) + w × h(n) where w > 1.

| Weight | Behavior |
|--------|----------|
| w = 1 | Standard A*, optimal |
| w = 2 | Faster, may be suboptimal |
| w > 2 | Greedy-like, fastest but potentially poor |

Use when speed matters more than absolute optimality.

### Form 3: Dynamic Weighted A*

Adjusts weight based on search progress:

```
Initial: w = 1 (optimal)
As search progresses: gradually increase w
Near goal: w high (fast convergence)
```

### Form 4: Multi-Goal A*

For finding paths to multiple goals:

| Approach | Strategy |
|----------|----------|
| Sequential | Run A* for each goal separately |
| Multi-goal | Track distance to all goals in heuristic |
| Meeting point | Search from both ends simultaneously |

### Form 5: Anytime A*

Provides suboptimal paths quickly, then improves:

```
First iteration: Weighted A* (fast, suboptimal)
Second iteration: Reduce weight, reuse information
Continue until optimal or time runs out
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Manhattan Distance Heuristic

```python
def manhattan_distance(a: tuple[int, int], b: tuple[int, int]) -> int:
    """Manhattan distance for 4-directional grid movement."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])
```

**When to use**: Grid with only horizontal/vertical movement.

### Tactic 2: Euclidean Distance Heuristic

```python
import math

def euclidean_distance(a: tuple[int, int], b: tuple[int, int]) -> float:
    """Euclidean distance for continuous or 8-directional movement."""
    return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)
```

**When to use**: Any-directional movement, continuous spaces.

### Tactic 3: Diagonal Distance Heuristic

```python
def diagonal_distance(a: tuple[int, int], b: tuple[int, int]) -> int:
    """Diagonal/Chebyshev distance for 8-directional movement."""
    dx = abs(a[0] - b[0])
    dy = abs(a[1] - b[1])
    return max(dx, dy)
```

**When to use**: Grid allowing diagonal moves with uniform cost.

### Tactic 4: Path Reconstruction

```python
def reconstruct_path(current_node) -> list:
    """Reconstruct path from start to goal by following parents."""
    path = []
    while current_node:
        path.append(current_node.position)
        current_node = current_node.parent
    return path[::-1]  # Reverse to get start→goal
```

### Tactic 5: Tie-Breaking for Faster Search

```python
# When f values are equal, prefer nodes closer to goal
# This breaks ties and reduces search space

def calculate_f(node, goal):
    g = node.g
    h = heuristic(node.position, goal)
    # Add small bias toward goal for tie-breaking
    h *= (1.0 + 1e-6)
    return g + h
```

### Tactic 6: Jump Point Search (Optimization)

For uniform-cost grids, skip over empty space:

```python
def jump(current, direction, goal, grid):
    """Skip to next interesting point in grid."""
    # Implementation of JPS pruning
    # Returns next jump point or None
    pass

# In main loop, use jump() instead of exploring all neighbors
```

### Tactic 7: Hierarchical Pathfinding (HPA*)

```python
# Abstract level: navigate between clusters
# Detailed level: navigate within cluster

class HPAStar:
    def find_path(self, start, goal):
        # 1. Find abstract path between clusters
        abstract_path = self.a_star_abstract(start, goal)
        
        # 2. Refine each abstract edge to detailed path
        detailed_path = []
        for i in range(len(abstract_path) - 1):
            segment = self.a_star_detailed(
                abstract_path[i], 
                abstract_path[i+1]
            )
            detailed_path.extend(segment)
        
        return detailed_path
```

---

## Python Templates

### Template 1: Grid-Based A* Pathfinding

```python
import heapq
from typing import List, Tuple, Optional

class Node:
    """Represents a node in the grid for A* pathfinding."""
    
    def __init__(self, position: Tuple[int, int], parent: Optional['Node'] = None):
        self.position = position
        self.parent = parent
        self.g = 0  # Cost from start to this node
        self.h = 0  # Heuristic cost from this node to goal
        self.f = 0  # Total cost: g + h
    
    def __lt__(self, other: 'Node') -> bool:
        return self.f < other.f
    
    def __eq__(self, other: 'Node') -> bool:
        return self.position == other.position
    
    def __hash__(self) -> int:
        return hash(self.position)


def manhattan(a: Tuple[int, int], b: Tuple[int, int]) -> int:
    """Manhattan distance heuristic."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def a_star(grid: List[List[int]], start: Tuple[int, int], 
           goal: Tuple[int, int]) -> Optional[List[Tuple[int, int]]]:
    """
    A* pathfinding algorithm for 2D grids.
    
    Args:
        grid: 2D grid where 0 = walkable, 1 = obstacle
        start: Starting position as (row, col)
        goal: Goal position as (row, col)
    
    Returns:
        List of positions forming the path, or None if no path exists
    
    Time: O(b^d) where b is branching factor, d is depth
    Space: O(b^d) for open and closed sets
    """
    rows, cols = len(grid), len(grid[0])
    
    # Validate positions
    if not (0 <= start[0] < rows and 0 <= start[1] < cols):
        return None
    if not (0 <= goal[0] < rows and 0 <= goal[1] < cols):
        return None
    if grid[start[0]][start[1]] == 1 or grid[goal[0]][goal[1]] == 1:
        return None
    
    # 4-directional movement
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Open and closed sets
    open_set: List[Node] = []
    closed_set = set()
    
    # Create start node
    start_node = Node(start)
    start_node.h = manhattan(start, goal)
    start_node.f = start_node.g + start_node.h
    heapq.heappush(open_set, start_node)
    
    # Track nodes by position
    open_dict = {start: start_node}
    
    while open_set:
        current = heapq.heappop(open_set)
        current_pos = current.position
        
        if current_pos in open_dict:
            del open_dict[current_pos]
        
        # Check if goal reached
        if current_pos == goal:
            path = []
            node = current
            while node:
                path.append(node.position)
                node = node.parent
            return path[::-1]
        
        closed_set.add(current_pos)
        
        # Explore neighbors
        for direction in directions:
            new_pos = (current_pos[0] + direction[0], 
                      current_pos[1] + direction[1])
            
            # Check bounds and obstacles
            if not (0 <= new_pos[0] < rows and 0 <= new_pos[1] < cols):
                continue
            if grid[new_pos[0]][new_pos[1]] == 1 or new_pos in closed_set:
                continue
            
            new_g = current.g + 1
            
            if new_pos not in open_dict or new_g < open_dict[new_pos].g:
                neighbor = Node(new_pos, current)
                neighbor.g = new_g
                neighbor.h = manhattan(new_pos, goal)
                neighbor.f = neighbor.g + neighbor.h
                heapq.heappush(open_set, neighbor)
                open_dict[new_pos] = neighbor
    
    return None  # No path found
```

### Template 2: Graph-Based A*

```python
import heapq
from typing import Dict, List, Tuple, Optional

def a_star_graph(graph: Dict[int, List[Tuple[int, int]]], 
                 start: int, goal: int,
                 heuristic: Dict[int, int]) -> Optional[Tuple[List[int], int]]:
    """
    A* for general weighted graphs.
    
    Args:
        graph: Adjacency list {node: [(neighbor, cost), ...]}
        start: Starting node
        goal: Goal node
        heuristic: Estimated cost from each node to goal
    
    Returns:
        Tuple of (path, total_cost) or None if no path
    """
    # Priority queue: (f, g, node, path)
    open_set = [(heuristic[start], 0, start, [start])]
    g_scores = {start: 0}
    
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        
        if current == goal:
            return path, g
        
        # Skip if we've found a better path to current
        if g > g_scores.get(current, float('inf')):
            continue
        
        for neighbor, cost in graph.get(current, []):
            new_g = g + cost
            
            if new_g < g_scores.get(neighbor, float('inf')):
                g_scores[neighbor] = new_g
                new_f = new_g + heuristic.get(neighbor, 0)
                heapq.heappush(open_set, 
                              (new_f, new_g, neighbor, path + [neighbor]))
    
    return None
```

### Template 3: 8-Directional Movement with Diagonal Costs

```python
def a_star_8direction(grid: List[List[int]], 
                      start: Tuple[int, int], 
                      goal: Tuple[int, int]) -> Optional[List[Tuple[int, int]]]:
    """
    A* with 8-directional movement (including diagonals).
    Diagonal movement costs sqrt(2), or approximately 1.414.
    """
    rows, cols = len(grid), len(grid[0])
    
    # 8 directions: 4 cardinal + 4 diagonal
    directions = [
        (-1, 0), (1, 0), (0, -1), (0, 1),  # Cardinal
        (-1, -1), (-1, 1), (1, -1), (1, 1)  # Diagonal
    ]
    
    def get_cost(direction):
        dx, dy = direction
        if dx == 0 or dy == 0:
            return 1  # Cardinal
        return 1.414  # Diagonal (sqrt(2))
    
    def octile_distance(a, b):
        dx = abs(a[0] - b[0])
        dy = abs(a[1] - b[1])
        return max(dx, dy) + (1.414 - 1) * min(dx, dy)
    
    open_set = []
    heapq.heappush(open_set, (octile_distance(start, goal), 0, start, None))
    
    g_scores = {start: 0}
    parents = {}
    closed_set = set()
    
    while open_set:
        f, g, current, parent = heapq.heappop(open_set)
        
        if current in closed_set:
            continue
        
        closed_set.add(current)
        parents[current] = parent
        
        if current == goal:
            # Reconstruct path
            path = []
            node = current
            while node is not None:
                path.append(node)
                node = parents.get(node)
            return path[::-1]
        
        for direction in directions:
            neighbor = (current[0] + direction[0], current[1] + direction[1])
            
            if not (0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols):
                continue
            if grid[neighbor[0]][neighbor[1]] == 1:
                continue
            
            cost = get_cost(direction)
            new_g = g + cost
            
            if new_g < g_scores.get(neighbor, float('inf')):
                g_scores[neighbor] = new_g
                new_f = new_g + octile_distance(neighbor, goal)
                heapq.heappush(open_set, (new_f, new_g, neighbor, current))
    
    return None
```

### Template 4: IDA* (Memory-Efficient)

```python
def ida_star(graph, start, goal, heuristic):
    """
    Iterative Deepening A* - memory efficient version.
    
    Time: Similar to A* in practice
    Space: O(d) where d is solution depth
    """
    
    def search(node, g, threshold, path):
        f = g + heuristic[node]
        
        if f > threshold:
            return f, None  # Return new threshold
        
        if node == goal:
            return f, path  # Found!
        
        min_threshold = float('inf')
        
        for neighbor, cost in graph.get(node, []):
            if neighbor not in path:  # Avoid cycles
                result, solution = search(neighbor, g + cost, 
                                         threshold, path + [neighbor])
                if solution is not None:
                    return result, solution
                if result < min_threshold:
                    min_threshold = result
        
        return min_threshold, None
    
    threshold = heuristic[start]
    path = [start]
    
    while True:
        result, solution = search(start, 0, threshold, path)
        
        if solution is not None:
            return solution
        
        if result == float('inf'):
            return None  # No solution
        
        threshold = result  # Increase threshold for next iteration
```

### Template 5: Multi-Goal A* with Tie-Breaking

```python
def a_star_tie_breaking(grid, start, goal):
    """
    A* with tie-breaking optimization for faster search.
    """
    rows, cols = len(grid), len(grid[0])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Use (f, -tie_breaker, node_id, g, position)
    # Lower tie_breaker value when closer to goal
    counter = 0
    
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
    
    open_set = []
    heapq.heappush(open_set, 
                   (heuristic(start, goal), 0, counter, 0, start, None))
    
    g_scores = {start: 0}
    parents = {}
    closed_set = set()
    
    while open_set:
        f, tie, _, g, current, parent = heapq.heappop(open_set)
        
        if current in closed_set:
            continue
        
        parents[current] = parent
        closed_set.add(current)
        
        if current == goal:
            path = []
            node = current
            while node is not None:
                path.append(node)
                node = parents.get(node)
            return path[::-1], g
        
        for direction in directions:
            neighbor = (current[0] + direction[0], current[1] + direction[1])
            
            if not (0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols):
                continue
            if grid[neighbor[0]][neighbor[1]] == 1 or neighbor in closed_set:
                continue
            
            new_g = g + 1
            
            if new_g < g_scores.get(neighbor, float('inf')):
                g_scores[neighbor] = new_g
                h = heuristic(neighbor, goal)
                # Tie-breaker: prefer nodes closer to goal
                tie_breaker = -h
                counter += 1
                heapq.heappush(open_set, 
                             (new_g + h, tie_breaker, counter, new_g, neighbor, current))
    
    return None, 0
```

---

## When to Use

Use the A* algorithm when you need to solve problems involving:

- **Shortest Path in Weighted Graphs**: Finding the optimal route between two points
- **Grid-Based Pathfinding**: Navigation in games, robotics, and mazes
- **Route Planning**: GPS, transportation networks, and logistics
- **Puzzle Solving**: Sliding puzzles, 8-puzzle, 15-puzzle
- **Robot Navigation**: Autonomous movement in known environments

### Comparison with Alternatives

| Algorithm | Guaranteed Optimal | Heuristic | Time Complexity | Space Complexity | Best Use Case |
|-----------|-------------------|-----------|-----------------|------------------|---------------|
| **A*** | ✅ Yes | ✅ Yes | O(b^d) | O(b^d) | Known goal, heuristic available |
| **Dijkstra** | ✅ Yes | ❌ No | O(V²) or O(E log V) | O(V) | Unweighted/unknown goal |
| **Greedy Best-First** | ❌ No | ✅ Yes | O(b^d) | O(b^d) | Fast but not optimal |
| **BFS** | ✅ Yes (unweighted) | ❌ No | O(V + E) | O(V) | Unweighted, shortest path |
| **Bidirectional Search** | ✅ Yes | Optional | O(b^(d/2)) | O(b^(d/2)) | When both ends known |

### When to Choose A* vs Other Algorithms

- **Choose A*** when:
  - You have a good admissible heuristic
  - You need the optimal path
  - The goal location is known
  - The search space is large

- **Choose Dijkstra** when:
  - No heuristic is available
  - You need to find paths to ALL nodes from source
  - Edge weights are not uniform

- **Choose Greedy Best-First** when:
  - Speed is more important than optimality
  - You have a good heuristic
  - Approximate solutions are acceptable

---

## Algorithm Explanation

### Core Concept

The key insight behind A* is the **cost function f(n) = g(n) + h(n)**, which balances:
- **Actual cost g(n)**: The true cost from the start node to node n (like Dijkstra)
- **Heuristic h(n)**: An estimate of the cost from node n to the goal (like Greedy)

By combining both, A* explores nodes that are:
1. Already close to the start (low g)
2. And likely to lead to the goal (low h)

This makes it optimally efficient when using an admissible heuristic.

### How It Works

#### The Algorithm Process:

1. **Initialize**: Add start node to the open set with f(start) = h(start)
2. **Priority Queue**: Always expand the node with the lowest f(n) value
3. **Evaluate Neighbors**: For each neighbor, calculate:
   - g = current.g + edge_weight
   - h = heuristic(neighbor, goal)
   - f = g + h
4. **Track Best Path**: Keep the best g value found for each node
5. **Continue**: Until goal is found or open set is empty

#### Visual Representation

```
Example Grid (0=walkable, 1=obstacle):
[0, 0, 0, 0, 0]
[0, 1, 1, 1, 0]
[0, 0, 0, 1, 0]
[0, 1, 0, 0, 0]
[0, 0, 0, 0, 0]

Start: (0,0), Goal: (4,4)
Heuristic: Manhattan distance

f(n) = g(n) + h(n)
Where:
- g(n) = actual cost from start
- h(n) = |x_goal - x_n| + |y_goal - y_n| (Manhattan)
```

### Key Properties

- **Admissible Heuristic**: Never overestimates the true cost. Satisfies h(n) ≤ actual cost to goal. This guarantees optimality.
- **Consistent/Monotonic Heuristic**: For any node n, h(n) ≤ cost(n to neighbor) + h(neighbor). This guarantees that once a node is visited, we've found the optimal path to it.
- **Optimality**: If h is admissible, A* finds the optimal path
- **Completeness**: Will find a solution if one exists (given finite edges)

### Why It Works

A* works by maintaining two invariants:
1. The open set always contains the most promising unexplored nodes
2. When we expand a node, we know we've found the optimal path to it (with consistent heuristic)

The f(n) function ensures we explore in order of increasing estimated total cost, naturally finding the optimal path without exhaustive search.

### Limitations

- **Memory Intensive**: Stores all visited nodes (open and closed sets)
- **Time can be exponential**: With poor heuristics
- **Requires heuristic function**: Not suitable when no good heuristic exists
- **Not optimal**: With non-admissible heuristics
- **Doesn't handle dynamic changes**: Efficiently (use D* Lite for dynamic obstacles)

---

## Practice Problems

### Problem 1: Shortest Path in Binary Matrix

**Problem:** [LeetCode 1091 - Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

**Description:** Given an n x n binary matrix grid, return the length of the shortest clear path from top-left to bottom-right. A clear path is a path that does not contain any obstacles.

**How to Apply A*:**
- Use BFS for unweighted graph (which is a special case of A*)
- Each cell is a node, 8-directional movement
- Return path length including start cell
- A* can be used with appropriate heuristic for larger grids

---

### Problem 2: Sliding Puzzle

**Problem:** [LeetCode 773 - Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle/)

**Description:** Given a 2x3 board with numbers 0-5, find the minimum moves to reach the solved state [[1,2,3],[4,5,0]].

**How to Apply A*:**
- State space search problem
- Use Manhattan distance of tiles from their goal positions as heuristic
- Each state is a node, tile swaps are edges
- A* guarantees optimal solution with admissible heuristic

---

### Problem 3: Minimum Cost to Make at Least One Valid Path

**Problem:** [LeetCode 1368 - Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/)

**Description:** Given a grid with arrows pointing directions, find minimum cost to reach (m-1, n-1) from (0,0). Cost is 0 if following arrow, 1 otherwise.

**How to Apply A*:**
- Grid with weighted edges (0 or 1 cost)
- Use 0-1 BFS or Dijkstra as A* with h=0
- Manhattan distance as heuristic for weighted A*

---

### Problem 4: Minimum Moves to Move a Box to Target Location

**Problem:** [LeetCode 1263 - Minimum Moves to Move a Box to Target Location](https://leetcode.com/problems/minimum-moves-to-move-a-box-to-target-location/)

**Description:** In a grid, move a box to target position by pushing it. Return minimum pushes needed.

**How to Apply A*:**
- State includes both box position and player position
- Heuristic: Manhattan distance from box to target
- Complex state space requires careful A* implementation

---

### Problem 5: Escape the Ghosts

**Problem:** [LeetCode 789 - Escape The Ghosts](https://leetcode.com/problems/escape-the-ghosts/)

**Description:** You are playing a simplified PACMAN game. You start at point (0, 0), and your destination is (target[0], target[1]). There are several ghosts on the map, the i-th ghost starts at (ghosts[i][0], ghosts[i][1]). Return true if and only if you can reach the destination before any ghost reaches you.

**How to Apply A*:**
- Calculate Manhattan distance from each ghost to target
- Compare your Manhattan distance to the minimum ghost distance
- Simple heuristic evaluation solves the problem

---

## Video Tutorial Links

### Fundamentals

- [A* Pathfinding Algorithm - Introduction (Code Craft)](https://www.youtube.com/watch?v=-L-WgKMFuhE) - Comprehensive introduction to A*
- [A* Search Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=oXy1tHjjet4) - Detailed explanation with visualizations
- [A* Algorithm Implementation (NeetCode)](https://www.youtube.com/watch?v=0lG2UMLNF8A) - Practical implementation guide

### Advanced Topics

- [A* vs Dijkstra vs Greedy Best-First](https://www.youtube.com/watch?v=10LVE_c0w5I) - Comparison of pathfinding algorithms
- [IDA* Algorithm](https://www.youtube.com/watch?v=TH9UHZJl3RQ) - Memory-efficient A*
- [D* Lite Algorithm](https://www.youtube.com/watch?v=Bvafvy1J6CA) - Dynamic replanning

### Problem-Specific

- [LeetCode 1091 Solution - Shortest Path in Binary Matrix](https://www.youtube.com/watch?v=2kg0qEqy0V0)
- [LeetCode 773 Solution - Sliding Puzzle](https://www.youtube.com/watch?v=5YvSstR4aQU)

---

## Follow-up Questions

### Q1: What makes a heuristic "admissible"?

**Answer:** A heuristic is admissible if it **never overestimates** the true cost to reach the goal. Formally: h(n) ≤ actual_cost(n, goal) for all nodes n. This property guarantees that A* will find the optimal path. Examples: Manhattan distance (for 4-directional grid), Euclidean distance, diagonal distance.

### Q2: What is the difference between consistent and admissible heuristics?

**Answer:** 
- **Admissible**: h(n) ≤ actual_cost(n, goal) - guarantees optimal solution
- **Consistent/Monotonic**: h(n) ≤ cost(n, neighbor) + h(neighbor) - guarantees no better path exists after visiting a node

Every consistent heuristic is admissible, but not vice versa. Consistent heuristics prevent re-exploration of nodes.

### Q3: When does A* behave like Dijkstra's algorithm?

**Answer:** When the heuristic h(n) = 0 for all nodes, A* reduces to Dijkstra's algorithm. This happens when:
- No heuristic information is available
- We need shortest paths to all nodes from source

### Q4: How does A* handle weighted graphs with non-uniform edge costs?

**Answer:** The algorithm naturally handles weighted graphs:
- g(n) accumulates the actual edge weights (not just count of nodes)
- The edge weight is added when calculating tentative g: `new_g = current.g + edge_weight`
- Works with any positive edge weights

### Q5: What are the limitations of A*?

**Answer:**
1. **Memory intensive**: Stores all visited nodes
2. **Time can be exponential** with poor heuristics
3. **Requires heuristic function**: Not suitable when no good heuristic exists
4. **Not optimal** with non-admissible heuristics
5. **Doesn't handle dynamic changes** efficiently (use D* Lite)

---

## Summary

A* is a **powerful heuristic-based pathfinding algorithm** that combines the guarantee of optimality from Dijkstra's algorithm with the efficiency of greedy best-first search. Key takeaways:

- **Optimal Path**: Guaranteed when using an admissible heuristic
- **Efficient Search**: Explores fewer nodes than Dijkstra due to heuristic guidance
- **Versatile**: Works for grids, graphs, mazes, and puzzles
- **Heuristic is Key**: Quality of heuristic directly impacts performance

When to use:
- ✅ Shortest path with known goal and available heuristic
- ✅ Grid-based navigation and games
- ✅ Puzzle solving with clear distance metric
- ❌ No heuristic available (use Dijkstra)
- ❌ Very large search spaces without good heuristic (consider IDA*)
- ❌ Dynamic obstacles (use D* Lite)

This algorithm is fundamental in game development, robotics, GPS navigation, and any application requiring efficient pathfinding in known environments.
