## GCD Euclidean: Forms & Variations

What are the different forms and specialized GCD implementations?

<!-- front -->

---

### Binary GCD (Stein's Algorithm)

```python
def binary_gcd(a, b):
    """
    Binary GCD - uses shifts instead of division
    Faster for large integers in some cases
    """
    if a == 0:
        return b
    if b == 0:
        return a
    
    # Find greatest power of 2 dividing both
    shift = 0
    while ((a | b) & 1) == 0:
        a >>= 1
        b >>= 1
        shift += 1
    
    # Remove remaining factors of 2 from a
    while (a & 1) == 0:
        a >>= 1
    
    do:
        # Remove factors of 2 from b
        while (b & 1) == 0:
            b >>= 1
        
        # Ensure a <= b
        if a > b:
            a, b = b, a
        
        b = b - a
    while b != 0
    
    return a << shift
```

**Advantage:** Only shifts, additions, subtractions - no division.

---

### Lehmer's Algorithm (Large Numbers)

```python
def lehmer_gcd(a, b):
    """
    For very large numbers where division is expensive
    Approximates quotient using leading digits
    """
    # Implementation for numbers with hundreds of digits
    # Uses approximate quotients from leading digits
    # Falls back to Euclidean when quotients are small
    pass
```

**Use case:** Cryptographic-size integers (1000+ bits).

---

### GCD with Quotient Sequence

```python
def gcd_with_quotients(a, b):
    """
    Returns quotients from Euclidean algorithm
    Useful for continued fractions
    """
    quotients = []
    
    while b != 0:
        q = a // b
        quotients.append(q)
        a, b = b, a - q * b
    
    return a, quotients

# Continued fraction from quotients
def continued_fraction(quotients):
    """Build continued fraction from quotients"""
    if not quotients:
        return (0, 1)
    if len(quotients) == 1:
        return (quotients[0], 1)
    
    # Recursively build
    num, den = continued_fraction(quotients[1:])
    return (quotients[0] * num + den, num)
```

---

### GCD for Polynomials

```python
def polynomial_gcd(a, b):
    """
    GCD of polynomials over a field
    Uses polynomial division (analogous to Euclidean)
    """
    # a, b are coefficient lists (highest degree first)
    # Similar to Euclidean but with polynomial division
    
    while b and b[-1] == 0:  # Remove trailing zeros
        b.pop()
    
    while len(b) > 0:
        # Polynomial division: a = q*b + r
        q, r = poly_divide(a, b)
        a, b = b, r
    
    # Normalize: make leading coefficient 1
    if a:
        leading = a[-1]
        a = [c / leading for c in a]
    
    return a

def poly_divide(a, b):
    """Polynomial long division, returns (quotient, remainder)"""
    # Implementation omitted for brevity
    pass
```

---

### Subtractive GCD (Historical)

```python
def subtractive_gcd(a, b):
    """
    Original Euclidean algorithm using subtraction
    Slower but illustrates the concept
    """
    a, b = abs(a), abs(b)
    
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    
    return a

# Optimization: remove common powers of 2
def optimized_subtractive(a, b):
    if a == 0:
        return b
    if b == 0:
        return a
    
    # Common factors of 2
    k = 0
    while ((a | b) & 1) == 0:
        a, b = a >> 1, b >> 1
        k += 1
    
    # Make a odd
    while (a & 1) == 0:
        a >>= 1
    
    while b != 0:
        while (b & 1) == 0:
            b >>= 1
        if a > b:
            a, b = b, a
        b = b - a
    
    return a << k
```

<!-- back -->
