# Minimum Penalty For A Shop

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-penalty-for-a-shop/)

You are given the customer visit log of a shop represented by a 0-indexed string customers consisting only of characters 'N' and 'Y':

if the ith character is 'Y', it means that customers come at the ith hour
whereas 'N' indicates that no customers come at the ith hour.

If the shop closes at the jth hour (0 <= j <= n), the penalty is calculated as follows:

For every hour when the shop is open and no customers come, the penalty increases by 1.
For every hour when the shop is closed and customers come, the penalty increases by 1.

Return the earliest hour at which the shop must be closed to incur a minimum penalty.
Note that if a shop closes at the jth hour, it means the shop is closed at the hour j.
 
Example 1:

Input: customers = "YYNY"
Output: 2
Explanation: 
- Closing the shop at the 0th hour incurs in 1+1+0+1 = 3 penalty.
- Closing the shop at the 1st hour incurs in 0+1+0+1 = 2 penalty.
- Closing the shop at the 2nd hour incurs in 0+0+0+1 = 1 penalty.
- Closing the shop at the 3rd hour incurs in 0+0+1+1 = 2 penalty.
- Closing the shop at the 4th hour incurs in 0+0+1+0 = 1 penalty.
Closing the shop at 2nd or 4th hour gives a minimum penalty. Since 2 is earlier, the optimal closing time is 2.

Example 2:

Input: customers = "NNNNN"
Output: 0
Explanation: It is best to close the shop at the 0th hour as no customers arrive.
Example 3:

Input: customers = "YYYY"
Output: 4
Explanation: It is best to close the shop at the 4th hour as customers arrive at each hour.

 
Constraints:

1 <= customers.length <= 105
customers consists only of characters 'Y' and 'N'.


## Solution

```python
class Solution:
    def bestClosingTime(self, customers: str) -> int:
        n = len(customers)
        total_y = customers.count('Y')
        min_penalty = float('inf')
        best_hour = 0
        current_n = 0
        current_y_after = total_y
        for j in range(n + 1):
            penalty = current_n + current_y_after
            if penalty < min_penalty:
                min_penalty = penalty
                best_hour = j
            if j < n:
                if customers[j] == 'N':
                    current_n += 1
                else:
                    current_y_after -= 1
        return best_hour
```

## Explanation
This problem requires finding the earliest hour to close the shop to minimize the penalty based on customer visits.

The penalty for closing at hour j is the number of 'N's (no customers) in the open hours (0 to j-1) plus the number of 'Y's (customers) in the closed hours (j to n-1).

Precompute two arrays:
- prefix_N[j]: number of 'N's from 0 to j-1.
- suffix_Y[j]: number of 'Y's from j to n-1.

For each possible j from 0 to n, calculate penalty = prefix_N[j] + suffix_Y[j], track the minimum penalty and the smallest j achieving it.

**Time Complexity:** O(n), where n is the length of customers, for building prefix and suffix arrays and iterating.
**Space Complexity:** O(n), for the prefix and suffix arrays.
