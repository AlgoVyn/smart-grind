## Bitwise - Counting Set Bits: Framework

What is the complete code template for counting set bits?

<!-- front -->

---

### Framework 1: Brian Kernighan Algorithm

```
┌─────────────────────────────────────────────────────┐
│  COUNT SET BITS - BRIAN KERNIGHAN TEMPLATE           │
├─────────────────────────────────────────────────────┤
│  1. Initialize count = 0                              │
│  2. While n > 0:                                     │
│     a. n = n & (n - 1)  // Clear lowest set bit    │
│     b. count += 1                                     │
│  3. Return count                                      │
│                                                      │
│  Key: Each iteration removes one set bit!           │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Brian Kernighan

```python
def hamming_weight(n):
    """Count set bits using Brian Kernighan algorithm."""
    count = 0
    
    while n:
        n &= n - 1  # Clear lowest set bit
        count += 1
    
    return count
```

---

### Implementation: Naive Approach

```python
def count_bits_naive(n):
    """Count bits by checking each position."""
    count = 0
    
    while n:
        count += n & 1  # Check LSB
        n >>= 1         # Shift right
    
    return count
```

---

### Implementation: Counting Bits DP (0 to n)

```python
def count_bits(n):
    """Return array of bit counts for 0 to n."""
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # dp[i] = dp[i without lowest set bit] + 1
        dp[i] = dp[i & (i - 1)] + 1
    
    return dp

# Alternative using pattern
def count_bits_v2(n):
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp
```

---

### Implementation: Hamming Distance

```python
def hamming_distance(x, y):
    """Count differing bits between x and y."""
    xor = x ^ y
    distance = 0
    
    while xor:
        xor &= xor - 1  # Brian Kernighan
        distance += 1
    
    return distance
```

---

### Key Pattern Elements

| Technique | Formula | Use |
|-----------|---------|-----|
| `n & (n-1)` | Clear lowest set bit | Brian Kernighan |
| `n & 1` | Check LSB | Naive method |
| `n >>= 1` | Right shift | Process next bit |
| `i & (i-1)` | Previous with bit cleared | DP recurrence |

<!-- back -->
