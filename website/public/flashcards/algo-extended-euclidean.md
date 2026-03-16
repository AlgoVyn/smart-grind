## Extended Euclidean Algorithm

**Question:** Find x, y such that ax + by = gcd(a, b)?

<!-- front -->

---

## Answer: Recursive Extended GCD

### Solution
```python
def extended_gcd(a, b):
    if a == 0:
        return (b, 0, 1)
    
    gcd, x1, y1 = extended_gcd(b % a, a)
    
    x = y1 - (b // a) * x1
    y = x1
    
    return (gcd, x, y)

def mod_inverse(a, m):
    gcd, x, y = extended_gcd(a, m)
    if gcd != 1:
        return None  # No inverse
    return x % m
```

### Visual: Extended GCD
```
Find x, y: 35x + 15y = gcd(35, 15)

gcd(35, 15):
  = gcd(15, 5) → gcd(5, 0) → return (5, 0, 1)
  
Backtrack:
  gcd=5, x1=0, y1=1
  x = 1 - (15//5)*0 = 1
  y = 0
  
Backtrack:
  gcd=5, x1=1, y1=0  
  x = 0 - (35//15)*1 = 0 - 2 = -2
  y = 1
  
Backtrack:
  gcd=5, x1=-2, y1=1
  x = 1 - (15//35)*(-2) = 1 - 0 = 1
  y = -2

Result: 35(1) + 15(-2) = 35 - 30 = 5 ✓

x = 1, y = -2
```

### ⚠️ Tricky Parts

#### 1. Why It Works
```python
# Euclidean: gcd(a,b) = gcd(b, a%b)
# Extended finds x,y for each step
# Backtrack to find original coefficients

# Key: b = (b//a)*a + b%a
```

#### 2. Modular Inverse
```python
# a has inverse mod m iff gcd(a,m) = 1
# Use extended_gcd to find inverse

def mod_inverse(a, m):
    gcd, x, y = extended_gcd(a % m, m)
    if gcd != 1:
        return None
    return x % m
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Extended GCD | O(log min(a,b)) | O(log min(a,b)) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong base case | a == 0 return (b, 0, 1) |
| Not handling negatives | Use % m for inverse |
| Wrong division | Use // for integer division |

<!-- back -->
