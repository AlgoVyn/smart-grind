# K Closest Points to Origin

## Problem Description

## Pattern: Heap / Sorting - K Closest Points

This problem demonstrates algorithmic problem-solving patterns.

Given an array of points where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.

The distance between two points on the X-Y plane is the Euclidean distance: `√((x1 - x2)² + (y1 - y2)²)`.

You may return the answer in any order. The answer is guaranteed to be unique (except for the order).

## Examples

### Example

**Input:** `points = [[1,3],[-2,2]], k = 1`

**Output:** `[[-2,2]]`

**Explanation:**
- The distance between `(1, 3)` and the origin is `√10`.
- The distance between `(-2, 2)` and the origin is `√8`.
- Since `√8 < √10`, `(-2, 2)` is closer to the origin.

### Example 2

**Input:** `points = [[3,3],[5,-1],[-2,4]], k = 2`

**Output:** `[[3,3],[-2,4]]`

**Explanation:** The answer `[[-2,4],[3,3]]` would also be accepted.

---

## Constraints

- `1 <= k <= points.length <= 10^4`
- `-10^4 <= xi, yi <= 10^4`

---

## Intuition

The key insight is to find the k points with the smallest distances to the origin. There are several approaches:

1. **Sort all points** by distance - O(n log n)
2. **Use a max-heap** of size k - O(n log k)
3. **Use quickselect** for average O(n) time
4. **Bucket sort** since coordinates are bounded

The optimal approach depends on the relationship between n and k:
- For small k: Heap approach is best
- For large k (close to n): Sorting is simpler
- For average case: Quickselect provides O(n) average time

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Max Heap (Priority Queue)** - O(n log k) time, best for small k
2. **Sort All Points** - O(n log n) time, simplest
3. **Quickselect** - O(n) average time, best for large datasets

---

## Approach 1: Max Heap / Priority Queue (Optimal)

Use a max-heap to keep track of the k closest points.

### Algorithm Steps

1. Create an empty max-heap
2. For each point in the array:
   - Calculate squared distance (x² + y²)
   - Push (negative distance, point) to heap (negative for max-heap simulation)
   - If heap size exceeds k, pop the farthest point
3. Return remaining points in heap

### Why Squared Distance?

Since the square root function is monotonically increasing for non-negative values, comparing squared distances gives the same ordering as comparing actual distances. This avoids expensive `sqrt` calculations.

### Why Negative Distance?

Python's `heapq` is a min-heap. To simulate a max-heap, we negate the distance values.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        """
        Find k closest points to origin using max heap.
        
        Args:
            points: List of [x, y] coordinates
            k: Number of closest points to return
            
        Returns:
            List of k closest points
        """
        # Max heap: use negative distance to simulate max-heap with min-heap
        max_heap = []
        
        for x, y in points:
            # Use squared distance to avoid sqrt
            dist = x * x + y * y
            # Push (negative_dist, point) to maintain max-heap behavior
            heapq.heappush(max_heap, (-dist, [x, y]))
            
            # Keep only k points in heap
            if len(max_heap) > k:
                heapq.heappop(max_heap)
        
        # Extract points from heap (ignore the distance)
        return [point for _, point in max_heap]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        // Max heap using greater comparator
        priority_queue<pair<int, vector<int>>> pq;
        
        for (const auto& point : points) {
            int x = point[0], y = point[1];
            int dist = x * x + y * y;
            pq.push({dist, point});
            
            if (pq.size() > k) pq.pop();
        }
        
        vector<vector<int>> result;
        while (!pq.empty()) {
            result.push_back(pq.top().second);
            pq.pop();
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // Max heap using custom comparator
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
            int distA = a[0] * a[0] + a[1] * a[1];
            int distB = b[0] * b[0] + b[1] * b[1];
            return Integer.compare(distB, distA); // Reverse for max-heap
        });
        
        for (int[] point : points) {
            pq.offer(point);
            if (pq.size() > k) pq.poll();
        }
        
        return pq.toArray(new int[k][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function(points, k) {
    // Max heap - we want to keep k closest, so we remove the farthest
    const pq = new MaxPriorityQueue();
    
    for (const point of points) {
        const [x, y] = point;
        const dist = x * x + y * y;
        pq.enqueue({ point, dist }, dist);
        
        if (pq.size() > k) pq.dequeue();
    }
    
    return pq.toArray().map(item => item.point);
};

// Fallback for environments without external priority queue library
var kClosest = function(points, k) {
    const heap = [];
    
    for (const point of points) {
        const [x, y] = point;
        const dist = x * x + y * y;
        // Use negative for max-heap simulation
        heap.push({ dist: -dist, point });
        heap.sort((a, b) => b.dist - a.dist);
        
        if (heap.length > k) heap.pop();
    }
    
    return heap.map(item => item.point);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - Each point involves heap push/pop (O(log k)) |
| **Space** | O(k) - Heap stores at most k points |

---

## Approach 2: Sort All Points

Simply sort all points by distance and take the first k.

### Algorithm Steps

1. For each point, compute squared distance
2. Sort points by squared distance
3. Return first k points

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def kClosest_sort(self, points: List[List[int]], k: int) -> List[List[int]]:
        """
        Find k closest points by sorting all points.
        
        Args:
            points: List of [x, y] coordinates
            k: Number of closest points to return
            
        Returns:
            List of k closest points
        """
        # Sort by squared distance
        points.sort(key=lambda p: p[0] * p[0] + p[1] * p[1])
        return points[:k]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        sort(points.begin(), points.end(), [](const vector<int>& a, const vector<int>& b) {
            return (a[0] * a[0] + a[1] * a[1]) < (b[0] * b[0] + b[1] * b[1]);
        });
        return vector<vector<int>>(points.begin(), points.begin() + k);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        Arrays.sort(points, (a, b) -> {
            int distA = a[0] * a[0] + a[1] * a[1];
            int distB = b[0] * b[0] + b[1] * b[1];
            return Integer.compare(distA, distB);
        });
        return Arrays.copyOfRange(points, 0, k);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function(points, k) {
    points.sort((a, b) => {
        const distA = a[0] * a[0] + a[1] * a[1];
        const distB = b[0] * b[0] + b[1] * b[1];
        return distA - distB;
    });
    return points.slice(0, k);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Sorting all n points |
| **Space** | O(1) - In-place sort, or O(n) for sorting algorithm |

---

## Approach 3: Quickselect

Use quickselect algorithm for average O(n) time.

### Algorithm Steps

1. Use quickselect to partition around a pivot
2. After partition, if pivot index equals k, we're done
3. If pivot index > k, recurse on left partition
4. Otherwise, recurse on right partition

### Code Implementation

````carousel
```python
from typing import List
import random

class Solution:
    def kClosest_quickselect(self, points: List[List[int]], k: int) -> List[List[int]]:
        """
        Find k closest points using quickselect (average O(n) time).
        """
        def dist_sq(point):
            return point[0] * point[0] + point[1] * point[1]
        
        def quickselect(left, right):
            pivot_idx = random.randint(left, right)
            pivot_dist = dist_sq(points[pivot_idx])
            
            # Move pivot to end
            points[pivot_idx], points[right] = points[right], points[pivot_idx]
            
            store_idx = left
            for i in range(left, right):
                if dist_sq(points[i]) < pivot_dist:
                    points[store_idx], points[i] = points[i], points[store_idx]
                    store_idx += 1
            
            # Move pivot to final position
            points[store_idx], points[right] = points[right], points[store_idx]
            
            return store_idx
        
        left, right = 0, len(points) - 1
        
        while True:
            pivot = quickselect(left, right)
            
            if pivot == k:
                return points[:k]
            elif pivot < k:
                left = pivot + 1
            else:
                right = pivot - 1
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        nth_element(points.begin(), points.begin() + k, points.end(),
                   [](const vector<int>& a, const vector<int>& b) {
                       return (a[0] * a[0] + a[1] * a[1]) < (b[0] * b[0] + b[1] * b[1]);
                   });
        return vector<vector<int>>(points.begin(), points.begin() + k);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // Use nth_element (not available in Java, implement manually)
        select(points, 0, points.length - 1, k - 1);
        return Arrays.copyOfRange(points, 0, k);
    }
    
    private void select(int[][] points, int left, int right, int k) {
        if (left >= right) return;
        
        int pivot = partition(points, left, right);
        
        if (pivot == k) return;
        else if (pivot < k) select(points, pivot + 1, right, k);
        else select(points, left, pivot - 1, k);
    }
    
    private int partition(int[][] points, int left, int right) {
        int[] pivot = points[right];
        int pi = left;
        
        for (int i = left; i < right; i++) {
            if (distSq(points[i]) <= distSq(pivot)) {
                swap(points, i, pi);
                pi++;
            }
        }
        swap(points, pi, right);
        return pi;
    }
    
    private int distSq(int[] p) {
        return p[0] * p[0] + p[1] * p[1];
    }
    
    private void swap(int[][] arr, int i, int j) {
        int[] temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function(points, k) {
    const distSq = p => p[0] * p[0] + p[1] * p[1];
    
    const partition = (left, right) => {
        const pivot = points[right];
        let i = left;
        
        for (let j = left; j < right; j++) {
            if (distSq(points[j]) <= distSq(pivot)) {
                [points[i], points[j]] = [points[j], points[i]];
                i++;
            }
        }
        [points[i], points[right]] = [points[right], points[i]];
        return i;
    };
    
    const select = (left, right, k) => {
        if (left >= right) return;
        
        const pivotIdx = partition(left, right);
        
        if (pivotIdx === k) return;
        else if (pivotIdx < k) select(pivotIdx + 1, right, k);
        else select(left, pivotIdx - 1, k);
    };
    
    select(0, points.length - 1, k - 1);
    return points.slice(0, k);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) average, O(n²) worst case |
| **Space** | O(1) - In-place partitioning |

---

## Comparison of Approaches

| Aspect | Max Heap | Sort | Quickselect |
|--------|-----------|------|-------------|
| **Time Complexity** | O(n log k) | O(n log n) | O(n) avg |
| **Space Complexity** | O(k) | O(1) or O(n) | O(1) |
| **Implementation** | Moderate | Simple | Complex |
| **Best For** | Small k | General | Large n |
| **Worst Case** | O(n log k) | O(n log n) | O(n²) |

**Best Approach:** For most cases, the max heap approach provides the best balance of efficiency and simplicity.

---

## Related Problems

Based on similar themes (heap, sorting, distance calculations):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Triangle Number | [Link](https://leetcode.com/problems/valid-triangle-number/) | Sort and count |
| Two Sum Less Than K | [Link](https://leetcode.com/problems/two-sum-less-than-k/) | Two pointer/sort approach |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Largest Element | [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Heap and quickselect |
| Find K Pairs with Smallest Sums | [Link](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | Multiple heap usage |
| Top K Frequent Elements | [Link](https://leetcode.com/problems/top-k-frequent-elements/) | Heap for frequency |

### Pattern Reference

For more detailed explanations, see:
- **[Heap Pattern](/patterns/heap)**
- **[Sorting Patterns](/patterns/sorting)**
- **[Quickselect](/patterns/quickselect)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### NeetCode Solutions

- [K Closest Points to Origin - NeetCode](https://www.youtube.com/watch?v=1R0_7Jq4L6Q) - Clear explanation with visual examples
- [Heap Solution Explained](https://www.youtube.com/watch?v=2H9D2bX3WvI) - Detailed walkthrough

### Other Tutorials

- [Back to Back SWE - K Closest Points](https://www.youtube.com/watch?v=1hVJ0p56d6M) - Comprehensive explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=YgF1tXK60m8) - Official problem solution
- [Sorting vs Heap Approach](https://www.youtube.com/watch?v=1V9bJ5t5M7I) - Comparison of methods

---

## Follow-up Questions

### Q1: How would you handle 3D points?

**Answer:** Extend the distance calculation to 3D: `x² + y² + z²`. The rest of the algorithm remains unchanged. You could also generalize to n-dimensional points using `sum(xi²)` for all dimensions.

---

### Q2: What if k is very large (close to n)?

**Answer:** When k is close to n, sorting might be more efficient. For k = n, simply return all points sorted by distance. The heap approach's advantage diminishes when k approaches n.

---

### Q3: How would you find the k farthest points?

**Answer:** Simply use a min-heap instead of max-heap, or negate the distance in the max-heap approach. This would keep the k farthest points in the heap.

---

### Q4: How would you handle duplicate points?

**Answer:** The algorithm naturally handles duplicates since each point is treated independently. If you need unique points, use a set to deduplicate before processing.

---

### Q5: What if coordinates can be floats instead of integers?

**Answer:** The algorithm works with floats as well. Just change the distance calculation to use floating-point arithmetic: `x*x + y*y` where x and y are floats.

---

### Q6: How would you optimize for very large n (e.g., 10^9)?

**Answer:** 
1. Use bucket sort since coordinates are bounded (-10^4 to 10^4)
2. Use counting sort based on distance ranges
3. For extremely large datasets, consider sampling or streaming algorithms

---

### Q7: How would you return points sorted by distance?

**Answer:** After getting k points from the heap, sort them by distance: `result.sort(key=lambda p: p[0]**2 + p[1]**2)`

---

### Q8: What edge cases should you test?

**Answer:**
- k = 1 (single point)
- k = n (all points)
- Points at origin [0, 0]
- Negative coordinates
- Same distance for multiple points
- Single point in array
- Empty input (handled by constraints)

---

## Common Pitfalls

### 1. Using Actual Distance Instead of Squared
**Issue**: Using sqrt() unnecessarily when comparing distances.

**Solution**: Compare squared distances (x² + y²) to avoid expensive sqrt calculations.

### 2. Using Min-Heap Instead of Max-Heap
**Issue**: Using min-heap makes it hard to track k closest points.

**Solution**: Use max-heap (or negate distances in Python) to keep k closest points.

### 3. Not Handling k Equal to n
**Issue**: Edge case when k equals the number of points.

**Solution**: Algorithm naturally handles this, but test to verify.

### 4. Modifying Original Array
**Issue**: Quickselect modifies the array in place.

**Solution**: Make a copy if original array must be preserved.

### 5. Forgetting Negative Distances in Python
**Issue**: Python's heapq is a min-heap, but we need max-heap behavior.

**Solution**: Push (-distance, point) to simulate max-heap with min-heap.

---

## Summary

The **K Closest Points to Origin** problem demonstrates several important algorithmic techniques:

- **Max heap approach**: O(n log k) - optimal for small k
- **Sorting approach**: O(n log n) - simplest implementation
- **Quickselect**: O(n) average - best theoretical complexity

Key insights:
1. Use squared distance to avoid sqrt
2. Max heap keeps k closest efficiently
3. Trade-off between time and space complexity

This problem is excellent for understanding heap usage, sorting, and algorithmic optimization.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/k-closest-points-to-origin/discuss/) - Community solutions
- [Heap Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/heap-data-structure/) - Detailed explanation
- [Quickselect Algorithm](/patterns/quickselect) - Comprehensive guide
