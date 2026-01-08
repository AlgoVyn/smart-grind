# Find K Pairs With Smallest Sums

## Problem Description
[Link to problem](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)

You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k.
Define a pair (u, v) which consists of one element from the first array and one element from the second array.
Return the k pairs (u1, v1), (u2, v2), ..., (uk, vk) with the smallest sums.
 
Example 1:

Input: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
Output: [[1,2],[1,4],[1,6]]
Explanation: The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]

Example 2:

Input: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
Output: [[1,1],[1,1]]
Explanation: The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]

 
Constraints:

1 <= nums1.length, nums2.length <= 105
-109 <= nums1[i], nums2[i] <= 109
nums1 and nums2 both are sorted in non-decreasing order.
1 <= k <= 104
k <= nums1.length * nums2.length


## Solution

```python
from typing import List
import heapq

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        if not nums1 or not nums2:
            return []
        
        heap = []
        heapq.heappush(heap, (nums1[0] + nums2[0], 0, 0))
        visited = set()
        visited.add((0, 0))
        result = []
        
        while len(result) < k and heap:
            _, i, j = heapq.heappop(heap)
            result.append([nums1[i], nums2[j]])
            
            if i + 1 < len(nums1) and (i + 1, j) not in visited:
                heapq.heappush(heap, (nums1[i + 1] + nums2[j], i + 1, j))
                visited.add((i + 1, j))
            
            if j + 1 < len(nums2) and (i, j + 1) not in visited:
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
                visited.add((i, j + 1))
        
        return result
```

## Explanation
This problem requires finding the k pairs with the smallest sums from two sorted arrays.

1. **Min-heap approach:**
   - Use a priority queue (heap) to always get the smallest sum pair.
   - Start with the pair (0,0), push to heap with sum, i, j.

2. **Generate next candidates:**
   - For each popped pair (i,j), add the next possible pairs: (i+1,j) and (i,j+1), if not visited.
   - Use a set to track visited indices to avoid duplicates.

3. **Build result:**
   - Pop k times (or until heap empty), add to result.

4. **Efficiency:**
   - Heap operations ensure we always expand from the current smallest sum.

**Time Complexity:** O(k log k), as heap operations are log k and we do up to k pops.

**Space Complexity:** O(k) for heap and visited set.
