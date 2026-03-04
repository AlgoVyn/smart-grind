# Tarjan's Algorithm

## Category
Advanced

## Description

Tarjan's Algorithm (1972) finds all **Strongly Connected Components (SCCs)** in a directed graph in **O(V + E)** time using a single DFS traversal. A Strongly Connected Component is a maximal set of vertices where every vertex can reach every other vertex in the set through directed paths.

---

## When to Use

Use Tarjan's Algorithm when you need to solve problems involving:

- **Cycle Detection**: Finding cycles in directed graphs
- **Graph Decomposition**: Breaking a directed graph into SCCs for easier processing
- **Dependency Resolution**: Detecting circular dependencies in build systems or import statements
- **2-SAT Problems**: Solving boolean satisfiability problems
- **Web Page Ranking**: Algorithms like PageRank use SCCs
- **Network Analysis**: Finding strongly coupled components in networks

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|-------------------|----------|
| **Tarjan's Algorithm** | O(V + E) | O(V) | Single-pass SCC finding |
| **Kosaraju's Algorithm** | O(V + E) | O(V) | Two-pass approach, simpler to implement |
| **Iterative Tarjan** | O(V + E) | O(V) | Avoids recursion stack overflow |
| **Path-based SCC** | O(V + E) | O(V) | In-place, no recursion |

### When to Choose Tarjan vs Kosaraju

- **Choose Tarjan's Algorithm** when:
  - You want a single DFS pass
  - You need optimal time complexity with less overhead
  - Memory for reversed graph is a concern

- **Choose Kosaraju's Algorithm** when:
  - You need simpler implementation
  - The graph is already stored in adjacency list form with easy reversal
  - Teaching/learning graph algorithms

---

## Algorithm Explanation

### Core Concept

The key insight behind Tarjan's Algorithm is the **low-link value** concept. During a depth-first search, each vertex is assigned:
1. A **discovery time** (`disc`) - when the vertex is first visited
2. A **low-link value** (`low`) - the minimum discovery time reachable from this vertex's DFS subtree (including itself) through zero or more tree edges, followed by at most one back edge

When `disc[v] == low[v]`, we've found the root of a Strongly Connected Component - all vertices on the stack from `v` to the top form an SCC.

### Key Data Structures

| Structure | Purpose |
|-----------|---------|
| `disc[]` | Discovery time for each vertex (-1 if unvisited) |
| `low[]` | Low-link value for each vertex |
| `onStack[]` | Boolean flag if vertex is currently on DFS stack |
| `stack[]` | DFS stack to track current path |
| `index` | Counter for discovery times |

### How It Works

#### DFS Traversal:
1. Start DFS from an unvisited vertex
2. Assign discovery time and initialize low-link value to current index
3. Push vertex onto the stack and mark as on-stack
4. For each neighbor:
   - If unvisited: recurse, then update `low[v] = min(low[v], low[neighbor])`
   - If on stack: `low[v] = min(low[v], disc[neighbor])` (back edge)
5. If `disc[v] == low[v]`: pop vertices from stack until `v` - this is an SCC

### Visual Representation

For a graph with SCCs:
```
    0 → 1 → 2 → 0 (SCC)
    ↓
    3 → 4 (separate)
    
DFS Order: 0(0) → 1(1) → 2(2) → back to 0 → 3(3) → 4(4)

Stack contents during execution:
- After visiting 2: [0, 1, 2]
- disc[0]=0, low[0]=0 (back edge from 2 reaches 0)
- Since disc[0]==low[0], pop [0,1,2] → SCC{0,1,2}
```

### Why It Works

The algorithm exploits a fundamental property of DFS:
- A vertex can only reach vertices in its DFS subtree
- If the lowest discovery time reachable from a vertex's subtree is the vertex itself, no vertex outside can reach into this subtree
- Therefore, all vertices in this subtree form a strongly connected component

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize Data Structures**
   - Create adjacency list from edges
   - Initialize `disc[]` to -1 (unvisited)
   - Initialize `low[]` to 0
   - Create empty stack and SCC result list

2. **Start DFS from Each Unvisited Vertex**
   - For each vertex from 0 to n-1, if not visited, call `strongconnect()`

3. **In `strongconnect(v)`:**
   - Set `disc[v] = low[v] = index++`
   - Push `v` onto stack, set `onStack[v] = true`
   
4. **Process All Neighbors**
   - For each neighbor `w` of `v`:
     - If `disc[w] == -1`: unvisited → recurse, then `low[v] = min(low[v], low[w])`
     - Else if `onStack[w]`: back edge → `low[v] = min(low[v], disc[w])`

5. **Detect SCC Root**
   - If `disc[v] == low[v]`: found SCC root
   - Pop vertices from stack until `v`, mark each as not on stack
   - Add popped vertices as one SCC

---

## Implementation

### Template Code (Strongly Connected Components)

````carousel
```python
from typing import List, Set, Optional

def tarjan_scc(n: int, edges: List[List[int]]) -> List[List[int]]:
    """
    Find all strongly connected components in a directed graph using Tarjan's algorithm.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        List of SCCs, each SCC is a list of vertices (in reverse topological order)
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    # Initialize arrays
    # disc[i] = discovery time of vertex i (-1 if not visited)
    disc = [-1] * n
    # low[i] = low-link value of vertex i
    low = [0] * n
    # on_stack[i] = True if vertex i is currently on stack
    on_stack = [False] * n
    # Stack to track vertices in current DFS path
    stack = []
    
    index_counter = [0]  # Using list for mutable counter in nested function
    sccs = []
    
    def strongconnect(v: int):
        """
        DFS function to find SCCs starting from vertex v.
        """
        # Set discovery time and low-link value
        disc[v] = index_counter[0]
        low[v] = index_counter[0]
        index_counter[0] += 1
        
        # Push to stack
        stack.append(v)
        on_stack[v] = True
        
        # Consider all successors (neighbors)
        for w in graph[v]:
            if disc[w] == -1:
                # Successor w has not yet been visited; recurse
                strongconnect(w)
                # After recursion, update low[v] based on low[w]
                low[v] = min(low[v], low[w])
            elif on_stack[w]:
                # Successor w is in stack and hence in current SCC
                # This is a back edge
                low[v] = min(low[v], disc[w])
        
        # If v is a root (SCC found), pop the stack
        if low[v] == disc[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    # Run strongconnect from all unvisited vertices
    for v in range(n):
        if disc[v] == -1:
            strongconnect(v)
    
    return sccs


def tarjan_scc_with_details(n: int, edges: List[List[int]]) -> tuple:
    """
    Find SCCs with detailed tracking information.
    
    Returns:
        Tuple of (sccs, disc_times, low_values)
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    disc = [-1] * n
    low = [0] * n
    on_stack = [False] * n
    stack = []
    
    index_counter = [0]
    sccs = []
    
    def strongconnect(v: int):
        disc[v] = index_counter[0]
        low[v] = index_counter[0]
        index_counter[0] += 1
        
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if disc[w] == -1:
                strongconnect(w)
                low[v] = min(low[v], low[w])
            elif on_stack[w]:
                low[v] = min(low[v], disc[w])
        
        if low[v] == disc[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    for v in range(n):
        if disc[v] == -1:
            strongconnect(v)
    
    return sccs, disc, low


# Example usage and demonstration
if __name__ == "__main__":
    # Example 1: Graph with multiple SCCs
    # 0 → 1 → 2 → 0 (forms SCC)
    # 2 → 3 → 4 (separate path)
    n1 = 5
    edges1 = [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 3],
        [3, 4]
    ]
    
    print("=" * 60)
    print("Example 1: Basic Graph")
    print("=" * 60)
    print(f"Vertices: {n1}")
    print(f"Edges: {edges1}")
    
    sccs1 = tarjan_scc(n1, edges1)
    print(f"\nStrongly Connected Components: {sccs1}")
    print(f"Number of SCCs: {len(sccs1)}")
    
    # Show detailed info
    sccs, disc, low = tarjan_scc_with_details(n1, edges1)
    print(f"\nDiscovery times: {disc}")
    print(f"Low-link values: {low}")
    
    # Example 2: Graph with single SCC (complete cycle)
    n2 = 4
    edges2 = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0]
    ]
    
    print("\n" + "=" * 60)
    print("Example 2: Complete Cycle")
    print("=" * 60)
    sccs2 = tarjan_scc(n2, edges2)
    print(f"Edges: {edges2}")
    print(f"SCCs: {sccs2}")
    print("All vertices in one SCC (complete cycle)")
    
    # Example 3: Linear graph (no cycles)
    n3 = 4
    edges3 = [
        [0, 1],
        [1, 2],
        [2, 3]
    ]
    
    print("\n" + "=" * 60)
    print("Example 3: Linear Graph (No Cycles)")
    print("=" * 60)
    sccs3 = tarjan_scc(n3, edges3)
    print(f"Edges: {edges3}")
    print(f"SCCs: {sccs3}")
    print("Each vertex is its own SCC (no cycles)")
    
    # Example 4: Graph with multiple cycles
    n4 = 7
    edges4 = [
        [0, 1], [1, 2], [2, 0],  # Cycle 1: 0-1-2-0
        [2, 3], [3, 4], [4, 5],  # Path
        [5, 3],                   # Cycle 2: 3-4-5-3
        [4, 6]                    # Path to sink
    ]
    
    print("\n" + "=" * 60)
    print("Example 4: Multiple Cycles")
    print("=" * 60)
    sccs4 = tarjan_scc(n4, edges4)
    print(f"Edges: {edges4}")
    print(f"SCCs: {sccs4}")
    print("SCC 1: {0,1,2}, SCC 2: {3,4,5}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>
#include <utility>

using namespace std;

/**
 * Tarjan's Algorithm for Finding Strongly Connected Components
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
class TarjanSCC {
private:
    int n;  // Number of vertices
    vector<vector<int>> graph;  // Adjacency list
    vector<int> disc;  // Discovery time (-1 if not visited)
    vector<int> low;   // Low-link value
    vector<bool> onStack;  // Is vertex on stack?
    stack<int> st;  // DFS stack
    int index;  // Current discovery time counter
    vector<vector<int>> sccs;  // Result: all SCCs
    
    void strongconnect(int v) {
        // Set discovery time and low-link value
        disc[v] = low[v] = index++;
        
        // Push vertex to stack
        st.push(v);
        onStack[v] = true;
        
        // Consider all neighbors
        for (int w : graph[v]) {
            if (disc[w] == -1) {
                // Unvisited neighbor - recurse
                strongconnect(w);
                // Update low value
                low[v] = min(low[v], low[w]);
            } else if (onStack[w]) {
                // Neighbor on stack - back edge
                low[v] = min(low[v], disc[w]);
            }
        }
        
        // If v is root of SCC, pop until v
        if (low[v] == disc[v]) {
            vector<int> scc;
            while (true) {
                int w = st.top();
                st.pop();
                onStack[w] = false;
                scc.push_back(w);
                if (w == v) break;
            }
            sccs.push_back(scc);
        }
    }
    
public:
    TarjanSCC(int n, const vector<pair<int,int>>& edges) : n(n) {
        // Build adjacency list
        graph.resize(n);
        for (auto [u, v] : edges) {
            graph[u].push_back(v);
        }
        
        // Initialize
        disc.assign(n, -1);
        low.assign(n, 0);
        onStack.assign(n, false);
        index = 0;
        
        // Run algorithm from all unvisited vertices
        for (int v = 0; v < n; v++) {
            if (disc[v] == -1) {
                strongconnect(v);
            }
        }
    }
    
    const vector<vector<int>>& getSCCs() const {
        return sccs;
    }
    
    int getSCCCount() const {
        return sccs.size();
    }
    
    void printSCCs() const {
        cout << "Number of SCCs: " << sccs.size() << endl;
        for (size_t i = 0; i < sccs.size(); i++) {
            cout << "SCC " << i << ": ";
            for (int v : sccs[i]) {
                cout << v << " ";
            }
            cout << endl;
        }
    }
    
    void printDetails() const {
        cout << "\nVertex Details:" << endl;
        cout << "Vertex | Discovery | Low-Link" << endl;
        cout << "-------|-----------|----------" << endl;
        for (int v = 0; v < n; v++) {
            cout << "   " << v << "   |    " << disc[v] << "     |    " << low[v] << endl;
        }
    }
};


int main() {
    // Example 1: Basic graph
    cout << "=" << 50 << endl;
    cout << "Example 1: Basic Graph" << endl;
    cout << "=" << 50 << endl;
    
    int n1 = 5;
    vector<pair<int,int>> edges1 = {
        {0, 1}, {1, 2}, {2, 0},  // Cycle: 0-1-2-0
        {2, 3}, {3, 4}          // Path
    };
    
    TarjanSCC scc1(n1, edges1);
    scc1.printSCCs();
    scc1.printDetails();
    
    // Example 2: Complete cycle
    cout << "\n" << "=" << 50 << endl;
    cout << "Example 2: Complete Cycle" << endl;
    cout << "=" << 50 << endl;
    
    int n2 = 4;
    vector<pair<int,int>> edges2 = {
        {0, 1}, {1, 2}, {2, 3}, {3, 0}
    };
    
    TarjanSCC scc2(n2, edges2);
    scc2.printSCCs();
    
    // Example 3: Linear graph (no cycles)
    cout << "\n" << "=" << 50 << endl;
    cout << "Example 3: Linear Graph (No Cycles)" << endl;
    cout << "=" << 50 << endl;
    
    int n3 = 4;
    vector<pair<int,int>> edges3 = {
        {0, 1}, {1, 2}, {2, 3}
    };
    
    TarjanSCC scc3(n3, edges3);
    scc3.printSCCs();
    
    // Example 4: Multiple cycles
    cout << "\n" << "=" << 50 << endl;
    cout << "Example 4: Multiple Cycles" << endl;
    cout << "=" << 50 << endl;
    
    int n4 = 7;
    vector<pair<int,int>> edges4 = {
        {0, 1}, {1, 2}, {2, 0},  // Cycle 1
        {2, 3}, {3, 4}, {4, 5}, {5, 3},  // Cycle 2
        {4, 6}
    };
    
    TarjanSCC scc4(n4, edges4);
    scc4.printSCCs();
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Tarjan's Algorithm for Finding Strongly Connected Components
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
public class TarjanSCC {
    private int n;  // Number of vertices
    private List<List<Integer>> graph;  // Adjacency list
    private int[] disc;  // Discovery time (-1 if not visited)
    private int[] low;  // Low-link value
    private boolean[] onStack;  // Is vertex on stack?
    private Stack<Integer> stack;  // DFS stack
    private int index;  // Current discovery time counter
    private List<List<Integer>> sccs;  // Result
    
    public TarjanSCC(int n, int[][] edges) {
        this.n = n;
        
        // Build adjacency list
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
        }
        
        // Initialize arrays
        disc = new int[n];
        low = new int[n];
        onStack = new boolean[n];
        stack = new Stack<>();
        index = 0;
        sccs = new ArrayList<>();
        
        // Initialize disc to -1 (unvisited)
        Arrays.fill(disc, -1);
        
        // Run algorithm
        for (int v = 0; v < n; v++) {
            if (disc[v] == -1) {
                strongconnect(v);
            }
        }
    }
    
    private void strongconnect(int v) {
        // Set discovery time and low-link value
        disc[v] = low[v] = index++;
        
        // Push to stack
        stack.push(v);
        onStack[v] = true;
        
        // Consider all neighbors
        for (int w : graph.get(v)) {
            if (disc[w] == -1) {
                // Unvisited - recurse
                strongconnect(w);
                low[v] = Math.min(low[v], low[w]);
            } else if (onStack[w]) {
                // On stack - back edge
                low[v] = Math.min(low[v], disc[w]);
            }
        }
        
        // If v is root of SCC
        if (low[v] == disc[v]) {
            List<Integer> scc = new ArrayList<>();
            while (true) {
                int w = stack.pop();
                onStack[w] = false;
                scc.add(w);
                if (w == v) break;
            }
            sccs.add(scc);
        }
    }
    
    public List<List<Integer>> getSCCs() {
        return sccs;
    }
    
    public int getSCCCount() {
        return sccs.size();
    }
    
    public void printSCCs() {
        System.out.println("Number of SCCs: " + sccs.size());
        for (int i = 0; i < sccs.size(); i++) {
            System.out.print("SCC " + i + ": ");
            System.out.println(sccs.get(i));
        }
    }
    
    public void printDetails() {
        System.out.println("\nVertex Details:");
        System.out.println("Vertex | Discovery | Low-Link");
        System.out.println("-------|-----------|----------");
        for (int v = 0; v < n; v++) {
            System.out.printf("   %d   |    %d     |    %d%n", v, disc[v], low[v]);
        }
    }
    
    public static void main(String[] args) {
        // Example 1
        System.out.println("=".repeat(50));
        System.out.println("Example 1: Basic Graph");
        System.out.println("=".repeat(50));
        
        int n1 = 5;
        int[][] edges1 = {
            {0, 1}, {1, 2}, {2, 0},  // Cycle
            {2, 3}, {3, 4}
        };
        
        TarjanSCC scc1 = new TarjanSCC(n1, edges1);
        scc1.printSCCs();
        scc1.printDetails();
        
        // Example 2: Complete cycle
        System.out.println("\n" + "=".repeat(50));
        System.out.println("Example 2: Complete Cycle");
        System.out.println("=".repeat(50));
        
        int n2 = 4;
        int[][] edges2 = {{0, 1}, {1, 2}, {2, 3}, {3, 0}};
        
        TarjanSCC scc2 = new TarjanSCC(n2, edges2);
        scc2.printSCCs();
        
        // Example 3: Linear
        System.out.println("\n" + "=".repeat(50));
        System.out.println("Example 3: Linear Graph");
        System.out.println("=".repeat(50));
        
        int n3 = 4;
        int[][] edges3 = {{0, 1}, {1, 2}, {2, 3}};
        
        TarjanSCC scc3 = new TarjanSCC(n3, edges3);
        scc3.printSCCs();
        
        // Example 4: Multiple cycles
        System.out.println("\n" + "=".repeat(50));
        System.out.println("Example 4: Multiple Cycles");
        System.out.println("=".repeat(50));
        
        int n4 = 7;
        int[][] edges4 = {
            {0, 1}, {1, 2}, {2, 0},
            {2, 3}, {3, 4}, {4, 5}, {5, 3},
            {4, 6}
        };
        
        TarjanSCC scc4 = new TarjanSCC(n4, edges4);
        scc4.printSCCs();
    }
}
```

<!-- slide -->
```javascript
/**
 * Tarjan's Algorithm for Finding Strongly Connected Components
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

/**
 * Find all strongly connected components in a directed graph.
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {number[][]} edges - Array of directed edges [from, to]
 * @returns {number[][]} Array of SCCs, each SCC is an array of vertices
 */
function tarjanSCC(n, edges) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
    }
    
    // Initialize arrays
    const disc = new Array(n).fill(-1);  // Discovery time (-1 = unvisited)
    const low = new Array(n).fill(0);   // Low-link value
    const onStack = new Array(n).fill(false);
    const stack = [];
    
    let index = 0;
    const sccs = [];
    
    /**
     * DFS function to find SCCs starting from vertex v
     */
    function strongconnect(v) {
        // Set discovery time and low-link value
        disc[v] = low[v] = index++;
        
        // Push to stack
        stack.push(v);
        onStack[v] = true;
        
        // Consider all neighbors
        for (const w of graph[v]) {
            if (disc[w] === -1) {
                // Unvisited - recurse
                strongconnect(w);
                low[v] = Math.min(low[v], low[w]);
            } else if (onStack[w]) {
                // On stack - back edge
                low[v] = Math.min(low[v], disc[w]);
            }
        }
        
        // If v is root of SCC
        if (low[v] === disc[v]) {
            const scc = [];
            while (true) {
                const w = stack.pop();
                onStack[w] = false;
                scc.push(w);
                if (w === v) break;
            }
            sccs.push(scc);
        }
    }
    
    // Run from all unvisited vertices
    for (let v = 0; v < n; v++) {
        if (disc[v] === -1) {
            strongconnect(v);
        }
    }
    
    return sccs;
}

/**
 * Find SCCs with detailed tracking information
 * @returns {Object} { sccs, disc, low }
 */
function tarjanSCCWithDetails(n, edges) {
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
    }
    
    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(0);
    const onStack = new Array(n).fill(false);
    const stack = [];
    
    let index = 0;
    const sccs = [];
    
    function strongconnect(v) {
        disc[v] = low[v] = index++;
        stack.push(v);
        onStack[v] = true;
        
        for (const w of graph[v]) {
            if (disc[w] === -1) {
                strongconnect(w);
                low[v] = Math.min(low[v], low[w]);
            } else if (onStack[w]) {
                low[v] = Math.min(low[v], disc[w]);
            }
        }
        
        if (low[v] === disc[v]) {
            const scc = [];
            while (true) {
                const w = stack.pop();
                onStack[w] = false;
                scc.push(w);
                if (w === v) break;
            }
            sccs.push(scc);
        }
    }
    
    for (let v = 0; v < n; v++) {
        if (disc[v] === -1) {
            strongconnect(v);
        }
    }
    
    return { sccs, disc, low };
}


// Example usage and demonstration
console.log("=".repeat(50));
console.log("Example 1: Basic Graph");
console.log("=".repeat(50));

const n1 = 5;
const edges1 = [
    [0, 1], [1, 2], [2, 0],  // Cycle
    [2, 3], [3, 4]
];

console.log(`Vertices: ${n1}`);
console.log(`Edges: ${JSON.stringify(edges1)}`);

const sccs1 = tarjanSCC(n1, edges1);
console.log(`\nStrongly Connected Components: ${JSON.stringify(sccs1)}`);
console.log(`Number of SCCs: ${sccs1.length}`);

// Show details
const { sccs, disc, low } = tarjanSCCWithDetails(n1, edges1);
console.log(`\nDiscovery times: ${JSON.stringify(disc)}`);
console.log(`Low-link values: ${JSON.stringify(low)}`);

// Example 2: Complete cycle
console.log("\n" + "=".repeat(50));
console.log("Example 2: Complete Cycle");
console.log("=".repeat(50));

const n2 = 4;
const edges2 = [[0, 1], [1, 2], [2, 3], [3, 0]];

const sccs2 = tarjanSCC(n2, edges2);
console.log(`Edges: ${JSON.stringify(edges2)}`);
console.log(`SCCs: ${JSON.stringify(sccs2)}`);
console.log("All vertices in one SCC (complete cycle)");

// Example 3: Linear graph
console.log("\n" + "=".repeat(50));
console.log("Example 3: Linear Graph (No Cycles)");
console.log("=".repeat(50));

const n3 = 4;
const edges3 = [[0, 1], [1, 2], [2, 3]];

const sccs3 = tarjanSCC(n3, edges3);
console.log(`Edges: ${JSON.stringify(edges3)}`);
console.log(`SCCs: ${JSON.stringify(sccs3)}`);
console.log("Each vertex is its own SCC (no cycles)");

// Example 4: Multiple cycles
console.log("\n" + "=".repeat(50));
console.log("Example 4: Multiple Cycles");
console.log("=".repeat(50));

const n4 = 7;
const edges4 = [
    [0, 1], [1, 2], [2, 0],   // Cycle 1
    [2, 3], [3, 4], [4, 5], [5, 3],  // Cycle 2
    [4, 6]
];

const sccs4 = tarjanSCC(n4, edges4);
console.log(`Edges: ${JSON.stringify(edges4)}`);
console.log(`SCCs: ${JSON.stringify(sccs4)}`);
console.log("SCC 1: [0,1,2], SCC 2: [3,4,5]");
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Build Graph** | O(V + E) | Build adjacency list from edges |
| **DFS Traversal** | O(V + E) | Visit each vertex and edge once |
| **SCC Extraction** | O(V) | Each vertex popped once from stack |
| **Total** | **O(V + E)** | Linear time in graph size |

### Detailed Breakdown

- **Vertex processing**: Each vertex is visited exactly once → O(V)
- **Edge processing**: Each edge is examined exactly once during DFS → O(E)
- **Stack operations**: Each vertex pushed and popped exactly once → O(V)
- **Total**: O(V) + O(E) = O(V + E)

---

## Space Complexity Analysis

| Data Structure | Space | Description |
|----------------|-------|-------------|
| **Adjacency List** | O(V + E) | Stores all edges |
| **disc[]** | O(V) | Discovery times |
| **low[]** | O(V) | Low-link values |
| **onStack[]** | O(V) | Stack membership |
| **DFS Stack** | O(V) | Maximum depth |
| **Result SCCs** | O(V) | All vertices distributed |
| **Total** | **O(V + E)** | Dominated by adjacency list |

### Space Optimization Notes

For very large graphs, consider:
1. **In-place edge storage**: Use compressed sparse row format
2. **Iterative version**: Avoid recursion stack for deep graphs
3. **Kosaraju's alternative**: Requires reversed graph (2× space for edges)

---

## Common Variations

### 1. Kosaraju's Algorithm (Two-Pass Approach)

````carousel
```python
def kosaraju_scc(n, edges):
    """Kosaraju's algorithm - simpler but requires reversed graph."""
    # Build graph and reversed graph
    graph = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        rev[v].append(u)
    
    visited = [False] * n
    order = []
    
    # First DFS on original graph
    def dfs1(v):
        visited[v] = True
        for w in graph[v]:
            if not visited[w]:
                dfs1(w)
        order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Second DFS on reversed graph in reverse order
    visited = [False] * n
    sccs = []
    
    def dfs2(v, component):
        visited[v] = True
        component.append(v)
        for w in rev[v]:
            if not visited[w]:
                dfs2(w, component)
    
    for v in reversed(order):
        if not visited[v]:
            component = []
            dfs2(v, component)
            sccs.append(component)
    
    return sccs
```
````

### 2. Iterative Tarjan (Avoids Recursion Stack)

````carousel
```python
def tarjan_scc_iterative(n, edges):
    """Iterative version to handle very deep graphs."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    disc = [-1] * n
    low = [0] * n
    on_stack = [False] * n
    stack = []
    
    index = 0
    sccs = []
    
    for start in range(n):
        if disc[start] != -1:
            continue
            
        # Manual stack for DFS: (vertex, next_neighbor_index, state)
        # state: 0 = entering, 1 = processing neighbors
        dfs_stack = [(start, 0, 0)]
        
        while dfs_stack:
            v, neighbor_idx, state = dfs_stack.pop()
            
            if state == 0:
                # First time visiting this vertex
                disc[v] = low[v] = index
                index += 1
                stack.append(v)
                on_stack[v] = True
                dfs_stack.append((v, 0, 1))  # Will process after neighbors
                
                # Add neighbors to process
                for i in range(len(graph[v]) - 1, -1, -1):
                    w = graph[v][i]
                    dfs_stack.append((w, i, 0))
            else:
                # Returning from neighbor processing
                if neighbor_idx < len(graph[v]):
                    w = graph[v][neighbor_idx]
                    if disc[w] == -1:
                        low[v] = min(low[v], low[w])
                    elif on_stack[w]:
                        low[v] = min(low[v], disc[w])
                
                # Check for SCC
                if low[v] == disc[v]:
                    scc = []
                    while stack and disc[stack[-1]] >= disc[v]:
                        w = stack.pop()
                        on_stack[w] = False
                        scc.append(w)
                    sccs.append(scc)
    
    return sccs
```
````

### 3. Finding Single SCC Containing Target

````carousel
```python
def find_scc_containing(n, edges, target):
    """Find the SCC that contains a specific target vertex."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    disc = [-1] * n
    low = [0] * n
    on_stack = [False] * n
    stack = []
    
    index = 0
    result_scc = None
    
    def strongconnect(v):
        nonlocal index, result_scc
        
        disc[v] = low[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if disc[w] == -1:
                strongconnect(w)
                low[v] = min(low[v], low[w])
            elif on_stack[w]:
                low[v] = min(low[v], disc[w])
        
        if low[v] == disc[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            
            # Check if target is in this SCC
            if target in scc:
                result_scc = scc
    
    for v in range(n):
        if disc[v] == -1:
            strongconnect(v)
            if result_scc:
                return result_scc
    
    return result_scc
```
````

### 4. Condensation Graph (DAG of SCCs)

````carousel
```python
def build_condensation_graph(n, edges):
    """Build the condensation graph (DAG of SCCs)."""
    # First find all SCCs
    sccs = tarjan_scc(n, edges)
    
    # Map each vertex to its SCC index
    vertex_to_scc = {}
    for i, scc in enumerate(sccs):
        for v in scc:
            vertex_to_scc[v] = i
    
    # Build condensation graph
    scc_count = len(sccs)
    cond_graph = [[] for _ in range(scc_count)]
    
    for u, v in edges:
        scc_u = vertex_to_scc[u]
        scc_v = vertex_to_scc[v]
        if scc_u != scc_v and scc_v not in cond_graph[scc_u]:
            cond_graph[scc_u].append(scc_v)
    
    return cond_graph, sccs, vertex_to_scc
```
````

---

## Practice Problems

### Problem 1: Clone Graph with Random Pointers

**Problem:** [LeetCode 133 - Clone Graph](https://leetcode.com/problems/clone-graph/)

**Description:** Given a connected undirected graph with n nodes, clone it using SCC concepts to identify and handle cycles properly.

**How to Apply Tarjan's:**
- Use low-link values to detect cycles during cloning
- Handle already-visited nodes in the same SCC
- Ensures proper handling of complex cycle structures

---

### Problem 2: Find if Path Exists in Graph

**Problem:** [LeetCode 1971 - Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/)

**Description:** Find if there is a valid path between source and destination vertices.

**How to Apply Tarjan's:**
- Use SCCs to quickly determine if source and destination are in the same SCC
- If in same SCC, path definitely exists
- Much faster than full DFS for multiple queries

---

### Problem 3: Longest Cycle in Directed Graph

**Problem:** [LeetCode 2360 - Longest Cycle in a Graph](https://leetcode.com/problems/longest-cycle-in-a-graph/)

**Description:** Find the length of the longest cycle in a directed graph. Return -1 if no cycle exists.

**How to Apply Tarjan's:**
- Each SCC with more than one vertex contains a cycle
- Find the largest SCC to get the longest cycle length
- SCC size gives the answer directly

---

### Problem 4: Evaluate Division

**Problem:** [LeetCode 399 - Evaluate Division](https://leetcode.com/problems/evaluate-division/)

**Description:** Given equations and queries, compute division results using graph traversal.

**How to Apply Tarjan's:**
- Build a directed graph from equations
- Use SCCs to detect circular dependencies
- Handle division by zero in cycles

---

### Problem 5: Minimum Number of Operations

**Problem:** [LeetCode 2364 - Count Number of Bad Pairs](https://leetcode.com/problems/count-number-of-bad-pairs/)

**Description:** Find number of "bad pairs" in an array.

**How to Apply Tarjan's:**
- While not directly using Tarjan's, cycle detection concepts apply
- Use graph-based thinking for the transformations

---

## Video Tutorial Links

### Fundamentals

- [Tarjan's Algorithm - Strongly Connected Components (Take U Forward)](https://www.youtube.com/watch?v=6kT0m0Uf2SM) - Comprehensive introduction
- [Tarjan's Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=tyonrF4E7sE) - Detailed visualization
- [SCC in Directed Graphs (NeetCode)](https://www.youtube.com/watch?v=z1lQPSx0Ui8) - Practical implementation

### Comparison with Kosaraju

- [Kosaraju vs Tarjan's Algorithm](https://www.youtube.com/watch?v=VCdNuZbQ6yo) - Comparison and trade-offs
- [Strongly Connected Components - All Methods](https://www.youtube.com/watch?v=XxB7-aJuj6s) - Complete overview

### Advanced Topics

- [Iterative Tarjan's Algorithm](https://www.youtube.com/watch?v=8M6wSsC1xSk) - Handling large graphs
- [2-SAT using SCC](https://www.youtube.com/watch?v=0nMNuE18QyM) - Application in satisfiability
- [Condensation Graph](https://www.youtube.com/watch?v=X4F8mKrR1Q0) - DAG of SCCs

---

## Follow-up Questions

### Q1: What is the difference between Tarjan's and Kosaraju's algorithm?

**Answer:** Both find SCCs in O(V + E) time, but differ in approach:
- **Tarjan's**: Single DFS pass, uses low-link values, more memory efficient
- **Kosaraju's**: Two DFS passes, simpler to understand, requires reversed graph
- **Tarjan preferred** for single-pass efficiency; **Kosaraju** for simplicity

### Q2: How does the low-link value work?

**Answer:** The low-link value of a vertex is:
- Its own discovery time, OR
- The minimum discovery time reachable by following zero or more tree edges, then at most one back edge
- When `disc[v] == low[v]`, the vertex is the root of an SCC

### Q3: Can Tarjan's algorithm handle disconnected graphs?

**Answer:** Yes. The algorithm runs from each unvisited vertex, so it naturally handles disconnected graphs. Each DFS finds SCCs in that connected component.

### Q4: What is the maximum graph size Tarjan's can handle?

**Answer:** With O(V + E) space:
- **Memory limited**: ~10^6 vertices with average degree 10 is practical
- **Recursion depth**: Python's recursion limit may cause issues for deep DFS
- Use iterative version or increase recursion limit for very deep graphs

### Q5: How do you find the longest cycle using SCCs?

**Answer:** A cycle exists in an SCC if and only if the SCC has more than one vertex (or one vertex with a self-loop). The longest cycle = largest SCC size. Use Tarjan to find all SCCs, then find the maximum size.

### Q6: What is the condensation graph?

**Answer:** The condensation graph (or component graph) is the directed acyclic graph formed by contracting each SCC into a single vertex. Every directed graph's condensation is a DAG. Useful for understanding graph structure and solving problems like dependency resolution.

---

## Summary

Tarjan's Algorithm is a foundational graph algorithm for finding **Strongly Connected Components** in **O(V + E)** time with **O(V)** auxiliary space. Key takeaways:

- **Single-pass efficiency**: One DFS traversal finds all SCCs
- **Low-link values**: The core concept enabling SCC detection
- **Stack-based**: Uses explicit stack for tracking DFS path
- **Versatile applications**: Cycle detection, 2-SAT, dependency resolution, graph decomposition

When to use:
- ✅ Finding cycles in directed graphs
- ✅ Detecting circular dependencies
- ✅ Graph decomposition into DAG
- ✅ 2-SAT problems
- ❌ For undirected graphs, use Union-Find or simple DFS

This algorithm is essential for competitive programming and technical interviews, especially in problems involving graph cycles, dependencies, and topological properties.

---

## Related Algorithms

- [Kosaraju's Algorithm](./kosaraju.md) - Alternative SCC algorithm
- [Graph DFS](./graph-dfs.md) - Depth-first search fundamentals
- [Topological Sort](./topological-sort.md) - Ordering DAG vertices
- [Union-Find](./union-find.md) - For undirected cycle detection
- [Detect Cycle](./detect-cycle.md) - Directed cycle detection
