## Array - Plus One (Handling Carry): Framework

What is the complete code template for incrementing a digit array with carry handling?

<!-- front -->

---

### Framework: Reverse Iteration with Carry

```
┌─────────────────────────────────────────────────────────────┐
│  PLUS ONE - REVERSE ITERATION TEMPLATE                       │
│  Key: Start from right (least significant digit)             │
│                                                              │
│  1. Start at last index: i = len(digits) - 1                │
│                                                              │
│  2. While i >= 0:                                             │
│     If digits[i] < 9:                                        │
│        digits[i] += 1          ← Can increment, done!        │
│        return digits                                          │
│     Else:                                                    │
│        digits[i] = 0           ← 9 becomes 0, carry left     │
│        i--                   ← Move to more significant     │
│                                                              │
│  3. All digits were 9:                                        │
│     return [1] + digits      ← New leading 1 (999→1000)     │
│                                                              │
│  Key Insight: Early return when digit < 9                    │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def plus_one(digits):
    """
    Increment a number represented as array of digits by one.
    LeetCode 66 - Plus One
    Time: O(n), Space: O(1)
    """
    n = len(digits)
    
    # Process from right to left (least significant digit first)
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits  # Early return, no carry needed
        digits[i] = 0  # Handle carry, digit becomes 0
    
    # All digits were 9, need new leading 1
    return [1] + digits
```

---

### Key Pattern Elements

| Element | Purpose | Value |
|---------|---------|-------|
| Start position | Least significant digit | `len(digits) - 1` |
| Direction | Carry propagates left | Right to left |
| Early termination | Stop when digit < 9 | Immediate return |
| All 9s case | Array grows by 1 | Prepend `[1]` |

**Why from the right?**
- Carry propagates from least significant to most significant digit
- Standard addition algorithm (like we learned in school)

<!-- back -->
