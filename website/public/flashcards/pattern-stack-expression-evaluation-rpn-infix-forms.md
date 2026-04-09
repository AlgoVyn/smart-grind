## Stack Expression Evaluation: Forms & Variations

What are different forms and variations of stack-based expression evaluation?

<!-- front -->

---

### Form 1: Pure RPN (Postfix) Evaluation

Input is already in postfix notation:

```python
# Example: ["2", "1", "+", "3", "*"] → (2 + 1) * 3 = 9
def eval_rpn(tokens):
    stack = []
    for token in tokens:
        if token in '+-*/':
            b, a = stack.pop(), stack.pop()
            stack.append(apply_op(a, b, token))
        else:
            stack.append(int(token))
    return stack[0]
```

**Applies to**: LeetCode 150, postfix calculators

---

### Form 2: Infix with Basic Operators

Standard calculator without parentheses:

```python
# Example: "3+5*2-8/4" → 3 + 10 - 2 = 11
def calculate_basic(s: str) -> int:
    """
    Infix with +, -, *, /.
    No parentheses, left-to-right within precedence.
    """
    num, stack, sign = 0, [], '+'
    
    for i, c in enumerate(s + '+'):  # Sentinel at end
        if c.isdigit():
            num = num * 10 + int(c)
        elif c in '+-*/':
            if sign == '+':
                stack.append(num)
            elif sign == '-':
                stack.append(-num)
            elif sign == '*':
                stack.append(stack.pop() * num)
            else:  # '/'
                stack.append(int(stack.pop() / num))
            num, sign = 0, c
    
    return sum(stack)
```

**Applies to**: LeetCode 227 (Basic Calculator II)

---

### Form 3: Infix with Parentheses

Full expression with nested parentheses:

```python
# Example: "(1+(4+5+2)-3)+(6+8)" → 23
def calculate_with_parens(s: str) -> int:
    """
    Handle nested parentheses via recursive evaluation
    or explicit stack management.
    """
    def evaluate(i):
        total, num, sign = 0, 0, 1
        
        while i < len(s):
            c = s[i]
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == '+':
                total += sign * num
                num, sign = 0, 1
            elif c == '-':
                total += sign * num
                num, sign = 0, -1
            elif c == '(':
                subtotal, i = evaluate(i + 1)
                num = subtotal
            elif c == ')':
                total += sign * num
                return total, i
            i += 1
        
        return total + sign * num
    
    return evaluate(0)
```

**Applies to**: LeetCode 224 (Basic Calculator)

---

### Form 4: Expression with Variables

Evaluate with variable substitution:

```python
def eval_with_variables(expression, variables):
    """
    expression: ['x', 'y', '+', '2', '*']
    variables: {'x': 3, 'y': 5}
    Result: (3 + 5) * 2 = 16
    """
    stack = []
    
    for token in expression:
        if token in '+-*/':
            b, a = stack.pop(), stack.pop()
            stack.append(apply_op(a, b, token))
        elif token in variables:
            stack.append(variables[token])
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

### Form 5: String Decoding (Nested Structure)

Decode string with repetition patterns:

```python
# Example: "3[a2[c]]" → "accaccacc"
def decode_string(s: str) -> str:
    """
    Use two stacks: one for counts, one for strings.
    '[' pushes current state, ']' pops and builds.
    """
    count_stack, string_stack = [], []
    current_string, current_num = '', 0
    
    for c in s:
        if c.isdigit():
            current_num = current_num * 10 + int(c)
        elif c == '[':
            count_stack.append(current_num)
            string_stack.append(current_string)
            current_num, current_string = 0, ''
        elif c == ']':
            repeat = count_stack.pop()
            prev_string = string_stack.pop()
            current_string = prev_string + current_string * repeat
        else:
            current_string += c
    
    return current_string
```

**Applies to**: LeetCode 394 (Decode String)

<!-- back -->
