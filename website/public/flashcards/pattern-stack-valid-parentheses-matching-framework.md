## Stack - Valid Parentheses: Framework

What is the complete code template for solving valid parentheses problems?

<!-- front -->

---

### Framework: Valid Parentheses

```
┌─────────────────────────────────────────────────────────────┐
│  VALID PARENTHESES PATTERN - TEMPLATE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Last opened bracket must be closed first      │
│                                                             │
│  1. Create bracket mapping (closing → opening):             │
│     bracket_map = {')': '(', '}': '{', ']': '['}            │
│                                                             │
│  2. Initialize empty stack                                  │
│     stack = []                                              │
│                                                             │
│  3. Iterate through each character:                         │
│     - If closing bracket:                                     │
│         * Check if stack empty → invalid                    │
│         * Pop and check match with bracket_map[char]        │
│         * If no match → invalid                             │
│     - If opening bracket:                                   │
│         * Push onto stack                                     │
│                                                             │
│  4. Final validation:                                       │
│     - Return true if stack is empty                         │
│     - Stack not empty → unmatched opening brackets          │
└─────────────────────────────────────────────────────────────┘
```

---

### Core Implementation

```python
def is_valid(s: str) -> bool:
    """
    Check if string has valid parentheses matching.
    LeetCode 20 - Valid Parentheses
    Time: O(n), Space: O(n)
    """
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in bracket_map:
            # Closing bracket - check for match
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        else:
            # Opening bracket
            stack.append(char)
    
    return not stack
```

---

### Multi-Language Template

```python
# Python
bracket_map = {')': '(', '}': '{', ']': '['}
stack = []
for char in s:
    if char in bracket_map:  # Closing
        if not stack or stack[-1] != bracket_map[char]:
            return False
        stack.pop()
    else:  # Opening
        stack.append(char)
return not stack
```

```cpp
// C++
unordered_map<char, char> bracketMap = {{')', '('}, {'}', '{'}, {']', '['}};
stack<char> st;
for (char c : s) {
    if (bracketMap.count(c)) {
        if (st.empty() || st.top() != bracketMap[c]) return false;
        st.pop();
    } else {
        st.push(c);
    }
}
return st.empty();
```

```java
// Java
Map<Character, Character> bracketMap = Map.of(')', '(', '}', '{', ']', '[');
Stack<Character> stack = new Stack<>();
for (char c : s.toCharArray()) {
    if (bracketMap.containsKey(c)) {
        if (stack.isEmpty() || stack.peek() != bracketMap.get(c)) return false;
        stack.pop();
    } else {
        stack.push(c);
    }
}
return stack.isEmpty();
```

---

### Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `bracket_map` | O(1) lookup for matching pairs | `{')': '('}` |
| `stack` | Track unmatched opening brackets | `['(', '{']` |
| `char in bracket_map` | Check if closing bracket | `')' in map` |
| `stack[-1]` | Peek at most recent opening | Top of stack |
| `not stack` | Check if stack empty | Final validation |

---

### Flow Diagram

```
Input: "()[]{}"

Step 1: '(' → Opening → Stack: ['(']
Step 2: ')' → Closing → Matches '(' → Stack: []
Step 3: '[' → Opening → Stack: ['[']
Step 4: ']' → Closing → Matches '[' → Stack: []
Step 5: '{' → Opening → Stack: ['{']
Step 6: '}' → Closing → Matches '{' → Stack: []

Final: Stack empty → Return True ✓
```

<!-- back -->
