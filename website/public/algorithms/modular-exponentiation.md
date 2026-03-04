# Modular Exponentiation

## Category
Math & Number Theory

## Description

Modular Exponentiation (also known as **Binary Exponentiation** or **Fast Exponentiation**) is an efficient algorithm to compute `(base^exp) % mod` in **O(log exp)** time complexity. This is essential in cryptography, competitive programming, and mathematical applications where dealing with extremely large numbers is necessary.

The algorithm leverages the binary representation of the exponent to break down the computation into a series of squaring operations, dramatically reducing the number of multiplications needed from O(exp) to O(log exp).

---

## When to Use

Use Modular Exponentiation when you need to solve problems involving:

- **Large Power Computations**: Computing `a^b mod m` where `b` is very large (up to 10^18 or more)
- **Cryptographic Applications**: RSA encryption, Diffie-Hellman key exchange, modular inverse calculations
- **Number Theory Problems**: Fermat's Little Theorem applications, computing modular inverses
- **Combinatorics**: Computing nCr mod p, factorial mod p for large n
- **Matrix Exponentiation**: Fast computation of matrix powers for linear recurrences
- **Cycle Detection**: Problems involving repeated modular operations

### Comparison with Alternatives

| Method | Time Complexity | Space Complexity | Use Case |
|--------|-----------------|------------------|----------|
| **Naive Multiplication** | O(exp) | O(1) | Only for very small exponents |
| **Binary Exponentiation** | O(log exp) | O(1) iterative, O(log exp) recursive | Standard approach for large exponents |
| **Precomputation** | O(√exp) preprocessing, O(1) query | O(√exp) | When same base, multiple queries |
| **Euler's Theorem** | O(log exp) with reduction | O(1) | When base and mod are coprime |

### When to Choose Which Approach

- **Choose Binary Exponentiation** when:
  - You need to compute single or few power operations
  - The exponent is large (up to 10^18)
  - Memory is constrained

- **Choose Precomputation** when:
  - You have many queries with the same base
  - Query time is more critical than preprocessing time

- **Apply Euler's Theorem** when:
  - `base` and `mod` are coprime
  - You can reduce `exp` to `exp % φ(mod)` for faster computation

---

## Algorithm Explanation

### Core Concept

The key insight behind Modular Exponentiation is that we can break down the exponent using its **binary representation**:

```
exp = b_k × 2^k + b_{k-1} × 2^{k-1} + ... + b_1 × 2^1 + b_0 × 2^0
```

Where each `b_i` is either 0 or 1 (the binary digits).

Therefore:
```
base^exp = base^(b_k × 2^k) × base^(b_{k-1} × 2^{k-1}) × ... × base^(b_0 × 2^0)
```

This means we only need to compute powers of the form `base^(2^i)` and multiply the relevant ones together.

### Why Do We Need Modular Exponentiation?

1. **Integer Overflow**: Direct computation of `base^exp` can overflow even 64-bit integers for moderate exponents
   - Example: `2^100` has 31 digits, far exceeding 64-bit integer capacity
   
2. **Computational Efficiency**: Naive approach requires `exp` multiplications
   - Binary exponentiation requires only `log₂(exp)` multiplications
   - For `exp = 10^9`: naive needs 10^9 ops, binary needs only 30 ops!

3. **Cryptographic Security**: Modern cryptography relies on computing large powers modulo large primes efficiently

### How Binary Exponentiation Works

#### Mathematical Foundation

The algorithm is based on two key observations:

1. **If exp is even**: `base^exp = (base^2)^(exp/2)`
   - We square the base and halve the exponent
   
2. **If exp is odd**: `base^exp = base × base^(exp-1)`
   - We multiply the result by base and decrement the exponent

#### Visual Representation

Computing `3^13 mod 100`:

```
Binary representation of 13: 1101₂ = 8 + 4 + 1

3^13 = 3^8 × 3^4 × 3^1

Step-by-step building:
  3^1 = 3                      (use: yes, bit 0 is 1)
  3^2 = 9                      (use: no,  bit 1 is 0)
  3^4 = 81                     (use: yes, bit 2 is 1)
  3^8 = 6561 ≡ 61 (mod 100)   (use: yes, bit 3 is 1)

Result: 3 × 81 × 61 = 14823 ≡ 23 (mod 100)
```

### Algorithm Steps (Iterative)

1. **Initialize**: `result = 1`, `base = base % mod`
2. **While exp > 0**:
   - If `exp` is **odd**: `result = (result × base) % mod`
   - `base = (base × base) % mod` (square the base)
   - `exp = exp // 2` (halve the exponent)
3. **Return** `result`

### ASCII Visualization of the Process

Computing `2^10 mod 1000`:

```
Initial: result = 1, base = 2, exp = 10 (binary: 1010)

Iteration 1: exp = 10 (1010₂)
  exp is even: skip result update
  base = 2² mod 1000 = 4
  exp = 5
  
Iteration 2: exp = 5 (101₂)
  exp is odd: result = 1 × 4 = 4
  base = 4² mod 1000 = 16
  exp = 2
  
Iteration 3: exp = 2 (10₂)
  exp is even: skip result update
  base = 16² mod 1000 = 256
  exp = 1
  
Iteration 4: exp = 1 (1₂)
  exp is odd: result = 4 × 256 = 1024 mod 1000 = 24
  base = 256² mod 1000 = ...
  exp = 0

Final result: 24 ✓
```

### Modular Arithmetic Properties Used

1. **(a × b) mod m = ((a mod m) × (b mod m)) mod m**
2. **(a^b) mod m = ((a mod m)^b) mod m**

These properties allow us to keep intermediate results small by applying the modulus at each step.

---

## Algorithm Steps

### Iterative Approach

1. **Handle edge cases**:
   - If `mod == 1`, return 0 (any number mod 1 is 0)
   - If `exp == 0`, return 1 (any number^0 = 1)

2. **Reduce base**: `base = base % mod` to handle cases where `base >= mod`

3. **Initialize result**: `result = 1`

4. **Main loop** while `exp > 0`:
   - **Check LSB**: If `exp & 1` (exp is odd), multiply result by base
   - **Square base**: `base = (base × base) % mod`
   - **Right shift**: `exp = exp >> 1` (equivalent to `exp // 2`)

5. **Return** the final result

### Recursive Approach

1. **Base cases**:
   - If `exp == 0`, return 1
   - If `mod == 1`, return 0

2. **Recursive step**:
   - If `exp` is even: return `power(base, exp/2)^2 % mod`
   - If `exp` is odd: return `(base × power(base, exp-1)) % mod`

---

## Implementation

### Complete Implementation with All Variations

````carousel
```python
"""
Modular Exponentiation Implementation
Time: O(log exp) | Space: O(1) iterative, O(log exp) recursive
"""

class ModularExponentiation:
    """
    Comprehensive Modular Exponentiation class with multiple implementations
    and utility methods for common number theory operations.
    """
    
    @staticmethod
    def power_iterative(base: int, exp: int, mod: int) -> int:
        """
        Compute (base^exp) % mod using iterative binary exponentiation.
        
        Args:
            base: The base number (can be negative)
            exp: The exponent (non-negative integer)
            mod: The modulus (positive integer)
            
        Returns:
            (base^exp) % mod in range [0, mod-1]
            
        Time: O(log exp)
        Space: O(1)
        """
        if mod == 1:
            return 0
        if exp < 0:
            raise ValueError("Negative exponents require modular inverse")
        
        # Handle negative base
        base = base % mod
        
        result = 1
        while exp > 0:
            # If exp is odd, multiply result by base
            if exp & 1:  # Check LSB
                result = (result * base) % mod
            
            # Square the base
            base = (base * base) % mod
            
            # Halve the exponent (right shift)
            exp >>= 1
        
        return result
    
    @staticmethod
    def power_recursive(base: int, exp: int, mod: int) -> int:
        """
        Compute (base^exp) % mod using recursive binary exponentiation.
        
        Time: O(log exp)
        Space: O(log exp) - recursion stack depth
        """
        if mod == 1:
            return 0
        if exp == 0:
            return 1
        if exp < 0:
            raise ValueError("Negative exponents require modular inverse")
        
        base = base % mod
        
        if exp & 1:  # Odd
            return (base * ModularExponentiation.power_recursive(
                (base * base) % mod, exp // 2, mod)) % mod
        else:  # Even
            return ModularExponentiation.power_recursive(
                (base * base) % mod, exp // 2, mod)
    
    @staticmethod
    def power_with_steps(base: int, exp: int, mod: int) -> tuple:
        """
        Compute power with detailed step-by-step trace for educational purposes.
        
        Returns:
            Tuple of (result, list of steps)
        """
        if mod == 1:
            return 0, []
        
        steps = []
        steps.append(f"Computing {base}^{exp} mod {mod}")
        steps.append(f"Binary of {exp}: {bin(exp)[2:]}")
        steps.append("")
        
        base = base % mod
        result = 1
        iteration = 1
        
        while exp > 0:
            step_info = f"Iter {iteration}: base={base}, exp={exp} ({bin(exp)[2:]}), result={result}"
            
            if exp & 1:
                old_result = result
                result = (result * base) % mod
                step_info += f"\n  exp odd: result = {old_result} × {base} = {result} mod {mod}"
            else:
                step_info += "\n  exp even: skip result update"
            
            base = (base * base) % mod
            exp >>= 1
            step_info += f"\n  base² = {base}, exp >>= 1 = {exp}"
            
            steps.append(step_info)
            iteration += 1
        
        steps.append(f"\nFinal result: {result}")
        return result, steps


# Additional utility functions for number theory applications

def mod_inverse(a: int, mod: int) -> int:
    """
    Compute modular multiplicative inverse using Fermat's Little Theorem.
    Requires: mod is prime, a and mod are coprime
    
    a^(-1) ≡ a^(mod-2) (mod mod) when mod is prime
    
    Time: O(log mod)
    """
    if mod == 1:
        return 0
    return ModularExponentiation.power_iterative(a % mod, mod - 2, mod)


def mod_factorial(n: int, mod: int) -> int:
    """
    Compute n! % mod efficiently.
    Time: O(n log mod) - using mod at each step
    """
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % mod
    return result


def mod_ncr(n: int, r: int, mod: int) -> int:
    """
    Compute nCr % mod using modular arithmetic.
    nCr = n! / (r! × (n-r)!)
    
    Time: O(n log mod)
    """
    if r > n or r < 0:
        return 0
    if r == 0 or r == n:
        return 1
    
    # Use Fermat's Little Theorem for division
    # nCr = n! × (r!)^(-1) × ((n-r)!)^(-1) mod mod
    
    num = mod_factorial(n, mod)
    den = (mod_factorial(r, mod) * mod_factorial(n - r, mod)) % mod
    
    return (num * mod_inverse(den, mod)) % mod


# Example usage and demonstration
if __name__ == "__main__":
    me = ModularExponentiation()
    
    print("=" * 60)
    print("MODULAR EXPONENTIATION DEMONSTRATION")
    print("=" * 60)
    
    # Basic examples
    test_cases = [
        (2, 10, 1000),
        (3, 5, 13),
        (7, 0, 13),
        (2, 100, 1000000007),
        (5, 1000, 1000000007),
        (123456789, 987654321, 1000000007),
    ]
    
    print("\n1. Basic Power Computations:")
    print("-" * 60)
    for base, exp, mod in test_cases:
        result = me.power_iterative(base, exp, mod)
        print(f"{base}^{exp} mod {mod} = {result}")
    
    # Step-by-step trace
    print("\n2. Step-by-Step Trace (2^10 mod 1000):")
    print("-" * 60)
    result, steps = me.power_with_steps(2, 10, 1000)
    for step in steps:
        print(step)
    
    # Comparison: iterative vs recursive
    print("\n3. Iterative vs Recursive Comparison:")
    print("-" * 60)
    base, exp, mod = 7, 50, 1000000007
    iter_result = me.power_iterative(base, exp, mod)
    rec_result = me.power_recursive(base, exp, mod)
    print(f"Iterative: {base}^{exp} mod {mod} = {iter_result}")
    print(f"Recursive: {base}^{exp} mod {mod} = {rec_result}")
    print(f"Match: {'✓' if iter_result == rec_result else '✗'}")
    
    # Modular inverse
    print("\n4. Modular Inverse (7^(-1) mod 13):")
    print("-" * 60)
    a, mod = 7, 13
    inv = mod_inverse(a, mod)
    print(f"{a}^(-1) mod {mod} = {inv}")
    print(f"Verification: {a} × {inv} = {(a * inv) % mod} mod {mod}")
    
    # nCr computation
    print("\n5. Binomial Coefficient (10C3 mod 1000000007):")
    print("-" * 60)
    n, r, mod = 10, 3, 1000000007
    result = mod_ncr(n, r, mod)
    print(f"{n}C{r} mod {mod} = {result}")
    print(f"Expected: {120}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <cstdint>
using namespace std;

/**
 * Modular Exponentiation Implementation
 * Time: O(log exp) | Space: O(1) iterative, O(log exp) recursive
 */
class ModularExponentiation {
public:
    /**
     * Compute (base^exp) % mod using iterative binary exponentiation.
     * 
     * Args:
     *   base: The base number
     *   exp: The exponent (non-negative)
     *   mod: The modulus (positive)
     * 
     * Returns: (base^exp) % mod
     * 
     * Time: O(log exp), Space: O(1)
     */
    static long long powerIterative(long long base, long long exp, long long mod) {
        if (mod == 1) return 0;
        if (exp < 0) throw invalid_argument("Negative exponent requires modular inverse");
        
        // Handle negative base
        base = ((base % mod) + mod) % mod;
        
        long long result = 1;
        while (exp > 0) {
            // If exp is odd, multiply result by base
            if (exp & 1) {
                result = (result * base) % mod;
            }
            
            // Square the base
            base = (base * base) % mod;
            
            // Halve the exponent
            exp >>= 1;
        }
        
        return result;
    }
    
    /**
     * Recursive implementation of modular exponentiation.
     * 
     * Time: O(log exp), Space: O(log exp)
     */
    static long long powerRecursive(long long base, long long exp, long long mod) {
        if (mod == 1) return 0;
        if (exp == 0) return 1;
        if (exp < 0) throw invalid_argument("Negative exponent requires modular inverse");
        
        base = ((base % mod) + mod) % mod;
        
        if (exp & 1) {
            // Odd: base^exp = base * base^(exp-1)
            return (base * powerRecursive((base * base) % mod, exp / 2, mod)) % mod;
        } else {
            // Even: base^exp = (base^2)^(exp/2)
            return powerRecursive((base * base) % mod, exp / 2, mod);
        }
    }
    
    /**
     * Compute modular multiplicative inverse using Fermat's Little Theorem.
     * Requires: mod is prime, a and mod are coprime
     * a^(-1) ≡ a^(mod-2) (mod mod)
     */
    static long long modInverse(long long a, long long mod) {
        if (mod == 1) return 0;
        // Fermat's Little Theorem: a^(-1) ≡ a^(mod-2) (mod mod)
        return powerIterative(a % mod, mod - 2, mod);
    }
    
    /**
     * Compute n! % mod
     */
    static long long modFactorial(int n, long long mod) {
        long long result = 1;
        for (int i = 2; i <= n; i++) {
            result = (result * i) % mod;
        }
        return result;
    }
    
    /**
     * Compute nCr % mod using modular arithmetic
     */
    static long long modNcr(int n, int r, long long mod) {
        if (r > n || r < 0) return 0;
        if (r == 0 || r == n) return 1;
        
        long long num = modFactorial(n, mod);
        long long den = (modFactorial(r, mod) * modFactorial(n - r, mod)) % mod;
        
        return (num * modInverse(den, mod)) % mod;
    }
};

// Template version for compile-time optimization
template<typename T>
class ModularExponentiationTemplate {
public:
    static T power(T base, T exp, T mod) {
        if (mod == 1) return 0;
        
        base %= mod;
        T result = 1;
        
        while (exp > 0) {
            if (exp & 1)
                result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        
        return result;
    }
};

int main() {
    const long long MOD = 1000000007LL;
    
    cout << "=" << string(60, '=') << endl;
    cout << "MODULAR EXPONENTIATION DEMONSTRATION" << endl;
    cout << "=" << string(60, '=') << endl;
    
    // Basic examples
    vector<tuple<long long, long long, long long>> testCases = {
        {2, 10, 1000},
        {3, 5, 13},
        {7, 0, 13},
        {2, 100, MOD},
        {5, 1000, MOD},
        {123456789, 987654321, MOD}
    };
    
    cout << "\n1. Basic Power Computations:" << endl;
    cout << string(60, '-') << endl;
    for (auto& [base, exp, mod] : testCases) {
        long long result = ModularExponentiation::powerIterative(base, exp, mod);
        cout << base << "^" << exp << " mod " << mod << " = " << result << endl;
    }
    
    // Iterative vs Recursive comparison
    cout << "\n2. Iterative vs Recursive Comparison:" << endl;
    cout << string(60, '-') << endl;
    long long base = 7, exp = 50;
    long long iterResult = ModularExponentiation::powerIterative(base, exp, MOD);
    long long recResult = ModularExponentiation::powerRecursive(base, exp, MOD);
    cout << "Iterative: " << base << "^" << exp << " mod " << MOD << " = " << iterResult << endl;
    cout << "Recursive: " << base << "^" << exp << " mod " << MOD << " = " << recResult << endl;
    cout << "Match: " << (iterResult == recResult ? "✓" : "✗") << endl;
    
    // Modular inverse
    cout << "\n3. Modular Inverse (7^(-1) mod 13):" << endl;
    cout << string(60, '-') << endl;
    long long a = 7, mod = 13;
    long long inv = ModularExponentiation::modInverse(a, mod);
    cout << a << "^(-1) mod " << mod << " = " << inv << endl;
    cout << "Verification: " << a << " × " << inv << " = " << (a * inv) % mod << " mod " << mod << endl;
    
    // Binomial coefficient
    cout << "\n4. Binomial Coefficient (10C3 mod " << MOD << "):" << endl;
    cout << string(60, '-') << endl;
    int n = 10, r = 3;
    long long ncr = ModularExponentiation::modNcr(n, r, MOD);
    cout << n << "C" << r << " mod " << MOD << " = " << ncr << endl;
    cout << "Expected: 120" << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

/**
 * Modular Exponentiation Implementation
 * Time: O(log exp) | Space: O(1) iterative, O(log exp) recursive
 */
public class ModularExponentiation {
    
    private static final long MOD = 1_000_000_007L;
    
    /**
     * Compute (base^exp) % mod using iterative binary exponentiation.
     * 
     * @param base The base number
     * @param exp The exponent (non-negative)
     * @param mod The modulus (positive)
     * @return (base^exp) % mod
     * 
     * Time: O(log exp), Space: O(1)
     */
    public static long powerIterative(long base, long exp, long mod) {
        if (mod == 1) return 0;
        if (exp < 0) throw new IllegalArgumentException("Negative exponent requires modular inverse");
        
        // Handle negative base
        base = ((base % mod) + mod) % mod;
        
        long result = 1;
        while (exp > 0) {
            // If exp is odd, multiply result by base
            if ((exp & 1) == 1) {
                result = (result * base) % mod;
            }
            
            // Square the base
            base = (base * base) % mod;
            
            // Halve the exponent
            exp >>= 1;
        }
        
        return result;
    }
    
    /**
     * Recursive implementation of modular exponentiation.
     * 
     * Time: O(log exp), Space: O(log exp)
     */
    public static long powerRecursive(long base, long exp, long mod) {
        if (mod == 1) return 0;
        if (exp == 0) return 1;
        if (exp < 0) throw new IllegalArgumentException("Negative exponent requires modular inverse");
        
        base = ((base % mod) + mod) % mod;
        
        if ((exp & 1) == 1) {
            // Odd exponent
            return (base * powerRecursive((base * base) % mod, exp / 2, mod)) % mod;
        } else {
            // Even exponent
            return powerRecursive((base * base) % mod, exp / 2, mod);
        }
    }
    
    /**
     * Compute power with detailed step trace.
     */
    public static PowerResult powerWithSteps(long base, long exp, long mod) {
        List<String> steps = new ArrayList<>();
        
        if (mod == 1) {
            return new PowerResult(0, steps);
        }
        
        steps.add("Computing " + base + "^" + exp + " mod " + mod);
        steps.add("Binary of " + exp + ": " + Long.toBinaryString(exp));
        steps.add("");
        
        base = ((base % mod) + mod) % mod;
        long result = 1;
        int iteration = 1;
        
        while (exp > 0) {
            StringBuilder stepInfo = new StringBuilder();
            stepInfo.append(String.format("Iter %d: base=%d, exp=%d (%s), result=%d",
                iteration, base, exp, Long.toBinaryString(exp), result));
            
            if ((exp & 1) == 1) {
                long oldResult = result;
                result = (result * base) % mod;
                stepInfo.append(String.format("\n  exp odd: result = %d × %d = %d mod %d",
                    oldResult, base, result, mod));
            } else {
                stepInfo.append("\n  exp even: skip result update");
            }
            
            base = (base * base) % mod;
            exp >>= 1;
            stepInfo.append(String.format("\n  base² = %d, exp >>= 1 = %d", base, exp));
            
            steps.add(stepInfo.toString());
            iteration++;
        }
        
        steps.add("\nFinal result: " + result);
        return new PowerResult(result, steps);
    }
    
    /**
     * Compute modular multiplicative inverse using Fermat's Little Theorem.
     * Requires: mod is prime
     */
    public static long modInverse(long a, long mod) {
        if (mod == 1) return 0;
        return powerIterative(a % mod, mod - 2, mod);
    }
    
    /**
     * Compute n! % mod
     */
    public static long modFactorial(int n, long mod) {
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result = (result * i) % mod;
        }
        return result;
    }
    
    /**
     * Compute nCr % mod
     */
    public static long modNcr(int n, int r, long mod) {
        if (r > n || r < 0) return 0;
        if (r == 0 || r == n) return 1;
        
        long num = modFactorial(n, mod);
        long den = (modFactorial(r, mod) * modFactorial(n - r, mod)) % mod;
        
        return (num * modInverse(den, mod)) % mod;
    }
    
    // Helper class for returning result with steps
    public static class PowerResult {
        public final long result;
        public final List<String> steps;
        
        public PowerResult(long result, List<String> steps) {
            this.result = result;
            this.steps = steps;
        }
    }
    
    // Main method for demonstration
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("MODULAR EXPONENTIATION DEMONSTRATION");
        System.out.println("=".repeat(60));
        
        // Basic examples
        long[][] testCases = {
            {2, 10, 1000},
            {3, 5, 13},
            {7, 0, 13},
            {2, 100, MOD},
            {5, 1000, MOD},
            {123456789, 987654321, MOD}
        };
        
        System.out.println("\n1. Basic Power Computations:");
        System.out.println("-".repeat(60));
        for (long[] tc : testCases) {
            long result = powerIterative(tc[0], tc[1], tc[2]);
            System.out.printf("%d^%d mod %d = %d%n", tc[0], tc[1], tc[2], result);
        }
        
        // Step trace
        System.out.println("\n2. Step-by-Step Trace (2^10 mod 1000):");
        System.out.println("-".repeat(60));
        PowerResult pr = powerWithSteps(2, 10, 1000);
        for (String step : pr.steps) {
            System.out.println(step);
        }
        
        // Iterative vs Recursive
        System.out.println("\n3. Iterative vs Recursive Comparison:");
        System.out.println("-".repeat(60));
        long base = 7, exp = 50;
        long iterResult = powerIterative(base, exp, MOD);
        long recResult = powerRecursive(base, exp, MOD);
        System.out.printf("Iterative: %d^%d mod %d = %d%n", base, exp, MOD, iterResult);
        System.out.printf("Recursive: %d^%d mod %d = %d%n", base, exp, MOD, recResult);
        System.out.println("Match: " + (iterResult == recResult ? "✓" : "✗"));
        
        // Modular inverse
        System.out.println("\n4. Modular Inverse (7^(-1) mod 13):");
        System.out.println("-".repeat(60));
        long a = 7, mod = 13;
        long inv = modInverse(a, mod);
        System.out.printf("%d^(-1) mod %d = %d%n", a, mod, inv);
        System.out.printf("Verification: %d × %d = %d mod %d%n", a, inv, (a * inv) % mod, mod);
        
        // Binomial coefficient
        System.out.println("\n5. Binomial Coefficient (10C3 mod " + MOD + "):");
        System.out.println("-".repeat(60));
        int n = 10, r = 3;
        long ncr = modNcr(n, r, MOD);
        System.out.printf("%dC%d mod %d = %d%n", n, r, MOD, ncr);
        System.out.println("Expected: 120");
    }
}
```

<!-- slide -->
```javascript
/**
 * Modular Exponentiation Implementation
 * Time: O(log exp) | Space: O(1) iterative, O(log exp) recursive
 */

class ModularExponentiation {
    /**
     * Compute (base^exp) % mod using iterative binary exponentiation.
     * 
     * @param {number|bigint} base - The base number
     * @param {number|bigint} exp - The exponent (non-negative)
     * @param {number|bigint} mod - The modulus (positive)
     * @returns {number|bigint} (base^exp) % mod
     * 
     * Time: O(log exp), Space: O(1)
     */
    static powerIterative(base, exp, mod) {
        if (mod === 1n || mod === 1) return 0n || 0;
        if (exp < 0) throw new Error("Negative exponent requires modular inverse");
        
        // Convert to BigInt if dealing with large numbers
        const useBigInt = typeof base === 'bigint' || typeof exp === 'bigint' || typeof mod === 'bigint';
        
        if (useBigInt) {
            base = BigInt(base);
            exp = BigInt(exp);
            mod = BigInt(mod);
            
            base = ((base % mod) + mod) % mod;
            let result = 1n;
            
            while (exp > 0n) {
                if (exp & 1n) {
                    result = (result * base) % mod;
                }
                base = (base * base) % mod;
                exp >>= 1n;
            }
            
            return result;
        } else {
            base = ((base % mod) + mod) % mod;
            let result = 1;
            
            while (exp > 0) {
                if (exp & 1) {
                    result = (result * base) % mod;
                }
                base = (base * base) % mod;
                exp >>= 1;
            }
            
            return result;
        }
    }
    
    /**
     * Recursive implementation of modular exponentiation.
     * 
     * Time: O(log exp), Space: O(log exp)
     */
    static powerRecursive(base, exp, mod) {
        if (mod === 1n || mod === 1) return 0n || 0;
        if (exp === 0n || exp === 0) return 1n || 1;
        if (exp < 0) throw new Error("Negative exponent requires modular inverse");
        
        const useBigInt = typeof base === 'bigint' || typeof exp === 'bigint' || typeof mod === 'bigint';
        
        if (useBigInt) {
            base = BigInt(base);
            exp = BigInt(exp);
            mod = BigInt(mod);
            
            base = ((base % mod) + mod) % mod;
            
            if (exp & 1n) {
                return (base * this.powerRecursive((base * base) % mod, exp / 2n, mod)) % mod;
            } else {
                return this.powerRecursive((base * base) % mod, exp / 2n, mod);
            }
        } else {
            base = ((base % mod) + mod) % mod;
            
            if (exp & 1) {
                return (base * this.powerRecursive((base * base) % mod, Math.floor(exp / 2), mod)) % mod;
            } else {
                return this.powerRecursive((base * base) % mod, exp / 2, mod);
            }
        }
    }
    
    /**
     * Compute power with detailed step trace.
     */
    static powerWithSteps(base, exp, mod) {
        const steps = [];
        
        if (mod === 1) {
            return { result: 0, steps };
        }
        
        steps.push(`Computing ${base}^${exp} mod ${mod}`);
        steps.push(`Binary of ${exp}: ${exp.toString(2)}`);
        steps.push('');
        
        base = ((base % mod) + mod) % mod;
        let result = 1;
        let iteration = 1;
        
        while (exp > 0) {
            let stepInfo = `Iter ${iteration}: base=${base}, exp=${exp} (${exp.toString(2)}), result=${result}`;
            
            if (exp & 1) {
                const oldResult = result;
                result = (result * base) % mod;
                stepInfo += `\n  exp odd: result = ${oldResult} × ${base} = ${result} mod ${mod}`;
            } else {
                stepInfo += '\n  exp even: skip result update';
            }
            
            base = (base * base) % mod;
            exp >>= 1;
            stepInfo += `\n  base² = ${base}, exp >>= 1 = ${exp}`;
            
            steps.push(stepInfo);
            iteration++;
        }
        
        steps.push(`\nFinal result: ${result}`);
        return { result, steps };
    }
    
    /**
     * Compute modular multiplicative inverse using Fermat's Little Theorem.
     * Requires: mod is prime
     */
    static modInverse(a, mod) {
        if (mod === 1) return 0;
        return this.powerIterative(a % mod, mod - 2, mod);
    }
    
    /**
     * Compute n! % mod
     */
    static modFactorial(n, mod) {
        let result = typeof mod === 'bigint' ? 1n : 1;
        for (let i = 2; i <= n; i++) {
            result = (result * i) % mod;
        }
        return result;
    }
    
    /**
     * Compute nCr % mod
     */
    static modNcr(n, r, mod) {
        if (r > n || r < 0) return typeof mod === 'bigint' ? 0n : 0;
        if (r === 0 || r === n) return typeof mod === 'bigint' ? 1n : 1;
        
        const num = this.modFactorial(n, mod);
        const den = (this.modFactorial(r, mod) * this.modFactorial(n - r, mod)) % mod;
        
        return (num * this.modInverse(den, mod)) % mod;
    }
}


// Example usage and demonstration
console.log("=".repeat(60));
console.log("MODULAR EXPONENTIATION DEMONSTRATION");
console.log("=".repeat(60));

const MOD = 1000000007;

// Basic examples
const testCases = [
    [2, 10, 1000],
    [3, 5, 13],
    [7, 0, 13],
    [2, 100, MOD],
    [5, 1000, MOD],
    [123456789, 987654321, MOD]
];

console.log("\n1. Basic Power Computations:");
console.log("-".repeat(60));
for (const [base, exp, mod] of testCases) {
    const result = ModularExponentiation.powerIterative(base, exp, mod);
    console.log(`${base}^${exp} mod ${mod} = ${result}`);
}

// Step trace
console.log("\n2. Step-by-Step Trace (2^10 mod 1000):");
console.log("-".repeat(60));
const pr = ModularExponentiation.powerWithSteps(2, 10, 1000);
for (const step of pr.steps) {
    console.log(step);
}

// Iterative vs Recursive
console.log("\n3. Iterative vs Recursive Comparison:");
console.log("-".repeat(60));
const base = 7, exp = 50;
const iterResult = ModularExponentiation.powerIterative(base, exp, MOD);
const recResult = ModularExponentiation.powerRecursive(base, exp, MOD);
console.log(`Iterative: ${base}^${exp} mod ${MOD} = ${iterResult}`);
console.log(`Recursive: ${base}^${exp} mod ${MOD} = ${recResult}`);
console.log(`Match: ${iterResult === recResult ? '✓' : '✗'}`);

// Modular inverse
console.log("\n4. Modular Inverse (7^(-1) mod 13):");
console.log("-".repeat(60));
const a = 7, mod = 13;
const inv = ModularExponentiation.modInverse(a, mod);
console.log(`${a}^(-1) mod ${mod} = ${inv}`);
console.log(`Verification: ${a} × ${inv} = ${(a * inv) % mod} mod ${mod}`);

// Binomial coefficient
console.log("\n5. Binomial Coefficient (10C3 mod " + MOD + "):");
console.log("-".repeat(60));
const n = 10, r = 3;
const ncr = ModularExponentiation.modNcr(n, r, MOD);
console.log(`${n}C${r} mod ${MOD} = ${ncr}`);
console.log("Expected: 120");

// BigInt demonstration
console.log("\n6. BigInt Support (Very Large Numbers):");
console.log("-".repeat(60));
const bigBase = 12345678901234567890n;
const bigExp = 9876543210987654321n;
const bigMod = 1000000007n;
const bigResult = ModularExponentiation.powerIterative(bigBase, bigExp, bigMod);
console.log(`${bigBase}^${bigExp} mod ${bigMod} = ${bigResult}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Binary Exponentiation** | O(log exp) | Halves exponent at each step |
| **Naive Multiplication** | O(exp) | Linear in exponent |
| **Modular Inverse** | O(log mod) | Using Fermat's Little Theorem |
| **nCr Computation** | O(n log mod) | Factorial with modular arithmetic |

### Detailed Breakdown

#### Iterative Binary Exponentiation

```
while exp > 0:
    operations  // O(1)
    exp >>= 1   // Halve the exponent
```

- Each iteration reduces `exp` by half (right shift)
- Number of iterations = number of bits in `exp` = ⌊log₂(exp)⌋ + 1
- Total time: **O(log exp)**

#### Space Complexity

| Implementation | Space Complexity | Description |
|----------------|------------------|-------------|
| **Iterative** | O(1) | Only stores base, exp, result |
| **Recursive** | O(log exp) | Recursion stack depth |

---

## Space Complexity Analysis

### Memory Usage Breakdown

1. **Iterative Implementation**:
   - `base`: O(1)
   - `exp`: O(1) 
   - `result`: O(1)
   - `mod`: O(1)
   - **Total**: O(1) auxiliary space

2. **Recursive Implementation**:
   - Each recursive call: O(1) local variables
   - Maximum depth: O(log exp)
   - **Total**: O(log exp) stack space

3. **With Precomputation** (for multiple queries):
   - Precomputed powers: O(log exp) storage
   - Query time: O(1) per query

### Space Optimization Tips

1. **Use iterative approach** when memory is constrained
2. **Reuse variables** to minimize stack allocation
3. **Precompute** only when multiple queries with same base

---

## Common Variations

### 1. Iterative vs Recursive Implementation

**Iterative** (Preferred):
- No recursion overhead
- O(1) space complexity
- Better cache performance

**Recursive**:
- More intuitive for some
- Easier to prove correct by induction
- O(log exp) space overhead

### 2. Handling Negative Exponents

When you need to compute `base^(-exp) mod mod`:

````carousel
```python
def power_negative(base: int, exp: int, mod: int) -> int:
    """
    Compute (base^exp) % mod, handling negative exponents.
    Requires: base and mod are coprime, mod is prime
    """
    if exp >= 0:
        return power_iterative(base, exp, mod)
    else:
        # base^(-exp) = (base^(-1))^exp = (base^(mod-2))^exp (mod mod)
        inv = mod_inverse(base, mod)
        return power_iterative(inv, -exp, mod)
```
````

### 3. Matrix Exponentiation

Used for computing linear recurrences (Fibonacci, etc.):

````carousel
```python
def matrix_mult(A, B, mod):
    """Multiply two matrices modulo mod."""
    n = len(A)
    result = [[0] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            for j in range(n):
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod
    return result

def matrix_power(M, exp, mod):
    """Compute M^exp mod mod using binary exponentiation."""
    n = len(M)
    # Initialize result as identity matrix
    result = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    
    base = M
    while exp > 0:
        if exp & 1:
            result = matrix_mult(result, base, mod)
        base = matrix_mult(base, base, mod)
        exp >>= 1
    
    return result

# Example: Fibonacci using matrix exponentiation
def fibonacci(n, mod=10**9 + 7):
    """Compute nth Fibonacci number in O(log n) time."""
    if n <= 1:
        return n
    
    # Transformation matrix
    M = [[1, 1], [1, 0]]
    M_n = matrix_power(M, n - 1, mod)
    return M_n[0][0]
```
````

### 4. Precomputation for Multiple Queries

When answering many queries with the same base:

````carousel
```python
class PrecomputedPower:
    """Precompute powers for fast O(1) queries."""
    
    def __init__(self, base, mod):
        self.mod = mod
        self.base = base % mod
        self.precomputed = [1, self.base]  # base^0, base^1
        
        # Precompute base^(2^i) for i up to log2(max_exp)
        for i in range(1, 64):  # Up to 2^64
            next_pow = (self.precomputed[-1] * self.precomputed[-1]) % mod
            self.precomputed.append(next_pow)
    
    def query(self, exp):
        """Answer query in O(log exp) with fewer multiplications."""
        result = 1
        i = 0
        while exp > 0:
            if exp & 1:
                result = (result * self.precomputed[i + 1]) % self.mod
            exp >>= 1
            i += 1
        return result
```
````

### 5. Euler's Theorem Optimization

When `base` and `mod` are coprime:
- `base^exp ≡ base^(exp % φ(mod)) (mod mod)`
- Where φ is Euler's totient function

This reduces the exponent significantly when `exp > φ(mod)`.

---

## Practice Problems

### Problem 1: Pow(x, n)

**Problem:** [LeetCode 50 - Pow(x, n)](https://leetcode.com/problems/powx-n/)

**Description:** Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`). Handle negative exponents.

**How to Apply Modular Exponentiation:**
- This is the classic application - implement binary exponentiation
- Handle negative `n` by computing `1/x^|n|`
- Be careful with edge cases: `n = 0`, `x = 0`, `x = 1`, `x = -1`

**Key Insight:** Binary exponentiation reduces O(n) to O(log n) time complexity.

---

### Problem 2: Super Pow

**Problem:** [LeetCode 372 - Super Pow](https://leetcode.com/problems/super-pow/)

**Description:** Your task is to calculate `a^b mod 1337` where `a` is a positive integer and `b` is an extremely large positive integer given in the form of an array.

**How to Apply Modular Exponentiation:**
- Use property: `a^b mod m = (a^(b/10))^10 × a^(b%10) mod m`
- Process digits of `b` from left to right
- Apply modular exponentiation at each step

**Key Insight:** Euler's theorem: `a^b mod 1337 = a^(b mod φ(1337) + φ(1337)) mod 1337` when a and 1337 are coprime.

---

### Problem 3: Count Good Numbers

**Problem:** [LeetCode 1922 - Count Good Numbers](https://leetcode.com/problems/count-good-numbers/)

**Description:** A digit string is good if the digits at even indices are even and digits at odd indices are prime (2, 3, 5, 7). Return the total number of good digit strings of length `n` modulo `10^9 + 7`.

**How to Apply Modular Exponentiation:**
- Even positions: 5 choices (0, 2, 4, 6, 8)
- Odd positions: 4 choices (2, 3, 5, 7)
- Answer: `5^ceil(n/2) × 4^floor(n/2) mod (10^9 + 7)`
- Use fast exponentiation for large powers

**Key Insight:** Direct computation would overflow; modular exponentiation handles the large exponents efficiently.

---

### Problem 4: Find the Value of the Partition

**Problem:** [LeetCode 2748 - Find the Value of the Partition](https://leetcode.com/problems/find-the-value-of-the-partition/)

**Description:** (Follow-up) This problem requires understanding of number theory and can be extended using modular arithmetic for large number handling.

**Related Problem:** [LeetCode 2455 - Average Value of Even Numbers That Are Divisible by Three](https://leetcode.com/problems/average-value-of-even-numbers-that-are-divisible-by-three/)

**How to Apply Modular Exponentiation:**
- While not directly about exponentiation, understanding modular arithmetic is crucial
- Practice modular inverse for division operations

---

### Problem 5: Matrix Block Sum

**Problem:** [LeetCode 1314 - Matrix Block Sum](https://leetcode.com/problems/matrix-block-sum/)

**Related Advanced Problem:** [LeetCode 1220 - Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/)

**Description:** Given an integer `n`, return the number of strings of length `n` that consist only of vowels (a, e, i, o, u) and are lexicographically sorted. This is a matrix exponentiation problem.

**How to Apply Modular Exponentiation:**
- Build transition matrix representing valid vowel sequences
- Use matrix exponentiation to compute `M^n` in O(log n) time
- Each matrix multiplication is standard modular arithmetic

**Key Insight:** Linear recurrence relations can be solved efficiently using matrix exponentiation combined with modular exponentiation.

---

## Video Tutorial Links

### Fundamentals

- [Modular Exponentiation - Binary Exponentiation (Take U Forward)](https://www.youtube.com/watch?v=tTuVa1P65lE) - Comprehensive introduction with code
- [Fast Exponentiation (WilliamFiset)](https://www.youtube.com/watch?v=4H0tXCLv044) - Detailed explanation with visualizations
- [Modular Arithmetic (NeetCode)](https://www.youtube.com/watch?v=4iPrBzuDCBc) - Practical applications in competitive programming

### Advanced Topics

- [Matrix Exponentiation for Linear Recurrences](https://www.youtube.com/watch?v=VLi2n16V3L0) - Solving Fibonacci and similar problems
- [Modular Inverse using Fermat's Little Theorem](https://www.youtube.com/watch?v=60yA6xHpMJ8) - Division in modular arithmetic
- [Euler's Theorem and Totient Function](https://www.youtube.com/watch?v=OuH2NyCDH1s) - Advanced optimizations

### Competitive Programming

- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=HO2aRo2eZDc) - Comprehensive number theory course
- [CP-Algorithms: Binary Exponentiation](https://cp-algorithms.com/algebra/binary-exp.html) - Written reference with problems

---

## Follow-up Questions

### Q1: Why does modular exponentiation work? Can you prove its correctness?

**Answer:** 
The correctness follows from these mathematical properties:

1. **(a × b) mod m = ((a mod m) × (b mod m)) mod m**
   - This allows us to take mod at each step

2. **Binary decomposition**: Any number can be written as sum of powers of 2
   - `exp = Σ(b_i × 2^i)` where `b_i ∈ {0, 1}`
   - `base^exp = Π(base^(b_i × 2^i))`

3. **Induction proof**:
   - Base case: `exp = 0`, returns 1 ✓
   - Inductive step: Algorithm correctly handles both even and odd cases

### Q2: How do you handle division in modular arithmetic?

**Answer:**
In modular arithmetic, division is multiplication by the **modular multiplicative inverse**:
- `a / b ≡ a × b^(-1) (mod m)`
- `b^(-1)` exists iff `gcd(b, m) = 1`
- Using Fermat's Little Theorem (when m is prime): `b^(-1) ≡ b^(m-2) (mod m)`

Example: `7 / 3 mod 11 = 7 × 3^(-1) mod 11 = 7 × 4 mod 11 = 6`

### Q3: What's the difference between modular exponentiation and matrix exponentiation?

**Answer:**
- **Modular Exponentiation**: Computes `a^n mod m` for integers
- **Matrix Exponentiation**: Computes `M^n` for matrices
  - Uses the same binary exponentiation algorithm
  - Matrix multiplication replaces integer multiplication
  - Time: O(k³ log n) for k×k matrices
  - Applications: Linear recurrences (Fibonacci), graph paths

### Q4: How do you compute `a^b^c mod m` efficiently?

**Answer:**
Use **Euler's theorem** to reduce the exponent:
1. Compute `exp = b^c mod φ(m)` (if a and m are coprime)
2. Compute `a^exp mod m`

If not coprime, use **Carmichael function** or handle carefully with Chinese Remainder Theorem.

This is known as **tetration** or iterated exponentiation.

### Q5: Can we do better than O(log n) for single queries?

**Answer:**
For a single query, **O(log n) is optimal** because:
- We need to examine each bit of the exponent
- There are log₂(n) bits in n
- Each bit potentially affects the result

However, with **preprocessing**:
- O(√n) preprocessing allows O(1) queries (baby-step giant-step)
- Useful when many queries share the same base

---

## Summary

Modular Exponentiation is a fundamental algorithm for efficiently computing large powers modulo a number. Key takeaways:

### Core Concepts
- **Binary decomposition**: Break exponent into binary representation
- **Repeated squaring**: Square base at each step
- **Modular reduction**: Keep numbers small by applying mod at each step

### Time & Space Complexity
| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| Time | O(log exp) | O(log exp) |
| Space | O(1) | O(log exp) |

### When to Use
- ✅ Computing large powers (e.g., `a^b mod m` where b > 10^9)
- ✅ Cryptographic applications (RSA, Diffie-Hellman)
- ✅ Number theory problems (modular inverses, nCr)
- ✅ Matrix exponentiation for linear recurrences

### Common Pitfalls
- ❌ Forgetting to handle negative bases
- ❌ Not applying mod at each step (overflow)
- ❌ Using naive O(n) approach for large exponents
- ❌ Assuming modular inverse always exists (check gcd)

### Related Techniques
- **Fermat's Little Theorem**: For modular inverses with prime modulus
- **Euler's Theorem**: Generalization for any modulus
- **Matrix Exponentiation**: Extension to linear recurrences
- **Chinese Remainder Theorem**: For composite moduli

Mastering modular exponentiation is essential for competitive programming and technical interviews, as it forms the foundation for many advanced algorithms in number theory and cryptography.

---

## Related Algorithms

- [Modular Inverse](./modular-inverse.md) - Computing multiplicative inverses using exponentiation
- [GCD Euclidean](./gcd-euclidean.md) - Extended Euclidean algorithm for modular inverses
- [Matrix Exponentiation](./matrix-exponentiation.md) - Extension to matrix powers
- [Binary Lifting](./binary-lifting.md) - Similar technique for ancestor queries in trees
- [Fermat's Little Theorem](./fermat-little-theorem.md) - Theoretical foundation for modular inverses
