# Inclusion-Exclusion Principle

## Category
Math & Number Theory

## Description

The **Principle of Inclusion-Exclusion (PIE)** is a fundamental combinatorial technique for counting the size of the union of multiple sets by adding the sizes of individual sets and subtracting the sizes of their intersections appropriately. It provides a systematic way to avoid overcounting when sets overlap.

The principle can be stated as follows: To count the number of elements in the union of several sets, start by adding the sizes of individual sets, then subtract the sizes of all pairwise intersections, add back the sizes of all triple intersections, subtract the sizes of all quadruple intersections, and so on, alternating signs until all possible intersections are accounted for.

This technique is essential for solving counting problems where direct enumeration is difficult due to overlapping constraints, making it invaluable in competitive programming, number theory, and probability calculations.

---

## When to Use

Use the Inclusion-Exclusion Principle when you need to solve problems involving:

- **Union Counting**: Finding the total number of elements in the union of multiple overlapping sets
- **Complement Counting**: Calculating "at least one" or "none" conditions efficiently
- **Constraint Satisfaction**: Counting objects that satisfy at least one of several properties
- **Number Theory Problems**: Counting coprime numbers, multiples, or numbers with specific divisibility properties
- **Derangements**: Counting permutations where no element appears in its original position
- **Probability Calculations**: Computing P(at least one event occurs)

### Comparison with Alternative Counting Methods

| Method | Best For | Time Complexity | Space Complexity |
|--------|----------|-----------------|------------------|
| **Direct Enumeration** | Small sets, no overlaps | O(n) | O(1) |
| **Inclusion-Exclusion** | Multiple overlapping constraints | O(2^k × f(n)) | O(k) |
| **DP + Bitmask** | Subset counting with states | O(2^n × n) | O(2^n) |
| **Mobius Inversion** | Divisor-based counting | O(n log n) | O(n) |
| **Generating Functions** | Complex combinatorial structures | Varies | Varies |

### When to Choose Inclusion-Exclusion

- **Choose Inclusion-Exclusion** when:
  - You need to count elements satisfying "at least one" of k conditions
  - You can efficiently compute intersections of the sets
  - The number of conditions k is small (typically k ≤ 20)
  - The problem has a natural set-based structure

- **Consider Alternatives** when:
  - k is large (use Mobius inversion or other techniques)
  - You need dynamic updates (use segment trees or Fenwick trees)
  - The structure allows DP with bitmask optimizations

---

## Core Concepts

### Set Unions and Intersections

The foundation of inclusion-exclusion lies in understanding how sets overlap:

**Two Sets (Venn Diagram):**
```
    ┌─────────┐
    │   A     │
    │  ┌───┐  │
    │  │A∩B│  │
    │  └───┘  │
    └─────────┘
        B
```

**Three Sets (Venn Diagram):**
```
         ┌─────┐
       ┌─┤  A  ├─┐
       │ └─────┘ │
    ┌──┴──┐   ┌──┴──┐
    │  B  │███│  C  │
    └──┬──┘   └──┬──┘
       │  ┌───┐  │
       └──┤A∩B∩C├──┘
          └───┘
    █ = Pairwise intersections
    Shaded center = Triple intersection
```

### The Alternating Sum Pattern

The key insight is the alternating sign pattern:
- **Add** all single sets (|A|, |B|, |C|, ...)
- **Subtract** all pairwise intersections (|A∩B|, |A∩C|, ...)
- **Add** all triple intersections (|A∩B∩C|, ...)
- **Subtract** all quadruple intersections, and so on...

Mathematically: For n sets, the sign is `(-1)^(k+1)` for k-way intersections.

### Bitmask Enumeration

For implementing inclusion-exclusion with k conditions, we use bitmask enumeration:
- Each bit represents whether a condition is included
- Iterate through all non-empty subsets (masks 1 to 2^k - 1)
- Count set bits to determine the sign
- Compute the intersection of selected sets

---

## Algorithm Explanation

### Two Sets

For two sets A and B:
```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

**Intuition**: When we add |A| and |B|, elements in both sets are counted twice. We subtract |A ∩ B| once to correct this overcounting.

**Example**: In a class of 30 students:
- 18 play football (set A)
- 15 play basketball (set B)
- 8 play both sports

Number playing at least one sport = 18 + 15 - 8 = 25

### Three Sets

For three sets A, B, and C:
```
|A ∪ B ∪ C| = |A| + |B| + |C|
              - |A ∩ B| - |A ∩ C| - |B ∩ C|
              + |A ∩ B ∩ C|
```

**Intuition**:
1. Add all singles: Elements in exactly one set are counted once ✓
2. Subtract all pairs: Elements in exactly two sets were counted twice, subtracted once → counted once ✓
3. Add back triple: Elements in all three sets were counted 3 times (singles) - 3 times (pairs) = 0 times. Add once ✓

### General Formula

For n sets A₁, A₂, ..., Aₙ:

```
|A₁ ∪ A₂ ∪ ... ∪ Aₙ| = Σ(-1)^(|S|+1) × |∩ᵢ∈S Aᵢ|
                       for all non-empty subsets S ⊆ {1, 2, ..., n}
```

Or equivalently:
```
|∪ᵢ₌₁ⁿ Aᵢ| = Σₖ₌₁ⁿ (-1)^(k+1) × Σ |Aᵢ₁ ∩ Aᵢ₂ ∩ ... ∩ Aᵢₖ|
             over all k-element subsets
```

### Complement Formulation

Often, it's easier to count the complement:
```
|Universal| - |A ∪ B ∪ C| = Count of elements in NONE of the sets
```

This is useful for "count numbers NOT divisible by any of..." problems.

---

## Step-by-Step Approach

### General Problem-Solving Strategy

1. **Identify the Sets**: Define what each set represents
2. **Determine What to Count**: Union directly or use complement
3. **Find Intersection Formula**: Derive how to compute |Aᵢ₁ ∩ ... ∩ Aᵢₖ|
4. **Enumerate Subsets**: Use bitmask iteration for 2^n subsets
5. **Apply Alternating Signs**: Add/subtract based on subset size
6. **Compute Final Answer**: Combine all terms

### Step-by-Step for Coprime Counting

**Problem**: Count numbers ≤ N coprime to M.

1. **Factorize M**: Get prime factors p₁, p₂, ..., pₖ
2. **Define Sets**: Aᵢ = {multiples of pᵢ ≤ N}
3. **Intersection**: |Aᵢ₁ ∩ ... ∩ Aᵢⱼ| = ⌊N / (pᵢ₁ × ... × pᵢⱼ)⌋
4. **Apply PIE**: Count numbers divisible by at least one prime factor
5. **Complement**: Answer = N - (count from step 4)

### Step-by-Step for Derangements

**Problem**: Count permutations where no element is in its original position.

1. **Define Sets**: Aᵢ = {permutations where element i is fixed}
2. **Universal Set**: All n! permutations
3. **Intersection Size**: |Aᵢ₁ ∩ ... ∩ Aᵢₖ| = (n-k)! (fix k elements, permute rest)
4. **Apply PIE**: Σ(-1)^k × C(n,k) × (n-k)!
5. **Simplify**: n! × Σ(-1)^k / k! = round(n!/e)

---

## Implementation

### Template Code

````carousel
```python
from itertools import combinations
from math import gcd
from functools import reduce
from typing import List


def inclusion_exclusion_union(sets: List[set]) -> int:
    """
    Calculate |A₁ ∪ A₂ ∪ ... ∪ Aₙ| using inclusion-exclusion.
    
    Args:
        sets: List of sets to find union of
    
    Returns:
        Size of the union
    
    Time Complexity: O(2^n × cost_of_intersection)
    Space Complexity: O(n)
    """
    n = len(sets)
    result = 0
    
    # Iterate over all non-empty subsets
    for r in range(1, n + 1):
        for subset_indices in combinations(range(n), r):
            # Calculate intersection of selected sets
            intersection = sets[subset_indices[0]]
            for i in subset_indices[1:]:
                intersection = intersection & sets[i]
            
            # Add or subtract based on subset size
            # Odd-sized subsets: add, Even-sized subsets: subtract
            sign = 1 if r % 2 == 1 else -1
            result += sign * len(intersection)
    
    return result


def get_prime_factors(n: int) -> List[int]:
    """Get unique prime factors of n."""
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            factors.append(d)
            while n % d == 0:
                n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors


def count_coprime(n: int, limit: int) -> int:
    """
    Count numbers ≤ limit that are coprime to n.
    
    Uses inclusion-exclusion on prime factors of n.
    
    Args:
        n: The number to be coprime to
        limit: Upper bound (inclusive)
    
    Returns:
        Count of x where 1 ≤ x ≤ limit and gcd(x, n) = 1
    
    Time Complexity: O(2^m × √n) where m = number of prime factors
    Space Complexity: O(m)
    """
    factors = get_prime_factors(n)
    m = len(factors)
    
    # Count numbers divisible by at least one prime factor
    divisible_count = 0
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        
        # Calculate LCM of selected prime factors (product since they're distinct primes)
        product = 1
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        # Count multiples of this product
        count = limit // product
        sign = 1 if bits % 2 == 1 else -1
        divisible_count += sign * count
    
    # Numbers NOT divisible by any prime factor = coprime to n
    return limit - divisible_count


def euler_totient(n: int) -> int:
    """
    Calculate Euler's totient function φ(n).
    φ(n) = count of numbers ≤ n that are coprime to n.
    
    Alternative formula using inclusion-exclusion:
    φ(n) = n × Π(1 - 1/p) for all distinct prime factors p of n
    
    Time Complexity: O(2^m × √n) where m = number of prime factors
    Space Complexity: O(m)
    """
    factors = get_prime_factors(n)
    m = len(factors)
    
    result = n
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        product = 1
        
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        # Add or subtract n/product
        if bits % 2 == 1:
            result -= n // product
        else:
            result += n // product
    
    return result


def count_derangements(n: int, mod: int = 10**9 + 7) -> int:
    """
    Count derangements: permutations where no element appears in its original position.
    
    Formula: D(n) = n! × Σ((-1)^k / k!) for k = 0 to n
            D(n) = round(n! / e)
    
    Args:
        n: Number of elements
        mod: Modulus for large numbers
    
    Returns:
        Number of derangements modulo mod
    
    Time Complexity: O(n log mod) for modular inverse
    Space Complexity: O(1)
    """
    # Calculate n! mod mod
    fact = 1
    for i in range(1, n + 1):
        fact = (fact * i) % mod
    
    # Sum of (-1)^k / k! for k = 0 to n
    inv_fact = 1  # 1/0! = 1
    result = inv_fact  # k = 0 term
    
    for k in range(1, n + 1):
        # Modular inverse of k
        inv_k = pow(k, mod - 2, mod)
        inv_fact = (inv_fact * inv_k) % mod  # 1/k!
        
        if k % 2 == 0:
            result = (result + inv_fact) % mod
        else:
            result = (result - inv_fact + mod) % mod
    
    return (fact * result) % mod


def count_multiples(divisors: List[int], limit: int) -> int:
    """
    Count numbers ≤ limit divisible by at least one of the divisors.
    
    Args:
        divisors: List of divisors
        limit: Upper bound (inclusive)
    
    Returns:
        Count of numbers divisible by at least one divisor
    
    Time Complexity: O(2^n × log(max(divisors)))
    Space Complexity: O(1)
    """
    n = len(divisors)
    result = 0
    
    for mask in range(1, 1 << n):
        bits = bin(mask).count('1')
        
        # Calculate LCM of selected divisors
        lcm = 1
        for i in range(n):
            if mask & (1 << i):
                lcm = lcm * divisors[i] // gcd(lcm, divisors[i])
                if lcm > limit:  # Early termination
                    break
        
        if lcm <= limit:
            count = limit // lcm
            sign = 1 if bits % 2 == 1 else -1
            result += sign * count
    
    return result


# Example usage and demonstrations
if __name__ == "__main__":
    print("=" * 60)
    print("Inclusion-Exclusion Principle Demonstrations")
    print("=" * 60)
    
    # Example 1: Coprime counting
    print("\n1. Coprime Counting:")
    print(f"   Numbers ≤ 100 coprime to 30: {count_coprime(30, 100)}")
    print(f"   (30 = 2 × 3 × 5)")
    
    # Example 2: Euler's totient
    print("\n2. Euler's Totient Function:")
    for n in [1, 2, 6, 10, 12, 30]:
        print(f"   φ({n}) = {euler_totient(n)}")
    
    # Example 3: Derangements
    print("\n3. Derangements (Subfactorials):")
    for n in range(1, 8):
        d = count_derangements(n)
        print(f"   D({n}) = {d}")
    
    # Example 4: Multiples
    print("\n4. Count Multiples:")
    print(f"   Numbers ≤ 100 divisible by 2, 3, or 5: {count_multiples([2, 3, 5], 100)}")
    
    # Example 5: Set union
    print("\n5. Set Union:")
    sets = [{1, 2, 3, 4}, {3, 4, 5, 6}, {4, 5, 6, 7}]
    union_size = inclusion_exclusion_union(sets)
    actual_union = set().union(*sets)
    print(f"   Sets: {sets}")
    print(f"   |Union| = {union_size} (actual: {len(actual_union)})")
```

<!-- slide: C++ -->
```cpp
#include <bits/stdc++.h>
using namespace std;

/**
 * Get unique prime factors of n
 */
vector<int> getPrimeFactors(int n) {
    vector<int> factors;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            factors.push_back(d);
            while (n % d == 0) n /= d;
        }
    }
    if (n > 1) factors.push_back(n);
    return factors;
}

/**
 * Count numbers ≤ limit that are coprime to n
 * 
 * Time Complexity: O(2^m × √n) where m = number of prime factors
 * Space Complexity: O(m)
 */
int countCoprime(int n, int limit) {
    vector<int> factors = getPrimeFactors(n);
    int m = factors.size();
    
    // Count numbers divisible by at least one prime factor
    int divisibleCount = 0;
    
    for (int mask = 1; mask < (1 << m); mask++) {
        int bits = __builtin_popcount(mask);
        
        // Calculate product of selected primes
        long long product = 1;
        for (int i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                product *= factors[i];
            }
        }
        
        // Count multiples
        int count = limit / product;
        divisibleCount += (bits % 2 == 1) ? count : -count;
    }
    
    return limit - divisibleCount;
}

/**
 * Euler's totient function φ(n)
 * 
 * Time Complexity: O(2^m × √n) where m = number of prime factors
 * Space Complexity: O(m)
 */
int eulerTotient(int n) {
    vector<int> factors = getPrimeFactors(n);
    int m = factors.size();
    
    int result = n;
    
    for (int mask = 1; mask < (1 << m); mask++) {
        int bits = __builtin_popcount(mask);
        long long product = 1;
        
        for (int i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                product *= factors[i];
            }
        }
        
        result += (bits % 2 == 1) ? -(n / product) : (n / product);
    }
    
    return result;
}

/**
 * Count numbers ≤ limit divisible by at least one divisor
 * 
 * Time Complexity: O(2^n × log(max(divisors)))
 * Space Complexity: O(1)
 */
int countMultiples(vector<int>& divisors, int limit) {
    int n = divisors.size();
    int result = 0;
    
    for (int mask = 1; mask < (1 << n); mask++) {
        int bits = __builtin_popcount(mask);
        long long lcm = 1;
        
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                lcm = lcm * divisors[i] / gcd(lcm, (long long)divisors[i]);
                if (lcm > limit) break;
            }
        }
        
        if (lcm <= limit) {
            int count = limit / lcm;
            result += (bits % 2 == 1) ? count : -count;
        }
    }
    
    return result;
}

/**
 * Count derangements modulo mod
 * 
 * Time Complexity: O(n log mod)
 * Space Complexity: O(1)
 */
long long countDerangements(int n, long long mod = 1e9 + 7) {
    // Calculate n! mod mod
    long long fact = 1;
    for (int i = 1; i <= n; i++) {
        fact = (fact * i) % mod;
    }
    
    // Sum of (-1)^k / k! for k = 0 to n
    long long invFact = 1;  // 1/0!
    long long result = invFact;
    
    for (int k = 1; k <= n; k++) {
        // Modular inverse using Fermat's little theorem
        long long invK = 1;
        long long base = k, exp = mod - 2;
        while (exp > 0) {
            if (exp & 1) invK = (invK * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        invFact = (invFact * invK) % mod;
        
        if (k % 2 == 0) {
            result = (result + invFact) % mod;
        } else {
            result = (result - invFact + mod) % mod;
        }
    }
    
    return (fact * result) % mod;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    cout << "========================================" << endl;
    cout << "Inclusion-Exclusion Principle" << endl;
    cout << "========================================" << endl;
    
    // Coprime counting
    cout << "\n1. Coprime Counting:" << endl;
    cout << "   Numbers ≤ 100 coprime to 30: " << countCoprime(30, 100) << endl;
    
    // Euler's totient
    cout << "\n2. Euler's Totient:" << endl;
    for (int n : {1, 2, 6, 10, 12, 30}) {
        cout << "   φ(" << n << ") = " << eulerTotient(n) << endl;
    }
    
    // Derangements
    cout << "\n3. Derangements:" << endl;
    for (int n = 1; n <= 7; n++) {
        cout << "   D(" << n << ") = " << countDerangements(n) << endl;
    }
    
    // Multiples
    cout << "\n4. Multiples:" << endl;
    vector<int> divs = {2, 3, 5};
    cout << "   Numbers ≤ 100 divisible by 2, 3, or 5: " 
         << countMultiples(divs, 100) << endl;
    
    return 0;
}
```

<!-- slide: Java -->
```java
import java.util.ArrayList;
import java.util.List;

public class InclusionExclusion {
    
    /**
     * Get unique prime factors of n
     */
    public static List<Integer> getPrimeFactors(int n) {
        List<Integer> factors = new ArrayList<>();
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                factors.add(d);
                while (n % d == 0) n /= d;
            }
        }
        if (n > 1) factors.add(n);
        return factors;
    }
    
    /**
     * Count numbers ≤ limit that are coprime to n
     * 
     * Time Complexity: O(2^m × √n) where m = number of prime factors
     * Space Complexity: O(m)
     */
    public static int countCoprime(int n, int limit) {
        List<Integer> factors = getPrimeFactors(n);
        int m = factors.size();
        
        int divisibleCount = 0;
        
        for (int mask = 1; mask < (1 << m); mask++) {
            int bits = Integer.bitCount(mask);
            long product = 1;
            
            for (int i = 0; i < m; i++) {
                if ((mask & (1 << i)) != 0) {
                    product *= factors.get(i);
                }
            }
            
            int count = limit / (int)product;
            divisibleCount += (bits % 2 == 1) ? count : -count;
        }
        
        return limit - divisibleCount;
    }
    
    /**
     * Euler's totient function φ(n)
     * 
     * Time Complexity: O(2^m × √n) where m = number of prime factors
     * Space Complexity: O(m)
     */
    public static int eulerTotient(int n) {
        List<Integer> factors = getPrimeFactors(n);
        int m = factors.size();
        
        int result = n;
        
        for (int mask = 1; mask < (1 << m); mask++) {
            int bits = Integer.bitCount(mask);
            long product = 1;
            
            for (int i = 0; i < m; i++) {
                if ((mask & (1 << i)) != 0) {
                    product *= factors.get(i);
                }
            }
            
            if (bits % 2 == 1) {
                result -= n / product;
            } else {
                result += n / product;
            }
        }
        
        return result;
    }
    
    /**
     * Count numbers ≤ limit divisible by at least one divisor
     * 
     * Time Complexity: O(2^n × log(max(divisors)))
     * Space Complexity: O(1)
     */
    public static int countMultiples(int[] divisors, int limit) {
        int n = divisors.length;
        int result = 0;
        
        for (int mask = 1; mask < (1 << n); mask++) {
            int bits = Integer.bitCount(mask);
            long lcm = 1;
            
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    lcm = lcm * divisors[i] / gcd(lcm, divisors[i]);
                    if (lcm > limit) break;
                }
            }
            
            if (lcm <= limit) {
                int count = limit / (int)lcm;
                result += (bits % 2 == 1) ? count : -count;
            }
        }
        
        return result;
    }
    
    private static long gcd(long a, long b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    /**
     * Count derangements modulo mod
     * 
     * Time Complexity: O(n log mod)
     * Space Complexity: O(1)
     */
    public static long countDerangements(int n, long mod) {
        // Calculate n! mod mod
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact = (fact * i) % mod;
        }
        
        // Sum of (-1)^k / k!
        long invFact = 1;
        long result = invFact;
        
        for (int k = 1; k <= n; k++) {
            // Modular inverse using Fermat's little theorem
            long invK = modPow(k, mod - 2, mod);
            invFact = (invFact * invK) % mod;
            
            if (k % 2 == 0) {
                result = (result + invFact) % mod;
            } else {
                result = (result - invFact + mod) % mod;
            }
        }
        
        return (fact * result) % mod;
    }
    
    private static long modPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("Inclusion-Exclusion Principle");
        System.out.println("========================================");
        
        // Coprime counting
        System.out.println("\n1. Coprime Counting:");
        System.out.println("   Numbers ≤ 100 coprime to 30: " + countCoprime(30, 100));
        
        // Euler's totient
        System.out.println("\n2. Euler's Totient:");
        int[] nums = {1, 2, 6, 10, 12, 30};
        for (int n : nums) {
            System.out.println("   φ(" + n + ") = " + eulerTotient(n));
        }
        
        // Derangements
        System.out.println("\n3. Derangements:");
        long mod = 1_000_000_007;
        for (int n = 1; n <= 7; n++) {
            System.out.println("   D(" + n + ") = " + countDerangements(n, mod));
        }
        
        // Multiples
        System.out.println("\n4. Multiples:");
        int[] divisors = {2, 3, 5};
        System.out.println("   Numbers ≤ 100 divisible by 2, 3, or 5: " 
                          + countMultiples(divisors, 100));
    }
}
```

<!-- slide: JavaScript -->
```javascript
/**
 * Get unique prime factors of n
 * @param {number} n - Input number
 * @returns {number[]} Array of prime factors
 */
function getPrimeFactors(n) {
    const factors = [];
    for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
            factors.push(d);
            while (n % d === 0) n /= d;
        }
    }
    if (n > 1) factors.push(n);
    return factors;
}

/**
 * Calculate GCD using Euclidean algorithm
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Count numbers ≤ limit that are coprime to n
 * 
 * Time Complexity: O(2^m × √n) where m = number of prime factors
 * Space Complexity: O(m)
 * 
 * @param {number} n - The number to be coprime to
 * @param {number} limit - Upper bound (inclusive)
 * @returns {number}
 */
function countCoprime(n, limit) {
    const factors = getPrimeFactors(n);
    const m = factors.length;
    
    let divisibleCount = 0;
    
    for (let mask = 1; mask < (1 << m); mask++) {
        const bits = mask.toString(2).split('1').length - 1;
        let product = 1;
        
        for (let i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                product *= factors[i];
            }
        }
        
        const count = Math.floor(limit / product);
        divisibleCount += (bits % 2 === 1) ? count : -count;
    }
    
    return limit - divisibleCount;
}

/**
 * Euler's totient function φ(n)
 * 
 * Time Complexity: O(2^m × √n) where m = number of prime factors
 * Space Complexity: O(m)
 * 
 * @param {number} n - Input number
 * @returns {number}
 */
function eulerTotient(n) {
    const factors = getPrimeFactors(n);
    const m = factors.length;
    
    let result = n;
    
    for (let mask = 1; mask < (1 << m); mask++) {
        const bits = mask.toString(2).split('1').length - 1;
        let product = 1;
        
        for (let i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                product *= factors[i];
            }
        }
        
        result += (bits % 2 === 1) ? -(n / product) : (n / product);
    }
    
    return result;
}

/**
 * Count numbers ≤ limit divisible by at least one divisor
 * 
 * Time Complexity: O(2^n × log(max(divisors)))
 * Space Complexity: O(1)
 * 
 * @param {number[]} divisors - Array of divisors
 * @param {number} limit - Upper bound
 * @returns {number}
 */
function countMultiples(divisors, limit) {
    const n = divisors.length;
    let result = 0;
    
    for (let mask = 1; mask < (1 << n); mask++) {
        const bits = mask.toString(2).split('1').length - 1;
        let lcm = 1;
        
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                lcm = lcm * divisors[i] / gcd(lcm, divisors[i]);
                if (lcm > limit) break;
            }
        }
        
        if (lcm <= limit) {
            const count = Math.floor(limit / lcm);
            result += (bits % 2 === 1) ? count : -count;
        }
    }
    
    return result;
}

/**
 * Modular exponentiation
 * @param {number} base 
 * @param {number} exp 
 * @param {number} mod 
 * @returns {number}
 */
function modPow(base, exp, mod) {
    let result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

/**
 * Count derangements modulo mod
 * 
 * Time Complexity: O(n log mod)
 * Space Complexity: O(1)
 * 
 * @param {number} n - Number of elements
 * @param {number} mod - Modulus
 * @returns {number}
 */
function countDerangements(n, mod = 1e9 + 7) {
    // Calculate n! mod mod
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact = (fact * i) % mod;
    }
    
    // Sum of (-1)^k / k!
    let invFact = 1;
    let result = invFact;
    
    for (let k = 1; k <= n; k++) {
        const invK = modPow(k, mod - 2, mod);
        invFact = (invFact * invK) % mod;
        
        result += (k % 2 === 0) ? invFact : -invFact;
        result = ((result % mod) + mod) % mod;
    }
    
    return (fact * result) % mod;
}

// Example usage
console.log("=".repeat(60));
console.log("Inclusion-Exclusion Principle Demonstrations");
console.log("=".repeat(60));

// Coprime counting
console.log("\n1. Coprime Counting:");
console.log(`   Numbers ≤ 100 coprime to 30: ${countCoprime(30, 100)}`);

// Euler's totient
console.log("\n2. Euler's Totient:");
[1, 2, 6, 10, 12, 30].forEach(n => {
    console.log(`   φ(${n}) = ${eulerTotient(n)}`);
});

// Derangements
console.log("\n3. Derangements:");
for (let n = 1; n <= 7; n++) {
    console.log(`   D(${n}) = ${countDerangements(n)}`);
}

// Multiples
console.log("\n4. Multiples:");
console.log(`   Numbers ≤ 100 divisible by 2, 3, or 5: ${countMultiples([2, 3, 5], 100)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Standard PIE with n sets** | O(2^n × f(n)) | f(n) = cost of computing intersection |
| **Coprime Counting** | O(2^m × √n) | m = number of distinct prime factors (m ≤ log₂n) |
| **Multiples Counting** | O(2^k × log D) | k = number of divisors, D = max divisor |
| **Derangements** | O(n log mod) | Using modular arithmetic |
| **Set Union (naive)** | O(2^n × intersection_size) | For arbitrary sets |

### Detailed Breakdown

**Bitmask Enumeration**: 
- We iterate through 2^n - 1 non-empty subsets
- Each subset requires computing the intersection

**Prime Factorization**: 
- Trial division up to √n: O(√n)
- Number of distinct prime factors m is small (at most ~10 for n ≤ 10^18)

**LCM Computations**: 
- Computing LCM of k numbers: O(k × log(max_value))
- GCD computation per pair: O(log max_value)

**Modular Arithmetic**: 
- Modular inverse using Fermat's little theorem: O(log mod)

---

## Space Complexity Analysis

| Implementation | Space Complexity | Notes |
|----------------|------------------|-------|
| **Basic PIE** | O(n) | Store the n sets |
| **Coprime Counting** | O(m) | m = number of prime factors |
| **Bitmask Iteration** | O(1) | Iterative, no recursion |
| **With Caching** | O(2^n) | Cache all intersections |

### Space Optimization Tips

1. **Iterative over Recursive**: Use bitmask iteration to avoid call stack
2. **Early Termination**: Break when LCM exceeds limit
3. **On-the-fly Computation**: Compute intersections without storing all subsets

---

## Common Variations

### 1. Derangements (Subfactorials)

Count permutations where no element appears in its original position.

**Formula**: D(n) = n! × Σ((-1)^k / k!) for k = 0 to n

**Approximation**: D(n) ≈ round(n! / e)

**Recurrence**: D(n) = (n-1) × (D(n-1) + D(n-2))

```
Example: D(4) = 9
Permutations of [1,2,3,4] where no element is in position i:
[2,1,4,3], [2,3,4,1], [2,4,1,3],
[3,1,4,2], [3,4,1,2], [3,4,2,1],
[4,1,2,3], [4,3,1,2], [4,3,2,1]
```

### 2. Coprime Counting

Count numbers in range [1, N] coprime to M.

**Key Steps**:
1. Factor M into primes: M = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ
2. Use PIE to count numbers divisible by at least one pᵢ
3. Answer = N - (count from step 2)

**Example**: Count numbers ≤ 100 coprime to 30 = 2 × 3 × 5
```
|Divisible by 2| = 50
|Divisible by 3| = 33
|Divisible by 5| = 20
|Divisible by 6| = 16
|Divisible by 10| = 10
|Divisible by 15| = 6
|Divisible by 30| = 3

Union = 50 + 33 + 20 - 16 - 10 - 6 + 3 = 74
Coprime = 100 - 74 = 26
```

### 3. Divisible Counting with LCM

Count numbers divisible by at least one of several divisors.

**Important**: Use LCM, not product, when divisors share common factors!

```python
def count_divisible_lcm(divisors, limit):
    """Correct implementation using LCM"""
    n = len(divisors)
    result = 0
    
    for mask in range(1, 1 << n):
        bits = bin(mask).count('1')
        lcm = 1
        
        for i in range(n):
            if mask & (1 << i):
                lcm = lcm * divisors[i] // gcd(lcm, divisors[i])
                if lcm > limit:
                    break
        
        if lcm <= limit:
            count = limit // lcm
            result += count if bits % 2 == 1 else -count
    
    return result
```

### 4. Exact k-Satisfying Constraints

Count elements satisfying exactly k out of n conditions (not at least k).

**Approach**: Use PIE twice or generating functions.

### 5. Probability Applications

Calculate P(at least one event occurs):

```
P(A ∪ B ∪ C) = P(A) + P(B) + P(C)
               - P(A ∩ B) - P(A ∩ C) - P(B ∩ C)
               + P(A ∩ B ∩ C)
```

---

## Practice Problems

### Problem 1: Number of Ways to Form Target String

**Problem**: [LeetCode 1639 - Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/)

**Difficulty**: Hard

**Description**: You are given a list of strings of the same length `words` and a string `target`. Your task is to form `target` using the given `words` under the following rules:
- `target` should be formed from left to right
- To form the i-th character of `target`, you can choose the k-th character of the j-th string in `words` if `target[i] = words[j][k]`
- Once you use the k-th character of the j-th string of `words`, you can no longer use the x-th character of any string in `words` where x ≤ k

**How to Apply Inclusion-Exclusion**:
- This problem uses complementary counting combined with DP
- Count total ways minus invalid ways using inclusion-exclusion principles
- Alternative: Direct DP with frequency counting per column

---

### Problem 2: Maximum XOR for Each Query

**Problem**: [LeetCode 1829 - Maximum XOR for Each Query](https://leetcode.com/problems/maximum-xor-for-each-query/)

**Difficulty**: Medium

**Description**: You are given a sorted array `nums` consisting of n non-negative integers. In one operation, you can increase the value of every element by 1. After each operation, you calculate the XOR of all elements. Return an array where the i-th element is the maximum possible XOR after i operations.

**How to Apply Inclusion-Exclusion**:
- Understand XOR properties through set-based thinking
- The maximum XOR relates to covering all bits, similar to set coverage
- Use bitmask manipulation and properties of XOR

---

### Problem 3: Points That Intersect With Cars

**Problem**: [LeetCode 2848 - Points That Intersect With Cars](https://leetcode.com/problems/points-that-intersect-with-cars/)

**Difficulty**: Easy

**Description**: You are given a 0-indexed 2D integer array `nums` representing the coordinates of cars parking on a number line. For any index `i`, `nums[i] = [starti, endi]` where `starti` is the starting point of the i-th car and `endi` is the ending point. Return the total number of integer points covered by at least one car.

**How to Apply Inclusion-Exclusion**:
- This is a direct application of union of intervals
- Sort intervals and use sweep line (alternative to PIE)
- For small number of intervals, PIE directly applies

---

### Problem 4: Find the Number of Ways to Place People

**Problem**: [LeetCode 3027 - Find the Number of Ways to Place People II](https://leetcode.com/problems/find-the-number-of-ways-to-place-people-ii/)

**Difficulty**: Hard

**Description**: You are given a 2D array `points` of size `n` x 2 representing integer coordinates of some points on a 2D-plane. Count the number of ways we can place two people at different points such that one person is at the top-left and the other at bottom-right.

**How to Apply Inclusion-Exclusion**:
- Count valid pairs using coordinate compression
- Use inclusion-exclusion to handle overlapping constraints
- Apply 2D counting techniques with set operations

---

### Problem 5: Count Vowel Strings in Ranges

**Problem**: [LeetCode 2559 - Count Vowel Strings in Ranges](https://leetcode.com/problems/count-vowel-strings-in-ranges/)

**Difficulty**: Medium

**Description**: You are given a 0-indexed array of strings `words` and a 2D array `queries`. Each query `queries[i] = [li, ri]` asks us to find the number of strings in `words` from index `li` to `ri` that start and end with a vowel.

**How to Apply Inclusion-Exclusion**:
- Preprocess using prefix sums (similar in spirit to union counting)
- Alternative: Use bitmask to represent vowel constraints
- Apply counting principles over ranges

---

## Video Tutorial Links

### Fundamentals

- [Inclusion-Exclusion Principle - Introduction (WilliamFiset)](https://www.youtube.com/watch?v=YG0jVZqZ1rI) - Excellent visual explanation with examples
- [Inclusion Exclusion Principle Explained (Neso Academy)](https://www.youtube.com/watch?v=UTyI5GVI5BM) - Comprehensive theoretical foundation
- [Competitive Programming - PIE (Errichto)](https://www.youtube.com/watch?v=7UV1hSkX2Uo) - CP-focused tutorial with code

### Applications and Problem Solving

- [Counting Coprimes with Inclusion-Exclusion (Codeforces)](https://www.youtube.com/watch?v=KQqg6F2Mx7E) - Number theory applications
- [Derangements and Inclusion-Exclusion (Tushar Roy)](https://www.youtube.com/watch?v=F3QBa1bz1zg) - Derangement counting
- [Inclusion-Exclusion for Probability (Khan Academy)](https://www.youtube.com/watch?v=2kNvtMyrSPI) - Probability theory applications

### Advanced Topics

- [Mobius Inversion and Inclusion-Exclusion (Algorithms Live!)](https://www.youtube.com/watch?v=Qn4Jx1V4_wA) - Advanced number theory connections
- [Generalized Inclusion-Exclusion (MIT OpenCourseWare)](https://www.youtube.com/watch?v=blRzXKlqFJQ) - Mathematical foundations

---

## Follow-up Questions

### Q1: What's the maximum number of sets for practical use?

**Answer**: Typically 20-30 sets maximum due to the O(2^n) complexity. For n = 20, we have 2^20 ≈ 1 million operations which is manageable. For n = 25, we have ~33 million operations which may be borderline in time-constrained environments. For more sets:
- Use **Mobius inversion** for divisor-based problems
- Use **dynamic programming with bitmask** if there's state overlap
- Use **approximation algorithms** for estimation
- Consider **meet-in-the-middle** techniques

### Q2: Can I optimize when sets have special structure?

**Answer**: Yes! Several optimizations exist:
- **Nested sets**: If A ⊆ B, then |A ∪ B| = |B| (simpler calculation)
- **Disjoint sets**: |A ∪ B| = |A| + |B| (no subtraction needed)
- **Chain structure**: Can use dynamic programming instead
- **Symmetric structure**: Exploit symmetry to reduce computation by half

### Q3: When should I use complement counting vs direct counting?

**Answer**: Use **complement counting** when:
- Counting "none" or "at least one" is easier than exact counting
- The union is complex but the universal set is simple
- Problems ask for "not divisible by any" rather than "divisible by specific"

Use **direct counting** when:
- The union structure is simple
- You need exact intersection sizes anyway
- Complement would require counting a massive universal set

**Example**: Counting numbers ≤ N not divisible by 2, 3, or 5
- Direct: PIE on coprime condition (complex)
- Complement: PIE on divisible condition (simpler), then subtract from N

### Q4: How does inclusion-exclusion relate to the Mobius function?

**Answer**: The **Mobius inversion formula** is a generalization of inclusion-exclusion:

```
If f(n) = Σ g(d) for all d|n, then g(n) = Σ μ(d) × f(n/d) for all d|n
```

Where μ is the Mobius function:
- μ(1) = 1
- μ(n) = 0 if n has a squared prime factor
- μ(n) = (-1)^k if n is a product of k distinct primes

For divisor-based counting, Mobius inversion often provides a more efficient O(n log n) solution compared to O(2^k) PIE when there are many prime factors.

### Q5: How do I handle floating-point precision in probability calculations?

**Answer**: When using inclusion-exclusion for probabilities:
- Use **exact fractions** when possible (rational arithmetic)
- For floating-point, use **double precision** (64-bit) minimum
- Be aware of **catastrophic cancellation** when subtracting similar values
- Consider **Kahan summation** for better accuracy with many terms
- **Log-space computation** for very small probabilities

---

## Summary

The Principle of Inclusion-Exclusion is a powerful counting technique essential for solving problems with overlapping constraints. Key takeaways:

### Core Formula
```
|A₁ ∪ A₂ ∪ ... ∪ Aₙ| = Σ(-1)^(|S|+1) × |∩ᵢ∈S Aᵢ|
```

### When to Use
- ✅ Counting union of overlapping sets
- ✅ "At least one" or "none" conditions
- ✅ Number theory (coprime, multiple counting)
- ✅ Derangements and constrained permutations
- ✅ Probability of union of events

### Implementation Strategy
1. Identify the k conditions/sets
2. Determine the universal set size
3. For each non-empty subset of conditions:
   - Calculate the intersection size
   - Add/subtract based on subset cardinality
4. Return the alternating sum

### Complexity Considerations
- **Time**: O(2^k × f(n)) where k = number of conditions
- **Space**: O(k) typically
- Practical limit: k ≤ 20-25 for reasonable runtime

### Common Patterns
| Pattern | Formula/Approach |
|---------|-----------------|
| Coprime counting | N - count of numbers sharing any prime factor with M |
| Multiples counting | PIE over divisors using LCM |
| Derangements | n! × Σ((-1)^k / k!) |
| At least one | Direct PIE on union |
| None satisfy | Universal - PIE(union) |

The inclusion-exclusion principle bridges the gap between simple counting and complex combinatorial problems, making it an indispensable tool in competitive programming and algorithmic problem-solving.

---

## Related Algorithms

- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - Prime factorization support
- [Linear Sieve](./linear-sieve.md) - Fast prime factorization
- [Euler's Totient](./euler-totient.md) - Related number-theoretic function
- [Modular Arithmetic](./modular-exponentiation.md) - For derangement calculations
- [GCD and LCM](./gcd-euclidean.md) - Essential for LCM calculations
- [Mobius Function](./mobius-function.md) - Generalization of inclusion-exclusion