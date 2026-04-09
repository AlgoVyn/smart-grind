## String - Multiply Strings (Manual Simulation): Core Concepts

What are the fundamental concepts behind manually multiplying string-represented numbers?

<!-- front -->

---

### Problem Definition

Multiply two non-negative integer strings without converting to integers (crucial when numbers exceed 64-bit limits).

**Example:**
```
Input:  num1 = "123", num2 = "456"
Output: "56088"

Manual process:
    123
  × 456
  -----
    738   (123 × 6)
   615    (123 × 5, shifted)
  492     (123 × 4, shifted)
  -----
  56088
```

---

### Key Insight: Position-Based Multiplication

The **"aha!" moment**: When multiplying digit at position `i` (from right) in num1 with digit at position `j` in num2, the result contributes to positions `i+j` and `i+j+1` in the final answer.

```
Position indexing from RIGHT (0-based):

num1 = "123"  →  indices from right: 3→2, 2→1, 1→0
num2 = "45"   →  indices from right: 5→1, 4→0

3 (at num1 pos 2) × 5 (at num2 pos 1) = 15
  → contributes to result positions: 2+1=3 and 2+1+1=4
  → result[4] = 5 (ones), result[3] = 1 (carry)

Visualization:
    1  2  3
      ×  4  5
      -------
         1  5  (3×5)
      1  0     (2×5)
   0  5        (1×5)
   -------
     [positions 0-4]
```

---

### Carry Propagation

Each single-digit multiplication produces at most a two-digit number (9×9=81). We handle this by:
1. **Adding to current position** (includes any previous value)
2. **Storing ones digit** at `result[i+j+1]`
3. **Carrying tens digit** to `result[i+j]`

```
Carry flow visualization:
result array: [carry_pos | current_pos | ...]
                  ↓            ↓
               i+j          i+j+1
                ↑            ↑
             accum      total % 10
```

---

### Result Array Size

The result of multiplying an n-digit number by an m-digit number has at most **n+m digits**.

| num1 digits | num2 digits | Max result digits |
|-------------|-------------|-------------------|
| 1 | 1 | 2 (9×9=81) |
| 2 | 2 | 4 (99×99=9801) |
| 3 | 2 | 5 (999×99=98901) |
| n | m | n+m |

---

### Complexity Analysis

| Aspect | Value | Explanation |
|--------|-------|-------------|
| **Time** | O(n × m) | Nested loops through both strings |
| **Space** | O(n + m) | Result array of size n+m |
| **Input** | Two strings | Non-negative integers as strings |
| **Output** | String | Product as string |

---

### When to Use This Pattern

- **Big integer arithmetic**: Numbers exceed 64-bit integer limits
- **Arbitrary precision math**: Calculator-like functionality
- **String-based numeric operations**: Input/output must remain as strings
- **Large number factorials**: Computing factorials of large numbers
- **Cryptographic applications**: Working with large prime numbers

---

### Common Pitfalls

| Pitfall | Why It Happens | Solution |
|---------|----------------|----------|
| Wrong position calculation | 0-based vs 1-based confusion | Use `i+j+1` for current, `i+j` for carry |
| Integer overflow | Converting entire string to int | Never convert; use digit-by-digit |
| Not handling "0" | Zero inputs edge case | Early return if either input is "0" |
| Leading zeros in output | Result array starts with zeros | Skip initial zeros when converting |
| Character to digit conversion | ASCII math | Always subtract `'0'` (or ord('0')) |

<!-- back -->
