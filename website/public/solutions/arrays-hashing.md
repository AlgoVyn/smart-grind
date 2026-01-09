# Arrays Hashing

## Problem Description

Given an array of integers `nums`, determine if any value appears at least twice in the array. Return `true` if there are any duplicate values, otherwise return `false`.

---

## Solution

```python
from typing import List

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for num in nums:
            if num in seen:
                return True
            seen.add(num)
        return False
```

---

## Explanation

This problem requires determining if an array contains any duplicate elements.

We use a set to keep track of elements we've seen so far. As we iterate through the array, for each element, we check if it's already in the set. If it is, we return `True` indicating a duplicate exists. Otherwise, we add it to the set.

This approach ensures we detect the first duplicate encountered.

---

## Time Complexity
**O(N)** since set operations are O(1) on average.

---

## Space Complexity
**O(N)** in the worst case when all elements are unique.

This is an efficient solution using hashing (via the set) to solve the arrays problem.
