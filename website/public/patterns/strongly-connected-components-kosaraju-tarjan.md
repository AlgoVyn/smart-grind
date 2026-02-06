# Strongly Connected Components (Kosaraju / Tarjan)

## Overview

A **Strongly Connected Component (SCC)** in a directed graph is a maximal subgraph where every pair of vertices is mutually reachable. For any two vertices `u` and `v` in an SCC, there exists both a path from `u` to `v` and a path from `v` to `u`. SCCs partition a directed graph into disjoint sets, and the resulting "condensation graph" (where each SCC becomes a single node) is always a **Directed Acyclic Graph (DAG)**.

This pattern is essential for solving problems related to graph connectivity, dependency analysis, and detecting cycles in the context of mutual dependencies.

### When to Use This Pattern

Use SCC algorithms when you need to:
- **Find mutually reachable groups** in a directed graph
- **Detect cycles** in directed graphs (SCCs of size > 1 indicate cycles)
- **Simplify graph problems** by contracting SCCs into single nodes
- **Analyze web page rankings** (like the original Google PageRank)
- **Solve dependency problems** where mutual dependencies form a cycle
- **Find the number of connected components** in directed graphs

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Cycle Detection** | SCCs of size > 1 or self-loops indicate cycles |
| **Graph Simplification** | Condensation graph is always a DAG |
| **Component Analysis** | Each SCC can be treated as a single unit |
| **Multiple Algorithms** | Kosaraju (simple, two-pass) or Tarjan (efficient, single-pass) |
| **Linear Complexity** | O(V + E) time complexity for both algorithms |

---

## Intuition and Core Concepts

### What is a Strongly Connected Component?

Consider a directed graph where you can travel between any two nodes in both directions within a subset. This subset is an SCC. Think of it as a "mutual reachability club" - if node A can reach B, and B can reach A, they belong to the same SCC.

**Example:**
```
Graph: A → B → C → A (cycle)
       B → D (escape)

SCCs: {A, B, C}, {D}
```
- A, B, C form an SCC because each can reach the others through the cycle
- D is its own SCC (no path back to it from A, B, or C)

### Key Terminology

- **Reachability**: Path exists from node u to node v
- **Strongly Connected**: Every pair of nodes has mutual reachability
- **Maximal**: Cannot add any more nodes without breaking strong connectivity
- **Condensation Graph**: Graph formed by contracting each SCC into a single node
- **Finish Time**: Time when DFS finishes processing a node (timestamp)
- **Low-link Value**: Smallest finish time reachable from a node (including itself)

### Algorithm Intuition

**Kosaraju's Algorithm** works on a simple observation:
1. If you perform DFS on the original graph and record nodes by finish time, nodes finishing last are in "source" SCCs
2. If you reverse all edges and do DFS in reverse finish time order, each DFS tree becomes an SCC

**Tarjan's Algorithm** uses a clever DFS-based approach:
1. Track discovery time and low-link value for each node
2. A node starts a new SCC when its low-link equals its discovery time
3. Use a stack to collect nodes in the current SCC

---

## Multiple Approaches with Code Templates

We'll cover two standard approaches:

1. **Kosaraju's Algorithm**: Two-pass DFS with graph reversal
2. **Tarjan's Algorithm**: Single-pass DFS with low-link values

---

### Approach 1: Kosaraju's Algorithm

#### Algorithm Steps

1. **First DFS Pass**: Perform DFS on the original graph and push nodes to a stack in order of completion (finish time)
2. **Reverse the Graph**: Create a reversed graph where all edges are flipped
3. **Second DFS Pass**: Process nodes from the stack (highest finish time first) on the reversed graph, collecting SCCs

#### Code Implementation

````carousel
```python
from collections import defaultdict, deque
from typing import List

def kosaraju_scc(graph: dict) -> List[List[int]]:
    """
    Kosaraju's Algorithm for finding Strongly Connected Components.
    
    Args:
        graph: Dict mapping node -> list of neighbors (directed edges)
    
    Returns:
        List of SCCs, each SCC is a list of nodes
    """
    # Step 1: First DFS - get nodes in order of finish time
    visited = set()
    stack = []
    
    def dfs1(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs1(neighbor)
        stack.append(node)  # Push after processing all neighbors
    
    for node in graph:
        if node not in visited:
            dfs1(node)
    
    # Step 2: Reverse the graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Step 3: Second DFS on reversed graph in stack order
    visited.clear()
    sccs = []
    
    def dfs2(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in reversed_graph.get(node, []):
            if neighbor not in visited:
                dfs2(neighbor, component)
    
    while stack:
        node = stack.pop()
        if node not in visited:
            component = []
            dfs2(node, component)
            sccs.append(component)
    
    return sccs


# Alternative: Iterative version to avoid recursion limits
def kosaraju_scc_iterative(graph: dict) -> List[List[int]]:
    """Kosaraju's Algorithm with iterative DFS."""
    
    # Step 1: Iterative DFS for finish times
    visited = set()
    stack = []
    
    for start_node in graph:
        if start_node in visited:
            continue
        
        dfs_stack = [(start_node, 0)]  # (node, next_child_index)
        
        while dfs_stack:
            node, idx = dfs_stack[-1]
            
            if node not in visited:
                visited.add(node)
            
            neighbors = graph.get(node, [])
            
            if idx < len(neighbors):
                neighbor = neighbors[idx]
                dfs_stack[-1] = (node, idx + 1)
                
                if neighbor not in visited:
                    dfs_stack.append((neighbor, 0))
            else:
                dfs_stack.pop()
                stack.append(node)
    
    # Step 2: Reverse the graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Step 3: Second DFS on reversed graph
    visited.clear()
    sccs = []
    
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        
        component = []
        dfs_stack = [node]
        visited.add(node)
        
        while dfs_stack:
            curr = dfs_stack.pop()
            component.append(curr)
            
            for neighbor in reversed_graph.get(curr, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    dfs_stack.append(neighbor)
        
        sccs.append(component)
    
    return sccs


# Number of SCCs
def count_scc(graph: dict) -> int:
    """Count the number of strongly connected components."""
    return len(kosaraju_scc(graph))


# Check if graph is strongly connected
def is_strongly_connected(graph: dict) -> bool:
    """Check if the entire graph is one SCC."""
    sccs = kosaraju_scc(graph)
    # Sum of all nodes in SCCs should equal number of nodes
    total_nodes = sum(len(scc) for scc in sccs)
    graph_nodes = len(graph)
    return len(sccs) == 1 and total_nodes == graph_nodes


# Example usage
if __name__ == "__main__":
    # Example graph: A → B → C → A, B → D
    graph = {
        'A': ['B'],
        'B': ['C', 'D'],
        'C': ['A'],
        'D': []
    }
    
    sccs = kosaraju_scc(graph)
    print("SCCs:", sccs)  # Output: [['D'], ['A', 'B', 'C']] or similar
    print("Number of SCCs:", count_scc(graph))  # Output: 2
    print("Is strongly connected?", is_strongly_connected(graph))  # Output: False
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <stack>
using namespace std;

class KosarajuSCC {
public:
    /**
     * Kosaraju's Algorithm for finding Strongly Connected Components.
     * 
     * @param graph Unordered map mapping node -> vector of neighbors
     * @return Vector of SCCs, each SCC is a vector of nodes
     */
    vector<vector<int>> kosaraju(unordered_map<int, vector<int>>& graph) {
        unordered_set<int> visited;
        vector<int> finish_order;
        
        // Step 1: First DFS - get finish times
        function<void(int)> dfs1 = [&](int node) {
            visited.insert(node);
            for (int neighbor : graph[node]) {
                if (visited.find(neighbor) == visited.end()) {
                    dfs1(neighbor);
                }
            }
            finish_order.push_back(node);
        };
        
        for (const auto& [node, neighbors] : graph) {
            if (visited.find(node) == visited.end()) {
                dfs1(node);
            }
        }
        
        // Step 2: Reverse the graph
        unordered_map<int, vector<int>> reversed_graph;
        for (const auto& [node, neighbors] : graph) {
            for (int neighbor : neighbors) {
                reversed_graph[neighbor].push_back(node);
            }
        }
        
        // Step 3: Second DFS on reversed graph
        visited.clear();
        vector<vector<int>> sccs;
        
        function<void(int, vector<int>&)> dfs2 = [&](int node, vector<int>& component) {
            visited.insert(node);
            component.push_back(node);
            for (int neighbor : reversed_graph[node]) {
                if (visited.find(neighbor) == visited.end()) {
                    dfs2(neighbor, component);
                }
            }
        };
        
        for (int i = finish_order.size() - 1; i >= 0; i--) {
            int node = finish_order[i];
            if (visited.find(node) == visited.end()) {
                vector<int> component;
                dfs2(node, component);
                sccs.push_back(component);
            }
        }
        
        return sccs;
    }
    
    /**
     * Count the number of strongly connected components.
     */
    int countSCC(unordered_map<int, vector<int>>& graph) {
        return kosaraju(graph).size();
    }
    
    /**
     * Check if the entire graph is strongly connected.
     */
    bool isStronglyConnected(unordered_map<int, vector<int>>& graph) {
        if (graph.empty()) return true;
        vector<vector<int>> sccs = kosaraju(graph);
        return sccs.size() == 1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class KosarajuSCC {
    
    /**
     * Kosaraju's Algorithm for finding Strongly Connected Components.
     * 
     * @param graph Map mapping node -> list of neighbors
     * @return List of SCCs, each SCC is a list of nodes
     */
    public List<List<Integer>> kosaraju(Map<Integer, List<Integer>> graph) {
        Set<Integer> visited = new HashSet<>();
        List<Integer> finishOrder = new ArrayList<>();
        
        // Step 1: First DFS - get finish times
        java.util.function.Consumer<Integer> dfs1 = node -> {
            visited.add(node);
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    dfs1.accept(neighbor);
                }
            }
            finishOrder.add(node);
        };
        
        for (int node : graph.keySet()) {
            if (!visited.contains(node)) {
                dfs1.accept(node);
            }
        }
        
        // Step 2: Reverse the graph
        Map<Integer, List<Integer>> reversedGraph = new HashMap<>();
        for (Map.Entry<Integer, List<Integer>> entry : graph.entrySet()) {
            int node = entry.getKey();
            for (int neighbor : entry.getValue()) {
                reversedGraph.computeIfAbsent(neighbor, k -> new ArrayList<>()).add(node);
            }
        }
        
        // Step 3: Second DFS on reversed graph
        visited.clear();
        List<List<Integer>> sccs = new ArrayList<>();
        
        java.util.function.Consumer<Integer> dfs2 = node -> {
            visited.add(node);
            component.add(node);
            for (int neighbor : reversedGraph.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    dfs2.accept(neighbor);
                }
            }
        };
        
        List<Integer> component = new ArrayList<>();
        for (int i = finishOrder.size() - 1; i >= 0; i--) {
            int node = finishOrder.get(i);
            if (!visited.contains(node)) {
                component = new ArrayList<>();
                dfs2.accept(node);
                sccs.add(component);
            }
        }
        
        return sccs;
    }
    
    /**
     * Count the number of strongly connected components.
     */
    public int countSCC(Map<Integer, List<Integer>> graph) {
        return kosaraju(graph).size();
    }
    
    /**
     * Check if the entire graph is strongly connected.
     */
    public boolean isStronglyConnected(Map<Integer, List<Integer>> graph) {
        if (graph.isEmpty()) return true;
        return kosaraju(graph).size() == 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Kosaraju's Algorithm for finding Strongly Connected Components.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @return {Array} Array of SCCs, each SCC is an array of nodes
 */
function kosarajuSCC(graph) {
    const visited = new Set();
    const finishOrder = [];
    
    // Step 1: First DFS - get finish times
    const dfs1 = (node) => {
        visited.add(node);
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs1(neighbor);
            }
        }
        finishOrder.push(node);
    };
    
    for (const node of graph.keys()) {
        if (!visited.has(node)) {
            dfs1(node);
        }
    }
    
    // Step 2: Reverse the graph
    const reversedGraph = new Map();
    for (const [node, neighbors] of graph) {
        for (const neighbor of neighbors) {
            if (!reversedGraph.has(neighbor)) {
                reversedGraph.set(neighbor, []);
            }
            reversedGraph.get(neighbor).push(node);
        }
    }
    
    // Step 3: Second DFS on reversed graph
    visited.clear();
    const sccs = [];
    
    const dfs2 = (node, component) => {
        visited.add(node);
        component.push(node);
        const neighbors = reversedGraph.get(node) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs2(neighbor, component);
            }
        }
    };
    
    for (let i = finishOrder.length - 1; i >= 0; i--) {
        const node = finishOrder[i];
        if (!visited.has(node)) {
            const component = [];
            dfs2(node, component);
            sccs.push(component);
        }
    }
    
    return sccs;
}

/**
 * Count the number of strongly connected components.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @return {number} Number of SCCs
 */
function countSCC(graph) {
    return kosarajuSCC(graph).length;
}

/**
 * Check if the entire graph is strongly connected.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @return {boolean} True if the graph is one SCC
 */
function isStronglyConnected(graph) {
    if (graph.size === 0) return true;
    return kosarajuSCC(graph).length === 1;
}

// Example usage
const graph = new Map([
    ['A', ['B']],
    ['B', ['C', 'D']],
    ['C', ['A']],
    ['D', []]
]);
console.log(kosarajuSCC(graph)); // Output: [['D'], ['A', 'B', 'C']] or similar
console.log(countSCC(graph));    // Output: 2
console.log(isStronglyConnected(graph)); // Output: false
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) - Each vertex and edge processed exactly twice |
| **Space** | O(V + E) - Stack, visited set, and reversed graph storage |

---

### Approach 2: Tarjan's Algorithm

#### Algorithm Steps

1. **Initialize**: Set discovery time and low-link value to 0 for all nodes
2. **DFS Traversal**: For each unvisited node:
   - Set discovery time and low-link to current time
   - Push node onto stack and mark as on-stack
   - For each neighbor:
     - If unvisited, recursively visit and update low-link
     - If on-stack, update low-link with neighbor's discovery time
   - If low-link equals discovery time, pop nodes from stack to form an SCC
3. **Return SCCs**: All popped nodes form one SCC

#### Code Implementation

````carousel
```python
from collections import defaultdict
from typing import List

def tarjan_scc(graph: dict) -> List[List[int]]:
    """
    Tarjan's Algorithm for finding Strongly Connected Components.
    
    Args:
        graph: Dict mapping node -> list of neighbors (directed edges)
    
    Returns:
        List of SCCs, each SCC is a list of nodes
    """
    index = 0  # Discovery time counter
    indices = {}  # Node -> discovery index
    lowlink = {}   # Node -> low-link value
    on_stack = set()  # Nodes currently on stack
    stack = []  # Stack of nodes
    
    sccs = []
    
    def strongconnect(node):
        nonlocal index
        indices[node] = index
        lowlink[node] = index
        index += 1
        stack.append(node)
        on_stack.add(node)
        
        # Check all neighbors
        for neighbor in graph.get(node, []):
            if neighbor not in indices:
                # Neighbor not yet visited
                strongconnect(neighbor)
                lowlink[node] = min(lowlink[node], lowlink[neighbor])
            elif neighbor in on_stack:
                # Neighbor is on stack, hence in current SCC
                lowlink[node] = min(lowlink[node], indices[neighbor])
        
        # If node is root of SCC, pop from stack
        if lowlink[node] == indices[node]:
            component = []
            while True:
                neighbor = stack.pop()
                on_stack.remove(neighbor)
                component.append(neighbor)
                if neighbor == node:
                    break
            sccs.append(component)
    
    # Run strongconnect on all unvisited nodes
    for node in graph:
        if node not in indices:
            strongconnect(node)
    
    return sccs


# Alternative: Iterative Tarjan's Algorithm
def tarjan_scc_iterative(graph: dict) -> List[List[int]]:
    """Tarjan's Algorithm with iterative DFS to avoid recursion limits."""
    index = 0
    indices = {}
    lowlink = {}
    on_stack = set()
    stack = []
    sccs = []
    
    for start_node in graph:
        if start_node in indices:
            continue
        
        # Use explicit stack for DFS: (node, next_child_index)
        dfs_stack = [(start_node, 0, False)]  # (node, next_child_index, returning_flag)
        indices[start_node] = index
        lowlink[start_node] = index
        index += 1
        stack.append(start_node)
        on_stack.add(start_node)
        
        while dfs_stack:
            node, child_idx, returning = dfs_stack.pop()
            
            if not returning:
                # First time visiting this node
                neighbors = graph.get(node, [])
                
                if child_idx < len(neighbors):
                    neighbor = neighbors[child_idx]
                    dfs_stack.append((node, child_idx + 1, False))  # Continue with next child
                    
                    if neighbor not in indices:
                        # First time visiting neighbor
                        indices[neighbor] = index
                        lowlink[neighbor] = index
                        index += 1
                        stack.append(neighbor)
                        on_stack.add(neighbor)
                        dfs_stack.append((neighbor, 0, True))  # Process neighbor first
                    elif neighbor in on_stack:
                        # Neighbor is on stack
                        lowlink[node] = min(lowlink[node], indices[neighbor])
                else:
                    # All children processed, check for SCC
                    if lowlink[node] == indices[node]:
                        component = []
                        while True:
                            stack_node = stack.pop()
                            on_stack.remove(stack_node)
                            component.append(stack_node)
                            if stack_node == node:
                                break
                        sccs.append(component)
                    
                    # Update parent's lowlink if returning
                    if dfs_stack:
                        parent, parent_idx, _ = dfs_stack[-1]
                        lowlink[parent] = min(lowlink[parent], lowlink[node])
            else:
                # Returning from child, update lowlink
                # This is handled in the main logic above
                pass
    
    return sccs


# Get SCC containing a specific node
def get_scc_for_node(graph: dict, target: int) -> List[int]:
    """Find the SCC containing a specific node."""
    for scc in tarjan_scc(graph):
        if target in scc:
            return scc
    return []


# Check if two nodes are in the same SCC
def same_scc(graph: dict, u: int, v: int) -> bool:
    """Check if two nodes are in the same strongly connected component."""
    for scc in tarjan_scc(graph):
        if u in scc and v in scc:
            return True
    return False


# Example usage
if __name__ == "__main__":
    # Example graph: A → B → C → A, B → D
    graph = {
        0: [1],
        1: [2, 3],
        2: [0],
        3: []
    }
    
    sccs = tarjan_scc(graph)
    print("SCCs:", sccs)  # Output: [[3], [0, 1, 2]] or similar
    print("Same SCC (0,2):", same_scc(graph, 0, 2))  # Output: True
    print("Same SCC (0,3):", same_scc(graph, 0, 3))  # Output: False
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <stack>
#include <algorithm>
using namespace std;

class TarjanSCC {
public:
    /**
     * Tarjan's Algorithm for finding Strongly Connected Components.
     * 
     * @param graph Unordered map mapping node -> vector of neighbors
     * @return Vector of SCCs, each SCC is a vector of nodes
     */
    vector<vector<int>> tarjan(unordered_map<int, vector<int>>& graph) {
        int index = 0;
        unordered_map<int, int> indices;
        unordered_map<int, int> lowlink;
        unordered_set<int> onStack;
        stack<int> s;
        vector<vector<int>> sccs;
        
        function<void(int)> strongconnect = [&](int node) {
            indices[node] = index;
            lowlink[node] = index;
            index++;
            s.push(node);
            onStack.insert(node);
            
            for (int neighbor : graph[node]) {
                if (indices.find(neighbor) == indices.end()) {
                    // Neighbor not yet visited
                    strongconnect(neighbor);
                    lowlink[node] = min(lowlink[node], lowlink[neighbor]);
                } else if (onStack.find(neighbor) != onStack.end()) {
                    // Neighbor is on stack
                    lowlink[node] = min(lowlink[node], indices[neighbor]);
                }
            }
            
            // If node is root of SCC
            if (lowlink[node] == indices[node]) {
                vector<int> component;
                while (true) {
                    int stackNode = s.top();
                    s.pop();
                    onStack.erase(stackNode);
                    component.push_back(stackNode);
                    if (stackNode == node) {
                        break;
                    }
                }
                sccs.push_back(component);
            }
        };
        
        for (const auto& [node, neighbors] : graph) {
            if (indices.find(node) == indices.end()) {
                strongconnect(node);
            }
        }
        
        return sccs;
    }
    
    /**
     * Get the SCC containing a specific node.
     */
    vector<int> getSCCForNode(unordered_map<int, vector<int>>& graph, int target) {
        vector<vector<int>> sccs = tarjan(graph);
        for (const auto& scc : sccs) {
            if (find(scc.begin(), scc.end(), target) != scc.end()) {
                return scc;
            }
        }
        return {};
    }
    
    /**
     * Check if two nodes are in the same SCC.
     */
    bool sameSCC(unordered_map<int, vector<int>>& graph, int u, int v) {
        vector<vector<int>> sccs = tarjan(graph);
        for (const auto& scc : sccs) {
            bool hasU = find(scc.begin(), scc.end(), u) != scc.end();
            bool hasV = find(scc.begin(), scc.end(), v) != scc.end();
            if (hasU && hasV) return true;
        }
        return false;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class TarjanSCC {
    
    /**
     * Tarjan's Algorithm for finding Strongly Connected Components.
     * 
     * @param graph Map mapping node -> list of neighbors
     * @return List of SCCs, each SCC is a list of nodes
     */
    public List<List<Integer>> tarjan(Map<Integer, List<Integer>> graph) {
        int[] index = {0};
        Map<Integer, Integer> indices = new HashMap<>();
        Map<Integer, Integer> lowlink = new HashMap<>();
        Set<Integer> onStack = new HashSet<>();
        Stack<Integer> stack = new Stack<>();
        List<List<Integer>> sccs = new ArrayList<>();
        
        java.util.function.Consumer<Integer> strongconnect = node -> {
            indices.put(node, index[0]);
            lowlink.put(node, index[0]);
            index[0]++;
            stack.push(node);
            onStack.add(node);
            
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!indices.containsKey(neighbor)) {
                    // Neighbor not yet visited
                    strongconnect.accept(neighbor);
                    lowlink.put(node, Math.min(lowlink.get(node), lowlink.get(neighbor)));
                } else if (onStack.contains(neighbor)) {
                    // Neighbor is on stack
                    lowlink.put(node, Math.min(lowlink.get(node), indices.get(neighbor)));
                }
            }
            
            // If node is root of SCC
            if (lowlink.get(node) == indices.get(node)) {
                List<Integer> component = new ArrayList<>();
                while (true) {
                    int stackNode = stack.pop();
                    onStack.remove(stackNode);
                    component.add(stackNode);
                    if (stackNode == node) {
                        break;
                    }
                }
                sccs.add(component);
            }
        };
        
        for (int node : graph.keySet()) {
            if (!indices.containsKey(node)) {
                strongconnect.accept(node);
            }
        }
        
        return sccs;
    }
    
    /**
     * Get the SCC containing a specific node.
     */
    public List<Integer> getSCCForNode(Map<Integer, List<Integer>> graph, int target) {
        List<List<Integer>> sccs = tarjan(graph);
        for (List<Integer> scc : sccs) {
            if (scc.contains(target)) {
                return scc;
            }
        }
        return new ArrayList<>();
    }
    
    /**
     * Check if two nodes are in the same SCC.
     */
    public boolean sameSCC(Map<Integer, List<Integer>> graph, int u, int v) {
        List<List<Integer>> sccs = tarjan(graph);
        for (List<Integer> scc : sccs) {
            if (scc.contains(u) && scc.contains(v)) {
                return true;
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Tarjan's Algorithm for finding Strongly Connected Components.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @return {Array} Array of SCCs, each SCC is an array of nodes
 */
function tarjanSCC(graph) {
    let index = 0;
    const indices = new Map();
    const lowlink = new Map();
    const onStack = new Set();
    const stack = [];
    const sccs = [];
    
    const strongconnect = (node) => {
        indices.set(node, index);
        lowlink.set(node, index);
        index++;
        stack.push(node);
        onStack.add(node);
        
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            if (!indices.has(neighbor)) {
                // Neighbor not yet visited
                strongconnect(neighbor);
                lowlink.set(node, Math.min(lowlink.get(node), lowlink.get(neighbor)));
            } else if (onStack.has(neighbor)) {
                // Neighbor is on stack
                lowlink.set(node, Math.min(lowlink.get(node), indices.get(neighbor)));
            }
        }
        
        // If node is root of SCC
        if (lowlink.get(node) === indices.get(node)) {
            const component = [];
            while (true) {
                const stackNode = stack.pop();
                onStack.delete(stackNode);
                component.push(stackNode);
                if (stackNode === node) {
                    break;
                }
            }
            sccs.push(component);
        }
    };
    
    for (const node of graph.keys()) {
        if (!indices.has(node)) {
            strongconnect(node);
        }
    }
    
    return sccs;
}

/**
 * Get the SCC containing a specific node.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @param {number} target - Target node to find
 * @return {Array} SCC containing the target node
 */
function getSCCForNode(graph, target) {
    const sccs = tarjanSCC(graph);
    for (const scc of sccs) {
        if (scc.includes(target)) {
            return scc;
        }
    }
    return [];
}

/**
 * Check if two nodes are in the same SCC.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @param {number} u - First node
 * @param {number} v - Second node
 * @return {boolean} True if both nodes are in the same SCC
 */
function sameSCC(graph, u, v) {
    const sccs = tarjanSCC(graph);
    for (const scc of sccs) {
        if (scc.includes(u) && scc.includes(v)) {
            return true;
        }
    }
    return false;
}

// Example usage
const graph = new Map([
    [0, [1]],
    [1, [2, 3]],
    [2, [0]],
    [3, []]
]);
console.log(tarjanSCC(graph));        // Output: [[3], [0, 1, 2]] or similar
console.log(sameSCC(graph, 0, 2));   // Output: true
console.log(sameSCC(graph, 0, 3));   // Output: false
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) - Single DFS pass, each edge processed once |
| **Space** | O(V + E) - Stack, indices, lowlink, onStack sets |

---

### Comparison of Approaches

| Aspect | Kosaraju | Tarjan |
|--------|----------|--------|
| **Passes** | Two DFS passes | Single DFS pass |
| **Graph Reversal** | Required | Not required |
| **Memory** | Needs reversed graph | Only needs one copy |
| **Implementation** | Simpler to understand | Slightly more complex |
| **Low-link Values** | Not needed | Essential |
| **Use Case** | When graph reversal is cheap | Most common in practice |
| **Recursion** | Both use recursion (can be iterative) | Both use recursion (can be iterative) |

**Recommendation**: Tarjan's algorithm is generally preferred due to its single-pass efficiency. Kosaraju's is excellent for understanding the concept and when graph reversal is already available.

---

## Related Problems

### Foundational Problems

- **[LeetCode 207: Course Schedule](https://leetcode.com/problems/course-schedule/)** - Detect cycles using DFS/BFS (detects if SCCs form cycles)
- **[LeetCode 210: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)** - Return valid course ordering using topological sort
- **[LeetCode 802: Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/)** - Find nodes not in any cycle (reverse graph + DFS)
- **[LeetCode 1557: Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/)** - Find source nodes in DAG

### SCC-Specific Problems

- **[LeetCode 1059: All Paths from Source to Destination](https://leetcode.com/problems/all-paths-from-source-to-target/)** - Check if path exists between nodes in DAG (SCC-based)
- **[LeetCode 2192: All Ancestors of a Node in a Directed Acyclic Graph](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-dag/)** - Find all ancestors using DAG traversal
- **[LeetCode 2360: Longest Cycle in a Graph](https://leetcode.com/problems/longest-cycle-in-a-graph/)** - Find the longest cycle (related to SCC size)

### Graph Connectivity Problems

- **[LeetCode 547: Number of Provinces](https://leetcode.com/problems/number-of-provinces/)** - Connected components in undirected graph
- **[LeetCode 684: Redundant Connection](https://leetcode.com/problems/redundant-connection/)** - Find cycle in undirected graph
- **[LeetCode 685: Redundant Connection II](https://leetcode.com/problems/redundant-connection-ii/)** - Find cycle in directed graph
- **[LeetCode 1615: Maximal Network Rank](https://leetcode.com/problems/maximal-network-rank/)** - Graph connectivity analysis

### Advanced Graph Problems

- **[LeetCode 1245: Tree Diameter](https://leetcode.com/problems/tree-diameter/)** - Tree diameter using DFS
- **[LeetCode 1466: Reorder Routes to Make All Paths Lead to City Zero](https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/)** - Reorient edges using SCC/DFS
- **[LeetCode 1553: Minimum Number of Days to Eat All Apples](https://leetcode.com/problems/minimum-number-of-days-to-eat-all-apples/)** - Graph with cycle detection
- **[LeetCode 2050: Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii/)** - Course scheduling with dependencies

---

## Video Tutorial Links

### Kosaraju's Algorithm Tutorials

- [Kosaraju's Algorithm - Strongly Connected Components | GeeksforGeeks](https://www.youtube.com/watch?v=6kCZ-p6OEdU) - Comprehensive explanation with examples
- [Kosaraju's Algorithm Explained - Abdul Bari](https://www.youtube.com/watch?v=pcxkBV1F7Xw) - Detailed algorithmic walkthrough
- [Strongly Connected Components - Kosaraju's Algorithm | Interview Cake](https://www.youtube.com/watch?v=R0T5MGR21Qo) - Interview-focused explanation

### Tarjan's Algorithm Tutorials

- [Tarjan's Algorithm - Strongly Connected Components | GeeksforGeeks](https://www.youtube.com/watch?v=wX6FF3fFjp8) - Step-by-step Tarjan's implementation
- [Tarjan's Algorithm Explained | Algorithms](https://www.youtube.com/watch?v=3fI7dBy8y6g) - Visual explanation of low-link values
- [Strongly Connected Components - Tarjan's Algorithm | Emil Sjöberg](https://www.youtube.com/watch?v=JHPc2g9Xj7k) - Code-focused walkthrough

### LeetCode Problem Solutions

- [LeetCode 207: Course Schedule Solution](https://www.youtube.com/watch?v=2hBhJPXPmBw) - Cycle detection using DFS
- [LeetCode 802: Find Eventual Safe States](https://www.youtube.com/watch?v=rWzxYvIk1X8) - Reverse graph + DFS approach
- [Course Schedule II - Topological Sort](https://www.youtube.com/watch?v=w6M5d4Z0wWo) - Related topological sorting

### Algorithm Visualizations

- [Strongly Connected Components Visualization](https://visualgo.net/en/scc) - Interactive visualizer from VisuAlgo
- [Graph Algorithm Animations](https://www.cs.usfca.edu/~galles/JavascriptVisual/DFS.html) - DFS/BFS animations
- [Tarjan's SCC Animation](https://www.youtube.com/watch?v=8B1_c8k2LQo) - Step-by-step animation

---

## Follow-up Questions

### Q1: What is the difference between Kosaraju and Tarjan's algorithm?

**Answer:** Kosaraju's uses two DFS passes with graph reversal (simpler to understand), while Tarjan's uses a single DFS with low-link values (more efficient). Both achieve O(V + E) time complexity, but Tarjan typically has better constant factors.

### Q2: How do you find all SCCs containing a specific node?

**Answer:** Run any SCC algorithm (Kosaraju or Tarjan) and iterate through the results to find the component containing your target node. Alternatively, with Tarjan's algorithm, you can modify it to return the SCC as soon as you find your target node.

### Q3: How would you check if the entire graph is one SCC?

**Answer:** After finding all SCCs, check if there's exactly one SCC containing all nodes. Alternatively, verify that the condensation graph has only one node.

### Q4: What is a condensation graph?

**Answer:** A condensation graph (or meta-graph) is formed by contracting each SCC into a single node. The resulting graph is always a Directed Acyclic Graph (DAG), which simplifies many graph problems.

### Q5: How do you handle disconnected graphs?

**Answer:** Both Kosaraju and Tarjan naturally handle disconnected graphs by iterating through all nodes and starting DFS from any unvisited node. Each disconnected component will have its own set of SCCs.

### Q6: What is the time complexity of finding all SCCs?

**Answer:** Both Kosaraju and Tarjan achieve O(V + E) time complexity, which is optimal. Each vertex and edge is processed exactly once.

### Q7: How do you detect cycles using SCCs?

**Answer:** In a directed graph, a cycle exists if and only if there is an SCC with more than one node or a single node with a self-loop. SCCs of size 1 without self-loops cannot be part of any cycle.

### Q8: When would you use Kosaraju over Tarjan?

**Answer:** Use Kosaraju when the graph is already reversed elsewhere, when you need to understand the conceptual basis, or when simplicity is preferred over marginal efficiency gains.

### Q9: How do you count the number of SCCs?

**Answer:** Simply count the number of SCCs returned by either algorithm. Each SCC returned is one component.

### Q10: Can SCC algorithms handle graphs with self-loops?

**Answer:** Yes. A node with a self-loop forms an SCC of size 1 (or size > 1 if part of a larger cycle). Self-loops are correctly handled by both algorithms.

---

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Graph reversal errors** | Double-check edge direction reversal in Kosaraju |
| **Low-link calculation errors** | Ensure low-link is min of discovery time, not low-link of neighbors |
| **Stack management** | Properly track on-stack status in Tarjan |
| **Finish time ordering** | Process Kosaraju's second pass in reverse finish order |
| **Disconnected components** | Iterate through all nodes, not just first component |
| **Recursion depth** | Use iterative versions for very large graphs |
| **Self-loops** | Handle self-loops correctly in neighbor iteration |
| **Empty graph** | Handle edge cases (empty graph returns empty list) |

---

## Template Summary

### Kosaraju's Algorithm - Quick Template

```python
def kosaraju_scc(graph):
    # Step 1: First DFS for finish times
    visited = set()
    stack = []
    
    def dfs1(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs1(neighbor)
        stack.append(node)
    
    for node in graph:
        if node not in visited:
            dfs1(node)
    
    # Step 2: Reverse graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Step 3: Second DFS
    visited.clear()
    sccs = []
    
    def dfs2(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in reversed_graph.get(node, []):
            if neighbor not in visited:
                dfs2(neighbor, component)
    
    while stack:
        node = stack.pop()
        if node not in visited:
            component = []
            dfs2(node, component)
            sccs.append(component)
    
    return sccs
```

### Tarjan's Algorithm - Quick Template

```python
def tarjan_scc(graph):
    index = 0
    indices = {}
    lowlink = {}
    on_stack = set()
    stack = []
    sccs = []
    
    def strongconnect(node):
        nonlocal index
        indices[node] = index
        lowlink[node] = index
        index += 1
        stack.append(node)
        on_stack.add(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in indices:
                strongconnect(neighbor)
                lowlink[node] = min(lowlink[node], lowlink[neighbor])
            elif neighbor in on_stack:
                lowlink[node] = min(lowlink[node], indices[neighbor])
        
        if lowlink[node] == indices[node]:
            component = []
            while True:
                n = stack.pop()
                on_stack.remove(n)
                component.append(n)
                if n == node:
                    break
            sccs.append(component)
    
    for node in graph:
        if node not in indices:
            strongconnect(node)
    
    return sccs
```

---

## Summary

Kosaraju's and Tarjan's algorithms are fundamental tools for finding Strongly Connected Components in directed graphs. Kosaraju's two-pass approach with graph reversal offers conceptual simplicity, while Tarjan's single-pass algorithm with low-link values provides optimal efficiency. Understanding both approaches enables you to choose the right tool for each situation and solve a wide range of graph problems involving cycles, reachability, and component analysis.
