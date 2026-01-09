# House Robber

## Problem Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `nums = [1,2,3,1]` | `4` |

**Explanation:** Rob house 1 (money = 1) and house 3 (money = 3). Total = `1 + 3 = 4`.

**Example 2:**

| Input | Output |
|-------|--------|
| `nums = [2,7,9,3,1]` | `12` |

**Explanation:** Rob house 1 (money = 2), house 3 (money = 9), and house 5 (money = 1). Total = `2 + 9 + 1 = 12`.

---

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 400`

---

## Solution

```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        prev, curr = 0, 0
        for num in nums:
            prev, curr = curr, max(curr, prev + num)
        return curr
```

---

## Explanation

This problem maximizes money robbed from a linear array without robbing adjacent houses using dynamic programming.

### State Variables

- `prev`: Maximum amount that can be robbed up to the previous house (excluding current)
- `curr`: Maximum amount that can be robbed up to the current house

### Transition

For each house with amount `num`:
- Option 1: Skip current house → `curr` (previous value)
- Option 2: Rob current house → `prev + num` (previous of previous + current)

Update: `prev, curr = curr, max(curr, prev + num)`

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through the array |
| **Space** | O(1) - only two variables used |
