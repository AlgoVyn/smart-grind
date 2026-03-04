# Sieve of Eratosthenes

## Category
Math & Number Theory

## Description

The Sieve of Eratosthenes is an ancient and efficient algorithm for finding all prime numbers up to a given limit n. It works by iteratively marking the multiples of each prime starting from 2. Dating back to ancient Greece (circa 240 BC), it remains one of the most efficient algorithms for prime generation and is fundamental to number theory problems.

---

## When to Use

Use the Sieve of Eratosthenes when you need to solve problems involving:

- **Prime Number Generation**: Finding all primes up to n
- **Prime Counting**: Counting primes less than n
- **Factorization Preprocessing**: Precomputing smallest prime factors
- **Multiples Elimination**: When you need to mark multiples efficiently

### Comparison with Alternatives

| Algorithm | Time Complexity | Space | Best Use Case |
|-----------|----------------|-------|---------------|
| **Sieve of Eratosthenes** | O(n log log n) | O(n) | Finding all primes up to n |
| **Naive Prime Check** | O(√n) per number | O(1) | Single prime check |
| **Segmented Sieve** | O(n log log n) | O(√n) | Large ranges with memory constraints |
| **Sundaram's Sieve** | O(n log n) | O(n) | Alternative prime generation |
| **Atkin's Sieve** | O(n / log log n) | O(n) | Theoretical faster sieve (practical overhead) |

### When to Choose Sieve vs Alternatives

- **Choose Standard Sieve** when:
  - You need all primes up to n (n ≤ 10^7 typically)
  - Memory is not a constraint (O(n) space)
  - You need to answer multiple prime-related queries

- **Choose Segmented Sieve** when:
  - n is very large (n > 10^8)
  - Memory is limited
  - You only need primes in a specific range

- **Choose Naive Check** when:
  - You only need a few prime numbers
  - n is very small
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind the Sieve of Eratosthenes is that **every composite number has at least one prime factor less than or equal to its square root**. By iteratively marking multiples of each prime as composite, we can eliminate all non-prime numbers efficiently.

### How It Works

#### Step-by-Step Process:

1. **Initialization**: Create a boolean array of size n+1, initially assuming all numbers are prime (True)

2. **Mark 0 and 1**: These are not prime by definition

3. **Iterate from 2 to √n**:
   - For each prime p found, mark all multiples of p (starting from p²) as composite
   - We start from p² because smaller multiples would have been already marked by smaller primes

4. **Collection**: All indices still marked as True are prime numbers

### Visual Representation

For n = 30:

```
Initial:     [F, F, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
             0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

After p=2:   [F, F, T, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T]
             Mark 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30

After p=3:   [F, F, T, T, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, T]
             Mark 9, 15, 21, 27 (6, 12, 18, 24, 30 already marked)

After p=5:   [F, F, T, T, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, F]
             Mark 25

Result:      Primes at indices: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
```

### Why Start from p²?

Consider p = 5:
- Multiples: 5×2=10, 5×3=15, 5×4=20, 5×5=25, ...
- 10, 15, 20 were already marked by p=2 and p=3
- Only 25 and beyond need to be marked
- Starting from p² avoids redundant work

### Mathematical Foundation

- **Theorem**: If n is composite, it has a prime factor p ≤ √n
- **Proof**: If n = a × b with a ≤ b, then a² ≤ a × b = n, so a ≤ √n
- **Implication**: We only need to process primes up to √n to eliminate all composites

---

## Algorithm Steps

### Building the Sieve

1. **Handle edge cases**: If n < 2, return empty list
2. **Create boolean array**: Initialize is_prime[0...n] = True
3. **Mark 0 and 1**: Set is_prime[0] = is_prime[1] = False
4. **Main sieve loop**: For p from 2 to √n:
   - If is_prime[p] is True:
     - Mark all multiples from p² to n as False
5. **Collect results**: Return all indices where is_prime[i] is True

### Querying Primes

1. **Count primes**: Simply sum the boolean array
2. **Find kth prime**: Iterate through and count
3. **Check if n is prime**: Return is_prime[n]

---

## Implementation

### Template Code (All Languages)

````carousel
```python
def sieve(n):
    """
    Find all prime numbers up to n using Sieve of Eratosthenes.
    
    Args:
        n: Upper limit (inclusive)
    
    Returns:
        List of all prime numbers from 2 to n
    
    Time: O(n log log n)
    Space: O(n)
    """
    if n < 2:
        return []
    
    # Initialize boolean array: is_prime[i] = True means i is prime
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    # Only need to sieve up to sqrt(n)
    p = 2
    while p * p <= n:
        if is_prime[p]:
            # Mark all multiples of p starting from p*p as non-prime
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    
    # Collect all primes
    return [i for i in range(2, n + 1) if is_prime[i]]


def count_primes(n):
    """Count number of primes less than n."""
    if n <= 2:
        return 0
    
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n, p):
                is_prime[i] = False
    
    return sum(is_prime)


def sieve_optimized(n):
    """Optimized version using odd numbers only - ~2x faster."""
    if n < 2:
        return []
    if n == 2:
        return [2]
    
    # Only track odd numbers (index i represents number 2*i + 3)
    size = (n - 3) // 2 + 1
    is_prime = [True] * size
    
    # Sieve odd numbers only
    limit = int(n ** 0.5)
    for i in range(limit // 2):
        if is_prime[i]:
            # p = 2i + 3
            p = 2 * i + 3
            start = (p * p - 3) // 2
            step = p
            for j in range(start, size, step):
                is_prime[j] = False
    
    # Collect results (include 2 and convert odd indices back to numbers)
    primes = [2]
    for i in range(size):
        if is_prime[i]:
            primes.append(2 * i + 3)
    
    return primes


def smallest_prime_factor(n):
    """Precompute smallest prime factor for each number."""
    spf = list(range(n + 1))
    
    for i in range(2, int(n ** 0.5) + 1):
        if spf[i] == i:  # i is prime
            for j in range(i * i, n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    
    return spf


def prime_factors(n, spf):
    """Get prime factorization using SPF array."""
    factors = []
    while n > 1:
        factors.append(spf[n])
        n //= spf[n]
    return factors


# Example usage
if __name__ == "__main__":
    n = 30
    print(f"Primes up to {n}: {sieve(n)}")
    print(f"Count of primes up to {n}: {count_primes(n)}")
    print(f"Optimized primes up to {n}: {sieve_optimized(n)}")
    
    # SPF example
    spf = smallest_prime_factor(30)
    print(f"\nSmallest prime factors up to 30: {spf}")
    print(f"Prime factors of 30: {prime_factors(30, spf)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

/**
 * Sieve of Eratosthenes - Find all primes up to n
 * 
 * Time: O(n log log n)
 * Space: O(n)
 */
vector<int> sieve(int n) {
    if (n < 2) return {};
    
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    
    for (int p = 2; p * p <= n; p++) {
        if (is_prime[p]) {
            for (int i = p * p; i <= n; i += p) {
                is_prime[i] = false;
            }
        }
    }
    
    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) primes.push_back(i);
    }
    return primes;
}

/**
 * Count primes less than n
 */
int countPrimes(int n) {
    if (n <= 2) return 0;
    
    vector<bool> is_prime(n, true);
    is_prime[0] = is_prime[1] = false;
    
    for (int p = 2; p * p < n; p++) {
        if (is_prime[p]) {
            for (int i = p * p; i < n; i += p) {
                is_prime[i] = false;
            }
        }
    }
    
    int count = 0;
    for (bool prime : is_prime) {
        if (prime) count++;
    }
    return count;
}

/**
 * Optimized sieve - odd numbers only
 */
vector<int> sieveOptimized(int n) {
    if (n < 2) return {};
    if (n == 2) return {2};
    
    // Only track odd numbers: index i -> number 2*i + 3
    int size = (n - 3) / 2 + 1;
    vector<bool> is_prime(size, true);
    
    int limit = static_cast<int>(sqrt(n));
    for (int i = 0; i <= limit / 2; i++) {
        if (is_prime[i]) {
            int p = 2 * i + 3;
            int start = (p * p - 3) / 2;
            for (int j = start; j < size; j += p) {
                is_prime[j] = false;
            }
        }
    }
    
    vector<int> primes = {2};
    for (int i = 0; i < size; i++) {
        if (is_prime[i]) {
            primes.push_back(2 * i + 3);
        }
    }
    return primes;
}

/**
 * Smallest Prime Factor (SPF) array
 */
vector<int> smallestPrimeFactor(int n) {
    vector<int> spf(n + 1);
    for (int i = 0; i <= n; i++) spf[i] = i;
    
    for (int i = 2; i * i <= n; i++) {
        if (spf[i] == i) {  // i is prime
            for (int j = i * i; j <= n; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }
    return spf;
}

/**
 * Get prime factorization using SPF
 */
vector<int> primeFactors(int n, const vector<int>& spf) {
    vector<int> factors;
    while (n > 1) {
        factors.push_back(spf[n]);
        n /= spf[n];
    }
    return factors;
}

int main() {
    int n = 30;
    
    cout << "Primes up to " << n << ": ";
    vector<int> primes = sieve(n);
    for (int p : primes) cout << p << " ";
    cout << endl;
    
    cout << "Count: " << countPrimes(n) << endl;
    
    cout << "Optimized: ";
    primes = sieveOptimized(n);
    for (int p : primes) cout << p << " ";
    cout << endl;
    
    // SPF example
    vector<int> spf = smallestPrimeFactor(30);
    cout << "\nPrime factors of 30: ";
    vector<int> factors = primeFactors(30, spf);
    for (int f : factors) cout << f << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Sieve of Eratosthenes - Find all primes up to n
 * 
 * Time: O(n log log n)
 * Space: O(n)
 */
public class SieveOfEratosthenes {
    
    /**
     * Find all prime numbers up to n
     */
    public static List<Integer> sieve(int n) {
        if (n < 2) return new ArrayList<>();
        
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        
        for (int p = 2; p * p <= n; p++) {
            if (isPrime[p]) {
                for (int i = p * p; i <= n; i += p) {
                    isPrime[i] = false;
                }
            }
        }
        
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) primes.add(i);
        }
        return primes;
    }
    
    /**
     * Count primes less than n
     */
    public static int countPrimes(int n) {
        if (n <= 2) return 0;
        
        boolean[] isPrime = new boolean[n];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        
        for (int p = 2; p * p < n; p++) {
            if (isPrime[p]) {
                for (int i = p * p; i < n; i += p) {
                    isPrime[i] = false;
                }
            }
        }
        
        int count = 0;
        for (boolean prime : isPrime) {
            if (prime) count++;
        }
        return count;
    }
    
    /**
     * Optimized sieve - odd numbers only
     */
    public static List<Integer> sieveOptimized(int n) {
        if (n < 2) return new ArrayList<>();
        if (n == 2) return Arrays.asList(2);
        
        // Only track odd numbers: index i -> number 2*i + 3
        int size = (n - 3) / 2 + 1;
        boolean[] isPrime = new boolean[size];
        Arrays.fill(isPrime, true);
        
        int limit = (int) Math.sqrt(n);
        for (int i = 0; i <= limit / 2; i++) {
            if (isPrime[i]) {
                int p = 2 * i + 3;
                int start = (p * p - 3) / 2;
                for (int j = start; j < size; j += p) {
                    isPrime[j] = false;
                }
            }
        }
        
        List<Integer> primes = new ArrayList<>();
        primes.add(2);
        for (int i = 0; i < size; i++) {
            if (isPrime[i]) {
                primes.add(2 * i + 3);
            }
        }
        return primes;
    }
    
    /**
     * Build Smallest Prime Factor array
     */
    public static int[] smallestPrimeFactor(int n) {
        int[] spf = new int[n + 1];
        for (int i = 0; i <= n; i++) spf[i] = i;
        
        for (int i = 2; i * i <= n; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= n; j += i) {
                    if (spf[j] == j) spf[j] = i;
                }
            }
        }
        return spf;
    }
    
    /**
     * Get prime factorization using SPF
     */
    public static List<Integer> primeFactors(int n, int[] spf) {
        List<Integer> factors = new ArrayList<>();
        while (n > 1) {
            factors.add(spf[n]);
            n /= spf[n];
        }
        return factors;
    }
    
    public static void main(String[] args) {
        int n = 30;
        
        System.out.print("Primes up to " + n + ": ");
        System.out.println(sieve(n));
        
        System.out.println("Count: " + countPrimes(n));
        
        System.out.print("Optimized: ");
        System.out.println(sieveOptimized(n));
        
        // SPF example
        int[] spf = smallestPrimeFactor(30);
        System.out.print("Prime factors of 30: ");
        System.out.println(primeFactors(30, spf));
    }
}
```

<!-- slide -->
```javascript
/**
 * Sieve of Eratosthenes - Find all primes up to n
 * 
 * Time: O(n log log n)
 * Space: O(n)
 */
function sieve(n) {
    if (n < 2) return [];
    
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (let i = p * p; i <= n; i += p) {
                isPrime[i] = false;
            }
        }
    }
    
    const primes = [];
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push(i);
    }
    return primes;
}

/**
 * Count primes less than n
 */
function countPrimes(n) {
    if (n <= 2) return 0;
    
    const isPrime = new Array(n).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let p = 2; p * p < n; p++) {
        if (isPrime[p]) {
            for (let i = p * p; i < n; i += p) {
                isPrime[i] = false;
            }
        }
    }
    
    return isPrime.filter(Boolean).length;
}

/**
 * Optimized sieve - odd numbers only (approximately 2x faster)
 */
function sieveOptimized(n) {
    if (n < 2) return [];
    if (n === 2) return [2];
    
    // Only track odd numbers: index i -> number 2*i + 3
    const size = Math.floor((n - 3) / 2) + 1;
    const isPrime = new Array(size).fill(true);
    
    const limit = Math.floor(Math.sqrt(n));
    for (let i = 0; i <= Math.floor(limit / 2); i++) {
        if (isPrime[i]) {
            const p = 2 * i + 3;
            const start = Math.floor((p * p - 3) / 2);
            for (let j = start; j < size; j += p) {
                isPrime[j] = false;
            }
        }
    }
    
    const primes = [2];
    for (let i = 0; i < size; i++) {
        if (isPrime[i]) {
            primes.push(2 * i + 3);
        }
    }
    return primes;
}

/**
 * Build Smallest Prime Factor array
 */
function smallestPrimeFactor(n) {
    const spf = new Array(n + 1);
    for (let i = 0; i <= n; i++) spf[i] = i;
    
    for (let i = 2; i * i <= n; i++) {
        if (spf[i] === i) {
            for (let j = i * i; j <= n; j += i) {
                if (spf[j] === j) spf[j] = i;
            }
        }
    }
    return spf;
}

/**
 * Get prime factorization using SPF
 */
function primeFactors(n, spf) {
    const factors = [];
    while (n > 1) {
        factors.push(spf[n]);
        n = Math.floor(n / spf[n]);
    }
    return factors;
}

// Example usage
const n = 30;
console.log(`Primes up to ${n}:`, sieve(n));
console.log(`Count: ${countPrimes(n)}`);
console.log(`Optimized:`, sieveOptimized(n));

// SPF example
const spf = smallestPrimeFactor(30);
console.log(`Prime factors of 30:`, primeFactors(30, spf));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Basic Sieve** | O(n log log n) | Marking multiples of each prime |
| **Optimized Sieve** | O(n log log n) | Same complexity, fewer operations |
| **Prime Count** | O(n log log n) | Same as sieve, then sum |
| **SPF Build** | O(n log log n) | Extended sieve for factorization |
| **Prime Query** | O(1) | Array lookup after preprocessing |

### Detailed Breakdown

- **Initialization**: O(n) - Create and fill boolean array
- **Marking multiples**: For each prime p, we mark n/p elements
  - Sum = n/2 + n/3 + n/5 + n/7 + ... = n × (1/2 + 1/3 + 1/5 + ...)
  - This sum converges to O(n log log n)
- **Total**: O(n log log n)

### Why O(n log log n)?

The harmonic series of primes converges to log log n:
- π(n) ~ n / log n (Prime Number Theorem)
- Work = n × (1/2 + 1/3 + 1/5 + ...) ≈ n × log log n

---

## Space Complexity Analysis

| Variant | Space | Notes |
|---------|-------|-------|
| **Basic Sieve** | O(n) | Boolean array of size n+1 |
| **Optimized (Odd only)** | O(n/2) | ~50% memory reduction |
| **SPF Array** | O(n) | Integer array for factorization |
| **Segmented Sieve** | O(√n) | Only store segment |

### Space Optimization

For very large n:
1. **Bit array**: Use bits instead of booleans (8x less memory)
2. **Segmented sieve**: Process in chunks
3. **Odd-only tracking**: Halve the space

---

## Common Variations

### 1. Segmented Sieve

For very large n where memory is constrained:

````carousel
```python
def segmented_sieve(low, high):
    """Find primes in range [low, high] using segmented sieve."""
    import math
    
    if low < 2:
        low = 2
    
    # Base primes up to sqrt(high)
    limit = int(math.sqrt(high)) + 1
    base_primes = sieve(limit)
    
    # Create segment
    size = high - low + 1
    is_prime = [True] * size
    
    # Mark composites in segment using base primes
    for p in base_primes:
        # Find first multiple in [low, high]
        start = max(p * p, ((low + p - 1) // p) * p)
        for j in range(start, high + 1, p):
            is_prime[j - low] = False
    
    return [i for i in range(low, high + 1) if is_prime[i - low]]
```
````

### 2. Linear Sieve (Euler's Sieve)

O(n) algorithm that generates primes in linear time:

````carousel
```python
def linear_sieve(n):
    """Linear sieve - O(n) prime generation."""
    primes = []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
        for p in primes:
            if p * i > n:
                break
            is_prime[p * i] = False
            if i % p == 0:
                break
    
    return primes
```
````

### 3. Smallest Prime Factor (SPF) Sieve

Useful for prime factorization queries:

- Precomputes smallest prime factor for each number
- Enables O(log n) prime factorization
- Used in many competitive programming problems

### 4. Bitwise Sieve

For memory-constrained environments:
- Uses 1 bit per number instead of 1 byte
- 8x more memory efficient
- Useful for n > 10^8

### 5. Prime Counting Function (π(n))

Counting primes less than n efficiently using the sieve:

````carousel
```python
def prime_count(n):
    """Count primes less than n."""
    if n <= 2:
        return 0
    
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n, p):
                is_prime[i] = False
    
    return sum(is_prime)
```
````

---

## Practice Problems

### Problem 1: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Given an integer n, return the number of prime numbers that are strictly less than n.

**How to Apply Sieve:**
- Use the Sieve of Eratosthenes to mark all primes up to n-1
- Count the remaining true values in the boolean array
- Time: O(n log log n), Space: O(n)

---

### Problem 2: Prime Arrangements

**Problem:** [LeetCode 1175 - Prime Arrangements](https://leetcode.com/problems/prime-arrangements/)

**Description:** Return the number of ways to arrange the first n numbers such that all primes are in odd positions.

**How to Apply Sieve:**
- First, count primes up to n using sieve
- Calculate factorial for prime and non-prime counts
- Result = (prime_count)! × (n - prime_count)! mod 10^9+7

---

### Problem 3: Ugly Number

**Problem:** [LeetCode 263 - Ugly Number](https://leetcode.com/problems/ugly-number/)

**Description:** An ugly number is a positive integer whose prime factors are only 2, 3, and 5.

**How to Apply Sieve:**
- Precompute primes using sieve
- Check if given number has any prime factor outside {2, 3, 5}
- Can also use SPF array for O(log n) factorization

---

### Problem 4: Find all primes

**Problem:** [LeetCode 507 - Perfect Number](https://leetcode.com/problems/perfect-number/)

**Description:** Find all divisors (excluding the number itself) and check if their sum equals the number.

**How to Apply Sieve:**
- While doing prime sieve, also precompute sum of divisors
- Use SPF array for efficient divisor calculation

---

### Problem 5: Range Prime Queries

**Problem:** [LeetCode 1781 - Sum of Beauty of All Substrings](https://leetcode.com/problems/sum-of-beauty-of-all-substrings/)

**Description:** Given the frequency of characters, determine prime frequency counts.

**How to Apply Sieve:**
- Precompute primes up to 26 (for 26 letters)
- Use sieve to quickly check if a frequency is prime
- Optimize character frequency analysis

---

## Video Tutorial Links

### Fundamentals

- [Sieve of Eratosthenes - Introduction (Take U Forward)](https://www.youtube.com/watch?v=明月几时有) - Comprehensive introduction
- [Prime Number Sieve Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=ELphsJ1SlHw) - Detailed explanation with visualizations
- [Count Primes - LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=O-7X0e8c7vc) - Practical implementation

### Advanced Topics

- [Segmented Sieve](https://www.youtube.com/watch?v=5CO2dGzK4xY) - For large ranges
- [Linear Sieve (Euler's Sieve)](https://www.youtube.com/watch?v=0j5lXz2h3YQ) - O(n) algorithm
- [Sieve for Smallest Prime Factor](https://www.youtube.com/watch?v=v4_9Z-nEA4c) - Factorization queries
- [Sieve vs Alternative Methods](https://www.youtube.com/watch?v=o9K5ZBhL7pM) - When to use which

---

## Follow-up Questions

### Q1: What is the time complexity of the Sieve of Eratosthenes and why?

**Answer:** O(n log log n) - This comes from the harmonic series of primes. We mark n/p multiples for each prime p, and the sum of reciprocals of primes converges to log log n. This is much better than O(n²) naive checking.

### Q2: Can Sieve handle n up to 10^8?

**Answer:** With standard O(n) space:
- Memory: 10^8 bytes ≈ 100MB (acceptable in most environments)
- Time: ~1-2 seconds on modern hardware
- For larger n, use segmented sieve (O(√n) space)

### Q3: How do you optimize the Sieve for memory?

**Answer:** Several optimizations:
1. **Odd-only tracking**: Halve memory by skipping even numbers
2. **Bit array**: Use 1 bit per number (8x less memory)
3. **Segmented sieve**: Process in chunks
4. **Run-length encoding**: For sparse prime distributions

### Q4: What is the difference between Eratosthenes and Sundaram's sieve?

**Answer:**
- **Eratosthenes**: Marks multiples of primes directly
- **Sundaram**: Uses a different mathematical approach (removes numbers of form i+j+2ij)
- Both have O(n log log n) complexity
- Eratosthenes is more commonly used and slightly faster in practice

### Q5: When should you use the Linear Sieve over the basic Sieve?

**Answer:** Use Linear Sieve when:
- You need O(n) guarantee (theoretically optimal)
- You need primes in order with no gaps
- You're generating all primes up to very large n
- However, for most practical cases (n < 10^7), basic sieve is simpler and fast enough

---

## Summary

The Sieve of Eratosthenes is a foundational algorithm in number theory for generating prime numbers. Key takeaways:

- **Efficient**: O(n log log n) time complexity is remarkably fast
- **Simple**: Basic implementation is straightforward
- **Versatile**: Can be adapted for various prime-related queries
- **Space trade-off**: Uses O(n) space but enables O(1) prime queries after preprocessing
- **Historical significance**: Still relevant after 2000+ years

When to use:
- ✅ Generating all primes up to n (n ≤ 10^7)
- ✅ Counting primes less than n
- ✅ Preprocessing for factorization queries
- ✅ Any problem requiring multiple prime checks
- ❌ Very large n with memory constraints (use segmented sieve)
- ❌ Single prime check (use naive O(√n) check)

This algorithm is essential for competitive programming and technical interviews, especially in problems involving prime numbers, factorization, and number theory.

---

## Related Algorithms

- [Segmented Sieve](./segmented-sieve.md) - Large range prime finding
- [Linear Sieve](./linear-sieve.md) - O(n) prime generation
- [Prime Factorization](./prime-factorization.md) - Using SPF arrays
- [Miller-Rabin](./miller-rabin.md) - Probabilistic prime testing for large numbers
