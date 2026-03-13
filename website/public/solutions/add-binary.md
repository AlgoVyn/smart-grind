# Add Binary

## Problem Description

Given two binary strings `a` and `b`, return their sum as a binary string.

**Note:** This is LeetCode Problem 67. You can find the original problem [here](https://leetcode.com/problems/add-binary/).

---

## Examples

### Example

**Input:**
```python
a = "11", b = "1"
```

**Output:**
```python
"100"
```

**Explanation:** Adding binary strings "11" and "1" gives "100".

### Example 2

**Input:**
```python
a = "1010", b = "1011"
```

**Output:**
```python
"10101"
```

**Explanation:** Adding binary strings "1010" and "1011" gives "10101".

---

## Constraints

- `1 <= a.length, b.length <= 10^4`
- `a` and `b` consist only of '0' or '1' characters.
- Each string does not contain leading zeros except for the zero itself.

---

## Pattern: Two Pointers / String Manipulation

This problem is a classic example of **String Manipulation** using the **Two Pointer** technique. The key insight is to simulate manual binary addition from right to left.

### Core Concept

- **Two-pointer approach**: Process from right to left (least significant bit)
- **Carry handling**: Use modulo 2 for current bit, division by 2 for carry
- **Edge cases**: Handle remaining carry after both strings exhausted
- **Reversal**: Reverse result at the end

---

## Intuition

The key insight for this problem is understanding how binary addition works and simulating it programmatically.

### Key Observations

1. **Binary Addition Rules**: 
   - 0 + 0 = 0 (carry 0)
   - 0 + 1 = 1 (carry 0)
   - 1 + 0 = 1 (carry 0)
   - 1 + 1 = 0 (carry 1)
   - 1 + 1 + 1 = 1 (carry 1)

2. **Process from Right**: Binary addition starts from the least significant bit (rightmost)

3. **Carry Propagation**: If sum >= 2, we have a carry to the next bit

4. **Different Lengths**: Handle strings of different lengths naturally

5. **Final Carry**: May need to add extra bit if carry remains

### Algorithm Overview

1. Start from rightmost bits of both strings
2. Add current bits along with carry
3. Compute current result bit (sum % 2)
4. Compute new carry (sum / 2)
5. Continue until both strings exhausted AND no carry remains
6. Reverse result to get correct order

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointer Simulation** - Standard approach
2. **Bit Manipulation** - Alternative using XOR and AND

---

## Approach 1: Two Pointer Simulation (Optimal)

### Algorithm Steps

1. Initialize pointers i and j at end of strings a and b
2. Initialize carry = 0 and result list
3. Loop while i >= 0 OR j >= 0 OR carry > 0:
   - Add bits from a and b if available
   - Calculate sum = bit_a + bit_b + carry
   - Append str(sum % 2) to result
   - Carry = sum // 2
4. Reverse and join result
5. Return binary string

### Why It Works

This approach works because:
- It exactly simulates manual binary addition
- Processing from right to left matches how we add manually
- The loop condition ensures final carry is processed
- Reversing gives correct most-significant-bit-first order

### Code Implementation

````carousel
```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        """
        Add two binary strings using two pointers.
        
        Args:
            a: First binary string
            b: Second binary string
            
        Returns:
            Sum as binary string
        """
        result = []
        carry = 0
        i, j = len(a) - 1, len(b) - 1
        
        # Process from right to left
        while i >= 0 or j >= 0 or carry:
            total = carry
            
            if i >= 0:
                total += int(a[i])
                i -= 1
            if j >= 0:
                total += int(b[j])
                j -= 1
            
            # Current bit and new carry
            result.append(str(total % 2))
            carry = total // 2
        
        # Reverse to get correct order
        return ''.join(reversed(result))
```

<!-- slide -->
```cpp
class Solution {
public:
    string addBinary(string a, string b) {
        string result;
        int carry = 0;
        int i = a.length() - 1, j = b.length() - 1;
        
        // Process from right to left
        while (i >= 0 || j >= 0 || carry) {
            int total = carry;
            
            if (i >= 0) {
                total += a[i] - '0';
                i--;
            }
            if (j >= 0) {
                total += b[j] - '0';
                j--;
            }
            
            // Current bit and new carry
            result.push_back((total % 2) + '0');
            carry = total / 2;
        }
        
        // Reverse to get correct order
        reverse(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String addBinary(String a, String b) {
        StringBuilder result = new StringBuilder();
        int carry = 0;
        int i = a.length() - 1, j = b.length() - 1;
        
        // Process from right to left
        while (i >= 0 || j >= 0 || carry > 0) {
            int total = carry;
            
            if (i >= 0) {
                total += a.charAt(i) - '0';
                i--;
            }
            if (j >= 0) {
                total += b.charAt(j) - '0';
                j--;
            }
            
            // Current bit and new carry
            result.append(total % 2);
            carry = total / 2;
        }
        
        // Reverse to get correct order
        return result.reverse().toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
    let result = [];
    let carry = 0;
    let i = a.length - 1;
    let j = b.length - 1;
    
    // Process from right to left
    while (i >= 0 || j >= 0 || carry) {
        let total = carry;
        
        if (i >= 0) {
            total += parseInt(a[i]);
            i--;
        }
        if (j >= 0) {
            total += parseInt(b[j]);
            j--;
        }
        
        // Current bit and new carry
        result.push(total % 2);
        carry = Math.floor(total / 2);
    }
    
    // Reverse and join
    return result.reverse().join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(max(len(a), len(b))) - process each bit once |
| **Space** | O(max(len(a), len(b))) - for result |

---

## Approach 2: Bit Manipulation

### Algorithm Steps

1. Use XOR (^) to get sum without carry
2. Use AND (&) shifted left to get carry
3. Loop until carry becomes 0
4. Note: Strings make this trickier, but can convert to integers for small values

### Why It Works

This approach works because:
- XOR gives sum of bits without carry
- AND shifted left gives the carry
- Combining them iteratively gives final sum

### Code Implementation

````carousel
```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        """Using bit manipulation."""
        # Convert to integers for bit manipulation
        # Note: Only works for reasonably sized inputs
        x = int(a, 2)
        y = int(b, 2)
        
        while y:
            # XOR gives sum without carry
            answer = x ^ y
            # AND shifted left gives carry
            carry = (x & y) << 1
            x, y = answer, carry
        
        return bin(x)[2:]  # Convert back to binary string
```

<!-- slide -->
```cpp
class Solution {
public:
    string addBinary(string a, string b) {
        // Convert to integers (careful with size!)
        long long x = stoll(a, nullptr, 2);
        long long y = stoll(b, nullptr, 2);
        
        while (y) {
            long long answer = x ^ y;
            long long carry = (x & y) << 1;
            x = answer;
            y = carry;
        }
        
        // Convert back to binary string
        return std::bitset<64>(x).to_string();
    }
};
```

<!-- slide -->
```java
class Solution {
    public String addBinary(String a, String b) {
        // Convert to long (careful with size!)
        long x = Long.parseLong(a, 2);
        long y = Long.parseLong(b, 2);
        
        while (y != 0) {
            long answer = x ^ y;
            long carry = (x & y) << 1;
            x = answer;
            y = carry;
        }
        
        return Long.toBinaryString(x);
    }
}
```

<!-- slide -->
```javascript
var addBinary = function(a, b) {
    // Convert to BigInt for large numbers
    const x = BigInt('0b' + a);
    const y = BigInt('0b' + b);
    
    while (y !== 0n) {
        const answer = x ^ y;
        const carry = (x & y) << 1n;
        x = answer;
        y = carry;
    }
    
    return x.toString(2);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(min(len(a), len(b))) - but Python handles big integers |
| **Space** | O(1) for bit manip, O(n) for conversion |

---

## Comparison of Approaches

| Aspect | Two Pointer | Bit Manipulation |
|--------|-------------|------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) - but limited by integer size |
| **Implementation** | More straightforward | Clever but limited |
| **LeetCode Optimal** | ✅ (most common) | ✅ (alternative) |
| **Difficulty** | Easy | Easy-Medium |

**Best Approach:** Use Approach 1 (Two Pointer) for its clarity and ability to handle arbitrary length strings.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in warm-up questions
- **Companies**: Amazon, Facebook, Microsoft
- **Difficulty**: Easy
- **Concepts Tested**: String manipulation, binary arithmetic, two pointers

### Learning Outcomes

1. **Binary Arithmetic**: Understand how binary addition works
2. **String Manipulation**: Process strings from end to beginning
3. **Carry Handling**: Properly handle carry propagation
4. **Edge Cases**: Handle different lengths and final carry

---

## Related Problems

Based on similar themes (string manipulation, arithmetic):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Add Strings | [Link](https://leetcode.com/problems/add-strings/) | String addition |
| Plus One | [Link](https://leetcode.com/problems/plus-one/) | Array addition |
| Multiply Strings | [Link](https://leetcode.com/problems/multiply-strings/) | String multiplication |
| Sum of Two Integers | [Link](https://leetcode.com/problems/sum-of-two-integers/) | Without + operator |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Add Binary](https://www.youtube.com/watch?v=2fD2-bY3Zjw)** - Clear explanation
2. **[Add Binary - LeetCode 67](https://www.youtube.com/watch?v=1iN3cP0K3qY)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you handle this for hexadecimal strings?

**Answer:** Change the base from 2 to 16. Use modulo 16 for current digit and division by 16 for carry. Map integers 0-15 to hex characters (0-9, a-f).

### Q2: Can you solve this without using extra space?

**Answer:** You can modify one of the strings in place if it's large enough, but this is complex. Not recommended for interviews.

### Q3: How would you handle strings with different lengths?

**Answer:** The current solution handles this naturally by checking bounds before accessing each string. No padding needed.

### Q4: What if you need to add multiple binary strings?

**Answer:** Extend the solution to process multiple strings by maintaining a list of pointers or using bit manipulation iteratively.

### Q5: How would you implement using bit manipulation?

**Answer:** Use XOR for sum without carry (`a ^ b`) and AND shifted left for carry (`(a & b) << 1`), loop until carry is 0.

---

## Common Pitfalls

### 1. Forgetting Final Carry
**Issue:** Returning without handling the final carry.

**Solution:** Include `or carry` in loop condition to ensure final carry processed.

### 2. Off-by-One in Reversal
**Issue:** Forgetting to reverse the result list.

**Solution:** Use `result[::-1]` or `reverse()` to get correct order.

### 3. String Index Bounds
**Issue:** Not checking if index is valid before accessing.

**Solution:** Always check `if i >= 0` and `if j >= 0` before accessing.

### 4. Type Conversion
**Issue:** Forgetting to convert character to integer.

**Solution:** Use `int(a[i])` or `a[i] - '0'` for proper conversion.

### 5. Using Wrong Operator
**Issue:** Using | instead of + or wrong modulo.

**Solution:** Remember binary rules: sum % 2 for bit, sum // 2 for carry.

---

## Summary

The **Add Binary** problem demonstrates **String Manipulation** and **Two Pointers**:

- **Two-pointer**: Process from right to left
- **Carry handling**: Use modulo 2 for bit, division by 2 for carry
- **Edge cases**: Handle remaining carry after both strings exhausted
- **Time complexity**: O(max(n, m)) - optimal

Key takeaways:
1. Process from least significant bit (right end)
2. Handle different length strings with bounds checking
3. Continue until both strings processed AND no carry remains
4. Reverse result at the end

This pattern extends to:
- Adding strings in any base
- Plus One problem
- Array/Linked List addition

---

## Additional Resources

- [LeetCode Problem 67](https://leetcode.com/problems/add-binary/) - Official problem page
- [Binary Addition - Wikipedia](https://en.wikipedia.org/wiki/Binary_number) - Binary arithmetic
- [Bit Manipulation](/patterns/bit-manipulation) - Related patterns
