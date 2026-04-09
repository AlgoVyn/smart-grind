## Bitwise XOR - Finding Single/Missing Number: Comparison

How does the XOR approach compare to alternative methods for finding single or missing numbers?

<!-- front -->

---

### Comparison 1: Single Number Problem

**Problem:** Find element appearing once, others appear twice

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **XOR** | O(n) | O(1) | Optimal, simple | None |
| Hash Set | O(n) | O(n) | Intuitive | Extra space |
| Sorting | O(n log n) | O(1)/O(n) | No extra logic | Slower, modifies array |
| Math (Sum) | O(n) | O(1) | Simple formula | Risk of integer overflow |

**Sum Formula:**
```python
def single_number_sum(nums):
    # 2 * sum(set(nums)) - sum(nums) = single
    return 2 * sum(set(nums)) - sum(nums)
    # Overflow risk for large numbers!
```

**Winner:** XOR - universally safe, optimal complexity

---

### Comparison 2: Missing Number Problem

**Problem:** Find missing number from range [0..n]

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **XOR** | O(n) | O(1) | No overflow risk | Slightly less intuitive |
| **Gauss Sum** | O(n) | O(1) | Very simple | Overflow risk |
| Sorting | O(n log n) | O(1)/O(n) | Simple | Slower |
| Hash Set | O(n) | O(n) | Intuitive | Extra space |

**Gauss Formula:**
```python
def missing_number_gauss(nums):
    n = len(nums)
    expected = n * (n + 1) // 2
    actual = sum(nums)
    return expected - actual
```

**Trade-off:**
- XOR: Handles any integer range, no overflow
- Gauss: Simpler to understand, but `n*(n+1)//2` can overflow in fixed-precision languages

---

### Comparison 3: Two Single Numbers

**Problem:** Find two elements appearing once, others appear twice

| Approach | Time | Space | Strategy |
|----------|------|-------|----------|
| **XOR + Partition** | O(n) | O(1) | XOR all, split by diff bit |
| Hash Map | O(n) | O(n) | Count frequencies |
| Sorting | O(n log n) | O(1)/O(n) | Scan pairs |

**XOR Solution:**
```python
def two_singles_xor(nums):
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    diff_bit = xor_all & -xor_all
    a = b = 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    return [a, b]
```

**Winner:** XOR - only O(1) space solution

---

### Comparison 4: Single Number II (Appears Once, Others Thrice)

**Problem:** Find element appearing once, others appear three times

| Approach | Time | Space | Logic |
|----------|------|-------|-------|
| **Bit Counting** | O(n * 32) ≈ O(n) | O(1) | Count bits mod 3 |
| Hash Map | O(n) | O(n) | Frequency count |
| Math | O(n) | O(1) | 3*sum(set) - sum(nums) / 2 | Overflow risk |

**Bit Counting (XOR Extension):**
```python
def single_number_ii(nums):
    ones, twos = 0, 0
    for num in nums:
        twos |= ones & num    # Bits seen twice
        ones ^= num           # Bits seen once
        common = ~(ones & twos)
        ones &= common        # Clear bits seen 3 times
        twos &= common
    return ones
```

---

### Comparison 5: General Trade-offs

| Factor | XOR | Hash Map | Math Formula | Sorting |
|--------|-----|----------|--------------|---------|
| Time | O(n) | O(n) | O(n) | O(n log n) |
| Space | O(1) | O(n) | O(1) | O(1)/O(n) |
| Handles negatives | Yes | Yes | Yes | Yes |
| Overflow safe | Yes | N/A | No (sum) | N/A |
| Modifies input | No | No | No | Yes (if in-place) |
| Code complexity | Low | Low | Lowest | Low |
| Interview preference | High | Medium | Medium | Low |

---

### When to Choose Each Approach

**Choose XOR when:**
- Space constraint is tight (O(1) required)
- Large numbers (overflow risk with sum)
- Need elegant, bit-level solution
- Problem explicitly involves pairs

**Choose Hash Map when:**
- Space is not constrained
- Need frequency information anyway
- Problem variations are complex

**Choose Math Formula when:**
- Quick one-off solution needed
- Numbers are small (no overflow risk)
- Interview allows simplest solution

**Choose Sorting when:**
- Array needs to be sorted anyway
- Follow-up requires sorted order

<!-- back -->
