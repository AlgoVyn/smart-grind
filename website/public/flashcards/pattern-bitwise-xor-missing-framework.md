## Bitwise XOR - Missing Number: Framework

What is the complete code template for XOR-based missing number detection?

<!-- front -->

---

### Framework 1: Single Missing Number

```
┌─────────────────────────────────────────────────────┐
│  XOR MISSING NUMBER - TEMPLATE                         │
├─────────────────────────────────────────────────────┤
│  Key XOR Properties:                                   │
│  - a ^ a = 0 (self-inverse)                            │
│  - a ^ 0 = a (identity)                                │
│  - XOR is associative and commutative                │
│                                                        │
│  1. For single number appearing once:                  │
│     result = 0                                          │
│     For each num in array:                            │
│        result ^= num                                   │
│     Return result                                      │
│                                                        │
│  2. For missing number in range [0..n]:               │
│     result = XOR of all indices (0 to n)               │
│     For each num in array:                            │
│        result ^= num                                   │
│     Return result  (missing number)                  │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Single Number

```python
def single_number(nums):
    """
    Find number appearing once (others appear twice).
    LeetCode 136
    Time: O(n), Space: O(1)
    """
    result = 0
    for num in nums:
        result ^= num
    return result
```

---

### Implementation: Missing Number

```python
def missing_number(nums):
    """
    Find missing number in range [0..n].
    LeetCode 268
    """
    n = len(nums)
    result = n  # XOR of [0..n]
    
    for i, num in enumerate(nums):
        result ^= (i ^ num)
    
    return result
```

---

### Key Pattern Elements

| Property | Value | Use |
|----------|-------|-----|
| `a ^ a` | 0 | Cancel pairs |
| `a ^ 0` | a | Keep singles |
| Order | Doesn't matter | XOR all together |

<!-- back -->
