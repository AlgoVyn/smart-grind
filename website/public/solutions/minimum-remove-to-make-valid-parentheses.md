# Minimum Remove To Make Valid Parentheses

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/)

Given a string s of '(' , ')' and lowercase English characters.
Your task is to remove the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid and return any valid string.
Formally, a parentheses string is valid if and only if:

It is the empty string, contains only lowercase characters, or
It can be written as AB (A concatenated with B), where A and B are valid strings, or
It can be written as (A), where A is a valid string.

 
Example 1:

Input: s = "lee(t(c)o)de)"
Output: "lee(t(c)o)de"
Explanation: "lee(t(co)de)" , "lee(t(c)ode)" would also be accepted.

Example 2:

Input: s = "a)b(c)d"
Output: "ab(c)d"

Example 3:

Input: s = "))(("
Output: ""
Explanation: An empty string is also valid.

 
Constraints:

1 <= s.length <= 105
s[i] is either '(' , ')', or lowercase English letter.


## Solution

```python
class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        stack = []
        to_remove = set()
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            elif c == ')':
                if stack:
                    stack.pop()
                else:
                    to_remove.add(i)
        to_remove.update(stack)
        result = []
        for i, c in enumerate(s):
            if i not in to_remove:
                result.append(c)
        return ''.join(result)
```

## Explanation
This problem requires removing the minimum number of parentheses to make the string valid, keeping lowercase letters.

Use a stack to track indices of unmatched '(' and a set for indices to remove.

Iterate through the string:
- For '(', push its index onto the stack.
- For ')', if stack is not empty, pop the matching '(', else add the ')' index to the remove set.
- For letters, do nothing.

After iteration, add all remaining indices in the stack to the remove set (unmatched '(').

Build the result string by including characters whose indices are not in the remove set.

**Time Complexity:** O(n), where n is the string length, for one pass and building the result.
**Space Complexity:** O(n), for the stack and set.
