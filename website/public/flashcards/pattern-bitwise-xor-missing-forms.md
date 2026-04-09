## Bitwise XOR - Missing Number: Forms

What are the different variations of XOR missing number problems?

<!-- front -->

---

### Form 1: Single Number

```python
def single_number(nums):
    """Find element appearing once."""
    result = 0
    for num in nums:
        result ^= num
    return result
```

---

### Form 2: Missing Number

```python
def missing_number(nums):
    """Find missing in range [0..n]."""
    n = len(nums)
    result = n
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result
```

---

### Form 3: Two Single Numbers

```python
def single_number_two(nums):
    """Find two elements appearing once."""
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    diff_bit = xor_all & (-xor_all)
    a = b = 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    return [a, b]
```

---

### Form Comparison

| Form | Problem | XOR Complexity |
|------|---------|----------------|
| Single | One unique | One pass |
| Missing | Gap in sequence | Indices + values |
| Two singles | Two uniques | Partition by bit |

<!-- back -->
