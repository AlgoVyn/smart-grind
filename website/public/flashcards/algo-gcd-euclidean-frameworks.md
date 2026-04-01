## GCD Euclidean: Frameworks

What are the standard implementations for Euclidean GCD?

<!-- front -->

---

### Iterative Framework

```python
def gcd_iterative(a, b):
    """
    Iterative Euclidean algorithm
    Most efficient for production code
    """
    a, b = abs(a), abs(b)
    
    while b != 0:
        a, b = b, a % b
    
    return a

# With early termination
def gcd_optimized(a, b):
    """Handle edge cases"""
    if a == 0:
        return abs(b)
    if b == 0:
        return abs(a)
    
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a
```

---

### Recursive Framework

```python
def gcd_recursive(a, b):
    """
    Recursive Euclidean algorithm
    Clean but higher overhead
    """
    a, b = abs(a), abs(b)
    
    if b == 0:
        return a
    
    return gcd_recursive(b, a % b)

# Tail-call optimizable version
def gcd_tail(a, b):
    a, b = abs(a), abs(b)
    return a if b == 0 else gcd_tail(b, a % b)
```

---

### Extended GCD Framework

```python
def extended_gcd(a, b):
    """
    Returns (gcd, x, y) where ax + by = gcd
    """
    if b == 0:
        return (a, 1, 0) if a > 0 else (-a, -1, 0)
    
    g, x1, y1 = extended_gcd(b, a % b)
    
    x = y1
    y = x1 - (a // b) * y1
    
    return (g, x, y)

# Iterative extended GCD
def extended_gcd_iter(a, b):
    """
    Iterative version - more efficient
    """
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1
    
    while r != 0:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t
    
    return (old_r, old_s, old_t)
```

---

### Multi-Number GCD

```python
from functools import reduce

def gcd_multiple(numbers):
    """
    GCD of a list of numbers
    """
    if not numbers:
        return 0
    return reduce(gcd_iterative, numbers)

def gcd_array(arr):
    """
    GCD of array with early termination check
    """
    if not arr:
        return 0
    
    result = abs(arr[0])
    for num in arr[1:]:
        result = gcd_iterative(result, abs(num))
        if result == 1:  # Early termination
            break
    
    return result
```

---

### LCM and GCD Framework

```python
def lcm(a, b):
    """
    Least Common Multiple
    lcm(a, b) = |a * b| / gcd(a, b)
    """
    if a == 0 or b == 0:
        return 0
    return abs(a * b) // gcd_iterative(a, b)

def lcm_multiple(numbers):
    """
    LCM of multiple numbers
    """
    from functools import reduce
    return reduce(lcm, numbers, 1)

# Combined GCD-LCM computation
def gcd_lcm(a, b):
    """Return both GCD and LCM efficiently"""
    g = gcd_iterative(a, b)
    l = abs(a * b) // g if g != 0 else 0
    return g, l
```

<!-- back -->
