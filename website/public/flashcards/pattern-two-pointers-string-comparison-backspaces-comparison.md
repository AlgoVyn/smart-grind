## Two Pointers - String Comparison with Backspaces: Comparison

When should you use the O(1) space approach versus building the string?

<!-- front -->

---

### O(1) Space vs O(n) Space Approach

| Aspect | Two Pointers (O(1) space) | Stack Build (O(n) space) |
|--------|---------------------------|--------------------------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(n) |
| **Code complexity** | Higher | Lower |
| **Readability** | Moderate | High |
| **Interview preference** | Optimal solution | Good for clarity |

**Winner**: O(1) space for interviews if asked for optimal, otherwise either works

---

### Two Pointers vs Stack

**Two Pointers Advantage**:
- No extra memory allocation
- Single pass conceptually
- Elegant mathematical approach

**Stack Build Advantage**:
- Easier to understand and debug
- Natural simulation of backspace
- Can return processed string

```python
# Stack approach - intuitive
def build_stack(string):
    stack = []
    for c in string:
        if c == '#':
            if stack:
                stack.pop()
        else:
            stack.append(c)
    return stack
```

---

### When to Use Each Approach

**Use Two Pointers when**:
- Space complexity is constrained
- Large strings (memory concerns)
- Streaming/online processing
- Asked for optimal solution

**Use Stack Build when**:
- Code clarity is priority
- Need the final processed string
- Small to medium inputs
- Quick implementation needed

---

### Comparison with Other String Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Two Pointers (backspace)** | O(n) | O(1) | Backspace processing |
| **Stack simulation** | O(n) | O(n) | Sequential operations |
| **Two Pointers (palindrome)** | O(n) | O(1) | Palindrome check |
| **Sliding Window** | O(n) | O(k) | Substring matching |
| **KMP/Rabin-Karp** | O(n) | O(m) | Pattern matching |

---

### Decision Tree

```
String has backspace/undo operations?
├── Yes → Need final string?
│   ├── Yes → STACK BUILD
│   └── No → Space constrained?
│       ├── Yes → TWO POINTERS
│       └── No → Either approach works
└── No → Different pattern needed
```

---

### Key Trade-offs

| Consideration | O(1) Space Wins | O(n) Space Wins |
|-------------|-----------------|-----------------|
| Memory limit | ✓ | - |
| Code review clarity | - | ✓ |
| Debugging ease | - | ✓ |
| Teaching/learning | - | ✓ |
| Large-scale production | ✓ | - |

<!-- back -->
