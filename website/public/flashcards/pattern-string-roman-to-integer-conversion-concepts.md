## Roman to Integer: Core Concepts

What are the core concepts and rules of Roman numeral conversion?

<!-- front -->

---

### Roman Numeral Symbols

| Symbol | Value | Category |
|--------|-------|----------|
| I | 1 | Ones |
| V | 5 | Fives |
| X | 10 | Tens |
| L | 50 | Fifties |
| C | 100 | Hundreds |
| D | 500 | Five-hundreds |
| M | 1000 | Thousands |

---

### Subtractive Notation

**The Key Rule:** When a smaller value precedes a larger value, subtract the smaller.

| Pattern | Value | Meaning | Example |
|---------|-------|---------|---------|
| IV | 4 | 5 - 1 | `I` before `V` |
| IX | 9 | 10 - 1 | `I` before `X` |
| XL | 40 | 50 - 10 | `X` before `L` |
| XC | 90 | 100 - 10 | `X` before `C` |
| CD | 400 | 500 - 100 | `C` before `D` |
| CM | 900 | 1000 - 100 | `C` before `M` |

**Why only 6 pairs?**
- Only one smaller symbol can precede a larger one
- Only specific "powers of 10" can be subtracted from specific values
- No double subtraction (e.g., `IIX` is invalid)

---

### Standard vs Subtractive Notation

```
Standard (Additive):    Subtractive:
III = 1+1+1 = 3         IV = 5-1 = 4
VIII = 5+1+1+1 = 8      IX = 10-1 = 9
XXX = 10+10+10 = 30     XL = 50-10 = 40
LXXX = 50+10+10+10 = 80 XC = 100-10 = 90
```

---

### Problem Constraints

| Constraint | Description | Implication |
|------------|-------------|-------------|
| `1 ≤ s.length ≤ 15` | Very small input | O(n) is always fast |
| Valid characters only | I, V, X, L, C, D, M | No validation needed |
| Result in `[1, 3999]` | Standard Roman range | No extended numerals |

---

### Core Insight

> **When processing right-to-left:** If current value < previous value, it means the current symbol is part of a subtractive pair.

**Why this works:**
```
"IV" processed right-to-left:
1. Process 'V': current=5, prev=0 → total=5, prev=5
2. Process 'I': current=1, prev=5 → 1<5, so subtract → total=4

Result: 4 ✓
```

The "previous" value is actually the symbol to the **right** in the original string, so we're comparing against what comes after.

---

### Key Properties

| Property | Description |
|----------|-------------|
| **Additivity** | Standard: symbols in descending order sum together |
| **Subtractive pairs** | Only 6 valid combinations exist |
| **No repetition** | V, L, D are never repeated; I, X, C, M max 3 times |
| **Order matters** | Left-to-right is usually descending (except subtractive) |

---

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| Right-to-left | O(n) | O(1) |
| Pattern matching | O(n) | O(1) |
| Conditional logic | O(n) | O(1) |

All approaches are optimal due to the small input constraint (max 15 chars).

<!-- back -->
