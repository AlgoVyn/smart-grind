# Missing Number

## Problem Description

Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

---

## Examples

### Example 1

**Input:**
```python
nums = [3, 0, 1]
```

**Output:**
```python
2
```

**Explanation:**
`n = 3` since there are 3 numbers, so all numbers are in the range `[0, 3]`. `2` is the missing number in the range since it does not appear in `nums`.

### Example 2

**Input:**
```python
nums = [0, 1]
```

**Output:**
```python
2
```

**Explanation:**
`n = 2` since there are 2 numbers, so all numbers are in the range `[0, 2]`. `2` is the missing number in the range since it does not appear in `nums`.

### Example 3

**Input:**
```python
nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]
```

**Output:**
```python
8
```

**Explanation:**
`n = 9` since there are 9 numbers, so all numbers are in the range `[0, 9]`. `8` is the missing number in the range since it does not appear in `nums`.

---

## Constraints

- `n == nums.length`
- `1 <= n <= 10^4`
- `0 <= nums[i] <= n`
- All the numbers of `nums` are unique

**Follow-up:** Could you implement a solution using only O(1) extra space complexity and O(n) runtime complexity?

---

## Solution

```python
from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        """
        Find the missing number using XOR operation.
        
        XOR properties:
        - a ^ a = 0
        - a ^ 0 = a
        - XOR is commutative and associative
        """
        n = len(nums)
        xor_result = 0
        
        # XOR all numbers from 0 to n
        for i in range(n + 1):
            xor_result ^= i
        
        # XOR with all elements in the array
        for num in nums:
            xor_result ^= num
        
        return xor_result
```

---

## Explanation

This problem requires finding the missing number in an array containing numbers from 0 to n.

1. **XOR approach**: Use the properties of XOR:
   - `a ^ a = 0` (a number XORed with itself is 0)
   - `a ^ 0 = a` (a number XORed with 0 is itself)
   - XOR is commutative and associative (order doesn't matter)

2. **Algorithm**:
   - XOR all numbers from 0 to n
   - XOR all elements in the array
   - The result is the missing number (all matching pairs cancel out)

---

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the array
- **Space Complexity:** O(1), using only a few variables
