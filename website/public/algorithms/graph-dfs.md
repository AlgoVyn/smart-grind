# Graph DFS

## Category
Graphs

## Description
Depth-First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. It goes deep into the graph before exploring siblings, making it ideal for problems involving path finding, cycle detection, topological sorting, and connected components.

---

## When to Use

Use the DFS algorithm when you need to solve problems involving:

- **Graph Traversal**: Visiting all nodes in a graph
- **Path Finding**: Finding any path between two nodes
- **Cycle Detection**: Detecting cycles in directed or undirected graphs
- **Topological Sorting**: Ordering vertices in a DAG
- **Connected Components**: Finding all connected components in a graph
- **Tree/Graph Memorization**: Solving problems with overlapping subproblems

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| **DFS** | O(V + E) | O(V) | Deep traversal, path finding, cycle detection |
| **BFS** | O(V + E) | O(V) | Shortest path in unweighted graphs, level-order |
| **Dijkstra** | O((V + E) log V) | O(V) | Shortest path with weighted edges |
| **Bellman-Ford** | O(V × E) | O(V) | Negative weights, path counting |

### When to Choose DFS vs BFS

- **Choose DFS** when:
  - You need to explore deep before wide
  - Path existence is sufficient (not necessarily shortest)
  - Memory is limited (can use iterative with explicit stack)
  - Solving problems like: maze solving, topological sort, finding connected components

- **Choose BFS** when:
  - Shortest path in unweighted graph is required
  - Level-by-level exploration is needed
  - Finding minimum number of steps/moves
  - Graph is very wide but shallow

---

## Algorithm Explanation

### Core Concept

Depth-First Search explores a graph by going as far as possible along each branch before backtracking. It uses a **stack** (either call stack via recursion or explicit stack) to keep track of nodes to visit. The key idea is to "go deep" rather than "go wide" - we explore one path completely before trying other paths.

### How It Works

#### Basic Algorithm:
1. Start at the root (or any arbitrary node)
2. Mark current node as visited
3. Recursively visit all unvisited neighbors (or push to stack for iterative)
4. Backtrack when no unvisited neighbors remain

#### Visual Representation

For a graph:
```
    0 --- 1 --- 2
    |     |
    3 --- 4
    |
    5
```

DFS traversal from node 0:
```
Step 1: Visit 0 → mark as visited
Step 2: Visit 1 (neighbor of 0) → mark as visited  
Step 3: Visit 2 (neighbor of 1) → mark as visited
Step 4: Backtrack from 2 (no unvisited neighbors)
Step 5: Visit 4 (neighbor of 1) → mark as visited
Step 6: Backtrack from 4
Step 7: Visit 3 (neighbor of 0) → mark as visited
Step 8: Visit 5 (neighbor of 3) → mark as visited
Step 9: Backtrack from 5 → Done!

Order: [0, 1, 2, 4, 3, 5]
```

### Key Concepts

- **Visited Set**: Prevents revisiting nodes (avoids infinite loops in cyclic graphs)
- **Stack**: Used to track nodes to visit (explicit or implicit via recursion call stack)
- **Preorder/Postorder**: Order of visiting nodes matters for certain problems
- **Entry/Exit Times**: Timestamps useful for tree edge classification and topological sort

### Implementation Approaches

1. **Recursive**: Uses call stack, elegant but uses O(V) stack space
2. **Iterative**: Uses explicit stack, more memory efficient, better for deep graphs

### Applications

- Detecting cycles in graphs
- Topological sorting of DAGs
- Finding strongly connected components
- Solving maze puzzles
- Path finding between two nodes
- Binary tree traversals (in-order, pre-order, post-order)
- Finding connected components
- Word ladder problems

---

## Algorithm Steps

### Recursive Approach

1. **Initialize**: Create a visited set and result list
2. **Mark visited**: Add current node to visited set
3. **Process**: Process current node (add to result, etc.)
4. **Recurse**: For each unvisited neighbor, recursively call DFS
5. **Backtrack**: Return when all neighbors are visited

### Iterative Approach

1. **Initialize**: Create empty visited set, stack, and result list
2. **Push start**: Add starting node to stack
3. **While stack not empty**:
   - Pop node from stack
   - If node not visited:
     - Mark as visited
     - Add to result
     - Push all unvisited neighbors (in reverse order for consistent ordering)
4. **Return**: Return result when stack is empty

### Step-by-Step Example

For graph with adjacency list `{0: [1, 3], 1: [0, 2, 4], ...}`:

| Step | Action | Stack | Visited | Result |
|------|--------|-------|---------|--------|
| 1 | Push 0 | [0] | {} | [] |
| 2 | Pop 0, visit | [] | {0} | [0] |
| 3 | Push 1, 3 | [1, 3] | {0} | [0] |
| 4 | Pop 3, visit | [1] | {0,3} | [0,3] |
| 5 | Push 4, 5 | [1, 4, 5] | {0,3} | [0,3] |
| 6 | Pop 5, visit | [1, 4] | {0,3,5} | [0,3,5] |
| 7 | Pop 4, visit | [1] | {0,3,5,4} | [0,3,5,4] |
| 8 | Pop 1, visit | [] | {0,3,5,4,1} | [0,3,5,4,1] |
| 9 | Push 2 | [2] | {0,3,5,4,1} | [0,3,5,4,1] |
| 10 | Pop 2, visit | [] | {0,3,5,4,1,2} | [0,3,5,4,1,2] |

---

## Implementation

### Template Code (Recursive and Iterative DFS)

````carousel
```python
from typing import List, Dict, Set, Optional
from collections import defaultdict


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
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stack>
#include <unordered_set>
#include <unordered_map>
using namespace std;

/**
 * Graph DFS Implementation
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

// DFS using recursion
vector<int> dfsRecursive(const unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited;
    vector<int> result;
    
    function<void(int)> dfs = [&](int node) {
        if (visited.count(node)) return;
        
        visited.insert(node);
        result.push_back(node);
        
        // Visit all unvisited neighbors
        auto it = graph.find(node);
        if (it != graph.end()) {
            for (int neighbor : it->second) {
                if (!visited.count(neighbor)) {
                    dfs(neighbor);
                }
            }
        }
    };
    
    dfs(start);
    return result;
}

// DFS using explicit stack (iterative)
vector<int> dfsIterative(const unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited;
    stack<int> st;
    vector<int> result;
    
    st.push(start);
    
    while (!st.empty()) {
        int node = st.top();
        st.pop();
        
        if (visited.count(node)) continue;
        
        visited.insert(node);
        result.push_back(node);
        
        // Add neighbors in reverse order
        auto it = graph.find(node);
        if (it != graph.end()) {
            const auto& neighbors = it->second;
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                if (!visited.count(neighbors[i])) {
                    st.push(neighbors[i]);
                }
            }
        }
    }
    
    return result;
}

// Detect cycle in graph using DFS
bool hasCycleDFS(const unordered_map<int, vector<int>>& graph) {
    unordered_map<int, int> state;  // 0 = unvisited, 1 = in progress, 2 = done
    
    function<bool(int, int)> dfs = [&](int node, int parent) -> bool {
        state[node] = 1;  // Mark as in progress
        
        auto it = graph.find(node);
        if (it != graph.end()) {
            for (int neighbor : it->second) {
                if (!state.count(neighbor)) {
                    if (dfs(neighbor, node)) return true;
                } else if (state[neighbor] == 1 && neighbor != parent) {
                    // Found a back edge - cycle detected
                    return true;
                }
            }
        }
        
        state[node] = 2;  // Mark as done
        return false;
    };
    
    // Check all nodes
    unordered_set<int> allNodes;
    for (const auto& pair : graph) {
        allNodes.insert(pair.first);
        for (int n : pair.second) {
            allNodes.insert(n);
        }
    }
    
    for (int node : allNodes) {
        if (!state.count(node)) {
            if (dfs(node, -1)) return true;
        }
    }
    
    return false;
}

// Find all connected components
vector<vector<int>> findAllComponents(const unordered_map<int, vector<int>>& graph) {
    unordered_set<int> visited;
    vector<vector<int>> components;
    
    function<void(int, vector<int>&)> dfs = [&](int node, vector<int>& component) {
        visited.insert(node);
        component.push_back(node);
        
        auto it = graph.find(node);
        if (it != graph.end()) {
            for (int neighbor : it->second) {
                if (!visited.count(neighbor)) {
                    dfs(neighbor, component);
                }
            }
        }
    };
    
    unordered_set<int> allNodes;
    for (const auto& pair : graph) {
        allNodes.insert(pair.first);
        for (int n : pair.second) {
            allNodes.insert(n);
        }
    }
    
    for (int node : allNodes) {
        if (!visited.count(node)) {
            vector<int> component;
            dfs(node, component);
            components.push_back(component);
        }
    }
    
    return components;
}

int main() {
    // Create graph using adjacency list
    unordered_map<int, vector<int>> graph = {
        {0, {1, 3}},
        {1, {0, 2, 4}},
        {2, {1}},
        {3, {0, 4, 5}},
        {4, {1, 3}},
        {5, {3}}
    };
    
    cout << "Graph DFS (Depth-First Search)" << endl;
    cout << "==============================" << endl;
    
    cout << "\nDFS from node 0 (recursive): ";
    vector<int> result1 = dfsRecursive(graph, 0);
    for (int v : result1) cout << v << " ";
    cout << endl;
    
    cout << "DFS from node 0 (iterative): ";
    vector<int> result2 = dfsIterative(graph, 0);
    for (int v : result2) cout << v << " ";
    cout << endl;
    
    cout << "\nCycle detection:" << endl;
    cout << "  Has cycle: " << (hasCycleDFS(graph) ? "Yes" : "No") << endl;
    
    // Add a cycle
    unordered_map<int, vector<int>> graphWithCycle = graph;
    graphWithCycle[2].push_back(0);
    cout << "  After adding edge 2->0: " << (hasCycleDFS(graphWithCycle) ? "Yes" : "No") << endl;
    
    cout << "\nConnected components:" << endl;
    unordered_map<int, vector<int>> disconnectedGraph = {
        {0, {1}},
        {1, {0}},
        {2, {3}},
        {3, {2}},
        {4, {}}
    };
    
    vector<vector<int>> components = findAllComponents(disconnectedGraph);
    for (size_t i = 0; i < components.size(); i++) {
        cout << "  Component " << i + 1 << ": ";
        for (int v : components[i]) cout << v << " ";
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Graph DFS Implementation
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
public class GraphDFS {
    
    // DFS using recursion
    public static List<Integer> dfsRecursive(Map<Integer, List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        
        dfsHelper(graph, start, visited, result);
        return result;
    }
    
    private static void dfsHelper(Map<Integer, List<Integer>> graph, int node, 
                                  Set<Integer> visited, List<Integer> result) {
        if (visited.contains(node)) return;
        
        visited.add(node);
        result.add(node);
        
        List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (int neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                dfsHelper(graph, neighbor, visited, result);
            }
        }
    }
    
    // DFS using explicit stack (iterative)
    public static List<Integer> dfsIterative(Map<Integer, List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Stack<Integer> stack = new Stack<>();
        List<Integer> result = new ArrayList<>();
        
        stack.push(start);
        
        while (!stack.isEmpty()) {
            int node = stack.pop();
            
            if (visited.contains(node)) continue;
            
            visited.add(node);
            result.add(node);
            
            // Add neighbors in reverse order
            List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                if (!visited.contains(neighbors.get(i))) {
                    stack.push(neighbors.get(i));
                }
            }
        }
        
        return result;
    }
    
    // Detect cycle in graph using DFS
    public static boolean hasCycleDFS(Map<Integer, List<Integer>> graph) {
        Map<Integer, Integer> state = new HashMap<>();  // 0 = unvisited, 1 = in progress, 2 = done
        
        // Get all nodes
        Set<Integer> allNodes = new HashSet<>();
        for (Map.Entry<Integer, List<Integer>> entry : graph.entrySet()) {
            allNodes.add(entry.getKey());
            allNodes.addAll(entry.getValue());
        }
        
        for (int node : allNodes) {
            if (!state.containsKey(node)) {
                if (dfsCycleHelper(graph, node, -1, state)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    private static boolean dfsCycleHelper(Map<Integer, List<Integer>> graph, int node, 
                                         int parent, Map<Integer, Integer> state) {
        state.put(node, 1);  // Mark as in progress
        
        List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (int neighbor : neighbors) {
            if (!state.containsKey(neighbor)) {
                if (dfsCycleHelper(graph, neighbor, node, state)) {
                    return true;
                }
            } else if (state.get(neighbor) == 1 && neighbor != parent) {
                // Found a back edge - cycle detected
                return true;
            }
        }
        
        state.put(node, 2);  // Mark as done
        return false;
    }
    
    // Find all connected components
    public static List<List<Integer>> findAllComponents(Map<Integer, List<Integer>> graph) {
        Set<Integer> visited = new HashSet<>();
        List<List<Integer>> components = new ArrayList<>();
        
        // Get all nodes
        Set<Integer> allNodes = new HashSet<>();
        for (Map.Entry<Integer, List<Integer>> entry : graph.entrySet()) {
            allNodes.add(entry.getKey());
            allNodes.addAll(entry.getValue());
        }
        
        for (int node : allNodes) {
            if (!visited.contains(node)) {
                List<Integer> component = new ArrayList<>();
                dfsComponentHelper(graph, node, visited, component);
                components.add(component);
            }
        }
        
        return components;
    }
    
    private static void dfsComponentHelper(Map<Integer, List<Integer>> graph, int node,
                                          Set<Integer> visited, List<Integer> component) {
        visited.add(node);
        component.add(node);
        
        List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (int neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                dfsComponentHelper(graph, neighbor, visited, component);
            }
        }
    }
    
    public static void main(String[] args) {
        // Create graph using adjacency list
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 3));
        graph.put(1, Arrays.asList(0, 2, 4));
        graph.put(2, Arrays.asList(1));
        graph.put(3, Arrays.asList(0, 4, 5));
        graph.put(4, Arrays.asList(1, 3));
        graph.put(5, Arrays.asList(3));
        
        System.out.println("Graph DFS (Depth-First Search)");
        System.out.println("==============================");
        
        System.out.print("\nDFS from node 0 (recursive): ");
        System.out.println(dfsRecursive(graph, 0));
        
        System.out.print("DFS from node 0 (iterative): ");
        System.out.println(dfsIterative(graph, 0));
        
        System.out.println("\nCycle detection:");
        System.out.println("  Has cycle: " + hasCycleDFS(graph));
        
        // Add a cycle
        Map<Integer, List<Integer>> graphWithCycle = new HashMap<>(graph);
        graphWithCycle.put(2, Arrays.asList(1, 0));
        System.out.println("  After adding edge 2->0: " + hasCycleDFS(graphWithCycle));
        
        System.out.println("\nConnected components:");
        Map<Integer, List<Integer>> disconnectedGraph = new HashMap<>();
        disconnectedGraph.put(0, Arrays.asList(1));
        disconnectedGraph.put(1, Arrays.asList(0));
        disconnectedGraph.put(2, Arrays.asList(3));
        disconnectedGraph.put(3, Arrays.asList(2));
        disconnectedGraph.put(4, Collections.emptyList());
        
        List<List<Integer>> components = findAllComponents(disconnectedGraph);
        for (int i = 0; i < components.size(); i++) {
            System.out.println("  Component " + (i + 1) + ": " + components.get(i));
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Graph DFS Implementation
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

// DFS using recursion
function dfsRecursive(graph, start) {
    const visited = new Set();
    const result = [];
    
    function dfs(node) {
        if (visited.has(node)) return;
        
        visited.add(node);
        result.push(node);
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
    }
    
    dfs(start);
    return result;
}

// DFS using explicit stack (iterative)
function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    const result = [];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        if (visited.has(node)) continue;
        
        visited.add(node);
        result.push(node);
        
        // Add neighbors in reverse order
        const neighbors = (graph[node] || []).slice().reverse();
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
        }
    }
    
    return result;
}

// Detect cycle in graph using DFS
function hasCycleDFS(graph) {
    const state = {};  // 0 = unvisited, 1 = in progress, 2 = done
    
    // Get all nodes
    const allNodes = new Set();
    for (const [node, neighbors] of Object.entries(graph)) {
        allNodes.add(parseInt(node));
        neighbors.forEach(n => allNodes.add(n));
    }
    
    function dfs(node, parent) {
        state[node] = 1;  // Mark as in progress
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!(neighbor in state)) {
                if (dfs(neighbor, node)) return true;
            } else if (state[neighbor] === 1 && neighbor !== parent) {
                // Found a back edge - cycle detected
                return true;
            }
        }
        
        state[node] = 2;  // Mark as done
        return false;
    }
    
    for (const node of allNodes) {
        if (!(node in state)) {
            if (dfs(node, -1)) return true;
        }
    }
    
    return false;
}

// Find all connected components
function findAllComponents(graph) {
    const visited = new Set();
    const components = [];
    
    // Get all nodes
    const allNodes = new Set();
    for (const [node, neighbors] of Object.entries(graph)) {
        allNodes.add(parseInt(node));
        neighbors.forEach(n => allNodes.add(n));
    }
    
    function dfs(node, component) {
        visited.add(node);
        component.push(node);
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs(neighbor, component);
            }
        }
    }
    
    for (const node of allNodes) {
        if (!visited.has(node)) {
            const component = [];
            dfs(node, component);
            components.push(component);
        }
    }
    
    return components;
}

// Example usage
const graph = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1],
    3: [0, 4, 5],
    4: [1, 3],
    5: [3]
};

console.log("Graph DFS (Depth-First Search)");
console.log("==============================");

console.log("\nDFS from node 0 (recursive):", dfsRecursive(graph, 0));
console.log("DFS from node 0 (iterative):", dfsIterative(graph, 0));

console.log("\nCycle detection:");
console.log("  Has cycle:", hasCycleDFS(graph));

// Add a cycle
const graphWithCycle = {
    ...graph,
    2: [1, 0]
};
console.log("  After adding edge 2->0:", hasCycleDFS(graphWithCycle));

console.log("\nConnected components:");
const disconnectedGraph = {
    0: [1],
    1: [0],
    2: [3],
    3: [2],
    4: []
};
console.log("  Components:", findAllComponents(disconnectedGraph));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Traversal** | O(V + E) | Visit each vertex and edge once |
| **Cycle Detection** | O(V + E) | DFS with state tracking |
| **Topological Sort** | O(V + E) | DFS-based with ordering |
| **Connected Components** | O(V + E) | Run DFS from unvisited nodes |
| **Path Finding** | O(V + E) | DFS until target found |

### Detailed Breakdown

- **Visited Check**: O(1) using hash set
- **Neighbor Traversal**: Each edge is examined twice (once from each endpoint) for undirected graphs
- **Total**: V (vertices) + E (edges) = O(V + E)

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|----------------|-------------|
| **Visited Set** | O(V) | Stores all visited vertices |
| **Stack (Recursive)** | O(V) | Call stack depth (worst case: linear graph) |
| **Stack (Iterative)** | O(V) | Explicit stack (worst case: linear graph) |
| **Result Array** | O(V) | Stores traversal order |
| **Total** | O(V) | Dominated by above components |

### Space Optimization Tips

1. **Use iterative**: For very deep graphs, avoid stack overflow with iterative version
2. **Early termination**: Stop traversing when target is found (for path existence)
3. **In-place marking**: Modify graph structure if allowed to save visited set space

---

## Common Variations

### 1. DFS with Path Recording

Track the actual path taken during DFS traversal.

````carousel
```python
def dfs_with_path(graph: Dict[int, List[int]], start: int, target: int) -> Optional[List[int]]:
    """
    Find path from start to target using DFS.
    
    Returns:
        Path as list of nodes, or None if no path exists
    
    Time: O(V + E)
    Space: O(V)
    """
    visited = set()
    path = []
    
    def dfs(node: int) -> bool:
        if node == target:
            path.append(node)
            return True
        
        visited.add(node)
        path.append(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
        
        path.pop()  # Backtrack
        return False
    
    if dfs(start):
        return path
    return None
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
using namespace std;

vector<int> dfsWithPath(const unordered_map<int, vector<int>>& graph, int start, int target) {
    unordered_set<int> visited;
    vector<int> path;
    vector<int> result;
    bool found = false;
    
    function<void(int)> dfs = [&](int node) {
        if (found) return;
        if (node == target) {
            path.push_back(node);
            result = path;
            found = true;
            return;
        }
        
        visited.insert(node);
        path.push_back(node);
        
        auto it = graph.find(node);
        if (it != graph.end()) {
            for (int neighbor : it->second) {
                if (!visited.count(neighbor)) {
                    dfs(neighbor);
                    if (found) return;
                }
            }
        }
        
        path.pop_back();  // Backtrack
    };
    
    dfs(start);
    return result;
}
```

<!-- slide -->
```java
import java.util.*;

public class DFSPath {
    public static List<Integer> dfsWithPath(Map<Integer, List<Integer>> graph, int start, int target) {
        Set<Integer> visited = new HashSet<>();
        List<Integer> path = new ArrayList<>();
        List<Integer> result = new ArrayList<>();
        boolean[] found = {false};
        
        dfsHelper(graph, start, target, visited, path, result, found);
        return result;
    }
    
    private static void dfsHelper(Map<Integer, List<Integer>> graph, int node, int target,
                                  Set<Integer> visited, List<Integer> path, 
                                  List<Integer> result, boolean[] found) {
        if (found[0]) return;
        if (node == target) {
            path.add(node);
            result.addAll(path);
            found[0] = true;
            return;
        }
        
        visited.add(node);
        path.add(node);
        
        List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (int neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                dfsHelper(graph, neighbor, target, visited, path, result, found);
                if (found[0]) return;
            }
        }
        
        path.remove(path.size() - 1);  // Backtrack
    }
}
```

<!-- slide -->
```javascript
function dfsWithPath(graph, start, target) {
    const visited = new Set();
    const path = [];
    const result = [];
    let found = false;
    
    function dfs(node) {
        if (found) return;
        if (node === target) {
            path.push(node);
            result.push(...path);
            found = true;
            return;
        }
        
        visited.add(node);
        path.push(node);
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
                if (found) return;
            }
        }
        
        path.pop();  // Backtrack
    }
    
    dfs(start);
    return result;
}
```
````

### 2. DFS with State Tracking (Cycle Detection)

Three-state approach for detecting cycles in directed graphs.

````carousel
```python
def has_cycle_directed(graph: Dict[int, List[int]]) -> bool:
    """
    Detect cycle in directed graph using three-state DFS.
    
    States: 0 = unvisited, 1 = in current recursion stack, 2 = fully processed
    
    Time: O(V + E)
    Space: O(V)
    """
    # 0 = white (unvisited), 1 = gray (in progress), 2 = black (done)
    state = {}
    
    def dfs(node: int) -> bool:
        state[node] = 1  # Mark as in progress
        
        for neighbor in graph.get(node, []):
            if neighbor not in state:
                if dfs(neighbor):
                    return True
            elif state[neighbor] == 1:
                # Back edge found - cycle exists
                return True
        
        state[node] = 2  # Mark as done
        return False
    
    # Check all nodes
    all_nodes = set(graph.keys())
    for node in graph.values():
        all_nodes.update(node)
    
    for node in all_nodes:
        if node not in state:
            if dfs(node):
                return True
    
    return False
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <vector>
using namespace std;

bool hasCycleDirected(const unordered_map<int, vector<int>>& graph) {
    unordered_map<int, int> state;  // 0 = unvisited, 1 = in progress, 2 = done
    
    function<bool(int)> dfs = [&](int node) -> bool {
        state[node] = 1;  // Mark as in progress
        
        auto it = graph.find(node);
        if (it != graph.end()) {
            for (int neighbor : it->second) {
                if (!state.count(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (state[neighbor] == 1) {
                    // Back edge found - cycle exists
                    return true;
                }
            }
        }
        
        state[node] = 2;  // Mark as done
        return false;
    };
    
    // Check all nodes
    unordered_set<int> allNodes;
    for (const auto& pair : graph) {
        allNodes.insert(pair.first);
        for (int n : pair.second) allNodes.insert(n);
    }
    
    for (int node : allNodes) {
        if (!state.count(node)) {
            if (dfs(node)) return true;
        }
    }
    
    return false;
}
```

<!-- slide -->
```java
import java.util.*;

public class CycleDetection {
    public static boolean hasCycleDirected(Map<Integer, List<Integer>> graph) {
        Map<Integer, Integer> state = new HashMap<>();  // 0 = unvisited, 1 = in progress, 2 = done
        
        // Get all nodes
        Set<Integer> allNodes = new HashSet<>();
        for (Map.Entry<Integer, List<Integer>> entry : graph.entrySet()) {
            allNodes.add(entry.getKey());
            allNodes.addAll(entry.getValue());
        }
        
        for (int node : allNodes) {
            if (!state.containsKey(node)) {
                if (dfsHelper(graph, node, state)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private static boolean dfsHelper(Map<Integer, List<Integer>> graph, int node, 
                                     Map<Integer, Integer> state) {
        state.put(node, 1);  // Mark as in progress
        
        List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (int neighbor : neighbors) {
            if (!state.containsKey(neighbor)) {
                if (dfsHelper(graph, neighbor, state)) {
                    return true;
                }
            } else if (state.get(neighbor) == 1) {
                // Back edge found - cycle exists
                return true;
            }
        }
        
        state.put(node, 2);  // Mark as done
        return false;
    }
}
```

<!-- slide -->
```javascript
function hasCycleDirected(graph) {
    const state = {};  // 0 = unvisited, 1 = in progress, 2 = done
    
    function dfs(node) {
        state[node] = 1;  // Mark as in progress
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!(neighbor in state)) {
                if (dfs(neighbor)) return true;
            } else if (state[neighbor] === 1) {
                // Back edge found - cycle exists
                return true;
            }
        }
        
        state[node] = 2;  // Mark as done
        return false;
    }
    
    // Check all nodes
    const allNodes = new Set();
    for (const [node, neighbors] of Object.entries(graph)) {
        allNodes.add(parseInt(node));
        neighbors.forEach(n => allNodes.add(n));
    }
    
    for (const node of allNodes) {
        if (!(node in state)) {
            if (dfs(node)) return true;
        }
    }
    
    return false;
}
```
````

### 3. Topological Sort using DFS

Order vertices in a DAG such that for every edge (u, v), u comes before v.

````carousel
```python
def topological_sort_dfs(graph: Dict[int, List[int]]) -> List[int]:
    """
    Perform topological sort using DFS.
    
    Returns:
        Topological ordering of vertices
    
    Time: O(V + E)
    Space: O(V)
    """
    visited = set()
    result = []
    
    def dfs(node: int):
        visited.add(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs(neighbor)
        
        result.append(node)  # Post-order: add after exploring
    
    # Process all nodes
    all_nodes = set(graph.keys())
    for node in graph.values():
        all_nodes.update(node)
    
    for node in all_nodes:
        if node not in visited:
            dfs(node)
    
    return result[::-1]  # Reverse for correct topological order
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;

vector<int> topologicalSortDFS(const unordered_map<int, vector<int>>& graph) {
    unordered_set<int> visited;
    vector<int> result;
    
    function<void(int)> dfs = [&](int node) {
        visited.insert(node);
        
        auto it = graph.find(node);
        if (it != graph.end()) {
            for (int neighbor : it->second) {
                if (!visited.count(neighbor)) {
                    dfs(neighbor);
                }
            }
        }
        
        result.push_back(node);  // Post-order: add after exploring
    };
    
    // Process all nodes
    unordered_set<int> allNodes;
    for (const auto& pair : graph) {
        allNodes.insert(pair.first);
        for (int n : pair.second) allNodes.insert(n);
    }
    
    for (int node : allNodes) {
        if (!visited.count(node)) {
            dfs(node);
        }
    }
    
    reverse(result.begin(), result.end());  // Reverse for correct topological order
    return result;
}
```

<!-- slide -->
```java
import java.util.*;

public class TopologicalSort {
    public static List<Integer> topologicalSortDFS(Map<Integer, List<Integer>> graph) {
        Set<Integer> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        
        // Get all nodes
        Set<Integer> allNodes = new HashSet<>();
        for (Map.Entry<Integer, List<Integer>> entry : graph.entrySet()) {
            allNodes.add(entry.getKey());
            allNodes.addAll(entry.getValue());
        }
        
        for (int node : allNodes) {
            if (!visited.contains(node)) {
                dfsHelper(graph, node, visited, result);
            }
        }
        
        Collections.reverse(result);  // Reverse for correct topological order
        return result;
    }
    
    private static void dfsHelper(Map<Integer, List<Integer>> graph, int node,
                                  Set<Integer> visited, List<Integer> result) {
        visited.add(node);
        
        List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (int neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                dfsHelper(graph, neighbor, visited, result);
            }
        }
        
        result.add(node);  // Post-order: add after exploring
    }
}
```

<!-- slide -->
```javascript
function topologicalSortDFS(graph) {
    const visited = new Set();
    const result = [];
    
    function dfs(node) {
        visited.add(node);
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
        
        result.push(node);  // Post-order: add after exploring
    }
    
    // Process all nodes
    const allNodes = new Set();
    for (const [node, neighbors] of Object.entries(graph)) {
        allNodes.add(parseInt(node));
        neighbors.forEach(n => allNodes.add(n));
    }
    
    for (const node of allNodes) {
        if (!visited.has(node)) {
            dfs(node);
        }
    }
    
    return result.reverse();  // Reverse for correct topological order
}
```
````

### 4. Number of Islands (Grid DFS)

DFS applied to 2D grid for counting connected components.

````carousel
```python
def num_islands(grid: List[List[str]]) -> int:
    """
    Count number of islands in a 2D grid.
    
    Args:
        grid: 2D array of '1's (land) and '0's (water)
    
    Returns:
        Number of islands
    
    Time: O(V + E) where V = rows * cols
    Space: O(V) for recursion stack
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = set()
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    def dfs(r: int, c: int):
        if (r, c) in visited or grid[r][c] == '0':
            return
        
        visited.add((r, c))
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                dfs(nr, nc)
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                dfs(r, c)
                count += 1
    
    return count
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
#include <string>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    if (grid.empty() || grid[0].empty()) return 0;
    
    int rows = grid.size();
    int cols = grid[0].size();
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    int count = 0;
    
    vector<pair<int, int>> directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
    
    function<void(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            visited[r][c] || grid[r][c] == '0') {
            return;
        }
        
        visited[r][c] = true;
        
        for (auto [dr, dc] : directions) {
            dfs(r + dr, c + dc);
        }
    };
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1' && !visited[r][c]) {
                dfs(r, c);
                count++;
            }
        }
    }
    
    return count;
}
```

<!-- slide -->
```java
public class NumberOfIslands {
    private static final int[][] DIRECTIONS = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
    
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int rows = grid.length;
        int cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int count = 0;
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1' && !visited[r][c]) {
                    dfs(grid, r, c, visited);
                    count++;
                }
            }
        }
        
        return count;
    }
    
    private void dfs(char[][] grid, int r, int c, boolean[][] visited) {
        int rows = grid.length;
        int cols = grid[0].length;
        
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            visited[r][c] || grid[r][c] == '0') {
            return;
        }
        
        visited[r][c] = true;
        
        for (int[] dir : DIRECTIONS) {
            dfs(grid, r + dir[0], c + dir[1], visited);
        }
    }
}
```

<!-- slide -->
```javascript
const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function numIslands(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }
    
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let count = 0;
    
    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            visited[r][c] || grid[r][c] === '0') {
            return;
        }
        
        visited[r][c] = true;
        
        for (const [dr, dc] of DIRECTIONS) {
            dfs(r + dr, c + dc);
        }
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1' && !visited[r][c]) {
                dfs(r, c);
                count++;
            }
        }
    }
    
    return count;
}
```
````

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

## Practice Problems

### Problem 1: Number of Islands

**Problem:** [LeetCode 200 - Number of Islands](https://leetcode.com/problems/number-of-islands/)

**Description:** Given a 2D grid of '1's (land) and '0's (water), count the number of islands.

**How to Apply DFS:**
- Use DFS to explore each island (connected component of '1's)
- Mark visited cells to avoid counting them again
- Increment count when a new unvisited island is found

---

### Problem 2: Course Schedule

**Problem:** [LeetCode 207 - Course Schedule](https://leetcode.com/problems/course-schedule/)

**Description:** Determine if you can finish all courses given prerequisites (directed cycle detection).

**How to Apply DFS:**
- Build directed graph from prerequisites
- Use three-state DFS to detect cycles
- If cycle exists, impossible to complete all courses

---

### Problem 3: Pacific Atlantic Water Flow

**Problem:** [LeetCode 417 - Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)

**Description:** Find cells that can reach both Pacific and Atlantic oceans.

**How to Apply DFS:**
- Run DFS from Pacific border cells
- Run DFS from Atlantic border cells
- Cells visited in both DFS are the answer

---

### Problem 4: Word Ladder

**Problem:** [LeetCode 127 - Word Ladder](https://leetcode.com/problems/word-ladder/)

**Description:** Find the shortest transformation sequence from beginWord to endWord.

**How to Apply DFS:**
- Build graph where words are nodes
- Connect words differing by one letter
- Use DFS (or BFS for shortest) to find transformation sequence

---

### Problem 5: Clone Graph

**Problem:** [LeetCode 133 - Clone Graph](https://leetcode.com/problems/clone-graph/)

**Description:** Deep copy a connected undirected graph.

**How to Apply DFS:**
- Use DFS to traverse original graph
- Maintain a hashmap of cloned nodes
- Recursively clone neighbors while traversing

---

## Video Tutorial Links

### Fundamentals

- [DFS Graph Traversal (Take U Forward)](https://www.youtube.com/watch?v=pcKY4hjDrxk) - Comprehensive introduction to DFS
- [Graph DFS Implementation (WilliamFiset)](https://www.youtube.com/watch?v=4bL1J30J5D4) - Detailed implementation guide
- [DFS vs BFS (NeetCode)](https://www.youtube.com/watch?v=oL6SSUkFFJo) - When to use which algorithm

### Advanced Topics

- [Cycle Detection using DFS](https://www.youtube.com/watch?v=6GQ1623q3C0) - Detecting cycles in directed/undirected graphs
- [Topological Sort using DFS](https://www.youtube.com/watch?v=dis_c84ejhQ) - DFS-based topological ordering
- [Number of Islands - DFS Solution](https://www.youtube.com/watch?v=oKpK0dX0aBw) - Grid DFS patterns
- [Strongly Connected Components](https://www.youtube.com/watch?v=9Wbej4A6K4w) - Kosaraju's algorithm

---

## Follow-up Questions

### Q1: When should you use iterative DFS over recursive DFS?

**Answer:** Use iterative DFS when:
- Graph may be very deep (risk of stack overflow with recursion)
- Memory is constrained
- You're implementing in a language with limited recursion depth
- Working with very large graphs

The iterative version uses an explicit stack and has the same time complexity but better memory control.

### Q2: How do you detect cycles in an undirected graph vs directed graph?

**Answer:** 
- **Unirected**: Track parent node. If you encounter a visited node that is NOT the parent, there's a cycle.
- **Directed**: Use three-state approach (0=unvisited, 1=in progress, 2=done). If you encounter a node in state 1 (in progress), there's a cycle.

### Q3: Can DFS find the shortest path?

**Answer:** DFS does NOT guarantee the shortest path in unweighted graphs. It finds SOME path, but not necessarily the shortest. Use BFS for shortest path in unweighted graphs. However, DFS can be modified to find shortest path in weighted graphs using Dijkstra's algorithm approach.

### Q4: What is the difference between pre-order and post-order DFS?

**Answer:**
- **Pre-order**: Process node BEFORE exploring children (visit → recurse)
- **Post-order**: Process node AFTER exploring children (recurse → visit)

Post-order is useful for:
- Topological sorting
- Deleting/nodes in trees
- Computing subtree sizes

### Q5: How does memoization work with DFS?

**Answer:** Memoization (DFS + DP) stores results of subproblems to avoid recomputation:
1. Before computing, check if result is already memoized
2. Compute and store result
3. Return memoized result when needed

This transforms exponential DFS into polynomial time for problems with optimal substructure.

---

## Summary

Depth-First Search (DFS) is a versatile graph traversal algorithm essential for solving many graph and tree problems. Key takeaways:

- **Go Deep First**: Explore one branch completely before backtracking
- **Time Complexity**: O(V + E) - visits each vertex and edge once
- **Space Complexity**: O(V) - for visited set and stack
- **Two Implementations**: Recursive (elegant) vs Iterative (memory-safe)

When to use:
- ✅ Cycle detection in graphs
- ✅ Topological sorting
- ✅ Finding connected components
- ✅ Path finding (not necessarily shortest)
- ✅ Tree/graph traversal problems

When not to use:
- ❌ Shortest path in unweighted graphs (use BFS instead)
- ❌ Very deep graphs without iterative optimization
- ❌ When path order matters (BFS provides level-order)

DFS is the foundation for many advanced algorithms including topological sort, strongly connected components, and is frequently combined with memoization for dynamic programming solutions.

---

## Related Algorithms

- [BFS Level Order](./bfs-level-order.md) - Breadth-first traversal
- [Detect Cycle](./detect-cycle.md) - Cycle detection algorithms
- [Binary Lifting](./binary-lifting.md) - Tree ancestor queries
- [Topological Sort](./topological-sort.md) - DAG ordering
