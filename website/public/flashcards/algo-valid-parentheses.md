## Valid Parentheses

**Question:** Check if parentheses string is valid?

<!-- front -->

---

## Answer: Stack

### Solution
```python
def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
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

### Visual: Stack Operations
```
s = "([{}])"

Step 1: '(' → stack=['(']
Step 2: '[' → stack=['(', '[']
Step 3: '{' → stack=['(', '[', '{']
Step 4: '}' → stack.pop()='{' ✓ → stack=['(', '[']
Step 5: ']' → stack.pop()='[' ✓ → stack=['(']
Step 6: ')' → stack.pop()='(' ✓ → stack=[]

Return: True

s = "([)]"

Step 1: '(' → stack=['(']
Step 2: '[' → stack=['(', '[']
Step 3: ')' → stack.pop()='[' but expected '(' ✗

Return: False
```

### ⚠️ Tricky Parts

#### 1. Only Check Closing Brackets
```python
# When encountering closing bracket:
# - Check stack not empty
# - Pop and compare with expected

# When encountering opening bracket:
# - Just push to stack
```

#### 2. Why Mapping from Closing
```python
# mapping = {')': '(', '}': '{', ']': '['}
# 
# This makes lookup efficient:
# - If char in mapping → it's closing
# - mapping[char] → expected opening
```

#### 3. Alternative: Single Pass
```python
# Some use replace but inefficient:
# while "()" in s: s = s.replace("()", "")
# while "{}" in s: s = s.replace("{}", "")
# while "[]" in s: s = s.replace("[]", "")
# return len(s) == 0

# Not O(n) - each replace is O(n)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Stack | O(n) | O(n) |
| Replace | O(n²) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Empty stack | Check stack before pop |
| Wrong mapping | Map closing to opening |
| Not checking end | Stack must be empty |

<!-- back -->
