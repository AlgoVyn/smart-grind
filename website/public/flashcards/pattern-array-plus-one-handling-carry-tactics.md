## Array - Plus One (Handling Carry): Tactics

What are the advanced techniques for digit array arithmetic?

<!-- front -->

---

### Tactic 1: Explicit Carry Variable

```python
def plus_one_carry(digits):
    """Use explicit carry for extensibility (add any value K)."""
    carry = 1  # We're adding 1
    
    for i in range(len(digits) - 1, -1, -1):
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        
        if carry == 0:
            break  # Early termination
    
    if carry:
        return [carry] + digits
    return digits
```

**Use when:** Extending to add values other than 1.

---

### Tactic 2: Recursive Approach

```python
def plus_one_recursive(digits):
    """Demonstrate recursive nature of carry propagation."""
    def helper(index):
        if index < 0:
            return [1] + digits  # All 9s case
        
        if digits[index] < 9:
            digits[index] += 1
            return digits
        
        digits[index] = 0
        return helper(index - 1)  # Carry to left
    
    return helper(len(digits) - 1)
```

**Use when:** Educational purposes or linked list implementations.

---

### Tactic 3: Adding Value K (Generalization)

```python
def add_to_digits(digits, k):
    """Add any integer K to digit array."""
    carry = k
    
    for i in range(len(digits) - 1, -1, -1):
        if carry == 0:
            break
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
    
    if carry:
        # Convert remaining carry to digits
        carry_digits = []
        while carry > 0:
            carry_digits.append(carry % 10)
            carry //= 10
        return carry_digits[::-1] + digits
    return digits
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Left-to-right processing | Wrong carry direction | Always right-to-left |
| Forgetting all-9s case | Missing leading 1 | Check after loop, prepend `[1]` |
| Integer conversion | Overflow for big numbers | Never convert, use array ops |
| Off-by-one in loop | Missing first digit | Use `range(n-1, -1, -1)` |
| Not propagating carry | Stops at first 9 | Continue loop until digit < 9 |

<!-- back -->
