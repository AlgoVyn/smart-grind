# Plus One

## Problem Statement

Given a non-empty array of decimal digits `digits` representing a non-negative integer, increment the integer by one and return the resulting array of digits.

The digits are stored such that the most significant digit is at the head of the list, meaning `digits[0]` is the thousands digit and `digits[-1]` is the ones digit.

**Constraints:**
- `1 <= digits.length <= 100`
- `0 <= digits[i] <= 9`
- The integer does not have leading zeros (except the number 0 itself)

## Examples

**Example 1:**
```
Input: digits = [1, 2, 3]
Output: [1, 2, 4]
Explanation: 123 + 1 = 124
```

**Example 2:**
```
Input: digits = [4, 3, 2, 1]
Output: [4, 3, 2, 2]
Explanation: 4321 + 1 = 4322
```

**Example 3:**
```
Input: digits = [9, 9, 9]
Output: [1, 0, 0, 0]
Explanation: 999 + 1 = 1000
```

## Intuition

The problem simulates adding 1 to a number represented as an array of digits. Key observations:

- We start adding from the least significant digit (rightmost)
- If adding 1 results in a value < 10, we're done
- If it equals 10, we set the digit to 0 and carry 1 to the next position
- This carry propagation continues until we either stop at a digit < 9 or exhaust all digits

## Multiple Approaches

### Approach 1: Reverse Iteration (Most Efficient)

The most efficient solution iterates from right to left, handling carry propagation. If a digit is less than 9, we increment and return early. If it's 9, we set it to 0 and continue. If all digits are 9, we prepend 1.

````carousel
```python
def plus_one(digits):
    """
    Time: O(n) - single pass through digits
    Space: O(1) - modifies array in place
    """
    n = len(digits)
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits  # Early return, no carry
        digits[i] = 0  # Handle carry, digit becomes 0
    
    # All digits were 9, need new leading 1
    return [1] + digits
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        int n = digits.length;
        for (int i = n - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        int[] result = new int[n + 1];
        result[0] = 1;
        return result;
    }
}
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        int n = digits.size();
        for (int i = n - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        vector<int> result(n + 1, 0);
        result[0] = 1;
        return result;
    }
};
```
<!-- slide -->
```javascript
var plusOne = function(digits) {
    const n = digits.length;
    for (let i = n - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;
        }
        digits[i] = 0;
    }
    return [1, ...digits];
};
```
````

### Approach 2: String Conversion (Simple but Less Efficient)

Convert the digit array to a string, add 1 to the integer, then convert back to a digit array.

````carousel
```python
def plus_one(digits):
    num = int(''.join(map(str, digits)))
    num += 1
    return [int(d) for d in str(num)]
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        StringBuilder sb = new StringBuilder();
        for (int d : digits) sb.append(d);
        long num = Long.parseLong(sb.toString()) + 1;
        String result = String.valueOf(num);
        int[] output = new int[result.length()];
        for (int i = 0; i < result.length(); i++) {
            output[i] = result.charAt(i) - '0';
        }
        return output;
    }
}
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        string s;
        for (int d : digits) s += to_string(d);
        int carry = 1;
        for (int i = s.length() - 1; i >= 0 && carry; i--) {
            int digit = s[i] - '0' + carry;
            s[i] = char('0' + (digit % 10));
            carry = digit / 10;
        }
        if (carry) s = '1' + s;
        vector<int> result;
        for (char c : s) result.push_back(c - '0');
        return result;
    }
};
```
<!-- slide -->
```javascript
var plusOne = function(digits) {
    const num = BigInt(digits.join('')) + 1n;
    return num.toString().split('').map(Number);
};
```
````

### Approach 3: Recursive Solution

A recursive approach that handles the last digit and recursively processes the rest.

````carousel
```python
def plus_one(digits):
    if not digits:
        return [1]
    if digits[-1] < 9:
        digits[-1] += 1
        return digits
    digits[-1] = 0
    return plus_one(digits[:-1]) + [0] if digits[:-1] else [1, 0]
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        return plusOneRecursive(digits, digits.length - 1);
    }
    private int[] plusOneRecursive(int[] digits, int index) {
        if (index < 0) {
            int[] result = new int[digits.length + 1];
            result[0] = 1;
            return result;
        }
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        digits[index] = 0;
        return plusOneRecursive(digits, index - 1);
    }
}
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        return plusOneRecursive(digits, digits.size() - 1);
    }
private:
    vector<int> plusOneRecursive(vector<int>& digits, int index) {
        if (index < 0) {
            vector<int> result(digits.size() + 1, 0);
            result[0] = 1;
            return result;
        }
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        digits[index] = 0;
        return plusOneRecursive(digits, index - 1);
    }
};
```
<!-- slide -->
```javascript
var plusOne = function(digits) {
    function recursive(digits, index) {
        if (index < 0) return [1, ...digits];
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        digits[index] = 0;
        return recursive(digits, index - 1);
    }
    return recursive(digits, digits.length - 1);
};
```
````

### Approach 4: Using List Slice for All-9s Case

Handle the general case and special all-9s case separately for clarity.

````carousel
```python
def plus_one(digits):
    if all(d == 9 for d in digits):
        return [1] + [0] * len(digits)
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            break
        digits[i] = 0
    return digits
```
<!-- slide -->
```java
class Solution {
    public int[] plusOne(int[] digits) {
        boolean allNines = true;
        for (int d : digits) {
            if (d != 9) { allNines = false; break; }
        }
        if (allNines) {
            int[] result = new int[digits.length + 1];
            result[0] = 1;
            return result;
        }
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) { digits[i]++; break; }
            digits[i] = 0;
        }
        return digits;
    }
}
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        bool allNines = all_of(digits.begin(), digits.end(), [](int d) { return d == 9; });
        if (allNines) {
            vector<int> result(digits.size() + 1, 0);
            result[0] = 1;
            return result;
        }
        for (int i = digits.size() - 1; i >= 0; i--) {
            if (digits[i] < 9) { digits[i]++; break; }
            digits[i] = 0;
        }
        return digits;
    }
};
```
<!-- slide -->
```javascript
var plusOne = function(digits) {
    if (digits.every(d => d === 9)) {
        return [1, ...digits.map(() => 0)];
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) { digits[i]++; break; }
        digits[i] = 0;
    }
    return digits;
};
```
````

## Time & Space Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Reverse Iteration | O(n) | O(1) | Best solution, early termination |
| String Conversion | O(n) | O(n) | Simple but uses extra memory |
| Recursive | O(n) | O(n) | Stack overhead |
| Separate Cases | O(n) | O(n) | Clear but more verbose |

**n = number of digits**

**Best Case Analysis:**
- When the last digit is < 9: O(1) time, just increment and return
- Example: [1, 2, 3] → O(1) operations

**Worst Case Analysis:**
- When all digits are 9: O(n) time, must process all digits
- Example: [9, 9, 9] → O(n) operations

## Common Pitfalls

1. **Carry Propagation**: Forgetting to continue checking after setting a digit to 0 can miss further carries.

2. **Leading Zeros**: The array shouldn't have leading zeros except for the number 0, but handle cases where all digits are 9.

3. **Empty Array**: Though unlikely, ensure the array is non-empty as per problem constraints.

4. **In-Place Modification**: Remember that the function modifies the input array; if preservation is needed, make a copy first.

5. **Edge Cases**: Don't forget the all-9s case which requires adding a new leading 1.

## Related Problems

1. **[Add Two Numbers (LeetCode 2)](https://leetcode.com/problems/add-two-numbers/)** - Add two numbers represented as linked lists

2. **[Add Binary (LeetCode 67)](https://leetcode.com/problems/add-binary/)** - Add two binary strings

3. **[Add Strings (LeetCode 415)](https://leetcode.com/problems/add-strings/)** - Add two non-negative integer strings

4. **[Plus One Linked List (LeetCode 369)](https://leetcode.com/problems/plus-one-linked-list/)** - Same problem with linked list representation

## Video Tutorial Links

- [NeetCode - Plus One](https://www.youtube.com/watch?v=1L1N199hbFw)
- [LeetCode Official Solution](https://leetcode.com/problems/plus-one/solution/)
- [Back to Back SWE - Plus One](https://www.youtube.com/watch?v=2J2-82tK6vw)

## Key Takeaways

1. **Early termination**: Most numbers don't cause carry propagation through all digits

2. **In-place modification**: Only allocate new space when necessary (all 9s case)

3. **Right-to-left processing**: Always start from least significant digit for arithmetic operations

4. **Handle edge cases**: Pay special attention to all-9s input which requires special handling

---

## Follow-up Questions

### 1. How would you modify the solution to add K instead of 1?

Add K to the last digit, then propagate any carry. The carry can be greater than 1, so use modulo and division by K's base. For base 10, if adding K=7, you may have carries larger than 1.

### 2. How would you solve this if the digits were stored in reverse order?

Process from left to right instead of right to left. Since the least significant digit is at index 0, simply iterate forward and handle carry as you go. No reversal needed.

### 3. How would you implement this for a linked list representation?

Reverse the linked list to process from least significant digit, add one, then reverse back. Or use recursion to traverse to the end and backtrack, adding one on the return path.

### 4. How would you handle very large numbers that exceed standard integer limits?

Never convert the entire array to an integer. Use string/array operations throughout - the carry propagation algorithm works identically regardless of number size.

### 5. Can you solve this in-place without modifying the original array?

Make a copy of the array first, then apply the standard algorithm to the copy. The all-9s case creates a new array anyway, so this is straightforward.

### 6. How would you optimize for the case where we have multiple additions?

Batch all additions into a single carry value. Instead of adding 1 K times, add K once and handle the carry. This reduces O(K × n) to O(n + log K).

### 7. How would you modify the solution for base-B addition?

Change the modulo and division base from 10 to B. For binary (base 2), this simplifies since 1 + 1 = 10, making carry propagation very efficient.

