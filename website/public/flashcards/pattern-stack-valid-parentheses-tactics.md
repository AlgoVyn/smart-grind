## Stack - Valid Parentheses: Tactics

What are the advanced techniques for valid parentheses?

<!-- front --

---

### Tactic 1: Min Remove to Make Valid

```python
def min_remove_to_make_valid(s):
    """Remove minimum brackets to make string valid."""
    stack = []  # Store indices of opening brackets
    remove = set()
    
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        elif char == ')':
            if stack:
                stack.pop()
            else:
                remove.add(i)  # No matching opening
    
    # Remaining in stack are unmatched opening
    remove.update(stack)
    
    return ''.join(c for i, c in enumerate(s) if i not in remove)
```

---

### Tactic 2: Longest Valid Parentheses

```python
def longest_valid_parentheses(s):
    """Find longest valid parentheses substring."""
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
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong map direction | Map opening→closing | Should be closing→opening |
| Not checking empty | Index error | Check stack before pop |
| Forgetting final check | "(()" returns True | Check stack empty at end |
| Multiple bracket types | Wrong matching | Use map for all types |

---

### Tactic 4: Generate All Valid

```python
def generate_parenthesis(n):
    """Generate all valid n pairs of parentheses."""
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result
```

<!-- back -->
