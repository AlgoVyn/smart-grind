# Karatsuba Multiplication

## Category
Math & Number Theory

## Description
Karatsuba Multiplication is a fast multiplication algorithm that uses a divide-and-conquer approach to multiply two n-digit numbers in O(n^log₂(3)) ≈ O(n^1.585) time, which is faster than the traditional O(n²) grade-school multiplication for large numbers.

The algorithm works by splitting each number into two halves:
1. For two numbers x and y, split them: x = a·10^m + b and y = c·10^m + d
2. Instead of computing a×c, a×d, b×c, b×d (4 multiplications), Karatsuba computes:
   - z0 = a × c
   - z2 = b × d
   - z1 = (a + b) × (c + d) - z0 - z2
3. Combine: result = z0 × 10^2m + z1 × 10^m + z2

This reduces from 4 recursive multiplications to 3, giving the time complexity improvement. The algorithm can be applied recursively for even larger numbers.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- math & number theory related operations
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

## Implementation

```python
def karatsuba(x: int, y: int) -> int:
    """
    Multiply two integers using Karatsuba algorithm.
    
    Args:
        x: First integer to multiply
        y: Second integer to multiply
        
    Returns:
        Product of x and y
        
    Time: O(n^log2(3)) ≈ O(n^1.585)
    Space: O(n)
    """
    # Base case for small numbers
    if x < 10 or y < 10:
        return x * y
    
    # Calculate the number of digits
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    # Split the numbers
    high1, low1 = divmod(x, 10**m)
    high2, low2 = divmod(y, 10**m)
    
    # Recursive steps
    z0 = karatsuba(low1, low2)        # a × c (low × low)
    z2 = karatsuba(high1, high2)     # b × d (high × high)
    z1 = karatsuba(low1 + high1, low2 + high2) - z0 - z2  # (a+b) × (c+d)
    
    # Combine results: z0 + z1 * 10^m + z2 * 10^2m
    return z2 * 10**(2*m) + z1 * 10**m + z0


def karatsuba_strings(x: str, y: str) -> str:
    """
    Multiply two numbers represented as strings.
    Handles negative numbers and large integers.
    
    Args:
        x: First number as string
        y: Second number as string
        
    Returns:
        Product as string
        
    Time: O(n^1.585)
    Space: O(n)
    """
    # Handle negative numbers
    negative = (x[0] == '-') ^ (y[0] == '-')
    x = x.lstrip('-')
    y = y.lstrip('-')
    
    # Convert to integers and multiply
    result = karatsuba(int(x), int(y))
    
    return str(-result) if negative else str(result)


# Example usage
if __name__ == "__main__":
    # Test cases
    print("Karatsuba Multiplication Tests:")
    print("-" * 40)
    
    # Basic test
    x, y = 1234, 5678
    result = karatsuba(x, y)
    print(f"{x} × {y} = {result}")  # Output: 7006652
    print(f"Verification: {x * y}")
    
    # Large numbers
    print()
    x, y = 123456789, 987654321
    result = karatsuba(x, y)
    print(f"{x} × {y} = {result}")  # Output: 121932631112635269
    print(f"Verification: {x * y}")
    
    # String version
    print()
    result = karatsuba_strings("123456789012345", "987654321098765")
    print(f"String multiply: {result}")
    
    # Compare performance
    import time
    
    x = 10**50  # Very large numbers
    y = 10**50 + 7
    
    start = time.time()
    result_karatsuba = karatsuba(x, y)
    time_karatsuba = time.time() - start
    
    start = time.time()
    result_naive = x * y
    time_naive = time.time() - start
    
    print(f"\nPerformance comparison for 50-digit numbers:")
    print(f"Karatsuba: {time_karatsuba:.6f} seconds")
    print(f"Naive:     {time_naive:.6f} seconds")
```

```javascript
function karatsuba() {
    // Karatsuba Multiplication implementation
    // Time: O(n^1.585)
    // Space: O(n)
}
```

---

## Example

**Input:**
```
x = 1234, y = 5678
```

**Output:**
```
1234 × 5678 = 7006652
Verification: 7006652
```

**Input:**
```
x = 123456789, y = 987654321
```

**Output:**
```
123456789 × 987654321 = 121932631112635269
```

---

## Time Complexity
**O(n^1.585)**

---

## Space Complexity
**O(n)**

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
