# Count Bits

## Category
Bit Manipulation

## Description
Brian Kernighan's algorithm to count set bits.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- bit manipulation related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## How It Works
Brian Kernighan's algorithm counts the number of set bits (1s) in the binary representation of an integer. This is one of the most efficient bit manipulation techniques.

**Key Concept:** `n & (n - 1)` clears the lowest set bit in one operation.

**Why it works:**
- When we subtract 1 from n, all bits to the right of the rightmost 1 become 1, and that rightmost 1 becomes 0
- For example: n = 12 (1100), n-1 = 11 (1011)
- n & (n-1) = 1000 (clears the lowest set bit)
- Each iteration clears one bit, so we only iterate as many times as there are set bits

**Algorithm:**
1. Initialize `count = 0`
2. While `n > 0`:
   - Perform `n = n & (n - 1)`
   - Increment `count`
3. Return `count`

**DP Approach (for multiple queries):**
- Precompute `count_bits[i]` for all i up to n
- Use relation: `count_bits[i] = count_bits[i >> 1] + (i & 1)`
- This gives O(n) preprocessing and O(1) per query

---

## Implementation

```python
def count_bits(n):
    """
    Count set bits using Brian Kernighan's algorithm
    Time: O(number of set bits)
    Space: O(1)
    
    Args:
        n: Non-negative integer
    
    Returns:
        Number of 1s in binary representation
    """
    count = 0
    while n:
        n = n & (n - 1)  # Clear lowest set bit
        count += 1
    return count


def count_bits_dp(n):
    """
    Count bits for all numbers from 0 to n using DP
    Time: O(n)
    Space: O(n)
    
    Args:
        n: Non-negative integer (inclusive upper bound)
    
    Returns:
        List where result[i] = number of 1s in i
    """
    result = [0] * (n + 1)
    for i in range(1, n + 1):
        # i >> 1 removes LSB, (i & 1) gets LSB
        result[i] = result[i >> 1] + (i & 1)
    return result


# Example usage
if __name__ == "__main__":
    # Single number
    print(f"count_bits(12): {count_bits(12)}")   # Output: 2 (1100)
    print(f"count_bits(7): {count_bits(7)}")     # Output: 3 (111)
    print(f"count_bits(0): {count_bits(0)}")     # Output: 0
    
    # DP approach for range
    print(f"\nDP count_bits(5): {count_bits_dp(5)}")  # Output: [0, 1, 1, 2, 1, 2]
```

```javascript
function countBits() {
    // Count Bits implementation
    // Time: O(number of set bits)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
n = 12
```

**Output:**
```
count_bits(12): 2
count_bits(7): 3
count_bits(0): 0

DP count_bits(5): [0, 1, 1, 2, 1, 2]
```

**Explanation:**
- 12 in binary is 1100 → 2 set bits
- 7 in binary is 111 → 3 set bits
- 0 in binary is 0 → 0 set bits

The DP version returns count for all numbers 0 to n:
- 0→0, 1→1, 2→1, 3→2, 4→1, 5→2

---

## Time Complexity
**O(number of set bits)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
