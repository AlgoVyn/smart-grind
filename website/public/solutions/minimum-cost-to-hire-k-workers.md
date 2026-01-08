# Minimum Cost To Hire K Workers

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/)

There are n workers. You are given two integer arrays quality and wage where quality[i] is the quality of the ith worker and wage[i] is the minimum wage expectation for the ith worker.
We want to hire exactly k workers to form a paid group. To hire a group of k workers, we must pay them according to the following rules:

Every worker in the paid group must be paid at least their minimum wage expectation.
In the group, each worker's pay must be directly proportional to their quality. This means if a worker’s quality is double that of another worker in the group, then they must be paid twice as much as the other worker.

Given the integer k, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within 10-5 of the actual answer will be accepted.
 
Example 1:

Input: quality = [10,20,5], wage = [70,50,30], k = 2
Output: 105.00000
Explanation: We pay 70 to 0th worker and 35 to 2nd worker.

Example 2:

Input: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
Output: 30.66667
Explanation: We pay 4 to 0th worker, 13.33333 to 2nd and 3rd workers separately.

 
Constraints:

n == quality.length == wage.length
1 <= k <= n <= 104
1 <= quality[i], wage[i] <= 104


## Solution

```python
from typing import List
import heapq

class Solution:
    def mincostToHireWorkers(self, quality: List[int], wage: List[int], k: int) -> float:
        workers = sorted(zip(quality, wage), key=lambda x: x[1] / x[0])
        heap = []
        total_q = 0
        ans = float('inf')
        for q, w in workers:
            heapq.heappush(heap, -q)
            total_q += q
            if len(heap) > k:
                total_q += heapq.heappop(heap)
            if len(heap) == k:
                ans = min(ans, total_q * (w / q))
        return ans
```

## Explanation
To minimize the cost, we sort workers by their wage-to-quality ratio and use a heap to maintain the k workers with the lowest ratios.

1. Sort workers by increasing wage/quality ratio.

2. Use a max-heap for qualities to keep the k smallest qualities.

3. For each worker, add their quality to the heap and total quality.

4. If heap exceeds k, remove the largest quality.

5. When we have k workers, calculate the cost using the current worker's ratio (since it's the max ratio in the group) and update the minimum cost.

Time complexity: O(n log n), dominated by sorting.
Space complexity: O(n), for the heap and sorted list.
