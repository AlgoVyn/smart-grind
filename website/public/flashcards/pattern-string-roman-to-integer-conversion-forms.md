## Roman to Integer: Forms

What are the different forms and variations of Roman numeral problems?

<!-- front -->

---

### Problem Variants

| Variant | Direction | Example | Difficulty |
|---------|-----------|---------|------------|
| **Roman to Integer** | String → Number | "MCMXCIV" → 1994 | Easy |
| **Integer to Roman** | Number → String | 1994 → "MCMXCIV" | Medium |
| **Validate Roman** | String → Boolean | "IIII" → False | Medium |
| **Extended Roman** | Support 4000+ | 5000 → "V̄" | Hard |

---

### Form 1: Standard Roman to Integer

**Standard problem:** Convert valid Roman numeral to integer (1-3999).

```python
def roman_to_int(s: str) -> int:
    # Input guaranteed valid
    # Output range: [1, 3999]
    pass
```

**Examples:**
- "III" → 3
- "IV" → 4
- "IX" → 9
- "LVIII" → 58
- "MCMXCIV" → 1994
- "MMMCMXCIX" → 3999

---

### Form 2: Integer to Roman (Inverse)

**Build Roman from integer using greedy approach:**

```python
def int_to_roman(num: int) -> str:
    """
    Greedy: use largest value that fits, subtract, repeat.
    """
    values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    
    result = []
    for i, v in enumerate(values):
        while num >= v:
            result.append(symbols[i])
            num -= v
    
    return "".join(result)

# int_to_roman(1994) → "MCMXCIV"
```

**Key difference:** Try subtractive pairs first, then individual symbols.

---

### Form 3: Validation Required

**Check if string is a valid Roman numeral:**

```python
def is_valid_roman(s: str) -> bool:
    """
    Validation rules:
    1. Only valid chars: I, V, X, L, C, D, M
    2. No more than 3 consecutive: I, X, C, M
    3. Never repeat: V, L, D
    4. Only valid subtractive pairs: IV, IX, XL, XC, CD, CM
    5. No invalid subtractive: IL, IC, ID, IM, XD, XM, etc.
    """
    # Implementation would check all rules
    pass
```

**Invalid examples:**
- "IIII" (4 I's in a row)
- "VV" (V repeated)
- "IL" (invalid subtractive)
- "IC" (invalid subtractive)
- "MCMZ" (Z is invalid char)

---

### Form 4: Extended Roman Numerals

**Support values beyond 3999 using overline notation:**

| Symbol | Standard | With Overline |
|--------|----------|---------------|
| V | 5 | 5,000 |
| X | 10 | 10,000 |
| L | 50 | 50,000 |
| C | 100 | 100,000 |
| D | 500 | 500,000 |
| M | 1,000 | 1,000,000 |

```python
# Extended representation example:
# 5000 = "V̄" (V with overline/bar)
# 10000 = "X̄"

def roman_to_int_extended(s: str) -> int:
    """
    Handle overline notation for values > 3999.
    Bar multiplies value by 1000.
    """
    # Need to detect combining characters or special notation
    # Multiply barred symbols by 1000
    pass
```

---

### Form 5: Batch Processing

**Convert multiple Roman numerals efficiently:**

```python
def batch_roman_to_int(roman_strings: list) -> list:
    """
    Process multiple Roman numerals.
    All approaches are O(n) per string, so total O(total_chars).
    """
    values = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}
    results = []
    
    for s in roman_strings:
        total = prev = 0
        for c in reversed(s):
            curr = values[c]
            total += -curr if curr < prev else curr
            prev = curr
        results.append(total)
    
    return results
```

**Optimization:** Pre-load dictionary once, reuse for all conversions.

---

### Form 6: Arithmetic on Roman Numerals

**Add/subtract Roman numerals directly:**

```python
def add_roman(a: str, b: str) -> str:
    """
    Convert both to int, add, convert back.
    Most practical approach.
    """
    return int_to_roman(roman_to_int(a) + roman_to_int(b))

def add_roman_manual(a: str, b: str) -> str:
    """
    Manual addition without intermediate int.
    Concatenate and simplify (complex!)
    """
    # Combine symbols, then reduce using Roman rules
    # Much more complex - not recommended
    pass
```

---

### Form Comparison Table

| Form | Input | Output | Time | Space | Common? |
|------|-------|--------|------|-------|---------|
| Roman → Int | "MCM" | 1900 | O(n) | O(1) | **Very common** |
| Int → Roman | 1900 | "MCM" | O(1) | O(1) | **Very common** |
| Validation | "MCM" | True | O(n) | O(1) | Moderate |
| Extended | "V̄" | 5000 | O(n) | O(1) | Rare |
| Arithmetic | "X" + "V" | "XV" | O(n) | O(1) | Rare |

---

### Real-World Applications

| Use Case | Form | Context |
|----------|------|---------|
| Historical documents | Standard conversion | Archival systems |
| Chapter numbering | Int → Roman | Book layouts |
| Movie credits | Int → Roman | Copyright years |
| Game quest numbering | Standard | RPGs, achievements |
| Formal documents | Int → Roman | Legal, academic |

<!-- back -->
