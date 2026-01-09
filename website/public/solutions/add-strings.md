# Add Strings

## Problem Description
Given two non-negative integers, `num1` and `num2`, represented as string, return the sum of `num1` and `num2` as a string.

You must solve the problem without using any built-in library for handling large integers (such as `BigInteger`) and without converting the inputs to integers directly.

---

## Examples

**Example 1:**

**Input:**
```
num1 = "11", num2 = "123"
```

**Output:**
```
"134"
```

**Example 2:**

**Input:**
```
num1 = "456", num2 = "77"
```

**Output:**
```
"533"
```

**Example 3:**

**Input:**
```
num1 = "0", num2 = "0"
```

**Output:**
```
"0"
```

---

## Constraints

- `1 <= num1.length, num2.length <= 10^4`
- `num1` and `num2` consist of only digits.
- `num1` and `num2` don't have any leading zeros except for the number `0` itself.

## Solution

```python
class Solution:
    def addStrings(self, num1: str, num2: str) -> str:
        i, j = len(num1) - 1, len(num2) - 1
        carry = 0
        result = []
        
        while i >= 0 or j >= 0 or carry:
            d1 = int(num1[i]) if i >= 0 else 0
            d2 = int(num2[j]) if j >= 0 else 0
            total = d1 + d2 + carry
            result.append(str(total % 10))
            carry = total // 10
            i -= 1
            j -= 1
        
        result.reverse()
        return ''.join(result)
```

## Explanation

This solution manually adds the two numbers represented as strings by simulating the addition process digit by digit, starting from the least significant digit (rightmost).

- Initialize two pointers `i` and `j` to the end of `num1` and `num2` respectively.
- Use a `carry` variable to keep track of any carry-over from the addition of digits.
- Use a list `result` to build the sum string in reverse order.
- In each iteration of the loop:
  - Get the current digits from `num1` and `num2` (or 0 if the pointer is out of bounds).
  - Add the digits and the carry.
  - Append the units digit of the sum to `result`.
  - Update the carry to the tens digit.
  - Move the pointers leftward.
- Continue until all digits are processed and there is no carry left.
- Reverse the `result` list and join it into a string to get the final sum.

**Time Complexity:** O(max(len(num1), len(num2))) - We iterate through the digits of the longer string once.

**Space Complexity:** O(max(len(num1), len(num2))) - The result list stores up to the maximum length of the input strings plus one for potential carry.
