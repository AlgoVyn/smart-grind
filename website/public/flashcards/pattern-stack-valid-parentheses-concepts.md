## Stack - Valid Parentheses: Core Concepts

What are the fundamental principles of using a stack for valid parentheses matching?

<!-- front -->

---

### Core Concept

Use **a stack to track opening brackets**, popping when matching closing brackets are encountered to ensure proper nesting.

**Key insight**: Each closing bracket must match the most recent unmatched opening bracket (LIFO order).

---

### The Pattern

```
Validate: "{[()]}"

Stack: []

Process '{': Push → Stack: ['{']
Process '[': Push → Stack: ['{', '[']
Process '(': Push → Stack: ['{', '[', '(']

Process ')': Top is '(', matches! Pop → Stack: ['{', '[']
Process ']': Top is '[', matches! Pop → Stack: ['{']
Process '}': Top is '{', matches! Pop → Stack: []

End: Stack is empty → Valid! ✓

---

Invalid: "{[}]"

Stack after '{[': ['{', '[']
Process '}': Top is '[', doesn't match '{'
Expected ']' but found '}' → Invalid! ✗
```

---

### Matching Rules

| Opening | Closing | Must Match |
|---------|---------|------------|
| `(` | `)` | Yes |
| `[` | `]` | Yes |
| `{` | `}` | Yes |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Valid Parentheses** | Basic bracket matching | Valid Parentheses |
| **Min Add to Make Valid** | Fix invalid string | Minimum Add |
| **Longest Valid Substring** | Find longest valid part | Longest Valid Parentheses |
| **Score of Parentheses** | Calculate nesting score | Score of Parentheses |
| **Remove Invalid** | Delete min to make valid | Remove Invalid Parentheses |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Single pass through string |
| **Space** | O(n) | Stack for all opening brackets |
| **Worst case** | O(n) | All opening brackets "((((..." |

<!-- back -->
