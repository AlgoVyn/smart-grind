## Modular Inverse: Forms & Variations

What are the different forms and variations of modular inverse problems?

<!-- front -->

---

### Form 1: Single Value Inverse

```python
# Standard: find a⁻¹ mod m
result = mod_inverse(a, m)

# Applications:
# - Division in modular arithmetic
# - RSA private key
# - Solving linear congruences
```

---

### Form 2: Batch Inverse Computation

```python
def batch_inverse(values, mod):
    """
    Compute inverses for many values efficiently.
    O(n) instead of O(n log mod) for n inverses.
    """
    n = len(values)
    prefix = [1] * (n + 1)
    
    # Prefix products
    for i in range(n):
        prefix[i + 1] = (prefix[i] * values[i]) % mod
    
    # Inverse of total product
    total_inv = mod_inverse(prefix[n], mod)
    
    # Suffix inverses
    suffix = 1
    inverses = [0] * n
    
    for i in range(n - 1, -1, -1):
        # inv(values[i]) = prefix[i] * suffix * total_inv
        inverses[i] = (prefix[i] * suffix) % mod
        inverses[i] = (inverses[i] * total_inv) % mod
        suffix = (suffix * values[i]) % mod
    
    return inverses
```

---

### Form 3: Inverse for Range [1, n]

```python
def inverse_range(n, mod):
    """All inverses from 1 to n for prime mod"""
    inv = [0] * (n + 1)
    inv[1] = 1
    
    for i in range(2, n + 1):
        inv[i] = mod - (mod // i) * inv[mod % i] % mod
    
    return inv

# Usage: inv = inverse_range(1000000, 10**9 + 7)
# Then inv[k] gives k⁻¹ mod m in O(1)
```

---

### Form 4: Matrix Inverse (Modular)

```python
def matrix_mod_inverse(M, mod):
    """
    Compute inverse of matrix under mod.
    Returns None if singular mod p.
    """
    n = len(M)
    # Augment with identity
    aug = [row[:] + [1 if i == j else 0 for j in range(n)]
           for i, row in enumerate(M)]
    
    # Gaussian elimination mod p
    for col in range(n):
        # Find pivot
        pivot = None
        for row in range(col, n):
            if aug[row][col] % mod != 0:
                pivot = row
                break
        
        if pivot is None:
            return None  # Singular
        
        aug[col], aug[pivot] = aug[pivot], aug[col]
        
        # Normalize row
        inv = mod_inverse(aug[col][col], mod)
        for j in range(2 * n):
            aug[col][j] = (aug[col][j] * inv) % mod
        
        # Eliminate
        for row in range(n):
            if row != col and aug[row][col] != 0:
                factor = aug[row][col]
                for j in range(2 * n):
                    aug[row][j] = (aug[row][j] - 
                        factor * aug[col][j]) % mod
    
    # Extract inverse
    return [row[n:] for row in aug]
```

---

### Form 5: Division in Modular Arithmetic

```python
def mod_divide(a, b, m):
    """Compute (a / b) mod m = (a * b⁻¹) mod m"""
    inv_b = mod_inverse(b % m, m)
    if inv_b is None:
        raise ValueError("Division by non-invertible element")
    return (a * inv_b) % m

# Example: (7 / 3) mod 11
# = 7 × 3⁻¹ mod 11
# = 7 × 4 mod 11  (since 3×4=12≡1 mod 11)
# = 28 mod 11 = 6
```

<!-- back -->
