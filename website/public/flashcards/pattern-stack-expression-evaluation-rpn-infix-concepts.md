## Stack Expression Evaluation: Core Concepts

What are the fundamental principles behind stack-based expression evaluation?

<!-- front -->

---

### Core Concept: Why Stacks Work

Stacks naturally handle **nested operations** through their LIFO property. When evaluating expressions:

1. **RPN (Postfix)**: Numbers wait on the stack until their operator arrives
2. **Infix**: Operators wait on the stack until higher-priority operators are resolved

```
RPN Example: [2, 1, 3, *, +]

Stack evolution:
  Push 2:     [2]
  Push 1:     [2, 1]
  Push 3:     [2, 1, 3]
  See '*':    pop 3, pop 1, push 1*3=3  → [2, 3]
  See '+':    pop 3, pop 2, push 2+3=5  → [5]
  
Result: 5 (equals 2 + (1 * 3) in infix)
```

---

### Key Properties

| Property | RPN Evaluation | Infix Conversion |
|----------|----------------|------------------|
| Stack purpose | Stores operands | Stores operators |
| Trigger action | Operator seen | Higher precedence or ')' seen |
| Precedence handling | None needed | Essential for correctness |
| Parentheses | Not present | Handled by stack push/pop |

---

### Visual: Operator Precedence Handling

```
Infix: 3 + 4 * 2 / (1 - 5)

Shunting Yard process:
  Token    Stack       Output
  ─────────────────────────
  3        []          [3]
  +        [+]         [3]
  4        [+]         [3, 4]
  *        [+, *]      [3, 4]        (* has higher prec, push)
  2        [+, *]      [3, 4, 2]
  /        [+, /]      [3, 4, 2, *]  (pop *, then push /)
  (        [+, /, (]   [3, 4, 2, *]
  1        [+, /, (]  [3, 4, 2, *, 1]
  -        [+, /, (, -] [3, 4, 2, *, 1]
  5        [+, /, (, -] [3, 4, 2, *, 1, 5]
  )        [+, /]      [3, 4, 2, *, 1, 5, -]  (pop until '(')
  
Final: pop all → [3, 4, 2, *, 1, 5, -, /, +]
```

---

### Common Applications

| Problem Type | Stack Role | Pattern Used |
|--------------|------------|--------------|
| Calculator (RPN input) | Operand storage | RPN evaluation |
| Calculator (standard) | Operator storage | Infix conversion |
| Compiler parsing | Operator precedence | Shunting yard |
| Expression validation | Parentheses matching | Stack push/pop |

---

### Why It Works (Correctness)

**RPN Correctness**: Postfix notation eliminates ambiguity:
- Each operator immediately follows its operands
- Stack ensures operands are available when operator arrives
- No parentheses needed (order is explicit)

**Shunting Yard Correctness**:
- Operators with higher precedence must execute first
- Stack delays lower-precedence operators until higher ones are output
- Parentheses create temporary precedence boundaries

<!-- back -->
