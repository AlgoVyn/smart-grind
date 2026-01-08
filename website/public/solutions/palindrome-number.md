# Palindrome Number

## Problem Description
[Link to problem](https://leetcode.com/problems/palindrome-number/)

Given an integer x, return true if x is a palindrome, and false otherwise.
 
Example 1:

Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

Example 2:

Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

Example 3:

Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.

 
Constraints:

-231 <= x <= 231 - 1

 
Follow up: Could you solve it without converting the integer to a string?


## Solution

```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x //= 10
        return original == reversed_num
```

## Explanation
To check if an integer is a palindrome, reverse the number and compare it with the original.

Step-by-step approach:
1. Negative numbers are not palindromes.
2. Store the original number.
3. Reverse the number by repeatedly taking the last digit (x % 10) and adding it to reversed_num * 10.
4. Compare the reversed number with the original.

Time Complexity: O(log n), where n is the number, as we process each digit.
Space Complexity: O(1).
