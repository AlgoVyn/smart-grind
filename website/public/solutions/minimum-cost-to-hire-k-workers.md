# Minimum Cost To Hire K Workers

## Problem Description

There are `n` workers. You are given two integer arrays `quality` and `wage` where `quality[i]` is the quality of the `i-th` worker and `wage[i]` is the minimum wage expectation for the `i-th` worker.

We want to hire exactly `k` workers to form a paid group. To hire a group of `k` workers, we must pay them according to the following rules:

1. Every worker in the paid group must be paid at least their minimum wage expectation.
2. In the group, each worker's pay must be directly proportional to their quality. This means if a worker's quality is double that of another worker in the group, then they must be paid twice as much as the other worker.

Given the integer `k`, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within `10^-5` of the actual answer will be accepted.

---

## Examples

### Example 1

**Input:**
```python
quality = [10, 20, 5], wage = [70, 50, 30], k = 2
```

**Output:**
```python
105.00000
```

**Explanation:**
We pay 70 to the 0th worker and 35 to the 2nd worker.

### Example 2

**Input:**
```python
quality = [3, 1, 10, 10, 1], wage = [4, 8, 2, 2, 7], k = 3
```

**Output:**
```python
30.66667
```

**Explanation:**
We pay 4 to the 0th worker, 13.33333 to the 2nd and 3rd workers separately.

---

## Constraints

- `n == quality.length == wage.length`
- `1 <= k <= n <= 10^4`
- `1 <= quality[i], wage[i] <= 10^4`

---

## Solution

```python
from typing import List
import heapq

class Solution:
    def mincostToHireWorkers(self, quality: List[int], wage: List[int], k: int) -> float:
        """
        Find the minimum cost to hire k workers.
        
        Strategy: Sort workers by wage/quality ratio and use a max-heap
        to maintain the k workers with the lowest total quality.
        """
        # Sort workers by their wage-to-quality ratio
        workers = sorted(zip(quality, wage), key=lambda x: x[1] / x[0])
        
        heap = []  # Max-heap (negatives) for qualities
        total_q = 0
        ans = float('inf')
        
        for q, w in workers:
            # Add current worker's quality to heap
            heapq.heappush(heap, -q)
            total_q += q
            
            # Keep only k smallest qualities
            if len(heap) > k:
                total_q += heapq.heappop(heap)  # Remove largest quality
            
            # When we have k workers, calculate cost
            if len(heap) == k:
                # Cost = total quality * current ratio (max ratio in group)
                ans = min(ans, total_q * (w / q))
        
        return ans
```

---

## Explanation

This problem requires finding the minimum cost to hire exactly k workers while satisfying the wage requirements.

1. **Sort by ratio**: Sort workers by their wage/quality ratio (the minimum pay per unit quality).

2. **Use a max-heap**: Maintain a heap of qualities to keep track of the k workers with the smallest total quality.

3. **Iterate through sorted workers**: For each worker (in order of increasing ratio):
   - Add their quality to the heap and total quality
   - If heap exceeds k, remove the largest quality
   - When we have k workers, calculate the cost using the current worker's ratio (since it's the maximum ratio in the group)

4. **Return minimum cost**: Track the minimum cost across all valid groups.

---

## Complexity Analysis

- **Time Complexity:** O(n log n), dominated by sorting
- **Space Complexity:** O(n), for the heap and sorted list
