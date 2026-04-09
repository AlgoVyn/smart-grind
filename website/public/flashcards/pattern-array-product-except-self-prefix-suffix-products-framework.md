## Array - Product Except Self: Framework

What is the complete code template for calculating product of all elements except self without using division?

<!-- front -->

---

### Framework 1: Prefix/Suffix Products (Two Arrays)

```
┌─────────────────────────────────────────────────────┐
│  PRODUCT EXCEPT SELF - TEMPLATE                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize prefix array with 1s                   │
│     prefix[i] = product of all elements before i      │
│                                                        │
│  2. Fill prefix left to right:                        │
│     For i from 1 to n-1:                              │
│       prefix[i] = prefix[i-1] * nums[i-1]              │
│                                                        │
│  3. Initialize suffix array with 1s                   │
│     suffix[i] = product of all elements after i       │
│                                                        │
│  4. Fill suffix right to left:                        │
│     For i from n-2 down to 0:                         │
│       suffix[i] = suffix[i+1] * nums[i+1]              │
│                                                        │
│  5. Result[i] = prefix[i] * suffix[i]                  │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Prefix/Suffix Arrays

```python
def product_except_self(nums):
    """
    Calculate product of array except self.
    Time: O(n), Space: O(n) for prefix and suffix
    """
    n = len(nums)
    prefix = [1] * n
    suffix = [1] * n
    result = [1] * n
    
    # Calculate prefix products
    for i in range(1, n):
        prefix[i] = prefix[i - 1] * nums[i - 1]
    
    # Calculate suffix products
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i + 1] * nums[i + 1]
    
    # Combine
    for i in range(n):
        result[i] = prefix[i] * suffix[i]
    
    return result
```

---

### Framework 2: Optimized O(1) Extra Space

```python
def product_except_self_optimized(nums):
    """
    O(1) extra space (excluding output array).
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    result = [1] * n
    
    # First pass: left products (prefix)
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]
    
    # Second pass: multiply with right products (suffix)
    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]
    
    return result
```

---

### Key Insight

```
result[i] = (product of elements before i) × (product of elements after i)
          = prefix_product[i] × suffix_product[i]
```

---

### Key Pattern Elements

| Element | Purpose | Pass Direction |
|---------|---------|----------------|
| `prefix` | Product of elements before i | Left to right |
| `suffix` | Product of elements after i | Right to left |
| `result` | Combined product | Both directions |
| O(1) space | Use result array for prefix | Right pass with accumulator |

<!-- back -->
