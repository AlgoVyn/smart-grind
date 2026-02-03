# Multiply Strings

## Problem Statement

LeetCode Problem 43: Multiply Strings

Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.

You must not use any built-in big integer library or convert the inputs directly to integers. The solution should handle very large numbers that exceed the range of standard integer types.

### Examples

Here are some examples to illustrate the problem:

- **Input:** `num1 = "2"`, `num2 = "3"`<br>
  **Output:** `"6"`<br>
  **Explanation:** Simple single-digit multiplication.

- **Input:** `num1 = "123"`, `num2 = "456"`<br>
  **Output:** `"56088"`<br>
  **Explanation:** Standard multiplication of two 3-digit numbers: 123 × 456 = 56088.

- **Input:** `num1 = "0"`, `num2 = "123"`<br>
  **Output:** `"0"`<br>
  **Explanation:** Any number multiplied by zero is zero.

- **Input:** `num1 = "999"`, `num2 = "999"`<br>
  **Output:** `"998001"`<br>
  **Explanation:** Large numbers demonstrate the need for manual multiplication simulation.

- **Input:** `num1 = "123456789"`, `num2 = "987654321"`<br>
  **Output:** `"121932631112635269"`<br>
  **Explanation:** Very large numbers where built-in integer types would overflow.

### Constraints

- `1 <= num1.length <= 110`
- `1 <= num2.length <= 110`
- Both `num1` and `num2` contain only digits ('0'-'9')
- Neither `num1` nor `num2` has any leading zeros (except "0" itself)

### Intuition

The key insight is to simulate the manual multiplication process we learned in school. When multiplying two numbers:

1. We multiply each digit of the first number by each digit of the second number.
2. The product of digits at positions `i` and `j` contributes to the result at positions `i+j` and `i+j+1`.
3. We need to handle carries that propagate from lower positions to higher positions.

For example, when multiplying "123" × "456":
- We multiply 3×6 = 18, placing 8 at position 0 and carrying 1 to position 1
- We multiply 2×6 + 3×5 + carry = 12 + 15 + 1 = 28, placing 8 at position 1 and carrying 2 to position 2
- And so on...

The result array has length `m + n` (where m and n are the lengths of num1 and num2) because the maximum product of two m-digit and n-digit numbers has at most `m + n` digits.

---

## Approach 1: Elementary School Multiplication (Primary and Efficient)

This approach directly simulates the manual multiplication process taught in school. We iterate through each digit of both numbers from right to left, multiply corresponding digits, and accumulate the results with proper carry handling.

### Implementation

````carousel
```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        # Handle zero case early
        if num1 == "0" or num2 == "0":
            return "0"
        
        m, n = len(num1), len(num2)
        # Result can have at most m + n digits
        result = [0] * (m + n)
        
        # Process from right to left (least significant digit first)
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                # Get digit values (char to int)
                digit1 = ord(num1[i]) - ord('0')
                digit2 = ord(num2[j]) - ord('0')
                
                # Calculate product and current position
                product = digit1 * digit2
                pos1 = i + j
                pos2 = i + j + 1
                
                # Add product to current position and handle carry
                total = product + result[pos2]
                result[pos2] = total % 10
                result[pos1] += total // 10
        
        # Convert result array to string, skip leading zeros
        result_str = "".join(map(str, result)).lstrip('0')
        return result_str if result_str else "0"
```

```java
class Solution {
    public String multiply(String num1, String num2) {
        // Handle zero case early
        if (num1.equals("0") || num2.equals("0")) {
            return "0";
        }
        
        int m = num1.length();
        int n = num2.length();
        // Result can have at most m + n digits
        int[] result = new int[m + n];
        
        // Process from right to left (least significant digit first)
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // Get digit values (char to int)
                int digit1 = num1.charAt(i) - '0';
                int digit2 = num2.charAt(j) - '0';
                
                // Calculate product and current position
                int product = digit1 * digit2;
                int pos1 = i + j;
                int pos2 = i + j + 1;
                
                // Add product to current position and handle carry
                int total = product + result[pos2];
                result[pos2] = total % 10;
                result[pos1] += total / 10;
            }
        }
        
        // Convert result array to string
        StringBuilder sb = new StringBuilder();
        for (int digit : result) {
            if (!(sb.length() == 0 && digit == 0)) {
                sb.append(digit);
            }
        }
        return sb.length() == 0 ? "0" : sb.toString();
    }
}
```

```cpp
#include <string>
#include <vector>

class Solution {
public:
    std::string multiply(std::string num1, std::string num2) {
        // Handle zero case early
        if (num1 == "0" || num2 == "0") {
            return "0";
        }
        
        int m = num1.length();
        int n = num2.length();
        // Result can have at most m + n digits
        std::vector<int> result(m + n, 0);
        
        // Process from right to left (least significant digit first)
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // Get digit values (char to int)
                int digit1 = num1[i] - '0';
                int digit2 = num2[j] - '0';
                
                // Calculate product and current position
                int product = digit1 * digit2;
                int pos1 = i + j;
                int pos2 = i + j + 1;
                
                // Add product to current position and handle carry
                int total = product + result[pos2];
                result[pos2] = total % 10;
                result[pos1] += total / 10;
            }
        }
        
        // Convert result array to string, skip leading zeros
        std::string resultStr;
        for (int digit : result) {
            if (!(resultStr.empty() && digit == 0)) {
                resultStr += std::to_string(digit);
            }
        }
        return resultStr.empty() ? "0" : resultStr;
    }
};
```

```javascript
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
    // Handle zero case early
    if (num1 === "0" || num2 === "0") {
        return "0";
    }
    
    const m = num1.length;
    const n = num2.length;
    // Result can have at most m + n digits
    const result = new Array(m + n).fill(0);
    
    // Process from right to left (least significant digit first)
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            // Get digit values (char to int)
            const digit1 = num1.charCodeAt(i) - 48; // 48 is ASCII for '0'
            const digit2 = num2.charCodeAt(j) - 48;
            
            // Calculate product and current position
            const product = digit1 * digit2;
            const pos1 = i + j;
            const pos2 = i + j + 1;
            
            // Add product to current position and handle carry
            const total = product + result[pos2];
            result[pos2] = total % 10;
            result[pos1] += Math.floor(total / 10);
        }
    }
    
    // Convert result array to string, skip leading zeros
    const resultStr = result.join('').replace(/^0+/, '');
    return resultStr === '' ? "0" : resultStr;
};
```
````

### Explanation Step-by-Step

1. **Early Zero Check:** If either number is "0", immediately return "0" to save computation.

2. **Result Array Initialization:** Create an integer array of size `m + n` (where m and n are lengths of num1 and num2) to store the result. This size accommodates the maximum possible digits in the product.

3. **Digit-by-Digit Multiplication:** Iterate through both strings from right to left (from least significant to most significant digit):
   - Convert characters to their numeric digit values using ASCII subtraction.
   - Multiply the two digits.
   - Calculate positions: `pos1 = i + j` (carry position) and `pos2 = i + j + 1` (current digit position).

4. **Accumulation with Carry:** Add the product to the result at position `pos2`, then propagate any carry to position `pos1`:
   - `result[pos2] = total % 10` (current digit)
   - `result[pos1] += total // 10` (carry to next position)

5. **String Conversion:** Convert the result array to a string, removing any leading zeros.

### Complexity Analysis

- **Time Complexity:** O(m × n) - Each digit from num1 is multiplied by each digit from num2 exactly once.
- **Space Complexity:** O(m + n) - The result array has size m + n, and we use a few constant extra variables.

This is the optimal approach for this problem, as any multiplication algorithm must at least examine each digit pair.

---

## Approach 2: Using BigInteger Simulation (Educational)

This approach demonstrates what happens "under the hood" of BigInteger libraries. We simulate addition and multiplication operations on string-represented numbers using manual digit-by-digit operations.

### Implementation

````carousel
```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        # Handle zero case
        if num1 == "0" or num2 == "0":
            return "0"
        
        def add_strings(num1: str, num2: str) -> str:
            """Add two non-negative integer strings."""
            i, j = len(num1) - 1, len(num2) - 1
            carry = 0
            result = []
            
            while i >= 0 or j >= 0 or carry:
                digit1 = ord(num1[i]) - ord('0') if i >= 0 else 0
                digit2 = ord(num2[j]) - ord('0') if j >= 0 else 0
                
                total = digit1 + digit2 + carry
                result.append(str(total % 10))
                carry = total // 10
                
                i -= 1
                j -= 1
            
            return ''.join(reversed(result))
        
        def multiply_by_digit(num: str, digit: int) -> str:
            """Multiply a string number by a single digit (0-9)."""
            if digit == 0:
                return "0"
            
            i = len(num) - 1
            carry = 0
            result = []
            
            while i >= 0 or carry:
                current = (ord(num[i]) - ord('0')) * digit + carry if i >= 0 else carry
                result.append(str(current % 10))
                carry = current // 10
                i -= 1
            
            return ''.join(reversed(result))
        
        # Multiply num1 by each digit of num2 and accumulate results
        result = "0"
        for i in range(len(num2) - 1, -1, -1):
            partial_product = multiply_by_digit(num1, int(num2[i]))
            # Add appropriate number of zeros based on position
            partial_product += "0" * (len(num2) - 1 - i)
            result = add_strings(result, partial_product)
        
        return result
```

```java
class Solution {
    public String multiply(String num1, String num2) {
        // Handle zero case
        if (num1.equals("0") || num2.equals("0")) {
            return "0";
        }
        
        String result = "0";
        
        // Multiply num1 by each digit of num2
        for (int i = num2.length() - 1; i >= 0; i--) {
            String partialProduct = multiplyByDigit(num1, num2.charAt(i) - '0');
            // Add appropriate zeros based on position
            for (int z = 0; z < num2.length() - 1 - i; z++) {
                partialProduct += "0";
            }
            result = addStrings(result, partialProduct);
        }
        
        return result;
    }
    
    private String multiplyByDigit(String num, int digit) {
        if (digit == 0) return "0";
        
        int carry = 0;
        StringBuilder sb = new StringBuilder();
        
        for (int i = num.length() - 1; i >= 0; i--) {
            int current = (num.charAt(i) - '0') * digit + carry;
            sb.insert(0, current % 10);
            carry = current / 10;
        }
        
        if (carry > 0) {
            sb.insert(0, carry);
        }
        
        return sb.toString();
    }
    
    private String addStrings(String num1, String num2) {
        int i = num1.length() - 1, j = num2.length() - 1, carry = 0;
        StringBuilder sb = new StringBuilder();
        
        while (i >= 0 || j >= 0 || carry > 0) {
            int digit1 = i >= 0 ? num1.charAt(i) - '0' : 0;
            int digit2 = j >= 0 ? num2.charAt(j) - '0' : 0;
            
            int total = digit1 + digit2 + carry;
            sb.insert(0, total % 10);
            carry = total / 10;
            
            i--;
            j--;
        }
        
        return sb.toString();
    }
}
```

```cpp
#include <string>
#include <algorithm>

class Solution {
public:
    std::string multiply(std::string num1, std::string num2) {
        // Handle zero case
        if (num1 == "0" || num2 == "0") {
            return "0";
        }
        
        std::string result = "0";
        
        // Multiply num1 by each digit of num2
        for (int i = num2.length() - 1; i >= 0; i--) {
            std::string partialProduct = multiplyByDigit(num1, num2[i] - '0');
            // Add appropriate zeros based on position
            for (int z = 0; z < num2.length() - 1 - i; z++) {
                partialProduct += "0";
            }
            result = addStrings(result, partialProduct);
        }
        
        return result;
    }
    
private:
    std::string multiplyByDigit(const std::string& num, int digit) {
        if (digit == 0) return "0";
        
        int carry = 0;
        std::string result;
        
        for (int i = num.length() - 1; i >= 0; i--) {
            int current = (num[i] - '0') * digit + carry;
            result.insert(result.begin(), char('0' + (current % 10)));
            carry = current / 10;
        }
        
        if (carry > 0) {
            result.insert(result.begin(), char('0' + carry));
        }
        
        return result;
    }
    
    std::string addStrings(const std::string& num1, const std::string& num2) {
        int i = num1.length() - 1, j = num2.length() - 1, carry = 0;
        std::string result;
        
        while (i >= 0 || j >= 0 || carry > 0) {
            int digit1 = i >= 0 ? num1[i] - '0' : 0;
            int digit2 = j >= 0 ? num2[j] - '0' : 0;
            
            int total = digit1 + digit2 + carry;
            result.insert(result.begin(), char('0' + (total % 10)));
            carry = total / 10;
            
            i--;
            j--;
        }
        
        return result;
    }
};
```

```javascript
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
    // Handle zero case
    if (num1 === "0" || num2 === "0") {
        return "0";
    }
    
    const multiplyByDigit = (num, digit) => {
        if (digit === 0) return "0";
        
        let carry = 0;
        let result = '';
        
        for (let i = num.length - 1; i >= 0; i--) {
            const current = (num.charCodeAt(i) - 48) * digit + carry;
            result = (current % 10) + result;
            carry = Math.floor(current / 10);
        }
        
        if (carry > 0) {
            result = carry + result;
        }
        
        return result;
    };
    
    const addStrings = (num1, num2) => {
        let i = num1.length - 1, j = num2.length - 1, carry = 0;
        let result = '';
        
        while (i >= 0 || j >= 0 || carry > 0) {
            const digit1 = i >= 0 ? num1.charCodeAt(i) - 48 : 0;
            const digit2 = j >= 0 ? num2.charCodeAt(j) - 48 : 0;
            
            const total = digit1 + digit2 + carry;
            result = (total % 10) + result;
            carry = Math.floor(total / 10);
            
            i--;
            j--;
        }
        
        return result;
    };
    
    // Multiply num1 by each digit of num2
    let result = "0";
    
    for (let i = num2.length - 1; i >= 0; i--) {
        let partialProduct = multiplyByDigit(num1, parseInt(num2[i]));
        // Add appropriate zeros based on position
        for (let z = 0; z < num2.length - 1 - i; z++) {
            partialProduct += "0";
        }
        result = addStrings(result, partialProduct);
    }
    
    return result;
};
```
````

### Explanation Step-by-Step

1. **Multiply-by-Digit Function:** For each digit in num2, multiply num1 by that single digit (0-9), handling carries properly.

2. **Zero Padding:** Append zeros to the partial product based on the digit's position (similar to how we shift left in manual multiplication).

3. **String Addition:** Use a helper function to add two large numbers represented as strings.

4. **Accumulation:** Sum all partial products to get the final result.

### Complexity Analysis

- **Time Complexity:** O(m × n × (m + n)) - The multiplication by digit is O(m), and addition is O(m + n). We do this n times.
- **Space Complexity:** O(m + n) - For the result and temporary strings.

This approach is less efficient than Approach 1 but demonstrates the fundamental operations that BigInteger libraries perform internally.

---

## Approach 3: FFT-Based Multiplication (Advanced - For Very Large Numbers)

For extremely large numbers (thousands of digits), the elementary school method becomes too slow. FFT (Fast Fourier Transform) can multiply polynomials (which represent numbers) in O(n log n) time.

### Implementation

````carousel
```python
import numpy as np

class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        # Handle zero case
        if num1 == "0" or num2 == "0":
            return "0"
        
        # Convert strings to digit arrays (reversed for easier processing)
        a = [int(d) for d in num1[::-1]]
        b = [int(d) for d in num2[::-1]]
        
        # Pad to power of 2 for efficient FFT
        n = 1
        while n < len(a) + len(b):
            n <<= 1
        
        # Use FFT convolution
        fa = np.fft.rfft(a, n)
        fb = np.fft.rfft(b, n)
        fc = fa * fb
        
        # Inverse FFT to get convolution result
        c = np.fft.irfft(fc, n)
        c = np.rint(c).astype(int)  # Round to nearest integer
        
        # Handle carry
        carry = 0
        for i in range(len(c)):
            total = c[i] + carry
            c[i] = total % 10
            carry = total // 10
        
        # Remove leading zeros and convert to string
        while len(c) > 1 and c[-1] == 0:
            c = c[:-1]
        
        return ''.join(str(d) for d in c[::-1])
```

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) {
            return "0";
        }
        
        // Convert strings to digit arrays
        int[] a = new int[num1.length()];
        int[] b = new int[num2.length()];
        
        for (int i = 0; i < num1.length(); i++) {
            a[i] = num1.charAt(num1.length() - 1 - i) - '0';
        }
        for (int i = 0; i < num2.length(); i++) {
            b[i] = num2.charAt(num2.length() - 1 - i) - '0';
        }
        
        // Simple convolution (O(n^2)) - for very large numbers, use FFT library
        int[] result = new int[a.length + b.length];
        
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < b.length; j++) {
                result[i + j] += a[i] * b[j];
            }
        }
        
        // Handle carry
        int carry = 0;
        for (int i = 0; i < result.length; i++) {
            int total = result[i] + carry;
            result[i] = total % 10;
            carry = total / 10;
        }
        
        // Find most significant non-zero digit
        int i = result.length - 1;
        while (i > 0 && result[i] == 0) {
            i--;
        }
        
        // Build result string
        StringBuilder sb = new StringBuilder();
        for (; i >= 0; i--) {
            sb.append(result[i]);
        }
        
        return sb.toString();
    }
}
```

```cpp
#include <vector>
#include <complex>
#include <algorithm>
#include <cmath>

class Solution {
public:
    std::string multiply(std::string num1, std::string num2) {
        if (num1 == "0" || num2 == "0") {
            return "0";
        }
        
        // Convert strings to digit arrays
        std::vector<int> a(num1.length()), b(num2.length());
        
        for (int i = 0; i < num1.length(); i++) {
            a[i] = num1[num1.length() - 1 - i] - '0';
        }
        for (int i = 0; i < num2.length(); i++) {
            b[i] = num2[num2.length() - 1 - i] - '0';
        }
        
        // Simple convolution (O(n^2)) - for very large numbers, use FFT library
        std::vector<int> result(a.size() + b.size(), 0);
        
        for (size_t i = 0; i < a.size(); i++) {
            for (size_t j = 0; j < b.size(); j++) {
                result[i + j] += a[i] * b[j];
            }
        }
        
        // Handle carry
        int carry = 0;
        for (size_t i = 0; i < result.size(); i++) {
            int total = result[i] + carry;
            result[i] = total % 10;
            carry = total / 10;
        }
        
        // Find most significant non-zero digit
        size_t i = result.size() - 1;
        while (i > 0 && result[i] == 0) {
            i--;
        }
        
        // Build result string
        std::string resultStr;
        for (; i > 0; i--) {
            resultStr += std::to_string(result[i]);
        }
        resultStr += std::to_string(result[0]);
        
        return resultStr;
    }
};
```

```javascript
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
    if (num1 === "0" || num2 === "0") {
        return "0";
    }
    
    // Convert strings to digit arrays
    const a = num1.split('').map(Number).reverse();
    const b = num2.split('').map(Number).reverse();
    
    // Simple convolution (O(n^2)) - for very large numbers, use FFT library
    const result = new Array(a.length + b.length).fill(0);
    
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            result[i + j] += a[i] * b[j];
        }
    }
    
    // Handle carry
    let carry = 0;
    for (let i = 0; i < result.length; i++) {
        const total = result[i] + carry;
        result[i] = total % 10;
        carry = Math.floor(total / 10);
    }
    
    // Remove leading zeros and convert to string
    while (result.length > 1 && result[result.length - 1] === 0) {
        result.pop();
    }
    
    return result.reverse().join('');
};
```
````

### Explanation Step-by-Step

1. **Digit Array Conversion:** Convert input strings to arrays of digits, reversed for easier processing (least significant digit first).

2. **Convolution:** Multiply corresponding digits and accumulate at correct positions. This is mathematically equivalent to polynomial multiplication.

3. **Carry Propagation:** Process the result array from least to most significant digit, handling carries at each position.

4. **String Construction:** Convert the result array back to a string, removing leading zeros.

### Complexity Analysis

- **Time Complexity:** O(m × n) for the naive convolution approach shown.
- **Space Complexity:** O(m + n) for the result array.

Note: For truly massive numbers, FFT-based approaches achieve O(n log n) time complexity but require complex implementations and external libraries.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Elementary School Multiplication | O(m × n) | O(m + n) | **Recommended** - Most practical for interview constraints |
| BigInteger Simulation | O(m × n × (m + n)) | O(m + n) | Educational - demonstrates underlying operations |
| FFT-Based Multiplication | O(n log n) | O(n) | Very large numbers (>1000 digits) |

---

## Related Problems

Here are some LeetCode problems that build on similar concepts (string arithmetic, large number operations, or digit manipulation):

- [Add Two Numbers (Medium)](https://leetcode.com/problems/add-two-numbers/) - Add two numbers represented as linked lists.
- [Add Strings (Easy)](https://leetcode.com/problems/add-strings/) - Add two non-negative integer strings.
- [Plus One (Easy)](https://leetcode.com/problems/plus-one/) - Increment a large integer represented as an array.
- [Big Countries (SQL)](https://leetcode.com/problems/big-countries/) - Query-based problem using SQL (unrelated but similar naming).
- [Add to Array-Form of Integer (Easy)](https://leetcode.com/problems/add-to-array-form-of-integer/) - Add an integer to an array-form number.
- [Subtract the Product and Sum of Digits of an Integer (Easy)](https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/) - Simple digit operation.
- [Multiply to Avoid Integer Overflow](https://leetcode.com/problems/valid-boomerang/) - Unrelated but demonstrates overflow concerns.

---

## Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

- [Multiply Strings (LeetCode 43) | Full solution with visuals and animations](https://www.youtube.com/watch?v=YMpC4N7yWqI) - Clear explanation of the elementary school multiplication approach.
- [Multiply Strings - LeetCode 43 - Python](https://www.youtube.com/watch?v=1H_3n8iYo2c) - Python implementation with step-by-step breakdown.
- [LeetCode 43. Multiply Strings Solution Explained](https://www.youtube.com/watch?v=0I5hL0l3j6U) - Java implementation with detailed explanation.
- [Multiply Strings (LeetCode 43) - JavaScript](https://www.youtube.com/watch?v=V0MGJp1B9a0) - JavaScript solution walkthrough.

---

## Follow-up Questions

1. **How would you optimize the solution for numbers with many leading zeros?**

   **Answer:** Add a check at the beginning to strip leading zeros from both input strings. However, per the problem constraints, inputs don't have leading zeros (except "0"), so this is mainly for robustness. The result conversion already handles leading zeros by using `lstrip()` or equivalent.

2. **Can this approach be extended to handle negative numbers?**

   **Answer:** Yes. First check if either number is negative (contains a '-' prefix). Convert both to positive, perform the multiplication, then apply the appropriate sign: negative if exactly one number is negative, positive if both are same sign. Handle the edge case where result is 0 (should be positive).

3. **How would you implement division of two large numbers represented as strings?**

   **Answer:** Division is more complex than multiplication because it requires finding the correct quotient digit at each position through trial and error (similar to manual long division). The algorithm works as follows:

   **Step-by-Step Algorithm:**

   1. **Handle Edge Cases:**
      - If divisor is "0", return error (division by zero)
      - If dividend < divisor, return "0"
      - If dividend == divisor, return "1"
      - Remove leading zeros from both inputs

   2. **Process Digit by Digit:**
      - Start from the leftmost digit of the dividend
      - Build a partial dividend incrementally
      - For each position, find the largest digit d (0-9) such that divisor × d ≤ partial_dividend
      - Subtract divisor × d from the partial dividend
      - Append the next digit to the partial dividend and continue

   3. **Optimize with Binary Search:**
      - Instead of trying digits 0-9 sequentially, use binary search (0-9) for each position
      - This reduces the number of comparisons per digit

   **Example: Divide "1234" ÷ "12"**

   | Step | Partial Dividend | Find Max d | Subtract | Remainder | Quotient Digit |
   |------|-----------------|------------|----------|-----------|----------------|
   | 1 | "1" | d=0 (1 < 12) | 0 | "1" | 0 |
   | 2 | "12" | d=1 (12×1=12 ≤ 12) | 12×1=12 | 0 | 1 |
   | 3 | "03" → "3" | d=0 (3 < 12) | 0 | "3" | 0 |
   | 4 | "34" | d=2 (12×2=24 ≤ 34) | 12×2=24 | 10 | 2 |

   Result: "102" remainder "10"

   **Handling Remainders:**
   - The division can return either quotient only or both quotient and remainder
   - To get the remainder, track the final value after processing all digits
   - Remainder can be returned as a string or used for decimal expansion

   **Decimal/Fractional Results:**
   - To get decimal places, append "0" to the remainder and continue the division
   - Continue until desired precision is reached or remainder becomes 0
   - Example: "10" ÷ "3" = "3.333..."

   **Complexity Analysis:**
   - **Time Complexity:** O(m × n × log(10)) = O(m × n) where m is dividend length and n is divisor length
     - Each of the m positions requires comparing against the divisor
     - Binary search over 10 digits requires at most 4 comparisons per position
   - **Space Complexity:** O(m + n) for storing the quotient and intermediate values

   **Optimizations:**
   - **Prefix Comparison:** Before binary search, quickly compare string lengths of partial_dividend and divisor
     - If len(partial_dividend) > len(divisor), d is at least 1
     - If len(partial_dividend) < len(divisor), d is 0
   - **Multiplication Comparison:** Instead of computing divisor × d, compare divisor × d with partial_dividend
     - This avoids large intermediate multiplications

   **Special Cases:**
   - **Floating Point Division:** Continue division beyond integer part by appending decimal point and zeros
   - **Modulo Operation:** Return remainder only (skip quotient construction during subtraction)
   - **Exact Division:** Detect when remainder becomes 0 to stop early

   **Applications:**
   - Arbitrary precision arithmetic libraries
   - Scientific computing with large numbers
   - Financial calculations requiring exact precision
   - Cryptography (RSA involves large number operations)

4. **What if the inputs could have decimal points?**

   **Answer:** First, find the decimal point position in both numbers. Remove the decimal points and count total decimal places. Multiply the integer values normally. Finally, insert the decimal point at the correct position from the right (total_decimal_places from the end). Handle edge cases like ".5" or "5." by treating them as 0.5 and 5.0.

5. **How would you handle very large numbers (thousands of digits) efficiently?**

   **Answer:** Use FFT (Fast Fourier Transform) or NTT (Number-Theoretic Transform) to perform polynomial multiplication in O(n log n) time. This reduces complexity from O(n²) to O(n log n). Libraries like FFTW or using numpy's FFT functions can help. For production, use established arbitrary-precision libraries like GMP.

6. **What if you need to support base-16 (hexadecimal) multiplication?**

   **Answer:** Similar algorithm, but with base 16 instead of base 10. Each digit represents 0-15. Multiplication by single digit can produce values up to 225 (15×15), requiring carry handling up to 14 (225 / 16 = 14 with remainder 1). The result array size is still m + n, and final conversion to string uses hex digits (0-9, A-F).

7. **How would you modify the solution to work with a stream of digits instead of complete strings?**

   **Answer:** Use a running accumulator for the current partial result. For each new digit d from num2, update result = multiply_and_add(result, num1, d, position). This allows incremental computation as digits arrive. Store intermediate results to allow continuation if the stream is interrupted.

8. **What are the integer overflow concerns in the intermediate calculations?**

   **Answer:** In Approach 1, the maximum value at any position is the product of two digits (9×9=81) plus accumulated carries. The carry can be at most 8 (81/10=8), and it accumulates from lower positions. For maximum safety, ensure the accumulator type can hold values up to approximately 9×9×110 + carry, which fits in 32-bit integers (max ~10,000). Python and Java have arbitrary precision, but in C++/C, use `int` or `long` safely.

---

## LeetCode Link

[Multiply Strings - LeetCode](https://leetcode.com/problems/multiply-strings/)
