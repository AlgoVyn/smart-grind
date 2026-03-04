# Extended Euclidean Algorithm

## Category
Math & Number Theory

## Description

The Extended Euclidean Algorithm is an extension to the Euclidean Algorithm that not only finds the **Greatest Common Divisor (GCD)** of two integers `a` and `b`, but also finds the **Bézout coefficients** `x` and `y` such that:

```
ax + by = gcd(a, b)
```

This algorithm is fundamental in number theory and has critical applications in cryptography, modular arithmetic, and solving linear Diophantine equations.

---

## When to Use

Use the Extended Euclidean Algorithm when you need to:

- **Find Modular Inverse**: Compute `a^(-1) mod m` when `gcd(a, m) = 1`
- **Solve Linear Diophantine Equations**: Find integer solutions to `ax + by = c`
- **Compute Bézout Coefficients**: Express GCD as a linear combination
- **Cryptographic Applications**: RSA, elliptic curve cryptography

### Comparison with Standard GCD

| Algorithm | GCD Only | Bézout Coefficients | Modular Inverse | Diophantine Solutions |
|-----------|----------|---------------------|-----------------|----------------------|
| **Standard Euclidean** | ✅ | ❌ | ❌ | ❌ |
| **Extended Euclidean** | ✅ | ✅ | ✅ | ✅ |

### Key Insight

While the standard Euclidean algorithm only gives `gcd(a, b)`, the extended version also provides the coefficients that express this GCD as a linear combination of `a` and `b`.

---

## Algorithm Explanation

### Mathematical Foundation

**Bézout's Identity**: For any integers `a` and `b`, there exist integers `x` and `y` such that:
```
ax + by = gcd(a, b)
```

### How It Works

The algorithm works backwards through the Euclidean algorithm steps. If we know:
```
gcd(a, b) = gcd(b, a mod b)
```

And we have coefficients for the recursive call:
```
b·x₁ + (a mod b)·y₁ = gcd(a, b)
```

We can substitute `a mod b = a - ⌊a/b⌋·b` to get:
```
a·y₁ + b·(x₁ - ⌊a/b⌋·y₁) = gcd(a, b)
```

Therefore:
- `x = y₁`
- `y = x₁ - ⌊a/b⌋·y₁`

### Visual Walkthrough

For `a = 30, b = 12`:

```
Step 1: 30 = 2 × 12 + 6     → gcd(30, 12) = gcd(12, 6)
Step 2: 12 = 2 × 6 + 0      → gcd = 6

Working backwards:
From Step 1: 6 = 30 - 2 × 12

So: 30 × (1) + 12 × (-2) = 6
    ↑x              ↑y      ↑gcd
```

---

## Algorithm Steps

1. **Base Case**: If `b = 0`, return `(a, 1, 0)` since `a·1 + 0·0 = a = gcd(a, 0)`
2. **Recursive Step**: Compute `(g, x₁, y₁) = extended_gcd(b, a mod b)`
3. **Back Substitution**:
   - `x = y₁`
   - `y = x₁ - ⌊a/b⌋ × y₁`
4. **Return**: `(g, x, y)` where `g = gcd(a, b)` and `ax + by = g`

---

## Implementation

### Template Code

````carousel
```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    
    Returns (g, x, y) such that ax + by = g = gcd(a, b)
    
    Args:
        a: First integer
        b: Second integer
        
    Returns:
        Tuple of (gcd, x_coefficient, y_coefficient)
        
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(log(min(a, b))) for recursion stack
    """
    if b == 0:
        return (a, 1, 0)
    
    # Recursive call
    g, x1, y1 = extended_gcd(b, a % b)
    
    # Back substitution
    x = y1
    y = x1 - (a // b) * y1
    
    return (g, x, y)


def iterative_extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Iterative version of Extended Euclidean Algorithm.
    
    More space efficient than recursive version.
    
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(1)
    """
    x0, x1 = 1, 0
    y0, y1 = 0, 1
    
    while b != 0:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    
    return (a, x0, y0)


# Example usage
if __name__ == "__main__":
    a, b = 30, 12
    g, x, y = extended_gcd(a, b)
    print(f"gcd({a}, {b}) = {g}")
    print(f"{a} × {x} + {b} × {y} = {a * x + b * y}")
    
    # Verify
    assert a * x + b * y == g
    print("✓ Bézout identity verified!")
```

<!-- slide -->
```cpp
#include <iostream>
#include <tuple>
using namespace std;

/**
 * Extended Euclidean Algorithm
 * 
 * Returns tuple of (gcd, x, y) such that ax + by = gcd(a, b)
 * 
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(log(min(a, b)))
 */
tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) {
        return {a, 1, 0};
    }
    
    auto [g, x1, y1] = extendedGCD(b, a % b);
    
    int x = y1;
    int y = x1 - (a / b) * y1;
    
    return {g, x, y};
}

/**
 * Iterative version
 * Space Complexity: O(1)
 */
tuple<int, int, int> extendedGCDIterative(int a, int b) {
    int x0 = 1, x1 = 0;
    int y0 = 0, y1 = 1;
    
    while (b != 0) {
        int q = a / b;
        tie(a, b) = make_pair(b, a - q * b);
        tie(x0, x1) = make_pair(x1, x0 - q * x1);
        tie(y0, y1) = make_pair(y1, y0 - q * y1);
    }
    
    return {a, x0, y0};
}

int main() {
    int a = 30, b = 12;
    auto [g, x, y] = extendedGCD(a, b);
    
    cout << "gcd(" << a << ", " << b << ") = " << g << endl;
    cout << a << " × " << x << " + " << b << " × " << y << " = " << a*x + b*y << endl;
    
    return 0;
}
```

<!-- slide -->
```java
public class ExtendedEuclidean {
    
    /**
     * Result class to hold GCD and coefficients
     */
    public static class Result {
        public int gcd, x, y;
        
        public Result(int gcd, int x, int y) {
            this.gcd = gcd;
            this.x = x;
            this.y = y;
        }
        
        @Override
        public String toString() {
            return String.format("gcd=%d, x=%d, y=%d", gcd, x, y);
        }
    }
    
    /**
     * Extended Euclidean Algorithm
     * Returns (gcd, x, y) such that ax + by = gcd(a, b)
     * 
     * Time: O(log(min(a, b)))
     * Space: O(log(min(a, b)))
     */
    public static Result extendedGCD(int a, int b) {
        if (b == 0) {
            return new Result(a, 1, 0);
        }
        
        Result next = extendedGCD(b, a % b);
        
        int x = next.y;
        int y = next.x - (a / b) * next.y;
        
        return new Result(next.gcd, x, y);
    }
    
    /**
     * Iterative version
     * Space: O(1)
     */
    public static Result extendedGCDIterative(int a, int b) {
        int x0 = 1, x1 = 0;
        int y0 = 0, y1 = 1;
        
        while (b != 0) {
            int q = a / b;
            int tempA = a;
            a = b;
            b = tempA - q * b;
            
            int tempX = x0;
            x0 = x1;
            x1 = tempX - q * x1;
            
            int tempY = y0;
            y0 = y1;
            y1 = tempY - q * y1;
        }
        
        return new Result(a, x0, y0);
    }
    
    public static void main(String[] args) {
        int a = 30, b = 12;
        Result result = extendedGCD(a, b);
        
        System.out.println(result);
        System.out.printf("%d × %d + %d × %d = %d%n", 
            a, result.x, b, result.y, a * result.x + b * result.y);
    }
}
```

<!-- slide -->
```javascript
/**
 * Extended Euclidean Algorithm
 * 
 * @param {number} a - First integer
 * @param {number} b - Second integer
 * @returns {[number, number, number]} - [gcd, x, y] where ax + by = gcd
 * 
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(log(min(a, b)))
 */
function extendedGCD(a, b) {
    if (b === 0) {
        return [a, 1, 0];
    }
    
    const [g, x1, y1] = extendedGCD(b, a % b);
    
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;
    
    return [g, x, y];
}

/**
 * Iterative version
 * Space Complexity: O(1)
 */
function extendedGCDIterative(a, b) {
    let x0 = 1, x1 = 0;
    let y0 = 0, y1 = 1;
    
    while (b !== 0) {
        const q = Math.floor(a / b);
        [a, b] = [b, a - q * b];
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }
    
    return [a, x0, y0];
}

// Example usage
const a = 30, b = 12;
const [g, x, y] = extendedGCD(a, b);
console.log(`gcd(${a}, ${b}) = ${g}`);
console.log(`${a} × ${x} + ${b} × ${y} = ${a * x + b * y}`);
```
````

---

## Common Applications

### 1. Finding Modular Inverse

When `gcd(a, m) = 1`, the modular inverse of `a` modulo `m` exists:

````carousel
```python
def mod_inverse(a: int, m: int) -> int | None:
    """
    Returns modular inverse of a under modulo m.
    Returns None if inverse doesn't exist.
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Inverse doesn't exist
    return (x % m + m) % m  # Ensure positive result

# Example: inverse of 3 mod 11
# 3 × 4 = 12 ≡ 1 (mod 11)
print(mod_inverse(3, 11))  # Output: 4

# Example: inverse of 7 mod 26 (for Caesar cipher)
# 7 × 15 = 105 ≡ 1 (mod 26)
print(mod_inverse(7, 26))  # Output: 15
```

<!-- slide -->
```cpp
#include <iostream>
#include <tuple>
using namespace std;

/**
 * Extended Euclidean Algorithm
 */
tuple<int, int, int> extendedGCD(int a, int b);

/**
 * Find modular inverse of a modulo m
 * Returns -1 if inverse doesn't exist
 */
int modInverse(int a, int m) {
    auto [g, x, y] = extendedGCD(a % m, m);
    if (g != 1) return -1;  // Inverse doesn't exist
    return (x % m + m) % m;  // Ensure positive result
}

int main() {
    cout << "modInverse(3, 11) = " << modInverse(3, 11) << endl;  // Output: 4
    cout << "modInverse(7, 26) = " << modInverse(7, 26) << endl;  // Output: 15
    return 0;
}
```

<!-- slide -->
```java
public class ModularInverse {
    
    public static class Result {
        public int gcd, x, y;
        public Result(int gcd, int x, int y) {
            this.gcd = gcd;
            this.x = x;
            this.y = y;
        }
    }
    
    public static Result extendedGCD(int a, int b) {
        if (b == 0) return new Result(a, 1, 0);
        Result next = extendedGCD(b, a % b);
        int x = next.y;
        int y = next.x - (a / b) * next.y;
        return new Result(next.gcd, x, y);
    }
    
    public static Integer modInverse(int a, int m) {
        Result r = extendedGCD(a % m, m);
        if (r.gcd != 1) return null;  // Inverse doesn't exist
        return (r.x % m + m) % m;  // Ensure positive result
    }
    
    public static void main(String[] args) {
        System.out.println("modInverse(3, 11) = " + modInverse(3, 11));  // Output: 4
        System.out.println("modInverse(7, 26) = " + modInverse(7, 26));  // Output: 15
    }
}
```

<!-- slide -->
```javascript
/**
 * Find modular inverse of a modulo m
 * Returns null if inverse doesn't exist
 */
function modInverse(a, m) {
    const [g, x, y] = extendedGCD(a % m, m);
    if (g !== 1) return null;  // Inverse doesn't exist
    return (x % m + m) % m;  // Ensure positive result
}

// Example: inverse of 3 mod 11
console.log(`modInverse(3, 11) = ${modInverse(3, 11)}`);  // Output: 4

// Example: inverse of 7 mod 26
console.log(`modInverse(7, 26) = ${modInverse(7, 26)}`);  // Output: 15
```
````

### 2. Solving Linear Diophantine Equations

For equation `ax + by = c`:

````carousel
```python
def solve_diophantine(a: int, b: int, c: int) -> tuple[int, int] | None:
    """
    Finds one solution to ax + by = c.
    Returns (x, y) or None if no solution exists.
    
    All solutions: x = x0 + (b/g)*t, y = y0 - (a/g)*t for any integer t
    """
    g, x0, y0 = extended_gcd(abs(a), abs(b))
    
    if c % g != 0:
        return None  # No solution exists
    
    # Scale the solution
    x0 *= c // g
    y0 *= c // g
    
    # Adjust signs based on original a, b
    if a < 0: x0 = -x0
    if b < 0: y0 = -y0
    
    return (x0, y0)

def all_solutions(a: int, b: int, c: int, x0: int, y0: int, g: int):
    """Generate all solutions to ax + by = c."""
    t = 0
    while True:
        x = x0 + (b // g) * t
        y = y0 - (a // g) * t
        yield (x, y)
        t += 1

# Example: 2x + 3y = 5
# Solutions: x = -4 + 3t, y = 3 - 2t
sol = solve_diophantine(2, 3, 5)
print(f"Solution: {sol}")  # Output: (2, 1) because 2*2 + 3*1 = 7 ≠ 5...
# Let's try 2x + 3y = 5 -> x = 1, y = 1: 2*1 + 3*1 = 5 ✓
```

<!-- slide -->
```cpp
#include <iostream>
#include <tuple>
#include <optional>
using namespace std;

tuple<int, int, int> extendedGCD(int a, int b);

/**
 * Solve linear Diophantine equation ax + by = c
 * Returns {x, y} or nullopt if no solution exists
 */
optional<pair<int, int>> solveDiophantine(int a, int b, int c) {
    int g, x0, y0;
    tie(g, x0, y0) = extendedGCD(abs(a), abs(b));
    
    if (c % g != 0) return nullopt;  // No solution exists
    
    // Scale the solution
    x0 *= c / g;
    y0 *= c / g;
    
    // Adjust signs
    if (a < 0) x0 = -x0;
    if (b < 0) y0 = -y0;
    
    return make_pair(x0, y0);
}

int main() {
    auto sol = solveDiophantine(2, 3, 5);
    if (sol) {
        cout << "Solution: x=" << sol->first << ", y=" << sol->second << endl;
    }
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

public class DiophantineEquation {
    
    public static class Result {
        public int gcd, x, y;
        public Result(int gcd, int x, int y) {
            this.gcd = gcd;
            this.x = x;
            this.y = y;
        }
    }
    
    public static Result extendedGCD(int a, int b) {
        if (b == 0) return new Result(a, 1, 0);
        Result next = extendedGCD(b, a % b);
        return new Result(next.gcd, next.y, next.x - (a / b) * next.y);
    }
    
    public static int[] solveDiophantine(int a, int b, int c) {
        Result r = extendedGCD(Math.abs(a), Math.abs(b));
        
        if (c % r.gcd != 0) return null;  // No solution
        
        int x0 = r.x * (c / r.gcd);
        int y0 = r.y * (c / r.gcd);
        
        if (a < 0) x0 = -x0;
        if (b < 0) y0 = -y0;
        
        return new int[]{x0, y0};
    }
    
    public static void main(String[] args) {
        int[] sol = solveDiophantine(2, 3, 5);
        if (sol != null) {
            System.out.printf("Solution: x=%d, y=%d%n", sol[0], sol[1]);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve linear Diophantine equation ax + by = c
 * Returns [x, y] or null if no solution exists
 */
function solveDiophantine(a, b, c) {
    const [g, x0, y0] = extendedGCD(Math.abs(a), Math.abs(b));
    
    if (c % g !== 0) return null;  // No solution exists
    
    // Scale the solution
    x0 *= c / g;
    y0 *= c / g;
    
    // Adjust signs
    if (a < 0) x0 = -x0;
    if (b < 0) y0 = -y0;
    
    return [x0, y0];
}

// Example: 2x + 3y = 5
const sol = solveDiophantine(2, 3, 5);
console.log(`Solution: x=${sol[0]}, y=${sol[1]}`);  // Output: x=1, y=1
```
````

### 3. Extended GCD for Cryptography (RSA)

The Extended Euclidean Algorithm is crucial in RSA encryption:

````carousel
```python
def rsa_key_generation(p: int, q: int, e: int = 65537) -> tuple:
    """
    Simplified RSA key generation using Extended GCD.
    
    Args:
        p, q: Two prime numbers
        e: Public exponent (commonly 65537)
    
    Returns:
        (n, d): Public modulus n and private exponent d
    """
    n = p * q
    phi = (p - 1) * (q - 1)
    
    # Find private exponent d such that e*d ≡ 1 (mod phi)
    # This is the modular inverse of e modulo phi
    g, d, _ = extended_gcd(e, phi)
    
    if g != 1:
        raise ValueError("Invalid e value - must be coprime to phi")
    
    d = d % phi
    if d < 0:
        d += phi
    
    return n, d

# Example: Generate RSA keys for small primes
p, q = 61, 53  # Example primes
n, d = rsa_key_generation(p, q)
print(f"Public modulus n = p*q = {n}")
print(f"Private exponent d = {d}")
print(f"Verification: 65537 * {d} mod {(p-1)*(q-1)} = {(65537 * d) % ((p-1)*(q-1))}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <tuple>
using namespace std;

tuple<int, int, int> extendedGCD(int a, int b);

pair<long long, long long> rsaKeyGeneration(int p, int q, int e = 65537) {
    long long n = (long long)p * q;
    long long phi = (long long)(p - 1) * (q - 1);
    
    int g, d, tmp;
    tie(g, d, tmp) = extendedGCD(e, (int)phi);
    
    if (g != 1) throw invalid_argument("Invalid e value");
    
    d = ((d % phi) + phi) % phi;
    
    return {n, d};
}

int main() {
    int p = 61, q = 53;
    auto [n, d] = rsaKeyGeneration(p, q);
    cout << "Public modulus n = " << n << endl;
    cout << "Private exponent d = " << d << endl;
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

public class RSAKeyGeneration {
    
    public static class Result {
        public int gcd, x, y;
        public Result(int gcd, int x, int y) {
            this.gcd = gcd;
            this.x = x;
            this.y = y;
        }
    }
    
    public static Result extendedGCD(int a, int b) {
        if (b == 0) return new Result(a, 1, 0);
        Result next = extendedGCD(b, a % b);
        return new Result(next.gcd, next.y, next.x - (a / b) * next.y);
    }
    
    public static long[] rsaKeyGeneration(int p, int q, int e) {
        long n = (long)p * q;
        long phi = (long)(p - 1) * (q - 1);
        
        Result r = extendedGCD(e, (int)phi);
        
        if (r.gcd != 1) throw new IllegalArgumentException("Invalid e value");
        
        long d = ((r.x % phi) + phi) % phi;
        
        return new long[]{n, d};
    }
    
    public static void main(String[] args) {
        long[] keys = rsaKeyGeneration(61, 53, 65537);
        System.out.println("Public modulus n = " + keys[0]);
        System.out.println("Private exponent d = " + keys[1]);
    }
}
```

<!-- slide -->
```javascript
/**
 * Simplified RSA key generation using Extended GCD
 */
function rsaKeyGeneration(p, q, e = 65537) {
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Find d such that e*d ≡ 1 (mod phi)
    const [g, d] = extendedGCD(e, phi);
    
    if (g !== 1) throw new Error("Invalid e value - must be coprime to phi");
    
    const privateExponent = (d % phi + phi) % phi;
    
    return { publicModulus: n, privateExponent };
}

// Example
const { publicModulus: n, privateExponent: d } = rsaKeyGeneration(61, 53);
console.log(`Public modulus n = ${n}`);
console.log(`Private exponent d = ${d}`);
```
````

---

## Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| **Time** | O(log(min(a, b))) | Same as Euclidean algorithm |
| **Space (Recursive)** | O(log(min(a, b))) | Recursion stack depth |
| **Space (Iterative)** | O(1) | Constant extra space |

---

## Practice Problems

### Problem 1: Check if Good Array
**Problem**: [LeetCode 1250 - Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)

**Description**: An array is "good" if GCD of all elements is 1. Use Extended GCD to verify.

**How to Apply Extended Euclidean Algorithm**:
- Compute pairwise GCD of all elements using extended Euclidean algorithm
- If the overall GCD is 1, the array is good
- The extended version helps understand if elements can combine to form 1

---

### Problem 2: Pour Water Between Buckets
**Problem**: [LeetCode 1359 - Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) (related concept)

**Description**: Given two buckets of sizes m and n, can you measure exactly d liters? This is a classic application known as the "Water Jug Problem".

**How to Apply Extended Euclidean Algorithm**:
- Possible iff d is a multiple of gcd(m, n) and d ≤ max(m, n)
- Use extended GCD to find the coefficients that show this relationship
- Solution exists when gcd(m, n) divides d

---

### Problem 3: Linear Combination
**Problem**: [LeetCode 1250 - Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)

**Description**: Find if target can be formed as a linear combination of given numbers.

**How to Apply Extended Euclidean Algorithm**:
- Use Extended GCD to find coefficients for the linear combination
- Check if target is achievable by the GCD relationship
- Extended algorithm provides the exact coefficients needed

---

### Problem 4: Modular Inverse
**Problem**: [LeetCode 1585B - Check if String Is Transformable With Substring Sort Operations](https://leetcode.com/problems/check-if-string-is-transformable-with-substring-sort-operations/) (related concept)

**Description**: Compute modular inverse for cryptographic applications.

**How to Apply Extended Euclidean Algorithm**:
- The extended GCD directly gives us the coefficients to compute modular inverse
- If gcd(a, m) = 1, the coefficient of a gives us a^(-1) mod m
- Essential for RSA and many cryptographic protocols

---

### Problem 5: Chinese Remainder Theorem
**Problem**: [LeetCode 1235 - Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) (related concept)

**Description**: Solve systems of congruences using the Chinese Remainder Theorem.

**How to Apply Extended Euclidean Algorithm**:
- CRT requires computing modular inverses
- Extended Euclidean Algorithm provides these inverses efficiently
- Used in many competitive programming problems involving modular systems

---

## Video Tutorial Links

### Fundamentals

- [Extended Euclidean Algorithm (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction
- [Extended Euclidean Algorithm Implementation (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation with visualizations
- [Modular Inverse using Extended GCD (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Practical implementation guide

### Advanced Topics

- [Bézout's Identity Explained](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Theoretical foundation
- [RSA Cryptography - Extended Euclidean](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - Cryptographic applications
- [Chinese Remainder Theorem](https://www.youtube.com/watch?v=3aVPh70xT3M) - CRT with extended GCD

---

## Follow-up Questions

### Q1: Why do we need the Extended version? Can't we just use regular GCD?

**Answer**: Regular GCD only gives the greatest common divisor. The Extended version provides the Bézout coefficients, which are essential for:
- Modular inverses (needed in cryptography and competitive programming)
- Solving linear Diophantine equations
- Proving theoretical results in number theory

### Q2: What happens when gcd(a, b) ≠ 1? Can we still find a modular inverse?

**Answer**: No. The modular inverse of `a` modulo `m` exists **if and only if** `gcd(a, m) = 1`. When they share a common factor, no integer `x` satisfies `ax ≡ 1 (mod m)`.

### Q3: Can the coefficients x and y be negative?

**Answer**: Yes! The Bézout coefficients can be negative. The algorithm guarantees `ax + by = gcd(a, b)`, but `x` and `y` can be any integers (positive, negative, or zero) that satisfy this equation.

### Q4: Are the Bézout coefficients unique?

**Answer**: No. If `(x, y)` is one solution, then for any integer `t`:
- `x' = x + (b/gcd)·t`
- `y' = y - (a/gcd)·t`

is also a solution. There are infinitely many solutions.

---

## Summary

The Extended Euclidean Algorithm is a powerful tool that extends the basic GCD computation to find the Bézout coefficients. It's essential for:

- **Modular arithmetic**: Computing inverses for division under modulo
- **Cryptography**: RSA and other public-key systems
- **Number theory**: Solving Diophantine equations
- **Competitive programming**: Many problems reduce to finding these coefficients

**Key Takeaway**: When you need more than just the GCD—when you need to express that GCD as a linear combination—use the Extended Euclidean Algorithm.

---

## Related Algorithms

- [GCD (Euclidean)](./gcd-euclidean.md) - Basic GCD computation
- [Modular Inverse](./modular-inverse.md) - Application of Extended GCD
- [Chinese Remainder Theorem](./chinese-remainder.md) - Uses modular inverses