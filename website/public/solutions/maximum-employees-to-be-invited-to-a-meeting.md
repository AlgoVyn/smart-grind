# Maximum Employees To Be Invited To A Meeting

## Problem Description

A company is organizing a meeting and has a list of `n` employees waiting to be invited. They have arranged for a large circular table capable of seating any number of employees. The employees are numbered from `0` to `n - 1`. Each employee has a favorite person, and they will attend the meeting only if they can sit next to their favorite person at the table. The favorite person of an employee is not themselves.

Given a 0-indexed integer array `favorite`, where `favorite[i]` denotes the favorite person of the `i-th` employee, return the maximum number of employees that can be invited to the meeting.

### Example 1

**Input:** `favorite = [2,2,1,2]`

**Output:** `3`

**Explanation:**

The above figure shows how the company can invite employees `0`, `1`, and `2`, and seat them at the round table. All employees cannot be invited because employee `2` cannot sit beside employees `0`, `1`, and `3` simultaneously.

Note that the company can also invite employees `1`, `2`, and `3`, and give them their desired seats. The maximum number of employees that can be invited to the meeting is `3`.

### Example 2

**Input:** `favorite = [1,2,0]`

**Output:** `3`

**Explanation:**

Each employee is the favorite person of at least one other employee, and the only way the company can invite them is if they invite every employee. The seating arrangement will be the same as that in the figure given in Example 1:

- Employee `0` will sit between employees `2` and `1`
- Employee `1` will sit between employees `0` and `2`
- Employee `2` will sit between employees `1` and `0`

The maximum number of employees that can be invited to the meeting is `3`.

### Example 3

**Input:** `favorite = [3,0,1,4,1]`

**Output:** `4`

**Explanation:**

The above figure shows how the company will invite employees `0`, `1`, `3`, and `4`, and seat them at the round table. Employee `2` cannot be invited because the two spots next to their favorite employee `1` are taken. So the company leaves them out of the meeting.

The maximum number of employees that can be invited to the meeting is `4`.

### Constraints

- `n == favorite.length`
- `2 <= n <= 10^5`
- `0 <= favorite[i] <= n - 1`
- `favorite[i] != i`

## Solution

```python
from typing import List

class Solution:
    def maximumInvitations(self, favorite: List[int]) -> int:
        n = len(favorite)
        visited = [False] * n
        cycles = []
        cycle_nodes = set()
        max_cycle = 0

        for i in range(n):
            if not visited[i]:
                path = []
                current = i
                while not visited[current]:
                    visited[current] = True
                    path.append(current)
                    current = favorite[current]
                    if current in path:
                        cycle_start = path.index(current)
                        cycle = path[cycle_start:]
                        cycles.append(cycle)
                        cycle_nodes.update(cycle)
                        max_cycle = max(max_cycle, len(cycle))
                        break
                    elif visited[current]:
                        break

        max_chain = {}
        visited_for_chain = [False] * n

        for i in range(n):
            if not visited_for_chain[i] and i not in cycle_nodes:
                current = i
                length = 0
                while not visited_for_chain[current] and current not in cycle_nodes:
                    visited_for_chain[current] = True
                    current = favorite[current]
                    length += 1
                if current in cycle_nodes:
                    max_chain[current] = max(max_chain.get(current, 0), length)

        max_invite = max_cycle
        for cycle in cycles:
            sum_chain = 0
            for node in cycle:
                sum_chain += max_chain.get(node, 0)
            max_invite = max(max_invite, len(cycle) + sum_chain)

        return max_invite
```

## Explanation

We use DFS to find all cycles in the graph. For each cycle, we calculate the number of employees that can be invited as the cycle size plus the lengths of chains attached to the cycle nodes.

The maximum is the maximum of the cycle sizes and the cycle sizes plus attached chains.

### Time Complexity

- **O(n)**, where `n` is the number of employees

### Space Complexity

- **O(n)** for storing visited arrays, cycles, and chain mappings
