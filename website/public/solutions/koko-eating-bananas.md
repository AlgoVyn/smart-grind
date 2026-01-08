# Koko Eating Bananas

## Problem Description
[Link to problem](https://leetcode.com/problems/koko-eating-bananas/)

Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.
Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.
Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.
Return the minimum integer k such that she can eat all the bananas within h hours.
 
Example 1:

Input: piles = [3,6,7,11], h = 8
Output: 4

Example 2:

Input: piles = [30,11,23,4,20], h = 5
Output: 30

Example 3:

Input: piles = [30,11,23,4,20], h = 6
Output: 23

 
Constraints:

1 <= piles.length <= 104
piles.length <= h <= 109
1 <= piles[i] <= 109


## Solution

```python
import math
from typing import List

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        left, right = 1, max(piles)
        while left < right:
            mid = (left + right) // 2
            time = sum(math.ceil(p / mid) for p in piles)
            if time <= h:
                right = mid
            else:
                left = mid + 1
        return left
```

## Explanation
We use binary search to find the minimum eating speed k. The possible range for k is from 1 to the maximum number of bananas in any pile.

For each mid value of k, we calculate the total hours needed by summing the ceiling of each pile divided by k. If the total hours is less than or equal to h, we can try a smaller k by setting right to mid. Otherwise, we need a larger k, so set left to mid + 1.

The loop continues until left equals right, which is the minimum k.

Time complexity: O(n log M), where n is the number of piles and M is the maximum pile size, due to binary search and summing over piles.
Space complexity: O(1), as we use constant extra space.
