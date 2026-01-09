# Add Binary

## Problem Description
Given two binary strings a and b, return their sum as a binary string.
 
Example 1:
Input: a = "11", b = "1"
Output: "100"
Example 2:
Input: a = "1010", b = "1011"
Output: "10101"

 
Constraints:

1 <= a.length, b.length <= 104
a and b consist only of '0' or '1' characters.
Each string does not contain leading zeros except for the zero itself.
## Solution

```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        result = []
        carry = 0
        i, j = len(a) - 1, len(b) - 1
        while i >= 0 or j >= 0 or carry:
            total = carry
            if i >= 0:
                total += int(a[i])
                i -= 1
            if j >= 0:
                total += int(b[j])
                j -= 1
            result.append(str(total % 2))
            carry = total // 2
        return ''.join(result[::-1])
```

## Explanation
To add two binary strings, we simulate the binary addition process from the least significant bit (rightmost) to the most significant bit.

We use two pointers starting from the end of each string. At each step, we add the current bits (if available) and the carry from the previous addition.

The sum modulo 2 gives the current bit, and the integer division by 2 gives the new carry.

We continue until both strings are processed and there is no carry left.

Finally, we reverse the result list to get the correct order.

Time Complexity: O(max(len(a), len(b))), as we process each bit once.

Space Complexity: O(max(len(a), len(b))), for the result list.
