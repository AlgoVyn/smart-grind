## Evaluate Reverse Polish Notation

**Question:** Evaluate expression in RPN (postfix) notation?

<!-- front -->

---

## Answer: Stack-Based Evaluation

### Solution
```python
def evalRPN(tokens):
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in operators:
            b = stack.pop()  # Second operand
            a = stack.pop()  # First operand
            
            if token == '+':
                result = a + b
            elif token == '-':
                result = a - b
            elif token == '*':
                result = a * b
            else:
                # Truncate toward zero
                result = int(a / b)
            
            stack.append(result)
        else:
            stack.append(int(token))
    
    return stack[0]
```

### Visual: RPN Evaluation
```
Tokens: ["2", "1", "+", "3", "*"]

Step 1: "2" → stack: [2]
Step 2: "1" → stack: [2, 1]
Step 3: "+" → 2+1=3 → stack: [3]
Step 4: "3" → stack: [3, 3]
Step 5: "*" → 3*3=9 → stack: [9]

Result: 9
```

### ⚠️ Tricky Parts

#### 1. Operand Order
```python
# Stack: [..., a, b]
# Operator: a OP b

# For "a - b":
# b = stack.pop()  ← last
# a = stack.pop()  ← first
# result = a - b
```

#### 2. Integer Division in Python
```python
# Python: -3 // 2 = -2 (floor)
# Problem wants: int(-3/2) = -1 (truncate toward zero)

# Fix: int(a / b)
# Or: a // b if both positive, else math.trunc
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Stack | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong operand order | Pop in correct order |
| Python floor division | Use int(a / b) |
| Not converting to int | Convert string tokens |

<!-- back -->
