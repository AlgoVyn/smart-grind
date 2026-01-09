# Fibonacci Number

## Problem Description

The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).

---

## Constraints

- 0 <= n <= 30

---

## Example 1

**Input:**
```python
n = 2
```

**Output:**
```python
1
```

**Explanation:**
F(2) = F(1) + F(0) = 1 + 0 = 1.

---

## Example 2

**Input:**
```python
n = 3
```

**Output:**
```python
2
```

**Explanation:**
F(3) = F(2) + F(1) = 1 + 1 = 2.

---

## Example 3

**Input:**
```python
n = 4
```

**Output:**
```python
3
```

**Explanation:**
F(4) = F(3) + F(2) = 2 + 1 = 3.

---

## Solution

```python
class Solution:
    def fib(self, n: int) -> int:
        if n == 0:
            return 0
        if n == 1:
            return 1
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
```

---

## Explanation

The Fibonacci sequence is defined such that each number is the sum of the two preceding ones. We can compute F(n) iteratively using dynamic programming to avoid redundant calculations.

### Step-by-Step Explanation:

1. **Base cases**: If n == 0, return 0. If n == 1, return 1.

2. **Iterative computation**: Initialize two variables, `a = 0` (F(0)) and `b = 1` (F(1)). For each step from 2 to n:
   - Compute the next Fibonacci number as `c = a + b`.
   - Update `a = b` and `b = c`.

3. **Return the result**: After the loop, `b` holds F(n).

### Time Complexity:

- O(n), as we perform n iterations.

### Space Complexity:

- O(1), using only a constant amount of extra space.
