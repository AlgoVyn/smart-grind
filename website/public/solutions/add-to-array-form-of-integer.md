# Add To Array Form Of Integer

## Problem Description

The array-form of an integer `num` is an array representing its digits in left to right order.

For example, for `num = 1321`, the array form is `[1,3,2,1]`.

Given `num`, the array-form of an integer, and an integer `k`, return the array-form of the integer `num + k`.

## Examples

**Example 1:**

**Input:**
```python
num = [1,2,0,0], k = 34
```

**Output:**
```python
[1,2,3,4]
```

**Explanation:** 1200 + 34 = 1234

**Example 2:**

**Input:**
```python
num = [2,7,4], k = 181
```

**Output:**
```python
[4,5,5]
```

**Explanation:** 274 + 181 = 455

**Example 3:**

**Input:**
```python
num = [2,1,5], k = 806
```

**Output:**
```python
[1,0,2,1]
```

**Explanation:** 215 + 806 = 1021

## Constraints

- `1 <= num.length <= 10^4`
- `0 <= num[i] <= 9`
- `num` does not contain any leading zeros except for the zero itself.
- `1 <= k <= 10^4`

## Solution

```python
from typing import List

class Solution:
    def addToArrayForm(self, num: List[int], k: int) -> List[int]:
        for i in range(len(num) - 1, -1, -1):
            if k == 0:
                break
            k, num[i] = divmod(k + num[i], 10)
        while k:
            num.insert(0, k % 10)
            k //= 10
        return num
```

## Explanation

To add an integer `k` to a large number represented as an array of digits, we simulate the addition process starting from the least significant digit.

We iterate from the end of the array. For each digit, we add the current value of `k` and update the digit with the modulo 10, and set `k` to the quotient (carry).

If `k` becomes 0, we can stop early. If `k` still has value after processing all digits, we insert the remaining digits at the beginning of the array.

This modifies the array in place and handles large numbers without conversion.

## Time Complexity
**O(n)**, where n is the length of the array, as we may traverse the entire array and insert up to `log(k)` digits.

## Space Complexity
**O(log k)** in the worst case for inserting new digits at the front.
