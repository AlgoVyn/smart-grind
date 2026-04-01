## Modular Inverse: Framework

What are the complete implementations for modular inverse computation?

<!-- front -->

---

### Extended Euclidean Algorithm (Iterative)

```python
def mod_inverse(a, m):
    """
    Compute modular inverse using Extended Euclidean.
    Returns x such that (a * x) % m = 1.
    Returns None if inverse doesn't exist.
    """
    a = a % m
    
    # Extended Euclidean
    t, new_t = 0, 1
    r, new_r = m, a
    
    while new_r != 0:
        quotient = r // new_r
        t, new_t = new_t, t - quotient * new_t
        r, new_r = new_r, r - quotient * new_r
    
    if r > 1:
        return None  # Inverse doesn't exist
    
    if t < 0:
        t += m
    
    return t
```

---

### Extended Euclidean (Recursive)

```python
def egcd(a, b):
    """Extended GCD - returns (g, x, y) where ax + by = g = gcd(a,b)"""
    if b == 0:
        return (a, 1, 0)
    
    g, x1, y1 = egcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return (g, x, y)

def mod_inverse_egcd(a, m):
    """Modular inverse using recursive EGCD"""
    g, x, _ = egcd(a % m, m)
    if g != 1:
        return None  # No inverse
    return (x % m + m) % m  # Ensure positive
```

---

### Fermat's Little Theorem (Prime Modulus)

```python
def mod_inverse_fermat(a, p):
    """
    Compute inverse when p is prime.
    Uses Fermat: a^(p-2) ≡ a⁻¹ (mod p)
    """
    if a % p == 0:
        return None  # No inverse for 0
    
    return pow(a, p - 2, p)  # Python's fast pow
```

---

### Python Built-in (Python 3.8+)

```python
def mod_inverse_builtin(a, m):
    """Use Python's built-in when available"""
    try:
        return pow(a, -1, m)  # Python 3.8+
    except TypeError:
        return mod_inverse(a, m)  # Fallback
```

---

### Precomputation for Small Primes

```python
def precompute_inverses(mod):
    """
    O(mod) precompute all inverses for prime mod.
    Useful when making many queries.
    """
    inv = [0] * mod
    inv[1] = 1
    
    for i in range(2, mod):
        # mod = k*i + r, so inv[i] = -k * inv[r] mod mod
        inv[i] = mod - (mod // i) * inv[mod % i] % mod
    
    return inv

# Example: inv = precompute_inverses(10**9 + 7)
# Then O(1) lookup for any inverse
```

<!-- back -->
