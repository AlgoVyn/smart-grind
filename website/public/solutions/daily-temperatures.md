# Daily Temperatures

## Problem Description
Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.

---

## Examples

**Example 1:**

**Input:**
```python
temperatures = [73,74,75,71,69,72,76,73]
```

**Output:**
```python
[1,1,4,2,1,1,0,0]
```

**Example 2:**

**Input:**
```python
temperatures = [30,40,50,60]
```

**Output:**
```python
[1,1,1,0]
```

**Example 3:**

**Input:**
```python
temperatures = [30,60,90]
```

**Output:**
```python
[1,1,0]
```

---

## Constraints

- `1 <= temperatures.length <= 105`
- `30 <= temperatures[i] <= 100`

---

## Solution

```python
from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        ans = [0] * n
        stack = []
        
        for i in range(n):
            while stack and temperatures[stack[-1]] < temperatures[i]:
                prev = stack.pop()
                ans[prev] = i - prev
            stack.append(i)
        
        return ans
```

---

## Explanation
Use a monotonic stack to find the next greater temperature for each day.

1. Maintain a stack of indices with decreasing temperatures.
2. For each day i, while the stack is not empty and the temperature at the top of the stack is less than current, pop it and set ans[prev] = i - prev.
3. Push current index onto the stack.
4. Days with no warmer temperature remain 0.

**Time Complexity:** O(n), each index is pushed and popped at most once.

**Space Complexity:** O(n), for the stack.
