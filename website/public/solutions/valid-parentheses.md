# Valid Parentheses

## Problem Description
Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.

---

## Examples

**Example 1:**

**Input:**
```
s = "()"
```

**Output:**
```
true
```

**Example 2:**

**Input:**
```
s = "()[]{}"
```

**Output:**
```
true
```

**Example 3:**

**Input:**
```
s = "(]"
```

**Output:**
```
false
```

**Example 4:**

**Input:**
```
s = "([])"
```

**Output:**
```
true
```

**Example 5:**

**Input:**
```
s = "([)]"
```

**Output:**
```
false
```

---

## Constraints

- `1 <= s.length <= 10^4`
- `s` consists of parentheses only `'()[]{}'`

## Solution

```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack
```

## Explanation
This problem requires checking if a string of parentheses is valid, meaning all brackets are properly closed and in the correct order.

### Step-by-Step Approach:
1. **Initialize Stack and Mapping**: Use a stack to keep track of opening brackets. Create a mapping of closing to opening brackets.

2. **Iterate Through String**: For each character:
   - If it's a closing bracket, check if the stack is not empty and the top matches the corresponding opening. If not, invalid.
   - If it's an opening bracket, push it onto the stack.

3. **Check Stack**: After processing all characters, the stack should be empty for validity.

### Time Complexity:
- O(n), where n is the length of s, as we traverse the string once.

### Space Complexity:
- O(n), in the worst case, all opening brackets are pushed to the stack.
