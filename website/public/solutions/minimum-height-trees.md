# Minimum Height Trees

## Problem Description

A tree is an undirected graph in which any two vertices are connected by exactly one path. In other words, any connected graph without simple cycles is a tree.

Given a tree of `n` nodes labelled from `0` to `n - 1`, and an array of `n - 1` edges where `edges[i] = [ai, bi]` indicates that there is an undirected edge between the two nodes `ai` and `bi` in the tree, you can choose any node of the tree as the root. When you select a node `x` as the root, the result tree has height `h`. Among all possible rooted trees, those with minimum height (i.e., min(h)) are called minimum height trees (MHTs).

Return a list of all MHTs' root labels. You can return the answer in any order.

The height of a rooted tree is the number of edges on the longest downward path between the root and a leaf.

---

## Examples

### Example 1

**Input:**
```python
n = 4, edges = [[1, 0], [1, 2], [1, 3]]
```

**Output:**
```python
[1]
```

**Explanation:**
As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT.

### Example 2

**Input:**
```python
n = 6, edges = [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]
```

**Output:**
```python
[3, 4]
```

---

## Constraints

- `1 <= n <= 2 * 10^4`
- `edges.length == n - 1`
- `0 <= ai, bi < n`
- `ai != bi`
- All the pairs `(ai, bi)` are distinct
- The given input is guaranteed to be a tree and there will be no repeated edges

---

## Pattern: Center Finding (Iterative Leaf Removal)

This problem uses the **topological approach** to find tree centers. The key insight is that the roots of minimum height trees are at the center(s) of the tree. We find centers by iteratively removing leaves until 1 or 2 nodes remain.

---

## Intuition

The key insight for this problem is understanding the relationship between tree centers and minimum height:

### Key Observations

1. **Tree Center**: The center of a tree is the middle node(s) of its longest path.

2. **MHT Roots**: The roots of minimum height trees are exactly the tree centers.

3. **Leaf Removal**: By iteratively removing leaves, we "peel" the tree from outside in.

4. **Stop Condition**: When ≤ 2 nodes remain, those are the centers (there can be at most 2).

### Why This Works

- Removing leaves reduces the tree's "layers"
- After removing k layers from outside, the remaining nodes are at equal distance from all outer nodes
- This equal distance property is exactly what minimizes maximum depth

### Algorithm Overview

1. Build adjacency list from edges
2. Find all leaf nodes (degree 1)
3. Iteratively remove leaves until ≤ 2 nodes remain
4. Return remaining nodes as MHT roots

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Iterative Leaf Removal** - Optimal solution
2. **BFS from Multiple Nodes** - Alternative approach

---

## Approach 1: Iterative Leaf Removal (Optimal)

### Algorithm Steps

1. Handle n == 1 edge case
2. Build adjacency list (graph)
3. Find initial leaves (degree 1)
4. While remaining > 2:
   - Remove leaves
   - Update neighbor degrees
   - Collect new leaves
5. Return remaining nodes

### Why It Works

This approach leverages the mathematical property that tree centers minimize the maximum distance to any node. By removing leaves layer by layer, we find these centers efficiently.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        """
        Find minimum height trees by iteratively removing leaves.
        
        The roots of MHTs are at the center(s) of the tree.
        
        Args:
            n: Number of nodes
            edges: List of edges
            
        Returns:
            List of root labels for MHTs
        """
        # Edge case: single node
        if n == 1:
            return [0]
        
        # Step 1: Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        # Step 2: Find initial leaves (degree 1)
        leaves = [i for i in range(n) if len(graph[i]) == 1]
        
        remaining = n
        
        # Step 3: Iteratively remove leaves
        while remaining > 2:
            new_leaves = []
            
            # Remove current leaves
            for leaf in leaves:
                # Get the single neighbor
                neighbor = graph[leaf][0]
                
                # Remove leaf from neighbor's adjacency
                graph[neighbor].remove(leaf)
                
                # If neighbor becomes leaf, add to next round
                if len(graph[neighbor]) == 1:
                    new_leaves.append(neighbor)
            
            remaining -= len(leaves)
            leaves = new_leaves
        
        return leaves
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
        if (n == 1) return {0};
        
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        // Find initial leaves
        vector<int> leaves;
        for (int i = 0; i < n; i++) {
            if (graph[i].size() == 1) leaves.push_back(i);
        }
        
        int remaining = n;
        
        // Iteratively remove leaves
        while (remaining > 2) {
            vector<int> newLeaves;
            
            for (int leaf : leaves) {
                int neighbor = graph[leaf][0];
                graph[neighbor].erase(
                    remove(graph[neighbor].begin(), graph[neighbor].end(), leaf),
                    graph[neighbor].end()
                );
                
                if (graph[neighbor].size() == 1) {
                    newLeaves.push_back(neighbor);
                }
            }
            
            remaining -= leaves.size();
            leaves = newLeaves;
        }
        
        return leaves;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findMinHeightTrees(int n, int[][] edges) {
        if (n == 1) return Arrays.asList(0);
        
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        
        // Find initial leaves
        List<Integer> leaves = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (graph.get(i).size() == 1) leaves.add(i);
        }
        
        int remaining = n;
        
        // Iteratively remove leaves
        while (remaining > 2) {
            List<Integer> newLeaves = new ArrayList<>();
            
            for (int leaf : leaves) {
                int neighbor = graph.get(leaf).get(0);
                graph.get(neighbor).remove((Integer) leaf);
                
                if (graph.get(neighbor).size() == 1) {
                    newLeaves.add(neighbor);
                }
            }
            
            remaining -= leaves.size();
            leaves = newLeaves;
        }
        
        return leaves;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
var findMinHeightTrees = function(n, edges) {
    if (n === 1) return [0];
    
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    // Find initial leaves
    let leaves = [];
    for (let i = 0; i < n; i++) {
        if (graph[i].length === 1) leaves.push(i);
    }
    
    let remaining = n;
    
    // Iteratively remove leaves
    while (remaining > 2) {
        const newLeaves = [];
        
        for (const leaf of leaves) {
            const neighbor = graph[leaf][0];
            const idx = graph[neighbor].indexOf(leaf);
            graph[neighbor].splice(idx, 1);
            
            if (graph[neighbor].length === 1) {
                newLeaves.push(neighbor);
            }
        }
        
        remaining -= leaves.length;
        leaves = newLeaves;
    }
    
    return leaves;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — each node processed at most twice |
| **Space** | O(n) — adjacency list |

---

## Approach 2: BFS from Multiple Nodes (Alternative)

### Algorithm Steps

1. Try each node as potential root
2. Compute tree height using BFS
3. Track minimum height and roots achieving it
4. Return all nodes with minimum height

### Why It Works

This is a brute-force approach that tries all possibilities. While less efficient, it helps understand the problem.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        """Alternative: BFS from each node."""
        if n == 1:
            return [0]
        
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)
        
        def bfs(start):
            visited = [False] * n
            visited[start] = True
            queue = deque([start])
            height = 0
            
            while queue:
                for _ in range(len(queue)):
                    node = queue.popleft()
                    for nei in graph[node]:
                        if not visited[nei]:
                            visited[nei] = True
                            queue.append(nei)
                height += 1
            
            return height - 1
        
        min_height = float('inf')
        roots = []
        
        for i in range(n):
            h = bfs(i)
            if h < min_height:
                min_height = h
                roots = [i]
            elif h == min_height:
                roots.append(i)
        
        return roots
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
        if (n == 1) return {0};
        
        vector<vector<int>> graph(n);
        for (auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        auto bfs = [&](int start) {
            vector<bool> visited(n, false);
            queue<int> q;
            q.push(start);
            visited[start] = true;
            int height = 0;
            
            while (!q.empty()) {
                int sz = q.size();
                while (sz--) {
                    int node = q.front(); q.pop();
                    for (int nei : graph[node]) {
                        if (!visited[nei]) {
                            visited[nei] = true;
                            q.push(nei);
                        }
                    }
                }
                height++;
            }
            return height - 1;
        };
        
        int minHeight = INT_MAX;
        vector<int> roots;
        
        for (int i = 0; i < n; i++) {
            int h = bfs(i);
            if (h < minHeight) {
                minHeight = h;
                roots = {i};
            } else if (h == minHeight) {
                roots.push_back(i);
            }
        }
        
        return roots;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findMinHeightTrees(int n, int[][] edges) {
        if (n == 1) return Arrays.asList(0);
        
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        
        int minHeight = Integer.MAX_VALUE;
        List<Integer> roots = new ArrayList<>();
        
        for (int i = 0; i < n; i++) {
            int h = bfs(i, graph, n);
            if (h < minHeight) {
                minHeight = h;
                roots = new ArrayList<>();
                roots.add(i);
            } else if (h == minHeight) {
                roots.add(i);
            }
        }
        
        return roots;
    }
    
    private int bfs(int start, List<List<Integer>> graph, int n) {
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();
        q.offer(start);
        visited[start] = true;
        int height = 0;
        
        while (!q.isEmpty()) {
            int size = q.size();
            while (size-- > 0) {
                int node = q.poll();
                for (int nei : graph.get(node)) {
                    if (!visited[nei]) {
                        visited[nei] = true;
                        q.offer(nei);
                    }
                }
            }
            height++;
        }
        
        return height - 1;
    }
}
```

<!-- slide -->
```javascript
var findMinHeightTrees = function(n, edges) {
    if (n === 1) return [0];
    
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const bfs = (start) => {
        const visited = new Array(n).fill(false);
        const q = [start];
        visited[start] = true;
        let height = 0;
        
        while (q.length) {
            const size = q.length;
            while (size--) {
                const node = q.shift();
                for (const nei of graph[node]) {
                    if (!visited[nei]) {
                        visited[nei] = true;
                        q.push(nei);
                    }
                }
            }
            height++;
        }
        
        return height - 1;
    };
    
    let minHeight = Infinity;
    let roots = [];
    
    for (let i = 0; i < n; i++) {
        const h = bfs(i);
        if (h < minHeight) {
            minHeight = h;
            roots = [i];
        } else if (h === minHeight) {
            roots.push(i);
        }
    }
    
    return roots;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) — BFS from each node |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Leaf Removal | BFS All Nodes |
|--------|--------------|----------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |
| **Difficulty** | Medium | Easy |

**Best Approach:** Use Approach 1 (Leaf Removal) - it's optimal and elegant.

---

## Related Problems

Based on similar themes (tree centers, graph traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Tree Centers | [Link](https://leetcode.com/problems/minimum-height-trees/) | This problem |
| Diameter of Tree | [Link](https://leetcode.com/problems/diameter-of-binary-tree/) | Longest path |
| Longest Path in Tree | [Link](https://leetcode.com/problems/tree-diameter/) | Similar concept |

### Pattern Reference

For more detailed explanations, see:
- **[Tree Center Pattern](/patterns/tree-center)**
- **[Graph BFS](/patterns/graph-bfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Minimum Height Trees - LeetCode 310](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Tree Center Finding](https://www.youtube.com/watch?v=example)** - Algorithm walkthrough
3. **[Topological Approach](https://www.youtube.com/watch?v=example)** - Leaf removal technique

### Related Concepts

- **[Tree Theory](https://www.youtube.com/watch=example)** - Graph fundamentals
- **[Leaf Removal](https://www.youtube.com/watch=example)** - Technique explanation

---

## Follow-up Questions

### Q1: Why are there at most 2 centers?

**Answer:** The longest path in a tree has a unique middle (if odd length) or two middles (if even length). These are the tree centers.

---

### Q2: Can there be more than 2 MHT roots?

**Answer:** No, mathematically there can be at most 2. For a path of even length, the two middle nodes both give minimum height.

---

### Q3: How would you find the actual MHT (not just roots)?

**Answer:** Start BFS/DFS from the center(s) to build the tree structure.

---

### Q4: What if edges were weighted?

**Answer:** The problem becomes finding weighted tree centers, which is more complex.

---

### Q5: How does this relate to finding tree diameter?

**Answer:** The centers are found at the middle of the diameter. You can also find diameter endpoints, then find middle.

---

## Common Pitfalls

### 1. Wrong Stopping Condition
**Issue**: Stopping at 0 nodes instead of ≤ 2.

**Solution**: Stop when remaining ≤ 2, not when empty.

### 2. Single Node
**Issue**: Not handling n == 1.

**Solution**: Return [0] for single node.

### 3. Degree Update
**Issue**: Not properly updating neighbor degrees.

**Solution**: Use .remove() or track degrees separately.

### 4. Multiple Centers
**Issue**: Assuming only one center.

**Solution**: There can be 1 or 2 centers.

### 5. Adjacency Modification
**Issue**: Modifying graph while iterating.

**Solution**: Collect new leaves before updating.

---

## Summary

The **Minimum Height Trees** problem demonstrates the elegant **leaf removal algorithm** for finding tree centers. The key insight is that MHT roots are exactly at the center(s) of the tree.

Key takeaways:
1. Tree centers = roots of minimum height trees
2. Find centers by iteratively removing leaves
3. Stop when 1 or 2 nodes remain
4. At most 2 centers possible
5. O(n) time with O(n) space

This problem is essential for understanding tree properties and center-finding algorithms.

### Pattern Summary

This problem exemplifies the **Tree Center** pattern, characterized by:
- Iterative leaf removal
- Finding middle of longest path
- At most 2 centers
- O(n) solution

For more details on this pattern and its variations, see the **[Tree Center Pattern](/patterns/tree-center)**.

---

## Additional Resources

- [LeetCode Problem 310](https://leetcode.com/problems/minimum-height-trees/) - Official problem page
- [Tree Center - GeeksforGeeks](https://www.geeksforgeeks.org/find-the-centers-of-a-tree/) - Detailed explanation
- [Topological Approach](https://www.geeksforgeeks.org/center-of-tree/) - Alternative view
- [Pattern: Tree Center](/patterns/tree-center) - Comprehensive pattern guide
