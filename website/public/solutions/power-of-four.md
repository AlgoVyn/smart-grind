# Power Of Four

## LeetCode Link

[LeetCode 342 - Power of Four](https://leetcode.com/problems/power-of-four/)

---

## Problem Description

Given an integer `n`, return `true` if it is a power of four. Otherwise, return `false`.

An integer `n` is a power of four, if there exists an integer `x` such that `n == 4^x`.

---

## Examples

### Example 1

**Input:**
```
n = 16
```

**Output:**
```
true
```

**Explanation:**
- 4² = 16, so 16 is a power of four

### Example 2

**Input:**
```
n = 5
```

**Output:**
```
false
```

**Explanation:**
- 5 is not a power of four (4^1 = 4, 4^2 = 16)

### Example 3

**Input:**
```
n = 1
```

**Output:**
```
true
```

**Explanation:**
- 4^0 = 1, so 1 is a power of four

---

## Constraints

- `-2^31 <= n <= 2^31 - 1`

---

## Follow up

Could you solve it without loops/recursion?

---

## Pattern: Bit Manipulation

This problem uses **Bit Manipulation** tricks. Check: (1) positive, (2) power of 2 (one bit set), (3) bit at even position.

---

## Intuition

The key insight for this problem is understanding the binary representation of powers of four:

### Key Observations

1. **Power of Four = Power of Two + Even Position**: A number is a power of four if and only if:
   - It is a power of two (only one bit set)
   - That single bit is at an even position (0-indexed from right)

2. **Why Even Positions?**: 
   - 4^0 = 1 → binary: 1 (bit position 0, even)
   - 4^1 = 4 → binary: 100 (bit position 2, even)
   - 4^2 = 16 → binary: 10000 (bit position 4, even)
   - All powers of 4 have their single bit at position 0, 2, 4, 6, ...

3. **Bit Manipulation Tricks**:
   - `n & (n - 1) == 0`: Checks if n is a power of two (only one bit set)
   - `n & 0xAAAAAAAA == 0`: Checks if the set bit is at an even position (0xAAAAAAAA has 1s at odd positions)

### Algorithm Overview

1. **Check positive**: n > 0 (negative numbers and zero cannot be powers of four)
2. **Check power of two**: n & (n - 1) == 0
3. **Check even position**: n & 0xAAAAAAAA == 0
4. Return true if all conditions pass

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bit Manipulation** - Optimal O(1) solution
2. **Logarithmic** - Using math
3. **Loop** - Iterative approach (not recommended but shows concept)

---

## Approach 1: Bit Manipulation (Optimal)

### Algorithm Steps

1. Check if n > 0
2. Check if n is power of two: (n & (n - 1)) == 0
3. Check if bit is at even position: (n & 0xAAAAAAAA) == 0
4. Return true if all conditions pass

### Why It Works

- `n & (n - 1)` turns off the rightmost set bit. If result is 0, there was only one bit set.
- `0xAAAAAAAA` in binary is 101010101010... (1s at odd positions). ANDing with it checks if any bit at odd position is set.

### Code Implementation

````carousel
```python
class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        # Check: positive, power of 2, bit at even position
        return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isPowerOfFour(int n) {
        // Check: positive, power of 2, bit at even position
        return n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isPowerOfFour(int n) {
        // Check: positive, power of 2, bit at even position
        return n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfFour = function(n) {
    // Check: positive, power of 2, bit at even position
    return n > 0 && (n & (n - 1)) === 0 && (n & 0xAAAAAAAA) === 0;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) — constant number of operations |
| **Space** | O(1) — no extra space |

---

## Approach 2: Logarithmic Method

### Algorithm Steps

1. Use logarithm to find exponent: log(n) / log(4)
2. Check if result is an integer (within floating point tolerance)
3. Also verify n is positive

### Why It Works

If n = 4^k, then log(n) = k * log(4), so k = log(n) / log(4). If k is an integer, n is a power of 4.

### Code Implementation

````carousel
```python
import math

class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        if n <= 0:
            return False
        # log(n) / log(4) should be an integer
        exp = math.log(n) / math.log(4)
        return abs(exp - round(exp)) < 1e-10
```

<!-- slide -->
```cpp
#include <cmath>
using namespace std;

class Solution {
public:
    bool isPowerOfFour(int n) {
        if (n <= 0) return false;
        double exp = log(n) / log(4);
        return fabs(exp - round(exp)) < 1e-10;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isPowerOfFour(int n) {
        if (n <= 0) return false;
        double exp = Math.log(n) / Math.log(4);
        return Math.abs(exp - Math.round(exp)) < 1e-10;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfFour = function(n) {
    if (n <= 0) return false;
    const exp = Math.log(n) / Math.log(4);
    return Math.abs(exp - Math.round(exp)) < 1e-10;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) — constant time math operations |
| **Space** | O(1) — no extra space |

---

## Approach 3: Loop (Iterative)

### Algorithm Steps

1. Start with n = 1
2. While n < given number, multiply by 4
3. Return true if we reach the number

### Why It Works

Simple iterative multiplication. Not the most efficient but straightforward.

### Code Implementation

````carousel
```python
class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        if n <= 0:
            return False
        while n % 4 == 0:
            n //= 4
        return n == 1
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isPowerOfFour(int n) {
        if (n <= 0) return false;
        while (n % 4 == 0) {
            n /= 4;
        }
        return n == 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isPowerOfFour(int n) {
        if (n <= 0) return false;
        while (n % 4 == 0) {
            n /= 4;
        }
        return n == 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfFour = function(n) {
    if (n <= 0) return false;
    while (n % 4 === 0) {
        n /= 4;
    }
    return n === 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log₄ n) — number of divisions by 4 |
| **Space** | O(1) — no extra space |

---

## Comparison of Approaches

| Aspect | Bit Manipulation | Logarithmic | Loop |
|--------|------------------|-------------|------|
| **Time Complexity** | O(1) | O(1) | O(log n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Simple | Simple | Simple |
| **Follow up (No Loop)** | ✅ | ✅ | ❌ |

**Best Approach:** Use Approach 1 (Bit Manipulation) as it's the most elegant and meets the follow-up requirement of no loops/recursion.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Microsoft, Google, Apple
- **Difficulty**: Easy
- **Concepts Tested**: Bit manipulation, number theory

### Learning Outcomes

1. **Bit Manipulation Mastery**: Learn powerful bit tricks
2. **Number Properties**: Understand binary representations
3. **Problem Solving**: Multiple approaches to same problem

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Power of Two | [Link](https://leetcode.com/problems/power-of-two/) | Similar bit manipulation |
| Power of Three | [Link](https://leetcode.com/problems/power-of-three/) | Similar concept |
| Power of Four | [Link](https://leetcode.com/problems/power-of-four/) | This problem |

### Pattern Reference

For more detailed explanations, see:
- **[Bitwise Operations - Power of Two/Four Check](/patterns/bitwise-operations-power-of-two-four-check)**

---

## Video Tutorial Links

1. **[NeetCode - Power of Four](https://www.youtube.com/watch?v=6C5XX8C3j7M)** - Clear explanation
2. **[Bit Manipulation Tricks](https://www.youtube.com/watch?v=6p6Eoa10jqU)** - Understanding bit operations

---

## Follow-up Questions

### Q1: How would you solve this without loops or recursion?

**Answer:** Use the bit manipulation approach: `n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0`. This uses only constant-time operations.

---

### Q2: How does this differ from checking power of two?

**Answer:** Power of two only requires `(n & (n - 1)) == 0`. Power of four adds the condition that the set bit must be at an even position: `(n & 0xAAAAAAAA) == 0`.

---

### Q3: Why is 0xAAAAAAAA used? What does it represent?

**Answer:** 0xAAAAAAAA in binary is 101010101010... (alternating 1s and 0s). The 1s are at odd positions (1, 3, 5, ...). By ANDing with this and checking if result is 0, we ensure no bit is set at an odd position.

---

### Q4: Can you solve this using recursion?

**Answer:** Yes, but it's not recommended:
```python
def isPowerOfFour(n):
    if n <= 0: return False
    if n == 1: return True
    if n % 4 != 0: return False
    return isPowerOfFour(n // 4)
```
This doesn't meet the follow-up requirement.

---

### Q5: How would you extend this to check power of any number?

**Answer:** For any base k, you can use:
- Bit method if k is a power of 2: Check if exponent is divisible
- General: Use logarithm or iterative approach

---

## Common Pitfalls

### 1. Negative Numbers
**Issue**: Must check n > 0 first - negative numbers can't be powers of 4.

**Solution**: Add `n > 0` check at the beginning.

### 2. Zero and One
**Issue**: 0 is not power of 4, 1 is (4^0 = 1).

**Solution**: The bit manipulation handles this: 0 fails (n > 0), 1 passes.

### 3. Mask Value
**Issue**: Using wrong hex mask.

**Solution**: Use 0xAAAAAAAA which has 1s at odd bit positions (ensures set bit is at even position).

### 4. Integer Overflow
**Issue**: For large numbers in other languages.

**Solution**: Python handles big integers natively. In C++/Java, ensure using appropriate integer type.

---

## Summary

The **Power of Four** problem demonstrates the power of bit manipulation:

- **Single Bit Check**: `(n & (n - 1)) == 0` checks if n is a power of two
- **Position Check**: `(n & 0xAAAAAAAA) == 0` ensures the bit is at even position
- **O(1) Solution**: Bit manipulation provides constant time solution

Key takeaways:
1. Powers of 4 have exactly one bit set at an even position
2. Bit manipulation allows O(1) solution without loops
3. The mask 0xAAAAAAAA is key to checking even positions

This problem is excellent for learning bit manipulation tricks that are useful in many coding problems.

### Pattern Summary

This problem exemplifies the **Bit Manipulation** pattern, characterized by:
- Using bitwise operations for number properties
- Constant time complexity
- Multiple conditions combined with AND

For more details, see **[Bitwise Operations Pattern](/patterns/bitwise-operations-power-of-two-four-check)**.

---

## Additional Resources

- [LeetCode 342 - Power of Four](https://leetcode.com/problems/power-of-four/) - Official problem page
- [Bit Manipulation - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-in-java-c-php/) - Bit operation basics
- [Pattern: Bitwise Operations](/patterns/bitwise-operations-power-of-two-four-check) - Comprehensive pattern guide
