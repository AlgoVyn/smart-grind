# Linear Sieve (Euler's Sieve)

## Category
Math & Number Theory

## Description

The **Linear Sieve**, also known as **Euler's Sieve**, is the most efficient algorithm for generating all prime numbers up to a given limit `n`. Unlike the classic **Sieve of Eratosthenes** which runs in **O(n log log n)** time complexity, the Linear Sieve achieves optimal **O(n)** time complexity.

The key innovation is that each composite number is marked exactly once by its **smallest prime factor (SPF)**. This guarantees linear time complexity while also providing valuable auxiliary information - the smallest prime factor for every number up to `n` - which enables O(log n) factorization of any number in the range.

---

## When to Use

Use the Linear Sieve when you need to solve problems involving:

- **Prime Generation**: Finding all primes up to large limits (n ≤ 10^7 efficiently)
- **Prime Factorization**: Fast factorization of multiple numbers using precomputed SPF
- **Multiplicative Functions**: Computing Euler's totient φ(n), Möbius function μ(n), divisor count d(n), or divisor sum σ(n)
- **Number Theory Problems**: Problems requiring frequent primality checks or factorization
- **Competitive Programming**: When performance is critical and preprocessing is feasible

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Each Composite Crossed | Provides SPF |
|-----------|----------------|------------------|------------------------|--------------|
| **Trial Division** | O(n√n) | O(1) | N/A | ❌ No |
| **Sieve of Eratosthenes** | O(n log log n) | O(n) | Multiple times | ❌ No |
| **Segmented Sieve** | O(n log log n) | O(√n) | Multiple times | ❌ No |
| **Linear Sieve** | **O(n)** | **O(n)** | **Exactly once** | ✅ **Yes** |

### When to Choose Linear Sieve vs Sieve of Eratosthenes

**Choose Linear Sieve when:**
- You need to factorize numbers (requires SPF)
- You're computing multiplicative functions
- n > 10^6 and performance matters
- Memory is sufficient for O(n) storage

**Choose Sieve of Eratosthenes when:**
- You only need primality testing
- n is relatively small (< 10^6)
- Simplicity is preferred over performance
- Memory is constrained

---

## Algorithm Explanation

### Core Concept

Every composite number `x` can be uniquely represented as:

```
x = p × k
```

where `p` is the **smallest prime factor** of `x`, and `k` is some integer ≥ p.

The Linear Sieve ensures each composite is generated exactly once by its smallest prime factor, guaranteeing O(n) total operations.

### How It Works

The algorithm maintains:
1. **`is_prime[]`**: Boolean array marking primality
2. **`spf[]`**: Smallest prime factor for each number
3. **`primes[]`**: List of discovered primes

#### Key Insight: The Breaking Condition

When iterating through primes `p` for each number `i`:
- Mark `i × p` as composite
- Set `spf[i × p] = p`
- **Critical**: If `p` divides `i` (i.e., `i % p == 0`), **break immediately**

This ensures `i × p` is marked only by its smallest prime factor.

### Visual Representation

For n = 30, let's trace how composites are marked:

```
Numbers:  2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30
          ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓
SPF:      2   3   2   5   2   7   2   3   2   11  2   13  2   3   2   17  2   19  2   3   2   23  2   5   2   3   2   29  2

Composites marked by their smallest prime factor:
4  = 2 × 2    (marked when i=2, p=2)
6  = 2 × 3    (marked when i=3, p=2)
8  = 2 × 4    (marked when i=4, p=2)
9  = 3 × 3    (marked when i=3, p=3)
10 = 2 × 5    (marked when i=5, p=2)
12 = 2 × 6    (marked when i=6, p=2) ← Note: 12 = 3 × 4, but 2 is smaller
...
30 = 2 × 15   (marked when i=15, p=2)
```

### Why It's O(n)

Each composite number has exactly one smallest prime factor, so each composite is marked exactly once. With O(n) primes and O(n) composites, total operations are O(n).

```
Total marks = Σ (composites marked by each prime)
            = Number of composites
            = O(n)
```

---

## Algorithm Steps

### Building the Linear Sieve

1. **Initialize arrays**:
   - `is_prime[0...n] = true` (except indices 0 and 1)
   - `spf[0...n] = 0`
   - Empty list `primes = []`

2. **Iterate** through numbers `i` from 2 to n:
   
   a. **If `is_prime[i]` is true**:
      - Add `i` to `primes`
      - Set `spf[i] = i` (prime's smallest factor is itself)
   
   b. **For each prime `p` in `primes`**:
      - If `i × p > n`, break
      - Mark `is_prime[i × p] = false`
      - Set `spf[i × p] = p`
      - **If `i % p == 0`, break** (critical optimization)

### Factorization Using SPF

Once the sieve is built, factorize any number `x` in O(log x):

1. While `x > 1`:
   - Get `p = spf[x]`
   - Count how many times `p` divides `x`
   - Divide `x` by `p` repeatedly
   - Add `(p, count)` to factors

---

## Implementation

### Complete Linear Sieve Implementation

````carousel
```python
from typing import List, Tuple
import math

def linear_sieve(n: int) -> Tuple[List[int], List[int]]:
    """
    Linear Sieve: O(n) prime generation with smallest prime factor.
    
    Args:
        n: Upper limit (inclusive) for prime generation
        
    Returns:
        Tuple of (primes list, spf array)
        - primes: List of all primes ≤ n
        - spf: Smallest prime factor for each number (0 and 1 have spf=0)
    
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
        
        # Mark multiples using each prime
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            spf[i * p] = p  # p is the smallest prime factor of i*p
            
            # CRITICAL OPTIMIZATION: Stop when p divides i
            # This ensures each composite is marked exactly once
            if i % p == 0:
                break
    
    return primes, spf


class LinearSieve:
    """
    Complete Linear Sieve implementation with multiplicative functions.
    """
    
    def __init__(self, n: int):
        """
        Initialize the sieve up to n.
        
        Time: O(n)
        Space: O(n)
        """
        self.n = n
        self.primes, self.spf = linear_sieve(n)
        self.is_prime_arr = [False] * (n + 1)
        for p in self.primes:
            self.is_prime_arr[p] = True
    
    def is_prime(self, x: int) -> bool:
        """Check if x is prime. Time: O(1)"""
        if x > self.n:
            raise ValueError(f"x={x} exceeds precomputed limit n={self.n}")
        return self.is_prime_arr[x]
    
    def factorize(self, x: int) -> List[Tuple[int, int]]:
        """
        Factorize x into prime factors: [(p1, e1), (p2, e2), ...]
        where x = p1^e1 * p2^e2 * ...
        
        Time: O(log x)
        """
        if x > self.n:
            raise ValueError(f"x={x} exceeds precomputed limit n={self.n}")
        if x < 1:
            raise ValueError("x must be >= 1")
        
        factors = []
        while x > 1:
            p = self.spf[x]
            count = 0
            while x % p == 0:
                x //= p
                count += 1
            factors.append((p, count))
        return factors
    
    def euler_totient(self) -> List[int]:
        """
        Compute Euler's totient function φ(n) for all n up to limit.
        φ(n) = count of numbers ≤ n that are coprime to n.
        
        Uses the formula: if n = p1^e1 * p2^e2 * ..., then
        φ(n) = n * (1 - 1/p1) * (1 - 1/p2) * ...
        
        Time: O(n)
        """
        phi = list(range(self.n + 1))
        
        for p in self.primes:
            for j in range(p, self.n + 1, p):
                phi[j] -= phi[j] // p
        
        return phi
    
    def mobius_function(self) -> List[int]:
        """
        Compute Möbius function μ(n) for all n up to limit.
        
        μ(n) =  1 if n is square-free with even number of prime factors
        μ(n) = -1 if n is square-free with odd number of prime factors
        μ(n) =  0 if n has a squared prime factor
        
        Time: O(n)
        """
        mu = [1] * (self.n + 1)
        is_square_free = [True] * (self.n + 1)
        
        for p in self.primes:
            # Multiply by -1 for each prime factor
            for j in range(p, self.n + 1, p):
                mu[j] *= -1
            
            # Mark multiples of p^2 as not square-free
            p_square = p * p
            for j in range(p_square, self.n + 1, p_square):
                is_square_free[j] = False
        
        for i in range(self.n + 1):
            if not is_square_free[i]:
                mu[i] = 0
        
        return mu
    
    def divisor_count(self) -> List[int]:
        """
        Compute number of divisors d(n) for all n up to limit.
        
        If n = p1^e1 * p2^e2 * ..., then d(n) = (e1+1) * (e2+1) * ...
        
        Time: O(n)
        """
        d = [1] * (self.n + 1)
        # d[1] = 1 by definition
        
        for i in range(2, self.n + 1):
            if self.is_prime_arr[i]:
                # For prime p: d[p^k] = k+1
                power = i
                exp = 1
                while power <= self.n:
                    for j in range(power, self.n + 1, power):
                        if j // power % i != 0:  # Only count exact powers
                            d[j] *= (exp + 1)
                            d[j] //= exp  # Adjust from previous
                    power *= i
                    exp += 1
        
        # Simpler approach using SPF
        d = [1] * (self.n + 1)
        count = [0] * (self.n + 1)  # Count of each prime factor
        
        for i in range(2, self.n + 1):
            p = self.spf[i]
            m = i // p
            if self.spf[m] == p:
                count[i] = count[m] + 1
                d[i] = d[m] // (count[m] + 1) * (count[i] + 1)
            else:
                count[i] = 1
                d[i] = d[m] * 2
        
        return d
    
    def divisor_sum(self) -> List[int]:
        """
        Compute sum of divisors σ(n) for all n up to limit.
        
        If n = p1^e1 * p2^e2 * ..., then
        σ(n) = (1 + p1 + ... + p1^e1) * (1 + p2 + ... + p2^e2) * ...
        
        Time: O(n)
        """
        sigma = [1] * (self.n + 1)
        sigma[0] = 0
        
        # For each prime, update its multiples
        for p in self.primes:
            power = p
            term = 1 + p  # Sum of 1 + p + p^2 + ... for current power
            while power <= self.n:
                for j in range(power, self.n + 1, power):
                    if j // power % p != 0:
                        sigma[j] *= term
                        sigma[j] //= (1 if power == p else 1 + power // p)
                power *= p
                term += power
        
        # Alternative using SPF (more efficient)
        sigma = [1] * (self.n + 1)
        sigma[0] = 0
        p_power = [1] * (self.n + 1)  # p^e for the current prime power
        
        for i in range(2, self.n + 1):
            p = self.spf[i]
            m = i // p
            if m % p == 0:
                p_power[i] = p_power[m] * p
                sigma[i] = sigma[m] + p_power[i]
            else:
                p_power[i] = p
                sigma[i] = sigma[m] * (1 + p)
        
        return sigma


# Example usage and demonstration
if __name__ == "__main__":
    n = 100
    sieve = LinearSieve(n)
    
    print(f"Primes up to {n}: {sieve.primes}")
    print(f"Number of primes: {len(sieve.primes)}")
    print()
    
    # Factorization examples
    print("Factorization examples:")
    for x in [84, 100, 97, 60, 72]:
        factors = sieve.factorize(x)
        factor_str = ' × '.join(f'{p}^{e}' if e > 1 else str(p) for p, e in factors)
        print(f"  {x} = {factor_str}")
    
    print()
    
    # Multiplicative functions
    phi = sieve.euler_totient()
    mu = sieve.mobius_function()
    d = sieve.divisor_count()
    sigma = sieve.divisor_sum()
    
    print("Multiplicative functions:")
    print(f"{'n':<4} {'φ(n)':<6} {'μ(n)':<6} {'d(n)':<6} {'σ(n)':<6}")
    print("-" * 30)
    for i in range(1, 21):
        print(f"{i:<4} {phi[i]:<6} {mu[i]:<6} {d[i]:<6} {sigma[i]:<6}")
```

<!-- slide -->
```cpp
#include <bits/stdc++.h>
using namespace std;

/**
 * Linear Sieve - O(n) prime generation with SPF
 * 
 * Time: O(n) for construction
 * Space: O(n)
 */
class LinearSieve {
private:
    int n;
    vector<int> spf;        // Smallest prime factor
    vector<bool> isPrime;
    vector<int> primes;
    
public:
    LinearSieve(int limit) : n(limit) {
        spf.resize(n + 1, 0);
        isPrime.resize(n + 1, true);
        isPrime[0] = isPrime[1] = false;
        
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) {
                primes.push_back(i);
                spf[i] = i;
            }
            
            for (int p : primes) {
                long long mult = 1LL * i * p;
                if (mult > n) break;
                
                isPrime[mult] = false;
                spf[mult] = p;
                
                // Critical: stop when p divides i
                if (i % p == 0) break;
            }
        }
    }
    
    // Check if x is prime
    bool checkPrime(int x) const {
        return x <= n && isPrime[x];
    }
    
    // Get list of all primes
    const vector<int>& getPrimes() const {
        return primes;
    }
    
    // Get smallest prime factor of x
    int getSPF(int x) const {
        return x <= n ? spf[x] : -1;
    }
    
    // Factorize x in O(log x)
    vector<pair<int, int>> factorize(int x) const {
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
    
    // Euler's totient function for all n up to limit
    vector<int> eulerTotient() const {
        vector<int> phi(n + 1);
        for (int i = 0; i <= n; i++) phi[i] = i;
        
        for (int p : primes) {
            for (int j = p; j <= n; j += p) {
                phi[j] -= phi[j] / p;
            }
        }
        return phi;
    }
    
    // Möbius function for all n up to limit
    vector<int> mobiusFunction() const {
        vector<int> mu(n + 1, 1);
        vector<bool> isSquareFree(n + 1, true);
        
        for (int p : primes) {
            for (int j = p; j <= n; j += p) {
                mu[j] *= -1;
            }
            long long pSquare = 1LL * p * p;
            for (long long j = pSquare; j <= n; j += pSquare) {
                isSquareFree[(int)j] = false;
            }
        }
        
        for (int i = 0; i <= n; i++) {
            if (!isSquareFree[i]) mu[i] = 0;
        }
        return mu;
    }
    
    // Divisor count for all n up to limit
    vector<int> divisorCount() const {
        vector<int> d(n + 1, 1);
        vector<int> count(n + 1, 0);
        
        for (int i = 2; i <= n; i++) {
            int p = spf[i];
            int m = i / p;
            if (spf[m] == p) {
                count[i] = count[m] + 1;
                d[i] = d[m] / (count[m] + 1) * (count[i] + 1);
            } else {
                count[i] = 1;
                d[i] = d[m] * 2;
            }
        }
        return d;
    }
    
    // Divisor sum for all n up to limit
    vector<int> divisorSum() const {
        vector<int> sigma(n + 1, 1);
        sigma[0] = 0;
        vector<int> pPower(n + 1, 1);
        
        for (int i = 2; i <= n; i++) {
            int p = spf[i];
            int m = i / p;
            if (m % p == 0) {
                pPower[i] = pPower[m] * p;
                sigma[i] = sigma[m] + pPower[i];
            } else {
                pPower[i] = p;
                sigma[i] = sigma[m] * (1 + p);
            }
        }
        return sigma;
    }
};

// Example usage
int main() {
    int n = 100;
    LinearSieve sieve(n);
    
    cout << "Primes up to " << n << ": ";
    for (int p : sieve.getPrimes()) {
        cout << p << " ";
    }
    cout << endl;
    cout << "Number of primes: " << sieve.getPrimes().size() << endl << endl;
    
    // Factorization examples
    cout << "Factorization examples:" << endl;
    for (int x : {84, 100, 97, 60, 72}) {
        cout << "  " << x << " = ";
        auto factors = sieve.factorize(x);
        for (size_t i = 0; i < factors.size(); i++) {
            if (i > 0) cout << " × ";
            cout << factors[i].first;
            if (factors[i].second > 1) cout << "^" << factors[i].second;
        }
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

/**
 * Linear Sieve - O(n) prime generation with SPF
 * 
 * Time: O(n) for construction
 * Space: O(n)
 */
public class LinearSieve {
    private int n;
    private int[] spf;           // Smallest prime factor
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
                long mult = (long) i * p;
                if (mult > n) break;
                
                isPrime[(int) mult] = false;
                spf[(int) mult] = p;
                
                // Critical: stop when p divides i
                if (i % p == 0) break;
            }
        }
    }
    
    // Check if x is prime
    public boolean isPrime(int x) {
        return x <= n && isPrime[x];
    }
    
    // Get list of all primes
    public List<Integer> getPrimes() {
        return primes;
    }
    
    // Get smallest prime factor
    public int getSPF(int x) {
        return x <= n ? spf[x] : -1;
    }
    
    // Factorize x in O(log x)
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
    
    // Euler's totient function
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
    
    // Möbius function
    public int[] mobiusFunction() {
        int[] mu = new int[n + 1];
        boolean[] isSquareFree = new boolean[n + 1];
        
        for (int i = 0; i <= n; i++) {
            mu[i] = 1;
            isSquareFree[i] = true;
        }
        
        for (int p : primes) {
            for (int j = p; j <= n; j += p) {
                mu[j] *= -1;
            }
            long pSquare = (long) p * p;
            for (long j = pSquare; j <= n; j += pSquare) {
                isSquareFree[(int) j] = false;
            }
        }
        
        for (int i = 0; i <= n; i++) {
            if (!isSquareFree[i]) mu[i] = 0;
        }
        return mu;
    }
    
    // Divisor count
    public int[] divisorCount() {
        int[] d = new int[n + 1];
        int[] count = new int[n + 1];
        
        d[1] = 1;
        for (int i = 2; i <= n; i++) {
            int p = spf[i];
            int m = i / p;
            if (spf[m] == p) {
                count[i] = count[m] + 1;
                d[i] = d[m] / (count[m] + 1) * (count[i] + 1);
            } else {
                count[i] = 1;
                d[i] = d[m] * 2;
            }
        }
        return d;
    }
    
    // Divisor sum
    public int[] divisorSum() {
        int[] sigma = new int[n + 1];
        int[] pPower = new int[n + 1];
        
        sigma[0] = 0;
        sigma[1] = 1;
        pPower[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            int p = spf[i];
            int m = i / p;
            if (m % p == 0) {
                pPower[i] = pPower[m] * p;
                sigma[i] = sigma[m] + pPower[i];
            } else {
                pPower[i] = p;
                sigma[i] = sigma[m] * (1 + p);
            }
        }
        return sigma;
    }
    
    // Example usage
    public static void main(String[] args) {
        int n = 100;
        LinearSieve sieve = new LinearSieve(n);
        
        System.out.print("Primes up to " + n + ": ");
        for (int p : sieve.getPrimes()) {
            System.out.print(p + " ");
        }
        System.out.println();
        System.out.println("Number of primes: " + sieve.getPrimes().size());
        System.out.println();
        
        // Factorization examples
        System.out.println("Factorization examples:");
        for (int x : new int[]{84, 100, 97, 60, 72}) {
            System.out.print("  " + x + " = ");
            List<int[]> factors = sieve.factorize(x);
            for (int i = 0; i < factors.size(); i++) {
                if (i > 0) System.out.print(" × ");
                System.out.print(factors.get(i)[0]);
                if (factors.get(i)[1] > 1) {
                    System.out.print("^" + factors.get(i)[1]);
                }
            }
            System.out.println();
        }
        
        // Multiplicative functions
        int[] phi = sieve.eulerTotient();
        int[] mu = sieve.mobiusFunction();
        int[] d = sieve.divisorCount();
        int[] sigma = sieve.divisorSum();
        
        System.out.println("\nMultiplicative functions:");
        System.out.printf("%-4s %-6s %-6s %-6s %-6s%n", "n", "φ(n)", "μ(n)", "d(n)", "σ(n)");
        System.out.println("-".repeat(30));
        for (int i = 1; i <= 20; i++) {
            System.out.printf("%-4d %-6d %-6d %-6d %-6d%n", i, phi[i], mu[i], d[i], sigma[i]);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Linear Sieve - O(n) prime generation with SPF
 * 
 * Time: O(n) for construction
 * Space: O(n)
 */
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
                const mult = i * p;
                if (mult > n) break;
                
                this.isPrime[mult] = false;
                this.spf[mult] = p;
                
                // Critical: stop when p divides i
                if (i % p === 0) break;
            }
        }
    }
    
    // Check if x is prime
    checkPrime(x) {
        return x <= this.n && this.isPrime[x];
    }
    
    // Get list of all primes
    getPrimes() {
        return this.primes;
    }
    
    // Get smallest prime factor
    getSPF(x) {
        return x <= this.n ? this.spf[x] : -1;
    }
    
    // Factorize x in O(log x)
    factorize(x) {
        const factors = [];
        while (x > 1) {
            const p = this.spf[x];
            let count = 0;
            while (x % p === 0) {
                x = Math.floor(x / p);
                count++;
            }
            factors.push([p, count]);
        }
        return factors;
    }
    
    // Euler's totient function
    eulerTotient() {
        const phi = Array.from({length: this.n + 1}, (_, i) => i);
        
        for (const p of this.primes) {
            for (let j = p; j <= this.n; j += p) {
                phi[j] -= Math.floor(phi[j] / p);
            }
        }
        return phi;
    }
    
    // Möbius function
    mobiusFunction() {
        const mu = new Array(this.n + 1).fill(1);
        const isSquareFree = new Array(this.n + 1).fill(true);
        
        for (const p of this.primes) {
            for (let j = p; j <= this.n; j += p) {
                mu[j] *= -1;
            }
            const pSquare = p * p;
            for (let j = pSquare; j <= this.n; j += pSquare) {
                isSquareFree[j] = false;
            }
        }
        
        for (let i = 0; i <= this.n; i++) {
            if (!isSquareFree[i]) mu[i] = 0;
        }
        return mu;
    }
    
    // Divisor count
    divisorCount() {
        const d = new Array(this.n + 1).fill(1);
        const count = new Array(this.n + 1).fill(0);
        
        d[1] = 1;
        for (let i = 2; i <= this.n; i++) {
            const p = this.spf[i];
            const m = Math.floor(i / p);
            if (this.spf[m] === p) {
                count[i] = count[m] + 1;
                d[i] = Math.floor(d[m] / (count[m] + 1)) * (count[i] + 1);
            } else {
                count[i] = 1;
                d[i] = d[m] * 2;
            }
        }
        return d;
    }
    
    // Divisor sum
    divisorSum() {
        const sigma = new Array(this.n + 1).fill(1);
        const pPower = new Array(this.n + 1).fill(1);
        
        sigma[0] = 0;
        sigma[1] = 1;
        
        for (let i = 2; i <= this.n; i++) {
            const p = this.spf[i];
            const m = Math.floor(i / p);
            if (m % p === 0) {
                pPower[i] = pPower[m] * p;
                sigma[i] = sigma[m] + pPower[i];
            } else {
                pPower[i] = p;
                sigma[i] = sigma[m] * (1 + p);
            }
        }
        return sigma;
    }
}

// Example usage
const sieve = new LinearSieve(100);

console.log(`Primes up to 100: ${sieve.getPrimes().join(', ')}`);
console.log(`Number of primes: ${sieve.getPrimes().length}\n`);

// Factorization examples
console.log("Factorization examples:");
for (const x of [84, 100, 97, 60, 72]) {
    const factors = sieve.factorize(x);
    const factorStr = factors.map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ');
    console.log(`  ${x} = ${factorStr}`);
}

// Multiplicative functions
const phi = sieve.eulerTotient();
const mu = sieve.mobiusFunction();
const d = sieve.divisorCount();
const sigma = sieve.divisorSum();

console.log("\nMultiplicative functions:");
console.log(`${'n'.padEnd(4)} ${'φ(n)'.padEnd(6)} ${'μ(n)'.padEnd(6)} ${'d(n)'.padEnd(6)} ${'σ(n)'.padEnd(6)}`);
console.log("-".repeat(30));
for (let i = 1; i <= 20; i++) {
    console.log(`${String(i).padEnd(4)} ${String(phi[i]).padEnd(6)} ${String(mu[i]).padEnd(6)} ${String(d[i]).padEnd(6)} ${String(sigma[i]).padEnd(6)}`);
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sieve Construction** | O(n) | Each composite marked exactly once |
| **Prime Check** | O(1) | Direct array lookup |
| **Single Factorization** | O(log x) | Using precomputed SPF |
| **All Factorizations** | O(n log n) | Factorize all numbers up to n |
| **Euler's Totient (all)** | O(n log log n) | Using linear sieve primes |
| **Möbius Function (all)** | O(n) | Linear computation |

### Detailed Breakdown

**Why is the Sieve O(n)?**

Each composite number `c` is marked exactly once when processed with its smallest prime factor. Since there are approximately `n - n/ln(n) = O(n)` composite numbers:

```
Total operations = Σ (work per composite)
                 = O(number of composites)
                 = O(n)
```

**The Critical Optimization:**

The condition `if (i % p == 0) break` ensures linear complexity:
- Without this: Each composite would be marked multiple times → O(n log n)
- With this: Each composite marked exactly once → O(n)

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|-----------------|-------------|
| **is_prime[]** | O(n) | Boolean array for primality |
| **spf[]** | O(n) | Integer array for smallest prime factor |
| **primes[]** | O(n/log n) ≈ O(n) | List of primes (~n/ln n primes) |
| **Total** | **O(n)** | ~4n bytes for booleans + 4n bytes for SPF |

### Space Optimization Tips

1. **Use bitset for is_prime**: Reduces space by 8× (1 bit vs 1 byte)
2. **Use uint16 for SPF**: If n ≤ 65535, use 16-bit integers
3. **Discard is_prime after construction**: Can recompute from SPF if needed

---

## Common Variations

### 1. Linear Sieve for Multiplicative Functions

Compute multiple multiplicative functions in a single pass:

````carousel
```python
def linear_sieve_multiplicative(n):
    """
    Compute multiple multiplicative functions in one pass.
    Returns: (primes, spf, phi, mu, d, sigma)
    """
    spf = [0] * (n + 1)
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    primes = []
    
    # Multiplicative functions
    phi = list(range(n + 1))    # Euler's totient
    mu = [1] * (n + 1)          # Möbius function
    d = [1] * (n + 1)           # Divisor count
    sigma = [1] * (n + 1)       # Divisor sum
    sigma[0] = 0
    
    # Helper arrays
    p_power = [1] * (n + 1)     # Highest power of spf dividing i
    exp_count = [0] * (n + 1)   # Exponent of spf in i
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i
            phi[i] = i - 1      # φ(p) = p - 1
            mu[i] = -1          # μ(p) = -1
            d[i] = 2            # d(p) = 2
            sigma[i] = 1 + i    # σ(p) = 1 + p
            p_power[i] = i
            exp_count[i] = 1
        
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            spf[i * p] = p
            
            if i % p == 0:
                # p divides i, so we're extending the power of p
                p_power[i * p] = p_power[i] * p
                exp_count[i * p] = exp_count[i] + 1
                
                # Update multiplicative functions
                phi[i * p] = phi[i] * p
                mu[i * p] = 0  # Has squared prime factor
                d[i * p] = d[i] // (exp_count[i] + 1) * (exp_count[i * p] + 1)
                sigma[i * p] = sigma[i] + p_power[i * p]
                break
            else:
                # p doesn't divide i, coprime case
                p_power[i * p] = p
                exp_count[i * p] = 1
                
                # Multiplicative property: f(ab) = f(a) * f(b) when gcd(a,b)=1
                phi[i * p] = phi[i] * (p - 1)
                mu[i * p] = mu[i] * (-1)
                d[i * p] = d[i] * 2
                sigma[i * p] = sigma[i] * (1 + p)
    
    return primes, spf, phi, mu, d, sigma
```
````

### 2. Factorization with Exponents

````carousel
```python
def factorize_with_exponents(x, spf):
    """
    Factorize x and return as dictionary {prime: exponent}.
    Time: O(log x)
    """
    factors = {}
    while x > 1:
        p = spf[x]
        factors[p] = factors.get(p, 0) + 1
        x //= p
    return factors

def get_all_divisors(x, spf):
    """
    Get all divisors of x using prime factorization.
    Time: O(d(x)) where d(x) is number of divisors
    """
    factors = factorize_with_exponents(x, spf)
    divisors = [1]
    
    for p, exp in factors.items():
        new_divisors = []
        p_power = 1
        for e in range(exp + 1):
            for d in divisors:
                new_divisors.append(d * p_power)
            p_power *= p
        divisors = new_divisors
    
    return sorted(divisors)
```
````

### 3. Segmented Linear Sieve

For very large n (n > 10^8), use segmented approach:

````carousel
```python
def segmented_linear_sieve(n):
    """
    Segmented linear sieve for very large n.
    First find primes up to √n, then use them to mark segments.
    """
    limit = int(n**0.5) + 1
    base_primes, _ = linear_sieve(limit)
    
    segment_size = min(10**6, n)  # Process in chunks
    is_prime = [True] * (n + 1)
    
    for p in base_primes:
        # Start marking from p*p
        start = p * p
        for j in range(start, n + 1, p):
            is_prime[j] = False
    
    primes = [i for i in range(2, n + 1) if is_prime[i]]
    return primes
```
````

### 4. Linear Sieve in Range Queries

Preprocess primes for multiple queries:

````carousel
```python
class PrimeRangeQuery:
    """Handle multiple prime-related queries efficiently."""
    
    def __init__(self, n):
        self.n = n
        self.sieve = LinearSieve(n)
        # Prefix sum of primes for count queries
        self.prime_prefix = [0] * (n + 1)
        for i in range(1, n + 1):
            self.prime_prefix[i] = self.prime_prefix[i-1] + (1 if self.sieve.is_prime(i) else 0)
    
    def count_primes_in_range(self, l, r):
        """Count primes in [l, r]. Time: O(1)"""
        return self.prime_prefix[r] - self.prime_prefix[l-1]
    
    def is_prime(self, x):
        """Check if x is prime. Time: O(1)"""
        return self.sieve.is_prime(x)
    
    def factorize(self, x):
        """Factorize x. Time: O(log x)"""
        return self.sieve.factorize(x)
```
````

---

## Practice Problems

### Problem 1: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Given an integer `n`, return the number of prime numbers that are strictly less than `n`.

**How to Apply Linear Sieve:**
- Build linear sieve up to n
- Count primes in the generated list
- Time: O(n) for sieve, O(1) for count

**Solution Approach:**
```python
def countPrimes(self, n: int) -> int:
    if n <= 2:
        return 0
    
    primes, _ = linear_sieve(n - 1)  # strictly less than n
    return len(primes)
```

---

### Problem 2: Sum of Four Divisors

**Problem:** [LeetCode 1390 - Sum of Four Divisors](https://leetcode.com/problems/sum-of-four-divisors/)

**Description:** Given an integer array `nums`, return the sum of divisors of the integers in `nums` that have exactly four divisors.

**How to Apply Linear Sieve:**
- Precompute SPF up to max(nums)
- For each number, factorize using SPF and check if it has exactly 4 divisors
- A number has exactly 4 divisors if it's either p³ or p*q (distinct primes)

**Solution Approach:**
```python
def sumFourDivisors(self, nums: List[int]) -> int:
    max_n = max(nums)
    sieve = LinearSieve(max_n)
    
    total = 0
    for x in nums:
        factors = sieve.factorize(x)
        
        # Case 1: x = p^3 → divisors: 1, p, p^2, p^3
        if len(factors) == 1 and factors[0][1] == 3:
            p = factors[0][0]
            total += 1 + p + p*p + p*p*p
        
        # Case 2: x = p*q → divisors: 1, p, q, pq
        elif len(factors) == 2 and factors[0][1] == 1 and factors[1][1] == 1:
            p, q = factors[0][0], factors[1][0]
            total += 1 + p + q + p*q
    
    return total
```

---

### Problem 3: Smallest Value After Replacing With Sum of Prime Factors

**Problem:** [LeetCode 2520 - Count the Digits That Divide a Number](https://leetcode.com/problems/count-the-digits-that-divide-a-number/)

**Related Problem:** [LeetCode 2521 - Distinct Prime Factors of Product of Array](https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/)

**Description:** You are given an array of positive integers `nums`. Return the number of distinct prime factors in the product of the elements of `nums`.

**How to Apply Linear Sieve:**
- Precompute SPF up to max(nums)
- For each number, get unique prime factors using SPF
- Use a set to track distinct primes across all numbers

**Solution Approach:**
```python
def distinctPrimeFactors(self, nums: List[int]) -> int:
    max_n = max(nums)
    sieve = LinearSieve(max_n)
    
    distinct_primes = set()
    for x in nums:
        factors = sieve.factorize(x)
        for p, _ in factors:
            distinct_primes.add(p)
    
    return len(distinct_primes)
```

---

### Problem 4: K-th Smallest Prime Fraction

**Problem:** [LeetCode 786 - K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)

**Description:** You are given a sorted integer array `arr` containing 1 and prime numbers, where all integers are unique. You are also given an integer `k`. Return the k-th smallest fraction considered from all fractions of the form `arr[i] / arr[j]` where `arr[i] < arr[j]`.

**How to Apply Linear Sieve:**
- Generate all primes up to n using linear sieve
- Use binary search or heap to find k-th smallest fraction
- The sorted list of primes enables efficient fraction comparison

**Solution Approach:**
```python
def kthSmallestPrimeFraction(self, arr: List[int], k: int) -> List[int]:
    n = len(arr)
    # Binary search on fraction value
    left, right = 0.0, 1.0
    
    while True:
        mid = (left + right) / 2
        count = 0
        max_frac = 0
        result = [0, 1]
        
        j = 1
        for i in range(n - 1):
            while j < n and arr[i] / arr[j] > mid:
                j += 1
            count += n - j
            if j < n and arr[i] / arr[j] > max_frac:
                max_frac = arr[i] / arr[j]
                result = [arr[i], arr[j]]
        
        if count == k:
            return result
        elif count < k:
            left = mid
        else:
            right = mid
```

---

### Problem 5: Prime Subtraction Operation

**Problem:** [LeetCode 2601 - Prime Subtraction Operation](https://leetcode.com/problems/prime-subtraction-operation/)

**Description:** You are given a 0-indexed integer array `nums` of length `n`. You can perform the following operation any number of times:
- Pick an index `i` that you haven’t picked before, and pick a prime `p` strictly less than `nums[i]`, then subtract `p` from `nums[i]`.

Return true if you can make `nums` a strictly increasing array.

**How to Apply Linear Sieve:**
- Generate all primes up to max(nums) using linear sieve
- For each element, try subtracting primes to make it smaller than the next element
- Greedily process from right to left

**Solution Approach:**
```python
def primeSubOperation(self, nums: List[int]) -> bool:
    max_n = max(nums)
    sieve = LinearSieve(max_n)
    primes = sieve.getPrimes()
    
    n = len(nums)
    # Process from right to left
    for i in range(n - 2, -1, -1):
        if nums[i] < nums[i + 1]:
            continue
        
        # Need to reduce nums[i] to be < nums[i+1]
        target = nums[i + 1]
        found = False
        
        # Find largest prime p such that nums[i] - p < target and p < nums[i]
        for p in reversed(primes):
            if p >= nums[i]:
                continue
            if nums[i] - p < target:
                nums[i] -= p
                found = True
                break
        
        if not found:
            return False
    
    return True
```

---

## Video Tutorial Links

### Fundamentals

- [Linear Sieve Algorithm Explained (Competitive Programming)](https://www.youtube.com/watch?v=0J9xS_Dbcv0) - Complete walkthrough with examples
- [Euler's Sieve / Linear Sieve (WilliamFiset)](https://www.youtube.com/watch?v=NAx0d0Oa0p4) - Visual explanation of the algorithm
- [Prime Sieve Algorithms Comparison (Codeforces)](https://www.youtube.com/watch?v=fByR4R4CE3Y) - Comparing different sieve algorithms

### Advanced Topics

- [Multiplicative Functions with Linear Sieve](https://www.youtube.com/watch?v=3I6O6nRJxZc) - Computing φ(n), μ(n), d(n)
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=fP9hKkMfTao) - Comprehensive number theory course
- [Prime Factorization Techniques](https://www.youtube.com/watch?v=ak3T_9QBegY) - Fast factorization methods

---

## Follow-up Questions

### Q1: Why does the condition `if (i % p == 0) break` make it linear?

**Answer:** This condition ensures each composite is marked exactly once by its smallest prime factor. Without it:
- Composite 12 would be marked when (i=2, p=6?), no wait - let me clarify
- Actually 12 would be marked as 2×6 (i=6, p=2) and 3×4 (i=4, p=3) and 2×2×3 (i=12, p=???)
- With the condition: 12 is only marked as 2×6 (when i=6, p=2, and 6%2==0 so we break)
- Since each composite has exactly one smallest prime factor, it's marked exactly once

### Q2: Can Linear Sieve handle n = 10^8?

**Answer:** Technically yes, but memory becomes the bottleneck:
- `is_prime[]`: ~100 MB (100M bytes)
- `spf[]`: ~400 MB (100M × 4 bytes)
- Total: ~500 MB which may exceed memory limits

**Alternatives for large n:**
1. **Segmented Sieve**: Use O(√n) memory
2. **Bitset optimization**: Reduce memory by 8×
3. **External memory**: Process in chunks

### Q3: How does Linear Sieve compare to segmented sieve?

**Answer:**

| Aspect | Linear Sieve | Segmented Sieve |
|--------|-------------|-----------------|
| Time | O(n) | O(n log log n) |
| Space | O(n) | O(√n) |
| Provides SPF | ✅ Yes | ❌ No |
| Best for | n ≤ 10^7 | n > 10^7 |
| Cache efficiency | Good | Better for large n |

### Q4: What are multiplicative functions and why do they work with Linear Sieve?

**Answer:** A function `f` is multiplicative if `f(ab) = f(a) × f(b)` when `gcd(a,b) = 1`.

**Examples:**
- φ(n) - Euler's totient
- μ(n) - Möbius function
- d(n) - Divisor count
- σ(n) - Divisor sum

They work with Linear Sieve because:
1. When we find a new prime `p`, we know `f(p^e)` formula
2. When `p` doesn't divide `i`, we use `f(i × p) = f(i) × f(p)`
3. When `p` divides `i`, we extend the power: `f(i × p) = f(i) × correction`

### Q5: How can I optimize Linear Sieve for competitive programming?

**Answer:**

1. **Use static arrays** instead of dynamic allocation
2. **Pre-allocate** vectors with reserve(n / log(n))
3. **Use bitset** for is_prime to save memory
4. **Process offline** when multiple test cases share max n
5. **Skip even numbers**: Store only odd numbers, handle 2 separately (2× speedup)

```cpp
// Optimized version skipping evens
void linearSieve(int n) {
    vector<int> primes;
    vector<int> spf(n + 1);
    
    for (int i = 2; i <= n; i++) {
        if (spf[i] == 0) {
            spf[i] = i;
            primes.push_back(i);
        }
        for (int p : primes) {
            if (p > spf[i] || 1LL * i * p > n) break;
            spf[i * p] = p;
        }
    }
}
```

---

## Summary

The Linear Sieve is the optimal algorithm for prime generation and multiplicative function computation:

**Key Advantages:**
- **O(n) time complexity**: Fastest possible sieve algorithm
- **Provides SPF**: Enables O(log n) factorization
- **Multiplicative functions**: Compute φ(n), μ(n), d(n), σ(n) in O(n)
- **Exactly one mark per composite**: Minimal operations

**When to Use:**
- ✅ Prime generation with n up to 10^7
- ✅ Multiple factorization queries
- ✅ Computing multiplicative functions
- ✅ Number theory problems requiring SPF

**When NOT to Use:**
- ❌ Very large n (> 10^8) - use segmented sieve
- ❌ Memory-constrained environments
- ❌ Single primality check - use Miller-Rabin
- ❌ Only counting primes - simpler sieves may suffice

**Key Takeaways:**
1. The `if (i % p == 0) break` condition is crucial for O(n) complexity
2. Smallest Prime Factor (SPF) array enables fast factorization
3. Multiplicative functions can be computed during sieve construction
4. Linear Sieve is essential for competitive programming number theory problems

---

## Related Algorithms

- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - Simpler but slower prime generation
- [Segmented Sieve](./segmented-sieve.md) - For very large prime ranges
- [Miller-Rabin](./miller-rabin.md) - Probabilistic primality test for large numbers
- [GCD Euclidean](./gcd-euclidean.md) - Used with prime factorizations
- [Modular Exponentiation](./modular-exponentiation.md) - Fast power modulo prime
- [Euler's Totient](./euler-totient.md) - Mathematical background on φ(n)
