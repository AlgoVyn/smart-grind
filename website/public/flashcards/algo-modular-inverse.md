## Modular Inverse - Using Extended GCD

**Question:** When does modular inverse not exist?

<!-- front -->

---

## Modular Inverse

### Definition
a^(-1) mod n ≡ x such that (a × x) ≡ 1 (mod n)

### When Does It Exist?
**Only when gcd(a, n) = 1** (a and n are coprime)

### Using Extended Euclidean
```python
def mod_inverse(a, mod):
    # Returns x such that (a*x) % mod = 1
    
    def extended_gcd(a, b):
        if b == 0:
            return (a, 1, 0)
        
        gcd, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        
        return (gcd, x, y)
    
    gcd, x, y = extended_gcd(a, mod)
    
    if gcd != 1:
        return -1  # No inverse exists
    
    return x % mod
```

### Example
```
Find 3^(-1) mod 11:

gcd(3, 11) = 1 (exists!)

extended_gcd(3, 11):
→ x = -3, y = 1

3^(-1) = -3 mod 11 = 8 ✓

Check: 3 × 8 = 24 ≡ 1 (mod 11) ✓
```

### ❌ No Inverse Example
```
Find 6^(-1) mod 9:

gcd(6, 9) = 3 ≠ 1

No solution! (6, 12, 18, ... none ≡ 1 mod 9)
```

<!-- back -->
