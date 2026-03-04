# Matrix Exponentiation

## Category
Math & Number Theory

## Description

**Matrix Exponentiation** is a powerful mathematical technique that computes the n-th power of a matrix in **O(k³ × log n)** time using binary exponentiation (exponentiation by squaring), where k is the matrix dimension. While a naive approach would require O(n) matrix multiplications, this method reduces it to O(log n) multiplications.

The real power of this technique lies in its ability to solve **linear recurrence relations** in logarithmic time. Problems that would normally require linear or exponential time with dynamic programming can be solved in O(log n) time, making it possible to compute values like the 10¹⁸-th Fibonacci number almost instantly.

---

## When to Use

Use matrix exponentiation when you need to solve problems involving:

- **Large Fibonacci Numbers**: Computing F(n) where n can be as large as 10¹⁸
- **Linear Recurrence Relations**: Any recurrence of form `f(n) = a₁f(n-1) + a₂f(n-2) + ... + aₖf(n-k)`
- **Counting Paths in Graphs**: Number of walks of length n between nodes in a graph
- **Fast State Transitions**: DP problems with linear state transitions that need to be applied many times
- **Modular Arithmetic**: Computing large powers with mod constraints (e.g., MOD = 10⁹ + 7)

### Comparison with Alternatives

| Method | Time for F(n) | Space | Handles Large n | Handles Updates |
|--------|--------------|-------|-----------------|-----------------|
| **Naive Recursion** | O(2ⁿ) | O(n) stack | ❌ No | ❌ No |
| **Memoization (DP)** | O(n) | O(n) | ❌ No | ❌ No |
| **Iterative DP** | O(n) | O(1) | ❌ No | ❌ No |
| **Matrix Exponentiation** | O(log n) | O(1) | ✅ Yes (n ≤ 10¹⁸) | ❌ No |
| **Fast Doubling** | O(log n) | O(1) | ✅ Yes | ❌ No |
| **Binet's Formula** | O(1)* | O(1) | ⚠️ Precision issues | ❌ No |

*Note: Binet's formula requires arbitrary precision arithmetic for exact results.

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

### Matrix Multiplication

For two n×n matrices A and B, their product C = A × B is defined as:

```
C[i][j] = Σ A[i][k] × B[k][j] for k = 0 to n-1
```

Time complexity: O(n³) for naive multiplication (can be optimized for small fixed sizes).

### Binary Exponentiation

To compute Aⁿ efficiently:

```
If n = 0: return Identity matrix
If n is even: Aⁿ = (A^(n/2))²
If n is odd:  Aⁿ = A × A^(n-1)
```

This reduces the number of multiplications from O(n) to O(log n).

### Fibonacci as Matrix Exponentiation

The Fibonacci recurrence:
```
F(n) = F(n-1) + F(n-2)
```

Can be written in matrix form:
```
| F(n)   |   | 1  1 |   | F(n-1) |
| F(n-1) | = | 1  0 | × | F(n-2) |
```

Let M = [[1, 1], [1, 0]]. Then:
```
| F(n)   |             | F(1) |   | 1 |
| F(n-1) | = M^(n-1) × | F(0) | = M^(n-1) × | 0 |
```

Therefore: **F(n) = M^(n-1)[0][0]**

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

Step 2: Multiply M^4 × | F(1) |
                       | F(0) |

| F(5) |   | 5  3 |   | 1 |   | 5 |
| F(4) | = | 3  2 | × | 0 | = | 3 |

Result: F(5) = 5 ✓
```

### General Linear Recurrence Transformation

For a general k-th order linear recurrence:
```
f(n) = a₁·f(n-1) + a₂·f(n-2) + ... + aₖ·f(n-k)
```

The transformation matrix T is a k×k matrix:

```
| f(n)     |   | a₁  a₂  a₃  ...  aₖ |   | f(n-1) |
| f(n-1)   |   | 1   0   0   ...  0  |   | f(n-2) |
| f(n-2)   | = | 0   1   0   ...  0  | × | f(n-3) |
|   ...    |   | ... ... ... ... ... |   |   ...  |
|f(n-k+1)  |   | 0   0   0   ...  1  |   |f(n-k)  |
```

First row: coefficients of the recurrence
Subsequent rows: shift the state vector down by one position

### Why It Works

Each matrix multiplication advances the recurrence by one step. By computing Tⁿ efficiently using binary exponentiation, we effectively "jump" n steps ahead in logarithmic time.

---

## Algorithm Steps

### Step-by-Step Approach

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
    
    Time Complexity: O(k³ × log n) where k is matrix dimension
    Space Complexity: O(k²)
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
    """Matrix class with exponentiation support for cleaner code."""
    
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
        """Matrix exponentiation using binary exponentiation."""
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
    
    Args:
        n: Index (0-based, F(0)=0, F(1)=1)
        mod: Modulus for large numbers
    
    Returns:
        F(n) % mod
    """
    if n <= 1:
        return n
    
    # Transformation matrix for Fibonacci
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
        coeffs: Coefficients [a1, a2, ..., ak] for the recurrence
        initial: Initial values [f(0), f(1), ..., f(k-1)]
        n: Index to compute
        mod: Modulus
    
    Time Complexity: O(k³ × log n) where k is recurrence order
    Space Complexity: O(k²)
    
    Example:
        Tribonacci: T(n) = T(n-1) + T(n-2) + T(n-3)
        coeffs = [1, 1, 1]
        initial = [0, 1, 1]  # T(0)=0, T(1)=1, T(2)=1
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
    MOD = 10**9 + 7
    
    # Fibonacci examples
    print("Fibonacci Examples:")
    print(f"F(10) = {fibonacci(10)}")  # 55
    print(f"F(50) = {fibonacci(50)}")  # 12586269025
    print(f"F(100) mod 1e9+7 = {fibonacci(100, MOD)}")  # 687995182
    
    # Large n example
    print(f"F(10^6) mod 1e9+7 = {fibonacci(10**6, MOD)}")
    
    # Tribonacci: T(n) = T(n-1) + T(n-2) + T(n-3)
    print("\nTribonacci Examples:")
    trib_coeffs = [1, 1, 1]
    trib_initial = [0, 1, 1]  # T(0)=0, T(1)=1, T(2)=1
    for i in [3, 5, 10, 20]:
        print(f"T({i}) = {linear_recurrence(trib_coeffs, trib_initial, i, MOD)}")
```

<!-- slide: C++ -->
```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef vector<vector<ll>> Matrix;

const ll MOD = 1e9 + 7;

/**
 * Matrix multiplication with modulo
 * Time: O(n³)
 */
Matrix multiply(const Matrix& A, const Matrix& B, ll mod) {
    int n = A.size();
    Matrix C(n, vector<ll>(n, 0));
    
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
 * Matrix exponentiation using binary exponentiation
 * Time: O(k³ × log n)
 */
Matrix matrixPower(Matrix base, ll power, ll mod) {
    int n = base.size();
    Matrix result(n, vector<ll>(n, 0));
    
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
 * Time: O(log n)
 */
ll fibonacci(ll n, ll mod = MOD) {
    if (n <= 1) return n;
    
    Matrix M = {{1, 1}, {1, 0}};
    Matrix Mn = matrixPower(M, n - 1, mod);
    
    return Mn[0][0];
}

/**
 * General linear recurrence solver
 * f(n) = coeffs[0]*f(n-1) + coeffs[1]*f(n-2) + ...
 * Time: O(k³ × log n) where k is the order
 */
ll linearRecurrence(vector<ll>& coeffs, vector<ll>& initial, ll n, ll mod) {
    int k = coeffs.size();
    if (n < k) return initial[n];
    
    // Build transformation matrix
    Matrix T(k, vector<ll>(k, 0));
    for (int j = 0; j < k; j++) T[0][j] = coeffs[j];
    for (int i = 1; i < k; i++) T[i][i-1] = 1;
    
    Matrix Tn = matrixPower(T, n - k + 1, mod);
    
    ll result = 0;
    for (int j = 0; j < k; j++) {
        result = (result + Tn[0][j] * initial[k - 1 - j]) % mod;
    }
    
    return result;
}

// Optimized 2x2 matrix multiplication for Fibonacci
struct Mat2x2 {
    ll a, b, c, d;  // | a b |
                      // | c d |
    
    Mat2x2(ll a=1, ll b=0, ll c=0, ll d=1) : a(a), b(b), c(c), d(d) {}
    
    Mat2x2 operator*(const Mat2x2& other) const {
        ll mod = MOD;
        return Mat2x2(
            (a * other.a + b * other.c) % mod,
            (a * other.b + b * other.d) % mod,
            (c * other.a + d * other.c) % mod,
            (c * other.b + d * other.d) % mod
        );
    }
};

Mat2x2 matPower(Mat2x2 base, ll power) {
    Mat2x2 result;  // Identity
    while (power > 0) {
        if (power & 1) result = result * base;
        base = base * base;
        power >>= 1;
    }
    return result;
}

// Optimized Fibonacci using 2x2 struct
ll fibOptimized(ll n) {
    if (n <= 1) return n;
    Mat2x2 M(1, 1, 1, 0);
    Mat2x2 Mn = matPower(M, n - 1);
    return Mn.a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // Fibonacci examples
    cout << "Fibonacci Examples:" << endl;
    cout << "F(10) = " << fibonacci(10) << endl;  // 55
    cout << "F(50) = " << fibonacci(50) << endl;  // 12586269025
    cout << "F(100) = " << fibonacci(100) << endl;  // 687995182
    
    // Large n
    cout << "F(10^6) = " << fibonacci(1000000) << endl;
    
    // Tribonacci
    cout << "\nTribonacci Examples:" << endl;
    vector<ll> tribCoeffs = {1, 1, 1};
    vector<ll> tribInitial = {0, 1, 1};
    for (ll n : {3, 5, 10, 20}) {
        cout << "T(" << n << ") = " << linearRecurrence(tribCoeffs, tribInitial, n, MOD) << endl;
    }
    
    return 0;
}
```

<!-- slide: Java -->
```java
import java.util.*;

public class MatrixExponentiation {
    
    private static final long MOD = 1_000_000_007L;
    
    /**
     * Multiply two matrices with modulo
     */
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
    
    /**
     * Matrix exponentiation using binary exponentiation
     * Time: O(k³ × log n)
     */
    public static long[][] matrixPower(long[][] base, long power, long mod) {
        int n = base.length;
        long[][] result = new long[n][n];
        
        // Identity matrix
        for (int i = 0; i < n; i++) result[i][i] = 1;
        
        while (power > 0) {
            if ((power & 1) == 1) result = multiply(result, base, mod);
            base = multiply(base, base, mod);
            power >>= 1;
        }
        
        return result;
    }
    
    /**
     * Compute n-th Fibonacci number
     * Time: O(log n)
     */
    public static long fibonacci(long n) {
        return fibonacci(n, MOD);
    }
    
    public static long fibonacci(long n, long mod) {
        if (n <= 1) return n;
        
        long[][] M = {{1, 1}, {1, 0}};
        long[][] Mn = matrixPower(M, n - 1, mod);
        
        return Mn[0][0];
    }
    
    /**
     * General linear recurrence solver
     * f(n) = coeffs[0]*f(n-1) + coeffs[1]*f(n-2) + ...
     */
    public static long linearRecurrence(long[] coeffs, long[] initial, 
                                        long n, long mod) {
        int k = coeffs.length;
        if (n < k) return initial[(int)n];
        
        // Build transformation matrix
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
    
    // Optimized 2x2 matrix for Fibonacci
    static class Mat2x2 {
        long a, b, c, d;
        
        Mat2x2(long a, long b, long c, long d) {
            this.a = a; this.b = b; this.c = c; this.d = d;
        }
        
        static Mat2x2 identity() {
            return new Mat2x2(1, 0, 0, 1);
        }
        
        Mat2x2 multiply(Mat2x2 other, long mod) {
            return new Mat2x2(
                (a * other.a + b * other.c) % mod,
                (a * other.b + b * other.d) % mod,
                (c * other.a + d * other.c) % mod,
                (c * other.b + d * other.d) % mod
            );
        }
    }
    
    static Mat2x2 matPower(Mat2x2 base, long power, long mod) {
        Mat2x2 result = Mat2x2.identity();
        while (power > 0) {
            if ((power & 1) == 1) result = result.multiply(base, mod);
            base = base.multiply(base, mod);
            power >>= 1;
        }
        return result;
    }
    
    // Optimized Fibonacci
    public static long fibOptimized(long n) {
        if (n <= 1) return n;
        Mat2x2 M = new Mat2x2(1, 1, 1, 0);
        Mat2x2 Mn = matPower(M, n - 1, MOD);
        return Mn.a;
    }
    
    public static void main(String[] args) {
        // Fibonacci examples
        System.out.println("Fibonacci Examples:");
        System.out.println("F(10) = " + fibonacci(10));  // 55
        System.out.println("F(50) = " + fibonacci(50));  // 12586269025
        System.out.println("F(100) = " + fibonacci(100));  // 687995182
        
        // Large n
        System.out.println("F(10^6) = " + fibonacci(1_000_000));
        
        // Tribonacci
        System.out.println("\nTribonacci Examples:");
        long[] tribCoeffs = {1, 1, 1};
        long[] tribInitial = {0, 1, 1};
        for (long n : new long[]{3, 5, 10, 20}) {
            System.out.println("T(" + n + ") = " + linearRecurrence(tribCoeffs, tribInitial, n, MOD));
        }
    }
}
```

<!-- slide: JavaScript -->
```javascript
const MOD = BigInt(1e9 + 7);

/**
 * Multiply two matrices with modulo
 */
function multiplyMatrices(A, B, mod) {
    const n = A.length;
    const C = Array(n).fill().map(() => Array(n).fill(0n));
    
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < n; k++) {
            if (A[i][k] === 0n) continue;
            for (let j = 0; j < n; j++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % mod;
            }
        }
    }
    return C;
}

/**
 * Matrix exponentiation using binary exponentiation
 * Time: O(k³ × log n)
 */
function matrixPower(base, power, mod) {
    const n = base.length;
    let result = Array(n).fill().map((_, i) => 
        Array(n).fill(0n).map((_, j) => i === j ? 1n : 0n)
    );
    
    while (power > 0n) {
        if (power & 1n) result = multiplyMatrices(result, base, mod);
        base = multiplyMatrices(base, base, mod);
        power >>= 1n;
    }
    
    return result;
}

/**
 * Compute n-th Fibonacci number
 * Time: O(log n)
 */
function fibonacci(n, mod = MOD) {
    if (n <= 1n) return n;
    
    const M = [[1n, 1n], [1n, 0n]];
    const Mn = matrixPower(M, n - 1n, mod);
    
    return Mn[0][0];
}

/**
 * General linear recurrence solver
 */
function linearRecurrence(coeffs, initial, n, mod) {
    const k = coeffs.length;
    if (n < k) return initial[n];
    
    const T = Array(k).fill().map(() => Array(k).fill(0n));
    for (let j = 0; j < k; j++) T[0][j] = coeffs[j];
    for (let i = 1; i < k; i++) T[i][i-1] = 1n;
    
    const Tn = matrixPower(T, n - k + 1n, mod);
    
    let result = 0n;
    for (let j = 0; j < k; j++) {
        result = (result + Tn[0][j] * initial[k - 1 - j]) % mod;
    }
    
    return result;
}

// Optimized 2x2 matrix for Fibonacci
class Mat2x2 {
    constructor(a = 1n, b = 0n, c = 0n, d = 1n) {
        this.a = a; this.b = b; this.c = c; this.d = d;
    }
    
    multiply(other, mod) {
        return new Mat2x2(
            (this.a * other.a + this.b * other.c) % mod,
            (this.a * other.b + this.b * other.d) % mod,
            (this.c * other.a + this.d * other.c) % mod,
            (this.c * other.b + this.d * other.d) % mod
        );
    }
}

function matPower(base, power, mod) {
    let result = new Mat2x2();
    while (power > 0n) {
        if (power & 1n) result = result.multiply(base, mod);
        base = base.multiply(base, mod);
        power >>= 1n;
    }
    return result;
}

function fibOptimized(n, mod = MOD) {
    if (n <= 1n) return n;
    const M = new Mat2x2(1n, 1n, 1n, 0n);
    const Mn = matPower(M, n - 1n, mod);
    return Mn.a;
}

// Example usage
console.log("Fibonacci Examples:");
console.log("F(10) =", fibonacci(10n));  // 55n
console.log("F(50) =", fibonacci(50n));  // 12586269025n
console.log("F(100) =", fibonacci(100n));  // 687995182n

// Large n
console.log("F(10^6) =", fibonacci(1000000n));

// Tribonacci
console.log("\nTribonacci Examples:");
const tribCoeffs = [1n, 1n, 1n];
const tribInitial = [0n, 1n, 1n];
for (const n of [3n, 5n, 10n, 20n]) {
    console.log(`T(${n}) =`, linearRecurrence(tribCoeffs, tribInitial, n, MOD));
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Matrix Multiplication** | O(k³) | Standard multiplication of two k×k matrices |
| **Matrix Exponentiation** | O(k³ × log n) | log n multiplications, each O(k³) |
| **Fibonacci (k=2)** | O(log n) | Fixed 2×2 matrices, constant factor ~8 multiplications |
| **General Recurrence** | O(k³ × log n) | k×k transformation matrix |

### Detailed Breakdown

#### Matrix Multiplication
For two k×k matrices:
- Three nested loops: O(k³) operations
- Each operation: 1 multiplication + 1 addition
- With modulo: additional constant overhead

#### Binary Exponentiation
- Decomposes n into binary: at most log₂(n) + 1 bits
- Each bit requires at most 2 matrix multiplications (one square, maybe one multiply)
- Total: O(log n) matrix multiplications

#### Recurrence Order Impact
| Order (k) | Time for n=10¹⁸ | Use Case |
|-----------|-----------------|----------|
| 2 | ~60 × 8 ops | Fibonacci, Climbing Stairs |
| 3 | ~60 × 27 ops | Tribonacci |
| 10 | ~60 × 1000 ops | Complex linear recurrences |

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|-----------------|-------------|
| **Input Matrices** | O(k²) | Two k×k matrices during multiplication |
| **Result Matrix** | O(k²) | Storing the result |
| **Binary Exponentiation** | O(log n) stack or O(1) iterative | Iterative preferred for space |
| **Total** | O(k²) | Dominated by matrix storage |

### Space Optimization Tips

1. **Iterative Exponentiation**: Use iterative approach instead of recursion to avoid O(log n) stack space
2. **In-place Multiplication**: For small fixed-size matrices, use explicit variables instead of 2D arrays
3. **Modulo at Each Step**: Prevents integer overflow and keeps numbers bounded

---

## Common Variations

### 1. Fibonacci Sequence

The classic example: `F(n) = F(n-1) + F(n-2)`

```
Transformation Matrix: [[1, 1],
                        [1, 0]]

Initial State: [F(1), F(0)] = [1, 0]

Result: F(n) = M^(n-1)[0][0]
```

### 2. Tribonacci Sequence

`T(n) = T(n-1) + T(n-2) + T(n-3)`

```
Transformation Matrix: [[1, 1, 1],
                        [1, 0, 0],
                        [0, 1, 0]]

Initial State: [T(2), T(1), T(0)] = [1, 1, 0]
```

### 3. General Second-Order Recurrence

`f(n) = a·f(n-1) + b·f(n-2)`

```
Transformation Matrix: [[a, b],
                        [1, 0]]

Examples:
- Climbing Stairs: a=1, b=1
- Jacobsthal: a=1, b=2 (f(n) = f(n-1) + 2·f(n-2))
```

### 4. Fast Doubling Method (Fibonacci Optimization)

An even more efficient approach specifically for Fibonacci:

```
F(2k) = F(k) × [2·F(k+1) − F(k)]
F(2k+1) = F(k+1)² + F(k)²
```

This achieves O(log n) with fewer operations than matrix exponentiation:

````carousel
```python
def fib_fast_doubling(n, mod=10**9+7):
    """
    Fast doubling method for Fibonacci.
    Returns (F(n), F(n+1)) as a pair.
    """
    if n == 0:
        return (0, 1)
    
    # Recursively compute F(n//2) and F(n//2 + 1)
    a, b = fib_fast_doubling(n >> 1, mod)
    
    # Apply fast doubling formulas
    c = (a * ((b * 2 - a) % mod)) % mod  # F(2k) = F(k) * [2*F(k+1) - F(k)]
    d = (a * a + b * b) % mod             # F(2k+1) = F(k+1)^2 + F(k)^2
    
    if n & 1:
        return (d, (c + d) % mod)  # n is odd: return (F(2k+1), F(2k+2))
    else:
        return (c, d)               # n is even: return (F(2k), F(2k+1))
```

<!-- slide: C++ -->
```cpp
// Fast doubling for Fibonacci
pair<ll, ll> fibFastDoubling(ll n, ll mod) {
    if (n == 0) return {0, 1};
    
    auto [a, b] = fibFastDoubling(n >> 1, mod);
    
    ll c = (a * ((2 * b % mod - a + mod) % mod)) % mod;
    ll d = (a * a % mod + b * b % mod) % mod;
    
    if (n & 1) return {d, (c + d) % mod};
    else return {c, d};
}
```
````

### 5. Graph Walk Counting

Count walks of length n from node u to node v:

```
Let A be the adjacency matrix of the graph
Number of walks of length n from u to v = Aⁿ[u][v]
```

This is because matrix multiplication counts paths:
- (A²)[i][j] = Σ A[i][k] × A[k][j] = paths of length 2 from i to j

Example for Knight Dialer (LeetCode 935):
```
The keypad is a graph where each digit connects to knight-move digits
The answer is sum of all entries in A^(n-1) × initial_state
```

---

## Practice Problems

### Problem 1: Fibonacci Number

**Problem:** [LeetCode 509 - Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)

**Description:** The Fibonacci numbers, commonly denoted F(n) form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

**How to Apply Matrix Exponentiation:**
- This is the most basic application of the technique
- Use the standard 2×2 transformation matrix [[1,1],[1,0]]
- Compute M^(n-1) and return the top-left element
- Time: O(log n) vs O(n) for iterative DP

---

### Problem 2: Climbing Stairs

**Problem:** [LeetCode 70 - Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

**Description:** You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**How to Apply Matrix Exponentiation:**
- This is equivalent to finding F(n+1) where F is the Fibonacci sequence
- Recurrence: ways(n) = ways(n-1) + ways(n-2)
- Same transformation matrix as Fibonacci
- Useful when n is very large (10⁹+) requiring modulo

---

### Problem 3: N-th Tribonacci Number

**Problem:** [LeetCode 1137 - N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)

**Description:** The Tribonacci sequence Tn is defined as: T(0) = 0, T(1) = 1, T(2) = 1, and T(n+3) = T(n) + T(n+1) + T(n+2) for n >= 0.

**How to Apply Matrix Exponentiation:**
- Use a 3×3 transformation matrix: [[1,1,1],[1,0,0],[0,1,0]]
- Initial state: [T(2), T(1), T(0)] = [1, 1, 0]
- Compute M^n and multiply by initial state
- Extension: Can generalize to k-bonacci numbers with k×k matrix

---

### Problem 4: Knight Dialer

**Problem:** [LeetCode 935 - Knight Dialer](https://leetcode.com/problems/knight-dialer/)

**Description:** The chess knight has a unique movement, it may move two squares vertically and one square horizontally, or two squares horizontally and one square vertically (forming an L shape). Given an integer n, return how many distinct numbers can be dialed with n jumps.

**How to Apply Matrix Exponentiation:**
- Model the phone keypad as a graph (10 nodes for digits 0-9)
- Build adjacency matrix: A[i][j] = 1 if a knight can move from digit i to digit j
- Answer is the sum of all entries in A^(n-1) × initial_vector
- Matrix dimension is 10×10, making this very efficient

---

### Problem 5: Find N-th Term of Series

**Problem:** [LeetCode 1220 - Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/)

**Description:** Given an integer n, your task is to count how many strings of length n can be formed under certain rules about vowel transitions.

**How to Apply Matrix Exponentiation:**
- Model vowel transitions as a state machine (5 states: a, e, i, o, u)
- Build 5×5 transition matrix based on allowed next vowels
- Compute matrix^(n-1) and sum all entries
- Can be extended to any state transition problem with fixed rules

---

## Video Tutorial Links

### Fundamentals

- [Matrix Exponentiation for Competitive Programming (Errichto)](https://www.youtube.com/watch?v=EEb6kK8PqP4) - Comprehensive introduction with examples
- [Matrix Exponentiation | Fibonacci LogN (Take U Forward)](https://www.youtube.com/watch?v=6SbR8R8M5Vk) - Clear explanation of Fibonacci application
- [Matrix Exponentiation - CP Algorithms](https://cp-algorithms.com/algebra/binary-exp.html) - Detailed written tutorial with code

### Advanced Topics

- [Fast Doubling Method for Fibonacci](https://www.youtube.com/watch?v=wJ4zuQvSfV4) - More efficient than matrix exponentiation for Fibonacci
- [Linear Recurrences using Matrix Exponentiation](https://www.youtube.com/watch?v=buZ09g0U--g) - General technique for any linear recurrence
- [Graph Exponentiation for Path Counting](https://www.youtube.com/watch?v=Z9b04p2f58k) - Applications in counting walks

### Problem-Solving

- [Knight Dialer Solution Explanation](https://www.youtube.com/watch?v=nyJkCqECf08) - LeetCode 935 walkthrough
- [Matrix Exponentiation Practice Problems](https://www.youtube.com/watch?v=0V6f6c13Qf8) - Common patterns and solutions

---

## Follow-up Questions

### Q1: Can I use matrix exponentiation for non-linear recurrences?

**Answer:** No. Matrix exponentiation only works for **linear recurrences with constant coefficients**. For example:
- ❌ `f(n) = f(n-1)²` (non-linear, quadratic)
- ❌ `f(n) = n·f(n-1)` (non-constant coefficient)
- ❌ `f(n) = f(n-1) + f(n-2) + n²` (non-homogeneous with polynomial)

For some non-homogeneous cases, you can extend the matrix to include the extra terms, but pure non-linear recurrences require different techniques.

### Q2: What about recurrences with non-constant coefficients?

**Answer:** Standard matrix exponentiation requires constant coefficients. For recurrences like `f(n) = n·f(n-1)`, you need other approaches:
- **Direct computation**: O(n) time, which may be acceptable
- **Segment Tree with lazy propagation**: For coefficient ranges
- **Polynomial matrix exponentiation**: For polynomial coefficients (advanced)

### Q3: How large can the matrix be in practice?

**Answer:** The O(k³) factor becomes significant:
- **k ≤ 5**: Very fast, negligible overhead
- **k ≤ 10**: Standard for competitive programming
- **k ≤ 50**: Still manageable for a few queries
- **k > 100**: Consider optimized multiplication (Strassen's) or alternative methods

For k=2 or k=3, write explicit multiplication formulas to avoid loop overhead.

### Q4: Can I optimize matrix multiplication further?

**Answer:** Yes! For small fixed-size matrices:

```python
# Optimized 2x2 multiplication - much faster than loops
def mul2x2(A, B, mod):
    return [
        [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % mod,
         (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % mod],
        [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % mod,
         (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % mod]
    ]
```

For larger matrices, consider:
- **Strassen's algorithm**: O(n^2.81) for large matrices
- **SIMD instructions**: Parallel multiplication
- **Sparse matrix optimization**: If many zeros

### Q5: When should I use Fast Doubling instead of Matrix Exponentiation?

**Answer:** Use **Fast Doubling** for Fibonacci specifically, **Matrix Exponentiation** for general recurrences:

| Aspect | Fast Doubling | Matrix Exponentiation |
|--------|--------------|----------------------|
| Fibonacci only | ✅ Faster (~2x) | ✅ Works |
| General recurrences | ❌ Doesn't work | ✅ Works |
| Code complexity | Slightly more | Standard pattern |
| Extension to k-bonacci | Hard | Easy |

If you're only computing Fibonacci numbers, Fast Doubling is preferred. For anything else (Tribonacci, linear recurrences, graph walks), use matrix exponentiation.

### Q6: How do I handle modulo operations correctly?

**Answer:** Key rules for modular arithmetic:
1. **Always mod after each operation**: `(a + b) % MOD`
2. **Handle negative results**: `(a - b + MOD) % MOD`
3. **Use 64-bit integers**: Even with mod, intermediate products can overflow 32-bit
4. **For division**: Use modular inverse (only if MOD is prime and divisor coprime)

Common MOD values:
- `10⁹ + 7` (1_000_000_007): Standard, prime
- `10⁹ + 9` (1_000_000_009): Alternative prime
- `998244353`: NTT-friendly prime

---

## Summary

Matrix exponentiation is a powerful mathematical technique for solving **linear recurrence relations** in logarithmic time.

**Key Points:**
1. **Convert recurrence to matrix form**: First row has coefficients, rest is shift matrix
2. **Use binary exponentiation**: Reduces O(n) to O(log n) multiplications
3. **Apply modulo at each step**: Prevents overflow in competitive programming
4. **Optimize for small matrices**: Write explicit formulas for 2×2 and 3×3

**When to Use:**
- ✅ Computing F(n) where n > 10⁶ (up to 10¹⁸)
- ✅ Solving any linear recurrence with constant coefficients
- ✅ Counting walks of length n in graphs
- ✅ Fast state transitions in DP with many steps

**When NOT to Use:**
- ❌ Non-linear recurrences (e.g., f(n) = f(n-1)²)
- ❌ Non-constant coefficients (e.g., f(n) = n·f(n-1))
- ❌ When n is small (DP is simpler and clearer)
- ❌ When you need all values f(0) to f(n)

This technique is essential for competitive programming and appears frequently in advanced technical interviews.

---

## Related Algorithms

- [Modular Exponentiation](./modular-exponentiation.md) - Same concept applied to scalars
- [Fast Doubling](./fast-doubling.md) - Optimized method specifically for Fibonacci
- [Dynamic Programming](./dynamic-programming.md) - Alternative for smaller n
- [Linear Recurrences](./linear-recurrences.md) - Characteristic polynomial method
- [Graph Theory](./graph-theory.md) - Path counting applications