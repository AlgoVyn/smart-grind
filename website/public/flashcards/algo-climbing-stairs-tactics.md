## Climbing Stairs: Tactics & Tricks

What are the essential tactics for optimizing climbing stairs solutions?

<!-- front -->

---

### Tactic 1: Recognize Fibonacci Pattern

The key insight is recognizing this is Fibonacci:

```python
# Quick test cases to verify understanding:
n = 0 → 1     (empty)
n = 1 → 1     [1]
n = 2 → 2     [1,1], [2]
n = 3 → 3     [1,1,1], [1,2], [2,1]
n = 4 → 5     [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]
n = 5 → 8

Sequence: 1, 1, 2, 3, 5, 8, 13, 21...
# This is Fibonacci shifted by one position
```

**Memory trick:** F(n+1) gives the answer.

---

### Tactic 2: Space Optimization Pattern

```python
def space_optimized_pattern(n):
    """
    Template for any dp[i] = f(dp[i-1], dp[i-2], ...)
    """
    if n <= 1:
        return base_case
    
    # Keep only needed previous states
    # For Fibonacci, only need 2
    window = [dp[0], dp[1]]  # Initialize
    
    for i in range(2, n + 1):
        # Compute new value from window
        new_val = window[-1] + window[-2]  # Or other formula
        
        # Slide window: drop oldest, add new
        window = [window[-1], new_val]
    
    return window[-1]
```

---

### Tactic 3: Matrix Exponentiation for Large n

When n > 10⁶ or need log time:

```python
def fast_doubling(n):
    """
    Even faster than matrix: O(log n), less overhead
    Uses identity: F(2k) = F(k)[2F(k+1) - F(k)]
                     F(2k+1) = F(k+1)² + F(k)²
    """
    if n == 0:
        return (0, 1)
    
    a, b = fast_doubling(n >> 1)
    c = a * ((b << 1) - a)
    d = a * a + b * b
    
    if n & 1:
        return (d, c + d)
    else:
        return (c, d)

# climb_stairs(n) = fast_doubling(n+1)[0]
```

---

### Tactic 4: Pisano Period for Modulo

Finding F(n) mod m efficiently for very large n:

```python
def fib_mod(n, m):
    """
    F(n) mod m using Pisano period
    Period length ≤ 6m for m > 2
    """
    # Find Pisano period for m
    period = [0, 1]
    while True:
        period.append((period[-1] + period[-2]) % m)
        if period[-2:] == [0, 1] and len(period) > 2:
            break
    
    pisano_len = len(period) - 2
    return period[n % pisano_len]
```

---

### Tactic 5: Rolling Array for Multi-Step

When step sizes vary (not just 1 and 2):

```python
def climb_with_k_steps(n, k, steps):
    """
    General pattern for k different step types
    Space: O(max_step) instead of O(n)
    """
    max_step = max(steps)
    dp = [0] * max_step  # Circular buffer
    dp[0] = 1
    
    for i in range(1, n + 1):
        # Compute new value
        new_val = sum(dp[(i - step) % max_step] 
                      for step in steps if i >= step)
        
        # Roll the array
        dp[i % max_step] = new_val
    
    return dp[n % max_step]
```

<!-- back -->
