# XOR Trick

## Category
Bit Manipulation

## Description

The XOR Trick leverages the unique mathematical properties of the XOR (exclusive or) bitwise operation to solve common programming problems elegantly and efficiently. It enables finding single unique elements, swapping values without temporary variables, detecting missing numbers, and more - all in O(n) time with O(1) space complexity.

This technique is fundamental in competitive programming and embedded systems where memory constraints are tight. The XOR operation's self-inverse property makes it particularly powerful for problems involving paired elements or memory-efficient computations.

---

## Concepts

The XOR Trick is built on several fundamental concepts from bit manipulation and discrete mathematics.

### 1. XOR Properties

The mathematical foundations that make XOR tricks possible:

| Property | Expression | Description |
|----------|------------|-------------|
| **Identity** | `a ^ 0 = a` | XOR with 0 returns the original value |
| **Self-inverse** | `a ^ a = 0` | XOR with itself returns 0 |
| **Commutative** | `a ^ b = b ^ a` | Order doesn't matter |
| **Associative** | `(a ^ b) ^ c = a ^ (b ^ c)` | Grouping doesn't matter |

### 2. Bitwise Operation Fundamentals

XOR operates at the bit level:

```
XOR Truth Table:
  0 ^ 0 = 0
  0 ^ 1 = 1
  1 ^ 0 = 1
  1 ^ 1 = 0

Example: 5 ^ 3
  5 = 101 (binary)
  3 = 011 (binary)
  ------ XOR
  6 = 110 (binary)
```

### 3. Pair Cancellation Pattern

The key insight for finding unique elements:

```
When all elements appear twice except one:
  result = 0
  for each element:
      result ^= element
  # Pairs cancel (a ^ a = 0), leaving unique element
```

### 4. Bit Masking Techniques

Finding and isolating specific bits:

| Technique | Expression | Result |
|-----------|------------|--------|
| **Rightmost set bit** | `x & (-x)` | Isolates rightmost 1-bit |
| **Toggle bit** | `x ^ (1 << n)` | Flips nth bit |
| **Check bit** | `x & (1 << n)` | Non-zero if nth bit is 1 |
| **Clear bit** | `x & ~(1 << n)` | Sets nth bit to 0 |

---

## Frameworks

Structured approaches for applying the XOR trick.

### Framework 1: Find Single Unique Element

```
┌─────────────────────────────────────────────────────┐
│  FIND SINGLE UNIQUE FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Problem: All elements appear twice except one     │
│                                                     │
│  Initialize:                                        │
│      result = 0   (XOR identity)                     │
│                                                     │
│  Process:                                           │
│      For each element in array:                    │
│          result ^= element                           │
│                                                     │
│  Return:                                            │
│      result   (the unique element)                 │
│                                                     │
│  Why it works:                                     │
│  - Pairs cancel: a ^ a = 0                          │
│  - Unique remains: 0 ^ x = x                        │
│                                                     │
│  Complexity: O(n) time, O(1) space                 │
└─────────────────────────────────────────────────────┘
```

### Framework 2: Find Two Unique Elements

```
┌─────────────────────────────────────────────────────┐
│  FIND TWO UNIQUE ELEMENTS FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Problem: All elements appear twice, two appear once│
│                                                     │
│  Step 1: XOR all elements                            │
│      xor_all = a ^ b  (a and b are the unique pair) │
│                                                     │
│  Step 2: Find differentiating bit                    │
│      # xor_all has bits set where a and b differ    │
│      rightmost_bit = xor_all & (-xor_all)            │
│                                                     │
│  Step 3: Partition and XOR separately              │
│      group1 = XOR of elements with bit set           │
│      group2 = XOR of elements without bit set       │
│                                                     │
│  Return:                                            │
│      [group1, group2]   (the two unique elements)   │
│                                                     │
│  Complexity: O(n) time, O(1) space                 │
└─────────────────────────────────────────────────────┘
```

### Framework 3: Find Missing Number in Sequence

```
┌─────────────────────────────────────────────────────┐
│  FIND MISSING NUMBER FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Problem: Array contains n numbers from [0, n]      │
│           with one missing. Find the missing.      │
│                                                     │
│  Initialize:                                        │
│      result = n   (XOR with the extra number)       │
│                                                     │
│  Process:                                           │
│      For i from 0 to n-1:                          │
│          result ^= i ^ arr[i]                       │
│                                                     │
│  Return:                                            │
│      result   (the missing number)                 │
│                                                     │
│  Why it works:                                     │
│  - All present numbers: i ^ arr[i] = i ^ i = 0      │
│  - Missing number: result = n ^ missing ^ n = missing│
│                                                     │
│  Complexity: O(n) time, O(1) space                 │
└─────────────────────────────────────────────────────┘
```

### Framework 4: XOR Swap Algorithm

```
┌─────────────────────────────────────────────────────┐
│  XOR SWAP FRAMEWORK                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Caution: Only works when a and b are DIFFERENT   │
│           memory locations!                          │
│                                                     │
│  Given: a = A, b = B                               │
│                                                     │
│  Step 1: a = a ^ b                                  │
│      a = A ^ B,  b = B                              │
│                                                     │
│  Step 2: b = a ^ b                                  │
│      b = (A ^ B) ^ B = A                            │
│      a = A ^ B                                      │
│                                                     │
│  Step 3: a = a ^ b                                  │
│      a = (A ^ B) ^ A = B                            │
│      b = A                                          │
│                                                     │
│  Result: a = B, b = A   ✓ Swapped!                │
│                                                     │
│  Complexity: O(1) time, O(1) space                 │
└─────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the XOR trick pattern.

### Form 1: Single Unique Element

All elements appear twice except one.

| Input Pattern | Algorithm | Result |
|---------------|-----------|--------|
| `[4, 1, 2, 1, 2]` | XOR all | `4` |
| `[2, 2, 1]` | XOR all | `1` |
| `[1, 3, 1, 3, 5]` | XOR all | `5` |

### Form 2: Two Unique Elements

Exactly two elements appear once, rest appear twice.

| Input Pattern | Algorithm | Result |
|---------------|-----------|--------|
| `[1, 2, 1, 3, 2, 5]` | Partition by bit, XOR each | `[3, 5]` |
| `[4, 4, 2, 3]` | Partition by bit, XOR each | `[2, 3]` |

### Form 3: Missing Number in Sequence

Find missing number from [0, n] range.

| Input | Range | Missing |
|-------|-------|---------|
| `[3, 0, 1]` | [0, 3] | `2` |
| `[0, 1, 2, 4]` | [0, 4] | `3` |
| `[1, 2]` | [0, 2] | `0` |

### Form 4: Appearing Three Times (Bit Counting)

Every element appears three times except one.

```
Approach: Count set bits at each position modulo 3
- If bit appears 3k+1 times, it's set in unique element
- Requires O(32n) time for 32-bit integers
- Still O(1) space
```

---

## Tactics

Specific techniques and optimizations for XOR tricks.

### Tactic 1: Rightmost Set Bit Isolation

Find the bit that differentiates two numbers:

```python
def find_rightmost_set_bit(x):
    """
    Isolate rightmost set bit using two's complement.
    
    Example: x = 6 (110), -x = ...11111010
             x & -x = 010 = 2
    """
    return x & (-x)

# Usage in finding two unique elements:
xor_all = a ^ b  # Where a and b are unique elements
diff_bit = xor_all & (-xor_all)  # Any set bit in xor_all

# Partition based on this bit
for num in nums:
    if num & diff_bit:
        group1 ^= num  # Has the bit set
    else:
        group2 ^= num  # Doesn't have the bit
```

**Why it works**: `x & (-x)` isolates the rightmost 1-bit due to two's complement representation.

### Tactic 2: Bit Counting for "Appears Three Times"

When elements appear three times instead of twice:

```python
def find_single_number_ii(nums):
    """Find element appearing once while others appear three times."""
    result = 0
    
    for i in range(32):  # For 32-bit integers
        bit_sum = 0
        mask = 1 << i
        
        # Count how many numbers have this bit set
        for num in nums:
            if num & mask:
                bit_sum += 1
        
        # If count is not multiple of 3, this bit is in unique element
        if bit_sum % 3:
            result |= mask
    
    # Handle negative numbers in Python
    if result >= 2**31:
        result -= 2**32
    
    return result
```

**Key insight**: Bits that appear 3k+1 times belong to the unique element.

### Tactic 3: XOR for Character Toggle

Toggle between uppercase and lowercase:

```python
def toggle_case(char):
    """Toggle case using XOR with 32 (0b100000)."""
    # ASCII: 'A' = 65 (0b1000001), 'a' = 97 (0b1100001)
    # Difference is 32 (0b100000)
    return chr(ord(char) ^ 32)

# Examples:
# toggle_case('A') -> 'a'
# toggle_case('a') -> 'A'
```

### Tactic 4: XOR Cipher (Simple Encryption)

Basic encryption using XOR with a key:

```python
def xor_cipher(text, key):
    """
    Simple XOR cipher for encryption/decryption.
    XORing twice with same key returns original.
    
    Time: O(n) where n = len(text)
    Space: O(n) for result
    """
    result = []
    key_len = len(key)
    for i, char in enumerate(text):
        result.append(chr(ord(char) ^ ord(key[i % key_len])))
    return ''.join(result)

# Usage:
# encrypted = xor_cipher("Hello", "key")
# decrypted = xor_cipher(encrypted, "key")  # Returns "Hello"
```

### Tactic 5: In-Place Array Duplicate Removal

Mark visited elements using index as bit storage:

```python
def find_duplicate_xor_approach(nums):
    """
    Find duplicate using XOR (for specific constraints).
    When array contains elements in range [1, n] with one duplicate.
    """
    n = len(nums) - 1  # Expected max value
    
    # XOR all array elements
    xor_arr = 0
    for num in nums:
        xor_arr ^= num
    
    # XOR all expected values 1 to n
    xor_expected = 0
    for i in range(1, n + 1):
        xor_expected ^= i
    
    # Duplicate = xor_arr ^ xor_expected
    return xor_arr ^ xor_expected
```

---

## Python Templates

### Template 1: Find Single Unique Element

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
```

### Template 2: Find Two Unique Elements

```python
def find_two_unique(nums):
    """
    Find two unique elements when all others appear twice.
    Uses bit masking to partition elements.
    
    Args:
        nums: List where exactly two elements appear once, rest appear twice
    
    Returns:
        List containing the two unique elements
    """
    # Step 1: XOR all numbers - gives a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Step 2: Find rightmost set bit (difference between a and b)
    rightmost_bit = xor_all & (-xor_all)
    
    # Step 3: Partition into two groups and XOR separately
    x, y = 0, 0
    for num in nums:
        if num & rightmost_bit:
            x ^= num
        else:
            y ^= num
    
    return [x, y]
```

### Template 3: Find Missing Number in Sequence

```python
def find_missing_number(nums):
    """
    Find missing number in range [0, n] where n = len(nums).
    XOR all indices and values.
    
    Args:
        nums: Array containing n distinct numbers from [0, n] with one missing
    
    Returns:
        The missing number
    """
    n = len(nums)
    result = n  # XOR with n (the extra number)
    
    for i, num in enumerate(nums):
        result ^= i ^ num
    
    return result
```

### Template 4: Find Element Appearing Once (Others Three Times)

```python
def find_unique_three(nums):
    """
    Find element appearing once while others appear three times.
    Uses bit counting approach.
    
    Args:
        nums: List where every element appears three times except one
    
    Returns:
        The unique element
    """
    result = 0
    
    for i in range(32):  # For 32-bit integers
        bit_sum = 0
        mask = 1 << i
        
        for num in nums:
            if num & mask:
                bit_sum += 1
        
        # If count of 1s is not multiple of 3, this bit is set in answer
        if bit_sum % 3:
            result |= mask
    
    # Handle negative numbers in Python
    if result >= 2**31:
        result -= 2**32
    
    return result
```

### Template 5: XOR Swap Function

```python
def xor_swap(a, b):
    """
    Swap two integers using XOR (without temporary variable).
    
    IMPORTANT: Only works when a and b are different memory locations!
    Do NOT use: xor_swap(arr[i], arr[i]) - will zero out the value!
    
    Args:
        a: First integer (passed by value in Python)
        b: Second integer (passed by value in Python)
    
    Returns:
        Tuple of swapped values (b, a)
    
    Time: O(1)
    Space: O(1)
    """
    a = a ^ b
    b = a ^ b  # b = (a^b) ^ b = a
    a = a ^ b  # a = (a^b) ^ a = b
    return a, b


def xor_swap_array(arr, i, j):
    """
    Swap two array elements in place using XOR.
    Safe for arrays since we pass indices.
    
    Args:
        arr: List of integers
        i: First index
        j: Second index
    """
    if i != j:  # Must be different indices!
        arr[i] ^= arr[j]
        arr[j] ^= arr[i]
        arr[i] ^= arr[j]
```

---

## When to Use

Use the XOR Trick when you need to solve problems involving:

- **Finding Unique Elements**: When all elements appear twice except one (or an odd number of times)
- **Value Swapping**: Swap two variables without using extra space
- **Missing Number Detection**: Find the missing number in a sequence [0, n]
- **Bit Manipulation**: Toggle bits, check parity, or perform bitwise operations
- **Memory-Efficient Operations**: When O(1) space is required

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **XOR Trick** | O(n) | O(1) | Single unique element, swapping |
| **Hash Set** | O(n) | O(n) | Multiple unique elements, counting |
| **Sorting** | O(n log n) | O(1) or O(n) | When order matters |
| **Bit Masking** | O(n) | O(1) | Multiple frequencies (3x, etc.) |
| **Math (Sum)** | O(n) | O(1) | Missing number with known formula |

### When to Choose XOR Trick vs Hash Set

- **Choose XOR Trick** when:
  - Only ONE element appears an odd number of times
  - Space must be O(1)
  - You need to swap without temp variable
  - Working with bit-level operations

- **Choose Hash Set** when:
  - Multiple elements appear odd number of times
  - You need to return all unique elements
  - Space is not a constraint
  - Need to track frequencies

---

## Algorithm Explanation

### Core Concept

The key insight behind the XOR Trick is that XORing a number with itself cancels it out (returns 0), and XORing with 0 preserves the value. This property allows us to find unique elements among pairs without additional storage.

### How It Works

#### Finding a Unique Element:

When all elements appear twice except one:
```
Given: [4, 1, 2, 1, 2]
XOR all: 4 ^ 1 ^ 2 ^ 1 ^ 2

Using commutative/associative properties:
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4 ✓
```

Pairs cancel out (a ^ a = 0), leaving only the unique element.

#### Swapping Without Temp Variable:

```
Initial: a = 5, b = 10

Step 1: a = a ^ b  →  a = 5 ^ 10,  b = 10
Step 2: b = a ^ b  →  b = (5^10) ^ 10 = 5,  a = 5^10
Step 3: a = a ^ b  →  a = (5^10) ^ 5 = 10,  b = 5

Result: a = 10, b = 5 ✓
```

#### Finding Missing Number:

For array `[3, 0, 1]` in range [0, 3]:
```
XOR indices: 0 ^ 1 ^ 2 ^ 3 = 0
XOR values:  3 ^ 0 ^ 1 = 2
Final: 0 ^ 2 = 2 ✓
```

### Visual Representation

For array `[4, 1, 2, 1, 2]` finding unique element:

```
Initial: result = 0

Step 1: result = 0 ^ 4 = 4
Step 2: result = 4 ^ 1 = 5
Step 3: result = 5 ^ 2 = 7
Step 4: result = 7 ^ 1 = 6  (1 cancels out!)
Step 5: result = 6 ^ 2 = 4  (2 cancels out!)

Final: 4 ✓
```

### Why It Works

- **Self-inverse Property**: `a ^ a = 0` eliminates paired elements
- **Identity Property**: `a ^ 0 = a` preserves the unique element
- **Commutativity/Associativity**: Order doesn't matter, enabling simple linear scan
- **Bitwise Parallelism**: All 32 bits processed simultaneously

### Limitations

- **Only works for ONE unique element**: When all others appear even number of times
- **Integer data only**: Works with numbers, not arbitrary objects
- **Two unique elements**: Requires additional grouping logic
- **Not for counting**: Can't determine how many times elements appear
- **Three times frequency**: Requires bit counting instead of simple XOR

---

## Practice Problems

### Problem 1: Single Number

**Problem:** [LeetCode 136 - Single Number](https://leetcode.com/problems/single-number/)

**Description:** Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.

**How to Apply XOR Trick:**
- XOR all elements together
- Pairs cancel out (a ^ a = 0)
- Result is the unique element
- Time: O(n), Space: O(1)

---

### Problem 2: Single Number II

**Problem:** [LeetCode 137 - Single Number II](https://leetcode.com/problems/single-number-ii/)

**Description:** Given an integer array `nums` where every element appears three times except for one, which appears exactly once. Find the single element.

**How to Apply XOR Trick:**
- Count set bits at each position across all numbers
- Bits that appear 3k+1 times belong to the unique number
- Reconstruct the answer from bit counts
- Time: O(32n) = O(n), Space: O(1)

---

### Problem 3: Missing Number

**Problem:** [LeetCode 268 - Missing Number](https://leetcode.com/problems/missing-number/)

**Description:** Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

**How to Apply XOR Trick:**
- XOR all indices (0 to n) with all values in array
- All present numbers cancel out
- Result is the missing number
- Time: O(n), Space: O(1)

---

### Problem 4: Single Number III

**Problem:** [LeetCode 260 - Single Number III](https://leetcode.com/problems/single-number-iii/)

**Description:** Given an integer array `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once.

**How to Apply XOR Trick:**
- XOR all to get a ^ b
- Find rightmost set bit to partition
- XOR each group separately
- Returns the two unique elements
- Time: O(n), Space: O(1)

---

### Problem 5: Flipping an Image

**Problem:** [LeetCode 832 - Flipping an Image](https://leetcode.com/problems/flipping-an-image/)

**Description:** Given an `n x n` binary matrix `image`, flip the image horizontally, then invert it.

**How to Apply XOR Trick:**
- Use XOR 1 to invert bits (0^1=1, 1^1=0)
- Efficient bit manipulation for binary matrices
- Combine with two-pointer swap
- Time: O(n²), Space: O(1)

---

## Video Tutorial Links

### Fundamentals

- [XOR Trick - Single Number (NeetCode)](https://www.youtube.com/watch?v=sGQJqHyt-hg) - Clear explanation of XOR properties
- [Bit Manipulation Tutorial (Take U Forward)](https://www.youtube.com/watch?v=5rtVTYAk9KQ) - Comprehensive bit manipulation concepts
- [XOR Swap Algorithm (Computerphile)](https://www.youtube.com/watch?v=7SGOYURWqJ8) - Mathematical proof of XOR swap

### Advanced Topics

- [Single Number II - Bit Counting](https://www.youtube.com/watch?v=5mLrTfhorwY) - Handling 3x frequency
- [Missing Number using XOR](https://www.youtube.com/watch?v=5HgW5qK8aB8) - Alternative to math approach
- [Bitwise Operators in Python](https://www.youtube.com/watch?v=5mLrTfhorwY) - Language-specific techniques

---

## Follow-up Questions

### Q1: Why does XOR swap work, and when should I avoid it?

**Answer:** XOR swap works because:
- Step 1: `a = a ^ b` stores combined information
- Step 2: `b = (a ^ b) ^ b = a` extracts original `a`
- Step 3: `a = (a ^ b) ^ a = b` extracts original `b`

**Avoid when:**
- `a` and `b` point to the same memory location (results in 0)
- Code readability is more important than micro-optimization
- Working with non-integer types

### Q2: Can XOR trick find the unique element if it appears 3 times instead of 1?

**Answer:** No, basic XOR trick doesn't work for 3x frequency because:
- XORing a number 3 times: `a ^ a ^ a = a` (not 0)
- The unique element would still appear in result
- For 3x frequency, use **bit counting approach** (count set bits at each position modulo 3)

### Q3: Why is XOR preferred over using a Hash Set for finding unique elements?

**Answer:** XOR is preferred when:
- **Space is constrained**: O(1) vs O(n) space
- **Only one unique element**: Simple and elegant solution
- **Bit manipulation allowed**: Works only for integers

Hash Set is better when:
- **Multiple unique elements** need to be found
- **Non-integer data** types
- **Need counts** or additional information

### Q4: Can XOR trick work with negative numbers?

**Answer:** Yes, XOR works with negative numbers in two's complement representation:
- Negative numbers have their sign bit set
- XOR operations work on all bits including sign bit
- In Python, need to handle arbitrary precision (may need to mask to 32 bits)

### Q5: How does XOR compare to the mathematical approach for finding missing number?

**Answer:** 

| Aspect | XOR Approach | Math Approach (Sum) |
|--------|-------------|---------------------|
| **Formula** | XOR all indices and values | `expected_sum - actual_sum` |
| **Overflow risk** | No (XOR doesn't overflow) | Yes (for large n) |
| **Intuition** | Bit manipulation | Arithmetic |
| **Space** | O(1) | O(1) |
| **Time** | O(n) | O(n) |

**Recommendation:** Use XOR when overflow is a concern; use sum for clearer code.

---

## Summary

The XOR Trick is a powerful technique leveraging the mathematical properties of the XOR operation to solve common programming problems with optimal time and space complexity. Key takeaways:

- **O(n) time, O(1) space**: Optimal complexity for single unique element problems
- **Key properties**: Identity (a^0=a), Self-inverse (a^a=0), Commutative, Associative
- **Common use cases**: Finding unique elements, swapping without temp, missing numbers
- **Limitations**: Only works for ONE unique element when others appear even times

When to use:
- ✅ Finding single element appearing once (others twice)
- ✅ Swapping integers without extra space
- ✅ Finding missing number in sequence
- ✅ Bit-level manipulation and toggling
- ❌ Finding multiple unique elements
- ❌ Non-integer data types
- ❌ When elements appear odd frequencies other than 1

This technique is essential for competitive programming and technical interviews, providing elegant solutions to problems that might otherwise require additional space complexity.
