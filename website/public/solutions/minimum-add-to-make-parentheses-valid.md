# Minimum Add To Make Parentheses Valid

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/)

A parentheses string is valid if and only if:

It is the empty string,
It can be written as AB (A concatenated with B), where A and B are valid strings, or
It can be written as (A), where A is a valid string.

You are given a parentheses string s. In one move, you can insert a parenthesis at any position of the string.

For example, if s = "()))", you can insert an opening parenthesis to be "(()))" or a closing parenthesis to be "())))".

Return the minimum number of moves required to make s valid.
 
Example 1:

Input: s = "())"
Output: 1

Example 2:

Input: s = "((("
Output: 3

 
Constraints:

1 <= s.length <= 1000
s[i] is either '(' or ')'.


## Solution

```python
class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        ans = 0
        bal = 0
        for c in s:
            if c == '(':
                bal += 1
            else:
                bal -= 1
                if bal < 0:
                    ans += 1
                    bal = 0
        ans += bal
        return ans
```

## Explanation
We use a balance counter to track unmatched opening parentheses while iterating through the string.

1. Initialize answer and balance to 0.

2. For each character:
   - If '(', increment balance.
   - If ')', decrement balance. If balance becomes negative, increment answer (need to add '(') and reset balance to 0.

3. After the loop, add the remaining balance to answer, as these are unmatched '(' that need closing ')'.

Time complexity: O(n), where n is the length of s, as we process each character once.
Space complexity: O(1), using only constant extra space.
