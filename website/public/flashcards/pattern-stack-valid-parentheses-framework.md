## Stack - Valid Parentheses: Framework

What is the complete code template for valid parentheses matching?

<!-- front -->

---

### Framework 1: Valid Parentheses Template

```
┌─────────────────────────────────────────────────────┐
│  VALID PARENTHESES - STACK TEMPLATE                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack                           │
│  2. Create mapping: closing → opening               │
│     ')' → '(', ']' → '[', '}' → '{'               │
│  3. For each char in string:                        │
│     a. If opening bracket:                         │
│        - Push to stack                              │
│     b. If closing bracket:                         │
│        - If stack empty: return False              │
│        - Pop from stack                             │
│        - If popped != mapping[char]: return False  │
│  4. After loop: return stack is empty               │
│     (True if all matched, False if unmatched opens) │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def is_valid(s):
    """Check if string has valid bracket matching."""
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in mapping:  # Closing bracket
            if not stack:
                return False
            
            top = stack.pop()
            if top != mapping[char]:
                return False
        else:  # Opening bracket
            stack.append(char)
    
    return not stack  # True if empty (all matched)
```

---

### Implementation: With Min Additions Count

```python
def min_add_to_make_valid(s):
    """Count brackets needed to make string valid."""
    stack = []
    
    for char in s:
        if char == '(':
            stack.append(char)
        else:  # ')'
            if stack and stack[-1] == '(':
                stack.pop()
            else:
                stack.append(char)  # Unmatched ')'
    
    return len(stack)  # Unmatched brackets
```

---

### Implementation: Longest Valid Substring

```python
def longest_valid_parentheses(s):
    """Find length of longest valid parentheses substring."""
    stack = [-1]  # Base for length calculation
    max_len = 0
    
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:  # ')'
            stack.pop()
            
            if not stack:
                stack.append(i)  # New base
            else:
                max_len = max(max_len, i - stack[-1])
    
    return max_len
```

---

### Key Pattern Elements

| Element | Purpose | Note |
|---------|---------|------|
| Stack | Track unmatched opens | LIFO matching |
| Mapping | Closing to opening | Easy lookup |
| Empty check | No match available | Invalid immediately |
| Final empty check | All opens matched | Complete validation |

<!-- back -->
