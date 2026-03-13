# Path With Maximum Probability

## LeetCode Link

[LeetCode 1514 - Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/)

---

## Problem Description

You are given an undirected weighted graph of `n` nodes (0-indexed), represented by an edge list where `edges[i] = [a, b]` is an undirected edge connecting the nodes `a` and `b` with a probability of success of traversing that edge `succProb[i]`.

Given two nodes `start` and `end`, find the path with the maximum probability of success to go from `start` to `end` and return its success probability. If there is no path from `start` to `end`, return `0`. Your answer will be accepted if it differs from the correct answer by at most `1e-5`.

---

## Examples

### Example 1

**Input:**
```
n = 3
edges = [[0,1],[1,2],[0,2]]
succProb = [0.5,0.5,0.2]
start = 0
end = 2
```

**Output:**
```
0.25000
```

**Explanation:**
- There are two paths from start to end:
  - 0 → 1 → 2: probability = 0.5 × 0.5 = 0.25
  - 0 → 2: probability = 0.2
- Maximum probability is 0.25

### Example 2

**Input:**
```
n = 3
edges = [[0,1],[1,2],[0,2]]
succProb = [0.5,0.5,0.3]
start = 0
end = 2
```

**Output:**
```
0.30000
```

**Explanation:**
- Maximum probability path is 0 → 2 with probability 0.3

### Example 3

**Input:**
```
n = 3
edges = [[0,1]]
succProb = [0.5]
start = 0
end = 2
```

**Output:**
```
0.00000
```

**Explanation:**
- There is no path between 0 and 2

---

## Constraints

- `2 <= n <= 10^4`
- `0 <= start, end < n`
- `start != end`
- `0 <= a, b < n`
- `a != b`
- `0 <= succProb.length == edges.length <= 2*10^4`
- `0 <= succProb[i] <= 1`
- There is at most one edge between every two nodes.

---

## Pattern: Modified Dijkstra's Algorithm

This problem uses a **modified Dijkstra** algorithm where we maximize probability instead of minimizing distance. Use max-heap by negating probabilities.

---

## Intuition

The key insight for this problem is modifying Dijkstra's algorithm to maximize probability instead of minimizing distance:

### Key Observations

1. **Probability Multiplication**: The probability of a path is the product of all edge probabilities along the path, not the sum.

2. **Maximization Instead of Minimization**: Dijkstra typically minimizes distance; here we maximize probability.

3. **Max-Heap Required**: Use max-heap (priority queue) to always process nodes with highest probability first.

4. **Graph is Undirected**: Each edge can be traversed in both directions with the same probability.

### Algorithm Overview

1. **Build adjacency list**: Create graph with edges and probabilities
2. **Initialize**: Set probability[start] = 1.0
3. **Dijkstra with max-heap**: 
   - Pop node with highest probability
   - Update neighbors if better path found
4. **Return**: probability[end]

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Modified Dijkstra** - Optimal solution
2. **Bellman-Ford** - Alternative approach

---

## Approach 1: Modified Dijkstra (Optimal)

### Algorithm Steps

1. Build adjacency list from edges
2. Initialize probability array with 0, set start = 1.0
3. Use max-heap (negate probabilities for min-heap)
4. Process nodes with highest probability first
5. Update neighbor probabilities by multiplication

### Why It Works

Dijkstra's algorithm works because we always process the node with the highest probability first. Once a node is processed with probability p, no better path to that node can be found (since all remaining paths would have probability ≤ p).

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start: int, end: int) -> float:
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for i, (a, b) in enumerate(edges):
            graph[a].append((b, succProb[i]))
            graph[b].append((a, succProb[i]))
        
        # Initialize probabilities
        prob = [0.0] * n
        prob[start] = 1.0
        
        # Max-heap using negative values
        pq = [(-1.0, start)]
        
        while pq:
            p, u = heapq.heappop(pq)
            p = -p
            
            # Skip if we've already found a better path
            if p < prob[u]:
                continue
            
            # Early termination if we reached the target
            if u == end:
                return prob[end]
            
            # Explore neighbors
            for v, w in graph[u]:
                new_prob = prob[u] * w
                if new_prob > prob[v]:
                    prob[v] = new_prob
                    heapq.heappush(pq, (-new_prob, v))
        
        return prob[end]
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <utility>
using namespace std;

class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges, vector<double>& succProb, int start, int end) {
        // Build adjacency list
        vector<vector<pair<int, double>>> graph(n);
        for (int i = 0; i < edges.size(); i++) {
            int a = edges[i][0], b = edges[i][1];
            graph[a].push_back({b, succProb[i]});
            graph[b].push_back({a, succProb[i]});
        }
        
        // Initialize probabilities
        vector<double> prob(n, 0.0);
        prob[start] = 1.0;
        
        // Max-heap using negative values
        priority_queue<pair<double, int>> pq;
        pq.push({1.0, start});
        
        while (!pq.empty()) {
            auto [p, u] = pq.top();
            pq.pop();
            
            if (p < prob[u]) continue;
            if (u == end) return prob[end];
            
            for (auto& [v, w] : graph[u]) {
                double new_prob = prob[u] * w;
                if (new_prob > prob[v]) {
                    prob[v] = new_prob;
                    pq.push({new_prob, v});
                }
            }
        }
        
        return prob[end];
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
        // Build adjacency list
        List<List<double[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int i = 0; i < edges.length; i++) {
            int a = edges[i][0], b = edges[i][1];
            graph.get(a).add(new Double[]{ (double) b, succProb[i]});
            graph.get(b).add(new Double[]{ (double) a, succProb[i]});
        }
        
        // Initialize probabilities
        double[] prob = new double[n];
        prob[start] = 1.0;
        
        // Max-heap
        PriorityQueue<double[]> pq = new PriorityQueue<>((a, b) -> Double.compare(b[0], a[0]));
        pq.add(new Double[]{1.0, (double) start});
        
        while (!pq.isEmpty()) {
            double[] curr = pq.poll();
            double p = curr[0];
            int u = (int) curr[1];
            
            if (p < prob[u]) continue;
            if (u == end) return prob[end];
            
            for (double[] neighbor : graph.get(u)) {
                int v = (int) neighbor[0];
                double w = neighbor[1];
                double new_prob = prob[u] * w;
                if (new_prob > prob[v]) {
                    prob[v] = new_prob;
                    pq.add(new double[]{new_prob, (double) v});
                }
            }
        }
        
        return prob[end];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} succProb
 * @param {number} start
 * @param {number} end
 * @return {number}
 */
var maxProbability = function(n, edges, succProb, start, end) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        graph[a].push([b, succProb[i]]);
        graph[b].push([a, succProb[i]]);
    }
    
    // Initialize probabilities
    const prob = new Array(n).fill(0);
    prob[start] = 1.0;
    
    // Max-heap using negative values
    const pq = [[-1.0, start]];
    
    while (pq.length > 0) {
        const [negP, u] = pq.shift();
        const p = -negP;
        
        if (p < prob[u]) continue;
        if (u === end) return prob[end];
        
        for (const [v, w] of graph[u]) {
            const newProb = prob[u] * w;
            if (newProb > prob[v]) {
                prob[v] = newProb;
                // Insert and sort (simplified for JavaScript)
                pq.push([-newProb, v]);
                pq.sort((a, b) => a[0] - b[0]);
            }
        }
    }
    
    return prob[end];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((V + E) log V) — priority queue operations |
| **Space** | O(V + E) — graph and probability array |

---

## Approach 2: Bellman-Ford (Alternative)

### Algorithm Steps

1. Initialize probabilities
2. Relax edges V-1 times
3. Return probability[end]

### Why It Works

Bellman-Ford can handle negative weights but works here too. More straightforward but less efficient.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start: int, end: int) -> float:
        prob = [0.0] * n
        prob[start] = 1.0
        
        # Relax edges V-1 times
        for _ in range(n - 1):
            updated = False
            for i, (a, b) in enumerate(edges):
                w = succProb[i]
                if prob[a] > 0:
                    prob[b] = max(prob[b], prob[a] * w)
                    updated = True
                if prob[b] > 0:
                    prob[a] = max(prob[a], prob[b] * w)
                    updated = True
            if not updated:
                break
        
        return prob[end]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V × E) — V iterations over all edges |
| **Space** | O(V) — probability array |

---

## Comparison of Approaches

| Aspect | Modified Dijkstra | Bellman-Ford |
|--------|-------------------|--------------|
| **Time Complexity** | O((V+E) log V) | O(V × E) |
| **Space Complexity** | O(V + E) | O(V) |
| **Implementation** | Moderate | Simple |

**Best Approach:** Use Modified Dijkstra for optimal performance.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Facebook
- **Difficulty**: Medium
- **Concepts Tested**: Modified Dijkstra, Graph algorithms, Probability

### Learning Outcomes

1. **Algorithm Modification**: Learn to adapt Dijkstra for different optimization criteria
2. **Graph Traversal**: Master weighted graph algorithms
3. **Max-Heap Usage**: Understand priority queue for maximization

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Path With Minimum Effort | [Link](https://leetcode.com/problems/path-with-minimum-effort/) | Similar path problem |
| Cheapest Flights Within K Stops | [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Modified Dijkstra |
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Standard Dijkstra |

### Pattern Reference

For more details, see:
- **[Graph BFS](/patterns/graph-bfs-connected-components-island-counting)**
- **[Dijkstra](/patterns/minimum-spanning-tree-kruskal-prim-dsu-heap)**

---

## Video Tutorial Links

1. **[NeetCode - Path With Maximum Probability](https://www.youtube.com/watch?v=EXh3LZlJ5Eg)** - Clear explanation
2. **[Dijkstra's Algorithm](https://www.youtube.com/watch?v=pVfj6mxhdQw)** - Algorithm tutorial

---

## Follow-up Questions

### Q1: How would you modify the solution to find the path itself (not just probability)?

**Answer:** Maintain a parent array to track the path. When updating probability, also update the parent to reconstruct the path later.

---

### Q2: What if edges had different success probabilities for each direction?

**Answer:** Store separate probabilities for each direction in the adjacency list instead of treating edges as bidirectional with same probability.

---

### Q3: How would you handle very small probabilities that cause underflow?

**Answer:** Use log transformation: maximize sum of log(probabilities) instead of product. Then use standard shortest path algorithms.

---

### Q4: Can you solve this with BFS?

**Answer:** Not directly, because BFS doesn't handle weighted edges optimally. The probability multiplication requires Dijkstra-style processing.

---

## Common Pitfalls

### 1. Max-Heap Implementation
**Issue**: Python's heapq is min-heap, so use (-prob, node) for max behavior.

**Solution**: Negate probabilities when pushing to heap.

### 2. Probability Multiplication
**Issue**: prob[v] = prob[u] * w, not addition (unlike shortest path).

**Solution**: Multiply probabilities along the path.

### 3. Early Termination
**Issue**: Cannot early-return since we need to process all nodes for max probability.

**Solution**: Continue until queue is empty or check all relevant nodes.

---

## Summary

The **Path With Maximum Probability** problem demonstrates modifying Dijkstra's algorithm:

- **Modified Dijkstra**: Maximize probability instead of minimizing distance
- **Max-Heap**: Use negative values or custom comparator
- **Probability Multiplication**: Path probability = product of edge probabilities

Key takeaways:
1. Use max-heap to process highest probability first
2. Multiply probabilities along the path
3. Update neighbor probability: prob[v] = prob[u] * edge_prob
4. O((V+E) log V) time complexity

This problem is excellent for learning algorithm modification and graph algorithms.

### Pattern Summary

This problem exemplifies the **Modified Dijkstra** pattern, characterized by:
- Different optimization criterion (max vs min)
- Weighted edges with multiplication
- Priority queue for efficient processing

---

## Additional Resources

- [LeetCode 1514 - Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/) - Official problem page
- [Dijkstra's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/dijkstras-algorithm/) - Algorithm explanation
- [Pattern: Graph Algorithms](/patterns/graph-bfs-connected-components-island-counting) - Related patterns
