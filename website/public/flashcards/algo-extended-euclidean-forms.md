## Extended Euclidean: Forms & Variations

What are the different forms and variations of Extended Euclidean algorithm?

<!-- front -->

---

### Standard Form

```python
def extended_gcd(a, b):
    if a == 0:
        return (b, 0, 1)
    g, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return (g, x, y)
```

Returns: `(gcd, x, y)` where `a·x + b·y = gcd`

---

### Tail-Recursive Form

```python
def extended_gcd_tail(a, b, x0=1, y0=0, x1=0, y1=1):
    """
    Tail recursive - some languages optimize this
    """
    if b == 0:
        return (a, x0, y0)
    
    q = a // b
    return extended_gcd_tail(
        b, a % b,
        x1, y1,
        x0 - q*x1, y0 - q*y1
    )
```

---

### Matrix Form

Extended GCD can be expressed using 2×2 matrices:

```
[a]   [q  1]   [b]
[b] = [1  0] × [a % b]
```

Accumulating transformation matrices gives the coefficients directly.

```python
def extended_gcd_matrix(a, b):
    """Returns [[x, y], [z, w]] where [[a],[b]] = M·[[gcd],[0]]"""
    if b == 0:
        return [[1, 0], [0, 1]], a
    
    q = a // b
    M, g = extended_gcd_matrix(b, a % b)
    
    # Multiply by elementary matrix
    return [[M[1][0], M[1][1]], 
            [M[0][0] - q*M[1][0], M[0][1] - q*M[1][1]]], g
```

---

### Binary Extended GCD (Stein's Algorithm Extension)

For large integers, binary GCD can be extended:

```python
def binary_extended_gcd(a, b):
    """
    Extended binary GCD - avoids division
    Uses only shifts and subtractions
    """
    if a == 0:
        return (b, 0, 1)
    if b == 0:
        return (a, 1, 0)
    
    # Factor out powers of 2
    shift = 0
    while ((a | b) & 1) == 0:
        a >>= 1
        b >>= 1
        shift += 1
    
    u, v = a, b
    while (u & 1) == 0:
        u >>= 1
    while u != v:
        v >>= (v & 1) ^ 1  # Divide v by 2 if even
        if u > v:
            u, v = v, u
        v = v - u
    
    g = u << shift
    # Coefficients need additional tracking
    return (g, None, None)  # Simplified
```

---

### Extended GCD for Multiple Numbers

```python
def extended_gcd_multi(numbers):
    """
    Extended GCD for list of numbers
    Returns (gcd, [coefficients])
    """
    if len(numbers) == 1:
        return (numbers[0], [1])
    
    # Process pairwise
    gcd_val, coeffs = numbers[0], [1]
    
    for i, num in enumerate(numbers[1:], 1):
        g, x, y = extended_gcd(gcd_val, num)
        # Update all previous coefficients
        new_coeffs = [c * x for c in coeffs] + [y]
        gcd_val, coeffs = g, new_coeffs
    
    return (gcd_val, coeffs)
```

<!-- back -->
