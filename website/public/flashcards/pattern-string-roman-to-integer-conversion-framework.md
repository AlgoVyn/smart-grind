## Roman to Integer: Framework

What is the complete code template for Roman to Integer conversion?

<!-- front -->

---

### Framework: Roman to Integer Conversion

```
┌─────────────────────────────────────────────────────────────┐
│  ROMAN TO INTEGER - TEMPLATE                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Process right-to-left; subtract when        │
│  current < previous (subtractive notation detection)        │
│                                                             │
│  1. Define symbol values:                                   │
│     I=1, V=5, X=10, L=50, C=100, D=500, M=1000              │
│                                                             │
│  2. Initialize:                                             │
│     total = 0, prev_value = 0                               │
│                                                             │
│  3. Iterate from right to left:                             │
│     current = roman_values[s[i]]                            │
│     if current < prev_value:                                │
│         total -= current    # Subtractive pair (e.g., IV)   │
│     else:                                                     │
│         total += current    # Additive                      │
│     prev_value = current                                    │
│                                                             │
│  4. Return total                                            │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Right-to-Left (Most Elegant)

```python
def roman_to_int(s: str) -> int:
    """
    Convert Roman numeral to integer.
    Time: O(n), Space: O(1)
    """
    roman_values = {
        'I': 1, 'V': 5, 'X': 10,
        'L': 50, 'C': 100, 'D': 500, 'M': 1000
    }
    
    total = 0
    prev_value = 0
    
    # Process from right to left
    for i in range(len(s) - 1, -1, -1):
        current_value = roman_values[s[i]]
        
        # If current < previous, it's subtractive notation
        if current_value < prev_value:
            total -= current_value
        else:
            total += current_value
        
        prev_value = current_value
    
    return total
```

---

### Implementation: Pattern Matching (Explicit)

```python
def roman_to_int_explicit(s: str) -> int:
    """
    Explicit subtractive pattern handling.
    Time: O(n), Space: O(1)
    """
    roman_values = {'I': 1, 'V': 5, 'X': 10, 'L': 50,
                    'C': 100, 'D': 500, 'M': 1000}
    
    subtractive = {
        'IV': 4, 'IX': 9,
        'XL': 40, 'XC': 90,
        'CD': 400, 'CM': 900
    }
    
    total = 0
    i = 0
    
    while i < len(s):
        # Check two-character patterns first
        if i + 1 < len(s) and s[i:i+2] in subtractive:
            total += subtractive[s[i:i+2]]
            i += 2
        else:
            total += roman_values[s[i]]
            i += 1
    
    return total
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| Symbol mapping | Convert char to value | `{'I': 1, 'V': 5, ...}` |
| `prev_value` | Track value seen to the right | Used for subtractive detection |
| Right-to-left | Elegant subtraction detection | `IV` → process V first, then I |
| Six subtractive pairs | Special combinations | `IV, IX, XL, XC, CD, CM` |
| Range constraint | Valid inputs only | `[1, 3999]` for standard numerals |

---

### Trace Example: "MCMXCIV" (1994)

```
Process: M C M X C I V
Index:    6 5 4 3 2 1 0 (right-to-left)

Step 0: total=0,  prev=0
Step 1: 'V'=5,   5<0? No   → total=5,   prev=5
Step 2: 'I'=1,   1<5? Yes  → total=4,   prev=1   (subtract 1)
Step 3: 'C'=100, 100<1? No → total=104, prev=100
Step 4: 'X'=10,  10<100? Yes → total=94, prev=10 (subtract 10)
Step 5: 'M'=1000,1000<10? No → total=1094, prev=1000
Step 6: 'C'=100, 100<1000? Yes → total=994, prev=100 (subtract 100)
Step 7: 'M'=1000,1000<100? No → total=1994, prev=1000

Result: 1994
```

<!-- back -->
