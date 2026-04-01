## Title: XOR Trick - Comparison Guide

How does XOR compare to other techniques for finding unique/missing elements?

<!-- front -->

---

### Finding Single Unique: Algorithm Comparison

| Algorithm | Time | Space | Requirements | Best For |
|-----------|------|-------|--------------|----------|
| **Hash Set** | O(n) | O(n) | O(n) extra space | General case |
| **Sorting** | O(n log n) | O(1) or O(n) | Modifiable array | When sorted anyway |
| **Math (Sum)** | O(n) | O(1) | No overflow issues | Integers only |
| **XOR** | O(n) | O(1) | Even occurrences (2, 4, ...) | Single unique in pairs |
| **Bit Count** | O(n × 32) | O(1) | Fixed-size integers | 3+ occurrences |

```python
# Single unique element approaches:

# Hash Set (general)
def unique_hash(nums):
    seen = set()
    for num in nums:
        if num in seen:
            seen.remove(num)
        else:
            seen.add(num)
    return seen.pop()

# Math (Sum)
def unique_sum(nums):
    # 2 * sum(unique elements) - sum(all)
    return 2 * sum(set(nums)) - sum(nums)

# XOR (best for pairs)
def unique_xor(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
```

---

### XOR vs Hash Set Trade-offs

| Aspect | XOR | Hash Set |
|--------|-----|----------|
| **Space** | O(1) | O(n) |
| **Time** | O(n) | O(n) average |
| **Works with** | Even occurrences | Any occurrence pattern |
| **Multiple uniques** | Complex | Simple |
| **Data types** | Integers only | Any hashable |
| **Preserves info** | No (just XOR result) | Yes (full frequency) |

```python
# Multiple unique elements: Hash Set wins
from collections import Counter

def find_all_uniques(nums, k):
    """Find elements appearing once when others appear k times"""
    freq = Counter(nums)
    return [x for x, c in freq.items() if c == 1]

# XOR approach only works for k=2
```

---

### XOR vs Sum for Missing Number

| Approach | Formula | Issues |
|----------|---------|--------|
| **Sum** | `n*(n+1)/2 - sum(nums)` | Integer overflow |
| **XOR** | `xor(1..n) ^ xor(nums)` | No overflow |
| **Gauss** | Same as sum | Same overflow |

```python
# Missing number comparison:

def missing_sum(nums, n):
    # Risk of overflow for large n
    return n * (n + 1) // 2 - sum(nums)

def missing_xor(nums, n):
    # No overflow risk
    result = 0
    for i in range(1, n + 1):
        result ^= i
    for num in nums:
        result ^= num
    return result

# XOR is preferred for very large ranges
```

---

### Bit Manipulation Comparison

| Operation | XOR | AND | OR | NOT |
|-----------|-----|-----|----|-----|
| **Toggle** | ✓ `a ^ 1` | ✗ | ✗ | ✗ |
| **Set** | ✗ | ✓ `a \| 1` | ✓ `a \| 1` | ✗ |
| **Clear** | ✗ | ✓ `a & 0` | ✗ | ✗ |
| **Check** | ✗ | ✓ `a & 1` | ✗ | ✗ |
| **Equality** | ✓ `a ^ b == 0` | ✗ | ✗ | ✗ |

```python
# Common bit operations:

# Toggle: XOR
a ^= mask  # Toggle bits in mask

# Set: OR
a |= mask  # Set bits in mask to 1

# Clear: AND with NOT
a &= ~mask  # Clear bits in mask to 0

# Check: AND
if a & mask:  # Check if any bit in mask is set

# Equality: XOR == 0
if (a ^ b) == 0:  # a equals b
```

---

### When NOT to Use XOR

| Scenario | Why XOR Fails | Alternative |
|----------|---------------|-------------|
| **3+ unique elements** | XOR cancels incorrectly | Hash Map |
| **Non-integer data** | XOR undefined | Hash Set |
| **Need full count** | Only gives XOR result | Counter |
| **Odd k occurrences** | Self-inverse fails | Bit counting |
| **Floating point** | Bit-level undefined | Tolerance comparison |

```python
# XOR limitations example:

# Three unique elements: XOR gives garbage
def xor_three_uniques(nums):
    result = 0
    for num in nums:
        result ^= num
    return result  # Returns a^b^c, not useful

# Need hash map instead
def find_three_uniques(nums):
    freq = Counter(nums)
    return [x for x, c in freq.items() if c == 1]
```

<!-- back -->
