# Matrix Exponentiation

## Category
Math & Number Theory

## Description

**Matrix Exponentiation** is a powerful mathematical technique that computes the n-th power of a matrix in **O(k³ × log n)** time using binary exponentiation (exponentiation by squaring), where k is the matrix dimension. While a naive approach would require O(n) matrix multiplications, this method reduces it to O(log n) multiplications.

The real power of this technique lies in its ability to solve **linear recurrence relations** in logarithmic time. Problems that would normally require linear or exponential time with dynamic programming can be solved in O(log n) time, making it possible to compute values like the 10¹⁸-th Fibonacci number almost instantly.

---

## Concepts

Matrix exponentiation leverages several fundamental mathematical concepts.

### 1. Matrix Multiplication

For two n×n matrices A and B, their product C = A × B is defined as:

```
C[i][j] = Σ A[i][k] × B[k][j] for k = 0 to n-1
```

| Operation | Time Complexity |
|-----------|----------------|
| Standard multiplication | O(n³) |
| Strassen's algorithm | O(n^2.81) |
| For fixed small k (k≤5) | O(1) effectively |

### 2. Binary Exponentiation

To compute Aⁿ efficiently:

```
If n = 0: return Identity matrix
If n is even: Aⁿ = (A^(n/2))²
If n is odd:  Aⁿ = A × A^(n-1)
```

| Exponentiation Method | Multiplications |
|----------------------|-----------------|
| Naive (A × A × ... × A) | O(n) |
| Binary exponentiation | O(log n) |

### 3. Linear Recurrence Transformation

Any linear recurrence can be expressed as matrix exponentiation:

```
f(n) = a₁·f(n-1) + a₂·f(n-2) + ... + aₖ·f(n-k)
```

| Recurrence Order | Matrix Size | Time per Query |
|-------------------|-------------|----------------|
| k = 2 (Fibonacci) | 2×2 | O(log n) |
| k = 3 (Tribonacci) | 3×3 | O(log n) |
| k = 10 | 10×10 | O(log n) |

---

## Frameworks

### Framework 1: Fibonacci/Second-Order Recurrence

```
┌─────────────────────────────────────────────────────┐
│  FIBONACCI MATRIX FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  Recurrence: F(n) = F(n-1) + F(n-2)                 │
│                                                     │
│  Transformation Matrix M:                           │
│  | 1  1 |                                           │
│  | 1  0 |                                           │
│                                                     │
│  State Vector: | F(n)   |                           │
│                | F(n-1) |                           │
│                                                     │
│  Formula: | F(n)   |       | F(1) |   | 1 |       │
│           | F(n-1) | = Mⁿ⁻¹ × | F(0) | = Mⁿ⁻¹ × | 0 | │
│                                                     │
│  Result: F(n) = Mⁿ⁻¹[0][0]                          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Fibonacci, climbing stairs, 2-step recurrences.

### Framework 2: General k-th Order Recurrence

```
┌─────────────────────────────────────────────────────┐
│  GENERAL RECURRENCE FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  Recurrence: f(n) = a₁f(n-1) + a₂f(n-2) + ...      │
│                                                     │
│  Transformation Matrix T (k×k):                       │
│  | a₁  a₂  a₃  ...  aₖ |                            │
│  | 1   0   0   ...  0  |                            │
│  | 0   1   0   ...  0  |  ← Shift identity         │
│  | ... ... ... ... ... |                            │
│  | 0   0   0   ...  1  |                            │
│                                                     │
│  Steps:                                             │
│  1. Build T from recurrence coefficients            │
│  2. Compute T^(n-k+1) using binary exponentiation   │
│  3. Multiply by initial state [f(k-1), ..., f(0)] │
│  4. First component gives f(n)                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Tribonacci, custom k-step recurrences.

### Framework 3: Graph Walk Counting

```
┌─────────────────────────────────────────────────────┐
│  GRAPH WALK FRAMEWORK                               │
├─────────────────────────────────────────────────────┤
│  Problem: Count walks of length L from node u to v  │
│                                                     │
│  1. Build adjacency matrix A (n×n)                 │
│     A[i][j] = 1 if edge i→j exists, 0 otherwise     │
│                                                     │
│  2. Compute A^L using matrix exponentiation         │
│                                                     │
│  3. Result: A^L[u][v] = number of walks             │
│                                                     │
│  Why it works: (A²)[i][j] counts paths of length 2 │
│  from i to j via any intermediate node k            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Knight dialer, path counting, state transitions.

---

## Forms

### Form 1: Fibonacci Sequence

The classic matrix exponentiation example.

| Property | Value |
|----------|-------|
| Recurrence | F(n) = F(n-1) + F(n-2) |
| Matrix | [[1,1], [1,0]] |
| Initial | F(0)=0, F(1)=1 |
| Time | O(log n) |

### Form 2: Tribonacci and k-bonacci

Extension to k-term recurrences.

| Variant | Recurrence | Matrix Size |
|---------|------------|-------------|
| Tribonacci | T(n) = T(n-1) + T(n-2) + T(n-3) | 3×3 |
| Quadbonacci | Q(n) = Q(n-1) + ... + Q(n-4) | 4×4 |
| k-bonacci | k previous terms | k×k |

### Form 3: Weighted Recurrences

```
f(n) = a·f(n-1) + b·f(n-2)
```

| Recurrence | Matrix |
|------------|--------|
| f(n) = 2f(n-1) + 3f(n-2) | [[2,3], [1,0]] |
| Climbing stairs | [[1,1], [1,0]] |
| Jacobsthal | [[1,2], [1,0]] |

### Form 4: Graph State Transitions

Counting paths and state sequences.

| Application | Matrix Type |
|-------------|-------------|
| Knight dialer | Adjacency (10×10) |
| Vowel permutations | Transition (5×5) |
| Cell phone keypad | Adjacency based on moves |

### Form 5: Fast Doubling (Fibonacci Optimization)

Even faster for Fibonacci specifically.

```
F(2k) = F(k) × [2·F(k+1) − F(k)]
F(2k+1) = F(k+1)² + F(k)²
```

| Method | Time | Use Case |
|--------|------|----------|
| Matrix Exponentiation | O(log n) | General recurrences |
| Fast Doubling | O(log n) | Fibonacci only (faster) |

---

## Tactics

### Tactic 1: Matrix Multiplication Function

```python
def multiply_matrices(A, B, mod):
    """Multiply two n×n matrices with modulo."""
    n = len(A)
    result = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for k in range(n):
            if A[i][k] == 0:
                continue
            for j in range(n):
                result[i][j] = (result[i][j] + 
                               A[i][k] * B[k][j]) % mod
    return result
```

### Tactic 2: Optimized 2×2 Multiplication

```python
def mul2x2(A, B, mod):
    """Optimized 2x2 matrix multiplication."""
    return [
        [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % mod,
         (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % mod],
        [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % mod,
         (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % mod]
    ]
```

### Tactic 3: Matrix Exponentiation

```python
def matrix_power(M, n, mod):
    """Compute M^n using binary exponentiation."""
    size = len(M)
    # Initialize as identity
    result = [[1 if i == j else 0 for j in range(size)] 
              for i in range(size)]
    base = M
    
    while n > 0:
        if n & 1:
            result = multiply_matrices(result, base, mod)
        base = multiply_matrices(base, base, mod)
        n >>= 1
    
    return result
```

### Tactic 4: Building Transformation Matrix

```python
def build_transformation_matrix(coeffs, mod):
    """Build k×k transformation matrix from recurrence coefficients."""
    k = len(coeffs)
    T = [[0] * k for _ in range(k)]
    
    # First row: coefficients
    for j in range(k):
        T[0][j] = coeffs[j] % mod
    
    # Sub-diagonal: shift identity
    for i in range(1, k):
        T[i][i-1] = 1
    
    return T
```

### Tactic 5: Fast Doubling for Fibonacci

```python
def fib_fast_doubling(n, mod):
    """Fast doubling method - returns (F(n), F(n+1))."""
    if n == 0:
        return (0, 1)
    
    a, b = fib_fast_doubling(n >> 1, mod)
    c = (a * ((2 * b - a) % mod)) % mod  # F(2k)
    d = (a * a + b * b) % mod             # F(2k+1)
    
    if n & 1:
        return (d, (c + d) % mod)
    else:
        return (c, d)
```

---

## Python Templates

### Template 1: General Matrix Multiplication

```python
def multiply_matrices(A: list[list[int]], B: list[list[int]], 
                       mod: int) -> list[list[int]]:
    """
    Multiply two n×n matrices with modulo.
    
    Time: O(n³)
    Space: O(n²)
    """
    n = len(A)
    result = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for k in range(n):
            if A[i][k] == 0:
                continue
            for j in range(n):
                result[i][j] = (result[i][j] + 
                                A[i][k] * B[k][j]) % mod
    
    return result
```

### Template 2: Matrix Exponentiation

```python
def matrix_power(M: list[list[int]], n: int, mod: int) -> list[list[int]]:
    """
    Compute M^n using binary exponentiation.
    
    Time: O(k³ × log n) where k is matrix dimension
    Space: O(k²)
    """
    size = len(M)
    
    # Initialize result as identity matrix
    result = [[1 if i == j else 0 for j in range(size)] 
              for i in range(size)]
    
    base = M
    
    while n > 0:
        if n & 1:  # If n is odd
            result = multiply_matrices(result, base, mod)
        base = multiply_matrices(base, base, mod)
        n >>= 1
    
    return result
```

### Template 3: Fibonacci Number (Matrix)

```python
def fibonacci(n: int, mod: int = 10**9 + 7) -> int:
    """
    Compute n-th Fibonacci number using matrix exponentiation.
    
    Time: O(log n)
    Space: O(1)
    
    F(0) = 0, F(1) = 1
    """
    if n <= 1:
        return n
    
    # Transformation matrix for Fibonacci
    M = [[1, 1],
         [1, 0]]
    
    M_n = matrix_power(M, n - 1, mod)
    
    return M_n[0][0]
```

### Template 4: General Linear Recurrence

```python
def linear_recurrence(coeffs: list[int], initial: list[int], 
                       n: int, mod: int) -> int:
    """
    Solve linear recurrence: f(n) = coeffs[0]*f(n-1) + ...
    
    Args:
        coeffs: Coefficients [a1, a2, ..., ak]
        initial: Initial values [f(0), f(1), ..., f(k-1)]
        n: Index to compute
        mod: Modulus
    
    Time: O(k³ × log n)
    Space: O(k²)
    
    Example (Tribonacci):
        coeffs = [1, 1, 1]
        initial = [0, 1, 1]  # T(0)=0, T(1)=1, T(2)=1
    """
    k = len(coeffs)
    
    if n < k:
        return initial[n] % mod
    
    # Build transformation matrix
    T = [[0] * k for _ in range(k)]
    for j in range(k):
        T[0][j] = coeffs[j] % mod
    for i in range(1, k):
        T[i][i-1] = 1
    
    # Compute T^(n-k+1)
    T_n = matrix_power(T, n - k + 1, mod)
    
    # Result is first row dot product with reversed initial values
    result = 0
    for j in range(k):
        result = (result + T_n[0][j] * initial[k - 1 - j]) % mod
    
    return result
```

### Template 5: Optimized 2×2 Fibonacci

```python
def fibonacci_optimized(n: int, mod: int = 10**9 + 7) -> int:
    """
    Optimized Fibonacci using explicit 2×2 multiplication.
    Much faster than general matrix version.
    
    Time: O(log n)
    Space: O(1)
    """
    if n <= 1:
        return n
    
    def mul(A, B):
        """Multiply two 2×2 matrices."""
        return [
            [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % mod,
             (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % mod],
            [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % mod,
             (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % mod]
        ]
    
    # Start with M = [[1,1], [1,0]]
    result = [[1, 0], [0, 1]]  # Identity
    base = [[1, 1], [1, 0]]
    power = n - 1
    
    while power > 0:
        if power & 1:
            result = mul(result, base)
        base = mul(base, base)
        power >>= 1
    
    # F(n) is at position [0][0] after multiplying by [F(1), F(0)] = [1, 0]
    return result[0][0]
```

### Template 6: Fast Doubling (Fibonacci Only)

```python
def fibonacci_fast_doubling(n: int, mod: int = 10**9 + 7) -> int:
    """
    Fast doubling method for Fibonacci.
    More efficient than matrix exponentiation for Fibonacci only.
    
    Time: O(log n) with smaller constant than matrix
    Space: O(log n) for recursion stack, or O(1) iterative
    
    Returns F(n).
    """
    def _fib(n):
        """Returns (F(n), F(n+1)) as a pair."""
        if n == 0:
            return (0, 1)
        
        # Recursively compute F(n//2) and F(n//2 + 1)
        a, b = _fib(n >> 1)
        
        # Apply fast doubling formulas
        c = (a * ((2 * b - a) % mod)) % mod  # F(2k) = F(k) * [2*F(k+1) - F(k)]
        d = (a * a + b * b) % mod             # F(2k+1) = F(k+1)² + F(k)²
        
        if n & 1:
            return (d, (c + d) % mod)  # n is odd
        else:
            return (c, d)               # n is even
    
    return _fib(n)[0]
```

### Template 7: Graph Walk Counting

```python
def count_walks(adj_matrix: list[list[int]], 
                 length: int, 
                 start: int, 
                 end: int,
                 mod: int = 10**9 + 7) -> int:
    """
    Count number of walks of given length from start to end.
    
    Args:
        adj_matrix: Adjacency matrix of the graph
        length: Length of walks to count
        start: Starting node index
        end: Ending node index
        mod: Modulus
    
    Time: O(n³ × log length)
    Space: O(n²)
    """
    # Number of walks = adj_matrix^length
    mat_power = matrix_power(adj_matrix, length, mod)
    return mat_power[start][end]


# Example: Knight Dialer helper
def build_knight_dialer_matrix():
    """Build adjacency matrix for knight moves on phone keypad."""
    # Keypad: 0-9, edges represent valid knight moves
    moves = {
        0: [4, 6],
        1: [6, 8],
        2: [7, 9],
        3: [4, 8],
        4: [0, 3, 9],
        5: [],
        6: [0, 1, 7],
        7: [2, 6],
        8: [1, 3],
        9: [2, 4]
    }
    
    n = 10
    adj = [[0] * n for _ in range(n)]
    for u, vs in moves.items():
        for v in vs:
            adj[u][v] = 1
    
    return adj
```

---

## When to Use

Use matrix exponentiation when you need to solve problems involving:
- **Large Fibonacci Numbers**: Computing F(n) where n can be as large as 10¹⁸
- **Linear Recurrence Relations**: Any recurrence of form `f(n) = a₁f(n-1) + ...`
- **Counting Paths in Graphs**: Number of walks of length n between nodes
- **Fast State Transitions**: DP problems with linear state transitions

### Comparison with Alternatives

| Method | Time for F(n) | Space | Handles Large n |
|--------|--------------|-------|-----------------|
| Naive Recursion | O(2ⁿ) | O(n) | ❌ |
| Memoization DP | O(n) | O(n) | ❌ |
| Iterative DP | O(n) | O(1) | ❌ |
| Matrix Exponentiation | O(log n) | O(1) | ✅ (n ≤ 10¹⁸) |
| Fast Doubling | O(log n) | O(1) | ✅ |
| Binet's Formula | O(1)* | O(1) | ⚠️ Precision issues |

### When to Choose Matrix Exponentiation vs Dynamic Programming

- **Choose Matrix Exponentiation** when:
  - n is extremely large (n > 10⁶ or even up to 10¹⁸)
  - The recurrence is linear with constant coefficients
  - You need to answer many queries with the same recurrence but different n values

- **Choose Dynamic Programming** when:
  - n is relatively small (n < 10⁶)
  - You need all values from f(0) to f(n)
  - Memory for storing all values is acceptable
  - The recurrence is non-linear or has non-constant coefficients

---

## Algorithm Explanation

### Core Concept

The key insight is that any linear recurrence relation can be transformed into a matrix exponentiation problem. By expressing the recurrence as a matrix power, we can leverage binary exponentiation to achieve logarithmic time complexity.

**Key Insight**: Each matrix multiplication advances the recurrence by one step. By computing Tⁿ efficiently using binary exponentiation, we effectively "jump" n steps ahead in logarithmic time.

### How It Works

#### Step 1: Identify the Recurrence
- Write out the recurrence relation explicitly
- Identify the order k (how many previous terms are needed)
- Note the initial values

#### Step 2: Construct the Transformation Matrix
- Create a k×k matrix T
- First row: coefficients [a₁, a₂, ..., aₖ]
- Rows 2 to k: sub-diagonal of 1s (shift matrix)

#### Step 3: Compute Matrix Power
- Use binary exponentiation to compute Tⁿ
- Initialize result as identity matrix
- While n > 0: if n is odd, multiply result by base; square the base; divide n by 2

#### Step 4: Extract the Result
- Multiply Tⁿ by the initial state vector
- The result is in the first component

### Visual Representation

Computing F(5) using matrix exponentiation:

```
Initial state:
| F(1) |   | 1 |
| F(0) | = | 0 |

Step 1: Compute M^4 (since n-1 = 4)
M = | 1  1 |
    | 1  0 |

M^2 = M × M = | 2  1 |
              | 1  1 |

M^4 = M^2 × M^2 = | 5  3 |
                  | 3  2 |

Step 2: Multiply M^4 × | F(1) | = | 5  3 | × | 1 | = | 5 |
                       | F(0) |   | 3  2 |   | 0 |   | 3 |

Result: F(5) = 5 ✓
```

### Why It Works

- **Linear Recurrence as Matrix**: The transformation matrix encodes the recurrence relationship. Each multiplication advances the state by one time step.

- **Binary Exponentiation**: Reduces O(n) multiplications to O(log n) by squaring. For n = 10¹⁸, we only need ~60 multiplications instead of 10¹⁸.

- **State Vector**: Contains the "memory" of the recurrence - the previous k values needed to compute the next value.

### Limitations

- **Only works for linear recurrences**: Cannot handle non-linear recurrences like `f(n) = f(n-1)²`
- **Constant coefficients required**: Cannot handle `f(n) = n·f(n-1)` directly
- **Matrix size matters**: O(k³) factor becomes significant for large k
- **State initialization**: Must correctly set up initial state vector

---

## Practice Problems

### Problem 1: Fibonacci Number

**Problem:** [LeetCode 509 - Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)

**Description:** The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1.

**How to Apply Matrix Exponentiation:**
- Most basic application of the technique
- Use standard 2×2 transformation matrix [[1,1],[1,0]]
- Compute M^(n-1) and return top-left element
- Time: O(log n) vs O(n) for iterative DP

---

### Problem 2: Climbing Stairs

**Problem:** [LeetCode 70 - Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

**Description:** Climbing a staircase taking 1 or 2 steps at a time. Return number of distinct ways to climb to the top.

**How to Apply Matrix Exponentiation:**
- Equivalent to finding F(n+1) where F is Fibonacci
- Recurrence: ways(n) = ways(n-1) + ways(n-2)
- Same transformation matrix as Fibonacci
- Useful when n is very large (10⁹+) requiring modulo

---

### Problem 3: N-th Tribonacci Number

**Problem:** [LeetCode 1137 - N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)

**Description:** Tribonacci sequence: T(0) = 0, T(1) = 1, T(2) = 1, and T(n+3) = T(n) + T(n+1) + T(n+2).

**How to Apply Matrix Exponentiation:**
- Use 3×3 transformation matrix: [[1,1,1],[1,0,0],[0,1,0]]
- Initial state: [T(2), T(1), T(0)] = [1, 1, 0]
- Compute M^n and multiply by initial state
- Extension: Can generalize to k-bonacci with k×k matrix

---

### Problem 4: Knight Dialer

**Problem:** [LeetCode 935 - Knight Dialer](https://leetcode.com/problems/knight-dialer/)

**Description:** Chess knight on phone keypad. Given n, return how many distinct numbers can be dialed with n jumps.

**How to Apply Matrix Exponentiation:**
- Model phone keypad as graph (10 nodes for digits 0-9)
- Build adjacency matrix: A[i][j] = 1 if knight can move from i to j
- Answer is sum of all entries in A^(n-1) × initial_vector
- Matrix dimension is 10×10, very efficient

---

### Problem 5: Count Vowels Permutation

**Problem:** [LeetCode 1220 - Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/)

**Description:** Given n, count how many strings of length n can be formed following vowel transition rules.

**How to Apply Matrix Exponentiation:**
- Model vowel transitions as state machine (5 states: a, e, i, o, u)
- Build 5×5 transition matrix based on allowed next vowels
- Compute matrix^(n-1) and sum all entries
- Can be extended to any state transition problem

---

## Video Tutorial Links

### Fundamentals

- [Matrix Exponentiation for Competitive Programming (Errichto)](https://www.youtube.com/watch?v=EEb6kK8PqP4) - Comprehensive introduction
- [Matrix Exponentiation | Fibonacci LogN (Take U Forward)](https://www.youtube.com/watch?v=6SbR8R8M5Vk) - Clear Fibonacci application
- [Matrix Exponentiation - CP Algorithms](https://cp-algorithms.com/algebra/binary-exp.html) - Detailed written tutorial

### Advanced Topics

- [Fast Doubling Method for Fibonacci](https://www.youtube.com/watch?v=wJ4zuQvSfV4) - More efficient than matrix for Fibonacci
- [Linear Recurrences using Matrix Exponentiation](https://www.youtube.com/watch?v=buZ09g0U--g) - General technique
- [Graph Exponentiation for Path Counting](https://www.youtube.com/watch?v=Z9b04p2f58k) - Applications in counting walks

### Problem-Solving

- [Knight Dialer Solution Explanation](https://www.youtube.com/watch?v=nyJkCqECf08) - LeetCode 935 walkthrough
- [Matrix Exponentiation Practice Problems](https://www.youtube.com/watch?v=0V6f6c13Qf8) - Common patterns

---

## Follow-up Questions

### Q1: Can I use matrix exponentiation for non-linear recurrences?

**Answer:** No. Matrix exponentiation only works for **linear recurrences with constant coefficients**. For example:
- ❌ `f(n) = f(n-1)²` (non-linear, quadratic)
- ❌ `f(n) = n·f(n-1)` (non-constant coefficient)
- ❌ `f(n) = f(n-1) + f(n-2) + n²` (non-homogeneous with polynomial)

For some non-homogeneous cases, you can extend the matrix to include extra terms, but pure non-linear recurrences require different techniques.

---

### Q2: What about recurrences with non-constant coefficients?

**Answer:** Standard matrix exponentiation requires constant coefficients. For recurrences like `f(n) = n·f(n-1)`, you need other approaches:
- **Direct computation**: O(n) time, which may be acceptable
- **Segment Tree with lazy propagation**: For coefficient ranges
- **Polynomial matrix exponentiation**: For polynomial coefficients (advanced)

---

### Q3: How large can the matrix be in practice?

**Answer:** The O(k³) factor becomes significant:
- **k ≤ 5**: Very fast, negligible overhead
- **k ≤ 10**: Standard for competitive programming
- **k ≤ 50**: Still manageable for a few queries
- **k > 100**: Consider optimized multiplication (Strassen's) or alternative methods

For k=2 or k=3, write explicit multiplication formulas to avoid loop overhead.

---

### Q4: Can I optimize matrix multiplication further?

**Answer:** Yes! For small fixed-size matrices, write explicit formulas. For larger matrices, consider Strassen's algorithm (O(n^2.81)), SIMD instructions, or sparse matrix optimization if many zeros.

---

### Q5: When should I use Fast Doubling instead of Matrix Exponentiation?

**Answer:** Use **Fast Doubling** for Fibonacci specifically, **Matrix Exponentiation** for general recurrences:

| Aspect | Fast Doubling | Matrix Exponentiation |
|--------|---------------|----------------------|
| Fibonacci only | ✅ Faster (~2x) | ✅ Works |
| General recurrences | ❌ Doesn't work | ✅ Works |
| Code complexity | Slightly more | Standard pattern |
| Extension to k-bonacci | Hard | Easy |

---

## Summary

Matrix exponentiation is a powerful mathematical technique for solving **linear recurrence relations** in logarithmic time.

**Key Points:**
1. **Convert recurrence to matrix form**: First row has coefficients, rest is shift matrix
2. **Use binary exponentiation**: Reduces O(n) to O(log n) multiplications
3. **Apply modulo at each step**: Prevents overflow in competitive programming
4. **Optimize for small matrices**: Write explicit formulas for 2×2 and 3×3

### When to Use

- ✅ Computing F(n) where n > 10⁶ (up to 10¹⁸)
- ✅ Solving any linear recurrence with constant coefficients
- ✅ Counting walks of length n in graphs
- ✅ Fast state transitions in DP with many steps

### When NOT to Use

- ❌ Non-linear recurrences (e.g., f(n) = f(n-1)²)
- ❌ Non-constant coefficients (e.g., f(n) = n·f(n-1))
- ❌ When n is small (DP is simpler and clearer)
- ❌ When you need all values f(0) to f(n)

This technique is essential for competitive programming and appears frequently in advanced technical interviews.
