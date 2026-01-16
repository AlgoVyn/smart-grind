# Merge Intervals (LeetCode 56)

## Problem Description

Given an array of intervals where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

In other words, after merging, every overlapping pair of intervals should be combined into a single interval that represents the union of both intervals. The merged intervals should be returned in sorted order by their start time.

---

## Examples

**Example 1:**

**Input:**
```python
intervals = [[1,3],[2,6],[8,10],[15,18]]
```

**Output:**
```python
[[1,6],[8,10],[15,18]]
```

**Explanation:** Since intervals [1,3] and [2,6] overlap, merge them into [1,6]. The other intervals [8,10] and [15,18] don't overlap with anyone, so they remain unchanged.

---

**Example 2:**

**Input:**
```python
intervals = [[1,4],[4,5]]
```

**Output:**
```python
[[1,5]]
```

**Explanation:** Intervals [1,4] and [4,5] overlap at point 4. Since the end of one interval equals the start of the next, they should be merged. Note that we use `<=` for overlap checking to include this case.

---

**Example 3:**

**Input:**
```python
intervals = [[1,4],[5,6],[7,8],[9,10]]
```

**Output:**
```python
[[1,4],[5,6],[7,8],[9,10]]
```

**Explanation:** No intervals overlap, so the output is the same as the input.

---

## Constraints

- `1 <= intervals.length <= 10^4`
- `0 <= starti <= endi <= 10^4`
- All intervals are valid (start <= end)
- The intervals can be in any order in the input array

---

## Intuition

The key insight is that **if we sort the intervals by their start time, any overlapping intervals will be adjacent to each other**. This allows us to process them in a single pass.

Think of intervals as segments on a line:
- `[1,3]` -----
- `[2,6]`   -------
- `[8,10]`       -----
- `[15,18]`             -----

After sorting by start time:
- `[1,3]` -----
- `[2,6]`   -------
- `[8,10]`       -----
- `[15,18]`             -----

When we process `[1,3]` first, then see `[2,6]`, we notice they overlap (2 <= 3). We merge them into `[1,6]`. Next `[8,10]` doesn't overlap with `[1,6]` (8 > 6), so we add it as a new interval. And so on.

---

## Approach 1: Sorting + Linear Merge (Optimal)

### Algorithm

1. **Sort** the intervals by their start time
2. **Iterate** through the sorted intervals
3. **Merge** the current interval with the previous one if they overlap
4. Otherwise, **add** the current interval to the result

### Detailed Steps

1. If the input list is empty, return an empty list
2. Sort intervals by `intervals[i][0]` (the start value)
3. Initialize an empty list `merged` for the result
4. Add the first interval to `merged`
5. For each interval in the sorted list (starting from index 1):
   - Get the last interval in `merged` (call it `last`)
   - If the current interval's start is less than or equal to `last`'s end:
     - They overlap, so update `last`'s end to `max(last[1], current[1])`
   - Else:
     - No overlap, add the current interval to `merged`
6. Return `merged`

### Python Implementation

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        """
        Merge overlapping intervals.
        
        Time Complexity: O(n log n) - dominated by sorting
        Space Complexity: O(n) - for storing merged intervals
        
        Args:
            intervals: List of [start, end] intervals
            
        Returns:
            List of merged non-overlapping intervals
        """
        if not intervals:
            return []
        
        # Step 1: Sort intervals by start time
        intervals.sort(key=lambda x: x[0])
        
        # Step 2: Initialize merged list with first interval
        merged = [intervals[0]]
        
        # Step 3: Iterate through remaining intervals
        for current in intervals[1:]:
            last = merged[-1]
            
            # Check if current interval overlaps with last merged interval
            if current[0] <= last[1]:
                # Merge by extending the end time if needed
                last[1] = max(last[1], current[1])
            else:
                # No overlap, add as new interval
                merged.append(current)
        
        return merged
```

### Alternative Python Implementation (Using List Comprehension)

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        
        # Sort and merge in one pass using a more functional approach
        intervals.sort(key=lambda x: x[0])
        merged = []
        
        for interval in intervals:
            if not merged or interval[0] > merged[-1][1]:
                # No overlap with last merged interval
                merged.append(interval)
            else:
                # Overlap exists, merge by updating end time
                merged[-1][1] = max(merged[-1][1], interval[1])
        
        return merged
```

---

## Approach 2: Using Stack (Alternative)

While the first approach is optimal and most commonly used, here's an alternative approach using a stack for understanding purposes:

### Algorithm

1. Sort the intervals by start time
2. Use a stack to keep track of merged intervals
3. Push intervals onto the stack and merge as needed

### Python Implementation

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        
        # Sort by start time
        intervals.sort(key=lambda x: x[0])
        
        # Use stack to merge
        stack = []
        
        for interval in intervals:
            if not stack:
                stack.append(interval)
            else:
                last = stack[-1]
                # Check if current interval overlaps with stack top
                if interval[0] <= last[1]:
                    # Merge: update the end time
                    last[1] = max(last[1], interval[1])
                else:
                    stack.append(interval)
        
        return stack
```

### Time and Space Complexity

- **Time Complexity**: O(n log n) - dominated by sorting
- **Space Complexity**: O(n) - for the stack

---

## Approach 3: In-Place Modification (Space Optimized)

If we can modify the original array, we can optimize space:

### Algorithm

1. Sort the intervals in-place
2. Use two pointers to merge without extra space for result

### Python Implementation

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        
        # Sort in-place
        intervals.sort(key=lambda x: x[0])
        
        # Use write pointer for in-place merging
        write_idx = 0
        
        for i in range(1, len(intervals)):
            if intervals[write_idx][1] >= intervals[i][0]:
                # Overlap: merge by extending end time
                intervals[write_idx][1] = max(
                    intervals[write_idx][1], 
                    intervals[i][1]
                )
            else:
                # No overlap: move to next position
                write_idx += 1
                intervals[write_idx] = intervals[i]
        
        # Return only the merged portion
        return intervals[:write_idx + 1]
```

### Time and Space Complexity

- **Time Complexity**: O(n log n) - dominated by sorting
- **Space Complexity**: O(1) - in-place modification (assuming sort is in-place)

---

## Approach 4: Connected Components (Graph-Based)

Another interesting perspective is to view the problem as finding **connected components** in an interval graph. Two intervals are connected if they overlap (directly or transitively through other intervals). All intervals in a connected component should be merged into a single interval.

### Algorithm

1. **Build an interval graph**: Treat each interval as a node. Add an edge between two intervals if they overlap.
2. **Find connected components**: Use BFS or DFS to find all connected components.
3. **Merge intervals in each component**: For each connected component, find the minimum start and maximum end to create the merged interval.

### Detailed Steps

1. If the input list is empty, return an empty list
2. Create an adjacency list representation of the interval graph
3. Use Union-Find (Disjoint Set Union - DSU) to group overlapping intervals into the same set
4. For each set, compute the minimum start and maximum end
5. Return the merged intervals sorted by start time

### Python Implementation (Using Union-Find)

```python
from typing import List

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        """
        Merge overlapping intervals using Union-Find (Connected Components).
        
        Time Complexity: O(n log n) - dominated by sorting
        Space Complexity: O(n) - for Union-Find data structure
        
        Args:
            intervals: List of [start, end] intervals
            
        Returns:
            List of merged non-overlapping intervals
        """
        if not intervals:
            return []
        
        n = len(intervals)
        
        # Create Union-Find structure
        uf = UnionFind(n)
        
        # Build graph and union overlapping intervals
        for i in range(n):
            for j in range(i + 1, n):
                # Check if intervals i and j overlap
                if intervals[i][0] <= intervals[j][1] and intervals[j][0] <= intervals[i][1]:
                    uf.union(i, j)
        
        # Group intervals by their root component
        components = {}
        for i in range(n):
            root = uf.find(i)
            if root not in components:
                components[root] = [float('inf'), float('-inf')]
            # Update min start and max end
            components[root][0] = min(components[root][0], intervals[i][0])
            components[root][1] = max(components[root][1], intervals[i][1])
        
        # Convert to list of intervals and sort
        merged = [[start, end] for start, end in components.values()]
        merged.sort(key=lambda x: x[0])
        
        return merged
```

### Python Implementation (Using BFS/DFS)

```python
from typing import List, Set
from collections import defaultdict, deque

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        """
        Merge overlapping intervals using BFS (Connected Components).
        
        Time Complexity: O(n^2) for building graph + O(n log n) for sorting
        Space Complexity: O(n^2) in worst case for adjacency list
        """
        if not intervals:
            return []
        
        n = len(intervals)
        
        # Build adjacency list
        graph = defaultdict(list)
        for i in range(n):
            for j in range(i + 1, n):
                # Check if intervals overlap
                if intervals[i][0] <= intervals[j][1] and intervals[j][0] <= intervals[i][1]:
                    graph[i].append(j)
                    graph[j].append(i)
        
        visited = set()
        merged = []
        
        for i in range(n):
            if i in visited:
                continue
            
            # BFS to find all intervals in this connected component
            queue = deque([i])
            visited.add(i)
            component_start = float('inf')
            component_end = float('-inf')
            
            while queue:
                node = queue.popleft()
                interval = intervals[node]
                component_start = min(component_start, interval[0])
                component_end = max(component_end, interval[1])
                
                for neighbor in graph[node]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            merged.append([component_start, component_end])
        
        # Sort merged intervals by start time
        merged.sort(key=lambda x: x[0])
        
        return merged
```

### Union-Find with Path Compression and Union by Rank

```python
from typing import List

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        """Find with path compression"""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """Union by rank, returns True if merged"""
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        
        # Sort first to enable efficient overlap checking
        sorted_idx = sorted(range(len(intervals)), key=lambda i: intervals[i][0])
        
        uf = UnionFind(len(intervals))
        
        # Union intervals that overlap
        for i in range(len(intervals)):
            for j in range(i + 1, len(intervals)):
                idx_i = sorted_idx[i]
                idx_j = sorted_idx[j]
                
                # If current interval's start > previous interval's end, no more overlaps
                if intervals[idx_j][0] > intervals[idx_i][1]:
                    break
                
                # Check overlap and union
                if intervals[idx_j][0] <= intervals[idx_i][1]:
                    uf.union(idx_i, idx_j)
        
        # Collect merged intervals from each component
        component_bounds = {}
        for i in range(len(intervals)):
            root = uf.find(i)
            if root not in component_bounds:
                component_bounds[root] = [intervals[i][0], intervals[i][1]]
            else:
                component_bounds[root][0] = min(component_bounds[root][0], intervals[i][0])
                component_bounds[root][1] = max(component_bounds[root][1], intervals[i][1])
        
        # Convert to list and sort
        result = [bounds for bounds in component_bounds.values()]
        result.sort(key=lambda x: x[0])
        
        return result
```

### Time and Space Complexity

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Union-Find | O(n log n) | O(n) | When you need to track which intervals were merged together |
| BFS/DFS | O(n² + n log n) | O(n²) | When you need to explore the graph structure explicitly |
| Optimized Union-Find | O(n log n) | O(n) | Best balance when sorting is already done |

### When to Use Connected Components Approach

1. **Tracking merged groups**: When you need to know which original intervals were merged together
2. **Additional queries**: If you need to answer questions like "which intervals are in the same merged group?"
3. **Learning purposes**: To understand the graph theory perspective of the problem
4. **Complex extensions**: When the problem extends to finding other properties of connected components

### Visual Example: Connected Components

**Input:** `[[1,3], [2,6], [8,10], [15,18]]`

**Graph Representation:**
```
[1,3] ─── [2,6]      [8,10]      [15,18]
   │          │          │            │
   └──────────┘          └────────────┘
   
Connected Components:
- Component 1: {[1,3], [2,6]} → Merge to [1,6]
- Component 2: {[8,10]} → Merge to [8,10]
- Component 3: {[15,18]} → Merge to [15,18]

Result: [[1,6], [8,10], [15,18]]
```

### Extension: Tracking Which Intervals Were Merged

```python
from typing import List, Set

class UnionFindWithTracking:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.members = {i: {i} for i in range(n)}  # Track members of each set
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        # Merge members
        self.members[px] = self.members[px] | self.members[py]
        del self.members[py]

# Usage example
def merge_with_tracking(intervals: List[List[int]]) -> List[List[int]]:
    if not intervals:
        return []
    
    n = len(intervals)
    uf = UnionFindWithTracking(n)
    
    for i in range(n):
        for j in range(i + 1, n):
            if intervals[i][0] <= intervals[j][1] and intervals[j][0] <= intervals[i][1]:
                uf.union(i, j)
    
    result = []
    for root, members in uf.members.items():
        merged_start = min(intervals[i][0] for i in members)
        merged_end = max(intervals[i][1] for i in members)
        original_indices = sorted(members)  # Which original intervals were merged
        result.append({
            'interval': [merged_start, merged_end],
            'original_indices': original_indices
        })
    
    result.sort(key=lambda x: x['interval'][0])
    return result

# Example usage:
# intervals = [[1,3], [2,6], [8,10]]
# result = merge_with_tracking(intervals)
# Output: [{'interval': [1, 6], 'original_indices': [0, 1]}, 
#          {'interval': [8, 10], 'original_indices': [2]}]
```

---

## Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Advantages | Disadvantages |
|----------|-----------------|------------------|------------|---------------|
| Sorting + Linear Merge | O(n log n) | O(n) | Simple, efficient, most common | Cannot track which intervals merged |
| Using Stack | O(n log n) | O(n) | Alternative perspective | Same complexity as linear merge |
| In-Place | O(n log n) | O(1) | Space efficient | Modifies input array |
| Union-Find | O(n log n) | O(n) | Tracks merged groups | Slightly more complex |
| BFS/DFS | O(n² + n log n) | O(n²) | Explicit graph structure | High space for dense graphs |

---

## Edge Cases to Consider

1. **Empty Input**: `intervals = []` → Return `[]`
2. **Single Interval**: `intervals = [[1, 5]]` → Return `[[1, 5]]`
3. **All Overlapping**: `intervals = [[1, 5], [2, 6], [3, 7]]` → Return `[[1, 7]]`
4. **No Overlapping**: `intervals = [[1, 2], [3, 4], [5, 6]]` → Return `[[1, 2], [3, 4], [5, 6]]`
5. **Touching Intervals**: `intervals = [[1, 3], [3, 5]]` → Return `[[1, 5]]` (note: 3 is included in both)
6. **Duplicate Intervals**: `intervals = [[1, 3], [1, 3], [2, 2]]` → Return `[[1, 3]]`
7. **Reverse Order**: `intervals = [[8, 10], [1, 3], [15, 18], [2, 6]]` → Return `[[1, 6], [8, 10], [15, 18]]`

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [Insert Interval](https://leetcode.com/problems/insert-interval/) | Medium | Insert a new interval into a sorted list of non-overlapping intervals |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | Medium | Find minimum number of meeting rooms needed |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Medium | Remove minimum intervals to make the rest non-overlapping |
| [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) | Easy | Merge two sorted arrays in-place |
| [Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/) | Medium | Find all intersections between two interval lists |
| [Employee Free Time](https://leetcode.com/problems/employee-free-time/) | Hard | Find busy employees' common free time |

---

## Video Tutorial Links

1. [NeetCode - Merge Intervals (LeetCode 56)](https://www.youtube.com/watch?v=44H3cEC2fFM)
2. [Back to Back SWE - Merge Intervals](https://www.youtube.com/watch?v=qKczC70fWws)
3. [Abdul Bari - Merge Overlapping Intervals](https://www.youtube.com/watch?v=2C8aS_3jJ8s)
4. [Eric Programming - Merge Intervals Explained](https://www.youtube.com/watch?v=48g29A7IL98)
5. [Fraz - Merge Intervals - Complete Explanation](https://www.youtube.com/watch?v=omB_OKerW3M)

---

## Follow-up Questions

1. **What if the input intervals are not given in any particular order?**
   - Answer: We need to sort them first by start time. This is why sorting is the first step in our solution.

2. **How would you handle the case where intervals touch at a single point (e.g., [1,3] and [3,5])?**
   - Answer: Use `<=` for the overlap check (current[0] <= last[1]) to include touching intervals as overlapping. This ensures they get merged into [1,5].

3. **Can you merge intervals in O(n) time without sorting?**
   - Answer: No, because without sorting, overlapping intervals may not be adjacent, and we would need to check every pair which takes O(n²). Sorting is necessary and gives us O(n log n).

4. **How would you modify the solution to return the union of intervals as a list of disjoint segments?**
   - Answer: The current solution already does this. Each interval in the result represents a disjoint segment of the union.

5. **How would you count the total length of all merged intervals?**
   - Answer: After merging, sum up `(end - start)` for each interval in the merged result.

6. **What if intervals can be negative or very large?**
   - Answer: The algorithm doesn't depend on specific values, only on their relative ordering. It works with any valid numeric values.

7. **How would you detect if there are any overlapping intervals in O(n log n)?**
   - Answer: Sort by start time and check if any interval's start is <= previous interval's end.

8. **How would you handle this problem if the intervals were given as two separate arrays (one for starts, one for ends)?**
   - Answer: Create pairs from the arrays, sort by starts, then apply the same merging logic.

9. **What if you need to merge intervals in real-time as they arrive (streaming)?**
   - Answer: Use a data structure like an ordered map or balanced BST to maintain intervals and merge as new ones arrive. This can be done in O(log n) per insertion.

10. **How would you modify the solution to also return the number of original intervals merged into each result interval?**
    - Answer: Store a count in each interval: [start, end, count]. Initialize count=1, increment when merging.

---

## Summary

The Merge Intervals problem is a classic interval manipulation problem. The key insight is that **sorting by start time makes overlapping intervals adjacent**, allowing us to merge them in a single pass. The algorithm has:

- **Time Complexity**: O(n log n) due to sorting
- **Space Complexity**: O(n) for the result (or O(1) with in-place modification)

This pattern is widely applicable to many interval-related problems and forms the foundation for more complex interval scheduling challenges. The Connected Components approach using Union-Find is particularly useful when you need to track which original intervals were merged together.

