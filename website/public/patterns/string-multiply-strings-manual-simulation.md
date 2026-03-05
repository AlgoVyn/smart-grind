# String - Multiply Strings (Manual Simulation)

## Problem Description

The **Multiply Strings** pattern involves multiplying two non-negative integer strings without converting them directly to integers (especially important when numbers are too large for standard data types). This requires simulating the manual multiplication process we learned in school.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Two strings representing non-negative integers |
| **Output** | String representing the product of the two numbers |
| **Key Insight** | Position i+j+1 stores the result of digit[i] × digit[j] |
| **Time Complexity** | O(n × m) where n, m are the lengths of input strings |
| **Space Complexity** | O(n + m) for the result array |

### When to Use

- **Big integer arithmetic**: When numbers exceed 64-bit integer limits
- **Arbitrary precision math**: Implementing calculator-like functionality
- **String-based numeric operations**: When input/output must remain as strings
- **Large number factorials**: Computing factorials of large numbers
- **Cryptographic applications**: Working with large prime numbers

---

## Intuition

The core insight behind manual string multiplication mirrors grade-school arithmetic:

1. **Position-Based Multiplication**: When multiplying digit at position `i` (from right) in num1 with digit at position `j` in num2, the result contributes to position `i+j` and `i+j+1` in the final answer.

2. **Two-Digit Products**: Each single-digit multiplication produces at most a two-digit number (9×9=81). We store the ones digit and carry the tens digit.

3. **Result Array Size**: The result of multiplying an n-digit number by an m-digit number has at most n+m digits.

4. **Reverse Processing**: We process digits from right to left (least significant to most significant), just like manual multiplication.

### Visual Example

```
    123
  ×  45
  -----
    615   (123 × 5)
   492    (123 × 4, shifted left)
  -----
   5535
```

Position mapping: If we index from right (0-based):
- 3×5 = 15 → contributes to positions 0 and 1
- 2×5 = 10 → contributes to positions 1 and 2
- 1×5 = 5 → contributes to positions 2 and 3

---

## Solution Approaches

### Approach 1: Standard Manual Multiplication (Optimal)

This approach simulates the grade-school multiplication algorithm using a result array to accumulate partial products.

#### Algorithm

1. Handle edge cases: if either string is "0", return "0"
2. Initialize result array of size `len(num1) + len(num2)` with zeros
3. Iterate through num1 from right to left (index i):
   - Iterate through num2 from right to left (index j):
     - Multiply digits: `product = (num1[i] - '0') × (num2[j] - '0')`
     - Add to result position: `sum = result[i+j+1] + product`
     - Store ones digit: `result[i+j+1] = sum % 10`
     - Carry tens digit: `result[i+j] += sum / 10`
4. Convert result array to string, skipping leading zeros
5. Return the result string

#### Implementation

````carousel
```python
def multiply_strings(num1: str, num2: str) -> str:
    """
    Multiply two string-represented numbers using manual simulation.
    
    Args:
        num1: First number as string
        num2: Second number as string
        
    Returns:
        Product as string
    """
    # Edge case: if either number is "0"
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    # Result can have at most m + n digits
    result = [0] * (m + n)
    
    # Multiply each digit from right to left
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            # Multiply digits
            product = (ord(num1[i]) - ord('0')) * (ord(num2[j]) - ord('0'))
            # Add to current position (including any existing value)
            total = product + result[i + j + 1]
            
            # Store ones digit at current position
            result[i + j + 1] = total % 10
            # Add carry to previous position
            result[i + j] += total // 10
    
    # Convert to string, skipping leading zeros
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1
    
    return ''.join(map(str, result[start:]))
```

<!-- slide -->
```cpp
string multiplyStrings(string num1, string num2) {
    /**
     * Multiply two string-represented numbers.
     * 
     * @param num1 First number as string
     * @param num2 Second number as string
     * @return Product as string
     */
    // Edge case
    if (num1 == "0" || num2 == "0") {
        return "0";
    }
    
    int m = num1.length();
    int n = num2.length();
    vector<int> result(m + n, 0);
    
    // Multiply from right to left
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int product = (num1[i] - '0') * (num2[j] - '0');
            int total = product + result[i + j + 1];
            
            result[i + j + 1] = total % 10;
            result[i + j] += total / 10;
        }
    }
    
    // Convert to string, skip leading zeros
    string ans;
    int start = 0;
    while (start < result.size() && result[start] == 0) {
        start++;
    }
    
    for (int i = start; i < result.size(); i++) {
        ans += (result[i] + '0');
    }
    
    return ans;
}
```

<!-- slide -->
```java
public String multiplyStrings(String num1, String num2) {
    /**
     * Multiply two string-represented numbers.
     * 
     * @param num1 First number as string
     * @param num2 Second number as string
     * @return Product as string
     */
    // Edge case
    if (num1.equals("0") || num2.equals("0")) {
        return "0";
    }
    
    int m = num1.length();
    int n = num2.length();
    int[] result = new int[m + n];
    
    // Multiply from right to left
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int product = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
            int total = product + result[i + j + 1];
            
            result[i + j + 1] = total % 10;
            result[i + j] += total / 10;
        }
    }
    
    // Convert to string, skip leading zeros
    StringBuilder sb = new StringBuilder();
    int start = 0;
    while (start < result.length && result[start] == 0) {
        start++;
    }
    
    for (int i = start; i < result.length; i++) {
        sb.append(result[i]);
    }
    
    return sb.toString();
}
```

<!-- slide -->
```javascript
function multiplyStrings(num1, num2) {
    /**
     * Multiply two string-represented numbers.
     * 
     * @param {string} num1 - First number as string
     * @param {string} num2 - Second number as string
     * @return {string} Product as string
     */
    // Edge case
    if (num1 === "0" || num2 === "0") {
        return "0";
    }
    
    const m = num1.length;
    const n = num2.length;
    const result = new Array(m + n).fill(0);
    
    // Multiply from right to left
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            const product = (num1.charCodeAt(i) - '0'.charCodeAt(0)) * 
                           (num2.charCodeAt(j) - '0'.charCodeAt(0));
            const total = product + result[i + j + 1];
            
            result[i + j + 1] = total % 10;
            result[i + j] += Math.floor(total / 10);
        }
    }
    
    // Convert to string, skip leading zeros
    let start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }
    
    return result.slice(start).join('');
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × m) - Nested loops through both numbers |
| **Space** | O(n + m) - Result array storage |

---

### Approach 2: Karatsuba Algorithm (Advanced)

For extremely large numbers, the Karatsuba algorithm provides better asymptotic complexity using divide-and-conquer.

#### Algorithm

1. Split each number into two halves: `num1 = a×10^n/2 + b`, `num2 = c×10^n/2 + d`
2. Recursively compute: `ac`, `bd`, `(a+b)(c+d)`
3. Calculate: `ad+bc = (a+b)(c+d) - ac - bd`
4. Combine: `result = ac×10^n + (ad+bc)×10^n/2 + bd`

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n^log2(3)) ≈ O(n^1.585) - Better for very large numbers |
| **Space** | O(n) - Recursive stack and intermediate results |

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Manual Multiplication** | O(n × m) | O(n + m) | Standard interview problems |
| **Karatsuba** | O(n^1.585) | O(n) | Very large numbers (1000+ digits) |
| **FFT-based** | O(n log n) | O(n) | Extremely large numbers |

**Where n and m are the lengths of the input strings.**

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Multiply Strings | [Link](https://leetcode.com/problems/multiply-strings/) | Primary problem for this pattern |
| Add Strings | [Link](https://leetcode.com/problems/add-strings/) | Add two string numbers |
| Subtract Strings | [Link](https://leetcode.com/problems/subtract-strings/) | Subtract string numbers |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Basic Calculator | [Link](https://leetcode.com/problems/basic-calculator/) | Evaluate expression with +, -, parentheses |
| Basic Calculator II | [Link](https://leetcode.com/problems/basic-calculator-ii/) | Evaluate with +, -, *, / |
| Factorial Trailing Zeroes | [Link](https://leetcode.com/problems/factorial-trailing-zeroes/) | Count trailing zeros in n! |
| Super Pow | [Link](https://leetcode.com/problems/super-pow/) | Calculate a^b mod 1337 |

---

## Video Tutorial Links

1. [NeetCode - Multiply Strings](https://www.youtube.com/watch?v=1vZswirLQYY) - Step-by-step visualization
2. [Back to Back SWE - String Multiplication](https://www.youtube.com/watch?v=1vZswirLQYY) - Algorithm explanation
3. [Karatsuba Algorithm Explained](https://www.youtube.com/watch?v=JCbZayFr93U) - Advanced fast multiplication
4. [Big Integer Arithmetic](https://www.youtube.com/watch?v=8DO3ZtVmENw) - Comprehensive overview

---

## Summary

### Key Takeaways

1. **Position Mapping**: Remember that `num1[i] × num2[j]` contributes to positions `i+j` and `i+j+1` in the result.

2. **Handle Carries**: Always add the carry to the left position after storing the current digit.

3. **Skip Leading Zeros**: The result array may have leading zeros that need to be stripped.

4. **Edge Cases**: Check for "0" inputs early to avoid unnecessary computation.

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Wrong position calculation** | Use `i+j+1` for current digit, `i+j` for carry |
| **Integer overflow** | Use modulo and division for carry handling |
| **Not handling "0"** | Early return if either input is "0" |
| **Leading zeros in output** | Skip initial zeros when converting to string |
| **Character to digit conversion** | Remember to subtract '0' (48 in ASCII) |

### Follow-up Questions

**Q1: How would you implement division of string numbers?**

Use long division simulation with repeated subtraction or binary search on the quotient.

**Q2: Can you optimize for numbers with many trailing zeros?**

Count trailing zeros in both inputs, multiply the significant parts, then append the combined zeros.

**Q3: How would you handle negative numbers?**

Check signs separately, multiply absolute values, then apply sign based on original inputs.

**Q4: What about decimal numbers?**

Track decimal positions, multiply as integers, then place decimal point at correct position.

---

## Pattern Source

For more string pattern implementations, see:
- **[String - Anagram Check](/patterns/string-anagram-check)**
- **[String - Matching (Naive/KMP/Rabin-Karp)](/patterns/string-matching-naive-kmp-rabin-karp)**
