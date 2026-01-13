## Valid Parentheses

### Problem Statement

LeetCode Problem 20: Valid Parentheses

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order (last-in, first-out).
3. Every close bracket has a corresponding open bracket of the same type.

### Examples

Here are some examples to illustrate the problem:

- **Input:** `s = "()"`<br>
  **Output:** `true`<br>
  **Explanation:** A simple matched pair of parentheses.

- **Input:** `s = "()[]{}"`<br>
  **Output:** `true`<br>
  **Explanation:** All three types of brackets are opened and closed in the correct order without nesting issues.

- **Input:** `s = "(]"`<br>
  **Output:** `false`<br>
  **Explanation:** The opening parenthesis is not closed by a matching closing parenthesis; instead, it's mismatched with a closing bracket.

- **Input:** `s = "([])"`<br>
  **Output:** `true`<br>
  **Explanation:** The brackets are properly nested: square brackets inside parentheses, and both pairs are correctly closed.

- **Input:** `s = "([)]"`<br>
  **Output:** `false`<br>
  **Explanation:** The closing parenthesis attempts to close the opening bracket, violating the correct nesting order.

### Constraints

- `1 <= s.length <= 10^4`
- `s` consists only of the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`.

### Intuition

The key insight is that brackets follow a "last opened, first closed" rule, which naturally aligns with a stack data structure (LIFO: Last In, First Out). As we iterate through the string:

- When we encounter an opening bracket (`(`, `{`, or `[`), we push it onto the stack, anticipating a matching close later.
- When we encounter a closing bracket (`)`, `}`, or `]`), we check if the stack is non-empty and if the top of the stack matches the corresponding opening bracket. If it does, we pop the opening bracket from the stack; otherwise, the string is invalid.
- After processing the entire string, the stack should be empty if all brackets were properly matched and closed.

This approach ensures we handle both matching types and correct order. Mismatches in type or order (e.g., closing a bracket before its pair) will fail the checks.

If the string has an odd length, it can't be valid (unpaired bracket), but we don't need a separate check since the stack will handle it.

### Approaches

#### Approach 1: Stack with Mapping Dictionary (Primary and Efficient)

Use a stack to track opening brackets and a dictionary to map closing brackets to their opening counterparts.

**Python Code:**
```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        
        for char in s:
            if char in mapping:  # It's a closing bracket
                if stack and stack[-1] == mapping[char]:
                    stack.pop()
                else:
                    return False
            else:  # It's an opening bracket
                stack.append(char)
        
        return not stack  # Stack should be empty for validity
```

**Explanation Step-by-Step:**
1. Initialize an empty stack and a mapping dictionary for quick lookups of matching pairs.
2. Iterate through each character in `s`.
3. If it's a closing bracket, check if the stack's top matches the expected opening (via mapping). Pop if yes; return `false` if no or stack is empty.
4. If it's an opening bracket, push it onto the stack.
5. After iteration, return `true` only if the stack is empty (all openings were closed properly).

**Time Complexity:** O(n) - We iterate through the string once, with O(1) operations per character (push/pop/check).<br>
**Space Complexity:** O(n) - In the worst case, the stack holds all characters (e.g., all opening brackets).

This is the optimal approach and widely used.

#### Approach 2: Stack with Conditional Checks (Without Dictionary)

Similar to Approach 1, but use if-elif statements instead of a dictionary for matching. This can be slightly more verbose but avoids hash map overhead (negligible in practice).

**Python Code:**
```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        
        for char in s:
            if char in '({[':  # Opening brackets
                stack.append(char)
            else:  # Closing brackets
                if not stack:
                    return False
                top = stack.pop()
                if (char == ')' and top != '(') or \
                   (char == '}' and top != '{') or \
                   (char == ']' and top != '['):
                    return False
        
        return not stack
```

**Explanation Step-by-Step:**
1. Initialize an empty stack.
2. For each character: Push if opening; otherwise, pop the top and check if it matches the expected opening using conditionals.
3. Return `true` if the stack is empty at the end.

**Time Complexity:** O(n) - Same as above.<br>
**Space Complexity:** O(n) - Same stack usage.

This is a minor variation, useful if you prefer avoiding dictionaries for simplicity in interviews.

#### Approach 3. Recursive String Reduction (Simple but Inefficient)
This mimics the "find and replace" logic. If a string is valid, it must contain at least one adjacent pair of matching parentheses (like `()`, `[]`, or `{}`). We remove that pair and solve for the remaining string.

**Code:**
```python
def isValid(s: str) -> bool:
    # Base Case: An empty string is valid
    if len(s) == 0:
        return True
    
    # Try to find an adjacent matching pair
    if "()" in s:
        return isValid(s.replace("()", "", 1)) # Remove one pair and recurse
    elif "[]" in s:
        return isValid(s.replace("[]", "", 1))
    elif "{}" in s:
        return isValid(s.replace("{}", "", 1))
    else:
        # No matching pairs found, but string is not empty -> Invalid
        return False
```
*   **Time Complexity:** $O(n^2)$ due to repeated string searching and slicing.
*   **Space Complexity:** $O(n^2)$ because each recursive call creates a new string in memory.

---

#### Approach 4. Recursive Stack Simulation (Optimal Time)
In this approach, we use the **System Call Stack** to act as our data structure instead of an explicit `list`. We use an iterator or a shared index to move through the string.

**The Logic:**
1.  If we see an **opening bracket**, we "pause" the current function and start a new recursive call to find its match.
2.  If we see a **closing bracket**, we check if it matches the one we are currently looking for.
3.  If it matches, we "return" to the previous function call (effectively "popping" from the call stack).

**Code:**
```python
def isValid(s: str) -> bool:
    # Use an iterator so all recursive calls share the same progress through the string
    it = iter(s)
    
    def helper(expected=None):
        try:
            while True:
                # Get the next character from the iterator
                char = next(it)
                
                # If we encounter an opening bracket, recurse
                if char == '(':
                    if not helper(')'): return False
                elif char == '[':
                    if not helper(']'): return False
                elif char == '{':
                    if not helper('}'): return False
                
                # If we encounter a closing bracket
                else:
                    # Check if it matches what the parent call is looking for
                    return char == expected
                    
        except StopIteration:
            # If we reach the end of the string, it's valid ONLY IF 
            # we weren't expecting a specific closing bracket.
            return expected is None

    return helper()
```

**How it works step-by-step for `s = "([])"`:**
1.  `isValid` calls `helper(None)`.
2.  `helper` sees `(` $\to$ calls `helper(')')`.
3.  New `helper` sees `[` $\to$ calls `helper(']')`.
4.  Deepest `helper` sees `]` $\to$ matches `expected`, returns `True`.
5.  Middle `helper` resumes, sees `)` $\to$ matches `expected`, returns `True`.
6.  Top `helper` finishes string, returns `True`.

---

#### Other Approaches (Less Efficient or Not Recommended)
- **Counter-Based:** Use counters for each bracket type, but this fails to check order (e.g., ")( " would pass counters but is invalid). Not suitable.
- **String Replacement:** Repeatedly replace matching pairs (e.g., "()", "{}", "[]") until none left. If empty, valid. Time: O(n^2) in worst case due to multiple passes; not efficient for n=10^4.

Stick to the stack-based approaches for interviews.

### Related Problems

Here are some LeetCode problems that build on similar concepts (stack usage, parentheses validation, or generation):

- [Generate Parentheses (Medium)](https://leetcode.com/problems/generate-parentheses/) - Generate all valid combinations of n pairs of parentheses.
- [Longest Valid Parentheses (Hard)](https://leetcode.com/problems/longest-valid-parentheses/) - Find the length of the longest valid parentheses substring.
- [Remove Invalid Parentheses (Hard)](https://leetcode.com/problems/remove-invalid-parentheses/) - Remove the minimum number of invalid parentheses to make the string valid.
- [Check If Word Is Valid After Substitutions (Medium)](https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/) - Validate a string based on substitution rules similar to parentheses.
- [Check if a Parentheses String Can Be Valid (Medium)](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid/) - Determine if a string with wildcards can become valid.
- [Move Pieces to Obtain a String (Medium)](https://leetcode.com/problems/move-pieces-to-obtain-a-string/) - Involves matching positions similar to bracket pairing.

These often appear in interview sets focused on stacks or string manipulation.

### Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

- [Valid Parentheses (LeetCode 20) | Full solution with visuals and animations | Stack Data Structure](https://www.youtube.com/watch?v=TaWs8tIrnoA) - Includes animations for better understanding of the stack process.
- [Valid Parentheses - LeetCode 20 - Python](https://www.youtube.com/watch?v=yLPYrNDp26w) - Focuses on discovery-based problem-solving in Python.
- [LeetCode 20. Valid Parentheses Solution Explained - Java](https://www.youtube.com/watch?v=9kmUaXrjizQ) - Java implementation with step-by-step explanation.
- [Valid Parentheses - Leetcode 20 - Stacks (Python)](https://www.youtube.com/watch?v=7-_V-ufnF4c) - Concise Python solution with stack emphasis.
