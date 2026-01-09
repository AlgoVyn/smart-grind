# Maximize the Topmost Element After K Moves

## Problem Description

You are given a 0-indexed integer array `nums` representing the contents of a pile, where `nums[0]` is the topmost element of the pile.

In one move, you can perform either of the following:

1. If the pile is not empty, remove the topmost element of the pile.
2. If there are one or more removed elements, add any one of them back onto the pile. This element becomes the new topmost element.

You are also given an integer `k`, which denotes the total number of moves to be made.

Return the maximum value of the topmost element of the pile possible after exactly `k` moves. If it is not possible to obtain a non-empty pile after `k` moves, return `-1`.

---

## Examples

### Example 1

**Input:**
```python
nums = [5, 2, 2, 4, 0, 6], k = 4
```

**Output:**
```
5
```

**Explanation:** One way to end with `5` at the top after 4 moves:
1. Remove `5` → Pile: `[2, 2, 4, 0, 6]`
2. Remove `2` → Pile: `[2, 4, 0, 6]`
3. Remove `2` → Pile: `[4, 0, 6]`
4. Add `5` back → Pile: `[5, 4, 0, 6]`

### Example 2

**Input:**
```python
nums = [2], k = 1
```

**Output:**
```
-1
```

**Explanation:** The only move is to remove the topmost element, leaving an empty pile. Return `-1`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `0 <= nums[i], k <= 10^9`

---

## Solution

```python
from typing import List

class Solution:
    def maximumTop(self, nums: List[int], k: int) -> int:
        n = len(nums)
        if k == n:
            return -1
        if k == 0:
            return nums[0]
        if k >= n:
            return max(nums)
        return max(nums[:k + 1])
```

---

## Explanation

We analyze different cases based on the relationship between `k` and `n`:

### Case Analysis

1. **`k == n`**: After removing all `n` elements, the pile is empty. Return `-1`.

2. **`k == 0`**: No moves are made. Return the top element `nums[0]`.

3. **`k >= n`**: We can access all elements (remove `n` elements, then add one back). Return `max(nums)`.

4. **`k < n`**: We can remove `k` elements, then optionally add back one of the removed elements. The possible top elements are the first `k+1` elements. Return `max(nums[:k+1])`.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(k)` for `k < n`, `O(n)` otherwise |
| **Space** | `O(1)` |
