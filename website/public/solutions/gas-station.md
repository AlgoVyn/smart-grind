# Gas Station

## Problem Description
There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].
You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.
Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.
## Examples

**Example 1:**

**Input:**
```python
gas = [1,2,3,4,5], cost = [3,4,5,1,2]
```

**Output:**
```python
3
```

**Explanation:**
Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.

**Example 2:**

**Input:**
```python
gas = [2,3,4], cost = [3,4,3]
```

**Output:**
```python
-1
```

**Explanation:**
You can't start at station 0 or 1, as there is not enough gas to travel to the next station.
Let's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 0. Your tank = 4 - 3 + 2 = 3
Travel to station 1. Your tank = 3 - 3 + 3 = 3
You cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.
Therefore, you can't travel around the circuit once no matter where you start.

## Constraints

- n == gas.length == cost.length
- 1 <= n <= 10^5
- 0 <= gas[i], cost[i] <= 10^4
- The input is generated such that the answer is unique.
## Solution

```python
from typing import List

class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        total = 0
        start = 0
        for i in range(len(gas)):
            total += gas[i] - cost[i]
            if total < 0:
                total = 0
                start = i + 1
        return start
```

## Explanation
This problem requires finding the starting gas station index to complete a circuit without running out of gas, or -1 if impossible.

First, check if the total gas is less than the total cost; if so, it's impossible.

Use a greedy approach: iterate through the stations, maintaining a running total of gas minus cost. If the total becomes negative, reset it and set the potential start to the next station.

This works because the minimum cumulative sum indicates the worst starting point, so starting after it ensures completion.

## Time Complexity
**O(n)**, where n is the number of stations, for one pass and sum.

## Space Complexity
**O(1)**, using constant space.
