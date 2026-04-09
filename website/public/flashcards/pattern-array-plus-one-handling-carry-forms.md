## Array - Plus One (Handling Carry): Forms

What are the different variations of incrementing digit arrays?

<!-- front -->

---

### Form 1: Optimal Reverse Iteration

```python
def plus_one_optimal(digits):
    """Standard optimal solution."""
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    
    return [1] + digits
```

**Characteristics:** Cleanest, most efficient, interview standard.

---

### Form 2: Explicit Carry Variable

```python
def plus_one_carry(digits):
    """Explicit carry for extensibility."""
    carry = 1
    
    for i in range(len(digits) - 1, -1, -1):
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        
        if carry == 0:
            break
    
    if carry:
        return [carry] + digits
    return digits
```

**Characteristics:** Easy to extend for adding any value K.

---

### Form 3: Recursive Solution

```python
def plus_one_recursive(digits):
    """Recursive demonstration."""
    def helper(i):
        if i < 0:
            return [1] + digits
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
        return helper(i - 1)
    
    return helper(len(digits) - 1)
```

**Characteristics:** O(n) stack space, educational value.

---

### Form 4: Generalized Add K

```python
def add_k_to_digits(digits, k):
    """Add any value K to digit array."""
    carry = k
    
    for i in range(len(digits) - 1, -1, -1):
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        
        if carry == 0:
            break
    
    # Handle remaining carry
    result = digits
    while carry > 0:
        result = [carry % 10] + result
        carry //= 10
    return result
```

---

### Form Comparison

| Form | Space | Extensibility | Use Case |
|------|-------|---------------|----------|
| Optimal | O(1) | Low | Interview standard |
| Explicit carry | O(1) | High | General arithmetic |
| Recursive | O(n) | Low | Educational/Linked lists |
| Add K | O(n) | Very High | Adding any value |

<!-- back -->
