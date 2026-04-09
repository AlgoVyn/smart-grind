## Stack - Valid Parentheses: Forms

What are the different variations of valid parentheses?

<!-- front -->

---

### Form 1: Basic Validation

```python
def is_valid(s):
    """Basic valid parentheses check."""
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
```

---

### Form 2: With Count (Single Type)

```python
def is_valid_single(s):
    """For single bracket type only."""
    count = 0
    for char in s:
        if char == '(':
            count += 1
        elif char == ')':
            count -= 1
            if count < 0:
                return False
    return count == 0
```

---

### Form 3: Min Remove

```python
def min_remove(s):
    """Remove minimum to make valid."""
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
```

---

### Form Comparison

| Form | Brackets | Space | Use Case |
|------|----------|-------|----------|
| Basic | Multiple | O(n) | Standard |
| Counter | Single | O(1) | Simple case |
| Min remove | Multiple | O(n) | Fix string |

<!-- back -->
