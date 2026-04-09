## DP - Fibonacci Style: Forms

What are the different variations of Fibonacci-style DP?

<!-- front -->

---

### Form 1: Standard Fibonacci

```python
def fibonacci(n):
    """Standard Fibonacci."""
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

---

### Form 2: Climbing Stairs

```python
def climb_stairs(n):
    """Ways to climb n stairs (1 or 2 steps)."""
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
```

---

### Form 3: House Robber

```python
def house_robber(nums):
    """Max money without robbing adjacent."""
    if not nums:
        return 0
    a, b = 0, nums[0]
    for i in range(1, len(nums)):
        a, b = b, max(b, a + nums[i])
    return b
```

---

### Form 4: Matrix Exponentiation

```python
def fib_matrix(n):
    """O(log n) Fibonacci."""
    if n <= 1:
        return n
    # Matrix [[1,1],[1,0]]^n gives F(n+1), F(n)
    # Implementation from tactics
```

---

### Form Comparison

| Form | Transition | Space | Use Case |
|------|------------|-------|----------|
| Fibonacci | a+b | O(1) | Standard |
| Climbing | a+b | O(1) | Count ways |
| House robber | max | O(1) | Optimization |
| Matrix exp | Power | O(1) | Huge n |

<!-- back -->
