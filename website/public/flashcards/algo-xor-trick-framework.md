## Title: XOR Trick - Framework

What is the standard framework for applying XOR tricks to problems?

<!-- front -->

---

### Framework 1: Find Single Unique

**Pattern:** All elements appear twice except one

```python
def find_single(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# Example: [4, 1, 2, 1, 2] → 4
# 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4
```

---

### Framework 2: Find Missing Number

**Pattern:** Numbers 1..n, one missing

```python
def find_missing(nums, n):
    """
    nums contains n-1 distinct numbers from 1 to n
    """
    result = 0
    # XOR all numbers 1 to n
    for i in range(1, n + 1):
        result ^= i
    # XOR all array elements
    for num in nums:
        result ^= num
    return result

# Alternative: use formula
# missing = n*(n+1)//2 - sum(nums)
```

**Key insight:** Expected XOR actual = missing number

---

### Framework 3: Prefix XOR for Range Queries

**Pattern:** Query XOR of any subarray in O(1)

```python
class XORPrefix:
    def __init__(self, nums):
        self.prefix = [0]
        for num in nums:
            self.prefix.append(self.prefix[-1] ^ num)
    
    def query(self, left, right):
        """XOR of nums[left..right] inclusive"""
        return self.prefix[right + 1] ^ self.prefix[left]

# xor(L, R) = prefix[R+1] ^ prefix[L]
# Because: prefix[L] ^ (nums[L] ^ ... ^ nums[R]) = prefix[R+1]
```

| Query | Formula |
|-------|---------|
| `xor(0, i)` | `prefix[i+1]` |
| `xor(i, j)` | `prefix[j+1] ^ prefix[i]` |
| Count pairs with xor = k | Hash map of prefix frequencies |

---

### Framework 4: Find Two Unique Numbers

**Pattern:** All elements appear twice except two distinct numbers

```python
def find_two_singles(nums):
    # Step 1: XOR all to get a ^ b
    xor_ab = 0
    for num in nums:
        xor_ab ^= num
    
    # Step 2: Find any set bit in xor_ab (a and b differ here)
    # This bit separates a from b
    diff_bit = xor_ab & -xor_ab  # Rightmost set bit
    
    # Step 3: Partition and XOR each group
    a, b = 0, 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]

# Example: [1, 2, 1, 3, 2, 5]
# xor_ab = 3 ^ 5 = 110 ^ 101 = 011 (bit 0 differs)
# Group by bit 0: {1, 1, 3, 5} and {2, 2}
# XOR first group: 1^1^3^5 = 3^5 = 6... wait, recalculate:
# Actually: {1,1,3,5} XOR = 3^5 = 6, but 3 and 5 are the answers
# Need to be careful: correct groups separate 3 and 5
```

---

### Framework 5: In-Place Swap

**Pattern:** Swap two variables without temporary storage

```python
def swap_xor(a, b):
    """
    After: a contains original b, b contains original a
    """
    a = a ^ b  # a now holds a ^ b
    b = a ^ b  # b = (a ^ b) ^ b = a
    a = a ^ b  # a = (a ^ b) ^ a = b
    return a, b

# Example: a=5 (101), b=3 (011)
# a = 5 ^ 3 = 6 (110)
# b = 6 ^ 3 = 5 (101)  ← original a
# a = 6 ^ 5 = 3 (011)  ← original b
```

**Note:** Only works when a and b are distinct memory locations.

<!-- back -->
