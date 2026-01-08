# Backspace String Compare

## Problem Description

Given two strings s and t, return true if they are equal when both are typed into empty text editors. '#' means a backspace character.

Note that after backspacing an empty text, the text will continue empty.

 
Example 1:

Input: s = "ab#c", t = "ad#c"
Output: true
Explanation: Both s and t become "ac".

Example 2:

Input: s = "ab##", t = "c#d#"
Output: true
Explanation: Both s and t become "".

Example 3:

Input: s = "a#c", t = "b"
Output: false
Explanation: s becomes "c" while t becomes "b".

 
Constraints:

	1 <= s.length, t.length <= 200
	s and t only contain lowercase letters and '#' characters.

 
Follow up: Can you solve it in O(n) time and O(1) space?

[Link to problem](https://leetcode.com/problems/backspace-string-compare/)

Given two strings s and t, return true if they are equal when both are typed into empty text editors. '#' means a backspace character.
Note that after backspacing an empty text, the text will continue empty.
 
Example 1:

Input: s = "ab#c", t = "ad#c"
Output: true
Explanation: Both s and t become "ac".

Example 2:

Input: s = "ab##", t = "c#d#"
Output: true
Explanation: Both s and t become "".

Example 3:

Input: s = "a#c", t = "b"
Output: false
Explanation: s becomes "c" while t becomes "b".

 
Constraints:

1 <= s.length, t.length <= 200
s and t only contain lowercase letters and '#' characters.

 
Follow up: Can you solve it in O(n) time and O(1) space?

## Solution

```python
class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def get_next_valid_index(string, index):
            backspace_count = 0
            while index >= 0:
                if string[index] == '#':
                    backspace_count += 1
                elif backspace_count > 0:
                    backspace_count -= 1
                else:
                    return index
                index -= 1
            return -1
        
        i, j = len(s) - 1, len(t) - 1
        while i >= 0 or j >= 0:
            i = get_next_valid_index(s, i)
            j = get_next_valid_index(t, j)
            if i < 0 and j < 0:
                return True
            if i < 0 or j < 0 or s[i] != t[j]:
                return False
            i -= 1
            j -= 1
        return True
```

## Explanation

To achieve O(1) space complexity as per the follow-up, we use two pointers starting from the end of each string. The helper function `get_next_valid_index` finds the next character that is not deleted by backspaces, counting backspaces as we move left.

For each string, we skip over backspaces and characters that are backspaced. We compare valid characters from both strings moving backwards. If we find a mismatch or one string ends while the other has remaining valid characters, return False. If both pointers go below 0 simultaneously, strings are equal.

This approach runs in O(N) time and O(1) space, optimal for the constraints.
