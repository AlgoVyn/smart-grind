## String - String to Integer (atoi): Tactics

What are practical tactics for solving atoi implementation problems?

<!-- front -->

---

### Tactic 1: Edge Case Checklist

**Quick validation for all edge cases:**

```python
def test_atoi_edge_cases(atoi_func):
    """Verify implementation handles all edge cases."""
    test_cases = [
        # Input          Expected    Description
        ("42",           42,         "basic positive"),
        ("   -42",       -42,        "whitespace + negative"),
        ("4193 with",    4193,       "stop at non-digit"),
        ("words 987",    0,          "no valid number"),
        ("-91283472332", -2147483648, "underflow clamp"),
        ("21474836460",  2147483647,  "overflow clamp"),
        ("+-12",         0,          "multiple signs"),
        ("  +  413",     0,          "space between sign and digits"),
        ("00000-42",     0,          "digits before sign"),
        ("",             0,          "empty string"),
        ("   ",          0,          "only whitespace"),
        ("+0",           0,          "zero with sign"),
        ("-0",           0,          "negative zero"),
        ("2147483647",   2147483647,  "INT_MAX exact"),
        ("-2147483648",  -2147483648, "INT_MIN exact"),
    ]
    
    for input_str, expected, desc in test_cases:
        result = atoi_func(input_str)
        status = "✓" if result == expected else "✗"
        print(f"{status} {desc}: '{input_str}' → {result}")
```

---

### Tactic 2: Visual Debugging with Trace

**Step through execution:**

```python
def myAtoi_trace(s: str) -> int:
    """Atoi with detailed tracing for debugging."""
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    i, n = 0, len(s)
    result, sign = 0, 1
    
    print(f"Input: '{s}'")
    print(f"Initial: i={i}, result={result}, sign={sign}")
    
    # Skip whitespace
    while i < n and s[i] == ' ':
        i += 1
    print(f"After whitespace: i={i} (char='{s[i] if i < n else 'END'}')")
    
    if i >= n:
        print("Empty after whitespace → return 0")
        return 0
    
    # Handle sign
    if i < n and s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
        print(f"After sign: sign={sign}, i={i}")
    
    # Parse digits
    while i < n and s[i].isdigit():
        digit = int(s[i])
        overflow_check = (INT_MAX - digit) // 10
        print(f"  Digit '{s[i]}': digit={digit}, result={result}")
        print(f"    Overflow check: {result} > {overflow_check}? {result > overflow_check}")
        
        if result > overflow_check:
            print(f"    OVERFLOW! Return {INT_MIN if sign == -1 else INT_MAX}")
            return INT_MIN if sign == -1 else INT_MAX
        
        result = result * 10 + digit
        print(f"    New result: {result}")
        i += 1
    
    final = sign * result
    print(f"Final: {sign} * {result} = {final}")
    return final

# Example trace:
# myAtoi_trace("   -42abc")
```

---

### Tactic 3: Integer Bounds Reference

**Quick reference for 32-bit signed integers:**

```
┌─────────────────────────────────────────┐
│  32-bit SIGNED INTEGER BOUNDS          │
├─────────────────────────────────────────┤
│                                         │
│  INT_MAX = 2³¹ - 1                      │
│          = 2147483647                   │
│          = 0x7FFFFFFF                   │
│                                         │
│  INT_MIN = -2³¹                         │
│          = -2147483648                  │
│          = 0x80000000 (in two's comp)   │
│                                         │
│  Absolute value of INT_MIN overflows!   │
│  Use: -INT_MIN = INT_MIN (in 32-bit)    │
│                                         │
└─────────────────────────────────────────┘
```

---

### Tactic 4: Character to Digit Conversion

**Multiple ways to convert:**

```python
def char_to_digit_methods():
    """Compare different conversion methods."""
    c = '7'
    
    # Method 1: ASCII arithmetic (fastest)
    digit1 = ord(c) - ord('0')  # 55 - 48 = 7
    
    # Method 2: int() conversion
    digit2 = int(c)  # 7
    
    # Method 3: Direct subtraction (in C-style)
    # digit = c - '0'  # Works in C/C++/Java
    
    return digit1, digit2

# ASCII reference:
# '0' = 48, '1' = 49, ..., '9' = 57
```

---

### Tactic 5: Language-Specific Digit Checks

```python
# Python
s[i].isdigit()           # Best practice
'0' <= s[i] <= '9'       # Range check

# Java
Character.isDigit(c)     # Best practice
c >= '0' && c <= '9'     # Range check

# JavaScript
s[i] >= '0' && s[i] <= '9'  // Range check
/\d/.test(s[i])          // Regex (slower)

# C++
isdigit(c)               # Best practice
c >= '0' && c <= '9'     # Range check
```

---

### Tactic 6: Detecting Invalid Patterns Early

```python
def validate_atoi_pattern(s: str) -> tuple:
    """
    Pre-validate if string follows atoi pattern.
    Returns (is_valid, reason).
    """
    if not s:
        return False, "empty string"
    
    i = 0
    n = len(s)
    
    # Skip whitespace
    while i < n and s[i] == ' ':
        i += 1
    
    if i >= n:
        return False, "only whitespace"
    
    # Check for sign
    has_sign = s[i] in '+-'
    if has_sign:
        i += 1
        # Check for second sign or space after sign
        if i < n and (s[i] in '+-' or s[i] == ' '):
            return False, "invalid after sign"
    
    # Must have at least one digit
    if i >= n or not s[i].isdigit():
        return False, "no digits found"
    
    return True, "valid pattern"

# Usage:
# valid, reason = validate_atoi_pattern("+-12")
# → (False, "invalid after sign")
```

<!-- back -->
