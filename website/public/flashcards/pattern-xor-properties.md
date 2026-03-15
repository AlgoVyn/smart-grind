## XOR Properties and Tricks

**Question:** What are the key properties of XOR that make it useful for solving problems?

<!-- front -->

---

## Answer: Key XOR Properties

### Fundamental Properties
```
1. a ^ a = 0           (Self-inverse)
2. a ^ 0 = a           (Identity)
3. a ^ b = b ^ a       (Commutative)
4. (a ^ b) ^ c = a ^ (b ^ c)  (Associative)
```

### Useful Tricks

#### Find Unique Number in Pairs
```python
# All numbers appear twice except one
def find_unique(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
```

#### Swap Two Numbers (no temp)
```python
a, b = 5, 9
a = a ^ b  # a = 5 ^ 9
b = a ^ b  # b = (5 ^ 9) ^ 9 = 5
a = a ^ b  # a = (5 ^ 9) ^ 5 = 9
```

#### Find Missing Number
```python
# 1 to n, one missing
def find_missing(nums, n):
    result = 0
    for i in range(1, n + 1):
        result ^= i
    for num in nums:
        result ^= num
    return result
```

### Bit Manipulation Patterns

| Operation | Expression | Result |
|-----------|------------|--------|
| Get bit | `(num >> i) & 1` | i-th bit |
| Set bit | `num \| (1 << i)` | i-th bit = 1 |
| Clear bit | `num & ~(1 << i)` | i-th bit = 0 |
| Toggle bit | `num ^ (1 << i)` | flip i-th bit |

### ⚠️ Important Notes
- XOR with itself cancels out
- Order doesn't matter for XOR (unlike subtraction)
- Use parenthesis to control precedence: `a ^ b & c` ≠ `a ^ (b & c)`

### Common LeetCode Problems
- Single Number (I, II, III)
- Missing Number
- Flip Bits to Make Equal
- XOR Queries of a Subarray

<!-- back -->
