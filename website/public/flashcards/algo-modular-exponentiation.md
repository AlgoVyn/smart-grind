## Modular Exponentiation - Fast Power

**Question:** How does the exponentiation by squaring work?

<!-- front -->

---

## Modular Exponentiation

### The Problem
Calculate (a^b) mod m efficiently.
a^b grows too fast for direct computation.

### Binary Exponentiation
```python
def mod_pow(base, exp, mod):
    result = 1
    base = base % mod
    
    while exp > 0:
        # If exp is odd, multiply result by base
        if exp & 1:
            result = (result * base) % mod
        
        # Square the base
        base = (base * base) % mod
        
        # Divide exp by 2
        exp >>= 1
    
    return result
```

### Why It Works
```
a^13 = a^8 × a^4 × a^1
      = a^(1101 in binary)

13 = 8 + 4 + 1
   = 2^3 + 2^2 + 2^0
```

### Trace Example
```
a^13, mod m:

Step 1: exp=13 (odd)  → result = 1*a = a
        base = a^2
        exp = 6
        
Step 2: exp=6 (even)  → result = a
        base = a^4
        exp = 3
        
Step 3: exp=3 (odd)  → result = a * a^4 = a^5
        base = a^8
        exp = 1
        
Step 4: exp=1 (odd)  → result = a^5 * a^8 = a^13 ✓
        exp = 0
```

### Complexity: O(log exp)

<!-- back -->
