# Modular Inverse

## Category
Math & Number Theory

## Description

The **modular multiplicative inverse** of an integer `a` modulo `m` is an integer `x` such that:

```
a × x ≡ 1 (mod m)
```

This is written as `a^(-1) mod m` or `a⁻¹ (mod m)`. The modular inverse is the equivalent of division in modular arithmetic—multiplying by `a^(-1)` is the same as dividing by `a` under modulo `m`.

---

## Core Concept

### The Division Problem in Modular Arithmetic

In regular arithmetic, dividing by `a` is the same as multiplying by `1/a`. However, in modular arithmetic, we cannot directly divide. Instead, we find a number `x` such that when we multiply `a` by `x`, we get 1 (mod m).

```
(a / b) mod m = (a × b⁻¹) mod m
```

### Existence Condition

The modular inverse of `a` modulo `m` **exists if and only if**:
```
gcd(a, m) = 1
```

This means `a` and `m` must be **coprime** (relatively prime). If `gcd(a, m) > 1`, the inverse does not exist.

### Example

For `a = 3` and `m = 11`:
- We need `3 × x ≡ 1 (mod 11)`
- Testing: `3 × 4 = 12 ≡ 1 (mod 11)` ✓
- Therefore, `3⁻¹ ≡ 4 (mod 11)`

---

## When to Use

Use modular inverse when you need to:

- **Perform Division Under Modulo**: Calculate `(a/b) mod m` when `m` is not prime
- **Compute Combinations (nCr)**: `nCr = n! / (r! × (n-r)!)` requires modular division
- **Solve Linear Congruences**: Find `x` in equations like `ax ≡ b (mod m)`
- **Cryptography**: RSA encryption/decryption, Diffie-Hellman key exchange
- **Competitive Programming**: Counting problems with modulo constraints

### Comparison of Methods

| Method | Time Complexity | Space Complexity | Requirements | Use Case |
|--------|-----------------|------------------|--------------|----------|
| **Extended Euclidean** | O(log(min(a, m))) | O(1) | `gcd(a, m) = 1` | General purpose, any modulus |
| **Fermat's Little Theorem** | O(log m) | O(1) | `m` is prime | Fastest when m is prime |
| **Euler's Theorem** | O(√m) + O(log m) | O(1) | `gcd(a, m) = 1` | General, but needs φ(m) |
| **Precompute All (1..n)** | O(n) preprocessing | O(n) | `m` is prime | Multiple inverses needed |

### When to Choose Each Method

- **Choose Extended Euclidean** when:
  - The modulus `m` is not prime
  - You need a general-purpose solution
  - You want guaranteed O(log) performance

- **Choose Fermat's Little Theorem** when:
  - The modulus `m` is prime (common in CP: 10⁹+7, 998244353)
  - You need the fastest possible single inverse computation
  - Built-in `pow(a, m-2, m)` is available

- **Choose Precomputation** when:
  - You need inverses for all numbers 1 to n
  - Space is not a constraint
  - Multiple queries need fast answers

---

## Algorithm Explanation

### Method 1: Extended Euclidean Algorithm (General Case)

The Extended Euclidean Algorithm finds integers `x` and `y` such that:
```
ax + my = gcd(a, m) = 1
```

Taking modulo `m` on both sides:
```
ax ≡ 1 (mod m)
```

Therefore, `x` is the modular inverse of `a`.

**Why it works**: Bézout's identity guarantees that if `gcd(a, m) = 1`, then there exist integers `x` and `y` such that `ax + my = 1`. Taking mod `m` gives `ax ≡ 1 (mod m)`.

### Method 2: Fermat's Little Theorem (When m is Prime)

If `m` is prime and `a` is not divisible by `m`:
```
a^(m-1) ≡ 1 (mod m)       [Fermat's Little Theorem]
a^(m-2) ≡ a^(-1) (mod m)  [Multiply both sides by a^(-1)]
```

So the inverse is `a^(m-2) mod m`, computable with fast exponentiation in O(log m).

### Method 3: Euler's Theorem (Generalization)

If `gcd(a, m) = 1`:
```
a^φ(m) ≡ 1 (mod m)           [Euler's Theorem]
a^(φ(m)-1) ≡ a^(-1) (mod m)  [Multiply by a^(-1)]
```

Where `φ(m)` is Euler's totient function, counting numbers ≤ m that are coprime to m.

---

## Algorithm Steps

### Finding Modular Inverse Using Extended Euclidean

1. **Apply Extended GCD**: Find `g, x, y` such that `ax + my = g = gcd(a, m)`
2. **Check existence**: If `g ≠ 1`, inverse does not exist
3. **Normalize result**: Return `(x % m + m) % m` to ensure positive result

### Finding Modular Inverse Using Fermat's Theorem

1. **Verify precondition**: Ensure `m` is prime
2. **Compute power**: Calculate `a^(m-2) mod m` using fast exponentiation
3. **Return result**: The result is the modular inverse

### Fast Exponentiation (Binary Exponentiation)

1. **Initialize**: `result = 1`, `base = a % m`
2. **Iterate while exp > 0**:
   - If `exp` is odd: `result = (result × base) % m`
   - `base = (base × base) % m`
   - `exp = exp // 2`
3. **Return**: `result`

---

## Implementation

### Template Code

````carousel
```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """Extended Euclidean Algorithm. Returns (g, x, y) where ax + by = g."""
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> int | None:
    """
    Returns modular inverse of a under modulo m using Extended Euclidean Algorithm.
    Returns None if inverse doesn't exist.
    
    Time Complexity: O(log(min(a, m)))
    Space Complexity: O(log(min(a, m))) due to recursion
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Inverse doesn't exist
    return (x % m + m) % m  # Ensure positive result


def mod_inverse_fermat(a: int, m: int) -> int:
    """
    Returns modular inverse using Fermat's Little Theorem.
    Only works when m is prime.
    
    Time Complexity: O(log m)
    Space Complexity: O(1)
    """
    return pow(a, m - 2, m)


def mod_inverse_iterative(a: int, m: int) -> int | None:
    """
    Iterative version of modular inverse using Extended Euclidean Algorithm.
    More space efficient.
    
    Time Complexity: O(log(min(a, m)))
    Space Complexity: O(1)
    """
    a = a % m
    if a == 0:
        return None if m != 1 else 0
    
    x0, x1 = 1, 0
    original_m = m
    
    while m != 0:
        q = a // m
        a, m = m, a - q * m
        x0, x1 = x1, x0 - q * x1
    
    if a != 1:
        return None  # Inverse doesn't exist
    
    return (x0 % original_m + original_m) % original_m


# Example usage
if __name__ == "__main__":
    a, m = 3, 11
    inv = mod_inverse(a, m)
    print(f"Inverse of {a} mod {m} = {inv}")
    print(f"Verification: {a} × {inv} = {(a * inv) % m} ≡ 1 (mod {m})")
    
    # Using Fermat (m is prime)
    inv_fermat = mod_inverse_fermat(a, m)
    print(f"Using Fermat: {inv_fermat}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <tuple>
using namespace std;

/**
 * Extended Euclidean Algorithm
 * Returns (gcd, x, y) where ax + by = gcd(a, b)
 */
tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) return {a, 1, 0};
    auto [g, x1, y1] = extendedGCD(b, a % b);
    return {g, y1, x1 - (a / b) * y1};
}

/**
 * Modular Inverse using Extended Euclidean Algorithm
 * Time: O(log(min(a, m)))
 * Returns -1 if inverse doesn't exist
 */
int modInverse(int a, int m) {
    auto [g, x, _] = extendedGCD((a % m + m) % m, m);
    if (g != 1) return -1;  // Inverse doesn't exist
    return (x % m + m) % m;  // Ensure positive
}

/**
 * Fast exponentiation for Fermat's Little Theorem
 * Time: O(log exp)
 */
long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

/**
 * Modular Inverse using Fermat's Little Theorem
 * Only works when mod is prime
 * Time: O(log m)
 */
int modInverseFermat(int a, int m) {
    return power(a, m - 2, m);
}

/**
 * Iterative Extended Euclidean for better space efficiency
 * Time: O(log(min(a, m))), Space: O(1)
 */
int modInverseIterative(int a, int m) {
    a = (a % m + m) % m;
    if (a == 0) return (m == 1) ? 0 : -1;
    
    int x0 = 1, x1 = 0;
    int original_m = m;
    
    while (m != 0) {
        int q = a / m;
        int temp = m;
        m = a - q * m;
        a = temp;
        
        temp = x1;
        x1 = x0 - q * x1;
        x0 = temp;
    }
    
    if (a != 1) return -1;
    return (x0 % original_m + original_m) % original_m;
}

int main() {
    int a = 3, m = 11;
    int inv = modInverse(a, m);
    
    cout << "Inverse of " << a << " mod " << m << " = " << inv << endl;
    cout << "Verification: " << a << " × " << inv << " = " << (1LL * a * inv) % m << endl;
    
    // Using Fermat's method
    int invFermat = modInverseFermat(a, m);
    cout << "Using Fermat: " << invFermat << endl;
    
    return 0;
}
```

<!-- slide -->
```java
public class ModularInverse {
    
    /**
     * Extended GCD result container
     */
    public static class Result {
        int gcd, x, y;
        Result(int gcd, int x, int y) {
            this.gcd = gcd; this.x = x; this.y = y;
        }
    }
    
    /**
     * Extended Euclidean Algorithm
     * Returns (gcd, x, y) where ax + by = gcd(a, b)
     */
    public static Result extendedGCD(int a, int b) {
        if (b == 0) return new Result(a, 1, 0);
        Result next = extendedGCD(b, a % b);
        return new Result(next.gcd, next.y, next.x - (a / b) * next.y);
    }
    
    /**
     * Modular Inverse using Extended Euclidean
     * Returns -1 if inverse doesn't exist
     * Time: O(log(min(a, m)))
     */
    public static int modInverse(int a, int m) {
        Result result = extendedGCD(((a % m) + m) % m, m);
        if (result.gcd != 1) return -1;
        return ((result.x % m) + m) % m;
    }
    
    /**
     * Fast exponentiation (binary exponentiation)
     * Time: O(log exp)
     */
    public static long power(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    /**
     * Modular Inverse using Fermat's Little Theorem
     * Only works when mod is prime
     * Time: O(log m)
     */
    public static long modInverseFermat(long a, long m) {
        return power(a, m - 2, m);
    }
    
    /**
     * Iterative Extended Euclidean for space efficiency
     * Time: O(log(min(a, m))), Space: O(1)
     */
    public static int modInverseIterative(int a, int m) {
        a = ((a % m) + m) % m;
        if (a == 0) return (m == 1) ? 0 : -1;
        
        int x0 = 1, x1 = 0;
        int originalM = m;
        
        while (m != 0) {
            int q = a / m;
            int temp = m;
            m = a - q * m;
            a = temp;
            
            temp = x1;
            x1 = x0 - q * x1;
            x0 = temp;
        }
        
        if (a != 1) return -1;
        return ((x0 % originalM) + originalM) % originalM;
    }
    
    public static void main(String[] args) {
        int a = 3, m = 11;
        int inv = modInverse(a, m);
        
        System.out.printf("Inverse of %d mod %d = %d%n", a, m, inv);
        System.out.printf("Verification: %d × %d ≡ %d (mod %d)%n", 
            a, inv, (a * inv) % m, m);
        
        // Using Fermat
        long invFermat = modInverseFermat(a, m);
        System.out.printf("Using Fermat: %d%n", invFermat);
    }
}
```

<!-- slide -->
```javascript
/**
 * Extended Euclidean Algorithm
 * Returns [gcd, x, y] where ax + by = gcd(a, b)
 */
function extendedGCD(a, b) {
    if (b === 0) return [a, 1, 0];
    const [g, x1, y1] = extendedGCD(b, a % b);
    return [g, y1, x1 - Math.floor(a / b) * y1];
}

/**
 * Modular Inverse using Extended Euclidean
 * Returns null if inverse doesn't exist
 * Time: O(log(min(a, m)))
 */
function modInverse(a, m) {
    const [g, x] = extendedGCD(((a % m) + m) % m, m);
    if (g !== 1) return null;
    return ((x % m) + m) % m;
}

/**
 * Fast exponentiation (binary exponentiation)
 * Time: O(log exp)
 */
function power(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return Number(result);
}

/**
 * Modular Inverse using Fermat's Little Theorem
 * Only works when mod is prime
 * Time: O(log m)
 */
function modInverseFermat(a, m) {
    return power(a, m - 2, m);
}

/**
 * Iterative Extended Euclidean for space efficiency
 * Time: O(log(min(a, m))), Space: O(1)
 */
function modInverseIterative(a, m) {
    a = ((a % m) + m) % m;
    if (a === 0) return m === 1 ? 0 : null;
    
    let x0 = 1, x1 = 0;
    const originalM = m;
    
    while (m !== 0) {
        const q = Math.floor(a / m);
        [a, m] = [m, a - q * m];
        [x0, x1] = [x1, x0 - q * x1];
    }
    
    if (a !== 1) return null;
    return ((x0 % originalM) + originalM) % originalM;
}

// Example usage
const a = 3, m = 11;
const inv = modInverse(a, m);
console.log(`Inverse of ${a} mod ${m} = ${inv}`);
console.log(`Verification: ${a} × ${inv} ≡ ${(a * inv) % m} (mod ${m})`);

// Using Fermat
const invFermat = modInverseFermat(a, m);
console.log(`Using Fermat: ${invFermat}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Extended Euclidean** | O(log(min(a, m))) | Each recursion reduces the problem size significantly |
| **Fermat's Little Theorem** | O(log m) | Binary exponentiation requires log m multiplications |
| **Iterative Extended GCD** | O(log(min(a, m))) | Same complexity, better space |
| **Precompute (1..n)** | O(n) | Linear preprocessing for all inverses |

### Detailed Breakdown

**Extended Euclidean Algorithm:**
- Each recursive call reduces `(a, b)` to `(b, a mod b)`
- Similar to Euclidean GCD, which takes O(log(min(a, b))) steps
- Each step performs constant-time arithmetic operations

**Fermat's Little Theorem (with binary exponentiation):**
- Computing `a^(m-2) mod m` using binary exponentiation
- Each bit of the exponent requires at most one multiplication
- Total multiplications: O(log(m-2)) = O(log m)
- Each multiplication is O(1) for fixed-size integers

**Precomputation Method:**
- Uses the recurrence: `inv[i] = mod - (mod // i) * inv[mod % i] % mod`
- Single pass through 1 to n: O(n) time
- O(n) space to store all inverses

---

## Space Complexity Analysis

| Method | Space Complexity | Notes |
|--------|-----------------|-------|
| **Extended Euclidean (Recursive)** | O(log(min(a, m))) | Call stack depth |
| **Extended Euclidean (Iterative)** | O(1) | Constant extra space |
| **Fermat's Theorem** | O(1) | Constant extra space |
| **Precompute All** | O(n) | Storage for n inverses |

### Space Optimization Tips

1. **Use iterative version** when stack depth is a concern
2. **Precompute factorials and inverse factorials** together for nCr calculations
3. **Clear unused precomputed arrays** after use to free memory

---

## Common Variations

### 1. Precomputation for Multiple Inverses

When computing many modular inverses (e.g., for all numbers 1 to n), use this O(n) approach:

````carousel
```python
def precompute_inverses(n: int, mod: int) -> list[int]:
    """
    Precompute modular inverses for all numbers 1 to n.
    Only works when mod is prime.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Formula: inv[i] = mod - (mod // i) * inv[mod % i] % mod
    """
    inv = [0] * (n + 1)
    inv[1] = 1
    
    for i in range(2, n + 1):
        inv[i] = mod - (mod // i) * inv[mod % i] % mod
    
    return inv


# Example: Precompute all inverses mod 13
mod = 13
inverses = precompute_inverses(12, mod)
for i in range(1, 13):
    print(f"{i}^(-1) ≡ {inverses[i]} (mod {mod})")
```

<!-- slide -->
```cpp
#include <vector>
#include <iostream>
using namespace std;

/**
 * Precompute modular inverses for 1 to n
 * Time: O(n), Space: O(n)
 * Requires: mod is prime
 */
vector<int> precomputeInverses(int n, int mod) {
    vector<int> inv(n + 1);
    inv[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        inv[i] = mod - (int)((mod / i) * 1LL * inv[mod % i] % mod);
    }
    
    return inv;
}

int main() {
    int mod = 13;
    auto inv = precomputeInverses(12, mod);
    
    for (int i = 1; i <= 12; i++) {
        cout << i << "^(-1) ≡ " << inv[i] << " (mod " << mod << ")" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

public class PrecomputeInverses {
    
    /**
     * Precompute modular inverses for 1 to n
     * Time: O(n), Space: O(n)
     * Requires: mod is prime
     */
    public static int[] precomputeInverses(int n, int mod) {
        int[] inv = new int[n + 1];
        inv[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            inv[i] = mod - (int)((mod / i) * 1L * inv[mod % i] % mod);
        }
        
        return inv;
    }
    
    public static void main(String[] args) {
        int mod = 13;
        int[] inv = precomputeInverses(12, mod);
        
        for (int i = 1; i <= 12; i++) {
            System.out.printf("%d^(-1) ≡ %d (mod %d)%n", i, inv[i], mod);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Precompute modular inverses for 1 to n
 * Time: O(n), Space: O(n)
 * Requires: mod is prime
 */
function precomputeInverses(n, mod) {
    const inv = new Array(n + 1).fill(0);
    inv[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        inv[i] = mod - Math.floor(mod / i) * inv[mod % i] % mod;
    }
    
    return inv;
}

// Example
const mod = 13;
const inv = precomputeInverses(12, mod);

for (let i = 1; i <= 12; i++) {
    console.log(`${i}^(-1) ≡ ${inv[i]} (mod ${mod})`);
}
```
````

### 2. Computing nCr (Binomial Coefficients)

````carousel
```python
MOD = 10**9 + 7

def mod_inverse(a, m=MOD):
    """Using Fermat's Little Theorem since MOD is prime."""
    return pow(a, m - 2, m)

def nCr(n, r, mod=MOD):
    """
    Compute binomial coefficient nCr mod prime.
    Time: O(r + log mod) per query
    """
    if r < 0 or r > n:
        return 0
    
    # nCr = n! / (r! * (n-r)!)
    numerator = 1
    for i in range(n, n - r, -1):
        numerator = (numerator * i) % mod
    
    denominator = 1
    for i in range(1, r + 1):
        denominator = (denominator * i) % mod
    
    return (numerator * mod_inverse(denominator, mod)) % mod


# Optimized: Precompute factorials and inverse factorials
class BinomialCoefficients:
    def __init__(self, max_n, mod=MOD):
        self.mod = mod
        self.fact = [1] * (max_n + 1)
        self.inv_fact = [1] * (max_n + 1)
        
        # Precompute factorials
        for i in range(2, max_n + 1):
            self.fact[i] = (self.fact[i-1] * i) % mod
        
        # Precompute inverse factorials
        self.inv_fact[max_n] = pow(self.fact[max_n], mod - 2, mod)
        for i in range(max_n - 1, -1, -1):
            self.inv_fact[i] = (self.inv_fact[i + 1] * (i + 1)) % mod
    
    def nCr(self, n, r):
        """Compute nCr in O(1) after preprocessing."""
        if r < 0 or r > n:
            return 0
        return (self.fact[n] * self.inv_fact[r] % self.mod * 
                self.inv_fact[n - r]) % self.mod
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

const int MOD = 1e9 + 7;

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

class BinomialCoefficients {
private:
    vector<long long> fact, invFact;
    int mod;
    
public:
    BinomialCoefficients(int maxN, int m = MOD) : mod(m) {
        fact.resize(maxN + 1);
        invFact.resize(maxN + 1);
        
        fact[0] = 1;
        for (int i = 1; i <= maxN; i++) {
            fact[i] = (fact[i-1] * i) % mod;
        }
        
        invFact[maxN] = power(fact[maxN], mod - 2, mod);
        for (int i = maxN - 1; i >= 0; i--) {
            invFact[i] = (invFact[i + 1] * (i + 1)) % mod;
        }
    }
    
    long long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return (fact[n] * invFact[r] % mod * invFact[n - r]) % mod;
    }
};
```

<!-- slide -->
```java
public class BinomialCoefficients {
    private long[] fact, invFact;
    private int mod;
    
    public BinomialCoefficients(int maxN, int mod) {
        this.mod = mod;
        this.fact = new long[maxN + 1];
        this.invFact = new long[maxN + 1];
        
        fact[0] = 1;
        for (int i = 1; i <= maxN; i++) {
            fact[i] = (fact[i-1] * i) % mod;
        }
        
        invFact[maxN] = power(fact[maxN], mod - 2);
        for (int i = maxN - 1; i >= 0; i--) {
            invFact[i] = (invFact[i + 1] * (i + 1)) % mod;
        }
    }
    
    private long power(long base, long exp) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    public long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return (fact[n] * invFact[r] % mod * invFact[n - r]) % mod;
    }
}
```

<!-- slide -->
```javascript
class BinomialCoefficients {
    constructor(maxN, mod) {
        this.mod = mod;
        this.fact = new Array(maxN + 1);
        this.invFact = new Array(maxN + 1);
        
        this.fact[0] = 1n;
        for (let i = 1; i <= maxN; i++) {
            this.fact[i] = (this.fact[i-1] * BigInt(i)) % BigInt(mod);
        }
        
        this.invFact[maxN] = this.power(this.fact[maxN], BigInt(mod - 2));
        for (let i = maxN - 1; i >= 0; i--) {
            this.invFact[i] = (this.invFact[i + 1] * BigInt(i + 1)) % BigInt(mod);
        }
    }
    
    power(base, exp) {
        let result = 1n;
        const mod = BigInt(this.mod);
        base %= mod;
        
        while (exp > 0n) {
            if (exp & 1n) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1n;
        }
        return result;
    }
    
    nCr(n, r) {
        if (r < 0 || r > n) return 0n;
        const mod = BigInt(this.mod);
        return (this.fact[n] * this.invFact[r] % mod * this.invFact[n - r]) % mod;
    }
}
```
````

### 3. Solving Linear Congruence

````carousel
```python
def solve_linear_congruence(a: int, b: int, m: int) -> int | None:
    """
    Solve ax ≡ b (mod m).
    Returns smallest non-negative solution or None if no solution.
    
    Time: O(log(min(a, m)))
    """
    from math import gcd
    
    g = gcd(a, m)
    if b % g != 0:
        return None  # No solution
    
    # Reduce to: (a/g)x ≡ (b/g) (mod m/g)
    a_reduced = a // g
    b_reduced = b // g
    m_reduced = m // g
    
    # Find inverse of a_reduced mod m_reduced
    def mod_inv(a, m):
        g, x, _ = extended_gcd(a % m, m)
        return (x % m + m) % m if g == 1 else None
    
    inv = mod_inv(a_reduced, m_reduced)
    if inv is None:
        return None
    
    x = (b_reduced * inv) % m_reduced
    return x


def solve_linear_congruence_all_solutions(a, b, m):
    """
    Returns all solutions to ax ≡ b (mod m).
    Returns list of solutions or empty list if no solution.
    """
    from math import gcd
    
    g = gcd(a, m)
    if b % g != 0:
        return []
    
    # Find one solution
    a_reduced, b_reduced, m_reduced = a // g, b // g, m // g
    
    def extended_gcd(a, b):
        if b == 0:
            return (a, 1, 0)
        g, x1, y1 = extended_gcd(b, a % b)
        return (g, y1, x1 - (a // b) * y1)
    
    _, x0, _ = extended_gcd(a_reduced, m_reduced)
    x0 = (x0 % m_reduced + m_reduced) % m_reduced
    x0 = (x0 * b_reduced) % m_reduced
    
    # All solutions: x = x0 + k * (m/g) for k = 0, 1, ..., g-1
    solutions = [(x0 + k * m_reduced) % m for k in range(g)]
    return sorted(solutions)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

// Extended GCD
tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) return {a, 1, 0};
    auto [g, x1, y1] = extendedGCD(b, a % b);
    return {g, y1, x1 - (a / b) * y1};
}

/**
 * Solve ax ≡ b (mod m)
 * Returns smallest non-negative solution, or -1 if no solution
 */
int solveLinearCongruence(int a, int b, int m) {
    int g = gcd(a, m);
    if (b % g != 0) return -1;
    
    int aRed = a / g, bRed = b / g, mRed = m / g;
    
    auto [g2, x, y] = extendedGCD(aRed, mRed);
    x = ((x % mRed) + mRed) % mRed;
    
    return (int)((1LL * x * bRed) % mRed);
}

/**
 * Find all solutions to ax ≡ b (mod m)
 */
vector<int> solveLinearCongruenceAll(int a, int b, int m) {
    int g = gcd(a, m);
    if (b % g != 0) return {};
    
    int aRed = a / g, bRed = b / g, mRed = m / g;
    
    auto [g2, x0, y] = extendedGCD(aRed, mRed);
    x0 = ((x0 % mRed) + mRed) % mRed;
    x0 = (int)((1LL * x0 * bRed) % mRed);
    
    vector<int> solutions;
    for (int k = 0; k < g; k++) {
        solutions.push_back((x0 + k * mRed) % m);
    }
    sort(solutions.begin(), solutions.end());
    return solutions;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LinearCongruence {
    
    static class Result {
        int gcd, x, y;
        Result(int g, int x, int y) { this.gcd = g; this.x = x; this.y = y; }
    }
    
    static Result extendedGCD(int a, int b) {
        if (b == 0) return new Result(a, 1, 0);
        Result next = extendedGCD(b, a % b);
        return new Result(next.gcd, next.y, next.x - (a / b) * next.y);
    }
    
    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    /**
     * Solve ax ≡ b (mod m)
     * Returns smallest solution or -1 if no solution
     */
    static int solve(int a, int b, int m) {
        int g = gcd(a, m);
        if (b % g != 0) return -1;
        
        int aRed = a / g, bRed = b / g, mRed = m / g;
        
        Result res = extendedGCD(aRed, mRed);
        int x = ((res.x % mRed) + mRed) % mRed;
        
        return (int)((1L * x * bRed) % mRed);
    }
    
    /**
     * Find all solutions
     */
    static List<Integer> solveAll(int a, int b, int m) {
        int g = gcd(a, m);
        List<Integer> sols = new ArrayList<>();
        
        if (b % g != 0) return sols;
        
        int aRed = a / g, bRed = b / g, mRed = m / g;
        
        Result res = extendedGCD(aRed, mRed);
        int x0 = ((res.x % mRed) + mRed) % mRed;
        x0 = (int)((1L * x0 * bRed) % mRed);
        
        for (int k = 0; k < g; k++) {
            sols.add((x0 + k * mRed) % m);
        }
        Collections.sort(sols);
        return sols;
    }
}
```

<!-- slide -->
```javascript
/**
 * Extended GCD
 */
function extendedGCD(a, b) {
    if (b === 0) return [a, 1, 0];
    const [g, x1, y1] = extendedGCD(b, a % b);
    return [g, y1, x1 - Math.floor(a / b) * y1];
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Solve ax ≡ b (mod m)
 * Returns smallest solution or null if no solution
 */
function solveLinearCongruence(a, b, m) {
    const g = gcd(a, m);
    if (b % g !== 0) return null;
    
    const aRed = a / g, bRed = b / g, mRed = m / g;
    
    const [g2, x, y] = extendedGCD(aRed, mRed);
    const xNorm = ((x % mRed) + mRed) % mRed;
    
    return (xNorm * bRed) % mRed;
}

/**
 * Find all solutions
 */
function solveLinearCongruenceAll(a, b, m) {
    const g = gcd(a, m);
    if (b % g !== 0) return [];
    
    const aRed = a / g, bRed = b / g, mRed = m / g;
    
    const [g2, x0, y] = extendedGCD(aRed, mRed);
    let x0Norm = ((x0 % mRed) + mRed) % mRed;
    x0Norm = (x0Norm * bRed) % mRed;
    
    const solutions = [];
    for (let k = 0; k < g; k++) {
        solutions.push((x0Norm + k * mRed) % m);
    }
    return solutions.sort((a, b) => a - b);
}
```
````

---

## Practice Problems

### Problem 1: Calculate Division Under Modulo

**Problem**: [LeetCode 1912 - Design Movie Rental System](https://leetcode.com/problems/design-movie-rental-system/)

**Description**: Design a movie rental system with operations to search, rent, drop, and report rented movies. While not directly about modular inverse, understanding modular arithmetic is crucial for the underlying data structure design.

**How to Apply**: Use modular arithmetic principles for hashing and ID generation.

---

### Problem 2: Count Ways to Make Array With Product

**Problem**: [LeetCode 1735 - Count Ways to Make Array With Product](https://leetcode.com/problems/count-ways-to-make-array-with-product/)

**Description**: You are given a 2D integer array, `queries`. For each `queries[i]`, where `queries[i] = [ni, ki]`, find the number of different ways you can place positive integers into an array of size `ni` such that the product of the integers is `ki`.

**How to Apply Modular Inverse**:
- Use prime factorization of `ki`
- Apply stars and bars counting with modular division
- Use modular inverse for dividing by factorials

---

### Problem 3: Number of Ways to Reorder Array to Get Same BST

**Problem**: [LeetCode 1569 - Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/)

**Description**: Given an array `nums` that represents a permutation of integers from `1` to `n`, return the number of ways to reorder `nums` such that the resulting BST is identical to the BST formed by the original array.

**How to Apply Modular Inverse**:
- Use Catalan numbers and binomial coefficients
- Calculate combinations nCr using modular inverses
- Precompute factorials and inverse factorials

---

### Problem 4: Ways to Make a Fair Array

**Problem**: [LeetCode 1664 - Ways to Make a Fair Array](https://leetcode.com/problems/ways-to-make-a-fair-array/)

**Description**: You are given an integer array `nums`. You can choose exactly one index and remove the element at that index. Return the number of indices that, if removed, would make the sum of the even-indexed values equal to the sum of the odd-indexed values.

**How to Apply**: While this problem doesn't directly use modular inverse, it builds the foundation for understanding array manipulation with modular constraints.

---

### Problem 5: Factorial Trailing Zeroes

**Problem**: [LeetCode 172 - Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/)

**Description**: Given an integer `n`, return the number of trailing zeroes in `n!`.

**How to Apply Modular Inverse (Advanced)**:
- Understand prime factorization which is key to modular inverse calculations
- Extend to compute n! mod p efficiently using Wilson's theorem
- Use modular inverse for computing combinations in modular space

---

## Video Tutorial Links

### Fundamentals

- [Modular Multiplicative Inverse (Extended Euclidean Algorithm)](https://www.youtube.com/watch?v=shaQZg8bqUM) - Detailed explanation of Extended Euclidean method
- [Modular Inverse using Fermat's Little Theorem](https://www.youtube.com/watch?v=2rU8i2EGG1U) - Fast method for prime moduli
- [Competitive Programming - Modular Arithmetic](https://www.youtube.com/watch?v=9fTb8NKB9a8) - Practical guide for CP

### Advanced Topics

- [Binary Exponentiation for Modular Inverse](https://www.youtube.com/watch?v=nO7_quN7UhU) - Fast exponentiation techniques
- [Precomputing Modular Inverses](https://www.youtube.com/watch?v=YKrdmHjHMSM) - O(n) method for multiple inverses
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=XPNm5NF8WjA) - Comprehensive coverage

---

## Follow-up Questions

### Q1: Why does Fermat's Little Theorem only work for prime moduli?

**Answer**: Fermat's theorem states `a^(p-1) ≡ 1 (mod p)` for prime `p` because the multiplicative group modulo a prime has order `p-1`. For composite `m`, we use Euler's theorem: `a^φ(m) ≡ 1 (mod m)`. The general formula `a^(-1) ≡ a^(φ(m)-1) (mod m)` works when `gcd(a, m) = 1`, but computing `φ(m)` requires factorization, which is expensive (O(√m)). Extended Euclidean is preferred for composite moduli.

---

### Q2: What if I need to compute inverse of 0?

**Answer**: 0 has no modular inverse. By definition, we'd need `0 × x ≡ 1 (mod m)`, which is impossible since `0 × x = 0` for all `x`. In code, always check if `a % m == 0` before computing the inverse.

---

### Q3: Can I use modular inverse for non-prime moduli?

**Answer**: Yes, using the Extended Euclidean Algorithm. Fermat's method only works for primes, but Extended Euclidean works for any modulus as long as `gcd(a, m) = 1`. This is why Extended Euclidean is the general-purpose solution.

---

### Q4: Why is modular inverse important for nCr?

**Answer**: `nCr = n! / (r!(n-r)!)`. In modular arithmetic, division becomes multiplication by the modular inverse. So: `nCr mod m = n! × (r!)^(-1) × ((n-r)!)^(-1) mod m`. Without modular inverses, we couldn't compute combinations under modulo.

---

### Q5: Which method should I use in competitive programming?

**Answer**: 
- **For prime modulus (10⁹+7, 998244353)**: Use Fermat's with `pow(a, m-2, m)` - fastest and simplest
- **For unknown/composite modulus**: Use Extended Euclidean - always works when inverse exists
- **For many queries on same modulus**: Precompute all inverses in O(n) then answer in O(1)
- **For nCr calculations**: Precompute factorials and inverse factorials for O(1) per query

---

## Summary

The modular inverse is a fundamental operation in modular arithmetic that enables "division" under a modulus. Key takeaways:

- **Exists only when** `gcd(a, m) = 1` - always check this condition
- **Extended Euclidean** works for any valid case, O(log(min(a, m)))
- **Fermat's Little Theorem** is faster (O(log m)) but requires prime modulus
- **Essential for** combinations, linear congruences, and cryptography
- **Precomputation** can answer multiple inverse queries in O(1) after O(n) preprocessing

### When to Use Each Method

| Scenario | Recommended Method |
|----------|-------------------|
| Single inverse, prime modulus | Fermat's Little Theorem |
| Single inverse, composite modulus | Extended Euclidean |
| Multiple inverses (1 to n) | Precomputation O(n) |
| nCr calculations | Precompute fact + inv_fact |
| Linear congruences | Extended Euclidean |

This algorithm is essential for competitive programming and technical interviews, especially in problems involving counting under modulo constraints.

---

## Related Algorithms

- [Extended Euclidean](./extended-euclidean.md) - Foundation for modular inverse
- [Binomial Coefficients](./ncr-binomial.md) - Uses modular inverse extensively
- [Modular Exponentiation](./modular-exponentiation.md) - Used in Fermat's method
- [Chinese Remainder Theorem](./chinese-remainder.md) - Uses modular inverses for combining congruences