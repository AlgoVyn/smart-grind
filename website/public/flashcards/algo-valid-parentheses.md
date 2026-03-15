## Valid Parentheses

**Question:** How do you check if a string of brackets is valid?

<!-- front -->

---

## Answer: Stack Solution

### Algorithm
```python
def isValid(s):
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in mapping:
            # Closing bracket
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            # Opening bracket
            stack.append(char)
    
    return len(stack) == 0
```

### Visual
```
Input: "([{}])"

Step 1: '(' → stack: ['(']
Step 2: '[' → stack: ['(', '[']
Step 3: '{' → stack: ['(', '[', '{']
Step 4: '}' → matches '{', pop → stack: ['(', '[']
Step 5: ']' → matches '[', pop → stack: ['(']
Step 6: ')' → matches '(', pop → stack: []

Result: Valid ✓
```

### Complexity
- **Time:** O(n)
- **Space:** O(n) worst case

### Edge Cases
- Empty string → True
- Single character → False
- Unmatched opening → False
- Unmatched closing → False

### ⚠️ Key Points
- Only closing brackets check the stack
- Stack should be empty at end
- Use a mapping for closing → opening

<!-- back -->
