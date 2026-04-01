## Modular Exponentiation: Tactics & Techniques

What are the tactical patterns for modular exponentiation?

<!-- front -->

---

### Tactic 1: Bit Manipulation for Speed

Use bit operations instead of arithmetic where possible.

```python
def mod_pow_optimized(base, exp, mod):
    result = 1
    base %= mod
    
    while exp:
        # Test LSB instead of % 2
        if exp & 1:
            result = (result * base) % mod
        
        base = (base * base) % mod
        # Right shift instead of // 2
        exp >>= 1
    
    return result
```

| Operation | Arithmetic | Bit | Speed |
|-----------|-----------|-----|-------|
| Mod 2 | `exp % 2` | `exp & 1` | ~2x |
| Divide 2 | `exp // 2` | `exp >> 1` | ~2x |

---

### Tactic 2: Handling Negative Exponents

Negative exponents require modular inverse.

```python
def mod_pow_neg(base, exp, mod):
    """Handle negative exponents"""
    if exp >= 0:
        return pow(base, exp, mod)
    
    # exp < 0: compute inverse first
    inv = pow(base, -1, mod)  # Python 3.8+
    # Or: inv = mod_inverse(base, mod)  # Extended Euclidean
    return pow(inv, -exp, mod)

# Example: 2^-1 mod 5 = 3 (since 2*3 = 6 ≡ 1 mod 5)
# So 2^-3 mod 5 = 3^3 mod 5 = 27 mod 5 = 2
```

---

### Tactic 3: Montgomery Reduction (Advanced)

For extremely large numbers, use Montgomery form.

```python
class Montgomery:
    """Montgomery reduction for fast mod operations"""
    
    def __init__(self, mod):
        self.mod = mod
        self.r = 1 << (mod.bit_length())  # R = 2^k
        self.r_inv = pow(self.r, -1, mod)
        self.r2_mod = (self.r * self.r) % mod
    
    def to_montgomery(self, x):
        return (x * self.r2_mod) % self.mod
    
    def from_montgomery(self, x):
        return (x * self.r_inv) % self.mod
    
    def montgomery_mult(self, a, b):
        """Multiply in Montgomery domain"""
        # Simplified - full implementation needs REDC
        return (a * b) % self.mod
```

---

### Tactic 4: Sliding Window Method

Group bits for fewer multiplications.

```python
def mod_pow_sliding_window(base, exp, mod, k=3):
    """
    k-bit sliding window exponentiation.
    Precompute odd powers up to 2^k - 1.
    """
    # Precompute base^1, base^3, base^5, ..., base^(2^k-1)
    table = {}
    b = base % mod
    b2 = (b * b) % mod
    table[1] = b
    
    for i in range(3, 2**k, 2):
        table[i] = (table[i-2] * b2) % mod
    
    result = 1
    while exp > 0:
        if exp & 1:
            # Find longest odd window starting at LSB
            window = 1
            bits = exp & ((1 << k) - 1)
            if bits:
                # Find largest odd <= bits
                window = bits | 1
                while window > bits:
                    window -= 2
            
            result = (result * table[window]) % mod
            exp -= window
        else:
            result = (result * result) % mod
            exp >>= 1
    
    return result
```

---

### Tactic 5: Fermat's Little Theorem Optimization

When mod is prime, reduce exponent mod (mod-1).

```python
def mod_pow_prime(base, exp, p):
    """Optimized for prime modulus p"""
    # Fermat: a^(p-1) ≡ 1 (mod p)
    # So a^exp ≡ a^(exp mod (p-1)) (mod p)
    if base % p == 0:
        return 0
    
    reduced_exp = exp % (p - 1)
    return pow(base, reduced_exp, p)

# Example: 5^1000000 mod 7
# = 5^(1000000 mod 6) mod 7
# = 5^4 mod 7 = 625 mod 7 = 2
```

<!-- back -->
