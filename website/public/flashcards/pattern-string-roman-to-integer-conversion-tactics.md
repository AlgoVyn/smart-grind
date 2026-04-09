## Roman to Integer: Tactics

What are practical tactics for solving Roman to Integer problems efficiently?

<!-- front -->

---

### Tactic 1: Quick Symbol Value Recall

**Memorize the mapping pattern:**

```
I=1    V=5    X=10
L=50   C=100  D=500  M=1000

Pattern: 1-5-10 repeated by powers of 10:
  1s group: I(1), V(5), X(10)
  10s group: X(10), L(50), C(100)  
  100s group: C(100), D(500), M(1000)
```

---

### Tactic 2: Subtractive Pair Detection Strategy

**Choose your approach based on what you find easier:**

| Approach | When to Use | Mental Model |
|----------|-------------|--------------|
| Right-to-left | Fastest to code | "Compare with what's to the right" |
| Pattern matching | Explicit is clearer | "Check for known pairs first" |
| Left-to-right + lookahead | Natural reading order | "Is current+next a special combo?" |

---

### Tactic 3: Visualize Subtractive Pairs

**Underline the pairs mentally:**

```
MCMXCIV → M CM XC IV
          1000 + 900 + 90 + 4 = 1994

Breakdown:
M = 1000
CM = 900 (100 before 1000)
XC = 90 (10 before 100)
IV = 4 (1 before 5)
```

**Quick check:** Scan left-to-right, look for these combos:
- `I` before `V` or `X` → subtractive
- `X` before `L` or `C` → subtractive  
- `C` before `D` or `M` → subtractive

---

### Tactic 4: Trace with a Table

**For complex examples like "MCMXCIV":**

```python
def trace_conversion(s):
    """Print step-by-step for debugging."""
    values = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    total, prev = 0, 0
    
    print(f"{'Char':<6} {'Value':<6} {'Prev':<6} {'Action':<12} {'Total'}")
    print("-" * 45)
    
    for c in reversed(s):
        curr = values[c]
        if curr < prev:
            action = f"subtract {curr}"
            total -= curr
        else:
            action = f"add {curr}"
            total += curr
        print(f"{c:<6} {curr:<6} {prev:<6} {action:<12} {total}")
        prev = curr
    
    return total

trace_conversion("MCMXCIV")
```

---

### Tactic 5: Edge Case Checklist

**Always test these:**

| Test Case | Input | Output | Why It Matters |
|-----------|-------|--------|----------------|
| Single char | "I" | 1 | Minimum valid input |
| Single subtractive | "IV" | 4 | Basic subtractive |
| Longest valid | "MMMCMXCIX" | 3999 | Maximum value |
| No subtractive | "III" | 3 | Purely additive |
| Mixed | "LVIII" | 58 | Additive + subtractive |
| Multiple subtractive | "MCMXCIV" | 1994 | All 6 pairs potentially |

---

### Tactic 6: Language-Specific Optimizations

**Python:** Use dictionary with `get()` for safety
```python
roman_values = {'I': 1, 'V': 5, ...}
value = roman_values[char]  # Fast O(1) lookup
```

**Java/C++:** Use switch statement or array indexing
```java
// Array indexing: char - 'A' offset trick possible
// Or simple switch for clarity
switch(c) {
    case 'I': return 1;
    case 'V': return 5;
    // ...
}
```

**JavaScript:** Object lookup
```javascript
const values = {I: 1, V: 5, ...};
// Or Map for guaranteed insertion order (not needed here)
```

---

### Tactic 7: Recognize Inverse Problem

**If asked "Integer to Roman":**
- Build from largest to smallest
- Try subtractive pairs first, then individual symbols
- Same logic, reversed direction

```python
# Integer to Roman (inverse)
int_to_roman = {1000:'M', 900:'CM', 500:'D', ...}
# Greedy: subtract largest possible each time
```

<!-- back -->
