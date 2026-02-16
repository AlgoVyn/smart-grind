# Merge Intervals

## Problem Statement

Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

This problem is a classic application of the **Greedy - Interval Merging/Scheduling** pattern.

**Link to problem:** [Merge Intervals - LeetCode 56](https://leetcode.com/problems/merge-intervals/)

**Constraints:**
- `1 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i <= end_i <= 10^4`

---

## Pattern: Greedy - Interval Merging/Scheduling

This problem demonstrates the core concepts of interval merging:
- **Sort by start time**: Process intervals in order
- **Greedy local decision**: Merge or start new interval based on overlap
- **Optimal substructure**: Building solution from sorted subproblems

### Core Concept

The greedy approach works because:
1. Once sorted by start time, we never need to look back
2. Each decision (merge or new interval) is locally optimal
3. This leads to a globally optimal solution

---

## Examples

### Example 1

**Input:**
```
intervals = [[1,3],[2,6],[8,10],[15,18]]
```

**Output:**
```
[[1,6],[8,10],[15,18]]
```

**Explanation:** Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

### Example 2

**Input:**
```
intervals = [[1,4],[4,5]]
```

**Output:**
```
[[1,5]]
```

**Explanation:** Intervals [1,4] and [4,5] are considered overlapping (they share endpoint 4).

---

## Intuition

The key insight is that after sorting intervals by their start times:
- If the current interval overlaps with the previous merged interval, they should be merged
- Otherwise, they are independent and should be added as a new interval

### Why Sorting Works

Consider unsorted intervals: `[[1,3], [8,10], [2,6], [15,18]]`
- Without sorting, we'd need to check all pairs - O(n²)
- With sorting by start: `[[1,3], [2,6], [8,10], [15,18]]`
- Now we only need to compare each interval with the last merged one - O(n)

### Overlap Detection

Two intervals `[a, b]` and `[c, d]` overlap if and only if:
- `max(a, c) <= min(b, d)` 
- Or equivalently: `c <= b AND a <= d`

---

## Multiple Approaches

### Approach 1: Standard Greedy Merge (Optimal)

This is the optimal approach with O(n log n) time complexity.

#### Algorithm Steps

1. **Sort intervals** by start time in ascending order
2. **Initialize merged list** with the first interval
3. **Iterate through remaining intervals**:
   - Get the last interval in merged list
   - If current interval overlaps with last (current.start <= last.end):
     - Extend the last interval's end: `last.end = max(last.end, current.end)`
   - Otherwise:
     - Add current interval as new entry to merged list
4. **Return merged list**

#### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        """
        Merge all overlapping intervals.
        
        Args:
            intervals: List of [start, end] intervals
            
        Returns:
            List of merged non-overlapping intervals
        
        Time Complexity: O(n log n) for sorting
        Space Complexity: O(n) for storing result
        """
        if not intervals:
            return []
        
        # Step 1: Sort intervals by start time
        # This is the KEY step that enables greedy approach
        intervals.sort(key=lambda x: x[0])
        
        # Step 2: Initialize merged list with first interval
        merged = [intervals[0]]
        
        # Step 3: Iterate through remaining intervals
        for start, end in intervals[1:]:
            # Get the last merged interval
            last_start, last_end = merged[-1]
            
            # Check if current interval overlaps with last
            if start <= last_end:
                # Merge: extend the end to maximum
                merged[-1][1] = max(last_end, end)
            else:
                # No overlap: add as new interval
                merged.append([start, end])
        
        return merged


# Alternative implementation with cleaner code
def merge_alternative(intervals: List[List[int]]) -> List[List[int]]:
    """Alternative implementation with clearer merge logic."""
    if len(intervals) <= 1:
        return intervals
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    result = [intervals[0]]
    
    for start, end in intervals[1:]:
        prev_start, prev_end = result[-1]
        
        # Check for overlap: current starts before or at prev ends
        if start <= prev_end:
            # Extend the previous interval
            result[-1] = [prev_start, max(prev_end, end)]
        else:
            # Add new interval
            result.append([start, end])
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    /**
     * Merge all overlapping intervals.
     * 
     * @param intervals - Vector of [start, end] intervals
     * @return Vector of merged non-overlapping intervals
     * 
     * Time Complexity: O(n log n) for sorting
     * Space Complexity: O(n) for storing result
     */
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) {
            return {};
        }
        
        // Step 1: Sort intervals by start time
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];
             });
        
        // Step 2: Initialize merged list with first interval
        vector<vector<int>> merged;
        merged.push_back(intervals[0]);
        
        // Step 3: Iterate through remaining intervals
        for (size_t i = 1; i < intervals.size(); i++) {
            const vector<int& current = intervals[i];
            vector<int>& last = merged.back();
            
            // Check if current interval overlaps with last
            if (current[0] <= last[1]) {
                // Merge: extend the end to maximum
                last[1] = max(last[1], current[1]);
            } else {
                // No overlap: add as new interval
                merged.push_back(current);
            }
        }
        
        return merged;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new int[0][];
        }
        
        // Step 1: Sort intervals by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        
        // Step 2: Initialize merged list with first interval
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);
        
        // Step 3: Iterate through remaining intervals
        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            int[] current = intervals[i];
            
            // Check if current interval overlaps with last
            if (current[0] <= last[1]) {
                // Merge: extend the end to maximum
                last[1] = Math.max(last[1], current[1]);
            } else {
                // No overlap: add as new interval
                merged.add(current);
            }
        }
        
        return merged.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * Merge all overlapping intervals.
 * 
 * @param {number[][]} intervals - Array of [start, end] intervals
 * @return {number[][]} - Array of merged non-overlapping intervals
 * 
 * Time Complexity: O(n log n) for sorting
 * Space Complexity: O(n) for storing result
 */
function merge(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Step 1: Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Step 2: Initialize merged list with first interval
    const merged = [intervals[0]];
    
    // Step 3: Iterate through remaining intervals
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        const last = merged[merged.length - 1];
        
        // Check if current interval overlaps with last
        if (start <= last[1]) {
            // Merge: extend the end to maximum
            last[1] = Math.max(last[1], end);
        } else {
            // No overlap: add as new interval
            merged.push([start, end]);
        }
    }
    
    return merged;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Sorting dominates, single pass through intervals |
| **Space** | O(n) - Storing merged intervals in worst case |

---

### Approach 2: Using Index Tracking

An alternative implementation that tracks indices instead of modifying in place.

#### Code Implementation

````carousel
```python
from typing import List

def merge_by_index(intervals: List[List[int]]) -> List[List[int]]:
    """Merge using index tracking approach."""
    if not intervals:
        return []
    
    # Sort and keep track of original indices (if needed)
    sorted_intervals = sorted(intervals, key=lambda x: (x[0], x[1]))
    
    result = []
    start = sorted_intervals[0][0]
    end = sorted_intervals[0][1]
    
    for i in range(1, len(sorted_intervals)):
        current_start, current_end = sorted_intervals[i]
        
        if current_start <= end:
            # Overlapping: extend the range
            end = max(end, current_end)
        else:
            # Non-overlapping: save current range and start new
            result.append([start, end])
            start = current_start
            end = current_end
    
    # Don't forget the last interval
    result.append([start, end])
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeByIndex(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    
    sort(intervals.begin(), intervals.end(),
         [](const vector<int>& a, const vector<int>& b) {
             return a[0] < b[0];
         });
    
    vector<vector<int>> result;
    int start = intervals[0][0];
    int end = intervals[0][1];
    
    for (size_t i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= end) {
            end = max(end, intervals[i][1]);
        } else {
            result.push_back({start, end});
            start = intervals[i][0];
            end = intervals[i][1];
        }
    }
    
    result.push_back({start, end});
    return result;
}
```

<!-- slide -->
```java
public int[][] mergeByIndex(int[][] intervals) {
    if (intervals == null || intervals.length == 0) {
        return new int[0][];
    }
    
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    
    List<int[]> result = new ArrayList<>();
    int start = intervals[0][0];
    int end = intervals[0][1];
    
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= end) {
            end = Math.max(end, intervals[i][1]);
        } else {
            result.add(new int[]{start, end});
            start = intervals[i][0];
            end = intervals[i][1];
        }
    }
    
    result.add(new int[]{start, end});
    return result.toArray(new int[0][]);
}
```

<!-- slide -->
```javascript
function mergeByIndex(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [];
    let start = intervals[0][0];
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        const [currentStart, currentEnd] = intervals[i];
        
        if (currentStart <= end) {
            end = Math.max(end, currentEnd);
        } else {
            result.push([start, end]);
            start = currentStart;
            end = currentEnd;
        }
    }
    
    result.push([start, end]);
    return result;
}
```
````

### Approach 3: Connected Components (DFS)

This approach treats intervals as nodes in a graph and finds connected components using Depth First Search.

#### Algorithm Steps

1. **Build adjacency list**: For each interval, find all other intervals that overlap
2. **Use DFS to find connected components**: Each component is a group of overlapping intervals
3. **Merge each component**: Find min start and max end for each component
4. **Return sorted result**

#### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def merge_dfs(self, intervals: List[List[int]]) -> List[List[int]]:
        """Merge using Connected Components (DFS)."""
        if not intervals:
            return []
        n = len(intervals)
        if n <= 1:
            return intervals
        
        # Build adjacency list
        adj = defaultdict(list)
        for i in range(n):
            for j in range(i + 1, n):
                if intervals[i][0] <= intervals[j][1] and intervals[j][0] <= intervals[i][1]:
                    adj[i].append(j)
                    adj[j].append(i)
        
        visited = [False] * n
        result = []
        
        def dfs(node):
            stack = [node]
            min_start, max_end = intervals[node]
            visited[node] = True
            while stack:
                curr = stack.pop()
                min_start = min(min_start, intervals[curr][0])
                max_end = max(max_end, intervals[curr][1])
                for neighbor in adj[curr]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        stack.append(neighbor)
            return [min_start, max_end]
        
        for i in range(n):
            if not visited[i]:
                result.append(dfs(i))
        
        return sorted(result, key=lambda x: x[0])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <stack>
using namespace std;

class Solution {
public:
    vector<vector<int>> mergeDFS(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        int n = intervals.size();
        vector<vector<int>> adj(n);
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (!(intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0])) {
                    adj[i].push_back(j);
                    adj[j].push_back(i);
                }
        vector<bool> visited(n, false);
        vector<vector<int>> result;
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                stack<int> st;
                st.push(i);
                visited[i] = true;
                int minStart = intervals[i][0], maxEnd = intervals[i][1];
                while (!st.empty()) {
                    int node = st.top(); st.pop();
                    minStart = min(minStart, intervals[node][0]);
                    maxEnd = max(maxEnd, intervals[node][1]);
                    for (int nb : adj[node])
                        if (!visited[nb]) { visited[nb] = true; st.push(nb); }
                }
                result.push_back({minStart, maxEnd});
            }
        }
        sort(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[][] mergeDFS(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return new int[0][];
        int n = intervals.length;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (!(intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0])) {
                    adj.get(i).add(j);
                    adj.get(j).add(i);
                }
        boolean[] visited = new boolean[n];
        List<int[]> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                Stack<Integer> st = new Stack<>();
                st.push(i);
                visited[i] = true;
                int minStart = intervals[i][0], maxEnd = intervals[i][1];
                while (!st.isEmpty()) {
                    int node = st.pop();
                    minStart = Math.min(minStart, intervals[node][0]);
                    maxEnd = Math.max(maxEnd, intervals[node][1]);
                    for (int nb : adj.get(node))
                        if (!visited[nb]) { visited[nb] = true; st.push(nb); }
                }
                result.add(new int[]{minStart, maxEnd});
            }
        }
        return result.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
function mergeDFS(intervals) {
    if (!intervals || intervals.length === 0) return [];
    const n = intervals.length;
    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            if (!(intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0])) {
                adj[i].push(j);
                adj[j].push(i);
            }
    const visited = new Array(n).fill(false);
    const result = [];
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            const stack = [i];
            visited[i] = true;
            let minStart = intervals[i][0], maxEnd = intervals[i][1];
            while (stack.length) {
                const node = stack.pop();
                minStart = Math.min(minStart, intervals[node][0]);
                maxEnd = Math.max(maxEnd, intervals[node][1]);
                for (const nb of adj[node])
                    if (!visited[nb]) { visited[nb] = true; stack.push(nb); }
            }
            result.push([minStart, maxEnd]);
        }
    }
    return result.sort((a, b) => a[0] - b[0]);
}
```
````

### Complexity: O(n²) time, O(n²) space

---

### Approach 4: Union Find (Disjoint Set Union)

Uses DSU to group overlapping intervals into connected components.

#### Algorithm Steps

1. Initialize Union Find
2. Union all overlapping interval pairs
3. Group by root and merge each group

#### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry: return
        if self.rank[rx] < self.rank[ry]: rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]: self.rank[rx] += 1

class Solution:
    def merge_union_find(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals: return []
        n = len(intervals)
        if n <= 1: return intervals
        
        uf = UnionFind(n)
        for i in range(n):
            for j in range(i + 1, n):
                if not (intervals[i][1] < intervals[j][0] or intervals[j][1] < intervals[i][0]):
                    uf.union(i, j)
        
        groups = defaultdict(list)
        for i in range(n): groups[uf.find(i)].append(i)
        
        result = []
        for indices in groups.values():
            min_start = min(intervals[i][0] for i in indices)
            max_end = max(intervals[i][1] for i in indices)
            result.append([min_start, max_end])
        
        return sorted(result, key=lambda x: x[0])
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class UnionFind {
    vector<int> p, r;
public:
    UnionFind(int n) : p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] != x ? p[x] = find(p[x]) : x; }
    void unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (r[rx] < r[ry]) swap(rx, ry);
        p[ry] = rx;
        if (r[rx] == r[ry]) r[rx]++;
    }
};

class Solution {
public:
    vector<vector<int>> mergeUnionFind(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        int n = intervals.size();
        UnionFind uf(n);
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (!(intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0]))
                    uf.unite(i, j);
        unordered_map<int, vector<int>> m;
        for (int i = 0; i < n; i++) m[uf.find(i)].push_back(i);
        vector<vector<int>> res;
        for (auto& kv : m) {
            int mn = INT_MAX, mx = INT_MIN;
            for (int idx : kv.second) {
                mn = min(mn, intervals[idx][0]);
                mx = max(mx, intervals[idx][1]);
            }
            res.push_back({mn, mx});
        }
        sort(res.begin(), res.end());
        return res;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    static class UF {
        int[] p, r;
        UF(int n) { p = new int[n]; r = new int[n]; Arrays.fill(p, n); for(int i=0;i<n;i++)p[i]=i; }
        int find(int x) { return p[x] != x ? p[x] = find(p[x]) : x; }
        void unite(int x, int y) {
            int rx = find(x), ry = find(y);
            if (rx == ry) return;
            if (r[rx] < r[ry]) { int t=rx;rx=ry;ry=t; }
            p[ry] = rx;
            if (r[rx] == r[ry]) r[rx]++;
        }
    }
    
    public int[][] mergeUnionFind(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return new int[0][];
        int n = intervals.length;
        UF uf = new UF(n);
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (!(intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0]))
                    uf.unite(i, j);
        Map<Integer, List<Integer>> g = new HashMap<>();
        for (int i = 0; i < n; i++)
            g.computeIfAbsent(uf.find(i), k -> new ArrayList<>()).add(i);
        List<int[]> res = new ArrayList<>();
        for (List<Integer> ids : g.values()) {
            int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
            for (int id : ids) {
                mn = Math.min(mn, intervals[id][0]);
                mx = Math.max(mx, intervals[id][1]);
            }
            res.add(new int[]{mn, mx});
        }
        return res.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
class UF {
    constructor(n) {
        this.p = Array.from({length:n}, (_,i)=>i);
        this.r = new Array(n).fill(0);
    }
    find(x) { return this.p[x] !== x ? this.p[x] = this.find(this.p[x]) : x; }
    unite(x, y) {
        let rx = this.find(x), ry = this.find(y);
        if (rx === ry) return;
        if (this.r[rx] < this.r[ry]) [rx, ry] = [ry, rx];
        this.p[ry] = rx;
        if (this.r[rx] === this.r[ry]) this.r[rx]++;
    }
}

function mergeUnionFind(intervals) {
    if (!intervals || !intervals.length) return [];
    const n = intervals.length;
    const uf = new UF(n);
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            if (!(intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0]))
                uf.unite(i, j);
    const g = {};
    for (let i = 0; i < n; i++) {
        const r = uf.find(i);
        if (!g[r]) g[r] = [i]; else g[r].push(i);
    }
    const res = Object.values(g).map(ids => [
        Math.min(...ids.map(i => intervals[i][0])),
        Math.max(...ids.map(i => intervals[i][1]))
    ]);
    return res.sort((a,b) => a[0]-b[0]);
}
```
````

### Complexity: O(n²) time, O(n) space

---

## Comparison of All Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Greedy | O(n log n) | O(n) | Optimal |
| Index Tracking | O(n log n) | O(n) | Alternative |
| DFS | O(n²) | O(n²) | Graph view |
| Union Find | O(n²) | O(n) | DSU approach |

---

## Why This Approach is Optimal

### Key Advantages

1. **O(n log n) Time**: Sorting dominates, linear pass is O(n)
2. **O(n) Space**: Only storing result, no extra data structures
3. **Single Pass After Sort**: Greedy decisions are O(1) each
4. **No Backtracking**: Sorted order ensures we never revisit decisions

### Why Greedy Works Here

- **Optimal Substructure**: The merged intervals can be built incrementally
- **Greedy Choice Property**: At each step, merging with the last interval is locally optimal
- **No Need for DP**: No need to consider multiple choices, just one decision per interval

---

## Related Problems

### Same Pattern - Interval Operations

| Problem | LeetCode Link | Description |
|---------|----------------|-------------|
| Insert Interval | [Link](https://leetcode.com/problems/insert-interval/) | Insert and merge new interval |
| Non-overlapping Intervals | [Link](https://leetcode.com/problems/non-overlapping-intervals/) | Remove minimum intervals |
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Minimum meeting rooms |
| Interval List Intersections | [Link](https://leetcode.com/problems/interval-list-intersections/) | Find intersection of two lists |

### Similar Greedy Patterns

| Problem | LeetCode Link | Pattern |
|---------|----------------|---------|
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Greedy reachability |
| Gas Station | [Link](https://leetcode.com/problems/gas-station/) | Greedy circular tour |
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Greedy scheduling |

---

## Video Tutorial Links

### Official & Recommended Tutorials

- [NeetCode - Merge Intervals](https://www.youtube.com/watch?v=44H3cEC2ZM8) - Clear visual explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=2MZ8CquHMOE) - Official editorial
- [Back to Back SWE - Merge Intervals](https://www.youtube.com/watch?v=5G_2NGlEbl0) - Detailed walkthrough

### Related Concepts

- [Interval Scheduling Explained](https://www.youtube.com/watch?v=sz-OzdKck9I) - Activity selection
- [Sorting for Interviews](https://www.youtube.com/watch?v=oNj8yOyQvZ4) - Importance of sorting
- [Two Pointers Pattern](https://www.youtube.com/watch?v=4r_6o9oM4uE) - Related technique

---

## Follow-up Questions

### Q1: What if intervals can be modified in place?

**Answer:** You can sort in place and modify the original array, saving O(n) space. The algorithm remains the same, but you modify `intervals[i]` instead of appending to result.

### Q2: How would you handle very large datasets?

**Answer:** The O(n log n) sorting is the bottleneck. For truly massive datasets, consider external sorting or streaming approaches. The greedy algorithm itself is already optimal.

### Q3: Can this be solved without sorting?

**Answer:** Without sorting, you'd need to check all pairs O(n²), making it much slower. Sorting is essential for the greedy approach to work efficiently.

### Q4: How would you adapt this for 3D intervals?

**Answer:** Sort by the first dimension, then apply the same logic. For more dimensions, you'd need more complex data structures like segment trees or interval trees.

### Q5: What edge cases should be tested?

**Answer:**
- Empty intervals array
- Single interval
- All intervals overlapping
- No intervals overlapping
- Intervals with same start and end
- Intervals in reverse order

---

## Common Pitfalls

### 1. Forgetting to Sort
**Issue**: Not sorting leads to incorrect results
**Solution**: Always sort by start time first - this is mandatory

### 2. Off-by-One in Overlap Check
**Issue**: Using `<` instead of `<=` for intervals that share endpoints
**Solution**: Remember `[1,3]` and `[3,5]` overlap at point 3, use `<=`

### 3. Not Updating the Last Interval
**Issue**: Forgetting to extend the merged interval's end
**Solution**: Always use `max(last_end, current_end)` when merging

### 4. Missing Last Interval
**Issue**: Forgetting to add the final merged interval to result
**Solution**: After the loop, ensure the last interval is added

### 5. Input Mutation
**Issue**: Modifying the input array when not intended
**Solution**: Create a copy or new result array if input must be preserved

---

## Summary

The **Merge Intervals** problem perfectly demonstrates the **Greedy - Interval Merging/Scheduling** pattern:

- **Core Insight**: Sort by start time, then greedily merge overlapping intervals
- **Optimal Complexity**: O(n log n) time, O(n) space
- **Single Pass**: After sorting, each interval is processed exactly once
- **Universal Pattern**: Same algorithm applies to many interval problems

### Key Takeaways

1. **Sorting is essential** - Enables O(n) greedy processing after O(n log n) sort
2. **Simple overlap check** - `current.start <= last.end` determines merge
3. **Extend, don't replace** - Use `max()` to extend the merged interval
4. **Edge cases matter** - Test empty, single, all overlapping, none overlapping

This problem is a fundamental building block for many interval-related algorithms and is frequently asked in technical interviews.

---

## Pattern Reference

This problem is a classic example of the **[Greedy - Interval Merging/Scheduling](/patterns/greedy-interval-merging-scheduling)** pattern, which includes:
- Merge overlapping intervals
- Insert new intervals
- Schedule maximum non-overlapping activities
- Find minimum meeting rooms
- Compute interval intersections

For more detailed explanations and variations, see the **[Greedy - Interval Merging/Scheduling Pattern](/patterns/greedy-interval-merging-scheduling)**.
