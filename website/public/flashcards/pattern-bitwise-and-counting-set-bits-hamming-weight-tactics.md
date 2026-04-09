## Bitwise - Counting Set Bits: Tactics

What are specific techniques for counting set bits in various scenarios?

<!-- front -->

---

### Tactic 1: Counting Bits for Range 0 to n

**Dynamic Programming approach for LeetCode 338:**

```python
def count_bits_range(n: int) -> list:
    """
    Count bits for all numbers from 0 to n.
    LeetCode 338 - Counting Bits
    Time: O(n), Space: O(n)
    """
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # dp[i] = dp[i without lowest bit] + lowest bit
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp
```

**Alternative using Brian Kernighan pattern:**
```python
def count_bits_kernighan(n: int) -> list:
    """dp[i] = dp[i & (i-1)] + 1"""
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        dp[i] = dp[i & (i - 1)] + 1
    
    return dp
```

---

### Tactic 2: Parallel Bit Counting (No Loops)

**For 32-bit integers without explicit loops (advanced):**

```python
def hamming_weight_parallel(n: int) -> int:
    """
    Parallel bit counting using SWAR algorithm.
    Time: O(1) with no loops, Space: O(1)
    """
    n = (n & 0x55555555) + ((n >> 1) & 0x55555555)  # 2-bit sums
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)  # 4-bit sums
    n = (n & 0x0F0F0F0F) + ((n >> 4) & 0x0F0F0F0F)  # 8-bit sums
    n = (n & 0x00FF00FF) + ((n >> 8) & 0x00FF00FF)  # 16-bit sums
    n = (n & 0x0000FFFF) + ((n >> 16) & 0x0000FFFF) # 32-bit sum
    
    return n
```

**How it works:** Sums bits in parallel by combining adjacent pairs at each step.

---

### Tactic 3: Hamming Distance Between Two Numbers

```python
def hamming_distance(x: int, y: int) -> int:
    """
    Count positions where bits differ.
    LeetCode 461 - Hamming Distance
    Time: O(1), Space: O(1)
    """
    xor = x ^ y  # 1 where bits differ
    return hamming_weight(xor)  # Count 1s in XOR
```

**Key insight:** XOR reveals bit differences; count those bits.

---

### Tactic 4: Total Hamming Distance (All Pairs)

```python
def total_hamming_distance(nums: list) -> int:
    """
    Sum of Hamming distances between all pairs.
    LeetCode 477 - Total Hamming Distance
    Time: O(32 * n), Space: O(1)
    """
    total = 0
    n = len(nums)
    
    # For each bit position
    for i in range(32):
        count_ones = sum((num >> i) & 1 for num in nums)
        count_zeros = n - count_ones
        # Pairs with different bits at position i
        total += count_ones * count_zeros
    
    return total
```

**Key insight:** Count 1s and 0s at each bit position separately.

---

### Tactic 5: Check if Number is Power of Two

```python
def is_power_of_two(n: int) -> bool:
    """
    Check if exactly one bit is set.
    LeetCode 231 - Power of Two
    Time: O(1), Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0
```

**Why it works:** Powers of two have exactly one bit set. `n & (n-1)` clears that bit. If result is 0 and n > 0, exactly one bit was set.

---

### Tactic 6: Find Rightmost Set Bit Position

```python
def rightmost_set_bit_position(n: int) -> int:
    """
    Find position (0-indexed) of lowest set bit.
    Returns -1 if n is 0.
    """
    if n == 0:
        return -1
    
    # Isolate rightmost bit and get position
    return (n & -n).bit_length() - 1

# Alternative: using lookup table
def rightmost_set_bit_lookup(n: int) -> int:
    """Fast lookup using precomputed table."""
    if n == 0:
        return -1
    
    lookup = [
        0, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
        4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0
    ]
    
    return lookup[(n & -n) % 37]  # Mod 37 trick for 32-bit
```

---

### Tactic 7: Count Bits in 64-bit Integer

```python
def hamming_weight_64(n: int) -> int:
    """Count set bits in 64-bit integer."""
    # Split into two 32-bit halves
    lower = n & 0xFFFFFFFF
    upper = (n >> 32) & 0xFFFFFFFF
    return hamming_weight(lower) + hamming_weight(upper)
```

**Built-in alternatives:**
- C/C++: `__builtin_popcountll(n)`
- Java: `Long.bitCount(n)`
- Python: `n.bit_count()` (works for arbitrary precision)

---

### Tactic 8: Brian Kernighan for JavaScript (Unsigned)

```javascript
function hammingWeight(n) {
    let count = 0;
    
    // Use >>> 0 to ensure unsigned 32-bit
    n = n >>> 0;
    
    while (n !== 0) {
        count++;
        n &= (n - 1) >>> 0;
    }
    
    return count;
}
```

**Why `>>>`:** JavaScript bitwise operators work on 32-bit signed integers. `>>>` forces unsigned interpretation.

---

### Tactic Comparison

| Tactic | Use Case | Key Operation |
|--------|----------|---------------|
| **Range counting** | LeetCode 338 | `dp[i] = dp[i >> 1] + (i & 1)` |
| **Parallel SWAR** | No-loop counting | Parallel bit summing |
| **Hamming distance** | Compare two numbers | `hamming_weight(x ^ y)` |
| **Total distance** | All pairs | Count 1s/0s per bit position |
| **Power of two** | Single bit check | `n & (n - 1) == 0` |
| **Rightmost bit** | Position finding | `n & -n` |
| **64-bit** | Large integers | Split or use `popcountll` |

<!-- back -->
