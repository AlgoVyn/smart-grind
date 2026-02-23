# Sieve of Eratosthenes

## Category
Math & Number Theory

## Description
Generate all prime numbers up to n.

## Algorithm Explanation
The Sieve of Eratosthenes is an ancient and efficient algorithm for finding all prime numbers up to a given limit n. It works by iteratively marking the multiples of each prime starting from 2.

**Algorithm Steps:**
1. **Initialize**: Create a boolean array of size n+1, initially all True (assuming all are prime)
2. **Mark 0 and 1 as non-prime**: They are not prime numbers
3. **Iterate from 2 to √n**:
   - For each prime p, mark all multiples of p (starting from p²) as non-prime
   - We start from p² because smaller multiples would have been marked by smaller primes
4. **Collect results**: All indices still marked as True are prime numbers

**Why it works:**
- A composite number must have at least one prime factor ≤ √n
- When we find a prime p, we eliminate all its multiples (which are composite)
- After processing all primes up to √n, remaining unmarked numbers are prime

**Optimization:**
- Only iterate up to √n because larger factors would have been already handled
- Start marking from p² (p × p) since smaller multiples were already marked
- Use O(n) space for the boolean array

---

## When to Use
Use this algorithm when you need to solve problems involving:
- math & number theory related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

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


# Optimized version with set for faster lookups
def sieve_optimized(n):
    """Optimized version using odd numbers only."""
    if n < 2:
        return []
    if n == 2:
        return [2]
    
    # Only track odd numbers
    size = (n - 3) // 2 + 1
    is_prime = [True] * size
    
    # Sieve odd numbers only
    for i in range(int(n ** 0.5) // 2):
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


# Count primes up to n (LeetCode style)
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
```

```javascript
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
```

---

## Example

**Input:**
```
n = 10
```

**Output:**
```
[2, 3, 5, 7]
```

**Explanation:**
- Mark 0, 1 as non-prime
- p=2: mark 4, 6, 8, 10 as non-prime
- p=3: mark 9 as non-prime (6, 8 already marked)
- Remaining primes: 2, 3, 5, 7

**Input:**
```
n = 30
```

**Output:**
```
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

**Input:**
```
n = 2
```

**Output:**
```
[2]
```

**Input:**
```
n = 1
```

**Output:**
```
[]
```

**Input:**
```
n = 0
```

**Output:**
```
[]
```

---

## Time Complexity
**O(n log log n)**

---

## Space Complexity
**O(n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
