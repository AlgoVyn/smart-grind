# Matrix Exponentiation

## Category
Math & Number Theory

## Description

**Matrix Exponentiation** is a technique to compute the n-th power of a matrix in O(log n) time using binary exponentiation (exponentiation by squaring). While a naive approach would take O(n) matrix multiplications, this method reduces it to O(log n) multiplications.

This technique is especially powerful for solving linear recurrence relations (like Fibonacci) in logarithmic time, which would otherwise require linear or exponential time.

---

## When to Use

Use matrix exponentiation when you need to:

- **Compute Large Fibonacci Numbers**: Find F(n) where n can be up to 10^18
- **Solve Linear Recurrences**: Any recurrence of form `f(n) = a₁f(n-1) + a₂f(n-2) + ... + aₖf(n-k)`
- **Count Paths in Graphs**: Number of walks of length n between nodes
- **Fast State Transitions**: DP problems with state transitions
- **Modular Arithmetic**: Computing large powers with mod constraints

### Key Insight

Any linear recurrence can be converted to matrix form:
```
| f(n)   |   | a₁  a₂  ...  aₖ |   | f(n-1) |
| f(n-1) | = | 1   0   ...  0  | × | f(n-2) |
|   ...  |   | ... ... ... ... |   |   ...  |
|f(n-k+1)|   | 0   0   ...  1  |   |f(n-k) |
```

---

## Algorithm Explanation

### Matrix Multiplication

For two n×n matrices A and B:
```
C[i][j] = Σ A[i][k] × B[k][j] for k = 0 to n-1
```

Time complexity: O(n³) for naive multiplication.

### Binary Exponentiation

To compute A^n:
```
If n = 0: return Identity matrix
If n is even: A^n = (A^(n/2))^2
If n is odd:  A^n = A × A^(n-1)
```

This requires only O(log n) matrix multiplications.

### Fibonacci as Matrix Exponentiation

The Fibonacci recurrence:
```
F(n) = F(n-1) + F(n-2)
```

Can be written as:
```
| F(n)   |   | 1  1 |   | F(n-1) |
| F(n-1) | = | 1  0 | × | F(n-2) |
```

Therefore:
```
| F(n)   |     | 1  1 |^(n-1)   | F(1) |
| F(n-1) |  =  | 1  0 |       ×  | F(0) |
```

---

## Implementation

### Template Code

````carousel
```python
from typing import List


def multiply_matrices(A: List[List[int]], B: List[List[int]], mod: int) -> List[List[int]]:
    """
    Multiply two n×n matrices with modulo.
    
    Time Complexity: O(n³)
    Space Complexity: O(n²)
    """
    n = len(A)
    result = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for k in range(n):
            if A[i][k] == 0:
                continue
            for j in range(n):
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod
    
    return result


def matrix_power(M: List[List[int]], n: int, mod: int) -> List[List[int]]:
    """
    Compute matrix M raised to power n using binary exponentiation.
    
    Time Complexity: O(n³ × log(n))
    Space Complexity: O(n²)
    """
    size = len(M)
    
    # Initialize result as identity matrix
    result = [[1 if i == j else 0 for j in range(size)] for i in range(size)]
    
    base = M
    
    while n > 0:
        if n & 1:  # If n is odd
            result = multiply_matrices(result, base, mod)
        base = multiply_matrices(base, base, mod)
        n >>= 1
    
    return result


class Matrix:
    """Matrix class with exponentiation support."""
    
    def __init__(self, data: List[List[int]], mod: int = 10**9 + 7):
        self.data = data
        self.n = len(data)
        self.mod = mod
    
    def __mul__(self, other: 'Matrix') -> 'Matrix':
        """Matrix multiplication."""
        result = [[0] * self.n for _ in range(self.n)]
        for i in range(self.n):
            for k in range(self.n):
                if self.data[i][k] == 0:
                    continue
                for j in range(self.n):
                    result[i][j] = (result[i][j] + 
                                   self.data[i][k] * other.data[k][j]) % self.mod
        return Matrix(result, self.mod)
    
    def __pow__(self, power: int) -> 'Matrix':
        """Matrix exponentiation."""
        # Initialize as identity
        result = Matrix([[1 if i == j else 0 for j in range(self.n)] 
                        for i in range(self.n)], self.mod)
        base = self
        
        while power > 0:
            if power & 1:
                result = result * base
            base = base * base
            power >>= 1
        
        return result


def fibonacci(n: int, mod: int = 10**9 + 7) -> int:
    """
    Compute n-th Fibonacci number using matrix exponentiation.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if n <= 1:
        return n
    
    # Transformation matrix
    M = [[1, 1],
         [1, 0]]
    
    M_n = matrix_power(M, n - 1, mod)
    
    # F(n) = M^(n-1)[0][0] * F(1) + M^(n-1)[0][1] * F(0)
    # Since F(1) = 1 and F(0) = 0:
    return M_n[0][0]


# General linear recurrence solver
def linear_recurrence(coeffs: List[int], initial: List[int], n: int, mod: int) -> int:
    """
    Solve linear recurrence: f(n) = coeffs[0]*f(n-1) + coeffs[1]*f(n-2) + ...
    
    Args:
        coeffs: Coefficients [a1, a2, ..., ak]
        initial: Initial values [f(0), f(1), ..., f(k-1)]
        n: Index to compute
        mod: Modulus
    
    Time: O(k³ × log n) where k is recurrence order
    """
    k = len(coeffs)
    
    if n < k:
        return initial[n]
    
    # Build transformation matrix
    # First row: coefficients
    # Subsequent rows: shift identity
    T = [[0] * k for _ in range(k)]
    
    for j in range(k):
        T[0][j] = coeffs[j]
    
    for i in range(1, k):
        T[i][i-1] = 1
    
    T_n = matrix_power(T, n - k + 1, mod)
    
    # Result is first row dot product with reversed initial values
    result = 0
    for j in range(k):
        result = (result + T_n[0][j] * initial[k - 1 - j]) % mod
    
    return result


# Example usage
if __name__ == "__main__":
    # Fibonacci
    print(f"F(10) = {fibonacci(10)}")  # 55
    print(f"F(50) = {fibonacci(50)}")  # 12586269025
    print(f"F(100) mod 1e9+7 = {fibonacci(100)}")  # 687995182
    
    # Tribonacci: T(n) = T(n-1) + T(n-2) + T(n-3)
    trib_coeffs = [1, 1, 1]
    trib_initial = [0, 1, 1]  # T(0)=0, T(1)=1, T(2)=1
    print(f"T(10) = {linear_recurrence(trib_coeffs, trib_initial, 10, 10**9+7)}")
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

typedef vector<vector<long long>> Matrix;

/**
 * Matrix multiplication with modulo
 */
Matrix multiply(const Matrix& A, const Matrix& B, long long mod) {
    int n = A.size();
    Matrix C(n, vector<long long>(n, 0));
    
    for (int i = 0; i < n; i++) {
        for (int k = 0; k < n; k++) {
            if (A[i][k] == 0) continue;
            for (int j = 0; j < n; j++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % mod;
            }
        }
    }
    return C;
}

/**
 * Matrix exponentiation
 */
Matrix matrixPower(Matrix base, long long power, long long mod) {
    int n = base.size();
    Matrix result(n, vector<long long>(n, 0));
    
    // Identity matrix
    for (int i = 0; i < n; i++) result[i][i] = 1;
    
    while (power > 0) {
        if (power & 1) result = multiply(result, base, mod);
        base = multiply(base, base, mod);
        power >>= 1;
    }
    
    return result;
}

/**
 * Fibonacci using matrix exponentiation
 */
long long fibonacci(long long n, long long mod = 1e9+7) {
    if (n <= 1) return n;
    
    Matrix M = {{1, 1}, {1, 0}};
    Matrix Mn = matrixPower(M, n - 1, mod);
    
    return Mn[0][0];
}

/**
 * General linear recurrence
 */
long long linearRecurrence(vector<long long>& coeffs, 
                           vector<long long>& initial,
                           long long n, long long mod) {
    int k = coeffs.size();
    if (n < k) return initial[n];
    
    // Build transformation matrix
    Matrix T(k, vector<long long>(k, 0));
    for (int j = 0; j < k; j++) T[0][j] = coeffs[j];
    for (int i = 1; i < k; i++) T[i][i-1] = 1;
    
    Matrix Tn = matrixPower(T, n - k + 1, mod);
    
    long long result = 0;
    for (int j = 0; j < k; j++) {
        result = (result + Tn[0][j] * initial[k - 1 - j]) % mod;
    }
    
    return result;
}
```

<!-- slide -->
```java
public class MatrixExponentiation {
    
    public static long[][] multiply(long[][] A, long[][] B, long mod) {
        int n = A.length;
        long[][] C = new long[n][n];
        
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < n; k++) {
                if (A[i][k] == 0) continue;
                for (int j = 0; j < n; j++) {
                    C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % mod;
                }
            }
        }
        return C;
    }
    
    public static long[][] matrixPower(long[][] base, long power, long mod) {
        int n = base.length;
        long[][] result = new long[n][n];
        
        // Identity
        for (int i = 0; i < n; i++) result[i][i] = 1;
        
        while (power > 0) {
            if ((power & 1) == 1) result = multiply(result, base, mod);
            base = multiply(base, base, mod);
            power >>= 1;
        }
        
        return result;
    }
    
    public static long fibonacci(long n, long mod) {
        if (n <= 1) return n;
        
        long[][] M = {{1, 1}, {1, 0}};
        long[][] Mn = matrixPower(M, n - 1, mod);
        
        return Mn[0][0];
    }
    
    public static long linearRecurrence(long[] coeffs, long[] initial, 
                                        long n, long mod) {
        int k = coeffs.length;
        if (n < k) return initial[(int)n];
        
        long[][] T = new long[k][k];
        for (int j = 0; j < k; j++) T[0][j] = coeffs[j];
        for (int i = 1; i < k; i++) T[i][i-1] = 1;
        
        long[][] Tn = matrixPower(T, n - k + 1, mod);
        
        long result = 0;
        for (int j = 0; j < k; j++) {
            result = (result + Tn[0][j] * initial[k - 1 - j]) % mod;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
function multiplyMatrices(A, B, mod) {
    const n = A.length;
    const C = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < n; k++) {
            if (A[i][k] === 0) continue;
            for (let j = 0; j < n; j++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % mod;
            }
        }
    }
    return C;
}

function matrixPower(base, power, mod) {
    const n = base.length;
    let result = Array(n).fill().map((_, i) => 
        Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
    );
    
    while (power > 0n) {
        if (power & 1n) result = multiplyMatrices(result, base, mod);
        base = multiplyMatrices(base, base, mod);
        power >>= 1n;
    }
    
    return result;
}

function fibonacci(n, mod = 1000000007n) {
    if (n <= 1n) return n;
    
    const M = [[1n, 1n], [1n, 0n]];
    const Mn = matrixPower(M, n - 1n, mod);
    
    return Mn[0][0];
}

function linearRecurrence(coeffs, initial, n, mod) {
    const k = coeffs.length;
    if (n < k) return initial[n];
    
    const T = Array(k).fill().map(() => Array(k).fill(0));
    for (let j = 0; j < k; j++) T[0][j] = coeffs[j];
    for (let i = 1; i < k; i++) T[i][i-1] = 1;
    
    const Tn = matrixPower(T, n - k + 1, mod);
    
    let result = 0n;
    for (let j = 0; j < k; j++) {
        result = (result + Tn[0][j] * initial[k - 1 - j]) % mod;
    }
    
    return result;
}

// Example
console.log(fibonacci(10n));  // 55n
console.log(fibonacci(100n)); // 687995182n
```
````

---

## Common Recurrence Patterns

### Fibonacci Sequence
```
F(n) = F(n-1) + F(n-2)
Matrix: [[1, 1], [1, 0]]
```

### Tribonacci Sequence
```
T(n) = T(n-1) + T(n-2) + T(n-3)
Matrix: [[1, 1, 1], [1, 0, 0], [0, 1, 0]]
```

### General Second-Order
```
f(n) = a·f(n-1) + b·f(n-2)
Matrix: [[a, b], [1, 0]]
```

---

## Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Matrix Multiplication | O(k³) | O(k²) |
| Matrix Exponentiation | O(k³ × log n) | O(k²) |
| Fibonacci (k=2) | O(log n) | O(1) |
| General Recurrence | O(k³ × log n) | O(k²) |

Where k = matrix dimension (recurrence order).

---

## Practice Problems

### Problem 1: Climbing Stairs (Fibonacci)
**Problem**: [LeetCode 70 - Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

**Solution**: `ways(n) = ways(n-1) + ways(n-2)` - use matrix exponentiation for very large n.

### Problem 2: Tribonacci Number
**Problem**: [LeetCode 1137 - N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)

**Solution**: 3×3 matrix exponentiation.

### Problem 3: Knight Dialer
**Problem**: [LeetCode 935 - Knight Dialer](https://leetcode.com/problems/knight-dialer/)

**Solution**: Graph adjacency matrix raised to power n-1.

---

## Follow-up Questions

### Q1: Can I use this for non-linear recurrences?

**Answer**: No. Matrix exponentiation only works for linear recurrences. For non-linear (e.g., `f(n) = f(n-1)²`), you need different techniques.

### Q2: What about recurrences with non-constant coefficients?

**Answer**: Matrix exponentiation requires constant coefficients. For varying coefficients like `f(n) = n·f(n-1)`, you need other approaches like direct computation or generating functions.

### Q3: How large can the matrix be?

**Answer**: Typically k ≤ 10 for competitive programming (k³ factor becomes significant). For very large k, use optimized matrix multiplication or alternative methods.

### Q4: Can I optimize matrix multiplication further?

**Answer**: For small fixed-size matrices (like 2×2 or 3×3), write explicit multiplication formulas instead of loops to avoid overhead:

```python
def multiply_2x2(A, B, mod):
    return [
        [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % mod,
         (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % mod],
        [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % mod,
         (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % mod]
    ]
```

---

## Summary

Matrix exponentiation is a powerful technique for:

- **Logarithmic time** computation of linear recurrences
- **Large n values** (up to 10^18) that would overflow iterative approaches
- **Graph walk counting** via adjacency matrix powers

**Key Points:**
1. Convert recurrence to matrix form
2. Use binary exponentiation for O(log n) complexity
3. Apply modulo to prevent overflow
4. Optimize for small fixed-size matrices

---

## Related Algorithms

- [Fast Exponentiation](./modular-exponentiation.md) - Same concept for scalars
- [Dynamic Programming](./dynamic-programming.md) - Alternative for smaller n
- [Linear Recurrences](./linear-recurrences.md) - More techniques for recurrences