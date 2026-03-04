# A* Search Algorithm

## Category
Graphs

## Description
A* (A-Star) is a **heuristic-based pathfinding algorithm** that finds the shortest path between nodes in a weighted graph. It combines the guaranteed optimality of Dijkstra's algorithm with the efficiency of greedy best-first search by using a heuristic function to guide the search toward the goal.

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

### Common Heuristics

| Heuristic | Formula | Best For |
|------------|---------|----------|
| **Manhattan** | \|x₁-x₂\| + \|y₁-y₂\| | 4-directional grid movement |
| **Euclidean** | √((x₁-x₂)² + (y₁-y₂)²) | Continuous space, any direction |
| **Diagonal/Chebyshev** | max(\|x₁-x₂\|, \|y₁-y₂\|) | 8-directional grid movement |
| **Octile** | max(dx, dy) + (√2-1)*min(dx, dy) | 8-directional with diagonal cost |

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize Data Structures**
   - Create an open set (priority queue) containing the start node
   - Create a closed set (visited nodes)
   - Set g(start) = 0, f(start) = h(start)
   - Initialize parent pointers for path reconstruction

2. **Main Loop** (while open set is not empty):
   - **Pop** the node with lowest f(n) from open set
   - **Check Goal**: If current node is the goal, reconstruct and return path
   - **Add to Closed Set**: Mark current node as visited
   - **Explore Neighbors**: For each neighbor:
     - If in closed set or is obstacle, skip
     - Calculate tentative g = g(current) + edge weight
     - If not in open set or new g < g(neighbor):
       - Update neighbor's g, h, f, and parent
       - Add to open set if not present

3. **Path Reconstruction** (when goal found):
   - Start from goal node
   - Follow parent pointers back to start
   - Reverse the path

4. **Handle No Path Found**
   - If open set is empty and goal not reached, return empty/no path

---

## Implementation

### Template Code (Grid-Based Pathfinding)

````carousel
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
        
    Time Complexity: O(b^d) where b is branching factor, d is depth
    Space Complexity: O(b^d) for the open and closed sets
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
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <cmath>
#include <algorithm>

using namespace std;

// Structure representing a node in the grid
struct Node {
    pair<int, int> position;
    Node* parent;
    double g;  // Cost from start
    double h;  // Heuristic to goal
    double f;  // Total cost: g + h
    
    Node(pair<int, int> pos, Node* par = nullptr) 
        : position(pos), parent(par), g(0), h(0), f(0) {}
    
    // Comparison for priority queue (min-heap)
    bool operator>(const Node& other) const {
        return f > other.f;
    }
};

// Heuristic functions
double manhattan(pair<int, int> a, pair<int, int> b) {
    return abs(a.first - b.first) + abs(a.second - b.second);
}

double euclidean(pair<int, int> a, pair<int, int> b) {
    return sqrt(pow(a.first - b.first, 2) + pow(a.second - b.second, 2));
}

double diagonal(pair<int, int> a, pair<int, int> b) {
    int dx = abs(a.first - b.first);
    int dy = abs(a.second - b.second);
    return max(dx, dy);
}

// A* pathfinding algorithm
vector<pair<int, int>> aStar(
    const vector<vector<int>>& grid,
    pair<int, int> start,
    pair<int, int> goal
) {
    int rows = grid.size();
    int cols = grid[0].size();
    
    // Validate positions
    if (grid[start.first][start.second] == 1 || grid[goal.first][goal.second] == 1) {
        return {};
    }
    
    // 4-directional movement
    const vector<pair<int, int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    
    // Priority queue (min-heap) ordered by f value
    priority_queue<Node, vector<Node>, greater<Node>> open_set;
    unordered_set<long long> closed_set;
    
    // Create start node
    Node* startNode = new Node(start);
    startNode->h = manhattan(start, goal);
    startNode->f = startNode->g + startNode->h;
    open_set.push(*startNode);
    
    // Track nodes by position
    unordered_map<long long, Node*> open_dict;
    auto posToKey = [&](pair<int, int> p) {
        return (long long)p.first * cols + p.second;
    };
    open_dict[posToKey(start)] = startNode;
    
    while (!open_set.empty()) {
        // Get node with lowest f score
        Node current = open_set.top();
        open_set.pop();
        
        pair<int, int> currPos = current.position;
        long long currKey = posToKey(currPos);
        
        // Check if we reached the goal
        if (currPos == goal) {
            // Reconstruct path
            vector<pair<int, int>> path;
            Node* node = const_cast<Node*>(&current);
            while (node) {
                path.push_back(node->position);
                node = node->parent;
            }
            reverse(path.begin(), path.end());
            return path;
        }
        
        // Add to closed set
        closed_set.insert(currKey);
        if (open_dict.find(currKey) != open_dict.end()) {
            open_dict.erase(currKey);
        }
        
        // Explore neighbors
        for (auto dir : directions) {
            int newRow = currPos.first + dir.first;
            int newCol = currPos.second + dir.second;
            pair<int, int> newPos = {newRow, newCol};
            long long newKey = posToKey(newPos);
            
            // Check bounds
            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
                continue;
            }
            
            // Check if obstacle or already visited
            if (grid[newRow][newCol] == 1 || closed_set.count(newKey)) {
                continue;
            }
            
            // Calculate new g score
            double new_g = current.g + 1;
            
            // Check if this is a better path
            if (open_dict.find(newKey) == open_dict.end()) {
                Node* neighbor = new Node(newPos, const_cast<Node*>(&current));
                neighbor->g = new_g;
                neighbor->h = manhattan(newPos, goal);
                neighbor->f = neighbor->g + neighbor->h;
                open_set.push(*neighbor);
                open_dict[newKey] = neighbor;
            } else if (new_g < open_dict[newKey]->g) {
                open_dict[newKey]->g = new_g;
                open_dict[newKey]->f = open_dict[newKey]->g + open_dict[newKey]->h;
                open_dict[newKey]->parent = const_cast<Node*>(&current);
            }
        }
    }
    
    // No path found
    return {};
}

// Example usage
int main() {
    vector<vector<int>> grid = {
        {0, 0, 0, 0, 0},
        {0, 1, 1, 1, 0},
        {0, 0, 0, 1, 0},
        {0, 1, 0, 0, 0},
        {0, 0, 0, 0, 0}
    };
    
    pair<int, int> start = {0, 0};
    pair<int, int> goal = {4, 4};
    
    vector<pair<int, int>> path = aStar(grid, start, goal);
    
    cout << "Grid:" << endl;
    for (const auto& row : grid) {
        for (int cell : row) {
            cout << cell << " ";
        }
        cout << endl;
    }
    
    cout << "\nStart: (" << start.first << "," << start.second << ")" << endl;
    cout << "Goal: (" << goal.first << "," << goal.second << ")" << endl;
    
    cout << "\nPath found: ";
    for (auto p : path) {
        cout << "(" << p.first << "," << p.second << ") ";
    }
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

public class AStar {
    
    // Node class representing a position in the grid
    static class Node {
        int row, col;
        Node parent;
        double g;  // Cost from start
        double h;  // Heuristic to goal
        double f;  // Total cost: g + h
        
        Node(int row, int col, Node parent) {
            this.row = row;
            this.col = col;
            this.parent = parent;
            this.g = 0;
            this.h = 0;
            this.f = 0;
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Node)) return false;
            Node node = (Node) o;
            return row == node.row && col == node.col;
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(row, col);
        }
    }
    
    // Heuristic functions
    private static double manhattan(int[] a, int[] b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }
    
    private static double euclidean(int[] a, int[] b) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }
    
    private static double diagonal(int[] a, int[] b) {
        int dx = Math.abs(a[0] - b[0]);
        int dy = Math.abs(a[1] - b[1]);
        return Math.max(dx, dy);
    }
    
    /**
     * A* pathfinding algorithm.
     * 
     * @param grid 2D grid where 0 = walkable, 1 = obstacle
     * @param start Starting position as [row, col]
     * @param goal Goal position as [row, col]
     * @return List of positions forming the path, or empty list if no path exists
     */
    public static List<int[]> aStar(int[][] grid, int[] start, int[] goal) {
        int rows = grid.length;
        int cols = grid[0].length;
        
        // Validate positions
        if (grid[start[0]][start[1]] == 1 || grid[goal[0]][goal[1]] == 1) {
            return new ArrayList<>();
        }
        
        // 4-directional movement
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        // Priority queue (min-heap) ordered by f value
        PriorityQueue<Node> openSet = new PriorityQueue<>(
            Comparator.comparingDouble(n -> n.f)
        );
        
        Set<String> closedSet = new HashSet<>();
        Map<String, Node> openDict = new HashMap<>();
        
        // Create start node
        Node startNode = new Node(start[0], start[1], null);
        startNode.g = 0;
        startNode.h = manhattan(start, goal);
        startNode.f = startNode.g + startNode.h;
        openSet.add(startNode);
        openDict.put(start[0] + "," + start[1], startNode);
        
        while (!openSet.isEmpty()) {
            // Get node with lowest f score
            Node current = openSet.poll();
            int[] currentPos = {current.row, current.col};
            String currentKey = current.row + "," + current.col;
            
            // Check if we reached the goal
            if (current.row == goal[0] && current.col == goal[1]) {
                // Reconstruct path
                List<int[]> path = new ArrayList<>();
                Node node = current;
                while (node != null) {
                    path.add(new int[]{node.row, node.col});
                    node = node.parent;
                }
                Collections.reverse(path);
                return path;
            }
            
            // Add to closed set
            closedSet.add(currentKey);
            openDict.remove(currentKey);
            
            // Explore neighbors
            for (int[] dir : directions) {
                int newRow = current.row + dir[0];
                int newCol = current.col + dir[1];
                String newKey = newRow + "," + newCol;
                
                // Check bounds
                if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
                    continue;
                }
                
                // Check if obstacle or already visited
                if (grid[newRow][newCol] == 1 || closedSet.contains(newKey)) {
                    continue;
                }
                
                // Calculate new g score
                double newG = current.g + 1;
                
                // Check if this is a better path
                if (!openDict.containsKey(newKey)) {
                    Node neighbor = new Node(newRow, newCol, current);
                    neighbor.g = newG;
                    neighbor.h = manhattan(new int[]{newRow, newCol}, goal);
                    neighbor.f = neighbor.g + neighbor.h;
                    openSet.add(neighbor);
                    openDict.put(newKey, neighbor);
                } else if (newG < openDict.get(newKey).g) {
                    Node neighbor = openDict.get(newKey);
                    neighbor.g = newG;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                }
            }
        }
        
        // No path found
        return new ArrayList<>();
    }
    
    // Example usage
    public static void main(String[] args) {
        int[][] grid = {
            {0, 0, 0, 0, 0},
            {0, 1, 1, 1, 0},
            {0, 0, 0, 1, 0},
            {0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0}
        };
        
        int[] start = {0, 0};
        int[] goal = {4, 4};
        
        List<int[]> path = aStar(grid, start, goal);
        
        System.out.println("Grid:");
        for (int[] row : grid) {
            System.out.println(Arrays.toString(row));
        }
        
        System.out.println("\nStart: " + Arrays.toString(start));
        System.out.println("Goal: " + Arrays.toString(goal));
        
        System.out.print("\nPath found: ");
        for (int[] p : path) {
            System.out.print(Arrays.toString(p) + " ");
        }
        System.out.println();
    }
}
```

<!-- slide -->
```javascript
/**
 * A* Pathfinding Algorithm Implementation
 * 
 * Time Complexity: O(b^d) where b is branching factor, d is depth
 * Space Complexity: O(b^d) for the open and closed sets
 */

// Node class representing a position in the grid
class Node {
    constructor(position, parent = null) {
        this.position = position;  // [row, col]
        this.parent = parent;
        this.g = 0;  // Cost from start
        this.h = 0;  // Heuristic to goal
        this.f = 0;  // Total cost: g + h
    }
    
    // For priority queue comparison
    compareTo(other) {
        return this.f - other.f;
    }
}

// Heuristic functions
function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function euclidean(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function diagonal(a, b) {
    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);
    return Math.max(dx, dy);
}

function octile(a, b) {
    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
}

/**
 * A* pathfinding algorithm
 * @param {number[][]} grid - 2D grid where 0 = walkable, 1 = obstacle
 * @param {number[]} start - Starting position as [row, col]
 * @param {number[]} goal - Goal position as [row, col]
 * @param {Function} heuristicFunc - Heuristic function (default: manhattan)
 * @returns {number[][]} Array of positions forming the path, or empty array
 */
function aStar(grid, start, goal, heuristicFunc = manhattan) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Validate positions
    if (grid[start[0]][start[1]] === 1 || grid[goal[0]][goal[1]] === 1) {
        return [];
    }
    
    // 4-directional movement (up, down, left, right)
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    // Priority queue using min-heap
    const openSet = new MinHeap((a, b) => a.f - b.f);
    const closedSet = new Set();
    const openDict = new Map();
    
    // Create start node
    const startNode = new Node(start);
    startNode.g = 0;
    startNode.h = heuristicFunc(start, goal);
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);
    openDict.set(start.toString(), startNode);
    
    while (openSet.size() > 0) {
        // Get node with lowest f score
        const currentNode = openSet.pop();
        const currentPos = currentNode.position;
        const currentKey = currentPos.toString();
        
        // Check if we reached the goal
        if (currentPos[0] === goal[0] && currentPos[1] === goal[1]) {
            // Reconstruct path
            const path = [];
            let node = currentNode;
            while (node) {
                path.push(node.position);
                node = node.parent;
            }
            return path.reverse();
        }
        
        // Add to closed set
        closedSet.add(currentKey);
        openDict.delete(currentKey);
        
        // Explore neighbors
        for (const dir of directions) {
            const newRow = currentPos[0] + dir[0];
            const newCol = currentPos[1] + dir[1];
            const newPos = [newRow, newCol];
            const newKey = newPos.toString();
            
            // Check bounds
            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
                continue;
            }
            
            // Check if obstacle or already visited
            if (grid[newRow][newCol] === 1 || closedSet.has(newKey)) {
                continue;
            }
            
            // Calculate new g score
            const newG = currentNode.g + 1;
            
            // Check if this is a better path
            if (!openDict.has(newKey)) {
                const neighborNode = new Node(newPos, currentNode);
                neighborNode.g = newG;
                neighborNode.h = heuristicFunc(newPos, goal);
                neighborNode.f = neighborNode.g + neighborNode.h;
                openSet.push(neighborNode);
                openDict.set(newKey, neighborNode);
            } else if (newG < openDict.get(newKey).g) {
                const neighborNode = openDict.get(newKey);
                neighborNode.g = newG;
                neighborNode.f = neighborNode.g + neighborNode.h;
                neighborNode.parent = currentNode;
            }
        }
    }
    
    // No path found
    return [];
}

// Simple MinHeap implementation
class MinHeap {
    constructor(compareFn = (a, b) => a - b) {
        this.heap = [];
        this.compareFn = compareFn;
    }
    
    push(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compareFn(this.heap[parentIndex], this.heap[index]) <= 0) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;
            
            if (leftChild < this.heap.length && 
                this.compareFn(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }
            if (rightChild < this.heap.length && 
                this.compareFn(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }
            
            if (smallest === index) break;
            [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
            index = smallest;
        }
    }
    
    get size() {
        return this.heap.length;
    }
}

// Example usage
const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

const start = [0, 0];
const goal = [4, 4];

const path = aStar(grid, start, goal);

console.log('Grid:');
grid.forEach(row => console.log(row.join(' ')));

console.log('\nStart:', start);
console.log('Goal:', goal);

console.log('\nPath found:', path);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Best Case** | O(d) | When the heuristic perfectly guides to the goal |
| **Average Case** | O(b^d) | Where b is branching factor, d is solution depth |
| **Worst Case** | O(V + E) | Same as Dijkstra when heuristic provides no guidance |
| **Space** | O(b^d) | All nodes may be stored in open and closed sets |

### Detailed Breakdown

- **b (Branching Factor)**: Average number of successors per node
  - 4-directional grid: b = 4
  - 8-directional grid: b = 8

- **d (Solution Depth)**: Number of steps in the optimal path

- **Factors Affecting Performance**:
  - Quality of heuristic (better heuristic = fewer nodes explored)
  - Density of obstacles
  - Grid size and topology

---

## Space Complexity Analysis

| Data Structure | Space | Description |
|----------------|-------|-------------|
| **Open Set** | O(b^d) | Priority queue may contain many nodes |
| **Closed Set** | O(V) | Set of all visited nodes |
| **Parent Pointers** | O(V) | For path reconstruction |
| **Grid/Graph** | O(V + E) | Storage for the graph itself |

### Space Optimization Techniques

1. **Bidirectional A***: Search from both ends, reducing space to O(b^(d/2))
2. **Iterative Deepening A* (IDA*)**: Uses DFS with depth bound by f-cost
3. **Recursive Best-First Search (RBFS)**: Memory-efficient alternative

---

## Common Variations

### 1. Weighted A* (Weighted Heuristic)

Use h'(n) = w × h(n) where w > 1 to speed up search at the cost of path quality.

```python
def weighted_astar(grid, start, goal, weight=2.0):
    # Use weighted heuristic: f(n) = g(n) + w * h(n)
    # Higher weight = faster but potentially suboptimal
```

### 2. Dynamic Weighting

Start with w=1 (optimal) and gradually increase as we get closer to goal.

### 3. A* with Dynamic Obstacles

When obstacles can appear/disappear during navigation:
- Replan from current position
- Use D* Lite algorithm for incremental replanning

### 4. IDA* (Iterative Deepening A*)

Combines depth-first search with A* heuristic:
- **Space**: O(d) - much more memory efficient
- **Time**: Similar to A* in practice

````carousel
```python
def ida_star(start, goal, heuristic):
    """
    Iterative Deepening A* - memory efficient version
    
    Space: O(d) where d is solution depth
    """
    threshold = heuristic(start, goal)
    
    while True:
        result, threshold = search(start, goal, 0, threshold, heuristic)
        if result is not None:
            return result
        if threshold == float('inf'):
            return None  # No path exists


def search(node, goal, g, threshold, heuristic):
    f = g + heuristic(node, goal)
    if f > threshold:
        return None, f
    if node == goal:
        return [node], 0
    min_threshold = float('inf')
    
    for neighbor in get_neighbors(node):
        result, new_threshold = search(neighbor, goal, g + 1, threshold, heuristic)
        if result is not None:
            result.append(node)
            return result, 0
        min_threshold = min(min_threshold, new_threshold)
    
    return None, min_threshold
```
````

### 5. Bidirectional A*

Search from both start and goal simultaneously:
- **Time**: O(b^(d/2))
- **Space**: O(b^(d/2))
- Requires ability to traverse backwards

### 6. D* Lite

Dynamic A* for incremental replanning when obstacles change:
- Used in robot navigation
- More efficient than re-running A* from scratch

---

## Practice Problems

### Problem 1: Shortest Path in Binary Matrix

**Problem:** [LeetCode 1293 - Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

**Description:** Given an n x n binary matrix grid, find the length of the shortest clear path from top-left to bottom-right. A clear path is a path that does not contain any obstacles.

**How to Apply A***:
- Use BFS for unweighted graph (which is a special case of A*)
- Each cell is a node, 8-directional movement
- Return path length + 1 (including start cell)

---

### Problem 2: Minimum Cost to Reach Destination in Time

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are n cities connected by flights. Find the cheapest price to reach destination within exactly k stops.

**How to Apply A***:
- Use modified Dijkstra's with stops constraint
- Can adapt A* with path cost as g(n) and remaining stops as heuristic

---

### Problem 3: Path With Maximum Minimum Value

**Problem:** [LeetCode 1102 - Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value/)

**Description:** Given a grid, find a path from top-left to bottom-right that maximizes the minimum value along the path.

**How to Apply A***:
- Use max-heap instead of min-heap
- Priority is the maximum of visited cells
- This is essentially a variation of A* called "Best-first search"

---

### Problem 4: Sliding Puzzle

**Problem:** [LeetCode 773 - Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle/)

**Description:** Given a 2x3 board with numbers 0-5, find the minimum moves to reach the solved state [[1,2,3],[4,5,0]].

**How to Apply A***:
- State space search problem
- Use Manhattan distance as heuristic
- Each state is a node, swaps are edges

---

### Problem 5: Word Ladder

**Problem:** [LeetCode 127 - Word Ladder](https://leetcode.com/problems/word-ladder/)

**Description:** Transform start word to end word by changing one letter at a time, where each intermediate word must exist in the word list.

**How to Apply A***:
- Each word is a node
- Edge exists if words differ by one letter
- Use word length as additional heuristic factor

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

- [LeetCode 1293 Solution - Shortest Path in Binary Matrix](https://www.youtube.com/watch?v=2kg0qEqy0V0)
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

### Q6: How would you optimize A* for real-time applications?

**Answer:**
1. **Use better data structures**: Fibonacci heap for priority queue
2. **Jump point search**: Skip unnecessary nodes in uniform-cost grids
3. **Hierarchical pathfinding**: Use abstraction (HPA*)
4. **Parallel search**: Multi-threaded exploration
5. **Anytime algorithms**: Return quickly then improve

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

---

## Related Algorithms

- [Dijkstra's Algorithm](./dijkstra.md) - Without heuristic
- [Greedy Best-First Search](./greedy-best-first.md) - Without g(n)
- [Bidirectional Search](./bidirectional-search.md) - Search from both ends
- [BFS](./graph-bfs.md) - Unweighted shortest path
- [DFS](./graph-dfs.md) - Alternative exploration strategy
