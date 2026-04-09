## Backtracking - Parentheses Generation: Framework

What is the complete code template for generating valid parentheses?

<!-- front -->

---

### Framework 1: Count-Based Backtracking

```
┌─────────────────────────────────────────────────────┐
│  GENERATE PARENTHESES - TEMPLATE                       │
├─────────────────────────────────────────────────────┤
│  1. Define backtrack(open_count, close_count, s):     │
│     a. If len(s) == 2*n:                              │
│        - Add s to results                              │
│        - Return                                        │
│                                                        │
│     b. If open_count < n:                             │
│        - backtrack(open+1, close, s + '(')            │
│                                                        │
│     c. If close_count < open_count:                   │
│        - backtrack(open, close+1, s + ')')            │
│                                                        │
│  2. Start with backtrack(0, 0, "")                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def generate_parenthesis(n):
    """
    Generate all valid n pairs of parentheses.
    LeetCode 22
    Time: O(4^n / √n), Space: O(n)
    """
    result = []
    
    def backtrack(open_count, close_count, current):
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        # Can add '(' if we haven't used all n
        if open_count < n:
            current.append('(')
            backtrack(open_count + 1, close_count, current)
            current.pop()
        
        # Can add ')' if it won't exceed open count
        if close_count < open_count:
            current.append(')')
            backtrack(open_count, close_count + 1, current)
            current.pop()
    
    backtrack(0, 0, [])
    return result
```

---

### Key Constraints

| Constraint | Condition | Why |
|------------|-----------|-----|
| Add '(' | `open < n` | Can't exceed n pairs |
| Add ')' | `close < open` | Must match an open |
| Base case | `len == 2*n` | Complete combination |

<!-- back -->
