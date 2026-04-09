## Stack - Valid Parentheses: Forms

What are the different variations of valid parentheses problems?

<!-- front -->

---

### Form 1: Basic Validation

```python
def is_valid(s: str) -> bool:
    """Basic valid parentheses check - LeetCode 20."""
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in bracket_map:
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    
    return not stack

# Use: Standard validation with multiple bracket types
# Time: O(n), Space: O(n)
```

---

### Form 2: Counter (Single Type)

```python
def is_valid_single(s: str) -> bool:
    """For single bracket type only - O(1) space."""
    count = 0
    for char in s:
        if char == '(':
            count += 1
        elif char == ')':
            count -= 1
            if count < 0:
                return False
    return count == 0

# Use: When only '(' and ')' exist, space optimization
# Time: O(n), Space: O(1)
```

---

### Form 3: Minimum Additions

```python
def min_additions(s: str) -> int:
    """Minimum brackets to add for validity - LeetCode 921."""
    stack = []
    unmatched_closing = 0
    
    for char in s:
        if char == '(':
            stack.append(char)
        else:  # ')'
            if stack:
                stack.pop()
            else:
                unmatched_closing += 1
    
    return len(stack) + unmatched_closing

# Use: Count how many brackets needed to fix string
# Time: O(n), Space: O(n) or O(1) with counter
```

---

### Form 4: Remove Invalid

```python
def remove_invalid(s: str) -> str:
    """Remove minimum to make valid - LeetCode 301 variation."""
    stack = []
    remove = set()
    
    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        elif c == ')':
            if stack:
                stack.pop()
            else:
                remove.add(i)
    
    remove.update(stack)
    return ''.join(c for i, c in enumerate(s) if i not in remove)

# Use: Return corrected string with minimum removals
# Time: O(n), Space: O(n)
```

---

### Form 5: Longest Valid Substring

```python
def longest_valid(s: str) -> int:
    """Length of longest valid substring - LeetCode 32."""
    stack = [-1]  # Base for length calculation
    max_len = 0
    
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)  # New base
            else:
                max_len = max(max_len, i - stack[-1])
    
    return max_len

# Use: Find length of longest valid parentheses substring
# Time: O(n), Space: O(n)
```

---

### Form 6: With Other Characters

```python
def is_valid_with_others(s: str) -> bool:
    """Skip non-bracket characters during validation."""
    bracket_map = {')': '(', '}': '{', ']': '['}
    opening = set(bracket_map.values())
    stack = []
    
    for char in s:
        if char in opening:
            stack.append(char)
        elif char in bracket_map:
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        # Non-bracket characters ignored
    
    return not stack

# Use: Mixed content (alphanumeric + brackets)
# Time: O(n), Space: O(n)
```

---

### Form Comparison

| Form | Input | Output | Space | Key Feature |
|------|-------|--------|-------|-------------|
| Basic | String | Boolean | O(n) | Standard validation |
| Counter | String | Boolean | O(1) | Single type only |
| Min Add | String | Integer | O(n) | Count needed |
| Remove | String | String | O(n) | Fixed string |
| Longest | String | Integer | O(n) | Max length |
| With Others | String | Boolean | O(n) | Ignores non-brackets |

<!-- back -->
