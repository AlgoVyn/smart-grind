## Count Bits: Problem Forms

What are the variations and extensions of bit counting problems?

<!-- front -->

---

### Range Sum of Bits

```python
def sum_of_bits_in_range(n: int) -> int:
    """
    Total number of set bits in all numbers from 0 to n
    """
    total = 0
    for i in range(n + 1):
        total += popcount(i)
    return total

# Optimized: find pattern per bit position
def sum_of_bits_optimized(n: int) -> int:
    """
    O(log n) using bit position analysis
    """
    total = 0
    i = 1  # Current bit position (2^i)
    
    while i <= n:
        # Complete cycles: i ones, i zeros
        complete_cycles = (n + 1) // (i * 2)
        total += complete_cycles * i
        
        # Remainder: partial cycle
        remainder = (n + 1) % (i * 2)
        total += max(0, remainder - i)
        
        i <<= 1
    
    return total
```

---

### Find Numbers with Specific Bit Count

```python
def find_numbers_with_k_bits(n: int, k: int) -> list:
    """
    Find all numbers ≤ n with exactly k bits set
    """
    result = []
    for i in range(n + 1):
        if popcount(i) == k:
            result.append(i)
    return result

# Optimized using combinations
def find_numbers_with_k_bits_fast(n: int, k: int) -> list:
    """
    Generate by placing k bits in positions
    """
    from itertools import combinations
    
    result = []
    num_bits = n.bit_length()
    
    for positions in combinations(range(num_bits), k):
        num = sum(1 << p for p in positions)
        if num <= n:
            result.append(num)
    
    return sorted(result)
```

---

### Next Number with Same Popcount

```python
def next_with_same_popcount(x: int) -> int:
    """
    Next larger number with same number of 1 bits
    """
    # c: rightmost non-trailing zero
    c = x & -x
    r = x + c
    
    # Ones need to be right-adjusted
    ones = ((r ^ x) >> 2) // c
    
    return r | ones

# Example: x = 6 (110), popcount = 2
# Next: 9 (1001), 10 (1010), 12 (1100)
# next_with_same_popcount(6) = 9
```

---

### Hamming Distance Between All Pairs

```python
def total_hamming_distance(nums: list) -> int:
    """
    Sum of hamming distances between all pairs
    """
    total = 0
    n = len(nums)
    
    # For each bit position
    for i in range(32):
        # Count numbers with this bit set
        count = sum(1 for num in nums if num & (1 << i))
        # Pairs with different bits at position i
        total += count * (n - count)
    
    return total
```

---

### Prime Number of Set Bits

```python
def prime_set_bits(left: int, right: int) -> int:
    """
    Count numbers in range whose popcount is prime
    """
    # Primes up to 32 (max bits for int32)
    primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31}
    
    count = 0
    for i in range(left, right + 1):
        if popcount(i) in primes:
            count += 1
    
    return count
```

<!-- back -->
