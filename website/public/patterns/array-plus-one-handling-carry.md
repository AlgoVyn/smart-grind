# Array - Plus One (Handling Carry)

## Problem Description

The Array - Plus One pattern is used to increment a number represented as an array of digits by 1. This pattern handles carry-over from the least significant digit to more significant digits, and potentially adding a new digit if all digits are 9. The digits are stored such that the most significant digit is at the head of the list, meaning `digits[0]` is the thousands digit and `digits[-1]` is the ones digit.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through digits in worst case |
| Space Complexity | O(1) - modifies array in place, O(n) only when all digits are 9 |
| Input | Non-empty array of decimal digits (0-9) |
| Output | Array of digits representing the incremented number |
| Constraint | No leading zeros except the number 0 itself |

### When to Use
- When incrementing a number represented as an array of digits
- Problems requiring carry propagation through digits
- Array arithmetic problems (addition, subtraction)
- Big number arithmetic where standard types overflow
- Problems involving digit manipulation with carry handling

## Intuition

The key insight is to simulate the manual addition process we learned in school. When adding 1 to a number, we start from the least significant digit (rightmost position) and propagate any carry to the left.

The "aha!" moments:
1. **Start from the right**: Process digits from least significant to most significant
2. **Early termination**: Most numbers don't have trailing 9s, so we can often stop early
3. **Carry propagation**: When a digit is 9, it becomes 0 and carry continues left
4. **All 9s case**: If all digits are 9, we need a new leading 1 (e.g., 999 + 1 = 1000)
5. **In-place modification**: We can modify the array directly without extra space

## Solution Approaches

### Approach 1: Reverse Iteration with Early Termination (Optimal) ✅ Recommended

#### Algorithm
1. Start from the last index (least significant digit)
2. If current digit is less than 9, increment it and return immediately
3. If digit is 9, set it to 0 (carry continues)
4. Move to the next digit to the left
5. If we exit the loop, all digits were 9 - prepend 1 to the array

#### Implementation

````carousel
```python
def plus_one(digits):
    """
    Increment a number represented as an array of digits by one.
    LeetCode 66 - Plus One
    
    Time: O(n), Space: O(1)
    """
    n = len(digits)
    
    # Process from right to left (least significant digit first)
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits  # Early return, no carry needed
        digits[i] = 0  # Handle carry, digit becomes 0
    
    # All digits were 9, need new leading 1
    return [1] + digits
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> plusOne(std::vector<int>& digits) {
        int n = digits.size();
        
        // Process from right to left (least significant digit first)
        for (int i = n - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;  // Early return, no carry needed
            }
            digits[i] = 0;  // Handle carry, digit becomes 0
        }
        
        // All digits were 9, need new leading 1
        std::vector<int> result(n + 1, 0);
        result[0] = 1;
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        int n = digits.length;
        
        // Process from right to left (least significant digit first)
        for (int i = n - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;  // Early return, no carry needed
            }
            digits[i] = 0;  // Handle carry, digit becomes 0
        }
        
        // All digits were 9, need new leading 1
        int[] result = new int[n + 1];
        result[0] = 1;
        return result;
    }
}
```
<!-- slide -->
```javascript
function plusOne(digits) {
    const n = digits.length;
    
    // Process from right to left (least significant digit first)
    for (let i = n - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;  // Early return, no carry needed
        }
        digits[i] = 0;  // Handle carry, digit becomes 0
    }
    
    // All digits were 9, need new leading 1
    return [1, ...digits];
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass, often terminates early |
| Space | O(1) - in-place, O(n) only for all-9s case |

### Approach 2: Explicit Carry Variable

This approach uses an explicit carry variable, making the carry logic more explicit and easier to extend for adding values other than 1.

#### Algorithm
1. Initialize carry = 1 (the value we're adding)
2. For each digit from right to left:
   - Add carry to current digit
   - Set digit to total % 10
   - Update carry to total / 10
   - If carry is 0, break early
3. If carry remains, prepend it to the result

#### Implementation

````carousel
```python
def plus_one_carry(digits):
    """
    Increment using explicit carry variable.
    
    Time: O(n), Space: O(1)
    """
    carry = 1  # We're adding 1
    
    for i in range(len(digits) - 1, -1, -1):
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        
        if carry == 0:
            break  # Early termination
    
    if carry:
        return [carry] + digits
    return digits
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> plusOne(std::vector<int>& digits) {
        int carry = 1;  // We're adding 1
        
        for (int i = digits.size() - 1; i >= 0; i--) {
            int total = digits[i] + carry;
            digits[i] = total % 10;
            carry = total / 10;
            
            if (carry == 0) {
                break;  // Early termination
            }
        }
        
        if (carry > 0) {
            std::vector<int> result(digits.size() + 1, 0);
            result[0] = carry;
            return result;
        }
        return digits;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        int carry = 1;  // We're adding 1
        
        for (int i = digits.length - 1; i >= 0; i--) {
            int total = digits[i] + carry;
            digits[i] = total % 10;
            carry = total / 10;
            
            if (carry == 0) {
                break;  // Early termination
            }
        }
        
        if (carry > 0) {
            int[] result = new int[digits.length + 1];
            result[0] = carry;
            return result;
        }
        return digits;
    }
}
```
<!-- slide -->
```javascript
function plusOne(digits) {
    let carry = 1;  // We're adding 1
    
    for (let i = digits.length - 1; i >= 0; i--) {
        const total = digits[i] + carry;
        digits[i] = total % 10;
        carry = Math.floor(total / 10);
        
        if (carry === 0) {
            break;  // Early termination
        }
    }
    
    if (carry > 0) {
        return [carry, ...digits];
    }
    return digits;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through digits |
| Space | O(1) - in-place modification |

### Approach 3: Recursive Solution

A recursive approach that handles the last digit and recursively processes the rest. This demonstrates the recursive nature of carry propagation.

#### Algorithm
1. Define recursive helper with index parameter
2. Base case: if index < 0, we need a new leading digit
3. If current digit < 9, increment and return
4. Otherwise, set to 0 and recurse on previous index

#### Implementation

````carousel
```python
def plus_one_recursive(digits):
    """
    Increment using recursion.
    
    Time: O(n), Space: O(n) for recursion stack
    """
    def helper(index):
        # Base case: if index is negative, we need to add a new digit
        if index < 0:
            return [1] + digits
        
        # If current digit is less than 9, increment and return
        if digits[index] < 9:
            digits[index] += 1
            return digits
        
        # Set current digit to 0 and recurse
        digits[index] = 0
        return helper(index - 1)
    
    return helper(len(digits) - 1)
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> plusOne(std::vector<int>& digits) {
        return plusOneRecursive(digits, digits.size() - 1);
    }
    
private:
    std::vector<int> plusOneRecursive(std::vector<int>& digits, int index) {
        // Base case: if index is negative, we need to add a new digit
        if (index < 0) {
            std::vector<int> result(digits.size() + 1, 0);
            result[0] = 1;
            return result;
        }
        
        // If current digit is less than 9, increment and return
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        
        // Set current digit to 0 and recurse
        digits[index] = 0;
        return plusOneRecursive(digits, index - 1);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        return plusOneRecursive(digits, digits.length - 1);
    }
    
    private int[] plusOneRecursive(int[] digits, int index) {
        // Base case: if index is negative, we need to add a new digit
        if (index < 0) {
            int[] result = new int[digits.length + 1];
            result[0] = 1;
            return result;
        }
        
        // If current digit is less than 9, increment and return
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        
        // Set current digit to 0 and recurse
        digits[index] = 0;
        return plusOneRecursive(digits, index - 1);
    }
}
```
<!-- slide -->
```javascript
function plusOne(digits) {
    function recursive(digits, index) {
        // Base case: if index is negative, we need to add a new digit
        if (index < 0) {
            return [1, ...digits];
        }
        
        // If current digit is less than 9, increment and return
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        
        // Set current digit to 0 and recurse
        digits[index] = 0;
        return recursive(digits, index - 1);
    }
    
    return recursive(digits, digits.length - 1);
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - may visit all digits in worst case |
| Space | O(n) - recursion stack depth |

### Approach 4: String Conversion (Not Recommended)

Convert the digit array to a string, add 1 to the integer, then convert back. This approach is simple but has limitations with very large numbers.

#### Implementation

````carousel
```python
def plus_one_string(digits):
    """
    Increment using string conversion.
    NOT RECOMMENDED - limited by integer size.
    
    Time: O(n), Space: O(n)
    """
    num = int(''.join(map(str, digits)))
    num += 1
    return [int(d) for d in str(num)]
```
<!-- slide -->
```cpp
#include <vector>
#include <string>

class Solution {
public:
    std::vector<int> plusOne(std::vector<int>& digits) {
        // Convert to string
        std::string s;
        for (int d : digits) {
            s += std::to_string(d);
        }
        
        // Add 1 with carry handling
        int carry = 1;
        for (int i = s.length() - 1; i >= 0 && carry; i--) {
            int digit = (s[i] - '0') + carry;
            s[i] = char('0' + (digit % 10));
            carry = digit / 10;
        }
        
        if (carry) {
            s = '1' + s;
        }
        
        // Convert back to vector
        std::vector<int> result;
        for (char c : s) {
            result.push_back(c - '0');
        }
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        StringBuilder sb = new StringBuilder();
        for (int d : digits) {
            sb.append(d);
        }
        
        // Convert to BigInteger for arbitrary precision
        java.math.BigInteger num = new java.math.BigInteger(sb.toString());
        num = num.add(java.math.BigInteger.ONE);
        String result = num.toString();
        
        // Convert back to array
        int[] output = new int[result.length()];
        for (int i = 0; i < result.length(); i++) {
            output[i] = result.charAt(i) - '0';
        }
        return output;
    }
}
```
<!-- slide -->
```javascript
function plusOne(digits) {
    // Use BigInt to handle arbitrarily large numbers
    const num = BigInt(digits.join('')) + 1n;
    return num.toString().split('').map(Number);
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(n) |
| Limitation | May overflow standard integer types |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Reverse Iteration | O(n) | O(1) | **Recommended** - Most efficient and clean |
| Explicit Carry | O(n) | O(1) | Good for extending to add other values |
| Recursive | O(n) | O(n) | Educational - demonstrates recursion |
| String Conversion | O(n) | O(n) | Simple but limited by integer overflow |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Plus One](https://leetcode.com/problems/plus-one/) | 66 | Easy | Increment number represented as array |
| [Add to Array-Form of Integer](https://leetcode.com/problems/add-to-array-form-of-integer/) | 989 | Easy | Add an integer to array-form number |
| [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) | 2 | Medium | Add two numbers as linked lists |
| [Add Binary](https://leetcode.com/problems/add-binary/) | 67 | Easy | Add two binary strings |
| [Add Strings](https://leetcode.com/problems/add-strings/) | 415 | Easy | Add two non-negative integer strings |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings/) | 43 | Medium | Multiply two numbers as strings |
| [Plus One Linked List](https://leetcode.com/problems/plus-one-linked-list/) | 369 | Medium | Plus one with linked list representation |

## Video Tutorial Links

1. **[NeetCode - Plus One](https://www.youtube.com/watch?v=1L1N199hbFw)** - Clear explanation of reverse iteration
2. **[Back To Back SWE - Plus One](https://www.youtube.com/watch?v=2J2-82tK6vw)** - Detailed walkthrough with examples
3. **[Kevin Naughton Jr. - LeetCode 66](https://www.youtube.com/watch?v=IcK5QO7S5B0)** - Step-by-step explanation
4. **[Nick White - Plus One](https://www.youtube.com/watch?v=JLdL2jQ6p2M)** - Quick solution explanation
5. **[Techdose - Plus One](https://www.youtube.com/watch?v=IcK5QO7S5B0)** - Multiple approaches

## Summary

### Key Takeaways
- **Start from the right** (least significant digit) when handling carry
- **Early termination**: Return immediately when digit < 9 after incrementing
- **All 9s case**: Return new array with leading 1 followed by zeros
- **Carry propagation**: 9 becomes 0, carry continues to next digit
- **When to apply**: Any digit array arithmetic with carry handling

### Common Pitfalls
- Processing digits from left to right (wrong order)
- Forgetting to handle the all-9s case (array size increases)
- Not propagating carry correctly through consecutive 9s
- Integer overflow when converting to numeric types
- Off-by-one errors in loop bounds

### Follow-up Questions
1. **How would you modify the solution to add K instead of 1?**
   - Use explicit carry approach, add K to last digit, propagate carry

2. **How would you solve this if the digits were stored in reverse order?**
   - Process from left to right instead, same carry logic applies

3. **How would you implement this for a linked list representation?**
   - Reverse the list, add one, then reverse back; or use recursion

4. **How would you handle very large numbers that exceed standard integer limits?**
   - Never convert to integer; use array operations throughout

5. **Can you generalize this to add two arrays of digits?**
   - Yes, use same carry propagation with two pointers

## Pattern Source

[Plus One Pattern](patterns/array-plus-one-handling-carry.md)
