## Stack Expression Evaluation: Tactics

What are specific techniques for stack-based expression evaluation problems?

<!-- front -->

---

### Tactic 1: Correct Operand Order

When popping two operands, order matters for non-commutative operations:

```python
def apply_operator(stack, op):
    """
    Correct order: a is first popped (left operand),
    b is second popped (right operand)
    """
    b = stack.pop()  # Right operand (popped first - was pushed later)
    a = stack.pop()  # Left operand (popped second - was pushed earlier)
    
    if op == '-':
        return a - b   # NOT b - a
    elif op == '/':
        return int(a / b)  # NOT b / a, int() truncates toward zero
    elif op == '+':
        return a + b   # Order doesn't matter
    else:
        return a * b   # Order doesn't matter
```

**Common bug**: `b - a` instead of `a - b` gives wrong answer.

---

### Tactic 2: Integer Division Toward Zero

Python's `//` does floor division (rounds down). For truncate toward zero:

```python
# WRONG: floor division
result = a // b        # -3 // 2 = -2 (floor)

# CORRECT: truncate toward zero
result = int(a / b)    # int(-3 / 2) = -1 (truncate)

# Alternative
def truncate_divide(a, b):
    """Integer division truncating toward zero."""
    if (a < 0) != (b < 0):
        return -(abs(a) // abs(b))
    return a // b
```

**Applies to**: LeetCode 150 (Evaluate Reverse Polish Notation)

---

### Tactic 3: Parsing Multi-Digit Numbers

Don't process character by character for numbers:

```python
def parse_number(expression, i):
    """
    Parse multi-digit number starting at index i.
    Returns (number, next_index)
    """
    num = 0
    while i < len(expression) and expression[i].isdigit():
        num = num * 10 + int(expression[i])
        i += 1
    return num, i

# Usage in main loop
i = 0
while i < len(expression):
    if expression[i].isdigit():
        num, i = parse_number(expression, i)
        output.append(str(num))
        continue  # Skip i += 1 at end
    # ... handle operators
    i += 1
```

---

### Tactic 4: Direct Infix Evaluation (Two Stacks)

Evaluate infix without converting to postfix:

```python
def evaluate_infix(expression: str) -> int:
    """
    Evaluate infix with +, -, *, /, and parentheses.
    Uses two stacks: values and operators.
    """
    def apply_op():
        op = ops.pop()
        b = values.pop()
        a = values.pop()
        if op == '+': values.append(a + b)
        elif op == '-': values.append(a - b)
        elif op == '*': values.append(a * b)
        else: values.append(int(a / b))
    
    def precedence(op):
        return 2 if op in '*/' else 1
    
    values, ops = [], []
    i = 0
    
    while i < len(expression):
        if expression[i] == ' ':
            i += 1
        elif expression[i].isdigit():
            num = 0
            while i < len(expression) and expression[i].isdigit():
                num = num * 10 + int(expression[i])
                i += 1
            values.append(num)
            continue
        elif expression[i] == '(':
            ops.append(expression[i])
        elif expression[i] == ')':
            while ops[-1] != '(':
                apply_op()
            ops.pop()  # Remove '('
        else:  # Operator
            while (ops and ops[-1] != '(' and
                   precedence(ops[-1]) >= precedence(expression[i])):
                apply_op()
            ops.append(expression[i])
        i += 1
    
    while ops:
        apply_op()
    
    return values[0]
```

---

### Tactic 5: Handling Unary Operators

For expressions like "-3 + 5" or "5 * -2":

```python
def handle_unary(expression):
    """
    Detect and handle unary minus.
    """
    tokens = []
    i = 0
    
    while i < len(expression):
        if expression[i] == '-':
            # Unary if: start of expression, after '(', or after another operator
            is_unary = (i == 0 or 
                       expression[i-1] == '(' or 
                       expression[i-1] in '+-*/')
            
            if is_unary:
                # Parse the number/operand as negative
                i += 1
                num = 0
                while i < len(expression) and expression[i].isdigit():
                    num = num * 10 + int(expression[i])
                    i += 1
                tokens.append(str(-num))
                continue
            else:
                tokens.append('-')
        else:
            tokens.append(expression[i])
        i += 1
    
    return tokens
```

<!-- back -->
