# Find The City With The Smallest Number Of Neighbors At A Threshold Distance

## Problem Description

There are n cities numbered from 0 to n-1. Given the array edges where edges[i] = [fromi, toi, weighti] represents a bidirectional and weighted edge between cities fromi and toi, and given the integer distanceThreshold.
Return the city with the smallest number of cities that are reachable through some path and whose distance is at most distanceThreshold, If there are multiple such cities, return the city with the greatest number.
Notice that the distance of a path connecting cities i and j is equal to the sum of the edges' weights along that path.

**Link to problem:** [Find The City With The Smallest Number Of Neighbors At A Threshold Distance - LeetCode 1334](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

---

## Pattern: Graph - Floyd-Warshall / Dijkstra

This problem demonstrates the **All-Pairs Shortest Path** pattern using Floyd-Warshall algorithm.

### Core Concept

The fundamental idea is:
- Compute shortest paths between all pairs of cities
- For each city, count reachable cities within distanceThreshold
- Select city with minimum count (tie: maximum city number)

---

## Examples

### Example

**Input:** n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4

**Output:** 3

**Explanation:** The figure above describes the graph.
The neighboring cities at a distanceThreshold = 4 for each city are:
- City 0 -> [City 1, City 2]
- City 1 -> [City 0, City 2, City 3]
- City 2 -> [City 0, City 1, City 3]
- City 3 -> [City 1, City 2]
Cities 0 and 3 have 2 neighboring cities at a distanceThreshold = 4, but we have to return city 3 since it has the greatest number.

### Example 2

**Input:** n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2

**Output:** 0

**Explanation:** The figure above describes the graph.
The neighboring cities at a distanceThreshold = 2 for each city are:
- City 0 -> [City 1]
- City 1 -> [City 0, City 4]
- City 2 -> [City 3, City 4]
- City 3 -> [City 2, City 4]
- City 4 -> [City 1, City 2, City 3]
The city 0 has 1 neighboring city at a distanceThreshold = 2.

---

## Constraints

- 2 <= n <= 100
- 1 <= edges.length <= n * (n - 1) / 2
- edges[i].length == 3
- 0 <= fromi < toi < n
- 1 <= weighti, distanceThreshold <= 10^4
- All pairs (fromi, toi) are distinct.

---

## Intuition

Since n <= 100, we can use Floyd-Warshall to compute all-pairs shortest paths:
1. Initialize distance matrix with infinity, set diagonal to 0, and set edges
2. Run Floyd-Warshall to compute shortest paths between all pairs
3. For each city i, count cities j where dist[i][j] <= distanceThreshold
4. Track city with smallest count, tie-breaking by largest city number

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Floyd-Warshall (Optimal for n <= 100)** - O(n³)
2. **Dijkstra from each city** - O(n * (E log V))

---

## Approach 1: Floyd-Warshall (Optimal)

### Algorithm Steps

1. Initialize distance matrix with infinity, diagonal to 0
2. Set edge weights in the matrix
3. Run Floyd-Warshall: for each k, for each i, for each j, update dist[i][j]
4. Count reachable cities for each city
5. Return city with minimum count (tie: maximum number)

### Code Implementation

````carousel
```python
from typing import List
import math

class Solution:
    def findTheCity(self, n: int, edges: List[List[int]], distanceThreshold: int) -> int:
        """
        Find city with smallest number of reachable cities.
        
        Args:
            n: Number of cities
            edges: List of [from, to, weight]
            distanceThreshold: Maximum distance for reachability
            
        Returns:
            City number with minimum reachable cities
        """
        dist = [[math.inf] * n for _ in range(n)]
        for i in range(n):
            dist[i][i] = 0
        for u, v, w in edges:
            dist[u][v] = dist[v][u] = w
        
        for k in range(n):
            for i in range(n):
                for j in range(n):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
        
        min_count = math.inf
        ans = -1
        for i in range(n):
            count = sum(1 for j in range(n) if j != i and dist[i][j] <= distanceThreshold)
            if count < min_count or (count == min_count and i > ans):
                min_count = count
                ans = i
        return ans
```

<!-- slide -->
```cpp
class Solution {
public:
    int findTheCity(int n, vector<vector<int>>& edges, int distanceThreshold) {
        const int INF = 1e9;
        vector<vector<int>> dist(n, vector<int>(n, INF));
        
        for (int i = 0; i < n; i++) dist[i][i] = 0;
        for (auto& e : edges) {
            dist[e[0]][e[1]] = e[2];
            dist[e[1]][e[0]] = e[2];
        }
        
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        
        int minCount = INF, ans = -1;
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (j != i && dist[i][j] <= distanceThreshold) count++;
            }
            if (count < minCount || (count == minCount && i > ans)) {
                minCount = count;
                ans = i;
            }
        }
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findTheCity(int n, int[][] edges, int distanceThreshold) {
        final int INF = Integer.MAX_VALUE / 2;
        int[][] dist = new int[n][n];
        
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], INF);
            dist[i][i] = 0;
        }
        
        for (int[] e : edges) {
            dist[e[0]][e[1]] = e[2];
            dist[e[1]][e[0]] = e[2];
        }
        
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        
        int minCount = INF, ans = -1;
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (j != i && dist[i][j] <= distanceThreshold) count++;
            }
            if (count < minCount || (count == minCount && i > ans)) {
                minCount = count;
                ans = i;
            }
        }
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} distanceThreshold
 * @return {number}
 */
var findTheCity = function(n, edges, distanceThreshold) {
    const INF = 1e9;
    const dist = Array.from({ length: n }, () => Array(n).fill(INF));
    
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    for (const [u, v, w] of edges) {
        dist[u][v] = w;
        dist[v][u] = w;
    }
    
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    
    let minCount = INF, ans = -1;
    for (let i = 0; i < n; i++) {
        let count = 0;
        for (let j = 0; j < n; j++) {
            if (j !== i && dist[i][j] <= distanceThreshold) count++;
        }
        if (count < minCount || (count === minCount && i > ans)) {
            minCount = count;
            ans = i;
        }
    }
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n³) |
| **Space** | O(n²) |

---

## Approach 2: Dijkstra from each city

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def findTheCity_dijkstra(self, n: int, edges: List[List[int]], distanceThreshold: int) -> int:
        # Build adjacency list
        graph = [[] for _ in range(n)]
        for u, v, w in edges:
            graph[u].append((v, w))
            graph[v].append((u, w))
        
        def dijkstra(start):
            dist = [float('inf')] * n
            dist[start] = 0
            pq = [(0, start)]
            
            while pq:
                d, node = heapq.heappop(pq)
                if d > dist[node]:
                    continue
                if d > distanceThreshold:
                    break
                for nei, w in graph[node]:
                    if dist[nei] > d + w:
                        dist[nei] = d + w
                        heapq.heappush(pq, (dist[nei], nei))
            
            return sum(1 for i in range(n) if i != start and dist[i] <= distanceThreshold)
        
        min_count = float('inf')
        ans = -1
        for i in range(n):
            count = dijkstra(i)
            if count < min_count or (count == min_count and i > ans):
                min_count = count
                ans = i
        return ans
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * (E log V)) |
| **Space** | O(n + E) |

---

## Comparison of Approaches

| Aspect | Floyd-Warshall | Dijkstra |
|--------|----------------|----------|
| **Time** | O(n³) | O(n * E log n) |
| **Space** | O(n²) | O(n + E) |
| **Best For** | Dense graphs | Sparse graphs |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Single-source shortest path |
| Number of Ways to Stay in the Same Place | [Link](https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps/) | Similar matrix exponentiation |
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS for shortest path |

---

## Video Tutorial Links

- [NeetCode - Find The City](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Floyd-Warshall Algorithm](https://www.youtube.com/watch?v=5xM48W6yG-sE) - Detailed walkthrough

---

## Follow-up Questions

### Q1: Why use Floyd-Warshall instead of Dijkstra?

**Answer:** For n <= 100, Floyd-Warshall is simpler and works well. Dijkstra from each city would be better for sparse graphs.

### Q2: How would you handle weighted graphs with negative edges?

**Answer:** Floyd-Warshall handles negative weights (but not negative cycles). Dijkstra doesn't work with negative weights.

### Q3: What if you need the actual paths, not just distances?

**Answer:** Maintain a next matrix to reconstruct paths.

---

## Common Pitfalls

### 1. Initialization
**Issue**: Not initializing diagonal to 0.
**Solution**: Set dist[i][i] = 0 for all i.

### 2. Infinity Value
**Issue**: Using a finite large number that's too small.
**Solution**: Use a value larger than maximum possible distance (e.g., INF = 1e9).

### 3. Tie Breaking
**Issue**: Not handling tie-breaking correctly.
**Solution**: Return the largest city number when counts are equal.

### 4. Self Loops
**Issue**: Counting city itself as reachable.
**Solution**: Skip j == i when counting reachable cities.

---

## Summary

The **Find The City With The Smallest Number Of Neighbors At A Threshold Distance** problem demonstrates **All-Pairs Shortest Path**:
- Use Floyd-Warshall for dense graphs (n <= 100)
- Count reachable cities within distance threshold
- Return city with minimum count, tie-breaking by largest number

This problem is excellent for understanding graph algorithms and the Floyd-Warshall dynamic programming approach.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/discuss/)
- [Floyd-Warshall - GeeksforGeeks](https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-32/)
