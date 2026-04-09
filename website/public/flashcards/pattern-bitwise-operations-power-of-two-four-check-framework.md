## Bitwise - Power of Two/Four Check: Framework

What is the complete code template for checking if a number is a power of 2 or 4?

<!-- front -->

---

### Framework: Power of Two Check

```
┌─────────────────────────────────────────────────────────────┐
│  POWER OF TWO CHECK - TEMPLATE                              │
├─────────────────────────────────────────────────────────────┤
│  Key Insight: Powers of 2 have exactly one bit set         │
│                                                              │
│  1. Verify n > 0 (positive check)                          │
│  2. Check (n & (n - 1)) == 0 (single bit check)            │
│     - n & (n-1) clears the lowest set bit                  │
│     - If result is 0, n was a power of 2                   │
│  3. Return true if both conditions satisfied               │
│                                                              │
│  Formula: return n > 0 && (n & (n - 1)) == 0               │
│                                                              │
│  Time: O(1), Space: O(1)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Power of Two

```python
def is_power_of_two(n: int) -> bool:
    """
    Check if n is a power of 2 using bitwise operations.
    LeetCode 231 - Power of Two
    Time: O(1), Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0
```

**Why it works:**
- Powers of 2: 1(1), 2(10), 4(100), 8(1000), 16(10000)...
- `n & (n - 1)` clears the lowest set bit
- If n is power of 2, there's only one bit to clear → result is 0
- `n > 0` required because 0 and negatives can pass the bitwise check

---

### Framework: Power of Four Check

```
┌─────────────────────────────────────────────────────────────┐
│  POWER OF FOUR CHECK - TEMPLATE                             │
├─────────────────────────────────────────────────────────────┤
│  Key Insight: Powers of 4 are powers of 2 with bit in      │
│  even position (0, 2, 4, 6, ...)                           │
│                                                              │
│  1. Power of 2 check: n > 0 && (n & (n - 1)) == 0          │
│  2. Even position check: (n & 0xAAAAAAAA) == 0             │
│     - 0xAAAAAAAA = 10101010... in binary                   │
│     - Has 1s in ODD positions (1, 3, 5, ...)              │
│     - If AND with mask is 0, bit must be in EVEN position  │
│  3. Return true if both satisfied                           │
│                                                              │
│  Formula: return n > 0 && (n & (n - 1)) == 0              │
│           && (n & 0xAAAAAAAA) == 0                          │
│                                                              │
│  Time: O(1), Space: O(1)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Power of Four

```python
def is_power_of_four(n: int) -> bool:
    """
    Check if n is a power of 4 using bitwise operations.
    LeetCode 342 - Power of Four
    Time: O(1), Space: O(1)
    """
    # Must be power of 2 (single bit set)
    # AND that bit must be in an even position
    # 0xAAAAAAAA = 10101010101010101010101010101010 in binary
    return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0
```

**Alternative using modulo:**
```python
def is_power_of_four_modulo(n: int) -> bool:
    """
    Check if n is a power of 4 using modulo property.
    Powers of 4 modulo 3 always equal 1.
    Time: O(1), Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0 and (n % 3 == 1)
```

---

### Implementation: All Languages

**C/C++:**
```cpp
bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

bool isPowerOfFour(int n) {
    return n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0;
}
```

**Java:**
```java
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

public boolean isPowerOfFour(int n) {
    return n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0;
}
```

**JavaScript:**
```javascript
var isPowerOfTwo = function(n) {
    return n > 0 && (n & (n - 1)) === 0;
};

var isPowerOfFour = function(n) {
    return n > 0 && (n & (n - 1)) === 0 && (n & 0xAAAAAAAA) === 0;
};
```

---

### Key Framework Elements

| Element | Purpose | Condition |
|---------|---------|-----------|
| `n > 0` | Eliminate 0 and negatives | Must be positive |
| `n & (n - 1)` | Clear lowest set bit | Power of 2 if result is 0 |
| `n & 0xAAAAAAAA` | Check bit position | Power of 4 if result is 0 |
| `n % 3 == 1` | Alternative position check | Mathematical property |

<!-- back -->
