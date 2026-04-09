## DP - Fibonacci Style: Tactics

What are the advanced techniques for Fibonacci-style DP?

<!-- front -->

---

### Tactic 1: Matrix Exponentiation for F(n)

```python
def fib_matrix(n):
    """Calculate F(n) in O(log n) using matrix exponentiation."""
    if n <= 1:
        return n
    
    def multiply(A, B):
        """Multiply two 2x2 matrices."""
        return [[A[0][0]*B[0][0] + A[0][1]*B[1][0],
                 A[0][0]*B[0][1] + A[0][1]*B[1][1]],
                [A[1][0]*B[0][0] + A[1][1]*B[1][0],
                 A[1][0]*B[0][1] + A[1][1]*B[1][1]]]
    
    def power(M, n):
        """Matrix exponentiation."""
        if n == 1:
            return M
        if n % 2 == 0:
            half = power(M, n // 2)
            return multiply(half, half)
        else:
            return multiply(M, power(M, n - 1))
    
    M = [[1, 1], [1, 0]]
    result = power(M, n)
    return result[0][1]
```

---

### Tactic 2: Fast Doubling

```python
def fib_fast_doubling(n):
    """Even faster O(log n) method."""
    def helper(n):
        if n == 0:
            return (0, 1)
        a, b = helper(n >> 1)
        c = a * ((b << 1) - a)
        d = a * a + b * b
        if n & 1:
            return (d, c + d)
        return (c, d)
    return helper(n)[0]
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong base cases | Wrong result | F(0)=0, F(1)=1 |
| Integer overflow | Wrong value | Use modulo for large n |
| Recursion depth | Stack overflow | Use iterative |
| Wrong variable order | Old values | Update in correct order |

---

### Tactic 4: House Robber Variant

```python
def house_robber(nums):
    """Max money without robbing adjacent houses."""
    if not nums:
        return 0
    if len(nums) <= 2:
        return max(nums)
    
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

<!-- back -->
