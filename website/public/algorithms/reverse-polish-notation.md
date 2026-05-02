# Reverse Polish Notation (RPN)

## Category
Stacks & Expression Evaluation

## Description

Reverse Polish Notation (RPN), also known as postfix notation, is a mathematical notation where operators follow their operands. This eliminates the need for parentheses and makes expression evaluation straightforward using a stack-based approach.

Developed by Australian philosopher and computer scientist Charles Hamblin in the 1950s, RPN was inspired by Polish mathematician Jan Łukasiewicz's prefix notation. RPN became widely known through Hewlett-Packard calculators and the Forth programming language. The notation's simplicity and efficiency have made it popular in compiler design, calculator implementations, and stack-based virtual machines.

---

## Concepts

RPN evaluation relies on fundamental stack operations and expression parsing concepts.

### 1. Notation Types

| Notation | Example | Order |
|----------|---------|-------|
| **Infix** | 3 + 4 × 2 | Operator between operands |
| **Prefix (Polish)** | + 3 × 4 2 | Operator before operands |
| **Postfix (RPN)** | 3 4 2 × + | Operator after operands |

### 2. Stack Operations for RPN

| Operation | Stack Before | Stack After | Description |
|-----------|--------------|-------------|-------------|
| **Push number** | [..] | [.., n] | Operand pushed onto stack |
| **Apply operator** | [.., a, b] | [.., result] | Pop 2, apply, push result |
| **Final result** | [result] | [result] | Single value remains |

### 3. Operator Precedence (Infix only)

In RPN, precedence is implicit in the order:

| Precedence | Infix Operators | RPN Equivalent |
|------------|-----------------|----------------|
| **Highest** | Parentheses () | Not needed |
| **High** | ^ (exponent) | Natural order |
| **Medium** | ×, / | Natural order |
| **Low** | +, - | Natural order |

### 4. Shunting Yard Algorithm

Dijkstra's algorithm for converting infix to RPN:

| Token | Action |
|-------|--------|
| **Number** | Add to output |
| **Operator** | Pop higher/equal precedence ops to output, push current |
| **Left paren** | Push to stack |
| **Right paren** | Pop to output until left paren |

---

## Frameworks

Structured approaches for RPN problems.

### Framework 1: RPN Evaluation

```
┌─────────────────────────────────────────────────────────────┐
│  RPN EXPRESSION EVALUATION                                   │
├─────────────────────────────────────────────────────────────┤
│  Input: List of tokens (numbers or operators)               │
│  Output: Numeric result                                      │
│                                                              │
│  1. Initialize empty stack                                  │
│  2. For each token in expression:                         │
│     a. If token is a number:                                │
│        - Push to stack                                      │
│     b. If token is an operator:                             │
│        - Pop right operand (top of stack)                 │
│        - Pop left operand (new top)                       │
│        - Compute: left op right                           │
│        - Push result to stack                               │
│  3. Return stack[0] (should be only element)                │
│                                                              │
│  Operators: +, -, *, / (integer division toward zero)       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard RPN expression evaluation.

### Framework 2: Infix to RPN Conversion (Shunting Yard)

```
┌─────────────────────────────────────────────────────────────┐
│  SHUNTING YARD ALGORITHM                                     │
├─────────────────────────────────────────────────────────────┤
│  Input: Infix expression string                              │
│  Output: RPN token list                                      │
│                                                              │
│  1. Initialize: output = [], stack = []                     │
│  2. For each token:                                         │
│     a. If number: append to output                          │
│     b. If '(': push to stack                                │
│     c. If ')': pop from stack to output until '('          │
│     d. If operator:                                         │
│        - While stack has operator with >= precedence:     │
│          * Pop to output                                    │
│        - Push current operator to stack                     │
│  3. Pop remaining operators to output                       │
│  4. Return output                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Converting infix expressions to RPN.

### Framework 3: Direct Infix Evaluation (Two-Stack)

```
┌─────────────────────────────────────────────────────────────┐
│  INFIX EVALUATION WITH TWO STACKS                           │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: values = [], operators = []                │
│  2. For each token:                                         │
│     a. If number: push to values                            │
│     b. If '(': push to operators                            │
│     c. If ')': apply operators until '('                    │
│     d. If operator: apply previous operators with >= prec   │
│        then push current                                    │
│  3. Apply remaining operators                               │
│  4. Return values[0]                                         │
│                                                              │
│  apply_op(): pop 2 values, pop operator, compute, push    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Evaluating infix without conversion to RPN.

---

## Forms

Different manifestations of RPN and expression evaluation.

### Form 1: Standard RPN

Basic postfix notation evaluation.

| Aspect | Details |
|--------|---------|
| **Input** | List of tokens |
| **Operators** | Binary operators only |
| **Evaluation** | Single left-to-right pass |
| **Stack depth** | At most number of operands |

### Form 2: RPN with Variables

Extended with variable support.

| Aspect | Details |
|--------|---------|
| **Input** | Tokens with variable names |
| **Preprocessing** | Variable lookup before push |
| **Use case** | Calculator with memory |

### Form 3: Function Calls in RPN

Supporting unary and n-ary functions.

| Aspect | Details |
|--------|---------|
| **Input** | Functions like sin, max |
| **Stack pop** | Pop function arity number of operands |
| **Example** | "5 sin" or "3 4 5 max" |

### Form 4: Bitwise RPN

RPN for bitwise operations.

| Aspect | Details |
|--------|---------|
| **Operators** | &, \|, ^, ~, <<, >> |
| **Use case** | Low-level computation |
| **Evaluation** | Same stack-based approach |

---

## Tactics

Specific techniques for RPN problems.

### Tactic 1: Basic RPN Evaluation

Standard stack-based evaluation:

```python
def eval_rpn(tokens):
    """
    Evaluate Reverse Polish Notation expression.
    Tokens are strings: numbers or operators (+, -, *, /).
    """
    stack = []
    
    for token in tokens:
        if token in '+-*/':
            # Pop two operands (right operand first)
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                # Integer division toward zero
                stack.append(int(a / b))
        else:
            # Number
            stack.append(int(token))
    
    return stack[0]
```

**Key point**: Pop right operand first (b), then left (a), because of stack LIFO order.

### Tactic 2: Infix to Postfix Conversion

Shunting Yard algorithm:

```python
def infix_to_postfix(expression):
    """
    Convert infix expression to postfix (RPN).
    Dijkstra's Shunting Yard algorithm.
    """
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    
    output = []
    stack = []
    
    i = 0
    while i < len(expression):
        char = expression[i]
        
        if char.isdigit():
            # Parse number
            num = ''
            while i < len(expression) and expression[i].isdigit():
                num += expression[i]
                i += 1
            output.append(num)
            continue
        
        elif char == '(':
            stack.append(char)
        
        elif char == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()  # Remove '('
        
        elif char in precedence:
            while (stack and stack[-1] != '(' and
                   precedence.get(stack[-1], 0) >= precedence[char]):
                output.append(stack.pop())
            stack.append(char)
        
        i += 1
    
    # Pop remaining operators
    while stack:
        output.append(stack.pop())
    
    return output
```

**Note**: Handles multi-digit numbers and operator precedence.

### Tactic 3: Infix Direct Evaluation

Two-stack approach:

```python
def evaluate_infix(expression):
    """Evaluate infix expression using two stacks."""
    def apply_op(operators, values):
        op = operators.pop()
        b = values.pop()
        a = values.pop()
        if op == '+':
            values.append(a + b)
        elif op == '-':
            values.append(a - b)
        elif op == '*':
            values.append(a * b)
        elif op == '/':
            values.append(int(a / b))
    
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    
    values = []
    operators = []
    
    i = 0
    while i < len(expression):
        if expression[i] == ' ':
            i += 1
            continue
        
        if expression[i].isdigit():
            num = 0
            while i < len(expression) and expression[i].isdigit():
                num = num * 10 + int(expression[i])
                i += 1
            values.append(num)
            continue
        
        elif expression[i] == '(':
            operators.append(expression[i])
        
        elif expression[i] == ')':
            while operators and operators[-1] != '(':
                apply_op(operators, values)
            operators.pop()  # Remove '('
        
        else:  # Operator
            while (operators and operators[-1] != '(' and
                   precedence[operators[-1]] >= precedence[expression[i]]):
                apply_op(operators, values)
            operators.append(expression[i])
        
        i += 1
    
    while operators:
        apply_op(operators, values)
    
    return values[0]
```

**Use case**: When you need to evaluate without explicit conversion.

### Tactic 4: Handling Division

Important edge case for integer division:

```python
def safe_divide(a, b):
    """
    Integer division toward zero (LeetCode style).
    Python's // truncates toward negative infinity,
    but we need truncation toward zero.
    """
    return int(a / b)  # Convert to float then int
```

**Critical**: Different languages handle integer division differently!

### Tactic 5: Extended RPN with More Operators

Support for additional operations:

```python
def eval_rpn_extended(tokens):
    """
    Extended RPN with power, modulo, etc.
    """
    stack = []
    
    for token in tokens:
        if token == '+':
            stack.append(stack.pop() + stack.pop())
        elif token == '-':
            b, a = stack.pop(), stack.pop()
            stack.append(a - b)
        elif token == '*':
            stack.append(stack.pop() * stack.pop())
        elif token == '/':
            b, a = stack.pop(), stack.pop()
            stack.append(int(a / b))
        elif token == '^':
            b, a = stack.pop(), stack.pop()
            stack.append(a ** b)
        elif token == '%':
            b, a = stack.pop(), stack.pop()
            stack.append(a % b)
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

## Python Templates

### Template 1: Basic RPN Evaluator

```python
from typing import List


def eval_rpn(tokens: List[str]) -> int:
    """
    Evaluate Reverse Polish Notation expression.
    
    Args:
        tokens: List of tokens (numbers or operators: +, -, *, /)
    
    Returns:
        Integer result of the expression
    
    Time: O(n) where n is number of tokens
    Space: O(n) for stack
    """
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in operators:
            # Pop two operands (right first due to stack order)
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                # Integer division toward zero
                stack.append(int(a / b))
        else:
            # Push number to stack
            stack.append(int(token))
    
    return stack[0]
```

### Template 2: Infix to RPN Converter

```python
def infix_to_rpn(expression: str) -> List[str]:
    """
    Convert infix expression to RPN using Shunting Yard algorithm.
    
    Args:
        expression: Infix expression string with +, -, *, /, (, )
    
    Returns:
        List of tokens in RPN order
    """
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    output = []
    stack = []
    
    i = 0
    while i < len(expression):
        char = expression[i]
        
        if char.isdigit():
            # Parse multi-digit number
            num = ''
            while i < len(expression) and expression[i].isdigit():
                num += expression[i]
                i += 1
            output.append(num)
            continue
        
        elif char == '(':
            stack.append(char)
        
        elif char == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()  # Remove '('
        
        elif char in precedence:
            while (stack and stack[-1] != '(' and
                   precedence.get(stack[-1], 0) >= precedence[char]):
                output.append(stack.pop())
            stack.append(char)
        
        i += 1
    
    # Pop remaining operators
    while stack:
        output.append(stack.pop())
    
    return output
```

### Template 3: Direct Infix Evaluator

```python
def evaluate_infix(expression: str) -> int:
    """
    Evaluate infix expression directly using two stacks.
    
    Args:
        expression: Infix expression with +, -, *, /, (, )
    
    Returns:
        Integer result
    """
    def apply_operator(operators, values):
        op = operators.pop()
        b = values.pop()
        a = values.pop()
        
        if op == '+':
            values.append(a + b)
        elif op == '-':
            values.append(a - b)
        elif op == '*':
            values.append(a * b)
        elif op == '/':
            values.append(int(a / b))
    
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    values = []
    operators = []
    
    i = 0
    while i < len(expression):
        if expression[i].isspace():
            i += 1
            continue
        
        if expression[i].isdigit():
            num = 0
            while i < len(expression) and expression[i].isdigit():
                num = num * 10 + int(expression[i])
                i += 1
            values.append(num)
            continue
        
        elif expression[i] == '(':
            operators.append('(')
        
        elif expression[i] == ')':
            while operators and operators[-1] != '(':
                apply_operator(operators, values)
            operators.pop()  # Remove '('
        
        else:  # Operator
            while (operators and operators[-1] != '(' and
                   precedence[operators[-1]] >= precedence[expression[i]]):
                apply_operator(operators, values)
            operators.append(expression[i])
        
        i += 1
    
    while operators:
        apply_operator(operators, values)
    
    return values[0]
```

### Template 4: RPN Validator

```python
def is_valid_rpn(tokens: List[str]) -> bool:
    """
    Check if RPN expression is valid (can be evaluated).
    
    Returns True if valid, False otherwise.
    """
    stack_size = 0
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in operators:
            # Need two operands
            if stack_size < 2:
                return False
            stack_size -= 1  # Pop 2, push 1: net -1
        else:
            stack_size += 1
    
    return stack_size == 1
```

---

## When to Use

Use RPN when you need to solve problems involving:

- **Expression evaluation**: Without repeated parentheses parsing
- **Calculator implementations**: Hardware or software calculators
- **Compiler design**: Intermediate representation
- **Stack-based VMs**: Java bytecode, Forth language, WebAssembly
- **Parsing efficiency**: Single-pass left-to-right evaluation

### Comparison of Notations

| Notation | Need Parentheses | Evaluation | Use Case |
|------------|------------------|------------|----------|
| **Infix** | Yes | Complex | Human-readable |
| **Prefix** | No | Right-to-left | Lisp languages |
| **Postfix (RPN)** | No | Left-to-right | Stack machines |

### When to Choose RPN

- **Choose RPN** when:
  - Implementing stack-based calculators
  - Designing compiler intermediate representations
  - Need simple, efficient evaluation
  - Implementing expression parsers

- **Choose Infix** when:
  - Human readability is primary concern
  - User-facing input interfaces
  - Teaching mathematical concepts

---

## Algorithm Explanation

### Core Concept

RPN evaluation uses a stack to defer operations until both operands are available. When we encounter an operator, we know its operands are already on the stack (they appeared earlier), so we can immediately compute and push the result.

### How RPN Eliminates Parentheses

**Infix**: 3 + 4 × 2 needs parentheses clarification: 3 + (4 × 2)

**RPN**: 3 4 2 × +
- Push 3, push 4, push 2
- Encounter ×: pop 2 and 4, compute 4 × 2 = 8, push 8
- Stack: [3, 8]
- Encounter +: pop 8 and 3, compute 3 + 8 = 11, push 11
- Result: 11 ✓

The order of tokens encodes the operation precedence implicitly.

### Visual Walkthrough

**Example**: Evaluate "2 1 + 3 ×"

```
Step 1: Token "2"
Stack: [2]

Step 2: Token "1"
Stack: [2, 1]

Step 3: Token "+"
Pop 1, pop 2
Compute 2 + 1 = 3
Push 3
Stack: [3]

Step 4: Token "3"
Stack: [3, 3]

Step 5: Token "×"
Pop 3, pop 3
Compute 3 × 3 = 9
Push 9
Stack: [9]

Result: 9 ✓
```

### Operator Precedence in Shunting Yard

When converting infix to RPN, operators are output based on precedence:
- Higher precedence operators (×, /) are output before lower (+, -)
- Parentheses override precedence and are handled via stack

---

## Practice Problems

### Problem 1: Evaluate Reverse Polish Notation

**Problem:** [LeetCode 150 - Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)

**Description:** Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /. Each operand may be an integer or another expression.

**How to Apply:**
- Use stack-based evaluation
- Push numbers, apply operators
- Handle integer division toward zero

---

### Problem 2: Basic Calculator

**Problem:** [LeetCode 224 - Basic Calculator](https://leetcode.com/problems/basic-calculator/)

**Description:** Given a string s representing a valid expression, implement a basic calculator to evaluate it.

**How to Apply:**
- Convert infix to RPN first (Shunting Yard)
- Then evaluate RPN
- Or use two-stack direct evaluation

---

### Problem 3: Basic Calculator II

**Problem:** [LeetCode 227 - Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/)

**Description:** Given a string s which represents an expression, evaluate this expression.

**How to Apply:**
- Similar to Basic Calculator
- Handle +, -, *, / with operator precedence
- Shunting Yard or direct two-stack approach

---

## Video Tutorial Links

### Fundamentals

- [Reverse Polish Notation Explained](https://www.youtube.com/watch?v=7ha78yWRDlE) - Complete explanation
- [Shunting Yard Algorithm](https://www.youtube.com/watch?v=86c1oX2ejTQ) - Infix to postfix
- [Stack-Based Evaluation](https://www.youtube.com/watch?v=iuO0T5-9C6o) - Algorithm visualization

### Problem Solutions

- [LeetCode 150 Solution](https://www.youtube.com/watch?v=1egjUY8YZLs) - RPN Evaluation
- [LeetCode 224 Solution](https://www.youtube.com/watch?v=4RiXh7gR3gE) - Basic Calculator
- [Expression Parsing](https://www.youtube.com/watch?v=d0r3S5i4_aQ) - Comprehensive parsing

---

## Follow-up Questions

### Q1: Why is RPN easier to evaluate than infix?

**Answer**: RPN eliminates the need for parentheses and precedence rules. Operators always follow their operands, so when we encounter an operator, we know exactly which two values to apply it to (they're on top of the stack). Infix requires complex parsing to handle precedence and parentheses.

### Q2: Can RPN handle unary operators?

**Answer**: Yes! Unary operators like negation or factorial are handled by popping only one operand instead of two. For example, "5 !" or "3 -" (negate 3). The same stack-based approach works with unary operators popping one value.

### Q3: How does integer division "toward zero" differ from standard integer division?

**Answer**: 
- Standard Python `//` truncates toward negative infinity: `-3 // 2 = -2`
- Toward zero: `-3 / 2 = -1.5 → int(-1.5) = -1`
- For positive numbers, both are the same
- For negative numbers, toward zero gives the result closer to zero

### Q4: Can RPN represent any expression that infix can?

**Answer**: Yes, any infix expression has an equivalent RPN form. The Shunting Yard algorithm can convert any valid infix expression to RPN. RPN is Turing-complete and can represent all arithmetic, logical, and functional expressions.

### Q5: Why do some calculators use RPN?

**Answer**: HP calculators popularized RPN because:
- No need for parentheses buttons
- Fewer keystrokes for complex expressions
- Natural fit with stack-based computing
- Immediate feedback as each operation completes
- More efficient to implement in hardware

---

## Summary

Reverse Polish Notation provides an elegant, stack-based approach to expression evaluation that eliminates the need for parentheses and complex precedence rules. Its simplicity makes it ideal for calculator implementations, compiler design, and stack-based virtual machines.

**Key Takeaways:**

1. **No Parentheses**: Order of operations is explicit in token sequence
2. **Single Pass**: Left-to-right evaluation with O(n) complexity
3. **Stack-Based**: Natural fit for LIFO data structures
4. **Shunting Yard**: Efficient infix-to-postfix conversion
5. **Hardware Friendly**: Easy to implement in calculator/CPU design

**When to Use:**
- Expression evaluation systems
- Calculator implementations
- Compiler intermediate representations
- Stack-based virtual machines
- Anywhere parsing efficiency matters

RPN demonstrates how a simple change in notation can dramatically simplify algorithmic complexity, turning a parsing problem into a straightforward stack operation.
