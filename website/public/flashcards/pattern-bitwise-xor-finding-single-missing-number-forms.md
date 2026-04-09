## Bitwise XOR - Finding Single/Missing Number: Forms

What are the different problem variations and forms of the XOR single/missing number pattern?

<!-- front -->

---

### Form 1: Single Number (LeetCode 136)

**Pattern:** One element appears once, all others appear twice

```python
def single_number(nums):
    """
    Input: [4, 1, 2, 1, 2]
    Output: 4
    """
    result = 0
    for num in nums:
        result ^= num
    return result
```

**Characteristics:**
- Simplest form
- Single pass through array
- Result initialized to 0 (identity)

---

### Form 2: Missing Number (LeetCode 268)

**Pattern:** Find missing number from range [0..n]

```python
def missing_number(nums):
    """
    Input: [0, 1, 3]  (n=3, missing 2)
    Output: 2
    """
    n = len(nums)
    result = n
    for i in range(n):
        result ^= i ^ nums[i]
    return result

# Alternative two-pass:
def missing_number_explicit(nums):
    n = len(nums)
    xor_arr = 0
    xor_range = 0
    
    for num in nums:
        xor_arr ^= num
    for i in range(n + 1):
        xor_range ^= i
    
    return xor_arr ^ xor_range
```

**Characteristics:**
- XOR indices with values
- Range [0..n] or [1..n]
- Start with n to include missing index

---

### Form 3: Two Single Numbers (LeetCode 260)

**Pattern:** Two elements appear once, all others appear twice

```python
def single_number_three(nums):
    """
    Input: [1, 2, 1, 3, 2, 5]
    Output: [3, 5] (order doesn't matter)
    """
    # Step 1: XOR all to get a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Step 2: Find a bit that differs
    diff_bit = xor_all & -xor_all
    
    # Step 3: Partition and XOR each group
    a = b = 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

**Characteristics:**
- Requires partition by differentiating bit
- Two-pass algorithm
- Result is `xor_all & -xor_all` trick

---

### Form 4: Set Mismatch (LeetCode 645)

**Pattern:** One number duplicated, one number missing from [1..n]

```python
def find_error_nums(nums):
    """
    Input: [1, 2, 2, 4]  (duplicate 2, missing 3)
    Output: [2, 3]
    """
    xor_all = 0
    n = len(nums)
    
    # XOR all array elements
    for num in nums:
        xor_all ^= num
    
    # XOR all expected numbers 1..n
    for i in range(1, n + 1):
        xor_all ^= i
    
    # xor_all = duplicate ^ missing
    diff_bit = xor_all & -xor_all
    
    dup = miss = 0
    
    # XOR array elements by partition
    for num in nums:
        if num & diff_bit:
            dup ^= num
    
    # XOR expected numbers by partition
    for i in range(1, n + 1):
        if i & diff_bit:
            dup ^= i
        else:
            miss ^= i
    
    # Verify which is which
    return [dup, miss] if dup in nums else [miss, dup]
```

**Characteristics:**
- XOR result gives `dup ^ miss`
- Need verification step
- One duplicate, one missing

---

### Form 5: Single Number II (LeetCode 137)

**Pattern:** One element appears once, all others appear three times

```python
def single_number_ii(nums):
    """
    Input: [2, 2, 3, 2]
    Output: 3
    
    XOR doesn't work directly (3 is not even)
    Use bit counting: track bits seen once and twice
    """
    ones = 0   # Bits seen once
    twos = 0   # Bits seen twice
    
    for num in nums:
        # If bit in ones and appears again → move to twos
        twos |= ones & num
        
        # XOR with ones (toggle if not in twos)
        ones ^= num
        
        # Clear bits that appear in both (seen 3 times)
        common = ~(ones & twos)
        ones &= common
        twos &= common
    
    return ones
```

**Characteristics:**
- Extension of XOR pattern
- Track bit frequencies mod 3
- State machine: 0 → 1 → 2 → 0

---

### Form Comparison Matrix

| Form | Pattern | Frequency | Key Technique | Complexity |
|------|---------|-----------|---------------|------------|
| Single Number | One unique | 1 vs 2 | Simple XOR | O(n) O(1) |
| Missing Number | Gap in range | 1 missing | XOR indices + values | O(n) O(1) |
| Two Singles | Two uniques | 1,1 vs 2 | Partition by bit | O(n) O(1) |
| Set Mismatch | Dup + Missing | 2,0 vs 1 | Two-pass + verify | O(n) O(1) |
| Single Number II | One vs three | 1 vs 3 | Bit counting mod 3 | O(n) O(1) |

---

### Form Decision Tree

```
Problem asks for:
├── Single element once, others twice?
│   └── Use: Form 1 (Simple XOR)
├── Missing from sequence?
│   └── Use: Form 2 (XOR with range)
├── Two elements once, others twice?
│   └── Use: Form 3 (Partition by bit)
├── One dup, one missing?
│   └── Use: Form 4 (Dup ^ Missing)
└── Single once, others thrice?
    └── Use: Form 5 (Bit counting)
```

<!-- back -->
