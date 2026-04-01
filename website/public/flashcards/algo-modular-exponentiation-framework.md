## Modular Exponentiation: Framework

What are the complete implementations for modular exponentiation?

<!-- front -->

---

### Binary Exponentiation (Iterative)

```python
def mod_pow(base, exp, mod):
    """
    Compute (base^exp) % mod using binary exponentiation.
    Time: O(log exp), Space: O(1)
    """
    result = 1
    base = base % mod
    
    while exp > 0:
        # If exp is odd, multiply result by base
        if exp & 1:  # Same as exp % 2 == 1
            result = (result * base) % mod
        
        # Square the base
        base = (base * base) % mod
        
        # Divide exp by 2
        exp >>= 1  # Same as exp //= 2
    
    return result
```

---

### Binary Exponentiation (Recursive)

```python
def mod_pow_recursive(base, exp, mod):
    """Recursive version - elegant but uses stack"""
    if exp == 0:
        return 1
    
    base = base % mod
    
    # Compute base^(exp/2)
    half = mod_pow_recursive(base, exp // 2, mod)
    
    if exp % 2 == 0:
        return (half * half) % mod
    else:
        return (half * half * base) % mod
```

---

### Python Built-in (Fastest)

```python
# Python's built-in is optimized in C
def mod_pow_builtin(base, exp, mod):
    """Use Python's optimized implementation"""
    return pow(base, exp, mod)  # Three-argument pow!
```

**Note**: Always use `pow(base, exp, mod)` in Python - it's fastest.

---

### Large Number Handling

```python
def mod_pow_large(base, exp, mod):
    """Handle very large numbers safely"""
    # Ensure all inputs are integers
    base = int(base) % mod
    exp = int(exp)
    mod = int(mod)
    
    # Handle negative exponent (requires modular inverse)
    if exp < 0:
        base = mod_inverse(base, mod)
        exp = -exp
    
    result = 1
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    
    return result
```

---

### Multi-precision (When No Native Support)

```python
class BigModPow:
    """For languages without big integer support"""
    
    @staticmethod
    def mul_mod(a, b, mod):
        """(a × b) % mod without overflow"""
        # Russian peasant multiplication
        result = 0
        a %= mod
        while b > 0:
            if b & 1:
                result = (result + a) % mod
            a = (a * 2) % mod
            b >>= 1
        return result
    
    @staticmethod
    def pow_mod(base, exp, mod):
        """Modular exponentiation with safe multiplication"""
        result = 1
        base %= mod
        while exp > 0:
            if exp & 1:
                result = BigModPow.mul_mod(result, base, mod)
            base = BigModPow.mul_mod(base, base, mod)
            exp >>= 1
        return result
```

<!-- back -->
