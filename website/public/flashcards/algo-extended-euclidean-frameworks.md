## Extended Euclidean: Frameworks

What is the recursive and iterative framework for implementing Extended Euclidean?

<!-- front -->

---

### Recursive Framework

```python
def extended_gcd(a, b):
    """
    Returns (gcd, x, y) where ax + by = gcd
    """
    if a == 0:
        return (b, 0, 1)  # Base: 0·x + b·y = b
    
    # Recursive: solve for (b % a, a)
    gcd, x1, y1 = extended_gcd(b % a, a)
    
    # Backtrack: x = y1 - floor(b/a) * x1
    x = y1 - (b // a) * x1
    y = x1
    
    return (gcd, x, y)
```

**Key insight:** If `b % a = b - ⌊b/a⌋·a`, then:
```
gcd = (b % a)·x1 + a·y1
    = (b - ⌊b/a⌋·a)·x1 + a·y1
    = b·x1 + a·(y1 - ⌊b/a⌋·x1)
    = a·x + b·y ✓
```

---

### Iterative Framework

```python
def extended_gcd_iter(a, b):
    """
    Iterative version - better for large inputs
    """
    old_r, r = a, b
    old_s, s = 1, 0  # Coeff for a
    old_t, t = 0, 1  # Coeff for b
    
    while r != 0:
        q = old_r // r
        # Update remainders
        old_r, r = r, old_r - q * r
        # Update s coefficients
        old_s, s = s, old_s - q * s
        # Update t coefficients
        old_t, t = t, old_t - q * t
    
    return (old_r, old_s, old_t)  # gcd, x, y
```

---

### Modular Inverse Framework

```python
def mod_inverse(a, m):
    """
    Find x where a·x ≡ 1 (mod m)
    Returns None if inverse doesn't exist
    """
    gcd, x, y = extended_gcd(a % m, m)
    
    if gcd != 1:
        return None  # No inverse exists
    
    # Ensure positive result
    return (x % m + m) % m
```

**Existence condition:** Inverse exists iff gcd(a, m) = 1 (a and m coprime)

---

### Linear Diophantine Solver

```python
def solve_diophantine(a, b, c):
    """
    Find integer solutions to ax + by = c
    Returns particular solution or None
    """
    gcd, x0, y0 = extended_gcd(abs(a), abs(b))
    
    if c % gcd != 0:
        return None  # No solution
    
    # Scale particular solution
    scale = c // gcd
    x0 *= scale
    y0 *= scale
    
    # General solution:
    # x = x0 + (b/gcd)·t
    # y = y0 - (a/gcd)·t
    # for any integer t
    
    return (x0, y0, abs(b)//gcd, abs(a)//gcd)
```

<!-- back -->
