## String - String to Integer (atoi): Forms

What are the different variations of atoi implementation?

<!-- front -->

---

### Form 1: Classic Iterative (Standard)

**The standard interview implementation:**

```python
def myAtoi_classic(s: str) -> int:
    """
    Standard atoi with all requirements.
    Handles whitespace, sign, digits, overflow.
    """
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    i, n = 0, len(s)
    result, sign = 0, 1
    
    # Skip whitespace
    while i < n and s[i] == ' ':
        i += 1
    
    if i >= n:
        return 0
    
    # Handle sign
    if s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Parse digits
    while i < n and s[i].isdigit():
        digit = ord(s[i]) - ord('0')
        if result > (INT_MAX - digit) // 10:
            return INT_MIN if sign == -1 else INT_MAX
        result = result * 10 + digit
        i += 1
    
    return sign * result
```

---

### Form 2: Using Long/64-bit for Detection

**Alternative that uses larger type for overflow check:**

```python
def myAtoi_long_detection(s: str) -> int:
    """
    Use 64-bit long to detect overflow.
    Cleaner code but requires larger type.
    """
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    i, n = 0, len(s)
    result = 0  # Use long/long long in C++/Java
    sign = 1
    
    while i < n and s[i] == ' ':
        i += 1
    
    if i < n and s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    while i < n and s[i].isdigit():
        result = result * 10 + int(s[i])
        # Check after update using larger type
        if result * sign > INT_MAX:
            return INT_MAX
        if result * sign < INT_MIN:
            return INT_MIN
        i += 1
    
    return int(result * sign)
```

**C++ Implementation:**

```cpp
int myAtoi(string s) {
    const int INT_MAX = 2147483647;
    const int INT_MIN = -2147483648;
    
    int i = 0, n = s.length();
    long result = 0;  // Use long for overflow detection
    int sign = 1;
    
    while (i < n && s[i] == ' ') i++;
    
    if (i < n && (s[i] == '+' || s[i] == '-')) {
        sign = (s[i] == '-') ? -1 : 1;
        i++;
    }
    
    while (i < n && isdigit(s[i])) {
        result = result * 10 + (s[i] - '0');
        // Clamp using long
        if (sign * result > INT_MAX) return INT_MAX;
        if (sign * result < INT_MIN) return INT_MIN;
        i++;
    }
    
    return sign * result;
}
```

---

### Form 3: DFA (Deterministic Finite Automaton)

**State machine approach for complex parsing:**

```python
def myAtoi_dfa(s: str) -> int:
    """
    DFA-based parser for atoi.
    More extensible for complex rules.
    """
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    
    # States: 0=START, 1=SIGN, 2=NUMBER, 3=END
    STATE_START = 0
    STATE_SIGN = 1
    STATE_NUMBER = 2
    STATE_END = 3
    
    state = STATE_START
    result, sign = 0, 1
    
    for c in s:
        if state == STATE_START:
            if c == ' ':
                continue
            state = STATE_SIGN
            if c == '+':
                sign = 1
                state = STATE_NUMBER
            elif c == '-':
                sign = -1
                state = STATE_NUMBER
            elif c.isdigit():
                result = int(c)
                state = STATE_NUMBER
            else:
                return 0  # Invalid
                
        elif state == STATE_SIGN:
            if c.isdigit():
                result = int(c)
                state = STATE_NUMBER
            else:
                return 0  # Invalid after sign
                
        elif state == STATE_NUMBER:
            if not c.isdigit():
                break  # End of number
            digit = int(c)
            if result > (INT_MAX - digit) // 10:
                return INT_MIN if sign == -1 else INT_MAX
            result = result * 10 + digit
    
    return sign * result if state == STATE_NUMBER else 0
```

---

### Form 4: 64-bit Integer Parsing

**For environments with 64-bit integers:**

```python
def myAtoi_64bit(s: str) -> int:
    """
    Simplified version for 64-bit result.
    Overflow check happens at the end.
    """
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    i, n = 0, len(s)
    
    while i < n and s[i] == ' ':
        i += 1
    
    sign = 1
    if i < n and s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    result = 0
    while i < n and s[i].isdigit():
        result = result * 10 + int(s[i])
        i += 1
    
    result *= sign
    
    # Clamp at the end
    if result > INT_MAX:
        return INT_MAX
    if result < INT_MIN:
        return INT_MIN
    return result
```

---

### Form 5: No-Bounds-Check (Learning Version)

**Basic version without overflow handling:**

```python
def myAtoi_basic(s: str) -> int:
    """
    Basic atoi without overflow handling.
    Use for understanding the core logic.
    """
    i, n = 0, len(s)
    result, sign = 0, 1
    
    # Skip whitespace
    while i < n and s[i] == ' ':
        i += 1
    
    # Handle sign
    if i < n and s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Parse digits
    while i < n and s[i].isdigit():
        result = result * 10 + int(s[i])
        i += 1
    
    return sign * result
```

---

### Form Comparison

| Form | Overflow Handling | Space | Use Case |
|------|-------------------|-------|----------|
| **Classic** | Pre-check math | O(1) | Interview standard |
| **Long Detection** | Use larger type | O(1) | Languages with long |
| **DFA** | Pre-check math | O(1) | Complex parsers |
| **64-bit** | Post-check clamp | O(1) | 64-bit environments |
| **Basic** | None | O(1) | Learning only |

---

### Extension Forms

**Hexadecimal Support:**

```python
def myAtoi_with_hex(s: str) -> int:
    """Extended to handle 0x prefix for hex."""
    i, n = 0, len(s)
    
    while i < n and s[i] == ' ':
        i += 1
    
    if i < n and s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Check for hex prefix
    base = 10
    if i + 1 < n and s[i] == '0' and s[i+1] in 'xX':
        base = 16
        i += 2
    
    result = 0
    while i < n:
        if s[i].isdigit():
            digit = int(s[i])
        elif base == 16 and s[i].lower() in 'abcdef':
            digit = ord(s[i].lower()) - ord('a') + 10
        else:
            break
        result = result * base + digit
        i += 1
    
    return sign * result
```

<!-- back -->
