# Palindrome Number

## Problem Description

Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.

This is **LeetCode Problem #9** and is classified as an Easy difficulty problem. It is one of the most fundamental problems for understanding number manipulation and palindrome checking, and is frequently asked in technical interviews at companies like Google, Amazon, Meta, and Apple.

### Detailed Problem Statement

An integer is a **palindrome** when it reads the same forward and backward. For example:
- `121` is a palindrome because `121` reversed is `121`
- `-121` is NOT a palindrome (the negative sign makes it asymmetric)
- `10` is NOT a palindrome because `01` is not `10`

The key challenge is determining whether a number reads the same forwards and backwards **without converting it to a string**, which tests your understanding of number manipulation.

### Key Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `-2^31 <= x <= 2^31 - 1` | 32-bit signed integer range | Negative numbers need special handling |
| Time limit | Must be efficient | O(log₁₀(x)) is optimal |
| No string conversion | Challenge constraint | Tests number manipulation skills |

---

## Examples

### Example 1:
```
Input: x = 121
Output: true

Explanation:
- 121 reads the same forward and backward
- Reversing: 121 → 121
```

### Example 2:
```
Input: x = -121
Output: false

Explanation:
- -121 does not read the same forward and backward
- The negative sign breaks the palindrome property
- Forward: -121, Backward: 121-
```

### Example 3:
```
Input: x = 10
Output: false

Explanation:
- 10 reads as "01" when reversed
- "10" ≠ "01"
```

### Visual Number Line

```
Palindrome Numbers:          -∞  ...  -11  -2  -1  0  1  2  11  ...  +∞
                              ↑           ↑   ↑  ↑  ↑  ↑  ↑   ↑
Non-Palindrome Numbers:              X   X       X          X
```

---

## Intuition

The key insight for solving this problem is recognizing that we only need to compare the **first half** of the digits with the **reversed second half**. We don't need to reverse the entire number.

### Key Observations

1. **Negative numbers are never palindromes** - The negative sign creates asymmetry
2. **Numbers ending with 0** (except 0 itself) are not palindromes - They would start with 0 when reversed
3. **We only need to reverse half the digits** - Once we've reversed enough digits to surpass the middle, we've compared enough

### Why Compare Only Half?

Consider the number `12321`:
```
Position:     1     2     3     4     5
Digit:        1     2     3     2     1
              ↑                   ↑
            First digit        Last digit
```

After reversing the second half:
- First half: `12`
- Reversed second half: `21`
- Since `12 == 21`, the number is a palindrome

We only need to compare up to the middle digit because:
- Digits before the middle → compared with reversed digits after the middle
- Middle digit (if odd) → doesn't need comparison (always matches itself)

### The "Aha!" Moment

```
x = 12321

Step 1: Reverse the second half
  reversed = 12 (from 21)
  
Step 2: Compare
  first_half = 12
  reversed = 12
  12 == 12 → True ✓

We only processed 2 digits instead of all 5!
```

---

## Solution Approaches

### Approach 1: Reverse Half the Number (Optimal) ✅ Recommended

This is the optimal solution that achieves O(log₁₀(x)) time complexity by reversing only half the digits.

#### Algorithm

The algorithm works as follows:
1. Handle edge cases (negative numbers, numbers ending with 0)
2. Reverse the second half of the number
3. Compare the first half with the reversed second half
4. Return `true` if they match, `false` otherwise

#### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        Check if an integer is a palindrome without converting to string.
        
        Strategy:
        1. Handle negative numbers (not palindromes)
        2. Handle numbers ending with 0 (not palindromes, except 0 itself)
        3. Reverse the second half of the number
        4. Compare first half with reversed second half
        
        Time Complexity: O(log₁₀(x))
        Space Complexity: O(1)
        """
        # Negative numbers cannot be palindromes
        if x < 0:
            return False
        
        # Numbers ending with 0 (except 0) cannot be palindromes
        if x % 10 == 0 and x != 0:
            return False
        
        reversed_num = 0
        
        # Reverse only half the number
        while x > reversed_num:
            reversed_num = (reversed_num * 10) + (x % 10)
            x //= 10
        
        # For odd digits, the middle digit is in reversed_num (x // 10)
        # For even digits, the middle is between x and reversed_num
        return x == reversed_num or x == reversed_num // 10
```
<!-- slide -->
```cpp
#include <iostream>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        // Negative numbers cannot be palindromes
        if (x < 0) {
            return false;
        }
        
        // Numbers ending with 0 (except 0) cannot be palindromes
        if (x % 10 == 0 && x != 0) {
            return false;
        }
        
        int reversed_num = 0;
        
        // Reverse only half the number
        while (x > reversed_num) {
            reversed_num = (reversed_num * 10) + (x % 10);
            x /= 10;
        }
        
        // For odd digits: x == reversed_num / 10
        // For even digits: x == reversed_num
        return x == reversed_num || x == reversed_num / 10;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(int x) {
        // Negative numbers cannot be palindromes
        if (x < 0) {
            return false;
        }
        
        // Numbers ending with 0 (except 0) cannot be palindromes
        if (x % 10 == 0 && x != 0) {
            return false;
        }
        
        int reversed_num = 0;
        
        // Reverse only half the number
        while (x > reversed_num) {
            reversed_num = (reversed_num * 10) + (x % 10);
            x /= 10;
        }
        
        // For odd digits: x == reversed_num / 10
        // For even digits: x == reversed_num
        return x == reversed_num || x == reversed_num / 10;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} x - integer to check
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // Negative numbers cannot be palindromes
    if (x < 0) {
        return false;
    }
    
    // Numbers ending with 0 (except 0) cannot be palindromes
    if (x % 10 === 0 && x !== 0) {
        return false;
    }
    
    let reversed_num = 0;
    
    // Reverse only half the number
    while (x > reversed_num) {
        reversed_num = (reversed_num * 10) + (x % 10);
        x = Math.floor(x / 10);
    }
    
    // For odd digits: x == reversed_num / 10
    // For even digits: x == reversed_num
    return x === reversed_num || x === Math.floor(reversed_num / 10);
};
```
````

#### Step-by-Step Example for x = 12321

```
Initial: x = 12321, reversed = 0

Iteration 1:
  reversed = 0 * 10 + 1 = 1
  x = 1232
  1232 > 1 → Continue

Iteration 2:
  reversed = 1 * 10 + 2 = 12
  x = 123
  123 > 12 → Continue

Iteration 3:
  reversed = 12 * 10 + 3 = 123
  x = 12
  12 > 123 → STOP

Compare: x = 12, reversed = 123
  12 == 123? No
  12 == 123 // 10 = 12? Yes! → Return true ✓
```

#### Step-by-Step Example for x = 1221

```
Initial: x = 1221, reversed = 0

Iteration 1:
  reversed = 0 * 10 + 1 = 1
  x = 122
  122 > 1 → Continue

Iteration 2:
  reversed = 1 * 10 + 2 = 12
  x = 12
  12 > 12 → STOP

Compare: x = 12, reversed = 12
  12 == 12? Yes! → Return true ✓
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(log₁₀(x)) - Each iteration removes one digit from x |
| **Space** | O(1) - Only using constant extra variables |

---

### Approach 2: Convert to String (Simpler but String-Based)

This approach converts the number to a string and checks if it's a palindrome. It's simpler but violates the "no string conversion" constraint that tests number manipulation skills.

#### Algorithm

The algorithm works as follows:
1. Convert the number to a string
2. Use two pointers to check if the string is a palindrome
3. Return `true` if all corresponding characters match, `false` otherwise

#### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        Check if an integer is a palindrome by converting to string.
        
        This approach is simpler but uses string conversion.
        
        Time Complexity: O(n) where n is the number of digits
        Space Complexity: O(n) for the string conversion
        """
        s = str(x)
        left, right = 0, len(s) - 1
        
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        
        return True
```
<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        string s = to_string(x);
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(int x) {
        String s = Integer.toString(x);
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} x - integer to check
 * @return {boolean}
 */
var isPalindrome = function(x) {
    const s = x.toString();
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
};
```
````

#### When to Use This Approach

- **When string conversion is allowed** (no constraints on string usage)
- **When code readability is prioritized** over optimization
- **For quick validation** before implementing the optimal solution

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) where n is the number of digits |
| **Space** | O(n) for string conversion |

---

### Approach 3: Reverse the Entire Number

This approach reverses the entire number and compares it with the original. It's a valid solution but performs more operations than necessary.

#### Algorithm

The algorithm works as follows:
1. Handle edge cases (negative numbers)
2. Reverse the entire number digit by digit
3. Compare the reversed number with the original
4. Return `true` if they match, `false` otherwise

#### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        Check if an integer is a palindrome by reversing the entire number.
        
        This approach reverses the full number and compares.
        
        Time Complexity: O(log₁₀(x))
        Space Complexity: O(1)
        """
        if x < 0:
            return False
        
        original = x
        reversed_num = 0
        
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x //= 10
        
        return original == reversed_num
```
<!-- slide -->
```cpp
class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0) {
            return false;
        }
        
        int original = x;
        int reversed_num = 0;
        
        while (x > 0) {
            reversed_num = reversed_num * 10 + x % 10;
            x /= 10;
        }
        
        return original == reversed_num;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) {
            return false;
        }
        
        int original = x;
        int reversed_num = 0;
        
        while (x > 0) {
            reversed_num = reversed_num * 10 + x % 10;
            x /= 10;
        }
        
        return original == reversed_num;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} x - integer to check
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0) {
        return false;
    }
    
    const original = x;
    let reversed_num = 0;
    
    while (x > 0) {
        reversed_num = reversed_num * 10 + x % 10;
        x = Math.floor(x / 10);
    }
    
    return original === reversed_num;
};
```
````

#### Limitation: Potential Overflow

This approach can cause **integer overflow** for large numbers in languages like C++ and Java:

```cpp
// Example of overflow issue
int x = 2147483647;  // INT_MAX
// When reversing, we might exceed INT_MAX
```

The half-reversal approach avoids this because `reversed_num` never exceeds the original number.

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(log₁₀(x)) - Must reverse all digits |
| **Space** | O(1) - Constant extra space |

---

### Approach 4: Recursive Approach

This approach uses recursion to check if the number is a palindrome. It's less efficient but demonstrates the concept clearly.

#### Algorithm

The algorithm works as follows:
1. Use a helper function that reverses digits recursively
2. Compare the reversed number with the original
3. Handle the base case when all digits are processed

#### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        Check if an integer is a palindrome using recursion.
        
        This approach is educational but less efficient.
        
        Time Complexity: O(log₁₀(x))
        Space Complexity: O(log₁₀(x)) due to recursion stack
        """
        if x < 0:
            return False
        
        # Helper function to reverse digits
        def reverse_digits(n: int) -> int:
            if n < 10:
                return n
            return reverse_digits(n // 10) * 10 + n % 10
        
        return x == reverse_digits(x)
```
<!-- slide -->
```cpp
#include <functional>
using namespace std;

class Solution {
private:
    // Helper function using recursion
    int reverseDigits(int n) {
        if (n < 10) {
            return n;
        }
        return reverseDigits(n / 10) * 10 + n % 10;
    }
    
public:
    bool isPalindrome(int x) {
        if (x < 0) {
            return false;
        }
        return x == reverseDigits(x);
    }
};
```
<!-- slide -->
```java
class Solution {
    private int reverseDigits(int n) {
        if (n < 10) {
            return n;
        }
        return reverseDigits(n / 10) * 10 + n % 10;
    }
    
    public boolean isPalindrome(int x) {
        if (x < 0) {
            return false;
        }
        return x == reverseDigits(x);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} x - integer to check
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0) {
        return false;
    }
    
    const reverseDigits = (n) => {
        if (n < 10) {
            return n;
        }
        return reverseDigits(Math.floor(n / 10)) * 10 + n % 10;
    };
    
    return x === reverseDigits(x);
};
```
````

#### Why This Approach is Less Preferred

- **Recursion depth** can be an issue for large numbers
- **Stack overhead** makes it less efficient
- **Harder to debug** due to recursion

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(log₁₀(x)) - Must process all digits |
| **Space** | O(log₁₀(x)) - Recursion stack |

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **Reverse Half (Optimal)** | O(log₁₀(x)) | O(1) | ✅ **General case** - Recommended |
| **String Conversion** | O(n) | O(n) | When string conversion is allowed |
| **Reverse Full** | O(log₁₀(x)) | O(1) | When half-reversal is confusing |
| **Recursive** | O(log₁₀(x)) | O(log₁₀(x)) | Educational purposes |

### Deep Dive: Optimal Approach (Reverse Half)

**Why O(log₁₀(x))?**
- Each iteration removes one digit from `x`
- The number of digits in `x` is approximately log₁₀(x)
- We stop when `x <= reversed_num`, which happens after about half the digits

**Why O(1) space?**
- We only use a few integer variables (`reversed_num`, `x`)
- No additional data structures proportional to input size

### Can We Do Better?

**No, we cannot achieve better than O(log₁₀(x)) time:**
- We must examine at least half the digits to make a decision
- Reading each digit takes at least constant time
- Any solution must be Ω(log₁₀(x)) (omega of log x)

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **x = 0**
   ```
   Input: x = 0
   Output: true
   Explanation: 0 is a single digit, so it's a palindrome.
   ```

2. **Single digit numbers (1-9)**
   ```
   Input: x = 7
   Output: true
   Explanation: All single-digit numbers are palindromes.
   ```

3. **Negative numbers**
   ```
   Input: x = -121
   Output: false
   Explanation: The negative sign breaks palindrome property.
   ```

4. **Numbers ending with 0**
   ```
   Input: x = 10
   Output: false
   Explanation: 10 reversed is 01, not 10.
   
   Input: x = 0
   Output: true
   Explanation: 0 is the only exception.
   ```

5. **Large palindrome numbers**
   ```
   Input: x = 12345678987654321
   Output: true
   Explanation: Reads the same forward and backward.
   ```

### Common Mistakes to Avoid

1. **Forgetting to handle negative numbers**
   ```python
   # Wrong!
   def isPalindrome(x):
       reversed_num = 0
       original = x
       while x > 0:
           # ... 
       return original == reversed_num
   
   # Correct!
   def isPalindrome(x):
       if x < 0:
           return False
       # ...
   ```

2. **Not handling numbers ending with 0**
   ```python
   # Wrong! - Returns true for 10
   def isPalindrome(x):
       # No special handling for x % 10 == 0
   
   # Correct!
   def isPalindrome(x):
       if x % 10 == 0 and x != 0:
           return False
   ```

3. **Integer overflow in full reversal**
   ```cpp
   // Wrong! - Can overflow for large numbers
   int reversed = 0;
   while (x > 0) {
       reversed = reversed * 10 + x % 10;
       // reversed might exceed INT_MAX
   }
   
   // Correct! - Half reversal prevents overflow
   while (x > reversed) {
       reversed = reversed * 10 + x % 10;
       x /= 10;
   }
   ```

4. **Not handling odd number of digits**
   ```python
   # Wrong! - Fails for 12321
   return x == reversed_num
   
   # Correct! - Handles both even and odd
   return x == reversed_num or x == reversed_num // 10
   ```

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Easy, but tests fundamental understanding
- **Pattern**: Leads to many related problems in string/number manipulation

### Learning Outcomes

1. **Number Manipulation**: Learn to manipulate digits without string conversion
2. **Two Pointers**: Understand the two-pointer technique for palindrome checking
3. **Optimization**: Learn to optimize by reducing unnecessary work (half reversal)
4. **Edge Case Handling**: Practice handling various edge cases

---

## Related Problems

### Same Pattern (Palindrome Checking)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | 125 | Easy | Check if string is palindrome (ignoring non-alphanumeric) |
| [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) | 680 | Easy | Check if string can be palindrome by removing one char |
| [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/) | 234 | Easy | Check if linked list is palindrome |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | 5 | Medium | Find longest palindromic substring |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Reverse Integer](https://leetcode.com/problems/reverse-integer/) | 7 | Medium | Reverse digits of an integer |
| [String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/) | 8 | Medium | Convert string to integer |
| [Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/) | 336 | Hard | Find all palindrome pairs in word list |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Palindrome Number - NeetCode](https://www.youtube.com/watch?v=4wnYTK8E-Lw)**
   - Excellent visual explanation of the half-reversal approach
   - Step-by-step walkthrough
   - Part of popular NeetCode playlist

2. **[Palindrome Number - William Lin](https://www.youtube.com/watch?v=fd2Cy3eVfMc)**
   - Clean and concise explanation
   - Multiple approaches covered
   - Great for interview preparation

3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=1vb2m71oLuU)**
   - Official solution walkthrough
   - Best practices and edge cases

4. **[Reverse Integer and Palindrome](https://www.youtube.com/watch?v=H7j1A7V8lqw)**
   - Comprehensive explanation of number manipulation
   - Related problems covered

### Additional Resources

- **[Palindrome Number - GeeksforGeeks](https://www.geeksforgeeks.org/palindrome-number/)** - Detailed explanation with examples
- **[LeetCode Discuss](https://leetcode.com/problems/palindrome-number/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of the optimal solution?**
   - Time: O(log₁₀(x)), Space: O(1)

2. **Why are negative numbers not palindromes?**
   - The negative sign creates asymmetry (-121 vs 121-)

3. **Why do numbers ending with 0 (except 0) fail the palindrome test?**
   - When reversed, they would start with 0 (10 → 01)

### Intermediate Level

4. **How would you modify the solution to handle very large numbers?**
   - Use arbitrary precision libraries or strings
   - The O(log₁₀(x)) algorithm still applies conceptually

5. **What's the difference between half-reversal and full-reversal?**
   - Half-reversal stops early, reducing iterations
   - Half-reversal avoids integer overflow

6. **How do you handle odd vs even digit counts?**
   - For odd: `x == reversed_num // 10`
   - For even: `x == reversed_num`

### Advanced Level

7. **How would you extend this to check palindromes in different bases?**
   - The same algorithm works for any base b
   - Use `x % b` and `x // b` instead of base 10

8. **How would you count the number of palindromic numbers in a range?**
   - Use mathematical formulas based on digit length
   - Count numbers with prefix and mirror

9. **What if we wanted to find the next palindrome number?**
   - Increment the first half and mirror it
   - Handle carry propagation

### Practical Implementation Questions

10. **How would you test this solution thoroughly?**
    - Test edge cases: 0, negative numbers, single digits
    - Test boundaries: large numbers, numbers near overflow
    - Test typical cases: palindromes and non-palindromes

11. **What are the real-world applications of this pattern?**
    - Data validation (credit card numbers, ISBN)
    - DNA sequence analysis
    - Cryptography and hashing

12. **How would you optimize this for very large integers (>64-bit)?**
    - Use string-based manipulation
    - Implement arbitrary-precision arithmetic

---

## Summary

The **Palindrome Number** problem is a classic example of efficient number manipulation without string conversion. The key insights are:

1. **Half Reversal**: We only need to reverse half the digits to make a comparison
2. **Edge Cases**: Negative numbers and numbers ending with 0 have special handling
3. **Optimality**: O(log₁₀(x)) time and O(1) space is optimal
4. **Practicality**: The pattern extends to many related problems in number manipulation

The problem demonstrates how understanding the mathematical structure of numbers can lead to elegant and efficient algorithms that are both optimal and easy to implement.

---

## LeetCode Link

[Palindrome Number - LeetCode](https://leetcode.com/problems/palindrome-number/)
