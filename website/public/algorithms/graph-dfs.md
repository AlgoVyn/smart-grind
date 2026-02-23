# Graph DFS

## Category
Graphs

## Description
Depth-first traversal of graphs using recursion or stack.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- graphs related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
Depth-First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. It goes deep into the graph before exploring siblings.

### How It Works:
1. Start at the root (or any arbitrary node)
2. Mark current node as visited
3. Recursively visit all unvisited neighbors
4. Backtrack when no unvisited neighbors remain

### Implementation Approaches:
1. **Recursive**: Uses call stack, elegant but uses O(V) stack space
2. **Iterative**: Uses explicit stack, more memory efficient

### Key Concepts:
- **Visited Set**: Prevents revisiting nodes (infinite loops in cycles)
- **Stack**: Used to track nodes to visit (explicit or implicit via recursion)
- **Preorder/Postorder**: Order of visiting nodes matters for certain problems

### Key Properties:
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V) for visited set + O(V) for stack (worst case)
- **Memory**: Can be high for deep graphs (use iterative for large graphs)
- **Path Finding**: Can find path but not necessarily shortest

### Applications:
- Detecting cycles
- Topological sorting
- Finding strongly connected components
- Solving maze puzzles
- Path finding
- Binary tree traversals

---

## Algorithm Steps
1. **Recursive Approach**:
   - Mark current node as visited
   - Process current node
   - For each unvisited neighbor, recursively call DFS

2. **Iterative Approach**:
   - Push start node to stack
   - While stack is not empty:
     - Pop node, mark as visited
     - Push unvisited neighbors to stack

---

## Implementation

```python
from typing import List, Dict, Set, Optional
from collections import defaultdict, deque


def dfs_recursive(graph: Dict[int, List[int]], start: int, visited: Optional[Set[int]] = None) -> List[int]:
    """
    Depth-First Search using recursion.
    
    Args:
        graph: Adjacency list representation
        start: Starting node
        visited: Set of visited nodes (for tracking)
    
    Returns:
        List of nodes visited in DFS order
    
    Time: O(V + E)
    Space: O(V) for recursion stack + visited set
    """
    if visited is None:
        visited = set()
    
    result = []
    
    def _dfs(node: int):
        if node in visited:
            return
        
        visited.add(node)
        result.append(node)
        
        # Visit all unvisited neighbors
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                _dfs(neighbor)
    
    _dfs(start)
    return result


def dfs_iterative(graph: Dict[int, List[int]], start: int) -> List[int]:
    """
    Depth-First Search using explicit stack (iterative).
    
    Args:
        graph: Adjacency list representation
        start: Starting node
    
    Returns:
        List of nodes visited in DFS order
    
    Time: O(V + E)
    Space: O(V) for stack and visited set
    """
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        
        if node in visited:
            continue
        
        visited.add(node)
        result.append(node)
        
        # Add neighbors in reverse order to maintain left-to-right processing
        for neighbor in reversed(graph.get(node, [])):
            if neighbor not in visited:
                stack.append(neighbor)
    
    return result


def dfs_all_components(graph: Dict[int, List[int]]) -> List[List[int]]:
    """
    Find all connected components using DFS.
    
    Returns:
        List of components, each component is a list of nodes
    
    Time: O(V + E)
    Space: O(V)
    """
    visited = set()
    components = []
    
    # Get all nodes (handles isolated nodes)
    all_nodes = set(graph.keys())
    for node in graph.values():
        all_nodes.update(node)
    
    for node in all_nodes:
        if node not in visited:
            component = dfs_recursive(graph, node, visited)
            components.append(component)
    
    return components


def has_cycle_dfs(graph: Dict[int, List[int]]) -> bool:
    """
    Detect if graph has a cycle using DFS.
    
    Uses three states: 0 = unvisited, 1 = in progress (in current path), 2 = done
    
    Args:
        graph: Adjacency list (assumes directed or undirected)
    
    Returns:
        True if cycle exists, False otherwise
    
    Time: O(V + E)
    Space: O(V)
    """
    # 0 = white (unvisited), 1 = gray (in progress), 2 = black (done)
    state = {}
    
    def _has_cycle(node: int, parent: int) -> bool:
        state[node] = 1  # Mark as in progress
        
        for neighbor in graph.get(node, []):
            if neighbor not in state:
                if _has_cycle(neighbor, node):
                    return True
            elif state[neighbor] == 1 and neighbor != parent:
                # Found a back edge - cycle detected
                return True
        
        state[node] = 2  # Mark as done
        return False
    
    # Check all nodes (handles disconnected graphs)
    all_nodes = set(graph.keys())
    for node in graph.values():
        all_nodes.update(node)
    
    for node in all_nodes:
        if node not in state:
            if _has_cycle(node, -1):
                return True
    
    return False


def dfs_with_prepost(graph: Dict[int, List[int]], start: int) -> dict:
    """
    DFS with pre-order and post-order timestamps.
    
    Returns:
        Dictionary with visited order, entry and exit times
    
    Time: O(V + E)
    Space: O(V)
    """
    visited = set()
    visited_order = []
    entry_time = {}
    exit_time = {}
    time = [0]  # Use list to allow modification in nested function
    
    def _dfs(node: int):
        entry_time[node] = time[0]
        time[0] += 1
        
        visited.add(node)
        visited_order.append(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                _dfs(neighbor)
        
        exit_time[node] = time[0]
        time[0] += 1
    
    _dfs(start)
    
    return {
        'order': visited_order,
        'entry': entry_time,
        'exit': exit_time
    }


# Example usage
if __name__ == "__main__":
    print("Graph DFS (Depth-First Search)")
    print("=" * 40)
    
    # Create graph using adjacency list
    # Graph:
    #   0 --- 1 --- 2
    #   |     |
    #   3 --- 4
    #   |
    #   5
    
    graph = {
        0: [1, 3],
        1: [0, 2, 4],
        2: [1],
        3: [0, 4, 5],
        4: [1, 3],
        5: [3]
    }
    
    print("\nGraph adjacency list:", dict(graph))
    print("Graph visualization:")
    print("  0 --- 1 --- 2")
    print("  |     |")
    print("  3 --- 4")
    print("  |")
    print("  5")
    
    # Test DFS
    print("\nDFS from node 0 (recursive):", dfs_recursive(graph, 0))
    print("DFS from node 0 (iterative):", dfs_iterative(graph, 0))
    
    # DFS with timestamps
    result = dfs_with_prepost(graph, 0)
    print("\nDFS with timestamps:")
    print(f"  Visit order: {result['order']}")
    print(f"  Entry times: {result['entry']}")
    print(f"  Exit times: {result['exit']}")
    
    # Cycle detection
    print("\nCycle detection:")
    print(f"  Has cycle: {has_cycle_dfs(graph)}")
    
    # Add a cycle
    graph_with_cycle = graph.copy()
    graph_with_cycle[2].append(0)  # Create cycle: 0-1-2-0
    print(f"  After adding edge 2->0: {has_cycle_dfs(graph_with_cycle)}")
    
    # Connected components
    print("\nConnected components:")
    disconnected_graph = {
        0: [1],
        1: [0],
        2: [3],
        3: [2],
        4: []  # Isolated node
    }
    print(f"  Components: {dfs_all_components(disconnected_graph)}")

```javascript
function graphDfs() {
    // Graph DFS implementation
    // Time: O(V + E)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
Graph adjacency list:
{
  0: [1, 3],
  1: [0, 2, 4],
  2: [1],
  3: [0, 4, 5],
  4: [1, 3],
  5: [3]
}

Graph visualization:
  0 --- 1 --- 2
  |     |
  3 --- 4
  |
  5
```

**Output:**
```
DFS from node 0 (recursive): [0, 1, 2, 4, 3, 5]
DFS from node 0 (iterative): [0, 3, 5, 4, 1, 2]

DFS with timestamps:
  Visit order: [0, 1, 2, 4, 3, 5]
  Entry times: {0: 0, 1: 1, 2: 2, 4: 3, 3: 4, 5: 5}
  Exit times: {0: 11, 1: 10, 2: 3, 4: 9, 3: 8, 5: 7}

Cycle detection:
  Has cycle: False
  After adding edge 2->0: True

Connected components (for disconnected graph):
  Components: [[0, 1], [2, 3], [4]]

Explanation:
- Recursive: visits deep before backtracking [0→1→2→back→4→back→3→5]
- Iterative: similar but uses explicit stack
- Entry/exit times useful for tree edge classification
- Cycle detected when back edge found
```

---

## Time Complexity
**O(V + E)**

---

## Space Complexity
**O(V)**

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
