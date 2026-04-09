## Bitwise DP - Counting Bits Optimization: Problem Forms

What are the variations and extensions of counting bits problems?

<!-- front -->

---

### Form 1: Sum of Hamming Weights

**Problem:** Return the sum of set bits for all numbers from 0 to n.

```python
def sum_hamming_weights(n: int) -> int:
    """
    Sum of all ans[i] for i in [0, n].
    LeetCode 477 variation.
    """
    ans = [0] * (n + 1)
    total = 0
    
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
        total += ans[i]
    
    return total

# Alternative: Mathematical O(log n) solution
# dp[n] = (n + 1) // 2 + 2 * dp[n // 2] - (n // 2 + 1)
```

---

### Form 2: Counting Bits in Range [l, r]

**Problem:** Count bits for numbers in a subrange.

```python
def count_bits_range(n: int, l: int, r: int) -> list:
    """
    Return ans[l..r] inclusive.
    Compute full array, then slice.
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    
    return ans[l:r + 1]

def count_bits_range_efficient(l: int, r: int) -> list:
    """
    If only subrange needed and range is small,
    compute just the required portion using built-in.
    """
    return [i.bit_count() for i in range(l, r + 1)]
```

---

### Form 3: Number with Maximum Set Bits

**Problem:** Find which number in [0, n] has the most set bits.

```python
def max_set_bits_number(n: int) -> int:
    """
    Find number in [0, n] with maximum set bits.
    """
    ans = [0] * (n + 1)
    max_bits = 0
    max_num = 0
    
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
        if ans[i] > max_bits:
            max_bits = ans[i]
            max_num = i
    
    return max_num  # Returns 2^k - 1 form (all 1s)

# Insight: Answer is always of form 2^k - 1 ≤ n
# Or n itself if n = 2^k - 1
```

---

### Form 4: Numbers with Exactly k Set Bits

**Problem:** Find all numbers in [0, n] with exactly k set bits.

```python
def numbers_with_k_bits(n: int, k: int) -> list:
    """
    Return all numbers ≤ n with exactly k set bits.
    """
    ans = [0] * (n + 1)
    result = []
    
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
        if ans[i] == k:
            result.append(i)
    
    return result

# Alternative: Use combinations of bit positions
# for large n where k is small
```

---

### Form 5: Prime Number of Set Bits

**Problem:** Count numbers where the number of set bits is prime.

```python
def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def count_prime_set_bits(left: int, right: int) -> int:
    """
    LeetCode 762 - Prime Number of Set Bits in Binary Representation.
    """
    # Precompute which bit counts are prime (max is ~20 for 10^6)
    primes = {2, 3, 5, 7, 11, 13, 17, 19}
    
    count = 0
    for i in range(left, right + 1):
        if i.bit_count() in primes:
            count += 1
    
    return count
```

---

### Form 6: Total Hamming Distance

**Problem:** Sum of Hamming distances between all pairs.

```python
def total_hamming_distance(nums: list) -> int:
    """
    LeetCode 477 - Sum of Hamming distances between all pairs.
    """
    n = len(nums)
    total = 0
    
    # For each bit position, count numbers with that bit set
    for i in range(32):
        bit_count = sum((num >> i) & 1 for num in nums)
        # Pairs with different bits = set * unset
        total += bit_count * (n - bit_count)
    
    return total

# Not DP, but related to bit counting per position
```

---

### Form 7: Counting Bits for Large Sparse Input

**Problem:** Only query specific numbers, not full range.

```python
from functools import lru_cache

def count_bits_sparse_queries(queries: list) -> list:
    """
    Handle sparse queries efficiently.
    """
    @lru_cache(maxsize=None)
    def popcount(n: int) -> int:
        if n == 0:
            return 0
        return popcount(n >> 1) + (n & 1)
    
    return [popcount(q) for q in queries]

# Alternative: Brian Kernighan's for single queries
```

---

### Form 8: XOR with Bit Count

**Problem:** Operations involving both XOR and bit counting.

```python
def xor_and_bit_count(arr: list) -> int:
    """
    Example: XOR all elements, then count bits.
    Or: Count bits in XOR of all pairs.
    """
    # XOR all elements first
    xor_result = 0
    for num in arr:
        xor_result ^= num
    
    # Then count bits
    return xor_result.bit_count()

# Related problems often combine bit operations
```

---

### Form 9: Pattern Extension - Reverse Bits

**Problem:** Reverse bits of each number (related bit manipulation).

```python
def reverse_bits(n: int, num_bits: int = 32) -> int:
    """
    LeetCode 190 - Reverse bits of a 32-bit integer.
    """
    result = 0
    for i in range(num_bits):
        # Extract bit i from n, place at position (num_bits - 1 - i)
        if n & (1 << i):
            result |= 1 << (num_bits - 1 - i)
    return result

def reverse_bits_range(n: int) -> list:
    """
    Reverse bits for all numbers 0 to n.
    """
    return [reverse_bits(i) for i in range(n + 1)]
```

---

### Form 10: Check if Power of Two

**Problem:** Identify powers of 2 using bit patterns.

```python
def is_power_of_two(n: int) -> bool:
    """
    LeetCode 231 - Check if n is a power of two.
    
    Powers of 2 have exactly 1 bit set.
    """
    return n > 0 and (n & (n - 1)) == 0

def find_powers_of_two(n: int) -> list:
    """
    Find all powers of 2 ≤ n using bit count property.
    """
    ans = [0] * (n + 1)
    powers = []
    
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
        if ans[i] == 1:  # Exactly one bit set
            powers.append(i)
    
    return powers
```

<!-- back -->
