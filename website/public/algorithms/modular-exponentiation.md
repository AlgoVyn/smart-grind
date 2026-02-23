# Modular Exponentiation

## Category
Math & Number Theory

## Description
Compute (base^exp) % mod efficiently using binary exponentiation.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- math & number theory related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

Modular Exponentiation (also known as Binary Exponentiation or Fast Exponentiation) is an algorithm to compute (base^exp) % mod efficiently. This is essential in cryptography, competitive programming, and many mathematical applications where dealing with large numbers is necessary.

### Why do we need it?
- Direct computation of base^exp can overflow for large values
- Python handles big integers, but the computation time grows linearly with exp
- We need O(log exp) time complexity instead of O(exp)

### How Binary Exponentiation Works:
The key insight is that we can break down the exponent into its binary representation:
- exp = b_k * 2^k + b_{k-1} * 2^{k-1} + ... + b_0 * 2^0
- base^exp = base^{b_k * 2^k} * base^{b_{k-1} * 2^{k-1}} * ... * base^{b_0 * 2^0}

### Algorithm:
1. Initialize result = 1
2. While exp > 0:
   - If exp is odd: multiply result by base
   - Square the base (base = base * base)
   - Halve the exponent (exp = exp // 2)
3. At each step, take mod to keep numbers small

This works because:
- When exp is odd: base^exp = base * base^{exp-1}
- When exp is even: base^exp = (base^2)^{exp/2}

---

## Algorithm Steps
1. Initialize result = 1
2. Convert base to base % mod (optimization)
3. While exponent > 0:
   a. If exponent is odd, multiply result by base and take mod
   b. Square the base and take mod
   c. Divide exponent by 2 (integer division)
4. Return result

---

## Implementation

```python
def modular_exponentiation(base: int, exp: int, mod: int) -> int:
    """
    Compute (base^exp) % mod using binary exponentiation.
    
    Args:
        base: The base number
        exp: The exponent (non-negative integer)
        mod: The modulus (positive integer)
        
    Returns:
        (base^exp) % mod
        
    Time: O(log exp)
    Space: O(1)
    """
    if mod == 1:
        return 0  # Any number mod 1 is 0
    
    result = 1
    base = base % mod  # Handle case where base >= mod
    
    while exp > 0:
        # If exp is odd, multiply result by base
        if exp % 2 == 1:
            result = (result * base) % mod
        
        # Square the base
        base = (base * base) % mod
        
        # Halve the exponent
        exp = exp // 2
    
    return result


def modular_exponentiation_recursive(base: int, exp: int, mod: int) -> int:
    """
    Recursive implementation of modular exponentiation.
    
    Time: O(log exp)
    Space: O(log exp) due to recursion stack
    """
    if mod == 1:
        return 0
    if exp == 0:
        return 1
    if exp % 2 == 0:
        # exp is even: (base^2)^(exp/2)
        temp = modular_exponentiation_recursive(base, exp // 2, mod)
        return (temp * temp) % mod
    else:
        # exp is odd: base * base^(exp-1)
        return (base * modular_exponentiation_recursive(base, exp - 1, mod)) % mod


# Test the implementation
if __name__ == "__main__":
    # Test cases
    print(modular_exponentiation(2, 10, 1000))   # 24
    print(modular_exponentiation(3, 5, 13))      # 9
    print(modular_exponentiation(7, 0, 13))      # 1
    print(modular_exponentiation(2, 100, 1000000007))  # Large number computation
    print(modular_exponentiation(5, 1000, 1000000007)) # Another large exponent test

```javascript
function modularExponentiation() {
    // Modular Exponentiation implementation
    // Time: O(log exp)
    // Space: O(1)
}
```

---

## Example

**Input:**
```python
# Compute 2^10 mod 1000
base = 2
exp = 10
mod = 1000

result = modular_exponentiation(base, exp, mod)
print(f"{base}^{exp} mod {mod} = {result}")
```

**Output:**
```
2^10 mod 1000 = 24
```

**Step-by-step execution:**
| Step | base | exp | result | Action |
|------|------|-----|--------|--------|
| 1 | 2 | 10 | 1 | exp even, square base |
| 2 | 4 | 5 | 1 | exp odd, result = 1*4 = 4 |
| 3 | 16 | 2 | 4 | exp even, square base |
| 4 | 256 | 1 | 4 | exp odd, result = 4*256 = 1024 mod 1000 = 24 |
| 5 | 65536 | 0 | 24 | exp = 0, exit |

**Another example:**
```python
# Compute 3^5 mod 13
print(modular_exponentiation(3, 5, 13))  # Output: 9
```

Verification: 3^5 = 243, 243 mod 13 = 9 ✓

---

## Time Complexity
**O(log exp)**

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
