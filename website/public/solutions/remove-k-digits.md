# Remove K Digits

## Problem Description
Given string num representing a non-negative integer num, and an integer k, return the smallest possible integer after removing k digits from num.
 
Example 1:

Input: num = "1432219", k = 3
Output: "1219"
Explanation: Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.

Example 2:

Input: num = "10200", k = 1
Output: "200"
Explanation: Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.

Example 3:

Input: num = "10", k = 2
Output: "0"
Explanation: Remove all the digits from the number and it is left with nothing which is 0.

 
Constraints:

1 <= k <= num.length <= 105
num consists of only digits.
num does not have any leading zeros except for the zero itself.
## Solution

```python
def removeKdigits(num: str, k: int) -> str:
    stack = []
    for digit in num:
        while stack and stack[-1] > digit and k > 0:
            stack.pop()
            k -= 1
        stack.append(digit)

    # Remove remaining k digits from the end
    while k > 0 and stack:
        stack.pop()
        k -= 1

    # Remove leading zeros
    result = ''.join(stack).lstrip('0')
    return result if result else '0'
```

## Explanation
To form the smallest number by removing k digits, use a monotonic stack.

1. Iterate through each digit in num.
2. While stack is not empty, top > current digit, and k > 0, pop from stack and decrement k.
3. Push current digit to stack.
4. After iteration, if k > 0, pop from stack end.
5. Remove leading zeros from the stack string.
6. If result is empty, return "0".

This ensures the smallest number by keeping smaller digits leftmost.

**Time Complexity:** O(n), n is num length.
**Space Complexity:** O(n), for stack.
