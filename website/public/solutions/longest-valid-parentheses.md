# Longest Valid Parentheses

## Problem Description

Given a string containing just the characters `'('` and `')'`, return the length of the longest valid (well-formed) parentheses substring.

---

## Examples

**Example 1:**

**Input:** `s = "(()"`

**Output:** `2`

**Explanation:** The longest valid parentheses substring is `"()"`.

**Example 2:**

**Input:** `s = ")()())"`

**Output:** `4`

**Explanation:** The longest valid parentheses substring is `"()()"`.

**Example 3:**

**Input:** `s = ""`

**Output:** `0`

---

## Constraints

- `0 <= s.length <= 3 * 10^4`
- `s[i]` is `'('` or `')'`.

---

## Solution

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack = [-1]
        max_len = 0
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            else:
                stack.pop()
                if stack:
                    max_len = max(max_len, i - stack[-1])
                else:
                    stack.append(i)
        return max_len
```

---

## Explanation

We use a stack to keep track of indices of unmatched opening parentheses. Initialize the stack with `-1` to handle the starting point.

For each character in the string:
- If it's `'('`, push the current index onto the stack.
- If it's `')'`, pop the top of the stack. If the stack is not empty after popping, calculate the length of the valid substring as the current index minus the new top of the stack. Update the maximum length. If the stack is empty, push the current index as a new potential start.

This approach finds the longest valid parentheses substring by tracking the boundaries of valid segments.

---

## Complexity Analysis

- **Time Complexity:** `O(n)`, where `n` is the length of `s`, as we traverse the string once.
- **Space Complexity:** `O(n)`, in the worst case, for unbalanced parentheses.
