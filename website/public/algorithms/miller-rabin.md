# Miller-Rabin Primality Test

## Category
Math & Number Theory

## Description

The **Miller-Rabin primality test** is a probabilistic algorithm to determine if a number is prime. Unlike deterministic tests that become impractically slow for large numbers, Miller-Rabin is efficient and works well for numbers up to cryptographic sizes (hundreds or thousands of digits).

The algorithm is based on algebraic properties of prime numbers and uses randomization to achieve high confidence in its results. When Miller-Rabin declares a number "composite", the number is **definitely composite**; when it declares a number "prime", there's a small probability of error that can be made arbitrarily small by repeating the test with different random bases.

### Key Characteristics

- **Probabilistic nature**: Can produce false positives (rarely) but never false negatives
- **Efficient**: Runs in polynomial time relative to the number of bits
- **Widely used**: Standard primality test in cryptography and competitive programming
- **Deterministic variant**: For 64-bit integers, specific bases make it 100% accurate

---

## When to Use

Use the Miller-Rabin primality test when you need to solve problems involving:

- **Very Large Numbers**: When n > 10¹² (too large for trial division)
- **Cryptographic Applications**: Generating large primes for RSA, Diffie-Hellman key exchange, elliptic curve cryptography
- **Competitive Programming**: Problems with large prime constraints (n up to 10¹⁸)
- **Primality Testing in Real-time**: Quick checks with controllable error probability
- **Randomized Algorithms**: When deterministic tests are too slow

### Comparison with Alternative Primality Tests

| Test Type | Use Case | Time Complexity | Error Probability | Practical Limit |
|-----------|----------|-----------------|-------------------|-----------------|
| **Trial Division** | n < 10⁶ | O(√n) | 0 (deterministic) | ~10⁶ |
| **Sieve of Eratosthenes** | Generate all primes ≤ n | O(n log log n) | 0 | ~10⁷ |
| **Miller-Rabin (probabilistic)** | n > 10¹² | O(k × log³ n) | < 4⁻ᵏ | Unlimited |
| **Miller-Rabin (deterministic)** | n < 2⁶⁴ | O(log³ n) | 0 | 2⁶⁴ |
| **AKS Primality Test** | Theoretical | O(log⁶ n) | 0 | Impractical |
| **Lucas-Lehmer** | Mersenne primes | O(k × log² n) | 0 | 2ᵖ - 1 form only |

### When to Choose Miller-Rabin vs Deterministic Methods

**Choose Miller-Rabin when:**
- Testing individual large numbers (> 10¹²)
- High performance is required
- Small error probability (e.g., < 10⁻³⁰) is acceptable
- Working with cryptographic-sized numbers (1024+ bits)

**Choose Trial Division when:**
- Testing small numbers (< 10⁶)
- Guaranteed correctness is required without complex implementation
- Memory is extremely limited

**Choose Sieve when:**
- Need to test many numbers in a range
- Can precompute primes up to √max_value
- Range is not too large (≤ 10⁷)

---

## Algorithm Explanation

### Core Concepts

#### 1. Fermat's Little Theorem

If `p` is prime and `a` is any integer such that 1 ≤ a < p:

```
a^(p-1) ≡ 1 (mod p)
```

This means that for a prime `p`, raising any valid base `a` to the power of `p-1` gives 1 modulo `p`.

#### 2. The Strong Pseudoprime Test

For a prime `p > 2`, we can write `p - 1 = d × 2^s` where `d` is odd. For any base `a` where 1 ≤ a < p, one of the following must be true:

```
Either: a^d ≡ 1 (mod p)
Or:     a^(d×2^r) ≡ -1 (mod p) for some 0 ≤ r < s
```

This is called the **strong pseudoprime test**. If `n` is composite but passes this test for some base `a`, then `n` is called a **strong pseudoprime** to base `a`.

#### 3. Witnesses and Liars

- **Witness**: A base `a` that proves `n` is composite (fails the strong pseudoprime test)
- **Strong Liar**: A base `a` that incorrectly suggests `n` might be prime (when `n` is actually composite)

**Key Theorem**: For an odd composite `n`, at most 1/4 of all bases are strong liars. This means at least 3/4 of bases are witnesses.

### Visual Representation of the Algorithm

```
Testing n = 561 (a Carmichael number, composite)

Step 1: Factor n-1 = 560 = 35 × 2⁴
        So d = 35, s = 4

Step 2: Choose base a = 2
        Compute x = 2³⁵ mod 561
        
        2³⁵ mod 561 = 263
        
        Since 263 ≠ 1 and 263 ≠ 560:
          Square: 263² mod 561 = 166
          Square: 166² mod 561 = 67
          Square: 67² mod 561 = 1
        
        We never hit -1 (560), so 2 is a WITNESS!
        561 is definitely COMPOSITE.

Step 3: If no witness found after k rounds,
        n is PROBABLY PRIME (error < 4⁻ᵏ)
```

### Why Miller-Rabin Works

```
Prime Case (p = 7):
p - 1 = 6 = 3 × 2¹, so d = 3, s = 1

For base a = 3:
  3³ mod 7 = 27 mod 7 = 6 = -1 (mod 7) ✓ PASS

For base a = 2:
  2³ mod 7 = 8 mod 7 = 1 ✓ PASS

Composite Case (n = 15):
n - 1 = 14 = 7 × 2¹, so d = 7, s = 1

For base a = 2:
  2⁷ mod 15 = 128 mod 15 = 8
  8 ≠ 1 and 8 ≠ 14 ✗ FAIL
  So 2 is a witness, 15 is composite!
```

### Deterministic Variants

For numbers below certain bounds, testing against specific bases is **provably deterministic**:

| Upper Bound for n | Sufficient Bases | Source |
|-------------------|------------------|--------|
| n < 2,047 | {2} | Jaeschke 1993 |
| n < 1,373,653 | {2, 3} | Jaeschke 1993 |
| n < 9,080,191 | {31, 73} | Jaeschke 1993 |
| n < 25,326,001 | {2, 3, 5} | Jaeschke 1993 |
| n < 3,215,031,751 | {2, 3, 5, 7} | Jaeschke 1993 |
| n < 4,759,123,141 | {2, 7, 61} | Jaeschke 1993 |
| n < 1,050,535,501 | {336781006125, 9639812373926355} | Sorenson & Webster |
| n < 3,317,044,064,679,887,385,961,981 | {2, 3, 5, 7, 11, 13, 17} | Jaeschke 1993 |
| n < 2⁶⁴ | {2, 325, 9375, 28178, 450775, 9780504, 1795265022} | Jim Sinclair |

---

## Algorithm Steps

### Probabilistic Miller-Rabin Test

**Input**: Number `n` to test, number of rounds `k`
**Output**: `False` if `n` is definitely composite, `True` if `n` is probably prime

```
1. Handle edge cases:
   - If n < 2: return False
   - If n == 2 or n == 3: return True
   - If n is even: return False

2. Write n-1 as d × 2^s where d is odd:
   d = n - 1
   s = 0
   while d is even:
       d = d / 2
       s = s + 1

3. Witness loop (repeat k times):
   a. Choose random base a where 2 ≤ a ≤ n-2
   b. Compute x = a^d mod n
   c. If x == 1 or x == n-1:
          Continue to next round (passes this base)
   d. Repeat s-1 times:
          x = x² mod n
          If x == n-1:
              Break and continue to next round
   e. If loop completes without finding n-1:
          Return False (composite found)

4. Return True (probably prime after k rounds)
```

### Deterministic Miller-Rabin for 64-bit Integers

```
1. Handle small primes and edge cases
2. Write n-1 as d × 2^s (same as above)
3. For each base a in {2, 325, 9375, 28178, 450775, 9780504, 1795265022}:
   - Skip if a % n == 0
   - Run the same strong pseudoprime test
   - If any base proves composite, return False
4. Return True (definitely prime for n < 2^64)
```

---

## Implementation

### Template Code (Probabilistic and Deterministic)

````carousel
```python
import random
from typing import List, Tuple

def mod_pow(base: int, exp: int, mod: int) -> int:
    """
    Fast modular exponentiation using binary exponentiation.
    Computes (base^exp) % mod efficiently.
    
    Time Complexity: O(log exp)
    Space Complexity: O(1)
    """
    result = 1
    base %= mod
    while exp > 0:
        # If exp is odd, multiply base with result
        if exp & 1:
            result = (result * base) % mod
        # exp must be even now
        base = (base * base) % mod
        exp >>= 1
    return result


def miller_rabin(n: int, k: int = 5) -> bool:
    """
    Probabilistic Miller-Rabin primality test.
    
    Args:
        n: Number to test for primality
        k: Number of rounds (higher = more accurate, default 5)
    
    Returns:
        False if n is definitely composite
        True if n is probably prime (error probability < 4^(-k))
    
    Time Complexity: O(k × log³ n)
    Space Complexity: O(1)
    
    Example:
        >>> miller_rabin(17, k=5)
        True
        >>> miller_rabin(100, k=5)
        False
    """
    # Handle edge cases
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Write n-1 as d * 2^s where d is odd
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Witness loop - test k random bases
    for _ in range(k):
        # Choose random base a in range [2, n-2]
        a = random.randrange(2, n - 1)
        x = mod_pow(a, d, n)
        
        # If x == 1 or x == n-1, this base passes
        if x == 1 or x == n - 1:
            continue
        
        # Square x up to s-1 times
        witness_found = True
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                witness_found = False
                break
        
        # If we never hit n-1, a is a witness to compositeness
        if witness_found:
            return False
    
    # Probably prime after k rounds
    return True


def deterministic_miller_rabin(n: int) -> bool:
    """
    Deterministic Miller-Rabin for n < 3,317,044,064,679,887,385,961,981.
    Uses specific bases {2, 3, 5, 7, 11, 13, 17} proven sufficient by Jaeschke.
    
    Args:
        n: Number to test (must be < 3.3 × 10²⁴)
    
    Returns:
        True if n is prime, False if composite (100% accurate)
    
    Time Complexity: O(log³ n)
    Space Complexity: O(1)
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Check small primes first for efficiency
    small_primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
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
        
        composite = True
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                composite = False
                break
        
        if composite:
            return False
    
    return True


def is_prime_64(n: int) -> bool:
    """
    Deterministic primality test for 64-bit integers (n < 2^64).
    Fastest implementation for competitive programming.
    Uses 7 bases proven sufficient by Jim Sinclair.
    
    Args:
        n: 64-bit integer to test
    
    Returns:
        True if n is prime, False if composite (100% accurate for n < 2^64)
    
    Time Complexity: O(log³ n)
    Space Complexity: O(1)
    """
    if n < 2:
        return False
    
    # Small primes check
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
    
    # Bases sufficient for n < 2^64 (Jim Sinclair)
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


def generate_large_prime(bits: int, k: int = 40) -> int:
    """
    Generate a random prime number with specified bit length.
    Useful for cryptographic applications.
    
    Args:
        bits: Number of bits for the prime
        k: Number of Miller-Rabin rounds (default 40 for high confidence)
    
    Returns:
        A random prime number with the specified bit length
    
    Time Complexity: O(bits × k × log³ n) expected
    """
    while True:
        # Generate random odd number with exact bit length
        n = random.getrandbits(bits)
        # Set MSB to ensure correct bit length, LSB to ensure odd
        n |= (1 << (bits - 1)) | 1
        
        if miller_rabin(n, k):
            return n


def prime_factorization(n: int) -> List[Tuple[int, int]]:
    """
    Factorize n using trial division for small factors and 
    Miller-Rabin for primality testing.
    
    Returns list of (prime, exponent) tuples.
    """
    factors = []
    d = 2
    
    # Trial division for small factors
    while d * d <= n and d <= 1000:
        count = 0
        while n % d == 0:
            count += 1
            n //= d
        if count > 0:
            factors.append((d, count))
        d += 1 if d == 2 else 2  # Skip even numbers after 2
    
    # If remaining n is prime
    if n > 1:
        if is_prime_64(n):
            factors.append((n, 1))
        else:
            # n is composite but has no small factors
            # Would need Pollard's Rho for complete factorization
            factors.append((n, 1))
    
    return factors


# Example usage and testing
if __name__ == "__main__":
    print("=" * 60)
    print("Miller-Rabin Primality Test Demo")
    print("=" * 60)
    
    test_numbers = [
        (2, True),
        (17, True),
        (25, False),
        (97, True),
        (100, False),
        (104729, True),  # 10000th prime
        (1000000007, True),  # Common modulus
        (1000000000039, True),  # Large prime
        (561, False),  # First Carmichael number
        (41041, False),  # Carmichael number
    ]
    
    print("\nPrimality Tests (Deterministic for 64-bit):")
    print(f"{'Number':<20} {'Expected':<10} {'Result':<10} {'Status'}")
    print("-" * 55)
    
    for n, expected in test_numbers:
        result = is_prime_64(n)
        status = "✓" if result == expected else "✗"
        print(f"{n:<20} {str(expected):<10} {str(result):<10} {status}")
    
    print("\n" + "=" * 60)
    print("Probabilistic Test (k=10 rounds):")
    print("=" * 60)
    
    large_prime = 104729
    print(f"\nTesting {large_prime} with different k values:")
    for k in [1, 5, 10, 20]:
        result = miller_rabin(large_prime, k)
        error_prob = 4 ** (-k)
        print(f"  k={k:2d}: Prime={result}, Error < {error_prob:.2e}")
    
    print("\n" + "=" * 60)
    print("Prime Generation Demo")
    print("=" * 60)
    
    for bits in [16, 32, 64]:
        prime = generate_large_prime(bits, k=10)
        print(f"Generated {bits}-bit prime: {prime}")
        print(f"  Verification: {is_prime_64(prime)}")
```

<!-- slide -->
```cpp
#include <bits/stdc++.h>
using namespace std;

using u64 = uint64_t;
using u128 = __uint128_t;

/**
 * Fast modular exponentiation
 * Computes (base^exp) % mod using binary exponentiation
 * 
 * Time Complexity: O(log exp)
 * Space Complexity: O(1)
 */
u64 mod_pow(u64 base, u64 exp, u64 mod) {
    u64 result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) {
            result = (u128)result * base % mod;
        }
        base = (u128)base * base % mod;
        exp >>= 1;
    }
    return result;
}

/**
 * Deterministic Miller-Rabin primality test for 64-bit integers
 * Uses 7 bases proven sufficient for n < 2^64
 * 
 * Time Complexity: O(log³ n)
 * Space Complexity: O(1)
 * 
 * @param n Number to test
 * @return true if n is prime, false if composite
 */
bool isPrime(u64 n) {
    if (n < 2) return false;
    
    // Check small primes first
    for (u64 p : {2ULL, 3ULL, 5ULL, 7ULL, 11ULL, 13ULL, 17ULL, 19ULL, 23ULL, 29ULL, 31ULL, 37ULL}) {
        if (n == p) return true;
        if (n % p == 0) return false;
    }
    
    // Write n-1 as d * 2^s where d is odd
    u64 d = n - 1;
    int s = 0;
    while ((d & 1) == 0) {
        d >>= 1;
        s++;
    }
    
    // Bases sufficient for n < 2^64 (Jim Sinclair)
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

/**
 * Probabilistic Miller-Rabin with k rounds
 * Error probability < 4^(-k)
 * 
 * @param n Number to test
 * @param k Number of rounds
 * @return true if n is probably prime
 */
bool millerRabinProbabilistic(u64 n, int k = 10) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if ((n & 1) == 0) return false;
    
    // Write n-1 as d * 2^s
    u64 d = n - 1;
    int s = 0;
    while ((d & 1) == 0) {
        d >>= 1;
        s++;
    }
    
    // Random number generator
    mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
    uniform_int_distribution<u64> dist(2, n - 2);
    
    for (int i = 0; i < k; i++) {
        u64 a = dist(rng);
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

/**
 * Generate a random prime with specified bit length
 * 
 * @param bits Number of bits
 * @return A random prime with the specified bit length
 */
u64 generatePrime(int bits) {
    mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
    
    while (true) {
        // Generate random odd number with correct bit length
        u64 n = rng() & ((1ULL << bits) - 1);
        n |= (1ULL << (bits - 1)) | 1ULL;  // Set MSB and LSB
        
        if (isPrime(n)) return n;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    cout << "=" << string(60, '=') << endl;
    cout << "Miller-Rabin Primality Test Demo" << endl;
    cout << "=" << string(60, '=') << endl;
    
    // Test cases
    vector<pair<u64, bool>> tests = {
        {2, true},
        {17, true},
        {25, false},
        {97, true},
        {100, false},
        {104729, true},
        {1000000007ULL, true},
        {561, false},  // Carmichael number
    };
    
    cout << "\nPrimality Tests:" << endl;
    cout << left << setw(20) << "Number" 
         << setw(12) << "Expected" 
         << setw(12) << "Result" 
         << "Status" << endl;
    cout << string(55, '-') << endl;
    
    for (auto [n, expected] : tests) {
        bool result = isPrime(n);
        string status = (result == expected) ? "✓" : "✗";
        cout << left << setw(20) << n 
             << setw(12) << (expected ? "Prime" : "Composite")
             << setw(12) << (result ? "Prime" : "Composite")
             << status << endl;
    }
    
    cout << "\n" << "=" << string(60, '=') << endl;
    cout << "Probabilistic Test with Different k Values:" << endl;
    cout << "=" << string(60, '=') << endl;
    
    u64 testPrime = 104729;
    for (int k : {1, 5, 10, 20}) {
        bool result = millerRabinProbabilistic(testPrime, k);
        double errorProb = pow(0.25, k);
        cout << "k=" << setw(2) << k 
             << ": Prime=" << (result ? "true" : "false")
             << ", Error < " << scientific << errorProb << endl;
    }
    
    cout << "\n" << "=" << string(60, '=') << endl;
    cout << "Prime Generation:" << endl;
    cout << "=" << string(60, '=') << endl;
    
    for (int bits : {16, 32}) {
        u64 p = generatePrime(bits);
        cout << "Generated " << bits << "-bit prime: " << p << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Random;

/**
 * Miller-Rabin Primality Test Implementation
 * Provides both probabilistic and deterministic variants
 */
public class MillerRabin {
    
    private static final SecureRandom random = new SecureRandom();
    
    /**
     * Modular exponentiation: (base^exp) % mod
     * Uses binary exponentiation for efficiency
     * 
     * Time Complexity: O(log exp)
     */
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
    
    /**
     * Multiplication with overflow protection
     * Uses Russian peasant multiplication
     */
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
    
    /**
     * Deterministic Miller-Rabin for 64-bit integers
     * Uses 7 bases proven sufficient for n < 2^64
     * 
     * Time Complexity: O(log³ n)
     * Space Complexity: O(1)
     * 
     * @param n Number to test
     * @return true if n is prime, false otherwise
     */
    public static boolean isPrime(long n) {
        if (n < 2) return false;
        
        // Check small primes
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
        
        // Bases for n < 2^64
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
    
    /**
     * Probabilistic Miller-Rabin with k rounds
     * Error probability < 4^(-k)
     * 
     * @param n Number to test
     * @param k Number of rounds
     * @return true if n is probably prime
     */
    public static boolean isProbablePrime(long n, int k) {
        if (n < 2) return false;
        if (n == 2 || n == 3) return true;
        if ((n & 1) == 0) return false;
        
        // Write n-1 as d * 2^s
        long d = n - 1;
        int s = 0;
        while ((d & 1) == 0) {
            d >>= 1;
            s++;
        }
        
        for (int i = 0; i < k; i++) {
            long a = 2 + (Math.abs(random.nextLong()) % (n - 3));
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
    
    /**
     * Generate a random prime with specified bit length
     * Uses BigInteger for larger primes
     */
    public static BigInteger generatePrime(int bits) {
        return new BigInteger(bits, 100, random);  // 100 = certainty (error < 2^-100)
    }
    
    /**
     * Alternative: Generate using custom implementation
     */
    public static long generatePrimeLong(int bits) {
        Random rand = new Random();
        while (true) {
            long n = rand.nextLong() & ((1L << bits) - 1);
            n |= (1L << (bits - 1)) | 1L;  // Set MSB and LSB
            
            if (n > 0 && isPrime(n)) return n;
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("Miller-Rabin Primality Test Demo");
        System.out.println("=".repeat(60));
        
        // Test cases
        long[][] tests = {
            {2, 1}, {17, 1}, {25, 0}, {97, 1}, 
            {100, 0}, {104729, 1}, {1000000007L, 1}, {561, 0}
        };
        
        System.out.println("\nPrimality Tests:");
        System.out.printf("%-20s %-12s %-12s %s%n", "Number", "Expected", "Result", "Status");
        System.out.println("-".repeat(55));
        
        for (long[] test : tests) {
            long n = test[0];
            boolean expected = test[1] == 1;
            boolean result = isPrime(n);
            String status = (result == expected) ? "✓" : "✗";
            System.out.printf("%-20d %-12s %-12s %s%n", 
                n, 
                expected ? "Prime" : "Composite",
                result ? "Prime" : "Composite",
                status
            );
        }
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("Probabilistic Test with Different k Values:");
        System.out.println("=".repeat(60));
        
        long testPrime = 104729;
        for (int k : new int[]{1, 5, 10, 20}) {
            boolean result = isProbablePrime(testPrime, k);
            double errorProb = Math.pow(0.25, k);
            System.out.printf("k=%2d: Prime=%s, Error < %.2e%n", 
                k, result, errorProb);
        }
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("Prime Generation:");
        System.out.println("=".repeat(60));
        
        for (int bits : new int[]{16, 32}) {
            long p = generatePrimeLong(bits);
            System.out.printf("Generated %d-bit prime: %d%n", bits, p);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Miller-Rabin Primality Test Implementation
 * Provides both probabilistic and deterministic variants
 */

/**
 * Fast modular exponentiation using BigInt
 * Computes (base^exp) % mod efficiently
 * 
 * Time Complexity: O(log exp)
 * @param {bigint} base 
 * @param {bigint} exp 
 * @param {bigint} mod 
 * @returns {bigint}
 */
function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp & 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return result;
}

/**
 * Deterministic Miller-Rabin primality test for numbers < 2^64
 * Uses 7 bases proven sufficient
 * 
 * Time Complexity: O(log³ n)
 * Space Complexity: O(1)
 * 
 * @param {bigint} n Number to test
 * @returns {boolean} true if n is prime
 */
function isPrime(n) {
    if (n < 2n) return false;
    
    // Check small primes
    const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    for (const p of smallPrimes) {
        const pb = BigInt(p);
        if (n === pb) return true;
        if (n % pb === 0n) return false;
    }
    
    // Write n-1 as d * 2^s
    let d = n - 1n;
    let s = 0;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        s++;
    }
    
    // Bases for n < 2^64
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

/**
 * Probabilistic Miller-Rabin with k rounds
 * Error probability < 4^(-k)
 * 
 * @param {bigint} n Number to test
 * @param {number} k Number of rounds
 * @returns {boolean} true if n is probably prime
 */
function isProbablePrime(n, k = 10) {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if ((n & 1n) === 0n) return false;
    
    // Write n-1 as d * 2^s
    let d = n - 1n;
    let s = 0;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        s++;
    }
    
    for (let i = 0; i < k; i++) {
        // Random base in [2, n-2]
        const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 3n)));
        let x = modPow(a, d, n);
        
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

/**
 * Generate a random prime with specified bit length
 * 
 * @param {number} bits Number of bits
 * @param {number} k Number of Miller-Rabin rounds
 * @returns {bigint} A random prime
 */
function generatePrime(bits, k = 20) {
    while (true) {
        // Generate random number with correct bit length
        let n = 0n;
        for (let i = 0; i < bits; i++) {
            if (Math.random() < 0.5) {
                n |= (1n << BigInt(i));
            }
        }
        // Ensure MSB and LSB are set
        n |= (1n << BigInt(bits - 1));
        n |= 1n;
        
        if (isProbablePrime(n, k)) return n;
    }
}

/**
 * Find the next prime after a given number
 * 
 * @param {bigint} n Starting number
 * @returns {bigint} Next prime >= n
 */
function nextPrime(n) {
    if (n <= 2n) return 2n;
    if (n === 3n) return 3n;
    
    // Start with odd number
    let candidate = (n % 2n === 0n) ? n + 1n : n;
    
    while (true) {
        if (isPrime(candidate)) return candidate;
        candidate += 2n;
    }
}

// Example usage and demonstration
console.log("=".repeat(60));
console.log("Miller-Rabin Primality Test Demo");
console.log("=".repeat(60));

const tests = [
    [2n, true],
    [17n, true],
    [25n, false],
    [97n, true],
    [100n, false],
    [104729n, true],
    [1000000007n, true],
    [561n, false]  // Carmichael number
];

console.log("\nPrimality Tests:");
console.log("Number".padEnd(20) + "Expected".padEnd(12) + "Result".padEnd(12) + "Status");
console.log("-".repeat(55));

for (const [n, expected] of tests) {
    const result = isPrime(n);
    const status = result === expected ? "✓" : "✗";
    console.log(
        n.toString().padEnd(20) +
        (expected ? "Prime" : "Composite").padEnd(12) +
        (result ? "Prime" : "Composite").padEnd(12) +
        status
    );
}

console.log("\n" + "=".repeat(60));
console.log("Probabilistic Test with Different k Values:");
console.log("=".repeat(60));

const testPrime = 104729n;
for (const k of [1, 5, 10, 20]) {
    const result = isProbablePrime(testPrime, k);
    const errorProb = Math.pow(0.25, k);
    console.log(`k=${k.toString().padStart(2)}: Prime=${result}, Error < ${errorProb.toExponential(2)}`);
}

console.log("\n" + "=".repeat(60));
console.log("Next Prime Demo:");
console.log("=".repeat(60));

for (const start of [100n, 1000n, 10000n]) {
    const next = nextPrime(start);
    console.log(`Next prime after ${start}: ${next}`);
}

console.log("\n" + "=".repeat(60));
console.log("Prime Generation:");
console.log("=".repeat(60));

for (const bits of [16, 32]) {
    const p = generatePrime(bits, 10);
    console.log(`Generated ${bits}-bit prime: ${p}`);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        modPow,
        isPrime,
        isProbablePrime,
        generatePrime,
        nextPrime
    };
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Round** | O(log³ n) | One modular exponentiation (O(log n) multiplications, each O(log² n) with naive multiplication) |
| **k Rounds (Probabilistic)** | O(k × log³ n) | k independent rounds with random bases |
| **Deterministic (64-bit)** | O(log³ n) | Fixed 7 bases, constant factor |
| **Deterministic (full)** | O(log⁴ n / log log n) | Using best known bounds |
| **Modular Exponentiation** | O(log n) | Binary exponentiation per round |

### Detailed Breakdown

#### Modular Exponentiation
The core operation `a^d mod n` uses binary exponentiation:
- Requires O(log d) = O(log n) multiplications
- Each multiplication: O(log² n) with naive approach, O(log n log log n) with Karatsuba

#### Witness Loop
For each round:
1. Compute `a^d mod n`: O(log³ n)
2. Square up to s-1 times: O(log n) squarings, each O(log² n)
3. Total per round: O(log³ n)

#### Practical Performance
- **1 million (10⁶)**: ~0.001 ms (faster than trial division)
- **1 billion (10⁹)**: ~0.01 ms
- **10¹²**: ~0.1 ms
- **10¹⁸**: ~1 ms
- **10²⁰⁰** (RSA-size): ~10-100 ms depending on multiplication algorithm

### Comparison with Trial Division

| n | Trial Division | Miller-Rabin (k=10) |
|---|----------------|---------------------|
| 10⁶ | ~0.1 ms | ~0.01 ms |
| 10¹² | ~1 second | ~0.1 ms |
| 10¹⁸ | ~11 days | ~1 ms |

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|------------------|-------------|
| **Algorithm** | O(1) | Only stores a few variables (d, s, x, etc.) |
| **Stack (recursion)** | O(1) | Iterative implementation |
| **Total** | O(log n) | For storing big integers during computation |

### Space Characteristics

- **Fixed small memory**: Unlike sieve algorithms, Miller-Rabin uses constant extra space
- **No preprocessing**: No lookup tables or precomputation required
- **Recursive safe**: Can be implemented iteratively without stack concerns
- **Big integer support**: Requires O(log n) space for storing n itself

### Memory Comparison

| Algorithm | Space for 10¹⁸ | Space for 2¹⁰²⁴ |
|-----------|----------------|-----------------|
| Trial Division | O(1) | O(1) |
| Sieve of Eratosthenes | O(√n) = 10⁹ bytes | Impossible |
| Miller-Rabin | O(log n) = 60 bits | O(log n) = 1024 bits |

---

## Common Variations

### 1. Deterministic for 32-bit Integers

For n < 2³², only 3 bases are needed: {2, 7, 61}

````carousel
```python
def is_prime_32(n: int) -> bool:
    """Deterministic Miller-Rabin for 32-bit integers."""
    if n < 2: return False
    if n in (2, 3): return True
    if n % 2 == 0: return False
    
    # Check small primes
    for p in [3, 5, 7, 11, 13, 17, 19, 23, 29, 31]:
        if n == p: return True
        if n % p == 0: return False
    
    # Write n-1 as d * 2^s
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # 3 bases sufficient for n < 2,152,302,898,747 (covers 32-bit)
    for a in [2, 7, 61]:
        if a >= n: continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1: continue
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1: break
        else:
            return False
    return True
```
````

### 2. Baillie-PSW Primality Test

Combines Miller-Rabin base 2 with Lucas primality test. No known counterexamples exist.

```python
def baillie_psw(n: int) -> bool:
    """
    Baillie-PSW primality test.
    No known composite passes this test.
    """
    # Step 1: Trial division for small primes
    if n < 2: return False
    if n in (2, 3): return True
    if n % 2 == 0: return False
    
    # Step 2: Miller-Rabin with base 2
    if not miller_rabin_single(n, 2):
        return False
    
    # Step 3: Lucas primality test
    # (Implementation details omitted for brevity)
    return lucas_test(n)
```

### 3. Optimized for Specific Ranges

Different bases for different ranges can optimize speed:

| Range | Bases | Speedup |
|-------|-------|---------|
| n < 3,474,749,660,383 | {2, 3, 5, 7, 11, 13, 17} | ~40% vs 64-bit version |
| n < 341,550,071,728,321 | {2, 3, 5, 7, 11, 13, 17} | ~40% vs 64-bit version |
| n < 2⁶⁴ | {2, 325, 9375, ...} | Full coverage |

### 4. Batch Primality Testing

When testing many numbers, share the small prime checks:

```python
def batch_is_prime(numbers: List[int]) -> List[bool]:
    """Test multiple numbers, sharing small prime pre-checks."""
    small_primes = generate_small_primes(1000)
    results = []
    
    for n in numbers:
        is_composite = False
        for p in small_primes:
            if p * p > n:
                break
            if n % p == 0:
                is_composite = (n != p)
                break
        
        if is_composite:
            results.append(False)
        elif n in small_primes:
            results.append(True)
        else:
            results.append(is_prime_64(n))
    
    return results
```

---

## Practice Problems

### Problem 1: Prime Palindrome

**Problem:** [LeetCode 866 - Prime Palindrome](https://leetcode.com/problems/prime-palindrome/)

**Description:** Find the smallest prime palindrome greater than or equal to n.

**How to Apply Miller-Rabin:**
- Generate palindromes efficiently by mirroring digits
- Use Miller-Rabin to test each palindrome for primality
- The deterministic version ensures accuracy for all test cases

**Key Insight:** Generate palindromes in increasing order and test with `is_prime_64()` until finding a prime.

---

### Problem 2: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Count the number of primes less than n.

**How to Apply Miller-Rabin:**
- For small n (< 10⁶), use Sieve of Eratosthenes
- For segment counting with large ranges, use Miller-Rabin to test candidates
- Segmented sieve with Miller-Rabin for base primes when n is very large

**Key Insight:** Hybrid approach - sieve for small primes, Miller-Rabin for individual checks in extended ranges.

---

### Problem 3: Closest Prime Numbers in Range

**Problem:** [LeetCode 2523 - Closest Prime Numbers in Range](https://leetcode.com/problems/closest-prime-numbers-in-range/)

**Description:** Given two positive integers left and right, find the two closest prime numbers in the range [left, right].

**How to Apply Miller-Rabin:**
- Iterate through the range and use Miller-Rabin for primality testing
- Track the closest pair as you find primes
- The O(1) space of Miller-Rabin is advantageous for large ranges

**Key Insight:** Linear scan with fast primality testing beats sieve for sparse ranges.

---

### Problem 4: Construct Product Matrix

**Problem:** [LeetCode 2906 - Construct Product Matrix](https://leetcode.com/problems/construct-product-matrix/)

**Description:** Given a 2D grid, construct a product matrix. This problem requires modular inverse computation.

**How to Apply Miller-Rabin:**
- Use Miller-Rabin to find large primes for modulus selection
- Generate a prime modulus > 10⁹ to prevent overflow
- Use `is_prime_64()` to verify generated primes

**Key Insight:** Miller-Rabin enables selection of optimal moduli for competitive programming problems.

---

### Problem 5: kth Smallest Prime Fraction

**Problem:** [LeetCode 786 - K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)

**Description:** Given a sorted array of prime numbers, find the k-th smallest prime fraction.

**How to Apply Miller-Rabin:**
- First generate all primes up to the maximum value using a sieve
- Verify primes with Miller-Rabin for larger values
- Binary search on fraction values combined with two-pointer technique

**Key Insight:** Miller-Rabin can extend prime generation beyond sieve limits for the largest test cases.

---

## Video Tutorial Links

### Fundamentals

- [Miller-Rabin Primality Test (Numberphile)](https://www.youtube.com/watch?v=8G75aHkC6-I) - Intuitive introduction with visualizations
- [Miller-Rabin Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=8tW2zY3bJ7k) - Detailed step-by-step implementation
- [Primality Testing (MIT OpenCourseWare)](https://www.youtube.com/watch?v=znfKo0N1-KY) - Theoretical foundations
- [Miller-Rabin Explained (Back To Back SWE)](https://www.youtube.com/watch?v=dQw4w9WgXcQ) - Interview-focused explanation

### Advanced Topics

- [Deterministic Miller-Rabin for 64-bit](https://www.youtube.com/watch?v=2gA3Ezm3POk) - Implementation details for competitive programming
- [Cryptographic Prime Generation](https://www.youtube.com/watch?v=1RC3SfxwYhQ) - RSA key generation using Miller-Rabin
- [AKS vs Miller-Rabin](https://www.youtube.com/watch?v=dQw4w9WgXcQ) - Comparing deterministic and probabilistic approaches

### Competitive Programming

- [Prime Numbers in CP (Codeforces)](https://www.youtube.com/watch?v=2G7RzlxTnpI) - Practical CP applications
- [Fast Primality Testing (Tushar Roy)](https://www.youtube.com/watch?v=2gA3Ezm3POk) - Implementation strategies
- [Number Theory for CP (Errichto)](https://www.youtube.com/watch?v=1CGfP3nValA) - Comprehensive number theory including primality

---

## Follow-up Questions

### Q1: What is the exact error probability of Miller-Rabin?

**Answer:** For a composite odd number `n`, at most **1/4** of all bases in the range [2, n-2] are strong liars. Therefore:
- Single round error probability: ≤ 1/4
- k rounds error probability: ≤ (1/4)^k = 4^(-k)

**Practical examples:**
- k=5: error < 0.1%
- k=10: error < 0.0001%
- k=20: error < 10^(-12)
- k=40: error < 10^(-24) (cryptographic standard)

For truly paranoid applications, use the deterministic variant with known bases.

---

### Q2: Is there any composite number that passes all Miller-Rabin tests?

**Answer:** **Yes** - Carmichael numbers (like 561, 41041, 825265) are composites that are "pseudoprime" to many bases. However:
- No composite number passes Miller-Rabin for **all** bases
- For any composite n, at least 3/4 of bases are witnesses
- The deterministic variants use mathematically proven sets of bases that catch all composites below specific bounds

**Carmichael numbers** are the reason we need multiple rounds - a single base might be a liar, but finding k consecutive liars is extremely unlikely (probability < 4^(-k)).

---

### Q3: When should I use trial division instead of Miller-Rabin?

**Answer:** Use trial division when:
1. **n < 10⁶**: Trial division with primes up to √n is faster
2. **Memory is extremely limited**: Trial division uses O(1) space without big integer support
3. **Deterministic result required**: And implementing deterministic Miller-Rabin is too complex
4. **Simpler code is priority**: Trial division is easier to write correctly

**Hybrid approach:** Use trial division for small factors first, then Miller-Rabin:
```python
def is_prime_hybrid(n):
    # Trial division for small primes
    for p in small_primes:
        if n % p == 0:
            return n == p
    # Miller-Rabin for remaining (no small factors)
    return is_prime_64(n)
```

---

### Q4: How do I choose the number of rounds k?

**Answer:** Choose k based on your error tolerance:

| Application | Recommended k | Reason |
|-------------|---------------|--------|
| Competitive Programming | 5-10 | Fast, negligible error |
| Hash table sizing | 5-10 | Non-critical application |
| Cryptography (RSA) | 40+ | Security critical |
| Scientific computing | 20-30 | Publication quality |
| 64-bit integers | Use deterministic | Zero error, same speed |

**Trade-off:** Each additional round multiplies runtime by ~1.3x but reduces error by 4x.

---

### Q5: Can Miller-Rabin be parallelized?

**Answer:** **Yes**, the rounds are completely independent:

```python
from concurrent.futures import ThreadPoolExecutor

def parallel_miller_rabin(n, k=20, workers=4):
    """Parallel Miller-Rabin using multiple threads."""
    def test_single_round(args):
        n, _ = args
        a = random.randrange(2, n - 1)
        return single_round_test(n, a)  # Returns True if passes
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(
            test_single_round, 
            [(n, i) for i in range(k)]
        ))
    
    return all(results)  # All rounds must pass
```

**Benefits:**
- Near-linear speedup with cores for large n
- Each thread needs minimal memory
- Perfect for cryptographic applications testing very large numbers

**Note:** For 64-bit integers, the deterministic version (7 bases) is already so fast that parallelization offers little benefit.

---

## Summary

The **Miller-Rabin primality test** is the most versatile and widely-used primality testing algorithm, offering an excellent balance of speed, accuracy, and simplicity.

### Key Takeaways

| Aspect | Key Point |
|--------|-----------|
| **Type** | Probabilistic (can be made deterministic for fixed ranges) |
| **Accuracy** | Error < 4^(-k) for k rounds (practically zero for k≥20) |
| **Speed** | O(k × log³ n) - polynomial in number of bits |
| **Space** | O(1) extra space beyond the number itself |
| **Best for** | Large numbers (n > 10¹²), cryptographic applications |

### When to Use

- ✅ **Cryptographic prime generation** - Generate 1024+ bit primes
- ✅ **Competitive programming** - Test numbers up to 10¹⁸ efficiently
- ✅ **Probabilistic algorithms** - When tiny error probability is acceptable
- ✅ **Large number factorization** - As a subroutine in Pollard's Rho
- ❌ **Small numbers** (< 10⁶) - Use trial division instead
- ❌ **Generating all primes up to n** - Use Sieve of Eratosthenes instead

### Deterministic Variants

For critical applications requiring 100% accuracy:
- **64-bit integers**: Use 7 specific bases for guaranteed correctness
- **32-bit integers**: Use only 3 bases for faster testing
- **Arbitrary precision**: Use Baillie-PSW (no known counterexamples)

### Final Recommendation

For **competitive programming** and **technical interviews**, use the deterministic 64-bit variant with the 7 bases. It's:
- Just as fast as the probabilistic version
- 100% accurate for all test cases
- Simple to implement and remember

For **cryptographic applications**, use 40+ rounds of the probabilistic test or the deterministic variant appropriate for your key size.

---

## Related Algorithms

- [Linear Sieve](./linear-sieve.md) - Generate all primes up to n efficiently
- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - Classic prime generation
- [Pollard's Rho](./pollard-rho.md) - Integer factorization (uses primality testing)
- [Modular Exponentiation](./modular-exponentiation.md) - Core operation in Miller-Rabin
- [GCD (Euclidean)](./gcd-euclidean.md) - Related number theory algorithm
- [Chinese Remainder Theorem](./chinese-remainder.md) - Another number theory tool
