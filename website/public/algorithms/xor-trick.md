# XOR Trick

## Category
Bit Manipulation

## Description
Use XOR properties to find single number or swap values.

## Algorithm Explanation
XOR (exclusive or) is a powerful bitwise operation with several useful properties that enable elegant solutions to common programming problems. Understanding these properties is key to solving many interview problems efficiently.

**Key XOR Properties:**
1. **Identity**: `a ^ 0 = a` - XOR with 0 returns the same number
2. **Self-inverse**: `a ^ a = 0` - XOR with itself returns 0
3. **Commutative**: `a ^ b = b ^ a`
4. **Associative**: `(a ^ b) ^ c = a ^ (b ^ c)`

**Common Applications:**
1. **Find unique element**: If all elements appear twice except one, XOR all elements - duplicates cancel out
2. **Swap values without temp**: `a ^= b; b ^= a; a ^= b`
3. **Find missing number**: XOR all indices and values
4. **Toggle bits**: XOR with mask to toggle specific bits

**Why it works for finding unique element:**
- When a number appears twice, `a ^ a = 0`
- XOR is associative, so order doesn't matter
- `a ^ a ^ b ^ b ^ c = 0 ^ 0 ^ c = c`
- The unique element remains

**Important:** XOR only works for finding ONE unique element appearing odd number of times when all others appear an even number of times.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- bit manipulation related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
def find_unique(nums):
    """
    Find the single element that appears once while others appear twice.
    
    Args:
        nums: List where every element appears twice except one
    
    Returns:
        The unique element
    
    Time: O(n)
    Space: O(1)
    """
    result = 0
    for num in nums:
        result ^= num
    return result


def swap_values(a, b):
    """
    Swap two values without temporary variable using XOR.
    
    Note: Only works when a and b are different memory locations.
    """
    a ^= b
    b ^= a
    a ^= b
    return a, b


def find_missing_number(nums):
    """
    Find missing number in range [0, n].
    XOR all indices and values.
    """
    n = len(nums)
    result = n  # XOR with n (the extra number)
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result


def find_two_unique(nums):
    """
    Find two unique elements when all others appear twice.
    More complex - requires grouping.
    """
    # Step 1: XOR all numbers - gives a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Step 2: Find rightmost set bit (difference bit)
    rightmost_bit = xor_all & (-xor_all)
    
    # Step 3: Partition into two groups and XOR separately
    x, y = 0, 0
    for num in nums:
        if num & rightmost_bit:
            x ^= num
        else:
            y ^= num
    
    return [x, y]


def count_set_bits(n):
    """Count number of 1 bits using XOR trick."""
    count = 0
    while n:
        n &= (n - 1)  # Clear lowest set bit
        count += 1
    return count


def find_unique_three(nums):
    """
    Find element appearing once while others appear three times.
    Uses bit counting approach.
    """
    result = 0
    for i in range(32):  # For 32-bit integers
        bit_sum = 0
        mask = 1 << i
        for num in nums:
            if num & mask:
                bit_sum += 1
        
        if bit_sum % 3:
            result |= mask
    
    return result
```

```javascript
function findUnique(nums) {
    let result = 0;
    for (const num of nums) {
        result ^= num;
    }
    return result;
}

function swapValues(a, b) {
    a ^= b;
    b ^= a;
    a ^= b;
    return [a, b];
}

function findMissingNumber(nums) {
    let n = nums.length;
    let result = n;
    for (let i = 0; i < n; i++) {
        result ^= i ^ nums[i];
    }
    return result;
}
```

---

## Example

**Input:**
```
nums = [2, 2, 1]
```

**Output:**
```
1
```

**Explanation:** 2 ^ 2 = 0, 0 ^ 1 = 1

**Input:**
```
nums = [4, 1, 2, 1, 2]
```

**Output:**
```
4
```

**Explanation:** 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4

**Input - Swap values:**
```
a = 5, b = 10
```

**Output:**
```
a = 10, b = 5
```

**Input - Missing number:**
```
nums = [3, 0, 1]
n = 2
```

**Output:**
```
2
```

**Explanation:** XOR: 2 ^ 0 ^ 3 ^ 0 ^ 1 ^ 1 = 2 ^ (0^0) ^ (3^1) = 2 ^ 0 ^ 2 = 2

**Input - Two unique elements:**
```
nums = [1, 2, 1, 3, 2, 5]
```

**Output:**
```
[3, 5]
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
