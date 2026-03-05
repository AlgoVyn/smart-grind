# Graph - Bridges & Articulation Points

## Problem Description

The **Bridges & Articulation Points** pattern is used to find critical connections (bridges) and critical nodes (articulation points) in an undirected graph using **Tarjan's algorithm** with low-link values. A **bridge** is an edge whose removal increases the number of connected components, while an **articulation point** is a node whose removal does the same.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Undirected graph as adjacency list |
| **Output** | List of bridges (edges) and articulation points (nodes) |
| **Key Insight** | Use discovery times and low-link values to identify critical components |
| **Time Complexity** | O(V + E) where V = vertices, E = edges |
| **Space Complexity** | O(V) for tracking arrays |

### When to Use

- **Network reliability analysis**: Finding vulnerable points in communication networks
- **Critical infrastructure identification**: Determining which roads/connections are essential
- **Biconnected component detection**: Finding parts of the graph that remain connected even after node removal
- **Dependency analysis**: Identifying critical dependencies in software or systems
- **Graph reliability assessment**: Evaluating how robust a network is to failures

---

## Intuition

### Core Insight

The key insight behind Tarjan's algorithm is that **we can identify critical edges and nodes by tracking the earliest reachable ancestor**:

1. **Discovery Time**: When a node is first visited during DFS
2. **Low-link Value**: The earliest discovery time reachable from the current node (including through back edges)
3. **Bridge Condition**: An edge (u, v) is a bridge if `low[v] > disc[u]` (v cannot reach back to u or above)
4. **Articulation Point Condition**: A node u is an articulation point if:
   - It's the root with 2+ children in DFS tree, OR
   - For a non-root child v, `low[v] >= disc[u]`

### The "Aha!" Moments

1. **Why does `low[v] > disc[u]` indicate a bridge?** If the lowest node reachable from v is still higher (discovered later) than u, then removing edge (u,v) disconnects v's subtree from the rest of the graph.

2. **Why must the root have 2+ children to be an articulation point?** If the root has only one child, removing the root doesn't disconnect the graph - the child can still reach all other nodes through other paths.

3. **What's a back edge?** An edge connecting a node to an already visited ancestor (not the direct parent in DFS tree). Back edges create cycles and affect low-link values.

### Algorithm Visualization

Consider this graph:
```
    0 --- 1
    |     |
    2 --- 3
```

Edge (0,2) is a bridge if removing it disconnects the graph:
- Start DFS from 0, discover 1, then 3, then 2
- `low[2] = 0` (can reach back to 0 through 2-3-1-0)
- So (0,2) is NOT a bridge (there's an alternate path)

---

## Solution Approaches

### Approach 1: Tarjan's Algorithm (DFS with Low-Link Values) ⭐

The standard approach using single DFS pass to compute discovery times and low-link values.

#### Algorithm

1. **Initialize arrays**: `disc` (discovery times), `low` (low-link values), `parent`, `visited`
2. **Initialize counters**: `time = 0`, result containers for bridges and APs
3. **DFS from each unvisited node**:
   - Set `disc[u] = low[u] = time++`
   - Count children for root articulation point check
   - For each neighbor v:
     - If unvisited: recurse, then `low[u] = min(low[u], low[v])`
       - Check bridge: if `low[v] > disc[u]`, add (u,v) to bridges
       - Check AP: if `low[v] >= disc[u]` and u is not root, mark u as AP
     - If visited and v ≠ parent: `low[u] = min(low[u], disc[v])` (back edge)
   - For root: if 2+ children, mark as AP

#### Implementation

````carousel
```python
from collections import defaultdict
from typing import List, Tuple, Set

def tarjan_bridges_and_ap(graph):
    """
    Find bridges and articulation points using Tarjan's algorithm.
    
    Args:
        graph: Adjacency list representation of undirected graph
        
    Returns:
        Tuple of (bridges list, articulation_points set)
    """
    n = len(graph)
    disc = {}  # Discovery times
    low = {}   # Low-link values
    parent = {}
    bridges = []
    articulation_points = set()
    children_count = defaultdict(int)
    time = [0]  # Use list for mutable reference
    
    def dfs(u):
        disc[u] = low[u] = time[0]
        time[0] += 1
        is_articulation = False
        
        for v in graph[u]:
            if v not in disc:
                # Tree edge
                parent[v] = u
                children_count[u] += 1
                dfs(v)
                
                # Update low-link value
                low[u] = min(low[u], low[v])
                
                # Check for bridge
                if low[v] > disc[u]:
                    bridges.append((u, v))
                
                # Check for articulation point (non-root case)
                if parent.get(u) is not None and low[v] >= disc[u]:
                    is_articulation = True
                    
            elif v != parent.get(u):
                # Back edge
                low[u] = min(low[u], disc[v])
        
        # Check for articulation point (root case)
        if parent.get(u) is None and children_count[u] > 1:
            articulation_points.add(u)
        elif parent.get(u) is not None and is_articulation:
            articulation_points.add(u)
    
    # Handle disconnected graphs
    for node in graph:
        if node not in disc:
            parent[node] = None
            dfs(node)
    
    return bridges, articulation_points
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Tarjan {
public:
    vector<pair<int, int>> findBridges(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> disc(n, -1);
        vector<int> low(n, -1);
        vector<int> parent(n, -1);
        vector<pair<int, int>> bridges;
        vector<bool> ap(n, false);
        vector<int> children(n, 0);
        int time = 0;
        
        function<void(int)> dfs = [&](int u) {
            disc[u] = low[u] = ++time;
            
            for (int v : graph[u]) {
                if (disc[v] == -1) {
                    // Tree edge
                    parent[v] = u;
                    children[u]++;
                    dfs(v);
                    
                    low[u] = min(low[u], low[v]);
                    
                    // Bridge check
                    if (low[v] > disc[u]) {
                        bridges.push_back({u, v});
                    }
                    
                    // Articulation point check
                    if (parent[u] != -1 && low[v] >= disc[u]) {
                        ap[u] = true;
                    }
                } else if (v != parent[u]) {
                    // Back edge
                    low[u] = min(low[u], disc[v]);
                }
            }
            
            // Root articulation point
            if (parent[u] == -1 && children[u] > 1) {
                ap[u] = true;
            }
        };
        
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                dfs(i);
            }
        }
        
        return bridges;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Tarjan {
    private int time;
    private int[] disc;
    private int[] low;
    private int[] parent;
    private boolean[] ap;
    private int[] children;
    private List<List<Integer>> bridges;
    
    public List<List<Integer>> findBridges(List<List<Integer>> graph) {
        int n = graph.size();
        disc = new int[n];
        low = new int[n];
        parent = new int[n];
        ap = new boolean[n];
        children = new int[n];
        bridges = new ArrayList<>();
        time = 0;
        
        Arrays.fill(disc, -1);
        Arrays.fill(low, -1);
        Arrays.fill(parent, -1);
        
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                dfs(i, graph);
            }
        }
        
        return bridges;
    }
    
    private void dfs(int u, List<List<Integer>> graph) {
        disc[u] = low[u] = ++time;
        
        for (int v : graph.get(u)) {
            if (disc[v] == -1) {
                // Tree edge
                parent[v] = u;
                children[u]++;
                dfs(v, graph);
                
                low[u] = Math.min(low[u], low[v]);
                
                // Bridge check
                if (low[v] > disc[u]) {
                    bridges.add(Arrays.asList(u, v));
                }
                
                // Articulation point check
                if (parent[u] != -1 && low[v] >= disc[u]) {
                    ap[u] = true;
                }
            } else if (v != parent[u]) {
                // Back edge
                low[u] = Math.min(low[u], disc[v]);
            }
        }
        
        // Root articulation point
        if (parent[u] == -1 && children[u] > 1) {
            ap[u] = true;
        }
    }
    
    public boolean[] getArticulationPoints() {
        return ap;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find bridges in an undirected graph using Tarjan's algorithm
 * @param {number[][]} graph - Adjacency list
 * @return {number[][]} - List of bridges as [u, v] pairs
 */
function findBridges(graph) {
    const n = graph.length;
    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(-1);
    const parent = new Array(n).fill(-1);
    const ap = new Array(n).fill(false);
    const children = new Array(n).fill(0);
    const bridges = [];
    let time = 0;
    
    function dfs(u) {
        disc[u] = low[u] = ++time;
        
        for (const v of graph[u]) {
            if (disc[v] === -1) {
                // Tree edge
                parent[v] = u;
                children[u]++;
                dfs(v);
                
                low[u] = Math.min(low[u], low[v]);
                
                // Bridge check
                if (low[v] > disc[u]) {
                    bridges.push([u, v]);
                }
                
                // Articulation point check
                if (parent[u] !== -1 && low[v] >= disc[u]) {
                    ap[u] = true;
                }
            } else if (v !== parent[u]) {
                // Back edge
                low[u] = Math.min(low[u], disc[v]);
            }
        }
        
        // Root articulation point
        if (parent[u] === -1 && children[u] > 1) {
            ap[u] = true;
        }
    }
    
    for (let i = 0; i < n; i++) {
        if (disc[i] === -1) {
            dfs(i);
        }
    }
    
    return bridges;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) - single DFS pass over all vertices and edges |
| **Space** | O(V) - for discovery times, low-link values, and parent array |

---

### Approach 2: Iterative Implementation

Avoids recursion stack overflow for very deep graphs by using an explicit stack.

#### Algorithm

Same logic as recursive version but uses explicit stack to track DFS state.

#### Implementation

````carousel
```python
def tarjan_iterative(graph):
    """
    Iterative version of Tarjan's algorithm to avoid recursion depth issues.
    """
    n = len(graph)
    disc = {}
    low = {}
    parent = {}
    bridges = []
    ap = set()
    children_count = {}
    time = [0]
    
    for start in graph:
        if start in disc:
            continue
            
        stack = [(start, iter(graph[start]), 0)]  # (node, iterator, state)
        parent[start] = None
        
        while stack:
            u, neighbors, state = stack[-1]
            
            if state == 0:  # First visit
                disc[u] = low[u] = time[0]
                time[0] += 1
                children_count[u] = 0
                stack[-1] = (u, neighbors, 1)
            
            try:
                v = next(neighbors)
                
                if v not in disc:
                    # Tree edge
                    parent[v] = u
                    children_count[u] += 1
                    stack.append((v, iter(graph[v]), 0))
                elif v != parent.get(u):
                    # Back edge
                    low[u] = min(low[u], disc[v])
            except StopIteration:
                # Done with neighbors, backtrack
                stack.pop()
                
                if parent.get(u) is not None:
                    pu = parent[u]
                    low[pu] = min(low[pu], low[u])
                    
                    # Check bridge
                    if low[u] > disc[pu]:
                        bridges.append((pu, u))
                    
                    # Check articulation point
                    if low[u] >= disc[pu]:
                        ap.add(pu)
                else:
                    # Root node
                    if children_count[u] > 1:
                        ap.add(u)
    
    return bridges, ap
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
#include <iterator>
using namespace std;

vector<pair<int, int>> tarjanIterative(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> disc(n, -1);
    vector<int> low(n, -1);
    vector<int> parent(n, -1);
    vector<bool> ap(n, false);
    vector<pair<int, int>> bridges;
    int time = 0;
    
    struct StackItem {
        int u;
        int nextIndex;
    };
    
    for (int start = 0; start < n; start++) {
        if (disc[start] != -1) continue;
        
        stack<StackItem> st;
        st.push({start, 0});
        parent[start] = -1;
        int childCount = 0;
        
        while (!st.empty()) {
            auto& item = st.top();
            int u = item.u;
            
            if (disc[u] == -1) {
                disc[u] = low[u] = ++time;
            }
            
            if (item.nextIndex < graph[u].size()) {
                int v = graph[u][item.nextIndex++];
                
                if (disc[v] == -1) {
                    parent[v] = u;
                    if (parent[u] == -1) childCount++;
                    st.push({v, 0});
                } else if (v != parent[u]) {
                    low[u] = min(low[u], disc[v]);
                }
            } else {
                // Backtrack
                st.pop();
                if (parent[u] != -1) {
                    int pu = parent[u];
                    low[pu] = min(low[pu], low[u]);
                    
                    if (low[u] > disc[pu]) {
                        bridges.push_back({pu, u});
                    }
                    if (low[u] >= disc[pu]) {
                        ap[pu] = true;
                    }
                } else if (childCount > 1) {
                    ap[u] = true;
                }
            }
        }
    }
    
    return bridges;
}
```

<!-- slide -->
```java
import java.util.*;

class TarjanIterative {
    static class StackItem {
        int u, nextIndex;
        StackItem(int u, int nextIndex) {
            this.u = u;
            this.nextIndex = nextIndex;
        }
    }
    
    public List<List<Integer>> findBridges(List<List<Integer>> graph) {
        int n = graph.size();
        int[] disc = new int[n];
        int[] low = new int[n];
        int[] parent = new int[n];
        boolean[] ap = new boolean[n];
        List<List<Integer>> bridges = new ArrayList<>();
        
        Arrays.fill(disc, -1);
        Arrays.fill(low, -1);
        Arrays.fill(parent, -1);
        int time = 0;
        
        for (int start = 0; start < n; start++) {
            if (disc[start] != -1) continue;
            
            Deque<StackItem> stack = new ArrayDeque<>();
            stack.push(new StackItem(start, 0));
            parent[start] = -1;
            int[] childCount = {0};
            
            while (!stack.isEmpty()) {
                StackItem item = stack.peek();
                int u = item.u;
                
                if (disc[u] == -1) {
                    disc[u] = low[u] = ++time;
                }
                
                if (item.nextIndex < graph.get(u).size()) {
                    int v = graph.get(u).get(item.nextIndex++);
                    
                    if (disc[v] == -1) {
                        parent[v] = u;
                        if (parent[u] == -1) childCount[0]++;
                        stack.push(new StackItem(v, 0));
                    } else if (v != parent[u]) {
                        low[u] = Math.min(low[u], disc[v]);
                    }
                } else {
                    stack.pop();
                    if (parent[u] != -1) {
                        int pu = parent[u];
                        low[pu] = Math.min(low[pu], low[u]);
                        
                        if (low[u] > disc[pu]) {
                            bridges.add(Arrays.asList(pu, u));
                        }
                        if (low[u] >= disc[pu]) {
                            ap[pu] = true;
                        }
                    } else if (childCount[0] > 1) {
                        ap[u] = true;
                    }
                }
            }
        }
        
        return bridges;
    }
}
```

<!-- slide -->
```javascript
function tarjanIterative(graph) {
    const n = graph.length;
    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(-1);
    const parent = new Array(n).fill(-1);
    const ap = new Array(n).fill(false);
    const bridges = [];
    let time = 0;
    
    for (let start = 0; start < n; start++) {
        if (disc[start] !== -1) continue;
        
        const stack = [{ u: start, nextIndex: 0 }];
        parent[start] = -1;
        let childCount = 0;
        
        while (stack.length > 0) {
            const item = stack[stack.length - 1];
            const u = item.u;
            
            if (disc[u] === -1) {
                disc[u] = low[u] = ++time;
            }
            
            if (item.nextIndex < graph[u].length) {
                const v = graph[u][item.nextIndex++];
                
                if (disc[v] === -1) {
                    parent[v] = u;
                    if (parent[u] === -1) childCount++;
                    stack.push({ u: v, nextIndex: 0 });
                } else if (v !== parent[u]) {
                    low[u] = Math.min(low[u], disc[v]);
                }
            } else {
                stack.pop();
                if (parent[u] !== -1) {
                    const pu = parent[u];
                    low[pu] = Math.min(low[pu], low[u]);
                    
                    if (low[u] > disc[pu]) {
                        bridges.push([pu, u]);
                    }
                    if (low[u] >= disc[pu]) {
                        ap[pu] = true;
                    }
                } else if (childCount > 1) {
                    ap[u] = true;
                }
            }
        }
    }
    
    return bridges;
}
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Recursive DFS** | O(V + E) | O(V) | **General use** - clean implementation |
| **Iterative DFS** | O(V + E) | O(V) | Deep graphs to avoid stack overflow |

**Where:**
- `V` = number of vertices
- `E` = number of edges

**Time Breakdown:**
- Single DFS pass visits each vertex once: O(V)
- Each edge is examined twice (once from each endpoint): O(E)
- Total: O(V + E)

**Space Breakdown:**
- Discovery array: O(V)
- Low-link array: O(V)
- Parent array: O(V)
- Recursion/Stack: O(V) in worst case

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Critical Connections in a Network** | [Link](https://leetcode.com/problems/critical-connections-in-a-network/) | Find all bridges in a network |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Check if There is a Valid Parentheses String Path** | [Link](https://leetcode.com/problems/check-if-there-is-a-valid-parentheses-string-path/) | Path finding with constraints |
| **Maximum Employees to Be Invited to a Meeting** | [Link](https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/) | Cycle analysis in functional graphs |

---

## Video Tutorial Links

1. [Tarjan's Algorithm - WilliamFiset](https://www.youtube.com/watch?v=ZeDNSeilf-Y) - Excellent visual explanation of low-link values
2. [Articulation Points and Bridges - Tushar Roy](https://www.youtube.com/watch?v=aZXi1unBdJA) - Detailed walkthrough with examples
3. [Critical Connections - NeetCode](https://www.youtube.com/watch?v=RYaakWv5m6o) - Problem-specific explanation
4. [Graph Algorithms - MIT OpenCourseWare](https://www.youtube.com/watch?v=AfYqN3fGapc) - Theoretical foundations

---

## Summary

### Key Takeaways

1. **Low-link values track earliest reachable ancestor** - This is the key insight for identifying critical components
2. **Bridge condition**: `low[v] > disc[u]` means v cannot reach back to u without using edge (u,v)
3. **Articulation point conditions**:
   - Root: needs 2+ children in DFS tree
   - Non-root: has child v where `low[v] >= disc[u]`
4. **Back edges create cycles** and reduce low-link values
5. **Single DFS pass is sufficient** - O(V + E) time complexity

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Using `disc[v]` instead of `low[v]` in bridge check** | Always use `low[v] > disc[u]` not `disc[v] > disc[u]` |
| **Missing root articulation point case** | Root is AP only if it has 2+ DFS tree children |
| **Not handling disconnected graphs** | Loop through all nodes and start DFS from unvisited ones |
| **Confusing directed vs undirected** | This algorithm is for undirected graphs only |
| **Off-by-one in time tracking** | Ensure discovery time is set before incrementing |

### Follow-up Questions

**Q1: Can we use BFS instead of DFS for finding bridges?**

No, BFS doesn't naturally provide the parent-child relationships needed for low-link calculations. DFS tree structure is essential.

**Q2: How would you modify this for directed graphs?**

For directed graphs, use the strongly connected components algorithm (Kosaraju's or Tarjan's SCC algorithm), which is a related but different approach.

**Q3: What's the difference between a bridge and a cut edge?**

They are the same thing - an edge whose removal increases the number of connected components.

**Q4: How do you find biconnected components?**

Run Tarjan's algorithm and group edges that are not bridges. Each group forms a biconnected component.

---

## Pattern Source

For more graph pattern implementations, see:
- **[Graph - DFS Cycle Detection](/patterns/graph-dfs-cycle-detection-directed-graph)**
- **[Graph - Union Find (DSU)](/patterns/graph-union-find-disjoint-set-union-dsu)**
- **[Graph - BFS Connected Components](/patterns/graph-bfs-connected-components-island-counting)**
- **[Graph - Shortest Path Dijkstra's](/patterns/graph-shortest-path-dijkstra-s)**

---

## Additional Resources

- [LeetCode Critical Connections](https://leetcode.com/problems/critical-connections-in-a-network/)
- [GeeksforGeeks Tarjan's Algorithm](https://www.geeksforgeeks.org/bridge-in-a-graph/)
- [Wikipedia - Bridge (Graph Theory)](https://en.wikipedia.org/wiki/Bridge_(graph_theory))
- [Wikipedia - Biconnected Component](https://en.wikipedia.org/wiki/Biconnected_component)
