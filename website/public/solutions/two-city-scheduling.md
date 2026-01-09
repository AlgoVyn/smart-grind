# Two City Scheduling

## Problem Description

A company is planning to interview `2n` people. Given the array `costs` where `costs[i] = [aCost_i, bCost_i]`, the cost of flying the `i`-th person to city A is `aCost_i`, and the cost of flying the `i`-th person to city B is `bCost_i`.

Return the minimum cost to fly every person to a city such that exactly `n` people arrive in each city.

**Example 1:**

Input: `costs = [[10,20],[30,200],[400,50],[30,20]]`
Output: `110`

Explanation:
The first person goes to city A for a cost of 10.
The second person goes to city A for a cost of 30.
The third person goes to city B for a cost of 50.
The fourth person goes to city B for a cost of 20.

The total minimum cost is `10 + 30 + 50 + 20 = 110` to have half the people interviewing in each city.

**Example 2:**

Input: `costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]`
Output: `1859`

**Example 3:**

Input: `costs = [[515,563],[451,713],[537,709],[343,819],[855,779],[457,60],[650,359],[631,42]]`
Output: `3086`

## Constraints

- `2 * n == costs.length`
- `2 <= costs.length <= 100`
- `costs.length` is even.
- `1 <= aCost_i, bCost_i <= 1000`

## Solution

```python
from typing import List

class Solution:
    def twoCitySchedCost(self, costs: List[List[int]]) -> int:
        costs.sort(key=lambda x: x[0] - x[1])
        total = 0
        n = len(costs) // 2
        for i in range(n):
            total += costs[i][0]
        for i in range(n, len(costs)):
            total += costs[i][1]
        return total
```

## Explanation

To minimize the total cost of sending exactly `n` people to city A and `n` to city B, we sort the costs based on the difference in costs for each person.

### Step-by-Step Approach:

1. **Sort by cost difference**: Sort the `costs` array using the key `x[0] - x[1]` (cost to A minus cost to B). This orders the people by how much cheaper it is to send them to A compared to B.

2. **Assign to cities**: After sorting, send the first `n` people to city A (cheaper for them) and the remaining `n` to city B.

3. **Calculate total cost**: Sum the costs: for the first `n`, add their cost to A; for the rest, add their cost to B.

### Time Complexity:

- O(n log n), where n is the number of people, due to the sorting step.

### Space Complexity:

- O(1) additional space, as the sorting is done in place.
