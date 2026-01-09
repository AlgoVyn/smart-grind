# Counting Bits

## Problem Description
Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.

## Examples

**Example 1:**

**Input:**
```
n = 2
```

**Output:**
```
[0,1,1]
```

**Explanation:**
- 0 --> 0
- 1 --> 1
- 2 --> 10

**Example 2:**

**Input:**
```
n = 5
```

**Output:**
```
[0,1,1,2,1,2]
```

**Explanation:**
- 0 --> 0
- 1 --> 1
- 2 --> 10
- 3 --> 11
- 4 --> 100
- 5 --> 101

## Constraints

- `0 <= n <= 10^5`

## Solution

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i // 2] + (i % 2)
        return ans
```

## Explanation
This problem requires counting the number of 1's in the binary representation for each number from 0 to n. A naive approach would be to iterate through each number and count the bits, but that would be O(n log n) due to the bit counting for each number.

To achieve O(n) time, we use dynamic programming. We observe that for any number i:
- If i is even, the number of 1's is the same as i // 2 (since shifting right by 1 doesn't change the count for even numbers).
- If i is odd, the number of 1's is one more than i // 2 (because the least significant bit is 1).

1. Initialize an array `ans` of size n+1 with 0's, since ans[0] = 0.
2. For each i from 1 to n, compute ans[i] using the relation ans[i] = ans[i // 2] + (i % 2).
3. Return the array.

## Time Complexity
**O(n)**, as we perform a single pass through the numbers from 1 to n.

## Space Complexity
**O(n)**, for storing the result array.
