## Roman to Integer: Comparison

How do the different approaches to Roman to Integer conversion compare?

<!-- front -->

---

### Approach Comparison Matrix

| Approach | Time | Space | Code Length | Intuitiveness | Best For |
|----------|------|-------|-------------|---------------|----------|
| **Right-to-Left** | O(n) | O(1) | Short | Medium | **Interviews - most elegant** |
| **Pattern Matching** | O(n) | O(1) | Medium | High | Explicit logic, clarity |
| **Conditional Logic** | O(n) | O(1) | Long | High | Language-native style |

---

### Approach 1: Right-to-Left Processing

```python
def roman_to_int_rtl(s):
    values = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}
    total = prev = 0
    for c in reversed(s):
        curr = values[c]
        total += curr if curr >= prev else -curr
        prev = curr
    return total
```

**Pros:**
- Shortest, most elegant code
- No lookahead/boundary checks
- Single loop, minimal operations

**Cons:**
- Right-to-left less intuitive
- Magic "compare with prev" trick needs explanation

---

### Approach 2: Pattern Matching

```python
def roman_to_int_pattern(s):
    values = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}
    subtractive = {'IV':4, 'IX':9, 'XL':40, 'XC':90, 'CD':400, 'CM':900}
    total, i = 0, 0
    while i < len(s):
        if i+1 < len(s) and s[i:i+2] in subtractive:
            total += subtractive[s[i:i+2]]
            i += 2
        else:
            total += values[s[i]]
            i += 1
    return total
```

**Pros:**
- Explicit about all subtractive pairs
- Natural left-to-right reading
- Easy to extend for validation

**Cons:**
- More code
- Substring operations
- Two lookup tables to maintain

---

### Approach 3: Conditional Logic

```python
def roman_to_int_conditional(s):
    total, i = 0, 0
    while i < len(s):
        if s[i] == 'I':
            if i+1 < len(s) and s[i+1] in ['V', 'X']:
                total += 4 if s[i+1] == 'V' else 9
                i += 2
            else:
                total += 1; i += 1
        # ... similar for X, C, V, L, D, M
    return total
```

**Pros:**
- Very explicit, easy to trace
- No dictionary overhead
- Language-native switch/case works well

**Cons:**
- Most verbose
- Repetitive code structure
- Harder to maintain

---

### When to Choose Each

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| **Coding interview** | Right-to-Left | Impresses with elegance |
| **Code review/team** | Pattern Matching | Most readable, explicit |
| **Performance critical** | Conditional Logic | No hash lookups |
| **Teaching beginners** | Pattern Matching | Rules are explicit |
| **Quick implementation** | Right-to-Left | Fewest lines to write |

---

### Memory Usage Comparison

| Approach | Additional Memory | Notes |
|----------|-------------------|-------|
| Right-to-Left | O(1) - 2 variables | `total`, `prev` |
| Pattern Matching | O(1) - 2 dicts + index | Small fixed-size dicts |
| Conditional | O(1) - 2 variables | `total`, `i` |

All approaches use constant space regardless of input size.

---

### Execution Step Count (n = string length)

| Approach | Approx Steps | Breakdown |
|----------|--------------|-----------|
| Right-to-Left | ~2n | n lookups + n comparisons |
| Pattern Matching | ~2n to 3n | n/2 substring checks + lookups |
| Conditional | ~3n | n char checks + nested conditions |

**Winner:** Right-to-Left has lowest constant factor.

---

### Interview Recommendation

> **Start with Pattern Matching** if you're unsure, then mention you can optimize to Right-to-Left.

**Why:**
1. Pattern matching shows you understand the problem deeply
2. It's easier to explain step-by-step
3. Then demonstrate knowledge: "We can make this more elegant by processing right-to-left..."
4. This shows both understanding and optimization skill

<!-- back -->
