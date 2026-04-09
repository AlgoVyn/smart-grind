## Bitwise DP - Counting Bits Optimization: Framework

What is the complete code template for counting bits using dynamic programming?

<!-- front -->

---

### Framework: DP with i // 2 Pattern (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│  COUNTING BITS - DP TEMPLATE                            │
├─────────────────────────────────────────────────────────┤
│  Key Insight: ans[i] = ans[i // 2] + (i % 2)            │
│                                                         │
│  For even i: bits(i) = bits(i//2) + 0                   │
│  For odd i:  bits(i) = bits(i//2) + 1                   │
│                                                         │
│  1. Initialize ans = [0] * (n + 1)                     │
│  2. For i from 1 to n:                                 │
│       ans[i] = ans[i >> 1] + (i & 1)                     │
│  3. Return ans                                          │
│                                                         │
│  Time: O(n)    Space: O(n)                              │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation: DP with Right Shift (Recommended)

```python
def count_bits(n: int) -> list:
    """
    Count set bits for all numbers 0 to n using DP.
    LeetCode 338 - Counting Bits
    Time: O(n), Space: O(n)
    """
    ans = [0] * (n + 1)  # ans[0] = 0 by default
    
    for i in range(1, n + 1):
        # i >> 1 = i // 2, i & 1 = i % 2
        ans[i] = ans[i >> 1] + (i & 1)
    
    return ans
```

**Why it works:** Right-shifting by 1 removes the LSB. The count equals the count of the shifted value plus the removed bit.

---

### Implementation: DP with Brian Kernighan Pattern

```python
def count_bits_kernighan(n: int) -> list:
    """
    dp[i] = dp[i & (i-1)] + 1
    Time: O(n), Space: O(n)
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # i & (i-1) removes the lowest set bit
        ans[i] = ans[i & (i - 1)] + 1
    
    return ans
```

**Why it works:** `i & (i-1)` clears the lowest set bit. `dp[i]` is 1 more than `dp[i without its lowest 1]`.

---

### Implementation: DP with Lowest Set Bit

```python
def count_bits_lowest_bit(n: int) -> list:
    """
    dp[i] = dp[i - (i & -i)] + 1
    Time: O(n), Space: O(n)
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        lowest_bit = i & -i  # Isolates lowest set bit (two's complement)
        ans[i] = ans[i - lowest_bit] + 1
    
    return ans
```

---

### Implementation: DP with MSB Pattern

```python
def count_bits_msb(n: int) -> list:
    """
    Track highest power of 2
    Time: O(n), Space: O(n)
    """
    ans = [0] * (n + 1)
    msb = 1  # Current highest power of 2
    
    for i in range(1, n + 1):
        if i == msb * 2:  # New power of 2 reached
            msb *= 2
        ans[i] = ans[i - msb] + 1  # 1 for MSB + count of remainder
    
    return ans
```

---

### Key Framework Elements

| Element | Formula | Purpose | Complexity |
|---------|---------|---------|------------|
| `ans` array | `ans[i]` | Store bit counts | O(n) space |
| `i >> 1` | `i // 2` | Right shift (remove LSB) | O(1) |
| `i & 1` | `i % 2` | Check LSB | O(1) |
| `i & (i-1)` | - | Clear lowest set bit | O(1) |
| `i & -i` | - | Isolate lowest set bit | O(1) |
| Base case | `ans[0] = 0` | Zero has no set bits | O(1) |

---

### Built-in Alternative (Language-Specific)

```python
# Python 3.10+
def count_bits_builtin(n: int) -> list:
    return [i.bit_count() for i in range(n + 1)]

# C++
// vector<int> ans(n + 1);
// for (int i = 0; i <= n; i++) ans[i] = __builtin_popcount(i);

# Java
// for (int i = 0; i <= n; i++) ans[i] = Integer.bitCount(i);
```

**Note:** Built-ins are concise but DP approach demonstrates understanding of the pattern.

<!-- back -->
