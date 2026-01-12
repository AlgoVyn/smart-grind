# Stack - Expression Evaluation (RPN/Infix)

## Overview

The Expression Evaluation pattern uses stacks to parse and compute mathematical expressions, particularly in Reverse Polish Notation (RPN) or when converting infix notation to postfix. This approach naturally handles operator precedence and associativity, making it ideal for calculator implementations or expression parsing in compilers.

This pattern should be used when:
- Evaluating postfix (RPN) expressions
- Converting infix expressions to postfix notation
- Implementing calculators with operator precedence
- Parsing mathematical expressions in programming languages

Benefits include:
- Natural handling of operator precedence without complex parsing
- Linear time complexity for evaluation
- Can be extended to support custom operators and functions
- Memory efficient with stack-based processing

## Key Concepts

- **Reverse Polish Notation (RPN)**: Operators follow operands (e.g., "3 4 +" instead of "3 + 4")
- **Stack for Operands**: Numbers are pushed onto stack, operators pop required operands and push result
- **Operator Precedence**: Higher precedence operators are evaluated before lower ones
- **Associativity**: Left-to-right or right-to-left evaluation rules
- **Infix to Postfix Conversion**: Uses stack to reorder operators based on precedence

## Template

```python
def eval_rpn(tokens):
    # Stack to hold operands
    stack = []
    
    for token in tokens:
        if token in '+-*/':
            # Pop two operands for binary operation
            b = stack.pop()
            a = stack.pop()
            
            # Perform operation based on operator
            if token == '+':
                result = a + b
            elif token == '-':
                result = a - b
            elif token == '*':
                result = a * b
            elif token == '/':
                # Integer division towards zero
                result = int(a / b)
            
            # Push result back to stack
            stack.append(result)
        else:
            # Token is a number, convert to int and push
            stack.append(int(token))
    
    # Final result is the only element left in stack
    return stack[0]
```

## Example Problems

1. **Evaluate Reverse Polish Notation** (LeetCode 150): Evaluate the value of an arithmetic expression in Reverse Polish Notation.
2. **Basic Calculator II** (LeetCode 227): Implement a basic calculator to evaluate a simple expression string with +, -, *, / operators.
3. **Different Ways to Add Parentheses** (LeetCode 241): Given a string expression with numbers and operators, find all possible results by adding parentheses.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of tokens in the expression
- **Space Complexity**: O(n) for the stack in worst case

## Common Pitfalls

- Not handling integer division correctly (towards zero vs floor division)
- Forgetting to handle negative numbers or multi-digit numbers
- Incorrect operator precedence in infix to postfix conversion
- Not checking for division by zero
- Assuming single-digit numbers when expressions can have larger integers
- Edge cases: empty expressions, single operand, consecutive operators