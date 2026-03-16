## Bit Manipulation Patterns

**Question:** Common bit manipulation tricks?

<!-- front -->

---

## Answer: Essential Bit Operations

### Check if Number is Power of 2
```python
def isPowerOfTwo(n):
    return n > 0 and (n & (n - 1)) == 0

# n-1 flips all bits after rightmost 1
# n=8 (1000), n-1=7 (0111) → & = 0
```

### Count Set Bits
```python
def countBits(n):
    count = 0
    while n:
        n &= (n - 1)  # Clear rightmost bit
        count += 1
    return count
```

### Missing Number (0 to n)
```python
def missingNumber(nums):
    result = len(nums)
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result

# XOR cancels pairs, leaves missing
```

### Single Number (all pairs)
```python
def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
```

### ⚠️ Tricky Parts

#### 1. Power of 2 Check
```python
# n & (n-1) clears rightmost set bit
# If result is 0 → power of 2

# Why? n-1 flips all bits after rightmost 1
# 1000 & 0111 = 0000
```

#### 2. XOR Properties
```python
# a ^ a = 0 (cancels)
# a ^ 0 = a (identity)
# a ^ b ^ a = b (order doesn't matter)
```

### Common Patterns

| Problem | Trick |
|---------|-------|
| Power of 2 | n & (n-1) == 0 |
| Single number | XOR all |
| Missing number | XOR with index |
| Set bits | n &= (n-1) |

<!-- back -->
