# Linear Sieve (Euler's Sieve)

## Category
Math & Number Theory

## Description

The **Linear Sieve**, also known as **Euler's Sieve**, is an optimized algorithm for finding all prime numbers up to a given limit. Unlike the classic **Sieve of Eratosthenes** which runs in **O(n log log n)**, the Linear Sieve achieves **O(n)** time complexity.

It achieves this by ensuring that each composite number is crossed out exactly once by its smallest prime factor, making it significantly faster for large inputs.

---

## When to Use

Use the Linear Sieve when you need to:

- **Generate Primes Up to Large n**: When n ≤ 10^7 or higher
- **Prime Factorization**: Quickly factorize numbers using precomputed smallest prime factors
- **Multiplicative Functions**: Compute φ(n), μ(n), d(n) for all n up to a limit
- **Heavy Precomputation**: Multiple queries requiring prime information
- **Performance-Critical Code**: When Sieve of Eratosthenes is too slow

### Comparison with Sieve of Eratosthenes

| Algorithm | Time | Space | Each Composite Crossed |
|-----------|------|-------|----------------------|
| Eratosthenes | O(n log log n) | O(n) | Multiple times |
| **Linear Sieve** | **O(n)** | **O(n)** | **Exactly once** |

---

## Algorithm Explanation

### Key Insight

Every composite number `x` has a unique representation:
```
x = p × k
```

where `p` is the smallest prime factor of `x`.

The Linear Sieve ensures each composite is generated exactly once by its smallest prime factor.

### Algorithm Steps

1. **Initialize**: Array `is_prime[n+1] = true`, empty list `primes`
2. **Iterate** through numbers `i` from 2 to n:
   - If `is_prime[i]` is true, add `i` to `primes`
   - For each prime `p` in `primes`:
     - If `i × p > n`, break
     - Mark `is_prime[i × p] = false`
     - Store `spf[i × p] = p` (smallest prime factor)
     - **Critical**: If `i % p == 0`, break (ensures each composite marked only once)

### Why "Linear"?

Each composite is marked exactly once by its smallest prime factor. Since there are O(n) composites total, the algorithm runs in O(n).

---

## Implementation

### Template Code

````carousel
```python
def linear_sieve(n: int) -> tuple[list[int], list[int]]:
    """
    Linear Sieve: O(n) prime generation.
    
    Returns:
        primes: List of all primes ≤ n
        spf: Smallest prime factor for each number (0 and 1 are 0)
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if n < 2:
        return [], [0] * (n + 1)
    
    primes = []
    spf = [0] * (n + 1)  # Smallest prime factor
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i  # Prime's smallest factor is itself
        
        # Mark multiples
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            spf[i * p] = p  # p is the smallest prime factor
            
            # Key optimization: stop when p divides i
            # This ensures each composite is marked exactly once
            if i % p == 0:
                break
    
    return primes, spf


class LinearSieve:
    """
    Precomputed linear sieve with additional functionality.
    """
    
    def __init__(self, n: int):
        self.n = n
        self.primes, self.spf = linear_sieve(n)
        self.is_prime = [False] * (n + 1)
        for p in self.primes:
            self.is_prime[p] = True
    
    def factorize(self, x: int) -> list[tuple[int, int]]:
        """
        Factorize x into prime factors: returns [(p1, e1), (p2, e2), ...]
        where x = p1^e1 * p2^e2 * ...
        
        Time: O(log x)
        """
        if x > self.n:
            raise ValueError(f"x={x} exceeds precomputed limit n={self.n}")
        
        factors = []
        while x > 1:
            p = self.spf[x]
            count = 0
            while x % p == 0:
                x //= p
                count += 1
            factors.append((p, count))
        return factors
    
    def is_prime_num(self, x: int) -> bool:
        """Check if x is prime."""
        if x > self.n:
            raise ValueError(f"x={x} exceeds precomputed limit n={self.n}")
        return self.is_prime[x]
    
    def euler_totient(self) -> list[int]:
        """
        Compute Euler's totient function φ(n) for all n up to limit.
        φ(n) = count of numbers ≤ n that are coprime to n.
        
        Time: O(n)
        """
        phi = list(range(self.n + 1))
        
        for i in range(2, self.n + 1):
            if self.is_prime[i]:  # i is prime
                for j in range(i, self.n + 1, i):
                    phi[j] -= phi[j] // i
        
        return phi
    
    def mobius_function(self) -> list[int]:
        """
        Compute Möbius function μ(n) for all n up to limit.
        μ(n) = 1 if n is square-free with even number of prime factors
        μ(n) = -1 if n is square-free with odd number of prime factors
        μ(n) = 0 if n has squared prime factor
        """
        mu = [1] * (self.n + 1)
        is_square_free = [True] * (self.n + 1)
        
        for i in range(2, self.n + 1):
            if self.is_prime[i]:
                for j in range(i, self.n + 1, i):
                    mu[j] *= -1
                for j in range(i * i, self.n + 1, i * i):
                    is_square_free[j] = False
        
        for i in range(self.n + 1):
            if not is_square_free[i]:
                mu[i] = 0
        
        return mu


# Example usage
if __name__ == "__main__":
    n = 100
    primes, spf = linear_sieve(n)
    
    print(f"Primes up to {n}: {primes}")
    print(f"Number of primes: {len(primes)}")
    
    # Factorization examples
    sieve = LinearSieve(n)
    for x in [84, 100, 97]:
        factors = sieve.factorize(x)
        print(f"{x} = {' × '.join(f'{p}^{e}' if e > 1 else str(p) for p, e in factors)}")
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

/**
 * Linear Sieve - O(n) prime generation
 */
class LinearSieve {
private:
    int n;
    vector<int> spf;  // Smallest prime factor
    vector<bool> is_prime;
    vector<int> primes;
    
public:
    LinearSieve(int limit) : n(limit) {
        spf.resize(n + 1, 0);
        is_prime.resize(n + 1, true);
        is_prime[0] = is_prime[1] = false;
        
        for (int i = 2; i <= n; i++) {
            if (is_prime[i]) {
                primes.push_back(i);
                spf[i] = i;
            }
            
            for (int p : primes) {
                if (1LL * i * p > n) break;
                
                is_prime[i * p] = false;
                spf[i * p] = p;
                
                if (i % p == 0) break;
            }
        }
    }
    
    vector<pair<int, int>> factorize(int x) {
        vector<pair<int, int>> factors;
        while (x > 1) {
            int p = spf[x];
            int count = 0;
            while (x % p == 0) {
                x /= p;
                count++;
            }
            factors.push_back({p, count});
        }
        return factors;
    }
    
    bool checkPrime(int x) {
        return x <= n && is_prime[x];
    }
    
    const vector<int>& getPrimes() const {
        return primes;
    }
    
    // Euler's totient
    vector<int> eulerTotient() {
        vector<int> phi(n + 1);
        for (int i = 0; i <= n; i++) phi[i] = i;
        
        for (int p : primes) {
            for (int j = p; j <= n; j += p) {
                phi[j] -= phi[j] / p;
            }
        }
        return phi;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

public class LinearSieve {
    private int n;
    private int[] spf;
    private boolean[] isPrime;
    private List<Integer> primes;
    
    public LinearSieve(int limit) {
        this.n = limit;
        this.spf = new int[n + 1];
        this.isPrime = new boolean[n + 1];
        this.primes = new ArrayList<>();
        
        for (int i = 2; i <= n; i++) {
            isPrime[i] = true;
        }
        
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) {
                primes.add(i);
                spf[i] = i;
            }
            
            for (int p : primes) {
                if ((long) i * p > n) break;
                
                isPrime[i * p] = false;
                spf[i * p] = p;
                
                if (i % p == 0) break;
            }
        }
    }
    
    public List<int[]> factorize(int x) {
        List<int[]> factors = new ArrayList<>();
        while (x > 1) {
            int p = spf[x];
            int count = 0;
            while (x % p == 0) {
                x /= p;
                count++;
            }
            factors.add(new int[]{p, count});
        }
        return factors;
    }
    
    public boolean isPrime(int x) {
        return x <= n && isPrime[x];
    }
    
    public List<Integer> getPrimes() {
        return primes;
    }
    
    public int[] eulerTotient() {
        int[] phi = new int[n + 1];
        for (int i = 0; i <= n; i++) phi[i] = i;
        
        for (int p : primes) {
            for (int j = p; j <= n; j += p) {
                phi[j] -= phi[j] / p;
            }
        }
        return phi;
    }
}
```

<!-- slide -->
```javascript
class LinearSieve {
    constructor(n) {
        this.n = n;
        this.spf = new Array(n + 1).fill(0);
        this.isPrime = new Array(n + 1).fill(true);
        this.primes = [];
        
        this.isPrime[0] = this.isPrime[1] = false;
        
        for (let i = 2; i <= n; i++) {
            if (this.isPrime[i]) {
                this.primes.push(i);
                this.spf[i] = i;
            }
            
            for (const p of this.primes) {
                if (i * p > n) break;
                
                this.isPrime[i * p] = false;
                this.spf[i * p] = p;
                
                if (i % p === 0) break;
            }
        }
    }
    
    factorize(x) {
        const factors = [];
        while (x > 1) {
            const p = this.spf[x];
            let count = 0;
            while (x % p === 0) {
                x /= p;
                count++;
            }
            factors.push([p, count]);
        }
        return factors;
    }
    
    checkPrime(x) {
        return x <= this.n && this.isPrime[x];
    }
    
    getPrimes() {
        return this.primes;
    }
}

// Example
const sieve = new LinearSieve(100);
console.log("Primes:", sieve.getPrimes());
console.log("84 factorization:", sieve.factorize(84));
```
````

---

## Applications

### 1. Fast Factorization

```python
def fast_factorization(n, spf):
    """O(log n) factorization using precomputed SPF."""
    factors = []
    while n > 1:
        p = spf[n]
        count = 0
        while n % p == 0:
            n //= p
            count += 1
        factors.append((p, count))
    return factors
```

### 2. Compute Multiplicative Functions

```python
def compute_multiplicative_functions(n):
    """
    Compute various number-theoretic functions using linear sieve.
    """
    sieve = LinearSieve(n)
    
    # Euler's totient
    phi = sieve.euler_totient()
    
    # Möbius function
    mu = sieve.mobius_function()
    
    # Divisor count d(n)
    d = [1] * (n + 1)
    for p in sieve.primes:
        for power in range(p, n + 1, p):
            # Update divisor count
            temp = power
            count = 0
            while temp % p == 0:
                temp //= p
                count += 1
            # Complex update logic...
    
    return phi, mu, d
```

---

## Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Sieve construction | O(n) | O(n) |
| Prime check | O(1) | - |
| Factorization | O(log n) | - |
| Euler's totient (all) | O(n log log n) | O(n) |

---

## Practice Problems

### Problem 1: Count Primes
**Problem**: [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Solution**: Linear sieve up to n.

### Problem 2: Sum of Divisors
**Problem**: Compute sum of divisors for all numbers up to n.

**Solution**: Extend linear sieve to track sum of divisors.

### Problem 3: Smallest Prime Factor Queries
**Problem**: Multiple queries asking for smallest prime factor.

**Solution**: Precompute SPF with linear sieve, answer in O(1).

---

## Follow-up Questions

### Q1: Why is it called "Linear" Sieve?

**Answer**: Because it runs in O(n) time - linear in the input size. Each composite is marked exactly once, unlike Eratosthenes where composites may be marked multiple times.

### Q2: When should I use Linear Sieve vs Eratosthenes?

**Answer**: Use Linear Sieve when:
- n > 10^6 and performance matters
- You need smallest prime factors
- You need to factorize many numbers
- Computing multiplicative functions

Use Eratosthenes when:
- n is small (< 10^6)
- You only need primality, not factorization
- Simplicity is preferred over performance

### Q3: Can Linear Sieve handle n = 10^8?

**Answer**: Yes, but memory becomes the bottleneck (needs ~400MB for arrays). For very large n, use segmented sieve instead.

---

## Summary

The Linear Sieve is the most efficient prime generation algorithm for competitive programming:

- **O(n) time**: Each composite marked exactly once
- **Provides SPF**: Enables O(log n) factorization
- **Extensible**: Easy to compute multiplicative functions

**Use when**: Performance matters and you need prime factorization or multiplicative functions.

---

## Related Algorithms

- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - Simpler but slower
- [Miller-Rabin](./miller-rabin.md) - Primality testing for large numbers
- [GCD](./gcd-euclidean.md) - Used with prime factorizations