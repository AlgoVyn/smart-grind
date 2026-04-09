## Bitwise XOR - Missing Number: Tactics

What are the advanced techniques for XOR-based problems?

<!-- front -->

---

### Tactic 1: Find Two Single Numbers

```python
def single_number_two(nums):
    """Find two numbers appearing once (others twice)."""
    # Step 1: XOR all to get a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Step 2: Find any set bit (differs between a and b)
    diff_bit = xor_all & (-xor_all)
    
    # Step 3: Partition and XOR each group
    a = b = 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

---

### Tactic 2: Find Duplicate and Missing

```python
def find_error_nums(nums):
    """Find duplicate and missing in [1..n]."""
    n = len(nums)
    
    # XOR for both
    xor_all = 0
    for i, num in enumerate(nums, 1):
        xor_all ^= i ^ num
    
    # xor_all = duplicate ^ missing
    # Find any set bit to partition
    diff_bit = xor_all & (-xor_all)
    
    xor_group1 = xor_group2 = 0
    for i, num in enumerate(nums, 1):
        if i & diff_bit:
            xor_group1 ^= i
        else:
            xor_group2 ^= i
        
        if num & diff_bit:
            xor_group1 ^= num
        else:
            xor_group2 ^= num
    
    # Determine which is duplicate
    for num in nums:
        if num == xor_group1:
            return [xor_group1, xor_group2]  # [dup, missing]
    return [xor_group2, xor_group1]
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong initialization | Wrong result | Start with 0 |
| Order matters | No, XOR is commutative | Any order OK |
| Multiple missing | XOR fails | Use math or hash |
| Negative numbers | Still works | XOR handles signs |

---

### Tactic 4: Sum vs XOR

```python
def missing_number_math(nums):
    """Mathematical approach (sum formula)."""
    n = len(nums)
    expected = n * (n + 1) // 2
    actual = sum(nums)
    return expected - actual
```

**Comparison:**
- Math: O(n), risk of overflow
- XOR: O(n), no overflow risk

<!-- back -->
