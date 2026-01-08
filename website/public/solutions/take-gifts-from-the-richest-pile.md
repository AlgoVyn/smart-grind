# Take Gifts From The Richest Pile

## Problem Description
[Link to problem](https://leetcode.com/problems/take-gifts-from-the-richest-pile/)

You are given an integer array gifts denoting the number of gifts in various piles. Every second, you do the following:

Choose the pile with the maximum number of gifts.
If there is more than one pile with the maximum number of gifts, choose any.
Reduce the number of gifts in the pile to the floor of the square root of the original number of gifts in the pile.

Return the number of gifts remaining after k seconds.
 
Example 1:

Input: gifts = [25,64,9,4,100], k = 4
Output: 29
Explanation: 
The gifts are taken in the following way:
- In the first second, the last pile is chosen and 10 gifts are left behind.
- Then the second pile is chosen and 8 gifts are left behind.
- After that the first pile is chosen and 5 gifts are left behind.
- Finally, the last pile is chosen again and 3 gifts are left behind.
The final remaining gifts are [5,8,9,4,3], so the total number of gifts remaining is 29.

Example 2:

Input: gifts = [1,1,1,1], k = 4
Output: 4
Explanation: 
In this case, regardless which pile you choose, you have to leave behind 1 gift in each pile. 
That is, you can't take any pile with you. 
So, the total gifts remaining are 4.

 
Constraints:

1 <= gifts.length <= 103
1 <= gifts[i] <= 109
1 <= k <= 103


## Solution

```python
import heapq
from typing import List

class Solution:
    def pickGifts(self, gifts: List[int], k: int) -> int:
        heap = [-g for g in gifts]
        heapq.heapify(heap)
        for _ in range(k):
            max_g = -heapq.heappop(heap)
            new_g = int(max_g ** 0.5)
            heapq.heappush(heap, -new_g)
        return -sum(heap)
```

## Explanation
Use a max-heap (implemented as min-heap with negative values) to always access the pile with the most gifts. For each of k seconds, pop the largest, compute floor of square root, and push back. After k operations, sum the remaining gifts (negate the sum since heap has negatives).

**Time Complexity:** O(k log n), for k heap operations.

**Space Complexity:** O(n), for the heap.
