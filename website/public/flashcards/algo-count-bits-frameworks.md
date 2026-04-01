## Count Bits: Algorithm Framework

What are the complete implementations for counting bits efficiently?

<!-- front -->

---

### Dynamic Programming (Shift Pattern)

```python
def count_bits_dp(n: int) -> list:
    """
    dp[i] = dp[i // 2] + (i % 2)
    Time: O(n), Space: O(n)
    """
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp
```

**Explanation:** The number of 1s in `i` equals the number of 1s in `i//2` plus the last bit of `i`.

---

### DP with Brian Kernighan Pattern

```python
def count_bits_kernighan(n: int) -> list:
    """
    dp[i] = dp[i & (i-1)] + 1
    Time: O(n), Space: O(n)
    Often slightly faster in practice
    """
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        dp[i] = dp[i & (i - 1)] + 1
    
    return dp
```

**Explanation:** `i & (i-1)` clears the lowest set bit. So `dp[i]` is one more than `dp[i with lowest 1 cleared]`.

---

### Most Significant Bit Pattern

```python
def count_bits_msb(n: int) -> list:
    """
    Track highest power of 2
    Time: O(n), Space: O(n)
    """
    dp = [0] * (n + 1)
    highest_power = 1
    
    for i in range(1, n + 1):
        if i == highest_power * 2:
            highest_power *= 2
        
        dp[i] = dp[i - highest_power] + 1
    
    return dp
```

**Explanation:** When `i` is a power of 2, it has exactly 1 bit set. Otherwise, `dp[i] = dp[i - 2^k] + 1` where `2^k` is the highest power ≤ `i`.

---

### Lookup Table (For Large n)

```python
def count_bits_lookup(n: int) -> list:
    """
    Use 8-bit lookup table
    Faster for very large arrays
    """
    # Precompute 0-255
    lookup = [0] * 256
    for i in range(256):
        lookup[i] = lookup[i >> 1] + (i & 1)
    
    result = []
    for i in range(n + 1):
        # Count bits in each byte
        count = (lookup[i & 0xFF] + 
                lookup[(i >> 8) & 0xFF] + 
                lookup[(i >> 16) & 0xFF] + 
                lookup[(i >> 24) & 0xFF])
        result.append(count)
    
    return result
```

---

### Single Number Popcount

```python
def popcount_builtin(x: int) -> int:
    """Use built-in when available"""
    return x.bit_count()  # Python 3.10+

def popcount_manual(x: int) -> int:
    """Manual implementation"""
    count = 0
    while x:
        x &= x - 1  # Clear lowest set bit
        count += 1
    return count

def popcount_shift(x: int) -> int:
    """Check each bit"""
    count = 0
    while x:
        count += x & 1
        x >>= 1
    return count
```

<!-- back -->
