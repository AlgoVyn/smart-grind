## Array - Product Except Self: Core Concepts

What are the fundamental principles of the product except self pattern?

<!-- front -->

---

### Core Concept

**The product of all elements except `nums[i]` equals:**
- **Left product**: Product of all elements before index `i`
- **Right product**: Product of all elements after index `i`

```
result[i] = (nums[0] × nums[1] × ... × nums[i-1]) × (nums[i+1] × ... × nums[n-1])
          = left_product[i] × right_product[i]
```

**Key insight**: Build these products from both directions and combine.

---

### The Pattern

```
Array: [1, 2, 3, 4]

Prefix products (left to right):
  [1, 1, 2, 6]
   ↑  ↑  ↑  ↑
   1  1  1×2  1×2×3

Suffix products (right to left):
  [24, 12, 4, 1]
    ↑   ↑  ↑  ↑
   2×3×4 3×4  4  1

Result (prefix × suffix):
  [1×24, 1×12, 2×4, 6×1] = [24, 12, 8, 6]
```

---

### Common Applications

| Problem Type | Pattern Use | Example |
|--------------|-------------|---------|
| Product calculation | Core pattern | Product of Array Except Self |
| Array transformation | Left/right passes | Build products from both ends |
| Division constraint | Cannot use division | LeetCode 238 |
| Space optimization | O(1) extra space | Use output array cleverly |

---

### Complexity

| Aspect | Basic | Optimized |
|--------|-------|-------------|
| Time | O(n) | O(n) - 2 passes |
| Space | O(n) for prefix/suffix | O(1) excluding output |

---

### Why No Division?

```
If we could use division:
  total_product = product of all elements
  result[i] = total_product / nums[i]

Problem: Fails when nums[i] = 0!
- If one zero: all results except that position are 0
- If two zeros: all results are 0
- Division by zero error

Prefix/Suffix approach handles zeros naturally.
```

<!-- back -->
