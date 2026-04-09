## Bitwise XOR - Finding Single/Missing Number: Tactics

What are the tactical implementation tricks and optimizations for XOR single/missing number problems?

<!-- front -->

---

### Tactic 1: Single-Pass Missing Number

**Standard:** Two separate loops for array and range
**Optimization:** Combine into single pass

```python
def missing_number_optimized(nums):
    """
    XOR index with value in one pass.
    Start with n since indices only go 0..n-1.
    """
    n = len(nums)
    result = n  # Missing index n
    
    for i in range(n):
        result ^= i ^ nums[i]
    
    return result

# Example: nums = [0, 1, 3]
# result = 3 ^ (0^0) ^ (1^1) ^ (2^3)
#        = 3 ^ 0 ^ 0 ^ 1 = 2
```

**Benefits:** One less loop, cleaner code

---

### Tactic 2: Finding the Rightmost Set Bit

**Purpose:** Separate two distinct numbers in "Two Singles" problems

```python
# Method 1: Using two's complement (fastest)
diff_bit = xor_all & -xor_all

# Method 2: Using bit manipulation
xor_all = a ^ b  # Some bits are 1 where a≠b
diff_bit = xor_all & ~(xor_all - 1)

# Both isolate the least significant set bit
```

**Why `& -xor_all` works:**
```
xor_all = 12 = 1100
-xor_all = 0100 (two's complement)
result = 1100 & 0100 = 0100 = 4
```

---

### Tactic 3: Range Optimization

**For Missing Number [1..n] vs [0..n]:**

```python
# [0..n] - start with n
def missing_zero_based(nums):
    n = len(nums)
    result = n
    for i in range(n):
        result ^= i ^ nums[i]
    return result

# [1..n] - start with 0, use i+1
def missing_one_based(nums):
    n = len(nums)
    result = 0
    for i in range(n):
        result ^= (i + 1) ^ nums[i]
    return result
```

**Key:** Adjust for whether range starts at 0 or 1

---

### Tactic 4: In-Place Memory Trick (Swapping)

**Context:** XOR can swap values without extra variable

```python
# Standard swap
temp = a
a = b
b = temp

# XOR swap (when a and b are distinct memory locations)
a = a ^ b
b = a ^ b  # (a^b) ^ b = a
a = a ^ b  # (a^b) ^ a = b
```

**Warning:** Doesn't work if `a` and `b` reference same memory!

---

### Tactic 5: Verification Pattern

**When result could be either of two possibilities:**

```python
def find_error_nums(nums):
    # ... compute candidate1, candidate2 via XOR partitioning ...
    
    # Verify which is duplicate (appears twice in array)
    # and which is missing (doesn't appear)
    return [dup, miss] if dup in nums else [miss, dup]
```

**Alternative (O(1) space verification):**
```python
# Use index as hash: mark seen by negating
for num in nums:
    idx = abs(num) - 1
    if nums[idx] < 0:
        duplicate = abs(num)
    else:
        nums[idx] *= -1
```

---

### Tactic 6: Prefix XOR for Range Queries

**Precompute for O(1) subarray XOR queries:**

```python
class XORPrefix:
    def __init__(self, nums):
        self.prefix = [0]
        for num in nums:
            self.prefix.append(self.prefix[-1] ^ num)
    
    def query(self, left, right):
        """XOR of nums[left..right] inclusive"""
        return self.prefix[right + 1] ^ self.prefix[left]

# Property: prefix[L] ^ (nums[L]^...^nums[R]) = prefix[R+1]
# Therefore: nums[L..R] = prefix[R+1] ^ prefix[L]
```

---

### Tactic 7: String XOR (Find the Difference)

**For character comparison:**

```python
def find_the_difference(s, t):
    """t has one extra char compared to s"""
    result = 0
    for char in s:
        result ^= ord(char)
    for char in t:
        result ^= ord(char)
    return chr(result)
```

**Alternative:** XOR both strings in one loop
```python
result = 0
for i in range(len(s)):
    result ^= ord(s[i]) ^ ord(t[i])
result ^= ord(t[-1])  # Extra character in t
```

---

### Quick Reference: XOR Patterns

| Pattern | Code Snippet |
|---------|--------------|
| Single unique | `reduce(lambda a,b: a^b, nums)` |
| Missing number | `reduce(xor, range(n+1)) ^ reduce(xor, nums)` |
| Two uniques | Partition by `xor_all & -xor_all` |
| Swap vars | `a,b = a^b, a^b, a^b` (3 steps) |
| Check odd count | `bool(reduce(xor, nums))` |

<!-- back -->
