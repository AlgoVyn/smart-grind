# Single Number

## Problem Description

Given a non-empty array of integers where every element appears exactly twice except for one element that appears exactly once, find and return that single element.

### Requirements

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

---

## Examples

**Example 1:**
```
Input: nums = [2,2,1]
Output: 1
```

**Example 2:**
```
Input: nums = [4,1,2,1,2]
Output: 4
```

**Example 3:**
```
Input: nums = [1]
Output: 1
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 3 * 10^4` | Array length |
| `-3 * 10^4 <= nums[i] <= 3 * 10^4` | Element value |

---

## Solution

```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for num in nums:
            result ^= num
        return result
```

---

## Explanation

### Approach: Bitwise XOR

XOR has two important properties:

1. **a ^ a = 0** — Any number XORed with itself is 0
2. **a ^ 0 = a** — Any number XORed with 0 is itself

### Algorithm

1. Initialize `result = 0`
2. XOR each number in the array
3. All pairs cancel out (become 0), leaving only the single number

### Why It Works

```
Example: [4, 1, 2, 1, 2]
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4
```

### Time Complexity

- **O(n)** — Single pass through the array

### Space Complexity

- **O(1)** — Constant extra space

---

## Related Problems

- [Single Number](https://leetcode.com/problems/single-number/)
