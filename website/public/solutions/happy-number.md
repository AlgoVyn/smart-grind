# Happy Number

## Problem Description

Write an algorithm to determine if a number `n` is happy.

A happy number is a number defined by the following process:

1. Starting with any positive integer, replace the number by the sum of the squares of its digits.
2. Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
3. Those numbers for which this process ends in 1 are happy.

Return `true` if `n` is a happy number, and `false` if not.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `n = 19` | `true` |

**Explanation:**

```
1² + 9² = 82
8² + 2² = 68
6² + 8² = 100
1² + 0² + 0² = 1
```

**Example 2:**

| Input | Output |
|-------|--------|
| `n = 2` | `false` |

## Constraints

- `1 <= n <= 2³¹ - 1`

## Solution

```python
class Solution:
    def isHappy(self, n: int) -> bool:
        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            n = sum(int(digit)**2 for digit in str(n))
        return n == 1
```

## Explanation

We use a set to detect cycles during the transformation process:

1. **Cycle Detection:** The set tracks all numbers we've seen. If we encounter a number again, we've found a cycle (not happy).
2. **Transformation:** Repeatedly replace `n` with the sum of squares of its digits.
3. **Termination:** The process ends when we reach 1 (happy) or detect a cycle (not happy).

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k) where k is the number of iterations until termination |
| **Space** | O(k) for the set of seen numbers |

This approach efficiently detects cycles while processing the number transformation sequence.
