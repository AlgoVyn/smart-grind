## Bitwise XOR - Finding Single/Missing Number: Framework

When should I use the XOR pattern to find single or missing numbers, and what are the standard templates?

<!-- front -->

---

### Framework 1: Single Number (All Others Appear Twice)

**When:** One element appears once, all others appear exactly twice

```python
def find_single_number(nums):
    """
    XOR all elements - pairs cancel out, single remains.
    Time: O(n), Space: O(1)
    """
    result = 0
    for num in nums:
        result ^= num
    return result
```

**Key Insight:** `a ^ a = 0` causes all pairs to cancel

---

### Framework 2: Missing Number in Range [0..n]

**When:** Numbers 0..n with one missing from the array

```python
def find_missing_number(nums):
    """
    XOR all array elements with all expected indices/values.
    Present numbers cancel, missing number remains.
    """
    n = len(nums)
    xor_arr = 0
    xor_range = 0
    
    for num in nums:
        xor_arr ^= num
    
    for i in range(n + 1):
        xor_range ^= i
    
    return xor_arr ^ xor_range  # Missing number
```

**Optimization:** Single loop version
```python
def find_missing_optimized(nums):
    n = len(nums)
    result = n  # Start with n since loop only goes to n-1
    for i in range(n):
        result ^= i ^ nums[i]
    return result
```

---

### Framework 3: Two Single Numbers (All Others Appear Twice)

**When:** Two elements appear once, all others appear twice

```python
def find_two_singles(nums):
    """
    1. XOR all to get a ^ b
    2. Find differentiating bit
    3. Partition and XOR each group separately
    """
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Find rightmost set bit where a and b differ
    diff_bit = xor_all & -xor_all
    
    a, b = 0, 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

---

### Framework 4: Duplicate + Missing Number

**When:** One number duplicated, one number missing from 1..n

```python
def find_duplicate_and_missing(nums):
    """
    XOR all array elements and all expected numbers.
    Result = duplicate ^ missing.
    Use differentiating bit to partition and identify both.
    """
    xor_all = 0
    n = len(nums)
    
    for num in nums:
        xor_all ^= num
    for i in range(1, n + 1):
        xor_all ^= i
    
    diff_bit = xor_all & -xor_all
    
    dup, miss = 0, 0
    for num in nums:
        if num & diff_bit:
            dup ^= num
    for i in range(1, n + 1):
        if i & diff_bit:
            dup ^= i
        else:
            miss ^= i
    
    # Verify which is duplicate (appears in nums)
    return [dup, miss] if dup in nums else [miss, dup]
```

---

### Framework Selection Guide

| Scenario | Framework | Key Operation |
|----------|-----------|---------------|
| One unique, others paired | Single Number | Single pass XOR |
| Missing from sequence | Missing Number | XOR with full range |
| Two uniques, others paired | Two Singles | Partition by bit |
| One dup, one missing | Dup + Missing | Two-pass with verification |

<!-- back -->
