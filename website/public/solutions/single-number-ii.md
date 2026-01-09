# Single Number II

## Problem Description

Given an integer array where every element appears exactly three times except for one element that appears exactly once, find the single element.

### Requirements

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

---

## Examples

**Example 1:**
```python
Input: nums = [2,2,3,2]
Output: 3
```

**Example 2:**
```python
Input: nums = [0,1,0,1,0,1,99]
Output: 99
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 3 * 10^4` | Array length |
| `-2^31 <= nums[i] <= 2^31 - 1` | Element value |

---

## Solution

```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for i in range(32):
            count = 0
            for num in nums:
                if num & (1 << i):
                    count += 1
            # If count mod 3 is 1, the single number has this bit set
            if count % 3 == 1:
                result |= (1 << i)
        # Handle negative numbers (two's complement)
        if result >= 2**31:
            result -= 2**32
        return result
```

---

## Explanation

### Approach: Bit Manipulation

For each bit position (0-31), count how many numbers have that bit set. Since all appearing numbers have the bit set 3 times and the single number has it set once (or zero times), we can determine the bit value:

- If `count % 3 == 1`, the single number has this bit set to 1
- If `count % 3 == 0`, the single number has this bit set to 0

### Handling Negative Numbers

Python integers have unlimited precision. For 32-bit signed integers, if the result's sign bit (bit 31) is set, we convert it to a negative number by subtracting 2^32.

### Time Complexity

- **O(32 * n) = O(n)** — 32 bits times n elements

### Space Complexity

- **O(1)** — Constant extra space

---


## Related Problems

- [Single Number II](https://leetcode.com/problems/single-number-ii/)
