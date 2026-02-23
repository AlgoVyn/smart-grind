# GCD (Euclidean)

## Category
Math & Number Theory

## Description
Euclid's algorithm for greatest common divisor.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- math & number theory related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
Euclidean algorithm (also called Euclidean algorithm) is an efficient method for computing the Greatest Common Divisor (GCD) of two integers. It's one of the oldest and most important algorithms in mathematics, dating back to ancient Greece.

### The Core Principle:
gcd(a, b) = gcd(b, a mod b)

This works because:
- Any common divisor of a and b must also divide a mod b
- If d divides both b and a mod b, then d divides a = (a mod b) + k×b
- So the set of common divisors of (a, b) and (b, a mod b) are identical

### Two Implementations:

**1. Recursive (Classic)**:
- Base case: gcd(a, 0) = a
- Recursive case: gcd(a, b) = gcd(b, a % b)

**2. Iterative (More efficient)**:
- Uses a loop instead of recursion
- Avoids function call overhead
- Uses O(1) space

### Key Properties:
- **Time Complexity**: O(log(min(a, b)))
- **Space Complexity**: O(1) for iterative, O(log(min(a,b))) for recursive
- **Correctness**: Based on the mathematical property that gcd(a,b) = gcd(b, a mod b)
- **Efficiency**: Very fast, even for very large numbers

### Extended Euclidean Algorithm:
- Finds integers x, y such that: ax + by = gcd(a, b)
- Used in modular arithmetic, cryptography (RSA), solving Diophantine equations

---

## Algorithm Steps
1. **Recursive Approach**:
   - Base case: if b == 0, return a
   - Recursive: return gcd(b, a % b)

2. **Iterative Approach**:
   - While b ≠ 0:
     - temp = b
     - b = a % b
     - a = temp
   - Return a

---

## Implementation

```python
def gcd_recursive(a: int, b: int) -> int:
    """
    Calculate GCD using recursive Euclidean algorithm.
    
    Args:
        a, b: Two positive integers
    
    Returns:
        Greatest Common Divisor of a and b
    
    Time: O(log(min(a, b)))
    Space: O(log(min(a, b))) due to recursion stack
    """
    if b == 0:
        return abs(a)
    return gcd_recursive(b, a % b)


def gcd_iterative(a: int, b: int) -> int:
    """
    Calculate GCD using iterative Euclidean algorithm.
    
    Args:
        a, b: Two positive integers
    
    Returns:
        Greatest Common Divisor of a and b
    
    Time: O(log(min(a, b)))
    Space: O(1)
    """
    a = abs(a)
    b = abs(b)
    
    while b != 0:
        a, b = b, a % b
    
    return a


def gcd_steins(a: int, b: int) -> int:
    """
    Stein's algorithm (Binary GCD) - works without division.
    Uses bit operations only.
    
    Time: O(log(min(a, b)))
    Space: O(1)
    """
    a = abs(a)
    b = abs(b)
    
    # Handle zeros
    if a == 0:
        return b
    if b == 0:
        return a
    
    # Count factors of 2
    shift = 0
    while ((a | b) & 1) == 0:
        shift += 1
        a >>= 1
        b >>= 1
    
    # Remove factors of 2 from a
    while (a & 1) == 0:
        a >>= 1
    
    # Main loop
    while b != 0:
        # Remove factors of 2 from b
        while (b & 1) == 0:
            b >>= 1
        
        # Swap and subtract
        if a > b:
            a, b = b, a
        b = b - a
    
    return a << shift


def extended_gcd(a: int, b: int) -> tuple:
    """
    Extended Euclidean Algorithm.
    
    Returns (g, x, y) where:
    - g = gcd(a, b)
    - x, y such that ax + by = g
    
    Used for modular inverse and solving Diophantine equations.
    
    Time: O(log(min(a, b)))
    Space: O(log(min(a, b)))
    """
    if a == 0:
        return b, 0, 1
    
    gcd, x1, y1 = extended_gcd(b % a, a)
    
    x = y1 - (b // a) * x1
    y = x1
    
    return gcd, x, y


def lcm(a: int, b: int) -> int:
    """
    Least Common Multiple using GCD.
    
    lcm(a, b) = |a * b| / gcd(a, b)
    """
    if a == 0 or b == 0:
        return 0
    return abs(a * b) // gcd_iterative(a, b)


def gcd_of_array(numbers: list) -> int:
    """Calculate GCD of an array of numbers."""
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = gcd_iterative(result, num)
        if result == 1:
            return 1
    
    return result


# Example usage
if __name__ == "__main__":
    print("Euclidean Algorithm for GCD")
    print("=" * 40)
    
    # Test cases
    test_cases = [
        (48, 18),
        (18, 48),
        (54, 24),
        (100, 25),
        (17, 13),  # Prime numbers
        (0, 5),    # Zero case
        (7, 7),    # Equal numbers
    ]
    
    print("\nGCD Results:")
    for a, b in test_cases:
        result_rec = gcd_recursive(a, b)
        result_iter = gcd_iterative(a, b)
        result_stein = gcd_steins(a, b)
        print(f"  gcd({a}, {b}) = {result_rec} (recursive)")
        print(f"           = {result_iter} (iterative)")
        print(f"           = {result_stein} (Stein's)")
    
    # Extended GCD
    print("\nExtended GCD:")
    a, b = 35, 15
    g, x, y = extended_gcd(a, b)
    print(f"  {a}*({x}) + {b}*({y}) = {g}")
    
    # LCM
    print("\nLCM:")
    print(f"  lcm(12, 18) = {lcm(12, 18)}")
    print(f"  lcm(7, 5) = {lcm(7, 5)}")
    
    # GCD of array
    print("\nGCD of array:")
    print(f"  gcd([24, 36, 48, 60]) = {gcd_of_array([24, 36, 48, 60])}")

```javascript
function gcdEuclidean() {
    // GCD (Euclidean) implementation
    // Time: O(log(min(a,b)))
    // Space: O(1)
}
```

---

## Example

**Input:**
```
a = 48, b = 18
a = 54, b = 24
a = 100, b = 25
a = 17, b = 13
```

**Output:**
```
GCD Results:
  gcd(48, 18) = 6 (recursive)
  gcd(54, 24) = 6
  gcd(100, 25) = 25
  gcd(17, 13) = 1

Extended GCD:
  35*(-1) + 15*(3) = 5

LCM:
  lcm(12, 18) = 36
  lcm(7, 5) = 35

GCD of array:
  gcd([24, 36, 48, 60]) = 12

Explanation:
- gcd(48, 18): 48 % 18 = 12, 18 % 12 = 6, 12 % 6 = 0 → gcd = 6
- gcd(17, 13): Prime numbers, only 1 divides both → gcd = 1 (coprime)
- Extended GCD: 35*(-1) + 15*3 = -35 + 45 = 10 = gcd(35,15)
```

---

## Time Complexity
**O(log(min(a,b)))**

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
