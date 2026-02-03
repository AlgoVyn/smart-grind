# Array - Plus One (Handling Carry)

## Overview

The Array - Plus One pattern is used to increment a number represented as an array of digits by 1. This pattern handles carry-over from the least significant digit to more significant digits, and potentially adding a new digit if all digits are 9.

## Problem Statement

Given a non-empty array of decimal digits `digits` representing a non-negative integer, increment the integer by one and return the resulting array of digits.

The digits are stored such that the most significant digit is at the head of the list, meaning `digits[0]` is the thousands digit and `digits[-1]` is the ones digit.

### Examples

- **Input:** `digits = [1, 2, 3]`<br>
  **Output:** `[1, 2, 4]`<br>
  **Explanation:** 123 + 1 = 124

- **Input:** `digits = [4, 3, 2, 1]`<br>
  **Output:** `[4, 3, 2, 2]`<br>
  **Explanation:** 4321 + 1 = 4322

- **Input:** `digits = [9, 9, 9]`<br>
  **Output:** `[1, 0, 0, 0]`<br>
  **Explanation:** 999 + 1 = 1000

- **Input:** `digits = [0]`<br>
  **Output:** `[1]`<br>
  **Explanation:** 0 + 1 = 1

- **Input:** `digits = [1, 9, 9]`<br>
  **Output:** `[2, 0, 0]`<br>
  **Explanation:** 199 + 1 = 200

### Constraints

- `1 <= digits.length <= 100`
- `0 <= digits[i] <= 9`
- The integer does not have leading zeros (except the number 0 itself)

## Intuition

The key insight is to simulate the manual addition process we learned in school. When adding 1 to a number:

1. We start from the least significant digit (rightmost position).
2. If the digit is less than 9, we simply increment it and we're done.
3. If the digit is 9, adding 1 makes it 10, so we set it to 0 and carry 1 to the next digit.
4. This carry propagation continues until we either stop at a digit < 9 or exhaust all digits.
5. If all digits are 9, we need to add a new leading 1 (e.g., 999 + 1 = 1000).

The beauty of this approach is that we can often terminate early - most numbers don't have all trailing 9s, so we only need to process a few digits from the right.

---

## Approach 1: Reverse Iteration with Early Termination (Primary and Efficient)

This approach iterates from right to left, handling carry propagation. If a digit is less than 9, we increment and return early. If it's 9, we set it to 0 and continue. If all digits are 9, we prepend 1.

### Implementation

````carousel
```python
def plus_one(digits):
    """
    Increment a number represented as an array of digits by one.
    
    Time: O(n) - single pass through digits in worst case
    Space: O(1) - modifies array in place, O(n) only when all digits are 9
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

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
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
};
```
````

### Explanation Step-by-Step

1. **Right-to-Left Iteration:** Start from the last element (least significant digit) and move left.

2. **Early Termination Check:** If the current digit is less than 9, simply increment it and return immediately. No carry propagation needed.

3. **Carry Handling:** If the digit is 9, set it to 0 (since 9 + 1 = 10) and continue to the next digit. The carry is implicit.

4. **All-9s Case:** If we exit the loop without returning, all digits were 9. Create a new array with a leading 1 followed by zeros.

### Complexity Analysis

- **Time Complexity:** O(n) - In the worst case (all 9s), we process all n digits. In the best case (last digit < 9), it's O(1).
- **Space Complexity:** O(1) - We modify the array in place. Only when all digits are 9 do we allocate O(n) space for the new array.

This is the optimal approach for this problem, as any solution must at least examine the digits that need to be modified.

---

## Approach 2: String Conversion (Simple but Less Efficient)

Convert the digit array to a string, add 1 to the integer, then convert back to a digit array. This approach is simple but has limitations with very large numbers.

### Implementation

````carousel
```python
def plus_one(digits):
    """
    Increment using string conversion.
    
    Time: O(n) - for join, conversion, and split
    Space: O(n) - for string and new array
    """
    # Convert to string, then to integer, add 1
    num = int(''.join(map(str, digits)))
    num += 1
    
    # Convert back to array of digits
    return [int(d) for d in str(num)]
```

```java
class Solution {
    public int[] plusOne(int[] digits) {
        StringBuilder sb = new StringBuilder();
        for (int d : digits) {
            sb.append(d);
        }
        
        // Convert to long, add 1 (long handles up to 19 digits)
        long num = Long.parseLong(sb.toString()) + 1;
        String result = String.valueOf(num);
        
        // Convert back to array
        int[] output = new int[result.length()];
        for (int i = 0; i < result.length(); i++) {
            output[i] = result.charAt(i) - '0';
        }
        return output;
    }
}
```

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
        
        // Add leading 1 if carry remains
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

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    // Use BigInt to handle arbitrarily large numbers
    const num = BigInt(digits.join('')) + 1n;
    
    // Convert back to array of digits
    return num.toString().split('').map(Number);
};
```
````

### Explanation Step-by-Step

1. **String Construction:** Join all digits into a single string representation of the number.

2. **Numeric Conversion:** Convert the string to a numeric type (int, long, BigInt) and add 1.

3. **Back to Digits:** Convert the result back to a string, then split into individual digit characters.

4. **Type Conversion:** Convert each character back to a numeric digit.

### Complexity Analysis

- **Time Complexity:** O(n) - String operations and conversions are linear in the number of digits.
- **Space Complexity:** O(n) - We create strings and a new array for the result.

**Limitations:** This approach may fail for very large numbers that exceed the maximum value of standard integer types (though BigInt in JavaScript handles arbitrarily large numbers).

---

## Approach 3: Recursive Solution (Educational)

A recursive approach that handles the last digit and recursively processes the rest. This demonstrates the recursive nature of carry propagation.

### Implementation

````carousel
```python
def plus_one(digits):
    """
    Increment using recursion.
    
    Time: O(n) - may visit all digits in worst case
    Space: O(n) - recursion stack depth
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

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
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
};
```
````

### Explanation Step-by-Step

1. **Recursive Function:** Define a helper function that takes the current index.

2. **Base Case:** If index < 0, we've processed all digits and still have a carry. Create a new array with leading 1.

3. **Early Return:** If current digit < 9, increment it and return (no further carry).

4. **Recursive Step:** Set current digit to 0 and recurse on the previous index.

### Complexity Analysis

- **Time Complexity:** O(n) - In the worst case, we visit all digits.
- **Space Complexity:** O(n) - Recursion stack depth can be up to n in the worst case.

This approach is educational but less efficient than the iterative approach due to stack overhead.

---

## Approach 4: Explicit Carry Variable (Alternative Iterative)

Use an explicit carry variable instead of relying on the implicit carry from setting digits to 0. This makes the carry logic more explicit.

### Implementation

````carousel
```python
def plus_one(digits):
    """
    Increment using explicit carry variable.
    
    Time: O(n) - single pass through digits
    Space: O(1) - modifies in place, O(n) only when all digits are 9
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

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
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
};
```
````

### Explanation Step-by-Step

1. **Initialize Carry:** Start with carry = 1 (the value we're adding).

2. **Process Digits:** For each digit from right to left:
   - Add the carry to the current digit.
   - Set the digit to the result modulo 10 (the new digit value).
   - Update carry to the result divided by 10 (the new carry value).

3. **Early Termination:** If carry becomes 0, we can stop processing.

4. **Handle Remaining Carry:** If we exit the loop with carry > 0, prepend it to the result.

### Complexity Analysis

- **Time Complexity:** O(n) - Single pass through digits in worst case.
- **Space Complexity:** O(1) - In-place modification, O(n) only when all digits are 9.

This approach is more explicit about the carry logic and can be easily extended to add values other than 1.

---

## Approach 5: Separate Cases for All-9s (Clear but Verbose)

Handle the general case and special all-9s case separately for clarity. This makes the code more readable but requires an extra pass to check for all 9s.

### Implementation

````carousel
```python
def plus_one(digits):
    """
    Increment with separate handling for all-9s case.
    
    Time: O(n) - two passes in worst case
    Space: O(n) - new array for all-9s case
    """
    # Check if all digits are 9
    if all(d == 9 for d in digits):
        return [1] + [0] * len(digits)
    
    # General case: increment from right
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            break
        digits[i] = 0
    
    return digits
```

```java
class Solution {
    public int[] plusOne(int[] digits) {
        // Check if all digits are 9
        boolean allNines = true;
        for (int d : digits) {
            if (d != 9) {
                allNines = false;
                break;
            }
        }
        
        if (allNines) {
            int[] result = new int[digits.length + 1];
            result[0] = 1;
            return result;
        }
        
        // General case: increment from right
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                break;
            }
            digits[i] = 0;
        }
        
        return digits;
    }
}
```

```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<int> plusOne(std::vector<int>& digits) {
        // Check if all digits are 9
        bool allNines = std::all_of(
            digits.begin(), 
            digits.end(), 
            [](int d) { return d == 9; }
        );
        
        if (allNines) {
            std::vector<int> result(digits.size() + 1, 0);
            result[0] = 1;
            return result;
        }
        
        // General case: increment from right
        for (int i = digits.size() - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                break;
            }
            digits[i] = 0;
        }
        
        return digits;
    }
};
```

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    // Check if all digits are 9
    if (digits.every(d => d === 9)) {
        return [1, ...digits.map(() => 0)];
    }
    
    // General case: increment from right
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            break;
        }
        digits[i] = 0;
    }
    
    return digits;
};
```
````

### Explanation Step-by-Step

1. **All-9s Check:** First, check if all digits are 9. If so, return [1] followed by zeros.

2. **General Case:** If not all 9s, iterate from right to left:
   - Find the first digit that's not 9.
   - Increment it and break.
   - Set all trailing 9s to 0.

### Complexity Analysis

- **Time Complexity:** O(n) - Two passes in worst case (one to check all 9s, one to increment).
- **Space Complexity:** O(n) - New array only for all-9s case.

This approach is very readable but slightly less efficient due to the extra pass.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Reverse Iteration (Early Termination) | O(n) worst, O(1) best | O(1) | **Recommended** - Most efficient and clean |
| String Conversion | O(n) | O(n) | Simple but limited by integer overflow |
| Recursive | O(n) | O(n) | Educational - demonstrates recursion |
| Explicit Carry | O(n) | O(1) | Good for extending to add other values |
| Separate Cases | O(n) | O(n) | Very readable but extra pass |

---

## Key Concepts

- **Digit-wise Increment**: Start from the last digit (least significant) and increment.
- **Carry Handling**: If a digit becomes 10 after increment, set to 0 and carry 1 to next digit.
- **Leading Digit Carry**: If all digits are 9, add a new digit at the beginning.
- **Early Termination**: Most numbers don't cause carry propagation through all digits.
- **In-place Modification**: Only allocate new space when necessary (all 9s case).

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of digits (worst case, all digits are 9).
- **Space Complexity**: O(n) in the worst case (when a new digit is added), O(1) otherwise.

## Common Pitfalls

- **Not handling carry correctly**: Failing to propagate carry to higher digits leads to incorrect results.
- **Forgetting the case where all digits are 9**: Can result in an incorrect length array.
- **Incorrect loop direction**: Starting from the first digit instead of the last digit.
- **Off-by-one errors**: Incorrect loop bounds can cause digits to be missed.
- **Integer overflow**: Converting to integer types can fail for very large numbers.

## Example Problems

1. **Plus One (LeetCode 66)**: Increment a number represented as an array of digits.
2. **Plus Two or Other Values**: Extend the pattern to add other single-digit values.
3. **Add Two Numbers as Arrays**: Add two numbers represented as digit arrays.
4. **Add to Array-Form of Integer (LeetCode 989)**: Add an integer to an array-form number.

## Related Problems

Here are some LeetCode problems that build on similar concepts (array arithmetic, carry handling, or digit manipulation):

- [Add Two Numbers (Medium)](https://leetcode.com/problems/add-two-numbers/) - Add two numbers represented as linked lists.
- [Add Binary (Easy)](https://leetcode.com/problems/add-binary/) - Add two binary strings.
- [Add Strings (Easy)](https://leetcode.com/problems/add-strings/) - Add two non-negative integer strings.
- [Plus One Linked List (Medium)](https://leetcode.com/problems/plus-one-linked-list/) - Same problem with linked list representation.
- [Add to Array-Form of Integer (Easy)](https://leetcode.com/problems/add-to-array-form-of-integer/) - Add an integer to an array-form number.
- [Multiply Strings (Medium)](https://leetcode.com/problems/multiply-strings/) - Multiply two numbers represented as strings.
- [Add Two Numbers II (Medium)](https://leetcode.com/problems/add-two-numbers-ii/) - Add two numbers represented as linked lists without reversal.

## Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

- [NeetCode - Plus One](https://www.youtube.com/watch?v=1L1N199hbFw) - Clear explanation of the reverse iteration approach.
- [LeetCode Official Solution - Plus One](https://leetcode.com/problems/plus-one/solution/) - Official solution with multiple approaches.
- [Back to Back SWE - Plus One](https://www.youtube.com/watch?v=2J2-82tK6vw) - Detailed walkthrough with examples.
- [Techdose - Plus One LeetCode 66](https://www.youtube.com/watch?v=IcK5QO7S5B0) - Step-by-step explanation.
- [Nick White - Plus One](https://www.youtube.com/watch?v=JLdL2jQ6p2M) - Quick solution explanation.

## Follow-up Questions

1. **How would you modify the solution to add K instead of 1?**

   **Answer:** Add K to the last digit, then propagate any carry. The carry can be greater than 1, so use modulo and division by 10. For example, if adding K=7 to [9, 9], you get [9, 16] → [10, 6] → [1, 0, 6].

2. **How would you solve this if the digits were stored in reverse order?**

   **Answer:** Process from left to right instead of right to left. Since the least significant digit is at index 0, simply iterate forward and handle carry as you go. No reversal needed.

3. **How would you implement this for a linked list representation?**

   **Answer:** Reverse the linked list to process from least significant digit, add one, then reverse back. Or use recursion to traverse to the end and backtrack, adding one on the return path.

4. **How would you handle very large numbers that exceed standard integer limits?**

   **Answer:** Never convert the entire array to an integer. Use string/array operations throughout - the carry propagation algorithm works identically regardless of number size.

5. **Can you solve this in-place without modifying the original array?**

   **Answer:** Make a copy of the array first, then apply the standard algorithm to the copy. The all-9s case creates a new array anyway, so this is straightforward.

6. **How would you optimize for the case where we have multiple additions?**

   **Answer:** Batch all additions into a single carry value. Instead of adding 1 K times, add K once and handle the carry. This reduces O(K × n) to O(n + log K).

7. **How would you modify the solution for base-B addition?**

   **Answer:** Change the modulo and division base from 10 to B. For binary (base 2), this simplifies since 1 + 1 = 10, making carry propagation very efficient.

8. **What if the input array could have leading zeros?**

   **Answer:** First, strip leading zeros from the input array (except keep [0] if the number is zero). Then apply the standard algorithm. The result should also not have leading zeros.

9. **How would you implement subtraction instead of addition?**

   **Answer:** Similar approach but with borrowing instead of carrying. Start from the least significant digit, subtract 1. If the digit becomes negative, add 10 and borrow 1 from the next digit. Handle the case where we need to borrow from a non-existent digit (negative result).

10. **Can you generalize this to add two arrays of digits?**

    **Answer:** Yes, use the same carry propagation approach. Start from the rightmost digits of both arrays, add them along with the carry, store the result modulo 10, and propagate the carry. Handle arrays of different lengths by treating missing digits as 0.

## LeetCode Link

[Plus One - LeetCode 66](https://leetcode.com/problems/plus-one/)
