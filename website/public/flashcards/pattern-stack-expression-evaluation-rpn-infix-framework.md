## Stack Expression Evaluation (RPN/Infix): Framework

What is the complete algorithm template for evaluating expressions using stacks?

<!-- front -->

---

### Framework: Stack Expression Evaluation

```
┌─────────────────────────────────────────────────────────────┐
│  STACK EXPRESSION EVALUATION - TEMPLATE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RPN (Postfix) Evaluation:                                  │
│  ─────────────────────────                                  │
│  1. Initialize empty operand stack                          │
│  2. For each token:                                         │
│     • Number: push onto stack                               │
│     • Operator: pop b, pop a, compute (a op b), push result │
│  3. Return stack[0] (final result)                          │
│                                                             │
│  Infix to Postfix (Shunting Yard):                          │
│  ─────────────────────────────────                          │
│  1. Initialize operator stack, output list                  │
│  2. For each token:                                         │
│     • Number: add to output                                 │
│     • '(': push to stack                                    │
│     • ')': pop to output until '(' found                    │
│     • Operator: pop higher/equal precedence ops first       │
│  3. Pop remaining operators to output                       │
│                                                             │
│  Key Rule: Operand order is a (first pop), b (second pop)   │
│            For subtraction/division: compute a - b, a / b │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: RPN Evaluation

```python
def eval_rpn(tokens: list[str]) -> int:
    """
    Evaluate Reverse Polish Notation expression.
    Time: O(n), Space: O(n)
    """
    stack = []
    
    for token in tokens:
        if token in '+-*/':
            # Pop right operand FIRST, then left operand
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:  # division - truncate toward zero
                stack.append(int(a / b))
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

### Implementation: Infix to Postfix (Shunting Yard)

```python
def infix_to_postfix(expression: str) -> list[str]:
    """
    Convert infix expression to postfix using Shunting Yard.
    Time: O(n), Space: O(n)
    """
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    stack = []
    output = []
    
    i = 0
    while i < len(expression):
        char = expression[i]
        
        if char.isdigit():
            # Parse multi-digit number
            num = 0
            while i < len(expression) and expression[i].isdigit():
                num = num * 10 + int(expression[i])
                i += 1
            output.append(str(num))
            continue
        elif char == '(':
            stack.append(char)
        elif char == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()  # Remove '('
        elif char in precedence:
            # Pop operators with >= precedence
            while (stack and stack[-1] != '(' and
                   precedence[stack[-1]] >= precedence[char]):
                output.append(stack.pop())
            stack.append(char)
        i += 1
    
    while stack:
        output.append(stack.pop())
    
    return output
```

---

### Key Framework Elements

| Element | Purpose | Critical Detail |
|---------|---------|-----------------|
| Operand stack | Store numbers for computation | LIFO: most recent operands accessed first |
| Pop order | Get correct operands | b = pop() (right), a = pop() (left) |
| Precedence table | Handle operator priority | Higher number = higher precedence |
| '(' handling | Start new sub-expression | Push on '(', pop until '(' on ')' |
| Division | Truncate toward zero | Use `int(a / b)` not `a // b` |

<!-- back -->
