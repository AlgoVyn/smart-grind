## Stack - Valid Parentheses: Core Concepts

What are the fundamental principles of the valid parentheses pattern?

<!-- front -->

---

### Core Concept

Use a **stack to enforce LIFO (Last In, First Out)** matching - the most recently opened bracket must be the first one closed.

**Key insight**: The "nesting" structure of brackets naturally follows stack behavior.

---

### The Pattern

```
Example: "({[]})"

Push '(':     Stack: ['(']
Push '{':     Stack: ['(', '{']
Push '[':     Stack: ['(', '{', '[']
Pop on ']':   '[' matches ']' ✓ Stack: ['(', '{']
Pop on '}':   '{' matches '}' ✓ Stack: ['(']
Pop on ')':   '(' matches ')' ✓ Stack: []

Valid: Stack is empty ✓
```

---

### "Aha!" Moments

| Moment | Insight | Why It Matters |
|----------|---------|----------------|
| **LIFO matching** | Last opened must close first | Defines the stack approach |
| **Stack for openings** | Only push opening brackets | Keeps track of what needs closing |
| **Map structure** | Closing → Opening mapping | Enables O(1) match verification |
| **Final check** | Stack must be empty | Detects unmatched opening brackets |
| **Early termination** | Return false on mismatch | Saves computation time |

---

### Why Stack?

```
Without Stack (would fail):
Input: "([)]"

Incorrect approach - just count:
'(' → count=1
'[' → count=2  (wrong! should verify order)
')' → count=1   (accepts wrong order)
']' → count=0   (incorrectly valid!)

With Stack (correct):
'(' → Stack: ['(']
'[' → Stack: ['(', '[']  - [ must close before (
')' → Stack[-1]='[' != '(' → INVALID ✓
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Basic validation | Check if brackets match | LeetCode 20 |
| Min additions | Count brackets to add | LeetCode 921 |
| Remove invalid | Delete minimum brackets | LeetCode 301 |
| Generate valid | Create all valid combos | LeetCode 22 |
| Longest valid | Find longest valid substring | LeetCode 32 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass through string |
| Space | O(n) | Stack holds opening brackets |

<!-- back -->
