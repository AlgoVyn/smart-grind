## Array - Plus One: Tactics

What are the advanced techniques for array-based addition?

<!-- front -->

---

### Tactic 1: Add Any Number K

```python
def add_k(digits, k):
    """Add any number k to digit array."""
    carry = k
    i = len(digits) - 1
    
    while i >= 0 and carry > 0:
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        i -= 1
    
    # Prepend remaining carry
    if carry > 0:
        digits = [carry] + digits
    
    return digits
```

---

### Tactic 2: Multiply by Single Digit

```python
def multiply_by_digit(digits, m):
    """Multiply number by single digit m."""
    carry = 0
    result = []
    
    for i in range(len(digits) - 1, -1, -1):
        total = digits[i] * m + carry
        result.append(total % 10)
        carry = total // 10
    
    while carry > 0:
        result.append(carry % 10)
        carry //= 10
    
    return result[::-1]
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Starting from left | Wrong digit | Start from right (least significant) |
| Not handling all 9s | Wrong result | Return [1] + digits |
| Modifying during iteration | Errors | Use index properly |
| Wrong carry logic | Overflow | Use divmod or // and % |

---

### Tactic 4: String-Based Addition

```python
def add_strings(num1, num2):
    """Add two numbers represented as strings."""
    i, j = len(num1) - 1, len(num2) - 1
    carry = 0
    result = []
    
    while i >= 0 or j >= 0 or carry:
        d1 = int(num1[i]) if i >= 0 else 0
        d2 = int(num2[j]) if j >= 0 else 0
        
        total = d1 + d2 + carry
        result.append(str(total % 10))
        carry = total // 10
        
        i -= 1
        j -= 1
    
    return ''.join(reversed(result))
```

<!-- back -->
