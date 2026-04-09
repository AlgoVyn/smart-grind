## Stack - Valid Parentheses: Tactics

What are practical tactics for solving parentheses matching problems?

<!-- front -->

---

### Tactic 1: Identify Problem Variant

**Quick classification to choose the right approach:**

```python
def classify_parentheses_problem(description):
    """Determine which parentheses pattern to use."""
    keywords = {
        'minimum add': 'count_needed',
        'add to make valid': 'count_needed',
        'remove invalid': 'delete_minimum',
        'generate all': 'backtracking',
        'longest valid': 'length_tracking',
        'score of': 'score_calculation',
        'decode string': 'nested_processing',
    }
    
    for keyword, pattern in keywords.items():
        if keyword in description.lower():
            return pattern
    
    return 'basic_validation'  # Default
```

| Keyword | Approach | Key Addition |
|---------|----------|--------------|
| "valid parentheses" | Basic stack | Standard algorithm |
| "minimum add" | Counter + stack | Track needed additions |
| "remove invalid" | Stack + indices | Track positions to remove |
| "longest valid" | Stack + indices | Track lengths at positions |
| "generate" | Backtracking | Recursive building |

---

### Tactic 2: Visual Stack Debugging

**Trace through visually to catch logic errors:**

```
Input: "({[}])"

Char    Action          Stack (top on right)    Valid?
────────────────────────────────────────────────────────
'('     Push            (                       ✓
'{'     Push            ({                      ✓
'['     Push            ({[                     ✓
'}'     Pop '[' vs '}'  MISMATCH! [{ vs }]      ✗

Result: False (found mismatch at position 3)
```

**Code trace template:**
```python
def debug_validation(s):
    """Print each step for debugging."""
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for i, char in enumerate(s):
        if char in bracket_map:
            top = stack[-1] if stack else 'EMPTY'
            expected = bracket_map[char]
            print(f"{i}: '{char}' → Pop '{top}', need '{expected}'")
            if not stack or stack[-1] != expected:
                print(f"   MISMATCH! Invalid at position {i}")
                return False
            stack.pop()
        else:
            stack.append(char)
            print(f"{i}: '{char}' → Push. Stack: {stack}")
    
    print(f"Final stack: {stack}. Empty: {not stack}")
    return not stack
```

---

### Tactic 3: Single Type Optimization

**When only one bracket type exists, use counter:**

```python
def is_valid_single_type(s: str) -> bool:
    """
    For single bracket type only - O(1) space.
    Time: O(n), Space: O(1)
    """
    count = 0
    for char in s:
        if char == '(':
            count += 1
        elif char == ')':
            count -= 1
            if count < 0:  # More closing than opening
                return False
    return count == 0

# When to use:
# - Only '(' and ')' in input
# - No other bracket types
# - Space-constrained environment
```

---

### Tactic 4: Minimum Additions Calculation

**Count brackets needed to make valid:**

```python
def min_additions(s: str) -> int:
    """
    Minimum brackets to add for validity.
    LeetCode 921
    """
    stack = []
    unmatched_closing = 0
    
    for char in s:
        if char == '(':
            stack.append(char)
        elif char == ')':
            if stack:
                stack.pop()
            else:
                unmatched_closing += 1  # No matching '('
    
    # Unmatched opening (in stack) + unmatched closing
    return len(stack) + unmatched_closing

# Key insight: 
# - Stack size = unmatched opening brackets
# - Counter = unmatched closing brackets
```

---

### Tactic 5: Remove Invalid Brackets

**Track indices and filter:**

```python
def remove_invalid(s: str) -> str:
    """
    Remove minimum brackets to make valid.
    LeetCode 301 variation
    """
    stack = []  # Store indices of '('
    remove = set()
    
    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        elif c == ')':
            if stack:
                stack.pop()
            else:
                remove.add(i)  # No matching '('
    
    # Add unmatched '(' indices
    remove.update(stack)
    
    # Build result excluding removed indices
    return ''.join(c for i, c in enumerate(s) if i not in remove)
```

---

### Tactic 6: Longest Valid Substring

**Use stack to track indices:**

```python
def longest_valid(s: str) -> int:
    """
    Length of longest valid parentheses substring.
    LeetCode 32
    """
    stack = [-1]  # Base index for length calculation
    max_len = 0
    
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)  # New base index
            else:
                max_len = max(max_len, i - stack[-1])
    
    return max_len

# Key insight: Stack stores indices, not brackets
# Length = current_index - stack_top_index
```

---

### Tactic 7: Handle Non-Bracket Characters

**Skip non-bracket characters when needed:**

```python
def is_valid_with_others(s: str) -> bool:
    """
    Skip non-bracket characters in validation.
    """
    bracket_map = {')': '(', '}': '{', ']': '['}
    opening = set(bracket_map.values())
    closing = set(bracket_map.keys())
    stack = []
    
    for char in s:
        if char in opening:
            stack.append(char)
        elif char in closing:
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        # else: skip non-bracket characters
    
    return not stack
```

<!-- back -->
