## String - String to Integer (atoi): Comparison with Alternatives

How does the iterative atoi approach compare to other conversion methods?

<!-- front -->

---

### Iterative Parsing vs Regex vs Built-in

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **Iterative Parsing** | O(n) | O(1) | Full control, optimal, interview standard | More code |
| **Regular Expressions** | O(n) | O(n) | Concise, readable | Extra space, regex overhead |
| **Built-in Conversion** | O(n) | O(n) | Production ready | Doesn't implement atoi logic |
| **Recursive Parsing** | O(n) | O(n) | Elegant | Stack overflow risk, slower |

---

### Approach Comparison: Code Samples

**Iterative Parsing (Recommended):**

```python
def myAtoi_iterative(s: str) -> int:
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    i, n, result, sign = 0, len(s), 0, 1
    
    while i < n and s[i] == ' ': i += 1
    if i >= n: return 0
    
    if s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    while i < n and s[i].isdigit():
        digit = int(s[i])
        if result > (INT_MAX - digit) // 10:
            return INT_MIN if sign == -1 else INT_MAX
        result = result * 10 + digit
        i += 1
    
    return sign * result
```

**Regular Expressions:**

```python
import re

def myAtoi_regex(s: str) -> int:
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    match = re.match(r'^\s*([+-]?\d+)', s)
    if not match:
        return 0
    result = int(match.group(1))
    return max(INT_MIN, min(INT_MAX, result))
```

**Built-in (not for learning):**

```python
def myAtoi_builtin(s: str) -> int:
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    try:
        # Strip whitespace, try to parse
        s = s.strip()
        i = 0
        if s[i] in '+-':
            i += 1
        # Find end of number
        while i < len(s) and s[i].isdigit():
            i += 1
        result = int(s[:i])
        return max(INT_MIN, min(INT_MAX, result))
    except:
        return 0
```

---

### When to Use Each Approach

| Scenario | Recommended Approach | Reason |
|----------|---------------------|--------|
| **Coding Interview** | Iterative Parsing | Demonstrates understanding, standard expectation |
| **Production Code** | Built-in with clamping | Most reliable, well-tested |
| **Scripting/Quick** | Regex | Concise, easy to maintain |
| **Learning/Teaching** | Iterative Parsing | Shows all edge cases and overflow handling |
| **Performance Critical** | Iterative Parsing | O(1) space, minimal overhead |

---

### Overflow Handling Comparison

| Approach | Overflow Detection | Clamp Behavior |
|----------|-------------------|----------------|
| **Iterative** | Check before operation | Explicit return INT_MAX/MIN |
| **Regex + int()** | Python handles big ints | max/min clamp |
| **Built-in** | Language dependent | Try-catch or clamp |

```python
# Iterative: Pre-check prevents overflow
if result > (INT_MAX - digit) // 10:
    return INT_MAX  # Never overflows

# Regex: Let language handle big int, then clamp
result = int(match.group(1))  # May be huge
return max(INT_MIN, min(INT_MAX, result))  # Then clamp
```

---

### Error Handling Comparison

| Error Type | Iterative | Regex | Built-in |
|------------|-----------|-------|----------|
| No digits | Returns 0 | Returns 0 | Returns 0 |
| Invalid chars | Stops at first | Stops at first | May throw |
| Multiple signs | Returns 0 | Returns 0 | May throw |
| Empty string | Returns 0 | Returns 0 | Returns 0 |

---

### Performance Benchmarks (Theoretical)

| Input Size | Iterative | Regex | Built-in |
|------------|-----------|-------|----------|
| Short (10 chars) | 1x | 2-3x | 1-1.5x |
| Medium (100 chars) | 1x | 3-5x | 1-2x |
| Long (1000 chars) | 1x | 5-10x | 2-3x |

**Note**: Iterative parsing has the best worst-case performance due to O(1) space and minimal per-character operations.

<!-- back -->
