## Stack Expression Evaluation: Comparison

How do different expression evaluation approaches compare?

<!-- front -->

---

### RPN vs Infix Evaluation

| Aspect | RPN Evaluation | Infix Direct Eval | Infix → Postfix → Eval |
|--------|---------------|-------------------|------------------------|
| **Input format** | Postfix (unambiguous) | Infix (standard) | Infix (standard) |
| **Stack usage** | 1 stack (operands) | 2 stacks (values + ops) | 1 stack (operators) + 1 pass eval |
| **Complexity** | O(n) time, O(n) space | O(n) time, O(n) space | O(n) time, O(n) space |
| **Precedence handling** | None required | Required | Required |
| **Implementation** | Simple, clean | Moderate | Two-step process |
| **Parentheses** | Not present | Handled via stack | Handled during conversion |

---

### When to Use Each Approach

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| Given postfix/RPN input | Direct RPN eval | Simplest, no precedence logic |
| Given infix, need result only | Two-stack direct eval | Single pass, efficient |
| Given infix, need postfix output | Shunting yard | Classic algorithm, clean output |
| Need both conversion + eval | Shunting yard → RPN eval | Modular, reusable |
| Compiler/parser implementation | Shunting yard | Produces AST or postfix |

---

### Comparison: Space Complexity Details

```
RPN Evaluation:
  Stack holds operands only
  Max depth: ~n/2 (alternating numbers and ops)
  Example: [1, 2, 3, 4, +, +, +] → stack grows to [1, 2, 3, 4]

Infix Direct Evaluation:
  Two stacks: values + operators
  Operators stack depth limited by parentheses nesting
  Values stack similar to RPN

Shunting Yard:
  Single operator stack during conversion
  Plus output array for postfix tokens
```

---

### Edge Cases Comparison

| Edge Case | RPN | Infix Direct | Infix→Postfix |
|-----------|-----|--------------|---------------|
| Single number | Stack has 1 element | Values has 1, ops empty | Output = [num] |
| Division by zero | Handle explicitly | Handle explicitly | Handle in eval |
| Negative numbers | Include in token | Use unary handling | Include in token |
| Empty expression | Return 0/error | Return 0/error | Return []/error |
| Invalid syntax | May underflow | May underflow | May have leftover ops |

---

### LeetCode Problem Mapping

| Problem | Type | Recommended Approach |
|---------|------|---------------------|
| 150 - Evaluate RPN | RPN input | Direct stack eval |
| 227 - Basic Calculator II | Infix +, -, *, / | Two-stack direct |
| 224 - Basic Calculator | Infix +, -, (, ) | Two-stack direct |
| 772 - Basic Calculator III | Infix all + () | Two-stack direct |
| 394 - Decode String | Nested repetition | Stack for decoding |

<!-- back -->
