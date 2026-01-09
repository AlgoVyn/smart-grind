# K Closest Points to Origin

## Problem Description

Given an array of points where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.

The distance between two points on the X-Y plane is the Euclidean distance: `√((x1 - x2)² + (y1 - y2)²)`.

You may return the answer in any order. The answer is guaranteed to be unique (except for the order).

### Example 1

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

## Solution

```python
import heapq
from typing import List

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        heap = []
        for x, y in points:
            dist = x * x + y * y
            heapq.heappush(heap, (-dist, [x, y]))
            if len(heap) > k:
                heapq.heappop(heap)
        return [p for _, p in heap]
```

---

## Explanation

This problem uses a max heap to keep track of the `k` closest points.

### Algorithm

1. Iterate through each point in the array.
2. Calculate the squared Euclidean distance to avoid floating-point operations.
3. Push the point (with negative distance) onto a max heap.
4. If the heap size exceeds `k`, pop the element with the largest distance (the farthest point).
5. Return all remaining points in the heap.

### Why Squared Distance?

Since the square root function is monotonically increasing, comparing squared distances gives the same result as comparing actual distances. This avoids expensive `sqrt` calculations.

### Why Negative Distance?

Python's `heapq` module implements a min-heap. To simulate a max-heap, we negate the distance values.

---

## Complexity Analysis

- **Time Complexity:** O(n log k) — each of the `n` points involves a heap push (and possibly a pop), both O(log k).
- **Space Complexity:** O(k) — the heap stores at most `k` points.
