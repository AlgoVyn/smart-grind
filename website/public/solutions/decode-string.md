# Decode String

## Problem Description
Given an encoded string, return its decoded string.
The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. Note that k is guaranteed to be a positive integer.
You may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, k. For example, there will not be input like 3a or 2[4].
The test cases are generated so that the length of the output will never exceed 105.

## Examples

**Example 1:**

**Input:**
```
s = "3[a]2[bc]"
```

**Output:**
```
"aaabcbc"
```

**Example 2:**

**Input:**
```
s = "3[a2[c]]"
```

**Output:**
```
"accaccacc"
```

**Example 3:**

**Input:**
```
s = "2[abc]3[cd]ef"
```

**Output:**
```
"abcabccdcdcdef"
```

## Constraints

- `1 <= s.length <= 30`
- `s` consists of lowercase English letters, digits, and square brackets '[]'.
- `s` is guaranteed to be a valid input.
- All the integers in `s` are in the range `[1, 300]`.

## Solution

```python
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        curr_str = ""
        curr_num = 0
        
        for c in s:
            if c.isdigit():
                curr_num = curr_num * 10 + int(c)
            elif c == '[':
                stack.append((curr_str, curr_num))
                curr_str = ""
                curr_num = 0
            elif c == ']':
                prev_str, num = stack.pop()
                curr_str = prev_str + curr_str * num
            else:
                curr_str += c
        
        return curr_str
```

## Explanation
Use a stack to handle nested encoded strings.

1. Iterate through each character in s.
2. Build the current number when digits are encountered.
3. When '[', push the current string and number onto the stack, reset for the inner string.
4. When ']', pop the previous string and number, repeat the current string num times, and append to the previous string.
5. For letters, append to the current string.
6. The final curr_str is the decoded string.

**Time Complexity:** O(n), where n is the length of the output string (up to 10^5).

**Space Complexity:** O(n), for the stack and strings.
