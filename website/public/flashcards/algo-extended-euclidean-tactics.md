## Extended Euclidean: Tactics & Applications

What are practical tactics for using Extended Euclidean in problem solving?

<!-- front -->

---

### Tactic 1: Modular Inverse Detection

**Pattern:** "Find x such that a·x ≡ 1 (mod m)"

```python
def has_inverse(a, m):
    """Check if modular inverse exists"""
    return math.gcd(a, m) == 1

def get_inverse(a, m):
    """Get modular inverse with validation"""
    if not has_inverse(a, m):
        raise ValueError(f"No inverse: gcd({a}, {m}) ≠ 1")
    
    _, x, _ = extended_gcd(a % m, m)
    return x % m
```

**When to use:**
- Division under modular arithmetic
- RSA private key calculation
- Solving linear congruences

---

### Tactic 2: Solving Linear Congruences

**Pattern:** Solve `a·x ≡ b (mod m)`

```python
def solve_congruence(a, b, m):
    """
    Solve: a·x ≡ b (mod m)
    Returns all solutions mod m
    """
    g = math.gcd(a, m)
    
    if b % g != 0:
        return []  # No solution
    
    # Reduce
    a_reduced = a // g
    b_reduced = b // g
    m_reduced = m // g
    
    # Find inverse of a_reduced mod m_reduced
    _, inv, _ = extended_gcd(a_reduced % m_reduced, m_reduced)
    inv = (inv % m_reduced + m_reduced) % m_reduced
    
    # Base solution
    x0 = (b_reduced * inv) % m_reduced
    
    # All solutions: x = x0 + k·(m/g) for k = 0, 1, ..., g-1
    return [(x0 + k * m_reduced) % m for k in range(g)]
```

---

### Tactic 3: Fraction Reduction Under Mod

**Pattern:** Compute `(a/b) mod m` when b and m are coprime

```python
def mod_fraction(a, b, m):
    """
    Compute (a / b) mod m = a · b^(-1) mod m
    """
    inv_b = mod_inverse(b, m)
    if inv_b is None:
        raise ValueError(f"Cannot divide by {b} mod {m}")
    return (a * inv_b) % m

# Example
result = mod_fraction(7, 3, 11)  # (7/3) mod 11
# 3^(-1) mod 11 = 4, so 7·4 = 28 ≡ 6 (mod 11)
```

---

### Tactic 4: CRT Precomputation

**Pattern:** Combine multiple congruences efficiently

```python
def crt_two(a1, m1, a2, m2):
    """
    Solve: x ≡ a1 (mod m1), x ≡ a2 (mod m2)
    Returns (solution, lcm) or (None, None) if no solution
    """
    g, p, q = extended_gcd(m1, m2)
    
    if (a2 - a1) % g != 0:
        return (None, None)  # No solution
    
    # Compute solution
    lcm = m1 // g * m2
    x = (a1 + (a2 - a1) // g * p * m1) % lcm
    
    return (x if x >= 0 else x + lcm, lcm)
```

---

### Tactic 5: Finding Particular Solutions

**Pattern:** Find one solution to `a·x + b·y = c`

```python
def find_particular_solution(a, b, c):
    """
    Returns (x, y) such that a·x + b·y = c
    or None if no integer solution exists
    """
    g, x0, y0 = extended_gcd(abs(a), abs(b))
    
    if c % g != 0:
        return None
    
    scale = c // g
    # Handle signs
    x = x0 * scale * (1 if a > 0 else -1)
    y = y0 * scale * (1 if b > 0 else -1)
    
    return (x, y)

# Find minimum positive x

def min_positive_x(a, b, c):
    sol = find_particular_solution(a, b, c)
    if sol is None:
        return None
    
    x, y = sol
    step = abs(b) // math.gcd(a, b)
    
    # Adjust x to be minimum positive
    while x <= 0:
        x += step
        y -= (a // math.gcd(a, b)) * (step // (abs(b) // math.gcd(a, b)))
    
    return x
```

<!-- back -->
