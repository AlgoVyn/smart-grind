# Miller-Rabin Primality Test

## Category
Math & Number Theory

## Description

The **Miller-Rabin primality test** is a probabilistic algorithm to determine if a number is prime. Unlike deterministic tests that are slow for large numbers, Miller-Rabin is efficient and works well for numbers up to cryptographic sizes (hundreds or thousands of digits).

It is a **probabilistic** test: when it says "composite", the number is definitely composite; when it says "prime", there's a small probability of error that can be made arbitrarily small by repeating the test.

---

## When to Use

Use Miller-Rabin when you need to:

- **Test Very Large Numbers**: When n > 10^12 (too large for trial division)
- **Cryptographic Applications**: Generate large primes for RSA, Diffie-Hellman
- **Competitive Programming**: Problems with large prime constraints
- **Randomized Algorithms**: When deterministic tests are too slow
- **Quick Prime Checks**: With high confidence after a few rounds

### Deterministic vs Probabilistic

| Test Type | Use Case | Error Probability |
|-----------|----------|------------------|
| Trial Division | n < 10^6 | 0 (deterministic) |
| Miller-Rabin | n > 10^12 | < 4^(-k) with k rounds |
| AKS Test | Theoretical | 0 (impractical) |

---

## Algorithm Explanation

### Mathematical Foundation

**Fermat's Little Theorem**: If p is prime and a < p:
```
a^(p-1) ≡ 1 (mod p)
```

**Strong Pseudoprime Test**: For prime p, write `p-1 = d × 2^s` where d is odd:
```
Either: a^d ≡ 1 (mod p)
Or:     a^(d×2^r) ≡ -1 (mod p) for some 0 ≤ r < s
```

If n is composite but satisfies this for some a, it's called a **strong pseudoprime** to base a.

### Algorithm Steps

1. **Handle edge cases**: n < 2, even numbers
2. **Write n-1 = d × 2^s** with d odd
3. **For k rounds** (with different bases a):
   - Compute x = a^d mod n
   - If x = 1 or x = n-1, continue to next round
   - Square x up to s-1 times; if x becomes n-1, continue
   - Otherwise, n is composite (return false)
4. **Return true**: n is probably prime

### Deterministic Variants

For n < 2^64, testing against specific bases is deterministic:
- n < 3,317,044,064,679,887,385,961,981: Test a ∈ {2, 3, 5, 7, 11, 13, 17}
- n < 3,317,080: Test a ∈ {2, 3, 5, 7}
- n < 4,759,123,141: Test a ∈ {2, 7, 61}

---

## Implementation

### Template Code

````carousel
```python
import random

def mod_pow(base: int, exp: int, mod: int) -> int:
    """Fast modular exponentiation."""
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return result


def miller_rabin(n: int, k: int = 5) -> bool:
    """
    Miller-Rabin primality test.
    
    Args:
        n: Number to test
        k: Number of rounds (higher = more accurate)
    
    Returns:
        False if n is definitely composite
        True if n is probably prime (error probability < 4^(-k))
    
    Time Complexity: O(k × log³ n)
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Write n-1 as d * 2^s
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Witness loop
    for _ in range(k):
        a = random.randrange(2, n - 1)
        x = mod_pow(a, d, n)
        
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            # Didn't break - composite
            return False
    
    return True


def deterministic_miller_rabin(n: int) -> bool:
    """
    Deterministic Miller-Rabin for n < 3,317,044,064,679,887,385,961,981.
    Uses specific bases that are proven sufficient.
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Small primes check
    small_primes = [3, 5, 7, 11, 13, 17, 19, 23, 29]
    for p in small_primes:
        if n == p:
            return True
        if n % p == 0:
            return False
    
    # Write n-1 as d * 2^s
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Bases proven sufficient for n < 3,317,044,064,679,887,385,961,981
    bases = [2, 3, 5, 7, 11, 13, 17]
    
    for a in bases:
        if a >= n:
            continue
        
        x = mod_pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    
    return True


# Optimized for 64-bit integers
def is_prime_64(n: int) -> bool:
    """
    Deterministic primality test for 64-bit integers.
    Fastest implementation for competitive programming.
    """
    if n < 2:
        return False
    
    # Small primes
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for p in small_primes:
        if n == p:
            return True
        if n % p == 0:
            return False
    
    # Write n-1 as d * 2^s
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Bases sufficient for n < 2^64 (Jaeschke 1993)
    bases = [2, 325, 9375, 28178, 450775, 9780504, 1795265022]
    
    for a in bases:
        if a % n == 0:
            continue
        
        x = mod_pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    
    return True


# Generate large primes
def generate_large_prime(bits: int) -> int:
    """Generate a random prime with specified number of bits."""
    while True:
        # Random odd number with specified bits
        n = random.getrandbits(bits)
        n |= (1 << bits - 1) | 1  # Set MSB and LSB
        
        if is_prime_64(n):
            return n


# Example usage
if __name__ == "__main__":
    test_numbers = [2, 17, 25, 97, 100, 104729, 1000000007, 1000000000039]
    
    for n in test_numbers:
        result = is_prime_64(n)
        print(f"{n} is {'prime' if result else 'composite'}")
```

<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

using u64 = uint64_t;
using u128 = __uint128_t;

u64 mod_pow(u64 base, u64 exp, u64 mod) {
    u64 result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (u128)result * base % mod;
        base = (u128)base * base % mod;
        exp >>= 1;
    }
    return result;
}

bool isPrime(u64 n) {
    if (n < 2) return false;
    
    // Small primes check
    for (u64 p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (n == p) return true;
        if (n % p == 0) return false;
    }
    
    // Write n-1 as d * 2^s
    u64 d = n - 1;
    int s = 0;
    while ((d & 1) == 0) {
        d >>= 1;
        s++;
    }
    
    // Bases sufficient for n < 2^64
    for (u64 a : {2ULL, 325ULL, 9375ULL, 28178ULL, 450775ULL, 9780504ULL, 1795265022ULL}) {
        if (a % n == 0) continue;
        
        u64 x = mod_pow(a, d, n);
        if (x == 1 || x == n - 1) continue;
        
        bool composite = true;
        for (int r = 0; r < s - 1; r++) {
            x = (u128)x * x % n;
            if (x == n - 1) {
                composite = false;
                break;
            }
        }
        
        if (composite) return false;
    }
    
    return true;
}
```

<!-- slide -->
```java
public class MillerRabin {
    
    private static long modPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = mulMod(result, base, mod);
            }
            base = mulMod(base, base, mod);
            exp >>= 1;
        }
        return result;
    }
    
    // Avoid overflow using BigInteger or careful multiplication
    private static long mulMod(long a, long b, long mod) {
        long result = 0;
        a %= mod;
        while (b > 0) {
            if ((b & 1) == 1) {
                result = (result + a) % mod;
            }
            a = (a << 1) % mod;
            b >>= 1;
        }
        return result;
    }
    
    public static boolean isPrime(long n) {
        if (n < 2) return false;
        
        // Small primes
        int[] smallPrimes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
        for (int p : smallPrimes) {
            if (n == p) return true;
            if (n % p == 0) return false;
        }
        
        // Write n-1 as d * 2^s
        long d = n - 1;
        int s = 0;
        while ((d & 1) == 0) {
            d >>= 1;
            s++;
        }
        
        long[] bases = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};
        
        for (long a : bases) {
            if (a % n == 0) continue;
            
            long x = modPow(a, d, n);
            if (x == 1 || x == n - 1) continue;
            
            boolean composite = true;
            for (int r = 0; r < s - 1; r++) {
                x = mulMod(x, x, n);
                if (x == n - 1) {
                    composite = false;
                    break;
                }
            }
            
            if (composite) return false;
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
function modPow(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return result;
}

function isPrime(n) {
    if (n < 2n) return false;
    
    // Small primes
    const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    for (const p of smallPrimes) {
        if (n === BigInt(p)) return true;
        if (n % BigInt(p) === 0n) return false;
    }
    
    // Write n-1 as d * 2^s
    let d = n - 1n;
    let s = 0;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        s++;
    }
    
    const bases = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];
    
    for (const a of bases) {
        const ab = BigInt(a);
        if (ab % n === 0n) continue;
        
        let x = modPow(ab, d, n);
        if (x === 1n || x === n - 1n) continue;
        
        let composite = true;
        for (let r = 0; r < s - 1; r++) {
            x = (x * x) % n;
            if (x === n - 1n) {
                composite = false;
                break;
            }
        }
        
        if (composite) return false;
    }
    
    return true;
}
```
````

---

## Applications

### 1. Cryptographic Prime Generation

```python
def generate_rsa_prime(bits: int = 1024) -> int:
    """Generate a prime suitable for RSA encryption."""
    while True:
        # Random number with exact bit length
        candidate = random.getrandbits(bits)
        candidate |= (1 << bits - 1) | 1  # MSB=1, LSB=1
        
        # Quick checks first
        if any(candidate % p == 0 for p in [3, 5, 7, 11, 13]):
            continue
        
        # Miller-Rabin with high confidence
        if miller_rabin(candidate, k=40):
            return candidate
```

### 2. Large Prime Factorization

```python
def pollard_rho(n: int) -> int:
    """Find a non-trivial factor of n."""
    if n % 2 == 0:
        return 2
    if is_prime_64(n):
        return n
    
    # Pollard's Rho algorithm implementation
    # Uses Miller-Rabin for primality checks
    # ...
```

---

## Time & Space Complexity

| Aspect | Complexity |
|--------|-----------|
| Single Round | O(log³ n) |
| k Rounds | O(k × log³ n) |
| Deterministic (64-bit) | O(log³ n) |
| Space | O(1) |

---

## Practice Problems

### Problem 1: Prime Palindrome
**Problem**: [LeetCode 866 - Prime Palindrome](https://leetcode.com/problems/prime-palindrome/)

**Solution**: Generate palindromes and test with Miller-Rabin.

### Problem 2: Count Primes in Range
**Problem**: Count primes in [L, R] where R - L ≤ 10^6 but R can be up to 10^12.

**Solution**: Segmented sieve + Miller-Rabin for base primes.

---

## Follow-up Questions

### Q1: What's the error probability of Miller-Rabin?

**Answer**: For a composite n, at most 1/4 of bases are strong liars. So with k rounds, error probability < 4^(-k). With k=10, error < 0.000001%.

### Q2: Is Miller-Rabin deterministic?

**Answer**: The basic form is probabilistic. However, for n < 2^64, specific sets of bases make it deterministic (as shown in the code).

### Q3: When should I use trial division instead?

**Answer**: Use trial division for n < 10^6. For larger numbers, Miller-Rabin is faster.

---

## Summary

Miller-Rabin is the go-to primality test for large numbers:

- **Fast**: Polynomial time in log n
- **Probabilistic**: Adjustable error probability
- **Deterministic variant**: For 64-bit integers
- **Essential**: For cryptography and competitive programming

**Use when**: Testing primality of numbers > 10^12.

---

## Related Algorithms

- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - For generating all primes up to n
- [Linear Sieve](./linear-sieve.md) - Faster prime generation
- [Pollard's Rho](./pollard-rho.md) - Integer factorization using Miller-Rabin