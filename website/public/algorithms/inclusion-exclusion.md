# Inclusion-Exclusion Principle

## Category
Math & Number Theory

## Description

The **Principle of Inclusion-Exclusion (PIE)** is a counting technique for finding the size of the union of multiple sets by adding the sizes of individual sets and subtracting the sizes of their intersections appropriately.

For two sets:
```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

For three sets:
```
|A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
```

The general pattern: add singles, subtract pairs, add triples, subtract quadruples, etc.

---

## When to Use

Use Inclusion-Exclusion when you need to count:

- **Union of Multiple Sets**: When elements might belong to multiple categories
- **Complement Counting**: |Not(A ∪ B)| = |Universal| - |A ∪ B|
- **Coprime Counting**: Numbers coprime to a given set
- **Derangements**: Permutations where no element appears in its original position
- **Problems with Constraints**: "At least one" or "none" conditions

### Common Patterns

- **Count multiples**: Numbers divisible by at least one of several primes
- **Count coprimes**: Numbers coprime to a given number
- **Count valid configurations**: Excluding invalid ones
- **Probability**: P(at least one event) calculations

---

## Algorithm Explanation

### Two Sets

```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

**Intuition**: Add both sets, but elements in both were counted twice, so subtract their intersection once.

### Three Sets

```
|A ∪ B ∪ C| = |A| + |B| + |C|
             - |A ∩ B| - |A ∩ C| - |B ∩ C|
             + |A ∩ B ∩ C|
```

**Intuition**: 
- Add all singles
- Subtract all pairs (each pair intersection was counted twice)
- Add back the triple intersection (subtracted too many times)

### General Formula

For n sets A₁, A₂, ..., Aₙ:
```
|A₁ ∪ A₂ ∪ ... ∪ Aₙ| = Σ|Aᵢ| - Σ|Aᵢ ∩ Aⱼ| + Σ|Aᵢ ∩ Aⱼ ∩ Aₖ| - ... + (-1)^(n+1)|A₁ ∩ A₂ ∩ ... ∩ Aₙ|
```

Or compactly:
```
|∪ Aᵢ| = Σ (-1)^(|S|+1) × |∩ Aᵢ| for all non-empty subsets S ⊆ {1, 2, ..., n}
```

---

## Implementation

### Template Code

````carousel
```python
from itertools import combinations
from math import gcd
from functools import reduce


def inclusion_exclusion(sets: list[set]) -> int:
    """
    Calculate size of union of sets using inclusion-exclusion.
    
    Time Complexity: O(2^n × cost_of_intersection)
    Space Complexity: O(n)
    """
    n = len(sets)
    result = 0
    
    # Iterate over all non-empty subsets
    for r in range(1, n + 1):
        for subset in combinations(range(n), r):
            # Calculate intersection of sets in subset
            intersection = sets[subset[0]]
            for i in subset[1:]:
                intersection = intersection & sets[i]
            
            # Add or subtract based on subset size
            sign = 1 if r % 2 == 1 else -1
            result += sign * len(intersection)
    
    return result


def count_coprime_to_n(n: int, limit: int) -> int:
    """
    Count numbers ≤ limit that are coprime to n.
    
    Uses inclusion-exclusion on prime factors of n.
    """
    # Get prime factors of n
    factors = []
    d = 2
    temp = n
    while d * d <= temp:
        if temp % d == 0:
            factors.append(d)
            while temp % d == 0:
                temp //= d
        d += 1
    if temp > 1:
        factors.append(temp)
    
    # Inclusion-exclusion over multiples of prime factors
    result = 0
    m = len(factors)
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        # Calculate LCM of selected primes
        lcm = 1
        for i in range(m):
            if mask & (1 << i):
                lcm = lcm * factors[i] // gcd(lcm, factors[i])
        
        # Count multiples of this LCM
        count = limit // lcm
        sign = 1 if bits % 2 == 1 else -1
        result += sign * count
    
    # Numbers NOT divisible by any prime factor of n
    return limit - result


def euler_totient(n: int) -> int:
    """
    Euler's totient function using inclusion-exclusion.
    φ(n) = count of numbers ≤ n coprime to n.
    """
    # Get unique prime factors
    factors = []
    temp = n
    d = 2
    while d * d <= temp:
        if temp % d == 0:
            factors.append(d)
            while temp % d == 0:
                temp //= d
        d += 1
    if temp > 1:
        factors.append(temp)
    
    # Apply inclusion-exclusion
    result = n
    m = len(factors)
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        product = 1
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        if bits % 2 == 1:
            result -= n // product
        else:
            result += n // product
    
    return result


def count_derangements(n: int, mod: int = 10**9 + 7) -> int:
    """
    Count derangements: permutations where no element is in its original position.
    
    D(n) = n! × Σ((-1)^k / k!) for k = 0 to n
    """
    fact = 1
    for i in range(1, n + 1):
        fact = (fact * i) % mod
    
    # Sum of alternating reciprocals
    inv_fact = 1  # 1/0! = 1
    result = inv_fact
    
    for k in range(1, n + 1):
        inv_fact = (inv_fact * pow(k, mod - 2, mod)) % mod
        if k % 2 == 0:
            result = (result + inv_fact) % mod
        else:
            result = (result - inv_fact + mod) % mod
    
    return (fact * result) % mod


def count_multiples(divisors: list[int], limit: int) -> int:
    """
    Count numbers ≤ limit divisible by at least one of the divisors.
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
        
        count = limit // lcm
        sign = 1 if bits % 2 == 1 else -1
        result += sign * count
    
    return result


# Example usage
if __name__ == "__main__":
    # Count numbers ≤ 100 coprime to 30
    print(f"Coprime to 30 up to 100: {count_coprime_to_n(30, 100)}")
    
    # Euler's totient
    print(f"φ(30) = {euler_totient(30)}")
    
    # Derangements
    for n in range(1, 6):
        print(f"D({n}) = {count_derangements(n)}")
    
    # Multiples
    print(f"Multiples of 2, 3, or 5 up to 100: {count_multiples([2, 3, 5], 100)}")
```

<!-- slide -->
```cpp
#include <vector>
#include <numeric>
using namespace std;

/**
 * Count numbers coprime to n up to limit
 */
int countCoprime(int n, int limit) {
    // Get prime factors
    vector<int> factors;
    int temp = n;
    for (int d = 2; d * d <= temp; d++) {
        if (temp % d == 0) {
            factors.push_back(d);
            while (temp % d == 0) temp /= d;
        }
    }
    if (temp > 1) factors.push_back(temp);
    
    // Inclusion-exclusion
    int m = factors.size();
    int result = 0;
    
    for (int mask = 1; mask < (1 << m); mask++) {
        int bits = __builtin_popcount(mask);
        long long lcm = 1;
        
        for (int i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                lcm = lcm * factors[i] / gcd((long long)lcm, (long long)factors[i]);
            }
        }
        
        int count = limit / lcm;
        result += (bits % 2 == 1) ? count : -count;
    }
    
    return limit - result;
}

/**
 * Euler's totient
 */
int eulerTotient(int n) {
    vector<int> factors;
    int temp = n;
    for (int d = 2; d * d <= temp; d++) {
        if (temp % d == 0) {
            factors.push_back(d);
            while (temp % d == 0) temp /= d;
        }
    }
    if (temp > 1) factors.push_back(temp);
    
    int result = n;
    int m = factors.size();
    
    for (int mask = 1; mask < (1 << m); mask++) {
        int bits = __builtin_popcount(mask);
        int product = 1;
        
        for (int i = 0; i < m; i++) {
            if (mask & (1 << i)) product *= factors[i];
        }
        
        result += (bits % 2 == 1) ? -(n / product) : (n / product);
    }
    
    return result;
}

/**
 * Count multiples
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
        
        result += (bits % 2 == 1) ? (limit / lcm) : -(limit / lcm);
    }
    
    return result;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

public class InclusionExclusion {
    
    public static int countCoprime(int n, int limit) {
        List<Integer> factors = new ArrayList<>();
        int temp = n;
        
        for (int d = 2; d * d <= temp; d++) {
            if (temp % d == 0) {
                factors.add(d);
                while (temp % d == 0) temp /= d;
            }
        }
        if (temp > 1) factors.add(temp);
        
        int m = factors.size();
        int result = 0;
        
        for (int mask = 1; mask < (1 << m); mask++) {
            int bits = Integer.bitCount(mask);
            long lcm = 1;
            
            for (int i = 0; i < m; i++) {
                if ((mask & (1 << i)) != 0) {
                    lcm = lcm * factors.get(i) / gcd(lcm, factors.get(i));
                }
            }
            
            int count = limit / (int)lcm;
            result += (bits % 2 == 1) ? count : -count;
        }
        
        return limit - result;
    }
    
    private static long gcd(long a, long b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    public static int eulerTotient(int n) {
        List<Integer> factors = new ArrayList<>();
        int temp = n;
        
        for (int d = 2; d * d <= temp; d++) {
            if (temp % d == 0) {
                factors.add(d);
                while (temp % d == 0) temp /= d;
            }
        }
        if (temp > 1) factors.add(temp);
        
        int result = n;
        int m = factors.size();
        
        for (int mask = 1; mask < (1 << m); mask++) {
            int bits = Integer.bitCount(mask);
            int product = 1;
            
            for (int i = 0; i < m; i++) {
                if ((mask & (1 << i)) != 0) product *= factors.get(i);
            }
            
            result += (bits % 2 == 1) ? -(n / product) : (n / product);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function countCoprime(n, limit) {
    const factors = [];
    let temp = n;
    
    for (let d = 2; d * d <= temp; d++) {
        if (temp % d === 0) {
            factors.push(d);
            while (temp % d === 0) temp /= d;
        }
    }
    if (temp > 1) factors.push(temp);
    
    const m = factors.length;
    let result = 0;
    
    for (let mask = 1; mask < (1 << m); mask++) {
        const bits = mask.toString(2).split('1').length - 1;
        let lcm = 1;
        
        for (let i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                lcm = lcm * factors[i] / gcd(lcm, factors[i]);
            }
        }
        
        const count = Math.floor(limit / lcm);
        result += (bits % 2 === 1) ? count : -count;
    }
    
    return limit - result;
}

function eulerTotient(n) {
    const factors = [];
    let temp = n;
    
    for (let d = 2; d * d <= temp; d++) {
        if (temp % d === 0) {
            factors.push(d);
            while (temp % d === 0) temp /= d;
        }
    }
    if (temp > 1) factors.push(temp);
    
    let result = n;
    const m = factors.length;
    
    for (let mask = 1; mask < (1 << m); mask++) {
        const bits = mask.toString(2).split('1').length - 1;
        let product = 1;
        
        for (let i = 0; i < m; i++) {
            if (mask & (1 << i)) product *= factors[i];
        }
        
        result += (bits % 2 === 1) ? -(n / product) : (n / product);
    }
    
    return result;
}
```
````

---

## Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Standard PIE | O(2^n) | O(n) |
| With k sets | O(2^k) | O(k) |
| Coprime counting | O(2^m × √n) | O(m) |

Where m = number of distinct prime factors (at most ~10 for n ≤ 10^12).

---

## Practice Problems

### Problem 1: Count Coprimes
**Problem**: Count numbers ≤ N coprime to a given number M.

**Solution**: Factorize M, then inclusion-exclusion on its prime factors.

### Problem 2: Number of Ways to Form Target String
**Problem**: [LeetCode 1639](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/)

**Solution**: Use inclusion-exclusion or DP with complementary counting.

---

## Follow-up Questions

### Q1: What's the maximum number of sets for practical use?

**Answer**: Usually 20-30 sets maximum due to 2^n complexity. For more sets, use alternative approaches or approximations.

### Q2: Can I optimize when sets have special structure?

**Answer**: Yes! If sets are nested or disjoint, simpler formulas apply. The general formula is needed only for arbitrary overlapping sets.

---

## Summary

Inclusion-Exclusion is essential for:

- **Union counting** when sets overlap
- **Coprime enumeration** via prime factor LCMs
- **Complement problems** using "at least one" logic
- **Derangements** and constrained permutations

**Key Insight**: Alternating sum over all subset intersections gives exact union size.

---

## Related Algorithms

- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - For prime factorization
- [Linear Sieve](./linear-sieve.md) - Fast prime factorization
- [Euler's Totient](./euler-totient.md) - Related counting function