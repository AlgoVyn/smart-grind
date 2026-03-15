## GCD - Euclidean Algorithm

**Question:** Why does the Euclidean algorithm work?

<!-- front -->

---

## Euclidean GCD Algorithm

### Recursive Implementation
```python
def gcd(a, b):
    if b == 0:
        return abs(a)
    return gcd(b, a % b)
```

### Iterative Implementation
```python
def gcd_iter(a, b):
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a
```

### Why It Works
**Key Property:**
```
gcd(a, b) = gcd(b, a % b)
```

**Proof:**
- Any integer d that divides both a and b also divides a - q*b = a % b
- So gcd(a, b) = gcd(b, a % b)
- This reduces the problem size until b = 0

### Visual Example
```
gcd(48, 18)
= gcd(18, 48 % 18 = 12)
= gcd(12, 18 % 12 = 6)
= gcd(6, 12 % 6 = 0)
= gcd(6, 0)
= 6 ✓
```

### Complexity
- **Time:** O(log min(a, b))
- **Space:** O(log min(a, b)) recursion depth

### 💡 Extended GCD
For solving ax + by = gcd(a, b), use extended Euclidean algorithm.

<!-- back -->
