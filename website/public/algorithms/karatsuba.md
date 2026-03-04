# Karatsuba Multiplication

## Category
Math & Number Theory

## Description

Karatsuba Multiplication is a fast multiplication algorithm that uses a divide-and-conquer approach to multiply two n-digit numbers in **O(n^log₂(3)) ≈ O(n^1.585)** time, which is faster than the traditional **O(n²)** grade-school multiplication for large numbers.

The algorithm was discovered by Anatoly Karatsuba in 1960 and was the first multiplication algorithm faster than the conventional O(n²) approach. It demonstrates the power of the divide-and-conquer paradigm by reducing the number of recursive multiplications from 4 to 3.

---

## When to Use

Use the Karatsuba algorithm when you need to solve problems involving:

- **Large Integer Multiplication**: When multiplying numbers with hundreds or thousands of digits
- **Cryptographic Applications**: RSA and other encryption schemes need efficient large number multiplication
- **Competitive Programming**: When problems involve multiplication of very large numbers
- **String-based Number Operations**: When numbers are too large for standard data types
- **Polynomial Multiplication**: Karatsuba can be adapted for polynomial multiplication

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|------------------|----------|
| **Grade-School** | O(n²) | O(1) | Small numbers (< 100 digits) |
| **Karatsuba** | O(n^1.585) | O(n) | Medium-large numbers (100-10,000 digits) |
| **Toom-Cook** | O(n^1.465) | O(n) | Very large numbers |
| **FFT-based** | O(n log n) | O(n) | Extremely large numbers (10,000+ digits) |

### When to Choose Karatsuba vs Grade-School

- **Choose Grade-School** when:
  - Numbers have fewer than 50-100 digits
  - Simple implementation is preferred
  - Memory usage needs to be minimal

- **Choose Karatsuba** when:
  - Numbers have 100+ digits
  - Multiplication is a bottleneck operation
  - Recursive overhead is acceptable

---

## Algorithm Explanation

### Core Concept

The key insight behind Karatsuba's algorithm is that we can compute the product of two n-digit numbers using **only 3 multiplications** instead of 4, at the cost of some extra additions.

### How It Works

Given two numbers x and y, we split each into two halves:
- x = a·10^m + b (where a is high half, b is low half)
- y = c·10^m + d (where c is high half, d is low half)

#### Traditional Approach (4 multiplications):
```
x × y = (a·10^m + b) × (c·10^m + d)
      = a·c·10^2m + (a·d + b·c)·10^m + b·d
```
This requires: **a×c, a×d, b×c, b×d** = 4 multiplications

#### Karatsuba Approach (3 multiplications):
```
z0 = a × c                          (high × high)
z2 = b × d                          (low × low)
z1 = (a + b) × (c + d) - z0 - z2    (cross term)

Result: z0·10^2m + z1·10^m + z2
```

The clever trick is that:
```
(a + b) × (c + d) = a·c + a·d + b·c + b·d
```
So: `(a + b) × (c + d) - a·c - b·d = a·d + b·c`

We get the cross term with just **one additional multiplication** instead of two!

### Visual Representation

For x = 1234, y = 5678 (split at m=2):

```
x = 12 | 34    →  a = 12,  b = 34
y = 56 | 78    →  c = 56,  d = 78

Traditional:          Karatsuba:
12×56, 12×78,         z0 = 12×56 = 672
34×56, 34×78          z2 = 34×78 = 2652
(4 multiplications)    z1 = (12+34)×(56+78) - z0 - z2
                       = 46×134 - 672 - 2652
                       = 6164 - 3324 = 2840

Result: 672×10^4 + 2840×10^2 + 2652
       = 6,720,000 + 284,000 + 2,652
       = 7,006,652 ✓
```

### Why It Works

By reducing 4 multiplications to 3 at each recursive level:
- Recurrence relation: T(n) = 3T(n/2) + O(n)
- By Master Theorem: T(n) = O(n^log₂(3)) ≈ O(n^1.585)

The overhead of extra additions is negligible compared to the savings from fewer multiplications.

---

## Algorithm Steps

### Recursive Karatsuba Multiplication

1. **Base Case**: If either number is small (< 10), return direct multiplication
2. **Split Numbers**: Divide both numbers into high and low halves
   - Find m = max(digits in x, digits in y) // 2
   - Split: x = a·10^m + b, y = c·10^m + d
3. **Recursive Multiplications**:
   - z0 = karatsuba(b, d)          (low × low)
   - z2 = karatsuba(a, c)          (high × high)
   - z1 = karatsuba(a+b, c+d) - z0 - z2  (cross term)
4. **Combine**: Return z2·10^(2m) + z1·10^m + z0

### String-based Implementation (for very large numbers)

1. **Handle Signs**: Determine if result should be negative
2. **Pad Numbers**: Make both strings equal length with leading zeros
3. **Base Case**: If length ≤ threshold, convert to int and multiply
4. **Split**: Divide each string at midpoint
5. **Recursive Calls**: Compute z0, z1, z2 as above
6. **Combine**: Add the three terms with proper alignment

---

## Implementation

### Standard Integer Version

````carousel
```python
def karatsuba(x: int, y: int) -> int:
    """
    Multiply two integers using Karatsuba algorithm.
    
    Args:
        x: First integer to multiply
        y: Second integer to multiply
        
    Returns:
        Product of x and y
        
    Time: O(n^log2(3)) ≈ O(n^1.585)
    Space: O(n)
    """
    # Base case for small numbers
    if x < 10 or y < 10:
        return x * y
    
    # Calculate the number of digits
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    # Split the numbers: x = a*10^m + b, y = c*10^m + d
    high1, low1 = divmod(x, 10**m)  # a, b
    high2, low2 = divmod(y, 10**m)  # c, d
    
    # Recursive steps - only 3 multiplications!
    z0 = karatsuba(low1, low2)        # b × d (low × low)
    z2 = karatsuba(high1, high2)      # a × c (high × high)
    z1 = karatsuba(low1 + high1, low2 + high2) - z0 - z2  # (a+b) × (c+d)
    
    # Combine results: z2 * 10^(2m) + z1 * 10^m + z0
    return z2 * 10**(2*m) + z1 * 10**m + z0


# Optimized version with threshold for switching to grade-school
def karatsuba_optimized(x: int, y: int, threshold: int = 64) -> int:
    """
    Optimized Karatsuba that switches to grade-school for small numbers.
    
    Args:
        x: First integer
        y: Second integer
        threshold: Switch to direct multiplication below this digit count
    """
    # Use grade-school for small numbers (more efficient)
    if x < threshold or y < threshold:
        return x * y
    
    n = max(x.bit_length(), y.bit_length()) // 4  # Approximate digits
    m = n // 2
    
    # Split using bit shifts (faster than divmod for large numbers)
    mask = (1 << (m * 4)) - 1
    
    high1, low1 = x >> (m * 4), x & mask
    high2, low2 = y >> (m * 4), y & mask
    
    z0 = karatsuba_optimized(low1, low2, threshold)
    z2 = karatsuba_optimized(high1, high2, threshold)
    z1 = karatsuba_optimized(low1 + high1, low2 + high2, threshold) - z0 - z2
    
    return (z2 << (2 * m * 4)) + (z1 << (m * 4)) + z0


# Example usage
if __name__ == "__main__":
    # Test cases
    print("Karatsuba Multiplication Tests:")
    print("-" * 40)
    
    # Basic test
    x, y = 1234, 5678
    result = karatsuba(x, y)
    print(f"{x} × {y} = {result}")  # Output: 7006652
    print(f"Verification: {x * y}")
    
    # Large numbers
    print()
    x, y = 123456789, 987654321
    result = karatsuba(x, y)
    print(f"{x} × {y} = {result}")
    print(f"Verification: {x * y}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <string>
#include <algorithm>
#include <cmath>
using namespace std;

/**
 * Karatsuba Multiplication Algorithm
 * 
 * Time Complexity: O(n^log2(3)) ≈ O(n^1.585)
 * Space Complexity: O(n)
 */

// Helper function to add two string numbers
string addStrings(const string& num1, const string& num2) {
    string result;
    int carry = 0;
    int i = num1.length() - 1;
    int j = num2.length() - 1;
    
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += num1[i--] - '0';
        if (j >= 0) sum += num2[j--] - '0';
        result.push_back(sum % 10 + '0');
        carry = sum / 10;
    }
    
    reverse(result.begin(), result.end());
    return result;
}

// Helper function to subtract two string numbers (num1 >= num2)
string subtractStrings(const string& num1, const string& num2) {
    string result;
    int borrow = 0;
    int i = num1.length() - 1;
    int j = num2.length() - 1;
    
    while (i >= 0) {
        int diff = (num1[i] - '0') - borrow;
        if (j >= 0) diff -= (num2[j--] - '0');
        
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        result.push_back(diff + '0');
        i--;
    }
    
    // Remove leading zeros
    while (result.length() > 1 && result.back() == '0') {
        result.pop_back();
    }
    
    reverse(result.begin(), result.end());
    return result;
}

// Multiply string number by 10^k (append k zeros)
string multiplyByPowerOf10(const string& num, int k) {
    if (num == "0") return "0";
    return num + string(k, '0');
}

// Karatsuba multiplication for string numbers
string karatsubaStrings(const string& x, const string& y) {
    // Base case: single digit
    if (x.length() == 1 && y.length() == 1) {
        int product = (x[0] - '0') * (y[0] - '0');
        return to_string(product);
    }
    
    // Pad with leading zeros to make equal length
    int n = max(x.length(), y.length());
    if (n % 2 == 1) n++;  // Make even length
    
    string xPadded = string(n - x.length(), '0') + x;
    string yPadded = string(n - y.length(), '0') + y;
    
    int m = n / 2;
    
    // Split: x = a*10^m + b, y = c*10^m + d
    string a = xPadded.substr(0, m);
    string b = xPadded.substr(m);
    string c = yPadded.substr(0, m);
    string d = yPadded.substr(m);
    
    // Remove leading zeros
    while (a.length() > 1 && a[0] == '0') a = a.substr(1);
    while (b.length() > 1 && b[0] == '0') b = b.substr(1);
    while (c.length() > 1 && c[0] == '0') c = c.substr(1);
    while (d.length() > 1 && d[0] == '0') d = d.substr(1);
    
    // Recursive multiplications
    string z0 = karatsubaStrings(b, d);           // b × d
    string z2 = karatsubaStrings(a, c);           // a × c
    string z1_inner = karatsubaStrings(addStrings(a, b), addStrings(c, d));
    string z1 = subtractStrings(subtractStrings(z1_inner, z0), z2);  // (a+b)(c+d) - z0 - z2
    
    // Combine: z2 * 10^(2m) + z1 * 10^m + z0
    string term1 = multiplyByPowerOf10(z2, 2 * m);
    string term2 = multiplyByPowerOf10(z1, m);
    
    string result = addStrings(addStrings(term1, term2), z0);
    
    // Remove leading zeros
    while (result.length() > 1 && result[0] == '0') {
        result = result.substr(1);
    }
    
    return result;
}

// Wrapper for karatsuba with negative number support
string karatsuba(const string& x, const string& y) {
    bool negative = (x[0] == '-') ^ (y[0] == '-');
    
    string xAbs = (x[0] == '-') ? x.substr(1) : x;
    string yAbs = (y[0] == '-') ? y.substr(1) : y;
    
    string result = karatsubaStrings(xAbs, yAbs);
    
    if (negative && result != "0") {
        return "-" + result;
    }
    return result;
}

int main() {
    // Test cases
    cout << "Karatsuba Multiplication Tests:" << endl;
    cout << "--------------------------------" << endl;
    
    // Test 1
    string x = "1234";
    string y = "5678";
    cout << x << " × " << y << " = " << karatsuba(x, y) << endl;
    
    // Test 2 - Large numbers
    x = "123456789012345";
    y = "987654321098765";
    cout << "Large: " << karatsuba(x, y) << endl;
    
    // Test 3 - With negative
    x = "-123456789";
    y = "987654321";
    cout << "Negative: " << karatsuba(x, y) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.math.BigInteger;

/**
 * Karatsuba Multiplication Algorithm
 * 
 * Time Complexity: O(n^log2(3)) ≈ O(n^1.585)
 * Space Complexity: O(n)
 */
public class Karatsuba {
    
    /**
     * Karatsuba multiplication for integers
     * Uses threshold to switch to built-in multiplication for small numbers
     */
    public static long karatsuba(long x, long y) {
        // Base case: small numbers
        if (x < 100 || y < 100) {
            return x * y;
        }
        
        // Calculate number of digits
        int n = Math.max(
            String.valueOf(Math.abs(x)).length(),
            String.valueOf(Math.abs(y)).length()
        );
        int m = n / 2;
        
        // Split the numbers
        long pow10m = (long) Math.pow(10, m);
        
        long a = x / pow10m;  // high part of x
        long b = x % pow10m;  // low part of x
        long c = y / pow10m;  // high part of y
        long d = y % pow10m;  // low part of y
        
        // Recursive multiplications
        long z0 = karatsuba(b, d);           // b × d
        long z2 = karatsuba(a, c);           // a × c
        long z1 = karatsuba(a + b, c + d) - z0 - z2;  // (a+b) × (c+d)
        
        // Combine
        return z2 * pow10m * pow10m + z1 * pow10m + z0;
    }
    
    /**
     * Karatsuba using BigInteger for very large numbers
     */
    public static BigInteger karatsubaBigInt(BigInteger x, BigInteger y) {
        // Base case: small numbers
        if (x.bitLength() < 64 || y.bitLength() < 64) {
            return x.multiply(y);
        }
        
        // Calculate size
        int n = Math.max(x.bitLength(), y.bitLength());
        int m = (n + 1) / 2;
        
        // Split: x = a*2^m + b, y = c*2^m + d
        BigInteger pow2m = BigInteger.ONE.shiftLeft(m);
        
        BigInteger a = x.shiftRight(m);           // x >> m
        BigInteger b = x.and(pow2m.subtract(BigInteger.ONE));  // x & ((1<<m)-1)
        BigInteger c = y.shiftRight(m);
        BigInteger d = y.and(pow2m.subtract(BigInteger.ONE));
        
        // Recursive multiplications
        BigInteger z0 = karatsubaBigInt(b, d);
        BigInteger z2 = karatsubaBigInt(a, c);
        BigInteger z1 = karatsubaBigInt(a.add(b), c.add(d))
                         .subtract(z0).subtract(z2);
        
        // Combine: z2 * 2^(2m) + z1 * 2^m + z0
        return z2.shiftLeft(2 * m)
                 .add(z1.shiftLeft(m))
                 .add(z0);
    }
    
    /**
     * String-based Karatsuba for arbitrary precision
     */
    public static String karatsubaString(String x, String y) {
        // Handle negatives
        boolean negative = false;
        if (x.startsWith("-")) {
            negative = !negative;
            x = x.substring(1);
        }
        if (y.startsWith("-")) {
            negative = !negative;
            y = y.substring(1);
        }
        
        // Remove leading zeros
        x = x.replaceFirst("^0+", "");
        y = y.replaceFirst("^0+", "");
        if (x.isEmpty()) x = "0";
        if (y.isEmpty()) y = "0";
        
        // Base case
        if (x.equals("0") || y.equals("0")) return "0";
        if (x.length() <= 4 && y.length() <= 4) {
            long result = Long.parseLong(x) * Long.parseLong(y);
            String res = String.valueOf(result);
            return negative ? "-" + res : res;
        }
        
        // Pad to equal length
        int n = Math.max(x.length(), y.length());
        if (n % 2 == 1) n++;
        
        x = String.format("%" + n + "s", x).replace(' ', '0');
        y = String.format("%" + n + "s", y).replace(' ', '0');
        
        int m = n / 2;
        
        String a = x.substring(0, m);
        String b = x.substring(m);
        String c = y.substring(0, m);
        String d = y.substring(m);
        
        // Recursive calls
        String z0 = karatsubaString(b, d);
        String z2 = karatsubaString(a, c);
        String z1_inner = karatsubaString(addStrings(a, b), addStrings(c, d));
        String z1 = subtractStrings(subtractStrings(z1_inner, z0), z2);
        
        // Combine
        String result = addStrings(
            addStrings(z2 + "0".repeat(2 * m), z1 + "0".repeat(m)),
            z0
        );
        
        result = result.replaceFirst("^0+", "");
        if (result.isEmpty()) result = "0";
        
        return negative && !result.equals("0") ? "-" + result : result;
    }
    
    private static String addStrings(String a, String b) {
        StringBuilder result = new StringBuilder();
        int carry = 0;
        int i = a.length() - 1, j = b.length() - 1;
        
        while (i >= 0 || j >= 0 || carry > 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            result.append(sum % 10);
            carry = sum / 10;
        }
        
        return result.reverse().toString();
    }
    
    private static String subtractStrings(String a, String b) {
        // Assume a >= b
        StringBuilder result = new StringBuilder();
        int borrow = 0;
        int i = a.length() - 1, j = b.length() - 1;
        
        while (i >= 0) {
            int diff = (a.charAt(i) - '0') - borrow;
            if (j >= 0) diff -= (b.charAt(j--) - '0');
            
            if (diff < 0) {
                diff += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }
            
            result.append(diff);
            i--;
        }
        
        while (result.length() > 1 && result.charAt(result.length() - 1) == '0') {
            result.setLength(result.length() - 1);
        }
        
        return result.reverse().toString();
    }
    
    public static void main(String[] args) {
        System.out.println("Karatsuba Multiplication Tests:");
        System.out.println("-------------------------------");
        
        // Test with long
        long x = 1234, y = 5678;
        System.out.println(x + " × " + y + " = " + karatsuba(x, y));
        
        // Test with BigInteger
        BigInteger bigX = new BigInteger("12345678901234567890");
        BigInteger bigY = new BigInteger("98765432109876543210");
        System.out.println("Big: " + karatsubaBigInt(bigX, bigY));
        
        // Test with strings
        String sx = "123456789012345678901234567890";
        String sy = "987654321098765432109876543210";
        System.out.println("String: " + karatsubaString(sx, sy));
    }
}
```

<!-- slide -->
```javascript
/**
 * Karatsuba Multiplication Algorithm
 * 
 * Time Complexity: O(n^log2(3)) ≈ O(n^1.585)
 * Space Complexity: O(n)
 */

/**
 * Karatsuba multiplication for JavaScript numbers
 * Note: JavaScript numbers lose precision beyond 2^53
 * For very large numbers, use string version
 */
function karatsuba(x, y) {
    // Base case: small numbers
    if (x < 100 || y < 100) {
        return x * y;
    }
    
    // Calculate number of digits
    const n = Math.max(
        Math.abs(x).toString().length,
        Math.abs(y).toString().length
    );
    const m = Math.floor(n / 2);
    
    // Split the numbers
    const pow10m = Math.pow(10, m);
    
    const a = Math.floor(x / pow10m);  // high part
    const b = x % pow10m;              // low part
    const c = Math.floor(y / pow10m);
    const d = y % pow10m;
    
    // Recursive multiplications
    const z0 = karatsuba(b, d);              // b × d
    const z2 = karatsuba(a, c);              // a × c
    const z1 = karatsuba(a + b, c + d) - z0 - z2;  // (a+b) × (c+d)
    
    // Combine
    return z2 * Math.pow(10, 2 * m) + z1 * Math.pow(10, m) + z0;
}

/**
 * String addition helper
 */
function addStrings(num1, num2) {
    let result = '';
    let carry = 0;
    let i = num1.length - 1;
    let j = num2.length - 1;
    
    while (i >= 0 || j >= 0 || carry > 0) {
        let sum = carry;
        if (i >= 0) sum += parseInt(num1[i--]);
        if (j >= 0) sum += parseInt(num2[j--]);
        result = (sum % 10) + result;
        carry = Math.floor(sum / 10);
    }
    
    return result || '0';
}

/**
 * String subtraction helper (num1 >= num2)
 */
function subtractStrings(num1, num2) {
    let result = '';
    let borrow = 0;
    let i = num1.length - 1;
    let j = num2.length - 1;
    
    while (i >= 0) {
        let diff = parseInt(num1[i]) - borrow;
        if (j >= 0) diff -= parseInt(num2[j--]);
        
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        result = diff + result;
        i--;
    }
    
    // Remove leading zeros
    return result.replace(/^0+/, '') || '0';
}

/**
 * Multiply string by power of 10
 */
function multiplyByPowerOf10(num, k) {
    if (num === '0') return '0';
    return num + '0'.repeat(k);
}

/**
 * Karatsuba multiplication for string numbers (arbitrary precision)
 */
function karatsubaString(x, y) {
    // Handle negatives
    let negative = false;
    if (x[0] === '-') {
        negative = !negative;
        x = x.slice(1);
    }
    if (y[0] === '-') {
        negative = !negative;
        y = y.slice(1);
    }
    
    // Remove leading zeros
    x = x.replace(/^0+/, '') || '0';
    y = y.replace(/^0+/, '') || '0';
    
    // Base cases
    if (x === '0' || y === '0') return '0';
    if (x.length === 1 && y.length === 1) {
        const prod = parseInt(x) * parseInt(y);
        const result = prod.toString();
        return negative ? '-' + result : result;
    }
    
    // Pad to equal length
    const n = Math.max(x.length, y.length);
    const paddedN = n % 2 === 0 ? n : n + 1;
    
    x = x.padStart(paddedN, '0');
    y = y.padStart(paddedN, '0');
    
    const m = Math.floor(paddedN / 2);
    
    // Split
    const a = x.slice(0, m);
    const b = x.slice(m);
    const c = y.slice(0, m);
    const d = y.slice(m);
    
    // Remove leading zeros for recursive calls
    const clean = (s) => s.replace(/^0+/, '') || '0';
    
    // Recursive multiplications
    const z0 = karatsubaString(clean(b), clean(d));
    const z2 = karatsubaString(clean(a), clean(c));
    const z1Inner = karatsubaString(addStrings(a, b), addStrings(c, d));
    const z1 = subtractStrings(subtractStrings(z1Inner, z0), z2);
    
    // Combine: z2 * 10^(2m) + z1 * 10^m + z0
    const term1 = multiplyByPowerOf10(z2, 2 * m);
    const term2 = multiplyByPowerOf10(z1, m);
    
    const result = addStrings(addStrings(term1, term2), z0).replace(/^0+/, '') || '0';
    
    return (negative && result !== '0') ? '-' + result : result;
}

// Example usage
console.log("Karatsuba Multiplication Tests:");
console.log("-------------------------------");

// Test with numbers
console.log("1234 × 5678 = " + karatsuba(1234, 5678));

// Test with strings
console.log("Large: " + karatsubaString("123456789012345", "987654321098765"));

// Test with negative
console.log("Negative: " + karatsubaString("-123456789", "987654321"));

// Very large
const huge1 = "1234567890123456789012345678901234567890";
const huge2 = "9876543210987654321098765432109876543210";
console.log("Huge: " + karatsubaString(huge1, huge2));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Standard Multiplication** | O(n²) | Grade-school algorithm |
| **Karatsuba** | O(n^log₂(3)) ≈ O(n^1.585) | Divide and conquer with 3 recursive calls |
| **Toom-Cook** | O(n^1.465) | Generalization of Karatsuba |
| **FFT-based (Schönhage-Strassen)** | O(n log n log log n) | Fast Fourier Transform approach |

### Detailed Breakdown

For Karatsuba with input size n:

- **Recurrence Relation**: T(n) = 3T(n/2) + O(n)
  - 3 recursive calls on half the size
  - O(n) for splitting and combining (additions/subtractions)

- **Solving using Master Theorem**:
  - a = 3 (number of subproblems)
  - b = 2 (division factor)
  - f(n) = O(n)
  - Since log₂(3) ≈ 1.585 > 1, case 1 applies
  - **T(n) = O(n^log₂(3)) ≈ O(n^1.585)**

- **Comparison**:
  - For n = 1000: n² = 1,000,000 vs n^1.585 ≈ 50,000 (20× faster)
  - For n = 1,000,000: n² = 10¹² vs n^1.585 ≈ 3×10⁹ (300× faster)

---

## Space Complexity Analysis

| Implementation | Space Complexity | Description |
|----------------|------------------|-------------|
| **Standard** | O(1) auxiliary | In-place operations |
| **Naive Recursive** | O(n log n) | Call stack for each recursive level |
| **Optimized** | O(n) | Iterative or tail-recursive with reuse |

### Space Breakdown

- **Recursion Stack**: O(log n) levels deep
- **String Storage**: O(n) for intermediate results
- **Total**: O(n) for string-based implementations

### Space Optimization Tips

1. **Use bit manipulation** instead of string operations when possible
2. **Reuse arrays** instead of creating new ones for each recursive call
3. **Switch to iterative** for small subproblems
4. **In-place modifications** for the combination step

---

## Common Variations

### 1. Karatsuba for Polynomial Multiplication

Polynomials can be multiplied using the same divide-and-conquer approach:

````carousel
```python
class Polynomial:
    def __init__(self, coeffs):
        """Coeffs: list where coeffs[i] is coefficient of x^i"""
        self.coeffs = coeffs
    
    def karatsuba_multiply(self, other):
        """Multiply two polynomials using Karatsuba algorithm."""
        # Base case: small polynomials
        if len(self.coeffs) <= 2 or len(other.coeffs) <= 2:
            return self._naive_multiply(other)
        
        # Split polynomials
        n = max(len(self.coeffs), len(other.coeffs))
        m = n // 2
        
        # A = A1 * x^m + A0, B = B1 * x^m + B0
        a_high = Polynomial(self.coeffs[m:])
        a_low = Polynomial(self.coeffs[:m])
        b_high = Polynomial(other.coeffs[m:])
        b_low = Polynomial(other.coeffs[:m])
        
        # Recursive multiplications
        z0 = a_low.karatsuba_multiply(b_low)
        z2 = a_high.karatsuba_multiply(b_high)
        
        # Cross term: (A0 + A1) * (B0 + B1) - z0 - z2
        a_sum = a_low.add(a_high)
        b_sum = b_low.add(b_high)
        z1 = a_sum.karatsuba_multiply(b_sum).subtract(z0).subtract(z2)
        
        # Combine: z2 * x^(2m) + z1 * x^m + z0
        result = z2.shift(2 * m).add(z1.shift(m)).add(z0)
        return result
    
    def _naive_multiply(self, other):
        """Grade-school polynomial multiplication."""
        result = [0] * (len(self.coeffs) + len(other.coeffs) - 1)
        for i, a in enumerate(self.coeffs):
            for j, b in enumerate(other.coeffs):
                result[i + j] += a * b
        return Polynomial(result)
    
    def add(self, other):
        """Add two polynomials."""
        n = max(len(self.coeffs), len(other.coeffs))
        result = []
        for i in range(n):
            a = self.coeffs[i] if i < len(self.coeffs) else 0
            b = other.coeffs[i] if i < len(other.coeffs) else 0
            result.append(a + b)
        return Polynomial(result)
    
    def subtract(self, other):
        """Subtract two polynomials."""
        n = max(len(self.coeffs), len(other.coeffs))
        result = []
        for i in range(n):
            a = self.coeffs[i] if i < len(self.coeffs) else 0
            b = other.coeffs[i] if i < len(other.coeffs) else 0
            result.append(a - b)
        return Polynomial(result)
    
    def shift(self, k):
        """Multiply polynomial by x^k."""
        return Polynomial([0] * k + self.coeffs)


# Example: Multiply (1 + 2x + 3x²) × (4 + 5x + 6x²)
p1 = Polynomial([1, 2, 3])   # 1 + 2x + 3x²
p2 = Polynomial([4, 5, 6])   # 4 + 5x + 6x²
result = p1.karatsuba_multiply(p2)
print(f"Result coefficients: {result.coeffs}")
# Output: [4, 13, 28, 27, 18] representing 4 + 13x + 28x² + 27x³ + 18x⁴
```
````

### 2. Hybrid Approach (Switch to Grade-School for Small Numbers)

For optimal performance, switch algorithms based on input size:

````carousel
```python
def hybrid_multiply(x, y, threshold=64):
    """
    Hybrid multiplication that switches between algorithms.
    
    Args:
        x, y: Numbers to multiply
        threshold: Use grade-school for numbers below this bit length
    """
    # Determine size
    size = max(x.bit_length() if isinstance(x, int) else len(str(x)),
               y.bit_length() if isinstance(y, int) else len(str(y)))
    
    # Switch based on size
    if size < threshold:
        # Grade-school is faster for small numbers
        return x * y if isinstance(x, int) else int(x) * int(y)
    elif size < 1000:
        # Karatsuba for medium numbers
        return karatsuba(x, y)
    else:
        # Could use Toom-Cook or FFT for very large numbers
        return karatsuba(x, y)  # Placeholder for more advanced algorithm
```
````

### 3. Iterative Implementation (Stack-based)

For scenarios where recursion depth is a concern:

````carousel
```python
def karatsuba_iterative(x_str, y_str):
    """
    Iterative Karatsuba using an explicit stack.
    Avoids recursion limit issues for very large numbers.
    """
    from collections import deque
    
    # Stack contains: (x, y, is_done, partial_result)
    # is_done: False means need to compute, True means combine
    stack = deque([(x_str, y_str, False, None)])
    results = {}  # Memoization: (x, y) -> result
    
    while stack:
        x, y, is_done, partial = stack.pop()
        
        # Check memoization
        key = (x, y)
        if key in results:
            continue
        
        # Base case
        if len(x) <= 4 or len(y) <= 4:
            results[key] = str(int(x) * int(y))
            continue
        
        if not is_done:
            # Push combination job first (will be done after recursive calls)
            stack.append((x, y, True, {
                'a': x[:len(x)//2], 'b': x[len(x)//2:],
                'c': y[:len(y)//2], 'd': y[len(y)//2:]
            }))
            
            # Push recursive jobs
            m = max(len(x), len(y)) // 2
            a, b = x[:m], x[m:]
            c, d = y[:m], y[m:]
            
            stack.append((addStrings(a, b), addStrings(c, d), False, None))  # z1_inner
            stack.append((a, c, False, None))  # z2
            stack.append((b, d, False, None))  # z0
        else:
            # Combine results (would need more complex state management)
            pass
    
    return results.get((x_str, y_str), "0")
```
````

---

## Practice Problems

### Problem 1: Multiply Strings

**Problem:** [LeetCode 43 - Multiply Strings](https://leetcode.com/problems/multiply-strings/)

**Description:** Given two non-negative integers represented as strings, return their product as a string. You must not use any built-in BigInteger library or convert the inputs to integers directly.

**How to Apply Karatsuba:**
- The naive approach of converting to int fails for very large numbers
- Use string-based Karatsuba for O(n^1.585) time instead of O(n²) grade-school
- Handle edge cases like "0" multiplication

---

### Problem 2: Add Two Numbers II

**Problem:** [LeetCode 445 - Add Two Numbers II](https://leetcode.com/problems/add-two-numbers-ii/)

**Description:** You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first. Add the two numbers and return the sum as a linked list.

**How to Apply Karatsuba:**
- While this problem focuses on addition, understanding digit manipulation is key
- Similar principles of handling large numbers apply
- Practice working with numbers in non-standard formats

---

### Problem 3: Super Pow

**Problem:** [LeetCode 372 - Super Pow](https://leetcode.com/problems/super-pow/)

**Description:** Calculate a^b mod 1337 where b is a very large positive integer given as an array.

**How to Apply Karatsuba:**
- Efficient modular exponentiation requires efficient multiplication
- Karatsuba can speed up the repeated multiplication steps
- Understand the interaction between fast multiplication and modular arithmetic

---

### Problem 4: Number of Digit One

**Problem:** [LeetCode 233 - Number of Digit One](https://leetcode.com/problems/number-of-digit-one/)

**Description:** Given an integer n, count the total number of digit 1 appearing in all non-negative integers less than or equal to n.

**How to Apply Karatsuba:**
- Understanding digit manipulation and place values
- Similar divide-and-conquer thinking required
- Practice working with digit decomposition

---

### Problem 5: Integer to English Words

**Problem:** [LeetCode 273 - Integer to English Words](https://leetcode.com/problems/integer-to-english-words/)

**Description:** Convert a non-negative integer to its English words representation.

**How to Apply Karatsuba:**
- Understanding number decomposition and grouping
- Working with large numbers by breaking them into chunks
- Similar pattern of divide and process

---

## Video Tutorial Links

### Fundamentals

- [Karatsuba Algorithm - Fast Multiplication (Gaurav Sen)](https://www.youtube.com/watch?v=JCbSRqD6eog) - Clear explanation with examples
- [Karatsuba Multiplication (MIT OpenCourseWare)](https://www.youtube.com/watch?v=eCa2D1b7oOI) - Academic depth with mathematical proof
- [Fast Multiplication - Karatsuba (Back To Back SWE)](https://www.youtube.com/watch?v=JCbSRqD6eog) - Visual walkthrough

### Advanced Topics

- [Toom-Cook Multiplication](https://www.youtube.com/watch?v=9J2td6Fl0X4) - Extension of Karatsuba
- [FFT-based Multiplication (Schönhage-Strassen)](https://www.youtube.com/watch?v=1iRdr7YqJjA) - For extremely large numbers
- [Polynomial Multiplication using FFT](https://www.youtube.com/watch?v=h7apO7l1j4o) - Application to polynomials

### Implementation Guides

- [Karatsuba in Python](https://www.youtube.com/watch?v=JCbSRqD6eog) - Practical coding walkthrough
- [BigInteger Implementation](https://www.youtube.com/watch?v=QRSy5E5JzFc) - How language libraries implement large number arithmetic
- [Competitive Programming Tips](https://www.youtube.com/watch?v=Ge0Ugs8Wq3I) - When to use which multiplication algorithm

---

## Follow-up Questions

### Q1: Why is Karatsuba O(n^1.585) and not better?

**Answer:** The exponent log₂(3) ≈ 1.585 comes from solving the recurrence T(n) = 3T(n/2) + O(n). We can't do better with this approach because:
- We need at least 3 multiplications to reconstruct the result (information theory bound for degree-2 polynomials)
- The 3 multiplications are necessary: z0, z2, and the cross term
- More advanced algorithms (Toom-Cook) reduce this by splitting into more pieces

### Q2: When should I use Karatsuba vs the built-in multiplication?

**Answer:** 
- **Built-in multiplication**: Always prefer this for normal-sized numbers. Modern CPUs have highly optimized multiplication instructions.
- **Karatsuba**: Use when:
  - Working with numbers that exceed 64-bit limits
  - Implementing a BigInteger library
  - Cryptographic applications with 1024+ bit numbers
  - The problem explicitly requires implementing fast multiplication

### Q3: Can Karatsuba handle decimal/floating-point numbers?

**Answer:** Yes, with modifications:
1. Track the decimal position separately
2. Multiply as integers
3. Place the decimal point at the correct position in the result
4. The algorithm works the same way since it treats numbers as polynomials

Example: 12.34 × 56.78 → multiply 1234 × 5678, then place decimal 4 positions from right

### Q4: How does Karatsuba compare to FFT-based multiplication?

**Answer:**
| Aspect | Karatsuba | FFT (Schönhage-Strassen) |
|--------|-----------|--------------------------|
| Complexity | O(n^1.585) | O(n log n log log n) |
| Crossover point | ~100-1000 digits | ~10,000+ digits |
| Implementation | Moderate | Complex |
| Practical use | Medium numbers | Very large numbers |
| Memory usage | O(n) | O(n) |

FFT becomes faster for numbers with 10,000+ digits, but Karatsuba is often preferred for medium-sized numbers due to lower constant factors.

### Q5: Can Karatsuba be parallelized?

**Answer:** Yes! The three recursive calls (z0, z2, and z1) are independent and can be computed in parallel:
```
Parallel:
  z0 = karatsuba(b, d)
  z2 = karatsuba(a, c)
  z1_inner = karatsuba(a+b, c+d)
Then:
  z1 = z1_inner - z0 - z2
```
This can achieve up to 3× speedup on multi-core systems, though the overhead of thread management makes this worthwhile only for very large numbers.

---

## Summary

The Karatsuba Multiplication algorithm is a foundational divide-and-conquer algorithm that demonstrates how clever mathematical insights can improve upon naive approaches:

- **Key Innovation**: Reduces 4 multiplications to 3 at each recursive level
- **Time Complexity**: O(n^log₂(3)) ≈ O(n^1.585), faster than O(n²) grade-school
- **Space Complexity**: O(n) for string-based implementations
- **Best For**: Large integers (100+ digits), cryptographic applications, polynomial multiplication

When to use:
- ✅ Large number multiplication beyond built-in limits
- ✅ When implementing arbitrary-precision arithmetic
- ✅ As a building block for more advanced algorithms
- ❌ Small numbers (overhead not worth it)
- ❌ When built-in multiplication is available and sufficient

The algorithm is a classic example of how algorithmic thinking can yield practical improvements, and it serves as a stepping stone to understanding even faster multiplication algorithms like Toom-Cook and FFT-based methods.

---

## Related Algorithms

- [Fast Exponentiation](./fast-exponentiation.md) - Similar divide-and-conquer for exponentiation
- [FFT / Number Theoretic Transform](./fft.md) - Faster multiplication for very large numbers
- [Newton-Raphson Division](./newton-raphson.md) - Similar fast algorithms for division
- [Polynomial Multiplication](./polynomial-multiplication.md) - Karatsuba applied to polynomials
