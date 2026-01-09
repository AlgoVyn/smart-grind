# Climbing Stairs

## Problem Description
You are climbing a staircase. It takes n steps to reach the top.
Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

## Examples

**Example 1:**

**Input:**
```python
n = 2
```

**Output:**
```python
2
```

**Explanation:** There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

**Example 2:**

**Input:**
```python
n = 3
```

**Output:**
```python
3
```

**Explanation:** There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

## Constraints

- `1 <= n <= 45`

## Solution

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b
```

## Explanation
This solution uses dynamic programming with constant space. The number of ways to climb n stairs is the sum of ways to climb n-1 and n-2 stairs. We use two variables to keep track of the previous two values, iterating from 3 to n.

## Time Complexity
**O(n)**, as we loop n times.

## Space Complexity
**O(1)**, using only a few variables.
