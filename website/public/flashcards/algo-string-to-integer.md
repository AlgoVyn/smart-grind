## String to Integer (atoi)

**Question:** Implement atoi with handling edge cases?

<!-- front -->

---

## Answer: State Machine

### Solution
```python
def myAtoi(s):
    s = s.strip()
    if not s:
        return 0
    
    sign = 1
    i = 0
    n = len(s)
    
    # Handle sign
    if s[i] == '-':
        sign = -1
        i += 1
    elif s[i] == '+':
        i += 1
    
    # Convert digits
    result = 0
    while i < n and s[i].isdigit():
        digit = ord(s[i]) - ord('0')
        
        # Check overflow
        if result > (2**31 - 1) // 10:
            return 2**31 - 1 if sign == 1 else -2**31
        
        result = result * 10 + digit
        i += 1
    
    return sign * result
```

### Visual: Edge Cases
```
"   -42" → "-42" → -42
"42" → 42
"+-12" → 0 (invalid after +)
"4193 with words" → 4193
"words and 987" → 0
"-91283472332" → -2147483648 (overflow)
```

### ⚠️ Tricky Parts

#### 1. Overflow Checking
```python
# Before adding digit, check:
# result > (2^31 - 1) // 10
# Or after: result > 2^31 - 1

# Why division first?
# Because result*10 might overflow
# Check if next step would overflow
```

#### 2. Valid Characters Order
```
+-+123: First + valid, - makes it invalid
  → stops at second char

3.14: digit→3 valid, . stops
  → returns 3
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| One pass | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not stripping | Use s.strip() |
| Not checking overflow | Check before overflow |
| Wrong sign handling | Handle both + and - |
| Stopping at non-digit | Stop but return what we have |

<!-- back -->
