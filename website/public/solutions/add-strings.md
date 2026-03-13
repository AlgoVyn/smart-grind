# Add Strings

## Problem Description

Given two non-negative integers, `num1` and `num2`, represented as string, return the sum of `num1` and `num2` as a string.

You must solve the problem without using any built-in library for handling large integers (such as `BigInteger`) and without converting the inputs to integers directly.

---

## Examples

**Example 1:**

**Input:**
```
num1 = "11", num2 = "123"
```

**Output:**
```
"134"
```

**Explanation:** 11 + 123 = 134

---

**Example 2:**

**Input:**
```
num1 = "456", num2 = "77"
```

**Output:**
```
"533"
```

**Explanation:** 456 + 77 = 533

---

**Example 3:**

**Input:**
```
num1 = "0", num2 = "0"
```

**Output:**
```
"0"
```

**Explanation:** 0 + 0 = 0

---

## Constraints

- `1 <= num1.length, num2.length <= 10^4`
- `num1` and `num2` consist of only digits.
- `num1` and `num2` don't have any leading zeros except for the number `0` itself.

---

## Pattern: String-Based Number Addition

This problem demonstrates the **String-Based Number Addition** pattern, which involves adding large numbers represented as strings without using built-in big integer libraries.

### Core Concept

The key idea is to simulate manual addition:
1. Process digits from right to left (least significant to most significant)
2. Track carry between digit additions
3. Build result in reverse order
4. Handle strings of different lengths

---

## Intuition

This problem simulates how we add numbers by hand on paper. We start from the rightmost digit (least significant) and work leftward, keeping track of any carry to the next position.

### Key Observations

1. **Right-to-Left Processing**: We process digits from right to left (least significant to most significant), just like manual addition.

2. **Carry Handling**: When the sum of two digits exceeds 9, we keep only the unit digit in the current position and carry the tens digit to the next position.

3. **Unequal Lengths**: When one number has more digits than the other, we treat the missing digits as 0.

4. **Final Carry**: After processing all digits, we must check if there's still a carry remaining that needs to be added.

5. **Result Building**: Since we process from right to left, we build the result in reverse order and reverse it at the end.

### Why This Approach Works

The algorithm mirrors exactly how humans perform addition:
- Starting from the rightmost column
- Adding the digits and any carry from the previous column
- Writing down the sum's unit digit
- Carrying the tens digit to the next column
- Repeating until all columns are processed

This ensures we correctly handle all cases including carry propagation (like 999 + 1 = 1000).

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two-Pointer Approach** - Optimal O(n) time, O(n) space
2. **Using StringBuilder** - Similar complexity, cleaner in some languages
3. **Recursive Approach** - O(n) time, O(n) stack space

---

## Approach 1: Two-Pointer Approach (Optimal)

This is the most efficient approach that processes digits from right to left.

### Algorithm Steps

1. Initialize two pointers at the end of each string
2. Initialize carry to 0
3. Loop while there are digits or carry:
   - Get current digits (or 0 if beyond string)
   - Add digits and carry
   - Append digit to result
   - Update carry
4. Reverse result and return

### Why It Works

By processing from right to left, we simulate the manual addition process we use on paper.

### Code Implementation

````carousel
```python
class Solution:
    def addStrings(self, num1: str, num2: str) -> str:
        """
        Add two non-negative integer strings.
        
        Args:
            num1: First number as string
            num2: Second number as string
            
        Returns:
            Sum as string
        """
        i, j = len(num1) - 1, len(num2) - 1
        carry = 0
        result = []
        
        while i >= 0 or j >= 0 or carry:
            d1 = ord(num1[i]) - ord('0') if i >= 0 else 0
            d2 = ord(num2[j]) - ord('0') if j >= 0 else 0
            
            total = d1 + d2 + carry
            result.append(str(total % 10))
            carry = total // 10
            
            i -= 1
            j -= 1
        
        result.reverse()
        return ''.join(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    string addStrings(string num1, string num2) {
        int i = num1.length() - 1;
        int j = num2.length() - 1;
        int carry = 0;
        string result;
        
        while (i >= 0 || j >= 0 || carry) {
            int d1 = (i >= 0) ? num1[i] - '0' : 0;
            int d2 = (j >= 0) ? num2[j] - '0' : 0;
            
            int total = d1 + d2 + carry;
            result.push_back('0' + (total % 10));
            carry = total / 10;
            
            i--;
            j--;
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String addStrings(String num1, String num2) {
        int i = num1.length() - 1;
        int j = num2.length() - 1;
        int carry = 0;
        StringBuilder result = new StringBuilder();
        
        while (i >= 0 || j >= 0 || carry > 0) {
            int d1 = (i >= 0) ? num1.charAt(i) - '0' : 0;
            int d2 = (j >= 0) ? num2.charAt(j) - '0' : 0;
            
            int total = d1 + d2 + carry;
            result.append(total % 10);
            carry = total / 10;
            
            i--;
            j--;
        }
        
        return result.reverse().toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Add two non-negative integer strings.
 * 
 * @param {string} num1 - First number as string
 * @param {string} num2 - Second number as string
 * @return {string} - Sum as string
 */
var addStrings = function(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    let result = [];
    
    while (i >= 0 || j >= 0 || carry) {
        const d1 = (i >= 0) ? num1.charCodeAt(i) - 48 : 0;
        const d2 = (j >= 0) ? num2.charCodeAt(j) - 48 : 0;
        
        const total = d1 + d2 + carry;
        result.push(String(total % 10));
        carry = Math.floor(total / 10);
        
        i--;
        j--;
    }
    
    return result.reverse().join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(max(n, m)) - Process each digit once |
| **Space** | O(max(n, m)) - Result string length |

---

## Approach 2: Using StringBuilder/StringBuffer

This approach is similar but uses language-specific string builders for efficiency.

### Algorithm Steps

1. Start from end of both strings
2. Use StringBuilder to append digits
3. Handle carry after loop completes

### Why It Works

StringBuilder provides efficient string concatenation in a loop.

### Code Implementation

````carousel
```python
class Solution:
    def addStrings_builder(self, num1: str, num2: str) -> str:
        """Using list append for efficiency."""
        i, j = len(num1) - 1, len(num2) - 1
        carry = 0
        result = []
        
        while i >= 0 or j >= 0:
            d1 = ord(num1[i]) - ord('0') if i >= 0 else 0
            d2 = ord(num2[j]) - ord('0') if j >= 0 else 0
            
            total = d1 + d2 + carry
            result.append(chr(total % 10 + ord('0')))
            carry = total // 10
            
            i -= 1
            j -= 1
        
        if carry:
            result.append(chr(carry + ord('0')))
        
        return ''.join(reversed(result))
```

<!-- slide -->
```cpp
class Solution {
public:
    string addStrings(string num1, string num2) {
        // Using string with reserve for efficiency
        int i = num1.length() - 1;
        int j = num2.length() - 1;
        int carry = 0;
        string result;
        result.reserve(max(num1.length(), num2.length()) + 1);
        
        while (i >= 0 || j >= 0 || carry) {
            int d1 = (i >= 0) ? num1[i] - '0' : 0;
            int d2 = (j >= 0) ? num2[j] - '0' : 0;
            
            int total = d1 + d2 + carry;
            result.push_back('0' + (total % 10));
            carry = total / 10;
            
            i--;
            j--;
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String addStrings(String num1, String num2) {
        int i = num1.length() - 1;
        int j = num2.length() - 1;
        int carry = 0;
        StringBuilder sb = new StringBuilder();
        
        while (i >= 0 || j >= 0 || carry > 0) {
            int d1 = (i >= 0) ? num1.charAt(i) - '0' : 0;
            int d2 = (j >= 0) ? num2.charAt(j) - '0' : 0;
            
            int total = d1 + d2 + carry;
            sb.append(total % 10);
            carry = total / 10;
            
            i--;
            j--;
        }
        
        return sb.reverse().toString();
    }
}
```

<!-- slide -->
```javascript
var addStrings = function(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    let result = [];
    
    while (i >= 0 || j >= 0 || carry) {
        const d1 = i >= 0 ? parseInt(num1[i]) : 0;
        const d2 = j >= 0 ? parseInt(num2[j]) : 0;
        
        const total = d1 + d2 + carry;
        result.push((total % 10).toString());
        carry = Math.floor(total / 10);
        
        i--;
        j--;
    }
    
    return result.reverse().join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(max(n, m)) |
| **Space** | O(max(n, m)) |

---

## Approach 3: Recursive Approach

This approach uses recursion to process digits from the end.

### Algorithm Steps

1. Recursively process from the end
2. Return carry at each step
3. Build result as recursion unwinds

### Why It Works

Recursion naturally processes from the end, mimicking manual addition.

### Code Implementation

````carousel
```python
class Solution:
    def addStrings_recursive(self, num1: str, num2: str) -> str:
        """Recursive approach."""
        def helper(i, j, carry):
            if i < 0 and j < 0 and carry == 0:
                return ""
            
            d1 = ord(num1[i]) - ord('0') if i >= 0 else 0
            d2 = ord(num2[j]) - ord('0') if j >= 0 else 0
            
            total = d1 + d2 + carry
            digit = total % 10
            new_carry = total // 10
            
            result = helper(i - 1, j - 1, new_carry)
            return result + str(digit)
        
        return helper(len(num1) - 1, len(num2) - 1, 0)
```

<!-- slide -->
```cpp
class Solution {
public:
    string addStrings(string num1, string num2) {
        // Recursive helper
        function<string(int, int, int)> helper = 
            [&](int i, int j, int carry) -> string {
            if (i < 0 && j < 0 && carry == 0) {
                return "";
            }
            
            int d1 = (i >= 0) ? num1[i] - '0' : 0;
            int d2 = (j >= 0) ? num2[j] - '0' : 0;
            
            int total = d1 + d2 + carry;
            char digit = '0' + (total % 10);
            int newCarry = total / 10;
            
            return helper(i - 1, j - 1, newCarry) + digit;
        };
        
        return helper(num1.length() - 1, num2.length() - 1, 0);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String addStrings(String num1, String num2) {
        return helper(num1, num2, num1.length() - 1, num2.length() - 1, 0);
    }
    
    private String helper(String num1, String num2, int i, int j, int carry) {
        if (i < 0 && j < 0 && carry == 0) {
            return "";
        }
        
        int d1 = (i >= 0) ? num1.charAt(i) - '0' : 0;
        int d2 = (j >= 0) ? num2.charAt(j) - '0' : 0;
        
        int total = d1 + d2 + carry;
        int digit = total % 10;
        int newCarry = total / 10;
        
        return helper(num1, num2, i - 1, j - 1, newCarry) + digit;
    }
}
```

<!-- slide -->
```javascript
var addStrings = function(num1, num2) {
    const helper = (i, j, carry) => {
        if (i < 0 && j < 0 && carry === 0) {
            return "";
        }
        
        const d1 = i >= 0 ? parseInt(num1[i]) : 0;
        const d2 = j >= 0 ? parseInt(num2[j]) : 0;
        
        const total = d1 + d2 + carry;
        const digit = total % 10;
        const newCarry = Math.floor(total / 10);
        
        return helper(i - 1, j - 1, newCarry) + digit.toString();
    };
    
    return helper(num1.length - 1, num2.length - 1, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(max(n, m)) |
| **Space** | O(max(n, m)) - Recursion stack |

---

## Comparison of Approaches

| Aspect | Two-Pointer | StringBuilder | Recursive |
|--------|-------------|---------------|-----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(n) |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Readability** | Good | Best | Moderate |

**Best Approach:** The two-pointer approach is optimal and widely used.

---

## Why This Problem is Important

This problem demonstrates:
1. **Manual arithmetic**: Understanding how computers add numbers
2. **String manipulation**: Efficient string operations
3. **Edge case handling**: Different length strings, carry propagation
4. **Big integer simulation**: Foundation for big integer libraries

---

## Related Problems

Based on similar themes (string arithmetic, big integer operations):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Plus One | [Link](https://leetcode.com/problems/plus-one/) | Add 1 to number array |
| Add Two Numbers | [Link](https://leetcode.com/problems/add-two-numbers/) | Add linked list numbers |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Multiply Strings | [Link](https://leetcode.com/problems/multiply-strings/) | Multiply large numbers |
| Big Integer Addition | [Link](https://leetcode.com/problems/big-integer-addition/) | Similar problem |

### Pattern Reference

For more detailed explanations of string manipulation patterns, see:
- **[String Multiply Strings Pattern](/patterns/string-multiply-strings-manual-simulation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### String Addition

- [NeetCode - Add Strings](https://www.youtube.com/watch?v=3itzT7c2mhI) - Clear explanation
- [Add Strings - Explanation](https://www.youtube.com/watch?v=CYlH1t4aPxQ) - Detailed walkthrough
- [Big Integer Operations](https://www.youtube.com/watch?v=V-6AP1q1r5E) - Understanding big integers

### Related Problems

- [Multiply Strings](https://www.youtube.com/watch?v=1D34xP8wZ8U) - Extension of addition
- [Plus One Problem](https://www.youtube.com/watch?v=oa2AsAIKcUk) - Similar pattern

---

## Follow-up Questions

### Q1: What is the time and space complexity?

**Answer:** Time complexity is O(max(n, m)) where n and m are the lengths of num1 and num2. Space complexity is also O(max(n, m)) for storing the result.

---

### Q2: How would you handle very large numbers?

**Answer:** The current solution already handles arbitrarily large numbers since it processes digits one at a time. The only limitation would be memory for storing the result.

---

### Q3: Can you solve it without using extra space for the result?

**Answer:** In-place modification is not possible for strings in most languages since strings are immutable. However, you could modify one of the input strings if it was in a mutable format (like a character array).

---

### Q4: How would you extend this to support subtraction?

**Answer:** For subtraction, you would need to handle borrowing instead of carrying, and ensure the result is non-negative.

---

### Q5: What if the inputs have leading zeros?

**Answer:** According to constraints, inputs don't have leading zeros except for "0". If they did, you would need to strip them before processing or handle them in your algorithm.

---

### Q6: How does this relate to big integer implementation?

**Answer:** This is essentially how big integer libraries implement addition - processing digits in chunks (which could be base 10, base 2^32, etc.) and handling carry/borrow.

---

### Q7: What edge cases should be tested?

**Answer:**
- Both numbers are "0"
- Numbers of vastly different lengths ("1" and "999999...")
- Carry propagation at the end (999 + 1 = 1000)
- Single digit numbers

---

### Q8: How would you modify for base 16 (hex) addition?

**Answer:** Change the base from 10 to 16. Handle digits A-F (10-15) appropriately.

---

### Q9: Can you optimize for cache locality?

**Answer:** Process larger chunks at a time (e.g., 9 digits at a time) to improve cache performance. This is how many big integer libraries work.

---

### Q10: How would you implement multiplication after addition?

**Answer:** Multiplication is more complex - you'd need to handle partial products and their positions. See the "Multiply Strings" problem for details.

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue**: Not handling the final carry correctly.

**Solution**: Continue loop while there are digits OR carry remaining.

### 2. Index Out of Bounds
**Issue**: Accessing string indices beyond length.

**Solution:** Check index >= 0 before accessing, use 0 as default.

### 3. String Concatenation in Loop
**Issue:** Using + in Python/JS or + in Java creates new strings each time.

**Solution:** Use list/StringBuilder and join at the end.

### 4. Not Reversing Result
**Issue:** Building result in wrong order.

**Solution:** Remember to reverse before returning.

### 5. Using int() on Large Strings
**Issue:** Converting very large strings to int causes overflow.

**Solution:** Always process character by character.

---

## Summary

The **Add Strings** problem demonstrates fundamental string-based arithmetic:

- **Two-pointer approach**: Optimal with O(n) time and space
- **StringBuilder approach**: Clean and efficient
- **Recursive approach**: Elegant but uses more memory

The key insight is simulating manual addition digit by digit from right to left, handling carry appropriately.

This problem is foundational for understanding big integer operations and string manipulation.

### Pattern Summary

This problem exemplifies the **String-Based Number Addition** pattern, which is characterized by:
- Processing digits from right to left
- Handling carry between digit additions
- Building result in reverse order
- Achieving O(n) time complexity

For more details on related patterns, see the **[String Multiply Strings Pattern](/patterns/string-multiply-strings-manual-simulation)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/add-strings/discuss/) - Community solutions
- [Big Integer Implementation](https://www.geeksforgeeks.org/big-integer-implementation/) - Understanding big integers
- [String Manipulation - GeeksforGeeks](https://www.geeksforgeeks.org/string-manipulation-in-programming/) - String operations
- [Pattern: String Multiply Strings](/patterns/string-multiply-strings-manual-simulation) - Comprehensive pattern guide
