## Bit Manipulation - XOR Single Missing: Framework

What is the complete code template for XOR-based problems?

<!-- front -->

---

### Framework 1: Single Number (appears once)

```
┌─────────────────────────────────────────────────────┐
│  XOR SINGLE NUMBER - TEMPLATE                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize result = 0                            │
│  2. For each num in array:                          │
│     result ^= num                                     │
│  3. Return result (the unique number)              │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Single Number

```python
def single_number(nums):
    """Find element that appears exactly once."""
    result = 0
    for num in nums:
        result ^= num
    return result
```

---

### Implementation: Missing Number (0 to n)

```python
def missing_number(nums):
    """Find missing number in range [0, n]."""
    n = len(nums)
    result = n  # XOR with n (the last index + 1)
    
    for i in range(n):
        result ^= (i + 1) ^ nums[i]
    
    return result

# Alternative: XOR indices and values separately
def missing_number_v2(nums):
    n = len(nums)
    result = 0
    
    # XOR all indices (0 to n)
    for i in range(n + 1):
        result ^= i
    
    # XOR all values
    for num in nums:
        result ^= num
    
    return result
```

---

### Implementation: Two Single Numbers

```python
def single_number_two(nums):
    """
    Find two numbers that appear once (others twice).
    Strategy: XOR all, find differentiating bit, partition.
    """
    # XOR all - get a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Find rightmost set bit (differs between a and b)
    diff_bit = xor_all & (-xor_all)
    
    # Partition and XOR each group
    a, b = 0, 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

---

### Key Pattern Elements

| Technique | When to Use | Key Operation |
|-----------|-------------|---------------|
| Simple XOR | One single, others paired | `result ^= num` |
| XOR indices | Missing number | `result ^= i ^ nums[i]` |
| Diff bit | Two singles | `xor_all & (-xor_all)` |
| Partition | Multiple unique | Split by bit, XOR groups |

<!-- back -->
