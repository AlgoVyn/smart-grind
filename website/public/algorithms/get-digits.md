# Get Digits

## Category
Number Manipulation & Digit DP

## Description

Digit manipulation is a fundamental technique in competitive programming and algorithmic problem-solving that involves extracting, analyzing, and manipulating individual digits of numbers. This pattern is essential for solving problems related to palindromes, digit sums, number reconstruction, and various number theory problems.

The ability to efficiently extract digits, compute digit sums, reverse numbers, and construct numbers from digits forms the foundation for more advanced techniques like Digit DP (dynamic programming on digits), which is used to solve counting problems with digit constraints. Understanding these basic operations is crucial for tackling problems involving large numbers and specific digit patterns.

---

## Concepts

Digit manipulation relies on several fundamental concepts from number theory and arithmetic.

### 1. Modulo and Division Operations

The core operations for digit extraction:

| Operation | Formula | Result |
|-----------|---------|--------|
| **Last digit** | `n % 10` | Units digit |
| **Remove last digit** | `n // 10` | Floor division by 10 |
| **Last k digits** | `n % (10**k)` | Rightmost k digits |
| **Remove last k digits** | `n // (10**k)` | Number without rightmost k digits |

### 2. Digit Properties

Common digit-related properties:

| Property | Check | Formula |
|----------|-------|---------|
| **Divisible by 3** | Sum of digits divisible by 3 | `sum(digits) % 3 == 0` |
| **Divisible by 9** | Sum of digits divisible by 9 | `sum(digits) % 9 == 0` |
| **Divisible by 11** | Alternating sum divisible by 11 | `(d0-d1+d2-d3+...) % 11 == 0` |
| **Digital root** | Recursive digit sum | `1 + (n - 1) % 9` (for n > 0) |

### 3. Number Reconstruction

Building numbers from digits:

```
result = 0
for each digit d:
    result = result × 10 + d
```

### 4. Digit DP Basics

Dynamic programming on digits for counting:

| Concept | Description |
|---------|-------------|
| **Tight constraint** | Current prefix equals target prefix |
| **Loose constraint** | Current prefix is less than target prefix |
| **State** | (position, tight, leading_zero, other_constraints) |

---

## Frameworks

Structured approaches for digit manipulation problems.

### Framework 1: Standard Digit Extraction

```
┌─────────────────────────────────────────────────────────────┐
│  DIGIT EXTRACTION FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────┤
│  Input: Integer n                                            │
│  Output: List of digits (MSB to LSB)                        │
│                                                             │
│  Method 1 - Iterative extraction:                           │
│   1. Handle n = 0 case                                       │
│   2. While n > 0:                                            │
│      - digits.append(n % 10)   # Get last digit             │
│      - n //= 10               # Remove last digit            │
│   3. Reverse digits list                                     │
│                                                             │
│  Method 2 - String conversion (simpler but slower):        │
│   1. Convert to string: s = str(n)                          │
│   2. Extract digits: [int(c) for c in s]                      │
│                                                             │
│  Time: O(log n) or O(number of digits)                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Basic digit extraction for small to medium numbers.

### Framework 2: Digit Sum and Digit Count

```
┌─────────────────────────────────────────────────────────────┐
│  DIGIT SUM/COUNT FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────┤
│  Sum of digits:                                              │
│   total = 0                                                  │
│   while n > 0:                                               │
│      total += n % 10                                         │
│      n //= 10                                                │
│                                                             │
│  Count of digits:                                             │
│   if n == 0: return 1                                        │
│   count = 0                                                  │
│   while n > 0:                                               │
│      count += 1                                              │
│      n //= 10                                                │
│   return count                                               │
│                                                             │
│  Alternative for count: floor(log10(n)) + 1                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Computing digit sums, number of digits, digit products.

### Framework 3: Number Reconstruction

```
┌─────────────────────────────────────────────────────────────┐
│  NUMBER RECONSTRUCTION FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Build number from array of digits:                          │
│                                                             │
│   result = 0                                                 │
│   for d in digits:                                           │
│      result = result * 10 + d                                │
│                                                             │
│  Reverse a number:                                          │
│   reversed = 0                                               │
│   while n > 0:                                               │
│      reversed = reversed * 10 + (n % 10)                   │
│      n //= 10                                                │
│                                                             │
│  Rotate digits:                                             │
│   - Convert to list                                          │
│   - Perform rotation                                         │
│   - Reconstruct number                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Palindrome check, number reversal, digit rearrangement.

---

## Forms

Different manifestations of digit manipulation patterns.

### Form 1: Basic Digit Operations

Fundamental digit extraction and manipulation.

| Operation | Code | Complexity |
|-----------|------|------------|
| **Get digits** | `while n: digits.append(n % 10); n //= 10` | O(log n) |
| **Digit sum** | `sum of n % 10` | O(log n) |
| **Digit count** | `floor(log10(n)) + 1` | O(1) |

### Form 2: Number Reconstruction

Building and transforming numbers.

```python
def number_from_digits(digits):
    """Build number from digit list."""
    result = 0
    for d in digits:
        result = result * 10 + d
    return result

def reverse_number(n):
    """Reverse digits of number."""
    rev = 0
    while n > 0:
        rev = rev * 10 + (n % 10)
        n //= 10
    return rev

def is_palindrome(n):
    """Check if number is palindrome."""
    return n == reverse_number(n)
```

### Form 3: Digital Root

Recursive digit sum until single digit.

```python
def digital_root(n):
    """Digital root: recursive sum until single digit."""
    if n == 0:
        return 0
    return 1 + (n - 1) % 9  # Mathematical formula

# Or iterative
def digital_root_iterative(n):
    while n >= 10:
        n = digit_sum(n)
    return n
```

### Form 4: Digit DP (Advanced)

Counting numbers with digit constraints.

```python
def digit_dp_count(n, constraint_fn):
    """
    Count numbers from 0 to n satisfying constraint.
    constraint_fn(digits) -> bool
    """
    digits = get_digits(n)
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(pos, tight, leading_zero):
        if pos == len(digits):
            return 0 if leading_zero else 1
        
        limit = digits[pos] if tight else 9
        count = 0
        
        for d in range(limit + 1):
            new_tight = tight and (d == limit)
            new_leading = leading_zero and (d == 0)
            
            count += dp(pos + 1, new_tight, new_leading)
        
        return count
    
    return dp(0, True, True)
```

### Form 5: Consecutive Digit Differences

Numbers with specific digit difference patterns.

```python
def nums_same_consecutive_diff(n, k):
    """
    Generate n-digit numbers where consecutive digits differ by k.
    """
    result = []
    
    def dfs(current_num, remaining):
        if remaining == 0:
            result.append(current_num)
            return
        
        last_digit = current_num % 10
        
        # Add digit last_digit + k
        if last_digit + k <= 9:
            dfs(current_num * 10 + (last_digit + k), remaining - 1)
        
        # Add digit last_digit - k (if different)
        if k != 0 and last_digit - k >= 0:
            dfs(current_num * 10 + (last_digit - k), remaining - 1)
    
    for start in range(1, 10):
        dfs(start, n - 1)
    
    return result
```

---

## Tactics

Specific techniques and optimizations for digit problems.

### Tactic 1: Efficient Digit Sum

Iterative vs mathematical approach:

```python
def digit_sum_iterative(n):
    """O(log n) digit sum."""
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

def digit_sum_formula(n):
    """Mathematical properties."""
    # For checking divisibility by 9
    # n % 9 gives equivalent of digit_sum(n) % 9
    # Except when n % 9 == 0 and n > 0, result is 9
    if n == 0:
        return 0
    remainder = n % 9
    return 9 if remainder == 0 else remainder
```

### Tactic 2: Palindrome Generation

Generate palindromes efficiently:

```python
def generate_palindromes(limit):
    """Generate all palindromes up to limit."""
    palindromes = []
    
    # Odd length palindromes
    for i in range(1, 100000):
        s = str(i)
        pal = int(s + s[-2::-1])  # Mirror excluding last digit
        if pal <= limit:
            palindromes.append(pal)
    
    # Even length palindromes
    for i in range(1, 100000):
        s = str(i)
        pal = int(s + s[::-1])  # Full mirror
        if pal <= limit:
            palindromes.append(pal)
    
    return sorted(palindromes)
```

### Tactic 3: Maximum Swap

Find maximum number by swapping one pair of digits:

```python
def maximum_swap(n):
    """
    LeetCode 670: Maximum Swap.
    Find maximum number by swapping one pair of digits.
    """
    digits = list(str(n))
    last_occurrence = {int(d): i for i, d in enumerate(digits)}
    
    for i, d in enumerate(digits):
        # Try to find larger digit to swap
        for larger in range(9, int(d), -1):
            if larger in last_occurrence and last_occurrence[larger] > i:
                # Swap and return
                j = last_occurrence[larger]
                digits[i], digits[j] = digits[j], digits[i]
                return int(''.join(digits))
    
    return n
```

### Tactic 4: Add Digits (Digital Root)

Mathematical solution:

```python
def add_digits(n):
    """
    LeetCode 258: Add Digits.
    Return digital root.
    """
    if n == 0:
        return 0
    return 1 + (n - 1) % 9
```

### Tactic 5: K-th Digit from Number Stream

Finding kth digit in concatenated sequence:

```python
def find_kth_number(k):
    """
    Find kth digit in sequence 123456789101112...
    """
    # 1-digit numbers: 1-9 (9 numbers, 9 digits)
    # 2-digit numbers: 10-99 (90 numbers, 180 digits)
    # 3-digit numbers: 100-999 (900 numbers, 2700 digits)
    # etc.
    
    length = 1          # Current number length
    count = 9           # Count of numbers with this length
    start = 1           # First number with this length
    
    # Find which length group contains kth digit
    while k > length * count:
        k -= length * count
        length += 1
        count *= 10
        start *= 10
    
    # Find the exact number
    num = start + (k - 1) // length
    
    # Find the exact digit in that number
    digit_index = (k - 1) % length
    return int(str(num)[digit_index])
```

---

## Python Templates

### Template 1: Extract Digits

```python
def get_digits(n):
    """
    Get all digits of n as a list (most significant first).
    
    Time: O(log n), Space: O(log n)
    """
    if n == 0:
        return [0]
    
    digits = []
    while n > 0:
        digits.append(n % 10)
        n //= 10
    
    return digits[::-1]  # Reverse to get MSB first

def get_digits_reverse(n):
    """
    Get digits in reverse order (LSB first).
    Same as extraction order.
    """
    digits = []
    while n > 0:
        digits.append(n % 10)
        n //= 10
    return digits
```

### Template 2: Digit Sum and Count

```python
def digit_sum(n):
    """
    Sum of all digits.
    Time: O(log n)
    """
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

def digit_count(n):
    """
    Count number of digits.
    Time: O(log n)
    """
    if n == 0:
        return 1
    count = 0
    while n > 0:
        count += 1
        n //= 10
    return count

# Alternative using log
def digit_count_log(n):
    """Count digits using logarithm."""
    import math
    if n == 0:
        return 1
    return int(math.log10(n)) + 1
```

### Template 3: Number Construction and Reversal

```python
def number_from_digits(digits):
    """
    Build number from list of digits.
    Time: O(n) where n is number of digits
    """
    result = 0
    for d in digits:
        result = result * 10 + d
    return result

def reverse_number(n):
    """
    Reverse the digits of a number.
    Time: O(log n)
    """
    rev = 0
    while n > 0:
        rev = rev * 10 + (n % 10)
        n //= 10
    return rev

def is_palindrome(n):
    """
    Check if number is palindrome.
    Time: O(log n)
    """
    return n == reverse_number(n)
```

### Template 4: Get K-th Digit

```python
def get_kth_digit_from_right(n, k):
    """
    Get kth digit from the right (0-indexed).
    k=0 is units digit.
    """
    for _ in range(k):
        n //= 10
    return n % 10

def get_kth_digit_from_left(n, k):
    """
    Get kth digit from the left (0-indexed).
    """
    digits = get_digits(n)
    return digits[k] if k < len(digits) else None
```

### Template 5: Digit Rotation

```python
def rotate_digits_left(n, k):
    """
    Rotate digits left by k positions.
    Example: rotate_digits_left(12345, 2) = 34512
    """
    digits = get_digits(n)
    k = k % len(digits)
    rotated = digits[k:] + digits[:k]
    return number_from_digits(rotated)

def rotate_digits_right(n, k):
    """
    Rotate digits right by k positions.
    Example: rotate_digits_right(12345, 2) = 45123
    """
    digits = get_digits(n)
    k = k % len(digits)
    rotated = digits[-k:] + digits[:-k]
    return number_from_digits(rotated)
```

### Template 6: Consecutive Differing Numbers

```python
def nums_same_consecutive_diff(n, k):
    """
    Generate all n-digit numbers with consecutive digits differing by k.
    LeetCode 967.
    
    Time: O(2^n) in worst case
    Space: O(2^n) for result
    """
    if n == 1:
        return list(range(10))
    
    result = []
    
    def dfs(current, remaining):
        if remaining == 0:
            result.append(current)
            return
        
        last_digit = current % 10
        
        if last_digit + k <= 9:
            dfs(current * 10 + (last_digit + k), remaining - 1)
        
        if k != 0 and last_digit - k >= 0:
            dfs(current * 10 + (last_digit - k), remaining - 1)
    
    for start in range(1, 10):
        dfs(start, n - 1)
    
    return result
```

---

## When to Use

Use Digit Manipulation when you need to solve problems involving:

- **Digit Sum/Products**: Properties based on individual digits
- **Palindromes**: Numbers that read same forwards and backwards
- **Number Reconstruction**: Building numbers from digit constraints
- **Digital Root**: Recursive digit sums
- **Digit DP**: Counting numbers with specific digit constraints
- **Rotated Digits**: Numbers valid when digits rotated (0→0, 1→1, 6→9, 8→8, 9→6)

### Comparison with Alternatives

| Problem | Digit Approach | Alternative | When to Use Alternative |
|---------|---------------|-------------|------------------------|
| **Reverse number** | O(log n) digit ops | String reverse | String is clearer |
| **Palindrome check** | Reverse and compare | String comparison | String is clearer |
| **Digit sum** | Iterative O(log n) | String conversion | When working with strings |
| **Count digits** | log10 formula | Iterative | log10 for quick estimate |

---

## Algorithm Explanation

### Core Concept

Digit manipulation leverages the base-10 representation of numbers to extract and manipulate individual digits through modulo and division operations. These operations are O(log n) where log is base 10.

**Key Terminology**:
- **MSB**: Most Significant Bit/Digit (leftmost)
- **LSB**: Least Significant Bit/Digit (rightmost)
- **Digital root**: Recursive sum until single digit
- **Modulo 9 property**: Digital root equals n mod 9 (with 0 mapped to 9)

### How It Works

#### Step 1: Extract Digits

```python
def extract_digits(n):
    digits = []
    while n > 0:
        digits.append(n % 10)  # Get last digit
        n //= 10              # Remove last digit
    return digits[::-1]       # Reverse for MSB first
```

#### Step 2: Digit Sum

```python
def sum_digits(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total
```

#### Step 3: Number Reconstruction

```python
def build_number(digits):
    result = 0
    for d in digits:
        result = result * 10 + d
    return result
```

### Visual Walkthrough

**Example: Reverse Number 12345**:
```
Initial: n = 12345, rev = 0

Step 1: n % 10 = 5, rev = 0 * 10 + 5 = 5, n = 1234
Step 2: n % 10 = 4, rev = 5 * 10 + 4 = 54, n = 123
Step 3: n % 10 = 3, rev = 54 * 10 + 3 = 543, n = 12
Step 4: n % 10 = 2, rev = 543 * 10 + 2 = 5432, n = 1
Step 5: n % 10 = 1, rev = 5432 * 10 + 1 = 54321, n = 0

Result: 54321
```

### Why Digit Manipulation Works

1. **Base 10 Representation**: Each digit position is power of 10
2. **Modulo Property**: `n % 10` gives units digit
3. **Division Property**: `n // 10` shifts right by one digit
4. **Constructive**: Can build numbers digit by digit

### Limitations

- **String Conversion**: Sometimes simpler but slower
- **Large Numbers**: Python handles big integers, but operations still O(log n)
- **Floating Point**: Converting from float can lose precision
- **Negative Numbers**: Need special handling

---

## Practice Problems

### Problem 1: Add Digits

**Problem:** [LeetCode 258 - Add Digits](https://leetcode.com/problems/add-digits/)

**Description:** Given n, repeatedly add digits until single digit.

**How to Apply:**
- Use mathematical formula: 1 + (n - 1) % 9
- Or iterative digit sum

---

### Problem 2: Numbers With Same Consecutive Differences

**Problem:** [LeetCode 967 - Numbers With Same Consecutive Differences](https://leetcode.com/problems/numbers-with-same-consecutive-differences/)

**Description:** Return all n-digit numbers where consecutive digits differ by k.

**How to Apply:**
- DFS building numbers digit by digit
- At each step, add valid next digits

---

### Problem 3: Confusing Number II

**Problem:** [LeetCode 1088 - Confusing Number II](https://leetcode.com/problems/confusing-number-ii/)

**Description:** Count numbers up to N that are confusing when rotated 180°.

**How to Apply:**
- Valid rotated digits: 0→0, 1→1, 6→9, 8→8, 9→6
- DFS with digit DP counting valid numbers
- Exclude numbers that equal their rotation

---

### Problem 4: Maximum Swap

**Problem:** [LeetCode 670 - Maximum Swap](https://leetcode.com/problems/maximum-swap/)

**Description:** Given number, swap two digits to get maximum.

**How to Apply:**
- Track last occurrence of each digit
- For each position, look for larger digit to swap

---

### Problem 5: Sum of Digits in Minimum Number

**Problem:** [LeetCode 1085 - Sum of Digits in the Minimum Number](https://leetcode.com/problems/sum-of-digits-in-minimum-number/)

**Description:** Check if digit sum of minimum element is odd.

**How to Apply:**
- Find minimum
- Compute digit sum
- Check parity

---

### Problem 6: Find Numbers with Even Number of Digits

**Problem:** [LeetCode 1295 - Find Numbers with Even Number of Digits](https://leetcode.com/problems/find-numbers-with-even-number-of-digits/)

**Description:** Count numbers with even number of digits.

**How to Apply:**
- For each number, count digits
- Check if even

---

## Video Tutorial Links

### Fundamentals

- [Digit Manipulation Basics](https://www.youtube.com/watch?v=99I8pb8vWXI) - Number theory
- [Digit DP Introduction](https://www.youtube.com/watch?v=99I8pb8vWXI) - Advanced technique
- [Digital Root Explanation](https://www.youtube.com/watch?v=99I8pb8bWXI) - Mathematical property

### Problem Solving

- [LeetCode 258 Solution](https://www.youtube.com/watch?v=99I8pb8vWXI) - Add digits
- [Confusing Number Problems](https://www.youtube.com/watch?v=99I8pb8vWXI) - Rotation patterns
- [Maximum Swap Explanation](https://www.youtube.com/watch?v=99I8pb8vWXI) - Greedy digit manipulation

---

## Follow-up Questions

### Q1: When should you use digit manipulation vs string conversion?

**Answer:**
- **Digit manipulation**: Better for mathematical operations, slightly faster
- **String conversion**: More readable, easier for complex transformations
- **Performance**: Both O(log n), digit ops slightly faster
- **Choose strings**: When code clarity matters more
- **Choose digits**: When doing heavy mathematical computation

---

### Q2: What is the mathematical formula for digital root?

**Answer:**
- **Formula**: `digital_root(n) = 1 + (n - 1) % 9` for n > 0
- **Explanation**: Based on property that n ≡ digit_sum(n) (mod 9)
- **Exception**: When n % 9 == 0 and n > 0, result is 9 not 0
- **Proof**: Numbers preserve value mod 9 under digit sum
- **Use case**: O(1) digital root calculation

---

### Q3: How do you handle very large numbers (beyond 64-bit)?

**Answer:**
- **Python**: Automatically handles arbitrary precision
- **Other languages**: Use BigInteger libraries
- **Digit extraction**: Same algorithm works for any size
- **Performance**: O(number of digits) regardless of value
- **Memory**: Proportional to number of digits

---

### Q4: What's the difference between digit extraction from left vs right?

**Answer:**
- **From right (n % 10)**: Natural, efficient, get LSB first
- **From left**: Requires knowing total digits first or using log
- **Reconstruction**: Usually easier to build left to right
- **Storage**: Right extraction needs reverse for left-to-right order

---

### Q5: Can all digit problems be solved with DP?

**Answer:**
- **Simple problems**: Usually iterative solutions suffice
- **Counting with constraints**: Digit DP is powerful
- **Optimization**: Often greedy works (e.g., Maximum Swap)
- **Trade-off**: DP more general but slower to implement
- **When to use DP**: Counting numbers in range with digit constraints

---

## Summary

Digit manipulation is a fundamental technique for number-based problems. Key takeaways:

1. **Modulo 10**: Extracts last digit
2. **Floor division by 10**: Removes last digit
3. **Number construction**: `result = result * 10 + digit`
4. **Digital root**: `1 + (n - 1) % 9`
5. **Applications**: Palindromes, digit sums, reconstruction

**When to Use**:
- Problems requiring individual digit access
- Number reconstruction from constraints
- Palindrome and rotation problems
- Digit DP for counting

**Implementation Tips**:
- Handle n = 0 as special case
- Use iterative extraction for efficiency
- Consider string conversion for readability
- Apply mathematical properties when possible

This foundation is essential for more advanced number theory and digit DP problems.
