# Boats To Save People

## Problem Description

You are given an array `people` where `people[i]` is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of `limit`. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most `limit`.

Return the minimum number of boats to carry every given person.

---

## Examples

**Example 1:**

**Input:**
```python
people = [1,2], limit = 3
```

**Output:**
```python
1
```

**Explanation:** 1 boat (1, 2)

**Example 2:**

**Input:**
```python
people = [3,2,2,1], limit = 3
```

**Output:**
```python
3
```

**Explanation:** 3 boats (1, 2), (2) and (3)

**Example 3:**

**Input:**
```python
people = [3,5,3,4], limit = 5
```

**Output:**
```python
4
```

**Explanation:** 4 boats (3), (3), (4), (5)

---

## Constraints

- `1 <= people.length <= 5 * 104`
- `1 <= people[i] <= limit <= 3 * 104`

---

## Solution

```python
from typing import List

class Solution:
    def numRescueBoats(self, people: List[int], limit: int) -> int:
        people.sort()
        left, right = 0, len(people) - 1
        boats = 0
        while left <= right:
            if people[left] + people[right] <= limit:
                left += 1
            right -= 1
            boats += 1
        return boats
```

---

## Explanation

This solution uses a greedy approach with two pointers after sorting the people array. We sort the array to easily pair the lightest and heaviest people. Initialize two pointers: `left` at the start and `right` at the end. For each boat, check if the lightest and heaviest can fit together (sum <= limit). If yes, move both pointers; if not, only move the right pointer (heaviest alone). Each iteration increments the boat count. This ensures the minimum number of boats by maximizing pairs.

---

## Time Complexity
**O(n log n)**, due to sorting, where n is the number of people.

---

## Space Complexity
**O(1)**, excluding the input array, as we only use a few variables.
