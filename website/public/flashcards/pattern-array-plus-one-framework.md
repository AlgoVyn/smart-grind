## Array - Plus One: Framework

What is the complete code template for incrementing array-represented number?

<!-- front -->

---

### Framework 1: Plus One with Carry Handling

```
┌─────────────────────────────────────────────────────┐
│  PLUS ONE - TEMPLATE                                   │
├─────────────────────────────────────────────────────┤
│  Key: Process from right (least significant digit)     │
│                                                        │
│  1. For i from len(digits)-1 down to 0:                │
│     a. If digits[i] < 9:                              │
│        - digits[i] += 1                                │
│        - Return digits immediately                    │
│     b. Else:                                          │
│        - digits[i] = 0                                 │
│        - Continue (carry to next digit)               │
│                                                        │
│  2. If loop completes (all were 9):                    │
│     - Insert 1 at beginning                           │
│     - Return [1] + digits                             │
│                                                        │
│  Example: [9,9,9] → [1,0,0,0]                          │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def plus_one(digits):
    """
    Increment number represented as array of digits.
    LeetCode 66
    Time: O(n), Space: O(1) amortized
    """
    n = len(digits)
    
    # Process from right to left
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        # Current digit is 9, set to 0 and carry
        digits[i] = 0
    
    # All digits were 9, need extra digit
    return [1] + digits
```

---

### Implementation: General Add (Add K)

```python
def add_to_digits(digits, k):
    """Add any number k to digit array."""
    n = len(digits)
    carry = k
    
    for i in range(n - 1, -1, -1):
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        if carry == 0:
            break
    
    # Handle remaining carry
    while carry > 0:
        digits.insert(0, carry % 10)
        carry //= 10
    
    return digits
```

---

### Key Pattern Elements

| Step | Action | Condition |
|------|--------|-----------|
| Add 1 | `digits[i] += 1` | When digit < 9 |
| Carry | `digits[i] = 0` | When digit == 9 |
| Early exit | Return | After increment when no carry |
| All 9s | Insert 1 | At beginning |

<!-- back -->
