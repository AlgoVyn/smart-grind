# Minimum Number Of Days To Make M Bouquets

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)

You are given an integer array bloomDay, an integer m and an integer k.
You want to make m bouquets. To make a bouquet, you need to use k adjacent flowers from the garden.
The garden consists of n flowers, the ith flower will bloom in the bloomDay[i] and then can be used in exactly one bouquet.
Return the minimum number of days you need to wait to be able to make m bouquets from the garden. If it is impossible to make m bouquets return -1.
 
Example 1:

Input: bloomDay = [1,10,3,10,2], m = 3, k = 1
Output: 3
Explanation: Let us see what happened in the first three days. x means flower bloomed and _ means flower did not bloom in the garden.
We need 3 bouquets each should contain 1 flower.
After day 1: [x, _, _, _, _]   // we can only make one bouquet.
After day 2: [x, _, _, _, x]   // we can only make two bouquets.
After day 3: [x, _, x, _, x]   // we can make 3 bouquets. The answer is 3.

Example 2:

Input: bloomDay = [1,10,3,10,2], m = 3, k = 2
Output: -1
Explanation: We need 3 bouquets each has 2 flowers, that means we need 6 flowers. We only have 5 flowers so it is impossible to get the needed bouquets and we return -1.

Example 3:

Input: bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3
Output: 12
Explanation: We need 2 bouquets each should have 3 flowers.
Here is the garden after the 7 and 12 days:
After day 7: [x, x, x, x, _, x, x]
We can make one bouquet of the first three flowers that bloomed. We cannot make another bouquet from the last three flowers that bloomed because they are not adjacent.
After day 12: [x, x, x, x, x, x, x]
It is obvious that we can make two bouquets in different ways.

 
Constraints:

bloomDay.length == n
1 <= n <= 105
1 <= bloomDay[i] <= 109
1 <= m <= 106
1 <= k <= n


## Solution

```python
from typing import List

class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        if m * k > len(bloomDay):
            return -1
        
        def can_make(days: int) -> bool:
            bouquets = 0
            streak = 0
            for day in bloomDay:
                if day <= days:
                    streak += 1
                    if streak == k:
                        bouquets += 1
                        streak = 0
                else:
                    streak = 0
            return bouquets >= m
        
        left, right = min(bloomDay), max(bloomDay)
        while left < right:
            mid = (left + right) // 2
            if can_make(mid):
                right = mid
            else:
                left = mid + 1
        return left
```

## Explanation
This problem uses binary search to find the minimum number of days to make m bouquets, each requiring k adjacent bloomed flowers.

1. If m * k > number of flowers, return -1.

2. Binary search on the days, from the minimum to maximum bloom day.

3. For a candidate days, check if we can form at least m bouquets by counting groups of k consecutive bloomed flowers.

4. Iterate through the garden, maintain a streak of consecutive bloomed flowers, increment bouquets when streak reaches k.

5. If bouquets >= m, it's possible, so search for fewer days.

6. Otherwise, need more days.

7. The left bound is the answer.

Time complexity: O(n log D), where n is the number of flowers and D is the range of bloomDay values.
Space complexity: O(1), using only constant extra space.
