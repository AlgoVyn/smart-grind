# Bitwise - Power of Two/Four Check

## Problem Description

The Bitwise Power of Two/Four Check pattern uses efficient bit manipulation to determine if a given integer is a power of two or power of four. By leveraging the fact that powers of two have exactly one set bit in their binary representation, this approach provides constant-time checks without using loops or logarithms.

This pattern is fundamental for problems involving binary properties, optimizing divisions, and detecting specific numerical patterns.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(1) - Constant time bitwise operations |
| Space Complexity | O(1) - No extra space needed |
| Input | Integer n |
| Output | Boolean indicating if n is power of 2 or 4 |
| Approach | Bitwise AND operations to check bit patterns |

### When to Use

- Checking if a number is a power of 2 (e.g., array sizes, memory allocation)
- Checking if a number is a power of 4 (special cases in algorithms)
- Validating inputs that must be powers of 2
- Optimizing division/multiplication operations
- Problems involving binary representations

## Intuition

The key insight is understanding the binary representation of powers of 2 and 4.

The "aha!" moments:
1. **Single Set Bit**: Powers of 2 have exactly one bit set to 1 in binary (e.g., 8 = 1000)
2. **n & (n-1) Trick**: This operation clears the lowest set bit; if result is 0, n was a power of 2
3. **Positive Check**: Must also verify n > 0 (0 is not a power of 2)
4. **Power of 4 Additional Check**: Must have single set bit in an even position (0, 2, 4, ...)
5. **Masking**: Use 0x55555555 (binary 0101...) to check if bit is in even position

## Solution Approaches

### Approach 1: Power of Two Check (Optimal) ✅ Recommended

#### Algorithm
1. Check if n > 0 (positive check)
2. Check if `n & (n - 1) == 0` (single set bit check)
3. Return true only if both conditions are satisfied

#### Implementation

````carousel
```python
def is_power_of_two(n: int) -> bool:
    """
    Check if n is a power of 2 using bitwise operations.
    LeetCode 231 - Power of Two
    
    Time: O(1), Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0
```
<!-- slide -->
```cpp
class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    return n > 0 && (n & (n - 1)) === 0;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(1) - Constant time bitwise operations |
| Space | O(1) - No extra space |

### Approach 2: Power of Four Check

#### Algorithm
1. Check if n > 0 (positive check)
2. Check if `n & (n - 1) == 0` (single set bit check - power of 2)
3. Check if `n & 0xAAAAAAAA == 0` (bit is in even position)
4. Return true only if all conditions are satisfied

#### Implementation

````carousel
```python
def is_power_of_four(n: int) -> bool:
    """
    Check if n is a power of 4 using bitwise operations.
    LeetCode 342 - Power of Four
    
    Time: O(1), Space: O(1)
    """
    # n must be positive
    # n must be power of 2 (single bit set)
    # The set bit must be in an even position (0, 2, 4, ...)
    # 0xAAAAAAAA = 10101010101010101010101010101010 in binary
    return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0
```
<!-- slide -->
```cpp
class Solution {
public:
    bool isPowerOfFour(int n) {
        // 0xAAAAAAAA = 10101010101010101010101010101010 in binary
        // This mask has 1s in all odd positions
        // Power of 4 must have bit in even position
        return n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isPowerOfFour(int n) {
        // 0xAAAAAAAA = 10101010101010101010101010101010 in binary
        // This mask has 1s in all odd positions
        // Power of 4 must have bit in even position
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
    // 0xAAAAAAAA = 10101010101010101010101010101010 in binary
    // This mask has 1s in all odd positions
    // Power of 4 must have bit in even position
    return n > 0 && (n & (n - 1)) === 0 && (n & 0xAAAAAAAA) === 0;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(1) - Constant time bitwise operations |
| Space | O(1) - No extra space |

### Approach 3: Alternative Power of Four Check (Modulo)

Another way to check for power of 4 is using the property that powers of 4 modulo 3 equal 1.

#### Algorithm
1. Check if n > 0 and `n & (n - 1) == 0` (power of 2 check)
2. Check if `n % 3 == 1` (power of 4 property)
3. Return true if both conditions satisfied

#### Implementation

````carousel
```python
def is_power_of_four_modulo(n: int) -> bool:
    """
    Check if n is a power of 4 using modulo property.
    Powers of 4 modulo 3 always equal 1.
    
    Time: O(1), Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0 and (n % 3 == 1)
```
<!-- slide -->
```cpp
class Solution {
public:
    bool isPowerOfFour(int n) {
        // Powers of 4 modulo 3 always equal 1
        return n > 0 && (n & (n - 1)) == 0 && (n % 3 == 1);
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isPowerOfFour(int n) {
        // Powers of 4 modulo 3 always equal 1
        return n > 0 && (n & (n - 1)) == 0 && (n % 3 == 1);
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
    // Powers of 4 modulo 3 always equal 1
    return n > 0 && (n & (n - 1)) === 0 && (n % 3 === 1);
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(1) - Constant time operations |
| Space | O(1) - No extra space |

### Approach 4: Iterative Division Approach

For educational purposes, the iterative approach demonstrates the mathematical property.

#### Algorithm
1. If n <= 0, return false
2. While n is divisible by 2 (or 4), divide it
3. Return true if final result is 1

#### Implementation

````carousel
```python
def is_power_of_two_iterative(n: int) -> bool:
    """
    Check if n is a power of 2 using iterative division.
    Educational approach, not optimal.
    
    Time: O(log n), Space: O(1)
    """
    if n <= 0:
        return False
    
    while n % 2 == 0:
        n //= 2
    
    return n == 1


def is_power_of_four_iterative(n: int) -> bool:
    """
    Check if n is a power of 4 using iterative division.
    Educational approach, not optimal.
    
    Time: O(log n), Space: O(1)
    """
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
    bool isPowerOfTwo(int n) {
        if (n <= 0) return false;
        
        while (n % 2 == 0) {
            n /= 2;
        }
        
        return n == 1;
    }
    
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
    public boolean isPowerOfTwo(int n) {
        if (n <= 0) return false;
        
        while (n % 2 == 0) {
            n /= 2;
        }
        
        return n == 1;
    }
    
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
var isPowerOfTwo = function(n) {
    if (n <= 0) return false;
    
    while (n % 2 === 0) {
        n /= 2;
    }
    
    return n === 1;
};

var isPowerOfFour = function(n) {
    if (n <= 0) return false;
    
    while (n % 4 === 0) {
        n /= 4;
    }
    
    return n === 1;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - Iterative division |
| Space | O(1) - No extra space |

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Bitwise (Power of 2)** | O(1) | O(1) | **Recommended** - Fastest approach |
| **Bitwise (Power of 4)** | O(1) | O(1) | **Recommended** - Mask or modulo |
| **Iterative Division** | O(log n) | O(1) | Educational, not optimal |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Power of Two](https://leetcode.com/problems/power-of-two/) | 231 | Easy | Check if number is power of 2 |
| [Power of Four](https://leetcode.com/problems/power-of-four/) | 342 | Easy | Check if number is power of 4 |
| [Power of Three](https://leetcode.com/problems/power-of-three/) | 326 | Easy | Check if number is power of 3 |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | 191 | Easy | Count set bits |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Range bitwise AND |
| [Counting Bits](https://leetcode.com/problems/counting-bits/) | 338 | Easy | Count bits for 0 to n |
| [Divide Two Integers](https://leetcode.com/problems/divide-two-integers/) | 29 | Medium | Division without operators |

## Video Tutorial Links

1. **[Power of Two - NeetCode](https://www.youtube.com/watch?v=Up3ul8P4HNA)** - Clear explanation
2. **[Power of Four - Nick White](https://www.youtube.com/watch?v=8fI1q5gG8jQ)** - Step-by-step walkthrough
3. **[Bit Manipulation Tricks](https://www.youtube.com/watch?v=BKzB6gdRyIM)** - Comprehensive bit tricks
4. **[Power of Two/Three/Four](https://www.youtube.com/watch?v=4j1zJQkU6-I)** - Comparison of approaches

## Summary

### Key Takeaways
- **Power of 2**: `n > 0 && (n & (n - 1)) == 0`
- **Power of 4**: Must be power of 2 AND bit in even position
- **Bit Position Check**: Use mask `0xAAAAAAAA` to verify even positions
- **Alternative**: Powers of 4 satisfy `n % 3 == 1`
- **Constant Time**: All bitwise approaches run in O(1)

### Common Pitfalls
- **Zero check**: Must explicitly check `n > 0` (0 is not a power of 2)
- **Negative numbers**: Negative numbers can pass the bitwise check without n > 0
- **Integer overflow**: Not an issue for standard 32-bit integers
- **Misunderstanding masks**: `0xAAAAAAAA` masks odd positions (1, 3, 5, ...)

### Follow-up Questions
1. **How would you check if a number is a power of 3?**
   - Answer: `n > 0 && 1162261467 % n == 0` (3^19 is max power of 3 in int32)

2. **Can you find the highest power of 2 less than or equal to n?**
   - Answer: Use `1 << (31 - __builtin_clz(n))` or `n & -n` for lowest set bit

3. **How would you round up to the next power of 2?**
   - Answer: 
   ```python
   def next_power_of_2(n):
       if n <= 1: return 1
       return 1 << (n - 1).bit_length()
   ```

4. **What is the relationship between powers of 2 and binary representation?**
   - Answer: Powers of 2 have exactly one bit set to 1, at position equal to the exponent

## Pattern Source

[Power of Two/Four Check Pattern](patterns/bitwise-operations-power-of-two-four-check.md)
