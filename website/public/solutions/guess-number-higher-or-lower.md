# Guess Number Higher Or Lower

## Problem Description
We are playing the Guess Game. The game is as follows:
I pick a number from 1 to n. You have to guess which number I picked (the number I picked stays the same throughout the game).
Every time you guess wrong, I will tell you whether the number I picked is higher or lower than your guess.
You call a pre-defined API int guess(int num), which returns three possible results:

-1: Your guess is higher than the number I picked (i.e. num > pick).
1: Your guess is lower than the number I picked (i.e. num < pick).
0: your guess is equal to the number I picked (i.e. num == pick).

Return the number that I picked.

---

## Examples

**Example 1:**

**Input:**
```python
n = 10, pick = 6
```

**Output:**
```python
6
```

**Example 2:**

**Input:**
```python
n = 1, pick = 1
```

**Output:**
```python
1
```

**Example 3:**

**Input:**
```python
n = 2, pick = 1
```

**Output:**
```python
1
```

---

## Constraints

- 1 <= n <= 2^31 - 1
- 1 <= pick <= n

---

## Solution

```python
class Solution:
    def guessNumber(self, n: int) -> int:
        left, right = 1, n
        while left <= right:
            mid = (left + right) // 2
            res = guess(mid)
            if res == 0:
                return mid
            elif res == -1:
                right = mid - 1
            else:
                left = mid + 1
```

---

## Explanation
This problem uses binary search to guess the number between 1 and n.

Use the guess API to get feedback: -1 higher, 1 lower, 0 correct.

Adjust left or right based on result.

Continue until found.

---

## Time Complexity
**O(log n)**, as binary search.

---

## Space Complexity
**O(1)**, constant space.
