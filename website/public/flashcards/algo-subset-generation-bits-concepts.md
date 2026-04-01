## Title: Subset Generation (Bits) - Core Concepts

What is subset generation using bit manipulation?

<!-- front -->

---

### Definition
An elegant technique that leverages binary numbers to generate all 2^n subsets of a set with n elements. Each bit pattern corresponds to a unique subset.

| Aspect | Details |
|--------|---------|
| **Time** | O(2^n × n) - check all n bits for each subset |
| **Space** | O(1) auxiliary (excluding output) |
| **Practical Limit** | n ≤ 20 (2^20 = 1,048,576) |

---

### Binary-Subset Correspondence

| Bit Position | Binary | Element Included |
|--------------|--------|------------------|
| 0 (LSB) | 0001 | nums[0] |
| 1 | 0010 | nums[1] |
| 2 | 0100 | nums[2] |
| i | 1 << i | nums[i] |

### Mask Enumeration

For n=3 elements:

| Mask (decimal) | Mask (binary) | Subset Generated |
|----------------|---------------|------------------|
| 0 | 000 | [] |
| 1 | 001 | [nums[0]] |
| 2 | 010 | [nums[1]] |
| 3 | 011 | [nums[0], nums[1]] |
| 4 | 100 | [nums[2]] |
| 5 | 101 | [nums[0], nums[2]] |
| 6 | 110 | [nums[1], nums[2]] |
| 7 | 111 | [nums[0], nums[1], nums[2]] |

---

### Bit Checking

```python
# Check if element i is included in subset represented by mask
if mask & (1 << i):  # Bit i is set
    subset.append(nums[i])
```

| Operation | Meaning | Example |
|-----------|---------|---------|
| `1 << i` | Create bit mask with only bit i set | `1 << 2` = 4 (100) |
| `mask & (1 << i)` | Check if bit i is set in mask | `5 & 4` = 4 (non-zero = True) |
| `mask.bit_count()` | Count set bits | `5.bit_count()` = 2 |

<!-- back -->
