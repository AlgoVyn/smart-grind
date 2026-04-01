## GCD Euclidean: Tactics & Applications

What tactical patterns leverage GCD for problem solving?

<!-- front -->

---

### Tactic 1: Diophantine Equations

```python
def solve_linear_diophantine(a, b, c):
    """
    Find integer solutions to ax + by = c
    Returns particular solution or None
    """
    g = math.gcd(a, b)
    
    if c % g != 0:
        return None  # No solution
    
    # Find solution to ax + by = g
    _, x0, y0 = extended_gcd(a, b)
    
    # Scale to get solution for ax + by = c
    scale = c // g
    x0 *= scale
    y0 *= scale
    
    # General solution:
    # x = x0 + (b/g)·t
    # y = y0 - (a/g)·t
    # for any integer t
    
    return {
        'x0': x0,
        'y0': y0,
        'dx': b // g,
        'dy': -a // g
    }

def find_positive_solution(a, b, c):
    """Find solution with x > 0, y > 0"""
    sol = solve_linear_diophantine(a, b, c)
    if not sol:
        return None
    
    x0, y0, dx, dy = sol['x0'], sol['y0'], sol['dx'], sol['dy']
    
    # Find t such that x0 + dx·t > 0 and y0 + dy·t > 0
    # Solve inequalities for t
    
    # x = x0 + dx·t > 0  →  t > -x0/dx (if dx > 0)
    # y = y0 + dy·t > 0  →  t > -y0/dy (if dy > 0)
    
    # Similar for dx < 0, dy < 0
    # Find valid t range and pick any integer in it
    
    pass
```

---

### Tactic 2: Modular Arithmetic

```python
def mod_inverse(a, m):
    """
    Find x such that a·x ≡ 1 (mod m)
    Exists iff gcd(a, m) = 1
    """
    g, x, y = extended_gcd(a % m, m)
    
    if g != 1:
        return None  # No inverse
    
    return (x % m + m) % m

def solve_modular_equation(a, b, m):
    """
    Solve a·x ≡ b (mod m)
    """
    g = math.gcd(a, m)
    
    if b % g != 0:
        return []  # No solution
    
    # Reduce
    a_reduced = a // g
    b_reduced = b // g
    m_reduced = m // g
    
    # Find inverse of a_reduced mod m_reduced
    inv = mod_inverse(a_reduced, m_reduced)
    x0 = (b_reduced * inv) % m_reduced
    
    # All solutions: x = x0 + k·(m/g) for k = 0, 1, ..., g-1
    return [(x0 + k * m_reduced) % m for k in range(g)]
```

---

### Tactic 3: Fraction Reduction

```python
class Fraction:
    """Exact fraction arithmetic using GCD"""
    
    def __init__(self, num, den):
        if den == 0:
            raise ValueError("Zero denominator")
        
        # Reduce to lowest terms
        g = math.gcd(abs(num), abs(den))
        num //= g
        den //= g
        
        # Normalize sign
        if den < 0:
            num, den = -num, -den
        
        self.num = num
        self.den = den
    
    def __add__(self, other):
        num = self.num * other.den + other.num * self.den
        den = self.den * other.den
        return Fraction(num, den)
    
    def __mul__(self, other):
        # Cross-cancel first to prevent overflow
        g1 = math.gcd(self.num, other.den)
        g2 = math.gcd(other.num, self.den)
        
        num = (self.num // g1) * (other.num // g2)
        den = (self.den // g2) * (other.den // g1)
        
        return Fraction(num, den)  # Will reduce again
```

---

### Tactic 4: Array GCD Properties

```python
def gcd_range_queries(arr):
    """
    Preprocess for fast GCD range queries
    """
    from math import gcd
    
    n = len(arr)
    LOG = 20
    
    # Sparse table
    st = [[0] * n for _ in range(LOG)]
    st[0] = arr[:]
    
    for k in range(1, LOG):
        for i in range(n - (1 << k) + 1):
            st[k][i] = gcd(st[k-1][i], st[k-1][i + (1 << (k-1))])
    
    def query(l, r):
        """GCD of arr[l..r] inclusive"""
        length = r - l + 1
        k = length.bit_length() - 1
        return gcd(st[k][l], st[k][r - (1 << k) + 1])
    
    return query

def longest_subarray_with_gcd(arr, target_gcd):
    """
    Find longest subarray with GCD = target
    """
    n = len(arr)
    max_len = 0
    
    for i in range(n):
        current_gcd = 0
        for j in range(i, n):
            current_gcd = math.gcd(current_gcd, arr[j])
            if current_gcd == target_gcd:
                max_len = max(max_len, j - i + 1)
            elif current_gcd < target_gcd:
                break  # GCD only decreases
    
    return max_len
```

---

### Tactic 5: Cyclic Patterns

```python
def find_cyclic_equivalence(a, b):
    """
    Check if arrays are cyclically equivalent
    Using GCD of lengths for efficient checking
    """
    if len(a) != len(b):
        return False
    
    n = len(a)
    
    # Try all offsets that divide n (optimization)
    # Or use KMP to find b in a+a
    
    # GCD connection: period of cyclic string divides n
    g = math.gcd(n, some_parameter)
    
    # Check equivalence at positions that are gcd-apart
    pass
```

<!-- back -->
