# GCD (Euclidean)

## Category
Math & Number Theory

## Description

The **Euclidean Algorithm** is one of the oldest and most efficient algorithms for computing the **Greatest Common Divisor (GCD)** of two integers. It uses a beautiful mathematical property to reduce the problem size exponentially at each step, making it remarkably fast even for very large numbers.

---

## When to Use

Use the Euclidean Algorithm when you need to solve problems involving:

- **Finding GCD of two or more numbers**: The most common use case
- **Computing LCM (Least Common Multiple)**: Using the relationship `lcm(a, b) = |a × b| / gcd(a, b)`
- **Simplifying fractions**: Reduce `a/b` to lowest terms by dividing by `gcd(a, b)`
- **Modular arithmetic**: Finding modular inverses using Extended Euclidean Algorithm
- **Cryptography**: RSA encryption relies heavily on GCD computations
- **Number theory problems**: Diophantine equations, coprime checking, etc.

### Comparison with Alternative Approaches

| Method | Time Complexity | Space Complexity | When to Use |
|--------|----------------|------------------|-------------|
| **Euclidean Algorithm** | O(log(min(a, b))) | O(1) | ✅ Always preferred |
| **Prime Factorization** | O(√n) | O(log n) | Small numbers only |
| **Brute Force** | O(min(a, b)) | O(1) | ❌ Never for large numbers |
| **Binary GCD (Stein's)** | O(log(min(a, b))) | O(1) | Hardware without fast division |

### When to Choose Euclidean vs Other Approaches

- **Choose Euclidean Algorithm** when:
  - You need to compute GCD of large numbers
  - Performance is critical
  - Standard arithmetic operations are available

- **Choose Binary GCD (Stein's)** when:
  - Division operations are expensive (embedded systems)
  - Working with very large integers on specific hardware
  - Bit operations are faster than modulo

---

## Algorithm Explanation

### Core Concept

The Euclidean algorithm is based on a fundamental mathematical property:

```
gcd(a, b) = gcd(b, a mod b)
```

This means the GCD of two numbers doesn't change if you replace the larger number with the remainder of dividing the larger by the smaller.

### Why It Works

**Key Insight**: Any common divisor of `a` and `b` must also divide `a mod b`

**Proof**:
- Let `d = gcd(a, b)`
- We can write: `a = b × q + r` where `r = a mod b` and `0 ≤ r < b`
- Since `d` divides both `a` and `b`, it must also divide `r = a - b × q`
- Conversely, any divisor of `b` and `r` also divides `a = b × q + r`
- Therefore, `gcd(a, b) = gcd(b, r)`

### Visual Representation

For `gcd(48, 18)`:

```
gcd(48, 18)
    ↓ 48 = 18 × 2 + 12
gcd(18, 12)
    ↓ 18 = 12 × 1 + 6
gcd(12, 6)
    ↓ 12 = 6 × 2 + 0
gcd(6, 0) = 6 ✓
```

At each step, the second number becomes significantly smaller (at least halved on average), leading to logarithmic time complexity.

---

## Algorithm Steps

### Iterative Approach (Recommended)

1. **Take absolute values**: Handle negative inputs gracefully
2. **Loop while b ≠ 0**:
   - Store `b` in a temporary variable
   - Update `b = a % b`
   - Update `a = temp`
3. **Return `a`**: This is the GCD

### Recursive Approach (Elegant)

1. **Base case**: If `b == 0`, return `a`
2. **Recursive case**: Return `gcd(b, a % b)`

---

## Implementation

### Template Code (GCD with All Variations)

````carousel
```python
import math
from typing import List, Tuple

def gcd_iterative(a: int, b: int) -> int:
    """
    Calculate GCD using iterative Euclidean algorithm.
    
    Args:
        a, b: Two integers (can be negative)
    
    Returns:
        Greatest Common Divisor of a and b (always non-negative)
    
    Time: O(log(min(a, b)))
    Space: O(1)
    """
    a, b = abs(a), abs(b)
    
    while b != 0:
        a, b = b, a % b
    
    return a


def gcd_recursive(a: int, b: int) -> int:
    """
    Calculate GCD using recursive Euclidean algorithm.
    
    Time: O(log(min(a, b)))
    Space: O(log(min(a, b))) due to recursion stack
    """
    if b == 0:
        return abs(a)
    return gcd_recursive(b, a % b)


def extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    
    Returns (g, x, y) where:
    - g = gcd(a, b)
    - x, y such that ax + by = g
    
    Used for modular inverse and solving Diophantine equations.
    
    Time: O(log(min(a, b)))
    Space: O(log(min(a, b)))
    """
    if a == 0:
        return b, 0, 1
    
    gcd, x1, y1 = extended_gcd(b % a, a)
    
    x = y1 - (b // a) * x1
    y = x1
    
    return gcd, x, y


def lcm(a: int, b: int) -> int:
    """
    Least Common Multiple using GCD.
    
    Formula: lcm(a, b) = |a * b| / gcd(a, b)
    """
    if a == 0 or b == 0:
        return 0
    return abs(a * b) // gcd_iterative(a, b)


def mod_inverse(a: int, m: int) -> int:
    """
    Modular multiplicative inverse of a under modulo m.
    
    Returns x such that (a * x) % m = 1
    Returns -1 if inverse doesn't exist (when gcd(a, m) ≠ 1)
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return -1  # Inverse doesn't exist
    return (x % m + m) % m


def gcd_of_array(numbers: List[int]) -> int:
    """Calculate GCD of an array of numbers."""
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = gcd_iterative(result, num)
        if result == 1:
            return 1  # Early exit
    
    return result


# Example usage
if __name__ == "__main__":
    # Basic GCD examples
    test_cases = [(48, 18), (54, 24), (100, 25), (17, 13), (0, 5)]
    
    print("GCD Results:")
    for a, b in test_cases:
        print(f"  gcd({a}, {b}) = {gcd_iterative(a, b)}")
    
    # Extended GCD
    a, b = 35, 15
    g, x, y = extended_gcd(a, b)
    print(f"\nExtended GCD: {a}*({x}) + {b}*({y}) = {g}")
    
    # LCM
    print(f"\nLCM(12, 18) = {lcm(12, 18)}")
    
    # Modular inverse
    print(f"\nModular inverse of 3 mod 11: {mod_inverse(3, 11)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

/**
 * Calculate GCD using iterative Euclidean algorithm.
 * 
 * Time: O(log(min(a, b)))
 * Space: O(1)
 */
int gcdIterative(int a, int b) {
    a = abs(a);
    b = abs(b);
    
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    
    return a;
}

/**
 * Calculate GCD using recursive Euclidean algorithm.
 * 
 * Time: O(log(min(a, b)))
 * Space: O(log(min(a, b))) due to recursion stack
 */
int gcdRecursive(int a, int b) {
    if (b == 0) {
        return abs(a);
    }
    return gcdRecursive(b, a % b);
}

/**
 * Extended Euclidean Algorithm.
 * Returns (g, x, y) where g = gcd(a, b) and ax + by = g
 * 
 * Time: O(log(min(a, b)))
 */
tuple<int, int, int> extendedGCD(int a, int b) {
    if (a == 0) {
        return {b, 0, 1};
    }
    
    auto [gcd, x1, y1] = extendedGCD(b % a, a);
    
    int x = y1 - (b / a) * x1;
    int y = x1;
    
    return {gcd, x, y};
}

/**
 * Least Common Multiple using GCD.
 * Formula: lcm(a, b) = |a * b| / gcd(a, b)
 */
long long lcm(int a, int b) {
    if (a == 0 || b == 0) {
        return 0;
    }
    return (abs((long long)a * b) / gcdIterative(a, b));
}

/**
 * Modular multiplicative inverse of a under modulo m.
 * Returns -1 if inverse doesn't exist.
 */
int modInverse(int a, int m) {
    auto [g, x, _] = extendedGCD((a % m + m) % m, m);
    if (g != 1) {
        return -1;  // Inverse doesn't exist
    }
    return (x % m + m) % m;
}

/**
 * Calculate GCD of an array of numbers.
 */
int gcdOfArray(const vector<int>& numbers) {
    if (numbers.empty()) {
        return 0;
    }
    
    int result = numbers[0];
    for (size_t i = 1; i < numbers.size(); i++) {
        result = gcdIterative(result, numbers[i]);
        if (result == 1) {
            return 1;  // Early exit
        }
    }
    
    return result;
}

int main() {
    // Basic GCD examples
    vector<pair<int, int>> testCases = {{48, 18}, {54, 24}, {100, 25}, {17, 13}, {0, 5}};
    
    cout << "GCD Results:" << endl;
    for (auto [a, b] : testCases) {
        cout << "  gcd(" << a << ", " << b << ") = " << gcdIterative(a, b) << endl;
    }
    
    // Extended GCD
    int a = 35, b = 15;
    auto [g, x, y] = extendedGCD(a, b);
    cout << "\nExtended GCD: " << a << "*(" << x << ") + " << b << "*(" << y << ") = " << g << endl;
    
    // LCM
    cout << "\nLCM(12, 18) = " << lcm(12, 18) << endl;
    
    // Modular inverse
    cout << "\nModular inverse of 3 mod 11: " << modInverse(3, 11) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Euclidean Algorithm implementations in Java.
 */
public class GCDEuclidean {
    
    /**
     * Calculate GCD using iterative Euclidean algorithm.
     * 
     * Time: O(log(min(a, b)))
     * Space: O(1)
     */
    public static int gcdIterative(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        
        return a;
    }
    
    /**
     * Calculate GCD using recursive Euclidean algorithm.
     * 
     * Time: O(log(min(a, b)))
     * Space: O(log(min(a, b))) due to recursion stack
     */
    public static int gcdRecursive(int a, int b) {
        if (b == 0) {
            return Math.abs(a);
        }
        return gcdRecursive(b, a % b);
    }
    
    /**
     * Extended Euclidean Algorithm.
     * Returns array [g, x, y] where g = gcd(a, b) and ax + by = g
     * 
     * Time: O(log(min(a, b)))
     */
    public static int[] extendedGCD(int a, int b) {
        if (a == 0) {
            return new int[]{b, 0, 1};
        }
        
        int[] result = extendedGCD(b % a, a);
        int gcd = result[0];
        int x1 = result[1];
        int y1 = result[2];
        
        int x = y1 - (b / a) * x1;
        int y = x1;
        
        return new int[]{gcd, x, y};
    }
    
    /**
     * Least Common Multiple using GCD.
     * Formula: lcm(a, b) = |a * b| / gcd(a, b)
     */
    public static long lcm(int a, int b) {
        if (a == 0 || b == 0) {
            return 0;
        }
        return (Math.abs((long) a * b) / gcdIterative(a, b));
    }
    
    /**
     * Modular multiplicative inverse of a under modulo m.
     * Returns -1 if inverse doesn't exist.
     */
    public static int modInverse(int a, int m) {
        int[] result = extendedGCD((a % m + m) % m, m);
        int g = result[0];
        int x = result[1];
        
        if (g != 1) {
            return -1;  // Inverse doesn't exist
        }
        return (x % m + m) % m;
    }
    
    /**
     * Calculate GCD of an array of numbers.
     */
    public static int gcdOfArray(int[] numbers) {
        if (numbers == null || numbers.length == 0) {
            return 0;
        }
        
        int result = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            result = gcdIterative(result, numbers[i]);
            if (result == 1) {
                return 1;  // Early exit
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        // Basic GCD examples
        int[][] testCases = {{48, 18}, {54, 24}, {100, 25}, {17, 13}, {0, 5}};
        
        System.out.println("GCD Results:");
        for (int[] tc : testCases) {
            System.out.println("  gcd(" + tc[0] + ", " + tc[1] + ") = " + gcdIterative(tc[0], tc[1]));
        }
        
        // Extended GCD
        int a = 35, b = 15;
        int[] extResult = extendedGCD(a, b);
        System.out.println("\nExtended GCD: " + a + "*(" + extResult[1] + ") + " + b + "*(" + extResult[2] + ") = " + extResult[0]);
        
        // LCM
        System.out.println("\nLCM(12, 18) = " + lcm(12, 18));
        
        // Modular inverse
        System.out.println("\nModular inverse of 3 mod 11: " + modInverse(3, 11));
    }
}
```

<!-- slide -->
```javascript
/**
 * Euclidean Algorithm implementations in JavaScript.
 */

/**
 * Calculate GCD using iterative Euclidean algorithm.
 * 
 * Time: O(log(min(a, b)))
 * Space: O(1)
 */
function gcdIterative(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    
    return a;
}

/**
 * Calculate GCD using recursive Euclidean algorithm.
 * 
 * Time: O(log(min(a, b)))
 * Space: O(log(min(a, b))) due to recursion stack
 */
function gcdRecursive(a, b) {
    if (b === 0) {
        return Math.abs(a);
    }
    return gcdRecursive(b, a % b);
}

/**
 * Extended Euclidean Algorithm.
 * Returns [g, x, y] where g = gcd(a, b) and ax + by = g
 * 
 * Time: O(log(min(a, b)))
 */
function extendedGCD(a, b) {
    if (a === 0) {
        return [b, 0, 1];
    }
    
    const [gcd, x1, y1] = extendedGCD(b % a, a);
    
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;
    
    return [gcd, x, y];
}

/**
 * Least Common Multiple using GCD.
 * Formula: lcm(a, b) = |a * b| / gcd(a, b)
 */
function lcm(a, b) {
    if (a === 0 || b === 0) {
        return 0;
    }
    return Math.abs(a * b) / gcdIterative(a, b);
}

/**
 * Modular multiplicative inverse of a under modulo m.
 * Returns -1 if inverse doesn't exist.
 */
function modInverse(a, m) {
    const [g, x, _] = extendedGCD(((a % m) + m) % m, m);
    if (g !== 1) {
        return -1;  // Inverse doesn't exist
    }
    return ((x % m) + m) % m;
}

/**
 * Calculate GCD of an array of numbers.
 */
function gcdOfArray(numbers) {
    if (!numbers || numbers.length === 0) {
        return 0;
    }
    
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = gcdIterative(result, numbers[i]);
        if (result === 1) {
            return 1;  // Early exit
        }
    }
    
    return result;
}

// Example usage
const testCases = [[48, 18], [54, 24], [100, 25], [17, 13], [0, 5]];

console.log("GCD Results:");
for (const [a, b] of testCases) {
    console.log(`  gcd(${a}, ${b}) = ${gcdIterative(a, b)}`);
}

// Extended GCD
const [a, b] = [35, 15];
const [g, x, y] = extendedGCD(a, b);
console.log(`\nExtended GCD: ${a}*(${x}) + ${b}*(${y}) = ${g}`);

// LCM
console.log(`\nLCM(12, 18) = ${lcm(12, 18)}`);

// Modular inverse
console.log(`\nModular inverse of 3 mod 11: ${modInverse(3, 11)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Basic GCD (Iterative)** | O(log(min(a, b))) | Each step reduces problem size significantly |
| **Basic GCD (Recursive)** | O(log(min(a, b))) | Same complexity, but stack overhead |
| **Extended GCD** | O(log(min(a, b))) | Same as basic with constant extra work |
| **LCM** | O(log(min(a, b))) | One GCD computation |
| **GCD of Array (n elements)** | O(n × log(max)) | GCD computed sequentially |

### Detailed Breakdown

**Why O(log(min(a, b)))?**

At each step of the algorithm:
- We compute `a % b` which is always less than `b/2` when `a > b`
- This means the second number at least halves every two iterations
- Therefore, the number of iterations is bounded by `2 × log₂(min(a, b))`

**Worst Case**: When inputs are consecutive Fibonacci numbers
- Example: `gcd(Fₙ, Fₙ₋₁)` takes exactly n-1 steps
- Since `Fₙ ≈ φⁿ/√5` where φ ≈ 1.618, we have n ≈ logφ(Fₙ)
- This confirms the O(log(min(a, b))) bound

---

## Space Complexity Analysis

| Implementation | Space Complexity | Notes |
|----------------|------------------|-------|
| **Iterative GCD** | O(1) | Only uses a few variables |
| **Recursive GCD** | O(log(min(a, b))) | Recursion stack depth |
| **Extended GCD** | O(log(min(a, b))) | Recursion stack depth |
| **GCD of Array** | O(1) | Iterative, single result variable |

### Space Optimization

- **Iterative is preferred** for production code due to O(1) space
- **Recursive** is acceptable for educational purposes or when stack depth is limited
- **Tail recursion** optimization may help in some languages but iterative is still safer

---

## Common Variations

### 1. Binary GCD Algorithm (Stein's Algorithm)

Uses bit operations instead of division. Useful when division is expensive.

````carousel
```python
def gcd_binary(a: int, b: int) -> int:
    """
    Stein's Binary GCD Algorithm.
    Uses only subtraction, bit shifts, and comparisons.
    
    Time: O(log(min(a, b)))
    Space: O(1)
    """
    a, b = abs(a), abs(b)
    
    if a == 0:
        return b
    if b == 0:
        return a
    
    # Find the greatest power of 2 that divides both a and b
    shift = 0
    while ((a | b) & 1) == 0:  # Both even
        shift += 1
        a >>= 1
        b >>= 1
    
    # Remove remaining factors of 2 from a
    while (a & 1) == 0:
        a >>= 1
    
    # Main loop
    while b != 0:
        # Remove factors of 2 from b
        while (b & 1) == 0:
            b >>= 1
        
        # Ensure a <= b
        if a > b:
            a, b = b, a
        
        b = b - a
    
    return a << shift
```
````

### 2. GCD for Large Numbers (BigInt)

For numbers exceeding standard integer limits:

````carousel
```python
def gcd_bigint(a: str, b: str) -> str:
    """
    GCD for very large numbers represented as strings.
    Uses properties: gcd(a, b) = gcd(b, a mod b)
    
    For Python, int has arbitrary precision, but this shows the approach.
    """
    a_int = int(a)
    b_int = int(b)
    
    while b_int != 0:
        a_int, b_int = b_int, a_int % b_int
    
    return str(a_int)
```
````

### 3. GCD with Multiple Numbers

Finding GCD of an array efficiently:

````carousel
```python
def gcd_multiple(numbers: List[int]) -> int:
    """
    Find GCD of multiple numbers using the property:
    gcd(a, b, c) = gcd(gcd(a, b), c)
    
    Time: O(n × log(max))
    Space: O(1)
    """
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = gcd_iterative(result, num)
        if result == 1:  # Early termination
            return 1
    
    return result


def lcm_multiple(numbers: List[int]) -> int:
    """
    Find LCM of multiple numbers using:
    lcm(a, b, c) = lcm(lcm(a, b), c)
    
    Time: O(n × log(max))
    Space: O(1)
    """
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = lcm(result, num)
    
    return result
```
````

### 4. Coprime Check

Two numbers are coprime if their GCD is 1:

````carousel
```python
def are_coprime(a: int, b: int) -> bool:
    """Check if two numbers are coprime (relatively prime)."""
    return gcd_iterative(a, b) == 1


def euler_totient(n: int) -> int:
    """
    Count numbers from 1 to n that are coprime with n.
    Time: O(√n) using prime factorization or O(n log n) with GCD
    """
    count = 0
    for i in range(1, n + 1):
        if are_coprime(i, n):
            count += 1
    return count
```
````

---

## Practice Problems

### Problem 1: Greatest Common Divisor of Strings

**Problem:** [LeetCode 1071 - Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/)

**Description:** For two strings `str1` and `str2`, return the largest string `x` such that `x` divides both `str1` and `str2` (both can be formed by repeating `x`).

**How to Apply:**
- Use GCD on string lengths to find candidate length
- Verify if a substring of that length can form both strings
- Leverage the property: if `str1 + str2 == str2 + str1`, a GCD exists

---

### Problem 2: Minimize Maximum of Array After Operations

**Problem:** [LeetCode 2439 - Minimize Maximum of Array After Operations](https://leetcode.com/problems/minimize-maximum-of-array/)

**Description:** You can perform operations where you increment any element by 1 (up to a limit). Minimize the maximum value after all operations.

**How to Apply:**
- GCD helps determine the minimum possible maximum value
- The answer relates to finding a common divisor structure

---

### Problem 3: Replace Non-Coprime Numbers in Array

**Problem:** [LeetCode 2197 - Replace Non-Coprime Numbers in Array](https://leetcode.com/problems/replace-non-coprime-numbers-in-array/)

**Description:** Replace adjacent non-coprime numbers with their LCM repeatedly until all adjacent pairs are coprime.

**How to Apply:**
- Direct application of GCD to check coprimality
- Use LCM formula involving GCD: `lcm(a, b) = a × b / gcd(a, b)`
- Stack-based approach to handle replacements

---

### Problem 4: Check if Array is Good

**Problem:** [LeetCode 2780 - Minimum Index of a Valid Split](https://leetcode.com/problems/minimum-index-of-a-valid-split/)

**Description:** Find if there's a split point where the dominant element in the left part equals the dominant element in the right part.

**How to Apply:**
- Use GCD concepts for frequency analysis
- Boyer-Moore voting algorithm combined with GCD properties

---

### Problem 5: Maximize Score of Numbers in Ranges

**Problem:** [LeetCode 2513 - Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays/)

**Description:** Find the minimum possible maximum number when constructing two arrays with specific divisibility constraints.

**How to Apply:**
- Binary search on the answer
- Use LCM and GCD to validate if a candidate maximum works
- Apply inclusion-exclusion principle with LCM

---

## Video Tutorial Links

### Fundamentals

- [Euclidean Algorithm - Number Theory](https://www.youtube.com/watch?v=H1AE2Se8A5E) - Comprehensive explanation with proofs
- [Extended Euclidean Algorithm](https://www.youtube.com/watch?v=hB34-GSDT3k) - Finding modular inverses
- [GCD and LCM Explained](https://www.youtube.com/watch?v=pTaVdNVXK0w) - Basic to advanced concepts

### Advanced Topics

- [Binary GCD Algorithm (Stein's)](https://www.youtube.com/watch?v=vz95H7VwBbw) - Division-free approach
- [Applications of GCD in Competitive Programming](https://www.youtube.com/watch?v=8h4oMSzDdhs) - Real contest problems
- [Modular Arithmetic & GCD](https://www.youtube.com/watch?v=7VsylygkODs) - Cryptography applications

### Problem Solving

- [LeetCode GCD Problems Walkthrough](https://www.youtube.com/watch?v=8h4oMSzDdhs) - Step-by-step solutions
- [GCD of Strings Explained](https://www.youtube.com/watch?v=i5I_wM8oQPM) - LeetCode 1071 deep dive
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=5yJ_3Qj-eFI) - GCD and beyond

---

## Follow-up Questions

### Q1: Why is the Euclidean algorithm so efficient compared to finding all divisors?

**Answer:** The Euclidean algorithm reduces the problem size exponentially at each step by using the modulo operation. Finding all divisors requires checking up to √n numbers (O(√n)), while Euclidean runs in O(log(min(a, b))), which is significantly faster for large numbers.

---

### Q2: Can the Euclidean algorithm handle negative numbers? Zero?

**Answer:** 
- **Negative numbers**: Yes, GCD is typically defined as a positive number, so we take absolute values first
- **Zero**: `gcd(a, 0) = |a|` and `gcd(0, 0)` is typically defined as 0 (though mathematically undefined)
- **Implementation**: Always use `abs()` at the start or check for zero cases

---

### Q3: What is the Extended Euclidean Algorithm used for?

**Answer:** The Extended Euclidean Algorithm finds integers `x` and `y` such that `ax + by = gcd(a, b)`. Key applications:
- **Modular multiplicative inverse**: Finding `a⁻¹ (mod m)` when `gcd(a, m) = 1`
- **Cryptography**: RSA encryption/decryption relies on modular inverses
- **Diophantine equations**: Solving equations of the form `ax + by = c`
- **Linear congruences**: Solving `ax ≡ b (mod m)`

---

### Q4: When should I use the Binary GCD (Stein's) algorithm instead?

**Answer:** Use Binary GCD when:
- Division operations are expensive (certain embedded systems)
- Working with very large integers on hardware without fast division
- Bit operations are significantly faster than arithmetic operations
- Implementing in hardware where subtraction and bit shifts are cheaper

For most modern CPUs, the standard Euclidean algorithm is faster due to optimized division hardware.

---

### Q5: How does GCD relate to LCM? What's the formula?

**Answer:** The fundamental relationship is:
```
gcd(a, b) × lcm(a, b) = |a × b|
```

Therefore:
```
lcm(a, b) = |a × b| / gcd(a, b)
```

This is useful because:
- Computing GCD is O(log(min(a, b))) while naive LCM requires prime factorization
- For large numbers, direct multiplication might overflow; use: `lcm(a, b) = a / gcd(a, b) × b`
- For multiple numbers: `lcm(a, b, c) = lcm(lcm(a, b), c)`

---

## Summary

The **Euclidean Algorithm** is one of the most elegant and efficient algorithms in computer science and mathematics:

### Key Takeaways

- **O(log(min(a, b))) time complexity** - incredibly fast even for very large numbers
- **O(1) space with iterative version** - memory efficient
- **Based on simple mathematical property**: `gcd(a, b) = gcd(b, a mod b)`
- **Foundation for many applications**: LCM, modular arithmetic, cryptography

### When to Use

- ✅ Finding GCD of any two integers
- ✅ Computing LCM efficiently
- ✅ Simplifying fractions to lowest terms
- ✅ Finding modular multiplicative inverses (with Extended GCD)
- ✅ Solving Diophantine equations
- ✅ Cryptographic applications (RSA, etc.)

### Implementation Tips

1. **Prefer iterative over recursive** for production code (avoids stack overflow)
2. **Always handle negative inputs** by taking absolute values
3. **Use early termination** when computing GCD of arrays (if result becomes 1)
4. **Watch for integer overflow** when computing LCM of large numbers

### Related Algorithms

- [Extended Euclidean Algorithm](./extended-euclidean.md) - For modular inverses
- [Binary GCD (Stein's)](./binary-gcd.md) - Division-free alternative
- [Prime Factorization](./prime-factorization.md) - Alternative for small numbers
- [Chinese Remainder Theorem](./chinese-remainder.md) - Uses GCD for solving congruences

---

**Mastering the Euclidean Algorithm is essential for competitive programming and technical interviews, as it forms the foundation of many number theory problems.**
